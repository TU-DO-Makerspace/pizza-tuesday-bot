const { createOrder } = require("../../services/orders");
const { adminOrderNotification } = require("../../services/notifications");

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
    `Wir legen los! Du bekommst eine Benachrichtigung, sobald deine ${
      total === 1 ? "Pizza im Ofen ist" : "Pizzen im Ofen sind"
    } und nochmal eine, wenn sie fertig ist.`
  );

  await createOrder(ctx, ctx.session.order);
  await adminOrderNotification(ctx, ctx.session.order, ctx.scene.state.options);
  return ctx.scene.leave();
};

module.exports = orderConfirmation;
