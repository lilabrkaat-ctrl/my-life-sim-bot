const config = require('./config');

const shopState = {};

// =============================================
// 🏪 کیبورد شیشه‌ای بازار
// =============================================
function getShopKeyboard() {
    return {
        reply_markup: {
            inline_keyboard: [
                [
                    { text: '🪵 خرید چوب (۲👑)', callback_data: 'shop_buy_wood' },
                    { text: '📤 فروش چوب (۱👑)', callback_data: 'shop_sell_wood' }
                ],
                [
                    { text: '🪨 خرید سنگ (۳👑)', callback_data: 'shop_buy_stone' },
                    { text: '📤 فروش سنگ (۱👑)', callback_data: 'shop_sell_stone' }
                ],
                [
                    { text: '🍖 خرید گوشت (۳👑)', callback_data: 'shop_buy_meat' },
                    { text: '📤 فروش گوشت (۲👑)', callback_data: 'shop_sell_meat' }
                ],
                [
                    { text: '💧 خرید آب (۱👑)', callback_data: 'shop_buy_water' },
                    { text: '📤 فروش آب (۱👑)', callback_data: 'shop_sell_water' }
                ],
                [
                    { text: '🦴 خرید پوست (۵👑)', callback_data: 'shop_buy_skin' },
                    { text: '📤 فروش پوست (۳👑)', callback_data: 'shop_sell_skin' }
                ],
                [
                    { text: '⛏️ خرید آهن (۸👑)', callback_data: 'shop_buy_iron' },
                    { text: '📤 فروش آهن (۴👑)', callback_data: 'shop_sell_iron' }
                ],
                [{ text: '💀 خرید فنیشر (۵۰👑)', callback_data: 'shop_buy_finisher' }],
                [{ text: '⚡ خرید انرژی +۲۰ (۱۰👑)', callback_data: 'shop_buy_energy' }],
                [{ text: '💎 فروش الماس (۱۰۰👑)', callback_data: 'shop_sell_diamond' }],
                [{ text: '🕶️ بازار مکاره', callback_data: 'shop_blackmarket' }],
                [{ text: '🔙 برگشت', callback_data: 'back_to_main' }]
            ]
        }
    };
}

// =============================================
// 🏪 نمایش منوی بازار
// =============================================
function showShopMenu() {
    return `🏪 *بازار باستانی*\n\n📥 *خرید:*\n🪵 چوب: ۲👑 | 🪨 سنگ: ۳👑\n🍖 گوشت: ۳👑 | 💧 آب: ۱👑\n🦴 پوست: ۵👑 | ⛏️ آهن: ۸👑\n💀 فنیشر: ۵۰👑 | ⚡ انرژی: ۱۰👑 (+۲۰⚡)\n\n📤 *فروش:*\n💎 الماس: ۱۰۰👑\n\n👑 طلای تو: _محاسبه میشه_`;
}

// =============================================
// 🛒 شروع خرید - درخواست تعداد
// =============================================
function startBuy(player, item) {
    if (item === 'finisher') {
        const price = config.shopPrices.finisher.buy;
        if ((player.inventory.gold || 0) < price) {
            return { success: false, message: `❌ طلا کمه!\n💰 نیاز: ${price}👑\n👑 داری: ${player.inventory.gold || 0}👑` };
        }
        player.inventory.gold -= price;
        player.inventory.finisher = (player.inventory.finisher || 0) + 1;
        return { success: true, message: `✅ 💀 فنیشر خریدی!\n💰 -${price}👑\n💀 موجودی: ${player.inventory.finisher}` };
    }

    if (item === 'energy') {
        const price = 10;
        if ((player.inventory.gold || 0) < price) {
            return { success: false, message: `❌ طلا کمه!\n💰 نیاز: ${price}👑\n👑 داری: ${player.inventory.gold || 0}👑` };
        }
        player.inventory.gold -= price;
        player.energy = Math.min((player.maxEnergy || 100), (player.energy || 0) + 20);
        return { success: true, message: `✅ ⚡ +۲۰ انرژی!\n💰 -${price}👑\n⚡ انرژی: ${player.energy}/${player.maxEnergy || 100}` };
    }

    if (item === 'diamond') {
        return startSell(player, 'diamond');
    }

    const p = config.shopPrices[item];
    if (!p) return { success: false, message: '❌ آیتم نامعتبر!' };

    shopState[player.chatId] = { action: 'buy', item };

    return {
        success: true,
        needAmount: true,
        message: `🛒 *خرید ${p.emoji} ${p.name}*\n\n💰 قیمت هر عدد: ${p.buy}👑\n👑 موجودی تو: ${player.inventory.gold || 0}👑\n\n📝 *چند تا می‌خوای؟* عدد رو تایپ کن.`,
        item,
        price: p.buy
    };
}

// =============================================
// 📤 شروع فروش - درخواست تعداد
// =============================================
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

    shopState[player.chatId] = { action: 'sell', item };

    return {
        success: true,
        needAmount: true,
        message: `📤 *فروش ${p.emoji} ${p.name}*\n\n💰 قیمت هر عدد: ${p.sell}👑\n🎒 موجودی تو: ${player.inventory[item] || 0} عدد\n\n📝 *چند تا می‌خوای بفروشی؟* عدد رو تایپ کن.`,
        item,
        price: p.sell
    };
}

// =============================================
// 🔢 پردازش تعداد وارد شده
// =============================================
function processAmount(player, amount) {
    const state = shopState[player.chatId];
    if (!state) return { success: false, message: null };

    const num = parseInt(amount);
    if (isNaN(num) || num <= 0) {
        return { success: false, message: '❌ یه عدد معتبر وارد کن! (مثلاً ۵)' };
    }

    if (state.action === 'buy') {
        return buyItem(player, state.item, num);
    } else if (state.action === 'sell') {
        return sellItem(player, state.item, num);
    }

    return { success: false, message: null };
}

// =============================================
// 🛒 انجام خرید
// =============================================
function buyItem(player, item, amount) {
    const p = config.shopPrices[item];
    if (!p) return { success: false, message: '❌ وجود نداره!' };

    const totalCost = p.buy * amount;
    if ((player.inventory.gold || 0) < totalCost) {
        delete shopState[player.chatId];
        return { success: false, message: `❌ طلا کمه!\n💰 نیاز: ${totalCost}👑\n👑 داری: ${player.inventory.gold || 0}👑` };
    }

    player.inventory.gold -= totalCost;
    player.inventory[item] = (player.inventory[item] || 0) + amount;
    delete shopState[player.chatId];

    return {
        success: true,
        message: `✅ *خرید موفق!*\n\n${p.emoji} ${p.name}: +${amount}\n💰 هزینه: ${totalCost}👑\n👑 باقی‌مانده: ${player.inventory.gold}👑`
    };
}

// =============================================
// 📤 انجام فروش
// =============================================
function sellItem(player, item, amount) {
    const p = config.shopPrices[item];
    if (!p) return { success: false, message: '❌ وجود نداره!' };

    if ((player.inventory[item] || 0) < amount) {
        delete shopState[player.chatId];
        return { success: false, message: `❌ به اندازه کافی نداری!\n🎒 داری: ${player.inventory[item] || 0} عدد` };
    }

    const totalEarn = p.sell * amount;
    player.inventory[item] -= amount;
    player.inventory.gold = (player.inventory.gold || 0) + totalEarn;
    delete shopState[player.chatId];

    return {
        success: true,
        message: `✅ *فروش موفق!*\n\n${p.emoji} ${p.name}: -${amount}\n💰 دریافتی: ${totalEarn}👑\n👑 موجودی: ${player.inventory.gold}👑`
    };
}

// =============================================
// ❌ لغو خرید/فروش
// =============================================
function cancelShop(player) {
    delete shopState[player.chatId];
    return { success: true, message: '❌ خرید/فروش لغو شد.' };
}

function getShopState(player) {
    return shopState[player.chatId] || null;
}

// =============================================
// 🕶️ کیبورد بلک مارکت
// =============================================
function getBlackMarketKeyboard(player) {
    const { initBlackMarket } = require('./blackMarket');
    initBlackMarket(player);

    const buttons = [];

    for (let i = 0; i < player.blackMarket.items.length; i++) {
        const item = player.blackMarket.items[i];
        buttons.push([{ text: `🛒 ${item.emoji} ${item.name} x${item.amount || 1} - ${item.price}👑`, callback_data: `bm_buy_${item.id}` }]);
    }

    if (player.blackMarket.specialDeal) {
        buttons.push([{ text: `🤝 ${player.blackMarket.specialDeal.emoji} ${player.blackMarket.specialDeal.name}`, callback_data: 'bm_special_deal' }]);
    }

    buttons.push([{ text: '🔙 برگشت به بازار', callback_data: 'shop_back' }]);

    return { reply_markup: { inline_keyboard: buttons } };
}

module.exports = {
    showShopMenu,
    getShopKeyboard,
    getBlackMarketKeyboard,
    startBuy,
    startSell,
    processAmount,
    buyItem,
    sellItem,
    cancelShop,
    getShopState
};