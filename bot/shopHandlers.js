const { bot, player, mainMenu } = require('./core');

function setupShopHandlers() {

    // =============================================
    // 🛒 callback_query های بازار و بلک مارکت
    // =============================================
    bot.on('callback_query', async (query) => {
        const chatId = query.message.chat.id;
        const msgId = query.message.message_id;
        const data = query.data;
        const p = player.getPlayer(chatId);

        if (!p) return;

        try {

            // =============================================
            // 🏪 برگشت به منوی بازار
            // =============================================
            if (data === 'shop_back') {
                const { showShopMenu, getShopKeyboard } = require('../shop');
                await bot.editMessageText(showShopMenu() + `\n\n👑 طلای تو: ${p.inventory?.gold || 0}`, {
                    chat_id: chatId, message_id: msgId, parse_mode: 'Markdown', ...getShopKeyboard()
                });
                return bot.answerCallbackQuery(query.id);
            }

            // =============================================
            // 🕶️ بازار مکاره
            // =============================================
            if (data === 'shop_blackmarket') {
                const { formatBlackMarket, getBlackMarketKeyboard } = require('../blackMarket');
                await bot.editMessageText(formatBlackMarket(p), {
                    chat_id: chatId, message_id: msgId, parse_mode: 'Markdown', ...getBlackMarketKeyboard(p)
                });
                return bot.answerCallbackQuery(query.id);
            }

            // =============================================
            // 🛒 خرید از بلک مارکت
            // =============================================
            if (data.startsWith('bm_buy_')) {
                const itemId = parseInt(data.replace('bm_buy_', ''));
                const { buyBlackMarketItem, formatBlackMarket, getBlackMarketKeyboard } = require('../blackMarket');
                const result = buyBlackMarketItem(p, itemId);
                await bot.editMessageText(formatBlackMarket(p), {
                    chat_id: chatId, message_id: msgId, parse_mode: 'Markdown', ...getBlackMarketKeyboard(p)
                });
                return bot.answerCallbackQuery(query.id, { text: result.message.replace(/[*_]/g, '').replace(/\n/g, ' '), show_alert: true });
            }

            // =============================================
            // 🤝 معامله ویژه بلک مارکت
            // =============================================
            if (data === 'bm_special_deal') {
                const { acceptSpecialDeal, formatBlackMarket, getBlackMarketKeyboard } = require('../blackMarket');
                const result = acceptSpecialDeal(p);
                await bot.editMessageText(formatBlackMarket(p), {
                    chat_id: chatId, message_id: msgId, parse_mode: 'Markdown', ...getBlackMarketKeyboard(p)
                });
                return bot.answerCallbackQuery(query.id, { text: result.message.replace(/[*_]/g, '').replace(/\n/g, ' '), show_alert: true });
            }

            // =============================================
            // 🛒 خرید از بازار (کلیک روی دکمه خرید)
            // =============================================
            if (data.startsWith('shop_buy_')) {
                const item = data.replace('shop_buy_', '');
                const { startBuy, getShopKeyboard } = require('../shop');
                const result = startBuy(p, item);

                if (result.needAmount) {
                    // نیاز به تعداد داره - پیام جدید با دکمه لغو
                    const cancelKeyboard = {
                        reply_markup: {
                            inline_keyboard: [
                                [{ text: '❌ لغو', callback_data: 'shop_cancel' }]
                            ]
                        }
                    };
                    await bot.sendMessage(chatId, result.message, { parse_mode: 'Markdown', ...cancelKeyboard });
                    return bot.answerCallbackQuery(query.id, { text: 'عدد رو تایپ کن' });
                } else {
                    // خرید مستقیم (فنیشر، انرژی)
                    await bot.editMessageText(`🏪 *بازار*\n\n${result.message}\n\n👑 طلای تو: ${p.inventory?.gold || 0}`, {
                        chat_id: chatId, message_id: msgId, parse_mode: 'Markdown', ...getShopKeyboard()
                    });
                    return bot.answerCallbackQuery(query.id, { text: result.message.replace(/[*_]/g, ''), show_alert: true });
                }
            }

            // =============================================
            // 📤 فروش از بازار (کلیک روی دکمه فروش)
            // =============================================
            if (data.startsWith('shop_sell_')) {
                const item = data.replace('shop_sell_', '');
                const { startSell } = require('../shop');
                const result = startSell(p, item);

                if (result.needAmount) {
                    const cancelKeyboard = {
                        reply_markup: {
                            inline_keyboard: [
                                [{ text: '❌ لغو', callback_data: 'shop_cancel' }]
                            ]
                        }
                    };
                    await bot.sendMessage(chatId, result.message, { parse_mode: 'Markdown', ...cancelKeyboard });
                    return bot.answerCallbackQuery(query.id, { text: 'عدد رو تایپ کن' });
                } else {
                    // فروش مستقیم (الماس)
                    const { getShopKeyboard } = require('../shop');
                    await bot.editMessageText(`🏪 *بازار*\n\n${result.message}\n\n👑 طلای تو: ${p.inventory?.gold || 0}`, {
                        chat_id: chatId, message_id: msgId, parse_mode: 'Markdown', ...getShopKeyboard()
                    });
                    return bot.answerCallbackQuery(query.id, { text: result.message.replace(/[*_]/g, ''), show_alert: true });
                }
            }

            // =============================================
            // ❌ لغو خرید/فروش
            // =============================================
            if (data === 'shop_cancel') {
                const { cancelShop } = require('../shop');
                const result = cancelShop(p);
                await bot.editMessageText(result.message, { chat_id: chatId, message_id: msgId, parse_mode: 'Markdown' });
                return bot.answerCallbackQuery(query.id);
            }

        } catch (e) {
            console.log('Shop handler error:', e.message);
            return bot.answerCallbackQuery(query.id, { text: '❌ خطا!', show_alert: false });
        }
    });

    // =============================================
    // 🔢 هندلر عدد تایپ شده برای خرید/فروش
    // =============================================
    bot.on('message', async (msg) => {
        const chatId = msg.chat.id;
        const text = msg.text;
        if (!text || text.startsWith('/')) return;

        const p = player.getPlayer(chatId);
        if (!p) return;

        const { getShopState, processAmount, getShopKeyboard } = require('../shop');
        const state = getShopState(p);
        if (!state) return;

        // فقط اگه توی حالت خرید/فروش باشه
        const num = parseInt(text);
        if (isNaN(num) || num <= 0) {
            return bot.sendMessage(chatId, '❌ یه عدد معتبر وارد کن! (مثلاً ۵)');
        }

        const result = processAmount(p, text);
        if (result.message) {
            await bot.sendMessage(chatId, result.message, { parse_mode: 'Markdown', ...getShopKeyboard() });
        }
    });
}

module.exports = { setupShopHandlers };