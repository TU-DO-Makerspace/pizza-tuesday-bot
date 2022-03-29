const { generateOrderString } = require("../../helpers/generate-order-string");

const amountSelection = async (ctx, options) => {
  // get input
  const response = ctx.message.text;
  let amount = parseInt(response);
  if (
    !(ctx.session.order.total > 0 && (response === "X" || response === "x"))
  ) {
    // validate input
    if (isNaN(amount) || amount < 0) {
      await ctx.reply(
        "Deine Eingabe ist ungültig. Bitte gib eine gültige Menge an."
      );
      return;
    } else if (ctx.session.order.total + amount > 3) {
      await ctx.reply(
        "Das sind insgesamt ganz schön viele Pizzen. Bitte komm bei solch einer Menge direkt zu uns oder gib eine geringere Menge an."
      );
      ctx.session.order.items.pop();
      ctx.wizard.selectStep(1);
      return ctx.wizard.steps[ctx.wizard.cursor](ctx);
    }
  }

  // update order
  const lastPizzaIndex = ctx.session.order.items.length - 1;
  const lastPizza = ctx.session.order.items[lastPizzaIndex];
  const pizza = options[lastPizza.id];

  // amount = 0
  if (
    !(ctx.session.order.total > 0 && (response === "X" || response === "x"))
  ) {
    if (amount == 0) {
      await ctx.reply(
        "Doch keine? Vielleicht findest du ja noch was anderes auf dem Menü."
      );
      ctx.session.order.items.pop();
    } else {
      lastPizza.amount = amount;
      ctx.session.order.total += amount;
      ctx.session.order.price += amount * pizza.price;
    }
  }

  // respond
  await ctx.replyWithMarkdownV2(
    `${
      amount > 0 ? `Roger, ${amount}x ${pizza.title} also\\.\\.\\. ` : ""
    }Darf es noch etwas sein?\n\n*1: Das war's \\- Schmeiß den Pizzaofen an\\!*\n*2: Mehr\\! Ich hab Hunger\\!*\n\n*0: Bestellvorgang abbrechen*\n\nTippe zum Bestellen einfach die entsprechende Nummer ein\\.`
  );
  await ctx.replyWithMarkdownV2(
    generateOrderString(ctx.session.order, options)
  );

  return ctx.wizard.next();
};

module.exports = amountSelection;
