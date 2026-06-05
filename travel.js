const config = require('./config');

function travel(player, destination) {
    const locations = config.images.locations;
    
    if (!locations[destination]) {
        return { success: false, message: '❌ این مکان وجود نداره!' };
    }

    if (player.location === destination) {
        return { success: false, message: '⚠️ تو همین جا هستی!' };
    }

    const oldLoc = locations[player.location];
    const newLoc = locations[destination];
    
    player.location = destination;
    
    return {
        success: true,
        message: `🚶 از ${oldLoc.emoji} ${oldLoc.name} به ${newLoc.emoji} ${newLoc.name} سفر کردی.`
    };
}

function showTravelMenu() {
    const locations = config.images.locations;
    let menu = '🗺️ *نقشه سفر*\n\n';
    
    for (let key in locations) {
        const loc = locations[key];
        menu += `${loc.emoji} ${loc.name}: /travel_${key}\n`;
    }
    
    return menu;
}

module.exports = { travel, showTravelMenu };