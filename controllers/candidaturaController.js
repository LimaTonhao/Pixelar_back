const candidaturaModel = require("../models/candidaturaModels");

// Criar
const criar = async (req, res) => {
  const { id_vaga, id_curriculo } = req.body;

  try {
    const nova = await candidaturaModel.criarCandidatura(id_vaga, id_curriculo);
    res.status(201).json(nova);
  } catch (error) {
    res
      .status(500)
      .json({ erro: "Erro ao criar candidatura", detalhe: error.message });
  }
};

// Listar todas
const listar = async (req, res) => {
  try {
    const candidaturas = await candidaturaModel.listarCandidaturas();
    res.json(candidaturas);
  } catch (error) {
    console.error("Erro detalhado:", error);
    res
      .status(500)
      .json({ erro: "Erro ao buscar candidaturas", detalhe: error.message });
  }
};

// Buscar por ID
const buscarPorId = async (req, res) => {
  const { id } = req.params;

  try {
    const candidatura = await candidaturaModel.buscarCandidaturaPorId(id);
    if (!candidatura) {
      return res.status(404).json({ erro: "Candidatura não encontrada" });
    }
    res.json(candidatura);
  } catch (error) {
    res
      .status(500)
      .json({ erro: "Erro ao buscar candidatura", detalhe: error.message });
  }
};

// Atualizar status
const atualizar = async (req, res) => {
  const { id } = req.params;
  const { status_candidatura } = req.body;

  try {
    const candidatura = await candidaturaModel.atualizarStatus(
      id,
      status_candidatura
    );
    if (!candidatura) {
      return res.status(404).json({ erro: "Candidatura não encontrada" });
    }
    res.json(candidatura);
  } catch (error) {
    res
      .status(500)
      .json({ erro: "Erro ao atualizar status", detalhe: error.message });
  }
};

// Deletar
const deletar = async (req, res) => {
  const { id } = req.params;

  try {
    const msg = await candidaturaModel.deletarCandidatura(id);
    res.json(msg);
  } catch (error) {
    res
      .status(500)
      .json({ erro: "Erro ao deletar candidatura", detalhe: error.message });
  }
};

module.exports = {
  criar,
  listar,
  buscarPorId,
  atualizar,
  deletar,
};