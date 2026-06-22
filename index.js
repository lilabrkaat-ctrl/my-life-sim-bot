const { Telegraf, Markup } = require('telegraf');

const bot = new Telegraf(process.env.BOT_TOKEN);

const leagues = ["لیگ استانی بندرلنگه", "لیگ دسته دوم", "لیگ آزادگان", "لیگ برتر خلیج فارس"];
let currentLeagueIndex = 0;

const teamName = "بندرلنگه FC";

// داده ساده در حافظه (هر بار ری‌استارت صفر می‌شه)
const userData = {};

bot.start((ctx) => {
  const userId = ctx.from.id;
  
  userData[userId] = userData[userId] || {
    team: teamName,
    league: leagues[0],
    points: 0,
    budget: 500000000,
    wins: 0
  };

  mainMenu(ctx, userId);
});

function mainMenu(ctx, userId) {
  const data = userData[userId];
  ctx.reply(`🏟️ **مدیر باشگاه ${data.team}**\n\n` +
    `📍 لیگ: ${data.league}\n` +
    `💰 بودجه: ${data.budget.toLocaleString('fa-IR')} تومان\n` +
    `🏆 امتیاز: ${data.points}\n` +
    `⚽ برد: ${data.wins}`,
    Markup.inlineKeyboard([
      [Markup.button.callback('🎮 بازی بعدی', 'play_match')],
      [Markup.button.callback('👥 ترکیب تیم', 'squad')],
      [Markup.button.callback('📊 جدول لیگ', 'league_table')],
      [Markup.button.callback('🏋️ تمرین', 'training')],
      [Markup.button.callback('ℹ️ اطلاعات', 'info')]
    ])
  );
}

bot.action('play_match', (ctx) => {
  const userId = ctx.from.id;
  const data = userData[userId];

  const opponents = ["ملوان بندرعباس", "فجر سپاسی", "داماش گیلان", "استقلال", "پرسپولیس"];
  const opponent = opponents[Math.floor(Math.random() * opponents.length)];
  
  const yourScore = Math.floor(Math.random() * 4);
  const oppScore = Math.floor(Math.random() * 4);

  let result = '';
  if (yourScore > oppScore) {
    result = `🎉 برد! ${yourScore} - ${oppScore} مقابل ${opponent}`;
    data.points += 3;
    data.wins++;
  } else if (yourScore === oppScore) {
    result = `🤝 مساوی ${yourScore} - ${oppScore} مقابل ${opponent}`;
    data.points += 1;
  } else {
    result = `😢 باخت ${yourScore} - ${oppScore} مقابل ${opponent}`;
  }

  // صعود ساده
  if (data.points >= 12 && currentLeagueIndex < leagues.length - 1) {
    currentLeagueIndex++;
    data.league = leagues[currentLeagueIndex];
    result += `\n\n🚀 صعود به ${data.league}!`;
  }

  ctx.editMessageText(result, {
    reply_markup: Markup.inlineKeyboard([[Markup.button.callback('بازگشت به منو', 'back')]]).reply_markup
  });
});

bot.action('squad', (ctx) => {
  ctx.editMessageText(`👥 **ترکیب تیم ${teamName}**\n\nدروازه‌بان: علی رستمی\nمدافعان: حسینی، رضایی، احمدی\nهافبک: کریمی، محمدی\nمهاجمان: قایدی، ترابی`,
    { reply_markup: Markup.inlineKeyboard([[Markup.button.callback('بازگشت به منو', 'back')]]).reply_markup }
  );
});

bot.action('league_table', (ctx) => {
  const data = userData[ctx.from.id];
  ctx.editMessageText(`📊 **جدول لیگ ${data.league}**\n\n1. ${teamName} - ${data.points} امتیاز\n2. پرسپولیس - ۲۲\n3. استقلال - ۱۹`,
    { reply_markup: Markup.inlineKeyboard([[Markup.button.callback('بازگشت به منو', 'back')]]).reply_markup }
  );
});

bot.action('training', (ctx) => {
  const userId = ctx.from.id;
  userData[userId].budget += 50000000;
  ctx.editMessageText(`🏋️ تمرین انجام شد!\n\n۵۰ میلیون تومان به بودجه اضافه شد.`,
    { reply_markup: Markup.inlineKeyboard([[Markup.button.callback('بازگشت به منو', 'back')]]).reply_markup }
  );
});

bot.action('info', (ctx) => {
  const data = userData[ctx.from.id];
  ctx.editMessageText(`ℹ️ **اطلاعات باشگاه**\n\nنام: ${data.team}\nلیگ: ${data.league}\nبودجه: ${data.budget.toLocaleString('fa-IR')} تومان\nامتیاز: ${data.points}`,
    { reply_markup: Markup.inlineKeyboard([[Markup.button.callback('بازگشت به منو', 'back')]]).reply_markup }
  );
});

bot.action('back', (ctx) => mainMenu(ctx, ctx.from.id));

bot.launch().then(() => console.log('ربات ساده آماده تست ⚽'));

process.once('SIGINT', () => bot.stop('SIGINT'));
process.once('SIGTERM', () => bot.stop('SIGTERM'));