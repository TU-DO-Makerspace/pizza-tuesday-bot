// --- imports
const { Scenes } = require("telegraf");

// --- steps
const initOrder = require("./init-order");
const menuDisplay = require("./menu-display");
const menuSelection = require("./menu-selection");
const amountSelection = require("./amount-selection");
const orderConfirmation = require("./order-confirmation");

const orderWizard = new Scenes.WizardScene(
  "ORDER_WIZARD_SCENE_ID",
  (ctx) => initOrder(ctx),
  async (ctx) => await menuDisplay(ctx),
  async (ctx) => await menuSelection(ctx),
  async (ctx) => await amountSelection(ctx),
  async (ctx) => await orderConfirmation(ctx)
);

module.exports = orderWizard;
