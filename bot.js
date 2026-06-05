const TelegramBot = require('node-telegram-bot-api');
const fs = require('fs');
const token = process.env.BOT_TOKEN || 'YOUR_BOT_TOKEN_HERE_PLACEHOLDER';
const bot = new TelegramBot(token, { polling: true });

// خوندن فایل images.json
const images = JSON.parse(fs.readFileSync('./images.json', 'utf8'));

// دستور /start
bot.onText(/\/start/, (msg) => {
    const chatId = msg.chat.id;
    
    const message = `
🏛️ *به دنیای بقای باستانی خوش آمدی!*

📸 *تست عکس‌ها:*
/locations - عکس مکان‌ها
/resources - عکس منابع
/enemies - عکس دشمنان
/npcs - عکس شخصیت‌ها
/all - همه عکس‌ها

دستور مورد نظر رو بزن.
    `;
    
    bot.sendMessage(chatId, message, { parse_mode: 'Markdown' });
});

// نمایش مکان‌ها
bot.onText(/\/locations/, async (msg) => {
    const chatId = msg.chat.id;
    const locs = images.locations;
    
    for (let key in locs) {
        const loc = locs[key];
        await bot.sendPhoto(chatId, loc.file_id, {
            caption: `${loc.emoji} ${loc.name} - ${loc.description}`
        });
    }
    
    bot.sendMessage(chatId, '✅ همه مکان‌ها نمایش داده شد.');
});

// نمایش منابع
bot.onText(/\/resources/, async (msg) => {
    const chatId = msg.chat.id;
    const res = images.resources;
    
    for (let key in res) {
        const item = res[key];
        await bot.sendPhoto(chatId, item.file_id, {
            caption: `${item.emoji} ${item.name}`
        });
    }
    
    bot.sendMessage(chatId, '✅ همه منابع نمایش داده شد.');
});

// نمایش دشمنان
bot.onText(/\/enemies/, async (msg) => {
    const chatId = msg.chat.id;
    const enemies = images.enemies;
    
    for (let key in enemies) {
        const enemy = enemies[key];
        await bot.sendPhoto(chatId, enemy.file_id, {
            caption: `${enemy.emoji} ${enemy.name} | ❤️ ${enemy.hp} | ⚔️ ${enemy.attack}`
        });
    }
    
    bot.sendMessage(chatId, '✅ همه دشمنان نمایش داده شد.');
});

// نمایش NPCها
bot.onText(/\/npcs/, async (msg) => {
    const chatId = msg.chat.id;
    const npcs = images.npcs;
    
    for (let key in npcs) {
        const npc = npcs[key];
        await bot.sendPhoto(chatId, npc.file_id, {
            caption: `${npc.emoji} ${npc.name} - ${npc.role}`
        });
    }
    
    bot.sendMessage(chatId, '✅ همه شخصیت‌ها نمایش داده شد.');
});

// نمایش همه
bot.onText(/\/all/, async (msg) => {
    const chatId = msg.chat.id;
    
    bot.sendMessage(chatId, '📸 در حال ارسال همه عکس‌ها...');
    
    for (let key in images.locations) {
        const loc = images.locations[key];
        await bot.sendPhoto(chatId, loc.file_id, { caption: `🏞️ ${loc.emoji} ${loc.name}` });
    }
    
    for (let key in images.resources) {
        const item = images.resources[key];
        await bot.sendPhoto(chatId, item.file_id, { caption: `🎒 ${item.emoji} ${item.name}` });
    }
    
    for (let key in images.enemies) {
        const enemy = images.enemies[key];
        await bot.sendPhoto(chatId, enemy.file_id, { caption: `⚔️ ${enemy.emoji} ${enemy.name}` });
    }
    
    for (let key in images.npcs) {
        const npc = images.npcs[key];
        await bot.sendPhoto(chatId, npc.file_id, { caption: `👤 ${npc.emoji} ${npc.name}` });
    }
    
    bot.sendMessage(chatId, '✅ همه عکس‌ها نمایش داده شد.');
});

console.log('✅ ربات تست عکس‌ها آماده شد!');