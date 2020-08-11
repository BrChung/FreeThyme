import * as functions from 'firebase-functions';
// const admin = require('firebase-admin');
// admin.initializeApp();

// FIREBASE DEPLOY:
// firebase deploy -- only functions:testing


// TODO:
// For every single room, it checks the entire-cal/votes
// and removes any voted time before Today()
exports.testing = functions.pubsub
  .schedule('every day 18:02')
  .timeZone('America/Los_Angeles')
  .onRun(context => {
    // admin.firestore().collection('rooms').get()
    console.log('triggered every 5 minutes', context)
  });
