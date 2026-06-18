// diplomacy.js - سیستم دیپلماسی ایران (نسخه سخت)

const { LOCKS } = require('./config');

// ============================================
// 🤝 عملیات‌های دیپلماتیک (سخت‌تر و با شانس شکست بیشتر)
// ============================================

/**
 * مذاکره با یک کشور
 */
function negotiate(state, countryCode, topic, level = 'ambassador') {
    const country = state.findCountry(countryCode);
    if (!country) return "❌ کشور پیدا نشد!";
    
    // قفل مذاکره با آمریکا
    if (countryCode === "US") {
        const lockCheck = state.canDo('negotiate_usa');
        if (!lockCheck.allowed) {
            return `❌ نمی‌تونی با آمریکا مذاکره کنی!\n${lockCheck.reasons.join('\n')}`;
        }
    }
    
    // هزینه‌ها (بیشتر)
    const costs = {
        expert: { budget: 0.3, relationMin: -40, risk: 5 },
        ambassador: { budget: 1, relationMin: -30, risk: 10 },
        minister: { budget: 3, relationMin: -15, risk: 20 },
        president: { budget: 8, relationMin: 0, risk: 35 }
    };
    
    const levelConfig = costs[level];
    if (!levelConfig) return "❌ سطح مذاکره نامعتبر!";
    
    if (country[4] < levelConfig.relationMin) {
        return `❌ روابط خیلی پایینه!\n📊 نیاز: ${levelConfig.relationMin}\nفعلی: ${country[4]}`;
    }
    
    if (state.budget_toman < levelConfig.budget) {
        return `❌ بودجه کافی نیست!\n💰 نیاز: ${levelConfig.budget} همت`;
    }
    
    state.budget_toman -= levelConfig.budget;
    
    // شانس موفقیت (کمتر)
    const baseChance = 40 + country[4] / 2 + (level === 'president' ? 15 : 0);
    const successChance = Math.min(85, baseChance);
    const success = Math.random() * 100 < successChance;
    
    let result = "";
    
    if (success) {
        const relationBoost = level === 'president' ? 15 : level === 'minister' ? 10 : level === 'ambassador' ? 5 : 2;
        country[4] = Math.min(100, country[4] + relationBoost);
        
        switch(topic) {
            case 'trade':
                country[5] += 0.8;
                state.gdp += 1.5;
                result = "🤝 توافق تجاری";
                break;
            case 'sanctions':
                state.sanctions = Math.max(0, state.sanctions - 8);
                result = "🔓 تحریم‌ها کاهش";
                break;
            case 'peace':
                state.israel_tension = Math.max(0, state.israel_tension - 12);
                result = "🕊️ توافق صلح";
                break;
            case 'alliance':
                state.popularity += 4;
                state.gdp += 4;
                result = "🤝 پیمان اتحاد";
                break;
            case 'nuclear':
                state.nuclear_percent = Math.max(3.67, state.nuclear_percent - 8);
                state.sanctions = Math.max(0, state.sanctions - 12);
                result = "⚛️ پیشرفت هسته‌ای";
                break;
            case 'prisoner':
                state.popularity += 4;
                result = "🔓 تبادل زندانیان";
                break;
            case 'water':
                state.popularity += 2;
                state.water_crisis -= 5;
                result = "💧 توافق آب";
                break;
            default:
                result = "🤝 مذاکره موفق";
        }
        
        state.addHistory(`🤝 مذاکره ${level} با ${country[0]} ${country[1]} - ${result}`);
        
        return `🤝 *مذاکره با ${country[1]} ${country[0]}*\n\n` +
               `📊 سطح: ${level}\n` +
               `✅ ${result}\n` +
               `📈 روابط: ${country[4]}/100\n` +
               `💰 هزینه: ${levelConfig.budget} همت`;
    } else {
        // شکست (عواقب بیشتر)
        country[4] = Math.max(-100, country[4] - 8);
        state.popularity -= 3;
        
        const failReasons = [
            "اختلاف نظر عمیق",
            "کارشکنی اسرائیل",
            "فشار آمریکا",
            "بدقولی طرف مقابل",
            "جاسوسی فاش شد",
            "توهین دیپلماتیک",
            "رسوایی در مذاکره"
        ];
        const reason = failReasons[Math.floor(Math.random() * failReasons.length)];
        
        state.addHistory(`❌ شکست مذاکره ${level} با ${country[0]} ${country[1]} - ${reason}`);
        
        return `❌ *مذاکره شکست خورد*\n\n` +
               `📊 سطح: ${level}\n` +
               `🚫 دلیل: ${reason}\n` +
               `📉 روابط: ${country[4]}/100\n` +
               `⚠️ محبوبیت -۳٪`;
    }
}

/**
 * مذاکره محرمانه (ریسک لو رفتن بیشتر)
 */
function secretNegotiation(state, countryCode) {
    const country = state.findCountry(countryCode);
    if (!country) return "❌ کشور پیدا نشد!";
    
    const cost = 0.5;
    state.budget_toman -= cost;
    
    // ریسک لو رفتن (بیشتر)
    const leakChance = 25;
    const leaked = Math.random() * 100 < leakChance;
    
    if (leaked) {
        country[4] = Math.max(-100, country[4] - 15);
        state.popularity -= 8;
        state.sanctions = Math.min(100, state.sanctions + 5);
        state.addHistory(`🚨 مذاکره محرمانه با ${country[0]} ${country[1]} لو رفت!`);
        
        return `🚨 *مذاکره محرمانه لو رفت!*\n\n` +
               `🇮🇷 ${country[1]} ${country[0]}\n` +
               `📉 روابط: ${country[4]}/100\n` +
               `⚠️ محبوبیت -۸٪\n` +
               `🚫 تحریم +۵\n` +
               `💀 رسوایی بزرگ!`;
    }
    
    country[4] = Math.min(100, country[4] + 6);
    state.popularity += 1;
    state.addHistory(`🤫 مذاکره محرمانه موفق با ${country[0]} ${country[1]}`);
    
    return `🤫 *مذاکره محرمانه*\n\n` +
           `${country[1]} ${country[0]}\n` +
           `📈 روابط: ${country[4]}/100\n` +
           `✅ بدون لو رفتن`;
}

/**
 * پیمان دفاعی (هزینه بیشتر)
 */
function defensePact(state, countryCode) {
    const country = state.findCountry(countryCode);
    if (!country) return "❌ کشور پیدا نشد!";
    
    if (country[4] < 60) {
        return `❌ روابط کافی نیست!\n📊 نیاز: ۶۰\nفعلی: ${country[4]}`;
    }
    
    const cost = 15;
    if (state.budget_toman < cost) {
        return `❌ بودجه کافی نیست!\n💰 نیاز: ${cost} همت`;
    }
    
    state.budget_toman -= cost;
    country[4] = Math.min(100, country[4] + 15);
    state.popularity += 4;
    state.gdp += 2;
    
    const usa = state.findCountry("US");
    if (usa) usa[4] = Math.max(-100, usa[4] - 20);
    
    state.addHistory(`🛡️ پیمان دفاعی با ${country[0]} ${country[1]}`);
    
    return `🛡️ *پیمان دفاعی با ${country[1]} ${country[0]}*\n\n` +
           `✅ اتحاد نظامی\n` +
           `📈 روابط: ${country[4]}/100\n` +
           `✅ محبوبیت +۴٪\n` +
           `⚠️ آمریکا خشمگین (-۲۰)`;
}

/**
 * پیمان تجاری
 */
function tradePact(state, countryCode) {
    const country = state.findCountry(countryCode);
    if (!country) return "❌ کشور پیدا نشد!";
    
    if (country[4] < 40) {
        return `❌ روابط کافی نیست!\n📊 نیاز: ۴۰\nفعلی: ${country[4]}`;
    }
    
    const cost = 5;
    state.budget_toman -= cost;
    country[4] = Math.min(100, country[4] + 8);
    country[5] += 4;
    state.gdp += 6;
    state.inflation -= 1;
    state.popularity += 2;
    
    state.addHistory(`💰 پیمان تجاری با ${country[0]} ${country[1]} (+۴ میلیارد دلار)`);
    
    return `💰 *پیمان تجاری با ${country[1]} ${country[0]}*\n\n` +
           `✅ تجارت +۴ میلیارد\n` +
           `📈 GDP +۶\n` +
           `📉 تورم -۱٪\n` +
           `✅ محبوبیت +۲٪`;
}

/**
 * قطع رابطه دیپلماتیک
 */
function cutRelations(state, countryCode) {
    const country = state.findCountry(countryCode);
    if (!country) return "❌ کشور پیدا نشد!";
    
    country[4] = -60;
    country[5] = Math.max(0, country[5] - 4);
    state.sanctions = Math.min(100, state.sanctions + 5);
    state.popularity += 1;
    state.gdp -= 2;
    
    state.addHistory(`🚫 قطع رابطه با ${country[0]} ${country[1]}`);
    
    return `🚫 *قطع رابطه با ${country[1]} ${country[0]}*\n\n` +
           `📉 روابط: ${country[4]}/100\n` +
           `💰 تجارت: ${country[5]} میلیارد\n` +
           `⚠️ تحریم +۵\n` +
           `📉 GDP -۲`;
}

/**
 * اخراج سفیر
 */
function expelAmbassador(state, countryCode) {
    const country = state.findCountry(countryCode);
    if (!country) return "❌ کشور پیدا نشد!";
    
    country[4] = Math.max(-100, country[4] - 25);
    state.popularity += 2;
    
    // واکنش متقابل
    if (Math.random() < 0.5) {
        state.addHistory(`👋 اخراج سفیر ${country[0]} ${country[1]} - آنها هم سفیر ما رو اخراج کردن`);
        return `👋 *سفیر ${country[1]} ${country[0]} اخراج شد*\n\n` +
               `📉 روابط: ${country[4]}/100\n` +
               `🔄 آنها هم سفیر ما رو اخراج کردن!`;
    }
    
    state.addHistory(`👋 اخراج سفیر ${country[0]} ${country[1]}`);
    return `👋 *سفیر ${country[1]} ${country[0]} اخراج شد*\n\n📉 روابط: ${country[4]}/100`;
}

/**
 * میانجی‌گری در جنگ دیگران
 */
function mediateConflict(state, country1Code, country2Code) {
    const country1 = state.findCountry(country1Code);
    const country2 = state.findCountry(country2Code);
    
    if (!country1 || !country2) return "❌ کشور پیدا نشد!";
    
    const cost = 4;
    state.budget_toman -= cost;
    
    // شانس موفقیت کمتر
    const success = Math.random() < 0.4;
    
    if (success) {
        country1[4] = Math.min(100, country1[4] + 8);
        country2[4] = Math.min(100, country2[4] + 8);
        state.popularity += 6;
        state.addHistory(`🕊️ میانجی‌گری موفق بین ${country1[0]} و ${country2[0]}`);
        
        return `🕊️ *میانجی‌گری موفق*\n\n` +
               `🇮🇷 ایران بین ${country1[1]} ${country1[0]} و ${country2[1]} ${country2[0]} صلح برقرار کرد\n` +
               `✅ محبوبیت +۶٪`;
    }
    
    state.popularity -= 3;
    state.addHistory(`❌ شکست میانجی‌گری بین ${country1[0]} و ${country2[0]}`);
    
    return `❌ *میانجی‌گری شکست خورد*\n\n⚠️ محبوبیت -۳٪`;
}

// ============================================
// 🚫 تحریم‌ها
// ============================================

/**
 * تحریم یک کشور
 */
function sanctionCountry(state, countryCode) {
    const country = state.findCountry(countryCode);
    if (!country) return "❌ کشور پیدا نشد!";
    
    country[4] = Math.max(-100, country[4] - 30);
    country[5] = Math.max(0, country[5] - 3);
    state.popularity += 3;
    state.gdp -= 2;
    state.inflation += 1;
    
    // واکنش متقابل
    if (Math.random() < 0.4) {
        state.sanctions = Math.min(100, state.sanctions + 3);
        state.addHistory(`🚫 ایران ${country[0]} ${country[1]} رو تحریم کرد - تحریم متقابل!`);
        return `🚫 *${country[1]} ${country[0]} تحریم شد*\n\n` +
               `📉 روابط: ${country[4]}/100\n` +
               `🔄 تحریم متقابل! +۳ تحریم`;
    }
    
    state.addHistory(`🚫 ایران ${country[0]} ${country[1]} رو تحریم کرد`);
    return `🚫 *${country[1]} ${country[0]} تحریم شد*\n\n📉 روابط: ${country[4]}/100`;
}

/**
 * دور زدن تحریم
 */
function evadeSanctions(state) {
    const cost = 2;
    state.budget_toman -= cost;
    
    // ریسک لو رفتن
    if (Math.random() < 0.2) {
        state.sanctions = Math.min(100, state.sanctions + 10);
        state.dollar_rate += 5000;
        state.addHistory("🔄 دور زدن تحریم - لو رفت! تحریم +۱۰");
        return `🔄 *دور زدن تحریم - لو رفت!*\n\n🚫 تحریم +۱۰\n💵 دلار +۵,۰۰۰`;
    }
    
    state.dollar_rate -= 2000;
    state.dollar_reserves += 0.3;
    state.sanctions = Math.max(0, state.sanctions - 2);
    
    state.addHistory("🔄 دور زدن تحریم موفق");
    return `🔄 *دور زدن تحریم*\n\n💵 دلار -۲,۰۰۰\n💰 +۰.۳ میلیارد دلار\n✅ تحریم -۲`;
}

/**
 * بستن تنگه هرمز (با قفل محبوبیت)
 */
function closeStraitOfHormuz(state) {
    // قفل
    const lockCheck = state.canDo('close_hormuz');
    if (!lockCheck.allowed) {
        return `❌ نمی‌تونی تنگه رو ببندی!\n${lockCheck.reasons.join('\n')}`;
    }
    
    state.dollar_rate += 30000;
    state.oil_price += 40;
    state.sanctions = 100;
    state.popularity += 8;
    state.israel_tension += 25;
    state.gdp -= 10;
    state.budget_toman -= 10;
    
    const persianGulfCountries = ["SA", "AE", "QA", "BH", "KW", "OM"];
    persianGulfCountries.forEach(code => {
        const country = state.findCountry(code);
        if (country) {
            country[4] = Math.max(-100, country[4] - 50);
            country[5] = 0;
        }
    });
    
    const usa = state.findCountry("US");
    if (usa) usa[4] = -100;
    
    state.addHistory("🚫 تنگه هرمز بسته شد! بحران جهانی");
    
    // احتمال جنگ (بیشتر)
    if (Math.random() < 0.6) {
        state.game_over = true;
        state.addHistory("💥 آمریکا به تنگه هرمز حمله کرد! بازی پایان یافت");
    }
    
    return `🚫 *تنگه هرمز بسته شد!*\n\n` +
           `⛽ نفت +۴۰ دلار\n` +
           `💵 دلار +۳۰,۰۰۰\n` +
           `🚫 تحریم: ۱۰۰٪\n` +
           `⚠️ احتمال جنگ: ۶۰٪!\n` +
           `✅ محبوبیت +۸٪`;
}

// ============================================
// 🌍 سازمان‌های بین‌المللی
// ============================================

/**
 * پذیرش FATF (با قفل مجلس)
 */
function acceptFATF(state) {
    if (state.fatf_accepted) {
        return "❌ قبلاً پذیرفته شده!";
    }
    
    const lockCheck = state.canDo('accept_fatf');
    if (!lockCheck.allowed) {
        return `❌ نمی‌تونی FATF رو بپذیری!\n${lockCheck.reasons.join('\n')}`;
    }
    
    state.fatf_accepted = true;
    state.sanctions = Math.max(0, state.sanctions - 18);
    state.dollar_rate -= 8000;
    state.budget_toman += 8;
    state.popularity -= 4;
    
    const eu = state.findCountry("DE");
    if (eu) eu[4] = Math.min(100, eu[4] + 12);
    
    state.addHistory("✅ ایران FATF را پذیرفت");
    
    return `✅ *FATF پذیرفته شد*\n\n` +
           `🔓 تحریم -۱۸\n` +
           `💵 دلار -۸,۰۰۰\n` +
           `💰 +۸ همت\n` +
           `⚠️ محبوبیت -۴٪`;
}

/**
 * شکایت به سازمان ملل
 */
function complainToUN(state, countryCode) {
    const country = state.findCountry(countryCode);
    if (!country) return "❌ کشور پیدا نشد!";
    
    const cost = 1;
    state.budget_toman -= cost;
    
    // شانس موفقیت
    if (Math.random() < 0.4) {
        country[4] = Math.max(-100, country[4] - 10);
        state.popularity += 3;
        state.addHistory(`📋 شکایت موفق از ${country[0]} ${country[1]} در سازمان ملل`);
        return `📋 *شکایت موفق*\n\n${country[1]} ${country[0]}\n✅ محکومیت بین‌المللی`;
    }
    
    state.popularity -= 1;
    state.addHistory(`📋 شکایت از ${country[0]} ${country[1]} رد شد`);
    return `📋 *شکایت رد شد*\n\n${country[1]} ${country[0]}\n❌ رأی نیاورد`;
}

// ============================================
// 🎁 کمک‌های بشردوستانه
// ============================================

/**
 * ارسال کمک به کشور دیگر
 */
function sendAid(state, countryCode, type = 'food') {
    const country = state.findCountry(countryCode);
    if (!country) return "❌ کشور پیدا نشد!";
    
    const cost = 1.5;
    
    if (state.budget_toman < cost) {
        return "❌ بودجه کافی نیست!";
    }
    
    state.budget_toman -= cost;
    country[4] = Math.min(100, country[4] + 12);
    state.popularity += 1;
    
    const aidTypes = {
        food: "🍞 مواد غذایی",
        medicine: "💊 دارو",
        money: "💰 کمک نقدی",
        rescue: "🚁 تیم امداد",
        oil: "🛢️ نفت رایگان"
    };
    
    const aidName = aidTypes[type] || type;
    
    state.addHistory(`🎁 ارسال ${aidName} به ${country[0]} ${country[1]}`);
    
    return `🎁 *کمک به ${country[1]} ${country[0]}*\n\n` +
           `📦 نوع: ${aidName}\n` +
           `📈 روابط: ${country[4]}/100\n` +
           `✅ محبوبیت +۱٪`;
}

// ============================================
// 📤 خروجی
// ============================================
module.exports = {
    negotiate,
    secretNegotiation,
    defensePact,
    tradePact,
    cutRelations,
    expelAmbassador,
    mediateConflict,
    sanctionCountry,
    evadeSanctions,
    closeStraitOfHormuz,
    acceptFATF,
    complainToUN,
    sendAid
};