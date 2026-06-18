// handlers.js - مدیریت همه دکمه‌ها و عملیات بازی

const { InlineKeyboard } = require("grammy");
const { COUNTRIES } = require("./config");
const { getPlayer } = require("./state");

const MAIN_IMAGE = "AgACAgQAAxkBAAEq26RqM6Zgod1-3-pP1RpqVDXkdZfz2gACsw5rGwPDmVFZ4np59GoqLgEAAwIAA3gAAzwE";
const ADMIN_ID = 5576592239;

// ============================================
// همه منوها
// ============================================
function mainMenu() {
    return new InlineKeyboard()
        .text("🏛️ کشور", "menu_domestic").text("🌍 خارجی", "menu_foreign").text("⚔️ نظامی", "menu_military").row()
        .text("💰 اقتصاد", "menu_economy").text("🏴 نیابتی", "menu_proxies").text("📊 وضعیت", "menu_status").row()
        .text("📜 تاریخچه", "menu_history").text("⏭️ زمان", "menu_time");
}

function domesticMenu() {
    return new InlineKeyboard()
        .text("🏛️ مجلس", "menu_parliament").text("📦 واردات", "menu_imports").text("🛢️ صادرات", "menu_exports").row()
        .text("⛽ بنزین", "domestic_gas").text("🌐 اینترنت", "domestic_internet").text("👥 اعتراضات", "domestic_protests").row()
        .text("🏭 تولید", "domestic_production").text("✅ FATF", "domestic_fatf").text("🔙 منو", "main_menu");
}

function foreignMenu(page = 0) {
    const kb = new InlineKeyboard();
    const start = page * 6;
    const end = Math.min(start + 6, COUNTRIES.length);
    for (let i = start; i < end; i += 3) {
        const row = COUNTRIES.slice(i, i + 3);
        row.forEach(c => kb.text(`${c.emoji} ${c.name}`, `country_${c.code}`));
        kb.row();
    }
    const nav = [];
    if (page > 0) nav.push(InlineKeyboard.text("⬅️", `foreign_page_${page - 1}`));
    nav.push(InlineKeyboard.text("🔙", "main_menu"));
    if (end < COUNTRIES.length) nav.push(InlineKeyboard.text("➡️", `foreign_page_${page + 1}`));
    kb.row(...nav);
    return kb;
}

function countryMenu(code) {
    return new InlineKeyboard()
        .text("🤝 مذاکره", `negotiate_${code}`).text("💰 تجارت", `trade_${code}`).text("📝 پیمان", `pact_${code}`).row()
        .text("⚔️ حمله", `attack_${code}`).text("🚫 تحریم", `sanction_${code}`).text("🎁 کمک", `aid_${code}`).row()
        .text("📊 اطلاعات", `info_${code}`).text("🔙 کشورها", "menu_foreign");
}

function militaryMenu() {
    return new InlineKeyboard()
        .text("🚀 موشک", "military_missile").text("🛸 پهپاد", "military_drone").text("💻 سایبری", "military_cyber").row()
        .text("⚔️ جنگ", "military_war").text("🛡️ دفاع", "military_defense").text("💣 تولید", "military_produce").row()
        .text("⚛️ هسته‌ای", "military_nuclear").text("🕵️ ویژه", "military_special").text("🔙 منو", "main_menu");
}

function economyMenu() {
    return new InlineKeyboard()
        .text("🛢️ نفت", "eco_oil").text("💵 ارز", "eco_currency").text("🛒 بازار", "eco_market").row()
        .text("⛽ بنزین", "eco_gas").text("₿ بیت", "eco_bitcoin").text("🥇 طلا", "eco_gold").row()
        .text("💰 یارانه", "eco_subsidy").text("🏦 چاپ", "eco_print").text("🕵️ فساد", "eco_corruption").row()
        .text("💧 آب", "eco_water").text("🧠 نخبگان", "eco_brain").text("🔙 منو", "main_menu");
}

function proxiesMenu() {
    return new InlineKeyboard()
        .text("📊 گزارش", "proxies_report").text("🏴 ساخت", "proxies_create").text("💰 تأمین", "proxies_fund").row()
        .text("📦 سلاح", "proxies_weapons").text("⚔️ عملیات", "proxies_activate").text("💵 حقوق", "proxies_pay").row()
        .text("🧹 ردپا", "proxies_clean").text("💀 حذف", "proxies_delete").text("🔙 منو", "main_menu");
}

function timeMenu() {
    return new InlineKeyboard()
        .text("⏭️ ۱ ماه", "time_1").text("⏭️ ۶ ماه", "time_6").text("⏭️ ۱ سال", "time_12").row()
        .text("⏭️ ۲ سال", "time_24").text("⏭️ ۴ سال", "time_48").row()
        .text("🔙 منوی اصلی", "main_menu");
}

function parliamentMenu() {
    return new InlineKeyboard()
        .text("🗳️ رأی‌گیری", "parliament_vote").text("💰 خرید رأی", "parliament_buy").text("📋 استیضاح", "parliament_impeach").row()
        .text("🤝 لابی", "parliament_lobby").text("📊 وضعیت", "parliament_status").text("🔙 کشور", "menu_domestic");
}

function buyVoteMenu() {
    return new InlineKeyboard()
        .text("اصولگرا ۳ همت", "buyvote_principlists_10").text("اصلاح‌طلب ۵ همت", "buyvote_reformists_10").text("مستقل ۲ همت", "buyvote_independents_10").row()
        .text("💰 خرید ۵۰ رأی", "buyvote_all_50").text("💰 خرید همه", "buyvote_all_146").row()
        .text("🔙 مجلس", "menu_parliament");
}

function attackMenu(code) {
    return new InlineKeyboard()
        .text("🚀 موشک", `do_missile_${code}`).text("🛸 پهپاد", `do_drone_${code}`).text("💻 سایبر", `do_cyber_${code}`).row()
        .text("⚔️ جنگ", `do_war_${code}`).text("🔙", `country_${code}`);
}

function nuclearMenu() {
    return new InlineKeyboard()
        .text("⬆️ ۶۰٪", "do_enrich_60").text("⬆️ ۹۰٪", "do_enrich_90").text("⬇️ ۲۰٪", "do_enrich_20").row()
        .text("📝 توافق", "nuclear_deal").text("🚫 خروج NPT", "nuclear_leave").text("🔙 نظامی", "menu_military");
}

function importMenu() {
    return new InlineKeyboard()
        .text("🌾 گندم ۵۰۰$", "import_wheat").text("💊 دارو ۲۰M$", "import_medicine").text("💻 تکنولوژی ۵۰۰M$", "import_technology").row()
        .text("✈️ سوخو ۱۲۰M$", "import_sukhoi").text("🛡️ اس۴۰۰ ۷۰۰M$", "import_s400").text("🛢️ تجهیزات ۲۰۰M$", "import_oilEquipment").row()
        .text("🔙 کشور", "menu_domestic");
}

function exportMenu() {
    return new InlineKeyboard()
        .text("🛢️ نفت ۶۰$", "export_oil").text("⛽ بنزین ۸۰$", "export_gasoline").text("🛸 پهپاد ۱۰M$", "export_drone").row()
        .text("🚀 موشک ۵۰M$", "export_missile").text("🏭 پتروشیمی ۵۰۰$", "export_petrochemical").text("🥇 فرش ۱M$", "export_carpet").row()
        .text("🔙 کشور", "menu_domestic");
}

function adminMenu() {
    return new InlineKeyboard()
        .text("💰 +۱۰۰", "admin_budget_100").text("+۵۰۰", "admin_budget_500").text("+۱۰۰۰", "admin_budget_1000").row()
        .text("💵 +۱۰B", "admin_dollar_10").text("+۵۰B", "admin_dollar_50").text("+۱۰۰B", "admin_dollar_100").row()
        .text("🚀 +۱۰۰", "admin_missile_100").text("+۵۰۰", "admin_missile_500").text("+۱۰۰۰", "admin_missile_1000").row()
        .text("🛸 +۵۰۰", "admin_drone_500").text("+۲۰۰۰", "admin_drone_2000").text("👥 +۱۰K", "admin_soldier_10000").row()
        .text("👥 +۱۰٪", "admin_pop_10").text("+۳۰٪", "admin_pop_30").text("+۵۰٪", "admin_pop_50").text("۱۰۰٪", "admin_pop_100").row()
        .text("📉 تورم -۱۰", "admin_inf_10").text("-۲۰", "admin_inf_20").text("صفر", "admin_inf_0").row()
        .text("🔒 تحریم -۱۰", "admin_sanction_10").text("-۳۰", "admin_sanction_30").text("صفر", "admin_sanction_0").row()
        .text("⚔️ تنش -۱۰", "admin_tension_10").text("-۳۰", "admin_tension_30").text("صفر", "admin_tension_0").row()
        .text("⚛️ ۲۰٪", "admin_nuclear_20").text("۶۰٪", "admin_nuclear_60").text("۹۰٪", "admin_nuclear_90").row()
        .text("🌍 +۲۰", "admin_relations_20").text("+۵۰", "admin_relations_50").text("دشمن", "admin_relations_minus").row()
        .text("🏛️ خرید رأی", "admin_buy_all_votes").text("تصویب", "admin_pass_vote").row()
        .text("🏴 تقویت", "admin_boost_proxies").text("ساخت", "admin_create_proxy").row()
        .text("⏭️ ۶ماه", "admin_time_6").text("۱سال", "admin_time_12").text("۲سال", "admin_time_24").row()
        .text("⏭️ ۴سال", "admin_time_48").text("۱۰سال", "admin_time_120").row()
        .text("🎭 رئیس", "admin_rank_president").text("مجلس", "admin_rank_speaker").text("وزیر", "admin_rank_minister").row()
        .text("💀 ضد باخت", "admin_no_gameover").text("🔄 برگشت", "admin_reset_rank").row()
        .text("📜 پاک کردن", "admin_clear_history").row()
        .text("🔙 خروج", "main_menu");
}

// ============================================
// هندلر اصلی دکمه‌ها
// ============================================
async function handleCallback(ctx, state, data) {
    let result = "";
    let advanceTurn = false;
    
    // ============ منوهای اصلی ============
    if (data === "main_menu") {
        await ctx.editMessageMedia({ type: "photo", media: MAIN_IMAGE, caption: state.getSummary(), parse_mode: "Markdown" }, { reply_markup: mainMenu() });
        return;
    }
    if (data === "menu_domestic") {
        await ctx.editMessageMedia({ type: "photo", media: MAIN_IMAGE, caption: `🏛️ *کشور*\n👥 ${state.popularity}٪ | 💧 ${state.water}٪ | 💰 فساد: ${state.corruption}٪`, parse_mode: "Markdown" }, { reply_markup: domesticMenu() });
        return;
    }
    if (data === "menu_foreign" || data.startsWith("foreign_page_")) {
        let page = data.startsWith("foreign_page_") ? parseInt(data.split("_")[2]) : 0;
        await ctx.editMessageMedia({ type: "photo", media: MAIN_IMAGE, caption: "🌍 *انتخاب کشور*", parse_mode: "Markdown" }, { reply_markup: foreignMenu(page) });
        return;
    }
    if (data === "menu_military") {
        await ctx.editMessageMedia({ type: "photo", media: MAIN_IMAGE, caption: `⚔️ *نظامی*\n🚀${state.missiles} 🛸${state.drones} 👥${state.soldiers}\n⚛️${state.nuclear}٪ | 🔒${state.sanctions} | ⚔️${state.tension}`, parse_mode: "Markdown" }, { reply_markup: militaryMenu() });
        return;
    }
    if (data === "menu_economy") {
        await ctx.editMessageMedia({ type: "photo", media: MAIN_IMAGE, caption: `💰 *اقتصاد*\nبودجه: ${state.budget.toFixed(0)} همت\nتورم: ${state.inflation.toFixed(1)}٪ | دلار: ${state.dollarRate.toLocaleString()}`, parse_mode: "Markdown" }, { reply_markup: economyMenu() });
        return;
    }
    if (data === "menu_proxies") {
        await ctx.editMessageMedia({ type: "photo", media: MAIN_IMAGE, caption: `🏴 *نیابتی‌ها*\n${state.proxies.length} گروه فعال\n💰 بودجه ماهانه: ${state.proxies.length * 5} همت`, parse_mode: "Markdown" }, { reply_markup: proxiesMenu() });
        return;
    }
    if (data === "menu_status") {
        await ctx.editMessageMedia({ type: "photo", media: MAIN_IMAGE, caption: state.getSummary(), parse_mode: "Markdown" }, { reply_markup: mainMenu() });
        return;
    }
    if (data === "menu_history") {
        const h = state.history.slice(-15).join("\n") || "📜 خالی";
        await ctx.editMessageMedia({ type: "photo", media: MAIN_IMAGE, caption: "📜 *تاریخچه*\n\n" + h, parse_mode: "Markdown" }, { reply_markup: mainMenu() });
        return;
    }
    if (data === "menu_time") {
        await ctx.editMessageMedia({ type: "photo", media: MAIN_IMAGE, caption: `⏭️ *گذر زمان*\n📅 ${state.year}/${state.month}\n⏳ نوبت: ${state.turn}\n\nچقدر جلو برم؟`, parse_mode: "Markdown" }, { reply_markup: timeMenu() });
        return;
    }
    
    // ============ زمان ============
    if (data.startsWith("time_")) {
        const months = parseInt(data.split("_")[1]);
        for(let i = 0; i < months && !state.gameOver; i++) state.nextMonth();
        result = `⏭️ *${months} ماه گذشت*\n📅 ${state.year}/${state.month} | نوبت: ${state.turn}`;
    }
    
    // ============ کشور ============
    if (data.startsWith("country_")) {
        const code = data.split("_")[1];
        const c = state.findCountry(code);
        if (c) {
            const rs = c.relation >= 50 ? "✅ متحد" : c.relation >= 20 ? "🟢 دوست" : c.relation >= -20 ? "🟡 بی‌طرف" : c.relation >= -50 ? "🟠 متخاصم" : "🔴 دشمن";
            await ctx.editMessageMedia({ type: "photo", media: MAIN_IMAGE, caption: `${c.emoji} *${c.name}*\n━━━━━━━━━━\n📊 روابط: ${c.relation}/100 ${rs}\n💰 تجارت: ${c.trade} میلیارد دلار`, parse_mode: "Markdown" }, { reply_markup: countryMenu(code) });
            return;
        }
    }
    
    // ============ اطلاعات کشور ============
    if (data.startsWith("info_")) {
        const code = data.split("_")[1];
        const c = state.findCountry(code);
        if (c) {
            const rs = c.relation >= 50 ? "✅ متحد" : c.relation >= 20 ? "🟢 دوست" : c.relation >= -20 ? "🟡 بی‌طرف" : c.relation >= -50 ? "🟠 متخاصم" : "🔴 دشمن";
            await ctx.editMessageMedia({ type: "photo", media: MAIN_IMAGE, caption: `${c.emoji} *${c.name}*\n━━━━━━━━━━\n📊 روابط: ${c.relation}/100 ${rs}\n💰 تجارت: ${c.trade} میلیارد دلار\n\nچه کاری می‌خوای بکنی؟`, parse_mode: "Markdown" }, { reply_markup: countryMenu(code) });
            return;
        }
    }
    
    // ============ دیپلماسی ============
    if (data.startsWith("negotiate_")) {
        const c = state.findCountry(data.split("_")[1]);
        if (c) { c.relation = Math.min(100, c.relation + 8); state.budget -= 1; result = `🤝 مذاکره با ${c.emoji} ${c.name}\n📈 روابط +۸`; advanceTurn = true; }
    }
    if (data.startsWith("trade_")) {
        const c = state.findCountry(data.split("_")[1]);
        if (c) { c.trade += 2; c.relation = Math.min(100, c.relation + 5); state.gdp += 3; result = `💰 تجارت با ${c.emoji} ${c.name}\n📈 تجارت +۲ میلیارد دلار`; advanceTurn = true; }
    }
    if (data.startsWith("pact_")) {
        const c = state.findCountry(data.split("_")[1]);
        if (c) { c.relation = Math.min(100, c.relation + 15); state.budget -= 3; result = `📝 پیمان با ${c.emoji} ${c.name}\n📈 روابط +۱۵`; advanceTurn = true; }
    }
    if (data.startsWith("sanction_")) {
        const c = state.findCountry(data.split("_")[1]);
        if (c) { c.relation = Math.max(-100, c.relation - 30); c.trade = Math.max(0, c.trade - 3); result = `🚫 ${c.emoji} ${c.name} تحریم شد\n📉 روابط -۳۰`; advanceTurn = true; }
    }
    if (data.startsWith("aid_")) {
        const c = state.findCountry(data.split("_")[1]);
        if (c) { c.relation = Math.min(100, c.relation + 12); state.budget -= 2; result = `🎁 کمک به ${c.emoji} ${c.name}\n📈 روابط +۱۲`; advanceTurn = true; }
    }
    
    // ============ حمله ============
    if (data.startsWith("attack_")) {
        await ctx.editMessageMedia({ type: "photo", media: MAIN_IMAGE, caption: "⚔️ *نوع حمله را انتخاب کن*", parse_mode: "Markdown" }, { reply_markup: attackMenu(data.split("_")[1]) });
        return;
    }
    if (data.startsWith("do_missile_")) {
        const c = state.findCountry(data.split("_")[2]);
        if (c) {
            if (state.missiles < 20) { await ctx.answerCallbackQuery("❌ موشک کم!"); return; }
            state.missiles -= 20; c.relation = Math.max(-100, c.relation - 30);
            state.sanctions = Math.min(100, state.sanctions + 10); state.popularity += 3; state.tension += 5;
            result = `🚀 *حمله موشکی به ${c.emoji} ${c.name}!*\n💥 ۲۰ موشک\n📉 روابط -۳۰\n⚠️ تحریم +۱۰`; advanceTurn = true;
        }
    }
    if (data.startsWith("do_drone_")) {
        const c = state.findCountry(data.split("_")[2]);
        if (c) {
            if (state.drones < 50) { await ctx.answerCallbackQuery("❌ پهپاد کم!"); return; }
            state.drones -= 50; c.relation = Math.max(-100, c.relation - 20);
            state.sanctions = Math.min(100, state.sanctions + 5); state.popularity += 2;
            result = `🛸 *حمله پهپادی به ${c.emoji} ${c.name}!*\n💥 ۵۰ پهپاد`; advanceTurn = true;
        }
    }
    if (data.startsWith("do_cyber_")) {
        const c = state.findCountry(data.split("_")[2]);
        if (c) { c.relation = Math.max(-100, c.relation - 10); state.popularity += 1; result = `💻 *حمله سایبری به ${c.emoji} ${c.name}!*`; advanceTurn = true; }
    }
    if (data.startsWith("do_war_")) {
        const c = state.findCountry(data.split("_")[2]);
        if (c) {
            if (state.budget < 80) { await ctx.answerCallbackQuery("❌ بودجه کم! (نیاز: ۸۰ همت)"); return; }
            state.budget -= 80; state.missiles -= 100; state.drones -= 300;
            c.relation = -100; state.sanctions = 100; state.popularity += 10; state.tension = 100;
            result = `⚔️ *اعلان جنگ به ${c.emoji} ${c.name}!*\n💰 هزینه: ۸۰ همت\n🚀 -۱۰۰ موشک\n🛸 -۳۰۰ پهپاد`; advanceTurn = true;
        }
    }
    
    // ============ مجلس ============
    if (data === "menu_parliament") {
        let ptxt = `🏛️ *مجلس شورای اسلامی*\n\n`;
        ptxt += `اصولگرا: ${state.parliament.principlists.count} | اصلاح‌طلب: ${state.parliament.reformists.count} | مستقل: ${state.parliament.independents.count}\n`;
        ptxt += `نیاز به رأی: ${state.voteNeeded}\n`;
        ptxt += `رأی خریده: ${state.boughtVotes}\n`;
        ptxt += `شانس لو رفتن: ${state.voteLeakChance}٪`;
        await ctx.editMessageMedia({ type: "photo", media: MAIN_IMAGE, caption: ptxt, parse_mode: "Markdown" }, { reply_markup: parliamentMenu() });
        return;
    }
    if (data === "parliament_vote") {
        const vote = state.runVote('economy');
        result = `🗳️ *رأی‌گیری*\n\n✅ موافق: ${vote.support}\n❌ مخالف: ${290 - vote.support}\n🎯 نیاز: ${vote.needed}\n\n${vote.passed ? '🎉 تصویب شد!' : '❌ رد شد!'}`;
        if (state.voteLeakChance > 0 && Math.random() * 100 < state.voteLeakChance) {
            state.popularity -= 15; state.corruption += 10;
            result += "\n\n🚨 *لو رفت!* رسوایی خرید رأی!\n👥 محبوبیت -۱۵٪";
        }
        advanceTurn = true;
    }
    if (data === "parliament_buy") {
        await ctx.editMessageMedia({ type: "photo", media: MAIN_IMAGE, caption: `💰 *خرید رأی*\n\nبودجه: ${state.budget.toFixed(0)} همت\nرأی خریده: ${state.boughtVotes}\n\n📊 قیمت هر رأی:\n• اصولگرا: ۳ همت (شانس ۳۰٪)\n• اصلاح‌طلب: ۵ همت (شانس ۹۰٪)\n• مستقل: ۲ همت (شانس ۷۰٪)`, parse_mode: "Markdown" }, { reply_markup: buyVoteMenu() });
        return;
    }
    if (data.startsWith("buyvote_")) {
        const parts = data.split("_");
        const faction = parts[1];
        const count = parseInt(parts[2]) || 10;
        
        if (faction === "all") {
            result = "💰 *خرید رأی*\n\n";
            for (const f of ["principlists", "reformists", "independents"]) {
                const r = state.buyVote(f, Math.floor(count / 3));
                if (r.success) result += `${state.parliament[f].name}: +${r.bought} رأی (${r.cost} همت)\n`;
            }
            result += `\n🎯 کل رأی خریده: ${state.boughtVotes}`;
        } else {
            const r = state.buyVote(faction, count);
            if (r.success) {
                result = `💰 *خرید رأی*\n\n${state.parliament[faction].name}: +${r.bought} رأی\n💰 هزینه: ${r.cost} همت\n🎯 کل رأی خریده: ${state.boughtVotes}\n🕵️ شانس لو رفتن: ${state.voteLeakChance}٪`;
            } else {
                result = r.msg;
            }
        }
    }
    if (data === "parliament_impeach") {
        state.popularity += 2; state.budget -= 2;
        result = "📋 *استیضاح*\n\nوزیر اقتصاد برکنار شد!\n👥 محبوبیت +۲٪";
        advanceTurn = true;
    }
    if (data === "parliament_lobby") {
        if (state.budget < 15) { await ctx.answerCallbackQuery("❌ بودجه کم! (نیاز: ۱۵ همت)"); return; }
        state.budget -= 15; state.boughtVotes += 20;
        result = "🤝 *لابی*\n\n+۲۰ رأی با نماینده‌ها\n💰 هزینه: ۱۵ همت\n🎯 کل رأی خریده: " + state.boughtVotes;
    }
    if (data === "parliament_status") {
        let s = "📊 *وضعیت مجلس*\n\n";
        for (const f of ["principlists", "reformists", "independents"]) {
            const p = state.parliament[f];
            s += `${p.name}: ${p.count} نفر\n💰 قیمت: ${p.basePrice} همت | 🎲 شانس رشوه: ${Math.floor(p.corruption * 100)}٪\n\n`;
        }
        s += `🎯 نیاز: ${state.voteNeeded} | 💰 خریده: ${state.boughtVotes}`;
        await ctx.editMessageMedia({ type: "photo", media: MAIN_IMAGE, caption: s, parse_mode: "Markdown" }, { reply_markup: parliamentMenu() });
        return;
    }
    
    // ============ واردات ============
    if (data === "menu_imports") {
        await ctx.editMessageMedia({ type: "photo", media: MAIN_IMAGE, caption: `📦 *واردات*\n\n💵 ذخایر: ${state.dollar.toFixed(1)} میلیارد دلار\n\nچه کالایی می‌خوای وارد کنی؟`, parse_mode: "Markdown" }, { reply_markup: importMenu() });
        return;
    }
    if (data.startsWith("import_")) {
        const itemKey = data.split("_")[1];
        const r = state.importGoods(itemKey);
        result = r.msg;
        advanceTurn = r.success;
    }
    
    // ============ صادرات ============
    if (data === "menu_exports") {
        await ctx.editMessageMedia({ type: "photo", media: MAIN_IMAGE, caption: `🛢️ *صادرات*\n\n💵 ذخایر: ${state.dollar.toFixed(1)} میلیارد دلار\n\nچه کالایی می‌خوای صادر کنی؟`, parse_mode: "Markdown" }, { reply_markup: exportMenu() });
        return;
    }
    if (data.startsWith("export_")) {
        const itemKey = data.split("_")[1];
        const r = state.exportGoods(itemKey);
        result = r.msg;
        advanceTurn = r.success;
    }
    
    // ============ اقتصاد ============
    if (data === "eco_oil") { state.oil += 0.2; state.budget += 5; result = "🛢️ صادرات نفت +۰.۲ میلیون بشکه\n💰 +۵ همت"; advanceTurn = true; }
    if (data === "eco_currency") { state.dollarRate += 5000; state.inflation += 3; state.popularity -= 2; result = "💵 نرخ ارز تغییر کرد\n⚠️ تورم +۳٪"; advanceTurn = true; }
    if (data === "eco_market") {
        if (state.budget >= 50) { state.budget -= 50; state.missiles += 10; result = "🛒 خرید موشک\n💰 -۵۰ همت\n🚀 +۱۰ موشک"; advanceTurn = true; }
        else { await ctx.answerCallbackQuery("❌ بودجه کم! (نیاز: ۵۰ همت)"); return; }
    }
    if (data === "eco_gas" || data === "domestic_gas") {
        state.gasPrice = state.gasPrice === 3000 ? 5000 : 3000;
        state.popularity += state.gasPrice > 3000 ? -10 : 5;
        result = `⛽ قیمت بنزین: ${state.gasPrice.toLocaleString()} تومان\n👥 ${state.gasPrice > 3000 ? 'محبوبیت -۱۰٪' : 'محبوبیت +۵٪'}`;
        advanceTurn = true;
    }
    if (data === "eco_bitcoin") { state.bitcoin += 100; result = "₿ +۱۰۰ بیت‌کوین استخراج شد"; advanceTurn = true; }
    if (data === "eco_gold") { state.gold += 5; state.dollar -= 1; result = "🥇 +۵ تن طلا\n💵 -۱ میلیارد دلار"; advanceTurn = true; }
    if (data === "eco_subsidy") { state.budget -= 15; state.popularity += 5; result = "💰 یارانه افزایش یافت\n👥 محبوبیت +۵٪"; advanceTurn = true; }
    if (data === "eco_print") { state.budget += 50; state.inflation += 20; state.dollarRate += 10000; result = "🏦 ۵۰ همت چاپ شد\n⚠️ تورم +۲۰٪\n💵 دلار +۱۰,۰۰۰"; advanceTurn = true; }
    if (data === "eco_corruption") { state.corruption = Math.max(0, state.corruption - 10); state.popularity += 3; result = "🕵️ مبارزه با فساد\n💰 فساد -۱۰٪"; advanceTurn = true; }
    if (data === "eco_water") { state.water = Math.max(0, state.water - 15); state.budget -= 5; result = "💧 سرمایه‌گذاری آب\n💧 بحران -۱۵٪"; advanceTurn = true; }
    if (data === "eco_brain") { state.brain = Math.max(0, state.brain - 3); state.popularity += 2; result = "🧠 طرح نخبگان\n🧠 فرار مغزها -۳٪"; advanceTurn = true; }
    
    // ============ هسته‌ای ============
    if (data === "military_nuclear") {
        await ctx.editMessageMedia({ type: "photo", media: MAIN_IMAGE, caption: `⚛️ *برنامه هسته‌ای*\n\nغنی‌سازی فعلی: ${state.nuclear}٪\nتحریم: ${state.sanctions}/100\nتنش: ${state.tension}/100`, parse_mode: "Markdown" }, { reply_markup: nuclearMenu() });
        return;
    }
    if (data.startsWith("do_enrich_")) {
        const target = parseInt(data.split("_")[2]);
        state.nuclear = target; state.sanctions = Math.min(100, state.sanctions + 15); state.popularity += 3;
        result = `⚛️ غنی‌سازی به ${target}٪ رسید\n⚠️ تحریم +۱۵`; advanceTurn = true;
    }
    if (data === "nuclear_deal") {
        state.nuclear = 3.67; state.sanctions = Math.max(0, state.sanctions - 30); state.popularity += 5;
        result = "📝 توافق هسته‌ای!\n⚛️ غنی‌سازی ۳.۶۷٪\n✅ تحریم -۳۰"; advanceTurn = true;
    }
    if (data === "nuclear_leave") {
        state.nuclear = 90; state.sanctions = 100; state.popularity += 5;
        result = "🚫 خروج از NPT!\n⚛️ غنی‌سازی ۹۰٪\n🚫 تحریم ۱۰۰٪"; advanceTurn = true;
    }
    
    // ============ نظامی ============
    if (data === "military_defense") { state.budget -= 5; state.popularity += 2; result = "🛡️ پدافند تقویت شد"; advanceTurn = true; }
    if (data === "military_produce") { state.missiles += 20; state.drones += 50; state.budget -= 10; result = "💣 +۲۰ موشک +۵۰ پهپاد"; advanceTurn = true; }
    if (data === "military_special") { state.sanctions = Math.max(0, state.sanctions - 5); result = "🕵️ عملیات ویژه\n✅ تحریم -۵"; advanceTurn = true; }
    
    // ============ داخلی ============
    if (data === "domestic_production") { state.gdp += 5; state.popularity += 2; state.budget -= 3; result = "🏭 تولید داخلی تقویت شد"; advanceTurn = true; }
    if (data === "domestic_internet") {
        state.internet = !state.internet;
        state.popularity += state.internet ? -5 : 8;
        result = state.internet ? "🚫 اینترنت فیلتر شد\n👥 -۵٪" : "✅ اینترنت آزاد شد\n👥 +۸٪";
        advanceTurn = true;
    }
    if (data === "domestic_fatf") { state.sanctions = Math.max(0, state.sanctions - 20); state.popularity -= 3; result = "✅ FATF پذیرفته شد\n🔒 تحریم -۲۰"; advanceTurn = true; }
    if (data === "domestic_protests") {
        state.popularity += 5; state.budget -= 2;
        result = "👥 مذاکره با معترضان\n✅ محبوبیت +۵٪";
        advanceTurn = true;
    }
    
    // ============ نیابتی ============
    if (data === "proxies_report") {
        let r = "🏴 *گروه‌های نیابتی*\n\n";
        state.proxies.forEach((p, i) => {
            r += `${i+1}. ${p.emoji} *${p.name}*\n👥 ${p.forces.toLocaleString()} | 🚀${p.missiles} | 🛸${p.drones}\n⭐ سطح: ${p.level || 1}\n\n`;
        });
        await ctx.editMessageMedia({ type: "photo", media: MAIN_IMAGE, caption: r, parse_mode: "Markdown" }, { reply_markup: proxiesMenu() });
        return;
    }
    if (data === "proxies_pay") { state.budget -= 5; result = "💵 حقوق گروه‌ها پرداخت شد\n💰 -۵ همت"; advanceTurn = true; }
    if (data === "proxies_create") {
        state.proxies.push({ name: "گروه جدید", emoji: "🏴", forces: 5000, missiles: 500, drones: 100, active: true, exposed: false, level: 1 });
        state.budget -= 10;
        result = "🏴 گروه نیابتی جدید ساخته شد\n💰 -۱۰ همت";
        advanceTurn = true;
    }
    if (data === "proxies_fund") {
        if (state.proxies[0]) { state.proxies[0].forces += 5000; state.proxies[0].missiles += 500; }
        state.budget -= 5;
        result = "💰 تأمین مالی گروه\n👥 +۵۰۰۰ نیرو";
        advanceTurn = true;
    }
    if (data === "proxies_weapons") {
        if (state.proxies[0]) { state.proxies[0].drones += 100; }
        result = "📦 سلاح ارسال شد\n🛸 +۱۰۰ پهپاد";
        advanceTurn = true;
    }
    if (data === "proxies_activate") { result = "⚔️ عملیات گروه انجام شد"; advanceTurn = true; }
    if (data === "proxies_clean") {
        state.proxies.forEach(p => p.exposed = false);
        result = "🧹 ردپای همه گروه‌ها پاک شد";
        advanceTurn = true;
    }
    if (data === "proxies_delete") {
        if (state.proxies.length > 0) {
            const removed = state.proxies.pop();
            result = `💀 ${removed.name} حذف شد`;
        } else {
            result = "❌ گروهی وجود ندارد";
        }
        advanceTurn = true;
    }
    
    // ============ پایان ============
    if (advanceTurn) state.nextMonth();
    
    if (result) {
        const short = `\n\n💰 ${state.budget.toFixed(0)} همت | 👥 ${state.popularity}٪ | 💵 ${state.dollarRate.toLocaleString()} تومان`;
        try {
            await ctx.editMessageMedia(
                { type: "photo", media: MAIN_IMAGE, caption: result + short, parse_mode: "Markdown" },
                { reply_markup: state.gameOver ? undefined : mainMenu() }
            );
        } catch(e) {
            await ctx.replyWithPhoto(MAIN_IMAGE, {
                caption: result + short,
                parse_mode: "Markdown",
                reply_markup: state.gameOver ? undefined : mainMenu()
            });
        }
    }
}

// ============================================
// منوی ادمین
// ============================================
function getAdminCaption(state) {
    return `🔓 *پنل ادوین*\n━━━━━━━━━━━━\n💰 ${state.budget.toFixed(0)} همت | 💵 ${state.dollar.toFixed(1)}B$\n🛢️ ${state.oil}M | 🥇 ${state.gold}T | ₿ ${state.bitcoin}\n⚔️ 🚀${state.missiles} 🛸${state.drones} 👥${state.soldiers}\n👥 ${state.popularity}٪ | 📊 ${state.inflation.toFixed(1)}٪\n🔒 ${state.sanctions} | ⚔️ ${state.tension}\n🏛️ ${state.getRankName()}`;
}

async function handleAdminAction(ctx, state, data) {
    if (ctx.from.id !== ADMIN_ID) return false;
    let result = "";
    
    switch(data) {
        case "admin_budget_100": state.budget += 100; result = "💰 +۱۰۰ همت"; break;
        case "admin_budget_500": state.budget += 500; result = "💰 +۵۰۰ همت"; break;
        case "admin_budget_1000": state.budget += 1000; result = "💰 +۱۰۰۰ همت"; break;
        case "admin_dollar_10": state.dollar += 10; result = "💵 +۱۰B$"; break;
        case "admin_dollar_50": state.dollar += 50; result = "💵 +۵۰B$"; break;
        case "admin_dollar_100": state.dollar += 100; result = "💵 +۱۰۰B$"; break;
        case "admin_missile_100": state.missiles += 100; result = "🚀 +۱۰۰"; break;
        case "admin_missile_500": state.missiles += 500; result = "🚀 +۵۰۰"; break;
        case "admin_missile_1000": state.missiles += 1000; result = "🚀 +۱۰۰۰"; break;
        case "admin_drone_500": state.drones += 500; result = "🛸 +۵۰۰"; break;
        case "admin_drone_2000": state.drones += 2000; result = "🛸 +۲۰۰۰"; break;
        case "admin_soldier_10000": state.soldiers += 10000; result = "👥 +۱۰K"; break;
        case "admin_pop_10": state.popularity = Math.min(100, state.popularity + 10); result = "👥 +۱۰٪"; break;
        case "admin_pop_30": state.popularity = Math.min(100, state.popularity + 30); result = "👥 +۳۰٪"; break;
        case "admin_pop_50": state.popularity = Math.min(100, state.popularity + 50); result = "👥 +۵۰٪"; break;
        case "admin_pop_100": state.popularity = 100; result = "👥 ۱۰۰٪"; break;
        case "admin_inf_10": state.inflation = Math.max(0, state.inflation - 10); result = "📉 -۱۰٪"; break;
        case "admin_inf_20": state.inflation = Math.max(0, state.inflation - 20); result = "📉 -۲۰٪"; break;
        case "admin_inf_0": state.inflation = 0; result = "📉 صفر"; break;
        case "admin_sanction_10": state.sanctions = Math.max(0, state.sanctions - 10); result = "🔒 -۱۰"; break;
        case "admin_sanction_30": state.sanctions = Math.max(0, state.sanctions - 30); result = "🔒 -۳۰"; break;
        case "admin_sanction_0": state.sanctions = 0; result = "🔒 صفر"; break;
        case "admin_tension_10": state.tension = Math.max(0, state.tension - 10); result = "⚔️ -۱۰"; break;
        case "admin_tension_30": state.tension = Math.max(0, state.tension - 30); result = "⚔️ -۳۰"; break;
        case "admin_tension_0": state.tension = 0; result = "⚔️ صفر"; break;
        case "admin_nuclear_20": state.nuclear = 20; result = "⚛️ ۲۰٪"; break;
        case "admin_nuclear_60": state.nuclear = 60; result = "⚛️ ۶۰٪"; break;
        case "admin_nuclear_90": state.nuclear = 90; result = "⚛️ ۹۰٪"; break;
        case "admin_relations_20": state.countries.forEach(c => c.relation = Math.min(100, c.relation + 20)); result = "🌍 +۲۰"; break;
        case "admin_relations_50": state.countries.forEach(c => c.relation = Math.min(100, c.relation + 50)); result = "🌍 +۵۰"; break;
        case "admin_relations_minus": state.countries.forEach(c => c.relation = Math.max(-100, c.relation - 50)); result = "🌍 دشمن"; break;
        case "admin_buy_all_votes": state.boughtVotes = 200; result = "🏛️ خرید همه"; break;
        case "admin_pass_vote": state.boughtVotes = 200; result = "🏛️ تصویب"; break;
        case "admin_boost_proxies": state.proxies.forEach(p => { p.forces += 50000; p.missiles += 5000; p.drones += 2000; p.level = 10; p.exposed = false; }); result = "🏴 تقویت"; break;
        case "admin_create_proxy": state.proxies.push({ name: "گردان سری", emoji: "🏴", forces: 100000, missiles: 50000, drones: 10000, active: true, exposed: false, level: 10 }); result = "🏴 ساخت"; break;
        case "admin_time_6": for(let i=0; i<6; i++) state.nextMonth(); result = "⏭️ ۶ ماه"; break;
        case "admin_time_12": for(let i=0; i<12; i++) state.nextMonth(); result = "⏭️ ۱ سال"; break;
        case "admin_time_24": for(let i=0; i<24; i++) state.nextMonth(); result = "⏭️ ۲ سال"; break;
        case "admin_time_48": for(let i=0; i<48; i++) state.nextMonth(); result = "⏭️ ۴ سال"; break;
        case "admin_time_120": for(let i=0; i<120; i++) state.nextMonth(); result = "⏭️ ۱۰ سال"; break;
        case "admin_rank_president": state.rank = "president"; state.termMonths = 0; state.demotionCount = 0; result = "🎭 رئیس‌جمهور"; break;
        case "admin_rank_speaker": state.rank = "speaker"; result = "🎭 رئیس مجلس"; break;
        case "admin_rank_minister": state.rank = "minister"; result = "🎭 وزیر"; break;
        case "admin_no_gameover": state.gameOver = false; state.popularity = Math.max(30, state.popularity); result = "💀 باخت غیرفعال"; break;
        case "admin_reset_rank": state.rank = "president"; state.termMonths = 0; state.demotionCount = 0; state.gameOver = false; state.popularity = Math.max(40, state.popularity); result = "🔄 برگشت"; break;
        case "admin_clear_history": state.history = []; result = "📜 پاک شد"; break;
        default: return false;
    }
    
    try {
        await ctx.editMessageMedia(
            { type: "photo", media: MAIN_IMAGE, caption: `🔓 *ادوین: ${result}*\n\n${getAdminCaption(state)}`, parse_mode: "Markdown" },
            { reply_markup: adminMenu() }
        );
    } catch(e) {}
    
    return true;
}

// ============================================
// خروجی
// ============================================
module.exports = {
    mainMenu, domesticMenu, foreignMenu, countryMenu,
    militaryMenu, economyMenu, proxiesMenu, timeMenu,
    parliamentMenu, buyVoteMenu, attackMenu, nuclearMenu,
    importMenu, exportMenu, adminMenu,
    handleCallback, handleAdminAction, getAdminCaption,
    MAIN_IMAGE, ADMIN_ID
};