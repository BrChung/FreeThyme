import * as functions from 'firebase-functions';

exports.testing = functions.pubsub
  .schedule('every day 17:18')
  .timeZone('America/Los_Angeles')
  .onRun(context => {

    console.log('triggered every 5 minutes', context)
  });
