const TelegramBot = require('node-telegram-bot-api');
const token = process.env.BOT_TOKEN;
const bot = new TelegramBot(token, { polling: true });

const player = require('./player');
const { gather } = require('./gather');
const { travel } = require('./travel');
const { showCraftMenu, craftItem } = require('./craft');
const { activeBattles, startFight, playerAttack, playerEscape, formatBattle, getBattleKeyboard } = require('./fight');
const { showShopMenu, buyItem, sellItem } = require('./shop');
const { getDialogue, getPrisonDialogue, getNpcConfig, handleAction } = require('./dialogue');
const { isAdmin, adminCommand } = require('./admin');
const { initPrison, captureNpc, getRelationPoints, getRelationLevel, touchPrisoner, kissPrisoner, releasePrisoner, checkEscapes, formatPrison, getPrisonerKeyboard } = require('./prison');
const config = require('./config');

const activeDialogues = {};
const activePrisoner = {};

function mainMenu() {
    return { reply_markup: { keyboard: [
        ['👤 وضعیت', '🌿 جمع‌آوری'],
        ['🗺️ سفر', '⚔️ نبرد'],
        ['👥 PvP', '🔨 ساخت‌وساز'],
        ['🏪 بازار', '📊 رتبه‌بندی'],
        ['🏰 زندان']
    ], resize_keyboard: true } };
}

function locationMenu(player) {
    const b = [];
    const unlocked = player?.unlocked?.locations || ['village'];
    const locReqs = config.locationRequirements || {};
    
    for (let k in config.images.locations) {
        if (unlocked.includes(k)) {
            b.push([`✅ ${config.images.locations[k].emoji} ${config.images.locations[k].name}`]);
        } else {
            const needed = (locReqs[k] || 9999) - (player.score || 0);
            b.push([`🔒 نیاز به ${needed} امتیاز`]);
        }
    }
    b.push(['🔙 برگشت']);
    return { reply_markup: { keyboard: b, resize_keyboard: true } };
}

async function sendWithImage(chatId, caption, fileId, keyboard) {
    if (fileId) {
        try {
            await bot.sendPhoto(chatId, fileId, { caption, parse_mode: 'Markdown', ...keyboard });
            return;
        } catch (e) {}
    }
    await bot.sendMessage(chatId, caption, { parse_mode: 'Markdown', ...keyboard });
}

// ==================== /start ====================
bot.onText(/\/start/, async (msg) => {
    const chatId = msg.chat.id;
    if (!player.getPlayer(chatId)) player.createPlayer(chatId);
    const p = player.getPlayer(chatId);
    player.checkUnlocks(p);
    
    const loc = config.images.locations[p.location];
    let welcome = `🏛️ *بقای باستانی*\n\n`;
    welcome += `✨ ${p.name} به دنیای باستان خوش آمدی!\n`;
    welcome += `📍 ${loc.emoji} ${loc.name}\n`;
    welcome += `🏆 امتیاز: ${p.score}\n\n`;
    welcome += `🐺 *مرحله اول: روستا*\n`;
    welcome += `🎯 گرگ‌ها، مارها و دزدها رو شکار کن!\n`;
    welcome += `💡 جمع‌آوری کن، امتیاز بگیر و مراحل جدید رو باز کن!`;
    
    if (p.unlockedMessage) {
        welcome += `\n\n${p.unlockedMessage}`;
        p.unlockedMessage = null;
    }
    
    await sendWithImage(chatId, welcome, loc.file_id, mainMenu());
});

// ==================== ادمین ====================
bot.onText(/\/admin (.+)/, (msg, match) => {
    const chatId = msg.chat.id;
    if (!isAdmin(chatId)) return;
    const p = player.getPlayer(chatId);
    if (!p) return;
    const args = match[1].split(' ');
    const result = adminCommand(p, args.shift(), args);
    bot.sendMessage(chatId, result.message, { parse_mode: 'Markdown', ...mainMenu() });
});

// ==================== وضعیت ====================
bot.onText(/^👤 وضعیت$/, async (msg) => {
    const chatId = msg.chat.id;
    const p = player.getPlayer(chatId);
    if (!p) return bot.sendMessage(chatId, '❌ /start بزن!', mainMenu());
    await bot.sendMessage(chatId, player.formatStatus(p), { parse_mode: 'Markdown', ...mainMenu() });
});

// ==================== رتبه‌بندی ====================
bot.onText(/^📊 رتبه‌بندی$/, async (msg) => {
    const chatId = msg.chat.id;
    await bot.sendMessage(chatId, player.formatLeaderboard(), { parse_mode: 'Markdown', ...mainMenu() });
});

// ==================== جمع‌آوری ====================
bot.onText(/^🌿 جمع‌آوری$/, async (msg) => {
    const chatId = msg.chat.id;
    const p = player.getPlayer(chatId);
    if (!p) return bot.sendMessage(chatId, '❌ /start بزن!', mainMenu());
    
    const result = gather(p);
    player.addScore(p, 5);
    player.checkUnlocks(p);
    
    let extraMsg = '';
    if (p.unlockedMessage) {
        extraMsg = '\n\n' + p.unlockedMessage;
        p.unlockedMessage = null;
    }
    
    if (result.npcEncounter) {
        const npcId = result.npcEncounter;
        if (!p.npcEncounters) p.npcEncounters = {};
        p.npcEncounters[npcId] = (p.npcEncounters[npcId] || 0) + 1;
        const dialogue = getDialogue(npcId, p.npcEncounters[npcId] - 1);
        
        await bot.sendMessage(chatId, result.message + extraMsg, { parse_mode: 'Markdown' });
        
        if (dialogue) {
            activeDialogues[chatId] = { npcId, encounter: p.npcEncounters[npcId] - 1 };
            const npc = getNpcConfig(npcId);
            let img = npc?.image ? (config.images.npcs?.[npc.image]?.file_id || config.images.enemies?.[npc.image]?.file_id) : null;
            const keyboard = { reply_markup: { keyboard: dialogue.options.map(o => [o.text]), resize_keyboard: true } };
            await sendWithImage(chatId, dialogue.text, img, keyboard);
            return;
        }
        return bot.sendMessage(chatId, '🤐 حرفی نداره...', mainMenu());
    }
    
    await bot.sendMessage(chatId, result.message + extraMsg, { parse_mode: 'Markdown', ...mainMenu() });
});

// ==================== سفر ====================
bot.onText(/^🗺️ سفر$/, async (msg) => {
    const chatId = msg.chat.id;
    const p = player.getPlayer(chatId);
    if (!p) return bot.sendMessage(chatId, '❌ /start بزن!', mainMenu());
    
    let mapMsg = '🗺️ *نقشه سفر*\n\n';
    const locReqs = config.locationRequirements || {};
    
    for (let k in config.images.locations) {
        const loc = config.images.locations[k];
        if (p.unlocked?.locations?.includes(k)) {
            mapMsg += `✅ ${loc.emoji} *${loc.name}*\n   ${loc.description}\n\n`;
        } else {
            const needed = (locReqs[k] || 9999) - (p.score || 0);
            mapMsg += `🔒 ${loc.emoji} *???*\n   نیاز به *${needed}* امتیاز دیگر\n\n`;
        }
    }
    
    mapMsg += '📍 روی نقشه کلیک کن:';
    await bot.sendMessage(chatId, mapMsg, { parse_mode: 'Markdown', ...locationMenu(p) });
});

bot.onText(/^✅ (.+) (.+)$/, async (msg, match) => {
    const chatId = msg.chat.id;
    const p = player.getPlayer(chatId);
    if (!p) return;
    
    const emoji = match[1];
    const name = match[2];
    
    for (let k in config.images.locations) {
        const loc = config.images.locations[k];
        if (loc.emoji === emoji && loc.name === name) {
            if (!p.unlocked?.locations?.includes(k)) {
                const needed = (config.locationRequirements[k] || 9999) - p.score;
                return bot.sendMessage(chatId, `🔒 *${loc.name}* هنوز قفله!\n📊 نیاز به *${needed}* امتیاز دیگر.`, mainMenu());
            }
            
            const result = travel(p, k);
            player.addScore(p, 10);
            player.checkUnlocks(p);
            
            await bot.sendMessage(chatId, result.message, { parse_mode: 'Markdown' });
            
            if (result.npcEncounter) {
                const npcId = result.npcEncounter;
                if (!p.npcEncounters) p.npcEncounters = {};
                p.npcEncounters[npcId] = (p.npcEncounters[npcId] || 0) + 1;
                const dialogue = getDialogue(npcId, p.npcEncounters[npcId] - 1);
                if (dialogue) {
                    activeDialogues[chatId] = { npcId, encounter: p.npcEncounters[npcId] - 1 };
                    const npc = getNpcConfig(npcId);
                    let img = npc?.image ? (config.images.npcs?.[npc.image]?.file_id || config.images.enemies?.[npc.image]?.file_id) : null;
                    const keyboard = { reply_markup: { keyboard: dialogue.options.map(o => [o.text]), resize_keyboard: true } };
                    await sendWithImage(chatId, dialogue.text, img, keyboard);
                    return;
                }
            }
            
            let extra = '';
            if (p.unlockedMessage) { extra = '\n\n' + p.unlockedMessage; p.unlockedMessage = null; }
            return bot.sendMessage(chatId, '🏛️ انجام شد!' + extra, { parse_mode: 'Markdown', ...mainMenu() });
        }
    }
});

// ==================== نبرد PvE ====================
bot.onText(/^⚔️ نبرد$/, async (msg) => {
    const chatId = msg.chat.id;
    const p = player.getPlayer(chatId);
    if (!p) return bot.sendMessage(chatId, '❌ /start بزن!', mainMenu());
    
    const result = startFight(p);
    if (!result.success) return bot.sendMessage(chatId, result.message, mainMenu());
    
    activeBattles[chatId] = result.enemy;
    await sendWithImage(chatId, result.message, result.enemy?.file_id, getBattleKeyboard(result.enemy));
});

bot.onText(/⚔️ 🗡️ حمله کن/, async (msg) => {
    const chatId = msg.chat.id;
    const p = player.getPlayer(chatId);
    const enemy = activeBattles[chatId];
    if (!p || !enemy) return bot.sendMessage(chatId, '⚔️ نبردی نیست!', mainMenu());
    
    // PvP
    if (enemy.isPlayer) {
        const result = playerAttack(p, enemy);
        const opponent = player.getPlayer(enemy.opponentId);
        if (opponent) opponent.hp = enemy.hp;
        
        if (result.battleOver) {
            delete activeBattles[chatId];
            if (enemy.opponentId) delete activeBattles[enemy.opponentId];
            if (result.playerWon) {
                player.addScore(p, 50);
                await bot.sendMessage(enemy.opponentId, `💀 تو باختی! ${p.name} برنده شد!`, mainMenu());
            }
            await bot.sendMessage(chatId, result.message, { parse_mode: 'Markdown', ...mainMenu() });
        } else {
            await bot.sendMessage(chatId, `${formatBattle(p, enemy)}\n\n${result.message}`, getBattleKeyboard(enemy));
            if (enemy.opponentId) {
                const opp = player.getPlayer(enemy.opponentId);
                if (opp) {
                    await bot.sendMessage(enemy.opponentId, `⏳ منتظر حمله ${p.name}...`, getBattleKeyboard({ status: 'fighting' }));
                }
            }
        }
        return;
    }
    
    // PvE
    const result = playerAttack(p, enemy);
    
    if (result.battleOver) {
        delete activeBattles[chatId];
        if (result.playerWon) {
            player.addScore(p, 20);
            player.checkUnlocks(p);
        }
        let extra = '';
        if (p.unlockedMessage) { extra = '\n\n' + p.unlockedMessage; p.unlockedMessage = null; }
        await bot.sendMessage(chatId, result.message + extra, { parse_mode: 'Markdown', ...mainMenu() });
        
        if (result.canCapture && result.npcId) {
            const captureResult = captureNpc(p, result.npcId);
            await bot.sendMessage(chatId, captureResult.message, { parse_mode: 'Markdown' });
        }
    } else {
        await sendWithImage(chatId, `${formatBattle(p, enemy)}\n\n${result.message}`, enemy.file_id, getBattleKeyboard(enemy));
    }
});

bot.onText(/🏃 💨 فرار کن/, async (msg) => {
    const chatId = msg.chat.id;
    const p = player.getPlayer(chatId);
    const enemy = activeBattles[chatId];
    if (!p || !enemy) return bot.sendMessage(chatId, '⚔️ نبردی نیست!', mainMenu());
    
    const result = playerEscape(p, enemy);
    if (result.battleOver) {
        if (enemy.isPlayer && enemy.opponentId) {
            delete activeBattles[enemy.opponentId];
            await bot.sendMessage(enemy.opponentId, `🏃 ${p.name} فرار کرد! تو برنده شدی!`, mainMenu());
        }
        delete activeBattles[chatId];
        await bot.sendMessage(chatId, result.message, { parse_mode: 'Markdown', ...mainMenu() });
    } else {
        await sendWithImage(chatId, `${formatBattle(p, enemy)}\n\n${result.message}`, enemy.file_id, getBattleKeyboard(enemy));
    }
});

// ==================== PvP ====================
bot.onText(/^👥 PvP$/, async (msg) => {
    const chatId = msg.chat.id;
    const p = player.getPlayer(chatId);
    if (!p) return bot.sendMessage(chatId, '❌ /start بزن!', mainMenu());
    
    const result = player.joinPvP(p);
    
    if (result.matched) {
        const opponent = result.opponent;
        activeBattles[chatId] = {
            name: opponent.name, emoji: '👤', hp: opponent.hp, maxHp: opponent.maxHp,
            attack: opponent.attack, isPlayer: true, opponentId: opponent.chatId
        };
        activeBattles[opponent.chatId] = {
            name: p.name, emoji: '👤', hp: p.hp, maxHp: p.maxHp,
            attack: p.attack, isPlayer: true, opponentId: chatId
        };
        
        await bot.sendMessage(chatId, `⚔️ *نبرد PvP!*\n\n👤 حریف: ${opponent.name}\n❤️ ${opponent.hp}/${opponent.maxHp}\n⚔️ ${opponent.attack}\n\n🥊 تو اول حمله کن!`, { parse_mode: 'Markdown', ...getBattleKeyboard({ status: 'fighting' }) });
        await bot.sendMessage(opponent.chatId, `⚔️ *نبرد PvP!*\n\n👤 حریف: ${p.name}\n❤️ ${p.hp}/${p.maxHp}\n⚔️ ${p.attack}\n\n⏳ منتظر حمله حریف...`, { parse_mode: 'Markdown', ...getBattleKeyboard({ status: 'fighting' }) });
    } else {
        await bot.sendMessage(chatId, '⏳ *منتظر حریف...*\n\nیه نفر دیگه هم باید PvP بزنه!\n📋 برای لغو: /cancel_pvp', { parse_mode: 'Markdown', ...mainMenu() });
    }
});

bot.onText(/\/cancel_pvp/, (msg) => {
    const chatId = msg.chat.id;
    const p = player.getPlayer(chatId);
    player.leavePvP(p);
    bot.sendMessage(chatId, '❌ PvP لغو شد.', mainMenu());
});

// ==================== ساخت‌وساز ====================
bot.onText(/^🔨 ساخت‌وساز$/, async (msg) => {
    const chatId = msg.chat.id;
    const p = player.getPlayer(chatId);
    if (!p) return bot.sendMessage(chatId, '❌ /start بزن!', mainMenu());
    
    const unlocked = p.unlocked?.recipes || [];
    const allRecipes = Object.keys(config.recipes);
    
    const buttons = [];
    for (let r of allRecipes) {
        if (unlocked.includes(r)) buttons.push([`🔨 ساخت ${r}`]);
        else buttons.push([`🔒 ??? (قفل)`]);
    }
    buttons.push(['🔙 برگشت']);
    
    await bot.sendMessage(chatId, showCraftMenu(), { parse_mode: 'Markdown', reply_markup: { keyboard: buttons, resize_keyboard: true } });
});

bot.onText(/🔨 ساخت (.+)/, (msg, match) => {
    const chatId = msg.chat.id;
    const p = player.getPlayer(chatId);
    if (!p) return;
    if (!p.unlocked?.recipes?.includes(match[1])) return bot.sendMessage(chatId, '🔒 این دستور پخت هنوز قفله!', mainMenu());
    const result = craftItem(p, match[1]);
    if (result.success) player.addScore(p, 30);
    bot.sendMessage(chatId, result.message, { parse_mode: 'Markdown', ...mainMenu() });
});

// ==================== بازار ====================
bot.onText(/^🏪 بازار$/, async (msg) => {
    const chatId = msg.chat.id;
    const p = player.getPlayer(chatId);
    if (!p) return bot.sendMessage(chatId, '❌ /start بزن!', mainMenu());
    if (p.location !== 'village') return bot.sendMessage(chatId, '🏪 بازار فقط توی روستای باستانیه!', mainMenu());
    
    await bot.sendMessage(chatId, `${showShopMenu()}\n\n👑 طلا: ${p.inventory.gold}`, {
        parse_mode: 'Markdown',
        reply_markup: { keyboard: [
            ['🪵 خرید چوب (۲👑)', '🪨 خرید سنگ (۳👑)'],
            ['🍖 خرید گوشت (۳👑)', '💧 خرید آب (۱👑)'],
            ['🦴 خرید پوست (۵👑)', '⛏️ خرید آهن (۸👑)'],
            ['📤 فروش', '🔙 برگشت']
        ], resize_keyboard: true }
    });
});

bot.onText(/^(.+) خرید (.+) \((\d+)👑\)$/, (msg, match) => {
    const chatId = msg.chat.id;
    const p = player.getPlayer(chatId);
    if (!p) return;
    const m = { 'چوب': 'wood', 'سنگ': 'stone', 'گوشت': 'meat', 'آب': 'water', 'پوست': 'skin', 'آهن': 'iron' };
    bot.sendMessage(chatId, buyItem(p, m[match[2]]).message, mainMenu());
});

bot.onText(/^📤 فروش$/, (msg) => {
    bot.sendMessage(msg.chat.id, '📤 چی می‌خوای بفروشی؟', {
        reply_markup: { keyboard: [
            ['🪵 فروش چوب (۱👑)', '🪨 فروش سنگ (۱👑)'],
            ['🍖 فروش گوشت (۲👑)', '💧 فروش آب (۱👑)'],
            ['🦴 فروش پوست (۳👑)', '⛏️ فروش آهن (۴👑)'],
            ['🔙 بازار']
        ], resize_keyboard: true }
    });
});

bot.onText(/^(.+) فروش (.+) \((\d+)👑\)$/, (msg, match) => {
    const chatId = msg.chat.id;
    const p = player.getPlayer(chatId);
    if (!p) return;
    const m = { 'چوب': 'wood', 'سنگ': 'stone', 'گوشت': 'meat', 'آب': 'water', 'پوست': 'skin', 'آهن': 'iron' };
    bot.sendMessage(chatId, sellItem(p, m[match[2]]).message, mainMenu());
});

// ==================== زندان ====================
bot.onText(/^🏰 زندان$/, async (msg) => {
    const chatId = msg.chat.id;
    const p = player.getPlayer(chatId);
    if (!p) return bot.sendMessage(chatId, '❌ /start بزن!', mainMenu());
    
    initPrison(p);
    const escaped = checkEscapes(p);
    for (let e of escaped) await bot.sendMessage(chatId, `🏃 ${e.emoji} *${e.name}* از زندان فرار کرد!`, { parse_mode: 'Markdown' });
    
    const prisonMsg = formatPrison(p);
    
    if (p.prison && p.prison.length > 0) {
        const buttons = [];
        for (let pr of p.prison) buttons.push([`🔒 ${pr.emoji} ${pr.name}`]);
        buttons.push(['🔙 برگشت']);
        await bot.sendMessage(chatId, prisonMsg + '\n\n👆 یه زندانی رو انتخاب کن:', { parse_mode: 'Markdown', reply_markup: { keyboard: buttons, resize_keyboard: true } });
    } else {
        await bot.sendMessage(chatId, prisonMsg, { parse_mode: 'Markdown', ...mainMenu() });
    }
});

bot.onText(/^🔒 (.+) (.+)$/, async (msg, match) => {
    const chatId = msg.chat.id;
    const p = player.getPlayer(chatId);
    if (!p || !p.prison) return;
    
    const prisoner = p.prison.find(pr => pr.emoji === match[1] && pr.name === match[2]);
    if (!prisoner) return;
    
    const points = getRelationPoints(p, prisoner.npcId);
    const relation = getRelationLevel(points);
    const dialogue = getPrisonDialogue(prisoner.npcId, relation.level);
    
    activePrisoner[chatId] = prisoner.npcId;
    
    let img = null;
    const npc = getNpcConfig(prisoner.npcId);
    if (npc?.image) img = config.images.npcs?.[npc.image]?.file_id || config.images.enemies?.[npc.image]?.file_id;
    
    await sendWithImage(chatId, `${prisoner.emoji} *${prisoner.name}* | ${relation.name}\n\n${dialogue.text}`, img, getPrisonerKeyboard());
});

bot.onText(/^🖐️ لمس کن$/, async (msg) => {
    const chatId = msg.chat.id;
    const p = player.getPlayer(chatId);
    const npcId = activePrisoner[chatId];
    if (!p || !npcId) return;
    
    const result = touchPrisoner(p, npcId);
    const dialogue = getPrisonDialogue(npcId, getRelationLevel(getRelationPoints(p, npcId)).level);
    await bot.sendMessage(chatId, result.message + '\n\n' + dialogue.text, { parse_mode: 'Markdown', ...getPrisonerKeyboard() });
});

bot.onText(/^💋 ببوس$/, async (msg) => {
    const chatId = msg.chat.id;
    const p = player.getPlayer(chatId);
    const npcId = activePrisoner[chatId];
    if (!p || !npcId) return;
    
    const result = kissPrisoner(p, npcId);
    const dialogue = getPrisonDialogue(npcId, getRelationLevel(getRelationPoints(p, npcId)).level);
    await bot.sendMessage(chatId, result.message + '\n\n' + dialogue.text, { parse_mode: 'Markdown', ...getPrisonerKeyboard() });
});

bot.onText(/^🔓 آزاد کن$/, async (msg) => {
    const chatId = msg.chat.id;
    const p = player.getPlayer(chatId);
    const npcId = activePrisoner[chatId];
    if (!p || !npcId) return;
    
    const result = releasePrisoner(p, npcId);
    delete activePrisoner[chatId];
    if (result.loyal) player.addScore(p, 50);
    await bot.sendMessage(chatId, result.message, { parse_mode: 'Markdown', ...mainMenu() });
});

// ==================== پاسخ دیالوگ محیط ====================
bot.onText(/^(🗡️|💋|🏃|🤝|🕯️|👂|💰|🕊️|💎|⚔️|❤️|👼|🎁|😘|🧪|😂|😐|🍖) (.+)$/, async (msg, match) => {
    const chatId = msg.chat.id;
    const p = player.getPlayer(chatId);
    const dialogue = activeDialogues[chatId];
    if (!p || !dialogue) return;
    
    const currentDialogue = getDialogue(dialogue.npcId, dialogue.encounter);
    if (!currentDialogue) return;
    
    const selectedOption = currentDialogue.options.find(o => o.text.startsWith(match[1]));
    if (!selectedOption) return;
    
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

// ==================== برگشت ====================
bot.onText(/^🔙 برگشت$/, (msg) => {
    const chatId = msg.chat.id;
    delete activeBattles[chatId];
    delete activeDialogues[chatId];
    delete activePrisoner[chatId];
    bot.sendMessage(chatId, '🏛️ *منوی اصلی*', { parse_mode: 'Markdown', ...mainMenu() });
});

bot.onText(/^🔙 بازار$/, (msg) => {
    const chatId = msg.chat.id;
    const p = player.getPlayer(chatId);
    bot.sendMessage(chatId, `🏪 *بازار* | 👑 ${p?.inventory?.gold || 0}`, { parse_mode: 'Markdown', ...mainMenu() });
});

// ==================== خطا ====================
bot.on('polling_error', (error) => {
    console.log('Polling error:', error.message);
});

console.log('✅ ربات بقای باستانی آماده شد! 🎉');