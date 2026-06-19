// src/handlers.js - کامل با پنل شیشه‌ای تورنمنت و اتفاقات هفتگی

const { InlineKeyboard } = require("grammy");
const { State, db, wait } = require("./state");
const { G } = require("./images");
const { SHOP } = require("./shop");

const ADMIN_ID = 5576592239;
const LEAGUES = [
    { name: "لیگ استان", minStar: 2, maxStar: 4, minAbility: 1, maxAbility: 3, cost: 5, minBudget: 20 },
    { name: "لیگ استانی", minStar: 3, maxStar: 5, minAbility: 2, maxAbility: 4, cost: 15, minBudget: 80 },
    { name: "لیگ دسته ۳", minStar: 4, maxStar: 6, minAbility: 3, maxAbility: 5, cost: 30, minBudget: 200 },
    { name: "لیگ دسته ۲", minStar: 5, maxStar: 7, minAbility: 4, maxAbility: 6, cost: 60, minBudget: 500 },
    { name: "لیگ دسته ۱", minStar: 6, maxStar: 8, minAbility: 5, maxAbility: 7, cost: 150, minBudget: 1500 },
    { name: "لیگ برتر", minStar: 7, maxStar: 9, minAbility: 6, maxAbility: 8, cost: 300, minBudget: 5000 }
];
const POSITIONS = ["🥅 دروازه‌بان", "🛡️ مدافع", "⚡ هافبک", "🎯 مهاجم"];
const FIRST_NAMES = ["علی", "حسین", "محمد", "رضا", "امیر", "مهدی", "سعید", "فرهاد", "احسان", "امید"];
const LAST_NAMES = ["محمدی", "احمدی", "رضایی", "حسینی", "کریمی", "موسوی", "جعفری", "نوروزی", "عباسی", "قاسمی"];
const CLUBS = ["موج بندر", "صیادان قشم", "نخل میناب", "اتحاد خواجه", "ملوان تنب", "وحدت حاجی‌آباد", "طلوع سیریک", "شاهین جاسک", "دشت رودان", "ساحل بندرلنگه"];
const SPECIAL = { name: "مهدی برکات", pos: "🥅 دروازه‌بان", talent: 9, ability: 7, city: "بندرلنگه" };

function bar(v, e) { return e.repeat(v) + "⬛".repeat(10 - v); }
function box(t, c) { return `╭────────────────────╮\n│ ${t}\n╰────────────────────╯\n${c}`; }

function mainMenu(s) {
    const kb = new InlineKeyboard()
        .text("🔍 جذب", "scout").text("👥 بازیکنا", "players").row()
        .text("🛒 فروشگاه", "shop_menu").text("⏭️ زمان", "menu_time").row();
    if (s?.tournament?.active) kb.text("🏆 تورنمنت", "tournament_menu").row();
    kb.text("📊 آمار", "menu_main");
    return kb;
}
function timeMenu() { return new InlineKeyboard().text("⏭️ ۱", "next_1").text("⏭️ ۲", "next_2").text("⏭️ ۳", "next_3").row().text("⏭️ ۴", "next_4").text("⏭️ ۳۴", "next_34").row().text("🔙", "menu_main"); }
function playerMenu(i) { return new InlineKeyboard().text("🏋️ ارتقا", `up_${i}`).text("🤝 قرارداد", `ct_${i}`).text("💰 فروش", `se_${i}`).row().text("🔄 قرض", `loan_${i}`).text("🏆 تورنمنت", `tournament_send_${i}`).row().text("🔙", "players"); }
function upgradeMenu(i) { return new InlineKeyboard().text("⚡۵M", `tr_${i}_5`).text("🎯۸M", `tr_${i}_8`).row().text("💪۱۵M", `tr_${i}_15`).text("📚۳۰M", `tr_${i}_30`).row().text("🎯۵۰M", `tr_${i}_50`).text("🔙", `pv_${i}`); }
function shopMenu() { return new InlineKeyboard().text("🏚️ دفتر", "shop_office").text("🚗 وسیله", "shop_vehicle").row().text("🏟️ ورزشی", "shop_facility").text("👩‍💼 کارمند", "shop_staff").row().text("🔙", "menu_main"); }
function adminMenu() { return new InlineKeyboard().text("💰 +۱۰M", "adm_m10").text("+۵۰M", "adm_m50").text("+۱۰۰M", "adm_m100").row().text("⭐ +۱۰", "adm_f10").text("+۳۰", "adm_f30").text("۱۰۰", "adm_f100").row().text("🌟 برکات", "adm_star").text("💪 همه +۲", "adm_boost").row().text("🏚️ دفتر +۱", "adm_office").text("🚗 وسیله +۱", "adm_vehicle").text("🏟️ ورزشی +۱", "adm_facility").row().text("⏭️ ۵ هفته", "adm_5w").text("⏭️ ۱ فصل", "adm_34w").row().text("🔙", "menu_main"); }

function card(p) {
    let e = p.pos.includes("دروازه") ? "🥅" : p.pos.includes("مدافع") ? "🛡️" : p.pos.includes("هافبک") ? "⚡" : "🎯";
    let s = p.pos.includes("دروازه") ? `🧤 ${p.cleans||0} کلین` : p.pos.includes("مدافع") ? `🛡️ ${p.tackles||0} تکل` : `⚽ ${p.goals||0} گل`;
    let c = `╭────────────────────╮\n│ ${e} ${p.name}${p.special?" 🌟":""}\n╰────────────────────╯\n`;
    c += `📊 ${p.pos} | 🗓️ ${p.age} | 📍 ${p.city}\n${s} | 👟 ${p.games||0} بازی\n⭐ ${bar(p.talent,"🟩")} ${p.talent}/10\n💪 ${bar(p.ability,"🟦")} ${p.ability}/10\n💰 ${p.value}M`;
    if (p.history?.length) c += `\n📋 ${p.history.slice(-4).join(" | ")}`;
    return c;
}

function passWeek(s) {
    s.week++; s.players.forEach(p=>{if(p.contract?.remaining>0){s.money+=p.contract.monthly;p.contract.remaining--;if(p.contract.remaining===0)p.contract=null;}}); if(s.week>34){s.week=1;s.season++;}
    let n="";
    
    // تورنمنت هر ۵ هفته
    if(s.week%5===0){
        const pz=Math.floor(Math.random()*30)+10;
        const club=CLUBS[Math.floor(Math.random()*10)];
        s.tournament={club,prize:pz,active:true};
        n+=`╭────────────────────╮\n│ 🏆 *تورنمنت هفتگی* │\n╰────────────────────╯\n`;
        n+=`🏟️ ${club}\n💰 جایزه: ${pz}M\n👥 ۸ تیم\n\n`;
        n+=`✅ بازیکن آزاد بفرست!\n`;
    }
    
    // عادل هر ۴ هفته
    if(s.week%4===0) n+=`🎙️ عادل: "بازیکنات خوبن!"\n\n`;
    // روزنامه هر ۶ هفته
    if(s.week%6===0) n+=`📰 خبر ورزشی\n`+s.players.map(p=>`⚽ ${p.name}: 💰${p.value}M`).join("\n")+`\n\n`;
    // پیشنهاد قرض
    if(Math.random()<0.15&&s.players.length>0){const p=s.players.find(x=>!x.contract);if(p)n+=`📞 ${CLUBS[Math.floor(Math.random()*10)]}: ${p.name} ${Math.floor(p.value/20)}M\n\n`;}
    // مصدومیت
    if(Math.random()<0.08&&s.players.length>0){const p=s.players[Math.floor(Math.random()*s.players.length)];p.ability=Math.max(1,p.ability-1);p.value=p.talent*p.ability*2;n+=`🚑 ${p.name} مصدوم!\n\n`;}
    
    // پاک کردن تورنمنت قدیمی
    if(s.week%5!==0) s.tournament={active:false};
    
    return n||null;
}

async function start(ctx) {
    const uid=ctx.from.id;
    if(db.has(uid)) return ctx.replyWithPhoto(G("main"),{caption:db.get(uid).sum(),parse_mode:"Markdown",reply_markup:mainMenu(db.get(uid))});
    await ctx.replyWithPhoto(G("main"),{caption:"🎮 مسیرت رو انتخاب کن:",parse_mode:"Markdown",reply_markup:new InlineKeyboard().text("👤 ایجنت","go_agent").text("⚽ باشگاه","go_club").row()});
}
async function message(ctx) {
    const uid=ctx.from.id; if(!wait.has(uid)) return; const s=new State(ctx.message.text,wait.get(uid)); db.set(uid,s);wait.delete(uid);
    await ctx.replyWithPhoto(G("main"),{caption:`🎉 ثبت شد!\n\n${s.sum()}`,parse_mode:"Markdown",reply_markup:mainMenu(s)});
}

async function callback(ctx) {
    const d=ctx.callbackQuery.data,uid=ctx.from.id; await ctx.answerCallbackQuery();
    if(d==="go_agent"||d==="go_club"){wait.set(uid,d==="go_agent"?"agent":"club");try{await ctx.editMessageText(`✍️ اسم ${d==="go_agent"?"ایجنت":"باشگاه"} رو تایپ کن:`);}catch(e){await ctx.reply(`✍️ اسم ${d==="go_agent"?"ایجنت":"باشگاه"} رو تایپ کن:`);}return;}
    const s=db.get(uid); if(!s){await ctx.answerCallbackQuery("❌ /start");return;} let r="",im=G("main");

    // ادمین
    if(d.startsWith("adm_")){if(ctx.from.id!==ADMIN_ID)return;switch(d){case"adm_m10":s.money+=10;r="💰 +۱۰M";break;case"adm_m50":s.money+=50;r="💰 +۵۰M";break;case"adm_m100":s.money+=100;r="💰 +۱۰۰M";break;case"adm_f10":s.fame=Math.min(100,s.fame+10);r="⭐ +۱۰";break;case"adm_f30":s.fame=Math.min(100,s.fame+30);r="⭐ +۳۰";break;case"adm_f100":s.fame=100;r="⭐ ۱۰۰";break;case"adm_star":s.players.push({name:SPECIAL.name,pos:SPECIAL.pos,talent:SPECIAL.talent,ability:SPECIAL.ability,age:21,city:SPECIAL.city,value:SPECIAL.talent*SPECIAL.ability*3,special:true,contract:null,history:["🌟"],goals:0,assists:0,cleans:0,conceded:0,tackles:0,games:0});r="🌟 مهدی برکات!";break;case"adm_boost":s.players.forEach(p=>{p.ability=Math.min(10,p.ability+2);p.talent=Math.min(10,p.talent+1);p.value=p.talent*p.ability*2;});r="💪 همه +۲";break;case"adm_5w":for(let i=0;i<5;i++)passWeek(s);r="⏭️ ۵ هفته";break;case"adm_34w":for(let i=0;i<34;i++)passWeek(s);r="⏭️ ۱ فصل";break;case"adm_office":if(s.office.level<5){const n=SHOP.offices[s.office.level];s.office={level:n.id,name:n.name,capacity:n.capacity,staffCapacity:n.staffCapacity,prestige:n.prestige};r=`🏚️ ${n.name}`;}break;case"adm_vehicle":if(s.vehicle.level<5){const n=SHOP.vehicles[s.vehicle.level];s.vehicle={level:n.id,name:n.name,cities:n.cities,speed:n.speed};r=`🚗 ${n.name}`;}break;case"adm_facility":if(s.facilities.level<5){const n=SHOP.facilities[s.facilities.level];s.facilities={level:n.id,name:n.name,bonus:n.bonus,desc:n.desc};r=`🏟️ ${n.name}`;}break;}await ctx.editMessageMedia({type:"photo",media:G("main"),caption:`🔓 ${r}\n\n${s.sum()}`,parse_mode:"Markdown"},{reply_markup:adminMenu()});return;}

    // تورنمنت
    if(d==="tournament_menu"){
        if(!s.tournament?.active){await ctx.answerCallbackQuery("❌ تورنمنتی فعال نیست!");return;}
        let t=`╭────────────────────╮\n│ 🏆 *تورنمنت*       │\n╰────────────────────╯\n\n`;
        t+=`🏟️ ${s.tournament.club}\n💰 جایزه: ${s.tournament.prize}M\n👥 ۸ تیم\n\n`;
        t+=`بازیکنای آزاد:\n`;
        const free=s.players.filter(p=>!p.contract);
        if(free.length===0) t+=`❌ بازیکن آزاد نداری!\n`;
        else free.forEach(p=>t+=`⚽ ${p.name} ⭐${p.talent} 💪${p.ability}\n`);
        
        const kb=new InlineKeyboard();
        free.forEach((p,i)=>{
            const idx=s.players.indexOf(p);
            kb.text(`📤 ${p.name}`,`tournament_send_${idx}`).row();
        });
        kb.text("🔙","menu_main");
        return ctx.editMessageMedia({type:"photo",media:G("trophy"),caption:t,parse_mode:"Markdown"},{reply_markup:kb});
    }
    
    if(d.startsWith("tournament_send_")){
        const i=parseInt(d.split("_")[2]);
        const p=s.players[i];
        if(!p||p.contract){await ctx.answerCallbackQuery("❌");return;}
        if(!s.tournament?.active){await ctx.answerCallbackQuery("❌ تورنمنت تموم شده!");return;}
        
        s.money+=s.tournament.prize;
        p.ability=Math.min(10,p.ability+1);
        p.value=p.talent*p.ability*2;
        p.games=(p.games||0)+1;
        s.fame+=5;
        p.history.push(`🏆 تورنمنت`);
        s.tournament.active=false;
        r=`🏆 ${p.name} تو تورنمنت ${s.tournament.club} شرکت کرد!\n💰 +${s.tournament.prize}M\n💪 +۱\n⭐ +۵`;
        im=G("trophy");
    }

    if(d==="shop_menu"||d.startsWith("shop_")||d.startsWith("buy_")||d.startsWith("hire_")){await handleShop(ctx,s,d);return;}
    if(d==="menu_main") return ctx.editMessageMedia({type:"photo",media:G("main"),caption:s.sum(),parse_mode:"Markdown"},{reply_markup:mainMenu(s)});
    if(d==="menu_time") return ctx.editMessageMedia({type:"photo",media:G("main"),caption:`⏭️ هفته ${s.week}`,parse_mode:"Markdown"},{reply_markup:timeMenu()});
    if(d.startsWith("next_")){const w=parseInt(d.split("_")[1]);let ev="";for(let i=0;i<w;i++){const e=passWeek(s);if(e)ev+=e;}if(ev.includes("🚑"))im=G("clinic");if(ev.includes("عادل"))im=G("host");if(ev.includes("🏆"))im=G("trophy");if(ev.includes("📰"))im=G("newspaper");return ctx.editMessageMedia({type:"photo",media:im,caption:`⏭️ ${w} هفته\n\n${ev}\n${s.sum()}`,parse_mode:"Markdown"},{reply_markup:mainMenu(s)});}
    if(d==="scout"){const kb=new InlineKeyboard();LEAGUES.forEach((l,i)=>{const lk=s.money<l.minBudget?" 🔒":"";kb.text(`${l.name}${lk}`,`sl_${i}`).row();});kb.text("🔙","menu_main");return ctx.editMessageMedia({type:"photo",media:G("scout"),caption:box("🔍 جذب",`💰 ${s.money}M`),parse_mode:"Markdown"},{reply_markup:kb});}
    if(d.startsWith("sl_")){const li=parseInt(d.split("_")[1]),L=LEAGUES[li];if(s.money<L.minBudget){await ctx.answerCallbackQuery(`❌ ${L.minBudget}M`);return;}if(s.money<L.cost){await ctx.answerCallbackQuery(`❌ ${L.cost}M`);return;}s.money-=L.cost;const f=[];for(let i=0;i<3;i++){if(li===0&&Math.random()<0.05)f.push({name:SPECIAL.name,pos:SPECIAL.pos,talent:SPECIAL.talent,ability:SPECIAL.ability,age:21,city:SPECIAL.city,value:SPECIAL.talent*SPECIAL.ability*2,special:true,contract:null,history:["🌟"],goals:0,assists:0,cleans:0,conceded:0,tackles:0,games:0});else{const nm=FIRST_NAMES[Math.floor(Math.random()*10)]+" "+LAST_NAMES[Math.floor(Math.random()*10)],t=Math.floor(Math.random()*(L.maxStar-L.minStar+1))+L.minStar,a=Math.floor(Math.random()*(L.maxAbility-L.minAbility+1))+L.minAbility;f.push({name:nm,pos:POSITIONS[Math.floor(Math.random()*4)],talent:t,ability:a,age:Math.floor(Math.random()*10)+16,city:Math.floor(Math.random()*10),value:t*a*2,special:false,contract:null,history:["🤝"],goals:0,assists:0,cleans:0,conceded:0,tackles:0,games:0});}}s.temp=f;let tx=`🔍 *${L.name}*\n`;f.forEach((p,i)=>tx+=`${i+1}. ${p.special?"🌟":""}⚽ ${p.name} | ⭐${p.talent} 💪${p.ability} | 💰${p.value}M\n`);const kb=new InlineKeyboard();f.forEach((p,i)=>kb.text(`${i+1}`,`pick_${i}`));kb.row().text("🔍 دوباره",`sl_${li}`).text("🔙","scout");return ctx.editMessageMedia({type:"photo",media:G("scout"),caption:tx,parse_mode:"Markdown"},{reply_markup:kb});}
    if(d.startsWith("pick_")){const i=parseInt(d.split("_")[1]);if(!s.temp?.[i]){await ctx.answerCallbackQuery("❌");return;}s.players.push(s.temp[i]);s.temp=null;r=`🤝 ${s.players[s.players.length-1].name} پیوست!`;im=G("player");}
    if(d==="players"){if(!s.players.length)return ctx.editMessageMedia({type:"photo",media:G("player"),caption:"👥 خالی!",parse_mode:"Markdown"},{reply_markup:mainMenu(s)});const kb=new InlineKeyboard();s.players.forEach((p,i)=>kb.text(`${p.special?"🌟":""} ${p.name} ⭐${p.talent}`,`pv_${i}`).row());kb.text("🔙","menu_main");return ctx.editMessageMedia({type:"photo",media:G("player"),caption:`👥 ${s.players.length}`,parse_mode:"Markdown"},{reply_markup:kb});}
    if(d.startsWith("pv_")){const i=parseInt(d.split("_")[1]),p=s.players[i];if(!p){await ctx.answerCallbackQuery("❌");return;}return ctx.editMessageMedia({type:"photo",media:G("player"),caption:card(p),parse_mode:"Markdown"},{reply_markup:playerMenu(i)});}
    if(d.startsWith("up_")){const i=parseInt(d.split("_")[1]);return ctx.editMessageMedia({type:"photo",media:G("training"),caption:`🏋️ ${s.players[i].name}`,parse_mode:"Markdown"},{reply_markup:upgradeMenu(i)});}
    if(d.startsWith("tr_")){const p=d.split("_"),i=parseInt(p[1]),c=parseInt(p[2]),pl=s.players[i];if(s.money<c){await ctx.answerCallbackQuery("❌");return;}s.money-=c;if(c===15){pl.ability=Math.min(10,pl.ability+2);pl.talent=Math.min(10,pl.talent+1);}else if(c===50){pl.ability=Math.min(10,pl.ability+3);}else if(c===30){pl.ability=Math.min(10,pl.ability+2);}else{pl.ability=Math.min(10,pl.ability+1);}pl.value=c===50?pl.talent*pl.ability*3:pl.talent*pl.ability*2;r=`✅ ${pl.name} 💪${pl.ability} 💰${pl.value}M`;im=G("training");}
    if(d.startsWith("se_")){const i=parseInt(d.split("_")[1]),p=s.players.splice(i,1)[0];s.money+=p.value;s.fame+=5;r=`💰 ${p.name} +${p.value}M`;im=G("sell");}
    if(d.startsWith("ct_")){const i=parseInt(d.split("_")[1]),p=s.players[i];if(p.contract){await ctx.answerCallbackQuery("❌");return;}const mo=Math.floor(p.value/20),cl=CLUBS[Math.floor(Math.random()*10)];p.contract={monthly:mo,remaining:24,club:cl};s.money+=mo*3;r=`🤝 ${p.name} → ${cl}\n💵 ${mo}M/ماه`;im=G("contract");}
    if(d.startsWith("loan_")){const i=parseInt(d.split("_")[1]),p=s.players[i];if(p.contract){await ctx.answerCallbackQuery("❌");return;}const cl=CLUBS[Math.floor(Math.random()*10)],lm=Math.floor(p.value/30);s.money+=lm;p.ability=Math.min(10,p.ability+1);p.value=p.talent*p.ability*2;p.games=(p.games||0)+1;r=`🔄 ${p.name} → ${cl}\n💰 ${lm}M\n💪 +۱`;im=G("player");}
    if(r) await ctx.editMessageMedia({type:"photo",media:im,caption:`${r}\n\n${s.sum()}`,parse_mode:"Markdown"},{reply_markup:mainMenu(s)});
}

async function handleShop(ctx, state, data) {
    if(data==="shop_menu"){return ctx.editMessageMedia({type:"photo",media:G("main"),caption:box("🛒 فروشگاه",`🏚️ ${state.office.name}\n🚗 ${state.vehicle.name}\n🏟️ ${state.facilities.name}\n👩‍💼 ${state.staff.length}/${state.office.staffCapacity}`),parse_mode:"Markdown"},{reply_markup:shopMenu()});}
    if(data==="shop_office"){const c=SHOP.offices[state.office.level-1],n=SHOP.offices[state.office.level];let t=`${c.emoji} *${c.name}*\n👥 ${c.capacity} | 👩‍💼 ${state.staff.length}/${c.staffCapacity}\n⭐ ${"★".repeat(c.prestige)}${"☆".repeat(5-c.prestige)}`;if(n){const p=Math.min(100,Math.floor((state.money/n.price)*100));t+=`\n\n🛒 ${n.emoji} ${n.name}\n💰 ${n.price}M | ${"█".repeat(Math.floor(p/10))}${"░".repeat(10-Math.floor(p/10))} ${p}٪`;}else t+=`\n\n🏆 حداکثر!`;const kb=new InlineKeyboard();if(n&&state.money>=n.price)kb.text(`خرید ${n.name}`,"buy_office");else if(n)kb.text(`🔒 ${n.price}M`,"noop");kb.row().text("🔙","shop_menu");return ctx.editMessageMedia({type:"photo",media:G("main"),caption:t,parse_mode:"Markdown"},{reply_markup:kb});}
    if(data==="shop_vehicle"){const c=SHOP.vehicles[state.vehicle.level-1],n=SHOP.vehicles[state.vehicle.level];let t=`${c.emoji} *${c.name}*\n🏘️ ${c.cities} شهر | ⚡ ${c.speed}`;if(n){const p=Math.min(100,Math.floor((state.money/n.price)*100));t+=`\n\n🛒 ${n.emoji} ${n.name}\n💰 ${n.price}M | ${"█".repeat(Math.floor(p/10))}${"░".repeat(10-Math.floor(p/10))} ${p}٪`;}else t+=`\n\n🏆 حداکثر!`;const kb=new InlineKeyboard();if(n&&state.money>=n.price)kb.text(`خرید ${n.name}`,"buy_vehicle");else if(n)kb.text(`🔒 ${n.price}M`,"noop");kb.row().text("🔙","shop_menu");return ctx.editMessageMedia({type:"photo",media:G("main"),caption:t,parse_mode:"Markdown"},{reply_markup:kb});}
    if(data==="shop_facility"){const c=SHOP.facilities[state.facilities.level-1],n=SHOP.facilities[state.facilities.level];let t=`${c.emoji} *${c.name}*\n📝 ${c.desc}\n💪 +${c.bonus}`;if(n){const p=Math.min(100,Math.floor((state.money/n.price)*100));t+=`\n\n🛒 ${n.emoji} ${n.name}\n💰 ${n.price}M | ${"█".repeat(Math.floor(p/10))}${"░".repeat(10-Math.floor(p/10))} ${p}٪`;}else t+=`\n\n🏆 حداکثر!`;const kb=new InlineKeyboard();if(n&&state.money>=n.price)kb.text(`خرید ${n.name}`,"buy_facility");else if(n)kb.text(`🔒 ${n.price}M`,"noop");kb.row().text("🔙","shop_menu");return ctx.editMessageMedia({type:"photo",media:G("main"),caption:t,parse_mode:"Markdown"},{reply_markup:kb});}
    if(data==="shop_staff"){let t=`👥 ${state.staff.length}/${state.office.staffCapacity}\n`;if(state.staff.length>0){state.staff.forEach(s=>t+=`${s.emoji} ${s.name}\n`);t+=`\n`;}const kb=new InlineKeyboard();let h=false;SHOP.staff.forEach(s=>{if(state.office.level>=s.needOffice&&!state.staff.find(x=>x.id===s.id)){h=true;if(state.money>=s.price)kb.text(`${s.emoji} ${s.name} ${s.price}M`,`hire_${s.id}`).row();else kb.text(`🔒 ${s.name} ${s.price}M`,"noop").row();}});if(!h)t+=`✅ همه رو داری!`;kb.text("🔙","shop_menu");return ctx.editMessageMedia({type:"photo",media:G("main"),caption:t,parse_mode:"Markdown"},{reply_markup:kb});}
    if(data==="noop"){await ctx.answerCallbackQuery("❌ بودجه ناکافی!");return;}
    if(data==="buy_office"){const n=SHOP.offices[state.office.level];if(state.money>=n.price){state.money-=n.price;state.office={level:n.id,name:n.name,capacity:n.capacity,staffCapacity:n.staffCapacity,prestige:n.prestige};await ctx.answerCallbackQuery(`✅ ${n.name}!`);return handleShop(ctx,state,"shop_office");}}
    if(data==="buy_vehicle"){const n=SHOP.vehicles[state.vehicle.level];if(state.money>=n.price){state.money-=n.price;state.vehicle={level:n.id,name:n.name,cities:n.cities,speed:n.speed};await ctx.answerCallbackQuery(`✅ ${n.name}!`);return handleShop(ctx,state,"shop_vehicle");}}
    if(data==="buy_facility"){const n=SHOP.facilities[state.facilities.level];if(state.money>=n.price){state.money-=n.price;state.facilities={level:n.id,name:n.name,bonus:n.bonus,desc:n.desc};await ctx.answerCallbackQuery(`✅ ${n.name}!`);return handleShop(ctx,state,"shop_facility");}}
    if(data.startsWith("hire_")){const id=parseInt(data.split("_")[1]),st=SHOP.staff.find(s=>s.id===id);if(st&&state.money>=st.price&&state.staff.length<state.office.staffCapacity){state.money-=st.price;state.staff.push(st);await ctx.answerCallbackQuery(`✅ ${st.name}!`);return handleShop(ctx,state,"shop_staff");}}
}

module.exports = { start, message, callback, ADMIN_ID, adminMenu };