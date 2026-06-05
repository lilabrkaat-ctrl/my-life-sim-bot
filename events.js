const config = require('./config');

function triggerRandomEvent(player, action) {
    const ev = config.images.events;
    if (!ev) return null;
    
    const r = Math.random();
    let result = null;

    if (action === 'gather') {
        if (r < 0.03 && ev.treasure_chest) { 
            player.inventory.gold += 30; 
            result = { msg: '📦 *گنج پر ارزش!* +۳۰👑', img: ev.treasure_chest.file_id }; 
        }
        else if (r < 0.06 && ev.treasure) { 
            player.inventory.gold += 10; 
            result = { msg: '💰 *گنج کوچیک!* +۱۰👑', img: ev.treasure.file_id }; 
        }
        else if (r < 0.10 && ev.beehive) { 
            player.inventory.meat += 5; 
            result = { msg: '🍯 *کندوی عسل!* +۵🍖', img: ev.beehive.file_id }; 
        }
        else if (r < 0.16 && ev.snake_event) { 
            player.hp = Math.max(1, player.hp - 10); 
            result = { msg: '🐍 *مار گزیدت!* -۱۰❤️', img: ev.snake_event.file_id }; 
        }
        else if (r < 0.20 && ev.rainbow) { 
            player.hp = Math.min(player.maxHp, player.hp + 20); 
            result = { msg: '🌈 *رنگین کمان!* +۲۰❤️', img: ev.rainbow.file_id }; 
        }
        else if (r < 0.24 && ev.fire) { 
            player.hp = Math.max(1, player.hp - 5); 
            player.inventory.iron += 3; 
            result = { msg: '🔥 *آتش!* -۵❤️ +۳⛏️', img: ev.fire.file_id }; 
        }
        else if (r < 0.28 && ev.eagle) { 
            player.inventory.meat += 6; 
            result = { msg: '🦅 *عقاب شکار کرد!* +۶🍖', img: ev.eagle.file_id }; 
        }
        else if (r < 0.31 && ev.magic_mushroom) { 
            player.hp = Math.min(player.maxHp, player.hp + 25); 
            result = { msg: '🍄 *قارچ جادویی!* +۲۵❤️', img: ev.magic_mushroom.file_id }; 
        }
        else if (r < 0.34 && ev.diamond) { 
            player.inventory.gold += 50; 
            result = { msg: '💎 *صندوق الماس!* +۵۰👑', img: ev.diamond.file_id }; 
        }
        else if (r < 0.37 && ev.magic_potion) { 
            player.attack += 2; 
            result = { msg: '🧪 *طلسم جادوگر!* +۲⚔️ دائمی', img: ev.magic_potion.file_id }; 
        }
        else if (r < 0.40 && ev.crystal) { 
            player.xp += 15; 
            result = { msg: '🔮 *کریستال!* +۱۵✨', img: ev.crystal.file_id }; 
        }
        else if (r < 0.43 && ev.lightning) { 
            player.hp = Math.max(1, player.hp - 15); 
            player.inventory.iron += 5; 
            result = { msg: '⚡ *رعد و برق!* -۱۵❤️ +۵⛏️', img: ev.lightning.file_id }; 
        }
        else if (r < 0.46 && ev.snow) { 
            player.hp = Math.min(player.maxHp, player.hp + 10); 
            result = { msg: '❄️ *برف!* +۱۰❤️', img: ev.snow.file_id }; 
        }
    }

    if (action === 'travel') {
        if (r < 0.08 && ev.treasure_chest) { 
            player.inventory.gold += 20; 
            result = { msg: '📦 *گنج پر ارزش تو راه!* +۲۰👑', img: ev.treasure_chest.file_id }; 
        }
        else if (r < 0.15 && ev.crystal) { 
            player.xp += 20; 
            result = { msg: '🔮 *کریستال جادویی!* +۲۰✨', img: ev.crystal.file_id }; 
        }
        else if (r < 0.22 && ev.tornado) { 
            result = { msg: '🌪 *گردباد!* پرتت کرد یه جای دیگه!', img: ev.tornado.file_id, teleport: true }; 
        }
        else if (r < 0.28 && ev.snow) { 
            player.hp = Math.min(player.maxHp, player.hp + 10); 
            result = { msg: '❄️ *برف!* +۱۰❤️', img: ev.snow.file_id }; 
        }
        else if (r < 0.33 && ev.eagle) { 
            result = { msg: '🦅 *عقاب از آسمون نگات می‌کنه!*', img: ev.eagle.file_id }; 
        }
        else if (r < 0.38 && ev.lightning) { 
            player.hp = Math.max(1, player.hp - 10); 
            result = { msg: '⚡ *رعد و برق!* -۱۰❤️', img: ev.lightning.file_id }; 
        }
        else if (r < 0.43 && ev.rainbow) { 
            player.hp = Math.min(player.maxHp, player.hp + 15); 
            result = { msg: '🌈 *رنگین کمان تو راه!* +۱۵❤️', img: ev.rainbow.file_id }; 
        }
        else if (r < 0.48 && ev.magic_potion) { 
            player.attack += 1; 
            result = { msg: '🧪 *طلسم جادوگر!* +۱⚔️ دائمی', img: ev.magic_potion.file_id }; 
        }
        else if (r < 0.52 && ev.diamond) { 
            player.inventory.gold += 30; 
            result = { msg: '💎 *صندوق الماس!* +۳۰👑', img: ev.diamond.file_id }; 
        }
    }

    return result;
}

function checkNpcEncounter(player, action, location) {
    const r = Math.random();
    let npcId = null;

    // فقط NPCهایی که توی config.images.npcs هستن
    const validNpcs = config.images.npcs ? Object.keys(config.images.npcs) : [];

    if (action === 'gather' && location === 'forest') {
        if (r < 0.08 && validNpcs.includes('witch')) npcId = 'witch';
        else if (r < 0.13 && validNpcs.includes('fairy')) npcId = 'fairy';
        else if (r < 0.16 && validNpcs.includes('werewolf')) npcId = 'werewolf';
        else if (r < 0.19 && validNpcs.includes('sage')) npcId = 'sage';
    }
    if (action === 'gather' && location === 'cave') {
        if (r < 0.10 && validNpcs.includes('ghost_sexy')) npcId = 'ghost_sexy';
        else if (r < 0.18 && validNpcs.includes('skeleton')) npcId = 'skeleton';
        else if (r < 0.22 && validNpcs.includes('wizard')) npcId = 'wizard';
    }
    if (action === 'travel') {
        if (r < 0.06 && validNpcs.includes('knight')) npcId = 'knight';
        else if (r < 0.11 && validNpcs.includes('prince')) npcId = 'prince';
        else if (r < 0.16 && validNpcs.includes('wizard')) npcId = 'wizard';
        else if (r < 0.19 && validNpcs.includes('sage')) npcId = 'sage';
        else if (r < 0.22 && validNpcs.includes('farmer')) npcId = 'farmer';
        else if (r < 0.25 && validNpcs.includes('jester')) npcId = 'jester';
        else if (r < 0.28 && validNpcs.includes('angel')) npcId = 'angel';
    }
    if (action === 'gather' && location === 'village') {
        if (r < 0.05 && validNpcs.includes('angel')) npcId = 'angel';
        else if (r < 0.10 && validNpcs.includes('jester')) npcId = 'jester';
        else if (r < 0.15 && validNpcs.includes('merchant')) npcId = 'merchant';
        else if (r < 0.18 && validNpcs.includes('farmer')) npcId = 'farmer';
    }
    if (action === 'gather' && location === 'mountain') {
        if (r < 0.08 && validNpcs.includes('blacksmith')) npcId = 'blacksmith';
        else if (r < 0.13 && validNpcs.includes('knight')) npcId = 'knight';
    }
    if (action === 'gather' && location === 'plain') {
        if (r < 0.08 && validNpcs.includes('knight')) npcId = 'knight';
        else if (r < 0.13 && validNpcs.includes('prince')) npcId = 'prince';
    }
    if (action === 'gather' && location === 'desert') {
        if (r < 0.10 && validNpcs.includes('witch')) npcId = 'witch';
        else if (r < 0.15 && validNpcs.includes('prince')) npcId = 'prince';
    }

    return npcId;
}

module.exports = { triggerRandomEvent, checkNpcEncounter };