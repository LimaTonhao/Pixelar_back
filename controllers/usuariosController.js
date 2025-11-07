const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
const conexao = require("../conexao");
const { put, del } = require("@vercel/blob");

const usuarioModel = require("../models/usuariosModel");

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

const cadastrarUsuario = async (req, res) => {
  const { nome, email, cpf_cnpj, senha, cargo, foto } = req.body;
  console.log("cadastro usuario");
  let ImageUrl;
  console.log(nome);
  console.log(foto);
  ImageUrl = await uploadBase64ToStorage(foto);
  console.log(ImageUrl);

  try {
    const senhaHash = await usuarioModel.gerarSenhaHash(senha);
    const usuario = await usuarioModel.criarUsuario(
      nome,
      email,
      cpf_cnpj,
      senhaHash,
      cargo,
      ImageUrl
    );
    res.status(201).json(usuario);
  } catch (error) {
    res
      .status(500)
      .json({ erro: "Erro ao registrar usuário", detalhe: error.message });
  }
};

const loginUsuario = async (req, res) => {
  const { email, senha } = req.body;

  try {
    const usuario = await usuarioModel.buscarUsuarioPorEmail(email);
    if (!usuario) {
      return res.status(401).json({ erro: "Usuário não encontrado" });
    }

    const senhaValida = await usuarioModel.compararSenhas(senha, usuario.senha);

    if (!senhaValida) {
      return res.status(401).json({ erro: "Senha inválida" });
    }

    const token = jwt.sign(
      {
        id: usuario.id_usuario,
        tipo_usuario: usuario.tipo_usuario,
      },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN }
    );

    res.json({
      mensagem: "Login realizado com sucesso",
      token,
      usuario: {
        id: usuario.id_usuario,
        nome: usuario.nome,
        email: usuario.email,
        tipo_usuario: usuario.tipo_usuario,
      },
    });
  } catch (error) {
    res
      .status(500)
      .json({ erro: "Erro ao buscar usuário", detalhe: error.message });
  }
};

const listarTodosUsuarios = async (req, res) => {
  try {
    const usuario = await usuarioModel.listarTodosUsuarios();

    res.status(201).json(usuario);
  } catch (error) {
    res.status(500).json({
      erro: "Erro ao buscar usuários",
      detalhe: error.message,
    });
  }
};

const buscarUsuarioPorId = async (req, res) => {
  try {
    const { id } = req.params;

    const usuario = await usuarioModel.buscarUsuarioPorId(id);

    res.status(201).json(usuario);
  } catch (error) {
    res.status(500).json({
      erro: `Erro ao buscar usuário ${id}`,
      detalhe: error.message,
    });
  }
};

// const atualizarUsuario = async (req, res) => {
//   try {
//     const { id } = req.params
//     const { nome, email, cpf_cnpj, senha } = req.body;

//     const atualizar = await usuarioModel.atualizarUsuario(id)
//   }
// }

const atualizarUsuario = async (req, res) => {
  try {
    const { id } = req.params;
    const { nome, email, cpf_cnpj, cargo, senha, foto } = req.body;

    const usuarioExiste = await usuarioModel.buscarUsuarioPorId(id);
    if (!usuarioExiste) {
      return res.status(404).json({ mensagem: "Usuário não encontrado." });
    }

    let senhaHash = usuarioExiste.senha;
    if (senha) {
      senhaHash = await usuarioModel.gerarSenhaHash(senha);
    }
    let ImageUrl = usuarioExiste.foto;

    if (foto && foto.startsWith("data:")) {
      ImageUrl = await uploadBase64ToStorage(foto);
    }

    const dadosAtualizados = {
      nome,
      email,
      cpf_cnpj,
      cargo,
      senha: senhaHash,
      foto: ImageUrl,
    };

    const usuarioAtualizado = await usuarioModel.atualizarUsuario(
      id,
      dadosAtualizados
    );

    return res.status(200).json(usuarioAtualizado);
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      mensagem: "Erro interno do servidor.",
      detalhe: error.message,
    });
  }
};

const excluirUsuario = async (req, res) => {
  try {
    const { id } = req.params;

    const exclusao = await usuarioModel.excluirUsuario(id);

    res.status(201).json(
      {
        mensagem: `Usuário ${id} excluído com sucesso!`,
      },
      exclusao
    );
    res.status(201).json(exclusao);
  } catch (error) {
    res.status(500).json({
      erro: `Erro ao excluir usuário ${id}`,
      detalhe: error.message,
    });
  }
};
const atualizarDescricaoPerfil = async (req, res) => {
  try {
    const { id } = req.params;
    const { descricao_perfil } = req.body;

    if (!descricao_perfil) {
      return res
        .status(400)
        .json({ mensagem: "A descrição do perfil não pode estar vazia." });
    }

    const usuario = await usuarioModel.buscarUsuarioPorId(id);

    if (!usuario) {
      return res.status(404).json({ mensagem: "Usuário não encontrado." });
    }

    const usuarioAtualizado = await usuarioModel.atualizarDescricaoPerfil(
      id,
      descricao_perfil
    );

    res.status(200).json({
      mensagem: "Descrição do perfil atualizada com sucesso!",
      usuario: usuarioAtualizado,
    });
  } catch (error) {

    res.status(500).json({
      erro: "Erro ao atualizar descrição do perfil",
      detalhe: error.message,
    });
  }
};

const buscarDescricaoPorId = async (req, res) => {
  const { id } = req.params;
  try {
    const query = "SELECT descricao_perfil FROM usuario WHERE id_usuario = $1";
    const resultado = await conexao.query(query, [id]);
    const rows = resultado.rows;

    if (rows.length === 0) {
      return res.status(404).json({ erro: "Usuário não encontrado" });
    }

    const descricaoLimpa = rows[0].descricao_perfil
      ? rows[0].descricao_perfil.replace(/\n/g, " ")
      : "";

    res.json({ descricao_perfil: descricaoLimpa });
  } catch (error) {
    res.status(500).json({
      erro: "Erro ao buscar descrição do perfil",
      detalhe: error.message,
    });
  }
};

module.exports = {
  cadastrarUsuario,
  loginUsuario,
  listarTodosUsuarios,
  buscarUsuarioPorId,
  atualizarUsuario,
  excluirUsuario,
  atualizarDescricaoPerfil,
  buscarDescricaoPorId,
};