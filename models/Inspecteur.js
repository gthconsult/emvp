const mongoose = require("mongoose");
const InspecteurSchema = new mongoose.Schema({
      
  id: {
    type: String,
    required: false,
    trim : true,
  },
  nom: {
    type: String,
    required: false,
    trim : true,
  },
  prenom: {
    type: String,
    required: false,
    trim : true,
  },
  identite: {
    type: String,
    required: false,
  },
  telephone: {
    type: Number,
    required: false,
    unique : true,
  },
  email: {
    type: String,
    required: false,
    trim : true,
    unique : true,
  },
  password: {
    type: String,
    required: false,
    trim : true,
  },
  adresses: {
    type: String,
    required: false,
  },
  ville: {
    type: String,
    required: false,
  },
  pays: {
    type: String,
    required: false,
  },
  postal: {
    type: String,
    required: false,
  },
  dateNaissance: {
    type: Date,
    required: false,
  },
  date: {
    type: Date,
    default: Date.now,
  },
  metier : {
      type : String,
      required : false,
      trim : true
  },
  validate : {
      type : Boolean,
      default: true,
  },

});
const Inspecteur = mongoose.model("Inspecteur", InspecteurSchema);
module.exports = Inspecteur;