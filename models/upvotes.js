const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const UpvoteSchema = new Schema({
  userID: {
    type: String,
    required: true
  },
  storyID: {
      type: String,
      required: true
  }
});

module.exports = Upvote = mongoose.model("upvotes", UpvoteSchema);
