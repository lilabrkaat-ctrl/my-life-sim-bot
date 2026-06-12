const { bot, player, mainMenu } = require('./core');

function setupEmpireHandlers() {

    bot.on('callback_query', async (query) => {
        const chatId = query.message.chat.id;
        const msgId = query.message.message_id;
        const data = query.data;
        const p = player.getPlayer(chatId);

        if (!p) return;
        
        if (!data) return;
        if (data.startsWith('orgy_') || data === 'queen_orgy') return;
        if (data.startsWith('battle_') || data.startsWith('shop_') || data.startsWith('craft_') || 
            data.startsWith('prison_') || data.startsWith('house_') || data.startsWith('pet_') ||
            data.startsWith('lootbox_') || data.startsWith('quest_') || data.startsWith('admin_') ||
            data.startsWith('bm_')) return;

        try {

            const del = () => bot.deleteMessage(chatId, msgId).catch(() => {});
            const send = (text, kb) => bot.sendMessage(chatId, text, { parse_mode: 'Markdown', ...(kb || mainMenu()) });

            // ============ برگشت ============
            if (data === 'back_to_main') {
                const config = require('../config');
                const { getTimeOfDay } = require('../player');
                const time = getTimeOfDay();
                p.timeOfDay = time;
                const loc = config.images.locations[p.location] || config.images.locations.village;
                let welcome = `🏛️ *بقای باستانی*\n\n✨ ${p.name} | 📍 ${loc.emoji} ${loc.name}\n${time.name} | 📅 روز ${p.gameDay || 1}/۷ | 🏆 ${p.score || 0} امتیاز`;
                await del();
                await send(welcome, mainMenu());
                return bot.answerCallbackQuery(query.id);
            }

            if (data === 'empire_back') {
                const { formatEmpire, getEmpireKeyboard } = require('../empire');
                await del();
                await send(formatEmpire(p), getEmpireKeyboard(p));
                return bot.answerCallbackQuery(query.id);
            }

            // ============ 👑 امپراطوری ============
            if (data === 'empire_income') {
                const { collectEmpireIncome, formatEmpire, getEmpireKeyboard } = require('../empire');
                const result = collectEmpireIncome(p);
                await del();
                await send(formatEmpire(p), getEmpireKeyboard(p));
                return bot.answerCallbackQuery(query.id, { text: result.success ? '✅ درآمد جمع شد!' : result.message?.replace(/[*_]/g, '').substring(0, 80), show_alert: true });
            }

            if (data === 'empire_dynasty') {
                require('./core').empireState[chatId] = { action: 'setDynasty', msgId };
                await bot.sendMessage(chatId, '📝 *اسم سلسله جدید رو تایپ کن:*', { parse_mode: 'Markdown' });
                return bot.answerCallbackQuery(query.id);
            }

            if (data.startsWith('empire_assign_')) {
                const roleKey = data.replace('empire_assign_', '');
                const alive = p.children?.filter(c => c.isAlive) || [];
                if (alive.length === 0) return bot.answerCallbackQuery(query.id, { text: '❌ هیچ فرزندی نداری!', show_alert: true });
                require('./core').empireState[chatId] = { action: 'assignRole', roleKey, msgId };
                let childList = '👶 *فرزندان:*\n\n';
                for (let child of alive) {
                    childList += `${child.emoji} ${child.name} | ${child.classEmoji} ${child.className}\n🆔 \`${child.id}\`\n\n`;
                }
                childList += '📝 *آیدی رو کپی کن و بفرست:*';
                await bot.sendMessage(chatId, childList, { parse_mode: 'Markdown' });
                return bot.answerCallbackQuery(query.id);
            }

            if (data.startsWith('empire_wonder_')) {
                const wonderKey = data.replace('empire_wonder_', '');
                const { buildWonder, formatEmpire, getEmpireKeyboard } = require('../empire');
                const result = buildWonder(p, wonderKey);
                await del();
                await send(formatEmpire(p), getEmpireKeyboard(p));
                return bot.answerCallbackQuery(query.id, { text: result.success ? '✅ ساخته شد!' : (result.message || 'خطا').replace(/[*_]/g, '').substring(0, 80), show_alert: true });
            }

            // ============ 👸 حرمسرا ============
            if (data === 'harem_menu') {
                const { formatHarem, getHaremKeyboard } = require('../queenHarem');
                await del();
                await send(formatHarem(p), getHaremKeyboard(p));
                return bot.answerCallbackQuery(query.id);
            }

            if (data.startsWith('harem_queen_')) {
                const queenId = data.replace('harem_queen_', '');
                const queen = p.harem?.queens.find(q => q.id === queenId);
                if (!queen) return bot.answerCallbackQuery(query.id, { text: '❌ پیدا نشد!' });
                require('./core').haremState[chatId] = { queenId: queen.id };
                const { getQueenKeyboard } = require('../queenHarem');
                let info = `${queen.emoji} *${queen.name}*\n👑 ${queen.rank} | 💕 ${queen.points}\n😊 ${queen.mood}% | ❤️ ${queen.health}%`;
                const preg = queen.pregnancies?.find(p => !p.born && Date.now() < p.dueDate);
                if (preg) info += `\n🤰 ${Math.max(0, Math.ceil((preg.dueDate - Date.now()) / (60 * 60 * 1000)))} ساعت`;
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
                require('./core').haremState[chatId] = { queenId: data.replace('harem_pregnancy_select_', ''), action: 'startPregnancy' };
                const { getPregnancySpeedKeyboard } = require('../queenHarem');
                await del();
                await send('⏰ *سرعت بارداری:*', getPregnancySpeedKeyboard());
                return bot.answerCallbackQuery(query.id);
            }

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
                return bot.answerCallbackQuery(query.id, { text: '✅ رسیدگی شد!', show_alert: true });
            }

            if (data === 'harem_festival') {
                const { getCelebrationKeyboard } = require('../queenHarem');
                await del();
                await send('🎉 *جشن‌ها:*', getCelebrationKeyboard());
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

            if (data === 'queen_care') {
                const st = require('./core').haremState[chatId];
                if (!st?.queenId) return bot.answerCallbackQuery(query.id, { text: '❌ انتخاب نشده!' });
                const { queenCare, getQueenKeyboard } = require('../queenHarem');
                queenCare(p, st.queenId);
                const q = p.harem?.queens.find(q => q.id === st.queenId);
                await del();
                await send(`${q.emoji} *${q.name}*\n😊 ${q.mood}% | ❤️ ${q.health}%`, getQueenKeyboard(p, st.queenId));
                return bot.answerCallbackQuery(query.id, { text: '✅ رسیدگی شد!' });
            }

            if (data === 'queen_pregnancy') {
                const st = require('./core').haremState[chatId];
                if (!st?.queenId) return bot.answerCallbackQuery(query.id, { text: '❌ انتخاب نشده!' });
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
                await send('⏰ *تسریع:*', getPregnancySpeedKeyboard());
                return bot.answerCallbackQuery(query.id);
            }

            if (data.startsWith('pregnancy_speed_')) {
                const speedKey = data.replace('pregnancy_speed_', '');
                const st = require('./core').haremState[chatId];
                if (!st?.queenId) return bot.answerCallbackQuery(query.id);
                const { startPregnancy, speedUpPregnancy, getQueenKeyboard } = require('../queenHarem');
                const queen = p.harem?.queens.find(q => q.id === st.queenId);
                if (st.action === 'startPregnancy') startPregnancy(p, st.queenId, speedKey);
                else if (st.action === 'speedPregnancy') speedUpPregnancy(p, st.queenId, st.pregnancyId, speedKey);
                await del();
                await send(`${queen.emoji} *${queen.name}*\n😊 ${queen.mood}% | ❤️ ${queen.health}%`, getQueenKeyboard(p, st.queenId));
                return bot.answerCallbackQuery(query.id, { text: '✅ انجام شد!' });
            }

            if (data === 'queen_dress') {
                const st = require('./core').haremState[chatId];
                if (!st?.queenId) return bot.answerCallbackQuery(query.id, { text: '❌ انتخاب نشده!' });
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
                await send(`${q.emoji} *${q.name}*\n😊 ${q.mood}%`, getQueenKeyboard(p, st.queenId));
                return bot.answerCallbackQuery(query.id, { text: '✅ خرید شد!' });
            }

            if (data === 'queen_jewelry') {
                const st = require('./core').haremState[chatId];
                if (!st?.queenId) return bot.answerCallbackQuery(query.id, { text: '❌ انتخاب نشده!' });
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
                await send(`${q.emoji} *${q.name}*\n😊 ${q.mood}%`, getQueenKeyboard(p, st.queenId));
                return bot.answerCallbackQuery(query.id, { text: '✅ خرید شد!' });
            }

            if (data === 'queen_room') {
                const st = require('./core').haremState[chatId];
                if (!st?.queenId) return bot.answerCallbackQuery(query.id, { text: '❌ انتخاب نشده!' });
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
                await send(`${q.emoji} *${q.name}*\n😊 ${q.mood}%`, getQueenKeyboard(p, st.queenId));
                return bot.answerCallbackQuery(query.id, { text: '✅ ارتقا یافت!' });
            }

            if (data === 'queen_servant') {
                const st = require('./core').haremState[chatId];
                if (!st?.queenId) return bot.answerCallbackQuery(query.id, { text: '❌ انتخاب نشده!' });
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
                await send(`${q.emoji} *${q.name}*\n😊 ${q.mood}%`, getQueenKeyboard(p, st.queenId));
                return bot.answerCallbackQuery(query.id, { text: '✅ استخدام شد!' });
            }

            if (data === 'queen_upbringing') {
                const st = require('./core').haremState[chatId];
                if (!st?.queenId) return bot.answerCallbackQuery(query.id, { text: '❌ انتخاب نشده!' });
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
                await send(`${q.emoji} *${q.name}*\n📚 تنظیم شد!`, getQueenKeyboard(p, st.queenId));
                return bot.answerCallbackQuery(query.id, { text: '✅ تنظیم شد!' });
            }

            if (data === 'queen_intrigue') {
                const st = require('./core').haremState[chatId];
                if (!st?.queenId) return bot.answerCallbackQuery(query.id, { text: '❌ انتخاب نشده!' });
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
                await send('🎯 *هدف:*', { reply_markup: { inline_keyboard: btns } });
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

            // ============ 🏛️ دربار ============
            if (data === 'court_menu' || data === 'court_status') {
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
                await send('🐍 *دسیسه:*', getIntrigueKeyboard(p));
                return bot.answerCallbackQuery(query.id);
            }

            if (data.startsWith('court_intrigue_')) {
                require('./core').courtState[chatId] = { action: 'intrigue', intrigueKey: data.replace('court_intrigue_', '') };
                await bot.sendMessage(chatId, '🎯 *آیدی هدف و مجری:*\n`child_123 child_456`', { parse_mode: 'Markdown' });
                return bot.answerCallbackQuery(query.id);
            }

            // ============ 👥 مردم ============
            if (data === 'people_menu') {
                const { formatPeople, getPeopleKeyboard } = require('../people');
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
                return bot.answerCallbackQuery(query.id, { text: result.message?.replace(/[*_]/g, '').substring(0, 80) || '✅', show_alert: true });
            }

            if (data === 'people_lands') {
                const { getLandKeyboard } = require('../people');
                await del();
                await send('🌾 *زمین‌ها:*', getLandKeyboard());
                return bot.answerCallbackQuery(query.id);
            }

            if (data.startsWith('people_land_buy_')) {
                const { initPeople, assignLand, getLandKeyboard } = require('../people');
                initPeople(p);
                const result = assignLand(p, data.replace('people_land_buy_', ''), 1);
                await del();
                await send(result.message, getLandKeyboard());
                return bot.answerCallbackQuery(query.id, { text: '✅', show_alert: true });
            }

            if (data === 'people_land_water_all') {
                const { initPeople, waterLand, getLandKeyboard } = require('../people');
                initPeople(p);
                let msg = '';
                if (p.people?.lands) for (let land of p.people.lands) { msg += waterLand(p, land.id).message + '\n'; }
                await del();
                await send(msg || '✅ آبیاری شد!', getLandKeyboard());
                return bot.answerCallbackQuery(query.id);
            }

            if (data === 'people_land_harvest_all') {
                const { initPeople, harvestAllLands, getLandKeyboard } = require('../people');
                initPeople(p);
                const result = harvestAllLands(p);
                await del();
                await send(result.message, getLandKeyboard());
                return bot.answerCallbackQuery(query.id, { text: '✅', show_alert: true });
            }

            if (data === 'people_buildings') {
                const { getBuildingKeyboard } = require('../people');
                await del();
                await send('🏗️ *ساختمان‌ها:*', getBuildingKeyboard());
                return bot.answerCallbackQuery(query.id);
            }

            if (data.startsWith('people_building_')) {
                const { initPeople, buildPublicBuilding, getBuildingKeyboard } = require('../people');
                initPeople(p);
                const result = buildPublicBuilding(p, data.replace('people_building_', ''));
                await del();
                await send(result.message, getBuildingKeyboard());
                return bot.answerCallbackQuery(query.id, { text: '✅', show_alert: true });
            }

            if (data === 'people_decisions') {
                const { getDecisionKeyboard } = require('../people');
                await del();
                await send('📜 *تصمیم‌ها:*', getDecisionKeyboard());
                return bot.answerCallbackQuery(query.id);
            }

            ['people_festival', 'people_food', 'people_draft', 'people_taxbreak'].forEach(d => {
                if (data === d) {
                    const actions = { people_festival: 'festival', people_food: 'foodAid', people_draft: 'conscription', people_taxbreak: 'taxBreak' };
                    const { initPeople, makeDecision, formatPeople, getPeopleKeyboard } = require('../people');
                    initPeople(p);
                    makeDecision(p, actions[d], 0);
                    del().then(() => send(formatPeople(p), getPeopleKeyboard(p)));
                    return bot.answerCallbackQuery(query.id, { text: '✅', show_alert: true });
                }
            });

            // ============ 👶 فرزندان ============
            if (data === 'children_menu') {
                const { formatChildren, getChildrenKeyboard } = require('../offspring');
                await del();
                await send(formatChildren(p), getChildrenKeyboard(p));
                return bot.answerCallbackQuery(query.id);
            }

            if (data.startsWith('child_feed_')) {
                const { feedChild, formatChildren, getChildrenKeyboard } = require('../offspring');
                const result = feedChild(p, data.replace('child_feed_', ''));
                await del();
                await send(formatChildren(p), getChildrenKeyboard(p));
                return bot.answerCallbackQuery(query.id, { text: '✅ غذا داده شد!', show_alert: true });
            }

            if (data.startsWith('child_train_')) {
                const { trainChild, formatChildren, getChildrenKeyboard } = require('../offspring');
                const result = trainChild(p, data.replace('child_train_', ''));
                await del();
                await send(formatChildren(p), getChildrenKeyboard(p));
                return bot.answerCallbackQuery(query.id, { text: '✅ آموزش داده شد!', show_alert: true });
            }

            if (data.startsWith('child_heir_')) {
                const { assignHeir, formatChildren, getChildrenKeyboard } = require('../offspring');
                assignHeir(p, data.replace('child_heir_', ''));
                await del();
                await send(formatChildren(p), getChildrenKeyboard(p));
                return bot.answerCallbackQuery(query.id, { text: '✅ ولیعهد انتخاب شد!', show_alert: true });
            }

            if (data === 'child_tournament') {
                const { holdTournament, formatChildren, getChildrenKeyboard } = require('../offspring');
                const result = holdTournament(p);
                await del();
                await send(result.message, getChildrenKeyboard(p));
                return bot.answerCallbackQuery(query.id, { text: '🏆 تورنمنت برگزار شد!' });
            }

        } catch (e) {
            console.log('Empire handler error:', e.message);
            return bot.answerCallbackQuery(query.id, { text: '❌ ' + (e.message || '').substring(0, 60), show_alert: true });
        }
    });

    // ============ پیام‌های متنی ============
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
            const msgId = empireState[chatId].msgId;
            delete empireState[chatId];
            if (msgId) { await bot.deleteMessage(chatId, msgId).catch(() => {}); }
            await bot.sendMessage(chatId, formatEmpire(p), { parse_mode: 'Markdown', ...getEmpireKeyboard(p) });
            return;
        }

        if (empireState[chatId]?.action === 'assignRole') {
            const { assignRole, formatEmpire, getEmpireKeyboard } = require('../empire');
            const result = assignRole(p, empireState[chatId].roleKey, text.trim());
            const msgId = empireState[chatId].msgId;
            delete empireState[chatId];
            if (msgId) { await bot.deleteMessage(chatId, msgId).catch(() => {}); }
            await bot.sendMessage(chatId, formatEmpire(p), { parse_mode: 'Markdown', ...getEmpireKeyboard(p) });
            return;
        }
    });
}

module.exports = { setupEmpireHandlers };