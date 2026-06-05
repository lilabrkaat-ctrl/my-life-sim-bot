const config = require('./config');

// ذخیره نبردهای فعال
const activeBattles = {};

function startFight(player) {
    const enemyKeys = config.locationEnemies[player.location];
    
    if (!enemyKeys || enemyKeys.length === 0) {
        return { 
            success: false, 
            message: '⚠️ اینجا دشمنی وجود نداره! به یه جای خطرناک‌تر سفر کن.',
            battleActive: false
        };
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
        status: 'fighting',
        escapeAttempts: 0
    };
    
    return {
        success: true,
        battleActive: true,
        enemy: enemy,
        message: formatBattleStatus(player, enemy)
    };
}

function playerAttack(player, enemy) {
    let battleLog = '';
    
    // ⚔️ حمله بازیکن
    const critRoll = Math.random();
    let damage;
    let attackEmoji;
    
    if (critRoll < 0.15) {
        damage = player.attack * 2;
        attackEmoji = '💥';
        battleLog += `${attackEmoji} *ضربه انتقادی!* `;
    } else if (critRoll < 0.35) {
        damage = Math.floor(player.attack * 1.5);
        attackEmoji = '⚡';
        battleLog += `${attackEmoji} *ضربه قدرتمند!* `;
    } else if (critRoll > 0.85) {
        damage = Math.floor(player.attack * 0.5);
        attackEmoji = '😕';
        battleLog += `${attackEmoji} *ضربه ضعیف...* `;
    } else {
        damage = player.attack;
        attackEmoji = '🗡️';
        battleLog += `${attackEmoji} `;
    }
    
    enemy.hp -= damage;
    if (enemy.hp < 0) enemy.hp = 0;
    
    const enemyHpBar = getHpBar(enemy.hp, enemy.maxHp);
    battleLog += `تو *${damage}* ضربه زدی!\n`;
    battleLog += `❤️ ${enemy.emoji} ${enemy.name}: ${enemyHpBar} ${enemy.hp}/${enemy.maxHp}\n`;
    
    // 💀 مرگ دشمن
    if (enemy.hp <= 0) {
        battleLog += `\n${enemy.emoji} 💀 *${enemy.name} کشته شد!*\n\n`;
        battleLog += `🎉 *پیروزی!*\n`;
        battleLog += `✨ تجربه: +${enemy.reward.xp}\n`;
        
        player.xp += enemy.reward.xp;
        player.enemiesDefeated++;
        
        for (let reward in enemy.reward) {
            if (reward !== 'xp' && player.inventory[reward] !== undefined) {
                player.inventory[reward] += enemy.reward[reward];
                const itemData = config.images.resources[reward];
                battleLog += `${itemData.emoji} ${itemData.name}: +${enemy.reward[reward]}\n`;
            }
        }
        
        const leveledUp = require('./player').checkLevelUp(player);
        if (leveledUp) {
            battleLog += `\n⬆️ *لول آپ!* سطح ${player.level}!\n`;
            battleLog += `❤️ جان: ${player.hp}/${player.maxHp}\n`;
            battleLog += `⚔️ حمله: ${player.attack}\n`;
            battleLog += `🛡️ دفاع: ${player.defense}`;
        }
        
        return {
            battleOver: true,
            playerWon: true,
            message: battleLog
        };
    }
    
    // 🏃 تصمیم دشمن (حمله یا فرار)
    battleLog += '\n';
    
    if (enemy.hp < enemy.maxHp * 0.25) {
        // دشمن خونش کمه - تصمیم به فرار
        const escapeRoll = Math.random();
        
        if (escapeRoll < 0.55) {
            // فرار موفق
            battleLog += `🏃 ${enemy.emoji} *${enemy.name}*: "خونم کمه... فرار!"\n`;
            battleLog += `💨 ${enemy.name} از معرکه گریخت!\n\n`;
            battleLog += `⚖️ نبرد تموم شد. دشمن زنده موند.`;
            
            return {
                battleOver: true,
                playerWon: false,
                message: battleLog
            };
        } else if (escapeRoll < 0.80) {
            // محاصره شده - نمی‌تونه فرار کنه
            enemy.status = 'trapped';
            battleLog += `🏃 ${enemy.emoji} *${enemy.name}* می‌خواد فرار کنه...\n`;
            battleLog += `🔒 *محاصره!* راه فرار بسته‌ست!\n`;
            battleLog += `${enemy.name} گیر افتاده و نمی‌تونه حمله کنه!\n`;
            
            return {
                battleOver: false,
                message: battleLog
            };
        } else {
            // می‌مونه و حمله می‌کنه
            return enemyAttack(player, enemy, battleLog);
        }
    } else {
        // دشمن سالم - حمله می‌کنه
        return enemyAttack(player, enemy, battleLog);
    }
}

function enemyAttack(player, enemy, battleLog) {
    const enemyDamage = Math.max(1, enemy.attack - Math.floor(player.defense / 3));
    player.hp -= enemyDamage;
    if (player.hp < 0) player.hp = 0;
    
    const playerHpBar = getHpBar(player.hp, player.maxHp);
    battleLog += `💢 ${enemy.emoji} *${enemy.name}* *${enemyDamage}* ضربه زد!\n`;
    battleLog += `❤️ تو: ${playerHpBar} ${player.hp}/${player.maxHp}\n`;
    
    // 💀 مرگ بازیکن
    if (player.hp <= 0) {
        player.hp = Math.floor(player.maxHp / 2);
        player.xp = Math.max(0, player.xp - 5);
        player.inventory.gold = Math.max(0, player.inventory.gold - 5);
        player.location = 'village';
        
        battleLog += `\n💀 *مردی!*\n`;
        battleLog += `😵 بیهوش شدی و به روستا برگشتی...\n`;
        battleLog += `❤️ جان: ${player.hp}/${player.maxHp}\n`;
        battleLog += `👑 طلا: -5\n`;
        battleLog += `✨ تجربه: -5`;
        
        return {
            battleOver: true,
            playerWon: false,
            message: battleLog
        };
    }
    
    return {
        battleOver: false,
        message: battleLog
    };
}

function playerEscape(player, enemy) {
    let battleLog = '';
    
    battleLog += `🏃 *تو*: "باید فرار کنم!"\n`;
    
    const escapeRoll = Math.random();
    
    if (escapeRoll < 0.65) {
        // فرار موفق
        battleLog += `💨 موفق شدی فرار کنی!\n\n`;
        battleLog += `⚖️ نبرد تموم شد.\n`;
        battleLog += `❤️ جونت: ${player.hp}/${player.maxHp}\n`;
        battleLog += `📍 هنوز در ${config.images.locations[player.location].name} هستی.`;
        
        return {
            battleOver: true,
            escaped: true,
            message: battleLog
        };
    } else if (escapeRoll < 0.90) {
        // محاصره شدی
        battleLog += `🔒 *محاصره شدی!* راه فرار بسته‌ست!\n`;
        battleLog += `😱 ${enemy.emoji} ${enemy.name} راهت رو بسته!\n`;
        
        // دشمن یه ضربه رایگان می‌زنه
        const enemyDamage = Math.max(1, Math.floor(enemy.attack * 1.3));
        player.hp -= enemyDamage;
        if (player.hp < 0) player.hp = 0;
        
        const playerHpBar = getHpBar(player.hp, player.maxHp);
        battleLog += `💢 ${enemy.name} *${enemyDamage}* ضربه زد! (محاصره)\n`;
        battleLog += `❤️ تو: ${playerHpBar} ${player.hp}/${player.maxHp}\n`;
        battleLog += `\n🚫 نمی‌تونی فرار کنی! فقط بجنگ!\n`;
        
        // دشمن محاصره‌ست - نمی‌تونه فرار کنه
        enemy.status = 'trapped_player';
        
        if (player.hp <= 0) {
            player.hp = Math.floor(player.maxHp / 2);
            player.xp = Math.max(0, player.xp - 5);
            player.inventory.gold = Math.max(0, player.inventory.gold - 5);
            player.location = 'village';
            
            battleLog += `\n💀 *مردی!*\n`;
            battleLog += `😵 بیهوش شدی و به روستا برگشتی...`;
            
            return {
                battleOver: true,
                escaped: false,
                message: battleLog
            };
        }
        
        return {
            battleOver: false,
            escaped: false,
            message: battleLog
        };
    } else {
        // نمی‌تونی فرار کنی ولی محاصره هم نشدی
        battleLog += `😬 نتونستی فرار کنی!\n`;
        battleLog += `${enemy.emoji} ${enemy.name} هنوز دنبالت می‌کنه!\n`;
        
        return {
            battleOver: false,
            escaped: false,
            message: battleLog
        };
    }
}

function getHpBar(current, max) {
    const percent = Math.max(0, current / max);
    const filled = Math.max(0, Math.floor(percent * 10));
    const empty = Math.max(0, 10 - filled);
    return '█'.repeat(filled) + '░'.repeat(empty);
}

function formatBattleStatus(player, enemy) {
    const playerHpBar = getHpBar(player.hp, player.maxHp);
    const enemyHpBar = getHpBar(enemy.hp, enemy.maxHp);
    
    let status = `
╔══════════════════════════╗
      ⚔️ *نبرد حماسی* ⚔️
╚══════════════════════════╝

${enemy.emoji} *${enemy.name}*
❤️ جان: ${enemyHpBar} ${enemy.hp}/${enemy.maxHp}
⚔️ حمله: ${enemy.attack}
📍 وضعیت: ${enemy.status === 'trapped' ? '🔒 محاصره شده' : enemy.status === 'trapped_player' ? '😤 خشمگین' : '⚔️ آماده نبرد'}

━━━━━━━━━━━━━━━━━━━━━━━━

👤 *تو*
❤️ جان: ${playerHpBar} ${player.hp}/${player.maxHp}
⚔️ حمله: ${player.attack} | 🛡️ دفاع: ${player.defense}

━━━━━━━━━━━━━━━━━━━━━━━━

🤔 *چیکار می‌کنی؟*
    `;
    
    return status;
}

function getBattleKeyboard(enemy) {
    const canEscape = enemy.status !== 'trapped_player';
    
    const buttons = [];
    buttons.push(['⚔️ 🗡️ حمله کن']);
    
    if (canEscape) {
        buttons.push(['🏃 💨 فرار کن']);
    }
    
    return {
        reply_markup: {
            keyboard: buttons,
            resize_keyboard: true,
            one_time_keyboard: false
        }
    };
}

module.exports = { 
    activeBattles, 
    startFight, 
    playerAttack, 
    playerEscape,
    formatBattleStatus,
    getBattleKeyboard
};