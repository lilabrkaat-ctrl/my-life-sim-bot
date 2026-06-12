const config = require('./config');
const { loadPlayers } = require('./storage');

const players = loadPlayers();

function getTimeOfDay() {
    const hour = new Date().getHours();
    if (hour >= 0 && hour < 6) return { name: '🌑 نیمه‌شب', key: 'midnight', energy: -10, resourceBonus: -0.5, enemyMultiplier: 3, npcChance: 0.5, rewardMultiplier: 3 };
    if (hour >= 6 && hour < 12) return { name: '🌅 صبح', key: 'morning', energy: 15, resourceBonus: 0.3, enemyMultiplier: 1, npcChance: 1, rewardMultiplier: 1 };
    if (hour >= 12 && hour < 18) return { name: '☀️ ظهر', key: 'noon', energy: 5, resourceBonus: 0.2, enemyMultiplier: 0.8, npcChance: 1, rewardMultiplier: 1 };
    return { name: '🌆 غروب', key: 'evening', energy: -5, resourceBonus: 0, enemyMultiplier: 1, npcChance: 2, rewardMultiplier: 1.5 };
}

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
    players[chatId].timeOfDay = getTimeOfDay();
    players[chatId].pets = [];
    players[chatId].petFood = 0;
    players[chatId].lootBoxes = { wooden: 0, silver: 0, golden: 0, legendary: 0 };
    players[chatId].dailyQuests = { quests: [], completed: [], lastReset: Date.now(), progress: {} };
    players[chatId].children = [];
    players[chatId].pregnancies = [];
    players[chatId].childSlots = 3;
    players[chatId].lastPregnancyCheck = 0;
    players[chatId].empire = { level: 0, score: 0, roles: {}, wonders: [], foundedAt: Date.now(), lastCollection: Date.now(), dynastyName: '', treasury: 0 };
    players[chatId].people = {
        population: {}, lands: [], buildings: [],
        stats: { happiness: 60, hunger: 70, safety: 50, justice: 50, faith: 50 },
        storage: { food: 100, water: 50 }, lastUpdate: Date.now(), events: []
    };
    try {
        const { populationTypes } = require('./people');
        for (let type in populationTypes) {
            players[chatId].people.population[type] = {
                count: populationTypes[type].baseCount, employed: 0, sick: 0, unhappy: 0
            };
        }
    } catch(e) {}
    players[chatId].court = { prisoners: [], scandals: [], recentEvents: [], lastEvent: 0, intrigueCooldowns: {}, alertLevel: 0 };
    players[chatId].blackMarket = { items: [], specialDeal: null, lastRefresh: 0 };
    return players[chatId];
}

function getPlayer(chatId) { return players[chatId] || null; }

function addScore(player, amount) { player.score = (player.score || 0) + amount; checkUnlocks(player); }

function checkUnlocks(player) {
    if (!player.unlocked) player.unlocked = { locations: ['village'], enemies: ['wolf', 'snake', 'bandit'], npcs: [], recipes: [] };
    const locReqs = config.locationRequirements;
    for (let loc in locReqs) {
        if (player.score >= locReqs[loc] && !player.unlocked.locations.includes(loc)) {
            player.unlocked.locations.push(loc);
            player.unlockedMessage = `${config.images.locations[loc].emoji} *${config.images.locations[loc].name}* باز شد! 🎉`;
        }
    }
    const enemyUnlocks = [
        { name: 'fairy', score: 200 }, { name: 'lion', score: 400 }, { name: 'bear', score: 500 },
        { name: 'soldier', score: 700 }, { name: 'skeleton', score: 900 }, { name: 'werewolf', score: 1200 },
        { name: 'knight_enemy', score: 1500 }, { name: 'dragon', score: 2000 }
    ];
    for (let e of enemyUnlocks) { if (player.score >= e.score && !player.unlocked.enemies.includes(e.name)) player.unlocked.enemies.push(e.name); }
    if (player.score >= 150 && !player.unlocked.recipes.includes('تبر سنگی')) player.unlocked.recipes.push('تبر سنگی');
    if (player.score >= 400 && !player.unlocked.recipes.includes('زره چرمی')) player.unlocked.recipes.push('زره چرمی');
    if (player.score >= 600 && !player.unlocked.recipes.includes('تیروکمان')) player.unlocked.recipes.push('تیروکمان');
    if (player.score >= 900 && !player.unlocked.recipes.includes('شمشیر آهنی')) player.unlocked.recipes.push('شمشیر آهنی');
    if (player.score >= 1500 && !player.unlocked.recipes.includes('کلبه چوبی')) player.unlocked.recipes.push('کلبه چوبی');
}

function formatStatus(p) {
    const time = p.timeOfDay || getTimeOfDay();
    p.timeOfDay = time;
    const loc = config.images.locations[p.location] || config.images.locations.village;
    const hpPercent = Math.floor((p.hp||100) / (p.maxHp||100) * 100);
    let bar = '';
    for (let i = 0; i < 10; i++) {
        if (i < Math.floor(hpPercent / 10)) {
            if (i < 6) bar += '🟩'; else if (i < 8) bar += '🟨'; else bar += '🟥';
        } else bar += '⬛';
    }

    let status = `👤 *${p.name}* | ⭐ Lv.${p.level||1}\n`;
    status += `${time.name} | ⚡ ${p.energy||0}/${p.maxEnergy||100}\n`;
    status += `✨ XP: ${p.xp||0}/${(p.level||1)*20}\n`;
    status += `${bar} ${hpPercent}٪\n\n`;
    status += `📍 ${loc?.emoji||'🏘️'} ${loc?.name||'روستا'}\n\n`;

    // امپراطوری
    if (p.empire) {
        try {
            const { empireLevels } = require('./empire');
            const empLvl = empireLevels[p.empire.level || 0];
            if (empLvl) {
                status += `${empLvl.emoji} *${empLvl.name}*\n`;
                if (p.empire.dynastyName) status += `📜 سلسله ${p.empire.dynastyName}\n`;
                if (p.people && p.people.population) {
                    try { status += `👥 جمعیت: ${require('./people').getTotalPopulation(p)} نفر\n`; } catch(e) {}
                }
                status += `🏦 خزانه: ${p.empire.treasury || 0}👑\n`;
                status += `🏛️ عجایب: ${p.empire.wonders ? p.empire.wonders.length : 0} عدد\n\n`;
            }
        } catch(e) {}
    }

    status += `🎒 *منابع:*\n🪵${p.inventory?.wood||0} 🪨${p.inventory?.stone||0} 🍖${p.inventory?.meat||0}\n💧${p.inventory?.water||0} 🦴${p.inventory?.skin||0} ⛏️${p.inventory?.iron||0} 👑${p.inventory?.gold||0}\n\n`;
    status += `🎁 *آیتم‌ها:*\n💍${p.inventory?.ring||0} 💎${p.inventory?.diamond||0} 📜${p.inventory?.spell||0} 🎵${p.inventory?.song||0}\n🩸${p.inventory?.blood||0} 🔮${p.inventory?.wish||0} 🗝️${p.inventory?.key||0} 🧿${p.inventory?.tear||0} 💀${p.inventory?.finisher||0}\n\n`;
    status += `🛡️ *تجهیزات:* 🏠${p.equipment?.house||'❌'} 🗡️${p.equipment?.weapon||'❌'} 🛡️${p.equipment?.armor||'❌'}\n`;
    status += `💀 شکار: ${p.enemiesDefeated||0} | 💋 تصاحب: ${Object.keys(p.seduced||{}).length}\n`;
    status += `🔒 زندان: ${p.prison?.length||0} | 🏠 خونه: ${p.house?.length||0} | 💍 همسر: ${p.marry||'نداره'}\n`;

    // حیوانات
    if (p.pets && p.pets.length > 0) {
        status += `🐾 حیوون‌ها: `;
        for (let pet of p.pets) status += `${pet.emoji} `;
        status += `(${p.pets.length}/۳)\n`;
    }

    // فرزندان
    if (p.children && p.children.length > 0) {
        const alive = p.children.filter(c => c.isAlive);
        if (alive.length > 0) {
            status += `👶 فرزندان: ${alive.length} نفر\n`;
            const heir = alive.find(c => c.isHeir);
            if (heir) status += `👑 ولیعهد: ${heir.emoji} ${heir.name}\n`;
        }
    }

    // بارداری‌های حرمسرا
    if (p.harem && p.harem.queens) {
        let totalPreg = 0;
        for (let queen of p.harem.queens) {
            totalPreg += queen.pregnancies ? queen.pregnancies.filter(pr => !pr.born && Date.now() < pr.dueDate).length : 0;
        }
        if (totalPreg > 0) status += `🤰 بارداری حرمسرا: ${totalPreg} نفر\n`;
    }

    // بارداری‌های معمولی
    if (p.pregnancies && p.pregnancies.length > 0) status += `🤰 بارداری: ${p.pregnancies.length} نفر\n`;

    // صندوقچه‌ها
    if (p.lootBoxes) {
        const totalBoxes = (p.lootBoxes.wooden||0)+(p.lootBoxes.silver||0)+(p.lootBoxes.golden||0)+(p.lootBoxes.legendary||0);
        if (totalBoxes > 0) status += `📦 صندوقچه: ${totalBoxes} عدد\n`;
    }

    // ماموریت‌ها
    if (p.dailyQuests && p.dailyQuests.quests && p.dailyQuests.quests.length > 0) {
        const completed = p.dailyQuests.quests.filter(q => q.completed && !q.claimed).length;
        if (completed > 0) status += `📋 ماموریت آماده: ${completed} عدد\n`;
    }

    status += `\n🏆 امتیاز: ${p.score||0}`;
    return status;
}
function formatLeaderboard() {
    const sorted = Object.entries(players).sort((a, b) => (b[1].score || 0) - (a[1].score || 0)).slice(0, 10);
    if (sorted.length === 0) return '📊 *هنوز کسی بازی نکرده!*';
    let msg = '🏆 *برترین بازماندگان:*\n\n';
    const medals = ['🥇', '🥈', '🥉', '4️⃣', '5️⃣', '6️⃣', '7️⃣', '8️⃣', '9️⃣', '🔟'];
    for (let i = 0; i < sorted.length; i++) {
        const p = sorted[i][1];
        msg += `${medals[i]} ${p.name}: ${p.score} امتیاز | ⭐Lv.${p.level}\n`;
    }
    return msg;
}

function checkLevelUp(p) {
    let leveledUp = false;
    let totalMessages = '';
    while ((p.xp || 0) >= (p.level || 1) * 20) {
        const needed = (p.level || 1) * 20;
        p.level = (p.level || 1) + 1;
        p.maxHp = (p.maxHp || 100) + 10; p.hp = Math.min(p.maxHp, (p.hp || 100) + 10);
        p.attack = (p.attack || 5) + 2; p.defense = (p.defense || 2) + 1;
        p.xp -= needed;
        addScore(p, p.level * 10);
        p.energy = Math.min((p.maxEnergy || 100), (p.energy || 0) + 20);
        const rewards = config.levelUpRewards[p.level];
        let rewardMsg = '';
        if (rewards) {
            for (let item in rewards) {
                p.inventory[item] = (p.inventory[item] || 0) + rewards[item];
                const emojiMap = { ring:'💍', tear:'🧿', spell:'📜', song:'🎵', blood:'🩸', wish:'🔮', key:'🗝️', diamond:'💎', finisher:'💀' };
                rewardMsg += `\n🎁 ${emojiMap[item]||item} +${rewards[item]}`;
            }
        }
        rewardMsg += `\n⚡ +۲۰ انرژی`;
        totalMessages += `⬆️ *لول آپ!* سطح ${p.level}!\n❤️ +۱۰ ⚔️ +۲ 🛡️ +۱${rewardMsg}\n\n`;
        leveledUp = true;
    }
    if (leveledUp) p.levelUpMessage = totalMessages.trim();
    return leveledUp;
}

const pvpQueue = [];
function joinPvP(player) { if (pvpQueue.length > 0) { const opponent = pvpQueue.shift(); return { matched: true, opponent }; } pvpQueue.push(player); return { matched: false }; }
function leavePvP(player) { const index = pvpQueue.indexOf(player); if (index > -1) pvpQueue.splice(index, 1); }

function initAllSystems(player) {
    if (!player.pets) player.pets = [];
    if (!player.petFood) player.petFood = 0;
    if (!player.lootBoxes) player.lootBoxes = { wooden: 0, silver: 0, golden: 0, legendary: 0 };
    if (!player.dailyQuests) player.dailyQuests = { quests: [], completed: [], lastReset: Date.now(), progress: {} };
    if (!player.children) player.children = [];
    if (!player.pregnancies) player.pregnancies = [];
    if (!player.childSlots) player.childSlots = 3;
    if (!player.empire) player.empire = { level: 0, score: 0, roles: {}, wonders: [], foundedAt: Date.now(), lastCollection: Date.now(), dynastyName: '', treasury: 0 };
    if (!player.people) {
        player.people = {
            population: {}, lands: [], buildings: [],
            stats: { happiness: 60, hunger: 70, safety: 50, justice: 50, faith: 50 },
            storage: { food: 100, water: 50 }, lastUpdate: Date.now(), events: []
        };
        try { const { populationTypes } = require('./people'); for (let type in populationTypes) { player.people.population[type] = { count: populationTypes[type].baseCount, employed: 0, sick: 0, unhappy: 0 }; } } catch(e) {}
    }
    if (!player.court) player.court = { prisoners: [], scandals: [], recentEvents: [], lastEvent: 0, intrigueCooldowns: {}, alertLevel: 0 };
    if (!player.blackMarket) player.blackMarket = { items: [], specialDeal: null, lastRefresh: 0 };
}

// =============================================
// 👶 چک تولد بچه‌ها (offspring + harem)
// =============================================
function checkAllBirths(player) {
    const births = [];
    
    // چک بارداری‌های معمولی (offspring)
    try {
        const { checkBirths } = require('./offspring');
        const normalBirths = checkBirths(player);
        if (normalBirths && normalBirths.length > 0) {
            births.push(...normalBirths.map(b => ({ type: 'normal', child: b })));
        }
    } catch(e) {}
    
    // چک بارداری‌های حرمسرا
    try {
        const { checkHaremBirths } = require('./queenHarem');
        const haremBirths = checkHaremBirths(player);
        if (haremBirths && haremBirths.length > 0) {
            births.push(...haremBirths.map(b => ({ type: 'harem', ...b })));
        }
    } catch(e) {}
    
    return births;
}

module.exports = { 
    players, createPlayer, getPlayer, addScore, checkUnlocks, 
    formatStatus, formatLeaderboard, checkLevelUp, getTimeOfDay,
    joinPvP, leavePvP, pvpQueue, initAllSystems, checkAllBirths
};