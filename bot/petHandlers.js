const { bot, player, mainMenu, sendPhoto } = require('./core');

function setupPetHandlers() {

    bot.on('callback_query', async (query) => {
        const chatId = query.message.chat.id;
        const msgId = query.message.message_id;
        const data = query.data;
        const p = player.getPlayer(chatId);

        if (!p) return;
        if (!data.startsWith('pet_')) return;

        try {

            // =============================================
            // 🐾 منوی حیوانات
            // =============================================
            if (data === 'pet_menu') {
                const { formatPets, getPetKeyboard } = require('../pet');
                await bot.editMessageText(formatPets(p), {
                    chat_id: chatId, message_id: msgId, parse_mode: 'Markdown', ...getPetKeyboard(p)
                });
                return bot.answerCallbackQuery(query.id);
            }

            // =============================================
            // 🍖 غذا دادن به همه
            // =============================================
            if (data === 'pet_feed_all') {
                const { feedAllPets, formatPets, getPetKeyboard } = require('../pet');
                const result = feedAllPets(p);
                await bot.editMessageText(formatPets(p), {
                    chat_id: chatId, message_id: msgId, parse_mode: 'Markdown', ...getPetKeyboard(p)
                });
                return bot.answerCallbackQuery(query.id, { text: result.message.replace(/[*_]/g, '').substring(0, 100), show_alert: true });
            }

            // =============================================
            // 🍖 غذا دادن به یه حیوون
            // =============================================
            if (data.startsWith('pet_feed_')) {
                const petId = data.replace('pet_feed_', '');
                const { feedPet, formatPets, getPetKeyboard } = require('../pet');
                const result = feedPet(p, petId);

                if (result.image) {
                    await bot.deleteMessage(chatId, msgId).catch(() => {});
                    await sendPhoto(chatId, result.image, result.message, getPetKeyboard(p));
                } else {
                    await bot.editMessageText(result.message, {
                        chat_id: chatId, message_id: msgId, parse_mode: 'Markdown', ...getPetKeyboard(p)
                    });
                }
                return bot.answerCallbackQuery(query.id, { text: result.message.replace(/[*_]/g, '').substring(0, 100) });
            }

            // =============================================
            // 💔 آزاد کردن حیوون
            // =============================================
            if (data.startsWith('pet_release_')) {
                const petId = data.replace('pet_release_', '');
                const { releasePet, formatPets, getPetKeyboard } = require('../pet');
                const result = releasePet(p, petId);
                await bot.editMessageText(formatPets(p), {
                    chat_id: chatId, message_id: msgId, parse_mode: 'Markdown', ...getPetKeyboard(p)
                });
                return bot.answerCallbackQuery(query.id, { text: result.message.replace(/[*_]/g, ''), show_alert: true });
            }

        } catch (e) {
            console.log('Pet handler error:', e.message);
            return bot.answerCallbackQuery(query.id, { text: '❌ خطا!' });
        }
    });
}

module.exports = { setupPetHandlers };