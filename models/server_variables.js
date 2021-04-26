const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// Create the Schema
const ServerSchema = new Schema({
    fetchLastTimestamp: {
        type: String,
        required: true,
        default: new Date().getTime()
    }
});

module.exports = Server = mongoose.model("server", ServerSchema);
