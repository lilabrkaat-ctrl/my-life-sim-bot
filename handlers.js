// handlers.js - هندلرهای تلگرام و منوها (نسخه نهایی)

const { InlineKeyboard } = require('grammy');
const { IranState, getPlayer, setPlayer, playerExists } = require('./state');
const { COUNTRIES } = require('./config');
const { IMAGES, getMenuBackground, getCountryBackground } = require('./images');
const DIALOGUES = require('./dialogues');
const {
    increaseOilExport, decreaseOilExport, increaseOilProduction,
    changeCurrencyRate, supportDomesticProduction, increaseImports,
    decreaseImports, buyDomestic, buyInternational, sellOil,
    changeGasPrice, manageBitcoin, manageGold, manageSubsidies,
    manageTaxes, printMoney, fightCorruption, manageWaterCrisis, stopBrainDrain
} = require('./economy');
const {
    missileAttack, droneAttack, cyberAttack, declareWar,
    strengthenDefense, produceMissiles, produceDrones,
    defendCountry, enrichUranium, decreaseEnrichment, nuclearDeal,
    leaveNPT, targetedAssassination, infiltrationOperation
} = require('./military');
const {
    negotiate, secretNegotiation, defensePact, tradePact,
    cutRelations, expelAmbassador, sanctionCountry,
    evadeSanctions, closeStraitOfHormuz, acceptFATF, sendAid
} = require('./diplomacy');
const {
    createProxy, fundProxy, sendWeapons, activateProxy,
    deactivateProxy, reactivateProxy, mergeProxies, deleteProxy, cleanTraces,
    getProxiesReport, payAllProxies
} = require('./proxies');

// آیدی ادمین
const ADMIN_ID = 5576592239;

// ============================================
// 🎮 منوها (۳ ستونه)
// ============================================

function getMainMenu() {
    return new InlineKeyboard()
        .text("🏛️ کشور", "menu_domestic").text("🌍 خارجی", "menu_foreign").text("⚔️ نظامی", "menu_military").row()
        .text("💰 اقتصاد", "menu_economy").text("🏴 نیابتی", "menu_proxies").text("📊 گزارش", "menu_status").row()
        .text("📜 تاریخچه", "menu_history").text("⏭️ ماه بعد", "menu_next_turn");
}

function getForeignMenu(page = 0) {
    const keyboard = new InlineKeyboard();
    const start = page * 6;
    const end = Math.min(start + 6, COUNTRIES.length);
    
    for (let i = start; i < end; i += 3) {
        const row = COUNTRIES.slice(i, i + 3);
        row.forEach(c => keyboard.text(`${c[1]} ${c[0]}`, `country_${c[2]}`));
        keyboard.row();
    }
    
    if (page > 0 || end < COUNTRIES.length) {
        const nav = [];
        if (page > 0) nav.push(InlineKeyboard.text("⬅️", `foreign_page_${page - 1}`));
        nav.push(InlineKeyboard.text("🔙", "main_menu"));
        if (end < COUNTRIES.length) nav.push(InlineKeyboard.text("➡️", `foreign_page_${page + 1}`));
        keyboard.row(...nav);
    } else {
        keyboard.row().text("🔙 منوی اصلی", "main_menu");
    }
    
    return keyboard;
}

function getCountryMenu(countryCode) {
    return new InlineKeyboard()
        .text("🤝 مذاکره", `negotiate_${countryCode}`).text("💰 تجارت", `trade_${countryCode}`).text("📝 پیمان", `pact_${countryCode}`).row()
        .text("⚔️ حمله", `attack_${countryCode}`).text("🚫 تحریم", `sanction_${countryCode}`).text("🎁 کمک", `aid_${countryCode}`).row()
        .text("📊 اطلاعات", `info_${countryCode}`).text("🔙 کشورها", "menu_foreign");
}

function getMilitaryMenu() {
    return new InlineKeyboard()
        .text("🚀 موشک", "military_missile").text("🛸 پهپاد", "military_drone").text("💻 سایبری", "military_cyber").row()
        .text("⚔️ جنگ", "military_war").text("🛡️ دفاع", "military_defense").text("💣 تولید", "military_produce").row()
        .text("⚛️ هسته‌ای", "military_nuclear").text("🕵️ ویژه", "military_special").text("🔙 منو", "main_menu");
}

function getNuclearMenu() {
    return new InlineKeyboard()
        .text("⬆️ افزایش", "nuclear_enrich").text("⬇️ کاهش", "nuclear_decrease").text("📝 توافق", "nuclear_deal").row()
        .text("🚫 خروج NPT", "nuclear_leave_npt").text("🔙 نظامی", "menu_military");
}

function getEconomyMenu() {
    return new InlineKeyboard()
        .text("🛢️ نفت", "economy_oil").text("💵 ارز", "economy_currency").text("🛒 بازار", "economy_market").row()
        .text("⛽ بنزین", "economy_gas").text("₿ بیت‌کوین", "economy_bitcoin").text("🥇 طلا", "economy_gold").row()
        .text("💰 یارانه", "economy_subsidies").text("🏦 چاپ", "economy_print").text("🕵️ فساد", "economy_corruption").row()
        .text("💧 آب", "economy_water").text("🧠 نخبگان", "economy_brain").text("🔙 منو", "main_menu");
}

function getDomesticMarketMenu() {
    return new InlineKeyboard()
        .text("🚀 فتح", "buy_missile_fath").text("🚀 خیبر", "buy_missile_kheibar").text("🛸 شاهد۱۳۶", "buy_drone_shahed136").row()
        .text("🛸 شاهد۱۹۱", "buy_drone_shahed191").text("🏭 کارخانه", "buy_drone_factory").text("🔙 اقتصاد", "menu_economy");
}

function getInternationalMarketMenu() {
    return new InlineKeyboard()
        .text("✈️ سوخو", "buy_sukhoi35").text("🛡️ اس۴۰۰", "buy_s400").text("🛰️ ماهواره", "buy_spy_satellite").row()
        .text("🚢 زیردریایی", "buy_submarine").text("🌾 گندم", "buy_wheat").text("💊 واکسن", "buy_vaccine").row()
        .text("🔙 اقتصاد", "menu_economy");
}

function getProxiesMenu() {
    return new InlineKeyboard()
        .text("📊 گزارش", "proxies_report").text("🏴 ساخت", "proxies_create").text("💰 تأمین", "proxies_fund").row()
        .text("📦 سلاح", "proxies_weapons").text("⚔️ عملیات", "proxies_activate").text("💵 حقوق", "proxies_pay").row()
        .text("🧹 ردپا", "proxies_clean").text("💀 حذف", "proxies_delete").text("🔙 منو", "main_menu");
}

function getDomesticMenu() {
    return new InlineKeyboard()
        .text("🏭 تولید", "domestic_production").text("📦 واردات", "domestic_imports").text("💵 ارز", "domestic_currency").row()
        .text("⛽ بنزین", "domestic_gas").text("🌐 اینترنت", "domestic_internet").text("👥 اعتراضات", "domestic_protests").row()
        .text("✅ FATF", "domestic_fatf").text("🔙 منو", "main_menu");
}

function getAttackMenu(countryCode) {
    return new InlineKeyboard()
        .text("🚀 موشک", `do_missile_${countryCode}`).text("🛸 پهپاد", `do_drone_${countryCode}`).text("💻 سایبر", `do_cyber_${countryCode}`).row()
        .text("⚔️ جنگ", `do_war_${countryCode}`).text("🔙 بازگشت", `country_${countryCode}`);
}

function getNegotiateMenu(countryCode) {
    return new InlineKeyboard()
        .text("کارشناس", `do_negotiate_${countryCode}_expert_trade`).text("سفیر", `do_negotiate_${countryCode}_ambassador_trade`).text("وزیر", `do_negotiate_${countryCode}_minister_trade`).row()
        .text("رئیس‌جمهور", `do_negotiate_${countryCode}_president_trade`).text("محرمانه", `do_secret_${countryCode}`).text("🔙", `country_${countryCode}`);
}

// ============================================
// 🎭 تابع نمایش مرحله دیالوگ
// ============================================
async function showDialogueStep(ctx, dialogue, stepIndex, state) {
    const step = dialogue.steps[stepIndex];
    if (!step) return;
    
    const imageId = getCountryBackground(dialogue.countryCode || "IR");
    
    // متن تفکر
    let thoughtText = "";
    if (step.thought_step) {
        thoughtText = `\n🧠 *تو ذهنت:* _${step.thought_step}_\n`;
    }
    
    // متن اصلی
    let fullText = `🎭 *${dialogue.title}*\n`;
    fullText += `📅 ${state.year}/${state.month}\n`;
    fullText += `━━━━━━━━━━━━━━━━\n`;
    fullText += `${step.text}\n\n`;
    fullText += `🗣️ ${step.npc}\n`;
    fullText += thoughtText;
    fullText += `\nگزینه‌ها:`;
    
    // دکمه‌ها
    const keyboard = new InlineKeyboard();
    step.options.forEach((opt, i) => {
        const callbackData = `dialogue_${dialogue.countryCode || 'unknown'}_${stepIndex}_${i}`;
        keyboard.text(opt.text, callbackData).row();
    });
    
    await ctx.editMessageMedia(
        { type: "photo", media: imageId, caption: fullText, parse_mode: "Markdown" },
        { reply_markup: keyboard }
    );
}

// ============================================
// 🎮 راه‌اندازی هندلرها
// ============================================

function setupHandlers(bot) {
    
    const sessions = new Map();
    
    bot.use(async (ctx, next) => {
        const userId = ctx.from?.id;
        if (userId && !sessions.has(userId)) sessions.set(userId, {});
        ctx.session = sessions.get(userId);
        await next();
    });
    
    // ============================================
    // 📝 دستور /start
    // ============================================
    bot.command("start", async (ctx) => {
        const userId = ctx.from.id;
        const userName = ctx.from.first_name;
        
        const state = new IranState(userName);
        setPlayer(userId, state);
        
        const mainImage = getMenuBackground("main_menu");
        
        await ctx.replyWithPhoto(mainImage, {
            caption: `🏛️ *${userName}* عزیز، شما رئیس‌جمهور ایران هستید!\n\n` +
                     `📅 ${state.year}/${state.month}\n` +
                     `💰 بودجه: ${state.budget_toman.toFixed(0)} همت\n` +
                     `👥 محبوبیت: ${state.popularity}٪\n` +
                     `💵 دلار: ${state.dollar_rate.toLocaleString()} تومان\n\n` +
                     `*سرنوشت ۸۵ میلیون نفر در دستان شماست...*`,
            parse_mode: "Markdown",
            reply_markup: getMainMenu()
        });
    });
    
    // ============================================
    // 🕵️ بخش مخفی ادوین
    // ============================================
    bot.command(["edwin", "ادوین"], async (ctx) => {
        const userId = ctx.from.id;
        
        if (userId !== ADMIN_ID) {
            await ctx.reply("🚫 چنین بخشی وجود ندارد!");
            return;
        }
        
        const state = getPlayer(userId);
        if (!state) {
            await ctx.reply("اول /start رو بزن!");
            return;
        }
        
        const adminMenu = new InlineKeyboard()
            .text("💰 +۱۰۰ همت", "admin_budget_100").text("+۵۰۰", "admin_budget_500").text("+۱۰۰۰", "admin_budget_1000").row()
            .text("💵 +۱۰B$", "admin_dollar_10").text("+۵۰B$", "admin_dollar_50").text("+۱۰۰B$", "admin_dollar_100").row()
            .text("🛢️ نفت +۱", "admin_oil_1").text("+۵", "admin_oil_5").text("+۱۰", "admin_oil_10").row()
            .text("🚀 موشک +۱۰۰", "admin_missile_100").text("+۵۰۰", "admin_missile_500").text("+۱۰۰۰", "admin_missile_1000").row()
            .text("👥 محبوبیت +۲۰", "admin_pop_20").text("+۵۰", "admin_pop_50").text("۱۰۰٪", "admin_pop_100").row()
            .text("📉 تورم -۱۰", "admin_inf_10").text("-۲۰", "admin_inf_20").text("صفر", "admin_inf_0").row()
            .text("🏴 تقویت نیابتی‌ها", "admin_boost_proxies").row()
            .text("🌍 روابط همه +۲۰", "admin_relations_20").row()
            .text("⏭️ ۵ نوبت سریع", "admin_skip_5").row()
            .text("💀 پایان بازی غیرفعال", "admin_no_gameover").row()
            .text("🔙 خروج", "main_menu");
        
        await ctx.replyWithPhoto(IMAGES.main, {
            caption: `🔓 *پنل مخفی ادوین*\n\nخوش اومدی سازنده! هر چی می‌خوای تغییر بده...\n\n` +
                     `💰 بودجه: ${state.budget_toman.toFixed(0)} همت\n` +
                     `💵 دلار: ${state.dollar_reserves.toFixed(1)} میلیارد\n` +
                     `👥 محبوبیت: ${state.popularity}٪`,
            parse_mode: "Markdown",
            reply_markup: adminMenu
        });
    });
    
    // ============================================
    // 📝 دستور /status
    // ============================================
    bot.command("status", async (ctx) => {
        const userId = ctx.from.id;
        const state = getPlayer(userId);
        if (!state) return ctx.reply("❌ /start را بزن!");
        
        await ctx.replyWithPhoto(getMenuBackground("menu_status"), {
            caption: state.getStatusSummary(),
            parse_mode: "Markdown",
            reply_markup: getMainMenu()
        });
    });
    
    // ============================================
    // 🔘 مدیریت دکمه‌ها
    // ============================================
    bot.on("callback_query:data", async (ctx) => {
        const userId = ctx.from.id;
        const state = getPlayer(userId);
        const data = ctx.callbackQuery.data;
        
        if (!state && data !== "main_menu") {
            await ctx.answerCallbackQuery("ابتدا /start را بزنید!");
            return;
        }
        
        await ctx.answerCallbackQuery();
        
        let result = "";
        let nextMenu = getMainMenu();
        let showStatus = false;
        let advanceTurn = false;
        let currentImage = getMenuBackground("main_menu");
        
        try {
            // ============================================
            // منوهای اصلی
            // ============================================
            
            if (data === "main_menu") {
                await ctx.editMessageMedia(
                    { type: "photo", media: getMenuBackground("main_menu"), caption: "🏛️ *منوی اصلی*\nتصمیم بعدی شما چیست؟", parse_mode: "Markdown" },
                    { reply_markup: getMainMenu() }
                );
                return;
            }
            
            if (data === "menu_foreign" || data.startsWith("foreign_page_")) {
                let page = data.startsWith("foreign_page_") ? parseInt(data.split("_")[2]) : 0;
                await ctx.editMessageMedia(
                    { type: "photo", media: getMenuBackground("menu_foreign"), caption: "🌍 *انتخاب کشور*\nیک کشور را انتخاب کنید:", parse_mode: "Markdown" },
                    { reply_markup: getForeignMenu(page) }
                );
                return;
            }
            
            if (data === "menu_military") {
                await ctx.editMessageMedia(
                    { type: "photo", media: getMenuBackground("menu_military"), 
                      caption: `⚔️ *فرماندهی نظامی*\n\n🚀 ${state.missiles.toLocaleString()} | 🛸 ${state.drones.toLocaleString()} | 👥 ${state.soldiers.toLocaleString()}\n⚛️ ${state.nuclear_percent}٪`, 
                      parse_mode: "Markdown" },
                    { reply_markup: getMilitaryMenu() }
                );
                return;
            }
            
            if (data === "military_nuclear") {
                await ctx.editMessageMedia(
                    { type: "photo", media: getMenuBackground("military_nuclear"),
                      caption: `⚛️ *هسته‌ای*\n\nغنی‌سازی: ${state.nuclear_percent}٪\nتوافق: ${state.nuclear_deal_active ? '✅' : '❌'}\nتحریم: ${state.sanctions}/۱۰۰`,
                      parse_mode: "Markdown" },
                    { reply_markup: getNuclearMenu() }
                );
                return;
            }
            
            if (data === "menu_economy") {
                await ctx.editMessageMedia(
                    { type: "photo", media: getMenuBackground("menu_economy"),
                      caption: `💰 *اقتصاد*\n\nبودجه: ${state.budget_toman.toFixed(0)} همت\nارزی: ${state.dollar_reserves.toFixed(1)}B$\nنفت: ${state.oil_export}M بشکه\nتورم: ${state.inflation.toFixed(1)}٪`,
                      parse_mode: "Markdown" },
                    { reply_markup: getEconomyMenu() }
                );
                return;
            }
            
            if (data === "economy_market") {
                await ctx.editMessageMedia(
                    { type: "photo", media: getMenuBackground("menu_economy"),
                      caption: "🛒 *بازار*\n\n[ بازار داخلی ] / [ بازار بین‌المللی ]",
                      parse_mode: "Markdown" },
                    { reply_markup: new InlineKeyboard()
                        .text("🇮🇷 داخلی", "economy_domestic_market").text("🌍 خارجی", "economy_international_market").text("🔙", "menu_economy") }
                );
                return;
            }
            
            if (data === "economy_domestic_market") {
                await ctx.editMessageMedia(
                    { type: "photo", media: getMenuBackground("menu_economy"),
                      caption: `🛒 *بازار داخلی*\n💰 ${state.budget_toman.toFixed(0)} همت`,
                      parse_mode: "Markdown" },
                    { reply_markup: getDomesticMarketMenu() }
                );
                return;
            }
            
            if (data === "economy_international_market") {
                await ctx.editMessageMedia(
                    { type: "photo", media: getMenuBackground("menu_economy"),
                      caption: `🌍 *بازار خارجی*\n💲 ${state.dollar_reserves.toFixed(1)}B$`,
                      parse_mode: "Markdown" },
                    { reply_markup: getInternationalMarketMenu() }
                );
                return;
            }
            
            if (data === "menu_proxies") {
                await ctx.editMessageMedia(
                    { type: "photo", media: getMenuBackground("menu_proxies"),
                      caption: `🏴 *نیابتی‌ها*\n\nتعداد: ${state.proxies.length}\nبودجه ماهانه: ${state.proxies.reduce((s,p) => s + (p.active ? p.budget_monthly : 0), 0).toFixed(1)} همت`,
                      parse_mode: "Markdown" },
                    { reply_markup: getProxiesMenu() }
                );
                return;
            }
            
            if (data === "menu_domestic") {
                await ctx.editMessageMedia(
                    { type: "photo", media: getMenuBackground("main"),
                      caption: `🏛️ *کشور*\n\n👥 ${state.popularity}٪ | 🌐 ${state.internet_filtered ? '🚫' : '✅'}\n⛽ ${state.gas_price.toLocaleString()}T | 💧 ${state.water_crisis}٪`,
                      parse_mode: "Markdown" },
                    { reply_markup: getDomesticMenu() }
                );
                return;
            }
            
            if (data === "menu_status") {
                await ctx.editMessageMedia(
                    { type: "photo", media: getMenuBackground("menu_status"),
                      caption: state.getStatusSummary(),
                      parse_mode: "Markdown" },
                    { reply_markup: getMainMenu() }
                );
                return;
            }
            
            if (data === "menu_history") {
                const h = state.history.length > 0 ? state.history.slice(-15).join("\n") : "📜 خالی";
                await ctx.editMessageMedia(
                    { type: "photo", media: getMenuBackground("main"),
                      caption: "📜 *تاریخچه*\n\n" + h,
                      parse_mode: "Markdown" },
                    { reply_markup: getMainMenu() }
                );
                return;
            }
            
            if (data === "menu_next_turn") {
                state.nextTurn();
                await ctx.editMessageMedia(
                    { type: "photo", media: getMenuBackground("main"),
                      caption: "⏭️ *یک ماه گذشت*\n\n" + state.getStatusSummary(),
                      parse_mode: "Markdown" },
                    { reply_markup: state.game_over ? undefined : getMainMenu() }
                );
                return;
            }
            
            // ============================================
            // 🌍 کشورها
            // ============================================
            
            if (data.startsWith("country_")) {
                const code = data.split("_")[1];
                const country = state.findCountry(code);
                if (country) {
                    const relStatus = country[4] >= 50 ? "✅ متحد" : country[4] >= 20 ? "🟢 دوست" : country[4] >= -20 ? "🟡 بی‌طرف" : country[4] >= -50 ? "🟠 متخاصم" : "🔴 دشمن";
                    await ctx.editMessageMedia(
                        { type: "photo", media: getCountryBackground(code),
                          caption: `${country[1]} *${country[0]}*\n━━━━━━━━━━\n📊 ${country[4]}/100 ${relStatus}\n💰 ${country[5]}B$`,
                          parse_mode: "Markdown" },
                        { reply_markup: getCountryMenu(code) }
                    );
                }
                return;
            }
            
            // ============================================
            // 🎭 دیالوگ - شروع
            // ============================================
            
            if (data.startsWith("negotiate_") && !data.startsWith("do_negotiate_")) {
                const code = data.split("_")[1];
                const country = state.findCountry(code);
                if (!country) return;
                
                // بررسی آیا کشور دیالوگ داره
                const dialogueKey = Object.keys(DIALOGUES).find(k => {
                    const d = DIALOGUES[k];
                    return d.countryCode === code || 
                           (d.emoji === country[1] && d.country === country[0]);
                });
                
                if (dialogueKey && DIALOGUES[dialogueKey]) {
                    // ذخیره اطلاعات دیالوگ
                    ctx.session.dialogueKey = dialogueKey;
                    ctx.session.dialogueStep = 0;
                    ctx.session.dialogueEffects = {};
                    
                    const dialogue = DIALOGUES[dialogueKey];
                    dialogue.countryCode = code;
                    
                    await showDialogueStep(ctx, dialogue, 0, state);
                    return;
                }
                
                // اگر دیالوگ نداره، روش قدیمی
                await ctx.editMessageMedia(
                    { type: "photo", media: getCountryBackground(code),
                      caption: "🤝 *سطح مذاکره*",
                      parse_mode: "Markdown" },
                    { reply_markup: getNegotiateMenu(code) }
                );
                return;
            }
            
            // ============================================
            // 🎭 دیالوگ - ادامه
            // ============================================
            
            if (data.startsWith("dialogue_")) {
                const parts = data.split("_");
                const dialogueKey = ctx.session.dialogueKey;
                const stepIndex = parseInt(parts[2]);
                const optionIndex = parseInt(parts[3]);
                
                const dialogue = DIALOGUES[dialogueKey];
                if (!dialogue) return;
                
                const step = dialogue.steps[stepIndex];
                const option = step.options[optionIndex];
                
                // گزینه جنگ
                if (option.next === "war") {
                    result = declareWar(state, option.war);
                    advanceTurn = true;
                    ctx.session.dialogueKey = null;
                }
                // گزینه آخر (نتیجه)
                else if (option.result) {
                    if (option.reward) {
                        result = `🎉 *${option.result === 'success' ? 'موفقیت' : option.result === 'partial' ? 'نتیجه نسبی' : 'شکست'}!*\n\n${option.reward}`;
                        if (option.secret) result += `\n\n🔒 *محرمانه:* ${option.secret}`;
                    }
                    if (option.penalty) {
                        result = `💔 *شکست*\n\n${option.penalty}`;
                    }
                    
                    // اعمال اثرات
                    if (option.effect) {
                        // اعمال روی state
                    }
                    
                    advanceTurn = true;
                    ctx.session.dialogueKey = null;
                }
                // ادامه دیالوگ
                else if (option.next && typeof option.next === 'number') {
                    ctx.session.dialogueStep = option.next;
                    
                    // ذخیره اثرات
                    if (option.effect) {
                        Object.assign(ctx.session.dialogueEffects, option.effect);
                    }
                    
                    await showDialogueStep(ctx, dialogue, option.next, state);
                    return;
                }
                
                if (advanceTurn) {
                    state.nextTurn();
                }
                
                if (result) {
                    await ctx.editMessageMedia(
                        { type: "photo", media: getMenuBackground("main"),
                          caption: result + "\n\n" + state.getStatusSummary(),
                          parse_mode: "Markdown" },
                        { reply_markup: state.game_over ? undefined : getMainMenu() }
                    );
                }
                return;
            }
            
            // ============================================
            // ⚔️ حمله
            // ============================================
            
            if (data.startsWith("attack_")) {
                const code = data.split("_")[1];
                await ctx.editMessageMedia(
                    { type: "photo", media: getMenuBackground("menu_military"),
                      caption: "⚔️ *نوع حمله*",
                      parse_mode: "Markdown" },
                    { reply_markup: getAttackMenu(code) }
                );
                return;
            }
            
            if (data.startsWith("do_missile_")) {
                result = missileAttack(state, data.split("_")[2]);
                advanceTurn = true;
            }
            else if (data.startsWith("do_drone_")) {
                result = droneAttack(state, data.split("_")[2]);
                advanceTurn = true;
            }
            else if (data.startsWith("do_cyber_")) {
                result = cyberAttack(state, data.split("_")[2]);
                advanceTurn = true;
            }
            else if (data.startsWith("do_war_")) {
                result = declareWar(state, data.split("_")[2]);
                advanceTurn = true;
            }
            
            // ============================================
            // مذاکره قدیمی
            // ============================================
            
            else if (data.startsWith("do_negotiate_")) {
                const parts = data.split("_");
                result = negotiate(state, parts[2], parts[4] || "trade", parts[3]);
                advanceTurn = true;
            }
            else if (data.startsWith("do_secret_")) {
                result = secretNegotiation(state, data.split("_")[2]);
                advanceTurn = true;
            }
            
            // ============================================
            // اقتصاد
            // ============================================
            
            else if (data === "economy_oil") {
                const kb = new InlineKeyboard()
                    .text("⬆️ صادرات", "do_oil_export_up").text("⬇️ صادرات", "do_oil_export_down").text("🏭 تولید", "do_oil_production_up").row()
                    .text("🔙 اقتصاد", "menu_economy");
                await ctx.editMessageCaption({
                    caption: `🛢️ *نفت*\nتولید: ${state.oil_production}M | صادرات: ${state.oil_export}M | ${state.oil_price}$`,
                    parse_mode: "Markdown",
                    reply_markup: kb
                });
                return;
            }
            else if (data === "do_oil_export_up") { result = increaseOilExport(state); advanceTurn = true; }
            else if (data === "do_oil_export_down") { result = decreaseOilExport(state); advanceTurn = true; }
            else if (data === "do_oil_production_up") { result = increaseOilProduction(state); advanceTurn = true; }
            
            else if (data === "economy_currency") {
                const kb = new InlineKeyboard()
                    .text("💵 افزایش", "do_currency_up").text("💵 کاهش", "do_currency_down").text("🔙", "menu_economy");
                await ctx.editMessageCaption({
                    caption: `💵 *ارز*\n${state.dollar_rate.toLocaleString()}T | ${state.dollar_reserves.toFixed(1)}B$`,
                    parse_mode: "Markdown",
                    reply_markup: kb
                });
                return;
            }
            else if (data === "do_currency_up") { result = changeCurrencyRate(state, true); advanceTurn = true; }
            else if (data === "do_currency_down") { result = changeCurrencyRate(state, false); advanceTurn = true; }
            
            else if (data.startsWith("buy_")) {
                const itemKey = data.substring(4);
                const domesticItems = ["missile_fath", "missile_kheibar", "drone_shahed136", "drone_shahed191", "drone_factory", "missile_factory"];
                result = domesticItems.includes(itemKey) ? buyDomestic(state, itemKey) : buyInternational(state, itemKey);
                advanceTurn = true;
            }
            
            else if (data === "economy_print") { result = printMoney(state); advanceTurn = true; }
            else if (data === "economy_corruption") { result = fightCorruption(state); advanceTurn = true; }
            else if (data === "economy_water") { result = manageWaterCrisis(state, 'invest'); advanceTurn = true; }
            else if (data === "economy_brain") { result = stopBrainDrain(state); advanceTurn = true; }
            
            else if (data === "economy_gas") {
                const kb = new InlineKeyboard()
                    .text("۵۰۰۰", "do_gas_5000").text("۱۰۰۰۰", "do_gas_10000").text("۱۵۰۰", "do_gas_1500").row()
                    .text("🔙", "menu_economy");
                await ctx.editMessageCaption({
                    caption: `⛽ *بنزین*\nفعلی: ${state.gas_price.toLocaleString()}T`,
                    parse_mode: "Markdown",
                    reply_markup: kb
                });
                return;
            }
            else if (data.startsWith("do_gas_")) { result = changeGasPrice(state, parseInt(data.split("_")[2])); advanceTurn = true; }
            
            else if (data === "economy_bitcoin") {
                const kb = new InlineKeyboard()
                    .text("⛏️", "do_bitcoin_mine").text("💰", "do_bitcoin_sell").text("🛒", "do_bitcoin_buy").row()
                    .text("🔙", "menu_economy");
                await ctx.editMessageCaption({
                    caption: `₿ *بیت‌کوین*\n${state.bitcoin} عدد`,
                    parse_mode: "Markdown",
                    reply_markup: kb
                });
                return;
            }
            else if (data === "do_bitcoin_mine") { result = manageBitcoin(state, 'mine'); advanceTurn = true; }
            else if (data === "do_bitcoin_sell") { result = manageBitcoin(state, 'sell'); advanceTurn = true; }
            else if (data === "do_bitcoin_buy") { result = manageBitcoin(state, 'buy'); advanceTurn = true; }
            
            else if (data === "economy_gold") {
                const kb = new InlineKeyboard()
                    .text("🛒 خرید", "do_gold_buy").text("💰 فروش", "do_gold_sell").text("🔙", "menu_economy");
                await ctx.editMessageCaption({
                    caption: `🥇 *طلا*\n${state.gold_tons.toFixed(2)} تن`,
                    parse_mode: "Markdown",
                    reply_markup: kb
                });
                return;
            }
            else if (data === "do_gold_buy") { result = manageGold(state, 'buy'); advanceTurn = true; }
            else if (data === "do_gold_sell") { result = manageGold(state, 'sell'); advanceTurn = true; }
            
            else if (data === "economy_subsidies") {
                const kb = new InlineKeyboard()
                    .text("⬆️ یارانه", "do_subsidy_up").text("⬇️ یارانه", "do_subsidy_down").row()
                    .text("⬆️ مالیات", "do_tax_up").text("⬇️ مالیات", "do_tax_down").row()
                    .text("🔙", "menu_economy");
                await ctx.editMessageCaption({
                    caption: "💰 *یارانه و مالیات*",
                    parse_mode: "Markdown",
                    reply_markup: kb
                });
                return;
            }
            else if (data === "do_subsidy_up") { result = manageSubsidies(state, true); advanceTurn = true; }
            else if (data === "do_subsidy_down") { result = manageSubsidies(state, false); advanceTurn = true; }
            else if (data === "do_tax_up") { result = manageTaxes(state, true); advanceTurn = true; }
            else if (data === "do_tax_down") { result = manageTaxes(state, false); advanceTurn = true; }
            
            // ============================================
            // هسته‌ای
            // ============================================
            
            else if (data === "nuclear_enrich") {
                const kb = new InlineKeyboard()
                    .text("۹۰٪", "do_enrich_90").text("۶۰٪", "do_enrich_60").text("🔙", "military_nuclear");
                await ctx.editMessageCaption({
                    caption: `⬆️ *غنی‌سازی*\nفعلی: ${state.nuclear_percent}٪`,
                    parse_mode: "Markdown",
                    reply_markup: kb
                });
                return;
            }
            else if (data.startsWith("do_enrich_")) { result = enrichUranium(state, parseInt(data.split("_")[2])); advanceTurn = true; }
            else if (data === "nuclear_decrease") { result = decreaseEnrichment(state, 20); advanceTurn = true; }
            else if (data === "nuclear_deal") { result = nuclearDeal(state); advanceTurn = true; }
            else if (data === "nuclear_leave_npt") { result = leaveNPT(state); advanceTurn = true; }
            
            // ============================================
            // نظامی
            // ============================================
            
            else if (data === "military_defense") { result = strengthenDefense(state); advanceTurn = true; }
            else if (data === "military_produce") {
                result = produceMissiles(state) + "\n" + produceDrones(state);
                advanceTurn = true;
            }
            else if (data === "military_special") { result = evadeSanctions(state); advanceTurn = true; }
            
            // ============================================
            // داخلی
            // ============================================
            
            else if (data === "domestic_production") { result = supportDomesticProduction(state); advanceTurn = true; }
            else if (data === "domestic_fatf") { result = acceptFATF(state); advanceTurn = true; }
            else if (data === "domestic_internet") {
                state.internet_filtered = !state.internet_filtered;
                state.popularity += state.internet_filtered ? -5 : 8;
                result = state.internet_filtered ? "🚫 اینترنت فیلتر شد" : "✅ اینترنت آزاد شد";
                advanceTurn = true;
            }
            else if (data === "domestic_protests") {
                const protesting = state.provinces.filter(p => p.has_protest);
                if (protesting.length === 0) {
                    await ctx.editMessageCaption({ caption: "✅ اعتراضی نیست!", reply_markup: getDomesticMenu() });
                    return;
                }
                let txt = "⚠️ *اعتراضات:*\n";
                protesting.forEach(p => { txt += `• ${p.name}: ${p.satisfaction}٪\n`; });
                const kb = new InlineKeyboard()
                    .text("🤝 مذاکره", "do_protest_talk").text("👮 سرکوب", "do_protest_suppress").text("💰 پول", "do_protest_pay").row()
                    .text("🔙", "menu_domestic");
                await ctx.editMessageCaption({ caption: txt, parse_mode: "Markdown", reply_markup: kb });
                return;
            }
            else if (data === "do_protest_talk") {
                state.provinces.forEach(p => { if (p.has_protest) { p.has_protest = false; p.satisfaction += 10; } });
                state.popularity += 5;
                result = "🤝 مذاکره موفق";
                advanceTurn = true;
            }
            else if (data === "do_protest_suppress") {
                state.provinces.forEach(p => { if (p.has_protest) { p.has_protest = false; p.satisfaction -= 15; } });
                state.popularity -= 8;
                state.sanctions = Math.min(100, state.sanctions + 5);
                result = "👮 سرکوب شد";
                advanceTurn = true;
            }
            else if (data === "do_protest_pay") {
                if (state.budget_toman < 10) { await ctx.answerCallbackQuery("❌ بودجه کم!"); return; }
                state.budget_toman -= 10;
                state.provinces.forEach(p => { if (p.has_protest) { p.has_protest = false; p.satisfaction += 20; } });
                state.popularity += 3;
                result = "💰 پرداخت (۱۰ همت)";
                advanceTurn = true;
            }
            
            // ============================================
            // نیابتی
            // ============================================
            
            else if (data === "proxies_report") {
                result = getProxiesReport(state);
                await ctx.editMessageMedia(
                    { type: "photo", media: getMenuBackground("menu_proxies"),
                      caption: result, parse_mode: "Markdown" },
                    { reply_markup: getProxiesMenu() }
                );
                return;
            }
            else if (data === "proxies_pay") { result = payAllProxies(state); advanceTurn = true; }
            else if (data === "proxies_create") {
                const kb = new InlineKeyboard()
                    .text("🔫 نظامی", "proxy_create_military").text("💻 سایبری", "proxy_create_cyber").text("💰 اقتصادی", "proxy_create_economic").row()
                    .text("🕵️ جاسوسی", "proxy_create_spy").text("📢 رسانه", "proxy_create_media").text("🔙", "menu_proxies");
                await ctx.editMessageCaption({ caption: "🏴 *نوع گروه*", parse_mode: "Markdown", reply_markup: kb });
                return;
            }
            else if (data.startsWith("proxy_create_")) {
                ctx.session.proxyType = data.split("_")[2];
                const kb = new InlineKeyboard();
                COUNTRIES.slice(0, 9).forEach((c, i) => {
                    if (i % 3 === 0) kb.row();
                    kb.text(`${c[1]} ${c[0]}`, `proxy_country_${c[2]}`);
                });
                kb.row().text("🔙", "proxies_create");
                await ctx.editMessageCaption({ caption: "📍 *کشور هدف*", parse_mode: "Markdown", reply_markup: kb });
                return;
            }
            else if (data.startsWith("proxy_country_")) {
                const code = data.split("_")[2];
                const type = ctx.session?.proxyType || "military";
                result = createProxy(state, `گروه_${code}`, code, type);
                advanceTurn = true;
            }
            else if (data === "proxies_clean") {
                // پاکسازی ردپای اولین گروه لو رفته
                const exposed = state.proxies.findIndex(p => p.exposed);
                if (exposed >= 0) {
                    result = cleanTraces(state, exposed);
                } else {
                    result = "✅ هیچ گروه لو رفته‌ای نیست!";
                }
                advanceTurn = true;
            }
            else if (data === "proxies_delete") {
                if (state.proxies.length > 0) {
                    result = deleteProxy(state, 0);
                } else {
                    result = "❌ گروهی نیست!";
                }
                advanceTurn = true;
            }
            
            // ============================================
            // پنل ادمین
            // ============================================
            
            else if (data.startsWith("admin_")) {
                if (userId !== ADMIN_ID) return;
                
                const adminActions = {
                    "admin_budget_100": () => { state.budget_toman += 100; return "💰 +۱۰۰ همت"; },
                    "admin_budget_500": () => { state.budget_toman += 500; return "💰 +۵۰۰ همت"; },
                    "admin_budget_1000": () => { state.budget_toman += 1000; return "💰 +۱۰۰۰ همت"; },
                    "admin_dollar_10": () => { state.dollar_reserves += 10; return "💵 +۱۰B$"; },
                    "admin_dollar_50": () => { state.dollar_reserves += 50; return "💵 +۵۰B$"; },
                    "admin_dollar_100": () => { state.dollar_reserves += 100; return "💵 +۱۰۰B$"; },
                    "admin_oil_1": () => { state.oil_export += 1; return "🛢️ +۱M"; },
                    "admin_oil_5": () => { state.oil_export += 5; return "🛢️ +۵M"; },
                    "admin_oil_10": () => { state.oil_export += 10; return "🛢️ +۱۰M"; },
                    "admin_missile_100": () => { state.missiles += 100; return "🚀 +۱۰۰"; },
                    "admin_missile_500": () => { state.missiles += 500; return "🚀 +۵۰۰"; },
                    "admin_missile_1000": () => { state.missiles += 1000; return "🚀 +۱۰۰۰"; },
                    "admin_pop_20": () => { state.popularity = Math.min(100, state.popularity + 20); return "👥 +۲۰٪"; },
                    "admin_pop_50": () => { state.popularity = Math.min(100, state.popularity + 50); return "👥 +۵۰٪"; },
                    "admin_pop_100": () => { state.popularity = 100; return "👥 ۱۰۰٪"; },
                    "admin_inf_10": () => { state.inflation = Math.max(0, state.inflation - 10); return "📉 -۱۰٪"; },
                    "admin_inf_20": () => { state.inflation = Math.max(0, state.inflation - 20); return "📉 -۲۰٪"; },
                    "admin_inf_0": () => { state.inflation = 0; return "📉 صفر!"; },
                    "admin_boost_proxies": () => { state.proxies.forEach(p => { p.forces += 10000; p.missiles += 500; p.drones += 200; p.morale = 'high'; }); return "🏴 تقویت شد"; },
                    "admin_relations_20": () => { state.countries.forEach(c => c[4] = Math.min(100, c[4] + 20)); return "🌍 +۲۰"; },
                    "admin_skip_5": () => { for(let i=0; i<5; i++) state.nextTurn(); return "⏭️ ۵ نوبت"; },
                    "admin_no_gameover": () => { state.game_over = false; state.popularity = Math.max(20, state.popularity); return "💀 غیرفعال"; }
                };
                
                const action = adminActions[data];
                if (action) {
                    result = "🔓 *ادوین:* " + action();
                }
            }
            
            // ============================================
            // پایان
            // ============================================
            
            if (advanceTurn) {
                state.nextTurn();
            }
            
            if (result) {
                const finalText = result + "\n\n" + state.getStatusSummary();
                await ctx.editMessageMedia(
                    { type: "photo", media: state.game_over ? IMAGES.defeat : IMAGES.main,
                      caption: finalText, parse_mode: "Markdown" },
                    { reply_markup: state.game_over ? undefined : getMainMenu() }
                );
            }
            
        } catch (error) {
            console.error("❌ خطا:", error);
            await ctx.editMessageCaption({
                caption: "⚠️ خطا! دوباره تلاش کن یا /start بزن.",
                reply_markup: getMainMenu()
            });
        }
    });
}

module.exports = { setupHandlers, getMainMenu };