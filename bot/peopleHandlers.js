const { bot, player, mainMenu } = require('./core');

function setupPeopleHandlers() {

    bot.on('callback_query', async (query) => {
        const chatId = query.message.chat.id;
        const msgId = query.message.message_id;
        const data = query.data;
        const p = player.getPlayer(chatId);

        if (!p) return;
        if (!data.startsWith('people_')) return;

        try {

            // =============================================
            // 👥 منوی مردم
            // =============================================
            if (data === 'people_menu') {
                const { formatPeople, getPeopleKeyboard } = require('../people');
                await bot.editMessageText(formatPeople(p), {
                    chat_id: chatId, message_id: msgId, parse_mode: 'Markdown', ...getPeopleKeyboard(p)
                });
                return bot.answerCallbackQuery(query.id);
            }

            // =============================================
            // 💰 جمع‌آوری مالیات
            // =============================================
            if (data === 'people_tax') {
                const { collectTaxes, formatPeople, getPeopleKeyboard } = require('../people');
                const result = collectTaxes(p);
                await bot.editMessageText(formatPeople(p), {
                    chat_id: chatId, message_id: msgId, parse_mode: 'Markdown', ...getPeopleKeyboard(p)
                });
                return bot.answerCallbackQuery(query.id, { text: result.message.replace(/[*_]/g, '').substring(0, 100), show_alert: true });
            }

            // =============================================
            // 🎉 جشن
            // =============================================
            if (data === 'people_festival') {
                const { makeDecision, formatPeople, getPeopleKeyboard } = require('../people');
                const result = makeDecision(p, 'festival', 0);
                await bot.editMessageText(formatPeople(p), {
                    chat_id: chatId, message_id: msgId, parse_mode: 'Markdown', ...getPeopleKeyboard(p)
                });
                return bot.answerCallbackQuery(query.id, { text: result.message.replace(/[*_]/g, ''), show_alert: true });
            }

            // =============================================
            // 🍞 کمک غذایی
            // =============================================
            if (data === 'people_food') {
                const { makeDecision, formatPeople, getPeopleKeyboard } = require('../people');
                const result = makeDecision(p, 'foodAid', 0);
                await bot.editMessageText(formatPeople(p), {
                    chat_id: chatId, message_id: msgId, parse_mode: 'Markdown', ...getPeopleKeyboard(p)
                });
                return bot.answerCallbackQuery(query.id, { text: result.message.replace(/[*_]/g, ''), show_alert: true });
            }

            // =============================================
            // ⚔️ سربازگیری
            // =============================================
            if (data === 'people_draft') {
                const { makeDecision, formatPeople, getPeopleKeyboard } = require('../people');
                const result = makeDecision(p, 'conscription', 0);
                await bot.editMessageText(formatPeople(p), {
                    chat_id: chatId, message_id: msgId, parse_mode: 'Markdown', ...getPeopleKeyboard(p)
                });
                return bot.answerCallbackQuery(query.id, { text: result.message.replace(/[*_]/g, ''), show_alert: true });
            }

            // =============================================
            // 🙏 بخشش مالیات
            // =============================================
            if (data === 'people_taxbreak') {
                const { makeDecision, formatPeople, getPeopleKeyboard } = require('../people');
                const result = makeDecision(p, 'taxBreak', 0);
                await bot.editMessageText(formatPeople(p), {
                    chat_id: chatId, message_id: msgId, parse_mode: 'Markdown', ...getPeopleKeyboard(p)
                });
                return bot.answerCallbackQuery(query.id, { text: result.message.replace(/[*_]/g, ''), show_alert: true });
            }

        } catch (e) {
            console.log('People handler error:', e.message);
            return bot.answerCallbackQuery(query.id, { text: '❌ خطا!' });
        }
    });
}

module.exports = { setupPeopleHandlers };