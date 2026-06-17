const config = require('../config');
const player = require('../player');

const activeSpies = {};
const activeMissions = {};

function spyMenu() {
    return {
        reply_markup: {
            inline_keyboard: [
                [{ text: '🕵️ جاسوس بفرست', callback_data: 'spy_send' }, { text: '📋 مأموریت‌ها', callback_data: 'spy_missions' }],
                [{ text: '🔍 کشف جاسوس', callback_data: 'spy_find' }, { text: '💀 ترور', callback_data: 'spy_assassinate' }],
                [{ text: '💻 جنگ سایبری', callback_data: 'spy_cyber' }, { text: '🔐 امنیت', callback_data: 'spy_security' }],
                [{ text: '📊 گزارش', callback_data: 'spy_report' }, { text: '🔙 برگشت', callback_data: 'menu_main' }]
            ]
        }
    };
}

function setupSpy(bot) {
    
    bot.on('callback_query', async (query) => {
        const chatId = query.message.chat.id;
        const msgId = query.message.message_id;
        const userId = query.from.id;
        const data = query.data;
        
        if (!data.startsWith('spy_') && data !== 'menu_spy') return;
        
        const p = player.getPlayer(userId);
        
        try {
            // منوی جاسوسی
            if (data === 'menu_spy') {
                const activeCount = Object.values(activeSpies).filter(s => s.userId === userId).length;
                const missionCount = Object.values(activeMissions).filter(m => m.userId === userId).length;
                
                let text = '🕵️ *سازمان جاسوسی*\n\n';
                text += `🕵️ جاسوس‌های فعال: ${activeCount}\n`;
                text += `📋 مأموریت‌ها: ${missionCount}\n`;
                text += `🔐 امنیت: ${p.defense}%\n\n`;
                text += 'بخش:';
                
                await bot.editMessageText(text, {
                    chat_id: chatId, message_id: msgId, parse_mode: 'Markdown', ...spyMenu()
                });
                return bot.answerCallbackQuery(query.id);
            }
            
            // فرستادن جاسوس
            if (data === 'spy_send') {
                let text = '🕵️ *انواع جاسوس*\n\n';
                
                await bot.editMessageText(text, {
                    chat_id: chatId, message_id: msgId, parse_mode: 'Markdown',
                    reply_markup: {
                        inline_keyboard: [
                            [{ text: '🟢 تازه‌کار (۲۰۰ دلار - ۱۰دقیقه - ۴۰٪)', callback_data: 'spy_type_rookie' }],
                            [{ text: '🟡 حرفه‌ای (۱۰۰۰ دلار - ۳۰دقیقه - ۶۰٪)', callback_data: 'spy_type_pro' }],
                            [{ text: '🔴 خبره (۵۰۰۰ دلار - ۱ساعت - ۸۰٪)', callback_data: 'spy_type_expert' }],
                            [{ text: '🤖 ربات (۱۰۰۰۰ دلار - ۳۰دقیقه - ۹۵٪)', callback_data: 'spy_type_robot' }],
                            [{ text: '🔙 برگشت', callback_data: 'menu_spy' }]
                        ]
                    }
                });
                return bot.answerCallbackQuery(query.id);
            }
            
            if (data.startsWith('spy_type_')) {
                const type = data.replace('spy_type_', '');
                const types = {
                    rookie: { name: 'تازه‌کار', cost: 200, chance: 0.4, time: 600000, emoji: '🟢' },
                    pro: { name: 'حرفه‌ای', cost: 1000, chance: 0.6, time: 1800000, emoji: '🟡' },
                    expert: { name: 'خبره', cost: 5000, chance: 0.8, time: 3600000, emoji: '🔴' },
                    robot: { name: 'ربات', cost: 10000, chance: 0.95, time: 1800000, emoji: '🤖' }
                };
                
                const spyType = types[type];
                if (!spyType) return bot.answerCallbackQuery(query.id);
                if (p.treasury < spyType.cost) return bot.answerCallbackQuery(query.id, { text: '❌ پول کافی نداری!' });
                
                // انتخاب کشور
                let buttons = [];
                let row = [];
                for (let key in config.countries) {
                    row.push({ text: config.countries[key].emoji, callback_data: `spy_target_${type}_${key}` });
                    if (row.length === 5) { buttons.push(row); row = []; }
                }
                if (row.length > 0) buttons.push(row);
                buttons.push([{ text: '🔙 برگشت', callback_data: 'spy_send' }]);
                
                await bot.editMessageText(`🕵️ *${spyType.emoji} ${spyType.name}*\n💰 ${spyType.cost} دلار\n\n🎯 کشور هدف رو انتخاب کن:`, {
                    chat_id: chatId, message_id: msgId, parse_mode: 'Markdown',
                    reply_markup: { inline_keyboard: buttons }
                });
                return bot.answerCallbackQuery(query.id);
            }
            
            if (data.startsWith('spy_target_')) {
                const parts = data.split('_');
                const type = parts[2];
                const countryKey = parts.slice(3).join('_');
                const c = config.countries[countryKey];
                
                const types = {
                    rookie: { name: 'تازه‌کار', cost: 200, chance: 0.4, time: 600000, emoji: '🟢' },
                    pro: { name: 'حرفه‌ای', cost: 1000, chance: 0.6, time: 1800000, emoji: '🟡' },
                    expert: { name: 'خبره', cost: 5000, chance: 0.8, time: 3600000, emoji: '🔴' },
                    robot: { name: 'ربات', cost: 10000, chance: 0.95, time: 1800000, emoji: '🤖' }
                };
                
                const spyType = types[type];
                if (!spyType || !c) return bot.answerCallbackQuery(query.id);
                if (p.treasury < spyType.cost) return bot.answerCallbackQuery(query.id, { text: '❌ پول کافی نداری!' });
                
                p.treasury -= spyType.cost;
                
                const spyId = 'spy_' + Date.now();
                const timeStr = spyType.time < 3600000 ? `${Math.floor(spyType.time/60000)} دقیقه` : `${Math.floor(spyType.time/3600000)} ساعت`;
                
                activeSpies[spyId] = {
                    userId, chatId, msgId, countryKey, type,
                    startTime: Date.now(),
                    endTime: Date.now() + spyType.time,
                    chance: spyType.chance,
                    name: spyType.name,
                    emoji: spyType.emoji,
                    cost: spyType.cost
                };
                
                await bot.editMessageText(
                    `🕵️ *${spyType.emoji} جاسوس ${spyType.name}*\n\n` +
                    `🎯 ${c.emoji} ${c.name}\n` +
                    `💰 هزینه: ${spyType.cost} دلار\n` +
                    `⏰ زمان: ${timeStr}\n` +
                    `🎲 شانس: ${Math.floor(spyType.chance * 100)}%\n\n` +
                    '⏳ جاسوس در راهه...',
                    { chat_id: chatId, message_id: msgId, parse_mode: 'Markdown',
                      reply_markup: { inline_keyboard: [[{ text: '📊 بروزرسانی', callback_data: `spy_status_${spyId}` }], [{ text: '🔙 برگشت', callback_data: 'menu_spy' }]] } }
                );
                
                // نتیجه جاسوسی
                setTimeout(async () => {
                    const spy = activeSpies[spyId];
                    if (!spy) return;
                    
                    const p2 = player.getPlayer(userId);
                    const success = Math.random() < spy.chance;
                    
                    if (success) {
                        const c2 = config.countries[spy.countryKey];
                        p2.treasury += Math.floor(c2.gold * 0.1);
                        p2.spies.push({ target: spy.countryKey, info: `قدرت: ${c2.power}, نفت: ${c2.oil}, طلا: ${c2.gold}` });
                        
                        try {
                            await bot.editMessageText(
                                `🕵️ *جاسوسی موفق!*\n\n${c2.emoji} ${c2.name}\n` +
                                `📋 اطلاعات:\n⚡ قدرت: ${c2.power}\n🛢️ نفت: ${c2.oil}\n🪙 طلا: ${c2.gold}\n💰 +${Math.floor(c2.gold * 0.1)} دلار`,
                                { chat_id: chatId, message_id: msgId, parse_mode: 'Markdown',
                                  reply_markup: { inline_keyboard: [[{ text: '🔙 برگشت', callback_data: 'menu_spy' }]] } }
                            );
                        } catch(e) {}
                    } else {
                        try {
                            await bot.editMessageText(
                                `🚨 *جاسوس لو رفت!*\n\n${config.countries[spy.countryKey].emoji} ${config.countries[spy.countryKey].name}\n💀 جاسوس اعدام شد!\n📊 -۵٪ محبوبیت`,
                                { chat_id: chatId, message_id: msgId, parse_mode: 'Markdown',
                                  reply_markup: { inline_keyboard: [[{ text: '🔙 برگشت', callback_data: 'menu_spy' }]] } }
                            );
                        } catch(e) {}
                        p2.popularity = Math.max(0, p2.popularity - 5);
                    }
                    
                    delete activeSpies[spyId];
                }, spyType.time);
                
                return bot.answerCallbackQuery(query.id);
            }
            
            // بروزرسانی وضعیت جاسوس
            if (data.startsWith('spy_status_')) {
                const spyId = data.replace('spy_status_', '');
                const spy = activeSpies[spyId];
                if (!spy) return bot.answerCallbackQuery(query.id, { text: '❌ مأموریت تموم شده!' });
                
                const remaining = Math.max(0, spy.endTime - Date.now());
                const elapsed = Date.now() - spy.startTime;
                const percent = Math.min(100, Math.floor((elapsed / (spy.endTime - spy.startTime)) * 100));
                const timeLeft = remaining < 3600000 ? `${Math.floor(remaining/60000)} دقیقه` : `${Math.floor(remaining/3600000)} ساعت`;
                
                let bar = '';
                for (let i = 0; i < 10; i++) bar += i < Math.floor(percent/10) ? '█' : '░';
                
                await bot.editMessageText(
                    `🕵️ *جاسوس در مأموریت*\n\n${bar} ${percent}٪\n⏰ ${timeLeft} دیگه\n🎯 ${config.countries[spy.countryKey].emoji} ${config.countries[spy.countryKey].name}`,
                    { chat_id: chatId, message_id: msgId, parse_mode: 'Markdown',
                      reply_markup: { inline_keyboard: [[{ text: '📊 بروزرسانی', callback_data: `spy_status_${spyId}` }], [{ text: '🔙 برگشت', callback_data: 'menu_spy' }]] } }
                );
                return bot.answerCallbackQuery(query.id);
            }
            
            // 💀 ترور
            if (data === 'spy_assassinate') {
                let buttons = [];
                let row = [];
                for (let key in config.countries) {
                    row.push({ text: config.countries[key].emoji, callback_data: `spy_kill_${key}` });
                    if (row.length === 5) { buttons.push(row); row = []; }
                }
                if (row.length > 0) buttons.push(row);
                buttons.push([{ text: '🔙 برگشت', callback_data: 'menu_spy' }]);
                
                await bot.editMessageText('💀 *ترور رهبر*\n\n💰 هزینه: ۲۰۰۰۰ دلار\n🎲 شانس: ۵۰٪\n⏰ ۱ ساعت\n\n🎯 کشور هدف:', {
                    chat_id: chatId, message_id: msgId, parse_mode: 'Markdown',
                    reply_markup: { inline_keyboard: buttons }
                });
                return bot.answerCallbackQuery(query.id);
            }
            
            if (data.startsWith('spy_kill_')) {
                const key = data.replace('spy_kill_', '');
                const c = config.countries[key];
                
                if (p.treasury < 20000) return bot.answerCallbackQuery(query.id, { text: '❌ ۲۰۰۰۰ دلار لازمه!' });
                p.treasury -= 20000;
                
                const opId = 'kill_' + Date.now();
                activeMissions[opId] = {
                    type: 'assassinate', userId, chatId, msgId, countryKey: key,
                    startTime: Date.now(), endTime: Date.now() + 3600000
                };
                
                await bot.editMessageText(
                    `💀 *ترور ${c.emoji} ${c.name}*\n\n` +
                    '💰 ۲۰۰۰۰ دلار\n⏰ ۱ ساعت\n🎲 ۵۰٪\n\n⏳ عملیات شروع شد...',
                    { chat_id: chatId, message_id: msgId, parse_mode: 'Markdown',
                      reply_markup: { inline_keyboard: [[{ text: '📊 بروزرسانی', callback_data: `spy_mission_${opId}` }], [{ text: '🔙 برگشت', callback_data: 'menu_spy' }]] } }
                );
                
                setTimeout(async () => {
                    const success = Math.random() < 0.5;
                    const p2 = player.getPlayer(userId);
                    
                    if (success) {
                        p2.popularity = Math.min(100, p2.popularity + 20);
                        p2.treasury += 10000;
                        try {
                            await bot.editMessageText(`💀 *ترور موفق!*\n🎉 ${c.emoji} ${c.name}\n📊 +۲۰٪ محبوبیت\n💰 +۱۰۰۰۰ دلار`, {
                                chat_id: chatId, message_id: msgId, parse_mode: 'Markdown',
                                reply_markup: { inline_keyboard: [[{ text: '🔙 برگشت', callback_data: 'menu_spy' }]] }
                            });
                        } catch(e) {}
                    } else {
                        p2.popularity = Math.max(0, p2.popularity - 30);
                        try {
                            await bot.editMessageText(`💀 *ترور ناموفق!*\n🚨 لو رفت!\n📊 -۳۰٪ محبوبیت\n⚔️ ${c.name} اعلام جنگ کرد!`, {
                                chat_id: chatId, message_id: msgId, parse_mode: 'Markdown',
                                reply_markup: { inline_keyboard: [[{ text: '🔙 برگشت', callback_data: 'menu_spy' }]] }
                            });
                        } catch(e) {}
                        p2.wars.push({ country: key, startedAt: Date.now(), status: 'active' });
                    }
                    
                    delete activeMissions[opId];
                }, 3600000);
                
                return bot.answerCallbackQuery(query.id);
            }
            
            // 💻 جنگ سایبری
            if (data === 'spy_cyber') {
                await bot.editMessageText(
                    '💻 *جنگ سایبری*\n\n' +
                    '💰 هزینه: ۸۰۰۰ دلار\n⏰ ۳۰ دقیقه\n🎲 ۶۵٪\n\n' +
                    'هدف: فلج کردن سیستم بانکی دشمن',
                    { chat_id: chatId, message_id: msgId, parse_mode: 'Markdown',
                      reply_markup: {
                          inline_keyboard: [
                              [{ text: '🇺🇸 آمریکا', callback_data: 'spy_cyber_usa' }],
                              [{ text: '🇮🇱 اسرائیل', callback_data: 'spy_cyber_israel' }],
                              [{ text: '🇸🇦 عربستان', callback_data: 'spy_cyber_saudi' }],
                              [{ text: '🔙 برگشت', callback_data: 'menu_spy' }]
                          ]
                      }
                    }
                );
                return bot.answerCallbackQuery(query.id);
            }
            
            if (data.startsWith('spy_cyber_')) {
                const key = data.replace('spy_cyber_', '');
                const c = config.countries[key];
                if (!c) return bot.answerCallbackQuery(query.id);
                if (p.treasury < 8000) return bot.answerCallbackQuery(query.id, { text: '❌ ۸۰۰۰ دلار لازمه!' });
                
                p.treasury -= 8000;
                
                const opId = 'cyber_' + Date.now();
                activeMissions[opId] = {
                    type: 'cyber', userId, chatId, msgId, countryKey: key,
                    startTime: Date.now(), endTime: Date.now() + 1800000
                };
                
                await bot.editMessageText(`💻 *حمله سایبری به ${c.emoji} ${c.name}*\n\n⏰ ۳۰ دقیقه\n🎲 ۶۵٪\n\n⏳ در حال هک...`, {
                    chat_id: chatId, message_id: msgId, parse_mode: 'Markdown',
                    reply_markup: { inline_keyboard: [[{ text: '📊 بروزرسانی', callback_data: `spy_mission_${opId}` }], [{ text: '🔙 برگشت', callback_data: 'menu_spy' }]] }
                });
                
                setTimeout(async () => {
                    const success = Math.random() < 0.65;
                    const p2 = player.getPlayer(userId);
                    
                    if (success) {
                        p2.treasury += 20000;
                        try {
                            await bot.editMessageText(`💻 *هک موفق!*\n🔓 اطلاعات بانکی ${c.name}\n💰 +۲۰۰۰۰ دلار`, {
                                chat_id: chatId, message_id: msgId, parse_mode: 'Markdown',
                                reply_markup: { inline_keyboard: [[{ text: '🔙 برگشت', callback_data: 'menu_spy' }]] }
                            });
                        } catch(e) {}
                    } else {
                        p2.popularity = Math.max(0, p2.popularity - 10);
                        try {
                            await bot.editMessageText(`💻 *هک ناموفق!*\n🚨 لو رفت!\n📊 -۱۰٪`, {
                                chat_id: chatId, message_id: msgId, parse_mode: 'Markdown',
                                reply_markup: { inline_keyboard: [[{ text: '🔙 برگشت', callback_data: 'menu_spy' }]] }
                            });
                        } catch(e) {}
                    }
                    delete activeMissions[opId];
                }, 1800000);
                
                return bot.answerCallbackQuery(query.id);
            }
            
            // بروزرسانی مأموریت
            if (data.startsWith('spy_mission_')) {
                const opId = data.replace('spy_mission_', '');
                const op = activeMissions[opId];
                if (!op) return bot.answerCallbackQuery(query.id, { text: '❌ تموم شده!' });
                
                const remaining = Math.max(0, op.endTime - Date.now());
                const elapsed = Date.now() - op.startTime;
                const percent = Math.min(100, Math.floor((elapsed / (op.endTime - op.startTime)) * 100));
                const timeLeft = remaining < 3600000 ? `${Math.floor(remaining/60000)} دقیقه` : `${Math.floor(remaining/3600000)} ساعت`;
                
                let bar = '';
                for (let i = 0; i < 10; i++) bar += i < Math.floor(percent/10) ? '█' : '░';
                
                await bot.editMessageText(`⏳ *${op.type === 'assassinate' ? 'ترور' : 'سایبری'}*\n\n${bar} ${percent}٪\n⏰ ${timeLeft} دیگه`, {
                    chat_id: chatId, message_id: msgId, parse_mode: 'Markdown',
                    reply_markup: { inline_keyboard: [[{ text: '📊 بروزرسانی', callback_data: `spy_mission_${opId}` }], [{ text: '🔙 برگشت', callback_data: 'menu_spy' }]] }
                });
                return bot.answerCallbackQuery(query.id);
            }
            
            // گزارش
            if (data === 'spy_report') {
                const activeCount = Object.values(activeSpies).filter(s => s.userId === userId).length;
                const missionCount = Object.values(activeMissions).filter(m => m.userId === userId).length;
                
                let text = '📊 *گزارش اطلاعاتی*\n\n';
                text += `🕵️ جاسوس‌های فعال: ${activeCount}\n`;
                text += `📋 مأموریت‌ها: ${missionCount}\n`;
                text += `🔐 امنیت: ${p.defense}%\n`;
                text += `💰 هزینه این ماه: ${p.spies.length * 500} دلار\n`;
                text += `📊 جاسوسی‌های موفق: ${p.spies.length}\n`;
                
                await bot.editMessageText(text, {
                    chat_id: chatId, message_id: msgId, parse_mode: 'Markdown',
                    reply_markup: { inline_keyboard: [[{ text: '🔙 برگشت', callback_data: 'menu_spy' }]] }
                });
                return bot.answerCallbackQuery(query.id);
            }
            
            // 🔐 امنیت
            if (data === 'spy_security') {
                if (p.treasury < 2000) return bot.answerCallbackQuery(query.id, { text: '❌ ۲۰۰۰ دلار لازمه!' });
                p.treasury -= 2000;
                p.defense += 5;
                
                await bot.editMessageText(`🔐 *امنیت افزایش یافت!*\n🛡️ فعلی: ${p.defense}\n💰 -۲۰۰۰ دلار\n🔍 شانس کشف جاسوس: +۱۵٪`, {
                    chat_id: chatId, message_id: msgId, parse_mode: 'Markdown',
                    reply_markup: { inline_keyboard: [[{ text: '🔙 برگشت', callback_data: 'menu_spy' }]] }
                });
                return bot.answerCallbackQuery(query.id);
            }
            
            // کشف جاسوس
            if (data === 'spy_find') {
                if (Math.random() < 0.3) {
                    const countryKey = Object.keys(config.countries)[Math.floor(Math.random() * 10)];
                    player.addPrisoner(userId, `جاسوس ${config.countries[countryKey]?.name || 'ناشناس'}`, 'جاسوسی');
                    await bot.editMessageText('🔍 *جاسوس کشف شد!*\n🔒 فرستاده شد به زندان', {
                        chat_id: chatId, message_id: msgId, parse_mode: 'Markdown',
                        reply_markup: { inline_keyboard: [[{ text: '🔙 برگشت', callback_data: 'menu_spy' }]] }
                    });
                } else {
                    await bot.editMessageText('🔍 *چیزی پیدا نشد*\n✅ امنیت برقراره', {
                        chat_id: chatId, message_id: msgId, parse_mode: 'Markdown',
                        reply_markup: { inline_keyboard: [[{ text: '🔙 برگشت', callback_data: 'menu_spy' }]] }
                    });
                }
                return bot.answerCallbackQuery(query.id);
            }
            
        } catch (e) {
            console.log('Spy error:', e.message);
            await bot.answerCallbackQuery(query.id, { text: '❌ خطا!', show_alert: true });
        }
    });
}

module.exports = { setupSpy, spyMenu };