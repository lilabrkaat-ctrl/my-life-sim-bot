const TOKEN = process.env.BOT_TOKEN || "TOKEN_DEFAULT";

const PARLIAMENT = {
    principlists: { name: "اصولگرا", count: 190, basePrice: 3, corruption: 0.3 },
    reformists: { name: "اصلاح‌طلب", count: 35, basePrice: 5, corruption: 0.9 },
    independents: { name: "مستقل", count: 65, basePrice: 2, corruption: 0.7 }
};
const VOTE_NEEDED = 146;

module.exports = { TOKEN, PARLIAMENT, VOTE_NEEDED };