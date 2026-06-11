const { bot, player } = require('./core');

function setupHaremHandlers() {

    bot.on('callback_query', async (query) => {
        const chatId = query.message.chat.id;
        const msgId = query.message.message_id;
        const data = query.data;
        const p = player.getPlayer(chatId);

        if (!p) return bot.answerCallbackQuery(query.id, { text: '❌ /start بزن!', show_alert: true });

        try {

            // =============================================
            // 👸 منوی اصلی حرمسرا
            // =============================================
            if (data === 'harem_menu') {
                const { formatHarem, getHaremKeyboard } = require('../queenHarem');
                await bot.editMessageText(formatHarem(p), { chat_id: chatId, message_id: msgId, parse_mode: 'Markdown', ...getHaremKeyboard(p) });
                return bot.answerCallbackQuery(query.id);
            }

            // =============================================
            // 👸 انتخاب ملکه از لیست
            // =============================================
            if (data.startsWith('harem_queen_')) {
                const queenId = data.replace('harem_queen_', '');
                const queen = p.harem?.queens.find(q => q.id === queenId);
                if (!queen) return bot.answerCallbackQuery(query.id, { text: '❌ ملکه پیدا نشد!' });

                require('./core').haremState[chatId] = { queenId: queen.id };

                const { getQueenKeyboard } = require('../queenHarem');
                let infoMsg = `${queen.emoji} *${queen.name}*\n`;
                infoMsg += `👑 ${queen.rank} | 💕 ${queen.points}\n`;
                infoMsg += `😊 روحیه: ${queen.mood}% | ❤️ سلامت: ${queen.health}%\n`;
                infoMsg += `📊 اعتبار: ${queen.reputation}\n`;

                if (queen.dress) {
                    const { dresses } = require('../queenHarem');
                    infoMsg += `👗 لباس: ${dresses[queen.dress]?.emoji || ''} ${dresses[queen.dress]?.name || ''}\n`;
                }
                if (queen.jewelry.length > 0) infoMsg += `💍 جواهرات: ${queen.jewelry.length} عدد\n`;
                if (queen.servants.length > 0) infoMsg += `🧹 خدمتکاران: ${queen.servants.length} نفر\n`;

                const preg = queen.pregnancies?.find(p => !p.born && Date.now() < p.dueDate);
                if (preg) {
                    const rem = Math.max(0, Math.ceil((preg.dueDate - Date.now()) / (60 * 60 * 1000)));
                    infoMsg += `🤰 باردار: ${rem} ساعت مونده\n`;
                }

                await bot.editMessageText(infoMsg, { chat_id: chatId, message_id: msgId, parse_mode: 'Markdown', ...getQueenKeyboard(p, queen.id) });
                return bot.answerCallbackQuery(query.id);
            }

            // =============================================
            // 👸 بارداری جدید - انتخاب ملکه
            // =============================================
            if (data === 'harem_pregnancy_new') {
                if (!p.harem || !p.harem.queens || p.harem.queens.length === 0) {
                    return bot.answerCallbackQuery(query.id, { text: '❌ هیچ ملکه‌ای نیست!', show_alert: true });
                }

                const buttons = [];
                for (let queen of p.harem.queens) {
                    const preg = queen.pregnancies?.find(p => !p.born && Date.now() < p.dueDate);
                    buttons.push([{ text: `${preg ? '🤰' : '✅'} ${queen.emoji} ${queen.name}`, callback_data: `harem_pregnancy_select_${queen.id}` }]);
                }
                buttons.push([{ text: '🔙 برگشت', callback_data: 'harem_menu' }]);

                await bot.editMessageText('👸 *انتخاب ملکه برای بارداری:*\n\nملکه مورد نظر رو انتخاب کن:', {
                    chat_id: chatId, message_id: msgId, parse_mode: 'Markdown',
                    reply_markup: { inline_keyboard: buttons }
                });
                return bot.answerCallbackQuery(query.id);
            }

            // =============================================
            // 👸 انتخاب ملکه برای بارداری
            // =============================================
            if (data.startsWith('harem_pregnancy_select_')) {
                const queenId = data.replace('harem_pregnancy_select_', '');
                const queen = p.harem?.queens.find(q => q.id === queenId);
                if (!queen) return bot.answerCallbackQuery(query.id, { text: '❌ ملکه پیدا نشد!' });

                require('./core').haremState[chatId] = { queenId: queen.id, action: 'startPregnancy' };
                const { getPregnancySpeedKeyboard } = require('../queenHarem');
                await bot.editMessageText('⏰ *سرعت بارداری*\n\nنوع بارداری رو انتخاب کن:', {
                    chat_id: chatId, message_id: msgId, parse_mode: 'Markdown', ...getPregnancySpeedKeyboard()
                });
                return bot.answerCallbackQuery(query.id);
            }

            // =============================================
            // 👸 پرداخت حقوق
            // =============================================
            if (data === 'harem_salary') {
                const { paySalaries, formatHarem, getHaremKeyboard } = require('../queenHarem');
                const result = paySalaries(p);
                await bot.editMessageText(formatHarem(p), { chat_id: chatId, message_id: msgId, parse_mode: 'Markdown', ...getHaremKeyboard(p) });
                return bot.answerCallbackQuery(query.id, { text: result.message.replace(/[*_]/g, '').replace(/\n/g, ' '), show_alert: true });
            }

            // =============================================
            // 👸 رسیدگی به همه ملکه‌ها
            // =============================================
            if (data === 'harem_care_all') {
                const { careAllQueens, formatHarem, getHaremKeyboard } = require('../queenHarem');
                const result = careAllQueens(p);
                await bot.editMessageText(formatHarem(p), { chat_id: chatId, message_id: msgId, parse_mode: 'Markdown', ...getHaremKeyboard(p) });
                return bot.answerCallbackQuery(query.id, { text: result.message.replace(/[*_]/g, '').replace(/\n/g, ' '), show_alert: true });
            }

            // =============================================
            // 👸 منوی جشن‌ها
            // =============================================
            if (data === 'harem_festival') {
                const { getCelebrationKeyboard } = require('../queenHarem');
                await bot.editMessageText('🎉 *جشن‌های حرمسرا*\n\nجشن مورد نظر رو انتخاب کن:', {
                    chat_id: chatId, message_id: msgId, parse_mode: 'Markdown', ...getCelebrationKeyboard()
                });
                return bot.answerCallbackQuery(query.id);
            }

            // =============================================
            // 👸 برگزاری جشن
            // =============================================
            if (data.startsWith('harem_festival_')) {
                const celebrationKey = data.replace('harem_festival_', '');
                const { celebrateFestival, formatHarem, getHaremKeyboard } = require('../queenHarem');
                const result = celebrateFestival(p, celebrationKey);
                await bot.editMessageText(formatHarem(p), { chat_id: chatId, message_id: msgId, parse_mode: 'Markdown', ...getHaremKeyboard(p) });
                return bot.answerCallbackQuery(query.id, { text: result.message.replace(/[*_]/g, '').replace(/\n/g, ' '), show_alert: true });
            }

            // =============================================
            // 👸 ملکه - رسیدگی
            // =============================================
            if (data === 'queen_care') {
                const state = require('./core').haremState[chatId];
                if (!state || !state.queenId) return bot.answerCallbackQuery(query.id, { text: '❌ اول ملکه رو انتخاب کن!' });

                const { queenCare, getQueenKeyboard } = require('../queenHarem');
                const result = queenCare(p, state.queenId);
                const queen = p.harem?.queens.find(q => q.id === state.queenId);
                if (!queen) return bot.answerCallbackQuery(query.id, { text: '❌ ملکه پیدا نشد!' });

                let infoMsg = `💆 *رسیدگی*\n\n${result.message}`;
                await bot.editMessageText(infoMsg, { chat_id: chatId, message_id: msgId, parse_mode: 'Markdown', ...getQueenKeyboard(p, state.queenId) });
                return bot.answerCallbackQuery(query.id);
            }

            // =============================================
            // 👸 ملکه - بارداری
            // =============================================
            if (data === 'queen_pregnancy') {
                const state = require('./core').haremState[chatId];
                if (!state || !state.queenId) return bot.answerCallbackQuery(query.id, { text: '❌ اول ملکه رو انتخاب کن!' });

                const queen = p.harem?.queens.find(q => q.id === state.queenId);
                if (!queen) return bot.answerCallbackQuery(query.id, { text: '❌ ملکه پیدا نشد!' });

                if (queen.pregnancies?.find(p => !p.born && Date.now() < p.dueDate)) {
                    return bot.answerCallbackQuery(query.id, { text: '❌ این ملکه قبلاً بارداره!', show_alert: true });
                }

                state.action = 'startPregnancy';
                const { getPregnancySpeedKeyboard } = require('../queenHarem');
                await bot.editMessageText('⏰ *سرعت بارداری*\n\nنوع بارداری رو انتخاب کن:', {
                    chat_id: chatId, message_id: msgId, parse_mode: 'Markdown', ...getPregnancySpeedKeyboard()
                });
                return bot.answerCallbackQuery(query.id);
            }

            // =============================================
            // 👸 ملکه - تسریع بارداری
            // =============================================
            if (data === 'queen_speed_pregnancy') {
                const state = require('./core').haremState[chatId];
                if (!state || !state.queenId) return bot.answerCallbackQuery(query.id, { text: '❌ اول ملکه رو انتخاب کن!' });

                const queen = p.harem?.queens.find(q => q.id === state.queenId);
                if (!queen) return bot.answerCallbackQuery(query.id, { text: '❌ ملکه پیدا نشد!' });

                const pregnancy = queen.pregnancies?.find(p => !p.born && Date.now() < p.dueDate);
                if (!pregnancy) return bot.answerCallbackQuery(query.id, { text: '❌ این ملکه باردار نیست!', show_alert: true });

                state.action = 'speedPregnancy';
                state.pregnancyId = pregnancy.id;
                const { getPregnancySpeedKeyboard } = require('../queenHarem');
                await bot.editMessageText('⏰ *تسریع بارداری*\n\nسرعت جدید رو انتخاب کن:', {
                    chat_id: chatId, message_id: msgId, parse_mode: 'Markdown', ...getPregnancySpeedKeyboard()
                });
                return bot.answerCallbackQuery(query.id);
            }

            // =============================================
            // ⏰ انتخاب سرعت بارداری
            // =============================================
            if (data.startsWith('pregnancy_speed_')) {
                const speedKey = data.replace('pregnancy_speed_', '');
                const state = require('./core').haremState[chatId];
                if (!state || !state.queenId) return bot.answerCallbackQuery(query.id, { text: '❌ اول ملکه رو انتخاب کن!' });

                const { startPregnancy, speedUpPregnancy, getQueenKeyboard } = require('../queenHarem');
                const queen = p.harem?.queens.find(q => q.id === state.queenId);
                if (!queen) return bot.answerCallbackQuery(query.id, { text: '❌ ملکه پیدا نشد!' });

                let result;
                if (state.action === 'startPregnancy') {
                    result = startPregnancy(p, state.queenId, speedKey);
                } else if (state.action === 'speedPregnancy') {
                    result = speedUpPregnancy(p, state.queenId, state.pregnancyId, speedKey);
                } else {
                    return bot.answerCallbackQuery(query.id, { text: '❌ عملیات نامعتبر!' });
                }

                let infoMsg = `${queen.emoji} *${queen.name}*\n\n${result.message}`;
                await bot.editMessageText(infoMsg, { chat_id: chatId, message_id: msgId, parse_mode: 'Markdown', ...getQueenKeyboard(p, state.queenId) });
                return bot.answerCallbackQuery(query.id);
            }

            // =============================================
            // 👸 ملکه - خرید لباس
            // =============================================
            if (data === 'queen_dress') {
                const state = require('./core').haremState[chatId];
                if (!state || !state.queenId) return bot.answerCallbackQuery(query.id, { text: '❌ اول ملکه رو انتخاب کن!' });
                state.action = 'buyDress';
                const { getDressKeyboard } = require('../queenHarem');
                await bot.editMessageText('👗 *خرید لباس*\n\nلباس مورد نظر رو انتخاب کن:', {
                    chat_id: chatId, message_id: msgId, parse_mode: 'Markdown', ...getDressKeyboard()
                });
                return bot.answerCallbackQuery(query.id);
            }

            if (data.startsWith('dress_buy_')) {
                const dressKey = data.replace('dress_buy_', '');
                const state = require('./core').haremState[chatId];
                if (!state || !state.queenId) return bot.answerCallbackQuery(query.id, { text: '❌ اول ملکه رو انتخاب کن!' });

                const { buyDress, getQueenKeyboard } = require('../queenHarem');
                const result = buyDress(p, state.queenId, dressKey);
                const queen = p.harem?.queens.find(q => q.id === state.queenId);
                let infoMsg = `${queen?.emoji || ''} *${queen?.name || ''}*\n\n${result.message}`;
                await bot.editMessageText(infoMsg, { chat_id: chatId, message_id: msgId, parse_mode: 'Markdown', ...getQueenKeyboard(p, state.queenId) });
                return bot.answerCallbackQuery(query.id, { text: result.message.replace(/[*_]/g, ''), show_alert: true });
            }

            // =============================================
            // 👸 ملکه - خرید جواهر
            // =============================================
            if (data === 'queen_jewelry') {
                const state = require('./core').haremState[chatId];
                if (!state || !state.queenId) return bot.answerCallbackQuery(query.id, { text: '❌ اول ملکه رو انتخاب کن!' });
                state.action = 'buyJewelry';
                const { getJewelryKeyboard } = require('../queenHarem');
                await bot.editMessageText('💍 *خرید جواهر*\n\nجواهر مورد نظر رو انتخاب کن:', {
                    chat_id: chatId, message_id: msgId, parse_mode: 'Markdown', ...getJewelryKeyboard()
                });
                return bot.answerCallbackQuery(query.id);
            }

            if (data.startsWith('jewelry_buy_')) {
                const jewelKey = data.replace('jewelry_buy_', '');
                const state = require('./core').haremState[chatId];
                if (!state || !state.queenId) return bot.answerCallbackQuery(query.id, { text: '❌ اول ملکه رو انتخاب کن!' });

                const { buyJewelry, getQueenKeyboard } = require('../queenHarem');
                const result = buyJewelry(p, state.queenId, jewelKey);
                const queen = p.harem?.queens.find(q => q.id === state.queenId);
                let infoMsg = `${queen?.emoji || ''} *${queen?.name || ''}*\n\n${result.message}`;
                await bot.editMessageText(infoMsg, { chat_id: chatId, message_id: msgId, parse_mode: 'Markdown', ...getQueenKeyboard(p, state.queenId) });
                return bot.answerCallbackQuery(query.id, { text: result.message.replace(/[*_]/g, ''), show_alert: true });
            }

            // =============================================
            // 👸 ملکه - ارتقای اتاق
            // =============================================
            if (data === 'queen_room') {
                const state = require('./core').haremState[chatId];
                if (!state || !state.queenId) return bot.answerCallbackQuery(query.id, { text: '❌ اول ملکه رو انتخاب کن!' });
                state.action = 'upgradeRoom';
                const { getRoomKeyboard } = require('../queenHarem');
                await bot.editMessageText('🏠 *ارتقای اتاق*\n\nاتاق مورد نظر رو انتخاب کن:', {
                    chat_id: chatId, message_id: msgId, parse_mode: 'Markdown', ...getRoomKeyboard()
                });
                return bot.answerCallbackQuery(query.id);
            }

            if (data.startsWith('room_upgrade_')) {
                const roomKey = data.replace('room_upgrade_', '');
                const state = require('./core').haremState[chatId];
                if (!state || !state.queenId) return bot.answerCallbackQuery(query.id, { text: '❌ اول ملکه رو انتخاب کن!' });

                const { upgradeRoom, getQueenKeyboard } = require('../queenHarem');
                const result = upgradeRoom(p, state.queenId, roomKey);
                const queen = p.harem?.queens.find(q => q.id === state.queenId);
                let infoMsg = `${queen?.emoji || ''} *${queen?.name || ''}*\n\n${result.message}`;
                await bot.editMessageText(infoMsg, { chat_id: chatId, message_id: msgId, parse_mode: 'Markdown', ...getQueenKeyboard(p, state.queenId) });
                return bot.answerCallbackQuery(query.id, { text: result.message.replace(/[*_]/g, ''), show_alert: true });
            }

            // =============================================
            // 👸 ملکه - استخدام خدمتکار
            // =============================================
            if (data === 'queen_servant') {
                const state = require('./core').haremState[chatId];
                if (!state || !state.queenId) return bot.answerCallbackQuery(query.id, { text: '❌ اول ملکه رو انتخاب کن!' });
                state.action = 'hireServant';
                const { getServantKeyboard } = require('../queenHarem');
                await bot.editMessageText('🧹 *استخدام خدمتکار*\n\nخدمتکار مورد نظر رو انتخاب کن:', {
                    chat_id: chatId, message_id: msgId, parse_mode: 'Markdown', ...getServantKeyboard()
                });
                return bot.answerCallbackQuery(query.id);
            }

            if (data.startsWith('servant_hire_')) {
                const servantKey = data.replace('servant_hire_', '');
                const state = require('./core').haremState[chatId];
                if (!state || !state.queenId) return bot.answerCallbackQuery(query.id, { text: '❌ اول ملکه رو انتخاب کن!' });

                const { hireServant, getQueenKeyboard } = require('../queenHarem');
                const result = hireServant(p, state.queenId, servantKey);
                const queen = p.harem?.queens.find(q => q.id === state.queenId);
                let infoMsg = `${queen?.emoji || ''} *${queen?.name || ''}*\n\n${result.message}`;
                await bot.editMessageText(infoMsg, { chat_id: chatId, message_id: msgId, parse_mode: 'Markdown', ...getQueenKeyboard(p, state.queenId) });
                return bot.answerCallbackQuery(query.id, { text: result.message.replace(/[*_]/g, ''), show_alert: true });
            }

            // =============================================
            // 👸 ملکه - سبک تربیت
            // =============================================
            if (data === 'queen_upbringing') {
                const state = require('./core').haremState[chatId];
                if (!state || !state.queenId) return bot.answerCallbackQuery(query.id, { text: '❌ اول ملکه رو انتخاب کن!' });
                state.action = 'setUpbringing';
                const { getUpbringingKeyboard } = require('../queenHarem');
                await bot.editMessageText('📚 *سبک تربیت*\n\nسبک مورد نظر رو انتخاب کن:', {
                    chat_id: chatId, message_id: msgId, parse_mode: 'Markdown', ...getUpbringingKeyboard()
                });
                return bot.answerCallbackQuery(query.id);
            }

            if (data.startsWith('upbringing_set_')) {
                const upbringingKey = data.replace('upbringing_set_', '');
                const state = require('./core').haremState[chatId];
                if (!state || !state.queenId) return bot.answerCallbackQuery(query.id, { text: '❌ اول ملکه رو انتخاب کن!' });

                const { setChildUpbringing, getQueenKeyboard } = require('../queenHarem');
                const result = setChildUpbringing(p, state.queenId, upbringingKey);
                const queen = p.harem?.queens.find(q => q.id === state.queenId);
                let infoMsg = `${queen?.emoji || ''} *${queen?.name || ''}*\n\n${result.message}`;
                await bot.editMessageText(infoMsg, { chat_id: chatId, message_id: msgId, parse_mode: 'Markdown', ...getQueenKeyboard(p, state.queenId) });
                return bot.answerCallbackQuery(query.id, { text: result.message.replace(/[*_]/g, '') });
            }

            // =============================================
            // 👸 ملکه - دسیسه
            // =============================================
            if (data === 'queen_intrigue') {
                const state = require('./core').haremState[chatId];
                if (!state || !state.queenId) return bot.answerCallbackQuery(query.id, { text: '❌ اول ملکه رو انتخاب کن!' });

                if (!p.harem || p.harem.queens.length < 2) {
                    return bot.answerCallbackQuery(query.id, { text: '❌ حداقل ۲ ملکه لازمه!', show_alert: true });
                }

                state.action = 'queenIntrigue';
                const { getIntrigueKeyboard } = require('../queenHarem');
                await bot.editMessageText('🐍 *دسیسه‌های حرمسرا*\n\nنوع دسیسه رو انتخاب کن:', {
                    chat_id: chatId, message_id: msgId, parse_mode: 'Markdown', ...getIntrigueKeyboard()
                });
                return bot.answerCallbackQuery(query.id);
            }

            if (data.startsWith('intrigue_')) {
                const intrigueKey = data.replace('intrigue_', '');
                const state = require('./core').haremState[chatId];
                if (!state || !state.queenId) return bot.answerCallbackQuery(query.id, { text: '❌ اول ملکه رو انتخاب کن!' });

                state.intrigueKey = intrigueKey;

                const buttons = [];
                for (let queen of p.harem.queens) {
                    if (queen.id !== state.queenId) {
                        buttons.push([{ text: `${queen.emoji} ${queen.name}`, callback_data: `intrigue_target_${queen.id}` }]);
                    }
                }
                buttons.push([{ text: '🔙 برگشت', callback_data: 'harem_menu' }]);

                await bot.editMessageText('🎯 *هدف دسیسه رو انتخاب کن:*', {
                    chat_id: chatId, message_id: msgId, parse_mode: 'Markdown',
                    reply_markup: { inline_keyboard: buttons }
                });
                return bot.answerCallbackQuery(query.id);
            }

            if (data.startsWith('intrigue_target_')) {
                const targetQueenId = data.replace('intrigue_target_', '');
                const state = require('./core').haremState[chatId];
                if (!state || !state.queenId || !state.intrigueKey) return bot.answerCallbackQuery(query.id, { text: '❌ خطا!' });

                const { performIntrigue, getQueenKeyboard } = require('../queenHarem');
                const result = performIntrigue(p, state.queenId, targetQueenId, state.intrigueKey);
                const queen = p.harem?.queens.find(q => q.id === state.queenId);

                let infoMsg = `${queen?.emoji || ''} *${queen?.name || ''}*\n\n${result.message}`;
                await bot.editMessageText(infoMsg, { chat_id: chatId, message_id: msgId, parse_mode: 'Markdown', ...getQueenKeyboard(p, state.queenId) });
                return bot.answerCallbackQuery(query.id, { text: result.message.replace(/[*_]/g, '').substring(0, 200), show_alert: true });
            }

            // =============================================
            // 👸 ملکه - دفتر خاطرات
            // =============================================
            if (data === 'queen_diary') {
                const state = require('./core').haremState[chatId];
                const { getRandomDiaryEntry, getQueenKeyboard } = require('../queenHarem');
                const entry = getRandomDiaryEntry(p);

                if (entry) {
                    await bot.editMessageText(`📔 *دفتر خاطرات ${entry.queen.emoji} ${entry.queen.name}*\n\n_"${entry.entry}"_`, {
                        chat_id: chatId, message_id: msgId, parse_mode: 'Markdown',
                        ...getQueenKeyboard(p, state?.queenId || entry.queen.id)
                    });
                } else {
                    await bot.editMessageText('📔 *دفتر خاطرات*\n\nخالیه...', {
                        chat_id: chatId, message_id: msgId, parse_mode: 'Markdown',
                        ...getQueenKeyboard(p, state?.queenId)
                    });
                }
                return bot.answerCallbackQuery(query.id);
            }

            // =============================================
            // 👸 ملکه - اخراج از حرمسرا
            // =============================================
            if (data === 'queen_remove') {
                const state = require('./core').haremState[chatId];
                if (!state || !state.queenId) return bot.answerCallbackQuery(query.id, { text: '❌ اول ملکه رو انتخاب کن!' });

                const { removeQueenFromHarem, formatHarem, getHaremKeyboard } = require('../queenHarem');
                const result = removeQueenFromHarem(p, state.queenId);
                delete require('./core').haremState[chatId];

                await bot.editMessageText(formatHarem(p), { chat_id: chatId, message_id: msgId, parse_mode: 'Markdown', ...getHaremKeyboard(p) });
                return bot.answerCallbackQuery(query.id, { text: result.message.replace(/[*_]/g, ''), show_alert: true });
            }

        } catch (e) {
            console.log('Harem handler error:', e.message);
            return bot.answerCallbackQuery(query.id, { text: '❌ خطا! دوباره تلاش کن.' });
        }
    });
}

module.exports = { setupHaremHandlers };