const Etudiant = require("../models/Etudiant");

// ================= CREATE =================
exports.createEtudiant = async (req, res) => {
  try {
    const { nom, prenom } = req.body;

    const existant = await Etudiant.findOne({ nom, prenom });
    if (existant) {
      return res.status(400).json({
        success: false,
        message: "Un étudiant avec ce nom et prénom existe déjà",
      });
    }

    const etudiant = await Etudiant.create(req.body);

    res.status(201).json({
      success: true,
      data: etudiant,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: error.message,
    });
  }
};

// ================= READ ALL (actifs seulement) =================
exports.getAllEtudiants = async (req, res) => {
  try {
    const etudiants = await Etudiant.find({ actif: true });

    res.status(200).json({
      success: true,
      count: etudiants.length,
      data: etudiants,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};

// ================= READ ONE =================
exports.getEtudiantById = async (req, res) => {
  try {
    const etudiant = await Etudiant.findOne({
      _id: req.params.id,
      actif: true,
    });

    if (!etudiant) {
      return res.status(404).json({
        success: false,
        message: "Étudiant non trouvé ou désactivé",
      });
    }

    res.status(200).json({
      success: true,
      data: etudiant,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};

// ================= UPDATE =================
exports.updateEtudiant = async (req, res) => {
  try {
    const etudiant = await Etudiant.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!etudiant) {
      return res.status(404).json({
        success: false,
        message: "Étudiant non trouvé",
      });
    }

    res.status(200).json({
      success: true,
      data: etudiant,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: error.message,
    });
  }
};

// ================= SOFT DELETE =================
exports.deleteEtudiant = async (req, res) => {
  try {
    const etudiant = await Etudiant.findByIdAndUpdate(
      req.params.id,
      { actif: false },
      { new: true }
    );

    if (!etudiant) {
      return res.status(404).json({
        success: false,
        message: "Étudiant non trouvé",
      });
    }

    res.status(200).json({
      success: true,
      message: "Étudiant désactivé avec succès",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};

// ================= ÉTUDIANTS DÉSACTIVÉS =================
exports.getEtudiantsDesactives = async (req, res) => {
  try {
    const etudiants = await Etudiant.find({ actif: false });

    res.status(200).json({
      success: true,
      count: etudiants.length,
      data: etudiants,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};

// ================= SEARCH =================
exports.searchEtudiants = async (req, res) => {
  try {
    const regex = new RegExp(req.query.q, "i");

    const etudiants = await Etudiant.find({
      actif: true,
      $or: [{ nom: regex }, { prenom: regex }],
    });

    res.status(200).json({
      success: true,
      count: etudiants.length,
      data: etudiants,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
  // Recherche avancée avec filtres multiples
exports.advancedSearch = async (req, res) => {
  try {
      const { nom, filiere, anneeMin, anneeMax, moyenneMin } = req.query;
      let filter = { actif: true };

      if (nom) filter.nom = new RegExp(nom, 'i');
      if (filiere) filter.filiere = filiere;
      if (anneeMin || anneeMax) {
          filter.annee = {};
          if (anneeMin) filter.annee.$gte = parseInt(anneeMin);
          if (anneeMax) filter.annee.$lte = parseInt(anneeMax);
      }
      if (moyenneMin) filter.moyenne = { $gte: parseFloat(moyenneMin) };

      const etudiants = await Etudiant.find(filter);

      res.status(200).json({
          success: true,
          count: etudiants.length,
          filters: req.query,
          data: etudiants
      });
  } catch (error) {
      res.status(500).json({
          success: false,
          message: 'Erreur serveur',
          error: error.message
      });
  }
};
};
