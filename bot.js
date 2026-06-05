const TelegramBot = require('node-telegram-bot-api');
const token = process.env.BOT_TOKEN || 'YOUR_BOT_TOKEN_HERE_PLACEHOLDER';
const bot = new TelegramBot(token, { polling: true });

const player = require('./player');
const { gather } = require('./gather');
const { travel, showTravelMenu } = require('./travel');
const { showCraftMenu, craftItem } = require('./craft');
const { fight } = require('./fight');
const { showShopMenu, buyItem, sellItem } = require('./shop');

// /start
bot.onText(/\/start/, (msg) => {
    const chatId = msg.chat.id;
    
    if (!player.getPlayer(chatId)) {
        player.createPlayer(chatId);
    }

    const welcome = `
🏛️ *به دنیای بقای باستانی خوش آمدی!*

📋 *دستورات:*
/status - وضعیت خودت
/gather - جمع‌آوری منابع
/map - نقشه سفر
/craft - ساخت‌وساز
/fight - نبرد
/shop - بازار

⚔️ زنده بمون، قهرمان!
    `;
    
    bot.sendMessage(chatId, welcome, { parse_mode: 'Markdown' });
});

// /status
bot.onText(/\/status/, (msg) => {
    const chatId = msg.chat.id;
    const p = player.getPlayer(chatId);
    
    if (!p) return bot.sendMessage(chatId, 'اول /start بزن!');
    
    bot.sendMessage(chatId, player.formatStatus(p), { parse_mode: 'Markdown' });
});

// /gather
bot.onText(/\/gather/, (msg) => {
    const chatId = msg.chat.id;
    const p = player.getPlayer(chatId);
    
    if (!p) return bot.sendMessage(chatId, 'اول /start بزن!');
    
    const result = gather(p);
    bot.sendMessage(chatId, result.message);
});

// /map
bot.onText(/\/map/, (msg) => {
    const chatId = msg.chat.id;
    const p = player.getPlayer(chatId);
    
    if (!p) return bot.sendMessage(chatId, 'اول /start بزن!');
    
    bot.sendMessage(chatId, showTravelMenu(), { parse_mode: 'Markdown' });
});

// /travel_[location]
bot.onText(/\/travel_(.+)/, (msg, match) => {
    const chatId = msg.chat.id;
    const p = player.getPlayer(chatId);
    
    if (!p) return bot.sendMessage(chatId, 'اول /start بزن!');
    
    const result = travel(p, match[1]);
    bot.sendMessage(chatId, result.message);
});

// /craft
bot.onText(/\/craft$/, (msg) => {
    const chatId = msg.chat.id;
    const p = player.getPlayer(chatId);
    
    if (!p) return bot.sendMessage(chatId, 'اول /start بزن!');
    
    bot.sendMessage(chatId, showCraftMenu(), { parse_mode: 'Markdown' });
});

// /make [item]
bot.onText(/\/make (.+)/, (msg, match) => {
    const chatId = msg.chat.id;
    const p = player.getPlayer(chatId);
    
    if (!p) return bot.sendMessage(chatId, 'اول /start بزن!');
    
    const result = craftItem(p, match[1]);
    bot.sendMessage(chatId, result.message, { parse_mode: 'Markdown' });
});

// /fight
bot.onText(/\/fight/, (msg) => {
    const chatId = msg.chat.id;
    const p = player.getPlayer(chatId);
    
    if (!p) return bot.sendMessage(chatId, 'اول /start بزن!');
    
    const result = fight(p);
    bot.sendMessage(chatId, result.message, { parse_mode: 'Markdown' });
});

// /shop
bot.onText(/\/shop$/, (msg) => {
    const chatId = msg.chat.id;
    const p = player.getPlayer(chatId);
    
    if (!p) return bot.sendMessage(chatId, 'اول /start بزن!');
    
    if (p.location !== 'village') {
        return bot.sendMessage(chatId, '🏪 بازار فقط توی روستای باستانیه! /travel_village');
    }
    
    bot.sendMessage(chatId, showShopMenu(), { parse_mode: 'Markdown' });
});

// /buy_[item]
bot.onText(/\/buy_(.+)/, (msg, match) => {
    const chatId = msg.chat.id;
    const p = player.getPlayer(chatId);
    
    if (!p) return bot.sendMessage(chatId, 'اول /start بزن!');
    
    const result = buyItem(p, match[1]);
    bot.sendMessage(chatId, result.message);
});

// /sell_[item]
bot.onText(/\/sell_(.+)/, (msg, match) => {
    const chatId = msg.chat.id;
    const p = player.getPlayer(chatId);
    
    if (!p) return bot.sendMessage(chatId, 'اول /start بزن!');
    
    const result = sellItem(p, match[1]);
    bot.sendMessage(chatId, result.message);
});

console.log('✅ ربات بقای باستانی آماده شد!');