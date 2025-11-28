const curriculoModel = require("../models/curriculoModels");
const { put, del } = require("@vercel/blob");

const uploadBase64ToStorage = async (dataUrl) => {
  console.log(dataUrl);

  if (!dataUrl || !dataUrl.startsWith("data:")) {
    console.log("entrou no erro");
    throw new Error("Formato de Base64 inválido.");
  }

  const parts = dataUrl.split(";base64,");

  if (parts.length !== 2) {
    throw new Error("Base64 malformado.");
  }
  const mimeType = parts[0].split(":")[1];
  const base64Data = parts[1];

  const fileBuffer = Buffer.from(base64Data, "base64");

  // Nomes de variáveis
  const extensaoMapeada = {
    "image/png": "png",
    "image/jpeg": "jpg",
    "application/pdf": "pdf",
    "image/svg+xml": "svg",
  };
  const extensao = extensaoMapeada[mimeType] || "bin";

  // Gera nome de arquivo único (chave única no Vercel Blob)
  const NomeArquivo = `${Date.now()}-${Math.random()
    .toString(36)
    .substring(2, 9)}.${extensao}`;

  // Salva no Vercel Blob
  const resultado = await put(NomeArquivo, fileBuffer, {
    access: "public", // Permite acesso público via URL
    contentType: mimeType, // Define o tipo de conteúdo
  });

  // Retorna a URL pública gerada pelo Vercel Blob
  return resultado.url;
};
// Criar Currículo
const criarCurriculo = async (req, res) => {
  const { id_usuario, arquivo_curriculo } = req.body;
  let pdfUrl;
  pdfUrl = await uploadBase64ToStorage(arquivo_curriculo);
  console.log(pdfUrl);

  try {
    const novoCurriculo = await curriculoModel.criarCurriculo({
      id_usuario,
      pdfUrl,
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
const atualizarCurriculo = async (req, res) => {
  const id_curriculo = req.params.id; // <-- agora com o nome correto
  const { arquivo_curriculo } = req.body;

  try {
    const pdfUrl = await uploadBase64ToStorage(arquivo_curriculo);

    const curriculoAtualizado = await curriculoModel.atualizarCurriculo({
      id_curriculo,
      pdfUrl
    });

    return res.json(curriculoAtualizado);

  } catch (error) {
    return res.status(500).json({
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