const admin = require('../admin.js');

exports.refFromUrl = function(url) {
    const startIndex = url.indexOf("/o/") + 3;
    const endIndex = url.indexOf("?");
    const trimmed = url.substring(startIndex, endIndex);
    const bucketName = "haleo-ec52d.appspot.com";
    const filename = unescape(trimmed);
    return admin.storage().bucket(bucketName).file(filename);
};