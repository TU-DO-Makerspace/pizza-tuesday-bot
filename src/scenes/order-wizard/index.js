// --- imports
const { Scenes } = require("telegraf");

// --- steps
const initOrder = require("./init-order");
const menuDisplay = require("./menu-display");
const menuSelection = require("./menu-selection");
const amountSelection = require("./amount-selection");
const orderConfirmation = require("./order-confirmation");

// --- constants
// TODO: get the options from firestore
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

const orderWizard = new Scenes.WizardScene(
  "ORDER_WIZARD_SCENE_ID",
  (ctx) => initOrder(ctx),
  async (ctx) => await menuDisplay(ctx, options),
  async (ctx) => await menuSelection(ctx, options),
  async (ctx) => await amountSelection(ctx, options),
  async (ctx) => await orderConfirmation(ctx, ctx.scene.state.bot, options)
);

module.exports = orderWizard;
