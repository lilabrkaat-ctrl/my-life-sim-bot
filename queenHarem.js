const config = require('./config');

// ============ عکس‌ها ============
const haremImages = {
    pregnant_queen: 'AgACAgQAAxkBAAEqcbZqKX_a4-_MtgzDxMBujjPA5ajaUQACLg9rG9N3UVHiWwABA5CaoVABAAMCAAN4AAM7BA',
    pregnant_woman: 'AgACAgQAAxkBAAEqcbtqKX_aM-MBVbXASWtHss-IvIHahQACMQ9rG9N3UVFZhM7A2L3PPAEAAwIAA3gAAzsE',
    pregnant_queen2: 'AgACAgQAAxkBAAEqcbhqKX_a3_hckqFHx6laLWuFHTKhHQACLw9rG9N3UVEx5s_CVaUYHQEAAwIAA3gAAzsE'
};

// ============ سلسله‌مراتب ============
const haremRanks = {
    queen_mother: { name: 'ملکه مادر', emoji: '👑👸', max: 1, salary: 300, food: 50, clothes: 3, roomBonus: 20, fertilityBonus: 15 },
    main_queen: { name: 'ملکه اصلی', emoji: '👸', max: 1, salary: 200, food: 40, clothes: 2, roomBonus: 15, fertilityBonus: 10 },
    favorite: { name: 'سوگلی', emoji: '💋', max: 2, salary: 100, food: 30, clothes: 1, roomBonus: 10, fertilityBonus: 5 },
    wife: { name: 'همسر', emoji: '👰', max: 3, salary: 50, food: 20, clothes: 0.5, roomBonus: 5, fertilityBonus: 2 },
    concubine: { name: 'کنیز', emoji: '🧹', max: 99, salary: 10, food: 10, clothes: 0.17, roomBonus: 0, fertilityBonus: 0 }
};

// ============ اتاق‌ها ============
const rooms = {
    shared: { name: 'اتاق مشترک', emoji: '🛏️', cost: 0, bonus: 0, minRank: 'concubine', description: 'زیرزمین - مخصوص کنیزها' },
    simple: { name: 'اتاق ساده', emoji: '🛏️', cost: 200, bonus: 5, minRank: 'concubine', description: 'همکف - ۱ تخت، ۱ کمد' },
    medium: { name: 'اتاق متوسط', emoji: '🛏️✨', cost: 500, bonus: 10, minRank: 'wife', description: 'طبقه ۱ - تخت بزرگ، آینه' },
    luxury: { name: 'اتاق لوکس', emoji: '🛏️💫', cost: 1000, bonus: 15, minRank: 'favorite', description: 'طبقه ۲ - بالکن، حمام شخصی' },
    royal: { name: 'سوئیت سلطنتی', emoji: '👑🛏️', cost: 5000, bonus: 25, minRank: 'main_queen', description: 'طبقه ۳ - منظره باغ، ۲ خدمتکار' }
};

// ============ خدمتکاران ============
const servants = {
    maid: { name: 'کلفت', emoji: '🧹', salary: 20, effect: 'نظافت اتاق', roomBonus: 2 },
    cook: { name: 'آشپز', emoji: '👩‍🍳', salary: 30, effect: 'غذای مخصوص', healthBonus: 5 },
    stylist: { name: 'آرایشگر', emoji: '💇', salary: 40, effect: 'آرایش روزانه', moodBonus: 10 },
    tailor: { name: 'خیاط', emoji: '👗', salary: 50, effect: 'لباس جدید', clothesBonus: 1 },
    guard: { name: 'محافظ', emoji: '🛡️', salary: 100, effect: 'محافظت شخصی', safetyBonus: 15 }
};

// ============ لباس‌ها ============
const dresses = {
    cotton: { name: 'کتان ساده', emoji: '👗', cost: 50, moodBonus: 5, durability: 30, description: 'ساده و ارزان' },
    silk: { name: 'ابریشم', emoji: '👗✨', cost: 200, moodBonus: 10, durability: 60, description: 'نرم و لطیف' },
    velvet: { name: 'مخمل', emoji: '👗💫', cost: 500, moodBonus: 15, durability: 90, description: 'لوکس و زیبا' },
    goldBrocade: { name: 'زربفت', emoji: '👗🌟', cost: 1000, moodBonus: 20, durability: 120, description: 'سلطنتی و باشکوه' },
    silkGauze: { name: 'حریر', emoji: '👗💎', cost: 2000, moodBonus: 30, fertilityBonus: 5, durability: 180, description: 'نفیس و کمیاب' }
};

// ============ جواهرات ============
const jewelry = {
    silver: { name: 'نقره', emoji: '💍', cost: 100, moodBonus: 5, description: 'ساده' },
    gold: { name: 'طلا', emoji: '💍✨', cost: 500, moodBonus: 10, description: 'با ارزش' },
    ruby: { name: 'یاقوت', emoji: '💍🔴', cost: 1000, moodBonus: 15, fertilityBonus: 5, description: 'شانس بارداری +۵٪' },
    diamond: { name: 'الماس', emoji: '💍💎', cost: 5000, moodBonus: 20, loyaltyBonus: 30, description: 'وفاداری +۳۰' },
    crown: { name: 'تاج', emoji: '👑', cost: 10000, moodBonus: 30, makesQueen: true, description: 'ملکه اصلی میشه' }
};

// ============ دسیسه‌ها ============
const intrigues = {
    stealDress: { name: 'دزدیدن لباس', emoji: '👗', successChance: 0.60, penalty: 'تنزل رتبه', cost: 0, effects: { targetMood: -15, myMood: 10 } },
    ruinMakeup: { name: 'خراب کردن لوازم آرایش', emoji: '💄', successChance: 0.70, penalty: 'جبران خسارت (۱۰۰👑)', cost: 0, effects: { targetMood: -10, myMood: 5 } },
    poisonFood: { name: 'مسمومیت غذا', emoji: '🍽️', successChance: 0.40, penalty: 'اعدام', cost: 0, effects: { targetHealth: -50, targetMood: -30 } },
    stealDiary: { name: 'دزدیدن دفتر خاطرات', emoji: '📔', successChance: 0.50, penalty: 'حبس در اتاق', cost: 0, effects: { targetMood: -20, myInfo: true } },
    bastardRumor: { name: 'شایعه بچه نامشروع', emoji: '👶', successChance: 0.30, penalty: 'تنزل به کنیز', cost: 0, effects: { targetReputation: -50, targetMood: -40 } },
    stealJewelry: { name: 'دزدی از جواهرات', emoji: '💰', successChance: 0.45, penalty: 'جریمه ۲ برابر', cost: 0, effects: { targetJewelry: -1, myGold: 200 } },
    lockDoor: { name: 'قفل کردن در اتاق', emoji: '🔒', successChance: 0.80, penalty: 'تنبیه سبک', cost: 0, effects: { targetCanVisit: false, duration: 1 } },
    spreadRumor: { name: 'پخش شایعه', emoji: '🗣️', successChance: 0.55, penalty: 'عذرخواهی اجباری', cost: 0, effects: { targetReputation: -20, targetMood: -15 } }
};

// ============ سبک‌های تربیت بچه ============
const childUpbringing = {
    military: { name: 'نظامی', emoji: '⚔️', effects: { attack: 20, loyalty: 10 }, description: 'قوی و وفادار' },
    academic: { name: 'علمی', emoji: '📚', effects: { intelligence: 20, class: 'sage' }, description: 'باهوش و دانا' },
    religious: { name: 'مذهبی', emoji: '🙏', effects: { faith: 20, class: 'priest' }, description: 'متدین و پرهیزگار' },
    merchant: { name: 'تجاری', emoji: '💰', effects: { goldBonus: 30, class: 'merchant' }, description: 'ثروتمند و تاجر' },
    artistic: { name: 'هنری', emoji: '🎭', effects: { mood: 20, class: 'artist' }, description: 'خوش‌ذوق و هنرمند' },
    natural: { name: 'طبیعت', emoji: '🌿', effects: { health: 20, class: 'hunter' }, description: 'سالم و شکارچی' }
};

// ============ جشن‌ها ============
const celebrations = {
    babyShower: { name: 'حموم بچه', emoji: '👶', cost: 200, effects: { motherMood: 20, babyHealth: 10 } },
    hennaNight: { name: 'شب حنا', emoji: '👰', cost: 300, effects: { brideMood: 30, allMood: 10 } },
    springFestival: { name: 'جشن بهار', emoji: '🌸', cost: 500, effects: { allMood: 15, fertility: 10 } },
    winterSolstice: { name: 'شب چله', emoji: '🕯️', cost: 1000, effects: { allMood: 25, allHealth: 10 } },
    anniversary: { name: 'سالگرد ازدواج', emoji: '💍', cost: 200, effects: { queenMood: 40, loyalty: 20 } }
};

// ============ زمان‌بندی بارداری ============
const pregnancyTimes = {
    normal: { hours: 72, diamondCost: 0, name: 'عادی (۷۲ ساعت)' },
    fast: { hours: 48, diamondCost: 5, name: 'سریع (۴۸ ساعت) - ۵💎' },
    faster: { hours: 24, diamondCost: 15, name: 'فوری (۲۴ ساعت) - ۱۵💎' },
    instant: { hours: 2, diamondCost: 50, name: 'لحظه‌ای (۲ ساعت) - ۵۰💎' },
    now: { hours: 0, diamondCost: 100, name: 'همین الان - ۱۰۰💎' }
};

// ============ توابع اصلی ============
function initHarem(player) {
    if (!player.harem) {
        player.harem = {
            queens: [],
            budget: 0,
            lastSalary: Date.now(),
            rumors: [],
            diaryEntries: []
        };
    }
    return player.harem;
}

function addQueenToHarem(player, npcId) {
    initHarem(player);
    
    const inHouse = player.house?.find(h => h.npcId === npcId);
    if (!inHouse) return { success: false, message: '❌ اول باید NPC رو دعوت کنی به خونه!' };
    
    if (player.harem.queens.find(q => q.npcId === npcId)) {
        return { success: false, message: '❌ این ملکه قبلاً توی حرمسراست!' };
    }
    
    const npcData = config.images.npcs?.[npcId] || config.images.enemies?.[npcId];
    const points = (player.prisonRelations && player.prisonRelations[npcId]) || 0;
    
    let rank = 'concubine';
    if (points >= 100) rank = 'main_queen';
    else if (points >= 70) rank = 'favorite';
    else if (points >= 40) rank = 'wife';
    
    const queen = {
        id: 'queen_' + Date.now(),
        npcId,
        name: npcData?.name || npcId,
        emoji: npcData?.emoji || '👤',
        rank,
        points,
        joinedAt: Date.now(),
        pregnancies: [],
        children: [],
        mood: 70,
        health: 100,
        reputation: 50,
        lastCare: Date.now(),
        isSpouse: player.marry === npcId,
        room: 'shared',
        servants: [],
        dress: null,
        jewelry: [],
        diary: [],
        upbringing: null,
        salary: 0,
        foodRation: 0
    };
    
    player.harem.queens.push(queen);
    
    const houseIndex = player.house.findIndex(h => h.npcId === npcId);
    if (houseIndex > -1) player.house.splice(houseIndex, 1);
    
    return {
        success: true,
        message: `${queen.emoji} *${queen.name}* وارد حرمسرا شد!\n👑 رتبه: ${haremRanks[rank].emoji} ${haremRanks[rank].name}`
    };
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

function startPregnancy(player, queenId, speedType) {
    initHarem(player);
    
    const queen = player.harem.queens.find(q => q.id === queenId);
    if (!queen) return { success: false, message: '❌ ملکه پیدا نشد!' };
    
    if (queen.pregnancies.find(p => !p.born && Date.now() < p.dueDate)) {
        return { success: false, message: '❌ این ملکه قبلاً بارداره!' };
    }
    
    if (player.children && player.children.filter(c => c.isAlive).length >= (player.childSlots || 3)) {
        return { success: false, message: '❌ ظرفیت فرزندان پره!' };
    }
    
    const speed = pregnancyTimes[speedType] || pregnancyTimes.normal;
    
    if (speed.diamondCost > 0 && (player.inventory?.diamond || 0) < speed.diamondCost) {
        return { success: false, message: `❌ الماس کافی نداری!\n💎 نیاز: ${speed.diamondCost}` };
    }
    
    if (speed.diamondCost > 0) player.inventory.diamond -= speed.diamondCost;
    
    const rankBonus = haremRanks[queen.rank]?.fertilityBonus || 0;
    const totalHours = Math.max(0, speed.hours - Math.floor(rankBonus / 2));
    
    const pregnancy = {
        id: 'preg_' + Date.now(),
        queenId,
        startedAt: Date.now(),
        dueDate: Date.now() + totalHours * 60 * 60 * 1000,
        speedType,
        diamondUsed: speed.diamondCost,
        born: false
    };
    
    queen.pregnancies.push(pregnancy);
    
    let msg = `🤰 ${queen.emoji} *${queen.name}* باردار شد!\n`;
    msg += `⏰ ${totalHours} ساعت تا تولد\n`;
    msg += `👑 رتبه: ${haremRanks[queen.rank]?.name} (${rankBonus}h تخفیف)\n`;
    if (speed.diamondCost > 0) msg += `💎 -${speed.diamondCost} الماس\n`;
    
    return { success: true, message: msg, pregnancy };
}

function speedUpPregnancy(player, queenId, pregnancyId, speedType) {
    initHarem(player);
    
    const queen = player.harem.queens.find(q => q.id === queenId);
    if (!queen) return { success: false, message: '❌ ملکه پیدا نشد!' };
    
    const pregnancy = queen.pregnancies.find(p => p.id === pregnancyId && !p.born);
    if (!pregnancy) return { success: false, message: '❌ بارداری فعال پیدا نشد!' };
    
    const speed = pregnancyTimes[speedType];
    if (!speed || speed.diamondCost === 0) return { success: false, message: '❌ نوع سرعت نامعتبر!' };
    
    if ((player.inventory?.diamond || 0) < speed.diamondCost) {
        return { success: false, message: `❌ الماس کافی نداری!\n💎 نیاز: ${speed.diamondCost}` };
    }
    
    player.inventory.diamond -= speed.diamondCost;
    
    const rankBonus = haremRanks[queen.rank]?.fertilityBonus || 0;
    const totalHours = Math.max(0, speed.hours - Math.floor(rankBonus / 2));
    const newDueDate = Date.now() + totalHours * 60 * 60 * 1000;
    
    pregnancy.dueDate = newDueDate;
    pregnancy.speedType = speedType;
    pregnancy.diamondUsed += speed.diamondCost;
    
    const remaining = Math.max(0, Math.ceil((newDueDate - Date.now()) / (60 * 60 * 1000)));
    return {
        success: true,
        message: `⚡ بارداری تسریع شد!\n⏰ ${remaining} ساعت تا تولد\n💎 -${speed.diamondCost} الماس`
    };
}

function checkHaremBirths(player) {
    initHarem(player);
    
    const now = Date.now();
    const births = [];
    
    for (let queen of player.harem.queens) {
        for (let pregnancy of queen.pregnancies) {
            if (!pregnancy.born && now >= pregnancy.dueDate) {
                pregnancy.born = true;
                
                const { getRandomName, getRandomGender, getRandomClass, childClasses } = require('./offspring');
                const gender = getRandomGender();
                const className = getRandomClass();
                const classData = childClasses[className];
                
                const fertilityBonus = haremRanks[queen.rank]?.fertilityBonus || 0;
                const legendaryChance = 0.02 + (fertilityBonus / 500);
                
                const child = {
                    id: 'child_' + Date.now() + '_' + Math.random().toString(36).substr(2, 5),
                    name: getRandomName(gender),
                    gender,
                    emoji: gender === 'male' ? '👦' : '👧',
                    class: className,
                    classEmoji: classData.emoji,
                    className: classData.name,
                    motherId: queen.npcId,
                    motherName: queen.name,
                    motherEmoji: queen.emoji,
                    isSpouse: queen.isSpouse,
                    bornAt: now,
                    age: 0,
                    ageStage: 'baby',
                    stageEmoji: '👶',
                    level: 1, evolutionLevel: 1, evolutionName: 'نوزاد',
                    xp: 0, xpNeeded: 20,
                    attack: Math.floor(Math.random() * 5) + 1 + Math.floor(fertilityBonus / 5),
                    defense: Math.floor(Math.random() * 3) + 1 + Math.floor(fertilityBonus / 7),
                    hp: Math.floor(Math.random() * 20) + 10 + fertilityBonus,
                    power: 5 + Math.floor(fertilityBonus / 3),
                    loyalty: 100,
                    isLegendary: Math.random() < legendaryChance,
                    isHeir: false,
                    isAlive: true,
                    upbringing: queen.upbringing || null,
                    missions: [], lastMission: 0,
                    skills: [],
                    inventory: { food: 0, toys: 0, books: 0 }
                };
                
                if (child.isLegendary) {
                    child.emoji = gender === 'male' ? '🌟👦' : '🌟👧';
                    child.power = 15; child.attack *= 3; child.defense *= 3; child.hp *= 3;
                }
                
                // اعمال سبک تربیت
                if (queen.upbringing) {
                    const upbringing = childUpbringing[queen.upbringing];
                    if (upbringing && upbringing.effects) {
                        if (upbringing.effects.attack) child.attack += upbringing.effects.attack;
                        if (upbringing.effects.loyalty) child.loyalty += upbringing.effects.loyalty;
                        if (upbringing.effects.health) child.hp += upbringing.effects.health;
                        if (upbringing.effects.class) {
                            child.class = upbringing.effects.class;
                            child.className = upbringing.name;
                            child.classEmoji = upbringing.emoji;
                        }
                    }
                }
                
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
    
    if ((player.inventory?.gold || 0) < 50) {
        return { success: false, message: '❌ طلا کافی نداری! (نیاز: ۵۰👑)' };
    }
    
    player.inventory.gold -= 50;
    queen.mood = Math.min(100, queen.mood + 20);
    queen.health = Math.min(100, queen.health + 10);
    queen.lastCare = Date.now();
    
    return {
        success: true,
        message: `💆 ${queen.emoji} *${queen.name}* رسیدگی شد!\n😊 روحیه: ${queen.mood}%\n❤️ سلامت: ${queen.health}%`
    };
}

function careAllQueens(player) {
    initHarem(player);
    
    if (player.harem.queens.length === 0) return { success: false, message: '❌ حرمسرا خالیه!' };
    
    const totalCost = player.harem.queens.length * 50;
    if ((player.inventory?.gold || 0) < totalCost) {
        return { success: false, message: `❌ طلا کافی نداری!\n👑 نیاز: ${totalCost}` };
    }
    
    player.inventory.gold -= totalCost;
    
    for (let queen of player.harem.queens) {
        queen.mood = Math.min(100, queen.mood + 20);
        queen.health = Math.min(100, queen.health + 10);
        queen.lastCare = Date.now();
    }
    
    return { success: true, message: `💆 همه ${player.harem.queens.length} ملکه رسیدگی شدن!\n😊 +۲۰ | ❤️ +۱۰` };
}

function paySalaries(player) {
    initHarem(player);
    
    const now = Date.now();
    const oneMonth = 30 * 24 * 60 * 60 * 1000;
    
    if (now - player.harem.lastSalary < oneMonth) {
        const remaining = Math.ceil((oneMonth - (now - player.harem.lastSalary)) / (24 * 60 * 60 * 1000));
        return { success: false, message: `⏰ ${remaining} روز تا پرداخت حقوق بعدی` };
    }
    
    let totalSalary = 0;
    for (let queen of player.harem.queens) {
        const rankData = haremRanks[queen.rank];
        if (rankData && rankData.salary) {
            totalSalary += rankData.salary;
            queen.salary = rankData.salary;
            queen.foodRation = rankData.food;
            queen.mood = Math.min(100, queen.mood + 5);
        }
        
        // حقوق خدمتکاران
        for (let servantId of queen.servants) {
            const servant = servants[servantId];
            if (servant) totalSalary += servant.salary;
        }
    }
    
    if ((player.inventory?.gold || 0) < totalSalary) {
        for (let queen of player.harem.queens) {
            queen.mood = Math.max(0, queen.mood - 20);
        }
        return { success: false, message: `❌ طلا کافی برای حقوق نداری!\n👑 نیاز: ${totalSalary}\n😡 روحیه همه ملکه‌ها -۲۰` };
    }
    
    player.inventory.gold -= totalSalary;
    player.harem.lastSalary = now;
    player.harem.budget = totalSalary;
    
    return { success: true, message: `💰 حقوق پرداخت شد!\n👑 مجموع: ${totalSalary} طلا\n👥 ${player.harem.queens.length} ملکه\n😊 روحیه همه +۵` };
}

function buyDress(player, queenId, dressType) {
    initHarem(player);
    
    const queen = player.harem.queens.find(q => q.id === queenId);
    if (!queen) return { success: false, message: '❌ ملکه پیدا نشد!' };
    
    const dress = dresses[dressType];
    if (!dress) return { success: false, message: '❌ لباس نامعتبر!' };
    
    if ((player.inventory?.gold || 0) < dress.cost) {
        return { success: false, message: `❌ طلا کافی نداری!\n👑 نیاز: ${dress.cost}` };
    }
    
    player.inventory.gold -= dress.cost;
    queen.dress = dressType;
    queen.mood = Math.min(100, queen.mood + dress.moodBonus);
    if (dress.fertilityBonus) queen.fertilityBonus = (queen.fertilityBonus || 0) + dress.fertilityBonus;
    
    return {
        success: true,
        message: `👗 ${dress.emoji} *${dress.name}* برای ${queen.emoji} ${queen.name} خریداری شد!\n😊 روحیه +${dress.moodBonus}\n👑 -${dress.cost} طلا`
    };
}

function buyJewelry(player, queenId, jewelryType) {
    initHarem(player);
    
    const queen = player.harem.queens.find(q => q.id === queenId);
    if (!queen) return { success: false, message: '❌ ملکه پیدا نشد!' };
    
    const jewel = jewelry[jewelryType];
    if (!jewel) return { success: false, message: '❌ جواهر نامعتبر!' };
    
    if ((player.inventory?.gold || 0) < jewel.cost) {
        return { success: false, message: `❌ طلا کافی نداری!\n👑 نیاز: ${jewel.cost}` };
    }
    
    player.inventory.gold -= jewel.cost;
    queen.jewelry.push(jewelryType);
    queen.mood = Math.min(100, queen.mood + jewel.moodBonus);
    
    if (jewel.makesQueen) {
        // تبدیل به ملکه اصلی
        for (let q of player.harem.queens) {
            if (q.rank === 'main_queen') q.rank = 'wife';
        }
        queen.rank = 'main_queen';
    }
    
    if (jewel.fertilityBonus) queen.fertilityBonus = (queen.fertilityBonus || 0) + jewel.fertilityBonus;
    if (jewel.loyaltyBonus) queen.loyalty = Math.min(100, (queen.loyalty || 50) + jewel.loyaltyBonus);
    
    return {
        success: true,
        message: `${jewel.emoji} *${jewel.name}* به ${queen.emoji} ${queen.name} هدیه داده شد!\n😊 روحیه +${jewel.moodBonus}\n👑 -${jewel.cost} طلا`
    };
}

function upgradeRoom(player, queenId, roomType) {
    initHarem(player);
    
    const queen = player.harem.queens.find(q => q.id === queenId);
    if (!queen) return { success: false, message: '❌ ملکه پیدا نشد!' };
    
    const room = rooms[roomType];
    if (!room) return { success: false, message: '❌ اتاق نامعتبر!' };
    
    // چک کردن رتبه
    const rankOrder = ['concubine', 'wife', 'favorite', 'main_queen', 'queen_mother'];
    const queenRankIndex = rankOrder.indexOf(queen.rank);
    const roomMinRankIndex = rankOrder.indexOf(room.minRank);
    
    if (queenRankIndex < roomMinRankIndex) {
        return { success: false, message: `❌ این اتاق مخصوص ${haremRanks[room.minRank]?.name} به بالاست!' }` };
    }
    
    if ((player.inventory?.gold || 0) < room.cost) {
        return { success: false, message: `❌ طلا کافی نداری!\n👑 نیاز: ${room.cost}` };
    }
    
    player.inventory.gold -= room.cost;
    queen.room = roomType;
    queen.mood = Math.min(100, queen.mood + room.bonus);
    
    return {
        success: true,
        message: `${room.emoji} *${room.name}* برای ${queen.emoji} ${queen.name} آماده شد!\n😊 روحیه +${room.bonus}\n👑 -${room.cost} طلا`
    };
}

function hireServant(player, queenId, servantType) {
    initHarem(player);
    
    const queen = player.harem.queens.find(q => q.id === queenId);
    if (!queen) return { success: false, message: '❌ ملکه پیدا نشد!' };
    
    const servant = servants[servantType];
    if (!servant) return { success: false, message: '❌ خدمتکار نامعتبر!' };
    
    if (queen.servants.includes(servantType)) {
        return { success: false, message: '❌ این خدمتکار قبلاً استخدام شده!' };
    }
    
    if (queen.servants.length >= 3) {
        return { success: false, message: '❌ حداکثر ۳ خدمتکار برای هر ملکه!' };
    }
    
    queen.servants.push(servantType);
    
    if (servant.moodBonus) queen.mood = Math.min(100, queen.mood + servant.moodBonus);
    if (servant.healthBonus) queen.health = Math.min(100, queen.health + servant.healthBonus);
    
    return {
        success: true,
        message: `${servant.emoji} *${servant.name}* برای ${queen.emoji} ${queen.name} استخدام شد!\n💰 حقوق ماهانه: ${servant.salary}👑\n📝 ${servant.effect}`
    };
}
function performIntrigue(player, performerQueenId, targetQueenId, intrigueType) {
    initHarem(player);
    
    const performer = player.harem.queens.find(q => q.id === performerQueenId);
    const target = player.harem.queens.find(q => q.id === targetQueenId);
    
    if (!performer || !target) return { success: false, message: '❌ ملکه پیدا نشد!' };
    if (performer.id === target.id) return { success: false, message: '❌ نمی‌تونه علیه خودش دسیسه کنه!' };
    
    const intrigue = intrigues[intrigueType];
    if (!intrigue) return { success: false, message: '❌ دسیسه نامعتبر!' };
    
    if (Math.random() < intrigue.successChance) {
        // موفقیت
        let msg = `${intrigue.emoji} *${intrigue.name}* موفق!\n${performer.emoji} ${performer.name} علیه ${target.emoji} ${target.name}\n\n`;
        
        if (intrigue.effects.targetMood) { target.mood = Math.max(0, target.mood + intrigue.effects.targetMood); msg += `😢 روحیه ${target.name}: ${intrigue.effects.targetMood}\n`; }
        if (intrigue.effects.targetHealth) { target.health = Math.max(0, target.health + intrigue.effects.targetHealth); msg += `🤒 سلامت ${target.name}: ${intrigue.effects.targetHealth}\n`; }
        if (intrigue.effects.targetReputation) { target.reputation = Math.max(0, target.reputation + intrigue.effects.targetReputation); msg += `📉 اعتبار ${target.name}: ${intrigue.effects.targetReputation}\n`; }
        if (intrigue.effects.myMood) { performer.mood = Math.min(100, performer.mood + intrigue.effects.myMood); msg += `😊 روحیه ${performer.name}: +${intrigue.effects.myMood}\n`; }
        if (intrigue.effects.myGold) { player.inventory.gold = (player.inventory.gold || 0) + intrigue.effects.myGold; msg += `💰 +${intrigue.effects.myGold} طلا\n`; }
        if (intrigue.effects.targetJewelry && target.jewelry.length > 0) { target.jewelry.pop(); msg += `💍 جواهر ${target.name} دزدیده شد!\n`; }
        
        return { success: true, caught: false, message: msg };
    } else {
        // لو رفتن
        performer.mood = Math.max(0, performer.mood - 30);
        performer.reputation = Math.max(0, performer.reputation - 20);
        
        let penaltyMsg = `🚨 *لو رفت!*\n${performer.emoji} ${performer.name} لو رفت!\n\n📝 مجازات: ${intrigue.penalty}\n😢 روحیه -۳۰\n📉 اعتبار -۲۰`;
        
        if (intrigue.penalty.includes('اعدام')) {
            const index = player.harem.queens.findIndex(q => q.id === performerQueenId);
            if (index > -1) player.harem.queens.splice(index, 1);
            penaltyMsg += '\n💀 ملکه اعدام شد!';
        } else if (intrigue.penalty.includes('تنزل')) {
            performer.rank = 'concubine';
            performer.room = 'shared';
            penaltyMsg += '\n📉 تنزل به کنیز!';
        } else if (intrigue.penalty.includes('جریمه')) {
            const fine = 200;
            player.inventory.gold = Math.max(0, (player.inventory.gold || 0) - fine);
            penaltyMsg += `\n💰 جریمه ${fine}👑`;
        } else if (intrigue.penalty.includes('حبس')) {
            performer.mood = Math.max(0, performer.mood - 20);
            penaltyMsg += '\n🔒 حبس در اتاق';
        }
        
        return { success: false, caught: true, message: penaltyMsg };
    }
}

function setChildUpbringing(player, queenId, upbringingType) {
    initHarem(player);
    
    const queen = player.harem.queens.find(q => q.id === queenId);
    if (!queen) return { success: false, message: '❌ ملکه پیدا نشد!' };
    
    const upbringing = childUpbringing[upbringingType];
    if (!upbringing) return { success: false, message: '❌ سبک تربیت نامعتبر!' };
    
    queen.upbringing = upbringingType;
    
    // اعمال روی بچه‌های موجود
    for (let childId of queen.children) {
        const child = player.children?.find(c => c.id === childId && c.isAlive);
        if (child) {
            if (upbringing.effects.attack) child.attack += upbringing.effects.attack;
            if (upbringing.effects.loyalty) child.loyalty += upbringing.effects.loyalty;
            if (upbringing.effects.health) child.hp += upbringing.effects.health;
            if (upbringing.effects.class) {
                child.class = upbringing.effects.class;
                child.className = upbringing.name;
                child.classEmoji = upbringing.emoji;
            }
        }
    }
    
    return {
        success: true,
        message: `${upbringing.emoji} *${upbringing.name}*: سبک تربیت بچه‌های ${queen.emoji} ${queen.name} تعیین شد!\n📝 ${upbringing.description}`
    };
}

function celebrateFestival(player, celebrationType) {
    initHarem(player);
    
    const celebration = celebrations[celebrationType];
    if (!celebration) return { success: false, message: '❌ جشن نامعتبر!' };
    
    if ((player.inventory?.gold || 0) < celebration.cost) {
        return { success: false, message: `❌ طلا کافی نداری!\n👑 نیاز: ${celebration.cost}` };
    }
    
    player.inventory.gold -= celebration.cost;
    
    let msg = `${celebration.emoji} *${celebration.name}* برگزار شد!\n\n`;
    
    for (let queen of player.harem.queens) {
        if (celebration.effects.allMood) {
            queen.mood = Math.min(100, queen.mood + celebration.effects.allMood);
        }
        if (celebration.effects.allHealth) {
            queen.health = Math.min(100, queen.health + celebration.effects.allHealth);
        }
    }
    
    if (celebration.effects.allMood) msg += `😊 روحیه همه +${celebration.effects.allMood}\n`;
    if (celebration.effects.allHealth) msg += `❤️ سلامت همه +${celebration.effects.allHealth}\n`;
    if (celebration.effects.fertility) msg += `🤰 شانس بارداری +${celebration.effects.fertility}٪\n`;
    msg += `\n👑 -${celebration.cost} طلا`;
    
    return { success: true, message: msg };
}

function addDiaryEntry(player, queenId, entry) {
    initHarem(player);
    
    const queen = player.harem.queens.find(q => q.id === queenId);
    if (!queen) return { success: false, message: '❌ ملکه پیدا نشد!' };
    
    queen.diary.push({
        date: Date.now(),
        entry: entry
    });
    
    return { success: true, message: '📔 یادداشت اضافه شد.' };
}

function getRandomDiaryEntry(player) {
    initHarem(player);
    
    if (player.harem.queens.length === 0) return null;
    
    const queen = player.harem.queens[Math.floor(Math.random() * player.harem.queens.length)];
    
    const entries = [
        "امروز پادشاه بهم سر زد... 😊",
        "۳ روزه نیومده پیشم... 😢",
        "فلانی رو بیشتر از من دوست داره... 😡",
        "امشب نقشه دارم... 🤫",
        "دیشب فوق‌العاده بود... 💕",
        "بچه‌م امروز اولین قدمش رو برداشت... 👶",
        "دلم می‌خواد یه لباس جدید داشته باشم... 👗",
        "چرا به من توجه نمی‌کنه؟ 💔",
        "فلانی رو از چشمم می‌ندازم... 🐍",
        "امروز حالم خوب نیست... 🤒"
    ];
    
    const entry = entries[Math.floor(Math.random() * entries.length)];
    queen.diary.push({ date: Date.now(), entry });
    
    return { queen, entry };
}

function getRandomRumor(player) {
    initHarem(player);
    
    if (player.harem.queens.length < 2) return null;
    
    const rumors = [
        "شنیدم ملکه جدید اصلاً نجیب نیست...",
        "می‌گن پادشاه دیشب با کی بوده...",
        "فلانی بچه‌اش شبیه پادشاه نیست!",
        "می‌خوان فلانی رو مسموم کنن...",
        "فلانی دیشب با نگهبان حرف می‌زد...",
        "می‌گن ملکه اصلی جواهراش رو گم کرده...",
        "فلانی داره نقشه می‌کشه...",
        "شنیدم یکی از کنیزا حامله‌ست!"
    ];
    
    const rumor = rumors[Math.floor(Math.random() * rumors.length)];
    player.harem.rumors.push({ date: Date.now(), rumor });
    
    return rumor;
}
function formatHarem(player) {
    initHarem(player);
    
    if (player.harem.queens.length === 0) {
        return '👸 *حرمسرای امپراطوری*\n\n❌ هیچ ملکه‌ای توی حرمسرا نیست!\n💡 اول با addhouse NPC رو ببر خونه، بعد با addqueen بیارش حرمسرا.';
    }
    
    let msg = '👸 *حرمسرای امپراطوری*\n\n';
    msg += `💰 بودجه ماهانه: ${player.harem.budget || 0}👑\n`;
    msg += `👥 ملکه‌ها: ${player.harem.queens.length} نفر\n\n`;
    
    for (let i = 0; i < player.harem.queens.length; i++) {
        const queen = player.harem.queens[i];
        const rankData = haremRanks[queen.rank];
        const roomData = rooms[queen.room];
        const dressData = queen.dress ? dresses[queen.dress] : null;
        const upbringingData = queen.upbringing ? childUpbringing[queen.upbringing] : null;
        
        msg += `${i+1}. ${queen.emoji} *${queen.name}*\n`;
        msg += `   ${rankData?.emoji || ''} ${rankData?.name || 'کنیز'} | `;
        msg += `${roomData?.emoji || '🛏️'} ${roomData?.name || 'اتاق مشترک'}\n`;
        msg += `   💕 رابطه: ${queen.points} | 😊 روحیه: ${queen.mood}% | ❤️ سلامت: ${queen.health}%\n`;
        msg += `   📊 اعتبار: ${queen.reputation}\n`;
        
        if (dressData) msg += `   👗 لباس: ${dressData.emoji} ${dressData.name}\n`;
        if (queen.jewelry.length > 0) msg += `   💍 جواهرات: ${queen.jewelry.length} عدد\n`;
        if (queen.servants.length > 0) msg += `   🧹 خدمتکاران: ${queen.servants.length} نفر\n`;
        
        const activePregnancy = queen.pregnancies.find(p => !p.born && Date.now() < p.dueDate);
        if (activePregnancy) {
            const remaining = Math.max(0, Math.ceil((activePregnancy.dueDate - Date.now()) / (60 * 60 * 1000)));
            msg += `   🤰 باردار: ${remaining} ساعت مونده\n`;
        }
        
        const bornChildren = queen.pregnancies.filter(p => p.born).length;
        if (bornChildren > 0) msg += `   👶 فرزندان: ${bornChildren} نفر\n`;
        
        if (upbringingData) msg += `   📚 تربیت: ${upbringingData.emoji} ${upbringingData.name}\n`;
        
        msg += '\n';
    }
    
    msg += `💎 الماس: ${player.inventory?.diamond || 0}\n`;
    msg += `👑 طلا: ${player.inventory?.gold || 0}`;
    
    return msg;
}

function getHaremKeyboard(player) {
    const buttons = [];
    
    if (player.harem && player.harem.queens) {
        for (let queen of player.harem.queens) {
            buttons.push([`👸 ${queen.emoji} ${queen.name}`]);
        }
    }
    
    buttons.push(['🤰 بارداری جدید']);
    buttons.push(['💰 پرداخت حقوق']);
    buttons.push(['💆 رسیدگی به همه']);
    buttons.push(['🎉 برگزاری جشن']);
    buttons.push(['👗 خرید لباس و جواهر']);
    buttons.push(['🏠 ارتقای اتاق']);
    buttons.push(['🧹 استخدام خدمتکار']);
    buttons.push(['🐍 دسیسه‌های درباری']);
    buttons.push(['📔 دفتر خاطرات']);
    buttons.push(['🔙 برگشت']);
    
    return { reply_markup: { keyboard: buttons, resize_keyboard: true } };
}

function getQueenKeyboard(player, queenId) {
    const queen = player.harem?.queens.find(q => q.id === queenId);
    if (!queen) return null;
    
    const buttons = [];
    
    const activePregnancy = queen.pregnancies.find(p => !p.born && Date.now() < p.dueDate);
    if (activePregnancy) {
        buttons.push([`⚡ تسریع بارداری`]);
    } else {
        buttons.push(['🤰 باردار شو']);
    }
    
    buttons.push(['💆 رسیدگی (۵۰👑)']);
    buttons.push(['🔥 عیاشی']);
    buttons.push(['👗 خرید لباس']);
    buttons.push(['💍 خرید جواهر']);
    buttons.push(['🏠 ارتقای اتاق']);
    buttons.push(['🧹 استخدام خدمتکار']);
    buttons.push(['📚 سبک تربیت بچه']);
    buttons.push(['📔 دفتر خاطرات']);
    buttons.push(['🚪 اخراج از حرمسرا']);
    buttons.push(['🔙 برگشت']);
    
    return { reply_markup: { keyboard: buttons, resize_keyboard: true } };
}

function getPregnancySpeedKeyboard() {
    const buttons = [];
    for (let key in pregnancyTimes) {
        buttons.push([`⏰ ${pregnancyTimes[key].name}`]);
    }
    buttons.push(['🔙 برگشت']);
    return { reply_markup: { keyboard: buttons, resize_keyboard: true } };
}

function getDressKeyboard() {
    const buttons = [];
    for (let key in dresses) {
        buttons.push([`👗 ${dresses[key].emoji} ${dresses[key].name} (${dresses[key].cost}👑)`]);
    }
    buttons.push(['🔙 برگشت']);
    return { reply_markup: { keyboard: buttons, resize_keyboard: true } };
}

function getJewelryKeyboard() {
    const buttons = [];
    for (let key in jewelry) {
        buttons.push([`💍 ${jewelry[key].emoji} ${jewelry[key].name} (${jewelry[key].cost}👑)`]);
    }
    buttons.push(['🔙 برگشت']);
    return { reply_markup: { keyboard: buttons, resize_keyboard: true } };
}

function getRoomKeyboard() {
    const buttons = [];
    for (let key in rooms) {
        if (rooms[key].cost > 0) {
            buttons.push([`🏠 ${rooms[key].emoji} ${rooms[key].name} (${rooms[key].cost}👑)`]);
        }
    }
    buttons.push(['🔙 برگشت']);
    return { reply_markup: { keyboard: buttons, resize_keyboard: true } };
}

function getServantKeyboard() {
    const buttons = [];
    for (let key in servants) {
        buttons.push([`🧹 ${servants[key].emoji} ${servants[key].name} (${servants[key].salary}👑/ماه)`]);
    }
    buttons.push(['🔙 برگشت']);
    return { reply_markup: { keyboard: buttons, resize_keyboard: true } };
}

function getUpbringingKeyboard() {
    const buttons = [];
    for (let key in childUpbringing) {
        buttons.push([`📚 ${childUpbringing[key].emoji} ${childUpbringing[key].name}`]);
    }
    buttons.push(['🔙 برگشت']);
    return { reply_markup: { keyboard: buttons, resize_keyboard: true } };
}

function getCelebrationKeyboard() {
    const buttons = [];
    for (let key in celebrations) {
        buttons.push([`🎉 ${celebrations[key].emoji} ${celebrations[key].name} (${celebrations[key].cost}👑)`]);
    }
    buttons.push(['🔙 برگشت']);
    return { reply_markup: { keyboard: buttons, resize_keyboard: true } };
}

function getIntrigueKeyboard() {
    const buttons = [];
    for (let key in intrigues) {
        buttons.push([`🐍 ${intrigues[key].emoji} ${intrigues[key].name}`]);
    }
    buttons.push(['🔙 برگشت']);
    return { reply_markup: { keyboard: buttons, resize_keyboard: true } };
}

function getPregnancyImage() {
    const images = [haremImages.pregnant_queen, haremImages.pregnant_queen2, haremImages.pregnant_woman];
    return images[Math.floor(Math.random() * images.length)];
}

module.exports = {
    haremRanks, rooms, servants, dresses, jewelry, intrigues, childUpbringing, celebrations, pregnancyTimes, haremImages,
    initHarem, addQueenToHarem, removeQueenFromHarem,
    startPregnancy, speedUpPregnancy, checkHaremBirths,
    queenCare, careAllQueens, paySalaries,
    buyDress, buyJewelry, upgradeRoom, hireServant,
    performIntrigue, setChildUpbringing, celebrateFestival,
    addDiaryEntry, getRandomDiaryEntry, getRandomRumor,
    formatHarem, getHaremKeyboard, getQueenKeyboard,
    getPregnancySpeedKeyboard, getDressKeyboard, getJewelryKeyboard,
    getRoomKeyboard, getServantKeyboard, getUpbringingKeyboard,
    getCelebrationKeyboard, getIntrigueKeyboard,
    getPregnancyImage
};