const pool = require("../conexao");

// Criar nova candidatura
const criarCandidatura = async (id_vaga, id_curriculo, id_usuario) => {
  const result = await pool.query(
    `INSERT INTO candidatura (id_vaga, id_curriculo, id_usuario) 
     VALUES ($1, $2, $3) RETURNING *`,
    [id_vaga, id_curriculo, id_usuario]
  );
  return result.rows[0];
};
// Listar todas candidaturas

const listarCandidaturas = async () => {
  const result = await pool.query(`
    SELECT 
      c.id_candidatura,
      c.id_vaga,
      c.data_candidatura AS data,
      c.status_candidatura AS status,
      u.id_usuario,
      u.nome,
      v.titulo AS vagaTitulo,
      c.pontuacao
    FROM candidatura c
    JOIN curriculo cr ON c.id_curriculo = cr.id_curriculo
    JOIN usuario u ON cr.id_usuario = u.id_usuario
    JOIN vaga v ON c.id_vaga = v.id_vaga
  `);

  return result.rows;
};

const buscarCandidaturaPorUsuario = async (id_usuario) => {
  const result = await pool.query(
    `SELECT * FROM candidatura WHERE id_usuario = $1`,
    [id_usuario]
  );
  return result.rows[0];
};

const buscarCandidaturaPorVaga = async (id_vaga) => {
  const result = await pool.query(
    `SELECT * FROM candidatura WHERE id_vaga = $1
    `,
    [id_vaga]
  );

  return result.rows;
};

// Atualizar status
const atualizar = async (id, status, pontuacao) => {
  const result = await pool.query(
    `UPDATE candidatura 
     SET status_candidatura = $1,
         pontuacao = $2
     WHERE id_candidatura = $3 
     RETURNING *`,
    [status, pontuacao, id]
  );
  return result.rows[0];
};

// Deletar candidatura
const deletarCandidatura = async (id) => {
  await pool.query(`DELETE FROM candidatura WHERE id_candidatura = $1`, [id]);
  return { mensagem: "Candidatura removida com sucesso" };
};

module.exports = {
  criarCandidatura,
  listarCandidaturas,
  atualizar,
  deletarCandidatura,
  buscarCandidaturaPorUsuario,
  buscarCandidaturaPorVaga,
};