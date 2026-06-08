const config = require('./config');

const lootBoxes = {
    wooden: {
        name: 'صندوق چوبی',
        emoji: '📦',
        openCost: 0,
        keyCost: 1,
        rewards: [
            { item: 'wood', min: 5, max: 15, chance: 0.4 },
            { item: 'stone', min: 5, max: 15, chance: 0.4 },
            { item: 'meat', min: 3, max: 8, chance: 0.3 },
            { item: 'water', min: 3, max: 8, chance: 0.3 },
            { item: 'gold', min: 10, max: 30, chance: 0.5 },
            { item: 'skin', min: 1, max: 3, chance: 0.2 },
            { item: 'iron', min: 1, max: 3, chance: 0.2 },
            { item: 'key', min: 1, max: 1, chance: 0.1 },
            { item: 'finisher', min: 1, max: 1, chance: 0.05 },
            { pet: true, chance: 0.03, rarity: 'common' }
        ]
    },
    silver: {
        name: 'صندوق نقره‌ای',
        emoji: '📦⚪',
        openCost: 10,
        keyCost: 2,
        rewards: [
            { item: 'wood', min: 10, max: 30, chance: 0.3 },
            { item: 'stone', min: 10, max: 30, chance: 0.3 },
            { item: 'meat', min: 5, max: 15, chance: 0.3 },
            { item: 'gold', min: 30, max: 80, chance: 0.5 },
            { item: 'skin', min: 3, max: 8, chance: 0.3 },
            { item: 'iron', min: 3, max: 8, chance: 0.3 },
            { item: 'key', min: 1, max: 3, chance: 0.2 },
            { item: 'finisher', min: 1, max: 2, chance: 0.1 },
            { item: 'ring', min: 1, max: 1, chance: 0.1 },
            { item: 'spell', min: 1, max: 2, chance: 0.15 },
            { item: 'song', min: 1, max: 1, chance: 0.1 },
            { item: 'tear', min: 1, max: 1, chance: 0.1 },
            { pet: true, chance: 0.05, rarity: 'common' },
            { pet: true, chance: 0.02, rarity: 'rare' }
        ]
    },
    golden: {
        name: 'صندوق طلایی',
        emoji: '📦🟡',
        openCost: 50,
        keyCost: 3,
        rewards: [
            { item: 'gold', min: 50, max: 150, chance: 0.6 },
            { item: 'iron', min: 5, max: 15, chance: 0.4 },
            { item: 'skin', min: 5, max: 12, chance: 0.4 },
            { item: 'key', min: 2, max: 5, chance: 0.3 },
            { item: 'finisher', min: 2, max: 5, chance: 0.2 },
            { item: 'ring', min: 1, max: 3, chance: 0.2 },
            { item: 'spell', min: 2, max: 5, chance: 0.25 },
            { item: 'song', min: 1, max: 3, chance: 0.2 },
            { item: 'tear', min: 1, max: 3, chance: 0.2 },
            { item: 'blood', min: 1, max: 2, chance: 0.15 },
            { item: 'wish', min: 1, max: 2, chance: 0.15 },
            { item: 'diamond', min: 1, max: 2, chance: 0.2 },
            { pet: true, chance: 0.1, rarity: 'rare' },
            { pet: true, chance: 0.03, rarity: 'epic' }
        ]
    },
    legendary: {
        name: 'صندوق افسانه‌ای',
        emoji: '📦🟣',
        openCost: 100,
        keyCost: 5,
        rewards: [
            { item: 'gold', min: 100, max: 500, chance: 0.7 },
            { item: 'iron', min: 10, max: 30, chance: 0.5 },
            { item: 'skin', min: 10, max: 25, chance: 0.5 },
            { item: 'key', min: 3, max: 10, chance: 0.4 },
            { item: 'finisher', min: 5, max: 10, chance: 0.3 },
            { item: 'ring', min: 2, max: 5, chance: 0.3 },
            { item: 'spell', min: 3, max: 8, chance: 0.3 },
            { item: 'song', min: 2, max: 5, chance: 0.3 },
            { item: 'tear', min: 2, max: 5, chance: 0.3 },
            { item: 'blood', min: 2, max: 5, chance: 0.25 },
            { item: 'wish', min: 2, max: 5, chance: 0.25 },
            { item: 'diamond', min: 2, max: 5, chance: 0.3 },
            { item: 'wood', min: 20, max: 50, chance: 0.3 },
            { item: 'stone', min: 20, max: 50, chance: 0.3 },
            { item: 'meat', min: 15, max: 30, chance: 0.3 },
            { item: 'water', min: 15, max: 30, chance: 0.3 },
            { pet: true, chance: 0.15, rarity: 'rare' },
            { pet: true, chance: 0.08, rarity: 'epic' },
            { pet: true, chance: 0.03, rarity: 'legendary' }
        ]
    }
};

function findLootBox(player) {
    if (!player.lootBoxes) player.lootBoxes = { wooden: 0, silver: 0, golden: 0, legendary: 0 };
    
    const r = Math.random();
    
    // ۵٪ شانس پیدا کردن صندوقچه
    if (r < 0.05) {
        const r2 = Math.random();
        if (r2 < 0.60) {
            player.lootBoxes.wooden++;
            return { found: true, type: 'wooden', box: lootBoxes.wooden };
        } else if (r2 < 0.85) {
            player.lootBoxes.silver++;
            return { found: true, type: 'silver', box: lootBoxes.silver };
        } else if (r2 < 0.96) {
            player.lootBoxes.golden++;
            return { found: true, type: 'golden', box: lootBoxes.golden };
        } else {
            player.lootBoxes.legendary++;
            return { found: true, type: 'legendary', box: lootBoxes.legendary };
        }
    }
    
    return { found: false };
}
function openLootBox(player, boxType) {
    if (!player.lootBoxes) player.lootBoxes = { wooden: 0, silver: 0, golden: 0, legendary: 0 };
    
    const box = lootBoxes[boxType];
    if (!box) return { success: false, message: '❌ صندوق نامعتبر!' };
    
    if ((player.lootBoxes[boxType] || 0) < 1) {
        return { success: false, message: `❌ ${box.emoji} *${box.name}* نداری!` };
    }
    
    // چک کردن کلید
    if ((player.inventory?.key || 0) < box.keyCost) {
        return { success: false, message: `❌ کلید کافی نداری!\n🗝️ نیاز: ${box.keyCost} | 🗝️ داری: ${player.inventory?.key || 0}` };
    }
    
    // چک کردن طلا (برای صندوق‌های غیر چوبی)
    if (boxType !== 'wooden' && (player.inventory?.gold || 0) < box.openCost) {
        return { success: false, message: `❌ طلا کافی نداری!\n👑 نیاز: ${box.openCost} | 👑 داری: ${player.inventory?.gold || 0}` };
    }
    
    // کم کردن هزینه
    player.lootBoxes[boxType]--;
    player.inventory.key -= box.keyCost;
    if (boxType !== 'wooden') player.inventory.gold -= box.openCost;
    
    // انتخاب جایزه‌ها
    const rewards = [];
    let petFound = null;
    
    // تعداد جایزه‌های تصادفی (۳ تا ۶ تا)
    const rewardCount = Math.floor(Math.random() * 4) + 3;
    
    for (let i = 0; i < rewardCount; i++) {
        for (let reward of box.rewards) {
            if (Math.random() < reward.chance) {
                if (reward.pet) {
                    // چک کردن شانس حیوون (با توجه به rarity)
                    const petRarity = reward.rarity;
                    const petChance = reward.chance;
                    
                    if (Math.random() < petChance) {
                        const { petTypes, eggTypes } = require('./pet');
                        
                        // انتخاب حیوون بر اساس rarity
                        let availablePets;
                        if (petRarity === 'common') {
                            availablePets = ['wolf_cub'];
                        } else if (petRarity === 'rare') {
                            availablePets = ['wolf_cub', 'dragon_egg'];
                        } else if (petRarity === 'epic') {
                            availablePets = ['dragon_egg'];
                        } else if (petRarity === 'legendary') {
                            availablePets = ['dragon_egg'];
                        } else {
                            availablePets = ['wolf_cub'];
                        }
                        
                        const petType = availablePets[Math.floor(Math.random() * availablePets.length)];
                        const pet = petTypes[petType];
                        
                        petFound = {
                            id: Date.now().toString() + Math.random().toString(36).substr(2, 5),
                            type: petType,
                            name: pet.name,
                            emoji: pet.emoji,
                            level: 1,
                            xp: 0,
                            xpNeeded: 20,
                            attackBonus: pet.attackBonus,
                            defenseBonus: pet.defenseBonus,
                            hpBonus: pet.hpBonus,
                            rarity: pet.rarity,
                            evolveLevel: pet.evolveLevel,
                            evolveTo: pet.evolveTo,
                            foodCost: pet.foodCost,
                            evolveMessage: pet.evolveMessage,
                            foundAt: Date.now()
                        };
                        
                        rewards.push({ type: 'pet', data: petFound });
                    }
                } else {
                    const amount = Math.floor(Math.random() * (reward.max - reward.min + 1)) + reward.min;
                    const itemData = config.images?.resources?.[reward.item];
                    const emoji = itemData?.emoji || '';
                    const name = itemData?.name || reward.item;
                    
                    player.inventory[reward.item] = (player.inventory[reward.item] || 0) + amount;
                    rewards.push({ type: 'item', item: reward.item, amount, emoji, name });
                }
                break; // فقط یه جایزه از هر نوع
            }
        }
    }
    
    // ساخت پیام
    let message = `${box.emoji} *${box.name}* باز شد!\n\n🎁 *جایزه‌ها:*\n`;
    
    for (let reward of rewards) {
        if (reward.type === 'item') {
            message += `${reward.emoji} ${reward.name}: +${reward.amount}\n`;
        } else if (reward.type === 'pet') {
            message += `🐾 ${reward.data.emoji} *${reward.data.name}* (حیوون جدید!)\n`;
        }
    }
    
    if (rewards.length === 0) {
        message += '😞 هیچی...\n';
    }
    
    message += `\n🗝️ -${box.keyCost} کلید`;
    if (boxType !== 'wooden') message += `\n👑 -${box.openCost} طلا`;
    message += `\n\n📦 صندوق‌های باقی‌مانده:\n`;
    message += `📦 چوبی: ${player.lootBoxes.wooden || 0}\n`;
    message += `📦 نقره‌ای: ${player.lootBoxes.silver || 0}\n`;
    message += `📦 طلایی: ${player.lootBoxes.golden || 0}\n`;
    message += `📦 افسانه‌ای: ${player.lootBoxes.legendary || 0}`;
    
    return { 
        success: true, 
        message, 
        pet: petFound,
        rewards: rewards.filter(r => r.type === 'item')
    };
}

function formatLootBoxes(player) {
    if (!player.lootBoxes) player.lootBoxes = { wooden: 0, silver: 0, golden: 0, legendary: 0 };
    
    const total = (player.lootBoxes.wooden || 0) + (player.lootBoxes.silver || 0) + (player.lootBoxes.golden || 0) + (player.lootBoxes.legendary || 0);
    
    if (total === 0) {
        return '📦 *صندوقچه‌های گنج*\n\n❌ هیچ صندوقی نداری!\n💡 موقع جمع‌آوری و سفر شانس پیدا کردن داری (۵٪)';
    }
    
    let msg = '📦 *صندوقچه‌های گنج*\n\n';
    
    if (player.lootBoxes.wooden > 0) msg += `📦 صندوق چوبی: ${player.lootBoxes.wooden} عدد (رایگان - ۱🗝️)\n`;
    if (player.lootBoxes.silver > 0) msg += `📦⚪ صندوق نقره‌ای: ${player.lootBoxes.silver} عدد (۱۰👑 - ۲🗝️)\n`;
    if (player.lootBoxes.golden > 0) msg += `📦🟡 صندوق طلایی: ${player.lootBoxes.golden} عدد (۵۰👑 - ۳🗝️)\n`;
    if (player.lootBoxes.legendary > 0) msg += `📦🟣 صندوق افسانه‌ای: ${player.lootBoxes.legendary} عدد (۱۰۰👑 - ۵🗝️)\n`;
    
    msg += `\n🗝️ کلیدهای تو: ${player.inventory?.key || 0}\n`;
    msg += `👑 طلای تو: ${player.inventory?.gold || 0}`;
    
    return msg;
}

function getLootBoxKeyboard(player) {
    if (!player.lootBoxes) player.lootBoxes = { wooden: 0, silver: 0, golden: 0, legendary: 0 };
    
    const buttons = [];
    
    if (player.lootBoxes.wooden > 0) buttons.push(['📦 باز کردن صندوق چوبی']);
    if (player.lootBoxes.silver > 0) buttons.push(['📦⚪ باز کردن صندوق نقره‌ای']);
    if (player.lootBoxes.golden > 0) buttons.push(['📦🟡 باز کردن صندوق طلایی']);
    if (player.lootBoxes.legendary > 0) buttons.push(['📦🟣 باز کردن صندوق افسانه‌ای']);
    
    buttons.push(['🔙 برگشت']);
    
    return { reply_markup: { keyboard: buttons, resize_keyboard: true } };
}

module.exports = {
    lootBoxes,
    findLootBox,
    openLootBox,
    formatLootBoxes,
    getLootBoxKeyboard
};