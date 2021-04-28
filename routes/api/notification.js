const { response } = require("express");
const express = require("express");
const app = express();
const userModel = require("../../models/user");
const Notification = require('../../models/notification')
module.exports = app => {
  app.post('/api/get_notifications', async (req, res) => {
    try {
      if (!req.user) {
        res.send({ success: 0 })
        return
      }
      const result = await Notification.find({userID:req.user._id}).sort({timestamp:'desc'})
      if(!result){
          res.send({success:0})
      }
      res.send({success: 1,result:result})
      return
    } catch (e) {
      console.log(e)
      res.send({ success: 0 })
    }
  })

  app.post('/api/check_seen_notification', async (req, res) => {
    try {
      if (!req.user) {
        res.send({ success: 0 })
        return
      }
      const id = req.body.id
      if(!id){
          res.send({success: 0})
          return
      }
      await Notification.updateOne({_id:id},{seen:true})
      res.send({success:1})
      return
    } catch (e) {
      console.log(e)
      res.send({ success: 0 })
    }
  })


}