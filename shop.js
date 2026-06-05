const config = require('./config');

function showShopMenu() {
    return `🏪 *بازار باستانی*\n📥 خرید:\n🪵چوب ۲👑 🪨سنگ ۳👑 🍖گوشت ۳👑 💧آب ۱👑 🦴پوست ۵👑 ⛏️آهن ۸👑`;
}

function buyItem(player, item) {
    const p = config.shopPrices[item];
    if (!p) return { success: false, message: '❌ وجود نداره!' };
    if (player.inventory.gold < p.buy) return { success: false, message: `❌ طلا کمه! نیاز: ${p.buy}` };
    player.inventory.gold -= p.buy;
    player.inventory[item]++;
    return { success: true, message: `✅ ${p.emoji} ${p.name} خریدی! 👑${player.inventory.gold}` };
}

function sellItem(player, item) {
    const p = config.shopPrices[item];
    if (!p) return { success: false, message: '❌ وجود نداره!' };
    if (player.inventory[item] < 1) return { success: false, message: `❌ ${p.name} نداری!` };
    player.inventory[item]--;
    player.inventory.gold += p.sell;
    return { success: true, message: `✅ ${p.emoji} ${p.name} فروختی! 👑${player.inventory.gold}` };
}

module.exports = { showShopMenu, buyItem, sellItem };