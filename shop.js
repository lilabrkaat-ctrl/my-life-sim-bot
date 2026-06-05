const config = require('./config');

function showShopMenu() {
    const prices = config.shopPrices;
    let menu = '🏪 *بازار باستانی*\n\n📥 *خرید:*\n';
    
    for (let item in prices) {
        const p = prices[item];
        menu += `/buy_${item} - ${p.emoji} ${p.name}: ${p.buy} طلا\n`;
    }
    
    menu += '\n📤 *فروش:*\n';
    for (let item in prices) {
        const p = prices[item];
        menu += `/sell_${item} - ${p.emoji} ${p.name}: ${p.sell} طلا\n`;
    }
    
    return menu;
}

function buyItem(player, itemName) {
    const prices = config.shopPrices;
    const item = prices[itemName];
    
    if (!item) {
        return { success: false, message: '❌ این کالا وجود نداره!' };
    }

    if (player.inventory.gold < item.buy) {
        return { success: false, message: `❌ طلا کافی نداری! نیاز: ${item.buy} 👑` };
    }

    player.inventory.gold -= item.buy;
    player.inventory[itemName] += 1;
    
    return {
        success: true,
        message: `✅ ۱ ${item.emoji} ${item.name} خریدی! | 👑 طلا: ${player.inventory.gold}`
    };
}

function sellItem(player, itemName) {
    const prices = config.shopPrices;
    const item = prices[itemName];
    
    if (!item) {
        return { success: false, message: '❌ این کالا وجود نداره!' };
    }

    if (player.inventory[itemName] < 1) {
        return { success: false, message: `❌ ${item.emoji} ${item.name} نداری که بفروشی!` };
    }

    player.inventory[itemName] -= 1;
    player.inventory.gold += item.sell;
    
    return {
        success: true,
        message: `✅ ۱ ${item.emoji} ${item.name} فروختی! | 👑 طلا: ${player.inventory.gold}`
    };
}

module.exports = { showShopMenu, buyItem, sellItem };