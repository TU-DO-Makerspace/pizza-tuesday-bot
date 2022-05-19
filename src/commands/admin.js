// --- imports
import { Composer } from "telegraf";
// --- helpers
import handleError from "../helpers/errors.js";
// --- middleware
import { checkAdmin } from "../services/auth.js";

const admin = Composer.command("admin", async (ctx) => {
  if (!(await checkAdmin(ctx))) return;

  try {
    ctx.telegram.sendMessage(ctx.chat.id, `Du bist ein Admin!`, {});
  } catch (err) {
    handleError(err, bot, ctx, "admin");
  }
});

export default Composer.compose([admin]);
