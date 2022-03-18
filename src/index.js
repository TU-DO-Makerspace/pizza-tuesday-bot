const { Telegraf } = require("telegraf");
const admin = require("firebase-admin");
const { getFirestore } = require("firebase-admin/firestore");
require("firebase-admin/firestore");

// --- initialization
require("dotenv").config();
const bot = new Telegraf(process.env.TELEGRAM_TOKEN);
console.log("Successfully connected to Telegram API");
admin.initializeApp({
  credential: admin.credential.cert({
    projectId: process.env.FIREBASE_PROJECT_ID,
    clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
    privateKey: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, "\n"), // replace `\` and `n` character pairs w/ single `\n` character
  }),
});
console.log("Successfully connected to Firebase Admin");
const db = getFirestore();
console.log("Successfully connected to Firestore Firestore");

// --- commands
bot.command("start", async (ctx) => {
  const user = await checkAndCreateUser(ctx);
  bot.telegram.sendMessage(
    ctx.chat.id,
    `Yo moin, ${user.first_name}! Willkommen beim Pizza Tuesday Bot!`,
    {}
  );
});

const checkAndCreateUser = async (ctx) => {
  const id = ctx.from.id;

  // collection and document references
  const collection = db.collection(process.env.FIRESTORE_USER_COLLECTION);
  const doc = collection.doc(id.toString());

  try {
    const response = await doc.get(); // try reading from database

    // document exists -> return document data
    if (response.exists) {
      const data = response.data();
      return data;
    }
    // document does not exist -> create and return data
    else {
      delete ctx.from.id; // id is not necessary at this point
      doc.set(ctx.from);
      return ctx.from;
    }
  } catch (err) {
    console.error(err);
  }
};

// --- processing
bot.launch();
// gracefully stop bot
process.once("SIGINT", () => bot.stop("SIGINT"));
process.once("SIGTERM", () => bot.stop("SIGTERM"));
