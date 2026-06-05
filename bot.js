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

function locationMenu() {
    const buttons = [];
    for (let k in config.images.locations) {
        const l = config.images.locations[k];
        buttons.push([`${l.emoji} سفر به ${l.name}`]);
    }
    buttons.push(['🔙 برگشت']);
    return { reply_markup: { keyboard: buttons, resize_keyboard: true } };
}

function craftKeyboard() {
    const buttons = [];
    for (let n in config.recipes) {
        buttons.push([`${config.recipes[n].emoji} 🔨 ساخت ${n}`]);
    }
    buttons.push(['🔙 برگشت']);
    return { reply_markup: { keyboard: buttons, resize_keyboard: true } };
}

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
        caption: `🏛️ *بقای باستانی*\n✨ ${p.name} | 📍 ${loc.emoji} ${loc.name}\n${loc.description}`,
        parse_mode: 'Markdown', ...mainMenu()
    });
});

// وضعیت
bot.onText(/👤 📊 وضعیت/, async (msg) => {
    const chatId = msg.chat.id;
    const p = player.getPlayer(chatId);
    if (!p) return bot.sendMessage(chatId, '❌ /start بزن!', mainMenu());
    await bot.sendMessage(chatId, player.formatStatus(p), { parse_mode: 'Markdown', ...mainMenu() });
});

// جمع‌آوری
bot.onText(/🌿 🪓 جمع‌آوری/, async (msg) => {
    const chatId = msg.chat.id;
    const p = player.getPlayer(chatId);
    if (!p) return bot.sendMessage(chatId, '❌ /start بزن!', mainMenu());
    const result = gather(p);
    if (result.eventImage) {
        await bot.sendPhoto(chatId, result.eventImage, { caption: result.message, parse_mode: 'Markdown', ...mainMenu() });
    } else {
        await bot.sendMessage(chatId, result.message, { parse_mode: 'Markdown', ...mainMenu() });
    }
});

// سفر
bot.onText(/🗺️ 🚶 سفر/, async (msg) => {
    const chatId = msg.chat.id;
    const p = player.getPlayer(chatId);
    if (!p) return bot.sendMessage(chatId, '❌ /start بزن!', mainMenu());
    const loc = config.images.locations[p.location];
    await bot.sendPhoto(chatId, loc.file_id, {
        caption: `📍 ${loc.emoji} ${loc.name}\nکجا بری؟`, parse_mode: 'Markdown', ...locationMenu()
    });
});

bot.onText(/^(.+) سفر به (.+)$/, async (msg, match) => {
    const chatId = msg.chat.id;
    const p = player.getPlayer(chatId);
    if (!p) return;
    for (let k in config.images.locations) {
        if (config.images.locations[k].emoji === match[1] && config.images.locations[k].name === match[2]) {
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
    if (!p) return bot.sendMessage(chatId, '❌ /start بزن!', mainMenu());
    const result = startFight(p);
    if (!result.success) return bot.sendMessage(chatId, result.message, mainMenu());
    activeBattles[chatId] = result.enemy;
    await bot.sendPhoto(chatId, result.enemy.file_id, {
        caption: result.message, parse_mode: 'Markdown', ...getBattleKeyboard(result.enemy)
    });
});

bot.onText(/⚔️ 🗡️ حمله کن/, async (msg) => {
    const chatId = msg.chat.id;
    const p = player.getPlayer(chatId);
    const enemy = activeBattles[chatId];
    if (!p || !enemy) return bot.sendMessage(chatId, '⚔️ نبردی نیست!', mainMenu());
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

bot.onText(/🏃 💨 فرار کن/, async (msg) => {
    const chatId = msg.chat.id;
    const p = player.getPlayer(chatId);
    const enemy = activeBattles[chatId];
    if (!p || !enemy) return bot.sendMessage(chatId, '⚔️ نبردی نیست!', mainMenu());
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
    if (!p) return bot.sendMessage(chatId, '❌ /start بزن!', mainMenu());
    await bot.sendPhoto(chatId, config.images.npcs.blacksmith.file_id, {
        caption: showCraftMenu(), parse_mode: 'Markdown', ...craftKeyboard()
    });
});

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
    if (!p) return bot.sendMessage(chatId, '❌ /start بزن!', mainMenu());
    if (p.location !== 'village') return bot.sendMessage(chatId, '🏪 فقط تو روستا!', mainMenu());
    await bot.sendPhoto(chatId, config.images.npcs.merchant.file_id, {
        caption: `${showShopMenu()}\