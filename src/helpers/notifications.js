// --- imports
const { getFirestore } = require("firebase-admin/firestore");
const { generateOrderString } = require("./generate-order-string");

const adminOrderNotification = async (bot, order, options) => {
  try {
    const db = getFirestore();
    const collection = db.collection(process.env.FIRESTORE_ADMIN_COLLECTION);

    const admins = await collection
      .where("notifications", "array-contains", "orders")
      .get();

    admins.forEach((doc) => {
      bot.telegram.sendMessage(
        doc.id,
        "Eine neue Bestellung ist eingegangen:",
        {}
      );
      bot.telegram.sendMessage(doc.id, generateOrderString(order, options), {
        parse_mode: "MarkdownV2",
      });
    });
  } catch (err) {
    throw err;
  }
};

const adminErrorNotification = async (bot, error) => {};

module.exports = {
  adminOrderNotification,
  adminErrorNotification,
};
