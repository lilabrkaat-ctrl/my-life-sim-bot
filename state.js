// state.js - مدیریت وضعیت بازیکن و کلاس ایران

const { INITIAL_STATE, COUNTRIES, INITIAL_PROXIES, RANDOM_EVENT_CHANCE, CRISIS_TYPES } = require('./config');

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
        
        // احزاب و جناح‌ها
        this.parliament = {
            principlists: 180,  // اصولگرا
            reformists: 40,     // اصلاح‌طلب
            independents: 70    // مستقل
        };
        
        // استان‌ها (۳۱ استان)
        this.provinces = this.initProvinces();
        
        // وضعیت‌های خاص
        this.internet_filtered = true;
        this.hijab_mandatory = true;
        this.gas_price = 3000;  // تومان هر لیتر
        this.nuclear_deal_active = false;
        this.fatf_accepted = false;
        
        // آمار اضافی
        this.brain_drain = 0;  // فرار مغزها
        this.cyber_attacks_received = 0;
        this.earthquake_deaths = 0;
    }
    
    // ساخت استان‌ها
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
            population: Math.floor(Math.random() * 5) + 1,  // میلیون
            satisfaction: Math.floor(Math.random() * 30) + 50,  // درصد
            unemployment: Math.floor(Math.random() * 15) + 5,   // درصد
            has_water_crisis: Math.random() < 0.3,
            has_protest: false
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
        }
        
        // اثرات ماهانه
        this.monthlyEffects();
        
        // بحران تصادفی
        if (Math.random() < RANDOM_EVENT_CHANCE) {
            this.randomCrisis();
        }
        
        // بروزرسانی شاخص‌ها
        this.updateIndicators();
        
        // بررسی پایان بازی
        this.checkGameOver();
        
        // اضافه به تاریخچه
        if (this.history.length > 50) {
            this.history = this.history.slice(-30);
        }
        
        return this.getStatusSummary();
    }
    
    // ============================================
    // 📊 اثرات ماهانه
    // ============================================
    monthlyEffects() {
        // درآمد نفتی
        const oilIncome = this.oil_export * 30 * this.oil_price;  // میلیون دلار در ماه
        this.dollar_reserves += oilIncome / 1000;  // تبدیل به میلیارد
        
        // هزینه‌های جاری
        const monthlyExpense = this.budget_toman / 12;  // هزینه ماهانه
        this.budget_toman -= monthlyExpense * 0.8;  // ۸۰٪ بودجه خرج می‌شه
        
        // تورم طبیعی
        this.inflation += (Math.random() * 0.5) - 0.2;
        this.inflation = Math.max(5, Math.min(100, this.inflation));
        
        // نوسان دلار
        const dollarChange = (Math.random() * 1000) - 500;
        this.dollar_rate += dollarChange;
        this.dollar_rate = Math.max(50000, Math.min(200000, this.dollar_rate));
        
        // نوسان نفت
        const oilChange = (Math.random() * 3) - 1.5;
        this.oil_price += oilChange;
        this.oil_price = Math.max(30, Math.min(120, this.oil_price));
        
        // محبوبیت
        if (this.inflation > 50) this.popularity -= 2;
        if (this.unemployment > 15) this.popularity -= 1;
        if (this.sanctions > 80) this.popularity -= 1;
        
        this.popularity = Math.max(0, Math.min(100, this.popularity));
        
        // بودجه
        if (this.budget_toman < 0) {
            this.budget_toman = 0;
            this.inflation += 5;
        }
    }
    
    // ============================================
    // 🎲 بحران تصادفی
    // ============================================
    randomCrisis() {
        const crisis = CRISIS_TYPES[Math.floor(Math.random() * CRISIS_TYPES.length)];
        let message = "";
        
        switch(crisis) {
            case "اعتراضات_سراسری":
                this.popularity -= 10;
                const protestProvince = this.provinces[Math.floor(Math.random() * this.provinces.length)];
                protestProvince.has_protest = true;
                protestProvince.satisfaction -= 15;
                message = `⚠️ اعتراضات در ${protestProvince.name}! محبوبیت کاهش یافت`;
                break;
                
            case "حمله_سایبری":
                this.budget_toman -= 2;
                this.cyber_attacks_received++;
                message = "💻 حمله سایبری به سامانه‌های بانکی! خسارت ۲ همت";
                break;
                
            case "زلزله":
                const eqDeaths = Math.floor(Math.random() * 1000) + 100;
                this.earthquake_deaths += eqDeaths;
                this.budget_toman -= 3;
                this.popularity -= 3;
                message = `🌍 زلزله! ${eqDeaths} کشته، خسارت ۳ همت`;
                break;
                
            case "ترور_دانشمند":
                this.nuclear_percent -= 5;
                this.popularity -= 3;
                this.israel_tension += 5;
                message = "🎯 ترور دانشمند هسته‌ای! غنی‌سازی ۵٪ کاهش یافت";
                break;
                
            case "سیل":
                this.budget_toman -= 1.5;
                message = "🌊 سیل در استان‌های شمالی! خسارت ۱.۵ همت";
                break;
                
            case "کرونا":
                this.popularity -= 2;
                this.gdp -= 5;
                this.budget_toman -= 2;
                message = "🦠 موج جدید کرونا! GDP کاهش یافت";
                break;
                
            case "رسوایی_فساد":
                const stolen = Math.floor(Math.random() * 5) + 1;
                this.budget_toman -= stolen;
                this.popularity -= 8;
                message = `💰 رسوایی فساد ${stolen} همتی در دولت!`;
                break;
                
            case "شورش_قومی":
                this.popularity -= 5;
                const ethnicProvince = this.provinces[Math.floor(Math.random() * 10)];
                ethnicProvince.satisfaction -= 20;
                message = `⚔️ شورش قومی در ${ethnicProvince.name}!`;
                break;
                
            case "تحریم_جدید":
                this.sanctions += 10;
                this.dollar_rate += 5000;
                message = "🚫 تحریم‌های جدید! دلار +۵,۰۰۰ تومان";
                break;
                
            case "پیشنهاد_مذاکره_محرمانه":
                const secretCountry = this.countries[Math.floor(Math.random() * this.countries.length)];
                message = `🤫 ${secretCountry[0]} پیشنهاد مذاکره محرمانه داده!`;
                break;
                
            case "کشف_نفت":
                this.oil_production += 0.5;
                this.budget_toman += 10;
                message = "🛢️ میدان نفتی جدید کشف شد! +۰.۵ میلیون بشکه";
                break;
                
            case "هک_سامانه_بانکی":
                this.dollar_reserves -= 1;
                this.popularity -= 3;
                message = "🏦 هک سامانه بانکی! ۱ میلیارد دلار سرقت شد";
                break;
                
            case "استیضاح_وزیر":
                const ministers = Object.keys(this.cabinet);
                const fired = ministers[Math.floor(Math.random() * ministers.length)];
                message = `📋 مجلس وزیر ${fired} رو استیضاح کرد!`;
                break;
        }
        
        this.history.push(`📅 ${this.year}/${this.month}: ${message}`);
        return message;
    }
    
    // ============================================
    // 📈 بروزرسانی شاخص‌ها
    // ============================================
    updateIndicators() {
        // محدودیت‌ها
        this.popularity = Math.max(0, Math.min(100, this.popularity));
        this.inflation = Math.max(5, Math.min(100, this.inflation));
        this.sanctions = Math.max(0, Math.min(100, this.sanctions));
        this.israel_tension = Math.max(0, Math.min(100, this.israel_tension));
        this.nuclear_percent = Math.max(3.67, Math.min(90, this.nuclear_percent));
        this.unemployment = Math.max(2, Math.min(50, this.unemployment));
    }
    
    // ============================================
    // 💀 بررسی پایان بازی
    // ============================================
    checkGameOver() {
        if (this.popularity <= 5) {
            this.game_over = true;
            this.history.push("💔 مردم علیه شما قیام کردند! سقوط دولت");
        } else if (this.budget_toman <= 0 && this.dollar_reserves <= 0) {
            this.game_over = true;
            this.history.push("💸 کشور ورشکست شد! فروپاشی اقتصادی");
        } else if (this.israel_tension >= 95 && Math.random() < 0.3) {
            this.game_over = true;
            this.history.push("💥 جنگ تمام‌عیار با اسرائیل آغاز شد!");
        } else if (this.dollar_rate >= 200000) {
            this.game_over = true;
            this.history.push("📉 دلار از ۲۰۰ هزار تومان گذشت! فروپاشی ریال");
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

━━━━━━━━━━━━━━━━━━
💰 *اقتصاد:*
  • بودجه: ${this.budget_toman.toFixed(1)} همت
  • ذخایر ارزی: ${this.dollar_reserves.toFixed(1)} میلیارد دلار
  • ذخایر طلا: ${this.gold_tons} تن
  • بیت‌کوین: ${this.bitcoin} عدد
  • تولید نفت: ${this.oil_production} میلیون بشکه/روز
  • صادرات نفت: ${this.oil_export} میلیون بشکه/روز
  • قیمت نفت: ${this.oil_price} دلار
  • نرخ دلار: ${this.dollar_rate.toLocaleString()} تومان
  • تورم: ${this.inflation.toFixed(1)}٪
  • GDP: ${this.gdp} میلیارد دلار
  • بیکاری: ${this.unemployment}٪

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
  • وضعیت اینترنت: ${this.internet_filtered ? '🚫 فیلترشده' : '✅ آزاد'}
  • حجاب: ${this.hijab_mandatory ? '🚫 اجباری' : '✅ اختیاری'}
  • قیمت بنزین: ${this.gas_price.toLocaleString()} تومان

━━━━━━━━━━━━━━━━━━
${this.game_over ? '💀 *پایان بازی!*\nبرای شروع دوباره /start را بزن' : '🎮 بازی ادامه دارد...'}
        `.trim();
    }
    
    // ============================================
    // ➕ اضافه کردن به تاریخچه
    // ============================================
    addHistory(text) {
        this.history.push(`📅 ${this.year}/${this.month}: ${text}`);
    }
    
    // ============================================
    // 🔍 پیدا کردن کشور
    // ============================================
    findCountry(code) {
        return this.countries.find(c => c[2] === code);
    }
    
    // ============================================
    // 💱 محاسبات مالی
    // ============================================
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