const { Bot } = require("grammy");

const bot = new Bot("TOKEN_ROBAT_ET_INJA_BEZAR");

bot.command("start", async (ctx) => {
  await ctx.reply("سلام! ربات کار می‌کند 🎉");
});

bot.start();