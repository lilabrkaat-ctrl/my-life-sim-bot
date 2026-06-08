const ADMIN_ID = 5576592239;
const bannedUsers = {};

function isAdmin(chatId) {
    return chatId === ADMIN_ID;
}

function isBanned(chatId) {
    return bannedUsers[chatId] === true;
}

function adminCommand(player, command, args) {
    const cmd = command.toLowerCase();
    let result = { success: false, message: '❌ دستور نامعتبر!' };
    const allPlayers = require('./player').players;
    const config = require('./config');

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
            const valid = ['wood', 'stone', 'meat', 'water', 'skin', 'iron', 'gold', 'ring', 'tear', 'spell', 'song', 'blood', 'wish', 'key', 'diamond', 'finisher'];
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

        case 'energy': case 'en':
            const en = parseInt(args[0]) || 50;
            player.energy = Math.min((player.maxEnergy || 100), (player.energy || 0) + en);
            result = { success: true, message: `✅ ${en}⚡ انرژی اضافه شد! انرژی: ${player.energy}/${player.maxEnergy}` };
            break;

        case 'level': case 'lvl':
            const l = parseInt(args[0]) || 1;
            player.level = (player.level || 1) + l;
            player.maxHp = (player.maxHp || 100) + l * 20;
            player.hp = player.maxHp;
            player.attack = (player.attack || 5) + l * 2;
            player.defense = (player.defense || 2) + l;
            require('./player').addScore(player, l * 50);
            result = { success: true, message: `✅ ${l} سطح اضافه شد! سطح: ${player.level}` };
            break;

        case 'unlock': case 'unlockall':
            player.unlocked.locations = ['village', 'forest', 'river', 'mountain', 'plain', 'cave', 'desert'];
            player.unlocked.enemies = ['wolf', 'snake', 'bandit', 'lion', 'bear', 'soldier', 'fairy', 'werewolf', 'skeleton', 'dragon', 'scorpion', 'crocodile', 'eagle', 'knight_enemy', 'queen', 'bride', 'mermaid', 'young_witch', 'singer', 'vampire', 'genie', 'bandit_female'];
            player.unlocked.npcs = ['witch', 'ghost_sexy', 'fairy', 'knight', 'angel', 'wizard', 'werewolf', 'prince', 'jester', 'skeleton', 'sage', 'farmer', 'blacksmith', 'merchant', 'bride', 'mermaid', 'young_witch', 'singer', 'vampire', 'genie', 'bandit_female'];
            player.unlocked.recipes = ['تبر سنگی', 'شمشیر آهنی', 'زره چرمی', 'کلبه چوبی', 'تیروکمان'];
            result = { success: true, message: '🔓 *همه چیز باز شد!*' };
            break;

        case 'max': case 'maxall':
            player.level = 100;
            player.maxHp = 9999; player.hp = 9999;
            player.attack = 999; player.defense = 999;
            player.xp = 99999; player.score = 99999;
            player.energy = 999; player.maxEnergy = 999;
            player.inventory = { wood: 999, stone: 999, meat: 999, water: 999, skin: 999, iron: 999, gold: 99999, ring: 50, tear: 50, spell: 50, song: 50, blood: 50, wish: 50, key: 50, diamond: 50, finisher: 50 };
            player.equipment = { weapon: 'شمشیر افسانه‌ای', armor: 'زره اژدها', house: 'قصر باشکوه' };
            player.unlocked.locations = ['village', 'forest', 'river', 'mountain', 'plain', 'cave', 'desert'];
            player.unlocked.enemies = ['wolf', 'snake', 'bandit', 'lion', 'bear', 'soldier', 'fairy', 'werewolf', 'skeleton', 'dragon', 'scorpion', 'crocodile', 'eagle', 'knight_enemy', 'queen', 'bride', 'mermaid', 'young_witch', 'singer', 'vampire', 'genie', 'bandit_female'];
            player.unlocked.npcs = ['witch', 'ghost_sexy', 'fairy', 'knight', 'angel', 'wizard', 'werewolf', 'prince', 'jester', 'skeleton', 'sage', 'farmer', 'blacksmith', 'merchant', 'bride', 'mermaid', 'young_witch', 'singer', 'vampire', 'genie', 'bandit_female'];
            player.unlocked.recipes = ['تبر سنگی', 'شمشیر آهنی', 'زره چرمی', 'کلبه چوبی', 'تیروکمان'];
            
            // اضافه کردن حیوون‌ها
            if (!player.pets) player.pets = [];
            const { petTypes } = require('./pet');
            player.pets = [
                {
                    id: 'admin_wolf_1', type: 'wolf_spirit', name: petTypes.wolf_spirit.name, 
                    emoji: petTypes.wolf_spirit.emoji, image: petTypes.wolf_spirit.image,
                    level: 50, xp: 0, xpNeeded: 999, attackBonus: petTypes.wolf_spirit.attackBonus,
                    defenseBonus: petTypes.wolf_spirit.defenseBonus, hpBonus: petTypes.wolf_spirit.hpBonus,
                    rarity: 'legendary', evolveLevel: null, evolveTo: null, foodCost: 1
                },
                {
                    id: 'admin_dragon_1', type: 'dragon_ancient', name: petTypes.dragon_ancient.name,
                    emoji: petTypes.dragon_ancient.emoji, image: petTypes.dragon_ancient.image,
                    level: 50, xp: 0, xpNeeded: 999, attackBonus: petTypes.dragon_ancient.attackBonus,
                    defenseBonus: petTypes.dragon_ancient.defenseBonus, hpBonus: petTypes.dragon_ancient.hpBonus,
                    rarity: 'legendary', evolveLevel: null, evolveTo: null, foodCost: 1
                }
            ];
            player.maxHp += 160;
            player.attack += 80;
            player.defense += 40;
            
            // اضافه کردن صندوقچه‌ها
            player.lootBoxes = { wooden: 10, silver: 10, golden: 10, legendary: 10 };
            
            if (!player.prison) player.prison = [];
            if (!player.prisonRelations) player.prisonRelations = {};
            const allNpcs = [
                { id: 'witch', name: 'ساحره', emoji: '🧙‍♀️' }, { id: 'ghost_sexy', name: 'روح سکسی', emoji: '👻' },
                { id: 'fairy', name: 'پری جنگل', emoji: '🧚' }, { id: 'angel', name: 'فرشته', emoji: '👼' },
                { id: 'knight', name: 'شوالیه', emoji: '⚔️' }, { id: 'jester', name: 'دلقک', emoji: '🎭' },
                { id: 'prince', name: 'پرنسس', emoji: '🤴' }, { id: 'skeleton', name: 'اسکلت', emoji: '💀' },
                { id: 'werewolf', name: 'گرگینه', emoji: '🐺' }, { id: 'wizard', name: 'جادوگر', emoji: '🧙‍♂️' },
                { id: 'sage', name: 'حکیم دانا', emoji: '🧙' }, { id: 'farmer', name: 'دهقان', emoji: '🧑‍🌾' },
                { id: 'blacksmith', name: 'آهنگر', emoji: '⚒️' }, { id: 'merchant', name: 'تاجر', emoji: '🧑‍🌾' },
                { id: 'bride', name: 'عروس فراری', emoji: '👰' }, { id: 'mermaid', name: 'پری دریایی', emoji: '🧜‍♀️' },
                { id: 'young_witch', name: 'جادوگر جوان', emoji: '🧙‍♀️' }, { id: 'singer', name: 'خواننده', emoji: '👩‍🎤' },
                { id: 'vampire', name: 'خون‌آشام', emoji: '🧛‍♀️' }, { id: 'genie', name: 'جن صحرا', emoji: '🧝‍♀️' },
                { id: 'bandit_female', name: 'راهزن زن', emoji: '🦹‍♀️' }
            ];
            let pc = 0;
            for (let npc of allNpcs) {
                if (!player.prison.find(p => p.npcId === npc.id)) {
                    player.prison.push({ npcId: npc.id, name: npc.name, emoji: npc.emoji, daysUntilEscape: 999, capturedAt: Date.now() });
                    player.prisonRelations[npc.id] = 100;
                    pc++;
                }
            }
            result = { success: true, message: `👑 *همه چیز مکس شد!*\n⭐۱۰۰\n❤️۹۹۹۹\n⚔️۹۹۹\n🛡️۹۹۹\n👑۹۹۹۹۹\n⚡۹۹۹\n🐾۲ حیوون افسانه‌ای\n📦۴۰ صندوقچه\n🔒${pc} NPC زندانی` };
            break;

        case 'god': case 'godmode':
            player.hp = 99999; player.maxHp = 99999;
            player.attack = 9999; player.defense = 9999;
            player.energy = 9999; player.maxEnergy = 9999;
            result = { success: true, message: '🔱 *گاد مود!* ❤️۹۹۹۹۹ ⚔️۹۹۹۹ 🛡️۹۹۹۹ ⚡۹۹۹۹' };
            break;

        // دستورات جدید برای حیوون
        case 'pet': case 'addpet':
            const petType = args[0];
            if (!petType) { result = { success: false, message: '❌ نوع حیوون رو بگو!\n🐺 wolf_cub, wolf_alpha, wolf_spirit\n🐉 dragon_egg, dragon_fire, dragon_ancient' }; break; }
            const { petTypes: allPetTypes, addPet } = require('./pet');
            const petData = allPetTypes[petType];
            if (!petData) { result = { success: false, message: '❌ نوع حیوون نامعتبر!' }; break; }
            const newPet = {
                id: 'admin_' + Date.now(),
                type: petType,
                name: petData.name,
                emoji: petData.emoji,
                image: petData.image,
                level: 1,
                xp: 0,
                xpNeeded: 20,
                attackBonus: petData.attackBonus,
                defenseBonus: petData.defenseBonus,
                hpBonus: petData.hpBonus,
                rarity: petData.rarity,
                evolveLevel: petData.evolveLevel,
                evolveTo: petData.evolveTo,
                foodCost: petData.foodCost,
                evolveMessage: petData.evolveMessage,
                foundAt: Date.now()
            };
            const addResult = addPet(player, newPet);
            result = addResult;
            break;

        case 'removepet': case 'delpet':
            const petId = args[0];
            if (!petId) { result = { success: false, message: '❌ آیدی حیوون رو بگو!' }; break; }
            const { releasePet } = require('./pet');
            result = releasePet(player, petId);
            break;

        case 'petfood': case 'feedpet':
            const { feedAllPets } = require('./pet');
            result = feedAllPets(player);
            break;

        // دستورات جدید برای صندوقچه
        case 'box': case 'addbox':
            const boxType = args[0] || 'wooden';
            if (!player.lootBoxes) player.lootBoxes = { wooden: 0, silver: 0, golden: 0, legendary: 0 };
            const validBoxes = ['wooden', 'silver', 'golden', 'legendary'];
            if (!validBoxes.includes(boxType)) { result = { success: false, message: `❌ نوع صندوق نامعتبر!\n📋 ${validBoxes.join(', ')}` }; break; }
            const boxAmt = parseInt(args[1]) || 1;
            player.lootBoxes[boxType] += boxAmt;
            result = { success: true, message: `✅ ${boxAmt} صندوق ${boxType} اضافه شد!` };
            break;

        case 'openbox': case 'unbox':
            const obType = args[0] || 'wooden';
            if (!player.lootBoxes) player.lootBoxes = { wooden: 0, silver: 0, golden: 0, legendary: 0 };
            const { openLootBox } = require('./lootbox');
            const openResult = openLootBox(player, obType);
            if (openResult.success && openResult.pet) {
                const { addPet: ap } = require('./pet');
                ap(player, openResult.pet);
            }
            result = openResult;
            break;

        case 'boxes': case 'myboxes':
            if (!player.lootBoxes) player.lootBoxes = { wooden: 0, silver: 0, golden: 0, legendary: 0 };
            result = { success: true, message: `📦 *صندوقچه‌های تو:*\n\n📦 چوبی: ${player.lootBoxes.wooden||0}\n📦⚪ نقره‌ای: ${player.lootBoxes.silver||0}\n📦🟡 طلایی: ${player.lootBoxes.golden||0}\n📦🟣 افسانه‌ای: ${player.lootBoxes.legendary||0}` };
            break;

        // دستورات جدید برای ماموریت
        case 'quest': case 'newquest':
            const { generateDailyQuests } = require('./dailyQuest');
            generateDailyQuests(player);
            result = { success: true, message: '📋 ماموریت‌های جدید تولید شد!' };
            break;

        case 'completequest': case 'finishquest':
            if (!player.dailyQuests || !player.dailyQuests.quests) { result = { success: false, message: '❌ ماموریتی نداری! اول /quest بزن.' }; break; }
            for (let quest of player.dailyQuests.quests) {
                if (!quest.completed) {
                    quest.progress = 999;
                    quest.completed = true;
                }
            }
            result = { success: true, message: '✅ همه ماموریت‌ها کامل شدن!' };
            break;

        case 'prison': case 'prisonall':
            if (!player.prison) player.prison = [];
            if (!player.prisonRelations) player.prisonRelations = {};
            const nps = [
                { id: 'witch', name: 'ساحره', emoji: '🧙‍♀️' }, { id: 'ghost_sexy', name: 'روح', emoji: '👻' },
                { id: 'fairy', name: 'پری', emoji: '🧚' }, { id: 'angel', name: 'فرشته', emoji: '👼' },
                { id: 'knight', name: 'شوالیه', emoji: '⚔️' }, { id: 'jester', name: 'دلقک', emoji: '🎭' },
                { id: 'prince', name: 'پرنسس', emoji: '🤴' }, { id: 'skeleton', name: 'اسکلت', emoji: '💀' },
                { id: 'werewolf', name: 'گرگینه', emoji: '🐺' }, { id: 'wizard', name: 'جادوگر', emoji: '🧙‍♂️' },
                { id: 'sage', name: 'حکیم', emoji: '🧙' }, { id: 'farmer', name: 'دهقان', emoji: '🧑‍🌾' },
                { id: 'blacksmith', name: 'آهنگر', emoji: '⚒️' }, { id: 'merchant', name: 'تاجر', emoji: '🧑‍🌾' },
                { id: 'bride', name: 'عروس', emoji: '👰' }, { id: 'mermaid', name: 'پری دریایی', emoji: '🧜‍♀️' },
                { id: 'young_witch', name: 'جادوگر جوان', emoji: '🧙‍♀️' }, { id: 'singer', name: 'خواننده', emoji: '👩‍🎤' },
                { id: 'vampire', name: 'خون‌آشام', emoji: '🧛‍♀️' }, { id: 'genie', name: 'جن', emoji: '🧝‍♀️' },
                { id: 'bandit_female', name: 'راهزن', emoji: '🦹‍♀️' }
            ];
            let ct = 0;
            for (let npc of nps) {
                if (!player.prison.find(p => p.npcId === npc.id)) {
                    player.prison.push({ npcId: npc.id, name: npc.name, emoji: npc.emoji, daysUntilEscape: 999, capturedAt: Date.now() });
                    player.prisonRelations[npc.id] = 100;
                    ct++;
                }
            }
            result = { success: true, message: `🔒 ${ct} NPC زندانی شدن!` };
            break;

        case 'addnpc': case 'addprison':
            const npcId = args[0];
            if (!npcId) { result = { success: false, message: '❌ اسم NPC رو بگو!' }; break; }
            const allNpcKeys = [...Object.keys(config.images.npcs || {}), ...Object.keys(config.images.enemies || {}).filter(k => 
                ['bride', 'mermaid', 'young_witch', 'singer', 'vampire', 'genie', 'bandit_female'].includes(k)
            )];
            const validNpcs = [...new Set(allNpcKeys)];
            if (!validNpcs.includes(npcId)) { result = { success: false, message: `❌ NPC نامعتبر!\n📋 ${validNpcs.join(', ')}` }; break; }
            if (!player.prison) player.prison = [];
            if (!player.prisonRelations) player.prisonRelations = {};
            if (player.prison.find(p => p.npcId === npcId)) { result = { success: false, message: '⚠️ این NPC قبلاً توی زندانته!' }; break; }
            const npcData = config.images.npcs?.[npcId] || config.images.enemies?.[npcId];
            player.prison.push({ npcId, name: npcData?.name || npcId, emoji: npcData?.emoji || '👤', daysUntilEscape: 999, capturedAt: Date.now() });
            player.prisonRelations[npcId] = 100;
            result = { success: true, message: `✅ ${npcData?.emoji || ''} *${npcData?.name || npcId}* به زندان اضافه شد!` };
            break;

        case 'addhouse': case 'addhome':
            const hNpcId = args[0];
            if (!hNpcId) { result = { success: false, message: '❌ اسم NPC رو بگو!' }; break; }
            const validNpcs2 = [...new Set([...Object.keys(config.images.npcs || {}), ...Object.keys(config.images.enemies || {}).filter(k => 
                ['bride', 'mermaid', 'young_witch', 'singer', 'vampire', 'genie', 'bandit_female'].includes(k)
            )])];
            if (!validNpcs2.includes(hNpcId)) { result = { success: false, message: '❌ NPC نامعتبر!' }; break; }
            if (!player.house) player.house = [];
            if (player.house.length >= (config.houseSettings?.maxSlots || 3)) { result = { success: false, message: '❌ خونه پرّه!' }; break; }
            if (player.house.find(h => h.npcId === hNpcId)) { result = { success: false, message: '⚠️ این NPC قبلاً توی خونه‌اته!' }; break; }
            const hNpcData = config.images.npcs?.[hNpcId] || config.images.enemies?.[hNpcId];
            player.house.push({ npcId: hNpcId, name: hNpcData?.name || hNpcId, emoji: hNpcData?.emoji || '👤', joinedAt: Date.now() });
            if (!player.prisonRelations) player.prisonRelations = {};
            player.prisonRelations[hNpcId] = 100;
            result = { success: true, message: `✅ ${hNpcData?.emoji || ''} *${hNpcData?.name || hNpcId}* به خونه اضافه شد!` };
            break;

        case 'removenpc': case 'removeprison':
            const rNpcId = args[0];
            if (!player.prison) { result = { success: false, message: '❌ زندان خالیه!' }; break; }
            const rIndex = player.prison.findIndex(p => p.npcId === rNpcId);
            if (rIndex === -1) { result = { success: false, message: '❌ توی زندان نیست!' }; break; }
            player.prison.splice(rIndex, 1);
            result = { success: true, message: '✅ از زندان حذف شد!' };
            break;

        case 'removehouse': case 'removehome':
            const rhNpcId = args[0];
            if (!player.house) { result = { success: false, message: '❌ خونه خالیه!' }; break; }
            const rhIndex = player.house.findIndex(h => h.npcId === rhNpcId);
            if (rhIndex === -1) { result = { success: false, message: '❌ توی خونه نیست!' }; break; }
            player.house.splice(rhIndex, 1);
            result = { success: true, message: '✅ از خونه حذف شد!' };
            break;

        case 'setrelation': case 'setrel':
            const relNpcId = args[0];
            const relPoints = parseInt(args[1]) || 100;
            if (!player.prisonRelations) player.prisonRelations = {};
            player.prisonRelations[relNpcId] = relPoints;
            result = { success: true, message: `✅ رابطه با ${relNpcId} شد ${relPoints}!` };
            break;

        case 'gift': case 'sendgift': case 'اهدای': case 'اهدا':
            const targetId = parseInt(args[0]);
            const giftItem = args[1];
            const giftAmt = parseInt(args[2]) || 1;
            const targetPlayer = allPlayers[targetId];
            if (!targetPlayer) { result = { success: false, message: '❌ کاربر پیدا نشد!' }; break; }
            const gMap = { 'طلا': 'gold', 'چوب': 'wood', 'سنگ': 'stone', 'گوشت': 'meat', 'آب': 'water', 'پوست': 'skin', 'آهن': 'iron', 'حلقه': 'ring', 'اشک': 'tear', 'طلسم': 'spell', 'آواز': 'song', 'خون': 'blood', 'آرزو': 'wish', 'کلید': 'key', 'الماس': 'diamond', 'فنیشر': 'finisher' };
            const engItem = gMap[giftItem] || giftItem;
            const validItems = ['wood', 'stone', 'meat', 'water', 'skin', 'iron', 'gold', 'ring', 'tear', 'spell', 'song', 'blood', 'wish', 'key', 'diamond', 'finisher'];
            if (!validItems.includes(engItem)) { result = { success: false, message: '❌ آیتم نامعتبر!' }; break; }
            targetPlayer.inventory[engItem] = (targetPlayer.inventory[engItem] || 0) + giftAmt;
            result = { success: true, message: `🎁 هدیه به *${targetPlayer.name}*\n🎒 ${engItem}: +${giftAmt}` };
            break;

        case 'info': case 'whois': case 'اطلاعات':
            const infoId = parseInt(args[0]) || player.chatId;
            const infoPlayer = allPlayers[infoId];
            if (!infoPlayer) { result = { success: false, message: '❌ کاربر پیدا نشد!' }; break; }
            let petsInfo = '';
            if (infoPlayer.pets && infoPlayer.pets.length > 0) {
                petsInfo = '\n🐾 حیوون‌ها: ' + infoPlayer.pets.map(p => p.emoji).join(' ');
            }
            let boxInfo = '';
            if (infoPlayer.lootBoxes) {
                const tb = (infoPlayer.lootBoxes.wooden||0)+(infoPlayer.lootBoxes.silver||0)+(infoPlayer.lootBoxes.golden||0)+(infoPlayer.lootBoxes.legendary||0);
                if (tb > 0) boxInfo = `\n📦 صندوقچه: ${tb} عدد`;
            }
            result = { success: true, message: `👤 *${infoPlayer.name}*\n⭐ Lv.${infoPlayer.level}\n🏆 ${infoPlayer.score} امتیاز\n❤️ ${infoPlayer.hp}/${infoPlayer.maxHp}\n⚔️ ${infoPlayer.attack} 🛡️ ${infoPlayer.defense}\n⚡ ${infoPlayer.energy||0}/${infoPlayer.maxEnergy||100}\n👑 ${infoPlayer.inventory?.gold||0} طلا\n🏠 خونه: ${infoPlayer.house?.length||0} نفر\n💍 همسر: ${infoPlayer.marry||'نداره'}\n🔒 زندان: ${infoPlayer.prison?.length||0} نفر${petsInfo}${boxInfo}` };
            break;

        case 'users': case 'count': case 'کاربران':
            const count = Object.keys(allPlayers).length;
            const active = Object.values(allPlayers).filter(p => p.score > 0).length;
            const withPets = Object.values(allPlayers).filter(p => p.pets && p.pets.length > 0).length;
            result = { success: true, message: `👥 *آمار کاربران*\n\n📊 کل: ${count}\n🎮 فعال: ${active}\n🐾 حیوون‌دار: ${withPets}` };
            break;

        case 'top': case 'top10': case 'برترین‌ها':
            const sorted = Object.entries(allPlayers).sort((a, b) => (b[1].score || 0) - (a[1].score || 0)).slice(0, 10);
            let msg = '🏆 *۱۰ کاربر برتر:*\n\n';
            sorted.forEach((p, i) => { 
                let extra = '';
                if (p[1].pets && p[1].pets.length > 0) extra += ' 🐾';
                msg += `${i+1}. ${p[1].name}: ${p[1].score} امتیاز${extra}\n`; 
            });
            result = { success: true, message: msg };
            break;

        case 'resetuser': case 'ru':
            const ruId = parseInt(args[0]);
            const ruPlayer = allPlayers[ruId];
            if (!ruPlayer) { result = { success: false, message: '❌ کاربر پیدا نشد!' }; break; }
            ruPlayer.level = 1; ruPlayer.xp = 0; ruPlayer.hp = 100; ruPlayer.maxHp = 100;
            ruPlayer.attack = 5; ruPlayer.defense = 2; ruPlayer.score = 0;
            ruPlayer.energy = 0; ruPlayer.maxEnergy = 100;
            ruPlayer.inventory = { wood: 0, stone: 0, meat: 0, water: 0, skin: 0, iron: 0, gold: 10, ring: 0, tear: 0, spell: 0, song: 0, blood: 0, wish: 0, key: 0, diamond: 0, finisher: 0 };
            ruPlayer.equipment = { weapon: null, armor: null, house: null };
            ruPlayer.unlocked = { locations: ['village'], enemies: ['wolf', 'snake', 'bandit'], npcs: [], recipes: [] };
            ruPlayer.prison = []; ruPlayer.prisonRelations = {}; ruPlayer.seduced = {};
            ruPlayer.house = []; ruPlayer.marry = null; ruPlayer.enraged = {};
            ruPlayer.pets = []; ruPlayer.petFood = 0;
            ruPlayer.lootBoxes = { wooden: 0, silver: 0, golden: 0, legendary: 0 };
            ruPlayer.dailyQuests = { quests: [], completed: [], lastReset: Date.now(), progress: {} };
            result = { success: true, message: `🔄 *${ruPlayer.name}* ریست شد!` };
            break;

        case 'ban':
            const banId = parseInt(args[0]);
            bannedUsers[banId] = true;
            result = { success: true, message: `🚫 کاربر ${banId} مسدود شد!` };
            break;

        case 'unban':
            const unbanId = parseInt(args[0]);
            delete bannedUsers[unbanId];
            result = { success: true, message: `✅ کاربر ${unbanId} آزاد شد!` };
            break;

        case 'announce': case 'ann':
            const announceMsg = args.join(' ');
            result = { success: true, message: `📢 پیام آماده ارسال!\n📝 "${announceMsg}"`, announce: announceMsg, announceAll: true };
            break;

        case 'save': case 'ذخیره':
            require('./storage').savePlayers(allPlayers);
            result = { success: true, message: '💾 ذخیره شد!' };
            break;

        case 'reset': case 'ریست': case 'ریست کن':
            player.level = 1; player.xp = 0; player.hp = 100; player.maxHp = 100;
            player.attack = 5; player.defense = 2; player.score = 0;
            player.energy = 0; player.maxEnergy = 100;
            player.inventory = { wood: 0, stone: 0, meat: 0, water: 0, skin: 0, iron: 0, gold: 10, ring: 0, tear: 0, spell: 0, song: 0, blood: 0, wish: 0, key: 0, diamond: 0, finisher: 0 };
            player.equipment = { weapon: null, armor: null, house: null };
            player.unlocked = { locations: ['village'], enemies: ['wolf', 'snake', 'bandit'], npcs: [], recipes: [] };
            player.prison = []; player.prisonRelations = {}; player.seduced = {};
            player.house = []; player.marry = null; player.enraged = {};
            player.pets = []; player.petFood = 0;
            player.lootBoxes = { wooden: 0, silver: 0, golden: 0, legendary: 0 };
            player.dailyQuests = { quests: [], completed: [], lastReset: Date.now(), progress: {} };
            result = { success: true, message: '🔄 *همه چیز ریست شد!*' };
            break;

        case 'help': case 'کمک':
            result = { success: true, message: `👑 *دستورات ادمین:*\n\n📊 *منابع:* gold, xp, score, heal, item, attack, defense, level, energy\n🔓 *باز کردن:* unlock, max, god\n🐾 *حیوون:* pet, removepet, petfood\n📦 *صندوقچه:* box, openbox, boxes\n📋 *ماموریت:* quest, completequest\n🔒 *زندان:* prison, addnpc, removenpc\n🏠 *خونه:* addhouse, removehouse\n💋 *رابطه:* setrelation\n🎁 *هدیه:* gift, اهدای\n📊 *اطلاعات:* info, users, top\n🔄 *مدیریت:* resetuser, ban, unban, reset\n📢 *اعلان:* announce\n💾 *ذخیره:* save\n\n📊 *فارسی:* اهدای, اطلاعات, کاربران, برترین‌ها, ذخیره, ریست کن, کمک\n💡 *بدون / هم:* کمک به [id]` };
            break;
    }

    return result;
}

module.exports = { isAdmin, isBanned, adminCommand, ADMIN_ID, bannedUsers };