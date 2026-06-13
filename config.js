const images = {
  locations: {
    village: { name: "روستای باستانی", emoji: "🏘️", file_id: "AgACAgQAAxkBAAEqohhqLadvAa_KXoZZ_FInFQHvQSrtMwAC_Q1rG3-IcVEh_P79z9XpMQEAAwIAA3kAAzwE", description: "محل امن برای تجارت" },
    forest: { name: "جنگل انبوه", emoji: "🌲", file_id: "AgACAgQAAxkBAAEqoOVqLZPxLozS1NM6esKQG7llBR2guwACzA1rG3-IcVFCRrJt3ibxDgEAAwIAA3gAAzwE", description: "جایی برای جمع‌آوری چوب" },
    mountain: { name: "کوهستان سنگی", emoji: "⛰️", file_id: "AgACAgQAAxkBAAEqoONqLZPxeWDhtYFFcHYMZ1ctQ_a__AACyg1rG3-IcVFV4MehT_ipzAEAAwIAA3gAAzwE", description: "معدن سنگ و آهن" },
    river: { name: "رودخانه", emoji: "🌊", file_id: "AgACAgQAAxkBAAEqoOlqLZPxVjV2eOrmMHVR3-VbJN05EwACzw1rG3-IcVHyNvrCWHbspgEAAwIAA3gAAzwE", description: "منبع آب و ماهی" },
    plain: { name: "دشت باز", emoji: "🌾", file_id: "AgACAgQAAxkBAAEqoORqLZPxvdxmBuZ8jIKQbEIyaxSeTgACyw1rG3-IcVH76iYITnFE3gEAAwIAA3gAAzwE", description: "محل شکار حیوانات" },
    cave: { name: "غار تاریک", emoji: "🕳️", file_id: "AgACAgQAAxkBAAEqoOFqLZPxxO3sqr01Kian5KIyUFIRCAACyQ1rG3-IcVHj70KKLuZmpQEAAwIAA3gAAzwE", description: "استخراج آهن و طلا" },
    desert: { name: "بیابان", emoji: "🏜️", file_id: "AgACAgQAAxkBAAEqoOBqLZPx5EKETc1In3bV4wFoalX2hwACyA1rG3-IcVHbvNrIvkpYjAEAAwIAA3gAAzwE", description: "محیط خطرناک با دشمنان قوی" }
  },
  resources: {
    wood: { name: "چوب", emoji: "🪵", file_id: "AgACAgQAAxkBAAEqokpqLayBq7CDvaFOEGsuHjLrHm3LfAACBA5rG3-IcVGKXDiYqZo8xAEAAwIAA3kAAzwE" },
    stone: { name: "سنگ", emoji: "🪨", file_id: "AgACAgQAAxkBAAEqokxqLayCnVyLUEvBYsbozJ_1G6NBEQACBQ5rG3-IcVFN9mkVvlm-LwEAAwIAA3kAAzwE" },
    meat: { name: "گوشت", emoji: "🍖", file_id: "AgACAgQAAxkBAAEqok1qLayCiUT4O52K_w_WdC2__7mvMwACBg5rG3-IcVF6-lCjn91BewEAAwIAA3kAAzwE" },
    water: { name: "آب", emoji: "💧", file_id: "AgACAgQAAxkBAAEqok5qLayCKZxtMWN1L2AhQUshohNPewACBw5rG3-IcVFPvgnAu3ufeAEAAwIAA3kAAzwE" },
    skin: { name: "پوست", emoji: "🦴", file_id: "AgACAgQAAxkBAAEqolFqLayCk_785dpjAjl8KTkIYlxhJgACCQ5rG3-IcVEW8rvY14qyAwEAAwIAA3kAAzwE" },
    iron: { name: "آهن", emoji: "⛏️", file_id: "AgACAgQAAxkBAAEqok9qLayC3X06-YpuZ1Ur5IipPQ6hhwACCA5rG3-IcVFzaleYSUFXtAEAAwIAA3kAAzwE" },
    gold: { name: "طلا", emoji: "👑", file_id: "AgACAgQAAxkBAAEqolJqLayC1H0AAW9zUkbJ7F2L7aO77DIAAgoOaxt_iHFRwdEGzQwe3iwBAAMCAAN5AAM8BA" },
    axe: { name: "تبر سنگی", emoji: "🗡️" },
    sword: { name: "شمشیر آهنی", emoji: "⚔️" },
    armor: { name: "زره چرمی", emoji: "🛡️" },
    house: { name: "کلبه چوبی", emoji: "🏠" },
    bow: { name: "تیروکمان", emoji: "🏹" },
    shield: { name: "سپر", emoji: "🛡️", file_id: "AgACAgQAAxkBAAEqko1qLCoRSMwX919S_Er04Ks1Bii2MgACKA5rG34RGFG7iOIAAXh8NvMBAAMCAAN5AAM8BA" }
  },
  enemies: {
    wolf: { name: "گرگ", emoji: "🐺", file_id: "AgACAgQAAxkBAAEqlKtqLESXaCdwcCwD9GI7KvWxICuKdQACmA5rG9sXYVElnmbuhXNCCwEAAwIAA3kAAzwE", hp: 30, attack: 5, reward: { xp: 10, skin: 2, meat: 3 } },
    snake: { name: "مار سمی", emoji: "🐍", file_id: "AgACAgQAAxkBAAEqlJdqLESIWF43e0ntTwpTmMpmKf-eagACng5rG9sXYVE3lA8nZEiF4gEAAwIAA3kAAzwE", hp: 25, attack: 4, reward: { xp: 15, skin: 3, meat: 2 } },
    bandit: { name: "دزد مسلح", emoji: "🗡️", file_id: "AgACAgQAAxkBAAEqlK5qLESXIhIBVqlZzArzKOMeGvLhNwACmg5rG9sXYVH2tHgCG6_AWQEAAwIAA3kAAzwE", hp: 35, attack: 6, reward: { xp: 30, gold: 10, iron: 3 } },
    lion: { name: "شیر کوهی", emoji: "🦁", file_id: "AgACAgQAAxkBAAEqlK9qLESXab3WT88HcscIiAnLx_LSfAACmw5rG9sXYVGBWSAiWmHa-wEAAwIAA3kAAzwE", hp: 40, attack: 7, reward: { xp: 25, skin: 5, meat: 5 } },
    bear: { name: "خرس", emoji: "🐻", file_id: "AgACAgQAAxkBAAEqlLNqLESXiJs3HaJfeMYFPZUm2Va23AACnQ5rG9sXYVHYFq7CVIkRLAEAAwIAA3kAAzwE", hp: 60, attack: 12, reward: { xp: 60, skin: 8, meat: 10 } },
    soldier: { name: "سرباز مهاجم", emoji: "⚔️", file_id: "AgACAgQAAxkBAAEqlJhqLESIHDdDefHIY3Z5ITkD3Xu4ZQACnw5rG9sXYVGtj9iujNcBtwEAAwIAA3kAAzwE", hp: 50, attack: 10, reward: { xp: 50, gold: 20, iron: 5 } },
    fairy: { name: "پری جنگل", emoji: "🧚", file_id: "AgACAgQAAxkBAAEqlKJqLESIsYN4ym9RRhKEZ3Gd7gZBcwACpg5rG9sXYVGlAxxcVXp3PwEAAwIAA3kAAzwE", hp: 80, attack: 15, reward: { xp: 80, gold: 50, skin: 5 } },
    werewolf: { name: "گرگینه مخوف", emoji: "🐺", file_id: "AgACAgQAAxkBAAEqlItqLER2twTaLNdDiSOFh50vGVEWzAACrw5rG9sXYVGT_LAl_B0s0gEAAwIAA3kAAzwE", hp: 90, attack: 18, reward: { xp: 90, gold: 40, skin: 10 } },
    skeleton: { name: "اسکلت سکسی", emoji: "💀", file_id: "AgACAgQAAxkBAAEqlINqLER1noX3Zy8EjubZ-qBZBVY8_wACpw5rG9sXYVFjww43DCJd1QEAAwIAA3kAAzwE", hp: 45, attack: 9, reward: { xp: 40, gold: 15, iron: 5 } },
    dragon: { name: "اژدها", emoji: "🐉", file_id: "AgACAgQAAxkBAAEqlIZqLER2cEtzc1-Ek6HzL1rWX5Ug6wACqg5rG9sXYVHl-SOnJOjsBwEAAwIAA3kAAzwE", hp: 200, attack: 30, reward: { xp: 200, gold: 100, iron: 20 } },
    scorpion: { name: "عقرب غول‌پیکر", emoji: "🦂", file_id: "AgACAgQAAxkBAAEqoWhqLZtrLymxXJVcf0F14Fu9aaQKWgAC4g1rG3-IcVELh2P7UlK4nQEAAwIAA3gAAzwE", hp: 70, attack: 14, reward: { xp: 70, gold: 35, iron: 8 } },
    crocodile: { name: "تمساح", emoji: "🐊", file_id: "AgACAgQAAxkBAAEqoOZqLZPxCLriztNQDbhcSsVt196gdwACzQ1rG3-IcVE_gA4g8gngbQEAAwIAA3gAAzwE", hp: 65, attack: 13, reward: { xp: 65, gold: 30, skin: 6 } },
    eagle: { name: "عقاب", emoji: "🦅", file_id: "AgACAgQAAxkBAAEqoOhqLZPxF2vkYCVPDXn7SapBOk17GQACzg1rG3-IcVHFDpbB2aRFbAEAAwIAA3gAAzwE", hp: 55, attack: 11, reward: { xp: 55, gold: 25, skin: 4 } },
    knight_enemy: { name: "شوالیه سکسی", emoji: "⚔️", file_id: "AgACAgQAAxkBAAEqlJ1qLESI8GrSy6RixmjlvWG21CS_YwACow5rG9sXYVFF3K_3qb33QwEAAwIAA3kAAzwE", hp: 100, attack: 16, reward: { xp: 80, gold: 60, iron: 10 } },
    queen: { name: "ملکه کویین", emoji: "👑", file_id: "AgACAgQAAxkBAAEqlJ9qLESIrpWwDJRUgTnzaZ-Ov0UU5wACpA5rG9sXYVEf4bJyfqVukgEAAwIAA3kAAzwE", hp: 250, attack: 35, reward: { xp: 300, gold: 200, iron: 30 } },
    bride: { name: "عروس فراری", emoji: "👰", hp: 80, attack: 8, reward: { xp: 40, gold: 50, ring: 1 } },
    mermaid: { name: "پری دریایی", emoji: "🧜‍♀️", hp: 120, attack: 14, reward: { xp: 60, gold: 30, tear: 1 } },
    young_witch: { name: "جادوگر جوان", emoji: "🧙‍♀️", hp: 110, attack: 12, reward: { xp: 55, gold: 25, spell: 1 } },
    singer: { name: "زن خواننده", emoji: "👩‍🎤", hp: 60, attack: 6, reward: { xp: 30, gold: 15, song: 1 } },
    vampire: { name: "خون‌آشام سکسی", emoji: "🧛‍♀️", hp: 130, attack: 16, reward: { xp: 70, gold: 35, blood: 1 } },
    genie: { name: "جن صحرا", emoji: "🧝‍♀️", hp: 150, attack: 18, reward: { xp: 80, gold: 40, wish: 1 } },
    bandit_female: { name: "راهزن زن", emoji: "🦹‍♀️", hp: 100, attack: 10, reward: { xp: 50, gold: 25, key: 1 } }
  },
  npcs: {
    merchant: { name: "تاجر", emoji: "🧑‍🌾", file_id: "AgACAgQAAxkBAAEqlLFqLESXzLBZatr8p35kbr4o6c5XLAACnA5rG9sXYVHtiQP2x3Pl-wEAAwIAA3kAAzwE", role: "خرید و فروش" },
    blacksmith: { name: "آهنگر", emoji: "⚒️", file_id: "AgACAgQAAxkBAAEqlJpqLESI40N1ptEKtnKYm2NSzeRPFwACoQ5rG9sXYVFneVxMklgmPwEAAwIAA3kAAzwE", role: "ساخت‌وساز" },
    sage: { name: "حکیم دانا", emoji: "🧙", file_id: "AgACAgQAAxkBAAEqlJlqLESIYbGwjk-YGCNNoRlRCGVG9wACoA5rG9sXYVETwI_4dVg3VAEAAwIAA3kAAzwE", role: "راهنمایی" },
    male_survivor: { name: "بازمانده مرد", emoji: "💪", file_id: "AgACAgQAAxkBAAEqlPZqLEoyh9JXrivaVSM5FAplMYH7awACuw5rG9sXYVEu4YPu63HqrAEAAwIAA3kAAzwE", role: "آواتار" },
    female_survivor: { name: "بازمانده زن", emoji: "👩‍🦰", file_id: "AgACAgQAAxkBAAEqkvlqLCpTYbhGsx86pZlwSrZDaKDtvwACRg5rG_JGEVFx4xgfZ4kvnAEAAwIAA3kAAzwE", role: "آواتار" },
    farmer: { name: "دهقان پیرمرد", emoji: "🧑‍🌾", file_id: "AgACAgQAAxkBAAEqlIdqLER2Ekdi7Jwk7yPT3gqG0i0TIwACqw5rG9sXYVHlNUe143GinQEAAwIAA3kAAzwE", role: "فروش غذا" },
    prince: { name: "پرنسس", emoji: "🤴", file_id: "AgACAgQAAxkBAAEqlIhqLER2-iCLHvHnl1Co_NGCBLF9MAACrA5rG9sXYVEUdMv4g5fAFgEAAwIAA3kAAzwE", role: "کمک کن جایزه بگیر" },
    witch: { name: "جن سکسی ساحره", emoji: "🧙‍♀️", file_id: "AgACAgQAAxkBAAEqkxRqLCpxMtdC17c6B27gI-5ZQa8spQACcA5rG_JGEVGKM9iVGMze6QEAAwIAA3kAAzwE", role: "طلسم و جادو" },
    ghost_sexy: { name: "روح محجبه سکسی", emoji: "👻", file_id: "AgACAgQAAxkBAAEqlIpqLER2EWHedykUc4p-6bJLbacUcwACrg5rG9sXYVH00D8fOWE3XgEAAwIAA3kAAzwE", role: "تسخیر روح" },
    jester: { name: "دلقک سکسی", emoji: "🎭", file_id: "AgACAgQAAxkBAAEqlIVqLER1Oc9Maqg15T2LJr8tv66GkQACqQ5rG9sXYVF4jEGinB--HAEAAwIAA3kAAzwE", role: "شوخی و خنده" },
    wizard: { name: "جادوگر", emoji: "🧙‍♂️", file_id: "AgACAgQAAxkBAAEqlKBqLESIkr7pD86aEHDQbEGdugl6rwACpQ5rG9sXYVFVBRu5N7cIaQEAAwIAA3kAAzwE", role: "جادوی تصادفی" },
    knight: { name: "سرباز سکسی", emoji: "⚔️", file_id: "AgACAgQAAxkBAAEqlJ1qLESI8GrSy6RixmjlvWG21CS_YwACow5rG9sXYVFF3K_3qb33QwEAAwIAA3kAAzwE", role: "مبارزه دوستانه" },
    angel: { name: "فرشته خانوم", emoji: "👼", file_id: "AgACAgQAAxkBAAEqkotqLCoRXrUAAQUU8ybUBPLmGiGDOE8AAhEgAAJ-ERhRtiFdKeugZ9I8BA", role: "شفای کامل" }
  },
  events: {
    snow: { name: "برف", emoji: "❄️", file_id: "AgACAgQAAxkBAAEqoWNqLZtrCW8PUtp6JA0TRHlWhS_zbgAC3w1rG3-IcVEbuTWwL7Hr2gEAAwIAA3gAAzwE" },
    beehive: { name: "کندوی عسل", emoji: "🍯", file_id: "AgACAgQAAxkBAAEqoWlqLZtrLB21hKSBEEteoU4ds-cCaAAC4w1rG3-IcVFEvgFlPGmoyQEAAwIAA3gAAzwE" },
    rainbow: { name: "رنگین کمان", emoji: "🌈", file_id: "AgACAgQAAxkBAAEqoWVqLZtrIhUZLz86TZhTgTAh5LvJKgAC4A1rG3-IcVECC8kOrps7rAEAAwIAA3gAAzwE" },
    fire: { name: "آتش", emoji: "🔥", file_id: "AgACAgQAAxkBAAEqoWZqLZtrtfNR5JoAAdxlYoESUj0ZUjsAAuENaxt_iHFRLbQ94fPAxcIBAAMCAAN4AAM8BA" },
    treasure: { name: "گنج کوچیک", emoji: "💰", file_id: "AgACAgQAAxkBAAEqoV5qLZtqPv_6ilHeQ_fAVCJiC2YsnwAC2w1rG3-IcVFsAAE4xP_18ygBAAMCAAN4AAM8BA" },
    treasure_chest: { name: "گنج پر ارزش", emoji: "📦", file_id: "AgACAgQAAxkBAAEqoWBqLZtq-abZ1iofYe8qYBB0uLHmvQAC3A1rG3-IcVFHux311np9_wEAAwIAA3gAAzwE" },
    tornado: { name: "گردباد", emoji: "🌪", file_id: "AgACAgQAAxkBAAEqoWFqLZtr59FodB7ZGztbCHxJ6W2uKwAC3g1rG3-IcVGkpPpNXuZn-gEAAwIAA3gAAzwE" },
    magic_mushroom: { name: "قارچ جادویی", emoji: "🍄", file_id: "AgACAgQAAxkBAAEqoV1qLZtqkZtSbZzW9Dciu6Gjm6rtNQAC2g1rG3-IcVHJHXbjdPOtwQEAAwIAA3gAAzwE" },
    diamond: { name: "صندوق الماس", emoji: "💎", file_id: "AgACAgQAAxkBAAEqoVxqLZtqFIC6d-z8PByvLR037bLQxQAC2A1rG3-IcVE6RJPKmpzqwQEAAwIAA3gAAzwE" },
    crystal: { name: "کریستال", emoji: "🔮", file_id: "AgACAgQAAxkBAAEqoXFqLZt9gd6_SXqlMly3SxUuiHAeGAAC1w1rG3-IcVG0MCCY6nsbHAEAAwIAA3gAAzwE" },
    magic_potion: { name: "طلسم جادوگر", emoji: "🧪", file_id: "AgACAgQAAxkBAAEqlIlqLER2DkUzjerp_nvWODAWGLj2PAACrQ5rG9sXYVEqzSyc1qsY9wEAAwIAA3kAAzwE" },
    lightning: { name: "رعد و برق", emoji: "⚡", file_id: "AgACAgQAAxkBAAEqoXBqLZt97Vy2Vuqh3PYID4fEVa0fugAC1g1rG3-IcVFBSIXL3DMLPAEAAwIAA3gAAzwE" },
    snake_event: { name: "مار", emoji: "🐍", file_id: "AgACAgQAAxkBAAEqlJdqLESIWF43e0ntTwpTmMpmKf-eagACng5rG9sXYVE3lA8nZEiF4gEAAwIAA3kAAzwE" },
    eagle: { name: "عقاب", emoji: "🦅", file_id: "AgACAgQAAxkBAAEqoOhqLZPxF2vkYCVPDXn7SapBOk17GQACzg1rG3-IcVHFDpbB2aRFbAEAAwIAA3gAAzwE" }
  },
  startScreen: { file_id: "AgACAgQAAxkBAAEqohpqLadvnHJo3G8csNlI6stVLgWFKQAC_g1rG3-IcVEL8QVh3EtIEAEAAwIAA3kAAzwE" }
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