function debate(player1, player2) {
    const p1Power = player1.power + Math.floor(Math.random() * 50);
    const p2Power = player2.power + Math.floor(Math.random() * 50);
    
    if (p1Power > p2Power) {
        player1.wins++;
        player2.losses++;
        player1.popularity = Math.min(100, player1.popularity + 10);
        player2.popularity = Math.max(0, player2.popularity - 10);
        return { winner: player1, loser: player2, message: player1.emoji + ' *' + player1.name + '* برنده مناظره شد! 📊 +۱۰٪ محبوبیت' };
    } else {
        player2.wins++;
        player1.losses++;
        player2.popularity = Math.min(100, player2.popularity + 10);
        player1.popularity = Math.max(0, player1.popularity - 10);
        return { winner: player2, loser: player1, message: player2.emoji + ' *' + player2.name + '* برنده مناظره شد! 📊 +۱۰٪ محبوبیت' };
    }
}

function negotiate(player1, player2) {
    player1.alliances.push(player2.userId);
    player2.alliances.push(player1.userId);
    player1.popularity = Math.min(100, player1.popularity + 5);
    player2.popularity = Math.min(100, player2.popularity + 5);
    return { success: true, message: '✅ ائتلاف شکل گرفت!\n📊 محبوبیت هر دو +۵٪' };
}

function war(player1, player2, group) {
    const p1Power = player1.power + Math.floor(Math.random() * 100);
    const p2Power = player2.power + Math.floor(Math.random() * 100);
    
    if (p1Power > p2Power) {
        player1.wins++;
        player2.losses++;
        player1.budget += 200;
        player2.budget = Math.max(0, player2.budget - 200);
        if (group) {
            group.military = Math.max(0, group.military - 10);
            group.budget = Math.max(0, group.budget - 100);
        }
        return { winner: player1, loser: player2, message: '💀 ' + player2.emoji + ' *' + player2.name + '* شکست خورد!\n💰 ' + player1.name + ' +۲۰۰ میلیارد' };
    } else {
        player2.wins++;
        player1.losses++;
        player2.budget += 200;
        player1.budget = Math.max(0, player1.budget - 200);
        if (group) {
            group.military = Math.max(0, group.military - 10);
            group.budget = Math.max(0, group.budget - 100);
        }
        return { winner: player2, loser: player1, message: '💀 ' + player1.emoji + ' *' + player1.name + '* شکست خورد!\n💰 ' + player2.name + ' +۲۰۰ میلیارد' };
    }
}

function spy(player1, player2) {
    const r = Math.random();
    if (r < 0.7) {
        player1.budget += 100;
        player2.budget = Math.max(0, player2.budget - 50);
        return { success: true, message: '🕵️ جاسوسی موفق!\n📋 اطلاعات ' + player2.name + ':\n💰 بودجه: ' + player2.budget + '\n⚡ قدرت: ' + player2.power + '\n📊 محبوبیت: ' + player2.popularity + '%' };
    } else {
        player1.popularity = Math.max(0, player1.popularity - 10);
        return { success: false, message: '🚨 لو رفت! جاسوس دستگیر شد!\n📊 محبوبیت -۱۰٪' };
    }
}

function sanction(player1, player2, group) {
    player2.budget = Math.max(0, Math.floor(player2.budget * 0.7));
    if (group) {
        group.oil = Math.max(0, group.oil - 50);
    }
    return { success: true, message: '🚫 ' + player2.emoji + ' *' + player2.name + '* تحریم شد!\n💰 بودجه -۳۰٪\n🛢️ نفت گروه -۵۰' };
}

module.exports = { debate, negotiate, war, spy, sanction };