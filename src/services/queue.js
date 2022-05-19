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

    // return null if queue does not exist
    if (!response.exists) {
      return null;
    }

    // queue for this day exists -> return length
    const data = response.data();
    const queue = data.queue;
    return queue.length;
  } catch (err) {
    throw err;
  }
};

export const getOrdersFromUser = async (ctx) => {
  const db = getFirestore();
  const id = todayToString();
  const userId = ctx.user.id;

  // collection and document references
  const collection = db.collection(process.env.FIRESTORE_QUEUE_COLLECTION);
  const document = collection.doc(id);

  try {
    const response = await document.get(); // try reading from database

    // return null if queue does not exist
    if (!response.exists) {
      return null;
    }

    // find order in queue
    const data = response.data();
    const queue = data.queue;

    const orders = queue.filter((obj) => obj.user === userId);
    return orders;
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
