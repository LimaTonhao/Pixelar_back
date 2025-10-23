const curriculoModel = require("../models/curriculoModels");

// Criar Currículo
const criarCurriculo = async (req, res) => {
  const {
    id_usuario,
    data_nascimento,
    experiencia,
    formacao,
    habilidades,
    cursos_complementares,
    redes_sociais,
  } = req.body;

  try {
    const novoCurriculo = await curriculoModel.criarCurriculo({
      id_usuario,
      data_nascimento,
      experiencia,
      formacao,
      habilidades,
      cursos_complementares,
      redes_sociais,
    });

    res.status(201).json(novoCurriculo);
  } catch (error) {
    res.status(500).json({
      erro: "Erro ao criar currículo",
      detalhe: error.message,
    });
  }
};

// Listar todos os currículos
const listarCurriculos = async (req, res) => {
  try {
    const curriculos = await curriculoModel.listarCurriculos();
    res.json(curriculos);
  } catch (error) {
    res.status(500).json({
      erro: "Erro ao listar currículos",
      detalhe: error.message,
    });
  }
};

// Buscar currículo por ID
const buscarCurriculoPorId = async (req, res) => {
  const { id } = req.params;

  try {
    const curriculo = await curriculoModel.buscarPorId(id);

    if (!curriculo) {
      return res.status(404).json({ erro: "Currículo não encontrado" });
    }

    res.json(curriculo);
  } catch (error) {
    res.status(500).json({
      erro: "Erro ao buscar currículo por ID",
      detalhe: error.message,
    });
  }
};
const buscarPorUsuario = async (req, res) => {
  const id_usuario = req.params.id; // pegar o ID do usuário
  try {
    const resultado = await curriculoModel.buscarPorUsuario(id_usuario);
    if (!resultado) {
      return res.status(404).json({ erro: "Currículo não encontrado" });
    }
    res.status(200).json(resultado);
  } catch (error) {
    res.status(500).json({
      erro: "Erro ao buscar currículo por usuário",
      detalhe: error.message,
    });
  }
};
// Atualizar currículo
const atualizarCurriculo = async (req, res) => {
  const { id } = req.params;
  const {
    data_nascimento,
    experiencia,
    formacao,
    habilidades,
    cursos_complementares,
    redes_sociais,
  } = req.body;

  try {
    const curriculoAtualizado = await curriculoModel.atualizarCurriculo(id, {
      data_nascimento,
      experiencia,
      formacao,
      habilidades,
      cursos_complementares,
      redes_sociais,
    });

    res.json(curriculoAtualizado);
  } catch (error) {
    res.status(500).json({
      erro: "Erro ao atualizar currículo",
      detalhe: error.message,
    });
  }
};

// Deletar currículo
const deletarCurriculo = async (req, res) => {
  const { id } = req.params;

  try {
    await curriculoModel.deletarCurriculo(id);
    res.json({ mensagem: "Currículo deletado com sucesso" });
  } catch (error) {
    res.status(500).json({
      erro: "Erro ao deletar currículo",
      detalhe: error.message,
    });
  }
};

module.exports = {
  criarCurriculo,
  listarCurriculos,
  buscarCurriculoPorId,
  atualizarCurriculo,
  deletarCurriculo,
  buscarPorUsuario,
};