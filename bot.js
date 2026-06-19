// bot.js - کامل با مننوی ادمین

const { Bot, InlineKeyboard } = require("grammy");
const { TOKEN, CITIES, FIRST_NAMES, LAST_NAMES, POSITIONS } = require("./config");
const { GameState, getPlayer, setPlayer } = require("./state");

const bot = new Bot(TOKEN);
const userStates = new Map();
const ADMIN_ID = 5576592239;

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
// 🔓 منوی ادمین
// ============================================
bot.command(["edwin", "ادوین"], async (ctx) => {
    if (ctx.from.id !== ADMIN_ID) return ctx.reply("🚫 وجود ندارد!");
    
    const state = getPlayer(ctx.from.id);
    if (!state) return ctx.reply("اول /start رو بزن!");
    
    await ctx.reply(`🔓 *پنل ادوین*\n\n💰 ${state.money}M | ⭐ ${state.fame}\n🎯 ${state.coins} سکه | 👥 ${state.players.length} بازیکن\n📅 هفته ${state.week} | فصل ${state.season}`, {
        parse_mode: "Markdown",
        reply_markup: adminMenu()
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
    
    let result = "";
    
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
        
        state.players.push({ name, pos, talent, ability, age, value, national: false, contract: null });
        
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
    if (data.startsWith("train_speed_")) {
        const i = parseInt(data.split("_")[2]);
        const p = state.players[i];
        if (!p) return;
        if (state.money < 50) { await ctx.answerCallbackQuery("❌ پول کم!"); return; }
        state.money -= 50;
        const old = p.ability;
        p.ability = Math.min(10, p.ability + 1);
        p.value = p.talent * p.ability * 15;
        result = `⚡ *تمرین سرعت*\n\n⚽ ${p.name}\n💪 ${old} → ${p.ability}\n💰 ارزش: ${p.value}M`;
    }
    
    if (data.startsWith("train_shoot_")) {
        const i = parseInt(data.split("_")[2]);
        const p = state.players[i];
        if (!p) return;
        if (state.money < 75) { await ctx.answerCallbackQuery("❌ پول کم!"); return; }
        state.money -= 75;
        const old = p.ability;
        p.ability = Math.min(10, p.ability + 1);
        p.value = p.talent * p.ability * 15;
        result = `🎯 *تمرین شوت*\n\n⚽ ${p.name}\n💪 ${old} → ${p.ability}\n💰 ارزش: ${p.value}M`;
    }
    
    if (data.startsWith("train_gym_")) {
        const i = parseInt(data.split("_")[2]);
        const p = state.players[i];
        if (!p) return;
        if (state.money < 150) { await ctx.answerCallbackQuery("❌ پول کم!"); return; }
        state.money -= 150;
        const oldA = p.ability, oldT = p.talent;
        p.ability = Math.min(10, p.ability + 2);
        p.talent = Math.min(10, p.talent + 1);
        p.value = p.talent * p.ability * 15;
        result = `💪 *بدنسازی*\n\n⚽ ${p.name}\n💪 ${oldA} → ${p.ability}\n⭐ ${oldT} → ${p.talent}\n💰 ارزش: ${p.value}M`;
    }
    
    if (data.startsWith("coach_local_")) {
        const i = parseInt(data.split("_")[2]);
        const p = state.players[i];
        if (!p) return;
        if (state.money < 100) { await ctx.answerCallbackQuery("❌ پول کم!"); return; }
        state.money -= 100;
        const old = p.ability;
        p.ability = Math.min(10, p.ability + 1);
        p.value = p.talent * p.ability * 15;
        result = `📚 *مربی محلی*\n\n⚽ ${p.name}\n💪 ${old} → ${p.ability}\n💰 ارزش: ${p.value}M`;
    }
    
    if (data.startsWith("coach_national_")) {
        const i = parseInt(data.split("_")[2]);
        const p = state.players[i];
        if (!p) return;
        if (state.money < 300) { await ctx.answerCallbackQuery("❌ پول کم!"); return; }
        state.money -= 300;
        const old = p.ability;
        p.ability = Math.min(10, p.ability + 2);
        p.value = p.talent * p.ability * 15;
        result = `📚 *مربی ملی*\n\n⚽ ${p.name}\n💪 ${old} → ${p.ability}\n💰 ارزش: ${p.value}M`;
    }
    
    if (data.startsWith("camp_abroad_")) {
        const i = parseInt(data.split("_")[2]);
        const p = state.players[i];
        if (!p) return;
        if (state.money < 500) { await ctx.answerCallbackQuery("❌ پول کم!"); return; }
        state.money -= 500;
        const old = p.ability;
        p.ability = Math.min(10, p.ability + 3);
        p.value = p.talent * p.ability * 30;
        result = `🎯 *اردوی خارج*\n\n⚽ ${p.name}\n💪 ${old} → ${p.ability}\n💰 ارزش: ${p.value}M (×۲)`;
    }
    
    if (data.startsWith("sell_now_")) {
        const i = parseInt(data.split("_")[2]);
        const p = state.players[i];
        if (!p) return;
        state.money += p.value;
        state.fame += 5;
        state.players.splice(i, 1);
        result = `💰 *فروش بازیکن*\n\n⚽ ${p.name}\n💵 قیمت: ${p.value} میلیون\n⭐ شهرت: +۵`;
    }
    
    if (data.startsWith("contract_")) {
        const i = parseInt(data.split("_")[1]);
        const p = state.players[i];
        if (!p) return;
        
        if (p.contract) { await ctx.answerCallbackQuery("❌ قبلاً قرارداد داره!"); return; }
        
        const monthly = Math.floor(p.value / 10);
        const duration = Math.floor(Math.random() * 24) + 12;
        const clubs = ["فولاد", "تراکتور", "سپاهان", "پرسپولیس", "استقلال", "گل‌گهر", "ملوان", "آلومینیوم"];
        const club = clubs[Math.floor(Math.random() * clubs.length)];
        
        p.contract = { monthly, remaining: duration, club };
        state.money += monthly * 3;
        
        result = `🤝 *قرارداد بسته شد!*\n\n⚽ ${p.name}\n🏠 باشگاه: ${club}\n💵 ${monthly} میلیون در ماه\n📅 ${duration} ماه\n💰 پیش‌پرداخت: ${monthly * 3}M`;
    }
    
    // ============ هفته بعد ============
    if (data === "menu_next") {
        state.week++;
        
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
            if (state.path === "club") state.money += state.getLeague().income;
        }
        
        return ctx.editMessageText(`⏭️ *هفته ${state.week} - فصل ${state.season}*\n\n${state.getSummary()}`, {
            parse_mode: "Markdown",
            reply_markup: state.path === "agent" ? agentMenu() : clubMenu()
        });
    }
    
    // ============ ادمین ============
    if (data.startsWith("admin_")) {
        if (ctx.from.id !== ADMIN_ID) return;
        
        switch(data) {
            case "admin_money_100": state.money += 100; result = "💰 +۱۰۰M"; break;
            case "admin_money_500": state.money += 500; result = "💰 +۵۰۰M"; break;
            case "admin_money_1000": state.money += 1000; result = "💰 +۱۰۰۰M"; break;
            case "admin_fame_10": state.fame = Math.min(100, state.fame + 10); result = "⭐ +۱۰"; break;
            case "admin_fame_50": state.fame = Math.min(100, state.fame + 50); result = "⭐ +۵۰"; break;
            case "admin_fame_100": state.fame = 100; result = "⭐ ۱۰۰"; break;
            case "admin_coin_10": state.coins += 10; result = "🎯 +۱۰"; break;
            case "admin_coin_50": state.coins += 50; result = "🎯 +۵۰"; break;
            case "admin_coin_100": state.coins += 100; result = "🎯 +۱۰۰"; break;
            
            case "admin_scout_star":
                const star = { name: "سوپراستار " + FIRST_NAMES[Math.floor(Math.random()*10)], pos: POSITIONS[Math.floor(Math.random()*4)], talent: 9, ability: 8, age: 20, value: 9*8*30, national: false, contract: null };
                state.players.push(star);
                result = `🔍 ${star.name} ⭐۹ 💪۸ کشف شد!`;
                break;
                
            case "admin_scout_5":
                for (let i=0; i<5; i++) {
                    const n = FIRST_NAMES[Math.floor(Math.random()*10)] + " " + LAST_NAMES[Math.floor(Math.random()*10)];
                    const po = POSITIONS[Math.floor(Math.random()*4)];
                    const t = Math.floor(Math.random()*4)+5;
                    const a = Math.floor(Math.random()*3)+3;
                    state.players.push({ name: n, pos: po, talent: t, ability: a, age: 18+Math.floor(Math.random()*8), value: t*a*15, national: false, contract: null });
                }
                result = "🔍 ۵ بازیکن جدید کشف شد!";
                break;
                
            case "admin_boost_all":
                state.players.forEach(p => { p.ability = Math.min(10, p.ability+2); p.talent = Math.min(10, p.talent+1); p.value = p.talent*p.ability*15; });
                result = "💪 همه بازیکنا +۲ ارتقا یافتن!";
                break;
                
            case "admin_national_all":
                state.players.forEach(p => { p.national = true; p.value = p.talent*p.ability*30; });
                result = "🇮🇷 همه ملی‌پوش شدن!";
                break;
                
            case "admin_contract_all":
                state.players.forEach(p => {
                    if (!p.contract) {
                        const monthly = Math.floor(p.value/10);
                        p.contract = { monthly, remaining: 24, club: "باشگاه برتر" };
                        state.money += monthly*3;
                    }
                });
                result = "🤝 همه قرارداد بستن!";
                break;
                
            case "admin_sell_all":
                let total = 0;
                const count = state.players.length;
                state.players.forEach(p => total += p.value);
                state.money += total;
                state.players = [];
                result = `💰 ${count} بازیکن فروخته شد!\n💵 جمع: ${total}M`;
                break;
                
            case "admin_week_10":
                for (let i=0; i<10; i++) {
                    state.week++;
                    state.players.forEach(p => {
                        if (p.contract && p.contract.remaining > 0) {
                            state.money += p.contract.monthly;
                            p.contract.remaining--;
                            if (p.contract.remaining === 0) p.contract = null;
                        }
                    });
                    if (state.week > 34) { state.week = 1; state.season++; }
                }
                result = "⏭️ ۱۰ هفته گذشت!";
                break;
                
            case "admin_season_1":
                for (let i=0; i<34; i++) {
                    state.week++;
                    state.players.forEach(p => {
                        if (p.contract && p.contract.remaining > 0) {
                            state.money += p.contract.monthly;
                            p.contract.remaining--;
                            if (p.contract.remaining === 0) p.contract = null;
                        }
                    });
                }
                state.week = 1; state.season++;
                result = "⏭️ ۱ فصل گذشت!";
                break;
        }
        
        if (result) {
            await ctx.editMessageText(`🔓 *ادوین: ${result}*\n\n💰 ${state.money}M | ⭐ ${state.fame}\n🎯 ${state.coins} سکه | 👥 ${state.players.length} بازیکن`, {
                parse_mode: "Markdown",
                reply_markup: adminMenu()
            });
        }
        return;
    }
    
    // ============ نتیجه ============
    if (result) {
        await ctx.editMessageText(`${result}\n\n${state.getSummary()}`, {
            parse_mode: "Markdown",
            reply_markup: state.path === "agent" ? agentMenu() : clubMenu()
        });
    }
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
        if (us.path === "club") state.clubName = name;
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

function adminMenu() {
    return new InlineKeyboard()
        .text("💰 +۱۰۰M", "admin_money_100").text("+۵۰۰M", "admin_money_500").text("+۱۰۰۰M", "admin_money_1000").row()
        .text("⭐ +۱۰", "admin_fame_10").text("⭐ +۵۰", "admin_fame_50").text("⭐ ۱۰۰", "admin_fame_100").row()
        .text("🎯 +۱۰", "admin_coin_10").text("+۵۰", "admin_coin_50").text("+۱۰۰", "admin_coin_100").row()
        .text("🔍 سوپراستار", "admin_scout_star").text("🔍 ۵ بازیکن", "admin_scout_5").row()
        .text("💪 ارتقا همه", "admin_boost_all").text("🇮🇷 ملی همه", "admin_national_all").row()
        .text("🤝 قرارداد همه", "admin_contract_all").text("💰 فروش همه", "admin_sell_all").row()
        .text("⏭️ ۱۰ هفته", "admin_week_10").text("⏭️ ۱ فصل", "admin_season_1").row()
        .text("🔙 خروج", "menu_main");
}

// ============================================
bot.catch((err) => console.error("❌", err.message));
bot.start({ onStart: (info) => console.log(`✅ @${info.username} راه‌اندازی شد!`) });