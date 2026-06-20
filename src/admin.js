// src/admin.js

const { InlineKeyboard } = require("grammy");
const { G } = require("./images");
const { SHOP } = require("./shop");

const ADMIN_ID = 5576592239;

function adminMenu() {
    return new InlineKeyboard()
        .text("💰 +۱۰M", "adm_m10").text("+۵۰M", "adm_m50").text("+۱۰۰M", "adm_m100").row()
        .text("💎 +۱۰۰۰M", "adm_m1000").text("💎 +۵۰۰۰M", "adm_m5000").row()
        .text("⭐ +۱۰", "adm_f10").text("+۳۰", "adm_f30").text("۱۰۰", "adm_f100").row()
        .text("🌟 برکات", "adm_star").text("💪 همه +۲", "adm_boost").text("💪 همه +۵", "adm_boost5").row()
        .text("🇮🇷 همه ملی", "adm_national").text("🤝 همه قرارداد", "adm_contract_all").row()
        .text("🏚️ دفتر +۱", "adm_office").text("🚗 وسیله +۱", "adm_vehicle").text("🏟️ ورزشی +۱", "adm_facility").row()
        .text("👩‍💼 همه کارمند", "adm_all_staff").text("💰 فروش همه", "adm_sell_all").row()
        .text("⏭️ ۱ هفته", "adm_1w").text("۵ هفته", "adm_5w").text("۱۰ هفته", "adm_10w").row()
        .text("⏭️ ۱ فصل", "adm_34w").text("۳ فصل", "adm_100w").row()
        .text("🏆 تورنمنت الان", "adm_tournament").text("📰 روزنامه الان", "adm_news").row()
        .text("🔄 ریست بازی", "adm_reset").text("🔙", "menu_main");
}

async function handleAdmin(ctx, state, data) {
    if (ctx.from.id !== ADMIN_ID) return false;
    
    let r = "";
    let im = G("main");
    
    switch(data) {
        // پول
        case "adm_m10": state.money += 10; r = "💰 +۱۰M"; break;
        case "adm_m50": state.money += 50; r = "💰 +۵۰M"; break;
        case "adm_m100": state.money += 100; r = "💰 +۱۰۰M"; break;
        case "adm_m1000": state.money += 1000; r = "💎 +۱۰۰۰M"; break;
        case "adm_m5000": state.money += 5000; r = "💎 +۵۰۰۰M"; break;
        
        // شهرت
        case "adm_f10": state.fame = Math.min(100, state.fame + 10); r = "⭐ +۱۰"; break;
        case "adm_f30": state.fame = Math.min(100, state.fame + 30); r = "⭐ +۳۰"; break;
        case "adm_f100": state.fame = 100; r = "⭐ ۱۰۰"; break;
        
        // بازیکن ویژه
        case "adm_star":
            state.players.push({
                name: "مهدی برکات", pos: "🥅 دروازه‌بان", talent: 9, ability: 7,
                age: 21, city: "بندرلنگه", value: 9 * 7 * 3, special: true,
                contract: null, history: ["🌟"], goals: 0, assists: 0, cleans: 0, conceded: 0, tackles: 0, games: 0
            });
            r = "🌟 مهدی برکات پیوست!"; im = G("player");
            break;
        
        // ارتقا
        case "adm_boost":
            state.players.forEach(p => { p.ability = Math.min(10, p.ability + 2); p.talent = Math.min(10, p.talent + 1); p.value = p.talent * p.ability * 2; });
            r = "💪 همه +۲"; break;
        case "adm_boost5":
            state.players.forEach(p => { p.ability = Math.min(10, p.ability + 5); p.talent = Math.min(10, p.talent + 2); p.value = p.talent * p.ability * 3; });
            r = "💪 همه +۵"; break;
        
        // ملی
        case "adm_national":
            state.players.forEach(p => { p.national = true; p.value = p.talent * p.ability * 5; });
            r = "🇮🇷 همه ملی‌پوش!"; break;
        
        // قرارداد
        case "adm_contract_all":
            state.players.forEach(p => {
                if (!p.contract) {
                    const mo = Math.floor(p.value / 10);
                    p.contract = { monthly: mo, remaining: 24, club: "باشگاه برتر" };
                    state.money += mo * 3;
                }
            });
            r = "🤝 همه قرارداد بستن!"; break;
        
        // فروش همه
        case "adm_sell_all":
            let total = 0;
            state.players.forEach(p => total += p.value);
            state.money += total;
            state.players = [];
            r = `💰 همه فروخته شد! +${total}M`; break;
        
        // امکانات
        case "adm_office":
            if (state.office.level < 5) {
                const n = SHOP.offices[state.office.level];
                state.office = { level: n.id, name: n.name, capacity: n.capacity, staffCapacity: n.staffCapacity, prestige: n.prestige };
                r = `🏚️ ${n.name}`;
            } else r = "🏆 حداکثر!"; break;
        case "adm_vehicle":
            if (state.vehicle.level < 5) {
                const n = SHOP.vehicles[state.vehicle.level];
                state.vehicle = { level: n.id, name: n.name, cities: n.cities, speed: n.speed };
                r = `🚗 ${n.name}`;
            } else r = "🏆 حداکثر!"; break;
        case "adm_facility":
            if (state.facilities.level < 5) {
                const n = SHOP.facilities[state.facilities.level];
                state.facilities = { level: n.id, name: n.name, bonus: n.bonus, desc: n.desc };
                r = `🏟️ ${n.name}`;
            } else r = "🏆 حداکثر!"; break;
        
        // کارمند
        case "adm_all_staff":
            SHOP.staff.forEach(st => {
                if (!state.staff.find(s => s.id === st.id) && state.staff.length < state.office.staffCapacity) {
                    state.staff.push(st);
                }
            });
            r = "👩‍💼 همه کارمندها استخدام!"; break;
        
        // گذر زمان
        case "adm_1w": for (let i = 0; i < 1; i++) passWeek(state); r = "⏭️ ۱ هفته"; break;
        case "adm_5w": for (let i = 0; i < 5; i++) passWeek(state); r = "⏭️ ۵ هفته"; break;
        case "adm_10w": for (let i = 0; i < 10; i++) passWeek(state); r = "⏭️ ۱۰ هفته"; break;
        case "adm_34w": for (let i = 0; i < 34; i++) passWeek(state); r = "⏭️ ۱ فصل"; break;
        case "adm_100w": for (let i = 0; i < 100; i++) passWeek(state); r = "⏭️ ۳ فصل"; break;
        
        // تورنمنت
        case "adm_tournament":
            state.tournament = { club: "ورزشگاه آزادی", prize: 100, active: true };
            r = "🏆 تورنمنت فعال شد!"; break;
        
        // روزنامه
        case "adm_news":
            r = "📰 روزنامه اومد!"; break;
        
        // ریست
        case "adm_reset":
            state.money = 35; state.fame = 10; state.players = []; state.staff = [];
            state.office = { level: 1, name: "خونه پدری", capacity: 3, staffCapacity: 0, prestige: 1 };
            state.vehicle = { level: 1, name: "پیاده", cities: 1, speed: "خیلی کم" };
            state.facilities = { level: 1, name: "زمین خاکی", bonus: 1, desc: "تمرین معمولی" };
            state.week = 1; state.season = 1;
            r = "🔄 بازی ریست شد!"; break;
    }
    
    await ctx.answerCallbackQuery(`🔓 ${r}`);
    
    try {
        await ctx.editMessageMedia(
            { type: "photo", media: im, caption: `🔓 *پنل مدیریت*\n\n${state.sum()}`, parse_mode: "Markdown" },
            { reply_markup: adminMenu() }
        );
    } catch (e) {
        await ctx.replyWithPhoto(G("main"), {
            caption: `🔓 *پنل مدیریت*\n\n${state.sum()}`,
            parse_mode: "Markdown",
            reply_markup: adminMenu()
        });
    }
    
    return true;
}

function passWeek(s) {
    s.week++; s.players.forEach(p=>{if(p.contract?.remaining>0){s.money+=p.contract.monthly;p.contract.remaining--;if(p.contract.remaining===0)p.contract=null;}}); if(s.week>34){s.week=1;s.season++;}
    if(s.week%5===0){s.tournament={club:"ورزشگاه محلی",prize:Math.floor(Math.random()*30)+10,active:true};}
}

module.exports = { ADMIN_ID, adminMenu, handleAdmin };