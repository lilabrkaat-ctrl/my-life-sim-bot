const config = require('./config');
const { triggerRandomEvent, checkNpcEncounter } = require('./events');

function travel(player, destination) {
    const locations = config.images.locations;
    if (!locations || !locations[destination]) return { success: false, message: '❌ این مکان وجود نداره!' };
    if (player.location === destination) return { success: false, message: '⚠️ همین جا هستی!' };

    const oldLoc = locations[player.location];
    player.location = destination;
    const newLoc = locations[destination];
    player.travels = (player.travels || 0) + 1;

    let msg = `🚶 ${oldLoc.emoji} → ${newLoc.emoji} *${newLoc.name}*\n`;
    
    // ۴۰٪ شانس یه اتفاق تو راه
    const eventRoll = Math.random();
    
    if (eventRoll < 0.15) {
        // برخورد با دشمن تو راه
        const enemyKeys = config.locationEnemies[destination] || ['wolf'];
        const randomEnemy = enemyKeys[Math.floor(Math.random() * enemyKeys.length)];
        const enemyData = config.images.enemies[randomEnemy];
        if (enemyData) {
            msg += `\n⚔️ *${enemyData.emoji} ${enemyData.name}* سر راهت سبز شد!\n`;
            return { success: true, message: msg, travelImage: newLoc.file_id, ambush: true, ambushEnemy: randomEnemy };
        }
    } else if (eventRoll < 0.30) {
        // ملاقات با NPC
        const npcId = checkNpcEncounter(player, 'travel', destination);
        if (npcId) {
            const npc = config.images.npcs[npcId] || config.images.enemies[npcId];
            msg += `\n${npc?.emoji || '👤'} *${npc?.name || npcId}* تو راه دیدیش!\n`;
            return { success: true, message: msg, travelImage: newLoc.file_id, npcEncounter: npcId };
        }
    } else if (eventRoll < 0.45) {
        // رویداد تصادفی
        const event = triggerRandomEvent(player, 'travel');
        if (event) {
            msg += `\n${event.msg}`;
            return { success: true, message: msg, travelImage: newLoc.file_id, eventImage: event.img };
        }
    } else if (eventRoll < 0.55) {
        // پیدا کردن آیتم تو راه
        const items = ['wood', 'stone', 'meat', 'water', 'gold'];
        const foundItem = items[Math.floor(Math.random() * items.length)];
        const amount = Math.floor(Math.random() * 5) + 2;
        player.inventory[foundItem] = (player.inventory[foundItem] || 0) + amount;
        const itemData = config.images.resources[foundItem];
        msg += `\n🎒 تو راه ${amount} ${itemData?.emoji || ''} *${itemData?.name || foundItem}* پیدا کردی!`;
    } else if (eventRoll < 0.60) {
        // آسیب دیدن
        const dmg = Math.floor(Math.random() * 15) + 5;
        player.hp = Math.max(1, player.hp - dmg);
        msg += `\n🤕 تو راه آسیب دیدی! -${dmg}❤️`;
    } else if (eventRoll < 0.65) {
        // شفا یافتن
        const heal = Math.floor(Math.random() * 20) + 10;
        player.hp = Math.min(player.maxHp, player.hp + heal);
        msg += `\n💚 تو راه استراحت کردی! +${heal}❤️`;
    }

    msg += `\n📝 ${newLoc.description}`;
    return { success: true, message: msg, travelImage: newLoc.file_id };
}

module.exports = { travel };