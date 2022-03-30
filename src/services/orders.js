// --- imports
const { getFirestore, Timestamp } = require("firebase-admin/firestore");
const { adminOrderNotification } = require("./notifications");

const createOrder = async (ctx, order, options, event) => {
  // define collection instance
  const db = getFirestore();
  const collection = db.collection(process.env.FIRESTORE_ORDER_COLLECTION);

  // generate initial order object
  const orderObject = {
    from: ctx.from.id,
    order: order.items,
    price: order.price,
    total_amount: order.total,
    created_at: Timestamp.now(),
    paid: false,
    event: event.id,
    status: "pending",
  };

  try {
    // create order
    await collection.add(orderObject);

    // notify admins
    return await adminOrderNotification(ctx, order, options);
  } catch (err) {
    throw error;
  }
};

module.exports = { createOrder };
