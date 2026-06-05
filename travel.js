const config = require('./config');
const { triggerRandomEvent } = require('./events');

function travel(player, destination) {
    const locations = config.images.locations;
    
    if (!locations || !locations[destination]) {
        return { success: false, message: '❌ این مکان وجود نداره!' };
    }

    if (player.location === destination) {
        return { success: false, message: '⚠️ تو همین جا هستی!' };
    }

    player.travels = (player.travels || 0) + 1;
    const oldLoc = locations[player.location];
    player.location = destination;
    const newLoc = locations[destination];

    let baseMessage = `🚶 از ${oldLoc.emoji} ${oldLoc.name} به ${newLoc.emoji} ${newLoc.name} سفر کردی!\n📝 ${newLoc.description}`;

    // شانس رویداد تصادفی در سفر
    if (Math.random() < 0.35) {
        const eventResult = triggerRandomEvent(player, 'travel');
        if (eventResult && eventResult.eventTriggered) {
            return {
                success: true,
                message: `${baseMessage}\n\n${eventResult.message}`,
                travelImage: newLoc.file_id,
                eventImage: eventResult.image
            };
        }
    }

    return {
        success: true,
        message: baseMessage,
        travelImage: newLoc.file_id
    };
}

module.exports = { travel };