// economy.js - سیستم اقتصادی ایران (نسخه سخت)

const { MARKET_PRICES, LOCKS } = require('./config');

// ============================================
// 💰 عملیات‌های اقتصادی (با عواقب سنگین‌تر)
// ============================================

/**
 * افزایش صادرات نفت
 */
function increaseOilExport(state, amount = 0.3) {
    if (state.oil_export + amount <= state.oil_production) {
        state.oil_export += amount;
        const income = amount * 30 * state.oil_price;
        state.dollar_reserves += income / 1000;
        state.sanctions = Math.min(100, state.sanctions + 8); // بیشتر شد
        state.popularity += 0.5; // کمتر شد
        state.addHistory(`🛢️ صادرات نفت ${amount}+ میلیون بشکه (+${(income/1000).toFixed(1)} میلیارد دلار)`);
        return `✅ صادرات نفت افزایش یافت!\n💰 درآمد: ${(income/1000).toFixed(1)} میلیارد دلار\n⚠️ تحریم‌ها +۸`;
    }
    return "❌ ظرفیت تولید کافی نیست!";
}

/**
 * کاهش صادرات نفت
 */
function decreaseOilExport(state, amount = 0.3) {
    if (state.oil_export - amount >= 0) {
        state.oil_export -= amount;
        state.dollar_rate += 3000; // بیشتر شد
        state.popularity -= 2;
        state.budget_toman -= 2; // جدید: هزینه سیاسی
        state.addHistory(`📉 صادرات نفت ${amount}- میلیون بشکه`);
        return `✅ صادرات نفت کاهش یافت.\n⚠️ دلار +۳,۰۰۰ تومان\n💰 هزینه سیاسی: -۲ همت`;
    }
    return "❌ صادرات نمی‌تونه منفی بشه!";
}

/**
 * افزایش تولید نفت
 */
function increaseOilProduction(state, amount = 0.5) {
    state.budget_toman -= 8; // بیشتر شد
    state.oil_production += amount;
    state.gdp += 2; // کمتر شد
    state.popularity += 0.5;
    state.addHistory(`🏭 تولید نفت ${amount}+ میلیون بشکه (هزینه ۸ همت)`);
    return `✅ تولید نفت به ${state.oil_production} میلیون بشکه رسید\n💰 هزینه: ۸ همت`;
}

/**
 * تغییر نرخ ارز
 */
function changeCurrencyRate(state, increase = true) {
    if (increase) {
        state.dollar_rate += 8000; // بیشتر شد
        state.inflation += 5; // بیشتر شد
        state.popularity -= 5; // بیشتر شد
        state.budget_toman += 3; // کمتر شد
        state.addHistory("💵 افزایش نرخ ارز (+۸,۰۰۰ تومان)");
        return "💵 نرخ ارز افزایش یافت\n⚠️ تورم +۵٪\n⚠️ محبوبیت -۵٪";
    } else {
        if (state.dollar_reserves >= 3) { // نیاز بیشتر
            state.dollar_rate -= 5000;
            state.dollar_reserves -= 3;
            state.inflation -= 2;
            state.popularity += 3;
            state.addHistory("💵 کاهش نرخ ارز (-۵,۰۰۰ تومان، هزینه ۳ میلیارد دلار)");
            return "💵 نرخ ارز کاهش یافت\n✅ تورم -۲٪\n✅ محبوبیت +۳٪";
        }
        return "❌ ذخایر ارزی کافی نیست! (نیاز: ۳ میلیارد دلار)";
    }
}

/**
 * حمایت از تولید داخلی
 */
function supportDomesticProduction(state) {
    state.budget_toman -= 5; // بیشتر شد
    state.gdp += 5; // کمتر شد
    state.unemployment -= 0.5; // کمتر شد
    state.popularity += 2;
    state.inflation -= 1; // جدید
    state.addHistory("🏭 حمایت از تولید داخلی (GDP +۵, تورم -۱٪)");
    return "✅ تولید داخلی تقویت شد\n📈 GDP +۵\n👥 بیکاری -۰.۵٪\n📉 تورم -۱٪";
}

/**
 * افزایش واردات
 */
function increaseImports(state) {
    state.budget_toman -= 3; // بیشتر شد
    state.inflation -= 2; // کمتر شد
    state.dollar_reserves -= 1; // بیشتر شد
    state.sanctions += 3;
    state.popularity += 1;
    state.addHistory("📦 افزایش واردات (کاهش تورم)");
    return "📦 واردات افزایش یافت\n✅ تورم -۲٪\n⚠️ ذخایر ارزی -۱ میلیارد\n⚠️ تحریم +۳";
}

/**
 * کاهش واردات
 */
function decreaseImports(state) {
    state.inflation += 5; // بیشتر شد
    state.dollar_reserves += 0.5;
    state.popularity -= 3; // بیشتر شد
    state.gdp -= 2; // جدید
    state.addHistory("📦 کاهش واردات (صرفه‌جویی ارزی)");
    return "📦 واردات کاهش یافت\n⚠️ تورم +۵٪\n⚠️ محبوبیت -۳٪\n📉 GDP -۲";
}

/**
 * خرید از بازار داخلی (تومان)
 */
function buyDomestic(state, itemKey, quantity = 1) {
    const item = MARKET_PRICES.domestic[itemKey];
    if (!item) return "❌ کالا پیدا نشد!";
    
    const totalCost = item.toman * quantity;
    
    if (state.budget_toman >= totalCost / 1_000_000_000_000) {
        state.budget_toman -= totalCost / 1_000_000_000_000;
        
        switch(itemKey) {
            case 'missile_fath':
            case 'missile_kheibar':
                state.missiles += quantity * 8; // کمتر
                break;
            case 'drone_shahed136':
            case 'drone_shahed191':
                state.drones += quantity * 8;
                break;
            case 'drone_factory':
                state.drones += 80;
                break;
            case 'missile_factory':
                state.missiles += 40;
                break;
            case 'military_base':
                state.soldiers += 4000;
                break;
        }
        
        state.addHistory(`🛒 خرید ${item.emoji} ${item.name} (${(totalCost/1_000_000_000_000).toFixed(1)} همت)`);
        return `✅ ${item.emoji} ${item.name} خریداری شد!\n💰 هزینه: ${(totalCost/1_000_000_000_000).toFixed(1)} همت`;
    }
    
    return `❌ بودجه کافی نیست!\n💰 نیاز: ${(totalCost/1_000_000_000_000).toFixed(1)} همت\n💵 موجودی: ${state.budget_toman.toFixed(1)} همت`;
}

/**
 * خرید از بازار بین‌المللی (دلار)
 */
function buyInternational(state, itemKey, quantity = 1) {
    const item = MARKET_PRICES.international[itemKey];
    if (!item) return "❌ کالا پیدا نشد!";
    
    const totalCost = item.dollar * quantity;
    
    if (state.dollar_reserves * 1_000_000_000 >= totalCost) {
        state.dollar_reserves -= totalCost / 1_000_000_000;
        
        switch(itemKey) {
            case 'sukhoi35':
                state.missiles += 15;
                state.drones += 8;
                break;
            case 's400':
                state.missiles += 8;
                break;
            case 'spy_satellite':
                state.cyber_attacks_received = Math.max(0, state.cyber_attacks_received - 3);
                break;
            case 'submarine':
                state.missiles += 4;
                break;
            case 'wheat':
                state.popularity += 1;
                state.inflation -= 0.5;
                break;
            case 'vaccine':
                state.popularity += 3;
                break;
        }
        
        state.addHistory(`🛒 خرید ${item.emoji} ${item.name} (${(totalCost/1_000_000).toFixed(1)} میلیون دلار)`);
        return `✅ ${item.emoji} ${item.name} خریداری شد!\n💰 هزینه: ${(totalCost/1_000_000).toFixed(1)} میلیون دلار`;
    }
    
    return `❌ ذخایر ارزی کافی نیست!\n💰 نیاز: ${(totalCost/1_000_000).toFixed(1)} میلیون دلار`;
}

/**
 * فروش نفت به کشوری خاص
 */
function sellOil(state, countryCode, barrelsPerDay, pricePerBarrel = null) {
    const country = state.findCountry(countryCode);
    if (!country) return "❌ کشور پیدا نشد!";
    
    const price = pricePerBarrel || state.oil_price;
    const dailyIncome = barrelsPerDay * price;
    const monthlyIncome = dailyIncome * 30;
    
    if (barrelsPerDay <= state.oil_export) {
        state.oil_export -= barrelsPerDay;
        state.dollar_reserves += monthlyIncome / 1_000_000_000;
        country[4] = Math.min(100, country[4] + 4);
        country[5] += monthlyIncome / 1_000_000_000;
        
        state.addHistory(`🛢️ فروش ${barrelsPerDay} هزار بشکه نفت به ${country[0]} ${country[1]} (${(monthlyIncome/1_000_000).toFixed(1)} میلیون دلار)`);
        return `✅ ${country[1]} ${country[0]}\n🛢️ قرارداد نفت بسته شد!\n💰 درآمد ماهانه: ${(monthlyIncome/1_000_000).toFixed(1)} میلیون دلار\n📈 روابط +۴`;
    }
    
    return "❌ صادرات نفت کافی نیست!";
}

/**
 * تهاتر نفت با کالا
 */
function barterOil(state, countryCode, barrelsPerDay, itemNeeded) {
    const country = state.findCountry(countryCode);
    if (!country) return "❌ کشور پیدا نشد!";
    
    if (barrelsPerDay <= state.oil_export) {
        state.oil_export -= barrelsPerDay;
        country[4] = Math.min(100, country[4] + 8);
        
        if (itemNeeded === 'food') {
            state.inflation -= 3;
            state.popularity += 2;
        } else if (itemNeeded === 'weapons') {
            state.missiles += 40;
            state.drones += 80;
        } else if (itemNeeded === 'medicine') {
            state.popularity += 4;
        } else if (itemNeeded === 'technology') {
            state.gdp += 5;
            state.brain_drain -= 1;
        }
        
        state.addHistory(`🤝 تهاتر نفت با ${country[0]} ${country[1]} (${barrelsPerDay} هزار بشکه در برابر ${itemNeeded})`);
        return `✅ ${country[1]} ${country[0]}\n🤝 تهاتر موفق!\n🛢️ نفت در برابر ${itemNeeded}\n📈 روابط +۸`;
    }
    
    return "❌ صادرات نفت کافی نیست!";
}

/**
 * تغییر قیمت بنزین
 */
function changeGasPrice(state, newPrice) {
    const oldPrice = state.gas_price;
    state.gas_price = newPrice;
    
    if (newPrice > oldPrice) {
        state.popularity -= 15; // بیشتر شد
        state.budget_toman += 8; // کمتر شد
        state.inflation += 3;
        state.addHistory(`⛽ افزایش قیمت بنزین: ${oldPrice} → ${newPrice} تومان`);
        
        // احتمال اعتراض (بیشتر شد)
        if (Math.random() < 0.6) {
            const randomProvince = state.provinces[Math.floor(Math.random() * state.provinces.length)];
            randomProvince.has_protest = true;
            randomProvince.satisfaction -= 20;
            state.addHistory(`⚠️ اعتراضات بنزینی در ${randomProvince.name}!`);
        }
        
        return `⛽ بنزین گران شد!\n💰 درآمد: +۸ همت\n⚠️ محبوبیت -۱۵٪\n⚠️ احتمال اعتراض: بالا`;
    } else {
        state.popularity += 4; // کمتر شد
        state.budget_toman -= 10; // بیشتر شد
        state.addHistory(`⛽ کاهش قیمت بنزین: ${oldPrice} → ${newPrice} تومان`);
        return `⛽ بنزین ارزان شد!\n✅ محبوبیت +۴٪\n💰 هزینه: -۱۰ همت`;
    }
}

/**
 * استخراج یا فروش بیت‌کوین
 */
function manageBitcoin(state, action, amount = 100) {
    switch(action) {
        case 'mine':
            state.bitcoin += amount;
            state.budget_toman -= 1; // بیشتر شد (برق گرون)
            state.addHistory(`₿ استخراج ${amount} بیت‌کوین`);
            return `₿ ${amount} بیت‌کوین استخراج شد\n💰 هزینه برق: ۱ همت`;
            
        case 'sell':
            if (state.bitcoin >= amount) {
                state.bitcoin -= amount;
                const dollarValue = amount * 55000; // قیمت کمتر
                state.dollar_reserves += dollarValue / 1_000_000_000;
                state.addHistory(`₿ فروش ${amount} بیت‌کوین (+${(dollarValue/1_000_000_000).toFixed(1)} میلیارد دلار)`);
                return `₿ ${amount} بیت‌کوین فروخته شد\n💰 +${(dollarValue/1_000_000_000).toFixed(1)} میلیارد دلار`;
            }
            return "❌ بیت‌کوین کافی نیست!";
            
        case 'buy':
            const cost = amount * 55000;
            if (state.dollar_reserves * 1_000_000_000 >= cost) {
                state.dollar_reserves -= cost / 1_000_000_000;
                state.bitcoin += amount;
                state.addHistory(`₿ خرید ${amount} بیت‌کوین (${(cost/1_000_000_000).toFixed(1)} میلیارد دلار)`);
                return `₿ ${amount} بیت‌کوین خریداری شد`;
            }
            return "❌ دلار کافی نیست!";
            
        default:
            return "❌ عملیات نامعتبر!";
    }
}

/**
 * مدیریت طلا
 */
function manageGold(state, action, amount = 10) {
    switch(action) {
        case 'buy':
            const cost = amount * 70000; // گرون‌تر
            if (state.dollar_reserves * 1_000_000_000 >= cost) {
                state.dollar_reserves -= cost / 1_000_000_000;
                state.gold_tons += amount / 1000;
                state.addHistory(`🥇 خرید ${amount} کیلو طلا (${(cost/1_000_000).toFixed(1)} میلیون دلار)`);
                return `🥇 ${amount} کیلو طلا خریداری شد`;
            }
            return "❌ دلار کافی نیست!";
            
        case 'sell':
            const tonsToSell = amount / 1000;
            if (state.gold_tons >= tonsToSell) {
                state.gold_tons -= tonsToSell;
                const income = amount * 65000; // قیمت کمتر برای فروش
                state.dollar_reserves += income / 1_000_000_000;
                state.addHistory(`🥇 فروش ${amount} کیلو طلا (+${(income/1_000_000_000).toFixed(1)} میلیارد دلار)`);
                return `🥇 ${amount} کیلو طلا فروخته شد\n💰 +${(income/1_000_000_000).toFixed(1)} میلیارد دلار`;
            }
            return "❌ طلا کافی نیست!";
            
        default:
            return "❌ عملیات نامعتبر!";
    }
}

/**
 * مدیریت یارانه‌ها
 */
function manageSubsidies(state, increase = true) {
    if (increase) {
        state.budget_toman -= 20; // بیشتر شد
        state.popularity += 6; // کمتر شد
        state.inflation += 2;
        state.addHistory("💰 افزایش یارانه‌ها (هزینه ۲۰ همت)");
        return "💰 یارانه‌ها افزایش یافت\n✅ محبوبیت +۶٪\n⚠️ هزینه: -۲۰ همت\n⚠️ تورم +۲٪";
    } else {
        state.budget_toman += 20;
        state.popularity -= 15; // بیشتر شد
        state.addHistory("💰 کاهش یارانه‌ها (صرفه‌جویی ۲۰ همت)");
        
        // احتمال اعتراض
        if (Math.random() < 0.5) {
            const randomProvince = state.provinces[Math.floor(Math.random() * state.provinces.length)];
            randomProvince.has_protest = true;
            state.addHistory(`⚠️ اعتراضات معیشتی در ${randomProvince.name}!`);
        }
        
        return "💰 یارانه‌ها کاهش یافت\n⚠️ محبوبیت -۱۵٪\n✅ صرفه‌جویی: +۲۰ همت\n⚠️ احتمال اعتراض: بالا";
    }
}

/**
 * مالیات
 */
function manageTaxes(state, increase = true) {
    if (increase) {
        state.budget_toman += 15; // کمتر شد
        state.popularity -= 8; // بیشتر شد
        state.gdp -= 3;
        state.inflation += 1;
        state.addHistory("📋 افزایش مالیات (+۱۵ همت)");
        return "📋 مالیات افزایش یافت\n💰 درآمد: +۱۵ همت\n⚠️ محبوبیت -۸٪\n📉 GDP -۳";
    } else {
        state.budget_toman -= 12;
        state.popularity += 5; // کمتر شد
        state.gdp += 2;
        state.addHistory("📋 کاهش مالیات (-۱۲ همت)");
        return "📋 مالیات کاهش یافت\n✅ محبوبیت +۵٪\n📈 GDP +۲\n⚠️ درآمد: -۱۲ همت";
    }
}

/**
 * چاپ پول (با عواقب سنگین‌تر و قفل)
 */
function printMoney(state, amount = 50) {
    // بررسی قفل
    const lock = LOCKS.print_money;
    if (state.print_money_count >= lock.max_per_year) {
        return `❌ حداکثر ${lock.max_per_year} بار در سال می‌تونی پول چاپ کنی!\n📊 چاپ‌های امسال: ${state.print_money_count}/${lock.max_per_year}`;
    }
    
    state.print_money_count++;
    state.budget_toman += amount;
    state.inflation += 20; // بیشتر شد
    state.dollar_rate += 15000; // بیشتر شد
    state.popularity -= 8; // بیشتر شد
    state.corruption_level += 3; // جدید
    state.addHistory(`🏦 چاپ پول ${amount} همت (بار ${state.print_money_count}/${lock.max_per_year})`);
    
    // هشدار ویژه
    let warning = "";
    if (state.print_money_count >= 2) {
        warning = "\n\n⚠️ *هشدار:* یک بار دیگه چاپ کنی، تورم سه‌رقمی می‌شه!";
    }
    
    return `🏦 ${amount} همت پول چاپ شد\n⚠️ تورم +۲۰٪\n⚠️ دلار +۱۵,۰۰۰\n⚠️ محبوبیت -۸٪\n⚠️ فساد +۳٪\n📊 چاپ‌های امسال: ${state.print_money_count}/${lock.max_per_year}${warning}`;
}

/**
 * مبارزه با فساد (جدید)
 */
function fightCorruption(state) {
    state.budget_toman -= 3;
    state.corruption_level -= 8;
    state.popularity += 4;
    state.addHistory("🕵️ عملیات مبارزه با فساد (فساد -۸٪)");
    
    // احتمال لو رفتن اسامی
    if (Math.random() < 0.3) {
        state.popularity -= 2;
        return "🕵️ مبارزه با فساد\n✅ فساد -۸٪\n⚠️ برخی مقامات ناراضی شدن";
    }
    
    return "🕵️ مبارزه با فساد\n✅ فساد -۸٪\n✅ محبوبیت +۴٪\n💰 هزینه: ۳ همت";
}

/**
 * مدیریت بحران آب (جدید)
 */
function manageWaterCrisis(state, action = 'invest') {
    switch(action) {
        case 'invest':
            state.budget_toman -= 5;
            state.water_crisis -= 12;
            state.popularity += 3;
            state.addHistory("💧 سرمایه‌گذاری در زیرساخت آب (آب -۱۲٪)");
            return "💧 سرمایه‌گذاری آب\n✅ بحران آب -۱۲٪\n✅ محبوبیت +۳٪\n💰 هزینه: ۵ همت";
            
        case 'import':
            state.dollar_reserves -= 0.5;
            state.water_crisis -= 8;
            state.popularity += 2;
            state.addHistory("💧 واردات آب (هزینه ۰.۵ میلیارد دلار)");
            return "💧 واردات آب\n✅ بحران آب -۸٪\n💰 هزینه: ۰.۵ میلیارد دلار";
            
        case 'ration':
            state.water_crisis -= 5;
            state.popularity -= 3;
            state.addHistory("💧 جیره‌بندی آب");
            return "💧 جیره‌بندی آب\n✅ بحران آب -۵٪\n⚠️ محبوبیت -۳٪";
            
        default:
            return "❌ عملیات نامعتبر!";
    }
}

/**
 * جلوگیری از فرار مغزها (جدید)
 */
function stopBrainDrain(state) {
    state.budget_toman -= 4;
    state.brain_drain -= 2;
    state.popularity += 2;
    state.gdp += 3;
    state.addHistory("🧠 طرح ماندگاری نخبگان (فرار مغزها -۲٪)");
    return "🧠 طرح نخبگان\n✅ فرار مغزها -۲٪\n✅ محبوبیت +۲٪\n📈 GDP +۳\n💰 هزینه: ۴ همت";
}

// ============================================
// 📤 خروجی
// ============================================
module.exports = {
    increaseOilExport,
    decreaseOilExport,
    increaseOilProduction,
    changeCurrencyRate,
    supportDomesticProduction,
    increaseImports,
    decreaseImports,
    buyDomestic,
    buyInternational,
    sellOil,
    barterOil,
    changeGasPrice,
    manageBitcoin,
    manageGold,
    manageSubsidies,
    manageTaxes,
    printMoney,
    fightCorruption,
    manageWaterCrisis,
    stopBrainDrain
};