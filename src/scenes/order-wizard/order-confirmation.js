// --- services
const { createOrder } = require("../../services/orders");

const orderConfirmation = async (ctx) => {
  // get input
  const response = ctx.message.text;
  let id = parseInt(response);
  const total = ctx.session.order.total;

  // validate input
  if (isNaN(id)) {
    await ctx.reply(
      "Deine Eingabe ist ungültig. Bitte gib nur die Nummer ein und versuche es erneut."
    );
    return;
  } else if (id < 0 || id > 2) {
    await ctx.reply("Diese Option existiert leider nicht.");
    return;
  } else if (id === 0) {
    await ctx.reply("Der Bestellvorgang wurde abgebrochen.");
    return ctx.scene.leave();
  }

  // order more
  if (id == 2) {
    ctx.wizard.selectStep(1);
    return ctx.wizard.steps[ctx.wizard.cursor](ctx);
  }

  // respond
  await ctx.reply(
    `Wir legen los! Du wirst benachrichtigt, wenn sich der Status deiner Bestellung aktualisiert.`
  );

  await createOrder(
    ctx,
    ctx.session.order,
    ctx.scene.state.options,
    ctx.scene.state.event
  );
  return ctx.scene.leave();
};

module.exports = orderConfirmation;
