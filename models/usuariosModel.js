const conexao = require("../conexao");
const bcrypt = require("bcrypt");

const criarUsuario = async (nome, email, cpf_cnpj, senhaHash) => {
    const query = "INSERT INTO usuario (nome, email, cpf_cnpj, senha) values ($1, $2, $3, $4) RETURNING *";

    const valores = [nome, email, cpf_cnpj, senhaHash]

    const { rows } = await conexao.query(query, valores)
    return rows[0]
}

const buscarUsuarioPorEmail = async (email) => {
  const query = "SELECT * FROM usuario WHERE email = $1";
  const { rows } = await conexao.query(query, [email]);
  return rows[0];
};

const listarTodosUsuarios = async () => {
  try {
    const query = "SELECT * from usuario"
    const { rows } = await conexao.query(query);
  
    return rows;
} catch (erro) {
    console.error("Erro na consulta ao banco de dados:", erro);
    // Envie uma resposta de erro ao navegador
    res.status(500).json({ mensagem: "Erro interno do servidor" }); 
}
}

const buscarUsuarioPorId = async (id) => {
  const query = "SELECT * FROM usuario WHERE id_usuario = $1";
  const { rows } = await conexao.query(query, [id]);
  return rows[0];
};

const atualizarUsuario = async (id, dados) => {
  let { nome, email, cpf_cnpj, senha } = dados;

  const query = `
    UPDATE usuario
    SET nome = $1, email = $2, cpf_cnpj = $3, senha = $4
    WHERE id_usuario = $5
    RETURNING *
  `;

  const { rows } = await conexao.query(query, [
    nome,
    email,
    cpf_cnpj,
    senha,
    id,
  ]);

  return rows[0];
};



// const atualizarUsuario = async (id)

const excluirUsuario = async (id) => {
  const query = "DELETE from usuario WHERE id_usuario = $1"
  const { rows } = await conexao.query(query, [id]);
  return rows[0];
}

const colocarImagem = async (id, imagemFinal) => {
  const query = `UPDATE usuario SET imagem_url = $1 WHERE id_usuario = $2 RETURNING *`;
  const { rows } = await conexao.query(query, [imagemFinal, id]);
  return await rows[0];
}


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
  colocarImagem
};
