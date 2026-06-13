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

const { isAdmin, adminCommand, adminState, mainMenu, activeBattles } = require('./core');
const { player } = require('./core');
const config = require('../config');
const audienceStates = {};

// =============================================
// 📅 دستور day/روز
// =============================================
bot.onText(/^day\s*(\d+)$|^روز\s*(\d+)$/, async (msg, match) => {
    const chatId = msg.chat.id;
    const dayNum = parseInt(match[1] || match[2]);
    if (isNaN(dayNum) || dayNum < 1 || dayNum > 7) return bot.sendMessage(chatId, '❌ روز باید بین ۱ تا ۷ باشه!');

    let p = player.getPlayer(chatId);
    if (!p) { player.createPlayer(chatId, msg.chat.first_name || 'گمنام'); p = player.getPlayer(chatId); }

    p.gameDay = dayNum;
    if (p.dailyQuests) { p.dailyQuests.quests = []; p.dailyQuests.completed = []; p.dailyQuests.progress = {}; p.dailyQuests.lastReset = Date.now(); }

    const time = require('../player').getTimeOfDay(); p.timeOfDay = time;
    const loc = config.images.locations[p.location] || config.images.locations.village;
    await bot.sendMessage(chatId, `🏛️ *بقای باستانی - روز ${dayNum}/۷*\n\n✨ ${p.name} | 📍 ${loc.emoji} ${loc.name}\n${time.name} | 🏆 ${p.score || 0} امتیاز`, { parse_mode: 'Markdown', ...mainMenu() });
});

// =============================================
// 📅 روز بعد - دکمه
// =============================================
bot.onText(/^📅 روز بعد$/, async (msg) => {
    const chatId = msg.chat.id;
    const p = player.getPlayer(chatId);
    if (!p) return bot.sendMessage(chatId, '❌ /start بزن!', mainMenu());

    p.gameDay = (p.gameDay || 1) >= 7 ? 1 : (p.gameDay || 1) + 1;

    try { const { generateDailyQuests } = require('../dailyQuest'); generateDailyQuests(p); } catch(e) {}
    try { const { refreshBlackMarket } = require('../blackMarket'); refreshBlackMarket(p); } catch(e) {}

    try {
        const { checkBirths } = require('../offspring');
        const births = checkBirths(p);
        if (births && births.length > 0) for (let child of births) await bot.sendMessage(chatId, `👶 *${child.name}* ${child.emoji} به دنیا اومد!`, { parse_mode: 'Markdown' });
    } catch(e) {}

    try {
        const { checkHaremBirths } = require('../queenHarem');
        const births = checkHaremBirths(p);
        if (births && births.length > 0) for (let b of births) await bot.sendMessage(chatId, `👶 *${b.child.name}* از ${b.queen.emoji} ${b.queen.name} به دنیا اومد!`, { parse_mode: 'Markdown' });
    } catch(e) {}

    try {
        const { checkEscapes } = require('../prison');
        const escaped = checkEscapes(p);
        if (escaped && escaped.length > 0) for (let prisoner of escaped) await bot.sendMessage(chatId, `🏃 *${prisoner.name}* فرار کرد!`, { parse_mode: 'Markdown' });
    } catch(e) {}

    try { const { autoFeedCheck } = require('../pet'); const hungry = autoFeedCheck(p); if (hungry) await bot.sendMessage(chatId, `🍖 ${hungry}`, { parse_mode: 'Markdown' }); } catch(e) {}

    const time = require('../player').getTimeOfDay(); p.timeOfDay = time;
    const loc = config.images.locations[p.location] || config.images.locations.village;

    await bot.sendMessage(chatId, 
        `📅 *روز ${p.gameDay}/۷*\n\n${time.name} | 🏆 ${p.score || 0} امتیاز\n📍 ${loc.emoji} ${loc.name}\n\n✅ ماموریت‌های جدید!\n🔄 بازار مکاره بروز شد!`, 
        { parse_mode: 'Markdown', ...mainMenu() }
    );

    // 👑 ملاقات درباری (از سطح ۳۰)
    if (p.level >= 30) {
        const audiences = [
            { title: '👨‍🌾 دهقانان گرسنه', desc: 'قربان! محصولاتمون از بین رفته. کمک کنین!', choices: [
                { text: '🍞 از انبار بده (۵۰ غذا)', callback: 'audience_food', effect: { food: -50, happiness: 20 } },
                { text: '💰 پول بده (۱۰۰ طلا)', callback: 'audience_gold100', effect: { gold: -100, happiness: 10 } },
                { text: '😤 رد کن', callback: 'audience_no', effect: { happiness: -15 } }
            ]},
            { title: '📜 شکایت از مالیات', desc: 'شاه! مالیات‌ها سنگینه...', choices: [
                { text: '📉 کم کن', callback: 'audience_tax', effect: { happiness: 15, gold: -30 } },
                { text: '⏸️ این ماه ببخش', callback: 'audience_free', effect: { happiness: 25, gold: -50 } },
                { text: '😤 باید بدن', callback: 'audience_no', effect: { happiness: -20 } }
            ]},
            { title: '⚖️ محاکمه دزد', desc: 'اعلی‌حضرت! یه دزد گرفتن...', choices: [
                { text: '💀 اعدام', callback: 'audience_kill', effect: { justice: 10, safety: 15 } },
                { text: '🔒 زندان ابد', callback: 'audience_jail', effect: { justice: 5 } },
                { text: '🤝 ببخش', callback: 'audience_pardon', effect: { happiness: 10, faith: 10 } }
            ]},
            { title: '💰 گزارش خزانه‌دار', desc: 'شاهم! هزینه‌های قصر زیاده...', choices: [
                { text: '📊 کم کن', callback: 'audience_cut', effect: { gold: 30 } },
                { text: '💰 از مردم بگیر', callback: 'audience_collect', effect: { gold: 50, happiness: -10 } },
                { text: '✅ باشه', callback: 'audience_ok', effect: {} }
            ]},
            { title: '👸 درخواست ملکه', desc: 'ملکه: "شوهرم... جواهر می‌خوام..."', choices: [
                { text: '💍 بخر (۲۰۰ طلا)', callback: 'audience_queen', effect: { gold: -200, queenMood: 30 } },
                { text: '💋 بعداً', callback: 'audience_later', effect: { queenMood: -10 } },
                { text: '😤 نه!', callback: 'audience_no', effect: { queenMood: -25 } }
            ]},
            { title: '🎉 درخواست جشن', desc: 'مردم می‌خوان جشن بگیرن!', choices: [
                { text: '🎊 بزرگ (۳۰۰ طلا)', callback: 'audience_fest_big', effect: { gold: -300, happiness: 30 } },
                { text: '🎈 کوچیک (۱۰۰ طلا)', callback: 'audience_fest_small', effect: { gold: -100, happiness: 15 } },
                { text: '😤 نه', callback: 'audience_no', effect: { happiness: -20 } }
            ]}
        ];

        const aud = audiences[Math.floor(Math.random() * audiences.length)];
        const buttons = aud.choices.map(c => [{ text: c.text, callback_data: c.callback }]);
        audienceStates[chatId] = { currentAudience: aud };

        await bot.sendMessage(chatId,
            `👑 *ملاقات درباری - روز ${p.gameDay}*\n\n${aud.title}\n\n💬 "${aud.desc}"\n\n🤔 *تصمیم شما چیه؟*`,
            { parse_mode: 'Markdown', reply_markup: { inline_keyboard: buttons } }
        );
    }
});

// =============================================
// 👑 هندلر تصمیم‌های ملاقات درباری
// =============================================
bot.on('callback_query', async (query) => {
    const chatId = query.message.chat.id;
    const msgId = query.message.message_id;
    const data = query.data;
    const p = player.getPlayer(chatId);
    if (!p || !data || !data.startsWith('audience_')) return;

    const state = audienceStates[chatId];
    if (!state || !state.currentAudience) return bot.answerCallbackQuery(query.id, { text: '❌ ملاقات تموم شده!' });

    const aud = state.currentAudience;
    const choice = aud.choices.find(c => c.callback === data);
    if (!choice) return bot.answerCallbackQuery(query.id);

    // اعمال اثر
    const eff = choice.effect || {};
    if (eff.gold) p.inventory.gold = Math.max(0, (p.inventory.gold || 0) + eff.gold);
    if (eff.food) p.inventory.food = Math.max(0, (p.inventory.food || 0) + eff.food);
    if (eff.happiness && p.people) p.people.stats.happiness = Math.min(100, Math.max(0, (p.people.stats.happiness || 50) + eff.happiness));
    if (eff.faith && p.people) p.people.stats.faith = Math.min(100, Math.max(0, (p.people.stats.faith || 50) + eff.faith));
    if (eff.justice && p.people) p.people.stats.justice = Math.min(100, Math.max(0, (p.people.stats.justice || 50) + eff.justice));
    if (eff.safety && p.people) p.people.stats.safety = Math.min(100, Math.max(0, (p.people.stats.safety || 50) + eff.safety));
    if (eff.queenMood && p.harem && p.harem.queens && p.harem.queens.length > 0) {
        const q = p.harem.queens[0];
        q.mood = Math.min(100, Math.max(0, (q.mood || 50) + eff.queenMood));
    }

    let result = '✅ انجام شد.';
    if (eff.happiness) result += `\n😊 خوشبختی ${eff.happiness > 0 ? '+' : ''}${eff.happiness}`;
    if (eff.gold) result += `\n👑 طلا ${eff.gold > 0 ? '+' : ''}${eff.gold}`;
    if (eff.food) result += `\n🍞 غذا ${eff.food > 0 ? '+' : ''}${eff.food}`;

    await bot.editMessageText(`👑 *ملاقات درباری*\n\n${aud.title}\n\n✅ *${choice.text}*\n${result}`,
        { chat_id: chatId, message_id: msgId, parse_mode: 'Markdown' });
    delete state.currentAudience;
    return bot.answerCallbackQuery(query.id, { text: '✅' });
});

// =============================================
// 🔙 دکمه برگشت
// =============================================
bot.onText(/^🔙 برگشت$/, async (msg) => {
    const chatId = msg.chat.id;
    const p = player.getPlayer(chatId);
    if (!p) return bot.sendMessage(chatId, '❌ /start بزن!', mainMenu());

    if (adminState[chatId]) delete adminState[chatId];
    if (activeBattles[chatId]) delete activeBattles[chatId];

    const time = require('../player').getTimeOfDay(); p.timeOfDay = time;
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
        if (adminState[chatId]) delete adminState[chatId];
        if (activeBattles[chatId]) delete activeBattles[chatId];

        const time = require('../player').getTimeOfDay(); p.timeOfDay = time;
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

        const args = text.split(' '); const cmd = args.shift().toLowerCase();
        const adminCommands = ['gold','g','xp','exp','score','sc','heal','hp','item','give','attack','atk','defense','def','level','lvl','energy','en','setday','nextday','nd','resetday','rd','condom','cd','unlock','max','maxall','god','pet','addpet','removepet','petfood','box','addbox','openbox','boxes','quest','newquest','completequest','child','addchild','heir','setheir','killchild','tournament','pregnant','birth','addqueen','removequeen','queencare','queensalary','promotequeen','empirelevel','dynasty','income','wonder','population','food','water','building','stats','blackmarket','prison','gift','sendgift','info','whois','users','count','top','resetuser','ru','ban','unban','announce','ann','save','reset','help','addnpc','addprison','addhouse','addhome','removenpc','removeprison','removehouse','removehome','setrelation','setrel','marrynow','forcemarry'];
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
});

bot.on('polling_error', (e) => console.log('Polling error:', e.message));
console.log('✅ ربات بقای باستانی - نسخه کامل آماده شد! 🎉👑🔥');