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
    const pHpBar = '█'.repeat(Math.max(0, Math.floor(p.hp / p.maxHp * 10))) + '░'.repeat(Math.max(0, 10 - Math.floor(p.hp / p.maxHp * 10)));
    
    return `
👤 *${p.name}* | ⭐ ${p.level} | ☀️ روز ${p.day}
❤️ ${pHpBar} ${p.hp}/${p.maxHp}
⚔️ ${p.attack} | 🛡️ ${p.defense} | ✨ ${p.xp}/${p.level * 20}

📍 ${loc.emoji} ${loc.name}

🎒 *اینونتوری:*
🪵${p.inventory.wood} 🪨${p.inventory.stone} 🍖${p.inventory.meat} 💧${p.inventory.water}
🦴${p.inventory.skin} ⛏️${p.inventory.iron} 👑${p.inventory.gold}

🛡️ *تجهیزات:*
🏠 ${p.equipment.house || '❌'} | 🗡️ ${p.equipment.weapon || '❌'} | 🛡️ ${p.equipment.armor || '❌'}
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