// src/bot.js

const { Bot } = require("grammy");
const { TOKEN } = require("./config");
const { start, message, callback } = require("./handlers");

const bot = new Bot(TOKEN);

bot.command("start", start);
bot.on("message:text", message);
bot.on("callback_query:data", callback);

bot.start({ onStart: (info) => console.log(`✅ @${info.username}`) });