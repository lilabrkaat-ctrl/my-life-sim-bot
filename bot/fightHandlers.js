const { bot, player, mainMenu, activeBattles, sendAnimation } = require('./core');

function setupFightHandlers() {

    // =============================================
    // ⚔️ هندلر callback_query های نبرد
    // =============================================
    bot.on('callback_query', async (query) => {
        const chatId = query.message.chat.id;
        const msgId = query.message.message_id;
        const data = query.data;
        const p = player.getPlayer(chatId);

        if (!p) return;

        // فقط callbackهای نبرد رو هندل کن
        if (!data.startsWith('battle_')) return;

        try {

            // =============================================
            // ⚔️ حمله
            // =============================================
            if (data === 'battle_attack') {
                if (!activeBattles[chatId]) {
                    await bot.editMessageText('❌ نبردی در جریان نیست!', { chat_id: chatId, message_id: msgId, parse_mode: 'Markdown', ...mainMenu() });
                    return bot.answerCallbackQuery(query.id);
                }

                const enemy = activeBattles[chatId];
                const { playerAttack } = require('../fight');
                const result = playerAttack(p, enemy);

                if (result.battleOver) {
                    delete activeBattles[chatId];

                    if (result.canCapture) {
                        const { captureNpc } = require('../prison');
                        const captureResult = captureNpc(p, result.npcId);
                        await bot.editMessageText(result.message + '\n\n' + captureResult.message, {
                            chat_id: chatId, message_id: msgId, parse_mode: 'Markdown', ...mainMenu()
                        });
                        return bot.answerCallbackQuery(query.id);
                    }

                    if (result.animation) {
                        try {
                            await bot.deleteMessage(chatId, msgId);
                            await sendAnimation(chatId, result.animation, result.message, mainMenu());
                        } catch (e) {
                            await bot.editMessageText(result.message, {
                                chat_id: chatId, message_id: msgId, parse_mode: 'Markdown', ...mainMenu()
                            });
                        }
                    } else {
                        await bot.editMessageText(result.message, {
                            chat_id: chatId, message_id: msgId, parse_mode: 'Markdown', ...mainMenu()
                        });
                    }
                    return bot.answerCallbackQuery(query.id);
                } else {
                    // نبرد ادامه داره
                    const { getBattleKeyboard } = require('../fight');
                    await bot.editMessageText(result.message, {
                        chat_id: chatId, message_id: msgId, parse_mode: 'Markdown', ...getBattleKeyboard(p, enemy)
                    });
                    return bot.answerCallbackQuery(query.id);
                }
            }

            // =============================================
            // 📜 طلسم
            // =============================================
            if (data === 'battle_spell') {
                if (!activeBattles[chatId]) {
                    await bot.editMessageText('❌ نبردی در جریان نیست!', { chat_id: chatId, message_id: msgId, parse_mode: 'Markdown', ...mainMenu() });
                    return bot.answerCallbackQuery(query.id);
                }

                const enemy = activeBattles[chatId];
                const { useSpell } = require('../fight');
                const result = useSpell(p, enemy);

                if (result.battleOver) {
                    delete activeBattles[chatId];

                    if (result.canCapture) {
                        const { captureNpc } = require('../prison');
                        const captureResult = captureNpc(p, result.npcId);
                        await bot.editMessageText(result.message + '\n\n' + captureResult.message, {
                            chat_id: chatId, message_id: msgId, parse_mode: 'Markdown', ...mainMenu()
                        });
                        return bot.answerCallbackQuery(query.id);
                    }

                    if (result.animation) {
                        try {
                            await bot.deleteMessage(chatId, msgId);
                            await sendAnimation(chatId, result.animation, result.message, mainMenu());
                        } catch (e) {
                            await bot.editMessageText(result.message, {
                                chat_id: chatId, message_id: msgId, parse_mode: 'Markdown', ...mainMenu()
                            });
                        }
                    } else {
                        await bot.editMessageText(result.message, {
                            chat_id: chatId, message_id: msgId, parse_mode: 'Markdown', ...mainMenu()
                        });
                    }
                    return bot.answerCallbackQuery(query.id);
                } else {
                    const { getBattleKeyboard } = require('../fight');
                    await bot.editMessageText(result.message, {
                        chat_id: chatId, message_id: msgId, parse_mode: 'Markdown', ...getBattleKeyboard(p, enemy)
                    });
                    return bot.answerCallbackQuery(query.id);
                }
            }

            // =============================================
            // 💀 فنیشر
            // =============================================
            if (data === 'battle_finisher') {
                if (!activeBattles[chatId]) {
                    await bot.editMessageText('❌ نبردی در جریان نیست!', { chat_id: chatId, message_id: msgId, parse_mode: 'Markdown', ...mainMenu() });
                    return bot.answerCallbackQuery(query.id);
                }

                const enemy = activeBattles[chatId];
                const { useFinisher } = require('../fight');
                const result = useFinisher(p, enemy);
                delete activeBattles[chatId];

                if (result.canCapture) {
                    const { captureNpc } = require('../prison');
                    const captureResult = captureNpc(p, result.npcId);
                    await bot.editMessageText(result.message + '\n\n' + captureResult.message, {
                        chat_id: chatId, message_id: msgId, parse_mode: 'Markdown', ...mainMenu()
                    });
                    return bot.answerCallbackQuery(query.id);
                }

                if (result.animation) {
                    try {
                        await bot.deleteMessage(chatId, msgId);
                        await sendAnimation(chatId, result.animation, result.message, mainMenu());
                    } catch (e) {
                        await bot.editMessageText(result.message, {
                            chat_id: chatId, message_id: msgId, parse_mode: 'Markdown', ...mainMenu()
                        });
                    }
                } else {
                    await bot.editMessageText(result.message, {
                        chat_id: chatId, message_id: msgId, parse_mode: 'Markdown', ...mainMenu()
                    });
                }
                return bot.answerCallbackQuery(query.id);
            }

            // =============================================
            // 🏃 فرار
            // =============================================
            if (data === 'battle_escape') {
                if (!activeBattles[chatId]) {
                    await bot.editMessageText('❌ نبردی در جریان نیست!', { chat_id: chatId, message_id: msgId, parse_mode: 'Markdown', ...mainMenu() });
                    return bot.answerCallbackQuery(query.id);
                }

                const enemy = activeBattles[chatId];
                const { playerEscape } = require('../fight');
                const result = playerEscape(p, enemy);

                if (result.battleOver) {
                    delete activeBattles[chatId];
                    if (result.animation) {
                        try {
                            await bot.deleteMessage(chatId, msgId);
                            await sendAnimation(chatId, result.animation, result.message, mainMenu());
                        } catch (e) {
                            await bot.editMessageText(result.message, {
                                chat_id: chatId, message_id: msgId, parse_mode: 'Markdown', ...mainMenu()
                            });
                        }
                    } else {
                        await bot.editMessageText(result.message, {
                            chat_id: chatId, message_id: msgId, parse_mode: 'Markdown', ...mainMenu()
                        });
                    }
                    return bot.answerCallbackQuery(query.id);
                } else {
                    const { getBattleKeyboard } = require('../fight');
                    await bot.editMessageText(result.message, {
                        chat_id: chatId, message_id: msgId, parse_mode: 'Markdown', ...getBattleKeyboard(p, enemy)
                    });
                    return bot.answerCallbackQuery(query.id);
                }
            }

        } catch (e) {
            console.log('Fight handler error:', e.message);
            return bot.answerCallbackQuery(query.id, { text: '❌ خطا! دوباره تلاش کن.' });
        }
    });
}

module.exports = { setupFightHandlers };