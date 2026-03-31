const mongoose = require('mongoose');
const Etudiant = require('../models/Etudiant');

exports.createEtudiant = async (req, res) => {
  try {
    const { nom, prenom, moyenne } = req.body;

    if (!nom || !prenom) {
      return res.status(400).json({ message: 'Le nom et le prénom sont obligatoires' });
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
    res.status(400).json({ message: error.message });
  }
};

exports.getEtudiantById = async (req, res) => {
  try {
    // ObjectId.isValid() vérifie que l'ID respecte le format MongoDB (24 caractères hex)
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ message: 'ID invalide' });
    }
    // rest of the code
};