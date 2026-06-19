// config.js

const TOKEN = process.env.BOT_TOKEN || "TOKEN_DEFAULT";

const CITIES = ["بندرعباس", "بندرلنگه", "قشم", "میناب", "جاسک", "خواجه", "رودان", "سیریک", "حاجی‌آباد", "تنب"];

const LEAGUES = [
    { name: "لیگ استان", teams: 8, income: 50, cost: 20, level: 1, players: 15, minStar: 2, maxStar: 4, minAbility: 1, maxAbility: 3, minPrice: 50, maxPrice: 200 },
    { name: "لیگ استانی", teams: 10, income: 100, cost: 50, level: 2, players: 15, minStar: 3, maxStar: 5, minAbility: 2, maxAbility: 4, minPrice: 100, maxPrice: 300 },
    { name: "لیگ دسته ۳", teams: 12, income: 200, cost: 100, level: 3, players: 15, minStar: 4, maxStar: 6, minAbility: 3, maxAbility: 5, minPrice: 200, maxPrice: 400 },
    { name: "لیگ دسته ۲", teams: 14, income: 500, cost: 250, level: 4, players: 15, minStar: 5, maxStar: 7, minAbility: 4, maxAbility: 6, minPrice: 300, maxPrice: 500 },
    { name: "لیگ دسته ۱", teams: 16, income: 1000, cost: 500, level: 5, players: 15, minStar: 6, maxStar: 8, minAbility: 5, maxAbility: 7, minPrice: 400, maxPrice: 700 },
    { name: "لیگ برتر", teams: 16, income: 5000, cost: 2000, level: 6, players: 15, minStar: 7, maxStar: 9, minAbility: 6, maxAbility: 8, minPrice: 500, maxPrice: 900 }
];

const POSITIONS = ["🥅 دروازه‌بان", "🛡️ مدافع", "⚡ هافبک", "🎯 مهاجم"];

const FIRST_NAMES = ["علی", "حسین", "محمد", "رضا", "امیر", "مهدی", "سعید", "فرهاد", "احسان", "امید", "یعقوب", "یونس", "اسماعیل", "صالح", "کریم", "عبدالرحمن", "رمضان", "عباس", "ناصر", "جعفر", "مجید", "کمال", "فرزاد", "بهنام", "آرش", "شهاب", "پویا", "سیاوش"];

const LAST_NAMES = ["محمدی", "احمدی", "رضایی", "حسینی", "کریمی", "موسوی", "جعفری", "نوروزی", "عباسی", "قاسمی", "مرادی", "صادقی", "رحیمی", "بزرگی", "شریفی", "جمشیدی", "کمالی", "فرهادی", "ناصری", "صفری"];

module.exports = { TOKEN, CITIES, LEAGUES, POSITIONS, FIRST_NAMES, LAST_NAMES };