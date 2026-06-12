const { bot, player, mainMenu, activeBattles, sendAnimation, sendPhoto } = require('./core');
const config = require('../config');

function setupFightHandlers() {

    bot.on('callback_query', async (query) => {
        const chatId = query.message.chat.id;
        const msgId = query.message.message_id;
        const data = query.data;
        const p = player.getPlayer(chatId);

        if (!p) return;
        if (!data || !data.startsWith('battle_')) return;

        try {
            const enemy = activeBattles[chatId];
            if (!enemy) {
                await bot.deleteMessage(chatId, msgId).catch(() => {});
                await bot.sendMessage(chatId, '❌ نبرد تموم شده!', { parse_mode: 'Markdown', ...mainMenu() });
                return bot.answerCallbackQuery(query.id);
            }

            let result;

            if (data === 'battle_attack') {
                const { playerAttack } = require('../fight');
                result = playerAttack(p, enemy);
            } else if (data === 'battle_spell') {
                const { useSpell } = require('../fight');
                result = useSpell(p, enemy);
            } else if (data === 'battle_finisher') {
                const { useFinisher } = require('../fight');
                result = useFinisher(p, enemy);
            } else if (data === 'battle_escape') {
                const { playerEscape } = require('../fight');
                result = playerEscape(p, enemy);
            } else {
                return bot.answerCallbackQuery(query.id);
            }

            // ============ نبرد تموم شد ============
            if (result.battleOver) {
                delete activeBattles[chatId];

                // اسیر کردن NPC
                if (result.canCapture && result.npcId) {
                    const { captureNpc } = require('../prison');
                    const captureResult = captureNpc(p, result.npcId);
                    const npcData = config.images.npcs?.[result.npcId] || config.images.enemies?.[result.npcId];
                    
                    await bot.deleteMessage(chatId, msgId).catch(() => {});
                    
                    if (npcData && npcData.file_id) {
                        await sendPhoto(chatId, npcData.file_id, result.message + '\n\n' + captureResult.message, mainMenu());
                    } else if (result.animation) {
                        await sendAnimation(chatId, result.animation, result.message + '\n\n' + captureResult.message, mainMenu());
                    } else {
                        await bot.sendMessage(chatId, result.message + '\n\n' + captureResult.message, { parse_mode: 'Markdown', ...mainMenu() });
                    }
                    return bot.answerCallbackQuery(query.id);
                }

                // برد/باخت عادی
                await bot.deleteMessage(chatId, msgId).catch(() => {});
                
                if (result.animation) {
                    await sendAnimation(chatId, result.animation, result.message, mainMenu());
                } else {
                    await bot.sendMessage(chatId, result.message, { parse_mode: 'Markdown', ...mainMenu() });
                }
                return bot.answerCallbackQuery(query.id);
            }
            
            // ============ نبرد ادامه داره ============
            const { getBattleKeyboard } = require('../fight');
            
            await bot.deleteMessage(chatId, msgId).catch(() => {});
            
            if (result.animation) {
                await sendAnimation(chatId, result.animation, result.message, getBattleKeyboard(p, enemy));
            } else {
                await bot.sendMessage(chatId, result.message, { parse_mode: 'Markdown', ...getBattleKeyboard(p, enemy) });
            }
            
            return bot.answerCallbackQuery(query.id);

        } catch (e) {
            console.log('Fight handler error:', e.message);
            await bot.deleteMessage(chatId, msgId).catch(() => {});
            await bot.sendMessage(chatId, '❌ خطا در نبرد! /start بزن.', { parse_mode: 'Markdown', ...mainMenu() });
            if (activeBattles[chatId]) delete activeBattles[chatId];
            return bot.answerCallbackQuery(query.id);
        }
    });
}

module.exports = { setupFightHandlers };