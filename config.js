// config.js - تنظیمات کامل بازی

const TOKEN = process.env.BOT_TOKEN || "TOKEN_DEFAULT";

// ============================================
// 📅 زمان
// ============================================
const START_YEAR = 1405;
const START_MONTH = 1;
const TERM_DURATION = 48; // ۴ سال = ۴۸ نوبت

// ============================================
// 💰 اقتصاد اولیه
// ============================================
const INITIAL = {
    budget: 800,            // همت
    dollar: 15,             // میلیارد دلار
    dollarRate: 100000,     // تومان
    gold: 60,               // تن
    bitcoin: 1000,          // عدد
    oil: 1.2,               // صادرات میلیون بشکه در روز
    oilPrice: 60,           // دلار هر بشکه
    inflation: 48,          // درصد
    gdp: 350,               // میلیارد دلار
    unemployment: 16,       // درصد
    popularity: 38,         // درصد
    sanctions: 88,          // ۰ تا ۱۰۰
    tension: 85,            // تنش با اسرائیل
    missiles: 300,
    drones: 1200,
    soldiers: 35000,
    nuclear: 45,            // درصد غنی‌سازی
    water: 70,              // بحران آب
    corruption: 65,         // فساد
    brain: 5,               // فرار مغزها
    internet: false,        // اینترنت آزاد؟
    gasPrice: 3000,         // قیمت بنزین (تومان)
};

// ============================================
// 🌍 ۱۵ کشور
// ============================================
const COUNTRIES = [
    { name: "ترکیه", emoji: "🇹🇷", code: "TR", relation: 25, trade: 10 },
    { name: "عراق", emoji: "🇮🇶", code: "IQ", relation: 50, trade: 8 },
    { name: "عربستان", emoji: "🇸🇦", code: "SA", relation: 0, trade: 2 },
    { name: "اسرائیل", emoji: "🇮🇱", code: "IL", relation: -85, trade: 0 },
    { name: "آمریکا", emoji: "🇺🇸", code: "US", relation: -90, trade: 0 },
    { name: "روسیه", emoji: "🇷🇺", code: "RU", relation: 60, trade: 3 },
    { name: "چین", emoji: "🇨🇳", code: "CN", relation: 55, trade: 20 },
    { name: "پاکستان", emoji: "🇵🇰", code: "PK", relation: 30, trade: 1.5 },
    { name: "افغانستان", emoji: "🇦🇫", code: "AF", relation: -30, trade: 1 },
    { name: "هند", emoji: "🇮🇳", code: "IN", relation: 35, trade: 4 },
    { name: "سوریه", emoji: "🇸🇾", code: "SY", relation: 75, trade: 1.5 },
    { name: "امارات", emoji: "🇦🇪", code: "AE", relation: 15, trade: 5 },
    { name: "قطر", emoji: "🇶🇦", code: "QA", relation: 35, trade: 1.5 },
    { name: "آذربایجان", emoji: "🇦🇿", code: "AZ", relation: 10, trade: 0.8 },
    { name: "انگلیس", emoji: "🇬🇧", code: "GB", relation: -60, trade: 0.1 }
];

// ============================================
// 🏛️ مجلس
// ============================================
const PARLIAMENT = {
    principlists: { name: "اصولگرا", count: 190, basePrice: 3, corruption: 0.3, warSupport: 0.6, economySupport: 0.3 },
    reformists: { name: "اصلاح‌طلب", count: 35, basePrice: 5, corruption: 0.9, warSupport: 0.2, economySupport: 0.8 },
    independents: { name: "مستقل", count: 65, basePrice: 2, corruption: 0.7, warSupport: 0.4, economySupport: 0.5 }
};
const VOTE_NEEDED = 146;

// ============================================
// 🛒 قیمت‌های بازار
// ============================================
const PRICES = {
    // داخلی (تومان)
    missile: { name: "موشک", toman: 80_000_000_000, emoji: "🚀" },
    drone: { name: "پهپاد شاهد", toman: 20_000_000_000, emoji: "🛸" },
    factory: { name: "کارخانه نظامی", toman: 3_000_000_000_000, emoji: "🏭" },
    airDefense: { name: "پدافند", toman: 800_000_000_000, emoji: "🛡️" },
    
    // خارجی (دلار)
    sukhoi: { name: "سوخو-۳۵", dollar: 120_000_000, emoji: "✈️" },
    s400: { name: "اس-۴۰۰", dollar: 700_000_000, emoji: "🛡️" },
    wheat: { name: "گندم", dollar: 500, emoji: "🌾" },
    medicine: { name: "دارو", dollar: 20_000_000, emoji: "💊" },
    technology: { name: "تکنولوژی", dollar: 500_000_000, emoji: "💻" },
    oilEquipment: { name: "تجهیزات نفتی", dollar: 200_000_000, emoji: "🛢️" }
};

// ============================================
// 🛢️ صادرات
// ============================================
const EXPORTS = {
    oil: { name: "نفت خام", price: 60, sanctions: 3, emoji: "🛢️" },
    gasoline: { name: "بنزین", price: 80, sanctions: 2, emoji: "⛽" },
    drone: { name: "پهپاد", price: 10_000_000, sanctions: 5, emoji: "🛸" },
    missile: { name: "موشک", price: 50_000_000, sanctions: 10, emoji: "🚀" },
    petrochemical: { name: "پتروشیمی", price: 500, sanctions: 1, emoji: "🏭" },
    carpet: { name: "فرش و پسته", price: 1_000_000, sanctions: 0, emoji: "🥇" }
};

// ============================================
// 🎲 بحران‌ها
// ============================================
const CRISES = [
    { msg: "اعتراضات سراسری", pop: -15, chance: 0.05 },
    { msg: "حمله سایبری", budget: -3, chance: 0.08 },
    { msg: "زلزله", budget: -5, pop: -5, chance: 0.05 },
    { msg: "سیل", budget: -3, pop: -2, chance: 0.06 },
    { msg: "تحریم جدید", sanctions: 8, chance: 0.10 },
    { msg: "ترور دانشمند", nuclear: -8, pop: -5, chance: 0.04 },
    { msg: "رسوایی فساد", budget: -3, pop: -10, corruption: 5, chance: 0.07 },
    { msg: "کشف نفت", budget: 8, chance: 0.03 },
    { msg: "سقوط بورس", gdp: -10, pop: -3, chance: 0.06 },
    { msg: "فرار نخبگان", brain: 3, chance: 0.05 },
    { msg: "بحران آب", water: 10, pop: -4, chance: 0.07 },
    { msg: "کرونا", pop: -4, gdp: -8, chance: 0.04 }
];

// ============================================
// 💱 تبدیل ارز
// ============================================
function tomanToDollar(toman, rate = 100000) { return toman / rate; }
function dollarToToman(dollar, rate = 100000) { return dollar * rate; }

module.exports = {
    TOKEN, START_YEAR, START_MONTH, TERM_DURATION,
    INITIAL, COUNTRIES, PARLIAMENT, VOTE_NEEDED,
    PRICES, EXPORTS, CRISES,
    tomanToDollar, dollarToToman
};