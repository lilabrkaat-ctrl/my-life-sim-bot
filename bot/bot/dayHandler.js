const { bot, player, mainMenu, sendPhoto } = require('./core');
const config = require('../config');

// =============================================
// 👑 دیتابیس ملاقات‌های درباری
// =============================================
const courtAudiences = [
    {
        id: 'hungry_farmers',
        title: '👨‍🌾 دهقانان گرسنه',
        description: 'قربان! محصولاتمون از بین رفته. مردم گرسنه‌ان... کمک کنین!',
        minLevel: 30,
        choices: [
            { text: '🍞 از انبار غله بده (۵۰ غذا)', callback: 'audience_food_50', effect: { food: -50, happiness: 20, hunger: 15 } },
            { text: '💰 پول بده خودشون بخرن (۱۰۰ طلا)', callback: 'audience_gold_100', effect: { gold: -100, happiness: 10 } },
            { text: '😤 "خودتون حل کنین!"', callback: 'audience_reject', effect: { happiness: -15, hunger: -10 } }
        ]
    },
    {
        id: 'tax_complaint',
        title: '📜 شکایت از مالیات',
        description: 'شاه بزرگ! مالیات‌ها سنگینه... مردم توان پرداخت ندارن.',
        minLevel: 32,
        choices: [
            { text: '📉 مالیات کمتر (-۲۰٪)', callback: 'audience_tax_lower', effect: { happiness: 15, gold: -30 } },
            { text: '⏸️ این ماه بخشیده بشه', callback: 'audience_tax_break', effect: { happiness: 25, gold: -50 } },
            { text: '😤 "باید پرداخت کنن!"', callback: 'audience_reject', effect: { happiness: -20, justice: -10 } }
        ]
    },
    {
        id: 'criminal_justice',
        title: '⚖️ محاکمه دزد',
        description: 'اعلی‌حضرت! یه دزد رو گرفتن. مردم می‌خوان اعدام بشه.',
        minLevel: 35,
        choices: [
            { text: '💀 اعدامش کنین', callback: 'audience_execute', effect: { justice: 10, safety: 15, happiness: -5 } },
            { text: '🔒 زندان ابد', callback: 'audience_jail', effect: { justice: 5, happiness: 5 } },
            { text: '🤝 عفو و بخشش', callback: 'audience_pardon', effect: { happiness: 10, justice: -5, faith: 10 } }
        ]
    },
    {
        id: 'treasurer_report',
        title: '💰 گزارش خزانه‌دار',
        description: 'شاهم! خزانه وضع خوبی داره. اما هزینه‌های قصر زیاده...',
        minLevel: 30,
        choices: [
            { text: '📊 هزینه‌ها رو کم کن', callback: 'audience_cut_costs', effect: { gold: 30, happiness: -5 } },
            { text: '💰 از مردم مالیات بگیر', callback: 'audience_collect_tax', effect: { gold: 50, happiness: -10 } },
            { text: '✅ "باشه، فعلاً هیچی"', callback: 'audience_ok', effect: {} }
        ]
    },
    {
        id: 'general_report',
        title: '⚔️ گزارش فرمانده نظامی',
        description: 'فرمانده: "دشمنان نزدیک مرزها دیده شدن! باید آماده باشیم."',
        minLevel: 33,
        choices: [
            { text: '🛡️ تقویت ارتش (۱۵۰ طلا)', callback: 'audience_military_150', effect: { gold: -150, military: 25, safety: 15 } },
            { text: '🤝 مذاکره صلح (۵۰ طلا)', callback: 'audience_peace', effect: { gold: -50, safety: -5 } },
            { text: '😤 "بعداً..."', callback: 'audience_reject', effect: { safety: -10, military: -5 } }
        ]
    },
    {
        id: 'spymaster_report',
        title: '🕵️ گزارش جاسوس ارشد',
        description: '"اطلاعات دارم که یکی از درباریان داره خیانت می‌کنه..."',
        minLevel: 38,
        choices: [
            { text: '🔍 تحقیق کن (۵۰ طلا)', callback: 'audience_investigate', effect: { gold: -50, intelligence: 20 } },
            { text: '🚫 بی‌خیال شو', callback: 'audience_ignore', effect: { intelligence: -10 } },
            { text: '😡 "همه رو بازجویی کن!"', callback: 'audience_interrogate', effect: { happiness: -15, justice: -5 } }
        ]
    },
    {
        id: 'queen_request',
        title: '👸 درخواست ملکه',
        description: 'ملکه: "شوهرم... یه جواهر جدید می‌خوام... لطفاً..."',
        minLevel: 30,
        choices: [
            { text: '💍 بخر براش (۲۰۰ طلا)', callback: 'audience_buy_jewelry', effect: { gold: -200, queenMood: 30, happiness: 5 } },
            { text: '💋 "بعداً می‌خرم عزیزم"', callback: 'audience_promise', effect: { queenMood: -10 } },
            { text: '😤 "نه!"', callback: 'audience_reject', effect: { queenMood: -25 } }
        ]
    },
    {
        id: 'heir_request',
        title: '🤴 درخواست ولیعهد',
        description: 'ولیعهد: "پدر! می‌خوام مسئولیت بیشتری داشته باشم..."',
        minLevel: 35,
        choices: [
            { text: '👑 بذار وزیر بشه', callback: 'audience_promote_heir', effect: { heirPower: 20, heirLoyalty: 15 } },
            { text: '📚 بفرستش آموزش (۵۰ طلا)', callback: 'audience_educate_heir', effect: { heirXp: 30, gold: -50 } },
            { text: '😤 "هنوز زوده"', callback: 'audience_reject', effect: { heirLoyalty: -10 } }
        ]
    },
    {
        id: 'foreign_diplomat',
        title: '🌍 سفیر خارجی',
        description: 'سفیر یه امپراطوری دیگه برای دیدار اومده!',
        minLevel: 40,
        choices: [
            { text: '🤝 استقبال گرم (۲۰۰ طلا)', callback: 'audience_welcome', effect: { gold: -200, prestige: 30, happiness: 10 } },
            { text: '😐 استقبال ساده', callback: 'audience_neutral', effect: { prestige: 5 } },
            { text: '🚫 اخراجش کن', callback: 'audience_reject', effect: { prestige: -20, military: 10 } }
        ]
    },
    {
        id: 'mysterious_prophecy',
        title: '🔮 پیشگویی مرموز',
        description: 'یه پیشگو ادعا می‌کنه آینده رو دیده...',
        minLevel: 36,
        choices: [
            { text: '👂 گوش بده (۵۰ طلا)', callback: 'audience_listen', effect: { gold: -50, faith: 15, wish: 1 } },
            { text: '😂 مسخرش کن', callback: 'audience_mock', effect: { faith: -10 } },
            { text: '🚫 بنداز بیرون', callback: 'audience_reject', effect: { faith: -5 } }
        ]
    },
    {
        id: 'festival_request',
        title: '🎉 درخواست جشن',
        description: 'مردم می‌خوان یه جشن بزرگ برگزار کنن!',
        minLevel: 30,
        choices: [
            { text: '🎊 جشن بزرگ (۳۰۰ طلا)', callback: 'audience_grand_festival', effect: { gold: -300, happiness: 30, faith: 10 } },
            { text: '🎈 جشن کوچیک (۱۰۰ طلا)', callback: 'audience_small_festival', effect: { gold: -100, happiness: 15 } },
            { text: '😤 "نیاز نیست"', callback: 'audience_reject', effect: { happiness: -20 } }
        ]
    },
    {
        id: 'healer_request',
        title: '🏥 درخواست طبیب',
        description: 'طبیب قصر: "بیماری بین مردم پیچیده! باید درمانشون کنیم."',
        minLevel: 34,
        choices: [
            { text: '💊 دارو بخر (۱۵۰ طلا)', callback: 'audience_buy_medicine', effect: { gold: -150, health: 20, happiness: 10 } },
            { text: '🏥 بیمارستان بساز (۳۰۰ طلا)', callback: 'audience_build_hospital', effect: { gold: -300, health: 30, safety: 10 } },
            { text: '😤 "خودشون خوب میشن"', callback: 'audience_reject', effect: { health: -15, happiness: -20 } }
        ]
    }
];

const audienceStates = {};

// =============================================
// 🎯 توابع ملاقات
// =============================================

function getRandomAudience(player) {
    const available = courtAudiences.filter(a => 
        player.level >= (a.minLevel || 30) && 
        (!audienceStates[player.chatId] || !audienceStates[player.chatId].recentAudiences || 
         !audienceStates[player.chatId].recentAudiences.includes(a.id))
    );
    
    if (available.length === 0) return null;
    
    const audience = available[Math.floor(Math.random() * available.length)];
    
    if (!audienceStates[player.chatId]) audienceStates[player.chatId] = { recentAudiences: [] };
    audienceStates[player.chatId].recentAudiences.push(audience.id);
    
    if (audienceStates[player.chatId].recentAudiences.length > 5) {
        audienceStates[player.chatId].recentAudiences.shift();
    }
    
    return audience;
}

function applyAudienceEffect(player, effect) {
    if (!effect || Object.keys(effect).length === 0) return '✅ تغییری نکرد.';
    
    let result = '';
    
    if (effect.food) { 
        if (!player.inventory) player.inventory = {};
        player.inventory.food = (player.inventory.food || 0) + effect.food; 
        result += `\n🍞 غذا ${effect.food > 0 ? '+' : ''}${effect.food}`; 
    }
    if (effect.gold) { 
        player.inventory.gold = Math.max(0, (player.inventory.gold || 0) + effect.gold); 
        result += `\n👑 طلا ${effect.gold > 0 ? '+' : ''}${effect.gold}`; 
    }
    if (effect.happiness) { 
        if (player.people && player.people.stats) {
            player.people.stats.happiness = Math.min(100, Math.max(0, (player.people.stats.happiness || 50) + effect.happiness));
            result += `\n😊 خوشبختی ${effect.happiness > 0 ? '+' : ''}${effect.happiness}`;
        }
    }
    if (effect.hunger) {
        if (player.people && player.people.stats) {
            player.people.stats.hunger = Math.min(100, Math.max(0, (player.people.stats.hunger || 50) + effect.hunger));
            result += `\n🍞 سیری ${effect.hunger > 0 ? '+' : ''}${effect.hunger}`;
        }
    }
    if (effect.justice) {
        if (player.people && player.people.stats) {
            player.people.stats.justice = Math.min(100, Math.max(0, (player.people.stats.justice || 50) + effect.justice));
            result += `\n⚖️ عدالت ${effect.justice > 0 ? '+' : ''}${effect.justice}`;
        }
    }
    if (effect.faith) {
        if (player.people && player.people.stats) {
            player.people.stats.faith = Math.min(100, Math.max(0, (player.people.stats.faith || 50) + effect.faith));
            result += `\n🙏 ایمان ${effect.faith > 0 ? '+' : ''}${effect.faith}`;
        }
    }
    if (effect.safety) {
        if (player.people && player.people.stats) {
            player.people.stats.safety = Math.min(100, Math.max(0, (player.people.stats.safety || 50) + effect.safety));
            result += `\n🛡️ امنیت ${effect.safety > 0 ? '+' : ''}${effect.safety}`;
        }
    }
    if (effect.health) {
        if (player.people && player.people.stats) {
            player.people.stats.health = Math.min(100, Math.max(0, (player.people.stats.health || 50) + effect.health));
            result += `\n❤️ سلامت ${effect.health > 0 ? '+' : ''}${effect.health}`;
        }
    }
    if (effect.military) result += `\n⚔️ قدرت نظامی ${effect.military > 0 ? '+' : ''}${effect.military}`;
    if (effect.intelligence) result += `\n🧠 اطلاعات ${effect.intelligence > 0 ? '+' : ''}${effect.intelligence}`;
    if (effect.prestige) { 
        player.score = (player.score || 0) + effect.prestige; 
        result += `\n🏆 اعتبار ${effect.prestige > 0 ? '+' : ''}${effect.prestige}`; 
    }
    if (effect.wish) { 
        player.inventory.wish = (player.inventory.wish || 0) + effect.wish; 
        result += `\n🔮 آرزو +${effect.wish}`; 
    }
    if (effect.queenMood && player.harem && player.harem.queens && player.harem.queens.length > 0) {
        const mainQueen = player.harem.queens.find(q => q.rank === 'main_queen') || player.harem.queens[0];
        if (mainQueen) {
            mainQueen.mood = Math.min(100, Math.max(0, (mainQueen.mood || 50) + effect.queenMood));
            result += `\n👸 ملکه ${effect.queenMood > 0 ? '+' : ''}${effect.queenMood}`;
        }
    }
    if (effect.heirPower || effect.heirLoyalty || effect.heirXp) {
        const heir = player.children?.find(c => c.isAlive && c.isHeir);
        if (heir) {
            if (effect.heirPower) { heir.power = (heir.power || 0) + effect.heirPower; result += `\n💪 ولیعهد +${effect.heirPower} قدرت`; }
            if (effect.heirLoyalty) { heir.loyalty = Math.min(100, (heir.loyalty || 0) + effect.heirLoyalty); result += `\n💕 وفاداری ولیعهد +${effect.heirLoyalty}`; }
            if (effect.heirXp) { heir.xp = (heir.xp || 0) + effect.heirXp; result += `\n✨ XP ولیعهد +${effect.heirXp}`; }
        }
    }
    
    return result || '✅ انجام شد.';
}

function getAudienceKeyboard(audience) {
    const buttons = [];
    for (let choice of audience.choices) {
        buttons.push([{ text: choice.text, callback_data: choice.callback }]);
    }
    return { reply_markup: { inline_keyboard: buttons } };
}
// =============================================
// 📅 سیستم روز بعد
// =============================================
function setupDayHandler() {

    // ============ دکمه 📅 روز بعد ============
    bot.onText(/^📅 روز بعد$/, async (msg) => {
        const chatId = msg.chat.id;
        const p = player.getPlayer(chatId);
        if (!p) return bot.sendMessage(chatId, '❌ /start بزن!', mainMenu());

        p.gameDay = (p.gameDay || 1) >= 7 ? 1 : (p.gameDay || 1) + 1;
        
        let events = [];
        let births = [];

        // 1️⃣ ریست ماموریت‌ها
        try { const { generateDailyQuests } = require('../dailyQuest'); generateDailyQuests(p); events.push('📋 ماموریت‌های جدید'); } catch(e) {}

        // 2️⃣ ریست بازار مکاره
        try { const { refreshBlackMarket } = require('../blackMarket'); refreshBlackMarket(p); events.push('🕶️ بازار مکاره بروز شد'); } catch(e) {}

        // 3️⃣ چک تولد بچه‌های معمولی
        try {
            const { checkBirths } = require('../offspring');
            const normalBirths = checkBirths(p);
            if (normalBirths && normalBirths.length > 0) {
                for (let child of normalBirths) births.push({ name: child.name, emoji: child.emoji, mother: 'همسر' });
            }
        } catch(e) {}

        // 4️⃣ چک تولد بچه‌های حرمسرا
        try {
            const { checkHaremBirths } = require('../queenHarem');
            const haremBirths = checkHaremBirths(p);
            if (haremBirths && haremBirths.length > 0) {
                for (let birth of haremBirths) {
                    births.push({ name: birth.child.name, emoji: birth.child.emoji, mother: birth.queen.name, motherEmoji: birth.queen.emoji });
                }
            }
        } catch(e) {}

        // 5️⃣ آپدیت سن فرزندان
        try {
            const { updateChildAges } = require('../offspring');
            const ageUpdates = updateChildAges(p);
            if (ageUpdates && ageUpdates.length > 0) {
                for (let update of ageUpdates) events.push(`🎂 ${update.child.name} ${update.newStage} شد`);
            }
        } catch(e) {}

        // 6️⃣ چک فرار زندانی‌ها
        try {
            const { checkEscapes } = require('../prison');
            const escaped = checkEscapes(p);
            if (escaped && escaped.length > 0) {
                for (let prisoner of escaped) events.push(`🏃 ${prisoner.name} از زندان فرار کرد`);
            }
        } catch(e) {}

        // 7️⃣ چک دربار
        try {
            const { updateCourtAlerts } = require('../court');
            const courtEscapes = updateCourtAlerts(p);
            if (courtEscapes && courtEscapes.length > 0) {
                for (let prisoner of courtEscapes) events.push(`🔒 ${prisoner.name} از زندان درباری فرار کرد`);
            }
        } catch(e) {}

        // 8️⃣ گرسنگی حیوانات
        try { const { autoFeedCheck } = require('../pet'); const hungry = autoFeedCheck(p); if (hungry) events.push(`🍖 ${hungry}`); } catch(e) {}

        // 9️⃣ اعتیاد
        try { const { checkAddiction } = require('../secretChamber'); const addiction = checkAddiction(p); if (addiction) events.push(addiction.message); } catch(e) {}

        // 🔟 آپدیت مردم
        try {
            const { updatePopulation } = require('../people');
            const popEvents = updatePopulation(p);
            if (popEvents && popEvents.length > 0) for (let event of popEvents) events.push(event);
        } catch(e) {}

        // 1️⃣1️⃣ کول‌داون دسیسه‌ها
        if (p.court && p.court.intrigueCooldowns) {
            for (let key in p.court.intrigueCooldowns) {
                if (Date.now() - p.court.intrigueCooldowns[key] > 86400000) delete p.court.intrigueCooldowns[key];
            }
        }

        // 🌅 زمان
        const time = require('../player').getTimeOfDay();
        p.timeOfDay = time;
        const loc = config.images.locations[p.location] || config.images.locations.village;

        // 👶 ارسال پیام تولدها
        for (let birth of births) {
            const momInfo = birth.motherEmoji ? ` از ${birth.motherEmoji} *${birth.mother}*` : '';
            try {
                const { getBirthImage } = require('../offspring');
                const img = getBirthImage();
                if (img) await sendPhoto(chatId, img, `👶 *${birth.name}* ${birth.emoji}${momInfo} به دنیا اومد! 🎉`, mainMenu());
                else await bot.sendMessage(chatId, `👶 *${birth.name}* ${birth.emoji}${momInfo} به دنیا اومد! 🎉`, { parse_mode: 'Markdown' });
            } catch(e) {
                await bot.sendMessage(chatId, `👶 *${birth.name}* ${birth.emoji}${momInfo} به دنیا اومد! 🎉`, { parse_mode: 'Markdown' });
            }
        }

        // 🏃 ارسال پیام فرارها
        const escapeEvents = events.filter(e => e.includes('فرار کرد'));
        for (let event of escapeEvents) {
            await bot.sendMessage(chatId, `⚠️ ${event}`, { parse_mode: 'Markdown' });
        }

        // 📱 پیام اصلی
        let msg = `📅 *روز ${p.gameDay}/۷*\n\n`;
        msg += `${time.name} | 🏆 ${p.score || 0} امتیاز\n`;
        msg += `📍 ${loc.emoji} ${loc.name}\n\n`;
        
        const otherEvents = events.filter(e => !e.includes('فرار کرد'));
        if (otherEvents.length > 0) {
            msg += `📋 *اتفاقات امروز:*\n`;
            for (let event of otherEvents) msg += `• ${event}\n`;
        } else if (births.length === 0 && escapeEvents.length === 0) {
            msg += `✅ روز آرومی بود...`;
        }
        await bot.sendMessage(chatId, msg, { parse_mode: 'Markdown', ...mainMenu() });

        // 👑 ملاقات درباری (از سطح ۳۰)
        if (p.level >= 30) {
            const audience = getRandomAudience(p);
            if (audience) {
                if (!audienceStates[chatId]) audienceStates[chatId] = { recentAudiences: [] };
                audienceStates[chatId].currentAudience = audience;
                
                await bot.sendMessage(chatId, 
                    `👑 *ملاقات درباری - روز ${p.gameDay}*\n\n` +
                    `${audience.title}\n\n` +
                    `💬 "${audience.description}"\n\n` +
                    `🤔 *تصمیم شما چیه؟*`,
                    { parse_mode: 'Markdown', ...getAudienceKeyboard(audience) }
                );
            }
        }

        // ذخیره
        try { const { savePlayers } = require('../storage'); savePlayers(player.players); } catch(e) {}
    });

    // ============ 🎭 هندلر تصمیم‌های ملاقات ============
    bot.on('callback_query', async (query) => {
        const chatId = query.message.chat.id;
        const msgId = query.message.message_id;
        const data = query.data;
        const p = player.getPlayer(chatId);
        
        if (!p || !data || !data.startsWith('audience_')) return;
        
        const state = audienceStates[chatId];
        if (!state || !state.currentAudience) {
            return bot.answerCallbackQuery(query.id, { text: '❌ ملاقات تموم شده!' });
        }
        
        const audience = state.currentAudience;
        const choice = audience.choices.find(c => c.callback === data);
        if (!choice) return bot.answerCallbackQuery(query.id);
        
        const effectResult = applyAudienceEffect(p, choice.effect);
        
        await bot.editMessageText(
            `👑 *ملاقات درباری*\n\n` +
            `${audience.title}\n\n` +
            `✅ *تصمیم:* ${choice.text.split(')')[0]})\n` +
            `${effectResult}`,
            { chat_id: chatId, message_id: msgId, parse_mode: 'Markdown' }
        );
        
        delete state.currentAudience;
        return bot.answerCallbackQuery(query.id, { text: '✅ انجام شد!' });
    });
}

module.exports = { setupDayHandler };