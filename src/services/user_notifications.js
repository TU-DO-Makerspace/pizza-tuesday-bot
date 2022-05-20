import { getUserByUsername } from "./auth.js";

export const orderCreationNotification = async ({ ctx, username, order }) => {
  try {
    const formattedUserName = username.replace("@", "").toLowerCase();
    const user = await getUserByUsername(formattedUserName);

    if (!user) {
      return await ctx.telegram.sendMessage(
        ctx.chat.id,
        "User konnte nicht gefunden werden: " + username
      );
    }

    const chatId = user.id;
    const message =
      `Hallo ${user.first_name},\ndu hast Bestellung \\#*${order.id}* erhalten:\n\n` +
      `Bestellung: *${order.order}*\n` +
      `Status: *${order.status}*\n` +
      `Position in Warteschlange: *${order.position}*\n` +
      `Geschätzte Dauer: *${order.estimated_duration} Minuten*`;

    return await ctx.telegram.sendMessage(chatId, message, {
      parse_mode: "MarkdownV2",
    });
  } catch (err) {
    throw err;
  }
};

export const orderUpdateNotification = async ({ ctx, order, field, value }) => {
  try {
    const user = await getUserByUsername(order.user);

    if (!user) {
      return await ctx.telegram.sendMessage(
        ctx.chat.id,
        "User konnte nicht gefunden werden: " + order.user
      );
    }

    const chatId = user.id;
    let message = "";

    message =
      `Hallo ${user.first_name},\ndeine Bestellung \\#*${order.id}* wurde aktualisiert:\n\n` +
      `Bestellung: *${order.order}*\n` +
      `Status: *${order.status}*`;

    if (field === "payed") {
      message =
        `Hallo ${user.first_name},\n` +
        `deine Bestellung \\#*${order.id}* wurde als *${
          value ? "bezahlt" : "nicht bezahlt"
        }* markiert:\n\n` +
        `Bestellung: *${order.order}*\n` +
        `Status: *${order.status}*`;
    }

    return await ctx.telegram.sendMessage(chatId, message, {
      parse_mode: "MarkdownV2",
    });
  } catch (err) {
    throw err;
  }
};
