const { Bot, InlineKeyboard } = require("grammy");
const { TOKEN, CITIES, FIRST_NAMES, LAST_NAMES, POSITIONS, LEAGUES } = require("./config");
const { GameState, getPlayer, setPlayer } = require("./state");
const { getImage } = require("./images");

const bot = new Bot(TOKEN);
const userStates = new Map();
const ADMIN_ID = 5576592239;
const SPECIAL_PLAYER = { name: "مهدی برکات", pos: "🥅 دروازه‌بان", talent: 9, ability: 7, city: "بندرلنگه", chance: 5 };

// /start
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
    
    const kb = new InlineKeyboard().text("👤 ایجنت", "path_agent").text("⚽ باشگاه", "path_club").row();
    
    await ctx.replyWithPhoto(getImage("main"), {
        caption: "🎮 *بازی امپراتوری فوتبال*\n\nمسیرت رو انتخاب کن:\n\n👤 ایجنت: کشف بازیکن، ارتقا، فروش\n⚽ باشگاه: تأسیس تیم، بازی، قهرمانی",
        parse_mode: "Markdown",
        reply_markup: kb
    });
});

// /edwin
bot.command(["edwin", "ادوین"], async (ctx) => {
    if (ctx.from.id !== ADMIN_ID) return ctx.reply("🚫 وجود ندارد!");
    const state = getPlayer(ctx.from.id);
    if (!state) return ctx.reply("اول /start");
    await ctx.replyWithPhoto(getImage("main"), {
        caption: `🔓 پنل ادوین\n💰 ${state.money}M | ⭐ ${state.fame}\n🎯 ${state.coins} | 👥 ${state.players.length}`,
        parse_mode: "Markdown",
        reply_markup: adminMenu()
    });
});

// دکمه‌ها
bot.on("callback_query:data", async (ctx) => {
    const data = ctx.callbackQuery.data;
    const userId = ctx.from.id;
    await ctx.answerCallbackQuery();
    
    if (data === "path_agent" || data === "path_club") {
        const path = data === "path_agent" ? "agent" : "club";
        userStates.set(userId, { choosing: "name", path });
        return ctx.editMessageText(`✍️ اسم ${path === "agent" ? "ایجنت" : "باشگاه"} رو تایپ کن:`, { parse_mode: "Markdown" });
    }
    
    const state = getPlayer(userId);
    if (!state) { await ctx.answerCallbackQuery("❌ /start بزن!"); return; }
    
    let result = "";
    let img = getImage("main");
    
    if (data === "menu_main") {
        return ctx.editMessageMedia({ type: "photo", media: getImage("main"), caption: state.getSummary(), parse_mode: "Markdown" }, { reply_markup: state.path === "agent" ? agentMenu() : clubMenu() });
    }
    
    if (data === "agent_scout") {
        const kb = new InlineKeyboard();
        LEAGUES.forEach((l, i) => kb.text(`${l.name}`, `scout_league_${i}`).row());
        kb.text("🔙", "menu_main");
        return ctx.editMessageMedia({ type: "photo", media: getImage("scout"), caption: `🔍 کدوم لیگ؟\n💰 هزینه: ۵۰M | بودجه: ${state.money}M`, parse_mode: "Markdown" }, { reply_markup: kb });
    }
    
    if (data.startsWith("scout_league_")) {
        const leagueIndex = parseInt(data.split("_")[2]);
        const league = LEAGUES[leagueIndex];
        if (state.money < 50) { await ctx.answerCallbackQuery("❌ پول کم!"); return; }
        state.money -= 50;
        
        const found = [];
        for (let i = 0; i < 3; i++) {
            if (leagueIndex === 0 && Math.random() * 100 < SPECIAL_PLAYER.chance) {
                found.push({ name: SPECIAL_PLAYER.name, pos: SPECIAL_PLAYER.pos, talent: SPECIAL_PLAYER.talent, ability: SPECIAL_PLAYER.ability, age: 21, city: SPECIAL_PLAYER.city, value: SPECIAL_PLAYER.talent * SPECIAL_PLAYER.ability * 15, special: true, national: false, contract: null });
            } else {
                const name = FIRST_NAMES[Math.floor(Math.random() * FIRST_NAMES.length)] + " " + LAST_NAMES[Math.floor(Math.random() * LAST_NAMES.length)];
                const pos = POSITIONS[Math.floor(Math.random() * POSITIONS.length)];
                const talent = Math.floor(Math.random() * (league.maxStar - league.minStar + 1)) + league.minStar;
                const ability = Math.floor(Math.random() * (league.maxAbility - league.minAbility + 1)) + league.minAbility;
                const age = Math.floor(Math.random() * 10) + 16;
                const value = talent * ability * 15;
                found.push({ name, pos, talent, ability, age, city: CITIES[Math.floor(Math.random() * CITIES.length)], value, special: false, national: false, contract: null });
            }
        }
        
        state.tempPlayers = found;
        let txt = `🔍 *${league.name}*\n\n`;
        found.forEach((p, i) => txt += `${i+1}. ${p.special?"🌟":""}⚽ ${p.name}\n   ${p.pos} | ${p.age} | ⭐${p.talent} 💪${p.ability} | 💰${p.value}M\n\n`);
        
        const kb = new InlineKeyboard();
        found.forEach((p, i) => kb.text(`${i+1}. ${p.name}`, `scout_pick_${i}`).row());
        kb.text("🔍 دوباره (۵۰M)", `scout_league_${leagueIndex}`).row().text("🔙", "agent_scout");
        return ctx.editMessageMedia({ type: "photo", media: getImage("scout"), caption: txt, parse_mode: "Markdown" }, { reply_markup: kb });
    }
    
    if (data.startsWith("scout_pick_")) {
        const index = parseInt(data.split("_")[2]);
        if (!state.tempPlayers?.[index]) { await ctx.answerCallbackQuery("❌"); return; }
        const p = state.tempPlayers[index];
        state.players.push(p);
        state.tempPlayers = null;
        result = `✅ ${p.special?"🌟":""}${p.name} انتخاب شد!\n${p.pos} | ⭐${p.talent} 💪${p.ability} | 💰${p.value}M`;
        img = getImage("player");
    }
    
    if (data === "agent_players") {
        if (state.players.length === 0) return ctx.editMessageMedia({ type: "photo", media: getImage("player"), caption: "👥 خالی!", parse_mode: "Markdown" }, { reply_markup: agentMenu() });
        const kb = new InlineKeyboard();
        state.players.forEach((p, i) => kb.text(`${i+1}. ${p.special?"🌟":""}${p.name} ⭐${p.talent}`, `player_view_${i}`).row());
        kb.text("🔙", "menu_main");
        return ctx.editMessageMedia({ type: "photo", media: getImage("player"), caption: `👥 بازیکنای تو (${state.players.length})`, parse_mode: "Markdown" }, { reply_markup: kb });
    }
    
    if (data.startsWith("player_view_")) {
        const i = parseInt(data.split("_")[2]);
        const p = state.players[i];
        if (!p) { await ctx.answerCallbackQuery("❌"); return; }
        const kb = new InlineKeyboard().text("🏋️ ارتقا", `player_upgrade_${i}`).text("🤝 قرارداد", `contract_${i}`).text("💰 فروش", `sell_now_${i}`).row().text("🔙", "agent_players");
        let txt = `${p.special?"🌟":""}⚽ ${p.name}\n${p.pos} | ${p.age} | ${p.city}\n⭐${p.talent} 💪${p.ability} | 💰${p.value}M`;
        if (p.contract) txt += `\n📋 ${p.contract.club} | 💵${p.contract.monthly}M`;
        return ctx.editMessageMedia({ type: "photo", media: getImage("player"), caption: txt, parse_mode: "Markdown" }, { reply_markup: kb });
    }
    
    if (data.startsWith("player_upgrade_")) {
        const i = parseInt(data.split("_")[2]);
        const kb = new InlineKeyboard().text("⚡۵۰M", `train_speed_${i}`).text("🎯۷۵M", `train_shoot_${i}`).row().text("💪۱۵۰M", `train_gym_${i}`).text("📚۳۰۰M", `coach_national_${i}`).row().text("🎯۵۰۰M", `camp_abroad_${i}`).text("🔙", `player_view_${i}`);
        return ctx.editMessageMedia({ type: "photo", media: getImage("training"), caption: `🏋️ ${state.players[i].name}`, parse_mode: "Markdown" }, { reply_markup: kb });
    }
    
    if (data.startsWith("train_") || data.startsWith("coach_") || data.startsWith("camp_")) {
        const i = parseInt(data.split("_").pop());
        const p = state.players[i];
        const costs = { train_speed_: 50, train_shoot_: 75, train_gym_: 150, coach_national_: 300, camp_abroad_: 500 };
        const key = data.substring(0, data.lastIndexOf("_") + 1);
        const cost = costs[key] || 50;
        if (state.money < cost) { await ctx.answerCallbackQuery("❌ پول کم!"); return; }
        state.money -= cost;
        if (key === "train_gym_") { p.ability = Math.min(10, p.ability + 2); p.talent = Math.min(10, p.talent + 1); }
        else if (key === "camp_abroad_") { p.ability = Math.min(10, p.ability + 3); p.value = p.talent * p.ability * 30; return await finishResult(`🎯 ${p.name} 💪+۳ 💰${p.value}M`, getImage("training"), state); }
        else if (key === "coach_national_") { p.ability = Math.min(10, p.ability + 2); }
        else { p.ability = Math.min(10, p.ability + 1); }
        p.value = p.talent * p.ability * 15;
        result = `✅ ${p.name} 💪${p.ability} 💰${p.value}M`; img = getImage("training");
    }
    
    if (data.startsWith("sell_now_")) {
        const i = parseInt(data.split("_")[2]);
        const p = state.players[i];
        state.money += p.value; state.fame += 5; state.players.splice(i, 1);
        result = `💰 ${p.name} فروخته شد! +${p.value}M`; img = getImage("sell");
    }
    
    if (data.startsWith("contract_")) {
        const i = parseInt(data.split("_")[1]);
        const p = state.players[i];
        if (p.contract) { await ctx.answerCallbackQuery("❌ قبلاً قرارداد داره!"); return; }
        const monthly = Math.floor(p.value / 10);
        const clubs = ["فولاد", "تراکتور", "سپاهان", "پرسپولیس", "استقلال", "ملوان"];
        p.contract = { monthly, remaining: 24, club: clubs[Math.floor(Math.random() * clubs.length)] };
        state.money += monthly * 3;
        result = `🤝 ${p.name}\n🏠 ${p.contract.club}\n💵 ${monthly}M/ماه`; img = getImage("contract");
    }
    
    if (data === "menu_next") {
        state.week++;
        state.players.forEach(p => { if (p.contract && p.contract.remaining > 0) { state.money += p.contract.monthly; p.contract.remaining--; if (p.contract.remaining === 0) p.contract = null; } });
        if (state.week > 34) { state.week = 1; state.season++; }
        return ctx.editMessageMedia({ type: "photo", media: getImage("main"), caption: `⏭️ هفته ${state.week} - فصل ${state.season}\n\n${state.getSummary()}`, parse_mode: "Markdown" }, { reply_markup: state.path === "agent" ? agentMenu() : clubMenu() });
    }
    
    if (data.startsWith("admin_")) {
        if (ctx.from.id !== ADMIN_ID) return;
        switch(data) {
            case "admin_money_100": state.money += 100; result = "💰 +۱۰۰M"; break;
            case "admin_money_500": state.money += 500; result = "💰 +۵۰۰M"; break;
            case "admin_money_1000": state.money += 1000; result = "💰 +۱۰۰۰M"; break;
            case "admin_fame_10": state.fame = Math.min(100, state.fame + 10); result = "⭐ +۱۰"; break;
            case "admin_fame_50": state.fame = Math.min(100, state.fame + 50); result = "⭐ +۵۰"; break;
            case "admin_fame_100": state.fame = 100; result = "⭐ ۱۰۰"; break;
            case "admin_scout_star": state.players.push({ name: SPECIAL_PLAYER.name, pos: SPECIAL_PLAYER.pos, talent: SPECIAL_PLAYER.talent, ability: SPECIAL_PLAYER.ability, age: 21, city: SPECIAL_PLAYER.city, value: SPECIAL_PLAYER.talent * SPECIAL_PLAYER.ability * 30, special: true, national: false, contract: null }); result = `🌟 ${SPECIAL_PLAYER.name}`; break;
            case "admin_boost_all": state.players.forEach(p => { p.ability = Math.min(10, p.ability+2); p.talent = Math.min(10, p.talent+1); p.value = p.talent*p.ability*15; }); result = "💪 همه +۲"; break;
            case "admin_sell_all": let t = 0; state.players.forEach(p => t += p.value); state.money += t; state.players = []; result = `💰 +${t}M`; break;
        }
        if (result) return ctx.editMessageMedia({ type: "photo", media: getImage("main"), caption: `🔓 ${result}`, parse_mode: "Markdown" }, { reply_markup: adminMenu() });
    }
    
    if (result) {
        await ctx.editMessageMedia({ type: "photo", media: img, caption: `${result}\n\n${state.getSummary()}`, parse_mode: "Markdown" }, { reply_markup: state.path === "agent" ? agentMenu() : clubMenu() });
    }
});

// پیام اسم
bot.on("message:text", async (ctx) => {
    const us = userStates.get(ctx.from.id);
    if (us?.choosing === "name") {
        const state = new GameState(ctx.message.text, us.path);
        if (us.path === "club") state.clubName = ctx.message.text;
        setPlayer(ctx.from.id, state);
        userStates.delete(ctx.from.id);
        await ctx.replyWithPhoto(getImage("main"), { caption: `🎉 ثبت شد!\n\n${state.getSummary()}`, parse_mode: "Markdown", reply_markup: us.path === "agent" ? agentMenu() : clubMenu() });
    }
});

async function finishResult(text, img, state) {
    await ctx.editMessageMedia({ type: "photo", media: img, caption: `${text}\n\n${state.getSummary()}`, parse_mode: "Markdown" }, { reply_markup: state.path === "agent" ? agentMenu() : clubMenu() });
}

function agentMenu() { return new InlineKeyboard().text("🔍 کشف", "agent_scout").text("👥 بازیکنا", "agent_players").row().text("📊 آمار", "menu_main").text("⏭️ هفته", "menu_next"); }
function clubMenu() { return new InlineKeyboard().text("⚽ بازی", "club_play").text("📋 ترکیب", "club_squad").row().text("📊 جدول", "club_table").text("⏭️ هفته", "menu_next"); }
function adminMenu() { return new InlineKeyboard().text("💰 +۱۰۰M", "admin_money_100").text("+۵۰۰M", "admin_money_500").text("+۱۰۰۰M", "admin_money_1000").row().text("⭐ +۱۰", "admin_fame_10").text("+۵۰", "admin_fame_50").text("۱۰۰", "admin_fame_100").row().text("🌟 برکات", "admin_scout_star").text("💪 همه", "admin_boost_all").row().text("💰 فروش همه", "admin_sell_all").text("🔙", "menu_main"); }

bot.catch((err) => console.error("❌", err.message));
bot.start({ onStart: (info) => console.log(`✅ @${info.username}`) });