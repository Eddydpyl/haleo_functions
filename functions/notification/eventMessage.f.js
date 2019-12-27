const functions = require('firebase-functions');
const messaging = require('./messaging.js');
const constants = require('../constants.js');
const admin = require('../admin.js');

exports = module.exports = functions.firestore.document(`events/{eventId}/messages/{messageId}`).onCreate((snapshot, context) => {
    const eventId = context.params.eventId;
    const message = snapshot.data();
    const store = admin.firestore();
    return store.collection("events").doc(eventId).get().then((snapshot) => {
        let promises = [];
        const event = snapshot.data();
        if (!event.attendees) return null;
        event.attendees.forEach((uid) => {
            if (message.user === uid) return;
            promises.push(store.collection("users").doc(uid).get());
        });
        return Promise.all(promises).then(snapshots => {
            return messaging.sendMessages({
                users: snapshots.map(snapshot => snapshot.data()),
                title: eventMessageTitleText(event.lang, event.name),
                body: eventMessageBodyText(event.lang, message.type, message.data),
                type: constants.EVENT,
                action: constants.SEND_MESSAGE,
                key: eventId,
            });
        });
    });
});

function eventMessageTitleText(lang, name){
    if (lang === "es")
        return "Nuevo mensaje en el chat de " + name + ".";
    return "New message in the chat of " + name + ".";
}

function eventMessageBodyText(lang, type, data){
    if (lang === "es") {
        if (type === constants.TEXT) return data;
        else return "\uD83E\uDD19 Imagen.";
    } else {
        if (type === constants.TEXT) return data;
        else return "\uD83E\uDD19 Image.";
    }
}