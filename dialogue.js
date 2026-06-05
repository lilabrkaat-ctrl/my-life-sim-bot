const config = require('./config');

// دیالوگ‌های ملاقات در محیط
const dialogues = {
    witch: [
        { text: "🧙‍♀️ هههه... یه مسافر تنها تو جنگل من؟! 😈", options: [{ text: "🗡️ حمله", action: "fight" }, { text: "💋 شیفته شو", action: "seduce" }, { text: "🏃 فرار", action: "flee" }] },
        { text: "🧙‍♀️ دوباره تو؟! جرأت کردی برگردی؟!", options: [{ text: "🗡️ حمله", action: "fight" }, { text: "💋 تسلیم شو", action: "seduce" }, { text: "🤝 معامله", action: "trade" }] },
        { text: "🧙‍♀️ بازم تو؟! این دفعه زنده نمی‌ذارم بری!", options: [{ text: "🗡️ بجنگ", action: "fight" }, { text: "💋 عشق", action: "seduce" }, { text: "🧪 معجون", action: "potion" }] },
        { text: "🧙‍♀️ باشه قبول... تو از من قوی‌تری... بیا متحد شیم!", options: [{ text: "🤝 متحد", action: "ally" }, { text: "💋 همدم", action: "seduce" }] },
        { text: "🧙‍♀️ ارباب من... چی فرمان میدی؟ 😈", options: [{ text: "🎁 هدیه", action: "gift" }, { text: "💋 بوس", action: "kiss" }] }
    ],
    ghost: [
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
    ]
};

// دیالوگ‌های زندان
const prisonDialogues = {
    witch: {
        wild: [
            "🧙‍♀️: احمق! فکر کردی می‌تونی منو زندانی کنی؟! 😈",
            "🧙‍♀️: نزدیک نشو... طلسمت می‌کنم... تبدیلت می‌کنم به وزغ!",
            "🧙‍♀️: ازت متنفرم... ولی... چشمات قشنگه... 🤨"
        ],
        untrusted: [
            "🧙‍♀️: داری هر روز میای... خسته نشدی؟... یا دلت و خواسته؟",
            "🧙‍♀️: تو اولین کسی هستی که ازم فرار نکرد...",
            "🧙‍♀️: دیشب یه معجون درست کردم... اسمش رو گذاشتم 'اون'... 😏"
        ],
        familiar: [
            "🧙‍♀️: دستت رو بده... می‌خوام ببینم خط عشقت کجاست... 🔮",
            "🧙‍♀️: اگه آزادم کنی... شاید... شاید یه بوس بهت بدم...",
            "🧙‍♀️: اعتراف می‌کنم... شب‌ها بیدارم... به تو فکر می‌کنم... 🫣"
        ],
        intimate: [
            "🧙‍♀️: بیا نزدیک‌تر... بذار یه طلسم عشق روشنت کنم... 💋✨",
            "🧙‍♀️: دستام میلرزه... آخه من ساحره‌ام... نباید عاشق بشم...",
            "🧙‍♀️: می‌خوام معجون عشق رو با هم بخوریم... ببینیم چی میشه... 🧪💋"
        ],
        tamed: [
            "🧙‍♀️: من دیگه ساحره خبیث نیستم... تو عوضم کردی... 💋",
            "🧙‍♀️: هر شب میام توی خوابت... و کارایی می‌کنم که... 🫣🔥",
            "🧙‍♀️: مال تو شدم... طلسمت کردم... تا ابد پیشمی... 😈💋"
        ]
    },
    ghost: {
        untrusted: [
            "👻: من سال‌هاست کسی رو لمس نکردم... نمی‌دونم هنوز می‌تونم...",
            "👻: از من نمی‌ترسی؟ بیشتر آدما فرار می‌کنن...",
            "👻: وقتی نزدیکمی... یه چیزایی یادم میاد... حس‌های فراموش شده..."
        ],
        familiar: [
            "👻: بذار دستت رو بگیرم... فقط یه لحظه... قول می‌دم سردم نکنه...",
            "👻: دیشب خواب دیدم زنده‌ام... و تو کنارمی... و ما... 💭💋",
            "👻: می‌دونی یه روح چجوری عاشق میشه؟... از توی وجودت رد میشه..."
        ],
        intimate: [
            "👻: بذار برای یه بارم که شده... بغلت کنم... 🫂💋",
            "👻: وقتی از توی بدنت رد میشم... حس می‌کنم زنده‌ام... 🫣",
            "👻: دلم می‌خواد تا ابد توی وجودت باشم... همدمت باشم..."
        ],
        tamed: [
            "👻: من مال تو شدم... روح تو... تا ابد... 👻💋",
            "👻: هر شب میام توی بغلت... و تا صبح می‌مونم... 💭🔥",
            "👻: حتی مرگ هم نمی‌تونه جدایمون کنه... 🫣💋"
        ]
    },
    fairy: {
        untrusted: [
            "🧚: هی قهرمان... می‌دونی پری‌ها چقدر شیطونن؟ 😜",
            "🧚: دیشب توی گوشت آرزو خوندم... حدس بزن چی گفتم...",
            "🧚: دستت رو بده... می‌خوام ببینم چند تا آرزو داری..."
        ],
        familiar: [
            "🧚: آرزوی اولت: ثروت... دومت: قدرت... سومت: من! 😜💋",
            "🧚: گرد جادویی دارم... می‌پاشم روت... هرچی بخوای میشه...",
            "🧚: می‌دونی پری‌ها چجوری می‌بوسن؟... با یه کم جادو... ✨💋"
        ],
        intimate: [
            "🧚: بیا... ۳ تا آرزو بکن... آرزوی سوم رو من انتخاب می‌کنم...",
            "🧚: دیشب توی خوابم بودی... و ما... توی جنگل... 🫣",
            "🧚: پری‌ها عاشق نمیشن... ولی من... یه ذره عاشق شدم..."
        ],
        tamed: [
            "🧚: باشه قبول... من عاشق شدم... پری عاشق... مسخره‌ست... 💋😜",
            "🧚: حالا هر آرزویی بکنی برآورده میشه... حتی اون یکی... 🫣🔥",
            "🧚: جادوی من مال تو... قلب من مال تو... همه چیزم... 💋✨"
        ]
    },
    angel: {
        untrusted: [
            "👼: من فرشته‌ام... نباید این حرفا رو بزنم... ولی...",
            "👼: خدا منو ببخشه... وقتی نگام می‌کنی بال‌هام میلرزه...",
            "👼: این گناهه... می‌دونم... ولی چرا اینقدر خوبه؟ 😳"
        ],
        familiar: [
            "👼: دیشب دعا می‌کردم... ولی تمام فکرم پیش تو بود... 🙏😳",
            "👼: بذار بال‌هام رو لمس کنی... هیچ انسانی لمسشون نکرده...",
            "👼: اگه فرشته‌ها عاشق بشن بال‌هاشون می‌سوزه... من آماده‌ام..."
        ],
        intimate: [
            "👼: من حاضرم بسوزم... فقط یه بار بغلت کنم... 🔥👼",
            "👼: لب‌هام میلرزه... می‌خوام بدونم بوسیدن چه حسی داره...",
            "👼: دیگه برام مهم نیست خدا چی می‌گه... فقط تو مهمی... 💋"
        ],
        tamed: [
            "👼: من سقوط کردم... از آسمون... برای تو... 👼💋🔥",
            "👼: حالا یه فرشته گناه‌کارم... ولی خوشحالم... چون مال توام...",
            "👼: هر شب به جای دعا... تو رو می‌بینم... بهترین عبادته... 🫣💋"
        ]
    },
    knight: {
        wild: [
            "⚔️: من فقط یه بار شکست خوردم... و اون تو بودی!",
            "⚔️: نزدیک نشو! شمشیرم رو می‌خوام... نه ترحم تو!",
            "⚔️: مغروری... خوشم میاد... ولی کافی نیست..."
        ],
        untrusted: [
            "⚔️: چرا هر روز میای؟... می‌خوای تحقیرم کنی؟",
            "⚔️: اعتراف می‌کنم... شب‌ها به جنگیدن با تو فکر می‌کنم...",
            "⚔️: زره‌ام رو درآوردم... سنگینه... حالم بهتره... 😳"
        ],
        familiar: [
            "⚔️: دستت... قویه... ولی ملایم... کسی اینجوری لمس نکرده...",
            "⚔️: می‌خوام یه نبرد دیگه... ولی این بار... توی تخت... 😳⚔️",
            "⚔️: من شوالیه‌ام... نباید ضعیف باشم... ولی جلوی تو... 💋"
        ],
        intimate: [
            "⚔️: من تسلیم شدم... شمشیرم... قلبم... همه چیزم مال تو...",
            "⚔️: بیا... زره‌ام کاملاً بازه... دیگه دفاعی ندارم... 🛡️🫣",
            "⚔️: فقط تو می‌تونی منو شکست بدی... و فقط تو برنده‌م می‌کنی..."
        ],
        tamed: [
            "⚔️: من شوالیه تو شدم... تا ابد... ⚔️💋",
            "⚔️: هر شب منتظرتم... با شمشیر... و بدون زره... 🔥🫣",
            "⚔️: برام بجنگ... برام بمیر... برام زندگی کن... 💋👑"
        ]
    },
    skeleton: {
        untrusted: [
            "💀: هی... گوشت نداری... ولی یه چیز دیگه داری... 🦴😏",
            "💀: می‌دونی چیه؟ من استخونم... ولی هنوز قلبم می‌تپه... 💓",
            "💀: نزدیک شو... نمی‌ترسی اسکلت بشی؟ 😂"
        ],
        familiar: [
            "💀: دیشب خواب دیدم گوشت دارم... و تو لمسش می‌کردی... 🫣",
            "💀: استخونام... وقتی نزدیکمی... یه صداهایی میدن... 🦴💋",
            "💀: می‌خوام برات برقصم... بدون گوشت مسخره‌ست... 💃😂"
        ],
        intimate: [
            "💀: قلبم... که ندارم... ولی یه چیزی توی سینه‌م می‌تپه...",
            "💀: بیا... دستت رو بذار روی استخونام... ببین چقدر گرمه...",
            "💀: من زنده نیستم... ولی وقتی تو هستی... حس می‌کنم زنده‌ام..."
        ],
        tamed: [
            "💀: من عاشق یه زنده شدم! کی فکرش رو می‌کرد؟! 💀💋",
            "💀: هر شب برات می‌رقصم... استخونام به هم می‌خورن... 💃🦴",
            "💀: گوشت می‌خوام... ولی فقط گوشت تو رو... 🫣😂💋"
        ]
    },
    werewolf: {
        wild: [
            "🐺: غررر... عقب برو... بوی آدم میاد... دوست ندارم... 🐺",
            "🐺: نزدیک نشو! گازت می‌گیرم... مگه نمی‌فهمی؟!",
            "🐺: این میله‌ها رو باز کن... یا خودم می‌شکنمشون..."
        ],
        untrusted: [
            "🐺: چرا انقدر بهم نزدیک میشی؟... خیلی وقته کسی جرات نکرده...",
            "🐺: دستت... گرمه... برخلاف خودم که همیشه سردم...",
            "🐺: نمی‌ترسی؟ من گرگینه‌ام... می‌تونم خردت کنم..."
        ],
        familiar: [
            "🐺: وقتی میای... یه حسی توی سینه‌م... نمی‌دونم چیه...",
            "🐺: دیشب ماه کامل بود... و من فقط به تو فکر می‌کردم... 🌕",
            "🐺: هیچکس تا حالا اینقدر بهم توجه نکرده بود..."
        ],
        intimate: [
            "🐺: دستاتو بذار رو صورتم... بذار عطرت رو حس کنم... 🫣",
            "🐺: می‌خوام تبدیلت کنم... با هم بدویم توی جنگل... زیر ماه...",
            "🐺: نمی‌دونم چیه... ولی وقتی نیستی... زوزه می‌کشم... 🐺💔"
        ],
        tamed: [
            "🐺: من مال تو شدم... آلفای من... هر کاری بگی می‌کنم... 🐺💋",
            "🐺: بیا نزدیک‌تر... بذار گرمای بدنت رو حس کنم... 🔥💋",
            "🐺: فقط تو می‌تونی منو آروم کنی... فقط تو... 🔥💋"
        ]
    },
    wizard: {
        untrusted: [
            "🧙‍♂️: من توی قفس هم قدرتم رو دارم...",
            "🧙‍♂️: تو فکر کردی می‌تونی جادوگر رو زندانی کنی؟"
        ],
        familiar: [
            "🧙‍♂️: شاید بتونیم یه معامله کنیم...",
            "🧙‍♂️: طلسم‌هایی بلدم که توی تصورت هم نمی‌گنجه..."
        ],
        intimate: [
            "🧙‍♂️: قدرت زیاده... ولی تنهایی هیچی نیست...",
            "🧙‍♂️: می‌تونم بهت یاد بدم... اگه آزادم کنی..."
        ],
        tamed: [
            "🧙‍♂️: شاگرد من شو... همه چی یادت می‌دم... 🔮",
            "🧙‍♂️: جادوی من در اختیار تو... 💋"
        ]
    }
};

const npcConfig = {
    witch: { image: 'witch', emoji: '🧙‍♀️', fightReward: { xp: 50, gold: 30 }, seduceReward: { hp: 30, xp: 20 }, startPoints: 15 },
    ghost: { image: 'ghost_sexy', emoji: '👻', fightReward: { xp: 80, gold: 40 }, seduceReward: { hp: 50, xp: 30 }, startPoints: 25 },
    fairy: { image: 'fairy', emoji: '🧚', fightReward: { xp: 40, gold: 25 }, seduceReward: { hp: 20, xp: 15 }, startPoints: 20 },
    angel: { image: 'angel', emoji: '👼', fightReward: { xp: 100, gold: 50 }, seduceReward: { hp: 100, xp: 50 }, startPoints: 20 },
    knight: { image: 'knight', emoji: '⚔️', fightReward: { xp: 60, gold: 35 }, seduceReward: { hp: 40, xp: 25 }, startPoints: 10 },
    jester: { image: 'jester', emoji: '🎭', fightReward: { xp: 20, gold: 10 }, seduceReward: { hp: 10, xp: 5 }, startPoints: 30 },
    prince: { image: 'prince', emoji: '🤴', fightReward: { xp: 70, gold: 100 }, seduceReward: { hp: 30, xp: 20 }, startPoints: 15 },
    skeleton: { image: 'skeleton', emoji: '💀', fightReward: { xp: 35, gold: 15 }, seduceReward: { hp: 15, xp: 10 }, startPoints: 30 },
    werewolf: { image: 'werewolf', emoji: '🐺', fightReward: { xp: 90, gold: 45 }, seduceReward: { hp: 50, xp: 35 }, startPoints: 5 },
    wizard: { image: 'wizard', emoji: '🧙‍♂️', fightReward: { xp: 70, gold: 40 }, seduceReward: { hp: 30, xp: 25 }, startPoints: 15 }
};

// توابع دیالوگ محیط
function getDialogue(npcId, encounterCount) {
    const npcDialogues = dialogues[npcId];
    if (!npcDialogues) return null;
    const index = Math.min(encounterCount, npcDialogues.length - 1);
    return npcDialogues[index];
}

// توابع دیالوگ زندان
function getPrisonDialogue(npcId, relationLevel) {
    const npcDialogues = prisonDialogues[npcId];
    if (!npcDialogues) return { text: "🤐 حرفی برای گفتن نداره...", level: relationLevel };
    
    const levelDialogues = npcDialogues[relationLevel] || npcDialogues.untrusted || npcDialogues.wild;
    const text = levelDialogues[Math.floor(Math.random() * levelDialogues.length)];
    
    return { text, level: relationLevel };
}

function getNpcConfig(npcId) {
    return npcConfig[npcId] || null;
}

function handleAction(player, npcId, action) {
    const npc = getNpcConfig(npcId);
    if (!npc) return { message: '❌ NPC پیدا نشد!' };

    let result = { message: '', image: null, battleStart: false };

    switch (action) {
        case 'fight':
            result.battleStart = true;
            result.message = `⚔️ ${npc.emoji} برای نبرد آماده میشه!`;
            break;
        case 'seduce':
            player.hp = Math.min(player.maxHp, player.hp + npc.seduceReward.hp);
            player.xp += npc.seduceReward.xp;
            if (!player.seduced) player.seduced = {};
            player.seduced[npcId] = (player.seduced[npcId] || 0) + 1;
            result.message = `💋 ${npc.emoji} تسلیم عشق تو شد!\n❤️ +${npc.seduceReward.hp} | ✨ +${npc.seduceReward.xp}`;
            break;
        case 'flee': result.message = `🏃 فرار کردی... ${npc.emoji} با عصبانیت نگاهت می‌کنه!`; break;
        case 'heal': player.hp = player.maxHp; result.message = `❤️ ${npc.emoji} تو رو شفا داد!`; break;
        case 'gift': player.inventory.gold += 20; result.message = `🎁 ${npc.emoji} بهت ۲۰👑 هدیه داد!`; break;
        case 'kiss': player.hp = Math.min(player.maxHp, player.hp + 15); result.message = `😘 ${npc.emoji} بوسیدت! +۱۵❤️`; break;
        case 'wealth': player.inventory.gold += 30; result.message = `💰 ${npc.emoji} بهت ۳۰👑 داد!`; break;
        case 'power': player.attack += 5; result.message = `⚔️ ${npc.emoji} قدرتت رو زیاد کرد! +۵⚔️`; break;
        case 'ally': player.defense += 3; result.message = `🤝 ${npc.emoji} متحدت شد! +۳🛡️`; break;
        case 'trade': player.inventory.gold += 15; player.inventory.iron += 5; result.message = `🤝 معامله! +۱۵👑 +۵⛏️`; break;
        case 'potion': player.hp = Math.min(player.maxHp, player.hp + 40); player.attack += 2; result.message = `🧪 معجون! +۴۰❤️ +۲⚔️`; break;
        case 'help': player.xp += 15; result.message = `🤝 کمک کردی! +۱۵✨`; break;
        case 'listen': player.xp += 10; result.message = `👂 گوش دادی... +۱۰✨`; break;
        case 'treasure': player.inventory.gold += 50; result.message = `💰 گنج! +۵۰👑`; break;
        case 'free': player.xp += 30; result.message = `🕊️ آزادش کردی! +۳۰✨`; break;
        default: result.message = `🤔 ${npc.emoji} منتظر تصمیم توئه...`;
    }

    return result;
}

module.exports = { 
    dialogues, prisonDialogues, npcConfig,
    getDialogue, getPrisonDialogue, getNpcConfig, handleAction
};