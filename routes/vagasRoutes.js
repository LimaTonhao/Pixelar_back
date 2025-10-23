const express = require("express");
const router = express.Router();

const {
  autenticarToken,
  somenteAvaliador,
} = require("../middlewares/authMiddleware");
const vagasController = require("../controllers/vagasController");

router.post("/criar", vagasController.criarVaga); //autenticarToken, somenteAvaliador,
router.get("/listarTodas", vagasController.listarTodas);
router.delete("/deletar/:id", vagasController.deletarVaga); // autenticarToken, somenteAvaliador,
router.get("/listarPorId/:id", vagasController.listarPorId);
router.get("/listarPorIdUsuario/:id", vagasController.listarPorIdUsuario);
router.put("/atualizar/:id", vagasController.atualizarVaga); //autenticarToken, somenteAvaliador,

module.exports = router;