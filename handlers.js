// handlers.js - نسخه نهایی بدون خطا

const { InlineKeyboard } = require('grammy');
const { IranState, getPlayer, setPlayer } = require('./state');
const { COUNTRIES } = require('./config');
const { IMAGES, getMenuBackground, getCountryBackground } = require('./images');
const DIALOGUES = require('./dialogues');
const {
    increaseOilExport, decreaseOilExport, increaseOilProduction,
    changeCurrencyRate, supportDomesticProduction, increaseImports,
    decreaseImports, buyDomestic, buyInternational,
    changeGasPrice, manageBitcoin, manageGold, manageSubsidies,
    manageTaxes, printMoney, fightCorruption, manageWaterCrisis, stopBrainDrain
} = require('./economy');
const {
    missileAttack, droneAttack, cyberAttack, declareWar,
    strengthenDefense, produceMissiles, produceDrones,
    enrichUranium, decreaseEnrichment, nuclearDeal,
    leaveNPT, evadeSanctions
} = require('./military');
const {
    negotiate, secretNegotiation, defensePact, tradePact,
    cutRelations, expelAmbassador, sanctionCountry,
    acceptFATF, sendAid
} = require('./diplomacy');
const {
    createProxy, payAllProxies, getProxiesReport, cleanTraces, deleteProxy
} = require('./proxies');

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
    
    const nav = [];
    if (page > 0) nav.push(InlineKeyboard.text("⬅️", `foreign_page_${page - 1}`));
    nav.push(InlineKeyboard.text("🔙", "main_menu"));
    if (end < COUNTRIES.length) nav.push(InlineKeyboard.text("➡️", `foreign_page_${page + 1}`));
    keyboard.row(...nav);
    
    return keyboard;
}

function getCountryMenu(code) {
    return new InlineKeyboard()
        .text("🤝 مذاکره", `negotiate_${code}`).text("💰 تجارت", `trade_${code}`).text("📝 پیمان", `pact_${code}`).row()
        .text("⚔️ حمله", `attack_${code}`).text("🚫 تحریم", `sanction_${code}`).text("🎁 کمک", `aid_${code}`).row()
        .text("📊 اطلاعات", `info_${code}`).text("🔙 کشورها", "menu_foreign");
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
        .text("⛽ بنزین", "economy_gas").text("₿ بیت", "economy_bitcoin").text("🥇 طلا", "economy_gold").row()
        .text("💰 یارانه", "economy_subsidies").text("🏦 چاپ", "economy_print").text("🕵️ فساد", "economy_corruption").row()
        .text("💧 آب", "economy_water").text("🧠 نخبگان", "economy_brain").text("🔙 منو", "main_menu");
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

function getAttackMenu(code) {
    return new InlineKeyboard()
        .text("🚀 موشک", `do_missile_${code}`).text("🛸 پهپاد", `do_drone_${code}`).text("💻 سایبر", `do_cyber_${code}`).row()
        .text("⚔️ جنگ", `do_war_${code}`).text("🔙 بازگشت", `country_${code}`);
}

// ============================================
// 🎭 نمایش مرحله دیالوگ
// ============================================
async function showDialogueStep(ctx, dialogue, stepIndex, state) {
    const step = dialogue.steps[stepIndex];
    if (!step) return;
    
    const imageId = getCountryBackground(dialogue.countryCode || "IR");
    
    let thoughtText = step.thought_step ? `\n🧠 *تو ذهنت:* _${step.thought_step}_\n` : "";
    
    let fullText = `🎭 *${dialogue.title}*\n`;
    fullText += `📅 ${state.year}/${state.month}\n`;
    fullText += `━━━━━━━━━━━━━━━━\n`;
    fullText += `${step.text}\n\n`;
    fullText += `🗣️ ${step.npc}\n`;
    fullText += thoughtText;
    fullText += `\nگزینه‌ها:`;
    
    const keyboard = new InlineKeyboard();
    step.options.forEach((opt, i) => {
        keyboard.text(opt.text, `dialogue_${stepIndex}_${i}`).row();
    });
    
    try {
        await ctx.editMessageMedia(
            { type: "photo", media: imageId, caption: fullText, parse_mode: "Markdown" },
            { reply_markup: keyboard }
        );
    } catch(e) {
        await ctx.replyWithPhoto(imageId, {
            caption: fullText,
            parse_mode: "Markdown",
            reply_markup: keyboard
        });
    }
}

// ============================================
// 🎮 راه‌اندازی هندلرها
// ============================================

function setupHandlers(bot) {
    
    const sessions = new Map();
    
    bot.use(async (ctx, next) => {
        const userId = ctx.from?.id;
        if (userId && !sessions.has(userId)) sessions.set(userId, {});
        ctx.session = sessions.get(userId) || {};
        await next();
    });
    
    // /start
    bot.command("start", async (ctx) => {
        const userId = ctx.from.id;
        const userName = ctx.from.first_name;
        const state = new IranState(userName);
        setPlayer(userId, state);
        
        await ctx.replyWithPhoto(IMAGES.main, {
            caption: `🏛️ *${userName}* عزیز، شما رئیس‌جمهور ایران هستید!\n\n📅 ${state.year}/${state.month}\n💰 بودجه: ${state.budget_toman.toFixed(0)} همت\n👥 محبوبیت: ${state.popularity}٪\n💵 دلار: ${state.dollar_rate.toLocaleString()} تومان\n\n*سرنوشت ۸۵ میلیون نفر در دستان شماست...*`,
            parse_mode: "Markdown",
            reply_markup: getMainMenu()
        });
    });
    
    // /status
    bot.command("status", async (ctx) => {
        const state = getPlayer(ctx.from.id);
        if (!state) return ctx.reply("❌ /start را بزن!");
        
        await ctx.replyWithPhoto(IMAGES.main, {
            caption: state.getStatusSummary(),
            parse_mode: "Markdown",
            reply_markup: getMainMenu()
        });
    });
    
    // /edwin
    bot.command(["edwin", "ادوین"], async (ctx) => {
        if (ctx.from.id !== ADMIN_ID) return ctx.reply("🚫 وجود ندارد!");
        
        const state = getPlayer(ctx.from.id);
        if (!state) return ctx.reply("اول /start");
        
        const adminMenu = new InlineKeyboard()
            .text("💰 +۱۰۰", "admin_budget_100").text("+۵۰۰", "admin_budget_500").text("+۱۰۰۰", "admin_budget_1000").row()
            .text("💵 +۱۰B", "admin_dollar_10").text("+۵۰B", "admin_dollar_50").text("+۱۰۰B", "admin_dollar_100").row()
            .text("🚀 +۱۰۰", "admin_missile_100").text("+۵۰۰", "admin_missile_500").text("+۱۰۰۰", "admin_missile_1000").row()
            .text("👥 +۲۰٪", "admin_pop_20").text("+۵۰٪", "admin_pop_50").text("۱۰۰٪", "admin_pop_100").row()
            .text("🏴 تقویت", "admin_boost_proxies").text("🌍 روابط", "admin_relations_20").text("⏭️ ۵ نوبت", "admin_skip_5").row()
            .text("💀 ضد باخت", "admin_no_gameover").text("🔙", "main_menu");
        
        await ctx.replyWithPhoto(IMAGES.main, {
            caption: `🔓 *پنل ادوین*\n\n💰 ${state.budget_toman.toFixed(0)} همت\n💵 ${state.dollar_reserves.toFixed(1)}B$\n👥 ${state.popularity}٪`,
            parse_mode: "Markdown",
            reply_markup: adminMenu
        });
    });
    
    // دکمه‌ها
    bot.on("callback_query:data", async (ctx) => {
        const userId = ctx.from.id;
        const state = getPlayer(userId);
        const data = ctx.callbackQuery.data;
        
        if (!state) {
            await ctx.answerCallbackQuery("ابتدا /start را بزنید!");
            return;
        }
        
        await ctx.answerCallbackQuery();
        
        let result = "";
        let advanceTurn = false;
        let mainImage = IMAGES.main;
        
        try {
            
            // ============ منوهای اصلی ============
            
            if (data === "main_menu") {
                return ctx.editMessageMedia(
                    { type: "photo", media: IMAGES.main, caption: "🏛️ *منوی اصلی*", parse_mode: "Markdown" },
                    { reply_markup: getMainMenu() }
                );
            }
            
            if (data === "menu_foreign" || data.startsWith("foreign_page_")) {
                let page = data.startsWith("foreign_page_") ? parseInt(data.split("_")[2]) : 0;
                return ctx.editMessageMedia(
                    { type: "photo", media: IMAGES.diplomacy, caption: "🌍 *کشورها*", parse_mode: "Markdown" },
                    { reply_markup: getForeignMenu(page) }
                );
            }
            
            if (data === "menu_military") {
                return ctx.editMessageMedia(
                    { type: "photo", media: IMAGES.military, caption: `⚔️ *نظامی*\n🚀 ${state.missiles} | 🛸 ${state.drones} | 👥 ${state.soldiers}`, parse_mode: "Markdown" },
                    { reply_markup: getMilitaryMenu() }
                );
            }
            
            if (data === "military_nuclear") {
                return ctx.editMessageMedia(
                    { type: "photo", media: IMAGES.nuclear, caption: `⚛️ *هسته‌ای*\n${state.nuclear_percent}٪ | توافق: ${state.nuclear_deal_active ? '✅' : '❌'}`, parse_mode: "Markdown" },
                    { reply_markup: getNuclearMenu() }
                );
            }
            
            if (data === "menu_economy") {
                return ctx.editMessageMedia(
                    { type: "photo", media: IMAGES.economy, caption: `💰 *اقتصاد*\nبودجه: ${state.budget_toman.toFixed(0)} | تورم: ${state.inflation.toFixed(1)}٪`, parse_mode: "Markdown" },
                    { reply_markup: getEconomyMenu() }
                );
            }
            
            if (data === "menu_proxies") {
                return ctx.editMessageMedia(
                    { type: "photo", media: IMAGES.proxy, caption: `🏴 *نیابتی‌ها*\n${state.proxies.length} گروه`, parse_mode: "Markdown" },
                    { reply_markup: getProxiesMenu() }
                );
            }
            
            if (data === "menu_domestic") {
                return ctx.editMessageMedia(
                    { type: "photo", media: IMAGES.main, caption: `🏛️ *کشور*\n👥 ${state.popularity}٪ | 💧 ${state.water_crisis}٪`, parse_mode: "Markdown" },
                    { reply_markup: getDomesticMenu() }
                );
            }
            
            if (data === "menu_status") {
                return ctx.editMessageMedia(
                    { type: "photo", media: IMAGES.main, caption: state.getStatusSummary(), parse_mode: "Markdown" },
                    { reply_markup: getMainMenu() }
                );
            }
            
            if (data === "menu_history") {
                const h = state.history.slice(-15).join("\n") || "خالی";
                return ctx.editMessageMedia(
                    { type: "photo", media: IMAGES.main, caption: "📜 *تاریخچه*\n" + h, parse_mode: "Markdown" },
                    { reply_markup: getMainMenu() }
                );
            }
            
            if (data === "menu_next_turn") {
                state.nextTurn();
                return ctx.editMessageMedia(
                    { type: "photo", media: state.game_over ? IMAGES.defeat : IMAGES.main,
                      caption: "⏭️ *ماه بعد*\n\n" + state.getStatusSummary(), parse_mode: "Markdown" },
                    { reply_markup: state.game_over ? undefined : getMainMenu() }
                );
            }
            
            // ============ کشورها ============
            
            if (data.startsWith("country_")) {
                const code = data.split("_")[1];
                const c = state.findCountry(code);
                if (c) {
                    return ctx.editMessageMedia(
                        { type: "photo", media: getCountryBackground(code),
                          caption: `${c[1]} *${c[0]}*\n📊 ${c[4]}/100 | 💰 ${c[5]}B$`, parse_mode: "Markdown" },
                        { reply_markup: getCountryMenu(code) }
                    );
                }
            }
            
            // ============ دیالوگ ============
            
            if (data.startsWith("negotiate_") && !data.startsWith("do_negotiate_")) {
                const code = data.split("_")[1];
                const c = state.findCountry(code);
                if (!c) return;
                
                // پیدا کردن دیالوگ مناسب
                let dialogueKey = null;
                for (const key of Object.keys(DIALOGUES)) {
                    const d = DIALOGUES[key];
                    if (d.emoji === c[1] && d.country === c[0]) {
                        dialogueKey = key;
                        break;
                    }
                }
                
                if (dialogueKey) {
                    ctx.session.dialogueKey = dialogueKey;
                    ctx.session.dialogueStep = 0;
                    const dialogue = DIALOGUES[dialogueKey];
                    dialogue.countryCode = code;
                    return showDialogueStep(ctx, dialogue, 0, state);
                }
            }
            
            if (data.startsWith("dialogue_")) {
                const parts = data.split("_");
                const stepIndex = parseInt(parts[1]);
                const optionIndex = parseInt(parts[2]);
                const dialogueKey = ctx.session.dialogueKey;
                
                if (!dialogueKey || !DIALOGUES[dialogueKey]) return;
                
                const dialogue = DIALOGUES[dialogueKey];
                const step = dialogue.steps[stepIndex];
                if (!step) return;
                
                const option = step.options[optionIndex];
                if (!option) return;
                
                // گزینه جنگ
                if (option.next === "war") {
                    result = declareWar(state, option.war);
                    advanceTurn = true;
                    ctx.session.dialogueKey = null;
                }
                // نتیجه نهایی
                else if (option.result) {
                    result = option.result === 'success' ? `🎉 *موفقیت!*\n${option.reward || ''}` :
                             option.result === 'partial' ? `⚖️ *نتیجه نسبی*\n${option.reward || ''}` :
                             `💔 *شکست*\n${option.penalty || ''}`;
                    if (option.secret) result += `\n🔒 ${option.secret}`;
                    advanceTurn = true;
                    ctx.session.dialogueKey = null;
                }
                // ادامه دیالوگ
                else if (typeof option.next === 'number') {
                    ctx.session.dialogueStep = option.next;
                    return showDialogueStep(ctx, dialogue, option.next, state);
                }
            }
            
            // ============ حمله ============
            
            if (data.startsWith("attack_")) {
                return ctx.editMessageMedia(
                    { type: "photo", media: IMAGES.military, caption: "⚔️ *نوع حمله*", parse_mode: "Markdown" },
                    { reply_markup: getAttackMenu(data.split("_")[1]) }
                );
            }
            
            if (data.startsWith("do_missile_")) { result = missileAttack(state, data.split("_")[2]); advanceTurn = true; }
            if (data.startsWith("do_drone_")) { result = droneAttack(state, data.split("_")[2]); advanceTurn = true; }
            if (data.startsWith("do_cyber_")) { result = cyberAttack(state, data.split("_")[2]); advanceTurn = true; }
            if (data.startsWith("do_war_")) { result = declareWar(state, data.split("_")[2]); advanceTurn = true; }
            
            // ============ اقتصاد ============
            
            if (data === "do_oil_export_up") { result = increaseOilExport(state); advanceTurn = true; }
            if (data === "do_oil_export_down") { result = decreaseOilExport(state); advanceTurn = true; }
            if (data === "do_oil_production_up") { result = increaseOilProduction(state); advanceTurn = true; }
            if (data === "do_currency_up") { result = changeCurrencyRate(state, true); advanceTurn = true; }
            if (data === "do_currency_down") { result = changeCurrencyRate(state, false); advanceTurn = true; }
            if (data === "domestic_production") { result = supportDomesticProduction(state); advanceTurn = true; }
            if (data === "economy_print") { result = printMoney(state); advanceTurn = true; }
            if (data === "economy_corruption") { result = fightCorruption(state); advanceTurn = true; }
            if (data === "economy_water") { result = manageWaterCrisis(state); advanceTurn = true; }
            if (data === "economy_brain") { result = stopBrainDrain(state); advanceTurn = true; }
            if (data === "domestic_fatf") { result = acceptFATF(state); advanceTurn = true; }
            
            if (data.startsWith("do_gas_")) { result = changeGasPrice(state, parseInt(data.split("_")[2])); advanceTurn = true; }
            if (data === "do_bitcoin_mine") { result = manageBitcoin(state, 'mine'); advanceTurn = true; }
            if (data === "do_bitcoin_sell") { result = manageBitcoin(state, 'sell'); advanceTurn = true; }
            if (data === "do_bitcoin_buy") { result = manageBitcoin(state, 'buy'); advanceTurn = true; }
            if (data === "do_gold_buy") { result = manageGold(state, 'buy'); advanceTurn = true; }
            if (data === "do_gold_sell") { result = manageGold(state, 'sell'); advanceTurn = true; }
            if (data === "do_subsidy_up") { result = manageSubsidies(state, true); advanceTurn = true; }
            if (data === "do_subsidy_down") { result = manageSubsidies(state, false); advanceTurn = true; }
            if (data === "do_tax_up") { result = manageTaxes(state, true); advanceTurn = true; }
            if (data === "do_tax_down") { result = manageTaxes(state, false); advanceTurn = true; }
            
            if (data.startsWith("buy_")) {
                const key = data.substring(4);
                const domestic = ["missile_fath", "missile_kheibar", "drone_shahed136", "drone_shahed191", "drone_factory", "missile_factory"];
                result = domestic.includes(key) ? buyDomestic(state, key) : buyInternational(state, key);
                advanceTurn = true;
            }
            
            // ============ هسته‌ای ============
            
            if (data.startsWith("do_enrich_")) { result = enrichUranium(state, parseInt(data.split("_")[2])); advanceTurn = true; }
            if (data === "nuclear_decrease") { result = decreaseEnrichment(state, 20); advanceTurn = true; }
            if (data === "nuclear_deal") { result = nuclearDeal(state); advanceTurn = true; }
            if (data === "nuclear_leave_npt") { result = leaveNPT(state); advanceTurn = true; }
            
            // ============ نظامی ============
            
            if (data === "military_defense") { result = strengthenDefense(state); advanceTurn = true; }
            if (data === "military_produce") { result = produceMissiles(state) + "\n" + produceDrones(state); advanceTurn = true; }
            if (data === "military_special") { result = evadeSanctions(state); advanceTurn = true; }
            
            // ============ داخلی ============
            
            if (data === "domestic_internet") {
                state.internet_filtered = !state.internet_filtered;
                state.popularity += state.internet_filtered ? -5 : 8;
                result = state.internet_filtered ? "🚫 فیلتر" : "✅ آزاد";
                advanceTurn = true;
            }
            
            if (data === "domestic_protests") {
                const p = state.provinces.filter(x => x.has_protest);
                if (p.length === 0) return ctx.editMessageCaption({ caption: "✅ نیست", reply_markup: getDomesticMenu() });
                let t = "⚠️:\n";
                p.forEach(x => t += `• ${x.name}: ${x.satisfaction}٪\n`);
                return ctx.editMessageCaption({
                    caption: t, parse_mode: "Markdown",
                    reply_markup: new InlineKeyboard()
                        .text("🤝", "do_protest_talk").text("👮", "do_protest_suppress").text("💰", "do_protest_pay").row()
                        .text("🔙", "menu_domestic")
                });
            }
            
            if (data === "do_protest_talk") {
                state.provinces.forEach(x => { if (x.has_protest) { x.has_protest = false; x.satisfaction += 10; } });
                state.popularity += 5;
                result = "🤝 مذاکره موفق";
                advanceTurn = true;
            }
            
            if (data === "do_protest_suppress") {
                state.provinces.forEach(x => { if (x.has_protest) { x.has_protest = false; x.satisfaction -= 15; } });
                state.popularity -= 8;
                state.sanctions = Math.min(100, state.sanctions + 5);
                result = "👮 سرکوب";
                advanceTurn = true;
            }
            
            if (data === "do_protest_pay") {
                if (state.budget_toman < 10) return ctx.answerCallbackQuery("❌ بودجه کم!");
                state.budget_toman -= 10;
                state.provinces.forEach(x => { if (x.has_protest) { x.has_protest = false; x.satisfaction += 20; } });
                state.popularity += 3;
                result = "💰 پرداخت";
                advanceTurn = true;
            }
            
            // ============ نیابتی ============
            
            if (data === "proxies_report") {
                result = getProxiesReport(state);
                return ctx.editMessageMedia(
                    { type: "photo", media: IMAGES.proxy, caption: result, parse_mode: "Markdown" },
                    { reply_markup: getProxiesMenu() }
                );
            }
            
            if (data === "proxies_pay") { result = payAllProxies(state); advanceTurn = true; }
            
            if (data === "proxies_create") {
                return ctx.editMessageCaption({
                    caption: "🏴 *نوع*", parse_mode: "Markdown",
                    reply_markup: new InlineKeyboard()
                        .text("🔫", "proxy_create_military").text("💻", "proxy_create_cyber").text("💰", "proxy_create_economic").row()
                        .text("🕵️", "proxy_create_spy").text("📢", "proxy_create_media").text("🔙", "menu_proxies")
                });
            }
            
            if (data.startsWith("proxy_create_")) {
                ctx.session.proxyType = data.split("_")[2];
                const kb = new InlineKeyboard();
                COUNTRIES.slice(0, 9).forEach((c, i) => {
                    if (i % 3 === 0) kb.row();
                    kb.text(`${c[1]} ${c[0]}`, `proxy_country_${c[2]}`);
                });
                kb.row().text("🔙", "proxies_create");
                return ctx.editMessageCaption({ caption: "📍 *کشور*", parse_mode: "Markdown", reply_markup: kb });
            }
            
            if (data.startsWith("proxy_country_")) {
                const code = data.split("_")[2];
                const type = ctx.session?.proxyType || "military";
                result = createProxy(state, `گروه_${code}`, code, type);
                advanceTurn = true;
            }
            
            if (data === "proxies_clean") {
                const idx = state.proxies.findIndex(p => p.exposed);
                result = idx >= 0 ? cleanTraces(state, idx) : "✅ نیست";
                advanceTurn = true;
            }
            
            if (data === "proxies_delete") {
                result = state.proxies.length > 0 ? deleteProxy(state, 0) : "❌ نیست";
                advanceTurn = true;
            }
            
            // ============ ادمین ============
            
            if (data.startsWith("admin_")) {
                if (userId !== ADMIN_ID) return;
                
                switch(data) {
                    case "admin_budget_100": state.budget_toman += 100; result = "💰 +۱۰۰"; break;
                    case "admin_budget_500": state.budget_toman += 500; result = "💰 +۵۰۰"; break;
                    case "admin_budget_1000": state.budget_toman += 1000; result = "💰 +۱۰۰۰"; break;
                    case "admin_dollar_10": state.dollar_reserves += 10; result = "💵 +۱۰B"; break;
                    case "admin_dollar_50": state.dollar_reserves += 50; result = "💵 +۵۰B"; break;
                    case "admin_dollar_100": state.dollar_reserves += 100; result = "💵 +۱۰۰B"; break;
                    case "admin_missile_100": state.missiles += 100; result = "🚀 +۱۰۰"; break;
                    case "admin_missile_500": state.missiles += 500; result = "🚀 +۵۰۰"; break;
                    case "admin_missile_1000": state.missiles += 1000; result = "🚀 +۱۰۰۰"; break;
                    case "admin_pop_20": state.popularity = Math.min(100, state.popularity + 20); result = "👥 +۲۰"; break;
                    case "admin_pop_50": state.popularity = Math.min(100, state.popularity + 50); result = "👥 +۵۰"; break;
                    case "admin_pop_100": state.popularity = 100; result = "👥 ۱۰۰"; break;
                    case "admin_boost_proxies": state.proxies.forEach(p => { p.forces += 10000; p.missiles += 500; p.drones += 200; }); result = "🏴 تقویت"; break;
                    case "admin_relations_20": state.countries.forEach(c => c[4] = Math.min(100, c[4] + 20)); result = "🌍 +۲۰"; break;
                    case "admin_skip_5": for(let i=0; i<5; i++) state.nextTurn(); result = "⏭️ ۵ نوبت"; break;
                    case "admin_no_gameover": state.game_over = false; state.popularity = Math.max(20, state.popularity); result = "💀 غیرفعال"; break;
                }
            }
            
            // ============ پایان ============
            
            if (advanceTurn) state.nextTurn();
            
            if (result) {
                const finalText = result + "\n\n" + state.getStatusSummary();
                await ctx.editMessageMedia(
                    { type: "photo", media: state.game_over ? IMAGES.defeat : IMAGES.main,
                      caption: finalText, parse_mode: "Markdown" },
                    { reply_markup: state.game_over ? undefined : getMainMenu() }
                );
            }
            
        } catch (error) {
            console.error("❌", error.message);
            try {
                await ctx.editMessageCaption({ caption: "⚠️ خطا! /start بزن", reply_markup: getMainMenu() });
            } catch(e) {}
        }
    });
}

module.exports = { setupHandlers, getMainMenu };