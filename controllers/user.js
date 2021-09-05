const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const Maskdata = require('maskdata');

const User = require('../models/User');



exports.signup = (req, res, next) => {
    const emailMask2Options = {
        maskWith: "*", 
        unmaskedStartCharactersBeforeAt: 3,
        unmaskedEndCharactersAfterAt: 5,
        maskAtTheRate: false
    };
    
const email = req.body.email;
    bcrypt.hash(req.body.password, 10)
        .then(hash => {
            const user = new User({
                email: Maskdata.maskEmail2(email, emailMask2Options),
                password: hash,
            });
            user.save()
                .then(() => res.status(201).json({ message: 'Utilisateur créé!' }))
                .catch(error => res.status(400).json({ error }));
        })
        .catch(error => res.status(500).json({ error }));
};

exports.login = (req, res, next) => {
    
    const emailMask2Options = {
        maskWith: "*", 
        unmaskedStartCharactersBeforeAt: 3,
        unmaskedEndCharactersAfterAt: 5,
        maskAtTheRate: false
    };
    
const email = req.body.email;
    User.findOne({ email: Maskdata.maskEmail2(email, emailMask2Options)})
        .then(user => {
            if (!user) {
                return res.status(401).json({ error: 'Utilisateur non trouvé' })
            }
            /*********Compare le mdp indiqué par l'utilisateur avec celui de la base de donnée : ce sont pas les mêmes mais les 2 hash sont créés à partir du même mdp */
            bcrypt.compare(req.body.password, user.password)
                .then(valid => {
                    if (!valid) {
                        return res.status(401).json({ error: 'Mot de passe erroné' })
                    }
                    res.status(200).json({
                        userId: user._id,
                        /****fonction sign encode un nouveau token */
                        token: jwt.sign(
                            {userId: user._id},                            
                            `${process.env.RND_TKN}`,
                            {expiresIn: '24h'}
                        )
                    });
                })
                .catch(error => res.status(500).json({ error }));
        })
        .catch(error => res.status(500).json({ error }));
};