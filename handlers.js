// handlers.js - هندلرهای تلگرام و منوها

const { GrammyError, InlineKeyboard } = require('grammy');
const { IranState, getPlayer, setPlayer, deletePlayer, playerExists } = require('./state');
const {
    increaseOilExport, decreaseOilExport, increaseOilProduction,
    changeCurrencyRate, supportDomesticProduction, increaseImports,
    decreaseImports, buyDomestic, buyInternational, sellOil, barterOil,
    changeGasPrice, manageBitcoin, manageGold, manageSubsidies,
    manageTaxes, printMoney
} = require('./economy');
const {
    missileAttack, droneAttack, cyberAttack, declareWar,
    strengthenDefense, produceMissiles, produceDrones, deployForces,
    defendCountry, enrichUranium, decreaseEnrichment, nuclearDeal,
    leaveNPT, targetedAssassination, infiltrationOperation
} = require('./military');
const {
    negotiate, secretNegotiation, defensePact, tradePact,
    cutRelations, expelAmbassador, mediateConflict, sanctionCountry,
    evadeSanctions, closeStraitOfHormuz, acceptFATF, complainToUN, sendAid
} = require('./diplomacy');
const {
    createProxy, fundProxy, sendWeapons, activateProxy,
    deactivateProxy, reactivateProxy, mergeProxies,
    getProxiesReport, payAllProxies
} = require('./proxies');

// ============================================
// 🎮 منوهای اصلی
// ============================================

/**
 * منوی اصلی
 */
function getMainMenu() {
    return new InlineKeyboard()
        .text("🏛️ اداره کشور", "menu_domestic").row()
        .text("🌍 سیاست خارجی", "menu_foreign").row()
        .text("⚔️ نظامی-امنیتی", "menu_military").row()
        .text("💰 اقتصاد", "menu_economy").row()
        .text("🏴 گروه‌های نیابتی", "menu_proxies").row()
        .text("📊 گزارش کامل", "menu_status").row()
        .text("📜 تاریخچه", "menu_history").row()
        .text("⏭️ پایان نوبت (ماه بعد)", "menu_next_turn");
}

/**
 * منوی سیاست خارجی
 */
function getForeignMenu(page = 0) {
    const keyboard = new InlineKeyboard();
    const countries = require('./config').COUNTRIES;
    
    // نمایش ۶ کشور در هر صفحه
    const start = page * 6;
    const end = Math.min(start + 6, countries.length);
    
    for (let i = start; i < end; i++) {
        keyboard.text(`${countries[i][1]} ${countries[i][0]}`, `country_${countries[i][2]}`).row();
    }
    
    // دکمه‌های ناوبری
    const navRow = [];
    if (page > 0) navRow.push(InlineKeyboard.text("⬅️ قبلی", `foreign_page_${page - 1}`));
    if (end < countries.length) navRow.push(InlineKeyboard.text("بعدی ➡️", `foreign_page_${page + 1}`));
    if (navRow.length > 0) keyboard.row(...navRow);
    
    keyboard.row().text("🔙 منوی اصلی", "main_menu");
    
    return keyboard;
}

/**
 * منوی عملیات روی یک کشور
 */
function getCountryMenu(countryCode) {
    return new InlineKeyboard()
        .text("🤝 مذاکره", `negotiate_${countryCode}`).row()
        .text("💰 تجارت", `trade_${countryCode}`).row()
        .text("📝 پیمان", `pact_${countryCode}`).row()
        .text("⚔️ حمله", `attack_${countryCode}`).row()
        .text("🚫 تحریم/قطع رابطه", `sanction_${countryCode}`).row()
        .text("🎁 ارسال کمک", `aid_${countryCode}`).row()
        .text("📊 اطلاعات بیشتر", `info_${countryCode}`).row()
        .text("🔙 بازگشت به کشورها", "menu_foreign");
}

/**
 * منوی نظامی
 */
function getMilitaryMenu() {
    return new InlineKeyboard()
        .text("🚀 حمله موشکی", "military_missile").row()
        .text("🛸 حمله پهپادی", "military_drone").row()
        .text("💻 حمله سایبری", "military_cyber").row()
        .text("⚔️ اعلان جنگ", "military_war").row()
        .text("🛡️ تقویت پدافند", "military_defense").row()
        .text("💣 تولید موشک", "military_produce_missile").row()
        .text("🛸 تولید پهپاد", "military_produce_drone").row()
        .text("⚛️ برنامه هسته‌ای", "military_nuclear").row()
        .text("🕵️ عملیات ویژه", "military_special").row()
        .text("🔙 منوی اصلی", "main_menu");
}

/**
 * منوی هسته‌ای
 */
function getNuclearMenu() {
    return new InlineKeyboard()
        .text("⬆️ افزایش غنی‌سازی", "nuclear_enrich").row()
        .text("⬇️ کاهش غنی‌سازی", "nuclear_decrease").row()
        .text("📝 توافق هسته‌ای", "nuclear_deal").row()
        .text("🚫 خروج از NPT", "nuclear_leave_npt").row()
        .text("🔙 منوی نظامی", "menu_military");
}

/**
 * منوی اقتصاد
 */
function getEconomyMenu() {
    return new InlineKeyboard()
        .text("🛢️ مدیریت نفت", "economy_oil").row()
        .text("💵 مدیریت ارز", "economy_currency").row()
        .text("🛒 بازار داخلی (تومان)", "economy_domestic_market").row()
        .text("🌍 بازار بین‌المللی (دلار)", "economy_international_market").row()
        .text("⛽ قیمت بنزین", "economy_gas").row()
        .text("₿ بیت‌کوین", "economy_bitcoin").row()
        .text("🥇 طلا", "economy_gold").row()
        .text("💰 یارانه و مالیات", "economy_subsidies").row()
        .text("🏦 چاپ پول", "economy_print").row()
        .text("🔙 منوی اصلی", "main_menu");
}

/**
 * منوی بازار داخلی
 */
function getDomesticMarketMenu() {
    return new InlineKeyboard()
        .text("🚀 موشک فتح (۵۰ همت)", "buy_missile_fath").row()
        .text("🚀 موشک خیبر (۲۰۰ همت)", "buy_missile_kheibar").row()
        .text("🛸 پهپاد شاهد-۱۳۶ (۱۰ همت)", "buy_drone_shahed136").row()
        .text("🛸 پهپاد شاهد-۱۹۱ (۵۰ همت)", "buy_drone_shahed191").row()
        .text("🏭 کارخانه پهپاد (۲۰۰۰ همت)", "buy_drone_factory").row()
        .text("🏭 کارخانه موشک (۵۰۰۰ همت)", "buy_missile_factory").row()
        .text("🔙 منوی اقتصاد", "menu_economy");
}

/**
 * منوی بازار بین‌المللی
 */
function getInternationalMarketMenu() {
    return new InlineKeyboard()
        .text("✈️ سوخو-۳۵ (۸۵M$)", "buy_sukhoi35").row()
        .text("🛡️ اس-۴۰۰ (۵۰۰M$)", "buy_s400").row()
        .text("🛰️ ماهواره جاسوسی (۲۰۰M$)", "buy_spy_satellite").row()
        .text("🚢 زیردریایی (۳۰۰M$)", "buy_submarine").row()
        .text("🌾 گندم (۳۰۰$)", "buy_wheat").row()
        .text("💊 واکسن و دارو (۲۰M$)", "buy_vaccine").row()
        .text("🔙 منوی اقتصاد", "menu_economy");
}

/**
 * منوی گروه‌های نیابتی
 */
function getProxiesMenu() {
    return new InlineKeyboard()
        .text("📊 گزارش گروه‌ها", "proxies_report").row()
        .text("🏴 ساخت گروه جدید", "proxies_create").row()
        .text("💰 تأمین مالی", "proxies_fund").row()
        .text("📦 ارسال سلاح", "proxies_weapons").row()
        .text("⚔️ فعال‌سازی عملیات", "proxies_activate").row()
        .text("💵 پرداخت حقوق ماهانه", "proxies_pay").row()
        .text("🔙 منوی اصلی", "main_menu");
}

/**
 * منوی اداره کشور
 */
function getDomesticMenu() {
    return new InlineKeyboard()
        .text("🏭 حمایت از تولید داخلی", "domestic_production").row()
        .text("📦 مدیریت واردات", "domestic_imports").row()
        .text("💵 تغییر نرخ ارز", "domestic_currency").row()
        .text("⛽ تغییر قیمت بنزین", "domestic_gas").row()
        .text("🌐 مدیریت اینترنت", "domestic_internet").row()
        .text("👥 مدیریت اعتراضات", "domestic_protests").row()
        .text("🔙 منوی اصلی", "main_menu");
}

// ============================================
// 🎮 مدیریت دستورات و دکمه‌ها
// ============================================

/**
 * راه‌اندازی همه هندلرها
 */
function setupHandlers(bot) {
    
    // ============================================
    // 📝 دستور /start
    // ============================================
    bot.command("start", async (ctx) => {
        const userId = ctx.from.id;
        const userName = ctx.from.first_name;
        
        const state = new IranState(userName);
        setPlayer(userId, state);
        
        await ctx.reply(
            `🏛️ *${userName}* عزیز، شما اکنون رئیس‌جمهور ایران هستید!\n\n` +
            `📅 تاریخ: ${state.year}/${state.month}\n` +
            `🇮🇷 کشور در دستان شماست.\n` +
            `تصمیمات شما سرنوشت ۸۵ میلیون ایرانی را تعیین می‌کند.\n\n` +
            `*برای شروع یکی از گزینه‌ها را انتخاب کنید:*`,
            {
                parse_mode: "Markdown",
                reply_markup: getMainMenu()
            }
        );
    });
    
    // ============================================
    // 📝 دستور /help
    // ============================================
    bot.command("help", async (ctx) => {
        await ctx.reply(
            "🎯 *راهنمای بازی*\n\n" +
            "• /start - شروع بازی جدید\n" +
            "• /status - مشاهده وضعیت کشور\n" +
            "• /help - این راهنما\n\n" +
            "📝 با دکمه‌های زیر هر پیام می‌تونی بازی کنی!",
            { parse_mode: "Markdown" }
        );
    });
    
    // ============================================
    // 📝 دستور /status
    // ============================================
    bot.command("status", async (ctx) => {
        const userId = ctx.from.id;
        const state = getPlayer(userId);
        
        if (!state) {
            return ctx.reply("❌ ابتدا /start را بزنید!");
        }
        
        await ctx.reply(state.getStatusSummary(), {
            parse_mode: "Markdown",
            reply_markup: getMainMenu()
        });
    });
    
    // ============================================
    // 🔘 مدیریت همه دکمه‌ها
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
        
        // ============================================
        // منوهای اصلی
        // ============================================
        
        // منوی اصلی
        if (data === "main_menu") {
            await ctx.editMessageText(
                "🏛️ *منوی اصلی*\nتصمیم بعدی شما چیست؟",
                {
                    parse_mode: "Markdown",
                    reply_markup: getMainMenu()
                }
            );
        }
        
        // منوی سیاست خارجی
        else if (data === "menu_foreign" || data.startsWith("foreign_page_")) {
            let page = 0;
            if (data.startsWith("foreign_page_")) {
                page = parseInt(data.split("_")[2]);
            }
            
            await ctx.editMessageText(
                "🌍 *انتخاب کشور*\nیک کشور را برای تعامل انتخاب کنید:",
                {
                    parse_mode: "Markdown",
                    reply_markup: getForeignMenu(page)
                }
            );
        }
        
        // منوی نظامی
        else if (data === "menu_military") {
            await ctx.editMessageText(
                "⚔️ *فرماندهی نظامی*\nچه عملیاتی انجام دهیم؟\n\n" +
                `🚀 موشک: ${state.missiles.toLocaleString()}\n` +
                `🛸 پهپاد: ${state.drones.toLocaleString()}\n` +
                `👥 نیرو: ${state.soldiers.toLocaleString()}\n` +
                `⚛️ غنی‌سازی: ${state.nuclear_percent}٪`,
                {
                    parse_mode: "Markdown",
                    reply_markup: getMilitaryMenu()
                }
            );
        }
        
        // منوی هسته‌ای
        else if (data === "military_nuclear") {
            await ctx.editMessageText(
                `⚛️ *برنامه هسته‌ای*\n\n` +
                `غنی‌سازی فعلی: ${state.nuclear_percent}٪\n` +
                `توافق هسته‌ای: ${state.nuclear_deal_active ? '✅ فعال' : '❌ غیرفعال'}\n` +
                `تحریم: ${state.sanctions}/۱۰۰`,
                {
                    parse_mode: "Markdown",
                    reply_markup: getNuclearMenu()
                }
            );
        }
        
        // منوی اقتصاد
        else if (data === "menu_economy") {
            await ctx.editMessageText(
                "💰 *مدیریت اقتصاد*\n\n" +
                `💵 بودجه: ${state.budget_toman.toFixed(1)} همت\n` +
                `💲 ذخایر ارزی: ${state.dollar_reserves.toFixed(1)} میلیارد دلار\n` +
                `🛢️ نفت: ${state.oil_export} میلیون بشکه/روز\n` +
                `📊 تورم: ${state.inflation.toFixed(1)}٪`,
                {
                    parse_mode: "Markdown",
                    reply_markup: getEconomyMenu()
                }
            );
        }
        
        // منوی بازار داخلی
        else if (data === "economy_domestic_market") {
            await ctx.editMessageText(
                "🛒 *بازار داخلی (تومان)*\n\n" +
                "💰 بودجه: " + state.budget_toman.toFixed(1) + " همت\n\n" +
                "یک کالا انتخاب کن:",
                {
                    parse_mode: "Markdown",
                    reply_markup: getDomesticMarketMenu()
                }
            );
        }
        
        // منوی بازار بین‌المللی
        else if (data === "economy_international_market") {
            await ctx.editMessageText(
                "🌍 *بازار بین‌المللی (دلار)*\n\n" +
                "💲 ذخایر: " + state.dollar_reserves.toFixed(1) + " میلیارد دلار\n\n" +
                "یک کالا انتخاب کن:",
                {
                    parse_mode: "Markdown",
                    reply_markup: getInternationalMarketMenu()
                }
            );
        }
        
        // منوی گروه‌های نیابتی
        else if (data === "menu_proxies") {
            await ctx.editMessageText(
                "🏴 *گروه‌های نیابتی*\n\n" +
                `تعداد گروه‌ها: ${state.proxies.length}\n` +
                `بودجه ماهانه کل: ${state.proxies.reduce((sum, p) => sum + (p.active ? p.budget_monthly : 0), 0).toFixed(1)} همت`,
                {
                    parse_mode: "Markdown",
                    reply_markup: getProxiesMenu()
                }
            );
        }
        
        // منوی اداره کشور
        else if (data === "menu_domestic") {
            await ctx.editMessageText(
                "🏛️ *اداره کشور*\n\n" +
                `👥 محبوبیت: ${state.popularity}٪\n` +
                `🌐 اینترنت: ${state.internet_filtered ? '🚫 فیلتر' : '✅ آزاد'}\n` +
                `⛽ بنزین: ${state.gas_price.toLocaleString()} تومان`,
                {
                    parse_mode: "Markdown",
                    reply_markup: getDomesticMenu()
                }
            );
        }
        
        // ============================================
        // ادامه در بخش بعد...
        // ============================================
        
        else {
            // پردازش سایر دکمه‌ها
            await handleComplexActions(ctx, state, data);
        }
    });
}

/**
 * پردازش عملیات‌های پیچیده
 */
async function handleComplexActions(ctx, state, data) {
    let result = "✅ عملیات انجام شد";
    
    // انتخاب کشور
    if (data.startsWith("country_")) {
        const countryCode = data.split("_")[1];
        const country = state.findCountry(countryCode);
        
        if (country) {
            await ctx.editMessageText(
                `${country[1]} *${country[0]}*\n\n` +
                `📊 روابط: ${country[4]}/100\n` +
                `💰 تجارت: ${country[5]} میلیارد دلار\n` +
                `📍 منطقه: ${country[3]}\n\n` +
                `چه اقدامی می‌خوای انجام بدی؟`,
                {
                    parse_mode: "Markdown",
                    reply_markup: getCountryMenu(countryCode)
                }
            );
        }
    }
    
    // مذاکره با کشور
    else if (data.startsWith("negotiate_")) {
        const countryCode = data.split("_")[1];
        const keyboard = new InlineKeyboard()
            .text("کارشناسی", `do_negotiate_${countryCode}_expert_trade`).row()
            .text("سفیر", `do_negotiate_${countryCode}_ambassador_trade`).row()
            .text("وزیر خارجه", `do_negotiate_${countryCode}_minister_trade`).row()
            .text("رئیس‌جمهور", `do_negotiate_${countryCode}_president_trade`).row()
            .text("محرمانه 🤫", `do_secret_${countryCode}`).row()
            .text("🔙 بازگشت", `country_${countryCode}`);
        
        await ctx.editMessageText(
            "🤝 *سطح مذاکره را انتخاب کن*\n\n" +
            "💰 هزینه:\n" +
            "• کارشناسی: ۰.۱ همت\n" +
            "• سفیر: ۰.۵ همت\n" +
            "• وزیر: ۲ همت\n" +
            "• رئیس‌جمهور: ۵ همت",
            {
                parse_mode: "Markdown",
                reply_markup: keyboard
            }
        );
    }
    
    // اجرای مذاکره
    else if (data.startsWith("do_negotiate_")) {
        const parts = data.split("_");
        const countryCode = parts[2];
        const level = parts[3];
        const topic = parts[4] || "trade";
        
        result = negotiate(state, countryCode, topic, level);
        
        await ctx.editMessageText(result, {
            parse_mode: "Markdown",
            reply_markup: getMainMenu()
        });
    }
    
    // مذاکره محرمانه
    else if (data.startsWith("do_secret_")) {
        const countryCode = data.split("_")[2];
        result = secretNegotiation(state, countryCode);
        
        await ctx.editMessageText(result, {
            parse_mode: "Markdown",
            reply_markup: getMainMenu()
        });
    }
    
    // حمله به کشور
    else if (data.startsWith("attack_")) {
        const countryCode = data.split("_")[1];
        const keyboard = new InlineKeyboard()
            .text("🚀 حمله موشکی", `do_missile_${countryCode}`).row()
            .text("🛸 حمله پهپادی", `do_drone_${countryCode}`).row()
            .text("💻 حمله سایبری", `do_cyber_${countryCode}`).row()
            .text("⚔️ اعلان جنگ", `do_war_${countryCode}`).row()
            .text("🔙 بازگشت", `country_${countryCode}`);
        
        await ctx.editMessageText(
            "⚔️ *نوع حمله را انتخاب کن*\n\n" +
            `🚀 موشک: ${state.missiles.toLocaleString()} عدد\n` +
            `🛸 پهپاد: ${state.drones.toLocaleString()} عدد`,
            {
                parse_mode: "Markdown",
                reply_markup: keyboard
            }
        );
    }
    
    // اجرای حمله موشکی
    else if (data.startsWith("do_missile_")) {
        const countryCode = data.split("_")[2];
        result = missileAttack(state, countryCode);
        state.nextTurn();
        
        await ctx.editMessageText(result + "\n\n" + state.getStatusSummary(), {
            parse_mode: "Markdown",
            reply_markup: state.game_over ? undefined : getMainMenu()
        });
    }
    
    // اجرای حمله پهپادی
    else if (data.startsWith("do_drone_")) {
        const countryCode = data.split("_")[2];
        result = droneAttack(state, countryCode);
        state.nextTurn();
        
        await ctx.editMessageText(result + "\n\n" + state.getStatusSummary(), {
            parse_mode: "Markdown",
            reply_markup: state.game_over ? undefined : getMainMenu()
        });
    }
    
    // اجرای حمله سایبری
    else if (data.startsWith("do_cyber_")) {
        const countryCode = data.split("_")[2];
        result = cyberAttack(state, countryCode);
        state.nextTurn();
        
        await ctx.editMessageText(result + "\n\n" + state.getStatusSummary(), {
            parse_mode: "Markdown",
            reply_markup: state.game_over ? undefined : getMainMenu()
        });
    }
    
    // اعلان جنگ
    else if (data.startsWith("do_war_")) {
        const countryCode = data.split("_")[2];
        result = declareWar(state, countryCode);
        state.nextTurn();
        
        await ctx.editMessageText(result + "\n\n" + state.getStatusSummary(), {
            parse_mode: "Markdown",
            reply_markup: state.game_over ? undefined : getMainMenu()
        });
    }
    
    // گزارش وضعیت
    else if (data === "menu_status") {
        await ctx.editMessageText(state.getStatusSummary(), {
            parse_mode: "Markdown",
            reply_markup: getMainMenu()
        });
    }
    
    // تاریخچه
    else if (data === "menu_history") {
        const historyText = state.history.length > 0 
            ? state.history.slice(-15).join("\n")
            : "📜 هنوز تصمیمی گرفته نشده";
        
        await ctx.editMessageText(
            "📜 *تاریخچه تصمیمات*\n\n" + historyText,
            {
                parse_mode: "Markdown",
                reply_markup: getMainMenu()
            }
        );
    }
    
    // پایان نوبت
    else if (data === "menu_next_turn") {
        state.nextTurn();
        
        await ctx.editMessageText(
            "⏭️ *یک ماه گذشت*\n\n" + state.getStatusSummary(),
            {
                parse_mode: "Markdown",
                reply_markup: state.game_over ? undefined : getMainMenu()
            }
        );
    }
    
    // ============================================
    // عملیات‌های اقتصادی
    // ============================================
    
    // افزایش صادرات نفت
    else if (data === "economy_oil") {
        const keyboard = new InlineKeyboard()
            .text("🛢️ افزایش صادرات", "do_oil_export_up").row()
            .text("📉 کاهش صادرات", "do_oil_export_down").row()
            .text("🏭 افزایش تولید", "do_oil_production_up").row()
            .text("🤝 فروش به کشور", "do_oil_sell").row()
            .text("🔄 تهاتر نفت", "do_oil_barter").row()
            .text("🔙 بازگشت", "menu_economy");
        
        await ctx.editMessageText(
            "🛢️ *مدیریت نفت*\n\n" +
            `تولید: ${state.oil_production} میلیون بشکه/روز\n` +
            `صادرات: ${state.oil_export} میلیون بشکه/روز\n` +
            `قیمت: ${state.oil_price} دلار`,
            {
                parse_mode: "Markdown",
                reply_markup: keyboard
            }
        );
    }
    
    else if (data === "do_oil_export_up") {
        result = increaseOilExport(state);
        state.nextTurn();
        await ctx.editMessageText(result + "\n\n" + state.getStatusSummary(), {
            parse_mode: "Markdown",
            reply_markup: state.game_over ? undefined : getMainMenu()
        });
    }
    
    else if (data === "do_oil_export_down") {
        result = decreaseOilExport(state);
        state.nextTurn();
        await ctx.editMessageText(result + "\n\n" + state.getStatusSummary(), {
            parse_mode: "Markdown",
            reply_markup: state.game_over ? undefined : getMainMenu()
        });
    }
    
    else if (data === "do_oil_production_up") {
        result = increaseOilProduction(state);
        state.nextTurn();
        await ctx.editMessageText(result + "\n\n" + state.getStatusSummary(), {
            parse_mode: "Markdown",
            reply_markup: state.game_over ? undefined : getMainMenu()
        });
    }
    
    // مدیریت ارز
    else if (data === "economy_currency") {
        const keyboard = new InlineKeyboard()
            .text("💵 افزایش نرخ ارز", "do_currency_up").row()
            .text("💵 کاهش نرخ ارز", "do_currency_down").row()
            .text("🔙 بازگشت", "menu_economy");
        
        await ctx.editMessageText(
            "💵 *مدیریت ارز*\n\n" +
            `نرخ فعلی: ${state.dollar_rate.toLocaleString()} تومان\n` +
            `ذخایر: ${state.dollar_reserves.toFixed(1)} میلیارد دلار`,
            {
                parse_mode: "Markdown",
                reply_markup: keyboard
            }
        );
    }
    
    else if (data === "do_currency_up") {
        result = changeCurrencyRate(state, true);
        state.nextTurn();
        await ctx.editMessageText(result + "\n\n" + state.getStatusSummary(), {
            parse_mode: "Markdown",
            reply_markup: state.game_over ? undefined : getMainMenu()
        });
    }
    
    else if (data === "do_currency_down") {
        result = changeCurrencyRate(state, false);
        state.nextTurn();
        await ctx.editMessageText(result + "\n\n" + state.getStatusSummary(), {
            parse_mode: "Markdown",
            reply_markup: state.game_over ? undefined : getMainMenu()
        });
    }
    
    // خرید از بازار داخلی
    else if (data.startsWith("buy_")) {
        const itemKey = data.substring(4);
        
        // بازار داخلی
        if (["missile_fath", "missile_kheibar", "drone_shahed136", "drone_shahed191", 
             "drone_factory", "missile_factory"].includes(itemKey)) {
            result = buyDomestic(state, itemKey);
        }
        // بازار بین‌المللی
        else {
            result = buyInternational(state, itemKey);
        }
        
        state.nextTurn();
        await ctx.editMessageText(result + "\n\n" + state.getStatusSummary(), {
            parse_mode: "Markdown",
            reply_markup: state.game_over ? undefined : getMainMenu()
        });
    }
    
    // حمایت از تولید داخلی
    else if (data === "domestic_production") {
        result = supportDomesticProduction(state);
        state.nextTurn();
        await ctx.editMessageText(result + "\n\n" + state.getStatusSummary(), {
            parse_mode: "Markdown",
            reply_markup: state.game_over ? undefined : getMainMenu()
        });
    }
    
    // افزایش واردات
    else if (data === "domestic_imports") {
        const keyboard = new InlineKeyboard()
            .text("📦 افزایش واردات", "do_imports_up").row()
            .text("📦 کاهش واردات", "do_imports_down").row()
            .text("🔙 بازگشت", "menu_domestic");
        
        await ctx.editMessageText(
            "📦 *مدیریت واردات*\n\n" +
            "انتخاب کن:",
            {
                parse_mode: "Markdown",
                reply_markup: keyboard
            }
        );
    }
    
    else if (data === "do_imports_up") {
        result = increaseImports(state);
        state.nextTurn();
        await ctx.editMessageText(result + "\n\n" + state.getStatusSummary(), {
            parse_mode: "Markdown",
            reply_markup: state.game_over ? undefined : getMainMenu()
        });
    }
    
    else if (data === "do_imports_down") {
        result = decreaseImports(state);
        state.nextTurn();
        await ctx.editMessageText(result + "\n\n" + state.getStatusSummary(), {
            parse_mode: "Markdown",
            reply_markup: state.game_over ? undefined : getMainMenu()
        });
    }
    
    // چاپ پول
    else if (data === "economy_print") {
        result = printMoney(state);
        state.nextTurn();
        await ctx.editMessageText(result + "\n\n" + state.getStatusSummary(), {
            parse_mode: "Markdown",
            reply_markup: state.game_over ? undefined : getMainMenu()
        });
    }
    
    // ============================================
    // عملیات‌های هسته‌ای
    // ============================================
    
    else if (data === "nuclear_enrich") {
        const keyboard = new InlineKeyboard()
            .text("۶۰٪ → ۹۰٪", "do_enrich_90").row()
            .text("۳.۶۷٪ → ۶۰٪", "do_enrich_60").row()
            .text("🔙 بازگشت", "military_nuclear");
        
        await ctx.editMessageText(
            "⬆️ *افزایش غنی‌سازی*\n\n" +
            `فعلی: ${state.nuclear_percent}٪\n` +
            "هدف را انتخاب کن:",
            {
                parse_mode: "Markdown",
                reply_markup: keyboard
            }
        );
    }
    
    else if (data.startsWith("do_enrich_")) {
        const target = parseInt(data.split("_")[2]);
        result = enrichUranium(state, target);
        state.nextTurn();
        await ctx.editMessageText(result + "\n\n" + state.getStatusSummary(), {
            parse_mode: "Markdown",
            reply_markup: state.game_over ? undefined : getMainMenu()
        });
    }
    
    else if (data === "nuclear_deal") {
        result = nuclearDeal(state);
        state.nextTurn();
        await ctx.editMessageText(result + "\n\n" + state.getStatusSummary(), {
            parse_mode: "Markdown",
            reply_markup: state.game_over ? undefined : getMainMenu()
        });
    }
    
    else if (data === "nuclear_leave_npt") {
        const keyboard = new InlineKeyboard()
            .text("⚠️ بله، خروج از NPT", "do_leave_npt_confirm").row()
            .text("🔙 انصراف", "military_nuclear");
        
        await ctx.editMessageText(
            "🚫 *خروج از NPT*\n\n" +
            "⚠️ این تصمیم عواقب بسیار سنگینی دارد!\n" +
            "• تحریم ۱۰۰٪\n" +
            "• انزوای کامل بین‌المللی\n" +
            "• خطر جنگ\n\n" +
            "مطمئنی؟",
            {
                parse_mode: "Markdown",
                reply_markup: keyboard
            }
        );
    }
    
    else if (data === "do_leave_npt_confirm") {
        result = leaveNPT(state);
        state.nextTurn();
        await ctx.editMessageText(result + "\n\n" + state.getStatusSummary(), {
            parse_mode: "Markdown",
            reply_markup: state.game_over ? undefined : getMainMenu()
        });
    }
    
    // ============================================
    // گروه‌های نیابتی
    // ============================================
    
    else if (data === "proxies_report") {
        result = getProxiesReport(state);
        await ctx.editMessageText(result, {
            parse_mode: "Markdown",
            reply_markup: getProxiesMenu()
        });
    }
    
    else if (data === "proxies_pay") {
        result = payAllProxies(state);
        state.nextTurn();
        await ctx.editMessageText(result + "\n\n" + state.getStatusSummary(), {
            parse_mode: "Markdown",
            reply_markup: state.game_over ? undefined : getMainMenu()
        });
    }
    
    // ============================================
    // سایر عملیات‌ها
    // ============================================
    
    // تقویت پدافند
    else if (data === "military_defense") {
        result = strengthenDefense(state);
        state.nextTurn();
        await ctx.editMessageText(result + "\n\n" + state.getStatusSummary(), {
            parse_mode: "Markdown",
            reply_markup: state.game_over ? undefined : getMainMenu()
        });
    }
    
    // تولید موشک
    else if (data === "military_produce_missile") {
        result = produceMissiles(state);
        state.nextTurn();
        await ctx.editMessageText(result + "\n\n" + state.getStatusSummary(), {
            parse_mode: "Markdown",
            reply_markup: state.game_over ? undefined : getMainMenu()
        });
    }
    
    // تولید پهپاد
    else if (data === "military_produce_drone") {
        result = produceDrones(state);
        state.nextTurn();
        await ctx.editMessageText(result + "\n\n" + state.getStatusSummary(), {
            parse_mode: "Markdown",
            reply_markup: state.game_over ? undefined : getMainMenu()
        });
    }
    
    // پذیرش FATF
    else if (data === "domestic_fatf") {
        result = acceptFATF(state);
        state.nextTurn();
        await ctx.editMessageText(result + "\n\n" + state.getStatusSummary(), {
            parse_mode: "Markdown",
            reply_markup: state.game_over ? undefined : getMainMenu()
        });
    }
    
    // بستن تنگه هرمز
    else if (data === "military_hormuz") {
        const keyboard = new InlineKeyboard()
            .text("⚠️ بله، تنگه هرمز را ببند", "do_hormuz_confirm").row()
            .text("🔙 انصراف", "menu_military");
        
        await ctx.editMessageText(
            "🚫 *بستن تنگه هرمز*\n\n" +
            "⚠️ این تصمیم ممکن است باعث جنگ جهانی شود!\n\n" +
            "مطمئنی؟",
            {
                parse_mode: "Markdown",
                reply_markup: keyboard
            }
        );
    }
    
    else if (data === "do_hormuz_confirm") {
        result = closeStraitOfHormuz(state);
        state.nextTurn();
        await ctx.editMessageText(result + "\n\n" + state.getStatusSummary(), {
            parse_mode: "Markdown",
            reply_markup: state.game_over ? undefined : getMainMenu()
        });
    }
    
    // مدیریت اینترنت
    else if (data === "domestic_internet") {
        state.internet_filtered = !state.internet_filtered;
        state.popularity += state.internet_filtered ? -5 : 8;
        
        result = state.internet_filtered 
            ? "🚫 اینترنت فیلتر شد\n⚠️ محبوبیت -۵٪"
            : "✅ اینترنت آزاد شد\n✅ محبوبیت +۸٪";
        
        state.nextTurn();
        await ctx.editMessageText(result + "\n\n" + state.getStatusSummary(), {
            parse_mode: "Markdown",
            reply_markup: state.game_over ? undefined : getMainMenu()
        });
    }
    
    // تغییر قیمت بنزین
    else if (data === "domestic_gas") {
        const keyboard = new InlineKeyboard()
            .text("⛽ ۵,۰۰۰ تومان", "do_gas_5000").row()
            .text("⛽ ۱۰,۰۰۰ تومان", "do_gas_10000").row()
            .text("⛽ ۱,۵۰۰ تومان", "do_gas_1500").row()
            .text("🔙 بازگشت", "menu_domestic");
        
        await ctx.editMessageText(
            "⛽ *قیمت جدید بنزین*\n\n" +
            `قیمت فعلی: ${state.gas_price.toLocaleString()} تومان`,
            {
                parse_mode: "Markdown",
                reply_markup: keyboard
            }
        );
    }
    
    else if (data.startsWith("do_gas_")) {
        const newPrice = parseInt(data.split("_")[2]);
        result = changeGasPrice(state, newPrice);
        state.nextTurn();
        await ctx.editMessageText(result + "\n\n" + state.getStatusSummary(), {
            parse_mode: "Markdown",
            reply_markup: state.game_over ? undefined : getMainMenu()
        });
    }
    
    else {
        await ctx.editMessageText(
            "🔧 این بخش در حال توسعه است...\n\n" +
            "لطفاً از منوی اصلی یک گزینه دیگر انتخاب کنید.",
            { reply_markup: getMainMenu() }
        );
    }
}

// ============================================
// 📤 خروجی
// ============================================
module.exports = {
    setupHandlers,
    getMainMenu
};