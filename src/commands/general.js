// --- imports
import { Composer } from "telegraf";
// --- services
import { getUser } from "../services/auth.js";
import { getQueueLength } from "../services/queue.js";
// --- helpers
import handleError from "../helpers/errors.js";

// --- introduction, first time starting the bot
const start = Composer.command("start", async (ctx) => {
  try {
    await getUser(ctx);
    return await ctx.telegram.sendMessage(
      ctx.chat.id,
      `Hallo ${ctx.user.first_name}, willkommen beim Pizza Tuesday\\! \n\n` +
        `Ich bin ein Bot, der dich über den aktuellen *Status deiner Bestellung* und mehr informiert\\.\n\n` +
        `Du kannst mich mit /help fragen, um mehr über mich zu erfahren\\.`,
      { parse_mode: "MarkdownV2" }
    );
  } catch (err) {
    handleError(err, ctx, "start");
  }
});

// --- overview over possible commands
const help = Composer.command("help", async (ctx) => {
  // TODO
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
  // TODO
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
    const queueLength = await getQueueLength();

    // queue does not exist
    if (queueLength === null) {
      return await ctx.telegram.sendMessage(
        ctx.chat.id,
        `Die Warteschlange ist leer\\!\n\n` +
          `_\\(Es kann ebenfalls sein, dass heute kein Pizza Tuesday stattfindet, halte in diesem Channel einfach nach einer Ankündigung ausschau: t\\.me/pizzatuesday\\)_`,
        { parse_mode: "MarkdownV2" }
      );
    }

    // queue is empty
    if (queueLength === 0) {
      return await ctx.telegram.sendMessage(
        ctx.chat.id,
        `Die Warteschlange ist leer \\- komm vorbei und sei der erste\\!`,
        { parse_mode: "MarkdownV2" }
      );
    }

    // calculate estimated waiting time
    const estTime = queueLength * 7;

    return await ctx.telegram.sendMessage(
      ctx.chat.id,
      `Warteschlange: *${queueLength} Pizzen*\n` +
        `Geschätzte Wartezeit: *${estTime} Minuten*\\.`,
      { parse_mode: "MarkdownV2" }
    );
  } catch (err) {
    handleError(err, ctx, "status");
  }
});

export default Composer.compose([start, help, status, queue]);
