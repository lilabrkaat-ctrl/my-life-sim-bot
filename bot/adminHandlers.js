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

        try {
            const { adminState } = require('./core');

            // ============ منابع پایه (نیاز به عدد) ============
            if (data === 'admin_gold') {
                adminState[chatId] = { step: 'amount', action: 'gold' };
                await bot.sendMessage(chatId, '💰 *چقدر طلا اضافه بشه؟*\nعدد رو تایپ کن:', { parse_mode: 'Markdown' });
                return bot.answerCallbackQuery(query.id);
            }

            if (data === 'admin_xp') {
                adminState[chatId] = { step: 'amount', action: 'xp' };
                await bot.sendMessage(chatId, '✨ *چقدر XP اضافه بشه؟*\nعدد رو تایپ کن:', { parse_mode: 'Markdown' });
                return bot.answerCallbackQuery(query.id);
            }

            if (data === 'admin_score') {
                adminState[chatId] = { step: 'amount', action: 'score' };
                await bot.sendMessage(chatId, '🏆 *چقدر امتیاز اضافه بشه؟*\nعدد رو تایپ کن:', { parse_mode: 'Markdown' });
                return bot.answerCallbackQuery(query.id);
            }

            if (data === 'admin_energy') {
                adminState[chatId] = { step: 'amount', action: 'energy' };
                await bot.sendMessage(chatId, '⚡ *چقدر انرژی اضافه بشه؟*\nعدد رو تایپ کن:', { parse_mode: 'Markdown' });
                return bot.answerCallbackQuery(query.id);
            }

            if (data === 'admin_attack') {
                adminState[chatId] = { step: 'amount', action: 'attack' };
                await bot.sendMessage(chatId, '⚔️ *چقدر حمله اضافه بشه؟*\nعدد رو تایپ کن:', { parse_mode: 'Markdown' });
                return bot.answerCallbackQuery(query.id);
            }

            if (data === 'admin_defense') {
                adminState[chatId] = { step: 'amount', action: 'defense' };
                await bot.sendMessage(chatId, '🛡️ *چقدر دفاع اضافه بشه؟*\nعدد رو تایپ کن:', { parse_mode: 'Markdown' });
                return bot.answerCallbackQuery(query.id);
            }

            if (data === 'admin_level') {
                adminState[chatId] = { step: 'amount', action: 'level' };
                await bot.sendMessage(chatId, '⭐ *چقدر سطح اضافه بشه؟*\nعدد رو تایپ کن:', { parse_mode: 'Markdown' });
                return bot.answerCallbackQuery(query.id);
            }

            if (data === 'admin_day') {
                adminState[chatId] = { step: 'amount', action: 'day' };
                await bot.sendMessage(chatId, '📅 *روز چندم بشه؟ (۱ تا ۷)*\nعدد رو تایپ کن:', { parse_mode: 'Markdown' });
                return bot.answerCallbackQuery(query.id);
            }

            if (data === 'admin_condom') {
                adminState[chatId] = { step: 'amount', action: 'condom' };
                await bot.sendMessage(chatId, '🎈 *چندتا کاندوم اضافه بشه؟*\nعدد رو تایپ کن:', { parse_mode: 'Markdown' });
                return bot.answerCallbackQuery(query.id);
            }

            // ============ عملیات فوری (بدون عدد) ============
            if (data === 'admin_heal') {
                const result = adminCommand(p, 'heal', []);
                await bot.editMessageText(result.message, { chat_id: chatId, message_id: msgId, parse_mode: 'Markdown', ...getAdminMainKeyboard() });
                return bot.answerCallbackQuery(query.id, { text: 'شفا انجام شد!' });
            }

            if (data === 'admin_nextday') {
                const result = adminCommand(p, 'nextday', []);
                await bot.editMessageText(result.message, { chat_id: chatId, message_id: msgId, parse_mode: 'Markdown', ...getAdminMainKeyboard() });
                return bot.answerCallbackQuery(query.id, { text: 'روز بعد!' });
            }

            if (data === 'admin_unlock') {
                const result = adminCommand(p, 'unlock', []);
                await bot.editMessageText(result.message, { chat_id: chatId, message_id: msgId, parse_mode: 'Markdown', ...getAdminMainKeyboard() });
                return bot.answerCallbackQuery(query.id, { text: 'همه چیز باز شد!' });
            }

            if (data === 'admin_max') {
                const result = adminCommand(p, 'max', []);
                await bot.editMessageText(result.message, { chat_id: chatId, message_id: msgId, parse_mode: 'Markdown', ...getAdminMainKeyboard() });
                return bot.answerCallbackQuery(query.id, { text: 'مکس کامل شد! 🎉', show_alert: true });
            }

            if (data === 'admin_god') {
                const result = adminCommand(p, 'god', []);
                await bot.editMessageText(result.message, { chat_id: chatId, message_id: msgId, parse_mode: 'Markdown', ...getAdminMainKeyboard() });
                return bot.answerCallbackQuery(query.id, { text: 'گاد مود! 🔱', show_alert: true });
            }

            if (data === 'admin_quest') {
                const result = adminCommand(p, 'quest', []);
                await bot.editMessageText(result.message, { chat_id: chatId, message_id: msgId, parse_mode: 'Markdown', ...getAdminMainKeyboard() });
                return bot.answerCallbackQuery(query.id);
            }

            if (data === 'admin_completequest') {
                const result = adminCommand(p, 'completequest', []);
                await bot.editMessageText(result.message, { chat_id: chatId, message_id: msgId, parse_mode: 'Markdown', ...getAdminMainKeyboard() });
                return bot.answerCallbackQuery(query.id);
            }

            if (data === 'admin_save') {
                const result = adminCommand(p, 'save', []);
                await bot.editMessageText(result.message, { chat_id: chatId, message_id: msgId, parse_mode: 'Markdown', ...getAdminMainKeyboard() });
                return bot.answerCallbackQuery(query.id);
            }

            if (data === 'admin_reset') {
                const result = adminCommand(p, 'reset', []);
                await bot.editMessageText(result.message, { chat_id: chatId, message_id: msgId, parse_mode: 'Markdown', ...getAdminMainKeyboard() });
                return bot.answerCallbackQuery(query.id, { text: 'ریست شد!', show_alert: true });
            }

            if (data === 'admin_help') {
                const result = adminCommand(p, 'help', []);
                await bot.editMessageText(result.message, { chat_id: chatId, message_id: msgId, parse_mode: 'Markdown', ...getAdminMainKeyboard() });
                return bot.answerCallbackQuery(query.id);
            }

            if (data === 'admin_users') {
                const result = adminCommand(p, 'users', []);
                await bot.editMessageText(result.message, { chat_id: chatId, message_id: msgId, parse_mode: 'Markdown', ...getAdminMainKeyboard() });
                return bot.answerCallbackQuery(query.id);
            }

            if (data === 'admin_top') {
                const result = adminCommand(p, 'top', []);
                await bot.editMessageText(result.message, { chat_id: chatId, message_id: msgId, parse_mode: 'Markdown', ...getAdminMainKeyboard() });
                return bot.answerCallbackQuery(query.id);
            }

            if (data === 'admin_info') {
                const result = adminCommand(p, 'info', []);
                await bot.editMessageText(result.message, { chat_id: chatId, message_id: msgId, parse_mode: 'Markdown', ...getAdminMainKeyboard() });
                return bot.answerCallbackQuery(query.id);
            }

            if (data === 'admin_income') {
                const result = adminCommand(p, 'income', []);
                await bot.editMessageText(result.message, { chat_id: chatId, message_id: msgId, parse_mode: 'Markdown', ...getAdminMainKeyboard() });
                return bot.answerCallbackQuery(query.id);
            }

            if (data === 'admin_petfood') {
                const result = adminCommand(p, 'petfood', []);
                await bot.editMessageText(result.message, { chat_id: chatId, message_id: msgId, parse_mode: 'Markdown', ...getAdminMainKeyboard() });
                return bot.answerCallbackQuery(query.id);
            }

            if (data === 'admin_queencare') {
                const result = adminCommand(p, 'queencare', []);
                await bot.editMessageText(result.message, { chat_id: chatId, message_id: msgId, parse_mode: 'Markdown', ...getAdminMainKeyboard() });
                return bot.answerCallbackQuery(query.id);
            }

            if (data === 'admin_birth') {
                const result = adminCommand(p, 'birth', []);
                await bot.editMessageText(result.message, { chat_id: chatId, message_id: msgId, parse_mode: 'Markdown', ...getAdminMainKeyboard() });
                return bot.answerCallbackQuery(query.id);
            }

            // ============ عملیات با پارامتر ============
            if (data === 'admin_item') {
                adminState[chatId] = { step: 'item_name', action: 'item' };
                await bot.sendMessage(chatId, '🎁 *چه آیتمی می‌خوای بدی؟*\n\n`wood, stone, meat, water, skin, iron, gold, ring, spell, key, diamond, finisher, condom`\n\nاسم آیتم رو تایپ کن:', { parse_mode: 'Markdown' });
                return bot.answerCallbackQuery(query.id);
            }

            if (data === 'admin_pet') {
                adminState[chatId] = { step: 'pet_type', action: 'pet' };
                await bot.sendMessage(chatId, '🐾 *چه حیوونی می‌خوای؟*\n\n`wolf_cub, wolf_spirit, dragon_egg, dragon_ancient`\n\nنوع حیوون رو تایپ کن:', { parse_mode: 'Markdown' });
                return bot.answerCallbackQuery(query.id);
            }

            if (data === 'admin_box') {
                adminState[chatId] = { step: 'box_type', action: 'box' };
                await bot.sendMessage(chatId, '📦 *چه صندوقی می‌خوای؟*\n\n`wooden, silver, golden, legendary`\n\nنوع صندوق رو تایپ کن:', { parse_mode: 'Markdown' });
                return bot.answerCallbackQuery(query.id);
            }

            if (data === 'admin_openbox') {
                adminState[chatId] = { step: 'box_type', action: 'openbox' };
                await bot.sendMessage(chatId, '📦 *کدوم صندوق رو باز کنم؟*\n\n`wooden, silver, golden, legendary`\n\nنوع صندوق رو تایپ کن:', { parse_mode: 'Markdown' });
                return bot.answerCallbackQuery(query.id);
            }

            if (data === 'admin_child') {
                adminState[chatId] = { step: 'child_class', action: 'child' };
                await bot.sendMessage(chatId, '👶 *چه کلاسی می‌خوای؟*\n\n`warrior, mage, guardian, hunter, sage, prince`\n\nکلاس رو تایپ کن:', { parse_mode: 'Markdown' });
                return bot.answerCallbackQuery(query.id);
            }

            if (data === 'admin_pregnant') {
                adminState[chatId] = { step: 'npc_name', action: 'pregnant' };
                await bot.sendMessage(chatId, '🤰 *کی رو باردار کنم؟*\n\nاسم NPC توی خونه رو تایپ کن:', { parse_mode: 'Markdown' });
                return bot.answerCallbackQuery(query.id);
            }

            if (data === 'admin_addqueen') {
                adminState[chatId] = { step: 'npc_name', action: 'addqueen' };
                await bot.sendMessage(chatId, '👸 *کدوم NPC رو ملکه کنم؟*\n\nاسم NPC رو تایپ کن:', { parse_mode: 'Markdown' });
                return bot.answerCallbackQuery(query.id);
            }

            if (data === 'admin_empirelevel') {
                adminState[chatId] = { step: 'amount', action: 'empirelevel' };
                await bot.sendMessage(chatId, '🏛️ *سطح امپراطوری چند باشه؟ (۰ تا ۶)*\nعدد رو تایپ کن:', { parse_mode: 'Markdown' });
                return bot.answerCallbackQuery(query.id);
            }

            if (data === 'admin_population') {
                adminState[chatId] = { step: 'amount', action: 'population' };
                await bot.sendMessage(chatId, '👥 *چند نفر اضافه بشن؟*\nعدد رو تایپ کن:', { parse_mode: 'Markdown' });
                return bot.answerCallbackQuery(query.id);
            }

            if (data === 'admin_food') {
                adminState[chatId] = { step: 'amount', action: 'food' };
                await bot.sendMessage(chatId, '🍞 *چقدر غذا اضافه بشه؟*\nعدد رو تایپ کن:', { parse_mode: 'Markdown' });
                return bot.answerCallbackQuery(query.id);
            }

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

        // عملیات با عدد
        if (state.step === 'amount') {
            const num = parseInt(text);
            if (isNaN(num) || num < 0) {
                return bot.sendMessage(chatId, '❌ یه عدد معتبر وارد کن!');
            }
            const result = adminCommand(p, state.action, [text]);
            delete adminState[chatId];
            return bot.sendMessage(chatId, result.message, { parse_mode: 'Markdown', ...getAdminMainKeyboard() });
        }

        // عملیات با متن (آیتم، حیوون، NPC...)
        if (state.step === 'item_name') {
            const result = adminCommand(p, 'item', [text, '10']);
            delete adminState[chatId];
            return bot.sendMessage(chatId, result.message, { parse_mode: 'Markdown', ...getAdminMainKeyboard() });
        }

        if (state.step === 'pet_type') {
            const result = adminCommand(p, 'pet', [text]);
            delete adminState[chatId];
            return bot.sendMessage(chatId, result.message, { parse_mode: 'Markdown', ...getAdminMainKeyboard() });
        }

        if (state.step === 'box_type') {
            const result = adminCommand(p, state.action, [text]);
            delete adminState[chatId];
            return bot.sendMessage(chatId, result.message, { parse_mode: 'Markdown', ...getAdminMainKeyboard() });
        }

        if (state.step === 'child_class') {
            const result = adminCommand(p, 'child', [text, 'male']);
            delete adminState[chatId];
            return bot.sendMessage(chatId, result.message, { parse_mode: 'Markdown', ...getAdminMainKeyboard() });
        }

        if (state.step === 'npc_name') {
            const result = adminCommand(p, state.action, [text]);
            delete adminState[chatId];
            return bot.sendMessage(chatId, result.message, { parse_mode: 'Markdown', ...getAdminMainKeyboard() });
        }
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