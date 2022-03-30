// --- imports
const { getFirestore, Timestamp } = require("firebase-admin/firestore");

const getNextEvent = async () => {
  try {
    // define document instance
    const db = getFirestore();
    const collection = db.collection(process.env.FIRESTORE_EVENT_COLLECTION);
    const today = Timestamp.now();

    // run query
    let id = undefined;
    const event = await collection
      .where("date", ">=", today)
      .orderBy("date")
      .get()
      .then((querySnapshot) => {
        if (!querySnapshot.empty) {
          id = querySnapshot.docs[0].id;
          return querySnapshot.docs[0].data();
        }
        // no menu found -> return false
        else {
          return false;
        }
      });

    event.id = id;

    return event;
  } catch (err) {
    throw err;
  }
};

module.exports = {
  getNextEvent,
};
