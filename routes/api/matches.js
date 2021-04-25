const passport = require("passport");
const express = require("express");
const app = express();
const {env,dev,production} = require('../../config/keys')
const apiKey = env=='dev'?dev.rapidApiKey:production.rapidApiKey
module.exports = app => {
    app.post('/api/get_recent_matches',(req,res)=>{
        console.log(apiKey)
    })
}