const player = require('../player');

const activeHaremOps = {};
const affairData = {};

function haremMenu() {
    return {
        reply_markup: {
            inline_keyboard: [
                [{ text: '👩‍💼 بانوی اول', callback_data: 'harem_wife' }, { text: '👶 فرزندان', callback_data: 'harem_children' }],
                [{ text: '🤫 معشوقه مخفی', callback_data: 'harem_affair' }, { text: '🕵️ گزارش امنیتی', callback_data: 'harem_intel' }],
                [{ text: '📰 مدیریت رسانه', callback_data: 'harem_media' }, { text: '📊 نظرسنجی', callback_data: 'harem_poll' }],
                [{ text: '🔙 برگشت', callback_data: 'menu_main' }]
            ]
        }
    };
}

function getWife(player) {
    if (!player.wife) {
        player.wife = { name: 'سارا', mood: 80, influence: 30, followers: 2.5 };
    }
    return player.wife;
}

function getAffair(player) {
    if (!affairData[player.userId]) {
        affairData[player.userId] = null;
    }
    return affairData[player.userId];
}

function setupHarem(bot) {
    
    bot.on('callback_query', async (query) => {
        const chatId = query.message.chat.id;
        const msgId = query.message.message_id;
        const userId = query.from.id;
        const data = query.data;
        
        if (!data.startsWith('harem_') && data !== 'menu_harem') return;
        
        const p = player.getPlayer(userId);
        
        try {
            // ============ منوی اصلی ============
            if (data === 'menu_harem') {
                const wife = getWife(p);
                const affair = getAffair(p);
                
                let text = '👔 *کاخ ریاست جمهوری*\n\n';
                text += `👩‍💼 بانوی اول: ${wife.name} | 😊${wife.mood}% | 📊${wife.influence}%\n`;
                text += `👶 فرزندان: ${p.children.length}\n`;
                text += `🤫 معشوقه: ${affair ? affair.name : 'نداری'}\n`;
                text += `📊 محبوبیت: ${p.popularity}%\n\n`;
                text += 'بخش:';
                
                await bot.editMessageText(text, {
                    chat_id: chatId, message_id: msgId, parse_mode: 'Markdown', ...haremMenu()
                });
                return bot.answerCallbackQuery(query.id);
            }
            
            // ============ 👩‍💼 بانوی اول ============
            if (data === 'harem_wife') {
                const wife = getWife(p);
                
                let text = `👩‍💼 *${wife.name} - بانوی اول ایران*\n\n`;
                text += `😊 روحیه: ${wife.mood}%\n`;
                text += `📊 نفوذ سیاسی: ${wife.influence}%\n`;
                text += `👥 فالوور: ${wife.followers}M\n\n`;
                text += '⚠️ اگه نفوذش از ۵۰٪ بیشتر بشه، ممکنه علیه تو توطئه کنه!\n\n';
                text += 'عملیات:';
                
                await bot.editMessageText(text, {
                    chat_id: chatId, message_id: msgId, parse_mode: 'Markdown',
                    reply_markup: {
                        inline_keyboard: [
                            [{ text: '🎁 هدیه بده (۲۰۰ دلار)', callback_data: 'harem_wife_gift' }],
                            [{ text: '🌍 سفر خارجی (۵۰۰ دلار)', callback_data: 'harem_wife_trip' }],
                            [{ text: '📱 پست مشترک', callback_data: 'harem_wife_post' }],
                            [{ text: '💔 درخواست طلاق', callback_data: 'harem_wife_divorce' }],
                            [{ text: '🔙 برگشت', callback_data: 'menu_harem' }]
                        ]
                    }
                });
                return bot.answerCallbackQuery(query.id);
            }
            
            if (data === 'harem_wife_gift') {
                if (p.treasury < 200) return bot.answerCallbackQuery(query.id, { text: '❌ ۲۰۰ دلار لازمه!' });
                p.treasury -= 200;
                const wife = getWife(p);
                wife.mood = Math.min(100, wife.mood + 15);
                wife.influence = Math.min(100, wife.influence + 5);
                
                await bot.editMessageText(`🎁 *هدیه داده شد!*\n😊 +۱۵٪ روحیه\n📊 +۵٪ نفوذ\n💰 -۲۰۰ دلار`, {
                    chat_id: chatId, message_id: msgId, parse_mode: 'Markdown',
                    reply_markup: { inline_keyboard: [[{ text: '🔙 برگشت', callback_data: 'harem_wife' }]] }
                });
                return bot.answerCallbackQuery(query.id);
            }
            
            if (data === 'harem_wife_trip') {
                if (p.treasury < 500) return bot.answerCallbackQuery(query.id, { text: '❌ ۵۰۰ دلار لازمه!' });
                p.treasury -= 500;
                const wife = getWife(p);
                wife.mood = Math.min(100, wife.mood + 25);
                wife.influence = Math.min(100, wife.influence + 10);
                wife.followers += 0.5;
                
                await bot.editMessageText(`🌍 *سفر خارجی موفق!*\n😊 +۲۵٪ روحیه\n📊 +۱۰٪ نفوذ\n👥 +۰.۵M فالوور\n💰 -۵۰۰ دلار`, {
                    chat_id: chatId, message_id: msgId, parse_mode: 'Markdown',
                    reply_markup: { inline_keyboard: [[{ text: '🔙 برگشت', callback_data: 'harem_wife' }]] }
                });
                return bot.answerCallbackQuery(query.id);
            }
            
            if (data === 'harem_wife_divorce') {
                await bot.editMessageText(
                    '💔 *درخواست طلاق*\n\n' +
                    '⚠️ *عواقب:*\n' +
                    '💰 مهریه: ۵۰۰,۰۰۰ دلار\n' +
                    '📊 محبوبیت: -۳۰٪\n' +
                    '👥 فالوور: نصف میشه\n\n' +
                    'مطمئنی؟',
                    { chat_id: chatId, message_id: msgId, parse_mode: 'Markdown',
                      reply_markup: {
                          inline_keyboard: [
                              [{ text: '💔 طلاق بده (۵۰۰K دلار)', callback_data: 'harem_wife_divorce_yes' }],
                              [{ text: '🤝 منصرف شدم', callback_data: 'harem_wife' }]
                          ]
                      }
                    }
                );
                return bot.answerCallbackQuery(query.id);
            }
            
            if (data === 'harem_wife_divorce_yes') {
                if (p.treasury < 500000) return bot.answerCallbackQuery(query.id, { text: '❌ ۵۰۰,۰۰۰ دلار لازمه!' });
                p.treasury -= 500000;
                p.wife = { name: 'نداری', mood: 0, influence: 0, followers: 0 };
                p.popularity = Math.max(0, p.popularity - 30);
                
                await bot.editMessageText('💔 *طلاق انجام شد!*\n💰 -۵۰۰,۰۰۰ دلار\n📊 -۳۰٪ محبوبیت\n💔 بانوی اول از دست رفت!', {
                    chat_id: chatId, message_id: msgId, parse_mode: 'Markdown',
                    reply_markup: { inline_keyboard: [[{ text: '🔙 برگشت', callback_data: 'menu_harem' }]] }
                });
                return bot.answerCallbackQuery(query.id);
            }
            
            // ============ 👶 فرزندان ============
            if (data === 'harem_children') {
                if (p.children.length === 0) {
                    await bot.editMessageText('👶 *فرزندان*\n\n❌ فرزندی نداری!', {
                        chat_id: chatId, message_id: msgId, parse_mode: 'Markdown',
                        reply_markup: { inline_keyboard: [[{ text: '🔙 برگشت', callback_data: 'menu_harem' }]] }
                    });
                    return bot.answerCallbackQuery(query.id);
                }
                
                let text = '👶 *فرزندان*\n\n';
                let buttons = [];
                for (let c of p.children) {
                    text += `${c.name} (${c.age || 0} ساله)\n`;
                    text += `📚 تحصیل: ${c.education || 0}٪ | ⚔️ نظامی: ${c.military || 0}٪\n`;
                    text += `💕 وفاداری: ${c.loyalty || 50}٪\n\n`;
                    buttons.push([{ text: `${c.name}`, callback_data: `harem_child_${c.id}` }]);
                }
                buttons.push([{ text: '🔙 برگشت', callback_data: 'menu_harem' }]);
                
                await bot.editMessageText(text, {
                    chat_id: chatId, message_id: msgId, parse_mode: 'Markdown',
                    reply_markup: { inline_keyboard: buttons }
                });
                return bot.answerCallbackQuery(query.id);
            }
            
            if (data.startsWith('harem_child_')) {
                const childId = parseInt(data.replace('harem_child_', ''));
                const child = p.children.find(c => c.id === childId);
                if (!child) return bot.answerCallbackQuery(query.id);
                
                let text = `👶 *${child.name}*\n\n`;
                text += `🎂 سن: ${child.age || 0}\n`;
                text += `📚 تحصیل: ${child.education || 0}٪\n`;
                text += `⚔️ نظامی: ${child.military || 0}٪\n`;
                text += `💕 وفاداری: ${child.loyalty || 50}٪\n`;
                text += `⚡ جاه‌طلبی: ${child.ambition || 30}٪\n\n`;
                
                if (child.ambition > child.loyalty) {
                    text += '⚠️ *هشدار!* جاه‌طلبی از وفاداری بیشتره! ممکنه کودتا کنه!\n\n';
                }
                
                await bot.editMessageText(text, {
                    chat_id: chatId, message_id: msgId, parse_mode: 'Markdown',
                    reply_markup: {
                        inline_keyboard: [
                            [{ text: '📚 تحصیل (۲۰۰ دلار)', callback_data: `harem_child_edu_${childId}` }],
                            [{ text: '⚔️ آموزش نظامی (۵۰۰ دلار)', callback_data: `harem_child_mil_${childId}` }],
                            [{ text: '💕 وقت گذروندن', callback_data: `harem_child_time_${childId}` }],
                            [{ text: '👔 منصوب کن', callback_data: `harem_child_assign_${childId}` }],
                            [{ text: '🔙 برگشت', callback_data: 'harem_children' }]
                        ]
                    }
                });
                return bot.answerCallbackQuery(query.id);
            }
            
            if (data.startsWith('harem_child_edu_')) {
                const childId = parseInt(data.replace('harem_child_edu_', ''));
                const child = p.children.find(c => c.id === childId);
                if (!child || p.treasury < 200) return bot.answerCallbackQuery(query.id);
                p.treasury -= 200;
                child.education = Math.min(100, (child.education || 0) + 15);
                child.loyalty = Math.min(100, (child.loyalty || 50) + 5);
                await bot.answerCallbackQuery(query.id, { text: '✅ تحصیل +۱۵٪', show_alert: true });
                return;
            }
            
            if (data.startsWith('harem_child_mil_')) {
                const childId = parseInt(data.replace('harem_child_mil_', ''));
                const child = p.children.find(c => c.id === childId);
                if (!child || p.treasury < 500) return bot.answerCallbackQuery(query.id);
                p.treasury -= 500;
                child.military = Math.min(100, (child.military || 0) + 15);
                child.ambition = Math.min(100, (child.ambition || 30) + 10);
                await bot.answerCallbackQuery(query.id, { text: '✅ نظامی +۱۵٪ | ⚠️ جاه‌طلبی +۱۰٪', show_alert: true });
                return;
            }
            
            if (data.startsWith('harem_child_time_')) {
                const childId = parseInt(data.replace('harem_child_time_', ''));
                const child = p.children.find(c => c.id === childId);
                if (!child) return bot.answerCallbackQuery(query.id);
                child.loyalty = Math.min(100, (child.loyalty || 50) + 10);
                child.ambition = Math.max(0, (child.ambition || 30) - 5);
                await bot.answerCallbackQuery(query.id, { text: '💕 وفاداری +۱۰٪ | جاه‌طلبی -۵٪', show_alert: true });
                return;
            }
            
            // ============ 🤫 معشوقه مخفی ============
            if (data === 'harem_affair') {
                const affair = getAffair(p);
                
                if (!affair) {
                    await bot.editMessageText(
                        '🤫 *معشوقه مخفی*\n\n❌ معشوقه نداری!\n💰 هزینه: ۱۰۰۰ دلار\n⚠️ ریسک لو رفتن!',
                        { chat_id: chatId, message_id: msgId, parse_mode: 'Markdown',
                          reply_markup: {
                              inline_keyboard: [
                                  [{ text: '💕 پیدا کردن معشوقه (۱۰۰۰ دلار)', callback_data: 'harem_affair_new' }],
                                  [{ text: '🔙 برگشت', callback_data: 'menu_harem' }]
                              ]
                          }
                        }
                    );
                    return bot.answerCallbackQuery(query.id);
                }
                
                let text = `🤫 *${affair.name} - معشوقه مخفی*\n\n`;
                text += `💕 علاقه: ${affair.love}%\n`;
                text += `🕵️ خطر لو رفتن: ${affair.risk}%\n`;
                text += `💰 هزینه ماهانه: ۱۰۰۰ دلار\n\n`;
                text += '⚠️ اگه لو بره: طلاق + رسوایی!\n\nعملیات:';
                
                await bot.editMessageText(text, {
                    chat_id: chatId, message_id: msgId, parse_mode: 'Markdown',
                    reply_markup: {
                        inline_keyboard: [
                            [{ text: '💕 ملاقات (۵۰۰ دلار)', callback_data: 'harem_affair_meet' }],
                            [{ text: '🎁 هدیه (۳۰۰ دلار)', callback_data: 'harem_affair_gift' }],
                            [{ text: '💰 پول خرج کن (۱۰۰۰ دلار)', callback_data: 'harem_affair_money' }],
                            [{ text: '🚫 تمومش کن', callback_data: 'harem_affair_end' }],
                            [{ text: '🔙 برگشت', callback_data: 'menu_harem' }]
                        ]
                    }
                });
                return bot.answerCallbackQuery(query.id);
            }
            
            if (data === 'harem_affair_new') {
                if (p.treasury < 1000) return bot.answerCallbackQuery(query.id, { text: '❌ ۱۰۰۰ دلار لازمه!' });
                p.treasury -= 1000;
                
                const names = ['الناز', 'نگار', 'شیرین', 'مریم'];
                affairData[userId] = {
                    name: names[Math.floor(Math.random() * 4)],
                    love: 70,
                    risk: 20,
                    startedAt: Date.now()
                };
                
                await bot.editMessageText(`💕 *معشوقه جدید!*\n👩 ${affairData[userId].name}\n💰 -۱۰۰۰ دلار\n⚠️ خطر لو رفتن: ۲۰٪`, {
                    chat_id: chatId, message_id: msgId, parse_mode: 'Markdown',
                    reply_markup: { inline_keyboard: [[{ text: '🔙 برگشت', callback_data: 'harem_affair' }]] }
                });
                return bot.answerCallbackQuery(query.id);
            }
            
            if (data === 'harem_affair_meet') {
                if (p.treasury < 500) return bot.answerCallbackQuery(query.id);
                p.treasury -= 500;
                const affair = getAffair(p);
                if (affair) { affair.love = Math.min(100, affair.love + 15); affair.risk += 5; }
                await bot.editMessageText(`💕 *ملاقات*\n😍 +۱۵٪ علاقه\n⚠️ +۵٪ خطر لو رفتن\n💰 -۵۰۰ دلار`, {
                    chat_id: chatId, message_id: msgId, parse_mode: 'Markdown',
                    reply_markup: { inline_keyboard: [[{ text: '🔙 برگشت', callback_data: 'harem_affair' }]] }
                });
                return bot.answerCallbackQuery(query.id);
            }
            
            if (data === 'harem_affair_end') {
                affairData[userId] = null;
                await bot.editMessageText('🚫 *تموم شد!*\nمعشوقه از زندگیت خارج شد.', {
                    chat_id: chatId, message_id: msgId, parse_mode: 'Markdown',
                    reply_markup: { inline_keyboard: [[{ text: '🔙 برگشت', callback_data: 'menu_harem' }]] }
                });
                return bot.answerCallbackQuery(query.id);
            }
            
            // ============ 📰 مدیریت رسانه ============
            if (data === 'harem_media') {
                await bot.editMessageText(
                    '📰 *مدیریت رسانه*\n\n' +
                    `📊 محبوبیت: ${p.popularity}%\n\n` +
                    'عملیات:',
                    { chat_id: chatId, message_id: msgId, parse_mode: 'Markdown',
                      reply_markup: {
                          inline_keyboard: [
                              [{ text: '📰 تکذیب شایعه (۵۰۰ دلار)', callback_data: 'harem_media_deny' }],
                              [{ text: '🤫 سانسور خبر (۲۰۰۰ دلار)', callback_data: 'harem_media_censor' }],
                              [{ text: '📱 توئیت شخصی (۱۰۰ دلار)', callback_data: 'harem_media_tweet' }],
                              [{ text: '🎙️ مصاحبه تلویزیونی (۱۰۰۰ دلار)', callback_data: 'harem_media_interview' }],
                              [{ text: '🔙 برگشت', callback_data: 'menu_harem' }]
                          ]
                      }
                    }
                );
                return bot.answerCallbackQuery(query.id);
            }
            
            if (data === 'harem_media_deny') {
                if (p.treasury < 500) return bot.answerCallbackQuery(query.id);
                p.treasury -= 500;
                p.popularity = Math.min(100, p.popularity + 5);
                await bot.editMessageText(`📰 *تکذیب شد!*\n📊 +۵٪ محبوبیت\n💰 -۵۰۰ دلار`, {
                    chat_id: chatId, message_id: msgId, parse_mode: 'Markdown',
                    reply_markup: { inline_keyboard: [[{ text: '🔙 برگشت', callback_data: 'harem_media' }]] }
                });
                return bot.answerCallbackQuery(query.id);
            }
            
            if (data === 'harem_media_censor') {
                if (p.treasury < 2000) return bot.answerCallbackQuery(query.id);
                p.treasury -= 2000;
                p.popularity = Math.min(100, p.popularity + 10);
                await bot.editMessageText(`🤫 *سانسور شد!*\n📊 +۱۰٪ محبوبیت\n💰 -۲۰۰۰ دلار`, {
                    chat_id: chatId, message_id: msgId, parse_mode: 'Markdown',
                    reply_markup: { inline_keyboard: [[{ text: '🔙 برگشت', callback_data: 'harem_media' }]] }
                });
                return bot.answerCallbackQuery(query.id);
            }
            
            if (data === 'harem_media_tweet') {
                if (p.treasury < 100) return bot.answerCallbackQuery(query.id);
                p.treasury -= 100;
                p.popularity = Math.min(100, p.popularity + 2);
                await bot.editMessageText(`📱 *توئیت زده شد!*\n📊 +۲٪ محبوبیت\n💰 -۱۰۰ دلار`, {
                    chat_id: chatId, message_id: msgId, parse_mode: 'Markdown',
                    reply_markup: { inline_keyboard: [[{ text: '🔙 برگشت', callback_data: 'harem_media' }]] }
                });
                return bot.answerCallbackQuery(query.id);
            }
            
            if (data === 'harem_media_interview') {
                if (p.treasury < 1000) return bot.answerCallbackQuery(query.id);
                p.treasury -= 1000;
                p.popularity = Math.min(100, p.popularity + 8);
                await bot.editMessageText(`🎙️ *مصاحبه موفق!*\n📊 +۸٪ محبوبیت\n💰 -۱۰۰۰ دلار`, {
                    chat_id: chatId, message_id: msgId, parse_mode: 'Markdown',
                    reply_markup: { inline_keyboard: [[{ text: '🔙 برگشت', callback_data: 'harem_media' }]] }
                });
                return bot.answerCallbackQuery(query.id);
            }
            
            // ============ 📊 نظرسنجی ============
            if (data === 'harem_poll') {
                const wife = getWife(p);
                let text = '📊 *نظرسنجی عمومی*\n\n';
                text += `😊 رضایت: ${p.popularity}%\n`;
                text += `👩‍💼 بانوی اول: ${wife.name} | 👥 ${wife.followers}M\n`;
                text += `💰 خزانه: ${p.treasury.toLocaleString()} دلار\n`;
                text += `⚔️ قدرت نظامی: ${player.getTotalPower(userId)}\n`;
                text += `🌍 متحدان: ${p.alliances.length}\n`;
                text += `🗺️ فتوحات: ${p.conquered.length}\n\n`;
                text += '📊 *پیش‌بینی انتخابات:*\n';
                text += `شانس پیروزی: ${p.popularity}%`;
                
                await bot.editMessageText(text, {
                    chat_id: chatId, message_id: msgId, parse_mode: 'Markdown',
                    reply_markup: { inline_keyboard: [[{ text: '🔙 برگشت', callback_data: 'menu_harem' }]] }
                });
                return bot.answerCallbackQuery(query.id);
            }
            
        } catch (e) {
            console.log('Harem error:', e.message);
            await bot.answerCallbackQuery(query.id, { text: '❌ خطا!', show_alert: true });
        }
    });
}

module.exports = { setupHarem, haremMenu };