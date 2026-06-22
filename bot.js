const { Bot, GrammyError, HttpError } = require("grammy");

const token = process.env.BOT_TOKEN;
if (!token) {
    console.error("❌ Error: BOT_TOKEN is not defined in Environment Variables!");
    process.exit(1);
}

const bot = new Bot(token);

// مدیریت خطاها
bot.catch((err) => {
    const e = err.error;
    if (e instanceof GrammyError) {
        if (e.error_code === 404) {
            console.warn(`⚠️ Ignored Telegram 404 Error: ${e.description}`);
            return;
        }
        console.error("❌ Grammy Error:", e.description);
    } else if (e instanceof HttpError) {
        console.error("❌ Network Error:", e);
    } else {
        console.error("❌ Unknown Error:", e);
    }
});

// دستورات ربات
bot.command("start", async (ctx) => {
    await ctx.reply("سلام! ربات فعال است.");
});

console.log("🚀 Bot is starting...");
bot.start();