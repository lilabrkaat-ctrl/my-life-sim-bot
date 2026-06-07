const config = require('./config');

function triggerRandomEvent(player, action) {
    const ev = config.images.events;
    if (!ev) return null;
    
    const r = Math.random();
    let result = null;

    if (action === 'gather') {
        if (r < 0.03 && ev.treasure_chest) { 
            player.inventory.gold = (player.inventory.gold || 0) + 30; 
            result = { msg: '📦 *گنج پر ارزش!* +۳۰👑', img: ev.treasure_chest.file_id }; 
        }
        else if (r < 0.06 && ev.treasure) { 
            player.inventory.gold = (player.inventory.gold || 0) + 10; 
            result = { msg: '💰 *گنج کوچیک!* +۱۰👑', img: ev.treasure.file_id }; 
        }
        else if (r < 0.10 && ev.beehive) { 
            player.inventory.meat = (player.inventory.meat || 0) + 5; 
            result = { msg: '🍯 *کندوی عسل!* +۵🍖', img: ev.beehive.file_id }; 
        }
        else if (r < 0.16 && ev.snake_event) { 
            player.hp = Math.max(1, (player.hp || 100) - 10); 
            result = { msg: '🐍 *مار گزیدت!* -۱۰❤️', img: ev.snake_event.file_id }; 
        }
        else if (r < 0.20 && ev.rainbow) { 
            player.hp = Math.min((player.maxHp || 100), (player.hp || 100) + 20); 
            result = { msg: '🌈 *رنگین کمان!* +۲۰❤️', img: ev.rainbow.file_id }; 
        }
        else if (r < 0.24 && ev.fire) { 
            player.hp = Math.max(1, (player.hp || 100) - 5); 
            player.inventory.iron = (player.inventory.iron || 0) + 3; 
            result = { msg: '🔥 *آتش!* -۵❤️ +۳⛏️', img: ev.fire.file_id }; 
        }
        else if (r < 0.28 && ev.eagle) { 
            player.inventory.meat = (player.inventory.meat || 0) + 6; 
            result = { msg: '🦅 *عقاب شکار کرد!* +۶🍖', img: ev.eagle.file_id }; 
        }
        else if (r < 0.31 && ev.magic_mushroom) { 
            player.hp = Math.min((player.maxHp || 100), (player.hp || 100) + 25); 
            result = { msg: '🍄 *قارچ جادویی!* +۲۵❤️', img: ev.magic_mushroom.file_id }; 
        }
        else if (r < 0.34 && ev.diamond) { 
            player.inventory.gold = (player.inventory.gold || 0) + 50; 
            result = { msg: '💎 *صندوق الماس!* +۵۰👑', img: ev.diamond.file_id }; 
        }
        else if (r < 0.37 && ev.magic_potion) { 
            player.attack = (player.attack || 5) + 2; 
            result = { msg: '🧪 *طلسم جادوگر!* +۲⚔️ دائمی', img: ev.magic_potion.file_id }; 
        }
        else if (r < 0.40 && ev.crystal) { 
            player.xp = (player.xp || 0) + 15; 
            result = { msg: '🔮 *کریستال!* +۱۵✨', img: ev.crystal.file_id }; 
        }
        else if (r < 0.43 && ev.lightning) { 
            player.hp = Math.max(1, (player.hp || 100) - 15); 
            player.inventory.iron = (player.inventory.iron || 0) + 5; 
            result = { msg: '⚡ *رعد و برق!* -۱۵❤️ +۵⛏️', img: ev.lightning.file_id }; 
        }
        else if (r < 0.46 && ev.snow) { 
            player.hp = Math.min((player.maxHp || 100), (player.hp || 100) + 10); 
            result = { msg: '❄️ *برف!* +۱۰❤️', img: ev.snow.file_id }; 
        }
    }

    if (action === 'travel') {
        if (r < 0.08 && ev.treasure_chest) { 
            player.inventory.gold = (player.inventory.gold || 0) + 20; 
            result = { msg: '📦 *گنج پر ارزش تو راه!* +۲۰👑', img: ev.treasure_chest.file_id }; 
        }
        else if (r < 0.15 && ev.crystal) { 
            player.xp = (player.xp || 0) + 20; 
            result = { msg: '🔮 *کریستال جادویی!* +۲۰✨', img: ev.crystal.file_id }; 
        }
        else if (r < 0.22 && ev.tornado) { 
            result = { msg: '🌪 *گردباد!* پرتت کرد یه جای دیگه!', img: ev.tornado.file_id, teleport: true }; 
        }
        else if (r < 0.28 && ev.snow) { 
            player.hp = Math.min((player.maxHp || 100), (player.hp || 100) + 10); 
            result = { msg: '❄️ *برف!* +۱۰❤️', img: ev.snow.file_id }; 
        }
        else if (r < 0.33 && ev.eagle) { 
            result = { msg: '🦅 *عقاب از آسمون نگات می‌کنه!*', img: ev.eagle.file_id }; 
        }
        else if (r < 0.38 && ev.lightning) { 
            player.hp = Math.max(1, (player.hp || 100) - 10); 
            result = { msg: '⚡ *رعد و برق!* -۱۰❤️', img: ev.lightning.file_id }; 
        }
        else if (r < 0.43 && ev.rainbow) { 
            player.hp = Math.min((player.maxHp || 100), (player.hp || 100) + 15); 
            result = { msg: '🌈 *رنگین کمان تو راه!* +۱۵❤️', img: ev.rainbow.file_id }; 
        }
        else if (r < 0.48 && ev.magic_potion) { 
            player.attack = (player.attack || 5) + 1; 
            result = { msg: '🧪 *طلسم جادوگر!* +۱⚔️ دائمی', img: ev.magic_potion.file_id }; 
        }
        else if (r < 0.52 && ev.diamond) { 
            player.inventory.gold = (player.inventory.gold || 0) + 30; 
            result = { msg: '💎 *صندوق الماس!* +۳۰👑', img: ev.diamond.file_id }; 
        }
    }

    return result;
}

function checkNpcEncounter(player, action, location) {
    const r = Math.random();
    let npcId = null;

    if (player.house && player.house.length >= (config.houseSettings?.maxSlots || 3)) {
        return null;
    }

    const validNpcs = config.images.npcs ? Object.keys(config.images.npcs) : [];

    if (action === 'gather' && location === 'forest') {
        if (r < 0.25 && validNpcs.includes('witch')) npcId = 'witch';
        else if (r < 0.40 && validNpcs.includes('fairy')) npcId = 'fairy';
        else if (r < 0.50 && validNpcs.includes('werewolf')) npcId = 'werewolf';
        else if (r < 0.60 && validNpcs.includes('sage')) npcId = 'sage';
    }
    if (action === 'gather' && location === 'cave') {
        if (r < 0.30 && validNpcs.includes('ghost_sexy')) npcId = 'ghost_sexy';
        else if (r < 0.50 && validNpcs.includes('skeleton')) npcId = 'skeleton';
        else if (r < 0.65 && validNpcs.includes('wizard')) npcId = 'wizard';
        else if (r < 0.80 && validNpcs.includes('vampire')) npcId = 'vampire';
    }
    if (action === 'travel') {
        if (r < 0.20 && validNpcs.includes('knight')) npcId = 'knight';
        else if (r < 0.35 && validNpcs.includes('prince')) npcId = 'prince';
        else if (r < 0.50 && validNpcs.includes('wizard')) npcId = 'wizard';
        else if (r < 0.60 && validNpcs.includes('sage')) npcId = 'sage';
        else if (r < 0.70 && validNpcs.includes('farmer')) npcId = 'farmer';
        else if (r < 0.80 && validNpcs.includes('jester')) npcId = 'jester';
        else if (r < 0.90 && validNpcs.includes('angel')) npcId = 'angel';
    }
    if (action === 'gather' && location === 'village') {
        if (r < 0.20 && validNpcs.includes('angel')) npcId = 'angel';
        else if (r < 0.35 && validNpcs.includes('jester')) npcId = 'jester';
        else if (r < 0.50 && validNpcs.includes('merchant')) npcId = 'merchant';
        else if (r < 0.60 && validNpcs.includes('farmer')) npcId = 'farmer';
        else if (r < 0.75 && validNpcs.includes('bride')) npcId = 'bride';
        else if (r < 0.90 && validNpcs.includes('singer')) npcId = 'singer';
    }
    if (action === 'gather' && location === 'mountain') {
        if (r < 0.25 && validNpcs.includes('blacksmith')) npcId = 'blacksmith';
        else if (r < 0.40 && validNpcs.includes('knight')) npcId = 'knight';
        else if (r < 0.55 && validNpcs.includes('young_witch')) npcId = 'young_witch';
    }
    if (action === 'gather' && location === 'plain') {
        if (r < 0.25 && validNpcs.includes('knight')) npcId = 'knight';
        else if (r < 0.40 && validNpcs.includes('prince')) npcId = 'prince';
        else if (r < 0.55 && validNpcs.includes('bandit_female')) npcId = 'bandit_female';
    }
    if (action === 'gather' && location === 'desert') {
        if (r < 0.30 && validNpcs.includes('witch')) npcId = 'witch';
        else if (r < 0.45 && validNpcs.includes('prince')) npcId = 'prince';
        else if (r < 0.60 && validNpcs.includes('genie')) npcId = 'genie';
    }
    if (action === 'gather' && location === 'river') {
        if (r < 0.30 && validNpcs.includes('mermaid')) npcId = 'mermaid';
    }

    return npcId;
}

module.exports = { triggerRandomEvent, checkNpcEncounter };