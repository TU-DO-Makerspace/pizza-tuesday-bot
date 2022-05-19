// --- imports
import { getFirestore } from "firebase-admin/firestore";
import { todayToString } from "../helpers/dates.js";

export const getQueueLength = async () => {
  const db = getFirestore();
  const id = todayToString();

  // collection and document references
  const collection = db.collection(process.env.FIRESTORE_QUEUE_COLLECTION);
  const document = collection.doc(id);

  try {
    const response = await document.get(); // try reading from database

    // queue for this day exists -> return length
    if (response.exists) {
      const data = response.data();
      const queue = data.queue;
      return queue.length;
    }

    // queue for this day does not exist -> create a new one
    return null;
  } catch (err) {
    throw err;
  }
};

// TODO: this entire function
export const addToQueue = async (user, order) => {
  const db = getFirestore();
  const id = todayToString();

  // collection and document references
  const collection = db.collection(process.env.FIRESTORE_QUEUE_COLLECTION);
  const document = collection.doc(id);

  try {
    const response = await document.get(); // try reading from database

    // queue for this day exists -> return length
    if (response.exists) {
      const data = response.data();
      const queue = data.queue;
      return queue.length;
    }

    // queue for this day does not exist -> create a new one
    await document.set({ queue: [], delivered: [] });
    const newQueue = await document.get();
    return newQueue.data().queue.length;
  } catch (err) {
    throw err;
  }
};
