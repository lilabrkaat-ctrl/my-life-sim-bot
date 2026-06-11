const { bot } = require('./core');
const { setupMenuHandlers } = require('./menuHandlers');
const { setupChamberHandlers } = require('./chamberHandlers');
const { setupEmpireHandlers } = require('./empireHandlers');
const { setupHaremHandlers } = require('./haremHandlers');
const { setupShopHandlers } = require('./shopHandlers');
const { setupFightHandlers } = require('./fightHandlers');
const { setupCraftHandlers } = require('./craftHandlers');
const { setupPrisonHandlers } = require('./prisonHandlers');
const { setupHouseHandlers } = require('./houseHandlers');
const { setupPetHandlers } = require('./petHandlers');
const { setupLootboxHandlers } = require('./lootboxHandlers');
const { setupDailyQuestHandlers } = require('./dailyQuestHandlers');
const { setupOffspringHandlers } = require('./offspringHandlers');
const { setupCourtHandlers } = require('./courtHandlers');
const { setupPeopleHandlers } = require('./peopleHandlers');

// =============================================
// 🚀 راه‌اندازی همه هندلرها
// =============================================
setupMenuHandlers();
setupChamberHandlers();
setupEmpireHandlers();
setupHaremHandlers();
setupShopHandlers();
setupFightHandlers();
setupCraftHandlers();
setupPrisonHandlers();
setupHouseHandlers();
setupPetHandlers();
setupLootboxHandlers();
setupDailyQuestHandlers();
setupOffspringHandlers();
setupCourtHandlers();
setupPeopleHandlers();

console.log('✅ تمام هندلرها راه‌اندازی شدن!');

const { isAdmin, adminCommand, adminState, mainMenu, activeBattles, sendAnimation, sendPhoto } = require('./core');
const { player } = require('./core');
const config = require('../config');

// =============================================
// 🔙 دکمه برگشت (کیبورد معمولی)
// =============================================
bot.onText(/^🔙 برگشت$/, async (msg) => {
    const chatId = msg.chat.id;
    const p = player.getPlayer(chatId);
    if (!p) return bot.sendMessage(chatId, '❌ /start بزن!', mainMenu());
    
    // پاک کردن state ها
    const { chamberState, empireState, peopleState, courtState, haremState, activePrisoner, activeHouseNpc } = require('./core');
    if (adminState[chatId]) delete adminState[chatId];
    if (chamberState[chatId]) delete chamberState[chatId];
    if (empireState[chatId]) delete empireState[chatId];
    if (peopleState[chatId]) delete peopleState[chatId];
    if (courtState[chatId]) delete courtState[chatId];
    if (haremState[chatId]) delete haremState[chatId];
    if (activePrisoner[chatId]) delete activePrisoner[chatId];
    if (activeHouseNpc[chatId]) delete activeHouseNpc[chatId];
    if (activeBattles[chatId]) delete activeBattles[chatId];
    
    const { getTimeOfDay } = require('../player');
    const time = getTimeOfDay();
    p.timeOfDay = time;
    const loc = config.images.locations[p.location] || config.images.locations.village;
    let welcome = `🏛️ *بقای باستانی*\n\n✨ ${p.name} | 📍 ${loc.emoji} ${loc.name}\n${time.name} | 📅 روز ${p.gameDay || 1}/۷ | 🏆 ${p.score || 0} امتیاز`;
    await bot.sendMessage(chatId, welcome, { parse_mode: 'Markdown', ...mainMenu() });
});

// =============================================
// 🔙 برگشت به منوی اصلی (callback_query شیشه‌ای)
// =============================================
bot.on('callback_query', async (query) => {
    const chatId = query.message.chat.id;
    const msgId = query.message.message_id;
    const data = query.data;
    const p = player.getPlayer(chatId);

    if (!p) return bot.answerCallbackQuery(query.id, { text: '❌ /start بزن!', show_alert: true });

    if (data === 'back_to_main') {
        const { chamberState, empireState, peopleState, courtState, haremState, activePrisoner, activeHouseNpc } = require('./core');
        [adminState, chamberState, empireState, peopleState, courtState, haremState, activePrisoner, activeHouseNpc].forEach(s => {
            if (s && s[chatId]) delete s[chatId];
        });
        if (activeBattles[chatId]) delete activeBattles[chatId];

        const { getTimeOfDay } = require('../player');
        const time = getTimeOfDay();
        p.timeOfDay = time;
        const loc = config.images.locations[p.location] || config.images.locations.village;
        let welcome = `🏛️ *بقای باستانی*\n\n✨ ${p.name} | 📍 ${loc.emoji} ${loc.name}\n${time.name} | 📅 روز ${p.gameDay || 1}/۷ | 🏆 ${p.score || 0} امتیاز`;
        
        try {
            await bot.editMessageText(welcome, { chat_id: chatId, message_id: msgId, parse_mode: 'Markdown', ...mainMenu() });
        } catch (e) {
            await bot.sendMessage(chatId, welcome, { parse_mode: 'Markdown', ...mainMenu() });
        }
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

    // ============ 👑 ادمین ============
    if (isAdmin(chatId)) {
        let p = player.getPlayer(chatId);
        
        // اگه پلیر وجود نداره، یه دونه موقت بساز
        if (!p) {
            player.createPlayer(chatId, 'Admin 👑');
            p = player.getPlayer(chatId);
        }
        
        if (!p) return;
        p.chatId = chatId;

        // state هدیه دادن
        if (adminState[chatId] && adminState[chatId].step === 'amount') {
            const amount = parseInt(text);
            if (isNaN(amount) || amount <= 0) { 
                bot.sendMessage(chatId, '❌ یه عدد معتبر وارد کن!', mainMenu()); 
                return; 
            }
            const state = adminState[chatId];
            const target = player.getPlayer(state.targetId);
            if (!target) { 
                delete adminState[chatId]; 
                bot.sendMessage(chatId, '❌ کاربر دیگه آنلاین نیست!', mainMenu()); 
                return; 
            }
            target.inventory[state.item] = (target.inventory[state.item] || 0) + amount;
            bot.sendMessage(chatId, `🎁 *هدیه فرستاده شد!*\n👤 ${target.name}\n🎒 ${state.item}: +${amount}`, { parse_mode: 'Markdown', ...mainMenu() });
            delete adminState[chatId]; 
            return;
        }

        // state های امپراطوری و دربار
        const { empireState, courtState, haremState } = require('./core');
        
        // تغییر نام سلسله
        if (empireState[chatId] && empireState[chatId].action === 'setDynasty') {
            const { setDynastyName, formatEmpire, getEmpireKeyboard } = require('../empire');
            const result = setDynastyName(p, text);
            const stateMsgId = empireState[chatId].msgId;
            delete empireState[chatId];
            if (stateMsgId) {
                try { await bot.editMessageText(formatEmpire(p), { chat_id: chatId, message_id: stateMsgId, parse_mode: 'Markdown', ...getEmpireKeyboard(p) }); } catch (e) {}
            }
            bot.sendMessage(chatId, result.message, { parse_mode: 'Markdown' }); 
            return;
        }

        // انتصاب سمت
        if (empireState[chatId] && empireState[chatId].action === 'assignRole') {
            const { assignRole, formatEmpire, getEmpireKeyboard } = require('../empire');
            const childId = text.trim();
            const result = assignRole(p, empireState[chatId].roleKey, childId);
            const stateMsgId = empireState[chatId].msgId;
            delete empireState[chatId];
            if (stateMsgId) {
                try { await bot.editMessageText(formatEmpire(p), { chat_id: chatId, message_id: stateMsgId, parse_mode: 'Markdown', ...getEmpireKeyboard(p) }); } catch (e) {}
            }
            bot.sendMessage(chatId, result.message, { parse_mode: 'Markdown' }); 
            return;
        }

        // دسیسه دربار
        if (courtState[chatId] && courtState[chatId].action === 'intrigue') {
            const { performIntrigue, formatCourt, getCourtKeyboard } = require('../court');
            const parts = text.split(' ');
            const targetId = parts[0];
            const performerId = parts[1] || targetId;
            const result = performIntrigue(p, courtState[chatId].intrigueKey, targetId, performerId);
            delete courtState[chatId];
            bot.sendMessage(chatId, result.message, { parse_mode: 'Markdown', ...getCourtKeyboard(p) }); 
            return;
        }

        // حرمسرا - انتخاب ملکه
        if (haremState[chatId] && haremState[chatId].action === 'newPregnancy') {
            const queenName = text.trim();
            const queen = p.harem?.queens.find(q => q.name === queenName);
            if (!queen) {
                bot.sendMessage(chatId, '❌ ملکه پیدا نشد! اسم رو دقیق بنویس.', { parse_mode: 'Markdown', ...mainMenu() });
                delete haremState[chatId];
                return;
            }
            haremState[chatId].queenId = queen.id;
            haremState[chatId].action = 'startPregnancy';
            const { getPregnancySpeedKeyboard } = require('../queenHarem');
            bot.sendMessage(chatId, '⏰ *سرعت بارداری*\n\nنوع بارداری رو انتخاب کن:', { parse_mode: 'Markdown', ...getPregnancySpeedKeyboard() }); 
            return;
        }

        // دستورات عادی ادمین
        const args = text.split(' '); 
        const cmd = args.shift().toLowerCase();
        const adminCommands = [
            'gold','g','xp','exp','score','sc','heal','hp','item','give',
            'attack','atk','defense','def','level','lvl','energy','en',
            'day','setday','nextday','nd','resetday','rd','condom','cd',
            'unlock','max','maxall','god','pet','addpet','removepet','petfood',
            'box','addbox','openbox','boxes','quest','newquest','completequest',
            'child','addchild','heir','setheir','killchild','tournament','pregnant','birth',
            'addqueen','removequeen','queencare','queensalary','promotequeen',
            'empirelevel','dynasty','income','wonder',
            'population','food','water','building','stats','blackmarket',
            'prison','gift','sendgift',
            'info','whois','users','count','top',
            'resetuser','ru','ban','unban',
            'announce','ann','save','reset','help',
            'addnpc','addprison','addhouse','addhome',
            'removenpc','removeprison','removehouse','removehome',
            'setrelation','setrel','marrynow','forcemarry'
        ];

        if (adminCommands.includes(cmd)) {
            const result = adminCommand(p, cmd, args);
            if (result.announceAll && result.announce) {
                const announceMsg = `📢 *اعلان ادمین:*\n\n${result.announce}`;
                for (let id in player.players) { 
                    try { bot.sendMessage(id, announceMsg, { parse_mode: 'Markdown' }); } catch (e) {} 
                }
                bot.sendMessage(chatId, `✅ پیام به همه ارسال شد!`, { parse_mode: 'Markdown', ...mainMenu() });
                return;
            }
            bot.sendMessage(chatId, result.message, { parse_mode: 'Markdown', ...mainMenu() }); 
            return;
        }
        return;
    }

    // ============ 👤 کاربر معمولی ============
    const p = player.getPlayer(chatId);
    if (!p) return;
    p.chatId = chatId;

    // Shop (خرید/فروش با عدد)
    const { getShopState, processAmount } = require('../shop');
    const shopState = getShopState(p);
    if (shopState) {
        const result = processAmount(p, text);
        if (result.message) {
            const { getShopKeyboard } = require('../shop');
            bot.sendMessage(chatId, result.message, { parse_mode: 'Markdown', ...getShopKeyboard() });
        }
        return;
    }

    // نادیده گرفتن پیام‌های منو
    const prefixes = [
        '🪵','🪨','🍖','💧','🦴','⛏️','📤','🏪','💎','💀',
        '👤','🌿','🗺️','⚔️','🔨','📜','⚡','✅','❌','📊',
        '🏰','🏠','🔒','🖐️','💋','🔥','🔓','🏃','💍','👰',
        '🚪','🎵','🧿','🩸','🔮','🐾','🍼','📦','🎁','👶',
        '👑','💰','🕶️','🛒','🤝','📚','🌾','🏗️','🐍','📋',
        '🏛️','👸','👩','👦','🎲','🍷','🗡️','💊','🛏️','🧹',
        '⏰','👗','🤰','💆','🍑','👄','🎈'
    ];
    
    for (let prefix of prefixes) { 
        if (text.startsWith(prefix)) return; 
    }
});

bot.on('polling_error', (e) => console.log('Polling error:', e.message));
console.log('✅ ربات بقای باستانی - نسخه شیشه‌ای کامل آماده شد! 🎉👑🔥');