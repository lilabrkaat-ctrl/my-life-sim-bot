const TelegramBot = require('node-telegram-bot-api');
const config = require('./config');
const { getPlayer, getGroup, getAllPlayers, players, groups } = require('./player');
const { debate, negotiate, war, spy, sanction } = require('./game');
const { getDialogue } = require('./dialogues');
const { setBot, saveAll, loadAll, autoSave, ADMIN_ID } = require('./storage');

const token = process.env.BOT_TOKEN || config.BOT_TOKEN;
const bot = new TelegramBot(token, { polling: true });

// ============ شروع ============
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
}
startBot();

// ============ START ============
bot.onText(/\/start|\/شروع/, async (msg) => {
    const chatId = msg.chat.id;
    const userId = msg.from.id;
    const firstName = msg.from.first_name || 'کاربر';

    if (msg.chat.type === 'private') {
        return bot.sendMessage(chatId, '❌ این ربات فقط توی گروه کار می‌کنه!');
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

    await bot.sendMessage(chatId,
        '🎭 *' + firstName + ' عزیز!*\n\nبه بازی سیاسی ایران خوش اومدی!\n👈 *یه شخصیت انتخاب کن:*',
        { parse_mode: 'Markdown', reply_markup: { inline_keyboard: keyboard } }
    );
});

// ============ انتخاب شخصیت ============
bot.on('callback_query', async (query) => {
    const chatId = query.message.chat.id;
    const userId = query.from.id;
    const data = query.data;

    if (!data.startsWith('choose_')) return;

    const charKey = data.replace('choose_', '');
    const charData = config.characters[charKey];
    if (!charData) return;

    getPlayer(userId, chatId, charKey, charData);
    getGroup(chatId);

    await bot.answerCallbackQuery(query.id, { text: '✅ حالا تو ' + charData.name + ' هستی!' });
    await bot.editMessageText(
        charData.emoji + ' *' + charData.name + '* انتخاب شد!\n\n' +
        '⚡ قدرت: ' + charData.power + ' | 📊 محبوبیت: ' + charData.popularity + '% | 💰 بودجه: ' + charData.budget + 'B\n' +
        '🎯 قدرت ویژه: *' + charData.special + '*\n\n' +
        '🎮 *دستورات:* مناظره | ائتلاف | جنگ | جاسوسی | تحریم | وضعیت | رتبه‌بندی | وضعیت گروه',
        { chat_id: chatId, message_id: query.message.message_id, parse_mode: 'Markdown' }
    );
});

// ============ دستورات ============
bot.on('message', async (msg) => {
    const chatId = msg.chat.id;
    const userId = msg.from.id;
    const text = msg.text;
    if (!text || msg.chat.type === 'private') return;

    const player = getPlayer(userId, chatId);
    const group = getGroup(chatId);

    // وضعیت
    if (text === 'وضعیت' || text === 'وضع') {
        if (!player) return bot.sendMessage(chatId, '❌ اول /start بزن!');
        let s = player.emoji + ' *' + player.name + '*\n⚡' + player.power + ' 📊' + player.popularity + '% 💰' + player.budget + 'B\n🏆' + player.wins + ' 💀' + player.losses;
        return bot.sendMessage(chatId, s, { parse_mode: 'Markdown' });
    }

    // وضعیت گروه
    if (text === 'وضعیت گروه' || text === 'گروه') {
        if (!group) return bot.sendMessage(chatId, '❌ گروهی نیست!');
        let s = '🏛️ *وضعیت گروه*\n🛢️' + group.oil + ' 💰' + group.budget + ' 📊' + group.popularity + '% ⚔️' + group.military + '% 🏭' + group.industry + '%';
        return bot.sendMessage(chatId, s, { parse_mode: 'Markdown' });
    }

    // رتبه‌بندی
    if (text === 'رتبه‌بندی' || text === 'ranking') {
        const all = getAllPlayers(chatId);
        if (!all.length) return bot.sendMessage(chatId, '📊 هنوز کسی نیست!');
        all.sort((a, b) => b.popularity - a.popularity);
        let r = '🏆 *رتبه‌بندی*\n\n';
        all.slice(0, 10).forEach((p, i) => { r += (i+1) + '. ' + p.emoji + ' ' + p.name + ' 📊' + p.popularity + '%\n'; });
        return bot.sendMessage(chatId, r, { parse_mode: 'Markdown' });
    }

    if (!player) return;

    // اعمال روی کاربر دیگه (نیاز به ریپلای)
    if (text === 'مناظره' || text === 'ائتلاف' || text === 'اتحاد' || text === 'جنگ' || text === 'بجنگ' || text === 'جاسوسی' || text === 'تحریم') {
        if (!msg.reply_to_message) return bot.sendMessage(chatId, '❌ روی پیام یکی ریپلای کن!');
        const target = getPlayer(msg.reply_to_message.from.id, chatId);
        if (!target) return bot.sendMessage(chatId, '❌ این کاربر ثبت‌نام نکرده!');
        if (target.userId === userId) return bot.sendMessage(chatId, '❌ روی خودت نه!');

        let result, dialogue;
        
        if (text === 'مناظره') {
            result = debate(player, target);
            dialogue = getDialogue(player.character, target.character, 'debate');
        } else if (text === 'ائتلاف' || text === 'اتحاد') {
            result = negotiate(player, target);
            dialogue = getDialogue(player.character, target.character, 'negotiate');
        } else if (text === 'جنگ' || text === 'بجنگ') {
            result = war(player, target, group);
            dialogue = getDialogue(player.character, target.character, 'war');
        } else if (text === 'جاسوسی') {
            result = spy(player, target);
            dialogue = ['🕵️ *جاسوسی در جریانه...*'];
        } else if (text === 'تحریم') {
            result = sanction(player, target, group);
            dialogue = ['🚫 *تحریم اعمال شد!*'];
        }

        let msg2 = dialogue.join('\n') + '\n\n' + result.message;
        return bot.sendMessage(chatId, msg2, { parse_mode: 'Markdown' });
    }
});

// ============ ذخیره (فقط ادمین) ============
bot.onText(/\/save/, async (msg) => {
    if (msg.from.id !== ADMIN_ID) return;
    await saveAll(players, groups);
    await bot.sendMessage(msg.chat.id, '✅ ذخیره شد! 💾');
});

// ============ خطاها ============
bot.on('polling_error', (e) => console.log('Polling:', e.message));

console.log('🎉 ربات آماده!');