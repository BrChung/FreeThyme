import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';
admin.initializeApp();
const db = admin.firestore();

// FIREBASE DEPLOY:
// firebase deploy --only functions:testing

// Execution: Each room adds an average of 7 reads. I am not sure why

// DONE:
// For every single room, it checks the entire-cal/votes
// and removes any voted time before Today()

// Basic Logic:
// For every room, we go to the entire-cal, and we go to the votes, then we get
// all the keys from the votedTimes map.
// With the keys (datetime strings), we see if they are less than today.
// If they are less than today, they are set to be removed from firestore

// Optimizations:
// Put the "updating" action into a transaction just in case it is being read/written to
// by another service/component so that it will try to update again
exports.remove_old_votes = functions.pubsub
  .schedule('every day 11:59')
  .timeZone('America/Los_Angeles')
  .onRun(async (context) => {
    console.log("context timestamp --> ", context.timestamp);
    // We need to access all the room documents, so we need the room IDs
    const docRefs = await db.collection('rooms').listDocuments();
    const documentIds = await docRefs.map(it => it.id);
    console.log("doc ids I hope: ", documentIds)

    // For each room id, we want to access the votes map
    documentIds.forEach(async (docId) => {
      const docRef = db.doc(`rooms/${docId}/entire-cal/votes`)
      let updates: any = {votedTimes: {}}

      // Skip the iteration if there is an error with trying to acces votes
      try {
        const docGet = await docRef.get()
        const docData = await docGet.data()
        // if docData is empty, then that means the votes is empty
        if (!docData) {
          console.log("votes is empty")
          return
        }
        else {
          // Getting the keys inside votedTimes
          const docKeys = Object.keys(docData['votedTimes'])
          // checks if the timestamp string is less than the current time
          let keysToRemove = docKeys.filter((dateStr) => {
            return ((new Date(dateStr)) < new Date(context.timestamp))
          })

          // Now we have a list of keys to remove that represent voted times
          // we want to let firestore know to make those changes via the updates {} variable
          await keysToRemove.map((dateStr) => {
              updates.votedTimes[dateStr] = admin.firestore.FieldValue.delete()
          })
          console.log("keys to remove: ", keysToRemove)

          try {
            console.log("updates to make to firestore: ", updates)
            // We want to send the updates to firestore to remove old data
            await docRef.set(updates, {merge:true});
          } catch (err) {
            console.log(err)
            return
          }
          return
        }
      } catch(error) {
        return
      }
    })
    return null;
  });
