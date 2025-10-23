const express = require("express");
const router = express.Router();

const {
  autenticarToken,
  somenteAvaliador,
} = require("../middlewares/authMiddleware");
const usuariosController = require("../controllers/usuariosController");

router.post("/cadastrar", usuariosController.cadastrarUsuario);
router.post("/login", usuariosController.loginUsuario);
router.get("/listarTodos", usuariosController.listarTodosUsuarios); //autenticarToken,
router.get("/buscarPorId/:id", usuariosController.buscarUsuarioPorId); //autenticarToken,
router.put("/atualizar/:id", usuariosController.atualizarUsuario); //autenticarToken,
router.delete("/excluir/:id", usuariosController.excluirUsuario); //autenticarToken,

module.exports = router;