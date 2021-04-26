const express = require("express");
const app = express();
const http = require("https");
const {apiKey}  = require('../../config/keys');

module.exports = app => {
    app.post('/api/get_recent_matches',async (req,res)=>{
        try{
            console.log(apiKey);
            const options = {
                method: 'GET',
                url: 'https://v3.football.api-sports.io/fixtures',
                qs: {live: 'all'},
                headers: {
                  'x-rapidapi-host': 'v3.football.api-sports.io',
                  'x-rapidapi-key': apiKey,
                }
              };
            let data;
            const req = await http.request(options, function (res) {
                const chunks = [];

                res.on("data", function (chunk) {
                    chunks.push(chunk);
                });

                res.on("end", function () {
                    const body = Buffer.concat(chunks);
                    data = body.toString();
                    console.log(data);
                });
            });

            req.end();
            res.send(data);
            
        }catch(err){
            console.log(err);
            res.send({});
        }
        
    })

}