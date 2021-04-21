const express = require("express");
const app = express();
const upvoteModel = require('../../models/upvotes');
const storyModel = require('../../models/stories');
const followerModel = require("../../models/followers");
const users = require("../../models/user");
module.exports = app => {
    app.post('/api/upvote_count', async (req, res) => {
        try {
            const userIDParam = req.body.userID
            const upvoteResponse = await upvoteModel.find({ userID: userIDParam })
            res.send(upvoteResponse.length.toString())
        } catch (e) {
            console.log(e)
            res.send("")
        }
    })

    app.post('/api/check_upvoted', async (req, res) => {
        try {

            const userIDParam = req.user._id
            const storyIDParam = req.body.storyID

            const upvoteResponse = await upvoteModel.find({ $and: [{ userID: userIDParam }, { storyID: storyIDParam }] })

            if (upvoteResponse.length > 0) res.send("1")
            else res.send("0")
        } catch (e) {
            console.log(e)
            res.send("0")
        }
    })

    app.post('/api/add_upvote', async (req, res) => {
        try {

            const userIDParam = req.body.userID
            const storyIDParam = req.body.storyID

            const storyResponse = await storyModel.findOne({ _id: storyIDParam })

            const upvoteCount = storyResponse.upvotes + 1

            await storyModel.updateOne({ _id: storyIDParam }, { upvotes: upvoteCount })

            await upvoteModel.create({ userID: userIDParam, storyID: storyIDParam })

            res.send("1")
        } catch (e) {
            console.log(e)
            res.send("0")
        }


    })

    app.post('/api/remove_upvote', async (req, res) => {
        try {

            const userIDParam = req.body.userID
            const storyIDParam = req.body.storyID

            const storyResponse = await storyModel.findOne({ _id: storyIDParam })

            const upvoteCount = storyResponse.upvotes - 1

            await storyModel.updateOne({ _id: storyIDParam }, { upvotes: upvoteCount })

            await upvoteModel.deleteOne({ userID: userIDParam, storyID: storyIDParam })

            res.send("1")
        } catch (e) {
            console.log(e)
            res.send("0")
        }
    })

    app.post('/api/upvoted_stories', async (req, res) => {
        try {

            const userIDParam = req.body.userID

            const storyIDResponse = await upvoteModel.find({ userID: userIDParam })

            let stories = []

            await Promise.all(storyIDResponse.map(async (storyIDObj) => {
                const storyID = storyIDObj.storyID

                const story = await storyModel.findOne({ _id: storyID })

                const author = await users.findOne({ _id: story.authorID })

                let storyObj = {};
                storyObj.story = story
                storyObj.author = author
                stories.push(storyObj)
            }))

            res.send(stories)
        } catch (e) {
            console.log(e)
            res.send([])
        }
    })
}