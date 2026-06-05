const config = require('./config');
const { triggerRandomEvent, checkNpcEncounter } = require('./events');

function travel(player, destination) {
    const locations = config.images.locations;
    if (!locations || !locations[destination]) {
        return { success: false, message: '❌ این مکان وجود نداره!' };
    }
    if (player.location === destination) {
        return { success: false, message: '⚠️ همین جا هستی!' };
    }

    const oldLoc = locations[player.location];
    player.location = destination;
    const newLoc = locations[destination];

    let msg = `🚶 ${oldLoc.emoji}→${newLoc.emoji} ${newLoc.name}\n${newLoc.description}`;

    const npcEncounter = checkNpcEncounter(player, 'travel', destination);
    if (npcEncounter) {
        const npc = config.images.npcs[npcEncounter];
        return {
            success: true,
            message: `${msg}\n\n${npc?.emoji || ''} *${npc?.name || npcEncounter}* سر راهت سبز شد!\nمی‌خوای باهاش حرف بزنی؟ 💬`,
            travelImage: newLoc.file_id,
            npcEncounter: npcEncounter,
            npcImage: npc?.file_id
        };
    }

    const event = Math.random() < 0.30 ? triggerRandomEvent(player, 'travel') : null;
    if (event) {
        if (event.teleport) {
            const allLocs = Object.keys(locations).filter(k => k !== player.location);
            const randomLoc = allLocs[Math.floor(Math.random() * allLocs.length)];
            player.location = randomLoc;
            return { success: true, message: `${msg}\n\n${event.msg}\n📍 الان در ${locations[randomLoc].emoji} ${locations[randomLoc].name} هستی!`, travelImage: newLoc.file_id, eventImage: event.img };
        }
        return { success: true, message: `${msg}\n\n${event.msg}`, travelImage: newLoc.file_id, eventImage: event.img };
    }
    
    return { success: true, message: msg, travelImage: newLoc.file_id };
}

module.exports = { travel };