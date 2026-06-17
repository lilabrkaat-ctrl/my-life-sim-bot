const config = require('./config');
const player = require('./player');

function spyMenu() {
    return {
        reply_markup: {
            inline_keyboard: [
                [{ text: '🕵️ جاسوس بفرست', callback_data: 'spy_send' }, { text: '📋 گزارش‌ها', callback_data: 'spy_reports' }],
                [{ text: '🔍 کشف جاسوس', callback_data: 'spy_find' }, { text: '🔍 بازجویی', callback_data: 'spy_interrogate' }],
                [{ text: '💰 جاسوس دوجانبه', callback_data: 'spy_double' }, { text: '💀 اعدام جاسوس', callback_data: 'spy_execute' }],
                [{ text: '🔐 امنیت', callback_data: 'spy_security' }, { text: '🔙 برگشت', callback_data: 'menu_main' }]
            ]
        }
    };
}

function countryListForSpy(page = 0) {
    const countries = Object.entries(config.countries);
    const perPage = 6;
    const totalPages = Math.ceil(countries.length / perPage);
    const start = page * perPage;
    const pageCountries = countries.slice(start, start + perPage);
    
    let buttons = [];
    let row = [];
    
    for (let [key, country] of pageCountries) {
        row.push({ text: `${country.emoji} ${country.name}`, callback_data: `spy_target_${key}` });
        if (row.length === 2) { buttons.push(row); row = []; }
    }
    if (row.length > 0) buttons.push(row);
    
    let navRow = [];
    if (page > 0) navRow.push({ text: '⏪ قبلی', callback_data: `spy_page_${page - 1}` });
    navRow.push({ text: `📄 ${page + 1}/${totalPages}`, callback_data: 'none' });
    if (page < totalPages - 1) navRow.push({ text: 'بعدی ⏩', callback_data: `spy_page_${page + 1}` });
    buttons.push(navRow);
    
    buttons.push([{ text: '🔙 برگشت', callback_data: 'menu_spy' }]);
    
    return { reply_markup: { inline_keyboard: buttons } };
}

function setupSpyHandlers(bot) {
    
    bot.on('callback_query', async (query) => {
        const chatId = query.message.chat.id;
        const msgId = query.message.message_id;
        const userId = query.from.id;
        const data = query.data;
        
        if (!data.startsWith('spy_')) return;
        
        const p = player.getPlayer(userId);
        
        // منوی جاسوسی
        if (data === 'menu_spy') {
            await bot.editMessageText(
                '🕵️ *سازمان جاسوسی*\n\n' +
                `🕵️ جاسوس‌های فعال: ${p.spies.length}\n` +
                `🔐 امنیت: ${p.defense}%\n\n` +
                'عملیات:',
                { chat_id: chatId, message_id: msgId, parse_mode: 'Markdown', ...spyMenu() }
            );
            return bot.answerCallbackQuery(query.id);
        }
        
        // فرستادن جاسوس
        if (data === 'spy_send') {
            await bot.editMessageText(
                '🕵️ *فرستادن جاسوس*\n\n' +
                'کدوم کشور رو می‌خوای جاسوسی کنی؟',
                { chat_id: chatId, message_id: msgId, parse_mode: 'Markdown', ...countryListForSpy() }
            );
            return bot.answerCallbackQuery(query.id);
        }
        
        // صفحه‌بندی کشورها
        if (data.startsWith('spy_page_')) {
            const page = parseInt(data.replace('spy_page_', ''));
            await bot.editMessageText(
                '🕵️ *فرستادن جاسوس*\n\nکدوم کشور؟',
                { chat_id: chatId, message_id: msgId, parse_mode: 'Markdown', ...countryListForSpy(page) }
            );
            return bot.answerCallbackQuery(query.id);
        }
        
        // انتخاب کشور هدف
        if (data.startsWith('spy_target_')) {
            const countryKey = data.replace('spy_target_', '');
            const country = config.countries[countryKey];
            
            if (!country) return bot.answerCallbackQuery(query.id);
            
            await bot.editMessageText(
                `🕵️ *جاسوسی از ${country.emoji} ${country.name}*\n\n` +
                'سطح جاسوس رو انتخاب کن:\n\n' +
                '🟢 تازه‌کار: ۱۰۰ دلار - شانس ۴۰٪\n' +
                '🟡 حرفه‌ای: ۵۰۰ دلار - شانس ۶۰٪\n' +
                '🔴 خبره: ۱۰۰۰ دلار - شانس ۸۰٪',
                { chat_id: chatId, message_id: msgId, parse_mode: 'Markdown',
                  reply_markup: {
                      inline_keyboard: [
                          [{ text: '🟢 تازه‌کار (۱۰۰ دلار)', callback_data: `spy_do_${countryKey}_rookie` }],
                          [{ text: '🟡 حرفه‌ای (۵۰۰ دلار)', callback_data: `spy_do_${countryKey}_pro` }],
                          [{ text: '🔴 خبره (۱۰۰۰ دلار)', callback_data: `spy_do_${countryKey}_expert` }],
                          [{ text: '🔙 برگشت', callback_data: 'spy_send' }]
                      ]
                  }
                }
            );
            return bot.answerCallbackQuery(query.id);
        }
        
        // اجرای جاسوسی
        if (data.startsWith('spy_do_')) {
            const parts = data.split('_');
            const countryKey = parts[2];
            const level = parts[3];
            const country = config.countries[countryKey];
            
            const result = player.addSpy(userId, countryKey, level);
            
            if (!result.success) {
                return bot.answerCallbackQuery(query.id, { text: result.message, show_alert: true });
            }
            
            // نتیجه جاسوسی بعد از ۳ ثانیه
            setTimeout(async () => {
                const chance = level === 'expert' ? 0.8 : level === 'pro' ? 0.6 : 0.4;
                const success = Math.random() < chance;
                
                if (success) {
                    const info = {
                        power: country.power,
                        oil: country.oil,
                        gold: country.gold
                    };
                    
                    await bot.sendMessage(chatId,
                        '📋 *گزارش جاسوسی*\n\n' +
                        `${country.emoji} *${country.name}*\n\n` +
                        `⚡ قدرت نظامی: ${info.power}\n` +
                        `🛢️ ذخیره نفت: ${info.oil} بشکه\n` +
                        `🪙 ذخیره طلا: ${info.gold} کیلو\n\n` +
                        '✅ *جاسوسی موفق!*',
                        { parse_mode: 'Markdown' }
                    );
                } else {
                    await bot.sendMessage(chatId,
                        '🚨 *جاسوس لو رفت!*\n\n' +
                        `${country.emoji} ${country.name} جاسوس رو گرفتن!\n` +
                        '💀 جاسوس اعدام شد.\n' +
                        '📊 روابط: -۲۰٪',
                        { parse_mode: 'Markdown' }
                    );
                }
            }, 3000);
            
            await bot.editMessageText(
                '🕵️ *جاسوس در راهه...*\n\n' +
                `🎯 هدف: ${country.emoji} ${country.name}\n` +
                '⏰ ۳ ثانیه دیگه خبر میده...',
                { chat_id: chatId, message_id: msgId, parse_mode: 'Markdown',
                  reply_markup: { inline_keyboard: [[{ text: '🔙 برگشت', callback_data: 'menu_spy' }]] } }
            );
            return bot.answerCallbackQuery(query.id);
        }
        
        // گزارش‌ها
        if (data === 'spy_reports') {
            if (p.spies.length === 0) {
                await bot.editMessageText(
                    '📋 *گزارش‌ها*\n\n❌ هیچ جاسوس فعالی نداری!',
                    { chat_id: chatId, message_id: msgId, parse_mode: 'Markdown',
                      reply_markup: { inline_keyboard: [[{ text: '🔙 برگشت', callback_data: 'menu_spy' }]] } }
                );
                return bot.answerCallbackQuery(query.id);
            }
            
            let text = '📋 *جاسوس‌های فعال*\n\n';
            let buttons = [];
            
            for (let i = 0; i < p.spies.length; i++) {
                const spy = p.spies[i];
                const country = config.countries[spy.target];
                const ready = Date.now() > spy.reportReady;
                
                text += `${i+1}. ${country ? country.emoji : ''} ${country ? country.name : spy.target}\n`;
                text += `   سطح: ${spy.level}\n`;
                text += `   وضعیت: ${ready ? '✅ آماده' : '⏳ در مأموریت'}\n\n`;
            }
            
            buttons.push([{ text: '🔙 برگشت', callback_data: 'menu_spy' }]);
            
            await bot.editMessageText(
                text,
                { chat_id: chatId, message_id: msgId, parse_mode: 'Markdown',
                  reply_markup: { inline_keyboard: buttons } }
            );
            return bot.answerCallbackQuery(query.id);
        }
        
        // کشف جاسوس
        if (data === 'spy_find') {
            const found = Math.random() < 0.3;
            
            if (found) {
                const spyCountry = Object.keys(config.countries)[Math.floor(Math.random() * 10)];
                const spyName = config.countries[spyCountry] ? config.countries[spyCountry].name : 'ناشناس';
                
                player.addPrisoner(userId, `جاسوس ${spyName}`, 'جاسوسی');
                
                await bot.editMessageText(
                    '🔍 *جاسوس کشف شد!*\n\n' +
                    `🕵️ یه جاسوس از ${spyName} پیدا کردیم!\n` +
                    '🔒 فرستاده شد به زندان.',
                    { chat_id: chatId, message_id: msgId, parse_mode: 'Markdown',
                      reply_markup: { inline_keyboard: [[{ text: '🔙 برگشت', callback_data: 'menu_spy' }]] } }
                );
            } else {
                await bot.editMessageText(
                    '🔍 *بررسی امنیتی*\n\n' +
                    '✅ هیچ جاسوسی پیدا نشد.',
                    { chat_id: chatId, message_id: msgId, parse_mode: 'Markdown',
                      reply_markup: { inline_keyboard: [[{ text: '🔙 برگشت', callback_data: 'menu_spy' }]] } }
                );
            }
            return bot.answerCallbackQuery(query.id);
        }
        
        // بازجویی
        if (data === 'spy_interrogate') {
            const spies = p.prisoners.filter(pr => pr.reason === 'جاسوسی' && !pr.interrogated);
            
            if (spies.length === 0) {
                return bot.answerCallbackQuery(query.id, { text: '❌ هیچ جاسوس بازجویی‌نشده‌ای نداری!', show_alert: true });
            }
            
            const spy = spies[0];
            spy.interrogated = true;
            
            const talked = Math.random() < 0.5;
            
            if (talked) {
                p.treasury += 500;
                await bot.editMessageText(
                    '🔍 *بازجویی موفق!*\n\n' +
                    `${spy.name} لو داد!\n` +
                    '💰 اطلاعات فروخته شد: +۵۰۰ دلار',
                    { chat_id: chatId, message_id: msgId, parse_mode: 'Markdown',
                      reply_markup: { inline_keyboard: [[{ text: '🔙 برگشت', callback_data: 'menu_spy' }]] } }
                );
            } else {
                await bot.editMessageText(
                    '🔍 *بازجویی شکست خورد!*\n\n' +
                    `${spy.name} چیزی نگفت!`,
                    { chat_id: chatId, message_id: msgId, parse_mode: 'Markdown',
                      reply_markup: { inline_keyboard: [[{ text: '🔙 برگشت', callback_data: 'menu_spy' }]] } }
                );
            }
            return bot.answerCallbackQuery(query.id);
        }
        
        // امنیت
        if (data === 'spy_security') {
            const cost = 500;
            if (p.treasury < cost) {
                return bot.answerCallbackQuery(query.id, { text: '❌ پول کافی نداری!', show_alert: true });
            }
            
            p.treasury -= cost;
            p.defense += 3;
            
            await bot.editMessageText(
                '🔐 *امنیت افزایش یافت!*\n\n' +
                `🛡️ امنیت فعلی: ${p.defense}\n` +
                `💰 هزینه: ${cost} دلار\n` +
                '🔍 شانس کشف جاسوس: +۱۵٪',
                { chat_id: chatId, message_id: msgId, parse_mode: 'Markdown',
                  reply_markup: { inline_keyboard: [[{ text: '🔙 برگشت', callback_data: 'menu_spy' }]] } }
            );
            return bot.answerCallbackQuery(query.id);
        }
    });
}

module.exports = { spyMenu, setupSpyHandlers };