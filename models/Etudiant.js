const mongoose = require("mongoose");

const etudiantSchema = new mongoose.Schema(
  {
    nom: {
      type: String,
      required: true,
      trim: true,
    },
    prenom: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
    },
    filiere: {
      type: String,
      required: true,
      enum: ["Informatique", "Génie Civil", "Électronique", "Mécanique"],
    },
    annee: {
      type: Number,
      required: true,
      min: 1,
      max: 5,
    },
    moyenne: {
      type: Number,
      min: 0,
      max: 20,
      default: null,
    },
    actif: {
      type: Boolean,
      default: true, // ✅ SOFT DELETE
    },
    dateInscription: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

// Index unique nom + prénom
etudiantSchema.index({ nom: 1, prenom: 1 }, { unique: true });

module.exports = mongoose.model("Etudiant", etudiantSchema);
