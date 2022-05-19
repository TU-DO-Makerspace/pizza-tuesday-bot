// --- imports
import { Composer } from "telegraf";
// --- helpers
import handleError from "../helpers/errors.js";
// --- middleware
import { checkAdmin } from "../services/auth.js";

const admin = Composer.command("admin", async (ctx) => {
  if (!(await checkAdmin(ctx))) return;

  try {
    return await ctx.telegram.sendMessage(
      ctx.chat.id,
      `Hallo, du bist ein Admin\\! \n\n` +
        `Du kannst: \n\n` +
        `/new\n` +
        `\\- Eine *neue Bestellung* aufnehmen\n\n` +
        `/setpayed /setnotpayed\n` +
        `\\- Eine Bestellung als *bezahlt* oder nicht bezahlt markieren\n\n` +
        `/setoven /setnotoven\n` +
        `\\- Eine Bestellung als *im Ofen* oder nicht im Ofen markieren\n\n` +
        `/setdone /setnotdone\n` +
        `\\- Eine Bestellung als *fertig* oder nicht fertig markieren\n\n` +
        `/setpickedup /setnotpickedup\n` +
        `\\- Eine Bestellung als *abgeholt* oder nicht abgeholt markieren\n\n` +
        `/cancel\n` +
        `\\- Eine Bestellung *abbrechen*\n\n` +
        `/move\n` +
        `\\- Eine Bestellung in der Warteschlange *verschieben*\n\n` +
        `/contact\n` +
        `\\- Einen *User kontaktieren*\n\n` +
        `/adminqueue\n` +
        `\\- Die komplette *Warteschlange* mit allen Details anzeigen\n\n`,
      { parse_mode: "MarkdownV2" }
    );
  } catch (err) {
    handleError(err, bot, ctx, "admin");
  }
});

const newOrder = Composer.command("new", async (ctx) => {
  if (!(await checkAdmin(ctx))) return;

  try {
    ctx.telegram.sendMessage(
      ctx.chat.id,
      `TODO: neue Bestellung aufnehmen!`,
      {}
    );
  } catch (err) {
    handleError(err, bot, ctx, "admin");
  }
});

const setOrderPayed = Composer.command("setpayed", async (ctx) => {
  if (!(await checkAdmin(ctx))) return;

  try {
    ctx.telegram.sendMessage(
      ctx.chat.id,
      `TODO: Bestellung als bezahlt markieren!`,
      {}
    );
  } catch (err) {
    handleError(err, bot, ctx, "admin");
  }
});

const setOrderNotPayed = Composer.command("setnotpayed", async (ctx) => {
  if (!(await checkAdmin(ctx))) return;

  try {
    ctx.telegram.sendMessage(
      ctx.chat.id,
      `TODO: Bestellung als nicht bezahlt markieren!`,
      {}
    );
  } catch (err) {
    handleError(err, bot, ctx, "admin");
  }
});

const setOrderProcessing = Composer.command("setoven", async (ctx) => {
  if (!(await checkAdmin(ctx))) return;

  try {
    ctx.telegram.sendMessage(
      ctx.chat.id,
      `TODO: Bestellung als im Ofen markieren!`,
      {}
    );
  } catch (err) {
    handleError(err, bot, ctx, "admin");
  }
});

const setOrderNotProcessing = Composer.command("setnotoven", async (ctx) => {
  if (!(await checkAdmin(ctx))) return;

  try {
    ctx.telegram.sendMessage(
      ctx.chat.id,
      `TODO: Bestellung als nicht im Ofen markieren!`,
      {}
    );
  } catch (err) {
    handleError(err, bot, ctx, "admin");
  }
});

const setOrderProcessed = Composer.command("setdone", async (ctx) => {
  if (!(await checkAdmin(ctx))) return;

  try {
    ctx.telegram.sendMessage(
      ctx.chat.id,
      `TODO: Bestellung als fertig markieren!`,
      {}
    );
  } catch (err) {
    handleError(err, bot, ctx, "admin");
  }
});

const setOrderNotProcessed = Composer.command("setnotdone", async (ctx) => {
  if (!(await checkAdmin(ctx))) return;

  try {
    ctx.telegram.sendMessage(
      ctx.chat.id,
      `TODO: Bestellung als nicht fertig markieren!`,
      {}
    );
  } catch (err) {
    handleError(err, bot, ctx, "admin");
  }
});

const setOrderPickedUp = Composer.command("setpickedup", async (ctx) => {
  if (!(await checkAdmin(ctx))) return;

  try {
    ctx.telegram.sendMessage(
      ctx.chat.id,
      `TODO: Bestellung als abgeholt markieren!`,
      {}
    );
  } catch (err) {
    handleError(err, bot, ctx, "admin");
  }
});

const setOrderNotPickedUp = Composer.command("setnotpickedup", async (ctx) => {
  if (!(await checkAdmin(ctx))) return;

  try {
    ctx.telegram.sendMessage(
      ctx.chat.id,
      `TODO: Bestellung als nicht abgeholt markieren!`,
      {}
    );
  } catch (err) {
    handleError(err, bot, ctx, "admin");
  }
});

const cancelOrder = Composer.command("cancel", async (ctx) => {
  if (!(await checkAdmin(ctx))) return;

  try {
    ctx.telegram.sendMessage(ctx.chat.id, `TODO: Bestellung abbrechen!`, {});
  } catch (err) {
    handleError(err, bot, ctx, "admin");
  }
});

const showQueue = Composer.command("adminqueue", async (ctx) => {
  if (!(await checkAdmin(ctx))) return;

  try {
    ctx.telegram.sendMessage(
      ctx.chat.id,
      `TODO: Warteschlange mit Details anzeigen!`,
      {}
    );
  } catch (err) {
    handleError(err, bot, ctx, "admin");
  }
});

const contactUser = Composer.command("contact", async (ctx) => {
  if (!(await checkAdmin(ctx))) return;

  try {
    ctx.telegram.sendMessage(ctx.chat.id, `TODO: User kontaktieren!`, {});
  } catch (err) {
    handleError(err, bot, ctx, "admin");
  }
});

const moveOrder = Composer.command("move", async (ctx) => {
  if (!(await checkAdmin(ctx))) return;

  try {
    ctx.telegram.sendMessage(
      ctx.chat.id,
      `TODO: Reihenfolge der Bestellung ändern!`,
      {}
    );
  } catch (err) {
    handleError(err, bot, ctx, "admin");
  }
});

export default Composer.compose([
  admin,
  newOrder,
  setOrderPayed,
  setOrderNotPayed,
  setOrderProcessing,
  setOrderNotProcessing,
  setOrderProcessed,
  setOrderNotProcessed,
  setOrderPickedUp,
  setOrderNotPickedUp,
  cancelOrder,
  showQueue,
  contactUser,
  moveOrder,
]);
