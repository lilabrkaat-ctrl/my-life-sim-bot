import os
import random
from telegram import Update, InlineKeyboardButton, InlineKeyboardMarkup
from telegram.ext import ApplicationBuilder, CommandHandler, CallbackQueryHandler, MessageHandler, filters, ContextTypes

TOKEN = os.environ.get("BOT_TOKEN", "TOKEN_DEFAULT")

CITIES = ["بندرعباس", "بندرلنگه", "قشم", "میناب", "جاسک", "خواجه", "رودان", "سیریک", "حاجی‌آباد", "تنب"]
LEAGUES = [
    {"name": "لیگ استان", "minStar": 2, "maxStar": 4, "minAbility": 1, "maxAbility": 3},
    {"name": "لیگ استانی", "minStar": 3, "maxStar": 5, "minAbility": 2, "maxAbility": 4},
    {"name": "لیگ دسته ۳", "minStar": 4, "maxStar": 6, "minAbility": 3, "maxAbility": 5},
    {"name": "لیگ دسته ۲", "minStar": 5, "maxStar": 7, "minAbility": 4, "maxAbility": 6},
    {"name": "لیگ دسته ۱", "minStar": 6, "maxStar": 8, "minAbility": 5, "maxAbility": 7},
    {"name": "لیگ برتر", "minStar": 7, "maxStar": 9, "minAbility": 6, "maxAbility": 8}
]
POSITIONS = ["🥅 دروازه‌بان", "🛡️ مدافع", "⚡ هافبک", "🎯 مهاجم"]
FIRST_NAMES = ["علی", "حسین", "محمد", "رضا", "امیر", "مهدی", "سعید", "فرهاد", "احسان", "امید"]
LAST_NAMES = ["محمدی", "احمدی", "رضایی", "حسینی", "کریمی", "موسوی", "جعفری", "نوروزی", "عباسی", "قاسمی"]
SPECIAL = {"name": "مهدی برکات", "pos": "🥅 دروازه‌بان", "talent": 9, "ability": 7, "city": "بندرلنگه"}

db = {}
waiting = {}

class State:
    def __init__(self, name, path):
        self.name = name
        self.path = path
        self.money = 500
        self.coins = 0
        self.fame = 10
        self.city = "هرمزگان"
        self.week = 1
        self.season = 1
        self.players = []
        self.temp = None

    def title(self):
        if self.path == "agent":
            if self.fame > 80: lvl = "جهانی"
            elif self.fame > 60: lvl = "آسیایی"
            elif self.fame > 40: lvl = "ملی"
            elif self.fame > 20: lvl = "منطقه‌ای"
            else: lvl = "محلی"
            return f"👤 {self.name} - ایجنت {lvl}"
        return f"⚽ {self.name} - باشگاه"

    def summary(self):
        return f"{self.title()}\n📍 {self.city} | ⭐ {self.fame}\n💰 {self.money}M\n📅 هفته {self.week} | 👥 {len(self.players)} بازیکن"

def menu():
    return InlineKeyboardMarkup([
        [InlineKeyboardButton("🔍 کشف", callback_data="scout"),
         InlineKeyboardButton("👥 بازیکنا", callback_data="players")],
        [InlineKeyboardButton("📊 آمار", callback_data="menu_main"),
         InlineKeyboardButton("⏭️ هفته", callback_data="next")]
    ])

# /start
async def start(update: Update, context: ContextTypes.DEFAULT_TYPE):
    uid = update.effective_user.id
    if uid in db:
        s = db[uid]
        await update.message.reply_text(s.summary(), reply_markup=menu())
        return
    kb = InlineKeyboardMarkup([
        [InlineKeyboardButton("👤 ایجنت", callback_data="go_agent"),
         InlineKeyboardButton("⚽ باشگاه", callback_data="go_club")]
    ])
    await update.message.reply_text("🎮 *بازی امپراتوری فوتبال*\n\nمسیرت رو انتخاب کن:", parse_mode="Markdown", reply_markup=kb)

# دکمه‌ها
async def button(update: Update, context: ContextTypes.DEFAULT_TYPE):
    q = update.callback_query
    await q.answer()
    d = q.data
    uid = update.effective_user.id

    if d in ("go_agent", "go_club"):
        waiting[uid] = "agent" if d == "go_agent" else "club"
        await q.edit_message_text(f"✍️ اسم {'ایجنت' if d == 'go_agent' else 'باشگاه'} رو تایپ کن:")
        return

    if uid not in db:
        await q.answer("❌ /start")
        return

    s = db[uid]
    r = ""

    if d == "menu_main":
        await q.edit_message_text(s.summary(), reply_markup=menu())
        return

    if d == "scout":
        kb = [[InlineKeyboardButton(l["name"], callback_data=f"sl_{i}")] for i, l in enumerate(LEAGUES)]
        kb.append([InlineKeyboardButton("🔙", callback_data="menu_main")])
        await q.edit_message_text(f"🔍 کدوم لیگ؟\n💰 ۵۰M | بودجه: {s.money}M", reply_markup=InlineKeyboardMarkup(kb))
        return

    if d.startswith("sl_"):
        li = int(d.split("_")[1])
        if s.money < 50:
            await q.answer("❌ پول کم!")
            return
        s.money -= 50
        L = LEAGUES[li]
        f = []
        for _ in range(3):
            if li == 0 and random.random() < 0.05:
                f.append({"name": SPECIAL["name"], "pos": SPECIAL["pos"], "talent": SPECIAL["talent"], "ability": SPECIAL["ability"], "age": 21, "city": SPECIAL["city"], "value": SPECIAL["talent"] * SPECIAL["ability"] * 15, "special": True, "contract": None})
            else:
                nm = random.choice(FIRST_NAMES) + " " + random.choice(LAST_NAMES)
                t = random.randint(L["minStar"], L["maxStar"])
                a = random.randint(L["minAbility"], L["maxAbility"])
                f.append({"name": nm, "pos": random.choice(POSITIONS), "talent": t, "ability": a, "age": random.randint(16, 26), "city": random.choice(CITIES), "value": t * a * 15, "special": False, "contract": None})
        s.temp = f
        tx = f"🔍 *{L['name']}*\n\n"
        for i, p in enumerate(f):
            star = "🌟" if p["special"] else ""
            tx += f"{i+1}. {star}⚽ {p['name']}\n   {p['pos']} | {p['age']} | ⭐{p['talent']} 💪{p['ability']} | 💰{p['value']}M\n\n"
        kb = [[InlineKeyboardButton(str(i+1), callback_data=f"pick_{i}")] for i in range(3)]
        kb.append([InlineKeyboardButton("🔍 دوباره", callback_data=f"sl_{li}"), InlineKeyboardButton("🔙", callback_data="scout")])
        await q.edit_message_text(tx, parse_mode="Markdown", reply_markup=InlineKeyboardMarkup(kb))
        return

    if d.startswith("pick_"):
        i = int(d.split("_")[1])
        if not s.temp or i >= len(s.temp):
            await q.answer("❌")
            return
        p = s.temp[i]
        s.players.append(p)
        s.temp = None
        r = f"✅ {p['name']} ⭐{p['talent']} 💪{p['ability']} 💰{p['value']}M"

    if d == "players":
        if not s.players:
            await q.edit_message_text("👥 خالی!", reply_markup=menu())
            return
        kb = [[InlineKeyboardButton(f"{p['name']} ⭐{p['talent']}", callback_data=f"pv_{i}")] for i, p in enumerate(s.players)]
        kb.append([InlineKeyboardButton("🔙", callback_data="menu_main")])
        await q.edit_message_text(f"👥 بازیکنات ({len(s.players)})", reply_markup=InlineKeyboardMarkup(kb))
        return

    if d.startswith("pv_"):
        i = int(d.split("_")[1])
        if i >= len(s.players):
            await q.answer("❌")
            return
        p = s.players[i]
        kb = [[InlineKeyboardButton("🏋️ ارتقا", callback_data=f"up_{i}"), InlineKeyboardButton("🤝 قرارداد", callback_data=f"ct_{i}"), InlineKeyboardButton("💰 فروش", callback_data=f"se_{i}")],
              [InlineKeyboardButton("🔙", callback_data="players")]]
        tx = f"⚽ {p['name']}\n{p['pos']} | {p['age']} | {p['city']}\n⭐{p['talent']} 💪{p['ability']} | 💰{p['value']}M"
        if p.get("contract"):
            tx += f"\n📋 {p['contract']['club']} | 💵{p['contract']['monthly']}M"
        await q.edit_message_text(tx, reply_markup=InlineKeyboardMarkup(kb))
        return

    if d.startswith("up_"):
        i = int(d.split("_")[1])
        kb = [[InlineKeyboardButton("⚡۵۰M", callback_data=f"tr_{i}_50"), InlineKeyboardButton("🎯۷۵M", callback_data=f"tr_{i}_75")],
              [InlineKeyboardButton("💪۱۵۰M", callback_data=f"tr_{i}_150"), InlineKeyboardButton("📚۳۰۰M", callback_data=f"tr_{i}_300")],
              [InlineKeyboardButton("🎯۵۰۰M", callback_data=f"tr_{i}_500"), InlineKeyboardButton("🔙", callback_data=f"pv_{i}")]]
        await q.edit_message_text(f"🏋️ {s.players[i]['name']}", reply_markup=InlineKeyboardMarkup(kb))
        return

    if d.startswith("tr_"):
        _, i, c = d.split("_")
        i, c = int(i), int(c)
        p = s.players[i]
        if s.money < c:
            await q.answer("❌ پول کم!")
            return
        s.money -= c
        if c == 150:
            p["ability"] = min(10, p["ability"] + 2)
            p["talent"] = min(10, p["talent"] + 1)
        elif c == 500:
            p["ability"] = min(10, p["ability"] + 3)
        elif c == 300:
            p["ability"] = min(10, p["ability"] + 2)
        else:
            p["ability"] = min(10, p["ability"] + 1)
        p["value"] = p["talent"] * p["ability"] * (30 if c == 500 else 15)
        r = f"✅ {p['name']} 💪{p['ability']} 💰{p['value']}M"

    if d.startswith("se_"):
        i = int(d.split("_")[1])
        p = s.players.pop(i)
        s.money += p["value"]
        s.fame += 5
        r = f"💰 {p['name']} +{p['value']}M"

    if d.startswith("ct_"):
        i = int(d.split("_")[1])
        p = s.players[i]
        if p.get("contract"):
            await q.answer("❌ قرارداد داره!")
            return
        mo = p["value"] // 10
        cl = random.choice(["فولاد", "تراکتور", "سپاهان", "پرسپولیس", "استقلال", "ملوان"])
        p["contract"] = {"monthly": mo, "remaining": 24, "club": cl}
        s.money += mo * 3
        r = f"🤝 {p['name']}\n🏠 {cl}\n💵 {mo}M/ماه"

    if d == "next":
        s.week += 1
        for p in s.players:
            if p.get("contract") and p["contract"]["remaining"] > 0:
                s.money += p["contract"]["monthly"]
                p["contract"]["remaining"] -= 1
                if p["contract"]["remaining"] == 0:
                    p["contract"] = None
        if s.week > 34:
            s.week = 1
            s.season += 1
        await q.edit_message_text(f"⏭️ هفته {s.week}\n\n{s.summary()}", reply_markup=menu())
        return

    if r:
        await q.edit_message_text(f"{r}\n\n{s.summary()}", reply_markup=menu())

# پیام اسم
async def message(update: Update, context: ContextTypes.DEFAULT_TYPE):
    uid = update.effective_user.id
    if uid in waiting:
        path = waiting.pop(uid)
        s = State(update.message.text, path)
        db[uid] = s
        await update.message.reply_text(f"🎉 ثبت شد!\n\n{s.summary()}", reply_markup=menu())

# راه‌اندازی
app = ApplicationBuilder().token(TOKEN).build()
app.add_handler(CommandHandler("start", start))
app.add_handler(CallbackQueryHandler(button))
app.add_handler(MessageHandler(filters.TEXT & ~filters.COMMAND, message))
app.run_polling()