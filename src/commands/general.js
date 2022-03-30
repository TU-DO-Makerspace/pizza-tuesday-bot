// --- imports
const { Composer } = require("telegraf");
// --- services
const { checkAndCreateUser } = require("../services/auth");
const { getNextEvent } = require("../services/events");
const { getMenu, generateMenuString } = require("../services/menus");
// --- helpers
const handleError = require("../helpers/errors");
const { timestampToDateString } = require("../helpers/dates");

const start = Composer.command("start", async (ctx) => {
  try {
    // get user object or create a new one
    const user = await checkAndCreateUser(ctx);

    // get next event
    const event = await getNextEvent();

    // respond with welcome message
    await ctx.telegram.sendMessage(
      ctx.chat.id,
      `Yo moin, ${user.first_name}! Willkommen beim Pizza Tuesday Bot!`
    );

    // respond with announcement of next pizza tuesday
    if (!event)
      return await ctx.telegram.sendMessage(
        ctx.chat.id,
        "Aktuell steht kein nächster Pizza Tuesday an."
      );
    else
      return await ctx.telegram.sendMessage(
        ctx.chat.id,
        `Der nächste Pizza Tuesday findet am ${timestampToDateString(
          event.date
        )} statt.`
      );
  } catch (err) {
    handleError(err, ctx, "start");
  }
});

const wann = Composer.command("wann", async (ctx) => {
  try {
    // get next event
    const event = await getNextEvent();

    // respond with announcement of next pizza tuesday
    if (!event)
      return ctx.telegram.sendMessage(
        ctx.chat.id,
        "Aktuell steht kein nächster Pizza Tuesday an."
      );
    else
      return ctx.telegram.sendMessage(
        ctx.chat.id,
        `Der nächste Pizza Tuesday findet am ${timestampToDateString(
          event.date
        )} statt.`
      );
  } catch (err) {
    handleError(err, ctx, "wann");
  }
});

const hunger = Composer.command("hunger", async (ctx) => {
  try {
    // get next pizza tuesday
    const event = await getNextEvent();
    if (!event)
      return await ctx.telegram.sendMessage(
        ctx.chat.id,
        "Aktuell steht kein nächster Pizza Tuesday an."
      );

    // check if ordering is possible
    if (!event.orders_open)
      return await ctx.telegram.sendMessage(
        ctx.chat.id,
        "Bestellungen können leider noch nicht aufgegeben werden oder der Bestellzeitraum für diesen Pizza Tuesday ist bereits vorüber."
      );

    // get menu from database
    const menu = await getMenu(event.id);
    if (!menu)
      return await ctx.telegram.sendMessage(
        ctx.chat.id,
        "Aktuell ist noch kein Menü für den nächsten Pizza Tuesday verfügbar. Bestellungen können leider noch nicht aufgegeben werden."
      );

    // announce date of pizza tuesday
    await ctx.telegram.sendMessage(
      ctx.chat.id,
      `Diese Bestellung gilt für den Pizza Tuesday am ${timestampToDateString(
        event.date
      )}.`
    );

    // menu is found -> start order wizard
    await ctx.scene.enter("ORDER_WIZARD_SCENE_ID", {
      options: menu.options,
      event,
    });
  } catch (err) {
    handleError(err, ctx, "hunger");
  }
});

const menu = Composer.command("menu", async (ctx) => {
  try {
    // get next pizza tuesday
    const event = await getNextEvent();
    if (!event)
      return await ctx.telegram.sendMessage(
        ctx.chat.id,
        "Aktuell steht kein nächster Pizza Tuesday an."
      );

    // get menu from database
    const menu = await getMenu(event.id);

    // no menu is found -> return message that no menu is available
    if (!menu)
      return await ctx.telegram.sendMessage(
        ctx.chat.id,
        "Aktuell ist noch kein Menü für den nächsten Pizza Tuesday verfügbar. Auch Bestellungen können leider noch nicht aufgegeben werden."
      );

    // menu is found -> generate menu string and send it to user
    const menuString = generateMenuString(menu.options);
    await ctx.telegram.sendMessage(ctx.chat.id, menuString, {
      parse_mode: "MarkdownV2",
    });
  } catch (err) {
    handleError(err, ctx, "menu");
  }
});

module.exports = Composer.compose([start, wann, hunger, menu]);
