const creatures = {
    skeleton: {
        day1: [
            { text: "💀 گوشت داری کثافت؟! گرسنمه!", options: [{ text: "🍖 بده", action: "gift" }, { text: "🗡️ بجنگ", action: "fight" }, { text: "💋 عشق", action: "seduce" }] },
            { text: "💀 من زنده نیستم... ولی تو رو می‌کشم!", options: [{ text: "🗡️ بجنگ", action: "fight" }, { text: "💋 نمی‌میرم", action: "seduce" }, { text: "🏃 فرار", action: "flee" }] }
        ],
        day2: [
            { text: "💀 دیشب خواب دیدم گوشت دارم", options: [{ text: "👂 جدی؟", action: "listen" }, { text: "💋 می‌خوای؟", action: "seduce" }, { text: "🏃 فرار", action: "flee" }] },
            { text: "💀 استخونام... وقتی نزدیکمی صدا می‌دن", options: [{ text: "🖐️ لمس کن", action: "ally" }, { text: "💋 صدا می‌دن", action: "kiss" }, { text: "🏃 فرار", action: "flee" }] }
        ],
        day3: [
            { text: "💀 قلب ندارم... ولی یه چیزی توی سینه‌م می‌تپه", options: [{ text: "💋 عشقه", action: "kiss" }, { text: "🤝 چیه؟", action: "listen" }, { text: "🔙 بعداً", action: "flee" }] },
            { text: "💀 شاید این دفعه نکشمت... شاید", options: [{ text: "🤝 ممنون", action: "ally" }, { text: "💋 دوستم داری", action: "seduce" }, { text: "🔙 بعداً", action: "flee" }] }
        ],
        day4: [
            { text: "💀 دستت رو بذار روی استخونام", options: [{ text: "🖐️ می‌ذارم", action: "ally" }, { text: "💋 نمی‌شکنن", action: "kiss" }, { text: "🔙 بعداً", action: "flee" }] },
            { text: "💀 وقتی تو هستی حس می‌کنم زنده‌ام", options: [{ text: "💋 زنده‌ای", action: "kiss" }, { text: "🔥 حس کن", action: "seduce" }, { text: "🔙 بعداً", action: "flee" }] }
        ],
        day5: [
            { text: "💀 عاشق یه زنده شدم!", options: [{ text: "💋 منم عاشقتم", action: "kiss" }, { text: "🔥 بیا", action: "seduce" }, { text: "🎁 هدیه", action: "gift" }] },
            { text: "💀 گوشت می‌خوام... ولی فقط تو رو", options: [{ text: "🔥 بخور", action: "seduce" }, { text: "💋 ببوس", action: "kiss" }, { text: "🔙 بعداً", action: "flee" }] }
        ],
        day6: [
            { text: "💀 هر شب برات می‌رقصم", options: [{ text: "🔥 از جلو", action: "seduce" }, { text: "🍑 از پشت", action: "seduce" }, { text: "👄 دهنی", action: "kiss" }] },
            { text: "💀 امروز می‌خوام زنده باشم", options: [{ text: "💋 زنده‌ای", action: "kiss" }, { text: "🔥 بکنم", action: "seduce" }, { text: "🔙 بعداً", action: "flee" }] }
        ],
        day7: [
            { text: "💀 تا ابد اسکلت عاشق تو", options: [{ text: "💋 تا ابد", action: "kiss" }, { text: "👰 ازدواج استخونی", action: "propose" }, { text: "🔥 بیا", action: "seduce" }] },
            { text: "💀 استخونام مال تو... همه چیزم", options: [{ text: "💋 مال منی", action: "kiss" }, { text: "🔥 بکنم", action: "seduce" }, { text: "👶 بچه‌دار شیم", action: "seduce" }] }
        ],
        harem: [
            { text: "💀 شوهرم... امروز یه استخون جدید پیدا کردم", options: [{ text: "🦴 جالبه", action: "ally" }, { text: "💋 بیا", action: "kiss" }, { text: "🔙 بعداً", action: "flee" }] }
        ]
    },
    bandit_female: {
        day1: [
            { text: "🦹‍♀️ پولتو بده جنده! یا می‌کنمت با خنجرم!", options: [{ text: "💰 بده", action: "trade" }, { text: "💋 عشق", action: "seduce" }, { text: "🗡️ حمله", action: "fight" }] },
            { text: "🦹‍♀️ من راهزنم! از هیچی نمی‌ترسم!", options: [{ text: "🗡️ بجنگ", action: "fight" }, { text: "💋 از من می‌ترسی", action: "seduce" }, { text: "🏃 فرار", action: "flee" }] }
        ],
        day2: [
            { text: "🦹‍♀️ هر روز میای... دلت می‌خوای منو ببینی؟", options: [{ text: "💋 می‌خوام", action: "seduce" }, { text: "💰 پول", action: "trade" }, { text: "🏃 فرار", action: "flee" }] },
            { text: "🦹‍♀️ من دزدم... ولی دلم رو نمی‌تونم بدزدم", options: [{ text: "💋 دزدیدم", action: "kiss" }, { text: "🤝 نمی‌خوام", action: "ally" }, { text: "🏃 فرار", action: "flee" }] }
        ],
        day3: [
            { text: "🦹‍♀️ شاید تو بتونی منو عوض کنی", options: [{ text: "🤝 عوض می‌کنم", action: "ally" }, { text: "💋 عوض شو", action: "seduce" }, { text: "🔙 بعداً", action: "flee" }] },
            { text: "🦹‍♀️ تو قلبم رو دزدیدی", options: [{ text: "💋 قلبم مال تو", action: "kiss" }, { text: "🤝 جبران کن", action: "ally" }, { text: "🔙 بعداً", action: "flee" }] }
        ],
        day4: [
            { text: "🦹‍♀️ اگه آزادم کنی دیگه دزدی نمی‌کنم", options: [{ text: "🔓 آزاد", action: "free" }, { text: "💋 فقط منو بدزد", action: "seduce" }, { text: "🔙 بعداً", action: "flee" }] },
            { text: "🦹‍♀️ من راهزنم... ولی برای تو تسلیمم", options: [{ text: "💋 تسلیم شو", action: "kiss" }, { text: "🔥 بکنم", action: "seduce" }, { text: "🔙 بعداً", action: "flee" }] }
        ],
        day5: [
            { text: "🦹‍♀️ تمام گنج‌هایی که دزدیدم", options: [{ text: "💋 عاشقمی", action: "kiss" }, { text: "💰 گنجات کو", action: "trade" }, { text: "🎁 هدیه", action: "gift" }] },
            { text: "🦹‍♀️ بیا... این دفعه منو تو بدزد", options: [{ text: "🔥 می‌دزدم", action: "seduce" }, { text: "💋 اول ببوس", action: "kiss" }, { text: "🔙 بعداً", action: "flee" }] }
        ],
        day6: [
            { text: "🦹‍♀️ من دیگه دزد نیستم", options: [{ text: "🔥 از جلو", action: "seduce" }, { text: "🍑 از پشت", action: "seduce" }, { text: "👄 دهنی", action: "kiss" }] },
            { text: "🦹‍♀️ بهترین گنج تویی", options: [{ text: "💋 بهترینی", action: "kiss" }, { text: "🔥 بکنم", action: "seduce" }, { text: "🔙 بعداً", action: "flee" }] }
        ],
        day7: [
            { text: "🦹‍♀️ مال تو شدم... برای همیشه", options: [{ text: "💋 مال منی", action: "kiss" }, { text: "👰 ازدواج", action: "propose" }, { text: "🔥 بیا", action: "seduce" }] },
            { text: "🦹‍♀️ فقط عشق تو رو می‌دزدم", options: [{ text: "💋 بدزد", action: "kiss" }, { text: "🔥 بکنم", action: "seduce" }, { text: "👶 بچه‌دار شیم", action: "seduce" }] }
        ],
        harem: [
            { text: "🦹‍♀️ شوهرم... برات یه چیز دزدیدم", options: [{ text: "💰 چیه؟", action: "gift" }, { text: "💋 ممنون", action: "kiss" }, { text: "🔙 بعداً", action: "flee" }] }
        ]
    },
    ghost_sexy: {
        day1: [
            { text: "👻 من کیم؟ چرا اینجام؟", options: [{ text: "🕯️ کمک", action: "help" }, { text: "💋 لمس کن", action: "seduce" }, { text: "🏃 فرار", action: "flee" }] },
            { text: "👻 تو منو می‌بینی؟ یعنی زنده‌ای؟", options: [{ text: "👂 آره", action: "listen" }, { text: "💋 زنده‌ای", action: "seduce" }, { text: "🏃 فرار", action: "flee" }] }
        ],
        day2: [
            { text: "👻 دوباره اومدی... کسی رو دیدی شبیه من؟", options: [{ text: "👂 بگو", action: "listen" }, { text: "💋 تصاحب", action: "seduce" }, { text: "🏃 فرار", action: "flee" }] },
            { text: "👻 وقتی نزدیکمی یه حس عجیبی دارم", options: [{ text: "🖐️ لمس کن", action: "ally" }, { text: "💋 ببوس", action: "kiss" }, { text: "🏃 فرار", action: "flee" }] }
        ],
        day3: [
            { text: "👻 آره! من نگهبان گنج بودم!", options: [{ text: "💰 بگو", action: "treasure" }, { text: "💋 بوس", action: "kiss" }, { text: "🔙 بعداً", action: "flee" }] },
            { text: "👻 بذار دستت رو بگیرم", options: [{ text: "🖐️ بگیر", action: "ally" }, { text: "💋 ببوس", action: "kiss" }, { text: "🔙 بعداً", action: "flee" }] }
        ],
        day4: [
            { text: "👻 گنج که مال تو... حالا منو آزاد کن", options: [{ text: "🕊️ آزاد", action: "free" }, { text: "💋 پیشم بمون", action: "seduce" }, { text: "🔙 بعداً", action: "flee" }] },
            { text: "👻 دیشب خواب دیدم زنده‌ام", options: [{ text: "💋 منم همینطور", action: "kiss" }, { text: "🤝 دوست", action: "ally" }, { text: "🔙 بعداً", action: "flee" }] }
        ],
        day5: [
            { text: "👻 بذار بغلت کنم", options: [{ text: "💋 بغلم کن", action: "kiss" }, { text: "🔥 بیشتر", action: "seduce" }, { text: "🎁 هدیه", action: "gift" }] },
            { text: "👻 وقتی از توی بدنت رد میشم", options: [{ text: "🔥 رد شو", action: "seduce" }, { text: "💋 ببوس", action: "kiss" }, { text: "🔙 بعداً", action: "flee" }] }
        ],
        day6: [
            { text: "👻 می‌خوام تا ابد توی وجودت باشم", options: [{ text: "🔥 از جلو", action: "seduce" }, { text: "🍑 از پشت", action: "seduce" }, { text: "👄 دهنی", action: "kiss" }] },
            { text: "👻 حتی مرگ هم جدایمون نمی‌کنه", options: [{ text: "💋 ببوس", action: "kiss" }, { text: "👰 ازدواج روحی", action: "propose" }, { text: "🔙 بعداً", action: "flee" }] }
        ],
        day7: [
            { text: "👻 آزادم! هر وقت خواستی صدام کن", options: [{ text: "🎁 هدیه", action: "gift" }, { text: "💋 همدم", action: "seduce" }, { text: "🔥 بیا", action: "seduce" }] },
            { text: "👻 هر شب میام توی بغلت", options: [{ text: "🔥 بیا", action: "seduce" }, { text: "💋 منتظرم", action: "kiss" }, { text: "👶 روح بچه", action: "seduce" }] }
        ],
        harem: [
            { text: "👻 شوهرم... امشب توی خوابت میام", options: [{ text: "💭 بیا", action: "ally" }, { text: "💋 منتظرم", action: "kiss" }, { text: "🔥 زود بیا", action: "seduce" }] }
        ]
    }
};

module.exports = { creatures };