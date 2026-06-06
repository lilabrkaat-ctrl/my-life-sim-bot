const config = require('./config');

const dialogues = {
    witch: [
        { text: "🧙‍♀️ هههه... یه مسافر تنها تو جنگل من؟! 😈", options: [{ text: "🗡️ حمله", action: "fight" }, { text: "💋 شیفته شو", action: "seduce" }, { text: "🏃 فرار", action: "flee" }] },
        { text: "🧙‍♀️ دوباره تو؟! جرأت کردی برگردی؟!", options: [{ text: "🗡️ حمله", action: "fight" }, { text: "💋 تسلیم شو", action: "seduce" }, { text: "🤝 معامله", action: "trade" }] },
        { text: "🧙‍♀️ بازم تو؟! این دفعه زنده نمی‌ذارم بری!", options: [{ text: "🗡️ بجنگ", action: "fight" }, { text: "💋 عشق", action: "seduce" }, { text: "🧪 معجون", action: "potion" }] },
        { text: "🧙‍♀️ باشه قبول... تو از من قوی‌تری... بیا متحد شیم!", options: [{ text: "🤝 متحد", action: "ally" }, { text: "💋 همدم", action: "seduce" }] },
        { text: "🧙‍♀️ ارباب من... چی فرمان میدی؟ 😈", options: [{ text: "🎁 هدیه", action: "gift" }, { text: "💋 بوس", action: "kiss" }] }
    ],
    ghost_sexy: [
        { text: "👻 من... من کیم؟ یادم نمیاد...", options: [{ text: "🕯️ کمک", action: "help" }, { text: "🏃 فرار", action: "flee" }] },
        { text: "👻 تو دوباره اومدی... کسی رو دیدی شبیه من؟", options: [{ text: "👂 بگو", action: "listen" }, { text: "💋 تصاحب", action: "seduce" }] },
        { text: "👻 آره! من نگهبان گنج بودم! می‌خوای بگم کجاست؟", options: [{ text: "💰 بگو", action: "treasure" }, { text: "💋 بوس", action: "kiss" }] },
        { text: "👻 گنج که مال تو... حالا منو آزاد کن!", options: [{ text: "🕊️ آزاد", action: "free" }, { text: "💋 پیشم بمون", action: "seduce" }] },
        { text: "👻 آزادم! هر وقت خواستی صدام کن...", options: [{ text: "🎁 هدیه", action: "gift" }, { text: "💋 همدم", action: "seduce" }] }
    ],
    fairy: [
        { text: "🧚 سلام خوشتیپ! ۳ تا آرزو داری...", options: [{ text: "💎 ثروت", action: "wealth" }, { text: "⚔️ قدرت", action: "power" }, { text: "💋 عشق", action: "seduce" }] },
        { text: "🧚 آرزوی دومت چیه؟", options: [{ text: "💎 بیشتر", action: "wealth" }, { text: "❤️ سلامتی", action: "heal" }] },
        { text: "🧚 آرزوی سوم رو من انتخاب می‌کنم: عشق! 😜", options: [{ text: "💋 قبول", action: "seduce" }, { text: "🗡️ رد", action: "fight" }] }
    ],
    angel: [
        { text: "👼 نگران نباش مسافر... کمکت می‌کنم...", options: [{ text: "❤️ شفا", action: "heal" }, { text: "💋 ممنون", action: "seduce" }] },
        { text: "👼 دوباره زخمی شدی؟ بیا شفا بدم...", options: [{ text: "❤️ شفا", action: "heal" }, { text: "💋 دوست دارم", action: "seduce" }] },
        { text: "👼 من نباید عاشق بشم... ولی نمی‌تونم...", options: [{ text: "💋 عشق ممنوعه", action: "seduce" }, { text: "👼 برو آسمون", action: "free" }] }
    ],
    knight: [
        { text: "⚔️ ای غریبه! شمشیرت رو بکش!", options: [{ text: "⚔️ می‌جنگم", action: "fight" }, { text: "🤝 دوست", action: "ally" }, { text: "🏃 فرار", action: "flee" }] },
        { text: "⚔️ دفعه قبل خوب جنگیدی... بیا دوباره!", options: [{ text: "⚔️ بجنگ", action: "fight" }, { text: "💋 تصاحب", action: "seduce" }] }
    ],
    jester: [
        { text: "🎭 اگه بخندی جایزه داری، نخندی دو تا! 🤡", options: [{ text: "😂 می‌خندم", action: "gift" }, { text: "😐 نمی‌خندم", action: "fight" }] }
    ],
    prince: [
        { text: "🤴 میدونی من کیم؟! شاهزاده‌ام!", options: [{ text: "🤝 کمک", action: "help" }, { text: "💰 گروگان", action: "fight" }, { text: "💋 تصاحب", action: "seduce" }] }
    ],
    skeleton: [
        { text: "💀 گوشت داری؟! گرسنمه!", options: [{ text: "🍖 بده", action: "gift" }, { text: "🗡️ بجنگ", action: "fight" }, { text: "💋 عشق", action: "seduce" }] }
    ],
    werewolf: [
        { text: "🐺 ماه کامله... تبدیل شو یا فرار کن!", options: [{ text: "⚔️ بجنگ", action: "fight" }, { text: "💋 تصاحب", action: "seduce" }, { text: "🏃 فرار", action: "flee" }] }
    ],
    wizard: [
        { text: "🧙‍♂️ من می‌دونم دنبال چی می‌گردی...", options: [{ text: "🔮 طلسم", action: "power" }, { text: "💋 شیفته", action: "seduce" }, { text: "🏃 فرار", action: "flee" }] },
        { text: "🧙‍♂️ قدرت زیاد می‌خوای؟ باید هزینه‌اش رو بدی!", options: [{ text: "💰 می‌پردازم", action: "wealth" }, { text: "🗡️ نمی‌خوام", action: "fight" }] }
    ],
    sage: [
        { text: "🧙 حکیم دانا: سلام مسافر... آینده‌ات رو توی چشمات می‌بینم...", options: [{ text: "🔮 فال بگیر", action: "power" }, { text: "💡 راهنمایی", action: "help" }] }
    ],
    farmer: [
        { text: "🧑‍🌾 دهقان: سلام جوون! گرسنه‌ای؟ غذا دارم ارزون!", options: [{ text: "🍖 بخرم", action: "trade" }, { text: "🤝 کمک", action: "help" }] }
    ],
    blacksmith: [
        { text: "⚒️ آهنگر: به کارگاه من خوش اومدی! چی می‌خوای بسازی؟", options: [{ text: "🔨 ساخت", action: "craft" }, { text: "🤝 صحبت", action: "ally" }] }
    ],
    merchant: [
        { text: "🧑‍🌾 تاجر: جنس دارم، جنس مرغوب! از شیراز آوردیم!", options: [{ text: "💰 خرید", action: "trade" }, { text: "🤝 تخفیف", action: "gift" }] }
    ],
    bride: [
        { text: "👰 عروس فراری: از عروسی فرار کردم... نمی‌خوام با اون ازدواج کنم... شاید تو...", options: [{ text: "💍 خواستگاری", action: "propose" }, { text: "🤝 کمک", action: "help" }, { text: "🏃 برو", action: "flee" }] }
    ],
    mermaid: [
        { text: "🧜‍♀️ پری دریایی: سلام مسافر... آواز منو شنیدی؟ می‌تونی آرزوت رو بگی...", options: [{ text: "🎵 گوش کن", action: "listen" }, { text: "💋 عشق", action: "seduce" }, { text: "🏃 برو", action: "flee" }] }
    ],
    young_witch: [
        { text: "🧙‍♀️ جادوگر جوان: هنوز خیلی چیزا یاد نگرفتم... می‌خوای کمکت کنم؟", options: [{ text: "🔮 طلسم", action: "potion" }, { text: "💋 عشق", action: "seduce" }, { text: "🏃 برو", action: "flee" }] }
    ],
    singer: [
        { text: "👩‍🎤 خواننده: می‌خوای برات آواز بخونم؟ آوازای من جادو داره...", options: [{ text: "🎵 بخون", action: "listen" }, { text: "💋 عشق", action: "seduce" }, { text: "🏃 برو", action: "flee" }] }
    ],
    vampire: [
        { text: "🧛‍♀️ خون‌آشام: گرسنمه... خون تو بوی خوبی میده... ولی شاید راه دیگه‌ای باشه...", options: [{ text: "🩸 خون بده", action: "gift" }, { text: "💋 عشق", action: "seduce" }, { text: "🗡️ حمله", action: "fight" }] }
    ],
    genie: [
        { text: "🧝‍♀️ جن صحرا: آزادم کردی! ۳ تا آرزو می‌تونی بکنی...", options: [{ text: "💎 ثروت", action: "wealth" }, { text: "⚔️ قدرت", action: "power" }, { text: "💋 عشق", action: "seduce" }] }
    ],
    bandit_female: [
        { text: "🦹‍♀️ راهزن زن: پولتو بده... یا شاید یه راه دیگه باشه... 😏", options: [{ text: "💰 بده", action: "trade" }, { text: "💋 عشق", action: "seduce" }, { text: "🗡️ حمله", action: "fight" }] }
    ]
};

const prisonDialogues = {
    witch: {
        wild: ["🧙‍♀️: احمق! فکر کردی می‌تونی منو زندانی کنی؟! 😈", "🧙‍♀️: نزدیک نشو... طلسمت می‌کنم!", "🧙‍♀️: ازت متنفرم... ولی چشمات قشنگه... 🤨"],
        untrusted: ["🧙‍♀️: داری هر روز میای... خسته نشدی؟", "🧙‍♀️: تو اولین کسی هستی که ازم فرار نکرد...", "🧙‍♀️: دیشب یه معجون درست کردم... 😏"],
        familiar: ["🧙‍♀️: دستت رو بده... خط عشقت رو ببینم... 🔮", "🧙‍♀️: اگه آزادم کنی شاید یه بوس بهت بدم...", "🧙‍♀️: اعتراف می‌کنم... شب‌ها بهت فکر می‌کنم... 🫣"],
        intimate: ["🧙‍♀️: بیا نزدیک‌تر... طلسم عشق روشنت کنم... 💋", "🧙‍♀️: دستام میلرزه... نباید عاشق بشم...", "🧙‍♀️: معجون عشق رو با هم بخوریم... 🧪💋"],
        tamed: ["🧙‍♀️: من دیگه خبیث نیستم... تو عوضم کردی... 💋", "🧙‍♀️: هر شب میام توی خوابت... 🫣🔥", "🧙‍♀️: مال تو شدم... تا ابد... 😈💋"]
    },
    ghost_sexy: {
        untrusted: ["👻: سال‌هاست کسی رو لمس نکردم...", "👻: از من نمی‌ترسی؟", "👻: وقتی نزدیکمی یادم میاد حس‌های فراموش شده رو..."],
        familiar: ["👻: بذار دستت رو بگیرم... فقط یه لحظه...", "👻: دیشب خواب دیدم زنده‌ام و تو کنارمی... 💭", "👻: می‌دونی روح چجوری عاشق میشه؟"],
        intimate: ["👻: بذار بغلت کنم... 🫂💋", "👻: وقتی از توی بدنت رد میشم حس می‌کنم زنده‌ام...", "👻: دلم می‌خواد تا ابد همدمت باشم..."],
        tamed: ["👻: من مال تو شدم... روح تو... 👻💋", "👻: هر شب میام توی بغلت... 💭🔥", "👻: حتی مرگ هم جدایمون نمی‌کنه... 🫣💋"]
    },
    fairy: {
        untrusted: ["🧚: هی قهرمان! پری‌ها چقدر شیطونن؟ 😜", "🧚: دیشب توی گوشت آرزو خوندم...", "🧚: دستت رو بده ببینم چندتا آرزو داری..."],
        familiar: ["🧚: آرزوی اول: ثروت، دوم: قدرت، سوم: من! 😜💋", "🧚: گرد جادویی دارم... هرچی بخوای میشه...", "🧚: می‌دونی پری‌ها چجوری می‌بوسن؟ ✨💋"],
        intimate: ["🧚: ۳ تا آرزو بکن... سومی رو من می‌گم...", "🧚: دیشب توی خوابم بودی... 🫣", "🧚: پری‌ها عاشق نمیشن ولی من یه ذره شدم..."],
        tamed: ["🧚: باشه قبول... عاشق شدم... 💋😜", "🧚: هر آرزویی بکنی برآورده میشه... 🫣🔥", "🧚: جادوی من مال تو... همه چیزم... 💋✨"]
    },
    angel: {
        untrusted: ["👼: من فرشته‌ام... نباید این حرفا رو بزنم...", "👼: خدا ببخشه... وقتی نگام می‌کنی بال‌هام میلرزه...", "👼: این گناهه... ولی چرا اینقدر خوبه؟ 😳"],
        familiar: ["👼: دیشب دعا می‌کردم ولی فکرم پیش تو بود... 🙏", "👼: بذار بال‌هام رو لمس کنی...", "👼: اگه فرشته عاشق بشه بال‌هاش می‌سوزه..."],
        intimate: ["👼: حاضرم بسوزم فقط یه بار بغلت کنم... 🔥", "👼: لب‌هام میلرزه... بوسیدن چه حسی داره؟", "👼: دیگه برام مهم نیست خدا چی می‌گه... 💋"],
        tamed: ["👼: من سقوط کردم از آسمون برای تو... 👼💋", "👼: حالا یه فرشته گناه‌کارم... مال توام...", "👼: هر شب به جای دعا تو رو می‌بینم... 🫣💋"]
    },
    knight: {
        wild: ["⚔️: فقط یه بار شکست خوردم اونم تو بودی!", "⚔️: نزدیک نشو! شمشیرم رو می‌خوام!", "⚔️: مغروری... خوشم میاد..."],
        untrusted: ["⚔️: چرا هر روز میای؟ می‌خوای تحقیرم کنی؟", "⚔️: شب‌ها به جنگیدن با تو فکر می‌کنم...", "⚔️: زره‌ام رو درآوردم... سنگینه... 😳"],
        familiar: ["⚔️: دستت قویه ولی ملایم...", "⚔️: می‌خوام یه نبرد دیگه... توی تخت... 😳", "⚔️: من شوالیه‌ام نباید ضعیف باشم... 💋"],
        intimate: ["⚔️: تسلیم شدم... همه چیزم مال تو...", "⚔️: زره‌ام بازه... دیگه دفاعی ندارم... 🫣", "⚔️: فقط تو می‌تونی منو شکست بدی..."],
        tamed: ["⚔️: شوالیه تو شدم... تا ابد... ⚔️💋", "⚔️: هر شب منتظرتم... بدون زره... 🔥", "⚔️: برام بجنگ... برام زندگی کن... 💋👑"]
    },
    skeleton: {
        untrusted: ["💀: گوشت نداری ولی یه چیز دیگه داری... 🦴😏", "💀: استخونم ولی قلبم می‌تپه... 💓", "💀: نزدیک شو... نمی‌ترسی اسکلت بشی؟ 😂"],
        familiar: ["💀: دیشب خواب دیدم گوشت دارم... 🫣", "💀: استخونام وقتی نزدیکمی صدا میدن... 🦴💋", "💀: می‌خوام برات برقصم... 💃😂"],
        intimate: ["💀: قلب ندارم ولی یه چیزی می‌تپه...", "💀: دستت رو بذار روی استخونام...", "💀: زنده نیستم ولی وقتی تو هستی حس می‌کنم زنده‌ام..."],
        tamed: ["💀: عاشق یه زنده شدم! 💀💋", "💀: هر شب برات می‌رقصم... 💃🦴", "💀: گوشت می‌خوام... فقط گوشت تو رو... 🫣😂"]
    },
    werewolf: {
        wild: ["🐺: غررر... عقب برو... 🐺", "🐺: نزدیک نشو! گازت می‌گیرم!", "🐺: میله‌ها رو باز کن یا خودم می‌شکنمشون..."],
        untrusted: ["🐺: چرا نزدیک میشی؟ کسی جرات نکرده...", "🐺: دستت گرمه... برخلاف خودم...", "🐺: نمی‌ترسی؟ من گرگینه‌ام..."],
        familiar: ["🐺: وقتی میای یه حسی توی سینه‌م...", "🐺: دیشب ماه کامل بود فقط به تو فکر می‌کردم... 🌕", "🐺: هیچکس اینقدر بهم توجه نکرده بود..."],
        intimate: ["🐺: دستاتو بذار رو صورتم... 🫣", "🐺: می‌خوام تبدیلت کنم... با هم بدویم...", "🐺: وقتی نیستی زوزه می‌کشم... 🐺💔"],
        tamed: ["🐺: مال تو شدم... آلفای من... 🐺💋", "🐺: بیا نزدیک‌تر... گرمات رو حس کنم... 🔥💋", "🐺: فقط تو می‌تونی آرومم کنی... 🔥💋"]
    },
    wizard: {
        untrusted: ["🧙‍♂️: توی قفس هم قدرتم رو دارم...", "🧙‍♂️: فکر کردی می‌تونی جادوگر رو زندانی کنی؟"],
        familiar: ["🧙‍♂️: شاید بتونیم معامله کنیم...", "🧙‍♂️: طلسم‌هایی بلدم که توی تصورت هم نیست..."],
        intimate: ["🧙‍♂️: قدرت زیاده ولی تنهایی هیچی نیست...", "🧙‍♂️: می‌تونم بهت یاد بدم اگه آزادم کنی..."],
        tamed: ["🧙‍♂️: شاگرد من شو... همه چی یادت می‌دم... 🔮", "🧙‍♂️: جادوی من در اختیار تو... 💋"]
    }
};

const npcConfig = {
    witch: { image: 'witch', emoji: '🧙‍♀️', fightReward: { xp: 50, gold: 30 }, seduceReward: { hp: 30, xp: 20 }, startPoints: 15 },
    ghost_sexy: { image: 'ghost_sexy', emoji: '👻', fightReward: { xp: 80, gold: 40 }, seduceReward: { hp: 50, xp: 30 }, startPoints: 25 },
    fairy: { image: 'fairy', emoji: '🧚', fightReward: { xp: 40, gold: 25 }, seduceReward: { hp: 20, xp: 15 }, startPoints: 20 },
    angel: { image: 'angel', emoji: '👼', fightReward: { xp: 100, gold: 50 }, seduceReward: { hp: 100, xp: 50 }, startPoints: 20 },
    knight: { image: 'knight', emoji: '⚔️', fightReward: { xp: 60, gold: 35 }, seduceReward: { hp: 40, xp: 25 }, startPoints: 10 },
    jester: { image: 'jester', emoji: '🎭', fightReward: { xp: 20, gold: 10 }, seduceReward: { hp: 10, xp: 5 }, startPoints: 30 },
    prince: { image: 'prince', emoji: '🤴', fightReward: { xp: 70, gold: 100 }, seduceReward: { hp: 30, xp: 20 }, startPoints: 15 },
    skeleton: { image: 'skeleton', emoji: '💀', fightReward: { xp: 35, gold: 15 }, seduceReward: { hp: 15, xp: 10 }, startPoints: 30 },
    werewolf: { image: 'werewolf', emoji: '🐺', fightReward: { xp: 90, gold: 45 }, seduceReward: { hp: 50, xp: 35 }, startPoints: 5 },
    wizard: { image: 'wizard', emoji: '🧙‍♂️', fightReward: { xp: 70, gold: 40 }, seduceReward: { hp: 30, xp: 25 }, startPoints: 15 },
    sage: { image: 'sage', emoji: '🧙', fightReward: { xp: 30, gold: 20 }, seduceReward: { hp: 20, xp: 10 }, startPoints: 40 },
    farmer: { image: 'farmer', emoji: '🧑‍🌾', fightReward: { xp: 15, gold: 10 }, seduceReward: { hp: 10, xp: 5 }, startPoints: 35 },
    blacksmith: { image: 'blacksmith', emoji: '⚒️', fightReward: { xp: 40, gold: 25 }, seduceReward: { hp: 15, xp: 10 }, startPoints: 30 },
    merchant: { image: 'merchant', emoji: '🧑‍🌾', fightReward: { xp: 20, gold: 50 }, seduceReward: { hp: 10, xp: 5 }, startPoints: 35 },
    bride: { image: null, emoji: '👰', fightReward: { xp: 40, gold: 50 }, seduceReward: { hp: 30, xp: 20 }, startPoints: 30 },
    mermaid: { image: null, emoji: '🧜‍♀️', fightReward: { xp: 60, gold: 30 }, seduceReward: { hp: 40, xp: 25 }, startPoints: 25 },
    young_witch: { image: null, emoji: '🧙‍♀️', fightReward: { xp: 55, gold: 25 }, seduceReward: { hp: 25, xp: 20 }, startPoints: 20 },
    singer: { image: null, emoji: '👩‍🎤', fightReward: { xp: 30, gold: 15 }, seduceReward: { hp: 20, xp: 10 }, startPoints: 35 },
    vampire: { image: null, emoji: '🧛‍♀️', fightReward: { xp: 70, gold: 35 }, seduceReward: { hp: 35, xp: 30 }, startPoints: 15 },
    genie: { image: null, emoji: '🧝‍♀️', fightReward: { xp: 80, gold: 40 }, seduceReward: { hp: 45, xp: 35 }, startPoints: 10 },
    bandit_female: { image: null, emoji: '🦹‍♀️', fightReward: { xp: 50, gold: 25 }, seduceReward: { hp: 25, xp: 15 }, startPoints: 20 }
};

function getDialogue(npcId, encounterCount) {
    if (!npcId) return null;
    const npcDialogues = dialogues[npcId];
    if (!npcDialogues || npcDialogues.length === 0) return null;
    const index = Math.min(encounterCount || 0, npcDialogues.length - 1);
    return npcDialogues[index] || npcDialogues[0];
}

function getPrisonDialogue(npcId, relationLevel) {
    if (!npcId) return { text: "🤐 ...", level: "untrusted" };
    const npcDialogues = prisonDialogues[npcId];
    if (!npcDialogues) return { text: "🤐 حرفی برای گفتن نداره...", level: relationLevel || "untrusted" };
    const level = relationLevel || "untrusted";
    const levelDialogues = npcDialogues[level] || npcDialogues.untrusted || npcDialogues.wild || ["🤐 ..."];
    if (!levelDialogues || levelDialogues.length === 0) return { text: "🤐 ...", level: level };
    const text = levelDialogues[Math.floor(Math.random() * levelDialogues.length)];
    return { text: text || "🤐 ...", level: level };
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
        case 'seduce':
            player.hp = Math.min(player.maxHp || 100, (player.hp || 0) + (npc.seduceReward?.hp || 10));
            player.xp = (player.xp || 0) + (npc.seduceReward?.xp || 10);
            if (!player.seduced) player.seduced = {};
            player.seduced[npcId] = (player.seduced[npcId] || 0) + 1;
            result.message = `💋 ${npc.emoji} تسلیم عشق تو شد!\n❤️ +${npc.seduceReward?.hp || 10} | ✨ +${npc.seduceReward?.xp || 10}`;
            break;
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
        default: result.message = `🤔 ${npc.emoji} منتظر تصمیم توئه...`;
    }

    return result;
}

module.exports = { dialogues, prisonDialogues, npcConfig, getDialogue, getPrisonDialogue, getNpcConfig, handleAction };