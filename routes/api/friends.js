const express = require("express");
const app = express();
const friendsModel = require("../../models/friends");
const users = require("../../models/user");
module.exports = app => {
    app.post('/api/friends', async (req, res) => {
        try{
            const userID = req.user._id;
            const response = await friendsModel.find({ userID2: userID });
            let friends = []

            await Promise.all(response.map(async (obj) => {
                const userResponse = await users.findOne({ _id: obj.userID1 })
                friends.push(userResponse)
            }))

            res.send(friends)
        }catch(e){
            console.log(e)
            res.send([])
        }
    })

    app.post('/api/friends_count', async (req, res) => {
        try{
            const userID = req.body.userID;

            const response = await friendsModel.find({ userID2: userID });
            let friends = []

            await Promise.all(response.map(async (obj) => {
                const userResponse = await users.findOne({ _id: obj.userID1 })
                friends.push(userResponse)
            }))

            res.send(friends.length.toString())
        }catch(e){
            console.log(e)
            res.send("")
        }
    })

    app.post('/api/friends', async (req, res) => {
        try {
            const userID = req.user._id;

            const response = await friendsModel.find({ userID1: userID });
            let friends = []
            await Promise.all(response.map(async (obj) => {
                const userResponse = await users.findOne({ _id: obj.userID2 })
                friends.push(userResponse)
            }))
            res.send(friends)
        } catch (e) {
            console.log(e)
            res.send([])
        }
    })

    app.post('/api/friends_count', async (req, res) => {
        try {

            const userID = req.body.userID;

            const response = await friendsModel.find({ userID1: userID });
            
            let friends = []
            await Promise.all(response.map(async (obj) => {
                const userResponse = await users.findOne({ _id: obj.userID2 })
                friends.push(userResponse)
            }))
            res.send(friends.length.toString())
        } catch (e) {
            console.log(e)
            res.send("")
        }
    })

    app.post('/api/check_friend', async (req, res) => {
        try {

            const userID1Param = req.user._id
            const userID2Param = req.body.userID2

            const response = await friendsModel.find({ $and: [{ userID1: userID1Param }, { userID2: userID2Param }] })

            if (response.length > 0) res.send("1")
            else res.send("0")
        } catch (e) {
            res.send("0")
        }
    })

    app.post('/api/remove_friend', async (req, res) => {
        try {

            const userID1Param = req.user._id
            const userID2Param = req.body.userID2

            const response = await friendsModel.deleteOne({ $and: [{ userID1: userID1Param }, { userID2: userID2Param }] })
            if (response) res.send("1")
            else res.send("0")
        } catch (e) {
            console.log(e)
            res.send("0")
        }
    })

    app.post('/api/add_friend', async (req, res) => {
        try {

            const userID1Param = req.user._id
            const userID2Param = req.body.userID2

            const response = await friendsModel.create({ userID1: userID1Param, userID2: userID2Param })
            if (response) res.send("1")
            else res.send("0")
        } catch (e) {
            console.log(e)
            res.send("0")
        }
    })

    app.post('/api/battle_history', async (req, res) => {
        try{
            
            const userID1Param = req.user._id
            const userID2Param = req.body.userID2

            const response = await friendsModel.find({ $and: [{ userID1: userID1Param }, { userID2: userID2Param }] }).populate('challenge._id').select('battleHistory')

            res.send(response)
        }catch(e){
            console.log(e)
            res.send([])
        }
    })

    app.post('/api/battle_stats', async (req, res) => {
        try{
            
            const userID1Param = req.user._id
            const userID2Param = req.body.userID2

            const response = await friendsModel.find({ $and: [{ userID1: userID1Param }, { userID2: userID2Param }] }).select('battleWon battleLost battleDraw')

            res.send(response)
        }catch(e){
            console.log(e)
            res.send("")
        }
    })


}