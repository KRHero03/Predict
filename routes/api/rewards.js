const express = require("express");
const app = express();
const rewardsModel = require("../../models/rewards");

module.exports = app => {
    app.post('/api/rewards', async (req, res) => {
        try{
            const response = await rewardsModel.find({ userID2: userID });
            res.send(rewards)
        }catch(e){
            console.log(e)
            res.send([])
        }
    })

}