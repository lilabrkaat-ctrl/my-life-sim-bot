const config = require('./config');
const player = require('./player');

function diplomacyMenu() {
    return {
        reply_markup: {
            inline_keyboard: [
                [{ text: '🌍 نقشه جهان', callback_data: 'diplo_map' }, { text: '🤝 مذاکره', callback_data: 'diplo_talk' }],
                [{ text: '☮️ صلح', callback_data: 'diplo_peace' }, { text: '🤝 اتحاد', callback_data: 'diplo_ally' }],
                [{ text: '💰 تجارت', callback_data: 'diplo_trade' }, { text: '🚫 تحریم', callback_data: 'diplo_sanction' }],
                [{ text: '💣 اولتیماتوم', callback_data: 'diplo_ultimatum' }, { text: '💍 ازدواج سیاسی', callback_data: 'diplo_marriage' }],
                [{ text: '🔙 برگشت', callback_data: 'menu_main' }]
            ]
        }
    };
}

function countryList(page = 0, prefix = 'diplo_select') {
    const countries = Object.entries(config.countries);
    const perPage = 6;
    const totalPages = Math.ceil(countries.length / perPage);
    const start = page * perPage;
    const pageCountries = countries.slice(start, start + perPage);
    
    let buttons = [];
    let row = [];
    
    for (let [key, country] of pageCountries) {
        row.push({ text: `${country.emoji} ${country.name}`, callback_data: `${prefix}_${key}` });
        if (row.length === 2) { buttons.push(row); row = []; }
    }
    if (row.length > 0) buttons.push(row);
    
    let navRow = [];
    if (page > 0) navRow.push({ text: '⏪ قبلی', callback_data: `diplo_page_${page - 1}_${prefix}` });
    navRow.push({ text: `📄 ${page + 1}/${totalPages}`, callback_data: 'none' });
    if (page < totalPages - 1) navRow.push({ text: 'بعدی ⏩', callback_data: `diplo_page_${page + 1}_${prefix}` });
    buttons.push(navRow);
    
    buttons.push([{ text: '🔙 برگشت', callback_data: 'menu_diplomacy' }]);
    
    return { reply_markup: { inline_keyboard: buttons } };
}

function setupDiplomacyHandlers(bot) {
    
    bot.on('callback_query', async (query) => {
        const chatId = query.message.chat.id;
        const msgId = query.message.message_id;
        const userId = query.from.id;
        const data = query.data;
        
        if (!data.startsWith('diplo_')) return;
        
        const p = player.getPlayer(userId);
        
        // منوی دیپلماسی
        if (data === 'menu_diplomacy') {
            await bot.editMessageText(
                '🤝 *دیپلماسی*\n\n' +
                `🌍 متحدان: ${p.alliances.length} کشور\n` +
                `⚔️ در جنگ: ${p.wars.length} کشور\n` +
                `🚫 تحریم‌ها: ${p.sanctions.length} کشور\n\n` +
                'عملیات:',
                { chat_id: chatId, message_id: msgId, parse_mode: 'Markdown', ...diplomacyMenu() }
            );
            return bot.answerCallbackQuery(query.id);
        }
        
        // نقشه جهان
        if (data === 'diplo_map') {
            await bot.editMessageText(
                '🌍 *نقشه جهان*\n\nیک کشور رو انتخاب کن:',
                { chat_id: chatId, message_id: msgId, parse_mode: 'Markdown', ...countryList(0, 'diplo_select') }
            );
            return bot.answerCallbackQuery(query.id);
        }
        
        // صفحه‌بندی
        if (data.startsWith('diplo_page_')) {
            const parts = data.split('_');
            const page = parseInt(parts[2]);
            const prefix = parts.slice(3).join('_');
            await bot.editMessageText(
                '🌍 *نقشه جهان*\n\nیک کشور رو انتخاب کن:',
                { chat_id: chatId, message_id: msgId, parse_mode: 'Markdown', ...countryList(page, prefix) }
            );
            return bot.answerCallbackQuery(query.id);
        }
        
        // انتخاب کشور برای عملیات
        if (data.startsWith('diplo_select_')) {
            const countryKey = data.replace('diplo_select_', '');
            const country = config.countries[countryKey];
            
            if (!country) return bot.answerCallbackQuery(query.id);
            
            const isAlly = p.alliances.includes(countryKey);
            const isAtWar = p.wars.find(w => w.country === countryKey);
            
            await bot.editMessageText(
                `${country.emoji} *${country.name}*\n\n` +
                `⚡ قدرت: ${country.power}\n` +
                `🛢️ نفت: ${country.oil} بشکه\n` +
                `🪙 طلا: ${country.gold} کیلو\n` +
                `${isAlly ? '🤝 *متحد*' : ''}\n` +
                `${isAtWar ? '⚔️ *در حال جنگ*' : ''}\n\n` +
                'عملیات:',
                { chat_id: chatId, message_id: msgId, parse_mode: 'Markdown',
                  reply_markup: {
                      inline_keyboard: [
                          [{ text: '🤝 مذاکره', callback_data: `diplo_talk_${countryKey}` }],
                          [{ text: '🤝 اتحاد', callback_data: `diplo_ally_${countryKey}` }],
                          [{ text: '💰 تجارت', callback_data: `diplo_trade_${countryKey}` }],
                          [{ text: '☮️ صلح', callback_data: `diplo_peace_${countryKey}` }],
                          [{ text: '🚫 تحریم', callback_data: `diplo_sanction_${countryKey}` }],
                          [{ text: '💣 اولتیماتوم', callback_data: `diplo_ultimatum_${countryKey}` }],
                          [{ text: '🔙 برگشت', callback_data: 'diplo_map' }]
                      ]
                  }
                }
            );
            return bot.answerCallbackQuery(query.id);
        }
        
        // 🤝 مذاکره
        if (data.startsWith('diplo_talk_')) {
            const countryKey = data.replace('diplo_talk_', '');
            const country = config.countries[countryKey];
            
            const success = Math.random() < 0.6;
            
            if (success) {
                player.addAlliance(userId, countryKey);
                await bot.editMessageText(
                    '🤝 *مذاکره موفق!*\n\n' +
                    `${country.emoji} ${country.name} قبول کرد!\n` +
                    'حالا با هم متحد هستید.',
                    { chat_id: chatId, message_id: msgId, parse_mode: 'Markdown',
                      reply_markup: { inline_keyboard: [[{ text: '🔙 برگشت', callback_data: 'menu_diplomacy' }]] } }
                );
            } else {
                await bot.editMessageText(
                    '❌ *مذاکره شکست خورد!*\n\n' +
                    `${country.emoji} ${country.name} قبول نکرد.\n` +
                    'بعداً دوباره تلاش کن.',
                    { chat_id: chatId, message_id: msgId, parse_mode: 'Markdown',
                      reply_markup: { inline_keyboard: [[{ text: '🔙 برگشت', callback_data: 'menu_diplomacy' }]] } }
                );
            }
            return bot.answerCallbackQuery(query.id);
        }
        
        // 🤝 اتحاد
        if (data.startsWith('diplo_ally_')) {
            const countryKey = data.replace('diplo_ally_', '');
            const country = config.countries[countryKey];
            
            if (p.alliances.includes(countryKey)) {
                return bot.answerCallbackQuery(query.id, { text: '❌ قبلاً متحد هستید!', show_alert: true });
            }
            
            const cost = 1000;
            if (p.treasury < cost) {
                return bot.answerCallbackQuery(query.id, { text: '❌ پول کافی نداری! نیاز: ۱۰۰۰ دلار', show_alert: true });
            }
            
            p.treasury -= cost;
            player.addAlliance(userId, countryKey);
            
            await bot.editMessageText(
                '🤝 *اتحاد شکل گرفت!*\n\n' +
                `${country.emoji} ${country.name} حالا متحد توئه!\n` +
                `💰 هزینه: ${cost} دلار\n` +
                `⚔️ قدرت نظامی: +${Math.floor(country.power * 0.3)}`,
                { chat_id: chatId, message_id: msgId, parse_mode: 'Markdown',
                  reply_markup: { inline_keyboard: [[{ text: '🔙 برگشت', callback_data: 'menu_diplomacy' }]] } }
            );
            return bot.answerCallbackQuery(query.id);
        }
        
        // 💰 تجارت
        if (data.startsWith('diplo_trade_')) {
            const countryKey = data.replace('diplo_trade_', '');
            const country = config.countries[countryKey];
            
            if (p.oil < 100) {
                return bot.answerCallbackQuery(query.id, { text: '❌ نفت کافی نداری!', show_alert: true });
            }
            
            const oilSold = 100;
            const moneyEarned = oilSold * config.prices.oil;
            
            p.oil -= oilSold;
            p.treasury += moneyEarned;
            
            await bot.editMessageText(
                '💰 *تجارت موفق!*\n\n' +
                `${country.emoji} ${country.name}\n` +
                `🛢️ فروش: ${oilSold} بشکه نفت\n` +
                `💰 درآمد: ${moneyEarned} دلار\n` +
                `🏦 خزانه: ${p.treasury} دلار`,
                { chat_id: chatId, message_id: msgId, parse_mode: 'Markdown',
                  reply_markup: { inline_keyboard: [[{ text: '🔙 برگشت', callback_data: 'menu_diplomacy' }]] } }
            );
            return bot.answerCallbackQuery(query.id);
        }
        
        // ☮️ صلح
        if (data.startsWith('diplo_peace_')) {
            const countryKey = data.replace('diplo_peace_', '');
            const country = config.countries[countryKey];
            
            const warIndex = p.wars.findIndex(w => w.country === countryKey);
            if (warIndex === -1) {
                return bot.answerCallbackQuery(query.id, { text: '❌ با این کشور در جنگ نیستی!', show_alert: true });
            }
            
            p.wars.splice(warIndex, 1);
            p.popularity = Math.min(100, p.popularity + 5);
            
            await bot.editMessageText(
                '☮️ *صلح برقرار شد!*\n\n' +
                `${country.emoji} ${country.name}\n` +
                'جنگ تموم شد.\n' +
                '📊 محبوبیت: +۵٪',
                { chat_id: chatId, message_id: msgId, parse_mode: 'Markdown',
                  reply_markup: { inline_keyboard: [[{ text: '🔙 برگشت', callback_data: 'menu_diplomacy' }]] } }
            );
            return bot.answerCallbackQuery(query.id);
        }
        
        // 🚫 تحریم
        if (data.startsWith('diplo_sanction_')) {
            const countryKey = data.replace('diplo_sanction_', '');
            const country = config.countries[countryKey];
            
            if (p.sanctions.includes(countryKey)) {
                return bot.answerCallbackQuery(query.id, { text: '❌ قبلاً تحریم کردی!', show_alert: true });
            }
            
            p.sanctions.push(countryKey);
            
            await bot.editMessageText(
                '🚫 *تحریم اعمال شد!*\n\n' +
                `${country.emoji} ${country.name} تحریم اقتصادی شد!\n` +
                'تجارت باهاش قطع میشه.',
                { chat_id: chatId, message_id: msgId, parse_mode: 'Markdown',
                  reply_markup: { inline_keyboard: [[{ text: '🔙 برگشت', callback_data: 'menu_diplomacy' }]] } }
            );
            return bot.answerCallbackQuery(query.id);
        }
        
        // 💣 اولتیماتوم
        if (data.startsWith('diplo_ultimatum_')) {
            const countryKey = data.replace('diplo_ultimatum_', '');
            const country = config.countries[countryKey];
            
            const scared = Math.random() < 0.4;
            
            if (scared) {
                const tribute = Math.floor(country.gold * 0.2);
                player.addMoney(userId, tribute);
                
                await bot.editMessageText(
                    '🎉 *اولتیماتوم جواب داد!*\n\n' +
                    `${country.emoji} ${country.name} ترسید!\n` +
                    `💰 خراج: ${tribute} دلار`,
                    { chat_id: chatId, message_id: msgId, parse_mode: 'Markdown',
                      reply_markup: { inline_keyboard: [[{ text: '🔙 برگشت', callback_data: 'menu_diplomacy' }]] } }
                );
            } else {
                player.addWar(userId, countryKey);
                
                await bot.editMessageText(
                    '💣 *اولتیماتوم رد شد!*\n\n' +
                    `${country.emoji} ${country.name} نترسید!\n` +
                    '⚔️ حالا در جنگ هستید!',
                    { chat_id: chatId, message_id: msgId, parse_mode: 'Markdown',
                      reply_markup: { inline_keyboard: [[{ text: '🔙 برگشت', callback_data: 'menu_diplomacy' }]] } }
                );
            }
            return bot.answerCallbackQuery(query.id);
        }
    });
}

module.exports = { diplomacyMenu, setupDiplomacyHandlers };