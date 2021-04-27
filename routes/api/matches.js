const express = require("express");
const app = express();
var request = require("request");
const { env, dev, production } = require('../../config/keys');
const Match = require('../../models/match')
const Challenge = require('../../models/challenge')
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
    app.post('/api/get_match_for_prediction', async (req, res) => {
        try {
            if(!req.user){
                res.send({success:0})
                return
            }
            const matchID = req.body.matchID

            const matchResponse = await Match.findOne({matchID:matchID})
            if(!matchResponse){
                res.send({success:0})
                return
            }

            const friends = req.user.friends

            let friendDetails = []

            await Promise.all(friends.map(async (id)=>{
                const check1 = await Challenge.findOne({matchID:matchID,userID1:id,userID2:req.user._id})
                const check2 = await Challenge.findOne({matchID:matchID,userID1:req.user._id,userID2:id})
                if(check1 || check2) return
                const friend = await User.findOne({_id:id})
                friendDetails.push(friend)  
            }))

            let response = {}
            response.success=1
            response.match = matchResponse
            response.friends = friendDetails
            res.send(response)
            return
        

        } catch (err) {
            console.log(err);
            res.send({ success: 0 });
        }

    })

    

}