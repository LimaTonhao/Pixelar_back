const express = require("express");
const router = express.Router();
const triagemController = require("../controllers/triagemController");

const { autenticarToken, somenteAvaliador } = require("../middlewares/authMiddleware")

router.post("/criar", triagemController.criarTriagem);
router.get("/listar", triagemController.listarTriagens);
router.get("/listar/:id", triagemController.listarPorId);
router.get(
  "/candidatura/:id_candidatura",
  triagemController.listarPorCandidatura
);
router.put("/atualizar/:id", triagemController.atualizarTriagem);
router.delete("/deletar/:id", triagemController.deletarTriagem);

router.get("/dashboard", triagemController.dashboardGamificado);

module.exports = router;