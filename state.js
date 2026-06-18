// state.js - مدیریت وضعیت بازیکن و کلاس ایران (نسخه سخت)

const { INITIAL_STATE, COUNTRIES, INITIAL_PROXIES, RANDOM_EVENT_CHANCE, CRISIS_TYPES, LOCKS } = require('./config');

// ============================================
// 🏛️ کلاس ایران (وضعیت هر بازیکن)
// ============================================
class IranState {
    constructor(playerName) {
        // کپی از وضعیت اولیه
        Object.assign(this, JSON.parse(JSON.stringify(INITIAL_STATE)));
        
        this.playerName = playerName;
        this.history = [];
        this.countries = JSON.parse(JSON.stringify(COUNTRIES));
        this.proxies = JSON.parse(JSON.stringify(INITIAL_PROXIES));
        
        // کابینه
        this.cabinet = {
            economy_minister: "احمد میدری",
            foreign_minister: "حسین امیرعبداللهیان",
            oil_minister: "جواد اوجی",
            interior_minister: "احمد وحیدی",
            central_bank_chief: "محمدرضا فرزین"
        };
        
        // مجلس
        this.parliament = {
            principlists: 190,
            reformists: 35,
            independents: 65
        };
        
        // استان‌ها
        this.provinces = this.initProvinces();
        
        // وضعیت‌های خاص
        this.internet_filtered = true;
        this.hijab_mandatory = true;
        this.gas_price = 3000;
        this.nuclear_deal_active = false;
        this.fatf_accepted = false;
        
        // آمار اضافی
        this.brain_drain = 5;
        this.cyber_attacks_received = 3;
        this.earthquake_deaths = 0;
        this.corruption_level = 65;
        this.water_crisis = 70;
        this.foreign_debt = 10;
        
        // قفل‌ها
        this.print_money_count = 0;
        this.last_war_turn = -10;
        this.leader_approval = Math.random() < 0.4;
        this.parliament_approval = Math.random() < 0.3;
    }
    
    // ساخت استان‌ها (با رضایت کمتر)
    initProvinces() {
        const provinceNames = [
            "تهران", "مشهد", "اصفهان", "تبریز", "شیراز",
            "اهواز", "کرمان", "کرمانشاه", "رشت", "ساری",
            "زاهدان", "همدان", "ارومیه", "یزد", "قزوین",
            "سنندج", "خرم‌آباد", "بندرعباس", "اردبیل", "گرگان",
            "بوشهر", "زنجان", "ایلام", "کاشان", "بیرجند",
            "بجنورد", "یاسوج", "شهرکرد", "سمنان", "قشم", "چابهار"
        ];
        
        return provinceNames.map(name => ({
            name: name,
            population: Math.floor(Math.random() * 5) + 1,
            satisfaction: Math.floor(Math.random() * 20) + 30,
            unemployment: Math.floor(Math.random() * 20) + 10,
            has_water_crisis: Math.random() < 0.5,
            has_protest: Math.random() < 0.2
        }));
    }
    
    // ============================================
    // 📅 گذر زمان (هر نوبت = یک ماه)
    // ============================================
    nextTurn() {
        this.turn++;
        this.month++;
        
        if (this.month > 12) {
            this.month = 1;
            this.year++;
            this.print_money_count = 0;
        }
        
        // اثرات ماهانه (بدتر شده)
        this.monthlyEffects();
        
        // بحران تصادفی (احتمال بیشتر)
        if (Math.random() < RANDOM_EVENT_CHANCE) {
            this.randomCrisis();
        }
        
        // بحران‌های دوره‌ای
        if (this.turn % 3 === 0) {
            this.periodicCrisis();
        }
        
        // بروزرسانی شاخص‌ها
        this.updateIndicators();
        
        // بررسی پایان بازی (سخت‌تر)
        this.checkGameOver();
        
        // اضافه به تاریخچه
        if (this.history.length > 50) {
            this.history = this.history.slice(-30);
        }
        
        return this.getStatusSummary();
    }
    
    // ============================================
    // 📊 اثرات ماهانه (سخت‌تر شده)
    // ============================================
    monthlyEffects() {
        // درآمد نفتی (کمتر)
        const oilIncome = this.oil_export * 30 * this.oil_price;
        this.dollar_reserves += oilIncome / 1000;
        
        // هزینه‌های جاری (بیشتر)
        const monthlyExpense = this.budget_toman / 10;
        this.budget_toman -= monthlyExpense * 0.9;
        
        // تورم طبیعی (سریع‌تر)
        this.inflation += (Math.random() * 1.5) - 0.3;
        this.inflation = Math.max(5, Math.min(150, this.inflation));
        
        // نوسان دلار (شدیدتر)
        const dollarChange = (Math.random() * 3000) - 1000;
        this.dollar_rate += dollarChange;
        this.dollar_rate = Math.max(50000, Math.min(250000, this.dollar_rate));
        
        // نوسان نفت
        const oilChange = (Math.random() * 5) - 2;
        this.oil_price += oilChange;
        this.oil_price = Math.max(25, Math.min(130, this.oil_price));
        
        // محبوبیت (سریع‌تر کاهش)
        if (this.inflation > 40) this.popularity -= 3;
        if (this.inflation > 60) this.popularity -= 5;
        if (this.unemployment > 15) this.popularity -= 2;
        if (this.sanctions > 80) this.popularity -= 2;
        if (this.corruption_level > 50) this.popularity -= 1;
        if (this.brain_drain > 5) this.popularity -= 1;
        
        // فرار مغزها (تصادفی)
        if (Math.random() < 0.2) {
            this.brain_drain += 1;
        }
        
        // فساد (رشد طبیعی)
        if (Math.random() < 0.3) {
            this.corruption_level += 2;
        }
        
        // بحران آب
        if (Math.random() < 0.15) {
            this.water_crisis += 3;
        }
        
        this.popularity = Math.max(0, Math.min(100, this.popularity));
        
        // بودجه منفی = چاپ پول اضطراری
        if (this.budget_toman < 0) {
            this.budget_toman = 0;
            this.inflation += 10;
            this.dollar_rate += 10000;
            this.addHistory("⚠️ بودجه صفر شد! چاپ پول اضطراری (تورم +۱۰٪)");
        }
    }
    
    // ============================================
    // 🎲 بحران تصادفی (۱۸ نوع بحران)
    // ============================================
    randomCrisis() {
        const crisis = CRISIS_TYPES[Math.floor(Math.random() * CRISIS_TYPES.length)];
        let message = "";
        
        switch(crisis) {
            case "اعتراضات_سراسری":
                this.popularity -= 15;
                const protestProvince = this.provinces[Math.floor(Math.random() * this.provinces.length)];
                protestProvince.has_protest = true;
                protestProvince.satisfaction -= 20;
                message = `⚠️ اعتراضات در ${protestProvince.name}! محبوبیت -۱۵٪`;
                break;
                
            case "حمله_سایبری":
                this.budget_toman -= 3;
                this.dollar_reserves -= 0.5;
                this.cyber_attacks_received++;
                message = "💻 حمله سایبری سنگین! خسارت ۳ همت + ۰.۵ میلیارد دلار";
                break;
                
            case "زلزله":
                const eqDeaths = Math.floor(Math.random() * 2000) + 200;
                this.earthquake_deaths += eqDeaths;
                this.budget_toman -= 5;
                this.popularity -= 5;
                message = `🌍 زلزله ویرانگر! ${eqDeaths} کشته، خسارت ۵ همت`;
                break;
                
            case "ترور_دانشمند":
                this.nuclear_percent -= 8;
                this.popularity -= 5;
                this.israel_tension += 8;
                message = "🎯 ترور دانشمند ارشد هسته‌ای! غنی‌سازی ۸٪ کاهش";
                break;
                
            case "سیل":
                this.budget_toman -= 3;
                this.popularity -= 2;
                message = "🌊 سیل ویرانگر در استان‌های شمالی! خسارت ۳ همت";
                break;
                
            case "کرونا":
                this.popularity -= 4;
                this.gdp -= 8;
                this.budget_toman -= 3;
                this.unemployment += 2;
                message = "🦠 موج جدید کرونا! GDP -۸, بیکاری +۲٪";
                break;
                
            case "رسوایی_فساد":
                const stolen = Math.floor(Math.random() * 8) + 2;
                this.budget_toman -= stolen;
                this.popularity -= 10;
                this.corruption_level += 5;
                message = `💰 رسوایی فساد ${stolen} همتی! محبوبیت -۱۰٪`;
                break;
                
            case "شورش_قومی":
                this.popularity -= 8;
                const ethnicProvince = this.provinces[Math.floor(Math.random() * 10)];
                ethnicProvince.satisfaction -= 25;
                ethnicProvince.has_protest = true;
                message = `⚔️ شورش قومی در ${ethnicProvince.name}!`;
                break;
                
            case "تحریم_جدید":
                this.sanctions += 12;
                this.dollar_rate += 8000;
                this.gdp -= 5;
                message = "🚫 تحریم‌های جدید! دلار +۸,۰۰۰, GDP -۵";
                break;
                
            case "پیشنهاد_مذاکره_محرمانه":
                const secretCountry = this.countries[Math.floor(Math.random() * this.countries.length)];
                message = `🤫 ${secretCountry[0]} ${secretCountry[1]} پیشنهاد مذاکره محرمانه داده!`;
                break;
                
            case "کشف_نفت":
                this.oil_production += 0.3;
                this.budget_toman += 8;
                message = "🛢️ میدان نفتی جدید کشف شد! +۰.۳ میلیون بشکه";
                break;
                
            case "هک_سامانه_بانکی":
                this.dollar_reserves -= 2;
                this.popularity -= 5;
                this.cyber_attacks_received++;
                message = "🏦 هک بزرگ بانکی! ۲ میلیارد دلار سرقت شد";
                break;
                
            case "استیضاح_وزیر":
                const ministers = Object.keys(this.cabinet);
                const fired = ministers[Math.floor(Math.random() * ministers.length)];
                this.popularity -= 3;
                message = `📋 مجلس وزیر ${fired} رو استیضاح کرد!`;
                break;
                
            case "سقوط_بورس":
                this.gdp -= 10;
                this.popularity -= 3;
                this.budget_toman -= 2;
                message = "📉 سقوط بورس! GDP -۱۰ میلیارد دلار";
                break;
                
            case "حمله_به_سفارت":
                this.popularity -= 3;
                const attackedCountry = this.countries[Math.floor(Math.random() * this.countries.length)];
                attackedCountry[4] = Math.max(-100, attackedCountry[4] - 15);
                message = `💣 حمله به سفارت ${attackedCountry[0]} ${attackedCountry[1]}!`;
                break;
                
            case "فرار_مغزها":
                this.brain_drain += 3;
                this.gdp -= 3;
                this.popularity -= 2;
                message = "🧠 فرار نخبگان! ۳٪ افزایش";
                break;
                
            case "کودتای_نرم":
                this.popularity -= 8;
                this.leader_approval = false;
                this.parliament_approval = false;
                message = "🕵️ تلاش برای کودتای نرم! تأییدها لغو شد";
                break;
                
            case "بحران_آب":
                this.water_crisis += 10;
                this.popularity -= 4;
                const dryProvince = this.provinces[Math.floor(Math.random() * this.provinces.length)];
                dryProvince.has_water_crisis = true;
                dryProvince.satisfaction -= 10;
                message = `💧 بحران آب در ${dryProvince.name}!`;
                break;
        }
        
        this.history.push(`📅 ${this.year}/${this.month}: ${message}`);
        return message;
    }
    
    // ============================================
    // 📅 بحران‌های دوره‌ای (هر ۳ ماه)
    // ============================================
    periodicCrisis() {
        const periodicCrises = [
            {
                condition: this.inflation > 50,
                message: "📊 گزارش ویژه: تورم از ۵۰٪ گذشت! هشدار اقتصادی",
                effect: () => { this.popularity -= 3; }
            },
            {
                condition: this.dollar_rate > 120000,
                message: "💵 گزارش ویژه: دلار از ۱۲۰,۰۰۰ گذشت! بازار متشنج",
                effect: () => { this.popularity -= 2; this.inflation += 2; }
            },
            {
                condition: this.brain_drain > 8,
                message: "🧠 گزارش ویژه: فرار مغزها به سطح بحرانی رسید",
                effect: () => { this.gdp -= 5; }
            },
            {
                condition: this.water_crisis > 80,
                message: "💧 گزارش ویژه: بحران آب به مرحله اضطرار رسید",
                effect: () => { this.popularity -= 5; }
            },
            {
                condition: this.corruption_level > 70,
                message: "💰 گزارش ویژه: فساد سیستمی در حال نابودی اقتصاد",
                effect: () => { this.budget_toman -= 5; this.popularity -= 4; }
            }
        ];
        
        periodicCrises.forEach(crisis => {
            if (crisis.condition) {
                crisis.effect();
                this.addHistory(crisis.message);
            }
        });
    }
    
    // ============================================
    // 📈 بروزرسانی شاخص‌ها
    // ============================================
    updateIndicators() {
        this.popularity = Math.max(0, Math.min(100, this.popularity));
        this.inflation = Math.max(5, Math.min(150, this.inflation));
        this.sanctions = Math.max(0, Math.min(100, this.sanctions));
        this.israel_tension = Math.max(0, Math.min(100, this.israel_tension));
        this.nuclear_percent = Math.max(3.67, Math.min(90, this.nuclear_percent));
        this.unemployment = Math.max(2, Math.min(60, this.unemployment));
        this.corruption_level = Math.max(0, Math.min(100, this.corruption_level));
        this.water_crisis = Math.max(0, Math.min(100, this.water_crisis));
        this.brain_drain = Math.max(0, Math.min(30, this.brain_drain));
    }
    
    // ============================================
    // 💀 بررسی پایان بازی (سخت‌تر شده)
    // ============================================
    checkGameOver() {
        // محبوبیت زیر ۱۵٪ (قبلاً ۵٪)
        if (this.popularity <= 15) {
            this.game_over = true;
            this.history.push("💔 مردم علیه شما قیام کردند! سقوط دولت");
        }
        
        // ورشکستگی
        if (this.budget_toman <= 0 && this.dollar_reserves <= 0) {
            this.game_over = true;
            this.history.push("💸 کشور ورشکست شد! فروپاشی اقتصادی");
        }
        
        // جنگ با اسرائیل
        if (this.israel_tension >= 95 && Math.random() < 0.5) {
            this.game_over = true;
            this.history.push("💥 جنگ تمام‌عیار با اسرائیل آغاز شد!");
        }
        
        // دلار بالای ۲۰۰,۰۰۰ (قبلاً همین بود)
        if (this.dollar_rate >= 200000) {
            this.game_over = true;
            this.history.push("📉 دلار از ۲۰۰ هزار تومان گذشت! فروپاشی ریال");
        }
        
        // تورم بالای ۱۰۰٪ (جدید)
        if (this.inflation >= 100) {
            this.game_over = true;
            this.history.push("📈 تورم سه‌رقمی شد! اقتصاد نابود شد");
        }
        
        // فرار مغزها (جدید)
        if (this.brain_drain >= 20) {
            this.game_over = true;
            this.history.push("🧠 فرار کامل نخبگان! کشور فلج شد");
        }
        
        // بحران آب (جدید)
        if (this.water_crisis >= 95) {
            this.game_over = true;
            this.history.push("💧 بحران آب به فاجعه ملی تبدیل شد!");
        }
        
        // فساد کامل (جدید)
        if (this.corruption_level >= 95) {
            this.game_over = true;
            this.history.push("💰 فساد سیستمی کشور را فلج کرد!");
        }
    }
    
    // ============================================
    // 📊 خلاصه وضعیت
    // ============================================
    getStatusSummary() {
        return `
🇮🇷 *گزارش وضعیت جمهوری اسلامی ایران*
👤 رئیس‌جمهور: ${this.playerName}
📅 تاریخ: ${this.year}/${this.month}
⏳ نوبت: ${this.turn}

━━━━━━━━━━━━━━━━━━
💰 *اقتصاد:*
  • بودجه: ${this.budget_toman.toFixed(1)} همت
  • ذخایر ارزی: ${this.dollar_reserves.toFixed(1)} میلیارد دلار
  • ذخایر طلا: ${this.gold_tons.toFixed(2)} تن
  • بیت‌کوین: ${this.bitcoin} عدد
  • تولید نفت: ${this.oil_production} میلیون بشکه/روز
  • صادرات نفت: ${this.oil_export} میلیون بشکه/روز
  • قیمت نفت: ${this.oil_price} دلار
  • نرخ دلار: ${this.dollar_rate.toLocaleString()} تومان
  • تورم: ${this.inflation.toFixed(1)}٪
  • GDP: ${this.gdp} میلیارد دلار
  • بیکاری: ${this.unemployment}٪
  • فساد: ${this.corruption_level}٪

━━━━━━━━━━━━━━━━━━
⚔️ *نظامی:*
  • موشک: ${this.missiles.toLocaleString()} عدد
  • پهپاد: ${this.drones.toLocaleString()} عدد
  • نیرو: ${this.soldiers.toLocaleString()} نفر
  • غنی‌سازی: ${this.nuclear_percent}٪

━━━━━━━━━━━━━━━━━━
🌍 *دیپلماسی:*
  • سطح تحریم: ${this.sanctions}/۱۰۰
  • تنش با اسرائیل: ${this.israel_tension}/۱۰۰
  • توافق هسته‌ای: ${this.nuclear_deal_active ? '✅ فعال' : '❌ غیرفعال'}
  • FATF: ${this.fatf_accepted ? '✅ پذیرفته‌شده' : '❌ در لیست سیاه'}

━━━━━━━━━━━━━━━━━━
👥 *داخلی:*
  • محبوبیت: ${this.popularity}٪
  • فرار مغزها: ${this.brain_drain}٪
  • بحران آب: ${this.water_crisis}٪
  • تأیید رهبری: ${this.leader_approval ? '✅' : '❌'}
  • تأیید مجلس: ${this.parliament_approval ? '✅' : '❌'}
  • وضعیت اینترنت: ${this.internet_filtered ? '🚫 فیلترشده' : '✅ آزاد'}
  • قیمت بنزین: ${this.gas_price.toLocaleString()} تومان

━━━━━━━━━━━━━━━━━━
${this.game_over ? '💀 *پایان بازی!*\nبرای شروع دوباره /start را بزن' : '🎮 بازی ادامه دارد...'}
        `.trim();
    }
    
    addHistory(text) {
        this.history.push(`📅 ${this.year}/${this.month}: ${text}`);
    }
    
    findCountry(code) {
        return this.countries.find(c => c[2] === code);
    }
    
    getDollarRate() {
        return this.dollar_rate;
    }
    
    getOilPrice() {
        return this.oil_price;
    }
    
    tomanToDollar(toman) {
        return toman / this.dollar_rate;
    }
    
    dollarToToman(dollar) {
        return dollar * this.dollar_rate;
    }
    
    // ============================================
    // 🔒 بررسی قفل عملیات
    // ============================================
    canDo(action) {
        const lock = LOCKS[action];
        if (!lock) return { allowed: true };
        
        const reasons = [];
        
        if (lock.popularity && this.popularity < lock.popularity) {
            reasons.push(`نیاز به محبوبیت ${lock.popularity}٪ (فعلی: ${this.popularity}٪)`);
        }
        
        if (lock.missiles && this.missiles < lock.missiles) {
            reasons.push(`نیاز به ${lock.missiles} موشک (فعلی: ${this.missiles})`);
        }
        
        if (lock.leader && !this.leader_approval) {
            reasons.push("نیاز به تأیید رهبری");
        }
        
        if (lock.parliament && !this.parliament_approval) {
            reasons.push("نیاز به رأی مجلس");
        }
        
        if (lock.max_per_year && this.print_money_count >= lock.max_per_year) {
            reasons.push(`حداکثر ${lock.max_per_year} بار در سال (فعلی: ${this.print_money_count})`);
        }
        
        if (lock.cooldown_turns && (this.turn - this.last_war_turn) < lock.cooldown_turns) {
            const remaining = lock.cooldown_turns - (this.turn - this.last_war_turn);
            reasons.push(`باید ${remaining} نوبت صبر کنی`);
        }
        
        if (lock.or_leader && this.leader_approval) {
            return { allowed: true };
        }
        
        return {
            allowed: reasons.length === 0,
            reasons: reasons
        };
    }
}

// ============================================
// 💾 ذخیره‌سازی بازیکنان در حافظه
// ============================================
const players = new Map();

function getPlayer(userId) {
    return players.get(userId);
}

function setPlayer(userId, state) {
    players.set(userId, state);
}

function deletePlayer(userId) {
    players.delete(userId);
}

function playerExists(userId) {
    return players.has(userId);
}

// ============================================
// 📤 خروجی
// ============================================
module.exports = {
    IranState,
    players,
    getPlayer,
    setPlayer,
    deletePlayer,
    playerExists
};