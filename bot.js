const { Bot } = require("grammy");
const { TOKEN } = require("./config");
const { IranState, getPlayer, setPlayer } = require("./state");
const { mainMenu, adminMenu, handleCallback, handleAdminAction, getAdminCaption, MAIN_IMAGE, ADMIN_ID } = require("./handlers");

const bot = new Bot(TOKEN);

// /start
bot.command("start", async (ctx) => {
    const userId = ctx.from.id;
    let state = getPlayer(userId);
    
    if (state && !state.gameOver) {
        await ctx.replyWithPhoto(MAIN_IMAGE, {
            caption: `🏛️ *${state.name}*! بازی قبلیت هنوز فعاله!\n\n${state.getSummary()}`,
            parse_mode: "Markdown",
            reply_markup: mainMenu()
        });
        return;
    }
    
    state = new IranState(ctx.from.first_name);
    setPlayer(userId, state);
    
    await ctx.replyWithPhoto(MAIN_IMAGE, {
        caption: `🏛️ *${state.name}* عزیز، شما ${state.getRankName()} ایران هستید!\n\n${state.getSummary()}`,
        parse_mode: "Markdown",
        reply_markup: mainMenu()
    });
});

// /status
bot.command("status", async (ctx) => {
    const state = getPlayer(ctx.from.id);
    if (!state) return ctx.reply("❌ /start رو بزن!");
    await ctx.replyWithPhoto(MAIN_IMAGE, {
        caption: state.getSummary(),
        parse_mode: "Markdown",
        reply_markup: mainMenu()
    });
});

// /edwin
bot.command(["edwin", "ادوین"], async (ctx) => {
    if (ctx.from.id !== ADMIN_ID) return ctx.reply("🚫 وجود ندارد!");
    const state = getPlayer(ctx.from.id);
    if (!state) return ctx.reply("اول /start");
    
    await ctx.replyWithPhoto(MAIN_IMAGE, {
        caption: getAdminCaption(state),
        parse_mode: "Markdown",
        reply_markup: adminMenu()
    });
});

// دکمه‌ها
bot.on("callback_query:data", async (ctx) => {
    const state = getPlayer(ctx.from.id);
    const data = ctx.callbackQuery.data;
    
    if (!state) { await ctx.answerCallbackQuery("/start بزن!"); return; }
    await ctx.answerCallbackQuery();
    
    // ادمین
    if (data.startsWith("admin_")) {
        await handleAdminAction(ctx, state, data);
        return;
    }
    
    // بقیه دکمه‌ها
    await handleCallback(ctx, state, data);
});

// شروع
bot.start({ onStart: (info) => console.log(`✅ @${info.username} راه‌اندازی شد!`) });