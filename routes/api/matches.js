const express = require("express");
const app = express();
var request = require("request");
const { env, dev, production } = require('../../config/keys');
const footballApiKey = env === 'dev' ? dev.apiFootballKey : production.apiFootballKey

module.exports = app => {
    app.post('/api/get_recent_matches', async (req, res) => {
        try {

        

        } catch (err) {
            console.log(err);
            res.send({ success: 0 });
        }

    })

}