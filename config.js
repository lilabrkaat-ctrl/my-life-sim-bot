const TOKEN = process.env.BOT_TOKEN || "TOKEN_DEFAULT";

const CITIES = ["هرمزگان", "بوشهر", "خوزستان", "فارس", "اصفهان", "تهران", "مشهد", "تبریز", "گیلان", "مازندران"];

const LEAGUES = [
    { name: "لیگ استان", teams: 8, income: 50, cost: 20, level: 1 },
    { name: "لیگ استانی", teams: 10, income: 100, cost: 50, level: 2 },
    { name: "لیگ دسته ۳", teams: 12, income: 200, cost: 100, level: 3 },
    { name: "لیگ دسته ۲", teams: 14, income: 500, cost: 250, level: 4 },
    { name: "لیگ دسته ۱", teams: 16, income: 1000, cost: 500, level: 5 },
    { name: "لیگ برتر", teams: 16, income: 5000, cost: 2000, level: 6 }
];

const POSITIONS = ["🥅 دروازه‌بان", "🛡️ مدافع", "⚡ هافبک", "🎯 مهاجم"];

const FIRST_NAMES = ["علی", "حسین", "محمد", "رضا", "امیر", "مهدی", "سعید", "فرهاد", "احسان", "امید"];
const LAST_NAMES = ["محمدی", "احمدی", "رضایی", "حسینی", "کریمی", "موسوی", "جعفری", "نوروزی", "عباسی", "قاسمی"];

module.exports = { TOKEN, CITIES, LEAGUES, POSITIONS, FIRST_NAMES, LAST_NAMES };