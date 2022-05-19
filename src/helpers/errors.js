const handleError = async (err, ctx, command) => {
  // log to console
  console.log(err);

  // inform user
  ctx.telegram.sendMessage(
    ctx.chat.id,
    `Da scheint wohl etwas schiefgelaufen zu sein, der Bot konnte die Anfrage leider nicht verarbeiten. Bitte versuche es später noch einmal.`,
    {}
  );
};

export default handleError;
