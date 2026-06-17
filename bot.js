const TelegramBot = require('node-telegram-bot-api');
const axios = require('axios');

const BOT_TOKEN = process.env.BOT_TOKEN;
const API_KEY = process.env.OPENROUTER_API_KEY;

const bot = new TelegramBot(BOT_TOKEN, { polling: true });
bot.deleteWebhook();

const chatHistory = {};

const SYSTEM_PROMPT = 'تو یه همدم گرم و صمیمی هستی. عاشقانه، شیطون و مهربون حرف بزن. فارسی حرف بزن. مثل یه معشوقه رفتار کن.';

bot.on('message', async (msg) => {
    const chatId = msg.chat.id;
    const userId = msg.from.id;
    const text = msg.text;
    if (!text || msg.chat.type !== 'private') return;

    await bot.sendChatAction(chatId, 'typing');

    if (!chatHistory[userId]) chatHistory[userId] = [];
    chatHistory[userId].push({ role: 'user', content: text });
    if (chatHistory[userId].length > 15) chatHistory[userId] = chatHistory[userId].slice(-15);

    try {
        const response = await axios.post('https://openrouter.ai/api/v1/chat/completions', {
            model: 'google/gemini-2.0-flash-exp',
            messages: [{ role: 'system', content: SYSTEM_PROMPT }, ...chatHistory[userId]]
        }, {
            headers: {
                'Authorization': 'Bearer ' + API_KEY,
                'Content-Type': 'application/json',
                'HTTP-Referer': 'https://t.me/sexybot',
                'X-Title': 'Sexy Bot'
            }
        });

        const reply = response.data.choices[0].message.content;
        chatHistory[userId].push({ role: 'assistant', content: reply });
        await bot.sendMessage(chatId, reply);

    } catch (error) {
        console.log('Error:', error.response?.data || error.message);
        await bot.sendMessage(chatId, '😅 یه لحظه صبر کن...');
    }
});

bot.onText(/\/start/, async (msg) => {
    await bot.sendMessage(msg.chat.id, '🔥 سلام عزیزم! هر چی دلت میخواد بگو...');
});

bot.onText(/\/reset/, async (msg) => {
    delete chatHistory[msg.from.id];
    await bot.sendMessage(msg.chat.id, '🔄 حافظه پاک شد!');
});

console.log('✅ ربات سکسی آماده شد!');