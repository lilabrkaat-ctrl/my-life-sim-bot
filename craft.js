const config = require('./config');

function showCraftMenu() {
    let menu = '🔨 *کارگاه ساخت‌وساز*\n\n*قابل ساخت:*\n';
    
    for (let itemName in config.recipes) {
        const recipe = config.recipes[itemName];
        let costs = [];
        for (let resource in recipe) {
            if (resource !== 'effect' && resource !== 'bonus' && resource !== 'emoji') {
                costs.push(`${recipe[resource]} ${resource}`);
            }
        }
        menu += `${recipe.emoji} ${itemName}: ${costs.join(' + ')} (${recipe.effect === 'weapon' ? '⚔️+' + recipe.bonus : '🛡️+' + recipe.bonus})\n`;
    }
    
    menu += '\nبرای ساخت: /make [اسم]\nمثال: /make تبر سنگی';
    return menu;
}

function craftItem(player, itemName) {
    const recipe = config.recipes[itemName];
    
    if (!recipe) {
        return { success: false, message: '❌ این آیتم رو نمی‌شناسم! /craft رو ببین.' };
    }

    // چک کردن منابع
    for (let resource in recipe) {
        if (resource !== 'effect' && resource !== 'bonus' && resource !== 'emoji') {
            if (player.inventory[resource] < recipe[resource]) {
                return { success: false, message: `❌ ${resource} کافی نداری! نیاز: ${recipe[resource]}` };
            }
        }
    }

    // کم کردن منابع
    for (let resource in recipe) {
        if (resource !== 'effect' && resource !== 'bonus' && resource !== 'emoji') {
            player.inventory[resource] -= recipe[resource];
        }
    }

    // اعمال افکت
    if (recipe.effect === 'weapon') {
        player.equipment.weapon = itemName;
        player.attack = 5 + recipe.bonus;
    } else if (recipe.effect === 'armor') {
        player.equipment.armor = itemName;
        player.defense = 2 + recipe.bonus;
    } else if (recipe.effect === 'house') {
        player.equipment.house = itemName;
        player.maxHp += 50;
        player.hp = player.maxHp;
        player.defense += recipe.bonus;
    }

    return {
        success: true,
        message: `✅ ${recipe.emoji} *${itemName}* ساخته شد!\n⚔️ حمله: ${player.attack} | 🛡️ دفاع: ${player.defense}`
    };
}

module.exports = { showCraftMenu, craftItem };