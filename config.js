const images = {
  locations: {
    forest: {
      name: "جنگل انبوه", emoji: "🌲",
      file_id: "AgACAgQAAxkBAAEqJLFqImgBRr6egi64V6G9dtn2NTn4JAACJA5rG_JGEVH4izsi-XOlCAEAAwIAA3gAAzsE",
      description: "جایی برای جمع‌آوری چوب"
    },
    mountain: {
      name: "کوهستان سنگی", emoji: "⛰️",
      file_id: "AgACAgQAAxkBAAEqJLBqImgBHaP5wsytI0iH4hom1STMFwACIw5rG_JGEVEFGX2QG5KEiwEAAwIAA3gAAzsE",
      description: "معدن سنگ و آهن"
    },
    river: {
      name: "رودخانه", emoji: "🌊",
      file_id: "AgACAgQAAxkBAAEqJK9qImgBrtw-ly3r4FRhQuEFITDvXgACIg5rG_JGEVFH-WLEPGeJVgEAAwIAA3gAAzsE",
      description: "منبع آب و ماهی"
    },
    plain: {
      name: "دشت باز", emoji: "🌾",
      file_id: "AgACAgQAAxkBAAEqJK5qImgBV7keC3wKzuUwxD5Br_96UQACIQ5rG_JGEVHeuU1s4y0hSQEAAwIAA3gAAzsE",
      description: "محل شکار حیوانات"
    },
    cave: {
      name: "غار تاریک", emoji: "🕳️",
      file_id: "AgACAgQAAxkBAAEqJKxqImgB3vBluHkUjvTLCW0VpBVGQwACIA5rG_JGEVEHSyCpNnErHQEAAwIAA3gAAzsE",
      description: "استخراج آهن و طلا"
    },
    desert: {
      name: "بیابان", emoji: "🏜️",
      file_id: "AgACAgQAAxkBAAEqJKtqImgBPcnIrMBROLwfLkWNCv4Y-gACHw5rG_JGEVGMbWdYD-kp1gEAAwIAA3gAAzsE",
      description: "محیط خطرناک با دشمنان قوی"
    },
    village: {
      name: "روستای باستانی", emoji: "🏘️",
      file_id: "AgACAgQAAxkBAAEqJKpqImgBS4-EpojqX7Ze5u5KjA_cQAACHQ5rG_JGEVHS9BRhnONEfgEAAwIAA3gAAzsE",
      description: "محل امن برای تجارت"
    }
  },
  resources: {
    wood: { name: "چوب", emoji: "🪵", file_id: "AgACAgQAAxkBAAEqJTtqInS78A3Jzc7hHMXVv12Knf-fXwACPA5rG_JGEVEeHn8thHeX_QEAAwIAA3gAAzsE" },
    stone: { name: "سنگ", emoji: "🪨", file_id: "AgACAgQAAxkBAAEqJTlqInS7P__40lw1rCrPHzzVLCrYIwACOw5rG_JGEVGRW-z7FpKj3QEAAwIAA3gAAzsE" },
    meat: { name: "گوشت", emoji: "🍖", file_id: "AgACAgQAAxkBAAEqJTdqInS7zpR9SH5-lUoQdmQAASJvlqYAAjoOaxvyRhFRk2_QxYYxX0QBAAMCAAN4AAM7BA" },
    water: { name: "آب", emoji: "💧", file_id: "AgACAgQAAxkBAAEqJTZqInS7wO5bNHMzY-UYeTKP_DPb5AACOQ5rG_JGEVERfH6zNeVMXgEAAwIAA3gAAzsE" },
    skin: { name: "پوست", emoji: "🦴", file_id: "AgACAgQAAxkBAAEqJTRqInS7ULrCGG-r_CoRFJcBM7LvPAACOA5rG_JGEVEefsYQ53mcZQEAAwIAA3gAAzsE" },
    iron: { name: "آهن", emoji: "⛏️", file_id: "AgACAgQAAxkBAAEqJTJqInS7cJAcptUNcuad8CyTNi7XWQACNw5rG_JGEVF7zjSI9E9uMAEAAwIAA3gAAzsE" },
    gold: { name: "طلا", emoji: "👑", file_id: "AgACAgQAAxkBAAEqJTFqInS7FSMHbJwq-TCapuO_uxyk0gACNg5rG_JGEVFWthGXGpTb0gEAAwIAA3gAAzsE" },
    axe: { name: "تبر سنگی", emoji: "🗡️", file_id: "AgACAgQAAxkBAAEqJS1qInS7avdJj81uVh7L-Q_OsIix0QACNA5rG_JGEVE9L_GxDtAP-AEAAwIAA3gAAzsE" },
    sword: { name: "شمشیر آهنی", emoji: "⚔️", file_id: "AgACAgQAAxkBAAEqJStqInS7IcBkkdVklmz5D5X3xQeCmgACMw5rG_JGEVHNL3BqxrJ6gQEAAwIAA3gAAzsE" },
    armor: { name: "زره چرمی", emoji: "🛡️", file_id: "AgACAgQAAxkBAAEqJSpqInS77IsH4tUpmIqYOP_12OOiFwACMg5rG_JGEVF2e4AOHnPKlAEAAwIAA3gAAzsE" },
    house: { name: "کلبه چوبی", emoji: "🏠", file_id: "AgACAgQAAxkBAAEqJSlqInS7yHaFdePs76RKoqehjp8G9gACMQ5rG_JGEVGNSZ2koJ3MXgEAAwIAA3gAAzsE" },
    bow: { name: "تیروکمان", emoji: "🏹", file_id: "AgACAgQAAxkBAAEqJShqInS7D4Mz1Se6X2uh7iQ9URctAQACMA5rG_JGEVEE29m0GFlCcQEAAwIAA3gAAzsE" }
  },
  enemies: {
    wolf: { name: "گرگ", emoji: "🐺", file_id: "AgACAgQAAxkBAAEqJVpqIncyS0fa-TDJ3r7OwAX3xHra7gACQw5rG_JGEVGAs1cAAWKLpy8BAAMCAAN4AAM7BA", hp: 30, attack: 5, reward: { xp: 10, skin: 2, meat: 3 } },
    lion: { name: "شیر کوهی", emoji: "🦁", file_id: "AgACAgQAAxkBAAEqJVhqIncyJWzOj6N_yCUuQ924hTFEhwACQg5rG_JGEVFLd3MUVcjGwwEAAwIAA3gAAzsE", hp: 40, attack: 7, reward: { xp: 25, skin: 5, meat: 5 } },
    bandit: { name: "دزد مسلح", emoji: "🗡️", file_id: "AgACAgQAAxkBAAEqJVdqIncyLWavqrrxNX3Ij5vmvkpyIAACQQ5rG_JGEVG6NSLYnDmcJwEAAwIAA3gAAzsE", hp: 35, attack: 6, reward: { xp: 30, gold: 10, iron: 3 } },
    soldier: { name: "سرباز مهاجم", emoji: "⚔️", file_id: "AgACAgQAAxkBAAEqJVZqIncydAtMQCSNiJ-h3YHSH1-Z1AACQA5rG_JGEVEwgAbeLmUesgEAAwIAA3gAAzsE", hp: 50, attack: 10, reward: { xp: 50, gold: 20, iron: 5 } },
    snake: { name: "مار سمی", emoji: "🐍", file_id: "AgACAgQAAxkBAAEqJVVqIncylbJVx0p3mv1zX6Ajt49e_gACPg5rG_JGEVGLhDw_oXK_CAEAAwIAA3gAAzsE", hp: 25, attack: 4, reward: { xp: 15, skin: 3, meat: 2 } },
    bear: { name: "خرس", emoji: "🐻", file_id: "AgACAgQAAxkBAAEqJVRqIncy4xv7w6rRDlWnVOlnbZ7DCwACPQ5rG_JGEVGAYD7o2ph-nwEAAwIAA3gAAzsE", hp: 60, attack: 12, reward: { xp: 60, skin: 8, meat: 10 } },
    fairy: { name: "پری جنگل", emoji: "🧚", file_id: "AgACAgQAAxkBAAEqJhRqIo37vyFfgD4HT5EB6GHs3_-oYQACcw5rG_JGEVE0IC9Ect_IWwEAAwIAA3gAAzsE", hp: 80, attack: 15, reward: { xp: 80, gold: 50, skin: 5 } },
    dragon: { name: "اژدها", emoji: "🐉", file_id: "AgACAgQAAxkBAAEqJf5qIo3iSuF3PstMjttghF-Nt6HltAACbA5rG_JGEVGOgTOaPnP0FAEAAwIAA3gAAzsE", hp: 200, attack: 30, reward: { xp: 200, gold: 100, iron: 20 } },
    skeleton: { name: "اسکلت سکسی", emoji: "💀", file_id: "AgACAgQAAxkBAAEqJwlqIpp5RCvngODaJC8ixr0HBWeatgACiQ5rG_JGEVGn_qAeMFt-OAEAAwIAA3gAAzsE", hp: 45, attack: 9, reward: { xp: 40, gold: 15, iron: 5 } },
    werewolf: { name: "گرگینه مخوف", emoji: "🐺", file_id: "AgACAgQAAxkBAAEqJwtqIpp55pTr_w3o8UtK3uPVxa0f2wACiw5rG_JGEVHs_YJDN3xsFwEAAwIAA3gAAzsE", hp: 90, attack: 18, reward: { xp: 90, gold: 40, skin: 10 } },
    scorpion: { name: "عقرب غول‌پیکر", emoji: "🦂", hp: 70, attack: 14, reward: { xp: 70, gold: 35, iron: 8 } },
    crocodile: { name: "تمساح", emoji: "🐊", hp: 65, attack: 13, reward: { xp: 65, gold: 30, skin: 6 } },
    eagle: { name: "عقاب", emoji: "🦅", file_id: "AgACAgQAAxkBAAEqJh5qIo37vOOHZq0SV_F_o0Bep-XbRwACeg5rG_JGEVHWI1OCwYEhgAEAAwIAA3gAAzsE", hp: 55, attack: 11, reward: { xp: 55, gold: 25, skin: 4 } }
  },
  npcs: {
    merchant: { name: "تاجر", emoji: "🧑‍🌾", file_id: "AgACAgQAAxkBAAEqJWtqInlFp_yyDCXIPhDAbsjeWrv2jAACSg5rG_JGEVG9Nj82OfQAAfQBAAMCAAN4AAM7BA", role: "خرید و فروش" },
    blacksmith: { name: "آهنگر", emoji: "⚒️", file_id: "AgACAgQAAxkBAAEqJWlqInlFpP2TnFNz4EoRh30sv3zONQACSQ5rG_JGEVHq9ormgsxajwEAAwIAA3gAAzsE", role: "ساخت‌وساز" },
    sage: { name: "پیر فرزانه", emoji: "🧙", file_id: "AgACAgQAAxkBAAEqJWhqInlFWKR-CPfBpGtnFUSI241yRAACSA5rG_JGEVGcvKjFhvXgiQEAAwIAA3gAAzsE", role: "راهنمایی" },
    male_survivor: { name: "بازمانده مرد", emoji: "💪", file_id: "AgACAgQAAxkBAAEqJWdqInlFZpYKTYPN_AP75AOOaWM0KwACRw5rG_JGEVGtq7U5wnmFKwEAAwIAA3gAAzsE", role: "آواتار" },
    female_survivor: { name: "بازمانده زن", emoji: "👩‍🦰", file_id: "AgACAgQAAxkBAAEqJWZqInlFosXt271VzP3LFIz_s6UBZQACRg5rG_JGEVFx4xgfZ4kvnAEAAwIAA3gAAzsE", role: "آواتار" },
    farmer: { name: "دهقان", emoji: "🧑‍🌾", file_id: "AgACAgQAAxkBAAEqJf9qIo3igsfhwjgxWk5ZToPTzPv5sgACbQ5rG_JGEVGuy62k6TDypgEAAwIAA3gAAzsE", role: "فروش غذا" },
    prince: { name: "شاهزاده", emoji: "🤴", file_id: "AgACAgQAAxkBAAEqJgFqIo3i7SHGYKsyAAGQ7lgvrOuoqxIAAm4OaxvyRhFRCG_JO0SSvSkBAAMCAAN4AAM7BA", role: "کمک کن جایزه بگیر" },
    witch: { name: "ساحره", emoji: "🧙‍♀️", file_id: "AgACAgQAAxkBAAEqJgRqIo3iav_63BkFNDtVYxsvX55CnAACcA5rG_JGEVGKM9iVGMze6QEAAwIAA3gAAzsE", role: "طلسم و جادو" },
    ghost_sexy: { name: "روح سکسی", emoji: "👻", file_id: "AgACAgQAAxkBAAEqJxJqIpp50DxvPQWbpBIYWXwY2o01qQACjw5rG_JGEVFXBb7-24-CCAEAAwIAA3gAAzsE", role: "تسخیر روح" },
    jester: { name: "دلقک", emoji: "🎭", file_id: "AgACAgQAAxkBAAEqJgVqIo3iG7JggY2g_pOzxCqn2OK-fQACcQ5rG_JGEVFumcx57ak4NQEAAwIAA3gAAzsE", role: "شوخی و خنده" },
    wizard: { name: "جادوگر", emoji: "🧙‍♂️", file_id: "AgACAgQAAxkBAAEqJhNqIo36il--sb0izuaQwfKU0OdN_QACcg5rG_JGEVFEDvmLd-yShwEAAwIAA3gAAzsE", role: "جادوی تصادفی" },
    knight: { name: "شوالیه", emoji: "⚔️", file_id: "AgACAgQAAxkBAAEqJhVqIo37tpLTu5IK1fIscxgNCAbVNAACdA5rG_JGEVG_bMdmP9f63AEAAwIAA3gAAzsE", role: "مبارزه دوستانه" },
    angel: { name: "فرشته شفابخش", emoji: "👼", file_id: "AgACAgQAAxkBAAEqJwpqIpp5g1URTtLeAnDw-j44-Nkl4gACig5rG_JGEVHZSXvcqkESOgEAAwIAA3gAAzsE", role: "شفای کامل" }
  },
  events: {
    snow: { name: "برف", emoji: "❄️", file_id: "AgACAgQAAxkBAAEqJflqIo3iscMnnOLF_KiGIdbxZTgGvQACaA5rG_JGEVE85ygEE2xfZQEAAwIAA3gAAzsE" },
    beehive: { name: "کندوی عسل", emoji: "🍯", file_id: "AgACAgQAAxkBAAEqJfpqIo3iVDwjbvcrn7eo_cH1GG6V9gACaQ5rG_JGEVGLSgILIFpatAEAAwIAA3gAAzsE" },
    rainbow: { name: "رنگین‌کمان", emoji: "🌈", file_id: "AgACAgQAAxkBAAEqJfxqIo3ioZxuzub5XooJiHidB9xKswACaw5rG_JGEVHdCO7gUnB4oAEAAwIAA3gAAzsE" },
    fire: { name: "آتش", emoji: "🔥", file_id: "AgACAgQAAxkBAAEqJftqIo3iymNms8_qjVhecVoydz8VvQACag5rG_JGEVF_wKTFsSbJ6QEAAwIAA3gAAzsE" },
    treasure: { name: "گنج", emoji: "💰", file_id: "AgACAgQAAxkBAAEqJhdqIo37BaQBz28rMiOit_WJpqZMHQACdQ5rG_JGEVH0qlQ5DDS6HwEAAwIAA3gAAzsE" },
    snake_event: { name: "مار", emoji: "🐍", file_id: "AgACAgQAAxkBAAEqJhhqIo37pQMh5UKyQveBi1ns-8cTGAACdg5rG_JGEVEW-PQkiigh3QEAAwIAA3gAAzsE" },
    eagle: { name: "عقاب", emoji: "🦅", file_id: "AgACAgQAAxkBAAEqJh5qIo37vOOHZq0SV_F_o0Bep-XbRwACeg5rG_JGEVHWI1OCwYEhgAEAAwIAA3gAAzsE" },
    treasure_chest: { name: "صندوق گنج", emoji: "📦", file_id: "AgACAgQAAxkBAAEqJwhqIpp5sutvCbHhbpVVMVnlMb9yPQACiA5rG_JGEVH6TYF05_Z5UQEAAwIAA3gAAzsE" },
    tornado: { name: "گردباد", emoji: "🌪", file_id: "AgACAgQAAxkBAAEqJwxqIpp5tEHiiEaBRI-NA1MhvpxUywACjA5rG_JGEVF-L-rpWYGISgEAAwIAA3gAAzsE" },
    magic_mushroom: { name: "قارچ جادویی", emoji: "🍄", file_id: "AgACAgQAAxkBAAEqJw9qIpp5GiZucMPGrW26xzi1jQX87QACjg5rG_JGEVGwJzyfb5VL2QEAAwIAA3gAAzsE" },
    diamond: { name: "الماس", emoji: "💎", file_id: "AgACAgQAAxkBAAEqJw5qIpp5T1nreUsLupszKuPXwZb4mwACjQ5rG_JGEVGMLsH182AukAEAAwIAA3gAAzsE" },
    crystal: { name: "کریستال جادویی", emoji: "🔮", file_id: "AgACAgQAAxkBAAEqJxRqIpp50EXwfJk57IMYlMjucRpFWAACkA5rG_JGEVF3TRdCAvEdxAEAAwIAA3gAAzsE" },
    magic_potion: { name: "معجون جادویی", emoji: "🧪", file_id: "AgACAgQAAxkBAAEqJxVqIpp5QUP1yoYaqdmAL6fYaJDzUgACkQ5rG_JGEVEuFcMrjd1oXwEAAwIAA3gAAzsE" }
  }
};

module.exports = {
    defaultPlayer: {
        name: 'بازمانده', level: 1, xp: 0, hp: 100, maxHp: 100, attack: 5, defense: 2,
        inventory: { wood: 0, stone: 0, meat: 0, water: 0, skin: 0, iron: 0, gold: 10 },
        equipment: { weapon: null, armor: null, house: null },
        location: 'village', enemiesDefeated: 0, travels: 0, gathers: 0, score: 0, day: 1,
        unlocked: { locations: ['village'], enemies: ['wolf', 'snake', 'bandit'], npcs: [], recipes: [] }
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
        village: ['wolf', 'snake', 'bandit'],
        forest: ['wolf', 'snake', 'fairy', 'werewolf'],
        mountain: ['wolf', 'bear', 'bandit', 'eagle'],
        river: ['snake', 'wolf', 'crocodile'],
        plain: ['lion', 'bandit', 'knight', 'werewolf'],
        cave: ['snake', 'bear', 'skeleton', 'dragon'],
        desert: ['bandit', 'soldier', 'lion', 'scorpion']
    },
    locationRequirements: {
        village: 0, forest: 100, river: 300, mountain: 600, plain: 1000, cave: 1500, desert: 2500
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