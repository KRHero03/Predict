const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const NotificationSchema = new Schema({
  userID: {
    type: String,
    required: true
  },
  message: {
    type: String,
    required: true,
  },
  link: {
    type: String,
    required: true,
  },
  seen: {
    type: Boolean,
    default: false, 
  },
  timestamp: {
    type: Date,
    required: true
  },
});

module.exports = Notification = mongoose.model("notification", NotificationSchema);