const { response } = require("express");
const express = require("express");
const app = express();
const Score = require("../../models/score");
const User = require("../../models/user");

module.exports = app => {
    app.post('/api/get_score', async (req, res) => {
        try {
            const userId = parseInt(req.body.userId)
            const friendId = parseInt(req.body.friendId)

            if (!userId || !friendId) {
                res.send({ success: 0 })
                return
            }

            const query = await Score.findOne({ userID1: userId, userID2: friendId}).select('user1Score user2Score');

            res.send({ success: 1 , user1Score: query.user1Score , user2Score: query.user2Score})


        } catch (e) {
            console.log(e)
            res.send({ success: 0 })
        }
    })

}