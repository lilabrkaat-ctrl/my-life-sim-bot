const player = require('./player');

function prisonMenu() {
    return {
        reply_markup: {
            inline_keyboard: [
                [{ text: '👥 زندانیان', callback_data: 'prison_list' }, { text: '🔍 بازجویی', callback_data: 'prison_interrogate' }],
                [{ text: '💀 اعدام', callback_data: 'prison_execute' }, { text: '🔓 آزادی', callback_data: 'prison_release' }],
                [{ text: '🏃 فرار', callback_data: 'prison_escape' }, { text: '➕ زندانی جدید', callback_data: 'prison_add' }],
                [{ text: '🔙 برگشت', callback_data: 'menu_main' }]
            ]
        }
    };
}

function setupPrisonHandlers(bot) {
    
    bot.on('callback_query', async (query) => {
        const chatId = query.message.chat.id;
        const msgId = query.message.message_id;
        const userId = query.from.id;
        const data = query.data;
        
        if (!data.startsWith('prison_')) return;
        
        const p = player.getPlayer(userId);
        
        // منوی زندان
        if (data === 'menu_prison') {
            await bot.editMessageText(
                '🔒 *زندان اوین*\n\n' +
                `👥 زندانیان: ${p.prisoners.length} نفر\n` +
                `🔍 بازجویی نشده: ${p.prisoners.filter(pr => !pr.interrogated).length} نفر\n\n` +
                'عملیات:',
                { chat_id: chatId, message_id: msgId, parse_mode: 'Markdown', ...prisonMenu() }
            );
            return bot.answerCallbackQuery(query.id);
        }
        
        // لیست زندانیان
        if (data === 'prison_list') {
            if (p.prisoners.length === 0) {
                await bot.editMessageText(
                    '👥 *زندانیان*\n\n❌ زندان خالیه!',
                    { chat_id: chatId, message_id: msgId, parse_mode: 'Markdown',
                      reply_markup: { inline_keyboard: [[{ text: '🔙 برگشت', callback_data: 'menu_prison' }]] } }
                );
                return bot.answerCallbackQuery(query.id);
            }
            
            let text = '👥 *زندانیان*\n\n';
            let buttons = [];
            
            for (let i = 0; i < p.prisoners.length; i++) {
                const pr = p.prisoners[i];
                const daysAgo = Math.floor((Date.now() - pr.capturedAt) / 86400000);
                
                text += `${i+1}. ${pr.name}\n`;
                text += `   📝 جرم: ${pr.reason}\n`;
                text += `   ⏰ ${daysAgo} روز در زندان\n`;
                text += `   🔍 ${pr.interrogated ? 'بازجویی شده' : 'بازجویی نشده'}\n\n`;
                
                buttons.push([{ 
                    text: `${pr.name} - ${pr.interrogated ? '✅' : '🔍'}`, 
                    callback_data: `prison_select_${pr.id}` 
                }]);
            }
            
            buttons.push([{ text: '🔙 برگشت', callback_data: 'menu_prison' }]);
            
            await bot.editMessageText(
                text,
                { chat_id: chatId, message_id: msgId, parse_mode: 'Markdown',
                  reply_markup: { inline_keyboard: buttons } }
            );
            return bot.answerCallbackQuery(query.id);
        }
        
        // انتخاب زندانی
        if (data.startsWith('prison_select_')) {
            const prisonerId = parseInt(data.replace('prison_select_', ''));
            const prisoner = p.prisoners.find(pr => pr.id === prisonerId);
            
            if (!prisoner) return bot.answerCallbackQuery(query.id, { text: '❌ زندانی پیدا نشد!' });
            
            await bot.editMessageText(
                `👤 *${prisoner.name}*\n\n` +
                `📝 جرم: ${prisoner.reason}\n` +
                `🔍 وضعیت: ${prisoner.interrogated ? 'بازجویی شده' : 'بازجویی نشده'}\n\n` +
                'عملیات:',
                { chat_id: chatId, message_id: msgId, parse_mode: 'Markdown',
                  reply_markup: {
                      inline_keyboard: [
                          [{ text: '🔍 بازجویی', callback_data: `prison_interrogate_${prisoner.id}` }],
                          [{ text: '💀 اعدام', callback_data: `prison_execute_${prisoner.id}` }],
                          [{ text: '🔓 آزادی', callback_data: `prison_release_${prisoner.id}` }],
                          [{ text: '🔙 برگشت', callback_data: 'prison_list' }]
                      ]
                  }
                }
            );
            return bot.answerCallbackQuery(query.id);
        }
        
        // بازجویی زندانی
        if (data.startsWith('prison_interrogate_')) {
            const prisonerId = parseInt(data.replace('prison_interrogate_', ''));
            const prisoner = p.prisoners.find(pr => pr.id === prisonerId);
            
            if (!prisoner) return bot.answerCallbackQuery(query.id);
            if (prisoner.interrogated) return bot.answerCallbackQuery(query.id, { text: '❌ قبلاً بازجویی شده!' });
            
            prisoner.interrogated = true;
            const talked = Math.random() < 0.5;
            
            if (talked) {
                p.treasury += 300;
                await bot.editMessageText(
                    '🔍 *بازجویی موفق!*\n\n' +
                    `${prisoner.name} اعتراف کرد!\n` +
                    '💰 اطلاعات: +۳۰۰ دلار',
                    { chat_id: chatId, message_id: msgId, parse_mode: 'Markdown',
                      reply_markup: { inline_keyboard: [[{ text: '🔙 برگشت', callback_data: 'menu_prison' }]] } }
                );
            } else {
                await bot.editMessageText(
                    '🔍 *بازجویی شکست خورد!*\n\n' +
                    `${prisoner.name} مقاومت کرد و چیزی نگفت!`,
                    { chat_id: chatId, message_id: msgId, parse_mode: 'Markdown',
                      reply_markup: { inline_keyboard: [[{ text: '🔙 برگشت', callback_data: 'menu_prison' }]] } }
                );
            }
            return bot.answerCallbackQuery(query.id);
        }
        
        // اعدام زندانی
        if (data.startsWith('prison_execute_')) {
            const prisonerId = parseInt(data.replace('prison_execute_', ''));
            const index = p.prisoners.findIndex(pr => pr.id === prisonerId);
            
            if (index === -1) return bot.answerCallbackQuery(query.id);
            
            const prisoner = p.prisoners[index];
            p.prisoners.splice(index, 1);
            p.popularity = Math.max(0, p.popularity - 3);
            
            await bot.editMessageText(
                '💀 *اعدام شد!*\n\n' +
                `${prisoner.name} اعدام شد.\n` +
                '📊 محبوبیت: -۳٪',
                { chat_id: chatId, message_id: msgId, parse_mode: 'Markdown',
                  reply_markup: { inline_keyboard: [[{ text: '🔙 برگشت', callback_data: 'menu_prison' }]] } }
            );
            return bot.answerCallbackQuery(query.id);
        }
        
        // آزادی زندانی
        if (data.startsWith('prison_release_')) {
            const prisonerId = parseInt(data.replace('prison_release_', ''));
            const index = p.prisoners.findIndex(pr => pr.id === prisonerId);
            
            if (index === -1) return bot.answerCallbackQuery(query.id);
            
            const prisoner = p.prisoners[index];
            p.prisoners.splice(index, 1);
            p.popularity = Math.min(100, p.popularity + 5);
            
            await bot.editMessageText(
                '🔓 *آزاد شد!*\n\n' +
                `${prisoner.name} از زندان آزاد شد.\n` +
                '📊 محبوبیت: +۵٪',
                { chat_id: chatId, message_id: msgId, parse_mode: 'Markdown',
                  reply_markup: { inline_keyboard: [[{ text: '🔙 برگشت', callback_data: 'menu_prison' }]] } }
            );
            return bot.answerCallbackQuery(query.id);
        }
        
        // فرار زندانی
        if (data === 'prison_escape') {
            if (p.prisoners.length === 0) {
                return bot.answerCallbackQuery(query.id, { text: '❌ زندان خالیه!', show_alert: true });
            }
            
            const escaped = Math.random() < 0.3;
            
            if (escaped) {
                const randomIndex = Math.floor(Math.random() * p.prisoners.length);
                const prisoner = p.prisoners[randomIndex];
                p.prisoners.splice(randomIndex, 1);
                p.popularity = Math.max(0, p.popularity - 5);
                
                await bot.editMessageText(
                    '🏃 *فرار کرد!*\n\n' +
                    `${prisoner.name} از زندان فرار کرد!\n` +
                    '📊 محبوبیت: -۵٪\n' +
                    '⚠️ امنیت زندان کمه!',
                    { chat_id: chatId, message_id: msgId, parse_mode: 'Markdown',
                      reply_markup: { inline_keyboard: [[{ text: '🔙 برگشت', callback_data: 'menu_prison' }]] } }
                );
            } else {
                await bot.editMessageText(
                    '🏃 *فرار ناموفق!*\n\n' +
                    'زندانی نتونست فرار کنه.\n' +
                    '🔒 امنیت تشدید شد.',
                    { chat_id: chatId, message_id: msgId, parse_mode: 'Markdown',
                      reply_markup: { inline_keyboard: [[{ text: '🔙 برگشت', callback_data: 'menu_prison' }]] } }
                );
            }
            return bot.answerCallbackQuery(query.id);
        }
        
        // اضافه کردن زندانی جدید
        if (data === 'prison_add') {
            const names = ['جاسوس', 'خائن', 'دزد', 'معترض', 'روزنامه‌نگار', 'فعال سیاسی'];
            const reasons = ['جاسوسی', 'خیانت', 'دزدی', 'اعتراض', 'نشر اکاذیب', 'فعالیت سیاسی'];
            const randomIndex = Math.floor(Math.random() * names.length);
            
            player.addPrisoner(userId, names[randomIndex], reasons[randomIndex]);
            
            await bot.editMessageText(
                '➕ *زندانی جدید*\n\n' +
                `${names[randomIndex]} به زندان اضافه شد!\n` +
                `📝 جرم: ${reasons[randomIndex]}`,
                { chat_id: chatId, message_id: msgId, parse_mode: 'Markdown',
                  reply_markup: { inline_keyboard: [[{ text: '🔙 برگشت', callback_data: 'menu_prison' }]] } }
            );
            return bot.answerCallbackQuery(query.id);
        }
    });
}

module.exports = { prisonMenu, setupPrisonHandlers };