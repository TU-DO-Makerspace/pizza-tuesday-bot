const { Telegraf } = require("telegraf");
const { initializeApp } = require("firebase-admin/app");

// --- initialization
require("dotenv").config();
const bot = new Telegraf(process.env.TELEGRAM_TOKEN);
console.log("Successfully connected to Telegram API");
const app = initializeApp();
console.log("Successfully connected to Firebase");

// --- commands
bot.command("start", (ctx) => {
  console.log(ctx.from);
  bot.telegram.sendMessage(
    ctx.chat.id,
    "hello there! Welcome to my new telegram bot.",
    {}
  );
});

// --- processing
bot.launch();

process.once("SIGINT", () => bot.stop("SIGINT"));
process.once("SIGTERM", () => bot.stop("SIGTERM"));
