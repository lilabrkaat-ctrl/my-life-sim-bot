const { Bot, InlineKeyboard } = require("grammy");
const { TOKEN, COUNTRIES, PARLIAMENT, VOTE_NEEDED } = require("./config");
const { IranState, getPlayer, setPlayer } = require("./state");

const bot = new Bot(TOKEN);
const userStates = new Map();
const MAIN_IMAGE = "AgACAgQAAxkBAAEq26RqM6Zgod1-3-pP1RpqVDXkdZfz2gACsw5rGwPDmVFZ4np59GoqLgEAAwIAA3gAAzwE";

// ============================================
// تحلیل لایحه
// ============================================
function analyzeBill(state, text) {
    let ls = 50, pb = 50, nb = 50, topic = "general";
    const t = text.toLowerCase();
    
    if (t.includes("حمله") || t.includes("جنگ") || t.includes("اعلان")) {
        topic = "war";
        if (t.includes("اسرائیل") || t.includes("صهیونیست")) { ls = 85; nb = 60; pb = 15; }
        else if (t.includes("آمریکا")) { ls = 30; nb = 20; pb = 10; }
        else { ls = 50; nb = 40; pb = 20; }
    } else if (t.includes("مذاکره") || t.includes("صلح") || t.includes("توافق")) {
        topic = "peace";
        if (t.includes("آمریکا")) { ls = 25; nb = 70; pb = 30; }
        else if (t.includes("اسرائیل")) { ls = 30; nb = 50; pb = 20; }
        else { ls = 60; nb = 75; pb = 40; }
    } else if (t.includes("یارانه") || t.includes("پول") || t.includes("بودجه")) {
        topic = "economy"; ls = 50; nb = 35; pb = 85;
    } else if (t.includes("fatf") || t.includes("تحریم")) {
        topic = "economy"; ls = 40; nb = 70; pb = 25;
    } else if (t.includes("اینترنت") || t.includes("فیلتر")) {
        topic = "social"; ls = 40; nb = 60; pb = 50;
    } else if (t.includes("بنزین") || t.includes("قیمت")) {
        topic = "economy"; ls = 30; nb = 40; pb = 60;
    } else if (t.includes("تعطیل") || t.includes("شنبه")) {
        topic = "social"; ls = 10; nb = 30; pb = 90;
    }
    
    const chance = Math.floor((ls + pb + nb) / 3);
    const prin = Math.floor(PARLIAMENT.principlists.count * (ls / 100));
    const ref = Math.floor(PARLIAMENT.reformists.count * (nb / 100));
    const ind = Math.floor(PARLIAMENT.independents.count * (pb / 100));
    const total = prin + ref + ind;
    
    return { text, topic, ls, pb, nb, chance, prin, ref, ind, total, needed: VOTE_NEEDED, passed: total >= VOTE_NEEDED };
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
// پیدا کردن کشور هدف
// ============================================
function findTargetCountry(text) {
    for (const c of COUNTRIES) {
        if (text.includes(c.name)) return c;
    }
    return null;
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

function attackMenu(code) {
    const c = COUNTRIES.find(x => x.code === code);
    return new InlineKeyboard()
        .text("🚀 موشک", `do_missile_${code}`).text("🛸 پهپاد", `do_drone_${code}`).text("💻 سایبری", `do_cyber_${code}`).row()
        .text("⚔️ جنگ تمام‌عیار", `do_war_${code}`).row()
        .text("🔙 منوی اصلی", "main_menu");
}

function negotiateMenu(code) {
    return new InlineKeyboard()
        .text("کارشناس (۰.۵)", `neg_expert_${code}`).text("سفیر (۱)", `neg_ambassador_${code}`).row()
        .text("وزیر (۳)", `neg_minister_${code}`).text("رئیس‌جمهور (۸)", `neg_president_${code}`).row()
        .text("🔙 منوی اصلی", "main_menu");
}

// ============================================
// /start
// ============================================
bot.command("start", async (ctx) => {
    const userId = ctx.from.id;
    let state = getPlayer(userId);
    
    if (state) {
        return ctx.replyWithPhoto(MAIN_IMAGE, {
            caption: `🏛️ *${state.name}*! بازی قبلیت هنوز فعاله!\n\n💰 ${state.budget} همت | 👥 ${state.popularity}٪`,
            parse_mode: "Markdown",
            reply_markup: mainMenu()
        });
    }
    
    state = new IranState(ctx.from.first_name);
    setPlayer(userId, state);
    
    await ctx.replyWithPhoto(MAIN_IMAGE, {
        caption: `🏛️ *${state.name}* عزیز، شما رئیس‌جمهور ایران هستید!\n\n💰 ${state.budget} همت | 👥 ${state.popularity}٪\n\nبرو به مجلس و لایحه بده!`,
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
            return ctx.editMessageMedia({ type: "photo", media: MAIN_IMAGE, caption: `🏛️ *منوی اصلی*\n\n💰 ${state.budget} | 👥 ${state.popularity}٪`, parse_mode: "Markdown" }, { reply_markup: mainMenu() });
        }
        if (data === "menu_parliament") {
            let txt = `🏛️ *مجلس*\n\n${PARLIAMENT.principlists.name}: ${PARLIAMENT.principlists.count}\n${PARLIAMENT.reformists.name}: ${PARLIAMENT.reformists.count}\n${PARLIAMENT.independents.name}: ${PARLIAMENT.independents.count}\n\n🎯 نیاز: ${VOTE_NEEDED} | 💰 خریده: ${state.boughtVotes}\n🕵️ شانس لو رفتن: ${state.voteLeakChance}٪`;
            return ctx.editMessageMedia({ type: "photo", media: MAIN_IMAGE, caption: txt, parse_mode: "Markdown" }, { reply_markup: parliamentMenu() });
        }
        if (data === "menu_status") {
            let txt = `📊 *وضعیت*\n\n💰 بودجه: ${state.budget} همت\n👥 محبوبیت: ${state.popularity}٪\n💰 فساد: ${state.corruption}٪\n🚀 موشک: ${state.missiles}\n🛸 پهپاد: ${state.drones}\n🔒 تحریم: ${state.sanctions}\n💧 آب: ${state.water}٪\n🧠 فرار: ${state.brain}٪`;
            return ctx.editMessageMedia({ type: "photo", media: MAIN_IMAGE, caption: txt, parse_mode: "Markdown" }, { reply_markup: mainMenu() });
        }
        if (data === "parliament_status") {
            let txt = `🏛️ *وضعیت مجلس*\n\n${PARLIAMENT.principlists.name}: ${PARLIAMENT.principlists.count} نفر | قیمت: ${PARLIAMENT.principlists.basePrice} همت | شانس رشوه: ${PARLIAMENT.principlists.corruption*100}٪\n\n${PARLIAMENT.reformists.name}: ${PARLIAMENT.reformists.count} نفر | قیمت: ${PARLIAMENT.reformists.basePrice} همت | شانس رشوه: ${PARLIAMENT.reformists.corruption*100}٪\n\n${PARLIAMENT.independents.name}: ${PARLIAMENT.independents.count} نفر | قیمت: ${PARLIAMENT.independents.basePrice} همت | شانس رشوه: ${PARLIAMENT.independents.corruption*100}٪`;
            return ctx.editMessageMedia({ type: "photo", media: MAIN_IMAGE, caption: txt, parse_mode: "Markdown" }, { reply_markup: parliamentMenu() });
        }
        
        // ارائه لایحه
        if (data === "parliament_new_bill") {
            userStates.set(ctx.from.id, { waitingForBill: true });
            return ctx.editMessageMedia({ type: "photo", media: MAIN_IMAGE, caption: `📝 *ارائه لایحه*\n\nلایحه‌ات رو بنویس...\n\nمثال:\n• حمله به اسرائیل\n• مذاکره با آمریکا\n• افزایش یارانه\n• اینترنت آزاد\n• قبول FATF`, parse_mode: "Markdown" }, { reply_markup: new InlineKeyboard().text("🔙 انصراف", "menu_parliament") });
        }
        
        // برگشت به لایحه
        if (data === "bill_back") {
            if (state.pendingBill) {
                const bill = state.pendingBill;
                let txt = `🏛️ *تحلیل لایحه*\n\n📝 "${bill.text}"\n\n━━━━━━━━\n🕌 رهبری: ${bill.ls}٪\n💰 شخصی: ${bill.pb}٪\n🇮🇷 ملی: ${bill.nb}٪\n\n🎯 شانس: ${bill.chance}٪\n📊 آرا: ${bill.total} | نیاز: ${VOTE_NEEDED}\n${bill.passed ? '✅ احتمال تصویب' : '❌ احتمال رد'}`;
                return ctx.editMessageMedia({ type: "photo", media: MAIN_IMAGE, caption: txt, parse_mode: "Markdown" }, { reply_markup: billActionMenu() });
            }
            return ctx.editMessageMedia({ type: "photo", media: MAIN_IMAGE, caption: "🏛️ *مجلس*", parse_mode: "Markdown" }, { reply_markup: parliamentMenu() });
        }
        
        // رأی‌گیری
        if (data === "bill_vote") {
            if (!state.pendingBill) { await ctx.answerCallbackQuery("❌ اول لایحه بده!"); return; }
            
            const bill = state.pendingBill;
            const vote = runVote(state, bill);
            const d = vote.details;
            
            result = `🗳️ *نتیجه رأی‌گیری*\n\n📝 "${bill.text}"\n\n`;
            result += `اصولگرا: ✅${d.principlists.support} ❌${d.principlists.oppose}\n`;
            result += `اصلاح‌طلب: ✅${d.reformists.support} ❌${d.reformists.oppose}\n`;
            result += `مستقل: ✅${d.independents.support} ❌${d.independents.oppose}\n`;
            if (d.playerVote !== 0) result += `👤 رأی تو: ${d.playerVote > 0 ? '✅' : '❌'} ${Math.abs(d.playerVote)}\n`;
            if (d.boughtVotes > 0) result += `💰 خریده: ✅${d.boughtVotes}\n`;
            result += `\n━━━━━━━━\n✅ ${vote.support} | ❌ ${vote.oppose} | 🎯 ${VOTE_NEEDED}\n\n${vote.passed ? '🎉 *تصویب شد!*' : '❌ *رد شد!*'}`;
            
            // لو رفتن خرید رأی
            if (state.voteLeakChance > 0 && Math.random() * 100 < state.voteLeakChance) {
                state.popularity -= 15;
                state.corruption += 10;
                state.voteLeakChance = 0;
                result += "\n\n🚨 *لو رفت!* رسوایی خرید رأی!\n👥 محبوبیت -۱۵٪";
            }
            
            // اجرای لایحه تصویب شده
            if (vote.passed) {
                const topic = bill.topic;
                const text = bill.text;
                
                // حمله
                if (topic === "war") {
                    const target = findTargetCountry(text);
                    if (target) {
                        result += `\n\n⚔️ *آماده‌سازی حمله به ${target.emoji} ${target.name}...*\nنوع حمله رو انتخاب کن:`;
                        state.pendingBill = null; state.playerVote = 0; state.extraVotes = 0; state.boughtVotes = 0;
                        await ctx.editMessageMedia({ type: "photo", media: MAIN_IMAGE, caption: result, parse_mode: "Markdown" }, { reply_markup: attackMenu(target.code) });
                        return;
                    }
                }
                
                // مذاکره
                if (topic === "peace") {
                    const target = findTargetCountry(text);
                    if (target) {
                        result += `\n\n🤝 *مذاکره با ${target.emoji} ${target.name}*\nسطح مذاکره رو انتخاب کن:`;
                        state.pendingBill = null; state.playerVote = 0; state.extraVotes = 0; state.boughtVotes = 0;
                        await ctx.editMessageMedia({ type: "photo", media: MAIN_IMAGE, caption: result, parse_mode: "Markdown" }, { reply_markup: negotiateMenu(target.code) });
                        return;
                    }
                }
                
                // یارانه
                if (text.includes("یارانه")) {
                    state.budget -= 15;
                    state.popularity += 5;
                    result += "\n\n💰 یارانه افزایش یافت! (+۵٪ محبوبیت)";
                }
                
                // اینترنت
                if (text.includes("اینترنت")) {
                    state.internet = !state.internet;
                    state.popularity += state.internet ? -5 : 8;
                    result += state.internet ? "\n\n🚫 اینترنت فیلتر شد" : "\n\n✅ اینترنت آزاد شد";
                }
                
                // FATF
                if (text.toLowerCase().includes("fatf")) {
                    state.sanctions = Math.max(0, state.sanctions - 20);
                    state.popularity -= 3;
                    result += "\n\n✅ FATF پذیرفته شد! تحریم -۲۰";
                }
            }
            
            state.pendingBill = null; state.playerVote = 0; state.extraVotes = 0;
        }
        
        // خرید رأی
        if (data === "bill_buy") {
            return ctx.editMessageMedia({ type: "photo", media: MAIN_IMAGE, caption: `💰 *خرید رأی*\n\nبودجه: ${state.budget} همت\nخریده: ${state.boughtVotes}\n\n📊 قیمت‌ها:\nاصولگرا: ۳ همت (${PARLIAMENT.principlists.corruption*100}٪)\nاصلاح‌طلب: ۵ همت (${PARLIAMENT.reformists.corruption*100}٪)\nمستقل: ۲ همت (${PARLIAMENT.independents.corruption*100}٪)`, parse_mode: "Markdown" }, { reply_markup: buyVoteMenu() });
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
            if (state.budget < 2) { await ctx.answerCallbackQuery("❌ بودجه کم! (نیاز: ۲ همت)"); return; }
            state.budget -= 2;
            const ok = Math.random() < 0.6;
            state.extraVotes = (state.extraVotes || 0) + (ok ? 15 : -10);
            result = ok ? "🎭 نطق موفق! +۱۵ رأی" : "😬 نطق ضعیف! -۱۰ رأی";
        }
        
        // رأی من
        if (data === "bill_myvote") {
            return ctx.editMessageMedia({ type: "photo", media: MAIN_IMAGE, caption: "👤 *رأی تو*\n\nبه عنوان رئیس‌جمهور، رأی تو ۵ برابر یک نماینده‌ست", parse_mode: "Markdown" }, { reply_markup: myVoteMenu() });
        }
        if (data === "myvote_yes") { state.playerVote = 5; result = "✅ رأی مثبت (+۵)"; }
        if (data === "myvote_no") { state.playerVote = -5; result = "❌ رأی منفی (-۵)"; }
        if (data === "myvote_abstain") { state.playerVote = 0; result = "🤐 ممتنع"; }
        
        // حمله
        if (data.startsWith("do_missile_")) {
            const code = data.split("_")[2];
            const c = state.findCountry(code);
            if (c) {
                if (state.missiles < 20) { await ctx.answerCallbackQuery("❌ موشک کم!"); return; }
                state.missiles -= 20;
                c.relation = Math.max(-100, c.relation - 30);
                state.popularity += 5;
                result = `🚀 *حمله موشکی به ${c.emoji} ${c.name}!*\n💥 ۲۰ موشک\n📉 روابط -۳۰\n👥 محبوبیت +۵٪`;
            }
        }
        if (data.startsWith("do_drone_")) {
            const code = data.split("_")[2];
            const c = state.findCountry(code);
            if (c) {
                if (state.drones < 50) { await ctx.answerCallbackQuery("❌ پهپاد کم!"); return; }
                state.drones -= 50;
                c.relation = Math.max(-100, c.relation - 20);
                state.popularity += 3;
                result = `🛸 *حمله پهپادی به ${c.emoji} ${c.name}!*\n💥 ۵۰ پهپاد`;
            }
        }
        if (data.startsWith("do_cyber_")) {
            const code = data.split("_")[2];
            const c = state.findCountry(code);
            if (c) {
                c.relation = Math.max(-100, c.relation - 10);
                result = `💻 *حمله سایبری به ${c.emoji} ${c.name}!*`;
            }
        }
        if (data.startsWith("do_war_")) {
            const code = data.split("_")[2];
            const c = state.findCountry(code);
            if (c) {
                if (state.budget < 80) { await ctx.answerCallbackQuery("❌ بودجه کم! (نیاز: ۸۰ همت)"); return; }
                state.budget -= 80;
                state.missiles -= 100;
                state.drones -= 300;
                c.relation = -100;
                state.popularity += 10;
                result = `⚔️ *اعلان جنگ به ${c.emoji} ${c.name}!*\n💰 -۸۰ همت\n🚀 -۱۰۰ موشک\n🛸 -۳۰۰ پهپاد`;
            }
        }
        
        // مذاکره
        if (data.startsWith("neg_")) {
            const parts = data.split("_");
            const level = parts[1];
            const code = parts[2];
            const c = state.findCountry(code);
            if (!c) return;
            
            const costs = { expert: 0.5, ambassador: 1, minister: 3, president: 8 };
            const boosts = { expert: 3, ambassador: 7, minister: 12, president: 20 };
            
            if (state.budget < costs[level]) { await ctx.answerCallbackQuery(`❌ بودجه کم! نیاز: ${costs[level]} همت`); return; }
            
            state.budget -= costs[level];
            c.relation = Math.min(100, c.relation + boosts[level]);
            result = `🤝 *مذاکره با ${c.emoji} ${c.name}*\n📊 سطح: ${level}\n📈 روابط +${boosts[level]}\n💰 هزینه: ${costs[level]} همت`;
        }
        
        // پایان
        if (result) {
            const short = `\n\n💰 ${state.budget} | 👥 ${state.popularity}٪`;
            try {
                await ctx.editMessageMedia({ type: "photo", media: MAIN_IMAGE, caption: result + short, parse_mode: "Markdown" }, { reply_markup: mainMenu() });
            } catch (e) {
                await ctx.replyWithPhoto(MAIN_IMAGE, { caption: result + short, parse_mode: "Markdown", reply_markup: mainMenu() });
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
        
        let txt = `🏛️ *تحلیل لایحه*\n\n📝 "${bill.text}"\n\n━━━━━━━━\n🕌 رهبری: ${bill.ls}٪\n💰 شخصی: ${bill.pb}٪\n🇮🇷 ملی: ${bill.nb}٪\n\n🎯 شانس: ${bill.chance}٪\n📊 آرا: ${bill.total} | نیاز: ${VOTE_NEEDED}\n${bill.passed ? '✅ احتمال تصویب' : '❌ احتمال رد'}`;
        
        await ctx.replyWithPhoto(MAIN_IMAGE, {
            caption: txt,
            parse_mode: "Markdown",
            reply_markup: billActionMenu()
        });
    }
});

// ============================================
bot.catch((err) => console.error("❌", err.message));
bot.start({ onStart: (info) => console.log(`✅ @${info.username} راه‌اندازی شد!`) });