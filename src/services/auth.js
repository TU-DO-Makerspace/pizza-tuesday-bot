// --- imports
const { getFirestore } = require("firebase-admin/firestore");

const checkAdmin = async (ctx, bot) => {
  const db = getFirestore();
  const id = ctx.from.id;

  // collection and document references
  const collection = db.collection(process.env.FIRESTORE_ADMIN_COLLECTION);
  const doc = collection.doc(id.toString());

  try {
    const response = await doc.get(); // try reading from database

    // document exists -> return document data
    if (response.exists) {
      const data = response.data();
      return data;
    }

    ctx.telegram.sendMessage(
      ctx.chat.id,
      "Dein Account hat nicht die benötigten Privilegien für diese Aktion.",
      {}
    );
    return false;
  } catch (err) {
    throw err;
  }
};

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

module.exports = { checkAdmin, checkAndCreateUser };
