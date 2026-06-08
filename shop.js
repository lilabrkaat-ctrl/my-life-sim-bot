const config = require('./config');
const { getTimeOfDay } = require('./player');

const shopState = {};

// تابع محاسبه قیمت پویا بر اساس شب/روز
function getDynamicPrice(basePrice, isNight) {
    if (isNight) return Math.floor(basePrice * 0.8); // شب: ۲۰٪ تخفیف
    return Math.floor(basePrice * 1.2); // روز: ۲۰٪ گران‌تر
}

function showShopMenu() {
    return `🏪 *بازار باستانی*\n\n📥 *خرید با طلا:*\n🪵 چوب: ۲👑 | 🪨 سنگ: ۳👑\n🍖 گوشت: ۳👑 | 💧 آب: ۱👑\n🦴 پوست: ۵👑 | ⛏️ آهن: ۸👑\n💀 فنیشر: ۵۰👑 | ⚡ انرژی: ۱۰👑 (+۲۰⚡)\n\n⚡ *خرید با انرژی:*\n🪵 چوب: ۵⚡ | 🪨 سنگ: ۷⚡\n🍖 گوشت: ۷⚡ | 💧 آب: ۳⚡\n🦴 پوست: ۱۲⚡ | ⛏️ آهن: ۱۸⚡\n💀 فنیشر: ۱۲۰⚡\n\n📤 *فروش برای طلا:*\n💎 الماس: ۱۰۰👑\n🪵 چوب: ۱👑 | 🪨 سنگ: ۲👑\n🍖 گوشت: ۲👑 | 💧 آب: ۰👑\n🦴 پوست: ۳👑 | ⛏️ آهن: ۵👑\n\n🔥 *فروش برای انرژی:*\n🪵 چوب: ۲⚡ | 🪨 سنگ: ۳⚡\n🍖 گوشت: ۳⚡ | 💧 آب: ۱⚡\n🦴 پوست: ۵⚡ | ⛏️ آهن: ۸⚡\n💎 الماس: ۸۰⚡`;
}

// ======================== خرید با طلا (قبلی + تخفیف شب/روز) ========================

function startBuy(player, item) {
    const time = getTimeOfDay();
    const isNight = (time.name === 'شب');
    const priceNote = isNight ? '🌙 تخفیف شب' : '☀️ قیمت روز';
    
    if (item === 'finisher') {
        const basePrice = config.shopPrices.finisher.buy;
        const price = getDynamicPrice(basePrice, isNight);
        if ((player.inventory.gold || 0) < price) {
            return { success: false, message: `❌ طلا کمه!\n💰 نیاز: ${price}👑\n👑 داری: ${player.inventory.gold||0}👑` };
        }
        player.inventory.gold -= price;
        player.inventory.finisher = (player.inventory.finisher || 0) + 1;
        return { success: true, message: `✅ 💀 فنیشر خریدی!\n💰 -${price}👑 (${priceNote})\n💀 موجودی: ${player.inventory.finisher}` };
    }
    
    if (item === 'energy') {
        const price = getDynamicPrice(10, isNight);
        if ((player.inventory.gold || 0) < price) {
            return { success: false, message: `❌ طلا کمه!\n💰 نیاز: ${price}👑\n👑 داری: ${player.inventory.gold||0}👑` };
        }
        player.inventory.gold -= price;
        player.energy = Math.min((player.maxEnergy || 100), (player.energy || 0) + 20);
        return { success: true, message: `✅ ⚡ +۲۰ انرژی!\n💰 -${price}👑 (${priceNote})\n⚡ انرژی: ${player.energy}/${player.maxEnergy||100}` };
    }
    
    if (item === 'diamond') {
        return startSell(player, 'diamond');
    }
    
    const p = config.shopPrices[item];
    if (!p) return { success: false, message: '❌ آیتم نامعتبر!' };
    
    const dynamicPrice = getDynamicPrice(p.buy, isNight);
    shopState[player.chatId || 'default'] = { action: 'buy', item: item, price: dynamicPrice };
    
    return { 
        success: true, 
        message: `🛒 *خرید ${p.emoji} ${p.name}*\n⏰ ${time.emoji} ${time.name} | ${priceNote}\n💰 قیمت هر عدد: ${dynamicPrice}👑\n👑 موجودی تو: ${player.inventory.gold||0}👑\n\n📝 *چند تا می‌خوای؟* (عدد رو تایپ کن)\nیا بزن /cancel لغو کن` 
    };
}

function buyItem(player, item, amount = 1) {
    const p = config.shopPrices[item];
    if (!p) return { success: false, message: '❌ وجود نداره!' };
    
    const state = shopState[player.chatId || 'default'];
    const pricePerUnit = state?.price || p.buy;
    
    const totalCost = pricePerUnit * amount;
    
    if ((player.inventory.gold || 0) < totalCost) {
        delete shopState[player.chatId || 'default'];
        return { success: false, message: `❌ طلا کمه!\n💰 نیاز: ${totalCost}👑\n👑 داری: ${player.inventory.gold||0}👑` };
    }
    
    player.inventory.gold -= totalCost;
    player.inventory[item] = (player.inventory[item] || 0) + amount;
    delete shopState[player.chatId || 'default'];
    
    return { 
        success: true, 
        message: `✅ *خرید موفق!*\n\n${p.emoji} ${p.name}: +${amount}\n💰 هزینه: ${totalCost}👑\n👑 باقی‌مانده: ${player.inventory.gold}👑` 
    };
}

// ======================== فروش برای طلا (قبلی) ========================

function startSell(player, item) {
    const time = getTimeOfDay();
    const isNight = (time.name === 'شب');
    const priceNote = isNight ? '🌙 تخفیف شب' : '☀️ قیمت روز';
    
    if (item === 'diamond') {
        if ((player.inventory.diamond || 0) < 1) {
            return { success: false, message: '❌ الماس نداری!' };
        }
        player.inventory.diamond--;
        player.inventory.gold = (player.inventory.gold || 0) + 100;
        return { success: true, message: `💎 الماس فروخته شد! +۱۰۰👑\n👑 موجودی: ${player.inventory.gold}` };
    }
    
    const p = config.shopPrices[item];
    if (!p) return { success: false, message: '❌ آیتم نامعتبر!' };
    
    const dynamicPrice = getDynamicPrice(p.sell, isNight);
    shopState[player.chatId || 'default'] = { action: 'sell', item: item, price: dynamicPrice };
    
    return { 
        success: true, 
        message: `📤 *فروش ${p.emoji} ${p.name}*\n⏰ ${time.emoji} ${time.name} | ${priceNote}\n💰 قیمت هر عدد: ${dynamicPrice}👑\n🎒 موجودی تو: ${player.inventory[item] || 0} عدد\n\n📝 *چند تا می‌خوای بفروشی؟* (عدد رو تایپ کن)\nیا بزن /cancel لغو کن` 
    };
}

function sellItem(player, item, amount = 1) {
    const p = config.shopPrices[item];
    if (!p) return { success: false, message: '❌ وجود نداره!' };
    
    const state = shopState[player.chatId || 'default'];
    const pricePerUnit = state?.price || p.sell;
    
    if ((player.inventory[item] || 0) < amount) {
        delete shopState[player.chatId || 'default'];
        return { success: false, message: `❌ به اندازه کافی نداری!\n🎒 داری: ${player.inventory[item] || 0} عدد` };
    }
    
    const totalEarn = pricePerUnit * amount;
    player.inventory[item] -= amount;
    player.inventory.gold = (player.inventory.gold || 0) + totalEarn;
    delete shopState[player.chatId || 'default'];
    
    return { 
        success: true, 
        message: `✅ *فروش موفق!*\n\n${p.emoji} ${p.name}: -${amount}\n💰 دریافتی: ${totalEarn}👑\n👑 موجودی: ${player.inventory.gold}👑` 
    };
}

// ======================== خرید با انرژی (جدید) ========================

function startBuyWithEnergy(player, item) {
    const energyPrices = {
        wood: { cost: 5, emoji: '🪵', name: 'چوب' },
        stone: { cost: 7, emoji: '🪨', name: 'سنگ' },
        meat: { cost: 7, emoji: '🍖', name: 'گوشت' },
        water: { cost: 3, emoji: '💧', name: 'آب' },
        skin: { cost: 12, emoji: '🦴', name: 'پوست' },
        iron: { cost: 18, emoji: '⛏️', name: 'آهن' },
        finisher: { cost: 120, emoji: '💀', name: 'فنیشر' }
    };
    
    const p = energyPrices[item];
    if (!p) return { success: false, message: '❌ با انرژی قابل خرید نیست!' };
    
    if ((player.energy || 0) < p.cost) {
        return { 
            success: false, 
            message: `❌ انرژی کمه!\n⚡ نیاز: ${p.cost}\n⚡ داری: ${player.energy || 0}\n\n💡 راه‌های کسب انرژی:\n☀️ جمع‌آوری در صبح\n⚡ رعد و برق\n🌟 ستاره دنباله‌دار\n🔥 آتش\n🦅 عقاب` 
        };
    }
    
    shopState[player.chatId || 'default'] = { action: 'buyWithEnergy', item: item, energyCost: p.cost };
    
    return { 
        success: true, 
        message: `⚡ *خرید با انرژی*\n\n${p.emoji} ${p.name}\n⚡ قیمت هر عدد: ${p.cost} انرژی\n⚡ انرژی داری: ${player.energy || 0}/${player.maxEnergy || 100}\n\n📝 *چند تا می‌خوای؟* (عدد رو تایپ کن)\nیا بزن /cancel لغو کن` 
    };
}

function buyItemWithEnergy(player, item, amount, energyCostPerUnit) {
    const energyPrices = {
        wood: { emoji: '🪵', name: 'چوب' },
        stone: { emoji: '🪨', name: 'سنگ' },
        meat: { emoji: '🍖', name: 'گوشت' },
        water: { emoji: '💧', name: 'آب' },
        skin: { emoji: '🦴', name: 'پوست' },
        iron: { emoji: '⛏️', name: 'آهن' },
        finisher: { emoji: '💀', name: 'فنیشر' }
    };
    
    const totalEnergy = energyCostPerUnit * amount;
    
    if ((player.energy || 0) < totalEnergy) {
        delete shopState[player.chatId || 'default'];
        return { 
            success: false, 
            message: `❌ انرژی کافی نیست!\n⚡ نیاز: ${totalEnergy}\n⚡ داری: ${player.energy || 0}` 
        };
    }
    
    player.energy -= totalEnergy;
    player.inventory[item] = (player.inventory[item] || 0) + amount;
    delete shopState[player.chatId || 'default'];
    
    const p = energyPrices[item];
    return { 
        success: true, 
        message: `✅ *خرید با انرژی موفق!*\n\n${p.emoji} ${p.name}: +${amount}\n⚡ هزینه: ${totalEnergy} انرژی\n⚡ انرژی باقی‌مانده: ${player.energy}/${player.maxEnergy || 100}` 
    };
}

// ======================== فروش برای انرژی (جدید) ========================

function startSellForEnergy(player, item) {
    const energyRewards = {
        wood: { reward: 2, emoji: '🪵', name: 'چوب' },
        stone: { reward: 3, emoji: '🪨', name: 'سنگ' },
        meat: { reward: 3, emoji: '🍖', name: 'گوشت' },
        water: { reward: 1, emoji: '💧', name: 'آب' },
        skin: { reward: 5, emoji: '🦴', name: 'پوست' },
        iron: { reward: 8, emoji: '⛏️', name: 'آهن' },
        diamond: { reward: 80, emoji: '💎', name: 'الماس' }
    };
    
    const p = energyRewards[item];
    if (!p) return { success: false, message: '❌ با انرژی قابل فروش نیست!' };
    
    if ((player.inventory[item] || 0) < 1) {
        return { success: false, message: `❌ ${p.emoji} ${p.name} نداری!` };
    }
    
    shopState[player.chatId || 'default'] = { action: 'sellForEnergy', item: item, energyReward: p.reward };
    
    return { 
        success: true, 
        message: `🔥 *فروش برای انرژی*\n\n${p.emoji} ${p.name}\n⚡ دریافت انرژی هر عدد: ${p.reward}\n🎒 داری: ${player.inventory[item] || 0}\n\n📝 *چند تا می‌خوای بفروشی؟* (عدد رو تایپ کن)\nیا بزن /cancel لغو کن` 
    };
}

function sellItemForEnergy(player, item, amount, energyRewardPerUnit) {
    const energyRewards = {
        wood: { emoji: '🪵', name: 'چوب' },
        stone: { emoji: '🪨', name: 'سنگ' },
        meat: { emoji: '🍖', name: 'گوشت' },
        water: { emoji: '💧', name: 'آب' },
        skin: { emoji: '🦴', name: 'پوست' },
        iron: { emoji: '⛏️', name: 'آهن' },
        diamond: { emoji: '💎', name: 'الماس' }
    };
    
    if ((player.inventory[item] || 0) < amount) {
        delete shopState[player.chatId || 'default'];
        return { success: false, message: `❌ به اندازه کافی نداری!\n🎒 داری: ${player.inventory[item] || 0}` };
    }
    
    const totalEnergy = energyRewardPerUnit * amount;
    const maxEnergy = player.maxEnergy || 100;
    const newEnergy = Math.min(maxEnergy, (player.energy || 0) + totalEnergy);
    const gained = newEnergy - (player.energy || 0);
    
    player.inventory[item] -= amount;
    player.energy = newEnergy;
    delete shopState[player.chatId || 'default'];
    
    const p = energyRewards[item];
    return { 
        success: true, 
        message: `✅ *فروش موفق!*\n\n${p.emoji} ${p.name}: -${amount}\n⚡ دریافت: ${gained} انرژی\n⚡ انرژی: ${player.energy}/${maxEnergy}` 
    };
}

// ======================== تابع اصلی پردازش ========================

function processAmount(player, amount) {
    const state = shopState[player.chatId || 'default'];
    if (!state) return { success: false, message: null };
    
    const num = parseInt(amount);
    if (isNaN(num) || num <= 0) {
        return { success: false, message: '❌ یه عدد معتبر وارد کن!' };
    }
    
    switch (state.action) {
        case 'buy':
            return buyItem(player, state.item, num);
        case 'sell':
            return sellItem(player, state.item, num);
        case 'buyWithEnergy':
            return buyItemWithEnergy(player, state.item, num, state.energyCost);
        case 'sellForEnergy':
            return sellItemForEnergy(player, state.item, num, state.energyReward);
        default:
            return { success: false, message: null };
    }
}

function cancelShop(player) {
    delete shopState[player.chatId || 'default'];
    return { success: true, message: '❌ خرید/فروش لغو شد.' };
}

function getShopState(player) {
    return shopState[player.chatId || 'default'] || null;
}

module.exports = { 
    showShopMenu, 
    startBuy, 
    startSell, 
    startBuyWithEnergy,
    startSellForEnergy,
    processAmount, 
    buyItem, 
    sellItem, 
    cancelShop, 
    getShopState 
};