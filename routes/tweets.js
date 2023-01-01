var express = require("express");
var router = express.Router();
require("../models/connection");
const User = require("../models/users");

/* post un nouveau tweet avec le parametre Username*/
router.post("/addTweets/:username", (req, res) => {
  User.findOneAndUpdate(
    { username: req.params.username },
    { $push: { tweets: { tweet: req.body.tweet } } }
  ).then((data) => {
    res.json({ result: true, data: data });
  });
});

/*enregister en base de donné si le tweet es liké ou pas */
router.post("/isLiked/:tweet", (req, res) => {
  User.findOneAndUpdate(
    // Cherchez l'utilisateur qui a posté le tweet
    { "tweets.tweet": req.params.tweet },

    //L'opérateur $set est utilisé pour remplacer
    { $set: { "tweets.$.isliked": { liked: req.body.liked } } },
    // Retournez le document modifié au lieu du document d'origine
    { returnOriginal: false }
  ).then((data) => {
    // Vérifiez si l'utilisateur a été trouvé et mis à jour
    if (data) {
      // Trouvez le tweet dans la liste de tweets de l'utilisateur
      const tweet = data.tweets.find((e) => e.tweet === req.params.tweet);
      // Renvoyez le tweet avec les données mises à jour

      res.json({ result: true, data: tweet.isliked[0].liked });
    } else {
      // Gérez l'erreur ici
      res.json({ result: false });
    }
  });
});

/* recuperer si le like et true ou false */
router.get("/getLiked/:tweet", (req, res) => {
  User.findOne({ "tweets.tweet": req.params.tweet }).then((data) => {
    res.json({
      result: true,
      data: data.tweets.map((e) => e.isliked[0]),
      // data: data.map((elmt) => elmt.tweets[0].isliked[0]),
    });
  });
});

// router.get("/getTweetId/:tweet", (req, res) => {
//   User.findOne({ "tweets.tweet": req.params.tweet }, (err, user) => {
//     if (err) {
//       // Gérez l'erreur ici
//       res.status(500).json({ error: err });
//     } else {
//       // Récupérez l'identifiant du tweet
//       const tweetId = user.tweets.find(
//         (tweet) => tweet.tweet === req.params.tweet
//       )._id;

//       // Renvoyez l'identifiant dans la réponse
//       res.json({ tweetId: tweetId });
//     }
//   });
// });

/*Supprime un tweet avec le parametre username */
router.delete("/removeTweets/:username", (req, res) => {
  User.findOneAndUpdate(
    { username: req.params.username },
    {
      $pull: { tweets: { tweet: req.body.tweet } },
    }
  ).then((data) => {
    res.json({ result: true, data: data });
  });
});

/* Recupere tous les tweet d'un utilisateur avec parametre username */
router.get("/allTweets/:username", (req, res) => {
  User.findOne({ username: req.params.username })
    .then((data) => {
      res.json({ result: true, data: data.tweets });
    })
    .catch((err) => {
      res.status(500).json({ error: err });
    });
});

/*TEST !!! recupere tous les tweets en fonction du usernmae  */

/*Récupere le nombre de tweet par user */
router.get("/numberTweet/:username", (req, res) => {
  User.findOne({ username: req.params.username }).then((data) => {
    if (data) {
      res.json({ result: true, data: data.tweets.length });
    }
  });
});

/* Récupere tout les tweets de tous les utilisateurs */
router.get("/allTweets", (req, res) => {
  User.find()
    .then((data) => {
      res.json({ result: true, data: data.map((e) => e.tweets) });
    })
    .catch((err) => {
      res.status(500).json({ result: false, error: err });
    });
});

/* Récupére le nom du user en fonction du tweet */
router.get("/userByTweet/:tweet", (req, res) => {
  User.find(
    { tweets: { $elemMatch: { tweet: req.params.tweet } } },
    { username: 1 }
  ).then((data) => {
    if (data.length > 0) {
      res.json({ result: true, data: data[0].username });
    } else {
      res.json({ result: false });
    }
  });
});

module.exports = router;
