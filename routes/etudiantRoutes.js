const express = require("express");
const router = express.Router();

const {
  createEtudiant,
  getEtudiantById,
  getAllEtudiants,
  updateEtudiant,
  deleteEtudiant,
  searchEtudiants,
  getEtudiantsDesactives,
} = require("../controllers/etudiantController");

router.get("/search", searchEtudiants);
router.get("/desactives", getEtudiantsDesactives);

router.get("/", getAllEtudiants);
router.get("/:id", getEtudiantById);

router.post("/", createEtudiant);
router.put("/:id", updateEtudiant);
router.delete("/:id", deleteEtudiant);


module.exports = router;
