const { bot, player, mainMenu, sendPhoto } = require('./core');

function setupDailyQuestHandlers() {

    bot.on('callback_query', async (query) => {
        const chatId = query.message.chat.id;
        const msgId = query.message.message_id;
        const data = query.data;
        const p = player.getPlayer(chatId);

        if (!p) return;
        if (!data.startsWith('quest_')) return;

        try {

            // =============================================
            // 🎁 دریافت جایزه ماموریت
            // =============================================
            if (data.startsWith('quest_claim_')) {
                const questKey = data.replace('quest_claim_', '');
                const { claimQuestReward, formatDailyQuests, getDailyQuestKeyboard } = require('../dailyQuest');
                const result = claimQuestReward(p, questKey);

                if (result.image) {
                    await bot.deleteMessage(chatId, msgId).catch(() => {});
                    await sendPhoto(chatId, result.image, result.message, getDailyQuestKeyboard(p));
                } else {
                    await bot.editMessageText(result.message, {
                        chat_id: chatId, message_id: msgId, parse_mode: 'Markdown', ...getDailyQuestKeyboard(p)
                    });
                }
                return bot.answerCallbackQuery(query.id, { text: result.message.replace(/[*_]/g, '').substring(0, 100), show_alert: true });
            }

        } catch (e) {
            console.log('DailyQuest handler error:', e.message);
            return bot.answerCallbackQuery(query.id, { text: '❌ خطا!' });
        }
    });
}

module.exports = { setupDailyQuestHandlers };