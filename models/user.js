const mongoose = require("mongoose");
const {RewardsSchema} = require("./rewards");
const Schema = mongoose.Schema;

// Create the Schema
const UserSchema = new Schema({
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true
  },
  friendRequests: [{
    type:String,
  }],
  sentFriendRequests: [{
    type:String,
  }],
  friends: [{
    type:String,
  }],
  photo: {
    type: String,
    required: true,
    default:
      "https://res.cloudinary.com/geekysrm/image/upload/v1542221619/default-user.png"
  },
  rewardCoins: {
    type: Number,
    default: 100,
  },
  rewardsPurchased: [
    RewardsSchema,
  ],
});

module.exports = User = mongoose.model("user", UserSchema);
