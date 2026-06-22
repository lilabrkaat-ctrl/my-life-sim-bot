const { starterHeroes, recruitableHeroes, enemies } = require("./config");
const { battleResult, buyHero } = require("./game");

const users = {};

function setupHandlers(bot) {

    // ======== /start ========
    bot.command("start", async (ctx) => {
        const userId = ctx.from.id;

        if (users[userId] && users[userId].step === "ready") {
            return ctx.reply(`👑 به امپراتوری ${users[userId].kingdomName} خوش برگشتی!\n/help برای راهنما`);
        }

        users[userId] = {
            step: "choose_hero",
            kingdomName: null,
            hero: null,
            coins: 100,
            territories: 1,
            level: 1,
            heroes: []
        };

        const keyboard = {
            reply_markup: {
                inline_keyboard: starterHeroes.map((hero, index) => [
                    { text: `${hero.emoji} ${hero.name} (⚔️${hero.power} ❤️${hero.hp})`, callback_data: `pick_${index}` }
                ])
            }
        };

        await ctx.reply(
            "🏰 *به امپراتوری مارول خوش آمدی!*\n\nیک قهرمان برای شروع انتخاب کن:",
            { parse_mode: "Markdown", ...keyboard }
        );
    });

    // ======== انتخاب قهرمان ========
    bot.callbackQuery(/^pick_(\d+)$/, async (ctx) => {
        const userId = ctx.from.id;
        const user = users[userId];

        if (!user || user.step !== "choose_hero") {
            return ctx.answerCallbackQuery("⛔ این انتخاب برای تو نیست!");
        }

        const index = parseInt(ctx.match[1]);
        const selectedHero = starterHeroes[index];

        user.hero = selectedHero;
        user.heroes.push(selectedHero);
        user.kingdomName = `${selectedHero.name}'s Empire`;
        user.step = "ready";

        await ctx.editMessageText(
            `🎉 *انتخاب نهایی شد!*\n\n` +
            `👑 ${user.kingdomName}\n` +
            `🦸 قهرمان: ${selectedHero.emoji} ${selectedHero.name}\n` +
            `⚔️ قدرت: ${selectedHero.power} | ❤️ جان: ${selectedHero.hp}\n` +
            `💰 سکه: ${user.coins}\n\n` +
            `/kingdom | /battle | /recruit | /help`,
            { parse_mode: "Markdown" }
        );

        await ctx.answerCallbackQuery("✅ موفق!");
    });

    // ======== /kingdom ========
    bot.command("kingdom", async (ctx) => {
        const user = users[ctx.from.id];
        if (!user || user.step !== "ready") return ctx.reply("⛔ اول /start رو بزن!");

        const heroesList = user.heroes.map(h => `${h.emoji} ${h.name}`).join("\n");

        await ctx.reply(
            `🏰 *${user.kingdomName}*\n` +
            `⭐ سطح: ${user.level} | 🗺️ قلمرو: ${user.territories}\n` +
            `💰 سکه: ${user.coins}\n\n` +
            `⚔️ *قهرمانان:*\n${heroesList}`,
            { parse_mode: "Markdown" }
        );
    });

    // ======== /battle ========
    bot.command("battle", async (ctx) => {
        const user = users[ctx.from.id];
        if (!user || user.step !== "ready") return ctx.reply("⛔ اول /start رو بزن!");
        if (user.heroes.length === 0) return ctx.reply("⛔ قهرمانی نداری!");

        // انتخاب تصادفی دشمن و قهرمان
        const enemy = enemies[Math.floor(Math.random() * enemies.length)];
        const hero = user.heroes[Math.floor(Math.random() * user.heroes.length)];

        const result = battleResult(hero, enemy);

        if (result.win) {
            user.coins += result.reward;
            user.territories += 1;
        }

        let message = `⚔️ *نبرد!*\n${hero.emoji} ${hero.name} VS ${enemy.emoji} ${enemy.name}\n\n`;
        message += result.log.join("\n") + "\n\n";

        if (result.win) {
            message += `🎉 بردی! +${result.reward} سکه و +۱ قلمرو`;
        } else {
            message += `💔 شکست خوردی. دوباره تلاش کن!`;
        }

        await ctx.reply(message, { parse_mode: "Markdown" });
    });

    // ======== /recruit ========
    bot.command("recruit", async (ctx) => {
        const user = users[ctx.from.id];
        if (!user || user.step !== "ready") return ctx.reply("⛔ اول /start رو بزن!");

        const keyboard = {
            reply_markup: {
                inline_keyboard: recruitableHeroes.map((hero, index) => [
                    { text: `${hero.emoji} ${hero.name} | 💰${hero.price}`, callback_data: `buy_${index}` }
                ])
            }
        };

        await ctx.reply("🦸 *استخدام قهرمان جدید*\n\nانتخاب کن:", { parse_mode: "Markdown", ...keyboard });
    });

    // ======== خرید قهرمان ========
    bot.callbackQuery(/^buy_(\d+)$/, async (ctx) => {
        const user = users[ctx.from.id];
        if (!user || user.step !== "ready") return ctx.answerCallbackQuery("⛔ خطا!");

        const index = parseInt(ctx.match[1]);
        const hero = recruitableHeroes[index];

        if (buyHero(user, hero)) {
            await ctx.editMessageText(`✅ ${hero.emoji} ${hero.name} به امپراتوری پیوست!\n💰 سکه باقی‌مانده: ${user.coins}`);
            await ctx.answerCallbackQuery("✅ خرید موفق!");
        } else {
            await ctx.answerCallbackQuery("⛔ سکه کافی نداری!");
        }
    });

    // ======== /help ========
    bot.command("help", async (ctx) => {
        await ctx.reply(
            "📜 *راهنما*\n\n" +
            "/kingdom - 🏰 امپراتوری\n" +
            "/battle - ⚔️ نبرد\n" +
            "/recruit - 🦸 استخدام قهرمان",
            { parse_mode: "Markdown" }
        );
    });

}

module.exports = { setupHandlers };