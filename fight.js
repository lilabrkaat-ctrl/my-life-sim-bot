function formatBattleStatus(player, enemy) {
    const playerHpBar = getHpBar(player.hp, player.maxHp);
    const enemyHpBar = getHpBar(enemy.hp, enemy.maxHp);
    
    let status = `⚔️ ${enemy.emoji} *${enemy.name}* | ❤️ ${enemyHpBar} ${enemy.hp}/${enemy.maxHp}`;
    
    if (enemy.status === 'trapped') {
        status += ` | 🔒 محاصره`;
    } else if (enemy.status === 'trapped_player') {
        status += ` | 😤 خشمگین`;
    }
    
    status += `\n👤 *تو* | ❤️ ${playerHpBar} ${player.hp}/${player.maxHp} | ⚔️${player.attack} 🛡️${player.defense}`;
    
    return status;
}

function getHpBar(current, max) {
    const percent = Math.max(0, current / max);
    const filled = Math.max(0, Math.floor(percent * 5));
    const empty = Math.max(0, 5 - filled);
    return '█'.repeat(filled) + '░'.repeat(empty);
}