const { getPlayer, savePlayer, calcEquippedStats } = require('./player');

// ==================== فروشگاه سلاح و زره ====================
const shopWeapons = [
    // یک‌دستی (w_1h)
    { name: "🗡️ Rusty Sword", type: "w_1h", damage: 3, defense: 0, price: 150, emoji: "🗡️", stock: 10, category: "weapon" },
    { name: "⚔️ Iron Sword", type: "w_1h", damage: 7, defense: 0, price: 400, emoji: "⚔️", stock: 8, category: "weapon" },
    { name: "🔪 Shadow Dagger", type: "w_1h", damage: 12, defense: 0, price: 900, emoji: "🔪", stock: 5, category: "weapon" },
    { name: "💎 Crystal Blade", type: "w_1h", damage: 18, defense: 0, price: 2000, emoji: "💎", stock: 3, category: "weapon" },

    // دو‌دستی (w_2h)
    { name: "🪓 Woodcutter's Axe", type: "w_2h", damage: 15, defense: 0, price: 1200, emoji: "🪓", stock: 5, category: "weapon" },
    { name: "⚡ Storm Hammer", type: "w_2h", damage: 22, defense: 0, price: 2800, emoji: "⚡", stock: 3, category: "weapon" },

    // دفاعی (w_def)
    { name: "🛡️ Wooden Shield", type: "w_def", damage: 0, defense: 4, price: 200, emoji: "🛡️", stock: 10, category: "armor" },
    { name: "🔰 Iron Shield", type: "w_def", damage: 0, defense: 9, price: 600, emoji: "🔰", stock: 7, category: "armor" },
    { name: "🛡️ Dragon Shield", type: "w_def", damage: 0, defense: 15, price: 2500, emoji: "🛡️", stock: 3, category: "armor" },

    // زره بدن (w_body)
    { name: "🧥 Leather Armor", type: "w_body", damage: 0, defense: 5, price: 300, emoji: "🧥", stock: 8, category: "armor" },
    { name: "🦺 Iron Chestplate", type: "w_body", damage: 0, defense: 10, price: 800, emoji: "🦺", stock: 5, category: "armor" },
    { name: "💠 Crystal Armor", type: "w_body", damage: 0, defense: 18, price: 3000, emoji: "💠", stock: 2, category: "armor" },

    // کلاه‌خود (w_head)
    { name: "⛑️ Iron Helmet", type: "w_head", damage: 0, defense: 6, price: 500, emoji: "⛑️", stock: 6, category: "armor" },
    { name: "👑 Crown of Power", type: "w_head", damage: 3, defense: 10, price: 3500, emoji: "👑", stock: 1, category: "armor" },
];

// ==================== فروشگاه معجون و غذا ====================
const shopPotions = [
    { name: "❤️ Health Potion", heal: 30, price: 80, emoji: "❤️", stock: 20, category: "potion" },
    { name: "💙 Energy Drink", energy: 40, price: 60, emoji: "💙", stock: 20, category: "potion" },
    { name: "🍗 Roasted Chicken", hunger: 50, price: 50, emoji: "🍗", stock: 15, category: "food" },
    { name: "🍞 Bread", hunger: 20, price: 20, emoji: "🍞", stock: 25, category: "food" },
    { name: "🧪 Elixir of Life", heal: 80, energy: 80, hunger: 80, price: 500, emoji: "🧪", stock: 5, category: "special" },
    { name: "💪 Strength Potion", damageBoost: 5, duration: 300, price: 300, emoji: "💪", stock: 5, category: "special" },
];

// ==================== فروشگاه کمیاب و کلکسیونی ====================
const shopRare = [
    { name: "💍 Ring of Luck", luck: 10, price: 5000, emoji: "💍", stock: 2, category: "rare" },
    { name: "📿 Amulet of Protection", defenseBoost: 5, price: 4000, emoji: "📿", stock: 2, category: "rare" },
    { name: "🔮 Mystery Box", randomItem: true, price: 1500, emoji: "🔮", stock: 5, category: "rare" },
    { name: "🎫 Lottery Ticket", winChance: 0.1, prize: 10000, price: 500, emoji: "🎫", stock: 10, category: "rare" },
    { name: "🗝️ Dungeon Key", dungeonAccess: true, price: 2000, emoji: "🗝️", stock: 3, category: "rare" },
    { name: "🌾 Farm Key", farmAccess: true, price: 1000, emoji: "🌾", stock: 5, category: "rare" },
    { name: "🏦 Bank Key", bankAccess: true, price: 5000, emoji: "🏦", stock: 2, category: "rare" },
];

// ==================== مصالح خانه و کاردستی ====================
const shopMaterials = [
    { name: "🪵 Wood", price: 30, emoji: "🪵", stock: 50, category: "material" },
    { name: "🪨 Stone", price: 40, emoji: "🪨", stock: 40, category: "material" },
    { name: "⛓️ Iron Ingot", price: 100, emoji: "⛓️", stock: 25, category: "material" },
    { name: "🥇 Gold Ingot", price: 500, emoji: "🥇", stock: 10, category: "material" },
    { name: "🥈 Silver Ingot", price: 300, emoji: "🥈", stock: 15, category: "material" },
    { name: "💎 Diamond", price: 2000, emoji: "💎", stock: 5, category: "material" },
    { name: "🔮 Magic Crystal", price: 3500, emoji: "🔮", stock: 3, category: "material" },
];

// ==================== لیست کل ====================
const allShopSections = [
    { title: "🛡️ سلاح‌ها و زره‌ها", items: shopWeapons },
    { title: "🧪 معجون‌ها و غذا", items: shopPotions },
    { title: "📦 آیتم‌های کلکسیونی و کمیاب", items: shopRare },
    { title: "🏠 مصالح خانه و کاردستی", items: shopMaterials },
];
// ==================== نمایش فروشگاه ====================
function showShop(bot, chatId, messageId = null, page = 0, categoryIndex = 0) {
    const player = getPlayer(chatId);
    if (!player) return;

    const section = allShopSections[categoryIndex];
    if (!section) return;

    const itemsPerPage = 6;
    const totalPages = Math.ceil(section.items.length / itemsPerPage);
    if (page >= totalPages) page = totalPages - 1;
    if (page < 0) page = 0;

    const start = page * itemsPerPage;
    const end = start + itemsPerPage;
    const pageItems = section.items.slice(start, end);

    let text = `🏪 **فروشگاه** - ${section.title}\n`;
    text += `💰 موجودی شما: ${player.coins} سکه\n`;
    text += `📄 صفحه ${page + 1} از ${totalPages}\n\n`;

    const inlineKeyboard = [];

    pageItems.forEach((item, index) => {
        const stockText = item.stock !== undefined ? ` (موجودی: ${item.stock})` : '';
        text += `${item.emoji} **${item.name}** - ${item.price} سکه${stockText}\n`;

        if (item.damage) text += `   ⚔️ آسیب: +${item.damage}\n`;
        if (item.defense) text += `   🛡️ دفاع: +${item.defense}\n`;
        if (item.heal) text += `   ❤️ درمان: +${item.heal}\n`;
        if (item.energy) text += `   ⚡ انرژی: +${item.energy}\n`;
        if (item.hunger) text += `   🍗 گرسنگی: +${item.hunger}\n`;
        text += `\n`;

        inlineKeyboard.push([{
            text: `🛒 خرید ${item.name}`,
            callback_data: `shop_buy_${categoryIndex}_${start + index}_${page}`
        }]);
    });

    // دکمه‌های صفحه‌بندی
    const navButtons = [];
    if (page > 0) {
        navButtons.push({
            text: "⬅️ قبلی",
            callback_data: `shop_page_${categoryIndex}_${page - 1}`
        });
    }
    if (page < totalPages - 1) {
        navButtons.push({
            text: "بعدی ➡️",
            callback_data: `shop_page_${categoryIndex}_${page + 1}`
        });
    }
    if (navButtons.length > 0) inlineKeyboard.push(navButtons);

    // دکمه‌های تغییر دسته
    const categoryButtons = [];
    allShopSections.forEach((sec, idx) => {
        if (idx !== categoryIndex) {
            categoryButtons.push({
                text: sec.title.split(' ')[0],
                callback_data: `shop_category_${idx}_0`
            });
        }
    });

    // چیدمان دکمه‌های دسته‌ها دو تا دو تا
    for (let i = 0; i < categoryButtons.length; i += 2) {
        const row = [categoryButtons[i]];
        if (categoryButtons[i + 1]) row.push(categoryButtons[i + 1]);
        inlineKeyboard.push(row);
    }

    inlineKeyboard.push([{ text: "🔙 خروج", callback_data: "shop_exit" }]);

    const opts = {
        parse_mode: "Markdown",
        reply_markup: { inline_keyboard: inlineKeyboard }
    };

    if (messageId) {
        bot.editMessageText(text, { chat_id: chatId, message_id: messageId, ...opts }).catch(() => {});
    } else {
        bot.sendMessage(chatId, text, opts).catch(() => {});
    }
}

// ==================== خرید آیتم ====================
function buyItem(bot, chatId, userId, categoryIndex, itemIndex, page) {
    const player = getPlayer(chatId);
    if (!player) return;

    const section = allShopSections[categoryIndex];
    if (!section) return;

    const item = section.items[itemIndex];
    if (!item) return;

    // چک موجودی
    if (item.stock !== undefined && item.stock <= 0) {
        bot.answerCallbackQuery(userId, { text: "❌ این آیتم تموم شده!", show_alert: true });
        return;
    }

    // چک پول
    if (player.coins < item.price) {
        bot.answerCallbackQuery(userId, { text: "❌ پول کافی نداری!", show_alert: true });
        return;
    }

    // کم کردن پول
    player.coins -= item.price;

    // کم کردن موجودی
    if (item.stock !== undefined) {
        const foundInStock = section.items.find(si => si.name === item.name);
        if (foundInStock) foundInStock.stock--;
    }

    // اضافه کردن به اینونتوری
    if (!player.inventory) player.inventory = [];
    player.inventory.push({ ...item, equipped: false });

    // اگه اسلحه یا زره هست و equipped خالیه، auto-equip کن
    if (item.category === 'weapon' || item.category === 'armor') {
        if (!player.equipped) player.equipped = {};
        const slot = item.type;
        if (!player.equipped[slot]) {
            // آخرین آیتم اضافه شده رو equipped کن
            const lastItem = player.inventory[player.inventory.length - 1];
            lastItem.equipped = true;
            player.equipped[slot] = lastItem;
        }
    }

    // آپدیت stats
    calcEquippedStats(player);

    savePlayer(chatId, player);

    bot.answerCallbackQuery(userId, { text: `✅ ${item.name} خریداری شد!`, show_alert: false });

    return true;
}

// ==================== ریستاک فروشگاه ====================
function restockShop() {
    allShopSections.forEach(section => {
        section.items.forEach(item => {
            if (item.stock !== undefined) {
                // برگردوندن به موجودی پیش‌فرض (مقادیر اولیه)
                const defaults = {
                    "🗡️ Rusty Sword": 10, "⚔️ Iron Sword": 8, "🔪 Shadow Dagger": 5,
                    "💎 Crystal Blade": 3, "🪓 Woodcutter's Axe": 5, "⚡ Storm Hammer": 3,
                    "🛡️ Wooden Shield": 10, "🔰 Iron Shield": 7, "🛡️ Dragon Shield": 3,
                    "🧥 Leather Armor": 8, "🦺 Iron Chestplate": 5, "💠 Crystal Armor": 2,
                    "⛑️ Iron Helmet": 6, "👑 Crown of Power": 1,
                    "❤️ Health Potion": 20, "💙 Energy Drink": 20, "🍗 Roasted Chicken": 15,
                    "🍞 Bread": 25, "🧪 Elixir of Life": 5, "💪 Strength Potion": 5,
                    "💍 Ring of Luck": 2, "📿 Amulet of Protection": 2, "🔮 Mystery Box": 5,
                    "🎫 Lottery Ticket": 10, "🗝️ Dungeon Key": 3, "🌾 Farm Key": 5, "🏦 Bank Key": 2,
                    "🪵 Wood": 50, "🪨 Stone": 40, "⛓️ Iron Ingot": 25,
                    "🥇 Gold Ingot": 10, "🥈 Silver Ingot": 15, "💎 Diamond": 5, "🔮 Magic Crystal": 3
                };
                if (defaults[item.name]) {
                    item.stock = defaults[item.name];
                }
            }
        });
    });
}

// ==================== هندل فروشگاه ====================
function handleShop(bot, chatId, messageId = null) {
    showShop(bot, chatId, messageId, 0, 0);
}

function handleShopSelection(bot, chatId, userId, data) {
    const parts = data.split('_');

    if (parts[0] === 'shop' && parts[1] === 'exit') {
        bot.deleteMessage(chatId, parts[2] || '').catch(() => {});
        return;
    }

    if (parts[1] === 'category') {
        const categoryIndex = parseInt(parts[2]);
        const page = parseInt(parts[3]);
        if (isNaN(categoryIndex) || isNaN(page)) return;
        showShop(bot, chatId, userId, page, categoryIndex);
        return;
    }

    if (parts[1] === 'page') {
        const categoryIndex = parseInt(parts[2]);
        const page = parseInt(parts[3]);
        if (isNaN(categoryIndex) || isNaN(page)) return;
        showShop(bot, chatId, userId, page, categoryIndex);
        return;
    }

    if (parts[1] === 'buy') {
        const categoryIndex = parseInt(parts[2]);
        const itemIndex = parseInt(parts[3]);
        const page = parseInt(parts[4]);
        if (isNaN(categoryIndex) || isNaN(itemIndex) || isNaN(page)) return;

        const success = buyItem(bot, chatId, userId, categoryIndex, itemIndex, page);
        if (success) {
            showShop(bot, chatId, userId, page, categoryIndex);
        }
    }
}

module.exports = {
    handleShop,
    handleShopSelection,
    restockShop,
    allShopSections
};