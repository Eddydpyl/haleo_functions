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
    } else if ((before.attendees || []).length < (after.attendees || []).length) {
        const diff = (after.attendees || []).filter(x => !(before.attendees || []).includes(x));
        return store.collection("users").doc(diff[0]).get().then((snapshot) => {
            const attendee = snapshot.data();
            return store.collection("users").doc(after.user).get().then((snapshot) => {
                const user = snapshot.data();
                return messaging.sendMessages({
                    users: [user],
                    title: eventJoinTitleText(after.lang),
                    body: eventJoinBodyText(after.lang, after.name, attendee.name),
                    type: constants.EVENT,
                    action: constants.ATTEND,
                    key: eventId,
                });
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

function eventJoinTitleText(lang){
    if (lang === "es")
        return "¡Alguien se ha apuntado a tu evento!";
    return "Someone has signed up to your event!";
}

function eventJoinBodyText(lang, event, user){
    if (lang === "es")
        return user + " está interesad@ en asistir a " + event + ".";
    return user + " is interest in going to " + event + ".";
}