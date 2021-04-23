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
});

module.exports.ChallengeSchema = ChallengeSchema;
module.exports.Challenge = mongoose.model("challenge", ChallengeSchema);;