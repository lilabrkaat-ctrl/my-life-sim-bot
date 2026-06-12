const images = {
  locations: {
    village: { name: "روستای باستانی", emoji: "🏘️", file_id: "AgACAgQAAxkBAAEqkudqLCpAmNoqCQdfnY9TrHTPpHciKgACHQ5rG_JGEVHS9BRhnONEfgEAAwIAA3kAAzwE", description: "محل امن برای تجارت" },
    forest: { name: "جنگل انبوه", emoji: "🌲", file_id: "AgACAgQAAxkBAAEqJLFqImgBRr6egi64V6G9dtn2NTn4JAACJA5rG_JGEVH4izsi-XOlCAEAAwIAA3gAAzsE", description: "جایی برای جمع‌آوری چوب" },
    mountain: { name: "کوهستان سنگی", emoji: "⛰️", file_id: "AgACAgQAAxkBAAEqJLBqImgBHaP5wsytI0iH4hom1STMFwACIw5rG_JGEVEFGX2QG5KEiwEAAwIAA3gAAzsE", description: "معدن سنگ و آهن" },
    river: { name: "رودخانه", emoji: "🌊", file_id: "AgACAgQAAxkBAAEqJK9qImgBrtw-ly3r4FRhQuEFITDvXgACIg5rG_JGEVFH-WLEPGeJVgEAAwIAA3gAAzsE", description: "منبع آب و ماهی" },
    plain: { name: "دشت باز", emoji: "🌾", file_id: "AgACAgQAAxkBAAEqJK5qImgBV7keC3wKzuUwxD5Br_96UQACIQ5rG_JGEVHeuU1s4y0hSQEAAwIAA3gAAzsE", description: "محل شکار حیوانات" },
    cave: { name: "غار تاریک", emoji: "🕳️", file_id: "AgACAgQAAxkBAAEqJKxqImgB3vBluHkUjvTLCW0VpBVGQwACIA5rG_JGEVEHSyCpNnErHQEAAwIAA3gAAzsE", description: "استخراج آهن و طلا" },
    desert: { name: "بیابان", emoji: "🏜️", file_id: "AgACAgQAAxkBAAEqJKtqImgBPcnIrMBROLwfLkWNCv4Y-gACHw5rG_JGEVGMbWdYD-kp1gEAAwIAA3gAAzsE", description: "محیط خطرناک با دشمنان قوی" }
  },
  resources: {
    wood: { name: "چوب", emoji: "🪵" },
    stone: { name: "سنگ", emoji: "🪨" },
    meat: { name: "گوشت", emoji: "🍖" },
    water: { name: "آب", emoji: "💧" },
    skin: { name: "پوست", emoji: "🦴" },
    iron: { name: "آهن", emoji: "⛏️" },
    gold: { name: "طلا", emoji: "👑" },
    axe: { name: "تبر سنگی", emoji: "🗡️" },
    sword: { name: "شمشیر آهنی", emoji: "⚔️" },
    armor: { name: "زره چرمی", emoji: "🛡️" },
    house: { name: "کلبه چوبی", emoji: "🏠" },
    bow: { name: "تیروکمان", emoji: "🏹" },
    shield: { name: "سپر", emoji: "🛡️", file_id: "AgACAgQAAxkBAAEqko1qLCoRSMwX919S_Er04Ks1Bii2MgACKA5rG34RGFG7iOIAAXh8NvMBAAMCAAN5AAM8BA" }
  },
  enemies: {
    wolf: { name: "گرگ", emoji: "🐺", file_id: "AgACAgQAAxkBAAEqkuVqLCpA2DdEFG3QoujH0m3JN0lWxQACQw5rG_JGEVGAs1cAAWKLpy8BAAMCAAN5AAM8BA", hp: 30, attack: 5, reward: { xp: 10, skin: 2, meat: 3 } },
    snake: { name: "مار سمی", emoji: "🐍", file_id: "AgACAgQAAxkBAAEqkvdqLCpTssd2zdZOZj6MaXTFdaVkXAACdg5rG_JGEVEW-PQkiigh3QEAAwIAA3kAAzwE", hp: 25, attack: 4, reward: { xp: 15, skin: 3, meat: 2 } },
    bandit: { name: "دزد مسلح", emoji: "🗡️", file_id: "AgACAgQAAxkBAAEqkuNqLCpA3DBKj3qBGujIQXGTh7zRTgACQQ5rG_JGEVG6NSLYnDmcJwEAAwIAA3kAAzwE", hp: 35, attack: 6, reward: { xp: 30, gold: 10, iron: 3 } },
    lion: { name: "شیر کوهی", emoji: "🦁", file_id: "AgACAgQAAxkBAAEqkuRqLCpAJB3XisbxqRHMSv2x4RNYWQACQg5rG_JGEVFLd3MUVcjGwwEAAwIAA3kAAzwE", hp: 40, attack: 7, reward: { xp: 25, skin: 5, meat: 5 } },
    bear: { name: "خرس", emoji: "🐻", file_id: "AgACAgQAAxkBAAEqkv5qLCpT3H5MQXpEI_e2XkMV9s-xTQACPQ5rG_JGEVGAYD7o2ph-nwEAAwIAA3kAAzwE", hp: 60, attack: 12, reward: { xp: 60, skin: 8, meat: 10 } },
    soldier: { name: "سرباز مهاجم", emoji: "⚔️", file_id: "AgACAgQAAxkBAAEqkwJqLCpTcdweRT6zwEID7pSoWaIlHgACQA5rG_JGEVEwgAbeLmUesgEAAwIAA3gAAzwE", hp: 50, attack: 10, reward: { xp: 50, gold: 20, iron: 5 } },
    fairy: { name: "پری جنگل", emoji: "🧚", file_id: "AgACAgQAAxkBAAEqkxVqLCpxWLdoFejO0thGEOnJEnioFAACcw5rG_JGEVE0IC9Ect_IWwEAAwIAA3kAAzwE", hp: 80, attack: 15, reward: { xp: 80, gold: 50, skin: 5 } },
    werewolf: { name: "گرگینه مخوف", emoji: "🐺", file_id: "AgACAgQAAxkBAAEqJwtqIpp55pTr_w3o8UtK3uPVxa0f2wACiw5rG_JGEVHs_YJDN3xsFwEAAwIAA3gAAzsE", hp: 90, attack: 18, reward: { xp: 90, gold: 40, skin: 10 } },
    skeleton: { name: "اسکلت سکسی", emoji: "💀", file_id: "AgACAgQAAxkBAAEqJwlqIpp5RCvngODaJC8ixr0HBWeatgACiQ5rG_JGEVGn_qAeMFt-OAEAAwIAA3gAAzsE", hp: 45, attack: 9, reward: { xp: 40, gold: 15, iron: 5 } },
    dragon: { name: "اژدها", emoji: "🐉", file_id: "AgACAgQAAxkBAAEqkxFqLCpxJrKIvPKOmX8BWe_TQvmE4wACbA5rG_JGEVGOgTOaPnP0FAEAAwIAA3kAAzwE", hp: 200, attack: 30, reward: { xp: 200, gold: 100, iron: 20 } },
    scorpion: { name: "عقرب غول‌پیکر", emoji: "🦂", hp: 70, attack: 14, reward: { xp: 70, gold: 35, iron: 8 } },
    crocodile: { name: "تمساح", emoji: "🐊", hp: 65, attack: 13, reward: { xp: 65, gold: 30, skin: 6 } },
    eagle: { name: "عقاب", emoji: "🦅", file_id: "AgACAgQAAxkBAAEqkvhqLCpTn_liN7H_vOAjn4E5Iea8aAACeg5rG_JGEVHWI1OCwYEhgAEAAwIAA3gAAzwE", hp: 55, attack: 11, reward: { xp: 55, gold: 25, skin: 4 } },
    knight_enemy: { name: "شوالیه سکسی", emoji: "⚔️", file_id: "AgACAgQAAxkBAAEqkxpqLCpxhWbvpxhREBExdFppG7754wACdA5rG_JGEVG_bMdmP9f63AEAAwIAA3kAAzwE", hp: 100, attack: 16, reward: { xp: 80, gold: 60, iron: 10 } },
    queen: { name: "ملکه کویین", emoji: "👑", file_id: "AgACAgQAAxkBAAEqkxlqLCpxQ19328MF7Zwy79drrTOAPAACYw5rG34REFGgpxlUgjBLCwEAAwIAA3cAAzwE", hp: 250, attack: 35, reward: { xp: 300, gold: 200, iron: 30 } },
    bride: { name: "عروس فراری", emoji: "👰", hp: 80, attack: 8, reward: { xp: 40, gold: 50, ring: 1 } },
    mermaid: { name: "پری دریایی", emoji: "🧜‍♀️", hp: 120, attack: 14, reward: { xp: 60, gold: 30, tear: 1 } },
    young_witch: { name: "جادوگر جوان", emoji: "🧙‍♀️", hp: 110, attack: 12, reward: { xp: 55, gold: 25, spell: 1 } },
    singer: { name: "زن خواننده", emoji: "👩‍🎤", hp: 60, attack: 6, reward: { xp: 30, gold: 15, song: 1 } },
    vampire: { name: "خون‌آشام سکسی", emoji: "🧛‍♀️", hp: 130, attack: 16, reward: { xp: 70, gold: 35, blood: 1 } },
    genie: { name: "جن صحرا", emoji: "🧝‍♀️", hp: 150, attack: 18, reward: { xp: 80, gold: 40, wish: 1 } },
    bandit_female: { name: "راهزن زن", emoji: "🦹‍♀️", hp: 100, attack: 10, reward: { xp: 50, gold: 25, key: 1 } }
  },
  npcs: {
    merchant: { name: "تاجر", emoji: "🧑‍🌾", file_id: "AgACAgQAAxkBAAEqkv1qLCpT7xjimtquepuEK6fVE0d1TAACSg5rG_JGEVG9Nj82OfQAAfQBAAMCAAN5AAM8BA", role: "خرید و فروش" },
    blacksmith: { name: "آهنگر", emoji: "⚒️", file_id: "AgACAgQAAxkBAAEqkvxqLCpTNg4j6NoxfqoOBRxDyv6CTgACSQ5rG_JGEVHq9ormgsxajwEAAwIAA3kAAzwE", role: "ساخت‌وساز" },
    sage: { name: "حکیم دانا", emoji: "🧙", file_id: "AgACAgQAAxkBAAEqkvtqLCpT_RGJ8bFhVLeScz0-7uJhQAACSA5rG_JGEVGcvKjFhvXgiQEAAwIAA3kAAzwE", role: "راهنمایی" },
    male_survivor: { name: "بازمانده مرد", emoji: "💪", file_id: "AgACAgQAAxkBAAEqkvpqLCpTiWBJiP1SLqIwqcI2DuIJlAACRw5rG_JGEVGtq7U5wnmFKwEAAwIAA3kAAzwE", role: "آواتار" },
    female_survivor: { name: "بازمانده زن", emoji: "👩‍🦰", file_id: "AgACAgQAAxkBAAEqkvlqLCpTYbhGsx86pZlwSrZDaKDtvwACRg5rG_JGEVFx4xgfZ4kvnAEAAwIAA3kAAzwE", role: "آواتار" },
    farmer: { name: "دهقان پیرمرد", emoji: "🧑‍🌾", file_id: "AgACAgQAAxkBAAEqkxBqLCpxt59xDsyilgT4rfDEnNqSYQACbQ5rG_JGEVGuy62k6TDypgEAAwIAA3kAAzwE", role: "فروش غذا" },
    prince: { name: "پرنسس", emoji: "🤴", file_id: "AgACAgQAAxkBAAEqkw9qLCpxRfIarHnvBVH0q0lDg4EM1wACbg5rG_JGEVEIb8k7RJK9KQEAAwIAA3kAAzwE", role: "کمک کن جایزه بگیر" },
    witch: { name: "جن سکسی ساحره", emoji: "🧙‍♀️", file_id: "AgACAgQAAxkBAAEqkxRqLCpxMtdC17c6B27gI-5ZQa8spQACcA5rG_JGEVGKM9iVGMze6QEAAwIAA3kAAzwE", role: "طلسم و جادو" },
    ghost_sexy: { name: "روح محجبه سکسی", emoji: "👻", file_id: "AgACAgQAAxkBAAEqJxJqIpp50DxvPQWbpBIYWXwY2o01qQACjw5rG_JGEVFXBb7-24-CCAEAAwIAA3gAAzsE", role: "تسخیر روح" },
    jester: { name: "دلقک سکسی", emoji: "🎭", file_id: "AgACAgQAAxkBAAEqkxNqLCpxhUc-qM0WQiSySzGv5mvwLwACcQ5rG_JGEVFumcx57ak4NQEAAwIAA3kAAzwE", role: "شوخی و خنده" },
    wizard: { name: "جادوگر", emoji: "🧙‍♂️", file_id: "AgACAgQAAxkBAAEqkxdqLCpx6_jQ-DRkF0FU6JImXCARMwACcg5rG_JGEVFEDvmLd-yShwEAAwIAA3kAAzwE", role: "جادوی تصادفی" },
    knight: { name: "سرباز سکسی", emoji: "⚔️", file_id: "AgACAgQAAxkBAAEqkxpqLCpxhWbvpxhREBExdFppG7754wACdA5rG_JGEVG_bMdmP9f63AEAAwIAA3kAAzwE", role: "مبارزه دوستانه" },
    angel: { name: "فرشته خانوم", emoji: "👼", file_id: "AgACAgQAAxkBAAEqJwpqIpp5g1URTtLeAnDw-j44-Nkl4gACig5rG_JGEVHZSXvcqkESOgEAAwIAA3gAAzsE", role: "شفای کامل" }
  },
  events: {
    snow: { name: "برف", emoji: "❄️" },
    beehive: { name: "کندوی عسل", emoji: "🍯" },
    rainbow: { name: "رنگین کمان", emoji: "🌈" },
    fire: { name: "آتش", emoji: "🔥" },
    treasure: { name: "گنج کوچیک", emoji: "💰" },
    treasure_chest: { name: "گنج پر ارزش", emoji: "📦" },
    tornado: { name: "گردباد", emoji: "🌪" },
    magic_mushroom: { name: "قارچ جادویی", emoji: "🍄" },
    diamond: { name: "صندوق الماس", emoji: "💎" },
    crystal: { name: "کریستال", emoji: "🔮" },
    magic_potion: { name: "طلسم جادوگر", emoji: "🧪" },
    lightning: { name: "رعد و برق", emoji: "⚡" },
    snake_event: { name: "مار", emoji: "🐍" },
    eagle: { name: "عقاب", emoji: "🦅" }
  }
};

module.exports = {
    defaultPlayer: {
        name: 'بازمانده گمنام', level: 1, xp: 0, hp: 100, maxHp: 100, attack: 5, defense: 2,
        inventory: { wood: 0, stone: 0, meat: 0, water: 0, skin: 0, iron: 0, gold: 10, ring: 0, tear: 0, spell: 0, song: 0, blood: 0, wish: 0, key: 0, diamond: 0, finisher: 0 },
        equipment: { weapon: null, armor: null, house: null },
        location: 'village', enemiesDefeated: 0, travels: 0, gathers: 0, score: 0, day: 1,
        unlocked: { locations: ['village'], enemies: ['wolf', 'snake', 'bandit'], npcs: [], recipes: [] },
        house: [], marry: null, enraged: {},
        energy: 0, maxEnergy: 100, hasGlow: false, hasDayPower: false, hasNightPower: false,
        houseMaxSlots: 3, tempAttack: 0, tempAttackTurns: 0
    },
    levelUpRewards: {
        3: { key: 1 }, 5: { finisher: 1 }, 10: { wish: 1 }, 15: { spell: 1 },
        20: { finisher: 2 }, 25: { song: 1 }, 30: { tear: 1 }, 50: { wish: 3 },
        100: { ring: 5, tear: 5, spell: 5, song: 5, blood: 5, wish: 5, key: 5, diamond: 10, finisher: 5 }
    },
    locationResources: {
        village: [
            { item: 'wood', min: 1, max: 3, chance: 0.8 }, { item: 'water', min: 1, max: 2, chance: 0.7 },
            { item: 'meat', min: 1, max: 2, chance: 0.5 }, { item: 'stone', min: 1, max: 2, chance: 0.4 }
        ],
        forest: [
            { item: 'wood', min: 3, max: 8, chance: 1.0 }, { item: 'meat', min: 2, max: 4, chance: 0.6 },
            { item: 'water', min: 1, max: 3, chance: 0.4 }, { item: 'skin', min: 1, max: 2, chance: 0.3 }
        ],
        mountain: [
            { item: 'stone', min: 3, max: 7, chance: 1.0 }, { item: 'iron', min: 1, max: 3, chance: 0.6 },
            { item: 'gold', min: 1, max: 2, chance: 0.3 }, { item: 'skin', min: 1, max: 2, chance: 0.2 }
        ],
        river: [
            { item: 'water', min: 3, max: 7, chance: 1.0 }, { item: 'meat', min: 2, max: 5, chance: 0.7 },
            { item: 'stone', min: 1, max: 2, chance: 0.3 }
        ],
        plain: [
            { item: 'meat', min: 3, max: 7, chance: 0.9 }, { item: 'skin', min: 2, max: 5, chance: 0.7 },
            { item: 'wood', min: 1, max: 3, chance: 0.4 }, { item: 'gold', min: 1, max: 2, chance: 0.2 }
        ],
        cave: [
            { item: 'iron', min: 3, max: 7, chance: 0.9 }, { item: 'gold', min: 2, max: 5, chance: 0.6 },
            { item: 'stone', min: 2, max: 4, chance: 0.5 }, { item: 'skin', min: 1, max: 3, chance: 0.3 }
        ],
        desert: [
            { item: 'gold', min: 3, max: 8, chance: 0.7 }, { item: 'iron', min: 2, max: 5, chance: 0.5 },
            { item: 'stone', min: 2, max: 4, chance: 0.4 }, { item: 'skin', min: 1, max: 3, chance: 0.3 }
        ]
    },
    locationEnemies: {
        village: ['wolf', 'snake', 'bandit', 'bride', 'singer'],
        forest: ['wolf', 'snake', 'fairy', 'werewolf'],
        mountain: ['wolf', 'bear', 'bandit', 'eagle', 'young_witch'],
        river: ['snake', 'wolf', 'crocodile', 'mermaid'],
        plain: ['lion', 'bandit', 'knight_enemy', 'werewolf', 'bandit_female'],
        cave: ['snake', 'bear', 'skeleton', 'dragon', 'vampire'],
        desert: ['bandit', 'soldier', 'lion', 'scorpion', 'queen', 'genie']
    },
    locationRequirements: {
        village: 0, forest: 100, river: 300, mountain: 600, plain: 1000, cave: 1500, desert: 2500
    },
    recipes: {
        'تبر سنگی': { wood: 3, stone: 2, effect: 'weapon', bonus: 5, emoji: '🗡️' },
        'شمشیر آهنی': { wood: 2, iron: 5, effect: 'weapon', bonus: 15, emoji: '⚔️' },
        'زره چرمی': { skin: 4, iron: 2, effect: 'armor', bonus: 10, emoji: '🛡️' },
        'کلبه چوبی': { wood: 20, stone: 15, effect: 'house', bonus: 20, emoji: '🏠' },
        'تیروکمان': { wood: 5, stone: 3, skin: 2, effect: 'weapon', bonus: 8, emoji: '🏹' },
        'شمشیر نورانی': { iron: 5, wood: 2, energy: 30, effect: 'weapon', bonus: 25, emoji: '⚔️', glow: true },
        'سپر نور': { skin: 4, iron: 2, energy: 20, effect: 'armor', bonus: 20, emoji: '🛡️', glow: true },
        'خونه نورانی': { wood: 20, stone: 15, energy: 50, effect: 'house', bonus: 50, emoji: '🏠', extraSlots: 2, glow: true },
        'حلقه خورشید': { ring: 1, energy: 100, effect: 'armor', bonus: 20, emoji: '💍', dayPower: true },
        'حلقه ماه': { ring: 1, energy: 100, effect: 'armor', bonus: 20, emoji: '💍', nightPower: true }
    },
    shopPrices: {
        wood: { buy: 2, sell: 1, name: 'چوب', emoji: '🪵' },
        stone: { buy: 3, sell: 1, name: 'سنگ', emoji: '🪨' },
        meat: { buy: 3, sell: 2, name: 'گوشت', emoji: '🍖' },
        water: { buy: 1, sell: 1, name: 'آب', emoji: '💧' },
        skin: { buy: 5, sell: 3, name: 'پوست', emoji: '🦴' },
        iron: { buy: 8, sell: 4, name: 'آهن', emoji: '⛏️' },
        gold: { buy: 1, sell: 1, name: 'طلا', emoji: '👑' },
        finisher: { buy: 50, sell: 25, name: 'فینیشر', emoji: '💀' },
        energy: { buy: 10, sell: 0, name: 'انرژی', emoji: '⚡' },
        diamond_sell: { price: 100, emoji: '💎', name: 'الماس' }
    },
    houseSettings: { maxSlots: 3, maxMarry: 1 },
    images: images
};