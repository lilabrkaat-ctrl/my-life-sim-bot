const config = require('./config');

const dialogues = {
    // ============ NPCهای اصلی ============
    witch: {
        day1: [
            { text: "🧙‍♀️ گمشو بیرون کصکش! قبل اینکه طلسمت کنم و کیرت رو بترکونم! 🔥", options: [{ text: "🗡️ حمله", action: "fight" }, { text: "💋 شیفته شو", action: "seduce" }, { text: "🏃 فرار", action: "flee" }] },
            { text: "🧙‍♀️ بوی کص و کون میاد... آدمیزاده یا حیوون؟! کدوم گورستونی بزرگ شدی؟", options: [{ text: "🤝 آدمم", action: "ally" }, { text: "💋 شیفته‌ات شدم", action: "seduce" }, { text: "🏃 فرار", action: "flee" }] }
        ],
        day2: [
            { text: "🧙‍♀️ دوباره تو؟! می‌خوای بمیری کونی؟ اسکل شدی هر روز میای اینجا؟", options: [{ text: "🎁 هدیه دارم", action: "gift" }, { text: "💋 دلم برات تنگ شده", action: "seduce" }, { text: "🏃 فرار", action: "flee" }] },
            { text: "🧙‍♀️ دیشب توی خواب دیدمت... بازم اومدی؟ خب باشه...", options: [{ text: "👂 بگو", action: "listen" }, { text: "💋 بازم می‌خوام ببینمت", action: "seduce" }, { text: "🏃 فرار", action: "flee" }] }
        ],
        day3: [
            { text: "🧙‍♀️ بیا نزدیک... بذار بو کنم ببینم امروز با کی بودی... اگه بفهمم رفتی پیش اون پری کونی می‌کشمت!", options: [{ text: "🖐️ نزدیک شو", action: "ally" }, { text: "🎁 هدیه دارم", action: "gift" }, { text: "🔙 بعداً", action: "flee" }] },
            { text: "🧙‍♀️ دستام میلرزه... یا از عصبانیت یا از این که دلم می‌خواد ببینمت...", options: [{ text: "💋 عشق", action: "seduce" }, { text: "🤝 عصبانیت", action: "ally" }, { text: "🔙 نه", action: "flee" }] }
        ],
        day4: [
            { text: "🧙‍♀️ باشه... قبولت دارم... دیگه نمی‌خوام بجنگم باهات... 💋", options: [{ text: "💋 ببوس", action: "kiss" }, { text: "🤝 دوست", action: "ally" }, { text: "🔙 بعداً", action: "flee" }] },
            { text: "🧙‍♀️ می‌خوای معجون عشق رو با هم بخوریم؟ 🧪", options: [{ text: "🧪 بخوریم", action: "potion" }, { text: "💋 اول ببوس", action: "kiss" }, { text: "🔙 هیچکدوم", action: "flee" }] }
        ],
        day5: [
            { text: "🧙‍♀️ فقط تو می‌تونی آرومم کنی... 🫣", options: [{ text: "💋 در آغوش بگیر", action: "kiss" }, { text: "🤝 همیشه", action: "ally" }, { text: "🎁 هدیه", action: "gift" }] },
            { text: "🧙‍♀️ می‌خوام تا ابد پیشت بمونم... 💍", options: [{ text: "👰 ازدواج کن", action: "propose" }, { text: "💋 اول ببوس", action: "kiss" }, { text: "🔙 بعداً", action: "flee" }] }
        ],
        day6: [
            { text: "🧙‍♀️ ارباب من... امروز چجور می‌خوای بکنی منو؟ 😈", options: [{ text: "🔥 از جلو", action: "seduce" }, { text: "🍑 از پشت", action: "seduce" }, { text: "👄 دهنی", action: "kiss" }] },
            { text: "🧙‍♀️ برات یه معجون سکسی درست کردم... بکن منو با این؟ 🧪🔥", options: [{ text: "🧪 بکنم", action: "potion" }, { text: "💋 اول ببوس", action: "kiss" }, { text: "🔙 بعداً", action: "flee" }] }
        ],
        day7: [
            { text: "🧙‍♀️ تا آخر عمر حاضر نیستم از کیرت جدا شم... 💍🔥", options: [{ text: "💋 ببوس", action: "kiss" }, { text: "🔥 بکنم وحشی", action: "seduce" }, { text: "👶 بچه‌دار شیم", action: "seduce" }] },
            { text: "🧙‍♀️ امروز می‌خوام رکورد بزنیم... ۷ بار پشت سر هم... 😈", options: [{ text: "🔥 آماده‌ام", action: "seduce" }, { text: "💋 اول آروم", action: "kiss" }, { text: "🔙 امروز نه", action: "flee" }] }
        ],
        harem: [
            { text: "🧙‍♀️ شوهرم... امشب میای پیشم؟ 🫣", options: [{ text: "🔥 میام", action: "seduce" }, { text: "🎁 اول هدیه", action: "gift" }, { text: "🔙 بعداً", action: "flee" }] },
            { text: "🧙‍♀️ دلم برات تنگ شده... 💔", options: [{ text: "💋 الان میام", action: "kiss" }, { text: "🤝 مشغول بودم", action: "ally" }] },
            { text: "🧙‍♀️ بچه‌مون امروز تکون خورد! 🤰", options: [{ text: "👶 عالیه!", action: "ally" }, { text: "💋 ببوس", action: "kiss" }, { text: "🎁 هدیه", action: "gift" }] }
        ]
    },
    vampire: {
        day1: [
            { text: "🧛‍♀️ گرسنمه فاحشه! خونتو می‌خورم و استخوناتو می‌کنم توی موزه!", options: [{ text: "🗡️ حمله", action: "fight" }, { text: "🩸 خون بده", action: "gift" }, { text: "💋 عشق", action: "seduce" }] },
            { text: "🧛‍♀️ ۳۰۰ ساله زندم... تو یه لقمه کوچیکی برام! 😈", options: [{ text: "🗡️ بجنگ", action: "fight" }, { text: "💋 دسر خوشمزه", action: "seduce" }] }
        ],
        day2: [
            { text: "🧛‍♀️ بازم اومدی کصخل؟! خونتو بو می‌کشم...", options: [{ text: "🩸 بخور", action: "gift" }, { text: "💋 بو کن", action: "seduce" }] },
            { text: "🧛‍♀️ دیشب یه انسان رو خشک کردم... تو بعدی هستی!", options: [{ text: "🗡️ نمی‌ذارم", action: "fight" }, { text: "💋 منو نمی‌کشی", action: "seduce" }] }
        ],
        day3: [
            { text: "🧛‍♀️ مچ دستت رو بده... بذار نبضت رو حس کنم 😏", options: [{ text: "🖐️ بده", action: "ally" }, { text: "💋 ببوس", action: "kiss" }] },
            { text: "🧛‍♀️ خون تو اعتیاد آورده... مثل شیشه می‌مونه...", options: [{ text: "🩸 بخور", action: "gift" }, { text: "💋 منم معتادتم", action: "seduce" }] }
        ],
        day4: [
            { text: "🧛‍♀️ شاید نکشمت... شاید تبدیلت کنم به خون‌آشام 🌑", options: [{ text: "🧛 تبدیل کن", action: "potion" }, { text: "💋 همدمت میشم", action: "seduce" }] },
            { text: "🧛‍♀️ نمی‌خوام بکشمت... می‌خوام قرن‌ها باهات باشم 💋", options: [{ text: "💋 پیشم بمون", action: "kiss" }, { text: "🔥 باش", action: "seduce" }] }
        ],
        day5: [
            { text: "🧛‍♀️ ۳۰۰ ساله عاشق نشدم... تو اولین و آخرینی...", options: [{ text: "💋 منم عاشقتم", action: "kiss" }, { text: "🔥 بیا", action: "seduce" }] },
            { text: "🧛‍♀️ بیا... با هم جاودانه شیم... 🩸💋", options: [{ text: "🩸 جاودانه", action: "potion" }, { text: "💋 ببوس", action: "kiss" }] }
        ],
        day6: [
            { text: "🧛‍♀️ من خون‌آشام تو شدم... تا ابد... حالا بکن منو 💋", options: [{ text: "🔥 از جلو", action: "seduce" }, { text: "🍑 از پشت", action: "seduce" }, { text: "👄 دهنی", action: "kiss" }] },
            { text: "🧛‍♀️ هر شب میام سراغت... 🫣🔥", options: [{ text: "💋 بیا", action: "kiss" }, { text: "🔥 منتظرم", action: "seduce" }] }
        ],
        day7: [
            { text: "🧛‍♀️ اگه بمیری... خودم زنده‌ات می‌کنم 💀💋", options: [{ text: "💋 نمی‌میرم", action: "kiss" }, { text: "👰 ازدواج", action: "propose" }] },
            { text: "🧛‍♀️ تا ابد مال تو... 🧛‍♀️💋", options: [{ text: "💋 مال منی", action: "kiss" }, { text: "🔥 بیا", action: "seduce" }] }
        ],
        harem: [
            { text: "🧛‍♀️ شوهرم... امشب گرسنه‌ام 🩸", options: [{ text: "🩸 خون", action: "gift" }, { text: "🔥 بیا", action: "seduce" }] },
            { text: "🧛‍♀️ چرا انقدر دیر میای؟ 💔", options: [{ text: "💋 الان اومدم", action: "kiss" }, { text: "🤝 مشغول بودم", action: "ally" }] }
        ]
    },
    fairy: {
        day1: [
            { text: "🧚 سلام خوشتیپ! ۳ تا آرزو داری 😜", options: [{ text: "💎 ثروت", action: "wealth" }, { text: "⚔️ قدرت", action: "power" }, { text: "💋 عشق", action: "seduce" }] },
            { text: "🧚 هی قهرمان! از کجا اومدی؟ 😈", options: [{ text: "💋 از راه دور", action: "seduce" }, { text: "🤝 نمی‌دونم", action: "ally" }] }
        ],
        day2: [
            { text: "🧚 آرزوی دومت چیه؟ 👯", options: [{ text: "💎 پول", action: "wealth" }, { text: "❤️ سلامتی", action: "heal" }] },
            { text: "🧚 دیشب توی گوشت آرزو خوندم 💋", options: [{ text: "👂 چی گفتی؟", action: "listen" }, { text: "💋 عاشقمی؟", action: "seduce" }] }
        ],
        day3: [
            { text: "🧚 آرزوی سوم: عشق! 😜", options: [{ text: "💋 قبول", action: "seduce" }, { text: "🗡️ رد", action: "fight" }] },
            { text: "🧚 آرزوی اول: ثروت، دوم: قدرت، سوم: من! 💋", options: [{ text: "💋 سومی", action: "seduce" }, { text: "💰 اولی", action: "wealth" }] }
        ],
        day4: [
            { text: "🧚 گرد جادویی دارم... هرچی بخوای میشه", options: [{ text: "💋 عشق", action: "seduce" }, { text: "⚔️ قدرت", action: "power" }] },
            { text: "🧚 می‌دونی پری‌ها چجوری می‌بوسن؟ ✨💋", options: [{ text: "💋 نشون بده", action: "kiss" }, { text: "🤝 بگو", action: "listen" }] }
        ],
        day5: [
            { text: "🧚 ۳ تا آرزو بکن... سومی رو من می‌گم", options: [{ text: "💋 بگو", action: "seduce" }, { text: "🔮 خودم می‌گم", action: "wish" }] },
            { text: "🧚 دیشب توی خوابم بودی 🫣", options: [{ text: "💋 خوب خوابیدی؟", action: "kiss" }, { text: "🤝 چی شد؟", action: "listen" }] }
        ],
        day6: [
            { text: "🧚 پری‌ها عاشق نمیشن ولی من شدم", options: [{ text: "🔥 از جلو", action: "seduce" }, { text: "🍑 از پشت", action: "seduce" }, { text: "👄 دهنی", action: "kiss" }] },
            { text: "🧚 جادوی من مال تو... همه چیزم 💋✨", options: [{ text: "💋 ببوس", action: "kiss" }, { text: "🔥 بکنم", action: "seduce" }] }
        ],
        day7: [
            { text: "🧚 باشه قبول... عاشق شدم 💋😜", options: [{ text: "💋 منم عاشقتم", action: "kiss" }, { text: "👰 ازدواج", action: "propose" }] },
            { text: "🧚 هر آرزویی بکنی برآورده میشه 🫣🔥", options: [{ text: "🔥 آرزوی عشق", action: "seduce" }, { text: "💰 آرزوی ثروت", action: "wealth" }] }
        ],
        harem: [
            { text: "🧚 شوهرم... برات یه سورپرایز دارم! ✨", options: [{ text: "🔥 میام", action: "seduce" }, { text: "💋 بگو", action: "kiss" }] }
        ]
    },
    angel: {
        day1: [
            { text: "👼 نگران نباش مسافر... کمکت می‌کنم", options: [{ text: "❤️ شفا", action: "heal" }, { text: "💋 ممنون", action: "seduce" }] },
            { text: "👼 من فرشته‌ام... نباید این حرفا رو بزنم", options: [{ text: "👂 بگو", action: "listen" }, { text: "💋 ادامه بده", action: "seduce" }] }
        ],
        day2: [
            { text: "👼 دوباره زخمی شدی؟ بیا شفا بدم", options: [{ text: "❤️ شفا", action: "heal" }, { text: "💋 ببوس", action: "seduce" }] },
            { text: "👼 خدا ببخشه... وقتی نگام می‌کنی بال‌هام میلرزه", options: [{ text: "💋 جدی؟", action: "kiss" }, { text: "🤝 چرا؟", action: "listen" }] }
        ],
        day3: [
            { text: "👼 من نباید عاشق بشم... ولی نمی‌تونم", options: [{ text: "💋 عشق ممنوعه", action: "seduce" }, { text: "👼 برو بهشت", action: "free" }] },
            { text: "👼 این گناهه... ولی چرا اینقدر خوبه؟ 😳", options: [{ text: "💋 چون عشقه", action: "kiss" }, { text: "🤝 گناه نیست", action: "ally" }] }
        ],
        day4: [
            { text: "👼 دیشب دعا می‌کردم ولی فکرم پیش تو بود 🙏", options: [{ text: "💋 منم پیش تو بودم", action: "kiss" }, { text: "🤝 چی شد؟", action: "listen" }] },
            { text: "👼 بذار بال‌هام رو لمس کنی", options: [{ text: "🖐️ لمس کن", action: "ally" }, { text: "💋 ببوس", action: "kiss" }] }
        ],
        day5: [
            { text: "👼 حاضرم بسوزم فقط یه بار بغلت کنم 🔥", options: [{ text: "💋 بغلم کن", action: "kiss" }, { text: "🤝 نمی‌خوام بسوزی", action: "ally" }] },
            { text: "👼 لب‌هام میلرزه... بوسیدن چه حسی داره؟ 😳", options: [{ text: "💋 امتحان کن", action: "kiss" }, { text: "🤝 خوبه", action: "listen" }] }
        ],
        day6: [
            { text: "👼 دیگه برام مهم نیست خدا چی می‌گه 💋", options: [{ text: "🔥 از جلو", action: "seduce" }, { text: "🍑 از پشت", action: "seduce" }, { text: "👄 دهنی", action: "kiss" }] },
            { text: "👼 من سقوط کردم از آسمون برای تو 👼💋", options: [{ text: "💋 ارزشش رو داشتی", action: "kiss" }, { text: "🔥 بکنم", action: "seduce" }] }
        ],
        day7: [
            { text: "👼 حالا یه فرشته گناه‌کارم... مال توام 😈", options: [{ text: "💋 مال منی", action: "kiss" }, { text: "🔥 بیا", action: "seduce" }] },
            { text: "👼 هر شب به جای دعا... تو رو می‌بینم 🫣💋", options: [{ text: "💋 منم همینطور", action: "kiss" }, { text: "👰 ازدواج آسمونی", action: "propose" }] }
        ],
        harem: [
            { text: "👼 شوهرم... برات دعا کردم 🙏", options: [{ text: "🔥 میام", action: "seduce" }, { text: "💋 بیا بغلم", action: "kiss" }] }
        ]
    }
};
    knight: {
    day1: [
        { text: "⚔️ ای غریبه! شمشیرت رو بکش! ببینم چی داری!", options: [{ text: "⚔️ می‌جنگم", action: "fight" }, { text: "🤝 دوست", action: "ally" }, { text: "🏃 فرار", action: "flee" }] },
        { text: "⚔️ فقط یه بار شکست خوردم اونم تو بودی!", options: [{ text: "⚔️ دوباره", action: "fight" }, { text: "💋 بیا", action: "kiss" }, { text: "🏃 فرار", action: "flee" }] }
    ],
    day2: [
        { text: "⚔️ دفعه قبل خوب جنگیدی... این دفعه آماده‌ترم", options: [{ text: "⚔️ بجنگ", action: "fight" }, { text: "💋 امتحان کن", action: "seduce" }, { text: "🏃 فرار", action: "flee" }] },
        { text: "⚔️ چرا هر روز میای؟ می‌خوای تحقیرم کنی؟", options: [{ text: "🤝 نه", action: "ally" }, { text: "💋 می‌خوام ببینمت", action: "seduce" }, { text: "🏃 فرار", action: "flee" }] }
    ],
    day3: [
        { text: "⚔️ شب‌ها به جنگیدن با تو فکر می‌کنم...", options: [{ text: "⚔️ بجنگیم", action: "fight" }, { text: "💋 منم به تو", action: "kiss" }, { text: "🏃 فرار", action: "flee" }] },
        { text: "⚔️ زره‌ام رو درآوردم... سنگینه... خسته شدم", options: [{ text: "🖐️ بذار ببینم", action: "ally" }, { text: "💋 خوشتیپی", action: "seduce" }, { text: "🏃 فرار", action: "flee" }] }
    ],
    day4: [
        { text: "⚔️ دستت قویه ولی ملایم... شاید آدم خوبی باشی", options: [{ text: "🖐️ لمس کن", action: "ally" }, { text: "💋 ببوس", action: "kiss" }, { text: "🔙 بعداً", action: "flee" }] },
        { text: "⚔️ می‌خوام یه نبرد دیگه... بدون اسلحه 😳", options: [{ text: "🔥 بیا", action: "seduce" }, { text: "💋 اول ببوس", action: "kiss" }, { text: "🔙 بعداً", action: "flee" }] }
    ],
    day5: [
        { text: "⚔️ تسلیم شدم... همه چیزم مال تو...", options: [{ text: "💋 مال منی", action: "kiss" }, { text: "🔥 بکنم", action: "seduce" }, { text: "🤝 دوست", action: "ally" }] },
        { text: "⚔️ زره‌ام بازه... دیگه دفاعی ندارم 🫣", options: [{ text: "🔥 از جلو", action: "seduce" }, { text: "🍑 از پشت", action: "seduce" }, { text: "🔙 بعداً", action: "flee" }] }
    ],
    day6: [
        { text: "⚔️ فقط تو می‌تونی منو شکست بدی 💋", options: [{ text: "🔥 از جلو", action: "seduce" }, { text: "🍑 از پشت", action: "seduce" }, { text: "👄 دهنی", action: "kiss" }] },
        { text: "⚔️ من شوالیه‌ام... ولی برای تو فرق دارم 💋", options: [{ text: "💋 فرق داری", action: "kiss" }, { text: "🔥 آره", action: "seduce" }, { text: "🤝 باش", action: "ally" }] }
    ],
    day7: [
        { text: "⚔️ شوالیه تو شدم... تا ابد ⚔️💋", options: [{ text: "💋 تا ابد", action: "kiss" }, { text: "👰 ازدواج", action: "propose" }, { text: "🔥 بیا", action: "seduce" }] },
        { text: "⚔️ هر شب منتظرتم... بدون زره 🔥", options: [{ text: "🔥 میام", action: "seduce" }, { text: "💋 منتظر باش", action: "kiss" }, { text: "🤝 باش", action: "ally" }] }
    ],
    harem: [
        { text: "⚔️ شوهرم... امروز تمرین داریم؟ 😏", options: [{ text: "⚔️ شمشیر", action: "fight" }, { text: "🔥 سکس", action: "seduce" }, { text: "💋 هردو", action: "kiss" }] }
    ]
},
    werewolf: {
        day1: [
            { text: "🐺 غرررر! عقب برو کثافت! گازت می‌گیرم!", options: [{ text: "🗡️ حمله", action: "fight" }, { text: "💋 آروم باش", action: "seduce" }, { text: "🏃 فرار", action: "flee" }] },
            { text: "🐺 ماه کامله... و من توی قفس...", options: [{ text: "🔓 آزادت کنم", action: "free" }, { text: "💋 می‌خوام کمکت کنم", action: "seduce" }] }
        ],
        day2: [
            { text: "🐺 چرا انقدر نزدیک میشی؟ شام امشبمی!", options: [{ text: "🍖 غذا دارم", action: "gift" }, { text: "💋 شام نیستم", action: "seduce" }] },
            { text: "🐺 دستت گرمه... مثل خون تازه", options: [{ text: "🖐️ لمس کن", action: "ally" }, { text: "💋 گرمه", action: "kiss" }] }
        ],
        day3: [
            { text: "🐺 وقتی میای... یه حسی می‌گه شکارت نکنم", options: [{ text: "🤝 دوست", action: "ally" }, { text: "💋 حس خوبیه", action: "seduce" }] },
            { text: "🐺 هیچکس تا حالا اینقدر نزدیک نشده بود", options: [{ text: "🖐️ نزدیک‌تر", action: "ally" }, { text: "💋 ببوس", action: "kiss" }] }
        ],
        day4: [
            { text: "🐺 دستاتو بذار رو صورتم 🫣", options: [{ text: "🖐️ می‌ذارم", action: "ally" }, { text: "💋 ببوس", action: "kiss" }] },
            { text: "🐺 می‌خوام تبدیلت کنم به گرگ 😈", options: [{ text: "🐺 تبدیل کن", action: "potion" }, { text: "💋 با هم", action: "seduce" }] }
        ],
        day5: [
            { text: "🐺 وقتی نیستی زوزه می‌کشم 🐺💔", options: [{ text: "💋 منم دلتنگ میشم", action: "kiss" }, { text: "🔥 بیا", action: "seduce" }] },
            { text: "🐺 دیشب ماه کامل بود... به تو فکر می‌کردم 🌕", options: [{ text: "💋 عاشقی", action: "kiss" }, { text: "🔥 بکنم", action: "seduce" }] }
        ],
        day6: [
            { text: "🐺 مال تو شدم... آلفای من 🐺💋", options: [{ text: "🔥 از جلو", action: "seduce" }, { text: "🍑 از پشت", action: "seduce" }, { text: "👄 دهنی", action: "kiss" }] },
            { text: "🐺 بیا نزدیک‌تر... بذار گرمات رو حس کنم 🔥💋", options: [{ text: "🔥 حس کن", action: "seduce" }, { text: "💋 ببوس", action: "kiss" }] }
        ],
        day7: [
            { text: "🐺 فقط تو می‌تونی آرومم کنی 🐺💋", options: [{ text: "💋 آروم باش", action: "kiss" }, { text: "👰 همدم همیشگی", action: "propose" }] },
            { text: "🐺 تا ابد گرگ تو می‌مونم 🐺🔥", options: [{ text: "💋 تا ابد", action: "kiss" }, { text: "🔥 بیا", action: "seduce" }] }
        ],
        harem: [
            { text: "🐺 شوهرم... امشب ماه کامله 🌕🔥", options: [{ text: "🔥 وحشی شو", action: "seduce" }, { text: "💋 آروم باش", action: "kiss" }] }
        ]
    },
    bride: {
        day1: [
            { text: "👰 من بدشانس‌ترین عروس دنیام...", options: [{ text: "🤝 کمک", action: "help" }, { text: "💋 من خیانت نمی‌کنم", action: "seduce" }] },
            { text: "👰 از عروسی فرار کردم...", options: [{ text: "💍 با من ازدواج کن", action: "propose" }, { text: "🤝 کمک", action: "help" }] }
        ],
        day2: [
            { text: "👰 تو هم مثل بقیه‌ای؟", options: [{ text: "🤝 نه", action: "ally" }, { text: "💋 می‌خوام پیشم بمونی", action: "seduce" }] },
            { text: "👰 چرا اینقدر بهم توجه می‌کنی؟", options: [{ text: "💋 لیاقت داری", action: "kiss" }, { text: "🤝 داری", action: "ally" }] }
        ],
        day3: [
            { text: "👰 دیشب خواب دیدم با یه غریبه ازدواج کردم 🫣", options: [{ text: "💋 من بودم", action: "kiss" }, { text: "💍 ازدواج", action: "propose" }] },
            { text: "👰 من از عشق فرار کردم... ولی عشق دنبالمه", options: [{ text: "💋 عشق منم", action: "seduce" }, { text: "🤝 آروم باش", action: "ally" }] }
        ],
        day4: [
            { text: "👰 دستت رو بده... ببینم حلقه داری؟ 💍", options: [{ text: "💍 دارم", action: "propose" }, { text: "🤝 ندارم", action: "ally" }] },
            { text: "👰 اگه تو داماد بودی فرار نمی‌کردم 🫣", options: [{ text: "💋 نمی‌کردی", action: "kiss" }, { text: "💍 دامادم", action: "propose" }] }
        ],
        day5: [
            { text: "👰 من حاضرم دوباره عروسی کنم... با تو 💋", options: [{ text: "💍 عروسی", action: "propose" }, { text: "💋 ببوس", action: "kiss" }] },
            { text: "👰 لباس عروسم هنوز تنمه 🫣", options: [{ text: "🔥 درمیارم", action: "seduce" }, { text: "💋 اول ببوس", action: "kiss" }] }
        ],
        day6: [
            { text: "👰 این دفعه مطمئنم که فرار نمی‌کنم", options: [{ text: "🔥 از جلو", action: "seduce" }, { text: "🍑 از پشت", action: "seduce" }, { text: "👄 دهنی", action: "kiss" }] },
            { text: "👰 من عروس تو شدم... برای همیشه 👰💋", options: [{ text: "💋 برای همیشه", action: "kiss" }, { text: "🔥 شب اول", action: "seduce" }] }
        ],
        day7: [
            { text: "👰 هر شب با لباس عروسم منتظرتم 🫣🔥", options: [{ text: "🔥 میام", action: "seduce" }, { text: "💋 منتظر باش", action: "kiss" }] },
            { text: "👰 بهترین تصمیم زندگیم... فرار نکردن از تو 💋", options: [{ text: "💋 بهترینی", action: "kiss" }, { text: "👶 بچه‌دار شیم", action: "seduce" }] }
        ],
        harem: [
            { text: "👰 شوهرم... امروز سالگرد آشناییمونه 💍", options: [{ text: "💍 مبارکه", action: "gift" }, { text: "🔥 جشن", action: "seduce" }] }
        ]
    },
    mermaid: {
        day1: [
            { text: "🧜‍♀️ سلام مسافر... آواز منو شنیدی؟", options: [{ text: "🎵 گوش کن", action: "listen" }, { text: "💋 عشق", action: "seduce" }, { text: "🏃 برو", action: "flee" }] },
            { text: "🧜‍♀️ می‌تونی آرزوت رو بگی...", options: [{ text: "💋 عشق", action: "seduce" }, { text: "💰 ثروت", action: "wealth" }] }
        ],
        day2: [
            { text: "🧜‍♀️ دوباره اومدی... دلت برام تنگ شده؟", options: [{ text: "💋 تنگ شده", action: "kiss" }, { text: "🎵 آواز بخون", action: "listen" }] },
            { text: "🧜‍♀️ تو تنها انسانی که از من نمی‌ترسه", options: [{ text: "💋 نمی‌ترسم", action: "seduce" }, { text: "🤝 دوستم", action: "ally" }] }
        ],
        day3: [
            { text: "🧜‍♀️ می‌خوای بیای زیر آب؟ 🫣", options: [{ text: "🔥 بیا", action: "seduce" }, { text: "💋 اول ببوس", action: "kiss" }] },
            { text: "🧜‍♀️ آواز من جادو داره", options: [{ text: "💋 شدم", action: "kiss" }, { text: "🎵 بخون", action: "listen" }] }
        ],
        day4: [
            { text: "🧜‍♀️ پری‌های دریایی عاشق نمی‌شن... ولی من 🫣", options: [{ text: "💋 عاشق شدی", action: "kiss" }, { text: "🤝 چی؟", action: "listen" }] },
            { text: "🧜‍♀️ دلم می‌خواد پا داشته باشم", options: [{ text: "💋 کنارمی", action: "kiss" }, { text: "🔮 آرزو کن", action: "wish" }] }
        ],
        day5: [
            { text: "🧜‍♀️ تو متفاوتی... مثل بقیه نیستی", options: [{ text: "💋 عاشقتم", action: "kiss" }, { text: "🔥 بکنم", action: "seduce" }] },
            { text: "🧜‍♀️ می‌خوام تا ابد با تو بمونم 💋", options: [{ text: "💋 بمون", action: "kiss" }, { text: "👰 ازدواج دریایی", action: "propose" }] }
        ],
        day6: [
            { text: "🧜‍♀️ امروز می‌خوام مال تو باشم 🫣", options: [{ text: "🔥 از جلو", action: "seduce" }, { text: "🍑 از پشت", action: "seduce" }, { text: "👄 دهنی", action: "kiss" }] },
            { text: "🧜‍♀️ هیچ‌کس نمی‌دونه زیر آب چه خبره 😈", options: [{ text: "🔥 بکنم", action: "seduce" }, { text: "💋 ببوس", action: "kiss" }] }
        ],
        day7: [
            { text: "🧜‍♀️ تا ابد مال تو 💋", options: [{ text: "💋 مال منی", action: "kiss" }, { text: "👶 بچه پری", action: "seduce" }] },
            { text: "🧜‍♀️ هر شب برات آواز می‌خونم 🎵💋", options: [{ text: "🎵 بخون", action: "listen" }, { text: "💋 ببوس", action: "kiss" }] }
        ],
        harem: [
            { text: "🧜‍♀️ شوهرم... برات یه مروارید پیدا کردم 🦪", options: [{ text: "💎 ممنون", action: "gift" }, { text: "💋 بیا", action: "kiss" }] }
        ]
    },
    skeleton: {
        day1: [
            { text: "💀 گوشت داری کثافت؟! گرسنمه!", options: [{ text: "🍖 بده", action: "gift" }, { text: "🗡️ بجنگ", action: "fight" }, { text: "💋 عشق", action: "seduce" }] },
            { text: "💀 من زنده نیستم... ولی تو رو می‌کشم!", options: [{ text: "🗡️ بجنگ", action: "fight" }, { text: "💋 نمی‌میرم", action: "seduce" }] }
        ],
        day2: [
            { text: "💀 دیشب خواب دیدم گوشت دارم 🫣", options: [{ text: "👂 جدی؟", action: "listen" }, { text: "💋 می‌خوای؟", action: "seduce" }] },
            { text: "💀 استخونام... وقتی نزدیکمی صدا می‌دن", options: [{ text: "🖐️ لمس کن", action: "ally" }, { text: "💋 صدا می‌دن", action: "kiss" }] }
        ],
        day3: [
            { text: "💀 قلب ندارم... ولی یه چیزی توی سینه‌م می‌تپه", options: [{ text: "💋 عشقه", action: "kiss" }, { text: "🤝 چیه؟", action: "listen" }] },
            { text: "💀 شاید این دفعه نکشمت... شاید", options: [{ text: "🤝 ممنون", action: "ally" }, { text: "💋 دوستم داری", action: "seduce" }] }
        ],
        day4: [
            { text: "💀 دستت رو بذار روی استخونام", options: [{ text: "🖐️ می‌ذارم", action: "ally" }, { text: "💋 نمی‌شکنن", action: "kiss" }] },
            { text: "💀 وقتی تو هستی حس می‌کنم زنده‌ام", options: [{ text: "💋 زنده‌ای", action: "kiss" }, { text: "🔥 حس کن", action: "seduce" }] }
        ],
        day5: [
            { text: "💀 عاشق یه زنده شدم! 💀💋", options: [{ text: "💋 منم عاشقتم", action: "kiss" }, { text: "🔥 بیا", action: "seduce" }] },
            { text: "💀 گوشت می‌خوام... ولی فقط تو رو 🫣💋", options: [{ text: "🔥 بخور", action: "seduce" }, { text: "💋 ببوس", action: "kiss" }] }
        ],
        day6: [
            { text: "💀 هر شب برات می‌رقصم 💃🦴", options: [{ text: "🔥 از جلو", action: "seduce" }, { text: "🍑 از پشت", action: "seduce" }, { text: "👄 دهنی", action: "kiss" }] },
            { text: "💀 امروز می‌خوام زنده باشم 🫣", options: [{ text: "💋 زنده‌ای", action: "kiss" }, { text: "🔥 بکنم", action: "seduce" }] }
        ],
        day7: [
            { text: "💀 تا ابد اسکلت عاشق تو 💀💋", options: [{ text: "💋 تا ابد", action: "kiss" }, { text: "👰 ازدواج استخونی", action: "propose" }] },
            { text: "💀 استخونام مال تو... همه چیزم 💋", options: [{ text: "💋 مال منی", action: "kiss" }, { text: "🔥 بیا", action: "seduce" }] }
        ],
        harem: [
            { text: "💀 شوهرم... امروز یه استخون جدید پیدا کردم 🦴", options: [{ text: "🦴 جالبه", action: "ally" }, { text: "💋 بیا", action: "kiss" }] }
        ]
    }
};
    bandit_female: {
        day1: [
            { text: "🦹‍♀️ پولتو بده جنده! یا می‌کنمت با خنجرم!", options: [{ text: "💰 بده", action: "trade" }, { text: "💋 عشق", action: "seduce" }, { text: "🗡️ حمله", action: "fight" }] },
            { text: "🦹‍♀️ من راهزنم! از هیچی نمی‌ترسم!", options: [{ text: "🗡️ بجنگ", action: "fight" }, { text: "💋 از من می‌ترسی", action: "seduce" }] }
        ],
        day2: [
            { text: "🦹‍♀️ هر روز میای... دلت می‌خوای منو ببینی؟", options: [{ text: "💋 می‌خوام", action: "seduce" }, { text: "💰 پول", action: "trade" }] },
            { text: "🦹‍♀️ من دزدم... ولی دلم رو نمی‌تونم بدزدم", options: [{ text: "💋 دزدیدم", action: "kiss" }, { text: "🤝 نمی‌خوام", action: "ally" }] }
        ],
        day3: [
            { text: "🦹‍♀️ شاید تو بتونی منو عوض کنی", options: [{ text: "🤝 عوض می‌کنم", action: "ally" }, { text: "💋 عوض شو", action: "seduce" }] },
            { text: "🦹‍♀️ تو قلبم رو دزدیدی", options: [{ text: "💋 قلبم مال تو", action: "kiss" }, { text: "🤝 جبران کن", action: "ally" }] }
        ],
        day4: [
            { text: "🦹‍♀️ اگه آزادم کنی دیگه دزدی نمی‌کنم", options: [{ text: "🔓 آزاد", action: "free" }, { text: "💋 فقط منو بدزد", action: "seduce" }] },
            { text: "🦹‍♀️ من راهزنم... ولی برای تو تسلیمم 💋", options: [{ text: "💋 تسلیم شو", action: "kiss" }, { text: "🔥 بکنم", action: "seduce" }] }
        ],
        day5: [
            { text: "🦹‍♀️ تمام گنج‌هایی که دزدیدم", options: [{ text: "💋 عاشقمی", action: "kiss" }, { text: "💰 گنجات کو", action: "trade" }] },
            { text: "🦹‍♀️ بیا... این دفعه منو تو بدزد 🫣", options: [{ text: "🔥 می‌دزدم", action: "seduce" }, { text: "💋 اول ببوس", action: "kiss" }] }
        ],
        day6: [
            { text: "🦹‍♀️ من دیگه دزد نیستم 💋", options: [{ text: "🔥 از جلو", action: "seduce" }, { text: "🍑 از پشت", action: "seduce" }, { text: "👄 دهنی", action: "kiss" }] },
            { text: "🦹‍♀️ بهترین گنج تویی", options: [{ text: "💋 بهترینی", action: "kiss" }, { text: "🔥 بکنم", action: "seduce" }] }
        ],
        day7: [
            { text: "🦹‍♀️ مال تو شدم... برای همیشه 💋", options: [{ text: "💋 مال منی", action: "kiss" }, { text: "👰 ازدواج", action: "propose" }] },
            { text: "🦹‍♀️ فقط عشق تو رو می‌دزدم 💋", options: [{ text: "💋 بدزد", action: "kiss" }, { text: "🔥 بیا", action: "seduce" }] }
        ],
        harem: [
            { text: "🦹‍♀️ شوهرم... برات یه چیز دزدیدم 🤫", options: [{ text: "💰 چیه؟", action: "gift" }, { text: "💋 ممنون", action: "kiss" }] }
        ]
    },
    singer: {
        day1: [
            { text: "👩‍🎤 می‌خوای برات آواز بخونم؟ 🎵", options: [{ text: "🎵 بخون", action: "listen" }, { text: "💋 عشق", action: "seduce" }] },
            { text: "👩‍🎤 صدای من قلبت رو تسخیر می‌کنه", options: [{ text: "🎵 تسخیر کن", action: "listen" }, { text: "💋 تسخیر شدم", action: "seduce" }] }
        ],
        day2: [
            { text: "👩‍🎤 دیشب برات آهنگ عاشقونه نوشتم", options: [{ text: "🎵 بخون", action: "listen" }, { text: "💋 برام؟", action: "kiss" }] },
            { text: "👩‍🎤 وقتی می‌خونم... دنیا مال منه", options: [{ text: "🎵 بخون", action: "listen" }, { text: "💋 مال منی", action: "seduce" }] }
        ],
        day3: [
            { text: "👩‍🎤 می‌خوای برات خصوصی بخونم؟ 🫣", options: [{ text: "🏠 بیا", action: "ally" }, { text: "💋 خصوصی", action: "seduce" }] },
            { text: "👩‍🎤 آوازهای من عاشقت می‌کنن", options: [{ text: "💋 شدم", action: "kiss" }, { text: "🎵 بخون", action: "listen" }] }
        ],
        day4: [
            { text: "👩‍🎤 هیچ‌کس مثل تو درکم نکرده", options: [{ text: "💋 درک می‌کنم", action: "kiss" }, { text: "🎵 ادامه بده", action: "listen" }] },
            { text: "👩‍🎤 دلم می‌خواد تا صبح برات بخونم", options: [{ text: "🎵 بخون", action: "listen" }, { text: "💋 تا صبح", action: "seduce" }] }
        ],
        day5: [
            { text: "👩‍🎤 عاشقتم... می‌خوام توی آوازم بگم 🎵💋", options: [{ text: "💋 بگو", action: "kiss" }, { text: "🎵 بخون", action: "listen" }] },
            { text: "👩‍🎤 صدای من فقط برای توئه", options: [{ text: "💋 برای من", action: "kiss" }, { text: "🔥 بیا", action: "seduce" }] }
        ],
        day6: [
            { text: "👩‍🎤 امروز برات آواز خاص می‌خونم 🫣", options: [{ text: "🔥 از جلو", action: "seduce" }, { text: "🍑 از پشت", action: "seduce" }, { text: "👄 دهنی", action: "kiss" }] },
            { text: "👩‍🎤 موسیقی عشق... با ساز بدنمون 🎵🔥", options: [{ text: "🔥 بزن", action: "seduce" }, { text: "💋 آروم", action: "kiss" }] }
        ],
        day7: [
            { text: "👩‍🎤 تا ابد برات می‌خونم 🎵💋", options: [{ text: "💋 تا ابد", action: "kiss" }, { text: "👰 ازدواج", action: "propose" }] },
            { text: "👩‍🎤 آواز آخر... آواز عشق ابدی 🎵💍", options: [{ text: "🎵 بخون", action: "listen" }, { text: "💋 ببوس", action: "kiss" }] }
        ],
        harem: [
            { text: "👩‍🎤 شوهرم... برات یه آهنگ جدید نوشتم 🎵", options: [{ text: "🎵 بخون", action: "listen" }, { text: "🔥 سکس", action: "seduce" }] }
        ]
    },
    genie: {
        day1: [
            { text: "🧝‍♀️ آزادم کردی! ۳ تا آرزو می‌تونی بکنی", options: [{ text: "💎 ثروت", action: "wealth" }, { text: "⚔️ قدرت", action: "power" }, { text: "💋 عشق", action: "seduce" }] },
            { text: "🧝‍♀️ من جن صحرام... هر آرزویی برآورده میشه", options: [{ text: "💋 عشق", action: "seduce" }, { text: "💰 پول", action: "wealth" }] }
        ],
        day2: [
            { text: "🧝‍♀️ آرزوی دومت چیه؟", options: [{ text: "⚔️ قدرت", action: "power" }, { text: "💋 تو", action: "seduce" }] },
            { text: "🧝‍♀️ می‌دونی جن‌ها چقدر قدرتمندن؟", options: [{ text: "👂 بگو", action: "listen" }, { text: "💋 نشون بده", action: "seduce" }] }
        ],
        day3: [
            { text: "🧝‍♀️ آرزوی سوم رو خودم انتخاب کنم؟ 😈", options: [{ text: "💋 انتخاب کن", action: "seduce" }, { text: "🤝 باشه", action: "ally" }] },
            { text: "🧝‍♀️ می‌تونم عشق رو واقعی کنم", options: [{ text: "💋 عشق", action: "kiss" }, { text: "🔮 واقعی کن", action: "wish" }] }
        ],
        day4: [
            { text: "🧝‍♀️ تا حالا عاشق نشدم... ولی تو", options: [{ text: "💋 عاشق شو", action: "kiss" }, { text: "🤝 چرا؟", action: "listen" }] },
            { text: "🧝‍♀️ می‌خوام پیشت بمونم... به عنوان زن 💋", options: [{ text: "💋 بمون", action: "kiss" }, { text: "🔥 زن من", action: "seduce" }] }
        ],
        day5: [
            { text: "🧝‍♀️ قدرتم رو فدای عشقت می‌کنم", options: [{ text: "💋 نمی‌خوام", action: "kiss" }, { text: "🤝 فدا نکن", action: "ally" }] },
            { text: "🧝‍♀️ ۱۰۰۰ ساله زنده‌ام... این ۳ روز بهترین بود 💋", options: [{ text: "💋 عاشقتم", action: "kiss" }, { text: "🔥 بیا", action: "seduce" }] }
        ],
        day6: [
            { text: "🧝‍♀️ امروز تمام جادوم رو برات 🫣", options: [{ text: "🔥 از جلو", action: "seduce" }, { text: "🍑 از پشت", action: "seduce" }, { text: "👄 دهنی", action: "kiss" }] },
            { text: "🧝‍♀️ جادوی عشق قوی‌ترین جادوست 🔮💋", options: [{ text: "💋 جادو کن", action: "kiss" }, { text: "🔥 بکنم", action: "seduce" }] }
        ],
        day7: [
            { text: "🧝‍♀️ تا ابد مال تو 💋", options: [{ text: "💋 مال منی", action: "kiss" }, { text: "👰 ازدواج", action: "propose" }] },
            { text: "🧝‍♀️ آخرین آرزوم... عاشقت بمونم 💍", options: [{ text: "💋 تا ابد", action: "kiss" }, { text: "👶 بچه جن", action: "seduce" }] }
        ],
        harem: [
            { text: "🧝‍♀️ شوهرم... امروز ۳ تا آرزو داری 🔮", options: [{ text: "💋 آرزوی تو", action: "kiss" }, { text: "💰 ثروت", action: "wealth" }] }
        ]
    },
    young_witch: {
        day1: [
            { text: "🧙‍♀️ هنوز خیلی چیزا یاد نگرفتم", options: [{ text: "🔮 طلسم", action: "potion" }, { text: "💋 عشق", action: "seduce" }, { text: "🏃 برو", action: "flee" }] },
            { text: "🧙‍♀️ من شاگرد جادوگرم... ولی ازش بهترم!", options: [{ text: "👂 بگو", action: "listen" }, { text: "💋 نشون بده", action: "seduce" }] }
        ],
        day2: [
            { text: "🧙‍♀️ دیشب یه طلسم جدید یاد گرفتم", options: [{ text: "🧪 امتحان کن", action: "potion" }, { text: "💋 روی من؟", action: "seduce" }] },
            { text: "🧙‍♀️ استادم می‌گه جادوگرا نباید عاشق بشن", options: [{ text: "💋 عاشق شو", action: "seduce" }, { text: "🤝 چرا؟", action: "listen" }] }
        ],
        day3: [
            { text: "🧙‍♀️ می‌خوام طلسم عشق رو امتحان کنم 🫣", options: [{ text: "💋 نترس", action: "kiss" }, { text: "🧪 امتحان کن", action: "potion" }] },
            { text: "🧙‍♀️ تو می‌تونی اولین عشق من باشی", options: [{ text: "💋 باشم", action: "kiss" }, { text: "🤝 افتخار", action: "ally" }] }
        ],
        day4: [
            { text: "🧙‍♀️ طلسم عشق جواب داد 🫣", options: [{ text: "💋 دیوونه شو", action: "kiss" }, { text: "🔥 بکنم", action: "seduce" }] },
            { text: "🧙‍♀️ استادم اگه بفهمه", options: [{ text: "🤝 نمی‌فهمه", action: "ally" }, { text: "💋 مهم نیست", action: "kiss" }] }
        ],
        day5: [
            { text: "🧙‍♀️ دیگه شاگرد نیستم... زن تو هستم 💋", options: [{ text: "💋 زن من", action: "kiss" }, { text: "🔥 بیا", action: "seduce" }] },
            { text: "🧙‍♀️ برات معجون عشق درست کردم 🧪💋", options: [{ text: "🧪 بخوریم", action: "potion" }, { text: "💋 اول ببوس", action: "kiss" }] }
        ],
        day6: [
            { text: "🧙‍♀️ امروز جادوی عشق رو یادت می‌دم 🫣", options: [{ text: "🔥 از جلو", action: "seduce" }, { text: "🍑 از پشت", action: "seduce" }, { text: "👄 دهنی", action: "kiss" }] },
            { text: "🧙‍♀️ جادوی بدن قوی‌تر از کتاباست 🔥", options: [{ text: "🔥 جادو کن", action: "seduce" }, { text: "💋 آروم", action: "kiss" }] }
        ],
        day7: [
            { text: "🧙‍♀️ تا ابد شاگرد عشق تو 💋", options: [{ text: "💋 شاگردم", action: "kiss" }, { text: "👰 ازدواج", action: "propose" }] },
            { text: "🧙‍♀️ استاد عشق... تویی 💍🔥", options: [{ text: "💋 استادت", action: "kiss" }, { text: "👶 بچه جادوگر", action: "seduce" }] }
        ],
        harem: [
            { text: "🧙‍♀️ شوهرم... امروز یه طلسم جدید کشف کردم 🔮", options: [{ text: "🔮 نشون بده", action: "ally" }, { text: "💋 عالیه", action: "kiss" }] }
        ]
    },
    // ============ NPCهای جدید ============
    ghost_sexy: {
        day1: [
            { text: "👻 من کیم؟ چرا اینجام؟", options: [{ text: "🕯️ کمک", action: "help" }, { text: "💋 لمس کن", action: "seduce" }, { text: "🏃 فرار", action: "flee" }] },
            { text: "👻 تو منو می‌بینی؟ یعنی زنده‌ای؟", options: [{ text: "👂 آره", action: "listen" }, { text: "💋 آره", action: "seduce" }] }
        ],
        day2: [
            { text: "👻 دوباره اومدی... کسی رو دیدی شبیه من؟", options: [{ text: "👂 بگو", action: "listen" }, { text: "💋 تصاحب", action: "seduce" }] },
            { text: "👻 وقتی نزدیکمی یه حس عجیبی دارم", options: [{ text: "🖐️ لمس کن", action: "ally" }, { text: "💋 ببوس", action: "kiss" }] }
        ],
        day3: [
            { text: "👻 آره! من نگهبان گنج بودم!", options: [{ text: "💰 بگو", action: "treasure" }, { text: "💋 بوس", action: "kiss" }] },
            { text: "👻 بذار دستت رو بگیرم", options: [{ text: "🖐️ بگیر", action: "ally" }, { text: "💋 ببوس", action: "kiss" }] }
        ],
        day4: [
            { text: "👻 گنج که مال تو... حالا منو آزاد کن", options: [{ text: "🕊️ آزاد", action: "free" }, { text: "💋 پیشم بمون", action: "seduce" }] },
            { text: "👻 دیشب خواب دیدم زنده‌ام 💭", options: [{ text: "💋 منم همینطور", action: "kiss" }, { text: "🤝 دوست", action: "ally" }] }
        ],
        day5: [
            { text: "👻 بذار بغلت کنم 🫂💋", options: [{ text: "💋 بغلم کن", action: "kiss" }, { text: "🔥 بیشتر", action: "seduce" }] },
            { text: "👻 وقتی از توی بدنت رد میشم 🫣", options: [{ text: "🔥 رد شو", action: "seduce" }, { text: "💋 ببوس", action: "kiss" }] }
        ],
        day6: [
            { text: "👻 می‌خوام تا ابد توی وجودت باشم", options: [{ text: "🔥 از جلو", action: "seduce" }, { text: "🍑 از پشت", action: "seduce" }, { text: "👄 دهنی", action: "kiss" }] },
            { text: "👻 حتی مرگ هم جدایمون نمی‌کنه 🫣💋", options: [{ text: "💋 ببوس", action: "kiss" }, { text: "👰 ازدواج روحی", action: "propose" }] }
        ],
        day7: [
            { text: "👻 آزادم! هر وقت خواستی صدام کن", options: [{ text: "🎁 هدیه", action: "gift" }, { text: "💋 همدم", action: "seduce" }] },
            { text: "👻 هر شب میام توی بغلت 💭🔥", options: [{ text: "🔥 بیا", action: "seduce" }, { text: "💋 منتظرم", action: "kiss" }] }
        ],
        harem: [
            { text: "👻 شوهرم... امشب توی خوابت میام 💭", options: [{ text: "💭 بیا", action: "ally" }, { text: "💋 منتظرم", action: "kiss" }] }
        ]
    },
    wizard: {
        day1: [
            { text: "🧙‍♂️ من می‌دونم دنبال چی می‌گردی", options: [{ text: "🔮 طلسم", action: "potion" }, { text: "💋 شیفته", action: "seduce" }, { text: "🏃 فرار", action: "flee" }] },
            { text: "🧙‍♂️ قدرت زیاد می‌خوای؟", options: [{ text: "💰 می‌پردازم", action: "wealth" }, { text: "🗡️ نمی‌خوام", action: "fight" }] }
        ],
        day2: [
            { text: "🧙‍♂️ دوباره تو؟! هنوز زنده‌ای؟", options: [{ text: "💋 زنده‌ام", action: "seduce" }, { text: "🔮 طلسم", action: "potion" }] },
            { text: "🧙‍♂️ توی کریستالم دیدمت", options: [{ text: "👂 چی دیدی؟", action: "listen" }, { text: "💋 عاشقمی؟", action: "seduce" }] }
        ],
        day3: [
            { text: "🧙‍♂️ می‌تونم بهت قدرت بدم", options: [{ text: "🤝 چی کار کنم؟", action: "ally" }, { text: "💋 خودت رو می‌خوام", action: "seduce" }] },
            { text: "🧙‍♂️ جادوی من دنیا رو تغییر میده", options: [{ text: "🔮 یاد بده", action: "potion" }, { text: "💋 تغییر بده", action: "seduce" }] }
        ],
        day4: [
            { text: "🧙‍♂️ هیچکس مثل تو جادوی منو درک نکرده", options: [{ text: "💋 درک می‌کنم", action: "kiss" }, { text: "🤝 دوست", action: "ally" }] },
            { text: "🧙‍♂️ دلم می‌خواد جادوی عشق رو امتحان کنم 🫣", options: [{ text: "💋 امتحان کن", action: "kiss" }, { text: "🧪 باهم", action: "potion" }] }
        ],
        day5: [
            { text: "🧙‍♂️ قدرتم رو با تو تقسیم می‌کنم 💋", options: [{ text: "💋 ممنون", action: "kiss" }, { text: "⚔️ قدرت", action: "power" }] },
            { text: "🧙‍♂️ عاشقتم... این قوی‌ترین جادوی منه 🔮💋", options: [{ text: "💋 منم عاشقتم", action: "kiss" }, { text: "🔥 بیا", action: "seduce" }] }
        ],
        day6: [
            { text: "🧙‍♂️ امروز جادوی بدن رو تمرین می‌کنیم 🫣", options: [{ text: "🔥 از جلو", action: "seduce" }, { text: "🍑 از پشت", action: "seduce" }, { text: "👄 دهنی", action: "kiss" }] },
            { text: "🧙‍♂️ طلسم عشق قوی‌ترین طلسمه 🔥", options: [{ text: "🔥 طلسم کن", action: "seduce" }, { text: "💋 ببوس", action: "kiss" }] }
        ],
        day7: [
            { text: "🧙‍♂️ تا ابد جادوگر تو می‌مونم 💋", options: [{ text: "💋 تا ابد", action: "kiss" }, { text: "👰 ازدواج جادویی", action: "propose" }] },
            { text: "🧙‍♂️ آخرین طلسم... طلسم عشق ابدی 🔮💍", options: [{ text: "🔮 بزن", action: "potion" }, { text: "💋 ببوس", action: "kiss" }] }
        ],
        harem: [
            { text: "🧙‍♂️ شوهرم... برات یه کریستال جادویی پیدا کردم 🔮", options: [{ text: "🔮 ممنون", action: "gift" }, { text: "💋 بیا", action: "kiss" }] }
        ]
    }
};
    jester: {
        day1: [
            { text: "🎭 اگه بخندی جایزه داری، نخندی دو تا! 🤡", options: [{ text: "😂 می‌خندم", action: "gift" }, { text: "😐 نمی‌خندم", action: "fight" }] },
            { text: "🎭 شوخی کردم! فقط می‌خواستم ببینم زنده‌ای یا نه! 😂", options: [{ text: "😂 زنده‌ام", action: "ally" }, { text: "💋 خنده‌دار بود", action: "seduce" }] }
        ],
        day2: [
            { text: "🎭 امروز یه لطیفه جدید یاد گرفتم...", options: [{ text: "👂 بگو", action: "listen" }, { text: "😂 بگو", action: "gift" }] },
            { text: "🎭 می‌دونی چرا دلقک‌ها گریه نمی‌کنن؟", options: [{ text: "👂 چرا؟", action: "listen" }, { text: "💋 نمی‌دونم", action: "seduce" }] }
        ],
        day3: [
            { text: "🎭 پشت این نقاب یه قلب واقعی هست... 💔", options: [{ text: "💋 می‌دونم", action: "kiss" }, { text: "🤝 دروغه", action: "ally" }] },
            { text: "🎭 من فقط مردم رو می‌خندونم... ولی خودم...", options: [{ text: "💋 غمگینی؟", action: "kiss" }, { text: "🤝 چته؟", action: "ally" }] }
        ],
        day4: [
            { text: "🎭 تو تنها کسی هستی که منو جدی می‌گیری", options: [{ text: "💋 جدی‌ام", action: "kiss" }, { text: "🤝 آره", action: "ally" }] },
            { text: "🎭 می‌خوام بدون نقاب باشم... فقط برای تو 🫣", options: [{ text: "💋 بدون نقاب", action: "kiss" }, { text: "🔥 بیا", action: "seduce" }] }
        ],
        day5: [
            { text: "🎭 عاشق شدم... این دیگه شوخی نیست 💋", options: [{ text: "💋 جدیه", action: "kiss" }, { text: "😂 شوخیه", action: "gift" }] },
            { text: "🎭 می‌خوام تا ابد بخندونمت 💕", options: [{ text: "💋 بخندون", action: "kiss" }, { text: "🔥 بیا", action: "seduce" }] }
        ],
        day6: [
            { text: "🎭 امروز شوخی نداریم... فقط عشق 🫣", options: [{ text: "🔥 از جلو", action: "seduce" }, { text: "🍑 از پشت", action: "seduce" }, { text: "👄 دهنی", action: "kiss" }] },
            { text: "🎭 بهترین شوخی دنیا... عشق ماست 💋", options: [{ text: "💋 بهترین", action: "kiss" }, { text: "🔥 بکنم", action: "seduce" }] }
        ],
        day7: [
            { text: "🎭 تا ابد دلقک عاشق تو 🎭💋", options: [{ text: "💋 تا ابد", action: "kiss" }, { text: "👰 ازدواج", action: "propose" }] },
            { text: "🎭 آخرین شوخی... شوخی با سرنوشت 💍", options: [{ text: "💋 بذار", action: "kiss" }, { text: "🔥 بیا", action: "seduce" }] }
        ],
        harem: [
            { text: "🎭 شوهرم... امروز یه لطیفه جدید دارم 😂", options: [{ text: "😂 بگو", action: "listen" }, { text: "💋 بگو", action: "kiss" }] }
        ]
    },
    prince: {
        day1: [
            { text: "🤴 میدونی من کیم؟! شاهزاده‌ام!", options: [{ text: "🤝 کمک", action: "help" }, { text: "💰 گروگان", action: "fight" }, { text: "💋 تصاحب", action: "seduce" }] },
            { text: "🤴 از کاخ فرار کردم... نمی‌خوام برگردم", options: [{ text: "🤝 بمون", action: "ally" }, { text: "💋 پیشم بمون", action: "seduce" }] }
        ],
        day2: [
            { text: "🤴 اینجا از کاخ بهتره... آزادی دارم", options: [{ text: "🤝 خوشحالم", action: "ally" }, { text: "💋 خوشحالی", action: "seduce" }] },
            { text: "🤴 تو مثل بقیه نیستی... منو برای پول نمی‌خوای", options: [{ text: "💋 نمی‌خوام", action: "kiss" }, { text: "🤝 آره", action: "ally" }] }
        ],
        day3: [
            { text: "🤴 می‌تونم بهت لقب شوالیه بدم", options: [{ text: "⚔️ می‌خوام", action: "power" }, { text: "💋 چیز دیگه می‌خوام", action: "seduce" }] },
            { text: "🤴 کاخ پدرم پر از طلاست", options: [{ text: "💰 بگو کجاست", action: "treasure" }, { text: "💋 طلا نمی‌خوام", action: "seduce" }] }
        ],
        day4: [
            { text: "🤴 دلم برات تنگ شده... چرا دیر میای؟", options: [{ text: "💋 مشغول بودم", action: "kiss" }, { text: "🤝 گرفتار بودم", action: "ally" }] },
            { text: "🤴 می‌خوام یه روز برگردم کاخ... با تو", options: [{ text: "💋 با هم", action: "kiss" }, { text: "🤝 تنهایی", action: "ally" }] }
        ],
        day5: [
            { text: "🤴 عاشقتم... این اولین باره که اینو می‌گم 💋", options: [{ text: "💋 منم عاشقتم", action: "kiss" }, { text: "🔥 بیا", action: "seduce" }] },
            { text: "🤴 می‌خوام تاجم رو با تو تقسیم کنم 👑", options: [{ text: "👑 قبول", action: "propose" }, { text: "💋 فقط تو رو می‌خوام", action: "kiss" }] }
        ],
        day6: [
            { text: "🤴 امشب شاهزاده نیستم... فقط مال توام 🫣", options: [{ text: "🔥 از جلو", action: "seduce" }, { text: "🍑 از پشت", action: "seduce" }, { text: "👄 دهنی", action: "kiss" }] },
            { text: "🤴 توی قصر یادم دادن چطور عشق‌بازی کنم 💋", options: [{ text: "💋 نشون بده", action: "kiss" }, { text: "🔥 بکنم", action: "seduce" }] }
        ],
        day7: [
            { text: "🤴 تا ابد شاهزاده تو می‌مونم 💋", options: [{ text: "💋 تا ابد", action: "kiss" }, { text: "👰 ازدواج سلطنتی", action: "propose" }] },
            { text: "🤴 تاج و تخت برام مهم نیست... فقط تو 💍", options: [{ text: "💋 عاشقتم", action: "kiss" }, { text: "🔥 بیا", action: "seduce" }] }
        ],
        harem: [
            { text: "🤴 شوهرم... امروز می‌خوام برات برقصم 💃", options: [{ text: "💃 برقص", action: "ally" }, { text: "💋 بیا", action: "kiss" }] }
        ]
    },
    // ============ خدمتکاران ============
    sage: {
        day1: [
            { text: "🧙 سلام مسافر... آینده‌ات رو توی چشمات می‌بینم", options: [{ text: "🔮 فال بگیر", action: "fortune" }, { text: "💡 راهنمایی", action: "help" }] },
            { text: "🧙 حکمت باستانی رو می‌تونم بهت یاد بدم", options: [{ text: "📚 یاد بده", action: "help" }, { text: "💋 چیز دیگه", action: "seduce" }] }
        ],
        day2: [
            { text: "🧙 دوباره اومدی... سوال داری؟", options: [{ text: "🔮 فال", action: "fortune" }, { text: "💋 مشاوره", action: "seduce" }] },
            { text: "🧙 کتابای زیادی خوندم... ولی عشق رو نه", options: [{ text: "💋 یاد بدم", action: "kiss" }, { text: "📚 بخون", action: "help" }] }
        ],
        day3: [
            { text: "🧙 قلبم تند می‌زنه... این نشونه چیه؟", options: [{ text: "💋 عشقه", action: "kiss" }, { text: "🤝 استرس", action: "ally" }] },
            { text: "🧙 شاید کتابا همه چیز رو نگن", options: [{ text: "💋 عشق توی کتاب نیست", action: "seduce" }, { text: "📚 هست", action: "help" }] }
        ],
        day4: [
            { text: "🧙 می‌خوام بیشتر بدونم... درباره تو", options: [{ text: "💋 بپرس", action: "kiss" }, { text: "🤝 بگو", action: "ally" }] },
            { text: "🧙 عشق مثل یه معمای باستانیه", options: [{ text: "💋 حلش کن", action: "seduce" }, { text: "📚 تحقیق کن", action: "help" }] }
        ],
        day5: [
            { text: "🧙 فکر کنم عاشق شدم... 💋", options: [{ text: "💋 منم", action: "kiss" }, { text: "🤝 جدی؟", action: "ally" }] },
            { text: "🧙 می‌خوام بقیه عمرم رو با تو باشم", options: [{ text: "💋 بمون", action: "kiss" }, { text: "🔥 بیا", action: "seduce" }] }
        ],
        day6: [
            { text: "🧙 امروز می‌خوام چیز جدید یاد بدم 🫣", options: [{ text: "🔥 از جلو", action: "seduce" }, { text: "🍑 از پشت", action: "seduce" }, { text: "👄 دهنی", action: "kiss" }] },
            { text: "🧙 حکمت عشق... از همه کتابا مهم‌تره 🔥", options: [{ text: "🔥 یاد بده", action: "seduce" }, { text: "💋 ببوس", action: "kiss" }] }
        ],
        day7: [
            { text: "🧙 تا ابد حکیم تو می‌مونم 💋", options: [{ text: "💋 تا ابد", action: "kiss" }, { text: "👰 ازدواج", action: "propose" }] },
            { text: "🧙 آخرین درس... درس عشق 💍", options: [{ text: "💋 یاد بگیرم", action: "kiss" }, { text: "🔥 بیا", action: "seduce" }] }
        ]
    },
    farmer: {
        day1: [
            { text: "🧑‍🌾 سلام جوون! گرسنه‌ای؟ غذا دارم", options: [{ text: "🍖 بخرم", action: "trade" }, { text: "🤝 کمک", action: "help" }] },
            { text: "🧑‍🌾 امسال محصول خوبی داریم", options: [{ text: "🌾 عالیه", action: "ally" }, { text: "💰 می‌خرم", action: "trade" }] }
        ],
        day2: [
            { text: "🧑‍🌾 دوباره اومدی؟ بازم غذا می‌خوای؟", options: [{ text: "🍖 آره", action: "trade" }, { text: "💋 دیدن تو", action: "seduce" }] },
            { text: "🧑‍🌾 تنهایی کشاورزی سخته", options: [{ text: "🤝 کمک می‌کنم", action: "ally" }, { text: "💋 من هستم", action: "seduce" }] }
        ],
        day3: [
            { text: "🧑‍🌾 دلم می‌خواد یکی کنارم باشه", options: [{ text: "💋 من هستم", action: "kiss" }, { text: "🤝 دوست", action: "ally" }] },
            { text: "🧑‍🌾 فکر می‌کنم به تو... حتی موقع کار", options: [{ text: "💋 منم به تو", action: "kiss" }, { text: "🤝 عجیبه", action: "ally" }] }
        ],
        day4: [
            { text: "🧑‍🌾 شاید زندگی فقط کشاورزی نیست", options: [{ text: "💋 عشق هم هست", action: "seduce" }, { text: "🤝 چیه؟", action: "ally" }] },
            { text: "🧑‍🌾 دلم می‌خواد با تو باشم... 💋", options: [{ text: "💋 منم", action: "kiss" }, { text: "🤝 باش", action: "ally" }] }
        ],
        day5: [
            { text: "🧑‍🌾 عاشقتم... ساده و صادقانه 💋", options: [{ text: "💋 منم", action: "kiss" }, { text: "🔥 بیا", action: "seduce" }] },
            { text: "🧑‍🌾 می‌خوام تا ابد با تو باشم", options: [{ text: "💋 تا ابد", action: "kiss" }, { text: "👰 ازدواج", action: "propose" }] }
        ],
        day6: [
            { text: "🧑‍🌾 امشب می‌خوام بکارمت... مثل زمین 🫣", options: [{ text: "🔥 از جلو", action: "seduce" }, { text: "🍑 از پشت", action: "seduce" }, { text: "👄 دهنی", action: "kiss" }] },
            { text: "🧑‍🌾 بذر عشق رو بکاریم 🔥", options: [{ text: "🔥 بکار", action: "seduce" }, { text: "💋 آروم", action: "kiss" }] }
        ],
        day7: [
            { text: "🧑‍🌾 تا ابد کشاورز عاشق تو 💋", options: [{ text: "💋 تا ابد", action: "kiss" }, { text: "👶 بچه‌دار شیم", action: "seduce" }] },
            { text: "🧑‍🌾 محصول امسال... عشق ماست 💍", options: [{ text: "💋 قشنگه", action: "kiss" }, { text: "🔥 بیا", action: "seduce" }] }
        ]
    },
    blacksmith: {
        day1: [
            { text: "⚒️ به کارگاه من خوش اومدی! چی می‌خوای بسازی؟", options: [{ text: "🔨 ساخت", action: "craft" }, { text: "🤝 صحبت", action: "ally" }] },
            { text: "⚒️ بهترین شمشیرها رو من می‌سازم", options: [{ text: "⚔️ می‌خوام", action: "trade" }, { text: "💋 تحت تأثیرم", action: "seduce" }] }
        ],
        day2: [
            { text: "⚒️ بازم اومدی؟ می‌خوای یه چیز جدید بسازیم؟", options: [{ text: "🔨 آره", action: "craft" }, { text: "💋 چیز دیگه", action: "seduce" }] },
            { text: "⚒️ دستام قویه... ولی قلبم ضعیف", options: [{ text: "💋 قویش کن", action: "kiss" }, { text: "🤝 چرا؟", action: "ally" }] }
        ],
        day3: [
            { text: "⚒️ وقتی میای دلم گرم میشه... مثل کوره", options: [{ text: "💋 منم", action: "kiss" }, { text: "🤝 جالبه", action: "ally" }] },
            { text: "⚒️ شاید آهنگرا هم عاشق بشن", options: [{ text: "💋 حتماً", action: "seduce" }, { text: "🤝 شاید", action: "ally" }] }
        ],
        day4: [
            { text: "⚒️ دلم می‌خواد برات یه چیز خاص بسازم", options: [{ text: "💋 قلبم رو بساز", action: "seduce" }, { text: "⚔️ شمشیر", action: "craft" }] },
            { text: "⚒️ عشق مثل آهنگری می‌مونه... با حرارت", options: [{ text: "💋 حرارت داره", action: "kiss" }, { text: "🤝 آره", action: "ally" }] }
        ],
        day5: [
            { text: "⚒️ عاشقتم... محکم مثل فولاد 💋", options: [{ text: "💋 منم", action: "kiss" }, { text: "🔥 بیا", action: "seduce" }] },
            { text: "⚒️ می‌خوام تا ابد کنارت باشم", options: [{ text: "💋 بمون", action: "kiss" }, { text: "👰 ازدواج", action: "propose" }] }
        ],
        day6: [
            { text: "⚒️ امشب می‌خوام چکش‌کاریت کنم 🫣", options: [{ text: "🔥 از جلو", action: "seduce" }, { text: "🍑 از پشت", action: "seduce" }, { text: "👄 دهنی", action: "kiss" }] },
            { text: "⚒️ شکل دادن به عشق... مثل آهن گداخته 🔥", options: [{ text: "🔥 شکل بده", action: "seduce" }, { text: "💋 آروم", action: "kiss" }] }
        ],
        day7: [
            { text: "⚒️ تا ابد آهنگر تو می‌مونم 💋", options: [{ text: "💋 تا ابد", action: "kiss" }, { text: "👶 بچه‌دار شیم", action: "seduce" }] },
            { text: "⚒️ بهترین ساخته‌ام... عشق ماست 💍", options: [{ text: "💋 قشنگه", action: "kiss" }, { text: "🔥 بیا", action: "seduce" }] }
        ]
    },
    merchant: {
        day1: [
            { text: "🧑‍🌾 جنس دارم، جنس مرغوب! از شیراز آوردیم!", options: [{ text: "💰 خرید", action: "trade" }, { text: "🤝 تخفیف", action: "gift" }] },
            { text: "🧑‍🌾 بهترین قیمت بازار پیش منه", options: [{ text: "💰 چنده؟", action: "trade" }, { text: "💋 خودت چندی؟", action: "seduce" }] }
        ],
        day2: [
            { text: "🧑‍🌾 بازم اومدی؟ خریدار خوبی هستی", options: [{ text: "💰 خرید", action: "trade" }, { text: "💋 مشتری خاص", action: "seduce" }] },
            { text: "🧑‍🌾 تجارت فقط پول نیست... رابطه هم مهمه", options: [{ text: "💋 رابطه", action: "kiss" }, { text: "🤝 موافقم", action: "ally" }] }
        ],
        day3: [
            { text: "🧑‍🌾 بهت تخفیف می‌دم... چون خاصی", options: [{ text: "💰 ممنون", action: "trade" }, { text: "💋 چرا خاصم؟", action: "seduce" }] },
            { text: "🧑‍🌾 دلم می‌خواد یه معامله خاص بکنیم", options: [{ text: "💋 چه معامله‌ای؟", action: "kiss" }, { text: "💰 بگو", action: "trade" }] }
        ],
        day4: [
            { text: "🧑‍🌾 قلبم رو نمی‌تونم بفروشم... ولی به تو می‌دم", options: [{ text: "💋 می‌گیرم", action: "kiss" }, { text: "💰 چند؟", action: "trade" }] },
            { text: "🧑‍🌾 بهترین معامله عمرم... معامله عشق 💋", options: [{ text: "💋 موافقم", action: "seduce" }, { text: "🤝 امضا کن", action: "ally" }] }
        ],
        day5: [
            { text: "🧑‍🌾 عاشقتم... این از همه جنسام باارزش‌تره 💋", options: [{ text: "💋 منم", action: "kiss" }, { text: "🔥 بیا", action: "seduce" }] },
            { text: "🧑‍🌾 می‌خوام تا ابد شریک تجاریت باشم", options: [{ text: "💋 شریک زندگی", action: "kiss" }, { text: "👰 ازدواج", action: "propose" }] }
        ],
        day6: [
            { text: "🧑‍🌾 امشب می‌خوام حسابت رو برسم 🫣", options: [{ text: "🔥 از جلو", action: "seduce" }, { text: "🍑 از پشت", action: "seduce" }, { text: "👄 دهنی", action: "kiss" }] },
            { text: "🧑‍🌾 سود عشق... از همه سودا بیشتره 🔥", options: [{ text: "🔥 حساب کن", action: "seduce" }, { text: "💋 ببوس", action: "kiss" }] }
        ],
        day7: [
            { text: "🧑‍🌾 تا ابد تاجر عاشق تو 💋", options: [{ text: "💋 تا ابد", action: "kiss" }, { text: "👶 بچه‌دار شیم", action: "seduce" }] },
            { text: "🧑‍🌾 بهترین سرمایه‌ام... عشق توئه 💍", options: [{ text: "💋 باارزشه", action: "kiss" }, { text: "🔥 بیا", action: "seduce" }] }
        ]
    }
};
    // ============ خدمتکاران حرمسرا ============
    maid: {
        day1: [
            { text: "🧹 قربان... اتاقتون رو تمیز کردم...", options: [{ text: "🤝 ممنون", action: "ally" }, { text: "💋 نزدیک شو", action: "seduce" }] },
            { text: "🧹 خاکی نیست که نتونم پاکش کنم", options: [{ text: "🤝 خوبه", action: "ally" }, { text: "💋 غبار قلبم رو چی؟", action: "seduce" }] }
        ],
        day2: [
            { text: "🧹 قربان... بازم اینجایید؟ خوشحالم", options: [{ text: "💋 منم خوشحالم", action: "kiss" }, { text: "🤝 کار داری؟", action: "ally" }] },
            { text: "🧹 وقتی شما رو می‌بینم... دستام میلرزه", options: [{ text: "💋 چرا؟", action: "kiss" }, { text: "🤝 مریضی؟", action: "ally" }] }
        ],
        day3: [
            { text: "🧹 قربان... می‌تونم یه خواهش کنم؟", options: [{ text: "💋 بگو", action: "kiss" }, { text: "🤝 بگو", action: "ally" }] },
            { text: "🧹 دلم می‌خواد بیشتر از یه خدمتکار باشم", options: [{ text: "💋 باش", action: "seduce" }, { text: "🤝 چطور؟", action: "ally" }] }
        ],
        day4: [
            { text: "🧹 قربان... امشب هم می‌تونم بمونم؟ 🫣", options: [{ text: "💋 بمون", action: "kiss" }, { text: "🤝 نه", action: "ally" }] },
            { text: "🧹 حاضرم هر کاری براتون بکنم 💋", options: [{ text: "💋 هر کاری؟", action: "seduce" }, { text: "🤝 چه کاری؟", action: "ally" }] }
        ],
        day5: [
            { text: "🧹 قربان... عاشقتون شدم 💋", options: [{ text: "💋 منم", action: "kiss" }, { text: "🔥 بیا", action: "seduce" }] },
            { text: "🧹 می‌خوام تا ابد خدمتکارتون بمونم", options: [{ text: "💋 بمون", action: "kiss" }, { text: "👰 باش", action: "propose" }] }
        ],
        day6: [
            { text: "🧹 امروز می‌خوام خدمت ویژه بدم 🫣", options: [{ text: "🔥 از جلو", action: "seduce" }, { text: "🍑 از پشت", action: "seduce" }, { text: "👄 دهنی", action: "kiss" }] },
            { text: "🧹 تمیزکاری خاص... با زبون 🔥", options: [{ text: "🔥 تمیز کن", action: "seduce" }, { text: "💋 آروم", action: "kiss" }] }
        ],
        day7: [
            { text: "🧹 تا ابد کلفت عاشق شما 💋", options: [{ text: "💋 تا ابد", action: "kiss" }, { text: "👶 بچه‌دار شیم", action: "seduce" }] },
            { text: "🧹 خدمتکار همیشگی... و عاشق 💍", options: [{ text: "💋 عاشقمی", action: "kiss" }, { text: "🔥 بیا", action: "seduce" }] }
        ]
    },
    cook: {
        day1: [
            { text: "👩‍🍳 قربان... غذاتون حاضره...", options: [{ text: "🍖 بخورم", action: "ally" }, { text: "💋 تو چی می‌خوری؟", action: "seduce" }] },
            { text: "👩‍🍳 بهترین غذاها رو براتون می‌پزم", options: [{ text: "🤝 ممنون", action: "ally" }, { text: "💋 دسر چی داری؟", action: "seduce" }] }
        ],
        day2: [
            { text: "👩‍🍳 قربان... غذاتون رو با عشق پختم", options: [{ text: "💋 حس می‌کنم", action: "kiss" }, { text: "🤝 ممنون", action: "ally" }] },
            { text: "👩‍🍳 دلم می‌خواد فقط براتون آشپزی کنم", options: [{ text: "💋 فقط برای من", action: "seduce" }, { text: "🤝 خوبه", action: "ally" }] }
        ],
        day3: [
            { text: "👩‍🍳 قربان... امشب شام مخصوص داریم 🫣", options: [{ text: "🍖 چیه؟", action: "ally" }, { text: "💋 خودت چی؟", action: "seduce" }] },
            { text: "👩‍🍳 دلم می‌خواد دسر مخصوص هم باشم", options: [{ text: "💋 باش", action: "kiss" }, { text: "🤝 چه دسری؟", action: "ally" }] }
        ],
        day4: [
            { text: "👩‍🍳 قربان... عشق مثل آشپزیه...", options: [{ text: "💋 با حرارت", action: "kiss" }, { text: "🤝 توضیح بده", action: "ally" }] },
            { text: "👩‍🍳 دلم می‌خواد مواد مخصوص بهتون بدم 🫣", options: [{ text: "💋 بده", action: "seduce" }, { text: "🤝 چیه؟", action: "ally" }] }
        ],
        day5: [
            { text: "👩‍🍳 عاشقتون شدم... مثل عسل شیرین 💋", options: [{ text: "💋 منم", action: "kiss" }, { text: "🔥 بیا", action: "seduce" }] },
            { text: "👩‍🍳 می‌خوام تا ابد آشپزتون بمونم", options: [{ text: "💋 بمون", action: "kiss" }, { text: "👰 باش", action: "propose" }] }
        ],
        day6: [
            { text: "👩‍🍳 امروز غذای مخصوص... خودم 🫣", options: [{ text: "🔥 از جلو", action: "seduce" }, { text: "🍑 از پشت", action: "seduce" }, { text: "👄 دهنی", action: "kiss" }] },
            { text: "👩‍🍳 دسر مخصوص... با خامه 🔥", options: [{ text: "🔥 بخورم", action: "seduce" }, { text: "💋 آروم", action: "kiss" }] }
        ],
        day7: [
            { text: "👩‍🍳 تا ابد آشپز عاشق شما 💋", options: [{ text: "💋 تا ابد", action: "kiss" }, { text: "👶 بچه‌دار شیم", action: "seduce" }] },
            { text: "👩‍🍳 بهترین غذا... عشق ماست 💍", options: [{ text: "💋 خوشمزه‌ست", action: "kiss" }, { text: "🔥 بیا", action: "seduce" }] }
        ]
    },
    // ============ بقیه خدمتکاران با دیالوگ مشابه ============
    stylist: {
        day1: [{ text: "💇 قربان... موهاتون رو آرایش کنم؟", options: [{ text: "💇 آره", action: "ally" }, { text: "💋 اول ببوس", action: "seduce" }] }],
        day2: [{ text: "💇 قربان... امروز چهره‌تون می‌درخشه", options: [{ text: "💋 از عشقه", action: "kiss" }, { text: "🤝 ممنون", action: "ally" }] }],
        day3: [{ text: "💇 دلم می‌خواد فقط شما رو آرایش کنم 🫣", options: [{ text: "💋 فقط من", action: "seduce" }, { text: "🤝 چرا؟", action: "ally" }] }],
        day4: [{ text: "💇 قربان... دلم می‌خواد آرایش خاص بکنم 💋", options: [{ text: "💋 بکن", action: "kiss" }, { text: "🤝 چه آرایشی؟", action: "ally" }] }],
        day5: [{ text: "💇 عاشقتون شدم... 💋", options: [{ text: "💋 منم", action: "kiss" }, { text: "🔥 بیا", action: "seduce" }] }],
        day6: [{ text: "💇 امروز آرایش مخصوص... بدون لباس 🫣", options: [{ text: "🔥 از جلو", action: "seduce" }, { text: "🍑 از پشت", action: "seduce" }, { text: "👄 دهنی", action: "kiss" }] }],
        day7: [{ text: "💇 تا ابد آرایشگر عاشق شما 💋", options: [{ text: "💋 تا ابد", action: "kiss" }, { text: "👶 بچه‌دار شیم", action: "seduce" }] }]
    },
    tailor: {
        day1: [{ text: "👗 قربان... براتون لباس بدوزم؟", options: [{ text: "👗 آره", action: "ally" }, { text: "💋 اندازه بگیر", action: "seduce" }] }],
        day2: [{ text: "👗 قربان... اندامتون رو اندازه گرفتم", options: [{ text: "💋 خوبه", action: "kiss" }, { text: "🤝 ممنون", action: "ally" }] }],
        day3: [{ text: "👗 دلم می‌خواد فقط براتون بدوزم 🫣", options: [{ text: "💋 فقط برای من", action: "seduce" }, { text: "🤝 چرا؟", action: "ally" }] }],
        day4: [{ text: "👗 قربان... می‌خوام لباس خاص براتون بدوزم 💋", options: [{ text: "💋 بذوز", action: "kiss" }, { text: "🤝 چه لباسی؟", action: "ally" }] }],
        day5: [{ text: "👗 عاشقتون شدم... 💋", options: [{ text: "💋 منم", action: "kiss" }, { text: "🔥 بیا", action: "seduce" }] }],
        day6: [{ text: "👗 امروز لباس مخصوص... بدون پارچه 🫣", options: [{ text: "🔥 از جلو", action: "seduce" }, { text: "🍑 از پشت", action: "seduce" }, { text: "👄 دهنی", action: "kiss" }] }],
        day7: [{ text: "👗 تا ابد خیاط عاشق شما 💋", options: [{ text: "💋 تا ابد", action: "kiss" }, { text: "👶 بچه‌دار شیم", action: "seduce" }] }]
    },
    guard: {
        day1: [{ text: "🛡️ قربان... محافظت از شما وظیفه‌مه", options: [{ text: "🤝 ممنون", action: "ally" }, { text: "💋 فقط وظیفه‌ست؟", action: "seduce" }] }],
        day2: [{ text: "🛡️ قربان... جونم رو براتون می‌دم", options: [{ text: "💋 چرا؟", action: "kiss" }, { text: "🤝 وظیفه‌ست", action: "ally" }] }],
        day3: [{ text: "🛡️ دلم می‌خواد بیشتر از محافظ باشم 🫣", options: [{ text: "💋 باش", action: "seduce" }, { text: "🤝 چطور؟", action: "ally" }] }],
        day4: [{ text: "🛡️ قربان... می‌خوام شبانه‌روز محافظت کنم 💋", options: [{ text: "💋 محافظت کن", action: "kiss" }, { text: "🤝 شبم؟", action: "ally" }] }],
        day5: [{ text: "🛡️ عاشقتون شدم... 💋", options: [{ text: "💋 منم", action: "kiss" }, { text: "🔥 بیا", action: "seduce" }] }],
        day6: [{ text: "🛡️ امروز محافظت ویژه... بدون زره 🫣", options: [{ text: "🔥 از جلو", action: "seduce" }, { text: "🍑 از پشت", action: "seduce" }, { text: "👄 دهنی", action: "kiss" }] }],
        day7: [{ text: "🛡️ تا ابد محافظ عاشق شما 💋", options: [{ text: "💋 تا ابد", action: "kiss" }, { text: "👶 بچه‌دار شیم", action: "seduce" }] }]
    }
};

// ============ houseDialogues ============
const houseDialogues = {
    'invite_accept': ["🏠 اوکی بابا... میام خونه‌ات...", "🏠 بالاخره یه جای درست و حسابی..."],
    'invite_reject': ["😒 نه... حوصله ندارم...", "😒 شاید بعداً..."],
    'kick_angry': ["😡 منو بیرون می‌کنی؟!", "💀 پشیمون میشی..."],
    'touch': ["🖐️ دستت گرمه...", "🖐️ بیشتر لمس کن..."],
    'kiss': ["💋 ммm... لبات...", "💋 دوباره ببوس..."],
    'orgy': ["🔥 امروز چه شب وحشی‌ای بود...", "🔥 فوق‌العاده بود..."]
};

const marryDialogues = {
    'propose_accept': "💍 آره! هزار بار آره! مال تو شدم!",
    'propose_reject': "💍 نه... هنوز آماده نیستم...",
    'marry_text': "👰 امروز بهترین روز زندگیمه...",
    'divorce_text': "💔 تموم شد... رفتیم..."
};

const prisonDialogues = {
    witch: { wild: ["🧙‍♀️: گمشو بیرون!"], untrusted: ["🧙‍♀️: بازم اومدی؟!"], familiar: ["🧙‍♀️: دستت رو بده..."], intimate: ["🧙‍♀️: بیا نزدیک‌تر..."], tamed: ["🧙‍♀️: مال تو شدم... 💋"] }
};

const npcConfig = {
    witch: { emoji: '🧙‍♀️', startPoints: 15 }, vampire: { emoji: '🧛‍♀️', startPoints: 15 },
    fairy: { emoji: '🧚', startPoints: 20 }, angel: { emoji: '👼', startPoints: 20 },
    knight: { emoji: '⚔️', startPoints: 10 }, werewolf: { emoji: '🐺', startPoints: 5 },
    bride: { emoji: '👰', startPoints: 30 }, mermaid: { emoji: '🧜‍♀️', startPoints: 25 },
    skeleton: { emoji: '💀', startPoints: 30 }, bandit_female: { emoji: '🦹‍♀️', startPoints: 20 },
    singer: { emoji: '👩‍🎤', startPoints: 35 }, genie: { emoji: '🧝‍♀️', startPoints: 10 },
    young_witch: { emoji: '🧙‍♀️', startPoints: 20 }, ghost_sexy: { emoji: '👻', startPoints: 25 },
    wizard: { emoji: '🧙‍♂️', startPoints: 15 }, jester: { emoji: '🎭', startPoints: 30 },
    prince: { emoji: '🤴', startPoints: 15 }, sage: { emoji: '🧙', startPoints: 40 },
    farmer: { emoji: '🧑‍🌾', startPoints: 35 }, blacksmith: { emoji: '⚒️', startPoints: 30 },
    merchant: { emoji: '🧑‍🌾', startPoints: 35 }, maid: { emoji: '🧹', startPoints: 10 },
    cook: { emoji: '👩‍🍳', startPoints: 10 }, stylist: { emoji: '💇', startPoints: 10 },
    tailor: { emoji: '👗', startPoints: 10 }, guard: { emoji: '🛡️', startPoints: 15 }
};

function getDialogue(npcId, encounterCount) {
    try {
        if (!npcId) return null;
        const npcDialogues = dialogues[npcId];
        if (!npcDialogues) return null;
        const day = Math.min(7, Math.max(1, (encounterCount || 0) + 1));
        const dayKey = 'day' + day;
        const dayDialogues = npcDialogues[dayKey] || npcDialogues.day1;
        if (!dayDialogues || dayDialogues.length === 0) return null;
        const index = (encounterCount || 0) % dayDialogues.length;
        return dayDialogues[index] || dayDialogues[0];
    } catch (e) { return null; }
}

function getHaremDialogue(npcId) {
    try {
        if (!npcId) return null;
        const npcDialogues = dialogues[npcId];
        if (!npcDialogues || !npcDialogues.harem) return null;
        return npcDialogues.harem[Math.floor(Math.random() * npcDialogues.harem.length)];
    } catch (e) { return null; }
}

function getPrisonDialogue(npcId, relationLevel) {
    if (!npcId) return { text: "🤐 ...", level: "untrusted" };
    const npcDialogues = prisonDialogues[npcId] || prisonDialogues.witch;
    const level = relationLevel || "untrusted";
    const levelDialogues = npcDialogues[level] || npcDialogues.untrusted || ["🤐 ..."];
    const text = levelDialogues[Math.floor(Math.random() * levelDialogues.length)];
    return { text: text || "🤐 ...", level: level };
}

function getHouseDialogue(type, subType) {
    if (!type) return "🤐 ...";
    const key = subType ? `${type}_${subType}` : type;
    const d = houseDialogues[key] || houseDialogues[type];
    if (!d || !Array.isArray(d) || d.length === 0) return "🤐 ...";
    return d[Math.floor(Math.random() * d.length)];
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
        case 'seduce': player.hp = Math.min(player.maxHp || 100, (player.hp || 0) + 15); player.xp = (player.xp || 0) + 15; result.message = `💋 ${npc.emoji} تسلیم عشق تو شد!\n❤️ +۱۵ | ✨ +۱۵`; break;
        case 'flee': result.message = `🏃 فرار کردی...`; break;
        case 'heal': player.hp = player.maxHp || 100; result.message = `❤️ ${npc.emoji} شفات داد!`; break;
        case 'gift': player.inventory.gold = (player.inventory.gold || 0) + 20; result.message = `🎁 ${npc.emoji} ۲۰👑 داد!`; break;
        case 'kiss': player.hp = Math.min(player.maxHp || 100, (player.hp || 0) + 15); result.message = `😘 ${npc.emoji} بوسیدت! +۱۵❤️`; break;
        case 'wealth': player.inventory.gold = (player.inventory.gold || 0) + 30; result.message = `💰 ۳۰👑`; break;
        case 'power': player.attack = (player.attack || 5) + 5; result.message = `⚔️ +۵⚔️`; break;
        case 'ally': player.defense = (player.defense || 2) + 3; result.message = `🤝 +۳🛡️`; break;
        case 'trade': player.inventory.gold = (player.inventory.gold || 0) + 15; result.message = `🤝 +۱۵👑`; break;
        case 'potion': player.hp = Math.min(player.maxHp || 100, (player.hp || 0) + 40); result.message = `🧪 +۴۰❤️`; break;
        case 'help': player.xp = (player.xp || 0) + 15; result.message = `🤝 +۱۵✨`; break;
        case 'listen': player.xp = (player.xp || 0) + 10; result.message = `👂 +۱۰✨`; break;
        case 'treasure': player.inventory.gold = (player.inventory.gold || 0) + 50; result.message = `💰 +۵۰👑`; break;
        case 'free': player.xp = (player.xp || 0) + 30; result.message = `🕊️ +۳۰✨`; break;
        case 'craft': result.message = `🔨 برو به بخش ساخت‌وساز!`; break;
        case 'propose': player.inventory.ring = (player.inventory.ring || 0) + 1; result.message = `💍 +۱ حلقه`; break;
        case 'wish': player.inventory.wish = (player.inventory.wish || 0) + 1; result.message = `🔮 +۱ آرزو`; break;
        default: result.message = `🤔 منتظر تصمیم توئه...`;
    }
    return result;
}

module.exports = { 
    dialogues, prisonDialogues, houseDialogues, marryDialogues, npcConfig, 
    getDialogue, getHaremDialogue, getPrisonDialogue, getHouseDialogue, 
    getMarryDialogue, getNpcConfig, handleAction 
};