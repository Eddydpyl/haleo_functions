const admin = require('../admin.js');

exports.sendMessages = function({users, title, body, type, action, key}) {
    let promises = [];
    users.forEach((user) => {
        if (user.token) {
            const message = {
                token: user.token,
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
            };
            promises.push(admin.messaging().send(message).catch(function (error) {
                console.log('Error sending messages:', error);
            }));
        }
    }); return Promise.all(promises);
};