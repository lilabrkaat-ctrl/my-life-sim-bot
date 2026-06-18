// handlers.js - هندلرهای تلگرام و منوها

const { InlineKeyboard } = require('grammy');
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
    leaveNPT
} = require('./military');
const {
    negotiate, secretNegotiation, defensePact, tradePact,
    cutRelations, expelAmbassador, sanctionCountry,
    evadeSanctions, closeStraitOfHormuz, acceptFATF, sendAid
} = require('./diplomacy');
const {
    createProxy, fundProxy, sendWeapons, activateProxy,
    getProxiesReport, payAllProxies
} = require('./proxies');

// ============================================
// 🎮 منوها
// ============================================

function getMainMenu() {
    return new InlineKeyboard()
        .text("🏛️ اداره کشور", "menu_domestic").row()
        .text("🌍 سیاست خارجی", "menu_foreign").row()
        .text("⚔️ نظامی-امنیتی", "menu_military").row()
        .text("💰 اقتصاد", "menu_economy").row()
        .text("🏴 گروه‌های نیابتی", "menu_proxies").row()
        .text("📊 گزارش کامل", "menu_status").row()
        .text("📜 تاریخچه", "menu_history").row()
        .text("⏭️ پایان نوبت", "menu_next_turn");
}

function getForeignMenu(page = 0) {
    const { COUNTRIES } = require('./config');
    const keyboard = new InlineKeyboard();
    const start = page * 6;
    const end = Math.min(start + 6, COUNTRIES.length);
    
    for (let i = start; i < end; i++) {
        keyboard.text(`${COUNTRIES[i][1]} ${COUNTRIES[i][0]}`, `country_${COUNTRIES[i][2]}`).row();
    }
    
    if (page > 0 || end < COUNTRIES.length) {
        const navButtons = [];
        if (page > 0) navButtons.push(InlineKeyboard.text("⬅️ قبلی", `foreign_page_${page - 1}`));
        if (end < COUNTRIES.length) navButtons.push(InlineKeyboard.text("بعدی ➡️", `foreign_page_${page + 1}`));
        keyboard.row(...navButtons);
    }
    
    keyboard.row().text("🔙 منوی اصلی", "main_menu");
    return keyboard;
}

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

function getNuclearMenu() {
    return new InlineKeyboard()
        .text("⬆️ افزایش غنی‌سازی", "nuclear_enrich").row()
        .text("⬇️ کاهش غنی‌سازی", "nuclear_decrease").row()
        .text("📝 توافق هسته‌ای", "nuclear_deal").row()
        .text("🚫 خروج از NPT", "nuclear_leave_npt").row()
        .text("🔙 منوی نظامی", "menu_military");
}

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

function getDomesticMenu() {
    return new InlineKeyboard()
        .text("🏭 حمایت از تولید داخلی", "domestic_production").row()
        .text("📦 مدیریت واردات", "domestic_imports").row()
        .text("💵 تغییر نرخ ارز", "domestic_currency").row()
        .text("⛽ تغییر قیمت بنزین", "domestic_gas").row()
        .text("🌐 مدیریت اینترنت", "domestic_internet").row()
        .text("👥 مدیریت اعتراضات", "domestic_protests").row()
        .text("✅ پذیرش FATF", "domestic_fatf").row()
        .text("🔙 منوی اصلی", "main_menu");
}

// ============================================
// 🎮 راه‌اندازی هندلرها
// ============================================

function setupHandlers(bot) {
    
    // ذخیره موقت برای session
    const sessions = new Map();
    
    bot.use(async (ctx, next) => {
        const userId = ctx.from?.id;
        if (userId && !sessions.has(userId)) {
            sessions.set(userId, {});
        }
        ctx.session = sessions.get(userId);
        await next();
    });
    
    // دستور /start
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
    
    // دستور /status
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
    
    // مدیریت دکمه‌ها
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
        
        try {
            // ============================================
            // منوهای اصلی
            // ============================================
            
            if (data === "main_menu") {
                await ctx.editMessageText("🏛️ *منوی اصلی*\nتصمیم بعدی شما چیست؟", {
                    parse_mode: "Markdown",
                    reply_markup: getMainMenu()
                });
                return;
            }
            
            if (data === "menu_foreign" || data.startsWith("foreign_page_")) {
                let page = data.startsWith("foreign_page_") ? parseInt(data.split("_")[2]) : 0;
                await ctx.editMessageText("🌍 *انتخاب کشور*\nیک کشور را برای تعامل انتخاب کنید:", {
                    parse_mode: "Markdown",
                    reply_markup: getForeignMenu(page)
                });
                return;
            }
            
            if (data === "menu_military") {
                await ctx.editMessageText(
                    `⚔️ *فرماندهی نظامی*\n\n🚀 موشک: ${state.missiles.toLocaleString()}\n🛸 پهپاد: ${state.drones.toLocaleString()}\n👥 نیرو: ${state.soldiers.toLocaleString()}\n⚛️ غنی‌سازی: ${state.nuclear_percent}٪`,
                    { parse_mode: "Markdown", reply_markup: getMilitaryMenu() }
                );
                return;
            }
            
            if (data === "military_nuclear") {
                await ctx.editMessageText(
                    `⚛️ *برنامه هسته‌ای*\n\nغنی‌سازی فعلی: ${state.nuclear_percent}٪\nتوافق: ${state.nuclear_deal_active ? '✅' : '❌'}\nتحریم: ${state.sanctions}/۱۰۰`,
                    { parse_mode: "Markdown", reply_markup: getNuclearMenu() }
                );
                return;
            }
            
            if (data === "menu_economy") {
                await ctx.editMessageText(
                    `💰 *مدیریت اقتصاد*\n\n💵 بودجه: ${state.budget_toman.toFixed(1)} همت\n💲 ارزی: ${state.dollar_reserves.toFixed(1)} میلیارد دلار\n🛢️ نفت: ${state.oil_export} میلیون بشکه/روز\n📊 تورم: ${state.inflation.toFixed(1)}٪`,
                    { parse_mode: "Markdown", reply_markup: getEconomyMenu() }
                );
                return;
            }
            
            if (data === "economy_domestic_market") {
                await ctx.editMessageText(
                    `🛒 *بازار داخلی (تومان)*\n\n💰 بودجه: ${state.budget_toman.toFixed(1)} همت`,
                    { parse_mode: "Markdown", reply_markup: getDomesticMarketMenu() }
                );
                return;
            }
            
            if (data === "economy_international_market") {
                await ctx.editMessageText(
                    `🌍 *بازار بین‌المللی (دلار)*\n\n💲 ذخایر: ${state.dollar_reserves.toFixed(1)} میلیارد دلار`,
                    { parse_mode: "Markdown", reply_markup: getInternationalMarketMenu() }
                );
                return;
            }
            
            if (data === "menu_proxies") {
                const totalBudget = state.proxies.reduce((sum, p) => sum + (p.active ? p.budget_monthly : 0), 0);
                await ctx.editMessageText(
                    `🏴 *گروه‌های نیابتی*\n\nتعداد: ${state.proxies.length}\nبودجه ماهانه: ${totalBudget.toFixed(1)} همت`,
                    { parse_mode: "Markdown", reply_markup: getProxiesMenu() }
                );
                return;
            }
            
            if (data === "menu_domestic") {
                await ctx.editMessageText(
                    `🏛️ *اداره کشور*\n\n👥 محبوبیت: ${state.popularity}٪\n🌐 اینترنت: ${state.internet_filtered ? '🚫 فیلتر' : '✅ آزاد'}\n⛽ بنزین: ${state.gas_price.toLocaleString()} تومان`,
                    { parse_mode: "Markdown", reply_markup: getDomesticMenu() }
                );
                return;
            }
            
            if (data === "menu_status") {
                await ctx.editMessageText(state.getStatusSummary(), {
                    parse_mode: "Markdown",
                    reply_markup: getMainMenu()
                });
                return;
            }
            
            if (data === "menu_history") {
                const historyText = state.history.length > 0 ? state.history.slice(-15).join("\n") : "📜 هنوز تصمیمی گرفته نشده";
                await ctx.editMessageText("📜 *تاریخچه*\n\n" + historyText, {
                    parse_mode: "Markdown",
                    reply_markup: getMainMenu()
                });
                return;
            }
            
            if (data === "menu_next_turn") {
                state.nextTurn();
                await ctx.editMessageText("⏭️ *یک ماه گذشت*\n\n" + state.getStatusSummary(), {
                    parse_mode: "Markdown",
                    reply_markup: state.game_over ? undefined : getMainMenu()
                });
                return;
            }
            
            // ============================================
            // انتخاب کشور
            // ============================================
            
            if (data.startsWith("country_")) {
                const code = data.split("_")[1];
                const country = state.findCountry(code);
                if (country) {
                    await ctx.editMessageText(
                        `${country[1]} *${country[0]}*\n\n📊 روابط: ${country[4]}/100\n💰 تجارت: ${country[5]} میلیارد دلار\n📍 منطقه: ${country[3]}`,
                        { parse_mode: "Markdown", reply_markup: getCountryMenu(code) }
                    );
                }
                return;
            }
            
            // ============================================
            // مذاکره
            // ============================================
            
            if (data.startsWith("negotiate_")) {
                const code = data.split("_")[1];
                const kb = new InlineKeyboard()
                    .text("کارشناسی (۰.۱ همت)", `do_negotiate_${code}_expert_trade`).row()
                    .text("سفیر (۰.۵ همت)", `do_negotiate_${code}_ambassador_trade`).row()
                    .text("وزیر (۲ همت)", `do_negotiate_${code}_minister_trade`).row()
                    .text("رئیس‌جمهور (۵ همت)", `do_negotiate_${code}_president_trade`).row()
                    .text("محرمانه 🤫", `do_secret_${code}`).row()
                    .text("🔙 بازگشت", `country_${code}`);
                
                await ctx.editMessageText("🤝 *سطح مذاکره را انتخاب کن*", {
                    parse_mode: "Markdown",
                    reply_markup: kb
                });
                return;
            }
            
            if (data.startsWith("do_negotiate_")) {
                const parts = data.split("_");
                result = negotiate(state, parts[2], parts[4] || "trade", parts[3]);
                advanceTurn = true;
            }
            
            if (data.startsWith("do_secret_")) {
                result = secretNegotiation(state, data.split("_")[2]);
                advanceTurn = true;
            }
            
            // ============================================
            // حمله
            // ============================================
            
            if (data.startsWith("attack_")) {
                const code = data.split("_")[1];
                const kb = new InlineKeyboard()
                    .text("🚀 حمله موشکی", `do_missile_${code}`).row()
                    .text("🛸 حمله پهپادی", `do_drone_${code}`).row()
                    .text("💻 حمله سایبری", `do_cyber_${code}`).row()
                    .text("⚔️ اعلان جنگ", `do_war_${code}`).row()
                    .text("🔙 بازگشت", `country_${code}`);
                
                await ctx.editMessageText("⚔️ *نوع حمله را انتخاب کن*", {
                    parse_mode: "Markdown",
                    reply_markup: kb
                });
                return;
            }
            
            if (data.startsWith("do_missile_")) {
                result = missileAttack(state, data.split("_")[2]);
                advanceTurn = true;
            }
            
            if (data.startsWith("do_drone_")) {
                result = droneAttack(state, data.split("_")[2]);
                advanceTurn = true;
            }
            
            if (data.startsWith("do_cyber_")) {
                result = cyberAttack(state, data.split("_")[2]);
                advanceTurn = true;
            }
            
            if (data.startsWith("do_war_")) {
                result = declareWar(state, data.split("_")[2]);
                advanceTurn = true;
            }
            
            // ============================================
            // تجارت
            // ============================================
            
            if (data.startsWith("trade_")) {
                const code = data.split("_")[1];
                const country = state.findCountry(code);
                if (!country) return;
                
                const kb = new InlineKeyboard()
                    .text("🛢️ فروش نفت", `do_sell_oil_${code}`).row()
                    .text("📝 پیمان تجاری", `do_trade_pact_${code}`).row()
                    .text("🔙 بازگشت", `country_${code}`);
                
                await ctx.editMessageText(
                    `💰 *تجارت با ${country[1]} ${country[0]}*\n\n📊 حجم: ${country[5]} میلیارد دلار`,
                    { parse_mode: "Markdown", reply_markup: kb }
                );
                return;
            }
            
            if (data.startsWith("do_sell_oil_")) {
                result = sellOil(state, data.split("_")[3], 0.1);
                advanceTurn = true;
            }
            
            if (data.startsWith("do_trade_pact_")) {
                result = tradePact(state, data.split("_")[3]);
                advanceTurn = true;
            }
            
            // ============================================
            // پیمان
            // ============================================
            
            if (data.startsWith("pact_")) {
                const code = data.split("_")[1];
                const kb = new InlineKeyboard()
                    .text("🛡️ پیمان دفاعی", `do_defense_pact_${code}`).row()
                    .text("💰 پیمان تجاری", `do_trade_pact_${code}`).row()
                    .text("🔙 بازگشت", `country_${code}`);
                
                await ctx.editMessageText("📝 *نوع پیمان را انتخاب کن*", {
                    parse_mode: "Markdown",
                    reply_markup: kb
                });
                return;
            }
            
            if (data.startsWith("do_defense_pact_")) {
                result = defensePact(state, data.split("_")[3]);
                advanceTurn = true;
            }
            
            // ============================================
            // تحریم و قطع رابطه
            // ============================================
            
            if (data.startsWith("sanction_")) {
                const code = data.split("_")[1];
                const kb = new InlineKeyboard()
                    .text("🚫 تحریم", `do_sanction_${code}`).row()
                    .text("🚫 قطع رابطه", `do_cut_${code}`).row()
                    .text("👋 اخراج سفیر", `do_expel_${code}`).row()
                    .text("🔙 بازگشت", `country_${code}`);
                
                await ctx.editMessageText("🚫 *اقدام تنبیهی*", {
                    parse_mode: "Markdown",
                    reply_markup: kb
                });
                return;
            }
            
            if (data.startsWith("do_sanction_")) {
                result = sanctionCountry(state, data.split("_")[2]);
                advanceTurn = true;
            }
            
            if (data.startsWith("do_cut_")) {
                result = cutRelations(state, data.split("_")[2]);
                advanceTurn = true;
            }
            
            if (data.startsWith("do_expel_")) {
                result = expelAmbassador(state, data.split("_")[2]);
                advanceTurn = true;
            }
            
            // ============================================
            // کمک
            // ============================================
            
            if (data.startsWith("aid_")) {
                const code = data.split("_")[1];
                const kb = new InlineKeyboard()
                    .text("🍞 غذا", `do_aid_${code}_food`).row()
                    .text("💊 دارو", `do_aid_${code}_medicine`).row()
                    .text("💰 نقدی", `do_aid_${code}_money`).row()
                    .text("🔙 بازگشت", `country_${code}`);
                
                await ctx.editMessageText("🎁 *نوع کمک*", {
                    parse_mode: "Markdown",
                    reply_markup: kb
                });
                return;
            }
            
            if (data.startsWith("do_aid_")) {
                const parts = data.split("_");
                result = sendAid(state, parts[2], parts[3]);
                advanceTurn = true;
            }
            
            // ============================================
            // اطلاعات کشور
            // ============================================
            
            if (data.startsWith("info_")) {
                const code = data.split("_")[1];
                const country = state.findCountry(code);
                if (!country) return;
                
                const relationStatus = country[4] >= 50 ? "✅ متحد" : country[4] >= 20 ? "🟢 دوست" : country[4] >= -20 ? "🟡 بی‌طرف" : country[4] >= -50 ? "🟠 متخاصم" : "🔴 دشمن";
                
                await ctx.editMessageText(
                    `${country[1]} *${country[0]}*\n━━━━━━━━━━\n🌍 منطقه: ${country[3]}\n📈 وضعیت: ${relationStatus}\n📊 روابط: ${country[4]}/100\n💰 تجارت: ${country[5]} میلیارد دلار\n🏛️ سفارت: ${country[4] > -30 ? '✅' : '🚫'}`,
                    { parse_mode: "Markdown", reply_markup: getCountryMenu(code) }
                );
                return;
            }
            
            // ============================================
            // اقتصاد - نفت
            // ============================================
            
            if (data === "economy_oil") {
                const kb = new InlineKeyboard()
                    .text("🛢️ افزایش صادرات", "do_oil_export_up").row()
                    .text("📉 کاهش صادرات", "do_oil_export_down").row()
                    .text("🏭 افزایش تولید", "do_oil_production_up").row()
                    .text("🔙 بازگشت", "menu_economy");
                
                await ctx.editMessageText(
                    `🛢️ *مدیریت نفت*\n\nتولید: ${state.oil_production}\nصادرات: ${state.oil_export}\nقیمت: ${state.oil_price}$`,
                    { parse_mode: "Markdown", reply_markup: kb }
                );
                return;
            }
            
            if (data === "do_oil_export_up") {
                result = increaseOilExport(state);
                advanceTurn = true;
            }
            
            if (data === "do_oil_export_down") {
                result = decreaseOilExport(state);
                advanceTurn = true;
            }
            
            if (data === "do_oil_production_up") {
                result = increaseOilProduction(state);
                advanceTurn = true;
            }
            
            // ============================================
            // اقتصاد - ارز
            // ============================================
            
            if (data === "economy_currency") {
                const kb = new InlineKeyboard()
                    .text("💵 افزایش نرخ", "do_currency_up").row()
                    .text("💵 کاهش نرخ", "do_currency_down").row()
                    .text("🔙 بازگشت", "menu_economy");
                
                await ctx.editMessageText(
                    `💵 *مدیریت ارز*\n\nنرخ: ${state.dollar_rate.toLocaleString()} تومان\nذخایر: ${state.dollar_reserves.toFixed(1)} میلیارد دلار`,
                    { parse_mode: "Markdown", reply_markup: kb }
                );
                return;
            }
            
            if (data === "do_currency_up") {
                result = changeCurrencyRate(state, true);
                advanceTurn = true;
            }
            
            if (data === "do_currency_down") {
                result = changeCurrencyRate(state, false);
                advanceTurn = true;
            }
            
            // ============================================
            // بازار
            // ============================================
            
            if (data.startsWith("buy_")) {
                const itemKey = data.substring(4);
                const domesticItems = ["missile_fath", "missile_kheibar", "drone_shahed136", "drone_shahed191", "drone_factory", "missile_factory"];
                
                if (domesticItems.includes(itemKey)) {
                    result = buyDomestic(state, itemKey);
                } else {
                    result = buyInternational(state, itemKey);
                }
                advanceTurn = true;
            }
            
            // ============================================
            // اقتصاد - سایر
            // ============================================
            
            if (data === "domestic_production") {
                result = supportDomesticProduction(state);
                advanceTurn = true;
            }
            
            if (data === "domestic_imports") {
                const kb = new InlineKeyboard()
                    .text("📦 افزایش", "do_imports_up").row()
                    .text("📦 کاهش", "do_imports_down").row()
                    .text("🔙 بازگشت", "menu_domestic");
                
                await ctx.editMessageText("📦 *مدیریت واردات*", {
                    parse_mode: "Markdown",
                    reply_markup: kb
                });
                return;
            }
            
            if (data === "do_imports_up") {
                result = increaseImports(state);
                advanceTurn = true;
            }
            
            if (data === "do_imports_down") {
                result = decreaseImports(state);
                advanceTurn = true;
            }
            
            if (data === "economy_print") {
                result = printMoney(state);
                advanceTurn = true;
            }
            
            // ============================================
            // هسته‌ای
            // ============================================
            
            if (data === "nuclear_enrich") {
                const kb = new InlineKeyboard()
                    .text("۹۰٪", "do_enrich_90").row()
                    .text("۶۰٪", "do_enrich_60").row()
                    .text("🔙 بازگشت", "military_nuclear");
                
                await ctx.editMessageText(`⬆️ *افزایش غنی‌سازی*\nفعلی: ${state.nuclear_percent}٪`, {
                    parse_mode: "Markdown",
                    reply_markup: kb
                });
                return;
            }
            
            if (data.startsWith("do_enrich_")) {
                result = enrichUranium(state, parseInt(data.split("_")[2]));
                advanceTurn = true;
            }
            
            if (data === "nuclear_decrease") {
                result = decreaseEnrichment(state, 20);
                advanceTurn = true;
            }
            
            if (data === "nuclear_deal") {
                result = nuclearDeal(state);
                advanceTurn = true;
            }
            
            if (data === "nuclear_leave_npt") {
                result = leaveNPT(state);
                advanceTurn = true;
            }
            
            // ============================================
            // نظامی
            // ============================================
            
            if (data === "military_defense") {
                result = strengthenDefense(state);
                advanceTurn = true;
            }
            
            if (data === "military_produce_missile") {
                result = produceMissiles(state);
                advanceTurn = true;
            }
            
            if (data === "military_produce_drone") {
                result = produceDrones(state);
                advanceTurn = true;
            }
            
            if (data === "military_special") {
                result = evadeSanctions(state);
                advanceTurn = true;
            }
            
            // ============================================
            // داخلی
            // ============================================
            
            if (data === "domestic_fatf") {
                result = acceptFATF(state);
                advanceTurn = true;
            }
            
            if (data === "domestic_internet") {
                state.internet_filtered = !state.internet_filtered;
                state.popularity += state.internet_filtered ? -5 : 8;
                result = state.internet_filtered ? "🚫 اینترنت فیلتر شد\n⚠️ محبوبیت -۵٪" : "✅ اینترنت آزاد شد\n✅ محبوبیت +۸٪";
                advanceTurn = true;
            }
            
            if (data === "domestic_gas") {
                const kb = new InlineKeyboard()
                    .text("۵,۰۰۰ تومان", "do_gas_5000").row()
                    .text("۱۰,۰۰۰ تومان", "do_gas_10000").row()
                    .text("۱,۵۰۰ تومان", "do_gas_1500").row()
                    .text("🔙 بازگشت", "menu_domestic");
                
                await ctx.editMessageText(`⛽ *قیمت بنزین*\nفعلی: ${state.gas_price.toLocaleString()} تومان`, {
                    parse_mode: "Markdown",
                    reply_markup: kb
                });
                return;
            }
            
            if (data.startsWith("do_gas_")) {
                result = changeGasPrice(state, parseInt(data.split("_")[2]));
                advanceTurn = true;
            }
            
            if (data === "domestic_protests") {
                const protesting = state.provinces.filter(p => p.has_protest);
                if (protesting.length === 0) {
                    await ctx.editMessageText("✅ اعتراضات فعالی وجود ندارد!", {
                        parse_mode: "Markdown",
                        reply_markup: getDomesticMenu()
                    });
                    return;
                }
                
                let text = "⚠️ *استان‌های معترض:*\n";
                protesting.forEach(p => { text += `• ${p.name}: ${p.satisfaction}٪\n`; });
                
                const kb = new InlineKeyboard()
                    .text("🤝 مذاکره", "do_protest_talk").row()
                    .text("👮 سرکوب", "do_protest_suppress").row()
                    .text("💰 پرداخت خسارت", "do_protest_pay").row()
                    .text("🔙 بازگشت", "menu_domestic");
                
                await ctx.editMessageText(text, {
                    parse_mode: "Markdown",
                    reply_markup: kb
                });
                return;
            }
            
            if (data === "do_protest_talk") {
                state.provinces.forEach(p => { if (p.has_protest) { p.has_protest = false; p.satisfaction += 10; } });
                state.popularity += 5;
                result = "✅ مذاکره موفق\n👥 محبوبیت +۵٪";
                advanceTurn = true;
            }
            
            if (data === "do_protest_suppress") {
                state.provinces.forEach(p => { if (p.has_protest) { p.has_protest = false; p.satisfaction -= 15; } });
                state.popularity -= 8;
                state.sanctions = Math.min(100, state.sanctions + 5);
                result = "⚠️ اعتراضات سرکوب شد\n👥 محبوبیت -۸٪\n🚫 تحریم +۵";
                advanceTurn = true;
            }
            
            if (data === "do_protest_pay") {
                if (state.budget_toman < 10) {
                    await ctx.answerCallbackQuery("❌ بودجه کافی نیست! (نیاز: ۱۰ همت)");
                    return;
                }
                state.budget_toman -= 10;
                state.provinces.forEach(p => { if (p.has_protest) { p.has_protest = false; p.satisfaction += 20; } });
                state.popularity += 3;
                result = "💰 خسارت پرداخت شد (۱۰ همت)\n✅ محبوبیت +۳٪";
                advanceTurn = true;
            }
            
            // ============================================
            // بیت‌کوین
            // ============================================
            
            if (data === "economy_bitcoin") {
                const kb = new InlineKeyboard()
                    .text("⛏️ استخراج", "do_bitcoin_mine").row()
                    .text("💰 فروش", "do_bitcoin_sell").row()
                    .text("🛒 خرید", "do_bitcoin_buy").row()
                    .text("🔙 بازگشت", "menu_economy");
                
                await ctx.editMessageText(
                    `₿ *بیت‌کوین*\n\nموجودی: ${state.bitcoin}\nارزش: ${(state.bitcoin * 60000 / 1_000_000_000).toFixed(2)} میلیارد دلار`,
                    { parse_mode: "Markdown", reply_markup: kb }
                );
                return;
            }
            
            if (data === "do_bitcoin_mine") {
                result = manageBitcoin(state, 'mine');
                advanceTurn = true;
            }
            
            if (data === "do_bitcoin_sell") {
                result = manageBitcoin(state, 'sell');
                advanceTurn = true;
            }
            
            if (data === "do_bitcoin_buy") {
                result = manageBitcoin(state, 'buy');
                advanceTurn = true;
            }
            
            // ============================================
            // طلا
            // ============================================
            
            if (data === "economy_gold") {
                const kb = new InlineKeyboard()
                    .text("🛒 خرید", "do_gold_buy").row()
                    .text("💰 فروش", "do_gold_sell").row()
                    .text("🔙 بازگشت", "menu_economy");
                
                await ctx.editMessageText(
                    `🥇 *طلا*\n\nذخایر: ${state.gold_tons.toFixed(3)} تن\nارزش: ${(state.gold_tons * 1000 * 64000 / 1_000_000_000).toFixed(1)} میلیارد دلار`,
                    { parse_mode: "Markdown", reply_markup: kb }
                );
                return;
            }
            
            if (data === "do_gold_buy") {
                result = manageGold(state, 'buy');
                advanceTurn = true;
            }
            
            if (data === "do_gold_sell") {
                result = manageGold(state, 'sell');
                advanceTurn = true;
            }
            
            // ============================================
            // یارانه و مالیات
            // ============================================
            
            if (data === "economy_subsidies") {
                const kb = new InlineKeyboard()
                    .text("💰 افزایش یارانه", "do_subsidy_up").row()
                    .text("💰 کاهش یارانه", "do_subsidy_down").row()
                    .text("📋 افزایش مالیات", "do_tax_up").row()
                    .text("📋 کاهش مالیات", "do_tax_down").row()
                    .text("🔙 بازگشت", "menu_economy");
                
                await ctx.editMessageText("💰 *یارانه و مالیات*", {
                    parse_mode: "Markdown",
                    reply_markup: kb
                });
                return;
            }
            
            if (data === "do_subsidy_up") {
                result = manageSubsidies(state, true);
                advanceTurn = true;
            }
            
            if (data === "do_subsidy_down") {
                result = manageSubsidies(state, false);
                advanceTurn = true;
            }
            
            if (data === "do_tax_up") {
                result = manageTaxes(state, true);
                advanceTurn = true;
            }
            
            if (data === "do_tax_down") {
                result = manageTaxes(state, false);
                advanceTurn = true;
            }
            
            // ============================================
            // گروه‌های نیابتی
            // ============================================
            
            if (data === "proxies_report") {
                result = getProxiesReport(state);
                await ctx.editMessageText(result, {
                    parse_mode: "Markdown",
                    reply_markup: getProxiesMenu()
                });
                return;
            }
            
            if (data === "proxies_pay") {
                result = payAllProxies(state);
                advanceTurn = true;
            }
            
            if (data === "proxies_create") {
                const kb = new InlineKeyboard()
                    .text("🔫 نظامی", "proxy_create_military").row()
                    .text("💻 سایبری", "proxy_create_cyber").row()
                    .text("💰 اقتصادی", "proxy_create_economic").row()
                    .text("🕵️ جاسوسی", "proxy_create_spy").row()
                    .text("🔙 بازگشت", "menu_proxies");
                
                await ctx.editMessageText("🏴 *نوع گروه نیابتی*", {
                    parse_mode: "Markdown",
                    reply_markup: kb
                });
                return;
            }
            
            if (data.startsWith("proxy_create_")) {
                const proxyType = data.split("_")[2];
                ctx.session.proxyType = proxyType;
                
                const { COUNTRIES } = require('./config');
                const kb = new InlineKeyboard();
                COUNTRIES.slice(0, 8).forEach(c => {
                    kb.text(`${c[1]} ${c[0]}`, `proxy_country_${c[2]}`).row();
                });
                kb.text("🔙 بازگشت", "proxies_create");
                
                await ctx.editMessageText("📍 *کشور هدف*", {
                    parse_mode: "Markdown",
                    reply_markup: kb
                });
                return;
            }
            
            if (data.startsWith("proxy_country_")) {
                const countryCode = data.split("_")[2];
                const proxyType = ctx.session?.proxyType || "military";
                const name = `گروه_${countryCode}_${Date.now().toString(36)}`;
                result = createProxy(state, name, countryCode, proxyType);
                advanceTurn = true;
            }
            
            // ============================================
            // اگر هیچ کدوم نبود
            // ============================================
            
            if (!result && !advanceTurn) {
                await ctx.editMessageText("🔧 این بخش در حال توسعه است...", {
                    reply_markup: getMainMenu()
                });
                return;
            }
            
            // ============================================
            // پایان نوبت و نمایش نتیجه
            // ============================================
            
            if (advanceTurn) {
                state.nextTurn();
            }
            
            if (result) {
                await ctx.editMessageText(
                    result + "\n\n" + state.getStatusSummary(),
                    {
                        parse_mode: "Markdown",
                        reply_markup: state.game_over ? undefined : getMainMenu()
                    }
                );
            }
            
        } catch (error) {
            console.error("❌ خطا در پردازش دکمه:", error);
            await ctx.editMessageText(
                "⚠️ خطایی رخ داد!\n\nلطفاً دوباره تلاش کنید یا /start را بزنید.",
                { reply_markup: getMainMenu() }
            );
        }
    });
}

module.exports = { setupHandlers, getMainMenu };