const menuSelection = async (ctx) => {
  // get input
  const response = ctx.message.text;

  if (ctx.session.order.total > 0 && (response === "X" || response === "x")) {
    ctx.wizard.selectStep(3);
    return ctx.wizard.steps[ctx.wizard.cursor](ctx);
  }

  let id = parseInt(response);

  // validate input
  if (isNaN(id)) {
    await ctx.reply(
      "Deine Eingabe ist ungültig. Bitte gib nur die Nummer ein und versuche es erneut."
    );
    return;
  } else if (id < 0 || id > ctx.scene.state.options.length) {
    await ctx.reply(
      `Die Nummer ${id} existiert leider nicht. Schaue noch einmal aufs Menü und versuche es erneut.`
    );
    return;
  } else if (id === 0) {
    await ctx.reply("Der Bestellvorgang wurde abgebrochen.");
    return ctx.scene.leave();
  }

  // update order
  ctx.session.order.items.push({ id: id - 1, amount: 0 });

  // respond
  const answer = ctx.scene.state.options[id - 1];
  await ctx.replyWithMarkdownV2(
    `Du möchtest *${answer.title}* bestellen? Wie viele möchtest du denn? \n _\\(Wenn du dich verwählt hast, gib einfach 0 ein\\)_`
  );
  return ctx.wizard.next();
};

module.exports = menuSelection;
