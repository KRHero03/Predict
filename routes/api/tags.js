const express = require("express");
const app = express();
const tags = require("../../models/tags");
const stories = require("../../models/stories");
const comments = require("../../models/comments");
const users = require("../../models/user");
const user = require("../../models/user");
module.exports = app => {
    app.get("/api/get_all_tags", (req, res) => {

        try {

            tags.find().then(tag => {
                res.send(tag)
            })
        } catch (e) {
            console.log(e)
            res.send({})
        }

    });

    app.post("/api/get_tag_name",async (req, res) => {
        try {
            const response = await tags.findOne({_id:req.body.id})
            res.send(response.name)
        } catch (e) {
            console.log(e)
            res.send("")
        }
    });
    app.post("/api/get_tag", async (req, res) => {
        try{            
            const response = await tags.findOne({_id:req.body.id})
            res.send(response)
        }catch(e){
            console.log(e)
            res.send({})
        }
    });

    app.post("/api/get_stories_by_tag", async (req, res) => {
        try{
            const idParam = req.body.id
            const storyResponse =await stories.find({tags:{$elemMatch:{id:idParam}}})

            const response = []

            await Promise.all(storyResponse.map(async (story)=>{
                authorID = story.authorID
                const author = await user.findOne({_id:authorID})
                const finalStory = {}
                finalStory.story = story
                finalStory.author = author
                response.push(finalStory)
            }))
            res.send(response)
            return
        
        }catch(e){
            console.log(e)
            res.send([])
        }
        
    });


}