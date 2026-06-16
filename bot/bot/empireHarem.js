const { bot, player, mainMenu, sendPhoto, sendAnimation } = require('./core');

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

function setupEmpireHarem() {

    bot.on('callback_query', async (query) => {
        const chatId = query.message.chat.id;
        const msgId = query.message.message_id;
        const data = query.data;
        const p = player.getPlayer(chatId);

        if (!p || !data) return;
        if (!data.startsWith('harem_') && !data.startsWith('queen_') && 
            !data.startsWith('orgy_') && !data.startsWith('dress_') && 
            !data.startsWith('jewelry_') && !data.startsWith('room_') && 
            !data.startsWith('servant_') && !data.startsWith('upbringing_') && 
            !data.startsWith('intrigue_') && !data.startsWith('pregnancy_')) return;

        try {
            const del = async () => { try { await bot.deleteMessage(chatId, msgId); } catch(e) {} };
            const send = (text, kb) => bot.sendMessage(chatId, text, { parse_mode: 'Markdown', ...(kb || mainMenu()) });

            // ============ منوی حرمسرا ============
            if (data === 'harem_menu') {
                const { formatHarem, getHaremKeyboard } = require('../queenHarem');
                await del();
                await send(formatHarem(p), getHaremKeyboard(p));
                return bot.answerCallbackQuery(query.id);
            }

            // ============ انتخاب ملکه ============
            if (data.startsWith('harem_queen_')) {
                const queenId = data.replace('harem_queen_', '');
                const queen = p.harem?.queens?.find(q => q.id === queenId);
                if (!queen) return bot.answerCallbackQuery(query.id, { text: '❌ ملکه پیدا نشد!' });
                
                require('./core').haremState[chatId] = { queenId: queen.id };
                const { getQueenKeyboard } = require('../queenHarem');
                
                let info = `👸 ${queen.emoji} *${queen.name}*\n👑 ${queen.rank || 'کنیز'} | 💕 ${queen.points || 0}\n😊 روحیه: ${queen.mood || 50}% | ❤️ سلامت: ${queen.health || 100}%\n`;
                const preg = queen.pregnancies?.find(p => !p.born && Date.now() < p.dueDate);
                if (preg) info += `🤰 باردار: ${Math.max(0, Math.ceil((preg.dueDate - Date.now()) / 3600000))} ساعت\n`;
                
                await del();
                await send(info, getQueenKeyboard(p, queen.id));
                return bot.answerCallbackQuery(query.id);
            }

            // ============ حقوق و رسیدگی ============
            if (data === 'harem_salary') {
                const { paySalaries, formatHarem, getHaremKeyboard } = require('../queenHarem');
                paySalaries(p);
                await del();
                await send(formatHarem(p), getHaremKeyboard(p));
                return bot.answerCallbackQuery(query.id, { text: '✅ حقوق پرداخت شد!', show_alert: true });
            }

            if (data === 'harem_care_all') {
                const { careAllQueens, formatHarem, getHaremKeyboard } = require('../queenHarem');
                careAllQueens(p);
                await del();
                await send(formatHarem(p), getHaremKeyboard(p));
                return bot.answerCallbackQuery(query.id, { text: '✅ همه رسیدگی شدن!', show_alert: true });
            }

            // ============ جشن ============
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

            // ============ بارداری ============
            if (data === 'harem_pregnancy_new') {
                const queens = p.harem?.queens;
                if (!queens?.length) return bot.answerCallbackQuery(query.id, { text: '❌ ملکه‌ای نیست!', show_alert: true });
                const btns = queens.map(q => [{ text: `${q.emoji} ${q.name}`, callback_data: `harem_pregnancy_select_${q.id}` }]);
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
                st.action = 'speedPregnancy'; st.pregnancyId = preg.id;
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
                const result = st.action === 'startPregnancy' ? startPregnancy(p, st.queenId, speedKey) : speedUpPregnancy(p, st.queenId, st.pregnancyId, speedKey);
                await del();
                await send(`${queen.emoji} *${queen.name}*\n${result.message}`, getQueenKeyboard(p, st.queenId));
                return bot.answerCallbackQuery(query.id, { text: '✅' });
            }

            // ============ ملکه - رسیدگی ============
            if (data === 'queen_care') {
                const st = require('./core').haremState[chatId];
                if (!st?.queenId) return bot.answerCallbackQuery(query.id);
                const { queenCare, getQueenKeyboard } = require('../queenHarem');
                queenCare(p, st.queenId);
                const q = p.harem?.queens.find(q => q.id === st.queenId);
                await del();
                await send(`${q.emoji} *${q.name}*\n😊 ${q.mood}% | ❤️ ${q.health}%`, getQueenKeyboard(p, st.queenId));
                return bot.answerCallbackQuery(query.id, { text: '✅' });
            }

            // ============ ملکه - خریدها ============
            if (data === 'queen_dress') {
                const { getDressKeyboard } = require('../queenHarem');
                await del(); await send('👗 *خرید لباس:*', getDressKeyboard());
                return bot.answerCallbackQuery(query.id);
            }
            if (data.startsWith('dress_buy_')) {
                const st = require('./core').haremState[chatId];
                if (!st?.queenId) return bot.answerCallbackQuery(query.id);
                require('../queenHarem').buyDress(p, st.queenId, data.replace('dress_buy_', ''));
                const q = p.harem?.queens.find(q => q.id === st.queenId);
                const { getQueenKeyboard } = require('../queenHarem');
                await del(); await send(`${q.emoji} *${q.name}*\n✅ خرید شد!`, getQueenKeyboard(p, st.queenId));
                return bot.answerCallbackQuery(query.id, { text: '✅' });
            }

            if (data === 'queen_jewelry') {
                const { getJewelryKeyboard } = require('../queenHarem');
                await del(); await send('💍 *خرید جواهر:*', getJewelryKeyboard());
                return bot.answerCallbackQuery(query.id);
            }
            if (data.startsWith('jewelry_buy_')) {
                const st = require('./core').haremState[chatId];
                if (!st?.queenId) return bot.answerCallbackQuery(query.id);
                require('../queenHarem').buyJewelry(p, st.queenId, data.replace('jewelry_buy_', ''));
                const q = p.harem?.queens.find(q => q.id === st.queenId);
                const { getQueenKeyboard } = require('../queenHarem');
                await del(); await send(`${q.emoji} *${q.name}*\n✅ خرید شد!`, getQueenKeyboard(p, st.queenId));
                return bot.answerCallbackQuery(query.id, { text: '✅' });
            }

            if (data === 'queen_room') {
                const { getRoomKeyboard } = require('../queenHarem');
                await del(); await send('🏠 *ارتقای اتاق:*', getRoomKeyboard());
                return bot.answerCallbackQuery(query.id);
            }
            if (data.startsWith('room_upgrade_')) {
                const st = require('./core').haremState[chatId];
                if (!st?.queenId) return bot.answerCallbackQuery(query.id);
                require('../queenHarem').upgradeRoom(p, st.queenId, data.replace('room_upgrade_', ''));
                const q = p.harem?.queens.find(q => q.id === st.queenId);
                const { getQueenKeyboard } = require('../queenHarem');
                await del(); await send(`${q.emoji} *${q.name}*\n✅ ارتقا یافت!`, getQueenKeyboard(p, st.queenId));
                return bot.answerCallbackQuery(query.id, { text: '✅' });
            }

            if (data === 'queen_servant') {
                const { getServantKeyboard } = require('../queenHarem');
                await del(); await send('🧹 *استخدام خدمتکار:*', getServantKeyboard());
                return bot.answerCallbackQuery(query.id);
            }
            if (data.startsWith('servant_hire_')) {
                const st = require('./core').haremState[chatId];
                if (!st?.queenId) return bot.answerCallbackQuery(query.id);
                require('../queenHarem').hireServant(p, st.queenId, data.replace('servant_hire_', ''));
                const q = p.harem?.queens.find(q => q.id === st.queenId);
                const { getQueenKeyboard } = require('../queenHarem');
                await del(); await send(`${q.emoji} *${q.name}*\n✅ استخدام شد!`, getQueenKeyboard(p, st.queenId));
                return bot.answerCallbackQuery(query.id, { text: '✅' });
            }

            if (data === 'queen_upbringing') {
                const { getUpbringingKeyboard } = require('../queenHarem');
                await del(); await send('📚 *سبک تربیت:*', getUpbringingKeyboard());
                return bot.answerCallbackQuery(query.id);
            }
            if (data.startsWith('upbringing_set_')) {
                const st = require('./core').haremState[chatId];
                if (!st?.queenId) return bot.answerCallbackQuery(query.id);
                require('../queenHarem').setChildUpbringing(p, st.queenId, data.replace('upbringing_set_', ''));
                const q = p.harem?.queens.find(q => q.id === st.queenId);
                const { getQueenKeyboard } = require('../queenHarem');
                await del(); await send(`${q.emoji} *${q.name}*\n✅ تنظیم شد!`, getQueenKeyboard(p, st.queenId));
                return bot.answerCallbackQuery(query.id, { text: '✅' });
            }

            // ============ دسیسه ============
            if (data === 'queen_intrigue') {
                const st = require('./core').haremState[chatId];
                if (!st?.queenId) return bot.answerCallbackQuery(query.id, { text: '❌' });
                const { getIntrigueKeyboard } = require('../queenHarem');
                await del(); await send('🐍 *دسیسه:*', getIntrigueKeyboard());
                return bot.answerCallbackQuery(query.id);
            }
            if (data.startsWith('intrigue_') && !data.startsWith('intrigue_target_')) {
                const st = require('./core').haremState[chatId];
                if (!st?.queenId) return bot.answerCallbackQuery(query.id);
                st.intrigueKey = data.replace('intrigue_', '');
                const btns = p.harem.queens.filter(q => q.id !== st.queenId).map(q => [{ text: `${q.emoji} ${q.name}`, callback_data: `intrigue_target_${q.id}` }]);
                btns.push([{ text: '🔙 برگشت', callback_data: 'harem_menu' }]);
                await del(); await send('🎯 *هدف:*', { reply_markup: { inline_keyboard: btns } });
                return bot.answerCallbackQuery(query.id);
            }
            if (data.startsWith('intrigue_target_')) {
                const st = require('./core').haremState[chatId];
                const result = require('../queenHarem').performIntrigue(p, st.queenId, data.replace('intrigue_target_', ''), st.intrigueKey);
                const { getQueenKeyboard } = require('../queenHarem');
                await del(); await send(result.message, getQueenKeyboard(p, st.queenId));
                return bot.answerCallbackQuery(query.id, { text: '✅' });
            }

            // ============ خاطرات ============
            if (data === 'queen_diary') {
                const { getRandomDiaryEntry, getQueenKeyboard } = require('../queenHarem');
                const entry = getRandomDiaryEntry(p);
                const st = require('./core').haremState[chatId];
                await del();
                await send(entry ? `📔 ${entry.queen.emoji} ${entry.queen.name}: "${entry.entry}"` : '📔 خالیه', getQueenKeyboard(p, st?.queenId));
                return bot.answerCallbackQuery(query.id);
            }

            // ============ اخراج ============
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

            // ============ 🔥 هم‌آغوشی ============
            if (data === 'queen_orgy') {
                const st = require('./core').haremState[chatId];
                if (!st?.queenId) return bot.answerCallbackQuery(query.id, { text: '❌' });
                const queen = p.harem?.queens.find(q => q.id === st.queenId);
                if (!queen) return bot.answerCallbackQuery(query.id, { text: '❌' });
                const condomCount = p.inventory?.condom || 0;
                const btns = [];
                if (condomCount > 0) btns.push([{ text: '🎈 با کاندوم', callback_data: `orgy_condom_${queen.npcId}` }]);
                btns.push([{ text: '🔥 بدون کاندوم', callback_data: `orgy_nocondom_${queen.npcId}` }]);
                btns.push([{ text: '🔙 برگشت', callback_data: `harem_queen_${queen.id}` }]);
                await del();
                await sendAnimation(chatId, queenGifs.seduce[0], `👸 *${queen.name}:* "کاندوم داری؟"\n\n🎈 ${condomCount} عدد`, { reply_markup: { inline_keyboard: btns } });
                return bot.answerCallbackQuery(query.id);
            }

            if (data.startsWith('orgy_condom_') || data.startsWith('orgy_nocondom_')) {
                const parts = data.split('_');
                const useCondom = parts[1] === 'condom';
                const npcId = parts[2];
                const queen = p.harem?.queens.find(q => q.npcId === npcId);
                if (!queen) return bot.answerCallbackQuery(query.id, { text: '❌' });
                require('./core').haremState[chatId].orgyCondom = useCondom;
                const btns = [
                    [{ text: '🍑 از جلو', callback_data: `orgy_front_${npcId}_${useCondom ? '1' : '0'}` }],
                    [{ text: '🍑 از عقب', callback_data: `orgy_back_${npcId}_${useCondom ? '1' : '0'}` }],
                    [{ text: '👄 دهنی', callback_data: `orgy_mouth_${npcId}_${useCondom ? '1' : '0'}` }],
                    [{ text: '🔙 برگشت', callback_data: `harem_queen_${queen.id}` }]
                ];
                await del();
                await sendAnimation(chatId, queenGifs.selfPleasure[0], useCondom ? '🎈 *با کاندوم*' : '🔥 *بدون کاندوم*', { reply_markup: { inline_keyboard: btns } });
                return bot.answerCallbackQuery(query.id);
            }

            if (data.startsWith('orgy_front_') || data.startsWith('orgy_back_') || data.startsWith('orgy_mouth_')) {
                const parts = data.split('_');
                const pos = parts[1]; const npcId = parts[2]; const useCondom = parts[3] === '1';
                const queen = p.harem?.queens.find(q => q.npcId === npcId);
                if (!queen) return bot.answerCallbackQuery(query.id, { text: '❌' });
                
                if (useCondom) p.inventory.condom = Math.max(0, (p.inventory.condom || 0) - 1);
                if (!p.prisonRelations) p.prisonRelations = {};
                const relBonus = pos === 'back' ? 20 : pos === 'front' ? 15 : 10;
                const moodBonus = pos === 'back' ? 25 : pos === 'front' ? 20 : 30;
                p.prisonRelations[npcId] = Math.min(100, (p.prisonRelations[npcId] || 50) + relBonus);
                queen.mood = Math.min(100, (queen.mood || 50) + moodBonus);

                const { positionImages } = require('./core');
                let gif, image, title, dialog;

                if (pos === 'front') {
                    gif = queenGifs.frontOrgy[0]; image = positionImages.front?.[0];
                    title = '🍑 *از جلو*'; dialog = `👸 ${queen.name}: "اوووه... عمیق‌تر..."`;
                    if (!useCondom && Math.random() < 0.80) {
                        try { require('../queenHarem').startPregnancy(p, queen.id, 'now'); } catch(e) {}
                        await del(); await sendAnimation(chatId, queenGifs.frontFinish, '💦 *آب ریختن...*', { reply_markup: { inline_keyboard: [] } });
                        await new Promise(r => setTimeout(r, 2000));
                        dialog += '\n🤰 *باردار شد!*';
                    }
                } else if (pos === 'back') {
                    gif = queenGifs.backOrgy; image = positionImages.back?.[0];
                    title = '🍑 *از عقب*'; dialog = `👸 ${queen.name}: "آخ... محکم‌تر..."`;
                } else {
                    gif = queenGifs.oralOrgy[0]; image = positionImages.oral?.[0];
                    title = '👄 *دهنی*'; dialog = `👸 ${queen.name}: "ممم... همه شو خوردم..."`;
                    p.hp = Math.max(10, (p.hp || 100) - Math.floor((p.maxHp || 100) * 0.20));
                }

                await del(); await sendAnimation(chatId, gif, `${title}\n\n${dialog}`, { reply_markup: { inline_keyboard: [] } });
                await new Promise(r => setTimeout(r, 2000));

                let resultMsg = `${title}\n\n${dialog}\n\n💕 +${relBonus} | 😊 +${moodBonus}`;
                if (useCondom) resultMsg += `\n🎈 کاندوم -۱`;
                const { getQueenKeyboard } = require('../queenHarem');
                image ? await sendPhoto(chatId, image, resultMsg, getQueenKeyboard(p, queen.id)) : await send(resultMsg, getQueenKeyboard(p, queen.id));
                return bot.answerCallbackQuery(query.id);
            }

        } catch (e) {
            console.log('❌ Harem handler error:', e.message);
            try { await bot.answerCallbackQuery(query.id, { text: '❌ خطا!', show_alert: true }); } catch(e2) {}
        }
    });
}

module.exports = { setupEmpireHarem };