const { response } = require("express");
const express = require("express");
const app = express();
const Notification = require("../../models/notification");
const User = require("../../models/user");
module.exports = app => {
    app.post('/api/create_notification', async (req, res) => {
        const userId = req.body.id;
        try{
            const user = await User.findOne({_id: userId});
            if (!user) {
                res.send({ success: 0 });
                return;
            }
            
            await new Notification({
                userID: userId,
                message: req.body.message,
                link: req.body.link,
                timestamp: new Date().getTime(),
            }).save();

            res.send({ success: 1 });
        }catch(err){
            console.log(err);
            res.send({success: 0});
        }
    });

    app.post('/api/notification_seen', async (req, res) => {
        const id = req.body.id;
        try{
            const notification = await Notification.findOneAndUpdate({_id: id});
            notification.seen = true;
            notification.save();
            res.send({ success: 1 });
        }catch(err){
            console.log(err);
            res.send({ success: 0 });
        }
    })
}