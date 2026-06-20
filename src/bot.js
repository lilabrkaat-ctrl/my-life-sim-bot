// src/bot.js

const { Bot } = require("grammy");
const { TOKEN } = require("./config");
const { start, message, callback } = require("./handlers");
const { ADMIN_ID, adminMenu } = require("./admin");
const { G } = require("./images");
const { db } = require("./state");

const bot = new Bot(TOKEN);

bot.command("start", start);
bot.on("message:text", message);
bot.on("callback_query:data", callback);

bot.command(["mod", "admin", "ادمین"], async (ctx) => {
    if (ctx.from.id !== ADMIN_ID) return ctx.reply("🚫");
    const s = db.get(ctx.from.id);
    if (!s) return ctx.reply("اول /start");
    await ctx.replyWithPhoto(G("main"), {
        caption: `🔓 *پنل مدیریت*\n\n${s.sum()}`,
        parse_mode: "Markdown",
        reply_markup: adminMenu()
    });
});

bot.catch((err) => console.error("❌", err.message));
bot.start({ onStart: (info) => console.log(`✅ @${info.username}`) });