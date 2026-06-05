const config = require('./config');
const { triggerRandomEvent, checkNpcEncounter } = require('./events');

function gather(player) {
    const resources = config.locationResources[player.location];
    if (!resources || resources.length === 0) {
        return { success: false, message: '❌ اینجا چیزی نیست!' };
    }

    const results = [];
    let found = false;

    for (let res of resources) {
        if (Math.random() <= res.chance) {
            const amount = Math.floor(Math.random() * (res.max - res.min + 1)) + res.min;
            if (amount > 0) {
                player.inventory[res.item] += amount;
                const itemData = config.images.resources[res.item];
                if (itemData) results.push(`${itemData.emoji} +${amount}`);
                found = true;
            }
        }
    }

    const npcEncounter = checkNpcEncounter(player, 'gather', player.location);
    if (npcEncounter) {
        const npc = config.images.npcs[npcEncounter];
        const msg = found ? `🎒 ${results.join(' | ')}\n\n${npc?.emoji || ''} *${npc?.name || npcEncounter}* ظاهر شد!\nمی‌خوای باهاش حرف بزنی؟ 💬` : `${npc?.emoji || ''} *${npc?.name || npcEncounter}* پیداش کردی!\nمی‌خوای باهاش حرف بزنی؟ 💬`;
        return { success: true, message: msg, npcEncounter: npcEncounter, npcImage: npc?.file_id };
    }

    if (!found) {
        const event = triggerRandomEvent(player, 'gather');
        if (event) return { success: true, message: `😞 چیزی پیدا نکردی...\n${event.msg}`, eventImage: event.img };
        return { success: false, message: '😞 چیزی پیدا نکردی!' };
    }

    const event = Math.random() < 0.20 ? triggerRandomEvent(player, 'gather') : null;
    const msg = `🎒 ${results.join(' | ')}`;
    
    if (event) return { success: true, message: `${msg}\n\n${event.msg}`, eventImage: event.img };
    return { success: true, message: msg };
}

module.exports = { gather };