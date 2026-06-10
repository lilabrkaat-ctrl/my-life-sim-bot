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
        description: 'پرنسس آریانا از پادشاهی همسایه. بعد از کودتای عموش فرار کرده. فقط افراد خاص می‌تونن ببیننش.',
        requirements: { level: 25, gold: 500, score: 1000 }, cost: 500, 
        rewards: { xp: 100, diamond: 5, ring: 2, gold: 200 }, 
        trustNeeded: 150, canBecomeQueen: true, queenRank: 'main_queen',
        personality: 'سلطنتی و مرموز',
        dialogues: [
            "تو تنها کسی هستی که می‌تونم بهش اعتماد کنم... 🤫",
            "عمویم فکر می‌کنه مردم... ولی من زنده‌ام!",
            "اگه کمکم کنی تاج و تختم رو پس بگیرم... ملکه‌ات می‌شم... 👑",
            "اسم واقعیم آریاناست... ولی اینجا کسی نباید بدونه..."
        ],
        specialMissions: [
            { name: 'پیدا کردن اسناد سلطنتی', description: 'اسناد خیانت عموش رو پیدا کن', reward: { gold: 3000, diamond: 5 }, duration: 48 },
            { name: 'انتقام از عمو', description: 'به پرنسس کمک کن تاج و تخت رو پس بگیره', reward: { gold: 5000, diamond: 10, queen: true }, duration: 72 },
            { name: 'نجات ندیمه', description: 'ندیمه‌اش توی زندان عموشه', reward: { gold: 2000, diamond: 3, servant: true }, duration: 24 }
        ]
    }
];

// ============ پسران مخفی‌گاه ============
const secretBoys = [
    { 
        id: 'servant_boy', name: 'پسر خدمتکار', emoji: '🧒', rarity: 'common',
        description: 'پسر جوونی که توی قصر کار می‌کنه. شب‌ها میاد مخفی‌گاه.',
        requirements: { level: 1 }, cost: 20, 
        rewards: { xp: 10, gold: 5 }
    },
    { 
        id: 'soldier', name: 'سرباز', emoji: '⚔️🧒', rarity: 'common',
        description: 'سرباز جوونی که بعد از جنگ به مخفی‌گاه پناه آورده.',
        requirements: { level: 5, attack: 20 }, cost: 50, 
        rewards: { xp: 20, attack: 3 }
    },
    { 
        id: 'musician', name: 'نوازنده', emoji: '🎵🧒', rarity: 'rare',
        description: 'نوازنده دوره‌گرد که آهنگ‌های غمگین می‌زنه.',
        requirements: { level: 10 }, cost: 30, 
        rewards: { xp: 15, song: 1, mood: 10 }
    },
    { 
        id: 'teacher', name: 'معلم', emoji: '📚🧒', rarity: 'rare',
        description: 'معلم جوانی که از مدرسه اخراج شده. حالا توی مخفی‌گاه درس میده.',
        requirements: { level: 15 }, cost: 40, 
        rewards: { xp: 25, intelligence: 5 }
    },
    { 
        id: 'young_knight', name: 'شوالیه جوان', emoji: '🛡️🧒', rarity: 'epic',
        description: 'شوالیه‌ای که شرافتش رو از دست داده. به دنبال redemption.',
        requirements: { level: 20, attack: 100 }, cost: 100, 
        rewards: { xp: 50, defense: 10, gold: 50 }
    },
    { 
        id: 'exiled_prince', name: 'شاهزاده تبعیدی', emoji: '🤴', rarity: 'legendary',
        description: 'شاهزاده‌ای از پادشاهی دور. مثل پرنسس آریانا، به دنبال متحد.',
        requirements: { level: 25, gold: 500, score: 1000 }, cost: 500, 
        rewards: { xp: 100, diamond: 5, gold: 300 }
    }
];

// ============ فعالیت‌های مخفی‌گاه ============
const activities = {
    gambling: { name: 'قمار', emoji: '🎲', cost: 50, reward: { gold: 100 }, riskChance: 0.5, description: '۵۰٪ شانس بردن ۱۰۰👑' },
    drinking: { name: 'مِی‌خانه', emoji: '🍷', cost: 30, reward: { mood: 20 }, riskChance: 0.1, riskEffect: 'مسمومیت', description: '۱۰٪ شانس مسمومیت' },
    music: { name: 'موسیقی زنده', emoji: '🎵', cost: 20, reward: { mood: 15 }, riskChance: 0, description: 'گوش دادن به آواز' },
    fortune: { name: 'فال‌گیری', emoji: '🔮', cost: 50, reward: { wish: 1 }, riskChance: 0, description: 'دیدن ۱ رویداد آینده' },
    fighting: { name: 'مبارزه زیرزمینی', emoji: '🗡️', cost: 100, reward: { gold: 300, xp: 50 }, riskChance: 0.3, riskEffect: 'زخمی شدن', description: '۳۰٪ شانس آسیب' },
    opium: { name: 'تریاک', emoji: '💊', cost: 100, reward: { mood: 50 }, riskChance: 0.4, riskEffect: 'اعتیاد', description: '۴۰٪ شانس اعتیاد' }
};

// ============ اتاق‌ها ============
const chamberRooms = {
    normal: { name: 'اتاق معمولی', emoji: '🛏️', cost: 20, bonus: 1, riskOfExposure: 0.3 },
    vip: { name: 'اتاق VIP', emoji: '🛏️✨', cost: 100, bonus: 2, riskOfExposure: 0.15 },
    royal: { name: 'اتاق سلطنتی', emoji: '🛏️💫', cost: 500, bonus: 3, riskOfExposure: 0.05 },
    secret: { name: 'اتاق مخفی', emoji: '🔒', cost: 1000, bonus: 3, riskOfExposure: 0 }
};

// ============ توابع اصلی ============
function initSecretChamber(player) {
    if (!player.secretChamber) {
        player.secretChamber = {
            girls: [],
            boys: [],
            visitsToday: 0,
            maxVisits: 5,
            lastVisit: Date.now(),
            totalVisits: 0,
            loyaltyLevel: 1,
            gold: 0,
            reputation: 50,
            guards: [],
            activeAddiction: false,
            addictionDays: 0
        };
    }
    return player.secretChamber;
}

function resetDailyVisits(player) {
    initSecretChamber(player);
    const now = Date.now();
    const oneDay = 24 * 60 * 60 * 1000;
    if (now - player.secretChamber.lastVisit > oneDay) {
        player.secretChamber.visitsToday = 0;
    }
}

function getAvailableGirls(player) {
    initSecretChamber(player);
    const available = [];
    for (let girl of secretGirls) {
        let canMeet = true;
        if (girl.requirements.level && player.level < girl.requirements.level) canMeet = false;
        if (girl.requirements.gold && (player.inventory?.gold || 0) < girl.requirements.gold) canMeet = false;
        if (girl.requirements.score && (player.score || 0) < girl.requirements.score) canMeet = false;
        available.push({ ...girl, canMeet });
    }
    return available;
}

function getAvailableBoys(player) {
    initSecretChamber(player);
    const available = [];
    for (let boy of secretBoys) {
        let canMeet = true;
        if (boy.requirements.level && player.level < boy.requirements.level) canMeet = false;
        if (boy.requirements.gold && (player.inventory?.gold || 0) < boy.requirements.gold) canMeet = false;
        if (boy.requirements.attack && (player.attack || 0) < boy.requirements.attack) canMeet = false;
        if (boy.requirements.score && (player.score || 0) < boy.requirements.score) canMeet = false;
        available.push({ ...boy, canMeet });
    }
    return available;
}
function visitGirl(player, girlId, roomType) {
    initSecretChamber(player);
    resetDailyVisits(player);
    
    if (player.secretChamber.visitsToday >= player.secretChamber.maxVisits) {
        return { success: false, message: '❌ امروز ۵ بار اومدی! دیگه کافیه.\n📅 فردا صبر کن.' };
    }
    
    const girl = secretGirls.find(g => g.id === girlId);
    if (!girl) return { success: false, message: '❌ این دختر پیدا نشد!' };
    
    if (girl.requirements.level && player.level < girl.requirements.level) {
        return { success: false, message: `❌ سطح ${girl.requirements.level} لازمه! (سطح تو: ${player.level})` };
    }
    if (girl.requirements.gold && (player.inventory?.gold || 0) < girl.requirements.gold) {
        return { success: false, message: `❌ ${girl.requirements.gold}👑 طلا لازمه!' }` };
    }
    
    const room = chamberRooms[roomType] || chamberRooms.normal;
    const totalCost = girl.cost + room.cost;
    
    if ((player.inventory?.gold || 0) < totalCost) {
        return { success: false, message: `❌ طلا کافی نداری!\n👑 نیاز: ${totalCost} (دختر: ${girl.cost} + اتاق: ${room.cost})` };
    }
    
    player.inventory.gold -= totalCost;
    
    // پیدا کردن یا ایجاد رکورد رابطه
    let girlRecord = player.secretChamber.girls.find(g => g.id === girlId);
    if (!girlRecord) {
        girlRecord = { id: girlId, visits: 0, trust: 0, gifts: 0, lastVisit: Date.now() };
        player.secretChamber.girls.push(girlRecord);
    }
    
    girlRecord.visits++;
    girlRecord.trust = Math.min(100, girlRecord.trust + 2);
    girlRecord.lastVisit = Date.now();
    
    // محاسبه جایزه با بونوس اتاق
    let rewardMsg = '';
    const bonus = room.bonus;
    if (girl.rewards.xp) { const val = (girl.rewards.xp || 0) * bonus; player.xp = (player.xp || 0) + val; rewardMsg += `\n✨ +${val} XP`; }
    if (girl.rewards.gold && girl.rewards.gold > 0) { const val = (girl.rewards.gold || 0) * bonus; player.inventory.gold = (player.inventory.gold || 0) + val; rewardMsg += `\n👑 +${val} طلا`; }
    if (girl.rewards.diamond) { const val = (girl.rewards.diamond || 0) * bonus; player.inventory.diamond = (player.inventory.diamond || 0) + val; rewardMsg += `\n💎 +${val} الماس`; }
    if (girl.rewards.ring) { player.inventory.ring = (player.inventory.ring || 0) + girl.rewards.ring; rewardMsg += `\n💍 +${girl.rewards.ring} حلقه`; }
    if (girl.rewards.key) { player.inventory.key = (player.inventory.key || 0) + girl.rewards.key; rewardMsg += `\n🗝️ +${girl.rewards.key} کلید`; }
    if (girl.rewards.wish) { player.inventory.wish = (player.inventory.wish || 0) + girl.rewards.wish; rewardMsg += `\n🔮 +${girl.rewards.wish} آرزو`; }
    if (girl.rewards.mood) { rewardMsg += `\n😊 روحیه +${girl.rewards.mood}`; }
    
    // خطر لو رفتن
    const exposureRisk = room.riskOfExposure + (player.secretChamber.visitsToday * 0.05);
    let exposureMsg = '';
    let exposed = false;
    
    if (Math.random() < exposureRisk) {
        exposed = true;
        exposureMsg = '\n\n⚠️ *خطر!* یکی از ملکه‌ها فهمید اینجایی!';
        
        // اثر روی ملکه‌ها
        if (player.harem && player.harem.queens) {
            const randomQueen = player.harem.queens[Math.floor(Math.random() * player.harem.queens.length)];
            if (randomQueen) {
                randomQueen.mood = Math.max(0, randomQueen.mood - 30);
                exposureMsg += `\n😡 ${randomQueen.emoji} ${randomQueen.name} عصبانی شد! (روحیه -۳۰)`;
            }
        }
    }
    
    player.secretChamber.visitsToday++;
    player.secretChamber.totalVisits++;
    player.secretChamber.lastVisit = Date.now();
    
    // آپدیت سطح وفاداری
    updateLoyaltyLevel(player);
    
    // چک کردن ارتقا به ملکه
    let queenMsg = '';
    if (girl.canBecomeQueen && girlRecord.trust >= girl.trustNeeded && !girlRecord.becameQueen) {
        queenMsg = `\n\n👑 *${girl.name}* آماده رفتن به حرمسراست!\nبا دستور promotequeen ${girlId} بیارش.`;
    }
    
    const dialogue = girl.dialogues[Math.floor(Math.random() * girl.dialogues.length)];
    const rarities = { common: '⚪', rare: '🔵', epic: '🟣', legendary: '🟡' };
    
    return {
        success: true,
        message: `🔞 *مخفی‌گاه*\n\n${girl.emoji} *${girl.name}* ${rarities[girl.rarity]}\n📝 ${girl.description}\n💕 اعتماد: ${girlRecord.trust}/${girl.trustNeeded}\n\n💬 "${dialogue}"\n\n🎁 *پاداش:*${rewardMsg}\n👑 هزینه: ${totalCost} طلا\n🏠 اتاق: ${room.name}${exposureMsg}${queenMsg}\n\n📅 بازدید ${player.secretChamber.visitsToday}/${player.secretChamber.maxVisits}`,
        exposed
    };
}

function visitBoy(player, boyId, roomType) {
    initSecretChamber(player);
    resetDailyVisits(player);
    
    if (player.secretChamber.visitsToday >= player.secretChamber.maxVisits) {
        return { success: false, message: '❌ امروز ۵ بار اومدی! دیگه کافیه.' };
    }
    
    const boy = secretBoys.find(b => b.id === boyId);
    if (!boy) return { success: false, message: '❌ این پسر پیدا نشد!' };
    
    if (boy.requirements.level && player.level < boy.requirements.level) {
        return { success: false, message: `❌ سطح ${boy.requirements.level} لازمه!' }` };
    }
    
    const room = chamberRooms[roomType] || chamberRooms.normal;
    const totalCost = boy.cost + room.cost;
    
    if ((player.inventory?.gold || 0) < totalCost) {
        return { success: false, message: `❌ طلا کافی نداری!\n👑 نیاز: ${totalCost}` };
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
    let rewardMsg = '';
    if (boy.rewards.xp) { player.xp = (player.xp || 0) + boy.rewards.xp * bonus; rewardMsg += `\n✨ +${boy.rewards.xp * bonus} XP`; }
    if (boy.rewards.gold && boy.rewards.gold > 0) { player.inventory.gold = (player.inventory.gold || 0) + boy.rewards.gold * bonus; rewardMsg += `\n👑 +${boy.rewards.gold * bonus} طلا`; }
    if (boy.rewards.attack) { player.attack = (player.attack || 0) + boy.rewards.attack; rewardMsg += `\n⚔️ +${boy.rewards.attack} حمله`; }
    if (boy.rewards.defense) { player.defense = (player.defense || 0) + boy.rewards.defense; rewardMsg += `\n🛡️ +${boy.rewards.defense} دفاع`; }
    if (boy.rewards.song) { player.inventory.song = (player.inventory.song || 0) + boy.rewards.song; rewardMsg += `\n🎵 +${boy.rewards.song} آواز`; }
    if (boy.rewards.diamond) { player.inventory.diamond = (player.inventory.diamond || 0) + boy.rewards.diamond; rewardMsg += `\n💎 +${boy.rewards.diamond} الماس`; }
    
    const exposureRisk = room.riskOfExposure + (player.secretChamber.visitsToday * 0.05);
    let exposureMsg = '';
    let exposed = false;
    
    if (Math.random() < exposureRisk) {
        exposed = true;
        exposureMsg = '\n\n⚠️ *خطر!* یکی از ملکه‌ها فهمید اینجایی!';
        if (player.harem && player.harem.queens) {
            const randomQueen = player.harem.queens[Math.floor(Math.random() * player.harem.queens.length)];
            if (randomQueen) {
                randomQueen.mood = Math.max(0, randomQueen.mood - 25);
                exposureMsg += `\n😡 ${randomQueen.emoji} ${randomQueen.name} ناراحت شد!`;
            }
        }
    }
    
    player.secretChamber.visitsToday++;
    player.secretChamber.totalVisits++;
    player.secretChamber.lastVisit = Date.now();
    updateLoyaltyLevel(player);
    
    const rarities = { common: '⚪', rare: '🔵', epic: '🟣', legendary: '🟡' };
    
    return {
        success: true,
        message: `🔞 *مخفی‌گاه*\n\n${boy.emoji} *${boy.name}* ${rarities[boy.rarity]}\n📝 ${boy.description}\n\n🎁 *پاداش:*${rewardMsg}\n👑 هزینه: ${totalCost} طلا${exposureMsg}\n\n📅 بازدید ${player.secretChamber.visitsToday}/${player.secretChamber.maxVisits}`,
        exposed
    };
}

function doActivity(player, activityType) {
    initSecretChamber(player);
    resetDailyVisits(player);
    
    if (player.secretChamber.visitsToday >= player.secretChamber.maxVisits) {
        return { success: false, message: '❌ امروز ۵ بار اومدی! دیگه کافیه.' };
    }
    
    const activity = activities[activityType];
    if (!activity) return { success: false, message: '❌ فعالیت نامعتبر!' };
    
    if ((player.inventory?.gold || 0) < activity.cost) {
        return { success: false, message: `❌ طلا کافی نداری!\n👑 نیاز: ${activity.cost}` };
    }
    
    player.inventory.gold -= activity.cost;
    
    let resultMsg = `${activity.emoji} *${activity.name}*\n`;
    
    if (Math.random() < activity.riskChance) {
        // باخت
        resultMsg += `\n❌ *${activity.riskEffect}!*\n`;
        if (activity.riskEffect === 'اعتیاد') {
            player.secretChamber.activeAddiction = true;
            player.secretChamber.addictionDays = 7;
            resultMsg += '💊 معتاد شدی! هر روز -۵۰👑 برای مواد.\n📅 ۷ روز طول میکشه.';
        } else if (activity.riskEffect === 'زخمی شدن') {
            player.hp = Math.max(1, (player.hp || 100) - 30);
            resultMsg += '🗡️ -۳۰❤️';
        } else if (activity.riskEffect === 'مسمومیت') {
            player.hp = Math.max(1, (player.hp || 100) - 20);
            resultMsg += '🤢 -۲۰❤️';
        }
    } else {
        // برد
        if (activity.reward.gold) { const val = activity.reward.gold || 0; player.inventory.gold = (player.inventory.gold || 0) + val; resultMsg += `\n💰 +${val}👑`; }
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
    if (!girl) return { success: false, message: '❌ این دختر پیدا نشد!' };
    
    if (!girl.canBecomeQueen) return { success: false, message: '❌ این دختر نمی‌تونه ملکه بشه!' };
    
    const girlRecord = player.secretChamber.girls.find(g => g.id === girlId);
    if (!girlRecord) return { success: false, message: '❌ هنوز باهاش رابطه نداشتی!' };
    
    if (girlRecord.trust < girl.trustNeeded) {
        return { success: false, message: `❌ اعتماد کافی نیست!\n💕 نیاز: ${girl.trustNeeded}\n💕 فعلی: ${girlRecord.trust}` };
    }
    
    if (girlRecord.becameQueen) return { success: false, message: '❌ این دختر قبلاً ملکه شده!' };
    
    // هزینه آزادسازی
    const releaseCost = 1000;
    if ((player.inventory?.gold || 0) < releaseCost) {
        return { success: false, message: `❌ طلا کافی برای آزادسازی نداری!\n👑 نیاز: ${releaseCost}` };
    }
    
    if (!player.harem || !player.harem.queens) {
        return { success: false, message: '❌ اول باید حرمسرا داشته باشی!' };
    }
    
    player.inventory.gold -= releaseCost;
    
    // اضافه کردن به حرمسرا
    const queenData = {
        id: 'queen_' + Date.now(),
        npcId: girlId,
        name: girl.name,
        emoji: girl.emoji,
        rank: girl.queenRank || 'concubine',
        points: girlRecord.trust,
        joinedAt: Date.now(),
        pregnancies: [],
        children: [],
        mood: 80,
        health: 100,
        reputation: 60,
        lastCare: Date.now(),
        isSpouse: false,
        room: 'simple',
        servants: [],
        dress: null,
        jewelry: [],
        diary: [],
        upbringing: null,
        cameFromChamber: true
    };
    
    player.harem.queens.push(queenData);
    girlRecord.becameQueen = true;
    
    // حذف از مخفی‌گاه
    player.secretChamber.girls = player.secretChamber.girls.filter(g => g.id !== girlId);
    
    return {
        success: true,
        message: `👑 ${girl.emoji} *${girl.name}* از مخفی‌گاه به حرمسرا اومد!\n👸 رتبه: ${girl.queenRank}\n💕 اعتماد: ${girlRecord.trust}\n💰 هزینه آزادسازی: ${releaseCost}👑\n\n🎉 تبریک! یه ملکه جدید داری!`
    };
}

function giveGift(player, personId, isGirl) {
    initSecretChamber(player);
    
    const person = isGirl ? 
        player.secretChamber.girls.find(g => g.id === personId) :
        player.secretChamber.boys.find(b => b.id === personId);
    
    if (!person) return { success: false, message: '❌ این شخص پیدا نشد!' };
    
    if ((player.inventory?.gold || 0) < 100) {
        return { success: false, message: '❌ حداقل ۱۰۰👑 برای هدیه لازمه!' };
    }
    
    player.inventory.gold -= 100;
    person.trust = Math.min(100, person.trust + 15);
    person.gifts = (person.gifts || 0) + 1;
    
    return {
        success: true,
        message: `🎁 هدیه داده شد!\n💕 اعتماد +۱۵\n👑 -۱۰۰ طلا\n💕 اعتماد فعلی: ${person.trust}`
    };
}

function hireGuard(player, guardType) {
    initSecretChamber(player);
    
    const guards = {
        doorman: { name: 'دربان', emoji: '🛡️', cost: 500, salary: 50, effect: 'خطر لو رفتن -۱۰٪' },
        watchman: { name: 'دیده‌بان', emoji: '👀', cost: 1000, salary: 100, effect: 'اخطار قبل از حمله' },
        bodyguard: { name: 'محافظ شخصی', emoji: '🗡️', cost: 2000, salary: 200, effect: 'محافظت از پادشاه' }
    };
    
    const guard = guards[guardType];
    if (!guard) return { success: false, message: '❌ نگهبان نامعتبر!' };
    
    if (player.secretChamber.guards.find(g => g.type === guardType)) {
        return { success: false, message: '❌ این نگهبان قبلاً استخدام شده!' };
    }
    
    if ((player.inventory?.gold || 0) < guard.cost) {
        return { success: false, message: `❌ طلا کافی نداری!\n👑 نیاز: ${guard.cost}` };
    }
    
    player.inventory.gold -= guard.cost;
    player.secretChamber.guards.push({ type: guardType, hiredAt: Date.now() });
    
    return {
        success: true,
        message: `${guard.emoji} *${guard.name}* استخدام شد!\n📝 ${guard.effect}\n💰 حقوق ماهانه: ${guard.salary}👑`
    };
}

function updateLoyaltyLevel(player) {
    initSecretChamber(player);
    
    const totalVisits = player.secretChamber.totalVisits;
    let level = 1;
    
    if (totalVisits >= 100) level = 5;      // سهام‌دار
    else if (totalVisits >= 50) level = 4;  // VIP
    else if (totalVisits >= 20) level = 3;  // مشتری دائم
    else if (totalVisits >= 5) level = 2;   // مشتری
    
    player.secretChamber.loyaltyLevel = level;
    return level;
}

function getLoyaltyDiscount(player) {
    initSecretChamber(player);
    const discounts = { 1: 0, 2: 10, 3: 20, 4: 30, 5: 50 };
    return discounts[player.secretChamber.loyaltyLevel] || 0;
}

function checkAddiction(player) {
    initSecretChamber(player);
    
    if (!player.secretChamber.activeAddiction) return null;
    
    player.secretChamber.addictionDays--;
    
    if (player.secretChamber.addictionDays <= 0) {
        player.secretChamber.activeAddiction = false;
        return { recovered: true, message: '🎉 از اعتیاد پاک شدی! دیگه سالمی.' };
    }
    
    const cost = 50;
    if ((player.inventory?.gold || 0) < cost) {
        player.hp = Math.max(1, (player.hp || 100) - 20);
        return { recovered: false, message: `💊 پول مواد نداری! -۲۰❤️\n📅 ${player.secretChamber.addictionDays} روز مونده تا پاک بشی.` };
    }
    
    player.inventory.gold -= cost;
    return { recovered: false, message: `💊 مواد مصرف شد. -۵۰👑\n📅 ${player.secretChamber.addictionDays} روز مونده تا پاک بشی.` };
}

function getSpecialMission(player, girlId) {
    const girl = secretGirls.find(g => g.id === girlId);
    if (!girl || !girl.specialMissions) return null;
    
    const girlRecord = player.secretChamber?.girls?.find(g => g.id === girlId);
    if (!girlRecord || girlRecord.trust < 50) return null;
    
    // انتخاب مأموریت انجام نشده
    const availableMissions = girl.specialMissions.filter(m => !girlRecord.completedMissions?.includes(m.name));
    if (availableMissions.length === 0) return null;
    
    return availableMissions[Math.floor(Math.random() * availableMissions.length)];
}

function completeSpecialMission(player, girlId, missionName) {
    const girl = secretGirls.find(g => g.id === girlId);
    if (!girl || !girl.specialMissions) return { success: false, message: '❌ مأموریت پیدا نشد!' };
    
    const mission = girl.specialMissions.find(m => m.name === missionName);
    if (!mission) return { success: false, message: '❌ مأموریت نامعتبر!' };
    
    const girlRecord = player.secretChamber.girls.find(g => g.id === girlId);
    if (!girlRecord) return { success: false, message: '❌ هنوز باهاش رابطه نداشتی!' };
    
    if (!girlRecord.completedMissions) girlRecord.completedMissions = [];
    girlRecord.completedMissions.push(missionName);
    
    let rewardMsg = '';
    if (mission.reward.gold) { player.inventory.gold = (player.inventory.gold || 0) + mission.reward.gold; rewardMsg += `\n👑 +${mission.reward.gold} طلا`; }
    if (mission.reward.diamond) { player.inventory.diamond = (player.inventory.diamond || 0) + mission.reward.diamond; rewardMsg += `\n💎 +${mission.reward.diamond} الماس`; }
    if (mission.reward.queen) {
        const queenResult = upgradeGirlToQueen(player, girlId);
        if (queenResult.success) rewardMsg += `\n👑 ${girl.name} ملکه شد!`;
    }
    
    return {
        success: true,
        message: `✅ مأموریت *${mission.name}* کامل شد!\n📝 ${mission.description}${rewardMsg}`
    };
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
    
    if (player.secretChamber.guards.length > 0) {
        msg += `\n🛡️ *نگهبانان:* `;
        for (let g of player.secretChamber.guards) {
            msg += `${g.type} `;
        }
        msg += '\n';
    }
    
    msg += '\n👩 *دختران:*\n';
    const girls = getAvailableGirls(player);
    for (let girl of girls) {
        const record = player.secretChamber.girls.find(g => g.id === girl.id);
        const trust = record ? record.trust : 0;
        const visits = record ? record.visits : 0;
        const becameQueen = record ? record.becameQueen : false;
        
        if (becameQueen) {
            msg += `👑 ${girl.emoji} ${girl.name} - *ملکه شده!*\n`;
        } else if (girl.canMeet) {
            msg += `✅ ${girl.emoji} ${girl.name} - ${girl.cost}👑 | 💕${trust} | 👁️${visits}\n`;
        } else {
            msg += `🔒 ${girl.emoji} ${girl.name} - نیاز به سطح ${girl.requirements.level}+\n`;
        }
    }
    
    msg += '\n👦 *پسران:*\n';
    const boys = getAvailableBoys(player);
    for (let boy of boys) {
        const record = player.secretChamber.boys.find(b => b.id === boy.id);
        const trust = record ? record.trust : 0;
        const visits = record ? record.visits : 0;
        
        if (boy.canMeet) {
            msg += `✅ ${boy.emoji} ${boy.name} - ${boy.cost}👑 | 💕${trust} | 👁️${visits}\n`;
        } else {
            msg += `🔒 ${boy.emoji} ${boy.name} - نیاز به سطح ${boy.requirements.level}+\n`;
        }
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
    
    // بخش دختران
    for (let girl of girls) {
        const record = player.secretChamber.girls.find(g => g.id === girl.id);
        const becameQueen = record ? record.becameQueen : false;
        
        if (girl.canMeet && !becameQueen) {
            const canBeQueen = girl.canBecomeQueen && record && record.trust >= girl.trustNeeded;
            const prefix = canBeQueen ? '👑 ' : '👩 ';
            buttons.push([`${prefix}${girl.emoji} ${girl.name} (${girl.cost}👑)`]);
        }
    }
    
    // بخش پسران
    for (let boy of boys) {
        if (boy.canMeet) {
            buttons.push([`👦 ${boy.emoji} ${boy.name} (${boy.cost}👑)`]);
        }
    }
    
    buttons.push(['🎲 قمار (۵۰👑)', '🍷 میخانه (۳۰👑)']);
    buttons.push(['🎵 موسیقی (۲۰👑)', '🔮 فال‌گیری (۵۰👑)']);
    buttons.push(['🗡️ مبارزه (۱۰۰👑)', '💊 تریاک (۱۰۰👑)']);
    buttons.push(['🎁 هدیه دادن']);
    buttons.push(['🛡️ استخدام نگهبان']);
    buttons.push(['🔙 برگشت']);
    
    return { reply_markup: { keyboard: buttons, resize_keyboard: true } };
}

function getRoomKeyboard() {
    return {
        reply_markup: {
            keyboard: [
                ['🛏️ معمولی (۲۰👑) - خطر ۳۰٪'],
                ['🛏️✨ VIP (۱۰۰👑) - خطر ۱۵٪'],
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
                ['🗡️ محافظ (۲۰۰۰👑)'],
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

function getRandomChamberEvent(player) {
    initSecretChamber(player);
    
    const events = [
        { chance: 0.10, name: 'شب رایگان', emoji: '🎉', message: 'امشب همه چی رایگانه!', effect: 'free' },
        { chance: 0.15, name: 'دختر جدید', emoji: '👯', message: 'یه دختر جدید به مخفی‌گاه اومده!', effect: 'newGirl' },
        { chance: 0.08, name: 'یورش نگهبانان', emoji: '🚨', message: 'نگهبانان سلطنتی دارن میان! مخفی‌گاه ۲۴ ساعت تعطیله!', effect: 'raid' },
        { chance: 0.05, name: 'بازدید سلطنتی', emoji: '👑', message: 'پادشاه شخصاً میاد مخفی‌گاه! همه چی ۵۰٪ تخفیف!', effect: 'royalVisit' },
        { chance: 0.12, name: 'بخت‌آزمایی', emoji: '💰', message: 'شانس بردن ۱۰۰۰👑! می‌خوای شرکت کنی؟', effect: 'lottery' }
    ];
    
    const r = Math.random();
    let cumulative = 0;
    for (let event of events) {
        cumulative += event.chance;
        if (r < cumulative) return event;
    }
    
    return null;
}

function handleChamberEvent(player, event) {
    initSecretChamber(player);
    
    switch (event.effect) {
        case 'free':
            player.secretChamber.maxVisits = 10;
            return { success: true, message: '🎉 امشب می‌تونی ۱۰ بار بیای مخفی‌گاه!' };
        case 'newGirl':
            return { success: true, message: '👯 یه دختر جدید اضافه شد! برو ببین.' };
        case 'raid':
            player.secretChamber.visitsToday = player.secretChamber.maxVisits;
            return { success: true, message: '🚨 مخفی‌گاه تعطیل شد! امروز نمی‌تونی بیای.' };
        case 'royalVisit':
            return { success: true, message: '👑 همه چی ۵۰٪ تخفیف برای امروز!' };
        case 'lottery':
            if (Math.random() < 0.3) {
                player.inventory.gold = (player.inventory.gold || 0) + 1000;
                return { success: true, message: '🎉 برنده شدی! +۱۰۰۰👑' };
            }
            return { success: false, message: '😢 باختی! یه وقت دیگه...' };
        default:
            return { success: false, message: '❌ رویداد نامعتبر!' };
    }
}

module.exports = {
    secretGirls,
    secretBoys,
    activities,
    chamberRooms,
    initSecretChamber,
    resetDailyVisits,
    getAvailableGirls,
    getAvailableBoys,
    visitGirl,
    visitBoy,
    doActivity,
    upgradeGirlToQueen,
    giveGift,
    hireGuard,
    updateLoyaltyLevel,
    getLoyaltyDiscount,
    checkAddiction,
    getSpecialMission,
    completeSpecialMission,
    formatSecretChamber,
    getSecretChamberKeyboard,
    getRoomKeyboard,
    getGuardKeyboard,
    getGiftKeyboard,
    getRandomChamberEvent,
    handleChamberEvent
};