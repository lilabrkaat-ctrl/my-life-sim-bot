const config = require('./config');

// ساختار جمعیتی
const populationTypes = {
    royal: { name: 'خاندان سلطنتی', emoji: '👑', baseCount: 5, growthRate: 0.02, taxRate: 0, produces: 'prestige', consumePerDay: { food: 5, gold: 10 } },
    nobles: { name: 'اشراف', emoji: '⚔️', baseCount: 20, growthRate: 0.05, taxRate: 0.30, produces: 'military', consumePerDay: { food: 3, gold: 5 } },
    clergy: { name: 'روحانیون', emoji: '🧙', baseCount: 10, growthRate: 0.02, taxRate: 0, produces: 'magic', consumePerDay: { food: 2, gold: 3 } },
    artisans: { name: 'صنعتگران', emoji: '⚒️', baseCount: 50, growthRate: 0.08, taxRate: 0.20, produces: 'goods', consumePerDay: { food: 2, gold: 0 } },
    farmers: { name: 'کشاورزان', emoji: '🌾', baseCount: 200, growthRate: 0.10, taxRate: 0.15, produces: 'food', consumePerDay: { food: 1, water: 1 } },
    workers: { name: 'کارگران', emoji: '💪', baseCount: 100, growthRate: 0.07, taxRate: 0.10, produces: 'labor', consumePerDay: { food: 2, water: 1 } },
    slaves: { name: 'بردگان', emoji: '🪙', baseCount: 30, growthRate: 0, taxRate: 0, produces: 'labor', consumePerDay: { food: 1, water: 0.5 } }
};

// زمین‌های کشاورزی
const landTypes = {
    wheat: { name: 'گندم‌زار', emoji: '🌾', cost: 50, waterNeeded: 20, workersNeeded: 10, production: { food: 100 }, cycleDays: 3, goldValue: 30 },
    vineyard: { name: 'تاکستان', emoji: '🍇', cost: 80, waterNeeded: 15, workersNeeded: 8, production: { wine: 50, food: 20 }, cycleDays: 5, goldValue: 50 },
    olive: { name: 'زیتون‌زار', emoji: '🫒', cost: 60, waterNeeded: 10, workersNeeded: 6, production: { food: 60, gold: 20 }, cycleDays: 4, goldValue: 40 },
    pasture: { name: 'مرتع', emoji: '🌿', cost: 40, waterNeeded: 5, workersNeeded: 5, production: { meat: 30, skin: 15 }, cycleDays: 2, goldValue: 25 },
    forest: { name: 'جنگل', emoji: '🪵', cost: 30, waterNeeded: 0, workersNeeded: 3, production: { wood: 60 }, cycleDays: 3, goldValue: 20 },
    mine: { name: 'معدن', emoji: '⛏️', cost: 100, waterNeeded: 0, workersNeeded: 15, production: { stone: 40, iron: 20 }, cycleDays: 4, goldValue: 60 }
};

// ساختمان‌های عمومی
const buildings = {
    hospital: { name: 'درمانگاه', emoji: '🏥', cost: { wood: 100, stone: 50, gold: 30 }, effect: { disease: -30 }, workersNeeded: 5, description: '-۳۰٪ بیماری' },
    school: { name: 'مدرسه', emoji: '📚', cost: { wood: 80, gold: 20 }, effect: { xp: 20 }, workersNeeded: 3, description: '+۲۰٪ XP فرزندان' },
    square: { name: 'میدان شهر', emoji: '🏟️', cost: { stone: 50, gold: 30 }, effect: { happiness: 10 }, workersNeeded: 2, description: '+۱۰ خوشبختی' },
    fountain: { name: 'آبنما', emoji: '⛲', cost: { stone: 30, water: 10 }, effect: { happiness: 5 }, workersNeeded: 1, description: '+۵ خوشبختی' },
    bath: { name: 'حمام عمومی', emoji: '🛁', cost: { stone: 40, wood: 20 }, effect: { disease: -20 }, workersNeeded: 3, description: '-۲۰٪ بیماری' },
    theater: { name: 'تئاتر', emoji: '🎭', cost: { wood: 60, gold: 40 }, effect: { happiness: 15 }, workersNeeded: 4, description: '+۱۵ خوشبختی' },
    court: { name: 'دادگاه', emoji: '🏛️', cost: { stone: 100, gold: 50 }, effect: { justice: 20 }, workersNeeded: 5, description: '+۲۰ عدالت' },
    temple: { name: 'معبد', emoji: '⛪', cost: { stone: 80, gold: 30 }, effect: { faith: 20 }, workersNeeded: 4, description: '+۲۰ ایمان' },
    granary: { name: 'انبار غله', emoji: '🏚️', cost: { wood: 60, stone: 30 }, effect: { storage: 500 }, workersNeeded: 2, description: '+۵۰۰ ذخیره غذا' },
    barracks: { name: 'پادگان', emoji: '⚔️', cost: { stone: 80, iron: 20 }, effect: { military: 15 }, workersNeeded: 10, description: '+۱۵ قدرت نظامی' }
};

function initPeople(player) {
    if (!player.people) {
        player.people = {
            population: {},
            lands: [],
            buildings: [],
            stats: {
                happiness: 60,
                hunger: 70,
                safety: 50,
                justice: 50,
                faith: 50
            },
            storage: {
                food: 100,
                water: 50
            },
            lastUpdate: Date.now(),
            events: []
        };
        
        // مقداردهی اولیه جمعیت
        for (let type in populationTypes) {
            player.people.population[type] = {
                count: populationTypes[type].baseCount,
                employed: 0,
                sick: 0,
                unhappy: 0
            };
        }
    }
    
    return player.people;
}

function getTotalPopulation(player) {
    initPeople(player);
    
    let total = 0;
    for (let type in player.people.population) {
        total += player.people.population[type].count;
    }
    return total;
}

function getAvailableWorkers(player) {
    initPeople(player);
    
    let available = 0;
    for (let type in player.people.population) {
        const pop = player.people.population[type];
        available += pop.count - pop.employed - pop.sick;
    }
    return Math.max(0, available);
}

function getPopulationStats(player) {
    initPeople(player);
    
    const total = getTotalPopulation(player);
    const available = getAvailableWorkers(player);
    const sick = Object.values(player.people.population).reduce((sum, p) => sum + p.sick, 0);
    const unhappy = Object.values(player.people.population).reduce((sum, p) => sum + p.unhappy, 0);
    
    return {
        total,
        available,
        sick,
        unhappy,
        happiness: player.people.stats.happiness,
        hunger: player.people.stats.hunger,
        safety: player.people.stats.safety,
        justice: player.people.stats.justice,
        faith: player.people.stats.faith
    };
}

function updatePopulation(player) {
    initPeople(player);
    
    const now = Date.now();
    const oneDay = 24 * 60 * 60 * 1000;
    
    // فقط هر ۲۴ ساعت آپدیت میشه
    if (now - player.people.lastUpdate < oneDay) return [];
    
    const events = [];
    
    // رشد جمعیت
    for (let type in player.people.population) {
        const popData = populationTypes[type];
        const pop = player.people.population[type];
        
        if (popData.growthRate > 0) {
            const growth = Math.floor(pop.count * popData.growthRate);
            if (growth > 0) {
                pop.count += growth;
                events.push(`👥 +${growth} ${popData.emoji} ${popData.name}`);
            }
        }
    }
    
    // مصرف غذا
    let foodConsumed = 0;
    for (let type in player.people.population) {
        const popData = populationTypes[type];
        const pop = player.people.population[type];
        foodConsumed += pop.count * popData.consumePerDay.food;
    }
    
    player.people.storage.food -= foodConsumed;
    if (player.people.storage.food < 0) {
        player.people.storage.food = 0;
        player.people.stats.hunger = Math.max(0, player.people.stats.hunger - 20);
        events.push('⚠️ قحطی! غذا تموم شد!');
    }
    
    // بیماری
    const diseaseRate = 0.05 - (player.people.stats.hunger < 50 ? 0.03 : 0);
    for (let type in player.people.population) {
        const pop = player.people.population[type];
        const newSick = Math.floor(pop.count * diseaseRate);
        pop.sick += newSick;
        pop.count -= Math.floor(newSick * 0.1); // مرگ بر اثر بیماری
    }
    
    // بهبودی
    for (let type in player.people.population) {
        const pop = player.people.population[type];
        const recovered = Math.floor(pop.sick * 0.3);
        pop.sick = Math.max(0, pop.sick - recovered);
        pop.count += recovered;
    }
    
    // اثر ساختمان‌ها روی شاخص‌ها
    for (let buildingKey of player.people.buildings) {
        const building = buildings[buildingKey];
        if (building && building.effect) {
            if (building.effect.happiness) player.people.stats.happiness = Math.min(100, player.people.stats.happiness + building.effect.happiness);
            if (building.effect.disease) {
                for (let type in player.people.population) {
                    const pop = player.people.population[type];
                    const healed = Math.floor(pop.sick * Math.abs(building.effect.disease) / 100);
                    pop.sick = Math.max(0, pop.sick - healed);
                }
            }
            if (building.effect.justice) player.people.stats.justice = Math.min(100, player.people.stats.justice + building.effect.justice);
            if (building.effect.faith) player.people.stats.faith = Math.min(100, player.people.stats.faith + building.effect.faith);
        }
    }
    
    player.people.lastUpdate = now;
    
    return events;
}
function assignLand(player, landType, count) {
    initPeople(player);
    
    const land = landTypes[landType];
    if (!land) return { success: false, message: '❌ نوع زمین نامعتبر!' };
    
    if ((player.inventory?.gold || 0) < land.cost * count) {
        return { success: false, message: `❌ طلا کافی نداری!\n💰 نیاز: ${land.cost * count}👑` };
    }
    
    if (getAvailableWorkers(player) < land.workersNeeded * count) {
        return { success: false, message: `❌ کارگر کافی نداری!\n👥 نیاز: ${land.workersNeeded * count}\n👥 موجود: ${getAvailableWorkers(player)}` };
    }
    
    player.inventory.gold -= land.cost * count;
    
    const newLand = {
        id: 'land_' + Date.now(),
        type: landType,
        count,
        plantedAt: Date.now(),
        harvestAt: Date.now() + land.cycleDays * 24 * 60 * 60 * 1000,
        workers: land.workersNeeded * count,
        waterUsed: 0
    };
    
    player.people.lands.push(newLand);
    
    // استخدام کارگر
    let workersToAssign = land.workersNeeded * count;
    for (let type in player.people.population) {
        const pop = player.people.population[type];
        const available = pop.count - pop.employed - pop.sick;
        if (available > 0 && workersToAssign > 0) {
            const assigned = Math.min(available, workersToAssign);
            pop.employed += assigned;
            workersToAssign -= assigned;
        }
    }
    
    return {
        success: true,
        message: `🌾 ${land.emoji} *${land.name}* ایجاد شد!\n📐 ${count} هکتار\n👥 ${land.workersNeeded * count} کارگر\n💧 نیاز آب: ${land.waterNeeded * count}\n⏰ ${land.cycleDays} روز تا برداشت`
    };
}

function waterLand(player, landId) {
    initPeople(player);
    
    const land = player.people.lands.find(l => l.id === landId);
    if (!land) return { success: false, message: '❌ زمین پیدا نشد!' };
    
    const landData = landTypes[land.type];
    const waterNeeded = landData.waterNeeded * land.count - land.waterUsed;
    
    if (waterNeeded <= 0) return { success: false, message: '✅ این زمین کاملاً آبیاری شده!' };
    
    if ((player.inventory?.water || 0) < waterNeeded) {
        return { success: false, message: `❌ آب کافی نداری!\n💧 نیاز: ${waterNeeded}\n💧 داری: ${player.inventory?.water || 0}` };
    }
    
    player.inventory.water -= waterNeeded;
    land.waterUsed += waterNeeded;
    
    return {
        success: true,
        message: `💧 زمین آبیاری شد!\n💧 -${waterNeeded} آب\n🌾 برداشت بهتر (+۲۰٪ محصول)`
    };
}

function harvestLand(player, landId) {
    initPeople(player);
    
    const landIndex = player.people.lands.findIndex(l => l.id === landId);
    if (landIndex === -1) return { success: false, message: '❌ زمین پیدا نشد!' };
    
    const land = player.people.lands[landIndex];
    const landData = landTypes[land.type];
    
    const now = Date.now();
    if (now < land.harvestAt) {
        const remaining = Math.ceil((land.harvestAt - now) / (24 * 60 * 60 * 1000));
        return { success: false, message: `⏰ ${remaining} روز دیگه تا برداشت` };
    }
    
    // برداشت محصول
    const waterBonus = land.waterUsed >= landData.waterNeeded * land.count ? 1.2 : 0.8;
    const harvested = {};
    
    for (let item in landData.production) {
        const amount = Math.floor(landData.production[item] * land.count * waterBonus);
        player.inventory[item] = (player.inventory[item] || 0) + amount;
        harvested[item] = amount;
    }
    
    // آزاد کردن کارگرها
    for (let type in player.people.population) {
        player.people.population[type].employed = Math.max(0, player.people.population[type].employed - land.workers);
    }
    
    // حذف زمین
    player.people.lands.splice(landIndex, 1);
    
    let message = `🌾 *برداشت محصول!*\n\n`;
    for (let item in harvested) {
        const emoji = config.images?.resources?.[item]?.emoji || '';
        message += `${emoji} ${item}: +${harvested[item]}\n`;
    }
    
    return { success: true, message };
}

function harvestAllLands(player) {
    initPeople(player);
    
    const now = Date.now();
    const readyLands = player.people.lands.filter(l => now >= l.harvestAt);
    
    if (readyLands.length === 0) {
        return { success: false, message: '❌ هیچ زمینی آماده برداشت نیست!' };
    }
    
    let totalHarvested = {};
    let message = '🌾 *برداشت همه زمین‌ها*\n\n';
    
    for (let land of readyLands) {
        const result = harvestLand(player, land.id);
        if (result.success) {
            message += result.message + '\n';
        }
    }
    
    return { success: true, message };
}
function buildPublicBuilding(player, buildingKey) {
    initPeople(player);
    
    const building = buildings[buildingKey];
    if (!building) return { success: false, message: '❌ ساختمان نامعتبر!' };
    
    if (player.people.buildings.includes(buildingKey)) {
        return { success: false, message: '❌ این ساختمان قبلاً ساخته شده!' };
    }
    
    // چک کردن مواد
    for (let item in building.cost) {
        if ((player.inventory[item] || 0) < building.cost[item]) {
            return { success: false, message: `❌ ${item} کافی نداری!\nنیاز: ${building.cost[item]}` };
        }
    }
    
    // چک کردن کارگر
    if (getAvailableWorkers(player) < building.workersNeeded) {
        return { success: false, message: `❌ کارگر کافی نداری!\n👥 نیاز: ${building.workersNeeded}` };
    }
    
    // مصرف مواد
    for (let item in building.cost) {
        player.inventory[item] -= building.cost[item];
    }
    
    player.people.buildings.push(buildingKey);
    
    // استخدام کارگر
    let workersToAssign = building.workersNeeded;
    for (let type in player.people.population) {
        const pop = player.people.population[type];
        const available = pop.count - pop.employed - pop.sick;
        if (available > 0 && workersToAssign > 0) {
            const assigned = Math.min(available, workersToAssign);
            pop.employed += assigned;
            workersToAssign -= assigned;
        }
    }
    
    return {
        success: true,
        message: `🏗️ ${building.emoji} *${building.name}* ساخته شد!\n📝 ${building.description}\n👥 ${building.workersNeeded} کارگر`
    };
}

function setTaxRate(player, className, rate) {
    initPeople(player);
    
    if (!populationTypes[className]) {
        return { success: false, message: '❌ طبقه نامعتبر!' };
    }
    
    if (rate < 0 || rate > 0.60) {
        return { success: false, message: '❌ نرخ مالیات باید بین ۰٪ تا ۶۰٪ باشه!' };
    }
    
    populationTypes[className].taxRate = rate;
    
    const effect = rate > 0.30 ? '😡' : rate > 0.15 ? '😐' : '😊';
    
    return {
        success: true,
        message: `📜 نرخ مالیات ${populationTypes[className].emoji} ${populationTypes[className].name}:\n${effect} ${Math.floor(rate * 100)}٪`
    };
}

function collectTaxes(player) {
    initPeople(player);
    
    let totalTax = 0;
    const taxDetails = [];
    
    for (let type in player.people.population) {
        const popData = populationTypes[type];
        const pop = player.people.population[type];
        
        if (popData.taxRate > 0) {
            const income = pop.count * 10; // درآمد پایه هر نفر
            const tax = Math.floor(income * popData.taxRate);
            totalTax += tax;
            taxDetails.push(`${popData.emoji} ${popData.name}: ${tax}👑 (${Math.floor(popData.taxRate * 100)}٪)`);
            
            // مالیات زیاد = نارضایتی
            if (popData.taxRate > 0.30) {
                pop.unhappy += Math.floor(pop.count * 0.05);
            }
        }
    }
    
    player.inventory.gold = (player.inventory.gold || 0) + totalTax;
    
    let message = `💰 *جمع‌آوری مالیات*\n\n`;
    for (let detail of taxDetails) {
        message += `${detail}\n`;
    }
    message += `\n👑 کل: ${totalTax} طلا`;
    
    return { success: true, message };
}

function makeDecision(player, decisionType, choice) {
    initPeople(player);
    
    const decisions = {
        festival: {
            name: 'برگزاری جشن',
            emoji: '🎉',
            cost: { gold: 100, food: 50 },
            effect: { happiness: 15, hunger: -5 },
            message: 'جشن بزرگی برگزار شد! مردم شاد شدن.'
        },
        foodAid: {
            name: 'کمک غذایی',
            emoji: '🍞',
            cost: { food: 200 },
            effect: { hunger: 20, happiness: 5 },
            message: 'غذا بین مردم تقسیم شد.'
        },
        conscription: {
            name: 'سربازگیری',
            emoji: '⚔️',
            cost: { gold: 50 },
            effect: { military: 15, happiness: -10, workers: -20 },
            message: '۲۰ نفر به ارتش پیوستن.'
        },
        taxBreak: {
            name: 'بخشش مالیات',
            emoji: '🙏',
            cost: { gold: -200 },
            effect: { happiness: 20, justice: 10 },
            message: 'مالیات این ماه بخشیده شد.'
        }
    };
    
    const decision = decisions[decisionType];
    if (!decision) return { success: false, message: '❌ تصمیم نامعتبر!' };
    
    // اعمال هزینه
    for (let item in decision.cost) {
        if (item === 'gold' && decision.cost[item] < 0) {
            player.inventory.gold = Math.max(0, (player.inventory.gold || 0) + decision.cost[item]);
        } else if (player.inventory[item] !== undefined) {
            if ((player.inventory[item] || 0) < decision.cost[item]) {
                return { success: false, message: `❌ ${item} کافی نداری!` };
            }
            player.inventory[item] -= decision.cost[item];
        }
    }
    
    // اعمال اثرات
    if (decision.effect.happiness) player.people.stats.happiness = Math.min(100, Math.max(0, player.people.stats.happiness + decision.effect.happiness));
    if (decision.effect.hunger) player.people.stats.hunger = Math.min(100, Math.max(0, player.people.stats.hunger + decision.effect.hunger));
    if (decision.effect.justice) player.people.stats.justice = Math.min(100, Math.max(0, player.people.stats.justice + decision.effect.justice));
    
    return {
        success: true,
        message: `${decision.emoji} *${decision.name}*\n${decision.message}`
    };
}
function getRandomEvent(player) {
    initPeople(player);
    
    const events = [
        {
            id: 'good_harvest',
            name: 'برداشت عالی',
            emoji: '🌾',
            description: 'محصول امسال عالی بود!',
            choices: [
                { text: '💰 ذخیره کن', effect: { food: 100 } },
                { text: '🎉 جشن بگیر', effect: { happiness: 10, food: 50 } }
            ]
        },
        {
            id: 'fire',
            name: 'آتش‌سوزی',
            emoji: '🔥',
            description: 'آتش‌سوزی توی شهر!',
            choices: [
                { text: '🧯 خاموش کن', effect: { gold: -50 } },
                { text: '😐 بی‌خیال', effect: { happiness: -20, population: -20 } }
            ]
        },
        {
            id: 'plague',
            name: 'طاعون',
            emoji: '😷',
            description: 'بیماری بین مردم پیچیده!',
            choices: [
                { text: '🏥 درمان کن', effect: { gold: -100, sick: -30 } },
                { text: '🚫 قرنطینه', effect: { happiness: -15, population: -10 } }
            ]
        },
        {
            id: 'rebellion',
            name: 'شورش',
            emoji: '🐍',
            description: 'مردم شورش کردن!',
            choices: [
                { text: '⚔️ سرکوب', effect: { happiness: -20, population: -30, military: 10 } },
                { text: '🤝 مذاکره', effect: { gold: -100, happiness: 10 } }
            ]
        },
        {
            id: 'baby_boom',
            name: 'تولد نوزادان',
            emoji: '👶',
            description: 'کلی بچه به دنیا اومده!',
            choices: [
                { text: '🎉 جشن بگیر', effect: { happiness: 10, population: 25 } },
                { text: '😐 بی‌تفاوت', effect: { population: 15 } }
            ]
        },
        {
            id: 'mine_found',
            name: 'پیدا شدن معدن',
            emoji: '💰',
            description: 'یه معدن جدید پیدا شده!',
            choices: [
                { text: '⛏️ استخراج', effect: { iron: 200, workers: -10 } },
                { text: '💰 بفروش', effect: { gold: 500 } }
            ]
        }
    ];
    
    // ۳۰٪ شانس رویداد
    if (Math.random() < 0.30) {
        const event = events[Math.floor(Math.random() * events.length)];
        player.people.currentEvent = event;
        return event;
    }
    
    return null;
}

function handleEventChoice(player, choiceIndex) {
    initPeople(player);
    
    if (!player.people.currentEvent) {
        return { success: false, message: '❌ رویدادی در جریان نیست!' };
    }
    
    const event = player.people.currentEvent;
    const choice = event.choices[choiceIndex];
    
    if (!choice) return { success: false, message: '❌ انتخاب نامعتبر!' };
    
    // اعمال اثرات
    let message = `${event.emoji} *${event.name}*\n${choice.text}\n\n`;
    
    if (choice.effect.food) {
        player.people.storage.food += choice.effect.food;
        message += `🍞 ${choice.effect.food > 0 ? '+' : ''}${choice.effect.food} غذا\n`;
    }
    if (choice.effect.gold) {
        player.inventory.gold = Math.max(0, (player.inventory.gold || 0) + choice.effect.gold);
        message += `👑 ${choice.effect.gold > 0 ? '+' : ''}${choice.effect.gold} طلا\n`;
    }
    if (choice.effect.happiness) {
        player.people.stats.happiness = Math.min(100, Math.max(0, player.people.stats.happiness + choice.effect.happiness));
        message += `😊 ${choice.effect.happiness > 0 ? '+' : ''}${choice.effect.happiness} خوشبختی\n`;
    }
    if (choice.effect.population) {
        for (let type in player.people.population) {
            player.people.population[type].count = Math.max(0, player.people.population[type].count + Math.floor(choice.effect.population / 5));
        }
        message += `👥 ${choice.effect.population > 0 ? '+' : ''}${choice.effect.population} جمعیت\n`;
    }
    if (choice.effect.iron) {
        player.inventory.iron = (player.inventory.iron || 0) + choice.effect.iron;
        message += `⛏️ +${choice.effect.iron} آهن\n`;
    }
    
    player.people.currentEvent = null;
    
    return { success: true, message };
}
function formatPeople(player) {
    initPeople(player);
    
    const stats = getPopulationStats(player);
    const totalLands = player.people.lands.length;
    const totalBuildings = player.people.buildings.length;
    
    let msg = '👥 *مردم امپراطوری*\n\n';
    
    msg += `👥 *جمعیت:* ${stats.total} نفر\n`;
    msg += `💪 کارگر آماده: ${stats.available}\n`;
    msg += `😷 بیمار: ${stats.sick}\n`;
    msg += `😡 ناراضی: ${stats.unhappy}\n\n`;
    
    msg += `📊 *شاخص‌ها:*\n`;
    msg += `${getStatBar('😊 خوشبختی', stats.happiness)}\n`;
    msg += `${getStatBar('🍞 سیری', stats.hunger)}\n`;
    msg += `${getStatBar('🛡️ امنیت', stats.safety)}\n`;
    msg += `${getStatBar('⚖️ عدالت', stats.justice)}\n`;
    msg += `${getStatBar('🙏 ایمان', stats.faith)}\n\n`;
    
    msg += `📦 *ذخایر:*\n`;
    msg += `🍞 غذا: ${player.people.storage.food}\n`;
    msg += `💧 آب: ${player.people.storage.water}\n\n`;
    
    msg += `🌾 *زمین‌ها:* ${totalLands} عدد\n`;
    if (totalLands > 0) {
        for (let land of player.people.lands) {
            const landData = landTypes[land.type];
            const remaining = Math.max(0, Math.ceil((land.harvestAt - Date.now()) / (24 * 60 * 60 * 1000)));
            msg += `   ${landData.emoji} ${landData.name} (${land.count} هکتار) - ${remaining} روز\n`;
        }
    }
    msg += '\n';
    
    msg += `🏗️ *ساختمان‌ها:* ${totalBuildings} عدد\n`;
    if (totalBuildings > 0) {
        for (let buildingKey of player.people.buildings) {
            const building = buildings[buildingKey];
            msg += `   ${building.emoji} ${building.name}\n`;
        }
    }
    msg += '\n';
    
    msg += '👥 *طبقات:*\n';
    for (let type in player.people.population) {
        const popData = populationTypes[type];
        const pop = player.people.population[type];
        msg += `   ${popData.emoji} ${popData.name}: ${pop.count} نفر (مالیات: ${Math.floor(popData.taxRate * 100)}٪)\n`;
    }
    
    return msg;
}

function getStatBar(name, value) {
    const filled = Math.floor(value / 10);
    let bar = name + ': ';
    for (let i = 0; i < 10; i++) {
        if (i < filled) {
            if (i < 4) bar += '🟥';
            else if (i < 7) bar += '🟨';
            else bar += '🟩';
        } else {
            bar += '⬛';
        }
    }
    bar += ` ${value}٪`;
    return bar;
}

function getPeopleKeyboard(player) {
    initPeople(player);
    
    const buttons = [];
    
    // دکمه‌های اصلی
    buttons.push(['💰 جمع‌آوری مالیات']);
    buttons.push(['🌾 مدیریت زمین‌ها']);
    buttons.push(['🏗️ ساخت ساختمان']);
    buttons.push(['📜 تصمیم‌گیری']);
    
    // اگه رویداد هست
    if (player.people.currentEvent) {
        const event = player.people.currentEvent;
        buttons.push([`❗ ${event.emoji} ${event.name}`]);
    }
    
    buttons.push(['🔙 برگشت']);
    
    return { reply_markup: { keyboard: buttons, resize_keyboard: true } };
}

function getLandKeyboard() {
    const buttons = [];
    
    for (let type in landTypes) {
        const land = landTypes[type];
        buttons.push([`🌾 ${land.emoji} ${land.name} (${land.cost}👑)`]);
    }
    
    buttons.push(['💧 آبیاری همه زمین‌ها']);
    buttons.push(['🌾 برداشت همه زمین‌ها']);
    buttons.push(['🔙 برگشت']);
    
    return { reply_markup: { keyboard: buttons, resize_keyboard: true } };
}

function getBuildingKeyboard() {
    const buttons = [];
    
    for (let key in buildings) {
        const building = buildings[key];
        buttons.push([`🏗️ ${building.emoji} ${building.name}`]);
    }
    
    buttons.push(['🔙 برگشت']);
    
    return { reply_markup: { keyboard: buttons, resize_keyboard: true } };
}

function getDecisionKeyboard() {
    return {
        reply_markup: {
            keyboard: [
                ['🎉 برگزاری جشن (۱۰۰👑 + ۵۰🍞)'],
                ['🍞 کمک غذایی (۲۰۰🍞)'],
                ['⚔️ سربازگیری (۵۰👑)'],
                ['🙏 بخشش مالیات'],
                ['🔙 برگشت']
            ],
            resize_keyboard: true
        }
    };
}

module.exports = {
    populationTypes,
    landTypes,
    buildings,
    initPeople,
    getTotalPopulation,
    getAvailableWorkers,
    getPopulationStats,
    updatePopulation,
    assignLand,
    waterLand,
    harvestLand,
    harvestAllLands,
    buildPublicBuilding,
    setTaxRate,
    collectTaxes,
    makeDecision,
    getRandomEvent,
    handleEventChoice,
    formatPeople,
    getPeopleKeyboard,
    getLandKeyboard,
    getBuildingKeyboard,
    getDecisionKeyboard
};