const config = require('./config');
const { initChildren } = require('./offspring');

// سطوح امپراطوری
const empireLevels = {
    0: { name: 'بدون قلمرو', emoji: '👤', minScore: 0, maxSlots: 0, dailyGold: 0, dailyResources: {}, powerBonus: 0 },
    1: { name: 'خاندان', emoji: '🏕️', minScore: 100, maxSlots: 1, dailyGold: 20, dailyResources: { wood: 5, stone: 3 }, powerBonus: 5 },
    2: { name: 'خانواده بزرگ', emoji: '🏘️', minScore: 500, maxSlots: 2, dailyGold: 50, dailyResources: { wood: 10, stone: 8, meat: 5 }, powerBonus: 10 },
    3: { name: 'قبیله', emoji: '🏰', minScore: 1500, maxSlots: 3, dailyGold: 100, dailyResources: { wood: 20, stone: 15, meat: 10, iron: 5 }, powerBonus: 20 },
    4: { name: 'پادشاهی', emoji: '👑', minScore: 3000, maxSlots: 4, dailyGold: 200, dailyResources: { wood: 40, stone: 30, meat: 20, iron: 10, gold: 50 }, powerBonus: 35 },
    5: { name: 'امپراطوری', emoji: '🏛️', minScore: 5000, maxSlots: 5, dailyGold: 500, dailyResources: { wood: 80, stone: 60, meat: 40, iron: 25, gold: 100, diamond: 1 }, powerBonus: 50 },
    6: { name: 'امپراطوری اساطیری', emoji: '🌟', minScore: 10000, maxSlots: 6, dailyGold: 1000, dailyResources: { wood: 150, stone: 120, meat: 80, iron: 50, gold: 200, diamond: 3 }, powerBonus: 100 }
};

// سمت‌های امپراطوری
const empireRoles = {
    emperor: { name: 'امپراطور', emoji: '👑', minLevel: 0, bonus: { all: 10 }, description: 'فرمانده کل' },
    heir: { name: 'ولیعهد', emoji: '🤴', minLevel: 1, bonus: { resources: 20 }, description: '+۲۰٪ همه منابع', needsChild: true, needsHeir: true },
    commander: { name: 'فرمانده ارتش', emoji: '⚔️', minLevel: 2, bonus: { military: 30 }, description: '+۳۰٪ قدرت نظامی', needsChild: true, childClass: 'warrior', childEvolution: 3 },
    mageMinister: { name: 'وزیر جادو', emoji: '🧙', minLevel: 2, bonus: { magic: 30 }, description: '+۳۰٪ قدرت جادویی', needsChild: true, childClass: 'mage', childEvolution: 3 },
    guardianChief: { name: 'نگهبان اعظم', emoji: '🛡️', minLevel: 2, bonus: { defense: 40 }, description: '+۴۰٪ دفاع', needsChild: true, childClass: 'guardian', childEvolution: 3 },
    hunterChief: { name: 'شکارچی ارشد', emoji: '🏹', minLevel: 2, bonus: { resources: 30 }, description: '+۳۰٪ منابع روزانه', needsChild: true, childClass: 'hunter', childEvolution: 3 },
    historian: { name: 'مورخ سلطنتی', emoji: '📜', minLevel: 3, bonus: { xp: 25 }, description: '+۲۵٪ XP', needsChild: true, childClass: 'sage', childEvolution: 3 },
    queen: { name: 'ملکه مادر', emoji: '👸', minLevel: 1, bonus: { birth: 10 }, description: '+۱۰٪ شانس بارداری', needsSpouse: true }
};

// عجایب امپراطوری
const wonders = {
    statue: {
        name: 'تندیس امپراطور',
        emoji: '🗿',
        cost: { stone: 50 },
        bonus: { prestige: 20 },
        description: '+۲۰٪ اعتبار',
        minLevel: 1,
        builderClass: 'sage'
    },
    arena: {
        name: 'میدان نبرد',
        emoji: '🏟️',
        cost: { iron: 30, stone: 20 },
        bonus: { military: 30 },
        description: '+۳۰٪ قدرت نظامی',
        minLevel: 2,
        builderClass: 'warrior'
    },
    temple: {
        name: 'معبد اجداد',
        emoji: '🏛️',
        cost: { gold: 200, diamond: 2 },
        bonus: { legendaryChance: 5 },
        description: '+۵٪ شانس فرزند افسانه‌ای',
        minLevel: 3,
        builderClass: 'mage'
    },
    library: {
        name: 'کتابخانه سلطنتی',
        emoji: '📚',
        cost: { wood: 40, gold: 100 },
        bonus: { xp: 50 },
        description: '+۵۰٪ XP برای همه',
        minLevel: 2,
        builderClass: 'sage'
    },
    tower: {
        name: 'برج دیده‌بانی',
        emoji: '🗼',
        cost: { stone: 25, wood: 15 },
        bonus: { vision: 1 },
        description: 'کشف دشمنان مخفی',
        minLevel: 2,
        builderClass: 'hunter'
    },
    greatWall: {
        name: 'دیوار بزرگ',
        emoji: '🛡️',
        cost: { stone: 60, iron: 30 },
        bonus: { defense: 100 },
        description: 'دفاع ۲ برابر',
        minLevel: 3,
        builderClass: 'guardian'
    },
    throne: {
        name: 'تاج خدایان',
        emoji: '👑',
        cost: { diamond: 5, gold: 500 },
        bonus: { all: 50 },
        description: 'همه آمار ۵۰٪ بیشتر',
        minLevel: 5,
        builderClass: 'prince'
    }
};

function initEmpire(player) {
    if (!player.empire) {
        player.empire = {
            level: 0,
            score: 0,
            roles: {},
            wonders: [],
            foundedAt: Date.now(),
            lastCollection: Date.now(),
            dynastyName: '',
            treasury: 0
        };
    }
    return player.empire;
}

function getEmpireLevel(player) {
    initEmpire(player);
    
    const score = player.score || 0;
    let level = 0;
    
    for (let lvl in empireLevels) {
        if (score >= empireLevels[lvl].minScore) {
            level = parseInt(lvl);
        }
    }
    
    if (level !== player.empire.level) {
        player.empire.level = level;
    }
    
    return empireLevels[level];
}

function assignRole(player, roleKey, childId) {
    initEmpire(player);
    initChildren(player);
    
    const role = empireRoles[roleKey];
    if (!role) return { success: false, message: '❌ سمت نامعتبر!' };
    
    const empireLvl = empireLevels[player.empire.level || 0];
    if (player.empire.level < role.minLevel) {
        return { success: false, message: `❌ امپراطوری باید حداقل سطح ${role.minLevel} باشه!' }` };
    }
    
    if (role.needsChild) {
        if (!childId) return { success: false, message: '❌ باید یه فرزند انتخاب کنی!' };
        
        const child = player.children.find(c => c.id === childId && c.isAlive);
        if (!child) return { success: false, message: '❌ فرزند پیدا نشد!' };
        
        if (role.needsHeir && !child.isHeir) {
            return { success: false, message: '❌ فقط ولیعهد می‌تونه این سمت رو بگیره!' };
        }
        
        if (role.childClass && child.class !== role.childClass) {
            return { success: false, message: `❌ این سمت مخصوص ${role.childClass}هاست!' }` };
        }
        
        if (role.childEvolution && child.evolutionLevel < role.childEvolution) {
            return { success: false, message: `❌ فرزند باید حداقل سطح ارتقا ${role.childEvolution} باشه!' }` };
        }
        
        player.empire.roles[roleKey] = {
            childId: child.id,
            childName: child.name,
            childEmoji: child.emoji,
            assignedAt: Date.now()
        };
        
        child.loyalty = Math.min(100, child.loyalty + 15);
        
        return {
            success: true,
            message: `✅ ${child.emoji} *${child.name}* شد ${role.emoji} *${role.name}*\n📝 ${role.description}`
        };
    }
    
    if (role.needsSpouse) {
        if (!player.marry) return { success: false, message: '❌ اول ازدواج کن!' };
        
        player.empire.roles[roleKey] = {
            spouseId: player.marry,
            assignedAt: Date.now()
        };
        
        return {
            success: true,
            message: `✅ ${role.emoji} *${role.name}* منصوب شد!\n📝 ${role.description}`
        };
    }
    
    return { success: false, message: '❌ خطا در انتصاب!' };
}
function removeRole(player, roleKey) {
    initEmpire(player);
    
    if (!player.empire.roles[roleKey]) {
        return { success: false, message: '❌ این سمت پر نیست!' };
    }
    
    const role = empireRoles[roleKey];
    const roleData = player.empire.roles[roleKey];
    
    delete player.empire.roles[roleKey];
    
    return {
        success: true,
        message: `✅ ${role.emoji} *${role.name}* برکنار شد.`
    };
}

function calculateEmpirePower(player) {
    initEmpire(player);
    initChildren(player);
    
    let militaryPower = player.attack * 1.5;
    let defensePower = player.defense * 2;
    let magicPower = 0;
    let totalPower = 0;
    
    // قدرت فرزندان
    if (player.children) {
        const aliveChildren = player.children.filter(c => c.isAlive);
        for (let child of aliveChildren) {
            militaryPower += child.attack * (child.ageStage === 'adult' || child.ageStage === 'mature' || child.ageStage === 'elder' ? 1 : 0.5);
            defensePower += child.defense * 0.5;
            
            if (child.class === 'mage') {
                magicPower += child.power * 1.2;
            }
            
            totalPower += child.power;
        }
    }
    
    // قدرت حیوانات
    if (player.pets) {
        for (let pet of player.pets) {
            militaryPower += pet.attackBonus * 0.5;
        }
    }
    
    // بونوس سمت‌ها
    for (let roleKey in player.empire.roles) {
        const role = empireRoles[roleKey];
        if (role && role.bonus) {
            if (role.bonus.military) militaryPower *= (1 + role.bonus.military / 100);
            if (role.bonus.defense) defensePower *= (1 + role.bonus.defense / 100);
            if (role.bonus.magic) magicPower *= (1 + role.bonus.magic / 100);
        }
    }
    
    // بونوس عجایب
    for (let wonderKey of player.empire.wonders) {
        const wonder = wonders[wonderKey];
        if (wonder && wonder.bonus) {
            if (wonder.bonus.military) militaryPower *= (1 + wonder.bonus.military / 100);
            if (wonder.bonus.defense) defensePower *= (1 + wonder.bonus.defense / 100);
        }
    }
    
    // بونوس سطح امپراطوری
    const empireLvl = empireLevels[player.empire.level || 0];
    militaryPower += empireLvl.powerBonus;
    defensePower += empireLvl.powerBonus * 0.5;
    
    return {
        military: Math.floor(militaryPower),
        defense: Math.floor(defensePower),
        magic: Math.floor(magicPower),
        total: Math.floor(militaryPower + defensePower + magicPower),
        childrenPower: totalPower
    };
}

function collectEmpireIncome(player) {
    initEmpire(player);
    
    const now = Date.now();
    const oneDay = 24 * 60 * 60 * 1000;
    
    if (now - player.empire.lastCollection < oneDay) {
        const remaining = oneDay - (now - player.empire.lastCollection);
        const hoursLeft = Math.floor(remaining / (60 * 60 * 1000));
        const minutesLeft = Math.floor((remaining % (60 * 60 * 1000)) / (60 * 1000));
        return { success: false, message: `⏰ ${hoursLeft}h ${minutesLeft}m تا درآمد بعدی` };
    }
    
    const empireLvl = empireLevels[player.empire.level || 0];
    let totalGold = empireLvl.dailyGold;
    const collectedResources = {};
    
    // منابع پایه
    for (let res in empireLvl.dailyResources) {
        collectedResources[res] = empireLvl.dailyResources[res];
    }
    
    // بونوس سمت‌ها
    let resourceBonus = 0;
    for (let roleKey in player.empire.roles) {
        const role = empireRoles[roleKey];
        if (role && role.bonus && role.bonus.resources) {
            resourceBonus += role.bonus.resources;
        }
    }
    
    // بونوس فرزندان
    if (player.children) {
        const aliveChildren = player.children.filter(c => c.isAlive && c.ageStage !== 'baby');
        resourceBonus += aliveChildren.length * 5;
        
        for (let child of aliveChildren) {
            if (child.class === 'hunter') {
                collectedResources.meat = (collectedResources.meat || 0) + child.power;
            }
            if (child.class === 'sage') {
                player.xp = (player.xp || 0) + child.power;
            }
        }
    }
    
    // اعمال بونوس
    totalGold = Math.floor(totalGold * (1 + resourceBonus / 100));
    for (let res in collectedResources) {
        collectedResources[res] = Math.floor(collectedResources[res] * (1 + resourceBonus / 100));
    }
    
    // واریز به خزانه
    player.empire.treasury += totalGold;
    player.inventory.gold = (player.inventory.gold || 0) + totalGold;
    
    for (let res in collectedResources) {
        player.inventory[res] = (player.inventory[res] || 0) + collectedResources[res];
    }
    
    player.empire.lastCollection = now;
    
    let message = `💰 *درآمد امپراطوری*\n\n👑 +${totalGold} طلا\n`;
    for (let res in collectedResources) {
        const emoji = config.images?.resources?.[res]?.emoji || '';
        message += `${emoji} +${collectedResources[res]} ${res}\n`;
    }
    message += `\n🏦 خزانه: ${player.empire.treasury} طلا\n`;
    message += `⭐ +${player.children ? player.children.filter(c => c.isAlive && c.class === 'sage').length * 10 : 0} XP`;
    
    return { success: true, message };
}
function buildWonder(player, wonderKey) {
    initEmpire(player);
    initChildren(player);
    
    const wonder = wonders[wonderKey];
    if (!wonder) return { success: false, message: '❌ عجایب نامعتبر!' };
    
    if (player.empire.wonders.includes(wonderKey)) {
        return { success: false, message: '❌ این عجایب قبلاً ساخته شده!' };
    }
    
    if (player.empire.level < wonder.minLevel) {
        return { success: false, message: `❌ امپراطوری باید سطح ${wonder.minLevel} باشه!` };
    }
    
    // چک کردن مواد
    for (let item in wonder.cost) {
        if ((player.inventory[item] || 0) < wonder.cost[item]) {
            return { success: false, message: `❌ ${item} کافی نداری!\nنیاز: ${wonder.cost[item]}` };
        }
    }
    
    // چک کردن سازنده
    if (wonder.builderClass) {
        const builder = player.children.find(c => c.isAlive && c.class === wonder.builderClass && c.ageStage !== 'baby');
        if (!builder) {
            return { success: false, message: `❌ یه ${wonder.builderClass} برای ساخت نیازه!` };
        }
    }
    
    // مصرف مواد
    for (let item in wonder.cost) {
        player.inventory[item] -= wonder.cost[item];
    }
    
    player.empire.wonders.push(wonderKey);
    player.score = (player.score || 0) + 200;
    
    return {
        success: true,
        message: `🏗️ ${wonder.emoji} *${wonder.name}* ساخته شد!\n📝 ${wonder.description}\n🏆 +۲۰۰ امتیاز`
    };
}

function formatEmpire(player) {
    initEmpire(player);
    initChildren(player);
    
    const empireLvl = getEmpireLevel(player);
    const power = calculateEmpirePower(player);
    
    let msg = `${empireLvl.emoji} *${empireLvl.name}*\n\n`;
    
    if (player.empire.dynastyName) {
        msg += `📜 *سلسله ${player.empire.dynastyName}*\n\n`;
    }
    
    msg += `👑 امتیاز: ${player.score || 0} / ${empireLevels[Math.min(6, player.empire.level + 1)]?.minScore || '∞'}\n`;
    msg += `🏦 خزانه: ${player.empire.treasury || 0} طلا\n`;
    msg += `💰 درآمد روزانه: ${empireLvl.dailyGold} طلا\n\n`;
    
    msg += `⚔️ *قدرت نظامی:* ${power.military}\n`;
    msg += `🛡️ *قدرت دفاعی:* ${power.defense}\n`;
    msg += `🧙 *قدرت جادویی:* ${power.magic}\n`;
    msg += `💪 *قدرت کل:* ${power.total}\n\n`;
    
    // سمت‌ها
    msg += '👥 *سمت‌های امپراطوری:*\n';
    let hasRoles = false;
    for (let roleKey in empireRoles) {
        const role = empireRoles[roleKey];
        if (player.empire.level >= role.minLevel) {
            if (player.empire.roles[roleKey]) {
                const roleData = player.empire.roles[roleKey];
                hasRoles = true;
                if (roleData.childName) {
                    msg += `   ${role.emoji} ${role.name}: ${roleData.childEmoji} ${roleData.childName}\n`;
                } else {
                    msg += `   ${role.emoji} ${role.name}: ✅\n`;
                }
            } else {
                msg += `   ${role.emoji} ${role.name}: ❌ خالی\n`;
            }
        }
    }
    if (!hasRoles) msg += '   ❌ هیچ سمتی پر نیست\n';
    
    msg += '\n';
    
    // عجایب
    msg += '🏛️ *عجایب:*\n';
    if (player.empire.wonders.length === 0) {
        msg += '   ❌ هیچ عجایبی ساخته نشده\n';
    } else {
        for (let wonderKey of player.empire.wonders) {
            const wonder = wonders[wonderKey];
            msg += `   ${wonder.emoji} ${wonder.name}: ${wonder.description}\n`;
        }
    }
    
    msg += '\n';
    
    // فرزندان فعال
    if (player.children) {
        const alive = player.children.filter(c => c.isAlive);
        msg += `👶 فرزندان: ${alive.length} نفر\n`;
        const heirs = alive.filter(c => c.isHeir);
        if (heirs.length > 0) {
            msg += `👑 ولیعهد: ${heirs[0].emoji} ${heirs[0].name}\n`;
        }
    }
    
    return msg;
}
function getEmpireKeyboard(player) {
    initEmpire(player);
    initChildren(player);
    
    const buttons = [];
    
    // جمع‌آوری درآمد
    buttons.push(['💰 جمع‌آوری درآمد']);
    
    // سمت‌ها
    const empireLvl = empireLevels[player.empire.level || 0];
    for (let roleKey in empireRoles) {
        const role = empireRoles[roleKey];
        if (player.empire.level >= role.minLevel) {
            if (!player.empire.roles[roleKey]) {
                buttons.push([`📋 انتصاب ${role.emoji} ${role.name}`]);
            } else {
                buttons.push([`❌ برکناری ${role.emoji} ${role.name}`]);
            }
        }
    }
    
    // عجایب قابل ساخت
    for (let wonderKey in wonders) {
        const wonder = wonders[wonderKey];
        if (!player.empire.wonders.includes(wonderKey) && player.empire.level >= wonder.minLevel) {
            buttons.push([`🏗️ ساخت ${wonder.emoji} ${wonder.name}`]);
        }
    }
    
    // تغییر نام سلسله
    buttons.push(['📝 تغییر نام سلسله']);
    
    buttons.push(['🔙 برگشت']);
    
    return { reply_markup: { keyboard: buttons, resize_keyboard: true } };
}

function getRoleAssignmentKeyboard(player, roleKey) {
    initChildren(player);
    
    const role = empireRoles[roleKey];
    if (!role || !role.needsChild) return null;
    
    const buttons = [];
    const aliveChildren = player.children.filter(c => c.isAlive);
    
    for (let child of aliveChildren) {
        if (role.childClass && child.class !== role.childClass) continue;
        if (role.childEvolution && child.evolutionLevel < role.childEvolution) continue;
        if (role.needsHeir && !child.isHeir) continue;
        
        buttons.push([`✅ ${child.emoji} ${child.name} (⚔️${child.attack} 🛡️${child.defense})`]);
    }
    
    if (buttons.length === 0) {
        buttons.push(['❌ هیچ فرزند واجد شرایطی نیست']);
    }
    
    buttons.push(['🔙 برگشت']);
    
    return { reply_markup: { keyboard: buttons, resize_keyboard: true } };
}

function setDynastyName(player, name) {
    initEmpire(player);
    
    if (!name || name.trim().length === 0) {
        return { success: false, message: '❌ اسم سلسله نمی‌تونه خالی باشه!' };
    }
    
    if (name.trim().length > 20) {
        return { success: false, message: '❌ اسم سلسله حداکثر ۲۰ حرفه!' };
    }
    
    player.empire.dynastyName = name.trim();
    
    return {
        success: true,
        message: `📜 نام سلسله تغییر کرد!\n👑 *سلسله ${name.trim()}*`
    };
}

function getEmpireRanking() {
    const { players } = require('./player');
    
    const empires = [];
    
    for (let id in players) {
        const p = players[id];
        if (p.empire && p.empire.level > 0) {
            const power = calculateEmpirePower(p);
            empires.push({
                name: p.name,
                empireLevel: p.empire.level,
                empireName: empireLevels[p.empire.level]?.name || 'نامعلوم',
                dynastyName: p.empire.dynastyName || 'بدون نام',
                score: p.score || 0,
                power: power.total,
                children: p.children ? p.children.filter(c => c.isAlive).length : 0,
                wonders: p.empire.wonders.length
            });
        }
    }
    
    // مرتب‌سازی بر اساس امتیاز
    empires.sort((a, b) => b.score - a.score);
    
    return empires.slice(0, 10);
}

function formatEmpireRanking() {
    const ranking = getEmpireRanking();
    
    if (ranking.length === 0) {
        return '🏛️ *رتبه‌بندی امپراطوری‌ها*\n\n❌ هنوز هیچ امپراطوری تشکیل نشده!';
    }
    
    let msg = '🏛️ *برترین امپراطوری‌ها*\n\n';
    const medals = ['🥇', '🥈', '🥉', '4️⃣', '5️⃣', '6️⃣', '7️⃣', '8️⃣', '9️⃣', '🔟'];
    
    for (let i = 0; i < ranking.length; i++) {
        const emp = ranking[i];
        msg += `${medals[i]} *${emp.name}*\n`;
        msg += `   👑 ${emp.empireName} | 📜 سلسله ${emp.dynastyName}\n`;
        msg += `   ⚔️ قدرت: ${emp.power} | 🏆 ${emp.score} امتیاز\n`;
        msg += `   👶 ${emp.children} فرزند | 🏛️ ${emp.wonders} عجایب\n\n`;
    }
    
    return msg;
}
function dailyEmpireUpdate(player) {
    initEmpire(player);
    initChildren(player);
    
    const updates = [];
    
    // بروزرسانی سن فرزندان
    const ageUpdates = require('./offspring').updateChildAges(player);
    if (ageUpdates.length > 0) {
        updates.push(...ageUpdates.map(u => u.message));
    }
    
    // چک کردن تولدها
    const births = require('./offspring').checkBirths(player);
    if (births.length > 0) {
        for (let child of births) {
            updates.push(`👶 *${child.name}* متولد شد! ${child.emoji}`);
        }
    }
    
    // بروزرسانی سطح امپراطوری
    const oldLevel = player.empire.level;
    const newLevel = getEmpireLevel(player);
    if (newLevel && player.empire.level !== oldLevel) {
        updates.push(`👑 امپراطوری ارتقا یافت!\n${empireLevels[oldLevel]?.emoji || '👤'} → ${newLevel.emoji} *${newLevel.name}*`);
    }
    
    return updates;
}

function getEmpireBonuses(player) {
    initEmpire(player);
    
    const bonuses = {
        attack: 0,
        defense: 0,
        gold: 0,
        xp: 0,
        resourceBonus: 0
    };
    
    const empireLvl = empireLevels[player.empire.level || 0];
    bonuses.gold = empireLvl.dailyGold;
    bonuses.attack = empireLvl.powerBonus;
    
    // بونوس سمت‌ها
    for (let roleKey in player.empire.roles) {
        const role = empireRoles[roleKey];
        if (role && role.bonus) {
            if (role.bonus.military) bonuses.attack += Math.floor(bonuses.attack * role.bonus.military / 100);
            if (role.bonus.defense) bonuses.defense += Math.floor(bonuses.defense * role.bonus.defense / 100);
            if (role.bonus.resources) bonuses.resourceBonus += role.bonus.resources;
            if (role.bonus.xp) bonuses.xp += role.bonus.xp;
            if (role.bonus.birth) bonuses.birthChance = role.bonus.birth;
        }
    }
    
    // بونوس عجایب
    for (let wonderKey of player.empire.wonders) {
        const wonder = wonders[wonderKey];
        if (wonder && wonder.bonus) {
            if (wonder.bonus.military) bonuses.attack += Math.floor(bonuses.attack * wonder.bonus.military / 100);
            if (wonder.bonus.defense) bonuses.defense += Math.floor(bonuses.defense * wonder.bonus.defense / 100);
            if (wonder.bonus.xp) bonuses.xp += wonder.bonus.xp;
        }
    }
    
    return bonuses;
}

module.exports = {
    empireLevels,
    empireRoles,
    wonders,
    initEmpire,
    getEmpireLevel,
    assignRole,
    removeRole,
    calculateEmpirePower,
    collectEmpireIncome,
    buildWonder,
    formatEmpire,
    getEmpireKeyboard,
    getRoleAssignmentKeyboard,
    setDynastyName,
    getEmpireRanking,
    formatEmpireRanking,
    dailyEmpireUpdate,
    getEmpireBonuses
};