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

        if (!p || !data) return;
        
        // فیلتر callbackهای غیر امپراطوری
        if (data.startsWith('battle_') || data.startsWith('shop_') || data.startsWith('craft_') || 
            data.startsWith('prison_') || data.startsWith('house_') || data.startsWith('pet_') ||
            data.startsWith('lootbox_') || data.startsWith('quest_') || data.startsWith('admin_') ||
            data.startsWith('bm_') || data.startsWith('chamber_') || data.startsWith('audience_') ||
            data.startsWith('court_')) return;

        try {
            const del = async () => { 
                try { await bot.deleteMessage(chatId, msgId); } catch(e) {} 
            };

            const sendMsg = async (text, keyboard) => {
                try {
                    await bot.sendMessage(chatId, text, keyboard || mainMenu());
                } catch(e) {
                    await bot.sendMessage(chatId, text, mainMenu());
                }
            };

            // =============================================
            // 🔙 برگشت به منوی اصلی
            // =============================================
            if (data === 'back_to_main') {
                await del();
                const time = require('../player').getTimeOfDay(); 
                p.timeOfDay = time;
                const loc = require('../config').images.locations[p.location] || require('../config').images.locations.village;
                
                let text = '🏛️ *بقای باستانی*\n\n';
                text += `✨ ${p.name} | 📍 ${loc.emoji} ${loc.name}\n`;
                text += `${time.name} | 📅 روز ${p.gameDay || 1}/۷ | 🏆 ${p.score || 0} امتیاز`;
                
                await bot.sendMessage(chatId, text, { parse_mode: 'Markdown', ...mainMenu() });
                return bot.answerCallbackQuery(query.id);
            }

            // =============================================
            // 🔙 برگشت به منوی امپراطوری
            // =============================================
            if (data === 'empire_back') {
                const { formatEmpire, getEmpireKeyboard } = require('../empire');
                await del();
                await bot.sendMessage(chatId, formatEmpire(p), { parse_mode: 'Markdown', ...getEmpireKeyboard(p) });
                return bot.answerCallbackQuery(query.id);
            }

            // =============================================
            // 💰 جمع‌آوری درآمد امپراطوری
            // =============================================
            if (data === 'empire_income') {
                const { collectEmpireIncome, formatEmpire, getEmpireKeyboard } = require('../empire');
                const result = collectEmpireIncome(p);
                
                await del();
                
                if (result.success) {
                    await bot.sendMessage(chatId, result.message, { parse_mode: 'Markdown' });
                }
                
                await bot.sendMessage(chatId, formatEmpire(p), { parse_mode: 'Markdown', ...getEmpireKeyboard(p) });
                return bot.answerCallbackQuery(query.id, { text: result.success ? '✅ درآمد جمع شد!' : result.message?.replace(/[*_]/g, '').substring(0, 60), show_alert: true });
            }

            // =============================================
            // 📝 تغییر نام سلسله
            // =============================================
            if (data === 'empire_dynasty') {
                require('./core').empireState[chatId] = { action: 'setDynasty', msgId };
                await bot.sendMessage(chatId, '📝 *اسم سلسله جدید رو تایپ کن:*', { parse_mode: 'Markdown' });
                return bot.answerCallbackQuery(query.id);
            }

            // =============================================
            // 📋 انتصاب سمت‌ها
            // =============================================
            if (data === 'empire_roles_menu') {
                const { empireRoles } = require('../empire');
                const btns = [];
                
                for (let key in empireRoles) {
                    const role = empireRoles[key];
                    if (p.empire && p.empire.level >= role.minLevel) {
                        const assigned = p.empire.roles && p.empire.roles[key];
                        
                        if (assigned) {
                            let label = `✅ ${role.emoji} ${role.name}`;
                            if (assigned.childName) label += `: ${assigned.childName}`;
                            btns.push([{ text: label, callback_data: 'none' }]);
                        } else {
                            let req = '';
                            if (role.needsHeir) req = ' (فقط ولیعهد)';
                            else if (role.childClass) req = ` (فقط ${role.childClass})`;
                            btns.push([{ text: `${role.emoji} ${role.name}${req}`, callback_data: `empire_assign_${key}` }]);
                        }
                    }
                }
                
                btns.push([{ text: '🔙 برگشت', callback_data: 'empire_back' }]);
                
                await del();
                await bot.sendMessage(chatId, '📋 *انتصاب سمت‌ها*\n\nیک سمت خالی را انتخاب کنید:', { 
                    parse_mode: 'Markdown', 
                    reply_markup: { inline_keyboard: btns } 
                });
                return bot.answerCallbackQuery(query.id);
            }

            // انتخاب فرزند برای انتصاب
            if (data.startsWith('empire_assign_') && !data.startsWith('empire_assign_do_')) {
                const roleKey = data.replace('empire_assign_', '');
                const alive = p.children ? p.children.filter(c => c.isAlive) : [];
                
                if (alive.length === 0) {
                    return bot.answerCallbackQuery(query.id, { text: '❌ هیچ فرزند زنده‌ای نداری!', show_alert: true });
                }
                
                const btns = [];
                for (let child of alive) {
                    let label = `${child.emoji} ${child.name}`;
                    if (child.className) label += ` | ${child.classEmoji} ${child.className}`;
                    if (child.evolutionLevel) label += ` | Lv.${child.evolutionLevel}`;
                    if (child.isHeir) label += ' 👑';
                    
                    btns.push([{ text: label, callback_data: `empire_assign_do_${roleKey}_${child.id}` }]);
                }
                
                btns.push([{ text: '🔙 برگشت', callback_data: 'empire_roles_menu' }]);
                
                await del();
                await bot.sendMessage(chatId, '👶 *کدام فرزند را منصوب می‌کنی؟*', { 
                    parse_mode: 'Markdown', 
                    reply_markup: { inline_keyboard: btns } 
                });
                return bot.answerCallbackQuery(query.id);
            }

            // اجرای انتصاب
            if (data.startsWith('empire_assign_do_')) {
                const parts = data.replace('empire_assign_do_', '').split('_');
                const roleKey = parts[0];
                const childId = parts.slice(1).join('_');
                
                const { assignRole, formatEmpire, getEmpireKeyboard } = require('../empire');
                const result = assignRole(p, roleKey, childId);
                
                await del();
                await bot.sendMessage(chatId, formatEmpire(p), { parse_mode: 'Markdown', ...getEmpireKeyboard(p) });
                
                return bot.answerCallbackQuery(query.id, { 
                    text: result.success ? '✅ منصوب شد!' : (result.message || 'خطا').replace(/[*_]/g, '').substring(0, 80), 
                    show_alert: true 
                });
            }

            // =============================================
            // 🏗️ احداث عجایب
            // =============================================
            if (data === 'empire_wonders_menu') {
                const { wonders } = require('../empire');
                const btns = [];
                
                for (let key in wonders) {
                    const wonder = wonders[key];
                    const built = p.empire.wonders && p.empire.wonders.includes(key);
                    const canBuild = p.empire.level >= wonder.minLevel && !built;
                    
                    if (canBuild) {
                        // نمایش هزینه
                        let costText = '';
                        for (let item in wonder.cost) {
                            costText += `${wonder.cost[item]} ${item} `;
                        }
                        btns.push([{ text: `${wonder.emoji} ${wonder.name}`, callback_data: `empire_wonder_${key}` }]);
                        btns.push([{ text: `💰 ${costText}| ${wonder.description}`, callback_data: 'none' }]);
                    } else if (built) {
                        btns.push([{ text: `✅ ${wonder.emoji} ${wonder.name} (ساخته شده)`, callback_data: 'none' }]);
                    } else {
                        btns.push([{ text: `🔒 ${wonder.emoji} ${wonder.name} (نیاز به سطح ${wonder.minLevel})`, callback_data: 'none' }]);
                    }
                }
                
                btns.push([{ text: '🔙 برگشت', callback_data: 'empire_back' }]);
                
                await del();
                await bot.sendMessage(chatId, '🏗️ *احداث عجایب*\n\nروی هر عجایب کلیک کنید:', { 
                    parse_mode: 'Markdown', 
                    reply_markup: { inline_keyboard: btns } 
                });
                return bot.answerCallbackQuery(query.id);
            }

            // ساخت عجایب
            if (data.startsWith('empire_wonder_')) {
                const wonderKey = data.replace('empire_wonder_', '');
                const { buildWonder, formatEmpire, getEmpireKeyboard } = require('../empire');
                const result = buildWonder(p, wonderKey);
                
                await del();
                await bot.sendMessage(chatId, formatEmpire(p), { parse_mode: 'Markdown', ...getEmpireKeyboard(p) });
                
                return bot.answerCallbackQuery(query.id, { 
                    text: result.success ? '✅ ساخته شد!' : (result.message || 'خطا').replace(/[*_]/g, '').substring(0, 60), 
                    show_alert: true 
                });
            }

            // =============================================
            // 👶 فرزندان
            // =============================================
            if (data === 'children_menu') {
                const { formatChildren, getChildrenKeyboard } = require('../offspring');
                await del();
                
                const childrenText = formatChildren(p);
                if (childrenText && childrenText.length > 0) {
                    await bot.sendMessage(chatId, childrenText, { parse_mode: 'Markdown', ...getChildrenKeyboard(p) });
                } else {
                    await bot.sendMessage(chatId, '👶 *فرزندان*\n\n❌ هیچ فرزندی نداری!', { parse_mode: 'Markdown', ...getChildrenKeyboard(p) });
                }
                return bot.answerCallbackQuery(query.id);
            }

            // 🍼 غذا دادن به فرزند
            if (data.startsWith('child_feed_')) {
                const childId = data.replace('child_feed_', '');
                const { feedChild, getChildrenKeyboard } = require('../offspring');
                const result = feedChild(p, childId);
                
                console.log('🍼 feedChild result:', result);
                
                await del();
                
                if (result.success) {
                    await sendMsg(result.message, getChildrenKeyboard(p));
                } else {
                    await sendMsg(result.message, getChildrenKeyboard(p));
                }
                
                return bot.answerCallbackQuery(query.id, { 
                    text: result.success ? '✅ غذا داده شد!' : (result.message || 'خطا').replace(/[*_]/g, '').substring(0, 100), 
                    show_alert: true 
                });
            }

            // 📚 آموزش فرزند
            if (data.startsWith('child_train_')) {
                const childId = data.replace('child_train_', '');
                const { trainChild, getChildrenKeyboard } = require('../offspring');
                const result = trainChild(p, childId);
                
                console.log('📚 trainChild result:', result);
                
                await del();
                await sendMsg(result.message, getChildrenKeyboard(p));
                
                return bot.answerCallbackQuery(query.id, { 
                    text: result.success ? '✅ آموزش داده شد!' : (result.message || 'خطا').replace(/[*_]/g, '').substring(0, 100), 
                    show_alert: true 
                });
            }

            // 👑 ولیعهد کردن
            if (data.startsWith('child_heir_')) {
                const childId = data.replace('child_heir_', '');
                const { assignHeir, getChildrenKeyboard } = require('../offspring');
                const result = assignHeir(p, childId);
                
                console.log('👑 assignHeir result:', result);
                
                await del();
                await sendMsg(result.message, getChildrenKeyboard(p));
                
                return bot.answerCallbackQuery(query.id, { 
                    text: result.success ? '✅ ولیعهد انتخاب شد!' : (result.message || 'خطا').replace(/[*_]/g, ''), 
                    show_alert: true 
                });
            }

            // ⚔️ تورنمنت
            if (data === 'child_tournament') {
                const { holdTournament, getChildrenKeyboard } = require('../offspring');
                const result = holdTournament(p);
                
                console.log('⚔️ tournament result:', result);
                
                await del();
                
                if (result.success) {
                    await bot.sendMessage(chatId, result.message, { parse_mode: 'Markdown', ...getChildrenKeyboard(p) });
                } else {
                    await sendMsg(result.message, getChildrenKeyboard(p));
                }
                
                return bot.answerCallbackQuery(query.id, { 
                    text: result.success ? '🏆 تورنمنت برگزار شد!' : (result.message || 'خطا').replace(/[*_]/g, ''), 
                    show_alert: true 
                });
            }

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

        if (!p || !data) return;
        
        // فیلتر callbackهای غیر امپراطوری
        if (data.startsWith('battle_') || data.startsWith('shop_') || data.startsWith('craft_') || 
            data.startsWith('prison_') || data.startsWith('house_') || data.startsWith('pet_') ||
            data.startsWith('lootbox_') || data.startsWith('quest_') || data.startsWith('admin_') ||
            data.startsWith('bm_') || data.startsWith('chamber_') || data.startsWith('audience_') ||
            data.startsWith('court_')) return;

        try {
            const del = async () => { 
                try { await bot.deleteMessage(chatId, msgId); } catch(e) {} 
            };

            const sendMsg = async (text, keyboard) => {
                try {
                    await bot.sendMessage(chatId, text, keyboard || mainMenu());
                } catch(e) {
                    await bot.sendMessage(chatId, text, mainMenu());
                }
            };

            // =============================================
            // 🔙 برگشت به منوی اصلی
            // =============================================
            if (data === 'back_to_main') {
                await del();
                const time = require('../player').getTimeOfDay(); 
                p.timeOfDay = time;
                const loc = require('../config').images.locations[p.location] || require('../config').images.locations.village;
                let text = '🏛️ *بقای باستانی*\n\n';
                text += `✨ ${p.name} | 📍 ${loc.emoji} ${loc.name}\n`;
                text += `${time.name} | 📅 روز ${p.gameDay || 1}/۷ | 🏆 ${p.score || 0} امتیاز`;
                await bot.sendMessage(chatId, text, { parse_mode: 'Markdown', ...mainMenu() });
                return bot.answerCallbackQuery(query.id);
            }

            // =============================================
            // 🔙 برگشت به منوی امپراطوری
            // =============================================
            if (data === 'empire_back') {
                const { formatEmpire, getEmpireKeyboard } = require('../empire');
                await del();
                await bot.sendMessage(chatId, formatEmpire(p), { parse_mode: 'Markdown', ...getEmpireKeyboard(p) });
                return bot.answerCallbackQuery(query.id);
            }

            // =============================================
            // 💰 جمع‌آوری درآمد امپراطوری
            // =============================================
            if (data === 'empire_income') {
                const { collectEmpireIncome, formatEmpire, getEmpireKeyboard } = require('../empire');
                const result = collectEmpireIncome(p);
                await del();
                if (result.success) {
                    await bot.sendMessage(chatId, result.message, { parse_mode: 'Markdown' });
                }
                await bot.sendMessage(chatId, formatEmpire(p), { parse_mode: 'Markdown', ...getEmpireKeyboard(p) });
                return bot.answerCallbackQuery(query.id, { text: result.success ? '✅ درآمد جمع شد!' : result.message?.replace(/[*_]/g, '').substring(0, 60), show_alert: true });
            }

            // =============================================
            // 📝 تغییر نام سلسله
            // =============================================
            if (data === 'empire_dynasty') {
                require('./core').empireState[chatId] = { action: 'setDynasty', msgId };
                await bot.sendMessage(chatId, '📝 *اسم سلسله جدید رو تایپ کن:*', { parse_mode: 'Markdown' });
                return bot.answerCallbackQuery(query.id);
            }

            // =============================================
            // 📋 انتصاب سمت‌ها
            // =============================================
            if (data === 'empire_roles_menu') {
                const { empireRoles } = require('../empire');
                const btns = [];
                for (let key in empireRoles) {
                    const role = empireRoles[key];
                    if (p.empire && p.empire.level >= role.minLevel) {
                        const assigned = p.empire.roles && p.empire.roles[key];
                        if (assigned) {
                            let label = `✅ ${role.emoji} ${role.name}`;
                            if (assigned.childName) label += `: ${assigned.childName}`;
                            btns.push([{ text: label, callback_data: 'none' }]);
                        } else {
                            let req = '';
                            if (role.needsHeir) req = ' (فقط ولیعهد)';
                            else if (role.childClass) req = ` (فقط ${role.childClass})`;
                            btns.push([{ text: `${role.emoji} ${role.name}${req}`, callback_data: `empire_assign_${key}` }]);
                        }
                    }
                }
                btns.push([{ text: '🔙 برگشت', callback_data: 'empire_back' }]);
                await del();
                await bot.sendMessage(chatId, '📋 *انتصاب سمت‌ها*\n\nیک سمت خالی را انتخاب کنید:', { parse_mode: 'Markdown', reply_markup: { inline_keyboard: btns } });
                return bot.answerCallbackQuery(query.id);
            }

            if (data.startsWith('empire_assign_') && !data.startsWith('empire_assign_do_')) {
                const roleKey = data.replace('empire_assign_', '');
                const alive = p.children ? p.children.filter(c => c.isAlive) : [];
                if (alive.length === 0) return bot.answerCallbackQuery(query.id, { text: '❌ هیچ فرزند زنده‌ای نداری!', show_alert: true });
                const btns = [];
                for (let child of alive) {
                    let label = `${child.emoji} ${child.name}`;
                    if (child.className) label += ` | ${child.classEmoji} ${child.className}`;
                    if (child.evolutionLevel) label += ` | Lv.${child.evolutionLevel}`;
                    if (child.isHeir) label += ' 👑';
                    btns.push([{ text: label, callback_data: `empire_assign_do_${roleKey}_${child.id}` }]);
                }
                btns.push([{ text: '🔙 برگشت', callback_data: 'empire_roles_menu' }]);
                await del();
                await bot.sendMessage(chatId, '👶 *کدام فرزند را منصوب می‌کنی؟*', { parse_mode: 'Markdown', reply_markup: { inline_keyboard: btns } });
                return bot.answerCallbackQuery(query.id);
            }

            if (data.startsWith('empire_assign_do_')) {
                const parts = data.replace('empire_assign_do_', '').split('_');
                const { assignRole, formatEmpire, getEmpireKeyboard } = require('../empire');
                const result = assignRole(p, parts[0], parts.slice(1).join('_'));
                await del();
                await bot.sendMessage(chatId, formatEmpire(p), { parse_mode: 'Markdown', ...getEmpireKeyboard(p) });
                return bot.answerCallbackQuery(query.id, { text: result.success ? '✅' : result.message?.replace(/[*_]/g, '').substring(0, 80), show_alert: true });
            }

            // =============================================
            // 🏗️ احداث عجایب
            // =============================================
            if (data === 'empire_wonders_menu') {
                const { wonders } = require('../empire');
                const btns = [];
                for (let key in wonders) {
                    const wonder = wonders[key];
                    const built = p.empire.wonders && p.empire.wonders.includes(key);
                    const canBuild = p.empire.level >= wonder.minLevel && !built;
                    if (canBuild) {
                        let costText = '';
                        for (let item in wonder.cost) costText += `${wonder.cost[item]} ${item} `;
                        btns.push([{ text: `${wonder.emoji} ${wonder.name}`, callback_data: `empire_wonder_${key}` }]);
                        btns.push([{ text: `💰 ${costText}| ${wonder.description}`, callback_data: 'none' }]);
                    } else if (built) {
                        btns.push([{ text: `✅ ${wonder.emoji} ${wonder.name}`, callback_data: 'none' }]);
                    }
                }
                btns.push([{ text: '🔙 برگشت', callback_data: 'empire_back' }]);
                await del();
                await bot.sendMessage(chatId, '🏗️ *احداث عجایب*\n\nروی هر عجایب کلیک کنید:', { parse_mode: 'Markdown', reply_markup: { inline_keyboard: btns } });
                return bot.answerCallbackQuery(query.id);
            }

            if (data.startsWith('empire_wonder_')) {
                const { buildWonder, formatEmpire, getEmpireKeyboard } = require('../empire');
                const result = buildWonder(p, data.replace('empire_wonder_', ''));
                await del();
                await bot.sendMessage(chatId, formatEmpire(p), { parse_mode: 'Markdown', ...getEmpireKeyboard(p) });
                return bot.answerCallbackQuery(query.id, { text: result.success ? '✅' : result.message?.replace(/[*_]/g, '').substring(0, 60), show_alert: true });
            }

            // =============================================
            // 👶 فرزندان - منو
            // =============================================
            if (data === 'children_menu') {
                const { formatChildren, getChildrenKeyboard } = require('../offspring');
                await del();
                const text = formatChildren(p);
                await bot.sendMessage(chatId, text || '👶 *فرزندان*\n\n❌ هیچ فرزندی نداری!', { parse_mode: 'Markdown', ...getChildrenKeyboard(p) });
                return bot.answerCallbackQuery(query.id);
            }

            // 🍼 غذا دادن
            if (data.startsWith('child_feed_')) {
                const childId = data.replace('child_feed_', '');
                const { feedChild, getChildrenKeyboard } = require('../offspring');
                const result = feedChild(p, childId);
                console.log('🍼 feedChild:', result);
                await del();
                await sendMsg(result.message, getChildrenKeyboard(p));
                return bot.answerCallbackQuery(query.id, { text: result.success ? '✅' : '❌', show_alert: true });
            }

            // 📚 آموزش
            if (data.startsWith('child_train_')) {
                const childId = data.replace('child_train_', '');
                const { trainChild, getChildrenKeyboard } = require('../offspring');
                const result = trainChild(p, childId);
                console.log('📚 trainChild:', result);
                await del();
                await sendMsg(result.message, getChildrenKeyboard(p));
                return bot.answerCallbackQuery(query.id, { text: result.success ? '✅' : '❌', show_alert: true });
            }

            // 👑 ولیعهد
            if (data.startsWith('child_heir_')) {
                const childId = data.replace('child_heir_', '');
                const { assignHeir, getChildrenKeyboard } = require('../offspring');
                const result = assignHeir(p, childId);
                console.log('👑 assignHeir:', result);
                await del();
                await sendMsg(result.message, getChildrenKeyboard(p));
                return bot.answerCallbackQuery(query.id, { text: result.success ? '✅' : '❌', show_alert: true });
            }

            // ⚔️ تورنمنت
            if (data === 'child_tournament') {
                const { holdTournament, getChildrenKeyboard } = require('../offspring');
                const result = holdTournament(p);
                console.log('⚔️ tournament:', result);
                await del();
                if (result.success) {
                    await bot.sendMessage(chatId, result.message, { parse_mode: 'Markdown', ...getChildrenKeyboard(p) });
                } else {
                    await sendMsg(result.message, getChildrenKeyboard(p));
                }
                return bot.answerCallbackQuery(query.id, { text: result.success ? '🏆' : '❌', show_alert: true });
            }

            // =============================================
            // 👸 حرمسرا - منوی اصلی
            // =============================================
            if (data === 'harem_menu') {
                try {
                    const { formatHarem, getHaremKeyboard } = require('../queenHarem');
                    await del();
                    const haremText = formatHarem(p);
                    const haremKeyboard = getHaremKeyboard(p);
                    
                    if (haremText && haremText.includes('*')) {
                        await bot.sendMessage(chatId, haremText, { parse_mode: 'Markdown', ...haremKeyboard });
                    } else {
                        await bot.sendMessage(chatId, haremText, haremKeyboard);
                    }
                } catch(e) {
                    console.log('Harem menu error:', e.message);
                    await bot.sendMessage(chatId, '👸 *حرمسرا*\n\n❌ خطا در بارگذاری!', { parse_mode: 'Markdown' });
                }
                return bot.answerCallbackQuery(query.id);
            }

            // =============================================
            // 👸 انتخاب ملکه از لیست
            // =============================================
            if (data.startsWith('harem_queen_')) {
                const queenId = data.replace('harem_queen_', '');
                const queen = p.harem?.queens?.find(q => q.id === queenId);
                
                if (!queen) {
                    return bot.answerCallbackQuery(query.id, { text: '❌ ملکه پیدا نشد!', show_alert: true });
                }
                
                require('./core').haremState[chatId] = { queenId: queen.id };
                
                try {
                    const { getQueenKeyboard } = require('../queenHarem');
                    
                    let info = '';
                    info += queen.emoji + ' *' + queen.name + '*\n';
                    info += '━━━━━━━━━━━━━━━\n';
                    info += '👑 رتبه: ' + (queen.rank || 'کنیز') + '\n';
                    info += '💕 رابطه: ' + (queen.points || 0) + ' امتیاز\n';
                    info += '😊 روحیه: ' + (queen.mood || 50) + '%\n';
                    info += '❤️ سلامت: ' + (queen.health || 100) + '%\n';
                    
                    if (queen.dress) {
                        const { dresses } = require('../queenHarem');
                        const dress = dresses[queen.dress];
                        if (dress) info += '👗 لباس: ' + dress.emoji + ' ' + dress.name + '\n';
                    }
                    
                    if (queen.jewelry && queen.jewelry.length > 0) {
                        info += '💍 جواهرات: ' + queen.jewelry.length + ' عدد\n';
                    }
                    
                    if (queen.servants && queen.servants.length > 0) {
                        info += '🧹 خدمتکاران: ' + queen.servants.length + ' نفر\n';
                    }
                    
                    if (queen.children && queen.children.length > 0) {
                        const aliveChildren = p.children ? p.children.filter(c => c.isAlive && queen.children.includes(c.id)) : [];
                        if (aliveChildren.length > 0) {
                            info += '👶 فرزندان: ' + aliveChildren.length + ' نفر\n';
                        }
                    }
                    
                    const preg = queen.pregnancies?.find(p => !p.born && Date.now() < p.dueDate);
                    if (preg) {
                        const remaining = Math.max(0, Math.ceil((preg.dueDate - Date.now()) / 3600000));
                        info += '🤰 باردار: ' + remaining + ' ساعت تا تولد\n';
                    }
                    
                    info += '━━━━━━━━━━━━━━━';
                    
                    await del();
                    await bot.sendMessage(chatId, info, { parse_mode: 'Markdown', ...getQueenKeyboard(p, queen.id) });
                    
                } catch(e) {
                    console.log('Queen info error:', e.message);
                    await bot.sendMessage(chatId, queen.emoji + ' ' + queen.name + '\n\n✅ انتخاب شد', getQueenKeyboard(p, queen.id));
                }
                return bot.answerCallbackQuery(query.id);
            }

            // =============================================
            // 👸 حقوق حرمسرا
            // =============================================
            if (data === 'harem_salary') {
                const { paySalaries, formatHarem, getHaremKeyboard } = require('../queenHarem');
                const result = paySalaries(p);
                await del();
                await bot.sendMessage(chatId, formatHarem(p), { parse_mode: 'Markdown', ...getHaremKeyboard(p) });
                return bot.answerCallbackQuery(query.id, { text: result.success ? '✅ حقوق پرداخت شد!' : result.message?.replace(/[*_]/g, '').substring(0, 80), show_alert: true });
            }

            // =============================================
            // 👸 رسیدگی به همه ملکه‌ها
            // =============================================
            if (data === 'harem_care_all') {
                const { careAllQueens, formatHarem, getHaremKeyboard } = require('../queenHarem');
                const result = careAllQueens(p);
                await del();
                await bot.sendMessage(chatId, formatHarem(p), { parse_mode: 'Markdown', ...getHaremKeyboard(p) });
                return bot.answerCallbackQuery(query.id, { text: result.success ? '✅ همه رسیدگی شدن!' : result.message?.substring(0, 80), show_alert: true });
            }

            // =============================================
            // 👸 بارداری جدید - انتخاب ملکه
            // =============================================
            if (data === 'harem_pregnancy_new') {
                const queens = p.harem?.queens;
                if (!queens || queens.length === 0) {
                    return bot.answerCallbackQuery(query.id, { text: '❌ هیچ ملکه‌ای در حرمسرا نیست!', show_alert: true });
                }
                
                const btns = [];
                for (let queen of queens) {
                    const alreadyPregnant = queen.pregnancies?.find(p => !p.born && Date.now() < p.dueDate);
                    const label = (alreadyPregnant ? '🤰 ' : '✅ ') + queen.emoji + ' ' + queen.name;
                    btns.push([{ text: label, callback_data: 'harem_pregnancy_select_' + queen.id }]);
                }
                btns.push([{ text: '🔙 برگشت', callback_data: 'harem_menu' }]);
                
                await del();
                await bot.sendMessage(chatId, '👸 *انتخاب ملکه برای بارداری*\n\nملکه مورد نظر را انتخاب کنید:', { parse_mode: 'Markdown', reply_markup: { inline_keyboard: btns } });
                return bot.answerCallbackQuery(query.id);
            }

            // =============================================
            // 👸 انتخاب سرعت بارداری
            // =============================================
            if (data.startsWith('harem_pregnancy_select_')) {
                const queenId = data.replace('harem_pregnancy_select_', '');
                require('./core').haremState[chatId] = { queenId: queenId, action: 'startPregnancy' };
                const { getPregnancySpeedKeyboard } = require('../queenHarem');
                await del();
                await bot.sendMessage(chatId, '⏰ *انتخاب سرعت بارداری*\n\nنوع بارداری را انتخاب کنید:', { parse_mode: 'Markdown', ...getPregnancySpeedKeyboard() });
                return bot.answerCallbackQuery(query.id);
            }

            // =============================================
            // 👸 جشن حرمسرا
            // =============================================
            if (data === 'harem_festival') {
                const { getCelebrationKeyboard } = require('../queenHarem');
                await del();
                await bot.sendMessage(chatId, '🎉 *انتخاب جشن*\n\nجشن مورد نظر را انتخاب کنید:', { parse_mode: 'Markdown', ...getCelebrationKeyboard() });
                return bot.answerCallbackQuery(query.id);
            }

            if (data.startsWith('harem_festival_')) {
                const celebrationKey = data.replace('harem_festival_', '');
                const { celebrateFestival, formatHarem, getHaremKeyboard } = require('../queenHarem');
                const result = celebrateFestival(p, celebrationKey);
                await del();
                await bot.sendMessage(chatId, formatHarem(p), { parse_mode: 'Markdown', ...getHaremKeyboard(p) });
                return bot.answerCallbackQuery(query.id, { text: result.success ? '✅ جشن برگزار شد!' : result.message?.substring(0, 60), show_alert: true });
            }

            // =============================================
            // 👸 ملکه - بارداری
            // =============================================
            if (data === 'queen_pregnancy') {
                const st = require('./core').haremState[chatId];
                if (!st || !st.queenId) {
                    return bot.answerCallbackQuery(query.id, { text: '❌ اول یک ملکه انتخاب کن!', show_alert: true });
                }
                
                const queen = p.harem?.queens.find(q => q.id === st.queenId);
                if (!queen) {
                    return bot.answerCallbackQuery(query.id, { text: '❌ ملکه پیدا نشد!', show_alert: true });
                }
                
                if (queen.pregnancies?.find(p => !p.born && Date.now() < p.dueDate)) {
                    return bot.answerCallbackQuery(query.id, { text: '❌ این ملکه قبلاً باردار است!', show_alert: true });
                }
                
                st.action = 'startPregnancy';
                const { getPregnancySpeedKeyboard } = require('../queenHarem');
                await del();
                await bot.sendMessage(chatId, '⏰ *انتخاب سرعت بارداری*\n\nبرای ' + queen.emoji + ' *' + queen.name + '*', { parse_mode: 'Markdown', ...getPregnancySpeedKeyboard() });
                return bot.answerCallbackQuery(query.id);
            }

            // =============================================
            // 👸 ملکه - تسریع بارداری
            // =============================================
            if (data === 'queen_speed_pregnancy') {
                const st = require('./core').haremState[chatId];
                if (!st || !st.queenId) return bot.answerCallbackQuery(query.id, { text: '❌ اول یک ملکه انتخاب کن!', show_alert: true });
                
                const queen = p.harem?.queens.find(q => q.id === st.queenId);
                if (!queen) return bot.answerCallbackQuery(query.id, { text: '❌ ملکه پیدا نشد!', show_alert: true });
                
                const pregnancy = queen.pregnancies?.find(p => !p.born && Date.now() < p.dueDate);
                if (!pregnancy) return bot.answerCallbackQuery(query.id, { text: '❌ این ملکه باردار نیست!', show_alert: true });
                
                st.action = 'speedPregnancy';
                st.pregnancyId = pregnancy.id;
                
                const { getPregnancySpeedKeyboard } = require('../queenHarem');
                await del();
                await bot.sendMessage(chatId, '⏰ *تسریع بارداری*\n\nسرعت جدید را انتخاب کنید:', { parse_mode: 'Markdown', ...getPregnancySpeedKeyboard() });
                return bot.answerCallbackQuery(query.id);
            }

            // =============================================
            // 👸 اجرای بارداری با سرعت انتخاب شده
            // =============================================
            if (data.startsWith('pregnancy_speed_')) {
                const speedKey = data.replace('pregnancy_speed_', '');
                const st = require('./core').haremState[chatId];
                if (!st || !st.queenId) return bot.answerCallbackQuery(query.id);
                
                const { startPregnancy, speedUpPregnancy, getQueenKeyboard } = require('../queenHarem');
                const queen = p.harem?.queens.find(q => q.id === st.queenId);
                if (!queen) return bot.answerCallbackQuery(query.id, { text: '❌ ملکه پیدا نشد!' });
                
                let result;
                if (st.action === 'startPregnancy') {
                    result = startPregnancy(p, st.queenId, speedKey);
                } else if (st.action === 'speedPregnancy') {
                    result = speedUpPregnancy(p, st.queenId, st.pregnancyId, speedKey);
                } else {
                    return bot.answerCallbackQuery(query.id, { text: '❌ عملیات نامعتبر!' });
                }
                
                await del();
                const info = queen.emoji + ' *' + queen.name + '*\n\n' + result.message;
                await bot.sendMessage(chatId, info, { parse_mode: 'Markdown', ...getQueenKeyboard(p, st.queenId) });
                return bot.answerCallbackQuery(query.id, { text: '✅ انجام شد!' });
            }

            // =============================================
            // 👸 ملکه - رسیدگی
            // =============================================
            if (data === 'queen_care') {
                const st = require('./core').haremState[chatId];
                if (!st || !st.queenId) return bot.answerCallbackQuery(query.id, { text: '❌ اول یک ملکه انتخاب کن!' });
                
                const { queenCare, getQueenKeyboard } = require('../queenHarem');
                const result = queenCare(p, st.queenId);
                const queen = p.harem?.queens.find(q => q.id === st.queenId);
                if (!queen) return bot.answerCallbackQuery(query.id, { text: '❌ ملکه پیدا نشد!' });
                
                await del();
                const info = '💆 *رسیدگی*\n\n' + queen.emoji + ' *' + queen.name + '*\n' + result.message;
                await bot.sendMessage(chatId, info, { parse_mode: 'Markdown', ...getQueenKeyboard(p, st.queenId) });
                return bot.answerCallbackQuery(query.id);
            }

            // =============================================
            // 👸 ملکه - خرید لباس
            // =============================================
            if (data === 'queen_dress') {
                const st = require('./core').haremState[chatId];
                if (!st || !st.queenId) {
                    return bot.answerCallbackQuery(query.id, { text: '❌ اول یک ملکه انتخاب کن!', show_alert: true });
                }
                
                const { getDressKeyboard } = require('../queenHarem');
                await del();
                await bot.sendMessage(chatId, '👗 *خرید لباس*\n\nلباس مورد نظر را انتخاب کنید:', { 
                    parse_mode: 'Markdown', 
                    ...getDressKeyboard() 
                });
                return bot.answerCallbackQuery(query.id);
            }

            if (data.startsWith('dress_buy_')) {
                const dressKey = data.replace('dress_buy_', '');
                const st = require('./core').haremState[chatId];
                if (!st || !st.queenId) {
                    return bot.answerCallbackQuery(query.id, { text: '❌ اول یک ملکه انتخاب کن!' });
                }
                
                const { buyDress, getQueenKeyboard } = require('../queenHarem');
                const result = buyDress(p, st.queenId, dressKey);
                const queen = p.harem?.queens.find(q => q.id === st.queenId);
                
                if (!queen) return bot.answerCallbackQuery(query.id, { text: '❌ ملکه پیدا نشد!' });
                
                await del();
                const info = queen.emoji + ' *' + queen.name + '*\n\n' + result.message;
                await bot.sendMessage(chatId, info, { 
                    parse_mode: 'Markdown', 
                    ...getQueenKeyboard(p, st.queenId) 
                });
                return bot.answerCallbackQuery(query.id, { 
                    text: result.success ? '✅ خرید انجام شد!' : '❌ خطا!', 
                    show_alert: true 
                });
            }

            // =============================================
            // 👸 ملکه - خرید جواهر
            // =============================================
            if (data === 'queen_jewelry') {
                const st = require('./core').haremState[chatId];
                if (!st || !st.queenId) {
                    return bot.answerCallbackQuery(query.id, { text: '❌ اول یک ملکه انتخاب کن!', show_alert: true });
                }
                
                const { getJewelryKeyboard } = require('../queenHarem');
                await del();
                await bot.sendMessage(chatId, '💍 *خرید جواهر*\n\nجواهر مورد نظر را انتخاب کنید:', { 
                    parse_mode: 'Markdown', 
                    ...getJewelryKeyboard() 
                });
                return bot.answerCallbackQuery(query.id);
            }

            if (data.startsWith('jewelry_buy_')) {
                const jewelKey = data.replace('jewelry_buy_', '');
                const st = require('./core').haremState[chatId];
                if (!st || !st.queenId) {
                    return bot.answerCallbackQuery(query.id, { text: '❌ اول یک ملکه انتخاب کن!' });
                }
                
                const { buyJewelry, getQueenKeyboard } = require('../queenHarem');
                const result = buyJewelry(p, st.queenId, jewelKey);
                const queen = p.harem?.queens.find(q => q.id === st.queenId);
                
                if (!queen) return bot.answerCallbackQuery(query.id, { text: '❌ ملکه پیدا نشد!' });
                
                await del();
                const info = queen.emoji + ' *' + queen.name + '*\n\n' + result.message;
                await bot.sendMessage(chatId, info, { 
                    parse_mode: 'Markdown', 
                    ...getQueenKeyboard(p, st.queenId) 
                });
                return bot.answerCallbackQuery(query.id, { 
                    text: result.success ? '✅ خرید انجام شد!' : '❌ خطا!', 
                    show_alert: true 
                });
            }

            // =============================================
            // 👸 ملکه - ارتقای اتاق
            // =============================================
            if (data === 'queen_room') {
                const st = require('./core').haremState[chatId];
                if (!st || !st.queenId) {
                    return bot.answerCallbackQuery(query.id, { text: '❌ اول یک ملکه انتخاب کن!', show_alert: true });
                }
                
                const { getRoomKeyboard } = require('../queenHarem');
                await del();
                await bot.sendMessage(chatId, '🏠 *ارتقای اتاق*\n\nاتاق مورد نظر را انتخاب کنید:', { 
                    parse_mode: 'Markdown', 
                    ...getRoomKeyboard() 
                });
                return bot.answerCallbackQuery(query.id);
            }

            if (data.startsWith('room_upgrade_')) {
                const roomKey = data.replace('room_upgrade_', '');
                const st = require('./core').haremState[chatId];
                if (!st || !st.queenId) {
                    return bot.answerCallbackQuery(query.id, { text: '❌ اول یک ملکه انتخاب کن!' });
                }
                
                const { upgradeRoom, getQueenKeyboard } = require('../queenHarem');
                const result = upgradeRoom(p, st.queenId, roomKey);
                const queen = p.harem?.queens.find(q => q.id === st.queenId);
                
                if (!queen) return bot.answerCallbackQuery(query.id, { text: '❌ ملکه پیدا نشد!' });
                
                await del();
                const info = queen.emoji + ' *' + queen.name + '*\n\n' + result.message;
                await bot.sendMessage(chatId, info, { 
                    parse_mode: 'Markdown', 
                    ...getQueenKeyboard(p, st.queenId) 
                });
                return bot.answerCallbackQuery(query.id, { 
                    text: result.success ? '✅ ارتقا یافت!' : '❌ خطا!', 
                    show_alert: true 
                });
            }

            // =============================================
            // 👸 ملکه - استخدام خدمتکار
            // =============================================
            if (data === 'queen_servant') {
                const st = require('./core').haremState[chatId];
                if (!st || !st.queenId) {
                    return bot.answerCallbackQuery(query.id, { text: '❌ اول یک ملکه انتخاب کن!', show_alert: true });
                }
                
                const { getServantKeyboard } = require('../queenHarem');
                await del();
                await bot.sendMessage(chatId, '🧹 *استخدام خدمتکار*\n\nخدمتکار مورد نظر را انتخاب کنید:', { 
                    parse_mode: 'Markdown', 
                    ...getServantKeyboard() 
                });
                return bot.answerCallbackQuery(query.id);
            }

            if (data.startsWith('servant_hire_')) {
                const servantKey = data.replace('servant_hire_', '');
                const st = require('./core').haremState[chatId];
                if (!st || !st.queenId) {
                    return bot.answerCallbackQuery(query.id, { text: '❌ اول یک ملکه انتخاب کن!' });
                }
                
                const { hireServant, getQueenKeyboard } = require('../queenHarem');
                const result = hireServant(p, st.queenId, servantKey);
                const queen = p.harem?.queens.find(q => q.id === st.queenId);
                
                if (!queen) return bot.answerCallbackQuery(query.id, { text: '❌ ملکه پیدا نشد!' });
                
                await del();
                const info = queen.emoji + ' *' + queen.name + '*\n\n' + result.message;
                await bot.sendMessage(chatId, info, { 
                    parse_mode: 'Markdown', 
                    ...getQueenKeyboard(p, st.queenId) 
                });
                return bot.answerCallbackQuery(query.id, { 
                    text: result.success ? '✅ استخدام شد!' : '❌ خطا!', 
                    show_alert: true 
                });
            }

            // =============================================
            // 👸 ملکه - سبک تربیت
            // =============================================
            if (data === 'queen_upbringing') {
                const st = require('./core').haremState[chatId];
                if (!st || !st.queenId) {
                    return bot.answerCallbackQuery(query.id, { text: '❌ اول یک ملکه انتخاب کن!', show_alert: true });
                }
                
                const { getUpbringingKeyboard } = require('../queenHarem');
                await del();
                await bot.sendMessage(chatId, '📚 *سبک تربیت فرزندان*\n\nسبک مورد نظر را انتخاب کنید:', { 
                    parse_mode: 'Markdown', 
                    ...getUpbringingKeyboard() 
                });
                return bot.answerCallbackQuery(query.id);
            }

            if (data.startsWith('upbringing_set_')) {
                const upbringingKey = data.replace('upbringing_set_', '');
                const st = require('./core').haremState[chatId];
                if (!st || !st.queenId) {
                    return bot.answerCallbackQuery(query.id, { text: '❌ اول یک ملکه انتخاب کن!' });
                }
                
                const { setChildUpbringing, getQueenKeyboard } = require('../queenHarem');
                const result = setChildUpbringing(p, st.queenId, upbringingKey);
                const queen = p.harem?.queens.find(q => q.id === st.queenId);
                
                if (!queen) return bot.answerCallbackQuery(query.id, { text: '❌ ملکه پیدا نشد!' });
                
                await del();
                const info = queen.emoji + ' *' + queen.name + '*\n\n' + result.message;
                await bot.sendMessage(chatId, info, { 
                    parse_mode: 'Markdown', 
                    ...getQueenKeyboard(p, st.queenId) 
                });
                return bot.answerCallbackQuery(query.id, { 
                    text: result.success ? '✅ تنظیم شد!' : '❌ خطا!', 
                    show_alert: true 
                });
            }

            // =============================================
            // 👸 ملکه - دسیسه
            // =============================================
            if (data === 'queen_intrigue') {
                const st = require('./core').haremState[chatId];
                if (!st || !st.queenId) {
                    return bot.answerCallbackQuery(query.id, { text: '❌ اول یک ملکه انتخاب کن!', show_alert: true });
                }
                
                if (!p.harem || p.harem.queens.length < 2) {
                    return bot.answerCallbackQuery(query.id, { text: '❌ حداقل ۲ ملکه لازم است!', show_alert: true });
                }
                
                const { getIntrigueKeyboard } = require('../queenHarem');
                await del();
                await bot.sendMessage(chatId, '🐍 *دسیسه‌های حرمسرا*\n\nنوع دسیسه را انتخاب کنید:', { 
                    parse_mode: 'Markdown', 
                    ...getIntrigueKeyboard() 
                });
                return bot.answerCallbackQuery(query.id);
            }

            if (data.startsWith('intrigue_') && !data.startsWith('intrigue_target_')) {
                const intrigueKey = data.replace('intrigue_', '');
                const st = require('./core').haremState[chatId];
                if (!st || !st.queenId) return bot.answerCallbackQuery(query.id, { text: '❌' });
                
                st.intrigueKey = intrigueKey;
                
                const btns = [];
                for (let queen of p.harem.queens) {
                    if (queen.id !== st.queenId) {
                        btns.push([{ text: queen.emoji + ' ' + queen.name, callback_data: 'intrigue_target_' + queen.id }]);
                    }
                }
                btns.push([{ text: '🔙 برگشت', callback_data: 'harem_menu' }]);
                
                await del();
                await bot.sendMessage(chatId, '🎯 *انتخاب هدف دسیسه*\n\nمی‌خواهی علیه چه کسی دسیسه کنی؟', { 
                    parse_mode: 'Markdown', 
                    reply_markup: { inline_keyboard: btns } 
                });
                return bot.answerCallbackQuery(query.id);
            }

            if (data.startsWith('intrigue_target_')) {
                const targetQueenId = data.replace('intrigue_target_', '');
                const st = require('./core').haremState[chatId];
                if (!st || !st.queenId || !st.intrigueKey) {
                    return bot.answerCallbackQuery(query.id, { text: '❌ خطا در اجرای دسیسه!' });
                }
                
                const { performIntrigue, getQueenKeyboard } = require('../queenHarem');
                const result = performIntrigue(p, st.queenId, targetQueenId, st.intrigueKey);
                const queen = p.harem?.queens.find(q => q.id === st.queenId);
                
                if (!queen) return bot.answerCallbackQuery(query.id, { text: '❌ ملکه پیدا نشد!' });
                
                await del();
                const info = queen.emoji + ' *' + queen.name + '*\n\n' + result.message;
                await bot.sendMessage(chatId, info, { 
                    parse_mode: 'Markdown', 
                    ...getQueenKeyboard(p, st.queenId) 
                });
                return bot.answerCallbackQuery(query.id, { 
                    text: result.success ? '✅ دسیسه موفق!' : '❌ لو رفت!', 
                    show_alert: true 
                });
            }

            // =============================================
            // 👸 ملکه - دفتر خاطرات
            // =============================================
            if (data === 'queen_diary') {
                const st = require('./core').haremState[chatId];
                const { getRandomDiaryEntry, getQueenKeyboard } = require('../queenHarem');
                const entry = getRandomDiaryEntry(p);
                
                await del();
                if (entry) {
                    const info = '📔 *دفتر خاطرات*\n\n' + entry.queen.emoji + ' *' + entry.queen.name + ':*\n_"' + entry.entry + '"_';
                    await bot.sendMessage(chatId, info, { 
                        parse_mode: 'Markdown', 
                        ...getQueenKeyboard(p, st?.queenId || entry.queen.id) 
                    });
                } else {
                    await bot.sendMessage(chatId, '📔 *دفتر خاطرات*\n\nخالی است...', { 
                        parse_mode: 'Markdown', 
                        ...getQueenKeyboard(p, st?.queenId) 
                    });
                }
                return bot.answerCallbackQuery(query.id);
            }

            // =============================================
            // 👸 ملکه - اخراج از حرمسرا
            // =============================================
            if (data === 'queen_remove') {
                const st = require('./core').haremState[chatId];
                if (!st || !st.queenId) {
                    return bot.answerCallbackQuery(query.id, { text: '❌ اول یک ملکه انتخاب کن!' });
                }
                
                const { removeQueenFromHarem, formatHarem, getHaremKeyboard } = require('../queenHarem');
                const result = removeQueenFromHarem(p, st.queenId);
                delete require('./core').haremState[chatId];
                
                await del();
                await bot.sendMessage(chatId, formatHarem(p), { parse_mode: 'Markdown', ...getHaremKeyboard(p) });
                return bot.answerCallbackQuery(query.id, { 
                    text: result.success ? '✅ از حرمسرا خارج شد!' : result.message?.substring(0, 100), 
                    show_alert: true 
                });
            }

            // =============================================
            // 🔥 هم‌آغوشی ملکه - مرحله ۱: شروع
            // =============================================
            if (data === 'queen_orgy') {
                const st = require('./core').haremState[chatId];
                if (!st || !st.queenId) {
                    return bot.answerCallbackQuery(query.id, { text: '❌ اول یک ملکه انتخاب کن!', show_alert: true });
                }
                
                const queen = p.harem?.queens.find(q => q.id === st.queenId);
                if (!queen) {
                    return bot.answerCallbackQuery(query.id, { text: '❌ ملکه پیدا نشد!', show_alert: true });
                }
                
                const condomCount = p.inventory?.condom || 0;
                const gif = queenGifs.seduce[0];
                
                const dialogs = [
                    queen.emoji + ' *' + queen.name + ':* "شاهم... امشب می‌خوام پیشت باشم... کاندوم داری؟"',
                    queen.emoji + ' *' + queen.name + ':* "ببین چقدر داغم... کاندوم داری یا بی‌غلاف می‌خوای؟"',
                    queen.emoji + ' *' + queen.name + ':* "این تن واسه توئه... بگو کاندوم داری یا نه؟"'
                ];
                const dialog = dialogs[Math.floor(Math.random() * dialogs.length)];
                
                let msg = dialog + '\n\n🎈 کاندوم موجود: ' + condomCount + ' عدد';
                
                const btns = [];
                if (condomCount > 0) {
                    btns.push([{ text: '🎈 با کاندوم', callback_data: 'orgy_condom_' + queen.npcId }]);
                }
                btns.push([{ text: '🔥 بدون کاندوم', callback_data: 'orgy_nocondom_' + queen.npcId }]);
                btns.push([{ text: '🔙 برگشت', callback_data: 'harem_queen_' + queen.id }]);
                
                await del();
                await sendAnimation(chatId, gif, msg, { reply_markup: { inline_keyboard: btns } });
                return bot.answerCallbackQuery(query.id);
            }

            // =============================================
            // 🔥 هم‌آغوشی - مرحله ۲: انتخاب نوع
            // =============================================
            if (data.startsWith('orgy_condom_') || data.startsWith('orgy_nocondom_')) {
                const parts = data.split('_');
                const useCondom = parts[1] === 'condom';
                const npcId = parts[2];
                const queen = p.harem?.queens.find(q => q.npcId === npcId);
                
                if (!queen) return bot.answerCallbackQuery(query.id, { text: '❌ ملکه پیدا نشد!' });
                
                require('./core').haremState[chatId].orgyCondom = useCondom;
                
                const gif = queenGifs.selfPleasure[Math.floor(Math.random() * queenGifs.selfPleasure.length)];
                const title = useCondom ? '🎈 *با کاندوم*' : '🔥 *بدون کاندوم*';
                
                const dialogs = [
                    queen.emoji + ' *' + queen.name + ':* "صبر کن... بذار خودمو آماده کنم..."',
                    queen.emoji + ' *' + queen.name + ':* "منتظرت بودم... حالا چی کار می‌خوای بکنی؟"'
                ];
                const dialog = dialogs[Math.floor(Math.random() * dialogs.length)];
                
                const btns = [
                    [{ text: '🍑 از جلو', callback_data: 'orgy_front_' + npcId + '_' + (useCondom ? '1' : '0') }],
                    [{ text: '🍑 از عقب', callback_data: 'orgy_back_' + npcId + '_' + (useCondom ? '1' : '0') }],
                    [{ text: '👄 دهنی', callback_data: 'orgy_mouth_' + npcId + '_' + (useCondom ? '1' : '0') }],
                    [{ text: '🔙 برگشت', callback_data: 'harem_queen_' + queen.id }]
                ];
                
                await del();
                await sendAnimation(chatId, gif, title + '\n' + dialog, { reply_markup: { inline_keyboard: btns } });
                return bot.answerCallbackQuery(query.id);
            }

            // =============================================
            // 🔥 هم‌آغوشی - مرحله ۳: اجرا
            // =============================================
            if (data.startsWith('orgy_front_') || data.startsWith('orgy_back_') || data.startsWith('orgy_mouth_')) {
                const parts = data.split('_');
                const pos = parts[1];
                const npcId = parts[2];
                const useCondom = parts[3] === '1';
                
                const queen = p.harem?.queens.find(q => q.npcId === npcId);
                if (!queen) return bot.answerCallbackQuery(query.id, { text: '❌ ملکه پیدا نشد!' });
                
                if (useCondom) {
                    p.inventory.condom = Math.max(0, (p.inventory.condom || 0) - 1);
                }
                
                if (!p.prisonRelations) p.prisonRelations = {};
                
                const relBonus = pos === 'back' ? 20 : pos === 'front' ? 15 : 10;
                const moodBonus = pos === 'back' ? 25 : pos === 'front' ? 20 : 30;
                
                p.prisonRelations[npcId] = Math.min(100, (p.prisonRelations[npcId] || 50) + relBonus);
                queen.mood = Math.min(100, (queen.mood || 50) + moodBonus);
                
                const { positionImages } = require('./core');
                let gif, image, title, dialog;
                
                if (pos === 'front') {
                    gif = queenGifs.frontOrgy[Math.floor(Math.random() * queenGifs.frontOrgy.length)];
                    image = positionImages.front ? positionImages.front[Math.floor(Math.random() * positionImages.front.length)] : null;
                    title = '🍑 *از جلو*';
                    dialog = queen.emoji + ' ' + queen.name + ': "اوووه... عمیق‌تر... همه شو بریز تو کسم..."';
                    
                    if (!useCondom && Math.random() < 0.80) {
                        try { 
                            require('../queenHarem').startPregnancy(p, queen.id, 'now'); 
                        } catch(e) {}
                        
                        await del();
                        await sendAnimation(chatId, queenGifs.frontFinish, '💦 *آب ریختن...*', { 
                            reply_markup: { inline_keyboard: [] } 
                        });
                        await new Promise(r => setTimeout(r, 2000));
                        dialog += '\n🤰 *باردار شد!*';
                    }
                } else if (pos === 'back') {
                    gif = queenGifs.backOrgy;
                    image = positionImages.back ? positionImages.back[Math.floor(Math.random() * positionImages.back.length)] : null;
                    title = '🍑 *از عقب*';
                    dialog = queen.emoji + ' ' + queen.name + ': "آخ... چه کونی داری... محکم‌تر..."';
                } else {
                    gif = queenGifs.oralOrgy[Math.floor(Math.random() * queenGifs.oralOrgy.length)];
                    image = positionImages.oral ? positionImages.oral[Math.floor(Math.random() * positionImages.oral.length)] : null;
                    title = '👄 *دهنی*';
                    dialog = queen.emoji + ' ' + queen.name + ': "ممم... همه شو خوردم..."';
                    p.hp = Math.max(10, (p.hp || 100) - Math.floor((p.maxHp || 100) * 0.20));
                }
                
                await del();
                await sendAnimation(chatId, gif, title + '\n\n' + dialog, { reply_markup: { inline_keyboard: [] } });
                await new Promise(r => setTimeout(r, 2000));
                
                let resultMsg = title + '\n\n' + dialog + '\n\n💕 رابطه +' + relBonus + ' | 😊 روحیه +' + moodBonus;
                if (useCondom) {
                    resultMsg += '\n🎈 کاندوم -۱ (باقی‌مانده: ' + (p.inventory.condom || 0) + ')';
                }
                
                const { getQueenKeyboard } = require('../queenHarem');
                if (image) {
                    await sendPhoto(chatId, image, resultMsg, getQueenKeyboard(p, queen.id));
                } else {
                    await bot.sendMessage(chatId, resultMsg, getQueenKeyboard(p, queen.id));
                }
                return bot.answerCallbackQuery(query.id);
            }

            // =============================================
            // 👥 مردم
            // =============================================
            if (data === 'people_menu') {
                const { initPeople, formatPeople, getPeopleKeyboard } = require('../people');
                initPeople(p);
                await del();
                await bot.sendMessage(chatId, formatPeople(p), { parse_mode: 'Markdown', ...getPeopleKeyboard(p) });
                return bot.answerCallbackQuery(query.id);
            }

            if (data === 'people_tax') {
                const { initPeople, collectTaxes, formatPeople, getPeopleKeyboard } = require('../people');
                initPeople(p);
                const result = collectTaxes(p);
                await del();
                await bot.sendMessage(chatId, formatPeople(p), { parse_mode: 'Markdown', ...getPeopleKeyboard(p) });
                return bot.answerCallbackQuery(query.id, { text: result.success ? '✅ مالیات جمع‌آوری شد!' : result.message?.substring(0, 80), show_alert: true });
            }

            if (data === 'people_lands') {
                const { getLandKeyboard } = require('../people');
                await del();
                await bot.sendMessage(chatId, '🌾 *زمین‌های کشاورزی*\n\nنوع زمین را انتخاب کنید:', { parse_mode: 'Markdown', ...getLandKeyboard() });
                return bot.answerCallbackQuery(query.id);
            }

            if (data.startsWith('people_land_buy_')) {
                const landType = data.replace('people_land_buy_', '');
                const { initPeople, assignLand, getLandKeyboard } = require('../people');
                initPeople(p);
                const result = assignLand(p, landType, 1);
                await del();
                await bot.sendMessage(chatId, result.message, { parse_mode: 'Markdown', ...getLandKeyboard() });
                return bot.answerCallbackQuery(query.id, { text: result.success ? '✅ زمین خریداری شد!' : '❌ خطا!', show_alert: true });
            }

            if (data === 'people_land_water_all') {
                const { initPeople, waterLand, getLandKeyboard } = require('../people');
                initPeople(p);
                let msg = '';
                if (p.people?.lands) {
                    for (let land of p.people.lands) {
                        const r = waterLand(p, land.id);
                        if (r && r.message) msg += r.message + '\n';
                    }
                }
                await del();
                await bot.sendMessage(chatId, msg || '✅ همه زمین‌ها آبیاری شدند!', { parse_mode: 'Markdown', ...getLandKeyboard() });
                return bot.answerCallbackQuery(query.id);
            }

            if (data === 'people_land_harvest_all') {
                const { initPeople, harvestAllLands, getLandKeyboard } = require('../people');
                initPeople(p);
                const result = harvestAllLands(p);
                await del();
                await bot.sendMessage(chatId, result.message, { parse_mode: 'Markdown', ...getLandKeyboard() });
                return bot.answerCallbackQuery(query.id, { text: result.success ? '✅ محصول برداشت شد!' : '❌ خطا!', show_alert: true });
            }

            if (data === 'people_buildings') {
                const { initPeople, getBuildingKeyboard } = require('../people');
                initPeople(p);
                await del();
                await bot.sendMessage(chatId, '🏗️ *ساختمان‌های عمومی*\n\nساختمان مورد نظر را انتخاب کنید:', { parse_mode: 'Markdown', ...getBuildingKeyboard(p) });
                return bot.answerCallbackQuery(query.id);
            }

            if (data.startsWith('people_building_')) {
                const buildingKey = data.replace('people_building_', '');
                const { initPeople, buildPublicBuilding, getBuildingKeyboard } = require('../people');
                initPeople(p);
                const result = buildPublicBuilding(p, buildingKey);
                await del();
                await bot.sendMessage(chatId, result.message, { parse_mode: 'Markdown', ...getBuildingKeyboard(p) });
                return bot.answerCallbackQuery(query.id, { text: result.success ? '✅ ساختمان ساخته شد!' : result.message?.substring(0, 60), show_alert: true });
            }

            if (data === 'people_decisions') {
                const { getDecisionKeyboard } = require('../people');
                await del();
                await bot.sendMessage(chatId, '📜 *تصمیم‌های مدیریتی*\n\nتصمیم مورد نظر را انتخاب کنید:', { parse_mode: 'Markdown', ...getDecisionKeyboard() });
                return bot.answerCallbackQuery(query.id);
            }

            if (data === 'people_festival') {
                const { initPeople, makeDecision, formatPeople, getPeopleKeyboard } = require('../people');
                initPeople(p);
                makeDecision(p, 'festival', 0);
                await del();
                await bot.sendMessage(chatId, formatPeople(p), { parse_mode: 'Markdown', ...getPeopleKeyboard(p) });
                return bot.answerCallbackQuery(query.id, { text: '✅ جشن با موفقیت برگزار شد!' });
            }

            if (data === 'people_food') {
                const { initPeople, makeDecision, formatPeople, getPeopleKeyboard } = require('../people');
                initPeople(p);
                makeDecision(p, 'foodAid', 0);
                await del();
                await bot.sendMessage(chatId, formatPeople(p), { parse_mode: 'Markdown', ...getPeopleKeyboard(p) });
                return bot.answerCallbackQuery(query.id, { text: '✅ کمک‌های غذایی توزیع شد!' });
            }

            if (data === 'people_draft') {
                const { initPeople, makeDecision, formatPeople, getPeopleKeyboard } = require('../people');
                initPeople(p);
                makeDecision(p, 'conscription', 0);
                await del();
                await bot.sendMessage(chatId, formatPeople(p), { parse_mode: 'Markdown', ...getPeopleKeyboard(p) });
                return bot.answerCallbackQuery(query.id, { text: '✅ سربازگیری انجام شد!' });
            }

            if (data === 'people_taxbreak') {
                const { initPeople, makeDecision, formatPeople, getPeopleKeyboard } = require('../people');
                initPeople(p);
                makeDecision(p, 'taxBreak', 0);
                await del();
                await bot.sendMessage(chatId, formatPeople(p), { parse_mode: 'Markdown', ...getPeopleKeyboard(p) });
                return bot.answerCallbackQuery(query.id, { text: '✅ مالیات این ماه بخشیده شد!' });
            }

        } catch (e) {
            console.log('❌ Empire handler error:', e.message);
            try { 
                await bot.answerCallbackQuery(query.id, { text: '❌ خطایی رخ داد! دوباره تلاش کنید.', show_alert: true }); 
            } catch(e2) {
                console.log('Answer callback error:', e2.message);
            }
        }
    });

    // =============================================
    // 📝 پیام متنی برای تنظیم نام سلسله
    // =============================================
    bot.on('message', async (msg) => {
        const chatId = msg.chat.id;
        const text = msg.text;
        
        if (!text || text.startsWith('/') || text.startsWith('🔙')) return;
        
        const p = player.getPlayer(chatId);
        if (!p) return;
        
        const { empireState } = require('./core');
        
        if (empireState[chatId] && empireState[chatId].action === 'setDynasty') {
            const { setDynastyName, formatEmpire, getEmpireKeyboard } = require('../empire');
            const result = setDynastyName(p, text);
            
            delete empireState[chatId];
            
            if (result.success) {
                await bot.sendMessage(chatId, result.message, { parse_mode: 'Markdown' });
            }
            
            await bot.sendMessage(chatId, formatEmpire(p), { parse_mode: 'Markdown', ...getEmpireKeyboard(p) });
        }
    });
}

module.exports = { setupEmpireHandlers };