const mongoose = require('mongoose');

//création d'un schéma de données pour les sauces
const sauceSchema = mongoose.Schema({
    userId: { type: String, required: true },
    name: { type: String, required: true },
    manufacturer: { type: String, required: true },
    description: { type: String, required: true },
    mainPepper: { type: String, required: true },
    imageUrl: { type: String },
    heat: { type: Number, required: true },

    //gestion des likes
    likes: { type: Number, required: true, default: 0 },
    dislikes: { type: Number, required: true, default: 0 },
    usersLiked: { type: Array  , required: true, default: [] },
    usersDisliked: { type: Array , required: true, default: [] }
});

module.exports = mongoose.model('Sauce', sauceSchema);

