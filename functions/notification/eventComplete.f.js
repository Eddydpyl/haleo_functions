const functions = require('firebase-functions');
const messaging = require('./messaging.js');
const constants = require('../constants.js');
const admin = require('../admin.js');

exports = module.exports = functions.firestore.document(`events/{eventId}`).onUpdate((change, context) => {
    const eventId = context.params.eventId;
    const before = change.before.data();
    const after = change.after.data();
    const store = admin.firestore();
    if (before.open !== after.open) {
        let promises = [];
        if (!after.attendees) return null;
        after.attendees.forEach((uid) => {promises.push(store.collection("users").doc(uid).get())});
        return Promise.all(promises).then(snapshots => {
            return messaging.sendMessages({
                users: snapshots.map(snapshot => snapshot.data()),
                title: eventCompleteTitleText(after.lang),
                body: eventCompleteBodyText(after.lang, after.name),
                type: constants.EVENT,
                action: after.open ? constants.OPEN : constants.CLOSE,
                key: eventId,
            });
        });
    } else return null;
});

function eventCompleteTitleText(lang){
    if (lang === "es")
        return "¡Chatea y organiza el evento!";
    return "Chat and organize the event!";
}

function eventCompleteBodyText(lang, name){
    if (lang === "es")
        return "El evento " + name + " tiene ahora el número necesario de participantes.";
    return "The event " + name + " now has the necessary number of participants.";
}