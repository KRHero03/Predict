const express = require("express");
const app = express();
const users = require("../../models/user");
const {addNotification} = require('../../services/create_notification')
module.exports = app => {


    app.post('/api/send_friend_request',async(req,res)=>{
        try{
            const cID = req.user._id
            const userID = req.body.id
            if(cID===userID){
                res.send({success:0})
                return
            }
            await users.update({_id:cID},{$push:{sentFriendRequests:userID}})
            await users.update({_id:userID},{$push:{friendRequests:cID}})
            const message = req.user.name + ' sent you a Friend Request!'
            await addNotification(userID,message,req.user.photo,'/friends/1')

            res.send({success:1})

        }catch(e){
            console.log(e)
            res.send({success:0})
        }
    })

    app.post('/api/withdraw_friend_request',async(req,res)=>{
        try{
            const cID = req.user._id
            const userID = req.body.id
            if(cID===userID){
                res.send({success:0})
                return
            }
            await users.update({_id:cID},{$pull:{sentFriendRequests:userID}})
            await users.update({_id:userID},{$pull:{friendRequests:cID}})

            res.send({success:1})

        }catch(e){
            console.log(e)
            res.send({success:0})
        }
    })

    app.post('/api/accept_friend_request',async(req,res)=>{
        try{
            const cID = req.user._id
            const userID = req.body.id
            if(cID===userID){
                res.send({success:0})
                return
            }
            await users.update({_id:cID},{$pull:{friendRequests:userID}})
            await users.update({_id:userID},{$pull:{sentFriendRequests:cID}})
            await users.update({_id:cID},{$push:{friends:userID}})
            await users.update({_id:userID},{$push:{friends:cID}})
            const message = req.user.name + ' accepted your Friend Request!'
            await addNotification(userID,message,req.user.photo,'/friends/0')

            const user = await users.findOne({_id: cID});
            await new Notification({
                userID: userID,
                message: user.name + " has accepted your a friend request!",
                link: env=="dev"?"http://localhost:3000/friends/0":"https://predict-webapp.herokuapp.com/friends/0",
                timestamp: new Date().getTime(),
            }).save();
            console.log("Notification created!");


            res.send({success:1})

        }catch(e){
            console.log(e)
            res.send({success:0})
        }
    })
    app.post('/api/reject_friend_request',async(req,res)=>{
        try{
            const cID = req.user._id
            const userID = req.body.id
            if(cID===userID){
                res.send({success:0})
                return
            }
            await users.update({_id:cID},{$pull:{friendRequests:userID}})
            await users.update({_id:userID},{$pull:{sentFriendRequests:cID}})

            
            const user = await users.findOne({_id: cID});
            await new Notification({
                userID: userID,
                message: user.name + " has rejected your a friend request!",
                link: env=="dev"?"http://localhost:3000/friends/0":"https://predict-webapp.herokuapp.com/friends/0",
                timestamp: new Date().getTime(),
            }).save();
            console.log("Notification created!");

            res.send({success:1})

        }catch(e){
            console.log(e)
            res.send({success:0})
        }
    })

    app.post('/api/remove_friend',async(req,res)=>{
        try{
            const cID = req.user._id
            const userID = req.body.id
            if(cID===userID){
                res.send({success:0})
                return
            }
            await users.update({_id:cID},{$pull:{friends:userID}})
            await users.update({_id:userID},{$pull:{friends:cID}})

            
            const user = await users.findOne({_id: cID});
            await new Notification({
                userID: userID,
                message: user.name + " has removed you as a friend!",
                link: env=="dev"?"http://localhost:3000/friends/0":"https://predict-webapp.herokuapp.com/friends/0",
                timestamp: new Date().getTime(),
            }).save();
            console.log("Notification created!");


            res.send({success:1})

        }catch(e){
            console.log(e)
            res.send({success:0})
        }
    })

}