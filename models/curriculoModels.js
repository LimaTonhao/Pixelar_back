const pool = require("../conexao");

// Criar currículo
const criarCurriculo = async ({ id_usuario, pdfUrl }) => {
  const query = `
    INSERT INTO curriculo (
      id_usuario,
      arquivo_curriculo
    )
    VALUES ($1, $2)
    RETURNING *;
  `;

  const values = [id_usuario, pdfUrl];

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
    `SELECT * FROM curriculo WHERE id_usuario = $1 ORDER BY id_curriculo DESC LIMIT 1`,
    [id_usuario]
  );
  return result.rows[0];
};

const atualizarCurriculo = async ({ id_curriculo, pdfUrl }) => {
  const query = `
    UPDATE curriculo
    SET arquivo_curriculo = $2
    WHERE id_curriculo = $1
    RETURNING *;
  `;

  const values = [id_curriculo, pdfUrl];

  console.log("Valores para atualização:", values);

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