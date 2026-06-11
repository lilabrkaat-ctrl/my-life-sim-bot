const config = require('./config');

// =============================================
// 🔨 نمایش منوی ساخت‌وساز
// =============================================
function showCraftMenu(player) {
    const energy = player.energy || 0;
    const maxEnergy = player.maxEnergy || 100;

    let menu = `🔨 *کارگاه ساخت‌وساز*\n\n`;
    menu += `⚡ انرژی: ${'█'.repeat(Math.floor(energy/maxEnergy*10))}${'░'.repeat(10-Math.floor(energy/maxEnergy*10))} ${energy}/${maxEnergy}\n\n`;

    menu += `⚒️ *ساخت معمولی:*\n`;
    for (let name in config.recipes) {
        const r = config.recipes[name];
        if (!r.energy) {
            let costs = [];
            for (let res in r) {
                if (res !== 'effect' && res !== 'bonus' && res !== 'emoji' && res !== 'energy' && res !== 'temporary' && res !== 'turns' && res !== 'glow' && res !== 'dayPower' && res !== 'nightPower' && res !== 'extraSlots') {
                    costs.push(`${r[res]} ${res}`);
                }
            }
            const canCraft = Object.keys(r).filter(k => k !== 'effect' && k !== 'bonus' && k !== 'emoji').every(k => (player.inventory[k] || 0) >= (r[k] || 0));
            menu += `${canCraft ? '✅' : '❌'} ${r.emoji} *${name}*: ${costs.join(' + ')}\n`;
        }
    }

    menu += `\n✨ *ساخت با انرژی:*\n`;
    for (let name in config.recipes) {
        const r = config.recipes[name];
        if (r.energy) {
            let costs = [];
            for (let res in r) {
                if (res !== 'effect' && res !== 'bonus' && res !== 'emoji' && res !== 'energy' && res !== 'temporary' && res !== 'turns' && res !== 'glow' && res !== 'dayPower' && res !== 'nightPower' && res !== 'extraSlots') {
                    costs.push(`${r[res]} ${res}`);
                }
            }
            const hasEnergy = energy >= r.energy;
            const hasMats = Object.keys(r).filter(k => k !== 'effect' && k !== 'bonus' && k !== 'emoji' && k !== 'energy').every(k => (player.inventory[k] || 0) >= (r[k] || 0));
            const canCraft = hasEnergy && hasMats;
            menu += `${canCraft ? '✅' : '❌'} ${r.emoji} *${name}*: ${costs.join(' + ')} + ${r.energy}⚡\n`;
        }
    }

    return menu;
}

// =============================================
// 🔨 کیبورد شیشه‌ای ساخت معمولی
// =============================================
function getCraftKeyboard(player) {
    const buttons = [];

    for (let name in config.recipes) {
        const r = config.recipes[name];
        if (!r.energy) {
            const canCraft = Object.keys(r).filter(k => k !== 'effect' && k !== 'bonus' && k !== 'emoji').every(k => (player.inventory[k] || 0) >= (r[k] || 0));
            buttons.push([{ 
                text: `${canCraft ? '✅' : '❌'} 🔨 ${name}`, 
                callback_data: `craft_${name}` 
            }]);
        }
    }

    buttons.push([{ text: '⚡ ساخت انرژی‌دار', callback_data: 'craft_energy_menu' }]);
    buttons.push([{ text: '🔙 برگشت', callback_data: 'back_to_main' }]);

    return { reply_markup: { inline_keyboard: buttons } };
}

// =============================================
// ⚡ کیبورد شیشه‌ای ساخت انرژی‌دار
// =============================================
function getEnergyCraftKeyboard(player) {
    const buttons = [];
    const energy = player.energy || 0;

    for (let name in config.recipes) {
        const r = config.recipes[name];
        if (r.energy) {
            const canCraft = energy >= r.energy && Object.keys(r).filter(k => k !== 'effect' && k !== 'bonus' && k !== 'emoji' && k !== 'energy').every(k => (player.inventory[k] || 0) >= (r[k] || 0));
            buttons.push([{ 
                text: `${canCraft ? '✅' : '❌'} ${r.emoji} ${name} (${r.energy}⚡)`, 
                callback_data: `craft_energy_${name}` 
            }]);
        }
    }

    buttons.push([{ text: '🔙 برگشت به ساخت', callback_data: 'craft_back' }]);

    return { reply_markup: { inline_keyboard: buttons } };
}

// =============================================
// 🔨 ساخت آیتم
// =============================================
function craftItem(player, itemName) {
    const recipe = config.recipes[itemName];
    if (!recipe) return { success: false, message: '❌ این آیتم رو نمی‌شناسم!' };

    if (recipe.energy) {
        if ((player.energy || 0) < recipe.energy) {
            return { 
                success: false, 
                message: `❌ *انرژی کافی نداری!*\n\n⚡ نیاز: ${recipe.energy} انرژی\n⚡ داری: ${player.energy || 0} انرژی\n\n💡 *راه‌های کسب انرژی:*\n☀️ جمع‌آوری در روز\n⚡ رعد و برق\n🌟 ستاره دنباله‌دار\n🔥 آتش\n🦅 عقاب` 
            };
        }
    }

    for (let res in recipe) {
        if (res !== 'effect' && res !== 'bonus' && res !== 'emoji' && res !== 'energy' && res !== 'temporary' && res !== 'turns' && res !== 'glow' && res !== 'dayPower' && res !== 'nightPower' && res !== 'extraSlots') {
            if ((player.inventory[res] || 0) < recipe[res]) {
                return { success: false, message: `❌ *${res}* کافی نداری!\n\nنیاز: ${recipe[res]}\nداری: ${player.inventory[res] || 0}` };
            }
        }
    }

    if (recipe.energy) {
        player.energy = (player.energy || 0) - recipe.energy;
    }

    for (let res in recipe) {
        if (res !== 'effect' && res !== 'bonus' && res !== 'emoji' && res !== 'energy' && res !== 'temporary' && res !== 'turns' && res !== 'glow' && res !== 'dayPower' && res !== 'nightPower' && res !== 'extraSlots') {
            player.inventory[res] -= recipe[res];
        }
    }

    if (recipe.effect === 'weapon') {
        player.equipment.weapon = itemName;
        player.attack = (player.attack || 5) + recipe.bonus;
        if (recipe.glow) player.hasGlow = true;
        if (recipe.temporary) {
            player.tempAttack = recipe.bonus;
            player.tempAttackTurns = recipe.turns || 5;
        }
    } else if (recipe.effect === 'armor') {
        player.equipment.armor = itemName;
        player.defense = (player.defense || 2) + recipe.bonus;
        if (recipe.glow) player.hasGlow = true;
        if (recipe.dayPower) player.hasDayPower = true;
        if (recipe.nightPower) player.hasNightPower = true;
    } else if (recipe.effect === 'house') {
        player.equipment.house = itemName;
        player.maxHp = (player.maxHp || 100) + recipe.bonus;
        player.hp = player.maxHp;
        player.defense = (player.defense || 2) + Math.floor(recipe.bonus / 2);
        if (recipe.extraSlots) {
            if (!player.houseMaxSlots) player.houseMaxSlots = 3;
            player.houseMaxSlots += recipe.extraSlots;
        }
        if (recipe.glow) player.hasGlow = true;
    }

    let extraMsg = '';
    if (recipe.energy) {
        extraMsg = `\n\n⚡ انرژی مصرفی: ${recipe.energy}\n⚡ انرژی باقی‌مانده: ${player.energy}/${player.maxEnergy || 100}`;
    }
    if (recipe.glow) extraMsg += '\n✨ *درخشش ابدی فعال شد!*';
    if (recipe.dayPower) extraMsg += '\n☀️ *قدرت خورشید!* +۲۰⚔️ در روز';
    if (recipe.nightPower) extraMsg += '\n🌙 *قدرت ماه!* +۲۰⚔️ در شب';

    return { 
        success: true, 
        message: `✅ ${recipe.emoji} *${itemName}* ساخته شد!\n\n⚔️ حمله: ${player.attack}\n🛡️ دفاع: ${player.defense}\n❤️ جان: ${player.maxHp}${extraMsg}` 
    };
}

module.exports = { 
    showCraftMenu, 
    getCraftKeyboard, 
    getEnergyCraftKeyboard, 
    craftItem 
};