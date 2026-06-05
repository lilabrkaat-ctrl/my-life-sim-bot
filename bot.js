const TelegramBot = require('node-telegram-bot-api');
const token = process.env.BOT_TOKEN || 'YOUR_BOT_TOKEN_HERE_PLACEHOLDER';
const bot = new TelegramBot(token, { polling: true });

const player = require('./player');
const { gather } = require('./gather');
const { travel, showTravelMenu } = require('./travel');
const { showCraftMenu, craftItem } = require('./craft');
const { fight } = require('./fight');
const { showShopMenu, buyItem, sellItem } = require('./shop');
const config = require('./config');

// منوی اصلی با ایموجی‌های باحال
function mainMenu() {
    return {
        reply_markup: {
            keyboard: [
                ['👤 📊 وضعیت من', '🌿 🪓 جمع‌آوری منابع'],
                ['🗺️ 🚶 سفر به مکان جدید', '⚔️ 💀 نبرد با دشمنان'],
                ['🔨 ⚒️ کارگاه ساخت‌وساز', '🏪 💰 بازار تجارت'],
                ['🎒 📦 اینونتوری کامل']
            ],
            resize_keyboard: true,
            persistent: true
        }
    };
}

// منوی مکان‌ها
function locationMenu() {
    const locations = config.images.locations;
    const buttons = [];
    
    for (let key in locations) {
        const loc = locations[key];
        buttons.push([`${loc.emoji} سفر به ${loc.name}`]);
    }
    
    buttons.push(['🔙 برگشت به منوی اصلی']);
    
    return {
        reply_markup: {
            keyboard: buttons,
            resize_keyboard: true,
            persistent: true
        }
    };
}

// منوی نبرد
function fightMenu() {
    return {
        reply_markup: {
            keyboard: [
                ['⚔️ ⚡ حمله سریع', '🛡️ 🏃 فرار'],
                ['🔙 برگشت به منوی اصلی']
            ],
            resize_keyboard: true,
            persistent: true
        }
    };
}

// منوی ساخت‌وساز
function craftKeyboard() {
    const recipes = config.recipes;
    const buttons = [];
    
    for (let itemName in recipes) {
        const recipe = recipes[itemName];
        buttons.push([`${recipe.emoji} 🔨 ساخت ${itemName}`]);
    }
    
    buttons.push(['🔙 برگشت به منوی اصلی']);
    
    return {
        reply_markup: {
            keyboard: buttons,
            resize_keyboard: true,
            persistent: true
        }
    };
}

// منوی بازار
function shopKeyboard() {
    return {
        reply_markup: {
            keyboard: [
                ['🪵 خرید چوب (۲👑)', '🪨 خرید سنگ (۳👑)'],
                ['🍖 خرید گوشت (۳👑)', '💧 خرید آب (۱👑)'],
                ['🦴 خرید پوست (۵👑)', '⛏️ خرید آهن (۸👑)'],
                ['📤 📦 فروش منابع', '🔙 برگشت به منوی اصلی']
            ],
            resize_keyboard: true,
            persistent: true
        }
    };
}

// منوی فروش
function sellKeyboard() {
    return {
        reply_markup: {
            keyboard: [
                ['🪵 فروش چوب (۱👑)', '🪨 فروش سنگ (۱👑)'],
                ['🍖 فروش گوشت (۲👑)', '💧 فروش آب (۱👑)'],
                ['🦴 فروش پوست (۳👑)', '⛏️ فروش آهن (۴👑)'],
                ['🔙 برگشت به بازار']
            ]
        }
    };
}

// 🎮 /start - شروع بازی با عکس
bot.onText(/\/start/, async (msg) => {
    const chatId = msg.chat.id;
    
    if (!player.getPlayer(chatId)) {
        player.createPlayer(chatId);
    }

    const p = player.getPlayer(chatId);
    const loc = config.images.locations[p.location];

    // ارسال عکس مکان فعلی
    await bot.sendPhoto(chatId, loc.file_id, {
        caption: `
╔══════════════════════╗
    🏛️ *بقای باستانی* 🏛️
╚══════════════════════╝

✨ *${p.name}* به دنیای باستان خوش آمدی!

📍 مکان فعلی: ${loc.emoji} *${loc.name}*
${loc.description}

⚔️ زنده بمون، بساز، بجنگ و افسانه شو!

📜 *از دکمه‌های زیر استفاده کن* 👇
        `,
        parse_mode: 'Markdown',
        ...mainMenu()
    });
});

// 👤 📊 وضعیت من
bot.onText(/👤 📊 وضعیت من/, async (msg) => {
    const chatId = msg.chat.id;
    const p = player.getPlayer(chatId);
    
    if (!p) return bot.sendMessage(chatId, '❌ اول /start بزن!', mainMenu());
    
    const loc = config.images.locations[p.location];
    
    // ارسال عکس بازمانده
    const avatar = config.images.npcs[p.name === 'بازمانده زن' ? 'female_survivor' : 'male_survivor'];
    
    await bot.sendPhoto(chatId, avatar.file_id, {
        caption: `
╔══════════════════════╗
      👤 *وضعیت قهرمان* 👤
╚══════════════════════╝

🏷️ *${p.name}*
⭐ سطح: ${p.level}
✨ تجربه: ${p.xp}/${p.level * 20}
❤️ جان: ${'█'.repeat(Math.floor(p.hp / p.maxHp * 10))}${'░'.repeat(10 - Math.floor(p.hp / p.maxHp * 10))} ${p.hp}/${p.maxHp}
⚔️ حمله: ${p.attack}
🛡️ دفاع: ${p.defense}

📍 *مکان:* ${loc.emoji} ${loc.name}

🎒 *اینونتوری:*
🪵 چوب: ${p.inventory.wood}  🪨 سنگ: ${p.inventory.stone}
🍖 گوشت: ${p.inventory.meat}  💧 آب: ${p.inventory.water}
🦴 پوست: ${p.inventory.skin}  ⛏️ آهن: ${p.inventory.iron}
👑 طلا: ${p.inventory.gold}

🛡️ *تجهیزات:*
🏠 خونه: ${p.equipment.house || '❌ نداری'}
🗡️ اسلحه: ${p.equipment.weapon || '❌ نداری'}
🛡️ زره: ${p.equipment.armor || '❌ نداری'}

🏆 دشمنان شکست‌خورده: ${p.enemiesDefeated}
        `,
        parse_mode: 'Markdown',
        ...mainMenu()
    });
});

// 🌿 🪓 جمع‌آوری منابع
bot.onText(/🌿 🪓 جمع‌آوری منابع/, async (msg) => {
    const chatId = msg.chat.id;
    const p = player.getPlayer(chatId);
    
    if (!p) return bot.sendMessage(chatId, '❌ اول /start بزن!', mainMenu());
    
    const loc = config.images.locations[p.location];
    
    // عکس مکان
    await bot.sendPhoto(chatId, loc.file_id, {
        caption: `🔍 در ${loc.emoji} *${loc.name}* مشغول جستجویی...`,
        parse_mode: 'Markdown'
    });
    
    const result = gather(p);
    
    // عکس آیتم پیدا شده
    if (result.success) {
        await bot.sendMessage(chatId, `
╔══════════════════════╗
    🎒 *نتیجه جستجو* 🎒
╚══════════════════════╝

${result.message}

🔄 دوباره جستجو کن یا کار دیگه‌ای بکن!
        `, { parse_mode: 'Markdown', ...mainMenu() });
    } else {
        await bot.sendMessage(chatId, `
╔══════════════════════╗
    😞 *بی‌نتیجه* 😞
╚══════════════════════╝

${result.message}
        `, { parse_mode: 'Markdown', ...mainMenu() });
    }
});

// 🗺️ 🚶 سفر
bot.onText(/🗺️ 🚶 سفر به مکان جدید/, async (msg) => {
    const chatId = msg.chat.id;
    const p = player.getPlayer(chatId);
    
    if (!p) return bot.sendMessage(chatId, '❌ اول /start بزن!', mainMenu());
    
    const loc = config.images.locations[p.location];
    
    await bot.sendPhoto(chatId, loc.file_id, {
        caption: `
📍 الان اینجایی: ${loc.emoji} *${loc.name}*

🗺️ کجا می‌خوای بری؟ یکی رو انتخاب کن:
        `,
        parse_mode: 'Markdown',
        ...locationMenu()
    });
});

// سفر به مکان
bot.onText(/^(.+) سفر به (.+)$/, async (msg, match) => {
    const chatId = msg.chat.id;
    const p = player.getPlayer(chatId);
    
    if (!p) return;
    
    const emoji = match[1];
    const name = match[2];
    
    const locations = config.images.locations;
    
    for (let key in locations) {
        if (locations[key].emoji === emoji && locations[key].name === name) {
            const oldLoc = config.images.locations[p.location];
            const result = travel(p, key);
            const newLoc = config.images.locations[p.location];
            
            // عکس مکان جدید
            await bot.sendPhoto(chatId, newLoc.file_id, {
                caption: `
╔══════════════════════╗
    🚶 *سفر موفق* 🚶
╚══════════════════════╝

${result.message}

📍 الان در ${newLoc.emoji} *${newLoc.name}* هستی.
${newLoc.description}

🔄 حالا می‌تونی منابع جمع کنی یا بجنگی!
                `,
                parse_mode: 'Markdown',
                ...mainMenu()
            });
            return;
        }
    }
});

// ⚔️ 💀 نبرد
bot.onText(/⚔️ 💀 نبرد با دشمنان/, async (msg) => {
    const chatId = msg.chat.id;
    const p = player.getPlayer(chatId);
    
    if (!p) return bot.sendMessage(chatId, '❌ اول /start بزن!', mainMenu());
    
    const loc = config.images.locations[p.location];
    
    await bot.sendPhoto(chatId, loc.file_id, {
        caption: `
⚔️ *آماده نبرد در ${loc.emoji} ${loc.name}!*

دکمه حمله رو بزن تا دشمن پیدا کنی!
        `,
        parse_mode: 'Markdown',
        ...fightMenu()
    });
});

// ⚔️ ⚡ حمله سریع
bot.onText(/⚔️ ⚡ حمله سریع/, async (msg) => {
    const chatId = msg.chat.id;
    const p = player.getPlayer(chatId);
    
    if (!p) return;
    
    const result = fight(p);
    
    if (result.enemyImage) {
        await bot.sendPhoto(chatId, result.enemyImage, {
            caption: result.message,
            parse_mode: 'Markdown',
            ...mainMenu()
        });
    } else {
        await bot.sendMessage(chatId, result.message, { parse_mode: 'Markdown', ...mainMenu() });
    }
});

// 🔨 ⚒️ کارگاه ساخت‌وساز
bot.onText(/🔨 ⚒️ کارگاه ساخت‌وساز/, async (msg) => {
    const chatId = msg.chat.id;
    const p = player.getPlayer(chatId);
    
    if (!p) return bot.sendMessage(chatId, '❌ اول /start بزن!', mainMenu());
    
    const blacksmith = config.images.npcs.blacksmith;
    
    await bot.sendPhoto(chatId, blacksmith.file_id, {
        caption: `
╔══════════════════════╗
  ⚒️ *آهنگر باستانی* ⚒️
╚══════════════════════╝

${showCraftMenu()}

👆 برای ساخت، روی دکمه زیر کلیک کن:
        `,
        parse_mode: 'Markdown',
        ...craftKeyboard()
    });
});

// ساخت آیتم
bot.onText(/^(.+) 🔨 ساخت (.+)$/, async (msg, match) => {
    const chatId = msg.chat.id;
    const p = player.getPlayer(chatId);
    
    if (!p) return;
    
    const itemName = match[2];
    const result = craftItem(p, itemName);
    
    // عکس آیتم ساخته شده
    const itemKey = itemName.includes('تبر') ? 'axe' : 
                    itemName.includes('شمشیر') ? 'sword' : 
                    itemName.includes('زره') ? 'armor' : 
                    itemName.includes('کلبه') ? 'house' : 
                    itemName.includes('تیروکمان') ? 'bow' : null;
    
    if (result.success && itemKey && config.images.resources[itemKey]) {
        await bot.sendPhoto(chatId, config.images.resources[itemKey].file_id, {
            caption: result.message,
            parse_mode: 'Markdown',
            ...craftKeyboard()
        });
    } else {
        await bot.sendMessage(chatId, result.message, { parse_mode: 'Markdown', ...craftKeyboard() });
    }
});

// 🏪 💰 بازار
bot.onText(/🏪 💰 بازار تجارت/, async (msg) => {
    const chatId = msg.chat.id;
    const p = player.getPlayer(chatId);
    
    if (!p) return bot.sendMessage(chatId, '❌ اول /start بزن!', mainMenu());
    
    if (p.location !== 'village') {
        return bot.sendMessage(chatId, '🏪 بازار فقط توی روستای باستانیه! برو نقشه و بیا روستا.', mainMenu());
    }
    
    const merchant = config.images.npcs.merchant;
    
    await bot.sendPhoto(chatId, merchant.file_id, {
        caption: `
╔══════════════════════╗
    🏪 *بازار باستانی* 🏪
╚══════════════════════╝

🧑‍🌾 تاجر: "سلام قهرمان! چی لازم داری؟"

💰 *کیف پول:* 👑 ${p.inventory.gold} طلا

📥 *خرید:*
🪵 چوب ۲👑 | 🪨 سنگ ۳👑 | 🍖 گوشت ۳👑
💧 آب ۱👑 | 🦴 پوست ۵👑 | ⛏️ آهن ۸👑

📤 *فروش با نصف قیمت*
        `,
        parse_mode: 'Markdown',
        ...shopKeyboard()
    });
});

// خرید
bot.onText(/^(.+) خرید (.+) \((\d+)👑\)$/, async (msg, match) => {
    const chatId = msg.chat.id;
    const p = player.getPlayer(chatId);
    
    if (!p) return;
    
    const itemMap = { 'چوب': 'wood', 'سنگ': 'stone', 'گوشت': 'meat', 'آب': 'water', 'پوست': 'skin', 'آهن': 'iron' };
    const itemName = match[2];
    const result = buyItem(p, itemMap[itemName]);
    
    if (result.success && config.images.resources[itemMap[itemName]]) {
        await bot.sendPhoto(chatId, config.images.resources[itemMap[itemName]].file_id, {
            caption: result.message,
            ...shopKeyboard()
        });
    } else {
        await bot.sendMessage(chatId, result.message, shopKeyboard());
    }
});

// 📤 فروش
bot.onText(/📤 📦 فروش منابع/, async (msg) => {
    const chatId = msg.chat.id;
    const p = player.getPlayer(chatId);
    
    if (!p) return;
    
    await bot.sendMessage(chatId, `
📤 *فروش منابع*

چی می‌خوای بفروشی؟
👑 طلا: ${p.inventory.gold}
    `, { parse_mode: 'Markdown', ...sellKeyboard() });
});

// فروش آیتم
bot.onText(/^(.+) فروش (.+) \((\d+)👑\)$/, async (msg, match) => {
    const chatId = msg.chat.id;
    const p = player.getPlayer(chatId);
    
    if (!p) return;
    
    const itemMap = { 'چوب': 'wood', 'سنگ': 'stone', 'گوشت': 'meat', 'آب': 'water', 'پوست': 'skin', 'آهن': 'iron' };
    const itemName = match[2];
    const result = sellItem(p, itemMap[itemName]);
    
    await bot.sendMessage(chatId, result.message, sellKeyboard());
});

// 🔙 برگشت
bot.onText(/🔙 برگشت به منوی اصلی/, (msg) => {
    const chatId = msg.chat.id;
    bot.sendMessage(chatId, '🏛️ *منوی اصلی*', { parse_mode: 'Markdown', ...mainMenu() });
});

bot.onText(/🔙 برگشت به بازار/, (msg) => {
    const chatId = msg.chat.id;
    const p = player.getPlayer(chatId);
    bot.sendMessage(chatId, '🏪 *بازار* | 👑 طلا: ' + p.inventory.gold, { parse_mode: 'Markdown', ...shopKeyboard() });
});

// 🎒 📦 اینونتوری کامل
bot.onText(/🎒 📦 اینونتوری کامل/, async (msg) => {
    const chatId = msg.chat.id;
    const p = player.getPlayer(chatId);
    
    if (!p) return bot.sendMessage(chatId, '❌ اول /start بزن!', mainMenu());
    
    let inventoryMessage = `
╔══════════════════════╗
   🎒 *اینونتوری کامل* 🎒
╚══════════════════════╝

    `;
    
    for (let item in p.inventory) {
        if (p.inventory[item] > 0 && config.images.resources[item]) {
            const res = config.images.resources[item];
            inventoryMessage += `${res.emoji} ${res.name}: ${p.inventory[item]}\n`;
        }
    }
    
    await bot.sendMessage(chatId, inventoryMessage, { parse_mode: 'Markdown', ...mainMenu() });
});

console.log('✅ ربات بقای باستانی با عکس و ایموجی آماده شد! 🎉');