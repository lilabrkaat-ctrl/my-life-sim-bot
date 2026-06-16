const { bot, player, mainMenu } = require('./core');

function setupEmpireChildren() {

    bot.on('callback_query', async (query) => {
        const chatId = query.message.chat.id;
        const msgId = query.message.message_id;
        const data = query.data;
        const p = player.getPlayer(chatId);

        if (!p || !data) return;
        if (!data.startsWith('child_') && data !== 'children_menu') return;

        try {
            const del = async () => { try { await bot.deleteMessage(chatId, msgId); } catch(e) {} };
            const send = (text, kb) => bot.sendMessage(chatId, text, { parse_mode: 'Markdown', ...(kb || mainMenu()) });

            // ============ منوی فرزندان ============
            if (data === 'children_menu') {
                const { formatChildren, getChildrenKeyboard } = require('../offspring');
                await del();
                await send(formatChildren(p), getChildrenKeyboard(p));
                return bot.answerCallbackQuery(query.id);
            }

            // ============ 🍼 غذا دادن ============
            if (data.startsWith('child_feed_')) {
                const childId = data.replace('child_feed_', '');
                const { feedChild, getChildrenKeyboard } = require('../offspring');
                const result = feedChild(p, childId);
                console.log('🍼 feedChild:', result);
                await del();
                await send(result.message, getChildrenKeyboard(p));
                return bot.answerCallbackQuery(query.id, { text: result.success ? '✅' : '❌', show_alert: true });
            }

            // ============ 📚 آموزش ============
            if (data.startsWith('child_train_')) {
                const childId = data.replace('child_train_', '');
                const { trainChild, getChildrenKeyboard } = require('../offspring');
                const result = trainChild(p, childId);
                console.log('📚 trainChild:', result);
                await del();
                await send(result.message, getChildrenKeyboard(p));
                return bot.answerCallbackQuery(query.id, { text: result.success ? '✅' : '❌', show_alert: true });
            }

            // ============ 👑 ولیعهد ============
            if (data.startsWith('child_heir_')) {
                const childId = data.replace('child_heir_', '');
                const { assignHeir, getChildrenKeyboard } = require('../offspring');
                const result = assignHeir(p, childId);
                console.log('👑 assignHeir:', result);
                await del();
                await send(result.message, getChildrenKeyboard(p));
                return bot.answerCallbackQuery(query.id, { text: result.success ? '✅' : '❌', show_alert: true });
            }

            // ============ ⚔️ تورنمنت ============
            if (data === 'child_tournament') {
                const { holdTournament, getChildrenKeyboard } = require('../offspring');
                const result = holdTournament(p);
                console.log('⚔️ tournament:', result);
                await del();
                await send(result.message, getChildrenKeyboard(p));
                return bot.answerCallbackQuery(query.id, { text: result.success ? '🏆' : '❌', show_alert: true });
            }

        } catch (e) {
            console.log('❌ Children handler error:', e.message);
            try { await bot.answerCallbackQuery(query.id, { text: '❌ خطا!', show_alert: true }); } catch(e2) {}
        }
    });
}

module.exports = { setupEmpireChildren };