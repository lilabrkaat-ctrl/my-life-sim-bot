const config = require('./config');
const { triggerRandomEvent, checkNpcEncounter } = require('./events');
const { findEgg, addPet, autoFeedCheck } = require('./pet');
const { findLootBox } = require('./lootbox');
const { updateQuestProgress, getQuestCompletionMessage } = require('./dailyQuest');

function travel(player, destination) {
    const locations = config.images.locations;
    if (!locations || !locations[destination]) return { success: false, message: '❌ این مکان وجود نداره!' };
    if (player.location === destination) return { success: false, message: '⚠️ همین جا هستی!' };

    const oldLoc = locations[player.location];
    player.location = destination;
    const newLoc = locations[destination];
    player.travels = (player.travels || 0) + 1;

    let msg = `🚶 ${oldLoc.emoji} → ${newLoc.emoji} *${newLoc.name}*\n`;

    // آپدیت ماموریت روزانه
    updateQuestProgress(player, 'travel', destination);

    // ۴۰٪ شانس یه اتفاق تو راه
    const eventRoll = Math.random();

    if (eventRoll < 0.15) {
        const enemyKeys = config.locationEnemies[destination] || ['wolf'];
        const randomEnemy = enemyKeys[Math.floor(Math.random() * enemyKeys.length)];
        const enemyData = config.images.enemies[randomEnemy];
        if (enemyData) {
            msg += `\n⚔️ *${enemyData.emoji} ${enemyData.name}* سر راهت سبز شد!\n`;
            return { success: true, message: msg, travelImage: newLoc.file_id, ambush: true, ambushEnemy: randomEnemy };
        }
    } else if (eventRoll < 0.30) {
        const npcId = checkNpcEncounter(player, 'travel', destination);
        if (npcId) {
            const npc = config.images.npcs[npcId] || config.images.enemies[npcId];
            msg += `\n${npc?.emoji || '👤'} *${npc?.name || npcId}* تو راه دیدیش!\n`;
            return { success: true, message: msg, travelImage: newLoc.file_id, npcEncounter: npcId };
        }
    } else if (eventRoll < 0.45) {
        const event = triggerRandomEvent(player, 'travel');
        if (event) {
            msg += `\n${event.msg}`;
            
            // چک کردن تخم و صندوقچه حتی موقع event
            const egg = findEgg(player);
            if (egg) {
                const addResult = addPet(player, egg);
                if (addResult.success) msg += `\n\n🐾 ${addResult.message}`;
            }
            
            const box = findLootBox(player);
            if (box.found) msg += `\n\n${box.box.emoji} *${box.box.name}* پیدا کردی! 📦`;
            
            return { success: true, message: msg, travelImage: newLoc.file_id, eventImage: event.img };
        }
    } else if (eventRoll < 0.55) {
        const items = ['wood', 'stone', 'meat', 'water', 'gold'];
        const foundItem = items[Math.floor(Math.random() * items.length)];
        const amount = Math.floor(Math.random() * 5) + 2;
        player.inventory[foundItem] = (player.inventory[foundItem] || 0) + amount;
        const itemData = config.images.resources[foundItem];
        msg += `\n🎒 تو راه ${amount} ${itemData?.emoji || ''} *${itemData?.name || foundItem}* پیدا کردی!`;
        
        // آپدیت ماموریت برای آیتم‌هایی که جمع میشن
        updateQuestProgress(player, 'gather', foundItem);
    } else if (eventRoll < 0.60) {
        const dmg = Math.floor(Math.random() * 15) + 5;
        player.hp = Math.max(1, player.hp - dmg);
        msg += `\n🤕 تو راه آسیب دیدی! -${dmg}❤️`;
    } else if (eventRoll < 0.65) {
        const heal = Math.floor(Math.random() * 20) + 10;
        player.hp = Math.min(player.maxHp, player.hp + heal);
        msg += `\n💚 تو راه استراحت کردی! +${heal}❤️`;
    }

    // شانس پیدا کردن تخم حیوون (۱۰٪)
    const egg = findEgg(player);
    if (egg) {
        const addResult = addPet(player, egg);
        if (addResult.success) msg += `\n\n🐾 ${addResult.message}`;
    }

    // شانس پیدا کردن صندوقچه (۵٪)
    const box = findLootBox(player);
    if (box.found) msg += `\n\n${box.box.emoji} *${box.box.name}* پیدا کردی! 📦\nبرو توی بازار بازش کن (🗝️ نیاز: ${box.box.keyCost})`;

    // انرژی سفر
    const travelEnergy = Math.floor(Math.random() * 10) + 5;
    player.energy = Math.min((player.maxEnergy || 100), (player.energy || 0) + travelEnergy);
    msg += `\n⚡ +${travelEnergy} انرژی سفر`;

    // چک کردن گرسنگی حیوون
    const hungryMessage = autoFeedCheck(player);
    if (hungryMessage) msg += `\n\n🍖 ${hungryMessage}`;

    // چک کردن تکمیل ماموریت
    const questComplete = getQuestCompletionMessage(player);
    if (questComplete) msg += `\n\n${questComplete}`;

    msg += `\n📝 ${newLoc.description}`;
    return { success: true, message: msg, travelImage: newLoc.file_id };
}

module.exports = { travel };