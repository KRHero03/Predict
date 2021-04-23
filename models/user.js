const mongoose = require("mongoose");
const rewards = require("./rewards");
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
    rewards,
  ],
});

module.exports = User = mongoose.model("user", UserSchema);
