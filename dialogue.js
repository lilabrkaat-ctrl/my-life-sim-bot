const config = require('./config');

// ============ دیالوگ‌های مدرن، وحشی و سکسی - ۷ روزه ============
const dialogues = {
    witch: {
        day1: [
            { text: "🧙‍♀️ گمشو بیرون کصکش! قبل اینکه طلسمت کنم و کیرت رو بترکونم! 🔥", options: [{ text: "🗡️ حمله", action: "fight" }, { text: "💋 شیفته شو", action: "seduce" }, { text: "🏃 فرار", action: "flee" }] },
            { text: "🧙‍♀️ بوی کص و کون میاد... آدمیزاده یا حیوون؟! کدوم گورستونی بزرگ شدی؟", options: [{ text: "🤝 آدمم", action: "ally" }, { text: "💋 شیفته‌ات شدم", action: "seduce" }, { text: "🏃 فرار", action: "flee" }] }
        ],
        day2: [
            { text: "🧙‍♀️ دوباره تو؟! می‌خوای بمیری کونی؟ اسکل شدی هر روز میای اینجا؟", options: [{ text: "🎁 هدیه دارم", action: "gift" }, { text: "💋 دلم برات تنگ شده", action: "seduce" }, { text: "🏃 فرار", action: "flee" }] },
            { text: "🧙‍♀️ دیشب توی خواب گاییدی منو... هنوز کمرم درد می‌کنه 😈 راستی قرصی چیزی نداری؟", options: [{ text: "👂 جدی؟", action: "listen" }, { text: "💋 بازم می‌خوای؟", action: "seduce" }, { text: "🏃 فرار", action: "flee" }] }
        ],
        day3: [
            { text: "🧙‍♀️ بیا نزدیک... بذار بو کنم ببینم امروز با کی بودی... اگه بفهمم رفتی پیش اون پری کونی می‌کشمت!", options: [{ text: "🖐️ نزدیک شو", action: "ally" }, { text: "🎁 هدیه دارم", action: "gift" }, { text: "🔙 بعداً", action: "flee" }] },
            { text: "🧙‍♀️ دستام میلرزه... یا از عصبانیت یا از این که می‌خوام بکنی منو... خودت حدس بزن کدومه 😈", options: [{ text: "💋 عشق", action: "seduce" }, { text: "🤝 عصبانیت", action: "ally" }, { text: "🔙 نه", action: "flee" }] }
        ],
        day4: [
            { text: "🧙‍♀️ دیگه نمی‌تونم... اینقدر داغم که جادوهام خودبخود فعال میشن 💋 یا میای یا منفجرت می‌کنم!", options: [{ text: "💋 ببوس", action: "kiss" }, { text: "🔥 بکنم", action: "seduce" }, { text: "🔙 بعداً", action: "flee" }] },
            { text: "🧙‍♀️ معجون عشق رو با هم بخوریم... یا معجون مرگ رو بکنم توی حلقومت؟ انتخاب با توئه عزیزم 🧪💀", options: [{ text: "🧪 عشق", action: "potion" }, { text: "💋 اول ببوس", action: "kiss" }, { text: "🔙 هیچکدوم", action: "flee" }] }
        ],
        day5: [
            { text: "🧙‍♀️ فقط تو می‌تونی آرومم کنی... با اون کیر جادوییت... 🫣 راستی امروز شارژ شده یا باتریش تمومه؟", options: [{ text: "💋 در آغوش بگیر", action: "kiss" }, { text: "🔥 شارژ کامل", action: "seduce" }, { text: "🎁 هدیه", action: "gift" }] },
            { text: "🧙‍♀️ می‌خوام تا ابد مال تو باشم... سند بزنیم بریم ثبت احوال 💍", options: [{ text: "👰 ازدواج کن", action: "propose" }, { text: "💋 اول ببوس", action: "kiss" }, { text: "🔙 بعداً", action: "flee" }] }
        ],
        day6: [
            { text: "🧙‍♀️ ارباب من... امروز چجور می‌خوای بکنی منو؟ معمولی؟ وحشی؟ یا با طلسم؟ 😈", options: [{ text: "🔥 از جلو (بارداری)", action: "seduce" }, { text: "🍑 از پشت (لذت)", action: "seduce" }, { text: "👄 دهنی", action: "kiss" }] },
            { text: "🧙‍♀️ برات یه معجون سکسی درست کردم از عصاره ارکیده و آب کیر اژدها... بکن منو با این؟ 🧪🔥", options: [{ text: "🧪 بکنم", action: "potion" }, { text: "💋 اول ببوس", action: "kiss" }, { text: "🔙 بعداً", action: "flee" }] }
        ],
        day7: [
            { text: "🧙‍♀️ تا آخر عمر حاضر نیستم از کیرت جدا شم... حتی اگه بمیرم روحت رو می‌کنم 💍🔥", options: [{ text: "💋 ببوس", action: "kiss" }, { text: "🔥 بکنم وحشی", action: "seduce" }, { text: "👶 بچه‌دار شیم", action: "seduce" }] },
            { text: "🧙‍♀️ امروز می‌خوام رکورد بزنیم... ۷ بار پشت سر هم... اگه کم بیاری طلسمت می‌کنم 😈", options: [{ text: "🔥 آماده‌ام", action: "seduce" }, { text: "💋 اول آروم", action: "kiss" }, { text: "🔙 امروز نه", action: "flee" }] }
        ],
        harem: [
            { text: "🧙‍♀️ شوهرم... امشب میای یا بازم باید جق بزنم؟ 🫣", options: [{ text: "🔥 میام", action: "seduce" }, { text: "🎁 اول هدیه", action: "gift" }, { text: "🔙 بعداً", action: "flee" }] },
            { text: "🧙‍♀️ دلم برات تنگ شده... اینقدر نرو پیش اون پری کوفتی 💔", options: [{ text: "💋 الان میام", action: "kiss" }, { text: "🤝 مشغول بودم", action: "ally" }, { text: "🔙 بعداً", action: "flee" }] },
            { text: "🧙‍♀️ بچه‌مون امروز لگد زد... فکر کنم جادوگر میشه مثل خودم 🤰", options: [{ text: "👶 عالیه!", action: "ally" }, { text: "💋 ببوس", action: "kiss" }, { text: "🎁 هدیه", action: "gift" }] }
        ]
    },
    vampire: {
        day1: [
            { text: "🧛‍♀️ گرسنمه فاحشه! خونتو می‌خورم و استخوناتو می‌کنم توی موزه!", options: [{ text: "🗡️ حمله", action: "fight" }, { text: "🩸 خون بده", action: "gift" }, { text: "💋 عشق", action: "seduce" }] },
            { text: "🧛‍♀️ ۳۰۰ ساله زندم... تو یه لقمه کوچیکی برام! شاید هم دسر باشی 😈", options: [{ text: "🗡️ بجنگ", action: "fight" }, { text: "💋 دسر خوشمزه", action: "seduce" }] }
        ],
        day2: [
            { text: "🧛‍♀️ بازم اومدی کصخل؟! خونتو بو می‌کشم... امروز چی خوردی که اینقدر بو میده؟", options: [{ text: "🩸 بخور", action: "gift" }, { text: "💋 بو کن", action: "seduce" }] },
            { text: "🧛‍♀️ دیشب یه human رو خشک کردم... تو بعدی هستی اگه زر بزنی!", options: [{ text: "🗡️ نمی‌ذارم", action: "fight" }, { text: "💋 منو نمی‌کشی", action: "seduce" }] }
        ],
        day3: [
            { text: "🧛‍♀️ مچ دستت رو بده... بذار نبضت رو قبل مرگ حس کنم... شاید هم قبل سکس 😏", options: [{ text: "🖐️ بده", action: "ally" }, { text: "💋 ببوس", action: "kiss" }] },
            { text: "🧛‍♀️ خون تو اعتیاد آورده... مثل شیشه می‌مونه... بازم بده!", options: [{ text: "🩸 بخور", action: "gift" }, { text: "💋 منم معتادتم", action: "seduce" }] }
        ],
        day4: [
            { text: "🧛‍♀️ شاید نکشمت... شاید تبدیلت کنم به خون‌آشام... همدمم شی تا ابد 🌑", options: [{ text: "🧛 تبدیل کن", action: "potion" }, { text: "💋 همدمت میشم", action: "seduce" }] },
            { text: "🧛‍♀️ نمی‌خوام بکشمت... می‌خوام قرن‌ها بکنمت... هر شب تا صبح 💋", options: [{ text: "💋 پیشم بمون", action: "kiss" }, { text: "🔥 بکنم", action: "seduce" }] }
        ],
        day5: [
            { text: "🧛‍♀️ ۳۰۰ ساله عاشق نشدم... تو اولین و آخرینی... نکنه مثل بقیه عشقم رو بخوری؟", options: [{ text: "💋 نمی‌خورم", action: "kiss" }, { text: "🔥 بیا", action: "seduce" }] },
            { text: "🧛‍♀️ بیا... با هم جاودانه شیم... خون هم رو بخوریم... رمانتیک ترین قرار دنیا 🩸💋", options: [{ text: "🩸 جاودانه", action: "potion" }, { text: "💋 ببوس", action: "kiss" }] }
        ],
        day6: [
            { text: "🧛‍♀️ من خون‌آشام تو شدم... تا ابد... حالا بکن منو یا بمیر 💋", options: [{ text: "🔥 از جلو", action: "seduce" }, { text: "🍑 از پشت", action: "seduce" }, { text: "👄 دهنی", action: "kiss" }] },
            { text: "🧛‍♀️ هر شب میام سراغت... نه برای خون... برای ارگاسم‌های چندگانه 🫣🔥", options: [{ text: "💋 بیا", action: "kiss" }, { text: "🔥 منتظرم", action: "seduce" }] }
        ],
        day7: [
            { text: "🧛‍♀️ اگه بمیری... خودم زنده‌ات می‌کنم... نمی‌ذارم از دستت بدم 💀💋", options: [{ text: "💋 نمی‌میرم", action: "kiss" }, { text: "👰 ازدواج خون‌آشامی", action: "propose" }] },
            { text: "🧛‍♀️ تا ابد مال تو... حالا یا بمیر یا بکن 🧛‍♀️💋", options: [{ text: "💋 مال منی", action: "kiss" }, { text: "🔥 بیا", action: "seduce" }] }
        ],
        harem: [
            { text: "🧛‍♀️ شوهرم... امشب گرسنه‌ام... یا خون یا کیر 🩸🔥", options: [{ text: "🩸 خون", action: "gift" }, { text: "🔥 کیر", action: "seduce" }, { text: "🔙 بعداً", action: "flee" }] },
            { text: "🧛‍♀️ چرا انقدر دیر میای پیشم؟ بازم رفتی پیش اون گرگینه؟ 💔", options: [{ text: "💋 الان اومدم", action: "kiss" }, { text: "🤝 مشغول بودم", action: "ally" }] },
            { text: "🧛‍♀️ بچه‌مون خون‌آشام میشه یا human؟ اگه human بشه می‌خورمش 🤔", options: [{ text: "🧛 خون‌آشام", action: "ally" }, { text: "👤 human", action: "ally" }, { text: "💋 فرقی نداره", action: "kiss" }] }
        ]
    },
    fairy: {
        day1: [
            { text: "🧚 سلام خوشتیپ! ۳ تا آرزو داری... راستی کیرت هم جزو آرزوها حساب میشه؟ 😜", options: [{ text: "💎 ثروت", action: "wealth" }, { text: "⚔️ قدرت", action: "power" }, { text: "💋 عشق", action: "seduce" }] },
            { text: "🧚 هی قهرمان! پری‌ها چقدر شیطونن؟ جواب بده یا گرد جادویی می‌پاشم روشنت 😈", options: [{ text: "💋 خیلی", action: "seduce" }, { text: "🤝 نمی‌دونم", action: "ally" }] }
        ],
        day2: [
            { text: "🧚 آرزوی دومت چیه؟ پول؟ قدرت؟ یا یه سکس سه‌نفره با من و دوستم؟ 👯", options: [{ text: "💎 پول", action: "wealth" }, { text: "❤️ سلامتی", action: "heal" }] },
            { text: "🧚 دیشب توی گوشت آرزو خوندم... گفتم کاش این کونی بازم بیاد 💋", options: [{ text: "👂 چی گفتی؟", action: "listen" }, { text: "💋 عاشقمی؟", action: "seduce" }] }
        ],
        day3: [
            { text: "🧚 آرزوی سوم رو من انتخاب می‌کنم: سکس! اونم از نوع وحشی 😜", options: [{ text: "💋 قبول", action: "seduce" }, { text: "🗡️ رد", action: "fight" }] },
            { text: "🧚 آرزوی اول: ثروت، دوم: قدرت، سوم: من! راستی کاندوم داری؟ 😜💋", options: [{ text: "💋 سومی", action: "seduce" }, { text: "💰 اولی", action: "wealth" }] }
        ],
        day4: [
            { text: "🧚 گرد جادویی دارم... هرچی بخوای میشه... حتی می‌تونم کیرت رو بزرگتر کنم 😏", options: [{ text: "💋 عشق", action: "seduce" }, { text: "⚔️ قدرت", action: "power" }] },
            { text: "🧚 می‌دونی پری‌ها چجوری می‌بوسن؟ با زبون جادویی ✨💋", options: [{ text: "💋 نشون بده", action: "kiss" }, { text: "🤝 بگو", action: "listen" }] }
        ],
        day5: [
            { text: "🧚 ۳ تا آرزو بکن... سومی رو من می‌گم: کیرت رو می‌خوام 🫣", options: [{ text: "💋 بگو", action: "seduce" }, { text: "🔮 خودم می‌گم", action: "wish" }] },
            { text: "🧚 دیشب توی خوابم بودی... داشتیم وحشیانه... بعد بیدار شدم 🫣💔", options: [{ text: "💋 امشب واقعی", action: "kiss" }, { text: "🤝 حیف شد", action: "listen" }] }
        ],
        day6: [
            { text: "🧚 پری‌ها عاشق نمیشن ولی من یه ذره شدم... یعنی کیرت جادو داره؟", options: [{ text: "🔥 از جلو", action: "seduce" }, { text: "🍑 از پشت", action: "seduce" }, { text: "👄 دهنی", action: "kiss" }] },
            { text: "🧚 جادوی من مال تو... همه چیزم... حتی بکارتم 💋✨", options: [{ text: "💋 ببوس", action: "kiss" }, { text: "🔥 بکنم", action: "seduce" }] }
        ],
        day7: [
            { text: "🧚 باشه قبول... عاشق شدم... حالا بکن منو یا برو 💋😜", options: [{ text: "💋 می‌کنم", action: "kiss" }, { text: "👰 ازدواج", action: "propose" }] },
            { text: "🧚 هر آرزویی بکنی برآورده میشه... ولی آرزوی من فقط کیر توئه 🫣🔥", options: [{ text: "🔥 آرزوی عشق", action: "seduce" }, { text: "💰 آرزوی ثروت", action: "wealth" }] }
        ],
        harem: [
            { text: "🧚 شوهرم... برات یه سورپرایز دارم! حدس بزن چی پوشیدم... هیچی! ✨", options: [{ text: "🔥 میام", action: "seduce" }, { text: "💋 بگو", action: "kiss" }] },
            { text: "🧚 امروز توی باغ گلهای جادویی کاشتم... می‌دونی چیکار می‌کنن؟ آدمو بی‌اختیار سکسی می‌کنن 🌸", options: [{ text: "🌿 بو کنم", action: "ally" }, { text: "💋 چه جالب", action: "kiss" }] }
        ]
    }
};
    angel: {
        day1: [
            { text: "👼 نگران نباش مسافر... کمکت می‌کنم... ولی اگه دستت رو بذاری روی بالام می‌سوزی 😇", options: [{ text: "❤️ شفا", action: "heal" }, { text: "💋 ممنون", action: "seduce" }] },
            { text: "👼 من فرشته‌ام... نباید این حرفا رو بزنم... ولی کیرت رو توی خواب دیدم 😳", options: [{ text: "👂 بگو", action: "listen" }, { text: "💋 ادامه بده", action: "seduce" }] }
        ],
        day2: [
            { text: "👼 دوباره زخمی شدی؟ بیا شفا بدم... راستی می‌دونی فرشته‌ها چجوری شفا می‌دن؟ با بوسه 💋", options: [{ text: "❤️ شفا", action: "heal" }, { text: "💋 ببوس", action: "seduce" }] },
            { text: "👼 خدا ببخشه... وقتی نگام می‌کنی بال‌هام سیخ میشه... اون پایینم 😳", options: [{ text: "💋 جدی؟", action: "kiss" }, { text: "🤝 چرا؟", action: "listen" }] }
        ],
        day3: [
            { text: "👼 من نباید عاشق بشم... ولی کیر تو از بهشت هم بهتره 😈", options: [{ text: "💋 عشق ممنوعه", action: "seduce" }, { text: "👼 برو بهشت", action: "free" }] },
            { text: "👼 این گناهه... ولی چرا اینقدر خوبه؟ آدم از گناه کردن با تو لذت می‌بره 😳", options: [{ text: "💋 چون عشقه", action: "kiss" }, { text: "🤝 گناه نیست", action: "ally" }] }
        ],
        day4: [
            { text: "👼 دیشب دعا می‌کردم... بعد رسیدم به اینجا که چرا کیر تو اینقدر خوشمزه‌ست 🙏", options: [{ text: "💋 نماز رو شکستی", action: "kiss" }, { text: "🤝 حرومه", action: "listen" }] },
            { text: "👼 بذار بال‌هام رو لمس کنی... ولی اگه تحریک شدم تقصیر خودته 🫣", options: [{ text: "🖐️ لمس کن", action: "ally" }, { text: "💋 تحریک شو", action: "kiss" }] }
        ],
        day5: [
            { text: "👼 حاضرم بسوزم فقط یه بار بغلت کنم... یا شاید دوبار... یا هفت بار 🔥", options: [{ text: "💋 بغلم کن", action: "kiss" }, { text: "🤝 نمی‌خوام بسوزی", action: "ally" }] },
            { text: "👼 لب‌هام میلرزه... بوسیدن چه حسی داره؟ یا بهتره بگم ساک زدن چه حسی داره؟ 😳", options: [{ text: "💋 امتحان کن", action: "kiss" }, { text: "🤝 خوبه", action: "listen" }] }
        ],
        day6: [
            { text: "👼 دیگه برام مهم نیست خدا چی می‌گه... بهشت رو با کیر تو عوض می‌کنم 💋", options: [{ text: "🔥 از جلو", action: "seduce" }, { text: "🍑 از پشت", action: "seduce" }, { text: "👄 دهنی", action: "kiss" }] },
            { text: "👼 من سقوط کردم از آسمون برای تو... ارزشش رو داشت 👼💋", options: [{ text: "💋 ارزش داشت", action: "kiss" }, { text: "🔥 بکنم", action: "seduce" }] }
        ],
        day7: [
            { text: "👼 حالا یه فرشته گناه‌کارم... مال توام... بکن منو هر وقت خواستی 😈", options: [{ text: "💋 مال منی", action: "kiss" }, { text: "🔥 بیا", action: "seduce" }] },
            { text: "👼 هر شب به جای دعا... دعا می‌کنم کیرت زودتر بیاد 🫣💋", options: [{ text: "💋 اومد", action: "kiss" }, { text: "👰 ازدواج آسمونی", action: "propose" }] }
        ],
        harem: [
            { text: "👼 شوهرم... برات دعا کردم امروز... دعا کردم امشب بیای پیشم 🙏", options: [{ text: "🔥 میام", action: "seduce" }, { text: "💋 بیا بغلم", action: "kiss" }] },
            { text: "👼 خدا رو شکر که تو رو دارم... و کیرت رو 💕", options: [{ text: "💋 شکر", action: "kiss" }, { text: "🤝 همیشه", action: "ally" }] }
        ]
    },
    knight: {
        day1: [
            { text: "⚔️ ای غریبه! شمشیرت رو بکش! یا اون یکی شمشیرت رو 😏", options: [{ text: "⚔️ می‌جنگم", action: "fight" }, { text: "🤝 دوست", action: "ally" }, { text: "🏃 فرار", action: "flee" }] },
            { text: "⚔️ فقط یه بار شکست خوردم اونم تو بودی! حالا می‌خوام انتقام بگیرم... توی تخت 😈", options: [{ text: "⚔️ دوباره", action: "fight" }, { text: "💋 بیا تخت", action: "kiss" }] }
        ],
        day2: [
            { text: "⚔️ دفعه قبل خوب جنگیدی... ولی توی تخت چی؟ بازم خوبی؟ 😏", options: [{ text: "⚔️ بجنگ", action: "fight" }, { text: "💋 امتحان کن", action: "seduce" }] },
            { text: "⚔️ چرا هر روز میای؟ می‌خوای تحقیرم کنی یا می‌خوای بکنیم؟", options: [{ text: "🤝 هیچکدوم", action: "ally" }, { text: "💋 هردو", action: "seduce" }] }
        ],
        day3: [
            { text: "⚔️ شب‌ها به جنگیدن با تو فکر می‌کنم... بعدش به سکس با تو 🫣", options: [{ text: "⚔️ بجنگیم", action: "fight" }, { text: "💋 سکس", action: "kiss" }] },
            { text: "⚔️ زره‌ام رو درآوردم... سنگینه... می‌خوای بقیه لباسامم دربیارم؟ 😳", options: [{ text: "🖐️ بذار ببینم", action: "ally" }, { text: "💋 دربیار", action: "seduce" }] }
        ],
        day4: [
            { text: "⚔️ دستت قویه... ولی ملایم... می‌تونی خشن تر باشی 😈", options: [{ text: "🖐️ لمس کن", action: "ally" }, { text: "💋 خشن", action: "kiss" }] },
            { text: "⚔️ می‌خوام یه نبرد دیگه... توی تخت... بدون زره 😳🔥", options: [{ text: "🔥 بیا", action: "seduce" }, { text: "💋 اول ببوس", action: "kiss" }] }
        ],
        day5: [
            { text: "⚔️ تسلیم شدم... همه چیزم مال تو... حتی کونم 😳", options: [{ text: "💋 مال منی", action: "kiss" }, { text: "🔥 بکنم", action: "seduce" }] },
            { text: "⚔️ زره‌ام بازه... دیگه دفاعی ندارم... بیا هرکاری می‌خوای بکن 🫣", options: [{ text: "🔥 از جلو", action: "seduce" }, { text: "🍑 از پشت", action: "seduce" }] }
        ],
        day6: [
            { text: "⚔️ فقط تو می‌تونی منو شکست بدی... توی جنگ و توی تخت 💋", options: [{ text: "🔥 از جلو", action: "seduce" }, { text: "🍑 از پشت", action: "seduce" }, { text: "👄 دهنی", action: "kiss" }] },
            { text: "⚔️ من شوالیه‌ام... ولی برای تو یه کونی معمولی میشم 💋", options: [{ text: "💋 نه", action: "kiss" }, { text: "🔥 آره", action: "seduce" }] }
        ],
        day7: [
            { text: "⚔️ شوالیه تو شدم... تا ابد... هرجا بگی می‌جنگم ⚔️💋", options: [{ text: "💋 تا ابد", action: "kiss" }, { text: "👰 ازدواج", action: "propose" }] },
            { text: "⚔️ هر شب منتظرتم... بدون زره... آماده برای جنگ 🔥", options: [{ text: "🔥 میام", action: "seduce" }, { text: "💋 منتظر باش", action: "kiss" }] }
        ],
        harem: [
            { text: "⚔️ شوهرم... امروز تمرین داریم؟ تمرین سکس یا شمشیرزنی؟ 😏", options: [{ text: "⚔️ شمشیر", action: "fight" }, { text: "🔥 سکس", action: "seduce" }, { text: "💋 هردو", action: "kiss" }] }
        ]
    },
    werewolf: {
        day1: [
            { text: "🐺 غرررر! عقب برو کصکش! گازت می‌گیرم و تیکه تیکه‌ات می‌کنم!", options: [{ text: "🗡️ حمله", action: "fight" }, { text: "💋 آروم باش", action: "seduce" }, { text: "🏃 فرار", action: "flee" }] },
            { text: "🐺 ماه کامله... و من توی قفس... کیرم داره منفجر میشه از بس که نکردم", options: [{ text: "🔓 آزادت کنم", action: "free" }, { text: "💋 می‌خوام کمکت کنم", action: "seduce" }] }
        ],
        day2: [
            { text: "🐺 چرا انقدر نزدیک میشی؟... شام امشبمی یا عشق؟", options: [{ text: "🍖 غذا دارم", action: "gift" }, { text: "💋 عشق", action: "seduce" }] },
            { text: "🐺 دستت... گرمه... مثل خون تازه... یا مثل کیر داغ 😈", options: [{ text: "🖐️ لمس کن", action: "ally" }, { text: "💋 گرمه", action: "kiss" }] }
        ],
        day3: [
            { text: "🐺 وقتی میای... یه حسی بهم می‌گه... شکارت نکنم... بکنمت 😏", options: [{ text: "🤝 دوست", action: "ally" }, { text: "💋 بکن", action: "seduce" }] },
            { text: "🐺 هیچکس تا حالا اینقدر نزدیک نشده بود... بدون اینکه تیکه‌اش کنم", options: [{ text: "🖐️ نزدیک‌تر", action: "ally" }, { text: "💋 ببوس", action: "kiss" }] }
        ],
        day4: [
            { text: "🐺 دستاتو بذار رو صورتم... قبل اینکه تبدیل شی... یا قبل اینکه بکنمت 🫣", options: [{ text: "🖐️ می‌ذارم", action: "ally" }, { text: "💋 ببوس", action: "kiss" }] },
            { text: "🐺 می‌خوام تبدیلت کنم به گرگ... با هم شکار کنیم... بعدش با هم سکس 😈", options: [{ text: "🐺 تبدیل کن", action: "potion" }, { text: "💋 با هم", action: "seduce" }] }
        ],
        day5: [
            { text: "🐺 نمی‌دونم چیه... ولی وقتی نیستی... زوزه می‌کشم... و جق می‌زنم 💔", options: [{ text: "💋 منم دلتنگ میشم", action: "kiss" }, { text: "🔥 بیا", action: "seduce" }] },
            { text: "🐺 دیشب ماه کامل بود... و من به جای شکار... به کیر تو فکر می‌کردم 🌕", options: [{ text: "💋 عاشقی", action: "kiss" }, { text: "🔥 بکنم", action: "seduce" }] }
        ],
        day6: [
            { text: "🐺 مال تو شدم... آلفای من... هر کاری بگی می‌کنم 🐺💋", options: [{ text: "🔥 از جلو", action: "seduce" }, { text: "🍑 از پشت", action: "seduce" }, { text: "👄 دهنی", action: "kiss" }] },
            { text: "🐺 بیا نزدیک‌تر... بذار گرمای کیرت رو حس کنم 🔥💋", options: [{ text: "🔥 حس کن", action: "seduce" }, { text: "💋 ببوس", action: "kiss" }] }
        ],
        day7: [
            { text: "🐺 فقط تو می‌تونی آرومم کنی... فقط کیر تو 🐺💋", options: [{ text: "💋 آروم باش", action: "kiss" }, { text: "👰 همدم همیشگی", action: "propose" }] },
            { text: "🐺 تا ابد گرگ تو می‌مونم... وفادار و وحشی 🐺🔥", options: [{ text: "💋 تا ابد", action: "kiss" }, { text: "🔥 بیا", action: "seduce" }] }
        ],
        harem: [
            { text: "🐺 شوهرم... امشب ماه کامله... می‌دونی یعنی چی؟ وحشی میشم 🌕🔥", options: [{ text: "🔥 وحشی شو", action: "seduce" }, { text: "💋 آروم باش", action: "kiss" }] },
            { text: "🐺 دلم می‌خواد بریم شکار... بعدش سکس توی جنگل 🐺🗡️", options: [{ text: "🐺 بریم", action: "ally" }, { text: "💋 بمون", action: "kiss" }] }
        ]
    },
    bride: {
        day1: [
            { text: "👰 من بدشانس‌ترین عروس دنیام... شوهرم سر شب عروسی فرار کرد... کیرش رو می‌خوام قطع کنم", options: [{ text: "🤝 کمک", action: "help" }, { text: "💋 من خیانت نمی‌کنم", action: "seduce" }] },
            { text: "👰 از عروسی فرار کردم... داماد یه کونی بود... تو که نیستی؟", options: [{ text: "💍 با من ازدواج کن", action: "propose" }, { text: "🤝 نیستم", action: "help" }] }
        ],
        day2: [
            { text: "👰 تو هم مثل بقیه‌ای؟ می‌خوای منو بکنی و بری؟", options: [{ text: "🤝 نه", action: "ally" }, { text: "💋 می‌مونم", action: "seduce" }] },
            { text: "👰 چرا اینقدر بهم توجه می‌کنی؟ مگه کیرت woobly شده؟", options: [{ text: "💋 لیاقت داری", action: "kiss" }, { text: "🤝 داری", action: "ally" }] }
        ],
        day3: [
            { text: "👰 دیشب خواب دیدم با یه غریبه ازدواج کردم... بعدش سکس وحشی... شاید تو بودی 🫣", options: [{ text: "💋 من بودم", action: "kiss" }, { text: "💍 ازدواج", action: "propose" }] },
            { text: "👰 من از عشق فرار کردم... ولی انگار عشق دنبالمه... یا شاید کیر تو", options: [{ text: "💋 عشق منم", action: "seduce" }, { text: "🤝 آروم باش", action: "ally" }] }
        ],
        day4: [
            { text: "👰 دستت رو بده... ببینم حلقه داری؟ اگه نداری کیرت رو می‌گیرم 💍", options: [{ text: "💍 دارم", action: "propose" }, { text: "🤝 ندارم", action: "ally" }] },
            { text: "👰 اگه تو داماد بودی... لباس عروسیم رو خودت درمیاری 🫣", options: [{ text: "💋 درمیارم", action: "kiss" }, { text: "💍 دامادم", action: "propose" }] }
        ],
        day5: [
            { text: "👰 من حاضرم دوباره عروسی کنم... با تو... یا فقط سکس با تو 💋", options: [{ text: "💍 عروسی", action: "propose" }, { text: "💋 سکس", action: "kiss" }] },
            { text: "👰 لباس عروسم هنوز تنمه... می‌خوای درش بیاری؟ زیرش چیزی نپوشیدم 🫣🔥", options: [{ text: "🔥 درمیارم", action: "seduce" }, { text: "💋 اول ببوس", action: "kiss" }] }
        ],
        day6: [
            { text: "👰 این دفعه... مطمئنم که فرار نمی‌کنم... مخصوصاً با این کیر", options: [{ text: "🔥 از جلو", action: "seduce" }, { text: "🍑 از پشت", action: "seduce" }, { text: "👄 دهنی", action: "kiss" }] },
            { text: "👰 من عروس تو شدم... برای همیشه... حالا شب اوله 👰💋", options: [{ text: "💋 شب اول", action: "kiss" }, { text: "🔥 بکنم", action: "seduce" }] }
        ],
        day7: [
            { text: "👰 هر شب با لباس عروسم منتظرتم... و بدون لباس زیر 🫣🔥", options: [{ text: "🔥 میام", action: "seduce" }, { text: "💋 منتظر باش", action: "kiss" }] },
            { text: "👰 بهترین تصمیم زندگیم... فرار نکردن از کیر تو 💋", options: [{ text: "💋 بهترینی", action: "kiss" }, { text: "👶 بچه‌دار شیم", action: "seduce" }] }
        ],
        harem: [
            { text: "👰 شوهرم... امروز سالگرد آشناییمونه... بیا جشن بگیریم 💍", options: [{ text: "💍 مبارکه", action: "gift" }, { text: "🔥 جشن", action: "seduce" }] },
            { text: "👰 برات یه لباس جدید دوختم... ولی زیرش هیچی نیست 👗", options: [{ text: "👗 بپوش", action: "ally" }, { text: "🔥 نشون بده", action: "seduce" }] }
        ]
    }
};
    mermaid: {
        day1: [
            { text: "🧜‍♀️ سلام مسافر... آواز منو شنیدی؟ یا فقط سینه‌هام رو دیدی؟ 😏", options: [{ text: "🎵 گوش کن", action: "listen" }, { text: "💋 هردو", action: "seduce" }, { text: "🏃 برو", action: "flee" }] },
            { text: "🧜‍♀️ می‌تونی آرزوت رو بگی... ولی آرزوی سکس توی آب هزینه‌اش بیشتره 😈", options: [{ text: "💋 عشق", action: "seduce" }, { text: "💰 ثروت", action: "wealth" }] }
        ],
        day2: [
            { text: "🧜‍♀️ دوباره اومدی... دلت برام تنگ شده یا فقط horny شدی؟ 😏", options: [{ text: "💋 هردو", action: "kiss" }, { text: "🎵 آواز بخون", action: "listen" }] },
            { text: "🧜‍♀️ تو تنها انسانی که از من نمی‌ترسه... بقیه فکر می‌کنن می‌خوام غرقشون کنم", options: [{ text: "💋 نمی‌ترسم", action: "seduce" }, { text: "🤝 دوستم", action: "ally" }] }
        ],
        day3: [
            { text: "🧜‍♀️ می‌خوای بیای زیر آب؟... جایی که هیچ‌کس نمی‌تونه ببینتمون... و اکسیژن هم نیست 😈", options: [{ text: "🔥 بیا", action: "seduce" }, { text: "💋 اول ببوس", action: "kiss" }] },
            { text: "🧜‍♀️ آواز من جادو داره... می‌تونه شلوارت رو دربیاره بدون اینکه دست بزنی", options: [{ text: "💋 امتحان کن", action: "kiss" }, { text: "🎵 بخون", action: "listen" }] }
        ],
        day4: [
            { text: "🧜‍♀️ پری‌های دریایی عاشق نمی‌شن... ولی کیر تو مثل گنج زیر آب می‌مونه 🫣", options: [{ text: "💋 عاشق شدی", action: "kiss" }, { text: "🤝 گنج", action: "listen" }] },
            { text: "🧜‍♀️ دلم می‌خواد پا داشته باشم... تا بتونم دور کمرت پام رو حلقه کنم", options: [{ text: "💋 کنارمی", action: "kiss" }, { text: "🔮 آرزو کن", action: "wish" }] }
        ],
        day5: [
            { text: "🧜‍♀️ تو متفاوتی... مثل بقیه humanها نیستی... کیرت هم متفاوته", options: [{ text: "💋 عاشقتم", action: "kiss" }, { text: "🔥 بکنم", action: "seduce" }] },
            { text: "🧜‍♀️ می‌خوام تا ابد با تو بمونم... توی دریا... سکس زیر آب 💋", options: [{ text: "💋 بمون", action: "kiss" }, { text: "👰 ازدواج دریایی", action: "propose" }] }
        ],
        day6: [
            { text: "🧜‍♀️ امروز می‌خوام مال تو باشم... کاملاً... تا آخرین فلس 🫣", options: [{ text: "🔥 از جلو", action: "seduce" }, { text: "🍑 از پشت", action: "seduce" }, { text: "👄 دهنی", action: "kiss" }] },
            { text: "🧜‍♀️ هیچ‌کس نمی‌دونه زیر آب چه خبره... ماهی‌ها شاهد بودن 😈", options: [{ text: "🔥 بکنم", action: "seduce" }, { text: "💋 ببوس", action: "kiss" }] }
        ],
        day7: [
            { text: "🧜‍♀️ تا ابد مال تو... توی دریا یا خشکی... هرجا بگی 💋", options: [{ text: "💋 مال منی", action: "kiss" }, { text: "👶 بچه پری", action: "seduce" }] },
            { text: "🧜‍♀️ هر شب برات آواز می‌خونم... آواز سکسی 🎵💋", options: [{ text: "🎵 بخون", action: "listen" }, { text: "💋 ببوس", action: "kiss" }] }
        ],
        harem: [
            { text: "🧜‍♀️ شوهرم... برات یه مروارید سیاه پیدا کردم... می‌دونی از کجا؟ 🦪", options: [{ text: "💎 کجا؟", action: "gift" }, { text: "💋 بگو", action: "kiss" }] },
            { text: "🧜‍♀️ دلم برای دریا تنگ شده... می‌خوام توی آب بکنیم 💙", options: [{ text: "🌊 بریم", action: "ally" }, { text: "💋 بیا", action: "kiss" }] }
        ]
    },
    skeleton: {
        day1: [
            { text: "💀 گوشت داری کثافت؟! گرسنمه! یا گوشت یا کیر رو می‌خورم", options: [{ text: "🍖 بده", action: "gift" }, { text: "🗡️ بجنگ", action: "fight" }, { text: "💋 عشق", action: "seduce" }] },
            { text: "💀 من زنده نیستم... ولی کیر تو رو که ببینم زنده میشم", options: [{ text: "🗡️ بجنگ", action: "fight" }, { text: "💋 زنده شو", action: "seduce" }] }
        ],
        day2: [
            { text: "💀 دیشب خواب دیدم گوشت دارم... گوشت کیر تو رو 🫣", options: [{ text: "👂 جدی؟", action: "listen" }, { text: "💋 می‌خوای؟", action: "seduce" }] },
            { text: "💀 استخونام... وقتی نزدیکمی... جیر جیر می‌کنن... از خوشحالی", options: [{ text: "🖐️ لمس کن", action: "ally" }, { text: "💋 خوشحالن", action: "kiss" }] }
        ],
        day3: [
            { text: "💀 قلب ندارم... ولی یه چیزی توی سینه‌م وایمیسته وقتی می‌بینمت", options: [{ text: "💋 عشقه", action: "kiss" }, { text: "🤝 چیه؟", action: "listen" }] },
            { text: "💀 شاید این دفعه نکشمت... شاید فقط بکنمت", options: [{ text: "🤝 ممنون", action: "ally" }, { text: "💋 بکن", action: "seduce" }] }
        ],
        day4: [
            { text: "💀 دستت رو بذار روی استخونام... قبل اینکه بشکنن... یا قبل اینکه ارگاسم کنن", options: [{ text: "🖐️ می‌ذارم", action: "ally" }, { text: "💋 ارگاسم", action: "kiss" }] },
            { text: "💀 وقتی تو هستی... حس می‌کنم زنده‌ام... مخصوصاً اون پایین", options: [{ text: "💋 زنده‌ای", action: "kiss" }, { text: "🔥 حس کن", action: "seduce" }] }
        ],
        day5: [
            { text: "💀 عاشق یه زنده شدم! کی فکرش رو می‌کرد؟! 💀💋", options: [{ text: "💋 منم عاشقتم", action: "kiss" }, { text: "🔥 بیا", action: "seduce" }] },
            { text: "💀 گوشت می‌خوام... ولی فقط گوشت کیر تو 🫣😂💋", options: [{ text: "🔥 بخور", action: "seduce" }, { text: "💋 ببوس", action: "kiss" }] }
        ],
        day6: [
            { text: "💀 هر شب برات می‌رقصم... استخونام به هم می‌خورن... ریتم سکسی 💃🦴", options: [{ text: "🔥 از جلو", action: "seduce" }, { text: "🍑 از پشت", action: "seduce" }, { text: "👄 دهنی", action: "kiss" }] },
            { text: "💀 امروز می‌خوام زنده باشم... با کیر تو 🫣", options: [{ text: "💋 زنده‌ای", action: "kiss" }, { text: "🔥 بکنم", action: "seduce" }] }
        ],
        day7: [
            { text: "💀 تا ابد اسکلت عاشق تو... 💀💋", options: [{ text: "💋 تا ابد", action: "kiss" }, { text: "👰 ازدواج استخونی", action: "propose" }] },
            { text: "💀 استخونام مال تو... هر سوراخم که می‌خوای 💋", options: [{ text: "💋 مال منی", action: "kiss" }, { text: "🔥 بیا", action: "seduce" }] }
        ],
        harem: [
            { text: "💀 شوهرم... امروز یه استخون جدید پیدا کردم... می‌خوای ببینیش؟ 🦴", options: [{ text: "🦴 ببینم", action: "ally" }, { text: "💋 بیا", action: "kiss" }] }
        ]
    },
    bandit_female: {
        day1: [
            { text: "🦹‍♀️ پولتو بده جنده! یا پول یا کیرت رو می‌گیرم گرو", options: [{ text: "💰 بده", action: "trade" }, { text: "💋 عشق", action: "seduce" }, { text: "🗡️ حمله", action: "fight" }] },
            { text: "🦹‍♀️ من راهزنم کثافت! از هیچی نمی‌ترسم! از کیر تو هم نه", options: [{ text: "🗡️ بجنگ", action: "fight" }, { text: "💋 بترس", action: "seduce" }] }
        ],
        day2: [
            { text: "🦹‍♀️ هر روز میای اینجا... دلت می‌خوای منو ببینی یا بکنی؟", options: [{ text: "💋 هردو", action: "seduce" }, { text: "💰 پول", action: "trade" }] },
            { text: "🦹‍♀️ من دزدم... ولی دلم رو نمی‌تونم بدزدم... دزدیده شد", options: [{ text: "💋 دزدیدم", action: "kiss" }, { text: "🤝 نمی‌خوام", action: "ally" }] }
        ],
        day3: [
            { text: "🦹‍♀️ شاید تو بتونی منو عوض کنی... یا شاید من عوض کنم", options: [{ text: "🤝 عوض شو", action: "ally" }, { text: "💋 عوض کن", action: "seduce" }] },
            { text: "🦹‍♀️ تو قلبم رو دزدیدی... ولی کیرت رو می‌خوام", options: [{ text: "💋 قلبم مال تو", action: "kiss" }, { text: "🤝 جبران کن", action: "ally" }] }
        ],
        day4: [
            { text: "🦹‍♀️ اگه آزادم کنی... قول می‌دم فقط کیر تو رو بدزدم", options: [{ text: "🔓 آزاد", action: "free" }, { text: "💋 فقط منو بدزد", action: "seduce" }] },
            { text: "🦹‍♀️ من راهزنم... ولی برای کیر تو... تسلیمم 💋", options: [{ text: "💋 تسلیم شو", action: "kiss" }, { text: "🔥 بکنم", action: "seduce" }] }
        ],
        day5: [
            { text: "🦹‍♀️ تمام گنج‌هایی که دزدیدم... به پای کیر تو نمی‌رسن", options: [{ text: "💋 عاشقمی", action: "kiss" }, { text: "💰 گنجات کو", action: "trade" }] },
            { text: "🦹‍♀️ بیا... این دفعه منو تو بدزد... و هرکاری می‌خوای بکن 🫣", options: [{ text: "🔥 می‌دزدم", action: "seduce" }, { text: "💋 اول ببوس", action: "kiss" }] }
        ],
        day6: [
            { text: "🦹‍♀️ من دیگه دزد نیستم... فقط کیر تو رو می‌دزدم 💋", options: [{ text: "🔥 از جلو", action: "seduce" }, { text: "🍑 از پشت", action: "seduce" }, { text: "👄 دهنی", action: "kiss" }] },
            { text: "🦹‍♀️ بهترین گنج تویی... یا کیرت", options: [{ text: "💋 بهترینی", action: "kiss" }, { text: "🔥 بکنم", action: "seduce" }] }
        ],
        day7: [
            { text: "🦹‍♀️ مال تو شدم... برای همیشه... حالا بکن یا بدزد 💋", options: [{ text: "💋 مال منی", action: "kiss" }, { text: "👰 ازدواج", action: "propose" }] },
            { text: "🦹‍♀️ فقط عشق تو رو می‌دزدم... و کیرت رو 💋", options: [{ text: "💋 بدزد", action: "kiss" }, { text: "🔥 بیا", action: "seduce" }] }
        ],
        harem: [
            { text: "🦹‍♀️ شوهرم... برات یه چیز دزدیدم... از خزانه خودت 🤫", options: [{ text: "💰 چیه؟", action: "gift" }, { text: "💋 ممنون", action: "kiss" }] },
            { text: "🦹‍♀️ دلم می‌خواد دوباره دزدی کنم... ولی فقط کیر تو رو 🦹", options: [{ text: "🚫 نه", action: "ally" }, { text: "💋 بیا", action: "kiss" }] }
        ]
    },
    singer: {
        day1: [
            { text: "👩‍🎤 می‌خوای برات آواز بخونم؟ آوازام جوری میکنه که شلوارت خودبخود باز بشه 🎵", options: [{ text: "🎵 بخون", action: "listen" }, { text: "💋 عشق", action: "seduce" }] },
            { text: "👩‍🎤 صدای من می‌تونه کیرت رو به ارگاسم برسونه بدون دست زدن", options: [{ text: "🎵 امتحان کن", action: "listen" }, { text: "💋 تسخیر شدم", action: "seduce" }] }
        ],
        day2: [
            { text: "👩‍🎤 دیشب برات یه آهنگ سکسی نوشتم... می‌خوای بخونم یا عمل کنم؟", options: [{ text: "🎵 بخون", action: "listen" }, { text: "💋 عمل کن", action: "kiss" }] },
            { text: "👩‍🎤 وقتی می‌خونم... انگار همه دنیا مال منه... مخصوصاً کیر تو", options: [{ text: "🎵 بخون", action: "listen" }, { text: "💋 مال تو", action: "seduce" }] }
        ],
        day3: [
            { text: "👩‍🎤 می‌خوای برات خصوصی بخونم؟ توی اتاق... بدون لباس 🫣", options: [{ text: "🏠 بیا", action: "ally" }, { text: "💋 خصوصی", action: "seduce" }] },
            { text: "👩‍🎤 آوازهای من می‌تونن عاشقت کنن... یا سکسی", options: [{ text: "💋 شدم", action: "kiss" }, { text: "🎵 بخون", action: "listen" }] }
        ],
        day4: [
            { text: "👩‍🎤 هیچ‌کس مثل تو آواز منو درک نکرده... یا شاید کیر تو", options: [{ text: "💋 درک می‌کنم", action: "kiss" }, { text: "🎵 ادامه بده", action: "listen" }] },
            { text: "👩‍🎤 دلم می‌خواد تا صبح برات بخونم... و بکنمت", options: [{ text: "🎵 بخون", action: "listen" }, { text: "💋 بکن", action: "seduce" }] }
        ],
        day5: [
            { text: "👩‍🎤 عاشقتم... می‌خوام اینو توی آوازم بگم... یا با کونم 🎵💋", options: [{ text: "💋 بگو", action: "kiss" }, { text: "🎵 بخون", action: "listen" }] },
            { text: "👩‍🎤 صدای من فقط برای توئه... کونم هم فقط برای تو", options: [{ text: "💋 برای من", action: "kiss" }, { text: "🔥 بیا", action: "seduce" }] }
        ],
        day6: [
            { text: "👩‍🎤 امروز می‌خوام برات یه آواز خاص بخونم... آواز ارگاسم 🫣", options: [{ text: "🔥 از جلو", action: "seduce" }, { text: "🍑 از پشت", action: "seduce" }, { text: "👄 دهنی", action: "kiss" }] },
            { text: "👩‍🎤 موسیقی عشق... با ساز بدنمون... و کیر تو 🎵🔥", options: [{ text: "🔥 بزن", action: "seduce" }, { text: "💋 آروم", action: "kiss" }] }
        ],
        day7: [
            { text: "👩‍🎤 تا ابد برات می‌خونم... و می‌کنمت 🎵💋", options: [{ text: "💋 تا ابد", action: "kiss" }, { text: "👰 ازدواج", action: "propose" }] },
            { text: "👩‍🎤 آواز آخر... آواز عشق ابدی... و کیر ابدی 🎵💍", options: [{ text: "🎵 بخون", action: "listen" }, { text: "💋 ببوس", action: "kiss" }] }
        ],
        harem: [
            { text: "👩‍🎤 شوهرم... برات یه آهنگ جدید نوشتم... آهنگ سکس 🎵", options: [{ text: "🎵 بخون", action: "listen" }, { text: "🔥 سکس", action: "seduce" }] },
            { text: "👩‍🎤 امشب کنسرت خصوصی داریم... فقط برای تو 🎤", options: [{ text: "🎤 بیا", action: "ally" }, { text: "💋 منتظرم", action: "kiss" }] }
        ]
    }
};
    genie: {
        day1: [
            { text: "🧝‍♀️ آزادم کردی! ۳ تا آرزو می‌تونی بکنی... اگه آرزوی سکس کنی ۴ تا میشه 😈", options: [{ text: "💎 ثروت", action: "wealth" }, { text: "⚔️ قدرت", action: "power" }, { text: "💋 عشق", action: "seduce" }] },
            { text: "🧝‍♀️ من جن صحرام... هر آرزویی بکنی برآورده میشه... حتی آرزوی یه سکس سه‌نفره با دوتا جن", options: [{ text: "💋 عشق", action: "seduce" }, { text: "💰 پول", action: "wealth" }] }
        ],
        day2: [
            { text: "🧝‍♀️ آرزوی دومت چیه؟ اگه بازم سکس بگی نمی‌گم نه", options: [{ text: "⚔️ قدرت", action: "power" }, { text: "💋 سکس", action: "seduce" }] },
            { text: "🧝‍♀️ می‌دونی جن‌ها چقدر قدرتمندن؟ می‌تونن کیرت رو نامرئی کنن 😂", options: [{ text: "👂 بگو", action: "listen" }, { text: "💋 نکن", action: "seduce" }] }
        ],
        day3: [
            { text: "🧝‍♀️ آرزوی سوم رو خودم انتخاب کنم؟ می‌خوام کیرت رو برای خودم نگه دارم 😈", options: [{ text: "💋 انتخاب کن", action: "seduce" }, { text: "🤝 باشه", action: "ally" }] },
            { text: "🧝‍♀️ می‌تونم عشق رو واقعی کنم... یا فقط سکس رو", options: [{ text: "💋 عشق", action: "kiss" }, { text: "🔮 واقعی کن", action: "wish" }] }
        ],
        day4: [
            { text: "🧝‍♀️ تا حالا عاشق نشدم... ولی کیر تو رو که دیدم...", options: [{ text: "💋 عاشق شو", action: "kiss" }, { text: "🤝 چرا؟", action: "listen" }] },
            { text: "🧝‍♀️ می‌خوام پیشت بمونم... نه به عنوان جن... به عنوان کلفت سکسی 💋", options: [{ text: "💋 بمون", action: "kiss" }, { text: "🔥 کلفت", action: "seduce" }] }
        ],
        day5: [
            { text: "🧝‍♀️ قدرتم رو فدای عشقت می‌کنم... ولی جادوی کیرت رو نه", options: [{ text: "💋 نمی‌خوام", action: "kiss" }, { text: "🤝 فدا نکن", action: "ally" }] },
            { text: "🧝‍♀️ ۱۰۰۰ ساله زنده‌ام... ولی این ۳ روز با کیر تو... بهترین عمرم بود 💋", options: [{ text: "💋 عاشقتم", action: "kiss" }, { text: "🔥 بیا", action: "seduce" }] }
        ],
        day6: [
            { text: "🧝‍♀️ امروز می‌خوام تمام جادوم رو برات استفاده کنم... جادوی سکس 🫣", options: [{ text: "🔥 از جلو", action: "seduce" }, { text: "🍑 از پشت", action: "seduce" }, { text: "👄 دهنی", action: "kiss" }] },
            { text: "🧝‍♀️ جادوی عشق قوی‌ترین جادوست... مخصوصاً با کیر تو 🔮💋", options: [{ text: "💋 جادو کن", action: "kiss" }, { text: "🔥 بکنم", action: "seduce" }] }
        ],
        day7: [
            { text: "🧝‍♀️ تا ابد مال تو... جن یا human... با کیر یا بی کیر 💋", options: [{ text: "💋 مال منی", action: "kiss" }, { text: "👰 ازدواج", action: "propose" }] },
            { text: "🧝‍♀️ آخرین آرزوم... می‌خوام تا ابد کیرت رو بخورم... 💍", options: [{ text: "💋 تا ابد", action: "kiss" }, { text: "👶 بچه جن", action: "seduce" }] }
        ],
        harem: [
            { text: "🧝‍♀️ شوهرم... امروز ۳ تا آرزو داری... ولی من ۴ تا می‌خوام 🔮", options: [{ text: "💋 آرزوی تو", action: "kiss" }, { text: "💰 ثروت", action: "wealth" }] },
            { text: "🧝‍♀️ برات یه طلسم خوش‌شانسی درست کردم... برای سکس ✨", options: [{ text: "✨ ممنون", action: "ally" }, { text: "💋 عاشقتم", action: "kiss" }] }
        ]
    },
    young_witch: {
        day1: [
            { text: "🧙‍♀️ هنوز خیلی چیزا یاد نگرفتم... ولی ساک زدن رو بلدم 😏", options: [{ text: "🔮 طلسم", action: "potion" }, { text: "💋 عشق", action: "seduce" }, { text: "🏃 برو", action: "flee" }] },
            { text: "🧙‍♀️ من شاگرد جادوگرم... ولی توی سکس از استادم بهترم!", options: [{ text: "👂 بگو", action: "listen" }, { text: "💋 نشون بده", action: "seduce" }] }
        ],
        day2: [
            { text: "🧙‍♀️ دیشب یه طلسم جدید یاد گرفتم... طلسم بزرگ کردن کیر 🧪", options: [{ text: "🧪 امتحان کن", action: "potion" }, { text: "💋 لازم نیست", action: "seduce" }] },
            { text: "🧙‍♀️ استادم می‌گه جادوگرا نباید عاشق بشن... ولی نگفت نباید بکنن", options: [{ text: "💋 عاشق شو", action: "seduce" }, { text: "🤝 چرا؟", action: "listen" }] }
        ],
        day3: [
            { text: "🧙‍♀️ می‌خوام طلسم عشق رو امتحان کنم... یا شاید فقط کیرت رو 🫣", options: [{ text: "💋 نترس", action: "kiss" }, { text: "🧪 امتحان کن", action: "potion" }] },
            { text: "🧙‍♀️ تو می‌تونی اولین عشق من باشی... یا اولین کسی که می‌کنه منو", options: [{ text: "💋 باشم", action: "kiss" }, { text: "🤝 افتخار", action: "ally" }] }
        ],
        day4: [
            { text: "🧙‍♀️ طلسم عشق جواب داد... الان دیوونه‌تم... یا شایدم دیوونه کیرت 🫣", options: [{ text: "💋 دیوونه شو", action: "kiss" }, { text: "🔥 بکنم", action: "seduce" }] },
            { text: "🧙‍♀️ استادم اگه بفهمه عاشق شدم... چی میشه؟ می‌ندازتم بیرون؟", options: [{ text: "🤝 نمی‌فهمه", action: "ally" }, { text: "💋 مهم نیست", action: "kiss" }] }
        ],
        day5: [
            { text: "🧙‍♀️ دیگه شاگرد نیستم... کون تو هستم 💋", options: [{ text: "💋 کون من", action: "kiss" }, { text: "🔥 بیا", action: "seduce" }] },
            { text: "🧙‍♀️ برات یه معجون عشق درست کردم... از آب کیر خودت 🧪💋", options: [{ text: "🧪 بخوریم", action: "potion" }, { text: "💋 اول ببوس", action: "kiss" }] }
        ],
        day6: [
            { text: "🧙‍♀️ امروز می‌خوام جادوی سکس رو کامل یادت بدم... 🫣", options: [{ text: "🔥 از جلو", action: "seduce" }, { text: "🍑 از پشت", action: "seduce" }, { text: "👄 دهنی", action: "kiss" }] },
            { text: "🧙‍♀️ جادوی بدن قوی‌تر از جادوی کتاباست... مخصوصاً با کیر تو 🔥", options: [{ text: "🔥 جادو کن", action: "seduce" }, { text: "💋 آروم", action: "kiss" }] }
        ],
        day7: [
            { text: "🧙‍♀️ تا ابد شاگرد عشق تو... یا کون تو 🧙‍♀️💋", options: [{ text: "💋 شاگردم", action: "kiss" }, { text: "👰 ازدواج", action: "propose" }] },
            { text: "🧙‍♀️ استاد عشق... تویی... و کیرت 💍🔥", options: [{ text: "💋 استادت", action: "kiss" }, { text: "👶 بچه جادوگر", action: "seduce" }] }
        ],
        harem: [
            { text: "🧙‍♀️ شوهرم... امروز یه طلسم جدید کشف کردم... طلسم سکس نامحدود 🔮", options: [{ text: "🔮 نشون بده", action: "ally" }, { text: "🔥 امتحان کن", action: "seduce" }] },
            { text: "🧙‍♀️ می‌خوام برات یه معجون مخصوص بسازم... معجون کیر آهنی 🧪", options: [{ text: "🧪 بساز", action: "potion" }, { text: "💋 ممنون", action: "kiss" }] }
        ]
    }
};

// ============ houseDialogues (مدرن) ============
const houseDialogues = {
    'invite_accept': ["🏠 اوکی بابا... میام خونه‌ات...", "🏠 بالاخره یه جای درست و حسابی...", "🏠 خونه‌ات قشنگه... ولی تختت چی؟"],
    'invite_reject': ["😒 نه... حوصله ندارم...", "😒 شاید بعداً... الان گرفتارم...", "😒 نه! نمیام خونه‌ت!"],
    'kick_angry': ["😡 منو بیرون می‌کنی کصکش؟! حالا می‌بینی چی میشه!", "💀 پشیمون میشی از این کارت...", "😤 باشه... ولی برمی‌گردم با داداشم!"],
    'touch': ["🖐️ دستت گرمه... ادامه بده...", "🖐️ بیشتر لمس کن... اون پایین تر...", "🖐️ خوشم میاد از دستات..."],
    'kiss': ["💋 ммm... لبات... مثل عسله...", "💋 دوباره ببوس... معتاد شدم...", "💋 معتاد بوسه‌ات شدم..."],
    'orgy': ["🔥 امروز چه شب وحشی‌ای بود...", "🔥 دیگه نمی‌تونم راه برم...", "🔥 فوق‌العاده بود... بازم می‌خوام..."]
};

// ============ marryDialogues ============
const marryDialogues = {
    'propose_accept': "💍 آره! هزار بار آره! مال تو شدم!",
    'propose_reject': "💍 نه... هنوز آماده نیستم... شاید بعداً",
    'marry_text': "👰 امروز بهترین روز زندگیمه... تا ابد مال تو...",
    'divorce_text': "💔 تموم شد... رفتیم..."
};

// ============ npcConfig ============
const npcConfig = {
    witch: { image: 'witch', emoji: '🧙‍♀️', startPoints: 15 },
    vampire: { image: null, emoji: '🧛‍♀️', startPoints: 15 },
    fairy: { image: 'fairy', emoji: '🧚', startPoints: 20 },
    angel: { image: 'angel', emoji: '👼', startPoints: 20 },
    knight: { image: 'knight', emoji: '⚔️', startPoints: 10 },
    werewolf: { image: 'werewolf', emoji: '🐺', startPoints: 5 },
    bride: { image: null, emoji: '👰', startPoints: 30 },
    mermaid: { image: null, emoji: '🧜‍♀️', startPoints: 25 },
    skeleton: { image: 'skeleton', emoji: '💀', startPoints: 30 },
    bandit_female: { image: null, emoji: '🦹‍♀️', startPoints: 20 },
    singer: { image: null, emoji: '👩‍🎤', startPoints: 35 },
    genie: { image: null, emoji: '🧝‍♀️', startPoints: 10 },
    young_witch: { image: null, emoji: '🧙‍♀️', startPoints: 20 },
    ghost_sexy: { image: 'ghost_sexy', emoji: '👻', startPoints: 25 },
    wizard: { image: 'wizard', emoji: '🧙‍♂️', startPoints: 15 },
    jester: { image: 'jester', emoji: '🎭', startPoints: 30 },
    prince: { image: 'prince', emoji: '🤴', startPoints: 15 },
    sage: { image: 'sage', emoji: '🧙', startPoints: 40 },
    farmer: { image: 'farmer', emoji: '🧑‍🌾', startPoints: 35 },
    blacksmith: { image: 'blacksmith', emoji: '⚒️', startPoints: 30 },
    merchant: { image: 'merchant', emoji: '🧑‍🌾', startPoints: 35 }
};

// ============ prisonDialogues (مدرن) ============
const prisonDialogues = {
    witch: {
        wild: ["🧙‍♀️: گمشو بیرون کصکش!", "🧙‍♀️: نزدیک شی طلسمت می‌کنم!"],
        untrusted: ["🧙‍♀️: بازم اومدی؟!", "🧙‍♀️: دیشب معجون مرگ درست کردم..."],
        familiar: ["🧙‍♀️: دستت رو بده...", "🧙‍♀️: شاید آزادت نکنم..."],
        intimate: ["🧙‍♀️: بیا نزدیک‌تر...", "🧙‍♀️: دستام میلرزه..."],
        tamed: ["🧙‍♀️: تو منو رام کردی... 💋", "🧙‍♀️: مال تو شدم... 💋"]
    }
};

// ============ توابع ============
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
    const npcDialogues = prisonDialogues[npcId];
    if (!npcDialogues) return { text: "🤐 حرفی برای گفتن نداره...", level: relationLevel || "untrusted" };
    const level = relationLevel || "untrusted";
    const levelDialogues = npcDialogues[level] || npcDialogues.untrusted || ["🤐 ..."];
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