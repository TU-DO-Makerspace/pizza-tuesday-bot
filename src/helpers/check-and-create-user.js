// --- imports
const { getFirestore } = require("firebase-admin/firestore");

const checkAndCreateUser = async (ctx) => {
  const db = getFirestore();
  const id = ctx.from.id;

  // collection and document references
  const collection = db.collection(process.env.FIRESTORE_USER_COLLECTION);
  const doc = collection.doc(id.toString());

  try {
    const response = await doc.get(); // try reading from database

    // document exists -> return document data
    if (response.exists) {
      const data = response.data();
      return data;
    }
    // document does not exist -> create and return data
    else {
      delete ctx.from.id; // id is not necessary at this point
      doc.set(ctx.from);
      return ctx.from;
    }
  } catch (err) {
    throw err;
  }
};

module.exports = checkAndCreateUser;
