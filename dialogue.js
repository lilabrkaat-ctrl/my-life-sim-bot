const config = require('./config');
const { mainNPCs } = require('./dialogues/mainNPCs');
const { otherNPCs } = require('./dialogues/otherNPCs');
const { creatures } = require('./dialogues/creatures');

// ترکیب همه NPCها
const dialogues = {
    ...mainNPCs,
    ...otherNPCs,
    ...creatures
};

// ============ houseDialogues ============
const houseDialogues = {
    'invite_accept': ["🏠 اوکی بابا... میام خونه‌ات...", "🏠 بالاخره یه جای درست و حسابی..."],
    'invite_reject': ["😒 نه... حوصله ندارم...", "😒 شاید بعداً..."],
    'kick_angry': ["😡 منو بیرون می‌کنی؟!", "💀 پشیمون میشی..."],
    'touch': ["🖐️ دستت گرمه...", "🖐️ بیشتر لمس کن..."],
    'kiss': ["💋 ммm... لبات...", "💋 دوباره ببوس..."],
    'orgy': ["🔥 امروز چه شب وحشی‌ای بود...", "🔥 فوق‌العاده بود..."]
};

const marryDialogues = {
    'propose_accept': "💍 آره! هزار بار آره! مال تو شدم!",
    'propose_reject': "💍 نه... هنوز آماده نیستم...",
    'marry_text': "👰 امروز بهترین روز زندگیمه...",
    'divorce_text': "💔 تموم شد... رفتیم..."
};

const prisonDialogues = {
    witch: { wild: ["🧙‍♀️: گمشو بیرون!"], untrusted: ["🧙‍♀️: بازم اومدی؟!"], familiar: ["🧙‍♀️: دستت رو بده..."], intimate: ["🧙‍♀️: بیا نزدیک‌تر..."], tamed: ["🧙‍♀️: مال تو شدم... 💋"] }
};

const npcConfig = {
    witch: { emoji: '🧙‍♀️', startPoints: 15 }, vampire: { emoji: '🧛‍♀️', startPoints: 15 },
    fairy: { emoji: '🧚', startPoints: 20 }, angel: { emoji: '👼', startPoints: 20 },
    knight: { emoji: '⚔️', startPoints: 10 }, werewolf: { emoji: '🐺', startPoints: 5 },
    bride: { emoji: '👰', startPoints: 30 }, mermaid: { emoji: '🧜‍♀️', startPoints: 25 },
    skeleton: { emoji: '💀', startPoints: 30 }, bandit_female: { emoji: '🦹‍♀️', startPoints: 20 },
    ghost_sexy: { emoji: '👻', startPoints: 25 }
};

// ============ توابع ============
function getDialogue(npcId, encounterCount) {
    try {
        if (!npcId) return null;
        const npcDialogues = dialogues[npcId];
        if (!npcDialogues) return null;
        const day = Math.min(7, Math.max(1, (encounterCount || 0) + 1));
        const dayKey = 'day' + day;
        const dayDialogues = npcDialogues[dayKey] || npcDialogues.day1;
        if (!dayDialogues || !Array.isArray(dayDialogues) || dayDialogues.length === 0) return null;
        const index = (encounterCount || 0) % dayDialogues.length;
        const dialogue = dayDialogues[index];
        if (!dialogue || !dialogue.text || !dialogue.options || !Array.isArray(dialogue.options)) return null;
        return dialogue;
    } catch (e) { return null; }
}

function getHaremDialogue(npcId) {
    try {
        if (!npcId) return null;
        const npcDialogues = dialogues[npcId];
        if (!npcDialogues || !npcDialogues.harem || !Array.isArray(npcDialogues.harem)) return null;
        return npcDialogues.harem[Math.floor(Math.random() * npcDialogues.harem.length)];
    } catch (e) { return null; }
}

function getPrisonDialogue(npcId, relationLevel) {
    if (!npcId) return { text: "🤐 ...", level: "untrusted" };
    const npcDialogues = prisonDialogues[npcId] || prisonDialogues.witch;
    const level = relationLevel || "untrusted";
    const levelDialogues = npcDialogues[level] || npcDialogues.untrusted || ["🤐 ..."];
    const text = levelDialogues[Math.floor(Math.random() * levelDialogues.length)];
    return { text: text || "🤐 ...", level: level };
}

function getHouseDialogue(type, subType) {
    if (!type) return "🤐 ...";
    const key = subType ? `${type}_${subType}` : type;
    const d = houseDialogues[key] || houseDialogues[type];
    if (!d || !Array.isArray(d) || d.length === 0) return "🤐 ...";
    return d[Math.floor(Math.random() * d.length)];
}

function getMarryDialogue(type, subType) {
    if (!type) return "🤐 ...";
    const key = subType ? `${type}_${subType}` : `${type}_text`;
    return marryDialogues[key] || "🤐 ...";
}

function getNpcConfig(npcId) {
    if (!npcId) return null;
    return npcConfig[npcId] || null;
}

function handleAction(player, npcId, action) {
    const npc = getNpcConfig(npcId);
    if (!npc) return { message: '❌ NPC پیدا نشد!', battleStart: false };
    let result = { message: '', battleStart: false };
    switch (action) {
        case 'fight': result.battleStart = true; result.message = `⚔️ ${npc.emoji} برای نبرد آماده میشه!`; break;
        case 'seduce': player.hp = Math.min(player.maxHp || 100, (player.hp || 0) + 15); player.xp = (player.xp || 0) + 15; result.message = `💋 ${npc.emoji} تسلیم عشق تو شد!\n❤️ +۱۵ | ✨ +۱۵`; break;
        case 'flee': result.message = `🏃 فرار کردی...`; break;
        case 'heal': player.hp = player.maxHp || 100; result.message = `❤️ ${npc.emoji} شفات داد!`; break;
        case 'gift': player.inventory.gold = (player.inventory.gold || 0) + 20; result.message = `🎁 ${npc.emoji} ۲۰👑 داد!`; break;
        case 'kiss': player.hp = Math.min(player.maxHp || 100, (player.hp || 0) + 15); result.message = `😘 ${npc.emoji} بوسیدت! +۱۵❤️`; break;
        case 'wealth': player.inventory.gold = (player.inventory.gold || 0) + 30; result.message = `💰 ۳۰👑`; break;
        case 'power': player.attack = (player.attack || 5) + 5; result.message = `⚔️ +۵⚔️`; break;
        case 'ally': player.defense = (player.defense || 2) + 3; result.message = `🤝 +۳🛡️`; break;
        case 'trade': player.inventory.gold = (player.inventory.gold || 0) + 15; result.message = `🤝 +۱۵👑`; break;
        case 'potion': player.hp = Math.min(player.maxHp || 100, (player.hp || 0) + 40); result.message = `🧪 +۴۰❤️`; break;
        case 'help': player.xp = (player.xp || 0) + 15; result.message = `🤝 +۱۵✨`; break;
        case 'listen': player.xp = (player.xp || 0) + 10; result.message = `👂 +۱۰✨`; break;
        case 'treasure': player.inventory.gold = (player.inventory.gold || 0) + 50; result.message = `💰 +۵۰👑`; break;
        case 'free': player.xp = (player.xp || 0) + 30; result.message = `🕊️ +۳۰✨`; break;
        case 'craft': result.message = `🔨 برو به بخش ساخت‌وساز!`; break;
        case 'propose': player.inventory.ring = (player.inventory.ring || 0) + 1; result.message = `💍 +۱ حلقه`; break;
        case 'wish': player.inventory.wish = (player.inventory.wish || 0) + 1; result.message = `🔮 +۱ آرزو`; break;
        default: result.message = `🤔 منتظر تصمیم توئه...`;
    }
    return result;
}

module.exports = { 
    dialogues, prisonDialogues, houseDialogues, marryDialogues, npcConfig, 
    getDialogue, getHaremDialogue, getPrisonDialogue, getHouseDialogue, 
    getMarryDialogue, getNpcConfig, handleAction 
};