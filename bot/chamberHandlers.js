const { bot, player, mainMenu, sendPhoto, sendAnimation, chamberState } = require('./core');
const { visitGirl, visitBoy, doActivity, giveGift, hireGuard, formatSecretChamber, getSecretChamberKeyboard, getPagedKeyboard, getChamberRoomKeyboard, getGuardKeyboard, getGiftKeyboard } = require('../secretChamber');

// گیف‌های مخفی‌گاه
const sexyGifs = {
    touch: [
        'CgACAgIAAxkBAAEqL2xqIyJty9xl0ap5lrJYra2GtlNQdQACTwMAAiY94UhMlGoX_JSICTsE',
        'CgACAgQAAxkBAAEqL2pqIyJpy-g7HaM9YEhpzyE0RU-1MwACrAADXSmNUjSWJGIYVG3KOwQ',
        'CgACAgQAAxkBAAEqL15qIyJW5AcK3OWO2Oyif7wI1aiDqQACgQMAAirVQQYo4gxrnlL0zTsE'
    ],
    touchExtra: [
        'CgACAgQAAxkBAAEqizpqK5tQFeriRVC2jqdHhD_brsXdAwACUx4AAtsXWVGX50vaL2d8KzwE',
        'CgACAgQAAxkBAAEqi09qK5tmyT3ia2dR7m8hTSdyHJKmvAACfhsAAtN3WVFQLM4BGup3wTwE'
    ],
    tease: 'CgACAgQAAxkBAAEqi1NqK5tmc79xEIG6arpSFIeLmrFFrQACOR4AAtsXWVGBZG94AAH7sEU8BA',
    kiss: 'CgACAgIAAxkBAAEqL2hqIyJnncLJlCKF2kJOT7jKi-7r_wACaAIAArqQoEtep7htQxIwxTsE',
    orgy: 'CgACAgQAAxkBAAEqL1xqIyJUx3yIRno4UZtix4SumGHwCgAC6p8AAkMXZAepPlY8DiidIDsE',
    orgyExtra: [
        'CgACAgQAAxkBAAEqi0xqK5tmDJWGbx2ZHbZqxV2dIdvU3wACSx4AAjScUVE5YZD0VdPitzwE',
        'CgACAgQAAxkBAAEqkK1qLAiZFuc_3efDCVPrsuT_0QNSsgACDCEAAtsXYVHZL9Wynu09VzwE',
        'CgACAgQAAxkBAAEqkK5qLAiZNDfe_SJAKSeMn7BoQ4R_nwACDSEAAtsXYVHcaB-yfbpTPTwE'
    ]
};

// دیالوگ‌های شهوتی
const dialogs = {
    tease: [
        "👄 آروم آروم لباسامو درمیارم... نگام کن...",
        "👄 ببین چی برات دارم... دوس داری؟",
        "👄 می‌خوام امشب یادت بمونه...",
        "👄 نزدیکتر بیا... بذار بو کنمت...",
        "👄 نبضت تند شد... هنوز شروع نکردیم که..."
    ],
    touch: [
        "🖐️ آه... دستات گرمه... بازم لمس کن...",
        "🖐️ همینجا... درست همینجا...",
        "🖐️ وای... چقدر نرمه دستات...",
        "🖐️ بیشتر... بیشتر لمس کن...",
        "🖐️ داغ شدم... دستاتو برندار..."
    ],
    kiss: [
        "💋 ممم... لبات... دوباره ببوس...",
        "💋 چقدر منتظر این بوسه بودم...",
        "💋 وای... نفسم بند اومد...",
        "💋 بازم ببوس... خیلی وقته...",
        "💋 لبات مث عسل می‌مونه..."
    ],
    orgyFront: [
        "🍑 اوووه... عمیق‌تر... کصم داره می‌ترکه...",
        "🍑 آهااا... همه شو بریز تو کسم...",
        "🍑 وای... چه کیر بزرگی... نمیتونم...",
        "🍑 محکم‌تر بکن... می‌خوام حس کنم..."
    ],
    orgyBack: [
        "🍑 آخ... کونم... محکم‌تر...",
        "🍑 چه کونی داری... عمیق‌تر برو...",
        "🍑 وای... کیرت تو کونم عالیه...",
        "🍑 محکم بگیر کونمو... آهااا..."
    ],
    orgyOral: [
        "👄 ممم... چه مزه‌ای... بازم بریز...",
        "👄 همه شو خوردم... چقدر آب کیرت زیاده...",
        "👄 بذار عمیق‌تر بخورمش...",
        "👄 تف نکن... همه شو می‌خوام..."
    ]
};

function setupChamberHandlers() {

    bot.on('callback_query', async (query) => {
        const chatId = query.message.chat.id;
        const msgId = query.message.message_id;
        const data = query.data;
        const p = player.getPlayer(chatId);
        if (!p) return;
        if (!data || (!data.startsWith('chamber_') && data !== 'secret_chamber')) return;

        try {
            // ============ ورود از خونه ============
            if (data === 'secret_chamber') {
                if (p.level < 30 && (!p.empire || p.empire.level === 0)) {
                    return bot.answerCallbackQuery(query.id, { text: '🔒 باید سطح ۳۰ باشی!', show_alert: true });
                }
                try { require('../secretChamber').initSecretChamber(p); } catch(e) {}
                const text = formatSecretChamber(p);
                if (!text || text.trim() === '') {
                    return bot.answerCallbackQuery(query.id, { text: '❌ مخفی‌گاه خالیه!' });
                }
                await bot.deleteMessage(chatId, msgId).catch(() => {});
                await bot.sendMessage(chatId, text, { parse_mode: 'Markdown', ...getSecretChamberKeyboard(p) });
                return bot.answerCallbackQuery(query.id);
            }

            // ============ صفحه‌بندی ============
            if (data.startsWith('chamber_page_')) {
                const page = parseInt(data.replace('chamber_page_', ''));
                await bot.editMessageText(formatSecretChamber(p), {
                    chat_id: chatId, message_id: msgId, parse_mode: 'Markdown',
                    ...getPagedKeyboard(p, page)
                });
                return bot.answerCallbackQuery(query.id);
            }

            // ============ انتخاب دختر ============
            if (data.startsWith('chamber_girl_')) {
                const girlId = data.replace('chamber_girl_', '');
                const { secretGirls } = require('../secretChamber');
                const girl = secretGirls.find(g => g.id === girlId);
                if (!girl) return bot.answerCallbackQuery(query.id, { text: '❌ پیدا نشد!' });
                
                chamberState[chatId] = { action: 'visitGirl', girlId: girl.id, person: girl };
                
                await bot.editMessageText(`🏠 *انتخاب اتاق برای ${girl.emoji} ${girl.name}:*`, {
                    chat_id: chatId, message_id: msgId, parse_mode: 'Markdown', ...getChamberRoomKeyboard(p)
                });
                return bot.answerCallbackQuery(query.id);
            }

            // ============ انتخاب پسر ============
            if (data.startsWith('chamber_boy_')) {
                const boyId = data.replace('chamber_boy_', '');
                const { secretBoys } = require('../secretChamber');
                const boy = secretBoys.find(b => b.id === boyId);
                if (!boy) return bot.answerCallbackQuery(query.id, { text: '❌ پیدا نشد!' });
                
                chamberState[chatId] = { action: 'visitBoy', boyId: boy.id, person: boy };
                
                await bot.editMessageText(`🏠 *انتخاب اتاق برای ${boy.emoji} ${boy.name}:*`, {
                    chat_id: chatId, message_id: msgId, parse_mode: 'Markdown', ...getChamberRoomKeyboard(p)
                });
                return bot.answerCallbackQuery(query.id);
            }

            // ============ انتخاب اتاق ============
            if (data.startsWith('chamber_room_')) {
                const roomMap = { normal: 'normal', vip: 'vip', royal: 'royal', secret: 'secret' };
                const roomType = roomMap[data.replace('chamber_room_', '')];
                
                if (!roomType || !chamberState[chatId] || !chamberState[chatId].person) {
                    return bot.answerCallbackQuery(query.id, { text: '❌ یک نفر انتخاب کن!' });
                }
                
                const person = chamberState[chatId].person;
                
                let result;
                if (chamberState[chatId].action === 'visitGirl') {
                    result = visitGirl(p, chamberState[chatId].girlId, roomType);
                } else {
                    result = visitBoy(p, chamberState[chatId].boyId, roomType);
                }
                
                if (!result || !result.success) {
                    await bot.editMessageText(result ? result.message : '❌ خطا!', {
                        chat_id: chatId, message_id: msgId, parse_mode: 'Markdown', ...getSecretChamberKeyboard(p)
                    });
                    delete chamberState[chatId];
                    return bot.answerCallbackQuery(query.id);
                }
                
                chamberState[chatId] = { person, roomType };
                
                const teaseDialog = dialogs.tease[Math.floor(Math.random() * dialogs.tease.length)];
                
                const btns = [
                    [{ text: '🖐️ لمس کن', callback_data: `chamber_touch_${person.id}` }],
                    [{ text: '💋 ببوس', callback_data: `chamber_kiss_${person.id}` }],
                    [{ text: '🔥 عیاشی', callback_data: `chamber_orgy_${person.id}` }],
                    [{ text: '🔙 برگشت', callback_data: 'chamber_back' }]
                ];
                
                await bot.deleteMessage(chatId, msgId).catch(() => {});
                await sendAnimation(chatId, sexyGifs.tease, 
                    `${person.emoji} *${person.name}*\n${teaseDialog}\n\n🔥 *چی کار می‌خوای بکنی؟*`, 
                    { reply_markup: { inline_keyboard: btns } }
                );
                return bot.answerCallbackQuery(query.id);
            }

            // ============ فعالیت‌ها ============
            if (data.startsWith('chamber_activity_')) {
                const type = data.replace('chamber_activity_', '');
                const r = doActivity(p, type);
                await bot.editMessageText(r.message, {
                    chat_id: chatId, message_id: msgId, parse_mode: 'Markdown', ...getSecretChamberKeyboard(p)
                });
                return bot.answerCallbackQuery(query.id);
            }

            // ============ منوی هدیه ============
            if (data === 'chamber_gift_menu') {
                await bot.editMessageText('🎁 *به کی هدیه می‌دی؟*', {
                    chat_id: chatId, message_id: msgId, parse_mode: 'Markdown', ...getGiftKeyboard(p)
                });
                return bot.answerCallbackQuery(query.id);
            }

            // ============ هدیه دادن ============
            if (data.startsWith('chamber_gift_girl_') || data.startsWith('chamber_gift_boy_')) {
                const isGirl = data.startsWith('chamber_gift_girl_');
                const personId = data.replace(isGirl ? 'chamber_gift_girl_' : 'chamber_gift_boy_', '');
                const result = giveGift(p, personId, isGirl);
                await bot.editMessageText(result.message, {
                    chat_id: chatId, message_id: msgId, parse_mode: 'Markdown', ...getSecretChamberKeyboard(p)
                });
                return bot.answerCallbackQuery(query.id);
            }

            // ============ منوی نگهبان ============
            if (data === 'chamber_guard_menu') {
                await bot.editMessageText('🛡️ *استخدام نگهبان:*', {
                    chat_id: chatId, message_id: msgId, parse_mode: 'Markdown', ...getGuardKeyboard()
                });
                return bot.answerCallbackQuery(query.id);
            }

            // ============ استخدام نگهبان ============
            if (data.startsWith('chamber_guard_')) {
                const guardType = data.replace('chamber_guard_', '');
                const result = hireGuard(p, guardType);
                await bot.editMessageText(result.message, {
                    chat_id: chatId, message_id: msgId, parse_mode: 'Markdown', ...getSecretChamberKeyboard(p)
                });
                return bot.answerCallbackQuery(query.id);
            }

            // ============ 🖐️ لمس ============
            if (data.startsWith('chamber_touch_')) {
                const st = chamberState[chatId];
                if (!st || !st.person) return bot.answerCallbackQuery(query.id, { text: '❌ یک نفر انتخاب کن!' });
                const person = st.person;
                
                const allTouchGifs = [...sexyGifs.touch, ...sexyGifs.touchExtra];
                const gif = allTouchGifs[Math.floor(Math.random() * allTouchGifs.length)];
                const dialog = dialogs.touch[Math.floor(Math.random() * dialogs.touch.length)];
                
                if (!p.prisonRelations) p.prisonRelations = {};
                p.prisonRelations[person.id] = Math.min(100, (p.prisonRelations[person.id] || 30) + 5);
                
                const btns = [
                    [{ text: '💋 ببوس', callback_data: `chamber_kiss_${person.id}` }],
                    [{ text: '🔥 عیاشی', callback_data: `chamber_orgy_${person.id}` }],
                    [{ text: '🔙 برگشت', callback_data: 'chamber_back' }]
                ];
                
                await bot.deleteMessage(chatId, msgId).catch(() => {});
                await sendAnimation(chatId, gif, `🖐️ ${person.emoji} ${person.name}\n${dialog}\n💕 +۵`, { reply_markup: { inline_keyboard: btns } });
                return bot.answerCallbackQuery(query.id);
            }

            // ============ 💋 بوسه ============
            if (data.startsWith('chamber_kiss_')) {
                const st = chamberState[chatId];
                if (!st || !st.person) return bot.answerCallbackQuery(query.id, { text: '❌ یک نفر انتخاب کن!' });
                const person = st.person;
                
                const dialog = dialogs.kiss[Math.floor(Math.random() * dialogs.kiss.length)];
                
                if (!p.prisonRelations) p.prisonRelations = {};
                p.prisonRelations[person.id] = Math.min(100, (p.prisonRelations[person.id] || 30) + 10);
                
                const btns = [
                    [{ text: '🔥 عیاشی', callback_data: `chamber_orgy_${person.id}` }],
                    [{ text: '🔙 برگشت', callback_data: 'chamber_back' }]
                ];
                
                await bot.deleteMessage(chatId, msgId).catch(() => {});
                await sendAnimation(chatId, sexyGifs.kiss, `💋 ${person.emoji} ${person.name}\n${dialog}\n💕 +۱۰`, { reply_markup: { inline_keyboard: btns } });
                return bot.answerCallbackQuery(query.id);
            }

            // ============ 🔥 عیاشی ============
            if (data.startsWith('chamber_orgy_')) {
                const st = chamberState[chatId];
                if (!st || !st.person) return bot.answerCallbackQuery(query.id, { text: '❌ یک نفر انتخاب کن!' });
                const person = st.person;
                
                const orgyGifs = [sexyGifs.orgy, ...sexyGifs.orgyExtra];
                const gif = orgyGifs[Math.floor(Math.random() * orgyGifs.length)];
                
                if (!p.prisonRelations) p.prisonRelations = {};
                p.prisonRelations[person.id] = Math.min(100, (p.prisonRelations[person.id] || 30) + 15);
                
                const { positionImages } = require('./core');
                const positions = ['front', 'back', 'oral'];
                const pos = positions[Math.floor(Math.random() * positions.length)];
                const image = positionImages[pos] ? positionImages[pos][Math.floor(Math.random() * positionImages[pos].length)] : null;
                
                let dialog;
                if (pos === 'front') dialog = dialogs.orgyFront[Math.floor(Math.random() * dialogs.orgyFront.length)];
                else if (pos === 'back') dialog = dialogs.orgyBack[Math.floor(Math.random() * dialogs.orgyBack.length)];
                else dialog = dialogs.orgyOral[Math.floor(Math.random() * dialogs.orgyOral.length)];
                
                const titles = { front: '🍑 از جلو', back: '🍑 از عقب', oral: '👄 دهنی' };
                
                await bot.deleteMessage(chatId, msgId).catch(() => {});
                await sendAnimation(chatId, gif, `🔥 ${person.emoji} ${person.name}\n${dialog}`, { reply_markup: { inline_keyboard: [] } });
                await new Promise(r => setTimeout(r, 2000));
                
                const btns = [[{ text: '🔙 برگشت', callback_data: 'chamber_back' }]];
                if (image) {
                    await sendPhoto(chatId, image, `${titles[pos]}\n\n${dialog}\n💕 +۱۵`, { reply_markup: { inline_keyboard: btns } });
                } else {
                    await bot.sendMessage(chatId, `${titles[pos]}\n\n${dialog}\n💕 +۱۵`, { parse_mode: 'Markdown', reply_markup: { inline_keyboard: btns } });
                }
                
                delete chamberState[chatId];
                return bot.answerCallbackQuery(query.id);
            }

            // ============ برگشت به مخفی‌گاه ============
            if (data === 'chamber_back') {
                delete chamberState[chatId];
                await bot.editMessageText(formatSecretChamber(p), {
                    chat_id: chatId, message_id: msgId, parse_mode: 'Markdown', ...getSecretChamberKeyboard(p)
                });
                return bot.answerCallbackQuery(query.id);
            }

        } catch(e) {
            console.log('Chamber handler error:', e.message);
            return bot.answerCallbackQuery(query.id, { text: '❌ خطا!' });
        }
    });
}

module.exports = { setupChamberHandlers };