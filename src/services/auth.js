// --- imports
import { getFirestore } from "firebase-admin/firestore";

export const checkAdmin = async (ctx) => {
  const db = getFirestore();
  const id = ctx.from.id;

  // collection and document references
  const collection = db.collection(process.env.FIRESTORE_ADMIN_COLLECTION);
  const doc = collection.doc(id.toString());

  try {
    const response = await doc.get(); // try reading from database

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
