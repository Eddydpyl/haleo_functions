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
        },
        android: {
            data: {
                click_action:"FLUTTER_NOTIFICATION_CLICK",
            }
        },
        apns: {
            headers: {
                "apns-priority": "10",
            },
        },
        webpush: {
            headers: {
                Urgency: "high",
            },
        }
    };

    return admin.messaging().sendToTopic(topic, message);
};