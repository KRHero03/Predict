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
