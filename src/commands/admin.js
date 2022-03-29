// --- imports
const { Composer } = require("telegraf");

// --- services
const { checkAdmin } = require("../services/auth");

// --- helpers
const handleError = require("../helpers/errors");

const admin = Composer.command("admin", async (ctx) => {
  try {
    const admin = await checkAdmin(ctx);
    if (!admin) return;

    ctx.telegram.sendMessage(ctx.chat.id, `Du bist ein Admin!`, {});
  } catch (err) {
    handleError(err, bot, ctx, "admin");
  }
});

module.exports = Composer.compose([admin]);
