const { Telegraf, Markup } = require('telegraf');
const storage = require('node-persist');

const bot = new Telegraf(process.env.BOT_TOKEN);

let userData = {};

// بارگذاری ذخیره‌سازی
(async () => {
  await storage.init();
})();

const leagues = ["لیگ استانی بندرلنگه", "لیگ دسته دوم", "لیگ آزادگان", "لیگ برتر خلیج فارس"];
let currentLeagueIndex = 0;

const teamName = "بندرلنگه FC";

bot.start(async (ctx) => {
  const userId = ctx.from.id;
  userData[userId] = userData[userId] || {
    team: teamName,
    league: leagues[0],
    points: 0,
    budget: 500000000, // ۵۰۰ میلیون تومان
    wins: 0,
    level: 1
  };
  await saveData(userId);
  mainMenu(ctx);
});

function mainMenu(ctx) {
  const userId = ctx.from.id;
  const data = userData[userId];

  ctx.reply(`🏟️ **مدیر باشگاه ${data.team}**  
📍 لیگ: ${data.league}
💰 بودجه: ${data.budget.toLocaleString('fa-IR')} تومان
🏆 امتیاز: ${data.points}
⚽ برد: ${data.wins}`, 
    Markup.inlineKeyboard([
      [Markup.button.callback('🎮 بازی بعدی', 'play_match')],
      [Markup.button.callback('👥 ترکیب تیم', 'squad')],
      [Markup.button.callback('📊 جدول لیگ', 'league_table')],
      [Markup.button.callback('🏋️ تمرین', 'training')],
      [Markup.button.callback('ℹ️ اطلاعات باشگاه', 'info')]
    ])
  );
}

bot.action('play_match', async (ctx) => {
  const userId = ctx.from.id;
  const data = userData[userId];

  const opponent = ["ملوان بندرعباس", "فجر سپاسی", "داماش گیلان", "استقلال", "پرسپولیس"][Math.floor(Math.random()*5)];
  const yourScore = Math.floor(Math.random() * 4);
  const oppScore = Math.floor(Math.random() * 4);

  let resultText = '';
  if (yourScore > oppScore) {
    resultText = `🎉 **برد!** ${yourScore} - ${oppScore} مقابل ${opponent}`;
    data.points += 3;
    data.wins++;
  } else if (yourScore === oppScore) {
    resultText = `🤝 مساوی ${yourScore} - ${oppScore} مقابل ${opponent}`;
    data.points += 1;
  } else {
    resultText = `😢 باخت ${yourScore} - ${oppScore} مقابل ${opponent}`;
  }

  // شانس صعود
  if (data.points > 20 && currentLeagueIndex < leagues.length - 1) {
    currentLeagueIndex++;
    data.league = leagues[currentLeagueIndex];
    resultText += `\n\n🚀 **تبریک! صعود کردی به ${data.league}**`;
  }

  await saveData(userId);
  ctx.editMessageText(resultText, Markup.inlineKeyboard([[Markup.button.callback('بازگشت به منو', 'back')]]));
});

bot.action('squad', (ctx) => {
  ctx.editMessageText(`👥 **ترکیب تیم ${teamName}**\n\n` +
    `⚽ دروازه‌بان: علی رستمی\n` +
    `🛡️ مدافعان: حسینی، رضایی، احمدی\n` +
    `⚖️ هافبک‌ها: کریمی، محمدی\n` +
    `🥇 مهاجمان: قایدی، ترابی\n\n` +
    `بعداً می‌تونیم سیستم خرید بازیکن اضافه کنیم.`,
    Markup.inlineKeyboard([[Markup.button.callback('بازگشت به منو', 'back')]])
  );
});

bot.action('league_table', (ctx) => {
  ctx.editMessageText(`📊 **جدول لیگ ${leagues[currentLeagueIndex]}**\n\n1. ${teamName} - ${userData[ctx.from.id].points} امتیاز\n2. پرسپولیس - 22\n3. استقلال - 19\n...\n\n(جدول کامل بعداً اضافه می‌شه)`,
    Markup.inlineKeyboard([[Markup.button.callback('بازگشت به منو', 'back')]])
  );
});

bot.action('training', async (ctx) => {
  const userId = ctx.from.id;
  userData[userId].budget += 50000000;
  await saveData(userId);
  ctx.editMessageText(`🏋️ **تمرین انجام شد!**\n\nبودجه‌ات ۵۰ میلیون افزایش یافت.`, 
    Markup.inlineKeyboard([[Markup.button.callback('بازگشت به منو', 'back')]])
  );
});

bot.action('info', (ctx) => {
  const data = userData[ctx.from.id];
  ctx.editMessageText(`ℹ️ **اطلاعات باشگاه**\n\nنام: ${data.team}\nلیگ: ${data.league}\nبودجه: ${data.budget.toLocaleString('fa-IR')} تومان\nامتیاز فصل: ${data.points}`, 
    Markup.inlineKeyboard([[Markup.button.callback('بازگشت به منو', 'back')]])
  );
});

bot.action('back', (ctx) => mainMenu(ctx));

async function saveData(userId) {
  await storage.setItem(`user_${userId}`, userData[userId]);
}

// راه‌اندازی
bot.launch().then(() => console.log('ربات مدیر باشگاه فوتبال راه‌اندازی شد ⚽'));

process.once('SIGINT', () => bot.stop('SIGINT'));
process.once('SIGTERM', () => bot.stop('SIGTERM'));