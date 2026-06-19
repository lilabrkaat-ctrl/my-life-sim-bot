const TOKEN = process.env.BOT_TOKEN || "TOKEN_DEFAULT";

const COUNTRIES = [
    { name: "ترکیه", emoji: "🇹🇷", code: "TR", relation: 25 },
    { name: "عراق", emoji: "🇮🇶", code: "IQ", relation: 50 },
    { name: "عربستان", emoji: "🇸🇦", code: "SA", relation: 0 },
    { name: "اسرائیل", emoji: "🇮🇱", code: "IL", relation: -85 },
    { name: "آمریکا", emoji: "🇺🇸", code: "US", relation: -90 },
    { name: "روسیه", emoji: "🇷🇺", code: "RU", relation: 60 },
    { name: "چین", emoji: "🇨🇳", code: "CN", relation: 55 },
    { name: "پاکستان", emoji: "🇵🇰", code: "PK", relation: 30 },
    { name: "افغانستان", emoji: "🇦🇫", code: "AF", relation: -30 },
    { name: "هند", emoji: "🇮🇳", code: "IN", relation: 35 },
    { name: "سوریه", emoji: "🇸🇾", code: "SY", relation: 75 },
    { name: "امارات", emoji: "🇦🇪", code: "AE", relation: 15 },
    { name: "قطر", emoji: "🇶🇦", code: "QA", relation: 35 },
    { name: "آذربایجان", emoji: "🇦🇿", code: "AZ", relation: 10 },
    { name: "انگلیس", emoji: "🇬🇧", code: "GB", relation: -60 }
];

const PARLIAMENT = {
    principlists: { name: "اصولگرا", count: 190, basePrice: 3, corruption: 0.3 },
    reformists: { name: "اصلاح‌طلب", count: 35, basePrice: 5, corruption: 0.9 },
    independents: { name: "مستقل", count: 65, basePrice: 2, corruption: 0.7 }
};
const VOTE_NEEDED = 146;

module.exports = { TOKEN, COUNTRIES, PARLIAMENT, VOTE_NEEDED };