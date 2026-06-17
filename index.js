const config = require('./config');
const player = require('./player');
const { setupWar } = require('./war');
const { setupDiplomacy } = require('./diplomacy');
const { setupHarem } = require('./harem');
const { setupEconomy } = require('./economy');
const { setupParliament } = require('./parliament');
const { setupSpy } = require('./spy');
const { setupPrison } = require('./prison');
const { setupResearch } = require('./research');

const TelegramBot = require('node-telegram-bot-api');
const bot = new TelegramBot(config.BOT_TOKEN, { polling: true });

setupWar(bot);
setupDiplomacy(bot);
setupHarem(bot);
setupEconomy(bot);
setupParliament(bot);
setupSpy(bot);
setupPrison(bot);
setupResearch(bot);

function mainMenu() {
    return {
        reply_markup: {
            inline_keyboard: [
                [{ text: '⚔️ جنگ', callback_data: 'menu_war' }, { text: '🤝 دیپلماسی', callback_data: 'menu_diplomacy' }],
                [{ text: '👔 کاخ ریاست', callback_data: 'menu_harem' }, { text: '💰 اقتصاد', callback_data: 'menu_economy' }],
                [{ text: '🏛️ مجلس', callback_data: 'menu_parliament' }, { text: '🕵️ جاسوسی', callback_data: 'menu_spy' }],
                [{ text: '🔒 زندان', callback_data: 'menu_prison' }, { text: '🧪 تحقیقات', callback_data: 'menu_research' }],
                [{ text: '📊 آمار', callback_data: 'menu_stats' }]
            ]
        }
    };
}

bot.onText(/\/start/, async (msg) => {
    const chatId = msg.chat.id;
    player.createPlayer(msg.from.id);

    await bot.sendMessage(chatId,
        '👑 *امپراطوری ۱۴۰۶*\n\n' +
        '🇮🇷 به بازی خوش اومدی!\n\n' +
        '⚔️ جنگ | 🤝 دیپلماسی | 👔 کاخ ریاست\n' +
        '💰 اقتصاد | 🏛️ مجلس | 🕵️ جاسوسی\n' +
        '🔒 زندان | 🧪 تحقیقات\n\n' +
        '🎮 یه گزینه رو انتخاب کن:',
        { parse_mode: 'Markdown', ...mainMenu() }
    );
});

bot.on('callback_query', async (query) => {
    const chatId = query.message.chat.id;
    const msgId = query.message.message_id;
    const userId = query.from.id;
    const data = query.data;
    const p = player.getPlayer(userId);

    try {
        if (data === 'menu_main') {
            await bot.editMessageText(
                '👑 *امپراطوری ۱۴۰۶*\n\n🎮 یه گزینه رو انتخاب کن:',
                { chat_id: chatId, message_id: msgId, parse_mode: 'Markdown', ...mainMenu() }
            );
            return bot.answerCallbackQuery(query.id);
        }

        if (data === 'menu_stats') {
            const totalAssets = p.treasury + (p.oil * config.prices.oil) + (p.gold * config.prices.gold);
            let text = '📊 *آمار امپراطوری*\n\n';
            text += `👤 *${p.name}*\n⭐ سطح: ${p.level}\n\n`;
            text += `💰 *اقتصاد:*\n🏦 خزانه: ${p.treasury.toLocaleString()} دلار\n`;
            text += `🛢️ نفت: ${p.oil.toLocaleString()} بشکه\n🪙 طلا: ${p.gold} کیلو\n`;
            text += `💵 دارایی کل: ${totalAssets.toLocaleString()} دلار\n\n`;
            text += `⚔️ *نظامی:*\n💂 قدرت: ${player.getTotalPower(userId)}\n`;
            text += `🛡️ دفاع: ${p.defense}\n🗺️ فتوحات: ${p.conquered.length} کشور\n`;
            text += `⚔️ جنگ‌های فعال: ${p.wars.length}\n\n`;
            text += `👥 *اجتماعی:*\n👸 ملکه‌ها: ${p.queens ? p.queens.length : 0}/۴\n`;
            text += `👶 فرزندان: ${p.children.length}\n📊 محبوبیت: ${p.popularity}%\n\n`;
            text += `🌍 *سیاسی:*\n🤝 متحدان: ${p.alliances.length}\n`;
            text += `🚫 تحریم‌ها: ${p.sanctions.length}\n🔒 زندانیان: ${p.prisoners.length}\n`;
            text += `🕵️ جاسوس‌ها: ${p.spies.length}`;

            await bot.editMessageText(text, {
                chat_id: chatId, message_id: msgId, parse_mode: 'Markdown',
                reply_markup: { inline_keyboard: [[{ text: '🔙 برگشت', callback_data: 'menu_main' }]] }
            });
            return bot.answerCallbackQuery(query.id);
        }
    } catch (e) {
        console.log('Error:', e.message);
        await bot.answerCallbackQuery(query.id, { text: '❌ خطا!', show_alert: true });
    }
});

bot.onText(/\/admin (.+)/, async (msg, match) => {
    if (match[1] !== config.ADMIN_PASSWORD) return bot.sendMessage(msg.chat.id, '❌ رمز عبور اشتباهه!');
    await bot.sendMessage(msg.chat.id, '👑 *پنل ادمین*\n\n/god - گاد مود\n/money [مبلغ] - پول\n/resetall - ریست کامل\n/stats - آمار', { parse_mode: 'Markdown' });
});

bot.onText(/\/god/, async (msg) => {
    const p = player.getPlayer(msg.from.id);
    p.treasury = 999999; p.oil = 999999; p.gold = 99999;
    p.army.soldier = 9999; p.army.drone = 999; p.army.missile = 999;
    p.defense = 999; p.popularity = 100;
    await bot.sendMessage(msg.chat.id, '⚡ *گاد مود فعال شد!*', { parse_mode: 'Markdown' });
});

bot.onText(/\/money (\d+)/, async (msg, match) => {
    const p = player.getPlayer(msg.from.id);
    p.treasury += parseInt(match[1]);
    await bot.sendMessage(msg.chat.id, `💰 *+${match[1]} دلار*\n🏦 خزانه: ${p.treasury.toLocaleString()}`, { parse_mode: 'Markdown' });
});

bot.onText(/\/stats/, async (msg) => {
    const total = Object.keys(player.players).length;
    await bot.sendMessage(msg.chat.id, `📊 *آمار کلی*\n👥 بازیکنان: ${total}`, { parse_mode: 'Markdown' });
});

bot.onText(/\/resetall/, async (msg) => {
    player.players = {};
    await bot.sendMessage(msg.chat.id, '🔄 *همه چی ریست شد!*', { parse_mode: 'Markdown' });
});

console.log('👑 امپراطوری ۱۴۰۶ آماده شد!');