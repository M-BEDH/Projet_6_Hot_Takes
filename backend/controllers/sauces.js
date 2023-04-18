const { async } = require('rxjs');
const Sauce = require('../models/sauces');
const fs = require('fs');

// creation de la sauce et enregistrement
exports.createSauce =  (req, res, next) => {
    const objectSauce= JSON.parse(req.body.sauce);
    delete objectSauce._id;
    delete objectSauce._userId;
    const sauce = new Sauce ({
        ...objectSauce,
        userId: req.auth.userId,
        imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
    });   
    sauce.save()
    .then(() => res.status(201).json({ message: 'Sauce enregistrée !'}))
    .catch(error => res.status(400).json({ error}));
};

// Modification de la sauce
exports.modifySauce =  (req, res, next) => {
    // Vérification si fichier image existe 
    const objectSauce = req.file ? {
        ...JSON.parse(req.body.sauce),
        imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
        //sinon on récupère le corps de la requête
    } : { ...req.body };
    
    //suppression de l'userId venant de la requête
    delete objectSauce._userId;

    //récupération en base de données de la sauce créée
    Sauce.findOne({_id: req.params.id})
    .then((sauce) => {
        if (sauce.userId != req.auth.userId) {
            res.status(401).json({ message : 'Not authorized'});
        } else {
            Sauce.updateOne({ _id: req.params.id}, { ...objectSauce, _id: req.params.id})
            .then(() => res.status(200).json({message : 'Sauce modifiée!'}))
            .catch(error => res.status(401).json({ error }));
        };
    })
    .catch((error) => {
        res.status(400).json({ error });
    });
};

// fonction likes dislikes 
exports.likeSauce =  (req, res, next) => {

    let like = req.body.like
    let userId = req.body.userId

    console.log("like avant le clic bouton "+like)

    //récupération en base de données de la sauce créée
    Sauce.findOne({_id: req.params.id})
    .then((sauce) => {
        console.log('like :'+like)
        if (like === 1) {
            Sauce.updateOne({ _id: req.params.id}, {
                $push:{
                    usersLiked: userId
                },
                $inc: {
                    likes: 1
                }
            })
            .then(() => { res.status(201).json({ message: "like" }) })
            .catch(error => { res.status(500).json({ error }) })
        }
        else {
            if(like === -1){
                Sauce.updateOne({ _id: req.params.id}, {
                    $push:{
                        usersDisliked: userId
                    },
                    $inc: {
                        dislikes: 1
                    }
                })
                .then(() => { res.status(201).json({ message: "dislike" }) })
                .catch(error => { res.status(500).json({ error }) })
            }
            // cas like=0 => annulation vote
            else {

                console.log("Je suis dans le cas vote=0")

                Sauce.findOne({_id: req.params.id}).then((sauce) => {

                 //   console.log("J'ai trouvé la sauce : "+sauce)

                    if (sauce.usersLiked.find(user => user === userId)) {

//                        console.log("userId : " + userId)

                        Sauce.updateOne({ _id: req.params.id}, {
                            $pull:{
                                usersLiked: userId
                            },
                            $inc: {
                                likes: -1
                            }
                        })
                        .then(() => { res.status(201).json({ message: "annulation vote like" }) })
                        .catch(error => { res.status(500).json({ error }) })
                    }
                    else {
                        Sauce.updateOne({ _id: req.params.id}, {
                            $pull:{
                                usersDisliked: userId
                            },
                            $inc: {
                                dislikes: -1
                            }})
                            .then(() => { res.status(201).json({ message: "annulation vote dislike" }) })
                            .catch(error => { res.status(500).json({ error }) })
                    };
                });
            }};

        })
        .catch(error => res.status(401).json({ error }));
        
     
        };
        
        
        

// Suppression de la sauce
exports.deleteSauce = (req, res, next) => {
    Sauce.findOne({ _id: req.params.id})
    .then(sauce => {
        if (sauce.userId != req.auth.userId) {
            res.status(401).json({message: 'Not authorized'});
        } else {
            const filename = sauce.imageUrl.split('/images/')[1];
            fs.unlink(`images/${filename}`, () => {
                Sauce.deleteOne({_id: req.params.id})
                .then(() => { res.status(200).json({message: 'Sauce supprimée !'})})
                .catch(error => res.status(401).json({ error }));
            });
        }
    })
    .catch( error => {
        res.status(500).json({ error });
    });
};

// Récupérer une seule sauce
exports.getOneSauce = (req, res, next) => {
    Sauce.findOne({ _id: req.params.id })
    .then(sauce => res.status(200).json(sauce))
    .catch(error => res.status(404).json({error}));
};


// Récupérer toutes les sauces
exports.getAllSauce = (req, res, next) => {
    Sauce.find()
    .then(sauce => res.status(200).json(sauce))
    .catch(error => res.status(400).json({error}));
};


