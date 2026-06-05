const config = require('./config');
const { triggerRandomEvent } = require('./events');

function gather(player) {
    const resources = config.locationResources[player.location];
    
    if (!resources || resources.length === 0) {
        return { success: false, message: '❌ اینجا چیزی برای جمع‌آوری نیست!' };
    }

    const results = [];
    let found = false;

    for (let res of resources) {
        if (Math.random() <= res.chance) {
            const amount = Math.floor(Math.random() * (res.max - res.min + 1)) + res.min;
            if (amount > 0) {
                player.inventory[res.item] += amount;
                const itemData = config.images.resources[res.item];
                if (itemData) {
                    results.push(`${itemData.emoji} ${itemData.name}: +${amount}`);
                }
                found = true;
            }
        }
    }

    player.gathers = (player.gathers || 0) + 1;

    if (!found) {
        const eventResult = triggerRandomEvent(player, 'gather');
        if (eventResult && eventResult.eventTriggered) {
            return { 
                success: true, 
                message: `😞 چیزی پیدا نکردی...\n\n${eventResult.message}`,
                eventImage: eventResult.image 
            };
        }
        return { success: false, message: '😞 چیزی پیدا نکردی... شانس دفعه بعد!' };
    }

    // شانس رویداد تصادفی
    if (Math.random() < 0.20) {
        const eventResult = triggerRandomEvent(player, 'gather');
        if (eventResult && eventResult.eventTriggered) {
            return {
                success: true,
                message: `🎒 *جمع‌آوری:*\n${results.join('\n')}\n\n${eventResult.message}`,
                eventImage: eventResult.image
            };
        }
    }

    return { 
        success: true, 
        message: `🎒 *جمع‌آوری:*\n${results.join('\n')}` 
    };
}

module.exports = { gather };