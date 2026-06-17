const TelegramBot = require('node-telegram-bot-api');
const axios = require('axios');

const BOT_TOKEN = process.env.BOT_TOKEN;
const API_KEY = process.env.OPENROUTER_API_KEY;

const bot = new TelegramBot(BOT_TOKEN, { 
    polling: {
        timeout: 10,
        interval: 300,
        autoStart: true
    }
});

// پاک کردن webhook برای جلوگیری از ارور 409
bot.deleteWebhook();

const chatHistory = {};

const SYSTEM_PROMPT = 'تو یه همدم گرم و صمیمی هستی. عاشقانه، شیطون و مهربون حرف بزن. فارسی حرف بزن. مثل یه معشوقه رفتار کن.';

// دکمه‌های شیشه‌ای
const mainMenu = {
    reply_markup: {
        keyboard: [
            ['💖 شروع مکالمه', '🔄 پاک کردن حافظه'],
            ['❓ راهنما']
        ],
        resize_keyboard: true
    }
};

bot.onText(/\/start/, async (msg) => {
    await bot.sendMessage(msg.chat.id, 
        '🔥 سلام عزیزم! من اینجام تا باهات حرف بزنم.\n\n' +
        'هر چی دلت میخواد بگو، من گوش میدم ❤️\n' +
        'برای راهنما دکمه راهنما رو بزن.',
        mainMenu
    );
});

bot.on('message', async (msg) => {
    const chatId = msg.chat.id;
    const userId = msg.from.id;
    const text = msg.text;
    
    if (!text || msg.chat.type !== 'private') return;

    // دکمه‌های منو
    if (text === '💖 شروع مکالمه') {
        await bot.sendMessage(chatId, '💬 بگو عزیزم، گوش میدم...');
        return;
    }
    
    if (text === '🔄 پاک کردن حافظه') {
        delete chatHistory[userId];
        await bot.sendMessage(chatId, '🧹 حافظه پاک شد! از اول شروع کنیم؟', mainMenu);
        return;
    }
    
    if (text === '❓ راهنما') {
        await bot.sendMessage(chatId, 
            '📖 *راهنمای ربات:*\n\n' +
            '• هر چی دلت میخواد بگو\n' +
            '• من پاسخ میدم با عشق ❤️\n' +
            '• حافظه ۱۵ پیام آخر رو یادم میمونه\n' +
            '• با /reset میتونی حافظه رو پاک کنی\n' +
            '• با /start منو رو دوباره بیار\n\n' +
            '✨ خوشحالم که اینجایی!',
            { parse_mode: 'Markdown', reply_markup: mainMenu.reply_markup }
        );
        return;
    }

    await bot.sendChatAction(chatId, 'typing');

    // مدیریت حافظه
    if (!chatHistory[userId]) chatHistory[userId] = [];
    chatHistory[userId].push({ role: 'user', content: text });
    if (chatHistory[userId].length > 15) chatHistory[userId] = chatHistory[userId].slice(-15);

    try {
        const response = await axios.post('https://openrouter.ai/api/v1/chat/completions', {
            model: 'google/gemini-2.0-flash-exp',
            messages: [
                { role: 'system', content: SYSTEM_PROMPT },
                ...chatHistory[userId]
            ],
            temperature: 0.9,
            max_tokens: 500,
            top_p: 0.9,
            frequency_penalty: 0.5,
            presence_penalty: 0.5
        }, {
            timeout: 20000,
            headers: {
                'Authorization': 'Bearer ' + API_KEY,
                'Content-Type': 'application/json',
                'HTTP-Referer': 'https://t.me/sexybot',
                'X-Title': 'Sexy Bot'
            }
        });

        const reply = response.data.choices[0].message.content;
        chatHistory[userId].push({ role: 'assistant', content: reply });
        
        // ارسال پاسخ با دکمه‌ها
        await bot.sendMessage(chatId, reply, {
            reply_markup: mainMenu.reply_markup
        });

    } catch (error) {
        console.log('Error:', error.response?.data || error.message);
        
        // ارسال پیام خطا با دکمه‌ها
        if (error.code === 'ECONNABORTED') {
            await bot.sendMessage(chatId, 
                '⏳ نتونستم جواب بدم، دوباره تلاش کن عزیزم 💕',
                { reply_markup: mainMenu.reply_markup }
            );
        } else {
            await bot.sendMessage(chatId, 
                '😅 یه مشکلی پیش اومد. دوباره بگو لطفاً...',
                { reply_markup: mainMenu.reply_markup }
            );
        }
    }
});

bot.onText(/\/reset/, async (msg) => {
    delete chatHistory[msg.from.id];
    await bot.sendMessage(msg.chat.id, '🔄 حافظه پاک شد!', mainMenu);
});

console.log('✅ ربات با موفقیت روشن شد! ❤️');