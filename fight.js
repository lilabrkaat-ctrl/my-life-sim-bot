const config = require('./config');

function fight(player) {
    const enemyKeys = config.locationEnemies[player.location];
    
    if (!enemyKeys || enemyKeys.length === 0) {
        return { success: false, message: '⚠️ اینجا دشمنی وجود نداره! به یه جای خطرناک‌تر سفر کن.' };
    }

    const randomKey = enemyKeys[Math.floor(Math.random() * enemyKeys.length)];
    const enemyData = config.images.enemies[randomKey];
    
    let enemyHp = enemyData.hp;
    const enemyAttack = enemyData.attack;
    
    let battleLog = `⚔️ *نبرد با ${enemyData.emoji} ${enemyData.name}*\n\n`;
    let round = 1;
    
    while (enemyHp > 0 && player.hp > 0 && round <= 10) {
        // حمله بازیکن
        const playerDamage = Math.max(1, player.attack - Math.floor(Math.random() * 3));
        enemyHp -= playerDamage;
        battleLog += `🗡️ تو ${playerDamage} ضربه زدی! ❤️ دشمن: ${Math.max(0, enemyHp)}\n`;
        
        if (enemyHp <= 0) {
            // پیروزی
            player.xp += enemyData.reward.xp;
            player.enemiesDefeated++;
            
            battleLog += `\n🎉 *پیروز شدی!*\n✨ تجربه: +${enemyData.reward.xp}\n`;
            
            for (let reward in enemyData.reward) {
                if (reward !== 'xp' && player.inventory[reward] !== undefined) {
                    player.inventory[reward] += enemyData.reward[reward];
                    const itemData = config.images.resources[reward];
                    battleLog += `${itemData.emoji} ${itemData.name}: +${enemyData.reward[reward]}\n`;
                }
            }
            
            const leveledUp = require('./player').checkLevelUp(player);
            if (leveledUp) {
                battleLog += `\n⬆️ *لول آپ!* حالا سطح ${player.level} هستی!\n❤️ جان: ${player.hp}/${player.maxHp}\n⚔️ حمله: ${player.attack}\n🛡️ دفاع: ${player.defense}`;
            }
            
            return { success: true, message: battleLog };
        }
        
        // حمله دشمن
        const enemyDamage = Math.max(1, enemyAttack - Math.floor(player.defense / 3));
        player.hp -= enemyDamage;
        battleLog += `💢 ${enemyData.name} ${enemyDamage} ضربه زد! ❤️ تو: ${Math.max(0, player.hp)}\n\n`;
        
        round++;
    }
    
    if (player.hp <= 0) {
        player.hp = Math.floor(player.maxHp / 2);
        player.xp = Math.max(0, player.xp - 5);
        battleLog += `\n💀 *شکست خوردی!* نصف جانت رو از دست دادی و به روستا برگشتی.`;
        player.location = 'village';
        return { success: false, message: battleLog };
    }
    
    battleLog += `\n⚖️ *نبرد طولانی شد!* ${enemyData.name} فرار کرد.`;
    return { success: true, message: battleLog };
}

module.exports = { fight };