// =============================================
// منطق بازی سیاسی ایران
// =============================================

const activeDebates = {};

// ============ شروع مناظره با رأی‌گیری ============
function startDebate(player1, player2, chatId) {
    const debateId = 'debate_' + Date.now();
    activeDebates[debateId] = {
        debateId,
        player1,
        player2,
        chatId,
        votes1: [],
        votes2: [],
        startTime: Date.now(),
        messageId: null
    };
    
    return { debateId };
}

// ============ رأی دادن توی مناظره ============
function voteInDebate(debateId, voterId, choice) {
    const debate = activeDebates[debateId];
    if (!debate) return { success: false, message: '❌ مناظره تموم شده!' };
    
    // چک کردن زمان
    if (Date.now() - debate.startTime > 60000) {
        return { success: false, message: '❌ وقت مناظره تموم شده!' };
    }
    
    // قبلاً رأی نداده باشه
    if (debate.votes1.includes(voterId) || debate.votes2.includes(voterId)) {
        return { success: false, message: '❌ قبلاً رأی دادی! فقط یه بار می‌تونی رأی بدی.' };
    }
    
    // نمی‌تونه به خودش رأی بده
    if (voterId === debate.player1.userId || voterId === debate.player2.userId) {
        return { success: false, message: '❌ شرکت‌کننده‌ها نمی‌تونن رأی بدن!' };
    }
    
    if (choice === 1) {
        debate.votes1.push(voterId);
        return { success: true, message: '✅ رأی به ' + debate.player1.name + ' ثبت شد!' };
    } else {
        debate.votes2.push(voterId);
        return { success: true, message: '✅ رأی به ' + debate.player2.name + ' ثبت شد!' };
    }
}

// ============ پایان مناظره و اعلام نتیجه ============
function finishDebate(debateId) {
    const debate = activeDebates[debateId];
    if (!debate) return null;
    
    const vote1Count = debate.votes1.length;
    const vote2Count = debate.votes2.length;
    
    let winner, loser;
    
    if (vote1Count > vote2Count) {
        winner = debate.player1;
        loser = debate.player2;
    } else if (vote2Count > vote1Count) {
        winner = debate.player2;
        loser = debate.player1;
    } else {
        // مساوی - قدرت تعیین می‌کنه
        const r = Math.random();
        winner = r < 0.5 ? debate.player1 : debate.player2;
        loser = winner === debate.player1 ? debate.player2 : debate.player1;
    }
    
    // آپدیت آمار
    winner.wins++;
    loser.losses++;
    winner.popularity = Math.min(100, winner.popularity + 15);
    loser.popularity = Math.max(0, loser.popularity - 10);
    winner.budget += 50;
    loser.budget = Math.max(0, loser.budget - 30);
    
    const totalVotes = vote1Count + vote2Count;
    
    const result = {
        winner,
        loser,
        vote1Count,
        vote2Count,
        totalVotes,
        message: '🏆 *نتیجه نهایی مناظره!*\n\n' +
                 '📊 *آرای مردمی:* (' + totalVotes + ' رأی)\n' +
                 '🗳️ ' + winner.emoji + ' *' + winner.name + '*: ' + (winner === debate.player1 ? vote1Count : vote2Count) + ' رأی ✅\n' +
                 '🗳️ ' + loser.emoji + ' *' + loser.name + '*: ' + (loser === debate.player1 ? vote1Count : vote2Count) + ' رأی ❌\n\n' +
                 '🎉 *' + winner.emoji + ' ' + winner.name + '* برنده شد!\n' +
                 '📊 محبوبیت +۱۵٪ | 💰 بودجه +۵۰ میلیارد\n\n' +
                 '💀 *' + loser.emoji + ' ' + loser.name + '* باخت!\n' +
                 '📊 محبوبیت -۱۰٪ | 💰 بودجه -۳۰ میلیارد'
    };
    
    delete activeDebates[debateId];
    return result;
}

// ============ مناظره ساده (بدون رأی‌گیری - برای جاهای دیگه) ============
function quickDebate(player1, player2) {
    const p1Power = player1.power + Math.floor(Math.random() * 50);
    const p2Power = player2.power + Math.floor(Math.random() * 50);
    
    if (p1Power > p2Power) {
        player1.wins++;
        player2.losses++;
        player1.popularity = Math.min(100, player1.popularity + 10);
        player2.popularity = Math.max(0, player2.popularity - 10);
        return { winner: player1, loser: player2, message: player1.emoji + ' *' + player1.name + '* برنده شد! 📊 +۱۰٪' };
    } else {
        player2.wins++;
        player1.losses++;
        player2.popularity = Math.min(100, player2.popularity + 10);
        player1.popularity = Math.max(0, player1.popularity - 10);
        return { winner: player2, loser: player1, message: player2.emoji + ' *' + player2.name + '* برنده شد! 📊 +۱۰٪' };
    }
}

// ============ ائتلاف ============
function negotiate(player1, player2) {
    // چک کن قبلاً ائتلاف نکرده باشن
    if (player1.alliances.includes(player2.userId)) {
        return { success: false, message: '❌ قبلاً با هم ائتلاف کردید!' };
    }
    
    player1.alliances.push(player2.userId);
    player2.alliances.push(player1.userId);
    player1.popularity = Math.min(100, player1.popularity + 5);
    player2.popularity = Math.min(100, player2.popularity + 5);
    player1.power += 10;
    player2.power += 10;
    
    return { 
        success: true, 
        message: '🤝 *ائتلاف شکل گرفت!*\n\n' +
                 player1.emoji + ' *' + player1.name + '* 🤝 ' + player2.emoji + ' *' + player2.name + '*\n\n' +
                 '📊 محبوبیت هر دو: +۵٪\n' +
                 '⚡ قدرت هر دو: +۱۰\n\n' +
                 '💪 *با هم قوی‌ترید!*'
    };
}

// ============ جنگ ============
function war(player1, player2, group) {
    const p1Power = player1.power + Math.floor(Math.random() * 100);
    const p2Power = player2.power + Math.floor(Math.random() * 100);
    
    let winner, loser;
    
    if (p1Power > p2Power) {
        winner = player1;
        loser = player2;
    } else {
        winner = player2;
        loser = player1;
    }
    
    winner.wins++;
    loser.losses++;
    winner.budget += 300;
    loser.budget = Math.max(0, loser.budget - 300);
    winner.power += 5;
    loser.power = Math.max(1, loser.power - 5);
    
    // تأثیر روی گروه
    if (group) {
        group.military = Math.max(0, group.military - 15);
        group.budget = Math.max(0, group.budget - 200);
        group.popularity = Math.max(0, group.popularity - 10);
        group.industry = Math.max(0, group.industry - 5);
    }
    
    return {
        winner,
        loser,
        message: '💣 *جنگ سیاسی!*\n\n' +
                 winner.emoji + ' *' + winner.name + '* ⚔️ ' + loser.emoji + ' *' + loser.name + '*\n\n' +
                 '🏆 *' + winner.name + '* پیروز شد!\n' +
                 '💰 +۳۰۰ میلیارد | ⚡ +۵ قدرت\n\n' +
                 '💀 *' + loser.name + '* شکست خورد!\n' +
                 '💰 -۳۰۰ میلیارد | ⚡ -۵ قدرت\n\n' +
                 '🏛️ *خسارت به گروه:*\n' +
                 '⚔️ نظامی -۱۵٪ | 💰 بودجه -۲۰۰ | 🏭 صنعت -۵٪'
    };
}

// ============ جاسوسی ============
function spy(player1, player2) {
    const r = Math.random();
    
    if (r < 0.7) {
        // موفق
        const stolenGold = Math.floor(player2.budget * 0.2);
        player1.budget += stolenGold;
        player2.budget = Math.max(0, player2.budget - stolenGold);
        
        return {
            success: true,
            message: '🕵️ *جاسوسی موفق!*\n\n' +
                     player1.emoji + ' *' + player1.name + '* از ' + player2.emoji + ' *' + player2.name + '* جاسوسی کرد!\n\n' +
                     '📋 *اطلاعات دزدیده شده:*\n' +
                     '💰 بودجه: ' + player2.budget + ' میلیارد\n' +
                     '⚡ قدرت: ' + player2.power + '\n' +
                     '📊 محبوبیت: ' + player2.popularity + '%\n' +
                     '🤝 ائتلاف‌ها: ' + player2.alliances.length + ' نفر\n\n' +
                     '💸 *' + stolenGold + ' میلیارد دزدیده شد!*'
        };
    } else {
        // لو رفت
        player1.popularity = Math.max(0, player1.popularity - 15);
        player1.budget = Math.max(0, player1.budget - 100);
        
        return {
            success: false,
            message: '🚨 *جاسوس لو رفت!*\n\n' +
                     player1.emoji + ' *' + player1.name + '* دستگیر شد!\n\n' +
                     '📊 محبوبیت -۱۵٪\n' +
                     '💰 جریمه -۱۰۰ میلیارد\n\n' +
                     player2.emoji + ' *' + player2.name + '*: "جاسوس فرستادن برام؟!" 😡'
        };
    }
}

// ============ تحریم ============
function sanction(player1, player2, group) {
    player2.budget = Math.max(0, Math.floor(player2.budget * 0.7));
    player2.popularity = Math.max(0, player2.popularity - 5);
    player1.power += 5;
    
    if (group) {
        group.oil = Math.max(0, group.oil - 80);
        group.budget = Math.max(0, group.budget - 150);
    }
    
    return {
        success: true,
        message: '🚫 *تحریم اقتصادی!*\n\n' +
                 player1.emoji + ' *' + player1.name + '* ' + player2.emoji + ' *' + player2.name + '* رو تحریم کرد!\n\n' +
                 '💔 *' + player2.name + ':*\n' +
                 '💰 بودجه -۳۰٪\n' +
                 '📊 محبوبیت -۵٪\n\n' +
                 '🏛️ *تأثیر روی گروه:*\n' +
                 '🛢️ نفت -۸۰\n' +
                 '💰 بودجه -۱۵۰\n\n' +
                 '⚡ *' + player1.name + '* قدرت +۵'
    };
}

module.exports = { 
    startDebate, voteInDebate, finishDebate, quickDebate,
    negotiate, war, spy, sanction, 
    activeDebates 
};