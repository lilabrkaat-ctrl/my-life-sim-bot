const ADMIN_ID = 5576592239;

function isAdmin(chatId) {
    return chatId === ADMIN_ID;
}

function adminCommand(player, command, args) {
    const cmd = command.toLowerCase();
    let result = { success: false, message: '❌ دستور نامعتبر!' };

    switch (cmd) {
        case 'gold':
        case 'g':
            const goldAmount = parseInt(args[0]) || 100;
            player.inventory.gold += goldAmount;
            result = { success: true, message: `✅ ${goldAmount}👑 طلا اضافه شد! موجودی: ${player.inventory.gold}` };
            break;

        case 'xp':
        case 'exp':
            const xpAmount = parseInt(args[0]) || 50;
            player.xp += xpAmount;
            require('./player').checkLevelUp(player);
            result = { success: true, message: `✅ ${xpAmount}✨ تجربه اضافه شد! سطح: ${player.level}` };
            break;

        case 'heal':
        case 'hp':
            player.hp = player.maxHp;
            result = { success: true, message: `✅ جان کامل شد! ❤️ ${player.hp}/${player.maxHp}` };
            break;

        case 'item':
        case 'give':
            const item = args[0];
            const amount = parseInt(args[1]) || 10;
            const validItems = ['wood', 'stone', 'meat', 'water', 'skin', 'iron', 'gold'];
            if (validItems.includes(item)) {
                player.inventory[item] += amount;
                result = { success: true, message: `✅ ${amount} ${item} اضافه شد!` };
            } else {
                result = { success: false, message: `❌ آیتم نامعتبر! موارد: ${validItems.join(', ')}` };
            }
            break;

        case 'attack':
        case 'atk':
            const atkAmount = parseInt(args[0]) || 10;
            player.attack += atkAmount;
            result = { success: true, message: `✅ ${atkAmount}⚔️ حمله اضافه شد! حمله: ${player.attack}` };
            break;

        case 'defense':
        case 'def':
            const defAmount = parseInt(args[0]) || 10;
            player.defense += defAmount;
            result = { success: true, message: `✅ ${defAmount}🛡️ دفاع اضافه شد! دفاع: ${player.defense}` };
            break;

        case 'level':
        case 'lvl':
            const lvlAmount = parseInt(args[0]) || 1;
            player.level += lvlAmount;
            player.maxHp += lvlAmount * 20;
            player.hp = player.maxHp;
            player.attack += lvlAmount * 2;
            player.defense += lvlAmount;
            result = { success: true, message: `✅ ${lvlAmount} سطح اضافه شد! سطح: ${player.level}` };
            break;

        case 'help':
            result = {
                success: true,
                message: `👑 *دستورات ادمین:*\n/gold [عدد]\n/xp [عدد]\n/heal\n/item [اسم] [عدد]\n/attack [عدد]\n/defense [عدد]\n/level [عدد]`
            };
            break;
    }

    return result;
}

module.exports = { isAdmin, adminCommand, ADMIN_ID };