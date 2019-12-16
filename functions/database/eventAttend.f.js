const functions = require('firebase-functions');
const admin = require('../admin.js');

exports = module.exports = functions.firestore.document(`events/{eventId}`).onUpdate((change, context) => {
    const eventId = context.params.eventId;
    const before = change.before.data();
    const after = change.after.data();
    if (before.count !== after.count && after.count >= after.slots) {
        const store = admin.firestore();
        return store.collection("events")
            .doc(eventId).update({"open": false});
    } else return null;
});