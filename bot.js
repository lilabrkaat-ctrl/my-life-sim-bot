const TelegramBot = require('node-telegram-bot-api');
const config = require('./config');
const player = require('./player');

const bot = new TelegramBot(config.BOT_TOKEN, { polling: true });

// ============ منوی اصلی ============
function mainMenu() {
    return {
        reply_markup: {
            inline_keyboard: [
                [{ text: '⚔️ جنگ', callback_data: 'menu_war' }, { text: '🤝 دیپلماسی', callback_data: 'menu_diplomacy' }],
                [{ text: '👸 حرمسرا', callback_data: 'menu_harem' }, { text: '💰 اقتصاد', callback_data: 'menu_economy' }],
                [{ text: '🏛️ مجلس', callback_data: 'menu_parliament' }, { text: '🕵️ جاسوسی', callback_data: 'menu_spy' }],
                [{ text: '🔒 زندان', callback_data: 'menu_prison' }, { text: '📊 آمار', callback_data: 'menu_stats' }]
            ]
        }
    };
}

// ============ START ============
bot.onText(/\/start/, async (msg) => {
    const chatId = msg.chat.id;
    player.createPlayer(msg.from.id);
    await bot.sendMessage(chatId, '👑 *امپراطوری ۱۴۰۶*\n\n🎮 یه گزینه رو انتخاب کن:', { parse_mode: 'Markdown', ...mainMenu() });
});

// ============ همه CALLBACK ها ============
bot.on('callback_query', async (query) => {
    const chatId = query.message.chat.id;
    const msgId = query.message.message_id;
    const userId = query.from.id;
    const data = query.data;
    const p = player.getPlayer(userId);
    
    try {
        // ============ منوی اصلی ============
        if (data === 'menu_main') {
            await bot.editMessageText('👑 *امپراطوری ۱۴۰۶*\n\n🎮 یه گزینه رو انتخاب کن:', { chat_id: chatId, message_id: msgId, parse_mode: 'Markdown', ...mainMenu() });
            return bot.answerCallbackQuery(query.id);
        }
        
        // ============ 📊 آمار ============
        if (data === 'menu_stats') {
            const s = player.getStats(userId);
            let text = '📊 *آمار امپراطوری*\n\n';
            text += `💰 خزانه: ${s.treasury.toLocaleString()} دلار\n`;
            text += `🛢️ نفت: ${s.oil} بشکه | 🪙 طلا: ${s.gold}kg\n`;
            text += `💂 ارتش: ${s.totalPower} قدرت | 🛡️ دفاع: ${p.defense}\n\n`;
            text += `👸 ملکه: ${s.queens}/۴ | 👶 فرزند: ${s.children}\n`;
            text += `🔒 زندانی: ${s.prisoners} | 🕵️ جاسوس: ${s.spies}\n`;
            text += `🌍 متحد: ${s.alliances} | ⚔️ جنگ: ${s.wars}\n`;
            text += `😊 محبوبیت: ${s.popularity}% | 🗺️ فتح: ${s.conquered}`;
            
            await bot.editMessageText(text, { chat_id: chatId, message_id: msgId, parse_mode: 'Markdown', reply_markup: { inline_keyboard: [[{ text: '🔙 برگشت', callback_data: 'menu_main' }]] } });
            return bot.answerCallbackQuery(query.id);
        }
        
        // ============ ⚔️ جنگ ============
        if (data === 'menu_war') {
            let text = '⚔️ *اتاق جنگ*\n\n';
            text += `💂 قدرت ارتش: ${player.getTotalPower(userId)}\n`;
            text += `🛡️ دفاع: ${p.defense}\n`;
            text += `⚔️ جنگ‌های فعال: ${p.wars.length}\n\n`;
            text += 'عملیات:';
            
            await bot.editMessageText(text, { chat_id: chatId, message_id: msgId, parse_mode: 'Markdown', reply_markup: { inline_keyboard: [
                [{ text: '🗺️ حمله به کشور', callback_data: 'war_map' }, { text: '💂 استخدام نیرو', callback_data: 'war_recruit' }],
                [{ text: '🛡️ تقویت دفاع', callback_data: 'war_defense' }, { text: '🔙 برگشت', callback_data: 'menu_main' }]
            ] } });
            return bot.answerCallbackQuery(query.id);
        }
        
        if (data === 'war_map') {
            let text = '🗺️ *انتخاب کشور برای حمله:*\n\n';
            let buttons = [];
            let row = [];
            let i = 0;
            for (let key in config.countries) {
                const c = config.countries[key];
                row.push({ text: `${c.emoji} ${c.name} (⚡${c.power})`, callback_data: `war_attack_${key}` });
                if (row.length === 2) { buttons.push(row); row = []; }
            }
            if (row.length > 0) buttons.push(row);
            buttons.push([{ text: '🔙 برگشت', callback_data: 'menu_war' }]);
            
            await bot.editMessageText(text, { chat_id: chatId, message_id: msgId, parse_mode: 'Markdown', reply_markup: { inline_keyboard: buttons } });
            return bot.answerCallbackQuery(query.id);
        }
        
        if (data.startsWith('war_attack_')) {
            const key = data.replace('war_attack_', '');
            const c = config.countries[key];
            const myPower = player.getTotalPower(userId);
            const chance = Math.min(90, Math.max(10, (myPower / (myPower + c.power)) * 100));
            const won = Math.random() * 100 < chance;
            
            let result;
            if (won) {
                const loot = Math.floor(c.gold * 0.3);
                p.treasury += loot;
                p.oil += Math.floor(c.oil * 0.2);
                p.popularity = Math.min(100, p.popularity + 10);
                if (!p.conquered) p.conquered = [];
                p.conquered.push(key);
                result = `🎉 *پیروز شدی!*\n💰 غنیمت: ${loot} دلار\n🛢️ نفت: +${Math.floor(c.oil*0.2)}\n📊 محبوبیت: +۱۰٪`;
            } else {
                p.army.soldier = Math.max(0, p.army.soldier - Math.floor(p.army.soldier * 0.3));
                p.popularity = Math.max(0, p.popularity - 15);
                result = `💀 *شکست!*\n🗡️ سربازا کشته شدن\n📊 محبوبیت: -۱۵٪`;
            }
            
            await bot.editMessageText(`⚔️ *حمله به ${c.emoji} ${c.name}*\n\n💂 تو: ${myPower} | دشمن: ${c.power}\n🎲 شانس: ${Math.floor(chance)}%\n\n${result}`, { chat_id: chatId, message_id: msgId, parse_mode: 'Markdown', reply_markup: { inline_keyboard: [[{ text: '🔙 برگشت', callback_data: 'menu_war' }]] } });
            return bot.answerCallbackQuery(query.id);
        }
        
        if (data === 'war_recruit') {
            let text = '💂 *استخدام نیرو*\n\n';
            let buttons = [];
            for (let key in config.units) {
                const u = config.units[key];
                text += `${u.emoji} ${u.name}: ${u.cost} دلار (⚡${u.power})\n`;
                buttons.push([{ text: `${u.emoji} ${u.name} - ${u.cost} دلار`, callback_data: `war_buy_${key}` }]);
            }
            buttons.push([{ text: '🔙 برگشت', callback_data: 'menu_war' }]);
            
            await bot.editMessageText(text, { chat_id: chatId, message_id: msgId, parse_mode: 'Markdown', reply_markup: { inline_keyboard: buttons } });
            return bot.answerCallbackQuery(query.id);
        }
        
        if (data.startsWith('war_buy_')) {
            const key = data.replace('war_buy_', '');
            const u = config.units[key];
            if (p.treasury < u.cost) return bot.answerCallbackQuery(query.id, { text: '❌ پول کمه!', show_alert: true });
            p.treasury -= u.cost;
            p.army[key] = (p.army[key] || 0) + 1;
            await bot.answerCallbackQuery(query.id, { text: `✅ ${u.name} خریداری شد!`, show_alert: true });
            return;
        }
        
        if (data === 'war_defense') {
            if (p.treasury < 500) return bot.answerCallbackQuery(query.id, { text: '❌ ۵۰۰ دلار لازمه!', show_alert: true });
            p.treasury -= 500;
            p.defense += 5;
            await bot.editMessageText(`🛡️ *دفاع تقویت شد!*\n🛡️ فعلی: ${p.defense}\n💰 -۵۰۰ دلار`, { chat_id: chatId, message_id: msgId, parse_mode: 'Markdown', reply_markup: { inline_keyboard: [[{ text: '🔙 برگشت', callback_data: 'menu_war' }]] } });
            return bot.answerCallbackQuery(query.id);
        }
        
        // ============ 🤝 دیپلماسی ============
        if (data === 'menu_diplomacy') {
            await bot.editMessageText('🤝 *دیپلماسی*\n\n🌍 متحدان: ' + p.alliances.length + '\n⚔️ جنگ: ' + p.wars.length, { chat_id: chatId, message_id: msgId, parse_mode: 'Markdown', reply_markup: { inline_keyboard: [
                [{ text: '🌍 کشورها', callback_data: 'diplo_map' }, { text: '🤝 اتحاد', callback_data: 'diplo_ally' }],
                [{ text: '💰 تجارت', callback_data: 'diplo_trade' }, { text: '☮️ صلح', callback_data: 'diplo_peace' }],
                [{ text: '🚫 تحریم', callback_data: 'diplo_sanction' }, { text: '🔙 برگشت', callback_data: 'menu_main' }]
            ] } });
            return bot.answerCallbackQuery(query.id);
        }
        
        if (data === 'diplo_map') {
            let buttons = [];
            let row = [];
            for (let key in config.countries) {
                row.push({ text: config.countries[key].emoji + ' ' + config.countries[key].name, callback_data: 'diplo_select_' + key });
                if (row.length === 2) { buttons.push(row); row = []; }
            }
            if (row.length > 0) buttons.push(row);
            buttons.push([{ text: '🔙 برگشت', callback_data: 'menu_diplomacy' }]);
            await bot.editMessageText('🌍 *کشورها*', { chat_id: chatId, message_id: msgId, parse_mode: 'Markdown', reply_markup: { inline_keyboard: buttons } });
            return bot.answerCallbackQuery(query.id);
        }
        
        if (data.startsWith('diplo_select_')) {
            const key = data.replace('diplo_select_', '');
            const c = config.countries[key];
            await bot.editMessageText(`${c.emoji} *${c.name}*\n⚡${c.power} | 🛢️${c.oil} | 🪙${c.gold}`, { chat_id: chatId, message_id: msgId, parse_mode: 'Markdown', reply_markup: { inline_keyboard: [
                [{ text: '🤝 اتحاد', callback_data: 'diplo_do_ally_' + key }],
                [{ text: '💰 تجارت', callback_data: 'diplo_do_trade_' + key }],
                [{ text: '🚫 تحریم', callback_data: 'diplo_do_sanction_' + key }],
                [{ text: '🔙 برگشت', callback_data: 'diplo_map' }]
            ] } });
            return bot.answerCallbackQuery(query.id);
        }
        
        if (data.startsWith('diplo_do_ally_')) {
            const key = data.replace('diplo_do_ally_', '');
            if (p.treasury < 500) return bot.answerCallbackQuery(query.id, { text: '❌ ۵۰۰ دلار لازمه!', show_alert: true });
            p.treasury -= 500;
            if (!p.alliances.includes(key)) p.alliances.push(key);
            await bot.editMessageText(`🤝 *اتحاد با ${config.countries[key].name}!*\n💰 -۵۰۰ دلار`, { chat_id: chatId, message_id: msgId, parse_mode: 'Markdown', reply_markup: { inline_keyboard: [[{ text: '🔙 برگشت', callback_data: 'menu_diplomacy' }]] } });
            return bot.answerCallbackQuery(query.id);
        }
        
        if (data.startsWith('diplo_do_trade_')) {
            const key = data.replace('diplo_do_trade_', '');
            if (p.oil < 50) return bot.answerCallbackQuery(query.id, { text: '❌ نفت کمه!', show_alert: true });
            p.oil -= 50;
            p.treasury += 50 * config.prices.oil;
            await bot.editMessageText(`💰 *تجارت با ${config.countries[key].name}!*\n🛢️ -۵۰ بشکه\n💰 +${50*config.prices.oil} دلار`, { chat_id: chatId, message_id: msgId, parse_mode: 'Markdown', reply_markup: { inline_keyboard: [[{ text: '🔙 برگشت', callback_data: 'menu_diplomacy' }]] } });
            return bot.answerCallbackQuery(query.id);
        }
        
        // ============ 👸 حرمسرا ============
        if (data === 'menu_harem') {
            await bot.editMessageText(`👸 *حرمسرا*\n\nملکه‌ها: ${p.queens.length}/۴ | فرزندان: ${p.children.length}`, { chat_id: chatId, message_id: msgId, parse_mode: 'Markdown', reply_markup: { inline_keyboard: [
                [{ text: '👸 ملکه‌ها', callback_data: 'harem_list' }, { text: '💍 ملکه جدید (۵۰۰ دلار)', callback_data: 'harem_new' }],
                [{ text: '🔙 برگشت', callback_data: 'menu_main' }]
            ] } });
            return bot.answerCallbackQuery(query.id);
        }
        
        if (data === 'harem_list') {
            if (p.queens.length === 0) {
                await bot.editMessageText('👸 *ملکه‌ها*\n\n❌ هیچی!', { chat_id: chatId, message_id: msgId, parse_mode: 'Markdown', reply_markup: { inline_keyboard: [[{ text: '💍 ملکه جدید', callback_data: 'harem_new' }, { text: '🔙 برگشت', callback_data: 'menu_harem' }]] } });
                return bot.answerCallbackQuery(query.id);
            }
            let text = '👸 *ملکه‌ها*\n\n';
            let buttons = [];
            for (let q of p.queens) {
                text += `${q.name} (${q.age}ساله) | 😊${q.mood}% ${q.pregnant?'🤰':''}\n`;
                buttons.push([{ text: `${q.name} - ${q.pregnant?'🤰':'👸'}`, callback_data: 'harem_select_' + q.id }]);
            }
            buttons.push([{ text: '🔙 برگشت', callback_data: 'menu_harem' }]);
            await bot.editMessageText(text, { chat_id: chatId, message_id: msgId, parse_mode: 'Markdown', reply_markup: { inline_keyboard: buttons } });
            return bot.answerCallbackQuery(query.id);
        }
        
        if (data.startsWith('harem_select_')) {
            const qid = parseInt(data.replace('harem_select_', ''));
            const q = p.queens.find(x => x.id === qid);
            if (!q) return bot.answerCallbackQuery(query.id);
            await bot.editMessageText(`👸 *${q.name}*\n😊${q.mood}% ${q.pregnant?'🤰باردار':''}`, { chat_id: chatId, message_id: msgId, parse_mode: 'Markdown', reply_markup: { inline_keyboard: [
                [{ text: '💕 وقت گذروندن', callback_data: 'harem_time_' + q.id }],
                [{ text: '🤰 باردار شو', callback_data: 'harem_preg_' + q.id }],
                [{ text: '🚪 اخراج', callback_data: 'harem_kick_' + q.id }],
                [{ text: '🔙 برگشت', callback_data: 'harem_list' }]
            ] } });
            return bot.answerCallbackQuery(query.id);
        }
        
        if (data.startsWith('harem_time_')) {
            const qid = parseInt(data.replace('harem_time_', ''));
            const q = p.queens.find(x => x.id === qid);
            if (!q) return bot.answerCallbackQuery(query.id);
            q.mood = Math.min(100, q.mood + 20);
            await bot.editMessageText(`💕 *${q.name}*\n😊 روحیه +۲۰٪`, { chat_id: chatId, message_id: msgId, parse_mode: 'Markdown', reply_markup: { inline_keyboard: [[{ text: '🔙 برگشت', callback_data: 'menu_harem' }]] } });
            return bot.answerCallbackQuery(query.id);
        }
        
        if (data.startsWith('harem_preg_')) {
            const qid = parseInt(data.replace('harem_preg_', ''));
            const q = p.queens.find(x => x.id === qid);
            if (!q || q.pregnant) return bot.answerCallbackQuery(query.id);
            q.pregnant = true;
            setTimeout(() => {
                q.pregnant = false;
                player.addChild(userId, ['کوروش','داریوش','آتنا'][Math.floor(Math.random()*3)], qid);
                bot.sendMessage(chatId, '👶 *بچه به دنیا اومد!* 🎉', { parse_mode: 'Markdown' });
            }, 3000);
            await bot.editMessageText(`🤰 *${q.name} باردار شد!*\n⏰ ۳ ثانیه دیگه...`, { chat_id: chatId, message_id: msgId, parse_mode: 'Markdown', reply_markup: { inline_keyboard: [[{ text: '🔙 برگشت', callback_data: 'menu_harem' }]] } });
            return bot.answerCallbackQuery(query.id);
        }
        
        if (data === 'harem_new') {
            if (p.queens.length >= 4) return bot.answerCallbackQuery(query.id, { text: '❌ حرمسرا پره!', show_alert: true });
            if (p.treasury < 500) return bot.answerCallbackQuery(query.id, { text: '❌ ۵۰۰ دلار لازمه!', show_alert: true });
            p.treasury -= 500;
            player.addQueen(userId, ['سارا','نگار','مریم','شیرین'][Math.floor(Math.random()*4)], 20+Math.floor(Math.random()*10));
            await bot.editMessageText('💍 *ملکه جدید به حرمسرا اضافه شد!*', { chat_id: chatId, message_id: msgId, parse_mode: 'Markdown', reply_markup: { inline_keyboard: [[{ text: '🔙 برگشت', callback_data: 'menu_harem' }]] } });
            return bot.answerCallbackQuery(query.id);
        }
        
        // ============ 💰 اقتصاد ============
        if (data === 'menu_economy') {
            await bot.editMessageText(`💰 *اقتصاد*\n🏦 ${p.treasury.toLocaleString()} دلار\n🛢️ ${p.oil} بشکه\n🪙 ${p.gold}kg`, { chat_id: chatId, message_id: msgId, parse_mode: 'Markdown', reply_markup: { inline_keyboard: [
                [{ text: '🛢️ استخراج نفت', callback_data: 'eco_oil' }, { text: '💰 فروش نفت', callback_data: 'eco_sell' }],
                [{ text: '💳 مالیات', callback_data: 'eco_tax' }, { text: '🪙 خرید طلا', callback_data: 'eco_gold' }],
                [{ text: '🏗️ توسعه', callback_data: 'eco_build' }, { text: '🔙 برگشت', callback_data: 'menu_main' }]
            ] } });
            return bot.answerCallbackQuery(query.id);
        }
        
        if (data === 'eco_oil') {
            const amt = Math.floor(Math.random()*100)+50;
            p.oil += amt;
            await bot.editMessageText(`🛢️ *+${amt} بشکه نفت*\n🛢️ کل: ${p.oil}`, { chat_id: chatId, message_id: msgId, parse_mode: 'Markdown', reply_markup: { inline_keyboard: [[{ text: '🔙 برگشت', callback_data: 'menu_economy' }]] } });
            return bot.answerCallbackQuery(query.id);
        }
        
        if (data === 'eco_sell') {
            if (p.oil < 50) return bot.answerCallbackQuery(query.id, { text: '❌ نفت کمه!', show_alert: true });
            p.oil -= 50;
            const earned = 50 * config.prices.oil;
            p.treasury += earned;
            await bot.editMessageText(`💰 *فروش نفت*\n🛢️ -۵۰ بشکه\n💰 +${earned} دلار`, { chat_id: chatId, message_id: msgId, parse_mode: 'Markdown', reply_markup: { inline_keyboard: [[{ text: '🔙 برگشت', callback_data: 'menu_economy' }]] } });
            return bot.answerCallbackQuery(query.id);
        }
        
        if (data === 'eco_tax') {
            const tax = Math.floor(p.popularity * 10);
            p.treasury += tax;
            p.popularity = Math.max(0, p.popularity - 5);
            await bot.editMessageText(`💳 *مالیات*\n💰 +${tax} دلار\n📊 محبوبیت -۵٪`, { chat_id: chatId, message_id: msgId, parse_mode: 'Markdown', reply_markup: { inline_keyboard: [[{ text: '🔙 برگشت', callback_data: 'menu_economy' }]] } });
            return bot.answerCallbackQuery(query.id);
        }
        
        if (data === 'eco_gold') {
            if (p.treasury < config.prices.gold) return bot.answerCallbackQuery(query.id, { text: '❌ پول کمه!', show_alert: true });
            p.treasury -= config.prices.gold;
            p.gold++;
            await bot.editMessageText(`🪙 *+۱ کیلو طلا*\n💰 -${config.prices.gold} دلار`, { chat_id: chatId, message_id: msgId, parse_mode: 'Markdown', reply_markup: { inline_keyboard: [[{ text: '🔙 برگشت', callback_data: 'menu_economy' }]] } });
            return bot.answerCallbackQuery(query.id);
        }
        
        if (data === 'eco_build') {
            if (p.treasury < 1000) return bot.answerCallbackQuery(query.id, { text: '❌ ۱۰۰۰ دلار لازمه!', show_alert: true });
            p.treasury -= 1000;
            p.popularity = Math.min(100, p.popularity + 15);
            await bot.editMessageText(`🏗️ *توسعه*\n📊 +۱۵٪ محبوبیت\n💰 -۱۰۰۰ دلار`, { chat_id: chatId, message_id: msgId, parse_mode: 'Markdown', reply_markup: { inline_keyboard: [[{ text: '🔙 برگشت', callback_data: 'menu_economy' }]] } });
            return bot.answerCallbackQuery(query.id);
        }
        
        // ============ 🏛️ مجلس ============
        if (data === 'menu_parliament') {
            await bot.editMessageText('🏛️ *مجلس*\n\nکمیسیون:', { chat_id: chatId, message_id: msgId, parse_mode: 'Markdown', reply_markup: { inline_keyboard: [
                [{ text: '💰 اقتصادی', callback_data: 'parl_economy' }, { text: '👥 اجتماعی', callback_data: 'parl_social' }],
                [{ text: '🎓 آموزش', callback_data: 'parl_edu' }, { text: '🏥 بهداشت', callback_data: 'parl_health' }],
                [{ text: '🔙 برگشت', callback_data: 'menu_main' }]
            ] } });
            return bot.answerCallbackQuery(query.id);
        }
        
        if (data === 'parl_economy') {
            p.treasury += 300;
            p.popularity = Math.max(0, p.popularity - 5);
            await bot.editMessageText('💰 *طرح اقتصادی*\n💰 +۳۰۰ دلار\n📊 -۵٪ محبوبیت', { chat_id: chatId, message_id: msgId, parse_mode: 'Markdown', reply_markup: { inline_keyboard: [[{ text: '🔙 برگشت', callback_data: 'menu_parliament' }]] } });
            return bot.answerCallbackQuery(query.id);
        }
        
        if (data === 'parl_social') {
            p.popularity = Math.min(100, p.popularity + 10);
            p.treasury -= 200;
            await bot.editMessageText('👥 *طرح اجتماعی*\n📊 +۱۰٪ محبوبیت\n💰 -۲۰۰ دلار', { chat_id: chatId, message_id: msgId, parse_mode: 'Markdown', reply_markup: { inline_keyboard: [[{ text: '🔙 برگشت', callback_data: 'menu_parliament' }]] } });
            return bot.answerCallbackQuery(query.id);
        }
        
        if (data === 'parl_edu') {
            p.treasury -= 400;
            p.popularity = Math.min(100, p.popularity + 8);
            await bot.editMessageText('🎓 *طرح آموزش*\n📊 +۸٪ محبوبیت\n💰 -۴۰۰ دلار', { chat_id: chatId, message_id: msgId, parse_mode: 'Markdown', reply_markup: { inline_keyboard: [[{ text: '🔙 برگشت', callback_data: 'menu_parliament' }]] } });
            return bot.answerCallbackQuery(query.id);
        }
        
        if (data === 'parl_health') {
            p.treasury -= 600;
            p.popularity = Math.min(100, p.popularity + 12);
            await bot.editMessageText('🏥 *طرح بهداشت*\n📊 +۱۲٪ محبوبیت\n💰 -۶۰۰ دلار', { chat_id: chatId, message_id: msgId, parse_mode: 'Markdown', reply_markup: { inline_keyboard: [[{ text: '🔙 برگشت', callback_data: 'menu_parliament' }]] } });
            return bot.answerCallbackQuery(query.id);
        }
        
        // ============ 🕵️ جاسوسی ============
        if (data === 'menu_spy') {
            await bot.editMessageText(`🕵️ *جاسوسی*\n🕵️ فعال: ${p.spies.length}`, { chat_id: chatId, message_id: msgId, parse_mode: 'Markdown', reply_markup: { inline_keyboard: [
                [{ text: '🕵️ جاسوس بفرست', callback_data: 'spy_send' }, { text: '🔍 کشف جاسوس', callback_data: 'spy_find' }],
                [{ text: '🔙 برگشت', callback_data: 'menu_main' }]
            ] } });
            return bot.answerCallbackQuery(query.id);
        }
        
        if (data === 'spy_send') {
            let buttons = [];
            let row = [];
            for (let key in config.countries) {
                row.push({ text: config.countries[key].emoji, callback_data: 'spy_do_' + key });
                if (row.length === 4) { buttons.push(row); row = []; }
            }
            if (row.length > 0) buttons.push(row);
            buttons.push([{ text: '🔙 برگشت', callback_data: 'menu_spy' }]);
            await bot.editMessageText('🕵️ *کدوم کشور؟*', { chat_id: chatId, message_id: msgId, parse_mode: 'Markdown', reply_markup: { inline_keyboard: buttons } });
            return bot.answerCallbackQuery(query.id);
        }
        
        if (data.startsWith('spy_do_')) {
            const key = data.replace('spy_do_', '');
            if (p.treasury < 200) return bot.answerCallbackQuery(query.id, { text: '❌ ۲۰۰ دلار لازمه!', show_alert: true });
            p.treasury -= 200;
            player.addSpy(userId, key, 'rookie');
            await bot.editMessageText(`🕵️ *جاسوس به ${config.countries[key].name} فرستاده شد!*\n⏰ ۱ ساعت دیگه خبر میده`, { chat_id: chatId, message_id: msgId, parse_mode: 'Markdown', reply_markup: { inline_keyboard: [[{ text: '🔙 برگشت', callback_data: 'menu_spy' }]] } });
            return bot.answerCallbackQuery(query.id);
        }
        
        if (data === 'spy_find') {
            if (Math.random() < 0.3) {
                player.addPrisoner(userId, 'جاسوس دشمن', 'جاسوسی');
                await bot.editMessageText('🔍 *جاسوس پیدا شد!*\n🔒 فرستاده شد به زندان', { chat_id: chatId, message_id: msgId, parse_mode: 'Markdown', reply_markup: { inline_keyboard: [[{ text: '🔙 برگشت', callback_data: 'menu_spy' }]] } });
            } else {
                await bot.editMessageText('🔍 *چیزی پیدا نشد*', { chat_id: chatId, message_id: msgId, parse_mode: 'Markdown', reply_markup: { inline_keyboard: [[{ text: '🔙 برگشت', callback_data: 'menu_spy' }]] } });
            }
            return bot.answerCallbackQuery(query.id);
        }
        
        // ============ 🔒 زندان ============
        if (data === 'menu_prison') {
            await bot.editMessageText(`🔒 *زندان*\n👥 ${p.prisoners.length} زندانی`, { chat_id: chatId, message_id: msgId, parse_mode: 'Markdown', reply_markup: { inline_keyboard: [
                [{ text: '👥 زندانیان', callback_data: 'prison_list' }, { text: '➕ زندانی جدید', callback_data: 'prison_add' }],
                [{ text: '🔙 برگشت', callback_data: 'menu_main' }]
            ] } });
            return bot.answerCallbackQuery(query.id);
        }
        
        if (data === 'prison_list') {
            if (p.prisoners.length === 0) {
                await bot.editMessageText('🔒 *زندان خالیه!*', { chat_id: chatId, message_id: msgId, parse_mode: 'Markdown', reply_markup: { inline_keyboard: [[{ text: '🔙 برگشت', callback_data: 'menu_prison' }]] } });
                return bot.answerCallbackQuery(query.id);
            }
            let text = '👥 *زندانیان*\n\n';
            let buttons = [];
            for (let pr of p.prisoners) {
                text += `${pr.name} - ${pr.reason}\n`;
                buttons.push([{ text: `${pr.name}`, callback_data: 'prison_select_' + pr.id }]);
            }
            buttons.push([{ text: '🔙 برگشت', callback_data: 'menu_prison' }]);
            await bot.editMessageText(text, { chat_id: chatId, message_id: msgId, parse_mode: 'Markdown', reply_markup: { inline_keyboard: buttons } });
            return bot.answerCallbackQuery(query.id);
        }
        
        if (data.startsWith('prison_select_')) {
            const prid = parseInt(data.replace('prison_select_', ''));
            const pr = p.prisoners.find(x => x.id === prid);
            if (!pr) return bot.answerCallbackQuery(query.id);
            await bot.editMessageText(`👤 *${pr.name}*\n📝 ${pr.reason}`, { chat_id: chatId, message_id: msgId, parse_mode: 'Markdown', reply_markup: { inline_keyboard: [
                [{ text: '🔍 بازجویی', callback_data: 'prison_interrogate_' + pr.id }],
                [{ text: '💀 اعدام', callback_data: 'prison_execute_' + pr.id }],
                [{ text: '🔓 آزادی', callback_data: 'prison_release_' + pr.id }],
                [{ text: '🔙 برگشت', callback_data: 'prison_list' }]
            ] } });
            return bot.answerCallbackQuery(query.id);
        }
        
        if (data.startsWith('prison_interrogate_')) {
            const prid = parseInt(data.replace('prison_interrogate_', ''));
            const pr = p.prisoners.find(x => x.id === prid);
            if (!pr || pr.interrogated) return bot.answerCallbackQuery(query.id);
            pr.interrogated = true;
            if (Math.random() < 0.5) { p.treasury += 300; await bot.editMessageText(`🔍 *اعتراف کرد!*\n💰 +۳۰۰ دلار`, { chat_id: chatId, message_id: msgId, parse_mode: 'Markdown', reply_markup: { inline_keyboard: [[{ text: '🔙 برگشت', callback_data: 'prison_list' }]] } }); }
            else { await bot.editMessageText('🔍 *چیزی نگفت!*', { chat_id: chatId, message_id: msgId, parse_mode: 'Markdown', reply_markup: { inline_keyboard: [[{ text: '🔙 برگشت', callback_data: 'prison_list' }]] } }); }
            return bot.answerCallbackQuery(query.id);
        }
        
        if (data.startsWith('prison_execute_')) {
            const prid = parseInt(data.replace('prison_execute_', ''));
            const idx = p.prisoners.findIndex(x => x.id === prid);
            if (idx === -1) return bot.answerCallbackQuery(query.id);
            p.prisoners.splice(idx, 1);
            await bot.editMessageText('💀 *اعدام شد!*', { chat_id: chatId, message_id: msgId, parse_mode: 'Markdown', reply_markup: { inline_keyboard: [[{ text: '🔙 برگشت', callback_data: 'prison_list' }]] } });
            return bot.answerCallbackQuery(query.id);
        }
        
        if (data.startsWith('prison_release_')) {
            const prid = parseInt(data.replace('prison_release_', ''));
            const idx = p.prisoners.findIndex(x => x.id === prid);
            if (idx === -1) return bot.answerCallbackQuery(query.id);
            p.prisoners.splice(idx, 1);
            p.popularity = Math.min(100, p.popularity + 5);
            await bot.editMessageText('🔓 *آزاد شد!*\n📊 +۵٪ محبوبیت', { chat_id: chatId, message_id: msgId, parse_mode: 'Markdown', reply_markup: { inline_keyboard: [[{ text: '🔙 برگشت', callback_data: 'prison_list' }]] } });
            return bot.answerCallbackQuery(query.id);
        }
        
        if (data === 'prison_add') {
            const names = ['جاسوس', 'خائن', 'دزد', 'معترض'];
            player.addPrisoner(userId, names[Math.floor(Math.random()*4)], 'متهم');
            await bot.editMessageText('➕ *زندانی جدید اضافه شد!*', { chat_id: chatId, message_id: msgId, parse_mode: 'Markdown', reply_markup: { inline_keyboard: [[{ text: '🔙 برگشت', callback_data: 'menu_prison' }]] } });
            return bot.answerCallbackQuery(query.id);
        }
        
    } catch (e) {
        console.log('Error:', e.message);
        await bot.answerCallbackQuery(query.id, { text: '❌ خطا!', show_alert: true });
    }
});

// ============ ادمین ============
bot.onText(/\/god/, async (msg) => {
    const p = player.getPlayer(msg.from.id);
    p.treasury = 999999; p.oil = 999999; p.gold = 99999;
    p.army.soldier = 9999; p.army.drone = 999; p.army.missile = 999;
    p.defense = 999; p.popularity = 100;
    await bot.sendMessage(msg.chat.id, '⚡ گاد مود!');
});

bot.onText(/\/money (\d+)/, async (msg, match) => {
    const p = player.getPlayer(msg.from.id);
    p.treasury += parseInt(match[1]);
    await bot.sendMessage(msg.chat.id, `💰 +${match[1]} دلار`);
});

console.log('👑 امپراطوری ۱۴۰۶ آماده شد!');