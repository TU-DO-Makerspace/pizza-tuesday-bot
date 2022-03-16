const { Telegraf } = require("telegraf");
const admin = require("firebase-admin");
require("firebase-admin/firestore");

// --- initialization
require("dotenv").config();
const bot = new Telegraf(process.env.TELEGRAM_TOKEN);
console.log("Successfully connected to Telegram API");
admin.initializeApp();
console.log("Successfully connected to Firebase");
const db = admin.firestore();
console.log("Successfully connected to Firestore");

// --- commands
bot.command("start", async (ctx) => {
  console.log(await checkAndCreateUser(ctx));
  bot.telegram.sendMessage(
    ctx.chat.id,
    "Yo moin, willkommen beim Pizza Tuesday Bot!",
    {}
  );
});

const checkAndCreateUser = async (ctx) => {
  const id = ctx.from.id;

  const collection = db.collection(process.env.FIRESTORE_USER_COLLECTION);
  const doc = collection.doc(id.toString());

  try {
    const response = await doc.get();

    if (response.exists) {
      return "User already exists.";
    } else {
      return "User does not yet exist.";
    }
  } catch (err) {
    console.error(err);
  }
};

// --- processing
bot.launch();

process.once("SIGINT", () => bot.stop("SIGINT"));
process.once("SIGTERM", () => bot.stop("SIGTERM"));
