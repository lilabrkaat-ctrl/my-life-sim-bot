const config = require('./config');

function triggerRandomEvent(player, action) {
    const ev = config.images.events;
    if (!ev) return null;
    
    const r = Math.random();
    let result = null;

    if (action === 'gather') {
        if (r < 0.03 && ev.treasure_chest) { player.inventory.gold += 20; result = { msg: '📦 *صندوق گنج!* +۲۰👑', img: ev.treasure_chest.file_id }; }
        else if (r < 0.08 && ev.beehive) { player.inventory.meat += 5; result = { msg: '🍯 *کندوی عسل!* +۵🍖', img: ev.beehive.file_id }; }
        else if (r < 0.14 && ev.snake_event) { player.hp = Math.max(1, player.hp - 10); result = { msg: '🐍 *مار گزیدت!* -۱۰❤️', img: ev.snake_event.file_id }; }
        else if (r < 0.18 && ev.rainbow) { player.hp = Math.min(player.maxHp, player.hp + 15); result = { msg: '🌈 *رنگین‌کمان!* +۱۵❤️', img: ev.rainbow.file_id }; }
        else if (r < 0.22 && ev.fire) { player.hp = Math.max(1, player.hp - 5); player.inventory.iron += 3; result = { msg: '🔥 *آتش!* -۵❤️ +۳⛏️', img: ev.fire.file_id }; }
        else if (r < 0.26 && ev.eagle) { player.inventory.meat += 6; result = { msg: '🦅 *عقاب شکار کرد!* +۶🍖', img: ev.eagle.file_id }; }
        else if (r < 0.30 && ev.magic_mushroom) { player.hp = Math.min(player.maxHp, player.hp + 25); result = { msg: '🍄 *قارچ جادویی!* +۲۵❤️', img: ev.magic_mushroom.file_id }; }
        else if (r < 0.33 && ev.diamond) { player.inventory.gold += 50; result = { msg: '💎 *الماس!* +۵۰👑', img: ev.diamond.file_id }; }
        else if (r < 0.36 && ev.magic_potion) { player.attack += 2; result = { msg: '🧪 *معجون!* +۲⚔️ دائمی', img: ev.magic_potion.file_id }; }
    }

    if (action === 'travel') {
        if (r < 0.10 && ev.treasure_chest) { player.inventory.gold += 15; result = { msg: '📦 *صندوق گنج تو راه!* +۱۵👑', img: ev.treasure_chest.file_id }; }
        else if (r < 0.20 && ev.crystal) { player.xp += 20; result = { msg: '🔮 *کریستال جادویی!* +۲۰✨', img: ev.crystal.file_id }; }
        else if (r < 0.30 && ev.tornado) { result = { msg: '🌪 *گردباد!* پرتت کرد!', img: ev.tornado.file_id, teleport: true }; }
        else if (r < 0.35 && ev.snow) { player.hp = Math.min(player.maxHp, player.hp + 10); result = { msg: '❄️ *برف!* +۱۰❤️', img: ev.snow.file_id }; }
        else if (r < 0.40 && ev.eagle) { result = { msg: '🦅 *عقاب از آسمون نگات می‌کنه!*', img: ev.eagle.file_id }; }
    }

    return result;
}

function checkNpcEncounter(player, action, location) {
    const r = Math.random();
    let npcId = null;

    if (action === 'gather' && location === 'forest') {
        if (r < 0.08) npcId = 'witch';
        else if (r < 0.13) npcId = 'fairy';
        else if (r < 0.16) npcId = 'werewolf';
    }
    if (action === 'gather' && location === 'cave') {
        if (r < 0.10) npcId = 'ghost';
        else if (r < 0.18) npcId = 'skeleton';
    }
    if (action === 'travel') {
        if (r < 0.06) npcId = 'knight';
        else if (r < 0.11) npcId = 'prince';
        else if (r < 0.16) npcId = 'wizard';
        else if (r < 0.19) npcId = 'sage';
        else if (r < 0.22) npcId = 'farmer';
    }
    if (action === 'gather' && location === 'village') {
        if (r < 0.05) npcId = 'angel';
        else if (r < 0.10) npcId = 'jester';
        else if (r < 0.15) npcId = 'merchant';
    }

    return npcId;
}

module.exports = { triggerRandomEvent, checkNpcEncounter };