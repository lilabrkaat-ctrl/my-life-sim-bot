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

function mainMenu() {
    return { reply_markup: { keyboard: [['👤 وضعیت', '🌿 جمع‌آوری'], ['🗺️ سفر', '⚔️ نبرد'], ['🔨 ساخت‌وساز', '🏪 بازار'], ['🎒 اینونتوری', '💬 NPCها']], resize_keyboard: true } };
}

function locationMenu() {
    const b = []; for (let k in config.images.locations) b.push([`${config.images.locations[k].emoji} سفر به ${config.images.locations[k].name}`]); b.push(['🔙 برگشت']); return { reply_markup: { keyboard: b, resize_keyboard: true } };
}

function npcMenu() {
    return { reply_markup: { keyboard: [['🧙‍♀️ ساحره', '👻 روح'], ['🧚 پری', '👼 فرشته'], ['⚔️ شوالیه', '🎭 دلقک'], ['🤴 شاهزاده', '💀 اسکلت'], ['🐺 گرگینه', '🔙 برگشت']], resize_keyboard: true } };
}

function shopKeyboard() {
    return { reply_markup: { keyboard: [['🪵 خرید چوب', '🪨 خرید سنگ'], ['🍖 خرید گوشت', '💧 خرید آب'], ['🦴 خرید پوست', '⛏️ خرید آهن'], ['📤 فروش', '🔙 برگشت']], resize_keyboard: true } };
}

function sellKeyboard() {
    return { reply_markup: { keyboard: [['🪵 فروش چوب', '🪨 فروش سنگ'], ['🍖 فروش گوشت', '💧 فروش آب'], ['🦴 فروش پوست', '⛏️ فروش آهن'], ['🔙 بازار']], resize_keyboard: true } };
}

function craftKeyboard() {
    const b = []; for (let n in config.recipes) b.push([`🔨 ساخت ${n}`]); b.push(['🔙 برگشت']); return { reply_markup: { keyboard: b, resize_keyboard: true } };
}

// /start
bot.onText(/\/start/, async (msg) => {
    const chatId = msg.chat.id;
    if (!player.getPlayer(chatId)) { const p = player.createPlayer(chatId); p.npcEncounters = {}; p.seduced = {}; }
    const p = player.getPlayer(chatId);
    const loc = config.images.locations[p.location];
    await bot.sendPhoto(chatId, loc.file_id, { caption: `🏛️ *بقای باستانی*\n✨ ${p.name}\n📍 ${loc.emoji} ${loc.name}\n${loc.description}`, parse_mode: 'Markdown', ...mainMenu() });
});

// ادمین
bot.onText(/\/admin (.+)/, (msg, match) => {
    const chatId = msg.chat.id;
    if (!isAdmin(chatId)) return bot.sendMessage(chatId, '❌ فقط ادمین!');
    const p = player.getPlayer(chatId); if (!p) return;
    const args = match[1].split(' '); const cmd = args.shift();
    const result = adminCommand(p, cmd, args);
    bot.sendMessage(chatId, result.message, { parse_mode: 'Markdown', ...mainMenu() });
});

// وضعیت
bot.onText(/^👤 وضعیت$/, async (msg) => { const chatId = msg.chat.id; const p = player.getPlayer(chatId); if (!p) return bot.sendMessage(chatId, '❌ /start بزن!', mainMenu()); await bot.sendMessage(chatId, player.formatStatus(p), { parse_mode: 'Markdown', ...mainMenu() }); });

// جمع‌آوری
bot.onText(/^🌿 جمع‌آوری$/, async (msg) => {
    const chatId = msg.chat.id; const p = player.getPlayer(chatId); if (!p) return bot.sendMessage(chatId, '❌ /start بزن!', mainMenu());
    const result = gather(p);
    if (result.npcEncounter) {
        const npcId = result.npcEncounter;
        if (!p.npcEncounters) p.npcEncounters = {};
        p.npcEncounters[npcId] = (p.npcEncounters[npcId] || 0) + 1;
        const dialogue = getDialogue(npcId, p.npcEncounters[npcId] - 1);
        if (result.npcImage) await bot.sendPhoto(chatId, result.npcImage, { caption: result.message, parse_mode: 'Markdown' });
        else await bot.sendMessage(chatId, result.message, { parse_mode: 'Markdown' });
        if (dialogue) {
            activeDialogues[chatId] = { npcId, encounter: p.npcEncounters[npcId] - 1 };
            const npc = getNpcConfig(npcId);
            let img = npc?.image ? (config.images.npcs[npc.image]?.file_id || config.images.enemies[npc.image]?.file_id) : null;
            const keyboard = { reply_markup: { keyboard: dialogue.options.map(o => [o.text]), resize_keyboard: true } };
            if (img) await bot.sendPhoto(chatId, img, { caption: dialogue.text, ...keyboard });
            else await bot.sendMessage(chatId, dialogue.text, keyboard);
            return;
        }
        return bot.sendMessage(chatId, '🤐 این NPC حرفی برای گفتن نداره...', mainMenu());
    }
    if (result.eventImage) await bot.sendPhoto(chatId, result.eventImage, { caption: result.message, parse_mode: 'Markdown', ...mainMenu() });
    else await bot.sendMessage(chatId, result.message, { parse_mode: 'Markdown', ...mainMenu() });
});

// سفر
bot.onText(/^🗺️ سفر$/, async (msg) => { const chatId = msg.chat.id; const p = player.getPlayer(chatId); if (!p) return bot.sendMessage(chatId, '❌ /start بزن!', mainMenu()); await bot.sendPhoto(chatId, config.images.locations[p.location].file_id, { caption: `📍 کجا بری؟`, ...locationMenu() }); });

bot.onText(/^(.+) سفر به (.+)$/, async (msg, match) => {
    const chatId = msg.chat.id; const p = player.getPlayer(chatId); if (!p) return;
    for (let k in config.images.locations) {
        if (config.images.locations[k].emoji === match[1] && config.images.locations[k].name === match[2]) {
            const result = travel(p, k);
            if (result.travelImage) await bot.sendPhoto(chatId, result.travelImage, { caption: result.message, parse_mode: 'Markdown' });
            else await bot.sendMessage(chatId, result.message, { parse_mode: 'Markdown' });
            if (result.npcEncounter) {
                const npcId = result.npcEncounter;
                if (!p.npcEncounters) p.npcEncounters = {};
                p.npcEncounters[npcId] = (p.npcEncounters[npcId] || 0) + 1;
                const dialogue = getDialogue(npcId, p.npcEncounters[npcId] - 1);
                if (dialogue) {
                    activeDialogues[chatId] = { npcId, encounter: p.npcEncounters[npcId] - 1 };
                    const npc = getNpcConfig(npcId);
                    let img = npc?.image ? (config.images.npcs[npc.image]?.file_id || config.images.enemies[npc.image]?.file_id) : null;
                    const keyboard = { reply_markup: { keyboard: dialogue.options.map(o => [o.text]), resize_keyboard: true } };
                    if (img) await bot.sendPhoto(chatId, img, { caption: dialogue.text, ...keyboard });
                    else await bot.sendMessage(chatId, dialogue.text, keyboard);
                    return;
                }
            }
            return bot.sendMessage(chatId, '🏛️', mainMenu());
        }
    }
});

// نبرد
bot.onText(/^⚔️ نبرد$/, async (msg) => { const chatId = msg.chat.id; const p = player.getPlayer(chatId); if (!p) return bot.sendMessage(chatId, '❌ /start بزن!', mainMenu()); const result = startFight(p); if (!result.success) return bot.sendMessage(chatId, result.message, mainMenu()); activeBattles[chatId] = result.enemy; await bot.sendPhoto(chatId, result.enemy.file_id, { caption: result.message, parse_mode: 'Markdown', ...getBattleKeyboard(result.enemy) }); });

bot.onText(/⚔️ 🗡️ حمله کن/, async (msg) => { const chatId = msg.chat.id; const p = player.getPlayer(chatId); const enemy = activeBattles[chatId]; if (!p || !enemy) return bot.sendMessage(chatId, '⚔️ نبردی نیست!', mainMenu()); const result = playerAttack(p, enemy); if (result.battleOver) { delete activeBattles[chatId]; await bot.sendMessage(chatId, result.message, { parse_mode: 'Markdown', ...mainMenu() }); } else { await bot.sendPhoto(chatId, enemy.file_id, { caption: `${formatBattle(p, enemy)}\n\n${result.message}`, parse_mode: 'Markdown', ...getBattleKeyboard(enemy) }); } });

bot.onText(/🏃 💨 فرار کن/, async (msg) => { const chatId = msg.chat.id; const p = player.getPlayer(chatId); const enemy = activeBattles[chatId]; if (!p || !enemy) return bot.sendMessage(chatId, '⚔️ نبردی نیست!', mainMenu()); const result = playerEscape(p, enemy); if (result.battleOver) { delete activeBattles[chatId]; await bot.sendMessage(chatId, result.message, { parse_mode: 'Markdown', ...mainMenu() }); } else { await bot.sendPhoto(chatId, enemy.file_id, { caption: `${formatBattle(p, enemy)}\n\n${result.message}`, parse_mode: 'Markdown', ...getBattleKeyboard(enemy) }); } });

// ساخت‌وساز
bot.onText(/^🔨 ساخت‌وساز$/, async (msg) => { const chatId = msg.chat.id; const p = player.getPlayer(chatId); if (!p) return bot.sendMessage(chatId, '❌ /start بزن!', mainMenu()); await bot.sendPhoto(chatId, config.images.npcs.blacksmith.file_id, { caption: showCraftMenu(), parse_mode: 'Markdown', ...craftKeyboard() }); });
bot.onText(/🔨 ساخت (.+)/, (msg, match) => { const chatId = msg.chat.id; const p = player.getPlayer(chatId); if (!p) return; const result = craftItem(p, match[1]); bot.sendMessage(chatId, result.message, { parse_mode: 'Markdown', ...craftKeyboard() }); });

// بازار
bot.onText(/^🏪 بازار$/, async (msg) => { const chatId = msg.chat.id; const p = player.getPlayer(chatId); if (!p) return bot.sendMessage(chatId, '❌ /start بزن!', mainMenu()); if (p.location !== 'village') return bot.sendMessage(chatId, '🏪 فقط تو روستا!', mainMenu()); await bot.sendPhoto(chatId, config.images.npcs.merchant.file_id, { caption: `${showShopMenu()}\n\n👑 ${p.inventory.gold}`, parse_mode: 'Markdown', ...shopKeyboard() }); });
bot.onText(/^(.+) خرید (.+)$/, (msg, match) => { const chatId = msg.chat.id; const p = player.getPlayer(chatId); if (!p) return; const m = { 'چوب': 'wood', 'سنگ': 'stone', 'گوشت': 'meat', 'آب': 'water', 'پوست': 'skin', 'آهن': 'iron' }; bot.sendMessage(chatId, buyItem(p, m[match[2]]).message, shopKeyboard()); });
bot.onText(/^📤 فروش$/, (msg) => { bot.sendMessage(msg.chat.id, '📤 چی بفروشم؟', sellKeyboard()); });
bot.onText(/^(.+) فروش (.+)$/, (msg, match) => { const chatId = msg.chat.id; const p = player.getPlayer(chatId); if (!p) return; const m = { 'چوب': 'wood', 'سنگ': 'stone', 'گوشت': 'meat', 'آب': 'water', 'پوست': 'skin', 'آهن': 'iron' }; bot.sendMessage(chatId, sellItem(p, m[match[2]]).message, sellKeyboard()); });

// اینونتوری
bot.onText(/^🎒 اینونتوری$/, async (msg) => { const chatId = msg.chat.id; const p = player.getPlayer(chatId); if (!p) return bot.sendMessage(chatId, '❌ /start بزن!', mainMenu()); await bot.sendMessage(chatId, player.formatStatus(p), { parse_mode: 'Markdown', ...mainMenu() }); });

// NPCها
bot.onText(/^💬 NPCها$/, async (msg) => { await bot.sendMessage(msg.chat.id, '🎭 *با کی حرف بزنی؟*', { parse_mode: 'Markdown', ...npcMenu() }); });

// انتخاب NPC
bot.onText(/^(🧙‍♀️|👻|🧚|👼|⚔️|🎭|🤴|💀|🐺) (.+)$/, async (msg, match) => {
    const chatId = msg.chat.id; const p = player.getPlayer(chatId); if (!p) return;
    const map = { '🧙‍♀️': 'witch', '👻': 'ghost', '🧚': 'fairy', '👼': 'angel', '⚔️': 'knight', '🎭': 'jester', '🤴': 'prince', '💀': 'skeleton', '🐺': 'werewolf' };
    const npcId = map[match[1]]; if (!npcId) return;
    if (!p.npcEncounters) p.npcEncounters = {};
    p.npcEncounters[npcId] = (p.npcEncounters[npcId] || 0) + 1;
    const dialogue = getDialogue(npcId, p.npcEncounters[npcId] - 1);
    if (!dialogue) return bot.sendMessage(chatId, '🤐 حرفی نداره...', mainMenu());
    activeDialogues[chatId] = { npcId, encounter: p.npcEncounters[npcId] - 1 };
    const npc = getNpcConfig(npcId);
    let img = npc?.image ? (config.images.npcs[npc.image]?.file_id || config.images.enemies[npc.image]?.file_id) : null;
    const keyboard = { reply_markup: { keyboard: dialogue.options.map(o => [o.text]), resize_keyboard: true } };
    if (img) await bot.sendPhoto(chatId, img, { caption: dialogue.text, ...keyboard });
    else await bot.sendMessage(chatId, dialogue.text, keyboard);
});

// پاسخ دیالوگ
bot.onText(/^(🗡️|💋|🏃|🤝|🕯️|👂|💰|🕊️|💎|⚔️|❤️|👼|🎁|😘|🧪|😂|😐|🍖) (.+)$/, async (msg, match) => {
    const chatId = msg.chat.id; const p = player.getPlayer(chatId);
    const dialogue = activeDialogues[chatId]; if (!p || !dialogue) return;
    const currentDialogue = getDialogue(dialogue.npcId, dialogue.encounter); if (!currentDialogue) return;
    const selectedOption = currentDialogue.options.find(o => o.text.startsWith(match[1])); if (!selectedOption) return;
    const result = handleAction(p, dialogue.npcId, selectedOption.action);
    if (result.battleStart) {
        delete activeDialogues[chatId];
        const fightResult = startFight(p);
        if (fightResult.success) {
            activeBattles[chatId] = fightResult.enemy;
            await bot.sendPhoto(chatId, fightResult.enemy.file_id, { caption: `${result.message}\n\n${fightResult.message}`, parse_mode: 'Markdown', ...getBattleKeyboard(fightResult.enemy) });
        }
    } else {
        await bot.sendMessage(chatId, result.message, { parse_mode: 'Markdown', ...mainMenu() });
    }
});

// برگشت
bot.onText(/^🔙 برگشت$/, (msg) => { const chatId = msg.chat.id; delete activeBattles[chatId]; delete activeDialogues[chatId]; bot.sendMessage(chatId, '🏛️ *منوی اصلی*', { parse_mode: 'Markdown', ...mainMenu() }); });
bot.onText(/^🔙 بازار$/, (msg) => { const chatId = msg.chat.id; const p = player.getPlayer(chatId); bot.sendMessage(chatId, `🏪 *بازار* | 👑 ${p?.inventory?.gold || 0}`, { parse_mode: 'Markdown', ...shopKeyboard() }); });

console.log('✅ ربات بقای باستانی آماده شد! 🎉');