// --- imports
require("dotenv").config();
const initBot = require("./init-bot");
// --- helpers
const checkAndCreateUser = require("./helpers/check-and-create-user");
const checkAdmin = require("./helpers/check-admin");
const handleError = require("./helpers/errors");
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
    await ctx.scene.enter("ORDER_WIZARD_SCENE_ID");
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

// --- processing
bot.launch();
// gracefully stop bot
process.once("SIGINT", () => bot.stop("SIGINT"));
process.once("SIGTERM", () => bot.stop("SIGTERM"));
