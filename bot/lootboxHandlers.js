const { bot, player, mainMenu, sendPhoto } = require('./core');

function setupLootboxHandlers() {

    bot.on('callback_query', async (query) => {
        const chatId = query.message.chat.id;
        const msgId = query.message.message_id;
        const data = query.data;
        const p = player.getPlayer(chatId);

        if (!p) return;
        if (!data.startsWith('lootbox_')) return;

        try {

            // =============================================
            // 📦 منوی صندوقچه‌ها
            // =============================================
            if (data === 'lootbox_menu') {
                const { formatLootBoxes, getLootBoxKeyboard } = require('../lootbox');
                await bot.editMessageText(formatLootBoxes(p), {
                    chat_id: chatId, message_id: msgId, parse_mode: 'Markdown', ...getLootBoxKeyboard(p)
                });
                return bot.answerCallbackQuery(query.id);
            }

            // =============================================
            // 📦 باز کردن صندوق
            // =============================================
            if (data.startsWith('lootbox_open_')) {
                const boxType = data.replace('lootbox_open_', '');
                const { openLootBox, formatLootBoxes, getLootBoxKeyboard } = require('../lootbox');
                const result = openLootBox(p, boxType);

                if (result.image) {
                    await bot.deleteMessage(chatId, msgId).catch(() => {});
                    await sendPhoto(chatId, result.image, result.message, getLootBoxKeyboard(p));
                } else {
                    await bot.editMessageText(result.message, {
                        chat_id: chatId, message_id: msgId, parse_mode: 'Markdown', ...getLootBoxKeyboard(p)
                    });
                }
                return bot.answerCallbackQuery(query.id, { text: result.message.replace(/[*_]/g, '').substring(0, 100), show_alert: true });
            }

        } catch (e) {
            console.log('Lootbox handler error:', e.message);
            return bot.answerCallbackQuery(query.id, { text: '❌ خطا!' });
        }
    });
}

module.exports = { setupLootboxHandlers };