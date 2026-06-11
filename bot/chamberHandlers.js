const { bot, player, mainMenu, sendPhoto, chamberState } = require('./core');
const { formatSecretChamber, getSecretChamberKeyboard, getChamberRoomKeyboard, visitGirl, visitBoy, doActivity } = require('../secretChamber');

function setupChamberHandlers() {
    bot.onText(/^🔞 مخفی‌گاه$/, async (msg) => {
        const chatId = msg.chat.id; const p = player.getPlayer(chatId);
        if (!p) return bot.sendMessage(chatId, '❌ /start بزن!', mainMenu());
        if (p.level < 30 && (!p.empire || p.empire.level === 0)) return bot.sendMessage(chatId, '🔒 باید سطح ۳۰ باشی!', mainMenu());
        try { const { initSecretChamber } = require('../secretChamber'); initSecretChamber(p); } catch (e) {}
        await bot.sendMessage(chatId, formatSecretChamber(p), { parse_mode: 'Markdown', ...getSecretChamberKeyboard(p) });
    });

    bot.onText(/^👩 (.+?) \((\d+)👑\)$/, async (msg, match) => {
        const chatId = msg.chat.id; const p = player.getPlayer(chatId);
        if (!p) return;
        const { secretGirls } = require('../secretChamber');
        const info = match[1].trim();
        let girl = null;
        for (let g of secretGirls) { if (info.includes(g.emoji) && info.includes(g.name)) { girl = g; break; } }
        if (!girl) return;
        chamberState[chatId] = { action: 'visitGirl', girlId: girl.id };
        await bot.sendMessage(chatId, `🏠 *انتخاب اتاق:*`, { parse_mode: 'Markdown', ...getChamberRoomKeyboard() });
    });

    bot.onText(/^👦 (.+?) \((\d+)👑\)$/, async (msg, match) => {
        const chatId = msg.chat.id; const p = player.getPlayer(chatId);
        if (!p) return;
        const { secretBoys } = require('../secretChamber');
        const info = match[1].trim();
        let boy = null;
        for (let b of secretBoys) { if (info.includes(b.emoji) && info.includes(b.name)) { boy = b; break; } }
        if (!boy) return;
        chamberState[chatId] = { action: 'visitBoy', boyId: boy.id };
        await bot.sendMessage(chatId, `🏠 *انتخاب اتاق:*`, { parse_mode: 'Markdown', ...getChamberRoomKeyboard() });
    });

    bot.onText(/^🛏️ (.+?) \((\d+)👑\) - (.+)$/, async (msg, match) => {
        const chatId = msg.chat.id; const p = player.getPlayer(chatId);
        if (!p || !chamberState[chatId]) return;
        const roomName = match[1].trim();
        let roomType = 'normal';
        if (roomName.includes('VIP') || roomName.includes('ویژه')) roomType = 'vip';
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

    const activityHandlers = {
        '🎲 قمار': 'gambling',
        '🍷 میخانه': 'drinking',
        '🎵 موسیقی': 'music',
        '🔮 فال‌گیری': 'fortune',
        '🗡️ مبارزه': 'fighting',
        '💊 تریاک': 'opium'
    };

    for (let [key, type] of Object.entries(activityHandlers)) {
        bot.onText(new RegExp(`^${key} \\((\\d+)👑\\)$`), async (msg, match) => {
            const chatId = msg.chat.id; const p = player.getPlayer(chatId);
            if (!p) return;
            const r = doActivity(p, type);
            await bot.sendMessage(chatId, r.message, { parse_mode: 'Markdown', ...getSecretChamberKeyboard(p) });
        });
    }
}

module.exports = { setupChamberHandlers };