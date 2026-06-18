// economy.js - سیستم اقتصادی ایران

const { MARKET_PRICES, tomanToDollar, dollarToToman, oilToDollar, goldToDollar } = require('./config');

// ============================================
// 💰 عملیات‌های اقتصادی
// ============================================

/**
 * افزایش صادرات نفت
 */
function increaseOilExport(state, amount = 0.3) {
    if (state.oil_export + amount <= state.oil_production) {
        state.oil_export += amount;
        const income = amount * 30 * state.oil_price; // درآمد ماهانه (میلیون دلار)
        state.dollar_reserves += income / 1000;
        state.sanctions = Math.min(100, state.sanctions + 5);
        state.popularity += 1;
        state.addHistory(`🛢️ صادرات نفت ${amount}+ میلیون بشکه (+${(income/1000).toFixed(1)} میلیارد دلار)`);
        return `✅ صادرات نفت افزایش یافت!\n💰 درآمد: ${(income/1000).toFixed(1)} میلیارد دلار`;
    }
    return "❌ ظرفیت تولید کافی نیست!";
}

/**
 * کاهش صادرات نفت
 */
function decreaseOilExport(state, amount = 0.3) {
    if (state.oil_export - amount >= 0) {
        state.oil_export -= amount;
        state.dollar_rate += 2000;
        state.popularity -= 1;
        state.addHistory(`📉 صادرات نفت ${amount}- میلیون بشکه`);
        return `✅ صادرات نفت کاهش یافت.\n⚠️ دلار +۲,۰۰۰ تومان`;
    }
    return "❌ صادرات نمی‌تونه منفی بشه!";
}

/**
 * افزایش تولید نفت
 */
function increaseOilProduction(state, amount = 0.5) {
    state.budget_toman -= 5; // هزینه سرمایه‌گذاری
    state.oil_production += amount;
    state.gdp += 3;
    state.popularity += 1;
    state.addHistory(`🏭 تولید نفت ${amount}+ میلیون بشکه (هزینه ۵ همت)`);
    return `✅ تولید نفت به ${state.oil_production} میلیون بشکه رسید`;
}

/**
 * تغییر نرخ ارز (مداخله در بازار)
 */
function changeCurrencyRate(state, increase = true) {
    if (increase) {
        state.dollar_rate += 5000;
        state.inflation += 3;
        state.popularity -= 3;
        state.budget_toman += 5; // درآمد از فروش ارز
        state.addHistory("💵 افزایش نرخ ارز (+۵,۰۰۰ تومان)");
        return "💵 نرخ ارز افزایش یافت\n⚠️ تورم +۳٪";
    } else {
        if (state.dollar_reserves >= 2) {
            state.dollar_rate -= 5000;
            state.dollar_reserves -= 2;
            state.inflation -= 2;
            state.popularity += 2;
            state.addHistory("💵 کاهش نرخ ارز (-۵,۰۰۰ تومان، هزینه ۲ میلیارد دلار)");
            return "💵 نرخ ارز کاهش یافت\n✅ تورم -۲٪";
        }
        return "❌ ذخایر ارزی کافی نیست!";
    }
}

/**
 * حمایت از تولید داخلی
 */
function supportDomesticProduction(state) {
    state.budget_toman -= 3;
    state.gdp += 8;
    state.unemployment -= 1;
    state.popularity += 3;
    state.addHistory("🏭 حمایت از تولید داخلی (GDP +۸)");
    return "✅ تولید داخلی تقویت شد\n📈 GDP +۸ میلیارد دلار\n👥 بیکاری -۱٪";
}

/**
 * افزایش واردات
 */
function increaseImports(state) {
    state.budget_toman -= 2;
    state.inflation -= 3;
    state.dollar_reserves -= 0.5;
    state.sanctions += 2;
    state.popularity += 1;
    state.addHistory("📦 افزایش واردات (کاهش تورم)");
    return "📦 واردات افزایش یافت\n✅ تورم -۳٪\n⚠️ ذخایر ارزی -۰.۵ میلیارد";
}

/**
 * کاهش واردات
 */
function decreaseImports(state) {
    state.inflation += 3;
    state.dollar_reserves += 0.5;
    state.popularity -= 2;
    state.addHistory("📦 کاهش واردات (صرفه‌جویی ارزی)");
    return "📦 واردات کاهش یافت\n⚠️ تورم +۳٪\n✅ ذخایر ارزی +۰.۵ میلیارد";
}

/**
 * خرید از بازار داخلی (تومان)
 */
function buyDomestic(state, itemKey, quantity = 1) {
    const item = MARKET_PRICES.domestic[itemKey];
    if (!item) return "❌ کالا پیدا نشد!";
    
    const totalCost = item.toman * quantity;
    
    if (state.budget_toman >= totalCost / 1_000_000_000_000) { // تبدیل به همت
        state.budget_toman -= totalCost / 1_000_000_000_000;
        
        // اضافه کردن به موجودی
        switch(itemKey) {
            case 'missile_fath':
            case 'missile_kheibar':
                state.missiles += quantity * 10;
                break;
            case 'drone_shahed136':
            case 'drone_shahed191':
                state.drones += quantity * 10;
                break;
            case 'drone_factory':
                state.drones += 100;
                break;
            case 'missile_factory':
                state.missiles += 50;
                break;
            case 'military_base':
                state.soldiers += 5000;
                break;
        }
        
        state.addHistory(`🛒 خرید ${item.emoji} ${item.name} (${quantity} عدد، ${(totalCost/1_000_000_000_000).toFixed(1)} همت)`);
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
    
    if (state.dollar_reserves * 1_000_000_000 >= totalCost) { // تبدیل میلیارد به دلار
        state.dollar_reserves -= totalCost / 1_000_000_000;
        
        switch(itemKey) {
            case 'sukhoi35':
                state.missiles += 20;
                state.drones += 10;
                break;
            case 's400':
                state.missiles += 10;
                break;
            case 'spy_satellite':
                state.cyber_attacks_received = Math.max(0, state.cyber_attacks_received - 5);
                break;
            case 'submarine':
                state.missiles += 5;
                break;
            case 'wheat':
                state.popularity += 2;
                state.inflation -= 1;
                break;
            case 'vaccine':
                state.popularity += 5;
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
        country[4] = Math.min(100, country[4] + 5); // بهبود روابط
        country[5] += monthlyIncome / 1_000_000_000; // افزایش حجم تجارت
        
        state.addHistory(`🛢️ فروش ${barrelsPerDay} هزار بشکه نفت به ${country[0]} ${country[1]} (${(monthlyIncome/1_000_000).toFixed(1)} میلیون دلار)`);
        return `✅ ${country[1]} ${country[0]}\n🛢️ قرارداد نفت بسته شد!\n💰 درآمد ماهانه: ${(monthlyIncome/1_000_000).toFixed(1)} میلیون دلار`;
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
        country[4] = Math.min(100, country[4] + 10);
        
        // دریافت کالا
        if (itemNeeded === 'food') {
            state.inflation -= 2;
            state.popularity += 3;
        } else if (itemNeeded === 'weapons') {
            state.missiles += 50;
            state.drones += 100;
        } else if (itemNeeded === 'medicine') {
            state.popularity += 5;
        }
        
        state.addHistory(`🤝 تهاتر نفت با ${country[0]} ${country[1]} (${barrelsPerDay} هزار بشکه در برابر ${itemNeeded})`);
        return `✅ ${country[1]} ${country[0]}\n🤝 تهاتر موفق!\n🛢️ نفت در برابر ${itemNeeded}`;
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
        state.popularity -= 10;
        state.budget_toman += 10;
        state.inflation += 2;
        state.addHistory(`⛽ افزایش قیمت بنزین: ${oldPrice} → ${newPrice} تومان`);
        // احتمال اعتراض
        if (Math.random() < 0.3) {
            const randomProvince = state.provinces[Math.floor(Math.random() * state.provinces.length)];
            randomProvince.has_protest = true;
            state.addHistory(`⚠️ اعتراضات بنزینی در ${randomProvince.name}!`);
        }
        return `⛽ بنزین گران شد!\n💰 درآمد: +۱۰ همت\n⚠️ محبوبیت -۱۰٪`;
    } else {
        state.popularity += 5;
        state.budget_toman -= 8;
        state.addHistory(`⛽ کاهش قیمت بنزین: ${oldPrice} → ${newPrice} تومان`);
        return `⛽ بنزین ارزان شد!\n✅ محبوبیت +۵٪\n💰 هزینه: -۸ همت`;
    }
}

/**
 * استخراج یا فروش بیت‌کوین
 */
function manageBitcoin(state, action, amount = 100) {
    switch(action) {
        case 'mine':
            state.bitcoin += amount;
            state.budget_toman -= 0.5; // هزینه برق
            state.addHistory(`₿ استخراج ${amount} بیت‌کوین`);
            return `₿ ${amount} بیت‌کوین استخراج شد\n💰 هزینه برق: ۰.۵ همت`;
            
        case 'sell':
            if (state.bitcoin >= amount) {
                state.bitcoin -= amount;
                const dollarValue = amount * 60000; // فرض قیمت ۶۰,۰۰۰ دلار
                state.dollar_reserves += dollarValue / 1_000_000_000;
                state.addHistory(`₿ فروش ${amount} بیت‌کوین (+${(dollarValue/1_000_000_000).toFixed(1)} میلیارد دلار)`);
                return `₿ ${amount} بیت‌کوین فروخته شد\n💰 +${(dollarValue/1_000_000_000).toFixed(1)} میلیارد دلار`;
            }
            return "❌ بیت‌کوین کافی نیست!";
            
        case 'buy':
            const cost = amount * 60000;
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
            const cost = amount * 64000; // هر کیلو ۶۴,۰۰۰ دلار
            if (state.dollar_reserves * 1_000_000_000 >= cost) {
                state.dollar_reserves -= cost / 1_000_000_000;
                state.gold_tons += amount / 1000; // تبدیل کیلو به تن
                state.addHistory(`🥇 خرید ${amount} کیلو طلا (${(cost/1_000_000).toFixed(1)} میلیون دلار)`);
                return `🥇 ${amount} کیلو طلا خریداری شد`;
            }
            return "❌ دلار کافی نیست!";
            
        case 'sell':
            const tonsToSell = amount / 1000;
            if (state.gold_tons >= tonsToSell) {
                state.gold_tons -= tonsToSell;
                const income = amount * 64000;
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
        state.budget_toman -= 15;
        state.popularity += 8;
        state.inflation += 1;
        state.addHistory("💰 افزایش یارانه‌ها (هزینه ۱۵ همت)");
        return "💰 یارانه‌ها افزایش یافت\n✅ محبوبیت +۸٪\n⚠️ هزینه: -۱۵ همت";
    } else {
        state.budget_toman += 15;
        state.popularity -= 12;
        state.addHistory("💰 کاهش یارانه‌ها (صرفه‌جویی ۱۵ همت)");
        return "💰 یارانه‌ها کاهش یافت\n⚠️ محبوبیت -۱۲٪\n✅ صرفه‌جویی: +۱۵ همت";
    }
}

/**
 * مالیات
 */
function manageTaxes(state, increase = true) {
    if (increase) {
        state.budget_toman += 20;
        state.popularity -= 5;
        state.gdp -= 2;
        state.addHistory("📋 افزایش مالیات (+۲۰ همت)");
        return "📋 مالیات افزایش یافت\n💰 درآمد: +۲۰ همت\n⚠️ محبوبیت -۵٪";
    } else {
        state.budget_toman -= 15;
        state.popularity += 6;
        state.gdp += 3;
        state.addHistory("📋 کاهش مالیات (-۱۵ همت)");
        return "📋 مالیات کاهش یافت\n✅ محبوبیت +۶٪\n⚠️ درآمد: -۱۵ همت";
    }
}

/**
 * چاپ پول (با عواقب سنگین)
 */
function printMoney(state, amount = 50) {
    state.budget_toman += amount;
    state.inflation += 15;
    state.dollar_rate += 10000;
    state.popularity -= 5;
    state.addHistory(`🏦 چاپ پول ${amount} همت (تورم +۱۵٪)`);
    
    return `🏦 ${amount} همت پول چاپ شد\n⚠️ تورم +۱۵٪\n⚠️ دلار +۱۰,۰۰۰\n⚠️ محبوبیت -۵٪`;
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
    printMoney
};