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
        
        return ctx.editMessageText(`✍️ *انتخاب اسم*\n\nاسم ${path === "agent" ? "ایجنت" : "باشگاه"} رو تایپ کن:`, {
            parse_mode: "Markdown"
        });
    }
    
    const state = getPlayer(userId);
    if (!state) { await ctx.answerCallbackQuery("❌ اول /start رو بزن!"); return; }
    
    // ============ منوی اصلی ============
    if (data === "menu_main") {
        return ctx.editMessageText(state.getSummary(), {
            parse_mode: "Markdown",
            reply_markup: state.path === "agent" ? agentMenu() : clubMenu()
        });
    }
    
    // ============ کشف بازیکن ============
    if (data === "agent_scout") {
        if (state.money < 50) { await ctx.answerCallbackQuery("❌ پول کم! (نیاز: ۵۰ میلیون)"); return; }
        state.money -= 50;
        
        const name = FIRST_NAMES[Math.floor(Math.random() * FIRST_NAMES.length)] + " " + LAST_NAMES[Math.floor(Math.random() * LAST_NAMES.length)];
        const pos = POSITIONS[Math.floor(Math.random() * POSITIONS.length)];
        const talent = Math.floor(Math.random() * 5) + 3;
        const ability = Math.floor(Math.random() * 3) + 1;
        const age = Math.floor(Math.random() * 10) + 16;
        const value = talent * ability * 15;
        
        const player = { name, pos, talent, ability, age, value, national: false, contract: null };
        state.players.push(player);
        
        await ctx.editMessageText(`🔍 *کشف بازیکن جدید!*\n\n⚽ ${name}\n📊 ${pos} | سن: ${age}\n⭐ استعداد: ${talent}/10\n💪 توانایی: ${ability}/10\n💰 ارزش: ${value} میلیون\n\n${state.getSummary()}`, {
            parse_mode: "Markdown",
            reply_markup: agentMenu()
        });
        return;
    }
    
    // ============ لیست بازیکنان ============
    if (data === "agent_players") {
        if (state.players.length === 0) {
            return ctx.editMessageText("👥 *بازیکنای تو*\n\nهنوز هیچ بازیکنی کشف نکردی!\nبرو گشت‌وگذار کن.", {
                parse_mode: "Markdown",
                reply_markup: agentMenu()
            });
        }
        
        const kb = new InlineKeyboard();
        state.players.forEach((p, i) => {
            const nat = p.national ? "🇮🇷" : "";
            kb.text(`${i+1}. ${nat}⚽ ${p.name} ⭐${p.talent} 💪${p.ability}`, `player_view_${i}`).row();
        });
        kb.text("🔙 منوی اصلی", "menu_main");
        
        await ctx.editMessageText(`👥 *بازیکنای تو* (${state.players.length} نفر)\n\nیه بازیکن رو انتخاب کن تا ارتقاش بدی:`, {
            parse_mode: "Markdown",
            reply_markup: kb
        });
        return;
    }
    
    // ============ صفحه بازیکن ============
    if (data.startsWith("player_view_")) {
        const index = parseInt(data.split("_")[2]);
        const p = state.players[index];
        if (!p) { await ctx.answerCallbackQuery("❌ بازیکن پیدا نشد!"); return; }
        
        state.selectedPlayer = index;
        
        const kb = new InlineKeyboard()
            .text("⚡ سرعت (۵۰M)", `train_speed_${index}`).text("🎯 شوت (۷۵M)", `train_shoot_${index}`).row()
            .text("💪 بدنسازی (۱۵۰M)", `train_gym_${index}`).text("📚 مربی محلی (۱۰۰M)", `coach_local_${index}`).row()
            .text("📚 مربی ملی (۳۰۰M)", `coach_national_${index}`).text("🎯 اردوی خارج (۵۰۰M)", `camp_abroad_${index}`).row()
            .text("🤝 بستن قرارداد", `contract_${index}`).text("💰 فروش فوری", `sell_now_${index}`).row()
            .text("🔙 بازیکنای من", "agent_players");
        
        let txt = `⚽ *${p.name}*\n`;
        txt += `📊 ${p.pos} | ${p.age} سال\n`;
        txt += `⭐ استعداد: ${p.talent}/10 | 💪 توانایی: ${p.ability}/10\n`;
        txt += `💰 ارزش: ${p.value} میلیون\n`;
        if (p.national) txt += `🇮🇷 تیم ملی\n`;
        if (p.contract) txt += `📋 باشگاه: ${p.contract.club} | 💵 ${p.contract.monthly}M/ماه | ${p.contract.remaining} ماه\n`;
        txt += `━━━━━━━━━━━━━━\n🏋️ *ارتقا بازیکن:*`;
        
        await ctx.editMessageText(txt, {
            parse_mode: "Markdown",
            reply_markup: kb
        });
        return;
    }
    
    // ============ ارتقاها ============
    
    // تمرین سرعت
    if (data.startsWith("train_speed_")) {
        const i = parseInt(data.split("_")[2]);
        const p = state.players[i];
        if (!p) return;
        if (state.money < 50) { await ctx.answerCallbackQuery("❌ پول کم! (نیاز: ۵۰M)"); return; }
        state.money -= 50;
        const old = p.ability;
        p.ability = Math.min(10, p.ability + 1);
        p.value = p.talent * p.ability * 15;
        await ctx.editMessageText(`⚡ *تمرین سرعت*\n\n⚽ ${p.name}\n💪 ${old} → ${p.ability}\n💰 ارزش: ${p.value}M\n\n${state.getSummary()}`, { parse_mode: "Markdown", reply_markup: agentMenu() });
    }
    
    // تمرین شوت
    if (data.startsWith("train_shoot_")) {
        const i = parseInt(data.split("_")[2]);
        const p = state.players[i];
        if (!p) return;
        if (state.money < 75) { await ctx.answerCallbackQuery("❌ پول کم! (نیاز: ۷۵M)"); return; }
        state.money -= 75;
        const old = p.ability;
        p.ability = Math.min(10, p.ability + 1);
        p.value = p.talent * p.ability * 15;
        await ctx.editMessageText(`🎯 *تمرین شوت*\n\n⚽ ${p.name}\n💪 ${old} → ${p.ability}\n💰 ارزش: ${p.value}M\n\n${state.getSummary()}`, { parse_mode: "Markdown", reply_markup: agentMenu() });
    }
    
    // بدنسازی
    if (data.startsWith("train_gym_")) {
        const i = parseInt(data.split("_")[2]);
        const p = state.players[i];
        if (!p) return;
        if (state.money < 150) { await ctx.answerCallbackQuery("❌ پول کم! (نیاز: ۱۵۰M)"); return; }
        state.money -= 150;
        const oldA = p.ability;
        const oldT = p.talent;
        p.ability = Math.min(10, p.ability + 2);
        p.talent = Math.min(10, p.talent + 1);
        p.value = p.talent * p.ability * 15;
        await ctx.editMessageText(`💪 *بدنسازی*\n\n⚽ ${p.name}\n💪 ${oldA} → ${p.ability}\n⭐ ${oldT} → ${p.talent}\n💰 ارزش: ${p.value}M\n\n${state.getSummary()}`, { parse_mode: "Markdown", reply_markup: agentMenu() });
    }
    
    // مربی محلی
    if (data.startsWith("coach_local_")) {
        const i = parseInt(data.split("_")[2]);
        const p = state.players[i];
        if (!p) return;
        if (state.money < 100) { await ctx.answerCallbackQuery("❌ پول کم! (نیاز: ۱۰۰M)"); return; }
        state.money -= 100;
        const old = p.ability;
        p.ability = Math.min(10, p.ability + 1);
        p.value = p.talent * p.ability * 15;
        await ctx.editMessageText(`📚 *مربی محلی*\n\n⚽ ${p.name}\n💪 ${old} → ${p.ability}\n💰 ارزش: ${p.value}M\n📅 اثر کامل تا ۲ ماه دیگه\n\n${state.getSummary()}`, { parse_mode: "Markdown", reply_markup: agentMenu() });
    }
    
    // مربی ملی
    if (data.startsWith("coach_national_")) {
        const i = parseInt(data.split("_")[2]);
        const p = state.players[i];
        if (!p) return;
        if (state.money < 300) { await ctx.answerCallbackQuery("❌ پول کم! (نیاز: ۳۰۰M)"); return; }
        state.money -= 300;
        const old = p.ability;
        p.ability = Math.min(10, p.ability + 2);
        p.value = p.talent * p.ability * 15;
        await ctx.editMessageText(`📚 *مربی ملی*\n\n⚽ ${p.name}\n💪 ${old} → ${p.ability}\n💰 ارزش: ${p.value}M\n📅 اثر کامل تا ۲ ماه دیگه\n\n${state.getSummary()}`, { parse_mode: "Markdown", reply_markup: agentMenu() });
    }
    
    // اردوی خارج
    if (data.startsWith("camp_abroad_")) {
        const i = parseInt(data.split("_")[2]);
        const p = state.players[i];
        if (!p) return;
        if (state.money < 500) { await ctx.answerCallbackQuery("❌ پول کم! (نیاز: ۵۰۰M)"); return; }
        state.money -= 500;
        const old = p.ability;
        p.ability = Math.min(10, p.ability + 3);
        p.value = p.talent * p.ability * 30;
        await ctx.editMessageText(`🎯 *اردوی خارج*\n\n⚽ ${p.name}\n💪 ${old} → ${p.ability}\n💰 ارزش: ${p.value}M (×۲)\n📅 اثر کامل تا ۳ ماه دیگه\n\n${state.getSummary()}`, { parse_mode: "Markdown", reply_markup: agentMenu() });
    }
    
    // فروش فوری
    if (data.startsWith("sell_now_")) {
        const i = parseInt(data.split("_")[2]);
        const p = state.players[i];
        if (!p) return;
        state.money += p.value;
        state.fame += 5;
        state.players.splice(i, 1);
        await ctx.editMessageText(`💰 *فروش بازیکن*\n\n⚽ ${p.name}\n💵 قیمت: ${p.value} میلیون\n⭐ شهرت: +۵\n\n${state.getSummary()}`, { parse_mode: "Markdown", reply_markup: agentMenu() });
    }
    
    // بستن قرارداد
    if (data.startsWith("contract_")) {
        const i = parseInt(data.split("_")[1]);
        const p = state.players[i];
        if (!p) return;
        
        if (p.contract) {
            await ctx.answerCallbackQuery("❌ این بازیکن قبلاً قرارداد داره!");
            return;
        }
        
        const monthly = Math.floor(p.value / 10);
        const duration = Math.floor(Math.random() * 24) + 12; // ۱۲ تا ۳۶ ماه
        const clubs = ["فولاد", "تراکتور", "سپاهان", "پرسپولیس", "استقلال", "گل‌گهر", "ملوان", "آلومینیوم"];
        const club = clubs[Math.floor(Math.random() * clubs.length)];
        
        p.contract = { monthly, remaining: duration, club };
        state.money += monthly * 3;
        
        await ctx.editMessageText(`🤝 *قرارداد بسته شد!*\n\n⚽ ${p.name}\n🏠 باشگاه: ${club}\n💵 ${monthly} میلیون در ماه\n📅 ${duration} ماه\n💰 پیش‌پرداخت: ${monthly * 3}M\n\n${state.getSummary()}`, { parse_mode: "Markdown", reply_markup: agentMenu() });
    }
    
    // ============ هفته بعد ============
    if (data === "menu_next") {
        state.week++;
        
        // درآمد قراردادها
        for (const p of state.players) {
            if (p.contract && p.contract.remaining > 0) {
                state.money += p.contract.monthly;
                p.contract.remaining--;
                if (p.contract.remaining === 0) {
                    p.contract = null;
                    state.fame += 3;
                }
            }
        }
        
        if (state.week > 34) {
            state.week = 1;
            state.season++;
            
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
    
    // ============ پیش‌فرض ============
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
        .text("🔍 کشف بازیکن", "agent_scout").text("👥 بازیکنای من", "agent_players").row()
        .text("📊 آمار من", "menu_main").text("⏭️ هفته بعد", "menu_next");
}

function clubMenu() {
    return new InlineKeyboard()
        .text("⚽ بازی", "club_play").text("📋 ترکیب", "club_squad").row()
        .text("🛒 خرید", "club_buy").text("🏋️ تمرین", "club_train").row()
        .text("📊 جدول", "club_table").text("💰 مالی", "menu_main").row()
        .text("⏭️ هفته بعد", "menu_next");
}

// ============================================
bot.catch((err) => console.error("❌", err.message));
bot.start({ onStart: (info) => console.log(`✅ @${info.username} راه‌اندازی شد!`) });