// --- imports
const { getFirestore } = require("firebase-admin/firestore");
const { generateOrderString } = require("../helpers/generate-order-string");

const adminOrderNotification = async (ctx, order, options) => {
  try {
    const db = getFirestore();
    const collection = db.collection(process.env.FIRESTORE_ADMIN_COLLECTION);

    const admins = await collection
      .where("notifications", "array-contains", "orders")
      .get();

    admins.forEach(async (doc) => {
      await ctx.telegram.sendMessage(
        doc.id,
        "Eine neue Bestellung ist eingegangen:",
        {}
      );
      await ctx.telegram.sendMessage(
        doc.id,
        generateOrderString(order, options),
        {
          parse_mode: "MarkdownV2",
        }
      );
    });
  } catch (err) {
    throw err;
  }
};

const adminErrorNotification = async (ctx, error, command) => {
  try {
    const db = getFirestore();
    const collection = db.collection(process.env.FIRESTORE_ADMIN_COLLECTION);

    const admins = await collection
      .where("notifications", "array-contains", "errors")
      .get();

    admins.forEach(async (doc) => {
      await ctx.telegram.sendMessage(
        doc.id,
        `Während /${command} ist ein Fehler aufgetreten:`,
        {}
      );
      await ctx.telegram.sendMessage(doc.id, error.toString(), {});
    });
  } catch (err) {
    throw err;
  }
};

module.exports = {
  adminOrderNotification,
  adminErrorNotification,
};
