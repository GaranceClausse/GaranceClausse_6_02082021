const Sauce = require('../models/sauce');
const fs = require('fs');
const sauce = require('../models/sauce');

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

    Sauce.findOne({ _id: req.params.id })
        .then(() => {
            if (like === 1) {
                
                
                console.log(Sauce.find({usersLiked: {$elemMatch : {userId : "61151b588f97205a2c52d416"}}}));
                Sauce.updateOne(
                    { _id: req.params.id },
                    { $push: { usersLiked: userId }, $inc: { likes: +1 } }
                )
                    .then(() => res.status(200).json('sauce likée'))
                    .catch(error => res.status(400).json({ error: error }));
               
            } else if (like === -1) {
                Sauce.updateOne(
                    { _id: req.params.id },
                    { $push: { usersDisliked: userId }, $inc: { dislikes: -1 } }
                )
                    .then(() => res.status(200).json('sauce dislikée'))
                    .catch(error => res.status(400).json({ error: error }));
                
            }else {
                Sauce.findOne({ _id: req.params.id })
                    .then(sauce => {
                        if (sauce.usersLiked.includes(req.body.userId)) {
                            Sauce.updateOne({ _id: req.params.id }, { $pull: { usersLiked: req.body.userId }, $inc: { likes: -1 } })
                                .then((sauce) => { res.status(200).json({ message: 'Vous ne likez plus cette sauce !' }) })
                                .catch(error => res.status(400).json({ error }))
                        } else if (sauce.usersDisliked.includes(req.body.userId)) {
                            Sauce.updateOne({ _id: req.params.id }, { $pull: { usersDisliked: req.body.userId }, $inc: { dislikes: +1 } })
                                .then((sauce) => { res.status(200).json({ message: 'Vous ne dislikez plus cette sauce !' }) })
                                .catch(error => res.status(400).json({ error }))
                        }
                    })
                    .catch(error => res.status(400).json({ error }))
            } 
            
        })
        .catch(error => res.status(500).json({ error : 'la fonction ne marche pas' }))

};
            /*
            switch (like) {
                case 0 :
                    Sauce.updateOne(
                        { _id: req.params.id },
                        { $pull: { userLiked: userId }, $inc: { likes: -1, dislikes: 0 } }
                    )
                        .then(() => res.status(200).json("vous ne likez plus cette sauce!"))
                        .catch(error => res.status(400).json({ error: error }));
                    break;
            }/*
            switch (like) {
                case (0 && sauce.userDisliked.includes(userId)):

                    Sauce.updateOne(
                        { _id: req.params.id },
                        { $pull: { userDisliked: userId }, $inc: { dislikes: +1, likes: 0 } }
                    )
                        .then(() => res.status(200).json("vous ne dislikez plus cette sauce!"))
                        .catch(error => res.status(400).json({ error: error }));
                    break;
            }*/

    /*
    Sauce.findOneAndUpdate({ _id: req.params.id }, {$inc : {likes: +1, dislikes: -1}},{ $push: { userLiked: req.params.userId , userDisliked: req.params.userId} })
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

    })*/
    