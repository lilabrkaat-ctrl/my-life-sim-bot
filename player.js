const config = require('./config');
const { loadPlayers } = require('./storage');

const players = loadPlayers();

function createPlayer(chatId, firstName) {
    players[chatId] = JSON.parse(JSON.stringify(config.defaultPlayer));
    players[chatId].name = 'بازمانده ' + (firstName || 'گمنام');
    players[chatId].npcEncounters = {};
    players[chatId].seduced = {};
    players[chatId].prison = [];
    players[chatId].prisonRelations = {};
    players[chatId].prisonActions = {};
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
}

function checkUnlocks(player) {
    if (!player.unlocked) {
        player.unlocked = { locations: ['village'], enemies: ['wolf', 'snake', 'bandit'], npcs: [], recipes: [] };
    }
    
    const locReqs = config.locationRequirements;
    for (let loc in locReqs) {
        if (player.score >= locReqs[loc] && !player.unlocked.locations.includes(loc)) {
            player.unlocked.locations.push(loc);
            player.unlockedMessage = `${config.images.locations[loc].emoji} *${config.images.locations[loc].name}* باز شد! (${locReqs[loc]} امتیاز) 🎉`;
        }
    }
    
    const enemyUnlocks = [
        { name: 'fairy', score: 200 }, { name: 'lion', score: 400 }, { name: 'bear', score: 500 },
        { name: 'soldier', score: 700 }, { name: 'skeleton', score: 900 }, { name: 'werewolf', score: 1200 },
        { name: 'knight_enemy', score: 1500 }, { name: 'dragon', score: 2000 }, { name: 'scorpion', score: 2500 }
    ];
    for (let e of enemyUnlocks) {
        if (player.score >= e.score && !player.unlocked.enemies.includes(e.name)) {
            player.unlocked.enemies.push(e.name);
        }
    }
    
    if (player.score >= 150 && !player.unlocked.recipes.includes('تبر سنگی')) player.unlocked.recipes.push('تبر سنگی');
    if (player.score >= 400 && !player.unlocked.recipes.includes('زره چرمی')) player.unlocked.recipes.push('زره چرمی');
    if (player.score >= 600 && !player.unlocked.recipes.includes('تیروکمان')) player.unlocked.recipes.push('تیروکمان');
    if (player.score >= 900 && !player.unlocked.recipes.includes('شمشیر آهنی')) player.unlocked.recipes.push('شمشیر آهنی');
    if (player.score >= 1500 && !player.unlocked.recipes.includes('کلبه چوبی')) player.unlocked.recipes.push('کلبه چوبی');
}

function formatStatus(p) {
    const loc = config.images.locations[p.location] || config.images.locations.village;
    const pHpBar = '🟩'.repeat(Math.min(6, Math.max(0, Math.floor((p.hp||100) / (p.maxHp||100) * 6)))) + 
                    '🟨'.repeat(Math.min(2, Math.max(0, Math.floor((p.hp||100) / (p.maxHp||100) * 8) - 6))) + 
                    '🟥'.repeat(Math.min(2, Math.max(0, Math.floor((p.hp||100) / (p.maxHp||100) * 10) - 8))) + 
                    '⬛'.repeat(Math.max(0, 10 - Math.floor((p.hp||100) / (p.maxHp||100) * 10)));
    const hpPercent = Math.floor((p.hp||100) / (p.maxHp||100) * 100);
    
    return `👤 *${p.name}* | ⭐ Lv.${p.level||1}\n✨ XP: ${p.xp||0}/${(p.level||1)*20}\n${pHpBar} ${hpPercent}٪\n\n📍 ${loc?.emoji||'🏘️'} ${loc?.name||'روستا'}\n\n🎒 *منابع:*\n🪵${p.inventory?.wood||0} 🪨${p.inventory?.stone||0} 🍖${p.inventory?.meat||0}\n💧${p.inventory?.water||0} 🦴${p.inventory?.skin||0} ⛏️${p.inventory?.iron||0} 👑${p.inventory?.gold||0}\n\n🎁 *آیتم‌ها:*\n💍${p.inventory?.ring||0} 💎${p.inventory?.diamond||0} 📜${p.inventory?.spell||0} 🎵${p.inventory?.song||0}\n🩸${p.inventory?.blood||0} 🔮${p.inventory?.wish||0} 🗝️${p.inventory?.key||0} 🧿${p.inventory?.tear||0} 💀${p.inventory?.finisher||0}\n\n🛡️ *تجهیزات:* 🏠${p.equipment?.house||'❌'} 🗡️${p.equipment?.weapon||'❌'} 🛡️${p.equipment?.armor||'❌'}\n💀 شکار: ${p.enemiesDefeated||0} | 💋 تصاحب: ${Object.keys(p.seduced||{}).length} | 🔒 زندان: ${p.prison?.length||0}\n🏠 خونه: ${p.house?.length||0} | 💍 همسر: ${p.marry||'نداره'}\n🏆 امتیاز: ${p.score||0}`;
}

function formatLeaderboard() {
    const sorted = Object.entries(players).sort((a, b) => (b[1].score || 0) - (a[1].score || 0)).slice(0, 10);
    if (sorted.length === 0) return '📊 *هنوز کسی بازی نکرده!*';
    
    let msg = '🏆 *برترین بازماندگان:*\n\n';
    const medals = ['🥇', '🥈', '🥉', '4️⃣', '5️⃣', '6️⃣', '7️⃣', '8️⃣', '9️⃣', '🔟'];
    for (let i = 0; i < sorted.length; i++) {
        msg += `${medals[i]} ${sorted[i][1].name}: ${sorted[i][1].score} امتیاز | ⭐Lv.${sorted[i][1].level}\n`;
    }
    return msg;
}

function checkLevelUp(p) {
    const needed = (p.level || 1) * 20;
    if ((p.xp || 0) >= needed) {
        p.level = (p.level || 1) + 1;
        p.maxHp = (p.maxHp || 100) + 10;
        p.hp = Math.min(p.maxHp, (p.hp || 100) + 10);
        p.attack = (p.attack || 5) + 2;
        p.defense = (p.defense || 2) + 1;
        p.xp -= needed;
        addScore(p, p.level * 10);
        
        const rewards = config.levelUpRewards[p.level];
        let rewardMsg = '';
        if (rewards) {
            for (let item in rewards) {
                p.inventory[item] = (p.inventory[item] || 0) + rewards[item];
                const emojiMap = { ring: '💍', tear: '🧿', spell: '📜', song: '🎵', blood: '🩸', wish: '🔮', key: '🗝️', diamond: '💎', finisher: '💀' };
                rewardMsg += `\n🎁 ${emojiMap[item]||item} +${rewards[item]}`;
            }
        }
        
        p.levelUpMessage = `⬆️ *لول آپ!* سطح ${p.level}!\n❤️ +۱۰ جان\n⚔️ +۲ حمله\n🛡️ +۱ دفاع${rewardMsg}`;
        
        return true;
    }
    return false;
}

const pvpQueue = [];

function joinPvP(player) {
    if (pvpQueue.length > 0) {
        const opponent = pvpQueue.shift();
        return { matched: true, opponent };
    }
    pvpQueue.push(player);
    return { matched: false };
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