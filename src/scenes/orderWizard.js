const { Scenes } = require("telegraf");

const options = [
  {
    title: "Vegetarisch",
    description: "Tomaten, Mozzarella, Basilikum",
    price: 2.5,
  },
  { title: "Vegan", description: "Tomaten, Basilikum", price: 2 },
  {
    title: "Linsale",
    description: "Linsen, Tomaten, Edamer, Basilikum",
    price: 3,
  },
];
const stringPrefix = "Was darf's denn sein? Wir haben heute:";
const stringSuffix =
  "*0: Bestellvorgang abbrechen*\n\nTippe zum Bestellen einfach die entsprechende Nummer ein\\.";

const orderWizard = new Scenes.WizardScene(
  "ORDER_WIZARD_SCENE_ID",
  (ctx) => {
    // -- init order
    ctx.session.order = { total: 0, price: 0, items: [] };
    ctx.wizard.next();
    return ctx.wizard.steps[ctx.wizard.cursor](ctx);
  },
  async (ctx) => {
    // -- generate menu
    let menu = stringPrefix + "\n\n";
    options.map((value, index) => {
      menu += `*__${index + 1}: ${value.title}__*\n`;
      menu += `_${value.description}_\n\n`;
    });
    menu += stringSuffix;
    if (ctx.session.order.total > 0)
      menu += `\n*_Bist du fertig mit der Bestellung, gib einfach "X" ein_*\\.`;

    // -- respond
    await ctx.replyWithMarkdownV2(menu);
    await ctx.replyWithMarkdownV2(generateOrderString(ctx.session.order));
    return ctx.wizard.next();
  },
  async (ctx) => {
    // -- get input
    const response = ctx.message.text;

    if (ctx.session.order.total > 0 && (response === "X" || response === "x")) {
      ctx.wizard.selectStep(3);
      return ctx.wizard.steps[ctx.wizard.cursor](ctx);
    }

    let id = parseInt(response);

    // -- validate input
    if (isNaN(id)) {
      await ctx.reply(
        "Deine Eingabe ist ungültig. Bitte gib nur die Nummer ein und versuche es erneut."
      );
      return;
    } else if (id < 0 || id > options.length) {
      await ctx.reply(
        `Die Nummer ${id} existiert leider nicht. Schaue noch einmal aufs Menü und versuche es erneut.`
      );
      return;
    } else if (id === 0) {
      await ctx.reply("Der Bestellvorgang wurde abgebrochen.");
      return ctx.scene.leave();
    }

    // -- update order
    ctx.session.order.items.push({ id: id - 1, amount: 0 });

    // -- respond
    const answer = options[id - 1];
    await ctx.replyWithMarkdownV2(
      `Du möchtest *${answer.title}* bestellen? Wie viele möchtest du denn? \n _\\(Wenn du dich verwählt hast, gib einfach 0 ein\\)_`
    );
    return ctx.wizard.next();
  },
  async (ctx) => {
    // -- get input
    const response = ctx.message.text;
    let amount = parseInt(response);
    if (
      !(ctx.session.order.total > 0 && (response === "X" || response === "x"))
    ) {
      // -- validate input
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

    // -- update order
    const lastPizzaIndex = ctx.session.order.items.length - 1;
    const lastPizza = ctx.session.order.items[lastPizzaIndex];
    const pizza = options[lastPizza.id];

    // -- amount = 0
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
      }
    }

    // -- respond
    await ctx.replyWithMarkdownV2(
      `${
        amount > 0 ? `Roger, ${amount}x ${pizza.title} also\\.\\.\\. ` : ""
      }Darf es noch etwas sein?\n\n*1: Das war's \\- Schmeiß den Pizzaofen an\\!*\n*2: Mehr\\! Ich hab Hunger\\!*\n\n*0: Bestellvorgang abbrechen*\n\nTippe zum Bestellen einfach die entsprechende Nummer ein\\.`
    );
    await ctx.replyWithMarkdownV2(generateOrderString(ctx.session.order));

    return ctx.wizard.next();
  },
  async (ctx) => {
    // get input
    const response = ctx.message.text;
    let id = parseInt(response);
    const total = ctx.session.order.total;

    // -- validate input
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

    // -- order more
    if (id == 2) {
      ctx.wizard.selectStep(1);
      return ctx.wizard.steps[ctx.wizard.cursor](ctx);
    }

    // -- respond
    await ctx.reply(
      `Wir legen los! Du bekommst eine Benachrichtigung, sobald deine ${
        total === 1 ? "Pizza im Ofen ist" : "Pizzen im Ofen sind"
      } und nochmal eine, wenn sie fertig ist.`
    );
    return ctx.scene.leave();
  }
);

const generateOrderString = (order) => {
  let orderString = "\n__Deine Bestellung:__\n\n";

  order.items.map((item) => {
    const pizza = options[item.id].title;

    orderString += `*${item.amount}x ${pizza}*\n`;
  });

  if (order.items.length === 0) orderString += "_Noch nichts gewählt\\._";

  return orderString;
};

module.exports = orderWizard;
