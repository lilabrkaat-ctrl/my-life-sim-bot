// handlers.js - مدیریت همه دکمه‌ها و عملیات بازی

const { InlineKeyboard } = require("grammy");
const { COUNTRIES } = require("./config");
const { getPlayer } = require("./state");
const {
    analyzeBill, runFinalVote, buyVotes, giveSpeech, lobby, impeachMinister,
    getBillReport, getVoteResultText, parliamentMenu, getParliamentStatus,
    getWaitingForBillText, billActionMenu, buyVoteMenu, myVoteMenu
} = require("./parliament");

const MAIN_IMAGE = "AgACAgQAAxkBAAEq26RqM6Zgod1-3-pP1RpqVDXkdZfz2gACsw5rGwPDmVFZ4np59GoqLgEAAwIAA3gAAzwE";
const userStates = new Map();

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
        await ctx.editMessageMedia({ type: "photo", media: MAIN_IMAGE, caption: `🏴 *نیابتی‌ها*\n${state.proxies.length} گروه فعال`, parse_mode: "Markdown" }, { reply_markup: proxiesMenu() });
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
        let events = [];
        for (let i = 0; i < months && !state.gameOver; i++) {
            state.nextMonth();
            if (state.history.length > 0) {
                const last = state.history[state.history.length - 1];
                if (last.includes("🎉") || last.includes("📉") || last.includes("⚠️") || last.includes("💀")) {
                    events.push(last);
                }
            }
        }
        result = `⏭️ *${months} ماه گذشت*\n📅 ${state.year}/${state.month} | نوبت: ${state.turn}`;
        if (events.length > 0) {
            result += "\n\n📋 *اتفاقات مهم:*\n" + events.slice(-3).join("\n");
        }
    }
    
    // ============ کشورها ============
    if (data.startsWith("country_")) {
        const code = data.split("_")[1];
        const c = state.findCountry(code);
        if (c) {
            const rs = c.relation >= 50 ? "✅ متحد" : c.relation >= 20 ? "🟢 دوست" : c.relation >= -20 ? "🟡 بی‌طرف" : "🔴 دشمن";
            await ctx.editMessageMedia({ type: "photo", media: MAIN_IMAGE, caption: `${c.emoji} *${c.name}*\n━━━━━━━━━━\n📊 روابط: ${c.relation}/100 ${rs}\n💰 تجارت: ${c.trade} میلیارد دلار`, parse_mode: "Markdown" }, { reply_markup: countryMenu(code) });
            return;
        }
    }
    
    // ============ اطلاعات کشور ============
    if (data.startsWith("info_")) {
        const code = data.split("_")[1];
        const c = state.findCountry(code);
        if (c) {
            const rs = c.relation >= 50 ? "✅ متحد" : c.relation >= 20 ? "🟢 دوست" : c.relation >= -20 ? "🟡 بی‌طرف" : "🔴 دشمن";
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
        if (c) { c.trade += 2; c.relation = Math.min(100, c.relation + 5); state.gdp += 3; result = `💰 تجارت با ${c.emoji} ${c.name}\n📈 +۲ میلیارد دلار`; advanceTurn = true; }
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
        await ctx.editMessageMedia({ type: "photo", media: MAIN_IMAGE, caption: getParliamentStatus(state), parse_mode: "Markdown" }, { reply_markup: parliamentMenu() });
        return;
    }
    
    if (data === "parliament_new_bill") {
        userStates.set(ctx.from.id, { waitingForBill: true });
        await ctx.editMessageMedia({ type: "photo", media: MAIN_IMAGE, caption: getWaitingForBillText(), parse_mode: "Markdown" }, { reply_markup: new InlineKeyboard().text("🔙 انصراف", "menu_parliament") });
        return;
    }
    
    if (data === "parliament_status") {
        await ctx.editMessageMedia({ type: "photo", media: MAIN_IMAGE, caption: getParliamentStatus(state), parse_mode: "Markdown" }, { reply_markup: parliamentMenu() });
        return;
    }
    
    // دکمه‌های لایحه
    if (data === "bill_back") {
        if (state.pendingBill) {
            const bill = state.pendingBill;
            await ctx.editMessageMedia({ type: "photo", media: MAIN_IMAGE, caption: getBillReport(bill, state), parse_mode: "Markdown" }, { reply_markup: billActionMenu() });
        } else {
            await ctx.editMessageMedia({ type: "photo", media: MAIN_IMAGE, caption: getParliamentStatus(state), parse_mode: "Markdown" }, { reply_markup: parliamentMenu() });
        }
        return;
    }
    
    if (data === "bill_vote") {
        if (!state.pendingBill) { await ctx.answerCallbackQuery("❌ اول یه لایحه ارائه بده!"); return; }
        const bill = state.pendingBill;
        const vote = runFinalVote(state, bill, state.playerVote || 0, state.extraVotes || 0);
        result = getVoteResultText(bill, vote, state);
        state.pendingBill = null;
        state.playerVote = 0;
        state.extraVotes = 0;
        advanceTurn = true;
    }
    
    if (data === "bill_buy") {
        await ctx.editMessageMedia({ type: "photo", media: MAIN_IMAGE, caption: `💰 *خرید رأی*\n\nبودجه: ${state.budget.toFixed(0)} همت\nرأی خریده: ${state.boughtVotes}\n\n📊 قیمت‌ها:\n• اصولگرا: ۳ همت (شانس ${Math.floor(state.parliament.principlists.corruption*100)}٪)\n• اصلاح‌طلب: ۵ همت (شانس ${Math.floor(state.parliament.reformists.corruption*100)}٪)\n• مستقل: ۲ همت (شانس ${Math.floor(state.parliament.independents.corruption*100)}٪)`, parse_mode: "Markdown" }, { reply_markup: buyVoteMenu() });
        return;
    }
    
    if (data.startsWith("buyvote_")) {
        const parts = data.split("_");
        const faction = parts[1];
        const count = parseInt(parts[2]) || 10;
        
        if (faction === "all") {
            result = "💰 *خرید رأی*\n\n";
            for (const f of ["principlists", "reformists", "independents"]) {
                const r = buyVotes(state, f, Math.floor(count / 3));
                if (r.success) result += `${r.faction}: +${r.bought}/${r.tried} رأی (${r.cost} همت)\n`;
            }
            result += `\n🎯 کل رأی خریده: ${state.boughtVotes}`;
        } else {
            const r = buyVotes(state, faction, count);
            if (r.success) {
                result = `💰 *خرید رأی*\n\n${r.faction}: +${r.bought}/${r.tried} رأی\n💰 هزینه: ${r.cost} همت\n❌ رد شد: ${r.failed}\n🎯 کل: ${state.boughtVotes}\n🕵️ شانس لو رفتن: ${state.voteLeakChance}٪`;
            } else {
                result = r.msg;
            }
        }
    }
    
    if (data === "bill_speech") {
        const r = giveSpeech(state);
        if (r.success) {
            state.extraVotes = (state.extraVotes || 0) + r.votes;
            result = r.msg;
        } else {
            result = r.msg;
        }
    }
    
    if (data === "bill_lobby") {
        const r = lobby(state);
        if (r.success) {
            result = r.msg;
        } else {
            result = r.msg;
        }
    }
    
    if (data === "bill_myvote") {
        await ctx.editMessageMedia({ type: "photo", media: MAIN_IMAGE, caption: `👤 *رأی شخصی تو*\n\nبه عنوان رئیس‌جمهور، رأی تو ۵ برابر یک نماینده‌ست.\n\nمی‌خوای رأی مثبت بدی، منفی، یا ممتنع؟`, parse_mode: "Markdown" }, { reply_markup: myVoteMenu() });
        return;
    }
    
    if (data === "myvote_yes") { state.playerVote = 5; result = "✅ رأی مثبت (+۵)"; }
    if (data === "myvote_no") { state.playerVote = -5; result = "❌ رأی منفی (-۵)"; }
    if (data === "myvote_abstain") { state.playerVote = 0; result = "🤐 ممتنع"; }
    
    // ============ اقتصاد ============
    if (data === "eco_oil") { state.oil += 0.2; state.budget += 5; result = "🛢️ صادرات نفت +۰.۲M\n💰 +۵ همت"; advanceTurn = true; }
    if (data === "eco_currency") { state.dollarRate += 5000; state.inflation += 3; state.popularity -= 2; result = "💵 نرخ ارز تغییر کرد"; advanceTurn = true; }
    if (data === "eco_market") { if (state.budget >= 50) { state.budget -= 50; state.missiles += 10; result = "🛒 خرید موشک"; advanceTurn = true; } else { await ctx.answerCallbackQuery("❌ بودجه کم!"); return; } }
    if (data === "eco_gas" || data === "domestic_gas") { state.gasPrice = state.gasPrice === 3000 ? 5000 : 3000; state.popularity += state.gasPrice > 3000 ? -10 : 5; result = `⛽ بنزین ${state.gasPrice.toLocaleString()} تومان`; advanceTurn = true; }
    if (data === "eco_bitcoin") { state.bitcoin += 100; result = "₿ +۱۰۰ بیت‌کوین"; advanceTurn = true; }
    if (data === "eco_gold") { state.gold += 5; state.dollar -= 1; result = "🥇 +۵ تن طلا"; advanceTurn = true; }
    if (data === "eco_subsidy") { state.budget -= 15; state.popularity += 5; result = "💰 یارانه افزایش یافت"; advanceTurn = true; }
    if (data === "eco_print") { state.budget += 50; state.inflation += 20; state.dollarRate += 10000; result = "🏦 ۵۰ همت چاپ شد"; advanceTurn = true; }
    if (data === "eco_corruption") { state.corruption = Math.max(0, state.corruption - 10); state.popularity += 3; result = "🕵️ مبارزه با فساد"; advanceTurn = true; }
    if (data === "eco_water") { state.water = Math.max(0, state.water - 15); state.budget -= 5; result = "💧 سرمایه‌گذاری آب"; advanceTurn = true; }
    if (data === "eco_brain") { state.brain = Math.max(0, state.brain - 3); state.popularity += 2; result = "🧠 طرح نخبگان"; advanceTurn = true; }
    
    // ============ هسته‌ای ============
    if (data === "military_nuclear") {
        await ctx.editMessageMedia({ type: "photo", media: MAIN_IMAGE, caption: `⚛️ *برنامه هسته‌ای*\n\nغنی‌سازی: ${state.nuclear}٪\nتحریم: ${state.sanctions}/100`, parse_mode: "Markdown" }, { reply_markup: nuclearMenu() });
        return;
    }
    if (data.startsWith("do_enrich_")) { state.nuclear = parseInt(data.split("_")[2]); state.sanctions = Math.min(100, state.sanctions + 15); result = `⚛️ غنی‌سازی ${state.nuclear}٪`; advanceTurn = true; }
    if (data === "nuclear_deal") { state.nuclear = 3.67; state.sanctions = Math.max(0, state.sanctions - 30); result = "📝 توافق هسته‌ای!"; advanceTurn = true; }
    if (data === "nuclear_leave") { state.nuclear = 90; state.sanctions = 100; result = "🚫 خروج از NPT!"; advanceTurn = true; }
    
    // ============ نظامی ============
    if (data === "military_defense") { state.budget -= 5; result = "🛡️ پدافند تقویت شد"; advanceTurn = true; }
    if (data === "military_produce") { state.missiles += 20; state.drones += 50; state.budget -= 10; result = "💣 +۲۰ موشک +۵۰ پهپاد"; advanceTurn = true; }
    if (data === "military_special") { state.sanctions = Math.max(0, state.sanctions - 5); result = "🕵️ عملیات ویژه"; advanceTurn = true; }
    
    // ============ داخلی ============
    if (data === "domestic_production") { state.gdp += 5; state.popularity += 2; state.budget -= 3; result = "🏭 تولید داخلی"; advanceTurn = true; }
    if (data === "domestic_internet") { state.internet = !state.internet; state.popularity += state.internet ? -5 : 8; result = state.internet ? "🚫 فیلتر" : "✅ آزاد"; advanceTurn = true; }
    if (data === "domestic_fatf") { state.sanctions = Math.max(0, state.sanctions - 20); state.popularity -= 3; result = "✅ FATF"; advanceTurn = true; }
    if (data === "domestic_protests") { state.popularity += 5; state.budget -= 2; result = "👥 مذاکره با معترضان"; advanceTurn = true; }
    
    // ============ نیابتی ============
    if (data === "proxies_report") {
        let r = "🏴 *گروه‌های نیابتی*\n\n";
        state.proxies.forEach((p, i) => r += `${i+1}. ${p.emoji} ${p.name}\n👥 ${p.forces.toLocaleString()} | 🚀${p.missiles} | 🛸${p.drones}\n\n`);
        await ctx.editMessageMedia({ type: "photo", media: MAIN_IMAGE, caption: r, parse_mode: "Markdown" }, { reply_markup: proxiesMenu() });
        return;
    }
    if (data === "proxies_pay") { state.budget -= 5; result = "💵 حقوق پرداخت شد"; advanceTurn = true; }
    if (data === "proxies_create") { state.proxies.push({ name: "گروه جدید", emoji: "🏴", forces: 5000, missiles: 500, drones: 100, active: true, exposed: false, level: 1 }); state.budget -= 10; result = "🏴 گروه جدید"; advanceTurn = true; }
    if (data === "proxies_fund") { if (state.proxies[0]) { state.proxies[0].forces += 5000; state.proxies[0].missiles += 500; } state.budget -= 5; result = "💰 تأمین مالی"; advanceTurn = true; }
    if (data === "proxies_weapons") { if (state.proxies[0]) { state.proxies[0].drones += 100; } result = "📦 سلاح ارسال شد"; advanceTurn = true; }
    if (data === "proxies_activate") { result = "⚔️ عملیات انجام شد"; advanceTurn = true; }
    if (data === "proxies_clean") { state.proxies.forEach(p => p.exposed = false); result = "🧹 ردپا پاک شد"; advanceTurn = true; }
    if (data === "proxies_delete") { if (state.proxies.length > 0) { state.proxies.pop(); result = "💀 گروه حذف شد"; } else { result = "❌ گروهی نیست"; } advanceTurn = true; }
    
    // ============ پایان ============
    if (advanceTurn) state.nextMonth();
    
    if (result) {
        const short = `\n\n💰 ${state.budget.toFixed(0)} | 👥 ${state.popularity}٪ | 💵 ${state.dollarRate.toLocaleString()}`;
        try {
            await ctx.editMessageMedia({ type: "photo", media: MAIN_IMAGE, caption: result + short, parse_mode: "Markdown" }, { reply_markup: state.gameOver ? undefined : mainMenu() });
        } catch (e) {
            await ctx.replyWithPhoto(MAIN_IMAGE, { caption: result + short, parse_mode: "Markdown", reply_markup: state.gameOver ? undefined : mainMenu() });
        }
    }
}

// ============================================
// هندلر پیام متنی (برای لایحه مجلس)
// ============================================
async function handleMessage(ctx, state, text) {
    const userState = userStates.get(ctx.from.id);
    
    if (userState && userState.waitingForBill) {
        const bill = analyzeBill(state, text);
        state.pendingBill = bill;
        state.playerVote = 0;
        state.extraVotes = 0;
        userStates.delete(ctx.from.id);
        
        await ctx.replyWithPhoto(MAIN_IMAGE, {
            caption: getBillReport(bill, state),
            parse_mode: "Markdown",
            reply_markup: billActionMenu()
        });
        return true;
    }
    
    return false;
}

// ============================================
// خروجی
// ============================================
module.exports = {
    mainMenu, domesticMenu, foreignMenu, countryMenu,
    militaryMenu, economyMenu, proxiesMenu, timeMenu,
    attackMenu, nuclearMenu,
    handleCallback, handleMessage,
    MAIN_IMAGE, userStates
};