const mongoose = require('mongoose');

/*********************Création du schéma de sauce */

const sauceSchema = mongoose.Schema({
    userId: {type: String, required: true},
    name : {type: String, required: true},
    manufacturer: {type: String, required: true},
    description: {type: String, required: true},
    mainPepper: {type: String, required: true},
    imageUrl : {type: String},
    heat: {type: Number, required: true},
    likes: {type: Number, default: 0},
    dislikes: {type: Number, default: 0},
    usersLiked: {type: [], default: []},
    usersDisliked: {type: [], default: []},
});



module.exports = mongoose.model('Sauces', sauceSchema);