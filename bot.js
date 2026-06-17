const TelegramBot = require('node-telegram-bot-api');
const config = require('./config');
const player = require('./player');

const bot = new TelegramBot(config.BOT_TOKEN, { polling: true });

// ============ منوی اصلی ============
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

// ============ START ============
bot.onText(/\/start/, async (msg) => {
    const chatId = msg.chat.id;
    const userId = msg.from.id;
    player.createPlayer(userId);
    
    await bot.sendMessage(chatId,
        '👑 *امپراطوری ۱۴۰۶*\n\n🇮🇷 به بازی خوش اومدی!\n🎮 یه گزینه رو انتخاب کن:',
        { parse_mode: 'Markdown', ...mainMenu() }
    );
});

// ============ منوهای اصلی ============
bot.on('callback_query', async (query) => {
    const chatId = query.message.chat.id;
    const msgId = query.message.message_id;
    const userId = query.from.id;
    const data = query.data;
    const p = player.getPlayer(userId);
    
    // برگشت به منوی اصلی
    if (data === 'menu_main') {
        await bot.editMessageText('👑 *امپراطوری ۱۴۰۶*\n\n🎮 یه گزینه رو انتخاب کن:',
            { chat_id: chatId, message_id: msgId, parse_mode: 'Markdown', ...mainMenu() });
        return bot.answerCallbackQuery(query.id);
    }
    
    // 📊 آمار
    if (data === 'menu_stats') {
        const s = player.getStats(userId);
        let text = '📊 *آمار*\n\n';
        text += `💰 ${s.treasury.toLocaleString()} دلار | 🛢️ ${s.oil} بشکه | 🪙 ${s.gold}kg\n`;
        text += `💂 ${s.totalPower} قدرت | 🛡️ ${p.defense} دفاع\n`;
        text += `👸 ${s.queens}/۴ | 👶 ${s.children} | 🔒 ${s.prisoners}\n`;
        text += `🌍 ${s.alliances} متحد | ⚔️ ${s.wars} جنگ | 😊 ${s.popularity}%`;
        await bot.editMessageText(text,
            { chat_id: chatId, message_id: msgId, parse_mode: 'Markdown',
              reply_markup: { inline_keyboard: [[{ text: '🔙 برگشت', callback_data: 'menu_main' }]] } });
        return bot.answerCallbackQuery(query.id);
    }
});

// ============ هندلرهای بخش‌ها ============
const { setupWarHandlers } = require('./war');
const { setupDiplomacyHandlers } = require('./diplomacy');
const { setupHaremHandlers } = require('./harem');
const { setupEconomyHandlers } = require('./economy');
const { setupParliamentHandlers } = require('./parliament');
const { setupSpyHandlers } = require('./spy');
const { setupPrisonHandlers } = require('./prison');

setupWarHandlers(bot);
setupDiplomacyHandlers(bot);
setupHaremHandlers(bot);
setupEconomyHandlers(bot);
setupParliamentHandlers(bot);
setupSpyHandlers(bot);
setupPrisonHandlers(bot);

// ============ ادمین ============
bot.onText(/\/admin (.+)/, async (msg, match) => {
    if (match[1] !== config.ADMIN_PASSWORD) return;
    await bot.sendMessage(msg.chat.id, '👑 پنل ادمین:\n/god - گاد مود\n/money [مبلغ]\n/resetall');
});

bot.onText(/\/god/, async (msg) => {
    const p = player.getPlayer(msg.from.id);
    p.treasury = 999999; p.oil = 999999; p.gold = 99999;
    p.army.soldier = 9999; p.army.drone = 999; p.army.missile = 999;
    p.defense = 999; p.popularity = 100;
    await bot.sendMessage(msg.chat.id, '⚡ گاد مود فعال شد!');
});

bot.onText(/\/money (\d+)/, async (msg, match) => {
    const p = player.getPlayer(msg.from.id);
    p.treasury += parseInt(match[1]);
    await bot.sendMessage(msg.chat.id, `💰 +${match[1]} دلار | خزانه: ${p.treasury.toLocaleString()}`);
});

console.log('👑 امپراطوری ۱۴۰۶ آماده شد!');