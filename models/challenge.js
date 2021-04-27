const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const ChallengeSchema = new Schema({
  userID1: {
    type: String,
    required: true
  },
  userID2: {
    type: String,
    required: true
  },
  accepted:{
    type: Boolean,
    default: false,
  },
  matchID: {
    type: Number,
    required: true,
  },
  betAmount: {
    type: Number,
    required: true
  },
  status: {
    type: String,
    default: 'Ongoing',
  },
  sentBy: {
    type: String,
    required: true,
  },
  winner: {
    type: String,
    required: true
  }
});

module.exports = Challenge = mongoose.model("challenge", ChallengeSchema);;