const { response } = require("express");
const express = require("express");
const app = express();
const challengeModel = require("../../models/challenge");
module.exports = app => {
    app.post('/api/create_challenge',async (req,res)=>{
        try {
            const userID1Param = req.user._id
            const userID2Param = req.body.userID2
            const response = await challengeModel.create({ userID1: userID1Param, userID2: userID2Param })
            if (response) res.send("1")
            else res.send("0")
        } catch (e) {
            console.log(e)
            res.send("0")
        }
    })

    app.post('/api/challenge_accepted',async (req,res)=>{
        try {
            const userID1Param = req.user._id
            const userID2Param = req.body.userID2
            const response = await challengeModel.findOneAndUpdate({ userID1: userID1Param, userID2: userID2Param },{
                accepted: true,
            })
            if (response) res.send("1")
            else res.send("0")  
        } catch (e) {
            console.log(e)
            res.send("0")
        }
    })

}