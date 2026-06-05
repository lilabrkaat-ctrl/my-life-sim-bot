const config = require('./config');
const activeBattles = {};

function startFight(player) {
    const enemyKeys = config.locationEnemies[player.location];
    if (!enemyKeys || enemyKeys.length === 0) {
        return { success: false, message: '⚠️ اینجا دشمنی نیست!' };
    }

    const key = enemyKeys[Math.floor(Math.random() * enemyKeys.length)];
    const data = config.images.enemies[key];
    
    const enemy = {
        key, name: data.name, emoji: data.emoji, file_id: data.file_id,
        hp: data.hp, maxHp: data.hp, attack: data.attack,
        reward: JSON.parse(JSON.stringify(data.reward)), status: 'fighting'
    };

    return { success: true, enemy, message: formatBattle(player, enemy) };
}

function playerAttack(player, enemy) {
    let log = '';
    const roll = Math.random();
    let dmg;

    if (roll < 0.15) { dmg = player.attack * 2; log += '💥 *ضربه انتقادی!* '; }
    else if (roll < 0.35) { dmg = Math.floor(player.attack * 1.5); log += '⚡ *ضربه قدرتمند!* '; }
    else if (roll > 0.85) { dmg = Math.floor(player.attack * 0.5); log += '😕 *ضربه ضعیف...* '; }
    else { dmg = player.attack; log += '🗡️ '; }

    enemy.hp -= dmg;
    if (enemy.hp < 0) enemy.hp = 0;
    log += `تو ${dmg} زدی! ❤️${enemy.emoji} ${enemy.hp}/${enemy.maxHp}\n`;

    if (enemy.hp <= 0) {
        log += `\n💀 ${enemy.name} کشته شد! 🎉\n✨ +${enemy.reward.xp} XP`;
        player.xp += enemy.reward.xp;
        player.enemiesDefeated++;
        for (let r in enemy.reward) {
            if (r !== 'xp' && player.inventory[r] !== undefined) {
                player.inventory[r] += enemy.reward[r];
                log += `\n${config.images.resources[r]?.emoji || ''} +${enemy.reward[r]}`;
            }
        }
        if (require('./player').checkLevelUp(player)) log += `\n⬆️ لول آپ! سطح ${player.level}!`;
        return { battleOver: true, playerWon: true, message: log };
    }

    if (enemy.hp < enemy.maxHp * 0.25) {
        const r = Math.random();
        if (r < 0.55) {
            log += `\n🏃 ${enemy.emoji} ${enemy.name} فرار کرد!`;
            return { battleOver: true, playerWon: false, message: log };
        } else if (r < 0.80) {
            enemy.status = 'trapped';
            log += `\n🔒 ${enemy.name} محاصره شد!`;
            return { battleOver: false, message: log };
        }
    }

    return enemyTurn(player, enemy, log);
}

function enemyTurn(player, enemy, log) {
    if (enemy.status === 'trapped') return { battleOver: false, message: log };
    const dmg = Math.max(1, enemy.attack - Math.floor(player.defense / 3));
    player.hp -= dmg;
    if (player.hp < 0) player.hp = 0;
    log += `💢 ${enemy.name} ${dmg} زد! ❤️تو ${player.hp}/${player.maxHp}\n`;

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
        if (player.hp <= 0) {
            player.hp = Math.floor(player.maxHp / 2);
            player.location = 'village';
            msg += `\n💀 مردی! به روستا برگشتی.`;
            return { battleOver: true, escaped: false, message: msg };
        }
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