// src/handlers.js

const { InlineKeyboard } = require("grammy");
const { State, db, wait } = require("./state");
const { G } = require("./images");

const CITIES = ["بندرعباس", "بندرلنگه", "قشم", "میناب", "جاسک", "خواجه", "رودان", "سیریک", "حاجی‌آباد", "تنب"];
const LEAGUES = [
    { name: "لیگ استان", minStar: 2, maxStar: 4, minAbility: 1, maxAbility: 3 },
    { name: "لیگ استانی", minStar: 3, maxStar: 5, minAbility: 2, maxAbility: 4 },
    { name: "لیگ دسته ۳", minStar: 4, maxStar: 6, minAbility: 3, maxAbility: 5 },
    { name: "لیگ دسته ۲", minStar: 5, maxStar: 7, minAbility: 4, maxAbility: 6 },
    { name: "لیگ دسته ۱", minStar: 6, maxStar: 8, minAbility: 5, maxAbility: 7 },
    { name: "لیگ برتر", minStar: 7, maxStar: 9, minAbility: 6, maxAbility: 8 }
];
const POSITIONS = ["🥅 دروازه‌بان", "🛡️ مدافع", "⚡ هافبک", "🎯 مهاجم"];
const FIRST_NAMES = ["علی", "حسین", "محمد", "رضا", "امیر", "مهدی", "سعید", "فرهاد", "احسان", "امید", "یعقوب", "یونس", "اسماعیل", "صالح", "کریم", "عبدالرحمن", "رمضان", "عباس", "ناصر", "جعفر"];
const LAST_NAMES = ["محمدی", "احمدی", "رضایی", "حسینی", "کریمی", "موسوی", "جعفری", "نوروزی", "عباسی", "قاسمی", "مرادی", "صادقی", "رحیمی", "شریفی", "جمشیدی"];
const CLUBS = ["موج بندر", "صیادان قشم", "نخل میناب", "اتحاد خواجه", "ملوان تنب", "وحدت حاجی‌آباد", "طلوع سیریک", "شاهین جاسک", "دشت رودان", "ساحل بندرلنگه"];
const SPECIAL = { name: "مهدی برکات", pos: "🥅 دروازه‌بان", talent: 9, ability: 7, city: "بندرلنگه" };

function bar(v, e) { return e.repeat(v) + "⬛".repeat(10 - v); }

function mainMenu() { return new InlineKeyboard().text("🔍 جذب", "scout").text("👥 بازیکنا", "players").row().text("📊 آمار", "menu_main").text("⏭️ زمان", "menu_time"); }
function timeMenu() { return new InlineKeyboard().text("⏭️ ۱", "next_1").text("⏭️ ۲", "next_2").text("⏭️ ۳", "next_3").row().text("⏭️ ۴", "next_4").text("⏭️ ۳۴", "next_34").row().text("🔙", "menu_main"); }
function playerMenu(i) { return new InlineKeyboard().text("🏋️ ارتقا", `up_${i}`).text("🤝 قرارداد", `ct_${i}`).text("💰 فروش", `se_${i}`).row().text("🔄 قرض", `loan_${i}`).text("🔙", "players"); }
function upgradeMenu(i) { return new InlineKeyboard().text("⚡۵۰M", `tr_${i}_50`).text("🎯۷۵M", `tr_${i}_75`).row().text("💪۱۵۰M", `tr_${i}_150`).text("📚۳۰۰M", `tr_${i}_300`).row().text("🎯۵۰۰M", `tr_${i}_500`).text("🔙", `pv_${i}`); }

function card(p) {
    let e = p.pos.includes("دروازه") ? "🥅" : p.pos.includes("مدافع") ? "🛡️" : p.pos.includes("هافبک") ? "⚡" : "🎯";
    let s = p.pos.includes("دروازه") ? `🧤 ${p.cleans||0} کلین` : p.pos.includes("مدافع") ? `🛡️ ${p.tackles||0} تکل` : `⚽ ${p.goals||0} گل`;
    let c = `${e} *${p.name}*${p.special?" 🌟":""}\n📊 ${p.pos} | 🗓️ ${p.age} | 📍 ${p.city}\n${s} | 👟 ${p.games||0} بازی\n⭐ ${bar(p.talent,"🟩")} ${p.talent}/10\n💪 ${bar(p.ability,"🟦")} ${p.ability}/10\n💰 ${p.value}M`;
    if (p.history?.length) c += `\n📋 ${p.history.slice(-4).join(" | ")}`;
    return c;
}

function passWeek(s) {
    s.week++;
    s.players.forEach(p => { if (p.contract?.remaining > 0) { s.money += p.contract.monthly; p.contract.remaining--; if (p.contract.remaining === 0) p.contract = null; } });
    if (s.week > 34) { s.week = 1; s.season++; }
    if (Math.random() < 0.15 && s.players.length > 0) { const p = s.players.find(x => !x.contract); if (p) return `📞 ${CLUBS[Math.floor(Math.random()*10)]}: "${p.name} رو ${Math.floor(p.value/100)}M قرض می‌دیم!"`; }
    if (Math.random() < 0.08 && s.players.length > 0) { const p = s.players[Math.floor(Math.random()*s.players.length)]; p.ability = Math.max(1, p.ability-1); p.value = p.talent*p.ability*2; p.history.push(`🚑 مصدومیت (${s.week})`); return `🚑 ${p.name} مصدوم!`; }
    return null;
}

async function start(ctx) {
    const uid = ctx.from.id;
    if (db.has(uid)) return ctx.replyWithPhoto(G("main"), { caption: db.get(uid).sum(), parse_mode: "Markdown", reply_markup: mainMenu() });
    await ctx.replyWithPhoto(G("main"), { caption: "🎮 مسیرت رو انتخاب کن:", parse_mode: "Markdown", reply_markup: new InlineKeyboard().text("👤 ایجنت", "go_agent").text("⚽ باشگاه", "go_club").row() });
}

async function message(ctx) {
    const uid = ctx.from.id;
    if (!wait.has(uid)) return;
    const s = new State(ctx.message.text, wait.get(uid));
    db.set(uid, s); wait.delete(uid);
    await ctx.replyWithPhoto(G("main"), { caption: `🎉 ثبت شد!\n\n${s.sum()}`, parse_mode: "Markdown", reply_markup: mainMenu() });
}

async function callback(ctx) {
    const d = ctx.callbackQuery.data, uid = ctx.from.id;
    await ctx.answerCallbackQuery();
    
    if (d === "go_agent" || d === "go_club") {
        wait.set(uid, d === "go_agent" ? "agent" : "club");
        try {
            await ctx.editMessageText(`✍️ اسم ${d === "go_agent" ? "ایجنت" : "باشگاه"} رو تایپ کن:`);
        } catch(e) {
            await ctx.reply(`✍️ اسم ${d === "go_agent" ? "ایجنت" : "باشگاه"} رو تایپ کن:`);
        }
        return;
    }
    
    const s = db.get(uid);
    if (!s) { await ctx.answerCallbackQuery("❌ /start"); return; }
    let r = "", im = G("main");

    if (d === "menu_main") return ctx.editMessageMedia({ type: "photo", media: G("main"), caption: s.sum(), parse_mode: "Markdown" }, { reply_markup: mainMenu() });
    if (d === "menu_time") return ctx.editMessageMedia({ type: "photo", media: G("main"), caption: `⏭️ هفته ${s.week}`, parse_mode: "Markdown" }, { reply_markup: timeMenu() });

    if (d.startsWith("next_")) {
        const w = parseInt(d.split("_")[1]); let ev = "";
        for (let i=0; i<w; i++) { const e = passWeek(s); if (e && i===w-1) ev = "\n\n"+e; }
        if (s.week%3===0) { ev += "\n\n📰 *خبر هرمزگان*\n"+s.players.map(p=>`⚽ ${p.name}: 💰${p.value}M`).join("\n"); im = G("newspaper"); }
        if (ev.includes("🚑")) im = G("clinic");
        return ctx.editMessageMedia({ type:"photo", media:im, caption:`⏭️ ${w} هفته\n📅 ${s.week}${ev}\n\n${s.sum()}`, parse_mode:"Markdown" }, { reply_markup:mainMenu() });
    }

    if (d === "scout") {
        const kb = new InlineKeyboard(); LEAGUES.forEach((l,i)=>kb.text(l.name,`sl_${i}`).row()); kb.text("🔙","menu_main");
        return ctx.editMessageMedia({ type:"photo", media:G("scout"), caption:`🔍 کدوم لیگ؟\n💰 ۵۰M | ${s.money}M`, parse_mode:"Markdown" }, { reply_markup:kb });
    }

    if (d.startsWith("sl_")) {
        const li = parseInt(d.split("_")[1]); if (s.money<50) { await ctx.answerCallbackQuery("❌"); return; }
        s.money-=50; const L=LEAGUES[li], f=[];
        for (let i=0; i<3; i++) {
            if (li===0 && Math.random()<0.05) f.push({ name:SPECIAL.name, pos:SPECIAL.pos, talent:SPECIAL.talent, ability:SPECIAL.ability, age:21, city:SPECIAL.city, value:SPECIAL.talent*SPECIAL.ability*2, special:true, contract:null, history:["🤝 پیوستن ویژه"], goals:0, assists:0, cleans:0, conceded:0, tackles:0, games:0 });
            else { const nm=FIRST_NAMES[Math.floor(Math.random()*20)]+" "+LAST_NAMES[Math.floor(Math.random()*15)], t=Math.floor(Math.random()*(L.maxStar-L.minStar+1))+L.minStar, a=Math.floor(Math.random()*(L.maxAbility-L.minAbility+1))+L.minAbility; f.push({ name:nm, pos:POSITIONS[Math.floor(Math.random()*4)], talent:t, ability:a, age:Math.floor(Math.random()*10)+16, city:CITIES[Math.floor(Math.random()*10)], value:t*a*2, special:false, contract:null, history:[`🤝 پیوستن (${s.week})`], goals:0, assists:0, cleans:0, conceded:0, tackles:0, games:0 }); }
        }
        s.temp=f; let tx=`🔍 *${L.name}*\n\n`; f.forEach((p,i)=>tx+=`${i+1}. ${p.special?"🌟":""}⚽ ${p.name}\n   ${p.pos} | ${p.age} | ⭐${p.talent} 💪${p.ability} | 💰${p.value}M\n\n`);
        const kb=new InlineKeyboard(); f.forEach((p,i)=>kb.text(`${i+1}`,`pick_${i}`)); kb.row().text("🔍 دوباره",`sl_${li}`).text("🔙","scout");
        return ctx.editMessageMedia({ type:"photo", media:G("scout"), caption:tx, parse_mode:"Markdown" }, { reply_markup:kb });
    }

    if (d.startsWith("pick_")) { const i=parseInt(d.split("_")[1]); if(!s.temp?.[i]){await ctx.answerCallbackQuery("❌");return;} s.players.push(s.temp[i]); s.temp=null; r=`🤝 ${s.players[s.players.length-1].name} پیوست!`; im=G("player"); }
    if (d==="players") { if(!s.players.length) return ctx.editMessageMedia({ type:"photo", media:G("player"), caption:"👥 خالی!", parse_mode:"Markdown" }, { reply_markup:mainMenu() }); const kb=new InlineKeyboard(); s.players.forEach((p,i)=>kb.text(`${p.special?"🌟":""} ${p.name} ⭐${p.talent}`,`pv_${i}`).row()); kb.text("🔙","menu_main"); return ctx.editMessageMedia({ type:"photo", media:G("player"), caption:`👥 (${s.players.length})`, parse_mode:"Markdown" }, { reply_markup:kb }); }
    if (d.startsWith("pv_")) { const i=parseInt(d.split("_")[1]), p=s.players[i]; if(!p){await ctx.answerCallbackQuery("❌");return;} return ctx.editMessageMedia({ type:"photo", media:G("player"), caption:card(p), parse_mode:"Markdown" }, { reply_markup:playerMenu(i) }); }
    if (d.startsWith("up_")) { const i=parseInt(d.split("_")[1]); return ctx.editMessageMedia({ type:"photo", media:G("training"), caption:`🏋️ ${s.players[i].name}`, parse_mode:"Markdown" }, { reply_markup:upgradeMenu(i) }); }

    if (d.startsWith("tr_")) { const p=d.split("_"), i=parseInt(p[1]), c=parseInt(p[2]), pl=s.players[i]; if(s.money<c){await ctx.answerCallbackQuery("❌");return;} s.money-=c; if(c===150){pl.ability=Math.min(10,pl.ability+2);pl.talent=Math.min(10,pl.talent+1);}else if(c===500){pl.ability=Math.min(10,pl.ability+3);}else if(c===300){pl.ability=Math.min(10,pl.ability+2);}else{pl.ability=Math.min(10,pl.ability+1);} pl.value=c===500?pl.talent*pl.ability*6:pl.talent*pl.ability*2; pl.history.push(`🏋️ (${s.week})`); r=`✅ ${pl.name} 💪${pl.ability} 💰${pl.value}M`; im=G("training"); }
    if (d.startsWith("se_")) { const i=parseInt(d.split("_")[1]), p=s.players.splice(i,1)[0]; s.money+=p.value; s.fame+=5; r=`💰 ${p.name} +${p.value}M`; im=G("sell"); }
    if (d.startsWith("ct_")) { const i=parseInt(d.split("_")[1]), p=s.players[i]; if(p.contract){await ctx.answerCallbackQuery("❌");return;} const mo=Math.floor(p.value/100), cl=CLUBS[Math.floor(Math.random()*10)]; p.contract={monthly:mo,remaining:24,club:cl}; s.money+=mo*3; p.history.push(`🤝 ${cl} (${s.week})`); r=`🤝 ${p.name}\n🏠 ${cl}\n💵 ${mo}M/ماه`; im=G("contract"); }
    if (d.startsWith("loan_")) { const i=parseInt(d.split("_")[1]), p=s.players[i]; if(p.contract){await ctx.answerCallbackQuery("❌");return;} const cl=CLUBS[Math.floor(Math.random()*10)], lm=Math.floor(p.value/150); s.money+=lm; p.ability=Math.min(10,p.ability+1); p.value=p.talent*p.ability*2; p.games=(p.games||0)+1; p.history.push(`🔄 ${cl} (${s.week})`); r=`🔄 ${p.name} → ${cl}\n💰 ${lm}M\n💪 +۱`; im=G("player"); }

    if (r) await ctx.editMessageMedia({ type:"photo", media:im, caption:`${r}\n\n${s.sum()}`, parse_mode:"Markdown" }, { reply_markup:mainMenu() });
}

module.exports = { start, message, callback };