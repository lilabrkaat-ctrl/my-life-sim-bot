const config = require('./config');

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
    ]
};

const npcConfig = {
    witch: { image: 'witch', emoji: '🧙‍♀️', fightReward: { xp: 50, gold: 30 }, seduceReward: { hp: 30, xp: 20 } },
    ghost: { image: 'ghost_sexy', emoji: '👻', fightReward: { xp: 80, gold: 40 }, seduceReward: { hp: 50, xp: 30 } },
    fairy: { image: 'fairy', emoji: '🧚', fightReward: { xp: 40, gold: 25 }, seduceReward: { hp: 20, xp: 15 } },
    angel: { image: 'angel', emoji: '👼', fightReward: { xp: 100, gold: 50 }, seduceReward: { hp: 100, xp: 50 } }
};

function getDialogue(npcId, encounterCount) {
    const npcDialogues = dialogues[npcId];
    if (!npcDialogues) return null;
    const index = Math.min(encounterCount, npcDialogues.length - 1);
    return npcDialogues[index];
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
            result.image = config.images.npcs[npc.image]?.file_id;
            break;
        case 'seduce':
            player.hp = Math.min(player.maxHp, player.hp + npc.seduceReward.hp);
            player.xp += npc.seduceReward.xp;
            if (!player.seduced) player.seduced = {};
            player.seduced[npcId] = (player.seduced[npcId] || 0) + 1;
            result.message = `💋 ${npc.emoji} تسلیم عشق تو شد!\n❤️ +${npc.seduceReward.hp} | ✨ +${npc.seduceReward.xp}`;
            break;
        case 'flee':
            result.message = `🏃 فرار کردی... ${npc.emoji} با عصبانیت نگاهت می‌کنه!`;
            break;
        case 'heal':
            player.hp = player.maxHp;
            result.message = `❤️ ${npc.emoji} تو رو شفا داد! جان کامل شد!`;
            break;
        case 'gift':
            player.inventory.gold += 20;
            result.message = `🎁 ${npc.emoji} بهت ۲۰👑 طلا هدیه داد!`;
            break;
        case 'kiss':
            player.hp = Math.min(player.maxHp, player.hp + 15);
            result.message = `😘 ${npc.emoji} بوسیدت! +۱۵❤️`;
            break;
        default:
            result.message = `🤔 ${npc.emoji} منتظر تصمیم توئه...`;
    }

    return result;
}

module.exports = { dialogues, getDialogue, getNpcConfig, handleAction };