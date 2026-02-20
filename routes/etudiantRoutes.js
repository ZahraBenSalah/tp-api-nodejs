const express = require("express");
const router = express.Router();

const {
  createEtudiant,
  getAllEtudiants,
  getEtudiantById,
  updateEtudiant,
  deleteEtudiant,
  searchEtudiants,
  getEtudiantsDesactives,
} = require("../controllers/etudiantController");

// 🔍 Recherche
router.get("/search", searchEtudiants);

// 👻 Étudiants désactivés
router.get("/desactives", getEtudiantsDesactives);

// CRUD
router.post("/", createEtudiant);
router.get("/", getAllEtudiants);
router.get("/:id", getEtudiantById);
router.put("/:id", updateEtudiant);
router.delete("/:id", deleteEtudiant);

module.exports = router;
