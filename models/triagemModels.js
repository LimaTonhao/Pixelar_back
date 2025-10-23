const pool = require("../conexao");

// Criar triagem
const criarTriagem = async ({ id_candidatura, pontuacao, resultado }) => {
  const query = `
    INSERT INTO triagem (id_candidatura, pontuacao, resultado)
    VALUES ($1, $2, $3)
    RETURNING *;
  `;
  const values = [id_candidatura, pontuacao, resultado];
  const { rows } = await pool.query(query, values);

  // Atualiza o status da candidatura
  await pool.query(
    `UPDATE candidatura
     SET status_candidatura = $1
     WHERE id_candidatura = $2`,
    [resultado, id_candidatura]
  );

  return rows[0];
};

// Atualizar triagem
const atualizarTriagem = async (id_triagem, { pontuacao, resultado }) => {
  const query = `
    UPDATE triagem
    SET pontuacao = $1, resultado = $2
    WHERE id_triagem = $3
    RETURNING *;
  `;
  const values = [pontuacao, resultado, id_triagem];
  const { rows } = await pool.query(query, values);

  const triagem = rows[0];

  // Atualiza o status da candidatura
  await pool.query(
    `UPDATE candidatura
     SET status_candidatura = $1
     WHERE id_candidatura = $2`,
    [resultado, triagem.id_candidatura]
  );

  return triagem;
};

// Listar todas as triagens
const listarTriagens = async () => {
  const query = "SELECT * FROM triagem";
  const { rows } = await pool.query(query);
  return rows;
};

// Listar triagem por ID
const listarPorId = async (id_triagem) => {
  const query = "SELECT * FROM triagem WHERE id_triagem = $1";
  const { rows } = await pool.query(query, [id_triagem]);
  return rows[0];
};

// Listar triagens por candidatura
const listarPorCandidatura = async (id_candidatura) => {
  const query = "SELECT * FROM triagem WHERE id_candidatura = $1";
  const { rows } = await pool.query(query, [id_candidatura]);
  return rows;
};

// Deletar triagem
const deletarTriagem = async (id_triagem) => {
  const query = "DELETE FROM triagem WHERE id_triagem = $1 RETURNING *";
  const { rows } = await pool.query(query, [id_triagem]);
  return rows[0];
};

// Dashboard gamificado
const dashboardGamificado = async () => {
  const query = `
    SELECT c.id_candidatura, c.id_vaga, t.pontuacao, t.resultado,
           ROW_NUMBER() OVER(PARTITION BY c.id_vaga ORDER BY t.pontuacao DESC) as ranking
    FROM triagem t
    JOIN candidatura c ON t.id_candidatura = c.id_candidatura
  `;
  const { rows } = await pool.query(query);
  return rows;
};

module.exports = {
  criarTriagem,
  listarTriagens,
  listarPorId,
  listarPorCandidatura,
  atualizarTriagem,
  deletarTriagem,
  dashboardGamificado,
};