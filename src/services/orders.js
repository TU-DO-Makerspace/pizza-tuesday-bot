// --- imports
const { getFirestore, Timestamp } = require("firebase-admin/firestore");

const createOrder = async (ctx, order) => {
  const db = getFirestore();

  const collection = db.collection(process.env.FIRESTORE_ORDER_COLLECTION);

  const orderObject = {
    from: ctx.from.id,
    order: order.items,
    price: order.price,
    total_amount: order.total,
    created_at: Timestamp.now(),
    paid: false,
    status: "pending",
  };

  try {
    return await collection.add(orderObject);
  } catch (err) {
    throw error;
  }
};

module.exports = { createOrder };
