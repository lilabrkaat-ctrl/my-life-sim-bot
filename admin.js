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

        case 'score': case 'sc':
            const s = parseInt(args[0]) || 100;
            require('./player').addScore(player, s);
            require('./player').checkUnlocks(player);
            result = { success: true, message: `✅ ${s}🏆 امتیاز اضافه شد! امتیاز: ${player.score}` };
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
            require('./player').addScore(player, l * 50);
            result = { success: true, message: `✅ ${l} سطح اضافه شد! سطح: ${player.level} | امتیاز: ${player.score}` };
            break;

        case 'unlock': case 'unlockall':
            // باز کردن همه مکان‌ها
            const allLocations = ['village', 'forest', 'river', 'mountain', 'plain', 'cave', 'desert'];
            player.unlocked.locations = allLocations;
            
            // باز کردن همه دشمنان
            const allEnemies = ['wolf', 'snake', 'bandit', 'lion', 'bear', 'soldier', 'fairy', 'werewolf', 'skeleton', 'dragon', 'scorpion', 'crocodile', 'eagle', 'knight'];
            player.unlocked.enemies = allEnemies;
            
            // باز کردن همه NPCها
            const allNpcs = ['witch', 'ghost', 'fairy', 'knight', 'angel', 'wizard', 'werewolf', 'prince', 'jester', 'skeleton'];
            player.unlocked.npcs = allNpcs;
            
            // باز کردن همه دستور پخت‌ها
            const allRecipes = ['تبر سنگی', 'شمشیر آهنی', 'زره چرمی', 'کلبه چوبی', 'تیروکمان'];
            player.unlocked.recipes = allRecipes;
            
            result = { success: true, message: '🔓 *همه چیز باز شد!*\n✅ تمام مکان‌ها\n✅ تمام دشمنان\n✅ تمام NPCها\n✅ تمام دستور پخت‌ها' };
            break;

        case 'max': case 'maxall':
            // مکس کردن همه چی
            player.level = 100;
            player.maxHp = 9999;
            player.hp = 9999;
            player.attack = 999;
            player.defense = 999;
            player.xp = 99999;
            player.score = 99999;
            player.inventory = { wood: 999, stone: 999, meat: 999, water: 999, skin: 999, iron: 999, gold: 99999 };
            player.equipment = { weapon: 'شمشیر افسانه‌ای', armor: 'زره اژدها', house: 'قصر باشکوه' };
            
            // باز کردن همه چیز
            player.unlocked.locations = ['village', 'forest', 'river', 'mountain', 'plain', 'cave', 'desert'];
            player.unlocked.enemies = ['wolf', 'snake', 'bandit', 'lion', 'bear', 'soldier', 'fairy', 'werewolf', 'skeleton', 'dragon', 'scorpion', 'crocodile', 'eagle', 'knight'];
            player.unlocked.npcs = ['witch', 'ghost', 'fairy', 'knight', 'angel', 'wizard', 'werewolf', 'prince', 'jester', 'skeleton'];
            player.unlocked.recipes = ['تبر سنگی', 'شمشیر آهنی', 'زره چرمی', 'کلبه چوبی', 'تیروکمان'];
            
            result = { success: true, message: '👑 *همه چیز مکس شد!*\n⭐ سطح: ۱۰۰\n❤️ جان: ۹۹۹۹\n⚔️ حمله: ۹۹۹\n🛡️ دفاع: ۹۹۹\n👑 طلا: ۹۹۹۹۹\n🔓 همه چیز باز شد!' };
            break;

        case 'god': case 'godmode':
            player.hp = 99999;
            player.maxHp = 99999;
            player.attack = 9999;
            player.defense = 9999;
            result = { success: true, message: '🔱 *گاد مود فعال شد!*\n❤️ جان: ۹۹۹۹۹\n⚔️ حمله: ۹۹۹۹\n🛡️ دفاع: ۹۹۹۹\n💀 نامیرا شدی!' };
            break;

        case 'reset':
            player.level = 1;
            player.xp = 0;
            player.hp = 100;
            player.maxHp = 100;
            player.attack = 5;
            player.defense = 2;
            player.score = 0;
            player.inventory = { wood: 0, stone: 0, meat: 0, water: 0, skin: 0, iron: 0, gold: 10 };
            player.equipment = { weapon: null, armor: null, house: null };
            player.unlocked = { locations: ['village'], enemies: ['wolf', 'snake', 'bandit'], npcs: [], recipes: [] };
            result = { success: true, message: '🔄 *همه چیز ریست شد!* از اول شروع کن!' };
            break;

        case 'help':
            result = { success: true, message: `👑 *دستورات ادمین:*\n
💰 /admin gold [عدد] - اضافه کردن طلا
✨ /admin xp [عدد] - اضافه کردن تجربه
🏆 /admin score [عدد] - اضافه کردن امتیاز
❤️ /admin heal - شفای کامل
🎒 /admin item [اسم] [عدد] - آیتم
⚔️ /admin attack [عدد] - اضافه کردن حمله
🛡️ /admin defense [عدد] - اضافه کردن دفاع
⭐ /admin level [عدد] - اضافه کردن سطح
🔓 /admin unlock - باز کردن همه چیز
👑 /admin max - مکس کردن همه چیز
🔱 /admin god - گاد مود
🔄 /admin reset - ریست کامل` };
            break;
    }

    return result;
}

module.exports = { isAdmin, adminCommand, ADMIN_ID };