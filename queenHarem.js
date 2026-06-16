const config = require('./config');

const haremImages = {
    pregnant_queen: 'AgACAgQAAxkBAAEqcbZqKX_a4-_MtgzDxMBujjPA5ajaUQACLg9rG9N3UVHiWwABA5CaoVABAAMCAAN4AAM7BA',
    pregnant_woman: 'AgACAgQAAxkBAAEqcbtqKX_aM-MBVbXASWtHss-IvIHahQACMQ9rG9N3UVFZhM7A2L3PPAEAAwIAA3gAAzsE',
    pregnant_queen2: 'AgACAgQAAxkBAAEqcbhqKX_a3_hckqFHx6laLWuFHTKhHQACLw9rG9N3UVEx5s_CVaUYHQEAAwIAA3gAAzsE'
};

const haremRanks = {
    queen_mother: { name: 'ملکه مادر', emoji: '👑👸', max: 1, salary: 300, food: 50, respect: 100, fertilityBonus: 15 },
    main_queen: { name: 'ملکه اصلی', emoji: '👸', max: 1, salary: 200, food: 40, respect: 80, fertilityBonus: 10 },
    favorite: { name: 'سوگلی', emoji: '💋', max: 2, salary: 100, food: 30, respect: 60, fertilityBonus: 5 },
    wife: { name: 'همسر', emoji: '👰', max: 3, salary: 50, food: 20, respect: 40, fertilityBonus: 2 },
    concubine: { name: 'کنیز', emoji: '🧹', max: 99, salary: 10, food: 10, respect: 20, fertilityBonus: 0 }
};

const rooms = {
    basement: { name: 'زیرزمین', emoji: '🛏️', cost: 0, bonus: 0, minRank: 'concubine' },
    simple: { name: 'اتاق ساده', emoji: '🛏️', cost: 200, bonus: 5, minRank: 'concubine' },
    medium: { name: 'اتاق متوسط', emoji: '🛏️✨', cost: 500, bonus: 10, minRank: 'wife' },
    luxury: { name: 'اتاق لوکس', emoji: '🛏️💫', cost: 1000, bonus: 15, minRank: 'favorite' },
    royal: { name: 'سوئیت سلطنتی', emoji: '👑🛏️', cost: 5000, bonus: 25, minRank: 'main_queen' }
};

const servants = {
    maid: { name: 'کلفت', emoji: '🧹', salary: 20, effect: 'نظافت', roomBonus: 2 },
    cook: { name: 'آشپز', emoji: '👩‍🍳', salary: 30, effect: 'غذا', healthBonus: 5 },
    stylist: { name: 'آرایشگر', emoji: '💇', salary: 40, effect: 'آرایش', moodBonus: 10 },
    tailor: { name: 'خیاط', emoji: '👗', salary: 50, effect: 'لباس', clothesBonus: 1 },
    guard: { name: 'محافظ', emoji: '🛡️', salary: 100, effect: 'امنیت', safetyBonus: 15 }
};

const dresses = {
    cotton: { name: 'کتان ساده', emoji: '👗', cost: 50, moodBonus: 5 },
    silk: { name: 'ابریشم', emoji: '👗✨', cost: 200, moodBonus: 10 },
    velvet: { name: 'مخمل', emoji: '👗💫', cost: 500, moodBonus: 15 },
    goldBrocade: { name: 'زربفت', emoji: '👗🌟', cost: 1000, moodBonus: 20 },
    silkGauze: { name: 'حریر', emoji: '👗💎', cost: 2000, moodBonus: 30, fertilityBonus: 5 }
};

const jewelry = {
    silver: { name: 'نقره', emoji: '💍', cost: 100, moodBonus: 5 },
    gold: { name: 'طلا', emoji: '💍✨', cost: 500, moodBonus: 10 },
    ruby: { name: 'یاقوت', emoji: '💍🔴', cost: 1000, moodBonus: 15, fertilityBonus: 5 },
    diamond: { name: 'الماس', emoji: '💍💎', cost: 5000, moodBonus: 20, loyaltyBonus: 30 },
    crown: { name: 'تاج', emoji: '👑', cost: 10000, moodBonus: 30, makesQueen: true }
};

const pregnancyTimes = {
    normal: { hours: 72, diamondCost: 0, name: 'عادی (۷۲ ساعت)' },
    fast: { hours: 48, diamondCost: 5, name: 'سریع (۴۸ ساعت) - ۵💎' },
    faster: { hours: 24, diamondCost: 15, name: 'فوری (۲۴ ساعت) - ۱۵💎' },
    instant: { hours: 2, diamondCost: 50, name: 'لحظه‌ای (۲ ساعت) - ۵۰💎' },
    now: { hours: 0, diamondCost: 100, name: 'همین الان - ۱۰۰💎' }
};

function initHarem(player) {
    if (!player.harem) {
        player.harem = { queens: [], budget: 0, lastSalary: Date.now(), rumors: [], diaryEntries: [] };
    }
    return player.harem;
}

function addQueenToHarem(player, npcId) {
    initHarem(player);
    const inHouse = player.house?.find(h => h.npcId === npcId);
    if (!inHouse) return { success: false, message: '❌ اول باید با addhouse دعوتش کنی به خونه!' };
    if (player.harem.queens.find(q => q.npcId === npcId)) return { success: false, message: '❌ این ملکه قبلاً توی حرمسراست!' };

    const npcData = config.images.npcs?.[npcId] || config.images.enemies?.[npcId];
    const points = (player.prisonRelations && player.prisonRelations[npcId]) || 0;

    let rank = 'concubine';
    if (points >= 100) rank = 'main_queen';
    else if (points >= 70) rank = 'favorite';
    else if (points >= 40) rank = 'wife';

    const queen = {
        id: 'queen_' + Date.now(), npcId, name: npcData?.name || npcId, emoji: npcData?.emoji || '👤',
        rank, points, joinedAt: Date.now(), pregnancies: [], children: [],
        mood: 70, health: 100, lastCare: Date.now(),
        isSpouse: player.marry === npcId, room: 'basement', servants: [],
        dress: null, jewelry: [], diary: [], upbringing: null
    };

    player.harem.queens.push(queen);
    const houseIndex = player.house.findIndex(h => h.npcId === npcId);
    if (houseIndex > -1) player.house.splice(houseIndex, 1);

    return { success: true, message: `${queen.emoji} *${queen.name}* وارد حرمسرا شد!\n👑 رتبه: ${haremRanks[rank].emoji} ${haremRanks[rank].name}` };
}

function startPregnancy(player, queenId, speedType) {
    initHarem(player);
    const queen = player.harem.queens.find(q => q.id === queenId);
    if (!queen) return { success: false, message: '❌ ملکه پیدا نشد!' };
    if (queen.pregnancies?.find(p => !p.born && Date.now() < p.dueDate)) return { success: false, message: '❌ این ملکه قبلاً بارداره!' };

    const speed = pregnancyTimes[speedType] || pregnancyTimes.normal;
    if (speed.diamondCost > 0 && (player.inventory?.diamond || 0) < speed.diamondCost) return { success: false, message: `❌ الماس کافی نداری!\n💎 نیاز: ${speed.diamondCost}` };
    if (speed.diamondCost > 0) player.inventory.diamond -= speed.diamondCost;

    const rankBonus = haremRanks[queen.rank]?.fertilityBonus || 0;
    const totalHours = Math.max(0, speed.hours - Math.floor(rankBonus / 2));

    const pregnancy = {
        id: 'preg_' + Date.now(), queenId, startedAt: Date.now(),
        dueDate: Date.now() + totalHours * 60 * 60 * 1000,
        speedType, diamondUsed: speed.diamondCost, born: false
    };
    
    if (!queen.pregnancies) queen.pregnancies = [];
    queen.pregnancies.push(pregnancy);

    let msg = `🤰 ${queen.emoji} *${queen.name}* باردار شد!\n⏰ ${totalHours} ساعت تا تولد`;
    if (speed.diamondCost > 0) msg += `\n💎 -${speed.diamondCost} الماس`;
    return { success: true, message: msg };
}

function speedUpPregnancy(player, queenId, pregnancyId, speedType) {
    initHarem(player);
    const queen = player.harem.queens.find(q => q.id === queenId);
    if (!queen) return { success: false, message: '❌ ملکه پیدا نشد!' };
    const pregnancy = queen.pregnancies?.find(p => p.id === pregnancyId && !p.born);
    if (!pregnancy) return { success: false, message: '❌ بارداری فعال پیدا نشد!' };

    const speed = pregnancyTimes[speedType];
    if (!speed || speed.diamondCost === 0) return { success: false, message: '❌ نوع سرعت نامعتبر!' };
    if ((player.inventory?.diamond || 0) < speed.diamondCost) return { success: false, message: `❌ الماس کافی نداری!\n💎 نیاز: ${speed.diamondCost}` };
    player.inventory.diamond -= speed.diamondCost;

    pregnancy.dueDate = Date.now() + speed.hours * 60 * 60 * 1000;
    pregnancy.diamondUsed += speed.diamondCost;
    const remaining = Math.max(0, Math.ceil((pregnancy.dueDate - Date.now()) / 3600000));
    return { success: true, message: `⚡ بارداری تسریع شد!\n⏰ ${remaining} ساعت تا تولد\n💎 -${speed.diamondCost} الماس` };
}

function checkHaremBirths(player) {
    initHarem(player);
    const now = Date.now();
    const births = [];

    for (let queen of player.harem.queens) {
        if (!queen.pregnancies) continue;
        for (let pregnancy of queen.pregnancies) {
            if (!pregnancy.born && now >= pregnancy.dueDate) {
                pregnancy.born = true;
                const { getRandomName, getRandomGender, getRandomClass, childClasses } = require('./offspring');
                const gender = getRandomGender();
                const className = getRandomClass();
                const classData = childClasses[className];
                const fertilityBonus = haremRanks[queen.rank]?.fertilityBonus || 0;

                const child = {
                    id: 'child_' + Date.now() + '_' + Math.random().toString(36).substr(2, 5),
                    name: getRandomName(gender), gender,
                    emoji: gender === 'male' ? '👦' : '👧',
                    class: className, classEmoji: classData.emoji, className: classData.name,
                    motherId: queen.npcId, motherName: queen.name, motherEmoji: queen.emoji,
                    isSpouse: queen.isSpouse, bornAt: now, age: 0, ageStage: 'baby', stageEmoji: '👶',
                    level: 1, evolutionLevel: 1, evolutionName: 'نوزاد',
                    xp: 0, xpNeeded: 20,
                    attack: Math.floor(Math.random() * 5) + 1 + Math.floor(fertilityBonus / 5),
                    defense: Math.floor(Math.random() * 3) + 1 + Math.floor(fertilityBonus / 7),
                    hp: Math.floor(Math.random() * 20) + 10 + fertilityBonus,
                    power: 5 + Math.floor(fertilityBonus / 3), loyalty: 100,
                    isLegendary: Math.random() < (0.02 + fertilityBonus / 500),
                    isHeir: false, isAlive: true,
                    missions: [], lastMission: 0, skills: [],
                    inventory: { food: 0, toys: 0, books: 0 }
                };

                if (child.isLegendary) {
                    child.emoji = gender === 'male' ? '🌟👦' : '🌟👧';
                    child.power = 15; child.attack *= 3; child.defense *= 3; child.hp *= 3;
                }

                if (!queen.children) queen.children = [];
                queen.children.push(child.id);
                if (!player.children) player.children = [];
                player.children.push(child);
                births.push({ queen, child });
            }
        }
    }
    return births;
}

function queenCare(player, queenId) {
    initHarem(player);
    const queen = player.harem.queens.find(q => q.id === queenId);
    if (!queen) return { success: false, message: '❌ ملکه پیدا نشد!' };
    if ((player.inventory?.gold || 0) < 50) return { success: false, message: '❌ طلا کافی نداری! (نیاز: ۵۰👑)' };
    player.inventory.gold -= 50;
    queen.mood = Math.min(100, queen.mood + 20);
    queen.health = Math.min(100, queen.health + 10);
    queen.lastCare = Date.now();
    return { success: true, message: `💆 ${queen.emoji} *${queen.name}* رسیدگی شد!\n😊 روحیه: ${queen.mood}%\n❤️ سلامت: ${queen.health}%` };
}

function careAllQueens(player) {
    initHarem(player);
    if (!player.harem.queens.length) return { success: false, message: '❌ حرمسرا خالیه!' };
    const totalCost = player.harem.queens.length * 50;
    if ((player.inventory?.gold || 0) < totalCost) return { success: false, message: `❌ طلا کافی نداری!\n👑 نیاز: ${totalCost}` };
    player.inventory.gold -= totalCost;
    for (let queen of player.harem.queens) {
        queen.mood = Math.min(100, queen.mood + 20);
        queen.health = Math.min(100, queen.health + 10);
        queen.lastCare = Date.now();
    }
    return { success: true, message: `💆 همه ${player.harem.queens.length} ملکه رسیدگی شدن!` };
}

function paySalaries(player) {
    initHarem(player);
    const now = Date.now();
    if (now - player.harem.lastSalary < 2592000000) {
        const remaining = Math.ceil((2592000000 - (now - player.harem.lastSalary)) / 86400000);
        return { success: false, message: `⏰ ${remaining} روز تا پرداخت حقوق` };
    }
    let totalSalary = 0;
    for (let queen of player.harem.queens) {
        const rankData = haremRanks[queen.rank];
        if (rankData?.salary) { totalSalary += rankData.salary; queen.mood = Math.min(100, queen.mood + 5); }
    }
    if ((player.inventory?.gold || 0) < totalSalary) {
        for (let queen of player.harem.queens) queen.mood = Math.max(0, queen.mood - 20);
        return { success: false, message: `❌ طلا کافی برای حقوق نداری!\n👑 نیاز: ${totalSalary}` };
    }
    player.inventory.gold -= totalSalary;
    player.harem.lastSalary = now;
    return { success: true, message: `💰 حقوق پرداخت شد!\n👑 مجموع: ${totalSalary} طلا` };
}

function buyDress(player, queenId, dressType) {
    initHarem(player);
    const queen = player.harem.queens.find(q => q.id === queenId);
    if (!queen) return { success: false, message: '❌ ملکه پیدا نشد!' };
    const dress = dresses[dressType];
    if (!dress) return { success: false, message: '❌ لباس نامعتبر!' };
    if ((player.inventory?.gold || 0) < dress.cost) return { success: false, message: `❌ طلا کافی نداری!\n👑 نیاز: ${dress.cost}` };
    player.inventory.gold -= dress.cost;
    queen.dress = dressType;
    queen.mood = Math.min(100, queen.mood + dress.moodBonus);
    return { success: true, message: `👗 ${dress.emoji} *${dress.name}* خریداری شد!\n😊 روحیه +${dress.moodBonus}` };
}

function buyJewelry(player, queenId, jewelryType) {
    initHarem(player);
    const queen = player.harem.queens.find(q => q.id === queenId);
    if (!queen) return { success: false, message: '❌ ملکه پیدا نشد!' };
    const jewel = jewelry[jewelryType];
    if (!jewel) return { success: false, message: '❌ جواهر نامعتبر!' };
    if ((player.inventory?.gold || 0) < jewel.cost) return { success: false, message: `❌ طلا کافی نداری!\n👑 نیاز: ${jewel.cost}` };
    player.inventory.gold -= jewel.cost;
    queen.jewelry.push(jewelryType);
    queen.mood = Math.min(100, queen.mood + jewel.moodBonus);
    if (jewel.makesQueen) {
        for (let q of player.harem.queens) { if (q.rank === 'main_queen') q.rank = 'wife'; }
        queen.rank = 'main_queen';
    }
    return { success: true, message: `${jewel.emoji} *${jewel.name}* خریداری شد!\n😊 روحیه +${jewel.moodBonus}` };
}

function upgradeRoom(player, queenId, roomType) {
    initHarem(player);
    const queen = player.harem.queens.find(q => q.id === queenId);
    if (!queen) return { success: false, message: '❌ ملکه پیدا نشد!' };
    const room = rooms[roomType];
    if (!room) return { success: false, message: '❌ اتاق نامعتبر!' };
    const rankOrder = ['concubine', 'wife', 'favorite', 'main_queen', 'queen_mother'];
    if (rankOrder.indexOf(queen.rank) < rankOrder.indexOf(room.minRank)) return { success: false, message: `❌ این اتاق مخصوص ${haremRanks[room.minRank]?.name} به بالاست!` };
    if ((player.inventory?.gold || 0) < room.cost) return { success: false, message: `❌ طلا کافی نداری!\n👑 نیاز: ${room.cost}` };
    player.inventory.gold -= room.cost;
    queen.room = roomType;
    queen.mood = Math.min(100, queen.mood + room.bonus);
    return { success: true, message: `${room.emoji} *${room.name}* آماده شد!\n😊 روحیه +${room.bonus}` };
}

function hireServant(player, queenId, servantType) {
    initHarem(player);
    const queen = player.harem.queens.find(q => q.id === queenId);
    if (!queen) return { success: false, message: '❌ ملکه پیدا نشد!' };
    const servant = servants[servantType];
    if (!servant) return { success: false, message: '❌ خدمتکار نامعتبر!' };
    if (queen.servants.includes(servantType)) return { success: false, message: '❌ قبلاً استخدام شده!' };
    if (queen.servants.length >= 3) return { success: false, message: '❌ حداکثر ۳ خدمتکار!' };
    queen.servants.push(servantType);
    if (servant.moodBonus) queen.mood = Math.min(100, queen.mood + servant.moodBonus);
    return { success: true, message: `${servant.emoji} *${servant.name}* استخدام شد!` };
}

function removeQueenFromHarem(player, queenId) {
    initHarem(player);
    const index = player.harem.queens.findIndex(q => q.id === queenId);
    if (index === -1) return { success: false, message: '❌ ملکه پیدا نشد!' };
    const queen = player.harem.queens[index];
    if (!player.house) player.house = [];
    if (!player.house.find(h => h.npcId === queen.npcId)) {
        player.house.push({ npcId: queen.npcId, name: queen.name, emoji: queen.emoji, joinedAt: Date.now() });
    }
    player.harem.queens.splice(index, 1);
    return { success: true, message: `${queen.emoji} *${queen.name}* از حرمسرا خارج شد.` };
}

function setChildUpbringing(player, queenId, upbringingType) {
    initHarem(player);
    const queen = player.harem.queens.find(q => q.id === queenId);
    if (!queen) return { success: false, message: '❌ ملکه پیدا نشد!' };
    queen.upbringing = upbringingType;
    return { success: true, message: `📚 سبک تربیت برای بچه‌های ${queen.emoji} *${queen.name}* تنظیم شد!` };
}

function performIntrigue(player, performerQueenId, targetQueenId, intrigueType) {
    initHarem(player);
    const performer = player.harem.queens.find(q => q.id === performerQueenId);
    const target = player.harem.queens.find(q => q.id === targetQueenId);
    if (!performer || !target) return { success: false, message: '❌ ملکه پیدا نشد!' };
    if (Math.random() < 0.5) {
        target.mood = Math.max(0, target.mood - 30);
        return { success: true, message: `🐍 دسیسه موفق! ${target.name} ناراحت شد.` };
    } else {
        performer.mood = Math.max(0, performer.mood - 30);
        return { success: false, message: `🚨 لو رفت! ${performer.name} تنزل کرد.` };
    }
}

function celebrateFestival(player, celebrationType) {
    initHarem(player);
    const celebrations = {
        babyShower: { name: 'حموم بچه', emoji: '👶', cost: 200 },
        springFestival: { name: 'جشن بهار', emoji: '🌸', cost: 500 }
    };
    const celeb = celebrations[celebrationType];
    if (!celeb) return { success: false, message: '❌ جشن نامعتبر!' };
    if ((player.inventory?.gold || 0) < celeb.cost) return { success: false, message: `❌ طلا کافی نداری!\n👑 نیاز: ${celeb.cost}` };
    player.inventory.gold -= celeb.cost;
    for (let queen of player.harem.queens) queen.mood = Math.min(100, queen.mood + 15);
    return { success: true, message: `${celeb.emoji} *${celeb.name}* برگزار شد!\n😊 همه +۱۵ روحیه` };
}

function getRandomDiaryEntry(player) {
    initHarem(player);
    if (!player.harem.queens.length) return null;
    const queen = player.harem.queens[Math.floor(Math.random() * player.harem.queens.length)];
    const entries = ["امروز پادشاه بهم سر زد... 😊", "دیشب فوق‌العاده بود... 💕", "دلم می‌خواد یه لباس جدید داشته باشم... 👗"];
    const entry = entries[Math.floor(Math.random() * entries.length)];
    if (!queen.diary) queen.diary = [];
    queen.diary.push({ date: Date.now(), entry });
    return { queen, entry };
}

function formatHarem(player) {
    initHarem(player);
    if (!player.harem.queens.length) return '👸 *حرمسرای امپراطوری*\n\n❌ هیچ ملکه‌ای توی حرمسرا نیست!';

    let msg = '👸 *حرمسرای امپراطوری*\n\n';
    for (let i = 0; i < player.harem.queens.length; i++) {
        const q = player.harem.queens[i];
        msg += `${i+1}. ${q.emoji} *${q.name}* | ${q.rank}\n   😊 ${q.mood}% | ❤️ ${q.health}%\n`;
        const preg = q.pregnancies?.find(p => !p.born && Date.now() < p.dueDate);
        if (preg) msg += `   🤰 ${Math.max(0, Math.ceil((preg.dueDate - Date.now()) / 3600000))} ساعت\n`;
        msg += '\n';
    }
    return msg;
}

function getHaremKeyboard(player) {
    const buttons = [];
    if (player.harem?.queens) {
        for (let queen of player.harem.queens) {
            buttons.push([{ text: `${queen.emoji} ${queen.name} - ${queen.rank}`, callback_data: `harem_queen_${queen.id}` }]);
        }
    }
    buttons.push([{ text: '🤰 بارداری جدید', callback_data: 'harem_pregnancy_new' }]);
    buttons.push([{ text: '💰 پرداخت حقوق', callback_data: 'harem_salary' }, { text: '💆 رسیدگی به همه', callback_data: 'harem_care_all' }]);
    buttons.push([{ text: '🎉 جشن', callback_data: 'harem_festival' }]);
    buttons.push([{ text: '🔙 برگشت', callback_data: 'empire_back' }]);
    return { reply_markup: { inline_keyboard: buttons } };
}

function getQueenKeyboard(player, queenId) {
    const queen = player.harem?.queens.find(q => q.id === queenId);
    if (!queen) return { reply_markup: { inline_keyboard: [[{ text: '🔙 برگشت', callback_data: 'harem_menu' }]] } };

    const buttons = [];
    
    // 🤰 بارداری - دکمه اصلی
    const preg = queen.pregnancies?.find(p => !p.born && Date.now() < p.dueDate);
    if (preg) {
        buttons.push([{ text: '⚡ تسریع بارداری', callback_data: 'queen_speed_pregnancy' }]);
    } else {
        buttons.push([{ text: '🤰 باردار شو', callback_data: 'queen_pregnancy' }]);
    }
    
    // 💆 رسیدگی
    buttons.push([{ text: '💆 رسیدگی (۵۰👑)', callback_data: 'queen_care' }]);
    
    // 👗 لباس و 💍 جواهر
    buttons.push([{ text: '👗 خرید لباس', callback_data: 'queen_dress' }, { text: '💍 خرید جواهر', callback_data: 'queen_jewelry' }]);
    
    // 🏠 اتاق و 🧹 خدمتکار
    buttons.push([{ text: '🏠 ارتقای اتاق', callback_data: 'queen_room' }, { text: '🧹 استخدام خدمتکار', callback_data: 'queen_servant' }]);
    
    // 📚 تربیت
    buttons.push([{ text: '📚 سبک تربیت', callback_data: 'queen_upbringing' }]);
    
    // 🔥 هم‌آغوشی
    buttons.push([{ text: '🔥 هم‌آغوشی', callback_data: 'queen_orgy' }]);
    
    // 📔 خاطرات
    buttons.push([{ text: '📔 خاطرات', callback_data: 'queen_diary' }]);
    
    // 🐍 دسیسه
    buttons.push([{ text: '🐍 دسیسه', callback_data: 'queen_intrigue' }]);
    
    // 🚪 اخراج
    buttons.push([{ text: '🚪 اخراج', callback_data: 'queen_remove' }]);
    
    // 🔙 برگشت
    buttons.push([{ text: '🔙 برگشت به حرمسرا', callback_data: 'harem_menu' }]);

    return { reply_markup: { inline_keyboard: buttons } };
}

function getPregnancySpeedKeyboard() {
    const buttons = [];
    for (let key in pregnancyTimes) {
        buttons.push([{ text: `⏰ ${pregnancyTimes[key].name}`, callback_data: `pregnancy_speed_${key}` }]);
    }
    buttons.push([{ text: '🔙 برگشت', callback_data: 'harem_menu' }]);
    return { reply_markup: { inline_keyboard: buttons } };
}

function getDressKeyboard() {
    const buttons = [];
    for (let key in dresses) {
        buttons.push([{ text: `${dresses[key].emoji} ${dresses[key].name} (${dresses[key].cost}👑)`, callback_data: `dress_buy_${key}` }]);
    }
    buttons.push([{ text: '🔙 برگشت', callback_data: 'harem_menu' }]);
    return { reply_markup: { inline_keyboard: buttons } };
}

function getJewelryKeyboard() {
    const buttons = [];
    for (let key in jewelry) {
        buttons.push([{ text: `${jewelry[key].emoji} ${jewelry[key].name} (${jewelry[key].cost}👑)`, callback_data: `jewelry_buy_${key}` }]);
    }
    buttons.push([{ text: '🔙 برگشت', callback_data: 'harem_menu' }]);
    return { reply_markup: { inline_keyboard: buttons } };
}

function getRoomKeyboard() {
    const buttons = [];
    for (let key in rooms) {
        if (rooms[key].cost > 0) {
            buttons.push([{ text: `${rooms[key].emoji} ${rooms[key].name} (${rooms[key].cost}👑)`, callback_data: `room_upgrade_${key}` }]);
        }
    }
    buttons.push([{ text: '🔙 برگشت', callback_data: 'harem_menu' }]);
    return { reply_markup: { inline_keyboard: buttons } };
}

function getServantKeyboard() {
    const buttons = [];
    for (let key in servants) {
        buttons.push([{ text: `${servants[key].emoji} ${servants[key].name} (${servants[key].salary}👑/ماه)`, callback_data: `servant_hire_${key}` }]);
    }
    buttons.push([{ text: '🔙 برگشت', callback_data: 'harem_menu' }]);
    return { reply_markup: { inline_keyboard: buttons } };
}

function getUpbringingKeyboard() {
    const upbringings = {
        military: { name: 'نظامی', emoji: '⚔️' },
        academic: { name: 'علمی', emoji: '📚' },
        religious: { name: 'مذهبی', emoji: '🙏' },
        merchant: { name: 'تجاری', emoji: '💰' },
        natural: { name: 'طبیعت', emoji: '🌿' }
    };
    const buttons = [];
    for (let key in upbringings) {
        buttons.push([{ text: `${upbringings[key].emoji} ${upbringings[key].name}`, callback_data: `upbringing_set_${key}` }]);
    }
    buttons.push([{ text: '🔙 برگشت', callback_data: 'harem_menu' }]);
    return { reply_markup: { inline_keyboard: buttons } };
}

function getIntrigueKeyboard() {
    const buttons = [
        [{ text: '🐍 شایعه‌پراکنی', callback_data: 'intrigue_rumor' }],
        [{ text: '🔒 کارشکنی', callback_data: 'intrigue_sabotage' }],
        [{ text: '💀 مسمومیت', callback_data: 'intrigue_poison' }],
        [{ text: '🔙 برگشت', callback_data: 'harem_menu' }]
    ];
    return { reply_markup: { inline_keyboard: buttons } };
}

function getCelebrationKeyboard() {
    const buttons = [
        [{ text: '👶 حموم بچه (۲۰۰👑)', callback_data: 'harem_festival_babyShower' }],
        [{ text: '🌸 جشن بهار (۵۰۰👑)', callback_data: 'harem_festival_springFestival' }],
        [{ text: '🔙 برگشت', callback_data: 'harem_menu' }]
    ];
    return { reply_markup: { inline_keyboard: buttons } };
}

module.exports = {
    haremRanks, rooms, servants, dresses, jewelry, pregnancyTimes,
    initHarem, addQueenToHarem, removeQueenFromHarem,
    startPregnancy, speedUpPregnancy, checkHaremBirths,
    queenCare, careAllQueens, paySalaries,
    buyDress, buyJewelry, upgradeRoom, hireServant,
    performIntrigue, setChildUpbringing, celebrateFestival,
    getRandomDiaryEntry,
    formatHarem, getHaremKeyboard, getQueenKeyboard,
    getPregnancySpeedKeyboard, getDressKeyboard, getJewelryKeyboard,
    getRoomKeyboard, getServantKeyboard, getUpbringingKeyboard,
    getIntrigueKeyboard, getCelebrationKeyboard
};