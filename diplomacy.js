// diplomacy.js - سیستم دیپلماسی ایران

// ============================================
// 🤝 عملیات‌های دیپلماتیک
// ============================================

/**
 * مذاکره با یک کشور
 * @param {string} level - سطح مذاکره: 'expert', 'ambassador', 'minister', 'president'
 */
function negotiate(state, countryCode, topic, level = 'ambassador') {
    const country = state.findCountry(countryCode);
    if (!country) return "❌ کشور پیدا نشد!";
    
    // هزینه بر اساس سطح
    const costs = {
        expert: { budget: 0.1, relationMin: 0, risk: 0 },
        ambassador: { budget: 0.5, relationMin: -50, risk: 5 },
        minister: { budget: 2, relationMin: -30, risk: 15 },
        president: { budget: 5, relationMin: -10, risk: 30 }
    };
    
    const levelConfig = costs[level];
    if (!levelConfig) return "❌ سطح مذاکره نامعتبر!";
    
    if (country[4] < levelConfig.relationMin) {
        return `❌ روابط برای مذاکره در سطح ${level} خیلی پایینه!\n📊 رابطه فعلی: ${country[4]}`;
    }
    
    if (state.budget_toman < levelConfig.budget) {
        return `❌ بودجه کافی نیست!\n💰 نیاز: ${levelConfig.budget} همت`;
    }
    
    state.budget_toman -= levelConfig.budget;
    
    // احتمال موفقیت
    const successChance = 50 + country[4] / 2 + (level === 'president' ? 20 : 0);
    const success = Math.random() * 100 < successChance;
    
    let result = "";
    
    if (success) {
        const relationBoost = level === 'president' ? 20 : level === 'minister' ? 12 : level === 'ambassador' ? 7 : 3;
        country[4] = Math.min(100, country[4] + relationBoost);
        
        // اثر بر اساس موضوع
        switch(topic) {
            case 'trade':
                country[5] += 1;
                state.gdp += 2;
                result = "🤝 توافق تجاری امضا شد!";
                break;
            case 'sanctions':
                state.sanctions = Math.max(0, state.sanctions - 10);
                result = "🔓 بخشی از تحریم‌ها لغو شد";
                break;
            case 'peace':
                state.israel_tension = Math.max(0, state.israel_tension - 15);
                result = "🕊️ توافق صلح امضا شد";
                break;
            case 'alliance':
                state.popularity += 5;
                state.gdp += 5;
                result = "🤝 پیمان اتحاد امضا شد!";
                break;
            case 'nuclear':
                state.nuclear_percent = Math.max(3.67, state.nuclear_percent - 10);
                state.sanctions = Math.max(0, state.sanctions - 15);
                result = "⚛️ توافق هسته‌ای پیشرفت کرد";
                break;
            case 'prisoner':
                state.popularity += 5;
                result = "🔓 تبادل زندانیان موفق";
                break;
            case 'water':
                state.popularity += 3;
                result = "💧 توافق حقابه امضا شد";
                break;
            default:
                result = "🤝 مذاکره موفقیت‌آمیز بود";
        }
        
        state.addHistory(`🤝 مذاکره ${level} با ${country[0]} ${country[1]} - ${result}`);
        
        return `🤝 *مذاکره با ${country[1]} ${country[0]}*\n\n` +
               `📊 سطح: ${level}\n` +
               `✅ ${result}\n` +
               `📈 روابط: ${country[4]}/100\n` +
               `💰 هزینه: ${levelConfig.budget} همت`;
    } else {
        // شکست مذاکره
        country[4] = Math.max(-100, country[4] - 5);
        state.popularity -= 2;
        
        const failReasons = [
            "اختلاف نظر عمیق",
            "کارشکنی اسرائیل",
            "فشار آمریکا",
            "بدقولی طرف مقابل",
            "جاسوسی فاش شد"
        ];
        const reason = failReasons[Math.floor(Math.random() * failReasons.length)];
        
        state.addHistory(`❌ شکست مذاکره ${level} با ${country[0]} ${country[1]} - ${reason}`);
        
        return `❌ *مذاکره با ${country[1]} ${country[0]} شکست خورد*\n\n` +
               `📊 سطح: ${level}\n` +
               `🚫 دلیل: ${reason}\n` +
               `📉 روابط: ${country[4]}/100\n` +
               `⚠️ محبوبیت -۲٪`;
    }
}

/**
 * مذاکره محرمانه
 */
function secretNegotiation(state, countryCode) {
    const country = state.findCountry(countryCode);
    if (!country) return "❌ کشور پیدا نشد!";
    
    const cost = 0.2;
    state.budget_toman -= cost;
    
    // ریسک لو رفتن
    const leakChance = 15;
    const leaked = Math.random() * 100 < leakChance;
    
    if (leaked) {
        country[4] = Math.max(-100, country[4] - 10);
        state.popularity -= 5;
        state.addHistory(`🚨 مذاکره محرمانه با ${country[0]} ${country[1]} لو رفت!`);
        
        return `🚨 *مذاکره محرمانه لو رفت!*\n\n` +
               `🇮🇷 کشور: ${country[1]} ${country[0]}\n` +
               `📉 روابط: ${country[4]}/100\n` +
               `⚠️ محبوبیت -۵٪\n` +
               `💀 رسوایی سیاسی!`;
    }
    
    country[4] = Math.min(100, country[4] + 8);
    state.popularity += 1;
    state.addHistory(`🤫 مذاکره محرمانه موفق با ${country[0]} ${country[1]}`);
    
    return `🤫 *مذاکره محرمانه موفق*\n\n` +
           `🇮🇷 کشور: ${country[1]} ${country[0]}\n` +
           `📈 روابط: ${country[4]}/100\n` +
           `✅ بدون لو رفتن`;
}

/**
 * پیمان دفاعی
 */
function defensePact(state, countryCode) {
    const country = state.findCountry(countryCode);
    if (!country) return "❌ کشور پیدا نشد!";
    
    if (country[4] < 50) {
        return `❌ روابط برای پیمان دفاعی کافی نیست!\n📊 نیاز: ۵۰\nفعلی: ${country[4]}`;
    }
    
    const cost = 10;
    if (state.budget_toman < cost) {
        return `❌ بودجه کافی نیست!\n💰 نیاز: ${cost} همت`;
    }
    
    state.budget_toman -= cost;
    country[4] = Math.min(100, country[4] + 20);
    state.popularity += 5;
    state.gdp += 3;
    
    // واکنش آمریکا
    const usa = state.findCountry("US");
    if (usa) usa[4] = Math.max(-100, usa[4] - 15);
    
    state.addHistory(`🛡️ پیمان دفاعی با ${country[0]} ${country[1]} امضا شد`);
    
    return `🛡️ *پیمان دفاعی با ${country[1]} ${country[0]}*\n\n` +
           `✅ اتحاد نظامی برقرار شد\n` +
           `📈 روابط: ${country[4]}/100\n` +
           `✅ محبوبیت +۵٪\n` +
           `📈 GDP +۳\n` +
           `⚠️ واکنش آمریکا: منفی`;
}

/**
 * پیمان تجاری
 */
function tradePact(state, countryCode) {
    const country = state.findCountry(countryCode);
    if (!country) return "❌ کشور پیدا نشد!";
    
    if (country[4] < 30) {
        return `❌ روابط برای پیمان تجاری کافی نیست!\n📊 نیاز: ۳۰\nفعلی: ${country[4]}`;
    }
    
    const cost = 3;
    state.budget_toman -= cost;
    country[4] = Math.min(100, country[4] + 10);
    country[5] += 5;
    state.gdp += 8;
    state.inflation -= 2;
    state.popularity += 3;
    
    state.addHistory(`💰 پیمان تجاری با ${country[0]} ${country[1]} (تجارت +۵ میلیارد دلار)`);
    
    return `💰 *پیمان تجاری با ${country[1]} ${country[0]}*\n\n` +
           `✅ تجارت +۵ میلیارد دلار\n` +
           `📈 GDP +۸\n` +
           `📉 تورم -۲٪\n` +
           `✅ محبوبیت +۳٪`;
}

/**
 * قطع رابطه دیپلماتیک
 */
function cutRelations(state, countryCode) {
    const country = state.findCountry(countryCode);
    if (!country) return "❌ کشور پیدا نشد!";
    
    country[4] = -50;
    country[5] = Math.max(0, country[5] - 3);
    state.sanctions = Math.min(100, state.sanctions + 3);
    state.popularity += 2;
    
    state.addHistory(`🚫 قطع رابطه دیپلماتیک با ${country[0]} ${country[1]}`);
    
    return `🚫 *قطع رابطه با ${country[1]} ${country[0]}*\n\n` +
           `📉 روابط: ${country[4]}/100\n` +
           `💰 تجارت: ${country[5]} میلیارد دلار\n` +
           `⚠️ تحریم‌ها +۳`;
}

/**
 * اخراج سفیر
 */
function expelAmbassador(state, countryCode) {
    const country = state.findCountry(countryCode);
    if (!country) return "❌ کشور پیدا نشد!";
    
    country[4] = Math.max(-100, country[4] - 20);
    state.popularity += 3;
    
    state.addHistory(`👋 اخراج سفیر ${country[0]} ${country[1]}`);
    
    return `👋 *سفیر ${country[1]} ${country[0]} اخراج شد*\n\n` +
           `📉 روابط: ${country[4]}/100\n` +
           `✅ محبوبیت +۳٪`;
}

/**
 * میانجی‌گری در جنگ دیگران
 */
function mediateConflict(state, country1Code, country2Code) {
    const country1 = state.findCountry(country1Code);
    const country2 = state.findCountry(country2Code);
    
    if (!country1 || !country2) return "❌ کشور پیدا نشد!";
    
    const cost = 2;
    state.budget_toman -= cost;
    
    const success = Math.random() < 0.5;
    
    if (success) {
        country1[4] = Math.min(100, country1[4] + 10);
        country2[4] = Math.min(100, country2[4] + 10);
        state.popularity += 8;
        state.addHistory(`🕊️ میانجی‌گری موفق بین ${country1[0]} و ${country2[0]}`);
        
        return `🕊️ *میانجی‌گری موفق*\n\n` +
               `🇮🇷 ایران میان ${country1[1]} ${country1[0]} و ${country2[1]} ${country2[0]} صلح برقرار کرد\n` +
               `✅ محبوبیت +۸٪\n` +
               `📈 روابط با هر دو کشور +۱۰`;
    }
    
    state.popularity -= 2;
    state.addHistory(`❌ شکست میانجی‌گری بین ${country1[0]} و ${country2[0]}`);
    
    return `❌ *میانجی‌گری شکست خورد*\n\n` +
           `⚠️ محبوبیت -۲٪`;
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
    
    country[4] = Math.max(-100, country[4] - 25);
    country[5] = Math.max(0, country[5] - 2);
    state.popularity += 4;
    state.gdp -= 1;
    
    state.addHistory(`🚫 ایران ${country[0]} ${country[1]} رو تحریم کرد`);
    
    return `🚫 *${country[1]} ${country[0]} تحریم شد*\n\n` +
           `📉 روابط: ${country[4]}/100\n` +
           `💰 تجارت: ${country[5]} میلیارد دلار\n` +
           `✅ محبوبیت +۴٪\n` +
           `⚠️ GDP -۱`;
}

/**
 * دور زدن تحریم
 */
function evadeSanctions(state) {
    const cost = 1;
    state.budget_toman -= cost;
    state.dollar_rate -= 3000;
    state.dollar_reserves += 0.5;
    state.sanctions = Math.max(0, state.sanctions - 3);
    
    state.addHistory("🔄 عملیات دور زدن تحریم موفق");
    
    return `🔄 *دور زدن تحریم موفق*\n\n` +
           `💵 دلار -۳,۰۰۰\n` +
           `💰 ذخایر +۰.۵ میلیارد دلار\n` +
           `✅ تحریم‌ها -۳`;
}

/**
 * بستن تنگه هرمز
 */
function closeStraitOfHormuz(state) {
    state.dollar_rate += 25000;
    state.oil_price += 30;
    state.sanctions = 100;
    state.popularity += 10;
    state.israel_tension += 20;
    
    // قطع روابط با همه همسایگان خلیج فارس
    const persianGulfCountries = ["SA", "AE", "QA", "BH", "KW", "OM"];
    persianGulfCountries.forEach(code => {
        const country = state.findCountry(code);
        if (country) {
            country[4] = Math.max(-100, country[4] - 40);
            country[5] = 0;
        }
    });
    
    const usa = state.findCountry("US");
    if (usa) usa[4] = -100;
    
    state.addHistory("🚫 تنگه هرمز بسته شد! بحران جهانی");
    
    // احتمال جنگ
    if (Math.random() < 0.4) {
        state.game_over = true;
        state.addHistory("💥 آمریکا به تنگه هرمز حمله کرد! جنگ جهانی سوم");
    }
    
    return `🚫 *تنگه هرمز بسته شد!*\n\n` +
           `⛽ قیمت نفت +۳۰ دلار\n` +
           `💵 دلار +۲۵,۰۰۰\n` +
           `🚫 تحریم: ۱۰۰٪\n` +
           `⚠️ خطر جنگ با آمریکا!\n` +
           `✅ محبوبیت +۱۰٪`;
}

// ============================================
// 🌍 سازمان‌های بین‌المللی
// ============================================

/**
 * پذیرش FATF
 */
function acceptFATF(state) {
    if (state.fatf_accepted) {
        return "❌ FATF قبلاً پذیرفته شده!";
    }
    
    state.fatf_accepted = true;
    state.sanctions = Math.max(0, state.sanctions - 20);
    state.dollar_rate -= 10000;
    state.budget_toman += 10;
    state.popularity -= 5;
    
    const eu = state.findCountry("DE");
    if (eu) eu[4] = Math.min(100, eu[4] + 15);
    
    const china = state.findCountry("CN");
    if (china) china[4] = Math.min(100, china[4] + 10);
    
    state.addHistory("✅ ایران FATF را پذیرفت");
    
    return `✅ *FATF پذیرفته شد*\n\n` +
           `🔓 تحریم‌ها -۲۰\n` +
           `💵 دلار -۱۰,۰۰۰\n` +
           `💰 +۱۰ همت\n` +
           `⚠️ محبوبیت -۵٪\n` +
           `✅ روابط بانکی عادی شد`;
}

/**
 * شکایت به سازمان ملل
 */
function complainToUN(state, countryCode) {
    const country = state.findCountry(countryCode);
    if (!country) return "❌ کشور پیدا نشد!";
    
    const cost = 0.5;
    state.budget_toman -= cost;
    
    country[4] = Math.max(-100, country[4] - 5);
    state.popularity += 1;
    
    state.addHistory(`📋 شکایت از ${country[0]} ${country[1]} به سازمان ملل`);
    
    return `📋 *شکایت به سازمان ملل*\n\n` +
           `هدف: ${country[1]} ${country[0]}\n` +
           `📉 روابط: ${country[4]}/100\n` +
           `⏳ منتظر رأی‌گیری...`;
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
    
    const cost = 1;
    
    if (state.budget_toman < cost) {
        return "❌ بودجه کافی نیست!";
    }
    
    state.budget_toman -= cost;
    country[4] = Math.min(100, country[4] + 15);
    state.popularity += 2;
    
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
           `✅ محبوبیت +۲٪`;
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