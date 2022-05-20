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

export const addToQueue = async ({ username, order, payed }) => {
  const db = getFirestore();
  const id = todayToString();

  // collection and document references
  const collection = db.collection(process.env.FIRESTORE_QUEUE_COLLECTION);
  const document = collection.doc(id);

  try {
    const queueObj = {
      user: username,
      order: order,
      status: "pending",
      payed: payed,
    };

    let queue = [];
    let delivered = [];
    const response = await document.get(); // try reading from database

    // queue for this day exists -> return length
    if (response.exists) {
      const data = response.data();
      if (data.queue) queue = data.queue;
      delivered = data.delivered;
    }

    queue.push(queueObj);

    // queue for this day does not exist -> create a new one
    await document.set({ queue, delivered });

    // add position in queue to order
    queueObj.position = queue.length;
    queueObj.estimated_duration = queue.length * 7;
    return queueObj;
  } catch (err) {
    throw err;
  }
};
