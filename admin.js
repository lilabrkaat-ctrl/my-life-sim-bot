const ADMIN_ID = 5576592239;

function isAdmin(chatId) {
    return chatId === ADMIN_ID;
}

function adminCommand(player, command, args) {
    const cmd = command.toLowerCase();
    let result = { success: false, message: '❌ دستور نامعتبر!' };

    switch (cmd) {
        case 'gold': case 'g':
            const g = parseInt(args[0]) || 100;
            player.inventory.gold += g;
            result = { success: true, message: `✅ ${g}👑 طلا اضافه شد! موجودی: ${player.inventory.gold}` };
            break;
        case 'xp': case 'exp':
            const x = parseInt(args[0]) || 50;
            player.xp += x;
            require('./player').checkLevelUp(player);
            result = { success: true, message: `✅ ${x}✨ تجربه اضافه شد! سطح: ${player.level}` };
            break;
        case 'heal': case 'hp':
            player.hp = player.maxHp;
            result = { success: true, message: `✅ جان کامل شد! ❤️ ${player.hp}/${player.maxHp}` };
            break;
        case 'item': case 'give':
            const item = args[0];
            const amt = parseInt(args[1]) || 10;
            const valid = ['wood', 'stone', 'meat', 'water', 'skin', 'iron', 'gold'];
            if (valid.includes(item)) {
                player.inventory[item] += amt;
                result = { success: true, message: `✅ ${amt} ${item} اضافه شد!` };
            } else {
                result = { success: false, message: `❌ آیتم نامعتبر! موارد: ${valid.join(', ')}` };
            }
            break;
        case 'attack': case 'atk':
            const a = parseInt(args[0]) || 10;
            player.attack += a;
            result = { success: true, message: `✅ ${a}⚔️ حمله اضافه شد! حمله: ${player.attack}` };
            break;
        case 'defense': case 'def':
            const d = parseInt(args[0]) || 10;
            player.defense += d;
            result = { success: true, message: `✅ ${d}🛡️ دفاع اضافه شد! دفاع: ${player.defense}` };
            break;
        case 'level': case 'lvl':
            const l = parseInt(args[0]) || 1;
            player.level += l;
            player.maxHp += l * 20;
            player.hp = player.maxHp;
            player.attack += l * 2;
            player.defense += l;
            result = { success: true, message: `✅ ${l} سطح اضافه شد! سطح: ${player.level}` };
            break;
        case 'help':
            result = { success: true, message: `👑 *دستورات ادمین:*\n/admin gold [عدد]\n/admin xp [عدد]\n/admin heal\n/admin item [اسم] [عدد]\n/admin attack [عدد]\n/admin defense [عدد]\n/admin level [عدد]` };
            break;
    }
    return result;
}

module.exports = { isAdmin, adminCommand, ADMIN_ID };