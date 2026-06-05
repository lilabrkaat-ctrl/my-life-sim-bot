const TelegramBot = require('node-telegram-bot-api');
const token = process.env.BOT_TOKEN || 'YOUR_BOT_TOKEN_HERE_PLACEHOLDER';
const bot = new TelegramBot(token, { polling: true });

const player = require('./player');
const { gather } = require('./gather');
const { travel } = require('./travel');
const { showCraftMenu, craftItem } = require('./craft');
const { showShopMenu, buyItem, sellItem } = require('./shop');
const { activeBattles, startFight, playerAttack, playerEscape, formatBattleStatus, getBattleKeyboard } = require('./fight');
const config = require('./config');

// 🏛️ منوی اصلی
function mainMenu() {
    return {
        reply_markup: {
            keyboard: [
                ['👤 📊 وضعیت من', '🌿 🪓 جمع‌آوری منابع'],
                ['🗺️ 🚶 سفر به مکان جدید', '⚔️ 💀 نبرد با دشمنان'],
                ['🔨 ⚒️ کارگاه ساخت‌وساز', '🏪 💰 بازار تجارت'],
                ['🎒 📦 اینونتوری کامل']
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
    
    for (let key in locations) {
        const loc = locations[key];
        buttons.push([`${loc.emoji} سفر به ${loc.name}`]);
    }
    
    buttons.push(['🔙 برگشت به منوی اصلی']);
    
    return {
        reply_markup: {
            keyboard: buttons,
            resize_keyboard: true
        }
    };
}

// منوی ساخت‌وساز
function craftKeyboard() {
    const recipes = config.recipes;
    const buttons = [];
    
    for (let itemName in recipes) {
        const recipe = recipes[itemName];
        buttons.push([`${recipe.emoji} 🔨 ساخت ${itemName}`]);
    }
    
    buttons.push(['🔙 برگشت به منوی اصلی']);
    
    return {
        reply_markup: {
            keyboard: buttons,
            resize_keyboard: true
        }
    };
}

// منوی بازار
function shopKeyboard() {
    return {
        reply_markup: {
            keyboard: [
                ['🪵 خرید چوب (۲👑)', '🪨 خرید سنگ (۳👑)'],
                ['🍖 خرید گوشت (۳👑)', '💧 خرید آب (۱👑)'],
                ['🦴 خرید پوست (۵👑)', '⛏️ خرید آهن (۸👑)'],
                ['📤 📦 فروش منابع', '🔙 برگشت به منوی اصلی']
            ],
            resize_keyboard: true
        }
    };
}

// منوی فروش
function sellKeyboard() {
    return {
        reply_markup: {
            keyboard: [
                ['🪵 فروش چوب (۱👑)', '🪨 فروش سنگ (۱👑)'],
                ['🍖 فروش گوشت (۲👑)', '💧 فروش آب (۱👑)'],
                ['🦴 فروش پوست (۳👑)', '⛏️ فروش آهن (۴👑)'],
                ['🔙 برگشت به بازار']
            ],
            resize_keyboard: true
        }
    };
}

// 🎮 /start
bot.onText(/\/start/, async (msg) => {
    const chatId = msg.chat.id;
    
    if (!player.getPlayer(chatId)) {
        player.createPlayer(chatId);
    }

    const p = player.getPlayer(chatId);
    const loc = config.images.locations[p.location];

    await bot.sendPhoto(chatId, loc.file_id, {
        caption: `🏛️ *بقای باستانی*\n✨ ${p.name} به دنیای باستان خوش آمدی!\n📍 ${loc.emoji} ${loc.name}\n${loc.description}`,
        parse_mode: 'Markdown',
        ...mainMenu()
    });
});

// 👤 وضعیت
bot.onText(/👤 📊 وضعیت من/, async (msg) => {
    const chatId = msg.chat.id;
    const p = player.getPlayer(chatId);
    if (!p) return bot.sendMessage(chatId, '❌ اول /start بزن!', mainMenu());
    
    const avatar = config.images.npcs[p.name === 'بازمانده زن' ? 'female_survivor' : 'male_survivor'];
    
    await bot.sendPhoto(chatId, avatar.file_id, {
        caption: player.formatStatus(p),
        parse_mode: 'Markdown',
        ...mainMenu()
    });
});

// 🌿 جمع‌آوری
bot.onText(/🌿 🪓 جمع‌آوری منابع/, async (msg) => {
    const chatId = msg.chat.id;
    const p = player.getPlayer(chatId);
    if (!p) return bot.sendMessage(chatId, '❌ اول /start بزن!', mainMenu());
    
    const result = gather(p);
    bot.sendMessage(chatId, result.message, mainMenu());
});

// 🗺️ سفر
bot.onText(/🗺️ 🚶 سفر به مکان جدید/, async (msg) => {
    const chatId = msg.chat.id;
    const p = player.getPlayer(chatId);
    if (!p) return bot.sendMessage(chatId, '❌ اول /start بزن!', mainMenu());
    
    const loc = config.images.locations[p.location];
    await bot.sendPhoto(chatId, loc.file_id, {
        caption: `📍 ${loc.emoji} ${loc.name}\n\nکجا می‌خوای بری؟`,
        parse_mode: 'Markdown',
        ...locationMenu()
    });
});

// سفر به مکان
bot.onText(/^(.+) سفر به (.+)$/, async (msg, match) => {
    const chatId = msg.chat.id;
    const p = player.getPlayer(chatId);
    if (!p) return;
    
    const emoji = match[1];
    const name = match[2];
    
    for (let key in config.images.locations) {
        if (config.images.locations[key].emoji === emoji && config.images.locations[key].name === name) {
            const result = travel(p, key);
            const newLoc = config.images.locations[p.location];
            
            await bot.sendPhoto(chatId, newLoc.file_id, {
                caption: `${result.message}\n${newLoc.description}`,
                parse_mode: 'Markdown',
                ...mainMenu()
            });
            return;
        }
    }
});

// ⚔️ شروع نبرد
bot.onText(/⚔️ 💀 نبرد با دشمنان/, async (msg) => {
    const chatId = msg.chat.id;
    const p = player.getPlayer(chatId);
    if (!p) return bot.sendMessage(chatId, '❌ اول /start بزن!', mainMenu());
    
    const result = startFight(p);
    
    if (!result.success) {
        return bot.sendMessage(chatId, result.message, mainMenu());
    }
    
    activeBattles[chatId] = result.enemy;
    
    await bot.sendPhoto(chatId, result.enemy.file_id, {
        caption: result.message,
        parse_mode: 'Markdown',
        ...getBattleKeyboard(result.enemy)
    });
});

// ⚔️ حمله در نبرد
bot.onText(/⚔️ 🗡️ حمله کن/, async (msg) => {
    const chatId = msg.chat.id;
    const p = player.getPlayer(chatId);
    const enemy = activeBattles[chatId];
    
    if (!p || !enemy) {
        return bot.sendMessage(chatId, '⚔️ نبردی در جریان نیست!', mainMenu());
    }
    
    const result = playerAttack(p, enemy);
    
    if (result.battleOver) {
        delete activeBattles[chatId];
        await bot.sendMessage(chatId, result.message, { parse_mode: 'Markdown', ...mainMenu() });
    } else {
        await bot.sendPhoto(chatId, enemy.file_id, {
            caption: `⚔️ ${enemy.emoji} ${enemy.name}\n${result.message}\n\n${formatBattleStatus(p, enemy)}`,
            parse_mode: 'Markdown',
            ...getBattleKeyboard(enemy)
        });
    }
});

// 🏃 فرار در نبرد
bot.onText(/🏃 💨 فرار کن/, async (msg) => {
    const chatId = msg.chat.id;
    const p = player.getPlayer(chatId);
    const enemy = activeBattles[chatId];
    
    if (!p || !enemy) {
        return bot.sendMessage(chatId, '⚔️ نبردی در جریان نیست!', mainMenu());
    }
    
    const result = playerEscape(p, enemy);
    
    if (result.battleOver) {
        delete activeBattles[chatId];
        await bot.sendMessage(chatId, result.message, { parse_mode: 'Markdown', ...mainMenu() });
    } else {
        await bot.sendPhoto(chatId, enemy.file_id, {
            caption: `🏃 فرار...\n${result.message}\n\n${formatBattleStatus(p, enemy)}`,
            parse_mode: 'Markdown',
            ...getBattleKeyboard(enemy)
        });
    }
});

// 🔨 ساخت‌وساز
bot.onText(/🔨 ⚒️ کارگاه ساخت‌وساز/, async (msg) => {
    const chatId = msg.chat.id;
    const p = player.getPlayer(chatId);
    if (!p) return bot.sendMessage(chatId, '❌ اول /start بزن!', mainMenu());
    
    const blacksmith = config.images.npcs.blacksmith;
    await bot.sendPhoto(chatId, blacksmith.file_id, {
        caption: showCraftMenu(),
        parse_mode: 'Markdown',
        ...craftKeyboard()
    });
});

// ساخت آیتم
bot.onText(/^(.+) 🔨 ساخت (.+)$/, async (msg, match) => {
    const chatId = msg.chat.id;
    const p = player.getPlayer(chatId);
    if (!p) return;
    
    const itemName = match[2];
    const result = craftItem(p, itemName);
    
    bot.sendMessage(chatId, result.message, { parse_mode: 'Markdown', ...craftKeyboard() });
});

// 🏪 بازار
bot.onText(/🏪 💰 بازار تجارت/, async (msg) => {
    const chatId = msg.chat.id;
    const p = player.getPlayer(chatId);
    if (!p) return bot.sendMessage(chatId, '❌ اول /start بزن!', mainMenu());
    
    if (p.location !== 'village') {
        return bot.sendMessage(chatId, '🏪 بازار فقط توی روستای باستانیه!', mainMenu());
    }
    
    const merchant = config.images.npcs.merchant;
    await bot.sendPhoto(chatId, merchant.file_id, {
        caption: `🏪 *بازار* | 👑 طلا: ${p.inventory.gold}`,
        parse_mode: 'Markdown',
        ...shopKeyboard()
    });
});

// خرید
bot.onText(/^(.+) خرید (.+) \((\d+)👑\)$/, async (msg, match) => {
    const chatId = msg.chat.id;
    const p = player.getPlayer(chatId);
    if (!p) return;
    
    const itemMap = { 'چوب': 'wood', 'سنگ': 'stone', 'گوشت': 'meat', 'آب': 'water', 'پوست': 'skin', 'آهن': 'iron' };
    const result = buyItem(p, itemMap[match[2]]);
    
    bot.sendMessage(chatId, result.message, shopKeyboard());
});

// فروش
bot.onText(/📤 📦 فروش منابع/, (msg) => {
    const chatId = msg.chat.id;
    bot.sendMessage(chatId, '📤 چی می‌خوای بفروشی؟', sellKeyboard());
});

// فروش آیتم
bot.onText(/^(.+) فروش (.+) \((\d+)👑\)$/, async (msg, match) => {
    const chatId = msg.chat.id;
    const p = player.getPlayer(chatId);
    if (!p) return;
    
    const itemMap = { 'چوب': 'wood', 'سنگ': 'stone', 'گوشت': 'meat', 'آب': 'water', 'پوست': 'skin', 'آهن': 'iron' };
    const result = sellItem(p, itemMap[match[2]]);
    
    bot.sendMessage(chatId, result.message, sellKeyboard());
});

// 🔙 برگشت
bot.onText(/🔙 برگشت به منوی اصلی/, (msg) => {
    const chatId = msg.chat.id;
    delete activeBattles[chatId];
    bot.sendMessage(chatId, '🏛️ *منوی اصلی*', { parse_mode: 'Markdown', ...mainMenu() });
});

bot.onText(/🔙 برگشت به بازار/, (msg) => {
    const chatId = msg.chat.id;
    const p = player.getPlayer(chatId);
    bot.sendMessage(chatId, `🏪 *بازار* | 👑 طلا: ${p.inventory.gold}`, { parse_mode: 'Markdown', ...shopKeyboard() });
});

// 🎒 اینونتوری
bot.onText(/🎒 📦 اینونتوری کامل/, async (msg) => {
    const chatId = msg.chat.id;
    const p = player.getPlayer(chatId);
    if (!p) return bot.sendMessage(chatId, '❌ اول /start بزن!', mainMenu());
    
    const status = player.formatStatus(p);
    bot.sendMessage(chatId, status, { parse_mode: 'Markdown', ...mainMenu() });
});

console.log('✅ ربات بقای باستانی آماده شد! 🎉');