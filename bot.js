const { Bot, InlineKeyboard } = require("grammy");
const { TOKEN, PARLIAMENT, VOTE_NEEDED } = require("./config");
const { IranState, getPlayer, setPlayer } = require("./state");

const bot = new Bot(TOKEN);
const userStates = new Map();
const MAIN_IMAGE = "AgACAgQAAxkBAAEq26RqM6Zgod1-3-pP1RpqVDXkdZfz2gACsw5rGwPDmVFZ4np59GoqLgEAAwIAA3gAAzwE";

// ============================================
// تحلیل لایحه
// ============================================
function analyzeBill(state, text) {
    let leadershipSupport = 50;
    let personalBenefit = 50;
    let nationalBenefit = 50;
    let topic = "general";
    
    const t = text.toLowerCase();
    
    if (t.includes("حمله") || t.includes("جنگ")) {
        topic = "war";
        if (t.includes("اسرائیل")) { leadershipSupport = 85; nationalBenefit = 60; personalBenefit = 15; }
        else if (t.includes("آمریکا")) { leadershipSupport = 30; nationalBenefit = 20; personalBenefit = 10; }
        else { leadershipSupport = 50; nationalBenefit = 40; personalBenefit = 20; }
    } else if (t.includes("مذاکره") || t.includes("صلح")) {
        topic = "peace";
        if (t.includes("آمریکا")) { leadershipSupport = 25; nationalBenefit = 70; personalBenefit = 30; }
        else { leadershipSupport = 60; nationalBenefit = 75; personalBenefit = 40; }
    } else if (t.includes("یارانه") || t.includes("پول")) {
        topic = "economy";
        leadershipSupport = 50; nationalBenefit = 35; personalBenefit = 85;
    } else if (t.includes("fatf") || t.includes("تحریم")) {
        topic = "economy";
        leadershipSupport = 40; nationalBenefit = 70; personalBenefit = 25;
    } else if (t.includes("اینترنت") || t.includes("فیلتر")) {
        topic = "social";
        leadershipSupport = 40; nationalBenefit = 60; personalBenefit = 50;
    }
    
    const chance = Math.floor((leadershipSupport + personalBenefit + nationalBenefit) / 3);
    const prin = Math.floor(PARLIAMENT.principlists.count * (leadershipSupport / 100));
    const ref = Math.floor(PARLIAMENT.reformists.count * (nationalBenefit / 100));
    const ind = Math.floor(PARLIAMENT.independents.count * (personalBenefit / 100));
    const total = prin + ref + ind;
    
    return { text, topic, leadershipSupport, personalBenefit, nationalBenefit, chance, prin, ref, ind, total, needed: VOTE_NEEDED, passed: total >= VOTE_NEEDED };
}

// ============================================
// رأی‌گیری
// ============================================
function runVote(state, bill) {
    let prin = bill.prin + Math.floor(state.boughtVotes / 3);
    let ref = bill.ref + Math.floor(state.boughtVotes / 3);
    let ind = bill.ind + Math.floor(state.boughtVotes / 3) + (state.extraVotes || 0);
    
    prin = Math.max(0, Math.min(PARLIAMENT.principlists.count, prin));
    ref = Math.max(0, Math.min(PARLIAMENT.reformists.count, ref));
    ind = Math.max(0, Math.min(PARLIAMENT.independents.count, ind));
    
    const total = prin + ref + ind + (state.playerVote || 0);
    const d = {
        principlists: { support: prin, oppose: PARLIAMENT.principlists.count - prin },
        reformists: { support: ref, oppose: PARLIAMENT.reformists.count - ref },
        independents: { support: ind, oppose: PARLIAMENT.independents.count - ind },
        playerVote: state.playerVote || 0,
        boughtVotes: state.boughtVotes
    };
    
    return { support: total, oppose: 290 - total, needed: VOTE_NEEDED, passed: total >= VOTE_NEEDED, details: d };
}

// ============================================
// خرید رأی
// ============================================
function buyVotes(state, faction, count) {
    const f = PARLIAMENT[faction];
    if (!f) return { success: false, msg: "جناح نامعتبر!" };
    
    const cost = f.basePrice * count;
    if (state.budget < cost) return { success: false, msg: `❌ بودجه کم! نیاز: ${cost} همت` };
    
    state.budget -= cost;
    let bought = 0;
    for (let i = 0; i < count; i++) { if (Math.random() < f.corruption) bought++; }
    state.boughtVotes += bought;
    state.voteLeakChance = Math.min(100, state.voteLeakChance + bought * 2);
    
    return { success: true, faction: f.name, bought, cost, totalBought: state.boughtVotes, leakChance: state.voteLeakChance };
}

// ============================================
// منوها
// ============================================
function mainMenu() {
    return new InlineKeyboard()
        .text("🏛️ مجلس", "menu_parliament").text("📊 وضعیت", "menu_status").row()
        .text("⏭️ ماه بعد", "menu_next");
}

function parliamentMenu() {
    return new InlineKeyboard()
        .text("📝 ارائه لایحه", "parliament_new_bill").text("📊 وضعیت", "parliament_status").row()
        .text("🔙 منوی اصلی", "main_menu");
}

function billActionMenu() {
    return new InlineKeyboard()
        .text("🗳️ رأی‌گیری", "bill_vote").text("💰 خرید رأی", "bill_buy").text("🎭 نطق", "bill_speech").row()
        .text("👤 رأی من", "bill_myvote").text("📝 لایحه جدید", "parliament_new_bill").row()
        .text("🔙 مجلس", "menu_parliament");
}

function buyVoteMenu() {
    return new InlineKeyboard()
        .text("اصولگرا ۳T", "buy_prin_10").text("اصلاح‌طلب ۵T", "buy_ref_10").text("مستقل ۲T", "buy_ind_10").row()
        .text("💰 همه ۵۰ رأی", "buy_all_50").text("🔙 لایحه", "bill_back");
}

function myVoteMenu() {
    return new InlineKeyboard()
        .text("✅ مثبت (+۵)", "myvote_yes").text("❌ منفی (-۵)", "myvote_no").text("🤐 ممتنع", "myvote_abstain").row()
        .text("🔙 لایحه", "bill_back");
}

// ============================================
// /start
// ============================================
bot.command("start", async (ctx) => {
    const userId = ctx.from.id;
    let state = getPlayer(userId);
    
    if (state) {
        return ctx.replyWithPhoto(MAIN_IMAGE, {
            caption: `🏛️ *${state.name}*! بازی قبلیت هنوز فعاله!\n\n💰 بودجه: ${state.budget} همت\n👥 محبوبیت: ${state.popularity}٪`,
            parse_mode: "Markdown",
            reply_markup: mainMenu()
        });
    }
    
    state = new IranState(ctx.from.first_name);
    setPlayer(userId, state);
    
    await ctx.replyWithPhoto(MAIN_IMAGE, {
        caption: `🏛️ *${state.name}* عزیز، شما رئیس‌جمهور ایران هستید!\n\n💰 بودجه: ${state.budget} همت\n👥 محبوبیت: ${state.popularity}٪\n\nبرای شروع، برو به مجلس و لایحه بده!`,
        parse_mode: "Markdown",
        reply_markup: mainMenu()
    });
});

// ============================================
// دکمه‌ها
// ============================================
bot.on("callback_query:data", async (ctx) => {
    const state = getPlayer(ctx.from.id);
    const data = ctx.callbackQuery.data;
    
    if (!state) { await ctx.answerCallbackQuery("/start بزن!"); return; }
    await ctx.answerCallbackQuery();
    
    let result = "";
    
    try {
        // منوها
        if (data === "main_menu") {
            return ctx.editMessageMedia({ type: "photo", media: MAIN_IMAGE, caption: `🏛️ *منوی اصلی*\n\n💰 ${state.budget} همت | 👥 ${state.popularity}٪`, parse_mode: "Markdown" }, { reply_markup: mainMenu() });
        }
        if (data === "menu_parliament") {
            let txt = `🏛️ *مجلس*\n\nاصولگرا: ${PARLIAMENT.principlists.count} | اصلاح‌طلب: ${PARLIAMENT.reformists.count} | مستقل: ${PARLIAMENT.independents.count}\nنیاز: ${VOTE_NEEDED} | خریده: ${state.boughtVotes}`;
            return ctx.editMessageMedia({ type: "photo", media: MAIN_IMAGE, caption: txt, parse_mode: "Markdown" }, { reply_markup: parliamentMenu() });
        }
        if (data === "menu_status") {
            let txt = `📊 *وضعیت*\n\n💰 بودجه: ${state.budget} همت\n👥 محبوبیت: ${state.popularity}٪\n💰 فساد: ${state.corruption}٪\n🏛️ رأی خریده: ${state.boughtVotes}\n🕵️ شانس لو رفتن: ${state.voteLeakChance}٪`;
            return ctx.editMessageMedia({ type: "photo", media: MAIN_IMAGE, caption: txt, parse_mode: "Markdown" }, { reply_markup: mainMenu() });
        }
        if (data === "parliament_status") {
            let txt = `🏛️ *مجلس*\n\nاصولگرا: ${PARLIAMENT.principlists.count} نفر | قیمت: ${PARLIAMENT.principlists.basePrice} همت | شانس رشوه: ${PARLIAMENT.principlists.corruption*100}٪\n\nاصلاح‌طلب: ${PARLIAMENT.reformists.count} نفر | قیمت: ${PARLIAMENT.reformists.basePrice} همت | شانس رشوه: ${PARLIAMENT.reformists.corruption*100}٪\n\nمستقل: ${PARLIAMENT.independents.count} نفر | قیمت: ${PARLIAMENT.independents.basePrice} همت | شانس رشوه: ${PARLIAMENT.independents.corruption*100}٪\n\n🎯 نیاز: ${VOTE_NEEDED} | 💰 خریده: ${state.boughtVotes}`;
            return ctx.editMessageMedia({ type: "photo", media: MAIN_IMAGE, caption: txt, parse_mode: "Markdown" }, { reply_markup: parliamentMenu() });
        }
        
        // ارائه لایحه
        if (data === "parliament_new_bill") {
            userStates.set(ctx.from.id, { waitingForBill: true });
            return ctx.editMessageMedia({ type: "photo", media: MAIN_IMAGE, caption: `📝 *ارائه لایحه*\n\nلایحه‌ات رو بنویس...\n\nمثال:\n• حمله به اسرائیل\n• افزایش یارانه\n• مذاکره با آمریکا\n• اینترنت آزاد\n• قبول FATF`, parse_mode: "Markdown" }, { reply_markup: new InlineKeyboard().text("🔙 انصراف", "menu_parliament") });
        }
        
        // برگشت به لایحه
        if (data === "bill_back") {
            if (state.pendingBill) {
                const bill = state.pendingBill;
                let txt = `🏛️ *تحلیل لایحه*\n\n📝 "${bill.text}"\n\n━━━━━━━━\n🕌 رهبری: ${bill.leadershipSupport}٪\n💰 شخصی: ${bill.personalBenefit}٪\n🇮🇷 ملی: ${bill.nationalBenefit}٪\n\n🎯 شانس: ${bill.chance}٪\n📊 آرا: ${bill.total} | نیاز: ${VOTE_NEEDED}\n${bill.passed ? '✅ احتمال تصویب' : '❌ احتمال رد'}`;
                return ctx.editMessageMedia({ type: "photo", media: MAIN_IMAGE, caption: txt, parse_mode: "Markdown" }, { reply_markup: billActionMenu() });
            }
            return ctx.editMessageMedia({ type: "photo", media: MAIN_IMAGE, caption: "🏛️ *مجلس*", parse_mode: "Markdown" }, { reply_markup: parliamentMenu() });
        }
        
        // رأی‌گیری
        if (data === "bill_vote") {
            if (!state.pendingBill) { await ctx.answerCallbackQuery("❌ اول لایحه بده!"); return; }
            const vote = runVote(state, state.pendingBill);
            const d = vote.details;
            result = `🗳️ *نتیجه*\n\n📝 "${state.pendingBill.text}"\n\nاصولگرا: ✅${d.principlists.support} ❌${d.principlists.oppose}\nاصلاح‌طلب: ✅${d.reformists.support} ❌${d.reformists.oppose}\nمستقل: ✅${d.independents.support} ❌${d.independents.oppose}\n${d.playerVote !== 0 ? '👤 رأی تو: ' + (d.playerVote > 0 ? '✅' : '❌') + ' ' + Math.abs(d.playerVote) + '\n' : ''}${d.boughtVotes > 0 ? '💰 خریده: ✅' + d.boughtVotes + '\n' : ''}\n━━━━━━━━\n✅ ${vote.support} | ❌ ${vote.oppose} | 🎯 ${VOTE_NEEDED}\n\n${vote.passed ? '🎉 تصویب شد!' : '❌ رد شد!'}`;
            
            if (state.voteLeakChance > 0 && Math.random() * 100 < state.voteLeakChance) {
                state.popularity -= 15; state.corruption += 10; state.voteLeakChance = 0;
                result += "\n\n🚨 لو رفت! رسوایی خرید رأی!";
            }
            state.pendingBill = null; state.playerVote = 0; state.extraVotes = 0;
        }
        
        // خرید رأی
        if (data === "bill_buy") {
            return ctx.editMessageMedia({ type: "photo", media: MAIN_IMAGE, caption: `💰 *خرید رأی*\n\nبودجه: ${state.budget} همت\nخریده: ${state.boughtVotes}\n\nقیمت‌ها:\nاصولگرا: ۳ همت (${PARLIAMENT.principlists.corruption*100}٪)\nاصلاح‌طلب: ۵ همت (${PARLIAMENT.reformists.corruption*100}٪)\nمستقل: ۲ همت (${PARLIAMENT.independents.corruption*100}٪)`, parse_mode: "Markdown" }, { reply_markup: buyVoteMenu() });
        }
        
        if (data.startsWith("buy_")) {
            const parts = data.split("_");
            const faction = parts[1] === "prin" ? "principlists" : parts[1] === "ref" ? "reformists" : parts[1] === "ind" ? "independents" : null;
            const count = parts[1] === "all" ? parseInt(parts[2]) : 10;
            
            if (parts[1] === "all") {
                result = "💰 *خرید رأی*\n\n";
                for (const f of ["principlists", "reformists", "independents"]) {
                    const r = buyVotes(state, f, Math.floor(count / 3));
                    if (r.success) result += `${r.faction}: +${r.bought} رأی (${r.cost} همت)\n`;
                }
            } else if (faction) {
                const r = buyVotes(state, faction, count);
                result = r.success ? `💰 ${r.faction}: +${r.bought} رأی\n💰 هزینه: ${r.cost} همت\n🎯 کل: ${r.totalBought}` : r.msg;
            }
        }
        
        // نطق
        if (data === "bill_speech") {
            if (state.budget < 2) { await ctx.answerCallbackQuery("❌ بودجه کم!"); return; }
            state.budget -= 2;
            const ok = Math.random() < 0.6;
            state.extraVotes = (state.extraVotes || 0) + (ok ? 15 : -10);
            result = ok ? "🎭 نطق موفق! +۱۵ رأی" : "😬 نطق ضعیف! -۱۰ رأی";
        }
        
        // رأی من
        if (data === "bill_myvote") {
            return ctx.editMessageMedia({ type: "photo", media: MAIN_IMAGE, caption: "👤 *رأی تو*\n\nرأی تو ۵ برابر یک نماینده‌ست", parse_mode: "Markdown" }, { reply_markup: myVoteMenu() });
        }
        if (data === "myvote_yes") { state.playerVote = 5; result = "✅ رأی مثبت (+۵)"; }
        if (data === "myvote_no") { state.playerVote = -5; result = "❌ رأی منفی (-۵)"; }
        if (data === "myvote_abstain") { state.playerVote = 0; result = "🤐 ممتنع"; }
        
        // پایان
        if (result) {
            try {
                await ctx.editMessageMedia({ type: "photo", media: MAIN_IMAGE, caption: result, parse_mode: "Markdown" }, { reply_markup: mainMenu() });
            } catch (e) {
                await ctx.replyWithPhoto(MAIN_IMAGE, { caption: result, parse_mode: "Markdown", reply_markup: mainMenu() });
            }
        }
        
    } catch (error) {
        console.error("❌", error.message);
    }
});

// ============================================
// پیام متنی برای لایحه
// ============================================
bot.on("message:text", async (ctx) => {
    const state = getPlayer(ctx.from.id);
    if (!state) return;
    
    const us = userStates.get(ctx.from.id);
    if (us && us.waitingForBill) {
        const bill = analyzeBill(state, ctx.message.text);
        state.pendingBill = bill;
        state.playerVote = 0;
        state.extraVotes = 0;
        userStates.delete(ctx.from.id);
        
        let txt = `🏛️ *تحلیل لایحه*\n\n📝 "${bill.text}"\n\n━━━━━━━━\n🕌 رهبری: ${bill.leadershipSupport}٪\n💰 شخصی: ${bill.personalBenefit}٪\n🇮🇷 ملی: ${bill.nationalBenefit}٪\n\n🎯 شانس: ${bill.chance}٪\n📊 آرا: ${bill.total} | نیاز: ${VOTE_NEEDED}\n${bill.passed ? '✅ احتمال تصویب' : '❌ احتمال رد'}`;
        
        await ctx.replyWithPhoto(MAIN_IMAGE, {
            caption: txt,
            parse_mode: "Markdown",
            reply_markup: billActionMenu()
        });
    }
});

bot.start({ onStart: (info) => console.log(`✅ @${info.username} راه‌اندازی شد!`) });