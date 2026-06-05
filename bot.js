const TelegramBot = require('node-telegram-bot-api');
const token = process.env.BOT_TOKEN || 'YOUR_BOT_TOKEN_HERE_PLACEHOLDER';
const bot = new TelegramBot(token, { polling: true });

const player = require('./player');
const { gather } = require('./gather');
const { travel, showTravelMenu } = require('./travel');
const { showCraftMenu, craftItem } = require('./craft');
const { fight } = require('./fight');
const { showShopMenu, buyItem, sellItem } = require('./shop');
const config = require('./config');

// منوی اصلی
function mainMenu() {
    return {
        reply_markup: {
            keyboard: [
                ['📊 وضعیت', '🎒 جمع‌آوری'],
                ['🗺️ نقشه', '⚔️ نبرد'],
                ['🔨 ساخت‌وساز', '🏪 بازار']
            ],
            resize_keyboard: true,
            persistent: true
        }
    };
}

// منوی مکان‌ها
function locationMenu() {
    const locations = config.images.locations;
    const buttons = [];
    let row = [];
    let count = 0;
    
    for (let key in locations) {
        const loc = locations[key];
        row.push(`${loc.emoji} ${loc.name}`);
        count++;
        
        if (count % 2 === 0) {
            buttons.push(row);
            row = [];
        }
    }
    
    if (row.length > 0) buttons.push(row);
    buttons.push(['🔙 بازگشت']);
    
    return {
        reply_markup: {
            keyboard: buttons,
            resize_keyboard: true,
            persistent: true
        }
    };
}

// منوی ساخت‌وساز
function craftMenu() {
    const recipes = config.recipes;
    const buttons = [];
    
    for (let itemName in recipes) {
        const recipe = recipes[itemName];
        buttons.push([`${recipe.emoji} ساخت ${itemName}`]);
    }
    
    buttons.push(['🔙 بازگشت']);
    
    return {
        reply_markup: {
            keyboard: buttons,
            resize_keyboard: true,
            persistent: true
        }
    };
}

// منوی بازار
function shopMenu() {
    return {
        reply_markup: {
            keyboard: [
                ['🪵 خرید چوب', '🪨 خرید سنگ'],
                ['🍖 خرید گوشت', '💧 خرید آب'],
                ['🦴 خرید پوست', '⛏️ خرید آهن'],
                ['👑 خرید طلا', '📤 فروش'],
                ['🔙 بازگشت']
            ],
            resize_keyboard: true,
            persistent: true
        }
    };
}

// منوی فروش
function sellMenu() {
    return {
        reply_markup: {
            keyboard: [
                ['🪵 فروش چوب', '🪨 فروش سنگ'],
                ['🍖 فروش گوشت', '💧 فروش آب'],
                ['🦴 فروش پوست', '⛏️ فروش آهن'],
                ['👑 فروش طلا', '🔙 بازار']
            ],
            resize_keyboard: true,
            persistent: true
        }
    };
}

// /start
bot.onText(/\/start/, (msg) => {
    const chatId = msg.chat.id;
    
    if (!player.getPlayer(chatId)) {
        player.createPlayer(chatId);
    }

    const loc = config.images.locations[player.getPlayer(chatId).location];

    const welcome = `
🏛️ *به دنیای بقای باستانی خوش آمدی!*

تو در ${loc.emoji} *${loc.name}* بیدار شدی.
باید زنده بمونی، منابع جمع کنی و خونه‌ات رو بسازی.

از دکمه‌های زیر استفاده کن! 👇
    `;
    
    bot.sendMessage(chatId, welcome, { parse_mode: 'Markdown', ...mainMenu() });
});

// 📊 وضعیت
bot.onText(/📊 وضعیت/, (msg) => {
    const chatId = msg.chat.id;
    const p = player.getPlayer(chatId);
    
    if (!p) return bot.sendMessage(chatId, 'اول /start بزن!', mainMenu());
    
    bot.sendMessage(chatId, player.formatStatus(p), { parse_mode: 'Markdown', ...mainMenu() });
});

// 🎒 جمع‌آوری
bot.onText(/🎒 جمع‌آوری/, (msg) => {
    const chatId = msg.chat.id;
    const p = player.getPlayer(chatId);
    
    if (!p) return bot.sendMessage(chatId, 'اول /start بزن!', mainMenu());
    
    const result = gather(p);
    bot.sendMessage(chatId, result.message, mainMenu());
});

// 🗺️ نقشه
bot.onText(/🗺️ نقشه/, (msg) => {
    const chatId = msg.chat.id;
    const p = player.getPlayer(chatId);
    
    if (!p) return bot.sendMessage(chatId, 'اول /start بزن!', mainMenu());
    
    const loc = config.images.locations[p.location];
    bot.sendMessage(chatId, `📍 الان توی ${loc.emoji} *${loc.name}* هستی.\nکجا می‌خوای بری؟`, { parse_mode: 'Markdown', ...locationMenu() });
});

// سفر به مکان‌ها
bot.onText(/^(.+) (.+)$/, (msg, match) => {
    const chatId = msg.chat.id;
    const p = player.getPlayer(chatId);
    
    if (!p) return;
    
    const emoji = match[1];
    const name = match[2];
    
    const locations = config.images.locations;
    
    for (let key in locations) {
        if (locations[key].emoji === emoji && locations[key].name === name) {
            const result = travel(p, key);
            bot.sendMessage(chatId, result.message, mainMenu());
            return;
        }
    }
});

// ⚔️ نبرد
bot.onText(/⚔️ نبرد/, (msg) => {
    const chatId = msg.chat.id;
    const p = player.getPlayer(chatId);
    
    if (!p) return bot.sendMessage(chatId, 'اول /start بزن!', mainMenu());
    
    const result = fight(p);
    bot.sendMessage(chatId, result.message, { parse_mode: 'Markdown', ...mainMenu() });
});

// 🔨 ساخت‌وساز
bot.onText(/🔨 ساخت‌وساز/, (msg) => {
    const chatId = msg.chat.id;
    const p = player.getPlayer(chatId);
    
    if (!p) return bot.sendMessage(chatId, 'اول /start بزن!', mainMenu());
    
    bot.sendMessage(chatId, showCraftMenu(), { parse_mode: 'Markdown', ...craftMenu() });
});

// ساخت آیتم
bot.onText(/^(.+) ساخت (.+)$/, (msg, match) => {
    const chatId = msg.chat.id;
    const p = player.getPlayer(chatId);
    
    if (!p) return;
    
    const itemName = match[2];
    const result = craftItem(p, itemName);
    bot.sendMessage(chatId, result.message, { parse_mode: 'Markdown', ...craftMenu() });
});

// 🏪 بازار
bot.onText(/🏪 بازار/, (msg) => {
    const chatId = msg.chat.id;
    const p = player.getPlayer(chatId);
    
    if (!p) return bot.sendMessage(chatId, 'اول /start بزن!', mainMenu());
    
    if (p.location !== 'village') {
        return bot.sendMessage(chatId, '🏪 بازار فقط توی روستای باستانیه! برو نقشه و بیا روستا.', mainMenu());
    }
    
    bot.sendMessage(chatId, showShopMenu(), { parse_mode: 'Markdown', ...shopMenu() });
});

// خرید از بازار
bot.onText(/^(.+) خرید (.+)$/, (msg, match) => {
    const chatId = msg.chat.id;
    const p = player.getPlayer(chatId);
    
    if (!p) return;
    
    const itemName = match[2];
    const itemMap = { 'چوب': 'wood', 'سنگ': 'stone', 'گوشت': 'meat', 'آب': 'water', 'پوست': 'skin', 'آهن': 'iron', 'طلا': 'gold' };
    const result = buyItem(p, itemMap[itemName]);
    bot.sendMessage(chatId, result.message, shopMenu());
});

// 📤 فروش
bot.onText(/📤 فروش/, (msg) => {
    const chatId = msg.chat.id;
    const p = player.getPlayer(chatId);
    
    if (!p) return;
    
    bot.sendMessage(chatId, '📤 چی می‌خوای بفروشی؟', sellMenu());
});

// فروش آیتم
bot.onText(/^(.+) فروش (.+)$/, (msg, match) => {
    const chatId = msg.chat.id;
    const p = player.getPlayer(chatId);
    
    if (!p) return;
    
    const itemName = match[2];
    const itemMap = { 'چوب': 'wood', 'سنگ': 'stone', 'گوشت': 'meat', 'آب': 'water', 'پوست': 'skin', 'آهن': 'iron', 'طلا': 'gold' };
    const result = sellItem(p, itemMap[itemName]);
    bot.sendMessage(chatId, result.message, sellMenu());
});

// 🔙 بازگشت
bot.onText(/🔙 بازگشت/, (msg) => {
    const chatId = msg.chat.id;
    bot.sendMessage(chatId, '🏛️ منوی اصلی:', mainMenu());
});

// 🔙 بازار
bot.onText(/🔙 بازار/, (msg) => {
    const chatId = msg.chat.id;
    bot.sendMessage(chatId, showShopMenu(), { parse_mode: 'Markdown', ...shopMenu() });
});

console.log('✅ ربات بقای باستانی با منوی شیشه‌ای آماده شد!');