const { Bot } = require("grammy");
const TOKEN = process.env.BOT_TOKEN || "TOKEN_DEFAULT";
const bot = new Bot(TOKEN);

bot.command("start", async (ctx) => {
    await ctx.reply("✅ سلام! ربات کار می‌کنه!");
});

bot.start({ onStart: (info) => console.log(`✅ @${info.username}`) });