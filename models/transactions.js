const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const TransactionSchema = new Schema({
  timestamp: {
    type: Date,
    required: true
  },
  userID: {
    type: String,
    required: true
  },
  rewardID: {
    type: String,
    required: true
  },
  giftCode: {
    type: String,
    required: true,
  }
});

module.exports = Transactions = mongoose.model("Transactions", TransactionSchema);