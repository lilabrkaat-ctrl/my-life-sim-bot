const player = require('./player');

function parliamentMenu() {
    return {
        reply_markup: {
            inline_keyboard: [
                [{ text: '💰 اقتصادی', callback_data: 'parl_economy' }, { text: '⚔️ امنیت ملی', callback_data: 'parl_security' }],
                [{ text: '🛢️ انرژی', callback_data: 'parl_energy' }, { text: '📱 فناوری', callback_data: 'parl_tech' }],
                [{ text: '👥 اجتماعی', callback_data: 'parl_social' }, { text: '🌍 سیاست خارجی', callback_data: 'parl_foreign' }],
                [{ text: '🎓 آموزش', callback_data: 'parl_edu' }, { text: '🏥 بهداشت', callback_data: 'parl_health' }],
                [{ text: '⚖️ قضایی', callback_data: 'parl_justice' }, { text: '🔙 برگشت', callback_data: 'menu_main' }]
            ]
        }
    };
}

function setupParliamentHandlers(bot) {
    
    bot.on('callback_query', async (query) => {
        const chatId = query.message.chat.id;
        const msgId = query.message.message_id;
        const userId = query.from.id;
        const data = query.data;
        
        if (!data.startsWith('parl_')) return;
        
        const p = player.getPlayer(userId);
        
        // منوی مجلس
        if (data === 'menu_parliament') {
            await bot.editMessageText(
                '🏛️ *مجلس شورای اسلامی*\n\n' +
                '👔 رئیس: محمدباقر قالیباف\n\n' +
                'یک کمیسیون رو انتخاب کن:',
                { chat_id: chatId, message_id: msgId, parse_mode: 'Markdown', ...parliamentMenu() }
            );
            return bot.answerCallbackQuery(query.id);
        }
        
        // 💰 کمیسیون اقتصادی
        if (data === 'parl_economy') {
            await bot.editMessageText(
                '💰 *کمیسیون اقتصادی*\n\n' +
                `💵 نرخ دلار: ${require('../config').prices.dollar} تومان\n` +
                `🛢️ قیمت نفت: ${require('../config').prices.oil} دلار\n` +
                `🏦 خزانه: ${p.treasury} دلار\n\n` +
                'طرح‌های قابل تصویب:',
                { chat_id: chatId, message_id: msgId, parse_mode: 'Markdown',
                  reply_markup: {
                      inline_keyboard: [
                          [{ text: '📉 کاهش مالیات', callback_data: 'parl_tax_down' }],
                          [{ text: '📈 افزایش مالیات', callback_data: 'parl_tax_up' }],
                          [{ text: '💰 چاپ پول', callback_data: 'parl_print_money' }],
                          [{ text: '🔙 برگشت', callback_data: 'menu_parliament' }]
                      ]
                  }
                }
            );
            return bot.answerCallbackQuery(query.id);
        }
        
        // کاهش مالیات
        if (data === 'parl_tax_down') {
            p.popularity = Math.min(100, p.popularity + 15);
            p.treasury -= 200;
            
            await bot.editMessageText(
                '📉 *کاهش مالیات تصویب شد!*\n\n' +
                '😊 مردم خوشحال شدن\n' +
                '📊 محبوبیت: +۱۵٪\n' +
                '💰 هزینه: ۲۰۰ دلار از خزانه',
                { chat_id: chatId, message_id: msgId, parse_mode: 'Markdown',
                  reply_markup: { inline_keyboard: [[{ text: '🔙 برگشت', callback_data: 'parl_economy' }]] } }
            );
            return bot.answerCallbackQuery(query.id);
        }
        
        // افزایش مالیات
        if (data === 'parl_tax_up') {
            p.treasury += 500;
            p.popularity = Math.max(0, p.popularity - 10);
            
            await bot.editMessageText(
                '📈 *افزایش مالیات تصویب شد!*\n\n' +
                '😡 مردم ناراضی شدن\n' +
                '📊 محبوبیت: -۱۰٪\n' +
                '💰 درآمد: +۵۰۰ دلار به خزانه',
                { chat_id: chatId, message_id: msgId, parse_mode: 'Markdown',
                  reply_markup: { inline_keyboard: [[{ text: '🔙 برگشت', callback_data: 'parl_economy' }]] } }
            );
            return bot.answerCallbackQuery(query.id);
        }
        
        // چاپ پول
        if (data === 'parl_print_money') {
            p.treasury += 1000;
            require('../config').prices.dollar += 10000;
            p.popularity = Math.max(0, p.popularity - 20);
            
            await bot.editMessageText(
                '💰 *چاپ پول بدون پشتوانه!*\n\n' +
                '💵 تورم افزایش یافت!\n' +
                `دلار: ${require('../config').prices.dollar} تومان\n` +
                '📊 محبوبیت: -۲۰٪\n' +
                '💰 +۱۰۰۰ دلار به خزانه',
                { chat_id: chatId, message_id: msgId, parse_mode: 'Markdown',
                  reply_markup: { inline_keyboard: [[{ text: '🔙 برگشت', callback_data: 'parl_economy' }]] } }
            );
            return bot.answerCallbackQuery(query.id);
        }
        
        // ⚔️ امنیت ملی
        if (data === 'parl_security') {
            await bot.editMessageText(
                '⚔️ *کمیسیون امنیت ملی*\n\n' +
                `💂 ارتش: ${player.getTotalPower(userId)} قدرت\n` +
                `🛡️ دفاع: ${p.defense}\n` +
                `⚔️ جنگ‌های فعال: ${p.wars.length}\n\n` +
                'طرح‌ها:',
                { chat_id: chatId, message_id: msgId, parse_mode: 'Markdown',
                  reply_markup: {
                      inline_keyboard: [
                          [{ text: '🛡️ تقویت دفاع', callback_data: 'parl_defense' }],
                          [{ text: '📡 خرید رادار', callback_data: 'parl_radar' }],
                          [{ text: '🤝 پیمان دفاعی', callback_data: 'parl_pact' }],
                          [{ text: '🔙 برگشت', callback_data: 'menu_parliament' }]
                      ]
                  }
                }
            );
            return bot.answerCallbackQuery(query.id);
        }
        
        // تقویت دفاع
        if (data === 'parl_defense') {
            const cost = 1000;
            if (p.treasury < cost) {
                return bot.answerCallbackQuery(query.id, { text: '❌ پول کافی نداری!', show_alert: true });
            }
            
            p.treasury -= cost;
            p.defense += 10;
            
            await bot.editMessageText(
                '🛡️ *تقویت دفاع تصویب شد!*\n\n' +
                `🛡️ دفاع: +۱۰ (فعلی: ${p.defense})\n` +
                `💰 هزینه: ${cost} دلار`,
                { chat_id: chatId, message_id: msgId, parse_mode: 'Markdown',
                  reply_markup: { inline_keyboard: [[{ text: '🔙 برگشت', callback_data: 'parl_security' }]] } }
            );
            return bot.answerCallbackQuery(query.id);
        }
        
        // 📱 فناوری
        if (data === 'parl_tech') {
            await bot.editMessageText(
                '📱 *کمیسیون فناوری*\n\n' +
                'طرح‌های مرتبط با اینترنت و فیلترینگ:\n\n' +
                'وضعیت فعلی: اینترنت ملی با فیلترینگ',
                { chat_id: chatId, message_id: msgId, parse_mode: 'Markdown',
                  reply_markup: {
                      inline_keyboard: [
                          [{ text: '🌐 اینترنت آزاد', callback_data: 'parl_internet_free' }],
                          [{ text: '🚫 افزایش فیلترینگ', callback_data: 'parl_internet_block' }],
                          [{ text: '🤖 حمایت از AI', callback_data: 'parl_ai' }],
                          [{ text: '🔙 برگشت', callback_data: 'menu_parliament' }]
                      ]
                  }
                }
            );
            return bot.answerCallbackQuery(query.id);
        }
        
        // اینترنت آزاد
        if (data === 'parl_internet_free') {
            p.popularity = Math.min(100, p.popularity + 25);
            p.treasury -= 500;
            
            await bot.editMessageText(
                '🌐 *اینترنت آزاد تصویب شد!*\n\n' +
                '🎉 مردم خوشحال شدن\n' +
                '📊 محبوبیت: +۲۵٪\n' +
                '⚠️ احتمال نفوذ دشمن: +۲۰٪',
                { chat_id: chatId, message_id: msgId, parse_mode: 'Markdown',
                  reply_markup: { inline_keyboard: [[{ text: '🔙 برگشت', callback_data: 'parl_tech' }]] } }
            );
            return bot.answerCallbackQuery(query.id);
        }
        
        // 👥 اجتماعی
        if (data === 'parl_social') {
            await bot.editMessageText(
                '👥 *کمیسیون اجتماعی*\n\n' +
                `😊 رضایت مردم: ${p.popularity}%\n\n` +
                'طرح‌ها:',
                { chat_id: chatId, message_id: msgId, parse_mode: 'Markdown',
                  reply_markup: {
                      inline_keyboard: [
                          [{ text: '🎉 جشن ملی', callback_data: 'parl_festival' }],
                          [{ text: '👮 افزایش امنیت', callback_data: 'parl_police' }],
                          [{ text: '🏠 مسکن ملی', callback_data: 'parl_housing' }],
                          [{ text: '🔙 برگشت', callback_data: 'menu_parliament' }]
                      ]
                  }
                }
            );
            return bot.answerCallbackQuery(query.id);
        }
        
        // جشن ملی
        if (data === 'parl_festival') {
            const cost = 300;
            if (p.treasury < cost) {
                return bot.answerCallbackQuery(query.id, { text: '❌ پول کافی نداری!', show_alert: true });
            }
            
            p.treasury -= cost;
            p.popularity = Math.min(100, p.popularity + 10);
            
            await bot.editMessageText(
                '🎉 *جشن ملی برگزار شد!*\n\n' +
                '🥳 مردم شاد شدن\n' +
                '📊 محبوبیت: +۱۰٪\n' +
                `💰 هزینه: ${cost} دلار`,
                { chat_id: chatId, message_id: msgId, parse_mode: 'Markdown',
                  reply_markup: { inline_keyboard: [[{ text: '🔙 برگشت', callback_data: 'parl_social' }]] } }
            );
            return bot.answerCallbackQuery(query.id);
        }
        
        // 🌍 سیاست خارجی
        if (data === 'parl_foreign') {
            await bot.editMessageText(
                '🌍 *کمیسیون سیاست خارجی*\n\n' +
                `🤝 متحدان: ${p.alliances.length} کشور\n` +
                `⚔️ در جنگ: ${p.wars.length} کشور\n\n` +
                'طرح‌ها:',
                { chat_id: chatId, message_id: msgId, parse_mode: 'Markdown',
                  reply_markup: {
                      inline_keyboard: [
                          [{ text: '🤝 پیمان جدید', callback_data: 'parl_new_pact' }],
                          [{ text: '📜 قطع رابطه', callback_data: 'parl_cut_relations' }],
                          [{ text: '🔙 برگشت', callback_data: 'menu_parliament' }]
                      ]
                  }
                }
            );
            return bot.answerCallbackQuery(query.id);
        }
        
        // 🎓 آموزش
        if (data === 'parl_edu') {
            p.treasury -= 400;
            p.popularity = Math.min(100, p.popularity + 8);
            
            await bot.editMessageText(
                '🎓 *طرح آموزش تصویب شد!*\n\n' +
                '📚 دانشگاه‌ها تقویت شدن\n' +
                '📊 محبوبیت: +۸٪\n' +
                '💰 هزینه: ۴۰۰ دلار',
                { chat_id: chatId, message_id: msgId, parse_mode: 'Markdown',
                  reply_markup: { inline_keyboard: [[{ text: '🔙 برگشت', callback_data: 'menu_parliament' }]] } }
            );
            return bot.answerCallbackQuery(query.id);
        }
        
        // 🏥 بهداشت
        if (data === 'parl_health') {
            p.treasury -= 600;
            p.popularity = Math.min(100, p.popularity + 12);
            
            await bot.editMessageText(
                '🏥 *طرح بهداشت تصویب شد!*\n\n' +
                '💊 بیمارستان‌ها تجهیز شدن\n' +
                '📊 محبوبیت: +۱۲٪\n' +
                '💰 هزینه: ۶۰۰ دلار',
                { chat_id: chatId, message_id: msgId, parse_mode: 'Markdown',
                  reply_markup: { inline_keyboard: [[{ text: '🔙 برگشت', callback_data: 'menu_parliament' }]] } }
            );
            return bot.answerCallbackQuery(query.id);
        }
        
        // ⚖️ قضایی
        if (data === 'parl_justice') {
            await bot.editMessageText(
                '⚖️ *کمیسیون قضایی*\n\n' +
                `🔒 زندانیان: ${p.prisoners.length} نفر\n\n` +
                'طرح‌ها:',
                { chat_id: chatId, message_id: msgId, parse_mode: 'Markdown',
                  reply_markup: {
                      inline_keyboard: [
                          [{ text: '📜 عفو عمومی', callback_data: 'parl_amnesty' }],
                          [{ text: '⚖️ اعدام‌ها', callback_data: 'parl_execute' }],
                          [{ text: '🔙 برگشت', callback_data: 'menu_parliament' }]
                      ]
                  }
                }
            );
            return bot.answerCallbackQuery(query.id);
        }
        
        // عفو عمومی
        if (data === 'parl_amnesty') {
            const freed = p.prisoners.length;
            p.prisoners = [];
            p.popularity = Math.min(100, p.popularity + 10);
            
            await bot.editMessageText(
                '📜 *عفو عمومی تصویب شد!*\n\n' +
                `🔓 ${freed} زندانی آزاد شدن\n` +
                '📊 محبوبیت: +۱۰٪',
                { chat_id: chatId, message_id: msgId, parse_mode: 'Markdown',
                  reply_markup: { inline_keyboard: [[{ text: '🔙 برگشت', callback_data: 'parl_justice' }]] } }
            );
            return bot.answerCallbackQuery(query.id);
        }
    });
}

module.exports = { parliamentMenu, setupParliamentHandlers };