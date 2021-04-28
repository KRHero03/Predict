<<<<<<< HEAD
const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const NotificationSchema = new Schema({
    userID: {
        type:String,
        required: true,
    },
    message: {
        type: String,
        required: true,
    },
    timestamp: {
        type: Number,
        required: true,
    },
    photo: {
        type: String,
        required: true,
        default:
            ""
    },
    seen: {
        type: Boolean,
        default: false
    },
    link: {
        type: String,
        required: true,
    }
});

module.exports = Notification = mongoose.model("notifications", NotificationSchema);
=======
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
>>>>>>> 38d055d4b21718028e1c6d5831e91515766a9bb9
