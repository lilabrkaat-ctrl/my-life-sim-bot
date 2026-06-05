const config = require('./config');

function showCraftMenu() {
    let menu = '🔨 *کارگاه ساخت‌وساز*\n\n';
    for (let itemName in config.recipes) {
        const r = config.recipes[itemName];
        let costs = [];
        for (let res in r) {
            if (res !== 'effect' && res !== 'bonus' && res !== 'emoji') {
                costs.push(`${r[res]} ${config.images.resources[res]?.emoji || res}`);
            }
        }
        menu += `${r.emoji} *${itemName}*: ${costs.join(' + ')}\n`;
    }
    return menu;
}

function craftItem(player, itemName) {
    const recipe = config.recipes[itemName];
    if (!recipe) return { success: false, message: '❌ این آیتم رو نمی‌شناسم!' };

    for (let res in recipe) {
        if (res !== 'effect' && res !== 'bonus' && res !== 'emoji') {
            if (player.inventory[res] < recipe[res]) {
                return { success: false, message: `❌ ${res} کافی نداری!` };
            }
        }
    }

    for (let res in recipe) {
        if (res !== 'effect' && res !== 'bonus' && res !== 'emoji') {
            player.inventory[res] -= recipe[res];
        }
    }

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

    return { success: true, message: `✅ ${recipe.emoji} *${itemName}* ساخته شد!` };
}

module.exports = { showCraftMenu, craftItem };