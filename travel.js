const config = require('./config');
const { triggerRandomEvent } = require('./events');

function travel(player, destination) {
    const locations = config.images.locations;
    
    if (!locations[destination]) {
        return { success: false, message: '❌ این مکان وجود نداره!' };
    }

    if (player.location === destination) {
        return { success: false, message: '⚠️ همین جا هستی!' };
    }

    player.travels++;
    player.location = destination;
    const newLoc = locations[destination];

    if (Math.random() < 0.3) {
        const eventResult = triggerRandomEvent(player, 'travel');
        if (eventResult && eventResult.eventTriggered) {
            return {
                success: true,
                message: `🚶 به ${newLoc.emoji} ${newLoc.name} رسیدی!\n${newLoc.description}\n\n${eventResult.message}`,
                eventImage: eventResult.image,
                travelImage: newLoc.file_id
            };
        }
    }

    return {
        success: true,
        message: `🚶 به ${newLoc.emoji} ${newLoc.name} رسیدی!\n${newLoc.description}`,
        travelImage: newLoc.file_id
    };
}

module.exports = { travel };