const { bot, player, mainMenu } = require('./core');

function setupPeopleHandlers() {

    bot.on('callback_query', async (query) => {
        const chatId = query.message.chat.id;
        const msgId = query.message.message_id;
        const data = query.data;
        const p = player.getPlayer(chatId);

        if (!p) return;
        if (!data || !data.startsWith('people_')) return;

        try {
            const del = () => bot.deleteMessage(chatId, msgId).catch(() => {});
            const send = (text, kb) => bot.sendMessage(chatId, text, { parse_mode: 'Markdown', ...(kb || mainMenu()) });

            // ============ منوی مردم ============
            if (data === 'people_menu') {
                const { formatPeople, getPeopleKeyboard } = require('../people');
                await del();
                await send(formatPeople(p), getPeopleKeyboard(p));
                return bot.answerCallbackQuery(query.id);
            }

            // ============ مالیات ============
            if (data === 'people_tax') {
                const { initPeople, collectTaxes, formatPeople, getPeopleKeyboard } = require('../people');
                initPeople(p);
                const result = collectTaxes(p);
                await del();
                await send(formatPeople(p), getPeopleKeyboard(p));
                return bot.answerCallbackQuery(query.id, { text: result.message?.replace(/[*_]/g, '').substring(0, 80) || '✅', show_alert: true });
            }

            // ============ زمین‌ها ============
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
                return bot.answerCallbackQuery(query.id, { text: '✅', show_alert: true });
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
                return bot.answerCallbackQuery(query.id, { text: '✅', show_alert: true });
            }

            // ============ ساختمان‌ها ============
            if (data === 'people_buildings') {
                const { getBuildingKeyboard } = require('../people');
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
                return bot.answerCallbackQuery(query.id, { text: result.success ? '✅ ساخته شد!' : result.message.replace(/[*_]/g, '').substring(0, 60), show_alert: true });
            }

            // ============ تصمیم‌ها ============
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

        } catch (e) {
            console.log('People handler error:', e.message);
            return bot.answerCallbackQuery(query.id, { text: '❌ ' + (e.message || '').substring(0, 60), show_alert: true });
        }
    });
}

module.exports = { setupPeopleHandlers };