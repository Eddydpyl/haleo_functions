const functions = require('firebase-functions');
const storage = require('./storage');
const constants = require('../constants.js');

exports = module.exports = functions.firestore.document(`events/{eventId}`).onDelete((snapshot, context) => {
    const eventId = context.params.eventId;
    const event = snapshot.data();
    if (event.image && event.image.startsWith(constants.STORAGE)) {
        const file = storage.refFromUrl(event.image);
        return file.delete().catch(err => {
            console.log(`Failed to remove image, error: ${err}`)
        });
    } return null;
});