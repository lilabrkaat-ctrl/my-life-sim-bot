const { Bot, InlineKeyboard } = require("grammy");
const { TOKEN, CITIES, FIRST_NAMES, LAST_NAMES, POSITIONS, LEAGUES } = require("./config");
const { GameState, getPlayer, setPlayer } = require("./state");
const { getImage } = require("./images");

const bot = new Bot(TOKEN);
const userStates = new Map();
const ADMIN_ID = 5576592239;
const SPECIAL_PLAYER = { name: "مهدی برکات", pos: "🥅 دروازه‌بان", talent: 9, ability: 7, city: "بندرلنگه", chance: 5 };

// ============================================
// /start
// ============================================
bot.command("start", async (ctx) => {
    const userId = ctx.from.id;
    let state = getPlayer(userId);
    
    if (state) {
        return ctx.replyWithPhoto(getImage("main"), {
            caption: state.getSummary(),
            parse_mode: "Markdown",
            reply_markup: state.path === "agent" ? agentMenu() : clubMenu()
        });
    }
    
    const kb = new InlineKeyboard()
        .text("👤 ایجنت", "path_agent").text("⚽ باشگاه", "path_club").row();
    
    await ctx.replyWithPhoto(getImage("main"), {
        caption: `🎮 *بازی امپراتوری فوتبال*\n\nمسیرت رو انتخاب کن:\n\n👤 ایجنت: کشف بازیکن، ارتقا، فروش\n⚽ باشگاه: تأسیس تیم، بازی، قهرمانی`,
        parse_mode: "Markdown",
        reply_markup: kb
    });
});

// ============================================
// /edwin
// ============================================
bot.command(["edwin", "ادوین"], async (ctx) => {
    if (ctx.from.id !== ADMIN_ID) return ctx.reply("🚫 وجود ندارد!");
    const state = getPlayer(ctx.from.id);
    if (!state) return ctx.reply("اول /start");
    
    await ctx.replyWithPhoto(getImage("main"), {
        caption: `🔓 *پنل ادوین*\n💰 ${state.money}M | ⭐ ${state.fame}\n🎯 ${state.coins} | 👥 ${state.players.length}`,
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
    
    if (data === "path_agent" || data === "path_club") {
        const path = data === "path_agent" ? "agent" : "club";
        userStates.set(userId, { choosing: "name", path: path });
        return ctx.editMessageText(`✍️ اسم ${path === "agent" ? "ایجنت" : "باشگاه"} رو تایپ کن:`, { parse_mode: "Markdown" });
    }
    
    const state = getPlayer(userId);
    if (!state) { await ctx.answerCallbackQuery("❌ /start بزن!"); return; }
    
    let result = "";
    let currentImage = getImage("main");
    
    // ============ منوی اصلی ============
    if (data === "menu_main") {
        return ctx.editMessageMedia(
            { type: "photo", media: getImage("main"), caption: state.getSummary(), parse_mode: "Markdown" },
            { reply_markup: state.path === "agent" ? agentMenu() : clubMenu() }
        );
    }
    
    // ============ کشف بازیکن - انتخاب لیگ ============
    if (data === "agent_scout") {
        const kb = new InlineKeyboard();
        LEAGUES.forEach((l, i) => {
            kb.text(`${l.name} (⭐${l.minStar}-${l.maxStar})`, `scout_league_${i}`).row();
        });
        kb.text("🔙 بازگشت", "menu_main");
        
        return ctx.editMessageMedia(
            { type: "photo", media: getImage("scout"), caption: `🔍 *کشف بازیکن*\n\nکدوم لیگ رو می‌خوای بگردی؟\n💰 هزینه: ۵۰M | بودجه: ${state.money}M`, parse_mode: "Markdown" },
            { reply_markup: kb }
        );
    }
    
    // ============ کشف بازیکن - نمایش ۳ بازیکن ============
    if (data.startsWith("scout_league_")) {
        const leagueIndex = parseInt(data.split("_")[2]);
        const league = LEAGUES[leagueIndex];
        
        if (state.money < 50) { await ctx.answerCallbackQuery("❌ پول کم! (۵۰M نیازه)"); return; }
        state.money -= 50;
        
        const found = [];
        for (let i = 0; i < 3; i++) {
            if (leagueIndex === 0 && Math.random() * 100 < SPECIAL_PLAYER.chance) {
                found.push({
                    name: SPECIAL_PLAYER.name, pos: SPECIAL_PLAYER.pos,
                    talent: SPECIAL_PLAYER.talent, ability: SPECIAL_PLAYER.ability,
                    age: 21, city: SPECIAL_PLAYER.city,
                    value: SPECIAL_PLAYER.talent * SPECIAL_PLAYER.ability * 15,
                    special: true, national: false, contract: null
                });
            } else {
                const name = FIRST_NAMES[Math.floor(Math.random() * FIRST_NAMES.length)] + " " + LAST_NAMES[Math.floor(Math.random() * LAST_NAMES.length)];
                const pos = POSITIONS[Math.floor(Math.random() * POSITIONS.length)];
                const talent = Math.floor(Math.random() * (league.maxStar - league.minStar + 1)) + league.minStar;
                const ability = Math.floor(Math.random() * (league.maxAbility - league.minAbility + 1)) + league.minAbility;
                const age = Math.floor(Math.random() * 10) + 16;
                const city = CITIES[Math.floor(Math.random() * CITIES.length)];
                const value = talent * ability * 15;
                found.push({ name, pos, talent, ability, age, city, value, special: false, national: false, contract: null });
            }
        }
        
        state.tempPlayers = found;
        
        let txt = `🔍 *${league.name} - ۳ بازیکن*\n\n💰 هزینه: ۵۰M | بودجه: ${state.money}M\n━━━━━━━━━━━━━━━━━━\n\n`;
        found.forEach((p, i) => {
            const star = p.special ? "🌟" : "";
            txt += `${i+1}. ${star}⚽ *${p.name}*\n   📊 ${p.pos} | ${p.age} سال | ${p.city}\n   ⭐${p.talent} 💪${p.ability} | 💰${p.value}M\n`;
            if (p.special) txt += `   🏆 استعداد ویژه!\n`;
            txt += "\n";
        });
        
        const kb = new InlineKeyboard();
        found.forEach((p, i) => {
            const star = p.special ? "🌟" : "";
            kb.text(`${i+1}. ${p.name} ${star}`, `scout_pick_${i}`).row();
        });
        kb.text("🔍 جستجوی دوباره (۵۰M)", `scout_league_${leagueIndex}`).row();
        kb.text("🔙 تغییر لیگ", "agent_scout");
        
        return ctx.editMessageMedia(
            { type: "photo", media: getImage("scout"), caption: txt, parse_mode: "Markdown" },
            { reply_markup: kb }
        );
    }
    
    // ============ انتخاب بازیکن ============
    if (data.startsWith("scout_pick_")) {
        const index = parseInt(data.split("_")[2]);
        if (!state.tempPlayers || !state.tempPlayers[index]) { await ctx.answerCallbackQuery("❌ پیدا نشد!"); return; }
        
        const p = state.tempPlayers[index];
        state.players.push(p);
        state.tempPlayers = null;
        
        const star = p.special ? "🌟 " : "";
        result = `✅ *${star}${p.name} انتخاب شد!*\n\n📊 ${p.pos} | ${p.age} سال | ${p.city}\n⭐${p.talent} 💪${p.ability} | 💰${p.value}M`;
        currentImage = getImage("player");
    }
    
    // ============ لیست بازیکنان ============
    if (data === "agent_players") {
        if (state.players.length === 0) {
            return ctx.editMessageMedia(
                { type: "photo", media: getImage("player"), caption: "👥 هنوز بازیکنی نداری!\nبرو کشف کن.", parse_mode: "Markdown" },
                { reply_markup: agentMenu() }
            );
        }
        
        const kb = new InlineKeyboard();
        state.players.forEach((p, i) => {
            const star = p.special ? "🌟" : "";
            kb.text(`${i+1}. ${star}${p.name} ⭐${p.talent}`, `player_view_${i}`).row();
        });
        kb.text("🔙 منوی اصلی", "menu_main");
        
        return ctx.editMessageMedia(
            { type: "photo", media: getImage("player"), caption: `👥 *بازیکنای تو* (${state.players.length} نفر)\n\nیه بازیکن انتخاب کن:`, parse_mode: "Markdown" },
            { reply_markup: kb }
        );
    }
    
    // ============ صفحه بازیکن ============
    if (data.startsWith("player_view_")) {
        const index = parseInt(data.split("_")[2]);
        const p = state.players[index];
        if (!p) { await ctx.answerCallbackQuery("❌ نیست!"); return; }
        
        const kb = new InlineKeyboard()
            .text("🏋️ ارتقا", `player_upgrade_${index}`).text("🤝 قرارداد", `contract_${index}`).text("💰 فروش", `sell_now_${index}`).row()
            .text("🔙 بازیکنای من", "agent_players");
        
        const star = p.special ? "🌟 " : "";
        let txt = `${star}⚽ *${p.name}*\n📊 ${p.pos} | ${p.age} سال | ${p.city}\n⭐${p.talent} 💪${p.ability} | 💰${p.value}M`;
        if (p.national) txt += "\n🇮🇷 تیم ملی";
        if (p.contract) txt += `\n📋 ${p.contract.club} | 💵${p.contract.monthly}M | ${p.contract.remaining} ماه`;
        
        return ctx.editMessageMedia(
            { type: "photo", media: getImage("player"), caption: txt, parse_mode: "Markdown" },
            { reply_markup: kb }
        );
    }
    
    // ============ ارتقا ============
    if (data.startsWith("player_upgrade_")) {
        const index = parseInt(data.split("_")[2]);
        const p = state.players[index];
        if (!p) { await ctx.answerCallbackQuery("❌ نیست!"); return; }
        
        const kb = new InlineKeyboard()
            .text("⚡ سرعت (۵۰M)", `train_speed_${index}`).text("🎯 شوت (۷۵M)", `train_shoot_${index}`).row()
            .text("💪 بدنسازی (۱۵۰M)", `train_gym_${index}`).text("📚 مربی (۳۰۰M)", `coach_national_${index}`).row()
            .text("🎯 اردو (۵۰۰M)", `camp_abroad_${index}`).text("🔙 بازیکن", `player_view_${index}`);
        
        return ctx.editMessageMedia(
            { type: "photo", media: getImage("training"), caption: `🏋️ *ارتقا ${p.name}*\n⭐${p.talent} 💪${p.ability} | 💰${p.value}M\n\nکدوم تمرین؟`, parse_mode: "Markdown" },
            { reply_markup: kb }
        );
    }
    
    // ============ تمرین‌ها ============
    if (data.startsWith("train_speed_")) {
        const i = parseInt(data.split("_")[2]); const p = state.players[i];
        if (state.money < 50) { await ctx.answerCallbackQuery("❌ پول کم!"); return; }
        state.money -= 50; p.ability = Math.min(10, p.ability + 1); p.value = p.talent * p.ability * 15;
        result = `⚡ ${p.name}\n💪 +۱ | 💰${p.value}M`; currentImage = getImage("training");
    }
    if (data.startsWith("train_shoot_")) {
        const i = parseInt(data.split("_")[2]); const p = state.players[i];
        if (state.money < 75) { await ctx.answerCallbackQuery("❌ پول کم!"); return; }
        state.money -= 75; p.ability = Math.min(10, p.ability + 1); p.value = p.talent * p.ability * 15;
        result = `🎯 ${p.name}\n💪 +۱ | 💰${p.value}M`; currentImage = getImage("training");
    }
    if (data.startsWith("train_gym_")) {
        const i = parseInt(data.split("_")[2]); const p = state.players[i];
        if (state.money < 150) { await ctx.answerCallbackQuery("❌ پول کم!"); return; }
        state.money -= 150; p.ability = Math.min(10, p.ability + 2); p.talent = Math.min(10, p.talent + 1); p.value = p.talent * p.ability * 15;
        result = `💪 ${p.name}\n💪 +۲ ⭐ +۱ | 💰${p.value}M`; currentImage = getImage("training");
    }
    if (data.startsWith("coach_national_")) {
        const i = parseInt(data.split("_")[2]); const p = state.players[i];
        if (state.money < 300) { await ctx.answerCallbackQuery("❌ پول کم!"); return; }
        state.money -= 300; p.ability = Math.min(10, p.ability + 2); p.value = p.talent * p.ability * 15;
        result = `📚 ${p.name}\n💪 +۲ | 💰${p.value}M`; currentImage = getImage("training");
    }
    if (data.startsWith("camp_abroad_")) {
        const i = parseInt(data.split("_")[2]); const p = state.players[i];
        if (state.money < 500) { await ctx.answerCallbackQuery("❌ پول کم!"); return; }
        state.money -= 500; p.ability = Math.min(10, p.ability + 3); p.value = p.talent * p.ability * 30;
        result = `🎯 ${p.name}\n💪 +۳ | 💰${p.value}M (×۲)`; currentImage = getImage("training");
    }
    
    // ============ فروش و قرارداد ============
    if (data.startsWith("sell_now_")) {
        const i = parseInt(data.split("_")[2]); const p = state.players[i];
        state.money += p.value; state.fame += 5; state.players.splice(i, 1);
        result = `💰 ${p.name} فروخته شد!\n💵 ${p.value}M | ⭐ +۵`; currentImage = getImage("sell");
    }
    if (data.startsWith("contract_")) {
        const i = parseInt(data.split("_")[1]); const p = state.players[i];
        if (p.contract) { await ctx.answerCallbackQuery("❌ قبلاً قرارداد داره!"); return; }
        const monthly = Math.floor(p.value / 10);
        const clubs = ["فولاد", "تراکتور", "سپاهان", "پرسپولیس", "استقلال", "ملوان"];
        p.contract = { monthly, remaining: 24, club: clubs[Math.floor(Math.random() * clubs.length)] };
        state.money += monthly * 3;
        result = `🤝 ${p.name}\n🏠 ${p.contract.club}\n💵 ${monthly}M/ماه | ۲۴ ماه`; currentImage = getImage("contract");
    }
    
    // ============ هفته بعد ============
    if (data === "menu_next") {
        state.week++;
        for (const p of state.players) {
            if (p.contract && p.contract.remaining > 0) {
                state.money += p.contract.monthly;
                p.contract.remaining--;
                if (p.contract.remaining === 0) { p.contract = null; state.fame += 3; }
            }
        }
        if (state.week > 34) { state.week = 1; state.season++; }
        
        return ctx.editMessageMedia(
            { type: "photo", media: getImage("main"), caption: `⏭️ هفته ${state.week} - فصل ${state.season}\n\n${state.getSummary()}`, parse_mode: "Markdown" },
            { reply_markup: state.path === "agent" ? agentMenu() : clubMenu() }
        );
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
                state.players.push({ name: SPECIAL_PLAYER.name, pos: SPECIAL_PLAYER.pos, talent: SPECIAL_PLAYER.talent, ability: SPECIAL_PLAYER.ability, age: 21, city: SPECIAL_PLAYER.city, value: SPECIAL_PLAYER.talent * SPECIAL_PLAYER.ability * 30, special: true, national: false, contract: null });
                result = `🌟 ${SPECIAL_PLAYER.name} کشف شد!`; break;
            case "admin_boost_all":
                state.players.forEach(p => { p.ability = Math.min(10, p.ability+2); p.talent = Math.min(10, p.talent+1); p.value = p.talent*p.ability*15; });
                result = "💪 همه +۲"; break;
            case "admin_national_all":
                state.players.forEach(p => { p.national = true; p.value = p.talent*p.ability*30; });
                result = "🇮🇷 همه ملی"; break;
            case "admin_contract_all":
                state.players.forEach(p => { if (!p.contract) { const m = Math.floor(p.value/10); p.contract = { monthly: m, remaining: 24, club: "باشگاه" }; state.money += m*3; } });
                result = "🤝 همه قرارداد"; break;
            case "admin_sell_all":
                let t = 0; state.players.forEach(p => t += p.value); state.money += t; state.players = [];
                result = `💰 همه فروخته شد! +${t}M`; break;
            case "admin_week_10":
                for (let i=0; i<10; i++) {
                    state.week++; state.players.forEach(p => { if (p.contract && p.contract.remaining > 0) { state.money += p.contract.monthly; p.contract.remaining--; if (p.contract.remaining === 0) p.contract = null; } });
                    if (state.week > 34) { state.week = 1; state.season++; }
                }
                result = "⏭️ ۱۰ هفته"; break;
            case "admin_season_1":
                for (let i=0; i<34; i++) {
                    state.week++; state.players.forEach(p => { if (p.contract && p.contract.remaining > 0) { state.money += p.contract.monthly; p.contract.remaining--; if (p.contract.remaining === 0) p.contract = null; } });
                }
                state.week = 1; state.season++;
                result = "⏭️ ۱ فصل"; break;
        }
        if (result) return ctx.editMessageMedia(
            { type: "photo", media: getImage("main"), caption: `🔓 *${result}*\n💰 ${state.money}M | ⭐ ${state.fame}`, parse_mode: "Markdown" },
            { reply_markup: adminMenu() }
        );
    }
    
    // ============ نمایش نتیجه ============
    if (result) {
        await ctx.editMessageMedia(
            { type: "photo", media: currentImage, caption: `${result}\n\n${state.getSummary()}`, parse_mode: "Markdown" },
            { reply_markup: state.path === "agent" ? agentMenu() : clubMenu() }
        );
    }
});

// ============================================
// پیام اسم
// ============================================
bot.on("message:text", async (ctx) => {
    const userId = ctx.from.id;
    const us = userStates.get(userId);
    if (us && us.choosing === "name") {
        const state = new GameState(ctx.message.text, us.path);
        if (us.path === "club") state.clubName = ctx.message.text;
        setPlayer(userId, state);
        userStates.delete(userId);
        await ctx.replyWithPhoto(getImage("main"), {
            caption: `🎉 ثبت شد!\n\n${state.getSummary()}`,
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
        .text("📊 آمار", "menu_main").text("⏭️ هفته بعد", "menu_next");
}

function clubMenu() {
    return new InlineKeyboard()
        .text("⚽ بازی", "club_play").text("📋 ترکیب", "club_squad").row()
        .text("🛒 بازار", "club_buy").text("🏋️ تمرین", "club_train").row()
        .text("📊 جدول", "club_table").text("⏭️ هفته بعد", "menu_next");
}

function adminMenu() {
    return new InlineKeyboard()
        .text("💰 +۱۰۰M", "admin_money_100").text("+۵۰۰M", "admin_money_500").text("+۱۰۰۰M", "admin_money_1000").row()
        .text("⭐ +۱۰", "admin_fame_10").text("+۵۰", "admin_fame_50").text("۱۰۰", "admin_fame_100").row()
        .text("🎯 +۱۰", "admin_coin_10").text("+۵۰", "admin_coin_50").text("+۱۰۰", "admin_coin_100").row()
        .text("🌟 مهدی برکات", "admin_scout_star").text("💪 ارتقا همه", "admin_boost_all").row()
        .text("🇮🇷 ملی همه", "admin_national_all").text("🤝 قرارداد همه", "admin_contract_all").row()
        .text("💰 فروش همه", "admin_sell_all").row()
        .text("⏭️ ۱۰ هفته", "admin_week_10").text("⏭️ ۱ فصل", "admin_season_1").row()
        .text("🔙 خروج", "menu_main");
}

// ============================================
bot.catch((err) => console.error("❌", err.message));
bot.start({ onStart: (info) => console.log(`✅ @${info.username} راه‌اندازی شد!`) });