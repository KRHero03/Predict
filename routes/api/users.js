const { response } = require("express");
const express = require("express");
const app = express();
const userModel = require("../../models/user");
module.exports = app => {
    app.post('/api/user_details',async (req,res)=>{
        try{
            if(!req.user){
                res.send({success:0})
                return
            }
            const userIDParam = req.body.userID
            const details = await userModel.findOne({_id: userIDParam})
            res.send({result:details,success:1})
        }catch(e){
            console.log(e)
            res.send({success:0})
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