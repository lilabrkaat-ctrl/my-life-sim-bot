const config = require('./config');

const dialogues = {
    witch: {
        day1: [
            { text: "🧙‍♀️ گمشو بیرون کصکش! قبل اینکه طلسمت کنم!", options: [{ text: "🗡️ حمله", action: "fight" }, { text: "💋 شیفته شو", action: "seduce" }, { text: "🏃 فرار", action: "flee" }] },
            { text: "🧙‍♀️ بوی کص و کون میاد... آدمیزاده یا حیوون؟!", options: [{ text: "🤝 آدمم", action: "ally" }, { text: "💋 شیفته‌ات شدم", action: "seduce" }, { text: "🏃 فرار", action: "flee" }] }
        ],
        day2: [
            { text: "🧙‍♀️ دوباره تو؟! می‌خوای بمیری کونی؟", options: [{ text: "🎁 هدیه دارم", action: "gift" }, { text: "💋 دلم برات تنگ شده", action: "seduce" }, { text: "🏃 فرار", action: "flee" }] },
            { text: "🧙‍♀️ دیشب توی خواب دیدمت... بازم اومدی؟", options: [{ text: "👂 بگو", action: "listen" }, { text: "💋 بازم می‌خوام ببینمت", action: "seduce" }, { text: "🏃 فرار", action: "flee" }] }
        ],
        day3: [
            { text: "🧙‍♀️ بیا نزدیک... بذار بو کنم ببینم امروز با کی بودی", options: [{ text: "🖐️ نزدیک شو", action: "ally" }, { text: "🎁 هدیه دارم", action: "gift" }, { text: "🔙 بعداً", action: "flee" }] },
            { text: "🧙‍♀️ دستام میلرزه... یا از عصبانیت یا از این که دلم می‌خواد ببینمت", options: [{ text: "💋 عشق", action: "seduce" }, { text: "🤝 عصبانیت", action: "ally" }, { text: "🔙 نه", action: "flee" }] }
        ],
        day4: [
            { text: "🧙‍♀️ دیگه نمی‌تونم... اینقدر داغم که جادوهام خودبخود فعال میشن", options: [{ text: "💋 ببوس", action: "kiss" }, { text: "🔥 بکنم", action: "seduce" }, { text: "🔙 بعداً", action: "flee" }] },
            { text: "🧙‍♀️ معجون عشق رو با هم بخوریم... بعدش هرکاری می‌خوای بکن", options: [{ text: "🧪 بخوریم", action: "potion" }, { text: "💋 اول ببوس", action: "kiss" }, { text: "🔙 هیچکدوم", action: "flee" }] }
        ],
        day5: [
            { text: "🧙‍♀️ فقط تو می‌تونی آرومم کنی... با اون کیر جادوییت", options: [{ text: "💋 در آغوش بگیر", action: "kiss" }, { text: "🔥 بکنم", action: "seduce" }, { text: "🎁 هدیه", action: "gift" }] },
            { text: "🧙‍♀️ می‌خوام تا ابد کیرت رو بخورم", options: [{ text: "👰 ازدواج کن", action: "propose" }, { text: "💋 اول ببوس", action: "kiss" }, { text: "🔙 بعداً", action: "flee" }] }
        ],
        day6: [
            { text: "🧙‍♀️ ارباب من... امروز چجور می‌خوای بکنی منو؟", options: [{ text: "🔥 از جلو", action: "seduce" }, { text: "🍑 از پشت", action: "seduce" }, { text: "👄 دهنی", action: "kiss" }] },
            { text: "🧙‍♀️ برات یه معجون سکسی درست کردم... بکن منو با این؟", options: [{ text: "🧪 بکنم", action: "potion" }, { text: "💋 اول ببوس", action: "kiss" }, { text: "🔙 بعداً", action: "flee" }] }
        ],
        day7: [
            { text: "🧙‍♀️ تا آخر عمر حاضر نیستم از کیرت جدا شم", options: [{ text: "💋 ببوس", action: "kiss" }, { text: "🔥 بکنم وحشی", action: "seduce" }, { text: "👶 بچه‌دار شیم", action: "seduce" }] },
            { text: "🧙‍♀️ امروز می‌خوام رکورد بزنیم... ۷ بار پشت سر هم", options: [{ text: "🔥 آماده‌ام", action: "seduce" }, { text: "💋 اول آروم", action: "kiss" }, { text: "🔙 امروز نه", action: "flee" }] }
        ],
        harem: [
            { text: "🧙‍♀️ شوهرم... امشب میای یا بازم باید جق بزنم؟", options: [{ text: "🔥 میام", action: "seduce" }, { text: "🎁 اول هدیه", action: "gift" }, { text: "🔙 بعداً", action: "flee" }] },
            { text: "🧙‍♀️ دلم برات تنگ شده... اینقدر نرو پیش اون پری کوفتی", options: [{ text: "💋 الان میام", action: "kiss" }, { text: "🤝 مشغول بودم", action: "ally" }, { text: "🔙 بعداً", action: "flee" }] }
        ]
    },
    vampire: {
        day1: [
            { text: "🧛‍♀️ گرسنمه فاحشه! خونتو می‌خورم!", options: [{ text: "🗡️ حمله", action: "fight" }, { text: "🩸 خون بده", action: "gift" }, { text: "💋 عشق", action: "seduce" }] },
            { text: "🧛‍♀️ ۳۰۰ ساله زندم... تو یه لقمه کوچیکی برام!", options: [{ text: "🗡️ بجنگ", action: "fight" }, { text: "💋 دسر خوشمزه", action: "seduce" }, { text: "🏃 فرار", action: "flee" }] }
        ],
        day2: [
            { text: "🧛‍♀️ بازم اومدی کصخل؟! خونتو بو می‌کشم", options: [{ text: "🩸 بخور", action: "gift" }, { text: "💋 بو کن", action: "seduce" }, { text: "🏃 فرار", action: "flee" }] },
            { text: "🧛‍♀️ دیشب یه انسان رو خشک کردم... تو بعدی هستی!", options: [{ text: "🗡️ نمی‌ذارم", action: "fight" }, { text: "💋 منو نمی‌کشی", action: "seduce" }, { text: "🏃 فرار", action: "flee" }] }
        ],
        day3: [
            { text: "🧛‍♀️ مچ دستت رو بده... بذار نبضت رو حس کنم", options: [{ text: "🖐️ بده", action: "ally" }, { text: "💋 ببوس", action: "kiss" }, { text: "🔙 بعداً", action: "flee" }] },
            { text: "🧛‍♀️ خون تو اعتیاد آورده... مثل شیشه می‌مونه", options: [{ text: "🩸 بخور", action: "gift" }, { text: "💋 منم معتادتم", action: "seduce" }, { text: "🔙 نه", action: "flee" }] }
        ],
        day4: [
            { text: "🧛‍♀️ شاید نکشمت... شاید تبدیلت کنم به خون‌آشام", options: [{ text: "🧛 تبدیل کن", action: "potion" }, { text: "💋 همدمت میشم", action: "seduce" }, { text: "🔙 بعداً", action: "flee" }] },
            { text: "🧛‍♀️ نمی‌خوام بکشمت... می‌خوام قرن‌ها بکنمت", options: [{ text: "💋 پیشم بمون", action: "kiss" }, { text: "🔥 بکنم", action: "seduce" }, { text: "🔙 بعداً", action: "flee" }] }
        ],
        day5: [
            { text: "🧛‍♀️ ۳۰۰ ساله عاشق نشدم... تو اولین و آخرینی", options: [{ text: "💋 منم عاشقتم", action: "kiss" }, { text: "🔥 بیا", action: "seduce" }, { text: "🎁 هدیه", action: "gift" }] },
            { text: "🧛‍♀️ بیا... با هم جاودانه شیم... خون هم رو بخوریم", options: [{ text: "🩸 جاودانه", action: "potion" }, { text: "💋 ببوس", action: "kiss" }, { text: "🔙 بعداً", action: "flee" }] }
        ],
        day6: [
            { text: "🧛‍♀️ من خون‌آشام تو شدم... تا ابد... حالا بکن منو", options: [{ text: "🔥 از جلو", action: "seduce" }, { text: "🍑 از پشت", action: "seduce" }, { text: "👄 دهنی", action: "kiss" }] },
            { text: "🧛‍♀️ هر شب میام سراغت... برای ارگاسم‌های چندگانه", options: [{ text: "💋 بیا", action: "kiss" }, { text: "🔥 منتظرم", action: "seduce" }, { text: "🔙 بعداً", action: "flee" }] }
        ],
        day7: [
            { text: "🧛‍♀️ اگه بمیری... خودم زنده‌ات می‌کنم", options: [{ text: "💋 نمی‌میرم", action: "kiss" }, { text: "👰 ازدواج", action: "propose" }, { text: "🔥 بیا", action: "seduce" }] },
            { text: "🧛‍♀️ تا ابد مال تو... حالا یا بمیر یا بکن", options: [{ text: "💋 مال منی", action: "kiss" }, { text: "🔥 بکنم", action: "seduce" }, { text: "👶 بچه‌دار شیم", action: "seduce" }] }
        ],
        harem: [
            { text: "🧛‍♀️ شوهرم... امشب گرسنه‌ام... یا خون یا کیر", options: [{ text: "🩸 خون", action: "gift" }, { text: "🔥 کیر", action: "seduce" }, { text: "🔙 بعداً", action: "flee" }] },
            { text: "🧛‍♀️ چرا انقدر دیر میای؟ بازم رفتی پیش اون گرگینه؟", options: [{ text: "💋 الان اومدم", action: "kiss" }, { text: "🤝 مشغول بودم", action: "ally" }, { text: "🔙 بعداً", action: "flee" }] }
        ]
    },
    fairy: {
        day1: [
            { text: "🧚 سلام خوشتیپ! ۳ تا آرزو داری...", options: [{ text: "💎 ثروت", action: "wealth" }, { text: "⚔️ قدرت", action: "power" }, { text: "💋 عشق", action: "seduce" }] },
            { text: "🧚 هی قهرمان! پری‌ها چقدر شیطونن؟", options: [{ text: "💋 خیلی", action: "seduce" }, { text: "🤝 نمی‌دونم", action: "ally" }, { text: "🏃 فرار", action: "flee" }] }
        ],
        day2: [
            { text: "🧚 آرزوی دومت چیه؟ پول؟ قدرت؟ یا یه چیز دیگه؟", options: [{ text: "💎 پول", action: "wealth" }, { text: "❤️ سلامتی", action: "heal" }, { text: "💋 چیز دیگه", action: "seduce" }] },
            { text: "🧚 دیشب توی گوشت آرزو خوندم...", options: [{ text: "👂 چی گفتی؟", action: "listen" }, { text: "💋 عاشقمی؟", action: "seduce" }, { text: "🏃 فرار", action: "flee" }] }
        ],
        day3: [
            { text: "🧚 آرزوی سوم رو من انتخاب می‌کنم: عشق!", options: [{ text: "💋 قبول", action: "seduce" }, { text: "🗡️ رد", action: "fight" }, { text: "🔙 بعداً", action: "flee" }] },
            { text: "🧚 آرزوی اول: ثروت، دوم: قدرت، سوم: من!", options: [{ text: "💋 سومی", action: "seduce" }, { text: "💰 اولی", action: "wealth" }, { text: "🔙 نه", action: "flee" }] }
        ],
        day4: [
            { text: "🧚 گرد جادویی دارم... هرچی بخوای میشه", options: [{ text: "💋 عشق", action: "seduce" }, { text: "⚔️ قدرت", action: "power" }, { text: "🔙 بعداً", action: "flee" }] },
            { text: "🧚 می‌دونی پری‌ها چجوری می‌بوسن؟", options: [{ text: "💋 نشون بده", action: "kiss" }, { text: "🤝 بگو", action: "listen" }, { text: "🔙 بعداً", action: "flee" }] }
        ],
        day5: [
            { text: "🧚 ۳ تا آرزو بکن... سومی رو من می‌گم", options: [{ text: "💋 بگو", action: "seduce" }, { text: "🔮 خودم می‌گم", action: "wish" }, { text: "🎁 هدیه", action: "gift" }] },
            { text: "🧚 دیشب توی خوابم بودی...", options: [{ text: "💋 خوب خوابیدی؟", action: "kiss" }, { text: "🤝 چی شد؟", action: "listen" }, { text: "🔙 بعداً", action: "flee" }] }
        ],
        day6: [
            { text: "🧚 پری‌ها عاشق نمیشن ولی من یه ذره شدم", options: [{ text: "🔥 از جلو", action: "seduce" }, { text: "🍑 از پشت", action: "seduce" }, { text: "👄 دهنی", action: "kiss" }] },
            { text: "🧚 جادوی من مال تو... همه چیزم", options: [{ text: "💋 ببوس", action: "kiss" }, { text: "🔥 بکنم", action: "seduce" }, { text: "🔙 بعداً", action: "flee" }] }
        ],
        day7: [
            { text: "🧚 باشه قبول... عاشق شدم", options: [{ text: "💋 منم عاشقتم", action: "kiss" }, { text: "👰 ازدواج", action: "propose" }, { text: "🔥 بیا", action: "seduce" }] },
            { text: "🧚 هر آرزویی بکنی برآورده میشه", options: [{ text: "🔥 آرزوی عشق", action: "seduce" }, { text: "💰 آرزوی ثروت", action: "wealth" }, { text: "👶 بچه‌دار شیم", action: "seduce" }] }
        ],
        harem: [
            { text: "🧚 شوهرم... برات یه سورپرایز دارم!", options: [{ text: "🔥 میام", action: "seduce" }, { text: "💋 بگو", action: "kiss" }, { text: "🔙 بعداً", action: "flee" }] },
            { text: "🧚 امروز توی باغ گلهای جادویی کاشتم", options: [{ text: "🌿 بو کنم", action: "ally" }, { text: "💋 چه جالب", action: "kiss" }, { text: "🔥 امتحان کن", action: "seduce" }] }
        ]
    },
    angel: {
        day1: [
            { text: "👼 نگران نباش مسافر... کمکت می‌کنم", options: [{ text: "❤️ شفا", action: "heal" }, { text: "💋 ممنون", action: "seduce" }, { text: "🏃 فرار", action: "flee" }] },
            { text: "👼 من فرشته‌ام... نباید این حرفا رو بزنم", options: [{ text: "👂 بگو", action: "listen" }, { text: "💋 ادامه بده", action: "seduce" }, { text: "🏃 فرار", action: "flee" }] }
        ],
        day2: [
            { text: "👼 دوباره زخمی شدی؟ بیا شفا بدم", options: [{ text: "❤️ شفا", action: "heal" }, { text: "💋 ببوس", action: "seduce" }, { text: "🏃 فرار", action: "flee" }] },
            { text: "👼 خدا ببخشه... وقتی نگام می‌کنی بال‌هام میلرزه", options: [{ text: "💋 جدی؟", action: "kiss" }, { text: "🤝 چرا؟", action: "listen" }, { text: "🏃 فرار", action: "flee" }] }
        ],
        day3: [
            { text: "👼 من نباید عاشق بشم... ولی نمی‌تونم", options: [{ text: "💋 عشق ممنوعه", action: "seduce" }, { text: "👼 برو بهشت", action: "free" }, { text: "🔙 بعداً", action: "flee" }] },
            { text: "👼 این گناهه... ولی چرا اینقدر خوبه؟", options: [{ text: "💋 چون عشقه", action: "kiss" }, { text: "🤝 گناه نیست", action: "ally" }, { text: "🔙 نه", action: "flee" }] }
        ],
        day4: [
            { text: "👼 دیشب دعا می‌کردم ولی فکرم پیش تو بود", options: [{ text: "💋 منم پیش تو بودم", action: "kiss" }, { text: "🤝 چی شد؟", action: "listen" }, { text: "🔙 بعداً", action: "flee" }] },
            { text: "👼 بذار بال‌هام رو لمس کنی", options: [{ text: "🖐️ لمس کن", action: "ally" }, { text: "💋 ببوس", action: "kiss" }, { text: "🔙 بعداً", action: "flee" }] }
        ],
        day5: [
            { text: "👼 حاضرم بسوزم فقط یه بار بغلت کنم", options: [{ text: "💋 بغلم کن", action: "kiss" }, { text: "🤝 نمی‌خوام بسوزی", action: "ally" }, { text: "🎁 هدیه", action: "gift" }] },
            { text: "👼 لب‌هام میلرزه... بوسیدن چه حسی داره؟", options: [{ text: "💋 امتحان کن", action: "kiss" }, { text: "🤝 خوبه", action: "listen" }, { text: "🔙 بعداً", action: "flee" }] }
        ],
        day6: [
            { text: "👼 دیگه برام مهم نیست خدا چی می‌گه", options: [{ text: "🔥 از جلو", action: "seduce" }, { text: "🍑 از پشت", action: "seduce" }, { text: "👄 دهنی", action: "kiss" }] },
            { text: "👼 من سقوط کردم از آسمون برای تو", options: [{ text: "💋 ارزشش رو داشتی", action: "kiss" }, { text: "🔥 بکنم", action: "seduce" }, { text: "🔙 بعداً", action: "flee" }] }
        ],
        day7: [
            { text: "👼 حالا یه فرشته گناه‌کارم... مال توام", options: [{ text: "💋 مال منی", action: "kiss" }, { text: "🔥 بیا", action: "seduce" }, { text: "👰 ازدواج آسمونی", action: "propose" }] },
            { text: "👼 هر شب به جای دعا... تو رو می‌بینم", options: [{ text: "💋 منم همینطور", action: "kiss" }, { text: "🔥 بکنم", action: "seduce" }, { text: "👶 بچه‌دار شیم", action: "seduce" }] }
        ],
        harem: [
            { text: "👼 شوهرم... برات دعا کردم امروز", options: [{ text: "🔥 میام", action: "seduce" }, { text: "💋 بیا بغلم", action: "kiss" }, { text: "🔙 بعداً", action: "flee" }] },
            { text: "👼 خدا رو شکر که تو رو دارم", options: [{ text: "💋 شکر", action: "kiss" }, { text: "🤝 همیشه", action: "ally" }, { text: "🔥 بیا", action: "seduce" }] }
        ]
    }
};

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
    fairy: { emoji: '🧚', startPoints: 20 }, angel: { emoji: '👼', startPoints: 20 }
};

function getDialogue(npcId, encounterCount) {
    try {
        if (!npcId) return null;
        const npcDialogues = dialogues[npcId];
        if (!npcDialogues) return null;
        const day = Math.min(7, Math.max(1, (encounterCount || 0) + 1));
        const dayKey = 'day' + day;
        const dayDialogues = npcDialogues[dayKey] || npcDialogues.day1;
        if (!dayDialogues || !Array.isArray(dayDialogues) || dayDialogues.length === 0) return null;
        const index = (encounterCount || 0) % dayDialogues.length;
        const dialogue = dayDialogues[index];
        if (!dialogue || !dialogue.text || !dialogue.options || !Array.isArray(dialogue.options)) return null;
        return dialogue;
    } catch (e) { return null; }
}

function getHaremDialogue(npcId) {
    try {
        if (!npcId) return null;
        const npcDialogues = dialogues[npcId];
        if (!npcDialogues || !npcDialogues.harem || !Array.isArray(npcDialogues.harem)) return null;
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