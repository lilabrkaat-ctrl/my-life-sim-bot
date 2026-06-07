const config = require('./config');
const { getMarryDialogue } = require('./dialogue');

function propose(player, npcId) {
    if (!player.house || !player.house.find(h => h.npcId === npcId)) {
        return { success: false, message: '❌ این NPC توی خونه‌ات نیست!' };
    }
    
    if (player.marry) {
        return { success: false, message: '❌ تو قبلاً ازدواج کردی! اول طلاق بگیر.' };
    }
    
    if ((player.inventory?.ring || 0) < 1) {
        return { success: false, message: '❌ حلقه نداری! برو از عروس فراری بگیر 💍' };
    }
    
    const npc = config.images.npcs?.[npcId] || config.images.enemies?.[npcId];
    
    // شانس قبولی ۵۰٪
    if (Math.random() < 0.5) {
        player.inventory.ring--;
        player.marry = npcId;
        return { success: true, message: `💍 ${npc?.emoji || ''} ${getMarryDialogue('propose').accept || 'قبول کرد!'}` };
    } else {
        return { success: false, message: `💔 ${npc?.emoji || ''} ${getMarryDialogue('propose').reject || 'نه گفت...'}` };
    }
}

function marry(player, npcId) {
    if (player.marry !== npcId) {
        return { success: false, message: '❌ اول باید خواستگاری کنی و نامزد بشی!' };
    }
    
    const npc = config.images.npcs?.[npcId] || config.images.enemies?.[npcId];
    
    // مزایای ازدواج
    player.maxHp = (player.maxHp || 100) + 200;
    player.hp = player.maxHp;
    player.attack = (player.attack || 5) + 50;
    player.defense = (player.defense || 2) + 20;
    
    return { success: true, message: `👰 ${npc?.emoji || ''} ${getMarryDialogue('marry').text || 'عروسی کردید!'}\n\n💍 *مزایای ازدواج:*\n❤️ +۲۰۰ جان\n⚔️ +۵۰ حمله\n🛡️ +۲۰ دفاع` };
}

function divorce(player, npcId) {
    if (player.marry !== npcId) {
        return { success: false, message: '❌ با این NPC ازدواج نکردی!' };
    }
    
    player.marry = null;
    player.maxHp = (player.maxHp || 300) - 200;
    player.hp = Math.min(player.hp, player.maxHp);
    player.attack = (player.attack || 55) - 50;
    player.defense = (player.defense || 22) - 20;
    
    const npc = config.images.npcs?.[npcId] || config.images.enemies?.[npcId];
    
    return { success: true, message: `💔 ${npc?.emoji || ''} ${getMarryDialogue('divorce').text || 'طلاق گرفتید!'}\n\n💔 *مزایای ازدواج حذف شد*` };
}

module.exports = { propose, marry, divorce };