const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const RewardsSchema = new Schema({
  name:{
    type: String,
    required: true,
  },
  cost:{
    type: Number,
    required: true,
  },
  photo: {
    type: String,
    required: true,
    default:
      "https://img.freepik.com/free-vector/loyalty-program-getting-gift-reward-flat-illustration_169533-11.jpg?size=626&ext=jpg"
  },
});

module.exports = Challenge = mongoose.model("challenge", ChallengeSchema);
