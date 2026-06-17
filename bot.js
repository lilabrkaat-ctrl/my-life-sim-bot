const TelegramBot = require('node-telegram-bot-api');
const config = require('./config');
const { getPlayer, getGroup, getAllPlayers, players, groups } = require('./player');
const { startDebate, voteInDebate, finishDebate, quickDebate, negotiate, war, spy, sanction, activeDebates } = require('./game');
const { getDialogue } = require('./dialogues');
const { setBot, saveAll, loadAll, autoSave, ADMIN_ID } = require('./storage');

const token = process.env.BOT_TOKEN || config.BOT_TOKEN;
const bot = new TelegramBot(token, { polling: true });

// ============ شروع ربات ============
async function startBot() {
    setBot(bot);
    const savedData = await loadAll();
    if (savedData) {
        if (savedData.players) Object.assign(players, savedData.players);
        if (savedData.groups) Object.assign(groups, savedData.groups);
        console.log('✅ اطلاعات از حافظه لود شد!');
    }
    autoSave(players, groups);
    console.log('🇮🇷 ربات بازی سیاسی ایران آماده شد!');
    console.log('👥 ' + Object.keys(players).length + ' بازیکن | 🏛️ ' + Object.keys(groups).length + ' گروه');
}
startBot();

// ============ START ============
bot.onText(/\/start|\/شروع/, async (msg) => {
    const chatId = msg.chat.id;
    const userId = msg.from.id;
    const firstName = msg.from.first_name || 'کاربر';

    if (msg.chat.type === 'private') {
        return bot.sendMessage(chatId, 
            '🇮🇷 *بازی سیاسی ایران*\n\n' +
            '❌ این ربات فقط توی *گروه* کار می‌کنه!\n' +
            '🔹 ربات رو به گروهت اضافه کن!',
            { parse_mode: 'Markdown' }
        );
    }

    // چک کن قبلاً ثبت‌نام کرده یا نه
    const existing = getPlayer(userId, chatId);
    if (existing) {
        return bot.sendMessage(chatId,
            '⚠️ *' + firstName + '* تو قبلاً ثبت‌نام کردی!\n\n' +
            existing.emoji + ' *' + existing.name + '* هستی.\n\n' +
            '📊 وضعیت: /وضعیت',
            { parse_mode: 'Markdown' }
        );
    }

    const chars = config.characters;
    let keyboard = [];
    let row = [];
    let count = 0;
    
    for (let key in chars) {
        row.push({ text: chars[key].emoji + ' ' + chars[key].name, callback_data: 'choose_' + key });
        count++;
        if (count % 2 === 0) { keyboard.push(row); row = []; }
    }
    if (row.length > 0) keyboard.push(row);
    
    // دکمه راهنما
    keyboard.push([{ text: '📖 راهنمای بازی', callback_data: 'help' }]);

    await bot.sendMessage(chatId,
        '🎭 *' + firstName + ' عزیز!*\n\n' +
        '🇮🇷 به *بازی سیاسی ایران* خوش اومدی!\n\n' +
        '👈 *یه شخصیت انتخاب کن:*\n\n' +
        '⚡ = قدرت | 📊 = محبوبیت | 💰 = بودجه',
        { parse_mode: 'Markdown', reply_markup: { inline_keyboard: keyboard } }
    );
});

// ============ CALLBACK ها ============
bot.on('callback_query', async (query) => {
    const chatId = query.message.chat.id;
    const userId = query.from.id;
    const data = query.data;

    // ============ انتخاب شخصیت ============
    if (data.startsWith('choose_')) {
        const charKey = data.replace('choose_', '');
        const charData = config.characters[charKey];
        if (!charData) return bot.answerCallbackQuery(query.id, { text: '❌ شخصیت نامعتبر!' });

        getPlayer(userId, chatId, charKey, charData);
        getGroup(chatId);

        await bot.answerCallbackQuery(query.id, { text: '✅ حالا تو ' + charData.name + ' هستی! 🎉' });
        await bot.editMessageText(
            charData.emoji + ' *' + charData.name + '* انتخاب شد!\n\n' +
            '⚡ *قدرت:* ' + charData.power + '\n' +
            '📊 *محبوبیت:* ' + charData.popularity + '%\n' +
            '💰 *بودجه:* ' + charData.budget + ' میلیارد\n' +
            '🎯 *قدرت ویژه:* ' + charData.special + '\n\n' +
            '━━━━━━━━━━━━━━━\n\n' +
            '🎮 *دستورات بازی:*\n' +
            '📝 *مناظره* - روی پیام یکی ریپلای کن\n' +
            '🤝 *ائتلاف* - متحد شو\n' +
            '⚔️ *جنگ* - حمله کن\n' +
            '🕵️ *جاسوسی* - اطلاعات بگیر\n' +
            '🚫 *تحریم* - تحریم کن\n' +
            '📊 *وضعیت* - آمار خودت\n' +
            '🏆 *رتبه‌بندی* - جدول گروه\n' +
            '🏛️ *وضعیت گروه* - منابع گروه',
            { chat_id: chatId, message_id: query.message.message_id, parse_mode: 'Markdown' }
        );
        return;
    }

    // ============ راهنما ============
    if (data === 'help') {
        await bot.answerCallbackQuery(query.id, { text: '📖 راهنما' });
        await bot.editMessageText(
            '📖 *راهنمای بازی سیاسی ایران*\n\n' +
            '🎭 *شروع:* /start رو بزن و شخصیت انتخاب کن\n\n' +
            '🎮 *دستورات:*\n' +
            '• *مناظره* - روی پیام یکی ریپلای کن و "مناظره" بفرست\n' +
            '  🗳️ اعضای گروه ۶۰ ثانیه رأی میدن!\n\n' +
            '• *ائتلاف* - با یکی متحد شو\n' +
            '• *جنگ* - به یکی حمله کن\n' +
            '• *جاسوسی* - از یکی جاسوسی کن (۷۰٪ موفقیت)\n' +
            '• *تحریم* - یکی رو تحریم کن\n\n' +
            '📊 *وضعیت* - آمار خودت رو ببین\n' +
            '🏆 *رتبه‌بندی* - جدول امتیازات گروه\n' +
            '🏛️ *وضعیت گروه* - منابع گروه',
            { chat_id: chatId, message_id: query.message.message_id, parse_mode: 'Markdown' }
        );
        return;
    }

    // ============ رأی‌گیری مناظره ============
    if (data === 'vote_1' || data === 'vote_2') {
        // پیدا کردن مناظره فعال برای این چت
        let debateId = null;
        for (let id in activeDebates) {
            if (activeDebates[id].chatId === chatId) {
                debateId = id;
                break;
            }
        }

        if (!debateId) {
            return bot.answerCallbackQuery(query.id, { text: '❌ مناظره‌ای در جریان نیست!', show_alert: true });
        }

        const choice = data === 'vote_1' ? 1 : 2;
        const result = voteInDebate(debateId, userId, choice);
        return bot.answerCallbackQuery(query.id, { text: result.message.replace(/[*_]/g, ''), show_alert: true });
    }
});

// ============ دستورات متنی ============
bot.on('message', async (msg) => {
    const chatId = msg.chat.id;
    const userId = msg.from.id;
    const text = msg.text;
    
    if (!text || msg.chat.type === 'private') return;

    const player = getPlayer(userId, chatId);
    const group = getGroup(chatId);

    // ============ وضعیت ============
    if (text === 'وضعیت' || text === 'وضع') {
        if (!player) return bot.sendMessage(chatId, '❌ اول /start بزن!');
        
        let status = '👤 *وضعیت شما*\n\n';
        status += player.emoji + ' *' + player.name + '*\n';
        status += '━━━━━━━━━━━━━━━\n';
        status += '⚡ قدرت: ' + player.power + '\n';
        status += '📊 محبوبیت: ' + player.popularity + '%\n';
        status += '💰 بودجه: ' + player.budget + ' میلیارد\n';
        status += '🎯 قدرت ویژه: ' + player.special + '\n';
        status += '🏆 برد: ' + player.wins + ' | 💀 باخت: ' + player.losses + '\n';
        status += '🤝 ائتلاف‌ها: ' + (player.alliances.length || 'نداره') + '\n';
        status += '🚫 تحریم‌ها: ' + (player.sanctions.length || 'نداره');
        
        return bot.sendMessage(chatId, status, { parse_mode: 'Markdown' });
    }

    // ============ وضعیت گروه ============
    if (text === 'وضعیت گروه' || text === 'گروه') {
        if (!group) return bot.sendMessage(chatId, '❌ گروهی وجود نداره!');
        
        let status = '🏛️ *وضعیت گروه*\n\n';
        status += '🛢️ نفت: ' + group.oil + '/' + group.maxOil + '\n';
        status += '💰 بودجه: ' + group.budget + '/' + group.maxBudget + '\n';
        status += '📊 محبوبیت: ' + group.popularity + '%\n';
        status += '⚔️ قدرت نظامی: ' + group.military + '%\n';
        status += '🏭 صنعت: ' + group.industry + '%\n\n';
        status += '👥 تعداد بازیکنان: ' + getAllPlayers(chatId).length + ' نفر';
        
        return bot.sendMessage(chatId, status, { parse_mode: 'Markdown' });
    }

    // ============ رتبه‌بندی ============
    if (text === 'رتبه‌بندی' || text === 'رده‌بندی' || text === 'ranking') {
        const allPlayers = getAllPlayers(chatId);
        if (allPlayers.length === 0) return bot.sendMessage(chatId, '📊 هنوز کسی ثبت‌نام نکرده!');
        
        allPlayers.sort((a, b) => b.popularity - a.popularity);
        
        let ranking = '🏆 *رتبه‌بندی سیاستمداران*\n\n';
        const medals = ['🥇', '🥈', '🥉'];
        for (let i = 0; i < Math.min(allPlayers.length, 10); i++) {
            const p = allPlayers[i];
            const medal = i < 3 ? medals[i] : (i + 1) + '.';
            ranking += medal + ' ' + p.emoji + ' *' + p.name + '*\n';
            ranking += '   📊 ' + p.popularity + '% | ⚡ ' + p.power + ' | 💰 ' + p.budget + 'B\n';
        }
        
        return bot.sendMessage(chatId, ranking, { parse_mode: 'Markdown' });
    }

    if (!player) return;

    // ============ مناظره (با رأی‌گیری) ============
    if (text === 'مناظره' || text === 'debate') {
        if (!msg.reply_to_message) {
            return bot.sendMessage(chatId, '❌ باید روی پیام یه نفر ریپلای کنی و "مناظره" رو بفرستی!\n🎯 مثال: روی پیام حسن ریپلای کن و بنویس "مناظره"');
        }

        const targetId = msg.reply_to_message.from.id;
        if (targetId === userId) return bot.sendMessage(chatId, '❌ نمی‌تونی با خودت مناظره کنی! 😂');

        const target = getPlayer(targetId, chatId);
        if (!target) return bot.sendMessage(chatId, '❌ این کاربر هنوز ثبت‌نام نکرده! /start رو بزنه.');

        const dialogue = getDialogue(player.character, target.character, 'debate');
        
        // شروع مناظره
        const result = startDebate(player, target, chatId);
        
        // ارسال پیام اولیه
        let timeLeft = 60;
        const debateMsg = await bot.sendMessage(chatId,
            '⚔️ *مناظره سیاسی!*\n\n' +
            player.emoji + ' *' + player.name + '* 🆚 ' + target.emoji + ' *' + target.name + '*\n\n' +
            dialogue.join('\n') + '\n\n' +
            '🗳️ *اعضای گروه رأی بدن!*\n' +
            '⏰ *زمان باقی‌مانده: ۶۰ ثانیه*\n\n' +
            '📊 *آرای فعلی:*\n' +
            player.emoji + ' ' + player.name + ': ۰ رأی\n' +
            target.emoji + ' ' + target.name + ': ۰ رأی',
            { 
                parse_mode: 'Markdown',
                reply_markup: {
                    inline_keyboard: [
                        [{ text: '🗳️ رأی به ' + player.name, callback_data: 'vote_1' }],
                        [{ text: '🗳️ رأی به ' + target.name, callback_data: 'vote_2' }]
                    ]
                }
            }
        );

        // آپدیت تایمر
        const timerInterval = setInterval(async () => {
            timeLeft -= 5;
            if (timeLeft <= 0) { clearInterval(timerInterval); return; }
            
            const debate = activeDebates[result.debateId];
            if (!debate) { clearInterval(timerInterval); return; }
            
            try {
                await bot.editMessageText(
                    '⚔️ *مناظره سیاسی!*\n\n' +
                    player.emoji + ' *' + player.name + '* 🆚 ' + target.emoji + ' *' + target.name + '*\n\n' +
                    dialogue.join('\n') + '\n\n' +
                    '🗳️ *اعضای گروه رأی بدن!*\n' +
                    '⏰ *زمان باقی‌مانده: ' + timeLeft + ' ثانیه*\n\n' +
                    '📊 *آرای فعلی:*\n' +
                    player.emoji + ' ' + player.name + ': ' + debate.votes1.length + ' رأی\n' +
                    target.emoji + ' ' + target.name + ': ' + debate.votes2.length + ' رأی',
                    { 
                        chat_id: chatId, message_id: debateMsg.message_id,
                        parse_mode: 'Markdown',
                        reply_markup: {
                            inline_keyboard: [
                                [{ text: '🗳️ رأی به ' + player.name, callback_data: 'vote_1' }],
                                [{ text: '🗳️ رأی به ' + target.name, callback_data: 'vote_2' }]
                            ]
                        }
                    }
                );
            } catch(e) {}
        }, 5000);
        
        // پایان مناظره
        setTimeout(async () => {
            clearInterval(timerInterval);
            const finalResult = finishDebate(result.debateId);
            if (!finalResult) return;
            
            try {
                await bot.editMessageText(finalResult.message, { 
                    chat_id: chatId, message_id: debateMsg.message_id, parse_mode: 'Markdown' 
                });
            } catch(e) {}
            
            // ذخیره خودکار
            await saveAll(players, groups);
        }, 60000);
    }

    // ============ ائتلاف ============
    else if (text === 'ائتلاف' || text === 'اتحاد' || text === 'negotiate') {
        if (!msg.reply_to_message) return bot.sendMessage(chatId, '❌ روی پیام یکی ریپلای کن!');
        const targetId = msg.reply_to_message.from.id;
        if (targetId === userId) return bot.sendMessage(chatId, '❌ روی خودت نه!');
        const target = getPlayer(targetId, chatId);
        if (!target) return bot.sendMessage(chatId, '❌ این کاربر ثبت‌نام نکرده!');
        
        const result = negotiate(player, target);
        return bot.sendMessage(chatId, result.message, { parse_mode: 'Markdown' });
    }

    // ============ جنگ ============
    else if (text === 'جنگ' || text === 'بجنگ' || text === 'war') {
        if (!msg.reply_to_message) return bot.sendMessage(chatId, '❌ روی پیام یکی ریپلای کن!');
        const targetId = msg.reply_to_message.from.id;
        if (targetId === userId) return bot.sendMessage(chatId, '❌ روی خودت نه!');
        const target = getPlayer(targetId, chatId);
        if (!target) return bot.sendMessage(chatId, '❌ این کاربر ثبت‌نام نکرده!');
        
        const result = war(player, target, group);
        return bot.sendMessage(chatId, result.message, { parse_mode: 'Markdown' });
    }

    // ============ جاسوسی ============
    else if (text === 'جاسوسی' || text === 'spy') {
        if (!msg.reply_to_message) return bot.sendMessage(chatId, '❌ روی پیام یکی ریپلای کن!');
        const targetId = msg.reply_to_message.from.id;
        const target = getPlayer(targetId, chatId);
        if (!target) return bot.sendMessage(chatId, '❌ این کاربر ثبت‌نام نکرده!');
        
        const result = spy(player, target);
        return bot.sendMessage(chatId, result.message, { parse_mode: 'Markdown' });
    }

    // ============ تحریم ============
    else if (text === 'تحریم' || text === 'sanction') {
        if (!msg.reply_to_message) return bot.sendMessage(chatId, '❌ روی پیام یکی ریپلای کن!');
        const targetId = msg.reply_to_message.from.id;
        const target = getPlayer(targetId, chatId);
        if (!target) return bot.sendMessage(chatId, '❌ این کاربر ثبت‌نام نکرده!');
        
        const result = sanction(player, target, group);
        return bot.sendMessage(chatId, result.message, { parse_mode: 'Markdown' });
    }
});

// ============ ذخیره دستی (ادمین) ============
bot.onText(/\/save|\/ذخیره/, async (msg) => {
    if (msg.from.id !== ADMIN_ID) return;
    await saveAll(players, groups);
    await bot.sendMessage(msg.chat.id, '✅ اطلاعات با موفقیت ذخیره شد! 💾');
});

// ============ آمار کلی (ادمین) ============
bot.onText(/\/stats|\/آمار/, async (msg) => {
    if (msg.from.id !== ADMIN_ID) return;
    let stats = '📊 *آمار کلی ربات*\n\n';
    stats += '👥 کل بازیکنان: ' + Object.keys(players).length + ' نفر\n';
    stats += '🏛️ کل گروه‌ها: ' + Object.keys(groups).length + ' گروه\n';
    await bot.sendMessage(msg.chat.id, stats, { parse_mode: 'Markdown' });
});

// ============ خطاها ============
bot.on('polling_error', (error) => {
    console.log('⚠️ خطای polling:', error.message);
});

bot.on('error', (error) => {
    console.log('❌ خطای ربات:', error.message);
});

console.log('🎉 ربات بازی سیاسی ایران آماده و در حال اجراست!');
console.log('👑 ادمین: ' + ADMIN_ID);