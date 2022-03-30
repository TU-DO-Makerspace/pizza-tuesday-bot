// --- services
const { generateMenuString } = require("../../services/menus");
// --- helpers
const { generateOrderString } = require("../../helpers/generate-order-string");

const menuDisplay = async (ctx) => {
  const stringPrefix = "Was darf's denn sein? Wir haben diesmal:";
  const stringSuffix =
    "*0: Bestellvorgang abbrechen*\n\nTippe zum Bestellen einfach die entsprechende Nummer ein\\.";

  // generate menu
  let menu = stringPrefix + "\n\n";
  menu += generateMenuString(ctx.scene.state.options);
  menu += stringSuffix;
  if (ctx.session.order.total > 0)
    menu += `\n*_Bist du fertig mit der Bestellung, gib einfach "X" ein_*\\.`;

  // respond
  await ctx.replyWithMarkdownV2(menu);
  await ctx.replyWithMarkdownV2(
    generateOrderString(ctx.session.order, ctx.scene.state.options)
  );
  return ctx.wizard.next();
};

module.exports = menuDisplay;
