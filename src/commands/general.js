// --- imports
const { Composer } = require("telegraf");

// --- helpers
const checkAndCreateUser = require("../helpers/check-and-create-user");
const handleError = require("../helpers/errors");
const { getMenu, generateMenuString } = require("../services/menus");

const start = Composer.command("start", async (ctx) => {
  try {
    const user = await checkAndCreateUser(ctx);
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
    const menu = await getMenu();
    if (!menu)
      return ctx.telegram.sendMessage(
        ctx.chat.id,
        "Aktuell ist noch kein Menü für den nächsten Pizza Tuesday verfügbar. Bestellungen können leider noch nicht aufgegeben werden."
      );

    await ctx.scene.enter("ORDER_WIZARD_SCENE_ID", {
      options: menu.options,
    });
  } catch (err) {
    handleError(err, ctx, "hunger");
  }
});

const menu = Composer.command("menu", async (ctx) => {
  try {
    const menu = await getMenu();
    if (!menu)
      return ctx.telegram.sendMessage(
        ctx.chat.id,
        "Aktuell ist noch kein Menü für den nächsten Pizza Tuesday verfügbar. Auch bestellungen können leider noch nicht aufgegeben werden."
      );
    const menuString = generateMenuString(menu.options);
    ctx.telegram.sendMessage(ctx.chat.id, menuString, {
      parse_mode: "MarkdownV2",
    });
  } catch (err) {
    handleError(err, ctx, "menu");
  }
});

module.exports = Composer.compose([start, hunger, menu]);
