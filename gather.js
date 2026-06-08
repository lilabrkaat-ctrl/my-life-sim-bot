const config = require('./config');
const { triggerRandomEvent, checkNpcEncounter } = require('./events');
const { getTimeOfDay } = require('./player');

function gather(player) {
    const resources = config.locationResources[player.location];
    if (!resources || resources.length === 0) {
        return { success: false, message: '❌ اینجا چیزی نیست!' };
    }

    const time = getTimeOfDay();
    player.timeOfDay = time;
    const bonus = time.resourceBonus;

    const results = [];
    let found = false;

    for (let res of resources) {
        if (Math.random() <= res.chance) {
            let min = Math.max(1, Math.floor(res.min * (1 + bonus)));
            let max = Math.max(1, Math.floor(res.max * (1 + bonus)));
            const amount = Math.floor(Math.random() * (max - min + 1)) + min;
            if (amount > 0) {
                player.inventory[res.item] = (player.inventory[res.item] || 0) + amount;
                const itemData = config.images.resources[res.item];
                if (itemData) results.push(`${itemData.emoji} +${amount}`);
                found = true;
            }
        }
    }

    // انرژی زمان
    if (time.energy > 0) {
        player.energy = Math.min((player.maxEnergy || 100), (player.energy || 0) + time.energy);
        results.push(`⚡ +${time.energy} انرژی`);
    } else if (time.energy < 0) {
        player.energy = Math.max(0, (player.energy || 0) + time.energy);
    }

    player.gathers = (player.gathers || 0) + 1;

    if (!found) {
        const eventResult = triggerRandomEvent(player, 'gather');
        // اصلاح: چک می‌کنیم eventResult وجود داره یا نه (به جای eventTriggered)
        if (eventResult) {
            return { success: true, message: `😞 چیزی پیدا نکردی...\n${eventResult.msg}`, eventImage: eventResult.img };
        }
        return { success: false, message: '😞 چیزی پیدا نکردی...' };
    }

    const event = Math.random() < 0.20 ? triggerRandomEvent(player, 'gather') : null;
    const msg = `🎒 ${results.join(' | ')}`;

    // اصلاح: چک می‌کنیم event وجود داره (به جای event.eventTriggered)
    if (event) return { success: true, message: `${msg}\n\n${event.msg}`, eventImage: event.img };
    return { success: true, message: msg };
}

module.exports = { gather };