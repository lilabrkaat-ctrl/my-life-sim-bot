// parliament.js - سیستم کامل مجلس شورای اسلامی

const { PARLIAMENT, VOTE_NEEDED } = require("./config");

// ============================================
// تحلیل هوشمند لایحه
// ============================================
function analyzeBill(state, text) {
    let leadershipSupport = 50;
    let personalBenefit = 50;
    let nationalBenefit = 50;
    let topic = "general";
    
    const lowerText = text.toLowerCase();
    
    // تشخیص موضوع
    if (lowerText.includes("حمله") || lowerText.includes("جنگ") || lowerText.includes("اعلان")) {
        topic = "war";
        if (lowerText.includes("اسرائیل") || lowerText.includes("صهیونیست")) {
            leadershipSupport = 85;
            nationalBenefit = 60;
            personalBenefit = 15;
        } else if (lowerText.includes("آمریکا")) {
            leadershipSupport = 30;
            nationalBenefit = 20;
            personalBenefit = 10;
        } else {
            leadershipSupport = 50;
            nationalBenefit = 40;
            personalBenefit = 20;
        }
    } else if (lowerText.includes("مذاکره") || lowerText.includes("صلح") || lowerText.includes("توافق")) {
        topic = "peace";
        if (lowerText.includes("آمریکا")) {
            leadershipSupport = 25;
            nationalBenefit = 70;
            personalBenefit = 30;
        } else {
            leadershipSupport = 60;
            nationalBenefit = 75;
            personalBenefit = 40;
        }
    } else if (lowerText.includes("یارانه") || lowerText.includes("پول") || lowerText.includes("بودجه")) {
        topic = "economy";
        leadershipSupport = 50;
        nationalBenefit = 35;
        personalBenefit = 85;
    } else if (lowerText.includes("fatf") || lowerText.includes("تحریم")) {
        topic = "economy";
        leadershipSupport = 40;
        nationalBenefit = 70;
        personalBenefit = 25;
    } else if (lowerText.includes("تعطیل") || lowerText.includes("شنبه")) {
        topic = "social";
        leadershipSupport = 10;
        nationalBenefit = 30;
        personalBenefit = 90;
    } else if (lowerText.includes("بنزین") || lowerText.includes("قیمت")) {
        topic = "economy";
        leadershipSupport = 30;
        nationalBenefit = 40;
        personalBenefit = 60;
    } else if (lowerText.includes("اینترنت") || lowerText.includes("فیلتر")) {
        topic = "social";
        leadershipSupport = 40;
        nationalBenefit = 60;
        personalBenefit = 50;
    }
    
    const chance = Math.floor((leadershipSupport + personalBenefit + nationalBenefit) / 3);
    
    const principlistsSupport = Math.floor(state.parliament.principlists.count * (leadershipSupport / 100));
    const reformistsSupport = Math.floor(state.parliament.reformists.count * (nationalBenefit / 100));
    const independentsSupport = Math.floor(state.parliament.independents.count * (personalBenefit / 100));
    const totalSupport = principlistsSupport + reformistsSupport + independentsSupport;
    
    return {
        text,
        topic,
        leadershipSupport,
        personalBenefit,
        nationalBenefit,
        chance,
        principlistsSupport,
        reformistsSupport,
        independentsSupport,
        totalSupport,
        needed: state.voteNeeded,
        passed: totalSupport >= state.voteNeeded
    };
}

// ============================================
// رأی‌گیری نهایی
// ============================================
function runFinalVote(state, bill, playerVote = 0, boughtVotes = 0) {
    let principlists = bill.principlistsSupport;
    let reformists = bill.reformistsSupport;
    let independents = bill.independentsSupport;
    
    // اضافه کردن رأی‌های خریده شده
    const extraPerFaction = Math.floor(boughtVotes / 3);
    principlists += extraPerFaction;
    reformists += extraPerFaction;
    independents += extraPerFaction;
    
    // محدود به تعداد واقعی
    principlists = Math.min(state.parliament.principlists.count, principlists);
    reformists = Math.min(state.parliament.reformists.count, reformists);
    independents = Math.min(state.parliament.independents.count, independents);
    
    // رأی شخصی رئیس‌جمهور (۵ رأی)
    const totalSupport = principlists + reformists + independents + playerVote;
    
    const details = {
        principlists: { support: principlists, oppose: state.parliament.principlists.count - principlists },
        reformists: { support: reformists, oppose: state.parliament.reformists.count - reformists },
        independents: { support: independents, oppose: state.parliament.independents.count - independents },
        playerVote: playerVote,
        boughtVotes: boughtVotes
    };
    
    return {
        support: totalSupport,
        oppose: 290 - totalSupport,
        needed: state.voteNeeded,
        passed: totalSupport >= state.voteNeeded,
        details: details
    };
}

// ============================================
// خرید رأی
// ============================================
function buyVotes(state, faction, count) {
    const f = state.parliament[faction];
    if (!f) return { success: false, msg: "جناح نامعتبر!" };
    
    const totalCost = f.basePrice * count;
    if (state.budget < totalCost) {
        return { success: false, msg: `❌ بودجه کم! نیاز: ${totalCost} همت` };
    }
    
    state.budget -= totalCost;
    
    let bought = 0;
    for (let i = 0; i < count; i++) {
        if (Math.random() < f.corruption) bought++;
    }
    
    state.boughtVotes += bought;
    state.voteLeakChance = Math.min(100, state.voteLeakChance + (bought * 2));
    state.corruption = Math.min(100, state.corruption + bought);
    
    return {
        success: true,
        bought: bought,
        cost: totalCost,
        totalBought: state.boughtVotes,
        leakChance: state.voteLeakChance,
        tried: count,
        failed: count - bought
    };
}

// ============================================
// نطق
// ============================================
function giveSpeech(state) {
    if (state.budget < 2) return { success: false, msg: "❌ بودجه کم! (نیاز: ۲ همت)" };
    
    state.budget -= 2;
    const chance = 60;
    const success = Math.random() * 100 < chance;
    
    if (success) {
        return { success: true, msg: "🎭 نطق موفق! +۱۵ رأی", votes: 15, cost: 2 };
    } else {
        return { success: true, msg: "🎭 نطق شکست خورد! -۱۰ رأی", votes: -10, cost: 2 };
    }
}

// ============================================
// منوی مجلس
// ============================================
function parliamentMenu() {
    const { InlineKeyboard } = require("grammy");
    return new InlineKeyboard()
        .text("📝 ارائه لایحه", "parliament_new_bill").text("📊 وضعیت", "parliament_status").text("🔙 کشور", "menu_domestic");
}

// ============================================
// متن تحلیل لایحه
// ============================================
function getBillReport(bill) {
    return `🏛️ *تحلیل لایحه*\n\n` +
        `📝 *"${bill.text}"*\n\n` +
        `━━━━━━━━━━━━━━━━\n` +
        `🕌 نظر رهبری: ${bill.leadershipSupport}٪ ${bill.leadershipSupport > 60 ? '✅' : bill.leadershipSupport < 30 ? '❌' : '🤐'}\n` +
        `💰 منفعت شخصی: ${bill.personalBenefit}٪\n` +
        `🇮🇷 منفعت ملی: ${bill.nationalBenefit}٪\n\n` +
        `🎯 شانس تصویب: ${bill.chance}٪\n\n` +
        `📊 *پیش‌بینی آرا:*\n` +
        `• اصولگرا: ${bill.principlistsSupport} | اصلاح‌طلب: ${bill.reformistsSupport} | مستقل: ${bill.independentsSupport}\n` +
        `• کل: ${bill.totalSupport} | نیاز: ${bill.needed}\n\n` +
        `${bill.passed ? '✅ احتمال تصویب!' : '❌ احتمال رد! نیاز به خرید رأی'}`;
}

// ============================================
// متن نتیجه رأی‌گیری
// ============================================
function getVoteResultText(bill, vote, state) {
    const d = vote.details;
    let text = `🗳️ *نتیجه رأی‌گیری*\n\n`;
    text += `📝 *"${bill.text}"*\n\n`;
    text += `━━━━━━━━━━━━━━━━\n`;
    text += `📊 *جزئیات آرا:*\n`;
    text += `• اصولگرا: ✅${d.principlists.support} ❌${d.principlists.oppose}\n`;
    text += `• اصلاح‌طلب: ✅${d.reformists.support} ❌${d.reformists.oppose}\n`;
    text += `• مستقل: ✅${d.independents.support} ❌${d.independents.oppose}\n`;
    if (d.playerVote !== 0) text += `• رأی تو: ${d.playerVote > 0 ? '✅' : '❌'} ${Math.abs(d.playerVote)}\n`;
    if (d.boughtVotes > 0) text += `• رأی خریده: ✅${d.boughtVotes}\n`;
    text += `\n━━━━━━━━━━━━━━━━\n`;
    text += `✅ کل موافق: ${vote.support}\n`;
    text += `❌ کل مخالف: ${vote.oppose}\n`;
    text += `🎯 نیاز: ${vote.needed}\n\n`;
    
    if (vote.passed) {
        text += `🎉 *تصویب شد!* با اختلاف ${vote.support - vote.needed} رأی`;
    } else {
        text += `❌ *رد شد!* ${vote.needed - vote.support} رأی کم آورد`;
    }
    
    // لو رفتن
    if (state.voteLeakChance > 0 && Math.random() * 100 < state.voteLeakChance) {
        state.popularity -= 15;
        state.corruption += 10;
        text += "\n\n🚨 *لو رفت!* رسوایی خرید رأی!\n👥 محبوبیت -۱۵٪";
    }
    
    return text;
}

// ============================================
// خروجی
// ============================================
module.exports = {
    analyzeBill,
    runFinalVote,
    buyVotes,
    giveSpeech,
    parliamentMenu,
    getBillReport,
    getVoteResultText
};