// bot.js - بازی ایجنت فوتبال - نسخه نهایی کامل

const { Bot, InlineKeyboard } = require("grammy");

const TOKEN = process.env.BOT_TOKEN || "TOKEN_DEFAULT";

// ============================================
// تنظیمات
// ============================================
const CITIES = ["بندرعباس", "بندرلنگه", "قشم", "میناب", "جاسک", "خواجه", "رودان", "سیریک", "حاجی‌آباد", "تنب"];

const LEAGUES = [
    { name: "لیگ استان", teams: 8, income: 50, cost: 20, level: 1, minStar: 2, maxStar: 4, minAbility: 1, maxAbility: 3 },
    { name: "لیگ استانی", teams: 10, income: 100, cost: 50, level: 2, minStar: 3, maxStar: 5, minAbility: 2, maxAbility: 4 },
    { name: "لیگ دسته ۳", teams: 12, income: 200, cost: 100, level: 3, minStar: 4, maxStar: 6, minAbility: 3, maxAbility: 5 },
    { name: "لیگ دسته ۲", teams: 14, income: 500, cost: 250, level: 4, minStar: 5, maxStar: 7, minAbility: 4, maxAbility: 6 },
    { name: "لیگ دسته ۱", teams: 16, income: 1000, cost: 500, level: 5, minStar: 6, maxStar: 8, minAbility: 5, maxAbility: 7 },
    { name: "لیگ برتر", teams: 16, income: 5000, cost: 2000, level: 6, minStar: 7, maxStar: 9, minAbility: 6, maxAbility: 8 }
];

const POSITIONS = ["🥅 دروازه‌بان", "🛡️ مدافع", "⚡ هافبک", "🎯 مهاجم"];

const FIRST_NAMES = ["علی", "حسین", "محمد", "رضا", "امیر", "مهدی", "سعید", "فرهاد", "احسان", "امید", "یعقوب", "یونس", "اسماعیل", "صالح", "کریم", "عبدالرحمن", "رمضان", "عباس", "ناصر", "جعفر", "مجید", "کمال", "فرزاد", "بهنام", "آرش", "شهاب", "پویا", "سیاوش"];

const LAST_NAMES = ["محمدی", "احمدی", "رضایی", "حسینی", "کریمی", "موسوی", "جعفری", "نوروزی", "عباسی", "قاسمی", "مرادی", "صادقی", "رحیمی", "بزرگی", "شریفی", "جمشیدی", "کمالی", "فرهادی", "ناصری", "صفری"];

// ============================================
// عکس‌ها
// ============================================
const IMAGES = {
    main: "AgACAgQAAxkBAAEq6gABajUSmQmi2dgKSe-mMhBGac5Du8MAApkOaxsw4ahRBU6BXKC1iP4BAAMCAAN4AAM8BA",
    scout: "AgACAgQAAxkBAAEq6gFqNRKZMX_2DsIKHkdhZJsEJsaEEAACkA5rGzDhqFH33QABNqECBEQBAAMCAAN4AAM8BA",
    player: "AgACAgQAAxkBAAEq6gJqNRKZvYoG5JT3dL96dZg9EFSrBQACkg5rGzDhqFGvLg1dXyM42wEAAwIAA3gAAzwE",
    training: "AgACAgQAAxkBAAEq6gNqNRKZfMM__OhyB17UhtAzVvbRQQAClA5rGzDhqFGgAAEPDzznJ2UBAAMCAAN4AAM8BA",
    contract: "AgACAgQAAxkBAAEq6gVqNRKZDZlswJLRNhWNrVd6_x_3KwACmg5rGzDhqFFnqUrHYgQRxgEAAwIAA3gAAzwE",
    sell: "AgACAgQAAxkBAAEq6gZqNRKZcW2HZKS0Grop9XwnlpC39QACmw5rGzDhqFGf8qbn0ZxCjgEAAwIAA3gAAzwE"
};
function getImage(name) { return IMAGES[name] || IMAGES.main; }

// ============================================
// ذخیره‌سازی
// ============================================
const players = new Map();
function getPlayer(id) { return players.get(id); }
function setPlayer(id, state) { players.set(id, state); }

class GameState {
    constructor(name, path) {
        this.name = name;
        this.path = path;
        this.money = 500;
        this.coins = 0;
        this.fame = 10;
        this.city = "هرمزگان";
        this.week = 1;
        this.season = 1;
        this.players = [];
        this.tempPlayers = null;
        this.clubName = "";
        this.leagueIndex = 0;
        this.stadium = 5000;
        this.fans = 2500;
        this.points = 0;
    }
    getTitle() {
        if (this.path === "agent") {
            let l = "محلی";
            if (this.fame > 80) l = "جهانی";
            else if (this.fame > 60) l = "آسیایی";
            else if (this.fame > 40) l = "ملی";
            else if (this.fame > 20) l = "منطقه‌ای";
            return `👤 ${this.name} - ایجنت ${l}`;
        }
        return `⚽ ${this.clubName || "باشگاه"} - ${LEAGUES[this.leagueIndex]?.name || "لیگ استان"}`;
    }
    getSummary() {
        let s = `${this.getTitle()}\n📍 ${this.city} | ⭐ ${this.fame}\n`;
        s += `💰 ${this.money}M | 🎯 ${this.coins} سکه\n`;
        s += `📅 هفته ${this.week} | فصل ${this.season}\n`;
        s += `👥 بازیکن: ${this.players.length}`;
        return s;
    }
}

// ============================================
// ربات
// ============================================
const bot = new Bot(TOKEN);
const userStates = new Map();
const ADMIN_ID = 5576592239;
const SPECIAL = { name: "مهدی برکات", pos: "🥅 دروازه‌بان", talent: 9, ability: 7, city: "بندرلنگه", chance: 5 };

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
        caption: `🔓 *پنل ادوین*\n💰 ${state.money}M | ⭐ ${state.fame}\n🎯 ${state.coins} | 👥 ${state.players.length}`,
        parse_mode: "Markdown",
        reply_markup: adminMenu()
    });
});

// دکمه‌ها
bot.on("callback_query:data", async (ctx) => {
    const data = ctx.callbackQuery.data;
    const userId = ctx.from.id;
    await ctx.answerCallbackQuery();
    
    // انتخاب مسیر
    if (data === "path_agent" || data === "path_club") {
        const path = data === "path_agent" ? "agent" : "club";
        userStates.set(userId, { choosing: "name", path });
        return ctx.editMessageText(`✍️ اسم ${path === "agent" ? "ایجنت" : "باشگاه"} رو تایپ کن:`, { parse_mode: "Markdown" });
    }
    
    const state = getPlayer(userId);
    if (!state) { await ctx.answerCallbackQuery("❌ /start بزن!"); return; }
    
    let result = "";
    let img = getImage("main");
    
    // منوی اصلی
    if (data === "menu_main") {
        return ctx.editMessageMedia(
            { type: "photo", media: getImage("main"), caption: state.getSummary(), parse_mode: "Markdown" },
            { reply_markup: state.path === "agent" ? agentMenu() : clubMenu() }
        );
    }
    
    // کشف بازیکن - انتخاب لیگ
    if (data === "agent_scout") {
        const kb = new InlineKeyboard();
        LEAGUES.forEach((l, i) => kb.text(l.name, `scout_league_${i}`).row());
        kb.text("🔙", "menu_main");
        return ctx.editMessageMedia(
            { type: "photo", media: getImage("scout"), caption: `🔍 *کشف بازیکن*\n\nکدوم لیگ؟\n💰 هزینه: ۵۰M | بودجه: ${state.money}M`, parse_mode: "Markdown" },
            { reply_markup: kb }
        );
    }
    
    // نمایش ۳ بازیکن
    if (data.startsWith("scout_league_")) {
        const li = parseInt(data.split("_")[2]);
        if (state.money < 50) { await ctx.answerCallbackQuery("❌ پول کم!"); return; }
        state.money -= 50;
        
        const league = LEAGUES[li];
        const found = [];
        for (let i = 0; i < 3; i++) {
            if (li === 0 && Math.random() * 100 < SPECIAL.chance) {
                found.push({
                    name: SPECIAL.name, pos: SPECIAL.pos, talent: SPECIAL.talent, ability: SPECIAL.ability,
                    age: 21, city: SPECIAL.city, value: SPECIAL.talent * SPECIAL.ability * 15, special: true, contract: null
                });
            } else {
                const name = FIRST_NAMES[Math.floor(Math.random() * FIRST_NAMES.length)] + " " + LAST_NAMES[Math.floor(Math.random() * LAST_NAMES.length)];
                const talent = Math.floor(Math.random() * (league.maxStar - league.minStar + 1)) + league.minStar;
                const ability = Math.floor(Math.random() * (league.maxAbility - league.minAbility + 1)) + league.minAbility;
                found.push({
                    name, pos: POSITIONS[Math.floor(Math.random() * 4)], talent, ability,
                    age: Math.floor(Math.random() * 10) + 16, city: CITIES[Math.floor(Math.random() * CITIES.length)],
                    value: talent * ability * 15, special: false, contract: null
                });
            }
        }
        
        state.tempPlayers = found;
        
        let txt = `🔍 *${league.name} - ۳ بازیکن*\n\n`;
        found.forEach((p, i) => {
            const s = p.special ? "🌟 " : "";
            txt += `${i+1}. ${s}⚽ *${p.name}*\n   ${p.pos} | ${p.age} سال | ${p.city}\n   ⭐${p.talent} 💪${p.ability} | 💰${p.value}M\n\n`;
        });
        
        const kb = new InlineKeyboard();
        found.forEach((p, i) => kb.text(`${i+1}. ${p.name.split(" ")[0]}`, `scout_pick_${i}`));
        kb.row().text("🔍 دوباره (۵۰M)", `scout_league_${li}`).row().text("🔙", "agent_scout");
        
        return ctx.editMessageMedia(
            { type: "photo", media: getImage("scout"), caption: txt, parse_mode: "Markdown" },
            { reply_markup: kb }
        );
    }
    
    // انتخاب بازیکن
    if (data.startsWith("scout_pick_")) {
        const i = parseInt(data.split("_")[2]);
        if (!state.tempPlayers?.[i]) { await ctx.answerCallbackQuery("❌"); return; }
        const p = state.tempPlayers[i];
        state.players.push(p);
        state.tempPlayers = null;
        result = `✅ *${p.special ? "🌟 " : ""}${p.name}*\n${p.pos} | ⭐${p.talent} 💪${p.ability} | 💰${p.value}M`;
        img = getImage("player");
    }
    
    // لیست بازیکنان
    if (data === "agent_players") {
        if (state.players.length === 0) {
            return ctx.editMessageMedia(
                { type: "photo", media: getImage("player"), caption: "👥 هنوز بازیکنی نداری!", parse_mode: "Markdown" },
                { reply_markup: agentMenu() }
            );
        }
        const kb = new InlineKeyboard();
        state.players.forEach((p, i) => kb.text(`${p.special ? "🌟" : ""} ${p.name} ⭐${p.talent}`, `player_view_${i}`).row());
        kb.text("🔙", "menu_main");
        return ctx.editMessageMedia(
            { type: "photo", media: getImage("player"), caption: `👥 *بازیکنای تو* (${state.players.length})`, parse_mode: "Markdown" },
            { reply_markup: kb }
        );
    }
    
    // صفحه بازیکن
    if (data.startsWith("player_view_")) {
        const i = parseInt(data.split("_")[2]);
        const p = state.players[i];
        if (!p) { await ctx.answerCallbackQuery("❌"); return; }
        
        const kb = new InlineKeyboard()
            .text("🏋️ ارتقا", `upgrade_${i}`).text("🤝 قرارداد", `contract_${i}`).text("💰 فروش", `sell_${i}`).row()
            .text("🔙", "agent_players");
        
        let txt = `${p.special ? "🌟 " : ""}⚽ *${p.name}*\n${p.pos} | ${p.age} سال | ${p.city}\n⭐${p.talent} 💪${p.ability} | 💰${p.value}M`;
        if (p.contract) txt += `\n📋 ${p.contract.club} | 💵${p.contract.monthly}M`;
        
        return ctx.editMessageMedia(
            { type: "photo", media: getImage("player"), caption: txt, parse_mode: "Markdown" },
            { reply_markup: kb }
        );
    }
    
    // منوی ارتقا
    if (data.startsWith("upgrade_")) {
        const i = parseInt(data.split("_")[1]);
        const p = state.players[i];
        
        const kb = new InlineKeyboard()
            .text("⚡ سرعت ۵۰M", `train_${i}_50`).text("🎯 شوت ۷۵M", `train_${i}_75`).row()
            .text("💪 بدنسازی ۱۵۰M", `train_${i}_150`).text("📚 مربی ۳۰۰M", `train_${i}_300`).row()
            .text("🎯 اردو ۵۰۰M", `train_${i}_500`).text("🔙", `player_view_${i}`);
        
        return ctx.editMessageMedia(
            { type: "photo", media: getImage("training"), caption: `🏋️ *ارتقا ${p.name}*\n⭐${p.talent} 💪${p.ability} | 💰${p.value}M`, parse_mode: "Markdown" },
            { reply_markup: kb }
        );
    }
    
    // تمرین
    if (data.startsWith("train_")) {
        const parts = data.split("_");
        const i = parseInt(parts[1]);
        const cost = parseInt(parts[2]);
        const p = state.players[i];
        
        if (state.money < cost) { await ctx.answerCallbackQuery(`❌ پول کم! نیاز: ${cost}M`); return; }
        state.money -= cost;
        
        if (cost === 150) { p.ability = Math.min(10, p.ability + 2); p.talent = Math.min(10, p.talent + 1); }
        else if (cost === 500) { p.ability = Math.min(10, p.ability + 3); }
        else if (cost === 300) { p.ability = Math.min(10, p.ability + 2); }
        else { p.ability = Math.min(10, p.ability + 1); }
        
        p.value = cost === 500 ? p.talent * p.ability * 30 : p.talent * p.ability * 15;
        result = `✅ *${p.name}*\n💪 ${p.ability} | 💰 ${p.value}M`;
        img = getImage("training");
    }
    
    // فروش
    if (data.startsWith("sell_")) {
        const i = parseInt(data.split("_")[1]);
        const p = state.players[i];
        state.money += p.value;
        state.fame += 5;
        const name = p.name;
        const val = p.value;
        state.players.splice(i, 1);
        result = `💰 *فروش*\n⚽ ${name}\n💵 ${val}M\n⭐ +۵`;
        img = getImage("sell");
    }
    
    // قرارداد
    if (data.startsWith("contract_")) {
        const i = parseInt(data.split("_")[1]);
        const p = state.players[i];
        if (p.contract) { await ctx.answerCallbackQuery("❌ قبلاً قرارداد داره!"); return; }
        
        const monthly = Math.floor(p.value / 10);
        const clubs = ["فولاد", "تراکتور", "سپاهان", "پرسپولیس", "استقلال", "ملوان"];
        const club = clubs[Math.floor(Math.random() * clubs.length)];
        p.contract = { monthly, remaining: 24, club };
        state.money += monthly * 3;
        
        result = `🤝 *قرارداد*\n⚽ ${p.name}\n🏠 ${club}\n💵 ${monthly}M/ماه\n📅 ۲۴ ماه\n💰 پیش‌پرداخت: ${monthly * 3}M`;
        img = getImage("contract");
    }
    
    // هفته بعد
    if (data === "menu_next") {
        state.week++;
        state.players.forEach(p => {
            if (p.contract && p.contract.remaining > 0) {
                state.money += p.contract.monthly;
                p.contract.remaining--;
                if (p.contract.remaining === 0) p.contract = null;
            }
        });
        if (state.week > 34) { state.week = 1; state.season++; }
        
        return ctx.editMessageMedia(
            { type: "photo", media: getImage("main"), caption: `⏭️ هفته ${state.week} - فصل ${state.season}\n\n${state.getSummary()}`, parse_mode: "Markdown" },
            { reply_markup: state.path === "agent" ? agentMenu() : clubMenu() }
        );
    }
    
    // ادمین
    if (data.startsWith("admin_")) {
        if (ctx.from.id !== ADMIN_ID) return;
        switch(data) {
            case "admin_money_100": state.money += 100; result = "💰 +۱۰۰M"; break;
            case "admin_money_500": state.money += 500; result = "💰 +۵۰۰M"; break;
            case "admin_money_1000": state.money += 1000; result = "💰 +۱۰۰۰M"; break;
            case "admin_fame_10": state.fame = Math.min(100, state.fame + 10); result = "⭐ +۱۰"; break;
            case "admin_fame_50": state.fame = Math.min(100, state.fame + 50); result = "⭐ +۵۰"; break;
            case "admin_fame_100": state.fame = 100; result = "⭐ ۱۰۰"; break;
            case "admin_boost_all":
                state.players.forEach(p => { p.ability = Math.min(10, p.ability + 2); p.talent = Math.min(10, p.talent + 1); p.value = p.talent * p.ability * 15; });
                result = "💪 همه +۲";
                break;
            case "admin_scout_star":
                state.players.push({ name: SPECIAL.name, pos: SPECIAL.pos, talent: SPECIAL.talent, ability: SPECIAL.ability, age: 21, city: SPECIAL.city, value: SPECIAL.talent * SPECIAL.ability * 30, special: true, contract: null });
                result = `🌟 ${SPECIAL.name}`;
                break;
            case "admin_sell_all":
                let t = 0; state.players.forEach(p => t += p.value); state.money += t; state.players = [];
                result = `💰 +${t}M`;
                break;
        }
        if (result) {
            return ctx.editMessageMedia(
                { type: "photo", media: getImage("main"), caption: `🔓 ${result}\n💰 ${state.money}M | ⭐ ${state.fame}`, parse_mode: "Markdown" },
                { reply_markup: adminMenu() }
            );
        }
    }
    
    // نمایش نتیجه
    if (result) {
        await ctx.editMessageMedia(
            { type: "photo", media: img, caption: `${result}\n\n${state.getSummary()}`, parse_mode: "Markdown" },
            { reply_markup: state.path === "agent" ? agentMenu() : clubMenu() }
        );
    }
});

// پیام اسم
bot.on("message:text", async (ctx) => {
    const us = userStates.get(ctx.from.id);
    if (us?.choosing === "name") {
        const state = new GameState(ctx.message.text, us.path);
        setPlayer(ctx.from.id, state);
        userStates.delete(ctx.from.id);
        await ctx.replyWithPhoto(getImage("main"), {
            caption: `🎉 *ثبت شد!*\n\n${state.getSummary()}`,
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
        .text("📊 جدول", "club_table").text("⏭️ هفته بعد", "menu_next");
}

function adminMenu() {
    return new InlineKeyboard()
        .text("💰 +۱۰۰M", "admin_money_100").text("+۵۰۰M", "admin_money_500").text("+۱۰۰۰M", "admin_money_1000").row()
        .text("⭐ +۱۰", "admin_fame_10").text("+۵۰", "admin_fame_50").text("۱۰۰", "admin_fame_100").row()
        .text("🌟 برکات", "admin_scout_star").text("💪 ارتقا همه", "admin_boost_all").row()
        .text("💰 فروش همه", "admin_sell_all").text("🔙", "menu_main");
}

// ============================================
bot.catch((err) => console.error("❌", err.message));
bot.start({ onStart: (info) => console.log(`✅ @${info.username} راه‌اندازی شد!`) });