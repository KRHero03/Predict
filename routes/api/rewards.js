const express = require("express");
const app = express();
const { Rewards } = require("../../models/rewards");
const Transactions = require('../../models/transactions')
const User = require('../../models/user')

module.exports = app => {
    app.post('/api/get_all_rewards', async (req, res) => {
        if (!req.user) {
            res.send({ success: 0 })
            return
        }
        const response = await Rewards.find({})
        res.send({ result: response, success: 1 })
        return
    })


    app.post('/api/claim_reward', async (req, res) => {
        const currentUser = req.user
        const rewardID = req.body.id
        if (!currentUser) {
            res.send({ success: 0 })
            return
        }

        const reward = await Rewards.findOne({ _id: rewardID })
        if (reward.quantity === 0) {
            res.send({ success: 0 })
            return
        }
        if (currentUser.rewardCoins < reward.cost) {
            res.send({ success: 0 })
            return
        }
        reward.set({ quantity: reward.quantity - 1 })
        await reward.save()
        await new Transactions({
            giftCode: Math.random().toString(36).slice(6).toUpperCase(),
            userID: req.user._id,
            rewardID: reward._id,
            timestamp: new Date().getTime(),
        }).save()
        const user = User.findOne({ _id: req.user._id })
        await req.user.set({ rewardCoins: req.user.rewardCoins - reward.cost }).save()
        res.send({ success: 1 })
    })


    app.post('/api/get_claimed_rewards', async (req, res) => {
        if (!req.user) {
            res.send({ success: 0 })
            return
        }

        const transactionDetails = await Transactions.find({ userID: req.user._id })
        let result = []

        await Promise.all(transactionDetails.map(async (transaction) => {
            let obj = {}
            obj.timestamp = transaction.timestamp
            obj.giftCode = transaction.giftCode

            const rewardDetails = await Rewards.findOne({ _id: transaction.rewardID })

            obj.photo = rewardDetails.photo
            obj.cost = rewardDetails.cost
            obj.name = rewardDetails.name
            result.push(obj)
        }))

        res.send({ result: result, success: 1 })

    })
}