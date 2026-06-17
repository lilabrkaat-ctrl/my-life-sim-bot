const TelegramBot = require('node-telegram-bot-api');
const config = require('./config');
const player = require('./player');

// هندلرهای بخش‌های مختلف
const { setupWarHandlers } = require('./war');
const { setupDiplomacyHandlers } = require('./diplomacy');
const { setupHaremHandlers } = require('./harem');
const { setupEconomyHandlers } = require('./economy');
const { setupParliamentHandlers } = require('./parliament');
const { setupSpyHandlers } = require('./spy');
const { setupPrisonHandlers } = require('./prison');

const bot = new TelegramBot(config.BOT_TOKEN, { polling: true });

// راه‌اندازی همه هندلرها
setupWarHandlers(bot);
setupDiplomacyHandlers(bot);
setupHaremHandlers(bot);
setupEconomyHandlers(bot);
setupParliamentHandlers(bot);
setupSpyHandlers(bot);
setupPrisonHandlers(bot);

// منوی اصلی
function mainMenu() {
    return {
        reply_markup: {
            inline_keyboard: [
                [{ text: '⚔️ جنگ', callback_data: 'menu_war' }, { text: '🤝 دیپلماسی', callback_data: 'menu_diplomacy' }],
                [{ text: '👸 حرمسرا', callback_data: 'menu_harem' }, { text: '💰 اقتصاد', callback_data: 'menu_economy' }],
                [{ text: '🏛️ مجلس', callback_data: 'menu_parliament' }, { text: '🕵️ جاسوسی', callback_data: 'menu_spy' }],
                [{ text: '🔒 زندان', callback_data: 'menu_prison' }, { text: '📊 آمار', callback_data: 'menu_stats' }]
            ]
        }
    };
}

// START
bot.onText(/\/start/, async (msg) => {
    const chatId = msg.chat.id;
    const userId = msg.from.id;
    
    player.createPlayer(userId);
    
    await bot.sendMessage(chatId,
        '👑 *امپراطوری ۱۴۰۶*\n\n' +
        '🇮🇷 به بازی امپراطوری خوش اومدی!\n\n' +
        'کشورت رو مدیریت کن:\n' +
        '⚔️ بجنگ 🤝 مذاکره کن 👸 ازدواج کن\n' +
        '💰 اقتصاد بساز 🕵️ جاسوسی کن\n\n' +
        '🎮 یه گزینه رو انتخاب کن:',
        { parse_mode: 'Markdown', ...mainMenu() }
    );
});

// CALLBACK های اصلی
bot.on('callback_query', async (query) => {
    const chatId = query.message.chat.id;
    const msgId = query.message.message_id;
    const userId = query.from.id;
    const data = query.data;
    
    const p = player.getPlayer(userId);
    
    // منوی اصلی
    if (data === 'menu_main') {
        await bot.editMessageText(
            '👑 *امپراطوری ۱۴۰۶*\n\n🎮 یه گزینه رو انتخاب کن:',
            { chat_id: chatId, message_id: msgId, parse_mode: 'Markdown', ...mainMenu() }
        );
        return bot.answerCallbackQuery(query.id);
    }
    
    // 📊 آمار
    if (data === 'menu_stats') {
        const stats = player.getStats(userId);
        let text = '📊 *آمار امپراطوری*\n\n';
        text += `👤 نام: ${stats.name}\n`;
        text += `⭐ سطح: ${stats.level}\n`;
        text += `🏦 خزانه: ${stats.treasury.toLocaleString()} دلار\n`;
        text += `🛢️ نفت: ${stats.oil.toLocaleString()} بشکه\n`;
        text += `🪙 طلا: ${stats.gold} کیلو\n`;
        text += `💂 ارتش: ${stats.totalPower} قدرت\n`;
        text += `🛡️ دفاع: ${p.defense}\n\n`;
        text += `👸 ملکه‌ها: ${stats.queens}/۴\n`;
        text += `👶 فرزندان: ${stats.children}\n`;
        text += `🔒 زندانیان: ${stats.prisoners}\n`;
        text += `🕵️ جاسوس‌ها: ${stats.spies}\n`;
        text += `🌍 متحدان: ${stats.alliances}\n`;
        text += `⚔️ در جنگ: ${stats.wars}\n`;
        text += `🗺️ کشورهای فتح شده: ${stats.conquered}\n`;
        text += `😊 محبوبیت: ${stats.popularity}%`;
        
        await bot.editMessageText(
            text,
            { chat_id: chatId, message_id: msgId, parse_mode: 'Markdown',
              reply_markup: { inline_keyboard: [[{ text: '🔙 برگشت', callback_data: 'menu_main' }]] } }
        );
        return bot.answerCallbackQuery(query.id);
    }
});

// پنل ادمین مخفی
bot.onText(/\/admin (.+)/, async (msg, match) => {
    const chatId = msg.chat.id;
    const password = match[1];
    
    if (password !== config.ADMIN_PASSWORD) {
        return bot.sendMessage(chatId, '❌ رمز عبور اشتباهه!');
    }
    
    await bot.sendMessage(chatId,
        '👑 *پنل ادمین مخفی*\n\n' +
        'دستورات ادمین:\n' +
        '/god - گاد مود\n' +
        '/money [مبلغ] - پول بی‌نهایت\n' +
        '/army [نوع] [تعداد] - ارتش نامحدود\n' +
        '/resetall - ریست کامل',
        { parse_mode: 'Markdown' }
    );
});

// گاد مود
bot.onText(/\/god/, async (msg) => {
    const chatId = msg.chat.id;
    const userId = msg.from.id;
    const p = player.getPlayer(userId);
    
    p.treasury = 999999;
    p.oil = 999999;
    p.gold = 99999;
    p.army.soldier = 9999;
    p.army.sniper = 9999;
    p.army.drone = 999;
    p.army.jet = 999;
    p.army.missile = 999;
    p.army.robot = 999;
    p.defense = 999;
    p.popularity = 100;
    
    await bot.sendMessage(chatId, '⚡ *گاد مود فعال شد!*\nهمه چی نامحدود! 👑', { parse_mode: 'Markdown' });
});

// پول بی‌نهایت
bot.onText(/\/money (\d+)/, async (msg, match) => {
    const chatId = msg.chat.id;
    const userId = msg.from.id;
    const amount = parseInt(match[1]);
    
    const p = player.getPlayer(userId);
    p.treasury += amount;
    
    await bot.sendMessage(chatId, `💰 ${amount.toLocaleString()} دلار به خزانه اضافه شد!\n🏦 موجودی: ${p.treasury.toLocaleString()}`, { parse_mode: 'Markdown' });
});

console.log('👑 امپراطوری ۱۴۰۶ آماده شد!');
console.log('⚔️ جنگ | 🤝 دیپلماسی | 👸 حرمسرا | 💰 اقتصاد');
console.log('🏛️ مجلس | 🕵️ جاسوسی | 🔒 زندان');
console.log('==================================');