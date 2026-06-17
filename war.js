const config = require('./config');
const player = require('./player');

function warMenu() {
    return {
        reply_markup: {
            inline_keyboard: [
                [{ text: '🗺️ نقشه جهان', callback_data: 'war_map' }, { text: '💂 استخدام نیرو', callback_data: 'war_recruit' }],
                [{ text: '⚔️ حمله زمینی', callback_data: 'war_attack' }, { text: '✈️ حمله هوایی', callback_data: 'war_air' }],
                [{ text: '🚀 حمله موشکی', callback_data: 'war_missile' }, { text: '💻 حمله سایبری', callback_data: 'war_cyber' }],
                [{ text: '🛡️ تقویت دفاع', callback_data: 'war_defense' }, { text: '📊 گزارش جنگ', callback_data: 'war_report' }],
                [{ text: '🔙 برگشت', callback_data: 'menu_main' }]
            ]
        }
    };
}

function countryMenu(page = 0) {
    const countries = Object.entries(config.countries);
    const perPage = 8;
    const totalPages = Math.ceil(countries.length / perPage);
    const start = page * perPage;
    const pageCountries = countries.slice(start, start + perPage);
    
    let buttons = [];
    let row = [];
    
    for (let [key, country] of pageCountries) {
        row.push({ text: `${country.emoji} ${country.name}`, callback_data: `war_select_${key}` });
        if (row.length === 2) { buttons.push(row); row = []; }
    }
    if (row.length > 0) buttons.push(row);
    
    // دکمه‌های صفحه‌بندی
    let navRow = [];
    if (page > 0) navRow.push({ text: '⏪ قبلی', callback_data: `war_map_page_${page - 1}` });
    navRow.push({ text: `📄 ${page + 1}/${totalPages}`, callback_data: 'none' });
    if (page < totalPages - 1) navRow.push({ text: 'بعدی ⏩', callback_data: `war_map_page_${page + 1}` });
    buttons.push(navRow);
    
    buttons.push([{ text: '🔙 برگشت', callback_data: 'menu_war' }]);
    
    return { reply_markup: { inline_keyboard: buttons } };
}

function recruitMenu() {
    const units = config.units;
    let buttons = [];
    
    for (let key in units) {
        const unit = units[key];
        buttons.push([{ 
            text: `${unit.emoji} ${unit.name} - 💰${unit.cost} دلار (⚡${unit.power})`, 
            callback_data: `war_buy_${key}` 
        }]);
    }
    
    buttons.push([{ text: '🔙 برگشت', callback_data: 'menu_war' }]);
    
    return { reply_markup: { inline_keyboard: buttons } };
}

// هندلرهای جنگ
function setupWarHandlers(bot) {
    
    bot.on('callback_query', async (query) => {
        const chatId = query.message.chat.id;
        const msgId = query.message.message_id;
        const userId = query.from.id;
        const data = query.data;
        
        if (!data.startsWith('war_')) return;
        
        const p = player.getPlayer(userId);
        
        // نقشه جهان
        if (data === 'war_map') {
            await bot.editMessageText(
                '🗺️ *نقشه جهان*\n\nیک کشور رو انتخاب کن:',
                { chat_id: chatId, message_id: msgId, parse_mode: 'Markdown', ...countryMenu() }
            );
            return bot.answerCallbackQuery(query.id);
        }
        
        // صفحه‌بندی نقشه
        if (data.startsWith('war_map_page_')) {
            const page = parseInt(data.replace('war_map_page_', ''));
            await bot.editMessageText(
                '🗺️ *نقشه جهان*\n\nیک کشور رو انتخاب کن:',
                { chat_id: chatId, message_id: msgId, parse_mode: 'Markdown', ...countryMenu(page) }
            );
            return bot.answerCallbackQuery(query.id);
        }
        
        // انتخاب کشور
        if (data.startsWith('war_select_')) {
            const countryKey = data.replace('war_select_', '');
            const country = config.countries[countryKey];
            
            if (!country) return bot.answerCallbackQuery(query.id);
            
            await bot.editMessageText(
                `${country.emoji} *${country.name}*\n\n` +
                `⚡ قدرت: ${country.power}\n` +
                `🛢️ نفت: ${country.oil} بشکه\n` +
                `🪙 طلا: ${country.gold} کیلو\n\n` +
                'نوع حمله رو انتخاب کن:',
                { chat_id: chatId, message_id: msgId, parse_mode: 'Markdown',
                  reply_markup: {
                      inline_keyboard: [
                          [{ text: '⚔️ حمله زمینی', callback_data: `war_attack_${countryKey}` }],
                          [{ text: '✈️ حمله هوایی', callback_data: `war_air_${countryKey}` }],
                          [{ text: '🚀 حمله موشکی', callback_data: `war_missile_${countryKey}` }],
                          [{ text: '💻 حمله سایبری', callback_data: `war_cyber_${countryKey}` }],
                          [{ text: '🔙 برگشت', callback_data: 'war_map' }]
                      ]
                  }
                }
            );
            return bot.answerCallbackQuery(query.id);
        }
        
        // استخدام نیرو
        if (data === 'war_recruit') {
            await bot.editMessageText(
                '💂 *استخدام نیرو*\n\n' +
                `💰 خزانه: ${p.treasury} دلار\n\n` +
                'نوع نیرو رو انتخاب کن:',
                { chat_id: chatId, message_id: msgId, parse_mode: 'Markdown', ...recruitMenu() }
            );
            return bot.answerCallbackQuery(query.id);
        }
        
        // خرید نیرو
        if (data.startsWith('war_buy_')) {
            const unitKey = data.replace('war_buy_', '');
            const unit = config.units[unitKey];
            
            if (!unit) return bot.answerCallbackQuery(query.id);
            
            if (p.treasury < unit.cost) {
                return bot.answerCallbackQuery(query.id, { text: '❌ پول کافی نداری!', show_alert: true });
            }
            
            p.treasury -= unit.cost;
            p.army[unitKey] = (p.army[unitKey] || 0) + 1;
            
            await bot.editMessageText(
                '✅ *خرید موفق!*\n\n' +
                `${unit.emoji} ${unit.name} به ارتش اضافه شد!\n` +
                `💰 هزینه: ${unit.cost} دلار\n` +
                `💂 ${unitKey}: ${p.army[unitKey]} عدد`,
                { chat_id: chatId, message_id: msgId, parse_mode: 'Markdown', ...recruitMenu() }
            );
            return bot.answerCallbackQuery(query.id, { text: '✅ خریداری شد!' });
        }
        
        // حمله زمینی
        if (data.startsWith('war_attack_')) {
            const countryKey = data.replace('war_attack_', '');
            const country = config.countries[countryKey];
            
            const myPower = player.getTotalPower(userId);
            const enemyPower = country.power;
            const winChance = Math.min(90, Math.max(10, (myPower / (myPower + enemyPower)) * 100));
            
            const won = Math.random() * 100 < winChance;
            
            let result;
            if (won) {
                const loot = Math.floor(country.gold * 0.3);
                const oilLoot = Math.floor(country.oil * 0.2);
                player.addMoney(userId, loot);
                player.addOil(userId, oilLoot);
                player.addGold(userId, Math.floor(country.gold * 0.1));
                p.popularity = Math.min(100, p.popularity + 10);
                p.conquered.push(countryKey);
                
                result = '🎉 *پیروز شدی!*\n\n' +
                         `${country.emoji} ${country.name} فتح شد!\n` +
                         `💰 غنیمت: ${loot} دلار\n` +
                         `🛢️ نفت: +${oilLoot} بشکه\n` +
                         `📊 محبوبیت: +۱۰٪`;
            } else {
                const lostSoldiers = Math.floor(p.army.soldier * 0.3);
                p.army.soldier = Math.max(0, p.army.soldier - lostSoldiers);
                p.popularity = Math.max(0, p.popularity - 15);
                
                result = '💀 *شکست خوردی!*\n\n' +
                         `🗡️ ${lostSoldiers} سرباز کشته شدن\n` +
                         `📊 محبوبیت: -۱۵٪`;
            }
            
            await bot.editMessageText(
                `⚔️ *حمله به ${country.emoji} ${country.name}*\n\n` +
                `💂 قدرت تو: ${myPower}\n` +
                `💂 قدرت دشمن: ${enemyPower}\n` +
                `🎲 شانس برد: ${Math.floor(winChance)}%\n\n` +
                result,
                { chat_id: chatId, message_id: msgId, parse_mode: 'Markdown',
                  reply_markup: { inline_keyboard: [[{ text: '🔙 برگشت', callback_data: 'menu_war' }]] } }
            );
            return bot.answerCallbackQuery(query.id);
        }
        
        // تقویت دفاع
        if (data === 'war_defense') {
            const cost = 500;
            if (p.treasury < cost) {
                return bot.answerCallbackQuery(query.id, { text: '❌ پول کافی نداری! نیاز: ۵۰۰ دلار', show_alert: true });
            }
            
            p.treasury -= cost;
            p.defense += 5;
            
            await bot.editMessageText(
                '🛡️ *دفاع تقویت شد!*\n\n' +
                `🛡️ دفاع فعلی: ${p.defense}\n` +
                `💰 هزینه: ${cost} دلار`,
                { chat_id: chatId, message_id: msgId, parse_mode: 'Markdown', ...warMenu() }
            );
            return bot.answerCallbackQuery(query.id, { text: '✅ دفاع +۵' });
        }
        
        // برگشت به منوی جنگ
        if (data === 'menu_war') {
            await bot.editMessageText(
                '⚔️ *اتاق جنگ*\n\n' +
                `💂 ارتش: ${player.getTotalPower(userId)} قدرت\n` +
                `🛡️ دفاع: ${p.defense}\n\n` +
                'عملیات:',
                { chat_id: chatId, message_id: msgId, parse_mode: 'Markdown', ...warMenu() }
            );
            return bot.answerCallbackQuery(query.id);
        }
    });
}

module.exports = { warMenu, setupWarHandlers };