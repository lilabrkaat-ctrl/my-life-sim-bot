const { InlineKeyboard } = require("grammy");
const { db } = require("../state");
const { menu } = require("./menu");

async function startHandler(ctx) {
    const uid = ctx.from.id;
    if (db.has(uid)) return ctx.reply(db.get(uid).sum(), { reply_markup: menu() });
    const kb = new InlineKeyboard().text("👤 ایجنت", "go_agent").text("⚽ باشگاه", "go_club").row();
    await ctx.reply("🎮 مسیرت رو انتخاب کن:", { reply_markup: kb });
}

module.exports = { startHandler };