const config = require('./config');

const blackMarketItems = [
    { name: 'الماس', emoji: '💎', item: 'diamond', min: 1, max: 3, price: 200, chance: 0.3 },
    { name: 'حلقه نامزدی', emoji: '💍', item: 'ring', min: 1, max: 2, price: 150, chance: 0.25 },
    { name: 'فنیشر', emoji: '💀', item: 'finisher', min: 3, max: 8, price: 100, chance: 0.4 },
    { name: 'طلسم', emoji: '📜', item: 'spell', min: 2, max: 5, price: 80, chance: 0.35 },
    { name: 'آرزو', emoji: '🔮', item: 'wish', min: 1, max: 3, price: 120, chance: 0.3 },
    { name: 'کلید', emoji: '🗝️', item: 'key', min: 5, max: 15, price: 60, chance: 0.5 },
    { name: 'توله گرگ', emoji: '🐺', pet: 'wolf_cub', price: 300, chance: 0.2 },
    { name: 'بچه اژدها', emoji: '🐉', pet: 'dragon_egg', price: 500, chance: 0.1 }
];

const specialDeals = [
    { give: 'wood', giveAmount: 50, get: 'gold', getAmount: 100, emoji: '🪵→👑', name: '۵۰ چوب = ۱۰۰ طلا' },
    { give: 'stone', giveAmount: 40, get: 'iron', getAmount: 20, emoji: '🪨→⛏️', name: '۴۰ سنگ = ۲۰ آهن' },
    { give: 'meat', giveAmount: 30, get: 'gold', getAmount: 80, emoji: '🍖→👑', name: '۳۰ گوشت = ۸۰ طلا' },
    { give: 'water', giveAmount: 50, get: 'energy_item', getAmount: 100, emoji: '💧→⚡', name: '۵۰ آب = ۱۰۰ انرژی' },
    { give: 'skin', giveAmount: 20, get: 'key', getAmount: 5, emoji: '🦴→🗝️', name: '۲۰ پوست = ۵ کلید' },
    { give: 'gold', giveAmount: 200, get: 'diamond', getAmount: 1, emoji: '👑→💎', name: '۲۰۰ طلا = ۱ الماس' }
];

function initBlackMarket(player) {
    if (!player.blackMarket) {
        player.blackMarket = {
            items: [],
            specialDeal: null,
            lastRefresh: 0
        };
    }
    
    const now = Date.now();
    if (now - player.blackMarket.lastRefresh > 3 * 60 * 60 * 1000 || player.blackMarket.items.length === 0) {
        refreshBlackMarket(player);
    }
    
    return player.blackMarket;
}

function refreshBlackMarket(player) {
    const items = [];
    const available = [...blackMarketItems];
    
    while (items.length < 4 && available.length > 0) {
        const index = Math.floor(Math.random() * available.length);
        const item = available[index];
        
        if (Math.random() < item.chance) {
            const amount = item.min ? Math.floor(Math.random() * (item.max - item.min + 1)) + item.min : 1;
            items.push({
                ...item,
                amount,
                id: Date.now() + items.length
            });
        }
        
        available.splice(index, 1);
    }
    
    const dealIndex = Math.floor(Math.random() * specialDeals.length);
    
    player.blackMarket = {
        items,
        specialDeal: specialDeals[dealIndex],
        lastRefresh: Date.now()
    };
    
    return player.blackMarket;
}

function buyBlackMarketItem(player, itemId) {
    initBlackMarket(player);
    
    const item = player.blackMarket.items.find(i => i.id === itemId);
    if (!item) return { success: false, message: '❌ آیتم پیدا نشد!' };
    
    if ((player.inventory?.gold || 0) < item.price) {
        return { success: false, message: `❌ طلا کمه!\n👑 نیاز: ${item.price}\n👑 داری: ${player.inventory?.gold || 0}` };
    }
    
    player.inventory.gold -= item.price;
    
    if (item.pet) {
        const { petTypes, addPet } = require('./pet');
        const pet = petTypes[item.pet];
        const newPet = {
            id: Date.now().toString(),
            type: item.pet,
            name: pet.name,
            emoji: pet.emoji,
            image: pet.image,
            level: 1, xp: 0, xpNeeded: 20,
            attackBonus: pet.attackBonus,
            defenseBonus: pet.defenseBonus,
            hpBonus: pet.hpBonus,
            rarity: pet.rarity,
            evolveLevel: pet.evolveLevel,
            evolveTo: pet.evolveTo,
            foodCost: pet.foodCost,
            foundAt: Date.now()
        };
        const result = addPet(player, newPet);
        player.blackMarket.items = player.blackMarket.items.filter(i => i.id !== itemId);
        return { success: true, message: `✅ ${result.message}\n👑 -${item.price} طلا` };
    } else {
        player.inventory[item.item] = (player.inventory[item.item] || 0) + item.amount;
        player.blackMarket.items = player.blackMarket.items.filter(i => i.id !== itemId);
        return { success: true, message: `✅ ${item.emoji} ${item.name} +${item.amount}\n👑 -${item.price} طلا` };
    }
}

function acceptSpecialDeal(player) {
    initBlackMarket(player);
    
    if (!player.blackMarket.specialDeal) {
        return { success: false, message: '❌ الان معامله خاصی نیست!' };
    }
    
    const deal = player.blackMarket.specialDeal;
    
    if ((player.inventory[deal.give] || 0) < deal.giveAmount) {
        return { success: false, message: `❌ ${deal.give} کافی نداری!\nنیاز: ${deal.giveAmount}\nداری: ${player.inventory[deal.give] || 0}` };
    }
    
    player.inventory[deal.give] -= deal.giveAmount;
    
    if (deal.get === 'energy_item') {
        player.energy = Math.min((player.maxEnergy || 100), (player.energy || 0) + deal.getAmount);
    } else {
        player.inventory[deal.get] = (player.inventory[deal.get] || 0) + deal.getAmount;
    }
    
    const getName = deal.get === 'energy_item' ? 'انرژی' : deal.get;
    player.blackMarket.specialDeal = null;
    
    return { success: true, message: `✅ معامله انجام شد!\n${deal.emoji}\n-${deal.giveAmount} ${deal.give}\n+${deal.getAmount} ${getName}` };
}

function formatBlackMarket(player) {
    initBlackMarket(player);
    
    const now = Date.now();
    const timeLeft = player.blackMarket.lastRefresh + 3 * 60 * 60 * 1000 - now;
    const hoursLeft = Math.floor(timeLeft / (60 * 60 * 1000));
    const minutesLeft = Math.floor((timeLeft % (60 * 60 * 1000)) / (60 * 1000));
    
    let msg = '🕶️ *بازار مکاره*\n\n';
    msg += `⏰ ${hoursLeft}h ${minutesLeft}m تا تعویض\n\n`;
    
    if (player.blackMarket.items.length === 0) {
        msg += '❌ همه چی فروش رفت!\n🔄 صبر کن تا جنس جدید بیاد...\n';
    } else {
        msg += '📦 *کالاهای امروز:*\n';
        for (let i = 0; i < player.blackMarket.items.length; i++) {
            const item = player.blackMarket.items[i];
            msg += `${i+1}. ${item.emoji} ${item.name} x${item.amount || 1}: ${item.price}👑\n`;
        }
    }
    
    if (player.blackMarket.specialDeal) {
        msg += `\n🤝 *معامله ویژه:*\n${player.blackMarket.specialDeal.emoji}\n${player.blackMarket.specialDeal.name}`;
    }
    
    msg += `\n\n👑 طلای تو: ${player.inventory?.gold || 0}`;
    
    return msg;
}

function getBlackMarketKeyboard(player) {
    initBlackMarket(player);
    
    const buttons = [];
    
    for (let i = 0; i < player.blackMarket.items.length; i++) {
        const item = player.blackMarket.items[i];
        buttons.push([`🛒 خرید ${item.id}`]);
    }
    
    if (player.blackMarket.specialDeal) {
        buttons.push(['🤝 معامله ویژه']);
    }
    
    buttons.push(['🔙 بازار']);
    
    return { reply_markup: { keyboard: buttons, resize_keyboard: true } };
}

module.exports = {
    blackMarketItems,
    specialDeals,
    initBlackMarket,
    refreshBlackMarket,
    buyBlackMarketItem,
    acceptSpecialDeal,
    formatBlackMarket,
    getBlackMarketKeyboard
};