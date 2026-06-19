const { Bot, InlineKeyboard } = require("grammy");
const TOKEN = process.env.BOT_TOKEN || "TOKEN_DEFAULT";

// ============================================
// تنظیمات
// ============================================
const CITIES = ["بندرعباس", "بندرلنگه", "قشم", "میناب", "جاسک", "خواجه", "رودان", "سیریک", "حاجی‌آباد", "تنب"];
const LEAGUES = [
    { name: "لیگ استان", teams: 8, minStar: 2, maxStar: 4, minAbility: 1, maxAbility: 3 },
    { name: "لیگ استانی", teams: 10, minStar: 3, maxStar: 5, minAbility: 2, maxAbility: 4 },
    { name: "لیگ دسته ۳", teams: 12, minStar: 4, maxStar: 6, minAbility: 3, maxAbility: 5 },
    { name: "لیگ دسته ۲", teams: 14, minStar: 5, maxStar: 7, minAbility: 4, maxAbility: 6 },
    { name: "لیگ دسته ۱", teams: 16, minStar: 6, maxStar: 8, minAbility: 5, maxAbility: 7 },
    { name: "لیگ برتر", teams: 16, minStar: 7, maxStar: 9, minAbility: 6, maxAbility: 8 }
];
const POSITIONS = ["🥅 دروازه‌بان", "🛡️ مدافع", "⚡ هافبک", "🎯 مهاجم"];
const FIRST_NAMES = ["علی", "حسین", "محمد", "رضا", "امیر", "مهدی", "سعید", "فرهاد", "احسان", "امید", "یعقوب", "یونس", "اسماعیل", "صالح", "کریم", "عبدالرحمن", "رمضان", "عباس", "ناصر", "جعفر", "مجید", "کمال", "فرزاد", "بهنام", "آرش", "شهاب", "پویا", "سیاوش"];
const LAST_NAMES = ["محمدی", "احمدی", "رضایی", "حسینی", "کریمی", "موسوی", "جعفری", "نوروزی", "عباسی", "قاسمی", "مرادی", "صادقی", "رحیمی", "بزرگی", "شریفی", "جمشیدی", "کمالی", "فرهادی", "ناصری", "صفری"];
const SPECIAL = { name: "مهدی برکات", pos: "🥅 دروازه‌بان", talent: 9, ability: 7, city: "بندرلنگه", chance: 5 };

// ============================================
// عکس‌ها
// ============================================
const IMG = {
    main: "AgACAgQAAxkBAAEq6gABajUSmQmi2dgKSe-mMhBGac5Du8MAApkOaxsw4ahRBU6BXKC1iP4BAAMCAAN4AAM8BA",
    scout: "AgACAgQAAxkBAAEq6gFqNRKZMX_2DsIKHkdhZJsEJsaEEAACkA5rGzDhqFH33QABNqECBEQBAAMCAAN4AAM8BA",
    player: "AgACAgQAAxkBAAEq6gJqNRKZvYoG5JT3dL96dZg9EFSrBQACkg5rGzDhqFGvLg1dXyM42wEAAwIAA3gAAzwE",
    training: "AgACAgQAAxkBAAEq6gNqNRKZfMM__OhyB17UhtAzVvbRQQAClA5rGzDhqFGgAAEPDzznJ2UBAAMCAAN4AAM8BA",
    contract: "AgACAgQAAxkBAAEq6gVqNRKZDZlswJLRNhWNrVd6_x_3KwACmg5rGzDhqFFnqUrHYgQRxgEAAwIAA3gAAzwE",
    sell: "AgACAgQAAxkBAAEq6gZqNRKZcW2HZKS0Grop9XwnlpC39QACmw5rGzDhqFGf8qbn0ZxCjgEAAwIAA3gAAzwE"
};
function G(n) { return IMG[n] || IMG.main; }

// ============================================
// دیتابیس
// ============================================
const db = new Map();
function GP(id) { return db.get(id); }
function SP(id, s) { db.set(id, s); }

class State {
    constructor(n, p) {
        this.name = n; this.path = p; this.money = 500; this.coins = 0; this.fame = 10;
        this.city = "هرمزگان"; this.week = 1; this.season = 1; this.players = []; this.temp = null;
    }
    title() {
        if (this.path === "agent") {
            let l = "محلی"; if (this.fame > 80) l = "جهانی"; else if (this.fame > 60) l = "آسیایی"; else if (this.fame > 40) l = "ملی"; else if (this.fame > 20) l = "منطقه‌ای";
            return `👤 ${this.name} - ایجنت ${l}`;
        }
        return `⚽ ${this.name} - باشگاه`;
    }
    sum() {
        return `${this.title()}\n📍 ${this.city} | ⭐ ${this.fame}\n💰 ${this.money}M | 🎯 ${this.coins}\n📅 هفته ${this.week} | فصل ${this.season}\n👥 بازیکن: ${this.players.length}`;
    }
}

// ============================================
// ربات
// ============================================
const bot = new Bot(TOKEN);
const wait = new Map();
const ADM = 5576592239;

bot.command("start", async (ctx) => {
    const uid = ctx.from.id;
    let s = GP(uid);
    if (s) {
        return ctx.replyWithPhoto(G("main"), { caption: s.sum(), parse_mode: "Markdown", reply_markup: M(s) });
    }
    const kb = new InlineKeyboard().text("👤 ایجنت", "go_agent").text("⚽ باشگاه", "go_club").row();
    await ctx.replyWithPhoto(G("main"), { caption: "🎮 *بازی امپراتوری فوتبال*\n\nمسیرت رو انتخاب کن:", parse_mode: "Markdown", reply_markup: kb });
});

bot.command(["edwin", "ادوین"], async (ctx) => {
    if (ctx.from.id !== ADM) return ctx.reply("🚫");
    const s = GP(ctx.from.id);
    if (!s) return ctx.reply("اول /start");
    await ctx.replyWithPhoto(G("main"), { caption: `🔓 پنل\n💰 ${s.money}M | ⭐ ${s.fame}`, parse_mode: "Markdown", reply_markup: AM() });
});

bot.on("callback_query:data", async (ctx) => {
    const d = ctx.callbackQuery.data;
    const uid = ctx.from.id;
    await ctx.answerCallbackQuery();
    
    if (d === "go_agent" || d === "go_club") {
        wait.set(uid, { step: "name", path: d === "go_agent" ? "agent" : "club" });
        return ctx.editMessageText(`✍️ اسم ${d === "go_agent" ? "ایجنت" : "باشگاه"} رو تایپ کن:`, { parse_mode: "Markdown" });
    }
    
    const s = GP(uid);
    if (!s) { await ctx.answerCallbackQuery("❌ /start"); return; }
    
    let r = "", im = G("main");
    
    if (d === "menu_main") return ctx.editMessageMedia({ type: "photo", media: G("main"), caption: s.sum(), parse_mode: "Markdown" }, { reply_markup: M(s) });
    
    if (d === "scout") {
        const kb = new InlineKeyboard();
        LEAGUES.forEach((l, i) => kb.text(l.name, `sl_${i}`).row());
        kb.text("🔙", "menu_main");
        return ctx.editMessageMedia({ type: "photo", media: G("scout"), caption: `🔍 کدوم لیگ؟\n💰 ۵۰M | بودجه: ${s.money}M`, parse_mode: "Markdown" }, { reply_markup: kb });
    }
    
    if (d.startsWith("sl_")) {
        const li = parseInt(d.split("_")[1]);
        if (s.money < 50) { await ctx.answerCallbackQuery("❌ پول کم!"); return; }
        s.money -= 50;
        const L = LEAGUES[li];
        const f = [];
        for (let i = 0; i < 3; i++) {
            if (li === 0 && Math.random() * 100 < SPECIAL.chance) {
                f.push({ name: SPECIAL.name, pos: SPECIAL.pos, talent: SPECIAL.talent, ability: SPECIAL.ability, age: 21, city: SPECIAL.city, value: SPECIAL.talent * SPECIAL.ability * 15, special: true, contract: null });
            } else {
                const nm = FIRST_NAMES[Math.floor(Math.random() * FIRST_NAMES.length)] + " " + LAST_NAMES[Math.floor(Math.random() * LAST_NAMES.length)];
                const t = Math.floor(Math.random() * (L.maxStar - L.minStar + 1)) + L.minStar;
                const a = Math.floor(Math.random() * (L.maxAbility - L.minAbility + 1)) + L.minAbility;
                f.push({ name: nm, pos: POSITIONS[Math.floor(Math.random() * 4)], talent: t, ability: a, age: Math.floor(Math.random() * 10) + 16, city: CITIES[Math.floor(Math.random() * CITIES.length)], value: t * a * 15, special: false, contract: null });
            }
        }
        s.temp = f;
        let tx = `🔍 *${L.name}*\n\n`;
        f.forEach((p, i) => tx += `${i+1}. ${p.special?"🌟":""}⚽ ${p.name}\n   ${p.pos} | ${p.age} | ⭐${p.talent} 💪${p.ability} | 💰${p.value}M\n\n`);
        const kb = new InlineKeyboard();
        f.forEach((p, i) => kb.text(`${i+1}`, `pick_${i}`));
        kb.row().text("🔍 دوباره", `sl_${li}`).text("🔙", "scout");
        return ctx.editMessageMedia({ type: "photo", media: G("scout"), caption: tx, parse_mode: "Markdown" }, { reply_markup: kb });
    }
    
    if (d.startsWith("pick_")) {
        const i = parseInt(d.split("_")[1]);
        if (!s.temp?.[i]) { await ctx.answerCallbackQuery("❌"); return; }
        const p = s.temp[i];
        s.players.push(p);
        s.temp = null;
        r = `✅ ${p.name} ⭐${p.talent} 💪${p.ability} 💰${p.value}M`;
        im = G("player");
    }
    
    if (d === "players") {
        if (s.players.length === 0) return ctx.editMessageMedia({ type: "photo", media: G("player"), caption: "👥 خالی!", parse_mode: "Markdown" }, { reply_markup: M(s) });
        const kb = new InlineKeyboard();
        s.players.forEach((p, i) => kb.text(`${p.name} ⭐${p.talent}`, `pv_${i}`).row());
        kb.text("🔙", "menu_main");
        return ctx.editMessageMedia({ type: "photo", media: G("player"), caption: `👥 بازیکنات (${s.players.length})`, parse_mode: "Markdown" }, { reply_markup: kb });
    }
    
    if (d.startsWith("pv_")) {
        const i = parseInt(d.split("_")[1]);
        const p = s.players[i];
        if (!p) { await ctx.answerCallbackQuery("❌"); return; }
        const kb = new InlineKeyboard().text("🏋️ ارتقا", `up_${i}`).text("🤝 قرارداد", `ct_${i}`).text("💰 فروش", `se_${i}`).row().text("🔙", "players");
        let tx = `⚽ ${p.name}\n${p.pos} | ${p.age} | ${p.city}\n⭐${p.talent} 💪${p.ability} | 💰${p.value}M`;
        if (p.contract) tx += `\n📋 ${p.contract.club} | 💵${p.contract.monthly}M`;
        return ctx.editMessageMedia({ type: "photo", media: G("player"), caption: tx, parse_mode: "Markdown" }, { reply_markup: kb });
    }
    
    if (d.startsWith("up_")) {
        const i = parseInt(d.split("_")[1]);
        const kb = new InlineKeyboard().text("⚡۵۰M", `tr_${i}_50`).text("🎯۷۵M", `tr_${i}_75`).row().text("💪۱۵۰M", `tr_${i}_150`).text("📚۳۰۰M", `tr_${i}_300`).row().text("🎯۵۰۰M", `tr_${i}_500`).text("🔙", `pv_${i}`);
        return ctx.editMessageMedia({ type: "photo", media: G("training"), caption: `🏋️ ${s.players[i].name}`, parse_mode: "Markdown" }, { reply_markup: kb });
    }
    
    if (d.startsWith("tr_")) {
        const p = d.split("_");
        const i = parseInt(p[1]), c = parseInt(p[2]);
        const pl = s.players[i];
        if (s.money < c) { await ctx.answerCallbackQuery("❌ پول کم!"); return; }
        s.money -= c;
        if (c === 150) { pl.ability = Math.min(10, pl.ability + 2); pl.talent = Math.min(10, pl.talent + 1); }
        else if (c === 500) { pl.ability = Math.min(10, pl.ability + 3); }
        else if (c === 300) { pl.ability = Math.min(10, pl.ability + 2); }
        else { pl.ability = Math.min(10, pl.ability + 1); }
        pl.value = c === 500 ? pl.talent * pl.ability * 30 : pl.talent * pl.ability * 15;
        r = `✅ ${pl.name} 💪${pl.ability} 💰${pl.value}M`;
        im = G("training");
    }
    
    if (d.startsWith("se_")) {
        const i = parseInt(d.split("_")[1]), p = s.players[i];
        s.money += p.value; s.fame += 5; s.players.splice(i, 1);
        r = `💰 ${p.name} +${p.value}M`; im = G("sell");
    }
    
    if (d.startsWith("ct_")) {
        const i = parseInt(d.split("_")[1]), p = s.players[i];
        if (p.contract) { await ctx.answerCallbackQuery("❌ قرارداد داره!"); return; }
        const mo = Math.floor(p.value / 10);
        const cl = ["فولاد", "تراکتور", "سپاهان", "پرسپولیس", "استقلال", "ملوان"][Math.floor(Math.random() * 6)];
        p.contract = { monthly: mo, remaining: 24, club: cl };
        s.money += mo * 3;
        r = `🤝 ${p.name}\n🏠 ${cl}\n💵 ${mo}M/ماه`; im = G("contract");
    }
    
    if (d === "next") {
        s.week++;
        s.players.forEach(p => { if (p.contract && p.contract.remaining > 0) { s.money += p.contract.monthly; p.contract.remaining--; if (p.contract.remaining === 0) p.contract = null; } });
        if (s.week > 34) { s.week = 1; s.season++; }
        return ctx.editMessageMedia({ type: "photo", media: G("main"), caption: `⏭️ هفته ${s.week}\n\n${s.sum()}`, parse_mode: "Markdown" }, { reply_markup: M(s) });
    }
    
    if (d.startsWith("adm_")) {
        if (ctx.from.id !== ADM) return;
        if (d === "adm_m100") s.money += 100;
        if (d === "adm_m500") s.money += 500;
        if (d === "adm_f10") s.fame = Math.min(100, s.fame + 10);
        if (d === "adm_boost") s.players.forEach(p => { p.ability = Math.min(10, p.ability + 2); p.talent = Math.min(10, p.talent + 1); p.value = p.talent * p.ability * 15; });
        if (d === "adm_star") s.players.push({ name: SPECIAL.name, pos: SPECIAL.pos, talent: SPECIAL.talent, ability: SPECIAL.ability, age: 21, city: SPECIAL.city, value: SPECIAL.talent * SPECIAL.ability * 30, special: true, contract: null });
        if (d === "adm_sell") { let t = 0; s.players.forEach(p => t += p.value); s.money += t; s.players = []; }
        return ctx.editMessageMedia({ type: "photo", media: G("main"), caption: `🔓 انجام شد\n💰 ${s.money}M | ⭐ ${s.fame}`, parse_mode: "Markdown" }, { reply_markup: AM() });
    }
    
    if (r) await ctx.editMessageMedia({ type: "photo", media: im, caption: `${r}\n\n${s.sum()}`, parse_mode: "Markdown" }, { reply_markup: M(s) });
});

bot.on("message:text", async (ctx) => {
    const w = wait.get(ctx.from.id);
    if (w?.step === "name") {
        const s = new State(ctx.message.text, w.path);
        SP(ctx.from.id, s);
        wait.delete(ctx.from.id);
        await ctx.replyWithPhoto(G("main"), { caption: `🎉 ثبت شد!\n\n${s.sum()}`, parse_mode: "Markdown", reply_markup: M(s) });
    }
});

function M(s) { return new InlineKeyboard().text("🔍 کشف", "scout").text("👥 بازیکنا", "players").row().text("📊 آمار", "menu_main").text("⏭️ هفته", "next"); }
function AM() { return new InlineKeyboard().text("💰 +۱۰۰M", "adm_m100").text("+۵۰۰M", "adm_m500").row().text("⭐ +۱۰", "adm_f10").text("💪 همه", "adm_boost").row().text("🌟 برکات", "adm_star").text("💰 فروش همه", "adm_sell").row().text("🔙", "menu_main"); }

bot.catch((err) => console.error("❌", err.message));
bot.start({ onStart: (info) => console.log(`✅ @${info.username}`) });