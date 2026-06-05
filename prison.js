const config = require('./config');
const { getPrisonDialogue, getNpcConfig } = require('./dialogue');

function initPrison(player) {
    if (!player.prison) player.prison = [];
    if (!player.prisonRelations) player.prisonRelations = {};
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

function captureNpc(player, npcId) {
    initPrison(player);
    
    if (player.prison.find(p => p.npcId === npcId)) {
        return { success: false, message: '⚠️ این NPC قبلاً توی زندانته!' };
    }
    
    const npc = config.images.npcs?.[npcId] || config.images.enemies?.[npcId];
    const days = Math.floor(Math.random() * 5) + 3;
    
    player.prison.push({
        npcId: npcId,
        name: npc?.name || npcId,
        emoji: npc?.emoji || '🔒',
        daysUntilEscape: days,
        capturedAt: Date.now()
    });
    
    player.prisonRelations[npcId] = getStartingPoints(npcId);
    
    return {
        success: true,
        message: `🔒 ${npc?.emoji || ''} *${npc?.name || npcId}* زندانی شد!\n⏰ ${days} روز تا فرار`
    };
}

function touchPrisoner(player, npcId) {
    const points = getRelationPoints(player, npcId);
    const relation = getRelationLevel(points);
    
    const successChance = {
        wild: 0.30,
        untrusted: 0.50,
        familiar: 0.70,
        intimate: 0.85,
        tamed: 1.0
    };
    const chance = successChance[relation.level] || 0.5;
    
    if (Math.random() < chance) {
        const bonus = {
            wild: 3,
            untrusted: 5,
            familiar: 7,
            intimate: 9,
            tamed: 10
        };
        player.prisonRelations[npcId] += bonus[relation.level] || 5;
        player.hp = Math.min(player.maxHp, player.hp + 5);
        
        const newRelation = getRelationLevel(player.prisonRelations[npcId]);
        return {
            success: true,
            message: `🖐️ لمسش کردی... +${bonus[relation.level]} رابطه\n❤️ +۵\n${newRelation.name}`,
            relation: newRelation
        };
    } else {
        player.hp = Math.max(1, player.hp - 10);
        return {
            success: false,
            message: '❌ عقب کشید! "نزدیک نشو!" -۱۰❤️',
            relation: relation
        };
    }
}

function kissPrisoner(player, npcId) {
    const points = getRelationPoints(player, npcId);
    const relation = getRelationLevel(points);
    
    if (relation.level === 'wild') {
        return {
            success: false,
            message: '❌ هنوز وحشیه! اول لمسش کن...',
            relation: relation
        };
    }
    
    const successChance = {
        untrusted: 0.40,
        familiar: 0.65,
        intimate: 0.85,
        tamed: 1.0
    };
    const chance = successChance[relation.level] || 0.5;
    
    if (Math.random() < chance) {
        const bonus = {
            untrusted: 8,
            familiar: 10,
            intimate: 12,
            tamed: 15
        };
        player.prisonRelations[npcId] += bonus[relation.level] || 10;
        player.hp = Math.min(player.maxHp, player.hp + 15);
        
        const newRelation = getRelationLevel(player.prisonRelations[npcId]);
        return {
            success: true,
            message: `💋 بوسیدیش... +${bonus[relation.level]} رابطه\n❤️ +۱۵\n${newRelation.name}`,
            relation: newRelation
        };
    } else {
        return {
            success: false,
            message: '😳 عقب کشید... "هنوز زوده..."',
            relation: relation
        };
    }
}

function releasePrisoner(player, npcId) {
    if (!player.prison) return { success: false, message: '❌ زندان خالیه!' };
    
    const index = player.prison.findIndex(p => p.npcId === npcId);
    if (index === -1) return { success: false, message: '❌ این NPC توی زندان نیست!' };
    
    const points = getRelationPoints(player, npcId);
    const relation = getRelationLevel(points);
    const released = player.prison[index];
    
    // رام شده یا صمیمی - وفادار میمونه
    if (relation.level === 'tamed' || relation.level === 'intimate') {
        player.prison.splice(index, 1);
        player.inventory.gold += 30;
        player.xp += 20;
        return {
            success: true,
            message: `🔓 ${released.emoji} *${released.name}*: "آزادم کردی... ولی پیشت می‌مونم... 💋"\n🎁 +۳۰👑 +۲۰✨`,
            loyal: true
        };
    }
    
    // شانس خیانت
    const betrayChance = {
        wild: 0.60,
        untrusted: 0.40,
        familiar: 0.25,
        intimate: 0.10,
        tamed: 0
    };
    
    if (Math.random() < (betrayChance[relation.level] || 0.3)) {
        player.prison.splice(index, 1);
        player.hp = Math.max(1, player.hp - 30);
        player.inventory.gold = Math.max(0, player.inventory.gold - 20);
        return {
            success: false,
            message: `💀 ${released.emoji} *${released.name}*: "احمق! فریب خوردی!"\n⚡ -۳۰❤️ -۲۰👑\nفرار کرد!`,
            betrayed: true
        };
    }
    
    player.prison.splice(index, 1);
    player.inventory.gold += 15;
    return {
        success: true,
        message: `🔓 ${released.emoji} *${released.name}* آزاد شد.\n🎁 +۱۵👑`
    };
}

function checkEscapes(player) {
    if (!player.prison) return [];
    
    const escaped = [];
    const remaining = [];
    
    for (let prisoner of player.prison) {
        prisoner.daysUntilEscape--;
        
        if (prisoner.daysUntilEscape <= 0) {
            const points = getRelationPoints(player, prisoner.npcId);
            const relation = getRelationLevel(points);
            
            // اگه رام شده - فرار نمی‌کنه
            if (relation.level === 'tamed') {
                prisoner.daysUntilEscape = Math.floor(Math.random() * 5) + 3;
                remaining.push(prisoner);
                continue;
            }
            
            if (Math.random() < relation.escapeChance) {
                escaped.push(prisoner);
            } else {
                prisoner.daysUntilEscape = Math.floor(Math.random() * 3) + 1;
                remaining.push(prisoner);
            }
        } else {
            remaining.push(prisoner);
        }
    }
    
    player.prison = remaining;
    return escaped;
}

function formatPrison(player) {
    if (!player.prison || player.prison.length === 0) {
        return '🏰 *زندان باستانی*\n\n🔓 زندان خالیه! برو شکار کن!';
    }
    
    let msg = '🏰 *زندان باستانی*\n\n📋 *زندانی‌ها:*\n';
    
    for (let p of player.prison) {
        const points = getRelationPoints(player, p.npcId);
        const relation = getRelationLevel(points);
        msg += `${p.emoji} ${p.name} | ${relation.name} | ⏰ ${p.daysUntilEscape} روز\n`;
    }
    
    msg += `\n👥 تعداد: ${player.prison.length}`;
    if (player.prison.length >= 10) msg += '\n\n👑 *سلطان زندان!*';
    
    return msg;
}

function getPrisonerKeyboard() {
    return {
        reply_markup: {
            keyboard: [
                ['🖐️ لمس کن', '💋 ببوس'],
                ['🔓 آزاد کن', '🔙 برگشت']
            ],
            resize_keyboard: true
        }
    };
}

module.exports = {
    initPrison,
    captureNpc,
    getRelationPoints,
    getRelationLevel,
    touchPrisoner,
    kissPrisoner,
    releasePrisoner,
    checkEscapes,
    formatPrison,
    getPrisonerKeyboard
};