const mongoose = require('mongoose');

/*********************Création du schéma de sauce */

const sauceSchema = mongoose.Schema({
    sauce : {type: String, required:true},
    image : {type: String},
});

module.exports = mongoose.model('Sauces', sauceSchema);