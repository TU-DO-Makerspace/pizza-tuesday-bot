// --- imports
import dotenv from "dotenv";
import initBot from "./init-bot.js";
// --- commands
import generalCommands from "./commands/general.js";
import adminCommands from "./commands/admin.js";

// --- initialization
dotenv.config();
const bot = initBot();

// --- commands
bot.use(generalCommands, adminCommands);

// --- processing
bot.launch();
// gracefully stop bot
process.once("SIGINT", () => bot.stop("SIGINT"));
process.once("SIGTERM", () => bot.stop("SIGTERM"));
