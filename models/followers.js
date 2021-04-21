const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const FollowerSchema = new Schema({
  userID1: {
    type: String,
    required: true
  },
  userID2: {
      type: String,
      required: true
  }
});

module.exports = Follower = mongoose.model("followers", FollowerSchema);
