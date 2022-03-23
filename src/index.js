// --- imports
require("dotenv").config();
const initBot = require("./init-bot");
// --- helpers
const checkAndCreateUser = require("./helpers/check-and-create-user");
// --- initialization
const bot = initBot();

// --- commands
bot.command("start", async (ctx) => {
  const user = await checkAndCreateUser(ctx);
  bot.telegram.sendMessage(
    ctx.chat.id,
    `Yo moin, ${user.first_name}! Willkommen beim Pizza Tuesday Bot!`,
    {}
  );
});

bot.command("hunger", async (ctx) => {
  await ctx.scene.enter("ORDER_WIZARD_SCENE_ID");
});

// --- helper functions

// --- processing
bot.launch();
// gracefully stop bot
process.once("SIGINT", () => bot.stop("SIGINT"));
process.once("SIGTERM", () => bot.stop("SIGTERM"));
