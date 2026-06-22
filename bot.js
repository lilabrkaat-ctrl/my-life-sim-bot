const { Bot } = require("grammy");

const bot = new Bot("YOUR_BOT_TOKEN_HERE");

// نادیده گرفتن خطای 404 مربوط به deleteWebhook
bot.api.config.use((ctx, next) => {
  return next().catch(err => {
    if (err.error_code === 404 && err.description?.includes('deleteWebhook')) {
      console.warn("Webhook not found (ignoring 404)...");
      return;
    }
    throw err;
  });
});

bot.command("start", async (ctx) => {
  await ctx.reply("سلام! ربات فعال است.");
});

bot.start();