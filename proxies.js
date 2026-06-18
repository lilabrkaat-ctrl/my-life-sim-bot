// proxies.js - سیستم گروه‌های نیابتی ایران

// ============================================
// 🏴 مدیریت گروه‌های نیابتی
// ============================================

/**
 * ساخت گروه نیابتی جدید
 */
function createProxy(state, name, countryCode, type) {
    const country = state.findCountry(countryCode);
    if (!country) return "❌ کشور هدف پیدا نشد!";
    
    // هزینه راه‌اندازی
    const setupCost = {
        military: { toman: 20, dollar: 50, forces: 5000, missiles: 100, drones: 50 },
        terrorist: { toman: 10, dollar: 30, forces: 2000, missiles: 50, drones: 20 },
        cyber: { toman: 5, dollar: 10, forces: 100, missiles: 0, drones: 0 },
        media: { toman: 3, dollar: 5, forces: 50, missiles: 0, drones: 0 },
        economic: { toman: 8, dollar: 15, forces: 200, missiles: 0, drones: 0 },
        spy: { toman: 15, dollar: 25, forces: 500, missiles: 0, drones: 10 }
    };
    
    const config = setupCost[type];
    if (!config) return "❌ نوع گروه نامعتبر!";
    
    // بررسی منابع
    if (state.budget_toman < config.toman) {
        return `❌ بودجه تومانی کافی نیست!\n💰 نیاز: ${config.toman} همت\n💵 موجودی: ${state.budget_toman.toFixed(1)} همت`;
    }
    
    if (config.dollar > 0 && state.dollar_reserves < config.dollar / 1000) {
        return `❌ دلار کافی نیست!\n💵 نیاز: ${config.dollar} میلیون دلار`;
    }
    
    if (config.forces > 0 && state.soldiers < config.forces) {
        return `❌ نیروی کافی نیست!\n👥 نیاز: ${config.forces}`;
    }
    
    if (config.missiles > 0 && state.missiles < config.missiles) {
        return `❌ موشک کافی نیست!\n🚀 نیاز: ${config.missiles}`;
    }
    
    if (config.drones > 0 && state.drones < config.drones) {
        return `❌ پهپاد کافی نیست!\n🛸 نیاز: ${config.drones}`;
    }
    
    // کسر منابع
    state.budget_toman -= config.toman;
    if (config.dollar > 0) state.dollar_reserves -= config.dollar / 1000;
    if (config.forces > 0) state.soldiers -= config.forces;
    if (config.missiles > 0) state.missiles -= config.missiles;
    if (config.drones > 0) state.drones -= config.drones;
    
    // ساخت گروه
    const newProxy = {
        name: name,
        emoji: country[1],
        country: country[0],
        type: type,
        budget_monthly: config.toman / 2, // هزینه ماهانه نصف هزینه راه‌اندازی
        forces: config.forces,
        missiles: config.missiles,
        drones: config.drones,
        active: true,
        level: 1,
        success_count: 0,
        fail_count: 0
    };
    
    state.proxies.push(newProxy);
    state.popularity += 1;
    
    const typeNames = {
        military: "🔫 نظامی",
        terrorist: "💣 تروریستی",
        cyber: "💻 سایبری",
        media: "📢 رسانه‌ای",
        economic: "💰 اقتصادی",
        spy: "🕵️ جاسوسی"
    };
    
    state.addHistory(`🏴 گروه نیابتی جدید: ${name} در ${country[0]} ${country[1]} (${typeNames[type]})`);
    
    return `🏴 *گروه نیابتی جدید ساخته شد!*\n\n` +
           `📛 نام: ${name}\n` +
           `📍 کشور هدف: ${country[1]} ${country[0]}\n` +
           `🎯 نوع: ${typeNames[type]}\n` +
           `👥 نیرو: ${config.forces.toLocaleString()}\n` +
           `🚀 موشک: ${config.missiles}\n` +
           `🛸 پهپاد: ${config.drones}\n` +
           `💰 هزینه: ${config.toman} همت + ${config.dollar} میلیون دلار`;
}

/**
 * تأمین مالی گروه نیابتی
 */
function fundProxy(state, proxyIndex, amount, currency = 'toman') {
    if (proxyIndex >= state.proxies.length || proxyIndex < 0) {
        return "❌ گروه نیابتی پیدا نشد!";
    }
    
    const proxy = state.proxies[proxyIndex];
    
    if (!proxy.active) {
        return "❌ این گروه غیرفعاله!";
    }
    
    switch(currency) {
        case 'toman':
            if (state.budget_toman < amount) {
                return `❌ بودجه تومانی کافی نیست!\n💰 نیاز: ${amount} همت`;
            }
            state.budget_toman -= amount;
            proxy.budget_monthly += amount / 2;
            break;
            
        case 'dollar':
            if (state.dollar_reserves < amount) {
                return `❌ دلار کافی نیست!\n💵 نیاز: ${amount} میلیارد دلار`;
            }
            state.dollar_reserves -= amount;
            proxy.budget_monthly += amount * 85; // تبدیل به همت
            break;
            
        case 'oil':
            const barrelsNeeded = amount * 1000; // هزار بشکه
            if (state.oil_export < barrelsNeeded / 1000000) {
                return `❌ نفت کافی نیست!\n🛢️ نیاز: ${barrelsNeeded.toLocaleString()} بشکه`;
            }
            state.oil_export -= barrelsNeeded / 1000000;
            proxy.budget_monthly += amount * 0.5;
            break;
            
        case 'gold':
            if (state.gold_tons < amount / 1000) {
                return `❌ طلا کافی نیست!\n🥇 نیاز: ${amount} کیلو`;
            }
            state.gold_tons -= amount / 1000;
            proxy.budget_monthly += amount * 5;
            break;
            
        case 'bitcoin':
            if (state.bitcoin < amount) {
                return `❌ بیت‌کوین کافی نیست!\n₿ نیاز: ${amount} عدد`;
            }
            state.bitcoin -= amount;
            proxy.budget_monthly += amount * 5;
            break;
            
        default:
            return "❌ واحد پولی نامعتبر!";
    }
    
    proxy.forces += Math.floor(Math.random() * 1000) + 500;
    proxy.missiles += Math.floor(Math.random() * 50) + 10;
    proxy.drones += Math.floor(Math.random() * 100) + 20;
    
    state.addHistory(`💰 تأمین مالی ${proxy.name} (${amount} ${currency})`);
    
    return `💰 *تأمین مالی ${proxy.name}*\n\n` +
           `💵 مبلغ: ${amount} ${currency}\n` +
           `👥 نیرو: ${proxy.forces.toLocaleString()}\n` +
           `🚀 موشک: ${proxy.missiles}\n` +
           `🛸 پهپاد: ${proxy.drones}\n` +
           `📊 بودجه ماهانه: ${proxy.budget_monthly.toFixed(1)} همت`;
}

/**
 * ارسال سلاح به گروه نیابتی
 */
function sendWeapons(state, proxyIndex, weaponType, count) {
    if (proxyIndex >= state.proxies.length || proxyIndex < 0) {
        return "❌ گروه نیابتی پیدا نشد!";
    }
    
    const proxy = state.proxies[proxyIndex];
    
    if (!proxy.active) {
        return "❌ این گروه غیرفعاله!";
    }
    
    switch(weaponType) {
        case 'missile':
            if (state.missiles < count) {
                return `❌ موشک کافی نیست!\n🚀 موجودی: ${state.missiles}`;
            }
            state.missiles -= count;
            proxy.missiles += count;
            break;
            
        case 'drone':
            if (state.drones < count) {
                return `❌ پهپاد کافی نیست!\n🛸 موجودی: ${state.drones}`;
            }
            state.drones -= count;
            proxy.drones += count;
            break;
            
        case 'force':
            if (state.soldiers < count) {
                return `❌ نیروی کافی نیست!\n👥 موجودی: ${state.soldiers}`;
            }
            state.soldiers -= count;
            proxy.forces += count;
            break;
            
        default:
            return "❌ نوع سلاح نامعتبر!";
    }
    
    state.popularity += 1;
    state.addHistory(`📦 ارسال ${count} ${weaponType} به ${proxy.name}`);
    
    return `📦 *ارسال سلاح به ${proxy.name}*\n\n` +
           `🎯 نوع: ${weaponType}\n` +
           `📊 تعداد: ${count.toLocaleString()}\n` +
           `✅ تحویل موفق`;
}

/**
 * فعال‌سازی عملیات گروه نیابتی
 */
function activateProxy(state, proxyIndex, operation) {
    if (proxyIndex >= state.proxies.length || proxyIndex < 0) {
        return "❌ گروه نیابتی پیدا نشد!";
    }
    
    const proxy = state.proxies[proxyIndex];
    
    if (!proxy.active) {
        return "❌ این گروه غیرفعاله!";
    }
    
    // هزینه عملیات
    const operationCost = proxy.budget_monthly / 4;
    state.budget_toman -= operationCost;
    
    // احتمال موفقیت بر اساس سطح گروه
    const successChance = 40 + (proxy.level * 10);
    const success = Math.random() * 100 < successChance;
    
    if (success) {
        proxy.success_count++;
        proxy.level = Math.min(10, proxy.level + 1);
        state.popularity += 2;
        
        // اثر روی کشور هدف
        const targetCountry = state.countries.find(c => c[0] === proxy.country);
        if (targetCountry) {
            targetCountry[4] = Math.max(-100, targetCountry[4] - 5);
        }
        
        state.addHistory(`✅ عملیات ${proxy.name}: ${operation} - موفق`);
        
        return `✅ *عملیات ${proxy.name}*\n\n` +
               `🎯 عملیات: ${operation}\n` +
               `📊 نتیجه: موفقیت‌آمیز\n` +
               `⭐ سطح گروه: ${proxy.level}\n` +
               `✅ محبوبیت +۲٪`;
    } else {
        proxy.fail_count++;
        proxy.forces -= Math.floor(proxy.forces * 0.1);
        proxy.missiles -= Math.floor(proxy.missiles * 0.05);
        proxy.drones -= Math.floor(proxy.drones * 0.05);
        state.popularity -= 1;
        
        state.addHistory(`❌ شکست عملیات ${proxy.name}: ${operation}`);
        
        return `❌ *عملیات ${proxy.name}*\n\n` +
               `🎯 عملیات: ${operation}\n` +
               `📊 نتیجه: شکست\n` +
               `👥 تلفات: ${Math.floor(proxy.forces * 0.1)} نیرو\n` +
               `⚠️ محبوبیت -۱٪`;
    }
}

/**
 * غیرفعال کردن گروه نیابتی
 */
function deactivateProxy(state, proxyIndex) {
    if (proxyIndex >= state.proxies.length || proxyIndex < 0) {
        return "❌ گروه نیابتی پیدا نشد!";
    }
    
    const proxy = state.proxies[proxyIndex];
    proxy.active = false;
    
    state.budget_toman += proxy.budget_monthly / 2; // برگشت نصف بودجه
    state.popularity -= 1;
    
    state.addHistory(`🚫 غیرفعال کردن ${proxy.name}`);
    
    return `🚫 *${proxy.name} غیرفعال شد*\n\n` +
           `💰 برگشت بودجه: ${(proxy.budget_monthly/2).toFixed(1)} همت`;
}

/**
 * فعال‌سازی مجدد گروه
 */
function reactivateProxy(state, proxyIndex) {
    if (proxyIndex >= state.proxies.length || proxyIndex < 0) {
        return "❌ گروه نیابتی پیدا نشد!";
    }
    
    const proxy = state.proxies[proxyIndex];
    
    if (proxy.active) {
        return "❌ این گروه هم‌اکنون فعاله!";
    }
    
    const reactivationCost = 5; // همت
    if (state.budget_toman < reactivationCost) {
        return `❌ بودجه کافی نیست!\n💰 نیاز: ${reactivationCost} همت`;
    }
    
    state.budget_toman -= reactivationCost;
    proxy.active = true;
    
    state.addHistory(`🔄 فعال‌سازی مجدد ${proxy.name}`);
    
    return `🔄 *${proxy.name} دوباره فعال شد*\n\n` +
           `💰 هزینه: ${reactivationCost} همت`;
}

/**
 * ادغام دو گروه نیابتی
 */
function mergeProxies(state, proxyIndex1, proxyIndex2) {
    if (proxyIndex1 >= state.proxies.length || proxyIndex2 >= state.proxies.length) {
        return "❌ گروه نیابتی پیدا نشد!";
    }
    
    const proxy1 = state.proxies[proxyIndex1];
    const proxy2 = state.proxies[proxyIndex2];
    
    // ادغام منابع
    proxy1.forces += proxy2.forces;
    proxy1.missiles += proxy2.missiles;
    proxy1.drones += proxy2.drones;
    proxy1.budget_monthly += proxy2.budget_monthly;
    proxy1.level = Math.max(proxy1.level, proxy2.level);
    proxy1.success_count += proxy2.success_count;
    proxy1.fail_count += proxy2.fail_count;
    
    // حذف گروه دوم
    state.proxies.splice(proxyIndex2, 1);
    
    state.addHistory(`🔀 ادغام ${proxy2.name} در ${proxy1.name}`);
    
    return `🔀 *ادغام گروه‌های نیابتی*\n\n` +
           `✅ ${proxy2.name} در ${proxy1.name} ادغام شد\n` +
           `👥 نیروی کل: ${proxy1.forces.toLocaleString()}\n` +
           `🚀 موشک: ${proxy1.missiles}\n` +
           `🛸 پهپاد: ${proxy1.drones}`;
}

/**
 * گزارش گروه‌های نیابتی
 */
function getProxiesReport(state) {
    if (state.proxies.length === 0) {
        return "🏴 هیچ گروه نیابتی فعالی وجود نداره!";
    }
    
    let report = "🏴 *گروه‌های نیابتی ایران*\n━━━━━━━━━━━━━━━━━━\n\n";
    
    state.proxies.forEach((proxy, index) => {
        const status = proxy.active ? "✅ فعال" : "🚫 غیرفعال";
        report += `${index + 1}. ${proxy.emoji} *${proxy.name}*\n`;
        report += `   📍 کشور: ${proxy.country}\n`;
        report += `   📊 وضعیت: ${status}\n`;
        report += `   ⭐ سطح: ${proxy.level}/10\n`;
        report += `   👥 نیرو: ${proxy.forces.toLocaleString()}\n`;
        report += `   🚀 موشک: ${proxy.missiles.toLocaleString()}\n`;
        report += `   🛸 پهپاد: ${proxy.drones.toLocaleString()}\n`;
        report += `   💰 بودجه: ${proxy.budget_monthly.toFixed(1)} همت/ماه\n`;
        report += `   ✅ موفق: ${proxy.success_count} | ❌ شکست: ${proxy.fail_count}\n\n`;
    });
    
    return report;
}

/**
 * پرداخت هزینه ماهانه همه گروه‌ها
 */
function payAllProxies(state) {
    let totalCost = 0;
    
    state.proxies.forEach(proxy => {
        if (proxy.active) {
            totalCost += proxy.budget_monthly;
        }
    });
    
    if (state.budget_toman < totalCost) {
        // کمبود بودجه - گروه‌ها ضعیف می‌شن
        state.proxies.forEach(proxy => {
            if (proxy.active) {
                proxy.forces -= Math.floor(proxy.forces * 0.05);
                proxy.morale = 'low';
            }
        });
        
        state.addHistory(`⚠️ کمبود بودجه برای گروه‌های نیابتی! (نیاز: ${totalCost.toFixed(1)} همت)`);
        
        return `⚠️ *کمبود بودجه!*\n\n` +
               `💰 نیاز: ${totalCost.toFixed(1)} همت\n` +
               `💵 موجودی: ${state.budget_toman.toFixed(1)} همت\n` +
               `⚠️ گروه‌ها تضعیف شدن`;
    }
    
    state.budget_toman -= totalCost;
    
    state.proxies.forEach(proxy => {
        if (proxy.active) {
            proxy.morale = 'high';
            proxy.forces += Math.floor(Math.random() * 100);
        }
    });
    
    state.addHistory(`💰 پرداخت حقوق گروه‌های نیابتی (${totalCost.toFixed(1)} همت)`);
    
    return `💰 *حقوق گروه‌ها پرداخت شد*\n\n` +
           `💵 هزینه کل: ${totalCost.toFixed(1)} همت\n` +
           `✅ همه گروه‌ها تقویت شدن`;
}

// ============================================
// 📤 خروجی
// ============================================
module.exports = {
    createProxy,
    fundProxy,
    sendWeapons,
    activateProxy,
    deactivateProxy,
    reactivateProxy,
    mergeProxies,
    getProxiesReport,
    payAllProxies
};