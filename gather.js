const config = require('./config');
const { triggerRandomEvent } = require('./events');

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
                results.push(`${config.images.resources[res.item].emoji} ${config.images.resources[res.item].name}: +${amount}`);
                found = true;
            }
        }
    }

    player.gathers++;

    if (!found) {
        const eventResult = triggerRandomEvent(player, 'gather');
        if (eventResult) return eventResult;
        return { success: false, message: '😞 چیزی پیدا نکردی...' };
    }

    if (Math.random() < 0.15) {
        const eventResult = triggerRandomEvent(player, 'gather');
        if (eventResult && eventResult.eventTriggered) {
            return {
                success: true,
                message: `🎒 جمع‌آوری:\n${results.join('\n')}\n\n${eventResult.message}`,
                eventImage: eventResult.image
            };
        }
    }

    return { success: true, message: `🎒 جمع‌آوری:\n${results.join('\n')}` };
}

module.exports = { gather };