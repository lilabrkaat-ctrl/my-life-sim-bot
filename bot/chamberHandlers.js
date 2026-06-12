const { bot, player, mainMenu, sendPhoto, sendAnimation, chamberState } = require('./core');
const { formatSecretChamber, getSecretChamberKeyboard, getChamberRoomKeyboard, visitGirl, visitBoy, doActivity } = require('../secretChamber');

// گیف‌های مخفی‌گاه (۹ تا)
const sexyGifs = {
    touch: [
        'CgACAgIAAxkBAAEqL2xqIyJty9xl0ap5lrJYra2GtlNQdQACTwMAAiY94UhMlGoX_JSICTsE',
        'CgACAgQAAxkBAAEqL2pqIyJpy-g7HaM9YEhpzyE0RU-1MwACrAADXSmNUjSWJGIYVG3KOwQ',
        'CgACAgQAAxkBAAEqL15qIyJW5AcK3OWO2Oyif7wI1aiDqQACgQMAAirVQQYo4gxrnlL0zTsE'
    ],
    kiss: 'CgACAgIAAxkBAAEqL2hqIyJnncLJlCKF2kJOT7jKi-7r_wACaAIAArqQoEtep7htQxIwxTsE',
    orgy: 'CgACAgQAAxkBAAEqL1xqIyJUx3yIRno4UZtix4SumGHwCgAC6p8AAkMXZAepPlY8DiidIDsE',
    extra: [
        'CgACAgQAAxkBAAEqizpqK5tQFeriRVC2jqdHhD_brsXdAwACUx4AAtsXWVGX50vaL2d8KzwE',
        'CgACAgQAAxkBAAEqi09qK5tmyT3ia2dR7m8hTSdyHJKmvAACfhsAAtN3WVFQLM4BGup3wTwE',
        'CgACAgQAAxkBAAEqi1NqK5tmc79xEIG6arpSFIeLmrFFrQACOR4AAtsXWVGBZG94AAH7sEU8BA',
        'CgACAgQAAxkBAAEqi0xqK5tmDJWGbx2ZHbZqxV2dIdvU3wACSx4AAjScUVE5YZD0VdPitzwE'
    ]
};

// عکس‌های پوزیشن برای عیاشی
const { positionImages } = require('./core');

function setupChamberHandlers() {
    
    // ============ ورود به مخفی‌گاه ============
    bot.onText(/^🔞 مخفی‌گاه$/, async (msg) => {
        const chatId = msg.chat.id;
        const p = player.getPlayer(chatId);
        if (!p) return bot.sendMessage(chatId, '❌ /start بزن!', mainMenu());
        if (p.level < 30 && (!p.empire || p.empire.level === 0)) {
            return bot.sendMessage(chatId, '🔒 باید سطح ۳۰ باشی!', mainMenu());
        }
        try { const { initSecretChamber } = require('../secretChamber'); initSecretChamber(p); } catch(e) {}
        await bot.sendMessage(chatId, formatSecretChamber(p), { parse_mode: 'Markdown', ...getSecretChamberKeyboard(p) });
    });

    // ============ انتخاب دختر ============
    bot.onText(/^👩 (.+?) \((\d+)👑\)$/, async (msg, match) => {
        const chatId = msg.chat.id;
        const p = player.getPlayer(chatId);
        if (!p) return;
        
        const { secretGirls } = require('../secretChamber');
        const info = match[1].trim();
        let girl = null;
        for (let g of secretGirls) { 
            if (info.includes(g.emoji) && info.includes(g.name)) { girl = g; break; } 
        }
        if (!girl) return;
        
        chamberState[chatId] = { action: 'visitGirl', girlId: girl.id, girl };
        await bot.sendMessage(chatId, `🏠 *انتخاب اتاق برای ${girl.emoji} ${girl.name}:*`, { parse_mode: 'Markdown', ...getChamberRoomKeyboard() });
    });

    // ============ انتخاب پسر ============
    bot.onText(/^👦 (.+?) \((\d+)👑\)$/, async (msg, match) => {
        const chatId = msg.chat.id;
        const p = player.getPlayer(chatId);
        if (!p) return;
        
        const { secretBoys } = require('../secretChamber');
        const info = match[1].trim();
        let boy = null;
        for (let b of secretBoys) { 
            if (info.includes(b.emoji) && info.includes(b.name)) { boy = b; break; } 
        }
        if (!boy) return;
        
        chamberState[chatId] = { action: 'visitBoy', boyId: boy.id, boy };
        await bot.sendMessage(chatId, `🏠 *انتخاب اتاق برای ${boy.emoji} ${boy.name}:*`, { parse_mode: 'Markdown', ...getChamberRoomKeyboard() });
    });

    // ============ انتخاب اتاق ============
    bot.onText(/^🛏️ (.+?) \((\d+)👑\) - (.+)$/, async (msg, match) => {
        const chatId = msg.chat.id;
        const p = player.getPlayer(chatId);
        if (!p || !chamberState[chatId]) return;
        
        const roomName = match[1].trim();
        let roomType = 'normal';
        if (roomName.includes('VIP') || roomName.includes('ویژه')) roomType = 'vip';
        else if (roomName.includes('سلطنتی')) roomType = 'royal';
        else if (roomName.includes('مخفی')) roomType = 'secret';

        let result;
        if (chamberState[chatId].action === 'visitGirl') {
            result = visitGirl(p, chamberState[chatId].girlId, roomType);
        } else if (chamberState[chatId].action === 'visitBoy') {
            result = visitBoy(p, chamberState[chatId].boyId, roomType);
        }
        
        if (result && result.success) {
            // ذخیره اطلاعات
            const person = chamberState[chatId].action === 'visitGirl' ? chamberState[chatId].girl : chamberState[chatId].boy;
            chamberState[chatId] = { ...chamberState[chatId], roomType, person };
            
            // منوی لمس/بوسه/عیاشی
            const btns = [
                [{ text: '🖐️ لمس کن', callback_data: `chamber_touch_${person.id}` }],
                [{ text: '💋 ببوس', callback_data: `chamber_kiss_${person.id}` }],
                [{ text: '🔥 عیاشی', callback_data: `chamber_orgy_${person.id}` }],
                [{ text: '🔙 برگشت', callback_data: 'chamber_back' }]
            ];
            
            await bot.sendMessage(chatId, result.message + '\n\n🔥 *حالا چی کار می‌خوای بکنی؟*', { 
                parse_mode: 'Markdown', 
                reply_markup: { inline_keyboard: btns } 
            });
        } else if (result) {
            await bot.sendMessage(chatId, result.message, { parse_mode: 'Markdown', ...getSecretChamberKeyboard(p) });
        }
    });

    // ============ callbackهای شیشه‌ای مخفی‌گاه ============
    bot.on('callback_query', async (query) => {
        const chatId = query.message.chat.id;
        const msgId = query.message.message_id;
        const data = query.data;
        const p = player.getPlayer(chatId);
        if (!p) return;
        if (!data || !data.startsWith('chamber_')) return;

        const st = chamberState[chatId];
        if (!st || !st.person) return;

        try {
            // برگشت
            if (data === 'chamber_back') {
                delete chamberState[chatId];
                await bot.deleteMessage(chatId, msgId).catch(() => {});
                await bot.sendMessage(chatId, formatSecretChamber(p), { parse_mode: 'Markdown', ...getSecretChamberKeyboard(p) });
                return bot.answerCallbackQuery(query.id);
            }

            const parts = data.split('_');
            const personId = parts[2];
            const person = st.person;
            if (!person || person.id !== personId) return;

            // 🖐️ لمس
            if (data.startsWith('chamber_touch_')) {
                const gif = sexyGifs.touch[Math.floor(Math.random() * sexyGifs.touch.length)];
                
                // بهبود رابطه
                if (!p.prisonRelations) p.prisonRelations = {};
                p.prisonRelations[person.id] = Math.min(100, (p.prisonRelations[person.id] || 30) + 5);
                
                // دکمه‌های بعد از لمس
                const btns = [
                    [{ text: '💋 ببوس', callback_data: `chamber_kiss_${person.id}` }],
                    [{ text: '🔥 عیاشی', callback_data: `chamber_orgy_${person.id}` }],
                    [{ text: '🔙 برگشت', callback_data: 'chamber_back' }]
                ];
                
                await bot.deleteMessage(chatId, msgId).catch(() => {});
                await sendAnimation(chatId, gif, `🖐️ ${person.emoji} ${person.name} رو لمس کردی...\n💕 رابطه +۵`, { reply_markup: { inline_keyboard: btns } });
                return bot.answerCallbackQuery(query.id);
            }

            // 💋 بوسه
            if (data.startsWith('chamber_kiss_')) {
                if (!p.prisonRelations) p.prisonRelations = {};
                p.prisonRelations[person.id] = Math.min(100, (p.prisonRelations[person.id] || 30) + 10);
                
                const btns = [
                    [{ text: '🔥 عیاشی', callback_data: `chamber_orgy_${person.id}` }],
                    [{ text: '🔙 برگشت', callback_data: 'chamber_back' }]
                ];
                
                await bot.deleteMessage(chatId, msgId).catch(() => {});
                await sendAnimation(chatId, sexyGifs.kiss, `💋 ${person.emoji} ${person.name} رو بوسیدی...\n💕 رابطه +۱۰`, { reply_markup: { inline_keyboard: btns } });
                return bot.answerCallbackQuery(query.id);
            }

            // 🔥 عیاشی
            if (data.startsWith('chamber_orgy_')) {
                // انتخاب گیف (orgy + extra)
                const allOrgyGifs = [sexyGifs.orgy, ...sexyGifs.extra];
                const gif = allOrgyGifs[Math.floor(Math.random() * allOrgyGifs.length)];
                
                // بهبود رابطه
                if (!p.prisonRelations) p.prisonRelations = {};
                p.prisonRelations[person.id] = Math.min(100, (p.prisonRelations[person.id] || 30) + 15);
                
                // انتخاب عکس پوزیشن
                const positions = ['front', 'back', 'oral'];
                const pos = positions[Math.floor(Math.random() * positions.length)];
                const image = positionImages[pos][Math.floor(Math.random() * positionImages[pos].length)];
                
                // نمایش گیف عیاشی
                await bot.deleteMessage(chatId, msgId).catch(() => {});
                await sendAnimation(chatId, gif, `🔥 با ${person.emoji} ${person.name} عیاشی کردی...`, { reply_markup: { inline_keyboard: [] } });
                await new Promise(r => setTimeout(r, 2000));
                
                // نمایش عکس
                const titles = { front: '🍑 از جلو', back: '🍑 از عقب', oral: '👄 دهنی' };
                const btns = [[{ text: '🔙 برگشت', callback_data: 'chamber_back' }]];
                
                if (image) {
                    await sendPhoto(chatId, image, `${titles[pos]}\n\n💕 رابطه +۱۵`, { reply_markup: { inline_keyboard: btns } });
                } else {
                    await bot.sendMessage(chatId, `${titles[pos]}\n\n💕 رابطه +۱۵`, { parse_mode: 'Markdown', reply_markup: { inline_keyboard: btns } });
                }
                
                delete chamberState[chatId];
                return bot.answerCallbackQuery(query.id);
            }

        } catch(e) {
            console.log('Chamber callback error:', e.message);
            return bot.answerCallbackQuery(query.id, { text: '❌ خطا!' });
        }
    });

    // ============ فعالیت‌ها ============
    const activityHandlers = {
        '🎲 قمار': 'gambling', '🍷 میخانه': 'drinking', '🎵 موسیقی': 'music',
        '🔮 فال‌گیری': 'fortune', '🗡️ مبارزه': 'fighting', '💊 تریاک': 'opium'
    };

    for (let [key, type] of Object.entries(activityHandlers)) {
        bot.onText(new RegExp(`^${key} \\((\\d+)👑\\)$`), async (msg, match) => {
            const chatId = msg.chat.id; const p = player.getPlayer(chatId);
            if (!p) return;
            const r = doActivity(p, type);
            await bot.sendMessage(chatId, r.message, { parse_mode: 'Markdown', ...getSecretChamberKeyboard(p) });
        });
    }

    // ============ هدیه دادن ============
    bot.onText(/^🎁 (.+)$/, async (msg, match) => {
        const chatId = msg.chat.id; const p = player.getPlayer(chatId);
        if (!p) return;
        const { secretGirls, secretBoys, giveGift } = require('../secretChamber');
        const info = match[1].trim();
        let personId = null, isGirl = true;
        for (let g of secretGirls) { if (info.includes(g.emoji) && info.includes(g.name)) { personId = g.id; break; } }
        if (!personId) { isGirl = false; for (let b of secretBoys) { if (info.includes(b.emoji) && info.includes(b.name)) { personId = b.id; break; } } }
        if (!personId) return;
        const result = giveGift(p, personId, isGirl);
        await bot.sendMessage(chatId, result.message, { parse_mode: 'Markdown', ...getSecretChamberKeyboard(p) });
    });

    // ============ استخدام نگهبان ============
    bot.onText(/^(🛡️ .+) \((\d+)👑\)$/, async (msg, match) => {
        const chatId = msg.chat.id; const p = player.getPlayer(chatId);
        if (!p) return;
        const guardInfo = match[1].trim();
        const guards = { 'دربان': 'doorman', 'دیده‌بان': 'watchman', 'محافظ شخصی': 'bodyguard' };
        let guardType = null;
        for (let [name, type] of Object.entries(guards)) { if (guardInfo.includes(name)) { guardType = type; break; } }
        if (!guardType) return;
        const { hireGuard } = require('../secretChamber');
        const result = hireGuard(p, guardType);
        await bot.sendMessage(chatId, result.message, { parse_mode: 'Markdown', ...getSecretChamberKeyboard(p) });
    });
}

module.exports = { setupChamberHandlers };