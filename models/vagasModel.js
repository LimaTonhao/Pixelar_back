const conexao = require("../conexao");

const criarVaga = async (
  id_usuario,
  titulo,
  descricao,
  requisitos,
  setor,
  salario
) => {
  const query =
    "INSERT INTO vaga (id_usuario, titulo, descricao, requisitos, setor, salario) values ($1, $2, $3, $4, $5, $6) RETURNING *";

  const valores = [id_usuario, titulo, descricao, requisitos, setor, salario];

  const { rows } = await conexao.query(query, valores);
  return rows[0];
};

const listarTodas = async () => {
  const query = "SELECT * from vaga";
  const { rows } = await conexao.query(query);
  return rows;
};

const deletarVaga = async (id) => {
  const query = "DELETE from vaga WHERE id_vaga = $1";
  const { rows } = await conexao.query(query, [id]);
  return rows[0];
};

const listarPorId = async (id) => {
  const query = "SELECT * from vaga WHERE id_vaga = $1";
  const { rows } = await conexao.query(query, [id]);
  return rows;
};
const listarPorIdUsuario = async (id) => {
  const query = "SELECT * from vaga WHERE id_usuario = $1";
  const { rows } = await conexao.query(query, [id]);
  return rows;
};

const atualizarVaga = async (id, dados) => {
  let { titulo, descricao, requisitos, setor, salario } = dados;

  const query = `
    UPDATE vaga
    SET titulo = $1, descricao = $2, requisitos = $3, setor = $4, salario = $5
    WHERE id_vaga = $6
    RETURNING *
  `;

  const { rows } = await conexao.query(query, [
    titulo,
    descricao,
    requisitos,
    setor,
    salario,
    id,
  ]);

  return rows[0];
};

module.exports = {
  criarVaga,
  listarTodas,
  deletarVaga,
  listarPorId,
  atualizarVaga,
  listarPorIdUsuario,
};