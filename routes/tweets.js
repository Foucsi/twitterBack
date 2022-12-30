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

/*Retire un tweet avec le parametre username */
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
  User.findOne({ username: req.params.username }).then((data) => {
    res.json({ result: true, data: data.tweets });
  });
});

module.exports = router;
