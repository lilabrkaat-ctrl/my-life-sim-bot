const TelegramBot = require('node-telegram-bot-api');
const token = process.env.BOT_TOKEN;
const bot = new TelegramBot(token, { polling: true });

const { savePlayers, autoSave } = require('./storage');
autoSave(player.players, 30000);
const { gather } = require('./gather');
const { travel } = require('./travel');
const { showCraftMenu, craftItem } = require('./craft');
const { activeBattles, startFight, startPvPFight, playerAttack, playerEscape, formatBattle, getBattleKeyboard, animations } = require('./fight');
const { showShopMenu, startBuy, startSell, processAmount, cancelShop, getShopState } = require('./shop');
const { getDialogue, getPrisonDialogue, getNpcConfig, handleAction } = require('./dialogue');
const { isAdmin, adminCommand } = require('./admin');
const { initPrison, captureNpc, getRelationPoints, getRelationLevel, touchPrisoner, kissPrisoner, releasePrisoner, checkEscapes, formatPrison, getPrisonerKeyboard } = require('./prison');
const config = require('./config');

const activeDialogues = {};
const activePrisoner = {};
const pvpSearching = {};

function mainMenu() {
    return { reply_markup: { keyboard: [
        ['👤 وضعیت', '🌿 جمع‌آوری'],
        ['🗺️ سفر', '⚔️ نبرد'],
        ['🔨 ساخت‌وساز', '🏪 بازار'],
        ['📊 رتبه‌بندی', '🏰 زندان']
    ], resize_keyboard: true } };
}

function locationMenu(player) {
    const b = [];
    const unlocked = player?.unlocked?.locations || ['village'];
    const locReqs = config.locationRequirements || {};
    for (let k in config.images.locations) {
        if (unlocked.includes(k)) b.push([`✅ ${config.images.locations[k].emoji} ${config.images.locations[k].name}`]);
        else b.push([`🔒 نیاز به ${(locReqs[k]||9999)-(player.score||0)} امتیاز`]);
    }
    b.push(['🔙 برگشت']);
    return { reply_markup: { keyboard: b, resize_keyboard: true } };
}

async function sendAnimation(chatId, fileId, caption, keyboard) {
    if (fileId) {
        try { await bot.sendAnimation(chatId, fileId, { caption, parse_mode: 'Markdown', ...keyboard }); return; } catch (e) {}
    }
    await bot.sendMessage(chatId, caption, { parse_mode: 'Markdown', ...keyboard });
}

async function sendPhoto(chatId, fileId, caption, keyboard) {
    if (fileId) {
        try { await bot.sendPhoto(chatId, fileId, { caption, parse_mode: 'Markdown', ...keyboard }); return; } catch (e) {}
    }
    await bot.sendMessage(chatId, caption, { parse_mode: 'Markdown', ...keyboard });
}

// ==================== /start ====================
bot.onText(/\/start/, async (msg) => {
    const chatId = msg.chat.id;
    if (!player.getPlayer(chatId)) player.createPlayer(chatId);
    const p = player.getPlayer(chatId);
    player.checkUnlocks(p);
    p.chatId = chatId;
    
    const loc = config.images.locations[p.location];
    let welcome = `🏛️ *بقای باستانی*\n\n✨ ${p.name} | 📍 ${loc.emoji} ${loc.name}\n🏆 امتیاز: ${p.score}\n\n🐺 *مرحله اول: روستا*\n🎯 گرگ‌ها، مارها و دزدها رو شکار کن!`;
    if (p.unlockedMessage) { welcome += `\n\n${p.unlockedMessage}`; p.unlockedMessage = null; }
    
    await sendPhoto(chatId, loc.file_id, welcome, mainMenu());
});

// ==================== ادمین ====================
bot.onText(/\/admin (.+)/, (msg, match) => {
    const chatId = msg.chat.id;
    if (!isAdmin(chatId)) return;
    const p = player.getPlayer(chatId); if (!p) return;
    p.chatId = chatId;
    const args = match[1].split(' '); const cmd = args.shift();
    bot.sendMessage(chatId, adminCommand(p, cmd, args).message, { parse_mode: 'Markdown', ...mainMenu() });
});

// ==================== وضعیت ====================
bot.onText(/^👤 وضعیت$/, async (msg) => {
    const chatId = msg.chat.id; const p = player.getPlayer(chatId);
    if (!p) return bot.sendMessage(chatId, '❌ /start بزن!', mainMenu());
    await bot.sendMessage(chatId, player.formatStatus(p), { parse_mode: 'Markdown', ...mainMenu() });
});

// ==================== رتبه‌بندی ====================
bot.onText(/^📊 رتبه‌بندی$/, async (msg) => {
    await bot.sendMessage(msg.chat.id, player.formatLeaderboard(), { parse_mode: 'Markdown', ...mainMenu() });
});

// ==================== جمع‌آوری ====================
bot.onText(/^🌿 جمع‌آوری$/, async (msg) => {
    const chatId = msg.chat.id; const p = player.getPlayer(chatId);
    if (!p) return bot.sendMessage(chatId, '❌ /start بزن!', mainMenu());
    p.chatId = chatId;
    
    const result = gather(p);
    player.addScore(p, 5); player.checkUnlocks(p);
    let extra = p.unlockedMessage ? '\n\n' + p.unlockedMessage : '';
    if (p.unlockedMessage) p.unlockedMessage = null;
    
    if (result.npcEncounter) {
        const npcId = result.npcEncounter;
        if (!p.npcEncounters) p.npcEncounters = {};
        p.npcEncounters[npcId] = (p.npcEncounters[npcId] || 0) + 1;
        const dialogue = getDialogue(npcId, p.npcEncounters[npcId] - 1);
        await bot.sendMessage(chatId, result.message + extra, { parse_mode: 'Markdown' });
        
        if (dialogue) {
            activeDialogues[chatId] = { npcId, encounter: p.npcEncounters[npcId] - 1 };
            const npc = getNpcConfig(npcId);
            let img = npc?.image ? (config.images.npcs?.[npc.image]?.file_id || config.images.enemies?.[npc.image]?.file_id) : null;
            await sendPhoto(chatId, img, dialogue.text, { reply_markup: { keyboard: dialogue.options.map(o => [o.text]), resize_keyboard: true } });
            return;
        }
        return bot.sendMessage(chatId, '🤐 حرفی نداره...', mainMenu());
    }
    
    await bot.sendMessage(chatId, result.message + extra, { parse_mode: 'Markdown', ...mainMenu() });
});

// ==================== سفر ====================
bot.onText(/^🗺️ سفر$/, async (msg) => {
    const chatId = msg.chat.id; const p = player.getPlayer(chatId);
    if (!p) return bot.sendMessage(chatId, '❌ /start بزن!', mainMenu());
    
    let mapMsg = '🗺️ *نقشه سفر*\n\n';
    const locReqs = config.locationRequirements || {};
    for (let k in config.images.locations) {
        const loc = config.images.locations[k];
        if (p.unlocked?.locations?.includes(k)) mapMsg += `✅ ${loc.emoji} *${loc.name}*\n   ${loc.description}\n\n`;
        else mapMsg += `🔒 ${loc.emoji} *???*\n   نیاز به *${(locReqs[k]||9999)-p.score}* امتیاز\n\n`;
    }
    mapMsg += '📍 روی نقشه کلیک کن:';
    await bot.sendMessage(chatId, mapMsg, { parse_mode: 'Markdown', ...locationMenu(p) });
});

bot.onText(/^✅ (.+)$/, async (msg, match) => {
    const chatId = msg.chat.id; const p = player.getPlayer(chatId); if (!p) return;
    const parts = match[1].split(' '); const emoji = parts[0]; const name = parts.slice(1).join(' ');
    
    for (let k in config.images.locations) {
        const loc = config.images.locations[k];
        if (loc.emoji === emoji && loc.name === name) {
            if (!p.unlocked?.locations?.includes(k)) {
                const needed = (config.locationRequirements[k]||9999) - p.score;
                return bot.sendMessage(chatId, `🔒 *${loc.name}* قفله!\n📊 نیاز به *${needed}* امتیاز`, mainMenu());
            }
            
            const result = travel(p, k);
            player.addScore(p, 10); player.checkUnlocks(p);
            
            if (result.ambush) {
                const fightResult = startFight(p);
                if (fightResult.success) {
                    activeBattles[chatId] = fightResult.enemy;
                    return await sendAnimation(chatId, fightResult.animation, result.message + '\n' + fightResult.message, getBattleKeyboard(fightResult.enemy));
                }
            }
            
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
                    await sendPhoto(chatId, img, dialogue.text, { reply_markup: { keyboard: dialogue.options.map(o => [o.text]), resize_keyboard: true } });
                    return;
                }
            }
            
            let extra = p.unlockedMessage ? '\n\n' + p.unlockedMessage : '';
            if (p.unlockedMessage) p.unlockedMessage = null;
            return bot.sendMessage(chatId, '🏛️ سفر تموم شد!' + extra, { parse_mode: 'Markdown', ...mainMenu() });
        }
    }
});

// ==================== نبرد ====================
bot.onText(/^⚔️ نبرد$/, async (msg) => {
    const chatId = msg.chat.id; const p = player.getPlayer(chatId);
    if (!p) return bot.sendMessage(chatId, '❌ /start بزن!', mainMenu());
    
    pvpSearching[chatId] = setTimeout(async () => {
        delete pvpSearching[chatId];
        const result = startFight(p);
        if (!result.success) return bot.sendMessage(chatId, result.message, mainMenu());
        activeBattles[chatId] = result.enemy;
        if (result.animation) await sendAnimation(chatId, result.animation, result.message, getBattleKeyboard(result.enemy));
        else await sendPhoto(chatId, result.enemy?.file_id, result.message, getBattleKeyboard(result.enemy));
    }, 5000);
    
    await bot.sendMessage(chatId, '⏳ *۵ ثانیه دنبال حریف آنلاین...*\nاگه کسی نبود، با دشمن عادی می‌جنگی!', { parse_mode: 'Markdown', ...mainMenu() });
    
    for (let id in pvpSearching) {
        if (id != chatId) {
            clearTimeout(pvpSearching[id]); clearTimeout(pvpSearching[chatId]);
            delete pvpSearching[id]; delete pvpSearching[chatId];
            
            const opponent = player.getPlayer(parseInt(id));
            if (opponent) {
                const { enemy1, enemy2 } = startPvPFight(p, opponent);
                activeBattles[chatId] = enemy1; activeBattles[id] = enemy2;
                
                await bot.sendMessage(chatId, `⚔️ *PvP پیدا شد!*\n👤 ${opponent.name}\n❤️ ${opponent.hp}/${opponent.maxHp}\n🥊 تو اول بزن!`, { parse_mode: 'Markdown', ...getBattleKeyboard(enemy1) });
                await bot.sendMessage(id, `⚔️ *PvP پیدا شد!*\n👤 ${p.name}\n❤️ ${p.hp}/${p.maxHp}\n⏳ منتظر حمله...`, { parse_mode: 'Markdown', ...getBattleKeyboard(enemy2) });
                return;
            }
        }
    }
});

bot.onText(/⚔️ 🗡️ حمله کن/, async (msg) => {
    const chatId = msg.chat.id; const p = player.getPlayer(chatId); const enemy = activeBattles[chatId];
    if (!p || !enemy) return bot.sendMessage(chatId, '⚔️ نبردی نیست!', mainMenu());
    
    const result = playerAttack(p, enemy);
    
    if (result.battleOver) {
        delete activeBattles[chatId];
        if (enemy.isPlayer && enemy.opponentId) {
            delete activeBattles[enemy.opponentId];
            await bot.sendMessage(enemy.opponentId, `💀 باختی! ${p.name} برنده شد!`, mainMenu());
        }
        if (result.playerWon) { player.addScore(p, enemy.isPlayer ? 50 : 20); player.checkUnlocks(p); }
        let extra = p.unlockedMessage ? '\n\n' + p.unlockedMessage : '';
        if (p.unlockedMessage) p.unlockedMessage = null;
        
        if (result.animation) await sendAnimation(chatId, result.animation, result.message + extra, mainMenu());
        else await bot.sendMessage(chatId, result.message + extra, { parse_mode: 'Markdown', ...mainMenu() });
        
        if (result.canCapture) await bot.sendMessage(chatId, captureNpc(p, result.npcId).message, mainMenu());
        if (result.escaped) await bot.sendMessage(chatId, `👣 *${enemy.name}* فرار کرد! رد پاش مونده... دوباره تلاش کن!`, mainMenu());
    } else {
        if (result.animation) await sendAnimation(chatId, result.animation, `${formatBattle(p, enemy)}\n\n${result.message}`, getBattleKeyboard(enemy));
        else await sendPhoto(chatId, enemy.file_id, `${formatBattle(p, enemy)}\n\n${result.message}`, getBattleKeyboard(enemy));
        
        if (enemy.isPlayer && enemy.opponentId) {
            const opp = player.getPlayer(enemy.opponentId);
            if (opp) await bot.sendMessage(enemy.opponentId, `⏳ منتظر حمله ${p.name}...`, getBattleKeyboard({ status: 'fighting' }));
        }
    }
});

bot.onText(/🏃 💨 فرار کن/, async (msg) => {
    const chatId = msg.chat.id; const p = player.getPlayer(chatId); const enemy = activeBattles[chatId];
    if (!p || !enemy) return bot.sendMessage(chatId, '⚔️ نبردی نیست!', mainMenu());
    
    const result = playerEscape(p, enemy);
    if (result.battleOver) {
        if (enemy.isPlayer && enemy.opponentId) {
            delete activeBattles[enemy.opponentId];
            await bot.sendMessage(enemy.opponentId, `🏃 ${p.name} فرار کرد! تو بردی!`, mainMenu());
        }
        delete activeBattles[chatId];
        if (result.animation) await sendAnimation(chatId, result.animation, result.message, mainMenu());
        else await bot.sendMessage(chatId, result.message, { parse_mode: 'Markdown', ...mainMenu() });
    } else {
        if (result.animation) await sendAnimation(chatId, result.animation, `${formatBattle(p, enemy)}\n\n${result.message}`, getBattleKeyboard(enemy));
        else await sendPhoto(chatId, enemy.file_id, `${formatBattle(p, enemy)}\n\n${result.message}`, getBattleKeyboard(enemy));
    }
});

// ==================== ساخت‌وساز ====================
bot.onText(/^🔨 ساخت‌وساز$/, async (msg) => {
    const chatId = msg.chat.id; const p = player.getPlayer(chatId);
    if (!p) return bot.sendMessage(chatId, '❌ /start بزن!', mainMenu());
    
    const buttons = Object.keys(config.recipes).map(r => 
        p.unlocked?.recipes?.includes(r) ? [`🔨 ساخت ${r}`] : [`🔒 ??? (قفل)`]
    );
    buttons.push(['🔙 برگشت']);
    await bot.sendMessage(chatId, showCraftMenu(), { parse_mode: 'Markdown', reply_markup: { keyboard: buttons, resize_keyboard: true } });
});

bot.onText(/🔨 ساخت (.+)/, (msg, match) => {
    const chatId = msg.chat.id; const p = player.getPlayer(chatId);
    if (!p || !p.unlocked?.recipes?.includes(match[1])) return bot.sendMessage(chatId, '🔒 قفله!', mainMenu());
    const result = craftItem(p, match[1]);
    if (result.success) player.addScore(p, 30);
    bot.sendMessage(chatId, result.message, { parse_mode: 'Markdown', ...mainMenu() });
});

// ==================== بازار ====================
bot.onText(/^🏪 بازار$/, async (msg) => {
    const chatId = msg.chat.id; const p = player.getPlayer(chatId);
    if (!p) return bot.sendMessage(chatId, '❌ /start بزن!', mainMenu());
    if (p.location !== 'village') return bot.sendMessage(chatId, '🏪 فقط تو روستا!', mainMenu());
    p.chatId = chatId;
    
    await bot.sendMessage(chatId, `${showShopMenu()}\n\n👑 ${p.inventory.gold}`, {
        parse_mode: 'Markdown',
        reply_markup: { keyboard: [
            ['🪵 خرید چوب', '🪨 خرید سنگ'],
            ['🍖 خرید گوشت', '💧 خرید آب'],
            ['🦴 خرید پوست', '⛏️ خرید آهن'],
            ['📤 فروش', '🔙 برگشت']
        ], resize_keyboard: true }
    });
});

bot.onText(/^(.+) خرید (.+)$/, (msg, match) => {
    const chatId = msg.chat.id; const p = player.getPlayer(chatId);
    if (!p || p.location !== 'village') return;
    p.chatId = chatId;
    
    const m = { 'چوب': 'wood', 'سنگ': 'stone', 'گوشت': 'meat', 'آب': 'water', 'پوست': 'skin', 'آهن': 'iron' };
    const itemName = match[2].trim();
    if (!m[itemName]) return;
    
    const result = startBuy(p, m[itemName]);
    bot.sendMessage(chatId, result.message, { parse_mode: 'Markdown', ...mainMenu() });
});

bot.onText(/^📤 فروش$/, (msg) => {
    bot.sendMessage(msg.chat.id, '📤 چی می‌خوای بفروشی؟', {
        reply_markup: { keyboard: [
            ['🪵 فروش چوب', '🪨 فروش سنگ'],
            ['🍖 فروش گوشت', '💧 فروش آب'],
            ['🦴 فروش پوست', '⛏️ فروش آهن'],
            ['🔙 بازار']
        ], resize_keyboard: true }
    });
});

bot.onText(/^(.+) فروش (.+)$/, (msg, match) => {
    const chatId = msg.chat.id; const p = player.getPlayer(chatId);
    if (!p || p.location !== 'village') return;
    p.chatId = chatId;
    
    const m = { 'چوب': 'wood', 'سنگ': 'stone', 'گوشت': 'meat', 'آب': 'water', 'پوست': 'skin', 'آهن': 'iron' };
    const itemName = match[2].trim();
    if (!m[itemName]) return;
    
    const result = startSell(p, m[itemName]);
    bot.sendMessage(chatId, result.message, { parse_mode: 'Markdown', ...mainMenu() });
});

// وارد کردن تعداد برای خرید/فروش
bot.on('message', (msg) => {
    const chatId = msg.chat.id;
    const text = msg.text;
    if (!text || text.startsWith('/') || text.startsWith('🪵') || text.startsWith('🪨') || 
        text.startsWith('🍖') || text.startsWith('💧') || text.startsWith('🦴') || 
        text.startsWith('⛏️') || text.startsWith('📤') || text.startsWith('🏪') ||
        text.startsWith('🔙') || text.startsWith('👤') || text.startsWith('🌿') ||
        text.startsWith('🗺️') || text.startsWith('⚔️') || text.startsWith('🔨') ||
        text.startsWith('📊') || text.startsWith('🏰') || text.startsWith('✅') ||
        text.startsWith('🔒') || text.startsWith('🖐️') || text.startsWith('💋') ||
        text.startsWith('🔓') || text.startsWith('🏃')) return;
    
    const p = player.getPlayer(chatId);
    if (!p) return;
    p.chatId = chatId;
    
    const state = getShopState(p);
    if (!state) return;
    
    const result = processAmount(p, text);
    if (result.message) {
        bot.sendMessage(chatId, result.message, { parse_mode: 'Markdown', ...mainMenu() });
    }
});

bot.onText(/\/cancel/, (msg) => {
    const chatId = msg.chat.id;
    const p = player.getPlayer(chatId);
    if (!p) return;
    p.chatId = chatId;
    const result = cancelShop(p);
    bot.sendMessage(chatId, result.message, mainMenu());
});

// ==================== زندان ====================
const { sexPrisoner, getPrisonActions } = require('./prison');

bot.onText(/^🏰 زندان$/, async (msg) => {
    const chatId = msg.chat.id; const p = player.getPlayer(chatId);
    if (!p) return bot.sendMessage(chatId, '❌ /start بزن!', mainMenu());
    
    initPrison(p);
    for (let e of checkEscapes(p)) await bot.sendMessage(chatId, `🏃 ${e.emoji} *${e.name}* فرار کرد!`, { parse_mode: 'Markdown' });
    
    if (p.prison?.length > 0) {
        const buttons = p.prison.map(pr => [`🔒 ${pr.emoji} ${pr.name}`]);
        buttons.push(['🔙 برگشت']);
        await bot.sendMessage(chatId, formatPrison(p) + '\n\n👆 انتخاب کن:', { parse_mode: 'Markdown', reply_markup: { keyboard: buttons, resize_keyboard: true } });
    } else {
        await bot.sendMessage(chatId, formatPrison(p), { parse_mode: 'Markdown', ...mainMenu() });
    }
});

bot.onText(/^🔒 (.+)$/, async (msg, match) => {
    const chatId = msg.chat.id; const p = player.getPlayer(chatId); if (!p?.prison) return;
    const parts = match[1].split(' '); const emoji = parts[0]; const name = parts.slice(1).join(' ');
    const prisoner = p.prison.find(pr => pr.emoji === emoji && pr.name === name);
    if (!prisoner) return;
    
    const points = getRelationPoints(p, prisoner.npcId);
    const relation = getRelationLevel(points);
    const dialogue = getPrisonDialogue(prisoner.npcId, relation.level);
    activePrisoner[chatId] = prisoner.npcId;
    
    let img = null; const npc = getNpcConfig(prisoner.npcId);
    if (npc?.image) img = config.images.npcs?.[npc.image]?.file_id || config.images.enemies?.[npc.image]?.file_id;
    await sendPhoto(chatId, img, `${prisoner.emoji} *${prisoner.name}* | ${relation.name}\n\n${dialogue.text}`, getPrisonerKeyboard(p, prisoner.npcId));
});

bot.onText(/^🖐️ لمس کن$/, async (msg) => {
    const chatId = msg.chat.id; const p = player.getPlayer(chatId); const npcId = activePrisoner[chatId];
    if (!p || !npcId) return;
    const result = touchPrisoner(p, npcId);
    const dialogue = getPrisonDialogue(npcId, getRelationLevel(getRelationPoints(p, npcId)).level);
    
    if (result.animation) {
        await sendAnimation(chatId, result.animation, result.message + '\n\n' + dialogue.text, getPrisonerKeyboard(p, npcId));
    } else {
        await bot.sendMessage(chatId, result.message + '\n\n' + dialogue.text, { parse_mode: 'Markdown', ...getPrisonerKeyboard(p, npcId) });
    }
});

bot.onText(/^💋 ببوس$/, async (msg) => {
    const chatId = msg.chat.id; const p = player.getPlayer(chatId); const npcId = activePrisoner[chatId];
    if (!p || !npcId) return;
    const result = kissPrisoner(p, npcId);
    const dialogue = getPrisonDialogue(npcId, getRelationLevel(getRelationPoints(p, npcId)).level);
    
    if (result.animation) {
        await sendAnimation(chatId, result.animation, result.message + '\n\n' + dialogue.text, getPrisonerKeyboard(p, npcId));
    } else {
        await bot.sendMessage(chatId, result.message + '\n\n' + dialogue.text, { parse_mode: 'Markdown', ...getPrisonerKeyboard(p, npcId) });
    }
});

bot.onText(/^🔥 سکس$/, async (msg) => {
    const chatId = msg.chat.id; const p = player.getPlayer(chatId); const npcId = activePrisoner[chatId];
    if (!p || !npcId) return;
    const result = sexPrisoner(p, npcId);
    const dialogue = getPrisonDialogue(npcId, getRelationLevel(getRelationPoints(p, npcId)).level);
    
    if (result.animation) {
        await sendAnimation(chatId, result.animation, result.message + '\n\n' + dialogue.text, getPrisonerKeyboard(p, npcId));
    } else {
        await bot.sendMessage(chatId, result.message + '\n\n' + dialogue.text, { parse_mode: 'Markdown', ...getPrisonerKeyboard(p, npcId) });
    }
});

bot.onText(/^🔓 آزاد کن$/, async (msg) => {
    const chatId = msg.chat.id; const p = player.getPlayer(chatId); const npcId = activePrisoner[chatId];
    if (!p || !npcId) return;
    const result = releasePrisoner(p, npcId);
    delete activePrisoner[chatId];
    if (result.loyal) player.addScore(p, 50);
    await bot.sendMessage(chatId, result.message, { parse_mode: 'Markdown', ...mainMenu() });
});

bot.onText(/^🔒 (.+)$/, async (msg, match) => {
    const chatId = msg.chat.id; const p = player.getPlayer(chatId); if (!p?.prison) return;
    const parts = match[1].split(' '); const emoji = parts[0]; const name = parts.slice(1).join(' ');
    const prisoner = p.prison.find(pr => pr.emoji === emoji && pr.name === name);
    if (!prisoner) return;
    
    const points = getRelationPoints(p, prisoner.npcId);
    const relation = getRelationLevel(points);
    const dialogue = getPrisonDialogue(prisoner.npcId, relation.level);
    activePrisoner[chatId] = prisoner.npcId;
    
    let img = null; const npc = getNpcConfig(prisoner.npcId);
    if (npc?.image) img = config.images.npcs?.[npc.image]?.file_id || config.images.enemies?.[npc.image]?.file_id;
    await sendPhoto(chatId, img, `${prisoner.emoji} *${prisoner.name}* | ${relation.name}\n\n${dialogue.text}`, getPrisonerKeyboard());
});

bot.onText(/^🖐️ لمس کن$/, async (msg) => {
    const chatId = msg.chat.id; const p = player.getPlayer(chatId); const npcId = activePrisoner[chatId];
    if (!p || !npcId) return;
    const result = touchPrisoner(p, npcId);
    const dialogue = getPrisonDialogue(npcId, getRelationLevel(getRelationPoints(p, npcId)).level);
    await bot.sendMessage(chatId, result.message + '\n\n' + dialogue.text, { parse_mode: 'Markdown', ...getPrisonerKeyboard() });
});

bot.onText(/^💋 ببوس$/, async (msg) => {
    const chatId = msg.chat.id; const p = player.getPlayer(chatId); const npcId = activePrisoner[chatId];
    if (!p || !npcId) return;
    const result = kissPrisoner(p, npcId);
    const dialogue = getPrisonDialogue(npcId, getRelationLevel(getRelationPoints(p, npcId)).level);
    await bot.sendMessage(chatId, result.message + '\n\n' + dialogue.text, { parse_mode: 'Markdown', ...getPrisonerKeyboard() });
});

bot.onText(/^🔓 آزاد کن$/, async (msg) => {
    const chatId = msg.chat.id; const p = player.getPlayer(chatId); const npcId = activePrisoner[chatId];
    if (!p || !npcId) return;
    const result = releasePrisoner(p, npcId);
    delete activePrisoner[chatId];
    if (result.loyal) player.addScore(p, 50);
    await bot.sendMessage(chatId, result.message, { parse_mode: 'Markdown', ...mainMenu() });
});

// ==================== دیالوگ ====================
bot.onText(/^(🗡️|💋|🏃|🤝|🕯️|👂|💰|🕊️|💎|⚔️|❤️|👼|🎁|😘|🧪|😂|😐|🍖) (.+)$/, async (msg, match) => {
    const chatId = msg.chat.id; const p = player.getPlayer(chatId); const dialogue = activeDialogues[chatId];
    if (!p || !dialogue) return;
    
    const current = getDialogue(dialogue.npcId, dialogue.encounter); if (!current) return;
    const option = current.options.find(o => o.text.startsWith(match[1])); if (!option) return;
    
    const result = handleAction(p, dialogue.npcId, option.action);
    delete activeDialogues[chatId];
    
    if (result.battleStart) {
        const fr = startFight(p);
        if (fr.success) { 
            activeBattles[chatId] = fr.enemy; 
            await sendAnimation(chatId, fr.animation, result.message + '\n' + fr.message, getBattleKeyboard(fr.enemy)); 
        }
        else await bot.sendMessage(chatId, fr.message, mainMenu());
    } else {
        await bot.sendMessage(chatId, result.message, { parse_mode: 'Markdown', ...mainMenu() });
    }
});

// ==================== برگشت ====================
bot.onText(/^🔙 برگشت$/, (msg) => {
    const chatId = msg.chat.id;
    if (pvpSearching[chatId]) { clearTimeout(pvpSearching[chatId]); delete pvpSearching[chatId]; }
    delete activeBattles[chatId]; delete activeDialogues[chatId]; delete activePrisoner[chatId];
    const p = player.getPlayer(chatId); if (p) cancelShop(p);
    bot.sendMessage(chatId, '🏛️ *منوی اصلی*', { parse_mode: 'Markdown', ...mainMenu() });
});

bot.onText(/^🔙 بازار$/, (msg) => {
    const chatId = msg.chat.id; const p = player.getPlayer(chatId);
    if (!p || p.location !== 'village') return bot.sendMessage(chatId, '🏪 فقط تو روستا!', mainMenu());
    p.chatId = chatId;
    cancelShop(p);
    bot.sendMessage(chatId, `${showShopMenu()}\n\n👑 ${p.inventory.gold}`, {
        parse_mode: 'Markdown',
        reply_markup: { keyboard: [
            ['🪵 خرید چوب', '🪨 خرید سنگ'],
            ['🍖 خرید گوشت', '💧 خرید آب'],
            ['🦴 خرید پوست', '⛏️ خرید آهن'],
            ['📤 فروش', '🔙 برگشت']
        ], resize_keyboard: true }
    });
});

bot.on('polling_error', (e) => console.log('Polling error:', e.message));
console.log('✅ ربات بقای باستانی با بازار جدید و انیمیشن آماده شد! 🎉');