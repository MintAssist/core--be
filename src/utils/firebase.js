const admin = require('firebase-admin');
const serviceAccount = require('./../configs/firebase');

admin.initializeApp({
	credential: admin.credential.cert(serviceAccount),
});

module.exports = admin