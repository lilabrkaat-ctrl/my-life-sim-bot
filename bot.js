const TelegramBot = require('node-telegram-bot-api');
const config = require('./config');
const player = require('./player');

const bot = new TelegramBot(config.BOT_TOKEN, { polling: true });

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
        'به بازی امپراطوری خوش اومدی!\n' +
        'کشورت رو مدیریت کن، بجنگ، مذاکره کن،\n' +
        'ازدواج کن و امپراطوریت رو گسترش بده!\n\n' +
        '🎮 یه گزینه رو انتخاب کن:',
        { parse_mode: 'Markdown', ...mainMenu() }
    );
});

// CALLBACK ها
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
    
    // ⚔️ جنگ
    if (data === 'menu_war') {
        const war = require('./war');
        await bot.editMessageText(
            '⚔️ *اتاق جنگ*\n\n' +
            `💂 ارتش: ${player.getTotalPower(userId)} قدرت\n` +
            `🛡️ دفاع: ${p.defense}\n\n` +
            'عملیات:',
            { chat_id: chatId, message_id: msgId, parse_mode: 'Markdown', ...war.warMenu() }
        );
        return bot.answerCallbackQuery(query.id);
    }
    
    // 🤝 دیپلماسی
    if (data === 'menu_diplomacy') {
        const diplomacy = require('./diplomacy');
        await bot.editMessageText(
            '🤝 *دیپلماسی*\n\n' +
            `🌍 متحدان: ${p.alliances.length} کشور\n` +
            `⚔️ در جنگ: ${p.wars.length} کشور\n\n` +
            'عملیات:',
            { chat_id: chatId, message_id: msgId, parse_mode: 'Markdown', ...diplomacy.diplomacyMenu() }
        );
        return bot.answerCallbackQuery(query.id);
    }
    
    // 👸 حرمسرا
    if (data === 'menu_harem') {
        const harem = require('./harem');
        await bot.editMessageText(
            '👸 *حرمسرا*\n\n' +
            `👸 ملکه‌ها: ${p.queens.length}/۴\n` +
            `👶 فرزندان: ${p.children.length}\n\n` +
            'عملیات:',
            { chat_id: chatId, message_id: msgId, parse_mode: 'Markdown', ...harem.haremMenu() }
        );
        return bot.answerCallbackQuery(query.id);
    }
    
    // 💰 اقتصاد
    if (data === 'menu_economy') {
        const economy = require('./economy');
        await bot.editMessageText(
            '💰 *اقتصاد*\n\n' +
            `🏦 خزانه: ${p.treasury} دلار\n` +
            `🛢️ نفت: ${p.oil} بشکه\n` +
            `🪙 طلا: ${p.gold} کیلو\n\n` +
            'عملیات:',
            { chat_id: chatId, message_id: msgId, parse_mode: 'Markdown', ...economy.economyMenu() }
        );
        return bot.answerCallbackQuery(query.id);
    }
    
    // 🏛️ مجلس
    if (data === 'menu_parliament') {
        const parliament = require('./parliament');
        await bot.editMessageText(
            '🏛️ *مجلس شورای اسلامی*\n\n' +
            'کمیسیون‌ها:',
            { chat_id: chatId, message_id: msgId, parse_mode: 'Markdown', ...parliament.parliamentMenu() }
        );
        return bot.answerCallbackQuery(query.id);
    }
    
    // 🕵️ جاسوسی
    if (data === 'menu_spy') {
        const spy = require('./spy');
        await bot.editMessageText(
            '🕵️ *سازمان جاسوسی*\n\n' +
            `🕵️ جاسوس‌های فعال: ${p.spies.length}\n\n` +
            'عملیات:',
            { chat_id: chatId, message_id: msgId, parse_mode: 'Markdown', ...spy.spyMenu() }
        );
        return bot.answerCallbackQuery(query.id);
    }
    
    // 🔒 زندان
    if (data === 'menu_prison') {
        const prison = require('./prison');
        await bot.editMessageText(
            '🔒 *زندان*\n\n' +
            `👥 زندانیان: ${p.prisoners.length}\n\n` +
            'عملیات:',
            { chat_id: chatId, message_id: msgId, parse_mode: 'Markdown', ...prison.prisonMenu() }
        );
        return bot.answerCallbackQuery(query.id);
    }
    
    // 📊 آمار
    if (data === 'menu_stats') {
        const stats = player.getStats(userId);
        await bot.editMessageText(
            '📊 *آمار امپراطوری*\n\n' +
            `👤 نام: ${stats.name}\n` +
            `⭐ سطح: ${stats.level}\n` +
            `💰 خزانه: ${stats.treasury} دلار\n` +
            `🛢️ نفت: ${stats.oil} بشکه\n` +
            `🪙 طلا: ${stats.gold} کیلو\n` +
            `💂 قدرت ارتش: ${stats.totalPower}\n` +
            `👸 ملکه‌ها: ${stats.queens}/۴\n` +
            `👶 فرزندان: ${stats.children}\n` +
            `🔒 زندانیان: ${stats.prisoners}\n` +
            `🌍 متحدان: ${stats.alliances}\n` +
            `⚔️ جنگ‌ها: ${stats.wars}\n` +
            `📊 محبوبیت: ${stats.popularity}%\n` +
            `🗺️ کشورهای فتح شده: ${stats.conquered}`,
            { chat_id: chatId, message_id: msgId, parse_mode: 'Markdown', 
              reply_markup: { inline_keyboard: [[{ text: '🔙 برگشت', callback_data: 'menu_main' }]] } }
        );
        return bot.answerCallbackQuery(query.id);
    }
});

console.log('👑 امپراطوری ۱۴۰۶ آماده شد!');