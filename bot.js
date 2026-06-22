const { Bot, GrammyError, HttpError } = require("grammy");

const bot = new Bot("YOUR_BOT_TOKEN_HERE");

// مدیریت همه خطاها
bot.catch((err) => {
  const ctx = err.ctx;
  console.error(`Error while handling update ${ctx.update.update_id}:`);
  const e = err.error;
  
  if (e instanceof GrammyError) {
    if (e.error_code === 404) {
      console.warn(`Ignored 404 error: ${e.description}`);
      return;
    }
    console.error("Error in request:", e.description);
  } else if (e instanceof HttpError) {
    console.error("Could not contact Telegram:", e);
  } else {
    console.error("Unknown error:", e);
  }
});

bot.command("start", async (ctx) => {
  await ctx.reply("سلام! ربات فعال است.");
});

bot.start();