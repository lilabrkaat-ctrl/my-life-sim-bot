const config = require('./config');

// ============ دختران مخفی‌گاه ============
const secretGirls = [
    { 
        id: 'village_girl', name: 'دختر روستایی', emoji: '👩‍🌾', rarity: 'common',
        description: 'دختری ساده و صادق از روستاهای اطراف. برای فرار از فقر به مخفی‌گاه اومده.',
        requirements: { level: 1 }, cost: 20, 
        rewards: { xp: 10, gold: 5 }, 
        trustNeeded: 50, canBecomeQueen: true, queenRank: 'concubine',
        personality: 'مهربون و خجالتی',
        dialogues: [
            "قربان... خوش اومدید... 🫣",
            "امروز روز خوبی بود... ممنون که اومدید...",
            "دلم براتون تنگ شده بود... 💕"
        ]
    },
    { 
        id: 'dancer', name: 'رقاصه', emoji: '💃', rarity: 'common',
        description: 'رقاصه حرفه‌ای که از دربار اخراج شده. حالا توی مخفی‌گاه می‌رقصه.',
        requirements: { level: 5 }, cost: 50, 
        rewards: { xp: 20, gold: 10, mood: 10 }, 
        trustNeeded: 60, canBecomeQueen: true, queenRank: 'wife',
        personality: 'شیطون و پرانرژی',
        dialogues: [
            "می‌خوای برات برقصم؟ 💃",
            "امشب بهترین رقصمو برات می‌ذارم...",
            "هیچ‌کس مثل تو منو درک نکرده... 💋"
        ]
    },
    { 
        id: 'rich_widow', name: 'بیوه ثروتمند', emoji: '👩‍💼', rarity: 'rare',
        description: 'زن ثروتمندی که شوهرش مرده. برای فرار از تنهایی به مخفی‌گاه میاد.',
        requirements: { level: 10, gold: 100 }, cost: 100, 
        rewards: { xp: 30, gold: 50, diamond: 1 }, 
        trustNeeded: 80, canBecomeQueen: true, queenRank: 'favorite',
        personality: 'باوقار و بخشنده',
        dialogues: [
            "بیا اینم برای تو... 💎",
            "من پول نمی‌خوام... فقط تو رو می‌خوام...",
            "می‌تونم کمکت کنم... پول زیادی دارم... 💰"
        ]
    },
    { 
        id: 'fortune_teller', name: 'فالگیر', emoji: '🧙‍♀️', rarity: 'rare',
        description: 'زنی مرموز که می‌تونه آینده رو ببینه. کسی از گذشته‌اش خبر نداره.',
        requirements: { level: 15 }, cost: 30, 
        rewards: { xp: 15, wish: 1 }, 
        trustNeeded: 70, canBecomeQueen: true, queenRank: 'wife',
        personality: 'مرموز و دانا',
        dialogues: [
            "آینده‌ات رو توی چشمات می‌بینم... 🔮",
            "می‌خوای بدونم کی بهت خیانت می‌کنه؟",
            "ستاره‌ها می‌گن امروز روز خوبیه برات..."
        ]
    },
    { 
        id: 'thief_girl', name: 'دختر دزد', emoji: '🦹‍♀️', rarity: 'rare',
        description: 'دزد سابقی که توی مخفی‌گاه پنهان شده. گاهی چیزای دزدی میاره.',
        requirements: { level: 12 }, cost: 0, 
        rewards: { xp: 25, key: 1, gold: -20 }, 
        trustNeeded: 90, canBecomeQueen: true, queenRank: 'concubine',
        personality: 'حیله‌گر و باهوش',
        dialogues: [
            "بیا اینم کلید خزانه... 🗝️",
            "نترس... فقط یه دزدی کوچیک بود... 😏",
            "می‌خوای برات یه چیز خاص پیدا کنم؟"
        ]
    },
    { 
        id: 'noble_runaway', name: 'اشراف‌زاده فراری', emoji: '👸', rarity: 'epic',
        description: 'دختر یه دوک که از ازدواج اجباری فرار کرده. توی مخفی‌گاه پنهان شده.',
        requirements: { level: 20, gold: 200 }, cost: 200, 
        rewards: { xp: 50, diamond: 2, ring: 1 }, 
        trustNeeded: 100, canBecomeQueen: true, queenRank: 'favorite',
        personality: 'نجیب و مغرور',
        dialogues: [
            "من اینجا تعلق ندارم... ولی تو رو دوست دارم... 💕",
            "پدرم دنبالمه... نمی‌ذاری منو ببرن؟",
            "یه روز برمی‌گردم... با تو..."
        ]
    },
    { 
        id: 'exiled_princess', name: 'پرنسس تبعیدی', emoji: '👑👸', rarity: 'legendary',
        description: 'پرنسس آریانا از پادشاهی همسایه. بعد از کودتای عموش فرار کرده.',
        requirements: { level: 25, gold: 500, score: 1000 }, cost: 500, 
        rewards: { xp: 100, diamond: 5, ring: 2, gold: 200 }, 
        trustNeeded: 150, canBecomeQueen: true, queenRank: 'main_queen',
        personality: 'سلطنتی و مرموز',
        dialogues: [
            "تو تنها کسی هستی که می‌تونم بهش اعتماد کنم... 🤫",
            "عمویم فکر می‌کنه مردم... ولی من زنده‌ام!",
            "اگه کمکم کنی تاج و تختم رو پس بگیرم... ملکه‌ات می‌شم... 👑"
        ]
    }
];

// ============ پسران مخفی‌گاه ============
const secretBoys = [
    { id: 'servant_boy', name: 'پسر خدمتکار', emoji: '🧒', rarity: 'common', requirements: { level: 1 }, cost: 20, rewards: { xp: 10, gold: 5 } },
    { id: 'soldier', name: 'سرباز', emoji: '⚔️🧒', rarity: 'common', requirements: { level: 5, attack: 20 }, cost: 50, rewards: { xp: 20, attack: 3 } },
    { id: 'musician', name: 'نوازنده', emoji: '🎵🧒', rarity: 'rare', requirements: { level: 10 }, cost: 30, rewards: { xp: 15, song: 1, mood: 10 } },
    { id: 'teacher', name: 'معلم', emoji: '📚🧒', rarity: 'rare', requirements: { level: 15 }, cost: 40, rewards: { xp: 25, intelligence: 5 } },
    { id: 'young_knight', name: 'شوالیه جوان', emoji: '🛡️🧒', rarity: 'epic', requirements: { level: 20, attack: 100 }, cost: 100, rewards: { xp: 50, defense: 10, gold: 50 } },
    { id: 'exiled_prince', name: 'شاهزاده تبعیدی', emoji: '🤴', rarity: 'legendary', requirements: { level: 25, gold: 500, score: 1000 }, cost: 500, rewards: { xp: 100, diamond: 5, gold: 300 } }
];

// ============ فعالیت‌ها ============
const activities = {
    gambling: { name: 'قمار', emoji: '🎲', cost: 50, reward: { gold: 100 }, riskChance: 0.5, riskEffect: 'باخت' },
    drinking: { name: 'میخانه', emoji: '🍷', cost: 30, reward: { mood: 20 }, riskChance: 0.1, riskEffect: 'مسمومیت' },
    music: { name: 'موسیقی زنده', emoji: '🎵', cost: 20, reward: { mood: 15 }, riskChance: 0 },
    fortune: { name: 'فال‌گیری', emoji: '🔮', cost: 50, reward: { wish: 1 }, riskChance: 0 },
    fighting: { name: 'مبارزه زیرزمینی', emoji: '🗡️', cost: 100, reward: { gold: 300, xp: 50 }, riskChance: 0.3, riskEffect: 'زخمی شدن' },
    opium: { name: 'تریاک', emoji: '💊', cost: 100, reward: { mood: 50 }, riskChance: 0.4, riskEffect: 'اعتیاد' }
};

// ============ اتاق‌ها ============
const chamberRooms = {
    normal: { name: 'اتاق معمولی', emoji: '🛏️', cost: 20, bonus: 1, riskOfExposure: 0.3 },
    vip: { name: 'اتاق ویژه', emoji: '🛏️✨', cost: 100, bonus: 2, riskOfExposure: 0.15 },
    royal: { name: 'اتاق سلطنتی', emoji: '🛏️💫', cost: 500, bonus: 3, riskOfExposure: 0.05 },
    secret: { name: 'اتاق مخفی', emoji: '🔒', cost: 1000, bonus: 3, riskOfExposure: 0 }
};

// ============ توابع ============
function initSecretChamber(player) {
    if (!player.secretChamber) {
        player.secretChamber = {
            girls: [], boys: [],
            visitsToday: 0, maxVisits: 5,
            lastVisit: Date.now(), totalVisits: 0,
            loyaltyLevel: 1, reputation: 50,
            guards: [], activeAddiction: false, addictionDays: 0
        };
    }
    return player.secretChamber;
}

function resetDailyVisits(player) {
    initSecretChamber(player);
    if (Date.now() - player.secretChamber.lastVisit > 86400000) {
        player.secretChamber.visitsToday = 0;
    }
}

function getAvailableGirls(player) {
    initSecretChamber(player);
    return secretGirls.map(g => ({
        ...g,
        canMeet: (!g.requirements.level || player.level >= g.requirements.level) &&
                 (!g.requirements.gold || (player.inventory?.gold || 0) >= g.requirements.gold) &&
                 (!g.requirements.score || (player.score || 0) >= g.requirements.score)
    }));
}

function getAvailableBoys(player) {
    initSecretChamber(player);
    return secretBoys.map(b => ({
        ...b,
        canMeet: (!b.requirements.level || player.level >= b.requirements.level) &&
                 (!b.requirements.gold || (player.inventory?.gold || 0) >= b.requirements.gold) &&
                 (!b.requirements.attack || (player.attack || 0) >= b.requirements.attack) &&
                 (!b.requirements.score || (player.score || 0) >= b.requirements.score)
    }));
}

function visitGirl(player, girlId, roomType) {
    initSecretChamber(player);
    resetDailyVisits(player);

    if (player.secretChamber.visitsToday >= player.secretChamber.maxVisits) {
        return { success: false, message: '❌ امروز ۵ بار اومدی! دیگه کافیه.' };
    }

    const girl = secretGirls.find(g => g.id === girlId);
    if (!girl) return { success: false, message: '❌ این دختر پیدا نشد!' };

    if (girl.requirements.level && player.level < girl.requirements.level) {
        return { success: false, message: `❌ سطح ${girl.requirements.level} لازمه!` };
    }

    const room = chamberRooms[roomType] || chamberRooms.normal;
    const totalCost = girl.cost + room.cost;

    if ((player.inventory?.gold || 0) < totalCost) {
        return { success: false, message: `❌ طلا کافی نداری! (${totalCost}👑)` };
    }

    player.inventory.gold -= totalCost;

    let girlRecord = player.secretChamber.girls.find(g => g.id === girlId);
    if (!girlRecord) {
        girlRecord = { id: girlId, visits: 0, trust: 0, gifts: 0, lastVisit: Date.now() };
        player.secretChamber.girls.push(girlRecord);
    }

    girlRecord.visits++;
    girlRecord.trust = Math.min(100, girlRecord.trust + 2);
    girlRecord.lastVisit = Date.now();

    const bonus = room.bonus;
    if (girl.rewards.xp) player.xp = (player.xp || 0) + girl.rewards.xp * bonus;
    if (girl.rewards.gold && girl.rewards.gold > 0) player.inventory.gold += girl.rewards.gold * bonus;
    if (girl.rewards.diamond) player.inventory.diamond = (player.inventory.diamond || 0) + girl.rewards.diamond * bonus;
    if (girl.rewards.ring) player.inventory.ring = (player.inventory.ring || 0) + girl.rewards.ring;
    if (girl.rewards.key) player.inventory.key = (player.inventory.key || 0) + girl.rewards.key;
    if (girl.rewards.wish) player.inventory.wish = (player.inventory.wish || 0) + girl.rewards.wish;

    player.secretChamber.visitsToday++;
    player.secretChamber.totalVisits++;
    player.secretChamber.lastVisit = Date.now();

    const dialogue = girl.dialogues[Math.floor(Math.random() * girl.dialogues.length)];
    const rarities = { common: '⚪', rare: '🔵', epic: '🟣', legendary: '🟡' };

    // ❌ این خط رو حذف کردیم
    // delete chamberState[chatId];

    return {
        success: true,
        message: `🔞 *${girl.emoji} ${girl.name}* ${rarities[girl.rarity]}\n📝 ${girl.description}\n💕 اعتماد: ${girlRecord.trust}/${girl.trustNeeded}\n💬 "${dialogue}"\n👑 هزینه: ${totalCost} طلا\n🏠 ${room.name}\n📅 ${player.secretChamber.visitsToday}/${player.secretChamber.maxVisits}`
    };
}

function visitBoy(player, boyId, roomType) {
    initSecretChamber(player);
    resetDailyVisits(player);

    if (player.secretChamber.visitsToday >= player.secretChamber.maxVisits) {
        return { success: false, message: '❌ امروز ۵ بار اومدی!' };
    }

    const boy = secretBoys.find(b => b.id === boyId);
    if (!boy) return { success: false, message: '❌ این پسر پیدا نشد!' };

    const room = chamberRooms[roomType] || chamberRooms.normal;
    const totalCost = boy.cost + room.cost;

    if ((player.inventory?.gold || 0) < totalCost) {
        return { success: false, message: `❌ طلا کافی نداری! (${totalCost}👑)` };
    }

    player.inventory.gold -= totalCost;

    let boyRecord = player.secretChamber.boys.find(b => b.id === boyId);
    if (!boyRecord) {
        boyRecord = { id: boyId, visits: 0, trust: 0, lastVisit: Date.now() };
        player.secretChamber.boys.push(boyRecord);
    }

    boyRecord.visits++;
    boyRecord.trust = Math.min(100, boyRecord.trust + 2);
    boyRecord.lastVisit = Date.now();

    const bonus = room.bonus;
    if (boy.rewards.xp) player.xp = (player.xp || 0) + boy.rewards.xp * bonus;
    if (boy.rewards.gold && boy.rewards.gold > 0) player.inventory.gold += boy.rewards.gold * bonus;
    if (boy.rewards.attack) player.attack = (player.attack || 0) + boy.rewards.attack;
    if (boy.rewards.defense) player.defense = (player.defense || 0) + boy.rewards.defense;
    if (boy.rewards.song) player.inventory.song = (player.inventory.song || 0) + boy.rewards.song;
    if (boy.rewards.diamond) player.inventory.diamond = (player.inventory.diamond || 0) + boy.rewards.diamond;

    player.secretChamber.visitsToday++;
    player.secretChamber.totalVisits++;
    player.secretChamber.lastVisit = Date.now();

    // ❌ این خط رو حذف کردیم
    // delete chamberState[chatId];

    return {
        success: true,
        message: `🔞 *${boy.emoji} ${boy.name}*\n📝 ${boy.description}\n👑 هزینه: ${totalCost} طلا\n🏠 ${room.name}\n📅 ${player.secretChamber.visitsToday}/${player.secretChamber.maxVisits}`
    };
}

function doActivity(player, activityType) {
    initSecretChamber(player);
    resetDailyVisits(player);

    if (player.secretChamber.visitsToday >= player.secretChamber.maxVisits) {
        return { success: false, message: '❌ امروز ۵ بار اومدی!' };
    }

    const activity = activities[activityType];
    if (!activity) return { success: false, message: '❌ فعالیت نامعتبر!' };

    if ((player.inventory?.gold || 0) < activity.cost) {
        return { success: false, message: `❌ طلا کافی نداری! (${activity.cost}👑)` };
    }

    player.inventory.gold -= activity.cost;
    let resultMsg = `${activity.emoji} *${activity.name}*\n`;

    if (Math.random() < activity.riskChance) {
        resultMsg += `\n❌ *${activity.riskEffect}!*\n`;
        if (activity.riskEffect === 'اعتیاد') {
            player.secretChamber.activeAddiction = true;
            player.secretChamber.addictionDays = 7;
        } else if (activity.riskEffect === 'زخمی شدن') {
            player.hp = Math.max(1, (player.hp || 100) - 30);
        } else if (activity.riskEffect === 'مسمومیت') {
            player.hp = Math.max(1, (player.hp || 100) - 20);
        }
    } else {
        if (activity.reward.gold) { player.inventory.gold += activity.reward.gold; resultMsg += `\n💰 +${activity.reward.gold}👑`; }
        if (activity.reward.xp) { player.xp = (player.xp || 0) + activity.reward.xp; resultMsg += `\n✨ +${activity.reward.xp} XP`; }
        if (activity.reward.mood) { resultMsg += `\n😊 روحیه +${activity.reward.mood}`; }
        if (activity.reward.wish) { player.inventory.wish = (player.inventory.wish || 0) + activity.reward.wish; resultMsg += `\n🔮 +${activity.reward.wish} آرزو`; }
    }

    player.secretChamber.visitsToday++;
    player.secretChamber.lastVisit = Date.now();
    return { success: true, message: resultMsg };
}

function upgradeGirlToQueen(player, girlId) {
    initSecretChamber(player);
    const girl = secretGirls.find(g => g.id === girlId);
    if (!girl || !girl.canBecomeQueen) return { success: false, message: '❌ نمی‌تونه ملکه بشه!' };

    const girlRecord = player.secretChamber.girls.find(g => g.id === girlId);
    if (!girlRecord || girlRecord.trust < girl.trustNeeded) return { success: false, message: '❌ اعتماد کافی نیست!' };
    if (girlRecord.becameQueen) return { success: false, message: '❌ قبلاً ملکه شده!' };

    const releaseCost = 1000;
    if ((player.inventory?.gold || 0) < releaseCost) return { success: false, message: `❌ ${releaseCost}👑 لازمه!` };
    if (!player.harem || !player.harem.queens) return { success: false, message: '❌ حرمسرا نداری!' };

    player.inventory.gold -= releaseCost;

    const queenData = {
        id: 'queen_' + Date.now(), npcId: girlId, name: girl.name, emoji: girl.emoji,
        rank: girl.queenRank || 'concubine', points: girlRecord.trust,
        joinedAt: Date.now(), pregnancies: [], children: [],
        mood: 80, health: 100, reputation: 60, lastCare: Date.now(),
        isSpouse: false, room: 'simple', servants: [], dress: null,
        jewelry: [], diary: [], upbringing: null, cameFromChamber: true
    };

    player.harem.queens.push(queenData);
    girlRecord.becameQueen = true;

    return { success: true, message: `👑 ${girl.emoji} *${girl.name}* به حرمسرا اومد!` };
}

function giveGift(player, personId, isGirl) {
    initSecretChamber(player);
    const person = isGirl ? player.secretChamber.girls.find(g => g.id === personId) : player.secretChamber.boys.find(b => b.id === personId);
    if (!person) return { success: false, message: '❌ پیدا نشد!' };
    if ((player.inventory?.gold || 0) < 100) return { success: false, message: '❌ ۱۰۰👑 لازمه!' };

    player.inventory.gold -= 100;
    person.trust = Math.min(100, person.trust + 15);
    person.gifts = (person.gifts || 0) + 1;
    return { success: true, message: `🎁 هدیه داده شد!\n💕 اعتماد +۱۵ (${person.trust})` };
}

function hireGuard(player, guardType) {
    initSecretChamber(player);
    const guards = {
        doorman: { name: 'دربان', emoji: '🛡️', cost: 500, salary: 50 },
        watchman: { name: 'دیده‌بان', emoji: '👀', cost: 1000, salary: 100 },
        bodyguard: { name: 'محافظ شخصی', emoji: '🗡️', cost: 2000, salary: 200 }
    };

    const guard = guards[guardType];
    if (!guard) return { success: false, message: '❌ نگهبان نامعتبر!' };
    if (player.secretChamber.guards.find(g => g.type === guardType)) return { success: false, message: '❌ قبلاً استخدام شده!' };
    if ((player.inventory?.gold || 0) < guard.cost) return { success: false, message: `❌ ${guard.cost}👑 لازمه!` };

    player.inventory.gold -= guard.cost;
    player.secretChamber.guards.push({ type: guardType, hiredAt: Date.now() });
    return { success: true, message: `${guard.emoji} *${guard.name}* استخدام شد!` };
}

function updateLoyaltyLevel(player) {
    initSecretChamber(player);
    const total = player.secretChamber.totalVisits;
    player.secretChamber.loyaltyLevel = total >= 100 ? 5 : total >= 50 ? 4 : total >= 20 ? 3 : total >= 5 ? 2 : 1;
    return player.secretChamber.loyaltyLevel;
}

function getLoyaltyDiscount(player) {
    initSecretChamber(player);
    return { 1: 0, 2: 10, 3: 20, 4: 30, 5: 50 }[player.secretChamber.loyaltyLevel] || 0;
}

function checkAddiction(player) {
    initSecretChamber(player);
    if (!player.secretChamber.activeAddiction) return null;
    player.secretChamber.addictionDays--;
    if (player.secretChamber.addictionDays <= 0) {
        player.secretChamber.activeAddiction = false;
        return { recovered: true, message: '🎉 از اعتیاد پاک شدی!' };
    }
    if ((player.inventory?.gold || 0) < 50) {
        player.hp = Math.max(1, (player.hp || 100) - 20);
        return { recovered: false, message: `💊 پول مواد نداری! -۲۰❤️ (${player.secretChamber.addictionDays} روز مونده)` };
    }
    player.inventory.gold -= 50;
    return { recovered: false, message: `💊 مواد مصرف شد. -۵۰👑 (${player.secretChamber.addictionDays} روز مونده)` };
}

function formatSecretChamber(player) {
    initSecretChamber(player);
    resetDailyVisits(player);

    const loyaltyNames = { 1: 'تازه‌وارد 😐', 2: 'مشتری 🙂', 3: 'مشتری دائم 😊', 4: 'VIP 💎', 5: 'سهام‌دار 👑' };
    const discount = getLoyaltyDiscount(player);

    let msg = '🔞 *مخفی‌گاه سلطنتی*\n\n';
    msg += `🏆 سطح وفاداری: ${loyaltyNames[player.secretChamber.loyaltyLevel]}\n`;
    msg += `💰 تخفیف: ${discount}٪\n`;
    msg += `📅 بازدید امروز: ${player.secretChamber.visitsToday}/${player.secretChamber.maxVisits}\n`;
    msg += `🔢 کل بازدیدها: ${player.secretChamber.totalVisits}\n`;

    if (player.secretChamber.activeAddiction) {
        msg += `💊 *معتاد!* ${player.secretChamber.addictionDays} روز مونده...\n`;
    }

    msg += '\n👩 *دختران:*\n';
    const girls = getAvailableGirls(player);
    for (let girl of girls) {
        const record = player.secretChamber.girls.find(g => g.id === girl.id);
        const trust = record ? record.trust : 0;
        const visits = record ? record.visits : 0;
        const becameQueen = record ? record.becameQueen : false;

        if (becameQueen) msg += `👑 ${girl.emoji} ${girl.name} - *ملکه شده!*\n`;
        else if (girl.canMeet) msg += `✅ ${girl.emoji} ${girl.name} - ${girl.cost}👑 | 💕${trust} | 👁️${visits}\n`;
        else msg += `🔒 ${girl.emoji} ${girl.name} - نیاز به سطح ${girl.requirements.level}+\n`;
    }

    msg += '\n👦 *پسران:*\n';
    const boys = getAvailableBoys(player);
    for (let boy of boys) {
        const record = player.secretChamber.boys.find(b => b.id === boy.id);
        const trust = record ? record.trust : 0;
        if (boy.canMeet) msg += `✅ ${boy.emoji} ${boy.name} - ${boy.cost}👑 | 💕${trust}\n`;
        else msg += `🔒 ${boy.emoji} ${boy.name} - نیاز به سطح ${boy.requirements.level}+\n`;
    }

    msg += `\n👑 طلا: ${player.inventory?.gold || 0}`;
    return msg;
}

function getSecretChamberKeyboard(player) {
    initSecretChamber(player);
    resetDailyVisits(player);

    const buttons = [];
    const girls = getAvailableGirls(player);
    const boys = getAvailableBoys(player);

    for (let girl of girls) {
        const record = player.secretChamber.girls.find(g => g.id === girl.id);
        const becameQueen = record ? record.becameQueen : false;
        if (girl.canMeet && !becameQueen) {
            const canBeQueen = girl.canBecomeQueen && record && record.trust >= girl.trustNeeded;
            const prefix = canBeQueen ? '👑 ' : '👩 ';
            buttons.push([`${prefix}${girl.emoji} ${girl.name} (${girl.cost}👑)`]);
        }
    }

    for (let boy of boys) {
        if (boy.canMeet) buttons.push([`👦 ${boy.emoji} ${boy.name} (${boy.cost}👑)`]);
    }

    buttons.push(['🎲 قمار (۵۰👑)', '🍷 میخانه (۳۰👑)']);
    buttons.push(['🎵 موسیقی (۲۰👑)', '🔮 فال‌گیری (۵۰👑)']);
    buttons.push(['🗡️ مبارزه (۱۰۰👑)', '💊 تریاک (۱۰۰👑)']);
    buttons.push(['🎁 هدیه دادن']);
    buttons.push(['🛡️ استخدام نگهبان']);
    buttons.push(['🔙 برگشت']);

    return { reply_markup: { keyboard: buttons, resize_keyboard: true } };
}

function getChamberRoomKeyboard() {
    return {
        reply_markup: {
            keyboard: [
                ['🛏️ معمولی (۲۰👑) - خطر ۳۰٪'],
                ['🛏️✨ ویژه (۱۰۰👑) - خطر ۱۵٪'],
                ['🛏️💫 سلطنتی (۵۰۰👑) - خطر ۵٪'],
                ['🔒 مخفی (۱۰۰۰👑) - امن'],
                ['🔙 برگشت']
            ], resize_keyboard: true
        }
    };
}

function getGuardKeyboard() {
    return {
        reply_markup: {
            keyboard: [
                ['🛡️ دربان (۵۰۰👑)'],
                ['👀 دیده‌بان (۱۰۰۰👑)'],
                ['🗡️ محافظ شخصی (۲۰۰۰👑)'],
                ['🔙 برگشت']
            ], resize_keyboard: true
        }
    };
}

function getGiftKeyboard(player) {
    initSecretChamber(player);
    const buttons = [];
    for (let girl of player.secretChamber.girls) {
        const g = secretGirls.find(sg => sg.id === girl.id);
        if (g) buttons.push([`🎁 ${g.emoji} ${g.name}`]);
    }
    for (let boy of player.secretChamber.boys) {
        const b = secretBoys.find(sb => sb.id === boy.id);
        if (b) buttons.push([`🎁 ${b.emoji} ${b.name}`]);
    }
    buttons.push(['🔙 برگشت']);
    return { reply_markup: { keyboard: buttons, resize_keyboard: true } };
}

module.exports = {
    secretGirls, secretBoys, activities, chamberRooms,
    initSecretChamber, resetDailyVisits,
    getAvailableGirls, getAvailableBoys,
    visitGirl, visitBoy, doActivity,
    upgradeGirlToQueen, giveGift, hireGuard,
    updateLoyaltyLevel, getLoyaltyDiscount, checkAddiction,
    formatSecretChamber, getSecretChamberKeyboard,
    getChamberRoomKeyboard, getGuardKeyboard, getGiftKeyboard
};