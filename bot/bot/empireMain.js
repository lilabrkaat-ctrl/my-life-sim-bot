const { bot, player, mainMenu } = require('./core');

function setupEmpireMain() {

    bot.on('callback_query', async (query) => {
        const chatId = query.message.chat.id;
        const msgId = query.message.message_id;
        const data = query.data;
        const p = player.getPlayer(chatId);

        if (!p || !data) return;
        if (!data.startsWith('empire_') && data !== 'back_to_main' && data !== 'empire_back') return;

        try {
            const del = async () => { try { await bot.deleteMessage(chatId, msgId); } catch(e) {} };
            const send = (text, kb) => bot.sendMessage(chatId, text, { parse_mode: 'Markdown', ...(kb || mainMenu()) });

            // ============ برگشت ============
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

            // ============ درآمد ============
            if (data === 'empire_income') {
                const { collectEmpireIncome, formatEmpire, getEmpireKeyboard } = require('../empire');
                const r = collectEmpireIncome(p);
                await del();
                await send(formatEmpire(p), getEmpireKeyboard(p));
                return bot.answerCallbackQuery(query.id, { text: r.success ? '✅' : '⏰', show_alert: true });
            }

            // ============ نام سلسله ============
            if (data === 'empire_dynasty') {
                require('./core').empireState[chatId] = { action: 'setDynasty', msgId };
                await bot.sendMessage(chatId, '📝 *اسم سلسله جدید رو تایپ کن:*', { parse_mode: 'Markdown' });
                return bot.answerCallbackQuery(query.id);
            }

            // ============ انتصاب ============
            if (data === 'empire_roles_menu') {
                const { empireRoles } = require('../empire');
                const btns = [];
                for (let key in empireRoles) {
                    const role = empireRoles[key];
                    if (p.empire?.level >= role.minLevel) {
                        const assigned = p.empire.roles?.[key];
                        if (assigned) {
                            btns.push([{ text: `✅ ${role.emoji} ${role.name}: ${assigned.childName || 'منصوب'}`, callback_data: 'none' }]);
                        } else {
                            let req = role.needsHeir ? ' (ولیعهد)' : role.childClass ? ` (${role.childClass})` : '';
                            btns.push([{ text: `${role.emoji} ${role.name}${req}`, callback_data: `empire_assign_${key}` }]);
                        }
                    }
                }
                btns.push([{ text: '🔙 برگشت', callback_data: 'empire_back' }]);
                await del();
                await send('📋 *انتصاب سمت‌ها*', { reply_markup: { inline_keyboard: btns } });
                return bot.answerCallbackQuery(query.id);
            }

            if (data.startsWith('empire_assign_') && !data.startsWith('empire_assign_do_')) {
                const roleKey = data.replace('empire_assign_', '');
                const alive = p.children?.filter(c => c.isAlive) || [];
                if (!alive.length) return bot.answerCallbackQuery(query.id, { text: '❌ فرزندی نداری!', show_alert: true });
                const btns = alive.map(c => [{ text: `${c.emoji} ${c.name} | ${c.classEmoji} ${c.className}`, callback_data: `empire_assign_do_${roleKey}_${c.id}` }]);
                btns.push([{ text: '🔙 برگشت', callback_data: 'empire_roles_menu' }]);
                await del();
                await send('👶 *کدوم فرزند رو منصوب کنی؟*', { reply_markup: { inline_keyboard: btns } });
                return bot.answerCallbackQuery(query.id);
            }

            if (data.startsWith('empire_assign_do_')) {
                const parts = data.replace('empire_assign_do_', '').split('_');
                const { assignRole, formatEmpire, getEmpireKeyboard } = require('../empire');
                const r = assignRole(p, parts[0], parts.slice(1).join('_'));
                await del();
                await send(formatEmpire(p), getEmpireKeyboard(p));
                return bot.answerCallbackQuery(query.id, { text: r.success ? '✅' : r.message?.substring(0, 80), show_alert: true });
            }

            // ============ عجایب ============
            if (data === 'empire_wonders_menu') {
                const { wonders } = require('../empire');
                const btns = [];
                for (let key in wonders) {
                    const w = wonders[key];
                    if (p.empire.wonders?.includes(key)) {
                        btns.push([{ text: `✅ ${w.emoji} ${w.name}`, callback_data: 'none' }]);
                    } else if (p.empire.level >= w.minLevel) {
                        btns.push([{ text: `${w.emoji} ${w.name} - ${w.description}`, callback_data: `empire_wonder_${key}` }]);
                    }
                }
                btns.push([{ text: '🔙 برگشت', callback_data: 'empire_back' }]);
                await del();
                await send('🏗️ *احداث عجایب*', { reply_markup: { inline_keyboard: btns } });
                return bot.answerCallbackQuery(query.id);
            }

            if (data.startsWith('empire_wonder_')) {
                const { buildWonder, formatEmpire, getEmpireKeyboard } = require('../empire');
                const r = buildWonder(p, data.replace('empire_wonder_', ''));
                await del();
                await send(formatEmpire(p), getEmpireKeyboard(p));
                return bot.answerCallbackQuery(query.id, { text: r.success ? '✅' : r.message?.substring(0, 60), show_alert: true });
            }

        } catch (e) {
            console.log('❌ Empire Main error:', e.message);
            try { await bot.answerCallbackQuery(query.id, { text: '❌ خطا!', show_alert: true }); } catch(e2) {}
        }
    });

    // پیام متنی برای نام سلسله
    bot.on('message', async (msg) => {
        const chatId = msg.chat.id;
        const text = msg.text;
        if (!text || text.startsWith('/') || text.startsWith('🔙')) return;
        const p = player.getPlayer(chatId);
        if (!p) return;
        const st = require('./core').empireState[chatId];
        if (st?.action === 'setDynasty') {
            const { setDynastyName, formatEmpire, getEmpireKeyboard } = require('../empire');
            setDynastyName(p, text);
            delete require('./core').empireState[chatId];
            await bot.sendMessage(chatId, formatEmpire(p), { parse_mode: 'Markdown', ...getEmpireKeyboard(p) });
        }
    });
}

module.exports = { setupEmpireMain };