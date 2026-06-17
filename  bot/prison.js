const player = require('../player');

const activeInterrogations = {};
const prisonEvents = {};

function prisonMenu() {
    return {
        reply_markup: {
            inline_keyboard: [
                [{ text: '👥 زندانیان', callback_data: 'prison_list' }, { text: '🔍 بازجویی', callback_data: 'prison_interrogate' }],
                [{ text: '⚖️ دادگاه', callback_data: 'prison_court' }, { text: '💀 اعدام', callback_data: 'prison_execute_list' }],
                [{ text: '🔓 عفو', callback_data: 'prison_amnesty' }, { text: '🏃 فرار', callback_data: 'prison_escape_check' }],
                [{ text: '📊 آمار زندان', callback_data: 'prison_stats' }, { text: '🔙 برگشت', callback_data: 'menu_main' }]
            ]
        }
    };
}

function setupPrison(bot) {
    
    bot.on('callback_query', async (query) => {
        const chatId = query.message.chat.id;
        const msgId = query.message.message_id;
        const userId = query.from.id;
        const data = query.data;
        
        if (!data.startsWith('prison_') && data !== 'menu_prison') return;
        
        const p = player.getPlayer(userId);
        
        try {
            // منوی زندان
            if (data === 'menu_prison') {
                const notInterrogated = p.prisoners.filter(pr => !pr.interrogated).length;
                const deathRow = p.prisoners.filter(pr => pr.deathSentence).length;
                
                let text = '🔒 *زندان اوین*\n\n';
                text += `👥 کل زندانیان: ${p.prisoners.length}\n`;
                text += `🔍 بازجویی نشده: ${notInterrogated}\n`;
                text += `💀 محکوم به اعدام: ${deathRow}\n`;
                text += `🏃 فرار این ماه: ${prisonEvents[userId]?.escapes || 0}\n\n`;
                text += 'بخش:';
                
                await bot.editMessageText(text, {
                    chat_id: chatId, message_id: msgId, parse_mode: 'Markdown', ...prisonMenu()
                });
                return bot.answerCallbackQuery(query.id);
            }
            
            // لیست زندانیان
            if (data === 'prison_list') {
                if (p.prisoners.length === 0) {
                    await bot.editMessageText('👥 *زندان خالیه!*\n\n✅ هیچ زندانی نداری.', {
                        chat_id: chatId, message_id: msgId, parse_mode: 'Markdown',
                        reply_markup: { inline_keyboard: [[{ text: '➕ دستگیری جدید', callback_data: 'prison_arrest' }, { text: '🔙 برگشت', callback_data: 'menu_prison' }]] }
                    });
                    return bot.answerCallbackQuery(query.id);
                }
                
                let text = '👥 *زندانیان*\n\n';
                let buttons = [];
                
                for (let pr of p.prisoners) {
                    const daysIn = Math.floor((Date.now() - pr.capturedAt) / 86400000);
                    const status = pr.deathSentence ? '💀 اعدام' : pr.interrogated ? '✅ بازجویی شده' : '🔍 بازجویی نشده';
                    
                    text += `${pr.emoji || '👤'} ${pr.name}\n`;
                    text += `   📝 ${pr.reason} | ⏰ ${daysIn} روز\n`;
                    text += `   وضعیت: ${status}\n\n`;
                    
                    buttons.push([{ text: `${pr.name} - ${status}`, callback_data: `prison_select_${pr.id}` }]);
                }
                buttons.push([{ text: '➕ دستگیری جدید', callback_data: 'prison_arrest' }]);
                buttons.push([{ text: '🔙 برگشت', callback_data: 'menu_prison' }]);
                
                await bot.editMessageText(text, {
                    chat_id: chatId, message_id: msgId, parse_mode: 'Markdown',
                    reply_markup: { inline_keyboard: buttons }
                });
                return bot.answerCallbackQuery(query.id);
            }
            
            // انتخاب زندانی
            if (data.startsWith('prison_select_')) {
                const prId = parseInt(data.replace('prison_select_', ''));
                const pr = p.prisoners.find(x => x.id === prId);
                if (!pr) return bot.answerCallbackQuery(query.id);
                
                const daysIn = Math.floor((Date.now() - pr.capturedAt) / 86400000);
                
                let text = `👤 *${pr.name}*\n\n`;
                text += `📝 جرم: ${pr.reason}\n`;
                text += `⏰ مدت زندان: ${daysIn} روز\n`;
                text += `🔍 بازجویی: ${pr.interrogated ? 'شده' : 'نشده'}\n`;
                text += `💀 حکم اعدام: ${pr.deathSentence ? 'داره' : 'نداره'}\n`;
                text += `💪 مقاومت: ${pr.resistance || 50}%\n`;
                text += `🗣️ احتمال اعتراف: ${100 - (pr.resistance || 50)}%\n\n`;
                text += 'عملیات:';
                
                await bot.editMessageText(text, {
                    chat_id: chatId, message_id: msgId, parse_mode: 'Markdown',
                    reply_markup: {
                        inline_keyboard: [
                            [{ text: '🔍 بازجویی', callback_data: `prison_interrogate_${pr.id}` }],
                            [{ text: '⚡ شکنجه (۵۰۰ دلار)', callback_data: `prison_torture_${pr.id}` }],
                            [{ text: '💰 رشوه بگیر (۲۰۰ دلار)', callback_data: `prison_bribe_${pr.id}` }],
                            [{ text: '⚖️ دادگاه', callback_data: `prison_court_${pr.id}` }],
                            [{ text: '💀 اعدام', callback_data: `prison_execute_${pr.id}` }],
                            [{ text: '🔓 آزادی', callback_data: `prison_release_${pr.id}` }],
                            [{ text: '🔙 برگشت', callback_data: 'prison_list' }]
                        ]
                    }
                });
                return bot.answerCallbackQuery(query.id);
            }
            
            // بازجویی ساده
            if (data.startsWith('prison_interrogate_')) {
                const prId = parseInt(data.replace('prison_interrogate_', ''));
                const pr = p.prisoners.find(x => x.id === prId);
                if (!pr) return bot.answerCallbackQuery(query.id);
                if (pr.interrogated) return bot.answerCallbackQuery(query.id, { text: '❌ قبلاً بازجویی شده!' });
                
                const opId = 'interrogate_' + Date.now();
                activeInterrogations[opId] = {
                    prId, userId, chatId, msgId,
                    startTime: Date.now(), endTime: Date.now() + 15000
                };
                
                await bot.editMessageText(
                    `🔍 *بازجویی ${pr.name}*\n\n` +
                    `💪 مقاومت: ${pr.resistance || 50}%\n` +
                    `⏰ ۱۵ ثانیه\n\n⏳ در حال بازجویی...`,
                    { chat_id: chatId, message_id: msgId, parse_mode: 'Markdown',
                      reply_markup: { inline_keyboard: [[{ text: '📊 بروزرسانی', callback_data: `prison_status_${opId}` }]] } }
                );
                
                setTimeout(async () => {
                    const p2 = player.getPlayer(userId);
                    const pr2 = p2.prisoners.find(x => x.id === prId);
                    if (!pr2) return;
                    
                    const chance = 100 - (pr2.resistance || 50);
                    const talked = Math.random() * 100 < chance;
                    
                    pr2.interrogated = true;
                    
                    if (talked) {
                        p2.treasury += 500;
                        try {
                            await bot.editMessageText(`🔍 *اعتراف کرد!*\n🗣️ ${pr2.name} همه چی رو لو داد!\n💰 +۵۰۰ دلار`, {
                                chat_id: chatId, message_id: msgId, parse_mode: 'Markdown',
                                reply_markup: { inline_keyboard: [[{ text: '🔙 برگشت', callback_data: 'prison_list' }]] }
                            });
                        } catch(e) {}
                    } else {
                        try {
                            await bot.editMessageText(`🔍 *چیزی نگفت!*\n💪 ${pr2.name} مقاومت کرد`, {
                                chat_id: chatId, message_id: msgId, parse_mode: 'Markdown',
                                reply_markup: { inline_keyboard: [[{ text: '🔙 برگشت', callback_data: 'prison_list' }]] }
                            });
                        } catch(e) {}
                    }
                    delete activeInterrogations[opId];
                }, 15000);
                
                return bot.answerCallbackQuery(query.id);
            }
            
            // شکنجه
            if (data.startsWith('prison_torture_')) {
                const prId = parseInt(data.replace('prison_torture_', ''));
                const pr = p.prisoners.find(x => x.id === prId);
                if (!pr || p.treasury < 500) return bot.answerCallbackQuery(query.id);
                
                p.treasury -= 500;
                pr.resistance = Math.max(0, (pr.resistance || 50) - 30);
                p.popularity = Math.max(0, p.popularity - 3);
                
                await bot.editMessageText(`⚡ *شکنجه ${pr.name}*\n💪 مقاومت -۳۰٪ (${pr.resistance}%)\n📊 -۳٪ محبوبیت\n💰 -۵۰۰ دلار`, {
                    chat_id: chatId, message_id: msgId, parse_mode: 'Markdown',
                    reply_markup: { inline_keyboard: [[{ text: '🔙 برگشت', callback_data: `prison_select_${pr.id}` }]] }
                });
                return bot.answerCallbackQuery(query.id);
            }
            
            // رشوه
            if (data.startsWith('prison_bribe_')) {
                const prId = parseInt(data.replace('prison_bribe_', ''));
                const pr = p.prisoners.find(x => x.id === prId);
                if (!pr || p.treasury < 200) return bot.answerCallbackQuery(query.id);
                
                p.treasury -= 200;
                pr.resistance = Math.max(0, (pr.resistance || 50) - 10);
                
                await bot.editMessageText(`💰 *رشوه به ${pr.name}*\n💪 مقاومت -۱۰٪ (${pr.resistance}%)\n💰 -۲۰۰ دلار`, {
                    chat_id: chatId, message_id: msgId, parse_mode: 'Markdown',
                    reply_markup: { inline_keyboard: [[{ text: '🔙 برگشت', callback_data: `prison_select_${pr.id}` }]] }
                });
                return bot.answerCallbackQuery(query.id);
            }
            
            // ⚖️ دادگاه
            if (data.startsWith('prison_court_')) {
                const prId = parseInt(data.replace('prison_court_', ''));
                const pr = p.prisoners.find(x => x.id === prId);
                if (!pr) return bot.answerCallbackQuery(query.id);
                
                pr.deathSentence = !pr.deathSentence;
                const status = pr.deathSentence ? '💀 محکوم به اعدام' : '✅ حکم اعدام برداشته شد';
                
                await bot.editMessageText(`⚖️ *دادگاه ${pr.name}*\n${status}`, {
                    chat_id: chatId, message_id: msgId, parse_mode: 'Markdown',
                    reply_markup: { inline_keyboard: [[{ text: '🔙 برگشت', callback_data: `prison_select_${pr.id}` }]] }
                });
                return bot.answerCallbackQuery(query.id);
            }
            
            // اعدام
            if (data.startsWith('prison_execute_')) {
                const prId = parseInt(data.replace('prison_execute_', ''));
                const idx = p.prisoners.findIndex(x => x.id === prId);
                if (idx === -1) return bot.answerCallbackQuery(query.id);
                
                const pr = p.prisoners[idx];
                p.prisoners.splice(idx, 1);
                p.popularity = Math.max(0, p.popularity - 5);
                
                await bot.editMessageText(`💀 *${pr.name} اعدام شد!*\n📊 -۵٪ محبوبیت`, {
                    chat_id: chatId, message_id: msgId, parse_mode: 'Markdown',
                    reply_markup: { inline_keyboard: [[{ text: '🔙 برگشت', callback_data: 'prison_list' }]] }
                });
                return bot.answerCallbackQuery(query.id);
            }
            
            // آزادی
            if (data.startsWith('prison_release_')) {
                const prId = parseInt(data.replace('prison_release_', ''));
                const idx = p.prisoners.findIndex(x => x.id === prId);
                if (idx === -1) return bot.answerCallbackQuery(query.id);
                
                const pr = p.prisoners[idx];
                p.prisoners.splice(idx, 1);
                p.popularity = Math.min(100, p.popularity + 8);
                
                await bot.editMessageText(`🔓 *${pr.name} آزاد شد!*\n📊 +۸٪ محبوبیت`, {
                    chat_id: chatId, message_id: msgId, parse_mode: 'Markdown',
                    reply_markup: { inline_keyboard: [[{ text: '🔙 برگشت', callback_data: 'prison_list' }]] }
                });
                return bot.answerCallbackQuery(query.id);
            }
            
            // عفو عمومی
            if (data === 'prison_amnesty') {
                const count = p.prisoners.length;
                if (count === 0) return bot.answerCallbackQuery(query.id, { text: '❌ زندان خالیه!' });
                
                if (p.treasury < 1000) return bot.answerCallbackQuery(query.id, { text: '❌ ۱۰۰۰ دلار برای عفو لازمه!' });
                p.treasury -= 1000;
                
                p.prisoners = p.prisoners.filter(pr => pr.deathSentence);
                const freed = count - p.prisoners.length;
                p.popularity = Math.min(100, p.popularity + 15);
                
                await bot.editMessageText(`📜 *عفو عمومی!*\n🔓 ${freed} زندانی آزاد شدن\n💀 ${p.prisoners.length} اعدامی موندن\n📊 +۱۵٪ محبوبیت\n💰 -۱۰۰۰ دلار`, {
                    chat_id: chatId, message_id: msgId, parse_mode: 'Markdown',
                    reply_markup: { inline_keyboard: [[{ text: '🔙 برگشت', callback_data: 'menu_prison' }]] }
                });
                return bot.answerCallbackQuery(query.id);
            }
            
            // دستگیری جدید
            if (data === 'prison_arrest') {
                const names = ['جاسوس موساد', 'معترض خیابانی', 'روزنامه‌نگار', 'فعال سیاسی', 'هکر', 'دزد', 'قاتل', 'قاچاقچی'];
                const reasons = ['جاسوسی', 'اعتراض', 'نشر اکاذیب', 'فعالیت سیاسی', 'هک', 'دزدی', 'قتل', 'قاچاق'];
                const emojis = ['🕵️', '🗣️', '📰', '✊', '💻', '💰', '🔪', '📦'];
                
                const idx = Math.floor(Math.random() * names.length);
                player.addPrisoner(userId, names[idx], reasons[idx]);
                
                const pr = p.prisoners[p.prisoners.length - 1];
                pr.emoji = emojis[idx];
                pr.resistance = Math.floor(Math.random() * 60) + 20;
                
                await bot.editMessageText(`➕ *دستگیری جدید!*\n${emojis[idx]} ${names[idx]}\n📝 ${reasons[idx]}\n💪 مقاومت: ${pr.resistance}%`, {
                    chat_id: chatId, message_id: msgId, parse_mode: 'Markdown',
                    reply_markup: { inline_keyboard: [[{ text: '🔙 برگشت', callback_data: 'prison_list' }]] }
                });
                return bot.answerCallbackQuery(query.id);
            }
            
            // فرار
            if (data === 'prison_escape_check') {
                if (p.prisoners.length === 0) return bot.answerCallbackQuery(query.id, { text: '❌ زندان خالیه!' });
                
                const escapeChance = Math.random();
                
                if (escapeChance < 0.15) {
                    const escapeIdx = Math.floor(Math.random() * p.prisoners.length);
                    const escaped = p.prisoners[escapeIdx];
                    p.prisoners.splice(escapeIdx, 1);
                    p.popularity = Math.max(0, p.popularity - 8);
                    
                    if (!prisonEvents[userId]) prisonEvents[userId] = { escapes: 0 };
                    prisonEvents[userId].escapes++;
                    
                    await bot.editMessageText(`🏃 *${escaped.name} فرار کرد!*\n💨 از زندان گریخت!\n📊 -۸٪ محبوبیت\n⚠️ امنیت زندان ضعیفه!`, {
                        chat_id: chatId, message_id: msgId, parse_mode: 'Markdown',
                        reply_markup: { inline_keyboard: [[{ text: '🔐 افزایش امنیت (۱۰۰۰ دلار)', callback_data: 'prison_security_up' }, { text: '🔙 برگشت', callback_data: 'menu_prison' }]] }
                    });
                } else {
                    await bot.editMessageText('🏃 *فراری در کار نیست*\n✅ امنیت برقراره', {
                        chat_id: chatId, message_id: msgId, parse_mode: 'Markdown',
                        reply_markup: { inline_keyboard: [[{ text: '🔙 برگشت', callback_data: 'menu_prison' }]] }
                    });
                }
                return bot.answerCallbackQuery(query.id);
            }
            
            if (data === 'prison_security_up') {
                if (p.treasury < 1000) return bot.answerCallbackQuery(query.id, { text: '❌ ۱۰۰۰ دلار لازمه!' });
                p.treasury -= 1000;
                p.defense += 3;
                
                await bot.editMessageText(`🔐 *امنیت زندان افزایش یافت!*\n🛡️ +۳ دفاع\n💰 -۱۰۰۰ دلار`, {
                    chat_id: chatId, message_id: msgId, parse_mode: 'Markdown',
                    reply_markup: { inline_keyboard: [[{ text: '🔙 برگشت', callback_data: 'menu_prison' }]] }
                });
                return bot.answerCallbackQuery(query.id);
            }
            
            // بروزرسانی بازجویی
            if (data.startsWith('prison_status_')) {
                const opId = data.replace('prison_status_', '');
                const op = activeInterrogations[opId];
                if (!op) return bot.answerCallbackQuery(query.id, { text: '❌ تموم شده!' });
                
                const remaining = Math.ceil((op.endTime - Date.now()) / 1000);
                
                await bot.editMessageText(`🔍 *بازجویی در جریانه...*\n⏰ ${remaining} ثانیه دیگه`, {
                    chat_id: chatId, message_id: msgId, parse_mode: 'Markdown',
                    reply_markup: { inline_keyboard: [[{ text: '📊 بروزرسانی', callback_data: `prison_status_${opId}` }]] }
                });
                return bot.answerCallbackQuery(query.id);
            }
            
            // آمار زندان
            if (data === 'prison_stats') {
                const total = p.prisoners.length;
                const deathRow = p.prisoners.filter(pr => pr.deathSentence).length;
                const notInterrogated = p.prisoners.filter(pr => !pr.interrogated).length;
                const avgResistance = total > 0 ? Math.floor(p.prisoners.reduce((sum, pr) => sum + (pr.resistance || 50), 0) / total) : 0;
                
                let text = '📊 *آمار زندان*\n\n';
                text += `👥 کل: ${total}\n`;
                text += `💀 اعدامی: ${deathRow}\n`;
                text += `🔍 بازجویی نشده: ${notInterrogated}\n`;
                text += `💪 میانگین مقاومت: ${avgResistance}%\n`;
                text += `🏃 فرار: ${prisonEvents[userId]?.escapes || 0}\n`;
                text += `💰 هزینه ماهانه: ${total * 50} دلار\n`;
                
                await bot.editMessageText(text, {
                    chat_id: chatId, message_id: msgId, parse_mode: 'Markdown',
                    reply_markup: { inline_keyboard: [[{ text: '🔙 برگشت', callback_data: 'menu_prison' }]] }
                });
                return bot.answerCallbackQuery(query.id);
            }
            
        } catch (e) {
            console.log('Prison error:', e.message);
            await bot.answerCallbackQuery(query.id, { text: '❌ خطا!', show_alert: true });
        }
    });
}

module.exports = { setupPrison, prisonMenu };