// --- imports
import { Composer } from "telegraf";

// --- helpers
import handleError from "../helpers/errors.js";

const start = Composer.command("start", async (ctx) => {
  try {
    return await ctx.telegram.sendMessage(
      ctx.chat.id,
      `Willkommen beim Pizza Tuesday!`
    );
  } catch (err) {
    handleError(err, ctx, "start");
  }
});

export default Composer.compose([start]);
