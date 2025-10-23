const pool = require("../conexao");

// Criar currículo
const criarCurriculo = async ({
  id_usuario,
  data_nascimento,
  experiencia,
  formacao,
  habilidades,
  cursos_complementares,
  redes_sociais,
}) => {
  const query = `
    INSERT INTO curriculo (
      id_usuario,
      data_nascimento,
      experiencia,
      formacao,
      habilidades,
      cursos_complementares,
      redes_sociais
    )
    VALUES ($1, $2, $3, $4, $5, $6, $7)
    RETURNING *;
  `;

  const values = [
    id_usuario,
    data_nascimento,
    experiencia,
    formacao,
    habilidades,
    cursos_complementares,
    redes_sociais,
  ];

  const result = await pool.query(query, values);
  return result.rows[0];
};

// Listar todos os currículos
const listarCurriculos = async () => {
  const result = await pool.query("SELECT * FROM curriculo");
  return result.rows;
};

// Buscar currículo por ID
const buscarPorId = async (id_curriculo) => {
  const result = await pool.query(
    "SELECT * FROM curriculo WHERE id_curriculo = $1",
    [id_curriculo]
  );
  return result.rows[0];
};
const buscarPorUsuario = async (id_usuario) => {
  const result = await pool.query(
    `SELECT * FROM curriculo WHERE id_usuario = $1`,
    [id_usuario]
  );
  return result.rows[0];
};

// Atualizar currículo
const atualizarCurriculo = async (
  id_curriculo,
  {
    data_nascimento,
    experiencia,
    formacao,
    habilidades,
    cursos_complementares,
    redes_sociais,
  }
) => {
  const query = `
    UPDATE curriculo
    SET
      data_nascimento = $2,
      experiencia = $3,
      formacao = $4,
      habilidades = $5,
      cursos_complementares = $6,
      redes_sociais = $7
    WHERE id_curriculo = $1
    RETURNING *;
  `;

  const values = [
    id_curriculo,
    data_nascimento,
    experiencia,
    formacao,
    habilidades,
    cursos_complementares,
    redes_sociais,
  ];

  const result = await pool.query(query, values);
  return result.rows[0];
};

// Deletar currículo
const deletarCurriculo = async (id) => {
  await pool.query("DELETE FROM curriculo WHERE id_curriculo = $1", [id]);
};

module.exports = {
  criarCurriculo,
  listarCurriculos,
  buscarPorId,
  atualizarCurriculo,
  deletarCurriculo,
  buscarPorUsuario,
};