const Sauce = require('../models/sauce');
const fs = require('fs');

exports.createSauce = (req, res, next) => {
    /*************Transforme la chaine de caractère en objet*/
    const sauceObject = JSON.parse(req.body.sauce);
    /**********Supprime l'id créé par mongodb */
    delete sauceObject._id;
    const sauce = new Sauce({
        ...sauceObject,
        imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
    });
    sauce.save()
        .then(() => res.status(201).json({
            message: 'Nouvelle sauce créée!'
        }))
        .catch(error => res.status(400).json({ error }));
};

exports.modifySauce = (req, res, next) => {
    const sauceObject = req.file ?
        {
            ...JSON.parse(req.body.sauce),
            imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`

        } : { ...req.body };
    Sauce.updateOne({ _id: req.params.id }, { ...sauceObject, _id: req.params.id })
        .then(() => res.status(200).json({ message: 'Sauce modifiée' }))
        .catch(error => res.status(404).json({ error }));
};

exports.deleteSauce = (req, res, next) => {
    Sauce.findOne({ _id: req.params.id })
        .then(sauce => {
            /****Extrait le nom du fichier à supprimer : ce qui est après c'est le nom */
            const filename = sauce.imageUrl.split('/images/')[1];
            fs.unlink(`images/${filename}`, () => {

                Sauce.deleteOne({ _id: req.params.id })
                    .then(() => res.status(200).json({ message: 'Sauce supprimée' }))
                    .catch(error => res.status(400).json({ error }));
            });
        })
        .catch(error => res.status(500).json({ error }))
};

exports.getOneSauce = (req, res, next) => {
    Sauce.findOne({ _id: req.params.id })
        .then(sauce => res.status(200).json(sauce))
        .catch(error => res.status(404).json({ error }));
};

exports.getAllSauces = (req, res, next) => {
    Sauce.find()
        .then(sauces => res.status(200).json(sauces))
        .catch(error => res.status(400).json({ error: error }));
};

exports.likeOneSauce = (req, res, next) => {
    const like = req.body.like;
    const userId = req.body.userId;
    const usersLiked = req.body.usersLiked;
    const usersDisliked = req.body.usersDisliked;

    Sauce.findOne({ _id: req.params.id })
        .then(() => {
            switch (like) {
                case 1:
                    Sauce.updateOne(
                        { _id: req.params.id },
                        { $push: { usersLiked: userId }, $inc: { likes: +1 } }
                    )
                        .then(() => res.status(200).json('sauce likée'))
                        .catch(error => res.status(400).json({ error: error }));
                    break;
            }
            switch (like) {
                case -1:
                    Sauce.updateOne(
                        { _id: req.params.id },
                        { $push: { usersDisliked: userId }, $inc: { dislikes: -1}}
                    )
                        .then(() => res.status(200).json('sauce dislikée'))
                        .catch(error => res.status(400).json({ error: error }));
                    break;
            } 
            switch (like) {
                case (0 && userId === usersLiked):
                    Sauce.updateOne(
                        { _id: req.params.id },
                        { $pull: { usersLiked: userId}, $inc: { likes: -1}}
                    )
                        .then(() => res.status(200).json("vous avez changé d'avis sur cette sauce!"))
                        .catch(error => res.status(400).json({ error: error }));
                    break;
            }
            switch (like) {
                case (0 && userId === usersDisliked ):
                    Sauce.updateOne(
                        { _id: req.params.id },
                        { $pull: { usersDisliked: userId}, $inc: {dislikes: +1}}
                    )
                        .then(() => res.status(200).json("vous avez changé d'avis sur cette sauce!"))
                        .catch(error => res.status(400).json({ error: error }));
                    break;
            }
            
        })
    /*
    Sauce.findOneAndUpdate({ _id: req.params.id }, {$inc : {likes: +1, dislikes: -1}},{ $push: { usersLiked: req.params.userId , usersDisliked: req.params.userId} })
        .then(sauces => res.status(200).json(sauces))
        .catch(error => res.status(400).json({ error: error }));

       
    /*.then(sauce => {
        const saucelike = sauce.like ?
            {
                ...JSON.parse(req.body.sauce),
                imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`

            } : { ...req.body };

        Sauce.updateOne({ _id: req.params.id })
            .then(() => res.status(200).json({ message: 'Sauce likée' }))
            .catch(error => res.status(400).json({ error }));

    })
    .catch(error => res.status(500).json({ error }))*/

};