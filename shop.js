const config = require('./config');

const shopState = {};

function showShopMenu() {
    return `🏪 *بازار باستانی*\n\n📥 *خرید:*\n🪵 چوب: ۲👑 | 🪨 سنگ: ۳👑\n🍖 گوشت: ۳👑 | 💧 آب: ۱👑\n🦴 پوست: ۵👑 | ⛏️ آهن: ۸👑\n💀 فنیشر: ۵۰👑\n\n📤 *فروش ویژه:*\n💎 الماس: ۱۰۰👑`;
}

function startBuy(player, item) {
    if (item === 'finisher') {
        const price = config.shopPrices.finisher.buy;
        if ((player.inventory.gold || 0) < price) {
            return { success: false, message: `❌ طلا کمه! 💀 فنیشر ${price}👑\n👑 داری: ${player.inventory.gold||0}` };
        }
        player.inventory.gold -= price;
        player.inventory.finisher = (player.inventory.finisher || 0) + 1;
        return { success: true, message: `✅ 💀 فنیشر خریدی! -${price}👑\n💀 موجودی: ${player.inventory.finisher}` };
    }
    
    if (item === 'diamond') {
        return startSell(player, 'diamond');
    }
    
    const p = config.shopPrices[item];
    if (!p) return { success: false, message: '❌ آیتم نامعتبر!' };
    
    shopState[player.chatId || 'default'] = { action: 'buy', item: item };
    
    return { 
        success: true, 
        message: `🛒 *خرید ${p.emoji} ${p.name}*\n\n💰 قیمت هر عدد: ${p.buy}👑\n👑 موجودی تو: ${player.inventory.gold||0}👑\n\n📝 *چند تا می‌خوای؟* (عدد رو تایپ کن)\nیا بزن /cancel لغو کن` 
    };
}

function startSell(player, item) {
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
    
    shopState[player.chatId || 'default'] = { action: 'sell', item: item };
    
    return { 
        success: true, 
        message: `📤 *فروش ${p.emoji} ${p.name}*\n\n💰 قیمت هر عدد: ${p.sell}👑\n🎒 موجودی تو: ${player.inventory[item] || 0} عدد\n\n📝 *چند تا می‌خوای بفروشی؟* (عدد رو تایپ کن)\nیا بزن /cancel لغو کن` 
    };
}

function processAmount(player, amount) {
    const state = shopState[player.chatId || 'default'];
    if (!state) return { success: false, message: null };
    
    const num = parseInt(amount);
    if (isNaN(num) || num <= 0) {
        return { success: false, message: '❌ یه عدد معتبر وارد کن!' };
    }
    
    if (state.action === 'buy') {
        return buyItem(player, state.item, num);
    } else if (state.action === 'sell') {
        return sellItem(player, state.item, num);
    }
    
    return { success: false, message: null };
}

function buyItem(player, item, amount = 1) {
    const p = config.shopPrices[item];
    if (!p) return { success: false, message: '❌ وجود نداره!' };
    
    const totalCost = p.buy * amount;
    
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

function sellItem(player, item, amount = 1) {
    const p = config.shopPrices[item];
    if (!p) return { success: false, message: '❌ وجود نداره!' };
    
    if ((player.inventory[item] || 0) < amount) {
        delete shopState[player.chatId || 'default'];
        return { success: false, message: `❌ به اندازه کافی نداری!\n🎒 داری: ${player.inventory[item] || 0} عدد` };
    }
    
    const totalEarn = p.sell * amount;
    player.inventory[item] -= amount;
    player.inventory.gold = (player.inventory.gold || 0) + totalEarn;
    delete shopState[player.chatId || 'default'];
    
    return { 
        success: true, 
        message: `✅ *فروش موفق!*\n\n${p.emoji} ${p.name}: -${amount}\n💰 دریافتی: ${totalEarn}👑\n👑 موجودی: ${player.inventory.gold}👑` 
    };
}

function cancelShop(player) {
    delete shopState[player.chatId || 'default'];
    return { success: true, message: '❌ خرید/فروش لغو شد.' };
}

function getShopState(player) {
    return shopState[player.chatId || 'default'] || null;
}

module.exports = { showShopMenu, startBuy, startSell, processAmount, buyItem, sellItem, cancelShop, getShopState };