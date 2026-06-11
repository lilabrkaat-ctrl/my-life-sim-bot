const { bot, player, mainMenu } = require('./core');

function setupCraftHandlers() {

    // =============================================
    // 🔨 هندلر callback_query های ساخت‌وساز
    // =============================================
    bot.on('callback_query', async (query) => {
        const chatId = query.message.chat.id;
        const msgId = query.message.message_id;
        const data = query.data;
        const p = player.getPlayer(chatId);

        if (!p) return;

        // فقط callbackهای ساخت‌وساز رو هندل کن
        if (!data.startsWith('craft_')) return;

        try {

            // =============================================
            // ⚡ منوی ساخت انرژی‌دار
            // =============================================
            if (data === 'craft_energy_menu') {
                const { showCraftMenu, getEnergyCraftKeyboard } = require('../craft');
                await bot.editMessageText(showCraftMenu(p), {
                    chat_id: chatId, message_id: msgId, parse_mode: 'Markdown', ...getEnergyCraftKeyboard(p)
                });
                return bot.answerCallbackQuery(query.id);
            }

            // =============================================
            // 🔙 برگشت به منوی ساخت
            // =============================================
            if (data === 'craft_back') {
                const { showCraftMenu, getCraftKeyboard } = require('../craft');
                await bot.editMessageText(showCraftMenu(p), {
                    chat_id: chatId, message_id: msgId, parse_mode: 'Markdown', ...getCraftKeyboard(p)
                });
                return bot.answerCallbackQuery(query.id);
            }

            // =============================================
            // ⚡ ساخت آیتم انرژی‌دار
            // =============================================
            if (data.startsWith('craft_energy_')) {
                const itemName = data.replace('craft_energy_', '');
                const { craftItem, showCraftMenu, getEnergyCraftKeyboard } = require('../craft');
                const result = craftItem(p, itemName);

                if (result.success) {
                    // آپدیت ماموریت
                    const { updateQuestProgress, getQuestCompletionMessage } = require('../dailyQuest');
                    updateQuestProgress(p, 'craft', 'any_craft');

                    let msg = result.message;
                    const questMsg = getQuestCompletionMessage(p);
                    if (questMsg) msg += '\n\n' + questMsg;

                    await bot.editMessageText(msg, {
                        chat_id: chatId, message_id: msgId, parse_mode: 'Markdown', ...getEnergyCraftKeyboard(p)
                    });
                } else {
                    await bot.editMessageText(result.message, {
                        chat_id: chatId, message_id: msgId, parse_mode: 'Markdown', ...getEnergyCraftKeyboard(p)
                    });
                }
                return bot.answerCallbackQuery(query.id, { text: result.message.replace(/[*_]/g, '').substring(0, 100), show_alert: !result.success });
            }

            // =============================================
            // 🔨 ساخت آیتم معمولی
            // =============================================
            if (data.startsWith('craft_')) {
                const itemName = data.replace('craft_', '');
                const { craftItem, showCraftMenu, getCraftKeyboard } = require('../craft');
                const result = craftItem(p, itemName);

                if (result.success) {
                    // آپدیت ماموریت
                    const { updateQuestProgress, getQuestCompletionMessage } = require('../dailyQuest');
                    updateQuestProgress(p, 'craft', 'any_craft');

                    let msg = result.message;
                    const questMsg = getQuestCompletionMessage(p);
                    if (questMsg) msg += '\n\n' + questMsg;

                    await bot.editMessageText(msg, {
                        chat_id: chatId, message_id: msgId, parse_mode: 'Markdown', ...getCraftKeyboard(p)
                    });
                } else {
                    await bot.editMessageText(result.message, {
                        chat_id: chatId, message_id: msgId, parse_mode: 'Markdown', ...getCraftKeyboard(p)
                    });
                }
                return bot.answerCallbackQuery(query.id, { text: result.message.replace(/[*_]/g, '').substring(0, 100), show_alert: !result.success });
            }

        } catch (e) {
            console.log('Craft handler error:', e.message);
            return bot.answerCallbackQuery(query.id, { text: '❌ خطا! دوباره تلاش کن.' });
        }
    });
}

module.exports = { setupCraftHandlers };