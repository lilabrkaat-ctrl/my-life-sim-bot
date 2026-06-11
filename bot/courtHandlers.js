const { bot, player, mainMenu } = require('./core');

function setupCourtHandlers() {

    bot.on('callback_query', async (query) => {
        const chatId = query.message.chat.id;
        const msgId = query.message.message_id;
        const data = query.data;
        const p = player.getPlayer(chatId);

        if (!p) return;
        if (!data.startsWith('court_')) return;

        try {

            // =============================================
            // 🏛️ منوی دربار
            // =============================================
            if (data === 'court_menu') {
                const { formatCourt, getCourtKeyboard } = require('../court');
                await bot.editMessageText(formatCourt(p), {
                    chat_id: chatId, message_id: msgId, parse_mode: 'Markdown', ...getCourtKeyboard(p)
                });
                return bot.answerCallbackQuery(query.id);
            }

            // =============================================
            // 📊 وضعیت دربار
            // =============================================
            if (data === 'court_status') {
                const { formatCourt, getCourtKeyboard } = require('../court');
                await bot.editMessageText(formatCourt(p), {
                    chat_id: chatId, message_id: msgId, parse_mode: 'Markdown', ...getCourtKeyboard(p)
                });
                return bot.answerCallbackQuery(query.id);
            }

            // =============================================
            // 🔒 مدیریت زندانیان
            // =============================================
            if (data === 'court_prisoners') {
                const { managePrisoners } = require('../court');
                const result = managePrisoners(p, 'list');
                const { getCourtKeyboard } = require('../court');
                await bot.editMessageText(result.message, {
                    chat_id: chatId, message_id: msgId, parse_mode: 'Markdown', ...getCourtKeyboard(p)
                });
                return bot.answerCallbackQuery(query.id);
            }

            // =============================================
            // 💀 اعدام زندانی
            // =============================================
            if (data.startsWith('court_execute_')) {
                const index = parseInt(data.replace('court_execute_', ''));
                const { managePrisoners, formatCourt, getCourtKeyboard } = require('../court');
                const result = managePrisoners(p, 'execute', index);
                await bot.editMessageText(formatCourt(p), {
                    chat_id: chatId, message_id: msgId, parse_mode: 'Markdown', ...getCourtKeyboard(p)
                });
                return bot.answerCallbackQuery(query.id, { text: result.message.replace(/[*_]/g, ''), show_alert: true });
            }

            // =============================================
            // 🔓 آزادی زندانی
            // =============================================
            if (data.startsWith('court_release_')) {
                const index = parseInt(data.replace('court_release_', ''));
                const { managePrisoners, formatCourt, getCourtKeyboard } = require('../court');
                const result = managePrisoners(p, 'release', index);
                await bot.editMessageText(formatCourt(p), {
                    chat_id: chatId, message_id: msgId, parse_mode: 'Markdown', ...getCourtKeyboard(p)
                });
                return bot.answerCallbackQuery(query.id, { text: result.message.replace(/[*_]/g, ''), show_alert: true });
            }

            // =============================================
            // 🐍 دسیسه
            // =============================================
            if (data.startsWith('court_intrigue_')) {
                const intrigueKey = data.replace('court_intrigue_', '');
                require('./core').courtState[chatId] = { action: 'intrigue', intrigueKey };
                await bot.sendMessage(chatId, '🎯 *هدف و مجری دسیسه:*\n\n📝 دو آیدی فرزند رو تایپ کن:\n(اول هدف، بعد مجری - با فاصله)\nمثال: `child_123 child_456`', { parse_mode: 'Markdown' });
                return bot.answerCallbackQuery(query.id, { text: 'آیدی فرزندان رو تایپ کن' });
            }

        } catch (e) {
            console.log('Court handler error:', e.message);
            return bot.answerCallbackQuery(query.id, { text: '❌ خطا!' });
        }
    });
}

module.exports = { setupCourtHandlers };