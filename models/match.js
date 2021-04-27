const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const MatchSchema = new Schema({
    matchID: {
        type: String,
        required: true
    },
    referee: {
        type: String,
        default: '',
    },
    timestamp: {
        type: Number,
        required: true
    },
    venue: {
        type: String,
        default: '',
    },
    league: {
        name: {
            type: String,
            default: '',
        },
        country: {
            type: String,
            default: '',
        },
        logo: {
            type: String,
            default: '',
        },
        season: {
            type: String,
            default: '',
        },
        round: {
            type: String,
            default: '',
        },
    },
    teamHome: {
        name: {
            type: String,
            default: '',
        },
        logo: {
            type: String,
            default: '',
        },
        score: {
            type: Number,
            default: '',
        }
    },
    teamAway: {
        name: {
            type: String,
            default: '',
        },
        logo: {
            type: String,
            default: '',
        },
        score: {
            type: Number,
            default: '',
        }
    },
    winner: {
        type: String,
        default: 'nil',
    },
    status: {
        type: String,
        default: 'Unknown',
    },
    challenges: [{
        type: String,
    }]
});

module.exports = Match = mongoose.model("matches", MatchSchema);
