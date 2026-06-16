const { bot, player, mainMenu, sendPhoto, sendAnimation } = require('./core');

function setupEmpireHandlers() {

    const queenGifs = {
        seduce: ['CgACAgQAAxkBAAEqizRqK5tQDWMju5J1opd9ARWgEUM-3wACSh4AAtsXWVHb8Y_gWt8KWjwE'],
        selfPleasure: [
            'CgACAgQAAxkBAAEqiz5qK5tQLFGjpFqUUl4F2Eyt3i3-hAACmyAAAtsXYVFmxw_72sVrUjwE',
            'CgACAgQAAxkBAAEqizxqK5tQuu9mwxl34b1DCZ2b-CGzuQACmSAAAtsXYVFx2uGHtZ-3ODwE'
        ],
        frontOrgy: [
            'CgACAgQAAxkBAAEqizNqK5tQo3MZl5qpQMAniEvFyoQzjQACSB4AAtsXWVFWTTWsKJ0KwjwE',
            'CgACAgQAAxkBAAEqizVqK5tQV27uYcgVfQFS1NaNvfbhkwACSx4AAtsXWVEJHGsvTgVPxTwE',
            'CgACAgQAAxkBAAEqizZqK5tQ2MUpZ3_-a3JGHq53SYvBiQACTR4AAtsXWVE0l0JamxoGpTwE'
        ],
        frontFinish: 'CgACAgQAAxkBAAEqizhqK5tQ8bt9QBjlpS1IdtRWL6RhNwACUR4AAtsXWVEZM8R3t-jRNjwE',
        oralOrgy: ['CgACAgQAAxkBAAEqizdqK5tQFq3M3UMdEyeCp9-WRT422gACTx4AAtsXWVFB23281nm0MTwE'],
        backOrgy: 'CgACAgQAAxkBAAEqi1RqK5tmoag95FcRWntCnJ-FlHeQWgACRh4AAtsXWVFc_ON67rljIjwE'
    };

    bot.on('callback_query', async (query) => {
        const chatId = query.message.chat.id;
        const msgId = query.message.message_id;
        const data = query.data;
        const p = player.getPlayer(chatId);

        if (!p) return;
        if (!data) return;
        
        // فقط callbackهای امپراطوری
        if (data.startsWith('battle_') || data.startsWith('shop_') || data.startsWith('craft_') || 
            data.startsWith('prison_') || data.startsWith('house_') || data.startsWith('pet_') ||
            data.startsWith('lootbox_') || data.startsWith('quest_') || data.startsWith('admin_') ||
            data.startsWith('bm_') || data.startsWith('chamber_') || data.startsWith('audience_')) return;

        try {
            const del = async () => { try { await bot.deleteMessage(chatId, msgId); } catch(e) {} };
            const send = (text, kb) => bot.sendMessage(chatId, text, { parse_mode: 'Markdown', ...(kb || mainMenu()) });

            // =============================================
            // 🔙 برگشت
            // =============================================
            if (data === 'back_to_main') {
                await del();
                const time = require('../player').getTimeOfDay(); p.timeOfDay = time;
                const loc = require('../config').images.locations[p.location] || require('../config').images.locations.village;
                await send(`🏛️ *بقای باستانی*\n\n✨ ${p.name} | 📍 ${loc.emoji} ${loc.name}\n${time.name} | 📅 روز ${p.gameDay || 1}/۷ | 🏆 ${p.score || 0} امتیاز`, mainMenu());
                return bot.answerCallbackQuery(query.id);
            }

            if (data === 'empire_back') {
                const { formatEmpire, getEmpireKeyboard } = require('../empire');
                await del();
                await send(formatEmpire(p), getEmpireKeyboard(p));
                return bot.answerCallbackQuery(query.id);
            }

            // =============================================
            // 👑 منوی اصلی امپراطوری
            // =============================================
            if (data === 'empire_income') {
                const { collectEmpireIncome, formatEmpire, getEmpireKeyboard } = require('../empire');
                const r = collectEmpireIncome(p);
                await del();
                await send(formatEmpire(p), getEmpireKeyboard(p));
                return bot.answerCallbackQuery(query.id, { text: r.success ? '✅ درآمد جمع شد!' : '⏰', show_alert: true });
            }

            if (data === 'empire_dynasty') {
                require('./core').empireState[chatId] = { action: 'setDynasty', msgId };
                await bot.sendMessage(chatId, '📝 *اسم سلسله جدید رو تایپ کن:*', { parse_mode: 'Markdown' });
                return bot.answerCallbackQuery(query.id);
            }

            // =============================================
            // 📋 انتصاب (سمت‌ها)
            // =============================================
            if (data === 'empire_roles_menu') {
                const { empireRoles } = require('../empire');
                const btns = [];
                for (let key in empireRoles) {
                    const role = empireRoles[key];
                    if (p.empire && p.empire.level >= role.minLevel) {
                        const assigned = p.empire.roles && p.empire.roles[key];
                        if (assigned) {
                            btns.push([{ text: `✅ ${role.emoji} ${role.name}: ${assigned.childName || 'منصوب'}`, callback_data: 'none' }]);
                        } else {
                            let req = '';
                            if (role.needsHeir) req = ' (ولیعهد)';
                            else if (role.childClass) req = ` (${role.childClass})`;
                            btns.push([{ text: `${role.emoji} ${role.name}${req}`, callback_data: `empire_assign_${key}` }]);
                        }
                    }
                }
                btns.push([{ text: '🔙 برگشت', callback_data: 'empire_back' }]);
                await del();
                await send('📋 *انتصاب سمت‌ها*\n\nسمت خالی رو انتخاب کن:', { reply_markup: { inline_keyboard: btns } });
                return bot.answerCallbackQuery(query.id);
            }

            if (data.startsWith('empire_assign_')) {
                const roleKey = data.replace('empire_assign_', '');
                const alive = p.children?.filter(c => c.isAlive) || [];
                if (alive.length === 0) return bot.answerCallbackQuery(query.id, { text: '❌ فرزندی نداری!', show_alert: true });
                
                const btns = alive.map(child => [{ 
                    text: `${child.emoji} ${child.name} | ${child.classEmoji} ${child.className}`, 
                    callback_data: `empire_assign_do_${roleKey}_${child.id}` 
                }]);
                btns.push([{ text: '🔙 برگشت', callback_data: 'empire_roles_menu' }]);
                
                await del();
                await send('👶 *کدوم فرزند رو منصوب کنی؟*', { reply_markup: { inline_keyboard: btns } });
                return bot.answerCallbackQuery(query.id);
            }

            if (data.startsWith('empire_assign_do_')) {
                const parts = data.replace('empire_assign_do_', '').split('_');
                const roleKey = parts[0];
                const childId = parts.slice(1).join('_');
                const { assignRole, formatEmpire, getEmpireKeyboard } = require('../empire');
                const result = assignRole(p, roleKey, childId);
                await del();
                await send(formatEmpire(p), getEmpireKeyboard(p));
                return bot.answerCallbackQuery(query.id, { text: result.success ? '✅ منصوب شد!' : result.message?.substring(0, 80), show_alert: true });
            }

            // =============================================
            // 🏗️ احداث (عجایب)
            // =============================================
            if (data === 'empire_wonders_menu') {
                const { wonders } = require('../empire');
                const btns = [];
                for (let key in wonders) {
                    const w = wonders[key];
                    const built = p.empire.wonders && p.empire.wonders.includes(key);
                    const canBuild = p.empire.level >= w.minLevel && !built;
                    if (canBuild) {
                        btns.push([{ text: `${w.emoji} ${w.name} - ${w.description}`, callback_data: `empire_wonder_${key}` }]);
                    } else if (built) {
                        btns.push([{ text: `✅ ${w.emoji} ${w.name}`, callback_data: 'none' }]);
                    }
                }
                btns.push([{ text: '🔙 برگشت', callback_data: 'empire_back' }]);
                await del();
                await send('🏗️ *احداث عجایب:*', { reply_markup: { inline_keyboard: btns } });
                return bot.answerCallbackQuery(query.id);
            }

            if (data.startsWith('empire_wonder_')) {
                const key = data.replace('empire_wonder_', '');
                const { buildWonder, formatEmpire, getEmpireKeyboard } = require('../empire');
                const result = buildWonder(p, key);
                await del();
                await send(formatEmpire(p), getEmpireKeyboard(p));
                return bot.answerCallbackQuery(query.id, { text: result.success ? '✅ ساخته شد!' : result.message?.substring(0, 60), show_alert: true });
            }

            // =============================================
            // 👶 فرزندان
            // =============================================
            if (data === 'children_menu') {
                const { formatChildren, getChildrenKeyboard } = require('../offspring');
                await del();
                await send(formatChildren(p), getChildrenKeyboard(p));
                return bot.answerCallbackQuery(query.id);
            }

            if (data.startsWith('child_feed_')) {
                const childId = data.replace('child_feed_', '');
                const { feedChild, getChildrenKeyboard } = require('../offspring');
                const result = feedChild(p, childId);
                console.log('🍼 feedChild:', result);
                await del();
                await send(result.message, getChildrenKeyboard(p));
                return bot.answerCallbackQuery(query.id, { text: result.success ? '✅' : '❌', show_alert: true });
            }

            if (data.startsWith('child_train_')) {
                const childId = data.replace('child_train_', '');
                const { trainChild, getChildrenKeyboard } = require('../offspring');
                const result = trainChild(p, childId);
                console.log('📚 trainChild:', result);
                await del();
                await send(result.message, getChildrenKeyboard(p));
                return bot.answerCallbackQuery(query.id, { text: result.success ? '✅' : '❌', show_alert: true });
            }

            if (data.startsWith('child_heir_')) {
                const childId = data.replace('child_heir_', '');
                const { assignHeir, getChildrenKeyboard } = require('../offspring');
                const result = assignHeir(p, childId);
                console.log('👑 assignHeir:', result);
                await del();
                await send(result.message, getChildrenKeyboard(p));
                return bot.answerCallbackQuery(query.id, { text: result.success ? '✅' : '❌', show_alert: true });
            }

            if (data === 'child_tournament') {
                const { holdTournament, getChildrenKeyboard } = require('../offspring');
                const result = holdTournament(p);
                console.log('⚔️ tournament:', result);
                await del();
                await send(result.message, getChildrenKeyboard(p));
                return bot.answerCallbackQuery(query.id, { text: result.success ? '🏆' : '❌', show_alert: true });
            }

        } catch (e) {
            console.log('❌ Empire handler error:', e.message);
            try { await bot.answerCallbackQuery(query.id, { text: '❌ خطا!', show_alert: true }); } catch(e2) {}
        }
    });
}

module.exports = { setupEmpireHandlers };

// =============================================
// 👸 حرمسرا
// =============================================
if (data === 'harem_menu') {
    const { formatHarem, getHaremKeyboard } = require('../queenHarem');
    await del();
    await send(formatHarem(p), getHaremKeyboard(p));
    return bot.answerCallbackQuery(query.id);
}

if (data.startsWith('harem_queen_')) {
    const queenId = data.replace('harem_queen_', '');
    const queen = p.harem?.queens?.find(q => q.id === queenId);
    if (!queen) return bot.answerCallbackQuery(query.id, { text: '❌ ملکه پیدا نشد!' });
    
    require('./core').haremState[chatId] = { queenId: queen.id };
    const { getQueenKeyboard } = require('../queenHarem');
    
    let info = `👸 ${queen.emoji} *${queen.name}*\n`;
    info += `👑 ${queen.rank || 'کنیز'} | 💕 ${queen.points || 0}\n`;
    info += `😊 روحیه: ${queen.mood || 50}% | ❤️ سلامت: ${queen.health || 100}%\n`;
    
    const preg = queen.pregnancies?.find(p => !p.born && Date.now() < p.dueDate);
    if (preg) {
        const remaining = Math.max(0, Math.ceil((preg.dueDate - Date.now()) / (60 * 60 * 1000)));
        info += `🤰 باردار: ${remaining} ساعت مونده\n`;
    }
    if (queen.children && queen.children.length > 0) {
        info += `👶 فرزندان: ${queen.children.length} نفر\n`;
    }
    
    await del();
    await send(info, getQueenKeyboard(p, queen.id));
    return bot.answerCallbackQuery(query.id);
}

if (data === 'harem_pregnancy_new') {
    const queens = p.harem?.queens;
    if (!queens?.length) return bot.answerCallbackQuery(query.id, { text: '❌ ملکه‌ای نیست!', show_alert: true });
    
    const btns = queens.map(q => {
        const preg = q.pregnancies?.find(p => !p.born && Date.now() < p.dueDate);
        return [{ text: `${preg ? '🤰' : '✅'} ${q.emoji} ${q.name}`, callback_data: `harem_pregnancy_select_${q.id}` }];
    });
    btns.push([{ text: '🔙 برگشت', callback_data: 'harem_menu' }]);
    
    await del();
    await send('👸 *انتخاب ملکه برای بارداری:*', { reply_markup: { inline_keyboard: btns } });
    return bot.answerCallbackQuery(query.id);
}

if (data.startsWith('harem_pregnancy_select_')) {
    const queenId = data.replace('harem_pregnancy_select_', '');
    require('./core').haremState[chatId] = { queenId, action: 'startPregnancy' };
    const { getPregnancySpeedKeyboard } = require('../queenHarem');
    await del();
    await send('⏰ *سرعت بارداری:*', getPregnancySpeedKeyboard());
    return bot.answerCallbackQuery(query.id);
}

if (data === 'harem_salary') {
    const { paySalaries, formatHarem, getHaremKeyboard } = require('../queenHarem');
    const r = paySalaries(p);
    await del();
    await send(formatHarem(p), getHaremKeyboard(p));
    return bot.answerCallbackQuery(query.id, { text: r.success ? '✅ حقوق پرداخت شد!' : r.message?.substring(0, 80), show_alert: true });
}

if (data === 'harem_care_all') {
    const { careAllQueens, formatHarem, getHaremKeyboard } = require('../queenHarem');
    careAllQueens(p);
    await del();
    await send(formatHarem(p), getHaremKeyboard(p));
    return bot.answerCallbackQuery(query.id, { text: '✅ همه رسیدگی شدن!', show_alert: true });
}

if (data === 'harem_festival') {
    const { getCelebrationKeyboard } = require('../queenHarem');
    await del();
    await send('🎉 *انتخاب جشن:*', getCelebrationKeyboard());
    return bot.answerCallbackQuery(query.id);
}

if (data.startsWith('harem_festival_')) {
    const key = data.replace('harem_festival_', '');
    const { celebrateFestival, formatHarem, getHaremKeyboard } = require('../queenHarem');
    celebrateFestival(p, key);
    await del();
    await send(formatHarem(p), getHaremKeyboard(p));
    return bot.answerCallbackQuery(query.id, { text: '✅ جشن برگزار شد!', show_alert: true });
}

// =============================================
// 👸 ملکه - عملیات
// =============================================
if (data === 'queen_care') {
    const st = require('./core').haremState[chatId];
    if (!st?.queenId) return bot.answerCallbackQuery(query.id, { text: '❌ ملکه انتخاب نشده!' });
    
    const { queenCare, getQueenKeyboard } = require('../queenHarem');
    queenCare(p, st.queenId);
    const q = p.harem?.queens.find(q => q.id === st.queenId);
    if (!q) return bot.answerCallbackQuery(query.id, { text: '❌ ملکه پیدا نشد!' });
    
    await del();
    await send(`${q.emoji} *${q.name}*\n😊 روحیه: ${q.mood}%\n❤️ سلامت: ${q.health}%`, getQueenKeyboard(p, st.queenId));
    return bot.answerCallbackQuery(query.id, { text: '✅ رسیدگی شد!' });
}

if (data === 'queen_pregnancy') {
    const st = require('./core').haremState[chatId];
    if (!st?.queenId) return bot.answerCallbackQuery(query.id, { text: '❌ ملکه انتخاب نشده!' });
    st.action = 'startPregnancy';
    const { getPregnancySpeedKeyboard } = require('../queenHarem');
    await del();
    await send('⏰ *سرعت بارداری:*', getPregnancySpeedKeyboard());
    return bot.answerCallbackQuery(query.id);
}

if (data === 'queen_speed_pregnancy') {
    const st = require('./core').haremState[chatId];
    const queen = p.harem?.queens.find(q => q.id === st?.queenId);
    const preg = queen?.pregnancies?.find(p => !p.born && Date.now() < p.dueDate);
    if (!preg) return bot.answerCallbackQuery(query.id, { text: '❌ باردار نیست!' });
    st.action = 'speedPregnancy';
    st.pregnancyId = preg.id;
    const { getPregnancySpeedKeyboard } = require('../queenHarem');
    await del();
    await send('⏰ *تسریع بارداری:*', getPregnancySpeedKeyboard());
    return bot.answerCallbackQuery(query.id);
}

if (data.startsWith('pregnancy_speed_')) {
    const speedKey = data.replace('pregnancy_speed_', '');
    const st = require('./core').haremState[chatId];
    if (!st?.queenId) return bot.answerCallbackQuery(query.id);
    
    const { startPregnancy, speedUpPregnancy, getQueenKeyboard } = require('../queenHarem');
    const queen = p.harem?.queens.find(q => q.id === st.queenId);
    let result;
    if (st.action === 'startPregnancy') result = startPregnancy(p, st.queenId, speedKey);
    else result = speedUpPregnancy(p, st.queenId, st.pregnancyId, speedKey);
    
    await del();
    await send(`${queen.emoji} *${queen.name}*\n${result.message}`, getQueenKeyboard(p, st.queenId));
    return bot.answerCallbackQuery(query.id, { text: '✅ انجام شد!' });
}

// =============================================
// 👸 ملکه - خریدها
// =============================================
if (data === 'queen_dress') {
    const st = require('./core').haremState[chatId];
    if (!st?.queenId) return bot.answerCallbackQuery(query.id, { text: '❌ ملکه انتخاب نشده!' });
    const { getDressKeyboard } = require('../queenHarem');
    await del();
    await send('👗 *خرید لباس:*', getDressKeyboard());
    return bot.answerCallbackQuery(query.id);
}

if (data.startsWith('dress_buy_')) {
    const key = data.replace('dress_buy_', '');
    const st = require('./core').haremState[chatId];
    if (!st?.queenId) return bot.answerCallbackQuery(query.id);
    
    require('../queenHarem').buyDress(p, st.queenId, key);
    const q = p.harem?.queens.find(q => q.id === st.queenId);
    const { getQueenKeyboard } = require('../queenHarem');
    await del();
    await send(`${q.emoji} *${q.name}*\n✅ لباس خریداری شد!`, getQueenKeyboard(p, st.queenId));
    return bot.answerCallbackQuery(query.id, { text: '✅ خرید شد!' });
}

if (data === 'queen_jewelry') {
    const st = require('./core').haremState[chatId];
    if (!st?.queenId) return bot.answerCallbackQuery(query.id, { text: '❌ ملکه انتخاب نشده!' });
    const { getJewelryKeyboard } = require('../queenHarem');
    await del();
    await send('💍 *خرید جواهر:*', getJewelryKeyboard());
    return bot.answerCallbackQuery(query.id);
}

if (data.startsWith('jewelry_buy_')) {
    const key = data.replace('jewelry_buy_', '');
    const st = require('./core').haremState[chatId];
    if (!st?.queenId) return bot.answerCallbackQuery(query.id);
    
    require('../queenHarem').buyJewelry(p, st.queenId, key);
    const q = p.harem?.queens.find(q => q.id === st.queenId);
    const { getQueenKeyboard } = require('../queenHarem');
    await del();
    await send(`${q.emoji} *${q.name}*\n✅ جواهر خریداری شد!`, getQueenKeyboard(p, st.queenId));
    return bot.answerCallbackQuery(query.id, { text: '✅ خرید شد!' });
}

if (data === 'queen_room') {
    const st = require('./core').haremState[chatId];
    if (!st?.queenId) return bot.answerCallbackQuery(query.id, { text: '❌ ملکه انتخاب نشده!' });
    const { getRoomKeyboard } = require('../queenHarem');
    await del();
    await send('🏠 *ارتقای اتاق:*', getRoomKeyboard());
    return bot.answerCallbackQuery(query.id);
}

if (data.startsWith('room_upgrade_')) {
    const key = data.replace('room_upgrade_', '');
    const st = require('./core').haremState[chatId];
    if (!st?.queenId) return bot.answerCallbackQuery(query.id);
    
    require('../queenHarem').upgradeRoom(p, st.queenId, key);
    const q = p.harem?.queens.find(q => q.id === st.queenId);
    const { getQueenKeyboard } = require('../queenHarem');
    await del();
    await send(`${q.emoji} *${q.name}*\n✅ اتاق ارتقا یافت!`, getQueenKeyboard(p, st.queenId));
    return bot.answerCallbackQuery(query.id, { text: '✅ ارتقا یافت!' });
}

if (data === 'queen_servant') {
    const st = require('./core').haremState[chatId];
    if (!st?.queenId) return bot.answerCallbackQuery(query.id, { text: '❌ ملکه انتخاب نشده!' });
    const { getServantKeyboard } = require('../queenHarem');
    await del();
    await send('🧹 *استخدام خدمتکار:*', getServantKeyboard());
    return bot.answerCallbackQuery(query.id);
}

if (data.startsWith('servant_hire_')) {
    const key = data.replace('servant_hire_', '');
    const st = require('./core').haremState[chatId];
    if (!st?.queenId) return bot.answerCallbackQuery(query.id);
    
    require('../queenHarem').hireServant(p, st.queenId, key);
    const q = p.harem?.queens.find(q => q.id === st.queenId);
    const { getQueenKeyboard } = require('../queenHarem');
    await del();
    await send(`${q.emoji} *${q.name}*\n✅ خدمتکار استخدام شد!`, getQueenKeyboard(p, st.queenId));
    return bot.answerCallbackQuery(query.id, { text: '✅ استخدام شد!' });
}

if (data === 'queen_upbringing') {
    const st = require('./core').haremState[chatId];
    if (!st?.queenId) return bot.answerCallbackQuery(query.id, { text: '❌ ملکه انتخاب نشده!' });
    const { getUpbringingKeyboard } = require('../queenHarem');
    await del();
    await send('📚 *سبک تربیت:*', getUpbringingKeyboard());
    return bot.answerCallbackQuery(query.id);
}

if (data.startsWith('upbringing_set_')) {
    const key = data.replace('upbringing_set_', '');
    const st = require('./core').haremState[chatId];
    if (!st?.queenId) return bot.answerCallbackQuery(query.id);
    
    require('../queenHarem').setChildUpbringing(p, st.queenId, key);
    const q = p.harem?.queens.find(q => q.id === st.queenId);
    const { getQueenKeyboard } = require('../queenHarem');
    await del();
    await send(`${q.emoji} *${q.name}*\n✅ سبک تربیت تنظیم شد!`, getQueenKeyboard(p, st.queenId));
    return bot.answerCallbackQuery(query.id, { text: '✅ تنظیم شد!' });
}

if (data === 'queen_intrigue') {
    const st = require('./core').haremState[chatId];
    if (!st?.queenId) return bot.answerCallbackQuery(query.id, { text: '❌ ملکه انتخاب نشده!' });
    const { getIntrigueKeyboard } = require('../queenHarem');
    await del();
    await send('🐍 *دسیسه:*', getIntrigueKeyboard());
    return bot.answerCallbackQuery(query.id);
}

if (data.startsWith('intrigue_')) {
    const st = require('./core').haremState[chatId];
    if (!st?.queenId) return bot.answerCallbackQuery(query.id);
    st.intrigueKey = data.replace('intrigue_', '');
    
    const btns = p.harem.queens.filter(q => q.id !== st.queenId).map(q => [{ text: `${q.emoji} ${q.name}`, callback_data: `intrigue_target_${q.id}` }]);
    btns.push([{ text: '🔙 برگشت', callback_data: 'harem_menu' }]);
    await del();
    await send('🎯 *هدف دسیسه:*', { reply_markup: { inline_keyboard: btns } });
    return bot.answerCallbackQuery(query.id);
}

if (data.startsWith('intrigue_target_')) {
    const st = require('./core').haremState[chatId];
    const result = require('../queenHarem').performIntrigue(p, st.queenId, data.replace('intrigue_target_', ''), st.intrigueKey);
    const { getQueenKeyboard } = require('../queenHarem');
    await del();
    await send(result.message, getQueenKeyboard(p, st.queenId));
    return bot.answerCallbackQuery(query.id, { text: '✅ انجام شد!', show_alert: true });
}

if (data === 'queen_diary') {
    const { getRandomDiaryEntry, getQueenKeyboard } = require('../queenHarem');
    const entry = getRandomDiaryEntry(p);
    const st = require('./core').haremState[chatId];
    await del();
    await send(entry ? `📔 ${entry.queen.emoji} ${entry.queen.name}: "${entry.entry}"` : '📔 خالیه', getQueenKeyboard(p, st?.queenId));
    return bot.answerCallbackQuery(query.id);
}

if (data === 'queen_remove') {
    const st = require('./core').haremState[chatId];
    if (!st?.queenId) return bot.answerCallbackQuery(query.id);
    
    require('../queenHarem').removeQueenFromHarem(p, st.queenId);
    delete st.queenId;
    const { formatHarem, getHaremKeyboard } = require('../queenHarem');
    await del();
    await send(formatHarem(p), getHaremKeyboard(p));
    return bot.answerCallbackQuery(query.id, { text: '✅ اخراج شد!' });
}

// =============================================
// 🔥 هم‌آغوشی ملکه
// =============================================
if (data === 'queen_orgy') {
    const st = require('./core').haremState[chatId];
    if (!st?.queenId) return bot.answerCallbackQuery(query.id, { text: '❌ ملکه انتخاب نشده!' });
    const queen = p.harem?.queens.find(q => q.id === st.queenId);
    if (!queen) return bot.answerCallbackQuery(query.id, { text: '❌ ملکه پیدا نشد!' });

    const gif = queenGifs.seduce[0];
    const condomCount = p.inventory?.condom || 0;
    const dialogs = [
        `👸 *${queen.name}:* "شاهم... امشب می‌خوام پیشت باشم... کاندوم داری؟"`,
        `👸 *${queen.name}:* "ببین چقدر داغم... کاندوم داری یا بی‌غلاف می‌خوای؟"`,
        `👸 *${queen.name}:* "این تن واسه توئه... بگو کاندوم داری یا نه؟"`
    ];
    const dialog = dialogs[Math.floor(Math.random() * dialogs.length)];
    let msg = `${dialog}\n\n🎈 کاندوم: ${condomCount} عدد`;
    const btns = [];
    if (condomCount > 0) btns.push([{ text: '🎈 با کاندوم', callback_data: `orgy_condom_${queen.npcId}` }]);
    btns.push([{ text: '🔥 بدون کاندوم', callback_data: `orgy_nocondom_${queen.npcId}` }]);
    btns.push([{ text: '🔙 برگشت', callback_data: `harem_queen_${queen.id}` }]);

    await del();
    await sendAnimation(chatId, gif, msg, { reply_markup: { inline_keyboard: btns } });
    return bot.answerCallbackQuery(query.id);
}

if (data.startsWith('orgy_condom_') || data.startsWith('orgy_nocondom_')) {
    const parts = data.split('_');
    const useCondom = parts[1] === 'condom';
    const npcId = parts[2];
    const queen = p.harem?.queens.find(q => q.npcId === npcId);
    if (!queen) return bot.answerCallbackQuery(query.id, { text: '❌ ملکه پیدا نشد!' });

    const st = require('./core').haremState[chatId];
    st.orgyCondom = useCondom;
    const gif = queenGifs.selfPleasure[Math.floor(Math.random() * queenGifs.selfPleasure.length)];
    const txt = useCondom ? '🎈 *با کاندوم*' : '🔥 *بدون کاندوم*';
    const btns = [
        [{ text: '🍑 از جلو', callback_data: `orgy_front_${queen.npcId}_${useCondom ? '1' : '0'}` }],
        [{ text: '🍑 از عقب', callback_data: `orgy_back_${queen.npcId}_${useCondom ? '1' : '0'}` }],
        [{ text: '👄 دهنی', callback_data: `orgy_mouth_${queen.npcId}_${useCondom ? '1' : '0'}` }],
        [{ text: '🔙 برگشت', callback_data: `harem_queen_${queen.id}` }]
    ];

    await del();
    await sendAnimation(chatId, gif, txt, { reply_markup: { inline_keyboard: btns } });
    return bot.answerCallbackQuery(query.id);
}

if (data.startsWith('orgy_front_') || data.startsWith('orgy_back_') || data.startsWith('orgy_mouth_')) {
    const parts = data.split('_');
    const pos = parts[1];
    const npcId = parts[2];
    const useCondom = parts[3] === '1';
    const queen = p.harem?.queens.find(q => q.npcId === npcId);
    if (!queen) return bot.answerCallbackQuery(query.id, { text: '❌ ملکه پیدا نشد!' });

    if (useCondom) p.inventory.condom = Math.max(0, (p.inventory.condom || 0) - 1);
    if (!p.prisonRelations) p.prisonRelations = {};
    const relBonus = pos === 'back' ? 20 : pos === 'front' ? 15 : 10;
    const moodBonus = pos === 'back' ? 25 : pos === 'front' ? 20 : 30;
    p.prisonRelations[queen.npcId] = Math.min(100, (p.prisonRelations[queen.npcId] || 50) + relBonus);
    queen.mood = Math.min(100, (queen.mood || 50) + moodBonus);

    const { positionImages } = require('./core');
    let gif, image, title, dialog;

    if (pos === 'front') {
        gif = queenGifs.frontOrgy[Math.floor(Math.random() * queenGifs.frontOrgy.length)];
        image = positionImages.front?.[Math.floor(Math.random() * positionImages.front.length)];
        title = '🍑 *از جلو*';
        dialog = `👸 ${queen.name}: "اوووه... عمیق‌تر... همه شو بریز تو کسم..."`;
        if (!useCondom && Math.random() < 0.80) {
            try { require('../queenHarem').startPregnancy(p, queen.id, 'now'); } catch(e) {}
            await del();
            await sendAnimation(chatId, queenGifs.frontFinish, '💦 *آب ریختن...*', { reply_markup: { inline_keyboard: [] } });
            await new Promise(r => setTimeout(r, 2000));
            dialog += '\n🤰 *باردار شد!*';
        }
    } else if (pos === 'back') {
        gif = queenGifs.backOrgy;
        image = positionImages.back?.[Math.floor(Math.random() * positionImages.back.length)];
        title = '🍑 *از عقب*';
        dialog = `👸 ${queen.name}: "آخ... چه کونی داری... محکم‌تر..."`;
    } else {
        gif = queenGifs.oralOrgy[0];
        image = positionImages.oral?.[Math.floor(Math.random() * positionImages.oral.length)];
        title = '👄 *دهنی*';
        const hpLoss = Math.floor((p.maxHp || 100) * 0.20);
        p.hp = Math.max(10, (p.hp || 100) - hpLoss);
        dialog = `👸 ${queen.name}: "ممم... همه شو خوردم..."\n💔 -${hpLoss} ❤️`;
    }

    await del();
    await sendAnimation(chatId, gif, `${title}\n\n${dialog}`, { reply_markup: { inline_keyboard: [] } });
    await new Promise(r => setTimeout(r, 2000));

    let resultMsg = `${title}\n\n${dialog}\n\n💕 +${relBonus} | 😊 +${moodBonus}`;
    if (useCondom) resultMsg += `\n🎈 کاندوم -۱ (${p.inventory.condom})`;
    
    const { getQueenKeyboard } = require('../queenHarem');
    if (image) await sendPhoto(chatId, image, resultMsg, getQueenKeyboard(p, queen.id));
    else await send(chatId, resultMsg, getQueenKeyboard(p, queen.id));
    return bot.answerCallbackQuery(query.id);
}

            // =============================================
            // 👥 مردم
            // =============================================
            if (data === 'people_menu') {
                const { initPeople, formatPeople, getPeopleKeyboard } = require('../people');
                initPeople(p);
                await del();
                await send(formatPeople(p), getPeopleKeyboard(p));
                return bot.answerCallbackQuery(query.id);
            }

            if (data === 'people_tax') {
                const { initPeople, collectTaxes, formatPeople, getPeopleKeyboard } = require('../people');
                initPeople(p);
                const result = collectTaxes(p);
                await del();
                await send(formatPeople(p), getPeopleKeyboard(p));
                return bot.answerCallbackQuery(query.id, { text: result.success ? '✅ مالیات جمع شد!' : result.message?.substring(0, 80), show_alert: true });
            }

            if (data === 'people_lands') {
                const { getLandKeyboard } = require('../people');
                await del();
                await send('🌾 *زمین‌های کشاورزی:*', getLandKeyboard());
                return bot.answerCallbackQuery(query.id);
            }

            if (data.startsWith('people_land_buy_')) {
                const landType = data.replace('people_land_buy_', '');
                const { initPeople, assignLand, getLandKeyboard } = require('../people');
                initPeople(p);
                const result = assignLand(p, landType, 1);
                await del();
                await send(result.message, getLandKeyboard());
                return bot.answerCallbackQuery(query.id, { text: result.success ? '✅ خریداری شد!' : '❌', show_alert: true });
            }

            if (data === 'people_land_water_all') {
                const { initPeople, waterLand, getLandKeyboard } = require('../people');
                initPeople(p);
                let msg = '';
                if (p.people?.lands) {
                    for (let land of p.people.lands) {
                        const r = waterLand(p, land.id);
                        msg += r.message + '\n';
                    }
                }
                await del();
                await send(msg || '✅ همه آبیاری شدن!', getLandKeyboard());
                return bot.answerCallbackQuery(query.id);
            }

            if (data === 'people_land_harvest_all') {
                const { initPeople, harvestAllLands, getLandKeyboard } = require('../people');
                initPeople(p);
                const result = harvestAllLands(p);
                await del();
                await send(result.message, getLandKeyboard());
                return bot.answerCallbackQuery(query.id, { text: '✅ برداشت شد!', show_alert: true });
            }

            if (data === 'people_buildings') {
                const { initPeople, getBuildingKeyboard } = require('../people');
                initPeople(p);
                await del();
                await send('🏗️ *ساختمان‌های عمومی:*', getBuildingKeyboard(p));
                return bot.answerCallbackQuery(query.id);
            }

            if (data.startsWith('people_building_')) {
                const buildingKey = data.replace('people_building_', '');
                const { initPeople, buildPublicBuilding, getBuildingKeyboard } = require('../people');
                initPeople(p);
                const result = buildPublicBuilding(p, buildingKey);
                await del();
                await send(result.message, getBuildingKeyboard(p));
                return bot.answerCallbackQuery(query.id, { text: result.success ? '✅ ساخته شد!' : result.message?.substring(0, 60), show_alert: true });
            }

            if (data === 'people_decisions') {
                const { getDecisionKeyboard } = require('../people');
                await del();
                await send('📜 *تصمیم‌های مدیریتی:*', getDecisionKeyboard());
                return bot.answerCallbackQuery(query.id);
            }

            if (data === 'people_festival') {
                const { initPeople, makeDecision, formatPeople, getPeopleKeyboard } = require('../people');
                initPeople(p);
                makeDecision(p, 'festival', 0);
                await del();
                await send(formatPeople(p), getPeopleKeyboard(p));
                return bot.answerCallbackQuery(query.id, { text: '✅ جشن برگزار شد!' });
            }

            if (data === 'people_food') {
                const { initPeople, makeDecision, formatPeople, getPeopleKeyboard } = require('../people');
                initPeople(p);
                makeDecision(p, 'foodAid', 0);
                await del();
                await send(formatPeople(p), getPeopleKeyboard(p));
                return bot.answerCallbackQuery(query.id, { text: '✅ کمک غذایی ارسال شد!' });
            }

            if (data === 'people_draft') {
                const { initPeople, makeDecision, formatPeople, getPeopleKeyboard } = require('../people');
                initPeople(p);
                makeDecision(p, 'conscription', 0);
                await del();
                await send(formatPeople(p), getPeopleKeyboard(p));
                return bot.answerCallbackQuery(query.id, { text: '✅ سربازگیری انجام شد!' });
            }

            if (data === 'people_taxbreak') {
                const { initPeople, makeDecision, formatPeople, getPeopleKeyboard } = require('../people');
                initPeople(p);
                makeDecision(p, 'taxBreak', 0);
                await del();
                await send(formatPeople(p), getPeopleKeyboard(p));
                return bot.answerCallbackQuery(query.id, { text: '✅ مالیات بخشیده شد!' });
            }

            // =============================================
            // 🏛️ دربار
            // =============================================
            if (data === 'court_menu') {
                const { formatCourt, getCourtKeyboard } = require('../court');
                await del();
                await send(formatCourt(p), getCourtKeyboard(p));
                return bot.answerCallbackQuery(query.id);
            }

            if (data === 'court_status') {
                const { formatCourt, getCourtKeyboard } = require('../court');
                await del();
                await send(formatCourt(p), getCourtKeyboard(p));
                return bot.answerCallbackQuery(query.id);
            }

            if (data === 'court_prisoners') {
                const { managePrisoners, getCourtKeyboard } = require('../court');
                const result = managePrisoners(p, 'list');
                await del();
                await send(result.message, getCourtKeyboard(p));
                return bot.answerCallbackQuery(query.id);
            }

            if (data.startsWith('court_execute_')) {
                const idx = parseInt(data.replace('court_execute_', ''));
                const { managePrisoners, formatCourt, getCourtKeyboard } = require('../court');
                managePrisoners(p, 'execute', idx);
                await del();
                await send(formatCourt(p), getCourtKeyboard(p));
                return bot.answerCallbackQuery(query.id, { text: '✅ اعدام شد!' });
            }

            if (data.startsWith('court_release_')) {
                const idx = parseInt(data.replace('court_release_', ''));
                const { managePrisoners, formatCourt, getCourtKeyboard } = require('../court');
                managePrisoners(p, 'release', idx);
                await del();
                await send(formatCourt(p), getCourtKeyboard(p));
                return bot.answerCallbackQuery(query.id, { text: '✅ آزاد شد!' });
            }

            if (data === 'court_intrigue_menu') {
                const { getIntrigueKeyboard } = require('../court');
                await del();
                await send('🐍 *دسیسه‌های درباری:*', getIntrigueKeyboard(p));
                return bot.answerCallbackQuery(query.id);
            }

            if (data.startsWith('court_intrigue_')) {
                require('./core').courtState[chatId] = { action: 'intrigue', intrigueKey: data.replace('court_intrigue_', '') };
                await bot.sendMessage(chatId, '🎯 *آیدی هدف و مجری رو تایپ کن:*\n`childId_target childId_performer`', { parse_mode: 'Markdown' });
                return bot.answerCallbackQuery(query.id);
            }

        } catch (e) {
            console.log('❌ Empire handler error:', e.message);
            try { await bot.answerCallbackQuery(query.id, { text: '❌ خطا!', show_alert: true }); } catch(e2) {}
        }
    });

    // =============================================
    // 📝 پیام‌های متنی (تنظیم نام سلسله)
    // =============================================
    bot.on('message', async (msg) => {
        const chatId = msg.chat.id;
        const text = msg.text;
        if (!text || text.startsWith('/') || text.startsWith('🔙')) return;
        
        const p = player.getPlayer(chatId);
        if (!p) return;
        
        const { empireState } = require('./core');
        if (empireState[chatId]?.action === 'setDynasty') {
            const { setDynastyName, formatEmpire, getEmpireKeyboard } = require('../empire');
            const result = setDynastyName(p, text);
            delete empireState[chatId];
            await bot.sendMessage(chatId, result.message, { parse_mode: 'Markdown', ...getEmpireKeyboard(p) });
        }
    });
}

module.exports = { setupEmpireHandlers };