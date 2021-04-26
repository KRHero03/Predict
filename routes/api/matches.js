const express = require("express");
const app = express();
var request = require("request");
const { env, dev, production } = require('../../config/keys');
const Match = require('../../models/match')
const footballApiKey = env === 'dev' ? dev.apiFootballKey : production.apiFootballKey

module.exports = app => {
    app.post('/api/get_recent_matches', async (req, res) => {
        try {
            if(!req.user){
                res.send({success:0})
                return
            }
            const skip = req.body.skip

            const response = await Match.find({}).sort({timestamp:'desc'}).skip(skip).limit(10)
            res.send({success:1,result:response})
        

        } catch (err) {
            console.log(err);
            res.send({ success: 0 });
        }

    })

}