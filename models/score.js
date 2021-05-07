const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const ScoreSchema = new Schema({
  userID1: {
    type: String,
    required: true
  },
  userID2: {
    type: String,
    required: true
  },
  user1Score: {
    type: Number,
    default: 0,
  },
  user2Score: {
    type: Number,
    default: 0
  },
});

module.exports = Score = mongoose.model("score", ScoreSchema);