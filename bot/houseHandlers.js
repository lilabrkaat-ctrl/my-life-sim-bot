const { bot, player, mainMenu, sendAnimation } = require('./core');

function setupHouseHandlers() {

    // =============================================
    // 🏠 هندلر callback_query های خونه
    // =============================================
    bot.on('callback_query', async (query) => {
        const chatId = query.message.chat.id;
        const msgId = query.message.message_id;
        const data = query.data;
        const p = player.getPlayer(chatId);

        if (!p) return;

        // فقط callbackهای خونه رو هندل کن
        if (!data.startsWith('house_')) return;

        try {

            // =============================================
            // 🔙 برگشت به لیست خونه
            // =============================================
            if (data === 'house_back') {
                const { formatHouse, getHouseKeyboard } = require('../house');
                await bot.editMessageText(formatHouse(p), {
                    chat_id: chatId, message_id: msgId, parse_mode: 'Markdown', ...getHouseKeyboard(p)
                });
                return bot.answerCallbackQuery(query.id);
            }

            // =============================================
            // 👤 انتخاب عضو خونه
            // =============================================
            if (data.startsWith('house_select_')) {
                const npcId = data.replace('house_select_', '');
                const member = p.house?.find(h => h.npcId === npcId);
                if (!member) {
                    return bot.answerCallbackQuery(query.id, { text: '❌ این شخص توی خونه نیست!' });
                }

                const { getRelationPoints, getRelationLevel, getPrisonActions } = require('../prison');
                const { getHouseMemberKeyboard } = require('../house');
                const points = getRelationPoints(p, npcId);
                const relation = getRelationLevel(points);
                const actions = getPrisonActions(p, npcId);
                const isSpouse = p.marry === npcId;

                let infoMsg = `🏠 *${member.emoji} ${member.name}*\n\n`;
                infoMsg += `💕 رابطه: ${relation.name} (${points} امتیاز)\n`;
                infoMsg += `🖐️ لمس: ${actions.touch} | 💋 بوس: ${actions.kiss} | 🔥 عیاشی: ${actions.orgy}`;
                if (isSpouse) infoMsg += '\n💍 *همسر*';

                await bot.editMessageText(infoMsg, {
                    chat_id: chatId, message_id: msgId, parse_mode: 'Markdown', ...getHouseMemberKeyboard(p, npcId)
                });
                return bot.answerCallbackQuery(query.id);
            }

            // =============================================
            // 🖐️ لمس
            // =============================================
            if (data.startsWith('house_touch_')) {
                const npcId = data.replace('house_touch_', '');
                const { touchInHouse, getHouseMemberKeyboard } = require('../house');
                const result = touchInHouse(p, npcId);

                if (result.animation) {
                    await bot.deleteMessage(chatId, msgId).catch(() => {});
                    await sendAnimation(chatId, result.animation, result.message, getHouseMemberKeyboard(p, npcId));
                } else {
                    await bot.editMessageText(result.message, {
                        chat_id: chatId, message_id: msgId, parse_mode: 'Markdown', ...getHouseMemberKeyboard(p, npcId)
                    });
                }
                return bot.answerCallbackQuery(query.id, { text: result.message.replace(/[*_]/g, '').substring(0, 100) });
            }

            // =============================================
            // 💋 بوسه
            // =============================================
            if (data.startsWith('house_kiss_')) {
                const npcId = data.replace('house_kiss_', '');
                const { kissInHouse, getHouseMemberKeyboard } = require('../house');
                const result = kissInHouse(p, npcId);

                if (result.animation) {
                    await bot.deleteMessage(chatId, msgId).catch(() => {});
                    await sendAnimation(chatId, result.animation, result.message, getHouseMemberKeyboard(p, npcId));
                } else {
                    await bot.editMessageText(result.message, {
                        chat_id: chatId, message_id: msgId, parse_mode: 'Markdown', ...getHouseMemberKeyboard(p, npcId)
                    });
                }
                return bot.answerCallbackQuery(query.id, { text: result.message.replace(/[*_]/g, '').substring(0, 100) });
            }

            // =============================================
            // 🔥 عیاشی
            // =============================================
            if (data.startsWith('house_orgy_')) {
                const npcId = data.replace('house_orgy_', '');
                const { orgyInHouse, getHouseMemberKeyboard } = require('../house');
                const result = orgyInHouse(p, npcId);

                if (result.animation) {
                    await bot.deleteMessage(chatId, msgId).catch(() => {});
                    await sendAnimation(chatId, result.animation, result.message, getHouseMemberKeyboard(p, npcId));
                } else {
                    await bot.editMessageText(result.message, {
                        chat_id: chatId, message_id: msgId, parse_mode: 'Markdown', ...getHouseMemberKeyboard(p, npcId)
                    });
                }
                return bot.answerCallbackQuery(query.id, { text: result.message.replace(/[*_]/g, '').substring(0, 100) });
            }

            // =============================================
            // 💍 خواستگاری
            // =============================================
            if (data.startsWith('house_propose_')) {
                const npcId = data.replace('house_propose_', '');
                const { propose } = require('../marry');
                const result = propose(p, npcId);

                if (result.success) {
                    const { formatHouse, getHouseKeyboard } = require('../house');
                    await bot.editMessageText(`💍 *خواستگاری*\n\n${result.message}`, {
                        chat_id: chatId, message_id: msgId, parse_mode: 'Markdown', ...getHouseKeyboard(p)
                    });
                } else {
                    await bot.editMessageText(result.message, {
                        chat_id: chatId, message_id: msgId, parse_mode: 'Markdown', ...require('../house').getHouseMemberKeyboard(p, npcId)
                    });
                }
                return bot.answerCallbackQuery(query.id, { text: result.message.replace(/[*_]/g, ''), show_alert: true });
            }

            // =============================================
            // 👰 عروسی
            // =============================================
            if (data.startsWith('house_marry_')) {
                const npcId = data.replace('house_marry_', '');
                const { marry } = require('../marry');
                const result = marry(p, npcId);

                const { formatHouse, getHouseKeyboard } = require('../house');
                await bot.editMessageText(`👰 *عروسی*\n\n${result.message}`, {
                    chat_id: chatId, message_id: msgId, parse_mode: 'Markdown', ...getHouseKeyboard(p)
                });
                return bot.answerCallbackQuery(query.id, { text: result.message.replace(/[*_]/g, ''), show_alert: true });
            }

            // =============================================
            // 🚪 اخراج از خونه
            // =============================================
            if (data.startsWith('house_kick_')) {
                const npcId = data.replace('house_kick_', '');
                const { kickFromHouse, formatHouse, getHouseKeyboard } = require('../house');
                const result = kickFromHouse(p, npcId);

                await bot.editMessageText(formatHouse(p) + '\n\n' + result.message, {
                    chat_id: chatId, message_id: msgId, parse_mode: 'Markdown', ...getHouseKeyboard(p)
                });
                return bot.answerCallbackQuery(query.id, { text: result.message.replace(/[*_]/g, ''), show_alert: true });
            }

        } catch (e) {
            console.log('House handler error:', e.message);
            return bot.answerCallbackQuery(query.id, { text: '❌ خطا! دوباره تلاش کن.' });
        }
    });
}

module.exports = { setupHouseHandlers };