const config = require('./config');
const { triggerRandomEvent, checkNpcEncounter } = require('./events');
const { findEgg, addPet, autoFeedCheck } = require('./pet');
const { findLootBox } = require('./lootbox');
const { updateQuestProgress, getQuestCompletionMessage } = require('./dailyQuest');

function travel(player, destination) {
    // چک وجود locations
    const locations = config.images && config.images.locations ? config.images.locations : null;
    if (!locations || !locations[destination]) {
        return { success: false, message: '❌ این مکان وجود نداره!' };
    }
    
    if (player.location === destination) {
        return { success: false, message: '⚠️ همین جا هستی!' };
    }

    // چک وجود player.location
    if (!player.location || !locations[player.location]) {
        player.location = 'village';
    }

    const oldLoc = locations[player.location] || { emoji: '🏘️', name: 'روستا' };
    player.location = destination;
    const newLoc = locations[destination];
    player.travels = (player.travels || 0) + 1;

    let msg = `🚶 ${oldLoc.emoji} → ${newLoc.emoji} *${newLoc.name}*\n`;

    // آپدیت ماموریت روزانه
    try { updateQuestProgress(player, 'travel', destination); } catch (e) {}

    // ۴۰٪ شانس یه اتفاق تو راه
    const eventRoll = Math.random();

    if (eventRoll < 0.15) {
        const enemyKeys = config.locationEnemies && config.locationEnemies[destination] ? config.locationEnemies[destination] : ['wolf'];
        const randomEnemy = enemyKeys[Math.floor(Math.random() * enemyKeys.length)];
        const enemyData = config.images.enemies && config.images.enemies[randomEnemy] ? config.images.enemies[randomEnemy] : null;
        
        if (enemyData) {
            msg += `\n⚔️ *${enemyData.emoji} ${enemyData.name}* سر راهت سبز شد!\n`;
            return { success: true, message: msg, travelImage: newLoc.file_id, ambush: true, ambushEnemy: randomEnemy };
        }
    } else if (eventRoll < 0.30) {
        try {
            const npcId = checkNpcEncounter(player, 'travel', destination);
            if (npcId) {
                const npc = (config.images.npcs && config.images.npcs[npcId]) || (config.images.enemies && config.images.enemies[npcId]);
                if (npc) {
                    msg += `\n${npc.emoji || '👤'} *${npc.name || npcId}* تو راه دیدیش!\n`;
                    return { success: true, message: msg, travelImage: newLoc.file_id, npcEncounter: npcId };
                }
            }
        } catch (e) {}
    } else if (eventRoll < 0.45) {
        try {
            const event = triggerRandomEvent(player, 'travel');
            if (event) {
                msg += `\n${event.msg}`;

                const egg = findEgg(player);
                if (egg) {
                    const addResult = addPet(player, egg);
                    if (addResult && addResult.success) msg += `\n\n🐾 ${addResult.message}`;
                }

                const box = findLootBox(player);
                if (box && box.found && box.box) {
                    msg += `\n\n${box.box.emoji} *${box.box.name}* پیدا کردی! 📦`;
                }

                return { success: true, message: msg, travelImage: newLoc.file_id, eventImage: event.img };
            }
        } catch (e) {}
    } else if (eventRoll < 0.55) {
        const items = ['wood', 'stone', 'meat', 'water', 'gold'];
        const foundItem = items[Math.floor(Math.random() * items.length)];
        const amount = Math.floor(Math.random() * 5) + 2;
        if (!player.inventory) player.inventory = {};
        player.inventory[foundItem] = (player.inventory[foundItem] || 0) + amount;
        const itemData = config.images && config.images.resources ? config.images.resources[foundItem] : null;
        msg += `\n🎒 تو راه ${amount} ${itemData ? itemData.emoji : ''} *${itemData ? itemData.name : foundItem}* پیدا کردی!`;

        try { updateQuestProgress(player, 'gather', foundItem); } catch (e) {}
    } else if (eventRoll < 0.60) {
        const dmg = Math.floor(Math.random() * 15) + 5;
        player.hp = Math.max(1, (player.hp || 100) - dmg);
        msg += `\n🤕 تو راه آسیب دیدی! -${dmg}❤️`;
    } else if (eventRoll < 0.65) {
        const heal = Math.floor(Math.random() * 20) + 10;
        player.hp = Math.min((player.maxHp || 100), (player.hp || 100) + heal);
        msg += `\n💚 تو راه استراحت کردی! +${heal}❤️`;
    }

    // شانس پیدا کردن تخم حیوون (۱۰٪)
    try {
        const egg = findEgg(player);
        if (egg) {
            const addResult = addPet(player, egg);
            if (addResult && addResult.success) msg += `\n\n🐾 ${addResult.message}`;
        }
    } catch (e) {}

    // شانس پیدا کردن صندوقچه (۵٪)
    try {
        const box = findLootBox(player);
        if (box && box.found && box.box) {
            msg += `\n\n${box.box.emoji} *${box.box.name}* پیدا کردی! 📦\nبرو توی بازار بازش کن (🗝️ نیاز: ${box.box.keyCost || 0})`;
        }
    } catch (e) {}

    // انرژی سفر
    const travelEnergy = Math.floor(Math.random() * 10) + 5;
    if (!player.energy) player.energy = 0;
    if (!player.maxEnergy) player.maxEnergy = 100;
    player.energy = Math.min(player.maxEnergy, player.energy + travelEnergy);
    msg += `\n⚡ +${travelEnergy} انرژی سفر`;

    // چک کردن گرسنگی حیوون
    try {
        const hungryMessage = autoFeedCheck(player);
        if (hungryMessage) msg += `\n\n🍖 ${hungryMessage}`;
    } catch (e) {}

    // چک کردن تکمیل ماموریت
    try {
        const questComplete = getQuestCompletionMessage(player);
        if (questComplete) msg += `\n\n${questComplete}`;
    } catch (e) {}

    msg += `\n📝 ${newLoc.description || ''}`;
    
    return { success: true, message: msg, travelImage: newLoc.file_id };
}

module.exports = { travel };