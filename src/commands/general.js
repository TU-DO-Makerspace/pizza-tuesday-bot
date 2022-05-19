// --- imports
import { Composer } from "telegraf";

// --- helpers
import handleError from "../helpers/errors.js";

// --- introduction, first time starting the bot
const start = Composer.command("start", async (ctx) => {
  try {
    return await ctx.telegram.sendMessage(
      ctx.chat.id,
      `Willkommen beim Pizza Tuesday!`
    );
  } catch (err) {
    handleError(err, ctx, "start");
  }
});

// --- overview over possible commands
const help = Composer.command("help", async (ctx) => {
  try {
    return await ctx.telegram.sendMessage(
      ctx.chat.id,
      "TODO: Send help to user"
    );
  } catch (err) {
    handleError(err, ctx, "help");
  }
});

// --- get status of current order
const status = Composer.command("status", async (ctx) => {
  try {
    return await ctx.telegram.sendMessage(
      ctx.chat.id,
      `TODO: Send status updates to user`
    );
  } catch (err) {
    handleError(err, ctx, "status");
  }
});

// --- get status of current queue
const queue = Composer.command("queue", async (ctx) => {
  try {
    return await ctx.telegram.sendMessage(
      ctx.chat.id,
      `TODO: Send queue info to user`
    );
  } catch (err) {
    handleError(err, ctx, "status");
  }
});

export default Composer.compose([start, help, status, queue]);
