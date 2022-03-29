const { priceFormatter } = require("./price-formatter");

const generateOrderString = (order, options) => {
  let orderString = "\n__Deine Bestellung:__\n\n";

  // generate string
  order.items.map((item) => {
    const pizza = options[item.id].title;
    orderString += `*${item.amount}x ${pizza}*\n`;
  });

  // case: order is empty
  if (order.items.length === 0) orderString += "_Noch nichts gewählt\\._";
  // case: something is already in the order
  else {
    orderString += `\nSpendenbeispiel: ${priceFormatter
      .format(order.price)
      .replace(".", ",")}`;
  }

  return orderString;
};

module.exports = { generateOrderString };
