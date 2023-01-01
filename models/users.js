const mongoose = require("mongoose");

const isLiked = mongoose.Schema({
  liked: Boolean,
});

const tweetSchema = mongoose.Schema({
  tweet: String,
  isliked: [isLiked],
});

const userSchema = mongoose.Schema({
  username: String,
  email: String,
  password: String,
  token: String,
  tweets: [tweetSchema],
});

const User = mongoose.model("users", userSchema);
module.exports = User;
