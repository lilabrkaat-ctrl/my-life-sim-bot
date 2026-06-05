const config = require('./config');

function triggerRandomEvent(player, action) {
    const ev = config.images.events;
    if (!ev) return null;
    
    const r = Math.random();
    let result = null;

    if (action === 'gather') {
        if (r < 0.04 && ev.treasure_chest) { player.inventory.gold += 20; result = { msg: '📦 *صندوق گنج!* +۲۰👑', img: ev.treasure_chest.file_id }; }
        else if (r < 0.10 && ev.beehive) { player.inventory.meat += 5; result = { msg: '🍯 *کندوی عسل!* +۵🍖', img: ev.beehive.file_id }; }
        else if (r < 0.18 && ev.snake_event) { player.hp = Math.max(1, player.hp - 10); result = { msg: '🐍 *مار گزیدت!* -۱۰❤️', img: ev.snake_event.file_id }; }
        else if (r < 0.22 && ev.rainbow) { player.hp = Math.min(player.maxHp, player.hp + 15); result = { msg: '🌈 *رنگین‌کمان!* +۱۵❤️', img: ev.rainbow.file_id }; }
        else if (r < 0.28 && ev.fire) { player.hp = Math.max(1, player.hp - 5); player.inventory.iron += 3; result = { msg: '🔥 *آتش!* -۵❤️ +۳⛏️', img: ev.fire.file_id }; }
        else if (r < 0.33 && ev.eagle) { player.inventory.meat += 6; result = { msg: '🦅 *عقاب شکار کرد!* +۶🍖', img: ev.eagle.file_id }; }
        else if (r < 0.38 && ev.magic_mushroom) { player.hp = Math.min(player.maxHp, player.hp + 25); result = { msg: '🍄 *قارچ جادویی!* +۲۵❤️', img: ev.magic_mushroom.file_id }; }
        else if (r < 0.42 && ev.diamond) { player.inventory.gold += 50; result = { msg: '💎 *الماس کمیاب!* +۵۰👑', img: ev.diamond.file_id }; }
    }

    if (action === 'travel') {
        if (r < 0.06 && config.images.npcs.sage) { player.inventory.meat += 8; result = { msg: '🧙 *پیر فرزانه* +۸🍖', img: config.images.npcs.sage.file_id }; }
        else if (r < 0.12 && ev.treasure_chest) { player.inventory.gold += 15; result = { msg: '📦 *صندوق گنج تو راه!* +۱۵👑', img: ev.treasure_chest.file_id }; }
        else if (r < 0.22) { player.hp = Math.max(1, player.hp - 12); result = { msg: '🤕 *افتادی تو چاله!* -۱۲❤️' }; }
        else if (r < 0.28 && ev.tornado) { result = { msg: '🌪 *گردباد!* پرتت کرد یه جای دیگه!', img: ev.tornado.file_id, teleport: true }; }
        else if (r < 0.33 && ev.crystal) { player.xp += 20; result = { msg: '🔮 *کریستال جادویی!* +۲۰✨', img: ev.crystal.file_id }; }
        else if (r < 0.38 && ev.magic_potion) { player.attack += 3; result = { msg: '🧪 *معجون جادویی!* +۳⚔️ دائمی', img: ev.magic_potion.file_id }; }
    }

    return result;
}

function checkNpcEncounter(player, action, location) {
    const r = Math.random();
    let npcId = null;

    if (action === 'gather' && location === 'forest') {
        if (r < 0.25) npcId = 'witch';
        else if (r < 0.40) npcId = 'fairy';
        else if (r < 0.48) npcId = 'werewolf';
    }
    if (action === 'gather' && location === 'cave') {
        if (r < 0.30) npcId = 'ghost';
        else if (r < 0.50) npcId = 'skeleton';
    }
    if (action === 'travel') {
        if (r < 0.20) npcId = 'knight';
        else if (r < 0.30) npcId = 'prince';
        else if (r < 0.35) npcId = 'wizard';
    }
    if (action === 'gather' && location === 'village') {
        if (r < 0.15) npcId = 'angel';
        else if (r < 0.30) npcId = 'jester';
    }

    return npcId;
}

module.exports = { triggerRandomEvent, checkNpcEncounter };