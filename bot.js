const { Bot } = require("grammy");

// توکن رباتت را اینجا بگذار (از BotFather گرفتی)
const bot = new Bot("YOUR_BOT_TOKEN_HERE");

// ذخیره‌سازی موقت اطلاعات کاربران در حافظه
const users = {};

// لیست قهرمانان اولیه برای انتخاب
const starterHeroes = [
  { name: "Spider-Man", emoji: "🕷️", power: 80, hp: 100 },
  { name: "Iron Man", emoji: "🤖", power: 90, hp: 90 },
  { name: "Thor", emoji: "⚡", power: 85, hp: 95 }
];

// دستور /start
bot.command("start", async (ctx) => {
  const userId = ctx.from.id;
  
  // اگر کاربر قبلاً ثبت‌نام کرده
  if (users[userId]) {
    return ctx.reply(
      `👑 به امپراتوری‌ات خوش برگشتی، ${users[userId].kingdomName}!\n` +
      `برای دیدن دستورات از /help استفاده کن.`
    );
  }

  // ثبت‌نام کاربر جدید
  users[userId] = {
    step: "choose_hero",
    kingdomName: null,
    hero: null,
    coins: 100,
    territories: 1,
    level: 1,
    heroes: []
  };

  // ساخت کیبورد انتخاب قهرمان
  const keyboard = {
    reply_markup: {
      inline_keyboard: starterHeroes.map((hero, index) => [
        { text: `${hero.emoji} ${hero.name} (⚔️${hero.power} ❤️${hero.hp})`, callback_data: `pick_${index}` }
      ])
    }
  };

  await ctx.reply(
    "🏰 *به دنیای امپراتوری مارول خوش آمدی!*\n\n" +
    "ابتدا یک قهرمان برای شروع انتخاب کن:",
    { parse_mode: "Markdown", ...keyboard }
  );
});

// پردازش انتخاب قهرمان
bot.callbackQuery(/^pick_(\d+)$/, async (ctx) => {
  const userId = ctx.from.id;
  const user = users[userId];

  if (!user || user.step !== "choose_hero") {
    return ctx.answerCallbackQuery("⛔ این انتخاب برای تو نیست!");
  }

  const heroIndex = parseInt(ctx.match[1]);
  const selectedHero = starterHeroes[heroIndex];

  // ذخیره انتخاب کاربر
  user.hero = selectedHero;
  user.heroes.push(selectedHero);
  user.kingdomName = `${selectedHero.name}'s Empire`;
  user.step = "ready";

  await ctx.editMessageText(
    `🎉 *انتخاب نهایی شد!*\n\n` +
    `👑 امپراتوری: ${user.kingdomName}\n` +
    `🦸 قهرمان اصلی: ${selectedHero.emoji} ${selectedHero.name}\n` +
    `⚔️ قدرت: ${selectedHero.power}\n` +
    `❤️ جان: ${selectedHero.hp}\n` +
    `💰 سکه‌ها: ${user.coins}\n\n` +
    `برای دیدن دستورات: /help`,
    { parse_mode: "Markdown" }
  );

  await ctx.answerCallbackQuery("✅ انتخاب با موفقیت انجام شد!");
});

// دستور /kingdom - نمایش وضعیت امپراتوری
bot.command("kingdom", async (ctx) => {
  const userId = ctx.from.id;
  const user = users[userId];

  if (!user || user.step !== "ready") {
    return ctx.reply("⛔ اول با /start ثبت‌نام کن!");
  }

  const heroesList = user.heroes.map(h => `${h.emoji} ${h.name} (⚔️${h.power})`).join("\n");

  await ctx.reply(
    `🏰 *امپراتوری ${user.kingdomName}*\n\n` +
    `⭐ سطح: ${user.level}\n` +
    `🗺️ قلمروها: ${user.territories}\n` +
    `💰 سکه‌ها: ${user.coins}\n\n` +
    `⚔️ *قهرمانان:*\n${heroesList || "نداری!"}\n\n` +
    `دستورات بیشتر: /help`,
    { parse_mode: "Markdown" }
  );
});

// دستور /help
bot.command("help", async (ctx) => {
  await ctx.reply(
    "📜 *راهنمای بازی*\n\n" +
    "/kingdom - 🏰 مشاهده امپراتوری\n" +
    "/battle - ⚔️ نبرد (به زودی)\n" +
    "/recruit - 🦸 استخدام قهرمان (به زودی)\n" +
    "/conquer - 🗺️ فتح قلمرو (به زودی)",
    { parse_mode: "Markdown" }
  );
});

// راه‌اندازی ربات
bot.start();
console.log("🤖 Marvel Empire Bot is running...");