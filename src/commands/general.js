// --- imports
const { Composer } = require("telegraf");
// --- services
const { checkAndCreateUser } = require("../services/auth");
const { getMenu, generateMenuString } = require("../services/menus");
// --- helpers
const handleError = require("../helpers/errors");

const start = Composer.command("start", async (ctx) => {
  try {
    // get user object or create a new one
    const user = await checkAndCreateUser(ctx);

    // respond with welcome message
    ctx.telegram.sendMessage(
      ctx.chat.id,
      `Yo moin, ${user.first_name}! Willkommen beim Pizza Tuesday Bot!`,
      {}
    );
  } catch (err) {
    handleError(err, ctx, "start");
  }
});

const hunger = Composer.command("hunger", async (ctx) => {
  try {
    // get menu from database
    const menu = await getMenu();

    // no menu is found -> return message that no menu is available
    if (!menu)
      return ctx.telegram.sendMessage(
        ctx.chat.id,
        "Aktuell ist noch kein Menü für den nächsten Pizza Tuesday verfügbar. Bestellungen können leider noch nicht aufgegeben werden."
      );

    // menu is found -> start order wizard
    await ctx.scene.enter("ORDER_WIZARD_SCENE_ID", {
      options: menu.options,
    });
  } catch (err) {
    handleError(err, ctx, "hunger");
  }
});

const menu = Composer.command("menu", async (ctx) => {
  try {
    // get menu from database
    const menu = await getMenu();

    // no menu is found -> return message that no menu is available
    if (!menu)
      return ctx.telegram.sendMessage(
        ctx.chat.id,
        "Aktuell ist noch kein Menü für den nächsten Pizza Tuesday verfügbar. Auch bestellungen können leider noch nicht aufgegeben werden."
      );

    // menu is found -> generate menu string and send it to user
    const menuString = generateMenuString(menu.options);
    ctx.telegram.sendMessage(ctx.chat.id, menuString, {
      parse_mode: "MarkdownV2",
    });
  } catch (err) {
    handleError(err, ctx, "menu");
  }
});

module.exports = Composer.compose([start, hunger, menu]);
