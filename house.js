const config = require('./config');
const { getHouseDialogue, getNpcConfig } = require('./dialogue');
const { getRelationPoints, getRelationLevel, getPrisonActions, touchPrisoner, kissPrisoner, orgyPrisoner } = require('./prison');

function initHouse(player) {
    if (!player.house) player.house = [];
    if (!player.enraged) player.enraged = {};
    if (!player.marry) player.marry = null;
    return player.house;
}

function inviteToHouse(player, npcId) {
    initHouse(player);

    const maxSlots = config.houseSettings?.maxSlots || 3;
    if (player.house.length >= maxSlots) {
        return { success: false, message: '🏠 خونه‌ات پره! اول یکی رو بیرون کن.' };
    }

    if (player.house.find(h => h.npcId === npcId)) {
        return { success: false, message: '⚠️ این NPC قبلاً توی خونه‌اته!' };
    }

    if (player.prison && player.prison.find(p => p.npcId === npcId)) {
        return { success: false, message: '🔒 اول باید از زندان آزادش کنی!' };
    }

    const npc = config.images.npcs?.[npcId] || config.images.enemies?.[npcId];

    if (Math.random() < 0.6) {
        player.house.push({
            npcId, name: npc?.name || npcId, emoji: npc?.emoji || '👤',
            joinedAt: Date.now()
        });

        if (!player.prisonRelations) player.prisonRelations = {};
        if (!player.prisonRelations[npcId]) player.prisonRelations[npcId] = 40;

        if (!player.prisonActions) player.prisonActions = {};
        if (!player.prisonActions[npcId]) player.prisonActions[npcId] = { touch: 0, kiss: 0, orgy: 0 };

        const dialogue = getHouseDialogue('invite', 'accept');
        return { success: true, message: `${npc?.emoji || ''} ${dialogue}` };
    } else {
        const dialogue = getHouseDialogue('invite', 'reject');
        return { success: false, message: `${npc?.emoji || ''} ${dialogue}` };
    }
}

function kickFromHouse(player, npcId) {
    if (!player.house) return { success: false, message: '❌ خونه خالیه!' };

    const index = player.house.findIndex(h => h.npcId === npcId);
    if (index === -1) return { success: false, message: '❌ این NPC توی خونه نیست!' };

    const kicked = player.house.splice(index, 1)[0];

    if (!player.enraged) player.enraged = {};
    player.enraged[npcId] = true;

    if (player.marry === npcId) {
        player.marry = null;
    }

    const dialogue = getHouseDialogue('kick', 'angry');
    return { 
        success: true, 
        message: `${kicked.emoji} ${dialogue}\n\n💀 *${kicked.name}* تبدیل به دشمن خشمگین شد!\n⚔️ ۲ برابر قدرت - ۲ برابر جایزه`,
        enraged: true
    };
}

function formatHouse(player) {
    if (!player.house || player.house.length === 0) {
        return '🏠 *خونه من*\n\n🏚️ خونه خالیه! برو یه NPC پیدا کن و دعوتش کن!';
    }

    let msg = '🏠 *خونه من*\n\n';

    if (player.marry) {
        const spouse = player.house.find(h => h.npcId === player.marry);
        if (spouse) {
            msg += `💍 *همسر:* ${spouse.emoji} ${spouse.name}\n\n`;
        }
    }

    msg += '👥 *دوستان توی خونه:*\n';
    for (let h of player.house) {
        const points = getRelationPoints(player, h.npcId);
        const relation = getRelationLevel(points);
        const actions = getPrisonActions(player, h.npcId);
        const isSpouse = player.marry === h.npcId;
        msg += `${h.emoji} ${h.name} | ${relation.name}\n🖐️${actions.touch} 💋${actions.kiss} 🔥${actions.orgy}${isSpouse ? ' 💍' : ''}\n\n`;
    }

    msg += `👥 ${player.house.length}/${config.houseSettings?.maxSlots || 3} نفر`;
    return msg;
}

// =============================================
// 🏠 کیبورد شیشه‌ای خونه
// =============================================
function getHouseKeyboard(player) {
    const buttons = [];

    if (player.house && player.house.length > 0) {
        for (let h of player.house) {
            const points = getRelationPoints(player, h.npcId);
            const relation = getRelationLevel(points);
            const isSpouse = player.marry === h.npcId;
            buttons.push([{ 
                text: `${h.emoji} ${h.name} | ${relation.name}${isSpouse ? ' 💍' : ''}`, 
                callback_data: `house_select_${h.npcId}` 
            }]);
        }
    }

    buttons.push([{ text: '🔙 برگشت', callback_data: 'back_to_main' }]);

    return { reply_markup: { inline_keyboard: buttons } };
}

function getHouseMemberKeyboard(player, npcId) {
    const actions = getPrisonActions(player, npcId);
    const canKiss = actions.touch >= 3;
    const canOrgy = actions.touch >= 10 && actions.kiss >= 10;
    const points = getRelationPoints(player, npcId);
    const relation = getRelationLevel(points);

    const buttons = [];

    // لمس
    buttons.push([{ text: `🖐️ لمس کن (${actions.touch})`, callback_data: `house_touch_${npcId}` }]);

    // بوسه
    if (canKiss) {
        buttons.push([{ text: `💋 ببوس (${actions.kiss})`, callback_data: `house_kiss_${npcId}` }]);
    }

    // عیاشی
    if (canOrgy) {
        buttons.push([{ text: `🔥 عیاشی (${actions.orgy})`, callback_data: `house_orgy_${npcId}` }]);
    }

    // خواستگاری
    if ((player.inventory?.ring || 0) > 0 && (relation.level === 'intimate' || relation.level === 'tamed') && !player.marry) {
        buttons.push([{ text: '💍 خواستگاری', callback_data: `house_propose_${npcId}` }]);
    }

    // عروسی
    if (player.marry === npcId) {
        buttons.push([{ text: '👰 عروسی', callback_data: `house_marry_${npcId}` }]);
    }

    // اخراج
    buttons.push([{ text: '🚪 بیرون کن', callback_data: `house_kick_${npcId}` }]);
    buttons.push([{ text: '🔙 برگشت به خونه', callback_data: 'house_back' }]);

    return { reply_markup: { inline_keyboard: buttons } };
}

function touchInHouse(player, npcId) { return touchPrisoner(player, npcId); }
function kissInHouse(player, npcId) { return kissPrisoner(player, npcId); }
function orgyInHouse(player, npcId) { return orgyPrisoner(player, npcId); }

module.exports = {
    initHouse, inviteToHouse, kickFromHouse, formatHouse,
    getHouseKeyboard, getHouseMemberKeyboard,
    touchInHouse, kissInHouse, orgyInHouse
};