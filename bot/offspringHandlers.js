const { bot, player, mainMenu } = require('./core');

function setupOffspringHandlers() {

    bot.on('callback_query', async (query) => {
        const chatId = query.message.chat.id;
        const msgId = query.message.message_id;
        const data = query.data;
        const p = player.getPlayer(chatId);

        if (!p) return;
        if (!data.startsWith('child_')) return;

        try {

            // =============================================
            // 👶 منوی فرزندان
            // =============================================
            if (data === 'child_menu') {
                const { formatChildren, getChildrenKeyboard } = require('../offspring');
                await bot.editMessageText(formatChildren(p), {
                    chat_id: chatId, message_id: msgId, parse_mode: 'Markdown', ...getChildrenKeyboard(p)
                });
                return bot.answerCallbackQuery(query.id);
            }

            // =============================================
            // 🍼 غذا دادن
            // =============================================
            if (data.startsWith('child_feed_')) {
                const childId = data.replace('child_feed_', '');
                const { feedChild, formatChildren, getChildrenKeyboard } = require('../offspring');
                const result = feedChild(p, childId);
                await bot.editMessageText(formatChildren(p), {
                    chat_id: chatId, message_id: msgId, parse_mode: 'Markdown', ...getChildrenKeyboard(p)
                });
                return bot.answerCallbackQuery(query.id, { text: result.message.replace(/[*_]/g, '').substring(0, 100), show_alert: true });
            }

            // =============================================
            // 📚 آموزش
            // =============================================
            if (data.startsWith('child_train_')) {
                const childId = data.replace('child_train_', '');
                const { trainChild, formatChildren, getChildrenKeyboard } = require('../offspring');
                const result = trainChild(p, childId);
                await bot.editMessageText(formatChildren(p), {
                    chat_id: chatId, message_id: msgId, parse_mode: 'Markdown', ...getChildrenKeyboard(p)
                });
                return bot.answerCallbackQuery(query.id, { text: result.message.replace(/[*_]/g, '').substring(0, 100), show_alert: true });
            }

            // =============================================
            // 👑 ولیعهد
            // =============================================
            if (data.startsWith('child_heir_')) {
                const childId = data.replace('child_heir_', '');
                const { assignHeir, formatChildren, getChildrenKeyboard } = require('../offspring');
                const result = assignHeir(p, childId);
                await bot.editMessageText(formatChildren(p), {
                    chat_id: chatId, message_id: msgId, parse_mode: 'Markdown', ...getChildrenKeyboard(p)
                });
                return bot.answerCallbackQuery(query.id, { text: result.message.replace(/[*_]/g, ''), show_alert: true });
            }

            // =============================================
            // ⚔️ تورنمنت
            // =============================================
            if (data === 'child_tournament') {
                const { holdTournament, formatChildren, getChildrenKeyboard } = require('../offspring');
                const result = holdTournament(p);
                await bot.editMessageText(result.message, {
                    chat_id: chatId, message_id: msgId, parse_mode: 'Markdown', ...getChildrenKeyboard(p)
                });
                return bot.answerCallbackQuery(query.id, { text: 'تورنمنت برگزار شد!' });
            }

        } catch (e) {
            console.log('Offspring handler error:', e.message);
            return bot.answerCallbackQuery(query.id, { text: '❌ خطا!' });
        }
    });
}

module.exports = { setupOffspringHandlers };