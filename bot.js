const TelegramBot = require('node-telegram-bot-api');
const token = process.env.BOT_TOKEN || 'YOUR_BOT_TOKEN_HERE_PLACEHOLDER';
const bot = new TelegramBot(token, { polling: true });

const player = require('./player');
const { gather } = require('./gather');
const { travel } = require('./travel');
const { showCraftMenu, craftItem } = require('./craft');
const { activeBattles, startFight, playerAttack, playerEscape, formatBattle, getBattleKeyboard } = require('./fight');
const { showShopMenu, buyItem, sellItem } = require('./shop');
const config = require('./config');

// منوی اصلی
function mainMenu() {
    return {
        reply_markup: {
            keyboard: [
                ['👤 📊 وضعیت', '🌿 🪓 جمع‌آوری'],
                ['🗺️ 🚶 سفر', '⚔️ 💀 نبرد'],
                ['🔨 ⚒️ ساخت‌وساز', '🏪 💰 بازار'],
                ['🎒 📦 اینونتوری']
            ],
            resize_keyboard: true
        }
    };
}

// منوی مکان‌ها
function locationMenu() {
    const buttons = [];
    for (let k in config.images.locations) {
        const l = config.images.locations[k];
        buttons.push([`${l.emoji} سفر به ${l.name}`]);
    }
    buttons.push(['🔙 برگشت']);
    return { reply_markup: { keyboard: buttons, resize_keyboard: true } };
}

// منوی ساخت‌وساز
function craftKeyboard() {
    const buttons = [];
    for (let n in config.recipes) {
        buttons.push([`${config.recipes[n].emoji} 🔨 ساخت ${n}`]);
    }
    buttons.push(['🔙 برگشت']);
    return { reply_markup: { keyboard: buttons, resize_keyboard: true } };
}

// منوی بازار
function shopKeyboard() {
    return {
        reply_markup: {
            keyboard: [
                ['🪵 خرید چوب', '🪨 خرید سنگ'],
                ['🍖 خرید گوشت', '💧 خرید آب'],
                ['🦴 خرید پوست', '⛏️ خرید آهن'],
                ['📤 فروش', '🔙 برگشت']
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
                ['🪵 فروش چوب', '🪨 فروش سنگ'],
                ['🍖 فروش گوشت', '💧 فروش آب'],
                ['🦴 فروش پوست', '⛏️ فروش آهن'],
                ['🔙 بازار']
            ],
            resize_keyboard: true
        }
    };
}

// /start
bot.onText(/\/start/, async (msg) => {
    const chatId = msg.chat.id;
    if (!player.getPlayer(chatId)) player.createPlayer(chatId);
    const p = player.getPlayer(chatId);
    const loc = config.images.locations[p.location];
    await bot.sendPhoto(chatId, loc.file_id, {
        caption: `🏛️ *بقای باستانی*\n✨ ${p.name}\n📍 ${loc.emoji} ${loc.name}\n${loc.description}`,
        parse_mode: 'Markdown', ...mainMenu()
    });
});

// وضعیت
bot.onText(/👤 📊 وضعیت/, async (msg) => {
    const chatId = msg.chat.id;
    const p = player.getPlayer(chatId);
    if (!p) return bot.sendMessage(chatId, '❌ اول /start بزن!', mainMenu());
    await bot.sendMessage(chatId, player.formatStatus(p), { parse_mode: 'Markdown', ...mainMenu() });
});

// جمع‌آوری
bot.onText(/🌿 🪓 جمع‌آوری/, async (msg) => {
    const chatId = msg.chat.id;
    const p = player.getPlayer(chatId);
    if (!p) return bot.sendMessage(chatId, '❌ اول /start بزن!', mainMenu());
    
    const result = gather(p);
    
    if (result.eventImage) {
        await bot.sendPhoto(chatId, result.eventImage, {
            caption: result.message, parse_mode: 'Markdown', ...mainMenu()
        });
    } else {
        await bot.sendMessage(chatId, result.message, { parse_mode: 'Markdown', ...mainMenu() });
    }
});

// سفر
bot.onText(/🗺️ 🚶 سفر/, async (msg) => {
    const chatId = msg.chat.id;
    const p = player.getPlayer(chatId);
    if (!p) return bot.sendMessage(chatId, '❌ اول /start بزن!', mainMenu());
    
    const loc = config.images.locations[p.location];
    await bot.sendPhoto(chatId, loc.file_id, {
        caption: `📍 ${loc.emoji} ${loc.name}\n\nکجا می‌خوای بری؟`,
        parse_mode: 'Markdown', ...locationMenu()
    });
});

// انتخاب مقصد سفر
bot.onText(/^(.+) سفر به (.+)$/, async (msg, match) => {
    const chatId = msg.chat.id;
    const p = player.getPlayer(chatId);
    if (!p) return;
    
    const emoji = match[1];
    const name = match[2];
    
    for (let k in config.images.locations) {
        if (config.images.locations[k].emoji === emoji && config.images.locations[k].name === name) {
            const result = travel(p, k);
            
            if (result.travelImage) {
                await bot.sendPhoto(chatId, result.travelImage, {
                    caption: result.message, parse_mode: 'Markdown', ...mainMenu()
                });
            } else {
                await bot.sendMessage(chatId, result.message, { parse_mode: 'Markdown', ...mainMenu() });
            }
            return;
        }
    }
});

// نبرد
bot.onText(/⚔️ 💀 نبرد/, async (msg) => {
    const chatId = msg.chat.id;
    const p = player.getPlayer(chatId);
    if (!p) return bot.sendMessage(chatId, '❌ اول /start بزن!', mainMenu());
    
    const result = startFight(p);
    
    if (!result.success) {
        return bot.sendMessage(chatId, result.message, mainMenu());
    }
    
    activeBattles[chatId] = result.enemy;
    
    await bot.sendPhoto(chatId, result.enemy.file_id, {
        caption: result.message, parse_mode: 'Markdown', ...getBattleKeyboard(result.enemy)
    });
});

// حمله در نبرد
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
            caption: `${formatBattle(p, enemy)}\n\n${result.message}`,
            parse_mode: 'Markdown', ...getBattleKeyboard(enemy)
        });
    }
});

// فرار در نبرد
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
            caption: `${formatBattle(p, enemy)}\n\n${result.message}`,
            parse_mode: 'Markdown', ...getBattleKeyboard(enemy)
        });
    }
});

// ساخت‌وساز
bot.onText(/🔨 ⚒️ ساخت‌وساز/, async (msg) => {
    const chatId = msg.chat.id;
    const p = player.getPlayer(chatId);
    if (!p) return bot.sendMessage(chatId, '❌ اول /start بزن!', mainMenu());
    
    await bot.sendPhoto(chatId, config.images.npcs.blacksmith.file_id, {
        caption: showCraftMenu(), parse_mode: 'Markdown', ...craftKeyboard()
    });
});

// ساخت آیتم
bot.onText(/^(.+) 🔨 ساخت (.+)$/, async (msg, match) => {
    const chatId = msg.chat.id;
    const p = player.getPlayer(chatId);
    if (!p) return;
    
    const result = craftItem(p, match[2]);
    await bot.sendMessage(chatId, result.message, { parse_mode: 'Markdown', ...craftKeyboard() });
});

// بازار
bot.onText(/🏪 💰 بازار/, async (msg) => {
    const chatId = msg.chat.id;
    const p = player.getPlayer(chatId);
    if (!p) return bot.sendMessage(chatId, '❌ اول /start بزن!', mainMenu());
    
    if (p.location !== 'village') {
        return bot.sendMessage(chatId, '🏪 بازار فقط توی روستای باستانیه!', mainMenu());
    }
    
    await bot.sendPhoto(chatId, config.images.npcs.merchant.file_id, {
        caption: `${showShopMenu()}\n\n👑 طلا: ${p.inventory.gold}`,
        parse_mode: 'Markdown', ...shopKeyboard()
    });
});

// خرید
bot.onText(/^(.+) خرید (.+)$/, async (msg, match) => {
    const chatId = msg.chat.id;
    const p = player.getPlayer(chatId);
    if (!p) return;
    
    const itemMap = { 'چوب': 'wood', 'سنگ': 'stone', 'گوشت': 'meat', 'آب': 'water', 'پوست': 'skin', 'آهن': 'iron' };
    const result = buyItem(p, itemMap[match[2]]);
    await bot.sendMessage(chatId, result.message, shopKeyboard());
});

// فروش
bot.onText(/📤 فروش/, (msg) => {
    const chatId = msg.chat.id;
    bot.sendMessage(chatId, '📤 چی می‌خوای بفروشی؟', sellKeyboard());
});

// فروش آیتم
bot.onText(/^(.+) فروش (.+)$/, async (msg, match) => {
    const chatId = msg.chat.id;
    const p = player.getPlayer(chatId);
    if (!p) return;
    
    const itemMap = { 'چوب': 'wood', 'سنگ': 'stone', 'گوشت': 'meat', 'آب': 'water', 'پوست': 'skin', 'آهن': 'iron' };
    const result = sellItem(p, itemMap[match[2]]);
    await bot.sendMessage(chatId, result.message, sellKeyboard());
});

// اینونتوری
bot.onText(/🎒 📦 اینونتوری/, async (msg) => {
    const chatId = msg.chat.id;
    const p = player.getPlayer(chatId);
    if (!p) return bot.sendMessage(chatId, '❌ اول /start بزن!', mainMenu());
    
    await bot.sendMessage(chatId, player.formatStatus(p), { parse_mode: 'Markdown', ...mainMenu() });
});

// برگشت
bot.onText(/🔙 برگشت/, (msg) => {
    const chatId = msg.chat.id;
    delete activeBattles[chatId];
    bot.sendMessage(chatId, '🏛️ *منوی اصلی*', { parse_mode: 'Markdown', ...mainMenu() });
});

bot.onText(/🔙 بازار/, (msg) => {
    const chatId = msg.chat.id;
    const p = player.getPlayer(chatId);
    if (!p) return;
    bot.sendMessage(chatId, `🏪 *بازار* | 👑 ${p.inventory.gold}`, { parse_mode: 'Markdown', ...shopKeyboard() });
});

console.log('✅ ربات بقای باستانی آماده شد!');