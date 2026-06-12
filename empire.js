const config = require('./config');
const { initChildren } = require('./offspring');

const empireLevels = {
    0: { name: 'بدون قلمرو', emoji: '👤', minScore: 0, dailyGold: 0, dailyResources: {} },
    1: { name: 'خاندان', emoji: '🏕️', minScore: 100, dailyGold: 20, dailyResources: { wood: 5, stone: 3 } },
    2: { name: 'خانواده بزرگ', emoji: '🏘️', minScore: 500, dailyGold: 50, dailyResources: { wood: 10, stone: 8, meat: 5 } },
    3: { name: 'قبیله', emoji: '🏰', minScore: 1500, dailyGold: 100, dailyResources: { wood: 20, stone: 15, meat: 10, iron: 5 } },
    4: { name: 'پادشاهی', emoji: '👑', minScore: 3000, dailyGold: 200, dailyResources: { wood: 40, stone: 30, meat: 20, iron: 10, gold: 50 } },
    5: { name: 'امپراطوری', emoji: '🏛️', minScore: 5000, dailyGold: 500, dailyResources: { wood: 80, stone: 60, meat: 40, iron: 25, gold: 100, diamond: 1 } },
    6: { name: 'امپراطوری اساطیری', emoji: '🌟', minScore: 10000, dailyGold: 1000, dailyResources: { wood: 150, stone: 120, meat: 80, iron: 50, gold: 200, diamond: 3 } }
};

const empireRoles = {
    heir: { name: 'ولیعهد', emoji: '🤴', minLevel: 1, bonus: { resources: 20 }, needsChild: true, needsHeir: true },
    commander: { name: 'فرمانده ارتش', emoji: '⚔️', minLevel: 2, bonus: { military: 30 }, needsChild: true, childClass: 'warrior', childEvolution: 3 },
    mageMinister: { name: 'وزیر جادو', emoji: '🧙', minLevel: 2, bonus: { magic: 30 }, needsChild: true, childClass: 'mage', childEvolution: 3 },
    guardianChief: { name: 'نگهبان اعظم', emoji: '🛡️', minLevel: 2, bonus: { defense: 40 }, needsChild: true, childClass: 'guardian', childEvolution: 3 },
    hunterChief: { name: 'شکارچی ارشد', emoji: '🏹', minLevel: 2, bonus: { resources: 30 }, needsChild: true, childClass: 'hunter', childEvolution: 3 },
    historian: { name: 'مورخ سلطنتی', emoji: '📜', minLevel: 3, bonus: { xp: 25 }, needsChild: true, childClass: 'sage', childEvolution: 3 },
    treasurer: { name: 'خزانه‌دار', emoji: '💰', minLevel: 2, bonus: { gold: 20 }, needsChild: true, childClass: 'merchant', childEvolution: 2 },
    spymaster: { name: 'رئیس جاسوسان', emoji: '🕵️', minLevel: 3, bonus: { intelligence: 25 }, needsChild: true, childClass: 'hunter', childEvolution: 3 }
};

const wonders = {
    statue: { name: 'تندیس امپراطور', emoji: '🗿', cost: { stone: 50, gold: 100 }, bonus: { prestige: 20 }, minLevel: 1, description: 'اعتبار +۲۰٪' },
    arena: { name: 'میدان نبرد', emoji: '🏟️', cost: { iron: 30, stone: 20 }, bonus: { military: 30 }, minLevel: 2, description: 'قدرت نظامی +۳۰٪' },
    temple: { name: 'معبد اجداد', emoji: '🏛️', cost: { gold: 200, diamond: 2 }, bonus: { faith: 20 }, minLevel: 3, description: 'شانس افسانه‌ای +۵٪' },
    library: { name: 'کتابخانه سلطنتی', emoji: '📚', cost: { wood: 40, gold: 100 }, bonus: { xp: 50 }, minLevel: 2, description: 'XP +۵۰٪' },
    tower: { name: 'برج دیده‌بانی', emoji: '🗼', cost: { stone: 25, wood: 15 }, bonus: { vision: 1 }, minLevel: 2, description: 'کشف دشمنان' },
    greatWall: { name: 'دیوار بزرگ', emoji: '🛡️', cost: { stone: 60, iron: 30 }, bonus: { defense: 100 }, minLevel: 3, description: 'دفاع ۲ برابر' },
    market: { name: 'بازار بزرگ', emoji: '🏪', cost: { gold: 300, wood: 50 }, bonus: { gold: 30 }, minLevel: 2, description: 'درآمد طلا +۳۰٪' },
    throne: { name: 'تخت پادشاهی', emoji: '👑', cost: { diamond: 5, gold: 500 }, bonus: { all: 50 }, minLevel: 5, description: 'همه آمار +۵۰٪' }
};

function initEmpire(player) {
    if (!player.empire) {
        player.empire = {
            level: 0, roles: {}, wonders: [],
            foundedAt: Date.now(), lastCollection: Date.now(),
            dynastyName: '', treasury: 0, totalGoldEarned: 0,
            foundedBy: player.name
        };
    }
    return player.empire;
}

function getEmpireLevel(player) {
    initEmpire(player);
    const score = player.score || 0;
    let level = 0;
    for (let lvl in empireLevels) {
        if (score >= empireLevels[lvl].minScore) level = parseInt(lvl);
    }
    player.empire.level = level;
    return empireLevels[level];
}

function assignRole(player, roleKey, childId) {
    initEmpire(player);
    initChildren(player);
    const role = empireRoles[roleKey];
    if (!role) return { success: false, message: '❌ سمت نامعتبر!' };
    if (player.empire.level < role.minLevel) return { success: false, message: `❌ نیاز به سطح ${role.minLevel} امپراطوری` };

    if (role.needsChild) {
        if (!childId) return { success: false, message: '❌ باید یه فرزند انتخاب کنی!' };
        const child = player.children.find(c => c.id === childId && c.isAlive);
        if (!child) return { success: false, message: '❌ فرزند پیدا نشد!' };
        if (role.needsHeir && !child.isHeir) return { success: false, message: '❌ فقط ولیعهد!' };
        if (role.childClass && child.class !== role.childClass) return { success: false, message: `❌ فقط ${role.childClass}ها!` };
        if (role.childEvolution && child.evolutionLevel < role.childEvolution) return { success: false, message: `❌ نیاز به سطح ارتقا ${role.childEvolution}` };

        player.empire.roles[roleKey] = { childId: child.id, childName: child.name, childEmoji: child.emoji, assignedAt: Date.now() };
        child.loyalty = Math.min(100, child.loyalty + 15);
        return { success: true, message: `✅ ${child.emoji} *${child.name}* → ${role.emoji} *${role.name}*` };
    }

    player.empire.roles[roleKey] = { assignedAt: Date.now() };
    return { success: true, message: `✅ ${role.emoji} *${role.name}* منصوب شد!` };
}

function removeRole(player, roleKey) {
    initEmpire(player);
    if (!player.empire.roles[roleKey]) return { success: false, message: '❌ این سمت خالیه!' };
    delete player.empire.roles[roleKey];
    return { success: true, message: `✅ برکنار شد.` };
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

    let goldBonus = 0;
    for (let roleKey in player.empire.roles) {
        const role = empireRoles[roleKey];
        if (role && role.bonus && role.bonus.gold) goldBonus += role.bonus.gold;
    }
    totalGold = Math.floor(totalGold * (1 + goldBonus / 100));

    for (let wonderKey of player.empire.wonders) {
        const wonder = wonders[wonderKey];
        if (wonder && wonder.bonus && wonder.bonus.gold) {
            totalGold = Math.floor(totalGold * (1 + wonder.bonus.gold / 100));
        }
    }

    player.empire.treasury += totalGold;
    player.empire.totalGoldEarned += totalGold;
    player.inventory.gold = (player.inventory.gold || 0) + totalGold;
    player.empire.lastCollection = now;

    for (let res in empireLvl.dailyResources) {
        player.inventory[res] = (player.inventory[res] || 0) + empireLvl.dailyResources[res];
    }

    let msg = `💰 *درآمد امپراطوری*\n\n👑 +${totalGold} طلا\n🏦 خزانه: ${player.empire.treasury} طلا`;
    return { success: true, message: msg };
}

function buildWonder(player, wonderKey) {
    initEmpire(player);
    const wonder = wonders[wonderKey];
    if (!wonder) return { success: false, message: '❌ عجایب نامعتبر!' };
    if (player.empire.wonders.includes(wonderKey)) return { success: false, message: '❌ قبلاً ساخته شده!' };
    if (player.empire.level < wonder.minLevel) return { success: false, message: `❌ نیاز به سطح ${wonder.minLevel} امپراطوری` };

    for (let item in wonder.cost) {
        if ((player.inventory[item] || 0) < wonder.cost[item]) {
            return { success: false, message: `❌ ${item} کافی نداری!\nنیاز: ${wonder.cost[item]}\nداری: ${player.inventory[item] || 0}` };
        }
    }

    for (let item in wonder.cost) { player.inventory[item] -= wonder.cost[item]; }
    player.empire.wonders.push(wonderKey);
    player.score = (player.score || 0) + 200;

    return { success: true, message: `✅ ${wonder.emoji} *${wonder.name}* ساخته شد!\n📝 ${wonder.description}\n🏆 +۲۰۰ امتیاز` };
}

function setDynastyName(player, name) {
    initEmpire(player);
    if (!name || name.trim().length === 0) return { success: false, message: '❌ اسم خالی!' };
    player.empire.dynastyName = name.trim();
    return { success: true, message: `📜 نام سلسله: *${name.trim()}*` };
}

function formatEmpire(player) {
    initEmpire(player);
    initChildren(player);
    const empireLvl = getEmpireLevel(player);

    let msg = `${empireLvl.emoji} *${empireLvl.name}*\n`;
    if (player.empire.dynastyName) msg += `📜 سلسله ${player.empire.dynastyName}\n`;
    msg += `⭐ امتیاز: ${player.score || 0}\n`;
    msg += `🏦 خزانه: ${player.empire.treasury || 0} طلا\n`;
    msg += `💰 درآمد روزانه: ${empireLvl.dailyGold} طلا\n\n`;

    msg += '👥 *سمت‌ها:*\n';
    for (let roleKey in empireRoles) {
        const role = empireRoles[roleKey];
        if (player.empire.level >= role.minLevel) {
            const roleData = player.empire.roles[roleKey];
            msg += `   ${role.emoji} ${role.name}: ${roleData ? (roleData.childEmoji || '✅') + ' ' + (roleData.childName || '') : '❌ خالی'}\n`;
        }
    }

    msg += '\n🏛️ *عجایب:*\n';
    if (player.empire.wonders.length === 0) {
        msg += '   ❌ هیچی ساخته نشده\n';
    } else {
        for (let w of player.empire.wonders) {
            const wonder = wonders[w];
            if (wonder) msg += `   ✅ ${wonder.emoji} ${wonder.name}\n`;
        }
    }

    return msg;
}

// =============================================
// 🎮 کیبورد شیشه‌ای (inline)
// =============================================
function getEmpireKeyboard(player) {
    initEmpire(player);
    const buttons = [];

    buttons.push([{ text: '💰 جمع‌آوری درآمد', callback_data: 'empire_income' }]);
    buttons.push([{ text: '👸 حرمسرا', callback_data: 'harem_menu' }]);
    buttons.push([{ text: '👶 فرزندان', callback_data: 'children_menu' }]);
    buttons.push([{ text: '📋 انتصاب (سمت‌ها)', callback_data: 'empire_roles_menu' }]);
    buttons.push([{ text: '👥 مردم', callback_data: 'people_menu' }]);
    buttons.push([{ text: '🏗️ احداث (عجایب)', callback_data: 'empire_wonders_menu' }]);
    buttons.push([{ text: '🏛️ دربار', callback_data: 'court_menu' }]);
    buttons.push([{ text: '📝 تغییر نام سلسله', callback_data: 'empire_dynasty' }]);
    buttons.push([{ text: '🔙 برگشت', callback_data: 'back_to_main' }]);

    return { reply_markup: { inline_keyboard: buttons } };
}

module.exports = {
    empireLevels, empireRoles, wonders,
    initEmpire, getEmpireLevel, assignRole, removeRole,
    collectEmpireIncome, buildWonder, setDynastyName,
    formatEmpire, getEmpireKeyboard
};