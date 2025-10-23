const express = require("express");
const router = express.Router();
const curriculoController = require("../controllers/curriculoController");

const {
  autenticarToken,
  somenteAvaliador,
} = require("../middlewares/authMiddleware");

router.post("/registrar", curriculoController.criarCurriculo);
router.get("/listar", curriculoController.listarCurriculos);
router.get("/buscar/:id", curriculoController.buscarCurriculoPorId);
router.get("/buscarPorUsuario/:id", curriculoController.buscarPorUsuario);
router.put("/atualizar/:id", curriculoController.atualizarCurriculo);
router.delete("/deletar/:id", curriculoController.deletarCurriculo);

module.exports = router;