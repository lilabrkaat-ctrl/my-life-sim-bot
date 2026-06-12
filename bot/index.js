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

console.log('✅ تمام ۱۴ هندلر راه‌اندازی شدن!');

const { isAdmin, adminCommand, adminState, mainMenu, activeBattles, sendPhoto, sendAnimation, chamberState, positionImages } = require('./core');
const { player } = require('./core');
const config = require('../config');

// گیف‌های مخفی‌گاه
const sexyGifs = {
    touch: [
        'CgACAgIAAxkBAAEqL2xqIyJty9xl0ap5lrJYra2GtlNQdQACTwMAAiY94UhMlGoX_JSICTsE',
        'CgACAgQAAxkBAAEqL2pqIyJpy-g7HaM9YEhpzyE0RU-1MwACrAADXSmNUjSWJGIYVG3KOwQ',
        'CgACAgQAAxkBAAEqL15qIyJW5AcK3OWO2Oyif7wI1aiDqQACgQMAAirVQQYo4gxrnlL0zTsE'
    ],
    kiss: 'CgACAgIAAxkBAAEqL2hqIyJnncLJlCKF2kJOT7jKi-7r_wACaAIAArqQoEtep7htQxIwxTsE',
    orgy: 'CgACAgQAAxkBAAEqL1xqIyJUx3yIRno4UZtix4SumGHwCgAC6p8AAkMXZAepPlY8DiidIDsE',
    extra: [
        'CgACAgQAAxkBAAEqizpqK5tQFeriRVC2jqdHhD_brsXdAwACUx4AAtsXWVGX50vaL2d8KzwE',
        'CgACAgQAAxkBAAEqi09qK5tmyT3ia2dR7m8hTSdyHJKmvAACfhsAAtN3WVFQLM4BGup3wTwE',
        'CgACAgQAAxkBAAEqi1NqK5tmc79xEIG6arpSFIeLmrFFrQACOR4AAtsXWVGBZG94AAH7sEU8BA',
        'CgACAgQAAxkBAAEqi0xqK5tmDJWGbx2ZHbZqxV2dIdvU3wACSx4AAjScUVE5YZD0VdPitzwE'
    ]
};

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
    
    const { empireState, peopleState, courtState, haremState, activePrisoner, activeHouseNpc } = require('./core');
    [adminState, chamberState, empireState, peopleState, courtState, haremState, activePrisoner, activeHouseNpc].forEach(s => { if (s && s[chatId]) delete s[chatId]; });
    if (activeBattles[chatId]) delete activeBattles[chatId];
    
    const { getTimeOfDay } = require('../player');
    const time = getTimeOfDay(); p.timeOfDay = time;
    const loc = config.images.locations[p.location] || config.images.locations.village;
    await bot.sendMessage(chatId, `🏛️ *بقای باستانی*\n\n✨ ${p.name} | 📍 ${loc.emoji} ${loc.name}\n${time.name} | 📅 روز ${p.gameDay || 1}/۷ | 🏆 ${p.score || 0} امتیاز`, { parse_mode: 'Markdown', ...mainMenu() });
});

// =============================================
// 🔙 برگشت شیشه‌ای + callbackهای مخفی‌گاه
// =============================================
bot.on('callback_query', async (query) => {
    const chatId = query.message.chat.id;
    const msgId = query.message.message_id;
    const data = query.data;
    const p = player.getPlayer(chatId);

    if (!p) return bot.answerCallbackQuery(query.id, { text: '❌ /start بزن!', show_alert: true });

    // ============ برگشت به منوی اصلی ============
    if (data === 'back_to_main') {
        const { empireState, peopleState, courtState, haremState, activePrisoner, activeHouseNpc } = require('./core');
        [adminState, chamberState, empireState, peopleState, courtState, haremState, activePrisoner, activeHouseNpc].forEach(s => { if (s && s[chatId]) delete s[chatId]; });
        if (activeBattles[chatId]) delete activeBattles[chatId];

        const { getTimeOfDay } = require('../player');
        const time = getTimeOfDay(); p.timeOfDay = time;
        const loc = config.images.locations[p.location] || config.images.locations.village;
        await bot.deleteMessage(chatId, msgId).catch(() => {});
        await bot.sendMessage(chatId, `🏛️ *بقای باستانی*\n\n✨ ${p.name} | 📍 ${loc.emoji} ${loc.name}\n${time.name} | 📅 روز ${p.gameDay || 1}/۷ | 🏆 ${p.score || 0} امتیاز`, { parse_mode: 'Markdown', ...mainMenu() });
        return bot.answerCallbackQuery(query.id);
    }

    // ============ 🔞 callbackهای مخفی‌گاه ============
    if (data && data.startsWith('chamber_')) {
        const st = chamberState[chatId];
        if (!st || !st.person) {
            return bot.answerCallbackQuery(query.id, { text: '❌ یک شخص انتخاب کن!' });
        }

        const person = st.person;

        try {
            if (data === 'chamber_back') {
                delete chamberState[chatId];
                await bot.deleteMessage(chatId, msgId).catch(() => {});
                const { formatSecretChamber, getSecretChamberKeyboard } = require('../secretChamber');
                await bot.sendMessage(chatId, formatSecretChamber(p), { parse_mode: 'Markdown', ...getSecretChamberKeyboard(p) });
                return bot.answerCallbackQuery(query.id);
            }

            if (data.startsWith('chamber_touch_')) {
                const gif = sexyGifs.touch[Math.floor(Math.random() * sexyGifs.touch.length)];
                if (!p.prisonRelations) p.prisonRelations = {};
                p.prisonRelations[person.id] = Math.min(100, (p.prisonRelations[person.id] || 30) + 5);
                
                const btns = [
                    [{ text: '💋 ببوس', callback_data: `chamber_kiss_${person.id}` }],
                    [{ text: '🔥 عیاشی', callback_data: `chamber_orgy_${person.id}` }],
                    [{ text: '🔙 برگشت', callback_data: 'chamber_back' }]
                ];
                
                await bot.deleteMessage(chatId, msgId).catch(() => {});
                await sendAnimation(chatId, gif, `🖐️ ${person.emoji} ${person.name} رو لمس کردی...\n💕 +۵`, { reply_markup: { inline_keyboard: btns } });
                return bot.answerCallbackQuery(query.id);
            }

            if (data.startsWith('chamber_kiss_')) {
                if (!p.prisonRelations) p.prisonRelations = {};
                p.prisonRelations[person.id] = Math.min(100, (p.prisonRelations[person.id] || 30) + 10);
                
                const btns = [
                    [{ text: '🔥 عیاشی', callback_data: `chamber_orgy_${person.id}` }],
                    [{ text: '🔙 برگشت', callback_data: 'chamber_back' }]
                ];
                
                await bot.deleteMessage(chatId, msgId).catch(() => {});
                await sendAnimation(chatId, sexyGifs.kiss, `💋 ${person.emoji} ${person.name} رو بوسیدی...\n💕 +۱۰`, { reply_markup: { inline_keyboard: btns } });
                return bot.answerCallbackQuery(query.id);
            }

            if (data.startsWith('chamber_orgy_')) {
                const allOrgyGifs = [sexyGifs.orgy, ...sexyGifs.extra];
                const gif = allOrgyGifs[Math.floor(Math.random() * allOrgyGifs.length)];
                
                if (!p.prisonRelations) p.prisonRelations = {};
                p.prisonRelations[person.id] = Math.min(100, (p.prisonRelations[person.id] || 30) + 15);
                
                const positions = ['front', 'back', 'oral'];
                const pos = positions[Math.floor(Math.random() * positions.length)];
                const image = positionImages[pos] ? positionImages[pos][Math.floor(Math.random() * positionImages[pos].length)] : null;
                const titles = { front: '🍑 از جلو', back: '🍑 از عقب', oral: '👄 دهنی' };
                
                await bot.deleteMessage(chatId, msgId).catch(() => {});
                await sendAnimation(chatId, gif, `🔥 با ${person.emoji} ${person.name}...`, { reply_markup: { inline_keyboard: [] } });
                await new Promise(r => setTimeout(r, 2000));
                
                const btns = [[{ text: '🔙 برگشت', callback_data: 'chamber_back' }]];
                if (image) {
                    await sendPhoto(chatId, image, `${titles[pos]}\n\n💕 +۱۵`, { reply_markup: { inline_keyboard: btns } });
                } else {
                    await bot.sendMessage(chatId, `${titles[pos]}\n\n💕 +۱۵`, { parse_mode: 'Markdown', reply_markup: { inline_keyboard: btns } });
                }
                
                delete chamberState[chatId];
                return bot.answerCallbackQuery(query.id);
            }
        } catch(e) {
            console.log('Chamber callback error:', e.message);
            return bot.answerCallbackQuery(query.id, { text: '❌ خطا!' });
        }
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

    const prefixes = ['🪵','🪨','🍖','💧','🦴','⛏️','📤','🏪','💎','💀','👤','🌿','🗺️','⚔️','🔨','📜','⚡','✅','❌','📊','🏰','🏠','🔒','🖐️','💋','🔥','🔓','🏃','💍','👰','🚪','🎵','🧿','🩸','🔮','🐾','🍼','📦','🎁','👶','👑','💰','🕶️','🛒','🤝','📚','🌾','🏗️','🐍','📋','🏛️','👸','👩','👦','🎲','🍷','🗡️','💊','🛏️','🧹','⏰','👗','🤰','💆','🍑','👄','🎈'];
    for (let prefix of prefixes) { if (text.startsWith(prefix)) return; }
});

bot.on('polling_error', (e) => console.log('Polling error:', e.message));
console.log('✅ ربات بقای باستانی - نسخه کامل آماده شد! 🎉👑🔥');