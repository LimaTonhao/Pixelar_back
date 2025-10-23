const vagasModel = require("../models/vagasModel");
const conexao = require("../conexao");

const criarVaga = async (req, res) => {
  const { id_usuario, titulo, descricao, requisitos, setor, salario } =
    req.body;

  try {
    const userCheck = await conexao.query(
      "SELECT tipo_usuario FROM usuario WHERE id_usuario = $1",
      [id_usuario]
    );

    if (userCheck.rows.length === 0) {
      return res.status(404).json({ erro: "Usuário não encontrado" });
    }

    if (userCheck.rows[0].tipo_usuario !== "avaliador") {
      return res
        .status(403)
        .json({ erro: "Apenas avaliadores podem criar vagas" });
    }

    const vaga = await vagasModel.criarVaga(
      id_usuario,
      titulo,
      descricao,
      requisitos,
      setor,
      salario
    );

    res.status(201).json(vaga);
  } catch (error) {
    console.error(error);

    res
      .status(500)
      .json({ erro: "Erro ao criar vaga", detalhe: error.message });
  }
};

const listarTodas = async (req, res) => {
  try {
    const vaga = await vagasModel.listarTodas();

    res.status(201).json(vaga);
  } catch (error) {
    res.status(500).json({
      erro: "Erro ao buscar vagas",
      detalhe: error.message,
    });
  }
};

const deletarVaga = async (req, res) => {
  try {
    const { id } = req.params;

    const exclusao = await vagasModel.deletarVaga(id);

    res.status(201).json(
      {
        mensagem: `Vaga ${id} excluída com sucesso!`,
      },
      exclusao
    );
    res.status(201).json(exclusao);
  } catch (error) {
    res.status(500).json({
      erro: `Erro ao excluir vaga ${id}`,
      detalhe: error.message,
    });
  }
};

const listarPorId = async (req, res) => {
  const { id } = req.params;

  try {
    const vagas = await vagasModel.listarPorId(id);

    res.status(201).json(vagas);
  } catch (error) {
    res.status(500).json({
      erro: `Erro ao buscar vaga ${id}`,
      detalhe: error.message,
    });
  }
};
const listarPorIdUsuario = async (req, res) => {
  const { id } = req.params;

  try {
    const vagas = await vagasModel.listarPorIdUsuario(id);

    res.status(201).json(vagas);
  } catch (error) {
    res.status(500).json({
      erro: `Erro ao buscar vaga ${id}`,
      detalhe: error.message,
    });
  }
};

const atualizarVaga = async (req, res) => {
  const { id } = req.params;

  try {
    const { titulo, descricao, requisitos, setor, salario } = req.body;

    const vagas = await vagasModel.atualizarVaga(id, {
      titulo,
      descricao,
      requisitos,
      setor,
      salario,
    });

    if (!vagas) {
      return res.status(404).json({ mensagem: "Vaga não encontrada." });
    }

    return res.status(200).json(vagas);
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ mensagem: "Erro interno do servidor.", detalhe: error.message });
  }
};

module.exports = {
  criarVaga,
  listarTodas,
  deletarVaga,
  listarPorId,
  atualizarVaga,
  listarPorIdUsuario,
};