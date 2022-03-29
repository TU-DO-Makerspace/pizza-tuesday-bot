// --- helpers
const { priceFormatter } = require("../../helpers/price-formatter");
const { generateOrderString } = require("../../helpers/generate-order-string");

const menuDisplay = async (ctx, options) => {
  const stringPrefix = "Was darf's denn sein? Wir haben heute:";
  const stringSuffix =
    "*0: Bestellvorgang abbrechen*\n\nTippe zum Bestellen einfach die entsprechende Nummer ein\\.";

  // generate menu
  let menu = stringPrefix + "\n\n";
  options.map((value, index) => {
    menu += `*__${index + 1}: ${value.title}__*\n`;
    menu += `_${value.description}_\n`;
    menu += `Spendenbeispiel: ${priceFormatter
      .format(value.price)
      .replace(".", ",")}\n\n`;
  });
  menu += stringSuffix;
  if (ctx.session.order.total > 0)
    menu += `\n*_Bist du fertig mit der Bestellung, gib einfach "X" ein_*\\.`;

  // respond
  await ctx.replyWithMarkdownV2(menu);
  await ctx.replyWithMarkdownV2(
    generateOrderString(ctx.session.order, options)
  );
  return ctx.wizard.next();
};

module.exports = menuDisplay;
