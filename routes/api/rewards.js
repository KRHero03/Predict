const express = require("express");
const app = express();
const {Rewards} = require("../../models/rewards");

module.exports = app => {
    app.post('/api/rewards', async (req, res) => {
        try{
            const response = await Rewards.find({ userID2: userID });
            res.send(rewards)
        }catch(e){
            console.log(e)
            res.send([])
        }
    })

}