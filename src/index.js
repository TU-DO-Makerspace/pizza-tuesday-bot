// --- imports
require("dotenv").config();
const initBot = require("./init-bot");
// --- helpers
const checkAndCreateUser = require("./helpers/check-and-create-user");
const checkAdmin = require("./helpers/check-admin");
const handleError = require("./helpers/errors");
const { getMenu, generateMenuString } = require("./helpers/menus");
// --- initialization
const bot = initBot();

// --- commands
bot.command("start", async (ctx) => {
  try {
    const user = await checkAndCreateUser(ctx);
    bot.telegram.sendMessage(
      ctx.chat.id,
      `Yo moin, ${user.first_name}! Willkommen beim Pizza Tuesday Bot!`,
      {}
    );
  } catch (err) {
    handleError(err, bot, ctx);
  }
});

bot.command("hunger", async (ctx) => {
  try {
    const menu = await getMenu();
    if (!menu)
      return bot.telegram.sendMessage(
        ctx.chat.id,
        "Aktuell ist noch kein Menü für den nächsten Pizza Tuesday verfügbar. Bestellungen können leider noch nicht aufgegeben werden."
      );

    await ctx.scene.enter("ORDER_WIZARD_SCENE_ID", {
      bot,
      options: menu.options,
    });
  } catch (err) {
    handleError(err, bot, ctx);
  }
});

bot.command("admin", async (ctx) => {
  try {
    const admin = await checkAdmin(ctx, bot);
    if (!admin) return;

    bot.telegram.sendMessage(ctx.chat.id, `Du bist ein Admin!`, {});
  } catch (err) {
    handleError(err, bot, ctx);
  }
});

bot.command("menu", async (ctx) => {
  try {
    const menu = await getMenu();
    if (!menu)
      return bot.telegram.sendMessage(
        ctx.chat.id,
        "Aktuell ist noch kein Menü für den nächsten Pizza Tuesday verfügbar. Auch bestellungen können leider noch nicht aufgegeben werden."
      );
    const menuString = generateMenuString(menu.options);
    bot.telegram.sendMessage(ctx.chat.id, menuString, {
      parse_mode: "MarkdownV2",
    });
  } catch (err) {
    handleError(err, bot, ctx);
  }
});

// --- processing
bot.launch();
// gracefully stop bot
process.once("SIGINT", () => bot.stop("SIGINT"));
process.once("SIGTERM", () => bot.stop("SIGTERM"));
