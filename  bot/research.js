const player = require('../player');

const researchData = {};
const activeResearch = {};

const researchTree = {
    soldier: {
        name: '🗡️ نیروی زمینی',
        levels: {
            1: { name: 'سرباز معمولی', power: 10, cost: 0, time: 0 },
            2: { name: 'سرباز زرهی', power: 25, cost: 1000, time: 600000 },
            3: { name: 'کماندوی ویژه', power: 50, cost: 5000, time: 1800000 },
            4: { name: 'نیروی مخصوص', power: 100, cost: 20000, time: 3600000 },
            5: { name: 'گارد جاویدان', power: 200, cost: 50000, time: 10800000 }
        }
    },
    missile: {
        name: '🚀 موشکی',
        levels: {
            1: { name: 'موشک ساده', power: 200, cost: 0, time: 0 },
            2: { name: 'موشک نقطه‌زن', power: 350, cost: 2000, time: 600000 },
            3: { name: 'موشک بالستیک', power: 500, cost: 10000, time: 1800000 },
            4: { name: 'موشک هایپرسونیک', power: 800, cost: 40000, time: 3600000 },
            5: { name: 'موشک فضایی', power: 1500, cost: 100000, time: 10800000 }
        }
    },
    defense: {
        name: '🛡️ دفاع',
        levels: {
            1: { name: 'دیوار سنگی', defense: 5, cost: 0, time: 0 },
            2: { name: 'دیوار بتنی', defense: 15, cost: 1000, time: 600000 },
            3: { name: 'پدافند هوایی', defense: 30, cost: 5000, time: 1800000 },
            4: { name: 'سپر موشکی', defense: 60, cost: 20000, time: 3600000 },
            5: { name: 'گنبد آهنین', defense: 100, cost: 50000, time: 10800000 }
        }
    },
    speed: {
        name: '⏰ سرعت',
        levels: {
            1: { name: 'عادی', speedBonus: 1, cost: 0, time: 0 },
            2: { name: 'سریع', speedBonus: 0.7, cost: 2000, time: 600000 },
            3: { name: 'آتشین', speedBonus: 0.5, cost: 10000, time: 1800000 },
            4: { name: 'برق‌آسا', speedBonus: 0.3, cost: 30000, time: 3600000 },
            5: { name: 'لحظه‌ای', speedBonus: 0.1, cost: 80000, time: 10800000 }
        }
    },
    economy: {
        name: '💰 اقتصاد',
        levels: {
            1: { name: 'اقتصاد پایه', incomeBonus: 1, cost: 0, time: 0 },
            2: { name: 'اقتصاد شکوفا', incomeBonus: 1.3, cost: 2000, time: 600000 },
            3: { name: 'اقتصاد صنعتی', incomeBonus: 1.6, cost: 10000, time: 1800000 },
            4: { name: 'اقتصاد دیجیتال', incomeBonus: 2, cost: 30000, time: 3600000 },
            5: { name: 'اقتصاد فضایی', incomeBonus: 3, cost: 80000, time: 10800000 }
        }
    },
    spy: {
        name: '🕵️ جاسوسی',
        levels: {
            1: { name: 'آماتور', spyBonus: 0.4, cost: 0, time: 0 },
            2: { name: 'حرفه‌ای', spyBonus: 0.6, cost: 2000, time: 600000 },
            3: { name: 'خبره', spyBonus: 0.75, cost: 10000, time: 1800000 },
            4: { name: 'مخفی', spyBonus: 0.9, cost: 30000, time: 3600000 },
            5: { name: 'شبح', spyBonus: 0.95, cost: 80000, time: 10800000 }
        }
    }
};

function getResearchData(userId) {
    if (!researchData[userId]) {
        researchData[userId] = {
            levels: { soldier: 1, missile: 1, defense: 1, speed: 1, economy: 1, spy: 1 },
            lastFreeResearch: 0,
            extraResearches: 3,
            researchCount: 0
        };
    }
    return researchData[userId];
}

function canResearchToday(userId) {
    const data = getResearchData(userId);
    const now = Date.now();
    const oneDay = 86400000;
    
    // چک تحقیق رایگان
    if (!data.lastFreeResearch || now - data.lastFreeResearch > oneDay) {
        return { can: true, free: true };
    }
    
    // چک تحقیق اضافی
    if (data.extraResearches > 0) {
        return { can: true, free: false };
    }
    
    const remaining = oneDay - (now - data.lastFreeResearch);
    const hours = Math.floor(remaining / 3600000);
    const minutes = Math.floor((remaining % 3600000) / 60000);
    return { can: false, hours, minutes };
}

function buyExtraResearch(userId) {
    const data = getResearchData(userId);
    if (data.extraResearches >= 3) return false;
    data.extraResearches++;
    return true;
}

function getTimeUntilFree(userId) {
    const data = getResearchData(userId);
    const now = Date.now();
    const oneDay = 86400000;
    
    if (!data.lastFreeResearch) return 'آماده';
    
    const remaining = oneDay - (now - data.lastFreeResearch);
    if (remaining <= 0) return 'آماده';
    
    const hours = Math.floor(remaining / 3600000);
    const minutes = Math.floor((remaining % 3600000) / 60000);
    return `${hours}h ${minutes}m`;
}

function startResearch(userId, type, speed) {
    const data = getResearchData(userId);
    const tree = researchTree[type];
    const currentLevel = data.levels[type];
    
    if (currentLevel >= 5) return { success: false, message: 'به حداکثر رسیده!' };
    
    const nextLevel = tree.levels[currentLevel + 1];
    if (!nextLevel) return { success: false, message: 'خطا!' };
    
    const can = canResearchToday(userId);
    if (!can.can) return { success: false, message: `${can.hours}h ${can.minutes}m دیگه` };
    
    // محاسبه زمان
    let researchTime = nextLevel.time;
    let extraCost = 0;
    
    if (speed === 'fast') { researchTime = Math.floor(researchTime * 0.5); extraCost = 500; }
    if (speed === 'turbo') { researchTime = Math.floor(researchTime * 0.2); extraCost = 2000; }
    
    const totalCost = nextLevel.cost + extraCost;
    
    return { success: true, type, nextLevel: currentLevel + 1, time: researchTime, cost: totalCost, extraCost, tree };
}

function completeResearch(userId, type) {
    const data = getResearchData(userId);
    data.levels[type] = Math.min(5, data.levels[type] + 1);
    
    const can = canResearchToday(userId);
    if (can.free) {
        data.lastFreeResearch = Date.now();
    } else {
        data.extraResearches = Math.max(0, data.extraResearches - 1);
    }
    data.researchCount++;
}

function getPowerBonus(userId) {
    const data = getResearchData(userId);
    const soldierLevel = researchTree.soldier.levels[data.levels.soldier];
    const missileLevel = researchTree.missile.levels[data.levels.missile];
    
    return {
        soldierPower: soldierLevel.power,
        missilePower: missileLevel.power,
        defense: researchTree.defense.levels[data.levels.defense].defense,
        speed: researchTree.speed.levels[data.levels.speed].speedBonus,
        income: researchTree.economy.levels[data.levels.economy].incomeBonus,
        spy: researchTree.spy.levels[data.levels.spy].spyBonus
    };
}

function researchMenu() {
    return {
        reply_markup: {
            inline_keyboard: [
                [{ text: '🗡️ نیروی زمینی', callback_data: 'research_soldier' }, { text: '🚀 موشکی', callback_data: 'research_missile' }],
                [{ text: '🛡️ دفاع', callback_data: 'research_defense' }, { text: '⏰ سرعت', callback_data: 'research_speed' }],
                [{ text: '💰 اقتصاد', callback_data: 'research_economy' }, { text: '🕵️ جاسوسی', callback_data: 'research_spy' }],
                [{ text: '💰 خرید تحقیق اضافی (۱۰۰۰ دلار)', callback_data: 'research_buy' }],
                [{ text: '🔙 برگشت', callback_data: 'menu_main' }]
            ]
        }
    };
}

function setupResearch(bot) {
    
    bot.on('callback_query', async (query) => {
        const chatId = query.message.chat.id;
        const msgId = query.message.message_id;
        const userId = query.from.id;
        const data = query.data;
        
        if (!data.startsWith('research_') && data !== 'menu_research') return;
        
        const p = player.getPlayer(userId);
        const rData = getResearchData(userId);
        
        try {
            // منوی تحقیقات
            if (data === 'menu_research') {
                const timeLeft = getTimeUntilFree(userId);
                const can = canResearchToday(userId);
                
                let text = '🧪 *مرکز تحقیقات*\n\n';
                
                if (can.can) {
                    text += can.free ? '✅ تحقیق رایگان آماده!\n' : `✅ تحقیق اضافی آماده! (${rData.extraResearches} باقی‌مانده)\n`;
                } else {
                    text += `⏰ تحقیق رایگان: ${timeLeft} دیگه\n`;
                }
                
                text += `💰 تحقیقات اضافی: ${rData.extraResearches}/۳\n\n`;
                text += '*سطوح:*\n';
                text += `🗡️ نیروی زمینی: ${rData.levels.soldier}/۵ (${researchTree.soldier.levels[rData.levels.soldier].name})\n`;
                text += `🚀 موشکی: ${rData.levels.missile}/۵ (${researchTree.missile.levels[rData.levels.missile].name})\n`;
                text += `🛡️ دفاع: ${rData.levels.defense}/۵ (${researchTree.defense.levels[rData.levels.defense].name})\n`;
                text += `⏰ سرعت: ${rData.levels.speed}/۵ (${researchTree.speed.levels[rData.levels.speed].name})\n`;
                text += `💰 اقتصاد: ${rData.levels.economy}/۵ (${researchTree.economy.levels[rData.levels.economy].name})\n`;
                text += `🕵️ جاسوسی: ${rData.levels.spy}/۵ (${researchTree.spy.levels[rData.levels.spy].name})\n\n`;
                
                text += 'بخش:';
                
                await bot.editMessageText(text, {
                    chat_id: chatId, message_id: msgId, parse_mode: 'Markdown', ...researchMenu()
                });
                return bot.answerCallbackQuery(query.id);
            }
            
            // خرید تحقیق اضافی
            if (data === 'research_buy') {
                if (rData.extraResearches >= 3) {
                    return bot.answerCallbackQuery(query.id, { text: '❌ حداکثر ۳ تحقیق اضافی!', show_alert: true });
                }
                if (p.treasury < 1000) {
                    return bot.answerCallbackQuery(query.id, { text: '❌ ۱۰۰۰ دلار لازمه!', show_alert: true });
                }
                p.treasury -= 1000;
                buyExtraResearch(userId);
                
                await bot.answerCallbackQuery(query.id, { text: '✅ +۱ تحقیق اضافی خریداری شد!', show_alert: true });
                
                const timeLeft = getTimeUntilFree(userId);
                let text = '🧪 *مرکز تحقیقات*\n\n';
                text += `✅ تحقیق اضافی آماده! (${rData.extraResearches} باقی‌مانده)\n`;
                text += `⏰ تحقیق رایگان: ${timeLeft} دیگه\n`;
                text += `💰 تحقیقات اضافی: ${rData.extraResearches}/۳\n\n`;
                text += `💰 -۱۰۰۰ دلار\n\nبخش:`;
                
                await bot.editMessageText(text, {
                    chat_id: chatId, message_id: msgId, parse_mode: 'Markdown', ...researchMenu()
                });
                return;
            }
            
            // انتخاب تحقیق
            if (data.startsWith('research_') && !data.startsWith('research_do_') && !data.startsWith('research_speed_') && !data.startsWith('research_status_')) {
                const type = data.replace('research_', '');
                const tree = researchTree[type];
                if (!tree) return bot.answerCallbackQuery(query.id);
                
                const currentLevel = rData.levels[type];
                if (currentLevel >= 5) return bot.answerCallbackQuery(query.id, { text: '✅ به حداکثر رسیده!', show_alert: true });
                
                const nextLevel = tree.levels[currentLevel + 1];
                const timeStr = nextLevel.time < 3600000 ? Math.floor(nextLevel.time/60000) + ' دقیقه' : Math.floor(nextLevel.time/3600000) + ' ساعت';
                
                await bot.editMessageText(
                    `🧪 *${tree.name}*\n\n` +
                    `📊 فعلی: ${currentLevel}/۵ - ${tree.levels[currentLevel].name}\n` +
                    `⬆️ بعدی: ${currentLevel + 1}/۵ - ${nextLevel.name}\n\n` +
                    `💰 هزینه: ${nextLevel.cost.toLocaleString()} دلار\n` +
                    `⏰ زمان: ${timeStr}\n\n` +
                    'سرعت تحقیق:',
                    { chat_id: chatId, message_id: msgId, parse_mode: 'Markdown',
                      reply_markup: {
                          inline_keyboard: [
                              [{ text: `🐢 عادی (${timeStr})`, callback_data: `research_do_${type}_normal` }],
                              [{ text: `🐎 سریع (${Math.floor(nextLevel.time*0.5/60000)} دقیقه) - ۵۰۰ دلار`, callback_data: `research_do_${type}_fast` }],
                              [{ text: `🚀 آتشین (${Math.floor(nextLevel.time*0.2/60000)} دقیقه) - ۲۰۰۰ دلار`, callback_data: `research_do_${type}_turbo` }],
                              [{ text: '🔙 برگشت', callback_data: 'menu_research' }]
                          ]
                      }
                    }
                );
                return bot.answerCallbackQuery(query.id);
            }
            
            // اجرای تحقیق
            if (data.startsWith('research_do_')) {
                const parts = data.split('_');
                const type = parts[2];
                const speed = parts[3] || 'normal';
                
                const result = startResearch(userId, type, speed);
                if (!result.success) return bot.answerCallbackQuery(query.id, { text: '❌ ' + result.message, show_alert: true });
                if (p.treasury < result.cost) return bot.answerCallbackQuery(query.id, { text: '❌ پول کافی نداری!', show_alert: true });
                
                p.treasury -= result.cost;
                
                const opId = 'research_' + Date.now();
                activeResearch[opId] = {
                    userId, chatId, msgId, type,
                    startTime: Date.now(),
                    endTime: Date.now() + result.time,
                    cost: result.cost
                };
                
                const timeStr = result.time < 3600000 ? Math.floor(result.time/60000) + ' دقیقه' : Math.floor(result.time/3600000) + ' ساعت';
                
                await bot.editMessageText(
                    `🧪 *تحقیق ${result.tree.name}*\n\n` +
                    `📊 ${rData.levels[type]} → ${result.nextLevel}\n` +
                    `💰 هزینه: ${result.cost.toLocaleString()} دلار\n` +
                    `⏰ زمان: ${timeStr}\n\n` +
                    '⏳ در حال تحقیق...',
                    { chat_id: chatId, message_id: msgId, parse_mode: 'Markdown',
                      reply_markup: { inline_keyboard: [[{ text: '📊 بروزرسانی', callback_data: `research_status_${opId}` }], [{ text: '🔙 برگشت', callback_data: 'menu_research' }]] } }
                );
                
                // پایان تحقیق
                setTimeout(async () => {
                    completeResearch(userId, type);
                    const newLevel = rData.levels[type];
                    const levelData = researchTree[type].levels[newLevel];
                    
                    try {
                        await bot.editMessageText(
                            `🎉 *تحقیق کامل شد!*\n\n` +
                            `${researchTree[type].name}: ${newLevel}/۵\n` +
                            `📊 ${levelData.name}\n` +
                            `💰 هزینه: ${result.cost.toLocaleString()} دلار`,
                            { chat_id: chatId, message_id: msgId, parse_mode: 'Markdown',
                              reply_markup: { inline_keyboard: [[{ text: '🔙 برگشت', callback_data: 'menu_research' }]] } }
                        );
                    } catch(e) {}
                    delete activeResearch[opId];
                }, result.time);
                
                return bot.answerCallbackQuery(query.id);
            }
            
            // بروزرسانی وضعیت تحقیق
            if (data.startsWith('research_status_')) {
                const opId = data.replace('research_status_', '');
                const op = activeResearch[opId];
                if (!op) return bot.answerCallbackQuery(query.id, { text: '❌ تموم شده!' });
                
                const remaining = Math.max(0, op.endTime - Date.now());
                const elapsed = Date.now() - op.startTime;
                const total = op.endTime - op.startTime;
                const percent = Math.min(100, Math.floor((elapsed / total) * 100));
                const timeLeft = remaining < 3600000 ? Math.floor(remaining/60000) + ' دقیقه' : Math.floor(remaining/3600000) + ' ساعت';
                
                let bar = '';
                for (let i = 0; i < 10; i++) bar += i < Math.floor(percent/10) ? '█' : '░';
                
                await bot.editMessageText(
                    `🧪 *تحقیق در جریانه...*\n\n${bar} ${percent}٪\n⏰ ${timeLeft} دیگه`,
                    { chat_id: chatId, message_id: msgId, parse_mode: 'Markdown',
                      reply_markup: { inline_keyboard: [[{ text: '📊 بروزرسانی', callback_data: `research_status_${opId}` }], [{ text: '🔙 برگشت', callback_data: 'menu_research' }]] } }
                );
                return bot.answerCallbackQuery(query.id);
            }
            
        } catch (e) {
            console.log('Research error:', e.message);
            await bot.answerCallbackQuery(query.id, { text: '❌ خطا!', show_alert: true });
        }
    });
}

module.exports = { setupResearch, getPowerBonus, getResearchData };