// military.js - سیستم نظامی و امنیتی ایران

// ============================================
// ⚔️ عملیات‌های نظامی
// ============================================

/**
 * حمله موشکی به یک کشور
 */
function missileAttack(state, countryCode, missileCount = 20) {
    const country = state.findCountry(countryCode);
    if (!country) return "❌ کشور پیدا نشد!";
    
    if (state.missiles < missileCount) {
        return `❌ موشک کافی نیست!\n🚀 موجودی: ${state.missiles} عدد\nنیاز: ${missileCount} عدد`;
    }
    
    // هزینه حمله
    state.missiles -= missileCount;
    state.budget_toman -= missileCount * 0.05; // هر موشک ۰.۰۵ همت هزینه عملیاتی
    state.dollar_rate += 2000; // افزایش دلار بعد از حمله
    
    // اثر روی کشور هدف
    country[4] = Math.max(-100, country[4] - 30); // کاهش شدید روابط
    country[5] = Math.max(0, country[5] - 2); // کاهش تجارت
    
    // عواقب بین‌المللی
    state.sanctions = Math.min(100, state.sanctions + 8);
    state.israel_tension += 3;
    
    // اثر داخلی
    state.popularity += 5; // مردم حمله رو دوست دارن
    
    // کشورهای قدرتمند واکنش نشون می‌دن
    const usa = state.findCountry("US");
    if (usa) usa[4] = Math.max(-100, usa[4] - 10);
    
    const russia = state.findCountry("RU");
    if (russia && country[2] !== "RU") russia[4] = Math.min(100, russia[4] + 2);
    
    const china = state.findCountry("CN");
    if (china) china[4] = Math.min(100, china[4] + 1);
    
    state.addHistory(`🚀 حمله موشکی به ${country[0]} ${country[1]}! (${missileCount} موشک)`);
    
    return `🚀 *حمله موشکی به ${country[1]} ${country[0]}!*\n\n` +
           `🎯 موشک شلیک شده: ${missileCount}\n` +
           `💥 خسارت به ${country[0]}: سنگین\n` +
           `📉 روابط با ${country[0]}: ${country[4]}/100\n` +
           `⚠️ تحریم‌ها +۸\n` +
           `✅ محبوبیت +۵٪`;
}

/**
 * حمله پهپادی
 */
function droneAttack(state, countryCode, droneCount = 50) {
    const country = state.findCountry(countryCode);
    if (!country) return "❌ کشور پیدا نشد!";
    
    if (state.drones < droneCount) {
        return `❌ پهپاد کافی نیست!\n🛸 موجودی: ${state.drones} عدد\nنیاز: ${droneCount} عدد`;
    }
    
    // هزینه کمتر از موشک
    state.drones -= droneCount;
    state.budget_toman -= droneCount * 0.01; // هر پهپاد ۰.۰۱ همت
    
    // اثر روی کشور هدف
    country[4] = Math.max(-100, country[4] - 20);
    country[5] = Math.max(0, country[5] - 1);
    
    // عواقب بین‌المللی (کمتر از موشک)
    state.sanctions = Math.min(100, state.sanctions + 4);
    state.popularity += 3;
    
    state.addHistory(`🛸 حمله پهپادی به ${country[0]} ${country[1]}! (${droneCount} پهپاد)`);
    
    return `🛸 *حمله پهپادی به ${country[1]} ${country[0]}!*\n\n` +
           `🎯 پهپاد شلیک شده: ${droneCount}\n` +
           `💥 خسارت: متوسط\n` +
           `📉 روابط: ${country[4]}/100\n` +
           `⚠️ تحریم‌ها +۴\n` +
           `✅ محبوبیت +۳٪`;
}

/**
 * حمله سایبری
 */
function cyberAttack(state, countryCode) {
    const country = state.findCountry(countryCode);
    if (!country) return "❌ کشور پیدا نشد!";
    
    // هزینه خیلی کم، ریسک خیلی کم
    state.budget_toman -= 0.1; // فقط ۰.۱ همت
    state.dollar_rate += 500;
    
    // اثر
    country[4] = Math.max(-100, country[4] - 10);
    country[5] = Math.max(0, country[5] - 0.5);
    state.popularity += 1;
    
    const effects = [
        "قطع برق سراسری",
        "هک سامانه بانکی",
        "نشت اطلاعات محرمانه",
        "فلج شدن شبکه حمل و نقل",
        "حمله به تأسیسات آب"
    ];
    const randomEffect = effects[Math.floor(Math.random() * effects.length)];
    
    state.addHistory(`💻 حمله سایبری به ${country[0]} ${country[1]}! (${randomEffect})`);
    
    return `💻 *حمله سایبری به ${country[1]} ${country[0]}!*\n\n` +
           `🎯 اثر: ${randomEffect}\n` +
           `📉 روابط: ${country[4]}/100\n` +
           `💰 هزینه: ۰.۱ همت`;
}

/**
 * جنگ تمام‌عیار
 */
function declareWar(state, countryCode) {
    const country = state.findCountry(countryCode);
    if (!country) return "❌ کشور پیدا نشد!";
    
    // هزینه سنگین
    const warCost = 50; // همت
    const missileCost = 200;
    const droneCost = 500;
    const soldierCost = 10000;
    
    if (state.budget_toman < warCost) {
        return `❌ بودجه کافی برای جنگ نیست!\n💰 نیاز: ${warCost} همت`;
    }
    
    if (state.missiles < missileCost || state.drones < droneCost || state.soldiers < soldierCost) {
        return "❌ منابع نظامی کافی نیست!";
    }
    
    // هزینه‌های جنگ
    state.budget_toman -= warCost;
    state.missiles -= missileCost;
    state.drones -= droneCost;
    state.soldiers -= soldierCost;
    state.dollar_rate += 20000;
    
    // عواقب
    country[4] = -100; // دشمن کامل
    country[5] = 0; // قطع کامل تجارت
    state.sanctions = 100; // تحریم حداکثری
    state.popularity += 15; // اتحاد ملی
    state.inflation += 10;
    state.gdp -= 20;
    
    // واکنش قدرتها
    const usa = state.findCountry("US");
    if (usa) usa[4] = -100;
    
    state.addHistory(`⚔️ اعلان جنگ به ${country[0]} ${country[1]}!`);
    
    // احتمال پایان بازی
    if (country[2] === "US" || country[2] === "IL") {
        state.game_over = true;
        state.addHistory("💥 جنگ با ابرقدرت! بازی به پایان رسید");
    }
    
    return `⚔️ *اعلان جنگ به ${country[1]} ${country[0]}!*\n\n` +
           `💰 هزینه: ${warCost} همت\n` +
           `🚀 موشک مصرفی: ${missileCost}\n` +
           `🛸 پهپاد مصرفی: ${droneCost}\n` +
           `👥 نیرو: ${soldierCost}\n` +
           `⚠️ تحریم: ۱۰۰٪\n` +
           `✅ محبوبیت +۱۵٪\n` +
           `📉 GDP -۲۰ میلیارد`;
}

/**
 * تقویت پدافند هوایی
 */
function strengthenDefense(state) {
    if (state.budget_toman < 5) {
        return "❌ بودجه کافی نیست! (نیاز: ۵ همت)";
    }
    
    state.budget_toman -= 5;
    state.popularity += 2;
    state.addHistory("🛡️ تقویت پدافند هوایی (هزینه ۵ همت)");
    
    return "🛡️ *پدافند هوایی تقویت شد*\n\n" +
           "✅ دفاع در برابر حملات هوایی +۲۰٪\n" +
           "💰 هزینه: ۵ همت";
}

/**
 * تولید موشک جدید
 */
function produceMissiles(state, count = 30) {
    const cost = count * 0.1; // هر موشک ۰.۱ همت
    
    if (state.budget_toman < cost) {
        return `❌ بودجه کافی نیست!\n💰 نیاز: ${cost} همت`;
    }
    
    state.budget_toman -= cost;
    state.missiles += count;
    state.sanctions = Math.min(100, state.sanctions + 2);
    state.popularity += 2;
    state.addHistory(`💣 تولید ${count} موشک جدید (هزینه ${cost} همت)`);
    
    return `💣 *${count} موشک جدید تولید شد*\n\n` +
           `🚀 موجودی موشک: ${state.missiles}\n` +
           `💰 هزینه: ${cost} همت`;
}

/**
 * تولید پهپاد جدید
 */
function produceDrones(state, count = 100) {
    const cost = count * 0.01; // هر پهپاد ۰.۰۱ همت
    
    if (state.budget_toman < cost) {
        return `❌ بودجه کافی نیست!\n💰 نیاز: ${cost} همت`;
    }
    
    state.budget_toman -= cost;
    state.drones += count;
    state.addHistory(`🛸 تولید ${count} پهپاد جدید (هزینه ${cost} همت)`);
    
    return `🛸 *${count} پهپاد جدید تولید شد*\n\n` +
           `🛸 موجودی پهپاد: ${state.drones}\n` +
           `💰 هزینه: ${cost} همت`;
}

/**
 * اعزام نیرو
 */
function deployForces(state, count = 5000) {
    const cost = count * 0.001; // هر نیرو ۰.۰۰۱ همت
    
    if (state.soldiers < count) {
        return `❌ نیروی کافی نیست!\n👥 موجودی: ${state.soldiers}`;
    }
    
    state.budget_toman -= cost;
    state.soldiers -= count;
    state.popularity -= 2;
    state.addHistory(`👥 اعزام ${count} نیرو (هزینه ${cost} همت)`);
    
    return `👥 *${count} نیرو اعزام شد*\n\n` +
           `👥 نیروی باقی‌مانده: ${state.soldiers}\n` +
           `💰 هزینه: ${cost} همت`;
}

/**
 * دفاع در برابر حمله
 */
function defendCountry(state) {
    state.budget_toman -= 3;
    state.popularity += 3;
    state.addHistory("🛡️ آماده‌باش دفاعی در برابر حملات");
    
    return "🛡️ *حالت دفاعی فعال شد*\n\n" +
           "✅ آمادگی در برابر حملات +۳۰٪\n" +
           "💰 هزینه: ۳ همت\n" +
           "👥 محبوبیت +۳٪";
}

// ============================================
// ⚛️ عملیات هسته‌ای
// ============================================

/**
 * افزایش غنی‌سازی
 */
function enrichUranium(state, targetPercent) {
    if (targetPercent <= state.nuclear_percent) {
        return "❌ درصد جدید باید بیشتر از غنی‌سازی فعلی باشه!";
    }
    
    if (targetPercent > 90) {
        return "❌ حداکثر غنی‌سازی ۹۰٪ است!";
    }
    
    const oldPercent = state.nuclear_percent;
    state.nuclear_percent = targetPercent;
    
    // عواقب
    const increase = targetPercent - oldPercent;
    state.sanctions = Math.min(100, state.sanctions + increase);
    state.israel_tension = Math.min(100, state.israel_tension + increase / 2);
    state.popularity += increase / 5;
    state.budget_toman -= increase * 0.5;
    
    // واکنش بین‌المللی
    const usa = state.findCountry("US");
    if (usa) usa[4] = Math.max(-100, usa[4] - increase);
    
    const eu = state.findCountry("DE");
    if (eu) eu[4] = Math.max(-100, eu[4] - increase / 2);
    
    state.addHistory(`⚛️ افزایش غنی‌سازی: ${oldPercent}٪ → ${targetPercent}٪`);
    
    if (targetPercent >= 90) {
        state.addHistory("☢️ ایران به آستانه هسته‌ای رسید!");
        return `☢️ *غنی‌سازی به ${targetPercent}٪ رسید!*\n\n` +
               `⚠️ هشدار جهانی!\n` +
               `🚫 تحریم‌ها +${increase}\n` +
               `💥 تنش اسرائیل +${increase/2}\n` +
               `✅ محبوبیت +${(increase/5).toFixed(1)}٪`;
    }
    
    return `⚛️ *غنی‌سازی افزایش یافت*\n\n` +
           `📊 ${oldPercent}٪ → ${targetPercent}٪\n` +
           `⚠️ تحریم‌ها +${increase}\n` +
           `💥 تنش اسرائیل +${(increase/2).toFixed(1)}`;
}

/**
 * کاهش غنی‌سازی (اعتمادسازی)
 */
function decreaseEnrichment(state, targetPercent) {
    if (targetPercent >= state.nuclear_percent) {
        return "❌ درصد جدید باید کمتر از غنی‌سازی فعلی باشه!";
    }
    
    if (targetPercent < 3.67) {
        return "❌ حداقل غنی‌سازی ۳.۶۷٪ است!";
    }
    
    const oldPercent = state.nuclear_percent;
    state.nuclear_percent = targetPercent;
    
    const decrease = oldPercent - targetPercent;
    state.sanctions = Math.max(0, state.sanctions - decrease);
    state.popularity -= decrease / 3;
    
    const usa = state.findCountry("US");
    if (usa) usa[4] = Math.min(100, usa[4] + decrease);
    
    const eu = state.findCountry("DE");
    if (eu) eu[4] = Math.min(100, eu[4] + decrease);
    
    state.addHistory(`⚛️ کاهش غنی‌سازی: ${oldPercent}٪ → ${targetPercent}٪`);
    
    return `⚛️ *غنی‌سازی کاهش یافت*\n\n` +
           `📊 ${oldPercent}٪ → ${targetPercent}٪\n` +
           `✅ تحریم‌ها -${decrease}\n` +
           `⚠️ محبوبیت -${(decrease/3).toFixed(1)}٪`;
}

/**
 * توافق هسته‌ای
 */
function nuclearDeal(state) {
    if (state.nuclear_deal_active) {
        return "❌ همین الان توافق هسته‌ای فعاله!";
    }
    
    state.nuclear_deal_active = true;
    state.nuclear_percent = 3.67;
    state.sanctions = Math.max(0, state.sanctions - 30);
    state.dollar_rate -= 15000;
    state.budget_toman += 15;
    state.popularity += 8;
    state.inflation -= 5;
    
    // بهبود روابط
    const usa = state.findCountry("US");
    if (usa) usa[4] = Math.min(100, usa[4] + 25);
    
    const eu = state.findCountry("DE");
    if (eu) eu[4] = Math.min(100, eu[4] + 30);
    
    state.addHistory("📝 توافق هسته‌ای جدید امضا شد!");
    
    return `📝 *توافق هسته‌ای جدید!*\n\n` +
           `⚛️ غنی‌سازی: ۳.۶۷٪\n` +
           `✅ تحریم‌ها -۳۰\n` +
           `💵 دلار -۱۵,۰۰۰\n` +
           `💰 +۱۵ همت\n` +
           `✅ محبوبیت +۸٪\n` +
           `📉 تورم -۵٪`;
}

/**
 * خروج از NPT
 */
function leaveNPT(state) {
    state.popularity += 5;
    state.sanctions = 100;
    state.israel_tension += 15;
    state.nuclear_percent = 90;
    state.dollar_rate += 30000;
    
    // قطع روابط با غرب
    const usa = state.findCountry("US");
    if (usa) usa[4] = -100;
    
    const eu = state.findCountry("DE");
    if (eu) eu[4] = -80;
    
    const china = state.findCountry("CN");
    if (china) china[4] = Math.max(-100, china[4] - 20);
    
    const russia = state.findCountry("RU");
    if (russia) russia[4] = Math.max(-100, russia[4] - 10);
    
    state.addHistory("🚫 خروج از NPT! انزوای کامل بین‌المللی");
    
    return `🚫 *خروج از NPT!*\n\n` +
           `☢️ غنی‌سازی: ۹۰٪\n` +
           `🚫 تحریم: ۱۰۰٪\n` +
           `💵 دلار +۳۰,۰۰۰\n` +
           `🌍 انزوای کامل بین‌المللی\n` +
           `⚠️ خطر جنگ!`;
}

// ============================================
// 🕵️ عملیات ویژه
// ============================================

/**
 * ترور هدفمند
 */
function targetedAssassination(state, target, location) {
    const cost = 2; // همت
    
    if (state.budget_toman < cost) {
        return "❌ بودجه کافی نیست!";
    }
    
    state.budget_toman -= cost;
    state.israel_tension += 5;
    state.popularity += 2;
    
    state.addHistory(`🎯 ترور ${target} در ${location} (هزینه ${cost} همت)`);
    
    return `🎯 *عملیات ترور انجام شد*\n\n` +
           `هدف: ${target}\n` +
           `📍 مکان: ${location}\n` +
           `💰 هزینه: ${cost} همت\n` +
           `✅ محبوبیت +۲٪`;
}

/**
 * عملیات نفوذ
 */
function infiltrationOperation(state, countryCode) {
    const country = state.findCountry(countryCode);
    if (!country) return "❌ کشور پیدا نشد!";
    
    const cost = 1;
    state.budget_toman -= cost;
    country[4] = Math.max(-100, country[4] - 5);
    
    state.addHistory(`🕵️ عملیات نفوذ در ${country[0]} ${country[1]}`);
    
    return `🕵️ *عملیات نفوذ در ${country[1]} ${country[0]}*\n\n` +
           `✅ نفوذ موفق\n` +
           `💰 هزینه: ${cost} همت`;
}

// ============================================
// 📤 خروجی
// ============================================
module.exports = {
    missileAttack,
    droneAttack,
    cyberAttack,
    declareWar,
    strengthenDefense,
    produceMissiles,
    produceDrones,
    deployForces,
    defendCountry,
    enrichUranium,
    decreaseEnrichment,
    nuclearDeal,
    leaveNPT,
    targetedAssassination,
    infiltrationOperation
};