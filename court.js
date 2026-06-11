const config = require('./config');
const { initChildren } = require('./offspring');
const { initEmpire } = require('./empire');

// انواع دسیسه‌ها
const intrigueTypes = {
    poison: {
        name: 'مسمومیت', emoji: '🧪', description: 'هدف رو با سم از پای دربیار',
        requiredClass: 'mage', successChance: 0.40, caughtChance: 0.35,
        effects: { targetHp: -50, targetLoyalty: -30 },
        failureEffects: { selfPower: -20 }
    },
    coup: {
        name: 'کودتا', emoji: '🗡️', description: 'قدرت رو به زور بگیر',
        requiredClass: 'warrior', successChance: 0.30, caughtChance: 0.50,
        effects: { becomeEmperor: true, loseScore: -500, loseGold: -1000 },
        failureEffects: { selfDeath: true, supporterPower: -30 }
    },
    seduction: {
        name: 'اغواگری', emoji: '💋', description: 'با ملکه رابطه برقرار کن',
        requiredClass: null, successChance: 0.35, caughtChance: 0.45,
        effects: { queenLoyalty: -50, heirLoyalty: -20 },
        failureEffects: { selfLoyalty: -40, publicShame: true }
    },
    bribery: {
        name: 'رشوه', emoji: '💰', description: 'به مقامات رشوه بده',
        requiredClass: 'sage', successChance: 0.50, caughtChance: 0.25,
        effects: { bribeTarget: true, loseGold: -200 },
        failureEffects: { loseGold: -200, selfLoyalty: -20 }
    },
    rumor: {
        name: 'شایعه‌پراکنی', emoji: '🗣️', description: 'اعتبار رقیب رو نابود کن',
        requiredClass: null, successChance: 0.45, caughtChance: 0.30,
        effects: { targetPrestige: -30 },
        failureEffects: { selfPrestige: -20 }
    },
    sabotage: {
        name: 'خرابکاری', emoji: '💣', description: 'اموال رقیب رو نابود کن',
        requiredClass: 'hunter', successChance: 0.40, caughtChance: 0.35,
        effects: { targetResources: -100 },
        failureEffects: { selfResources: -50, jailTime: 3 }
    }
};

// سیستم زندانی درباری
const prisonSystem = {
    maxPrisoners: 10,
    escapeChance: 0.15,
    executionCost: 10,
    releaseCost: 50
};

// رویدادهای درباری
const courtEvents = [
    {
        id: 'assassination_attempt',
        name: 'سوءقصد',
        emoji: '🎯',
        description: 'یه سوءقصد به جون امپراطور!',
        choices: [
            { text: '🛡️ محافظت بیشتر', effect: { safety: 10, gold: -50 } },
            { text: '🔍 تحقیق', effect: { justice: 15, gold: -30 } },
            { text: '😡 اعدام مظنونین', effect: { safety: 20, happiness: -15 } }
        ]
    },
    {
        id: 'foreign_ambassador',
        name: 'سفیر خارجی',
        emoji: '🌍',
        description: 'سفیر یه امپراطوری دیگه اومده!',
        choices: [
            { text: '🤝 استقبال', effect: { prestige: 10, gold: -100 } },
            { text: '😐 بی‌تفاوت', effect: { prestige: -5 } },
            { text: '🚫 اخراج', effect: { military: 10, prestige: -20 } }
        ]
    },
    {
        id: 'corruption_scandal',
        name: 'رسوایی فساد',
        emoji: '📰',
        description: 'فساد توی دربار لو رفته!',
        choices: [
            { text: '⚖️ محاکمه', effect: { justice: 20, gold: 100 } },
            { text: '🤫 سرپوش', effect: { justice: -10, gold: -50 } },
            { text: '😡 اعدام', effect: { justice: 15, happiness: -10 } }
        ]
    },
    {
        id: 'rebel_lord',
        name: 'لرد شورشی',
        emoji: '⚔️',
        description: 'یه لرد شورش کرده!',
        choices: [
            { text: '⚔️ حمله', effect: { military: 15, population: -20 } },
            { text: '🤝 مذاکره', effect: { gold: -200, happiness: 10 } },
            { text: '🔒 محاصره', effect: { military: 5, food: -50 } }
        ]
    },
    {
        id: 'mysterious_prophecy',
        name: 'پیشگویی مرموز',
        emoji: '🔮',
        description: 'یه پیشگو خبر از آینده میده...',
        choices: [
            { text: '👂 گوش کن', effect: { faith: 15, gold: -50 } },
            { text: '😂 مسخره کن', effect: { faith: -10 } },
            { text: '🚫 تبعید', effect: { faith: -5, justice: 5 } }
        ]
    }
];

function initCourt(player) {
    if (!player.court) {
        player.court = {
            prisoners: [],
            scandals: [],
            recentEvents: [],
            lastEvent: 0,
            intrigueCooldowns: {},
            alertLevel: 0
        };
    }
    return player.court;
}

function getCourtStats(player) {
    initCourt(player);
    initEmpire(player);

    return {
        prisoners: player.court.prisoners.length,
        scandals: player.court.scandals.length,
        alertLevel: player.court.alertLevel,
        maxPrisoners: prisonSystem.maxPrisoners
    };
}

function performIntrigue(player, intrigueKey, targetId, performerId) {
    initCourt(player);
    initChildren(player);

    const intrigue = intrigueTypes[intrigueKey];
    if (!intrigue) return { success: false, message: '❌ دسیسه نامعتبر!' };

    // چک کول‌داون
    const now = Date.now();
    if (player.court.intrigueCooldowns[intrigueKey] && now - player.court.intrigueCooldowns[intrigueKey] < 24 * 60 * 60 * 1000) {
        return { success: false, message: '⏰ باید ۲۴ ساعت صبر کنی!' };
    }

    const performer = player.children?.find(c => c.id === performerId && c.isAlive);
    if (!performer) return { success: false, message: '❌ مجری پیدا نشد!' };

    if (intrigue.requiredClass && performer.class !== intrigue.requiredClass) {
        return { success: false, message: `❌ فقط ${intrigue.requiredClass}ها می‌تونن!` };
    }

    const target = player.children?.find(c => c.id === targetId && c.isAlive);
    if (!target) return { success: false, message: '❌ هدف پیدا نشد!' };

    if (target.id === performer.id) return { success: false, message: '❌ نمی‌تونی خودت رو هدف بگیری!' };

    player.court.intrigueCooldowns[intrigueKey] = now;

    // محاسبه شانس موفقیت
    let successChance = intrigue.successChance;
    successChance += (performer.power - target.power) / 100;
    successChance += player.court.alertLevel < 50 ? 0.10 : -0.10;
    successChance = Math.min(0.90, Math.max(0.10, successChance));

    if (Math.random() < successChance) {
        // موفقیت
        let message = `${intrigue.emoji} *${intrigue.name}* موفق!\n\n`;

        if (intrigue.effects.targetHp) {
            target.hp = Math.max(1, target.hp + intrigue.effects.targetHp);
            message += `💔 ${target.emoji} ${target.name}: ${intrigue.effects.targetHp} HP\n`;
        }
        if (intrigue.effects.targetLoyalty) {
            target.loyalty = Math.max(0, target.loyalty + intrigue.effects.targetLoyalty);
            message += `💕 وفاداری ${target.name}: ${intrigue.effects.targetLoyalty}\n`;
        }
        if (intrigue.effects.loseGold) {
            player.inventory.gold = Math.max(0, (player.inventory.gold || 0) + intrigue.effects.loseGold);
            message += `👑 ${intrigue.effects.loseGold} طلا\n`;
        }

        // افزایش سطح هشدار
        player.court.alertLevel = Math.min(100, player.court.alertLevel + 15);

        return { success: true, caught: false, message };
    } else {
        // شکست
        let message = `❌ *${intrigue.name}* ناموفق!\n\n`;

        // شانس لو رفتن
        if (Math.random() < intrigue.caughtChance) {
            if (intrigue.failureEffects.selfDeath) {
                performer.isAlive = false;
                performer.deathReason = 'اعدام به جرم خیانت';
                message += `💀 ${performer.emoji} ${performer.name} اعدام شد!\n`;
            } else {
                performer.loyalty = Math.max(0, performer.loyalty + (intrigue.failureEffects.selfLoyalty || 0));
                performer.power = Math.max(1, performer.power + (intrigue.failureEffects.selfPower || 0));

                if (intrigue.failureEffects.jailTime) {
                    player.court.prisoners.push({
                        childId: performer.id,
                        name: performer.name,
                        emoji: performer.emoji,
                        jailedAt: now,
                        releaseAt: now + intrigue.failureEffects.jailTime * 24 * 60 * 60 * 1000,
                        reason: intrigue.name
                    });
                    message += `🔒 ${performer.emoji} ${performer.name} زندانی شد!\n`;
                }

                message += `🚨 ${performer.emoji} ${performer.name} لو رفت!\n`;
            }

            player.court.scandals.push({
                intrigue: intrigueKey,
                performer: performer.name,
                target: target.name,
                date: now,
                success: false
            });

            return { success: false, caught: true, message };
        }

        message += `🍀 خوش‌شانسانه کسی نفهمید...`;
        return { success: false, caught: false, message };
    }
}

function queenIntrigue(player, queenId, targetQueenId, intrigueType) {
    initCourt(player);

    if (!player.house || player.house.length < 2) {
        return { success: false, message: '❌ حداقل ۲ ملکه لازمه!' };
    }

    const queen = player.house.find(h => h.npcId === queenId);
    const target = player.house.find(h => h.npcId === targetQueenId);

    if (!queen || !target) return { success: false, message: '❌ ملکه پیدا نشد!' };
    if (queen.npcId === target.npcId) return { success: false, message: '❌ نمی‌تونه خودش رو هدف بگیره!' };

    const points = (player.prisonRelations && player.prisonRelations[queen.npcId]) || 0;

    const queenIntrigues = {
        poison: {
            name: 'مسمومیت',
            emoji: '🧪',
            successChance: 0.35,
            effects: { targetRemoved: true, myRelation: -30 },
            failureEffects: { myRemoved: true }
        },
        rumor: {
            name: 'شایعه',
            emoji: '🗣️',
            successChance: 0.50,
            effects: { targetRelation: -40, myRelation: 10 },
            failureEffects: { myRelation: -20 }
        },
        seduce_heir: {
            name: 'اغوای ولیعهد',
            emoji: '💋',
            successChance: 0.25,
            effects: { heirLoyalty: -50, myRelation: 30 },
            failureEffects: { myRemoved: true, publicShame: true }
        }
    };

    const intrigue = queenIntrigues[intrigueType];
    if (!intrigue) return { success: false, message: '❌ دسیسه نامعتبر!' };

    if (Math.random() < intrigue.successChance) {
        let message = `${intrigue.emoji} *${intrigue.name}* موفق!\n`;
        message += `👸 ${queen.emoji} ${queen.name} علیه ${target.emoji} ${target.name}\n\n`;

        if (intrigue.effects.targetRemoved) {
            const index = player.house.findIndex(h => h.npcId === targetQueenId);
            if (index > -1) {
                player.house.splice(index, 1);
                message += `💀 ${target.emoji} ${target.name} از دربار حذف شد!\n`;
            }
        }
        if (intrigue.effects.targetRelation) {
            if (!player.prisonRelations) player.prisonRelations = {};
            player.prisonRelations[targetQueenId] = Math.max(0, (player.prisonRelations[targetQueenId] || 0) + intrigue.effects.targetRelation);
            message += `💕 رابطه ${target.name}: ${intrigue.effects.targetRelation}\n`;
        }
        if (intrigue.effects.myRelation) {
            if (!player.prisonRelations) player.prisonRelations = {};
            player.prisonRelations[queenId] = Math.min(100, (player.prisonRelations[queenId] || 0) + intrigue.effects.myRelation);
            message += `💕 رابطه ${queen.name}: +${intrigue.effects.myRelation}\n`;
        }

        return { success: true, message };
    } else {
        if (intrigue.failureEffects.myRemoved) {
            const index = player.house.findIndex(h => h.npcId === queenId);
            if (index > -1) {
                player.house.splice(index, 1);
            }
            return { success: false, message: `🚨 ${queen.emoji} ${queen.name} لو رفت و اخراج شد!` };
        }

        if (!player.prisonRelations) player.prisonRelations = {};
        player.prisonRelations[queenId] = Math.max(0, (player.prisonRelations[queenId] || 0) + (intrigue.failureEffects.myRelation || 0));

        return { success: false, message: `❌ ${intrigue.name} ناموفق بود. ${queen.name} تنزل کرد.` };
    }
}

function managePrisoners(player, action, prisonerIndex) {
    initCourt(player);

    if (action === 'list') {
        if (player.court.prisoners.length === 0) {
            return { success: false, message: '🔒 زندان درباری خالیه!' };
        }

        let message = '🔒 *زندانیان درباری*\n\n';
        const now = Date.now();

        for (let i = 0; i < player.court.prisoners.length; i++) {
            const p = player.court.prisoners[i];
            const remaining = Math.max(0, Math.ceil((p.releaseAt - now) / (24 * 60 * 60 * 1000)));
            message += `${i + 1}. ${p.emoji} ${p.name}\n`;
            message += `   📝 ${p.reason}\n`;
            message += `   ⏰ ${remaining} روز مونده\n\n`;
        }

        return { success: true, message };
    }

    if (action === 'execute' && prisonerIndex !== undefined) {
        const prisoner = player.court.prisoners[prisonerIndex];
        if (!prisoner) return { success: false, message: '❌ زندانی پیدا نشد!' };

        if ((player.inventory?.gold || 0) < prisonSystem.executionCost) {
            return { success: false, message: `❌ طلا کافی نیست! (نیاز: ${prisonSystem.executionCost}👑)` };
        }

        player.inventory.gold -= prisonSystem.executionCost;

        const child = player.children?.find(c => c.id === prisoner.childId);
        if (child) {
            child.isAlive = false;
            child.deathReason = 'اعدام';
        }

        player.court.prisoners.splice(prisonerIndex, 1);
        player.court.alertLevel = Math.max(0, player.court.alertLevel - 10);

        return { success: true, message: `💀 ${prisoner.emoji} ${prisoner.name} اعدام شد!\n👑 -${prisonSystem.executionCost} طلا` };
    }

    if (action === 'release' && prisonerIndex !== undefined) {
        const prisoner = player.court.prisoners[prisonerIndex];
        if (!prisoner) return { success: false, message: '❌ زندانی پیدا نشد!' };

        if ((player.inventory?.gold || 0) < prisonSystem.releaseCost) {
            return { success: false, message: `❌ طلا کافی نیست! (نیاز: ${prisonSystem.releaseCost}👑)` };
        }

        player.inventory.gold -= prisonSystem.releaseCost;

        const child = player.children?.find(c => c.id === prisoner.childId);
        if (child) {
            child.loyalty = Math.min(100, child.loyalty + 30);
        }

        player.court.prisoners.splice(prisonerIndex, 1);

        return { success: true, message: `🔓 ${prisoner.emoji} ${prisoner.name} آزاد شد!\n💕 وفاداری +۳۰\n👑 -${prisonSystem.releaseCost} طلا` };
    }

    return { success: false, message: '❌ عملیات نامعتبر!' };
}

function getCourtEvent(player) {
    initCourt(player);

    const now = Date.now();
    const oneDay = 24 * 60 * 60 * 1000;

    // فقط هر ۱۲ ساعت یه رویداد
    if (now - player.court.lastEvent < 12 * 60 * 60 * 1000) {
        return null;
    }

    if (Math.random() < 0.35) {
        const event = courtEvents[Math.floor(Math.random() * courtEvents.length)];
        player.court.lastEvent = now;
        player.court.currentEvent = event;
        return event;
    }

    return null;
}

function handleCourtEvent(player, choiceIndex) {
    initCourt(player);

    if (!player.court.currentEvent) {
        return { success: false, message: '❌ رویدادی در جریان نیست!' };
    }

    const event = player.court.currentEvent;
    const choice = event.choices[choiceIndex];

    if (!choice) return { success: false, message: '❌ انتخاب نامعتبر!' };

    let message = `${event.emoji} *${event.name}*\n${choice.text}\n\n`;

    if (choice.effect.safety) {
        if (player.people && player.people.stats) {
            player.people.stats.safety = Math.min(100, Math.max(0, (player.people.stats.safety || 50) + choice.effect.safety));
        }
        message += `🛡️ امنیت: ${choice.effect.safety > 0 ? '+' : ''}${choice.effect.safety}\n`;
    }
    if (choice.effect.gold) {
        player.inventory.gold = Math.max(0, (player.inventory.gold || 0) + choice.effect.gold);
        message += `👑 ${choice.effect.gold > 0 ? '+' : ''}${choice.effect.gold} طلا\n`;
    }
    if (choice.effect.justice) {
        if (player.people && player.people.stats) {
            player.people.stats.justice = Math.min(100, Math.max(0, (player.people.stats.justice || 50) + choice.effect.justice));
        }
        message += `⚖️ عدالت: ${choice.effect.justice > 0 ? '+' : ''}${choice.effect.justice}\n`;
    }
    if (choice.effect.happiness) {
        if (player.people && player.people.stats) {
            player.people.stats.happiness = Math.min(100, Math.max(0, (player.people.stats.happiness || 50) + choice.effect.happiness));
        }
        message += `😊 خوشبختی: ${choice.effect.happiness > 0 ? '+' : ''}${choice.effect.happiness}\n`;
    }
    if (choice.effect.prestige) {
        player.score = (player.score || 0) + choice.effect.prestige * 10;
        message += `🏆 اعتبار: ${choice.effect.prestige > 0 ? '+' : ''}${choice.effect.prestige * 10} امتیاز\n`;
    }
    if (choice.effect.military) {
        message += `⚔️ قدرت نظامی: +${choice.effect.military}\n`;
    }
    if (choice.effect.food) {
        if (player.people && player.people.storage) {
            player.people.storage.food += choice.effect.food;
        }
        message += `🍞 غذا: ${choice.effect.food > 0 ? '+' : ''}${choice.effect.food}\n`;
    }
    if (choice.effect.faith) {
        if (player.people && player.people.stats) {
            player.people.stats.faith = Math.min(100, Math.max(0, (player.people.stats.faith || 50) + choice.effect.faith));
        }
        message += `🙏 ایمان: ${choice.effect.faith > 0 ? '+' : ''}${choice.effect.faith}\n`;
    }
    if (choice.effect.population) {
        if (player.people && player.people.population) {
            for (let type in player.people.population) {
                player.people.population[type].count = Math.max(0, player.people.population[type].count + Math.floor(choice.effect.population / 5));
            }
        }
        message += `👥 جمعیت: ${choice.effect.population > 0 ? '+' : ''}${choice.effect.population}\n`;
    }

    player.court.recentEvents.push({
        eventId: event.id,
        choice: choiceIndex,
        date: Date.now()
    });

    player.court.currentEvent = null;

    return { success: true, message };
}

function updateCourtAlerts(player) {
    initCourt(player);

    // کاهش تدریجی سطح هشدار
    if (player.court.alertLevel > 0) {
        player.court.alertLevel = Math.max(0, player.court.alertLevel - 1);
    }

    // فرار زندانیان
    const now = Date.now();
    const escapes = [];

    player.court.prisoners = player.court.prisoners.filter(prisoner => {
        if (now >= prisoner.releaseAt) {
            escapes.push(prisoner);
            return false;
        }

        if (Math.random() < prisonSystem.escapeChance / 24) {
            escapes.push(prisoner);
            return false;
        }

        return true;
    });

    return escapes;
}

function getCourtAlertMessage(player) {
    initCourt(player);

    const level = player.court.alertLevel;

    if (level >= 80) return '🔴 *هشدار قرمز!* دربار در آستانه جنگ داخلیه!';
    if (level >= 60) return '🟠 *هشدار بالا!* دسیسه‌های زیادی در جریانه.';
    if (level >= 40) return '🟡 *هشدار متوسط!* مراقب خائنان باش.';
    if (level >= 20) return '🟢 *هشدار کم!* دربار نسبتاً آرومه.';
    return '✅ *دربار امنه.*';
}

function formatCourt(player) {
    initCourt(player);
    initChildren(player);

    let msg = '👑 *دربار امپراطوری*\n\n';

    msg += getCourtAlertMessage(player) + '\n\n';

    // آمار
    const stats = getCourtStats(player);
    msg += `🔒 زندانیان: ${stats.prisoners}/${stats.maxPrisoners}\n`;
    msg += `📰 رسوایی‌ها: ${stats.scandals.length}\n`;
    msg += `⚠️ سطح هشدار: ${player.court.alertLevel}٪\n\n`;

    // زندانیان
    if (player.court.prisoners.length > 0) {
        msg += '🔒 *زندانیان:*\n';
        const now = Date.now();
        for (let i = 0; i < player.court.prisoners.length; i++) {
            const p = player.court.prisoners[i];
            const remaining = Math.max(0, Math.ceil((p.releaseAt - now) / (24 * 60 * 60 * 1000)));
            msg += `   ${i + 1}. ${p.emoji} ${p.name} - ${p.reason} (${remaining} روز)\n`;
        }
        msg += '\n';
    }

    // رسوایی‌های اخیر
    if (player.court.scandals.length > 0) {
        msg += '📰 *رسوایی‌های اخیر:*\n';
        const recent = player.court.scandals.slice(-3);
        for (let scandal of recent) {
            const daysAgo = Math.floor((Date.now() - scandal.date) / (24 * 60 * 60 * 1000));
            msg += `   ${scandal.performer} ${scandal.success ? '✅' : '❌'} علیه ${scandal.target} (${daysAgo} روز پیش)\n`;
        }
        msg += '\n';
    }

    // دسیسه‌های آماده
    msg += '🐍 *دسیسه‌های آماده:*\n';
    for (let key in intrigueTypes) {
        const intrigue = intrigueTypes[key];
        const cooldown = player.court.intrigueCooldowns[key];
        const ready = !cooldown || Date.now() - cooldown > 24 * 60 * 60 * 1000;
        msg += `   ${ready ? '✅' : '⏰'} ${intrigue.emoji} ${intrigue.name}\n`;
    }

    return msg;
}

// =============================================
// 🏛️ کیبورد شیشه‌ای دربار
// =============================================
function getCourtKeyboard(player) {
    initCourt(player);
    initChildren(player);

    const buttons = [];

    // دسیسه‌ها
    buttons.push([{ text: '🐍 انجام دسیسه', callback_data: 'court_intrigue_menu' }]);

    // مدیریت زندانیان
    if (player.court.prisoners.length > 0) {
        buttons.push([{ text: `🔒 مدیریت زندانیان (${player.court.prisoners.length})`, callback_data: 'court_prisoners' }]);
    }

    // رویداد درباری
    if (player.court.currentEvent) {
        const event = player.court.currentEvent;
        buttons.push([{ text: `❗ ${event.emoji} ${event.name}`, callback_data: 'court_event' }]);
    }

    buttons.push([{ text: '📊 وضعیت دربار', callback_data: 'court_status' }]);
    buttons.push([{ text: '🔙 برگشت', callback_data: 'empire_back' }]);

    return { reply_markup: { inline_keyboard: buttons } };
}

function getIntrigueKeyboard(player) {
    initChildren(player);

    const buttons = [];

    for (let key in intrigueTypes) {
        const intrigue = intrigueTypes[key];
        buttons.push([{ text: `🐍 ${intrigue.emoji} ${intrigue.name}`, callback_data: `court_intrigue_${key}` }]);
    }

    buttons.push([{ text: '🔙 برگشت', callback_data: 'court_menu' }]);

    return { reply_markup: { inline_keyboard: buttons } };
}

function getPrisonerKeyboard(player) {
    const buttons = [];

    for (let i = 0; i < player.court.prisoners.length; i++) {
        const p = player.court.prisoners[i];
        buttons.push([{ text: `💀 اعدام ${p.emoji} ${p.name}`, callback_data: `court_execute_${i}` }]);
        buttons.push([{ text: `🔓 آزاد کن ${p.emoji} ${p.name}`, callback_data: `court_release_${i}` }]);
    }

    buttons.push([{ text: '🔙 برگشت', callback_data: 'court_menu' }]);

    return { reply_markup: { inline_keyboard: buttons } };
}

function getCourtEventKeyboard(player) {
    if (!player.court.currentEvent) return null;

    const event = player.court.currentEvent;
    const buttons = [];

    for (let choice of event.choices) {
        buttons.push([{ text: choice.text, callback_data: `court_event_choice_${event.choices.indexOf(choice)}` }]);
    }

    buttons.push([{ text: '🔙 برگشت', callback_data: 'court_menu' }]);

    return { reply_markup: { inline_keyboard: buttons } };
}

module.exports = {
    intrigueTypes,
    prisonSystem,
    courtEvents,
    initCourt,
    getCourtStats,
    performIntrigue,
    queenIntrigue,
    managePrisoners,
    getCourtEvent,
    handleCourtEvent,
    updateCourtAlerts,
    getCourtAlertMessage,
    formatCourt,
    getCourtKeyboard,
    getIntrigueKeyboard,
    getPrisonerKeyboard,
    getCourtEventKeyboard
};