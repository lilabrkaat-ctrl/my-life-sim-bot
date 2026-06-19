// src/handlers.js

const { InlineKeyboard } = require("grammy");
const { State, db, wait } = require("./state");

// تنظیمات
const CITIES = ["بندرعباس", "بندرلنگه", "قشم", "میناب", "جاسک", "خواجه", "رودان", "سیریک", "حاجی‌آباد", "تنب"];
const LEAGUES = [
    { name: "لیگ استان", minStar: 2, maxStar: 4, minAbility: 1, maxAbility: 3 },
    { name: "لیگ استانی", minStar: 3, maxStar: 5, minAbility: 2, maxAbility: 4 },
    { name: "لیگ دسته ۳", minStar: 4, maxStar: 6, minAbility: 3, maxAbility: 5 },
    { name: "لیگ دسته ۲", minStar: 5, maxStar: 7, minAbility: 4, maxAbility: 6 },
    { name: "لیگ دسته ۱", minStar: 6, maxStar: 8, minAbility: 5, maxAbility: 7 },
    { name: "لیگ برتر", minStar: 7, maxStar: 9, minAbility: 6, maxAbility: 8 }
];
const POSITIONS = ["🥅 دروازه‌بان", "🛡️ مدافع", "⚡ هافبک", "🎯 مهاجم"];
const FIRST_NAMES = ["علی", "حسین", "محمد", "رضا", "امیر", "مهدی", "سعید", "فرهاد", "احسان", "امید"];
const LAST_NAMES = ["محمدی", "احمدی", "رضایی", "حسینی", "کریمی", "موسوی", "جعفری", "نوروزی", "عباسی", "قاسمی"];
const SPECIAL = { name: "مهدی برکات", pos: "🥅 دروازه‌بان", talent: 9, ability: 7, city: "بندرلنگه" };

// ============================================
// منوها
// ============================================
function mainMenu() {
    return new InlineKeyboard()
        .text("🔍 کشف", "scout").text("👥 بازیکنا", "players").row()
        .text("📊 آمار", "menu_main").text("⏭️ هفته", "next");
}

function playerMenu(index) {
    return new InlineKeyboard()
        .text("🏋️ ارتقا", `up_${index}`).text("🤝 قرارداد", `ct_${index}`).text("💰 فروش", `se_${index}`).row()
        .text("🔙", "players");
}

function upgradeMenu(index) {
    return new InlineKeyboard()
        .text("⚡۵۰M", `tr_${index}_50`).text("🎯۷۵M", `tr_${index}_75`).row()
        .text("💪۱۵۰M", `tr_${index}_150`).text("📚۳۰۰M", `tr_${index}_300`).row()
        .text("🎯۵۰۰M", `tr_${index}_500`).text("🔙", `pv_${index}`);
}

// ============================================
// /start
// ============================================
async function start(ctx) {
    const uid = ctx.from.id;
    if (db.has(uid)) return ctx.reply(db.get(uid).sum(), { reply_markup: mainMenu() });
    const kb = new InlineKeyboard().text("👤 ایجنت", "go_agent").text("⚽ باشگاه", "go_club").row();
    await ctx.reply("🎮 *بازی امپراتوری فوتبال*\n\nمسیرت رو انتخاب کن:", { parse_mode: "Markdown", reply_markup: kb });
}

// ============================================
// دریافت اسم
// ============================================
async function message(ctx) {
    const uid = ctx.from.id;
    if (!wait.has(uid)) return;
    const s = new State(ctx.message.text, wait.get(uid));
    db.set(uid, s);
    wait.delete(uid);
    await ctx.reply(`🎉 ثبت شد!\n\n${s.sum()}`, { parse_mode: "Markdown", reply_markup: mainMenu() });
}

// ============================================
// همه دکمه‌ها
// ============================================
async function callback(ctx) {
    const d = ctx.callbackQuery.data;
    const uid = ctx.from.id;
    await ctx.answerCallbackQuery();

    // انتخاب مسیر
    if (d === "go_agent" || d === "go_club") {
        wait.set(uid, d === "go_agent" ? "agent" : "club");
        return ctx.editMessageText(`✍️ اسم ${d === "go_agent" ? "ایجنت" : "باشگاه"} رو تایپ کن:`);
    }

    const s = db.get(uid);
    if (!s) { await ctx.answerCallbackQuery("❌ /start"); return; }

    let r = "";

    // منوی اصلی
    if (d === "menu_main") return ctx.editMessageText(s.sum(), { parse_mode: "Markdown", reply_markup: mainMenu() });

    // هفته بعد
    if (d === "next") {
        s.week++;
        s.players.forEach(p => {
            if (p.contract && p.contract.remaining > 0) {
                s.money += p.contract.monthly;
                p.contract.remaining--;
                if (p.contract.remaining === 0) p.contract = null;
            }
        });
        if (s.week > 34) { s.week = 1; s.season++; }
        return ctx.editMessageText(`⏭️ هفته ${s.week}\n\n${s.sum()}`, { parse_mode: "Markdown", reply_markup: mainMenu() });
    }

    // کشف بازیکن - انتخاب لیگ
    if (d === "scout") {
        const kb = new InlineKeyboard();
        LEAGUES.forEach((l, i) => kb.text(l.name, `sl_${i}`).row());
        kb.text("🔙", "menu_main");
        return ctx.editMessageText(`🔍 کدوم لیگ؟\n💰 ۵۰M | بودجه: ${s.money}M`, { parse_mode: "Markdown", reply_markup: kb });
    }

    // نمایش ۳ بازیکن
    if (d.startsWith("sl_")) {
        const li = parseInt(d.split("_")[1]);
        if (s.money < 50) { await ctx.answerCallbackQuery("❌ پول کم!"); return; }
        s.money -= 50;
        const L = LEAGUES[li];
        const f = [];
        for (let i = 0; i < 3; i++) {
            if (li === 0 && Math.random() * 100 < 5) {
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
        return ctx.editMessageText(tx, { parse_mode: "Markdown", reply_markup: kb });
    }

    // انتخاب بازیکن
    if (d.startsWith("pick_")) {
        const i = parseInt(d.split("_")[1]);
        if (!s.temp?.[i]) { await ctx.answerCallbackQuery("❌"); return; }
        s.players.push(s.temp[i]);
        s.temp = null;
        r = `✅ ${s.players[s.players.length-1].name} انتخاب شد!`;
    }

    // لیست بازیکنان
    if (d === "players") {
        if (s.players.length === 0) return ctx.editMessageText("👥 خالی!", { parse_mode: "Markdown", reply_markup: mainMenu() });
        const kb = new InlineKeyboard();
        s.players.forEach((p, i) => kb.text(`${p.name} ⭐${p.talent}`, `pv_${i}`).row());
        kb.text("🔙", "menu_main");
        return ctx.editMessageText(`👥 بازیکنات (${s.players.length})`, { parse_mode: "Markdown", reply_markup: kb });
    }

    // صفحه بازیکن
    if (d.startsWith("pv_")) {
        const i = parseInt(d.split("_")[1]);
        const p = s.players[i];
        if (!p) { await ctx.answerCallbackQuery("❌"); return; }
        let tx = `⚽ ${p.name}\n${p.pos} | ${p.age} | ${p.city}\n⭐${p.talent} 💪${p.ability} | 💰${p.value}M`;
        if (p.contract) tx += `\n📋 ${p.contract.club} | 💵${p.contract.monthly}M`;
        return ctx.editMessageText(tx, { parse_mode: "Markdown", reply_markup: playerMenu(i) });
    }

    // منوی ارتقا
    if (d.startsWith("up_")) {
        const i = parseInt(d.split("_")[1]);
        return ctx.editMessageText(`🏋️ ${s.players[i].name}`, { parse_mode: "Markdown", reply_markup: upgradeMenu(i) });
    }

    // تمرین
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
    }

    // فروش
    if (d.startsWith("se_")) {
        const i = parseInt(d.split("_")[1]);
        const p = s.players.splice(i, 1)[0];
        s.money += p.value;
        s.fame += 5;
        r = `💰 ${p.name} +${p.value}M`;
    }

    // قرارداد
    if (d.startsWith("ct_")) {
        const i = parseInt(d.split("_")[1]);
        const p = s.players[i];
        if (p.contract) { await ctx.answerCallbackQuery("❌ قرارداد داره!"); return; }
        const mo = Math.floor(p.value / 10);
        const cl = ["فولاد", "تراکتور", "سپاهان", "پرسپولیس", "استقلال", "ملوان"][Math.floor(Math.random() * 6)];
        p.contract = { monthly: mo, remaining: 24, club: cl };
        s.money += mo * 3;
        r = `🤝 ${p.name}\n🏠 ${cl}\n💵 ${mo}M/ماه`;
    }

    if (r) await ctx.editMessageText(`${r}\n\n${s.sum()}`, { parse_mode: "Markdown", reply_markup: mainMenu() });
}

module.exports = { start, message, callback };