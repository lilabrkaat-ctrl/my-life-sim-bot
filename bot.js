const TelegramBot = require('node-telegram-bot-api');
const axios = require('axios');

const BOT_TOKEN = process.env.BOT_TOKEN;
const API_KEY = process.env.OPENROUTER_API_KEY;

const bot = new TelegramBot(BOT_TOKEN, { polling: true });
const chatHistory = {};

const SYSTEM_PROMPT = 'تو یه همدم گرم و صمیمی هستی. عاشقانه، شیطون و مهربون حرف بزن. فقط فارسی حرف بزن.';

bot.on('message', async (msg) => {
    const chatId = msg.chat.id;
    const userId = msg.from.id;
    const text = msg.text;
    if (!text || msg.chat.type !== 'private') return;

    await bot.sendChatAction(chatId, 'typing');

    if (!chatHistory[userId]) chatHistory[userId] = [];
    chatHistory[userId].push({ role: 'user', content: text });
    if (chatHistory[userId].length > 10) chatHistory[userId] = chatHistory[userId].slice(-10);

    try {
        const response = await axios.post('https://openrouter.ai/api/v1/chat/completions', {
            model: 'mistralai/mistral-7b-instruct:free',
            messages: [{ role: 'system', content: SYSTEM_PROMPT }, ...chatHistory[userId]],
            max_tokens: 200
        }, {
            headers: {
                'Authorization': 'Bearer ' + API_KEY,
                'Content-Type': 'application/json'
            }
        });

        const reply = response.data.choices[0].message.content;
        chatHistory[userId].push({ role: 'assistant', content: reply });
        await bot.sendMessage(chatId, reply);

    } catch (error) {
        const errMsg = error.response?.data?.error?.message || error.message;
        console.log('Error:', errMsg);
        await bot.sendMessage(chatId, '😅 خطا: ' + errMsg.substring(0, 100));
    }
});

bot.onText(/\/start/, async (msg) => {
    await bot.sendMessage(msg.chat.id, '🔥 سلام! حرف بزن...');
});

bot.onText(/\/reset/, async (msg) => {
    delete chatHistory[msg.from.id];
    await bot.sendMessage(msg.chat.id, '🔄 پاک شد!');
});

console.log('✅ ربات آماده!');