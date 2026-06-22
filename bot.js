const { Bot } = require("grammy");

const bot = new Bot("YOUR_BOT_TOKEN_HERE");

bot.command("start", async (ctx) => {
  await ctx.reply("سلام! ربات فعال است.");
});

bot.start();