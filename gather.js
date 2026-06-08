const config = require('./config');
const { triggerRandomEvent, checkNpcEncounter } = require('./events');
const { getTimeOfDay } = require('./player');
const { findEgg, addPet, autoFeedCheck } = require('./pet');
const { findLootBox } = require('./lootbox');
const { updateQuestProgress, getQuestCompletionMessage } = require('./dailyQuest');

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
                
                // آپدیت ماموریت روزانه
                updateQuestProgress(player, 'gather', res.item);
            }
        }
    }

    // انرژی زمان
    if (time.energy > 0) {
        player.energy = Math.min((player.maxEnergy || 100), (player.energy || 0) + time.energy + 5);
        results.push(`⚡ +${time.energy + 5} انرژی`);
    } else if (time.energy < 0) {
        player.energy = Math.max(0, (player.energy || 0) + time.energy);
    } else {
        player.energy = Math.min((player.maxEnergy || 100), (player.energy || 0) + 3);
        results.push(`⚡ +۳ انرژی`);
    }

    player.gathers = (player.gathers || 0) + 1;

    // شانس پیدا کردن تخم حیوون (۱۰٪)
    let petMessage = null;
    let petImage = null;
    const egg = findEgg(player);
    if (egg) {
        const addResult = addPet(player, egg);
        if (addResult.success) {
            petMessage = `\n\n🐾 ${addResult.message}`;
            petImage = addResult.image;
        }
    }

    // شانس پیدا کردن صندوقچه (۵٪)
    let boxMessage = null;
    let boxImage = null;
    const box = findLootBox(player);
    if (box.found) {
        boxMessage = `\n\n${box.box.emoji} *${box.box.name}* پیدا کردی! 📦\nبرو توی بازار بازش کن (🗝️ نیاز: ${box.box.keyCost})`;
        boxImage = box.box.image;
    }

    // چک کردن گرسنگی حیوون
    const hungryMessage = autoFeedCheck(player);

    if (!found) {
        const eventResult = triggerRandomEvent(player, 'gather');
        let msg = '😞 چیزی پیدا نکردی...';
        if (eventResult) msg += `\n${eventResult.msg}`;
        if (petMessage) msg += petMessage;
        if (boxMessage) msg += boxMessage;
        if (hungryMessage) msg += `\n\n🍖 ${hungryMessage}`;
        
        // چک کردن تکمیل ماموریت
        const questComplete = getQuestCompletionMessage(player);
        if (questComplete) msg += `\n\n${questComplete}`;
        
        return { success: true, message: msg, eventImage: eventResult?.img, petImage, boxImage };
    }

    const event = Math.random() < 0.20 ? triggerRandomEvent(player, 'gather') : null;
    let msg = `🎒 ${results.join(' | ')}`;

    if (event) msg += `\n\n${event.msg}`;
    if (petMessage) msg += petMessage;
    if (boxMessage) msg += boxMessage;
    if (hungryMessage) msg += `\n\n🍖 ${hungryMessage}`;
    
    // چک کردن تکمیل ماموریت
    const questComplete2 = getQuestCompletionMessage(player);
    if (questComplete2) msg += `\n\n${questComplete2}`;

    return { 
        success: true, 
        message: msg, 
        eventImage: event?.img, 
        petImage, 
        boxImage 
    };
}

module.exports = { gather };