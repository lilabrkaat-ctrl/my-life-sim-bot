const player = require('./player');

function haremMenu() {
    return {
        reply_markup: {
            inline_keyboard: [
                [{ text: '👸 ملکه‌ها', callback_data: 'harem_queens' }, { text: '💕 وقت گذروندن', callback_data: 'harem_time' }],
                [{ text: '🤰 بارداری', callback_data: 'harem_pregnancy' }, { text: '👶 فرزندان', callback_data: 'harem_children' }],
                [{ text: '💍 ملکه جدید', callback_data: 'harem_new' }, { text: '🐍 دسیسه', callback_data: 'harem_intrigue' }],
                [{ text: '🚪 اخراج', callback_data: 'harem_kick' }, { text: '🔙 برگشت', callback_data: 'menu_main' }]
            ]
        }
    };
}

function setupHaremHandlers(bot) {
    
    bot.on('callback_query', async (query) => {
        const chatId = query.message.chat.id;
        const msgId = query.message.message_id;
        const userId = query.from.id;
        const data = query.data;
        
        if (!data.startsWith('harem_')) return;
        
        const p = player.getPlayer(userId);
        
        // منوی حرمسرا
        if (data === 'menu_harem') {
            await bot.editMessageText(
                '👸 *حرمسرای سلطنتی*\n\n' +
                `👸 ملکه‌ها: ${p.queens.length}/۴\n` +
                `👶 فرزندان: ${p.children.length}\n` +
                `🤰 بارداری فعال: ${p.queens.filter(q => q.pregnant).length}\n\n` +
                'عملیات:',
                { chat_id: chatId, message_id: msgId, parse_mode: 'Markdown', ...haremMenu() }
            );
            return bot.answerCallbackQuery(query.id);
        }
        
        // نمایش ملکه‌ها
        if (data === 'harem_queens') {
            if (p.queens.length === 0) {
                await bot.editMessageText(
                    '👸 *ملکه‌ها*\n\n❌ هیچ ملکه‌ای نداری!\n💡 یه ملکه جدید پیدا کن.',
                    { chat_id: chatId, message_id: msgId, parse_mode: 'Markdown',
                      reply_markup: { inline_keyboard: [[{ text: '💍 پیدا کردن ملکه', callback_data: 'harem_new' }], [{ text: '🔙 برگشت', callback_data: 'menu_harem' }]] } }
                );
                return bot.answerCallbackQuery(query.id);
            }
            
            let text = '👸 *ملکه‌های تو*\n\n';
            let buttons = [];
            
            for (let i = 0; i < p.queens.length; i++) {
                const q = p.queens[i];
                text += `${i+1}. ${q.name} (${q.age} ساله)\n`;
                text += `   😊 روحیه: ${q.mood}%\n`;
                text += `   ${q.pregnant ? '🤰 باردار' : '✅ آماده بارداری'}\n\n`;
                
                buttons.push([{ 
                    text: `${q.name} - ${q.pregnant ? '🤰' : '👸'}`, 
                    callback_data: `harem_queen_${q.id}` 
                }]);
            }
            
            buttons.push([{ text: '🔙 برگشت', callback_data: 'menu_harem' }]);
            
            await bot.editMessageText(
                text,
                { chat_id: chatId, message_id: msgId, parse_mode: 'Markdown',
                  reply_markup: { inline_keyboard: buttons } }
            );
            return bot.answerCallbackQuery(query.id);
        }
        
        // انتخاب یه ملکه خاص
        if (data.startsWith('harem_queen_')) {
            const queenId = parseInt(data.replace('harem_queen_', ''));
            const queen = p.queens.find(q => q.id === queenId);
            
            if (!queen) return bot.answerCallbackQuery(query.id, { text: '❌ پیدا نشد!' });
            
            await bot.editMessageText(
                `👸 *${queen.name}*\n\n` +
                `🎂 سن: ${queen.age} سال\n` +
                `😊 روحیه: ${queen.mood}%\n` +
                `${queen.pregnant ? '🤰 باردار' : '✅ آماده بارداری'}\n\n` +
                'چیکار می‌کنی؟',
                { chat_id: chatId, message_id: msgId, parse_mode: 'Markdown',
                  reply_markup: {
                      inline_keyboard: [
                          [{ text: '💕 وقت گذروندن', callback_data: `harem_spend_${queen.id}` }],
                          [{ text: '🤰 بارداری', callback_data: `harem_preg_${queen.id}` }],
                          [{ text: '🎁 هدیه بده', callback_data: `harem_gift_${queen.id}` }],
                          [{ text: '🚪 اخراج', callback_data: `harem_kick_${queen.id}` }],
                          [{ text: '🔙 برگشت', callback_data: 'harem_queens' }]
                      ]
                  }
                }
            );
            return bot.answerCallbackQuery(query.id);
        }
        
        // وقت گذروندن با ملکه
        if (data.startsWith('harem_spend_')) {
            const queenId = parseInt(data.replace('harem_spend_', ''));
            const queen = p.queens.find(q => q.id === queenId);
            
            if (!queen) return bot.answerCallbackQuery(query.id);
            
            queen.mood = Math.min(100, queen.mood + 20);
            p.popularity = Math.min(100, p.popularity + 3);
            
            await bot.editMessageText(
                `💕 *وقت با ${queen.name}*\n\n` +
                '"شاهم... امشب فوق‌العاده بود..."\n\n' +
                `😊 روحیه ${queen.name}: +۲۰٪\n` +
                `📊 محبوبیت: +۳٪`,
                { chat_id: chatId, message_id: msgId, parse_mode: 'Markdown',
                  reply_markup: { inline_keyboard: [[{ text: '🔙 برگشت', callback_data: 'menu_harem' }]] } }
            );
            return bot.answerCallbackQuery(query.id, { text: '💕 روحیه ملکه افزایش یافت!' });
        }
        
        // بارداری
        if (data.startsWith('harem_preg_')) {
            const queenId = parseInt(data.replace('harem_preg_', ''));
            const queen = p.queens.find(q => q.id === queenId);
            
            if (!queen) return bot.answerCallbackQuery(query.id);
            if (queen.pregnant) return bot.answerCallbackQuery(query.id, { text: '❌ قبلاً بارداره!', show_alert: true });
            
            queen.pregnant = true;
            queen.dueDate = Date.now() + 3000; // ۳ ثانیه برای تست
            
            // تولد بچه بعد از ۳ ثانیه
            setTimeout(() => {
                if (queen.pregnant) {
                    queen.pregnant = false;
                    const names = ['کوروش', 'داریوش', 'آتنا', 'آناهیتا', 'رستم', 'سهراب'];
                    const name = names[Math.floor(Math.random() * names.length)];
                    player.addChild(userId, name, queenId);
                    bot.sendMessage(chatId, `👶 *${queen.name} بچه‌دار شد!*\n🎉 ${name} به دنیا اومد!`, { parse_mode: 'Markdown' });
                }
            }, 3000);
            
            await bot.editMessageText(
                `🤰 *${queen.name} باردار شد!*\n\n` +
                '⏰ ۳ ثانیه دیگه بچه به دنیا میاد...',
                { chat_id: chatId, message_id: msgId, parse_mode: 'Markdown',
                  reply_markup: { inline_keyboard: [[{ text: '🔙 برگشت', callback_data: 'menu_harem' }]] } }
            );
            return bot.answerCallbackQuery(query.id);
        }
        
        // فرزندان
        if (data === 'harem_children') {
            if (p.children.length === 0) {
                await bot.editMessageText(
                    '👶 *فرزندان*\n\n❌ هیچ فرزندی نداری!',
                    { chat_id: chatId, message_id: msgId, parse_mode: 'Markdown',
                      reply_markup: { inline_keyboard: [[{ text: '🔙 برگشت', callback_data: 'menu_harem' }]] } }
                );
                return bot.answerCallbackQuery(query.id);
            }
            
            let text = '👶 *فرزندان تو*\n\n';
            let buttons = [];
            
            for (let i = 0; i < p.children.length; i++) {
                const c = p.children[i];
                const mother = p.queens.find(q => q.id === c.motherId);
                text += `${i+1}. ${c.name} (${c.age} ساله)\n`;
                text += `   👩 مادر: ${mother ? mother.name : 'نامشخص'}\n`;
                text += `   🎓 تحصیلات: ${c.education}%\n`;
                text += `   💼 شغل: ${c.career || 'نداره'}\n\n`;
                
                buttons.push([{ 
                    text: `${c.name}`, 
                    callback_data: `harem_child_${c.id}` 
                }]);
            }
            
            buttons.push([{ text: '🔙 برگشت', callback_data: 'menu_harem' }]);
            
            await bot.editMessageText(
                text,
                { chat_id: chatId, message_id: msgId, parse_mode: 'Markdown',
                  reply_markup: { inline_keyboard: buttons } }
            );
            return bot.answerCallbackQuery(query.id);
        }
        
        // ملکه جدید
        if (data === 'harem_new') {
            if (p.queens.length >= 4) {
                return bot.answerCallbackQuery(query.id, { text: '❌ حرمسرا پره! (حداکثر ۴ ملکه)', show_alert: true });
            }
            
            const cost = 500;
            if (p.treasury < cost) {
                return bot.answerCallbackQuery(query.id, { text: '❌ پول کافی نداری! نیاز: ۵۰۰ دلار', show_alert: true });
            }
            
            const names = ['سارا', 'نگار', 'مریم', 'الهام', 'شیرین', 'پریسا', 'آتوسا', 'کتایون'];
            const name = names[Math.floor(Math.random() * names.length)];
            const age = Math.floor(Math.random() * 10) + 20;
            
            p.treasury -= cost;
            player.addQueen(userId, name, age);
            
            await bot.editMessageText(
                '💍 *ملکه جدید!*\n\n' +
                `👸 ${name} (${age} ساله) به حرمسرا اضافه شد!\n` +
                `💰 هزینه: ${cost} دلار`,
                { chat_id: chatId, message_id: msgId, parse_mode: 'Markdown',
                  reply_markup: { inline_keyboard: [[{ text: '🔙 برگشت', callback_data: 'menu_harem' }]] } }
            );
            return bot.answerCallbackQuery(query.id);
        }
        
        // اخراج ملکه
        if (data.startsWith('harem_kick_')) {
            const queenId = parseInt(data.replace('harem_kick_', ''));
            const queen = p.queens.find(q => q.id === queenId);
            
            if (!queen) return bot.answerCallbackQuery(query.id);
            
            player.removeQueen(userId, queenId);
            p.popularity = Math.max(0, p.popularity - 5);
            
            await bot.editMessageText(
                `🚪 *${queen.name} اخراج شد!*\n\n` +
                '📊 محبوبیت: -۵٪',
                { chat_id: chatId, message_id: msgId, parse_mode: 'Markdown',
                  reply_markup: { inline_keyboard: [[{ text: '🔙 برگشت', callback_data: 'menu_harem' }]] } }
            );
            return bot.answerCallbackQuery(query.id);
        }
        
        // دسیسه
        if (data === 'harem_intrigue') {
            if (p.queens.length < 2) {
                return bot.answerCallbackQuery(query.id, { text: '❌ حداقل ۲ ملکه لازمه!', show_alert: true });
            }
            
            const queen1 = p.queens[Math.floor(Math.random() * p.queens.length)];
            const queen2 = p.queens.find(q => q.id !== queen1.id);
            
            if (!queen2) return bot.answerCallbackQuery(query.id);
            
            const discovered = Math.random() < 0.5;
            
            if (discovered) {
                queen1.mood = Math.max(0, queen1.mood - 30);
                await bot.editMessageText(
                    '🐍 *دسیسه لو رفت!*\n\n' +
                    `${queen1.name} می‌خواست ${queen2.name} رو مسموم کنه!\n` +
                    `😊 روحیه ${queen1.name}: -۳۰٪\n` +
                    '⚖️ باید محاکمه بشه!',
                    { chat_id: chatId, message_id: msgId, parse_mode: 'Markdown',
                      reply_markup: { inline_keyboard: [[{ text: '🔙 برگشت', callback_data: 'menu_harem' }]] } }
                );
            } else {
                await bot.editMessageText(
                    '🐍 *دسیسه موفق!*\n\n' +
                    'ملکه‌ها علیه هم توطئه کردن...\n' +
                    'ولی هنوز کشف نشده.',
                    { chat_id: chatId, message_id: msgId, parse_mode: 'Markdown',
                      reply_markup: { inline_keyboard: [[{ text: '🔙 برگشت', callback_data: 'menu_harem' }]] } }
                );
            }
            return bot.answerCallbackQuery(query.id);
        }
    });
}

module.exports = { haremMenu, setupHaremHandlers };