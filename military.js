// military.js - سیستم نظامی و امنیتی ایران (نسخه سخت)

const { LOCKS } = require('./config');

// ============================================
// ⚔️ عملیات‌های نظامی (سخت‌تر و پرهزینه‌تر)
// ============================================

/**
 * حمله موشکی به یک کشور (با قفل و عواقب بیشتر)
 */
function missileAttack(state, countryCode, missileCount = 30) {
    const country = state.findCountry(countryCode);
    if (!country) return "❌ کشور پیدا نشد!";
    
    // قفل جنگ
    const lockCheck = state.canDo('declare_war');
    if (!lockCheck.allowed) {
        return `❌ نمی‌تونی حمله کنی!\n${lockCheck.reasons.join('\n')}`;
    }
    
    if (state.missiles < missileCount) {
        return `❌ موشک کافی نیست!\n🚀 موجودی: ${state.missiles.toLocaleString()}\nنیاز: ${missileCount}`;
    }
    
    // هزینه حمله (بیشتر)
    state.missiles -= missileCount;
    state.budget_toman -= missileCount * 0.08;
    state.dollar_rate += 3000;
    state.last_war_turn = state.turn;
    
    // اثر روی کشور هدف
    country[4] = Math.max(-100, country[4] - 35);
    country[5] = Math.max(0, country[5] - 3);
    
    // عواقب بین‌المللی (بیشتر)
    state.sanctions = Math.min(100, state.sanctions + 10);
    state.israel_tension += 5;
    
    // اثر داخلی (کمتر)
    state.popularity += 3;
    
    // واکنش قدرت‌ها
    const usa = state.findCountry("US");
    if (usa) usa[4] = Math.max(-100, usa[4] - 15);
    
    state.addHistory(`🚀 حمله موشکی به ${country[0]} ${country[1]}! (${missileCount} موشک)`);
    
    return `🚀 *حمله موشکی به ${country[1]} ${country[0]}!*\n\n` +
           `🎯 موشک شلیک شده: ${missileCount}\n` +
           `💥 خسارت به ${country[0]}: سنگین\n` +
           `📉 روابط: ${country[4]}/100\n` +
           `⚠️ تحریم‌ها +۱۰\n` +
           `⚠️ آمریکا خشمگین\n` +
           `✅ محبوبیت +۳٪`;
}

/**
 * حمله پهپادی (ارزان‌تر ولی با عواقب)
 */
function droneAttack(state, countryCode, droneCount = 80) {
    const country = state.findCountry(countryCode);
    if (!country) return "❌ کشور پیدا نشد!";
    
    // قفل جنگ
    const lockCheck = state.canDo('declare_war');
    if (!lockCheck.allowed) {
        return `❌ نمی‌تونی حمله کنی!\n${lockCheck.reasons.join('\n')}`;
    }
    
    if (state.drones < droneCount) {
        return `❌ پهپاد کافی نیست!\n🛸 موجودی: ${state.drones.toLocaleString()}\nنیاز: ${droneCount}`;
    }
    
    state.drones -= droneCount;
    state.budget_toman -= droneCount * 0.015;
    state.last_war_turn = state.turn;
    
    country[4] = Math.max(-100, country[4] - 25);
    country[5] = Math.max(0, country[5] - 1.5);
    
    state.sanctions = Math.min(100, state.sanctions + 5);
    state.popularity += 2;
    
    const usa = state.findCountry("US");
    if (usa) usa[4] = Math.max(-100, usa[4] - 8);
    
    state.addHistory(`🛸 حمله پهپادی به ${country[0]} ${country[1]}! (${droneCount} پهپاد)`);
    
    return `🛸 *حمله پهپادی به ${country[1]} ${country[0]}!*\n\n` +
           `🎯 پهپاد شلیک شده: ${droneCount}\n` +
           `💥 خسارت: متوسط\n` +
           `📉 روابط: ${country[4]}/100\n` +
           `⚠️ تحریم‌ها +۵`;
}

/**
 * حمله سایبری (مخفی‌تر ولی ریسک لو رفتن)
 */
function cyberAttack(state, countryCode) {
    const country = state.findCountry(countryCode);
    if (!country) return "❌ کشور پیدا نشد!";
    
    state.budget_toman -= 0.2;
    state.dollar_rate += 800;
    state.last_war_turn = state.turn;
    
    // احتمال لو رفتن
    const leakChance = 25;
    const leaked = Math.random() * 100 < leakChance;
    
    if (leaked) {
        country[4] = Math.max(-100, country[4] - 15);
        state.sanctions = Math.min(100, state.sanctions + 5);
        state.popularity -= 2;
        state.addHistory(`💻 حمله سایبری به ${country[0]} ${country[1]} - لو رفت!`);
        
        return `💻 *حمله سایبری - لو رفت!*\n\n` +
               `🎯 هدف: ${country[1]} ${country[0]}\n` +
               `🚫 لو رفت! تحریم +۵\n` +
               `⚠️ محبوبیت -۲٪`;
    }
    
    country[4] = Math.max(-100, country[4] - 8);
    state.popularity += 1;
    state.addHistory(`💻 حمله سایبری موفق به ${country[0]} ${country[1]}`);
    
    const effects = ["قطع برق", "هک بانکی", "نشت اطلاعات", "فلج حمل و نقل", "حمله به آب"];
    const randomEffect = effects[Math.floor(Math.random() * effects.length)];
    
    return `💻 *حمله سایبری موفق*\n\n` +
           `🎯 هدف: ${country[1]} ${country[0]}\n` +
           `💥 اثر: ${randomEffect}\n` +
           `🔒 بدون لو رفتن`;
}

/**
 * جنگ تمام‌عیار (با قفل و عواقب بسیار سنگین)
 */
function declareWar(state, countryCode) {
    const country = state.findCountry(countryCode);
    if (!country) return "❌ کشور پیدا نشد!";
    
    // قفل جنگ
    const lockCheck = state.canDo('declare_war');
    if (!lockCheck.allowed) {
        return `❌ نمی‌تونی اعلان جنگ کنی!\n${lockCheck.reasons.join('\n')}`;
    }
    
    const warCost = 80;
    const missileCost = 300;
    const droneCost = 800;
    const soldierCost = 15000;
    
    if (state.budget_toman < warCost) {
        return `❌ بودجه کافی نیست!\n💰 نیاز: ${warCost} همت\n💵 موجودی: ${state.budget_toman.toFixed(1)} همت`;
    }
    
    if (state.missiles < missileCost || state.drones < droneCost || state.soldiers < soldierCost) {
        return `❌ منابع نظامی کافی نیست!\n🚀 موشک: ${state.missiles}/${missileCost}\n🛸 پهپاد: ${state.drones}/${droneCost}\n👥 نیرو: ${state.soldiers}/${soldierCost}`;
    }
    
    state.budget_toman -= warCost;
    state.missiles -= missileCost;
    state.drones -= droneCost;
    state.soldiers -= soldierCost;
    state.dollar_rate += 25000;
    state.last_war_turn = state.turn;
    
    country[4] = -100;
    country[5] = 0;
    state.sanctions = 100;
    state.popularity += 10;
    state.inflation += 15;
    state.gdp -= 30;
    state.corruption_level += 5;
    
    const usa = state.findCountry("US");
    if (usa) usa[4] = -100;
    
    state.addHistory(`⚔️ اعلان جنگ به ${country[0]} ${country[1]}!`);
    
    // احتمال پایان بازی (بیشتر شد)
    if (country[2] === "US" || country[2] === "IL" || Math.random() < 0.3) {
        state.game_over = true;
        state.addHistory("💥 جنگ به فاجعه تبدیل شد! بازی به پایان رسید");
    }
    
    return `⚔️ *اعلان جنگ به ${country[1]} ${country[0]}!*\n\n` +
           `💰 هزینه: ${warCost} همت\n` +
           `🚀 موشک: ${missileCost}\n` +
           `🛸 پهپاد: ${droneCost}\n` +
           `👥 نیرو: ${soldierCost}\n` +
           `🚫 تحریم: ۱۰۰٪\n` +
           `📉 GDP -۳۰\n` +
           `⚠️ تورم +۱۵٪\n` +
           `⚠️ احتمال پایان بازی: بالا`;
}

/**
 * تقویت پدافند هوایی
 */
function strengthenDefense(state) {
    if (state.budget_toman < 8) {
        return "❌ بودجه کافی نیست! (نیاز: ۸ همت)";
    }
    
    state.budget_toman -= 8;
    state.popularity += 3;
    state.addHistory("🛡️ تقویت پدافند هوایی (هزینه ۸ همت)");
    
    return "🛡️ *پدافند هوایی تقویت شد*\n\n" +
           "✅ دفاع هوایی +۲۵٪\n" +
           "💰 هزینه: ۸ همت";
}

/**
 * تولید موشک جدید
 */
function produceMissiles(state, count = 30) {
    const cost = count * 0.15;
    
    if (state.budget_toman < cost) {
        return `❌ بودجه کافی نیست!\n💰 نیاز: ${cost.toFixed(1)} همت`;
    }
    
    state.budget_toman -= cost;
    state.missiles += count;
    state.sanctions = Math.min(100, state.sanctions + 3);
    state.popularity += 1;
    state.addHistory(`💣 تولید ${count} موشک جدید (هزینه ${cost.toFixed(1)} همت)`);
    
    return `💣 *${count} موشک جدید تولید شد*\n\n` +
           `🚀 موجودی: ${state.missiles.toLocaleString()}\n` +
           `💰 هزینه: ${cost.toFixed(1)} همت\n` +
           `⚠️ تحریم +۳`;
}

/**
 * تولید پهپاد جدید
 */
function produceDrones(state, count = 100) {
    const cost = count * 0.015;
    
    if (state.budget_toman < cost) {
        return `❌ بودجه کافی نیست!\n💰 نیاز: ${cost.toFixed(1)} همت`;
    }
    
    state.budget_toman -= cost;
    state.drones += count;
    state.addHistory(`🛸 تولید ${count} پهپاد جدید (هزینه ${cost.toFixed(1)} همت)`);
    
    return `🛸 *${count} پهپاد جدید تولید شد*\n\n` +
           `🛸 موجودی: ${state.drones.toLocaleString()}\n` +
           `💰 هزینه: ${cost.toFixed(1)} همت`;
}

/**
 * اعزام نیرو
 */
function deployForces(state, count = 5000) {
    const cost = count * 0.0015;
    
    if (state.soldiers < count) {
        return `❌ نیروی کافی نیست!\n👥 موجودی: ${state.soldiers.toLocaleString()}`;
    }
    
    state.budget_toman -= cost;
    state.soldiers -= count;
    state.popularity -= 3;
    state.addHistory(`👥 اعزام ${count} نیرو (هزینه ${cost.toFixed(1)} همت)`);
    
    return `👥 *${count} نیرو اعزام شد*\n\n` +
           `👥 باقی‌مانده: ${state.soldiers.toLocaleString()}\n` +
           `💰 هزینه: ${cost.toFixed(1)} همت\n` +
           `⚠️ محبوبیت -۳٪`;
}

/**
 * دفاع در برابر حمله
 */
function defendCountry(state) {
    state.budget_toman -= 5;
    state.popularity += 4;
    state.addHistory("🛡️ آماده‌باش دفاعی");
    
    return "🛡️ *حالت دفاعی فعال شد*\n\n" +
           "✅ آمادگی دفاعی +۳۵٪\n" +
           "💰 هزینه: ۵ همت";
}

// ============================================
// ⚛️ عملیات هسته‌ای (با قفل‌های جدید)
// ============================================

/**
 * افزایش غنی‌سازی (با قفل برای ۹۰٪)
 */
function enrichUranium(state, targetPercent) {
    if (targetPercent <= state.nuclear_percent) {
        return "❌ درصد جدید باید بیشتر از فعلی باشه!";
    }
    
    if (targetPercent > 90) {
        return "❌ حداکثر ۹۰٪!";
    }
    
    // قفل برای ۹۰٪
    if (targetPercent >= 90) {
        const lockCheck = state.canDo('enrich_90');
        if (!lockCheck.allowed) {
            return `❌ نمی‌تونی به ۹۰٪ برسی!\n${lockCheck.reasons.join('\n')}`;
        }
    }
    
    const oldPercent = state.nuclear_percent;
    state.nuclear_percent = targetPercent;
    
    const increase = targetPercent - oldPercent;
    state.sanctions = Math.min(100, state.sanctions + increase * 1.5);
    state.israel_tension = Math.min(100, state.israel_tension + increase);
    state.popularity += increase / 6;
    state.budget_toman -= increase * 0.8;
    
    const usa = state.findCountry("US");
    if (usa) usa[4] = Math.max(-100, usa[4] - increase * 1.2);
    
    const eu = state.findCountry("DE");
    if (eu) eu[4] = Math.max(-100, eu[4] - increase);
    
    state.addHistory(`⚛️ افزایش غنی‌سازی: ${oldPercent}٪ → ${targetPercent}٪`);
    
    if (targetPercent >= 90) {
        state.addHistory("☢️ ایران به آستانه هسته‌ای رسید!");
        
        // اسرائیل ممکنه حمله کنه
        if (Math.random() < 0.4) {
            state.game_over = true;
            state.addHistory("💥 اسرائیل حمله پیش‌گیرانه کرد! بازی به پایان رسید");
        }
        
        return `☢️ *غنی‌سازی به ${targetPercent}٪ رسید!*\n\n` +
               `⚠️ هشدار جهانی!\n` +
               `🚫 تحریم‌ها +${(increase * 1.5).toFixed(0)}\n` +
               `💥 تنش اسرائیل +${increase}\n` +
               `⚠️ احتمال حمله اسرائیل: ۴۰٪!`;
    }
    
    return `⚛️ *غنی‌سازی افزایش یافت*\n\n` +
           `📊 ${oldPercent}٪ → ${targetPercent}٪\n` +
           `⚠️ تحریم‌ها +${(increase * 1.5).toFixed(0)}\n` +
           `💥 تنش اسرائیل +${increase}`;
}

/**
 * کاهش غنی‌سازی
 */
function decreaseEnrichment(state, targetPercent) {
    if (targetPercent >= state.nuclear_percent) {
        return "❌ درصد جدید باید کمتر باشه!";
    }
    
    if (targetPercent < 3.67) {
        return "❌ حداقل ۳.۶۷٪!";
    }
    
    const oldPercent = state.nuclear_percent;
    state.nuclear_percent = targetPercent;
    
    const decrease = oldPercent - targetPercent;
    state.sanctions = Math.max(0, state.sanctions - decrease);
    state.popularity -= decrease / 2;
    
    const usa = state.findCountry("US");
    if (usa) usa[4] = Math.min(100, usa[4] + decrease * 0.8);
    
    state.addHistory(`⚛️ کاهش غنی‌سازی: ${oldPercent}٪ → ${targetPercent}٪`);
    
    return `⚛️ *غنی‌سازی کاهش یافت*\n\n` +
           `📊 ${oldPercent}٪ → ${targetPercent}٪\n` +
           `✅ تحریم‌ها -${decrease}\n` +
           `⚠️ محبوبیت -${(decrease/2).toFixed(0)}٪`;
}

/**
 * توافق هسته‌ای (با قفل مجلس)
 */
function nuclearDeal(state) {
    if (state.nuclear_deal_active) {
        return "❌ الان توافق فعاله!";
    }
    
    // قفل مجلس
    const lockCheck = state.canDo('nuclear_deal');
    if (!lockCheck.allowed) {
        return `❌ نمی‌تونی توافق کنی!\n${lockCheck.reasons.join('\n')}`;
    }
    
    state.nuclear_deal_active = true;
    state.nuclear_percent = 3.67;
    state.sanctions = Math.max(0, state.sanctions - 25);
    state.dollar_rate -= 12000;
    state.budget_toman += 12;
    state.popularity += 6;
    state.inflation -= 4;
    
    const usa = state.findCountry("US");
    if (usa) usa[4] = Math.min(100, usa[4] + 20);
    
    const eu = state.findCountry("DE");
    if (eu) eu[4] = Math.min(100, eu[4] + 25);
    
    state.addHistory("📝 توافق هسته‌ای جدید امضا شد!");
    
    return `📝 *توافق هسته‌ای جدید!*\n\n` +
           `⚛️ غنی‌سازی: ۳.۶۷٪\n` +
           `✅ تحریم‌ها -۲۵\n` +
           `💵 دلار -۱۲,۰۰۰\n` +
           `💰 +۱۲ همت\n` +
           `✅ محبوبیت +۶٪`;
}

/**
 * خروج از NPT (با قفل محبوبیت)
 */
function leaveNPT(state) {
    const lockCheck = state.canDo('leave_npt');
    if (!lockCheck.allowed) {
        return `❌ نمی‌تونی خارج بشی!\n${lockCheck.reasons.join('\n')}`;
    }
    
    state.popularity += 3;
    state.sanctions = 100;
    state.israel_tension += 20;
    state.nuclear_percent = 90;
    state.dollar_rate += 35000;
    state.budget_toman -= 10;
    state.gdp -= 15;
    
    const usa = state.findCountry("US");
    if (usa) usa[4] = -100;
    
    const eu = state.findCountry("DE");
    if (eu) eu[4] = -90;
    
    const china = state.findCountry("CN");
    if (china) china[4] = Math.max(-100, china[4] - 25);
    
    const russia = state.findCountry("RU");
    if (russia) russia[4] = Math.max(-100, russia[4] - 15);
    
    state.addHistory("🚫 خروج از NPT! انزوای کامل");
    
    // احتمال جنگ
    if (Math.random() < 0.5) {
        state.game_over = true;
        state.addHistory("💥 خروج از NPT باعث جنگ جهانی شد!");
    }
    
    return `🚫 *خروج از NPT!*\n\n` +
           `☢️ غنی‌سازی: ۹۰٪\n` +
           `🚫 تحریم: ۱۰۰٪\n` +
           `💵 دلار +۳۵,۰۰۰\n` +
           `🌍 انزوای کامل\n` +
           `⚠️ احتمال جنگ: ۵۰٪!`;
}

// ============================================
// 🕵️ عملیات ویژه
// ============================================

/**
 * ترور هدفمند
 */
function targetedAssassination(state, target, location) {
    const cost = 3;
    
    if (state.budget_toman < cost) {
        return "❌ بودجه کافی نیست!";
    }
    
    state.budget_toman -= cost;
    state.israel_tension += 8;
    state.popularity += 1;
    
    // احتمال لو رفتن
    if (Math.random() < 0.3) {
        state.sanctions = Math.min(100, state.sanctions + 15);
        state.popularity -= 3;
        state.addHistory(`🎯 ترور ${target} - لو رفت! تحریم +۱۵`);
        return `🎯 *ترور - لو رفت!*\n\nهدف: ${target}\n🚫 رسوایی بین‌المللی!\n⚠️ تحریم +۱۵`;
    }
    
    state.addHistory(`🎯 ترور موفق ${target} در ${location}`);
    return `🎯 *ترور موفق*\n\nهدف: ${target}\n📍 مکان: ${location}\n✅ بدون لو رفتن`;
}

/**
 * عملیات نفوذ
 */
function infiltrationOperation(state, countryCode) {
    const country = state.findCountry(countryCode);
    if (!country) return "❌ کشور پیدا نشد!";
    
    const cost = 2;
    state.budget_toman -= cost;
    
    if (Math.random() < 0.25) {
        country[4] = Math.max(-100, country[4] - 10);
        state.popularity -= 2;
        state.addHistory(`🕵️ نفوذ به ${country[0]} ${country[1]} - لو رفت!`);
        return `🕵️ *نفوذ - لو رفت!*\n\n${country[1]} ${country[0]}\n🚫 جاسوس دستگیر شد`;
    }
    
    country[4] = Math.max(-100, country[4] - 3);
    state.addHistory(`🕵️ نفوذ موفق به ${country[0]} ${country[1]}`);
    return `🕵️ *نفوذ موفق*\n\n${country[1]} ${country[0]}\n✅ اطلاعات جمع‌آوری شد`;
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