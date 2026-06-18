// images.js - عکس‌های بازی با file_id تلگرام

const IMAGES = {
    // ============================================
    // 🖼️ پس‌زمینه‌های اصلی
    // ============================================
    
    // پس‌زمینه اصلی (منوی اصلی)
    main: "AgACAgQAAxkBAAEq26RqM6Zgod1-3-pP1RpqVDXkdZfz2gACsw5rGwPDmVFZ4np59GoqLgEAAwIAA3gAAzwE",
    
    // پس‌زمینه نظامی
    military: "AgACAgQAAxkBAAEq26VqM6ZgrXnKf5P8brTVnfE9tJckAQACtQ5rGwPDmVHCT3abYDprJQEAAwIAA3gAAzwE",
    
    // پس‌زمینه دیپلماسی
    diplomacy: "AgACAgQAAxkBAAEq26dqM6ZgZEowMomodSEXWpv7ESYZlAACuw5rGwPDmVF2TJeKT2axRAEAAwIAA3gAAzwE",
    
    // پس‌زمینه اقتصاد
    economy: "AgACAgQAAxkBAAEq26hqM6ZghHfgEb6zi6he-tyamLzS1QACvA5rGwPDmVFsT_yslqRFMwEAAwIAA3gAAzwE",
    
    // پس‌زمینه هسته‌ای
    nuclear: "AgACAgQAAxkBAAEq26lqM6ZgnWyiEf6LmcD1SeuEnl9PLQACvg5rGwPDmVHMWnA3N2joFAEAAwIAA3gAAzwE",
    
    // پس‌زمینه نیابتی (محور مقاومت)
    proxy: "AgACAgQAAxkBAAEq26tqM6ZgbZBd0kXwXnGmW-q4lf77cAACvw5rGwPDmVG_Pi7Sk-etiwEAAwIAA3kAAzwE",
    
    // ============================================
    // 🎉 پایان‌ها
    // ============================================
    
    // پیروزی
    victory: "AgACAgQAAxkBAAEq26xqM6ZgvLAO-AUyiPqWbSIqDxnAMwACwA5rGwPDmVFs_QABucB-f4kBAAMCAAN4AAM8BA",
    
    // شکست
    defeat: "AgACAgQAAxkBAAEq265qM6ZgpAv1size8smnp4_nBOyIxgACxA5rGwPDmVGPYNaB1UlBXAEAAwIAA3gAAzwE",
    
    // ============================================
    // 👤 شخصیت‌ها
    // ============================================
    
    // رئیس‌جمهور ایران
    president: "AgACAgQAAxkBAAEq269qM6Zg6AKHk8en6bp8cm5-jq11FwACxw5rGwPDmVEY4qZhGjJXvQEAAwIAA3gAAzwE",
    
    // ============================================
    // 🗺️ نقشه
    // ============================================
    
    // نقشه ژئوپلیتیک ایران
    map: "AgACAgQAAxkBAAEq27FqM6ZgRTEv_ApH2SXwGB2sCyi0wwACyA5rGwPDmVGjNTOiRsJoRwEAAwIAA3gAAzwE",
    
    // ============================================
    // 🖼️ نگاشت (Map) برای استفاده راحت‌تر
    // ============================================
    
    // نگاشت منوها به عکس‌ها
    menuBackgrounds: {
        main_menu: "main",
        menu_domestic: "main",
        menu_foreign: "diplomacy",
        menu_military: "military",
        menu_economy: "economy",
        menu_proxies: "proxy",
        menu_status: "main",
        menu_history: "main",
        military_nuclear: "nuclear",
        military_special: "military",
        economy_oil: "economy",
        economy_currency: "economy",
        economy_domestic_market: "economy",
        economy_international_market: "economy",
        economy_bitcoin: "economy",
        economy_gold: "economy",
        proxies_report: "proxy",
        proxies_create: "proxy",
        proxies_fund: "proxy",
        proxies_weapons: "proxy",
        proxies_activate: "proxy",
        nuclear_enrich: "nuclear",
        nuclear_deal: "nuclear",
        nuclear_leave_npt: "nuclear"
    },
    
    // نگاشت کشورها به عکس (فعلاً همه دیپلماسی - بعداً می‌تونی شخصی‌سازی کنی)
    countryBackgrounds: {
        "TR": "diplomacy",
        "SA": "diplomacy",
        "IQ": "diplomacy",
        "PK": "diplomacy",
        "AF": "diplomacy",
        "RU": "diplomacy",
        "CN": "diplomacy",
        "IN": "diplomacy",
        "SY": "diplomacy",
        "AE": "diplomacy",
        "QA": "diplomacy",
        "AZ": "diplomacy",
        "IL": "diplomacy",
        "US": "diplomacy",
        "GB": "diplomacy"
    }
};

// ============================================
// 🎯 تابع کمکی برای گرفتن عکس
// ============================================

/**
 * گرفتن file_id یک عکس با اسم
 * @param {string} name - اسم عکس
 * @returns {string} file_id
 */
function getImage(name) {
    if (IMAGES[name]) {
        return IMAGES[name];
    }
    // اگر اسم رو پیدا نکرد، عکس اصلی رو برگردون
    return IMAGES.main;
}

/**
 * گرفتن عکس مناسب برای یک منو
 * @param {string} menuId - شناسه منو
 * @returns {string} file_id
 */
function getMenuBackground(menuId) {
    const imageName = IMAGES.menuBackgrounds[menuId];
    if (imageName && IMAGES[imageName]) {
        return IMAGES[imageName];
    }
    return IMAGES.main;
}

/**
 * گرفتن عکس مناسب برای یک کشور
 * @param {string} countryCode - کد کشور
 * @returns {string} file_id
 */
function getCountryBackground(countryCode) {
    const imageName = IMAGES.countryBackgrounds[countryCode];
    if (imageName && IMAGES[imageName]) {
        return IMAGES[imageName];
    }
    return IMAGES.diplomacy;
}

// ============================================
// 📤 خروجی
// ============================================
module.exports = {
    IMAGES,
    getImage,
    getMenuBackground,
    getCountryBackground
};