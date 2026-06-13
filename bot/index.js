const { bot } = require('./core');

// =============================================
// 🚀 راه‌اندازی همه هندلرها
// =============================================
try { require('./menuHandlers').setupMenuHandlers(); } catch(e) { console.log('menuHandlers:', e.message); }
try { require('./chamberHandlers').setupChamberHandlers(); } catch(e) { console.log('chamberHandlers:', e.message); }
try { require('./empireHandlers').setupEmpireHandlers(); } catch(e) { console.log('empireHandlers:', e.message); }
try { require('./shopHandlers').setupShopHandlers(); } catch(e) { console.log('shopHandlers:', e.message); }
try { require('./fightHandlers').setupFightHandlers(); } catch(e) { console.log('fightHandlers:', e.message); }
try { require('./craftHandlers').setupCraftHandlers(); } catch(e) { console.log('craftHandlers:', e.message); }
try { require('./prisonHandlers').setupPrisonHandlers(); } catch(e) { console.log('prisonHandlers:', e.message); }
try { require('./houseHandlers').setupHouseHandlers(); } catch(e) { console.log('houseHandlers:', e.message); }
try { require('./petHandlers').setupPetHandlers(); } catch(e) { console.log('petHandlers:', e.message); }
try { require('./lootboxHandlers').setupLootboxHandlers(); } catch(e) { console.log('lootboxHandlers:', e.message); }
try { require('./dailyQuestHandlers').setupDailyQuestHandlers(); } catch(e) { console.log('dailyQuestHandlers:', e.message); }
try { require('./offspringHandlers').setupOffspringHandlers(); } catch(e) { console.log('offspringHandlers:', e.message); }
try { require('./courtHandlers').setupCourtHandlers(); } catch(e) { console.log('courtHandlers:', e.message); }
try { require('./adminHandlers').setupAdminHandlers(); } catch(e) { console.log('adminHandlers:', e.message); }
try { require('./dayHandler').setupDayHandler(); } catch(e) { console.log('dayHandler:', e.message); }

console.log('✅ تمام ۱۵ هندلر راه‌اندازی شدن!');

const { isAdmin, adminCommand, adminState, mainMenu, activeBattles } = require('./core');
const { player } = require('./core');
const config = require('../config');

// =============================================
// 📅 دستور day/روز
// =============================================
bot.onText(/^day\s*(\d+)$|^روز\s*(\d+)$/, async (msg, match) => {
    const chatId = msg.chat.id;
    const dayNum = parseInt(match[1] || match[2]);

    if (isNaN(dayNum) || dayNum < 1 || dayNum > 7) {
        return bot.sendMessage(chatId, '❌ روز باید بین ۱ تا ۷ باشه!');
    }

    let p = player.getPlayer(chatId);
    if (!p) { player.createPlayer(chatId, msg.chat.first_name || 'گمنام'); p = player.getPlayer(chatId); }

    p.gameDay = dayNum;
    if (p.dailyQuests) { p.dailyQuests.quests = []; p.dailyQuests.completed = []; p.dailyQuests.progress = {}; p.dailyQuests.lastReset = Date.now(); }

    try {
        const { checkAllBirths } = require('../player');
        const { sendPhoto } = require('./core');
        const { getBirthImage } = require('../offspring');
        const births = checkAllBirths(p);
        if (births && births.length > 0) {
            for (let birth of births) {
                const child = birth.child || birth;
                const momInfo = birth.queen ? ` از ${birth.queen.emoji} ${birth.queen.name}` : '';
                const birthImg = getBirthImage();
                if (birthImg) await sendPhoto(chatId, birthImg, `👶 *${child.name}*${momInfo} به دنیا اومد!`, mainMenu());
                else await bot.sendMessage(chatId, `👶 *${child.name}*${momInfo} به دنیا اومد!`, { parse_mode: 'Markdown' });
            }
        }
    } catch(e) {}

    const { getTimeOfDay } = require('../player');
    const time = getTimeOfDay(); p.timeOfDay = time;
    const loc = config.images.locations[p.location] || config.images.locations.village;
    await bot.sendMessage(chatId, `🏛️ *بقای باستانی - روز ${dayNum}/۷*\n\n✨ ${p.name} | 📍 ${loc.emoji} ${loc.name}\n${time.name} | 🏆 ${p.score || 0} امتیاز`, { parse_mode: 'Markdown', ...mainMenu() });
});

// =============================================
// 🔙 دکمه برگشت (کیبورد معمولی)
// =============================================
bot.onText(/^🔙 برگشت$/, async (msg) => {
    const chatId = msg.chat.id;
    const p = player.getPlayer(chatId);
    if (!p) return bot.sendMessage(chatId, '❌ /start بزن!', mainMenu());

    const { chamberState, empireState, peopleState, courtState, haremState, activePrisoner, activeHouseNpc } = require('./core');
    [adminState, chamberState, empireState, peopleState, courtState, haremState, activePrisoner, activeHouseNpc].forEach(s => { if (s && s[chatId]) delete s[chatId]; });
    if (activeBattles[chatId]) delete activeBattles[chatId];

    const { getTimeOfDay } = require('../player');
    const time = getTimeOfDay(); p.timeOfDay = time;
    const loc = config.images.locations[p.location] || config.images.locations.village;
    await bot.sendMessage(chatId, `🏛️ *بقای باستانی*\n\n✨ ${p.name} | 📍 ${loc.emoji} ${loc.name}\n${time.name} | 📅 روز ${p.gameDay || 1}/۷ | 🏆 ${p.score || 0} امتیاز`, { parse_mode: 'Markdown', ...mainMenu() });
});

// =============================================
// 🔙 برگشت شیشه‌ای
// =============================================
bot.on('callback_query', async (query) => {
    const chatId = query.message.chat.id;
    const msgId = query.message.message_id;
    const data = query.data;
    const p = player.getPlayer(chatId);

    if (!p) return bot.answerCallbackQuery(query.id, { text: '❌ /start بزن!', show_alert: true });

    if (data === 'back_to_main') {
        const { chamberState, empireState, peopleState, courtState, haremState, activePrisoner, activeHouseNpc } = require('./core');
        [adminState, chamberState, empireState, peopleState, courtState, haremState, activePrisoner, activeHouseNpc].forEach(s => { if (s && s[chatId]) delete s[chatId]; });
        if (activeBattles[chatId]) delete activeBattles[chatId];

        const { getTimeOfDay } = require('../player');
        const time = getTimeOfDay(); p.timeOfDay = time;
        const loc = config.images.locations[p.location] || config.images.locations.village;
        await bot.deleteMessage(chatId, msgId).catch(() => {});
        await bot.sendMessage(chatId, `🏛️ *بقای باستانی*\n\n✨ ${p.name} | 📍 ${loc.emoji} ${loc.name}\n${time.name} | 📅 روز ${p.gameDay || 1}/۷ | 🏆 ${p.score || 0} امتیاز`, { parse_mode: 'Markdown', ...mainMenu() });
        return bot.answerCallbackQuery(query.id);
    }
});

// =============================================
// 👤 پیام‌های معمولی
// =============================================
bot.on('message', async (msg) => {
    const chatId = msg.chat.id;
    const text = msg.text;
    if (!text || text.startsWith('/')) return;

    if (isAdmin(chatId)) {
        let p = player.getPlayer(chatId);
        if (!p) { player.createPlayer(chatId, 'Admin 👑'); p = player.getPlayer(chatId); }
        if (!p) return;
        p.chatId = chatId;
        player.initAllSystems(p);

        if (adminState[chatId] && adminState[chatId].step === 'amount') {
            const amount = parseInt(text);
            if (isNaN(amount) || amount <= 0) { bot.sendMessage(chatId, '❌ یه عدد وارد کن!', mainMenu()); return; }
            const state = adminState[chatId];
            const target = player.getPlayer(state.targetId);
            if (!target) { delete adminState[chatId]; bot.sendMessage(chatId, '❌ کاربر آنلاین نیست!', mainMenu()); return; }
            target.inventory[state.item] = (target.inventory[state.item] || 0) + amount;
            bot.sendMessage(chatId, `🎁 هدیه به ${target.name}: +${amount} ${state.item}`, { parse_mode: 'Markdown', ...mainMenu() });
            delete adminState[chatId]; return;
        }

        const { empireState, courtState, haremState } = require('./core');
        if (empireState[chatId]?.action === 'setDynasty') { const r = require('../empire').setDynastyName(p, text); delete empireState[chatId]; bot.sendMessage(chatId, r.message, { parse_mode: 'Markdown' }); return; }
        if (courtState[chatId]?.action === 'intrigue') { const parts = text.split(' '); const r = require('../court').performIntrigue(p, courtState[chatId].intrigueKey, parts[0], parts[1]||parts[0]); delete courtState[chatId]; bot.sendMessage(chatId, r.message, { parse_mode: 'Markdown' }); return; }
        if (haremState[chatId]?.action === 'newPregnancy') { const q = p.harem?.queens.find(q => q.name === text.trim()); if (!q) { bot.sendMessage(chatId, '❌ ملکه پیدا نشد!', mainMenu()); delete haremState[chatId]; return; } haremState[chatId].queenId = q.id; haremState[chatId].action = 'startPregnancy'; bot.sendMessage(chatId, '⏰ سرعت بارداری:', { parse_mode: 'Markdown', ...require('../queenHarem').getPregnancySpeedKeyboard() }); return; }

        const args = text.split(' '); const cmd = args.shift().toLowerCase();
        const adminCommands = ['gold','g','xp','exp','score','sc','heal','hp','item','give','attack','atk','defense','def','level','lvl','energy','en','day','setday','nextday','nd','resetday','rd','condom','cd','unlock','max','maxall','god','pet','addpet','removepet','petfood','box','addbox','openbox','boxes','quest','newquest','completequest','child','addchild','heir','setheir','killchild','tournament','pregnant','birth','addqueen','removequeen','queencare','queensalary','promotequeen','empirelevel','dynasty','income','wonder','population','food','water','building','stats','blackmarket','prison','gift','sendgift','info','whois','users','count','top','resetuser','ru','ban','unban','announce','ann','save','reset','help','addnpc','addprison','addhouse','addhome','removenpc','removeprison','removehouse','removehome','setrelation','setrel','marrynow','forcemarry'];

        if (adminCommands.includes(cmd)) {
            const result = adminCommand(p, cmd, args);
            if (result.announceAll) { for (let id in player.players) { try { bot.sendMessage(id, `📢 ${result.announce}`, { parse_mode: 'Markdown' }); } catch(e) {} } bot.sendMessage(chatId, '✅ ارسال شد!', mainMenu()); return; }
            bot.sendMessage(chatId, result.message, { parse_mode: 'Markdown', ...mainMenu() }); return;
        }
        return;
    }

    const p = player.getPlayer(chatId);
    if (!p) return;
    p.chatId = chatId;

    const shopState = require('../shop').getShopState(p);
    if (shopState) { const r = require('../shop').processAmount(p, text); if (r.message) bot.sendMessage(chatId, r.message, { parse_mode: 'Markdown', ...require('../shop').getShopKeyboard() }); return; }

    // 📅 از لیست prefixها حذف شد
    const prefixes = ['🪵','🪨','🍖','💧','🦴','⛏️','📤','🏪','💎','💀','👤','🌿','🗺️','⚔️','🔨','📜','⚡','✅','❌','📊','🏰','🏠','🔒','🖐️','💋','🔥','🔓','🏃','💍','👰','🚪','🎵','🧿','🩸','🔮','🐾','🍼','📦','🎁','👶','👑','💰','🕶️','🛒','🤝','📚','🌾','🏗️','🐍','📋','🏛️','👸','👩','👦','🎲','🍷','🗡️','💊','🛏️','🧹','⏰','👗','🤰','💆','🍑','👄','🎈'];
    for (let prefix of prefixes) { if (text.startsWith(prefix)) return; }
});

bot.on('polling_error', (e) => console.log('Polling error:', e.message));
console.log('✅ ربات بقای باستانی - نسخه کامل آماده شد! 🎉👑🔥');