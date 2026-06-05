const TelegramBot = require('node-telegram-bot-api');

const token = process.env.BOT_TOKEN || 'YOUR_BOT_TOKEN_HERE_PLACEHOLDER';

const bot = new TelegramBot(token, { polling: true });

bot.onText(/\/start/, (msg) => {
    const chatId = msg.chat.id;
    bot.sendMessage(chatId, 'Hello! I am an echo bot. I will repeat whatever you say!');
});

bot.on('message', (msg) => {
    const chatId = msg.chat.id;
    const text = msg.text;

    if (text && text !== '/start') {
        bot.sendMessage(chatId, `You said: ${text}`);
    }
});

console.log('Bot is running...');