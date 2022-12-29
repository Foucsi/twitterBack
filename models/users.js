const mongoose = require("mongoose");

const tweetSchema = mongoose.Schema({
  tweet: String,
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
