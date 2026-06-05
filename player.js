const config = require('./config');

const players = {};

function createPlayer(chatId) {
    players[chatId] = JSON.parse(JSON.stringify(config.defaultPlayer));
    return players[chatId];
}

function getPlayer(chatId) {
    return players[chatId] || null;
}

function formatStatus(p) {
    const loc = config.images.locations[p.location];
    
    return `
👤 *${p.name}*
⚡ سطح: ${p.level} | تجربه: ${p.xp}
❤️ جان: ${p.hp}/${p.maxHp}
⚔️ حمله: ${p.attack} | 🛡️ دفاع: ${p.defense}

🎒 *اینونتوری:*
🪵 چوب: ${p.inventory.wood}
🪨 سنگ: ${p.inventory.stone}
🍖 گوشت: ${p.inventory.meat}
💧 آب: ${p.inventory.water}
🦴 پوست: ${p.inventory.skin}
⛏️ آهن: ${p.inventory.iron}
👑 طلا: ${p.inventory.gold}

🏠 خونه: ${p.equipment.house || 'نداری'}
🗡️ اسلحه: ${p.equipment.weapon || 'نداری'}
🛡️ زره: ${p.equipment.armor || 'نداری'}
📍 مکان: ${loc.emoji} ${loc.name}
🏆 شکست‌خورده: ${p.enemiesDefeated}
    `;
}

function checkLevelUp(p) {
    const needed = p.level * 20;
    if (p.xp >= needed) {
        p.level++;
        p.maxHp += 20;
        p.hp = p.maxHp;
        p.attack += 2;
        p.defense += 1;
        p.xp -= needed;
        return true;
    }
    return false;
}

module.exports = { players, createPlayer, getPlayer, formatStatus, checkLevelUp };