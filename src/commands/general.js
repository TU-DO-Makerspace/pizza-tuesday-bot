// --- imports
import { Composer } from "telegraf";
// --- services
import { getUser } from "../services/auth.js";
import { getQueueLength, getOrdersFromUser } from "../services/queue.js";
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
  try {
    return await ctx.telegram.sendMessage(
      ctx.chat.id,
      `Hallo, Ich bin der Pizza Tuesday Bot\\! \n\n` +
        `Ich kann: \n` +
        `\\- Den *Status deiner Bestellung* anzeigen lassen \\(/status\\) \n` +
        `\\- Die *Länge der Warteschlange* ausgeben \\(/queue\\) \n\n` +
        `Ich bin aktuell noch in der Beta\\-Phase\\. Mit der Zeit werden Verbesserungen vorgenommen und weitere Features hinzugefügt\\.\n\n` +
        `_Bestellungen kannst du bei mir nicht aufgeben\\. Komm dazu bitte persönlich vorbei \\- ist eh viel cooler\\!_`,
      { parse_mode: "MarkdownV2" }
    );
  } catch (err) {
    handleError(err, ctx, "help");
  }
});

// --- get status of current order
const status = Composer.command("status", async (ctx) => {
  try {
    await getUser(ctx);
    const orders = await getOrdersFromUser(ctx);

    if (orders === null || orders.length === null) {
      return await ctx.telegram.sendMessage(
        ctx.chat.id,
        `Du hast heute noch keine Bestellungen aufgegeben\\.`,
        { parse_mode: "MarkdownV2" }
      );
    }

    const overview = orders.map((order, index) => {
      return (
        `*Bestellung ${index}*:\n` +
        `*${order.title}*\n` +
        `${order.status}\n` +
        `${order.position}\n`
      );
    });

    return await ctx.telegram.sendMessage(ctx.chat.id, overview, {
      parse_mode: "MarkdownV2",
    });
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
          `\\Es kann sein, dass der Pizza Tuesday noch nicht begonnen hat, oder heute kein Pizza Tuesday stattfindet\\. Halte in diesem Channel einfach nach einer Ankündigung ausschau: t\\.me/pizzatuesday`,
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
