const express = require("express");
const router = express.Router();
const candidaturaController = require("../controllers/candidaturaController");

const {
  autenticarToken,
  somenteAvaliador,
} = require("../middlewares/authMiddleware");

router.post("/criar", candidaturaController.criar); //autenticarToken,
router.get("/listar", candidaturaController.listar); //autenticarToken, somenteAvaliador,
router.get("/listar/:id", candidaturaController.buscarPorId); //autenticarToken,
router.put("/atualizar/:id", candidaturaController.atualizar); //autenticarToken, somenteAvaliador,
router.delete("/deletar/:id", candidaturaController.deletar); //autenticarToken,

module.exports = router;