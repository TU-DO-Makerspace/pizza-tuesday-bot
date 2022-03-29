// --- imports
const { Composer } = require("telegraf");

// --- helpers
const checkAdmin = require("../helpers/check-admin");
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
