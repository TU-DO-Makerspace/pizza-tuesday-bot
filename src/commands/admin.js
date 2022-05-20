// --- imports
import { Composer } from "telegraf";
// --- helpers
import handleError from "../helpers/errors.js";
// --- middleware
import { checkAdmin } from "../services/auth.js";
import { addToQueue, updateQueue } from "../services/queue.js";
import {
  orderCreationNotification,
  orderUpdateNotification,
} from "../services/user_notifications.js";

const admin = Composer.command("admin", async (ctx) => {
  if (!(await checkAdmin(ctx))) return;

  try {
    return await ctx.telegram.sendMessage(
      ctx.chat.id,
      `Hallo, du bist ein Admin\\! \n\n` +
        `Du kannst: \n\n` +
        `/new \\[USERNAME\\] \\[BESTELLUNG\\]\n` +
        `\\- Eine *neue Bestellung* aufnehmen\n\n` +
        `/setpayed \\[NUMMER\\]\n/setnotpayed \\[NUMMER\\]\n` +
        `\\- Eine Bestellung als *bezahlt* oder nicht bezahlt markieren\n\n` +
        `/setpending \\[NUMMER\\]\n` +
        `\\- Bestellstatus auf *in Warteschlange* setzen\n\n` +
        `/setoven \\[NUMMER\\]\n` +
        `\\- Bestellstatus auf *im Ofen* setzen\n\n` +
        `/setdone \\[NUMMER\\]\n` +
        `\\- Bestellstatus auf *Abholbereit* setzen\n\n` +
        `/setpickedup \\[NUMMER\\]\n` +
        `\\- Bestellstatus auf *Abgeholt* setzen\n\n` +
        `/cancel \\[NUMMER\\]\n` +
        `\\- Eine Bestellung *abbrechen*\n\n` +
        `/move \\[NUMMER\\] \\[NEUE\\_POSITION\\]\n` +
        `\\- Eine Bestellung in der Warteschlange *verschieben*\n\n` +
        `/contact \\[USERNAME\\]\n` +
        `\\- Einen *User kontaktieren*\n\n` +
        `/adminqueue\n` +
        `\\- Die komplette *Warteschlange* mit allen Details anzeigen\n\n`,
      { parse_mode: "MarkdownV2" }
    );
  } catch (err) {
    handleError(err, ctx);
  }
});

const newOrder = Composer.command("new", async (ctx) => {
  if (!(await checkAdmin(ctx))) return;
  const msg = ctx.message.text;

  try {
    const [command, username, order, payed] = msg.split(" ");

    if (!username || !order) {
      return await ctx.telegram.sendMessage(
        ctx.chat.id,
        "Bitte gib einen *Usernamen* und eine *Bestellung* an:\n\n" +
          "/new \\[USERNAME\\] \\[BESTELLUNG\\] \\[BEZAHLT \\(true\\/false\\)\\]",
        { parse_mode: "MarkdownV2" }
      );
    }

    const options = {
      username,
      order,
      payed: payed === "true",
    };

    const response = await addToQueue(options);
    await orderCreationNotification({ ctx, username, order: response });

    return await ctx.telegram.sendMessage(
      ctx.chat.id,
      `Bestellung \\#*${response.id}* wurde aufgenommen:\n\n` +
        `Username: *${response.user}*\n` +
        `Bestellung: *${response.order}*\n` +
        `Bezahlt: *${response.payed ? "Bezahlt" : "Nicht bezahlt"}*\n` +
        `Position in Warteschlange: *${response.position}*\n` +
        `Geschätzte Dauer: *${response.estimated_duration} Minuten*`,
      { parse_mode: "MarkdownV2" }
    );
  } catch (err) {
    handleError(err, ctx);
  }
});

const setOrderPayed = Composer.command("setpayed", async (ctx) => {
  if (!(await checkAdmin(ctx))) return;
  const msg = ctx.message.text;

  try {
    const [command, id] = msg.split(" ");

    if (!id) {
      return await ctx.telegram.sendMessage(
        ctx.chat.id,
        "Bitte gib eine *Bestellnummer* an:\n\n" + "/setpayed \\[NUMMER\\]",
        { parse_mode: "MarkdownV2" }
      );
    }

    const options = {
      order_id: id,
      field: "payed",
      value: true,
    };

    const response = await updateQueue(options);
    if (!response) {
      return await ctx.telegram.sendMessage(
        ctx.chat.id,
        `Die Bestellung \\#*${id}* konnte nicht gefunden werden\\.`,
        { parse_mode: "MarkdownV2" }
      );
    }

    const updateObj = {
      ctx,
      order: response,
      field: "payed",
      value: true,
    };

    await orderUpdateNotification(updateObj);

    return await ctx.telegram.sendMessage(
      ctx.chat.id,
      `Die Bestellung \\#*${id}* wurde als *bezahlt* markiert\\.`,
      { parse_mode: "MarkdownV2" }
    );
  } catch (err) {
    handleError(err, ctx);
  }
});

const setOrderNotPayed = Composer.command("setnotpayed", async (ctx) => {
  if (!(await checkAdmin(ctx))) return;
  const msg = ctx.message.text;

  try {
    const [command, id] = msg.split(" ");

    if (!id) {
      return await ctx.telegram.sendMessage(
        ctx.chat.id,
        "Bitte gib eine *Bestellnummer* an:\n\n" + "/setnotpayed \\[NUMMER\\]",
        { parse_mode: "MarkdownV2" }
      );
    }

    const options = {
      order_id: id,
      field: "payed",
      value: false,
    };

    const response = await updateQueue(options);
    if (!response) {
      return await ctx.telegram.sendMessage(
        ctx.chat.id,
        `Die Bestellung \\#*${id}* konnte nicht gefunden werden\\.`,
        { parse_mode: "MarkdownV2" }
      );
    }

    const updateObj = {
      ctx,
      order: response,
      field: "payed",
      value: false,
    };

    await orderUpdateNotification(updateObj);

    return await ctx.telegram.sendMessage(
      ctx.chat.id,
      `Die Bestellung \\#*${id}* wurde als *nicht bezahlt* markiert\\.`,
      { parse_mode: "MarkdownV2" }
    );
  } catch (err) {
    handleError(err, ctx);
  }
});

const setOrderPending = Composer.command("setpending", async (ctx) => {
  if (!(await checkAdmin(ctx))) return;
  const msg = ctx.message.text;

  try {
    const [command, id] = msg.split(" ");

    if (!id) {
      return await ctx.telegram.sendMessage(
        ctx.chat.id,
        "Bitte gib eine *Bestellnummer* an:\n\n" + "/setpending \\[NUMMER\\]",
        { parse_mode: "MarkdownV2" }
      );
    }

    const options = {
      order_id: id,
      field: "status",
      value: "pending",
    };

    const response = await updateQueue(options);
    if (!response) {
      return await ctx.telegram.sendMessage(
        ctx.chat.id,
        `Die Bestellung \\#*${id}* konnte nicht gefunden werden\\.`,
        { parse_mode: "MarkdownV2" }
      );
    }

    const updateObj = {
      ctx,
      order: response,
      field: "status",
      value: "in Warteschlange",
    };

    await orderUpdateNotification(updateObj);

    return await ctx.telegram.sendMessage(
      ctx.chat.id,
      `Der Status der Bestellung \\#*${id}* wurde auf *in Warteschlange* gesetzt\\.`,
      { parse_mode: "MarkdownV2" }
    );
  } catch (err) {
    handleError(err, ctx);
  }
});

const setOrderProcessing = Composer.command("setoven", async (ctx) => {
  if (!(await checkAdmin(ctx))) return;
  const msg = ctx.message.text;

  try {
    const [command, id] = msg.split(" ");

    if (!id) {
      return await ctx.telegram.sendMessage(
        ctx.chat.id,
        "Bitte gib eine *Bestellnummer* an:\n\n" + "/setoven \\[NUMMER\\]",
        { parse_mode: "MarkdownV2" }
      );
    }

    const options = {
      order_id: id,
      field: "status",
      value: "processing",
    };

    const response = await updateQueue(options);
    if (!response) {
      return await ctx.telegram.sendMessage(
        ctx.chat.id,
        `Die Bestellung \\#*${id}* konnte nicht gefunden werden\\.`,
        { parse_mode: "MarkdownV2" }
      );
    }

    const updateObj = {
      ctx,
      order: response,
      field: "status",
      value: "im Ofen",
    };

    await orderUpdateNotification(updateObj);

    return await ctx.telegram.sendMessage(
      ctx.chat.id,
      `Der Status der Bestellung \\#*${id}* wurde auf *im Ofen* gesetzt\\.`,
      { parse_mode: "MarkdownV2" }
    );
  } catch (err) {
    handleError(err, ctx);
  }
});

const setOrderProcessed = Composer.command("setdone", async (ctx) => {
  if (!(await checkAdmin(ctx))) return;
  const msg = ctx.message.text;

  try {
    const [command, id] = msg.split(" ");

    if (!id) {
      return await ctx.telegram.sendMessage(
        ctx.chat.id,
        "Bitte gib eine *Bestellnummer* an:\n\n" + "/setdone \\[NUMMER\\]",
        { parse_mode: "MarkdownV2" }
      );
    }

    const options = {
      order_id: id,
      field: "status",
      value: "done",
    };

    const response = await updateQueue(options);
    if (!response) {
      return await ctx.telegram.sendMessage(
        ctx.chat.id,
        `Die Bestellung \\#*${id}* konnte nicht gefunden werden\\.`,
        { parse_mode: "MarkdownV2" }
      );
    }

    const updateObj = {
      ctx,
      order: response,
      field: "status",
      value: "Abholbereit",
    };

    await orderUpdateNotification(updateObj);

    return await ctx.telegram.sendMessage(
      ctx.chat.id,
      `Der Status der Bestellung \\#*${id}* wurde auf *Abholbereit* gesetzt\\.`,
      { parse_mode: "MarkdownV2" }
    );
  } catch (err) {
    handleError(err, ctx);
  }
});

const setOrderPickedUp = Composer.command("setpickedup", async (ctx) => {
  if (!(await checkAdmin(ctx))) return;
  const msg = ctx.message.text;

  try {
    const [command, id] = msg.split(" ");

    if (!id) {
      return await ctx.telegram.sendMessage(
        ctx.chat.id,
        "Bitte gib eine *Bestellnummer* an:\n\n" + "/setpickedup \\[NUMMER\\]",
        { parse_mode: "MarkdownV2" }
      );
    }

    const options = {
      order_id: id,
      field: "status",
      value: "delivered",
    };

    const response = await updateQueue(options);
    if (!response) {
      return await ctx.telegram.sendMessage(
        ctx.chat.id,
        `Die Bestellung \\#*${id}* konnte nicht gefunden werden\\.`,
        { parse_mode: "MarkdownV2" }
      );
    }

    const updateObj = {
      ctx,
      order: response,
      field: "status",
      value: "Abgeholt",
    };

    await orderUpdateNotification(updateObj);

    return await ctx.telegram.sendMessage(
      ctx.chat.id,
      `Der Status der Bestellung \\#*${id}* wurde auf *Abgeholt* gesetzt\\.`,
      { parse_mode: "MarkdownV2" }
    );
  } catch (err) {
    handleError(err, ctx);
  }
});

const cancelOrder = Composer.command("cancel", async (ctx) => {
  if (!(await checkAdmin(ctx))) return;

  try {
    ctx.telegram.sendMessage(ctx.chat.id, `TODO: Bestellung abbrechen!`, {});
  } catch (err) {
    handleError(err, ctx);
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
    handleError(err, ctx);
  }
});

const contactUser = Composer.command("contact", async (ctx) => {
  if (!(await checkAdmin(ctx))) return;

  try {
    ctx.telegram.sendMessage(ctx.chat.id, `TODO: User kontaktieren!`, {});
  } catch (err) {
    handleError(err, ctx);
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
    handleError(err, ctx);
  }
});

export default Composer.compose([
  admin,
  newOrder,
  setOrderPayed,
  setOrderNotPayed,
  setOrderPending,
  setOrderProcessing,
  setOrderProcessed,
  setOrderPickedUp,
  cancelOrder,
  showQueue,
  contactUser,
  moveOrder,
]);
