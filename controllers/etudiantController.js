const mongoose = require('mongoose');
const Etudiant = require('../models/Etudiant');
// etudiantController.js
exports.searchEtudiants = async (req, res) => {
  try {
    const { nom } = req.query;
    if (!nom) {
      return res.status(400).json({ message: "Paramètre 'nom' requis" });
    }

    const resultats = await Etudiant.find({ nom: { $regex: nom, $options: "i" } });
    res.status(200).json(resultats);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
exports.createEtudiant = async (req, res) => {
  try {
    const { nom, prenom, moyenne, email } = req.body;

    if (!nom || !prenom) {
      return res.status(400).json({ message: 'Le nom et le prénom sont obligatoires' });
    }

    if (!email) {
      return res.status(400).json({ message: "L'email est obligatoire" });
    }

    if (moyenne === undefined || typeof moyenne !== 'number') {
      return res.status(400).json({ message: 'La moyenne doit être un nombre' });
    }

    if (moyenne < 0 || moyenne > 20) {
      return res.status(400).json({ message: 'La moyenne doit être comprise entre 0 et 20' });
    }

    const etudiant = new Etudiant(req.body);
    await etudiant.save();

    res.status(201).json(etudiant);

  } catch (error) {

    // ✅ Gestion duplication email (MongoDB)
    if (error.code === 11000) {
      return res.status(409).json({
        message: 'Cet email est déjà utilisé'
      });
    }

    res.status(500).json({ message: error.message });
  }
};

exports.getEtudiantById = async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ message: 'ID invalide' });
    }

    const etudiant = await Etudiant.findById(req.params.id);

    if (!etudiant) {
      return res.status(404).json({ message: 'Étudiant non trouvé' });
    }

    res.status(200).json(etudiant);

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
// etudiantController.js
exports.getEtudiantsDesactives = async (req, res) => {
  try {
    const desactives = await Etudiant.find({ actif: false });
    res.status(200).json(desactives);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
// GET all
exports.getAllEtudiants = async (req, res) => {
  try {
    const etudiants = await Etudiant.find();
    res.status(200).json(etudiants);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// PUT update
const updatedEtudiant = await Etudiant.findByIdAndUpdate(
  req.params.id,
  { $set: req.body },
  {
    new: true,
    runValidators: true
  }
);

// DELETE
exports.deleteEtudiant = async (req, res) => {
  try {
    const etudiant = await Etudiant.findByIdAndDelete(req.params.id);
    if (!etudiant) return res.status(404).json({ message: "Étudiant non trouvé" });
    res.status(200).json({ message: "Étudiant supprimé" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};