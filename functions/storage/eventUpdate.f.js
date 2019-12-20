const functions = require('firebase-functions');
const storage = require('./storage');
const constants = require('../constants.js');

exports = module.exports = functions.firestore.document(`events/{eventId}`).onUpdate((change, context) => {
    const eventId = context.params.eventId;
    const before = change.before.data();
    const after = change.after.data();
    if (before.image && before.image !== after.image
        && before.image.startsWith(constants.STORAGE)) {
        const file = storage.refFromUrl(before.image);
        return file.delete().catch(err => {
            console.log(`Failed to remove image, error: ${err}`)
        });
    } return null;
});