const TelegramBot = require('node-telegram-bot-api');
const token = process.env.BOT_TOKEN;
const bot = new TelegramBot(token, { polling: true });

const player = require('./player');
const { savePlayers, autoSave, setBot, loadFromChannel } = require('./storage');
const { getTimeOfDay } = require('./player');

setBot(bot);
autoSave(player.players, 21600000);

(async () => {
    const channelData = await loadFromChannel();
    if (channelData) {
        for (let id in channelData) {
            if (!player.players[id] || channelData[id].score > (player.players[id]?.score || 0)) {
                player.players[id] = channelData[id];
                player.initAllSystems(player.players[id]);
            }
        }
    }
})();

const { gather } = require('./gather');
const { travel } = require('./travel');
const { showCraftMenu, getCraftKeyboard, getEnergyCraftKeyboard, craftItem } = require('./craft');
const { activeBattles, startFight, startPvPFight, playerAttack, useSpell, useFinisher, playerEscape, formatBattle, getBattleKeyboard, animations } = require('./fight');
const { showShopMenu, startBuy, startSell, processAmount, cancelShop, getShopState } = require('./shop');
const { getDialogue, getPrisonDialogue, getHouseDialogue, getMarryDialogue, getNpcConfig, handleAction } = require('./dialogue');
const { isAdmin, isBanned, adminCommand } = require('./admin');
const { initPrison, captureNpc, getRelationPoints, getRelationLevel, touchPrisoner, kissPrisoner, orgyPrisoner, releasePrisoner, checkEscapes, formatPrison, getPrisonerKeyboard } = require('./prison');
const { initHouse, inviteToHouse, kickFromHouse, formatHouse, getHouseKeyboard, touchInHouse, kissInHouse, orgyInHouse } = require('./house');
const { propose, marry, divorce } = require('./marry');
const { formatPets, getPetKeyboard, feedPet, feedAllPets, releasePet, initPets } = require('./pet');
const { formatLootBoxes, getLootBoxKeyboard, openLootBox } = require('./lootbox');
const { formatDailyQuests, getDailyQuestKeyboard, claimQuestReward, initDailyQuests } = require('./dailyQuest');
const { formatChildren, getChildrenKeyboard, feedChild, trainChild, assignHeir, holdTournament, initChildren, checkBirths, checkPregnancy, getPregnancyImage, getBirthImage } = require('./offspring');
const { formatEmpire, getEmpireKeyboard, collectEmpireIncome, assignRole, buildWonder, setDynastyName } = require('./empire');
const { formatPeople, getPeopleKeyboard, getLandKeyboard, getBuildingKeyboard, assignLand, harvestAllLands, buildPublicBuilding, collectTaxes, waterLand } = require('./people');
const { formatCourt, getCourtKeyboard, getIntrigueKeyboard, getCourtEventKeyboard, performIntrigue: courtIntrigue, managePrisoners, getCourtEvent, handleCourtEvent } = require('./court');
const { formatBlackMarket, getBlackMarketKeyboard, buyBlackMarketItem, acceptSpecialDeal, initBlackMarket } = require('./blackMarket');
const { formatHarem, getHaremKeyboard, getQueenKeyboard: getHaremQueenKeyboard, getPregnancySpeedKeyboard, getDressKeyboard, getJewelryKeyboard: getHaremJewelryKeyboard, getRoomKeyboard, getServantKeyboard, getUpbringingKeyboard, getCelebrationKeyboard, getIntrigueKeyboard: getHaremIntrigueKeyboard, addQueenToHarem, removeQueenFromHarem, startPregnancy, speedUpPregnancy, checkHaremBirths, queenCare, careAllQueens, paySalaries, buyDress, buyJewelry, upgradeRoom, hireServant, performIntrigue: haremIntrigue, setChildUpbringing, celebrateFestival } = require('./queenHarem');
const { formatSecretChamber, getSecretChamberKeyboard, getRoomKeyboard: getChamberRoomKeyboard, getGuardKeyboard, getGiftKeyboard, visitGirl, visitBoy, doActivity, upgradeGirlToQueen, giveGift, hireGuard, checkAddiction } = require('./secretChamber');
const config = require('./config');

// عکس‌های پوزیشن
const positionImages = {
    front: ['AgACAgQAAxkBAAEqchJqKYNBg0zmZiROMcoy2bB_M3tjwgACPA9rG9N3UVHZwwE7RKj3YQEAAwIAA3gAAzsE','AgACAgQAAxkBAAEqchRqKYNBnzYyp4TfO3yFCSQTjWVu_AACPg9rG9N3UVHORrlN-_zB3gEAAwIAA3gAAzsE','AgACAgQAAxkBAAEqchVqKYNBXoZesg275G3iu_wDjN4BGAACPw9rG9N3UVFG4eWVwi9M3wEAAwIAA3gAAzsE'],
    back: ['AgACAgQAAxkBAAEqchZqKYNBnFb9YWyq8mErc6qZmxEM7QACQA9rG9N3UVEFrz_O5eTc3QEAAwIAA3gAAzsE','AgACAgQAAxkBAAEqchdqKYNB01FBalAJPYpsBwfrqyUXNgACQg9rG9N3UVH9yMp8cY9xqgEAAwIAA3gAAzsE','AgACAgQAAxkBAAEqchhqKYNBvWdxTz5Xb4BVegmydls94AACQw9rG9N3UVGPyWGMVz6ImgEAAwIAA3gAAzsE']
};

const activeDialogues = {};
const activePrisoner = {};
const activeHouseNpc = {};
const pvpSearching = {};
const adminState = {};
const wishState = {};
const empireState = {};
const peopleState = {};
const courtState = {};
const haremState = {};
const chamberState = {};
const activeHaremQueen = {};

function mainMenu() {
    return { reply_markup: { keyboard: [
        ['👤 وضعیت', '🌿 جمع‌آوری'],
        ['🗺️ سفر', '⚔️ نبرد'],
        ['🔨 ساخت‌وساز', '🏪 بازار'],
        ['🏠 خونه', '🏰 زندان'],
        ['👑 امپراطوری', '📊 رتبه‌بندی']
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
    if (fileId) { try { await bot.sendAnimation(chatId, fileId, { caption, parse_mode: 'Markdown', ...keyboard }); return; } catch (e) {} }
    await bot.sendMessage(chatId, caption, { parse_mode: 'Markdown', ...keyboard });
}

async function sendPhoto(chatId, fileId, caption, keyboard) {
    if (fileId) { try { await bot.sendPhoto(chatId, fileId, { caption, parse_mode: 'Markdown', ...keyboard }); return; } catch (e) {} }
    await bot.sendMessage(chatId, caption, { parse_mode: 'Markdown', ...keyboard });
}
bot.on('channel_post', async (msg) => {
    if (msg.chat.id === -1003035245907) {
        const text = msg.text || msg.caption || '';
        if (text.startsWith('💾')) return;
        for (let chatId in player.players) {
            try {
                if (msg.photo) await bot.sendPhoto(chatId, msg.photo[msg.photo.length - 1].file_id, { caption: '📢 *بقای باستانی*\n\n' + text, parse_mode: 'Markdown' });
                else if (msg.video) await bot.sendVideo(chatId, msg.video.file_id, { caption: '📢 *بقای باستانی*\n\n' + text, parse_mode: 'Markdown' });
                else if (msg.animation) await bot.sendAnimation(chatId, msg.animation.file_id, { caption: '📢 *بقای باستانی*\n\n' + text, parse_mode: 'Markdown' });
                else if (text) await bot.sendMessage(chatId, '📢 *بقای باستانی*\n\n' + text, { parse_mode: 'Markdown' });
            } catch (e) {}
        }
    }
});

bot.onText(/\/start/, async (msg) => {
    const chatId = msg.chat.id;
    const firstName = msg.chat.first_name || 'گمنام';
    if (!player.getPlayer(chatId)) player.createPlayer(chatId, firstName);
    const p = player.getPlayer(chatId);
    player.initAllSystems(p);
    const time = getTimeOfDay(); p.timeOfDay = time;
    if (!p.gameDay) p.gameDay = 1;
    if (!p.inventory.condom) p.inventory.condom = 0;
    player.checkUnlocks(p); p.chatId = chatId;
    initPets(p); initDailyQuests(p); initChildren(p); initBlackMarket(p);
    if (!p.lootBoxes) p.lootBoxes = { wooden: 0, silver: 0, golden: 0, legendary: 0 };
    try { const { initHarem } = require('./queenHarem'); initHarem(p); } catch (e) {}
    try { const { initSecretChamber } = require('./secretChamber'); initSecretChamber(p); } catch (e) {}
    try { const { initEmpire } = require('./empire'); initEmpire(p); } catch (e) {}
    try { const { initPeople } = require('./people'); initPeople(p); } catch (e) {}
    try { const { initCourt } = require('./court'); initCourt(p); } catch (e) {}
    
    const births = checkBirths(p);
    if (births.length > 0) {
        for (let child of births) {
            const birthImg = getBirthImage();
            if (birthImg) await sendPhoto(chatId, birthImg, `👶 *${child.name}* متولد شد! ${child.emoji}`, mainMenu());
            else await bot.sendMessage(chatId, `👶 *${child.name}* متولد شد! ${child.emoji}`, { parse_mode: 'Markdown' });
        }
    }
    
    const loc = config.images.locations[p.location] || config.images.locations.village;
    let welcome = `🏛️ *بقای باستانی*\n\n✨ ${p.name} | 📍 ${loc.emoji} ${loc.name}\n${time.name} | 📅 روز ${p.gameDay||1}/۷ | 🏆 ${p.score||0} امتیاز\n\n🐺 *مرحله اول: روستا*\n🎯 گرگ‌ها، مارها و دزدها رو شکار کن!`;
    if (p.unlockedMessage) { welcome += `\n\n${p.unlockedMessage}`; p.unlockedMessage = null; }
    if (p.levelUpMessage) { welcome += `\n\n${p.levelUpMessage}`; p.levelUpMessage = null; }
    await sendPhoto(chatId, loc.file_id, welcome, mainMenu());
});

bot.onText(/\/admin (.+)/, (msg, match) => {
    const chatId = msg.chat.id;
    if (!isAdmin(chatId)) return;
    const p = player.getPlayer(chatId); if (!p) return;
    p.chatId = chatId;
    const args = match[1].split(' '); const cmd = args.shift();
    const result = adminCommand(p, cmd, args);
    if (result.announceAll && result.announce) {
        const announceMsg = `📢 *اعلان ادمین:*\n\n${result.announce}`;
        for (let id in player.players) { try { bot.sendMessage(id, announceMsg, { parse_mode: 'Markdown' }); } catch (e) {} }
        bot.sendMessage(chatId, `✅ پیام به همه ارسال شد!\n\n${announceMsg}`, { parse_mode: 'Markdown', ...mainMenu() });
        return;
    }
    bot.sendMessage(chatId, result.message, { parse_mode: 'Markdown', ...mainMenu() });
});

bot.onText(/^👤 وضعیت$/, async (msg) => {
    const chatId = msg.chat.id; const p = player.getPlayer(chatId);
    if (!p) return bot.sendMessage(chatId, '❌ /start بزن!', mainMenu());
    p.timeOfDay = getTimeOfDay(); if (!p.gameDay) p.gameDay = 1;
    await bot.sendMessage(chatId, player.formatStatus(p), { parse_mode: 'Markdown', ...mainMenu() });
    await bot.sendMessage(chatId, formatDailyQuests(p), { parse_mode: 'Markdown', ...getDailyQuestKeyboard(p) });
});

bot.onText(/^📊 رتبه‌بندی$/, async (msg) => {
    await bot.sendMessage(msg.chat.id, player.formatLeaderboard(), { parse_mode: 'Markdown', ...mainMenu() });
});

bot.onText(/^🌿 جمع‌آوری$/, async (msg) => {
    const chatId = msg.chat.id; const p = player.getPlayer(chatId);
    if (!p) return bot.sendMessage(chatId, '❌ /start بزن!', mainMenu());
    p.chatId = chatId;
    const result = gather(p);
    player.addScore(p, 5); player.checkUnlocks(p);
    let extra = p.unlockedMessage ? '\n\n' + p.unlockedMessage : '';
    if (p.unlockedMessage) p.unlockedMessage = null;
    if (result.petImage) await sendPhoto(chatId, result.petImage, result.message + extra, mainMenu());
    else if (result.boxImage) await sendPhoto(chatId, result.boxImage, result.message + extra, mainMenu());
    else await bot.sendMessage(chatId, result.message + extra, { parse_mode: 'Markdown', ...mainMenu() });
});

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
                if ((p.inventory?.key || 0) > 0) { p.inventory.key--; p.unlocked.locations.push(k); return bot.sendMessage(chatId, `🗝️ باز شد! ${loc.emoji} *${loc.name}*`, mainMenu()); }
                return bot.sendMessage(chatId, `🔒 نیاز به ${(config.locationRequirements[k]||9999)-p.score} امتیاز`, mainMenu());
            }
            const result = travel(p, k); player.addScore(p, 10); player.checkUnlocks(p);
            if (result.ambush) { const fr = startFight(p); if (fr.success) { activeBattles[chatId] = fr.enemy; return await sendAnimation(chatId, fr.animation, result.message + '\n' + fr.message, getBattleKeyboard(p, fr.enemy)); } }
            await bot.sendMessage(chatId, result.message, { parse_mode: 'Markdown' });
            let extra = p.unlockedMessage ? '\n\n' + p.unlockedMessage : ''; if (p.unlockedMessage) p.unlockedMessage = null;
            return bot.sendMessage(chatId, '🏛️ سفر تموم شد!' + extra, { parse_mode: 'Markdown', ...mainMenu() });
        }
    }
});
bot.onText(/^⚔️ نبرد$/, async (msg) => {
    const chatId = msg.chat.id; const p = player.getPlayer(chatId);
    if (!p) return bot.sendMessage(chatId, '❌ /start بزن!', mainMenu());
    pvpSearching[chatId] = setTimeout(async () => {
        delete pvpSearching[chatId];
        const result = startFight(p);
        if (!result.success) return bot.sendMessage(chatId, result.message, mainMenu());
        activeBattles[chatId] = result.enemy;
        if (result.animation) await sendAnimation(chatId, result.animation, result.message, getBattleKeyboard(p, result.enemy));
        else await sendPhoto(chatId, result.enemy?.file_id, result.message, getBattleKeyboard(p, result.enemy));
    }, 5000);
    await bot.sendMessage(chatId, '⏳ *۵ ثانیه دنبال حریف آنلاین...*', { parse_mode: 'Markdown', ...mainMenu() });
    for (let id in pvpSearching) {
        if (id != chatId) {
            clearTimeout(pvpSearching[id]); clearTimeout(pvpSearching[chatId]);
            delete pvpSearching[id]; delete pvpSearching[chatId];
            const opponent = player.getPlayer(parseInt(id));
            if (opponent) {
                const { enemy1, enemy2 } = startPvPFight(p, opponent);
                activeBattles[chatId] = enemy1; activeBattles[id] = enemy2;
                await bot.sendMessage(chatId, `⚔️ *PvP!*\n👤 ${opponent.name}\n🥊 تو اول بزن!`, { parse_mode: 'Markdown', ...getBattleKeyboard(p, enemy1) });
                await bot.sendMessage(id, `⚔️ *PvP!*\n👤 ${p.name}\n⏳ منتظر...`, { parse_mode: 'Markdown', ...getBattleKeyboard(opponent, enemy2) });
                return;
            }
        }
    }
});

bot.onText(/⚔️ 🗡️ حمله کن/, async (msg) => {
    const chatId = msg.chat.id; const p = player.getPlayer(chatId); const enemy = activeBattles[chatId];
    if (!p || !enemy) return bot.sendMessage(chatId, '⚔️ نبردی نیست!', mainMenu());
    const result = playerAttack(p, enemy); handleBattleResult(chatId, p, enemy, result);
});

bot.onText(/📜 طلسم/, async (msg) => {
    const chatId = msg.chat.id; const p = player.getPlayer(chatId); const enemy = activeBattles[chatId];
    if (!p || !enemy) return bot.sendMessage(chatId, '⚔️ نبردی نیست!', mainMenu());
    const result = useSpell(p, enemy); handleBattleResult(chatId, p, enemy, result);
});

bot.onText(/💀 فنیشر/, async (msg) => {
    const chatId = msg.chat.id; const p = player.getPlayer(chatId); const enemy = activeBattles[chatId];
    if (!p || !enemy) return bot.sendMessage(chatId, '⚔️ نبردی نیست!', mainMenu());
    const result = useFinisher(p, enemy); handleBattleResult(chatId, p, enemy, result);
});

async function handleBattleResult(chatId, p, enemy, result) {
    if (result.battleOver) {
        if (enemy.isPlayer && enemy.opponentId && activeBattles[enemy.opponentId]) {
            delete activeBattles[enemy.opponentId]; await bot.sendMessage(enemy.opponentId, `💀 باختی! ${p.name} برنده شد!`, mainMenu());
        }
        delete activeBattles[chatId];
        if (result.playerWon) { player.addScore(p, enemy.isPlayer ? 50 : 20); player.checkUnlocks(p); }
        let extra = p.unlockedMessage ? '\n\n' + p.unlockedMessage : '';
        if (p.unlockedMessage) p.unlockedMessage = null;
        if (p.levelUpMessage) { extra += '\n\n' + p.levelUpMessage; p.levelUpMessage = null; }
        if (result.animation) await sendAnimation(chatId, result.animation, result.message + extra, mainMenu());
        else await bot.sendMessage(chatId, result.message + extra, { parse_mode: 'Markdown', ...mainMenu() });
        if (result.canCapture) await bot.sendMessage(chatId, captureNpc(p, result.npcId).message, mainMenu());
        if (result.escaped) await bot.sendMessage(chatId, `👣 *${enemy.name}* فرار کرد!`, mainMenu());
    } else {
        if (result.animation) await sendAnimation(chatId, result.animation, `${formatBattle(p, enemy)}\n\n${result.message}`, getBattleKeyboard(p, enemy));
        else await sendPhoto(chatId, enemy.file_id, `${formatBattle(p, enemy)}\n\n${result.message}`, getBattleKeyboard(p, enemy));
        if (enemy.isPlayer && enemy.opponentId) {
            const opp = player.getPlayer(enemy.opponentId);
            if (opp) await bot.sendMessage(enemy.opponentId, `⏳ منتظر حمله ${p.name}...`, getBattleKeyboard(opp, { status: 'fighting' }));
        }
    }
}

bot.onText(/🏃 💨 فرار کن/, async (msg) => {
    const chatId = msg.chat.id; const p = player.getPlayer(chatId); const enemy = activeBattles[chatId];
    if (!p || !enemy) return bot.sendMessage(chatId, '⚔️ نبردی نیست!', mainMenu());
    if ((p.inventory?.key || 0) > 0) { p.inventory.key--; delete activeBattles[chatId]; return bot.sendMessage(chatId, '🗝️ با کلید فرار کردی!', mainMenu()); }
    const result = playerEscape(p, enemy);
    if (result.battleOver) {
        if (enemy.isPlayer && enemy.opponentId && activeBattles[enemy.opponentId]) { delete activeBattles[enemy.opponentId]; await bot.sendMessage(enemy.opponentId, `🏃 ${p.name} فرار کرد!`, mainMenu()); }
        delete activeBattles[chatId];
        if (result.animation) await sendAnimation(chatId, result.animation, result.message, mainMenu());
        else await bot.sendMessage(chatId, result.message, { parse_mode: 'Markdown', ...mainMenu() });
    } else {
        if (result.animation) await sendAnimation(chatId, result.animation, `${formatBattle(p, enemy)}\n\n${result.message}`, getBattleKeyboard(p, enemy));
        else await sendPhoto(chatId, enemy.file_id, `${formatBattle(p, enemy)}\n\n${result.message}`, getBattleKeyboard(p, enemy));
    }
});

bot.onText(/^🔨 ساخت‌وساز$/, async (msg) => {
    const chatId = msg.chat.id; const p = player.getPlayer(chatId);
    if (!p) return bot.sendMessage(chatId, '❌ /start بزن!', mainMenu());
    await bot.sendMessage(chatId, showCraftMenu(p), { parse_mode: 'Markdown', ...getCraftKeyboard(p) });
});

bot.onText(/^⚡ ساخت انرژی‌دار$/, async (msg) => {
    const chatId = msg.chat.id; const p = player.getPlayer(chatId); if (!p) return;
    await bot.sendMessage(chatId, showCraftMenu(p), { parse_mode: 'Markdown', ...getEnergyCraftKeyboard(p) });
});

bot.onText(/🔨 ساخت (.+)/, (msg, match) => {
    const chatId = msg.chat.id; const p = player.getPlayer(chatId); if (!p) return;
    const result = craftItem(p, match[1]); if (result.success) player.addScore(p, 30);
    bot.sendMessage(chatId, result.message, { parse_mode: 'Markdown', ...getCraftKeyboard(p) });
});

bot.onText(/^[✅❌] (.+) \((\d+)⚡\)$/, async (msg, match) => {
    const chatId = msg.chat.id; const p = player.getPlayer(chatId); if (!p) return;
    const result = craftItem(p, match[1].trim()); if (result.success) player.addScore(p, 50);
    await bot.sendMessage(chatId, result.message, { parse_mode: 'Markdown', ...getEnergyCraftKeyboard(p) });
});
bot.onText(/^🏪 بازار$/, async (msg) => {
    const chatId = msg.chat.id; const p = player.getPlayer(chatId);
    if (!p) return bot.sendMessage(chatId, '❌ /start بزن!', mainMenu());
    if (p.location !== 'village') return bot.sendMessage(chatId, '🏪 فقط تو روستا!', mainMenu());
    p.chatId = chatId;
    await bot.sendMessage(chatId, `${showShopMenu()}\n\n👑 ${p.inventory?.gold||0}`, {
        parse_mode: 'Markdown',
        reply_markup: { keyboard: [
            ['🪵 خرید چوب', '🪨 خرید سنگ'], ['🍖 خرید گوشت', '💧 خرید آب'], 
            ['🦴 خرید پوست', '⛏️ خرید آهن'], ['💀 خرید فنیشر', '⚡ خرید انرژی'], 
            ['💎 فروش الماس', '📤 فروش'], ['📦 صندوقچه گنج', '🕶️ بازار مکاره'], ['🔙 برگشت']
        ], resize_keyboard: true }
    });
});

bot.onText(/^🕶️ بازار مکاره$/, async (msg) => {
    const chatId = msg.chat.id; const p = player.getPlayer(chatId);
    if (!p) return bot.sendMessage(chatId, '❌ /start بزن!', mainMenu());
    initBlackMarket(p); await bot.sendMessage(chatId, formatBlackMarket(p), { parse_mode: 'Markdown', ...getBlackMarketKeyboard(p) });
});

bot.onText(/^🛒 خرید (\d+)$/, async (msg, match) => {
    const chatId = msg.chat.id; const p = player.getPlayer(chatId); if (!p) return;
    const result = buyBlackMarketItem(p, parseInt(match[1]));
    await bot.sendMessage(chatId, result.message, { parse_mode: 'Markdown', ...getBlackMarketKeyboard(p) });
});

bot.onText(/^🤝 معامله ویژه$/, async (msg) => {
    const chatId = msg.chat.id; const p = player.getPlayer(chatId); if (!p) return;
    const result = acceptSpecialDeal(p);
    await bot.sendMessage(chatId, result.message, { parse_mode: 'Markdown', ...getBlackMarketKeyboard(p) });
});

bot.onText(/^📦 صندوقچه گنج$/, async (msg) => {
    const chatId = msg.chat.id; const p = player.getPlayer(chatId);
    if (!p) return bot.sendMessage(chatId, '❌ /start بزن!', mainMenu());
    if (!p.lootBoxes) p.lootBoxes = { wooden: 0, silver: 0, golden: 0, legendary: 0 };
    await bot.sendMessage(chatId, formatLootBoxes(p), { parse_mode: 'Markdown', ...getLootBoxKeyboard(p) });
});

bot.onText(/^📦 باز کردن صندوق چوبی$/, async (msg) => { const chatId = msg.chat.id; const p = player.getPlayer(chatId); if (!p) return; const r = openLootBox(p, 'wooden'); if (r.image) await sendPhoto(chatId, r.image, r.message, getLootBoxKeyboard(p)); else await bot.sendMessage(chatId, r.message, { parse_mode: 'Markdown', ...getLootBoxKeyboard(p) }); });
bot.onText(/^📦⚪ باز کردن صندوق نقره‌ای$/, async (msg) => { const chatId = msg.chat.id; const p = player.getPlayer(chatId); if (!p) return; const r = openLootBox(p, 'silver'); if (r.image) await sendPhoto(chatId, r.image, r.message, getLootBoxKeyboard(p)); else await bot.sendMessage(chatId, r.message, { parse_mode: 'Markdown', ...getLootBoxKeyboard(p) }); });
bot.onText(/^📦🟡 باز کردن صندوق طلایی$/, async (msg) => { const chatId = msg.chat.id; const p = player.getPlayer(chatId); if (!p) return; const r = openLootBox(p, 'golden'); if (r.image) await sendPhoto(chatId, r.image, r.message, getLootBoxKeyboard(p)); else await bot.sendMessage(chatId, r.message, { parse_mode: 'Markdown', ...getLootBoxKeyboard(p) }); });
bot.onText(/^📦🟣 باز کردن صندوق افسانه‌ای$/, async (msg) => { const chatId = msg.chat.id; const p = player.getPlayer(chatId); if (!p) return; const r = openLootBox(p, 'legendary'); if (r.image) await sendPhoto(chatId, r.image, r.message, getLootBoxKeyboard(p)); else await bot.sendMessage(chatId, r.message, { parse_mode: 'Markdown', ...getLootBoxKeyboard(p) }); });

bot.onText(/^(.+) خرید (.+)$/, (msg, match) => {
    const chatId = msg.chat.id; const p = player.getPlayer(chatId);
    if (!p || p.location !== 'village') return; p.chatId = chatId;
    const m = { 'چوب': 'wood', 'سنگ': 'stone', 'گوشت': 'meat', 'آب': 'water', 'پوست': 'skin', 'آهن': 'iron', 'فنیشر': 'finisher' };
    const r = startBuy(p, m[match[2].trim()]); bot.sendMessage(chatId, r.message, { parse_mode: 'Markdown', ...mainMenu() });
});

bot.onText(/^⚡ خرید انرژی$/, (msg) => {
    const chatId = msg.chat.id; const p = player.getPlayer(chatId);
    if (!p || p.location !== 'village') return; p.chatId = chatId;
    const r = startBuy(p, 'energy'); bot.sendMessage(chatId, r.message, { parse_mode: 'Markdown', ...mainMenu() });
});

bot.onText(/^💎 فروش الماس$/, (msg) => {
    const chatId = msg.chat.id; const p = player.getPlayer(chatId);
    if (!p || p.location !== 'village') return; p.chatId = chatId;
    bot.sendMessage(chatId, startSell(p, 'diamond').message, mainMenu());
});

bot.onText(/^📤 فروش$/, (msg) => {
    bot.sendMessage(msg.chat.id, '📤 چی می‌خوای بفروشی؟', {
        reply_markup: { keyboard: [['🪵 فروش چوب', '🪨 فروش سنگ'], ['🍖 فروش گوشت', '💧 فروش آب'], ['🦴 فروش پوست', '⛏️ فروش آهن'], ['🔙 بازار']], resize_keyboard: true }
    });
});

bot.onText(/^(.+) فروش (.+)$/, (msg, match) => {
    const chatId = msg.chat.id; const p = player.getPlayer(chatId);
    if (!p || p.location !== 'village') return; p.chatId = chatId;
    const m = { 'چوب': 'wood', 'سنگ': 'stone', 'گوشت': 'meat', 'آب': 'water', 'پوست': 'skin', 'آهن': 'iron' };
    bot.sendMessage(chatId, startSell(p, m[match[2].trim()]).message, { parse_mode: 'Markdown', ...mainMenu() });
});

bot.onText(/\/cancel/, (msg) => {
    const chatId = msg.chat.id; const p = player.getPlayer(chatId);
    if (!p) return; p.chatId = chatId; bot.sendMessage(chatId, cancelShop(p).message, mainMenu());
});
// ============ 🏠 خونه (مخفی‌گاه) ============
bot.onText(/^🏠 خونه$/, async (msg) => {
    const chatId = msg.chat.id; const p = player.getPlayer(chatId);
    if (!p) return bot.sendMessage(chatId, '❌ /start بزن!', mainMenu());
    initHouse(p); initPets(p); initChildren(p);
    if (!p.gameDay) p.gameDay = 1;
    
    let houseMsg = formatHouse(p);
    const buttons = [];
    if (p.house?.length > 0) { for (let h of p.house) buttons.push([`🏠 ${h.emoji} ${h.name}`]); }
    buttons.push(['👶 فرزندان']);
    buttons.push(['🐾 حیوون‌ها']);
    buttons.push(['🔮 آرزو']);
    buttons.push(['🔞 مخفی‌گاه']);
    if (p.level >= 30 || (p.empire && p.empire.level > 0)) buttons.push(['👑 امپراطوری']);
    buttons.push(['🔙 برگشت']);
    
    await bot.sendMessage(chatId, houseMsg, { parse_mode: 'Markdown', reply_markup: { keyboard: buttons, resize_keyboard: true } });
});

// ============ 🔮 آرزو ============
bot.onText(/^🔮 آرزو$/, async (msg) => {
    const chatId = msg.chat.id; const p = player.getPlayer(chatId);
    if (!p) return bot.sendMessage(chatId, '❌ /start بزن!', mainMenu());
    if ((p.inventory?.wish || 0) < 1) return bot.sendMessage(chatId, '❌ آرزو نداری!', mainMenu());
    wishState[chatId] = true;
    await bot.sendMessage(chatId, `👼 *فرشته آرزوها:*\n\n🔮 آرزو: ${p.inventory.wish} عدد\n\nیکی رو انتخاب کن:`, {
        parse_mode: 'Markdown',
        reply_markup: { keyboard: [['💰 ثروت (+۲۰۰👑)'], ['⚔️ قدرت (+۲۰⚔️)'], ['❤️ سلامتی (+۱۰۰❤️)'], ['✨ تجربه (+۱۰۰✨)'], ['🔙 برگشت']], resize_keyboard: true }
    });
});

bot.onText(/^💰 ثروت/, async (msg) => { const chatId = msg.chat.id; const p = player.getPlayer(chatId); if (!p || !wishState[chatId]) return; p.inventory.wish--; p.inventory.gold=(p.inventory.gold||0)+200; delete wishState[chatId]; bot.sendMessage(chatId, '💰 +۲۰۰👑', {parse_mode:'Markdown',...mainMenu()}); });
bot.onText(/^⚔️ قدرت/, async (msg) => { const chatId = msg.chat.id; const p = player.getPlayer(chatId); if (!p || !wishState[chatId]) return; p.inventory.wish--; p.attack=(p.attack||5)+20; delete wishState[chatId]; bot.sendMessage(chatId, '⚔️ +۲۰⚔️ دائمی', {parse_mode:'Markdown',...mainMenu()}); });
bot.onText(/^❤️ سلامتی/, async (msg) => { const chatId = msg.chat.id; const p = player.getPlayer(chatId); if (!p || !wishState[chatId]) return; p.inventory.wish--; p.maxHp=(p.maxHp||100)+100; p.hp=p.maxHp; delete wishState[chatId]; bot.sendMessage(chatId, '❤️ +۱۰۰❤️ دائمی', {parse_mode:'Markdown',...mainMenu()}); });
bot.onText(/^✨ تجربه/, async (msg) => { const chatId = msg.chat.id; const p = player.getPlayer(chatId); if (!p || !wishState[chatId]) return; p.inventory.wish--; p.xp=(p.xp||0)+100; player.checkLevelUp(p); delete wishState[chatId]; let e=p.levelUpMessage?'\n\n'+p.levelUpMessage:''; if(p.levelUpMessage)p.levelUpMessage=null; bot.sendMessage(chatId, '✨ +۱۰۰✨'+e, {parse_mode:'Markdown',...mainMenu()}); });

// ============ 🔞 مخفی‌گاه ============
bot.onText(/^🔞 مخفی‌گاه$/, async (msg) => {
    const chatId = msg.chat.id; const p = player.getPlayer(chatId);
    if (!p) return bot.sendMessage(chatId, '❌ /start بزن!', mainMenu());
    try { const { initSecretChamber } = require('./secretChamber'); initSecretChamber(p); } catch (e) {}
    await bot.sendMessage(chatId, formatSecretChamber(p), { parse_mode: 'Markdown', ...getSecretChamberKeyboard(p) });
});

// دختران مخفی‌گاه
bot.onText(/^👩 (.+) \((\d+)👑\)$/, async (msg, match) => {
    const chatId = msg.chat.id; const p = player.getPlayer(chatId);
    if (!p) return;
    const girlInfo = match[1].trim();
    const { secretGirls } = require('./secretChamber');
    let girl = null;
    for (let g of secretGirls) { if (girlInfo.includes(g.emoji) && girlInfo.includes(g.name)) { girl = g; break; } }
    if (!girl) return;
    activePrisoner[chatId] = girl.id;
    await bot.sendMessage(chatId, `🏠 *انتخاب اتاق برای ${girl.emoji} ${girl.name}:*`, { parse_mode: 'Markdown', ...getChamberRoomKeyboard() });
    chamberState[chatId] = { action: 'visitGirl', girlId: girl.id };
});

bot.onText(/^🛏️ (.+) \((\d+)👑\) - (.+)$/, async (msg, match) => {
    const chatId = msg.chat.id; const p = player.getPlayer(chatId);
    if (!p || !chamberState[chatId]) return;
    const roomName = match[1].trim();
    const { chamberRooms } = require('./secretChamber');
    let roomType = 'normal';
    if (roomName.includes('VIP')) roomType = 'vip';
    else if (roomName.includes('سلطنتی')) roomType = 'royal';
    else if (roomName.includes('مخفی')) roomType = 'secret';
    
    let result;
    if (chamberState[chatId].action === 'visitGirl') {
        result = visitGirl(p, chamberState[chatId].girlId, roomType);
    } else if (chamberState[chatId].action === 'visitBoy') {
        result = visitBoy(p, chamberState[chatId].boyId, roomType);
    }
    
    delete chamberState[chatId];
    if (result) await bot.sendMessage(chatId, result.message, { parse_mode: 'Markdown', ...getSecretChamberKeyboard(p) });
});

// پسران مخفی‌گاه
bot.onText(/^👦 (.+) \((\d+)👑\)$/, async (msg, match) => {
    const chatId = msg.chat.id; const p = player.getPlayer(chatId);
    if (!p) return;
    const boyInfo = match[1].trim();
    const { secretBoys } = require('./secretChamber');
    let boy = null;
    for (let b of secretBoys) { if (boyInfo.includes(b.emoji) && boyInfo.includes(b.name)) { boy = b; break; } }
    if (!boy) return;
    await bot.sendMessage(chatId, `🏠 *انتخاب اتاق برای ${boy.emoji} ${boy.name}:*`, { parse_mode: 'Markdown', ...getChamberRoomKeyboard() });
    chamberState[chatId] = { action: 'visitBoy', boyId: boy.id };
});

// فعالیت‌های مخفی‌گاه
bot.onText(/^🎲 قمار \((\d+)👑\)$/, async (msg) => { const chatId = msg.chat.id; const p = player.getPlayer(chatId); if (!p) return; const r = doActivity(p, 'gambling'); await bot.sendMessage(chatId, r.message, { parse_mode: 'Markdown', ...getSecretChamberKeyboard(p) }); });
bot.onText(/^🍷 میخانه \((\d+)👑\)$/, async (msg) => { const chatId = msg.chat.id; const p = player.getPlayer(chatId); if (!p) return; const r = doActivity(p, 'drinking'); await bot.sendMessage(chatId, r.message, { parse_mode: 'Markdown', ...getSecretChamberKeyboard(p) }); });
bot.onText(/^🎵 موسیقی \((\d+)👑\)$/, async (msg) => { const chatId = msg.chat.id; const p = player.getPlayer(chatId); if (!p) return; const r = doActivity(p, 'music'); await bot.sendMessage(chatId, r.message, { parse_mode: 'Markdown', ...getSecretChamberKeyboard(p) }); });
bot.onText(/^🔮 فال‌گیری \((\d+)👑\)$/, async (msg) => { const chatId = msg.chat.id; const p = player.getPlayer(chatId); if (!p) return; const r = doActivity(p, 'fortune'); await bot.sendMessage(chatId, r.message, { parse_mode: 'Markdown', ...getSecretChamberKeyboard(p) }); });
bot.onText(/^🗡️ مبارزه \((\d+)👑\)$/, async (msg) => { const chatId = msg.chat.id; const p = player.getPlayer(chatId); if (!p) return; const r = doActivity(p, 'fighting'); await bot.sendMessage(chatId, r.message, { parse_mode: 'Markdown', ...getSecretChamberKeyboard(p) }); });
bot.onText(/^💊 تریاک \((\d+)👑\)$/, async (msg) => { const chatId = msg.chat.id; const p = player.getPlayer(chatId); if (!p) return; const r = doActivity(p, 'opium'); await bot.sendMessage(chatId, r.message, { parse_mode: 'Markdown', ...getSecretChamberKeyboard(p) }); });

// ============ 🐾 حیوانات ============
bot.onText(/^🐾 حیوون‌ها$/, async (msg) => {
    const chatId = msg.chat.id; const p = player.getPlayer(chatId);
    if (!p) return bot.sendMessage(chatId, '❌ /start بزن!', mainMenu());
    initPets(p); await bot.sendMessage(chatId, formatPets(p), { parse_mode: 'Markdown', ...getPetKeyboard(p) });
});

bot.onText(/^🍖 غذا بده به (.+)$/, async (msg, match) => {
    const chatId = msg.chat.id; const p = player.getPlayer(chatId); if (!p) return;
    const pet = p.pets?.find(pt => `${pt.emoji} ${pt.name}` === match[1].trim());
    if (!pet) return bot.sendMessage(chatId, '❌ حیوون پیدا نشد!', getPetKeyboard(p));
    const r = feedPet(p, pet.id);
    if (r.image) await sendPhoto(chatId, r.image, r.message, getPetKeyboard(p));
    else await bot.sendMessage(chatId, r.message, { parse_mode: 'Markdown', ...getPetKeyboard(p) });
});

bot.onText(/^🍖 غذا بده به همه$/, async (msg) => {
    const chatId = msg.chat.id; const p = player.getPlayer(chatId); if (!p) return;
    const r = feedAllPets(p);
    if (r.image) await sendPhoto(chatId, r.image, r.message, getPetKeyboard(p));
    else await bot.sendMessage(chatId, r.message, { parse_mode: 'Markdown', ...getPetKeyboard(p) });
});

bot.onText(/^💔 آزاد کن (.+)$/, async (msg, match) => {
    const chatId = msg.chat.id; const p = player.getPlayer(chatId); if (!p) return;
    const pet = p.pets?.find(pt => `${pt.emoji} ${pt.name}` === match[1].trim());
    if (!pet) return bot.sendMessage(chatId, '❌ حیوون پیدا نشد!', getPetKeyboard(p));
    await bot.sendMessage(chatId, releasePet(p, pet.id).message, { parse_mode: 'Markdown', ...getPetKeyboard(p) });
});
// ============ 👶 فرزندان ============
bot.onText(/^👶 فرزندان$/, async (msg) => {
    const chatId = msg.chat.id; const p = player.getPlayer(chatId);
    if (!p) return bot.sendMessage(chatId, '❌ /start بزن!', mainMenu());
    initChildren(p);
    const births = checkBirths(p);
    if (births.length > 0) {
        for (let child of births) {
            const birthImg = getBirthImage();
            if (birthImg) await sendPhoto(chatId, birthImg, `👶 *${child.name}* متولد شد! ${child.emoji}`, mainMenu());
            else await bot.sendMessage(chatId, `👶 *${child.name}* متولد شد! ${child.emoji}`, { parse_mode: 'Markdown' });
        }
    }
    await bot.sendMessage(chatId, formatChildren(p), { parse_mode: 'Markdown', ...getChildrenKeyboard(p) });
});

bot.onText(/^🍼 غذا بده به (.+)$/, async (msg, match) => {
    const chatId = msg.chat.id; const p = player.getPlayer(chatId); if (!p) return;
    const child = p.children?.find(c => `${c.emoji} ${c.name}` === match[1].trim() && c.isAlive);
    if (!child) return bot.sendMessage(chatId, '❌ فرزند پیدا نشد!', getChildrenKeyboard(p));
    const r = feedChild(p, child.id);
    if (r.image) await sendPhoto(chatId, r.image, r.message, getChildrenKeyboard(p));
    else await bot.sendMessage(chatId, r.message, { parse_mode: 'Markdown', ...getChildrenKeyboard(p) });
});

bot.onText(/^📚 آموزش بده به (.+)$/, async (msg, match) => {
    const chatId = msg.chat.id; const p = player.getPlayer(chatId); if (!p) return;
    const child = p.children?.find(c => `${c.emoji} ${c.name}` === match[1].trim() && c.isAlive);
    if (!child) return bot.sendMessage(chatId, '❌ فرزند پیدا نشد!', getChildrenKeyboard(p));
    const r = trainChild(p, child.id);
    if (r.image) await sendPhoto(chatId, r.image, r.message, getChildrenKeyboard(p));
    else await bot.sendMessage(chatId, r.message, { parse_mode: 'Markdown', ...getChildrenKeyboard(p) });
});

bot.onText(/^👑 ولیعهد کن (.+)$/, async (msg, match) => {
    const chatId = msg.chat.id; const p = player.getPlayer(chatId); if (!p) return;
    const child = p.children?.find(c => `${c.emoji} ${c.name}` === match[1].trim() && c.isAlive);
    if (!child) return bot.sendMessage(chatId, '❌ فرزند پیدا نشد!', getChildrenKeyboard(p));
    await bot.sendMessage(chatId, assignHeir(p, child.id).message, { parse_mode: 'Markdown', ...getChildrenKeyboard(p) });
});

bot.onText(/^⚔️ تورنمنت امپراطوری$/, async (msg) => {
    const chatId = msg.chat.id; const p = player.getPlayer(chatId); if (!p) return;
    await bot.sendMessage(chatId, holdTournament(p).message, { parse_mode: 'Markdown', ...getChildrenKeyboard(p) });
});

// ============ 🏰 زندان ============
bot.onText(/^🏰 زندان$/, async (msg) => {
    const chatId = msg.chat.id; const p = player.getPlayer(chatId);
    if (!p) return bot.sendMessage(chatId, '❌ /start بزن!', mainMenu());
    initPrison(p);
    for (let e of checkEscapes(p)) await bot.sendMessage(chatId, `🏃 ${e.emoji} *${e.name}* فرار کرد!`, { parse_mode: 'Markdown' });
    if (p.prison?.length > 0) {
        const buttons = p.prison.map(pr => [`🔒 ${pr.emoji} ${pr.name}`]); buttons.push(['🔙 برگشت']);
        await bot.sendMessage(chatId, formatPrison(p) + '\n\n👆 انتخاب کن:', { parse_mode: 'Markdown', reply_markup: { keyboard: buttons, resize_keyboard: true } });
    } else await bot.sendMessage(chatId, formatPrison(p), { parse_mode: 'Markdown', ...mainMenu() });
});

bot.onText(/^🔒 (.+)$/, async (msg, match) => {
    const chatId = msg.chat.id; const p = player.getPlayer(chatId); if (!p?.prison) return;
    const parts = match[1].split(' '); const emoji = parts[0]; const name = parts.slice(1).join(' ');
    const prisoner = p.prison.find(pr => pr.emoji === emoji && pr.name === name);
    if (!prisoner) return;
    const points = getRelationPoints(p, prisoner.npcId); const relation = getRelationLevel(points);
    const dialogue = getPrisonDialogue(prisoner.npcId, relation.level);
    activePrisoner[chatId] = prisoner.npcId;
    let img = null; const npc = getNpcConfig(prisoner.npcId);
    if (npc?.image) img = config.images.npcs?.[npc.image]?.file_id || config.images.enemies?.[npc.image]?.file_id;
    await sendPhoto(chatId, img, `${prisoner.emoji} *${prisoner.name}* | ${relation.name}\n\n${dialogue.text}`, getPrisonerKeyboard(p, prisoner.npcId));
});

// ============ عیاشی با انتخاب پوزیشن ============
bot.onText(/^🔥 عیاشی$/, async (msg) => { 
    const chatId = msg.chat.id; const p = player.getPlayer(chatId); 
    const npcId = activePrisoner[chatId] || activeHouseNpc[chatId] || activeHaremQueen[chatId]; 
    if (!p || !npcId) return;
    if (!p.gameDay) p.gameDay = 1;
    const npcData = config.images.npcs?.[npcId] || config.images.enemies?.[npcId];
    const haremQueen = p.harem?.queens?.find(q => q.npcId === npcId || q.id === npcId);
    const npcName = haremQueen?.name || npcData?.name || npcId;
    const npcEmoji = haremQueen?.emoji || npcData?.emoji || '👤';
    activePrisoner[chatId] = npcId; activeHouseNpc[chatId] = npcId; activeHaremQueen[chatId] = npcId;
    await bot.sendMessage(chatId, `${npcEmoji} *${npcName}*: "چجور می‌خوای بکنی منو؟ 😈"\n\n🎈 کاندوم: ${p.inventory?.condom || 0} عدد\n💕 رابطه: ${(p.prisonRelations && p.prisonRelations[npcId]) || 0}\n📅 روز ${p.gameDay}/۷`, {
        parse_mode: 'Markdown',
        reply_markup: { keyboard: [
            ['🔥 از جلو (بارداری قطعی)'], ['🍑 از پشت (رابطه +۳۰)'], ['👄 دهنی (رابطه +۱۰)'], ['🔙 برگشت']
        ], resize_keyboard: true }
    });
});

// ============ پوزیشن از جلو ============
bot.onText(/^🔥 از جلو/, async (msg) => {
    const chatId = msg.chat.id; const p = player.getPlayer(chatId);
    const npcId = activePrisoner[chatId] || activeHouseNpc[chatId] || activeHaremQueen[chatId];
    if (!p || !npcId) return;
    const isHouse = p.house?.find(h => h.npcId === npcId);
    const isHarem = p.harem?.queens?.find(q => q.npcId === npcId || q.id === npcId);
    const hasCondom = (p.inventory?.condom || 0) > 0;
    activePrisoner[chatId] = npcId; activeHouseNpc[chatId] = npcId; activeHaremQueen[chatId] = npcId;
    const npcData = config.images.npcs?.[npcId] || config.images.enemies?.[npcId];
    const npcName = isHarem?.name || npcData?.name || npcId;
    const npcEmoji = isHarem?.emoji || npcData?.emoji || '👤';
    
    if (hasCondom) {
        await bot.sendMessage(chatId, `${npcEmoji} *${npcName}*: "کاندوم داری؟ 🎈"\n\n🎈 کاندوم: ${p.inventory.condom} عدد`, {
            parse_mode: 'Markdown',
            reply_markup: { keyboard: [['🎈 آره کاندوم دارم'], ['❌ نه نمی‌خوام کاندوم بذارم'], ['🔙 برگشت']], resize_keyboard: true }
        });
        return;
    }
    
    const result = isHouse ? orgyInHouse(p, npcId) : (isHarem ? { message: '🔥 عیاشی در حرمسرا...' } : orgyPrisoner(p, npcId));
    const pregnancy = checkPregnancy(p, npcId, p.marry === npcId, 'front');
    let extraMsg = ''; let image = positionImages.front[Math.floor(Math.random() * positionImages.front.length)];
    if (pregnancy) { const pregImg = getPregnancyImage(); extraMsg = `\n\n🤰 *${npcEmoji} ${npcName}* باردار شد!\n⏰ ۳ روز تا تولد...`; if (pregImg) image = pregImg; }
    if (!player.prisonRelations) player.prisonRelations = {};
    player.prisonRelations[npcId] = (player.prisonRelations[npcId] || 0) + 15;
    if (isHarem) { isHarem.mood = Math.min(100, (isHarem.mood || 70) + 20); extraMsg += '\n😊 روحیه ملکه +۲۰'; }
    const dialogue = isHouse ? getHouseDialogue('orgy') : getPrisonDialogue(npcId, getRelationLevel(getRelationPoints(p, npcId)).level).text;
    await sendPhoto(chatId, image, `🔥 *از جلو...* ${result.message}${extraMsg}\n💕 رابطه +۱۵\n\n${dialogue}`, isHouse ? getHouseKeyboard(p, npcId) : getPrisonerKeyboard(p, npcId));
});

bot.onText(/^🎈 آره کاندوم دارم/, async (msg) => {
    const chatId = msg.chat.id; const p = player.getPlayer(chatId);
    const npcId = activePrisoner[chatId] || activeHouseNpc[chatId] || activeHaremQueen[chatId];
    if (!p || !npcId || (p.inventory?.condom || 0) < 1) return bot.sendMessage(chatId, '❌ کاندوم نداری!');
    p.inventory.condom--;
    const isHouse = p.house?.find(h => h.npcId === npcId);
    const isHarem = p.harem?.queens?.find(q => q.npcId === npcId || q.id === npcId);
    const result = isHouse ? orgyInHouse(p, npcId) : (isHarem ? { message: '🔥 عیاشی در حرمسرا...' } : orgyPrisoner(p, npcId));
    if (!player.prisonRelations) player.prisonRelations = {};
    player.prisonRelations[npcId] = (player.prisonRelations[npcId] || 0) + 20;
    const image = positionImages.front[Math.floor(Math.random() * positionImages.front.length)];
    const dialogue = isHouse ? getHouseDialogue('orgy') : getPrisonDialogue(npcId, getRelationLevel(getRelationPoints(p, npcId)).level).text;
    await sendPhoto(chatId, image, `🔥 *از جلو (با کاندوم)...* ${result.message}\n🎈 -۱ کاندوم\n💕 رابطه +۲۰\n🚫 بارداری: ۰٪\n\n${dialogue}`, isHouse ? getHouseKeyboard(p, npcId) : getPrisonerKeyboard(p, npcId));
});

bot.onText(/^❌ نه نمی‌خوام کاندوم بذارم/, async (msg) => {
    const chatId = msg.chat.id; const p = player.getPlayer(chatId);
    const npcId = activePrisoner[chatId] || activeHouseNpc[chatId] || activeHaremQueen[chatId];
    if (!p || !npcId) return;
    const isHouse = p.house?.find(h => h.npcId === npcId);
    const isHarem = p.harem?.queens?.find(q => q.npcId === npcId || q.id === npcId);
    const npcData = config.images.npcs?.[npcId] || config.images.enemies?.[npcId];
    const npcName = isHarem?.name || npcData?.name || npcId;
    const npcEmoji = isHarem?.emoji || npcData?.emoji || '👤';
    const result = isHouse ? orgyInHouse(p, npcId) : (isHarem ? { message: '🔥 عیاشی در حرمسرا...' } : orgyPrisoner(p, npcId));
    const pregnancy = checkPregnancy(p, npcId, p.marry === npcId, 'front');
    let extraMsg = ''; let image = positionImages.front[Math.floor(Math.random() * positionImages.front.length)];
    if (pregnancy) { const pregImg = getPregnancyImage(); extraMsg = `\n\n🤰 *${npcEmoji} ${npcName}* باردار شد!\n⏰ ۳ روز تا تولد...`; if (pregImg) image = pregImg; }
    if (!player.prisonRelations) player.prisonRelations = {};
    player.prisonRelations[npcId] = (player.prisonRelations[npcId] || 0) + 15;
    const dialogue = isHouse ? getHouseDialogue('orgy') : getPrisonDialogue(npcId, getRelationLevel(getRelationPoints(p, npcId)).level).text;
    await sendPhoto(chatId, image, `🔥 *از جلو (بدون کاندوم)...* ${result.message}${extraMsg}\n💕 رابطه +۱۵\n\n${dialogue}`, isHouse ? getHouseKeyboard(p, npcId) : getPrisonerKeyboard(p, npcId));
});

// ============ پوزیشن از پشت و دهنی ============
bot.onText(/^🍑 از پشت/, async (msg) => {
    const chatId = msg.chat.id; const p = player.getPlayer(chatId);
    const npcId = activePrisoner[chatId] || activeHouseNpc[chatId] || activeHaremQueen[chatId];
    if (!p || !npcId) return;
    const isHouse = p.house?.find(h => h.npcId === npcId);
    const isHarem = p.harem?.queens?.find(q => q.npcId === npcId || q.id === npcId);
    const result = isHouse ? orgyInHouse(p, npcId) : (isHarem ? { message: '🔥 عیاشی در حرمسرا...' } : orgyPrisoner(p, npcId));
    if (!player.prisonRelations) player.prisonRelations = {};
    player.prisonRelations[npcId] = (player.prisonRelations[npcId] || 0) + 30;
    const image = positionImages.back[Math.floor(Math.random() * positionImages.back.length)];
    const dialogue = isHouse ? getHouseDialogue('orgy') : getPrisonDialogue(npcId, getRelationLevel(getRelationPoints(p, npcId)).level).text;
    await sendPhoto(chatId, image, `🍑 *از پشت...* ${result.message}\n💕 رابطه +۳۰\n🚫 بارداری: ۰٪\n\n${dialogue}`, isHouse ? getHouseKeyboard(p, npcId) : getPrisonerKeyboard(p, npcId));
});

bot.onText(/^👄 دهنی/, async (msg) => {
    const chatId = msg.chat.id; const p = player.getPlayer(chatId);
    const npcId = activePrisoner[chatId] || activeHouseNpc[chatId] || activeHaremQueen[chatId];
    if (!p || !npcId) return;
    const isHouse = p.house?.find(h => h.npcId === npcId);
    const isHarem = p.harem?.queens?.find(q => q.npcId === npcId || q.id === npcId);
    const result = isHouse ? orgyInHouse(p, npcId) : (isHarem ? { message: '🔥 عیاشی در حرمسرا...' } : orgyPrisoner(p, npcId));
    if (!player.prisonRelations) player.prisonRelations = {};
    player.prisonRelations[npcId] = (player.prisonRelations[npcId] || 0) + 10;
    const dialogue = isHouse ? getHouseDialogue('orgy') : getPrisonDialogue(npcId, getRelationLevel(getRelationPoints(p, npcId)).level).text;
    await bot.sendMessage(chatId, `👄 *دهنی...* ${result.message}\n💕 رابطه +۱۰\n🚫 بارداری: ۰٪\n\n${dialogue}`, { parse_mode: 'Markdown', ...(isHouse ? getHouseKeyboard(p, npcId) : getPrisonerKeyboard(p, npcId)) });
});
bot.onText(/^🖐️ لمس کن$/, async (msg) => { 
    const chatId = msg.chat.id; const p = player.getPlayer(chatId); 
    const npcId = activePrisoner[chatId] || activeHouseNpc[chatId] || activeHaremQueen[chatId]; 
    if (!p || !npcId) return; 
    const isHouse = p.house?.find(h => h.npcId === npcId); 
    const isHarem = p.harem?.queens?.find(q => q.npcId === npcId || q.id === npcId);
    const result = isHouse ? touchInHouse(p, npcId) : touchPrisoner(p, npcId); 
    const dialogue = isHouse ? getHouseDialogue('touch') : getPrisonDialogue(npcId, getRelationLevel(getRelationPoints(p, npcId)).level).text; 
    if (result.animation) await sendAnimation(chatId, result.animation, result.message + '\n\n' + dialogue, isHouse ? getHouseKeyboard(p, npcId) : getPrisonerKeyboard(p, npcId)); 
    else await bot.sendMessage(chatId, result.message + '\n\n' + dialogue, { parse_mode: 'Markdown', ...(isHouse ? getHouseKeyboard(p, npcId) : getPrisonerKeyboard(p, npcId)) }); 
});

bot.onText(/^💋 ببوس$/, async (msg) => { 
    const chatId = msg.chat.id; const p = player.getPlayer(chatId); 
    const npcId = activePrisoner[chatId] || activeHouseNpc[chatId] || activeHaremQueen[chatId]; 
    if (!p || !npcId) return; 
    const isHouse = p.house?.find(h => h.npcId === npcId); 
    const result = isHouse ? kissInHouse(p, npcId) : kissPrisoner(p, npcId); 
    const dialogue = isHouse ? getHouseDialogue('kiss') : getPrisonDialogue(npcId, getRelationLevel(getRelationPoints(p, npcId)).level).text; 
    if (result.animation) await sendAnimation(chatId, result.animation, result.message + '\n\n' + dialogue, isHouse ? getHouseKeyboard(p, npcId) : getPrisonerKeyboard(p, npcId)); 
    else await bot.sendMessage(chatId, result.message + '\n\n' + dialogue, { parse_mode: 'Markdown', ...(isHouse ? getHouseKeyboard(p, npcId) : getPrisonerKeyboard(p, npcId)) }); 
});

bot.onText(/^🎵 آواز$/, async (msg) => { 
    const chatId = msg.chat.id; const p = player.getPlayer(chatId); 
    const npcId = activePrisoner[chatId] || activeHouseNpc[chatId] || activeHaremQueen[chatId]; 
    if (!p || !npcId || (p.inventory?.song||0)<1) return bot.sendMessage(chatId, '❌ آواز نداری!', mainMenu()); 
    p.inventory.song--; if (!p.prisonRelations) p.prisonRelations = {}; 
    p.prisonRelations[npcId] = (p.prisonRelations[npcId]||0) + 15; 
    const isHouse = p.house?.find(h => h.npcId === npcId); 
    const dialogue = isHouse ? getHouseDialogue('kiss') : getPrisonDialogue(npcId, getRelationLevel(getRelationPoints(p, npcId)).level).text; 
    bot.sendMessage(chatId, `🎵 *آواز جادویی!* +۱۵ رابطه\n\n${dialogue}`, { parse_mode: 'Markdown', ...(isHouse ? getHouseKeyboard(p, npcId) : getPrisonerKeyboard(p, npcId)) }); 
});

bot.onText(/^🧿 اشک$/, async (msg) => { 
    const chatId = msg.chat.id; const p = player.getPlayer(chatId); const npcId = activePrisoner[chatId]; 
    if (!p || !npcId || (p.inventory?.tear||0)<1) return bot.sendMessage(chatId, '❌ اشک نداری!', mainMenu()); 
    p.inventory.tear--; const prisoner = p.prison.find(pr => pr.npcId === npcId); 
    if (prisoner) { prisoner.daysUntilEscape += 5; bot.sendMessage(chatId, `🧿 *اشک استفاده شد!* +۵ روز زندان\n⏰ ${prisoner.daysUntilEscape} روز تا فرار`, { parse_mode: 'Markdown', ...getPrisonerKeyboard(p, npcId) }); } 
});

bot.onText(/^🩸 خون$/, async (msg) => { 
    const chatId = msg.chat.id; const p = player.getPlayer(chatId); if (!p || (p.inventory?.blood||0)<1) return bot.sendMessage(chatId, '❌ خون نداری!', mainMenu()); 
    p.inventory.blood--; p.hp = Math.min((p.maxHp||100), (p.hp||100)+50); 
    bot.sendMessage(chatId, `🩸 *خون استفاده شد!* +۵۰❤️\n❤️ ${p.hp}/${p.maxHp}`, { parse_mode: 'Markdown', ...mainMenu() }); 
});

bot.onText(/^🔓 آزاد کن$/, async (msg) => { 
    const chatId = msg.chat.id; const p = player.getPlayer(chatId); const npcId = activePrisoner[chatId]; 
    if (!p || !npcId) return; const result = releasePrisoner(p, npcId); delete activePrisoner[chatId]; 
    if (result.loyal) player.addScore(p, 50); 
    await bot.sendMessage(chatId, result.message, { parse_mode: 'Markdown', ...mainMenu() }); 
});

bot.onText(/^🏠 (.+)$/, async (msg, match) => {
    const chatId = msg.chat.id; const p = player.getPlayer(chatId); if (!p?.house) return;
    const parts = match[1].split(' '); const emoji = parts[0]; const name = parts.slice(1).join(' ');
    const houseNpc = p.house.find(h => h.emoji === emoji && h.name === name);
    if (!houseNpc) return;
    const points = getRelationPoints(p, houseNpc.npcId); const relation = getRelationLevel(points);
    activeHouseNpc[chatId] = houseNpc.npcId;
    await sendPhoto(chatId, null, `${houseNpc.emoji} *${houseNpc.name}* | ${relation.name}\n\n🏠 توی خونه‌ات`, getHouseKeyboard(p, houseNpc.npcId));
});

bot.onText(/^🚪 بیرون کن$/, async (msg) => { const chatId = msg.chat.id; const p = player.getPlayer(chatId); const npcId = activeHouseNpc[chatId]; if (!p || !npcId) return; const result = kickFromHouse(p, npcId); delete activeHouseNpc[chatId]; await bot.sendMessage(chatId, result.message, { parse_mode: 'Markdown', ...mainMenu() }); });
bot.onText(/^💍 خواستگاری$/, async (msg) => { const chatId = msg.chat.id; const p = player.getPlayer(chatId); const npcId = activeHouseNpc[chatId]; if (!p || !npcId) return; const result = propose(p, npcId); await bot.sendMessage(chatId, result.message, { parse_mode: 'Markdown', ...getHouseKeyboard(p, npcId) }); });
bot.onText(/^👰 عروسی$/, async (msg) => { const chatId = msg.chat.id; const p = player.getPlayer(chatId); const npcId = activeHouseNpc[chatId]; if (!p || !npcId) return; const result = marry(p, npcId); await bot.sendMessage(chatId, result.message, { parse_mode: 'Markdown', ...mainMenu() }); });

bot.onText(/^(🗡️|💋|🏃|🤝|🕯️|👂|💰|🕊️|💎|⚔️|❤️|👼|🎁|😘|🧪|😂|😐|🍖|🔮) (.+)$/, async (msg, match) => {
    const chatId = msg.chat.id; const p = player.getPlayer(chatId); const dialogue = activeDialogues[chatId];
    if (!p || !dialogue) return;
    const current = getDialogue(dialogue.npcId, dialogue.encounter); if (!current) return;
    const option = current.options.find(o => o.text.startsWith(match[1])); if (!option) return;
    const result = handleAction(p, dialogue.npcId, option.action);
    delete activeDialogues[chatId];
    if (result.battleStart) { const fr = startFight(p); if (fr.success) { activeBattles[chatId] = fr.enemy; await sendAnimation(chatId, fr.animation, result.message + '\n' + fr.message, getBattleKeyboard(p, fr.enemy)); } else await bot.sendMessage(chatId, fr.message, mainMenu()); }
    else await bot.sendMessage(chatId, result.message, { parse_mode: 'Markdown', ...mainMenu() });
});

// ============ 👑 امپراطوری ============
bot.onText(/^👑 امپراطوری$/, async (msg) => {
    const chatId = msg.chat.id; const p = player.getPlayer(chatId);
    if (!p) return bot.sendMessage(chatId, '❌ /start بزن!', mainMenu());
    if (p.level < 30 && (!p.empire || p.empire.level === 0)) return bot.sendMessage(chatId, '🔒 باید به سطح ۳۰ برسی!\n🎯 سطح فعلی: ' + p.level, { parse_mode: 'Markdown', ...mainMenu() });
    try { const { initEmpire } = require('./empire'); initEmpire(p); } catch (e) {}
    try { const { initPeople } = require('./people'); initPeople(p); } catch (e) {}
    try { const { initCourt } = require('./court'); initCourt(p); } catch (e) {}
    try { const { initHarem } = require('./queenHarem'); initHarem(p); } catch (e) {}
    initChildren(p);
    await bot.sendMessage(chatId, formatEmpire(p), { parse_mode: 'Markdown',
        reply_markup: { keyboard: [
            ['👸 حرمسرا', '👶 فرزندان و سلسله'],
            ['👥 مردم و رعایا', '💰 اقتصاد و مالیات'],
            ['🏛️ عجایب', '🐍 دربار و دسیسه'],
            ['🔙 برگشت']
        ], resize_keyboard: true }
    });
});
// ============ 👸 حرمسرا ============
bot.onText(/^👸 حرمسرا$/, async (msg) => {
    const chatId = msg.chat.id; const p = player.getPlayer(chatId);
    if (!p) return bot.sendMessage(chatId, '❌ /start بزن!', mainMenu());
    try { const { initHarem } = require('./queenHarem'); initHarem(p); } catch (e) {}
    await bot.sendMessage(chatId, formatHarem(p), { parse_mode: 'Markdown', ...getHaremKeyboard(p) });
});

bot.onText(/^👸 (.+) (.+)$/, async (msg, match) => {
    const chatId = msg.chat.id; const p = player.getPlayer(chatId);
    if (!p || !p.harem) return;
    const queenEmoji = match[1].trim();
    const queenName = match[2].trim();
    const queen = p.harem.queens.find(q => q.emoji === queenEmoji && q.name === queenName);
    if (!queen) return;
    activeHaremQueen[chatId] = queen.id;
    await bot.sendMessage(chatId, `👸 *${queen.emoji} ${queen.name}*\n👑 ${queen.rank}\n💕 رابطه: ${queen.points}\n😊 روحیه: ${queen.mood}%\n❤️ سلامت: ${queen.health}%`, 
        { parse_mode: 'Markdown', ...getHaremQueenKeyboard(p, queen.id) });
});

bot.onText(/^🤰 باردار شو$/, async (msg) => {
    const chatId = msg.chat.id; const p = player.getPlayer(chatId);
    const queenId = activeHaremQueen[chatId];
    if (!p || !queenId) return;
    await bot.sendMessage(chatId, '⏰ *انتخاب سرعت بارداری:*', { parse_mode: 'Markdown', ...getPregnancySpeedKeyboard() });
    haremState[chatId] = { action: 'startPregnancy', queenId };
});

bot.onText(/^⏰ (.+)$/, async (msg, match) => {
    const chatId = msg.chat.id; const p = player.getPlayer(chatId);
    if (!p || !haremState[chatId] || haremState[chatId].action !== 'startPregnancy') return;
    const speedName = match[1].trim();
    const { pregnancyTimes } = require('./queenHarem');
    let speedType = 'normal';
    for (let key in pregnancyTimes) { if (pregnancyTimes[key].name === speedName) { speedType = key; break; } }
    const result = startPregnancy(p, haremState[chatId].queenId, speedType);
    delete haremState[chatId];
    await bot.sendMessage(chatId, result.message, { parse_mode: 'Markdown', ...getHaremKeyboard(p) });
});

bot.onText(/^⚡ تسریع بارداری$/, async (msg) => {
    const chatId = msg.chat.id; const p = player.getPlayer(chatId);
    const queenId = activeHaremQueen[chatId];
    if (!p || !queenId) return;
    const queen = p.harem.queens.find(q => q.id === queenId);
    if (!queen) return;
    const pregnancy = queen.pregnancies.find(p => !p.born && Date.now() < p.dueDate);
    if (!pregnancy) return bot.sendMessage(chatId, '❌ بارداری فعالی نیست!', getHaremQueenKeyboard(p, queenId));
    await bot.sendMessage(chatId, '⚡ *انتخاب سرعت جدید:*', { parse_mode: 'Markdown', ...getPregnancySpeedKeyboard() });
    haremState[chatId] = { action: 'speedUp', queenId, pregnancyId: pregnancy.id };
});

bot.onText(/^💆 رسیدگی \((\d+)👑\)$/, async (msg) => {
    const chatId = msg.chat.id; const p = player.getPlayer(chatId);
    const queenId = activeHaremQueen[chatId];
    if (!p || !queenId) return;
    const result = queenCare(p, queenId);
    await bot.sendMessage(chatId, result.message, { parse_mode: 'Markdown', ...getHaremQueenKeyboard(p, queenId) });
});

bot.onText(/^💆 رسیدگی به همه$/, async (msg) => {
    const chatId = msg.chat.id; const p = player.getPlayer(chatId);
    if (!p) return;
    const result = careAllQueens(p);
    await bot.sendMessage(chatId, result.message, { parse_mode: 'Markdown', ...getHaremKeyboard(p) });
});

bot.onText(/^💰 پرداخت حقوق$/, async (msg) => {
    const chatId = msg.chat.id; const p = player.getPlayer(chatId);
    if (!p) return;
    const result = paySalaries(p);
    await bot.sendMessage(chatId, result.message, { parse_mode: 'Markdown', ...getHaremKeyboard(p) });
});

bot.onText(/^🎉 برگزاری جشن$/, async (msg) => {
    const chatId = msg.chat.id; const p = player.getPlayer(chatId);
    if (!p) return;
    await bot.sendMessage(chatId, '🎉 *انتخاب جشن:*', { parse_mode: 'Markdown', ...getCelebrationKeyboard() });
    haremState[chatId] = { action: 'celebrate' };
});

bot.onText(/^🎉 (.+) \((\d+)👑\)$/, async (msg, match) => {
    const chatId = msg.chat.id; const p = player.getPlayer(chatId);
    if (!p || !haremState[chatId] || haremState[chatId].action !== 'celebrate') return;
    const celebName = match[1].trim();
    const { celebrations } = require('./queenHarem');
    let celebType = null;
    for (let key in celebrations) { if (celebrations[key].emoji + ' ' + celebrations[key].name === celebName) { celebType = key; break; } }
    if (!celebType) return;
    const result = celebrateFestival(p, celebType);
    delete haremState[chatId];
    await bot.sendMessage(chatId, result.message, { parse_mode: 'Markdown', ...getHaremKeyboard(p) });
});

bot.onText(/^👗 خرید لباس و جواهر$/, async (msg) => {
    const chatId = msg.chat.id; const p = player.getPlayer(chatId);
    if (!p) return;
    await bot.sendMessage(chatId, '👗 *انتخاب دسته‌بندی:*', {
        parse_mode: 'Markdown',
        reply_markup: { keyboard: [['👗 لباس'], ['💍 جواهرات'], ['🔙 برگشت']], resize_keyboard: true }
    });
    haremState[chatId] = { action: 'shopCategory' };
});

bot.onText(/^👗 لباس$/, async (msg) => {
    const chatId = msg.chat.id; const p = player.getPlayer(chatId);
    if (!p || !haremState[chatId]) return;
    await bot.sendMessage(chatId, '👗 *انتخاب لباس:*', { parse_mode: 'Markdown', ...getDressKeyboard() });
    haremState[chatId] = { action: 'buyDress' };
});

bot.onText(/^👗 (.+) \((\d+)👑\)$/, async (msg, match) => {
    const chatId = msg.chat.id; const p = player.getPlayer(chatId);
    if (!p || !haremState[chatId] || haremState[chatId].action !== 'buyDress') return;
    const dressName = match[1].trim();
    const { dresses } = require('./queenHarem');
    let dressType = null;
    for (let key in dresses) { if (dresses[key].emoji + ' ' + dresses[key].name === dressName) { dressType = key; break; } }
    if (!dressType) return;
    const queenId = activeHaremQueen[chatId];
    if (!queenId) { await bot.sendMessage(chatId, '❌ اول یه ملکه انتخاب کن!', getHaremKeyboard(p)); delete haremState[chatId]; return; }
    const result = buyDress(p, queenId, dressType);
    delete haremState[chatId];
    await bot.sendMessage(chatId, result.message, { parse_mode: 'Markdown', ...getHaremQueenKeyboard(p, queenId) });
});

bot.onText(/^💍 جواهرات$/, async (msg) => {
    const chatId = msg.chat.id; const p = player.getPlayer(chatId);
    if (!p || !haremState[chatId]) return;
    await bot.sendMessage(chatId, '💍 *انتخاب جواهر:*', { parse_mode: 'Markdown', ...getHaremJewelryKeyboard() });
    haremState[chatId] = { action: 'buyJewelry' };
});

bot.onText(/^💍 (.+) \((\d+)👑\)$/, async (msg, match) => {
    const chatId = msg.chat.id; const p = player.getPlayer(chatId);
    if (!p || !haremState[chatId] || haremState[chatId].action !== 'buyJewelry') return;
    const jewelName = match[1].trim();
    const { jewelry } = require('./queenHarem');
    let jewelType = null;
    for (let key in jewelry) { if (jewelry[key].emoji + ' ' + jewelry[key].name === jewelName) { jewelType = key; break; } }
    if (!jewelType) return;
    const queenId = activeHaremQueen[chatId];
    if (!queenId) { await bot.sendMessage(chatId, '❌ اول یه ملکه انتخاب کن!', getHaremKeyboard(p)); delete haremState[chatId]; return; }
    const result = buyJewelry(p, queenId, jewelType);
    delete haremState[chatId];
    await bot.sendMessage(chatId, result.message, { parse_mode: 'Markdown', ...getHaremQueenKeyboard(p, queenId) });
});

bot.onText(/^🏠 ارتقای اتاق$/, async (msg) => {
    const chatId = msg.chat.id; const p = player.getPlayer(chatId);
    if (!p) return;
    await bot.sendMessage(chatId, '🏠 *انتخاب اتاق:*', { parse_mode: 'Markdown', ...getRoomKeyboard() });
    haremState[chatId] = { action: 'upgradeRoom' };
});

bot.onText(/^🏠 (.+) \((\d+)👑\)$/, async (msg, match) => {
    const chatId = msg.chat.id; const p = player.getPlayer(chatId);
    if (!p || !haremState[chatId] || haremState[chatId].action !== 'upgradeRoom') return;
    const roomName = match[1].trim();
    const { rooms } = require('./queenHarem');
    let roomType = null;
    for (let key in rooms) { if (rooms[key].emoji + ' ' + rooms[key].name === roomName) { roomType = key; break; } }
    if (!roomType) return;
    const queenId = activeHaremQueen[chatId];
    if (!queenId) { await bot.sendMessage(chatId, '❌ اول یه ملکه انتخاب کن!', getHaremKeyboard(p)); delete haremState[chatId]; return; }
    const result = upgradeRoom(p, queenId, roomType);
    delete haremState[chatId];
    await bot.sendMessage(chatId, result.message, { parse_mode: 'Markdown', ...getHaremQueenKeyboard(p, queenId) });
});

bot.onText(/^🧹 استخدام خدمتکار$/, async (msg) => {
    const chatId = msg.chat.id; const p = player.getPlayer(chatId);
    if (!p) return;
    await bot.sendMessage(chatId, '🧹 *انتخاب خدمتکار:*', { parse_mode: 'Markdown', ...getServantKeyboard() });
    haremState[chatId] = { action: 'hireServant' };
});

bot.onText(/^🧹 (.+) \((\d+)👑\/ماه\)$/, async (msg, match) => {
    const chatId = msg.chat.id; const p = player.getPlayer(chatId);
    if (!p || !haremState[chatId] || haremState[chatId].action !== 'hireServant') return;
    const servantName = match[1].trim();
    const { servants } = require('./queenHarem');
    let servantType = null;
    for (let key in servants) { if (servants[key].emoji + ' ' + servants[key].name === servantName) { servantType = key; break; } }
    if (!servantType) return;
    const queenId = activeHaremQueen[chatId];
    if (!queenId) { await bot.sendMessage(chatId, '❌ اول یه ملکه انتخاب کن!', getHaremKeyboard(p)); delete haremState[chatId]; return; }
    const result = hireServant(p, queenId, servantType);
    delete haremState[chatId];
    await bot.sendMessage(chatId, result.message, { parse_mode: 'Markdown', ...getHaremQueenKeyboard(p, queenId) });
});

bot.onText(/^📚 سبک تربیت بچه$/, async (msg) => {
    const chatId = msg.chat.id; const p = player.getPlayer(chatId);
    if (!p) return;
    await bot.sendMessage(chatId, '📚 *انتخاب سبک تربیت:*', { parse_mode: 'Markdown', ...getUpbringingKeyboard() });
    haremState[chatId] = { action: 'upbringing' };
});

bot.onText(/^📚 (.+)$/, async (msg, match) => {
    const chatId = msg.chat.id; const p = player.getPlayer(chatId);
    if (!p || !haremState[chatId] || haremState[chatId].action !== 'upbringing') return;
    const upbringingName = match[1].trim();
    const { childUpbringing } = require('./queenHarem');
    let upbringingType = null;
    for (let key in childUpbringing) { if (childUpbringing[key].emoji + ' ' + childUpbringing[key].name === upbringingName) { upbringingType = key; break; } }
    if (!upbringingType) return;
    const queenId = activeHaremQueen[chatId];
    if (!queenId) { await bot.sendMessage(chatId, '❌ اول یه ملکه انتخاب کن!', getHaremKeyboard(p)); delete haremState[chatId]; return; }
    const result = setChildUpbringing(p, queenId, upbringingType);
    delete haremState[chatId];
    await bot.sendMessage(chatId, result.message, { parse_mode: 'Markdown', ...getHaremQueenKeyboard(p, queenId) });
});

bot.onText(/^🚪 اخراج از حرمسرا$/, async (msg) => {
    const chatId = msg.chat.id; const p = player.getPlayer(chatId);
    const queenId = activeHaremQueen[chatId];
    if (!p || !queenId) return;
    const result = removeQueenFromHarem(p, queenId);
    delete activeHaremQueen[chatId];
    await bot.sendMessage(chatId, result.message, { parse_mode: 'Markdown', ...getHaremKeyboard(p) });
});
// ============ 👥 مردم ============
bot.onText(/^👥 مردم و رعایا$/, async (msg) => {
    const chatId = msg.chat.id; const p = player.getPlayer(chatId); if (!p) return;
    try { const { initPeople } = require('./people'); initPeople(p); } catch (e) {}
    await bot.sendMessage(chatId, formatPeople(p), { parse_mode: 'Markdown', ...getPeopleKeyboard(p) });
});

bot.onText(/^🌾 مدیریت زمین‌ها$/, async (msg) => {
    const chatId = msg.chat.id; const p = player.getPlayer(chatId); if (!p) return;
    await bot.sendMessage(chatId, '🌾 *زمین‌های کشاورزی*\n\nیک نوع زمین انتخاب کن:', { parse_mode: 'Markdown', ...getLandKeyboard() });
    peopleState[chatId] = { action: 'selectLand' };
});

bot.onText(/^🌾 (.+) \((\d+)👑\)$/, async (msg, match) => {
    const chatId = msg.chat.id; const p = player.getPlayer(chatId);
    if (!p || !peopleState[chatId] || peopleState[chatId].action !== 'selectLand') return;
    const landInfo = match[1].trim(); const { landTypes } = require('./people'); let landType = null;
    for (let key in landTypes) { if (landInfo.includes(landTypes[key].emoji) && landInfo.includes(landTypes[key].name)) { landType = key; break; } }
    if (!landType) return bot.sendMessage(chatId, '❌ زمین نامعتبر!', getPeopleKeyboard(p));
    const result = assignLand(p, landType, 1); delete peopleState[chatId];
    await bot.sendMessage(chatId, result.message, { parse_mode: 'Markdown', ...getPeopleKeyboard(p) });
});

bot.onText(/^💧 آبیاری همه زمین‌ها$/, async (msg) => {
    const chatId = msg.chat.id; const p = player.getPlayer(chatId); if (!p) return;
    if (!p.people || !p.people.lands || p.people.lands.length === 0) return bot.sendMessage(chatId, '❌ هیچ زمینی نداری!', getPeopleKeyboard(p));
    for (let land of p.people.lands) { waterLand(p, land.id); }
    await bot.sendMessage(chatId, '✅ همه زمین‌ها آبیاری شدن! 💧', getPeopleKeyboard(p));
});

bot.onText(/^🌾 برداشت همه زمین‌ها$/, async (msg) => {
    const chatId = msg.chat.id; const p = player.getPlayer(chatId); if (!p) return;
    const result = harvestAllLands(p);
    await bot.sendMessage(chatId, result.message, { parse_mode: 'Markdown', ...getPeopleKeyboard(p) });
});

bot.onText(/^🏗️ ساخت ساختمان$/, async (msg) => {
    const chatId = msg.chat.id; const p = player.getPlayer(chatId); if (!p) return;
    await bot.sendMessage(chatId, '🏗️ *ساختمان‌های عمومی*\n\nیک ساختمان انتخاب کن:', { parse_mode: 'Markdown', ...getBuildingKeyboard() });
    peopleState[chatId] = { action: 'selectBuilding' };
});

bot.onText(/^🏗️ (.+)$/, async (msg, match) => {
    const chatId = msg.chat.id; const p = player.getPlayer(chatId);
    if (!p || !peopleState[chatId] || peopleState[chatId].action !== 'selectBuilding') return;
    const buildingInfo = match[1].trim(); const { buildings } = require('./people'); let buildingKey = null;
    for (let key in buildings) { if (buildingInfo.includes(buildings[key].emoji) && buildingInfo.includes(buildings[key].name)) { buildingKey = key; break; } }
    if (!buildingKey) return;
    const result = buildPublicBuilding(p, buildingKey); delete peopleState[chatId];
    await bot.sendMessage(chatId, result.message, { parse_mode: 'Markdown', ...getPeopleKeyboard(p) });
});

bot.onText(/^💰 اقتصاد و مالیات$/, async (msg) => {
    const chatId = msg.chat.id; const p = player.getPlayer(chatId); if (!p) return;
    const result = collectTaxes(p);
    await bot.sendMessage(chatId, result.message, { parse_mode: 'Markdown', ...getPeopleKeyboard(p) });
});

// ============ 🏛️ عجایب ============
bot.onText(/^🏛️ عجایب$/, async (msg) => {
    const chatId = msg.chat.id; const p = player.getPlayer(chatId); if (!p) return;
    const { wonders } = require('./empire');
    let msg2 = '🏛️ *عجایب باستانی*\n\n';
    for (let key in wonders) {
        const w = wonders[key]; const built = p.empire?.wonders?.includes(key);
        msg2 += `${built ? '✅' : '⬜'} ${w.emoji} *${w.name}*\n   📝 ${w.description}\n   🏗️ مواد: `;
        for (let item in w.cost) { msg2 += `${w.cost[item]} ${item}, `; }
        msg2 = msg2.slice(0, -2) + '\n\n';
    }
    const buttons = [];
    for (let key in wonders) { if (!p.empire?.wonders?.includes(key)) { buttons.push([`🏗️ ساخت ${wonders[key].emoji} ${wonders[key].name}`]); } }
    buttons.push(['🔙 برگشت']);
    await bot.sendMessage(chatId, msg2, { parse_mode: 'Markdown', reply_markup: { keyboard: buttons, resize_keyboard: true } });
    empireState[chatId] = { action: 'buildWonder' };
});

bot.onText(/^🏗️ ساخت (.+) (.+)$/, async (msg, match) => {
    const chatId = msg.chat.id; const p = player.getPlayer(chatId);
    if (!p || !empireState[chatId] || empireState[chatId].action !== 'buildWonder') return;
    const wonderName = match[2].trim(); const { wonders } = require('./empire'); let wonderKey = null;
    for (let key in wonders) { if (wonders[key].name === wonderName) { wonderKey = key; break; } }
    if (!wonderKey) return;
    const result = buildWonder(p, wonderKey); delete empireState[chatId];
    await bot.sendMessage(chatId, result.message, { parse_mode: 'Markdown', ...getEmpireKeyboard(p) });
});

// ============ 🐍 دربار ============
bot.onText(/^🐍 دربار و دسیسه$/, async (msg) => {
    const chatId = msg.chat.id; const p = player.getPlayer(chatId); if (!p) return;
    try { const { initCourt } = require('./court'); initCourt(p); } catch (e) {}
    await bot.sendMessage(chatId, formatCourt(p), { parse_mode: 'Markdown', ...getCourtKeyboard(p) });
});

bot.onText(/^🐍 انجام دسیسه$/, async (msg) => {
    const chatId = msg.chat.id; const p = player.getPlayer(chatId); if (!p) return;
    await bot.sendMessage(chatId, '🐍 *دسیسه‌های درباری*\n\nیک نوع دسیسه انتخاب کن:', { parse_mode: 'Markdown', ...getIntrigueKeyboard(p) });
    courtState[chatId] = { action: 'selectIntrigue' };
});

// ============ 🔙 برگشت ============
bot.onText(/^🔙 برگشت$/, (msg) => {
    const chatId = msg.chat.id;
    if (pvpSearching[chatId]) { clearTimeout(pvpSearching[chatId]); delete pvpSearching[chatId]; }
    delete activeBattles[chatId]; delete activeDialogues[chatId]; delete activePrisoner[chatId]; delete activeHouseNpc[chatId]; 
    delete adminState[chatId]; delete wishState[chatId]; delete empireState[chatId]; delete peopleState[chatId]; 
    delete courtState[chatId]; delete haremState[chatId]; delete chamberState[chatId]; delete activeHaremQueen[chatId];
    const p = player.getPlayer(chatId); if (p) cancelShop(p);
    bot.sendMessage(chatId, '🏛️ *منوی اصلی*', { parse_mode: 'Markdown', ...mainMenu() });
});

bot.onText(/^🔙 بازار$/, (msg) => {
    const chatId = msg.chat.id; const p = player.getPlayer(chatId);
    if (!p || p.location !== 'village') return bot.sendMessage(chatId, '🏪 فقط تو روستا!', mainMenu());
    p.chatId = chatId; cancelShop(p);
    bot.sendMessage(chatId, `${showShopMenu()}\n\n👑 ${p.inventory?.gold||0}`, { 
        parse_mode: 'Markdown', 
        reply_markup: { keyboard: [
            ['🪵 خرید چوب', '🪨 خرید سنگ'], ['🍖 خرید گوشت', '💧 خرید آب'], 
            ['🦴 خرید پوست', '⛏️ خرید آهن'], ['💀 خرید فنیشر', '⚡ خرید انرژی'], 
            ['💎 فروش الماس', '📤 فروش'], ['📦 صندوقچه گنج', '🕶️ بازار مکاره'], ['🔙 برگشت']
        ], resize_keyboard: true } 
    });
});
// ============ message handler ============
bot.on('message', (msg) => {
    const chatId = msg.chat.id;
    const text = msg.text;
    if (!text || text.startsWith('/')) return;

    if (isAdmin(chatId)) {
        const p = player.getPlayer(chatId);
        if (!p) return;
        p.chatId = chatId;

        if (adminState[chatId] && adminState[chatId].step === 'amount') {
            const amount = parseInt(text);
            if (isNaN(amount) || amount <= 0) { bot.sendMessage(chatId, '❌ یه عدد معتبر وارد کن!', mainMenu()); return; }
            const state = adminState[chatId];
            const target = player.getPlayer(state.targetId);
            if (!target) { delete adminState[chatId]; bot.sendMessage(chatId, '❌ کاربر دیگه آنلاین نیست!', mainMenu()); return; }
            target.inventory[state.item] = (target.inventory[state.item] || 0) + amount;
            bot.sendMessage(chatId, `🎁 *هدیه فرستاده شد!*\n👤 ${target.name}\n🎒 ${state.item}: +${amount}`, { parse_mode: 'Markdown', ...mainMenu() });
            delete adminState[chatId];
            return;
        }

        const args = text.split(' ');
        const cmd = args.shift().toLowerCase();
        if ((cmd === 'کمک' || cmd === 'اهدای' || cmd === 'اهدا' || cmd === 'gift') && args[0] === 'به') {
            const targetId = parseInt(args[1]);
            if (!targetId || !player.getPlayer(targetId)) { bot.sendMessage(chatId, '❌ کاربر پیدا نشد!', mainMenu()); return; }
            adminState[chatId] = { step: 'item', targetId: targetId };
            bot.sendMessage(chatId, `🎁 *هدیه به ${player.getPlayer(targetId).name}*\n\n📋 یه آیتم انتخاب کن:`, {
                parse_mode: 'Markdown',
                reply_markup: { keyboard: [['👑 طلا', '💍 حلقه', '💎 الماس'], ['📜 طلسم', '🎵 آواز', '🩸 خون'], ['🔮 آرزو', '🗝️ کلید', '🧿 اشک'], ['💀 فنیشر', '🪵 چوب', '🪨 سنگ'], ['🍖 گوشت', '💧 آب', '🦴 پوست'], ['⛏️ آهن', '🔙 لغو']], resize_keyboard: true }
            });
            return;
        }

        const adminCommands = ['gold','g','xp','exp','score','sc','heal','hp','item','give','attack','atk','defense','def','level','lvl','energy','en','day','setday','nextday','nd','resetday','rd','condom','cd','unlock','unlockall','max','maxall','god','godmode','pet','addpet','removepet','delpet','petfood','feedpet','box','addbox','openbox','unbox','boxes','myboxes','quest','newquest','completequest','finishquest','child','addchild','heir','setheir','killchild','deadchild','tournament','tour','pregnant','makepregnant','birth','givebirth','addqueen','empirelevel','setempire','dynasty','setdynasty','income','collectincome','wonder','addwonder','population','pop','food','addfood','water','addwater','building','addbuilding','stats','setstats','blackmarket','bm','prison','prisonall','gift','sendgift','info','whois','users','count','top','top10','resetuser','ru','ban','unban','announce','ann','save','reset','help','addnpc','addprison','addhouse','addhome','removenpc','removeprison','removehouse','removehome','setrelation','setrel','marrynow','forcemarry','promotequeen','اهدای','اهدا','اطلاعات','کاربران','برترین‌ها','ذخیره','ریست','ریست کن','کمک'];

        if (adminCommands.includes(cmd)) {
            const result = adminCommand(p, cmd, args);
            if (result.announceAll && result.announce) {
                const announceMsg = `📢 *اعلان ادمین:*\n\n${result.announce}`;
                for (let id in player.players) { try { bot.sendMessage(id, announceMsg, { parse_mode: 'Markdown' }); } catch (e) {} }
                bot.sendMessage(chatId, `✅ پیام به همه ارسال شد!\n\n${announceMsg}`, { parse_mode: 'Markdown', ...mainMenu() });
                return;
            }
            bot.sendMessage(chatId, result.message, { parse_mode: 'Markdown', ...mainMenu() });
            return;
        }
        return;
    }

    const prefixes = ['🪵','🪨','🍖','💧','🦴','⛏️','📤','🏪','💎','💀','🔙','👤','🌿','🗺️','⚔️','🔨','📜','⚡','✅','❌','📊','🏰','🏠','🔒','🖐️','💋','🔥','🔓','🏃','💍','👰','🚪','🎵','🧿','🩸','🔮','🐾','🍼','📦','🎁','👶','👑','💰','🕶️','🛒','🤝','📚','🌾','🏗️','🐍','📋','🏛️','📝','👥','⚖️','🙏','🎉','🍞','🧙','🛡️','🏹','🗡️','🍑','👄','🎈','❌','👸','👩','👦','🎲','🍷','🗡️','💊','🛏️','🧹','⏰','💍','👗','🤰','💆','🚪'];
    for (let prefix of prefixes) { if (text.startsWith(prefix)) return; }

    const p = player.getPlayer(chatId);
    if (!p) return;
    p.chatId = chatId;
    const state = getShopState(p);
    if (!state) return;
    const result = processAmount(p, text);
    if (result.message) bot.sendMessage(chatId, result.message, { parse_mode: 'Markdown', ...mainMenu() });
});

bot.on('polling_error', (e) => console.log('Polling error:', e.message));
console.log('✅ ربات بقای باستانی - نسخه نهایی کامل با مخفی‌گاه و حرمسرا آماده شد! 🎉👑🔥');