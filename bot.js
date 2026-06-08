const TelegramBot = require('node-telegram-bot-api');
const config = require('./config');
const { 
    getPlayer, 
    savePlayer, 
    createPlayer, 
    updatePlayerState, 
    calcEquippedStats 
} = require('./player');
const { handleShop, handleShopSelection, restockShop } = require('./shop');
const { handleGather, handleGatherSelection } = require('./gather');
const { handleFight, handleFightSelection, isPlayerInCombat } = require('./fight');
const { handleCraft, handleCraftSelection } = require('./craft');
const { handleHouse, handleHouseSelection } = require('./house');
const { handleMarry, handleMarrySelection } = require('./marry');
const { handlePrison, handlePrisonSelection } = require('./prison');
const { handleTravel, handleTravelSelection } = require('./travel');
const { handleDialogue } = require('./dialogue');
const { handleEvents, checkRandomEvent } = require('./events');
const { handleStorage, handleStorageSelection } = require('./storage');
const admin = require('./admin');

const bot = new TelegramBot(config.BOT_TOKEN, { polling: true });

// ==================== وضعیت کاربران ====================
const userStates = new Map();
const pendingMarry = new Map();
const combatTimers = new Map();

// ==================== تابع کمکی برای کنسل کردن ====================
function cancelAction(chatId) {
    const player = getPlayer(chatId);
    if (player) {
        player.currentAction = null;
        player.actionData = null;
        savePlayer(chatId, player);
    }
    userStates.delete(chatId);
}

// ==================== منوی اصلی ====================
function showMainMenu(chatId) {
    const player = getPlayer(chatId);
    if (!player) {
        bot.sendMessage(chatId, "❌ پروفایلی پیدا نشد. /start رو بزن.");
        return;
    }

    let text = `👤 **${player.name}** | سطح ${player.level || 1}\n`;
    text += `❤️ سلامتی: ${player.health}/${player.maxHealth || 100}\n`;
    text += `⚡ انرژی: ${player.energy}/${player.maxEnergy || 100}\n`;
    text += `🍗 گرسنگی: ${player.hunger}/${player.maxHunger || 100}\n`;
    text += `💰 سکه: ${player.coins}\n`;
    text += `💎 الماس: ${player.gems || 0}\n`;
    text += `⚔️ آسیب: ${player.damage || 0} | 🛡️ دفاع: ${player.defense || 0}\n`;
    text += `📍 مکان: ${player.location || '🏠 خانه'}\n`;
    text += `💍 همسر: ${player.spouse || 'ندارید'}\n\n`;
    text += `🎯 یه کار انتخاب کن:`;

    const inlineKeyboard = [
        [
            { text: "⚔️ مبارزه", callback_data: "menu_fight" },
            { text: "🌿 جمع‌آوری", callback_data: "menu_gather" }
        ],
        [
            { text: "🛒 فروشگاه", callback_data: "menu_shop" },
            { text: "🔨 کاردستی", callback_data: "menu_craft" }
        ],
        [
            { text: "🏠 خانه", callback_data: "menu_house" },
            { text: "💍 ازدواج", callback_data: "menu_marry" }
        ],
        [
            { text: "✈️ سفر", callback_data: "menu_travel" },
            { text: "📦 انبار", callback_data: "menu_storage" }
        ],
        [
            { text: "🎲 رویداد تصادفی", callback_data: "menu_event" },
            { text: "🏛️ زندان", callback_data: "menu_prison" }
        ],
        [
            { text: "📊 رتبه‌بندی", callback_data: "menu_leaderboard" },
            { text: "❓ راهنما", callback_data: "menu_help" }
        ]
    ];

    bot.sendMessage(chatId, text, {
        parse_mode: "Markdown",
        reply_markup: { inline_keyboard: inlineKeyboard }
    });
}

// ==================== دستور /start ====================
bot.onText(/\/start/, (msg) => {
    const chatId = msg.chat.id;
    const userId = msg.from.id;
    const username = msg.from.username || msg.from.first_name || "Player";

    let player = getPlayer(chatId);
    if (!player) {
        player = createPlayer(chatId, username);
        bot.sendMessage(chatId, `🎉 **به شبیه‌ساز زندگی خوش اومدی، ${username}!**\n\n` +
            `🏠 یه خونه ساده داری\n` +
            `💰 ۱۰۰۰ سکه توی جیبت هست\n` +
            `🗡️ یه شمشیر زنگ‌زده هم داری\n\n` +
            `🎯 از منوی زیر یه کار انتخاب کن:`,
            { parse_mode: "Markdown" }
        );
        showMainMenu(chatId);
    } else {
        bot.sendMessage(chatId, `👋 خوش برگشتی، ${player.name}!`);
        showMainMenu(chatId);
    }
});

// ==================== دستور /menu ====================
bot.onText(/\/menu/, (msg) => {
    const chatId = msg.chat.id;
    showMainMenu(chatId);
});

// ==================== دستور /profile ====================
bot.onText(/\/profile/, (msg) => {
    const chatId = msg.chat.id;
    const player = getPlayer(chatId);
    if (!player) {
        bot.sendMessage(chatId, "❌ اول /start رو بزن.");
        return;
    }

    let text = `📋 **پروفایل ${player.name}**\n\n`;
    text += `⭐ سطح: ${player.level || 1}\n`;
    text += `✨ XP: ${player.xp || 0}/${(player.level || 1) * 100}\n`;
    text += `❤️ سلامتی: ${player.health}/${player.maxHealth || 100}\n`;
    text += `⚡ انرژی: ${player.energy}/${player.maxEnergy || 100}\n`;
    text += `🍗 گرسنگی: ${player.hunger}/${player.maxHunger || 100}\n`;
    text += `💰 سکه: ${player.coins}\n`;
    text += `💎 الماس: ${player.gems || 0}\n`;
    text += `⚔️ آسیب: ${player.damage || 0}\n`;
    text += `🛡️ دفاع: ${player.defense || 0}\n`;
    text += `📍 مکان: ${player.location || '🏠 خانه'}\n`;
    text += `💍 همسر: ${player.spouse || 'ندارید'}\n`;
    text += `🏠 خانه: ${player.house || 'کلبه چوبی'}\n`;
    text += `🎒 آیتم‌ها: ${player.inventory ? player.inventory.length : 0} عدد`;

    bot.sendMessage(chatId, text, { parse_mode: "Markdown" });
});

// ==================== دستور /help ====================
bot.onText(/\/help/, (msg) => {
    const chatId = msg.chat.id;
    const helpText = `📚 **راهنمای شبیه‌ساز زندگی**\n\n` +
        `🎮 **دستورات اصلی:**\n` +
        `/start - شروع بازی\n` +
        `/menu - منوی اصلی\n` +
        `/profile - مشاهده پروفایل\n` +
        `/help - این راهنما\n` +
        `/cancel - لغو عملیات فعلی\n\n` +
        `🎯 **فعالیت‌ها:**\n` +
        `⚔️ مبارزه - با دشمنان بجنگ\n` +
        `🌿 جمع‌آوری - منابع جمع کن\n` +
        `🛒 فروشگاه - آیتم بخر\n` +
        `🔨 کاردستی - آیتم بساز\n` +
        `🏠 خانه - خونه بساز و ارتقا بده\n` +
        `💍 ازدواج - ازدواج کن\n` +
        `✈️ سفر - به شهرهای دیگه برو\n` +
        `🎲 رویداد - شانست رو امتحان کن\n\n` +
        `💡 **نکته:** هر روز فروشگاه ریستاک میشه!`;

    bot.sendMessage(chatId, helpText, { parse_mode: "Markdown" });
});

// ==================== دستور /cancel ====================
bot.onText(/\/cancel/, (msg) => {
    const chatId = msg.chat.id;
    cancelAction(chatId);
    bot.sendMessage(chatId, "✅ عملیات فعلی لغو شد.", {
        reply_markup: { remove_keyboard: true }
    });
});

// ==================== مدیریت منوی اینلاین ====================
bot.on('callback_query', async (query) => {
    const chatId = query.message.chat.id;
    const userId = query.id;
    const data = query.data;
    const messageId = query.message.message_id;

    // اگه توی کامبت باشه فقط دکمه‌های کامبت کار کنه
    if (isPlayerInCombat(chatId) && !data.startsWith('fight_') && !data.startsWith('menu_') && data !== 'shop_exit') {
        bot.answerCallbackQuery(userId, { text: "❌ تو مبارزه هستی! اول مبارزه رو تموم کن.", show_alert: true });
        return;
    }

    try {
        // ==================== منوی اصلی ====================
        if (data === 'menu_fight') {
            handleFight(bot, chatId, messageId);
        }
        else if (data === 'menu_gather') {
            handleGather(bot, chatId, messageId);
        }
        else if (data === 'menu_shop') {
            handleShop(bot, chatId, messageId);
        }
        else if (data === 'menu_craft') {
            handleCraft(bot, chatId, messageId);
        }
        else if (data === 'menu_house') {
            handleHouse(bot, chatId, messageId);
        }
        else if (data === 'menu_marry') {
            handleMarry(bot, chatId, messageId);
        }
        else if (data === 'menu_travel') {
            handleTravel(bot, chatId, messageId);
        }
        else if (data === 'menu_storage') {
            handleStorage(bot, chatId, messageId);
        }
        else if (data === 'menu_event') {
            handleEvents(bot, chatId, messageId);
        }
        else if (data === 'menu_prison') {
            handlePrison(bot, chatId, messageId);
        }
        else if (data === 'menu_leaderboard') {
            const players = admin.getLeaderboard();
            let text = "🏆 **رتبه‌بندی بازیکنان**\n\n";
            players.slice(0, 10).forEach((p, i) => {
                text += `${i + 1}. ${p.name} - 💰 ${p.coins} سکه | ⭐ سطح ${p.level || 1}\n`;
            });
            bot.editMessageText(text, {
                chat_id: chatId,
                message_id: messageId,
                parse_mode: "Markdown",
                reply_markup: {
                    inline_keyboard: [[{ text: "🔙 بازگشت", callback_data: "menu_back" }]]
                }
            }).catch(() => {});
        }
        else if (data === 'menu_help') {
            const helpText = `📚 **راهنما**\n\n` +
                `⚔️ **مبارزه:** دشمن انتخاب کن و باهاش بجنگ. هر برد بهت XP و سکه میده.\n\n` +
                `🌿 **جمع‌آوری:** برو به مناطق مختلف و منابع جمع کن.\n\n` +
                `🛒 **فروشگاه:** اسلحه، زره، معجون و مصالح بخر.\n\n` +
                `🔨 **کاردستی:** با مصالح، آیتم‌های بهتر بساز.\n\n` +
                `🏠 **خانه:** خونه‌ات رو ارتقا بده تا امکانات بهتری بگیری.\n\n` +
                `💍 **ازدواج:** با یه بازیکن دیگه ازدواج کن و باهم پیشرفت کنین.\n\n` +
                `✈️ **سفر:** به شهرهای جدید برو و آیتم‌های خاص پیدا کن.`;
            
            bot.editMessageText(helpText, {
                chat_id: chatId,
                message_id: messageId,
                parse_mode: "Markdown",
                reply_markup: {
                    inline_keyboard: [[{ text: "🔙 بازگشت", callback_data: "menu_back" }]]
                }
            }).catch(() => {});
        }
        else if (data === 'menu_back') {
            bot.deleteMessage(chatId, messageId).catch(() => {});
            showMainMenu(chatId);
        }

        // ==================== فروشگاه ====================
        else if (data.startsWith('shop_')) {
            handleShopSelection(bot, chatId, userId, data);
            bot.answerCallbackQuery(userId).catch(() => {});
        }

        // ==================== مبارزه ====================
        else if (data.startsWith('fight_')) {
            handleFightSelection(bot, chatId, userId, data);
            bot.answerCallbackQuery(userId).catch(() => {});
        }

        // ==================== جمع‌آوری ====================
        else if (data.startsWith('gather_')) {
            handleGatherSelection(bot, chatId, userId, data);
            bot.answerCallbackQuery(userId).catch(() => {});
        }

        // ==================== کاردستی ====================
        else if (data.startsWith('craft_')) {
            handleCraftSelection(bot, chatId, userId, data);
            bot.answerCallbackQuery(userId).catch(() => {});
        }

        // ==================== خانه ====================
        else if (data.startsWith('house_')) {
            handleHouseSelection(bot, chatId, userId, data);
            bot.answerCallbackQuery(userId).catch(() => {});
        }

        // ==================== ازدواج ====================
        else if (data.startsWith('marry_')) {
            handleMarrySelection(bot, chatId, userId, data);
            bot.answerCallbackQuery(userId).catch(() => {});
        }

        // ==================== سفر ====================
        else if (data.startsWith('travel_')) {
            handleTravelSelection(bot, chatId, userId, data);
            bot.answerCallbackQuery(userId).catch(() => {});
        }

        // ==================== زندان ====================
        else if (data.startsWith('prison_')) {
            handlePrisonSelection(bot, chatId, userId, data);
            bot.answerCallbackQuery(userId).catch(() => {});
        }

        // ==================== انبار ====================
        else if (data.startsWith('storage_')) {
            handleStorageSelection(bot, chatId, userId, data);
            bot.answerCallbackQuery(userId).catch(() => {});
        }

        // ==================== دیالوگ ====================
        else if (data.startsWith('dialogue_')) {
            handleDialogue(bot, chatId, userId, data);
            bot.answerCallbackQuery(userId).catch(() => {});
        }

        // ==================== ادمین ====================
        else if (data.startsWith('admin_')) {
            if (config.ADMIN_IDS.includes(query.from.id)) {
                admin.handleAdminSelection(bot, chatId, userId, data);
            }
            bot.answerCallbackQuery(userId).catch(() => {});
        }

        else {
            bot.answerCallbackQuery(userId, { text: "❓ دستور نامشخص", show_alert: false }).catch(() => {});
        }

    } catch (error) {
        console.error('Error in callback_query:', error);
        bot.answerCallbackQuery(userId, { text: "❌ یه خطایی رخ داد!", show_alert: true }).catch(() => {});
    }
});

// ==================== مدیریت پیام‌های متنی ====================
bot.on('message', (msg) => {
    const chatId = msg.chat.id;
    const text = msg.text;
    const userId = msg.from.id;

    // ignore commands
    if (!text || text.startsWith('/')) return;

    const player = getPlayer(chatId);
    if (!player) return;

    // ==================== سیستم ازدواج (درخواست و پاسخ) ====================
    if (text.startsWith('@') && text.includes('ازدواج')) {
        const targetUsername = text.split(' ')[0].replace('@', '');
        const proposer = player.name;
        
        // پیدا کردن chatId طرف مقابل (ساده‌سازی شده)
        bot.sendMessage(chatId, `💍 درخواست ازدواج به @${targetUsername} ارسال شد!`);
        pendingMarry.set(targetUsername, {
            from: chatId,
            fromName: proposer,
            time: Date.now()
        });
        return;
    }

    // ==================== مدیریت حالت‌های خاص ====================
    const state = userStates.get(chatId);

    // حالت تغییر نام
    if (state === 'rename') {
        player.name = text.substring(0, 20);
        savePlayer(chatId, player);
        userStates.delete(chatId);
        bot.sendMessage(chatId, `✅ اسمت تغییر کرد به: ${player.name}`);
        return;
    }

    // حالت انتقال پول
    if (state === 'transfer_coins') {
        const amount = parseInt(text);
        if (isNaN(amount) || amount <= 0) {
            bot.sendMessage(chatId, "❌ یه عدد معتبر وارد کن.");
            return;
        }
        if (amount > player.coins) {
            bot.sendMessage(chatId, "❌ اینقدر پول نداری!");
            userStates.delete(chatId);
            return;
        }
        const target = userStates.get(chatId + '_target');
        if (target) {
            const targetPlayer = getPlayer(target);
            if (targetPlayer) {
                player.coins -= amount;
                targetPlayer.coins += amount;
                savePlayer(chatId, player);
                savePlayer(target, targetPlayer);
                bot.sendMessage(chatId, `✅ ${amount} سکه به ${targetPlayer.name} انتقال دادی.`);
                bot.sendMessage(target, `💰 ${player.name} بهت ${amount} سکه انتقال داد.`);
            }
        }
        userStates.delete(chatId);
        userStates.delete(chatId + '_target');
        return;
    }

    // حالت چت با همسر
    if (state === 'chat_spouse') {
        if (player.spouse && player.spouseChatId) {
            bot.sendMessage(player.spouseChatId, `💌 پیام از ${player.name}:\n"${text}"`);
            bot.sendMessage(chatId, `✅ پیامت به ${player.spouse} ارسال شد.`);
        } else {
            bot.sendMessage(chatId, "❌ همسری پیدا نشد!");
        }
        userStates.delete(chatId);
        return;
    }

    // حالت کد تخفیف
    if (state === 'discount_code') {
        const codes = {
            'WELCOME': 20,
            'LIFE2024': 50,
            'DIAMOND': 100
        };
        if (codes[text.toUpperCase()]) {
            const reward = codes[text.toUpperCase()];
            player.gems = (player.gems || 0) + reward;
            savePlayer(chatId, player);
            bot.sendMessage(chatId, `🎉 کد تخفیف فعال شد! ${reward} الماس گرفتی!`);
        } else {
            bot.sendMessage(chatId, "❌ کد نامعتبره!");
        }
        userStates.delete(chatId);
        return;
    }

    // حالت جستجوی مکان (Travel)
    if (state === 'travel_explore') {
        handleTravel(bot, chatId, null, text);
        userStates.delete(chatId);
        return;
    }
});

// ==================== رویدادهای تصادفی (هر ۳۰ دقیقه) ====================
setInterval(() => {
    const allPlayers = getPlayer.allPlayers ? getPlayer.allPlayers() : [];
    if (allPlayers.length === 0) return;
    
    const randomPlayer = allPlayers[Math.floor(Math.random() * allPlayers.length)];
    if (randomPlayer && randomPlayer.chatId) {
        checkRandomEvent(bot, randomPlayer.chatId);
    }
}, 1800000); // هر ۳۰ دقیقه

// ==================== کاهش تدریجی گرسنگی و انرژی (هر ۵ دقیقه) ====================
setInterval(() => {
    const allPlayers = getPlayer.allPlayers ? getPlayer.allPlayers() : [];
    
    allPlayers.forEach(player => {
        if (!player.chatId) return;
        
        let changed = false;
        
        // کاهش گرسنگی
        if (player.hunger > 0) {
            player.hunger = Math.max(0, player.hunger - 2);
            changed = true;
        }
        
        // کاهش انرژی (اگه بیداره)
        if (player.energy > 0 && !player.sleeping) {
            player.energy = Math.max(0, player.energy - 1);
            changed = true;
        }
        
        // آسیب از گرسنگی شدید
        if (player.hunger <= 0 && player.health > 0) {
            player.health = Math.max(0, player.health - 5);
            changed = true;
            if (player.health <= 0) {
                bot.sendMessage(player.chatId, "💀 از گرسنگی مُردی! همه چی رو از دست دادی...");
                player.health = player.maxHealth || 100;
                player.coins = Math.floor(player.coins / 2);
            }
        }
        
        if (changed) {
            savePlayer(player.chatId, player);
        }
    });
}, 300000); // هر ۵ دقیقه

// ==================== ریستاک روزانه فروشگاه ====================
setInterval(() => {
    restockShop();
    console.log('🔄 فروشگاه ریستاک شد!');
}, 86400000); // هر ۲۴ ساعت

// ==================== ذخیره خودکار همه بازیکنان (هر ۱۰ دقیقه) ====================
setInterval(() => {
    const allPlayers = getPlayer.allPlayers ? getPlayer.allPlayers() : [];
    allPlayers.forEach(player => {
        if (player.chatId) {
            updatePlayerState(player.chatId, player);
        }
    });
    console.log(`💾 ذخیره خودکار انجام شد برای ${allPlayers.length} بازیکن`);
}, 600000); // هر ۱۰ دقیقه

// ==================== پاکسازی حافظه (هر ساعت) ====================
setInterval(() => {
    // پاکسازی درخواست‌های ازدواج منقضی شده
    const now = Date.now();
    for (const [key, value] of pendingMarry.entries()) {
        if (now - value.time > 3600000) { // یک ساعت
            pendingMarry.delete(key);
        }
    }
    
    // پاکسازی combat timer های قدیمی
    for (const [key, value] of combatTimers.entries()) {
        if (now - value > 1800000) { // ۳۰ دقیقه
            combatTimers.delete(key);
        }
    }
}, 3600000); // هر ساعت

// ==================== دستورات ادمین ====================
bot.onText(/\/admin/, (msg) => {
    const chatId = msg.chat.id;
    const userId = msg.from.id;

    if (!config.ADMIN_IDS.includes(userId)) {
        bot.sendMessage(chatId, "❌ تو ادمین نیستی!");
        return;
    }

    const adminKeyboard = {
        reply_markup: {
            inline_keyboard: [
                [{ text: "👥 همه بازیکنان", callback_data: "admin_list_players" }],
                [{ text: "💰 دادن سکه", callback_data: "admin_give_coins" }],
                [{ text: "💎 دادن الماس", callback_data: "admin_give_gems" }],
                [{ text: "🎁 دادن آیتم", callback_data: "admin_give_item" }],
                [{ text: "🔄 ریستاک فروشگاه", callback_data: "admin_restock" }],
                [{ text: "📊 آمار سرور", callback_data: "admin_stats" }],
                [{ text: "🚫 بن کردن", callback_data: "admin_ban" }],
                [{ text: "✅ آنبن کردن", callback_data: "admin_unban" }],
                [{ text: "📢 اعلامیه", callback_data: "admin_announce" }],
                [{ text: "🔙 خروج", callback_data: "admin_exit" }]
            ]
        }
    };

    bot.sendMessage(chatId, "🔧 **پنل ادمین**\nیه گزینه انتخاب کن:", {
        parse_mode: "Markdown",
        ...adminKeyboard
    });
});

// ==================== آمار سرور ====================
bot.onText(/\/stats/, (msg) => {
    const chatId = msg.chat.id;
    const allPlayers = getPlayer.allPlayers ? getPlayer.allPlayers() : [];
    
    let totalCoins = 0;
    let totalItems = 0;
    let maxLevel = 0;
    let richestPlayer = '---';
    
    allPlayers.forEach(p => {
        totalCoins += p.coins || 0;
        totalItems += p.inventory ? p.inventory.length : 0;
        if ((p.level || 1) > maxLevel) {
            maxLevel = p.level || 1;
        }
        if (p.coins > (allPlayers.find(x => x.name === richestPlayer)?.coins || 0)) {
            richestPlayer = p.name;
        }
    });
    
    const stats = `📊 **آمار سرور**\n\n` +
        `👥 تعداد بازیکنان: ${allPlayers.length}\n` +
        `💰 مجموع سکه‌ها: ${totalCoins}\n` +
        `🎒 مجموع آیتم‌ها: ${totalItems}\n` +
        `⭐ بالاترین سطح: ${maxLevel}\n` +
        `👑 پولدارترین: ${richestPlayer}`;
    
    bot.sendMessage(chatId, stats, { parse_mode: "Markdown" });
});

// ==================== هندل خطاها ====================
bot.on('polling_error', (error) => {
    console.error('Polling error:', error.message);
    if (error.code === 'ETELEGRAM' && error.response && error.response.statusCode === 409) {
        console.error('⚠️ یه نمونه دیگه از ربات در حال اجراست! این یکی رو متوقف کن.');
        process.exit(1);
    }
});

bot.on('error', (error) => {
    console.error('Bot error:', error.message);
});

// ==================== خروج زیبا ====================
process.on('SIGINT', () => {
    console.log('\n🛑 ربات در حال خاموش شدن...');
    const allPlayers = getPlayer.allPlayers ? getPlayer.allPlayers() : [];
    allPlayers.forEach(player => {
        if (player.chatId) {
            updatePlayerState(player.chatId, player);
        }
    });
    console.log(`💾 همه بازیکنان ذخیره شدن. خداحافظ!`);
    process.exit(0);
});

process.on('SIGTERM', () => {
    console.log('\n🛑 ربات در حال خاموش شدن...');
    const allPlayers = getPlayer.allPlayers ? getPlayer.allPlayers() : [];
    allPlayers.forEach(player => {
        if (player.chatId) {
            updatePlayerState(player.chatId, player);
        }
    });
    console.log(`💾 همه بازیکنان ذخیره شدن. خداحافظ!`);
    process.exit(0);
});

// ==================== مدیریت خطاهای ناشناخته ====================
process.on('uncaughtException', (error) => {
    console.error('❌ خطای ناشناخته:', error);
    // ربات رو نکش، فقط لاگ کن
});

process.on('unhandledRejection', (reason, promise) => {
    console.error('❌ Promise رد شده:', reason);
});

// ==================== راه‌اندازی ====================
console.log('🤖 ربات شبیه‌ساز زندگی راه‌اندازی شد!');
console.log(`👑 ادمین‌ها: ${config.ADMIN_IDS.join(', ')}`);
console.log(`⏰ زمان شروع: ${new Date().toLocaleString()}`);

// ریستاک اولیه فروشگاه
restockShop();
console.log('🔄 فروشگاه ریستاک اولیه شد!');

module.exports = {
    bot,
    userStates,
    pendingMarry,
    combatTimers,
    cancelAction,
    showMainMenu
};