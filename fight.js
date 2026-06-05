const config = require('./config');
const activeBattles = {};

function startFight(player) {
    const keys = config.locationEnemies[player.location];
    if (!keys || keys.length === 0) return { success: false, message: '⚠️ اینجا دشمنی نیست!' };

    const k = keys[Math.floor(Math.random() * keys.length)];
    const d = config.images.enemies[k];
    if (!d) return { success: false, message: '⚠️ دشمن پیدا نشد!' };
    
    const enemy = {
        key: k, name: d.name, emoji: d.emoji, file_id: d.file_id,
        hp: d.hp, maxHp: d.hp, attack: d.attack,
        reward: JSON.parse(JSON.stringify(d.reward || { xp: 10 })), status: 'fighting'
    };

    return { success: true, enemy, message: formatBattle(player, enemy) };
}

function playerAttack(player, enemy) {
    let log = '';
    const r = Math.random();
    let dmg;

    if (r < 0.15) { dmg = player.attack * 2; log += '💥 '; }
    else if (r < 0.35) { dmg = Math.floor(player.attack * 1.5); log += '⚡ '; }
    else if (r > 0.85) { dmg = Math.floor(player.attack * 0.5); log += '😕 '; }
    else { dmg = player.attack; log += '🗡️ '; }

    enemy.hp -= dmg;
    if (enemy.hp < 0) enemy.hp = 0;
    log += `${dmg} ضربه | ❤️${enemy.emoji} ${enemy.hp}/${enemy.maxHp}`;

    if (enemy.hp <= 0) {
        log += `\n💀 ${enemy.name} کشته شد! 🎉 +${enemy.reward.xp}✨`;
        player.xp += enemy.reward.xp || 10;
        player.enemiesDefeated++;
        for (let rw in enemy.reward) {
            if (rw !== 'xp' && player.inventory[rw] !== undefined) {
                player.inventory[rw] += enemy.reward[rw];
                log += `\n${config.images.resources[rw]?.emoji || ''} +${enemy.reward[rw]}`;
            }
        }
        if (require('./player').checkLevelUp(player)) log += `\n⬆️ لول آپ! سطح ${player.level}!`;
        return { battleOver: true, playerWon: true, message: log };
    }

    if (enemy.hp < enemy.maxHp * 0.25) {
        const roll = Math.random();
        if (roll < 0.55) { log += `\n🏃 ${enemy.name} فرار کرد!`; return { battleOver: true, playerWon: false, message: log }; }
        else if (roll < 0.80) { enemy.status = 'trapped'; log += `\n🔒 ${enemy.name} محاصره شد!`; return { battleOver: false, message: log }; }
    }

    return enemyTurn(player, enemy, log);
}

function enemyTurn(player, enemy, log) {
    if (enemy.status === 'trapped') return { battleOver: false, message: log };
    const dmg = Math.max(1, enemy.attack - Math.floor(player.defense / 3));
    player.hp -= dmg;
    if (player.hp < 0) player.hp = 0;
    log += `\n💢 ${enemy.name} ${dmg} زد! ❤️تو ${player.hp}/${player.maxHp}`;

    if (player.hp <= 0) {
        player.hp = Math.floor(player.maxHp / 2);
        player.xp = Math.max(0, player.xp - 5);
        player.inventory.gold = Math.max(0, player.inventory.gold - 5);
        player.location = 'village';
        log += `\n💀 مردی! به روستا برگشتی.`;
        return { battleOver: true, playerWon: false, message: log };
    }
    return { battleOver: false, message: log };
}

function playerEscape(player, enemy) {
    const r = Math.random();
    if (r < 0.65) return { battleOver: true, escaped: true, message: '💨 فرار کردی!' };
    else if (r < 0.90) {
        enemy.status = 'trapped_player';
        const dmg = Math.max(1, Math.floor(enemy.attack * 1.3));
        player.hp -= dmg;
        if (player.hp < 0) player.hp = 0;
        let msg = `🔒 محاصره شدی! ${enemy.name} ${dmg} زد!`;
        if (player.hp <= 0) { player.hp = Math.floor(player.maxHp / 2); player.location = 'village'; msg += `\n💀 مردی! به روستا برگشتی.`; return { battleOver: true, escaped: false, message: msg }; }
        return { battleOver: false, escaped: false, message: msg };
    }
    return { battleOver: false, escaped: false, message: '😬 نتونستی فرار کنی!' };
}

function hpBar(c, m) {
    const p = Math.max(0, c / m);
    return '█'.repeat(Math.max(0, Math.floor(p * 5))) + '░'.repeat(Math.max(0, 5 - Math.floor(p * 5)));
}

function formatBattle(p, e) {
    return `⚔️ ${e.emoji} ${e.name} | ❤️ ${hpBar(e.hp, e.maxHp)} ${e.hp}/${e.maxHp}\n👤 تو | ❤️ ${hpBar(p.hp, p.maxHp)} ${p.hp}/${p.maxHp} | ⚔️${p.attack}`;
}

function getBattleKeyboard(enemy) {
    const b = [['⚔️ 🗡️ حمله کن']];
    if (enemy.status !== 'trapped_player') b.push(['🏃 💨 فرار کن']);
    return { reply_markup: { keyboard: b, resize_keyboard: true } };
}

module.exports = { activeBattles, startFight, playerAttack, playerEscape, formatBattle, getBattleKeyboard };