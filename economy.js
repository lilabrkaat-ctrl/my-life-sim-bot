const config = require('./config');
const player = require('./player');

function economyMenu() {
    return {
        reply_markup: {
            inline_keyboard: [
                [{ text: '🏦 خزانه', callback_data: 'eco_treasury' }, { text: '🛢️ نفت و گاز', callback_data: 'eco_oil' }],
                [{ text: '💳 مالیات', callback_data: 'eco_tax' }, { text: '📊 بازار', callback_data: 'eco_market' }],
                [{ text: '🏗️ توسعه', callback_data: 'eco_build' }, { text: '👥 مردم', callback_data: 'eco_people' }],
                [{ text: '🪙 ذخایر', callback_data: 'eco_reserves' }, { text: '🔙 برگشت', callback_data: 'menu_main' }]
            ]
        }
    };
}

function setupEconomyHandlers(bot) {
    
    bot.on('callback_query', async (query) => {
        const chatId = query.message.chat.id;
        const msgId = query.message.message_id;
        const userId = query.from.id;
        const data = query.data;
        
        if (!data.startsWith('eco_')) return;
        
        const p = player.getPlayer(userId);
        
        // منوی اقتصاد
        if (data === 'menu_economy') {
            await bot.editMessageText(
                '💰 *اقتصاد امپراطوری*\n\n' +
                `🏦 خزانه: ${p.treasury} دلار\n` +
                `🛢️ نفت: ${p.oil} بشکه\n` +
                `🪙 طلا: ${p.gold} کیلو\n` +
                `😊 مردم: ${p.popularity}٪ راضی\n\n` +
                'عملیات:',
                { chat_id: chatId, message_id: msgId, parse_mode: 'Markdown', ...economyMenu() }
            );
            return bot.answerCallbackQuery(query.id);
        }
        
        // 🏦 خزانه
        if (data === 'eco_treasury') {
            await bot.editMessageText(
                '🏦 *خزانه سلطنتی*\n\n' +
                `💰 موجودی: ${p.treasury} دلار\n` +
                `🛢️ ارزش نفت: ${p.oil * config.prices.oil} دلار\n` +
                `🪙 ارزش طلا: ${p.gold * config.prices.gold} دلار\n\n` +
                `💵 قیمت دلار: ${config.prices.dollar} تومان\n` +
                `🛢️ قیمت نفت: ${config.prices.oil} دلار\n` +
                `🪙 قیمت طلا: ${config.prices.gold} دلار`,
                { chat_id: chatId, message_id: msgId, parse_mode: 'Markdown',
                  reply_markup: { inline_keyboard: [[{ text: '🔙 برگشت', callback_data: 'menu_economy' }]] } }
            );
            return bot.answerCallbackQuery(query.id);
        }
        
        // 🛢️ نفت و گاز
        if (data === 'eco_oil') {
            await bot.editMessageText(
                '🛢️ *نفت و گاز*\n\n' +
                `🛢️ ذخیره نفت: ${p.oil} بشکه\n` +
                `💰 قیمت هر بشکه: ${config.prices.oil} دلار\n` +
                `💵 ارزش کل: ${p.oil * config.prices.oil} دلار\n\n` +
                'عملیات:',
                { chat_id: chatId, message_id: msgId, parse_mode: 'Markdown',
                  reply_markup: {
                      inline_keyboard: [
                          [{ text: '🛢️ استخراج نفت', callback_data: 'eco_extract_oil' }],
                          [{ text: '💰 فروش نفت', callback_data: 'eco_sell_oil' }],
                          [{ text: '🔙 برگشت', callback_data: 'menu_economy' }]
                      ]
                  }
                }
            );
            return bot.answerCallbackQuery(query.id);
        }
        
        // استخراج نفت
        if (data === 'eco_extract_oil') {
            const extracted = Math.floor(Math.random() * 100) + 50;
            player.addOil(userId, extracted);
            
            await bot.editMessageText(
                '🛢️ *استخراج نفت*\n\n' +
                `✅ ${extracted} بشکه نفت استخراج شد!\n` +
                `🛢️ ذخیره فعلی: ${p.oil} بشکه`,
                { chat_id: chatId, message_id: msgId, parse_mode: 'Markdown',
                  reply_markup: { inline_keyboard: [[{ text: '🔙 برگشت', callback_data: 'eco_oil' }]] } }
            );
            return bot.answerCallbackQuery(query.id);
        }
        
        // فروش نفت
        if (data === 'eco_sell_oil') {
            if (p.oil < 50) {
                return bot.answerCallbackQuery(query.id, { text: '❌ نفت کافی نداری! حداقل ۵۰ بشکه', show_alert: true });
            }
            
            const sold = 50;
            const earned = sold * config.prices.oil;
            p.oil -= sold;
            p.treasury += earned;
            
            await bot.editMessageText(
                '💰 *فروش نفت*\n\n' +
                `🛢️ فروخته شده: ${sold} بشکه\n` +
                `💰 درآمد: ${earned} دلار\n` +
                `🏦 خزانه: ${p.treasury} دلار`,
                { chat_id: chatId, message_id: msgId, parse_mode: 'Markdown',
                  reply_markup: { inline_keyboard: [[{ text: '🔙 برگشت', callback_data: 'eco_oil' }]] } }
            );
            return bot.answerCallbackQuery(query.id);
        }
        
        // 💳 مالیات
        if (data === 'eco_tax') {
            const taxIncome = Math.floor(p.popularity * 10);
            p.treasury += taxIncome;
            p.popularity = Math.max(0, p.popularity - 5);
            
            await bot.editMessageText(
                '💳 *جمع‌آوری مالیات*\n\n' +
                `💰 درآمد مالیات: ${taxIncome} دلار\n` +
                `📊 محبوبیت: -۵٪ (مردم ناراضی)\n` +
                `🏦 خزانه: ${p.treasury} دلار`,
                { chat_id: chatId, message_id: msgId, parse_mode: 'Markdown',
                  reply_markup: { inline_keyboard: [[{ text: '🔙 برگشت', callback_data: 'menu_economy' }]] } }
            );
            return bot.answerCallbackQuery(query.id);
        }
        
        // 📊 بازار
        if (data === 'eco_market') {
            await bot.editMessageText(
                '📊 *بازار جهانی*\n\n' +
                `💵 دلار: ${config.prices.dollar} تومان\n` +
                `🛢️ نفت: ${config.prices.oil} دلار/بشکه\n` +
                `🪙 طلا: ${config.prices.gold} دلار/کیلو\n\n` +
                'عملیات:',
                { chat_id: chatId, message_id: msgId, parse_mode: 'Markdown',
                  reply_markup: {
                      inline_keyboard: [
                          [{ text: '🪙 خرید طلا', callback_data: 'eco_buy_gold' }],
                          [{ text: '💰 فروش طلا', callback_data: 'eco_sell_gold' }],
                          [{ text: '🔙 برگشت', callback_data: 'menu_economy' }]
                      ]
                  }
                }
            );
            return bot.answerCallbackQuery(query.id);
        }
        
        // خرید طلا
        if (data === 'eco_buy_gold') {
            const cost = config.prices.gold;
            if (p.treasury < cost) {
                return bot.answerCallbackQuery(query.id, { text: `❌ پول کافی نداری! نیاز: ${cost} دلار`, show_alert: true });
            }
            
            p.treasury -= cost;
            player.addGold(userId, 1);
            
            await bot.editMessageText(
                '🪙 *خرید طلا*\n\n' +
                `✅ ۱ کیلو طلا خریداری شد!\n` +
                `💰 هزینه: ${cost} دلار\n` +
                `🪙 طلای فعلی: ${p.gold} کیلو`,
                { chat_id: chatId, message_id: msgId, parse_mode: 'Markdown',
                  reply_markup: { inline_keyboard: [[{ text: '🔙 برگشت', callback_data: 'eco_market' }]] } }
            );
            return bot.answerCallbackQuery(query.id);
        }
        
        // فروش طلا
        if (data === 'eco_sell_gold') {
            if (p.gold < 1) {
                return bot.answerCallbackQuery(query.id, { text: '❌ طلا نداری!', show_alert: true });
            }
            
            const earned = config.prices.gold;
            p.gold -= 1;
            p.treasury += earned;
            
            await bot.editMessageText(
                '💰 *فروش طلا*\n\n' +
                `✅ ۱ کیلو طلا فروخته شد!\n` +
                `💰 درآمد: ${earned} دلار\n` +
                `🏦 خزانه: ${p.treasury} دلار`,
                { chat_id: chatId, message_id: msgId, parse_mode: 'Markdown',
                  reply_markup: { inline_keyboard: [[{ text: '🔙 برگشت', callback_data: 'eco_market' }]] } }
            );
            return bot.answerCallbackQuery(query.id);
        }
        
        // 🏗️ توسعه
        if (data === 'eco_build') {
            const cost = 2000;
            if (p.treasury < cost) {
                return bot.answerCallbackQuery(query.id, { text: `❌ پول کافی نداری! نیاز: ${cost} دلار`, show_alert: true });
            }
            
            p.treasury -= cost;
            p.popularity = Math.min(100, p.popularity + 15);
            p.defense += 5;
            
            await bot.editMessageText(
                '🏗️ *توسعه امپراطوری*\n\n' +
                '✅ بیمارستان، مدرسه و جاده ساخته شد!\n' +
                `💰 هزینه: ${cost} دلار\n` +
                `📊 محبوبیت: +۱۵٪\n` +
                `🛡️ دفاع: +۵`,
                { chat_id: chatId, message_id: msgId, parse_mode: 'Markdown',
                  reply_markup: { inline_keyboard: [[{ text: '🔙 برگشت', callback_data: 'menu_economy' }]] } }
            );
            return bot.answerCallbackQuery(query.id);
        }
        
        // 👥 مردم
        if (data === 'eco_people') {
            await bot.editMessageText(
                '👥 *وضعیت مردم*\n\n' +
                `😊 رضایت: ${p.popularity}%\n` +
                `👥 جمعیت: ${p.popularity * 1000} نفر\n` +
                `💼 اشتغال: ${Math.min(100, p.popularity + 20)}%\n\n` +
                'عملیات:',
                { chat_id: chatId, message_id: msgId, parse_mode: 'Markdown',
                  reply_markup: {
                      inline_keyboard: [
                          [{ text: '🍞 توزیع غذا', callback_data: 'eco_food' }],
                          [{ text: '💰 یارانه', callback_data: 'eco_subsidy' }],
                          [{ text: '🔙 برگشت', callback_data: 'menu_economy' }]
                      ]
                  }
                }
            );
            return bot.answerCallbackQuery(query.id);
        }
        
        // توزیع غذا
        if (data === 'eco_food') {
            const cost = 300;
            if (p.treasury < cost) {
                return bot.answerCallbackQuery(query.id, { text: '❌ پول کافی نداری!', show_alert: true });
            }
            
            p.treasury -= cost;
            p.popularity = Math.min(100, p.popularity + 10);
            
            await bot.editMessageText(
                '🍞 *توزیع غذا*\n\n' +
                `✅ غذا بین مردم توزیع شد!\n` +
                `💰 هزینه: ${cost} دلار\n` +
                `😊 رضایت: +۱۰٪`,
                { chat_id: chatId, message_id: msgId, parse_mode: 'Markdown',
                  reply_markup: { inline_keyboard: [[{ text: '🔙 برگشت', callback_data: 'eco_people' }]] } }
            );
            return bot.answerCallbackQuery(query.id);
        }
        
        // یارانه
        if (data === 'eco_subsidy') {
            const cost = 500;
            if (p.treasury < cost) {
                return bot.answerCallbackQuery(query.id, { text: '❌ پول کافی نداری!', show_alert: true });
            }
            
            p.treasury -= cost;
            p.popularity = Math.min(100, p.popularity + 20);
            
            await bot.editMessageText(
                '💰 *یارانه*\n\n' +
                `✅ یارانه به مردم پرداخت شد!\n` +
                `💰 هزینه: ${cost} دلار\n` +
                `😊 رضایت: +۲۰٪`,
                { chat_id: chatId, message_id: msgId, parse_mode: 'Markdown',
                  reply_markup: { inline_keyboard: [[{ text: '🔙 برگشت', callback_data: 'eco_people' }]] } }
            );
            return bot.answerCallbackQuery(query.id);
        }
        
        // 🪙 ذخایر
        if (data === 'eco_reserves') {
            await bot.editMessageText(
                '🪙 *ذخایر ملی*\n\n' +
                `💰 خزانه: ${p.treasury} دلار\n` +
                `🛢️ نفت: ${p.oil} بشکه (${p.oil * config.prices.oil} دلار)\n` +
                `🪙 طلا: ${p.gold} کیلو (${p.gold * config.prices.gold} دلار)\n` +
                `💵 مجموع دارایی: ${p.treasury + (p.oil * config.prices.oil) + (p.gold * config.prices.gold)} دلار`,
                { chat_id: chatId, message_id: msgId, parse_mode: 'Markdown',
                  reply_markup: { inline_keyboard: [[{ text: '🔙 برگشت', callback_data: 'menu_economy' }]] } }
            );
            return bot.answerCallbackQuery(query.id);
        }
    });
}

module.exports = { economyMenu, setupEconomyHandlers };