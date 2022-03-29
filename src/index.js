// --- imports
require("dotenv").config();
const initBot = require("./init-bot");

// --- commands
const generalCommands = require("./commands/general");
const adminCommands = require("./commands/admin");

// --- initialization
const bot = initBot();

// --- commands
bot.use(generalCommands, adminCommands);

// --- processing
bot.launch();
// gracefully stop bot
process.once("SIGINT", () => bot.stop("SIGINT"));
process.once("SIGTERM", () => bot.stop("SIGTERM"));
