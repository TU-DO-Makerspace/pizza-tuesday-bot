// --- imports
import { Telegraf } from "telegraf";
import admin from "firebase-admin";
import { getFirestore } from "firebase-admin/firestore";

const initBot = () => {
  // init bot
  const bot = new Telegraf(process.env.TELEGRAM_TOKEN);
  console.log("Successfully connected to Telegram API");

  // init firebase
  admin.initializeApp({
    credential: admin.credential.cert({
      projectId: process.env.FIREBASE_PROJECT_ID,
      clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
      privateKey: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, "\n"), // replace `\` and `n` character pairs w/ single `\n` character
    }),
  });
  console.log("Successfully connected to Firebase Admin");

  // init firestore
  getFirestore();
  console.log("Successfully connected to Firestore");

  return bot;
};

export default initBot;
