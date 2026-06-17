const config = require('../config');
const player = require('../player');

// بازار زنده
const marketData = {
    oilPrice: 80,
    goldPrice: 2000,
    dollarRate: 160000,
    lastUpdate: Date.now()
};

// پروژه‌های فعال
const activeProjects = {};

// بروزرسانی قیمت‌ها هر ۳۰ دقیقه
setInterval(() => {
    marketData.oilPrice = Math.max(50, Math.min(150, marketData.oilPrice + (Math.random() - 0.5) * 20));
    marketData.goldPrice = Math.max(1000, Math.min(5000, marketData.goldPrice + (Math.random() - 0.5) * 200));
    marketData.dollarRate = Math.max(50000, Math.min(500000, marketData.dollarRate + (Math.random() - 0.5) * 20000));
    marketData.lastUpdate = Date.now();
}, 1800000);

function economyMenu() {
    return {
        reply_markup: {
            inline_keyboard: [
                [{ text: '🏦 خزانه و دارایی', callback_data: 'eco_treasury' }, { text: '🛢️ نفت و انرژی', callback_data: 'eco_oil' }],
                [{ text: '📊 بازار بورس', callback_data: 'eco_market' }, { text: '🏗️ پروژه‌های عمرانی', callback_data: 'eco_projects' }],
                [{ text: '👥 نیروی کار', callback_data: 'eco_workers' }, { text: '🌍 صادرات', callback_data: 'eco_export' }],
                [{ text: '💳 مالیات', callback_data: 'eco_tax' }, { text: '💰 چاپ پول', callback_data: 'eco_print' }],
                [{ text: '🔙 برگشت', callback_data: 'menu_main' }]
            ]
        }
    };
}

function setupEconomy(bot) {
    
    bot.on('callback_query', async (query) => {
        const chatId = query.message.chat.id;
        const msgId = query.message.message_id;
        const userId = query.from.id;
        const data = query.data;
        
        if (!data.startsWith('eco_') && data !== 'menu_economy') return;
        
        const p = player.getPlayer(userId);
        
        try {
            // ============ منوی اقتصاد ============
            if (data === 'menu_economy') {
                const totalAssets = p.treasury + (p.oil * marketData.oilPrice) + (p.gold * marketData.goldPrice);
                
                let text = '💰 *اقتصاد امپراطوری*\n\n';
                text += `🏦 خزانه: ${p.treasury.toLocaleString()} دلار\n`;
                text += `🛢️ نفت: ${p.oil.toLocaleString()} بشکه (${(p.oil * marketData.oilPrice).toLocaleString()} دلار)\n`;
                text += `🪙 طلا: ${p.gold} کیلو (${(p.gold * marketData.goldPrice).toLocaleString()} دلار)\n`;
                text += `💵 مجموع دارایی: ${totalAssets.toLocaleString()} دلار\n\n`;
                text += `📊 *بازار:* 💵${marketData.dollarRate.toLocaleString()} | 🛢️${Math.floor(marketData.oilPrice)} | 🪙${Math.floor(marketData.goldPrice)}\n\n`;
                text += 'بخش:';
                
                await bot.editMessageText(text, {
                    chat_id: chatId, message_id: msgId, parse_mode: 'Markdown', ...economyMenu()
                });
                return bot.answerCallbackQuery(query.id);
            }
            
            // ============ 🏦 خزانه ============
            if (data === 'eco_treasury') {
                const totalAssets = p.treasury + (p.oil * marketData.oilPrice) + (p.gold * marketData.goldPrice);
                
                let text = '🏦 *خزانه ملی*\n\n';
                text += `💰 موجودی: ${p.treasury.toLocaleString()} دلار\n`;
                text += `🛢️ نفت: ${p.oil.toLocaleString()} بشکه (${Math.floor(marketData.oilPrice)} دلار/بشکه)\n`;
                text += `🪙 طلا: ${p.gold} کیلو (${Math.floor(marketData.goldPrice)} دلار/کیلو)\n`;
                text += `💵 مجموع: ${totalAssets.toLocaleString()} دلار\n`;
                text += `📊 رتبه اقتصادی: ${totalAssets > 1000000 ? '🇦' : totalAssets > 500000 ? '🇧' : totalAssets > 100000 ? '🇨' : '🇩'}`;
                
                await bot.editMessageText(text, {
                    chat_id: chatId, message_id: msgId, parse_mode: 'Markdown',
                    reply_markup: { inline_keyboard: [[{ text: '🔙 برگشت', callback_data: 'menu_economy' }]] }
                });
                return bot.answerCallbackQuery(query.id);
            }
            
            // ============ 🛢️ نفت ============
            if (data === 'eco_oil') {
                let text = '🛢️ *نفت و انرژی*\n\n';
                text += `🛢️ ذخیره: ${p.oil.toLocaleString()} بشکه\n`;
                text += `💵 قیمت: ${Math.floor(marketData.oilPrice)} دلار/بشکه\n`;
                text += `💰 ارزش: ${(p.oil * marketData.oilPrice).toLocaleString()} دلار\n\n`;
                text += 'عملیات:';
                
                await bot.editMessageText(text, {
                    chat_id: chatId, message_id: msgId, parse_mode: 'Markdown',
                    reply_markup: {
                        inline_keyboard: [
                            [{ text: '🛢️ استخراج نفت', callback_data: 'eco_extract' }],
                            [{ text: '💰 فروش ۱۰۰ بشکه', callback_data: 'eco_sell_oil_100' }],
                            [{ text: '💰 فروش ۵۰۰ بشکه', callback_data: 'eco_sell_oil_500' }],
                            [{ text: '🤝 قرارداد بلندمدت', callback_data: 'eco_oil_contract' }],
                            [{ text: '🔙 برگشت', callback_data: 'menu_economy' }]
                        ]
                    }
                });
                return bot.answerCallbackQuery(query.id);
            }
            
            if (data === 'eco_extract') {
                const extracted = Math.floor(Math.random() * 200) + 100;
                p.oil += extracted;
                await bot.editMessageText(`🛢️ *استخراج نفت*\n✅ +${extracted} بشکه\n🛢️ کل: ${p.oil.toLocaleString()}`, {
                    chat_id: chatId, message_id: msgId, parse_mode: 'Markdown',
                    reply_markup: { inline_keyboard: [[{ text: '🔙 برگشت', callback_data: 'eco_oil' }]] }
                });
                return bot.answerCallbackQuery(query.id);
            }
            
            if (data.startsWith('eco_sell_oil_')) {
                const amount = parseInt(data.replace('eco_sell_oil_', ''));
                if (p.oil < amount) return bot.answerCallbackQuery(query.id, { text: '❌ نفت کافی نداری!' });
                p.oil -= amount;
                const earned = amount * Math.floor(marketData.oilPrice);
                p.treasury += earned;
                await bot.editMessageText(`💰 *فروش نفت*\n🛢️ -${amount} بشکه\n💰 +${earned.toLocaleString()} دلار\n🏦 خزانه: ${p.treasury.toLocaleString()}`, {
                    chat_id: chatId, message_id: msgId, parse_mode: 'Markdown',
                    reply_markup: { inline_keyboard: [[{ text: '🔙 برگشت', callback_data: 'eco_oil' }]] }
                });
                return bot.answerCallbackQuery(query.id);
            }
            
            if (data === 'eco_oil_contract') {
                if (p.treasury < 5000) return bot.answerCallbackQuery(query.id, { text: '❌ ۵۰۰۰ دلار برای قرارداد لازمه!' });
                
                const opId = 'contract_' + Date.now();
                activeProjects[opId] = {
                    type: 'oil_contract', userId, chatId, msgId,
                    startTime: Date.now(), endTime: Date.now() + 30000,
                    cost: 5000, reward: 10000, oilBonus: 500
                };
                
                p.treasury -= 5000;
                
                await bot.editMessageText(
                    '🤝 *قرارداد نفتی*\n\n' +
                    '💰 سرمایه‌گذاری: ۵۰۰۰ دلار\n' +
                    '⏰ مدت: ۳۰ ثانیه\n' +
                    '🎁 پاداش: ۱۰۰۰۰ دلار + ۵۰۰ بشکه\n\n' +
                    '⏳ در حال اجرا...',
                    { chat_id: chatId, message_id: msgId, parse_mode: 'Markdown',
                      reply_markup: { inline_keyboard: [[{ text: '📊 بروزرسانی', callback_data: `eco_status_${opId}` }]] } }
                );
                
                setTimeout(async () => {
                    const p2 = player.getPlayer(userId);
                    p2.treasury += 10000;
                    p2.oil += 500;
                    try {
                        await bot.editMessageText('🎉 *قرارداد تمام شد!*\n💰 +۱۰۰۰۰ دلار\n🛢️ +۵۰۰ بشکه', {
                            chat_id: chatId, message_id: msgId, parse_mode: 'Markdown',
                            reply_markup: { inline_keyboard: [[{ text: '🔙 برگشت', callback_data: 'eco_oil' }]] }
                        });
                    } catch(e) {}
                    delete activeProjects[opId];
                }, 30000);
                
                return bot.answerCallbackQuery(query.id);
            }
            
            // ============ 📊 بازار ============
            if (data === 'eco_market') {
                let text = '📊 *بازار جهانی*\n\n';
                text += `💵 دلار: ${marketData.dollarRate.toLocaleString()} تومان\n`;
                text += `🛢️ نفت: ${Math.floor(marketData.oilPrice)} دلار/بشکه\n`;
                text += `🪙 طلا: ${Math.floor(marketData.goldPrice)} دلار/کیلو\n`;
                text += `🔄 آپدیت: ${Math.floor((Date.now() - marketData.lastUpdate) / 60000)} دقیقه پیش\n\n`;
                text += 'عملیات:';
                
                await bot.editMessageText(text, {
                    chat_id: chatId, message_id: msgId, parse_mode: 'Markdown',
                    reply_markup: {
                        inline_keyboard: [
                            [{ text: '🪙 خرید طلا (۱kg)', callback_data: 'eco_buy_gold' }],
                            [{ text: '💰 فروش طلا (۱kg)', callback_data: 'eco_sell_gold' }],
                            [{ text: '💵 خرید دلار', callback_data: 'eco_buy_dollar' }],
                            [{ text: '🔙 برگشت', callback_data: 'menu_economy' }]
                        ]
                    }
                });
                return bot.answerCallbackQuery(query.id);
            }
            
            if (data === 'eco_buy_gold') {
                const cost = Math.floor(marketData.goldPrice);
                if (p.treasury < cost) return bot.answerCallbackQuery(query.id, { text: `❌ ${cost.toLocaleString()} دلار لازمه!` });
                p.treasury -= cost;
                p.gold++;
                await bot.editMessageText(`🪙 *+۱ کیلو طلا*\n💰 -${cost.toLocaleString()} دلار\n🪙 ${p.gold} کیلو`, {
                    chat_id: chatId, message_id: msgId, parse_mode: 'Markdown',
                    reply_markup: { inline_keyboard: [[{ text: '🔙 برگشت', callback_data: 'eco_market' }]] }
                });
                return bot.answerCallbackQuery(query.id);
            }
            
            if (data === 'eco_sell_gold') {
                if (p.gold < 1) return bot.answerCallbackQuery(query.id, { text: '❌ طلا نداری!' });
                const earned = Math.floor(marketData.goldPrice);
                p.gold--;
                p.treasury += earned;
                await bot.editMessageText(`💰 *فروش طلا*\n🪙 -۱ کیلو\n💰 +${earned.toLocaleString()} دلار`, {
                    chat_id: chatId, message_id: msgId, parse_mode: 'Markdown',
                    reply_markup: { inline_keyboard: [[{ text: '🔙 برگشت', callback_data: 'eco_market' }]] }
                });
                return bot.answerCallbackQuery(query.id);
            }
            
            // ============ 🏗️ پروژه‌ها ============
            if (data === 'eco_projects') {
                let text = '🏗️ *پروژه‌های عمرانی*\n\n';
                text += '💰 *سرمایه‌گذاری:*\n\n';
                
                await bot.editMessageText(text, {
                    chat_id: chatId, message_id: msgId, parse_mode: 'Markdown',
                    reply_markup: {
                        inline_keyboard: [
                            [{ text: '🏭 پالایشگاه (۵۰۰۰ دلار - ۱ دقیقه)', callback_data: 'eco_project_refinery' }],
                            [{ text: '🚇 مترو (۳۰۰۰ دلار - ۱ دقیقه)', callback_data: 'eco_project_metro' }],
                            [{ text: '⚡ نیروگاه (۴۰۰۰ دلار - ۱ دقیقه)', callback_data: 'eco_project_power' }],
                            [{ text: '🏥 بیمارستان (۲۰۰۰ دلار - ۱ دقیقه)', callback_data: 'eco_project_hospital' }],
                            [{ text: '🔙 برگشت', callback_data: 'menu_economy' }]
                        ]
                    }
                });
                return bot.answerCallbackQuery(query.id);
            }
            
            if (data.startsWith('eco_project_')) {
                const type = data.replace('eco_project_', '');
                const projects = {
                    refinery: { name: 'پالایشگاه', cost: 5000, reward: '🛢️ +۵۰۰ بشکه/روز', oilBonus: 500, time: 60000 },
                    metro: { name: 'مترو', cost: 3000, reward: '📊 +۱۵٪ محبوبیت', popBonus: 15, time: 60000 },
                    power: { name: 'نیروگاه', cost: 4000, reward: '⚡ +۱۰٪ قدرت صنعتی', time: 60000 },
                    hospital: { name: 'بیمارستان', cost: 2000, reward: '📊 +۱۰٪ محبوبیت', popBonus: 10, time: 60000 }
                };
                
                const proj = projects[type];
                if (!proj) return bot.answerCallbackQuery(query.id);
                if (p.treasury < proj.cost) return bot.answerCallbackQuery(query.id, { text: `❌ ${proj.cost.toLocaleString()} دلار لازمه!` });
                
                p.treasury -= proj.cost;
                
                const opId = 'proj_' + Date.now();
                activeProjects[opId] = { ...proj, userId, chatId, msgId, startTime: Date.now(), endTime: Date.now() + proj.time };
                
                await bot.editMessageText(
                    `🏗️ *${proj.name}*\n\n💰 هزینه: ${proj.cost.toLocaleString()} دلار\n⏰ زمان: ۱ دقیقه\n\n⏳ در حال ساخت...`,
                    { chat_id: chatId, message_id: msgId, parse_mode: 'Markdown',
                      reply_markup: { inline_keyboard: [[{ text: '📊 بروزرسانی', callback_data: `eco_status_${opId}` }]] } }
                );
                
                setTimeout(async () => {
                    const p2 = player.getPlayer(userId);
                    if (proj.oilBonus) p2.oil += proj.oilBonus;
                    if (proj.popBonus) p2.popularity = Math.min(100, p2.popularity + proj.popBonus);
                    try {
                        await bot.editMessageText(`🎉 *${proj.name} ساخته شد!*\n${proj.reward}`, {
                            chat_id: chatId, message_id: msgId, parse_mode: 'Markdown',
                            reply_markup: { inline_keyboard: [[{ text: '🔙 برگشت', callback_data: 'eco_projects' }]] }
                        });
                    } catch(e) {}
                    delete activeProjects[opId];
                }, proj.time);
                
                return bot.answerCallbackQuery(query.id);
            }
            
            // ============ 💳 مالیات ============
            if (data === 'eco_tax') {
                const taxIncome = Math.floor(p.popularity * 100);
                p.treasury += taxIncome;
                p.popularity = Math.max(0, p.popularity - 8);
                
                await bot.editMessageText(
                    '💳 *جمع‌آوری مالیات*\n\n' +
                    `💰 درآمد: ${taxIncome.toLocaleString()} دلار\n` +
                    `📊 محبوبیت: -۸٪ (مردم ناراضی)\n` +
                    `🏦 خزانه: ${p.treasury.toLocaleString()} دلار\n\n` +
                    '⚠️ مالیات زیاد = اعتراضات!',
                    { chat_id: chatId, message_id: msgId, parse_mode: 'Markdown',
                      reply_markup: { inline_keyboard: [[{ text: '🔙 برگشت', callback_data: 'menu_economy' }]] } }
                );
                return bot.answerCallbackQuery(query.id);
            }
            
            // ============ 💰 چاپ پول ============
            if (data === 'eco_print') {
                p.treasury += 5000;
                marketData.dollarRate += 20000;
                p.popularity = Math.max(0, p.popularity - 15);
                
                await bot.editMessageText(
                    '💰 *چاپ پول بدون پشتوانه!*\n\n' +
                    `💰 +۵۰۰۰ دلار\n` +
                    `💵 دلار: ${marketData.dollarRate.toLocaleString()} تومان (+۲۰,۰۰۰)\n` +
                    `📊 محبوبیت: -۱۵٪ (تورم!)\n\n` +
                    '⚠️ چاپ پول زیاد = ابرتورم!',
                    { chat_id: chatId, message_id: msgId, parse_mode: 'Markdown',
                      reply_markup: { inline_keyboard: [[{ text: '🔙 برگشت', callback_data: 'menu_economy' }]] } }
                );
                return bot.answerCallbackQuery(query.id);
            }
            
            // ============ وضعیت پروژه ============
            if (data.startsWith('eco_status_')) {
                const opId = data.replace('eco_status_', '');
                const op = activeProjects[opId];
                if (!op) return bot.answerCallbackQuery(query.id, { text: '❌ تموم شده!' });
                
                const remaining = Math.max(0, op.endTime - Date.now());
                const elapsed = Date.now() - op.startTime;
                const percent = Math.min(100, Math.floor((elapsed / (op.endTime - op.startTime)) * 100));
                const secLeft = Math.ceil(remaining / 1000);
                
                let bar = '';
                for (let i = 0; i < 10; i++) bar += i < Math.floor(percent/10) ? '█' : '░';
                
                await bot.editMessageText(
                    `⏳ *${op.name || 'پروژه'}*\n\n${bar} ${percent}٪\n⏰ ${secLeft} ثانیه دیگه`,
                    { chat_id: chatId, message_id: msgId, parse_mode: 'Markdown',
                      reply_markup: { inline_keyboard: [[{ text: '📊 بروزرسانی', callback_data: `eco_status_${opId}` }]] } }
                );
                return bot.answerCallbackQuery(query.id);
            }
            
        } catch (e) {
            console.log('Economy error:', e.message);
            await bot.answerCallbackQuery(query.id, { text: '❌ خطا!', show_alert: true });
        }
    });
}

module.exports = { setupEconomy, economyMenu };