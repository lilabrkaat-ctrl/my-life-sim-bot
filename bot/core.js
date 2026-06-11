const TelegramBot = require('node-telegram-bot-api');
const token = process.env.BOT_TOKEN;
const bot = new TelegramBot(token, { polling: true });

const player = require('../player');
const { savePlayers, autoSave, setBot, loadFromChannel } = require('../storage');
const { getTimeOfDay } = require('../player');

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

const config = require('../config');
const { isAdmin, isBanned, adminCommand } = require('../admin');

const activeDialogues = {};
const activePrisoner = {};
const activeHouseNpc = {};
const activeHaremQueen = {};
const pvpSearching = {};
const adminState = {};
const wishState = {};
const empireState = {};
const peopleState = {};
const courtState = {};
const haremState = {};
const chamberState = {};
const activeBattles = {};

const positionImages = {
    front: ['AgACAgQAAxkBAAEqchJqKYNBg0zmZiROMcoy2bB_M3tjwgACPA9rG9N3UVHZwwE7RKj3YQEAAwIAA3gAAzsE'],
    back: ['AgACAgQAAxkBAAEqchZqKYNBnFb9YWyq8mErc6qZmxEM7QACQA9rG9N3UVEFrz_O5eTc3QEAAwIAA3gAAzsE']
};

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

module.exports = {
    bot, player, config,
    isAdmin, isBanned, adminCommand,
    activeDialogues, activePrisoner, activeHouseNpc, activeHaremQueen,
    pvpSearching, adminState, wishState, empireState, peopleState, courtState, haremState, chamberState,
    activeBattles,
    positionImages,
    mainMenu, locationMenu, sendAnimation, sendPhoto
};