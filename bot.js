const { Bot, InlineKeyboard } = require("grammy");
const { TOKEN, CITIES, FIRST_NAMES, LAST_NAMES, POSITIONS } = require("./config");
const { GameState, getPlayer, setPlayer } = require("./state");

const bot = new Bot(TOKEN);
const userStates = new Map();

// ============================================
// /start
// ============================================
bot.command("start", async (ctx) => {
    const userId = ctx.from.id;
    let state = getPlayer(userId);
    
    if (state) {
        return ctx.reply(state.getSummary(), {
            parse_mode: "Markdown",
            reply_markup: state.path === "agent" ? agentMenu() : clubMenu()
        });
    }
    
    // انتخاب مسیر
    const kb = new InlineKeyboard()
        .text("👤 ایجنت", "path_agent").text("⚽ باشگاه", "path_club").row();
    
    await ctx.reply(`🎮 *بازی امپراتوری فوتبال*\n\nبه دنیای فوتبال ایران خوش اومدی!\n\nمسیرت رو انتخاب کن:\n\n👤 *ایجنت:* کشف بازیکن، فروش، کمیسیون\n⚽ *باشگاه:* تأسیس تیم، بازی، قهرمانی`, {
        parse_mode: "Markdown",
        reply_markup: kb
    });
});

// ============================================
// انتخاب مسیر
// ============================================
bot.on("callback_query:data", async (ctx) => {
    const data = ctx.callbackQuery.data;
    const userId = ctx.from.id;
    
    await ctx.answerCallbackQuery();
    
    // انتخاب ایجنت یا باشگاه
    if (data === "path_agent" || data === "path_club") {
        const path = data === "path_agent" ? "agent" : "club";
        userStates.set(userId, { choosing: "name", path: path });
        
        return ctx.editMessageText(`✍️ *انتخاب اسم*\n\nاسم ایجنت یا باشگاهت رو تایپ کن:`, {
            parse_mode: "Markdown"
        });
    }
    
    const state = getPlayer(userId);
    if (!state) { await ctx.answerCallbackQuery("❌ اول /start رو بزن!"); return; }
    
    // ============ منوی ایجنت ============
    if (data === "menu_main") {
        return ctx.editMessageText(state.getSummary(), {
            parse_mode: "Markdown",
            reply_markup: state.path === "agent" ? agentMenu() : clubMenu()
        });
    }
    
    if (data === "agent_scout") {
        if (state.money < 50) { await ctx.answerCallbackQuery("❌ پول کم! (نیاز: ۵۰ میلیون)"); return; }
        state.money -= 50;
        
        const name = FIRST_NAMES[Math.floor(Math.random() * FIRST_NAMES.length)] + " " + LAST_NAMES[Math.floor(Math.random() * LAST_NAMES.length)];
        const pos = POSITIONS[Math.floor(Math.random() * POSITIONS.length)];
        const talent = Math.floor(Math.random() * 5) + 3; // ۳ تا ۸
        const ability = Math.floor(Math.random() * 3) + 1; // ۱ تا ۴
        const age = Math.floor(Math.random() * 10) + 16; // ۱۶ تا ۲۶
        const value = talent * ability * 20; // میلیون
        
        const player = { name, pos, talent, ability, age, value, national: false };
        state.players.push(player);
        
        await ctx.editMessageText(`🔍 *کشف بازیکن جدید!*\n\n⚽ ${name}\n📊 ${pos} | سن: ${age}\n⭐ استعداد: ${talent}/10\n💪 توانایی: ${ability}/10\n💰 ارزش: ${value} میلیون\n\n${state.getSummary()}`, {
            parse_mode: "Markdown",
            reply_markup: agentMenu()
        });
        return;
    }
    
    if (data === "agent_players") {
        if (state.players.length === 0) {
            return ctx.editMessageText("👥 *بازیکنای تو*\n\nهنوز هیچ بازیکنی کشف نکردی!\nبرو گشت‌وگذار کن.", {
                parse_mode: "Markdown",
                reply_markup: agentMenu()
            });
        }
        
        let txt = "👥 *بازیکنای تو*\n\n";
        state.players.forEach((p, i) => {
            txt += `${i+1}. ⚽ ${p.name}\n   ${p.pos} | ⭐${p.talent} 💪${p.ability} | 💰${p.value}M\n`;
            if (p.national) txt += `   🇮🇷 تیم ملی!\n`;
            txt += "\n";
        });
        
        await ctx.editMessageText(txt, {
            parse_mode: "Markdown",
            reply_markup: agentMenu()
        });
        return;
    }
    
    if (data === "agent_sell") {
        if (state.players.length === 0) {
            await ctx.answerCallbackQuery("❌ بازیکنی برای فروش نداری!");
            return;
        }
        
        // فروش اولین بازیکن
        const player = state.players[0];
        const income = player.value;
        state.money += income;
        state.fame += 5;
        state.coins += Math.floor(income / 200);
        state.players.shift();
        
        await ctx.editMessageText(`💰 *فروش بازیکن!*\n\n⚽ ${player.name}\n💵 فروخته شد به: ${income} میلیون\n⭐ شهرت: +۵\n🎯 سکه: +${Math.floor(income / 200)}\n\n${state.getSummary()}`, {
            parse_mode: "Markdown",
            reply_markup: agentMenu()
        });
        return;
    }
    
    // ============ هفته بعد ============
    if (data === "menu_next") {
        state.week++;
        if (state.week > 34) {
            state.week = 1;
            state.season++;
            
            // درآمد فصلی
            if (state.path === "club") {
                const league = state.getLeague();
                state.money += league.income;
            }
        }
        
        await ctx.editMessageText(`⏭️ *هفته ${state.week} - فصل ${state.season}*\n\n${state.getSummary()}`, {
            parse_mode: "Markdown",
            reply_markup: state.path === "agent" ? agentMenu() : clubMenu()
        });
        return;
    }
    
    await ctx.answerCallbackQuery("🔧 در حال ساخت...");
});

// ============================================
// پیام متنی (اسم)
// ============================================
bot.on("message:text", async (ctx) => {
    const userId = ctx.from.id;
    const us = userStates.get(userId);
    
    if (us && us.choosing === "name") {
        const name = ctx.message.text;
        const state = new GameState(name, us.path);
        
        if (us.path === "club") {
            state.clubName = name;
        }
        
        setPlayer(userId, state);
        userStates.delete(userId);
        
        await ctx.reply(`🎉 *${us.path === "agent" ? "ایجنت" : "باشگاه"} ثبت شد!*\n\n${state.getSummary()}`, {
            parse_mode: "Markdown",
            reply_markup: us.path === "agent" ? agentMenu() : clubMenu()
        });
    }
});

// ============================================
// منوها
// ============================================
function agentMenu() {
    return new InlineKeyboard()
        .text("🔍 کشف بازیکن", "agent_scout").text("📋 بازیکنای من", "agent_players").row()
        .text("💰 فروش بازیکن", "agent_sell").text("📊 آمار من", "menu_main").row()
        .text("⏭️ هفته بعد", "menu_next");
}

function clubMenu() {
    return new InlineKeyboard()
        .text("⚽ بازی", "club_play").text("📋 ترکیب", "club_squad").row()
        .text("🛒 خرید", "club_buy").text("🏋️ تمرین", "club_train").row()
        .text("📊 جدول", "club_table").text("💰 مالی", "menu_main").row()
        .text("⏭️ هفته بعد", "menu_next");
}

// ============================================
bot.start({ onStart: (info) => console.log(`✅ @${info.username} راه‌اندازی شد!`) });