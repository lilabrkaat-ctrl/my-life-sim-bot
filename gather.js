const config = require('./config');

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
                results.push(`${amount} ${itemData.emoji} ${itemData.name}`);
                found = true;
            }
        }
    }

    if (!found) {
        return { success: false, message: '❌ چیزی پیدا نکردی! شانس دفعه بعد...' };
    }

    const loc = config.images.locations[player.location];
    return {
        success: true,
        message: `🔍 در ${loc.emoji} ${loc.name} گشتی زدی:\n${results.join('\n')}`
    };
}

module.exports = { gather };