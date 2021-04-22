const { response } = require("express");
const express = require("express");
const app = express();
const userModel = require("../../models/user");
module.exports = app => {
    app.post('/api/user_details',async (req,res)=>{
        try{
            const userIDParam = req.body.userID
            const details = await userModel.findOne({_id: userIDParam}).select('-rewardsPurchased')
            res.send(details)
        }catch(e){
            console.log(e)
            res.send({})
        }
    })
    app.post('/api/user_rewards',async (req,res)=>{
        try{
            const userIDParam = req.body.userID
            const rewards = await userModel.findOne({_id: userIDParam}).populate('rewards._id').select('rewardsPurchased')
            res.send(rewards)
        }catch(e){
            console.log(e)
            res.send([])
        }
    })

}