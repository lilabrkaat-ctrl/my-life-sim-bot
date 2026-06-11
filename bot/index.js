const { bot } = require('./core');
const { setupMenuHandlers } = require('./menuHandlers');
const { setupChamberHandlers } = require('./chamberHandlers');

// راه‌اندازی همه هندلرها
setupMenuHandlers();
setupChamberHandlers();

const { isAdmin, adminCommand, adminState, mainMenu } = require('./core');
const { player } = require('./core');
const { getShopState, processAmount } = require('../shop');
const { cancelShop } = require('../shop');

// ============ هندلر دکمه برگشت سراسری ============
bot.onText(/^🔙 برگشت$/, async (msg) => {
    const chatId = msg.chat.id;
    const p = player.getPlayer(chatId);
    if (!p) return bot.sendMessage(chatId, '❌ /start بزن!', mainMenu());
    
    // پاک کردن همه state ها
    const { chamberState, empireState, peopleState, courtState, haremState } = require('./core');
    if (adminState[chatId]) delete adminState[chatId];
    if (chamberState[chatId]) delete chamberState[chatId];
    if (empireState[chatId]) delete empireState[chatId];
    if (peopleState[chatId]) delete peopleState[chatId];
    if (courtState[chatId]) delete courtState[chatId];
    if (haremState[chatId]) delete haremState[chatId];
    
    const config = require('../config');
    const { getTimeOfDay } = require('../player');
    const time = getTimeOfDay();
    p.timeOfDay = time;
    const loc = config.images.locations[p.location] || config.images.locations.village;
    let welcome = `🏛️ *بقای باستانی*\n\n✨ ${p.name} | 📍 ${loc.emoji} ${loc.name}\n${time.name} | 📅 روز ${p.gameDay||1}/۷ | 🏆 ${p.score||0} امتیاز`;
    await bot.sendMessage(chatId, welcome, { parse_mode: 'Markdown', ...mainMenu() });
});

// ============ هندلرهای نبرد ============
const { activeBattles } = require('./core');

bot.onText(/^⚔️ 🗡️ حمله کن$/, async (msg) => {
    const chatId = msg.chat.id;
    const p = player.getPlayer(chatId);
    if (!p || !activeBattles[chatId]) return;
    const enemy = activeBattles[chatId];
    const { playerAttack } = require('../fight');
    const result = playerAttack(p, enemy);
    if (result.battleOver) {
        delete activeBattles[chatId];
        if (result.canCapture) {
            const { captureNpc } = require('../prison');
            const captureResult = captureNpc(p, result.npcId);
            if (captureResult.success) {
                await bot.sendMessage(chatId, result.message + '\n\n' + captureResult.message, { parse_mode: 'Markdown', ...mainMenu() });
            } else {
                await bot.sendMessage(chatId, result.message, { parse_mode: 'Markdown', ...mainMenu() });
            }
        } else {
            if (result.animation) {
                await require('./core').sendAnimation(chatId, result.animation, result.message, mainMenu());
            } else {
                await bot.sendMessage(chatId, result.message, { parse_mode: 'Markdown', ...mainMenu() });
            }
        }
    } else {
        await bot.sendMessage(chatId, result.message, { parse_mode: 'Markdown', ...require('../fight').getBattleKeyboard(p, enemy) });
    }
});

bot.onText(/^📜 طلسم$/, async (msg) => {
    const chatId = msg.chat.id;
    const p = player.getPlayer(chatId);
    if (!p || !activeBattles[chatId]) return;
    const enemy = activeBattles[chatId];
    const { useSpell } = require('../fight');
    const result = useSpell(p, enemy);
    if (result.battleOver) {
        delete activeBattles[chatId];
        if (result.canCapture) {
            const { captureNpc } = require('../prison');
            const captureResult = captureNpc(p, result.npcId);
            await bot.sendMessage(chatId, result.message + '\n\n' + captureResult.message, { parse_mode: 'Markdown', ...mainMenu() });
        } else {
            await bot.sendMessage(chatId, result.message, { parse_mode: 'Markdown', ...mainMenu() });
        }
    } else {
        await bot.sendMessage(chatId, result.message, { parse_mode: 'Markdown', ...require('../fight').getBattleKeyboard(p, enemy) });
    }
});

bot.onText(/^💀 فنیشر$/, async (msg) => {
    const chatId = msg.chat.id;
    const p = player.getPlayer(chatId);
    if (!p || !activeBattles[chatId]) return;
    const enemy = activeBattles[chatId];
    const { useFinisher } = require('../fight');
    const result = useFinisher(p, enemy);
    delete activeBattles[chatId];
    if (result.canCapture) {
        const { captureNpc } = require('../prison');
        const captureResult = captureNpc(p, result.npcId);
        await bot.sendMessage(chatId, result.message + '\n\n' + captureResult.message, { parse_mode: 'Markdown', ...mainMenu() });
    } else {
        await bot.sendMessage(chatId, result.message, { parse_mode: 'Markdown', ...mainMenu() });
    }
});

bot.onText(/^🏃 💨 فرار کن$/, async (msg) => {
    const chatId = msg.chat.id;
    const p = player.getPlayer(chatId);
    if (!p || !activeBattles[chatId]) return;
    const enemy = activeBattles[chatId];
    const { playerEscape } = require('../fight');
    const result = playerEscape(p, enemy);
    if (result.battleOver) {
        delete activeBattles[chatId];
        await bot.sendMessage(chatId, result.message, { parse_mode: 'Markdown', ...mainMenu() });
    } else {
        await bot.sendMessage(chatId, result.message, { parse_mode: 'Markdown', ...require('../fight').getBattleKeyboard(p, enemy) });
    }
});

// ============ هندلرهای ساخت‌وساز ============
bot.onText(/^🔨 ساخت (.+)$/, async (msg, match) => {
    const chatId = msg.chat.id;
    const p = player.getPlayer(chatId);
    if (!p) return bot.sendMessage(chatId, '❌ /start بزن!', mainMenu());
    const { craftItem, getCraftKeyboard } = require('../craft');
    const result = craftItem(p, match[1]);
    await bot.sendMessage(chatId, result.message, { parse_mode: 'Markdown', ...getCraftKeyboard(p) });
});

bot.onText(/^⚡ ساخت انرژی‌دار$/, async (msg) => {
    const chatId = msg.chat.id;
    const p = player.getPlayer(chatId);
    if (!p) return bot.sendMessage(chatId, '❌ /start بزن!', mainMenu());
    const { showCraftMenu, getEnergyCraftKeyboard } = require('../craft');
    await bot.sendMessage(chatId, showCraftMenu(p), { parse_mode: 'Markdown', ...getEnergyCraftKeyboard(p) });
});

bot.onText(/^(?:✅|❌) (.+) \((\d+)⚡\)$/, async (msg, match) => {
    const chatId = msg.chat.id;
    const p = player.getPlayer(chatId);
    if (!p) return;
    const { craftItem, getEnergyCraftKeyboard } = require('../craft');
    const itemName = match[1].trim();
    const result = craftItem(p, itemName);
    await bot.sendMessage(chatId, result.message, { parse_mode: 'Markdown', ...getEnergyCraftKeyboard(p) });
});

// ============ هندلرهای زندان ============
bot.onText(/^🖐️ لمس کن$/, async (msg) => {
    const chatId = msg.chat.id;
    const p = player.getPlayer(chatId);
    if (!p) return;
    const { activePrisoner } = require('./core');
    const npcId = activePrisoner[chatId];
    if (!npcId) return;
    const { touchPrisoner, getPrisonerKeyboard } = require('../prison');
    const result = touchPrisoner(p, npcId);
    if (result.animation) {
        await require('./core').sendAnimation(chatId, result.animation, result.message, getPrisonerKeyboard(p, npcId));
    } else {
        await bot.sendMessage(chatId, result.message, { parse_mode: 'Markdown', ...getPrisonerKeyboard(p, npcId) });
    }
});

bot.onText(/^💋 ببوس$/, async (msg) => {
    const chatId = msg.chat.id;
    const p = player.getPlayer(chatId);
    if (!p) return;
    const { activePrisoner } = require('./core');
    const npcId = activePrisoner[chatId];
    if (!npcId) return;
    const { kissPrisoner, getPrisonerKeyboard } = require('../prison');
    const result = kissPrisoner(p, npcId);
    if (result.animation) {
        await require('./core').sendAnimation(chatId, result.animation, result.message, getPrisonerKeyboard(p, npcId));
    } else {
        await bot.sendMessage(chatId, result.message, { parse_mode: 'Markdown', ...getPrisonerKeyboard(p, npcId) });
    }
});

bot.onText(/^🔥 عیاشی$/, async (msg) => {
    const chatId = msg.chat.id;
    const p = player.getPlayer(chatId);
    if (!p) return;
    
    // چک می‌کنیم آیا توی زندان هست یا خونه
    const { activePrisoner, activeHouseNpc } = require('./core');
    let npcId = activePrisoner[chatId];
    let isHouse = false;
    
    if (!npcId) {
        npcId = activeHouseNpc[chatId];
        isHouse = true;
    }
    
    if (!npcId) return;
    
    if (isHouse) {
        const { orgyInHouse, getHouseKeyboard } = require('../house');
        const result = orgyInHouse(p, npcId);
        if (result.animation) {
            await require('./core').sendAnimation(chatId, result.animation, result.message, getHouseKeyboard(p, npcId));
        } else {
            await bot.sendMessage(chatId, result.message, { parse_mode: 'Markdown', ...getHouseKeyboard(p, npcId) });
        }
    } else {
        const { orgyPrisoner, getPrisonerKeyboard } = require('../prison');
        const result = orgyPrisoner(p, npcId);
        if (result.animation) {
            await require('./core').sendAnimation(chatId, result.animation, result.message, getPrisonerKeyboard(p, npcId));
        } else {
            await bot.sendMessage(chatId, result.message, { parse_mode: 'Markdown', ...getPrisonerKeyboard(p, npcId) });
        }
    }
});

bot.onText(/^🔓 آزاد کن$/, async (msg) => {
    const chatId = msg.chat.id;
    const p = player.getPlayer(chatId);
    if (!p) return;
    const { activePrisoner } = require('./core');
    const npcId = activePrisoner[chatId];
    if (!npcId) return;
    const { releasePrisoner, formatPrison } = require('../prison');
    const result = releasePrisoner(p, npcId);
    delete activePrisoner[chatId];
    
    if (result.loyal) {
        // اگه وفادار موند، میره توی خونه
        if (!p.house) p.house = [];
        const npc = require('../config').images.npcs?.[npcId] || require('../config').images.enemies?.[npcId];
        p.house.push({ npcId, name: npc?.name || npcId, emoji: npc?.emoji || '👤', joinedAt: Date.now() });
        await bot.sendMessage(chatId, result.message + '\n\n🏠 رفت توی خونه!', { parse_mode: 'Markdown', ...mainMenu() });
    } else {
        await bot.sendMessage(chatId, result.message, { parse_mode: 'Markdown', ...mainMenu() });
    }
});

// ============ انتخاب زندانی ============
bot.onText(/^🔒 (.+?) \(\d+ روز\)$/, async (msg, match) => {
    const chatId = msg.chat.id;
    const p = player.getPlayer(chatId);
    if (!p) return;
    
    const prisonerName = match[1].trim();
    const prisoner = p.prison?.find(pr => pr.name === prisonerName);
    if (!prisoner) return;
    
    const { activePrisoner } = require('./core');
    activePrisoner[chatId] = prisoner.npcId;
    
    const { formatPrison, getPrisonerKeyboard } = require('../prison');
    let infoMsg = `🔒 *${prisoner.emoji} ${prisoner.name}*\n⏰ ${prisoner.daysUntilEscape} روز تا فرار`;
    await bot.sendMessage(chatId, infoMsg, { parse_mode: 'Markdown', ...getPrisonerKeyboard(p, prisoner.npcId) });
});

// ============ هندلرهای خونه ============
bot.onText(/^🏠 (.+?) - (.+)$/, async (msg, match) => {
    const chatId = msg.chat.id;
    const p = player.getPlayer(chatId);
    if (!p) return;
    
    const npcName = match[1].trim();
    const relationInfo = match[2].trim();
    
    const houseNpc = p.house?.find(h => h.name === npcName);
    if (!houseNpc) return;
    
    const { activeHouseNpc } = require('./core');
    activeHouseNpc[chatId] = houseNpc.npcId;
    
    const { formatHouse, getHouseKeyboard } = require('../house');
    let infoMsg = `🏠 *${houseNpc.emoji} ${houseNpc.name}*`;
    if (p.marry === houseNpc.npcId) infoMsg += ' 💍';
    await bot.sendMessage(chatId, infoMsg, { parse_mode: 'Markdown', ...getHouseKeyboard(p, houseNpc.npcId) });
});

bot.onText(/^💍 خواستگاری$/, async (msg) => {
    const chatId = msg.chat.id;
    const p = player.getPlayer(chatId);
    if (!p) return;
    const { activeHouseNpc } = require('./core');
    const npcId = activeHouseNpc[chatId];
    if (!npcId) return;
    const { propose } = require('../marry');
    const result = propose(p, npcId);
    await bot.sendMessage(chatId, result.message, { parse_mode: 'Markdown', ...mainMenu() });
});

bot.onText(/^👰 عروسی$/, async (msg) => {
    const chatId = msg.chat.id;
    const p = player.getPlayer(chatId);
    if (!p) return;
    const { activeHouseNpc } = require('./core');
    const npcId = activeHouseNpc[chatId];
    if (!npcId) return;
    const { marry } = require('../marry');
    const result = marry(p, npcId);
    await bot.sendMessage(chatId, result.message, { parse_mode: 'Markdown', ...mainMenu() });
});

bot.onText(/^🚪 بیرون کن$/, async (msg) => {
    const chatId = msg.chat.id;
    const p = player.getPlayer(chatId);
    if (!p) return;
    const { activeHouseNpc } = require('./core');
    const npcId = activeHouseNpc[chatId];
    if (!npcId) return;
    const { kickFromHouse } = require('../house');
    const result = kickFromHouse(p, npcId);
    delete require('./core').activeHouseNpc[chatId];
    await bot.sendMessage(chatId, result.message, { parse_mode: 'Markdown', ...mainMenu() });
});

// ============ هندلرهای بازار ============
bot.onText(/^🛒 خرید (.+)$/, async (msg, match) => {
    const chatId = msg.chat.id;
    const p = player.getPlayer(chatId);
    if (!p) return bot.sendMessage(chatId, '❌ /start بزن!', mainMenu());
    const itemMap = {
        'چوب': 'wood', 'سنگ': 'stone', 'گوشت': 'meat', 'آب': 'water',
        'پوست': 'skin', 'آهن': 'iron', 'فنیشر': 'finisher', 'انرژی': 'energy', 'الماس': 'diamond'
    };
    const item = itemMap[match[1]] || match[1];
    const { startBuy } = require('../shop');
    const result = startBuy(p, item);
    await bot.sendMessage(chatId, result.message, { parse_mode: 'Markdown', ...mainMenu() });
});

bot.onText(/^📤 فروش (.+)$/, async (msg, match) => {
    const chatId = msg.chat.id;
    const p = player.getPlayer(chatId);
    if (!p) return bot.sendMessage(chatId, '❌ /start بزن!', mainMenu());
    const itemMap = {
        'چوب': 'wood', 'سنگ': 'stone', 'گوشت': 'meat', 'آب': 'water',
        'پوست': 'skin', 'آهن': 'iron', 'فنیشر': 'finisher', 'الماس': 'diamond'
    };
    const item = itemMap[match[1]] || match[1];
    const { startSell } = require('../shop');
    const result = startSell(p, item);
    await bot.sendMessage(chatId, result.message, { parse_mode: 'Markdown', ...mainMenu() });
});

// ============ هندلرهای امپراطوری ============
bot.onText(/^💰 جمع‌آوری درآمد$/, async (msg) => {
    const chatId = msg.chat.id;
    const p = player.getPlayer(chatId);
    if (!p) return bot.sendMessage(chatId, '❌ /start بزن!', mainMenu());
    const { collectEmpireIncome, formatEmpire, getEmpireKeyboard } = require('../empire');
    const result = collectEmpireIncome(p);
    await bot.sendMessage(chatId, result.message, { parse_mode: 'Markdown', ...getEmpireKeyboard(p) });
});

bot.onText(/^📋 انتصاب (.+)$/, async (msg, match) => {
    const chatId = msg.chat.id;
    const p = player.getPlayer(chatId);
    if (!p) return bot.sendMessage(chatId, '❌ /start بزن!', mainMenu());
    // اینجا باید لیست فرزندان برای انتصاب نشون داده بشه
    const { empireRoles, assignRole, formatEmpire, getEmpireKeyboard } = require('../empire');
    const roleEmoji = match[1].split(' ')[0];
    let roleKey = null;
    for (let key in empireRoles) {
        if (empireRoles[key].emoji === roleEmoji) { roleKey = key; break; }
    }
    if (!roleKey) return;
    
    const { empireState } = require('./core');
    empireState[chatId] = { action: 'assignRole', roleKey };
    
    if (!p.children || p.children.filter(c => c.isAlive).length === 0) {
        await bot.sendMessage(chatId, '❌ هیچ فرزندی نداری!', { parse_mode: 'Markdown', ...getEmpireKeyboard(p) });
        return;
    }
    
    let childList = '👶 *فرزندان برای انتصاب:*\n\n';
    for (let child of p.children) {
        if (!child.isAlive) continue;
        childList += `👤 ${child.emoji} ${child.name} - ${child.className} (سطح ${child.evolutionLevel})\n`;
    }
    childList += '\n📝 آیدی فرزند رو تایپ کن:';
    await bot.sendMessage(chatId, childList, { parse_mode: 'Markdown', ...mainMenu() });
});

bot.onText(/^🏗️ ساخت (.+)$/, async (msg, match) => {
    const chatId = msg.chat.id;
    const p = player.getPlayer(chatId);
    if (!p) return bot.sendMessage(chatId, '❌ /start بزن!', mainMenu());
    const { wonders, buildWonder, formatEmpire, getEmpireKeyboard } = require('../empire');
    const wonderEmoji = match[1].split(' ')[0];
    let wonderKey = null;
    for (let key in wonders) {
        if (wonders[key].emoji === wonderEmoji) { wonderKey = key; break; }
    }
    if (!wonderKey) return;
    const result = buildWonder(p, wonderKey);
    await bot.sendMessage(chatId, result.message, { parse_mode: 'Markdown', ...getEmpireKeyboard(p) });
});

bot.onText(/^📝 تغییر نام سلسله$/, async (msg) => {
    const chatId = msg.chat.id;
    const p = player.getPlayer(chatId);
    if (!p) return bot.sendMessage(chatId, '❌ /start بزن!', mainMenu());
    const { empireState } = require('./core');
    empireState[chatId] = { action: 'setDynasty' };
    await bot.sendMessage(chatId, '📝 اسم سلسله رو تایپ کن:', { parse_mode: 'Markdown', ...mainMenu() });
});

// ============ هندلرهای مردم ============
bot.onText(/^💰 جمع‌آوری مالیات$/, async (msg) => {
    const chatId = msg.chat.id;
    const p = player.getPlayer(chatId);
    if (!p) return bot.sendMessage(chatId, '❌ /start بزن!', mainMenu());
    const { collectTaxes, formatPeople, getPeopleKeyboard } = require('../people');
    const result = collectTaxes(p);
    await bot.sendMessage(chatId, result.message, { parse_mode: 'Markdown', ...getPeopleKeyboard(p) });
});

bot.onText(/^🌾 مدیریت زمین‌ها$/, async (msg) => {
    const chatId = msg.chat.id;
    const p = player.getPlayer(chatId);
    if (!p) return bot.sendMessage(chatId, '❌ /start بزن!', mainMenu());
    const { formatPeople, getLandKeyboard } = require('../people');
    await bot.sendMessage(chatId, '🌾 *زمین‌های کشاورزی*\n\nنوع زمین رو انتخاب کن:', { parse_mode: 'Markdown', ...getLandKeyboard() });
});

bot.onText(/^🌾 (.+) \((\d+)👑\)$/, async (msg, match) => {
    const chatId = msg.chat.id;
    const p = player.getPlayer(chatId);
    if (!p) return;
    const { landTypes, assignLand, formatPeople, getLandKeyboard } = require('../people');
    const info = match[1].trim();
    for (let key in landTypes) {
        if (info.includes(landTypes[key].emoji) && info.includes(landTypes[key].name)) {
            const result = assignLand(p, key, 1);
            await bot.sendMessage(chatId, result.message, { parse_mode: 'Markdown', ...getLandKeyboard() });
            return;
        }
    }
});

bot.onText(/^💧 آبیاری همه زمین‌ها$/, async (msg) => {
    const chatId = msg.chat.id;
    const p = player.getPlayer(chatId);
    if (!p) return;
    const { harvestAllLands, formatPeople, getLandKeyboard } = require('../people');
    // آبیاری تک‌تک زمین‌ها
    if (!p.people || !p.people.lands) return;
    let totalMsg = '';
    for (let land of p.people.lands) {
        const { waterLand } = require('../people');
        const result = waterLand(p, land.id);
        totalMsg += result.message + '\n';
    }
    await bot.sendMessage(chatId, totalMsg || '✅ همه زمین‌ها آبیاری شدن!', { parse_mode: 'Markdown', ...getLandKeyboard() });
});

bot.onText(/^🌾 برداشت همه زمین‌ها$/, async (msg) => {
    const chatId = msg.chat.id;
    const p = player.getPlayer(chatId);
    if (!p) return;
    const { harvestAllLands, formatPeople, getPeopleKeyboard } = require('../people');
    const result = harvestAllLands(p);
    await bot.sendMessage(chatId, result.message, { parse_mode: 'Markdown', ...getPeopleKeyboard(p) });
});

bot.onText(/^🏗️ ساخت ساختمان$/, async (msg) => {
    const chatId = msg.chat.id;
    const p = player.getPlayer(chatId);
    if (!p) return bot.sendMessage(chatId, '❌ /start بزن!', mainMenu());
    const { getBuildingKeyboard } = require('../people');
    await bot.sendMessage(chatId, '🏗️ *ساختمان‌های عمومی*\n\nساختمان مورد نظر رو انتخاب کن:', { parse_mode: 'Markdown', ...getBuildingKeyboard() });
});

bot.onText(/^🏗️ (.+) \((.+)\)$/, async (msg, match) => {
    const chatId = msg.chat.id;
    const p = player.getPlayer(chatId);
    if (!p) return;
    const { buildings, buildPublicBuilding, formatPeople, getBuildingKeyboard } = require('../people');
    const info = match[1].trim();
    for (let key in buildings) {
        if (info.includes(buildings[key].emoji) && info.includes(buildings[key].name)) {
            const result = buildPublicBuilding(p, key);
            await bot.sendMessage(chatId, result.message, { parse_mode: 'Markdown', ...getBuildingKeyboard() });
            return;
        }
    }
});

bot.onText(/^📜 تصمیم‌گیری$/, async (msg) => {
    const chatId = msg.chat.id;
    const p = player.getPlayer(chatId);
    if (!p) return bot.sendMessage(chatId, '❌ /start بزن!', mainMenu());
    const { getDecisionKeyboard } = require('../people');
    await bot.sendMessage(chatId, '📜 *تصمیم‌های مدیریتی*\n\nیه تصمیم بگیر:', { parse_mode: 'Markdown', ...getDecisionKeyboard() });
});

bot.onText(/^🎉 برگزاری جشن \((.+)\)$/, async (msg, match) => {
    const chatId = msg.chat.id;
    const p = player.getPlayer(chatId);
    if (!p) return;
    const { makeDecision, formatPeople, getPeopleKeyboard } = require('../people');
    const result = makeDecision(p, 'festival', 0);
    await bot.sendMessage(chatId, result.message, { parse_mode: 'Markdown', ...getPeopleKeyboard(p) });
});

bot.onText(/^🍞 کمک غذایی \((.+)\)$/, async (msg, match) => {
    const chatId = msg.chat.id;
    const p = player.getPlayer(chatId);
    if (!p) return;
    const { makeDecision, formatPeople, getPeopleKeyboard } = require('../people');
    const result = makeDecision(p, 'foodAid', 0);
    await bot.sendMessage(chatId, result.message, { parse_mode: 'Markdown', ...getPeopleKeyboard(p) });
});

bot.onText(/^⚔️ سربازگیری \((.+)\)$/, async (msg, match) => {
    const chatId = msg.chat.id;
    const p = player.getPlayer(chatId);
    if (!p) return;
    const { makeDecision, formatPeople, getPeopleKeyboard } = require('../people');
    const result = makeDecision(p, 'conscription', 0);
    await bot.sendMessage(chatId, result.message, { parse_mode: 'Markdown', ...getPeopleKeyboard(p) });
});

bot.onText(/^🙏 بخشش مالیات$/, async (msg) => {
    const chatId = msg.chat.id;
    const p = player.getPlayer(chatId);
    if (!p) return;
    const { makeDecision, formatPeople, getPeopleKeyboard } = require('../people');
    const result = makeDecision(p, 'taxBreak', 0);
    await bot.sendMessage(chatId, result.message, { parse_mode: 'Markdown', ...getPeopleKeyboard(p) });
});

// ============ هندلرهای دادگاه ============
bot.onText(/^🐍 انجام دسیسه$/, async (msg) => {
    const chatId = msg.chat.id;
    const p = player.getPlayer(chatId);
    if (!p) return bot.sendMessage(chatId, '❌ /start بزن!', mainMenu());
    const { getIntrigueKeyboard } = require('../court');
    await bot.sendMessage(chatId, '🐍 *دسیسه‌های درباری*\n\nدسیسه مورد نظر رو انتخاب کن:', { parse_mode: 'Markdown', ...getIntrigueKeyboard() });
});

bot.onText(/^🐍 (.+) - (.+)$/, async (msg, match) => {
    const chatId = msg.chat.id;
    const p = player.getPlayer(chatId);
    if (!p) return;
    const { intrigueTypes, performIntrigue, formatCourt, getCourtKeyboard } = require('../court');
    const intrigueName = match[1].trim();
    let intrigueKey = null;
    for (let key in intrigueTypes) {
        if (intrigueTypes[key].name === intrigueName) { intrigueKey = key; break; }
    }
    if (!intrigueKey) return;
    
    const { courtState } = require('./core');
    courtState[chatId] = { action: 'intrigue', intrigueKey };
    await bot.sendMessage(chatId, `🎯 هدف دسیسه رو با آیدی فرزندت مشخص کن:\n(آیدی فرزندانت توی وضعیت نوشته شده)`, { parse_mode: 'Markdown', ...mainMenu() });
});

bot.onText(/^🔒 مدیریت زندانیان$/, async (msg) => {
    const chatId = msg.chat.id;
    const p = player.getPlayer(chatId);
    if (!p) return;
    const { managePrisoners } = require('../court');
    const result = managePrisoners(p, 'list');
    await bot.sendMessage(chatId, result.message, { parse_mode: 'Markdown', ...mainMenu() });
});

bot.onText(/^📊 وضعیت دربار$/, async (msg) => {
    const chatId = msg.chat.id;
    const p = player.getPlayer(chatId);
    if (!p) return bot.sendMessage(chatId, '❌ /start بزن!', mainMenu());
    const { formatCourt, getCourtKeyboard } = require('../court');
    await bot.sendMessage(chatId, formatCourt(p), { parse_mode: 'Markdown', ...getCourtKeyboard(p) });
});

// ============ هندلرهای حرمسرا ============
bot.onText(/^👸 (.+?) - (.+)$/, async (msg, match) => {
    const chatId = msg.chat.id;
    const p = player.getPlayer(chatId);
    if (!p) return;
    
    const queenName = match[1].trim();
    if (!p.harem || !p.harem.queens) return;
    const queen = p.harem.queens.find(q => q.name === queenName);
    if (!queen) return;
    
    const { haremState } = require('./core');
    haremState[chatId] = { queenId: queen.id };
    
    const { getQueenKeyboard } = require('../queenHarem');
    let infoMsg = `${queen.emoji} *${queen.name}*\n👑 ${queen.rank}\n😊 روحیه: ${queen.mood}% | ❤️ سلامت: ${queen.health}%`;
    await bot.sendMessage(chatId, infoMsg, { parse_mode: 'Markdown', ...getQueenKeyboard(p, queen.id) });
});

bot.onText(/^🤰 بارداری جدید$/, async (msg) => {
    const chatId = msg.chat.id;
    const p = player.getPlayer(chatId);
    if (!p) return;
    const { haremState } = require('./core');
    haremState[chatId] = { action: 'newPregnancy' };
    
    if (!p.harem || !p.harem.queens || p.harem.queens.length === 0) {
        await bot.sendMessage(chatId, '❌ هیچ ملکه‌ای توی حرمسرا نیست!', { parse_mode: 'Markdown', ...mainMenu() });
        return;
    }
    
    let queenList = '👸 *ملکه‌ها برای بارداری:*\n\n';
    for (let queen of p.harem.queens) {
        const alreadyPregnant = queen.pregnancies.find(p => !p.born && Date.now() < p.dueDate);
        queenList += `${alreadyPregnant ? '🤰' : '✅'} ${queen.emoji} ${queen.name}\n`;
    }
    queenList += '\n📝 اسم ملکه رو تایپ کن:';
    await bot.sendMessage(chatId, queenList, { parse_mode: 'Markdown', ...mainMenu() });
});

bot.onText(/^💰 پرداخت حقوق$/, async (msg) => {
    const chatId = msg.chat.id;
    const p = player.getPlayer(chatId);
    if (!p) return;
    const { paySalaries, formatHarem, getHaremKeyboard } = require('../queenHarem');
    const result = paySalaries(p);
    await bot.sendMessage(chatId, result.message, { parse_mode: 'Markdown', ...getHaremKeyboard(p) });
});

bot.onText(/^💆 رسیدگی به همه$/, async (msg) => {
    const chatId = msg.chat.id;
    const p = player.getPlayer(chatId);
    if (!p) return;
    const { careAllQueens, formatHarem, getHaremKeyboard } = require('../queenHarem');
    const result = careAllQueens(p);
    await bot.sendMessage(chatId, result.message, { parse_mode: 'Markdown', ...getHaremKeyboard(p) });
});

bot.onText(/^🎉 برگزاری جشن$/, async (msg) => {
    const chatId = msg.chat.id;
    const p = player.getPlayer(chatId);
    if (!p) return;
    const { getCelebrationKeyboard } = require('../queenHarem');
    await bot.sendMessage(chatId, '🎉 *جشن‌های حرمسرا*\n\nجشن مورد نظر رو انتخاب کن:', { parse_mode: 'Markdown', ...getCelebrationKeyboard() });
});

bot.onText(/^👗 خرید لباس و جواهر$/, async (msg) => {
    const chatId = msg.chat.id;
    const p = player.getPlayer(chatId);
    if (!p) return;
    const { haremState } = require('./core');
    const state = haremState[chatId];
    if (!state || !state.queenId) {
        await bot.sendMessage(chatId, '❌ اول یه ملکه رو انتخاب کن!', { parse_mode: 'Markdown', ...mainMenu() });
        return;
    }
    const { getDressKeyboard } = require('../queenHarem');
    await bot.sendMessage(chatId, '👗 *خرید لباس*\n\nلباس مورد نظر رو انتخاب کن:', { parse_mode: 'Markdown', ...getDressKeyboard() });
});

bot.onText(/^🏠 ارتقای اتاق$/, async (msg) => {
    const chatId = msg.chat.id;
    const p = player.getPlayer(chatId);
    if (!p) return;
    const { haremState } = require('./core');
    const state = haremState[chatId];
    if (!state || !state.queenId) {
        await bot.sendMessage(chatId, '❌ اول یه ملکه رو انتخاب کن!', { parse_mode: 'Markdown', ...mainMenu() });
        return;
    }
    const { getRoomKeyboard } = require('../queenHarem');
    await bot.sendMessage(chatId, '🏠 *ارتقای اتاق*\n\nاتاق مورد نظر رو انتخاب کن:', { parse_mode: 'Markdown', ...getRoomKeyboard() });
});

bot.onText(/^🧹 استخدام خدمتکار$/, async (msg) => {
    const chatId = msg.chat.id;
    const p = player.getPlayer(chatId);
    if (!p) return;
    const { haremState } = require('./core');
    const state = haremState[chatId];
    if (!state || !state.queenId) {
        await bot.sendMessage(chatId, '❌ اول یه ملکه رو انتخاب کن!', { parse_mode: 'Markdown', ...mainMenu() });
        return;
    }
    const { getServantKeyboard } = require('../queenHarem');
    await bot.sendMessage(chatId, '🧹 *استخدام خدمتکار*\n\nخدمتکار مورد نظر رو انتخاب کن:', { parse_mode: 'Markdown', ...getServantKeyboard() });
});

bot.onText(/^🐍 دسیسه‌های درباری$/, async (msg) => {
    const chatId = msg.chat.id;
    const p = player.getPlayer(chatId);
    if (!p) return;
    const { getIntrigueKeyboard } = require('../queenHarem');
    await bot.sendMessage(chatId, '🐍 *دسیسه‌های حرمسرا*\n\nدسیسه مورد نظر رو انتخاب کن:', { parse_mode: 'Markdown', ...getIntrigueKeyboard() });
});

bot.onText(/^📔 دفتر خاطرات$/, async (msg) => {
    const chatId = msg.chat.id;
    const p = player.getPlayer(chatId);
    if (!p) return;
    const { getRandomDiaryEntry } = require('../queenHarem');
    const entry = getRandomDiaryEntry(p);
    if (entry) {
        await bot.sendMessage(chatId, `📔 *دفتر خاطرات ${entry.queen.emoji} ${entry.queen.name}*\n\n"${entry.entry}"`, { parse_mode: 'Markdown', ...mainMenu() });
    } else {
        await bot.sendMessage(chatId, '📔 دفتر خاطرات خالیه...', { parse_mode: 'Markdown', ...mainMenu() });
    }
});

bot.onText(/^🤰 باردار شو$/, async (msg) => {
    const chatId = msg.chat.id;
    const p = player.getPlayer(chatId);
    if (!p) return;
    const { haremState } = require('./core');
    const state = haremState[chatId];
    if (!state || !state.queenId) return;
    const { getPregnancySpeedKeyboard } = require('../queenHarem');
    haremState[chatId].action = 'startPregnancy';
    await bot.sendMessage(chatId, '⏰ *سرعت بارداری*\n\nنوع بارداری رو انتخاب کن:', { parse_mode: 'Markdown', ...getPregnancySpeedKeyboard() });
});

bot.onText(/^⚡ تسریع بارداری$/, async (msg) => {
    const chatId = msg.chat.id;
    const p = player.getPlayer(chatId);
    if (!p) return;
    const { haremState } = require('./core');
    const state = haremState[chatId];
    if (!state || !state.queenId) return;
    
    const queen = p.harem.queens.find(q => q.id === state.queenId);
    if (!queen) return;
    const pregnancy = queen.pregnancies.find(p => !p.born && Date.now() < p.dueDate);
    if (!pregnancy) {
        await bot.sendMessage(chatId, '❌ این ملکه باردار نیست!', { parse_mode: 'Markdown', ...mainMenu() });
        return;
    }
    
    const { getPregnancySpeedKeyboard } = require('../queenHarem');
    haremState[chatId].action = 'speedPregnancy';
    haremState[chatId].pregnancyId = pregnancy.id;
    await bot.sendMessage(chatId, '⏰ *تسریع بارداری*\n\nسرعت جدید رو انتخاب کن:', { parse_mode: 'Markdown', ...getPregnancySpeedKeyboard() });
});

bot.onText(/^💆 رسیدگی \(.+\)$/, async (msg) => {
    const chatId = msg.chat.id;
    const p = player.getPlayer(chatId);
    if (!p) return;
    const { haremState } = require('./core');
    const state = haremState[chatId];
    if (!state || !state.queenId) return;
    const { queenCare, getQueenKeyboard } = require('../queenHarem');
    const result = queenCare(p, state.queenId);
    await bot.sendMessage(chatId, result.message, { parse_mode: 'Markdown', ...getQueenKeyboard(p, state.queenId) });
});

bot.onText(/^👗 خرید لباس$/, async (msg) => {
    const chatId = msg.chat.id;
    const p = player.getPlayer(chatId);
    if (!p) return;
    const { haremState } = require('./core');
    const state = haremState[chatId];
    if (!state || !state.queenId) return;
    const { getDressKeyboard } = require('../queenHarem');
    haremState[chatId].action = 'buyDress';
    await bot.sendMessage(chatId, '👗 *خرید لباس*\n\nلباس مورد نظر رو انتخاب کن:', { parse_mode: 'Markdown', ...getDressKeyboard() });
});

bot.onText(/^💍 خرید جواهر$/, async (msg) => {
    const chatId = msg.chat.id;
    const p = player.getPlayer(chatId);
    if (!p) return;
    const { haremState } = require('./core');
    const state = haremState[chatId];
    if (!state || !state.queenId) return;
    const { getJewelryKeyboard } = require('../queenHarem');
    haremState[chatId].action = 'buyJewelry';
    await bot.sendMessage(chatId, '💍 *خرید جواهر*\n\nجواهر مورد نظر رو انتخاب کن:', { parse_mode: 'Markdown', ...getJewelryKeyboard() });
});

bot.onText(/^📚 سبک تربیت بچه$/, async (msg) => {
    const chatId = msg.chat.id;
    const p = player.getPlayer(chatId);
    if (!p) return;
    const { haremState } = require('./core');
    const state = haremState[chatId];
    if (!state || !state.queenId) return;
    const { getUpbringingKeyboard } = require('../queenHarem');
    haremState[chatId].action = 'setUpbringing';
    await bot.sendMessage(chatId, '📚 *سبک تربیت*\n\nسبک مورد نظر رو انتخاب کن:', { parse_mode: 'Markdown', ...getUpbringingKeyboard() });
});

bot.onText(/^🚪 اخراج از حرمسرا$/, async (msg) => {
    const chatId = msg.chat.id;
    const p = player.getPlayer(chatId);
    if (!p) return;
    const { haremState } = require('./core');
    const state = haremState[chatId];
    if (!state || !state.queenId) return;
    const { removeQueenFromHarem, formatHarem, getHaremKeyboard } = require('../queenHarem');
    const result = removeQueenFromHarem(p, state.queenId);
    delete haremState[chatId];
    await bot.sendMessage(chatId, result.message, { parse_mode: 'Markdown', ...getHaremKeyboard(p) });
});

// ============ هندلرهای حیوانات ============
bot.onText(/^🐾 (.+)$/, async (msg, match) => {
    const chatId = msg.chat.id;
    const p = player.getPlayer(chatId);
    if (!p) return;
    const { formatPets, getPetKeyboard } = require('../pet');
    await bot.sendMessage(chatId, formatPets(p), { parse_mode: 'Markdown', ...getPetKeyboard(p) });
});

bot.onText(/^🍖 غذا بده به (.+)$/, async (msg, match) => {
    const chatId = msg.chat.id;
    const p = player.getPlayer(chatId);
    if (!p) return;
    const petInfo = match[1].trim();
    if (petInfo === 'همه') {
        const { feedAllPets, formatPets, getPetKeyboard } = require('../pet');
        const result = feedAllPets(p);
        await bot.sendMessage(chatId, result.message, { parse_mode: 'Markdown', ...getPetKeyboard(p) });
        return;
    }
    
    const pet = p.pets?.find(pt => petInfo.includes(pt.emoji) && petInfo.includes(pt.name));
    if (!pet) return;
    const { feedPet, formatPets, getPetKeyboard } = require('../pet');
    const result = feedPet(p, pet.id);
    if (result.image) {
        await require('./core').sendPhoto(chatId, result.image, result.message, getPetKeyboard(p));
    } else {
        await bot.sendMessage(chatId, result.message, { parse_mode: 'Markdown', ...getPetKeyboard(p) });
    }
});

bot.onText(/^💔 آزاد کن (.+)$/, async (msg, match) => {
    const chatId = msg.chat.id;
    const p = player.getPlayer(chatId);
    if (!p) return;
    const petInfo = match[1].trim();
    const pet = p.pets?.find(pt => petInfo.includes(pt.emoji) && petInfo.includes(pt.name));
    if (!pet) return;
    const { releasePet, formatPets, getPetKeyboard } = require('../pet');
    const result = releasePet(p, pet.id);
    await bot.sendMessage(chatId, result.message, { parse_mode: 'Markdown', ...getPetKeyboard(p) });
});

// ============ هندلرهای صندوقچه ============
bot.onText(/^📦 باز کردن صندوق (.+)$/, async (msg, match) => {
    const chatId = msg.chat.id;
    const p = player.getPlayer(chatId);
    if (!p) return;
    const boxMap = { 'چوبی': 'wooden', 'نقره‌ای': 'silver', 'طلایی': 'golden', 'افسانه‌ای': 'legendary' };
    const boxType = boxMap[match[1]] || match[1];
    const { openLootBox, formatLootBoxes, getLootBoxKeyboard } = require('../lootbox');
    const result = openLootBox(p, boxType);
    if (result.image) {
        await require('./core').sendPhoto(chatId, result.image, result.message, getLootBoxKeyboard(p));
    } else {
        await bot.sendMessage(chatId, result.message, { parse_mode: 'Markdown', ...getLootBoxKeyboard(p) });
    }
});

// ============ هندلرهای بازار سیاه ============
bot.onText(/^🕶️ بازار مکاره$/, async (msg) => {
    const chatId = msg.chat.id;
    const p = player.getPlayer(chatId);
    if (!p) return bot.sendMessage(chatId, '❌ /start بزن!', mainMenu());
    const { formatBlackMarket, getBlackMarketKeyboard } = require('../blackMarket');
    await bot.sendMessage(chatId, formatBlackMarket(p), { parse_mode: 'Markdown', ...getBlackMarketKeyboard(p) });
});

bot.onText(/^🛒 خرید (\d+)$/, async (msg, match) => {
    const chatId = msg.chat.id;
    const p = player.getPlayer(chatId);
    if (!p) return;
    const itemId = parseInt(match[1]);
    const { buyBlackMarketItem, formatBlackMarket, getBlackMarketKeyboard } = require('../blackMarket');
    const result = buyBlackMarketItem(p, itemId);
    await bot.sendMessage(chatId, result.message, { parse_mode: 'Markdown', ...getBlackMarketKeyboard(p) });
});

bot.onText(/^🤝 معامله ویژه$/, async (msg) => {
    const chatId = msg.chat.id;
    const p = player.getPlayer(chatId);
    if (!p) return;
    const { acceptSpecialDeal, formatBlackMarket, getBlackMarketKeyboard } = require('../blackMarket');
    const result = acceptSpecialDeal(p);
    await bot.sendMessage(chatId, result.message, { parse_mode: 'Markdown', ...getBlackMarketKeyboard(p) });
});

// ============ هندلرهای ماموریت روزانه ============
bot.onText(/^🎁 دریافت جایزه (.+)$/, async (msg, match) => {
    const chatId = msg.chat.id;
    const p = player.getPlayer(chatId);
    if (!p) return;
    const { questTypes, claimQuestReward, formatDailyQuests, getDailyQuestKeyboard } = require('../dailyQuest');
    const info = match[1].trim();
    for (let key in questTypes) {
        if (info.includes(questTypes[key].emoji) && info.includes(questTypes[key].name)) {
            const result = claimQuestReward(p, key);
            if (result.image) {
                await require('./core').sendPhoto(chatId, result.image, result.message, getDailyQuestKeyboard(p));
            } else {
                await bot.sendMessage(chatId, result.message, { parse_mode: 'Markdown', ...getDailyQuestKeyboard(p) });
            }
            return;
        }
    }
});

// ============ هندلرهای فرزندان ============
bot.onText(/^👶 (.+)$/, async (msg, match) => {
    const chatId = msg.chat.id;
    const p = player.getPlayer(chatId);
    if (!p) return;
    const { formatChildren, getChildrenKeyboard } = require('../offspring');
    await bot.sendMessage(chatId, formatChildren(p), { parse_mode: 'Markdown', ...getChildrenKeyboard(p) });
});

bot.onText(/^🍼 غذا بده به (.+)$/, async (msg, match) => {
    const chatId = msg.chat.id;
    const p = player.getPlayer(chatId);
    if (!p) return;
    const childInfo = match[1].trim();
    const child = p.children?.find(c => c.isAlive && childInfo.includes(c.emoji) && childInfo.includes(c.name));
    if (!child) return;
    const { feedChild, getChildrenKeyboard } = require('../offspring');
    const result = feedChild(p, child.id);
    await bot.sendMessage(chatId, result.message, { parse_mode: 'Markdown', ...getChildrenKeyboard(p) });
});

bot.onText(/^📚 آموزش بده به (.+)$/, async (msg, match) => {
    const chatId = msg.chat.id;
    const p = player.getPlayer(chatId);
    if (!p) return;
    const childInfo = match[1].trim();
    const child = p.children?.find(c => c.isAlive && childInfo.includes(c.emoji) && childInfo.includes(c.name));
    if (!child) return;
    const { trainChild, getChildrenKeyboard } = require('../offspring');
    const result = trainChild(p, child.id);
    await bot.sendMessage(chatId, result.message, { parse_mode: 'Markdown', ...getChildrenKeyboard(p) });
});

bot.onText(/^⚔️ تورنمنت امپراطوری$/, async (msg) => {
    const chatId = msg.chat.id;
    const p = player.getPlayer(chatId);
    if (!p) return;
    const { holdTournament, formatChildren, getChildrenKeyboard } = require('../offspring');
    const result = holdTournament(p);
    await bot.sendMessage(chatId, result.message, { parse_mode: 'Markdown', ...getChildrenKeyboard(p) });
});

bot.onText(/^👑 ولیعهد کن (.+)$/, async (msg, match) => {
    const chatId = msg.chat.id;
    const p = player.getPlayer(chatId);
    if (!p) return;
    const childInfo = match[1].trim();
    const child = p.children?.find(c => c.isAlive && childInfo.includes(c.emoji) && childInfo.includes(c.name));
    if (!child) return;
    const { assignHeir, formatChildren, getChildrenKeyboard } = require('../offspring');
    const result = assignHeir(p, child.id);
    await bot.sendMessage(chatId, result.message, { parse_mode: 'Markdown', ...getChildrenKeyboard(p) });
});

// ============ پیام‌های معمولی (ادمین و shop) ============
bot.on('message', (msg) => {
    const chatId = msg.chat.id;
    const text = msg.text;
    if (!text || text.startsWith('/')) return;

    if (isAdmin(chatId)) {
        const p = player.getPlayer(chatId);
        if (!p) return; p.chatId = chatId;

        if (adminState[chatId] && adminState[chatId].step === 'amount') {
            const amount = parseInt(text);
            if (isNaN(amount) || amount <= 0) { bot.sendMessage(chatId, '❌ یه عدد معتبر وارد کن!', mainMenu()); return; }
            const state = adminState[chatId];
            const target = player.getPlayer(state.targetId);
            if (!target) { delete adminState[chatId]; bot.sendMessage(chatId, '❌ کاربر دیگه آنلاین نیست!', mainMenu()); return; }
            target.inventory[state.item] = (target.inventory[state.item] || 0) + amount;
            bot.sendMessage(chatId, `🎁 *هدیه فرستاده شد!*\n👤 ${target.name}\n🎒 ${state.item}: +${amount}`, { parse_mode: 'Markdown', ...mainMenu() });
            delete adminState[chatId]; return;
        }

        // هندلر empireState برای نام سلسله
        const { empireState } = require('./core');
        if (empireState[chatId] && empireState[chatId].action === 'setDynasty') {
            const { setDynastyName, formatEmpire, getEmpireKeyboard } = require('../empire');
            const result = setDynastyName(p, text);
            delete empireState[chatId];
            bot.sendMessage(chatId, result.message, { parse_mode: 'Markdown', ...getEmpireKeyboard(p) }); return;
        }
        
        // هندلر empireState برای انتصاب
        if (empireState[chatId] && empireState[chatId].action === 'assignRole') {
            const { assignRole, formatEmpire, getEmpireKeyboard } = require('../empire');
            const childId = text.trim();
            const result = assignRole(p, empireState[chatId].roleKey, childId);
            delete empireState[chatId];
            bot.sendMessage(chatId, result.message, { parse_mode: 'Markdown', ...getEmpireKeyboard(p) }); return;
        }

        // هندلر courtState برای دسیسه
        const { courtState } = require('./core');
        if (courtState[chatId] && courtState[chatId].action === 'intrigue') {
            const { performIntrigue, formatCourt, getCourtKeyboard } = require('../court');
            const parts = text.split(' ');
            const targetId = parts[0];
            const performerId = parts[1] || targetId;
            const result = performIntrigue(p, courtState[chatId].intrigueKey, targetId, performerId);
            delete courtState[chatId];
            bot.sendMessage(chatId, result.message, { parse_mode: 'Markdown', ...getCourtKeyboard(p) }); return;
        }

        // هندلر haremState برای بارداری جدید
        const { haremState } = require('./core');
        if (haremState[chatId] && haremState[chatId].action === 'newPregnancy') {
            const queenName = text.trim();
            const queen = p.harem?.queens.find(q => q.name === queenName);
            if (!queen) {
                bot.sendMessage(chatId, '❌ ملکه پیدا نشد!', { parse_mode: 'Markdown', ...mainMenu() });
                delete haremState[chatId];
                return;
            }
            haremState[chatId].queenId = queen.id;
            const { getPregnancySpeedKeyboard } = require('../queenHarem');
            haremState[chatId].action = 'startPregnancy';
            bot.sendMessage(chatId, '⏰ *سرعت بارداری*\n\nنوع بارداری رو انتخاب کن:', { parse_mode: 'Markdown', ...getPregnancySpeedKeyboard() }); return;
        }

        const args = text.split(' '); const cmd = args.shift().toLowerCase();
        const adminCommands = ['gold','g','xp','exp','score','sc','heal','hp','item','give','attack','atk','defense','def','level','lvl','energy','en','day','setday','nextday','nd','resetday','rd','condom','cd','unlock','max','maxall','god','pet','addpet','removepet','petfood','box','addbox','openbox','boxes','quest','newquest','completequest','child','addchild','heir','setheir','killchild','tournament','pregnant','birth','addqueen','removequeen','queencare','queensalary','promotequeen','empirelevel','dynasty','income','wonder','population','food','water','building','stats','blackmarket','prison','gift','sendgift','info','whois','users','count','top','resetuser','ru','ban','unban','announce','ann','save','reset','help','addnpc','addprison','addhouse','addhome','removenpc','removeprison','removehouse','removehome','setrelation','setrel','marrynow','forcemarry'];

        if (adminCommands.includes(cmd)) {
            const result = adminCommand(p, cmd, args);
            if (result.announceAll && result.announce) {
                const announceMsg = `📢 *اعلان ادمین:*\n\n${result.announce}`;
                for (let id in player.players) { try { bot.sendMessage(id, announceMsg, { parse_mode: 'Markdown' }); } catch (e) {} }
                bot.sendMessage(chatId, `✅ پیام به همه ارسال شد!`, { parse_mode: 'Markdown', ...mainMenu() });
                return;
            }
            bot.sendMessage(chatId, result.message, { parse_mode: 'Markdown', ...mainMenu() }); return;
        }
        return;
    }

    const prefixes = ['🪵','🪨','🍖','💧','🦴','⛏️','📤','🏪','💎','💀','👤','🌿','🗺️','⚔️','🔨','📜','⚡','✅','❌','📊','🏰','🏠','🔒','🖐️','💋','🔥','🔓','🏃','💍','👰','🚪','🎵','🧿','🩸','🔮','🐾','🍼','📦','🎁','👶','👑','💰','🕶️','🛒','🤝','📚','🌾','🏗️','🐍','📋','🏛️','👸','👩','👦','🎲','🍷','🗡️','💊','🛏️','🧹','⏰','💍','👗','🤰','💆','🍑','👄','🎈'];
    
    for (let prefix of prefixes) { if (text.startsWith(prefix)) return; }

    const p = player.getPlayer(chatId);
    if (!p) return; p.chatId = chatId;
    const state = getShopState(p);
    if (!state) return;
    const result = processAmount(p, text);
    if (result.message) bot.sendMessage(chatId, result.message, { parse_mode: 'Markdown', ...mainMenu() });
});

bot.on('polling_error', (e) => console.log('Polling error:', e.message));
console.log('✅ ربات بقای باستانی - نسخه ماژولار آماده شد! 🎉👑🔥');