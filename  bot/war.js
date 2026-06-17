const config = require('../config');
const player = require('../player');

// انرژی حمله - هر کاربر جدا
const energyData = {};

function getEnergy(userId) {
    const now = Date.now();
    if (!energyData[userId]) {
        energyData[userId] = {
            attacks: 3,
            maxAttacks: 5,
            lastRefill: now,
            boughtAttacks: 0
        };
    }
    
    const data = energyData[userId];
    const timeSinceRefill = now - data.lastRefill;
    
    // هر ۶ ساعت (۲۱۶۰۰۰۰۰ میلی‌ثانیه) ۳ حمله پر میشه
    if (timeSinceRefill >= 21600000) {
        const refills = Math.floor(timeSinceRefill / 21600000);
        data.attacks = Math.min(3, data.attacks + refills * 3);
        data.lastRefill = now;
        data.boughtAttacks = 0;
    }
    
    return data;
}

function useEnergy(userId) {
    const data = getEnergy(userId);
    if (data.attacks <= 0) return false;
    data.attacks--;
    return true;
}

function buyEnergy(userId) {
    const data = getEnergy(userId);
    if (data.boughtAttacks >= 2) return false;
    if (data.attacks >= data.maxAttacks) return false;
    data.attacks++;
    data.boughtAttacks++;
    return true;
}

function getTimeUntilRefill(userId) {
    const data = getEnergy(userId);
    const now = Date.now();
    const timeSinceRefill = now - data.lastRefill;
    const remaining = 21600000 - timeSinceRefill;
    
    if (remaining <= 0) return 'آماده شارژ!';
    
    const hours = Math.floor(remaining / 3600000);
    const minutes = Math.floor((remaining % 3600000) / 60000);
    
    return `${hours} ساعت و ${minutes} دقیقه`;
}

// فاصله کشورها از ایران = زمان حمله
function getAttackTime(countryKey) {
    const distances = {
        iraq: 1, afghanistan: 2, turkey: 3, pakistan: 3,
        syria: 2, lebanon: 2, jordan: 3, kuwait: 2,
        saudi: 15, uae: 10, qatar: 12, oman: 10, yemen: 12, bahrain: 10,
        egypt: 20, russia: 30, china: 45, india: 25,
        germany: 50, france: 55, uk: 60, italy: 50, spain: 60,
        usa: 120, canada: 120, brazil: 90, argentina: 100,
        australia: 120, japan: 80, south_korea: 80,
        israel: 5
    };
    return distances[countryKey] || 30; // پیش‌فرض ۳۰ دقیقه
}

function warMenu() {
    return {
        reply_markup: {
            inline_keyboard: [
                [{ text: '🗺️ حمله به کشور', callback_data: 'war_map' }, { text: '💂 استخدام نیرو', callback_data: 'war_recruit' }],
                [{ text: '🛡️ تقویت دفاع', callback_data: 'war_defense' }, { text: '📊 گزارش', callback_data: 'war_report' }],
                [{ text: '🔙 برگشت', callback_data: 'menu_main' }]
            ]
        }
    };
}

// ذخیره حمله‌های فعال
const activeAttacks = {};

function setupWar(bot) {
    
    bot.on('callback_query', async (query) => {
        const chatId = query.message.chat.id;
        const msgId = query.message.message_id;
        const userId = query.from.id;
        const data = query.data;
        
        if (!data.startsWith('war_') && data !== 'menu_war') return;
        
        const p = player.getPlayer(userId);
        const energy = getEnergy(userId);
        
        try {
            // منوی جنگ
            if (data === 'menu_war') {
                const timeLeft = getTimeUntilRefill(userId);
                let energyBar = '';
                for (let i = 0; i < 5; i++) {
                    energyBar += i < energy.attacks ? '█' : '░';
                }
                
                let text = '⚔️ *اتاق جنگ*\n\n';
                text += `⚡ انرژی: ${energyBar} ${energy.attacks}/${energy.maxAttacks}\n`;
                text += `⏰ شارژ بعدی: ${timeLeft}\n\n`;
                text += `💂 قدرت: ${player.getTotalPower(userId)}\n`;
                text += `🛡️ دفاع: ${p.defense}\n`;
                text += `💰 خزانه: ${p.treasury.toLocaleString()} دلار\n\n`;
                
                if (energy.attacks <= 0) {
                    text += '⚠️ *انرژی تموم شده!*\n';
                    text += '💰 با ۵۰۰ دلار یه حمله بخر\n';
                    text += 'یا صبر کن تا شارژ بشه\n\n';
                }
                
                text += 'عملیات:';
                
                const buttons = [];
                if (energy.attacks > 0) {
                    buttons.push([{ text: '🗺️ حمله به کشور', callback_data: 'war_map' }]);
                }
                if (energy.boughtAttacks < 2 && energy.attacks < 5) {
                    buttons.push([{ text: '💰 خرید حمله (۵۰۰ دلار)', callback_data: 'war_buy_energy' }]);
                }
                buttons.push([{ text: '💂 استخدام نیرو', callback_data: 'war_recruit' }]);
                buttons.push([{ text: '🛡️ تقویت دفاع', callback_data: 'war_defense' }]);
                buttons.push([{ text: '📊 گزارش', callback_data: 'war_report' }]);
                buttons.push([{ text: '🔙 برگشت', callback_data: 'menu_main' }]);
                
                await bot.editMessageText(text, {
                    chat_id: chatId, message_id: msgId, parse_mode: 'Markdown',
                    reply_markup: { inline_keyboard: buttons }
                });
                return bot.answerCallbackQuery(query.id);
            }
            
            // خرید انرژی
            if (data === 'war_buy_energy') {
                if (p.treasury < 500) {
                    return bot.answerCallbackQuery(query.id, { text: '❌ ۵۰۰ دلار لازمه!', show_alert: true });
                }
                const bought = buyEnergy(userId);
                if (!bought) {
                    return bot.answerCallbackQuery(query.id, { text: '❌ نمی‌تونی بیشتر از این بخری!', show_alert: true });
                }
                p.treasury -= 500;
                await bot.answerCallbackQuery(query.id, { text: '✅ +۱ حمله خریداری شد!', show_alert: true });
                
                // برگشت به منوی جنگ
                const timeLeft = getTimeUntilRefill(userId);
                let energyBar = '';
                for (let i = 0; i < 5; i++) energyBar += i < energy.attacks ? '█' : '░';
                
                let text = '⚔️ *اتاق جنگ*\n\n';
                text += `⚡ انرژی: ${energyBar} ${energy.attacks}/${energy.maxAttacks}\n`;
                text += `⏰ شارژ بعدی: ${timeLeft}\n`;
                text += `💰 -۵۰۰ دلار\n\nعملیات:`;
                
                const buttons = [];
                if (energy.attacks > 0) buttons.push([{ text: '🗺️ حمله به کشور', callback_data: 'war_map' }]);
                if (energy.boughtAttacks < 2 && energy.attacks < 5) buttons.push([{ text: '💰 خرید حمله (۵۰۰ دلار)', callback_data: 'war_buy_energy' }]);
                buttons.push([{ text: '💂 استخدام نیرو', callback_data: 'war_recruit' }]);
                buttons.push([{ text: '🛡️ تقویت دفاع', callback_data: 'war_defense' }]);
                buttons.push([{ text: '📊 گزارش', callback_data: 'war_report' }]);
                buttons.push([{ text: '🔙 برگشت', callback_data: 'menu_main' }]);
                
                await bot.editMessageText(text, {
                    chat_id: chatId, message_id: msgId, parse_mode: 'Markdown',
                    reply_markup: { inline_keyboard: buttons }
                });
                return;
            }
            
            // نقشه کشورها
            if (data === 'war_map') {
                if (energy.attacks <= 0) {
                    return bot.answerCallbackQuery(query.id, { text: '❌ انرژی نداری!', show_alert: true });
                }
                
                let buttons = [];
                let row = [];
                
                for (let key in config.countries) {
                    const c = config.countries[key];
                    const time = getAttackTime(key);
                    const timeStr = time < 1 ? `${Math.floor(time * 60)} ثانیه` : `${time} دقیقه`;
                    row.push({ text: `${c.emoji} ${c.name} (⏰${timeStr})`, callback_data: `war_select_${key}` });
                    if (row.length === 1) { buttons.push(row); row = []; }
                }
                buttons.push([{ text: '🔙 برگشت', callback_data: 'menu_war' }]);
                
                await bot.editMessageText('🗺️ *انتخاب کشور برای حمله:*\n\n⚡ انرژی: ' + energy.attacks, {
                    chat_id: chatId, message_id: msgId, parse_mode: 'Markdown',
                    reply_markup: { inline_keyboard: buttons }
                });
                return bot.answerCallbackQuery(query.id);
            }
            
            // انتخاب کشور - مرحله ۱
            if (data.startsWith('war_select_')) {
                const key = data.replace('war_select_', '');
                const c = config.countries[key];
                const baseTime = getAttackTime(key);
                
                await bot.editMessageText(
                    `${c.emoji} *${c.name}*\n\n` +
                    `⚡ قدرت: ${c.power}\n` +
                    `🛢️ نفت: ${c.oil} | 🪙 طلا: ${c.gold}\n\n` +
                    `⏰ زمان عادی: ${baseTime} دقیقه\n\n` +
                    '🎯 *سرعت حمله:*',
                    { chat_id: chatId, message_id: msgId, parse_mode: 'Markdown',
                      reply_markup: {
                          inline_keyboard: [
                              [{ text: `🐢 عادی (${baseTime} دقیقه) - رایگان`, callback_data: `war_speed_${key}_normal` }],
                              [{ text: `🐎 سریع (${Math.ceil(baseTime/2)} دقیقه) - ۵۰۰ دلار`, callback_data: `war_speed_${key}_fast` }],
                              [{ text: `🚀 آتشین (${Math.ceil(baseTime*0.2)} دقیقه) - ۱۰۰۰ دلار`, callback_data: `war_speed_${key}_turbo` }],
                              [{ text: '🔙 برگشت', callback_data: 'war_map' }]
                          ]
                      }
                    }
                );
                return bot.answerCallbackQuery(query.id);
            }
            
            // انتخاب سرعت و اجرای حمله
            if (data.startsWith('war_speed_')) {
                const parts = data.split('_');
                const key = parts[2];
                const speed = parts[3];
                const c = config.countries[key];
                const baseTime = getAttackTime(key);
                
                let attackTime, cost;
                
                if (speed === 'normal') { attackTime = baseTime * 60000; cost = 0; }
                else if (speed === 'fast') { attackTime = Math.ceil(baseTime / 2) * 60000; cost = 500; }
                else { attackTime = Math.ceil(baseTime * 0.2) * 60000; cost = 1000; }
                
                if (cost > 0 && p.treasury < cost) {
                    return bot.answerCallbackQuery(query.id, { text: '❌ پول کافی نداری!', show_alert: true });
                }
                
                if (!useEnergy(userId)) {
                    return bot.answerCallbackQuery(query.id, { text: '❌ انرژی نداری!', show_alert: true });
                }
                
                if (cost > 0) p.treasury -= cost;
                
                const attackId = Date.now().toString();
                const endTime = Date.now() + attackTime;
                
                activeAttacks[attackId] = {
                    userId, chatId, msgId, key, c,
                    endTime, attackTime, speed,
                    startTime: Date.now()
                };
                
                const timeStr = attackTime < 60000 ? `${Math.floor(attackTime/1000)} ثانیه` : `${Math.floor(attackTime/60000)} دقیقه`;
                
                await bot.editMessageText(
                    `⚔️ *حمله به ${c.emoji} ${c.name}*\n\n` +
                    `🚀 موشکی - ${speed === 'normal' ? '🐢 عادی' : speed === 'fast' ? '🐎 سریع' : '🚀 آتشین'}\n` +
                    `⏰ زمان: ${timeStr}\n` +
                    (cost > 0 ? `💰 هزینه: ${cost} دلار\n` : '') +
                    `\n⏳ موشک‌ها در راهن...`,
                    { chat_id: chatId, message_id: msgId, parse_mode: 'Markdown',
                      reply_markup: { inline_keyboard: [[{ text: '📊 بروزرسانی', callback_data: `war_status_${attackId}` }], [{ text: '🔙 برگشت', callback_data: 'menu_war' }]] } }
                );
                return bot.answerCallbackQuery(query.id);
            }
            
            // بروزرسانی وضعیت حمله
            if (data.startsWith('war_status_')) {
                const attackId = data.replace('war_status_', '');
                const attack = activeAttacks[attackId];
                
                if (!attack) {
                    return bot.answerCallbackQuery(query.id, { text: '❌ حمله تموم شده!', show_alert: true });
                }
                
                const now = Date.now();
                const remaining = Math.max(0, attack.endTime - now);
                const elapsed = now - attack.startTime;
                const percent = Math.min(100, Math.floor((elapsed / attack.attackTime) * 100));
                
                let progressBar = '';
                for (let i = 0; i < 10; i++) progressBar += i < Math.floor(percent/10) ? '█' : '░';
                
                if (remaining <= 0) {
                    // حمله تموم شد
                    const myPower = player.getTotalPower(userId);
                    const chance = Math.min(90, Math.max(10, (myPower / (myPower + attack.c.power)) * 100));
                    const won = Math.random() * 100 < chance;
                    
                    let result;
                    if (won) {
                        const loot = Math.floor(attack.c.gold * 0.3);
                        const p = player.getPlayer(userId);
                        p.treasury += loot;
                        p.oil += Math.floor(attack.c.oil * 0.2);
                        p.popularity = Math.min(100, p.popularity + 10);
                        if (!p.conquered) p.conquered = [];
                        if (!p.conquered.includes(attack.key)) p.conquered.push(attack.key);
                        result = `🎉 *پیروزی!*\n💰 +${loot} دلار\n🛢️ +${Math.floor(attack.c.oil*0.2)} نفت\n📊 +۱۰٪ محبوبیت`;
                    } else {
                        const p = player.getPlayer(userId);
                        p.army.soldier = Math.max(0, p.army.soldier - Math.floor(p.army.soldier * 0.2));
                        p.popularity = Math.max(0, p.popularity - 15);
                        result = `💀 *شکست!*\n🗡️ سربازا کشته شدن\n📊 -۱۵٪ محبوبیت`;
                    }
                    
                    delete activeAttacks[attackId];
                    
                    await bot.editMessageText(
                        `⚔️ *حمله به ${attack.c.emoji} ${attack.c.name}*\n\n` +
                        `${progressBar} ۱۰۰٪\n` +
                        `💥 *برخورد!*\n\n${result}`,
                        { chat_id: chatId, message_id: msgId, parse_mode: 'Markdown',
                          reply_markup: { inline_keyboard: [[{ text: '🔙 برگشت', callback_data: 'menu_war' }]] } }
                    );
                } else {
                    const timeStr = remaining < 60000 ? `${Math.floor(remaining/1000)} ثانیه` : `${Math.floor(remaining/60000)} دقیقه`;
                    
                    await bot.editMessageText(
                        `⚔️ *حمله به ${attack.c.emoji} ${attack.c.name}*\n\n` +
                        `${progressBar} ${percent}٪\n` +
                        `⏰ ${timeStr} تا برخورد\n\n` +
                        '⏳ موشک‌ها در راهن...',
                        { chat_id: chatId, message_id: msgId, parse_mode: 'Markdown',
                          reply_markup: { inline_keyboard: [[{ text: '📊 بروزرسانی', callback_data: `war_status_${attackId}` }], [{ text: '🔙 برگشت', callback_data: 'menu_war' }]] } }
                    );
                }
                return bot.answerCallbackQuery(query.id);
            }
            
            // استخدام نیرو
            if (data === 'war_recruit') {
                let buttons = [];
                for (let key in config.units) {
                    const u = config.units[key];
                    buttons.push([{ text: `${u.emoji} ${u.name} - ${u.cost} دلار (⚡${u.power})`, callback_data: `war_buy_${key}` }]);
                }
                buttons.push([{ text: '🔙 برگشت', callback_data: 'menu_war' }]);
                
                await bot.editMessageText(`💂 *استخدام نیرو*\n💰 خزانه: ${p.treasury.toLocaleString()} دلار`, {
                    chat_id: chatId, message_id: msgId, parse_mode: 'Markdown',
                    reply_markup: { inline_keyboard: buttons }
                });
                return bot.answerCallbackQuery(query.id);
            }
            
            // خرید نیرو
            if (data.startsWith('war_buy_')) {
                const key = data.replace('war_buy_', '');
                const u = config.units[key];
                if (p.treasury < u.cost) {
                    return bot.answerCallbackQuery(query.id, { text: '❌ پول کمه!', show_alert: true });
                }
                p.treasury -= u.cost;
                p.army[key] = (p.army[key] || 0) + 1;
                await bot.answerCallbackQuery(query.id, { text: `✅ ${u.name} خریداری شد!`, show_alert: true });
                return;
            }
            
            // تقویت دفاع
            if (data === 'war_defense') {
                if (p.treasury < 500) {
                    return bot.answerCallbackQuery(query.id, { text: '❌ ۵۰۰ دلار لازمه!', show_alert: true });
                }
                p.treasury -= 500;
                p.defense += 5;
                await bot.editMessageText(`🛡️ *دفاع تقویت شد!*\n🛡️ فعلی: ${p.defense}\n💰 -۵۰۰ دلار`, {
                    chat_id: chatId, message_id: msgId, parse_mode: 'Markdown',
                    reply_markup: { inline_keyboard: [[{ text: '🔙 برگشت', callback_data: 'menu_war' }]] }
                });
                return bot.answerCallbackQuery(query.id);
            }
            
            // گزارش جنگ
            if (data === 'war_report') {
                let text = '📊 *گزارش نظامی*\n\n';
                text += `💂 قدرت کل: ${player.getTotalPower(userId)}\n`;
                text += `🛡️ دفاع: ${p.defense}\n\n*نیروها:*\n`;
                for (let key in p.army) {
                    if (p.army[key] > 0) {
                        text += `${config.units[key].emoji} ${config.units[key].name}: ${p.army[key]}\n`;
                    }
                }
                text += `\n🗺️ فتح شده: ${p.conquered.length}\n⚔️ جنگ فعال: ${p.wars.length}`;
                
                await bot.editMessageText(text, {
                    chat_id: chatId, message_id: msgId, parse_mode: 'Markdown',
                    reply_markup: { inline_keyboard: [[{ text: '🔙 برگشت', callback_data: 'menu_war' }]] }
                });
                return bot.answerCallbackQuery(query.id);
            }
            
        } catch (e) {
            console.log('War error:', e.message);
            await bot.answerCallbackQuery(query.id, { text: '❌ خطا!', show_alert: true });
        }
    });
}

module.exports = { setupWar, warMenu };