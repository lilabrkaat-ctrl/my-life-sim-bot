const images = require('./images.json');

module.exports = {
    defaultPlayer: {
        name: 'بازمانده',
        level: 1,
        xp: 0,
        hp: 100,
        maxHp: 100,
        attack: 5,
        defense: 2,
        inventory: { wood: 0, stone: 0, meat: 0, water: 0, skin: 0, iron: 0, gold: 10 },
        equipment: { weapon: null, armor: null, house: null },
        location: 'village',
        enemiesDefeated: 0,
        travels: 0,
        gathers: 0,
        score: 0,
        day: 1,
        isNight: false,
        pvpQueue: false,
        unlocked: { locations: ['village'], enemies: ['wolf', 'snake', 'bandit'], npcs: [], recipes: [] }
    },
    locationResources: {
        village: [
            { item: 'wood', min: 1, max: 3, chance: 0.8 },
            { item: 'water', min: 1, max: 2, chance: 0.7 },
            { item: 'meat', min: 1, max: 2, chance: 0.5 },
            { item: 'stone', min: 1, max: 2, chance: 0.4 }
        ],
        forest: [
            { item: 'wood', min: 3, max: 8, chance: 1.0 },
            { item: 'meat', min: 2, max: 4, chance: 0.6 },
            { item: 'water', min: 1, max: 3, chance: 0.4 },
            { item: 'skin', min: 1, max: 2, chance: 0.3 }
        ],
        mountain: [
            { item: 'stone', min: 3, max: 7, chance: 1.0 },
            { item: 'iron', min: 1, max: 3, chance: 0.6 },
            { item: 'gold', min: 1, max: 2, chance: 0.3 },
            { item: 'skin', min: 1, max: 2, chance: 0.2 }
        ],
        river: [
            { item: 'water', min: 3, max: 7, chance: 1.0 },
            { item: 'meat', min: 2, max: 5, chance: 0.7 },
            { item: 'stone', min: 1, max: 2, chance: 0.3 }
        ],
        plain: [
            { item: 'meat', min: 3, max: 7, chance: 0.9 },
            { item: 'skin', min: 2, max: 5, chance: 0.7 },
            { item: 'wood', min: 1, max: 3, chance: 0.4 },
            { item: 'gold', min: 1, max: 2, chance: 0.2 }
        ],
        cave: [
            { item: 'iron', min: 3, max: 7, chance: 0.9 },
            { item: 'gold', min: 2, max: 5, chance: 0.6 },
            { item: 'stone', min: 2, max: 4, chance: 0.5 },
            { item: 'skin', min: 1, max: 3, chance: 0.3 }
        ],
        desert: [
            { item: 'gold', min: 3, max: 8, chance: 0.7 },
            { item: 'iron', min: 2, max: 5, chance: 0.5 },
            { item: 'stone', min: 2, max: 4, chance: 0.4 },
            { item: 'skin', min: 1, max: 3, chance: 0.3 }
        ]
    },
    locationEnemies: {
        village: ['wolf', 'snake', 'bandit'],
        forest: ['wolf', 'snake', 'fairy', 'werewolf'],
        mountain: ['wolf', 'bear', 'bandit', 'eagle'],
        river: ['snake', 'wolf', 'crocodile'],
        plain: ['lion', 'bandit', 'knight', 'werewolf'],
        cave: ['snake', 'bear', 'skeleton', 'dragon'],
        desert: ['bandit', 'soldier', 'lion', 'scorpion'],
    },
    // نیازمندی امتیاز برای باز کردن مکان‌ها
    locationRequirements: {
        village: 0,
        forest: 100,
        river: 300,
        mountain: 600,
        plain: 1000,
        cave: 1500,
        desert: 2500
    },
    recipes: {
        'تبر سنگی': { wood: 3, stone: 2, effect: 'weapon', bonus: 5, emoji: '🗡️' },
        'شمشیر آهنی': { wood: 2, iron: 5, effect: 'weapon', bonus: 15, emoji: '⚔️' },
        'زره چرمی': { skin: 4, iron: 2, effect: 'armor', bonus: 10, emoji: '🛡️' },
        'کلبه چوبی': { wood: 20, stone: 15, effect: 'house', bonus: 20, emoji: '🏠' },
        'تیروکمان': { wood: 5, stone: 3, skin: 2, effect: 'weapon', bonus: 8, emoji: '🏹' }
    },
    shopPrices: {
        wood: { buy: 2, sell: 1, name: 'چوب', emoji: '🪵' },
        stone: { buy: 3, sell: 1, name: 'سنگ', emoji: '🪨' },
        meat: { buy: 3, sell: 2, name: 'گوشت', emoji: '🍖' },
        water: { buy: 1, sell: 1, name: 'آب', emoji: '💧' },
        skin: { buy: 5, sell: 3, name: 'پوست', emoji: '🦴' },
        iron: { buy: 8, sell: 4, name: 'آهن', emoji: '⛏️' },
        gold: { buy: 1, sell: 1, name: 'طلا', emoji: '👑' }
    },
    images: images
};