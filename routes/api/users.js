const { response } = require("express");
const express = require("express");
const app = express();
const userModel = require("../../models/user");
module.exports = app => {
    app.post('/api/user_details',async (req,res)=>{
        try{
            const userIDParam = req.body.userID
            const upvoteResponse = await userModel.findOne({_id: userIDParam})
            res.send(upvoteResponse)
        }catch(e){
            console.log(e)
            res.send({})
        }
    })

}