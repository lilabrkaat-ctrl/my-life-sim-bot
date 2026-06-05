const config = require('./config');
const players = {};

function createPlayer(chatId) {
    players[chatId] = JSON.parse(JSON.stringify(config.defaultPlayer));
    players[chatId].npcEncounters = {};
    players[chatId].seduced = {};
    players[chatId].prison = [];
    players[chatId].prisonRelations = {};
    players[chatId].score = 0;
    players[chatId].unlocked = {
        locations: ['village'],
        enemies: ['wolf'],
        npcs: [],
        recipes: []
    };
    return players[chatId];
}

function getPlayer(chatId) {
    return players[chatId] || null;
}

function addScore(player, amount) {
    player.score = (player.score || 0) + amount;
    checkUnlocks(player);
}

function checkUnlocks(player) {
    if (!player.unlocked) player.unlocked = { locations: ['village'], enemies: ['wolf'], npcs: [], recipes: [] };
    
    // باز کردن مکان‌ها با امتیاز
    if (player.score >= 50 && !player.unlocked.locations.includes('forest')) {
        player.unlocked.locations.push('forest');
        player.unlockedMessage = '🌲 *جنگل انبوه* باز شد!';
    }
    if (player.score >= 150 && !player.unlocked.locations.includes('river')) {
        player.unlocked.locations.push('river');
        player.unlockedMessage = '🌊 *رودخانه* باز شد!';
    }
    if (player.score >= 300 && !player.unlocked.locations.includes('mountain')) {
        player.unlocked.locations.push('mountain');
        player.unlockedMessage = '⛰️ *کوهستان سنگی* باز شد!';
    }
    if (player.score >= 500 && !player.unlocked.locations.includes('plain')) {
        player.unlocked.locations.push('plain');
        player.unlockedMessage = '🌾 *دشت باز* باز شد!';
    }
    if (player.score >= 800 && !player.unlocked.locations.includes('cave')) {
        player.unlocked.locations.push('cave');
        player.unlockedMessage = '🕳️ *غار تاریک* باز شد!';
    }
    if (player.score >= 1200 && !player.unlocked.locations.includes('desert')) {
        player.unlocked.locations.push('desert');
        player.unlockedMessage = '🏜️ *بیابان* باز شد!';
    }
    
    // باز کردن دشمنان
    if (player.score >= 100 && !player.unlocked.enemies.includes('snake')) player.unlocked.enemies.push('snake');
    if (player.score >= 250 && !player.unlocked.enemies.includes('bandit')) player.unlocked.enemies.push('bandit');
    if (player.score >= 400 && !player.unlocked.enemies.includes('lion')) player.unlocked.enemies.push('lion');
    if (player.score >= 600 && !player.unlocked.enemies.includes('soldier')) player.unlocked.enemies.push('soldier');
    if (player.score >= 800 && !player.unlocked.enemies.includes('bear')) player.unlocked.enemies.push('bear');
    if (player.score >= 1000 && !player.unlocked.enemies.includes('skeleton')) player.unlocked.enemies.push('skeleton');
    if (player.score >= 1500 && !player.unlocked.enemies.includes('werewolf')) player.unlocked.enemies.push('werewolf');
    if (player.score >= 2000 && !player.unlocked.enemies.includes('dragon')) player.unlocked.enemies.push('dragon');
    
    // باز کردن NPCها
    if (player.score >= 200 && !player.unlocked.npcs.includes('witch')) player.unlocked.npcs.push('witch');
    if (player.score >= 350 && !player.unlocked.npcs.includes('ghost')) player.unlocked.npcs.push('ghost');
    if (player.score >= 500 && !player.unlocked.npcs.includes('fairy')) player.unlocked.npcs.push('fairy');
    if (player.score >= 700 && !player.unlocked.npcs.includes('knight')) player.unlocked.npcs.push('knight');
    if (player.score >= 1000 && !player.unlocked.npcs.includes('angel')) player.unlocked.npcs.push('angel');
    
    // باز کردن دستور پخت‌ها
    if (player.score >= 150 && !player.unlocked.recipes.includes('تبر سنگی')) player.unlocked.recipes.push('تبر سنگی');
    if (player.score >= 400 && !player.unlocked.recipes.includes('زره چرمی')) player.unlocked.recipes.push('زره چرمی');
    if (player.score >= 600 && !player.unlocked.recipes.includes('تیروکمان')) player.unlocked.recipes.push('تیروکمان');
    if (player.score >= 900 && !player.unlocked.recipes.includes('شمشیر آهنی')) player.unlocked.recipes.push('شمشیر آهنی');
    if (player.score >= 1500 && !player.unlocked.recipes.includes('کلبه چوبی')) player.unlocked.recipes.push('کلبه چوبی');
}

function formatStatus(p) {
    const loc = config.images.locations[p.location];
    const pHpBar = '█'.repeat(Math.max(0, Math.floor(p.hp / p.maxHp * 10))) + '░'.repeat(Math.max(0, 10 - Math.floor(p.hp / p.maxHp * 10)));
    
    return `
👤 *${p.name}* | ⭐ ${p.level}
❤️ ${pHpBar} ${p.hp}/${p.maxHp}
⚔️ ${p.attack} | 🛡️ ${p.defense}
✨ XP: ${p.xp}/${p.level * 20} | 🏆 امتیاز: ${p.score}

📍 ${loc.emoji} ${loc.name}

🎒 *منابع:*
🪵${p.inventory.wood} 🪨${p.inventory.stone} 🍖${p.inventory.meat}
💧${p.inventory.water} 🦴${p.inventory.skin} ⛏️${p.inventory.iron} 👑${p.inventory.gold}

🛡️ *تجهیزات:* 🏠${p.equipment.house||'❌'} 🗡️${p.equipment.weapon||'❌'} 🛡️${p.equipment.armor||'❌'}
💀 شکست‌خورده: ${p.enemiesDefeated} | 💋 تصاحب: ${Object.keys(p.seduced||{}).length}
🔒 زندانی: ${p.prison?.length||0}
    `;
}

function formatLeaderboard() {
    const sorted = Object.entries(players)
        .sort((a, b) => (b[1].score || 0) - (a[1].score || 0))
        .slice(0, 10);
    
    if (sorted.length === 0) return '📊 *هنوز کسی بازی نکرده!*';
    
    let msg = '🏆 *برترین بازماندگان:*\n\n';
    
    const medals = ['🥇', '🥈', '🥉', '4️⃣', '5️⃣', '6️⃣', '7️⃣', '8️⃣', '9️⃣', '🔟'];
    
    for (let i = 0; i < sorted.length; i++) {
        const [id, p] = sorted[i];
        msg += `${medals[i]} ${p.name}: ${p.score} امتیاز | ⭐${p.level}\n`;
    }
    
    return msg;
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
        addScore(p, p.level * 10);
        return true;
    }
    return false;
}

module.exports = { players, createPlayer, getPlayer, addScore, checkUnlocks, formatStatus, formatLeaderboard, checkLevelUp };