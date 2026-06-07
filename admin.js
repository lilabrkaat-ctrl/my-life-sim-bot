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
            player.inventory.gold = (player.inventory.gold || 0) + g;
            result = { success: true, message: `✅ ${g}👑 طلا اضافه شد! موجودی: ${player.inventory.gold}` };
            break;

        case 'xp': case 'exp':
            const x = parseInt(args[0]) || 50;
            player.xp = (player.xp || 0) + x;
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
            player.hp = player.maxHp || 100;
            result = { success: true, message: `✅ جان کامل شد! ❤️ ${player.hp}/${player.maxHp}` };
            break;

        case 'item': case 'give':
            const item = args[0];
            const amt = parseInt(args[1]) || 10;
            const valid = ['wood', 'stone', 'meat', 'water', 'skin', 'iron', 'gold', 'ring', 'tear', 'spell', 'song', 'blood', 'wish', 'key'];
            if (valid.includes(item)) {
                player.inventory[item] = (player.inventory[item] || 0) + amt;
                result = { success: true, message: `✅ ${amt} ${item} اضافه شد!` };
            } else {
                result = { success: false, message: `❌ آیتم نامعتبر! موارد: ${valid.join(', ')}` };
            }
            break;

        case 'attack': case 'atk':
            const a = parseInt(args[0]) || 10;
            player.attack = (player.attack || 5) + a;
            result = { success: true, message: `✅ ${a}⚔️ حمله اضافه شد! حمله: ${player.attack}` };
            break;

        case 'defense': case 'def':
            const d = parseInt(args[0]) || 10;
            player.defense = (player.defense || 2) + d;
            result = { success: true, message: `✅ ${d}🛡️ دفاع اضافه شد! دفاع: ${player.defense}` };
            break;

        case 'level': case 'lvl':
            const l = parseInt(args[0]) || 1;
            player.level = (player.level || 1) + l;
            player.maxHp = (player.maxHp || 100) + l * 20;
            player.hp = player.maxHp;
            player.attack = (player.attack || 5) + l * 2;
            player.defense = (player.defense || 2) + l;
            require('./player').addScore(player, l * 50);
            result = { success: true, message: `✅ ${l} سطح اضافه شد! سطح: ${player.level} | امتیاز: ${player.score}` };
            break;

        case 'unlock': case 'unlockall':
            player.unlocked.locations = ['village', 'forest', 'river', 'mountain', 'plain', 'cave', 'desert'];
            player.unlocked.enemies = ['wolf', 'snake', 'bandit', 'lion', 'bear', 'soldier', 'fairy', 'werewolf', 'skeleton', 'dragon', 'scorpion', 'crocodile', 'eagle', 'knight_enemy', 'queen', 'bride', 'mermaid', 'young_witch', 'singer', 'vampire', 'genie', 'bandit_female'];
            player.unlocked.npcs = ['witch', 'ghost_sexy', 'fairy', 'knight', 'angel', 'wizard', 'werewolf', 'prince', 'jester', 'skeleton', 'sage', 'farmer', 'blacksmith', 'merchant', 'bride', 'mermaid', 'young_witch', 'singer', 'vampire', 'genie', 'bandit_female'];
            player.unlocked.recipes = ['تبر سنگی', 'شمشیر آهنی', 'زره چرمی', 'کلبه چوبی', 'تیروکمان'];
            result = { success: true, message: '🔓 *همه چیز باز شد!*\n✅ تمام مکان‌ها\n✅ تمام دشمنان\n✅ تمام NPCها\n✅ تمام دستور پخت‌ها' };
            break;

        case 'max': case 'maxall':
            player.level = 100;
            player.maxHp = 9999;
            player.hp = 9999;
            player.attack = 999;
            player.defense = 999;
            player.xp = 99999;
            player.score = 99999;
            player.inventory = { wood: 999, stone: 999, meat: 999, water: 999, skin: 999, iron: 999, gold: 99999, ring: 50, tear: 50, spell: 50, song: 50, blood: 50, wish: 50, key: 50 };
            player.equipment = { weapon: 'شمشیر افسانه‌ای', armor: 'زره اژدها', house: 'قصر باشکوه' };
            
            player.unlocked.locations = ['village', 'forest', 'river', 'mountain', 'plain', 'cave', 'desert'];
            player.unlocked.enemies = ['wolf', 'snake', 'bandit', 'lion', 'bear', 'soldier', 'fairy', 'werewolf', 'skeleton', 'dragon', 'scorpion', 'crocodile', 'eagle', 'knight_enemy', 'queen', 'bride', 'mermaid', 'young_witch', 'singer', 'vampire', 'genie', 'bandit_female'];
            player.unlocked.npcs = ['witch', 'ghost_sexy', 'fairy', 'knight', 'angel', 'wizard', 'werewolf', 'prince', 'jester', 'skeleton', 'sage', 'farmer', 'blacksmith', 'merchant', 'bride', 'mermaid', 'young_witch', 'singer', 'vampire', 'genie', 'bandit_female'];
            player.unlocked.recipes = ['تبر سنگی', 'شمشیر آهنی', 'زره چرمی', 'کلبه چوبی', 'تیروکمان'];
            
            if (!player.prison) player.prison = [];
            if (!player.prisonRelations) player.prisonRelations = {};
            
            const allNpcs = [
                { id: 'witch', name: 'ساحره', emoji: '🧙‍♀️' },
                { id: 'ghost_sexy', name: 'روح سکسی', emoji: '👻' },
                { id: 'fairy', name: 'پری جنگل', emoji: '🧚' },
                { id: 'angel', name: 'فرشته', emoji: '👼' },
                { id: 'knight', name: 'شوالیه', emoji: '⚔️' },
                { id: 'jester', name: 'دلقک', emoji: '🎭' },
                { id: 'prince', name: 'پرنسس', emoji: '🤴' },
                { id: 'skeleton', name: 'اسکلت', emoji: '💀' },
                { id: 'werewolf', name: 'گرگینه', emoji: '🐺' },
                { id: 'wizard', name: 'جادوگر', emoji: '🧙‍♂️' },
                { id: 'sage', name: 'حکیم دانا', emoji: '🧙' },
                { id: 'farmer', name: 'دهقان', emoji: '🧑‍🌾' },
                { id: 'blacksmith', name: 'آهنگر', emoji: '⚒️' },
                { id: 'merchant', name: 'تاجر', emoji: '🧑‍🌾' }
            ];
            
            let prisonCount = 0;
            for (let npc of allNpcs) {
                if (!player.prison.find(p => p.npcId === npc.id)) {
                    player.prison.push({
                        npcId: npc.id, name: npc.name, emoji: npc.emoji,
                        daysUntilEscape: 999, capturedAt: Date.now()
                    });
                    player.prisonRelations[npc.id] = 100;
                    prisonCount++;
                }
            }
            
            result = { success: true, message: `👑 *همه چیز مکس شد!*\n⭐ سطح: ۱۰۰\n❤️ جان: ۹۹۹۹\n⚔️ حمله: ۹۹۹\n🛡️ دفاع: ۹۹۹\n👑 طلا: ۹۹۹۹۹\n🔓 همه چیز باز شد!\n🔒 ${prisonCount} NPC زندانی شدن!` };
            break;

        case 'god': case 'godmode':
            player.hp = 99999;
            player.maxHp = 99999;
            player.attack = 9999;
            player.defense = 9999;
            result = { success: true, message: '🔱 *گاد مود فعال شد!*\n❤️ جان: ۹۹۹۹۹\n⚔️ حمله: ۹۹۹۹\n🛡️ دفاع: ۹۹۹۹\n💀 نامیرا شدی!' };
            break;

        case 'prison': case 'prisonall':
            if (!player.prison) player.prison = [];
            if (!player.prisonRelations) player.prisonRelations = {};
            
            const npcs = [
                { id: 'witch', name: 'ساحره', emoji: '🧙‍♀️' },
                { id: 'ghost_sexy', name: 'روح سکسی', emoji: '👻' },
                { id: 'fairy', name: 'پری جنگل', emoji: '🧚' },
                { id: 'angel', name: 'فرشته', emoji: '👼' },
                { id: 'knight', name: 'شوالیه', emoji: '⚔️' },
                { id: 'jester', name: 'دلقک', emoji: '🎭' },
                { id: 'prince', name: 'پرنسس', emoji: '🤴' },
                { id: 'skeleton', name: 'اسکلت', emoji: '💀' },
                { id: 'werewolf', name: 'گرگینه', emoji: '🐺' },
                { id: 'wizard', name: 'جادوگر', emoji: '🧙‍♂️' },
                { id: 'sage', name: 'حکیم دانا', emoji: '🧙' },
                { id: 'farmer', name: 'دهقان', emoji: '🧑‍🌾' },
                { id: 'blacksmith', name: 'آهنگر', emoji: '⚒️' },
                { id: 'merchant', name: 'تاجر', emoji: '🧑‍🌾' }
            ];
            
            let count = 0;
            for (let npc of npcs) {
                if (!player.prison.find(p => p.npcId === npc.id)) {
                    player.prison.push({
                        npcId: npc.id, name: npc.name, emoji: npc.emoji,
                        daysUntilEscape: 999, capturedAt: Date.now()
                    });
                    player.prisonRelations[npc.id] = 100;
                    count++;
                }
            }
            result = { success: true, message: `🔒 ${count} NPC زندانی شدن!\n🏰 برو تو زندان ببینشون!` };
            break;

        case 'gift': case 'sendgift':
            const targetId = parseInt(args[0]);
            const giftItem = args[1];
            const giftAmt = parseInt(args[2]) || 1;
            
            const allPlayers = require('./player').players;
            const targetPlayer = allPlayers[targetId];
            
            if (!targetPlayer) {
                result = { success: false, message: '❌ کاربر پیدا نشد! مطمئن شو یه بار /start زده باشه.' };
                break;
            }
            
            const validItems = ['wood', 'stone', 'meat', 'water', 'skin', 'iron', 'gold', 'ring', 'tear', 'spell', 'song', 'blood', 'wish', 'key'];
            
            if (!validItems.includes(giftItem)) {
                result = { success: false, message: `❌ آیتم نامعتبر!\n📋 موارد: ${validItems.join(', ')}` };
                break;
            }
            
            targetPlayer.inventory[giftItem] = (targetPlayer.inventory[giftItem] || 0) + giftAmt;
            
            result = { 
                success: true, 
                message: `🎁 *هدیه فرستاده شد!*\n\n👤 کاربر: ${targetPlayer.name}\n🎒 آیتم: ${giftItem}\n📦 تعداد: ${giftAmt}\n\n✅ با موفقیت ارسال شد!` 
            };
            break;

        case 'reset':
            player.level = 1;
            player.xp = 0;
            player.hp = 100;
            player.maxHp = 100;
            player.attack = 5;
            player.defense = 2;
            player.score = 0;
            player.inventory = { wood: 0, stone: 0, meat: 0, water: 0, skin: 0, iron: 0, gold: 10, ring: 0, tear: 0, spell: 0, song: 0, blood: 0, wish: 0, key: 0 };
            player.equipment = { weapon: null, armor: null, house: null };
            player.unlocked = { locations: ['village'], enemies: ['wolf', 'snake', 'bandit'], npcs: [], recipes: [] };
            player.prison = [];
            player.prisonRelations = {};
            player.seduced = {};
            player.house = [];
            player.marry = null;
            player.enraged = {};
            result = { success: true, message: '🔄 *همه چیز ریست شد!*' };
            break;

        case 'help':
            result = { success: true, message: `👑 *دستورات ادمین:*\n
💰 /admin gold [عدد]
✨ /admin xp [عدد]
🏆 /admin score [عدد]
❤️ /admin heal
🎒 /admin item [اسم] [عدد]
⚔️ /admin attack [عدد]
🛡️ /admin defense [عدد]
⭐ /admin level [عدد]
🔓 /admin unlock
👑 /admin max
🔒 /admin prison
🔱 /admin god
🎁 /admin gift [user_id] [item] [amount]
🔄 /admin reset` };
            break;
    }

    return result;
}

module.exports = { isAdmin, adminCommand, ADMIN_ID };