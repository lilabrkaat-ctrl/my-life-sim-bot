// قهرمانان اولیه
const starterHeroes = [
    { name: "Spider-Man", emoji: "🕷️", power: 80, hp: 100, price: 0 },
    { name: "Iron Man", emoji: "🤖", power: 90, hp: 90, price: 0 },
    { name: "Thor", emoji: "⚡", power: 85, hp: 95, price: 0 }
];

// قهرمانان قابل استخدام
const recruitableHeroes = [
    { name: "Captain America", emoji: "🛡️", power: 75, hp: 110, price: 200 },
    { name: "Hulk", emoji: "💪", power: 95, hp: 130, price: 350 },
    { name: "Doctor Strange", emoji: "🧙", power: 88, hp: 85, price: 300 }
];

// دشمنان
const enemies = [
    { name: "Ultron Bot", emoji: "🤖", power: 50, hp: 60, reward: 50 },
    { name: "Chitauri", emoji: "👽", power: 60, hp: 70, reward: 70 }
];

module.exports = { starterHeroes, recruitableHeroes, enemies };