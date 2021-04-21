const express = require("express");
const app = express();
const tags = require("../../models/tags");
const stories = require("../../models/stories");
const comments = require("../../models/comments");
const followerModel = require("../../models/followers");
const users = require("../../models/user");
module.exports = app => {
    app.post('/api/follower', async (req, res) => {
        try{
            const userID = req.user._id;
            const response = await followerModel.find({ userID2: userID });
            let followers = []

            await Promise.all(response.map(async (obj) => {
                const userResponse = await users.findOne({ _id: obj.userID1 })
                followers.push(userResponse)
            }))

            res.send(followers)
        }catch(e){
            console.log(e)
            res.send([])
        }
    })

    app.post('/api/follower_count', async (req, res) => {
        try{
            const userID = req.body.userID;

            const response = await followerModel.find({ userID2: userID });
            let followers = []

            await Promise.all(response.map(async (obj) => {
                const userResponse = await users.findOne({ _id: obj.userID1 })
                followers.push(userResponse)
            }))

            res.send(followers.length.toString())
        }catch(e){
            console.log(e)
            res.send("")
        }
    })

    app.post('/api/following', async (req, res) => {
        try {
            const userID = req.user._id;

            const response = await followerModel.find({ userID1: userID });
            let following = []
            await Promise.all(response.map(async (obj) => {
                const userResponse = await users.findOne({ _id: obj.userID2 })
                following.push(userResponse)
            }))
            res.send(following)
        } catch (e) {
            console.log(e)
            res.send([])
        }
    })

    app.post('/api/following_count', async (req, res) => {
        try {

            const userID = req.body.userID;

            const response = await followerModel.find({ userID1: userID });
            
            let following = []
            await Promise.all(response.map(async (obj) => {
                const userResponse = await users.findOne({ _id: obj.userID2 })
                following.push(userResponse)
            }))
            res.send(following.length.toString())
        } catch (e) {
            console.log(e)
            res.send("")
        }
    })

    app.post('/api/check_followed', async (req, res) => {
        try {

            const userID1Param = req.user._id
            const userID2Param = req.body.userID2

            const response = await followerModel.find({ $and: [{ userID1: userID1Param }, { userID2: userID2Param }] })

            if (response.length > 0) res.send("1")
            else res.send("0")
        } catch (e) {
            res.send("0")
        }
    })

    app.post('/api/remove_followed', async (req, res) => {
        try {

            const userID1Param = req.user._id
            const userID2Param = req.body.userID2

            const response = await followerModel.deleteOne({ $and: [{ userID1: userID1Param }, { userID2: userID2Param }] })
            if (response) res.send("1")
            else res.send("0")
        } catch (e) {
            console.log(e)
            res.send("0")
        }
    })

    app.post('/api/add_followed', async (req, res) => {
        try {

            const userID1Param = req.user._id
            const userID2Param = req.body.userID2

            const response = await followerModel.create({ userID1: userID1Param, userID2: userID2Param })
            if (response) res.send("1")
            else res.send("0")
        } catch (e) {
            console.log(e)
            res.send("0")
        }
    })

}