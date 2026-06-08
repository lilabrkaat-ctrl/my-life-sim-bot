const config = require('./config');
const { getTimeOfDay } = require('./player');
const activeBattles = {};

const animations = {
    magic: 'CgACAgQAAxkBAAEqLflqIwn95lMF2X_HmipPQR6-l15QEwACsBwAAiiYGVEtH6Hh1OaSvTsE',
    dragon: 'CgACAgQAAxkBAAEqLfdqIwn9C-y0z3D0l8MfUYPa3dIHwAACmhwAAiiYGVG2mdi_jGe3AjsE',
    damage: 'CgACAgQAAxkBAAEqLfhqIwn9sRbE1qunXL1XWg3QkXcRCgACqxwAAiiYGVG3erS7MeKUoTsE',
    heal: 'CgACAgQAAxkBAAEqLsBqIxe3emIP2Fh4QtjKq96Rf8z95AAC9B8AAn4RGFFV9Ndj3CrAuDsE',
    fire: 'CgACAgQAAxkBAAEqLsFqIxe3l2O8cm0nZ2isbVxO2BC-QQACCyAAAn4RGFHHp4PTxPZjVTsE',
    levelup: 'CgACAgQAAxkBAAEqLstqIxe31ugPDQ-cHCbwGkNhJ-PCnAACFCAAAn4RGFEJFR7ZyREyTDsE',
    escape: 'CgACAgQAAxkBAAEqLslqIxe3I_pbDijfOoaA8KpkSKM5FAACEiAAAn4RGFF6LZ6XVqIrbTsE',
    treasure: 'CgACAgQAAxkBAAEqLsVqIxe3OomIRGM9gLgsnpw8F7mh5gACECAAAn4RGFEvJxvIRXlaGDsE',
    angel_heal: 'CgACAgQAAxkBAAEqLsZqIxe3aY30jIhHeTSC9bXio7KOkAACESAAAn4RGFG2IV0p66Bn0jsE',
    sunrise: 'CgACAgQAAxkBAAEqLsJqIxe3mi40nLyoVjUO6F9ItlrA9QACDSAAAn4RGFEf4E1UGbo9tjsE',
    berserker: 'CgACAgQAAxkBAAEqRWVqJYa2TVUFK_nSAvIt3SIiIAOg5wACixkAAkAyMVGfJUjqLpALJzsE',
    finishers: [
        'CgACAgQAAxkBAAEqRWZqJYa2e9FkXsztJ-BOXzyyjXfN5wACmxkAAkAyMVHaZAocqbHGbzsE',
        'CgACAgQAAxkBAAEqRWdqJYa2TaaQzKc4W4qkFSPWKvwi9wACnRkAAkAyMVEYchd_ykOmTjsE',
        'CgACAgQAAxkBAAEqRWlqJYa2fDow-DNQIg9-dAPS7U4mvQACeQkAAhIaHFHlkzt2PO4tOjsE',
        'CgACAgQAAxkBAAEqRWpqJYa2uomoiYOxOviaFlGmOoFa6wACswYAAuRYtVJ0ZNS8EgyklzsE',
        'CgACAgQAAxkBAAEqRWxqJYa2Ej-2qNGT0topYPHCv92E9AACoBkAAkAyMVE2H37n_FRKNjsE',
        'CgACAgQAAxkBAAEqRW5qJYa2yJzekFeRpBCj6Ltik2O72AACoRkAAkAyMVGfRbpmel7AcjsE'
    ],
    spell: 'CgACAgQAAxkBAAEqLflqIwn95lMF2X_HmipPQR6-l15QEwACsBwAAiiYGVEtH6Hh1OaSvTsE',
    bride: ['CgACAgQAAxkBAAEqOj9qJG3NfiO1gkMUOrvCSNVIr6IEpQAC7x0AAn4RIFHFrkfbT_8nmzsE', 'CgACAgQAAxkBAAEqOkBqJG3N0cWnm1jquRG3VL_rXww-5AAC9R0AAn4RIFGZG58QxOaIxzsE', 'CgACAgQAAxkBAAEqOkJqJG3N5gz64qgv8PSjzapOl4CK6gAC9x0AAn4RIFHhRbdHVJmS2TsE'],
    mermaid: ['CgACAgQAAxkBAAEqOkNqJG3NvRCafTUH3p8CqA--bmCpggAC-R0AAn4RIFGVBmGKu14XzDsE', 'CgACAgQAAxkBAAEqOkRqJG3NeW_TbQm3-OM6cmZZrRsgfQAC-x0AAn4RIFHtLk6v0vB9sTsE', 'CgACAgQAAxkBAAEqOkZqJG3Nm0O_i1mqV_qHFy4y5gv5hAAC_B0AAn4RIFEJAXO72Rtg3DsE'],
    young_witch: ['CgACAgQAAxkBAAEqOkhqJG3NjA04jvxfyUlR414WjSPS6gACCB4AAn4RIFFVG52gsjKE2jsE', 'CgACAgQAAxkBAAEqOktqJG3Nzqtkl_I6-d18ab3-kGz9pQACCR4AAn4RIFG4veGbLRgkpjsE'],
    singer: ['CgACAgQAAxkBAAEqOkxqJG3NQFsxVEaNhpyaAxi4gevcaAACDx4AAn4RIFGYsb_3L6-ZoTsE', 'CgACAgQAAxkBAAEqOk5qJG3NaMmpiI8eIHxti3BHf2pWbgACEB4AAn4RIFEOZrUQKyFrmjsE'],
    vampire: ['CgACAgQAAxkBAAEqOlNqJG3aUbWRUezNuDxvuptqxrZkLgAC4h0AAn4RIFHNPi8KsHaoFDsE'],
    genie: ['CgACAgQAAxkBAAEqOlRqJG3adXKT9fNQR1w6mroEDtH1jQAC5R0AAn4RIFFpF2eGhqofdDsE'],
    bandit_female: ['CgACAgQAAxkBAAEqOlVqJG3a13IUOAkh16KTgBAiWpDxFwAC5x0AAn4RIFGbxUIKqfWb0zsE']
};

function getNpcAnimation(npcKey) {
    if (animations[npcKey]) {
        const arr = animations[npcKey];
        return arr[Math.floor(Math.random() * arr.length)];
    }
    return null;
}

function startFight(player) {
    const keys = config.locationEnemies[player.location];
    if (!keys || keys.length === 0) return { success: false, message: '⚠️ اینجا دشمنی نیست!', animation: null };

    let k = keys[Math.floor(Math.random() * keys.length)];
    let d = config.images.enemies[k];
    
    if (!d || !d.hp) {
        const allEnemies = Object.keys(config.images.enemies).filter(key => config.images.enemies[key] && config.images.enemies[key].hp);
        if (allEnemies.length === 0) return { success: false, message: '⚠️ دشمنی پیدا نشد!', animation: null };
        k = allEnemies[Math.floor(Math.random() * allEnemies.length)];
        d = config.images.enemies[k];
    }
    
    let isEnraged = false;
    if (player.enraged && player.enraged[k]) isEnraged = true;
    
    const time = getTimeOfDay();
    
    const enemy = {
        key: k, 
        name: isEnraged ? `😡 ${d.name || 'دشمن'}` : (d.name || 'دشمن'), 
        emoji: d.emoji || '👾', file_id: d.file_id || null,
        hp: isEnraged ? Math.floor((d.hp || 20) * 2) : (d.hp || 20), 
        maxHp: isEnraged ? Math.floor((d.hp || 20) * 2) : (d.hp || 20), 
        attack: isEnraged ? Math.floor((d.attack || 5) * 2) : (d.attack || 5),
        reward: isEnraged ? {
            xp: (d.reward?.xp || 10) * 2, gold: (d.reward?.gold || 0) * 2,
            skin: (d.reward?.skin || 0) * 2, meat: (d.reward?.meat || 0) * 2,
            iron: (d.reward?.iron || 0) * 2, ring: (d.reward?.ring || 0) * 2,
            tear: (d.reward?.tear || 0) * 2, spell: (d.reward?.spell || 0) * 2,
            song: (d.reward?.song || 0) * 2, blood: (d.reward?.blood || 0) * 2,
            wish: (d.reward?.wish || 0) * 2, key: (d.reward?.key || 0) * 2
        } : JSON.parse(JSON.stringify(d.reward || { xp: 10 })),
        status: 'fighting', isPlayer: false, isEnraged: isEnraged
    };

    // اثر زمان روی دشمن
    if (time.enemyMultiplier !== 1) {
        enemy.hp = Math.floor(enemy.hp * time.enemyMultiplier);
        enemy.maxHp = enemy.hp;
        enemy.attack = Math.floor(enemy.attack * time.enemyMultiplier);
        if (enemy.reward) {
            enemy.reward.xp = Math.floor((enemy.reward.xp || 10) * time.rewardMultiplier);
            enemy.reward.gold = Math.floor((enemy.reward.gold || 0) * time.rewardMultiplier);
        }
    }

    let anim = null;
    if (k === 'dragon') anim = animations.dragon;
    else anim = getNpcAnimation(k);

    return { success: true, enemy, message: formatBattle(player, enemy), animation: anim };
}

function startPvPFight(player1, player2) {
    const enemy1 = { name: player2.name, emoji: '👤', hp: player2.hp, maxHp: player2.maxHp, attack: player2.attack, defense: player2.defense, isPlayer: true, opponentId: player2.chatId };
    const enemy2 = { name: player1.name, emoji: '👤', hp: player1.hp, maxHp: player1.maxHp, attack: player1.attack, defense: player1.defense, isPlayer: true, opponentId: player1.chatId };
    activeBattles[player1.chatId] = enemy1;
    activeBattles[player2.chatId] = enemy2;
    return { enemy1, enemy2 };
}

function playerAttack(player, enemy) {
    let log = '';
    const r = Math.random();
    let dmg;
    let animation = null;

    if (r < 0.15) { dmg = player.attack * 2; log += '💥 *ضربه انتقادی!* '; animation = animations.magic; }
    else if (r < 0.35) { dmg = Math.floor(player.attack * 1.5); log += '🔥 *قدرتمند!* '; animation = animations.fire; }
    else if (r > 0.85) { dmg = Math.floor(player.attack * 0.5); log += '😕 *ضعیف...* '; }
    else { dmg = player.attack; log += '🗡️ '; }

    if (player.hp < player.maxHp * 0.20) {
        dmg = Math.floor(dmg * 1.5);
        animation = animations.berserker;
        log += '🩸 *برسرکر!* ';
    }

    let finisherAnimation = null;
    if (enemy.hp <= enemy.maxHp * 0.15) {
        finisherAnimation = animations.finishers[Math.floor(Math.random() * animations.finishers.length)];
        log += '💀 *فینیشر!* ';
    }

    enemy.hp -= dmg;
    if (enemy.hp < 0) enemy.hp = 0;
    log += `${dmg} ضربه | ${hpBar(enemy.hp, enemy.maxHp)}\n`;

    if (enemy.hp <= 0) {
        if (enemy.isPlayer) {
            log += `💀 ${enemy.name} کشته شد! +۵۰🏆`;
            player.score = (player.score || 0) + 50;
            require('./player').checkUnlocks(player);
            return { battleOver: true, playerWon: true, message: log, isPvP: true, animation: animations.levelup };
        }
        
        log += `💀 ${enemy.name} کشته شد! 🎉 +${enemy.reward.xp}✨`;
        player.xp += enemy.reward.xp || 10;
        player.enemiesDefeated = (player.enemiesDefeated || 0) + 1;
        player.score = (player.score || 0) + (enemy.isEnraged ? 40 : 20);
        
        for (let rw in enemy.reward) {
            if (rw !== 'xp' && player.inventory[rw] !== undefined) {
                player.inventory[rw] += enemy.reward[rw] || 1;
                log += `${config.images.resources[rw]?.emoji || ''} +${enemy.reward[rw]}\n`;
            }
        }
        
        const leveledUp = require('./player').checkLevelUp(player);
        if (leveledUp) { log += '⬆️ لول آپ! '; animation = animations.levelup; }
        require('./player').checkUnlocks(player);
        
        if (enemy.isEnraged) {
            if (player.enraged) delete player.enraged[enemy.key];
            return { battleOver: true, playerWon: true, message: log, canCapture: true, npcId: enemy.key, animation: finisherAnimation || animation };
        }
        
        const npcKeys = ['witch', 'ghost', 'fairy', 'angel', 'knight', 'jester', 'prince', 'skeleton', 'werewolf', 'wizard', 'knight_enemy', 'queen', 'bride', 'mermaid', 'young_witch', 'singer', 'vampire', 'genie', 'bandit_female'];
        if (npcKeys.includes(enemy.key) && Math.random() < 0.4) {
            return { battleOver: true, playerWon: true, message: log, canCapture: true, npcId: enemy.key, animation: finisherAnimation || animation };
        }
        
        return { battleOver: true, playerWon: true, message: log, animation: finisherAnimation || animation };
    }

    if (!enemy.isPlayer && enemy.hp < enemy.maxHp * 0.25) {
        const roll = Math.random();
        if (roll < 0.55) { log += `🏃 ${enemy.name} فرار کرد!`; return { battleOver: true, playerWon: false, message: log, animation: animations.escape, escaped: true, escapedNpc: enemy.key }; }
        else if (roll < 0.80) { enemy.status = 'trapped'; log += `🔒 ${enemy.name} محاصره شد!`; return { battleOver: false, message: log, animation: null }; }
    }

    return enemyTurn(player, enemy, log, animation);
}

function useSpell(player, enemy) {
    if ((player.inventory?.spell || 0) < 1) return { success: false, message: '❌ طلسم نداری!' };
    player.inventory.spell--;
    const dmg = Math.floor(enemy.maxHp * 0.25);
    enemy.hp -= dmg;
    if (enemy.hp < 0) enemy.hp = 0;
    let log = `📜 *طلسم!* -${dmg} ضربه جادویی!\n${hpBar(enemy.hp, enemy.maxHp)}\n`;
    if (enemy.hp <= 0) {
        log += `💀 ${enemy.name} با طلسم کشته شد! 🎉 +${enemy.reward.xp}✨`;
        player.xp += enemy.reward.xp || 10;
        player.enemiesDefeated = (player.enemiesDefeated || 0) + 1;
        player.score = (player.score || 0) + (enemy.isEnraged ? 40 : 20);
        for (let rw in enemy.reward) {
            if (rw !== 'xp' && player.inventory[rw] !== undefined) {
                player.inventory[rw] += enemy.reward[rw] || 1;
                log += `${config.images.resources[rw]?.emoji || ''} +${enemy.reward[rw]}\n`;
            }
        }
        const leveledUp = require('./player').checkLevelUp(player);
        if (leveledUp) log += '⬆️ لول آپ! ';
        require('./player').checkUnlocks(player);
        const npcKeys = ['witch', 'ghost', 'fairy', 'angel', 'knight', 'jester', 'prince', 'skeleton', 'werewolf', 'wizard', 'knight_enemy', 'queen', 'bride', 'mermaid', 'young_witch', 'singer', 'vampire', 'genie', 'bandit_female'];
        if (npcKeys.includes(enemy.key) && Math.random() < 0.4) return { battleOver: true, playerWon: true, message: log, canCapture: true, npcId: enemy.key, animation: animations.spell };
        return { battleOver: true, playerWon: true, message: log, animation: animations.spell };
    }
    return { battleOver: false, message: log, animation: animations.spell };
}

function useFinisher(player, enemy) {
    if ((player.inventory?.finisher || 0) < 1) return { success: false, message: '❌ فنیشر نداری!' };
    player.inventory.finisher--;
    const dmg = enemy.hp;
    enemy.hp = 0;
    const finisherAnimation = animations.finishers[Math.floor(Math.random() * animations.finishers.length)];
    let log = `💀 *فینیشر!* ${dmg} ضربه مرگبار!\n💀 ${enemy.name} کشته شد! 🎉 +${enemy.reward.xp}✨`;
    player.xp += enemy.reward.xp || 10;
    player.enemiesDefeated = (player.enemiesDefeated || 0) + 1;
    player.score = (player.score || 0) + (enemy.isEnraged ? 40 : 20);
    for (let rw in enemy.reward) {
        if (rw !== 'xp' && player.inventory[rw] !== undefined) {
            player.inventory[rw] += enemy.reward[rw] || 1;
            log += `\n${config.images.resources[rw]?.emoji || ''} +${enemy.reward[rw]}`;
        }
    }
    const leveledUp = require('./player').checkLevelUp(player);
    if (leveledUp) log += '\n⬆️ لول آپ! ';
    require('./player').checkUnlocks(player);
    const npcKeys = ['witch', 'ghost', 'fairy', 'angel', 'knight', 'jester', 'prince', 'skeleton', 'werewolf', 'wizard', 'knight_enemy', 'queen', 'bride', 'mermaid', 'young_witch', 'singer', 'vampire', 'genie', 'bandit_female'];
    if (npcKeys.includes(enemy.key) && Math.random() < 0.4) return { battleOver: true, playerWon: true, message: log, canCapture: true, npcId: enemy.key, animation: finisherAnimation };
    return { battleOver: true, playerWon: true, message: log, animation: finisherAnimation };
}

function enemyTurn(player, enemy, log, animation) {
    if (enemy.status === 'trapped') return { battleOver: false, message: log, animation: null };
    const dmg = Math.max(1, enemy.attack - Math.floor((player.defense || 2) / 3));
    player.hp -= dmg;
    if (player.hp < 0) player.hp = 0;
    log += `💢 ${enemy.name} ${dmg} زد! | ${hpBar(player.hp, player.maxHp)}\n`;
    if (player.hp <= 0) {
        player.hp = Math.floor(player.maxHp / 2);
        player.xp = Math.max(0, player.xp - 5);
        player.inventory.gold = Math.max(0, player.inventory.gold - 5);
        player.score = Math.max(0, (player.score || 0) - 10);
        player.location = 'village';
        log += `💀 *مردی!* به روستا برگشتی.`;
        return { battleOver: true, playerWon: false, message: log, animation: animations.damage };
    }
    return { battleOver: false, message: log, animation: animations.damage };
}

function playerEscape(player, enemy) {
    const r = Math.random();
    if (r < 0.65) return { battleOver: true, escaped: true, message: '💨 فرار کردی!', animation: animations.escape };
    else if (r < 0.90) {
        enemy.status = 'trapped_player';
        const dmg = Math.max(1, Math.floor(enemy.attack * 1.3));
        player.hp -= dmg;
        if (player.hp < 0) player.hp = 0;
        let msg = `🔒 محاصره شدی! ${enemy.name} ${dmg} زد!`;
        if (player.hp <= 0) { player.hp = Math.floor(player.maxHp / 2); player.location = 'village'; player.score = Math.max(0, (player.score || 0) - 10); msg += '💀 مردی! به روستا برگشتی.'; return { battleOver: true, escaped: false, message: msg, animation: animations.damage }; }
        return { battleOver: false, escaped: false, message: msg, animation: animations.damage };
    }
    return { battleOver: false, escaped: false, message: '😬 نتونستی فرار کنی!', animation: null };
}

function hpBar(c, m) {
    const p = Math.max(0, c / m);
    const filled = Math.max(0, Math.floor(p * 10));
    let bar = '';
    for (let i = 0; i < 10; i++) {
        if (i < filled) {
            if (i < 6) bar += '🟩';
            else if (i < 8) bar += '🟨';
            else bar += '🟥';
        } else {
            bar += '⬛';
        }
    }
    return `${bar} ${Math.floor(p * 100)}٪`;
}

function formatBattle(p, e) {
    return `⚔️ ${e.emoji} ${e.name}\n${hpBar(e.hp, e.maxHp)}\n👤 تو\n${hpBar(p.hp, p.maxHp)} | ⚔️${p.attack} 🛡️${p.defense}`;
}

function getBattleKeyboard(player, enemy) {
    const b = [['⚔️ 🗡️ حمله کن']];
    if ((player.inventory?.spell || 0) > 0) b.push(['📜 طلسم']);
    if ((player.inventory?.finisher || 0) > 0) b.push(['💀 فنیشر']);
    if (!enemy?.trapped_player) b.push(['🏃 💨 فرار کن']);
    return { reply_markup: { keyboard: b, resize_keyboard: true } };
}

module.exports = { activeBattles, startFight, startPvPFight, playerAttack, useSpell, useFinisher, playerEscape, formatBattle, getBattleKeyboard, animations };