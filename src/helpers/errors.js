const { adminErrorNotification } = require("./notifications");

const handleError = async (err, bot, ctx, command) => {
  console.log(err);
  bot.telegram.sendMessage(
    ctx.chat.id,
    `Da scheint wohl etwas schiefgelaufen zu sein, der Bot konnte die Anfrage leider nicht verarbeiten. Bitte versuche es später noch einmal.`,
    {}
  );
  await adminErrorNotification(bot, err, command);
};

module.exports = handleError;
