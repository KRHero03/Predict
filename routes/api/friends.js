const express = require("express");
const app = express();
const users = require("../../models/user");
const Score = require("../../models/score");
const { addNotification } = require('../../services/create_notification')
module.exports = app => {


    app.post('/api/send_friend_request', async (req, res) => {
        try {
            const cID = req.user._id
            const userID = req.body.id
            if (cID === userID) {
                res.send({ success: 0 })
                return
            }
            await users.update({ _id: cID }, { $push: { sentFriendRequests: userID } })
            await users.update({ _id: userID }, { $push: { friendRequests: cID } })
            const message = req.user.name + ' sent you a Friend Request!'
            await addNotification(userID, message, req.user.photo, '/friends/1')

            res.send({ success: 1 })

        } catch (e) {
            console.log(e)
            res.send({ success: 0 })
        }
    })

    app.post('/api/withdraw_friend_request', async (req, res) => {
        try {
            const cID = req.user._id
            const userID = req.body.id
            if (cID === userID) {
                res.send({ success: 0 })
                return
            }
            await users.updateOne({ _id: cID }, { $pull: { sentFriendRequests: userID } })
            await users.updateOne({ _id: userID }, { $pull: { friendRequests: cID } })

            res.send({ success: 1 })

        } catch (e) {
            console.log(e)
            res.send({ success: 0 })
        }
    })

    app.post('/api/accept_friend_request', async (req, res) => {
        try {
            const cID = req.user._id
            const userID = req.body.id
            if (cID === userID) {
                res.send({ success: 0 })
                return
            }
            await users.update({ _id: cID }, { $pull: { friendRequests: userID } })
            await users.update({ _id: userID }, { $pull: { sentFriendRequests: cID } })
            await users.update({ _id: cID }, { $push: { friends: userID } })
            await users.update({ _id: userID }, { $push: { friends: cID } })

            const user = await users.findOne({ _id: cID });


            res.send({ success: 1 })

        } catch (e) {
            console.log(e)
            res.send({ success: 0 })
        }
    })
    app.post('/api/reject_friend_request', async (req, res) => {
        try {
            const cID = req.user._id
            const userID = req.body.id
            if (cID === userID) {
                res.send({ success: 0 })
                return
            }
            await users.updateOne({ _id: cID }, { $pull: { friendRequests: userID } })
            await users.updateOne({ _id: userID }, { $pull: { sentFriendRequests: cID } })


            const user = await users.findOne({ _id: cID });

            res.send({ success: 1 })

        } catch (e) {
            console.log(e)
            res.send({ success: 0 })
        }
    })

    app.post('/api/remove_friend', async (req, res) => {
        try {
            const cID = req.user._id
            const userID = req.body.id
            if (cID === userID) {
                res.send({ success: 0 })
                return
            }
            await users.update({ _id: cID }, { $pull: { friends: userID } })
            await users.update({ _id: userID }, { $pull: { friends: cID } })

<<<<<<< HEAD
=======

            const user = await users.findOne({_id: cID});
>>>>>>> baee232dc24ecfdb1968d668521c759976e373f3

            res.send({ success: 1 })

        } catch (e) {
            console.log(e)
            res.send({ success: 0 })
        }
    })

}