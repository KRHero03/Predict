const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const StorySchema = new Schema({
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true,
    },
    timestamp: {
        type: Date,
        required: true,
    },
    authorID: {
        type: String,
        required: true,
    },
    content: {
        type: String,
        required: true,
    },
    tags: [
        {
            id:{
                type: String
            }
        }
    ],
    views: {
        type: Number,
        required: true
    },
    upvotes: {
        type: Number,
        required: true
    },
    comments:[
        {
            id: {
                type: String
            }
        }
    ]

});

module.exports = Story = mongoose.model("stories", StorySchema);
