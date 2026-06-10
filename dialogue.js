const config = require('./config');

// ============ دیالوگ‌های ۷ روزه وحشی و سکسی ============
const dialogues = {
    witch: {
        day1: [
            { text: "🧙‍♀️ گمشو بیرون کصکش! قبل اینکه طلسمت کنم و کیرت رو بترکونم! 🔥", options: [{ text: "🗡️ حمله", action: "fight" }, { text: "💋 شیفته شو", action: "seduce" }, { text: "🏃 فرار", action: "flee" }] },
            { text: "🧙‍♀️ بوی کص و کون میاد... آدمیزاده یا حیوون؟!", options: [{ text: "🤝 آدمم", action: "ally" }, { text: "💋 شیفته‌ات شدم", action: "seduce" }, { text: "🏃 فرار", action: "flee" }] }
        ],
        day2: [
            { text: "🧙‍♀️ دوباره تو؟! می‌خوای بمیری کونی؟!", options: [{ text: "🎁 هدیه دارم", action: "gift" }, { text: "💋 دلم برات تنگ شده", action: "seduce" }, { text: "🏃 فرار", action: "flee" }] },
            { text: "🧙‍♀️ دیشب توی خواب گاییدی منو... هنوز کمرم درد می‌کنه 😈", options: [{ text: "👂 جدی؟", action: "listen" }, { text: "💋 بازم می‌خوای؟", action: "seduce" }, { text: "🏃 فرار", action: "flee" }] }
        ],
        day3: [
            { text: "🧙‍♀️ بیا نزدیک... بذار بوته کثافت بدنت رو حس کنم...", options: [{ text: "🖐️ نزدیک شو", action: "ally" }, { text: "🎁 هدیه دارم", action: "gift" }, { text: "🔙 بعداً", action: "flee" }] },
            { text: "🧙‍♀️ دستام میلرزه... می‌خوام بکنی منو...", options: [{ text: "💋 حاضرم", action: "seduce" }, { text: "🤝 اول دوست شیم", action: "ally" }, { text: "🔙 نه", action: "flee" }] }
        ],
        day4: [
            { text: "🧙‍♀️ دیگه نمی‌تونم جلوی خودمو بگیرم... بکن منو 💋", options: [{ text: "💋 ببوس", action: "kiss" }, { text: "🔥 بکنم", action: "seduce" }, { text: "🔙 بعداً", action: "flee" }] },
            { text: "🧙‍♀️ معجون عشق رو با هم بخوریم... بعدش هرکاری می‌خوای بکن 🧪🔥", options: [{ text: "🧪 بخوریم", action: "potion" }, { text: "💋 اول ببوس", action: "kiss" }, { text: "🔙 هیچکدوم", action: "flee" }] }
        ],
        day5: [
            { text: "🧙‍♀️ فقط تو می‌تونی منو آروم کنی... با کیرت... 🫣", options: [{ text: "💋 در آغوش بگیر", action: "kiss" }, { text: "🔥 بکنم", action: "seduce" }, { text: "🎁 هدیه", action: "gift" }] },
            { text: "🧙‍♀️ می‌خوام تا ابد کیرت رو بخورم... 💍", options: [{ text: "👰 ازدواج کن", action: "propose" }, { text: "💋 اول ببوس", action: "kiss" }, { text: "🔙 بعداً", action: "flee" }] }
        ],
        day6: [
            { text: "🧙‍♀️ ارباب من... امروز چجور می‌خوای بکنی منو؟ 😈", options: [{ text: "🔥 از جلو (بارداری)", action: "seduce" }, { text: "🍑 از پشت (لذت)", action: "seduce" }, { text: "👄 دهنی", action: "kiss" }] },
            { text: "🧙‍♀️ برات یه معجون سکسی درست کردم... بکن منو با این؟ 🧪🔥", options: [{ text: "🧪 بکنم", action: "potion" }, { text: "💋 اول ببوس", action: "kiss" }, { text: "🔙 بعداً", action: "flee" }] }
        ],
        day7: [
            { text: "🧙‍♀️ تا آخر عمر حاضر نیستم از کیرت جدا شم... 💍🔥", options: [{ text: "💋 ببوس", action: "kiss" }, { text: "🔥 بکنم وحشی", action: "seduce" }, { text: "👶 بچه‌دار شیم", action: "seduce" }] },
            { text: "🧙‍♀️ امروز می‌خوام ۷ بار بکنی منو... آماده‌ای؟ 😈", options: [{ text: "🔥 آماده‌ام", action: "seduce" }, { text: "💋 اول آروم", action: "kiss" }, { text: "🔙 امروز نه", action: "flee" }] }
        ]
    },
    ghost_sexy: {
        day1: [
            { text: "👻 من... من کیم؟ چرا اینجام؟", options: [{ text: "🕯️ کمک", action: "help" }, { text: "🏃 فرار", action: "flee" }] },
            { text: "👻 تو منو می‌بینی؟ یعنی زنده‌ای؟", options: [{ text: "👂 آره", action: "listen" }, { text: "💋 لمس کن", action: "seduce" }] }
        ],
        day2: [
            { text: "👻 دوباره اومدی... کسی رو دیدی شبیه من؟", options: [{ text: "👂 بگو", action: "listen" }, { text: "💋 تصاحب", action: "seduce" }] },
            { text: "👻 وقتی نزدیکمی... یه حس عجیبی دارم...", options: [{ text: "🖐️ لمس کن", action: "ally" }, { text: "💋 ببوس", action: "kiss" }] }
        ],
        day3: [
            { text: "👻 آره! من نگهبان گنج بودم! می‌خوای بگم کجاست؟", options: [{ text: "💰 بگو", action: "treasure" }, { text: "💋 بوس", action: "kiss" }] },
            { text: "👻 بذار دستت رو بگیرم... قول می‌دم سردم نکنه...", options: [{ text: "🖐️ بگیر", action: "ally" }, { text: "💋 ببوس", action: "kiss" }] }
        ],
        day4: [
            { text: "👻 گنج که مال تو... حالا منو آزاد کن!", options: [{ text: "🕊️ آزاد", action: "free" }, { text: "💋 پیشم بمون", action: "seduce" }] },
            { text: "👻 دیشب خواب دیدم زنده‌ام... و تو کنارمی... 💭", options: [{ text: "💋 منم همینطور", action: "kiss" }, { text: "🤝 دوست", action: "ally" }] }
        ],
        day5: [
            { text: "👻 بذار بغلت کنم... برای اولین بار بعد مرگم... 🫂💋", options: [{ text: "💋 بغلم کن", action: "kiss" }, { text: "🔥 بیشتر", action: "seduce" }] },
            { text: "👻 وقتی از توی بدنت رد میشم... حس می‌کنم زنده‌ام... 🫣", options: [{ text: "🔥 رد شو", action: "seduce" }, { text: "💋 ببوس", action: "kiss" }] }
        ],
        day6: [
            { text: "👻 می‌خوام تا ابد توی وجودت باشم...", options: [{ text: "🔥 از جلو", action: "seduce" }, { text: "🍑 از پشت", action: "seduce" }, { text: "👄 دهنی", action: "kiss" }] },
            { text: "👻 حتی مرگ هم جدایمون نمی‌کنه... 🫣💋", options: [{ text: "💋 ببوس", action: "kiss" }, { text: "👰 ازدواج روحی", action: "propose" }] }
        ],
        day7: [
            { text: "👻 آزادم! هر وقت خواستی صدام کن...", options: [{ text: "🎁 هدیه", action: "gift" }, { text: "💋 همدم", action: "seduce" }] },
            { text: "👻 هر شب میام توی بغلت... تا صبح می‌مونم... 💭🔥", options: [{ text: "🔥 بیا", action: "seduce" }, { text: "💋 منتظرم", action: "kiss" }] }
        ]
    },
    fairy: {
        day1: [
            { text: "🧚 سلام خوشتیپ! ۳ تا آرزو داری...", options: [{ text: "💎 ثروت", action: "wealth" }, { text: "⚔️ قدرت", action: "power" }, { text: "💋 عشق", action: "seduce" }] },
            { text: "🧚 هی قهرمان! پری‌ها چقدر شیطونن؟ 😜", options: [{ text: "💋 خیلی", action: "seduce" }, { text: "🤝 نمی‌دونم", action: "ally" }] }
        ],
        day2: [
            { text: "🧚 آرزوی دومت چیه؟", options: [{ text: "💎 بیشتر", action: "wealth" }, { text: "❤️ سلامتی", action: "heal" }] },
            { text: "🧚 دیشب توی گوشت آرزو خوندم...", options: [{ text: "👂 چی گفتی؟", action: "listen" }, { text: "💋 عاشقمی؟", action: "seduce" }] }
        ],
        day3: [
            { text: "🧚 آرزوی سوم رو من انتخاب می‌کنم: عشق! 😜", options: [{ text: "💋 قبول", action: "seduce" }, { text: "🗡️ رد", action: "fight" }] },
            { text: "🧚 آرزوی اول: ثروت، دوم: قدرت، سوم: من! 😜💋", options: [{ text: "💋 سومی", action: "seduce" }, { text: "💰 اولی", action: "wealth" }] }
        ],
        day4: [
            { text: "🧚 گرد جادویی دارم... هرچی بخوای میشه...", options: [{ text: "💋 عشق", action: "seduce" }, { text: "⚔️ قدرت", action: "power" }] },
            { text: "🧚 می‌دونی پری‌ها چجوری می‌بوسن؟ ✨💋", options: [{ text: "💋 نشون بده", action: "kiss" }, { text: "🤝 بگو", action: "listen" }] }
        ],
        day5: [
            { text: "🧚 ۳ تا آرزو بکن... سومی رو من می‌گم...", options: [{ text: "💋 بگو", action: "seduce" }, { text: "🔮 خودم می‌گم", action: "wish" }] },
            { text: "🧚 دیشب توی خوابم بودی... 🫣", options: [{ text: "💋 خوب خوابیدی؟", action: "kiss" }, { text: "🤝 چی شد؟", action: "listen" }] }
        ],
        day6: [
            { text: "🧚 پری‌ها عاشق نمیشن ولی من یه ذره شدم...", options: [{ text: "🔥 از جلو", action: "seduce" }, { text: "🍑 از پشت", action: "seduce" }, { text: "👄 دهنی", action: "kiss" }] },
            { text: "🧚 جادوی من مال تو... همه چیزم... 💋✨", options: [{ text: "💋 ببوس", action: "kiss" }, { text: "🔥 بکنم", action: "seduce" }] }
        ],
        day7: [
            { text: "🧚 باشه قبول... عاشق شدم... 💋😜", options: [{ text: "💋 منم عاشقتم", action: "kiss" }, { text: "👰 ازدواج", action: "propose" }] },
            { text: "🧚 هر آرزویی بکنی برآورده میشه... 🫣🔥", options: [{ text: "🔥 آرزوی عشق", action: "seduce" }, { text: "💰 آرزوی ثروت", action: "wealth" }] }
        ]
    },
    angel: {
        day1: [
            { text: "👼 نگران نباش مسافر... کمکت می‌کنم...", options: [{ text: "❤️ شفا", action: "heal" }, { text: "💋 ممنون", action: "seduce" }] },
            { text: "👼 من فرشته‌ام... نباید این حرفا رو بزنم...", options: [{ text: "👂 بگو", action: "listen" }, { text: "💋 بگو", action: "seduce" }] }
        ],
        day2: [
            { text: "👼 دوباره زخمی شدی؟ بیا شفا بدم...", options: [{ text: "❤️ شفا", action: "heal" }, { text: "💋 دوست دارم", action: "seduce" }] },
            { text: "👼 خدا ببخشه... وقتی نگام می‌کنی بال‌هام میلرزه...", options: [{ text: "💋 میلرزه؟", action: "kiss" }, { text: "🤝 چرا؟", action: "listen" }] }
        ],
        day3: [
            { text: "👼 من نباید عاشق بشم... ولی نمی‌تونم...", options: [{ text: "💋 عشق ممنوعه", action: "seduce" }, { text: "👼 برو آسمون", action: "free" }] },
            { text: "👼 این گناهه... ولی چرا اینقدر خوبه؟ 😳", options: [{ text: "💋 چون عشقه", action: "kiss" }, { text: "🤝 گناه نیست", action: "ally" }] }
        ],
        day4: [
            { text: "👼 دیشب دعا می‌کردم ولی فکرم پیش تو بود... 🙏", options: [{ text: "💋 منم پیش تو بودم", action: "kiss" }, { text: "🤝 چی شد؟", action: "listen" }] },
            { text: "👼 بذار بال‌هام رو لمس کنی...", options: [{ text: "🖐️ لمس کن", action: "ally" }, { text: "💋 ببوس", action: "kiss" }] }
        ],
        day5: [
            { text: "👼 حاضرم بسوزم فقط یه بار بغلت کنم... 🔥", options: [{ text: "💋 بغلم کن", action: "kiss" }, { text: "🤝 نمی‌خوام بسوزی", action: "ally" }] },
            { text: "👼 لب‌هام میلرزه... بوسیدن چه حسی داره؟", options: [{ text: "💋 امتحان کن", action: "kiss" }, { text: "🤝 خوبه", action: "listen" }] }
        ],
        day6: [
            { text: "👼 دیگه برام مهم نیست خدا چی می‌گه... 💋", options: [{ text: "🔥 از جلو", action: "seduce" }, { text: "🍑 از پشت", action: "seduce" }, { text: "👄 دهنی", action: "kiss" }] },
            { text: "👼 من سقوط کردم از آسمون برای تو... 👼💋", options: [{ text: "💋 ارزشش رو داشتی", action: "kiss" }, { text: "🔥 بکنم", action: "seduce" }] }
        ],
        day7: [
            { text: "👼 حالا یه فرشته گناه‌کارم... مال توام...", options: [{ text: "💋 مال منی", action: "kiss" }, { text: "🔥 بیا", action: "seduce" }] },
            { text: "👼 هر شب به جای دعا تو رو می‌بینم... 🫣💋", options: [{ text: "💋 منم همینطور", action: "kiss" }, { text: "👰 ازدواج آسمونی", action: "propose" }] }
        ]
    },
    knight: {
        day1: [
            { text: "⚔️ ای غریبه! شمشیرت رو بکش!", options: [{ text: "⚔️ می‌جنگم", action: "fight" }, { text: "🤝 دوست", action: "ally" }, { text: "🏃 فرار", action: "flee" }] },
            { text: "⚔️ فقط یه بار شکست خوردم اونم تو بودی!", options: [{ text: "⚔️ دوباره", action: "fight" }, { text: "💋 ببوس", action: "kiss" }] }
        ],
        day2: [
            { text: "⚔️ دفعه قبل خوب جنگیدی... بیا دوباره!", options: [{ text: "⚔️ بجنگ", action: "fight" }, { text: "💋 تصاحب", action: "seduce" }] },
            { text: "⚔️ چرا هر روز میای؟ می‌خوای تحقیرم کنی؟", options: [{ text: "🤝 نه", action: "ally" }, { text: "💋 می‌خوام ببینمت", action: "seduce" }] }
        ],
        day3: [
            { text: "⚔️ شب‌ها به جنگیدن با تو فکر می‌کنم...", options: [{ text: "⚔️ بجنگیم", action: "fight" }, { text: "💋 منم به تو", action: "kiss" }] },
            { text: "⚔️ زره‌ام رو درآوردم... سنگینه... 😳", options: [{ text: "🖐️ بذار ببینم", action: "ally" }, { text: "💋 خوشتیپی", action: "seduce" }] }
        ],
        day4: [
            { text: "⚔️ دستت قویه ولی ملایم...", options: [{ text: "🖐️ لمس کن", action: "ally" }, { text: "💋 ببوس", action: "kiss" }] },
            { text: "⚔️ می‌خوام یه نبرد دیگه... توی تخت... 😳", options: [{ text: "🔥 بیا", action: "seduce" }, { text: "💋 اول ببوس", action: "kiss" }] }
        ],
        day5: [
            { text: "⚔️ تسلیم شدم... همه چیزم مال تو...", options: [{ text: "💋 مال منی", action: "kiss" }, { text: "🔥 بکنم", action: "seduce" }] },
            { text: "⚔️ زره‌ام بازه... دیگه دفاعی ندارم... 🫣", options: [{ text: "🔥 از جلو", action: "seduce" }, { text: "🍑 از پشت", action: "seduce" }] }
        ],
        day6: [
            { text: "⚔️ فقط تو می‌تونی منو شکست بدی...", options: [{ text: "🔥 از جلو", action: "seduce" }, { text: "🍑 از پشت", action: "seduce" }, { text: "👄 دهنی", action: "kiss" }] },
            { text: "⚔️ من شوالیه‌ام نباید ضعیف باشم... 💋", options: [{ text: "💋 ضعیف نیستی", action: "kiss" }, { text: "🔥 قوی باش", action: "seduce" }] }
        ],
        day7: [
            { text: "⚔️ شوالیه تو شدم... تا ابد... ⚔️💋", options: [{ text: "💋 تا ابد", action: "kiss" }, { text: "👰 ازدواج", action: "propose" }] },
            { text: "⚔️ هر شب منتظرتم... بدون زره... 🔥", options: [{ text: "🔥 میام", action: "seduce" }, { text: "💋 منتظر باش", action: "kiss" }] }
        ]
    },
    vampire: {
        day1: [
            { text: "🧛‍♀️ گرسنمه فاحشه! خونتو می‌خورم!", options: [{ text: "🗡️ حمله", action: "fight" }, { text: "🩸 خون بده", action: "gift" }, { text: "💋 عشق", action: "seduce" }] },
            { text: "🧛‍♀️ ۳۰۰ ساله زندم... تو یه لقمه کوچیکی برام!", options: [{ text: "🗡️ بجنگ", action: "fight" }, { text: "💋 لقمه خوشمزه", action: "seduce" }] }
        ],
        day2: [
            { text: "🧛‍♀️ بازم اومدی؟! خونتو بو می‌کشم...", options: [{ text: "🩸 بخور", action: "gift" }, { text: "💋 بو کن", action: "seduce" }] },
            { text: "🧛‍♀️ دیشب یه انسان رو خشک کردم... تو بعدی هستی!", options: [{ text: "🗡️ نمی‌ذارم", action: "fight" }, { text: "💋 منو نمی‌کشی", action: "seduce" }] }
        ],
        day3: [
            { text: "🧛‍♀️ مچ دستت رو بده... بذار نبضت رو حس کنم...", options: [{ text: "🖐️ بده", action: "ally" }, { text: "💋 ببوس", action: "kiss" }] },
            { text: "🧛‍♀️ خون تو... معتادم کرده... می‌خوام بیشتر...", options: [{ text: "🩸 بخور", action: "gift" }, { text: "💋 منم معتادتم", action: "seduce" }] }
        ],
        day4: [
            { text: "🧛‍♀️ شاید نکشمت... شاید تبدیلت کنم به خون‌آشام...", options: [{ text: "🧛 تبدیل کن", action: "potion" }, { text: "💋 همدمم شو", action: "seduce" }] },
            { text: "🧛‍♀️ نمی‌خوام بکشمت... می‌خوام تا ابد زنده باشی...", options: [{ text: "💋 پیشم بمون", action: "kiss" }, { text: "🔥 بکنم", action: "seduce" }] }
        ],
        day5: [
            { text: "🧛‍♀️ ۳۰۰ ساله عاشق نشدم... تو اولین و آخرینی...", options: [{ text: "💋 منم عاشقتم", action: "kiss" }, { text: "🔥 بیا", action: "seduce" }] },
            { text: "🧛‍♀️ بیا... با هم جاودانه شیم... 🩸💋", options: [{ text: "🩸 جاودانه", action: "potion" }, { text: "💋 ببوس", action: "kiss" }] }
        ],
        day6: [
            { text: "🧛‍♀️ من خون‌آشام تو شدم... تا ابد... 💋", options: [{ text: "🔥 از جلو", action: "seduce" }, { text: "🍑 از پشت", action: "seduce" }, { text: "👄 دهنی", action: "kiss" }] },
            { text: "🧛‍♀️ هر شب میام سراغت... نه برای خون... برای بوسه‌های داغ... 🫣🔥", options: [{ text: "💋 بیا", action: "kiss" }, { text: "🔥 منتظرم", action: "seduce" }] }
        ],
        day7: [
            { text: "🧛‍♀️ اگه بمیری... خودم زنده‌ات می‌کنم... 💀💋", options: [{ text: "💋 نمی‌میرم", action: "kiss" }, { text: "👰 ازدواج خون‌آشامی", action: "propose" }] },
            { text: "🧛‍♀️ تا ابد مال تو... 🧛‍♀️💋", options: [{ text: "💋 مال منی", action: "kiss" }, { text: "🔥 بیا", action: "seduce" }] }
        ]
    },
    werewolf: {
        day1: [
            { text: "🐺 غرررر! عقب برو کثافت! گازت می‌گیرم!", options: [{ text: "🗡️ حمله", action: "fight" }, { text: "💋 آروم باش", action: "seduce" }, { text: "🏃 فرار", action: "flee" }] },
            { text: "🐺 ماه کامله... و من توی قفس...", options: [{ text: "🔓 آزادت کنم", action: "free" }, { text: "💋 می‌خوام کمکت کنم", action: "seduce" }] }
        ],
        day2: [
            { text: "🐺 چرا انقدر نزدیک میشی؟... شام امشبمی!", options: [{ text: "🍖 غذا دارم", action: "gift" }, { text: "💋 شام نیستم", action: "seduce" }] },
            { text: "🐺 دستت... گرمه... مثل خون تازه...", options: [{ text: "🖐️ لمس کن", action: "ally" }, { text: "💋 گرمه؟", action: "kiss" }] }
        ],
        day3: [
            { text: "🐺 وقتی میای... یه حسی بهم می‌گه... شکارت نکنم...", options: [{ text: "🤝 دوست", action: "ally" }, { text: "💋 حس خوبیه", action: "seduce" }] },
            { text: "🐺 هیچکس تا حالا اینقدر نزدیک نشده بود...", options: [{ text: "🖐️ نزدیک‌تر", action: "ally" }, { text: "💋 ببوس", action: "kiss" }] }
        ],
        day4: [
            { text: "🐺 دستاتو بذار رو صورتم... قبل اینکه تبدیل شی... 🫣", options: [{ text: "🖐️ می‌ذارم", action: "ally" }, { text: "💋 ببوس", action: "kiss" }] },
            { text: "🐺 می‌خوام تبدیلت کنم به گرگ... با هم شکار کنیم...", options: [{ text: "🐺 تبدیل کن", action: "potion" }, { text: "💋 با هم", action: "seduce" }] }
        ],
        day5: [
            { text: "🐺 نمی‌دونم چیه... ولی وقتی نیستی... زوزه می‌کشم... 🐺💔", options: [{ text: "💋 منم دلتنگ میشم", action: "kiss" }, { text: "🔥 بیا", action: "seduce" }] },
            { text: "🐺 دیشب ماه کامل بود... و من به جای شکار... به تو فکر می‌کردم... 🌕", options: [{ text: "💋 عاشقی", action: "kiss" }, { text: "🔥 بکنم", action: "seduce" }] }
        ],
        day6: [
            { text: "🐺 مال تو شدم... آلفای من... هر کاری بگی می‌کنم... 🐺💋", options: [{ text: "🔥 از جلو", action: "seduce" }, { text: "🍑 از پشت", action: "seduce" }, { text: "👄 دهنی", action: "kiss" }] },
            { text: "🐺 بیا نزدیک‌تر... بذار گرمای بدنت رو حس کنم... 🔥💋", options: [{ text: "🔥 حس کن", action: "seduce" }, { text: "💋 ببوس", action: "kiss" }] }
        ],
        day7: [
            { text: "🐺 فقط تو می‌تونی آرومم کنی... فقط تو... 🐺💋", options: [{ text: "💋 آروم باش", action: "kiss" }, { text: "👰 همدم همیشگی", action: "propose" }] },
            { text: "🐺 تا ابد گرگ تو می‌مونم... 🐺🔥", options: [{ text: "💋 تا ابد", action: "kiss" }, { text: "🔥 بیا", action: "seduce" }] }
        ]
    }
};
    bride: {
        day1: [
            { text: "👰 من بدشانس‌ترین عروس دنیام... همه بهم خیانت کردن... 💔", options: [{ text: "🤝 کمک", action: "help" }, { text: "💋 من خیانت نمی‌کنم", action: "seduce" }] },
            { text: "👰 از عروسی فرار کردم... نمی‌خوام با اون ازدواج کنم...", options: [{ text: "💍 با من ازدواج کن", action: "propose" }, { text: "🤝 کمک", action: "help" }] }
        ],
        day2: [
            { text: "👰 تو هم مثل بقیه‌ای؟... می‌خوای منو برگردونی؟", options: [{ text: "🤝 نه", action: "ally" }, { text: "💋 می‌خوام پیشم بمونی", action: "seduce" }] },
            { text: "👰 چرا اینقدر بهم توجه می‌کنی؟... من لیاقت ندارم...", options: [{ text: "💋 لیاقت داری", action: "kiss" }, { text: "🤝 داری", action: "ally" }] }
        ],
        day3: [
            { text: "👰 دیشب خواب دیدم... با یه غریبه ازدواج کردم... شاید تو بودی...", options: [{ text: "💋 من بودم", action: "kiss" }, { text: "💍 ازدواج", action: "propose" }] },
            { text: "👰 من از عشق فرار کردم... ولی انگار عشق دنبالمه...", options: [{ text: "💋 عشق منم", action: "seduce" }, { text: "🤝 آروم باش", action: "ally" }] }
        ],
        day4: [
            { text: "👰 دستت رو بده... ببینم حلقه داری؟ 💍", options: [{ text: "💍 دارم", action: "propose" }, { text: "🤝 ندارم", action: "ally" }] },
            { text: "👰 اگه تو داماد بودی... من فرار نمی‌کردم...", options: [{ text: "💋 نمی‌کردی", action: "kiss" }, { text: "💍 دامادم", action: "propose" }] }
        ],
        day5: [
            { text: "👰 من حاضرم دوباره عروسی کنم... با تو... 💋", options: [{ text: "💍 عروسی", action: "propose" }, { text: "💋 ببوس", action: "kiss" }] },
            { text: "👰 لباس عروسم هنوز تنمه... می‌خوای درش بیاری؟ 🫣", options: [{ text: "🔥 درمیارم", action: "seduce" }, { text: "💋 اول ببوس", action: "kiss" }] }
        ],
        day6: [
            { text: "👰 این دفعه... مطمئنم که فرار نمی‌کنم...", options: [{ text: "🔥 از جلو", action: "seduce" }, { text: "🍑 از پشت", action: "seduce" }, { text: "👄 دهنی", action: "kiss" }] },
            { text: "👰 من عروس تو شدم... برای همیشه... 👰💋", options: [{ text: "💋 برای همیشه", action: "kiss" }, { text: "🔥 شب اول", action: "seduce" }] }
        ],
        day7: [
            { text: "👰 هر شب با لباس عروسم منتظرتم... 🫣🔥", options: [{ text: "🔥 میام", action: "seduce" }, { text: "💋 منتظر باش", action: "kiss" }] },
            { text: "👰 بهترین تصمیم زندگیم... فرار نکردن از تو بود 💋", options: [{ text: "💋 بهترینی", action: "kiss" }, { text: "👶 بچه‌دار شیم", action: "seduce" }] }
        ]
    },
    mermaid: {
        day1: [
            { text: "🧜‍♀️ سلام مسافر... آواز منو شنیدی؟", options: [{ text: "🎵 گوش کن", action: "listen" }, { text: "💋 عشق", action: "seduce" }, { text: "🏃 برو", action: "flee" }] },
            { text: "🧜‍♀️ می‌تونی آرزوت رو بگی...", options: [{ text: "💋 عشق", action: "seduce" }, { text: "💰 ثروت", action: "wealth" }] }
        ],
        day2: [
            { text: "🧜‍♀️ دوباره اومدی... دلت برام تنگ شده؟", options: [{ text: "💋 تنگ شده", action: "kiss" }, { text: "🎵 آواز بخون", action: "listen" }] },
            { text: "🧜‍♀️ تو تنها انسانی که از من نمی‌ترسه...", options: [{ text: "💋 نمی‌ترسم", action: "seduce" }, { text: "🤝 دوستم", action: "ally" }] }
        ],
        day3: [
            { text: "🧜‍♀️ می‌خوای بیای زیر آب؟... جایی که هیچ‌کس نمی‌تونه ببینتمون... 🫣", options: [{ text: "🔥 بیا", action: "seduce" }, { text: "💋 اول ببوس", action: "kiss" }] },
            { text: "🧜‍♀️ آواز من جادو داره... می‌تونی عاشقم بشی...", options: [{ text: "💋 شدم", action: "kiss" }, { text: "🎵 بخون", action: "listen" }] }
        ],
        day4: [
            { text: "🧜‍♀️ پری‌های دریایی عاشق نمی‌شن... ولی من... 🫣", options: [{ text: "💋 عاشق شدی", action: "kiss" }, { text: "🤝 چی؟", action: "listen" }] },
            { text: "🧜‍♀️ دلم می‌خواد پا داشته باشم... تا بتونم کنارت راه برم...", options: [{ text: "💋 کنارمی", action: "kiss" }, { text: "🔮 آرزو کن", action: "wish" }] }
        ],
        day5: [
            { text: "🧜‍♀️ تو متفاوتی... مثل بقیه انسان‌ها نیستی...", options: [{ text: "💋 عاشقتم", action: "kiss" }, { text: "🔥 بکنم", action: "seduce" }] },
            { text: "🧜‍♀️ می‌خوام تا ابد با تو بمونم... توی دریا... 💋", options: [{ text: "💋 بمون", action: "kiss" }, { text: "👰 ازدواج دریایی", action: "propose" }] }
        ],
        day6: [
            { text: "🧜‍♀️ امروز می‌خوام مال تو باشم... کاملاً... 🫣", options: [{ text: "🔥 از جلو", action: "seduce" }, { text: "🍑 از پشت", action: "seduce" }, { text: "👄 دهنی", action: "kiss" }] },
            { text: "🧜‍♀️ هیچ‌کس نمی‌دونه زیر آب چه خبره... 😈", options: [{ text: "🔥 بکنم", action: "seduce" }, { text: "💋 ببوس", action: "kiss" }] }
        ],
        day7: [
            { text: "🧜‍♀️ تا ابد مال تو... توی دریا یا خشکی... 💋", options: [{ text: "💋 مال منی", action: "kiss" }, { text: "👶 بچه پری", action: "seduce" }] },
            { text: "🧜‍♀️ هر شب برات آواز می‌خونم... 🎵💋", options: [{ text: "🎵 بخون", action: "listen" }, { text: "💋 ببوس", action: "kiss" }] }
        ]
    },
    skeleton: {
        day1: [
            { text: "💀 گوشت داری کثافت؟! گرسنمه!", options: [{ text: "🍖 بده", action: "gift" }, { text: "🗡️ بجنگ", action: "fight" }, { text: "💋 عشق", action: "seduce" }] },
            { text: "💀 من زنده نیستم... ولی تو رو می‌کشم که بشی مثل خودم!", options: [{ text: "🗡️ بجنگ", action: "fight" }, { text: "💋 نمی‌میرم", action: "seduce" }] }
        ],
        day2: [
            { text: "💀 دیشب خواب دیدم گوشت دارم... گوشت تو رو... 🫣", options: [{ text: "👂 جدی؟", action: "listen" }, { text: "💋 می‌خوای؟", action: "seduce" }] },
            { text: "💀 استخونام... وقتی نزدیکمی... صدا می‌دن...", options: [{ text: "🖐️ لمس کن", action: "ally" }, { text: "💋 صدا می‌دن", action: "kiss" }] }
        ],
        day3: [
            { text: "💀 قلب ندارم... ولی یه چیزی توی سینه‌م می‌تپه...", options: [{ text: "💋 عشقه", action: "kiss" }, { text: "🤝 چیه؟", action: "listen" }] },
            { text: "💀 شاید... شاید این دفعه نکشمت... شاید...", options: [{ text: "🤝 ممنون", action: "ally" }, { text: "💋 دوستم داری", action: "seduce" }] }
        ],
        day4: [
            { text: "💀 دستت رو بذار روی استخونام... قبل اینکه بشکنن...", options: [{ text: "🖐️ می‌ذارم", action: "ally" }, { text: "💋 نمی‌شکنن", action: "kiss" }] },
            { text: "💀 من زنده نیستم... ولی وقتی تو هستی... حس می‌کنم زنده‌ام...", options: [{ text: "💋 زنده‌ای", action: "kiss" }, { text: "🔥 حس کن", action: "seduce" }] }
        ],
        day5: [
            { text: "💀 عاشق یه زنده شدم! کی فکرش رو می‌کرد؟! 💀💋", options: [{ text: "💋 منم عاشقتم", action: "kiss" }, { text: "🔥 بیا", action: "seduce" }] },
            { text: "💀 گوشت می‌خوام... ولی فقط گوشت تو رو... 🫣😂💋", options: [{ text: "🔥 بخور", action: "seduce" }, { text: "💋 ببوس", action: "kiss" }] }
        ],
        day6: [
            { text: "💀 هر شب برات می‌رقصم... استخونام به هم می‌خورن... 💃🦴", options: [{ text: "🔥 از جلو", action: "seduce" }, { text: "🍑 از پشت", action: "seduce" }, { text: "👄 دهنی", action: "kiss" }] },
            { text: "💀 امروز می‌خوام زنده باشم... واسه تو... 🫣", options: [{ text: "💋 زنده‌ای", action: "kiss" }, { text: "🔥 بکنم", action: "seduce" }] }
        ],
        day7: [
            { text: "💀 تا ابد اسکلت عاشق تو می‌مونم... 💀💋", options: [{ text: "💋 تا ابد", action: "kiss" }, { text: "👰 ازدواج استخونی", action: "propose" }] },
            { text: "💀 استخونام مال تو... گوشتم مال تو... همه چیزم... 💋", options: [{ text: "💋 مال منی", action: "kiss" }, { text: "🔥 بیا", action: "seduce" }] }
        ]
    },
    bandit_female: {
        day1: [
            { text: "🦹‍♀️ پولتو بده جنده! یا می‌کنمت با خنجرم!", options: [{ text: "💰 بده", action: "trade" }, { text: "💋 عشق", action: "seduce" }, { text: "🗡️ حمله", action: "fight" }] },
            { text: "🦹‍♀️ من راهزنم کثافت! از هیچی نمی‌ترسم!", options: [{ text: "🗡️ بجنگ", action: "fight" }, { text: "💋 از من می‌ترسی", action: "seduce" }] }
        ],
        day2: [
            { text: "🦹‍♀️ هر روز میای اینجا... دلت می‌خوای منو ببینی؟", options: [{ text: "💋 می‌خوام", action: "seduce" }, { text: "💰 پول می‌خوام", action: "trade" }] },
            { text: "🦹‍♀️ من دزدم... ولی دلم رو نمی‌تونم بدزدم...", options: [{ text: "💋 دزدیدم", action: "kiss" }, { text: "🤝 نمی‌خوام", action: "ally" }] }
        ],
        day3: [
            { text: "🦹‍♀️ شاید... شاید تو بتونی منو عوض کنی...", options: [{ text: "🤝 عوض می‌کنم", action: "ally" }, { text: "💋 عوض شو", action: "seduce" }] },
            { text: "🦹‍♀️ من تا حالا فقط پول می‌دزدیدم... ولی تو قلبم رو دزدیدی...", options: [{ text: "💋 قلبم مال تو", action: "kiss" }, { text: "🤝 جبران کن", action: "ally" }] }
        ],
        day4: [
            { text: "🦹‍♀️ اگه آزادم کنی... قول می‌دم دیگه دزدی نکنم...", options: [{ text: "🔓 آزاد", action: "free" }, { text: "💋 فقط منو بدزد", action: "seduce" }] },
            { text: "🦹‍♀️ من راهزنم... ولی برای تو... تسلیمم... 💋", options: [{ text: "💋 تسلیم شو", action: "kiss" }, { text: "🔥 بکنم", action: "seduce" }] }
        ],
        day5: [
            { text: "🦹‍♀️ تمام گنج‌هایی که دزدیدم... به پای تو نمی‌رسن...", options: [{ text: "💋 عاشقمی", action: "kiss" }, { text: "💰 گنجات کو", action: "trade" }] },
            { text: "🦹‍♀️ بیا... این دفعه منو تو بدزد... و هرکاری می‌خوای بکن 🫣", options: [{ text: "🔥 می‌دزدم", action: "seduce" }, { text: "💋 اول ببوس", action: "kiss" }] }
        ],
        day6: [
            { text: "🦹‍♀️ من دیگه دزد نیستم... عاشق تو شدم... 💋", options: [{ text: "🔥 از جلو", action: "seduce" }, { text: "🍑 از پشت", action: "seduce" }, { text: "👄 دهنی", action: "kiss" }] },
            { text: "🦹‍♀️ هر شب برات از گنجام می‌گم... ولی بهترین گنج تویی...", options: [{ text: "💋 بهترینی", action: "kiss" }, { text: "🔥 بکنم", action: "seduce" }] }
        ],
        day7: [
            { text: "🦹‍♀️ مال تو شدم... برای همیشه... 🦹‍♀️💋", options: [{ text: "💋 مال منی", action: "kiss" }, { text: "👰 ازدواج", action: "propose" }] },
            { text: "🦹‍♀️ دیگه دزدی نمی‌کنم... فقط عشق تو رو می‌دزدم 💋", options: [{ text: "💋 بدزد", action: "kiss" }, { text: "🔥 بیا", action: "seduce" }] }
        ]
    },
    singer: {
        day1: [
            { text: "👩‍🎤 می‌خوای برات آواز بخونم؟ آوازای من جادو داره...", options: [{ text: "🎵 بخون", action: "listen" }, { text: "💋 عشق", action: "seduce" }] },
            { text: "👩‍🎤 صدای من می‌تونه قلب تو رو تسخیر کنه...", options: [{ text: "🎵 تسخیر کن", action: "listen" }, { text: "💋 تسخیر شدم", action: "seduce" }] }
        ],
        day2: [
            { text: "👩‍🎤 دیشب برات یه آهنگ عاشقونه نوشتم...", options: [{ text: "🎵 بخون", action: "listen" }, { text: "💋 برام؟", action: "kiss" }] },
            { text: "👩‍🎤 وقتی می‌خونم... انگار همه دنیا مال منه...", options: [{ text: "🎵 بخون", action: "listen" }, { text: "💋 مال منی", action: "seduce" }] }
        ],
        day3: [
            { text: "👩‍🎤 می‌خوای باهات بیام توی خونه؟... برات خصوصی بخونم... 🫣", options: [{ text: "🏠 بیا", action: "ally" }, { text: "💋 خصوصی", action: "seduce" }] },
            { text: "👩‍🎤 آوازهای من می‌تونن عاشقت کنن...", options: [{ text: "💋 شدم", action: "kiss" }, { text: "🎵 بخون", action: "listen" }] }
        ],
        day4: [
            { text: "👩‍🎤 هیچ‌کس مثل تو آواز منو درک نکرده...", options: [{ text: "💋 درک می‌کنم", action: "kiss" }, { text: "🎵 ادامه بده", action: "listen" }] },
            { text: "👩‍🎤 دلم می‌خواد تا صبح برات بخونم...", options: [{ text: "🎵 بخون", action: "listen" }, { text: "💋 تا صبح", action: "seduce" }] }
        ],
        day5: [
            { text: "👩‍🎤 عاشقتم... می‌خوام اینو توی آوازم بگم... 🎵💋", options: [{ text: "💋 بگو", action: "kiss" }, { text: "🎵 بخون", action: "listen" }] },
            { text: "👩‍🎤 صدای من فقط برای توئه... فقط تو...", options: [{ text: "💋 برای من", action: "kiss" }, { text: "🔥 بیا", action: "seduce" }] }
        ],
        day6: [
            { text: "👩‍🎤 امروز می‌خوام برات یه آواز خاص بخونم... توی تخت... 🫣", options: [{ text: "🔥 از جلو", action: "seduce" }, { text: "🍑 از پشت", action: "seduce" }, { text: "👄 دهنی", action: "kiss" }] },
            { text: "👩‍🎤 موسیقی عشق... با ساز بدنمون... 🎵🔥", options: [{ text: "🔥 بزن", action: "seduce" }, { text: "💋 آروم", action: "kiss" }] }
        ],
        day7: [
            { text: "👩‍🎤 تا ابد برات می‌خونم... عشق من... 🎵💋", options: [{ text: "💋 تا ابد", action: "kiss" }, { text: "👰 ازدواج", action: "propose" }] },
            { text: "👩‍🎤 آواز آخر... آواز عشق ابدی... 🎵💍", options: [{ text: "🎵 بخون", action: "listen" }, { text: "💋 ببوس", action: "kiss" }] }
        ]
    },
    genie: {
        day1: [
            { text: "🧝‍♀️ آزادم کردی! ۳ تا آرزو می‌تونی بکنی...", options: [{ text: "💎 ثروت", action: "wealth" }, { text: "⚔️ قدرت", action: "power" }, { text: "💋 عشق", action: "seduce" }] },
            { text: "🧝‍♀️ من جن صحرام... هر آرزویی بکنی برآورده میشه...", options: [{ text: "💋 عشق", action: "seduce" }, { text: "💰 پول", action: "wealth" }] }
        ],
        day2: [
            { text: "🧝‍♀️ آرزوی دومت چیه؟", options: [{ text: "⚔️ قدرت", action: "power" }, { text: "💋 تو", action: "seduce" }] },
            { text: "🧝‍♀️ می‌دونی جن‌ها چقدر قدرتمندن؟", options: [{ text: "👂 بگو", action: "listen" }, { text: "💋 نشون بده", action: "seduce" }] }
        ],
        day3: [
            { text: "🧝‍♀️ آرزوی سوم... می‌تونم خودم انتخاب کنم؟ 😈", options: [{ text: "💋 انتخاب کن", action: "seduce" }, { text: "🤝 باشه", action: "ally" }] },
            { text: "🧝‍♀️ می‌تونم برات هر چیزی رو واقعی کنم... حتی عشق رو...", options: [{ text: "💋 عشق", action: "kiss" }, { text: "🔮 واقعی کن", action: "wish" }] }
        ],
        day4: [
            { text: "🧝‍♀️ تا حالا عاشق نشدم... ولی تو...", options: [{ text: "💋 عاشق شو", action: "kiss" }, { text: "🤝 چرا؟", action: "listen" }] },
            { text: "🧝‍♀️ می‌خوام تا ابد پیشت بمونم... نه به عنوان جن... به عنوان زن... 💋", options: [{ text: "💋 بمون", action: "kiss" }, { text: "🔥 زن من", action: "seduce" }] }
        ],
        day5: [
            { text: "🧝‍♀️ قدرتم رو فدای عشقت می‌کنم...", options: [{ text: "💋 نمی‌خوام", action: "kiss" }, { text: "🤝 فدا نکن", action: "ally" }] },
            { text: "🧝‍♀️ ۱۰۰۰ ساله زنده‌ام... ولی این ۳ روز با تو... بهترین عمرم بود 💋", options: [{ text: "💋 عاشقتم", action: "kiss" }, { text: "🔥 بیا", action: "seduce" }] }
        ],
        day6: [
            { text: "🧝‍♀️ امروز می‌خوام تمام جادوم رو برات استفاده کنم... 🫣", options: [{ text: "🔥 از جلو", action: "seduce" }, { text: "🍑 از پشت", action: "seduce" }, { text: "👄 دهنی", action: "kiss" }] },
            { text: "🧝‍♀️ جادوی عشق... قوی‌ترین جادوی دنیاست... 🔮💋", options: [{ text: "💋 جادو کن", action: "kiss" }, { text: "🔥 بکنم", action: "seduce" }] }
        ],
        day7: [
            { text: "🧝‍♀️ تا ابد مال تو... جن یا انسان... فرقی نمی‌کنه 💋", options: [{ text: "💋 مال منی", action: "kiss" }, { text: "👰 ازدواج", action: "propose" }] },
            { text: "🧝‍♀️ آخرین آرزوم... می‌خوام تا ابد عاشقت بمونم... 💍", options: [{ text: "💋 تا ابد", action: "kiss" }, { text: "👶 بچه جن", action: "seduce" }] }
        ]
    },
    young_witch: {
        day1: [
            { text: "🧙‍♀️ هنوز خیلی چیزا یاد نگرفتم... می‌خوای کمکت کنم؟", options: [{ text: "🔮 طلسم", action: "potion" }, { text: "💋 عشق", action: "seduce" }, { text: "🏃 برو", action: "flee" }] },
            { text: "🧙‍♀️ من شاگرد جادوگرم... ولی ازش بهترم!", options: [{ text: "👂 بگو", action: "listen" }, { text: "💋 نشون بده", action: "seduce" }] }
        ],
        day2: [
            { text: "🧙‍♀️ دیشب یه طلسم جدید یاد گرفتم... می‌خوای امتحانش کنم؟", options: [{ text: "🧪 امتحان کن", action: "potion" }, { text: "💋 روی من؟", action: "seduce" }] },
            { text: "🧙‍♀️ استادم می‌گه جادوگرا نباید عاشق بشن...", options: [{ text: "💋 عاشق شو", action: "seduce" }, { text: "🤝 چرا؟", action: "listen" }] }
        ],
        day3: [
            { text: "🧙‍♀️ می‌خوام طلسم عشق رو امتحان کنم... ولی می‌ترسم...", options: [{ text: "💋 نترس", action: "kiss" }, { text: "🧪 امتحان کن", action: "potion" }] },
            { text: "🧙‍♀️ تو می‌تونی اولین عشق من باشی...", options: [{ text: "💋 باشم", action: "kiss" }, { text: "🤝 افتخار", action: "ally" }] }
        ],
        day4: [
            { text: "🧙‍♀️ طلسم عشق جواب داد... الان دیوونه‌تم... 🫣", options: [{ text: "💋 دیوونه شو", action: "kiss" }, { text: "🔥 بکنم", action: "seduce" }] },
            { text: "🧙‍♀️ استادم اگه بفهمه عاشق شدم... چی میشه؟", options: [{ text: "🤝 نمی‌فهمه", action: "ally" }, { text: "💋 مهم نیست", action: "kiss" }] }
        ],
        day5: [
            { text: "🧙‍♀️ دیگه شاگرد نیستم... زن تو هستم... 💋", options: [{ text: "💋 زن من", action: "kiss" }, { text: "🔥 بیا", action: "seduce" }] },
            { text: "🧙‍♀️ برات یه معجون عشق درست کردم... می‌خوای بخوریم؟ 🧪💋", options: [{ text: "🧪 بخوریم", action: "potion" }, { text: "💋 اول ببوس", action: "kiss" }] }
        ],
        day6: [
            { text: "🧙‍♀️ امروز می‌خوام جادوی عشق رو کامل یادت بدم... 🫣", options: [{ text: "🔥 از جلو", action: "seduce" }, { text: "🍑 از پشت", action: "seduce" }, { text: "👄 دهنی", action: "kiss" }] },
            { text: "🧙‍♀️ جادوی بدن... قوی‌تر از جادوی کتاباست... 🔥", options: [{ text: "🔥 جادو کن", action: "seduce" }, { text: "💋 آروم", action: "kiss" }] }
        ],
        day7: [
            { text: "🧙‍♀️ تا ابد شاگرد عشق تو می‌مونم... 🧙‍♀️💋", options: [{ text: "💋 شاگردم", action: "kiss" }, { text: "👰 ازدواج", action: "propose" }] },
            { text: "🧙‍♀️ استاد عشق... تویی... 💍🔥", options: [{ text: "💋 استادت", action: "kiss" }, { text: "👶 بچه جادوگر", action: "seduce" }] }
        ]
    }
};

// ============ houseDialogues ============
const houseDialogues = {
    'invite_accept': ["🏠 با خوشحالی اومد خونه‌ات!", "🏠 بالاخره یه جای امن...", "🏠 خونه‌ات قشنگه..."],
    'invite_reject': ["😒 نه... شاید بعداً...", "😒 هنوز مطمئن نیستم...", "😒 نه! نمیام خونه‌ت!"],
    'kick_angry': ["😡 منو بیرون می‌کنی؟! حالا دشمنت میشم!", "💀 پشیمون میشی از این کارت...", "😤 باشه... ولی برمی‌گردم!"],
    'touch': ["🖐️ دستت گرمه... ادامه بده...", "🖐️ بیشتر لمس کن...", "🖐️ خوشم میاد..."],
    'kiss': ["💋 ммm... لبات...", "💋 دوباره ببوس...", "💋 معتاد بوسه‌ات شدم..."],
    'orgy': ["🔥 شب وحشی‌ای بود...", "🔥 دیگه نمی‌تونم...", "🔥 فوق‌العاده بود..."]
};

// ============ marryDialogues ============
const marryDialogues = {
    'propose_accept': "💍 آره! هزار بار آره! مال تو شدم!",
    'propose_reject': "💍 نه... هنوز آماده نیستم...",
    'marry_text': "👰 امروز بهترین روز زندگیمه... تا ابد مال تو...",
    'divorce_text': "💔 تموم شد... رفتیم..."
};

// ============ prisonDialogues ============
const prisonDialogues = {
    witch: {
        wild: ["🧙‍♀️: گمشو بیرون جنده پست فطرت!", "🧙‍♀️: نزدیک شی عصام رو فرو می‌کنم توی حلقومت!"],
        untrusted: ["🧙‍♀️: بازم اومدی جنده؟!", "🧙‍♀️: دیشب معجون مرگ درست کردم..."],
        familiar: ["🧙‍♀️: دستت رو بده ببینم...", "🧙‍♀️: شاید آزادت نکنم..."],
        intimate: ["🧙‍♀️: بیا نزدیک‌تر فاحشه...", "🧙‍♀️: دستام از شدت خشم میلرزه..."],
        tamed: ["🧙‍♀️: تو منو رام کردی... 💋", "🧙‍♀️: مال تو شدم... 💋"]
    }
};

// ============ npcConfig ============
const npcConfig = {
    witch: { image: 'witch', emoji: '🧙‍♀️', startPoints: 15 },
    ghost_sexy: { image: 'ghost_sexy', emoji: '👻', startPoints: 25 },
    fairy: { image: 'fairy', emoji: '🧚', startPoints: 20 },
    angel: { image: 'angel', emoji: '👼', startPoints: 20 },
    knight: { image: 'knight', emoji: '⚔️', startPoints: 10 },
    jester: { image: 'jester', emoji: '🎭', startPoints: 30 },
    prince: { image: 'prince', emoji: '🤴', startPoints: 15 },
    skeleton: { image: 'skeleton', emoji: '💀', startPoints: 30 },
    werewolf: { image: 'werewolf', emoji: '🐺', startPoints: 5 },
    wizard: { image: 'wizard', emoji: '🧙‍♂️', startPoints: 15 },
    sage: { image: 'sage', emoji: '🧙', startPoints: 40 },
    farmer: { image: 'farmer', emoji: '🧑‍🌾', startPoints: 35 },
    blacksmith: { image: 'blacksmith', emoji: '⚒️', startPoints: 30 },
    merchant: { image: 'merchant', emoji: '🧑‍🌾', startPoints: 35 },
    bride: { image: null, emoji: '👰', startPoints: 30 },
    mermaid: { image: null, emoji: '🧜‍♀️', startPoints: 25 },
    young_witch: { image: null, emoji: '🧙‍♀️', startPoints: 20 },
    singer: { image: null, emoji: '👩‍🎤', startPoints: 35 },
    vampire: { image: null, emoji: '🧛‍♀️', startPoints: 15 },
    genie: { image: null, emoji: '🧝‍♀️', startPoints: 10 },
    bandit_female: { image: null, emoji: '🦹‍♀️', startPoints: 20 }
};

// ============ توابع ============
function getDialogue(npcId, encounterCount) {
    if (!npcId) return null;
    const npcDialogues = dialogues[npcId];
    if (!npcDialogues) return null;
    
    const day = Math.min(7, Math.max(1, (encounterCount || 0) + 1));
    const dayKey = 'day' + day;
    
    const dayDialogues = npcDialogues[dayKey] || npcDialogues.day1;
    if (!dayDialogues || dayDialogues.length === 0) return null;
    
    const index = (encounterCount || 0) % dayDialogues.length;
    return dayDialogues[index] || dayDialogues[0];
}

function getPrisonDialogue(npcId, relationLevel) {
    if (!npcId) return { text: "🤐 ...", level: "untrusted" };
    const npcDialogues = prisonDialogues[npcId];
    if (!npcDialogues) return { text: "🤐 حرفی برای گفتن نداره...", level: relationLevel || "untrusted" };
    const level = relationLevel || "untrusted";
    const levelDialogues = npcDialogues[level] || npcDialogues.untrusted || ["🤐 ..."];
    if (!levelDialogues || levelDialogues.length === 0) return { text: "🤐 ...", level: level };
    const text = levelDialogues[Math.floor(Math.random() * levelDialogues.length)];
    return { text: text || "🤐 ...", level: level };
}

function getHouseDialogue(type, subType) {
    if (!type) return "🤐 ...";
    const key = subType ? `${type}_${subType}` : type;
    const dialogues = houseDialogues[key] || houseDialogues[type];
    if (!dialogues || !Array.isArray(dialogues) || dialogues.length === 0) return "🤐 ...";
    return dialogues[Math.floor(Math.random() * dialogues.length)];
}

function getMarryDialogue(type, subType) {
    if (!type) return "🤐 ...";
    const key = subType ? `${type}_${subType}` : `${type}_text`;
    return marryDialogues[key] || "🤐 ...";
}

function getNpcConfig(npcId) {
    if (!npcId) return null;
    return npcConfig[npcId] || null;
}

function handleAction(player, npcId, action) {
    const npc = getNpcConfig(npcId);
    if (!npc) return { message: '❌ NPC پیدا نشد!', battleStart: false };

    let result = { message: '', battleStart: false };

    switch (action) {
        case 'fight': result.battleStart = true; result.message = `⚔️ ${npc.emoji} برای نبرد آماده میشه!`; break;
        case 'seduce': player.hp = Math.min(player.maxHp || 100, (player.hp || 0) + 15); player.xp = (player.xp || 0) + 15; if (!player.seduced) player.seduced = {}; player.seduced[npcId] = (player.seduced[npcId] || 0) + 1; result.message = `💋 ${npc.emoji} تسلیم عشق تو شد!\n❤️ +۱۵ | ✨ +۱۵`; break;
        case 'flee': result.message = `🏃 فرار کردی...`; break;
        case 'heal': player.hp = player.maxHp || 100; result.message = `❤️ ${npc.emoji} شفات داد!`; break;
        case 'gift': player.inventory.gold = (player.inventory.gold || 0) + 20; result.message = `🎁 ${npc.emoji} ۲۰👑 داد!`; break;
        case 'kiss': player.hp = Math.min(player.maxHp || 100, (player.hp || 0) + 15); result.message = `😘 ${npc.emoji} بوسیدت! +۱۵❤️`; break;
        case 'wealth': player.inventory.gold = (player.inventory.gold || 0) + 30; result.message = `💰 ${npc.emoji} ۳۰👑 داد!`; break;
        case 'power': player.attack = (player.attack || 5) + 5; result.message = `⚔️ ${npc.emoji} +۵⚔️`; break;
        case 'ally': player.defense = (player.defense || 2) + 3; result.message = `🤝 ${npc.emoji} +۳🛡️`; break;
        case 'trade': player.inventory.gold = (player.inventory.gold || 0) + 15; player.inventory.iron = (player.inventory.iron || 0) + 5; result.message = `🤝 +۱۵👑 +۵⛏️`; break;
        case 'potion': player.hp = Math.min(player.maxHp || 100, (player.hp || 0) + 40); player.attack = (player.attack || 5) + 2; result.message = `🧪 +۴۰❤️ +۲⚔️`; break;
        case 'help': player.xp = (player.xp || 0) + 15; result.message = `🤝 +۱۵✨`; break;
        case 'listen': player.xp = (player.xp || 0) + 10; result.message = `👂 +۱۰✨`; break;
        case 'treasure': player.inventory.gold = (player.inventory.gold || 0) + 50; result.message = `💰 +۵۰👑`; break;
        case 'free': player.xp = (player.xp || 0) + 30; result.message = `🕊️ +۳۰✨`; break;
        case 'craft': result.message = `🔨 برو به بخش ساخت‌وساز!`; break;
        case 'propose': player.inventory.ring = (player.inventory.ring || 0) + 1; result.message = `💍 ${npc.emoji} حلقه نامزدی رو گرفت!\n🎁 +۱ 💍`; break;
        case 'wish': player.inventory.wish = (player.inventory.wish || 0) + 1; result.message = `🔮 ${npc.emoji} +۱ آرزو!`; break;
        default: result.message = `🤔 ${npc.emoji} منتظر تصمیم توئه...`;
    }

    return result;
}

module.exports = { 
    dialogues, prisonDialogues, houseDialogues, marryDialogues, npcConfig, 
    getDialogue, getPrisonDialogue, getHouseDialogue, getMarryDialogue, getNpcConfig, handleAction 
};
