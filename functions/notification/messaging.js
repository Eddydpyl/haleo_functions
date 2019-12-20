const admin = require('../admin.js');

exports.sendMessages = function({topic, title, body, type, action, key}) {
    const message = {
        notification: {
            title : title,
            body : body,
        },
        data: {
            type: type.toString(),
            action: action.toString(),
            key: key,
            click_action:"FLUTTER_NOTIFICATION_CLICK",
        },
    };

    const options = {
        priority: "high",
        contentAvailable: true,
    };

    return admin.messaging().sendToTopic(topic, message, options);
};