const express = require("express");
const app = express();
const tags = require("../../models/tags");
const stories = require("../../models/stories");
const comments = require("../../models/comments");
const upvotes = require("../../models/upvotes");
const users = require("../../models/user");
module.exports = app => {
    app.post('/api/get_story_by_userid', async (req, res) => {

        try{
            const userID = req.body.userID
            const storyResponse = await stories.find({ authorID: userID })
            res.send(storyResponse)
        }catch(e){
            console.log(e)
            res.send({})
        }
    })

    app.post('/api/get_story', async (req, res) => {

        try{
            const storyID = req.body.storyID
            const storyResponse = await stories.findOne({ _id: storyID })
            const viewsData = storyResponse.views + 1
            await stories.updateOne({ _id: storyResponse._id }, { views: viewsData })
            const storyResponse1 = await stories.findOne({ _id: storyID })
            res.send(storyResponse1)

        }catch(e){
            console.log(e)
            res.send({})
        }
    })

    app.post('/api/get_edit_story', async (req, res) => {

        try{
            if(!req.user){
                res.send({})
                return
            }
            const storyID = req.body.storyID
            const storyResponse = await stories.findOne({ _id: storyID })
            if(storyResponse.authorID != req.user._id){
                res.send({})
                return
            }
            let response = {}
            response.title = storyResponse.title
            response.description = storyResponse.description
            response.content = storyResponse.content
            
            let tagNames = []
            await Promise.all(storyResponse.tags.map(async (tagObj)=>{
                const tagID = tagObj.id
                const tagResponse = await tags.findOne({_id:tagID})
                tagNames.push(tagResponse.name)
            }))
            response.tags = tagNames
            res.send(response)

        }catch(e){
            console.log(e)
            res.send({})
        }
    })

    app.post('/api/your_stories', async (req, res) => {
        try{

            const userID = req.user._id
            const storyResponse = await stories.find({ authorID: userID })  
            res.send(storyResponse)

        }catch(e){
            res.send({})
        }
    })

    app.post('/api/add_story', async (req, res) => {
        try{
            const userID = req.user._id
            const title = req.body.title
            const content = req.body.content
            const description = req.body.description
            const tagVals = req.body.tags
    
            if (title.length <= 0) {
                res.send({ error: "Please enter a valid Title for your Story!" })
                return
            }
            if (description.length <= 0) {
                res.send({ error: "Please enter a valid Description for your Story!" })
                return
            }
            if (content.length <= 0) {
                res.send({ error: "Please enter valid Content for your Story!" })
                return
            }
    
            const date = new Date()
            let tagFinals = []
            await Promise.all(tagVals.map(async (tagName) => {
                tagName = tagName.toLowerCase()
                const tagResponse = await tags.findOne({ name: tagName })
                if (tagResponse) {
                    tagFinals.push({ "id": tagResponse._id })
                } else {
                    const newTagResponse = await tags.create({ name: tagName })
                    tagFinals.push({ "id": newTagResponse._id })
                }
            }))
            const storyResponse = await stories.create({ title: title, description: description, tags: tagFinals, comments: [], content: content, authorID: userID, timestamp: date, views: 0, upvotes: 0 })
    
            res.send({ "id": storyResponse._id })
        }catch(e){
            console.log(e)
            res.send({"error":"Failed to Add Story!"})
        }
        
    })

    app.post('/api/edit_story', async (req, res) => {
        try{
            const userID = req.user._id
            const storyID = req.body.storyID
            const title = req.body.title
            const content = req.body.content
            const description = req.body.description
            const tagVals = req.body.tags
    
            if (title.length <= 0) {
                res.send({ error: "Please enter a valid Title for your Story!" })
                return
            }
            if (description.length <= 0) {
                res.send({ error: "Please enter a valid Description for your Story!" })
                return
            }
            if (content.length <= 0) {
                res.send({ error: "Please enter valid Content for your Story!" })
                return
            }
            
            const storyResponse = await stories.findOne({_id:storyID})

            if(storyResponse.authorID!=userID){
                res.send({"error":"Failed to Edit Story!"})
                return
            }

            
            const date = new Date()
            let tagFinals = []
            await Promise.all(tagVals.map(async (tagName) => {
                tagName = tagName.toLowerCase()
                const tagResponse = await tags.findOne({ name: tagName })
                if (tagResponse) {
                    tagFinals.push({ "id": tagResponse._id })
                } else {
                    const newTagResponse = await tags.create({ name: tagName })
                    tagFinals.push({ "id": newTagResponse._id })
                }
            }))

            await stories.updateOne({_id:storyID},{ title: title, description: description, tags: tagFinals, content: content})
    
            res.send({ "id": storyResponse._id })
        }catch(e){
            console.log(e)
            res.send({"error":"Failed to Edit Story!"})
        }
        
    })

    app.post('/api/delete_story', async (req, res) => {
        try{
            const userID = req.user._id
            const storyID = req.body.storyID

            const storyResponse = await stories.findOne({_id:storyID})
            if(storyResponse.authorID!=userID){
                res.send("0")
                return
            }
            await stories.deleteOne({_id:storyID})
            res.send("1")
        }catch(e){
            console.log(e)
            res.send("0")
        }
        
    })


    app.post('/api/get_comment', async (req, res) => {
        try{

        const commentID = req.body.commentID
        const commentResponse = await comments.findOne({ _id: commentID })
        let response = {}
        response.comment = commentResponse
        const authorResponse = await users.findOne({ _id: commentResponse.authorID })

        response.author = authorResponse
        res.send(response)
        }catch(e){
            console.log(e)
            res.send({})
        }

    })

    app.post('/api/add_comment', async (req, res) => {
        try {

            const userID = req.user._id
            const storyID = req.body.storyID
            const commentData = req.body.commentData
            const commentResponse = await comments.create({ authorID: userID, content: commentData })
            const storyResponse = await stories.findOne({ _id: storyID })

            let commentIDs = storyResponse.comments
            commentIDs.push({ "id": commentResponse._id })

            await stories.updateOne({ _id: storyID }, { comments: commentIDs })

            const author = await users.findOne({ _id: userID })

            let response = {}
            response.comment = commentResponse
            response.author = author
            res.send(response)
        } catch (e) {
            console.log(e)
            res.send({})
        }

    })

    app.post('/api/delete_comment', async (req, res) => {
        try {
            const commentID = req.body.commentID
            const storyID = req.body.storyID
            await comments.deleteOne({ _id: commentID })
            await stories.updateOne({ _id: storyID }, { $pull: { comments: { id: commentID } } })
            res.send("1")
        } catch (e) {
            console.log(e)
            res.send("0")
        }
    })

    app.post('/api/search',async (req,res)=>{
        try{
            const searchParam = req.body.id
            let response = {}

            if(req.user){
                const userResponse = await users.find({'name':{'$regex': searchParam,'$options':'i'}})
                response.users = userResponse
            }else{
                response.users = []
            }


            const storiesResponse = await stories.find({'title':{'$regex': searchParam,'$options':'i'}})
            let storyResponseFinal = []            
            await Promise.all(storiesResponse.map(async (story)=>{
                const author = await users.findOne({_id:story.authorID})
                let storyObj = {}
                storyObj.story = story
                storyObj.author = author
                storyResponseFinal.push(storyObj)
            }))
            response.stories = storyResponseFinal


            const tagsResponse = await tags.find({'name':{'$regex': searchParam,'$options':'i'}})
            let tagStories = []
            await Promise.all(tagsResponse.map(async (tagObj)=>{
                const tagID = tagObj._id
                const storyResponse =await stories.find({tags:{$elemMatch:{id:tagID}}})

                await Promise.all(storyResponse.map(async (story)=>{
                    const author = await users.findOne({_id:story.authorID})
                    let storyObj = {}
                    storyObj.story = story
                    storyObj.author = author
                    tagStories.push(storyObj)
                }))

            }))
            response.tagStories = tagStories
            res.send(response)
        }catch(e){
            console.log(e)
            res.send({'stories':[],'users':[],'tagStories':[]})
        }
    })

}