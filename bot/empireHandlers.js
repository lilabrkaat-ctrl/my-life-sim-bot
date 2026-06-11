const { bot, player, mainMenu } = require('./core');

function setupEmpireHandlers() {

    // =============================================
    // 🎮 هندلر اصلی callback_query
    // =============================================
    bot.on('callback_query', async (query) => {
        const chatId = query.message.chat.id;
        const msgId = query.message.message_id;
        const data = query.data;
        const p = player.getPlayer(chatId);

        if (!p) return bot.answerCallbackQuery(query.id, { text: '❌ /start بزن!', show_alert: true });

        try {

            // =============================================
            // 🔙 برگشت به منوی اصلی
            // =============================================
            if (data === 'back_to_main') {
                const config = require('../config');
                const { getTimeOfDay } = require('../player');
                const time = getTimeOfDay();
                p.timeOfDay = time;
                const loc = config.images.locations[p.location] || config.images.locations.village;
                let welcome = `🏛️ *بقای باستانی*\n\n✨ ${p.name} | 📍 ${loc.emoji} ${loc.name}\n${time.name} | 📅 روز ${p.gameDay || 1}/۷ | 🏆 ${p.score || 0} امتیاز`;
                await bot.editMessageText(welcome, { chat_id: chatId, message_id: msgId, parse_mode: 'Markdown', ...mainMenu() });
                return bot.answerCallbackQuery(query.id);
            }

            // =============================================
            // 👑 امپراطوری - برگشت از زیرمنوها
            // =============================================
            if (data === 'empire_back') {
                const { formatEmpire, getEmpireKeyboard } = require('../empire');
                await bot.editMessageText(formatEmpire(p), { chat_id: chatId, message_id: msgId, parse_mode: 'Markdown', ...getEmpireKeyboard(p) });
                return bot.answerCallbackQuery(query.id);
            }

            // =============================================
            // 👑 امپراطوری - جمع‌آوری درآمد
            // =============================================
            if (data === 'empire_income') {
                const { collectEmpireIncome, formatEmpire, getEmpireKeyboard } = require('../empire');
                const result = collectEmpireIncome(p);
                await bot.editMessageText(formatEmpire(p), { chat_id: chatId, message_id: msgId, parse_mode: 'Markdown', ...getEmpireKeyboard(p) });
                return bot.answerCallbackQuery(query.id, { text: result.message.replace(/[*_]/g, '').replace(/\n/g, ' '), show_alert: true });
            }

            // =============================================
            // 👑 امپراطوری - تغییر نام سلسله
            // =============================================
            if (data === 'empire_dynasty') {
                require('./core').empireState[chatId] = { action: 'setDynasty', msgId };
                await bot.sendMessage(chatId, '📝 *اسم سلسله جدید رو تایپ کن:*', { parse_mode: 'Markdown' });
                return bot.answerCallbackQuery(query.id, { text: 'اسم سلسله رو تایپ کن' });
            }

            // =============================================
            // 👑 امپراطوری - انتصاب سمت
            // =============================================
            if (data.startsWith('empire_assign_')) {
                const roleKey = data.replace('empire_assign_', '');
                const { empireRoles } = require('../empire');

                if (!p.children || p.children.filter(c => c.isAlive).length === 0) {
                    return bot.answerCallbackQuery(query.id, { text: '❌ هیچ فرزندی نداری!', show_alert: true });
                }

                require('./core').empireState[chatId] = { action: 'assignRole', roleKey, msgId };

                let childList = '👶 *فرزندان برای انتصاب:*\n\n';
                for (let child of p.children) {
                    if (!child.isAlive) continue;
                    childList += `${child.emoji} ${child.name} | ${child.classEmoji} ${child.className} | سطح ${child.evolutionLevel}\n`;
                    childList += `🆔 \`${child.id}\`\n\n`;
                }
                childList += '📝 *آیدی فرزند رو کپی کن و بفرست:*';
                await bot.sendMessage(chatId, childList, { parse_mode: 'Markdown' });
                return bot.answerCallbackQuery(query.id, { text: 'آیدی فرزند رو بفرست' });
            }

            // =============================================
            // 👑 امپراطوری - ساخت عجایب
            // =============================================
            if (data.startsWith('empire_wonder_')) {
                const wonderKey = data.replace('empire_wonder_', '');
                const { buildWonder, formatEmpire, getEmpireKeyboard } = require('../empire');
                const result = buildWonder(p, wonderKey);
                await bot.editMessageText(formatEmpire(p), { chat_id: chatId, message_id: msgId, parse_mode: 'Markdown', ...getEmpireKeyboard(p) });
                return bot.answerCallbackQuery(query.id, { text: result.message.replace(/[*_]/g, '').replace(/\n/g, ' '), show_alert: true });
            }

            // =============================================
            // 👸 حرمسرا - منوی اصلی
            // =============================================
            if (data === 'harem_menu') {
                const { formatHarem, getHaremKeyboard } = require('../queenHarem');
                await bot.editMessageText(formatHarem(p), { chat_id: chatId, message_id: msgId, parse_mode: 'Markdown', ...getHaremKeyboard(p) });
                return bot.answerCallbackQuery(query.id);
            }

            // =============================================
            // 👸 حرمسرا - انتخاب ملکه
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

                const preg = queen.pregnancies?.find(p => !p.born && Date.now() < p.dueDate);
                if (preg) {
                    const rem = Math.max(0, Math.ceil((preg.dueDate - Date.now()) / (60 * 60 * 1000)));
                    infoMsg += `🤰 باردار: ${rem} ساعت مونده\n`;
                }

                await bot.editMessageText(infoMsg, { chat_id: chatId, message_id: msgId, parse_mode: 'Markdown', ...getQueenKeyboard(p, queen.id) });
                return bot.answerCallbackQuery(query.id);
            }

            // =============================================
            // 👸 حرمسرا - بارداری جدید (انتخاب ملکه)
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

                await bot.editMessageText('👸 *انتخاب ملکه برای بارداری:*\n\nملکه مورد نظر رو انتخاب کن:', { chat_id: chatId, message_id: msgId, parse_mode: 'Markdown', reply_markup: { inline_keyboard: buttons } });
                return bot.answerCallbackQuery(query.id);
            }

            // =============================================
            // 👸 حرمسرا - انتخاب ملکه برای بارداری
            // =============================================
            if (data.startsWith('harem_pregnancy_select_')) {
                const queenId = data.replace('harem_pregnancy_select_', '');
                const queen = p.harem?.queens.find(q => q.id === queenId);
                if (!queen) return bot.answerCallbackQuery(query.id, { text: '❌ ملکه پیدا نشد!' });

                require('./core').haremState[chatId] = { queenId: queen.id, action: 'startPregnancy' };
                const { getPregnancySpeedKeyboard } = require('../queenHarem');
                await bot.editMessageText('⏰ *سرعت بارداری*\n\nنوع بارداری رو انتخاب کن:', { chat_id: chatId, message_id: msgId, parse_mode: 'Markdown', ...getPregnancySpeedKeyboard() });
                return bot.answerCallbackQuery(query.id);
            }

            // =============================================
            // 👸 حرمسرا - پرداخت حقوق
            // =============================================
            if (data === 'harem_salary') {
                const { paySalaries, formatHarem, getHaremKeyboard } = require('../queenHarem');
                const result = paySalaries(p);
                await bot.editMessageText(formatHarem(p), { chat_id: chatId, message_id: msgId, parse_mode: 'Markdown', ...getHaremKeyboard(p) });
                return bot.answerCallbackQuery(query.id, { text: result.message.replace(/[*_]/g, '').replace(/\n/g, ' '), show_alert: true });
            }

            // =============================================
            // 👸 حرمسرا - رسیدگی به همه
            // =============================================
            if (data === 'harem_care_all') {
                const { careAllQueens, formatHarem, getHaremKeyboard } = require('../queenHarem');
                const result = careAllQueens(p);
                await bot.editMessageText(formatHarem(p), { chat_id: chatId, message_id: msgId, parse_mode: 'Markdown', ...getHaremKeyboard(p) });
                return bot.answerCallbackQuery(query.id, { text: result.message.replace(/[*_]/g, '').replace(/\n/g, ' '), show_alert: true });
            }

            // =============================================
            // 👸 حرمسرا - منوی جشن‌ها
            // =============================================
            if (data === 'harem_festival') {
                const { getCelebrationKeyboard } = require('../queenHarem');
                await bot.editMessageText('🎉 *جشن‌های حرمسرا*\n\nجشن مورد نظر رو انتخاب کن:', { chat_id: chatId, message_id: msgId, parse_mode: 'Markdown', ...getCelebrationKeyboard() });
                return bot.answerCallbackQuery(query.id);
            }

            // =============================================
            // 👸 حرمسرا - برگزاری جشن
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

                let infoMsg = `${queen.emoji} *${queen.name}*\n😊 روحیه: ${queen.mood}% | ❤️ سلامت: ${queen.health}%`;
                await bot.editMessageText(infoMsg, { chat_id: chatId, message_id: msgId, parse_mode: 'Markdown', ...getQueenKeyboard(p, state.queenId) });
                return bot.answerCallbackQuery(query.id, { text: result.message.replace(/[*_]/g, '') });
            }

            // =============================================
            // 👸 ملکه - بارداری
            // =============================================
            if (data === 'queen_pregnancy') {
                const state = require('./core').haremState[chatId];
                if (!state || !state.queenId) return bot.answerCallbackQuery(query.id, { text: '❌ اول ملکه رو انتخاب کن!' });

                state.action = 'startPregnancy';
                const { getPregnancySpeedKeyboard } = require('../queenHarem');
                await bot.editMessageText('⏰ *سرعت بارداری*\n\nنوع بارداری رو انتخاب کن:', { chat_id: chatId, message_id: msgId, parse_mode: 'Markdown', ...getPregnancySpeedKeyboard() });
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
                if (!pregnancy) return bot.answerCallbackQuery(query.id, { text: '❌ باردار نیست!' });

                state.action = 'speedPregnancy';
                state.pregnancyId = pregnancy.id;
                const { getPregnancySpeedKeyboard } = require('../queenHarem');
                await bot.editMessageText('⏰ *تسریع بارداری*\n\nسرعت جدید رو انتخاب کن:', { chat_id: chatId, message_id: msgId, parse_mode: 'Markdown', ...getPregnancySpeedKeyboard() });
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

                if (state.action === 'startPregnancy') {
                    const result = startPregnancy(p, state.queenId, speedKey);
                    let infoMsg = `${queen.emoji} *${queen.name}*\n😊 ${queen.mood}% | ❤️ ${queen.health}%`;
                    if (result.success) {
                        const preg = queen.pregnancies?.find(p => !p.born && Date.now() < p.dueDate);
                        if (preg) {
                            const rem = Math.max(0, Math.ceil((preg.dueDate - Date.now()) / (60 * 60 * 1000)));
                            infoMsg += `\n🤰 باردار: ${rem} ساعت مونده`;
                        }
                    }
                    await bot.editMessageText(infoMsg, { chat_id: chatId, message_id: msgId, parse_mode: 'Markdown', ...getQueenKeyboard(p, state.queenId) });
                    return bot.answerCallbackQuery(query.id, { text: result.message.replace(/[*_]/g, '') });
                }

                if (state.action === 'speedPregnancy') {
                    const result = speedUpPregnancy(p, state.queenId, state.pregnancyId, speedKey);
                    let infoMsg = `${queen.emoji} *${queen.name}*\n😊 ${queen.mood}% | ❤️ ${queen.health}%`;
                    const preg = queen.pregnancies?.find(p => !p.born && Date.now() < p.dueDate);
                    if (preg) {
                        const rem = Math.max(0, Math.ceil((preg.dueDate - Date.now()) / (60 * 60 * 1000)));
                        infoMsg += `\n🤰 باردار: ${rem} ساعت مونده`;
                    }
                    await bot.editMessageText(infoMsg, { chat_id: chatId, message_id: msgId, parse_mode: 'Markdown', ...getQueenKeyboard(p, state.queenId) });
                    return bot.answerCallbackQuery(query.id, { text: result.message.replace(/[*_]/g, '') });
                }
            }

            // =============================================
            // 👸 ملکه - خرید لباس
            // =============================================
            if (data === 'queen_dress') {
                const state = require('./core').haremState[chatId];
                if (!state || !state.queenId) return bot.answerCallbackQuery(query.id, { text: '❌ اول ملکه رو انتخاب کن!' });
                state.action = 'buyDress';
                const { getDressKeyboard } = require('../queenHarem');
                await bot.editMessageText('👗 *خرید لباس*\n\nلباس مورد نظر رو انتخاب کن:', { chat_id: chatId, message_id: msgId, parse_mode: 'Markdown', ...getDressKeyboard() });
                return bot.answerCallbackQuery(query.id);
            }

            if (data.startsWith('dress_buy_')) {
                const dressKey = data.replace('dress_buy_', '');
                const state = require('./core').haremState[chatId];
                if (!state || !state.queenId) return bot.answerCallbackQuery(query.id, { text: '❌ اول ملکه رو انتخاب کن!' });

                const { buyDress, getQueenKeyboard } = require('../queenHarem');
                const result = buyDress(p, state.queenId, dressKey);
                const queen = p.harem?.queens.find(q => q.id === state.queenId);
                let infoMsg = `${queen.emoji} *${queen.name}*\n😊 ${queen.mood}% | ❤️ ${queen.health}%`;
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
                await bot.editMessageText('💍 *خرید جواهر*\n\nجواهر مورد نظر رو انتخاب کن:', { chat_id: chatId, message_id: msgId, parse_mode: 'Markdown', ...getJewelryKeyboard() });
                return bot.answerCallbackQuery(query.id);
            }

            if (data.startsWith('jewelry_buy_')) {
                const jewelKey = data.replace('jewelry_buy_', '');
                const state = require('./core').haremState[chatId];
                if (!state || !state.queenId) return bot.answerCallbackQuery(query.id, { text: '❌ اول ملکه رو انتخاب کن!' });

                const { buyJewelry, getQueenKeyboard } = require('../queenHarem');
                const result = buyJewelry(p, state.queenId, jewelKey);
                const queen = p.harem?.queens.find(q => q.id === state.queenId);
                let infoMsg = `${queen.emoji} *${queen.name}*\n😊 ${queen.mood}% | ❤️ ${queen.health}%`;
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
                await bot.editMessageText('🏠 *ارتقای اتاق*\n\nاتاق مورد نظر رو انتخاب کن:', { chat_id: chatId, message_id: msgId, parse_mode: 'Markdown', ...getRoomKeyboard() });
                return bot.answerCallbackQuery(query.id);
            }

            if (data.startsWith('room_upgrade_')) {
                const roomKey = data.replace('room_upgrade_', '');
                const state = require('./core').haremState[chatId];
                if (!state || !state.queenId) return bot.answerCallbackQuery(query.id, { text: '❌ اول ملکه رو انتخاب کن!' });

                const { upgradeRoom, getQueenKeyboard } = require('../queenHarem');
                const result = upgradeRoom(p, state.queenId, roomKey);
                const queen = p.harem?.queens.find(q => q.id === state.queenId);
                let infoMsg = `${queen.emoji} *${queen.name}*\n😊 ${queen.mood}% | ❤️ ${queen.health}%`;
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
                await bot.editMessageText('🧹 *استخدام خدمتکار*\n\nخدمتکار مورد نظر رو انتخاب کن:', { chat_id: chatId, message_id: msgId, parse_mode: 'Markdown', ...getServantKeyboard() });
                return bot.answerCallbackQuery(query.id);
            }

            if (data.startsWith('servant_hire_')) {
                const servantKey = data.replace('servant_hire_', '');
                const state = require('./core').haremState[chatId];
                if (!state || !state.queenId) return bot.answerCallbackQuery(query.id, { text: '❌ اول ملکه رو انتخاب کن!' });

                const { hireServant, getQueenKeyboard } = require('../queenHarem');
                const result = hireServant(p, state.queenId, servantKey);
                const queen = p.harem?.queens.find(q => q.id === state.queenId);
                let infoMsg = `${queen.emoji} *${queen.name}*\n😊 ${queen.mood}% | ❤️ ${queen.health}%`;
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
                await bot.editMessageText('📚 *سبک تربیت*\n\nسبک مورد نظر رو انتخاب کن:', { chat_id: chatId, message_id: msgId, parse_mode: 'Markdown', ...getUpbringingKeyboard() });
                return bot.answerCallbackQuery(query.id);
            }

            if (data.startsWith('upbringing_set_')) {
                const upbringingKey = data.replace('upbringing_set_', '');
                const state = require('./core').haremState[chatId];
                if (!state || !state.queenId) return bot.answerCallbackQuery(query.id, { text: '❌ اول ملکه رو انتخاب کن!' });

                const { setChildUpbringing, getQueenKeyboard } = require('../queenHarem');
                const result = setChildUpbringing(p, state.queenId, upbringingKey);
                const queen = p.harem?.queens.find(q => q.id === state.queenId);
                let infoMsg = `${queen.emoji} *${queen.name}*\n📚 ${result.message}`;
                await bot.editMessageText(infoMsg, { chat_id: chatId, message_id: msgId, parse_mode: 'Markdown', ...getQueenKeyboard(p, state.queenId) });
                return bot.answerCallbackQuery(query.id, { text: result.message.replace(/[*_]/g, '') });
            }

            // =============================================
            // 👸 ملکه - دسیسه
            // =============================================
            if (data === 'queen_intrigue') {
                const state = require('./core').haremState[chatId];
                if (!state || !state.queenId) return bot.answerCallbackQuery(query.id, { text: '❌ اول ملکه رو انتخاب کن!' });
                state.action = 'queenIntrigue';
                const { getIntrigueKeyboard } = require('../queenHarem');
                await bot.editMessageText('🐍 *دسیسه‌های حرمسرا*\n\nدسیسه مورد نظر رو انتخاب کن:', { chat_id: chatId, message_id: msgId, parse_mode: 'Markdown', ...getIntrigueKeyboard() });
                return bot.answerCallbackQuery(query.id);
            }

            if (data.startsWith('intrigue_')) {
                const intrigueKey = data.replace('intrigue_', '');
                const state = require('./core').haremState[chatId];
                if (!state || !state.queenId) return bot.answerCallbackQuery(query.id, { text: '❌ اول ملکه رو انتخاب کن!' });

                // انتخاب ملکه هدف
                state.intrigueKey = intrigueKey;
                const buttons = [];
                for (let queen of p.harem.queens) {
                    if (queen.id !== state.queenId) {
                        buttons.push([{ text: `${queen.emoji} ${queen.name}`, callback_data: `intrigue_target_${queen.id}` }]);
                    }
                }
                buttons.push([{ text: '🔙 برگشت', callback_data: 'harem_menu' }]);
                await bot.editMessageText('🎯 *هدف دسیسه رو انتخاب کن:*', { chat_id: chatId, message_id: msgId, parse_mode: 'Markdown', reply_markup: { inline_keyboard: buttons } });
                return bot.answerCallbackQuery(query.id);
            }

            if (data.startsWith('intrigue_target_')) {
                const targetQueenId = data.replace('intrigue_target_', '');
                const state = require('./core').haremState[chatId];
                if (!state || !state.queenId || !state.intrigueKey) return bot.answerCallbackQuery(query.id, { text: '❌ خطا!' });

                const { performIntrigue, getQueenKeyboard } = require('../queenHarem');
                const result = performIntrigue(p, state.queenId, targetQueenId, state.intrigueKey);
                const queen = p.harem?.queens.find(q => q.id === state.queenId);
                let infoMsg = `${queen?.emoji || ''} *${queen?.name || ''}*\n${result.message}`;
                await bot.editMessageText(infoMsg, { chat_id: chatId, message_id: msgId, parse_mode: 'Markdown', ...getQueenKeyboard(p, state.queenId) });
                return bot.answerCallbackQuery(query.id, { text: result.message.replace(/[*_]/g, ''), show_alert: true });
            }

            // =============================================
            // 👸 ملکه - دفتر خاطرات
            // =============================================
            if (data === 'queen_diary') {
                const { getRandomDiaryEntry, getQueenKeyboard } = require('../queenHarem');
                const entry = getRandomDiaryEntry(p);
                const state = require('./core').haremState[chatId];
                if (entry) {
                    await bot.editMessageText(`📔 *دفتر خاطرات ${entry.queen.emoji} ${entry.queen.name}*\n\n"${entry.entry}"`, { chat_id: chatId, message_id: msgId, parse_mode: 'Markdown', ...getQueenKeyboard(p, state.queenId) });
                } else {
                    await bot.editMessageText('📔 دفتر خاطرات خالیه...', { chat_id: chatId, message_id: msgId, parse_mode: 'Markdown', ...getQueenKeyboard(p, state.queenId) });
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

            // =============================================
            // 🏛️ دربار - منو
            // =============================================
            if (data === 'court_menu') {
                const { formatCourt, getCourtKeyboard } = require('../court');
                await bot.editMessageText(formatCourt(p), { chat_id: chatId, message_id: msgId, parse_mode: 'Markdown', ...getCourtKeyboard(p) });
                return bot.answerCallbackQuery(query.id);
            }

            // =============================================
            // 👥 مردم - منو
            // =============================================
            if (data === 'people_menu') {
                const { formatPeople, getPeopleKeyboard } = require('../people');
                await bot.editMessageText(formatPeople(p), { chat_id: chatId, message_id: msgId, parse_mode: 'Markdown', ...getPeopleKeyboard(p) });
                return bot.answerCallbackQuery(query.id);
            }

            // =============================================
            // 👶 فرزندان - منو
            // =============================================
            if (data === 'children_menu') {
                const { formatChildren, getChildrenKeyboard } = require('../offspring');
                await bot.editMessageText(formatChildren(p), { chat_id: chatId, message_id: msgId, parse_mode: 'Markdown', ...getChildrenKeyboard(p) });
                return bot.answerCallbackQuery(query.id);
            }

        } catch (e) {
            console.log('Empire handler error:', e.message);
            return bot.answerCallbackQuery(query.id, { text: '❌ خطا! دوباره تلاش کن.' });
        }
    });

    // =============================================
    // 📝 هندلر پیام‌های متنی برای state ها
    // =============================================
    bot.on('message', async (msg) => {
        const chatId = msg.chat.id;
        const text = msg.text;
        if (!text || text.startsWith('/') || text.startsWith('🔙')) return;

        const p = player.getPlayer(chatId);
        if (!p) return;

        const { empireState } = require('./core');
        const config = require('../config');

        // تغییر نام سلسله
        if (empireState[chatId] && empireState[chatId].action === 'setDynasty') {
            const { setDynastyName, formatEmpire, getEmpireKeyboard } = require('../empire');
            const result = setDynastyName(p, text);
            const msgId = empireState[chatId].msgId;
            delete empireState[chatId];
            if (msgId) {
                try { await bot.editMessageText(formatEmpire(p), { chat_id: chatId, message_id: msgId, parse_mode: 'Markdown', ...getEmpireKeyboard(p) }); } catch (e) {}
            }
            await bot.sendMessage(chatId, result.message, { parse_mode: 'Markdown' });
            return;
        }

        // انتصاب سمت
        if (empireState[chatId] && empireState[chatId].action === 'assignRole') {
            const childId = text.trim();
            const { assignRole, formatEmpire, getEmpireKeyboard } = require('../empire');
            const result = assignRole(p, empireState[chatId].roleKey, childId);
            const msgId = empireState[chatId].msgId;
            delete empireState[chatId];
            if (msgId) {
                try { await bot.editMessageText(formatEmpire(p), { chat_id: chatId, message_id: msgId, parse_mode: 'Markdown', ...getEmpireKeyboard(p) }); } catch (e) {}
            }
            await bot.sendMessage(chatId, result.message, { parse_mode: 'Markdown' });
            return;
        }
    });
}

module.exports = { setupEmpireHandlers };