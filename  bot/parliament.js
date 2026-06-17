const player = require('../player');

// نمایندگان مجلس
const mps = [
    { id: 1, name: 'محمدباقر قالیباف', emoji: '👮', faction: 'osul', loyalty: 30, role: 'رئیس مجلس', cost: 5000 },
    { id: 2, name: 'سعید جلیلی', emoji: '🕴️', faction: 'osul', loyalty: 20, role: 'امنیت ملی', cost: 4000 },
    { id: 3, name: 'محمدرضا باهنر', emoji: '👔', faction: 'osul', loyalty: 35, role: 'نایب رئیس', cost: 3000 },
    { id: 4, name: 'علیرضا زاکانی', emoji: '👤', faction: 'osul', loyalty: 40, role: 'نایب رئیس دوم', cost: 3500 },
    { id: 5, name: 'احمد جنتی', emoji: '🕌', faction: 'osul', loyalty: 25, role: 'شورای نگهبان', cost: 4000 },
    { id: 6, name: 'اسماعیل قاآنی', emoji: '🎖️', faction: 'osul', loyalty: 45, role: 'نظامی', cost: 5000 },
    { id: 7, name: 'غلامحسین محسنی اژه‌ای', emoji: '⚖️', faction: 'osul', loyalty: 30, role: 'قوه قضائیه', cost: 5000 },
    { id: 8, name: 'سید محمد خاتمی', emoji: '🧥', faction: 'eslah', loyalty: 70, role: 'فرهنگ', cost: 5000 },
    { id: 9, name: 'مسعود پزشکیان', emoji: '💊', faction: 'eslah', loyalty: 80, role: 'بهداشت', cost: 5000 },
    { id: 10, name: 'اسحاق جهانگیری', emoji: '👔', faction: 'eslah', loyalty: 65, role: 'اقتصاد', cost: 3500 },
    { id: 11, name: 'مصطفی معین', emoji: '🎓', faction: 'eslah', loyalty: 60, role: 'آموزش', cost: 2500 },
    { id: 12, name: 'محمدجواد ظریف', emoji: '📚', faction: 'eslah', loyalty: 55, role: 'سیاست خارجی', cost: 4000 },
    { id: 13, name: 'معصومه ابتکار', emoji: '👩‍💼', faction: 'eslah', loyalty: 65, role: 'محیط زیست', cost: 3000 },
    { id: 14, name: 'سید حسن خمینی', emoji: '🗣️', faction: 'eslah', loyalty: 50, role: 'فرهنگ', cost: 4000 },
    { id: 15, name: 'علی لاریجانی', emoji: '🏛️', faction: 'etedal', loyalty: 50, role: 'مشاور عالی', cost: 4000 },
    { id: 16, name: 'محمود احمدی‌نژاد', emoji: '👔', faction: 'mostaghel', loyalty: 30, role: 'منتقد', cost: 4000 },
    { id: 17, name: 'محسن رضایی', emoji: '⚔️', faction: 'mostaghel', loyalty: 40, role: 'نظامی', cost: 3500 },
    { id: 18, name: 'قاسم سلیمانی', emoji: '🎖️', faction: 'mostaghel', loyalty: 60, role: 'دفاع', cost: 5000 },
    { id: 19, name: 'سید مجتبی خامنه‌ای', emoji: '📱', faction: 'mostaghel', loyalty: 35, role: 'فناوری', cost: 5000 },
    { id: 20, name: 'میرحسین موسوی', emoji: '🟢', faction: 'radical', loyalty: 15, role: 'منتقد', cost: 4000 },
    { id: 21, name: 'مهدی کروبی', emoji: '📰', faction: 'radical', loyalty: 20, role: 'حقوق بشر', cost: 3500 },
    { id: 22, name: 'بابک زنجانی', emoji: '💰', faction: 'mostaghel', loyalty: 10, role: 'مشاور اقتصادی', cost: 2000 },
    { id: 23, name: 'رضا پهلوی', emoji: '🌍', faction: 'radical', loyalty: 5, role: 'اپوزیسیون', cost: 5000 },
    { id: 24, name: 'سید علی خامنه‌ای', emoji: '🕌', faction: 'osul', loyalty: 40, role: 'رهبر', cost: 10000 },
    { id: 25, name: 'سید روح‌الله خمینی', emoji: '🕌', faction: 'osul', loyalty: 50, role: 'بنیانگذار', cost: 10000 },
    { id: 26, name: 'سید محمود طالقانی', emoji: '📖', faction: 'eslah', loyalty: 75, role: 'معنوی', cost: 4000 },
    { id: 27, name: 'سید محمد بهشتی', emoji: '⚖️', faction: 'osul', loyalty: 55, role: 'قضایی', cost: 4000 },
    { id: 28, name: 'مصطفی چمران', emoji: '🗡️', faction: 'mostaghel', loyalty: 65, role: 'دفاع', cost: 4000 },
    { id: 29, name: 'اکبر هاشمی رفسنجانی', emoji: '🦊', faction: 'etedal', loyalty: 45, role: 'اقتصاد', cost: 5000 },
    { id: 30, name: 'حسن روحانی', emoji: '👓', faction: 'etedal', loyalty: 50, role: 'دیپلماسی', cost: 4000 }
];

// طرح‌های قابل رأی‌گیری
const bills = [
    { id: 'tax_down', name: 'کاهش مالیات', effect: 'pop', value: 15, cost: 500 },
    { id: 'tax_up', name: 'افزایش مالیات', effect: 'money', value: 1000, cost: 0 },
    { id: 'internet_free', name: 'اینترنت آزاد', effect: 'pop', value: 25, cost: 1000 },
    { id: 'internet_block', name: 'افزایش فیلترینگ', effect: 'control', value: 10, cost: 500 },
    { id: 'military_up', name: 'تقویت نظامی', effect: 'defense', value: 15, cost: 2000 },
    { id: 'health', name: 'بهداشت رایگان', effect: 'pop', value: 20, cost: 1500 },
    { id: 'education', name: 'آموزش رایگان', effect: 'pop', value: 18, cost: 1200 },
    { id: 'oil_sell', name: 'فروش نفت به همه', effect: 'money', value: 5000, cost: 0 },
    { id: 'sanction', name: 'تحریم جدید', effect: 'sanction', value: 1, cost: 300 }
];

const activeVotes = {};

function parliamentMenu() {
    return {
        reply_markup: {
            inline_keyboard: [
                [{ text: '📋 طرح جدید', callback_data: 'parl_new_bill' }, { text: '👥 نمایندگان', callback_data: 'parl_mps' }],
                [{ text: '🤝 لابی‌گری', callback_data: 'parl_lobby' }, { text: '📊 رأی‌گیری فعال', callback_data: 'parl_active' }],
                [{ text: '🔙 برگشت', callback_data: 'menu_main' }]
            ]
        }
    };
}

function setupParliament(bot) {
    
    bot.on('callback_query', async (query) => {
        const chatId = query.message.chat.id;
        const msgId = query.message.message_id;
        const userId = query.from.id;
        const data = query.data;
        
        if (!data.startsWith('parl_') && data !== 'menu_parliament') return;
        
        const p = player.getPlayer(userId);
        
        try {
            // منوی مجلس
            if (data === 'menu_parliament') {
                let text = '🏛️ *مجلس شورای اسلامی*\n\n';
                text += `👥 نمایندگان: ۳۰ نفر\n`;
                text += `📋 طرح‌های فعال: ${Object.keys(activeVotes).length}\n`;
                text += `📊 محبوبیت: ${p.popularity}%\n\n`;
                text += 'بخش:';
                
                await bot.editMessageText(text, {
                    chat_id: chatId, message_id: msgId, parse_mode: 'Markdown', ...parliamentMenu()
                });
                return bot.answerCallbackQuery(query.id);
            }
            
            // طرح جدید
            if (data === 'parl_new_bill') {
                let text = '📋 *طرح‌های قابل ارائه*\n\n';
                let buttons = [];
                
                for (let bill of bills) {
                    text += `${bill.name} - 💰${bill.cost} دلار\n`;
                    buttons.push([{ text: `${bill.name} (${bill.cost} دلار)`, callback_data: `parl_bill_${bill.id}` }]);
                }
                buttons.push([{ text: '🔙 برگشت', callback_data: 'menu_parliament' }]);
                
                await bot.editMessageText(text, {
                    chat_id: chatId, message_id: msgId, parse_mode: 'Markdown',
                    reply_markup: { inline_keyboard: buttons }
                });
                return bot.answerCallbackQuery(query.id);
            }
            
            // شروع رأی‌گیری برای یه طرح
            if (data.startsWith('parl_bill_')) {
                const billId = data.replace('parl_bill_', '');
                const bill = bills.find(b => b.id === billId);
                if (!bill) return bot.answerCallbackQuery(query.id);
                if (p.treasury < bill.cost) return bot.answerCallbackQuery(query.id, { text: '❌ پول کافی نداری!', show_alert: true });
                
                p.treasury -= bill.cost;
                
                const voteId = 'vote_' + Date.now();
                const voteEnd = Date.now() + 30000; // ۳۰ ثانیه
                
                // محاسبه آرای اولیه
                let yes = 0, no = 0;
                for (let mp of mps) {
                    const chance = mp.loyalty + Math.floor(Math.random() * 40) - 20;
                    if (chance > 50) yes++;
                    else no++;
                }
                
                activeVotes[voteId] = {
                    bill, yes, no, userId, chatId, msgId,
                    endTime: voteEnd,
                    lobbied: []
                };
                
                let text = `🗳️ *رأی‌گیری: ${bill.name}*\n\n`;
                text += `👍 موافق: ${yes} | 👎 مخالف: ${no} | ⚪ ${30 - yes - no} نفر\n`;
                text += `⏰ ۳۰ ثانیه تا پایان\n\n`;
                text += 'عملیات:';
                
                await bot.editMessageText(text, {
                    chat_id: chatId, message_id: msgId, parse_mode: 'Markdown',
                    reply_markup: {
                        inline_keyboard: [
                            [{ text: '🤝 لابی (۵۰۰ دلار = +۳ رأی)', callback_data: `parl_lobby_${voteId}` }],
                            [{ text: '📊 بروزرسانی', callback_data: `parl_status_${voteId}` }],
                            [{ text: '🔙 برگشت', callback_data: 'menu_parliament' }]
                        ]
                    }
                });
                
                // پایان رأی‌گیری
                setTimeout(async () => {
                    const vote = activeVotes[voteId];
                    if (!vote) return;
                    
                    const total = vote.yes + vote.no;
                    const passed = vote.yes > vote.no;
                    
                    let result;
                    if (passed) {
                        if (vote.bill.effect === 'pop') p.popularity = Math.min(100, p.popularity + vote.bill.value);
                        if (vote.bill.effect === 'money') p.treasury += vote.bill.value;
                        if (vote.bill.effect === 'defense') p.defense += vote.bill.value;
                        result = `✅ *تصویب شد!*\n👍 ${vote.yes} - 👎 ${vote.no}`;
                    } else {
                        result = `❌ *رد شد!*\n👍 ${vote.yes} - 👎 ${vote.no}`;
                    }
                    
                    try {
                        await bot.editMessageText(`🗳️ *نتیجه: ${vote.bill.name}*\n\n${result}`, {
                            chat_id: chatId, message_id: msgId, parse_mode: 'Markdown',
                            reply_markup: { inline_keyboard: [[{ text: '🔙 برگشت', callback_data: 'menu_parliament' }]] }
                        });
                    } catch(e) {}
                    
                    delete activeVotes[voteId];
                }, 30000);
                
                return bot.answerCallbackQuery(query.id);
            }
            
            // لابی‌گری
            if (data.startsWith('parl_lobby_')) {
                const voteId = data.replace('parl_lobby_', '');
                const vote = activeVotes[voteId];
                if (!vote) return bot.answerCallbackQuery(query.id, { text: '❌ رأی‌گیری تموم شده!' });
                if (p.treasury < 500) return bot.answerCallbackQuery(query.id, { text: '❌ ۵۰۰ دلار لازمه!' });
                
                p.treasury -= 500;
                vote.yes += 3;
                
                await bot.answerCallbackQuery(query.id, { text: '🤝 +۳ رأی موافق!', show_alert: true });
                return;
            }
            
            // بروزرسانی وضعیت رأی‌گیری
            if (data.startsWith('parl_status_')) {
                const voteId = data.replace('parl_status_', '');
                const vote = activeVotes[voteId];
                if (!vote) return bot.answerCallbackQuery(query.id, { text: '❌ تموم شده!' });
                
                const remaining = Math.ceil((vote.endTime - Date.now()) / 1000);
                
                let text = `🗳️ *${vote.bill.name}*\n\n`;
                text += `👍 ${vote.yes} | 👎 ${vote.no} | ⚪ ${30 - vote.yes - vote.no}\n`;
                text += `⏰ ${remaining} ثانیه دیگه\n\n`;
                
                await bot.editMessageText(text, {
                    chat_id: chatId, message_id: msgId, parse_mode: 'Markdown',
                    reply_markup: {
                        inline_keyboard: [
                            [{ text: '🤝 لابی (۵۰۰ دلار = +۳ رأی)', callback_data: `parl_lobby_${voteId}` }],
                            [{ text: '📊 بروزرسانی', callback_data: `parl_status_${voteId}` }],
                            [{ text: '🔙 برگشت', callback_data: 'menu_parliament' }]
                        ]
                    }
                });
                return bot.answerCallbackQuery(query.id);
            }
            
            // نمایندگان
            if (data === 'parl_mps') {
                let text = '👥 *نمایندگان مجلس*\n\n';
                let buttons = [];
                
                const factions = { osul: '🔴 اصولگرا', eslah: '🟢 اصلاح‌طلب', mostaghel: '⚪ مستقل', etedal: '🟡 اعتدالگرا', radical: '🟣 رادیکال' };
                
                for (let faction in factions) {
                    const count = mps.filter(m => m.faction === faction).length;
                    text += `${factions[faction]}: ${count} نفر\n`;
                }
                
                buttons.push([{ text: '👥 مشاهده همه', callback_data: 'parl_mps_all' }]);
                buttons.push([{ text: '🔙 برگشت', callback_data: 'menu_parliament' }]);
                
                await bot.editMessageText(text, {
                    chat_id: chatId, message_id: msgId, parse_mode: 'Markdown',
                    reply_markup: { inline_keyboard: buttons }
                });
                return bot.answerCallbackQuery(query.id);
            }
            
            if (data === 'parl_mps_all') {
                let text = '👥 *همه نمایندگان*\n\n';
                let buttons = [];
                
                for (let mp of mps.slice(0, 15)) {
                    const loyaltyEmoji = mp.loyalty > 60 ? '😊' : mp.loyalty > 40 ? '😐' : '😡';
                    text += `${mp.emoji} ${mp.name} - ${loyaltyEmoji} ${mp.loyalty}%\n`;
                    buttons.push([{ text: `${mp.emoji} ${mp.name} (${mp.loyalty}%)`, callback_data: `parl_mp_${mp.id}` }]);
                }
                
                buttons.push([{ text: '⏩ صفحه بعد', callback_data: 'parl_mps_page2' }]);
                buttons.push([{ text: '🔙 برگشت', callback_data: 'menu_parliament' }]);
                
                await bot.editMessageText(text, {
                    chat_id: chatId, message_id: msgId, parse_mode: 'Markdown',
                    reply_markup: { inline_keyboard: buttons }
                });
                return bot.answerCallbackQuery(query.id);
            }
            
            if (data === 'parl_mps_page2') {
                let text = '👥 *نمایندگان (صفحه ۲)*\n\n';
                let buttons = [];
                
                for (let mp of mps.slice(15)) {
                    const loyaltyEmoji = mp.loyalty > 60 ? '😊' : mp.loyalty > 40 ? '😐' : '😡';
                    text += `${mp.emoji} ${mp.name} - ${loyaltyEmoji} ${mp.loyalty}%\n`;
                    buttons.push([{ text: `${mp.emoji} ${mp.name} (${mp.loyalty}%)`, callback_data: `parl_mp_${mp.id}` }]);
                }
                
                buttons.push([{ text: '⏪ صفحه قبل', callback_data: 'parl_mps_all' }]);
                buttons.push([{ text: '🔙 برگشت', callback_data: 'menu_parliament' }]);
                
                await bot.editMessageText(text, {
                    chat_id: chatId, message_id: msgId, parse_mode: 'Markdown',
                    reply_markup: { inline_keyboard: buttons }
                });
                return bot.answerCallbackQuery(query.id);
            }
            
            // جزئیات یه نماینده
            if (data.startsWith('parl_mp_')) {
                const mpId = parseInt(data.replace('parl_mp_', ''));
                const mp = mps.find(m => m.id === mpId);
                if (!mp) return bot.answerCallbackQuery(query.id);
                
                const factions = { osul: 'اصولگرا', eslah: 'اصلاح‌طلب', mostaghel: 'مستقل', etedal: 'اعتدالگرا', radical: 'رادیکال' };
                
                let text = `${mp.emoji} *${mp.name}*\n\n`;
                text += `🏛️ گرایش: ${factions[mp.faction]}\n`;
                text += `💼 سمت: ${mp.role}\n`;
                text += `💕 نظر به تو: ${mp.loyalty}%\n`;
                text += `💰 هزینه لابی: ${mp.cost} دلار\n\n`;
                text += 'عملیات:';
                
                await bot.editMessageText(text, {
                    chat_id: chatId, message_id: msgId, parse_mode: 'Markdown',
                    reply_markup: {
                        inline_keyboard: [
                            [{ text: `🤝 لابی (${mp.cost} دلار = +۲۰ نظر)`, callback_data: `parl_lobby_mp_${mpId}` }],
                            [{ text: '🔙 برگشت', callback_data: 'parl_mps_all' }]
                        ]
                    }
                });
                return bot.answerCallbackQuery(query.id);
            }
            
            if (data.startsWith('parl_lobby_mp_')) {
                const mpId = parseInt(data.replace('parl_lobby_mp_', ''));
                const mp = mps.find(m => m.id === mpId);
                if (!mp) return bot.answerCallbackQuery(query.id);
                if (p.treasury < mp.cost) return bot.answerCallbackQuery(query.id, { text: '❌ پول کافی نداری!', show_alert: true });
                
                p.treasury -= mp.cost;
                mp.loyalty = Math.min(100, mp.loyalty + 20);
                
                await bot.answerCallbackQuery(query.id, { text: `🤝 ${mp.name} +۲۰٪ نظر!`, show_alert: true });
                return;
            }
            
        } catch (e) {
            console.log('Parliament error:', e.message);
            await bot.answerCallbackQuery(query.id, { text: '❌ خطا!', show_alert: true });
        }
    });
}

module.exports = { setupParliament, parliamentMenu };