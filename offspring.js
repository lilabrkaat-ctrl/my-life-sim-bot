const config = require('./config');

// عکس‌های فرزندان
const childImages = {
    warrior_boy: 'AgACAgQAAxkBAAEqca9qKX_a6hIKV4aP4GR7mJGeFCk26wACKA9rG9N3UVHWHTEQ01mNGwEAAwIAA3gAAzsE',
    training_boy: 'AgACAgQAAxkBAAEqcbBqKX_a1uF1y1F5HeXLzH8JRlHL3wACKQ9rG9N3UVEms2PPGpklgQEAAwIAA3gAAzsE',
    training_boy2: 'AgACAgQAAxkBAAEqcbFqKX_a7wTOP_0zKCmCMwU79DhZWgACKg9rG9N3UVFTbf5DVV0PdgEAAwIAA3gAAzsE',
    baby_girl: 'AgACAgQAAxkBAAEqcbNqKX_aPouI3MVHtsL-KOTKr05RgwACLA9rG9N3UVEtSl-CPTnOMwEAAwIAA3gAAzsE',
    breastfeeding: 'AgACAgQAAxkBAAEqcbJqKX_auYUEfkinCZ60Yld4IxX-6QACKw9rG9N3UVH-MTWpNIKb7AEAAwIAA3gAAzsE',
    pregnant_queen: 'AgACAgQAAxkBAAEqcbZqKX_a4-_MtgzDxMBujjPA5ajaUQACLg9rG9N3UVHiWwABA5CaoVABAAMCAAN4AAM7BA',
    baby_girl2: 'AgACAgQAAxkBAAEqcbVqKX_anxYsFafIuvDav0gfl2OTEAACLQ9rG9N3UVESJ8H4V23R3AEAAwIAA3gAAzsE',
    fetus: 'AgACAgQAAxkBAAEqcbpqKX_aBguV2lXQDto9JUYtDj9IYgACMA9rG9N3UVE90e0hFo4W_wEAAwIAA3gAAzsE',
    pregnant_queen2: 'AgACAgQAAxkBAAEqcbhqKX_a3_hckqFHx6laLWuFHTKhHQACLw9rG9N3UVEx5s_CVaUYHQEAAwIAA3gAAzsE',
    pregnant_woman: 'AgACAgQAAxkBAAEqcbtqKX_aM-MBVbXASWtHss-IvIHahQACMQ9rG9N3UVFZhM7A2L3PPAEAAwIAA3gAAzsE',
    warrior_girl: 'AgACAgQAAxkBAAEqccxqKX_0by2nHY9NXknSjer0ueKyzwACJQ9rG9N3UVGjPfigMFqwvwEAAwIAA3gAAzsE',
    desert_girl: 'AgACAgQAAxkBAAEqcc5qKX_0GCoi8ggPl7GDe4_9yTurmgACJg9rG9N3UVE6bJA9qC6ptwEAAwIAA3gAAzsE',
    studying: 'AgACAgQAAxkBAAEqcdBqKX_0u6OWK9_Fg0RhvQLd8gXqFAACJw9rG9N3UVHzW7dRAAGHirwBAAMCAAN4AAM7BA'
};

const maleNames = ['کوروش', 'داریوش', 'خشایار', 'اردشیر', 'بهرام', 'شاپور', 'انوشیروان', 'قباد', 'هرمز', 'جمشید', 'فریدون', 'سام', 'نریمان', 'رستم', 'سهراب', 'اسفندیار', 'آرش', 'کاوه', 'بابک', 'مازیار'];
const femaleNames = ['آتنا', 'آناهیتا', 'آرتمیس', 'رکسانا', 'پانته‌آ', 'هلن', 'کلئوپاترا', 'سمیرامیس', 'شهرزاد', 'پریسا', 'سارا', 'ماندانا', 'آتوسا', 'پروانه', 'شیرین', 'مریم', 'نگین', 'آوا', 'کتایون', 'گردآفرید'];

const childClasses = {
    warrior: { name: 'جنگجو', emoji: '⚔️', type: 'attack', bonus: 15, color: '🔴' },
    mage: { name: 'جادوگر', emoji: '🧙', type: 'magic', bonus: 15, color: '🔵' },
    guardian: { name: 'محافظ', emoji: '🛡️', type: 'defense', bonus: 15, color: '🟢' },
    hunter: { name: 'شکارچی', emoji: '🏹', type: 'hunt', bonus: 15, color: '🟤' },
    sage: { name: 'حکیم', emoji: '📜', type: 'xp', bonus: 10, color: '🟡' },
    prince: { name: 'شاهزاده', emoji: '👑', type: 'all', bonus: 20, color: '🟣' }
};

const evolutionPaths = {
    warrior: [
        { level: 1, name: 'سرباز', emoji: '⚔️', powerBonus: 10, skillName: 'نداره', skillChance: 0 },
        { level: 2, name: 'شوالیه', emoji: '🗡️', powerBonus: 25, skillName: 'ضربه انتقادی', skillChance: 0.20, xpNeeded: 50, itemNeeded: 'سنگ روح' },
        { level: 3, name: 'فرمانده', emoji: '⚔️👑', powerBonus: 50, skillName: 'فرماندهی', skillChance: 0.10, xpNeeded: 200, itemNeeded: 'کریستال قدرت' },
        { level: 4, name: 'ژنرال', emoji: '🏆', powerBonus: 100, skillName: 'ارتش شخصی', skillChance: 0.05, xpNeeded: 500, itemNeeded: 'گوهر آسمانی' },
        { level: 5, name: 'ژنرال افسانه‌ای', emoji: '🌟', powerBonus: 200, skillName: 'احضار ارتش ارواح', skillChance: 0.02, xpNeeded: 1000, itemNeeded: 'ستاره اساطیر' }
    ],
    mage: [
        { level: 1, name: 'جادوگر', emoji: '🧙', powerBonus: 10, skillName: 'نداره', skillChance: 0 },
        { level: 2, name: 'ساحر', emoji: '🔮', powerBonus: 25, skillName: 'طلسم رایگان', skillChance: 0.15, xpNeeded: 50, itemNeeded: 'سنگ روح' },
        { level: 3, name: 'آرش‌مجوس', emoji: '🧙‍♂️👑', powerBonus: 50, skillName: 'کنترل عناصر', skillChance: 0.10, xpNeeded: 200, itemNeeded: 'کریستال قدرت' },
        { level: 4, name: 'جادوگر اعظم', emoji: '📜', powerBonus: 100, skillName: 'احضار طوفان', skillChance: 0.05, xpNeeded: 500, itemNeeded: 'گوهر آسمانی' },
        { level: 5, name: 'خدای جادو', emoji: '🌟', powerBonus: 200, skillName: 'تغییر واقعیت', skillChance: 0.02, xpNeeded: 1000, itemNeeded: 'ستاره اساطیر' }
    ],
    guardian: [
        { level: 1, name: 'محافظ', emoji: '🛡️', powerBonus: 10, skillName: 'نداره', skillChance: 0 },
        { level: 2, name: 'نگهبان', emoji: '🏰', powerBonus: 25, skillName: 'سپر خانواده', skillChance: 0.15, xpNeeded: 50, itemNeeded: 'سنگ روح' },
        { level: 3, name: 'گارد سلطنتی', emoji: '🛡️👑', powerBonus: 50, skillName: 'فداکاری', skillChance: 0.10, xpNeeded: 200, itemNeeded: 'کریستال قدرت' },
        { level: 4, name: 'گارد جاویدان', emoji: '⚡', powerBonus: 100, skillName: 'جاودانگی', skillChance: 0.05, xpNeeded: 500, itemNeeded: 'گوهر آسمانی' },
        { level: 5, name: 'دیوار الهی', emoji: '🌟', powerBonus: 200, skillName: 'سپر مطلق', skillChance: 0.02, xpNeeded: 1000, itemNeeded: 'ستاره اساطیر' }
    ],
    hunter: [
        { level: 1, name: 'شکارچی', emoji: '🏹', powerBonus: 10, skillName: 'نداره', skillChance: 0 },
        { level: 2, name: 'تک‌تیرانداز', emoji: '🎯', powerBonus: 25, skillName: 'شکار خودکار', skillChance: 0.15, xpNeeded: 50, itemNeeded: 'سنگ روح' },
        { level: 3, name: 'شکارچی ارشد', emoji: '🏹👑', powerBonus: 50, skillName: 'شکار دشمنان کمیاب', skillChance: 0.10, xpNeeded: 200, itemNeeded: 'کریستال قدرت' },
        { level: 4, name: 'شکارچی افسانه‌ای', emoji: '🦅', powerBonus: 100, skillName: 'شکار اژدها', skillChance: 0.05, xpNeeded: 500, itemNeeded: 'گوهر آسمانی' },
        { level: 5, name: 'خدای شکار', emoji: '🌟', powerBonus: 200, skillName: 'شکار هر موجود', skillChance: 0.02, xpNeeded: 1000, itemNeeded: 'ستاره اساطیر' }
    ],
    sage: [
        { level: 1, name: 'حکیم', emoji: '📜', powerBonus: 5, skillName: 'نداره', skillChance: 0 },
        { level: 2, name: 'دانشمند', emoji: '📚', powerBonus: 15, skillName: 'آموزش سریع', skillChance: 0.20, xpNeeded: 50, itemNeeded: 'سنگ روح' },
        { level: 3, name: 'فیلسوف', emoji: '🧠', powerBonus: 30, skillName: 'خرد جمعی', skillChance: 0.15, xpNeeded: 200, itemNeeded: 'کریستال قدرت' },
        { level: 4, name: 'مورخ سلطنتی', emoji: '📜👑', powerBonus: 60, skillName: 'ثبت تاریخ', skillChance: 0.10, xpNeeded: 500, itemNeeded: 'گوهر آسمانی' },
        { level: 5, name: 'حکیم اساطیر', emoji: '🌟', powerBonus: 120, skillName: 'پیشگویی', skillChance: 0.05, xpNeeded: 1000, itemNeeded: 'ستاره اساطیر' }
    ]
};

const pregnancyData = { duration: 3, chance: 1.0, cooldown: 0 };
const childPersonalities = ['😇 مهربون', '😈 بی‌رحم', '👑 مغرور', '🐍 حیله‌گر', '🦁 شجاع', '🦊 زیرک', '😴 تنبل', '💕 عاشق‌پیشه'];

function initChildren(player) {
    if (!player.children) player.children = [];
    if (!player.pregnancies) player.pregnancies = [];
    if (!player.childSlots) player.childSlots = 3;
    return player.children;
}

function getRandomName(gender) {
    const names = gender === 'male' ? maleNames : femaleNames;
    return names[Math.floor(Math.random() * names.length)];
}

function getRandomGender() { return Math.random() < 0.5 ? 'male' : 'female'; }

function getRandomClass() {
    const classes = Object.keys(childClasses);
    const weights = { warrior: 30, mage: 15, guardian: 20, hunter: 20, sage: 10, prince: 5 };
    const total = Object.values(weights).reduce((a, b) => a + b, 0);
    let r = Math.random() * total;
    for (let cls of classes) { r -= weights[cls] || 0; if (r <= 0) return cls; }
    return 'warrior';
}

function checkPregnancy(player, npcId, isSpouse, position) {
    initChildren(player);
    if (player.children.length >= player.childSlots) return null;
    const now = Date.now();
    const chance = position === 'front' ? 1.0 : 0;
    if (Math.random() < chance) {
        const pregnancy = {
            id: 'preg_' + Date.now(), npcId, isSpouse, startedAt: now,
            dueDate: now + pregnancyData.duration * 24 * 60 * 60 * 1000,
            motherName: (config.images.npcs?.[npcId]?.name || config.images.enemies?.[npcId]?.name || npcId),
            motherEmoji: (config.images.npcs?.[npcId]?.emoji || config.images.enemies?.[npcId]?.emoji || '👤'), position
        };
        player.pregnancies.push(pregnancy);
        return pregnancy;
    }
    return null;
}

function checkBirths(player) {
    initChildren(player);
    const now = Date.now();
    const births = [];
    player.pregnancies = player.pregnancies.filter(pregnancy => {
        if (now >= pregnancy.dueDate) {
            const gender = getRandomGender();
            const className = getRandomClass();
            const classData = childClasses[className];
            const child = {
                id: 'child_' + Date.now() + '_' + Math.random().toString(36).substr(2, 5),
                name: getRandomName(gender), gender,
                emoji: gender === 'male' ? '👦' : '👧',
                class: className, classEmoji: classData.emoji, className: classData.name,
                motherId: pregnancy.npcId, motherName: pregnancy.motherName, motherEmoji: pregnancy.motherEmoji,
                isSpouse: pregnancy.isSpouse, bornAt: now, age: 0, ageStage: 'baby', stageEmoji: '👶',
                image: gender === 'male' ? childImages.training_boy : childImages.baby_girl,
                level: 1, evolutionLevel: 1, evolutionName: 'نوزاد',
                xp: 0, xpNeeded: 20,
                attack: Math.floor(Math.random() * 5) + 1, defense: Math.floor(Math.random() * 3) + 1,
                hp: Math.floor(Math.random() * 20) + 10, power: 5, loyalty: 100,
                isLegendary: Math.random() < 0.02, isHeir: false, isAlive: true,
                missions: [], lastMission: 0, skills: [],
                inventory: { food: 0, toys: 0, books: 0 }
            };
            if (child.isLegendary) {
                child.emoji = gender === 'male' ? '🌟👦' : '🌟👧';
                child.image = gender === 'male' ? childImages.warrior_boy : childImages.warrior_girl;
                child.power = 15; child.attack *= 3; child.defense *= 3; child.hp *= 3;
                child.class = 'prince'; child.classEmoji = '👑'; child.className = 'شاهزاده';
            }
            player.children.push(child);
            births.push(child);
            return false;
        }
        return true;
    });
    return births;
}

function updateChildAges(player) {
    initChildren(player);
    const now = Date.now();
    const updates = [];
    for (let child of player.children) {
        if (!child.isAlive) continue;
        const daysOld = Math.floor((now - child.bornAt) / (24 * 60 * 60 * 1000));
        const oldStage = child.ageStage;
        if (daysOld !== child.age) {
            child.age = daysOld;
            if (daysOld < 3) { child.ageStage = 'baby'; child.stageEmoji = '👶'; child.evolutionName = 'نوزاد'; child.image = child.gender === 'male' ? childImages.training_boy : childImages.baby_girl; }
            else if (daysOld < 6) { child.ageStage = 'child'; child.stageEmoji = '🧒'; child.evolutionName = 'کودک'; child.power = 10; child.image = childImages.studying; }
            else if (daysOld < 9) { child.ageStage = 'teen'; child.stageEmoji = '🧑'; child.evolutionName = 'نوجوان'; child.power = 15; child.image = child.gender === 'male' ? childImages.training_boy2 : childImages.warrior_girl; }
            else if (daysOld < 20) { child.ageStage = 'adult'; child.stageEmoji = '👨'; child.evolutionName = 'جوان'; child.power = 25; child.image = child.gender === 'male' ? childImages.warrior_boy : childImages.desert_girl; }
            else if (daysOld < 40) { child.ageStage = 'mature'; child.stageEmoji = '👨‍🦳'; child.evolutionName = 'میانسال'; child.power = 35; }
            else { child.ageStage = 'elder'; child.stageEmoji = '👴'; child.evolutionName = 'بزرگسال'; child.power = 50; }
            if (oldStage !== child.ageStage) {
                updates.push({ child, oldStage, newStage: child.ageStage, message: `🎂 ${child.emoji} *${child.name}* وارد مرحله ${child.evolutionName} شد!` });
            }
        }
    }
    return updates;
}

function feedChild(player, childId) {
    initChildren(player);
    const child = player.children.find(c => c.id === childId);
    if (!child || !child.isAlive) return { success: false, message: '❌ این فرزند پیدا نشد!' };
    if ((player.energy || 0) < 5) return { success: false, message: '❌ انرژی کافی نداری! (نیاز: ۵⚡)' };
    player.energy -= 5;
    child.xp += 10;
    child.inventory.food++;
    child.loyalty = Math.min(100, child.loyalty + 2);
    const evolutionResult = checkEvolution(player, child);
    return {
        success: true,
        message: `🍼 ${child.emoji} *${child.name}* غذا خورد!\n✨ +۱۰ XP\n💕 وفاداری: ${child.loyalty}${evolutionResult ? '\n\n' + evolutionResult.message : ''}`,
        image: child.image, evolution: evolutionResult
    };
}

function trainChild(player, childId) {
    initChildren(player);
    const child = player.children.find(c => c.id === childId);
    if (!child || !child.isAlive) return { success: false, message: '❌ این فرزند پیدا نشد!' };
    if (child.ageStage === 'baby') return { success: false, message: '❌ بچه هنوز نوزاده!' };
    if ((player.inventory?.gold || 0) < 20) return { success: false, message: '❌ طلا کافی نداری! (نیاز: ۲۰👑)' };
    player.inventory.gold -= 20;
    child.xp += 20;
    child.attack += Math.floor(Math.random() * 3) + 1;
    child.defense += Math.floor(Math.random() * 2) + 1;
    child.power += Math.floor(Math.random() * 3) + 1;
    child.inventory.books++;
    child.loyalty = Math.min(100, child.loyalty + 5);
    const evolutionResult = checkEvolution(player, child);
    return {
        success: true,
        message: `📚 ${child.emoji} *${child.name}* آموزش دید!\n⚔️ +${child.attack} حمله\n🛡️ +${child.defense} دفاع\n✨ +۲۰ XP${evolutionResult ? '\n\n' + evolutionResult.message : ''}`,
        image: childImages.training_boy, evolution: evolutionResult
    };
}

function checkEvolution(player, child) {
    if (!child || !child.isAlive) return null;
    const path = evolutionPaths[child.class];
    if (!path) return null;
    const currentLevel = child.evolutionLevel || 1;
    const nextLevel = path.find(p => p.level === currentLevel + 1);
    if (!nextLevel) return null;
    if (child.xp >= nextLevel.xpNeeded) {
        const hasItem = child.isLegendary || (player.inventory && player.inventory[nextLevel.itemNeeded] && player.inventory[nextLevel.itemNeeded] > 0);
        if (hasItem && !child.isLegendary) player.inventory[nextLevel.itemNeeded]--;
        if (hasItem || child.isLegendary) {
            child.evolutionLevel = nextLevel.level;
            child.evolutionName = nextLevel.name;
            child.power += nextLevel.powerBonus;
            child.attack += Math.floor(nextLevel.powerBonus * 0.7);
            child.defense += Math.floor(nextLevel.powerBonus * 0.5);
            child.hp += nextLevel.powerBonus;
            if (nextLevel.skillName !== 'نداره') {
                child.skills.push({ name: nextLevel.skillName, chance: nextLevel.skillChance, level: nextLevel.level });
            }
            return { child, level: nextLevel.level, name: nextLevel.name, message: `⚡ ${child.emoji} *${child.name}* ارتقا یافت!\n🏆 ${nextLevel.name}\n💪 +${nextLevel.powerBonus} قدرت\n🎯 مهارت جدید: ${nextLevel.skillName}` };
        } else {
            return { needItem: true, itemName: nextLevel.itemNeeded, message: `🔒 ${child.emoji} *${child.name}* آماده ارتقاست!\n📦 نیاز به: ${nextLevel.itemNeeded}\n✨ XP: ${child.xp}/${nextLevel.xpNeeded}` };
        }
    }
    return null;
}

function assignHeir(player, childId) {
    initChildren(player);
    const child = player.children.find(c => c.id === childId);
    if (!child || !child.isAlive) return { success: false, message: '❌ این فرزند پیدا نشد!' };
    if (child.ageStage === 'baby' || child.ageStage === 'child') return { success: false, message: '❌ بچه هنوز خیلی کوچیکه!' };
    for (let c of player.children) { if (c.isHeir) c.isHeir = false; }
    child.isHeir = true;
    child.power += 10;
    child.loyalty = Math.min(100, child.loyalty + 20);
    return { success: true, message: `👑 ${child.emoji} *${child.name}* ولیعهد امپراطوری شد!\n💪 +۱۰ قدرت\n💕 وفاداری: ${child.loyalty}` };
}

function childBattleHelp(player) {
    if (!player.children || player.children.length === 0) return { helped: false };
    const adultChildren = player.children.filter(c => c.isAlive && (c.ageStage === 'teen' || c.ageStage === 'adult' || c.ageStage === 'mature' || c.ageStage === 'elder'));
    if (adultChildren.length === 0) return { helped: false };
    if (Math.random() < 0.15) {
        const child = adultChildren[Math.floor(Math.random() * adultChildren.length)];
        const damage = Math.floor(child.attack * 1.5);
        let skillUsed = null;
        for (let skill of child.skills) { if (Math.random() < skill.chance) { skillUsed = skill; break; } }
        const extraMessage = skillUsed ? `\n🎯 ${skillUsed.name} فعال شد!` : '';
        return { helped: true, child, damage, skillUsed, message: `👶 ${child.emoji} *${child.name}* به کمکت اومد! +${damage} ⚔️${extraMessage}` };
    }
    return { helped: false };
}

function tournamentFight(child1, child2) {
    if (!child1 || !child2) return { winner: child1 || child2 };
    const power1 = child1.power + child1.attack * 2 + child1.defense * 1.5 + (child1.isLegendary ? 50 : 0) + (child1.isHeir ? 20 : 0);
    const power2 = child2.power + child2.attack * 2 + child2.defense * 1.5 + (child2.isLegendary ? 50 : 0) + (child2.isHeir ? 20 : 0);
    const totalPower = power1 + power2;
    const chance1 = power1 / totalPower;
    const winner = Math.random() < chance1 ? child1 : child2;
    const loser = winner === child1 ? child2 : child1;
    loser.power = Math.max(1, Math.floor(loser.power * 0.9));
    loser.loyalty = Math.max(0, loser.loyalty - 10);
    winner.power += Math.floor(winner.power * 0.05);
    winner.xp += 20;
    return { winner, loser, message: `⚔️ *${winner.emoji} ${winner.name}* برنده شد!\n💪 +${Math.floor(winner.power * 0.05)} قدرت\n💔 *${loser.emoji} ${loser.name}* باخت (-۱۰٪ قدرت)` };
}

function holdTournament(player) {
    initChildren(player);
    const fighters = player.children.filter(c => c.isAlive && (c.ageStage === 'adult' || c.ageStage === 'mature' || c.ageStage === 'elder'));
    if (fighters.length < 2) return { success: false, message: '❌ حداقل ۲ فرزند بالغ لازمه!' };
    const results = [];
    let roundFighters = [...fighters];
    let round = 1;
    while (roundFighters.length > 1) {
        const nextRound = [];
        results.push({ round, fights: [] });
        roundFighters = roundFighters.sort(() => Math.random() - 0.5);
        for (let i = 0; i < roundFighters.length; i += 2) {
            if (i + 1 < roundFighters.length) {
                const fight = tournamentFight(roundFighters[i], roundFighters[i + 1]);
                results[results.length - 1].fights.push(fight);
                nextRound.push(fight.winner);
            } else { nextRound.push(roundFighters[i]); }
        }
        roundFighters = nextRound;
        round++;
    }
    const champion = roundFighters[0];
    assignHeir(player, champion.id);
    champion.power += 25;
    let message = `⚔️🏆 *تورنمنت امپراطوری!*\n\n`;
    for (let r of results) { message += `📋 *مرحله ${r.round}:*\n`; for (let f of r.fights) { message += `${f.message}\n`; } message += '\n'; }
    message += `👑 *قهرمان:* ${champion.emoji} ${champion.name}\n💪 قدرت: ${champion.power} | ⚔️ ${champion.attack} | 🛡️ ${champion.defense}\n🌟 ${champion.isLegendary ? 'افسانه‌ای!' : 'معمولی'}`;
    return { success: true, champion, results, message };
}

function childDies(player, childId, reason) {
    initChildren(player);
    const child = player.children.find(c => c.id === childId);
    if (!child) return { success: false, message: '❌ فرزند پیدا نشد!' };
    child.isAlive = false;
    child.deathReason = reason;
    child.diedAt = Date.now();
    if (child.isHeir) {
        child.isHeir = false;
        const aliveChildren = player.children.filter(c => c.isAlive && c.id !== childId);
        if (aliveChildren.length > 0) { const eldest = aliveChildren.sort((a, b) => b.age - a.age)[0]; assignHeir(player, eldest.id); }
    }
    return { success: true, message: `💀 ${child.emoji} *${child.name}* فوت کرد...\n📝 دلیل: ${reason}\n🕊️ روحش در آرامش...` };
}

function formatChildren(player) {
    initChildren(player);
    if (!player.children || player.children.length === 0) return '👶 *فرزندان*\n\n❌ هیچ فرزندی نداری!\n💡 ازدواج کن و از جلو عیاشی کن تا بچه‌دار بشی.';
    let msg = '👶 *فرزندان امپراطوری*\n\n';
    const alive = player.children.filter(c => c.isAlive);
    const dead = player.children.filter(c => !c.isAlive);
    for (let i = 0; i < alive.length; i++) {
        const child = alive[i];
        msg += `${child.emoji} *${child.name}* `;
        if (child.isLegendary) msg += '🌟 ';
        if (child.isHeir) msg += '👑 ';
        msg += `| ${child.classEmoji} ${child.className}\n`;
        msg += `   🎂 ${child.age} روزه | ${child.stageEmoji} ${child.evolutionName}\n`;
        msg += `   ⚡ سطح ${child.evolutionLevel} | ✨ ${child.xp} XP\n`;
        msg += `   ⚔️ ${child.attack} | 🛡️ ${child.defense} | ❤️ ${child.hp}\n`;
        msg += `   💪 قدرت: ${child.power} | 💕 وفاداری: ${child.loyalty}%\n`;
        msg += `   👩 مادر: ${child.motherEmoji} ${child.motherName}\n`;
        if (child.skills.length > 0) { msg += '   🎯 مهارت‌ها: '; for (let skill of child.skills) { msg += `${skill.name}, `; } msg = msg.slice(0, -2) + '\n'; }
        msg += '\n';
    }
    if (dead.length > 0) { msg += '🕊️ *درگذشتگان:*\n'; for (let child of dead) { msg += `   💀 ${child.name} - ${child.deathReason || 'نامعلوم'}\n`; } msg += '\n'; }
    if (player.pregnancies && player.pregnancies.length > 0) {
        msg += '🤰 *بارداری‌ها:*\n';
        for (let preg of player.pregnancies) {
            const remaining = Math.max(0, Math.ceil((preg.dueDate - Date.now()) / (24 * 60 * 60 * 1000)));
            msg += `   ${preg.motherEmoji} ${preg.motherName}: ${remaining} روز مونده\n`;
        }
        msg += '\n';
    }
    msg += `👥 ${alive.length}/${player.childSlots} فرزند زنده`;
    return msg;
}

function getChildrenKeyboard(player) {
    const buttons = [];
    if (player.children && player.children.length > 0) {
        const alive = player.children.filter(c => c.isAlive);
        for (let child of alive) {
            buttons.push([{ text: `🍼 غذا بده به ${child.emoji} ${child.name}`, callback_data: `child_feed_${child.id}` }]);
            buttons.push([{ text: `📚 آموزش بده به ${child.emoji} ${child.name}`, callback_data: `child_train_${child.id}` }]);
        }
        if (alive.length >= 2) {
            buttons.push([{ text: '⚔️ تورنمنت امپراطوری', callback_data: 'child_tournament' }]);
        }
        const adults = alive.filter(c => c.ageStage === 'adult' || c.ageStage === 'mature' || c.ageStage === 'elder');
        for (let child of adults) {
            if (!child.isHeir) {
                buttons.push([{ text: `👑 ولیعهد کن ${child.emoji} ${child.name}`, callback_data: `child_heir_${child.id}` }]);
            }
        }
    }
    buttons.push([{ text: '🔙 برگشت', callback_data: 'empire_back' }]);
    return { reply_markup: { inline_keyboard: buttons } };
}

function getChildBattleBonus(player) {
    if (!player.children) return 0;
    const adultChildren = player.children.filter(c => c.isAlive && (c.ageStage === 'teen' || c.ageStage === 'adult' || c.ageStage === 'mature' || c.ageStage === 'elder'));
    return adultChildren.reduce((sum, c) => sum + Math.floor(c.attack * 0.3), 0);
}

function assignPersonality(child) {
    if (!child.personality) { child.personality = childPersonalities[Math.floor(Math.random() * childPersonalities.length)]; }
    return child.personality;
}

function getRandomChildRequest(player) {
    initChildren(player);
    const alive = player.children.filter(c => c.isAlive && c.ageStage !== 'baby');
    if (alive.length === 0) return null;
    const child = alive[Math.floor(Math.random() * alive.length)];
    assignPersonality(child);
    const requests = {
        '😇 مهربون': [
            { text: `👶 ${child.emoji} *${child.name}*: "پدر، می‌خوام به مردم گرسنه کمک کنم 🍞"`, cost: { food: 50 }, reward: { loyalty: 10, happiness: 5 } },
            { text: `👶 ${child.emoji} *${child.name}*: "می‌خوام برایت یه هدیه بسازم 🎁"`, cost: { wood: 10, stone: 5 }, reward: { loyalty: 15 } }
        ],
        '😈 بی‌رحم': [
            { text: `👶 ${child.emoji} *${child.name}*: "بذار دشمنانمون رو اعدام کنم 💀"`, cost: {}, reward: { loyalty: 5, military: 10 } },
            { text: `👶 ${child.emoji} *${child.name}*: "می‌خوام با برادرم بجنگم ⚔️"`, cost: {}, reward: { power: 5 } }
        ],
        '👑 مغرور': [
            { text: `👶 ${child.emoji} *${child.name}*: "من لایق تاج هستم! 👑"`, cost: { gold: 100 }, reward: { loyalty: 20 } },
            { text: `👶 ${child.emoji} *${child.name}*: "یه اسب سفید می‌خوام 🐴"`, cost: { gold: 50, meat: 20 }, reward: { power: 10 } }
        ],
        '🐍 حیله‌گر': [
            { text: `👶 ${child.emoji} *${child.name}*: "یه نقشه مخفی دارم... 🤫"`, cost: {}, reward: { intelligence: 10 } },
            { text: `👶 ${child.emoji} *${child.name}*: "بذار جاسوسی کنم 🕵️"`, cost: { gold: 20 }, reward: { info: true } }
        ],
        '🦁 شجاع': [
            { text: `👶 ${child.emoji} *${child.name}*: "بذار برم شکار اژدها! 🐉"`, cost: {}, reward: { xp: 50, risk: true } },
            { text: `👶 ${child.emoji} *${child.name}*: "من آماده نبردم! ⚔️"`, cost: {}, reward: { attack: 5 } }
        ],
        '🦊 زیرک': [
            { text: `👶 ${child.emoji} *${child.name}*: "یه معامله خوب بلدم 💰"`, cost: { gold: 30 }, reward: { gold: 80 } },
            { text: `👶 ${child.emoji} *${child.name}*: "می‌تونم مالیات رو بیشتر کنم 📊"`, cost: {}, reward: { gold: 50, happiness: -5 } }
        ],
        '😴 تنبل': [
            { text: `👶 ${child.emoji} *${child.name}*: "حوصله ندارم... 😴"`, cost: {}, reward: {} },
            { text: `👶 ${child.emoji} *${child.name}*: "بذار امروز استراحت کنم 🛏️"`, cost: { energy: 10 }, reward: { loyalty: 5 } }
        ],
        '💕 عاشق‌پیشه': [
            { text: `👶 ${child.emoji} *${child.name}*: "عاشق یه دختر شدم... 💕"`, cost: { ring: 1 }, reward: { loyalty: 20, happiness: 10 } },
            { text: `👶 ${child.emoji} *${child.name}*: "می‌خوام ازدواج کنم! 💍"`, cost: { gold: 200 }, reward: { loyalty: 30 } }
        ]
    };
    const childRequests = requests[child.personality] || requests['😇 مهربون'];
    const request = childRequests[Math.floor(Math.random() * childRequests.length)];
    return { child, request, personality: child.personality };
}

function getPregnancyImage() {
    const images = [childImages.pregnant_queen, childImages.pregnant_queen2, childImages.pregnant_woman, childImages.fetus];
    return images[Math.floor(Math.random() * images.length)];
}

function getBirthImage() {
    const images = [childImages.baby_girl, childImages.baby_girl2, childImages.breastfeeding];
    return images[Math.floor(Math.random() * images.length)];
}

function getChildImage(child) {
    if (child.image) return child.image;
    if (child.gender === 'male') return childImages.warrior_boy;
    return childImages.baby_girl;
}

function handleChildRequest(player, childId, accepted) {
    initChildren(player);
    const child = player.children.find(c => c.id === childId);
    if (!child || !child.isAlive) return { success: false, message: '❌ فرزند پیدا نشد!' };
    if (accepted) {
        if (child.personality === '😇 مهربون') { child.loyalty = Math.min(100, child.loyalty + 15); if (player.people && player.people.stats) player.people.stats.happiness = Math.min(100, (player.people.stats.happiness || 50) + 5); return { success: true, message: `✅ ${child.emoji} *${child.name}* خوشحال شد!\n💕 وفاداری +۱۵\n😊 خوشبختی مردم +۵` }; }
        else if (child.personality === '😈 بی‌رحم') { child.power += 5; child.loyalty = Math.min(100, child.loyalty + 5); return { success: true, message: `✅ ${child.emoji} *${child.name}* قوی‌تر شد!\n💪 قدرت +۵\n💕 وفاداری +۵` }; }
        else if (child.personality === '👑 مغرور') { child.loyalty = Math.min(100, child.loyalty + 20); child.power += 3; return { success: true, message: `✅ ${child.emoji} *${child.name}* راضی شد!\n💕 وفاداری +۲۰\n💪 قدرت +۳` }; }
        else if (child.personality === '🦁 شجاع') { child.xp += 50; child.attack += 5; return { success: true, message: `✅ ${child.emoji} *${child.name}* به نبرد رفت!\n✨ +۵۰ XP\n⚔️ +۵ حمله` }; }
        else if (child.personality === '🦊 زیرک') { player.inventory.gold = (player.inventory.gold || 0) + 50; return { success: true, message: `✅ ${child.emoji} *${child.name}* معامله کرد!\n💰 +۵۰ طلا` }; }
        else if (child.personality === '💕 عاشق‌پیشه') { child.loyalty = Math.min(100, child.loyalty + 25); return { success: true, message: `✅ ${child.emoji} *${child.name}* عاشق شده!\n💕 وفاداری +۲۵` }; }
        else { child.loyalty = Math.min(100, child.loyalty + 10); return { success: true, message: `✅ ${child.emoji} *${child.name}* خوشحال شد!\n💕 وفاداری +۱۰` }; }
    } else {
        child.loyalty = Math.max(0, child.loyalty - 15);
        return { success: true, message: `❌ ${child.emoji} *${child.name}* ناراحت شد...\n💕 وفاداری -۱۵` };
    }
}

module.exports = {
    childImages, childClasses, evolutionPaths, maleNames, femaleNames, childPersonalities, pregnancyData,
    initChildren, getRandomName, getRandomGender, getRandomClass,
    checkPregnancy, checkBirths, updateChildAges,
    feedChild, trainChild, checkEvolution, assignHeir,
    childBattleHelp, tournamentFight, holdTournament, childDies,
    formatChildren, getChildrenKeyboard, getChildBattleBonus,
    assignPersonality, getRandomChildRequest, handleChildRequest,
    getPregnancyImage, getBirthImage, getChildImage
};