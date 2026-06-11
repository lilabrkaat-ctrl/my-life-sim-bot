const { bot, player, mainMenu, sendAnimation } = require('./core');

function setupPrisonHandlers() {

    // =============================================
    // 🔒 هندلر callback_query های زندان
    // =============================================
    bot.on('callback_query', async (query) => {
        const chatId = query.message.chat.id;
        const msgId = query.message.message_id;
        const data = query.data;
        const p = player.getPlayer(chatId);

        if (!p) return;

        // فقط callbackهای زندان رو هندل کن
        if (!data.startsWith('prison_')) return;

        try {

            // =============================================
            // 🔙 برگشت به لیست زندان
            // =============================================
            if (data === 'prison_back') {
                const { formatPrison, getPrisonKeyboard } = require('../prison');
                await bot.editMessageText(formatPrison(p), {
                    chat_id: chatId, message_id: msgId, parse_mode: 'Markdown', ...getPrisonKeyboard(p)
                });
                return bot.answerCallbackQuery(query.id);
            }

            // =============================================
            // 👤 انتخاب زندانی
            // =============================================
            if (data.startsWith('prison_select_')) {
                const npcId = data.replace('prison_select_', '');
                const prisoner = p.prison?.find(pr => pr.npcId === npcId);
                if (!prisoner) {
                    return bot.answerCallbackQuery(query.id, { text: '❌ زندانی پیدا نشد!' });
                }

                const { getRelationPoints, getRelationLevel, getPrisonActions, getPrisonerKeyboard } = require('../prison');
                const points = getRelationPoints(p, npcId);
                const relation = getRelationLevel(points);
                const actions = getPrisonActions(p, npcId);

                let infoMsg = `🔒 *${prisoner.emoji} ${prisoner.name}*\n\n`;
                infoMsg += `💕 رابطه: ${relation.name} (${points} امتیاز)\n`;
                infoMsg += `⏰ ${prisoner.daysUntilEscape} روز تا فرار\n`;
                infoMsg += `🖐️ لمس: ${actions.touch} | 💋 بوس: ${actions.kiss} | 🔥 عیاشی: ${actions.orgy}`;

                await bot.editMessageText(infoMsg, {
                    chat_id: chatId, message_id: msgId, parse_mode: 'Markdown', ...getPrisonerKeyboard(p, npcId)
                });
                return bot.answerCallbackQuery(query.id);
            }

            // =============================================
            // 🖐️ لمس زندانی
            // =============================================
            if (data.startsWith('prison_touch_')) {
                const npcId = data.replace('prison_touch_', '');
                const { touchPrisoner, getPrisonerKeyboard } = require('../prison');
                const result = touchPrisoner(p, npcId);

                if (result.animation) {
                    await bot.deleteMessage(chatId, msgId).catch(() => {});
                    await sendAnimation(chatId, result.animation, result.message, getPrisonerKeyboard(p, npcId));
                } else {
                    await bot.editMessageText(result.message, {
                        chat_id: chatId, message_id: msgId, parse_mode: 'Markdown', ...getPrisonerKeyboard(p, npcId)
                    });
                }
                return bot.answerCallbackQuery(query.id, { text: result.message.replace(/[*_]/g, '').substring(0, 100) });
            }

            // =============================================
            // 💋 بوسه زندانی
            // =============================================
            if (data.startsWith('prison_kiss_')) {
                const npcId = data.replace('prison_kiss_', '');
                const { kissPrisoner, getPrisonerKeyboard } = require('../prison');
                const result = kissPrisoner(p, npcId);

                if (result.animation) {
                    await bot.deleteMessage(chatId, msgId).catch(() => {});
                    await sendAnimation(chatId, result.animation, result.message, getPrisonerKeyboard(p, npcId));
                } else {
                    await bot.editMessageText(result.message, {
                        chat_id: chatId, message_id: msgId, parse_mode: 'Markdown', ...getPrisonerKeyboard(p, npcId)
                    });
                }
                return bot.answerCallbackQuery(query.id, { text: result.message.replace(/[*_]/g, '').substring(0, 100) });
            }

            // =============================================
            // 🔥 عیاشی با زندانی
            // =============================================
            if (data.startsWith('prison_orgy_')) {
                const npcId = data.replace('prison_orgy_', '');
                const { orgyPrisoner, getPrisonerKeyboard } = require('../prison');
                const result = orgyPrisoner(p, npcId);

                if (result.animation) {
                    await bot.deleteMessage(chatId, msgId).catch(() => {});
                    await sendAnimation(chatId, result.animation, result.message, getPrisonerKeyboard(p, npcId));
                } else {
                    await bot.editMessageText(result.message, {
                        chat_id: chatId, message_id: msgId, parse_mode: 'Markdown', ...getPrisonerKeyboard(p, npcId)
                    });
                }
                return bot.answerCallbackQuery(query.id, { text: result.message.replace(/[*_]/g, '').substring(0, 100) });
            }

            // =============================================
            // 🔓 آزادی زندانی
            // =============================================
            if (data.startsWith('prison_release_')) {
                const npcId = data.replace('prison_release_', '');
                const { releasePrisoner, formatPrison, getPrisonKeyboard } = require('../prison');
                const result = releasePrisoner(p, npcId);

                if (result.loyal) {
                    // وفادار موند - میره خونه
                    if (!p.house) p.house = [];
                    const npc = require('../config').images.npcs?.[npcId] || require('../config').images.enemies?.[npcId];
                    p.house.push({ npcId, name: npc?.name || npcId, emoji: npc?.emoji || '👤', joinedAt: Date.now() });

                    await bot.editMessageText(result.message + '\n\n🏠 *رفت توی خونه!*', {
                        chat_id: chatId, message_id: msgId, parse_mode: 'Markdown', ...getPrisonKeyboard(p)
                    });
                } else {
                    await bot.editMessageText(result.message, {
                        chat_id: chatId, message_id: msgId, parse_mode: 'Markdown', ...getPrisonKeyboard(p)
                    });
                }
                return bot.answerCallbackQuery(query.id, { text: result.message.replace(/[*_]/g, '').substring(0, 100), show_alert: true });
            }

        } catch (e) {
            console.log('Prison handler error:', e.message);
            return bot.answerCallbackQuery(query.id, { text: '❌ خطا! دوباره تلاش کن.' });
        }
    });
}

module.exports = { setupPrisonHandlers };