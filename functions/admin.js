const admin = require('firebase-admin');
try {admin.initializeApp()} catch (e) {}
module.exports = admin;