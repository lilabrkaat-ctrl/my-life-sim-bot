const { Bot, InlineKeyboard } = require("grammy");
const TOKEN = process.env.BOT_TOKEN || "TOKEN_DEFAULT";
const bot = new Bot(TOKEN);
const db = new Map();

bot.command("start", async (ctx) => {
    const uid = ctx.from.id;
    if (db.has(uid)) {
        return ctx.reply(`👤 ${db.get(uid).name}\n💰 ${db.get(uid).money}M`);
    }
    const kb = new InlineKeyboard().text("👤 ایجنت", "go_agent").text("⚽ باشگاه", "go_club").row();
    await ctx.reply("🎮 مسیرت رو انتخاب کن:", { reply_markup: kb });
});

bot.on("callback_query:data", async (ctx) => {
    const d = ctx.callbackQuery.data;
    await ctx.answerCallbackQuery();
    if (d === "go_agent" || d === "go_club") {
        await ctx.editMessageText("✍️ اسم رو تایپ کن:");
    }
});

bot.on("message:text", async (ctx) => {
    db.set(ctx.from.id, { name: ctx.message.text, money: 500 });
    await ctx.reply(`🎉 ثبت شد! ${ctx.message.text}`);
});

bot.start({ onStart: (info) => console.log(`✅ @${info.username}`) });