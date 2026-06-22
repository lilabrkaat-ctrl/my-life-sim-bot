const TelegramBot = require('node-telegram-bot-api');

const bot = new TelegramBot(process.env.BOT_TOKEN, { polling: true });

const leagues = ["لیگ استانی بندرلنگه", "لیگ دسته دوم", "لیگ آزادگان", "لیگ برتر خلیج فارس"];
let currentLeagueIndex = 0;
const teamName = "بندرلنگه FC";

const userData = {};

bot.onText(/\/start/, (msg) => {
  const chatId = msg.chat.id;
  userData[chatId] = userData[chatId] || {
    team: teamName,
    league: leagues[0],
    points: 0,
    budget: 500000000,
    wins: 0
  };
  mainMenu(chatId);
});

function mainMenu(chatId) {
  const data = userData[chatId];
  const text = `🏟️ **مدیر باشگاه ${data.team}**\n\n` +
    `📍 لیگ: ${data.league}\n` +
    `💰 بودجه: ${data.budget.toLocaleString('fa-IR')} تومان\n` +
    `🏆 امتیاز: ${data.points}\n` +
    `⚽ برد: ${data.wins}`;

  bot.sendMessage(chatId, text, {
    reply_markup: {
      inline_keyboard: [
        [{ text: '🎮 بازی بعدی', callback_data: 'play_match' }],
        [{ text: '👥 ترکیب تیم', callback_data: 'squad' }],
        [{ text: '📊 جدول لیگ', callback_data: 'league_table' }],
        [{ text: '🏋️ تمرین', callback_data: 'training' }],
        [{ text: 'ℹ️ اطلاعات', callback_data: 'info' }]
      ]
    }
  });
}

bot.on('callback_query', (callbackQuery) => {
  const chatId = callbackQuery.message.chat.id;
  const data = callbackQuery.data;

  if (data === 'play_match') {
    const user = userData[chatId];
    const opponents = ["ملوان بندرعباس", "فجر سپاسی", "داماش گیلان", "استقلال", "پرسپولیس"];
    const opponent = opponents[Math.floor(Math.random() * opponents.length)];
    
    const yourScore = Math.floor(Math.random() * 4);
    const oppScore = Math.floor(Math.random() * 4);

    let result = '';
    if (yourScore > oppScore) {
      result = `🎉 برد! ${yourScore} - ${oppScore} مقابل ${opponent}`;
      user.points += 3;
      user.wins++;
    } else if (yourScore === oppScore) {
      result = `🤝 مساوی ${yourScore} - ${oppScore} مقابل ${opponent}`;
      user.points += 1;
    } else {
      result = `😢 باخت ${yourScore} - ${oppScore} مقابل ${opponent}`;
    }

    if (user.points >= 12 && currentLeagueIndex < leagues.length - 1) {
      currentLeagueIndex++;
      user.league = leagues[currentLeagueIndex];
      result += `\n\n🚀 صعود به ${user.league}!`;
    }

    bot.editMessageText(result, {
      chat_id: chatId,
      message_id: callbackQuery.message.message_id,
      reply_markup: { inline_keyboard: [[{ text: 'بازگشت به منو', callback_data: 'back' }]] }
    });
  } 
  else if (data === 'training') {
    userData[chatId].budget += 50000000;
    bot.editMessageText(`🏋️ تمرین انجام شد!\n۵۰ میلیون به بودجه اضافه شد.`, {
      chat_id: chatId,
      message_id: callbackQuery.message.message_id,
      reply_markup: { inline_keyboard: [[{ text: 'بازگشت به منو', callback_data: 'back' }]] }
    });
  } 
  else if (data === 'back') {
    mainMenu(chatId);
  } 
  else if (data === 'squad') {
    bot.editMessageText(`👥 ترکیب تیم:\nدروازه‌بان: علی رستمی\nمدافع: حسینی، رضایی\nهافبک: کریمی، محمدی\nمهاجم: قایدی، ترابی`, {
      chat_id: chatId,
      message_id: callbackQuery.message.message_id,
      reply_markup: { inline_keyboard: [[{ text: 'بازگشت به منو', callback_data: 'back' }]] }
    });
  } 
  else if (data === 'league_table' || data === 'info') {
    const user = userData[chatId];
    const text = data === 'league_table' 
      ? `📊 جدول لیگ ${user.league}\n\n1. ${teamName} - ${user.points} امتیاز`
      : `ℹ️ لیگ: ${user.league}\nبودجه: ${user.budget.toLocaleString('fa-IR')} تومان`;
    
    bot.editMessageText(text, {
      chat_id: chatId,
      message_id: callbackQuery.message.message_id,
      reply_markup: { inline_keyboard: [[{ text: 'بازگشت به منو', callback_data: 'back' }]] }
    });
  }
});

console.log('ربات با node-telegram-bot-api راه افتاد ⚽');