const express = require("express");
const router = express.Router();

const { autenticarToken, somenteAvaliador } = require("../middlewares/authMiddleware")
const vagasController = require("../controllers/vagasController");

router.post("/criar", vagasController.criarVaga);
router.get("/listarTodas", vagasController.listarTodas)
router.delete("/deletar/:id", autenticarToken, somenteAvaliador, vagasController.deletarVaga)
router.get("/listarPorId/:id", vagasController.listarPorId)
router.put("/atualizar/:id", autenticarToken, somenteAvaliador, vagasController.atualizarVaga)

module.exports = router;
