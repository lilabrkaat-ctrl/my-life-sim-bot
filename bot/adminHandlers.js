const { bot, player, mainMenu } = require('./core');

function setupAdminHandlers() {

    // =============================================
    // 👑 منوی اصلی ادمین (با دستور admin)
    // =============================================
    bot.onText(/^admin$|^ادمین$/, async (msg) => {
        const chatId = msg.chat.id;
        const p = player.getPlayer(chatId);
        if (!p) return;
        
        const { isAdmin } = require('../admin');
        if (!isAdmin(chatId)) return;
        
        await bot.sendMessage(chatId, '👑 *پنل مدیریت ادمین*\n\nیک گزینه رو انتخاب کن:', {
            parse_mode: 'Markdown',
            ...getAdminMainKeyboard()
        });
    });

    // =============================================
    // 🎮 هندلر callback_query ادمین
    // =============================================
    bot.on('callback_query', async (query) => {
        const chatId = query.message.chat.id;
        const msgId = query.message.message_id;
        const data = query.data;
        const p = player.getPlayer(chatId);

        if (!p) return;
        
        const { isAdmin, adminCommand } = require('../admin');
        if (!isAdmin(chatId)) return bot.answerCallbackQuery(query.id, { text: '❌ فقط ادمین!', show_alert: true });
        
        // فقط callbackهای admin رو هندل کن
        if (!data || !data.startsWith('admin_')) return;

        try {
            const { adminState } = require('./core');
            const del = () => bot.deleteMessage(chatId, msgId).catch(() => {});

            // ============ منابع پایه (نیاز به عدد) ============
            const askAmount = (action, emoji, text) => {
                adminState[chatId] = { step: 'amount', action };
                bot.sendMessage(chatId, `${emoji} *${text}*\nعدد رو تایپ کن:`, { parse_mode: 'Markdown' });
            };

            if (data === 'admin_gold') { askAmount('gold', '💰', 'چقدر طلا اضافه بشه؟'); return bot.answerCallbackQuery(query.id); }
            if (data === 'admin_xp') { askAmount('xp', '✨', 'چقدر XP اضافه بشه؟'); return bot.answerCallbackQuery(query.id); }
            if (data === 'admin_score') { askAmount('score', '🏆', 'چقدر امتیاز اضافه بشه؟'); return bot.answerCallbackQuery(query.id); }
            if (data === 'admin_energy') { askAmount('energy', '⚡', 'چقدر انرژی اضافه بشه؟'); return bot.answerCallbackQuery(query.id); }
            if (data === 'admin_attack') { askAmount('attack', '⚔️', 'چقدر حمله اضافه بشه؟'); return bot.answerCallbackQuery(query.id); }
            if (data === 'admin_defense') { askAmount('defense', '🛡️', 'چقدر دفاع اضافه بشه؟'); return bot.answerCallbackQuery(query.id); }
            if (data === 'admin_level') { askAmount('level', '⭐', 'چقدر سطح اضافه بشه؟'); return bot.answerCallbackQuery(query.id); }
            if (data === 'admin_day') { askAmount('day', '📅', 'روز چندم بشه؟ (۱ تا ۷)'); return bot.answerCallbackQuery(query.id); }
            if (data === 'admin_condom') { askAmount('condom', '🎈', 'چندتا کاندوم اضافه بشه؟'); return bot.answerCallbackQuery(query.id); }
            if (data === 'admin_empirelevel') { askAmount('empirelevel', '🏛️', 'سطح امپراطوری چند باشه؟ (۰ تا ۶)'); return bot.answerCallbackQuery(query.id); }
            if (data === 'admin_population') { askAmount('population', '👥', 'چند نفر اضافه بشن؟'); return bot.answerCallbackQuery(query.id); }
            if (data === 'admin_food') { askAmount('food', '🍞', 'چقدر غذا اضافه بشه؟'); return bot.answerCallbackQuery(query.id); }

            // ============ عملیات با پارامتر متنی ============
            if (data === 'admin_item') {
                adminState[chatId] = { step: 'item_name', action: 'item' };
                await bot.sendMessage(chatId, '🎁 *چه آیتمی؟*\nwood, stone, meat, water, skin, iron, gold, ring, spell, key, diamond, finisher, condom\n\nاسم آیتم رو تایپ کن:', { parse_mode: 'Markdown' });
                return bot.answerCallbackQuery(query.id);
            }

            if (data === 'admin_pet') {
                adminState[chatId] = { step: 'pet_type', action: 'pet' };
                await bot.sendMessage(chatId, '🐾 *چه حیوونی؟*\nwolf_cub, wolf_spirit, dragon_egg, dragon_ancient\n\nنوع حیوون رو تایپ کن:', { parse_mode: 'Markdown' });
                return bot.answerCallbackQuery(query.id);
            }

            if (data === 'admin_box') {
                adminState[chatId] = { step: 'box_type', action: 'box' };
                await bot.sendMessage(chatId, '📦 *چه صندوقی؟*\nwooden, silver, golden, legendary\n\nنوع صندوق رو تایپ کن:', { parse_mode: 'Markdown' });
                return bot.answerCallbackQuery(query.id);
            }

            if (data === 'admin_openbox') {
                adminState[chatId] = { step: 'box_type', action: 'openbox' };
                await bot.sendMessage(chatId, '📦 *کدوم صندوق رو باز کنم؟*\nwooden, silver, golden, legendary\n\nنوع صندوق رو تایپ کن:', { parse_mode: 'Markdown' });
                return bot.answerCallbackQuery(query.id);
            }

            if (data === 'admin_child') {
                adminState[chatId] = { step: 'child_class', action: 'child' };
                await bot.sendMessage(chatId, '👶 *چه کلاسی؟*\nwarrior, mage, guardian, hunter, sage, prince\n\nکلاس رو تایپ کن:', { parse_mode: 'Markdown' });
                return bot.answerCallbackQuery(query.id);
            }

            if (data === 'admin_pregnant') {
                adminState[chatId] = { step: 'npc_name', action: 'pregnant' };
                await bot.sendMessage(chatId, '🤰 *کی رو باردار کنم؟*\nاسم NPC توی خونه رو تایپ کن:', { parse_mode: 'Markdown' });
                return bot.answerCallbackQuery(query.id);
            }

            if (data === 'admin_addqueen') {
                adminState[chatId] = { step: 'npc_name', action: 'addqueen' };
                await bot.sendMessage(chatId, '👸 *کدوم NPC رو ملکه کنم؟*\nاسم NPC رو تایپ کن:', { parse_mode: 'Markdown' });
                return bot.answerCallbackQuery(query.id);
            }

            // ============ عملیات فوری ============
            const doQuick = async (cmd, args, text) => {
                const result = adminCommand(p, cmd, args);
                await del();
                await bot.sendMessage(chatId, result.message, { parse_mode: 'Markdown', ...getAdminMainKeyboard() });
                return bot.answerCallbackQuery(query.id, { text, show_alert: true });
            };

            if (data === 'admin_heal') return doQuick('heal', [], '❤️ شفا داده شد!');
            if (data === 'admin_nextday') return doQuick('nextday', [], '📅 روز بعد!');
            if (data === 'admin_unlock') return doQuick('unlock', [], '🔓 همه چیز باز شد!');
            if (data === 'admin_max') return doQuick('max', [], '👑 مکس کامل شد!');
            if (data === 'admin_god') return doQuick('god', [], '🔱 گاد مود!');
            if (data === 'admin_quest') return doQuick('quest', [], '📋 ماموریت جدید!');
            if (data === 'admin_completequest') return doQuick('completequest', [], '✅ ماموریت تکمیل شد!');
            if (data === 'admin_save') return doQuick('save', [], '💾 ذخیره شد!');
            if (data === 'admin_reset') return doQuick('reset', [], '🔄 ریست شد!');
            if (data === 'admin_help') return doQuick('help', [], '❓ راهنما');
            if (data === 'admin_users') return doQuick('users', [], '👥');
            if (data === 'admin_top') return doQuick('top', [], '🏆');
            if (data === 'admin_info') return doQuick('info', [], '📊');
            if (data === 'admin_income') return doQuick('income', [], '💰 درآمد!');
            if (data === 'admin_petfood') return doQuick('petfood', [], '🍖 غذا داده شد!');
            if (data === 'admin_queencare') return doQuick('queencare', [], '💆 رسیدگی شد!');
            if (data === 'admin_birth') return doQuick('birth', [], '👶 زایمان انجام شد!');

        } catch (e) {
            console.log('Admin handler error:', e.message);
            return bot.answerCallbackQuery(query.id, { text: '❌ خطا!' });
        }
    });

    // =============================================
    // 🔢 پردازش عدد/متن وارد شده توسط ادمین
    // =============================================
    bot.on('message', async (msg) => {
        const chatId = msg.chat.id;
        const text = msg.text;
        if (!text || text.startsWith('/') || text === 'admin' || text === 'ادمین') return;

        const p = player.getPlayer(chatId);
        if (!p) return;

        const { isAdmin, adminCommand } = require('../admin');
        if (!isAdmin(chatId)) return;

        const { adminState } = require('./core');
        const state = adminState[chatId];
        if (!state) return;

        const result = adminCommand(p, state.action, [text]);
        delete adminState[chatId];
        await bot.sendMessage(chatId, result.message, { parse_mode: 'Markdown', ...getAdminMainKeyboard() });
    });
}

// =============================================
// 👑 کیبورد شیشه‌ای ادمین
// =============================================
function getAdminMainKeyboard() {
    return {
        reply_markup: {
            inline_keyboard: [
                [
                    { text: '💰 طلا', callback_data: 'admin_gold' },
                    { text: '✨ XP', callback_data: 'admin_xp' },
                    { text: '🏆 امتیاز', callback_data: 'admin_score' }
                ],
                [
                    { text: '❤️ شفا', callback_data: 'admin_heal' },
                    { text: '⚡ انرژی', callback_data: 'admin_energy' },
                    { text: '🎈 کاندوم', callback_data: 'admin_condom' }
                ],
                [
                    { text: '⚔️ حمله', callback_data: 'admin_attack' },
                    { text: '🛡️ دفاع', callback_data: 'admin_defense' },
                    { text: '⭐ سطح', callback_data: 'admin_level' }
                ],
                [
                    { text: '🔓 آنلاک', callback_data: 'admin_unlock' },
                    { text: '👑 مکس کامل', callback_data: 'admin_max' },
                    { text: '🔱 گاد مود', callback_data: 'admin_god' }
                ],
                [{ text: '📅 روز بعد', callback_data: 'admin_nextday' }],
                [
                    { text: '🎁 دادن آیتم', callback_data: 'admin_item' },
                    { text: '🐺 حیوون', callback_data: 'admin_pet' }
                ],
                [
                    { text: '📦 صندوقچه', callback_data: 'admin_box' },
                    { text: '🔓 بازکردن صندوق', callback_data: 'admin_openbox' }
                ],
                [
                    { text: '📋 ماموریت جدید', callback_data: 'admin_quest' },
                    { text: '✅ تکمیل ماموریت', callback_data: 'admin_completequest' }
                ],
                [
                    { text: '👶 فرزند', callback_data: 'admin_child' },
                    { text: '🤰 بارداری', callback_data: 'admin_pregnant' },
                    { text: '👶 زایمان', callback_data: 'admin_birth' }
                ],
                [
                    { text: '👸 ملکه جدید', callback_data: 'admin_addqueen' },
                    { text: '💆 رسیدگی ملکه‌ها', callback_data: 'admin_queencare' }
                ],
                [
                    { text: '🏛️ سطح امپراطوری', callback_data: 'admin_empirelevel' },
                    { text: '💰 درآمد', callback_data: 'admin_income' }
                ],
                [
                    { text: '👥 جمعیت', callback_data: 'admin_population' },
                    { text: '🍞 غذا', callback_data: 'admin_food' }
                ],
                [
                    { text: '📊 اطلاعات', callback_data: 'admin_info' },
                    { text: '👥 کاربران', callback_data: 'admin_users' }
                ],
                [
                    { text: '🔄 ریست', callback_data: 'admin_reset' },
                    { text: '💾 ذخیره', callback_data: 'admin_save' },
                    { text: '❓ کمک', callback_data: 'admin_help' }
                ],
                [{ text: '🔙 بستن', callback_data: 'back_to_main' }]
            ]
        }
    };
}

module.exports = { setupAdminHandlers, getAdminMainKeyboard };