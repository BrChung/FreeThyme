const functions = require('firebase-functions');
// const admin = require('firebase-admin');
// admin.initializeApp();
// const database = admin.firestore;


exports.testing = functions.pubsub
  .schedule('every 5 minutes')
  .timeZone('America/Los_Angeles')
  .onRun(context => {
    console.log('triggered every 5 minutes', context)
  });
