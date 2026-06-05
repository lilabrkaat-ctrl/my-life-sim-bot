const TelegramBot = require('node-telegram-bot-api');
const token = process.env.BOT_TOKEN;
const bot = new TelegramBot(token, { polling: true });

const fs = require('fs');
const path = require('path');

// بارگذاری images.json با check
let images = null;
try {
    const imagesPath = path.join(__dirname, 'images.json');
    if (fs.existsSync(imagesPath)) {
        images = JSON.parse(fs.readFileSync(imagesPath, 'utf8'));
        console.log('✅ images.json بارگذاری شد!');
    } else {
        console.log('⚠️ images.json پیدا نشد!');
    }
} catch (e) {
    console.log('❌ خطا در بارگذاری images.json:', e.message);
}

const player = require('./player');
const { gather } = require('./gather');
const { travel } = require('./travel');
const { showCraftMenu, craftItem } = require('./craft');
const { activeBattles, startFight, playerAttack, playerEscape, formatBattle, getBattleKeyboard } = require('./fight');
const { showShopMenu, buyItem, sellItem } = require('./shop');
const { getDialogue, getNpcConfig, handleAction } = require('./dialogue');
const { isAdmin, adminCommand } = require('./admin');
const config = require('./config');

// اگه images.json نبود، config رو با آبجکت خالی جایگزین کن
if (!images) {
    config.images = { locations: {}, resources: {}, enemies: {}, npcs: {}, events: {} };
}

const activeDialogues = {};

function mainMenu() {
    return { reply_markup: { keyboard: [['👤 وضعیت', '🌿 جمع‌آوری'], ['🗺️ سفر', '⚔️ نبرد'], ['🔨 ساخت‌وساز', '🏪 بازار'], ['🎒 اینونتوری', '💬 NPCها']], resize_keyboard: true } };
}

function locationMenu() {
    const b = []; 
    if (config.images && config.images.locations) {
        for (let k in config.images.locations) {
            b.push([`${config.images.locations[k].emoji} سفر به ${config.images.locations[k].name}`]);
        }
    }
    b.push(['🔙 برگشت']); 
    return { reply_markup: { keyboard: b, resize_keyboard: true } };
}

function npcMenu() {
    return { reply_markup: { keyboard: [['🧙‍♀️ ساحره', '👻 روح'], ['🧚 پری', '👼 فرشته'], ['⚔️ شوالیه', '🎭 دلقک'], ['🤴 شاهزاده', '💀 اسکلت'], ['🐺 گرگینه', '🧙‍♂️ جادوگر'], ['🔙 برگشت']], resize_keyboard: true } };
}

function shopKeyboard() {
    return { reply_markup: { keyboard: [['🪵 خرید چوب', '🪨 خرید سنگ'], ['🍖 خرید گوشت', '💧 خرید آب'], ['🦴 خرید پوست', '⛏️ خرید آهن'], ['📤 فروش', '🔙 برگشت']], resize_keyboard: true } };
}

function sellKeyboard() {
    return { reply_markup: { keyboard: [['🪵 فروش چوب', '🪨 فروش سنگ'], ['🍖 فروش گوشت', '💧 فروش آب'], ['🦴 فروش پوست', '⛏️ فروش آهن'], ['🔙 بازار']], resize_keyboard: true } };
}

function craftKeyboard() {
    const b = []; 
    for (let n in config.recipes) b.push([`🔨 ساخت ${n}`]); 
    b.push(['🔙 برگشت']); 
    return { reply_markup: { keyboard: b, resize_keyboard: true } };
}

// تابع کمکی برای ارسال عکس یا متن
async function sendWithImage(chatId, caption, fileId, keyboard) {
    if (fileId && images) {
        try {
            await bot.sendPhoto(chatId, fileId, { caption, parse_mode: 'Markdown', ...keyboard });
            return;
        } catch (e) {
            console.log('⚠️ خطا در ارسال عکس، متن ارسال شد');
        }
    }
    await bot.sendMessage(chatId, caption, { parse_mode: 'Markdown', ...keyboard });
}

// /start
bot.onText(/\/start/, async (msg) => {
    const chatId = msg.chat.id;
    if (!player.getPlayer(chatId)) { 
        const p = player.createPlayer(chatId); 
        p.npcEncounters = {}; 
        p.seduced = {}; 
    }
    const p = player.getPlayer(chatId);
    
    let loc = { emoji: '🏘️', name: 'روستای باستانی', description: 'محل امن', file_id: null };
    if (config.images && config.images.locations && config.images.locations[p.location]) {
        loc = config.images.locations[p.location];
    }
    
    await sendWithImage(chatId, `🏛️ *بقای باستانی*\n✨ ${p.name}\n📍 ${loc.emoji} ${loc.name}\n${loc.description}`, loc.file_id, mainMenu());
});

// 👑 ادمین
bot.onText(/\/admin (.+)/, (msg, match) => {
    const chatId = msg.chat.id;
    if (!isAdmin(chatId)) return bot.sendMessage(chatId, '❌ فقط ادمین!');
    const p = player.getPlayer(chatId); if (!p) return;
    const args = match[1].split(' '); const cmd = args.shift();
    const result = adminCommand(p, cmd, args);
    bot.sendMessage(chatId, result.message, { parse_mode: 'Markdown', ...mainMenu() });
});

// 👤 وضعیت
bot.onText(/^👤 وضعیت$/, async (msg) => { 
    const chatId = msg.chat.id; const p = player.getPlayer(chatId); 
    if (!p) return bot.sendMessage(chatId, '❌ /start بزن!', mainMenu()); 
    await bot.sendMessage(chatId, player.formatStatus(p), { parse_mode: 'Markdown', ...mainMenu() }); 
});

// 🌿 جمع‌آوری
bot.onText(/^🌿 جمع‌آوری$/, async (msg) => {
    const chatId = msg.chat.id; const p = player.getPlayer(chatId); 
    if (!p) return bot.sendMessage(chatId, '❌ /start بزن!', mainMenu());
    const result = gather(p);
    
    if (result.npcEncounter) {
        const npcId = result.npcEncounter;
        if (!p.npcEncounters) p.npcEncounters = {};
        p.npcEncounters[npcId] = (p.npcEncounters[npcId] || 0) + 1;
        const dialogue = getDialogue(npcId, p.npcEncounters[npcId] - 1);
        
        await bot.sendMessage(chatId, result.message, { parse_mode: 'Markdown' });
        
        if (dialogue) {
            activeDialogues[chatId] = { npcId, encounter: p.npcEncounters[npcId] - 1 };
            const npc = getNpcConfig(npcId);
            let img = null;
            if (npc?.image && config.images) {
                img = config.images.npcs?.[npc.image]?.file_id || config.images.enemies?.[npc.image]?.file_id;
            }
            const keyboard = { reply_markup: { keyboard: dialogue.options.map(o => [o.text]), resize_keyboard: true } };
            await sendWithImage(chatId, dialogue.text, img, keyboard);
            return;
        }
        return bot.sendMessage(chatId, '🤐 این NPC حرفی برای گفتن نداره...', mainMenu());
    }
    
    await bot.sendMessage(chatId, result.message, { parse_mode: 'Markdown', ...mainMenu() });
});

// 🗺️ سفر
bot.onText(/^🗺️ سفر$/, async (msg) => { 
    const chatId = msg.chat.id; const p = player.getPlayer(chatId); 
    if (!p) return bot.sendMessage(chatId, '❌ /start بزن!', mainMenu()); 
    await bot.sendMessage(chatId, '📍 کجا بری؟', locationMenu()); 
});

bot.onText(/^(.+) سفر به (.+)$/, async (msg, match) => {
    const chatId = msg.chat.id; const p = player.getPlayer(chatId); if (!p) return;
    for (let k in config.images.locations) {
        if (config.images.locations[k].emoji === match[1] && config.images.locations[k].name === match[2]) {
            const result = travel(p, k);
            await bot.sendMessage(chatId, result.message, { parse_mode: 'Markdown' });
            
            if (result.npcEncounter) {
                const npcId = result.npcEncounter;
                if (!p.npcEncounters) p.npcEncounters = {};
                p.npcEncounters[npcId] = (p.npcEncounters[npcId] || 0) + 1;
                const dialogue = getDialogue(npcId, p.npcEncounters[npcId] - 1);
                if (dialogue) {
                    activeDialogues[chatId] = { npcId, encounter: p.npcEncounters[npcId] - 1 };
                    const npc = getNpcConfig(npcId);
                    let img = null;
                    if (npc?.image && config.images) {
                        img = config.images.npcs?.[npc.image]?.file_id || config.images.enemies?.[npc.image]?.file_id;
                    }
                    const keyboard = { reply_markup: { keyboard: dialogue.options.map(o => [o.text]), resize_keyboard: true } };
                    await sendWithImage(chatId, dialogue.text, img, keyboard);
                    return;
                }
            }
            return bot.sendMessage(chatId, '🏛️ *سفر تموم شد!*', { parse_mode: 'Markdown', ...mainMenu() });
        }
    }
});

// ⚔️ نبرد
bot.onText(/^⚔️ نبرد$/, async (msg) => { 
    const chatId = msg.chat.id; const p = player.getPlayer(chatId); 
    if (!p) return bot.sendMessage(chatId, '❌ /start بزن!', mainMenu()); 
    const result = startFight(p); 
    if (!result.success) return bot.sendMessage(chatId, result.message, mainMenu()); 
    activeBattles[chatId] = result.enemy; 
    await sendWithImage(chatId, result.message, result.enemy?.file_id, getBattleKeyboard(result.enemy)); 
});

bot.onText(/⚔️ 🗡️ حمله کن/, async (msg) => { 
    const chatId = msg.chat.id; const p = player.getPlayer(chatId); const enemy = activeBattles[chatId]; 
    if (!p || !enemy) return bot.sendMessage(chatId, '⚔️ نبردی نیست!', mainMenu()); 
    const result = playerAttack(p, enemy); 
    if (result.battleOver) { 
        delete activeBattles[chatId]; 
        await bot.sendMessage(chatId, result.message, { parse_mode: 'Markdown', ...mainMenu() }); 
    } else { 
        await sendWithImage(chatId, `${formatBattle(p, enemy)}\n\n${result.message}`, enemy.file_id, getBattleKeyboard(enemy)); 
    } 
});

bot.onText(/🏃 💨 فرار کن/, async (msg) => { 
    const chatId = msg.chat.id; const p = player.getPlayer(chatId); const enemy = activeBattles[chatId]; 
    if (!p || !enemy) return bot.sendMessage(chatId, '⚔️ نبردی نیست!', mainMenu()); 
    const result = playerEscape(p, enemy); 
    if (result.battleOver) { 
        delete activeBattles[chatId]; 
        await bot.sendMessage(chatId, result.message, { parse_mode: 'Markdown', ...mainMenu() }); 
    } else { 
        await sendWithImage(chatId, `${formatBattle(p, enemy)}\n\n${result.message}`, enemy.file_id, getBattleKeyboard(enemy)); 
    } 
});

// 🔨 ساخت‌وساز
bot.onText(/^🔨 ساخت‌وساز$/, async (msg) => { 
    const chatId = msg.chat.id; const p = player.getPlayer(chatId); 
    if (!p) return bot.sendMessage(chatId, '❌ /start بزن!', mainMenu()); 
    await bot.sendMessage(chatId, showCraftMenu(), { parse_mode: 'Markdown', ...craftKeyboard() }); 
});

bot.onText(/🔨 ساخت (.+)/, (msg, match) => { 
    const chatId = msg.chat.id; const p = player.getPlayer(chatId); 
    if (!p) return; 
    const result = craftItem(p, match[1]); 
    bot.sendMessage(chatId, result.message, { parse_mode: 'Markdown', ...craftKeyboard() }); 
});

// 🏪 بازار
bot.onText(/^🏪 بازار$/, async (msg) => { 
    const chatId = msg.chat.id; const p = player.getPlayer(chatId); 
    if (!p) return bot.sendMessage(chatId, '❌ /start بزن!', mainMenu()); 
    if (p.location !== 'village') return bot.sendMessage(chatId, '🏪 فقط تو روستا!', mainMenu()); 
    await bot.sendMessage(chatId, `${showShopMenu()}\n\n👑 ${p.inventory.gold}`, { parse_mode: 'Markdown', ...shopKeyboard() }); 
});

bot.onText(/^(.+) خرید (.+)$/, (msg, match) => { 
    const chatId = msg.chat.id; const p = player.getPlayer(chatId); 
    if (!p) return; 
    const m = { 'چوب': 'wood', 'سنگ': 'stone', 'گوشت': 'meat', 'آب': 'water', 'پوست': 'skin', 'آهن': 'iron' }; 
    bot.sendMessage(chatId, buyItem(p, m[match[2]]).message, shopKeyboard()); 
});

bot.onText(/^📤 فروش$/, (msg) => { 
    bot.sendMessage(msg.chat.id, '📤 چی بفروشم؟', sellKeyboard()); 
});

bot.onText(/^(.+) فروش (.+)$/, (msg, match) => { 
    const chatId = msg.chat.id; const p = player.getPlayer(chatId); 
    if (!p) return; 
    const m = { 'چوب': 'wood', 'سنگ': 'stone', 'گوشت': 'meat', 'آب': 'water', 'پوست': 'skin', 'آهن': 'iron' }; 
    bot.sendMessage(chatId, sellItem(p, m[match[2]]).message, sellKeyboard()); 
});

// 🎒 اینونتوری
bot.onText(/^🎒 اینونتوری$/, async (msg) => { 
    const chatId = msg.chat.id; const p = player.getPlayer(chatId); 
    if (!p) return bot.sendMessage(chatId, '❌ /start بزن!', mainMenu()); 
    await bot.sendMessage(chatId, player.formatStatus(p), { parse_mode: 'Markdown', ...mainMenu() }); 
});

// 💬 NPCها
bot.onText(/^💬 NPCها$/, async (msg) => { 
    await bot.sendMessage(msg.chat.id, '🎭 *با کی حرف بزنی؟*', { parse_mode: 'Markdown', ...npcMenu() }); 
});

// انتخاب NPC
bot.onText(/^(🧙‍♀️|👻|🧚|👼|⚔️|🎭|🤴|💀|🐺|🧙‍♂️) (.+)$/, async (msg, match) => {
    const chatId = msg.chat.id; const p = player.getPlayer(chatId); if (!p) return;
    const map = { '🧙‍♀️': 'witch', '👻': 'ghost', '🧚': 'fairy', '👼': 'angel', '⚔️': 'knight', '🎭': 'jester', '🤴': 'prince', '💀': 'skeleton', '🐺': 'werewolf', '🧙‍♂️': 'wizard' };
    const npcId = map[match[1]]; if (!npcId) return;
    if (!p.npcEncounters) p.npcEncounters = {};
    p.npcEncounters[npcId] = (p.npcEncounters[npcId] || 0) + 1;
    const dialogue = getDialogue(npcId, p.npcEncounters[npcId] - 1);
    if (!dialogue) return bot.sendMessage(chatId, '🤐 حرفی نداره...', mainMenu());
    activeDialogues[chatId] = { npcId, encounter: p.npcEncounters[npcId] - 1 };
    const npc = getNpcConfig(npcId);
    let img = null;
    if (npc?.image && config.images) {
        img = config.images.npcs?.[npc.image]?.file_id || config.images.enemies?.[npc.image]?.file_id;
    }
    const keyboard = { reply_markup: { keyboard: dialogue.options.map(o => [o.text]), resize_keyboard: true } };
    await sendWithImage(chatId, dialogue.text, img, keyboard);
});

// پاسخ دیالوگ
bot.onText(/^(🗡️|💋|🏃|🤝|🕯️|👂|💰|🕊️|💎|⚔️|❤️|👼|🎁|😘|🧪|😂|😐|🍖) (.+)$/, async (msg, match) => {
    const chatId = msg.chat.id; const p = player.getPlayer(chatId);
    const dialogue = activeDialogues[chatId]; if (!p || !dialogue) return;
    const currentDialogue = getDialogue(dialogue.npcId, dialogue.encounter); if (!currentDialogue) return;
    const selectedOption = currentDialogue.options.find(o => o.text.startsWith(match[1])); if (!selectedOption) return;
    const result = handleAction(p, dialogue.npcId, selectedOption.action);
    
    delete activeDialogues[chatId];
    
    if (result.battleStart) {
        const fightResult = startFight(p);
        if (fightResult.success) {
            activeBattles[chatId] = fightResult.enemy;
            await sendWithImage(chatId, `${result.message}\n\n${fightResult.message}`, fightResult.enemy?.file_id, getBattleKeyboard(fightResult.enemy));
        } else {
            await bot.sendMessage(chatId, fightResult.message, mainMenu());
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

console.log('✅ ربات بقای باستانی آماده شد! 🎉');