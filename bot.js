const TelegramBot = require('node-telegram-bot-api');
const token = process.env.BOT_TOKEN || 'YOUR_BOT_TOKEN_HERE_PLACEHOLDER';
const bot = new TelegramBot(token, { polling: true });

const player = require('./player');
const { gather } = require('./gather');
const { travel } = require('./travel');
const { showCraftMenu, craftItem } = require('./craft');
const { activeBattles, startFight, playerAttack, playerEscape, formatBattle, getBattleKeyboard } = require('./fight');
const { showShopMenu, buyItem, sellItem } = require('./shop');
const { getDialogue, getNpcConfig, handleAction } = require('./dialogue');
const { isAdmin, adminCommand } = require('./admin');
const config = require('./config');

const activeDialogues = {};

// منوی اصلی
function mainMenu() {
    return {
        reply_markup: {
            keyboard: [
                ['👤 وضعیت', '🌿 جمع‌آوری'],
                ['🗺️ سفر', '⚔️ نبرد'],
                ['🔨 ساخت‌وساز', '🏪 بازار'],
                ['🎒 اینونتوری', '💬 NPCها']
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

// منوی NPCها
function npcMenu() {
    return {
        reply_markup: {
            keyboard: [
                ['🧙‍♀️ ساحره', '👻 روح'],
                ['🧚 پری', '👼 فرشته'],
                ['⚔️ شوالیه', '🎭 دلقک'],
                ['🤴 شاهزاده', '💀 اسکلت'],
                ['🐺 گرگینه', '🔙 برگشت']
            ],
            resize_keyboard: true
        }
    };
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

// منوی ساخت‌وساز
function craftKeyboard() {
    const buttons = [];
    for (let n in config.recipes) {
        buttons.push([`🔨 ساخت ${n}`]);
    }
    buttons.push(['🔙 برگشت']);
    return { reply_markup: { keyboard: buttons, resize_keyboard: true } };
}

// 🎮 /start
bot.onText(/\/start/, async (msg) => {
    const chatId = msg.chat.id;
    if (!player.getPlayer(chatId)) {
        const p = player.createPlayer(chatId);
        p.npcEncounters = {};
        p.seduced = {};
    }
    const p = player.getPlayer(chatId);
    const loc = config.images.locations[p.location];
    await bot.sendPhoto(chatId, loc.file_id, {
        caption: `🏛️ *بقای باستانی*\n✨ ${p.name}\n📍 ${loc.emoji} ${loc.name}\n${loc.description}`,
        parse_mode: 'Markdown', ...mainMenu()
    });
});

// 👑 دستورات ادمین
bot.onText(/\/admin (.+)/, (msg, match) => {
    const chatId = msg.chat.id;
    if (!isAdmin(chatId)) return bot.sendMessage(chatId, '❌ فقط ادمین می‌تونه!');
    const p = player.getPlayer(chatId);
    if (!p) return;
    const args = match[1].split(' ');
    const cmd = args.shift();
    const result = adminCommand(p, cmd, args);
    bot.sendMessage(chatId, result.message, { parse_mode: 'Markdown', ...mainMenu() });
});

// 👤 وضعیت
bot.onText(/^👤 وضعیت$/, async (msg) => {
    const chatId = msg.chat.id;
    const p = player.getPlayer(chatId);
    if (!p) return bot.sendMessage(chatId, '❌ اول /start بزن!', mainMenu());
    await bot.sendMessage(chatId, player.formatStatus(p), { parse_mode: 'Markdown', ...mainMenu() });
});

// 🌿 جمع‌آوری
bot.onText(/^🌿 جمع‌آوری$/, async (msg) => {
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

// 🗺️ سفر
bot.onText(/^🗺️ سفر$/, async (msg) => {
    const chatId = msg.chat.id;
    const p = player.getPlayer(chatId);
    if (!p) return bot.sendMessage(chatId, '❌ اول /start بزن!', mainMenu());
    const loc = config.images.locations[p.location];
    await bot.sendPhoto(chatId, loc.file_id, {
        caption: `📍 ${loc.emoji} ${loc.name}\n\nکجا می‌خوای بری؟`,
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

// ⚔️ نبرد
bot.onText(/^⚔️ نبرد$/, async (msg) => {
    const chatId = msg.chat.id;
    const p = player.getPlayer(chatId);
    if (!p) return bot.sendMessage(chatId, '❌ اول /start بزن!', mainMenu());
    const result = startFight(p);
    if (!result.success) return bot.sendMessage(chatId, result.message, mainMenu());
    activeBattles[chatId] = result.enemy;
    await bot.sendPhoto(chatId, result.enemy.file_id, {
        caption: result.message, parse_mode: 'Markdown', ...getBattleKeyboard(result.enemy)
    });
});

// ⚔️ حمله در نبرد
bot.onText(/⚔️ 🗡️ حمله کن/, async (msg) => {
    const chatId = msg.chat.id;
    const p = player.getPlayer(chatId);
    const enemy = activeBattles[chatId];
    if (!p || !enemy) return bot.sendMessage(chatId, '⚔️ نبردی در جریان نیست!', mainMenu());
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

// 🏃 فرار در نبرد
bot.onText(/🏃 💨 فرار کن/, async (msg) => {
    const chatId = msg.chat.id;
    const p = player.getPlayer(chatId);
    const enemy = activeBattles[chatId];
    if (!p || !enemy) return bot.sendMessage(chatId, '⚔️ نبردی در جریان نیست!', mainMenu());
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

// 🔨 ساخت‌وساز
bot.onText(/^🔨 ساخت‌وساز$/, async (msg) => {
    const chatId = msg.chat.id;
    const p = player.getPlayer(chatId);
    if (!p) return bot.sendMessage(chatId, '❌ اول /start بزن!', mainMenu());
    await bot.sendPhoto(chatId, config.images.npcs.blacksmith.file_id, {
        caption: showCraftMenu(), parse_mode: 'Markdown', ...craftKeyboard()
    });
});

// ساخت آیتم
bot.onText(/🔨 ساخت (.+)/, (msg, match) => {
    const chatId = msg.chat.id;
    const p = player.getPlayer(chatId);
    if (!p) return;
    const result = craftItem(p, match[1]);
    bot.sendMessage(chatId, result.message, { parse_mode: 'Markdown', ...craftKeyboard() });
});

// 🏪 بازار
bot.onText(/^🏪 بازار$/, async (msg) => {
    const chatId = msg.chat.id;
    const p = player.getPlayer(chatId);
    if (!p) return bot.sendMessage(chatId, '❌ اول /start بزن!', mainMenu());
    if (p.location !== 'village') return bot.sendMessage(chatId, '🏪 بازار فقط توی روستای باستانیه!', mainMenu());
    await bot.sendPhoto(chatId, config.images.npcs.merchant.file_id, {
        caption: `${showShopMenu()}\n\n👑 طلا: ${p.inventory.gold}`,
        parse_mode: 'Markdown', ...shopKeyboard()
    });
});

// خرید
bot.onText(/^(.+) خرید (.+)$/, (msg, match) => {
    const chatId = msg.chat.id;
    const p = player.getPlayer(chatId);
    if (!p) return;
    const map = { 'چوب': 'wood', 'سنگ': 'stone', 'گوشت': 'meat', 'آب': 'water', 'پوست': 'skin', 'آهن': 'iron' };
    const result = buyItem(p, map[match[2]]);
    bot.sendMessage(chatId, result.message, shopKeyboard());
});

// 📤 فروش
bot.onText(/^📤 فروش$/, (msg) => {
    const chatId = msg.chat.id;
    bot.sendMessage(chatId, '📤 چی می‌خوای بفروشی؟', sellKeyboard());
});

// فروش آیتم
bot.onText(/^(.+) فروش (.+)$/, (msg, match) => {
    const chatId = msg.chat.id;
    const p = player.getPlayer(chatId);
    if (!p) return;
    const map = { 'چوب': 'wood', 'سنگ': 'stone', 'گوشت': 'meat', 'آب': 'water', 'پوست': 'skin', 'آهن': 'iron' };
    const result = sellItem(p, map[match[2]]);
    bot.sendMessage(chatId, result.message, sellKeyboard());
});

// 🎒 اینونتوری
bot.onText(/^🎒 اینونتوری$/, async (msg) => {
    const chatId = msg.chat.id;
    const p = player.getPlayer(chatId);
    if (!p) return bot.sendMessage(chatId, '❌ اول /start بزن!', mainMenu());
    await bot.sendMessage(chatId, player.formatStatus(p), { parse_mode: 'Markdown', ...mainMenu() });
});

// 💬 NPCها
bot.onText(/^💬 NPCها$/, async (msg) => {
    const chatId = msg.chat.id;
    await bot.sendMessage(chatId, '🎭 *با کی می‌خوای حرف بزنی؟*', { parse_mode: 'Markdown', ...npcMenu() });
});

// انتخاب NPC
bot.onText(/^(🧙‍♀️|👻|🧚|👼|⚔️|🎭|🤴|💀|🐺) (.+)$/, async (msg, match) => {
    const chatId = msg.chat.id;
    const p = player.getPlayer(chatId);
    if (!p) return;

    const npcMap = {
        '🧙‍♀️': 'witch', '👻': 'ghost', '🧚': 'fairy', '👼': 'angel',
        '⚔️': 'knight', '🎭': 'jester', '🤴': 'prince', '💀': 'skeleton', '🐺': 'werewolf'
    };
    const npcId = npcMap[match[1]];
    if (!npcId) return;

    if (!p.npcEncounters) p.npcEncounters = {};
    p.npcEncounters[npcId] = (p.npcEncounters[npcId] || 0) + 1;
    
    const dialogue = getDialogue(npcId, p.npcEncounters[npcId] - 1);
    if (!dialogue) return bot.sendMessage(chatId, '🤐 این NPC حرفی برای گفتن نداره...', mainMenu());

    activeDialogues[chatId] = { npcId, encounter: p.npcEncounters[npcId] - 1 };

    const npc = getNpcConfig(npcId);
    let image = null;
    if (npc?.image) {
        image = config.images.npcs[npc.image]?.file_id || config.images.enemies[npc.image]?.file_id;
    }

    const keyboard = { reply_markup: { keyboard: dialogue.options.map(o => [o.text]), resize_keyboard: true } };

    if (image) {
        await bot.sendPhoto(chatId, image, { caption: dialogue.text, ...keyboard });
    } else {
        await bot.sendMessage(chatId, dialogue.text, keyboard);
    }
});

// پاسخ به دیالوگ
bot.onText(/^(🗡️|💋|🏃|🤝|🕯️|👂|💰|🕊️|💎|⚔️|❤️|👼|🎁|😘|🧪) (.+)$/, async (msg, match) => {
    const chatId = msg.chat.id;
    const p = player.getPlayer(chatId);
    const dialogue = activeDialogues[chatId];
    if (!p || !dialogue) return;

    const currentDialogue = getDialogue(dialogue.npcId, dialogue.encounter);
    if (!currentDialogue) return;

    const selectedOption = currentDialogue.options.find(o => o.text.startsWith(match[1]));
    if (!selectedOption) return;

    const result = handleAction(p, dialogue.npcId, selectedOption.action);

    if (result.battleStart) {
        delete activeDialogues[chatId];
        const fightResult = startFight(p);
        if (fightResult.success) {
            activeBattles[chatId] = fightResult.enemy;
            await bot.sendPhoto(chatId, fightResult.enemy.file_id, {
                caption: `${result.message}\n\n${fightResult.message}`,
                parse_mode: 'Markdown', ...getBattleKeyboard(fightResult.enemy)
            });
        }
    } else {
        await bot.sendMessage(chatId, result.message, { parse_mode: 'Markdown', ...mainMenu() });
    }
});

// 🔙 برگشت
bot.onText(/^🔙 برگشت$/, (msg) => {
    const chatId = msg.chat.id;
    delete activeBattles[chatId];
    delete activeDialogues[chatId];
    bot.sendMessage(chatId, '🏛️ *منوی اصلی*', { parse_mode: 'Markdown', ...mainMenu() });
});

bot.onText(/^🔙 بازار$/, (msg) => {
    const chatId = msg.chat.id;
    const p = player.getPlayer(chatId);
    bot.sendMessage(chatId, `🏪 *بازار* | 👑 ${p?.inventory?.gold || 0}`, { parse_mode: 'Markdown', ...shopKeyboard() });
});

console.log('✅ ربات بقای باستانی با همه امکانات آماده شد! 🎉');