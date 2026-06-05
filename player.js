const config = require('./config');
const players = {};
const pvpQueue = [];

function createPlayer(chatId) {
    players[chatId] = JSON.parse(JSON.stringify(config.defaultPlayer));
    players[chatId].npcEncounters = {};
    players[chatId].seduced = {};
    players[chatId].prison = [];
    players[chatId].prisonRelations = {};
    players[chatId].score = 0;
    players[chatId].chatId = chatId;
    return players[chatId];
}

function getPlayer(chatId) {
    return players[chatId] || null;
}

function addScore(player, amount) {
    player.score = (player.score || 0) + amount;
    checkUnlocks(player);
    
    // رویداد ویژه هر ۱۰۰ امتیاز
    if (player.score % 100 === 0 || (player.score - amount) % 100 > player.score % 100) {
        player.specialEvent = true;
    }
}

function checkUnlocks(player) {
    if (!player.unlocked) {
        player.unlocked = { locations: ['village'], enemies: ['wolf', 'snake', 'bandit'], npcs: [], recipes: [] };
    }
    
    // باز کردن مکان‌ها
    const locReqs = config.locationRequirements;
    for (let loc in locReqs) {
        if (player.score >= locReqs[loc] && !player.unlocked.locations.includes(loc)) {
            player.unlocked.locations.push(loc);
            player.unlockedMessage = `${config.images.locations[loc].emoji} *${config.images.locations[loc].name}* باز شد! (امتیاز ${locReqs[loc]}) 🎉`;
        }
    }
    
    // باز کردن دشمنان
    const enemyUnlocks = [
        { name: 'fairy', score: 200 },
        { name: 'lion', score: 400 },
        { name: 'bear', score: 500 },
        { name: 'soldier', score: 700 },
        { name: 'skeleton', score: 900 },
        { name: 'werewolf', score: 1200 },
        { name: 'knight', score: 1500 },
        { name: 'dragon', score: 2000 },
        { name: 'scorpion', score: 2500 },
        { name: 'crocodile', score: 350 },
        { name: 'eagle', score: 600 }
    ];
    
    for (let e of enemyUnlocks) {
        if (player.score >= e.score && !player.unlocked.enemies.includes(e.name)) {
            player.unlocked.enemies.push(e.name);
        }
    }
    
    // باز کردن NPCها
    const npcUnlocks = [
        { name: 'witch', score: 200 },
        { name: 'ghost', score: 350 },
        { name: 'fairy', score: 500 },
        { name: 'knight', score: 700 },
        { name: 'angel', score: 1000 },
        { name: 'wizard', score: 1200 },
        { name: 'werewolf', score: 1500 },
        { name: 'prince', score: 800 },
        { name: 'jester', score: 300 },
        { name: 'skeleton', score: 600 }
    ];
    
    for (let n of npcUnlocks) {
        if (player.score >= n.score && !player.unlocked.npcs.includes(n.name)) {
            player.unlocked.npcs.push(n.name);
        }
    }
    
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
    
    let msg = `👤 *${p.name}* | ⭐ Lv.${p.level}\n`;
    msg += `❤️ ${pHpBar} ${p.hp}/${p.maxHp}\n`;
    msg += `⚔️ ${p.attack} | 🛡️ ${p.defense}\n`;
    msg += `✨ XP: ${p.xp}/${p.level * 20}\n`;
    msg += `🏆 امتیاز: ${p.score}\n\n`;
    msg += `📍 ${loc.emoji} ${loc.name}\n\n`;
    msg += `🎒 *منابع:*\n`;
    msg += `🪵${p.inventory.wood} 🪨${p.inventory.stone} 🍖${p.inventory.meat}\n`;
    msg += `💧${p.inventory.water} 🦴${p.inventory.skin} ⛏️${p.inventory.iron} 👑${p.inventory.gold}\n\n`;
    msg += `🛡️ *تجهیزات:* 🏠${p.equipment.house||'❌'} 🗡️${p.equipment.weapon||'❌'} 🛡️${p.equipment.armor||'❌'}\n`;
    msg += `💀 شکار: ${p.enemiesDefeated} | 💋 تصاحب: ${Object.keys(p.seduced||{}).length} | 🔒 زندانی: ${p.prison?.length||0}`;
    
    return msg;
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
        msg += `${medals[i]} ${p.name}: ${p.score} امتیاز | ⭐Lv.${p.level}\n`;
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

// PvP
function joinPvP(player) {
    if (pvpQueue.length > 0) {
        const opponent = pvpQueue.shift();
        return { matched: true, opponent };
    } else {
        pvpQueue.push(player);
        return { matched: false };
    }
}

function leavePvP(player) {
    const index = pvpQueue.indexOf(player);
    if (index > -1) pvpQueue.splice(index, 1);
}

module.exports = { 
    players, createPlayer, getPlayer, addScore, checkUnlocks, 
    formatStatus, formatLeaderboard, checkLevelUp,
    joinPvP, leavePvP, pvpQueue
};