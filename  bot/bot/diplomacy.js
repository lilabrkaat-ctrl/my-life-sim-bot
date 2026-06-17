const config = require('../config');
const player = require('../player');

// ذخیره عملیات‌های فعال
const activeDiplomacy = {};

function diplomacyMenu() {
    return {
        reply_markup: {
            inline_keyboard: [
                [{ text: '🌍 کشورها', callback_data: 'diplo_map' }, { text: '🤝 اتحاد', callback_data: 'diplo_ally_list' }],
                [{ text: '💰 تجارت', callback_data: 'diplo_trade_list' }, { text: '☮️ صلح', callback_data: 'diplo_peace_list' }],
                [{ text: '🚫 تحریم', callback_data: 'diplo_sanction_list' }, { text: '💣 اولتیماتوم', callback_data: 'diplo_ultimatum_list' }],
                [{ text: '🎯 باج‌گیری', callback_data: 'diplo_blackmail' }, { text: '🔙 برگشت', callback_data: 'menu_main' }]
            ]
        }
    };
}

function setupDiplomacy(bot) {
    
    bot.on('callback_query', async (query) => {
        const chatId = query.message.chat.id;
        const msgId = query.message.message_id;
        const userId = query.from.id;
        const data = query.data;
        
        if (!data.startsWith('diplo_') && data !== 'menu_diplomacy') return;
        
        const p = player.getPlayer(userId);
        
        try {
            // ============ منوی دیپلماسی ============
            if (data === 'menu_diplomacy') {
                let text = '🤝 *دیپلماسی*\n\n';
                text += `🌍 متحدان: ${p.alliances.length} | ⚔️ جنگ: ${p.wars.length} | 🚫 تحریم: ${p.sanctions.length}\n\n`;
                text += 'عملیات:';
                
                await bot.editMessageText(text, {
                    chat_id: chatId, message_id: msgId, parse_mode: 'Markdown', ...diplomacyMenu()
                });
                return bot.answerCallbackQuery(query.id);
            }
            
            // ============ نقشه جهان ============
            if (data === 'diplo_map') {
                let buttons = [];
                let row = [];
                
                for (let key in config.countries) {
                    const c = config.countries[key];
                    const isAlly = p.alliances.includes(key);
                    const isAtWar = p.wars.find(w => w.country === key);
                    const icon = isAlly ? '🤝' : isAtWar ? '⚔️' : '';
                    row.push({ text: `${icon}${c.emoji} ${c.name}`, callback_data: `diplo_select_${key}` });
                    if (row.length === 2) { buttons.push(row); row = []; }
                }
                if (row.length > 0) buttons.push(row);
                buttons.push([{ text: '🔙 برگشت', callback_data: 'menu_diplomacy' }]);
                
                await bot.editMessageText('🌍 *نقشه جهان*\n🤝=متحد ⚔️=جنگ 🚫=تحریم', {
                    chat_id: chatId, message_id: msgId, parse_mode: 'Markdown',
                    reply_markup: { inline_keyboard: buttons }
                });
                return bot.answerCallbackQuery(query.id);
            }
            
            // ============ انتخاب کشور ============
            if (data.startsWith('diplo_select_')) {
                const key = data.replace('diplo_select_', '');
                const c = config.countries[key];
                const isAlly = p.alliances.includes(key);
                const isAtWar = p.wars.find(w => w.country === key);
                const isSanctioned = p.sanctions.includes(key);
                
                let text = `${c.emoji} *${c.name}*\n\n`;
                text += `⚡ ${c.power} | 🛢️ ${c.oil} | 🪙 ${c.gold}\n`;
                if (isAlly) text += '🤝 متحد\n';
                if (isAtWar) text += '⚔️ در جنگ\n';
                if (isSanctioned) text += '🚫 تحریم شده\n';
                text += '\nعملیات:';
                
                let buttons = [];
                if (!isAlly) buttons.push([{ text: '🤝 درخواست اتحاد', callback_data: `diplo_ally_${key}` }]);
                buttons.push([{ text: '💰 تجارت', callback_data: `diplo_trade_${key}` }]);
                if (isAtWar) buttons.push([{ text: '☮️ درخواست صلح', callback_data: `diplo_peace_${key}` }]);
                if (!isSanctioned) buttons.push([{ text: '🚫 تحریم', callback_data: `diplo_sanction_${key}` }]);
                buttons.push([{ text: '💣 اولتیماتوم', callback_data: `diplo_ultimatum_${key}` }]);
                buttons.push([{ text: '🎯 باج‌گیری', callback_data: `diplo_blackmail_${key}` }]);
                buttons.push([{ text: '🔙 برگشت', callback_data: 'diplo_map' }]);
                
                await bot.editMessageText(text, {
                    chat_id: chatId, message_id: msgId, parse_mode: 'Markdown',
                    reply_markup: { inline_keyboard: buttons }
                });
                return bot.answerCallbackQuery(query.id);
            }
            
            // ============ 🤝 اتحاد ============
            if (data.startsWith('diplo_ally_')) {
                const key = data.replace('diplo_ally_', '');
                const c = config.countries[key];
                
                if (p.treasury < 500) return bot.answerCallbackQuery(query.id, { text: '❌ ۵۰۰ دلار لازمه!', show_alert: true });
                if (p.alliances.includes(key)) return bot.answerCallbackQuery(query.id, { text: '❌ قبلاً متحدید!', show_alert: true });
                
                p.treasury -= 500;
                
                const opId = 'ally_' + Date.now();
                const waitTime = 10000; // ۱۰ ثانیه برای تست (واقعی: ۱۰ دقیقه)
                
                activeDiplomacy[opId] = {
                    type: 'ally', key, userId, chatId, msgId,
                    startTime: Date.now(), endTime: Date.now() + waitTime
                };
                
                await bot.editMessageText(
                    `🤝 *درخواست اتحاد با ${c.emoji} ${c.name}*\n\n` +
                    `💰 هزینه: ۵۰۰ دلار\n` +
                    `⏰ زمان مذاکره: ۱۰ ثانیه\n\n` +
                    `⏳ *در حال مذاکره...*\n` +
                    `████░░░░░░ ۰٪`,
                    { chat_id: chatId, message_id: msgId, parse_mode: 'Markdown',
                      reply_markup: { inline_keyboard: [[{ text: '📊 بروزرسانی', callback_data: `diplo_status_${opId}` }]] } }
                );
                
                // نتیجه بعد از ۱۰ ثانیه
                setTimeout(async () => {
                    const chance = Math.random() < 0.6;
                    const p2 = player.getPlayer(userId);
                    
                    if (chance) {
                        if (!p2.alliances.includes(key)) p2.alliances.push(key);
                        await bot.editMessageText(
                            `🤝 *اتحاد با ${c.emoji} ${c.name}*\n\n` +
                            `✅ *قبول کرد!*\n🤝 حالا متحد هستید!\n⚔️ قدرت: +${Math.floor(c.power*0.3)}`,
                            { chat_id: chatId, message_id: msgId, parse_mode: 'Markdown',
                              reply_markup: { inline_keyboard: [[{ text: '🔙 برگشت', callback_data: 'diplo_map' }]] } }
                        );
                    } else {
                        await bot.editMessageText(
                            `🤝 *اتحاد با ${c.emoji} ${c.name}*\n\n` +
                            `❌ *رد کرد!*\n💔 قبول نکردن...\n💰 ۵۰۰ دلار از دست رف!`,
                            { chat_id: chatId, message_id: msgId, parse_mode: 'Markdown',
                              reply_markup: { inline_keyboard: [[{ text: '🔙 برگشت', callback_data: 'diplo_map' }]] } }
                        );
                    }
                    delete activeDiplomacy[opId];
                }, waitTime);
                
                return bot.answerCallbackQuery(query.id);
            }
            
            // ============ 💰 تجارت ============
            if (data.startsWith('diplo_trade_')) {
                const key = data.replace('diplo_trade_', '');
                const c = config.countries[key];
                
                await bot.editMessageText(
                    `💰 *تجارت با ${c.emoji} ${c.name}*\n\n` +
                    `🛢️ نفت تو: ${p.oil} بشکه\n` +
                    `💵 قیمت: ${config.prices.oil} دلار/بشکه\n\n` +
                    'چقدر می‌فروشی؟',
                    { chat_id: chatId, message_id: msgId, parse_mode: 'Markdown',
                      reply_markup: {
                          inline_keyboard: [
                              [{ text: '🛢️ ۵۰ بشکه', callback_data: `diplo_trade_do_${key}_50` }],
                              [{ text: '🛢️ ۱۰۰ بشکه', callback_data: `diplo_trade_do_${key}_100` }],
                              [{ text: '🛢️ ۲۰۰ بشکه', callback_data: `diplo_trade_do_${key}_200` }],
                              [{ text: '🔙 برگشت', callback_data: `diplo_select_${key}` }]
                          ]
                      }
                    }
                );
                return bot.answerCallbackQuery(query.id);
            }
            
            if (data.startsWith('diplo_trade_do_')) {
                const parts = data.split('_');
                const key = parts[3];
                const amount = parseInt(parts[4]);
                const c = config.countries[key];
                
                if (p.oil < amount) return bot.answerCallbackQuery(query.id, { text: '❌ نفت کافی نداری!', show_alert: true });
                
                p.oil -= amount;
                const earned = amount * config.prices.oil;
                p.treasury += earned;
                
                await bot.editMessageText(
                    `💰 *تجارت موفق!*\n\n` +
                    `${c.emoji} ${c.name}\n` +
                    `🛢️ فروش: ${amount} بشکه\n` +
                    `💰 درآمد: ${earned} دلار\n` +
                    `🏦 خزانه: ${p.treasury.toLocaleString()}`,
                    { chat_id: chatId, message_id: msgId, parse_mode: 'Markdown',
                      reply_markup: { inline_keyboard: [[{ text: '🔙 برگشت', callback_data: 'diplo_map' }]] } }
                );
                return bot.answerCallbackQuery(query.id);
            }
            
            // ============ ☮️ صلح ============
            if (data.startsWith('diplo_peace_')) {
                const key = data.replace('diplo_peace_', '');
                const c = config.countries[key];
                const warIdx = p.wars.findIndex(w => w.country === key);
                
                if (warIdx === -1) return bot.answerCallbackQuery(query.id, { text: '❌ با این کشور در جنگ نیستی!' });
                
                const cost = Math.floor(c.power * 2);
                
                await bot.editMessageText(
                    `☮️ *شرایط صلح با ${c.emoji} ${c.name}*\n\n` +
                    `💰 غرامت: ${cost} دلار\n` +
                    `⏰ ۳۰ ثانیه فرصت داری!\n\n` +
                    'قبوله؟',
                    { chat_id: chatId, message_id: msgId, parse_mode: 'Markdown',
                      reply_markup: {
                          inline_keyboard: [
                              [{ text: `✅ قبول (${cost} دلار)`, callback_data: `diplo_peace_yes_${key}` }],
                              [{ text: '❌ ادامه جنگ', callback_data: 'menu_diplomacy' }]
                          ]
                      }
                    }
                );
                return bot.answerCallbackQuery(query.id);
            }
            
            if (data.startsWith('diplo_peace_yes_')) {
                const key = data.replace('diplo_peace_yes_', '');
                const c = config.countries[key];
                const cost = Math.floor(c.power * 2);
                
                if (p.treasury < cost) return bot.answerCallbackQuery(query.id, { text: '❌ پول کافی نداری!', show_alert: true });
                
                p.treasury -= cost;
                p.wars = p.wars.filter(w => w.country !== key);
                p.popularity = Math.min(100, p.popularity + 8);
                
                await bot.editMessageText(
                    `☮️ *صلح برقرار شد!*\n\n${c.emoji} ${c.name}\n💰 -${cost} دلار\n📊 +۸٪ محبوبیت`,
                    { chat_id: chatId, message_id: msgId, parse_mode: 'Markdown',
                      reply_markup: { inline_keyboard: [[{ text: '🔙 برگشت', callback_data: 'menu_diplomacy' }]] } }
                );
                return bot.answerCallbackQuery(query.id);
            }
            
            // ============ 🚫 تحریم ============
            if (data.startsWith('diplo_sanction_')) {
                const key = data.replace('diplo_sanction_', '');
                const c = config.countries[key];
                
                if (p.sanctions.includes(key)) return bot.answerCallbackQuery(query.id, { text: '❌ قبلاً تحریم کردی!' });
                if (p.treasury < 200) return bot.answerCallbackQuery(query.id, { text: '❌ ۲۰۰ دلار لازمه!' });
                
                p.treasury -= 200;
                p.sanctions.push(key);
                
                await bot.editMessageText(
                    `🚫 *تحریم ${c.emoji} ${c.name}*\n\n` +
                    `✅ تحریم اعمال شد!\n` +
                    `📊 دشمن: 💰-۳۰٪ 🛢️-۲۰٪ ⚔️-۱۰٪\n` +
                    `📊 تو: 💰-۱۰۰ دلار/روز`,
                    { chat_id: chatId, message_id: msgId, parse_mode: 'Markdown',
                      reply_markup: { inline_keyboard: [[{ text: '🔙 برگشت', callback_data: 'menu_diplomacy' }]] } }
                );
                return bot.answerCallbackQuery(query.id);
            }
            
            // ============ 💣 اولتیماتوم ============
            if (data.startsWith('diplo_ultimatum_')) {
                const key = data.replace('diplo_ultimatum_', '');
                const c = config.countries[key];
                
                const opId = 'ult_' + Date.now();
                const waitTime = 15000; // ۱۵ ثانیه تست
                
                activeDiplomacy[opId] = {
                    type: 'ultimatum', key, userId, chatId, msgId,
                    startTime: Date.now(), endTime: Date.now() + waitTime
                };
                
                await bot.editMessageText(
                    `💣 *اولتیماتوم به ${c.emoji} ${c.name}*\n\n` +
                    `"تا ۱۵ ثانیه دیگه تسلیم شو!"\n\n` +
                    `⏰ ۱۵ ثانیه...`,
                    { chat_id: chatId, message_id: msgId, parse_mode: 'Markdown',
                      reply_markup: { inline_keyboard: [[{ text: '📊 بروزرسانی', callback_data: `diplo_status_${opId}` }]] } }
                );
                
                setTimeout(async () => {
                    const scared = Math.random() < 0.4;
                    const p2 = player.getPlayer(userId);
                    
                    if (scared) {
                        const tribute = Math.floor(c.gold * 0.2);
                        p2.treasury += tribute;
                        await bot.editMessageText(
                            `💣 *اولتیماتوم به ${c.emoji} ${c.name}*\n\n` +
                            `🎉 *تسلیم شد!*\n💰 خراج: ${tribute} دلار`,
                            { chat_id: chatId, message_id: msgId, parse_mode: 'Markdown',
                              reply_markup: { inline_keyboard: [[{ text: '🔙 برگشت', callback_data: 'menu_diplomacy' }]] } }
                        );
                    } else {
                        p2.wars.push({ country: key, startedAt: Date.now(), status: 'active' });
                        await bot.editMessageText(
                            `💣 *اولتیماتوم به ${c.emoji} ${c.name}*\n\n` +
                            `😤 *رد کرد!*\n⚔️ جنگ شروع شد!`,
                            { chat_id: chatId, message_id: msgId, parse_mode: 'Markdown',
                              reply_markup: { inline_keyboard: [[{ text: '🔙 برگشت', callback_data: 'menu_diplomacy' }]] } }
                        );
                    }
                    delete activeDiplomacy[opId];
                }, waitTime);
                
                return bot.answerCallbackQuery(query.id);
            }
            
            // ============ 🎯 باج‌گیری ============
            if (data.startsWith('diplo_blackmail_')) {
                const key = data.replace('diplo_blackmail_', '');
                const c = config.countries[key];
                
                const opId = 'blk_' + Date.now();
                const waitTime = 10000;
                
                activeDiplomacy[opId] = {
                    type: 'blackmail', key, userId, chatId, msgId,
                    startTime: Date.now(), endTime: Date.now() + waitTime
                };
                
                await bot.editMessageText(
                    `🎯 *باج‌گیری از ${c.emoji} ${c.name}*\n\n` +
                    `"۱۰۰۰ دلار بده وگرنه رسوایت می‌کنم!"\n\n` +
                    `⏰ ۱۰ ثانیه فرصت دارن...`,
                    { chat_id: chatId, message_id: msgId, parse_mode: 'Markdown',
                      reply_markup: { inline_keyboard: [[{ text: '📊 بروزرسانی', callback_data: `diplo_status_${opId}` }]] } }
                );
                
                setTimeout(async () => {
                    const paid = Math.random() < 0.5;
                    const p2 = player.getPlayer(userId);
                    
                    if (paid) {
                        p2.treasury += 1000;
                        await bot.editMessageText(`🎯 *باج‌گیری موفق!*\n💰 +۱۰۰۰ دلار`, {
                            chat_id: chatId, message_id: msgId, parse_mode: 'Markdown',
                            reply_markup: { inline_keyboard: [[{ text: '🔙 برگشت', callback_data: 'menu_diplomacy' }]] }
                        });
                    } else {
                        p2.popularity = Math.max(0, p2.popularity - 10);
                        await bot.editMessageText(`🎯 *باج‌گیری ناموفق!*\n😤 ندادن!\n📊 -۱۰٪ محبوبیت`, {
                            chat_id: chatId, message_id: msgId, parse_mode: 'Markdown',
                            reply_markup: { inline_keyboard: [[{ text: '🔙 برگشت', callback_data: 'menu_diplomacy' }]] }
                        });
                    }
                    delete activeDiplomacy[opId];
                }, waitTime);
                
                return bot.answerCallbackQuery(query.id);
            }
            
            // ============ بروزرسانی وضعیت ============
            if (data.startsWith('diplo_status_')) {
                const opId = data.replace('diplo_status_', '');
                const op = activeDiplomacy[opId];
                
                if (!op) return bot.answerCallbackQuery(query.id, { text: '❌ تموم شده!', show_alert: true });
                
                const remaining = Math.max(0, op.endTime - Date.now());
                const elapsed = Date.now() - op.startTime;
                const total = op.endTime - op.startTime;
                const percent = Math.min(100, Math.floor((elapsed / total) * 100));
                
                let bar = '';
                for (let i = 0; i < 10; i++) bar += i < Math.floor(percent/10) ? '█' : '░';
                
                const secLeft = Math.ceil(remaining / 1000);
                
                const names = { ally: 'اتحاد', ultimatum: 'اولتیماتوم', blackmail: 'باج‌گیری' };
                
                await bot.editMessageText(
                    `⏳ *${names[op.type] || 'عملیات'}*\n\n` +
                    `${bar} ${percent}٪\n` +
                    `⏰ ${secLeft} ثانیه دیگه...`,
                    { chat_id: chatId, message_id: msgId, parse_mode: 'Markdown',
                      reply_markup: { inline_keyboard: [[{ text: '📊 بروزرسانی', callback_data: `diplo_status_${opId}` }]] } }
                );
                return bot.answerCallbackQuery(query.id);
            }
            
        } catch (e) {
            console.log('Diplomacy error:', e.message);
            await bot.answerCallbackQuery(query.id, { text: '❌ خطا!', show_alert: true });
        }
    });
}

module.exports = { setupDiplomacy, diplomacyMenu };