const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken")

const usuarioModel = require("../models/usuariosModel");

const cadastrarUsuario = async (req, res) => {
  const { nome, email, cpf_cnpj, senha } = req.body;

  try {
    const senhaHash = await usuarioModel.gerarSenhaHash(senha);
    const usuario = await usuarioModel.criarUsuario(nome, email, cpf_cnpj, senhaHash);
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
  console.log("lsitaTodos");
  const usuario = await usuarioModel.listarTodosUsuarios()
  console.log("lsitaTodos 2");
  res.status(201).json(usuario);
  } catch (error) {
    res.status(500).json({
      erro: "Erro ao buscar usuários",
      detalhe: error.message,
    });
  }
}

const buscarUsuarioPorId = async (req, res) => {
  try {
    const { id } = req.params

    const usuario = await usuarioModel.buscarUsuarioPorId(id)
    
    res.status(201).json(usuario) 
  } catch (error) {
    res.status(500).json({
      erro: `Erro ao buscar usuário ${id}`,
      detalhe: error.message,
    });
  }
}

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
    const { nome, email, cpf_cnpj, senha } = req.body;

    const usuarioExiste = await usuarioModel.buscarUsuarioPorId(id);
    if (!usuarioExiste) {
      return res.status(404).json({ mensagem: "Usuário não encontrado." });
    }

    let senhaHash = usuarioExiste.senha;

    if (senha) {
      senhaHash = await usuarioModel.gerarSenhaHash(senha);
    }

    const dadosAtualizados = {
      nome,
      email,
      cpf_cnpj,
      senha: senhaHash,
    };

    const usuarioAtualizado = await usuarioModel.atualizarUsuario(id, dadosAtualizados);

    return res.status(200).json(usuarioAtualizado);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ mensagem: "Erro interno do servidor.", detalhe: error.message });
  }
};


const excluirUsuario = async (req, res) => {
  try {
    const { id } = req.params

    const exclusao = await usuarioModel.excluirUsuario(id)

    res.status(201).json({
      mensagem: `Usuário ${id} excluído com sucesso!`
    }, exclusao)
    res.status(201).json(exclusao)
  } catch (error) {
    res.status(500).json({
      erro: `Erro ao excluir usuário ${id}`,
      detalhe: error.message,
    })
  }
}

const colocarImagem = async (req, res) => {
  const { id } = req.params
  const { imagem } = req.body
  
  try {
    const imagemFinal = await uploadBase64ToStorage(imagem)

    const imagemColocada = await usuarioModel.colocarImagem(id ,imagemFinal);
    res.status(201).json(imagemColocada)
  } catch (error) {
    res.status(500).json({
      erro: `Erro ao colocar imagem`,
      detalhe: error.message
    })
  }
}

module.exports = {
  cadastrarUsuario,
  loginUsuario,
  listarTodosUsuarios,
  buscarUsuarioPorId,
  atualizarUsuario,
  excluirUsuario,
  colocarImagem
};
