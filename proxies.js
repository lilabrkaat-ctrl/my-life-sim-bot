// proxies.js - سیستم گروه‌های نیابتی ایران (نسخه سخت)

// ============================================
// 🏴 مدیریت گروه‌های نیابتی
// ============================================

/**
 * ساخت گروه نیابتی جدید (گرون‌تر و سخت‌تر)
 */
function createProxy(state, name, countryCode, type) {
    const country = state.findCountry(countryCode);
    if (!country) return "❌ کشور هدف پیدا نشد!";
    
    // هزینه راه‌اندازی (بیشتر)
    const setupCost = {
        military: { toman: 30, dollar: 80, forces: 8000, missiles: 150, drones: 80 },
        terrorist: { toman: 15, dollar: 50, forces: 3000, missiles: 80, drones: 30 },
        cyber: { toman: 8, dollar: 20, forces: 200, missiles: 0, drones: 0 },
        media: { toman: 5, dollar: 10, forces: 100, missiles: 0, drones: 0 },
        economic: { toman: 12, dollar: 25, forces: 300, missiles: 0, drones: 0 },
        spy: { toman: 20, dollar: 40, forces: 800, missiles: 0, drones: 15 }
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
        return `❌ نیروی کافی نیست!\n👥 نیاز: ${config.forces.toLocaleString()}`;
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
    
    // احتمال لو رفتن (جدید)
    const leakChance = 15;
    const leaked = Math.random() * 100 < leakChance;
    
    // ساخت گروه
    const newProxy = {
        name: name,
        emoji: country[1],
        country: country[0],
        countryCode: countryCode,
        type: type,
        budget_monthly: config.toman / 1.5,
        forces: config.forces,
        missiles: config.missiles,
        drones: config.drones,
        active: true,
        level: 1,
        success_count: 0,
        fail_count: 0,
        morale: 'normal',
        exposed: leaked
    };
    
    state.proxies.push(newProxy);
    
    if (!leaked) {
        state.popularity += 1;
    } else {
        state.popularity -= 2;
        state.sanctions = Math.min(100, state.sanctions + 5);
    }
    
    const typeNames = {
        military: "🔫 نظامی",
        terrorist: "💣 تروریستی",
        cyber: "💻 سایبری",
        media: "📢 رسانه‌ای",
        economic: "💰 اقتصادی",
        spy: "🕵️ جاسوسی"
    };
    
    state.addHistory(`🏴 گروه نیابتی: ${name} در ${country[0]} ${country[1]} (${typeNames[type]})${leaked ? ' - لو رفت!' : ''}`);
    
    let result = `🏴 *گروه نیابتی جدید*\n\n` +
           `📛 نام: ${name}\n` +
           `📍 کشور: ${country[1]} ${country[0]}\n` +
           `🎯 نوع: ${typeNames[type]}\n` +
           `👥 نیرو: ${config.forces.toLocaleString()}\n` +
           `🚀 موشک: ${config.missiles}\n` +
           `🛸 پهپاد: ${config.drones}\n` +
           `💰 هزینه: ${config.toman} همت + ${config.dollar} میلیون دلار`;
    
    if (leaked) {
        result += `\n\n🚨 *گروه لو رفت!*\n⚠️ محبوبیت -۲٪\n🚫 تحریم +۵`;
    }
    
    return result;
}

/**
 * تأمین مالی گروه نیابتی (با ریسک لو رفتن)
 */
function fundProxy(state, proxyIndex, amount, currency = 'toman') {
    if (proxyIndex >= state.proxies.length || proxyIndex < 0) {
        return "❌ گروه پیدا نشد!";
    }
    
    const proxy = state.proxies[proxyIndex];
    
    if (!proxy.active) {
        return "❌ گروه غیرفعاله!";
    }
    
    // بررسی منابع
    switch(currency) {
        case 'toman':
            if (state.budget_toman < amount) {
                return `❌ بودجه کافی نیست!\n💰 نیاز: ${amount} همت`;
            }
            state.budget_toman -= amount;
            proxy.budget_monthly += amount / 2;
            break;
            
        case 'dollar':
            if (state.dollar_reserves < amount) {
                return `❌ دلار کافی نیست!\n💵 نیاز: ${amount} میلیارد`;
            }
            state.dollar_reserves -= amount;
            proxy.budget_monthly += amount * 80;
            break;
            
        case 'oil':
            const barrelsNeeded = amount * 1000;
            if (state.oil_export < barrelsNeeded / 1000000) {
                return `❌ نفت کافی نیست!\n🛢️ نیاز: ${barrelsNeeded.toLocaleString()} بشکه`;
            }
            state.oil_export -= barrelsNeeded / 1000000;
            proxy.budget_monthly += amount * 0.4;
            break;
            
        case 'gold':
            if (state.gold_tons < amount / 1000) {
                return `❌ طلا کافی نیست!\n🥇 نیاز: ${amount} کیلو`;
            }
            state.gold_tons -= amount / 1000;
            proxy.budget_monthly += amount * 4;
            break;
            
        case 'bitcoin':
            if (state.bitcoin < amount) {
                return `❌ بیت‌کوین کافی نیست!\n₿ نیاز: ${amount}`;
            }
            state.bitcoin -= amount;
            proxy.budget_monthly += amount * 4;
            break;
            
        default:
            return "❌ واحد نامعتبر!";
    }
    
    // تقویت گروه
    proxy.forces += Math.floor(Math.random() * 800) + 300;
    proxy.missiles += Math.floor(Math.random() * 30) + 5;
    proxy.drones += Math.floor(Math.random() * 60) + 10;
    proxy.morale = 'high';
    
    // ریسک لو رفتن (بیشتر برای دلار)
    const leakChance = currency === 'dollar' ? 20 : 10;
    const leaked = Math.random() * 100 < leakChance;
    
    if (leaked) {
        proxy.exposed = true;
        state.sanctions = Math.min(100, state.sanctions + 3);
        state.popularity -= 1;
        state.addHistory(`💰 تأمین مالی ${proxy.name} لو رفت!`);
        
        return `💰 *تأمین مالی ${proxy.name}*\n\n` +
               `💵 مبلغ: ${amount} ${currency}\n` +
               `👥 نیرو: ${proxy.forces.toLocaleString()}\n` +
               `🚀 موشک: ${proxy.missiles}\n` +
               `🛸 پهپاد: ${proxy.drones}\n` +
               `🚨 *لو رفت!*\n⚠️ تحریم +۳`;
    }
    
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
        return "❌ گروه پیدا نشد!";
    }
    
    const proxy = state.proxies[proxyIndex];
    
    if (!proxy.active) {
        return "❌ گروه غیرفعاله!";
    }
    
    switch(weaponType) {
        case 'missile':
            if (state.missiles < count) {
                return `❌ موشک کافی نیست!\n🚀 موجودی: ${state.missiles.toLocaleString()}`;
            }
            state.missiles -= count;
            proxy.missiles += count;
            break;
            
        case 'drone':
            if (state.drones < count) {
                return `❌ پهپاد کافی نیست!\n🛸 موجودی: ${state.drones.toLocaleString()}`;
            }
            state.drones -= count;
            proxy.drones += count;
            break;
            
        case 'force':
            if (state.soldiers < count) {
                return `❌ نیروی کافی نیست!\n👥 موجودی: ${state.soldiers.toLocaleString()}`;
            }
            state.soldiers -= count;
            proxy.forces += count;
            break;
            
        default:
            return "❌ نوع سلاح نامعتبر!";
    }
    
    // ریسک لو رفتن هنگام ارسال
    const leakChance = 12;
    const leaked = Math.random() * 100 < leakChance;
    
    if (leaked) {
        proxy.exposed = true;
        state.sanctions = Math.min(100, state.sanctions + 5);
        state.addHistory(`📦 ارسال ${count} ${weaponType} به ${proxy.name} - لو رفت!`);
        
        return `📦 *ارسال سلاح - لو رفت!*\n\n` +
               `🎯 ${proxy.name}\n` +
               `📊 ${count.toLocaleString()} ${weaponType}\n` +
               `🚫 تحریم +۵`;
    }
    
    state.popularity += 1;
    state.addHistory(`📦 ارسال ${count} ${weaponType} به ${proxy.name}`);
    
    return `📦 *ارسال سلاح*\n\n` +
           `🎯 ${proxy.name}\n` +
           `📊 ${count.toLocaleString()} ${weaponType}\n` +
           `✅ تحویل مخفیانه`;
}

/**
 * فعال‌سازی عملیات گروه نیابتی (با شانس شکست بیشتر)
 */
function activateProxy(state, proxyIndex, operation) {
    if (proxyIndex >= state.proxies.length || proxyIndex < 0) {
        return "❌ گروه پیدا نشد!";
    }
    
    const proxy = state.proxies[proxyIndex];
    
    if (!proxy.active) {
        return "❌ گروه غیرفعاله!";
    }
    
    // هزینه عملیات
    const operationCost = proxy.budget_monthly / 3;
    state.budget_toman -= operationCost;
    
    // احتمال موفقیت (کمتر)
    let successChance = 35 + (proxy.level * 8);
    
    // اگر گروه لو رفته باشه، شانس کمتر
    if (proxy.exposed) {
        successChance -= 20;
    }
    
    // اگر روحیه پایین باشه
    if (proxy.morale === 'low') {
        successChance -= 15;
    }
    
    const success = Math.random() * 100 < successChance;
    
    if (success) {
        proxy.success_count++;
        proxy.level = Math.min(10, proxy.level + 1);
        state.popularity += 2;
        
        const targetCountry = state.countries.find(c => c[0] === proxy.country);
        if (targetCountry) {
            targetCountry[4] = Math.max(-100, targetCountry[4] - 8);
        }
        
        state.addHistory(`✅ عملیات ${proxy.name}: ${operation}`);
        
        return `✅ *عملیات ${proxy.name}*\n\n` +
               `🎯 ${operation}\n` +
               `📊 موفقیت!\n` +
               `⭐ سطح: ${proxy.level}/10\n` +
               `✅ محبوبیت +۲٪`;
    } else {
        proxy.fail_count++;
        proxy.forces -= Math.floor(proxy.forces * 0.15);
        proxy.missiles -= Math.floor(proxy.missiles * 0.1);
        proxy.drones -= Math.floor(proxy.drones * 0.1);
        proxy.morale = 'low';
        state.popularity -= 2;
        
        // احتمال لو رفتن در شکست
        if (Math.random() < 0.4) {
            proxy.exposed = true;
            state.sanctions = Math.min(100, state.sanctions + 8);
            state.addHistory(`❌ شکست ${proxy.name}: ${operation} - لو رفت!`);
            
            return `❌ *عملیات ${proxy.name}*\n\n` +
                   `🎯 ${operation}\n` +
                   `📊 شکست + لو رفت!\n` +
                   `👥 تلفات: ${Math.floor(proxy.forces * 0.15)} نفر\n` +
                   `🚫 تحریم +۸\n` +
                   `⚠️ محبوبیت -۲٪`;
        }
        
        state.addHistory(`❌ شکست ${proxy.name}: ${operation}`);
        
        return `❌ *عملیات ${proxy.name}*\n\n` +
               `🎯 ${operation}\n` +
               `📊 شکست\n` +
               `👥 تلفات: ${Math.floor(proxy.forces * 0.15)} نفر\n` +
               `⚠️ محبوبیت -۲٪`;
    }
}

/**
 * غیرفعال کردن گروه
 */
function deactivateProxy(state, proxyIndex) {
    if (proxyIndex >= state.proxies.length || proxyIndex < 0) {
        return "❌ گروه پیدا نشد!";
    }
    
    const proxy = state.proxies[proxyIndex];
    proxy.active = false;
    
    state.budget_toman += proxy.budget_monthly / 3;
    state.popularity -= 1;
    
    state.addHistory(`🚫 غیرفعال کردن ${proxy.name}`);
    
    return `🚫 *${proxy.name} غیرفعال شد*\n\n💰 برگشت: ${(proxy.budget_monthly/3).toFixed(1)} همت`;
}

/**
 * فعال‌سازی مجدد گروه
 */
function reactivateProxy(state, proxyIndex) {
    if (proxyIndex >= state.proxies.length || proxyIndex < 0) {
        return "❌ گروه پیدا نشد!";
    }
    
    const proxy = state.proxies[proxyIndex];
    
    if (proxy.active) {
        return "❌ گروه فعاله!";
    }
    
    const cost = 8;
    if (state.budget_toman < cost) {
        return `❌ بودجه کافی نیست!\n💰 نیاز: ${cost} همت`;
    }
    
    state.budget_toman -= cost;
    proxy.active = true;
    proxy.morale = 'normal';
    
    state.addHistory(`🔄 فعال‌سازی مجدد ${proxy.name}`);
    
    return `🔄 *${proxy.name} فعال شد*\n\n💰 هزینه: ${cost} همت`;
}

/**
 * ادغام دو گروه (با هزینه)
 */
function mergeProxies(state, proxyIndex1, proxyIndex2) {
    if (proxyIndex1 >= state.proxies.length || proxyIndex2 >= state.proxies.length) {
        return "❌ گروه پیدا نشد!";
    }
    
    const cost = 3;
    if (state.budget_toman < cost) {
        return `❌ بودجه کافی نیست!\n💰 نیاز: ${cost} همت`;
    }
    
    state.budget_toman -= cost;
    
    const proxy1 = state.proxies[proxyIndex1];
    const proxy2 = state.proxies[proxyIndex2];
    
    proxy1.forces += proxy2.forces;
    proxy1.missiles += proxy2.missiles;
    proxy1.drones += proxy2.drones;
    proxy1.budget_monthly += proxy2.budget_monthly;
    proxy1.level = Math.max(proxy1.level, proxy2.level);
    proxy1.success_count += proxy2.success_count;
    proxy1.fail_count += proxy2.fail_count;
    proxy1.exposed = proxy1.exposed || proxy2.exposed;
    
    state.proxies.splice(proxyIndex2, 1);
    
    state.addHistory(`🔀 ادغام ${proxy2.name} در ${proxy1.name}`);
    
    return `🔀 *ادغام موفق*\n\n` +
           `✅ ${proxy2.name} → ${proxy1.name}\n` +
           `👥 نیرو: ${proxy1.forces.toLocaleString()}\n` +
           `🚀 موشک: ${proxy1.missiles}\n` +
           `🛸 پهپاد: ${proxy1.drones}\n` +
           `💰 هزینه: ${cost} همت`;
}

/**
 * حذف کامل گروه (جدید)
 */
function deleteProxy(state, proxyIndex) {
    if (proxyIndex >= state.proxies.length || proxyIndex < 0) {
        return "❌ گروه پیدا نشد!";
    }
    
    const proxy = state.proxies[proxyIndex];
    
    // برگشت بخشی از منابع
    state.soldiers += Math.floor(proxy.forces * 0.3);
    state.missiles += Math.floor(proxy.missiles * 0.2);
    state.drones += Math.floor(proxy.drones * 0.2);
    
    const name = proxy.name;
    state.proxies.splice(proxyIndex, 1);
    
    state.addHistory(`💀 حذف کامل ${name}`);
    
    return `💀 *${name} حذف شد*\n\n` +
           `👥 نیروی برگشتی: ${Math.floor(proxy.forces * 0.3).toLocaleString()}\n` +
           `🚀 موشک: +${Math.floor(proxy.missiles * 0.2)}\n` +
           `🛸 پهپاد: +${Math.floor(proxy.drones * 0.2)}`;
}

/**
 * پاکسازی ردپا (جدید - مخفی کردن گروه لو رفته)
 */
function cleanTraces(state, proxyIndex) {
    if (proxyIndex >= state.proxies.length || proxyIndex < 0) {
        return "❌ گروه پیدا نشد!";
    }
    
    const proxy = state.proxies[proxyIndex];
    
    if (!proxy.exposed) {
        return "❌ گروه که لو نرفته!";
    }
    
    const cost = 5;
    if (state.budget_toman < cost) {
        return `❌ بودجه کافی نیست!\n💰 نیاز: ${cost} همت`;
    }
    
    state.budget_toman -= cost;
    
    // شانس پاکسازی
    if (Math.random() < 0.7) {
        proxy.exposed = false;
        state.addHistory(`🧹 پاکسازی ردپای ${proxy.name}`);
        return `🧹 *ردپا پاک شد*\n\n✅ ${proxy.name} مخفی شد\n💰 هزینه: ${cost} همت`;
    }
    
    state.addHistory(`❌ شکست پاکسازی ${proxy.name}`);
    return `❌ *پاکسازی شکست خورد*\n\n⚠️ ${proxy.name} همچنان لو رفته‌ست`;
}

/**
 * گزارش گروه‌های نیابتی
 */
function getProxiesReport(state) {
    if (state.proxies.length === 0) {
        return "🏴 هیچ گروه نیابتی وجود نداره!\n\nبا گزینه «ساخت گروه جدید» یه گروه بساز.";
    }
    
    let report = "🏴 *گروه‌های نیابتی ایران*\n━━━━━━━━━━━━━━━━━━\n\n";
    
    state.proxies.forEach((proxy, index) => {
        const status = proxy.active ? "✅" : "🚫";
        const exposed = proxy.exposed ? " 🔴لو رفته" : " 🟢مخفی";
        const morale = proxy.morale === 'high' ? '💪' : proxy.morale === 'low' ? '😞' : '😐';
        
        report += `${index + 1}. ${proxy.emoji} *${proxy.name}*\n`;
        report += `   📍 ${proxy.country} | ${status}${exposed} | ${morale}\n`;
        report += `   ⭐ ${proxy.level}/10 | 👥 ${proxy.forces.toLocaleString()}\n`;
        report += `   🚀 ${proxy.missiles} | 🛸 ${proxy.drones}\n`;
        report += `   💰 ${proxy.budget_monthly.toFixed(1)} همت/ماه\n`;
        report += `   ✅${proxy.success_count} ❌${proxy.fail_count}\n\n`;
    });
    
    report += `━━━━━━━━━━━━━━━━━━\n`;
    report += `💰 بودجه کل: ${state.proxies.reduce((sum, p) => sum + (p.active ? p.budget_monthly : 0), 0).toFixed(1)} همت/ماه`;
    
    return report;
}

/**
 * پرداخت هزینه ماهانه همه گروه‌ها (با عواقب بیشتر)
 */
function payAllProxies(state) {
    let totalCost = 0;
    
    state.proxies.forEach(proxy => {
        if (proxy.active) {
            totalCost += proxy.budget_monthly;
        }
    });
    
    if (state.budget_toman < totalCost) {
        state.proxies.forEach(proxy => {
            if (proxy.active) {
                proxy.forces -= Math.floor(proxy.forces * 0.1);
                proxy.morale = 'low';
            }
        });
        
        state.popularity -= 2;
        state.addHistory(`⚠️ کمبود بودجه نیابتی‌ها! (نیاز: ${totalCost.toFixed(1)} همت)`);
        
        return `⚠️ *کمبود بودجه!*\n\n` +
               `💰 نیاز: ${totalCost.toFixed(1)} همت\n` +
               `💵 موجودی: ${state.budget_toman.toFixed(1)} همت\n` +
               `⚠️ گروه‌ها ۱۰٪ تضعیف شدن\n` +
               `⚠️ محبوبیت -۲٪`;
    }
    
    state.budget_toman -= totalCost;
    
    state.proxies.forEach(proxy => {
        if (proxy.active) {
            proxy.morale = 'high';
            proxy.forces += Math.floor(Math.random() * 50);
        }
    });
    
    state.addHistory(`💰 پرداخت حقوق نیابتی‌ها (${totalCost.toFixed(1)} همت)`);
    
    return `💰 *حقوق پرداخت شد*\n\n` +
           `💵 هزینه: ${totalCost.toFixed(1)} همت\n` +
           `✅ گروه‌ها تقویت شدن`;
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
    deleteProxy,
    cleanTraces,
    getProxiesReport,
    payAllProxies
};