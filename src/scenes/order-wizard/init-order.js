const initOrder = (ctx) => {
  ctx.session.order = { total: 0, price: 0, items: [] };
  ctx.wizard.next();
  return ctx.wizard.steps[ctx.wizard.cursor](ctx);
};

module.exports = initOrder;
