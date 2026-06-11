const config = require('./config');
const { triggerRandomEvent, checkNpcEncounter } = require('./events');
const { getTimeOfDay } = require('./player');
const { findEgg, addPet, autoFeedCheck } = require('./pet');
const { findLootBox } = require('./lootbox');
const { updateQuestProgress, getQuestCompletionMessage } = require('./dailyQuest');

function gather(player) {
    const resources = config.locationResources && config.locationResources[player.location];
    if (!resources || resources.length === 0) {
        return { success: false, message: '❌ اینجا چیزی نیست!' };
    }

    const time = getTimeOfDay();
    player.timeOfDay = time;
    const bonus = time.resourceBonus || 0;

    const results = [];
    let found = false;

    for (let res of resources) {
        if (!res || !res.chance) continue;
        
        if (Math.random() <= res.chance) {
            let min = Math.max(1, Math.floor((res.min || 1) * (1 + bonus)));
            let max = Math.max(1, Math.floor((res.max || 1) * (1 + bonus)));
            const amount = Math.floor(Math.random() * (max - min + 1)) + min;
            
            if (amount > 0) {
                if (!player.inventory) player.inventory = {};
                player.inventory[res.item] = (player.inventory[res.item] || 0) + amount;
                
                const itemData = (config.images && config.images.resources) ? config.images.resources[res.item] : null;
                if (itemData) {
                    results.push(`${itemData.emoji} +${amount}`);
                } else {
                    results.push(`+${amount} ${res.item}`);
                }
                found = true;

                // آپدیت ماموریت روزانه
                try { updateQuestProgress(player, 'gather', res.item); } catch (e) {}
            }
        }
    }

    // انرژی زمان
    if (!player.energy) player.energy = 0;
    if (!player.maxEnergy) player.maxEnergy = 100;
    
    if (time.energy > 0) {
        player.energy = Math.min(player.maxEnergy, player.energy + time.energy + 5);
        results.push(`⚡ +${time.energy + 5} انرژی`);
    } else if (time.energy < 0) {
        player.energy = Math.max(0, player.energy + time.energy);
    } else {
        player.energy = Math.min(player.maxEnergy, player.energy + 3);
        results.push(`⚡ +۳ انرژی`);
    }

    player.gathers = (player.gathers || 0) + 1;

    // شانس پیدا کردن تخم حیوون (۱۰٪)
    let petMessage = null;
    let petImage = null;
    try {
        const egg = findEgg(player);
        if (egg) {
            const addResult = addPet(player, egg);
            if (addResult && addResult.success) {
                petMessage = `\n\n🐾 ${addResult.message}`;
                petImage = addResult.image;
            }
        }
    } catch (e) {}

    // شانس پیدا کردن صندوقچه (۵٪)
    let boxMessage = null;
    let boxImage = null;
    try {
        const box = findLootBox(player);
        if (box && box.found && box.box) {
            boxMessage = `\n\n${box.box.emoji} *${box.box.name}* پیدا کردی! 📦\nبرو توی بازار بازش کن (🗝️ نیاز: ${box.box.keyCost || 0})`;
            boxImage = box.box.image;
        }
    } catch (e) {}

    // چک کردن گرسنگی حیوون
    let hungryMessage = null;
    try { hungryMessage = autoFeedCheck(player); } catch (e) {}

    if (!found) {
        let eventResult = null;
        try { eventResult = triggerRandomEvent(player, 'gather'); } catch (e) {}
        
        let msg = '😞 چیزی پیدا نکردی...';
        if (eventResult) msg += `\n${eventResult.msg}`;
        if (petMessage) msg += petMessage;
        if (boxMessage) msg += boxMessage;
        if (hungryMessage) msg += `\n\n🍖 ${hungryMessage}`;

        try {
            const questComplete = getQuestCompletionMessage(player);
            if (questComplete) msg += `\n\n${questComplete}`;
        } catch (e) {}

        return { success: true, message: msg, eventImage: eventResult?.img, petImage, boxImage };
    }

    let event = null;
    try { event = Math.random() < 0.20 ? triggerRandomEvent(player, 'gather') : null; } catch (e) {}
    
    let msg = `🎒 ${results.join(' | ')}`;
    if (event) msg += `\n\n${event.msg}`;
    if (petMessage) msg += petMessage;
    if (boxMessage) msg += boxMessage;
    if (hungryMessage) msg += `\n\n🍖 ${hungryMessage}`;

    try {
        const questComplete2 = getQuestCompletionMessage(player);
        if (questComplete2) msg += `\n\n${questComplete2}`;
    } catch (e) {}

    return { 
        success: true, 
        message: msg, 
        eventImage: event?.img, 
        petImage, 
        boxImage 
    };
}

module.exports = { gather };