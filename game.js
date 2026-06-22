// محاسبه نتیجه نبرد
function battleResult(hero, enemy) {
    let heroHp = hero.hp;
    let enemyHp = enemy.hp;
    let rounds = 0;
    let log = [];

    while (heroHp > 0 && enemyHp > 0 && rounds < 20) {
        rounds++;
        // حمله قهرمان
        enemyHp -= hero.power;
        log.push(`⚔️ ${hero.emoji} به ${enemy.emoji} حمله کرد (${hero.power} آسیب)`);
        
        if (enemyHp <= 0) {
            log.push(`💀 ${enemy.emoji} شکست خورد!`);
            return { win: true, log, reward: enemy.reward };
        }
        
        // حمله دشمن
        heroHp -= enemy.power;
        log.push(`🗡️ ${enemy.emoji} به ${hero.emoji} حمله کرد (${enemy.power} آسیب)`);
        
        if (heroHp <= 0) {
            log.push(`💔 ${hero.emoji} شکست خورد!`);
            return { win: false, log, reward: 0 };
        }
    }
    
    return { win: false, log, reward: 0 };
}

// خرید قهرمان
function buyHero(user, hero) {
    if (user.coins >= hero.price) {
        user.coins -= hero.price;
        user.heroes.push(hero);
        return true;
    }
    return false;
}

module.exports = { battleResult, buyHero };