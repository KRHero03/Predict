const Notification = require('../models/notification')

module.exports.addNotification = async (userID,message,photo,link)=>{
    const timestamp = new Date().getTime()
    await new Notification({
        userID:userID,
        message:message,
        timestamp:timestamp,
        photo:photo,
        link:link
    }).save()
}