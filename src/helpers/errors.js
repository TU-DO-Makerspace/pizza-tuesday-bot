const { adminErrorNotification } = require("./notifications");

const handleError = async (err, ctx, command) => {
  console.log(err);
  ctx.telegram.sendMessage(
    ctx.chat.id,
    `Da scheint wohl etwas schiefgelaufen zu sein, der Bot konnte die Anfrage leider nicht verarbeiten. Bitte versuche es später noch einmal.`,
    {}
  );
  await adminErrorNotification(ctx, err, command);
};

module.exports = handleError;
