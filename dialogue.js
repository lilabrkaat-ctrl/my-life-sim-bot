const config = require('./config');

const dialogues = {
    witch: {
        day1: [
            { text: "🧙‍♀️ گمشو بیرون کصکش! قبل اینکه طلسمت کنم و کیرت رو بترکونم! 🔥", options: [{ text: "🗡️ حمله", action: "fight" }, { text: "💋 شیفته شو", action: "seduce" }, { text: "🏃 فرار", action: "flee" }] },
            { text: "🧙‍♀️ بوی کص و کون میاد... آدمیزاده یا حیوون؟!", options: [{ text: "🤝 آدمم", action: "ally" }, { text: "💋 شیفته‌ات شدم", action: "seduce" }, { text: "🏃 فرار", action: "flee" }] }
        ],
        day2: [
            { text: "🧙‍♀️ دوباره تو؟! می‌خوای بمیری کونی؟ اسکل شدی هر روز میای اینجا؟", options: [{ text: "🎁 هدیه دارم", action: "gift" }, { text: "💋 دلم برات تنگ شده", action: "seduce" }, { text: "🏃 فرار", action: "flee" }] },
            { text: "🧙‍♀️ دیشب توی خواب دیدمت... بازم اومدی؟ خب باشه...", options: [{ text: "👂 بگو", action: "listen" }, { text: "💋 بازم می‌خوام ببینمت", action: "seduce" }, { text: "🏃 فرار", action: "flee" }] }
        ],
        day3: [
            { text: "🧙‍♀️ بیا نزدیک... بذار بو کنم ببینم امروز با کی بودی...", options: [{ text: "🖐️ نزدیک شو", action: "ally" }, { text: "🎁 هدیه دارم", action: "gift" }, { text: "🔙 بعداً", action: "flee" }] },
            { text: "🧙‍♀️ دستام میلرزه... یا از عصبانیت یا از این که دلم می‌خواد ببینمت...", options: [{ text: "💋 عشق", action: "seduce" }, { text: "🤝 عصبانیت", action: "ally" }, { text: "🔙 نه", action: "flee" }] }
        ],
        day4: [
            { text: "🧙‍♀️ دیگه نمی‌تونم... اینقدر داغم که جادوهام خودبخود فعال میشن 💋", options: [{ text: "💋 ببوس", action: "kiss" }, { text: "🔥 بکنم", action: "seduce" }, { text: "🔙 بعداً", action: "flee" }] },
            { text: "🧙‍♀️ معجون عشق رو با هم بخوریم... بعدش هرکاری می‌خوای بکن 🧪🔥", options: [{ text: "🧪 بخوریم", action: "potion" }, { text: "💋 اول ببوس", action: "kiss" }, { text: "🔙 هیچکدوم", action: "flee" }] }
        ],
        day5: [
            { text: "🧙‍♀️ فقط تو می‌تونی آرومم کنی... با اون کیر جادوییت 🫣", options: [{ text: "💋 در آغوش بگیر", action: "kiss" }, { text: "🔥 بکنم", action: "seduce" }, { text: "🎁 هدیه", action: "gift" }] },
            { text: "🧙‍♀️ می‌خوام تا ابد کیرت رو بخورم 💍", options: [{ text: "👰 ازدواج کن", action: "propose" }, { text: "💋 اول ببوس", action: "kiss" }, { text: "🔙 بعداً", action: "flee" }] }
        ],
        day6: [
            { text: "🧙‍♀️ ارباب من... امروز چجور می‌خوای بکنی منو؟ 😈", options: [{ text: "🔥 از جلو (بارداری)", action: "seduce" }, { text: "🍑 از پشت (لذت)", action: "seduce" }, { text: "👄 دهنی", action: "kiss" }] },
            { text: "🧙‍♀️ برات یه معجون سکسی درست کردم... بکن منو با این؟ 🧪🔥", options: [{ text: "🧪 بکنم", action: "potion" }, { text: "💋 اول ببوس", action: "kiss" }, { text: "🔙 بعداً", action: "flee" }] }
        ],
        day7: [
            { text: "🧙‍♀️ تا آخر عمر حاضر نیستم از کیرت جدا شم 💍🔥", options: [{ text: "💋 ببوس", action: "kiss" }, { text: "🔥 بکنم وحشی", action: "seduce" }, { text: "👶 بچه‌دار شیم", action: "seduce" }] },
            { text: "🧙‍♀️ امروز می‌خوام رکورد بزنیم... ۷ بار پشت سر هم 😈", options: [{ text: "🔥 آماده‌ام", action: "seduce" }, { text: "💋 اول آروم", action: "kiss" }, { text: "🔙 امروز نه", action: "flee" }] }
        ],
        harem: [
            { text: "🧙‍♀️ شوهرم... امشب میای یا بازم باید جق بزنم؟ 🫣", options: [{ text: "🔥 میام", action: "seduce" }, { text: "🎁 اول هدیه", action: "gift" }, { text: "🔙 بعداً", action: "flee" }] },
            { text: "🧙‍♀️ دلم برات تنگ شده... اینقدر نرو پیش اون پری کوفتی 💔", options: [{ text: "💋 الان میام", action: "kiss" }, { text: "🤝 مشغول بودم", action: "ally" }, { text: "🔙 بعداً", action: "flee" }] },
            { text: "🧙‍♀️ بچه‌مون امروز لگد زد... فکر کنم جادوگر میشه 🤰", options: [{ text: "👶 عالیه!", action: "ally" }, { text: "💋 ببوس", action: "kiss" }, { text: "🎁 هدیه", action: "gift" }] }
        ]
    },
    vampire: {
        day1: [
            { text: "🧛‍♀️ گرسنمه فاحشه! خونتو می‌خورم!", options: [{ text: "🗡️ حمله", action: "fight" }, { text: "🩸 خون بده", action: "gift" }, { text: "💋 عشق", action: "seduce" }] },
            { text: "🧛‍♀️ ۳۰۰ ساله زندم... تو یه لقمه کوچیکی برام!", options: [{ text: "🗡️ بجنگ", action: "fight" }, { text: "💋 دسر خوشمزه", action: "seduce" }, { text: "🏃 فرار", action: "flee" }] }
        ],
        day2: [
            { text: "🧛‍♀️ بازم اومدی کصخل؟! خونتو بو می‌کشم...", options: [{ text: "🩸 بخور", action: "gift" }, { text: "💋 بو کن", action: "seduce" }, { text: "🏃 فرار", action: "flee" }] },
            { text: "🧛‍♀️ دیشب یه انسان رو خشک کردم... تو بعدی هستی!", options: [{ text: "🗡️ نمی‌ذارم", action: "fight" }, { text: "💋 منو نمی‌کشی", action: "seduce" }, { text: "🏃 فرار", action: "flee" }] }
        ],
        day3: [
            { text: "🧛‍♀️ مچ دستت رو بده... بذار نبضت رو حس کنم 😏", options: [{ text: "🖐️ بده", action: "ally" }, { text: "💋 ببوس", action: "kiss" }, { text: "🔙 بعداً", action: "flee" }] },
            { text: "🧛‍♀️ خون تو اعتیاد آورده... مثل شیشه می‌مونه...", options: [{ text: "🩸 بخور", action: "gift" }, { text: "💋 منم معتادتم", action: "seduce" }, { text: "🔙 نه", action: "flee" }] }
        ],
        day4: [
            { text: "🧛‍♀️ شاید نکشمت... شاید تبدیلت کنم به خون‌آشام... همدمم شی 🌑", options: [{ text: "🧛 تبدیل کن", action: "potion" }, { text: "💋 همدمت میشم", action: "seduce" }, { text: "🔙 بعداً", action: "flee" }] },
            { text: "🧛‍♀️ نمی‌خوام بکشمت... می‌خوام قرن‌ها بکنمت 💋🔥", options: [{ text: "💋 پیشم بمون", action: "kiss" }, { text: "🔥 بکنم", action: "seduce" }, { text: "🔙 بعداً", action: "flee" }] }
        ],
        day5: [
            { text: "🧛‍♀️ ۳۰۰ ساله عاشق نشدم... تو اولین و آخرینی 🩸💋", options: [{ text: "💋 منم عاشقتم", action: "kiss" }, { text: "🔥 بیا", action: "seduce" }, { text: "🎁 هدیه", action: "gift" }] },
            { text: "🧛‍♀️ بیا... با هم جاودانه شیم... خون هم رو بخوریم 💋", options: [{ text: "🩸 جاودانه", action: "potion" }, { text: "💋 ببوس", action: "kiss" }, { text: "🔙 بعداً", action: "flee" }] }
        ],
        day6: [
            { text: "🧛‍♀️ من خون‌آشام تو شدم... تا ابد... حالا بکن منو 💋", options: [{ text: "🔥 از جلو", action: "seduce" }, { text: "🍑 از پشت", action: "seduce" }, { text: "👄 دهنی", action: "kiss" }] },
            { text: "🧛‍♀️ هر شب میام سراغت... برای ارگاسم‌های چندگانه 🫣🔥", options: [{ text: "💋 بیا", action: "kiss" }, { text: "🔥 منتظرم", action: "seduce" }, { text: "🔙 بعداً", action: "flee" }] }
        ],
        day7: [
            { text: "🧛‍♀️ اگه بمیری... خودم زنده‌ات می‌کنم 💀💋", options: [{ text: "💋 نمی‌میرم", action: "kiss" }, { text: "👰 ازدواج", action: "propose" }, { text: "🔥 بیا", action: "seduce" }] },
            { text: "🧛‍♀️ تا ابد مال تو... حالا یا بمیر یا بکن 🧛‍♀️💋", options: [{ text: "💋 مال منی", action: "kiss" }, { text: "🔥 بکنم", action: "seduce" }, { text: "👶 بچه‌دار شیم", action: "seduce" }] }
        ],
        harem: [
            { text: "🧛‍♀️ شوهرم... امشب گرسنه‌ام... یا خون یا کیر 🩸🔥", options: [{ text: "🩸 خون", action: "gift" }, { text: "🔥 کیر", action: "seduce" }, { text: "🔙 بعداً", action: "flee" }] },
            { text: "🧛‍♀️ چرا انقدر دیر میای؟ بازم رفتی پیش اون گرگینه؟ 💔", options: [{ text: "💋 الان اومدم", action: "kiss" }, { text: "🤝 مشغول بودم", action: "ally" }, { text: "🔙 بعداً", action: "flee" }] }
        ]
    }
};
    fairy: {
    day1: [
        { text: "🧚 سلام خوشتیپ! ۳ تا آرزو داری... راستی کیرت هم جزو آرزوهاست؟ 😜", options: [{ text: "💎 ثروت", action: "wealth" }, { text: "⚔️ قدرت", action: "power" }, { text: "💋 عشق", action: "seduce" }] },
        { text: "🧚 هی قهرمان! پری‌ها چقدر شیطونن؟ 😈", options: [{ text: "💋 خیلی", action: "seduce" }, { text: "🤝 نمی‌دونم", action: "ally" }, { text: "🏃 فرار", action: "flee" }] }
    ],
    day2: [
        { text: "🧚 آرزوی دومت چیه؟ پول؟ قدرت؟ یا یه سکس سه‌نفره؟ 👯", options: [{ text: "💎 پول", action: "wealth" }, { text: "❤️ سلامتی", action: "heal" }, { text: "💋 سکس", action: "seduce" }] },
        { text: "🧚 دیشب توی گوشت آرزو خوندم... گفتم کاش این کونی بازم بیاد 💋", options: [{ text: "👂 چی گفتی؟", action: "listen" }, { text: "💋 عاشقمی؟", action: "seduce" }, { text: "🏃 فرار", action: "flee" }] }
    ],
    day3: [
        { text: "🧚 آرزوی سوم رو من انتخاب می‌کنم: سکس! 😜", options: [{ text: "💋 قبول", action: "seduce" }, { text: "🗡️ رد", action: "fight" }, { text: "🔙 بعداً", action: "flee" }] },
        { text: "🧚 آرزوی اول: ثروت، دوم: قدرت، سوم: من! راستی کاندوم داری؟ 😜💋", options: [{ text: "💋 سومی", action: "seduce" }, { text: "💰 اولی", action: "wealth" }, { text: "🔙 نه", action: "flee" }] }
    ],
    day4: [
        { text: "🧚 گرد جادویی دارم... هرچی بخوای میشه... حتی می‌تونم کیرت رو بزرگتر کنم 😏", options: [{ text: "💋 عشق", action: "seduce" }, { text: "⚔️ قدرت", action: "power" }, { text: "🔙 بعداً", action: "flee" }] },
        { text: "🧚 می‌دونی پری‌ها چجوری می‌بوسن؟ با زبون جادویی ✨💋", options: [{ text: "💋 نشون بده", action: "kiss" }, { text: "🤝 بگو", action: "listen" }, { text: "🔙 بعداً", action: "flee" }] }
    ],
    day5: [
        { text: "🧚 ۳ تا آرزو بکن... سومی رو من می‌گم: کیرت رو می‌خوام 🫣", options: [{ text: "💋 بگو", action: "seduce" }, { text: "🔮 خودم می‌گم", action: "wish" }, { text: "🎁 هدیه", action: "gift" }] },
        { text: "🧚 دیشب توی خوابم بودی... داشتیم وحشیانه... بعد بیدار شدم 🫣💔", options: [{ text: "💋 امشب واقعی", action: "kiss" }, { text: "🤝 حیف شد", action: "listen" }, { text: "🔙 بعداً", action: "flee" }] }
    ],
    day6: [
        { text: "🧚 پری‌ها عاشق نمیشن ولی من یه ذره شدم... یعنی کیرت جادو داره؟", options: [{ text: "🔥 از جلو", action: "seduce" }, { text: "🍑 از پشت", action: "seduce" }, { text: "👄 دهنی", action: "kiss" }] },
        { text: "🧚 جادوی من مال تو... همه چیزم... حتی بکارتم 💋✨", options: [{ text: "💋 ببوس", action: "kiss" }, { text: "🔥 بکنم", action: "seduce" }, { text: "🔙 بعداً", action: "flee" }] }
    ],
    day7: [
        { text: "🧚 باشه قبول... عاشق شدم... حالا بکن منو یا برو 💋😜", options: [{ text: "💋 می‌کنم", action: "kiss" }, { text: "👰 ازدواج", action: "propose" }, { text: "🔥 بکنم", action: "seduce" }] },
        { text: "🧚 هر آرزویی بکنی برآورده میشه... ولی آرزوی من فقط کیر توئه 🫣🔥", options: [{ text: "🔥 آرزوی عشق", action: "seduce" }, { text: "💰 آرزوی ثروت", action: "wealth" }, { text: "👶 بچه‌دار شیم", action: "seduce" }] }
    ],
    harem: [
        { text: "🧚 شوهرم... برات یه سورپرایز دارم! حدس بزن چی پوشیدم... هیچی! ✨", options: [{ text: "🔥 میام", action: "seduce" }, { text: "💋 بگو", action: "kiss" }, { text: "🔙 بعداً", action: "flee" }] },
        { text: "🧚 امروز توی باغ گلهای جادویی کاشتم... آدمو بی‌اختیار سکسی می‌کنن 🌸", options: [{ text: "🌿 بو کنم", action: "ally" }, { text: "💋 چه جالب", action: "kiss" }, { text: "🔥 امتحان کن", action: "seduce" }] }
    ]
},
    angel: {
        day1: [
            { text: "👼 نگران نباش مسافر... کمکت می‌کنم...", options: [{ text: "❤️ شفا", action: "heal" }, { text: "💋 ممنون", action: "seduce" }, { text: "🏃 فرار", action: "flee" }] },
            { text: "👼 من فرشته‌ام... نباید این حرفا رو بزنم...", options: [{ text: "👂 بگو", action: "listen" }, { text: "💋 ادامه بده", action: "seduce" }, { text: "🏃 فرار", action: "flee" }] }
        ],
        day2: [
            { text: "👼 دوباره زخمی شدی؟ بیا شفا بدم...", options: [{ text: "❤️ شفا", action: "heal" }, { text: "💋 ببوس", action: "seduce" }, { text: "🏃 فرار", action: "flee" }] },
            { text: "👼 خدا ببخشه... وقتی نگام می‌کنی بال‌هام میلرزه...", options: [{ text: "💋 جدی؟", action: "kiss" }, { text: "🤝 چرا؟", action: "listen" }, { text: "🏃 فرار", action: "flee" }] }
        ],
        day3: [
            { text: "👼 من نباید عاشق بشم... ولی نمی‌تونم...", options: [{ text: "💋 عشق ممنوعه", action: "seduce" }, { text: "👼 برو بهشت", action: "free" }, { text: "🔙 بعداً", action: "flee" }] },
            { text: "👼 این گناهه... ولی چرا اینقدر خوبه؟ 😳", options: [{ text: "💋 چون عشقه", action: "kiss" }, { text: "🤝 گناه نیست", action: "ally" }, { text: "🔙 نه", action: "flee" }] }
        ],
        day4: [
            { text: "👼 دیشب دعا می‌کردم ولی فکرم پیش تو بود... 🙏", options: [{ text: "💋 منم پیش تو بودم", action: "kiss" }, { text: "🤝 چی شد؟", action: "listen" }, { text: "🔙 بعداً", action: "flee" }] },
            { text: "👼 بذار بال‌هام رو لمس کنی...", options: [{ text: "🖐️ لمس کن", action: "ally" }, { text: "💋 ببوس", action: "kiss" }, { text: "🔙 بعداً", action: "flee" }] }
        ],
        day5: [
            { text: "👼 حاضرم بسوزم فقط یه بار بغلت کنم 🔥", options: [{ text: "💋 بغلم کن", action: "kiss" }, { text: "🤝 نمی‌خوام بسوزی", action: "ally" }, { text: "🎁 هدیه", action: "gift" }] },
            { text: "👼 لب‌هام میلرزه... بوسیدن چه حسی داره؟ 😳", options: [{ text: "💋 امتحان کن", action: "kiss" }, { text: "🤝 خوبه", action: "listen" }, { text: "🔙 بعداً", action: "flee" }] }
        ],
        day6: [
            { text: "👼 دیگه برام مهم نیست خدا چی می‌گه... 💋", options: [{ text: "🔥 از جلو", action: "seduce" }, { text: "🍑 از پشت", action: "seduce" }, { text: "👄 دهنی", action: "kiss" }] },
            { text: "👼 من سقوط کردم از آسمون برای تو... 👼💋", options: [{ text: "💋 ارزشش رو داشتی", action: "kiss" }, { text: "🔥 بکنم", action: "seduce" }, { text: "🔙 بعداً", action: "flee" }] }
        ],
        day7: [
            { text: "👼 حالا یه فرشته گناه‌کارم... مال توام 😈", options: [{ text: "💋 مال منی", action: "kiss" }, { text: "🔥 بیا", action: "seduce" }, { text: "👰 ازدواج آسمونی", action: "propose" }] },
            { text: "👼 هر شب به جای دعا... کیرت رو می‌بینم 🫣💋", options: [{ text: "💋 منم همینطور", action: "kiss" }, { text: "🔥 بکنم", action: "seduce" }, { text: "👶 بچه‌دار شیم", action: "seduce" }] }
        ],
        harem: [
            { text: "👼 شوهرم... برات دعا کردم امروز... 🙏", options: [{ text: "🔥 میام", action: "seduce" }, { text: "💋 بیا بغلم", action: "kiss" }, { text: "🔙 بعداً", action: "flee" }] },
            { text: "👼 خدا رو شکر که تو رو دارم... و کیرت رو 💕", options: [{ text: "💋 شکر", action: "kiss" }, { text: "🤝 همیشه", action: "ally" }, { text: "🔥 بیا", action: "seduce" }] }
        ]
    },
    knight: {
        day1: [
            { text: "⚔️ ای غریبه! شمشیرت رو بکش! یا اون یکی شمشیرت رو 😏", options: [{ text: "⚔️ می‌جنگم", action: "fight" }, { text: "🤝 دوست", action: "ally" }, { text: "🏃 فرار", action: "flee" }] },
            { text: "⚔️ فقط یه بار شکست خوردم اونم تو بودی!", options: [{ text: "⚔️ دوباره", action: "fight" }, { text: "💋 بیا", action: "kiss" }, { text: "🏃 فرار", action: "flee" }] }
        ],
        day2: [
            { text: "⚔️ دفعه قبل خوب جنگیدی... این دفعه آماده‌ترم", options: [{ text: "⚔️ بجنگ", action: "fight" }, { text: "💋 امتحان کن", action: "seduce" }, { text: "🏃 فرار", action: "flee" }] },
            { text: "⚔️ چرا هر روز میای؟ می‌خوای تحقیرم کنی؟", options: [{ text: "🤝 نه", action: "ally" }, { text: "💋 می‌خوام ببینمت", action: "seduce" }, { text: "🏃 فرار", action: "flee" }] }
        ],
        day3: [
            { text: "⚔️ شب‌ها به جنگیدن با تو فکر می‌کنم...", options: [{ text: "⚔️ بجنگیم", action: "fight" }, { text: "💋 منم به تو", action: "kiss" }, { text: "🔙 بعداً", action: "flee" }] },
            { text: "⚔️ زره‌ام رو درآوردم... سنگینه... خسته شدم", options: [{ text: "🖐️ بذار ببینم", action: "ally" }, { text: "💋 خوشتیپی", action: "seduce" }, { text: "🔙 بعداً", action: "flee" }] }
        ],
        day4: [
            { text: "⚔️ دستت قویه ولی ملایم... شاید آدم خوبی باشی", options: [{ text: "🖐️ لمس کن", action: "ally" }, { text: "💋 ببوس", action: "kiss" }, { text: "🔙 بعداً", action: "flee" }] },
            { text: "⚔️ می‌خوام یه نبرد دیگه... بدون اسلحه 😳", options: [{ text: "🔥 بیا", action: "seduce" }, { text: "💋 اول ببوس", action: "kiss" }, { text: "🔙 بعداً", action: "flee" }] }
        ],
        day5: [
            { text: "⚔️ تسلیم شدم... همه چیزم مال تو... حتی کونم 😳", options: [{ text: "💋 مال منی", action: "kiss" }, { text: "🔥 بکنم", action: "seduce" }, { text: "🎁 هدیه", action: "gift" }] },
            { text: "⚔️ زره‌ام بازه... دیگه دفاعی ندارم 🫣", options: [{ text: "🔥 از جلو", action: "seduce" }, { text: "🍑 از پشت", action: "seduce" }, { text: "👄 دهنی", action: "kiss" }] }
        ],
        day6: [
            { text: "⚔️ فقط تو می‌تونی منو شکست بدی... توی جنگ و توی تخت 💋", options: [{ text: "🔥 از جلو", action: "seduce" }, { text: "🍑 از پشت", action: "seduce" }, { text: "👄 دهنی", action: "kiss" }] },
            { text: "⚔️ من شوالیه‌ام... ولی برای تو یه کونی معمولی میشم 💋", options: [{ text: "💋 نه", action: "kiss" }, { text: "🔥 آره", action: "seduce" }, { text: "🤝 باش", action: "ally" }] }
        ],
        day7: [
            { text: "⚔️ شوالیه تو شدم... تا ابد ⚔️💋", options: [{ text: "💋 تا ابد", action: "kiss" }, { text: "👰 ازدواج", action: "propose" }, { text: "🔥 بیا", action: "seduce" }] },
            { text: "⚔️ هر شب منتظرتم... بدون زره... آماده برای جنگ 🔥", options: [{ text: "🔥 میام", action: "seduce" }, { text: "💋 منتظر باش", action: "kiss" }, { text: "👶 بچه‌دار شیم", action: "seduce" }] }
        ],
        harem: [
            { text: "⚔️ شوهرم... امروز تمرین داریم؟ 😏", options: [{ text: "⚔️ شمشیر", action: "fight" }, { text: "🔥 سکس", action: "seduce" }, { text: "💋 هردو", action: "kiss" }] }
        ]
    }
};
    werewolf: {
        day1: [
            { text: "🐺 غرررر! عقب برو کثافت! گازت می‌گیرم و تیکه تیکه‌ات می‌کنم!", options: [{ text: "🗡️ حمله", action: "fight" }, { text: "💋 آروم باش", action: "seduce" }, { text: "🏃 فرار", action: "flee" }] },
            { text: "🐺 ماه کامله... و من توی قفس... کیرم داره منفجر میشه", options: [{ text: "🔓 آزادت کنم", action: "free" }, { text: "💋 می‌خوام کمکت کنم", action: "seduce" }, { text: "🏃 فرار", action: "flee" }] }
        ],
        day2: [
            { text: "🐺 چرا انقدر نزدیک میشی؟... شام امشبمی یا عشق؟", options: [{ text: "🍖 غذا دارم", action: "gift" }, { text: "💋 عشق", action: "seduce" }, { text: "🏃 فرار", action: "flee" }] },
            { text: "🐺 دستت... گرمه... مثل خون تازه... یا مثل کیر داغ 😈", options: [{ text: "🖐️ لمس کن", action: "ally" }, { text: "💋 گرمه", action: "kiss" }, { text: "🏃 فرار", action: "flee" }] }
        ],
        day3: [
            { text: "🐺 وقتی میای... یه حسی بهم می‌گه... شکارت نکنم... بکنمت 😏", options: [{ text: "🤝 دوست", action: "ally" }, { text: "💋 بکن", action: "seduce" }, { text: "🔙 بعداً", action: "flee" }] },
            { text: "🐺 هیچکس تا حالا اینقدر نزدیک نشده بود...", options: [{ text: "🖐️ نزدیک‌تر", action: "ally" }, { text: "💋 ببوس", action: "kiss" }, { text: "🔙 بعداً", action: "flee" }] }
        ],
        day4: [
            { text: "🐺 دستاتو بذار رو صورتم... قبل اینکه تبدیل شی 🫣", options: [{ text: "🖐️ می‌ذارم", action: "ally" }, { text: "💋 ببوس", action: "kiss" }, { text: "🔙 بعداً", action: "flee" }] },
            { text: "🐺 می‌خوام تبدیلت کنم به گرگ... با هم شکار کنیم... بعدش سکس 😈", options: [{ text: "🐺 تبدیل کن", action: "potion" }, { text: "💋 با هم", action: "seduce" }, { text: "🔙 بعداً", action: "flee" }] }
        ],
        day5: [
            { text: "🐺 نمی‌دونم چیه... ولی وقتی نیستی... زوزه می‌کشم 🐺💔", options: [{ text: "💋 منم دلتنگ میشم", action: "kiss" }, { text: "🔥 بیا", action: "seduce" }, { text: "🎁 هدیه", action: "gift" }] },
            { text: "🐺 دیشب ماه کامل بود... به جای شکار... به کیر تو فکر می‌کردم 🌕", options: [{ text: "💋 عاشقی", action: "kiss" }, { text: "🔥 بکنم", action: "seduce" }, { text: "🔙 بعداً", action: "flee" }] }
        ],
        day6: [
            { text: "🐺 مال تو شدم... آلفای من... هر کاری بگی می‌کنم 🐺💋", options: [{ text: "🔥 از جلو", action: "seduce" }, { text: "🍑 از پشت", action: "seduce" }, { text: "👄 دهنی", action: "kiss" }] },
            { text: "🐺 بیا نزدیک‌تر... بذار گرمای کیرت رو حس کنم 🔥💋", options: [{ text: "🔥 حس کن", action: "seduce" }, { text: "💋 ببوس", action: "kiss" }, { text: "🔙 بعداً", action: "flee" }] }
        ],
        day7: [
            { text: "🐺 فقط تو می‌تونی آرومم کنی 🐺💋", options: [{ text: "💋 آروم باش", action: "kiss" }, { text: "👰 همدم همیشگی", action: "propose" }, { text: "🔥 بیا", action: "seduce" }] },
            { text: "🐺 تا ابد گرگ تو می‌مونم... وفادار و وحشی 🐺🔥", options: [{ text: "💋 تا ابد", action: "kiss" }, { text: "🔥 بکنم", action: "seduce" }, { text: "👶 بچه‌دار شیم", action: "seduce" }] }
        ],
        harem: [
            { text: "🐺 شوهرم... امشب ماه کامله... وحشی میشم 🌕🔥", options: [{ text: "🔥 وحشی شو", action: "seduce" }, { text: "💋 آروم باش", action: "kiss" }, { text: "🔙 بعداً", action: "flee" }] },
            { text: "🐺 دلم می‌خواد بریم شکار... بعدش سکس توی جنگل 🐺🗡️", options: [{ text: "🐺 بریم", action: "ally" }, { text: "💋 بمون", action: "kiss" }, { text: "🔥 بیا", action: "seduce" }] }
        ]
    },
    bride: {
        day1: [
            { text: "👰 من بدشانس‌ترین عروس دنیام... همه بهم خیانت کردن 💔", options: [{ text: "🤝 کمک", action: "help" }, { text: "💋 من خیانت نمی‌کنم", action: "seduce" }, { text: "🏃 فرار", action: "flee" }] },
            { text: "👰 از عروسی فرار کردم... نمی‌خوام با اون ازدواج کنم", options: [{ text: "💍 با من ازدواج کن", action: "propose" }, { text: "🤝 کمک", action: "help" }, { text: "🏃 فرار", action: "flee" }] }
        ],
        day2: [
            { text: "👰 تو هم مثل بقیه‌ای؟ می‌خوای منو برگردونی؟", options: [{ text: "🤝 نه", action: "ally" }, { text: "💋 می‌خوام پیشم بمونی", action: "seduce" }, { text: "🏃 فرار", action: "flee" }] },
            { text: "👰 چرا اینقدر بهم توجه می‌کنی؟ من لیاقت ندارم", options: [{ text: "💋 لیاقت داری", action: "kiss" }, { text: "🤝 داری", action: "ally" }, { text: "🏃 فرار", action: "flee" }] }
        ],
        day3: [
            { text: "👰 دیشب خواب دیدم با یه غریبه ازدواج کردم 🫣", options: [{ text: "💋 من بودم", action: "kiss" }, { text: "💍 ازدواج", action: "propose" }, { text: "🔙 بعداً", action: "flee" }] },
            { text: "👰 من از عشق فرار کردم... ولی انگار عشق دنبالمه", options: [{ text: "💋 عشق منم", action: "seduce" }, { text: "🤝 آروم باش", action: "ally" }, { text: "🔙 بعداً", action: "flee" }] }
        ],
        day4: [
            { text: "👰 دستت رو بده... ببینم حلقه داری؟ 💍", options: [{ text: "💍 دارم", action: "propose" }, { text: "🤝 ندارم", action: "ally" }, { text: "🔙 بعداً", action: "flee" }] },
            { text: "👰 اگه تو داماد بودی... فرار نمی‌کردم 🫣", options: [{ text: "💋 نمی‌کردی", action: "kiss" }, { text: "💍 دامادم", action: "propose" }, { text: "🔙 بعداً", action: "flee" }] }
        ],
        day5: [
            { text: "👰 من حاضرم دوباره عروسی کنم... با تو 💋", options: [{ text: "💍 عروسی", action: "propose" }, { text: "💋 ببوس", action: "kiss" }, { text: "🎁 هدیه", action: "gift" }] },
            { text: "👰 لباس عروسم هنوز تنمه... می‌خوای درش بیاری؟ 🫣🔥", options: [{ text: "🔥 درمیارم", action: "seduce" }, { text: "💋 اول ببوس", action: "kiss" }, { text: "🔙 بعداً", action: "flee" }] }
        ],
        day6: [
            { text: "👰 این دفعه... مطمئنم که فرار نمی‌کنم", options: [{ text: "🔥 از جلو", action: "seduce" }, { text: "🍑 از پشت", action: "seduce" }, { text: "👄 دهنی", action: "kiss" }] },
            { text: "👰 من عروس تو شدم... برای همیشه... حالا شب اوله 👰💋", options: [{ text: "💋 شب اول", action: "kiss" }, { text: "🔥 بکنم", action: "seduce" }, { text: "🔙 بعداً", action: "flee" }] }
        ],
        day7: [
            { text: "👰 هر شب با لباس عروسم منتظرتم... بدون لباس زیر 🫣🔥", options: [{ text: "🔥 میام", action: "seduce" }, { text: "💋 منتظر باش", action: "kiss" }, { text: "👶 بچه‌دار شیم", action: "seduce" }] },
            { text: "👰 بهترین تصمیم زندگیم... فرار نکردن از کیر تو 💋", options: [{ text: "💋 بهترینی", action: "kiss" }, { text: "🔥 بیا", action: "seduce" }, { text: "👰 ازدواج", action: "propose" }] }
        ],
        harem: [
            { text: "👰 شوهرم... امروز سالگرد آشناییمونه 💍", options: [{ text: "💍 مبارکه", action: "gift" }, { text: "🔥 جشن", action: "seduce" }, { text: "🔙 بعداً", action: "flee" }] },
            { text: "👰 برات یه لباس جدید دوختم... ولی زیرش هیچی نیست 👗", options: [{ text: "👗 بپوش", action: "ally" }, { text: "🔥 نشون بده", action: "seduce" }, { text: "💋 قشنگه", action: "kiss" }] }
        ]
    },
    mermaid: {
        day1: [
            { text: "🧜‍♀️ سلام مسافر... آواز منو شنیدی؟ یا فقط سینه‌هام رو دیدی؟ 😏", options: [{ text: "🎵 گوش کن", action: "listen" }, { text: "💋 هردو", action: "seduce" }, { text: "🏃 برو", action: "flee" }] },
            { text: "🧜‍♀️ می‌تونی آرزوت رو بگی... ولی آرزوی سکس توی آب هزینه‌اش بیشتره 😈", options: [{ text: "💋 عشق", action: "seduce" }, { text: "💰 ثروت", action: "wealth" }, { text: "🏃 برو", action: "flee" }] }
        ],
        day2: [
            { text: "🧜‍♀️ دوباره اومدی... دلت برام تنگ شده یا فقط هورنی شدی؟ 😏", options: [{ text: "💋 هردو", action: "kiss" }, { text: "🎵 آواز بخون", action: "listen" }, { text: "🏃 فرار", action: "flee" }] },
            { text: "🧜‍♀️ تو تنها انسانی که از من نمی‌ترسه...", options: [{ text: "💋 نمی‌ترسم", action: "seduce" }, { text: "🤝 دوستم", action: "ally" }, { text: "🏃 فرار", action: "flee" }] }
        ],
        day3: [
            { text: "🧜‍♀️ می‌خوای بیای زیر آب؟... جایی که هیچ‌کس نمی‌بینه 🫣", options: [{ text: "🔥 بیا", action: "seduce" }, { text: "💋 اول ببوس", action: "kiss" }, { text: "🔙 بعداً", action: "flee" }] },
            { text: "🧜‍♀️ آواز من جادو داره... می‌تونه شلوارت رو دربیاره", options: [{ text: "💋 امتحان کن", action: "kiss" }, { text: "🎵 بخون", action: "listen" }, { text: "🔙 بعداً", action: "flee" }] }
        ],
        day4: [
            { text: "🧜‍♀️ پری‌های دریایی عاشق نمی‌شن... ولی کیر تو مثل گنج می‌مونه 🫣", options: [{ text: "💋 عاشق شدی", action: "kiss" }, { text: "🤝 گنج", action: "listen" }, { text: "🔙 بعداً", action: "flee" }] },
            { text: "🧜‍♀️ دلم می‌خواد پا داشته باشم... تا بتونم دور کمرت پام رو حلقه کنم", options: [{ text: "💋 کنارمی", action: "kiss" }, { text: "🔮 آرزو کن", action: "wish" }, { text: "🔙 بعداً", action: "flee" }] }
        ],
        day5: [
            { text: "🧜‍♀️ تو متفاوتی... مثل بقیه humanها نیستی 💋", options: [{ text: "💋 عاشقتم", action: "kiss" }, { text: "🔥 بکنم", action: "seduce" }, { text: "🎁 هدیه", action: "gift" }] },
            { text: "🧜‍♀️ می‌خوام تا ابد با تو بمونم... توی دریا... سکس زیر آب 💋", options: [{ text: "💋 بمون", action: "kiss" }, { text: "👰 ازدواج دریایی", action: "propose" }, { text: "🔙 بعداً", action: "flee" }] }
        ],
        day6: [
            { text: "🧜‍♀️ امروز می‌خوام مال تو باشم... کاملاً 🫣", options: [{ text: "🔥 از جلو", action: "seduce" }, { text: "🍑 از پشت", action: "seduce" }, { text: "👄 دهنی", action: "kiss" }] },
            { text: "🧜‍♀️ هیچ‌کس نمی‌دونه زیر آب چه خبره 😈", options: [{ text: "🔥 بکنم", action: "seduce" }, { text: "💋 ببوس", action: "kiss" }, { text: "🔙 بعداً", action: "flee" }] }
        ],
        day7: [
            { text: "🧜‍♀️ تا ابد مال تو... توی دریا یا خشکی 💋", options: [{ text: "💋 مال منی", action: "kiss" }, { text: "👶 بچه پری", action: "seduce" }, { text: "👰 ازدواج", action: "propose" }] },
            { text: "🧜‍♀️ هر شب برات آواز می‌خونم... آواز سکسی 🎵💋", options: [{ text: "🎵 بخون", action: "listen" }, { text: "💋 ببوس", action: "kiss" }, { text: "🔥 بیا", action: "seduce" }] }
        ],
        harem: [
            { text: "🧜‍♀️ شوهرم... برات یه مروارید سیاه پیدا کردم 🦪", options: [{ text: "💎 ممنون", action: "gift" }, { text: "💋 بیا", action: "kiss" }, { text: "🔙 بعداً", action: "flee" }] },
            { text: "🧜‍♀️ دلم برای دریا تنگ شده... می‌خوام توی آب بکنیم 💙", options: [{ text: "🌊 بریم", action: "ally" }, { text: "💋 بیا", action: "kiss" }, { text: "🔥 بکنم", action: "seduce" }] }
        ]
    }
};
    skeleton: {
        day1: [
            { text: "💀 گوشت داری کثافت؟! گرسنمه! یا گوشت یا کیر رو می‌خورم", options: [{ text: "🍖 بده", action: "gift" }, { text: "🗡️ بجنگ", action: "fight" }, { text: "💋 عشق", action: "seduce" }] },
            { text: "💀 من زنده نیستم... ولی کیر تو رو که ببینم زنده میشم", options: [{ text: "🗡️ بجنگ", action: "fight" }, { text: "💋 زنده شو", action: "seduce" }, { text: "🏃 فرار", action: "flee" }] }
        ],
        day2: [
            { text: "💀 دیشب خواب دیدم گوشت دارم... گوشت کیر تو رو 🫣", options: [{ text: "👂 جدی؟", action: "listen" }, { text: "💋 می‌خوای؟", action: "seduce" }, { text: "🏃 فرار", action: "flee" }] },
            { text: "💀 استخونام... وقتی نزدیکمی... جیر جیر می‌کنن", options: [{ text: "🖐️ لمس کن", action: "ally" }, { text: "💋 خوشحالن", action: "kiss" }, { text: "🏃 فرار", action: "flee" }] }
        ],
        day3: [
            { text: "💀 قلب ندارم... ولی یه چیزی توی سینه‌م وایمیسته", options: [{ text: "💋 عشقه", action: "kiss" }, { text: "🤝 چیه؟", action: "listen" }, { text: "🔙 بعداً", action: "flee" }] },
            { text: "💀 شاید این دفعه نکشمت... شاید فقط بکنمت 😏", options: [{ text: "🤝 ممنون", action: "ally" }, { text: "💋 بکن", action: "seduce" }, { text: "🔙 بعداً", action: "flee" }] }
        ],
        day4: [
            { text: "💀 دستت رو بذار روی استخونام... قبل اینکه ارگاسم کنن 🫣", options: [{ text: "🖐️ می‌ذارم", action: "ally" }, { text: "💋 ارگاسم", action: "kiss" }, { text: "🔙 بعداً", action: "flee" }] },
            { text: "💀 وقتی تو هستی... حس می‌کنم زنده‌ام... مخصوصاً اون پایین 💋", options: [{ text: "💋 زنده‌ای", action: "kiss" }, { text: "🔥 حس کن", action: "seduce" }, { text: "🔙 بعداً", action: "flee" }] }
        ],
        day5: [
            { text: "💀 عاشق یه زنده شدم! کی فکرش رو می‌کرد؟! 💀💋", options: [{ text: "💋 منم عاشقتم", action: "kiss" }, { text: "🔥 بیا", action: "seduce" }, { text: "🎁 هدیه", action: "gift" }] },
            { text: "💀 گوشت می‌خوام... ولی فقط گوشت کیر تو 🫣😂💋", options: [{ text: "🔥 بخور", action: "seduce" }, { text: "💋 ببوس", action: "kiss" }, { text: "🔙 بعداً", action: "flee" }] }
        ],
        day6: [
            { text: "💀 هر شب برات می‌رقصم... استخونام به هم می‌خورن 💃🦴", options: [{ text: "🔥 از جلو", action: "seduce" }, { text: "🍑 از پشت", action: "seduce" }, { text: "👄 دهنی", action: "kiss" }] },
            { text: "💀 امروز می‌خوام زنده باشم... با کیر تو 🫣🔥", options: [{ text: "💋 زنده‌ای", action: "kiss" }, { text: "🔥 بکنم", action: "seduce" }, { text: "🔙 بعداً", action: "flee" }] }
        ],
        day7: [
            { text: "💀 تا ابد اسکلت عاشق تو... 💀💋", options: [{ text: "💋 تا ابد", action: "kiss" }, { text: "👰 ازدواج استخونی", action: "propose" }, { text: "🔥 بیا", action: "seduce" }] },
            { text: "💀 استخونام مال تو... هر سوراخم که می‌خوای 💋🔥", options: [{ text: "💋 مال منی", action: "kiss" }, { text: "🔥 بکنم", action: "seduce" }, { text: "👶 بچه‌دار شیم", action: "seduce" }] }
        ],
        harem: [
            { text: "💀 شوهرم... امروز یه استخون جدید پیدا کردم 🦴", options: [{ text: "🦴 جالبه", action: "ally" }, { text: "💋 بیا", action: "kiss" }, { text: "🔙 بعداً", action: "flee" }] }
        ]
    },
    bandit_female: {
        day1: [
            { text: "🦹‍♀️ پولتو بده جنده! یا پول یا کیرت رو می‌گیرم گرو", options: [{ text: "💰 بده", action: "trade" }, { text: "💋 عشق", action: "seduce" }, { text: "🗡️ حمله", action: "fight" }] },
            { text: "🦹‍♀️ من راهزنم کثافت! از هیچی نمی‌ترسم!", options: [{ text: "🗡️ بجنگ", action: "fight" }, { text: "💋 بترس", action: "seduce" }, { text: "🏃 فرار", action: "flee" }] }
        ],
        day2: [
            { text: "🦹‍♀️ هر روز میای اینجا... دلت می‌خوای منو ببینی یا بکنی؟", options: [{ text: "💋 هردو", action: "seduce" }, { text: "💰 پول", action: "trade" }, { text: "🏃 فرار", action: "flee" }] },
            { text: "🦹‍♀️ من دزدم... ولی دلم رو نمی‌تونم بدزدم... دزدیده شد", options: [{ text: "💋 دزدیدم", action: "kiss" }, { text: "🤝 نمی‌خوام", action: "ally" }, { text: "🏃 فرار", action: "flee" }] }
        ],
        day3: [
            { text: "🦹‍♀️ شاید تو بتونی منو عوض کنی... یا شاید من عوض کنم", options: [{ text: "🤝 عوض شو", action: "ally" }, { text: "💋 عوض کن", action: "seduce" }, { text: "🔙 بعداً", action: "flee" }] },
            { text: "🦹‍♀️ تو قلبم رو دزدیدی... ولی کیرت رو می‌خوام", options: [{ text: "💋 قلبم مال تو", action: "kiss" }, { text: "🤝 جبران کن", action: "ally" }, { text: "🔙 بعداً", action: "flee" }] }
        ],
        day4: [
            { text: "🦹‍♀️ اگه آزادم کنی... قول می‌دم فقط کیر تو رو بدزدم", options: [{ text: "🔓 آزاد", action: "free" }, { text: "💋 فقط منو بدزد", action: "seduce" }, { text: "🔙 بعداً", action: "flee" }] },
            { text: "🦹‍♀️ من راهزنم... ولی برای کیر تو... تسلیمم 💋", options: [{ text: "💋 تسلیم شو", action: "kiss" }, { text: "🔥 بکنم", action: "seduce" }, { text: "🔙 بعداً", action: "flee" }] }
        ],
        day5: [
            { text: "🦹‍♀️ تمام گنج‌هایی که دزدیدم... به پای کیر تو نمی‌رسن", options: [{ text: "💋 عاشقمی", action: "kiss" }, { text: "💰 گنجات کو", action: "trade" }, { text: "🎁 هدیه", action: "gift" }] },
            { text: "🦹‍♀️ بیا... این دفعه منو تو بدزد... و هرکاری می‌خوای بکن 🫣", options: [{ text: "🔥 می‌دزدم", action: "seduce" }, { text: "💋 اول ببوس", action: "kiss" }, { text: "🔙 بعداً", action: "flee" }] }
        ],
        day6: [
            { text: "🦹‍♀️ من دیگه دزد نیستم... فقط کیر تو رو می‌دزدم 💋", options: [{ text: "🔥 از جلو", action: "seduce" }, { text: "🍑 از پشت", action: "seduce" }, { text: "👄 دهنی", action: "kiss" }] },
            { text: "🦹‍♀️ بهترین گنج تویی... یا کیرت 💋🔥", options: [{ text: "💋 بهترینی", action: "kiss" }, { text: "🔥 بکنم", action: "seduce" }, { text: "🔙 بعداً", action: "flee" }] }
        ],
        day7: [
            { text: "🦹‍♀️ مال تو شدم... برای همیشه... حالا بکن یا بدزد 💋", options: [{ text: "💋 مال منی", action: "kiss" }, { text: "👰 ازدواج", action: "propose" }, { text: "🔥 بیا", action: "seduce" }] },
            { text: "🦹‍♀️ فقط عشق تو رو می‌دزدم... و کیرت رو 💋🔥", options: [{ text: "💋 بدزد", action: "kiss" }, { text: "🔥 بکنم", action: "seduce" }, { text: "👶 بچه‌دار شیم", action: "seduce" }] }
        ],
        harem: [
            { text: "🦹‍♀️ شوهرم... برات یه چیز دزدیدم... از خزانه خودت 🤫", options: [{ text: "💰 چیه؟", action: "gift" }, { text: "💋 ممنون", action: "kiss" }, { text: "🔙 بعداً", action: "flee" }] },
            { text: "🦹‍♀️ دلم می‌خواد دوباره دزدی کنم... ولی فقط کیر تو رو 🦹", options: [{ text: "🚫 نه", action: "ally" }, { text: "💋 بیا", action: "kiss" }, { text: "🔥 بکنم", action: "seduce" }] }
        ]
    },
    singer: {
        day1: [
            { text: "👩‍🎤 می‌خوای برات آواز بخونم؟ آوازام جوری میکنه که شلوارت خودبخود باز بشه 🎵", options: [{ text: "🎵 بخون", action: "listen" }, { text: "💋 عشق", action: "seduce" }, { text: "🏃 برو", action: "flee" }] },
            { text: "👩‍🎤 صدای من می‌تونه کیرت رو به ارگاسم برسونه بدون دست زدن", options: [{ text: "🎵 امتحان کن", action: "listen" }, { text: "💋 تسخیر شدم", action: "seduce" }, { text: "🏃 برو", action: "flee" }] }
        ],
        day2: [
            { text: "👩‍🎤 دیشب برات یه آهنگ سکسی نوشتم... می‌خوای بخونم یا عمل کنم؟", options: [{ text: "🎵 بخون", action: "listen" }, { text: "💋 عمل کن", action: "kiss" }, { text: "🏃 فرار", action: "flee" }] },
            { text: "👩‍🎤 وقتی می‌خونم... انگار همه دنیا مال منه... مخصوصاً کیر تو", options: [{ text: "🎵 بخون", action: "listen" }, { text: "💋 مال تو", action: "seduce" }, { text: "🏃 فرار", action: "flee" }] }
        ],
        day3: [
            { text: "👩‍🎤 می‌خوای برات خصوصی بخونم؟ توی اتاق... بدون لباس 🫣", options: [{ text: "🏠 بیا", action: "ally" }, { text: "💋 خصوصی", action: "seduce" }, { text: "🔙 بعداً", action: "flee" }] },
            { text: "👩‍🎤 آوازهای من می‌تونن عاشقت کنن... یا سکسی", options: [{ text: "💋 شدم", action: "kiss" }, { text: "🎵 بخون", action: "listen" }, { text: "🔙 بعداً", action: "flee" }] }
        ],
        day4: [
            { text: "👩‍🎤 هیچ‌کس مثل تو آواز منو درک نکرده... یا شاید کیر تو", options: [{ text: "💋 درک می‌کنم", action: "kiss" }, { text: "🎵 ادامه بده", action: "listen" }, { text: "🔙 بعداً", action: "flee" }] },
            { text: "👩‍🎤 دلم می‌خواد تا صبح برات بخونم... و بکنمت 💋🎵", options: [{ text: "🎵 بخون", action: "listen" }, { text: "💋 بکن", action: "seduce" }, { text: "🔙 بعداً", action: "flee" }] }
        ],
        day5: [
            { text: "👩‍🎤 عاشقتم... می‌خوام اینو توی آوازم بگم... یا با کونم 🎵💋", options: [{ text: "💋 بگو", action: "kiss" }, { text: "🎵 بخون", action: "listen" }, { text: "🎁 هدیه", action: "gift" }] },
            { text: "👩‍🎤 صدای من فقط برای توئه... کونم هم فقط برای تو 🔥", options: [{ text: "💋 برای من", action: "kiss" }, { text: "🔥 بیا", action: "seduce" }, { text: "🔙 بعداً", action: "flee" }] }
        ],
        day6: [
            { text: "👩‍🎤 امروز می‌خوام برات یه آواز خاص بخونم... آواز ارگاسم 🫣", options: [{ text: "🔥 از جلو", action: "seduce" }, { text: "🍑 از پشت", action: "seduce" }, { text: "👄 دهنی", action: "kiss" }] },
            { text: "👩‍🎤 موسیقی عشق... با ساز بدنمون... و کیر تو 🎵🔥", options: [{ text: "🔥 بزن", action: "seduce" }, { text: "💋 آروم", action: "kiss" }, { text: "🔙 بعداً", action: "flee" }] }
        ],
        day7: [
            { text: "👩‍🎤 تا ابد برات می‌خونم... و می‌کنمت 🎵💋", options: [{ text: "💋 تا ابد", action: "kiss" }, { text: "👰 ازدواج", action: "propose" }, { text: "🔥 بیا", action: "seduce" }] },
            { text: "👩‍🎤 آواز آخر... آواز عشق ابدی... و کیر ابدی 🎵💍", options: [{ text: "🎵 بخون", action: "listen" }, { text: "💋 ببوس", action: "kiss" }, { text: "👶 بچه‌دار شیم", action: "seduce" }] }
        ],
        harem: [
            { text: "👩‍🎤 شوهرم... برات یه آهنگ جدید نوشتم... آهنگ سکس 🎵", options: [{ text: "🎵 بخون", action: "listen" }, { text: "🔥 سکس", action: "seduce" }, { text: "🔙 بعداً", action: "flee" }] },
            { text: "👩‍🎤 امشب کنسرت خصوصی داریم... فقط برای تو 🎤", options: [{ text: "🎤 بیا", action: "ally" }, { text: "💋 منتظرم", action: "kiss" }, { text: "🔥 بکنم", action: "seduce" }] }
        ]
    }
};
    genie: {
        day1: [
            { text: "🧝‍♀️ آزادم کردی! ۳ تا آرزو می‌تونی بکنی... اگه آرزوی سکس کنی ۴ تا میشه 😈", options: [{ text: "💎 ثروت", action: "wealth" }, { text: "⚔️ قدرت", action: "power" }, { text: "💋 عشق", action: "seduce" }] },
            { text: "🧝‍♀️ من جن صحرام... هر آرزویی برآورده میشه... حتی سکس با دوتا جن", options: [{ text: "💋 عشق", action: "seduce" }, { text: "💰 پول", action: "wealth" }, { text: "🏃 فرار", action: "flee" }] }
        ],
        day2: [
            { text: "🧝‍♀️ آرزوی دومت چیه؟ اگه بازم سکس بگی نمی‌گم نه 😏", options: [{ text: "⚔️ قدرت", action: "power" }, { text: "💋 سکس", action: "seduce" }, { text: "🏃 فرار", action: "flee" }] },
            { text: "🧝‍♀️ می‌دونی جن‌ها چقدر قدرتمندن؟ می‌تونن کیرت رو نامرئی کنن 😂", options: [{ text: "👂 بگو", action: "listen" }, { text: "💋 نکن", action: "seduce" }, { text: "🏃 فرار", action: "flee" }] }
        ],
        day3: [
            { text: "🧝‍♀️ آرزوی سوم رو خودم انتخاب کنم؟ می‌خوام کیرت رو برای خودم 😈", options: [{ text: "💋 انتخاب کن", action: "seduce" }, { text: "🤝 باشه", action: "ally" }, { text: "🔙 بعداً", action: "flee" }] },
            { text: "🧝‍♀️ می‌تونم عشق رو واقعی کنم... یا فقط سکس رو 🫣", options: [{ text: "💋 عشق", action: "kiss" }, { text: "🔮 واقعی کن", action: "wish" }, { text: "🔙 بعداً", action: "flee" }] }
        ],
        day4: [
            { text: "🧝‍♀️ تا حالا عاشق نشدم... ولی کیر تو رو که دیدم... 💋", options: [{ text: "💋 عاشق شو", action: "kiss" }, { text: "🤝 چرا؟", action: "listen" }, { text: "🔙 بعداً", action: "flee" }] },
            { text: "🧝‍♀️ می‌خوام پیشت بمونم... نه به عنوان جن... به عنوان کلفت سکسی 🔥", options: [{ text: "💋 بمون", action: "kiss" }, { text: "🔥 کلفت", action: "seduce" }, { text: "🔙 بعداً", action: "flee" }] }
        ],
        day5: [
            { text: "🧝‍♀️ قدرتم رو فدای عشقت می‌کنم... ولی جادوی کیرت رو نه 💋", options: [{ text: "💋 نمی‌خوام", action: "kiss" }, { text: "🤝 فدا نکن", action: "ally" }, { text: "🎁 هدیه", action: "gift" }] },
            { text: "🧝‍♀️ ۱۰۰۰ ساله زنده‌ام... ولی این ۳ روز با کیر تو... بهترین عمرم بود 💋🔥", options: [{ text: "💋 عاشقتم", action: "kiss" }, { text: "🔥 بیا", action: "seduce" }, { text: "🔙 بعداً", action: "flee" }] }
        ],
        day6: [
            { text: "🧝‍♀️ امروز می‌خوام تمام جادوم رو برات استفاده کنم... جادوی سکس 🫣", options: [{ text: "🔥 از جلو", action: "seduce" }, { text: "🍑 از پشت", action: "seduce" }, { text: "👄 دهنی", action: "kiss" }] },
            { text: "🧝‍♀️ جادوی عشق قوی‌ترین جادوست... مخصوصاً با کیر تو 🔮💋", options: [{ text: "💋 جادو کن", action: "kiss" }, { text: "🔥 بکنم", action: "seduce" }, { text: "🔙 بعداً", action: "flee" }] }
        ],
        day7: [
            { text: "🧝‍♀️ تا ابد مال تو... جن یا human... با کیر یا بی کیر 💋", options: [{ text: "💋 مال منی", action: "kiss" }, { text: "👰 ازدواج", action: "propose" }, { text: "🔥 بیا", action: "seduce" }] },
            { text: "🧝‍♀️ آخرین آرزوم... می‌خوام تا ابد کیرت رو بخورم 💍🔥", options: [{ text: "💋 تا ابد", action: "kiss" }, { text: "🔥 بکنم", action: "seduce" }, { text: "👶 بچه جن", action: "seduce" }] }
        ],
        harem: [
            { text: "🧝‍♀️ شوهرم... امروز ۳ تا آرزو داری... ولی من ۴ تا می‌خوام 🔮", options: [{ text: "💋 آرزوی تو", action: "kiss" }, { text: "💰 ثروت", action: "wealth" }, { text: "🔙 بعداً", action: "flee" }] },
            { text: "🧝‍♀️ برات یه طلسم خوش‌شانسی درست کردم... برای سکس ✨", options: [{ text: "✨ ممنون", action: "ally" }, { text: "💋 عاشقتم", action: "kiss" }, { text: "🔥 امتحان کن", action: "seduce" }] }
        ]
    },
    young_witch: {
        day1: [
            { text: "🧙‍♀️ هنوز خیلی چیزا یاد نگرفتم... ولی ساک زدن رو بلدم 😏", options: [{ text: "🔮 طلسم", action: "potion" }, { text: "💋 عشق", action: "seduce" }, { text: "🏃 برو", action: "flee" }] },
            { text: "🧙‍♀️ من شاگرد جادوگرم... ولی توی سکس از استادم بهترم!", options: [{ text: "👂 بگو", action: "listen" }, { text: "💋 نشون بده", action: "seduce" }, { text: "🏃 برو", action: "flee" }] }
        ],
        day2: [
            { text: "🧙‍♀️ دیشب یه طلسم جدید یاد گرفتم... طلسم بزرگ کردن کیر 🧪", options: [{ text: "🧪 امتحان کن", action: "potion" }, { text: "💋 لازم نیست", action: "seduce" }, { text: "🏃 فرار", action: "flee" }] },
            { text: "🧙‍♀️ استادم می‌گه جادوگرا نباید عاشق بشن... ولی نگفت نباید بکنن 😈", options: [{ text: "💋 عاشق شو", action: "seduce" }, { text: "🤝 چرا؟", action: "listen" }, { text: "🏃 فرار", action: "flee" }] }
        ],
        day3: [
            { text: "🧙‍♀️ می‌خوام طلسم عشق رو امتحان کنم... یا شاید فقط کیرت رو 🫣", options: [{ text: "💋 نترس", action: "kiss" }, { text: "🧪 امتحان کن", action: "potion" }, { text: "🔙 بعداً", action: "flee" }] },
            { text: "🧙‍♀️ تو می‌تونی اولین عشق من باشی... یا اولین کسی که می‌کنه منو 💋", options: [{ text: "💋 باشم", action: "kiss" }, { text: "🤝 افتخار", action: "ally" }, { text: "🔙 بعداً", action: "flee" }] }
        ],
        day4: [
            { text: "🧙‍♀️ طلسم عشق جواب داد... الان دیوونه‌تم... یا دیوونه کیرت 🫣", options: [{ text: "💋 دیوونه شو", action: "kiss" }, { text: "🔥 بکنم", action: "seduce" }, { text: "🔙 بعداً", action: "flee" }] },
            { text: "🧙‍♀️ استادم اگه بفهمه عاشق شدم... می‌ندازتم بیرون؟", options: [{ text: "🤝 نمی‌فهمه", action: "ally" }, { text: "💋 مهم نیست", action: "kiss" }, { text: "🔙 بعداً", action: "flee" }] }
        ],
        day5: [
            { text: "🧙‍♀️ دیگه شاگرد نیستم... کون تو هستم 💋", options: [{ text: "💋 کون من", action: "kiss" }, { text: "🔥 بیا", action: "seduce" }, { text: "🎁 هدیه", action: "gift" }] },
            { text: "🧙‍♀️ برات یه معجون عشق درست کردم... از آب کیر خودت 🧪💋", options: [{ text: "🧪 بخوریم", action: "potion" }, { text: "💋 اول ببوس", action: "kiss" }, { text: "🔙 بعداً", action: "flee" }] }
        ],
        day6: [
            { text: "🧙‍♀️ امروز می‌خوام جادوی سکس رو کامل یادت بدم 🫣", options: [{ text: "🔥 از جلو", action: "seduce" }, { text: "🍑 از پشت", action: "seduce" }, { text: "👄 دهنی", action: "kiss" }] },
            { text: "🧙‍♀️ جادوی بدن قوی‌تر از جادوی کتاباست... مخصوصاً با کیر تو 🔥", options: [{ text: "🔥 جادو کن", action: "seduce" }, { text: "💋 آروم", action: "kiss" }, { text: "🔙 بعداً", action: "flee" }] }
        ],
        day7: [
            { text: "🧙‍♀️ تا ابد شاگرد عشق تو... یا کون تو 🧙‍♀️💋", options: [{ text: "💋 شاگردم", action: "kiss" }, { text: "👰 ازدواج", action: "propose" }, { text: "🔥 بیا", action: "seduce" }] },
            { text: "🧙‍♀️ استاد عشق... تویی... و کیرت 💍🔥", options: [{ text: "💋 استادت", action: "kiss" }, { text: "🔥 بکنم", action: "seduce" }, { text: "👶 بچه جادوگر", action: "seduce" }] }
        ],
        harem: [
            { text: "🧙‍♀️ شوهرم... امروز یه طلسم جدید کشف کردم... طلسم سکس نامحدود 🔮", options: [{ text: "🔮 نشون بده", action: "ally" }, { text: "🔥 امتحان کن", action: "seduce" }, { text: "🔙 بعداً", action: "flee" }] },
            { text: "🧙‍♀️ می‌خوام برات یه معجون مخصوص بسازم... معجون کیر آهنی 🧪", options: [{ text: "🧪 بساز", action: "potion" }, { text: "💋 ممنون", action: "kiss" }, { text: "🔥 بنوش", action: "seduce" }] }
        ]
    },
    ghost_sexy: {
        day1: [
            { text: "👻 من کیم؟ چرا اینجام؟ می‌تونم از توی بدنت رد بشم 🫣", options: [{ text: "🕯️ کمک", action: "help" }, { text: "💋 لمس کن", action: "seduce" }, { text: "🏃 فرار", action: "flee" }] },
            { text: "👻 تو منو می‌بینی؟ یعنی زنده‌ای؟ یا من مردم؟", options: [{ text: "👂 آره", action: "listen" }, { text: "💋 زنده‌ای", action: "seduce" }, { text: "🏃 فرار", action: "flee" }] }
        ],
        day2: [
            { text: "👻 دوباره اومدی... کسی رو دیدی شبیه من؟", options: [{ text: "👂 بگو", action: "listen" }, { text: "💋 تصاحب", action: "seduce" }, { text: "🏃 فرار", action: "flee" }] },
            { text: "👻 وقتی نزدیکمی یه حس عجیبی دارم... مثل زنده بودن", options: [{ text: "🖐️ لمس کن", action: "ally" }, { text: "💋 ببوس", action: "kiss" }, { text: "🏃 فرار", action: "flee" }] }
        ],
        day3: [
            { text: "👻 آره! من نگهبان گنج بودم! می‌خوای بگم کجاست؟", options: [{ text: "💰 بگو", action: "treasure" }, { text: "💋 بوس", action: "kiss" }, { text: "🔙 بعداً", action: "flee" }] },
            { text: "👻 بذار دستت رو بگیرم... قول می‌دم سردم نکنه 🫣", options: [{ text: "🖐️ بگیر", action: "ally" }, { text: "💋 ببوس", action: "kiss" }, { text: "🔙 بعداً", action: "flee" }] }
        ],
        day4: [
            { text: "👻 گنج که مال تو... حالا منو آزاد کن یا بکن 💋", options: [{ text: "🕊️ آزاد", action: "free" }, { text: "💋 پیشم بمون", action: "seduce" }, { text: "🔙 بعداً", action: "flee" }] },
            { text: "👻 دیشب خواب دیدم زنده‌ام... و تو کنارمی 💭", options: [{ text: "💋 منم همینطور", action: "kiss" }, { text: "🤝 دوست", action: "ally" }, { text: "🔙 بعداً", action: "flee" }] }
        ],
        day5: [
            { text: "👻 بذار بغلت کنم... برای اولین بار بعد مرگم 🫂💋", options: [{ text: "💋 بغلم کن", action: "kiss" }, { text: "🔥 بیشتر", action: "seduce" }, { text: "🎁 هدیه", action: "gift" }] },
            { text: "👻 وقتی از توی بدنت رد میشم... حس می‌کنم زنده‌ام 🫣🔥", options: [{ text: "🔥 رد شو", action: "seduce" }, { text: "💋 ببوس", action: "kiss" }, { text: "🔙 بعداً", action: "flee" }] }
        ],
        day6: [
            { text: "👻 می‌خوام تا ابد توی وجودت باشم...", options: [{ text: "🔥 از جلو", action: "seduce" }, { text: "🍑 از پشت", action: "seduce" }, { text: "👄 دهنی", action: "kiss" }] },
            { text: "👻 حتی مرگ هم جدایمون نمی‌کنه 🫣💋", options: [{ text: "💋 ببوس", action: "kiss" }, { text: "👰 ازدواج روحی", action: "propose" }, { text: "🔙 بعداً", action: "flee" }] }
        ],
        day7: [
            { text: "👻 آزادم! هر وقت خواستی صدام کن... برای سکس 💋", options: [{ text: "🎁 هدیه", action: "gift" }, { text: "💋 همدم", action: "seduce" }, { text: "🔥 بیا", action: "seduce" }] },
            { text: "👻 هر شب میام توی بغلت... تا صبح می‌مونم 💭🔥", options: [{ text: "🔥 بیا", action: "seduce" }, { text: "💋 منتظرم", action: "kiss" }, { text: "👶 روح بچه", action: "seduce" }] }
        ],
        harem: [
            { text: "👻 شوهرم... امشب توی خوابت میام... با لباس هیچی 💭", options: [{ text: "💭 بیا", action: "ally" }, { text: "💋 منتظرم", action: "kiss" }, { text: "🔥 زود بیا", action: "seduce" }] }
        ]
    }
};
    wizard: {
        day1: [
            { text: "🧙‍♂️ من می‌دونم دنبال چی می‌گردی... دنبال کص می‌گردی نه؟ 😏", options: [{ text: "🔮 طلسم", action: "potion" }, { text: "💋 شیفته", action: "seduce" }, { text: "🏃 فرار", action: "flee" }] },
            { text: "🧙‍♂️ قدرت زیاد می‌خوای؟ باید هزینه‌اش رو بدی... با کونت 💰", options: [{ text: "💰 می‌پردازم", action: "wealth" }, { text: "🗡️ نمی‌خوام", action: "fight" }, { text: "💋 باشه", action: "seduce" }] }
        ],
        day2: [
            { text: "🧙‍♂️ دوباره تو؟! هنوز زنده‌ای؟ پس کیرت قویه", options: [{ text: "💋 زنده‌ام", action: "seduce" }, { text: "🔮 طلسم", action: "potion" }, { text: "🏃 فرار", action: "flee" }] },
            { text: "🧙‍♂️ توی کریستالم دیدمت... با کی بودی دیشب؟ 😈", options: [{ text: "👂 چی دیدی؟", action: "listen" }, { text: "💋 عاشقمی؟", action: "seduce" }, { text: "🏃 فرار", action: "flee" }] }
        ],
        day3: [
            { text: "🧙‍♂️ می‌تونم بهت قدرت بدم... قدرت نامحدود... ولی باید بخوابی باهام", options: [{ text: "🤝 چی کار کنم؟", action: "ally" }, { text: "💋 می‌خوابم", action: "seduce" }, { text: "🔙 بعداً", action: "flee" }] },
            { text: "🧙‍♂️ جادوی من می‌تونه دنیا رو تغییر بده... یا کیرت رو بزرگتر کنه", options: [{ text: "🔮 یاد بده", action: "potion" }, { text: "💋 تغییر بده", action: "seduce" }, { text: "🔙 بعداً", action: "flee" }] }
        ],
        day4: [
            { text: "🧙‍♂️ هیچکس مثل تو جادوی منو درک نکرده... یا کیرم رو", options: [{ text: "💋 درک می‌کنم", action: "kiss" }, { text: "🤝 دوست", action: "ally" }, { text: "🔙 بعداً", action: "flee" }] },
            { text: "🧙‍♂️ دلم می‌خواد جادوی عشق رو امتحان کنم... با کیر تو 🫣", options: [{ text: "💋 امتحان کن", action: "kiss" }, { text: "🧪 باهم", action: "potion" }, { text: "🔙 بعداً", action: "flee" }] }
        ],
        day5: [
            { text: "🧙‍♂️ قدرتم رو با تو تقسیم می‌کنم... نصف کیرم برای تو 💋", options: [{ text: "💋 ممنون", action: "kiss" }, { text: "⚔️ قدرت", action: "power" }, { text: "🎁 هدیه", action: "gift" }] },
            { text: "🧙‍♂️ عاشقتم... این قوی‌ترین جادوی منه... جادوی کیر 🔮💋", options: [{ text: "💋 منم عاشقتم", action: "kiss" }, { text: "🔥 بیا", action: "seduce" }, { text: "🔙 بعداً", action: "flee" }] }
        ],
        day6: [
            { text: "🧙‍♂️ امروز جادوی بدن رو تمرین می‌کنیم... طلسم ارگاسم 🫣", options: [{ text: "🔥 از جلو", action: "seduce" }, { text: "🍑 از پشت", action: "seduce" }, { text: "👄 دهنی", action: "kiss" }] },
            { text: "🧙‍♂️ طلسم عشق... قوی‌ترین طلسمه... با کیر تو کامل میشه 🔥", options: [{ text: "🔥 طلسم کن", action: "seduce" }, { text: "💋 ببوس", action: "kiss" }, { text: "🔙 بعداً", action: "flee" }] }
        ],
        day7: [
            { text: "🧙‍♂️ تا ابد جادوگر تو می‌مونم... و کیر تو رو می‌خورم 💋", options: [{ text: "💋 تا ابد", action: "kiss" }, { text: "👰 ازدواج جادویی", action: "propose" }, { text: "🔥 بیا", action: "seduce" }] },
            { text: "🧙‍♂️ آخرین طلسم... طلسم عشق ابدی... با کیر جاودانه 🔮💍", options: [{ text: "🔮 بزن", action: "potion" }, { text: "💋 ببوس", action: "kiss" }, { text: "👶 بچه جادوگر", action: "seduce" }] }
        ],
        harem: [
            { text: "🧙‍♂️ شوهرم... برات یه کریستال جادویی پیدا کردم 🔮", options: [{ text: "🔮 ممنون", action: "gift" }, { text: "💋 بیا", action: "kiss" }, { text: "🔙 بعداً", action: "flee" }] }
        ]
    },
    jester: {
        day1: [
            { text: "🎭 اگه بخندی جایزه داری، نخندی کیرم رو می‌بینی! 🤡", options: [{ text: "😂 می‌خندم", action: "gift" }, { text: "😐 نمی‌خندم", action: "fight" }, { text: "💋 نشون بده", action: "seduce" }] },
            { text: "🎭 شوخی کردم کصخل! فقط می‌خواستم ببینم زنده‌ای یا نه! 😂", options: [{ text: "😂 زنده‌ام", action: "ally" }, { text: "💋 خنده‌دار بود", action: "seduce" }, { text: "🏃 فرار", action: "flee" }] }
        ],
        day2: [
            { text: "🎭 امروز یه لطیفه سکسی یاد گرفتم... می‌خوای بشنوی؟", options: [{ text: "👂 بگو", action: "listen" }, { text: "😂 بگو", action: "gift" }, { text: "💋 بگو", action: "seduce" }] },
            { text: "🎭 می‌دونی چرا دلقک‌ها گریه نمی‌کنن؟ چون کیر دارن!", options: [{ text: "👂 چرا؟", action: "listen" }, { text: "💋 نمی‌دونم", action: "seduce" }, { text: "😂 احمقانه‌ست", action: "gift" }] }
        ],
        day3: [
            { text: "🎭 پشت این نقاب یه قلب واقعی هست... و یه کیر واقعی 💔", options: [{ text: "💋 می‌دونم", action: "kiss" }, { text: "🤝 دروغه", action: "ally" }, { text: "🔙 بعداً", action: "flee" }] },
            { text: "🎭 من فقط مردم رو می‌خندونم... ولی خودم... گریه می‌کنم", options: [{ text: "💋 غمگینی؟", action: "kiss" }, { text: "🤝 چته؟", action: "ally" }, { text: "🔙 بعداً", action: "flee" }] }
        ],
        day4: [
            { text: "🎭 تو تنها کسی هستی که منو جدی می‌گیری... جدی بکن", options: [{ text: "💋 جدی‌ام", action: "kiss" }, { text: "🤝 آره", action: "ally" }, { text: "🔙 بعداً", action: "flee" }] },
            { text: "🎭 می‌خوام بدون نقاب باشم... فقط برای تو... بدون لباس 🫣", options: [{ text: "💋 بدون نقاب", action: "kiss" }, { text: "🔥 بیا", action: "seduce" }, { text: "🔙 بعداً", action: "flee" }] }
        ],
        day5: [
            { text: "🎭 عاشق شدم... این دیگه شوخی نیست... کیرم شاهد باشه 💋", options: [{ text: "💋 جدیه", action: "kiss" }, { text: "😂 شوخیه", action: "gift" }, { text: "🎁 هدیه", action: "gift" }] },
            { text: "🎭 می‌خوام تا ابد بخندونمت... و بکنمت 💕", options: [{ text: "💋 بخندون", action: "kiss" }, { text: "🔥 بیا", action: "seduce" }, { text: "🔙 بعداً", action: "flee" }] }
        ],
        day6: [
            { text: "🎭 امروز شوخی نداریم... فقط سکس... سکس وحشی 🫣", options: [{ text: "🔥 از جلو", action: "seduce" }, { text: "🍑 از پشت", action: "seduce" }, { text: "👄 دهنی", action: "kiss" }] },
            { text: "🎭 بهترین شوخی دنیا... عشق ماست... و کیر تو 💋", options: [{ text: "💋 بهترین", action: "kiss" }, { text: "🔥 بکنم", action: "seduce" }, { text: "🔙 بعداً", action: "flee" }] }
        ],
        day7: [
            { text: "🎭 تا ابد دلقک عاشق تو... و کون عاشق کیرت 🎭💋", options: [{ text: "💋 تا ابد", action: "kiss" }, { text: "👰 ازدواج", action: "propose" }, { text: "🔥 بیا", action: "seduce" }] },
            { text: "🎭 آخرین شوخی... شوخی با سرنوشت... و کیر 💍", options: [{ text: "💋 بذار", action: "kiss" }, { text: "🔥 بکنم", action: "seduce" }, { text: "👶 بچه‌دار شیم", action: "seduce" }] }
        ],
        harem: [
            { text: "🎭 شوهرم... امروز یه لطیفه سکسی دارم 😂", options: [{ text: "😂 بگو", action: "listen" }, { text: "💋 بگو", action: "kiss" }, { text: "🔙 بعداً", action: "flee" }] }
        ]
    },
    prince: {
        day1: [
            { text: "🤴 میدونی من کیم؟! شاهزاده‌ام! ولی الان یه کونی بیش نیستم", options: [{ text: "🤝 کمک", action: "help" }, { text: "💰 گروگان", action: "fight" }, { text: "💋 تصاحب", action: "seduce" }] },
            { text: "🤴 از کاخ فرار کردم... پدرم می‌خواست منو بده به یه پیرمرد", options: [{ text: "🤝 بمون", action: "ally" }, { text: "💋 پیشم بمون", action: "seduce" }, { text: "🏃 فرار", action: "flee" }] }
        ],
        day2: [
            { text: "🤴 اینجا از کاخ بهتره... اینجا کیر تو هست", options: [{ text: "🤝 خوشحالم", action: "ally" }, { text: "💋 خوشحالی", action: "seduce" }, { text: "🏃 فرار", action: "flee" }] },
            { text: "🤴 تو مثل بقیه نیستی... منو برای پول نمی‌خوای... برای کص", options: [{ text: "💋 نمی‌خوام", action: "kiss" }, { text: "🤝 آره", action: "ally" }, { text: "🏃 فرار", action: "flee" }] }
        ],
        day3: [
            { text: "🤴 می‌تونم بهت لقب شوالیه بدم... یا لقب بهترین کیر", options: [{ text: "⚔️ شوالیه", action: "power" }, { text: "💋 بهترین کیر", action: "seduce" }, { text: "🔙 بعداً", action: "flee" }] },
            { text: "🤴 کاخ پدرم پر از طلاست... ولی کیر تو باارزش‌تره", options: [{ text: "💰 بگو کجاست", action: "treasure" }, { text: "💋 طلا نمی‌خوام", action: "seduce" }, { text: "🔙 بعداً", action: "flee" }] }
        ],
        day4: [
            { text: "🤴 دلم برات تنگ شده... چرا دیر میای؟ داری می‌کنی یکی دیگه رو؟", options: [{ text: "💋 مشغول بودم", action: "kiss" }, { text: "🤝 گرفتار بودم", action: "ally" }, { text: "🔙 بعداً", action: "flee" }] },
            { text: "🤴 می‌خوام یه روز برگردم کاخ... و روی تخت سلطنتی بکنیم", options: [{ text: "💋 با هم", action: "kiss" }, { text: "🤝 تنهایی", action: "ally" }, { text: "🔙 بعداً", action: "flee" }] }
        ],
        day5: [
            { text: "🤴 عاشقتم... این اولین باره که اینو می‌گم... راستش اولین باره که عاشق میشم 💋", options: [{ text: "💋 منم عاشقتم", action: "kiss" }, { text: "🔥 بیا", action: "seduce" }, { text: "🎁 هدیه", action: "gift" }] },
            { text: "🤴 می‌خوام تاجم رو با تو تقسیم کنم... و تختم رو 👑", options: [{ text: "👑 قبول", action: "propose" }, { text: "💋 فقط تو رو می‌خوام", action: "kiss" }, { text: "🔙 بعداً", action: "flee" }] }
        ],
        day6: [
            { text: "🤴 امشب شاهزاده نیستم... فقط یه کونی هستم برای تو 🫣", options: [{ text: "🔥 از جلو", action: "seduce" }, { text: "🍑 از پشت", action: "seduce" }, { text: "👄 دهنی", action: "kiss" }] },
            { text: "🤴 توی قصر یادم دادن چطور عشق‌بازی کنم... سلیس و اشرافی 💋", options: [{ text: "💋 نشون بده", action: "kiss" }, { text: "🔥 بکنم", action: "seduce" }, { text: "🔙 بعداً", action: "flee" }] }
        ],
        day7: [
            { text: "🤴 تا ابد شاهزاده تو می‌مونم... و کون تو 💋", options: [{ text: "💋 تا ابد", action: "kiss" }, { text: "👰 ازدواج سلطنتی", action: "propose" }, { text: "🔥 بیا", action: "seduce" }] },
            { text: "🤴 تاج و تخت برام مهم نیست... فقط کیر تو مهمه 💍", options: [{ text: "💋 عاشقتم", action: "kiss" }, { text: "🔥 بکنم", action: "seduce" }, { text: "👶 بچه سلطنتی", action: "seduce" }] }
        ],
        harem: [
            { text: "🤴 شوهرم... امروز می‌خوام برات برقصم... رقص سکسی 💃", options: [{ text: "💃 برقص", action: "ally" }, { text: "💋 بیا", action: "kiss" }, { text: "🔥 بکنم", action: "seduce" }] }
        ]
    }
};
    sage: {
        day1: [
            { text: "🧙 سلام مسافر... آینده‌ات رو توی چشمات می‌بینم... یه کیر بزرگ می‌بینم 🔮", options: [{ text: "🔮 فال بگیر", action: "listen" }, { text: "💡 راهنمایی", action: "help" }, { text: "🏃 فرار", action: "flee" }] },
            { text: "🧙 حکمت باستانی رو می‌تونم بهت یاد بدم... یا سکس باستانی", options: [{ text: "📚 یاد بده", action: "help" }, { text: "💋 سکس", action: "seduce" }, { text: "🏃 فرار", action: "flee" }] }
        ],
        day2: [
            { text: "🧙 دوباره اومدی... سوال داری یا فقط هورنی شدی؟", options: [{ text: "🔮 فال", action: "listen" }, { text: "💋 هورنی", action: "seduce" }, { text: "🏃 فرار", action: "flee" }] },
            { text: "🧙 کتابای زیادی خوندم... ولی هیچکدوم درباره کیر تو نبود", options: [{ text: "💋 یاد بدم", action: "kiss" }, { text: "📚 بخون", action: "help" }, { text: "🏃 فرار", action: "flee" }] }
        ],
        day3: [
            { text: "🧙 قلبم تند می‌زنه... این نشونه چیه؟ عشق یا شهوت؟", options: [{ text: "💋 عشقه", action: "kiss" }, { text: "🤝 شهوت", action: "ally" }, { text: "🔙 بعداً", action: "flee" }] },
            { text: "🧙 شاید کتابا همه چیز رو نگن... مخصوصاً درباره سکس", options: [{ text: "💋 عشق توی کتاب نیست", action: "seduce" }, { text: "📚 هست", action: "help" }, { text: "🔙 بعداً", action: "flee" }] }
        ],
        day4: [
            { text: "🧙 می‌خوام بیشتر بدونم... درباره بدن تو... همه جاش", options: [{ text: "💋 بپرس", action: "kiss" }, { text: "🤝 بگو", action: "ally" }, { text: "🔙 بعداً", action: "flee" }] },
            { text: "🧙 عشق مثل یه معمای باستانیه... با کیر تو حل میشه", options: [{ text: "💋 حلش کن", action: "seduce" }, { text: "📚 تحقیق کن", action: "help" }, { text: "🔙 بعداً", action: "flee" }] }
        ],
        day5: [
            { text: "🧙 فکر کنم عاشق شدم... یا شاید عاشق کیرت 💋", options: [{ text: "💋 منم", action: "kiss" }, { text: "🤝 جدی؟", action: "ally" }, { text: "🎁 هدیه", action: "gift" }] },
            { text: "🧙 می‌خوام بقیه عمرم رو با تو باشم... و کیرت", options: [{ text: "💋 بمون", action: "kiss" }, { text: "🔥 بیا", action: "seduce" }, { text: "🔙 بعداً", action: "flee" }] }
        ],
        day6: [
            { text: "🧙 امروز می‌خوام چیز جدید یاد بدم... آموزش سکس 🫣", options: [{ text: "🔥 از جلو", action: "seduce" }, { text: "🍑 از پشت", action: "seduce" }, { text: "👄 دهنی", action: "kiss" }] },
            { text: "🧙 حکمت عشق... از همه کتابا مهم‌تره... و کیر تو 🔥", options: [{ text: "🔥 یاد بده", action: "seduce" }, { text: "💋 ببوس", action: "kiss" }, { text: "🔙 بعداً", action: "flee" }] }
        ],
        day7: [
            { text: "🧙 تا ابد حکیم تو می‌مونم... حکیم کیر 💋", options: [{ text: "💋 تا ابد", action: "kiss" }, { text: "👰 ازدواج", action: "propose" }, { text: "🔥 بیا", action: "seduce" }] },
            { text: "🧙 آخرین درس... درس عشق... و کیر 💍", options: [{ text: "💋 یاد بگیرم", action: "kiss" }, { text: "🔥 بکنم", action: "seduce" }, { text: "👶 بچه حکیم", action: "seduce" }] }
        ]
    },
    farmer: {
        day1: [
            { text: "🧑‍🌾 سلام جوون! گرسنه‌ای؟ غذا دارم... یا شاید چیز دیگه می‌خوای؟ 😏", options: [{ text: "🍖 بخرم", action: "trade" }, { text: "🤝 کمک", action: "help" }, { text: "💋 چیز دیگه", action: "seduce" }] },
            { text: "🧑‍🌾 امسال محصول خوبی داریم... خیار درشت و بادمجون", options: [{ text: "🌾 عالیه", action: "ally" }, { text: "💰 می‌خرم", action: "trade" }, { text: "💋 نشون بده", action: "seduce" }] }
        ],
        day2: [
            { text: "🧑‍🌾 دوباره اومدی؟ بازم غذا می‌خوای یا چیز دیگه؟", options: [{ text: "🍖 غذا", action: "trade" }, { text: "💋 چیز دیگه", action: "seduce" }, { text: "🏃 فرار", action: "flee" }] },
            { text: "🧑‍🌾 تنهایی کشاورزی سخته... دلم یه هم‌بستر می‌خواد", options: [{ text: "🤝 کمک می‌کنم", action: "ally" }, { text: "💋 هم‌بستر", action: "seduce" }, { text: "🏃 فرار", action: "flee" }] }
        ],
        day3: [
            { text: "🧑‍🌾 دلم می‌خواد یکی کنارم باشه... توی تخت", options: [{ text: "💋 من هستم", action: "kiss" }, { text: "🤝 دوست", action: "ally" }, { text: "🔙 بعداً", action: "flee" }] },
            { text: "🧑‍🌾 فکر می‌کنم به تو... حتی موقع شخم زدن", options: [{ text: "💋 منم به تو", action: "kiss" }, { text: "🤝 عجیبه", action: "ally" }, { text: "🔙 بعداً", action: "flee" }] }
        ],
        day4: [
            { text: "🧑‍🌾 شاید زندگی فقط کشاورزی نیست... شاید سکس هم هست", options: [{ text: "💋 عشق هم هست", action: "seduce" }, { text: "🤝 چیه؟", action: "ally" }, { text: "🔙 بعداً", action: "flee" }] },
            { text: "🧑‍🌾 دلم می‌خواد با تو باشم... توی مزرعه... بدون لباس 💋", options: [{ text: "💋 منم", action: "kiss" }, { text: "🤝 باش", action: "ally" }, { text: "🔙 بعداً", action: "flee" }] }
        ],
        day5: [
            { text: "🧑‍🌾 عاشقتم... ساده و صادقانه... مثل یه دهقان 💋", options: [{ text: "💋 منم", action: "kiss" }, { text: "🔥 بیا", action: "seduce" }, { text: "🎁 هدیه", action: "gift" }] },
            { text: "🧑‍🌾 می‌خوام تا ابد با تو باشم... و هر شب بکارمت", options: [{ text: "💋 تا ابد", action: "kiss" }, { text: "👰 ازدواج", action: "propose" }, { text: "🔙 بعداً", action: "flee" }] }
        ],
        day6: [
            { text: "🧑‍🌾 امشب می‌خوام بکارمت... مثل زمین گندم 🫣", options: [{ text: "🔥 از جلو", action: "seduce" }, { text: "🍑 از پشت", action: "seduce" }, { text: "👄 دهنی", action: "kiss" }] },
            { text: "🧑‍🌾 بذر عشق رو بکاریم... ببینیم چی درو می‌کنیم 🔥", options: [{ text: "🔥 بکار", action: "seduce" }, { text: "💋 آروم", action: "kiss" }, { text: "🔙 بعداً", action: "flee" }] }
        ],
        day7: [
            { text: "🧑‍🌾 تا ابد کشاورز عاشق تو... شخم‌زن حرفه‌ای 💋", options: [{ text: "💋 تا ابد", action: "kiss" }, { text: "👶 بچه‌دار شیم", action: "seduce" }, { text: "🔥 بیا", action: "seduce" }] },
            { text: "🧑‍🌾 محصول امسال... عشق ماست... و کیر تو 💍", options: [{ text: "💋 قشنگه", action: "kiss" }, { text: "🔥 بکنم", action: "seduce" }, { text: "👰 ازدواج", action: "propose" }] }
        ]
    },
    blacksmith: {
        day1: [
            { text: "⚒️ به کارگاه من خوش اومدی! چی می‌خوای بسازی؟ شمشیر یا کیر آهنی؟", options: [{ text: "🔨 ساخت", action: "craft" }, { text: "🤝 صحبت", action: "ally" }, { text: "💋 کیر", action: "seduce" }] },
            { text: "⚒️ بهترین شمشیرها رو من می‌سازم... و بهترین سکس", options: [{ text: "⚔️ شمشیر", action: "trade" }, { text: "💋 سکس", action: "seduce" }, { text: "🏃 فرار", action: "flee" }] }
        ],
        day2: [
            { text: "⚒️ بازم اومدی؟ می‌خوای یه چیز جدید بسازیم؟ مثل عشق", options: [{ text: "🔨 آره", action: "craft" }, { text: "💋 عشق", action: "seduce" }, { text: "🏃 فرار", action: "flee" }] },
            { text: "⚒️ دستام قویه... از کار با چکش... می‌تونی تصور کنی با کیر چی کار می‌کنم؟", options: [{ text: "💋 نشون بده", action: "kiss" }, { text: "🤝 بگو", action: "ally" }, { text: "🏃 فرار", action: "flee" }] }
        ],
        day3: [
            { text: "⚒️ وقتی میای دلم گرم میشه... مثل کوره آهنگری", options: [{ text: "💋 منم", action: "kiss" }, { text: "🤝 جالبه", action: "ally" }, { text: "🔙 بعداً", action: "flee" }] },
            { text: "⚒️ شاید آهنگرا هم عاشق بشن... و سکس وحشی", options: [{ text: "💋 حتماً", action: "seduce" }, { text: "🤝 شاید", action: "ally" }, { text: "🔙 بعداً", action: "flee" }] }
        ],
        day4: [
            { text: "⚒️ دلم می‌خواد برات یه چیز خاص بسازم... یه کیر آهنی", options: [{ text: "💋 قلبم رو بساز", action: "seduce" }, { text: "⚔️ شمشیر", action: "craft" }, { text: "🔙 بعداً", action: "flee" }] },
            { text: "⚒️ عشق مثل آهنگری می‌مونه... با حرارت و ضربه", options: [{ text: "💋 حرارت داره", action: "kiss" }, { text: "🤝 آره", action: "ally" }, { text: "🔙 بعداً", action: "flee" }] }
        ],
        day5: [
            { text: "⚒️ عاشقتم... محکم مثل فولاد 💋", options: [{ text: "💋 منم", action: "kiss" }, { text: "🔥 بیا", action: "seduce" }, { text: "🎁 هدیه", action: "gift" }] },
            { text: "⚒️ می‌خوام تا ابد کنارت باشم... و چکش‌کاریت کنم", options: [{ text: "💋 بمون", action: "kiss" }, { text: "👰 ازدواج", action: "propose" }, { text: "🔙 بعداً", action: "flee" }] }
        ],
        day6: [
            { text: "⚒️ امشب می‌خوام چکش‌کاریت کنم... از جلو و پشت 🫣", options: [{ text: "🔥 از جلو", action: "seduce" }, { text: "🍑 از پشت", action: "seduce" }, { text: "👄 دهنی", action: "kiss" }] },
            { text: "⚒️ شکل دادن به عشق... مثل آهن گداخته 🔥", options: [{ text: "🔥 شکل بده", action: "seduce" }, { text: "💋 آروم", action: "kiss" }, { text: "🔙 بعداً", action: "flee" }] }
        ],
        day7: [
            { text: "⚒️ تا ابد آهنگر تو می‌مونم... آهنگر کیر 💋", options: [{ text: "💋 تا ابد", action: "kiss" }, { text: "👶 بچه‌دار شیم", action: "seduce" }, { text: "🔥 بیا", action: "seduce" }] },
            { text: "⚒️ بهترین ساخته‌ام... عشق ماست... و کیر تو 💍", options: [{ text: "💋 قشنگه", action: "kiss" }, { text: "🔥 بکنم", action: "seduce" }, { text: "👰 ازدواج", action: "propose" }] }
        ]
    }
};
    merchant: {
        day1: [
            { text: "🧑‍🌾 جنس دارم، جنس مرغوب! از شیراز آوردیم! یا شاید خودم رو می‌خوای؟ 😏", options: [{ text: "💰 خرید", action: "trade" }, { text: "🤝 تخفیف", action: "gift" }, { text: "💋 خودت", action: "seduce" }] },
            { text: "🧑‍🌾 بهترین قیمت بازار پیش منه... قیمت سکس هم مناسب", options: [{ text: "💰 چنده؟", action: "trade" }, { text: "💋 خودت چندی؟", action: "seduce" }, { text: "🏃 فرار", action: "flee" }] }
        ],
        day2: [
            { text: "🧑‍🌾 بازم اومدی؟ خریدار خوبی هستی... یا مشتری خاص؟", options: [{ text: "💰 خرید", action: "trade" }, { text: "💋 مشتری خاص", action: "seduce" }, { text: "🏃 فرار", action: "flee" }] },
            { text: "🧑‍🌾 تجارت فقط پول نیست... رابطه هم مهمه... رابطه جنسی", options: [{ text: "💋 رابطه", action: "kiss" }, { text: "🤝 موافقم", action: "ally" }, { text: "🏃 فرار", action: "flee" }] }
        ],
        day3: [
            { text: "🧑‍🌾 بهت تخفیف می‌دم... چون خاصی... توی تخت هم خاصی؟", options: [{ text: "💰 ممنون", action: "trade" }, { text: "💋 چرا خاصم؟", action: "seduce" }, { text: "🔙 بعداً", action: "flee" }] },
            { text: "🧑‍🌾 دلم می‌خواد یه معامله خاص بکنیم... معامله سکس", options: [{ text: "💋 چه معامله‌ای؟", action: "kiss" }, { text: "💰 بگو", action: "trade" }, { text: "🔙 بعداً", action: "flee" }] }
        ],
        day4: [
            { text: "🧑‍🌾 قلبم رو نمی‌تونم بفروشم... ولی کونم رو می‌دم", options: [{ text: "💋 می‌گیرم", action: "kiss" }, { text: "💰 چند؟", action: "trade" }, { text: "🔙 بعداً", action: "flee" }] },
            { text: "🧑‍🌾 بهترین معامله عمرم... معامله عشق و کیر 💋", options: [{ text: "💋 موافقم", action: "seduce" }, { text: "🤝 امضا کن", action: "ally" }, { text: "🔙 بعداً", action: "flee" }] }
        ],
        day5: [
            { text: "🧑‍🌾 عاشقتم... این از همه جنسام باارزش‌تره 💋", options: [{ text: "💋 منم", action: "kiss" }, { text: "🔥 بیا", action: "seduce" }, { text: "🎁 هدیه", action: "gift" }] },
            { text: "🧑‍🌾 می‌خوام تا ابد شریک تجاریت باشم... و شریک تخت", options: [{ text: "💋 شریک زندگی", action: "kiss" }, { text: "👰 ازدواج", action: "propose" }, { text: "🔙 بعداً", action: "flee" }] }
        ],
        day6: [
            { text: "🧑‍🌾 امشب می‌خوام حسابت رو برسم... حساب سکس 🫣", options: [{ text: "🔥 از جلو", action: "seduce" }, { text: "🍑 از پشت", action: "seduce" }, { text: "👄 دهنی", action: "kiss" }] },
            { text: "🧑‍🌾 سود عشق... از همه سودا بیشتره... و کیر تو 🔥", options: [{ text: "🔥 حساب کن", action: "seduce" }, { text: "💋 ببوس", action: "kiss" }, { text: "🔙 بعداً", action: "flee" }] }
        ],
        day7: [
            { text: "🧑‍🌾 تا ابد تاجر عاشق تو... تاجر کیر 💋", options: [{ text: "💋 تا ابد", action: "kiss" }, { text: "👶 بچه‌دار شیم", action: "seduce" }, { text: "🔥 بیا", action: "seduce" }] },
            { text: "🧑‍🌾 بهترین سرمایه‌ام... عشق توئه... و کیرت 💍", options: [{ text: "💋 باارزشه", action: "kiss" }, { text: "🔥 بکنم", action: "seduce" }, { text: "👰 ازدواج", action: "propose" }] }
        ]
    },
    maid: {
        day1: [
            { text: "🧹 قربان... اتاقتون رو تمیز کردم... می‌خواید تختتون رو هم گرم کنم؟ 🫣", options: [{ text: "🤝 ممنون", action: "ally" }, { text: "💋 گرم کن", action: "seduce" }, { text: "🏃 فرار", action: "flee" }] },
            { text: "🧹 خاکی نیست که نتونم پاکش کنم... حتی کثیفی کیرتون رو", options: [{ text: "🤝 خوبه", action: "ally" }, { text: "💋 پاک کن", action: "seduce" }, { text: "🏃 فرار", action: "flee" }] }
        ],
        day2: [
            { text: "🧹 قربان... بازم اینجایید؟ خوشحالم... می‌خواید ماساژتون بدم؟", options: [{ text: "💋 ماساژ", action: "kiss" }, { text: "🤝 کار داری؟", action: "ally" }, { text: "🏃 فرار", action: "flee" }] },
            { text: "🧹 وقتی شما رو می‌بینم... دستام میلرزه... و جاهای دیگه‌ام", options: [{ text: "💋 کجاها؟", action: "kiss" }, { text: "🤝 مریضی؟", action: "ally" }, { text: "🏃 فرار", action: "flee" }] }
        ],
        day3: [
            { text: "🧹 قربان... می‌تونم یه خواهش کنم؟ می‌خوام خدمت ویژه بدم", options: [{ text: "💋 بگو", action: "kiss" }, { text: "🤝 بگو", action: "ally" }, { text: "🔙 بعداً", action: "flee" }] },
            { text: "🧹 دلم می‌خواد بیشتر از یه خدمتکار باشم... کلفت سکسی", options: [{ text: "💋 باش", action: "seduce" }, { text: "🤝 چطور؟", action: "ally" }, { text: "🔙 بعداً", action: "flee" }] }
        ],
        day4: [
            { text: "🧹 قربان... امشب هم می‌تونم بمونم؟ تا صبح 🫣", options: [{ text: "💋 بمون", action: "kiss" }, { text: "🤝 نه", action: "ally" }, { text: "🔙 بعداً", action: "flee" }] },
            { text: "🧹 حاضرم هر کاری براتون بکنم... هر کاری... با هر عضوی 💋", options: [{ text: "💋 هر کاری؟", action: "seduce" }, { text: "🤝 چه کاری؟", action: "ally" }, { text: "🔙 بعداً", action: "flee" }] }
        ],
        day5: [
            { text: "🧹 قربان... عاشقتون شدم... این دیگه وظیفه نیست 💋", options: [{ text: "💋 منم", action: "kiss" }, { text: "🔥 بیا", action: "seduce" }, { text: "🎁 هدیه", action: "gift" }] },
            { text: "🧹 می‌خوام تا ابد خدمتکارتون بمونم... و کون خدمتکار", options: [{ text: "💋 بمون", action: "kiss" }, { text: "👰 باش", action: "propose" }, { text: "🔙 بعداً", action: "flee" }] }
        ],
        day6: [
            { text: "🧹 امروز می‌خوام خدمت ویژه بدم... تمیزکاری با زبون 🫣", options: [{ text: "🔥 از جلو", action: "seduce" }, { text: "🍑 از پشت", action: "seduce" }, { text: "👄 دهنی", action: "kiss" }] },
            { text: "🧹 تمیزکاری کامل... از سر تا نوک کیر 🔥", options: [{ text: "🔥 تمیز کن", action: "seduce" }, { text: "💋 آروم", action: "kiss" }, { text: "🔙 بعداً", action: "flee" }] }
        ],
        day7: [
            { text: "🧹 تا ابد کلفت عاشق شما... کلفت سکسی 💋", options: [{ text: "💋 تا ابد", action: "kiss" }, { text: "👶 بچه‌دار شیم", action: "seduce" }, { text: "🔥 بیا", action: "seduce" }] },
            { text: "🧹 خدمتکار همیشگی... و عاشق همیشگی... و کون همیشگی 💍", options: [{ text: "💋 عاشقمی", action: "kiss" }, { text: "🔥 بکنم", action: "seduce" }, { text: "👰 ازدواج", action: "propose" }] }
        ]
    },
    cook: {
        day1: [
            { text: "👩‍🍳 قربان... غذاتون حاضره... یا شاید خودم رو میل دارید؟ 🍖", options: [{ text: "🍖 بخورم", action: "ally" }, { text: "💋 خودت", action: "seduce" }, { text: "🏃 فرار", action: "flee" }] },
            { text: "👩‍🍳 بهترین غذاها رو براتون می‌پزم... و بهترین سکس رو", options: [{ text: "🤝 ممنون", action: "ally" }, { text: "💋 سکس", action: "seduce" }, { text: "🏃 فرار", action: "flee" }] }
        ],
        day2: [
            { text: "👩‍🍳 قربان... غذاتون رو با عشق پختم... و یه کم فلفل اضافه", options: [{ text: "💋 حس می‌کنم", action: "kiss" }, { text: "🤝 ممنون", action: "ally" }, { text: "🏃 فرار", action: "flee" }] },
            { text: "👩‍🍳 دلم می‌خواد فقط براتون آشپزی کنم... و براتون بخوابم", options: [{ text: "💋 بخواب", action: "seduce" }, { text: "🤝 آشپزی", action: "ally" }, { text: "🏃 فرار", action: "flee" }] }
        ],
        day3: [
            { text: "👩‍🍳 قربان... امشب شام مخصوص داریم... شام سکسی 🫣", options: [{ text: "🍖 چیه؟", action: "ally" }, { text: "💋 خودت چی؟", action: "seduce" }, { text: "🔙 بعداً", action: "flee" }] },
            { text: "👩‍🍳 دلم می‌خواد دسر مخصوص هم باشم... با خامه", options: [{ text: "💋 باش", action: "kiss" }, { text: "🤝 چه دسری؟", action: "ally" }, { text: "🔙 بعداً", action: "flee" }] }
        ],
        day4: [
            { text: "👩‍🍳 قربان... عشق مثل آشپزیه... با حرارت زیاد", options: [{ text: "💋 با حرارت", action: "kiss" }, { text: "🤝 توضیح بده", action: "ally" }, { text: "🔙 بعداً", action: "flee" }] },
            { text: "👩‍🍳 دلم می‌خواد مواد مخصوص بهتون بدم... پروتئین خالص 🫣", options: [{ text: "💋 بده", action: "seduce" }, { text: "🤝 چیه؟", action: "ally" }, { text: "🔙 بعداً", action: "flee" }] }
        ],
        day5: [
            { text: "👩‍🍳 عاشقتون شدم... مثل عسل شیرین... و مثل فلفل تند 💋", options: [{ text: "💋 منم", action: "kiss" }, { text: "🔥 بیا", action: "seduce" }, { text: "🎁 هدیه", action: "gift" }] },
            { text: "👩‍🍳 می‌خوام تا ابد آشپزتون بمونم... و کون آشپز", options: [{ text: "💋 بمون", action: "kiss" }, { text: "👰 باش", action: "propose" }, { text: "🔙 بعداً", action: "flee" }] }
        ],
        day6: [
            { text: "👩‍🍳 امروز غذای مخصوص... خودم هستم... لخت و آماده 🫣", options: [{ text: "🔥 از جلو", action: "seduce" }, { text: "🍑 از پشت", action: "seduce" }, { text: "👄 دهنی", action: "kiss" }] },
            { text: "👩‍🍳 دسر مخصوص... با خامه و کیر 🔥", options: [{ text: "🔥 بخورم", action: "seduce" }, { text: "💋 آروم", action: "kiss" }, { text: "🔙 بعداً", action: "flee" }] }
        ],
        day7: [
            { text: "👩‍🍳 تا ابد آشپز عاشق شما... آشپز سکسی 💋", options: [{ text: "💋 تا ابد", action: "kiss" }, { text: "👶 بچه‌دار شیم", action: "seduce" }, { text: "🔥 بیا", action: "seduce" }] },
            { text: "👩‍🍳 بهترین غذا... عشق ماست... با سس کیر 💍", options: [{ text: "💋 خوشمزه‌ست", action: "kiss" }, { text: "🔥 بکنم", action: "seduce" }, { text: "👰 ازدواج", action: "propose" }] }
        ]
    }
};
    stylist: {
        day1: [
            { text: "💇 قربان... موهاتون رو آرایش کنم؟ یا شاید جای دیگه‌ای رو؟ 🫣", options: [{ text: "💇 مو", action: "ally" }, { text: "💋 جای دیگه", action: "seduce" }, { text: "🏃 فرار", action: "flee" }] },
            { text: "💇 قربان... با این قیچی می‌تونم هر چیزی رو بتراشم... حتی موهای کیرتون", options: [{ text: "💇 بتراش", action: "ally" }, { text: "💋 کیر", action: "seduce" }, { text: "🏃 فرار", action: "flee" }] }
        ],
        day2: [
            { text: "💇 قربان... امروز چهره‌تون می‌درخشه... از بس که دیشب کردید؟", options: [{ text: "💋 از عشقه", action: "kiss" }, { text: "🤝 ممنون", action: "ally" }, { text: "🏃 فرار", action: "flee" }] },
            { text: "💇 دلم می‌خواد فقط شما رو آرایش کنم... و بعد بکنمتون 🫣", options: [{ text: "💋 بکن", action: "seduce" }, { text: "🤝 چرا؟", action: "ally" }, { text: "🏃 فرار", action: "flee" }] }
        ],
        day3: [
            { text: "💇 قربان... می‌تونم امشب موهاتون رو شونه کنم... و بقیه بدن رو", options: [{ text: "💋 شونه کن", action: "kiss" }, { text: "🤝 فقط مو", action: "ally" }, { text: "🔙 بعداً", action: "flee" }] },
            { text: "💇 دلم می‌خواد آرایش خاص بکنم... آرایش سکسی 💋", options: [{ text: "💋 بکن", action: "seduce" }, { text: "🤝 چه آرایشی؟", action: "ally" }, { text: "🔙 بعداً", action: "flee" }] }
        ],
        day4: [
            { text: "💇 قربان... عشق مثل آرایشه... باید ظریف باشه", options: [{ text: "💋 ظریف", action: "kiss" }, { text: "🤝 توضیح بده", action: "ally" }, { text: "🔙 بعداً", action: "flee" }] },
            { text: "💇 قربان... دلم می‌خواد امشب بمونم... و آرایشتون رو خراب کنم 🫣", options: [{ text: "💋 بمون", action: "seduce" }, { text: "🤝 نه", action: "ally" }, { text: "🔙 بعداً", action: "flee" }] }
        ],
        day5: [
            { text: "💇 عاشقتون شدم... این دیگه آرایش نیست... عشقه 💋", options: [{ text: "💋 منم", action: "kiss" }, { text: "🔥 بیا", action: "seduce" }, { text: "🎁 هدیه", action: "gift" }] },
            { text: "💇 می‌خوام تا ابد آرایشگرتون بمونم... و کون آرایشگر", options: [{ text: "💋 بمون", action: "kiss" }, { text: "👰 باش", action: "propose" }, { text: "🔙 بعداً", action: "flee" }] }
        ],
        day6: [
            { text: "💇 امروز آرایش مخصوص... بدون لباس و بدون آرایش 🫣", options: [{ text: "🔥 از جلو", action: "seduce" }, { text: "🍑 از پشت", action: "seduce" }, { text: "👄 دهنی", action: "kiss" }] },
            { text: "💇 آرایش نهایی... با اسپرم سفید و براق 🔥", options: [{ text: "🔥 آرایش کن", action: "seduce" }, { text: "💋 آروم", action: "kiss" }, { text: "🔙 بعداً", action: "flee" }] }
        ],
        day7: [
            { text: "💇 تا ابد آرایشگر عاشق شما... آرایشگر سکسی 💋", options: [{ text: "💋 تا ابد", action: "kiss" }, { text: "👶 بچه‌دار شیم", action: "seduce" }, { text: "🔥 بیا", action: "seduce" }] },
            { text: "💇 بهترین آرایش... عشق ماست... با رژ کیر 💍", options: [{ text: "💋 قشنگه", action: "kiss" }, { text: "🔥 بکنم", action: "seduce" }, { text: "👰 ازدواج", action: "propose" }] }
        ]
    },
    tailor: {
        day1: [
            { text: "👗 قربان... براتون لباس بدوزم؟ یا شاید لباس‌هاتون رو دربیارم؟ 😏", options: [{ text: "👗 بدوز", action: "ally" }, { text: "💋 دربیار", action: "seduce" }, { text: "🏃 فرار", action: "flee" }] },
            { text: "👗 قربان... اندامتون رو اندازه گرفتم... سایز کیرتون هم لازمه", options: [{ text: "💋 بگیر", action: "kiss" }, { text: "🤝 ممنون", action: "ally" }, { text: "🏃 فرار", action: "flee" }] }
        ],
        day2: [
            { text: "👗 قربان... براتون لباس زیر دوختم... از جنس پوست", options: [{ text: "💋 بپوشم", action: "kiss" }, { text: "🤝 ممنون", action: "ally" }, { text: "🏃 فرار", action: "flee" }] },
            { text: "👗 دلم می‌خواد فقط براتون بدوزم... و بعد بشکافم", options: [{ text: "💋 بشکاف", action: "seduce" }, { text: "🤝 بدوز", action: "ally" }, { text: "🏃 فرار", action: "flee" }] }
        ],
        day3: [
            { text: "👗 قربان... می‌خوام لباس خاص براتون بدوزم... لباس سکس 🫣", options: [{ text: "💋 بذوز", action: "kiss" }, { text: "🤝 چه لباسی؟", action: "ally" }, { text: "🔙 بعداً", action: "flee" }] },
            { text: "👗 دلم می‌خواد مثل پارچه زیر دستتون باشم... نرم و لطیف", options: [{ text: "💋 باش", action: "seduce" }, { text: "🤝 چطور؟", action: "ally" }, { text: "🔙 بعداً", action: "flee" }] }
        ],
        day4: [
            { text: "👗 قربان... عشق مثل خیاطیه... باید دقیق باشه", options: [{ text: "💋 دقیق", action: "kiss" }, { text: "🤝 توضیح بده", action: "ally" }, { text: "🔙 بعداً", action: "flee" }] },
            { text: "👗 قربان... می‌خوام امشب لباسهاتون رو قیچی کنم 🫣", options: [{ text: "💋 قیچی کن", action: "seduce" }, { text: "🤝 نه", action: "ally" }, { text: "🔙 بعداً", action: "flee" }] }
        ],
        day5: [
            { text: "👗 عاشقتون شدم... این دیگه خیاطی نیست... عشقه 💋", options: [{ text: "💋 منم", action: "kiss" }, { text: "🔥 بیا", action: "seduce" }, { text: "🎁 هدیه", action: "gift" }] },
            { text: "👗 می‌خوام تا ابد خیاطتون بمونم... و کون خیاط", options: [{ text: "💋 بمون", action: "kiss" }, { text: "👰 باش", action: "propose" }, { text: "🔙 بعداً", action: "flee" }] }
        ],
        day6: [
            { text: "👗 امروز لباس مخصوص... بدون پارچه... فقط پوست 🫣", options: [{ text: "🔥 از جلو", action: "seduce" }, { text: "🍑 از پشت", action: "seduce" }, { text: "👄 دهنی", action: "kiss" }] },
            { text: "👗 دوخت نهایی... با نخ عشق و سوزن کیر 🔥", options: [{ text: "🔥 بدوز", action: "seduce" }, { text: "💋 آروم", action: "kiss" }, { text: "🔙 بعداً", action: "flee" }] }
        ],
        day7: [
            { text: "👗 تا ابد خیاط عاشق شما... خیاط سکسی 💋", options: [{ text: "💋 تا ابد", action: "kiss" }, { text: "👶 بچه‌دار شیم", action: "seduce" }, { text: "🔥 بیا", action: "seduce" }] },
            { text: "👗 بهترین لباس... عشق ماست... با پارچه کیر 💍", options: [{ text: "💋 قشنگه", action: "kiss" }, { text: "🔥 بکنم", action: "seduce" }, { text: "👰 ازدواج", action: "propose" }] }
        ]
    },
    guard: {
        day1: [
            { text: "🛡️ قربان... محافظت از شما وظیفه‌مه... مخصوصاً از کیرتون", options: [{ text: "🤝 ممنون", action: "ally" }, { text: "💋 محافظت کن", action: "seduce" }, { text: "🏃 فرار", action: "flee" }] },
            { text: "🛡️ قربان... جونم رو براتون می‌دم... و کونم رو", options: [{ text: "💋 کون", action: "kiss" }, { text: "🤝 جون", action: "ally" }, { text: "🏃 فرار", action: "flee" }] }
        ],
        day2: [
            { text: "🛡️ قربان... امروز کسی رو ندیدم... فقط یه فاحشه اومده بود", options: [{ text: "💋 فاحشه؟", action: "kiss" }, { text: "🤝 بگو", action: "ally" }, { text: "🏃 فرار", action: "flee" }] },
            { text: "🛡️ دلم می‌خواد بیشتر از محافظ باشم... محافظ کیر", options: [{ text: "💋 باش", action: "seduce" }, { text: "🤝 چطور؟", action: "ally" }, { text: "🏃 فرار", action: "flee" }] }
        ],
        day3: [
            { text: "🛡️ قربان... امشب می‌خوام نگهبانی بدم... توی تخت 🫣", options: [{ text: "💋 بمون", action: "kiss" }, { text: "🤝 نه", action: "ally" }, { text: "🔙 بعداً", action: "flee" }] },
            { text: "🛡️ دلم می‌خواد شبانه‌روز محافظت کنم... با بدنم", options: [{ text: "💋 بدن", action: "seduce" }, { text: "🤝 وظیفه‌ست", action: "ally" }, { text: "🔙 بعداً", action: "flee" }] }
        ],
        day4: [
            { text: "🛡️ قربان... عشق مثل جنگه... باید بجنگی براش", options: [{ text: "💋 می‌جنگم", action: "kiss" }, { text: "🤝 توضیح بده", action: "ally" }, { text: "🔙 بعداً", action: "flee" }] },
            { text: "🛡️ قربان... می‌خوام امشب بدون زره نگهبانی بدم 🫣", options: [{ text: "💋 بدون زره", action: "seduce" }, { text: "🤝 با زره", action: "ally" }, { text: "🔙 بعداً", action: "flee" }] }
        ],
        day5: [
            { text: "🛡️ عاشقتون شدم... این دیگه وظیفه نیست... عشقه 💋", options: [{ text: "💋 منم", action: "kiss" }, { text: "🔥 بیا", action: "seduce" }, { text: "🎁 هدیه", action: "gift" }] },
            { text: "🛡️ می‌خوام تا ابد محافظتون بمونم... و کون محافظ", options: [{ text: "💋 بمون", action: "kiss" }, { text: "👰 باش", action: "propose" }, { text: "🔙 بعداً", action: "flee" }] }
        ],
        day6: [
            { text: "🛡️ امروز محافظت ویژه... بدون زره و بدون شمشیر 🫣", options: [{ text: "🔥 از جلو", action: "seduce" }, { text: "🍑 از پشت", action: "seduce" }, { text: "👄 دهنی", action: "kiss" }] },
            { text: "🛡️ نبرد نهایی... با نیزه کیر 🔥", options: [{ text: "🔥 نبرد", action: "seduce" }, { text: "💋 آروم", action: "kiss" }, { text: "🔙 بعداً", action: "flee" }] }
        ],
        day7: [
            { text: "🛡️ تا ابد محافظ عاشق شما... محافظ سکسی 💋", options: [{ text: "💋 تا ابد", action: "kiss" }, { text: "👶 بچه‌دار شیم", action: "seduce" }, { text: "🔥 بیا", action: "seduce" }] },
            { text: "🛡️ بهترین نبرد... عشق ماست... با شمشیر کیر 💍", options: [{ text: "💋 قشنگه", action: "kiss" }, { text: "🔥 بکنم", action: "seduce" }, { text: "👰 ازدواج", action: "propose" }] }
        ]
    },
    // ============ خدمتکاران اضافی ============
    spymaster: {
        day1: [
            { text: "🕵️ قربان... اطلاعات دارم... کی با کی خوابیده...", options: [{ text: "👂 بگو", action: "listen" }, { text: "💋 تو چی؟", action: "seduce" }, { text: "🏃 فرار", action: "flee" }] },
            { text: "🕵️ قربان... همه چی رو زیر نظر دارم... حتی کیرتون رو", options: [{ text: "💋 زیر نظر", action: "kiss" }, { text: "🤝 خوبه", action: "ally" }, { text: "🏃 فرار", action: "flee" }] }
        ],
        day2: [
            { text: "🕵️ قربان... یه خبر داغ دارم... ملکه اصلی خیانت می‌کنه", options: [{ text: "💋 جدی؟", action: "kiss" }, { text: "🤝 بگو", action: "ally" }, { text: "🏃 فرار", action: "flee" }] },
            { text: "🕵️ دلم می‌خواد جاسوس مخصوص شما باشم... توی تخت", options: [{ text: "💋 باش", action: "seduce" }, { text: "🤝 چطور؟", action: "ally" }, { text: "🏃 فرار", action: "flee" }] }
        ],
        day3: [
            { text: "🕵️ قربان... می‌خوام یه مأموریت مخفی برم... توی شلوارتون 🫣", options: [{ text: "💋 برو", action: "kiss" }, { text: "🤝 نه", action: "ally" }, { text: "🔙 بعداً", action: "flee" }] },
            { text: "🕵️ دلم می‌خواد ازتون بازجویی کنم... با بدنم", options: [{ text: "💋 بازجویی", action: "seduce" }, { text: "🤝 اعتراف", action: "ally" }, { text: "🔙 بعداً", action: "flee" }] }
        ],
        day4: [
            { text: "🕵️ قربان... عشق مثل جاسوسیه... باید مخفی باشه", options: [{ text: "💋 مخفی", action: "kiss" }, { text: "🤝 توضیح بده", action: "ally" }, { text: "🔙 بعداً", action: "flee" }] },
            { text: "🕵️ قربان... می‌خوام امشب مأموریت special برم 🫣", options: [{ text: "💋 برو", action: "seduce" }, { text: "🤝 نه", action: "ally" }, { text: "🔙 بعداً", action: "flee" }] }
        ],
        day5: [
            { text: "🕵️ عاشقتون شدم... این دیگه جاسوسی نیست... عشقه 💋", options: [{ text: "💋 منم", action: "kiss" }, { text: "🔥 بیا", action: "seduce" }, { text: "🎁 هدیه", action: "gift" }] },
            { text: "🕵️ می‌خوام تا ابد جاسوستون بمونم... و کون جاسوس", options: [{ text: "💋 بمون", action: "kiss" }, { text: "👰 باش", action: "propose" }, { text: "🔙 بعداً", action: "flee" }] }
        ],
        day6: [
            { text: "🕵️ امروز مأموریت ویژه... نفوذ به منطقه ممنوعه 🫣", options: [{ text: "🔥 از جلو", action: "seduce" }, { text: "🍑 از پشت", action: "seduce" }, { text: "👄 دهنی", action: "kiss" }] },
            { text: "🕵️ بازجویی نهایی... با اسلحه کیر 🔥", options: [{ text: "🔥 بازجویی", action: "seduce" }, { text: "💋 آروم", action: "kiss" }, { text: "🔙 بعداً", action: "flee" }] }
        ],
        day7: [
            { text: "🕵️ تا ابد جاسوس عاشق شما... جاسوس سکسی 💋", options: [{ text: "💋 تا ابد", action: "kiss" }, { text: "👶 بچه‌دار شیم", action: "seduce" }, { text: "🔥 بیا", action: "seduce" }] },
            { text: "🕵️ بهترین مأموریت... عشق ماست... با رمز کیر 💍", options: [{ text: "💋 قشنگه", action: "kiss" }, { text: "🔥 بکنم", action: "seduce" }, { text: "👰 ازدواج", action: "propose" }] }
        ]
    }
};
    priestess: {
        day1: [
            { text: "🙏 قربان... دعا کنید... برای کیرتون دعا کردم", options: [{ text: "🙏 دعا", action: "heal" }, { text: "💋 آمین", action: "seduce" }, { text: "🏃 فرار", action: "flee" }] },
            { text: "🙏 قربان... معبد مقدسه... ولی کیر شما مقدس‌تر", options: [{ text: "💋 مقدس", action: "kiss" }, { text: "🤝 معبد", action: "ally" }, { text: "🏃 فرار", action: "flee" }] }
        ],
        day2: [
            { text: "🙏 قربان... امروز مراسم خاص داریم... مراسم باروری", options: [{ text: "💋 باروری", action: "seduce" }, { text: "🤝 مراسم", action: "ally" }, { text: "🏃 فرار", action: "flee" }] },
            { text: "🙏 دلم می‌خواد کاهنه مخصوص شما باشم... کاهنه سکس", options: [{ text: "💋 باش", action: "seduce" }, { text: "🤝 چطور؟", action: "ally" }, { text: "🏃 فرار", action: "flee" }] }
        ],
        day3: [
            { text: "🙏 قربان... می‌خوام اعتراف کنم... من باکره نیستم", options: [{ text: "💋 می‌دونم", action: "kiss" }, { text: "🤝 مهم نیست", action: "ally" }, { text: "🔙 بعداً", action: "flee" }] },
            { text: "🙏 دلم می‌خواد گناه کنم... گناه سکس 🫣", options: [{ text: "💋 گناه", action: "seduce" }, { text: "🤝 توبه", action: "ally" }, { text: "🔙 بعداً", action: "flee" }] }
        ],
        day4: [
            { text: "🙏 قربان... عشق مثل عبادته... باید خالص باشه", options: [{ text: "💋 خالص", action: "kiss" }, { text: "🤝 توضیح بده", action: "ally" }, { text: "🔙 بعداً", action: "flee" }] },
            { text: "🙏 قربان... می‌خوام امشب عبادت خاص بکنم 🫣", options: [{ text: "💋 عبادت", action: "seduce" }, { text: "🤝 نه", action: "ally" }, { text: "🔙 بعداً", action: "flee" }] }
        ],
        day5: [
            { text: "🙏 عاشقتون شدم... این دیگه عبادت نیست... عشقه 💋", options: [{ text: "💋 منم", action: "kiss" }, { text: "🔥 بیا", action: "seduce" }, { text: "🎁 هدیه", action: "gift" }] },
            { text: "🙏 می‌خوام تا ابد کاهنه شما بمونم... و کون کاهنه", options: [{ text: "💋 بمون", action: "kiss" }, { text: "👰 باش", action: "propose" }, { text: "🔙 بعداً", action: "flee" }] }
        ],
        day6: [
            { text: "🙏 امروز عبادت ویژه... با بدن لخت 🫣", options: [{ text: "🔥 از جلو", action: "seduce" }, { text: "🍑 از پشت", action: "seduce" }, { text: "👄 دهنی", action: "kiss" }] },
            { text: "🙏 تقدیس نهایی... با آب مقدس کیر 🔥", options: [{ text: "🔥 تقدیس", action: "seduce" }, { text: "💋 آروم", action: "kiss" }, { text: "🔙 بعداً", action: "flee" }] }
        ],
        day7: [
            { text: "🙏 تا ابد کاهنه عاشق شما... کاهنه سکسی 💋", options: [{ text: "💋 تا ابد", action: "kiss" }, { text: "👶 بچه‌دار شیم", action: "seduce" }, { text: "🔥 بیا", action: "seduce" }] },
            { text: "🙏 بهترین دعا... عشق ماست... با ذکر کیر 💍", options: [{ text: "💋 قشنگه", action: "kiss" }, { text: "🔥 بکنم", action: "seduce" }, { text: "👰 ازدواج", action: "propose" }] }
        ]
    },
    bartender: {
        day1: [
            { text: "🍺 قربان... چی می‌خورید؟ شراب؟ عرق؟ یا کیر منو؟", options: [{ text: "🍺 شراب", action: "trade" }, { text: "💋 کیر", action: "seduce" }, { text: "🏃 فرار", action: "flee" }] },
            { text: "🍺 قربان... بهترین مشروب اینجاست... و بهترین سکس", options: [{ text: "🍺 بنوش", action: "ally" }, { text: "💋 سکس", action: "seduce" }, { text: "🏃 فرار", action: "flee" }] }
        ],
        day2: [
            { text: "🍺 قربان... بازم اومدید؟ بازم مستید یا بازم هورنی؟", options: [{ text: "🍺 مست", action: "trade" }, { text: "💋 هورنی", action: "seduce" }, { text: "🏃 فرار", action: "flee" }] },
            { text: "🍺 دلم می‌خواد فقط به شما نوشیدنی بدم... نوشیدنی عشق", options: [{ text: "💋 عشق", action: "kiss" }, { text: "🍺 نوشیدنی", action: "trade" }, { text: "🏃 فرار", action: "flee" }] }
        ],
        day3: [
            { text: "🍺 قربان... امشب نوشیدنی مخصوص دارم... شیر کیر", options: [{ text: "💋 شیر", action: "kiss" }, { text: "🍺 چیه؟", action: "ally" }, { text: "🔙 بعداً", action: "flee" }] },
            { text: "🍺 دلم می‌خواد میز بار رو تبدیل کنم به تخت", options: [{ text: "💋 تبدیل کن", action: "seduce" }, { text: "🤝 چطور؟", action: "ally" }, { text: "🔙 بعداً", action: "flee" }] }
        ],
        day4: [
            { text: "🍺 قربان... عشق مثل مشروبه... مست می‌کنه", options: [{ text: "💋 مست", action: "kiss" }, { text: "🤝 توضیح بده", action: "ally" }, { text: "🔙 بعداً", action: "flee" }] },
            { text: "🍺 قربان... می‌خوام امشب بار رو تعطیل کنم... برای سکس 🫣", options: [{ text: "💋 تعطیل", action: "seduce" }, { text: "🤝 نه", action: "ally" }, { text: "🔙 بعداً", action: "flee" }] }
        ],
        day5: [
            { text: "🍺 عاشقتون شدم... این دیگه مستی نیست... عشقه 💋", options: [{ text: "💋 منم", action: "kiss" }, { text: "🔥 بیا", action: "seduce" }, { text: "🎁 هدیه", action: "gift" }] },
            { text: "🍺 می‌خوام تا ابد بارتندرتون بمونم... و کون بارتندر", options: [{ text: "💋 بمون", action: "kiss" }, { text: "👰 باش", action: "propose" }, { text: "🔙 بعداً", action: "flee" }] }
        ],
        day6: [
            { text: "🍺 امروز نوشیدنی ویژه... خودم... لخت و آماده 🫣", options: [{ text: "🔥 از جلو", action: "seduce" }, { text: "🍑 از پشت", action: "seduce" }, { text: "👄 دهنی", action: "kiss" }] },
            { text: "🍺 آخرین پیک... پیک عشق... با الکل کیر 🔥", options: [{ text: "🔥 بنوش", action: "seduce" }, { text: "💋 آروم", action: "kiss" }, { text: "🔙 بعداً", action: "flee" }] }
        ],
        day7: [
            { text: "🍺 تا ابد بارتندر عاشق شما... بارتندر سکسی 💋", options: [{ text: "💋 تا ابد", action: "kiss" }, { text: "👶 بچه‌دار شیم", action: "seduce" }, { text: "🔥 بیا", action: "seduce" }] },
            { text: "🍺 بهترین نوشیدنی... عشق ماست... با طعم کیر 💍", options: [{ text: "💋 قشنگه", action: "kiss" }, { text: "🔥 بکنم", action: "seduce" }, { text: "👰 ازدواج", action: "propose" }] }
        ]
    }
};

// ============ houseDialogues ============
const houseDialogues = {
    'invite_accept': ["🏠 اوکی بابا... میام خونه‌ات...", "🏠 بالاخره یه جای درست و حسابی...", "🏠 خونه‌ات قشنگه..."],
    'invite_reject': ["😒 نه... حوصله ندارم...", "😒 شاید بعداً... الان گرفتارم...", "😒 نه! نمیام خونه‌ت!"],
    'kick_angry': ["😡 منو بیرون می‌کنی؟!", "💀 پشیمون میشی...", "😤 باشه... ولی برمی‌گردم!"],
    'touch': ["🖐️ دستت گرمه...", "🖐️ بیشتر لمس کن...", "🖐️ خوشم میاد از دستات..."],
    'kiss': ["💋 ммm... لبات...", "💋 دوباره ببوس...", "💋 معتاد بوسه‌ات شدم..."],
    'orgy': ["🔥 امروز چه شب وحشی‌ای بود...", "🔥 دیگه نمی‌تونم راه برم...", "🔥 فوق‌العاده بود..."]
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
    tailor: { emoji: '👗', startPoints: 10 }, guard: { emoji: '🛡️', startPoints: 15 },
    spymaster: { emoji: '🕵️', startPoints: 20 }, priestess: { emoji: '🙏', startPoints: 25 },
    bartender: { emoji: '🍺', startPoints: 15 }
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