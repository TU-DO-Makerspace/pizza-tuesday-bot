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