const config = require('./config');

const activeBattles = {};

function startFight(player) {
    const enemyKeys = config.locationEnemies[player.location];
    
    if (!enemyKeys || enemyKeys.length === 0) {
        return { success: false, message: '⚠️ اینجا دشمنی وجود نداره!' };
    }

    const randomKey = enemyKeys[Math.floor(Math.random() * enemyKeys.length)];
    const enemyData = config.images.enemies[randomKey];
    
    const enemy = {
        key: randomKey,
        name: enemyData.name,
        emoji: enemyData.emoji,
        file_id: enemyData.file_id,
        hp: enemyData.hp,
        maxHp: enemyData.hp,
        attack: enemyData.attack,
        reward: JSON.parse(JSON.stringify(enemyData.reward)),
        status: 'fighting'
    };
    
    return { success: true, battleActive: true, enemy: enemy, message: formatBattleStatus(player, enemy) };
}

function playerAttack(player, enemy) {
    let battleLog = '';
    
    const critRoll = Math.random();
    let damage;
    
    if (critRoll < 0.15) { damage = player.attack * 2; battleLog += '💥 *ضربه انتقادی!* '; }
    else if (critRoll < 0.35) { damage = Math.floor(player.attack * 1.5); battleLog += '⚡ *ضربه قدرتمند!* '; }
    else if (critRoll > 0.85) { damage = Math.floor(player.attack * 0.5); battleLog += '😕 *ضربه ضعیف...* '; }
    else { damage = player.attack; battleLog += '🗡️ '; }
    
    enemy.hp -= damage;
    if (enemy.hp < 0) enemy.hp = 0;
    battleLog += `تو ${damage} ضربه زدی!\n`;
    
    if (enemy.hp <= 0) {
        battleLog += `\n💀 *${enemy.name} کشته شد!*\n🎉 پیروزی!`;
        player.xp += enemy.reward.xp;
        player.enemiesDefeated++;
        for (let r in enemy.reward) {
            if (r !== 'xp' && player.inventory[r] !== undefined) {
                player.inventory[r] += enemy.reward[r];
                battleLog += `\n${config.images.resources[r].emoji} +${enemy.reward[r]}`;
            }
        }
        const lvl = require('./player').checkLevelUp(player);
        if (lvl) battleLog += `\n⬆️ لول آپ! سطح ${player.level}!`;
        return { battleOver: true, playerWon: true, message: battleLog };
    }
    
    if (enemy.hp < enemy.maxHp * 0.25) {
        const roll = Math.random();
        if (roll < 0.55) {
            battleLog += `\n🏃 ${enemy.emoji} ${enemy.name} فرار کرد!`;
            return { battleOver: true, playerWon: false, message: battleLog };
        } else if (roll < 0.80) {
            enemy.status = 'trapped';
            battleLog += `\n🔒 ${enemy.name} محاصره شد! نمی‌تونه حمله کنه!`;
            return { battleOver: false, message: battleLog };
        }
    }
    
    return enemyTurn(player, enemy, battleLog);
}

function enemyTurn(player, enemy, battleLog) {
    if (enemy.status === 'trapped') return { battleOver: false, message: battleLog };
    
    const dmg = Math.max(1, enemy.attack - Math.floor(player.defense / 3));
    player.hp -= dmg;
    if (player.hp < 0) player.hp = 0;
    battleLog += `💢 ${enemy.name} ${dmg} ضربه زد!\n`;
    
    if (player.hp <= 0) {
        player.hp = Math.floor(player.maxHp / 2);
        player.xp = Math.max(0, player.xp - 5);
        player.inventory.gold = Math.max(0, player.inventory.gold - 5);
        player.location = 'village';
        battleLog += `\n💀 *مردی!* بیهوش شدی و به روستا برگشتی.`;
        return { battleOver: true, playerWon: false, message: battleLog };
    }
    
    return { battleOver: false, message: battleLog };
}

function playerEscape(player, enemy) {
    const roll = Math.random();
    if (roll < 0.65) {
        return { battleOver: true, escaped: true, message: '💨 فرار کردی! نبرد تموم شد.' };
    } else if (roll < 0.90) {
        enemy.status = 'trapped_player';
        const dmg = Math.max(1, Math.floor(enemy.attack * 1.3));
        player.hp -= dmg;
        if (player.hp < 0) player.hp = 0;
        let msg = `🔒 محاصره شدی! ${enemy.name} ${dmg} ضربه زد!`;
        if (player.hp <= 0) {
            player.hp = Math.floor(player.maxHp / 2);
            player.location = 'village';
            msg += `\n💀 مردی! به روستا برگشتی.`;
            return { battleOver: true, escaped: false, message: msg };
        }
        return { battleOver: false, escaped: false, message: msg };
    } else {
        return { battleOver: false, escaped: false, message: '😬 نتونستی فرار کنی!' };
    }
}

function getHpBar(current, max) {
    const p = Math.max(0, current / max);
    const f = Math.max(0, Math.floor(p * 5));
    return '█'.repeat(f) + '░'.repeat(5 - f);
}

function formatBattleStatus(player, enemy) {
    const eBar = getHpBar(enemy.hp, enemy.maxHp);
    const pBar = getHpBar(player.hp, player.maxHp);
    let s = `⚔️ ${enemy.emoji} ${enemy.name} | ❤️ ${eBar} ${enemy.hp}/${enemy.maxHp}`;
    if (enemy.status === 'trapped') s += ' | 🔒';
    s += `\n👤 تو | ❤️ ${pBar} ${player.hp}/${player.maxHp} | ⚔️${player.attack} 🛡️${player.defense}`;
    return s;
}

function getBattleKeyboard(enemy) {
    const buttons = [['⚔️ 🗡️ حمله کن']];
    if (enemy.status !== 'trapped_player') buttons.push(['🏃 💨 فرار کن']);
    return { reply_markup: { keyboard: buttons, resize_keyboard: true } };
}

module.exports = { activeBattles, startFight, playerAttack, playerEscape, formatBattleStatus, getBattleKeyboard };