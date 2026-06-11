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

    // اطمینان از وجود همه آبجکت‌ها
    if (!player.inventory) player.inventory = {};
    if (!player.unlocked) player.unlocked = { locations: ['village'], enemies: ['wolf', 'snake', 'bandit'], npcs: [], recipes: [] };
    if (!player.equipment) player.equipment = { weapon: null, armor: null, house: null };
    if (!player.lootBoxes) player.lootBoxes = { wooden: 0, silver: 0, golden: 0, legendary: 0 };
    if (!player.pets) player.pets = [];
    if (!player.prison) player.prison = [];
    if (!player.prisonRelations) player.prisonRelations = {};
    if (!player.house) player.house = [];
    if (!player.children) player.children = [];
    if (!player.empire) player.empire = { level: 0, roles: {}, wonders: [], dynastyName: '', treasury: 0 };

    switch (cmd) {
        // ============ منابع پایه ============
        case 'gold': case 'g':
            const g = parseInt(args[0]) || 100;
            player.inventory.gold = (player.inventory.gold || 0) + g;
            result = { success: true, message: `✅ ${g}👑 طلا اضافه شد!` };
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
            result = { success: true, message: `✅ ${s}🏆 امتیاز اضافه شد!` };
            break;

        case 'heal': case 'hp':
            player.hp = player.maxHp || 100;
            result = { success: true, message: `✅ جان کامل شد! ❤️ ${player.hp}/${player.maxHp}` };
            break;

        case 'energy': case 'en':
            const en = parseInt(args[0]) || 50;
            player.energy = Math.min((player.maxEnergy || 100), (player.energy || 0) + en);
            result = { success: true, message: `✅ ${en}⚡ انرژی اضافه شد!` };
            break;

        case 'item': case 'give':
            const item = args[0];
            const amt = parseInt(args[1]) || 10;
            const validItems = ['wood', 'stone', 'meat', 'water', 'skin', 'iron', 'gold', 'ring', 'tear', 'spell', 'song', 'blood', 'wish', 'key', 'diamond', 'finisher', 'condom'];
            if (validItems.includes(item)) {
                player.inventory[item] = (player.inventory[item] || 0) + amt;
                result = { success: true, message: `✅ ${amt} ${item} اضافه شد!` };
            } else {
                result = { success: false, message: `❌ آیتم نامعتبر!` };
            }
            break;

        case 'attack': case 'atk':
            const a = parseInt(args[0]) || 10;
            player.attack = (player.attack || 5) + a;
            result = { success: true, message: `✅ ${a}⚔️ حمله اضافه شد!` };
            break;

        case 'defense': case 'def':
            const d = parseInt(args[0]) || 10;
            player.defense = (player.defense || 2) + d;
            result = { success: true, message: `✅ ${d}🛡️ دفاع اضافه شد!` };
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

        case 'day': case 'setday':
            const newDay = parseInt(args[0]) || 1;
            if (!player.gameDay) player.gameDay = 1;
            player.gameDay = Math.max(1, Math.min(7, newDay));
            result = { success: true, message: `📅 روز بازی: ${player.gameDay}/۷` };
            break;

        case 'nextday': case 'nd':
            if (!player.gameDay) player.gameDay = 1;
            player.gameDay = player.gameDay >= 7 ? 1 : player.gameDay + 1;
            result = { success: true, message: `📅 روز جدید: ${player.gameDay}/۷` };
            break;

        case 'resetday': case 'rd':
            player.gameDay = 1;
            result = { success: true, message: '📅 روز بازی ریست شد (روز ۱)' };
            break;

        case 'condom': case 'cd':
            const condomAmt = parseInt(args[0]) || 1;
            player.inventory.condom = (player.inventory.condom || 0) + condomAmt;
            result = { success: true, message: `🎈 ${condomAmt} کاندوم اضافه شد!` };
            break;

        // ============ باز کردن کامل ============
        case 'unlock': case 'unlockall':
            if (!player.unlocked) player.unlocked = { locations: [], enemies: [], npcs: [], recipes: [] };
            player.unlocked.locations = ['village', 'forest', 'river', 'mountain', 'plain', 'cave', 'desert'];
            player.unlocked.enemies = ['wolf', 'snake', 'bandit', 'lion', 'bear', 'soldier', 'fairy', 'werewolf', 'skeleton', 'dragon', 'scorpion', 'crocodile', 'eagle', 'knight_enemy', 'queen', 'bride', 'mermaid', 'young_witch', 'singer', 'vampire', 'genie', 'bandit_female'];
            player.unlocked.npcs = ['witch', 'ghost_sexy', 'fairy', 'knight', 'angel', 'wizard', 'werewolf', 'prince', 'jester', 'skeleton', 'sage', 'farmer', 'blacksmith', 'merchant', 'bride', 'mermaid', 'young_witch', 'singer', 'vampire', 'genie', 'bandit_female'];
            player.unlocked.recipes = ['تبر سنگی', 'شمشیر آهنی', 'زره چرمی', 'کلبه چوبی', 'تیروکمان'];
            result = { success: true, message: '🔓 *همه چیز باز شد!*' };
            break;

        // ============ مکس کامل ============
        case 'max': case 'maxall':
            player.level = 100;
            player.xp = 99999;
            player.maxHp = 9999;
            player.hp = 9999;
            player.attack = 999;
            player.defense = 999;
            player.score = 99999;
            player.energy = 999;
            player.maxEnergy = 999;
            player.gameDay = player.gameDay || 1;
            
            player.inventory = { 
                wood: 999, stone: 999, meat: 999, water: 999, 
                skin: 999, iron: 999, gold: 99999, 
                ring: 50, tear: 50, spell: 50, song: 50, 
                blood: 50, wish: 50, key: 50, diamond: 50, 
                finisher: 50, condom: 50 
            };
            
            player.equipment = { 
                weapon: 'شمشیر افسانه‌ای', 
                armor: 'زره اژدها', 
                house: 'قصر باشکوه' 
            };
            
            if (!player.unlocked) player.unlocked = { locations: [], enemies: [], npcs: [], recipes: [] };
            player.unlocked.locations = ['village', 'forest', 'river', 'mountain', 'plain', 'cave', 'desert'];
            player.unlocked.enemies = ['wolf', 'snake', 'bandit', 'lion', 'bear', 'soldier', 'fairy', 'werewolf', 'skeleton', 'dragon', 'scorpion', 'crocodile', 'eagle', 'knight_enemy', 'queen', 'bride', 'mermaid', 'young_witch', 'singer', 'vampire', 'genie', 'bandit_female'];
            player.unlocked.npcs = ['witch', 'ghost_sexy', 'fairy', 'knight', 'angel', 'wizard', 'werewolf', 'prince', 'jester', 'skeleton', 'sage', 'farmer', 'blacksmith', 'merchant', 'bride', 'mermaid', 'young_witch', 'singer', 'vampire', 'genie', 'bandit_female'];
            player.unlocked.recipes = ['تبر سنگی', 'شمشیر آهنی', 'زره چرمی', 'کلبه چوبی', 'تیروکمان'];
            
            player.lootBoxes = { wooden: 10, silver: 10, golden: 10, legendary: 10 };
            player.pets = player.pets || [];
            player.prison = player.prison || [];
            player.prisonRelations = player.prisonRelations || {};
            player.house = player.house || [];
            player.children = player.children || [];
            player.pregnancies = player.pregnancies || [];
            player.childSlots = 3;
            player.enemiesDefeated = 9999;
            player.travels = 999;
            player.gathers = 999;
            player.hasGlow = true;
            player.hasDayPower = true;
            player.hasNightPower = true;
            
            if (!player.empire) player.empire = {};
            player.empire.level = 6;
            player.empire.dynastyName = player.empire.dynastyName || 'سلسله اساطیر';
            player.empire.treasury = 999999;
            player.empire.wonders = player.empire.wonders || [];
            
            if (!player.people) {
                try { const { initPeople } = require('./people'); initPeople(player); } catch (e) {}
            }
            
            result = { 
                success: true, 
                message: `👑 *همه چیز مکس شد!*\n\n⭐ سطح ۱۰۰\n❤️ ۹۹۹۹ | ⚔️ ۹۹۹ | 🛡️ ۹۹۹\n👑 ۹۹,۹۹۹ طلا\n⚡ ۹۹۹ انرژی\n🎈 ۵۰ کاندوم\n📦 صندوقچه‌ها: ۱۰+۱۰+۱۰+۱۰\n🏛️ امپراطوری سطح ۶\n💎 ۵۰ الماس\n🗝️ ۵۰ کلید\n💀 ۵۰ فنیشر\n\n✨ *قدرت مطلق!*` 
            };
            break;

        // ============ گاد مود ============
        case 'god': case 'godmode':
            player.hp = 99999;
            player.maxHp = 99999;
            player.attack = 9999;
            player.defense = 9999;
            player.energy = 9999;
            player.maxEnergy = 9999;
            player.level = 999;
            player.score = 999999;
            player.inventory.gold = 999999;
            player.inventory.diamond = 999;
            player.inventory.finisher = 999;
            player.inventory.spell = 999;
            player.inventory.key = 999;
            player.hasGlow = true;
            player.hasDayPower = true;
            player.hasNightPower = true;
            result = { success: true, message: '🔱 *گاد مود فعال شد!*\n\n❤️ ۹۹,۹۹۹\n⚔️ ۹,۹۹۹\n🛡️ ۹,۹۹۹\n⚡ ۹,۹۹۹\n⭐ سطح ۹۹۹\n👑 ۹۹۹,۹۹۹ طلا\n💎 ۹۹۹ الماس\n\n*تو خدای این بازی شدی!* ⚡' };
            break;

        // ============ حیوانات ============
        case 'pet': case 'addpet':
            try {
                const petType = args[0];
                if (!petType) { result = { success: false, message: '❌ نوع: wolf_cub, wolf_spirit, dragon_egg, dragon_ancient' }; break; }
                const { petTypes, addPet } = require('./pet');
                const petData = petTypes[petType];
                if (!petData) { result = { success: false, message: '❌ نوع نامعتبر!' }; break; }
                const newPet = { id: 'admin_' + Date.now(), type: petType, name: petData.name, emoji: petData.emoji, level: 1, xp: 0, xpNeeded: 20, attackBonus: petData.attackBonus, defenseBonus: petData.defenseBonus, hpBonus: petData.hpBonus, rarity: petData.rarity, foodCost: petData.foodCost || 3, foundAt: Date.now() };
                result = addPet(player, newPet);
            } catch (e) { result = { success: false, message: '❌ سیستم حیوانات در دسترس نیست!' }; }
            break;

        case 'removepet': case 'delpet':
            try { const { releasePet } = require('./pet'); result = releasePet(player, args[0]); } 
            catch (e) { result = { success: false, message: '❌ خطا!' }; }
            break;

        case 'petfood': case 'feedpet':
            try { const { feedAllPets } = require('./pet'); result = feedAllPets(player); } 
            catch (e) { result = { success: false, message: '❌ خطا!' }; }
            break;

        // ============ صندوقچه ============
        case 'box': case 'addbox':
            const boxType = args[0] || 'wooden';
            const validBoxes = ['wooden', 'silver', 'golden', 'legendary'];
            if (!validBoxes.includes(boxType)) { result = { success: false, message: '❌ نوع: wooden, silver, golden, legendary' }; break; }
            const boxAmt = parseInt(args[1]) || 1;
            player.lootBoxes[boxType] += boxAmt;
            result = { success: true, message: `✅ ${boxAmt} صندوق ${boxType} اضافه شد!` };
            break;

        case 'openbox': case 'unbox':
            try { const { openLootBox } = require('./lootbox'); result = openLootBox(player, args[0] || 'wooden'); } 
            catch (e) { result = { success: false, message: '❌ خطا!' }; }
            break;

        case 'boxes': case 'myboxes':
            result = { success: true, message: `📦 چوبی: ${player.lootBoxes.wooden||0}\n📦⚪ نقره: ${player.lootBoxes.silver||0}\n📦🟡 طلا: ${player.lootBoxes.golden||0}\n📦🟣 افسانه: ${player.lootBoxes.legendary||0}` };
            break;

        // ============ ماموریت ============
        case 'quest': case 'newquest':
            try { const { generateDailyQuests } = require('./dailyQuest'); generateDailyQuests(player); result = { success: true, message: '📋 ماموریت‌های جدید!' }; } 
            catch (e) { result = { success: false, message: '❌ خطا!' }; }
            break;

        case 'completequest': case 'finishquest':
            if (!player.dailyQuests || !player.dailyQuests.quests) { result = { success: false, message: '❌ اول quest بزن.' }; break; }
            for (let quest of player.dailyQuests.quests) { quest.progress = 999; quest.completed = true; }
            result = { success: true, message: '✅ همه ماموریت‌ها کامل شدن!' };
            break;

        // ============ فرزندان ============
        case 'child': case 'addchild':
            try {
                const childClass = args[0] || 'warrior';
                const childGender = args[1] || 'male';
                const childLegendary = args[2] === 'legendary';
                if (player.children.filter(c => c.isAlive).length >= (player.childSlots || 3)) {
                    result = { success: false, message: '❌ ظرفیت فرزندان پره!' }; break;
                }
                const { childClasses, getRandomName } = require('./offspring');
                const cls = childClasses[childClass];
                if (!cls) { result = { success: false, message: '❌ کلاس نامعتبر!' }; break; }
                const newChild = {
                    id: 'admin_child_' + Date.now(), name: getRandomName(childGender), gender: childGender,
                    emoji: childLegendary ? '🌟👦' : (childGender === 'male' ? '👦' : '👧'),
                    class: childClass, classEmoji: cls.emoji, className: cls.name,
                    motherId: 'admin', motherName: 'الهه', motherEmoji: '✨',
                    isSpouse: false, bornAt: Date.now(), age: 10, ageStage: 'adult', stageEmoji: '👨',
                    level: childLegendary ? 5 : 3, evolutionLevel: childLegendary ? 5 : 3,
                    evolutionName: childLegendary ? 'اسطوره' : 'قهرمان', xp: 999, xpNeeded: 1000,
                    attack: childLegendary ? 200 : 80, defense: childLegendary ? 150 : 60,
                    hp: childLegendary ? 500 : 200, power: childLegendary ? 200 : 80,
                    loyalty: 100, isLegendary: childLegendary, isHeir: false, isAlive: true,
                    missions: [], lastMission: 0, skills: [], inventory: { food: 0, toys: 0, books: 0 }
                };
                player.children.push(newChild);
                result = { success: true, message: `✅ ${newChild.emoji} *${newChild.name}* متولد شد!` };
            } catch (e) { result = { success: false, message: '❌ خطا!' }; }
            break;

        case 'heir': case 'setheir':
            try { const { assignHeir } = require('./offspring'); result = assignHeir(player, args[0]); } catch (e) { result = { success: false, message: '❌ خطا!' }; }
            break;

        case 'killchild': case 'deadchild':
            try { const { childDies } = require('./offspring'); result = childDies(player, args[0], 'فرمان ادمین'); } catch (e) { result = { success: false, message: '❌ خطا!' }; }
            break;

        case 'tournament': case 'tour':
            try { const { holdTournament } = require('./offspring'); result = holdTournament(player); } catch (e) { result = { success: false, message: '❌ خطا!' }; }
            break;

        case 'pregnant': case 'makepregnant':
            try {
                const pregNpcId = args[0] || (player.house && player.house[0] ? player.house[0].npcId : null);
                if (!pregNpcId) { result = { success: false, message: '❌ کسی توی خونه نیست!' }; break; }
                const { checkPregnancy } = require('./offspring');
                const pregResult = checkPregnancy(player, pregNpcId, player.marry === pregNpcId, 'front');
                if (pregResult) { result = { success: true, message: `🤰 ${pregResult.motherEmoji} *${pregResult.motherName}* باردار شد!` }; }
                else { result = { success: false, message: '❌ بارداری ناموفق!' }; }
            } catch (e) { result = { success: false, message: '❌ خطا!' }; }
            break;

        case 'birth': case 'givebirth':
            try {
                const { checkBirths } = require('./offspring');
                const births = checkBirths(player);
                if (births.length > 0) {
                    let msg = '👶 *تولد!*\n\n';
                    for (let child of births) { msg += `${child.emoji} *${child.name}* به دنیا اومد!\n`; }
                    result = { success: true, message: msg };
                } else { result = { success: false, message: '❌ هیچ بارداری آماده نیست!' }; }
            } catch (e) { result = { success: false, message: '❌ خطا!' }; }
            break;

        // ============ حرمسرا ============
        case 'addqueen': case 'aq':
            try { const { addQueenToHarem } = require('./queenHarem'); result = addQueenToHarem(player, args[0]); } catch (e) { result = { success: false, message: '❌ خطا!' }; }
            break;

        case 'removequeen': case 'rq':
            try { const { removeQueenFromHarem } = require('./queenHarem'); result = removeQueenFromHarem(player, args[0]); } catch (e) { result = { success: false, message: '❌ خطا!' }; }
            break;

        case 'queencare': case 'qc':
            try { const { careAllQueens } = require('./queenHarem'); result = careAllQueens(player); } catch (e) { result = { success: false, message: '❌ خطا!' }; }
            break;

        case 'queensalary': case 'qs':
            try { const { paySalaries } = require('./queenHarem'); result = paySalaries(player); } catch (e) { result = { success: false, message: '❌ خطا!' }; }
            break;

        case 'promotequeen': case 'pq':
            try { const { upgradeGirlToQueen } = require('./secretChamber'); result = upgradeGirlToQueen(player, args[0]); } catch (e) { result = { success: false, message: '❌ خطا!' }; }
            break;

        // ============ امپراطوری ============
        case 'empirelevel': case 'setempire':
            if (!player.empire) player.empire = {};
            player.empire.level = Math.min(6, Math.max(0, parseInt(args[0]) || 1));
            result = { success: true, message: `✅ سطح امپراطوری: ${player.empire.level}` };
            break;

        case 'dynasty': case 'setdynasty':
            try { const { setDynastyName } = require('./empire'); result = setDynastyName(player, args.join(' ')); } catch (e) { result = { success: false, message: '❌ خطا!' }; }
            break;

        case 'income': case 'collectincome':
            try { const { collectEmpireIncome } = require('./empire'); result = collectEmpireIncome(player); } catch (e) { result = { success: false, message: '❌ خطا!' }; }
            break;

        case 'wonder': case 'addwonder':
            try {
                if (!player.empire) player.empire = { level: 5, wonders: [] };
                const { wonders } = require('./empire');
                if (!wonders[args[0]]) { result = { success: false, message: '❌ عجایب نامعتبر!' }; break; }
                if (!player.empire.wonders.includes(args[0])) { 
                    player.empire.wonders.push(args[0]); 
                    result = { success: true, message: `✅ ${wonders[args[0]].emoji} ${wonders[args[0]].name} ساخته شد!` }; 
                } else { result = { success: false, message: '❌ قبلاً ساخته شده!' }; }
            } catch (e) { result = { success: false, message: '❌ خطا!' }; }
            break;

        // ============ مردم ============
        case 'population': case 'pop':
            try {
                const popAmt = parseInt(args[0]) || 100;
                if (!player.people) { const { initPeople } = require('./people'); initPeople(player); }
                for (let type in player.people.population) { player.people.population[type].count += Math.floor(popAmt / 7); }
                result = { success: true, message: `✅ +${popAmt} نفر جمعیت!` };
            } catch (e) { result = { success: false, message: '❌ خطا!' }; }
            break;

        case 'food': case 'addfood':
            try {
                if (!player.people) { const { initPeople } = require('./people'); initPeople(player); }
                player.people.storage.food += parseInt(args[0]) || 500;
                result = { success: true, message: `✅ غذا اضافه شد!` };
            } catch (e) { result = { success: false, message: '❌ خطا!' }; }
            break;

        case 'water': case 'addwater':
            try {
                if (!player.people) { const { initPeople } = require('./people'); initPeople(player); }
                player.people.storage.water += parseInt(args[0]) || 200;
                result = { success: true, message: `✅ آب اضافه شد!` };
            } catch (e) { result = { success: false, message: '❌ خطا!' }; }
            break;

        case 'building': case 'addbuilding':
            try {
                if (!player.people) { const { initPeople } = require('./people'); initPeople(player); }
                const { buildings } = require('./people');
                if (!buildings[args[0]]) { result = { success: false, message: '❌ ساختمان نامعتبر!' }; break; }
                if (!player.people.buildings.includes(args[0])) {
                    player.people.buildings.push(args[0]);
                    result = { success: true, message: `✅ ${buildings[args[0]].emoji} ${buildings[args[0]].name} ساخته شد!` };
                } else { result = { success: false, message: '❌ قبلاً ساخته شده!' }; }
            } catch (e) { result = { success: false, message: '❌ خطا!' }; }
            break;

        case 'stats': case 'setstats':
            try {
                if (!player.people) { const { initPeople } = require('./people'); initPeople(player); }
                const val = parseInt(args[0]) || 100;
                player.people.stats.happiness = val;
                player.people.stats.hunger = val;
                player.people.stats.safety = val;
                player.people.stats.justice = val;
                player.people.stats.faith = val;
                result = { success: true, message: `✅ همه شاخص‌ها ${val}٪` };
            } catch (e) { result = { success: false, message: '❌ خطا!' }; }
            break;

        case 'blackmarket': case 'bm':
            try { const { refreshBlackMarket, formatBlackMarket } = require('./blackMarket'); refreshBlackMarket(player); result = { success: true, message: formatBlackMarket(player) }; } catch (e) { result = { success: false, message: '❌ خطا!' }; }
            break;

        // ============ زندان و خونه ============
        case 'addnpc': case 'addprison':
            if (!player.prison) player.prison = [];
            if (!player.prisonRelations) player.prisonRelations = {};
            const npcId = args[0];
            if (!npcId) { result = { success: false, message: '❌ اسم NPC رو بگو!' }; break; }
            const npcData = config.images.npcs?.[npcId] || config.images.enemies?.[npcId];
            player.prison.push({ npcId, name: npcData?.name || npcId, emoji: npcData?.emoji || '👤', daysUntilEscape: 999, capturedAt: Date.now() });
            player.prisonRelations[npcId] = 100;
            result = { success: true, message: `✅ ${npcData?.emoji || ''} *${npcData?.name || npcId}* زندانی شد!` };
            break;

        case 'addhouse': case 'addhome':
            if (!player.house) player.house = [];
            const hNpcId = args[0];
            if (!hNpcId) { result = { success: false, message: '❌ اسم NPC رو بگو!' }; break; }
            const hNpcData = config.images.npcs?.[hNpcId] || config.images.enemies?.[hNpcId];
            player.house.push({ npcId: hNpcId, name: hNpcData?.name || hNpcId, emoji: hNpcData?.emoji || '👤', joinedAt: Date.now() });
            player.prisonRelations[hNpcId] = 100;
            result = { success: true, message: `✅ ${hNpcData?.emoji || ''} به خونه اضافه شد!` };
            break;

        case 'marrynow': case 'forcemarry':
            const marryNpcId = args[0] || player.house?.[0]?.npcId;
            if (!marryNpcId) { result = { success: false, message: '❌ کسی توی خونه نیست!' }; break; }
            player.marry = marryNpcId;
            player.maxHp = (player.maxHp || 100) + 200; player.hp = player.maxHp;
            player.attack = (player.attack || 5) + 50; player.defense = (player.defense || 2) + 20;
            result = { success: true, message: `💍 ازدواج با ${marryNpcId}!\n❤️ +۲۰۰\n⚔️ +۵۰\n🛡️ +۲۰` };
            break;

        // ============ هدیه ============
        case 'gift': case 'sendgift':
            const targetId = parseInt(args[0]);
            const giftItem = args[1];
            const giftAmt = parseInt(args[2]) || 1;
            const targetPlayer = allPlayers[targetId];
            if (!targetPlayer) { result = { success: false, message: '❌ کاربر پیدا نشد!' }; break; }
            targetPlayer.inventory[giftItem] = (targetPlayer.inventory[giftItem] || 0) + giftAmt;
            result = { success: true, message: `🎁 هدیه به *${targetPlayer.name}*\n🎒 ${giftItem}: +${giftAmt}` };
            break;

        // ============ اطلاعات ============
        case 'info': case 'whois':
            const infoPlayer = allPlayers[parseInt(args[0]) || player.chatId] || player;
            result = { success: true, message: `👤 *${infoPlayer.name}*\n⭐ Lv.${infoPlayer.level}\n🏆 ${infoPlayer.score} امتیاز\n❤️ ${infoPlayer.hp}/${infoPlayer.maxHp}\n⚔️ ${infoPlayer.attack} 🛡️ ${infoPlayer.defense}` };
            break;

        case 'users': case 'count':
            result = { success: true, message: `👥 کل کاربران: ${Object.keys(allPlayers).length}` };
            break;

        case 'top': case 'top10':
            const sorted = Object.entries(allPlayers).sort((a, b) => (b[1].score || 0) - (a[1].score || 0)).slice(0, 10);
            let topMsg = '🏆 *۱۰ کاربر برتر:*\n\n';
            sorted.forEach((p, i) => { topMsg += `${i+1}. ${p[1].name}: ${p[1].score} امتیاز\n`; });
            result = { success: true, message: topMsg };
            break;

        case 'resetuser': case 'ru':
            const ruPlayer = allPlayers[parseInt(args[0])];
            if (!ruPlayer) { result = { success: false, message: '❌ کاربر پیدا نشد!' }; break; }
            ruPlayer.level = 1; ruPlayer.xp = 0; ruPlayer.hp = 100; ruPlayer.maxHp = 100;
            ruPlayer.attack = 5; ruPlayer.defense = 2; ruPlayer.score = 0;
            ruPlayer.inventory = { wood: 0, stone: 0, meat: 0, water: 0, skin: 0, iron: 0, gold: 10 };
            ruPlayer.unlocked = { locations: ['village'], enemies: ['wolf', 'snake', 'bandit'], npcs: [], recipes: [] };
            result = { success: true, message: `🔄 *${ruPlayer.name}* ریست شد!` };
            break;

        case 'ban': bannedUsers[parseInt(args[0])] = true; result = { success: true, message: '🚫 مسدود شد!' }; break;
        case 'unban': delete bannedUsers[parseInt(args[0])]; result = { success: true, message: '✅ آزاد شد!' }; break;

        case 'announce': case 'ann':
            result = { success: true, message: `📢 "${args.join(' ')}"`, announce: args.join(' '), announceAll: true };
            break;

        case 'save': require('./storage').savePlayers(allPlayers); result = { success: true, message: '💾 ذخیره شد!' }; break;

        case 'reset':
            player.level = 1; player.xp = 0; player.hp = 100; player.maxHp = 100;
            player.attack = 5; player.defense = 2; player.score = 0; player.energy = 0;
            player.inventory = { wood: 0, stone: 0, meat: 0, water: 0, skin: 0, iron: 0, gold: 10 };
            player.unlocked = { locations: ['village'], enemies: ['wolf', 'snake', 'bandit'], npcs: [], recipes: [] };
            result = { success: true, message: '🔄 *همه چیز ریست شد!*' };
            break;

        case 'help': case 'کمک':
            result = { success: true, message: `👑 *دستورات ادمین*\n\n📊 gold, xp, score, heal, item, attack, defense, level, energy\n🔓 unlock, max, god\n🐾 pet, removepet, petfood\n📦 box, openbox, boxes\n📋 quest, completequest\n👶 child, heir, killchild, tournament, pregnant, birth\n👸 addqueen, removequeen, queencare, queensalary\n🏛️ empirelevel, dynasty, income, wonder\n👥 population, food, water, building, stats\n🕶️ blackmarket\n🔒 prison, addnpc, removenpc\n🏠 addhouse, removehouse, setrelation, marrynow\n🎁 gift\n📊 info, users, top\n🔄 resetuser, ban, unban, reset\n📢 announce\n💾 save` };
            break;
    }

    return result;
}

module.exports = { isAdmin, isBanned, adminCommand, ADMIN_ID, bannedUsers };