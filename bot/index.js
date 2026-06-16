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
// 🏛️ START
// =============================================
bot.onText(/\/start/, async (msg) => {
    const chatId = msg.chat.id;
    const firstName = msg.chat.first_name || 'گمنام';
    if (!player.getPlayer(chatId)) player.createPlayer(chatId, firstName);
    const p = player.getPlayer(chatId);
    if (!p) return bot.sendMessage(chatId, '❌ خطا! /start بزن.');
    player.initAllSystems(p);
    const time = require('../player').getTimeOfDay(); p.timeOfDay = time;
    if (!p.gameDay) p.gameDay = 1;
    player.checkUnlocks(p); p.chatId = chatId;
    const loc = config.images.locations[p.location] || config.images.locations.village;
    let welcome = `🏛️ *بقای باستانی*\n\n✨ ${p.name} | 📍 ${loc.emoji} ${loc.name}\n${time.name} | 📅 روز ${p.gameDay||1}/۷ | 🏆 ${p.score||0} امتیاز\n\n🐺 *مرحله اول: روستا*\n🎯 گرگ‌ها، مارها و دزدها رو شکار کن!`;
    if (p.unlockedMessage) { welcome += `\n\n${p.unlockedMessage}`; p.unlockedMessage = null; }
    if (p.levelUpMessage) { welcome += `\n\n${p.levelUpMessage}`; p.levelUpMessage = null; }
    await bot.sendMessage(chatId, welcome, { parse_mode: 'Markdown', ...mainMenu() });
});

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
// 📅 روز بعد
// =============================================
bot.onText(/^📅 روز بعد$/, async (msg) => {
    const chatId = msg.chat.id;
    const p = player.getPlayer(chatId);
    if (!p) return bot.sendMessage(chatId, '❌ /start بزن!', mainMenu());
    p.gameDay = (p.gameDay || 1) >= 7 ? 1 : (p.gameDay || 1) + 1;

    if (p.isDead) {
        const daysPassed = p.gameDay - (p.deathDay || p.gameDay);
        if (daysPassed >= 2 || daysPassed < 0) {
            p.isDead = false; p.deathDay = null;
            await bot.sendMessage(chatId, '✨ *درمان شدی!*\n\n🏥 بعد از ۲ روز استراحت، زخم‌هات خوب شدن!\n⚔️ آماده نبرد دوباره!', { parse_mode: 'Markdown', ...mainMenu() });
        } else {
            await bot.sendMessage(chatId, `🏥 *در حال درمان...*\n\n📅 ${2 - daysPassed} روز دیگه استراحت کن.`, { parse_mode: 'Markdown', ...mainMenu() });
            return;
        }
    }

    if (p.pregnancies) for (let preg of p.pregnancies) { if (!preg.born && preg.dueDate) preg.dueDate -= 86400000; }
    if (p.harem?.queens) for (let queen of p.harem.queens) { if (queen.pregnancies) for (let preg of queen.pregnancies) { if (!preg.born && preg.dueDate) preg.dueDate -= 86400000; } }

    try { const { generateDailyQuests } = require('../dailyQuest'); generateDailyQuests(p); } catch(e) {}
    try { const { refreshBlackMarket } = require('../blackMarket'); refreshBlackMarket(p); } catch(e) {}
    try { const { checkBirths } = require('../offspring'); const births = checkBirths(p); if (births?.length) for (let c of births) await bot.sendMessage(chatId, `👶 *${c.name}* ${c.emoji} به دنیا اومد!`, { parse_mode: 'Markdown' }); } catch(e) {}
    try { const { checkHaremBirths } = require('../queenHarem'); const births = checkHaremBirths(p); if (births?.length) for (let b of births) await bot.sendMessage(chatId, `👶 *${b.child.name}* از ${b.queen.emoji} ${b.queen.name} به دنیا اومد!`, { parse_mode: 'Markdown' }); } catch(e) {}
    try { const { checkEscapes } = require('../prison'); const esc = checkEscapes(p); if (esc?.length) for (let pr of esc) await bot.sendMessage(chatId, `🏃 *${pr.name}* فرار کرد!`, { parse_mode: 'Markdown' }); } catch(e) {}
    try { const { autoFeedCheck } = require('../pet'); const h = autoFeedCheck(p); if (h) await bot.sendMessage(chatId, `🍖 ${h}`, { parse_mode: 'Markdown' }); } catch(e) {}

    const time = require('../player').getTimeOfDay(); p.timeOfDay = time;
    const loc = config.images.locations[p.location] || config.images.locations.village;
    await bot.sendMessage(chatId, `📅 *روز ${p.gameDay}/۷*\n\n${time.name} | 🏆 ${p.score || 0} امتیاز\n📍 ${loc.emoji} ${loc.name}\n\n✅ ماموریت‌های جدید!\n🔄 بازار مکاره بروز شد!`, { parse_mode: 'Markdown', ...mainMenu() });

    const audiences = p.level >= 30 ? getKingAudiences() : getLowLevelAudiences();
    const aud = audiences[Math.floor(Math.random() * audiences.length)];
    audienceStates[chatId] = { currentAudience: aud };
    await bot.sendMessage(chatId, `👑 *ملاقات - روز ${p.gameDay}*\n\n${aud.title}\n\n💬 "${aud.desc}"\n\n🤔 *تصمیم شما چیه؟*`, { parse_mode: 'Markdown', reply_markup: { inline_keyboard: aud.choices.map(c => [{ text: c.text, callback_data: c.callback }]) } });
});

// =============================================
// ۲۰ سناریو سطح ۱-۳۰
// =============================================
function getLowLevelAudiences() {
    return [
        { title: '👨‍🌾 دهقان دوره‌گرد', desc: '"غریبم... راه روستا کدوم طرفه؟"', choices: [{ text: '🧭 راهنماییش کن', callback: 'a1', effect: { xp: 10 } }, { text: '💰 پول راه بگیر (۵ طلا)', callback: 'a2', effect: { gold: 5 } }, { text: '😤 برو گمشو', callback: 'a0', effect: {} }] },
        { title: '🐺 حمله گرگ', desc: 'گرگ زخمی بهت حمله کرد!', choices: [{ text: '⚔️ بجنگ', callback: 'a1', effect: { xp: 15, hp: -10 } }, { text: '🏃 فرار کن', callback: 'a2', effect: {} }, { text: '🍖 غذا بده', callback: 'a3', effect: { meat: -3 } }] },
        { title: '👵 پیرزن مرموز', desc: '"آینده‌ات رو می‌بینم... یه سکه بده..."', choices: [{ text: '💰 بده (۱۰ طلا)', callback: 'a1', effect: { gold: -10, xp: 20 } }, { text: '😂 کلاهبرداریه', callback: 'a2', effect: {} }, { text: '🤝 تعارف کن', callback: 'a3', effect: { xp: 5 } }] },
        { title: '🗡️ دزد ولگرد', desc: '"پولتو بده والا می‌کشمت!"', choices: [{ text: '⚔️ بجنگ', callback: 'a1', effect: { xp: 25, hp: -15 } }, { text: '💰 بده (۲۰ طلا)', callback: 'a2', effect: { gold: -20 } }, { text: '🏃 فرار', callback: 'a3', effect: {} }] },
        { title: '🧒 بچه گمشده', desc: '"مامانم رو گم کردم... کمک..."', choices: [{ text: '🔍 کمکش کن', callback: 'a1', effect: { xp: 15 } }, { text: '🍞 غذا بده', callback: 'a2', effect: { food: -5, xp: 10 } }, { text: '😤 برو', callback: 'a0', effect: {} }] },
        { title: '🕯️ مسافر شب', desc: '"آتیش داری؟ امشب سرده..."', choices: [{ text: '🔥 روشن کن', callback: 'a1', effect: { wood: -2, xp: 5 } }, { text: '🤝 بمون', callback: 'a2', effect: { xp: 10 } }, { text: '😤 برو', callback: 'a0', effect: {} }] },
        { title: '🐍 مار سمی', desc: 'مار سمی توی کمینت بود!', choices: [{ text: '⚔️ بکش', callback: 'a1', effect: { xp: 20, hp: -5 } }, { text: '🏃 فرار', callback: 'a2', effect: { hp: -5 } }, { text: '🪵 چوب بنداز', callback: 'a3', effect: { wood: -1, xp: 10 } }] },
        { title: '👨‍🔧 آهنگر تشنه', desc: '"آب داری؟ کارم سخته..."', choices: [{ text: '💧 آب بده', callback: 'a1', effect: { water: -5, xp: 5 } }, { text: '🤝 کمکش کن', callback: 'a2', effect: { xp: 15 } }, { text: '😤 نه', callback: 'a0', effect: {} }] },
        { title: '🎵 نوازنده', desc: '"آهنگ گوش می‌دی؟"', choices: [{ text: '🎶 گوش بده', callback: 'a1', effect: { xp: 10, hp: 10 } }, { text: '💰 سکه بده (۵ طلا)', callback: 'a2', effect: { gold: -5, xp: 5 } }, { text: '😐 بی‌تفاوت', callback: 'a0', effect: {} }] },
        { title: '🌿 گیاه‌شناس', desc: '"این گیاه داروی خوبیه..."', choices: [{ text: '🧪 امتحان کن', callback: 'a1', effect: { xp: 15, hp: 20 } }, { text: '💰 بخر (۱۰ طلا)', callback: 'a2', effect: { gold: -10, xp: 10 } }, { text: '😤 سمی بود چی؟', callback: 'a0', effect: {} }] },
        { title: '🏚️ گدا', desc: '"یه سکه... فقط یه سکه..."', choices: [{ text: '💰 بده (۵ طلا)', callback: 'a1', effect: { gold: -5, xp: 5 } }, { text: '🍞 نان بده', callback: 'a2', effect: { food: -2, xp: 5 } }, { text: '😤 برو', callback: 'a0', effect: {} }] },
        { title: '⚡ طوفان', desc: 'طوفان نزدیکه! پناه بگیر!', choices: [{ text: '🏠 پناه بگیر', callback: 'a1', effect: { wood: -5 } }, { text: '🔥 آتیش درست کن', callback: 'a2', effect: { wood: -3, xp: 5 } }, { text: '😤 تحمل کن', callback: 'a0', effect: { hp: -15 } }] },
        { title: '🦅 عقاب زخمی', desc: 'عقاب زخمی روی زمین افتاده...', choices: [{ text: '💊 درمانش کن', callback: 'a1', effect: { xp: 15 } }, { text: '🍖 غذا بده', callback: 'a2', effect: { meat: -2, xp: 10 } }, { text: '😤 ولش کن', callback: 'a0', effect: {} }] },
        { title: '📜 طومار قدیمی', desc: 'یه طومار پیدا کردی...', choices: [{ text: '📖 بخون', callback: 'a1', effect: { xp: 25 } }, { text: '💰 بفروش (۳۰ طلا)', callback: 'a2', effect: { gold: 30 } }, { text: '🗑️ بنداز دور', callback: 'a0', effect: {} }] },
        { title: '👤 سرباز فراری', desc: '"از جنگ فرار کردم... مخفیم کن..."', choices: [{ text: '🤝 پناه بده', callback: 'a1', effect: { xp: 20 } }, { text: '💰 پول بگیر (۱۵ طلا)', callback: 'a2', effect: { gold: 15 } }, { text: '😤 لو بدم', callback: 'a0', effect: { xp: -5 } }] },
        { title: '🍄 قارچ عجیب', desc: 'قارچ درخشان پیدا کردی...', choices: [{ text: '🍽️ بخور', callback: 'a1', effect: { hp: 30, xp: 10 } }, { text: '💰 بفروش (۲۰ طلا)', callback: 'a2', effect: { gold: 20 } }, { text: '😤 سمی بود چی', callback: 'a0', effect: {} }] },
        { title: '🐎 اسب ولگرد', desc: 'اسب ولگرد نزدیکت شده...', choices: [{ text: '🐴 سوار شو', callback: 'a1', effect: { xp: 15 } }, { text: '🍎 سیب بده', callback: 'a2', effect: { food: -3, xp: 10 } }, { text: '😤 برو', callback: 'a0', effect: {} }] },
        { title: '🏕️ مسافر خسته', desc: '"راه زیاده... خسته‌ام..."', choices: [{ text: '🏠 بمون پیشم', callback: 'a1', effect: { xp: 10 } }, { text: '🍞 غذا بده', callback: 'a2', effect: { food: -3, xp: 5 } }, { text: '😤 برو', callback: 'a0', effect: {} }] },
        { title: '💧 چاه قدیمی', desc: 'چاه متروکه... آب داره یا نه؟', choices: [{ text: '🪣 بکش', callback: 'a1', effect: { water: 10, xp: 5 } }, { text: '🧪 تست کن', callback: 'a2', effect: { xp: 10 } }, { text: '😤 ولش کن', callback: 'a0', effect: {} }] },
        { title: '🗿 مجسمه عجیب', desc: 'روش نوشته: "آرزو کن..."', choices: [{ text: '🔮 آرزو کن', callback: 'a1', effect: { xp: 20, gold: 10 } }, { text: '🤝 احترام بذار', callback: 'a2', effect: { xp: 10 } }, { text: '😂 مسخرش کن', callback: 'a0', effect: {} }] }
    ];
}

// =============================================
// ۵۰ سناریو پادشاه
// =============================================
function getKingAudiences() {
    return [
        { title: '👨‍🌾 دهقانان گرسنه', desc: 'قربان! محصولاتمون از بین رفته!', choices: [{ text: '🍞 از انبار بده (۵۰ غذا)', callback: 'k1', effect: { food: -50, happiness: 20 } }, { text: '💰 پول بده (۱۰۰ طلا)', callback: 'k2', effect: { gold: -100, happiness: 10 } }, { text: '😤 رد کن', callback: 'k0', effect: { happiness: -15 } }] },
        { title: '📜 شکایت از مالیات', desc: 'شاه! مالیات‌ها سنگینه...', choices: [{ text: '📉 کم کن', callback: 'k1', effect: { happiness: 15, gold: -30 } }, { text: '⏸️ این ماه ببخش', callback: 'k2', effect: { happiness: 25, gold: -50 } }, { text: '😤 باید بدن', callback: 'k0', effect: { happiness: -20 } }] },
        { title: '⚖️ محاکمه دزد', desc: 'اعلی‌حضرت! یه دزد گرفتن...', choices: [{ text: '💀 اعدام', callback: 'k1', effect: { justice: 10, safety: 15 } }, { text: '🔒 زندان ابد', callback: 'k2', effect: { justice: 5 } }, { text: '🤝 ببخش', callback: 'k3', effect: { happiness: 10, faith: 10 } }] },
        { title: '👩‍🌾 مادر داغدار', desc: '"عدالت می‌خوام! پسرم رو کشتن!"', choices: [{ text: '⚖️ محاکمه', callback: 'k1', effect: { justice: 15 } }, { text: '💰 غرامت (۱۰۰ طلا)', callback: 'k2', effect: { gold: -100, happiness: 10 } }, { text: '😤 برو', callback: 'k0', effect: { happiness: -15 } }] },
        { title: '👧 دختر یتیم', desc: '"گشنمه... کمک کنین..."', choices: [{ text: '🍞 غذا بده (۲۰ غذا)', callback: 'k1', effect: { food: -20, happiness: 10 } }, { text: '🏠 پرورشگاه', callback: 'k2', effect: { gold: -50, happiness: 15 } }, { text: '😤 برو', callback: 'k0', effect: { happiness: -10 } }] },
        { title: '👰 عروس فراری', desc: '"از داماد فرار کردم... پناهم بدید!"', choices: [{ text: '🤝 پناه بده', callback: 'k1', effect: { happiness: 10 } }, { text: '💰 برگردون (۱۰۰ طلا)', callback: 'k2', effect: { gold: 100, happiness: -10 } }, { text: '😤 برو پیشش', callback: 'k0', effect: {} }] },
        { title: '👶 درخواست دایه', desc: '"بچه‌های یتیم شیر می‌خوان!"', choices: [{ text: '🍼 بده (۳۰ غذا)', callback: 'k1', effect: { food: -30, happiness: 15 } }, { text: '🐐 بز بخر (۵۰ طلا)', callback: 'k2', effect: { gold: -50, happiness: 10 } }, { text: '😤 نه', callback: 'k0', effect: { happiness: -10 } }] },
        { title: '🎪 درخواست دلقک', desc: '"اجازه بدید مردم رو بخندونم!"', choices: [{ text: '🎭 جشن بگیر (۵۰ طلا)', callback: 'k1', effect: { gold: -50, happiness: 15 } }, { text: '🚫 اخراج', callback: 'k0', effect: { happiness: -5 } }, { text: '😐 بی‌تفاوت', callback: 'k9', effect: {} }] },
        { title: '🎵 درخواست نوازنده', desc: '"بذارید موسیقی شاد بیارم!"', choices: [{ text: '🎶 جشن (۱۰۰ طلا)', callback: 'k1', effect: { gold: -100, happiness: 20 } }, { text: '🎤 فقط امشب (۳۰ طلا)', callback: 'k2', effect: { gold: -30, happiness: 10 } }, { text: '😤 ساکت', callback: 'k0', effect: { happiness: -5 } }] },
        { title: '🌾 دهقان با بذر', desc: '"بذر جدید دارم!"', choices: [{ text: '🌱 بخر (۲۰۰ طلا)', callback: 'k1', effect: { gold: -200, food: 100 } }, { text: '🤝 شریک شو', callback: 'k2', effect: { gold: -50, food: 50 } }, { text: '😤 نه', callback: 'k0', effect: {} }] },
        { title: '🎯 شکارچی', desc: '"سر دشمنت رو آوردم!"', choices: [{ text: '💰 جایزه (۲۰۰ طلا)', callback: 'k1', effect: { gold: -200, safety: 10 } }, { text: '👑 مدال بده', callback: 'k2', effect: { happiness: 10 } }, { text: '😤 خودت کشتی؟', callback: 'k0', effect: {} }] },
        { title: '💰 خزانه‌دار', desc: 'شاهم! هزینه‌های قصر زیاده...', choices: [{ text: '📊 کم کن', callback: 'k1', effect: { gold: 30 } }, { text: '💰 از مردم بگیر', callback: 'k2', effect: { gold: 50, happiness: -10 } }, { text: '✅ باشه', callback: 'k9', effect: {} }] },
        { title: '⚔️ فرمانده نظامی', desc: 'دشمنان نزدیک مرزها دیده شدن!', choices: [{ text: '🛡️ تقویت ارتش (۱۵۰ طلا)', callback: 'k1', effect: { gold: -150, safety: 15 } }, { text: '🤝 مذاکره (۵۰ طلا)', callback: 'k2', effect: { gold: -50 } }, { text: '😤 بعداً', callback: 'k0', effect: { safety: -10 } }] },
        { title: '🕵️ جاسوس', desc: '"یکی از درباریان خیانت می‌کنه..."', choices: [{ text: '🔍 تحقیق (۵۰ طلا)', callback: 'k1', effect: { gold: -50, justice: 15 } }, { text: '🚫 بی‌خیال', callback: 'k9', effect: {} }, { text: '😡 بازجویی', callback: 'k0', effect: { happiness: -15 } }] },
        { title: '🏥 طبیب', desc: '"بیماری بین مردم پیچیده!"', choices: [{ text: '💊 دارو (۱۵۰ طلا)', callback: 'k1', effect: { gold: -150, happiness: 15 } }, { text: '🏥 بیمارستان (۳۰۰ طلا)', callback: 'k2', effect: { gold: -300, safety: 10 } }, { text: '😤 خودشون خوب میشن', callback: 'k0', effect: { happiness: -20 } }] },
        { title: '📚 معلم', desc: '"مدرسه می‌خوام بسازم!"', choices: [{ text: '🏫 حمایت (۲۵۰ طلا)', callback: 'k1', effect: { gold: -250, happiness: 20 } }, { text: '📖 کتاب (۵۰ طلا)', callback: 'k2', effect: { gold: -50, happiness: 5 } }, { text: '😤 لازم نیست', callback: 'k0', effect: { happiness: -10 } }] },
        { title: '💧 مهندس', desc: '"قنات‌ها خراب شدن!"', choices: [{ text: '🔧 تعمیر (۱۵۰ طلا)', callback: 'k1', effect: { gold: -150, happiness: 10 } }, { text: '⛲ قنات جدید (۳۰۰ طلا)', callback: 'k2', effect: { gold: -300, happiness: 20 } }, { text: '😤 صبر کنن', callback: 'k0', effect: { happiness: -15 } }] },
        { title: '📜 مورخ', desc: '"می‌خوام تاریخت رو بنویسم!"', choices: [{ text: '📚 حمایت (۱۰۰ طلا)', callback: 'k1', effect: { gold: -100, faith: 10 } }, { text: '🤝 باشه', callback: 'k9', effect: {} }, { text: '😤 لازم نیست', callback: 'k0', effect: {} }] },
        { title: '🏰 معمار', desc: '"برج دیده‌بانی می‌سازم!"', choices: [{ text: '🗼 بساز (۴۰۰ طلا)', callback: 'k1', effect: { gold: -400, safety: 20 } }, { text: '🏠 کوچیکتر (۱۵۰ طلا)', callback: 'k2', effect: { gold: -150, safety: 10 } }, { text: '😤 بعداً', callback: 'k0', effect: {} }] },
        { title: '👸 ملکه - جواهر', desc: '"شوهرم... جواهر می‌خوام..."', choices: [{ text: '💍 بخر (۲۰۰ طلا)', callback: 'k1', effect: { gold: -200, queenMood: 30 } }, { text: '💋 بعداً', callback: 'k2', effect: { queenMood: -10 } }, { text: '😤 نه!', callback: 'k0', effect: { queenMood: -25 } }] },
        { title: '👸 ملکه بی‌تاب', desc: '"شوهرم... امشب داغم..."', choices: [{ text: '🔥 میام الان', callback: 'k1', effect: { queenMood: 40 } }, { text: '💋 فردا', callback: 'k2', effect: { queenMood: -15 } }, { text: '😤 شلوغه', callback: 'k0', effect: { queenMood: -30 } }] },
        { title: '👸 حسادت ملکه', desc: '"باز رفتی پیش اون کنیز؟!"', choices: [{ text: '💋 تو رو بیشتر دوست دارم', callback: 'k1', effect: { queenMood: 25, gold: -100 } }, { text: '😤 فضولی نکن', callback: 'k0', effect: { queenMood: -35 } }, { text: '🤐 سکوت', callback: 'k9', effect: { queenMood: -10 } }] },
        { title: '👸 ملکه در حمام', desc: '"شاهم... بیا تو حمام..."', choices: [{ text: '🛁 میام', callback: 'k1', effect: { queenMood: 35 } }, { text: '💋 بعدش بیا', callback: 'k2', effect: { queenMood: 15 } }, { text: '😤 حوصله ندارم', callback: 'k0', effect: { queenMood: -25 } }] },
        { title: '👸 ملکه و لباس', desc: '"لباس جدید پوشیدم... واسه تو..."', choices: [{ text: '👗 بذار ببینم', callback: 'k1', effect: { queenMood: 30, gold: -150 } }, { text: '🔥 درش بیار', callback: 'k2', effect: { queenMood: 40 } }, { text: '😐 قشنگه', callback: 'k9', effect: { queenMood: -10 } }] },
        { title: '👸 ملکه مست', desc: '"شوهرم... شراب خوردم..."', choices: [{ text: '🍷 منم می‌خورم', callback: 'k1', effect: { queenMood: 25 } }, { text: '💋 بیا اینجا', callback: 'k2', effect: { queenMood: 35 } }, { text: '😤 برو بخواب', callback: 'k0', effect: { queenMood: -20 } }] },
        { title: '👸 ملکه و الماس', desc: '"الماس بزرگ می‌خوام..."', choices: [{ text: '💎 بخر (۵۰۰ طلا)', callback: 'k1', effect: { gold: -500, queenMood: 50 } }, { text: '💍 کوچیکتر (۲۰۰ طلا)', callback: 'k2', effect: { gold: -200, queenMood: 20 } }, { text: '😤 بعداً', callback: 'k0', effect: { queenMood: -30 } }] },
        { title: '👸 ملکه در باغ', desc: '"توی باغ... فقط من و تو..."', choices: [{ text: '🌸 میام', callback: 'k1', effect: { queenMood: 30 } }, { text: '🔥 یه جای خلوت', callback: 'k2', effect: { queenMood: 40 } }, { text: '😤 مشغولم', callback: 'k0', effect: { queenMood: -15 } }] },
        { title: '👸 تهدید ملکه', desc: '"اگه نیای... با یکی دیگه می‌خوابم!"', choices: [{ text: '🔥 الان میام', callback: 'k1', effect: { queenMood: 35 } }, { text: '😡 جرات داری؟', callback: 'k0', effect: { queenMood: -40 } }, { text: '😤 برو', callback: 'k0', effect: { queenMood: -50 } }] },
        { title: '👸 ملکه باردار', desc: '"شوهرم... من حامله‌ام..."', choices: [{ text: '👶 عالیه! جشن', callback: 'k1', effect: { queenMood: 50, gold: -200 } }, { text: '💋 مراقب باش', callback: 'k2', effect: { queenMood: 30 } }, { text: '😐 خوبه', callback: 'k9', effect: { queenMood: -20 } }] },
        { title: '👸 ملکه عصبانی', desc: '"چرا دیشب نیومدی؟!"', choices: [{ text: '💋 ببخش', callback: 'k1', effect: { queenMood: 20, gold: -100 } }, { text: '😤 سرم شلوغ بود', callback: 'k0', effect: { queenMood: -30 } }, { text: '🤷‍♂️ هرجور راحتی', callback: 'k9', effect: { queenMood: -40 } }] },
        { title: '👸 ملکه و پرستار', desc: '"مریضم... پرستار می‌خوام..."', choices: [{ text: '💊 میام درمانت', callback: 'k1', effect: { queenMood: 25 } }, { text: '👩‍⚕️ پرستار می‌فرستم', callback: 'k2', effect: { gold: -30 } }, { text: '😤 خودت خوب میشی', callback: 'k0', effect: { queenMood: -25 } }] },
        { title: '👸 ملکه و رقاصی', desc: '"برات می‌رقصم..."', choices: [{ text: '💃 برقص', callback: 'k1', effect: { queenMood: 30 } }, { text: '🔥 با هم', callback: 'k2', effect: { queenMood: 40 } }, { text: '😐 بعداً', callback: 'k9', effect: { queenMood: -15 } }] },
        { title: '👸 ملکه و نامه', desc: '"برات نامه نوشتم..."', choices: [{ text: '💌 بخونم', callback: 'k1', effect: { queenMood: 20 } }, { text: '💋 جواب می‌دم', callback: 'k2', effect: { queenMood: 35 } }, { text: '😐 بذار کنار', callback: 'k9', effect: { queenMood: -20 } }] },
        { title: '👸 ملکه و هدیه', desc: '"برات یه هدیه آوردم..."', choices: [{ text: '🎁 مرسی', callback: 'k1', effect: { queenMood: 25 } }, { text: '💎 منم جواهر خریدم', callback: 'k2', effect: { queenMood: 45, gold: -200 } }, { text: '😐 باشه', callback: 'k9', effect: { queenMood: -10 } }] },
        { title: '🤴 ولیعهد', desc: '"پدر! مسئولیت بیشتر می‌خوام..."', choices: [{ text: '👑 وزیرش کن', callback: 'k1', effect: { heirPower: 20 } }, { text: '📚 آموزش (۵۰ طلا)', callback: 'k2', effect: { gold: -50 } }, { text: '😤 هنوز زوده', callback: 'k0', effect: { heirLoyalty: -10 } }] },
        { title: '🗡️ شوالیه', desc: '"می‌خوام شکار اژدها برم!"', choices: [{ text: '🛡️ تجهیز کن (۲۰۰ طلا)', callback: 'k1', effect: { gold: -200, safety: 10 } }, { text: '🤝 موفق باشی', callback: 'k9', effect: {} }, { text: '😤 خطرناکه', callback: 'k0', effect: {} }] },
        { title: '🌍 سفیر خارجی', desc: 'سفیر یه امپراطوری دیگه اومده!', choices: [{ text: '🤝 استقبال گرم (۲۰۰ طلا)', callback: 'k1', effect: { gold: -200, happiness: 10 } }, { text: '😐 ساده', callback: 'k9', effect: {} }, { text: '🚫 اخراج', callback: 'k0', effect: { safety: 10 } }] },
        { title: '🕊️ صلح', desc: '"پیشنهاد صلح داریم..."', choices: [{ text: '🤝 قبول', callback: 'k1', effect: { safety: 15, happiness: 20 } }, { text: '💰 غرامت (۳۰۰ طلا)', callback: 'k2', effect: { gold: 300 } }, { text: '😤 رد کن', callback: 'k0', effect: { safety: -10 } }] },
        { title: '🏴‍☠️ دزد دریایی', desc: '"گنج بزرگ می‌دونم کجاست..."', choices: [{ text: '🔍 بگو', callback: 'k1', effect: { gold: 100 } }, { text: '💰 آزادش کن', callback: 'k2', effect: {} }, { text: '💀 اعدام', callback: 'k0', effect: { justice: 5 } }] },
        { title: '🔮 پیشگو', desc: '"آینده رو دیدم..."', choices: [{ text: '👂 گوش بده (۵۰ طلا)', callback: 'k1', effect: { gold: -50, faith: 15 } }, { text: '😂 مسخرش کن', callback: 'k0', effect: { faith: -10 } }, { text: '🚫 بنداز بیرون', callback: 'k0', effect: {} }] },
        { title: '⚡ منجم', desc: '"خسوف در راهه!"', choices: [{ text: '🙏 دعا کن', callback: 'k1', effect: { faith: 15 } }, { text: '🎉 جشن بگیر', callback: 'k2', effect: { gold: -50, happiness: 10 } }, { text: '😂 خرافاته', callback: 'k0', effect: { faith: -10 } }] },
        { title: '🧙‍♂️ کیمیاگر', desc: '"طلسم جدید ساختم!"', choices: [{ text: '🧪 امتحان کن (۱۰۰ طلا)', callback: 'k1', effect: { gold: -100 } }, { text: '💰 بفروش', callback: 'k2', effect: { gold: 150 } }, { text: '😤 خطرناکه', callback: 'k0', effect: {} }] },
        { title: '🧝‍♀️ جن', desc: '"۳ تا آرزو داری..."', choices: [{ text: '💰 ثروت (۲۰۰ طلا)', callback: 'k1', effect: { gold: 200 } }, { text: '⚔️ قدرت', callback: 'k2', effect: { safety: 10 } }, { text: '😊 خوشبختی', callback: 'k3', effect: { happiness: 25 } }] },
        { title: '⛪ کشیش', desc: '"معبد نیاز به بازسازی داره..."', choices: [{ text: '🙏 کمک کن (۲۰۰ طلا)', callback: 'k1', effect: { gold: -200, faith: 20 } }, { text: '🤝 بعداً', callback: 'k9', effect: {} }, { text: '😤 نه', callback: 'k0', effect: { faith: -10 } }] },
        { title: '🐪 تاجر', desc: '"کاروان تجاری آماده سفر!"', choices: [{ text: '💰 سرمایه‌گذاری (۳۰۰ طلا)', callback: 'k1', effect: { gold: -300 } }, { text: '🤝 شراکت (۱۰۰ طلا)', callback: 'k2', effect: { gold: -100 } }, { text: '😤 نه', callback: 'k0', effect: {} }] },
        { title: '👨‍🔧 آهنگر', desc: '"ابزار جنگی می‌تونم بسازم!"', choices: [{ text: '⚒️ سفارش بده (۱۰۰ طلا)', callback: 'k1', effect: { gold: -100 } }, { text: '💰 بفروش', callback: 'k2', effect: { gold: 50 } }, { text: '😤 نه', callback: 'k0', effect: {} }] },
        { title: '💍 جواهرساز', desc: '"الماس کمیاب پیدا کردم!"', choices: [{ text: '💎 بخر (۵۰۰ طلا)', callback: 'k1', effect: { gold: -500, diamond: 2 } }, { text: '💰 بفروش', callback: 'k2', effect: { gold: 300 } }, { text: '😤 گرونه', callback: 'k0', effect: {} }] },
        { title: '🦅 شاهین‌دار', desc: '"عقاب کمیاب شکار کردم!"', choices: [{ text: '🦅 بخر (۱۵۰ طلا)', callback: 'k1', effect: { gold: -150 } }, { text: '🤝 آزادش کن', callback: 'k2', effect: { faith: 5 } }, { text: '😐 بعداً', callback: 'k9', effect: {} }] },
        { title: '🐺 حمله گرگ‌ها', desc: 'گرگ‌ها به روستا حمله کردن!', choices: [{ text: '⚔️ سرباز بفرست', callback: 'k1', effect: { safety: 15 } }, { text: '💰 جایزه (۱۰۰ طلا)', callback: 'k2', effect: { gold: -100 } }, { text: '😤 خودشون حل کنن', callback: 'k0', effect: { happiness: -15 } }] },
        { title: '🎉 جشن', desc: 'مردم می‌خوان جشن بگیرن!', choices: [{ text: '🎊 بزرگ (۳۰۰ طلا)', callback: 'k1', effect: { gold: -300, happiness: 30 } }, { text: '🎈 کوچیک (۱۰۰ طلا)', callback: 'k2', effect: { gold: -100, happiness: 15 } }, { text: '😤 نه', callback: 'k0', effect: { happiness: -20 } }] }
    ];
}

// =============================================
// 🎭 هندلر تصمیم‌های ملاقات
// =============================================
bot.on('callback_query', async (query) => {
    const chatId = query.message.chat.id;
    const msgId = query.message.message_id;
    const data = query.data;
    const p = player.getPlayer(chatId);
    if (!p || !data || (!data.startsWith('a') && !data.startsWith('k'))) return;

    const state = audienceStates[chatId];
    if (!state?.currentAudience) return bot.answerCallbackQuery(query.id, { text: '❌ ملاقات تموم شد!' });

    const aud = state.currentAudience;
    const choice = aud.choices.find(c => c.callback === data);
    if (!choice) return bot.answerCallbackQuery(query.id);

    const eff = choice.effect || {};
    if (eff.gold) p.inventory.gold = Math.max(0, (p.inventory.gold || 0) + eff.gold);
    if (eff.food) p.inventory.food = Math.max(0, (p.inventory.food || 0) + eff.food);
    if (eff.water) p.inventory.water = Math.max(0, (p.inventory.water || 0) + eff.water);
    if (eff.meat) p.inventory.meat = Math.max(0, (p.inventory.meat || 0) + eff.meat);
    if (eff.wood) p.inventory.wood = Math.max(0, (p.inventory.wood || 0) + eff.wood);
    if (eff.diamond) p.inventory.diamond = (p.inventory.diamond || 0) + eff.diamond;
    if (eff.xp) p.xp = (p.xp || 0) + eff.xp;
    if (eff.hp) p.hp = Math.min((p.maxHp || 100), Math.max(1, (p.hp || 100) + eff.hp));
    if (eff.happiness && p.people) p.people.stats.happiness = Math.min(100, Math.max(0, (p.people.stats.happiness || 50) + eff.happiness));
    if (eff.faith && p.people) p.people.stats.faith = Math.min(100, Math.max(0, (p.people.stats.faith || 50) + eff.faith));
    if (eff.justice && p.people) p.people.stats.justice = Math.min(100, Math.max(0, (p.people.stats.justice || 50) + eff.justice));
    if (eff.safety && p.people) p.people.stats.safety = Math.min(100, Math.max(0, (p.people.stats.safety || 50) + eff.safety));
    if (eff.queenMood && p.harem?.queens?.length) { p.harem.queens[0].mood = Math.min(100, Math.max(0, (p.harem.queens[0].mood || 50) + eff.queenMood)); }
    if (eff.heirPower && p.children) { const h = p.children.find(c => c.isHeir); if (h) h.power = (h.power || 0) + eff.heirPower; }
    if (eff.heirLoyalty && p.children) { const h = p.children.find(c => c.isHeir); if (h) h.loyalty = Math.min(100, (h.loyalty || 0) + eff.heirLoyalty); }

    let result = '✅ انجام شد.';
    if (eff.xp) result += `\n✨ XP ${eff.xp > 0 ? '+' : ''}${eff.xp}`;
    if (eff.gold) result += `\n👑 طلا ${eff.gold > 0 ? '+' : ''}${eff.gold}`;

    await bot.editMessageText(`👑 *ملاقات*\n\n${aud.title}\n\n✅ *${choice.text}*\n${result}`, { chat_id: chatId, message_id: msgId, parse_mode: 'Markdown' });
    delete state.currentAudience;
    return bot.answerCallbackQuery(query.id, { text: '✅' });
});

// =============================================
// 🔙 برگشت
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

    const pCheck = player.getPlayer(chatId);
    if (pCheck?.isDead) {
        const daysPassed = (pCheck.gameDay || 1) - (pCheck.deathDay || 1);
        if (daysPassed < 2 && daysPassed >= 0) {
            return bot.sendMessage(chatId, `🏥 *هنوز زخمی هستی!*\n\n📅 ${2 - daysPassed} روز دیگه استراحت کن.`, mainMenu());
        }
    }

    if (isAdmin(chatId)) {
        let p = player.getPlayer(chatId);
        if (!p) { player.createPlayer(chatId, 'Admin 👑'); p = player.getPlayer(chatId); }
        if (!p) return;
        p.chatId = chatId;
        player.initAllSystems(p);
        if (adminState[chatId]?.step === 'amount') {
            const amount = parseInt(text);
            if (isNaN(amount) || amount <= 0) { bot.sendMessage(chatId, '❌ یه عدد وارد کن!', mainMenu()); return; }
            const target = player.getPlayer(adminState[chatId].targetId);
            if (!target) { delete adminState[chatId]; bot.sendMessage(chatId, '❌ کاربر آنلاین نیست!', mainMenu()); return; }
            target.inventory[adminState[chatId].item] = (target.inventory[adminState[chatId].item] || 0) + amount;
            bot.sendMessage(chatId, `🎁 +${amount} ${adminState[chatId].item}`, mainMenu());
            delete adminState[chatId]; return;
        }
        const args = text.split(' '); const cmd = args.shift()?.toLowerCase();
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
console.log('✅ ربات بقای باستانی - نسخه کامل با ۷۰ سناریو و ۱۴ هندلر آماده شد! 🎉👑🔥');