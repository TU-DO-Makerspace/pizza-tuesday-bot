// --- imports
import { getFirestore } from "firebase-admin/firestore";

export const checkAdmin = async (ctx) => {
  const db = getFirestore();
  const id = ctx.from.id;

  // collection and document references
  const collection = db.collection(process.env.FIRESTORE_ADMIN_COLLECTION);
  const document = collection.doc(id.toString());

  try {
    const response = await document.get(); // try reading from database

    // document exists
    if (response.exists) {
      return true;
    }

    // if document does not exist
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

// get user data from database or create new user
export const getUser = async (ctx) => {
  const db = getFirestore();
  const userData = ctx.from;
  const id = userData.id;

  // collection and document references
  const collection = db.collection(process.env.FIRESTORE_USER_COLLECTION);
  const document = collection.doc(id.toString());

  try {
    const response = await document.get(); // try reading from database

    // read userdata if it exists
    if (response.exists) {
      return (ctx.user = response.data());
    }

    // create document if it does not exist
    userData.username = userData.username.toLowerCase();
    const user = await document.set(userData);
    return (ctx.user = userData);
  } catch (err) {
    throw err;
  }
};

// get user data from id
export const getUserByUsername = async (username) => {
  const db = getFirestore();

  // collection and document references
  const collection = db.collection(process.env.FIRESTORE_USER_COLLECTION);
  const document = collection.where("username", "==", username);

  try {
    const response = await document.get(); // try reading from database

    // read userdata if it exists
    if (response.empty) {
      return null;
    }

    return response.docs[0].data();
  } catch (err) {
    throw err;
  }
};
