// --- imports
const { getFirestore } = require("firebase-admin/firestore");
const { generateOrderString } = require("../helpers/generate-order-string");

const adminOrderNotification = async (ctx, order, options) => {
  try {
    // define admin collection
    const db = getFirestore();
    const collection = db.collection(process.env.FIRESTORE_ADMIN_COLLECTION);

    // find admins with order notifications enabled
    const admins = await collection
      .where("notifications", "array-contains", "orders")
      .get();

    // send each admin a notification
    admins.forEach(async (doc) => {
      // inform that order is created
      await ctx.telegram.sendMessage(
        doc.id,
        "Eine neue Bestellung ist eingegangen:",
        {}
      );

      // send order
      await ctx.telegram.sendMessage(
        doc.id,
        generateOrderString(order, options), // TODO: display additional information (user, etc.)
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
    // define admin collection
    const db = getFirestore();
    const collection = db.collection(process.env.FIRESTORE_ADMIN_COLLECTION);

    // find admins with error notifications enabled
    const admins = await collection
      .where("notifications", "array-contains", "errors")
      .get();

    // send each admin a notification
    admins.forEach(async (doc) => {
      // inform that error occured and during which command
      await ctx.telegram.sendMessage(
        doc.id,
        `Während /${command} ist ein Fehler aufgetreten:`,
        {}
      );

      // send error
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
