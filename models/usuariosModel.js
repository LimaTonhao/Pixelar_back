const conexao = require("../conexao");
const bcrypt = require("bcrypt");

const atualizarDescricaoPerfil = async (id, descricao_perfil) => {
  const query = `
    UPDATE usuario
    SET descricao_perfil = $1
    WHERE id_usuario = $2
    RETURNING *;
  `;
  const values = [descricao_perfil, id];

  const { rows } = await conexao.query(query, values);
  return rows[0];
};

const criarUsuario = async (nome, email, cpf_cnpj, senha, cargo, ImageUrl) => {
  const query = `
    INSERT INTO usuario (nome, email, cpf_cnpj, senha, cargo, foto)
    VALUES ($1, $2, $3, $4, $5, $6)
    RETURNING *;
  `;
  const { rows } = await conexao.query(query, [
    nome,
    email,
    cpf_cnpj,
    senha,
    cargo,
    ImageUrl,
  ]);
  return rows[0];
};

const buscarUsuarioPorEmail = async (email) => {
  const query = "SELECT * FROM usuario WHERE email = $1";
  const { rows } = await conexao.query(query, [email]);
  return rows[0];
};

const listarTodosUsuarios = async () => {
  const query = "SELECT * from usuario";
  const { rows } = await conexao.query(query);
  return rows;
};

const buscarUsuarioPorId = async (id) => {
  const query = "SELECT * FROM usuario WHERE id_usuario = $1";
  const { rows } = await conexao.query(query, [id]);
  return rows[0];
};
const buscarDescricaoPorId = async (id) => {
  const query = `
    SELECT descricao_perfil
    FROM usuario
    WHERE id_usuario = $1
  `;
  const { rows } = await conexao.query(query, [id]);
  return rows[0]; // retorna { descricao_perfil: "..." }
};

const atualizarUsuario = async (id, dados) => {
  const { nome, email, cpf_cnpj, cargo, senha, foto } = dados;

  const query = `
    UPDATE usuario
    SET nome = $1, email = $2, cpf_cnpj = $3, cargo = $4, senha = $5, foto = $6
    WHERE id_usuario = $7
    RETURNING *
  `;

  const values = [nome, email, cpf_cnpj, cargo, senha, foto, id];

  const { rows } = await conexao.query(query, values);
  return rows[0];
};

const excluirUsuario = async (id) => {
  const query = "DELETE from usuario WHERE id_usuario = $1";
  const { rows } = await conexao.query(query, [id]);
  return rows[0];
};

const gerarSenhaHash = async (senha) => {
  console.log(bcrypt.hash(senha, 10));
  return bcrypt.hash(senha, 10);
};

const compararSenhas = async (senha, senhaHash) => {
  return bcrypt.compare(senha, senhaHash);
};

module.exports = {
  criarUsuario,
  buscarUsuarioPorEmail,
  listarTodosUsuarios,
  buscarUsuarioPorId,
  atualizarUsuario,
  excluirUsuario,
  gerarSenhaHash,
  compararSenhas,
  atualizarDescricaoPerfil,
  buscarDescricaoPorId,
};