const config = require('./config');
const { getPrisonDialogue, getNpcConfig } = require('./dialogue');

// گیف‌های سکسی
const sexyGifs = {
    touch: [
        'CgACAgIAAxkBAAEqL2xqIyJty9xl0ap5lrJYra2GtlNQdQACTwMAAiY94UhMlGoX_JSICTsE',
        'CgACAgQAAxkBAAEqL2pqIyJpy-g7HaM9YEhpzyE0RU-1MwACrAADXSmNUjSWJGIYVG3KOwQ',
        'CgACAgQAAxkBAAEqL15qIyJW5AcK3OWO2Oyif7wI1aiDqQACgQMAAirVQQYo4gxrnlLz0zsE'
    ],
    kiss: 'CgACAgIAAxkBAAEqL2hqIyJnncLJlCKF2kJOT7jKi-7r_wACaAIAArqQoEtep7htQxIwxTsE',
    orgy: 'CgACAgQAAxkBAAEqL1xqIyJUx3yIRno4UZtix4SumGHwCgAC6p8AAkMXZAepPlY8DiidIDsE'
};

function initPrison(player) {
    if (!player.prison) player.prison = [];
    if (!player.prisonRelations) player.prisonRelations = {};
    if (!player.prisonActions) player.prisonActions = {};
    return player.prison;
}

function getStartingPoints(npcId) {
    const npc = getNpcConfig(npcId);
    return npc?.startPoints || 15;
}

function getRelationLevel(points) {
    if (points >= 81) return { level: 'tamed', name: '💋 رام شده', escapeChance: 0 };
    if (points >= 61) return { level: 'intimate', name: '😊 صمیمی', escapeChance: 0.10 };
    if (points >= 41) return { level: 'familiar', name: '😐 آشنا', escapeChance: 0.20 };
    if (points >= 21) return { level: 'untrusted', name: '😒 بی‌اعتماد', escapeChance: 0.30 };
    return { level: 'wild', name: '😡 وحشی', escapeChance: 0.40 };
}

function getRelationPoints(player, npcId) {
    if (!player.prisonRelations) player.prisonRelations = {};
    if (!player.prisonRelations[npcId]) {
        player.prisonRelations[npcId] = getStartingPoints(npcId);
    }
    return player.prisonRelations[npcId];
}

function getPrisonActions(player, npcId) {
    if (!player.prisonActions) player.prisonActions = {};
    if (!player.prisonActions[npcId]) {
        player.prisonActions[npcId] = { touch: 0, kiss: 0, orgy: 0 };
    }
    return player.prisonActions[npcId];
}

function captureNpc(player, npcId) {
    initPrison(player);
    
    if (player.prison.find(p => p.npcId === npcId)) {
        return { success: false, message: '⚠️ این NPC قبلاً توی زندانته!' };
    }
    
    const npc = config.images.npcs?.[npcId] || config.images.enemies?.[npcId];
    const days = Math.floor(Math.random() * 5) + 3;
    
    player.prison.push({
        npcId, name: npc?.name || npcId, emoji: npc?.emoji || '🔒',
        daysUntilEscape: days, capturedAt: Date.now()
    });
    
    player.prisonRelations[npcId] = getStartingPoints(npcId);
    player.prisonActions[npcId] = { touch: 0, kiss: 0, orgy: 0 };
    
    return { success: true, message: `🔒 ${npc?.emoji || ''} *${npc?.name || npcId}* زندانی شد!\n⏰ ${days} روز تا فرار` };
}

function touchPrisoner(player, npcId) {
    const points = getRelationPoints(player, npcId);
    const relation = getRelationLevel(points);
    const actions = getPrisonActions(player, npcId);
    
    const successChance = { wild: 0.30, untrusted: 0.50, familiar: 0.70, intimate: 0.85, tamed: 1.0 };
    const chance = successChance[relation.level] || 0.5;
    
    if (Math.random() < chance) {
        const bonus = { wild: 3, untrusted: 5, familiar: 7, intimate: 9, tamed: 10 };
        player.prisonRelations[npcId] += bonus[relation.level] || 5;
        player.hp = Math.min((player.maxHp || 100), (player.hp || 100) + 5);
        actions.touch++;
        
        const newRelation = getRelationLevel(player.prisonRelations[npcId]);
        const gif = sexyGifs.touch[Math.floor(Math.random() * sexyGifs.touch.length)];
        
        return {
            success: true,
            message: `🖐️ لمسش کردی... +${bonus[relation.level]} رابطه\n❤️ +۵\n${newRelation.name}\n👆 لمس: ${actions.touch} | 💋 بوس: ${actions.kiss}`,
            relation: newRelation,
            animation: gif
        };
    } else {
        player.hp = Math.max(1, (player.hp || 100) - 10);
        return { success: false, message: '❌ عقب کشید! "نزدیک نشو!" -۱۰❤️', relation, animation: null };
    }
}

function kissPrisoner(player, npcId) {
    const points = getRelationPoints(player, npcId);
    const relation = getRelationLevel(points);
    const actions = getPrisonActions(player, npcId);
    
    if (actions.touch < 3) {
        return {
            success: false,
            message: `❌ هنوز نتونستی ببوسیش!\n🖐️ نیاز به *۳ لمس* (الان ${actions.touch} تا)`,
            relation,
            animation: null
        };
    }
    
    if (relation.level === 'wild') {
        return { success: false, message: '❌ هنوز وحشیه! اول بیشتر لمسش کن...', relation, animation: null };
    }
    
    const successChance = { untrusted: 0.40, familiar: 0.65, intimate: 0.85, tamed: 1.0 };
    const chance = successChance[relation.level] || 0.5;
    
    if (Math.random() < chance) {
        const bonus = { untrusted: 8, familiar: 10, intimate: 12, tamed: 15 };
        player.prisonRelations[npcId] += bonus[relation.level] || 10;
        player.hp = Math.min((player.maxHp || 100), (player.hp || 100) + 15);
        actions.kiss++;
        
        const newRelation = getRelationLevel(player.prisonRelations[npcId]);
        
        return {
            success: true,
            message: `💋 بوسیدیش... +${bonus[relation.level]} رابطه\n❤️ +۱۵\n${newRelation.name}\n👆 لمس: ${actions.touch} | 💋 بوس: ${actions.kiss}`,
            relation: newRelation,
            animation: sexyGifs.kiss
        };
    } else {
        return { success: false, message: '😳 عقب کشید... "هنوز زوده..."', relation, animation: null };
    }
}

function orgyPrisoner(player, npcId) {
    const points = getRelationPoints(player, npcId);
    const relation = getRelationLevel(points);
    const actions = getPrisonActions(player, npcId);
    
    if (actions.touch < 10 || actions.kiss < 10) {
        return {
            success: false,
            message: `❌ هنوز زوده!\n🖐️ نیاز به *۱۰ لمس* (الان ${actions.touch})\n💋 نیاز به *۱۰ بوس* (الان ${actions.kiss})`,
            relation,
            animation: null
        };
    }
    
    if (relation.level !== 'intimate' && relation.level !== 'tamed') {
        return { success: false, message: '❌ هنوز به اندازه کافی صمیمی نشدین!', relation, animation: null };
    }
    
    const bonus = 25;
    player.prisonRelations[npcId] += bonus;
    player.hp = Math.min((player.maxHp || 100), (player.hp || 100) + 30);
    actions.orgy++;
    
    const newRelation = getRelationLevel(player.prisonRelations[npcId]);
    
    return {
        success: true,
        message: `🔥 *شب وحشی...* +${bonus} رابطه\n❤️ +۳۰\n${newRelation.name}\n🖐️${actions.touch} 💋${actions.kiss} 🔥${actions.orgy}`,
        relation: newRelation,
        animation: sexyGifs.orgy
    };
}

function releasePrisoner(player, npcId) {
    if (!player.prison) return { success: false, message: '❌ زندان خالیه!' };
    
    const index = player.prison.findIndex(p => p.npcId === npcId);
    if (index === -1) return { success: false, message: '❌ نیست!' };
    
    const points = getRelationPoints(player, npcId);
    const relation = getRelationLevel(points);
    const released = player.prison[index];
    
    if (relation.level === 'tamed' || relation.level === 'intimate') {
        player.prison.splice(index, 1);
        player.inventory.gold = (player.inventory.gold || 0) + 30;
        player.xp = (player.xp || 0) + 20;
        return { success: true, message: `🔓 ${released.emoji} *${released.name}*: "آزادم کردی... ولی پیشت می‌مونم... 💋"\n🎁 +۳۰👑 +۲۰✨`, loyal: true };
    }
    
    const betrayChance = { wild: 0.60, untrusted: 0.40, familiar: 0.25, intimate: 0.10, tamed: 0 };
    if (Math.random() < (betrayChance[relation.level] || 0.3)) {
        player.prison.splice(index, 1);
        player.hp = Math.max(1, (player.hp || 100) - 30);
        player.inventory.gold = Math.max(0, (player.inventory.gold || 0) - 20);
        return { success: false, message: `💀 ${released.emoji} *${released.name}*: "احمق! فریب خوردی!"\n⚡ -۳۰❤️ -۲۰👑`, betrayed: true };
    }
    
    player.prison.splice(index, 1);
    player.inventory.gold = (player.inventory.gold || 0) + 15;
    return { success: true, message: `🔓 ${released.emoji} *${released.name}* آزاد شد.\n🎁 +۱۵👑` };
}

function checkEscapes(player) {
    if (!player.prison) return [];
    
    const escaped = [], remaining = [];
    
    for (let prisoner of player.prison) {
        prisoner.daysUntilEscape--;
        if (prisoner.daysUntilEscape <= 0) {
            const points = getRelationPoints(player, prisoner.npcId);
            const relation = getRelationLevel(points);
            if (relation.level === 'tamed') { prisoner.daysUntilEscape = Math.floor(Math.random() * 5) + 3; remaining.push(prisoner); continue; }
            if (Math.random() < relation.escapeChance) escaped.push(prisoner);
            else { prisoner.daysUntilEscape = Math.floor(Math.random() * 3) + 1; remaining.push(prisoner); }
        } else remaining.push(prisoner);
    }
    
    player.prison = remaining;
    return escaped;
}

function formatPrison(player) {
    if (!player.prison || player.prison.length === 0) return '🏰 *زندان باستانی*\n\n🔓 زندان خالیه! برو شکار کن!';
    
    let msg = '🏰 *زندان باستانی*\n\n📋 *زندانی‌ها:*\n';
    for (let p of player.prison) {
        const points = getRelationPoints(player, p.npcId);
        const relation = getRelationLevel(points);
        const actions = getPrisonActions(player, p.npcId);
        msg += `${p.emoji} ${p.name} | ${relation.name}\n🖐️${actions.touch} 💋${actions.kiss} 🔥${actions.orgy} | ⏰${p.daysUntilEscape} روز\n\n`;
    }
    msg += `👥 ${player.prison.length} زندانی`;
    if (player.prison.length >= 10) msg += '\n👑 *سلطان زندان!*';
    return msg;
}

function getPrisonerKeyboard(player, npcId) {
    const actions = getPrisonActions(player, npcId);
    const canKiss = actions.touch >= 3;
    const canOrgy = actions.touch >= 10 && actions.kiss >= 10;
    
    const buttons = [];
    buttons.push(['🖐️ لمس کن']);
    if (canKiss) buttons.push(['💋 ببوس']);
    if (canOrgy) buttons.push(['🔥 عیاشی']);
    buttons.push(['🔓 آزاد کن', '🔙 برگشت']);
    
    return { reply_markup: { keyboard: buttons, resize_keyboard: true } };
}

module.exports = {
    initPrison, captureNpc, getRelationPoints, getRelationLevel,
    touchPrisoner, kissPrisoner, orgyPrisoner, releasePrisoner, checkEscapes,
    formatPrison, getPrisonerKeyboard, getPrisonActions
};