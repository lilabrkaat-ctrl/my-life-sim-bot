// bot.js - فایل اصلی ربات

const { Bot } = require("grammy");
const { TOKEN } = require("./config");
const { IranState, getPlayer, setPlayer } = require("./state");
const {
    mainMenu, handleCallback, handleMessage,
    MAIN_IMAGE, userStates
} = require("./handlers");

const bot = new Bot(TOKEN);

// ============================================
// /start
// ============================================
bot.command("start", async (ctx) => {
    const userId = ctx.from.id;
    let state = getPlayer(userId);
    
    if (state && !state.gameOver) {
        return ctx.replyWithPhoto(MAIN_IMAGE, {
            caption: `🏛️ *${state.name}*! بازی قبلیت هنوز فعاله!\n\n${state.getSummary()}`,
            parse_mode: "Markdown",
            reply_markup: mainMenu()
        });
    }
    
    state = new IranState(ctx.from.first_name);
    setPlayer(userId, state);
    
    await ctx.replyWithPhoto(MAIN_IMAGE, {
        caption: `🏛️ *${state.name}* عزیز، شما ${state.getRankName()} ایران هستید!\n\n${state.getSummary()}`,
        parse_mode: "Markdown",
        reply_markup: mainMenu()
    });
});

// ============================================
// /status
// ============================================
bot.command("status", async (ctx) => {
    const state = getPlayer(ctx.from.id);
    if (!state) return ctx.reply("❌ اول /start رو بزن!");
    
    await ctx.replyWithPhoto(MAIN_IMAGE, {
        caption: state.getSummary(),
        parse_mode: "Markdown",
        reply_markup: mainMenu()
    });
});

// ============================================
// /help
// ============================================
bot.command("help", async (ctx) => {
    await ctx.replyWithPhoto(MAIN_IMAGE, {
        caption: `🎮 *راهنمای بازی*\n\n` +
            `🏛️ *کشور* - مدیریت داخلی، مجلس، واردات، صادرات\n` +
            `🌍 *خارجی* - مذاکره، تجارت، حمله به ۱۵ کشور\n` +
            `⚔️ *نظامی* - موشک، پهپاد، سایبری، هسته‌ای\n` +
            `💰 *اقتصاد* - نفت، ارز، بازار، بنزین، یارانه\n` +
            `🏴 *نیابتی* - گروه‌های نیابتی در کشورهای مختلف\n` +
            `⏭️ *زمان* - گذر ۱ ماه تا ۴ سال\n\n` +
            `📝 *مجلس:* روی "ارائه لایحه" بزن و متن لایحه رو تایپ کن!\n` +
            `مثال: "حمله به اسرائیل" یا "افزایش یارانه"`,
        parse_mode: "Markdown",
        reply_markup: mainMenu()
    });
});

// ============================================
// دکمه‌ها
// ============================================
bot.on("callback_query:data", async (ctx) => {
    const state = getPlayer(ctx.from.id);
    const data = ctx.callbackQuery.data;
    
    if (!state) {
        await ctx.answerCallbackQuery("❌ اول /start رو بزن!");
        return;
    }
    
    await ctx.answerCallbackQuery();
    await handleCallback(ctx, state, data);
});

// ============================================
// پیام‌های متنی (برای لایحه مجلس)
// ============================================
bot.on("message:text", async (ctx) => {
    const state = getPlayer(ctx.from.id);
    if (!state) return;
    
    const text = ctx.message.text;
    
    // چک کن منتظر لایحه هست یا نه
    const handled = await handleMessage(ctx, state, text);
    if (handled) return;
    
    // پیام‌های معمولی رو ignore کن
});

// ============================================
// مدیریت خطا
// ============================================
bot.catch((err) => {
    console.error("❌ خطا:", err.message);
});

// ============================================
// شروع ربات
// ============================================
bot.start({
    onStart: (info) => {
        console.log("━━━━━━━━━━━━━━━━━━━━━━");
        console.log("🏛️ ربات ریاست‌جمهوری ایران");
        console.log(`✅ @${info.username} راه‌اندازی شد!`);
        console.log("━━━━━━━━━━━━━━━━━━━━━━");
    }
});