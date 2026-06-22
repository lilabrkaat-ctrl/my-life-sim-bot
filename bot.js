const { Bot, GrammyError, HttpError } = require("grammy");
const { setupHandlers } = require("./handlers");

const token = process.env.BOT_TOKEN;
if (!token) {
    console.error("❌ BOT_TOKEN is not defined!");
    process.exit(1);
}

const bot = new Bot(token);

// مدیریت خطا
bot.catch((err) => {
    const e = err.error;
    if (e instanceof GrammyError) {
        if (e.error_code === 404) {
            console.warn(`⚠️ Ignored 404: ${e.description}`);
            return;
        }
        console.error("❌ Grammy Error:", e.description);
    } else if (e instanceof HttpError) {
        console.error("❌ Network Error:", e);
    } else {
        console.error("❌ Unknown Error:", e);
    }
});

// راه‌اندازی handlers
setupHandlers(bot);

console.log("🚀 Marvel Empire Bot started!");
bot.start();