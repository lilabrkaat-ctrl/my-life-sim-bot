// state.js - نسخه با سیستم انتخابات و تنزل مقام

const { INITIAL_STATE, COUNTRIES, INITIAL_PROXIES, RANDOM_EVENT_CHANCE, CRISIS_TYPES, LOCKS } = require('./config');

class IranState {
    constructor(playerName) {
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
        
        // آمار
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
        
        // 🆕 سیستم انتخابات و تنزل
        this.rank = "president"; // president, speaker, minister, mp, citizen
        this.demotionCount = 0;
        this.termStart = { year: this.year, month: this.month };
        this.termDuration = 48; // ۴ سال = ۴۸ نوبت
        this.electionWarning = false;
        this.lastElection = { year: this.year, month: this.month };
        this.canReturn = true; // می‌تونه برگرده به قدرت
    }
    
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
    // 📅 گذر زمان
    // ============================================
    nextTurn() {
        this.turn++;
        this.month++;
        
        if (this.month > 12) {
            this.month = 1;
            this.year++;
            this.print_money_count = 0;
        }
        
        // بررسی انتخابات
        this.checkElection();
        
        // اثرات ماهانه
        this.monthlyEffects();
        
        // بحران تصادفی
        if (Math.random() < RANDOM_EVENT_CHANCE) {
            this.randomCrisis();
        }
        
        // بحران دوره‌ای
        if (this.turn % 3 === 0) {
            this.periodicCrisis();
        }
        
        // بروزرسانی
        this.updateIndicators();
        
        // بررسی تنزل
        this.checkDemotion();
        
        if (this.history.length > 50) {
            this.history = this.history.slice(-30);
        }
        
        return this.getStatusSummary();
    }
    
    // ============================================
    // 🗳️ سیستم انتخابات
    // ============================================
    checkElection() {
        const monthsInOffice = (this.year - this.termStart.year) * 12 + (this.month - this.termStart.month);
        
        // ۶ ماه قبل هشدار
        if (monthsInOffice >= 42 && !this.electionWarning && this.rank === 'president') {
            this.electionWarning = true;
            this.addHistory("🗳️ ۶ ماه تا انتخابات! محبوبیتت رو ببر بالا!");
        }
        
        // انتخابات
        if (monthsInOffice >= 48) {
            this.runElection();
        }
    }
    
    runElection() {
        const opponent = this.getRandomOpponent();
        const opponentPop = Math.floor(Math.random() * 30) + 30;
        const winChance = this.popularity - opponentPop + Math.floor(Math.random() * 15);
        
        if (this.rank === 'president') {
            if (winChance > 0) {
                // دوباره رئیس‌جمهور
                this.termStart = { year: this.year, month: this.month };
                this.popularity += 5;
                this.electionWarning = false;
                this.lastElection = { year: this.year, month: this.month };
                this.addHistory(`🎉 با ${this.popularity}٪ دوباره رئیس‌جمهور شدی! رقیب: ${opponent} (${opponentPop}٪)`);
            } else {
                // باخت → رئیس مجلس
                this.rank = 'speaker';
                this.demotionCount++;
                this.popularity += 5;
                this.termStart = { year: this.year, month: this.month };
                this.electionWarning = false;
                this.lastElection = { year: this.year, month: this.month };
                this.addHistory(`📉 باختی! ${opponent} (${opponentPop}٪) رئیس‌جمهور شد. تو رئیس مجلس شدی`);
            }
        } else if (this.rank !== 'president' && this.canReturn) {
            // شانس برگشت به ریاست‌جمهوری
            if (this.popularity > 50 && winChance > 10) {
                this.rank = 'president';
                this.termStart = { year: this.year, month: this.month };
                this.popularity += 10;
                this.demotionCount = Math.max(0, this.demotionCount - 1);
                this.electionWarning = false;
                this.lastElection = { year: this.year, month: this.month };
                this.addHistory(`🎉 *بازگشت تاریخی!* با ${this.popularity}٪ دوباره رئیس‌جمهور شدی!`);
            }
        }
    }
    
    getRandomOpponent() {
        const opponents = ["احمدی‌نژاد", "ظریف", "جلیلی", "لاریجانی", "قالیباف", "روحانی", "پزشکیان", "رضایی"];
        return opponents[Math.floor(Math.random() * opponents.length)];
    }
    
    // ============================================
    // 📉 سیستم تنزل مقام
    // ============================================
    checkDemotion() {
        if (this.rank === 'citizen') {
            // شهروند عادی فقط با محبوبیت خیلی پایین می‌بازه
            if (this.popularity <= 3 && this.budget_toman <= 0) {
                this.game_over = true;
                this.addHistory("💀 به پایین‌ترین نقطه رسیدی. پایان بازی.");
                return;
            }
            // شانس برگشت به نمایندگی
            if (this.popularity > 30 && this.canReturn) {
                this.rank = 'mp';
                this.popularity += 5;
                this.addHistory("🎉 با افزایش محبوبیت، دوباره نماینده مجلس شدی!");
            }
            return;
        }
        
        // رئیس جمهور - فقط با انتخابات عوض می‌شه
        if (this.rank === 'president') return;
        
        // بقیه مقام‌ها
        if (this.popularity <= 5 && this.rank === 'speaker') {
            this.rank = 'minister';
            this.demotionCount++;
            this.popularity += 8;
            this.addHistory("📉 از ریاست مجلس برکنار شدی. حالا وزیر کابینه‌ای");
        } else if (this.popularity <= 4 && this.rank === 'minister') {
            this.rank = 'mp';
            this.demotionCount++;
            this.popularity += 6;
            this.addHistory("📉 استیضاح شدی. برگشتی به نمایندگی مجلس");
        } else if (this.popularity <= 3 && this.rank === 'mp') {
            this.rank = 'citizen';
            this.demotionCount++;
            this.popularity += 10;
            this.addHistory("📉 رد صلاحیت شدی. حالا یه شهروند عادی هستی");
        }
        
        // شانس برگشت
        if (this.popularity > 40 && this.rank === 'speaker' && this.canReturn) {
            this.rank = 'president';
            this.demotionCount = Math.max(0, this.demotionCount - 1);
            this.addHistory("🎉 با افزایش محبوبیت، دوباره رئیس‌جمهور شدی!");
        }
    }
    
    getRankName(rank) {
        const names = {
            president: "🏛️ رئیس‌جمهور",
            speaker: "🏛️ رئیس مجلس",
            minister: "👤 وزیر",
            mp: "👤 نماینده",
            citizen: "👤 شهروند"
        };
        return names[rank] || rank;
    }
    
    // قابلیت‌های هر مقام
    canDoAction(action) {
        const permissions = {
            president: ["all"],
            speaker: ["domestic", "economy", "parliament", "protest", "negotiate", "trade"],
            minister: ["economy", "domestic", "protest"],
            mp: ["protest", "speech", "domestic"],
            citizen: ["protest", "flee"]
        };
        
        const allowed = permissions[this.rank] || [];
        if (allowed.includes("all")) return { allowed: true };
        if (allowed.includes(action)) return { allowed: true };
        
        return { 
            allowed: false, 
            reasons: [`تو ${this.getRankName(this.rank)} هستی، این کار رو نمی‌تونی بکنی!`] 
        };
    }
    
    // ============================================
    // 📊 اثرات ماهانه
    // ============================================
    monthlyEffects() {
        const oilIncome = this.oil_export * 30 * this.oil_price;
        this.dollar_reserves += oilIncome / 1000;
        
        const monthlyExpense = this.budget_toman / 10;
        this.budget_toman -= monthlyExpense * 0.9;
        
        this.inflation += (Math.random() * 1.5) - 0.3;
        this.inflation = Math.max(5, Math.min(150, this.inflation));
        
        const dollarChange = (Math.random() * 3000) - 1000;
        this.dollar_rate += dollarChange;
        this.dollar_rate = Math.max(50000, Math.min(250000, this.dollar_rate));
        
        const oilChange = (Math.random() * 5) - 2;
        this.oil_price += oilChange;
        this.oil_price = Math.max(25, Math.min(130, this.oil_price));
        
        if (this.inflation > 40) this.popularity -= 3;
        if (this.inflation > 60) this.popularity -= 5;
        if (this.unemployment > 15) this.popularity -= 2;
        if (this.sanctions > 80) this.popularity -= 2;
        if (this.corruption_level > 50) this.popularity -= 1;
        if (this.brain_drain > 5) this.popularity -= 1;
        
        if (Math.random() < 0.2) this.brain_drain += 1;
        if (Math.random() < 0.3) this.corruption_level += 2;
        if (Math.random() < 0.15) this.water_crisis += 3;
        
        this.popularity = Math.max(0, Math.min(100, this.popularity));
        
        if (this.budget_toman < 0) {
            this.budget_toman = 0;
            this.inflation += 10;
            this.dollar_rate += 10000;
            this.addHistory("⚠️ بودجه صفر! چاپ پول اضطراری");
        }
    }
    
    // ============================================
    // 🎲 بحران تصادفی
    // ============================================
    randomCrisis() {
        const crisis = CRISIS_TYPES[Math.floor(Math.random() * CRISIS_TYPES.length)];
        let message = "";
        
        switch(crisis) {
            case "اعتراضات_سراسری": this.popularity -= 15; message = "⚠️ اعتراضات سراسری! -۱۵٪"; break;
            case "حمله_سایبری": this.budget_toman -= 3; this.cyber_attacks_received++; message = "💻 حمله سایبری! -۳ همت"; break;
            case "زلزله": this.budget_toman -= 5; this.popularity -= 5; message = "🌍 زلزله! -۵ همت"; break;
            case "ترور_دانشمند": this.nuclear_percent -= 8; this.popularity -= 5; message = "🎯 ترور دانشمند! -۸٪"; break;
            case "سیل": this.budget_toman -= 3; message = "🌊 سیل! -۳ همت"; break;
            case "کرونا": this.popularity -= 4; this.gdp -= 8; message = "🦠 کرونا! -۸ GDP"; break;
            case "رسوایی_فساد": this.budget_toman -= 3; this.popularity -= 10; message = "💰 رسوایی فساد!"; break;
            case "شورش_قومی": this.popularity -= 8; message = "⚔️ شورش قومی!"; break;
            case "تحریم_جدید": this.sanctions += 12; this.dollar_rate += 8000; message = "🚫 تحریم جدید!"; break;
            case "کشف_نفت": this.oil_production += 0.3; this.budget_toman += 8; message = "🛢️ نفت جدید!"; break;
            case "سقوط_بورس": this.gdp -= 10; this.popularity -= 3; message = "📉 سقوط بورس!"; break;
            case "فرار_مغزها": this.brain_drain += 3; message = "🧠 فرار نخبگان!"; break;
            case "کودتای_نرم": this.popularity -= 8; message = "🕵️ کودتای نرم!"; break;
            case "بحران_آب": this.water_crisis += 10; this.popularity -= 4; message = "💧 بحران آب!"; break;
            default: message = "⚠️ بحران!"; break;
        }
        
        this.history.push(`📅 ${this.year}/${this.month}: ${message}`);
        return message;
    }
    
    periodicCrisis() {
        if (this.inflation > 50) { this.popularity -= 3; this.addHistory("📊 تورم بالای ۵۰٪!"); }
        if (this.dollar_rate > 120000) { this.popularity -= 2; this.inflation += 2; this.addHistory("💵 دلار بالای ۱۲۰,۰۰۰!"); }
        if (this.brain_drain > 8) { this.gdp -= 5; this.addHistory("🧠 فرار مغزها بحرانی!"); }
        if (this.water_crisis > 80) { this.popularity -= 5; this.addHistory("💧 بحران آب اضطرار!"); }
        if (this.corruption_level > 70) { this.budget_toman -= 5; this.popularity -= 4; this.addHistory("💰 فساد سیستمی!"); }
    }
    
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
    // 📊 گزارش
    // ============================================
    getStatusSummary() {
        const monthsInOffice = (this.year - this.termStart.year) * 12 + (this.month - this.termStart.month);
        const remaining = 48 - monthsInOffice;
        const yearsLeft = Math.floor(remaining / 12);
        const monthsLeft = remaining % 12;
        
        let electionLine = "";
        if (this.rank === 'president') {
            electionLine = `\n🗳️ انتخابات: ${yearsLeft} سال و ${monthsLeft} ماه دیگه`;
        }
        
        return `🇮🇷 *${this.getRankName(this.rank)} - ${this.playerName}*
📅 ${this.year}/${this.month} | نوبت: ${this.turn}${electionLine}
📉 تنزل: ${this.demotionCount} بار
━━━━━━━━━━━━━━━━━━
💰 بودجه: ${this.budget_toman.toFixed(0)} همت | ارزی: ${this.dollar_reserves.toFixed(1)}B$
🛢️ نفت: ${this.oil_export}M | 💵 ${this.dollar_rate.toLocaleString()}T
📊 تورم: ${this.inflation.toFixed(1)}٪ | GDP: ${this.gdp}B$ | فساد: ${this.corruption_level}٪
━━━━━━━━━━━━━━━━━━
⚔️ 🚀${this.missiles} 🛸${this.drones} 👥${this.soldiers} | ⚛️${this.nuclear_percent}٪
🔒 تحریم: ${this.sanctions}/100 | ⚔️ تنش: ${this.israel_tension}/100
━━━━━━━━━━━━━━━━━━
👥 ${this.popularity}٪ | 💧${this.water_crisis}٪ | 🧠${this.brain_drain}٪
🏛️ رهبری:${this.leader_approval?'✅':'❌'} | مجلس:${this.parliament_approval?'✅':'❌'}
━━━━━━━━━━━━━━━━━━
${this.game_over ? '💀 *پایان!* /start' : '🎮 ادامه دارد...'}`;
    }
    
    addHistory(text) {
        this.history.push(`📅 ${this.year}/${this.month}: ${text}`);
    }
    
    findCountry(code) {
        return this.countries.find(c => c[2] === code);
    }
    
    getDollarRate() { return this.dollar_rate; }
    getOilPrice() { return this.oil_price; }
    
    canDo(action) {
        const lock = LOCKS[action];
        if (!lock) return this.canDoAction(action);
        
        const reasons = [];
        if (lock.popularity && this.popularity < lock.popularity) reasons.push(`نیاز به محبوبیت ${lock.popularity}٪`);
        if (lock.missiles && this.missiles < lock.missiles) reasons.push(`نیاز به ${lock.missiles} موشک`);
        if (lock.leader && !this.leader_approval) reasons.push("نیاز به تأیید رهبری");
        if (lock.parliament && !this.parliament_approval) reasons.push("نیاز به رأی مجلس");
        if (lock.max_per_year && this.print_money_count >= lock.max_per_year) reasons.push(`حداکثر ${lock.max_per_year} بار`);
        if (lock.cooldown_turns && (this.turn - this.last_war_turn) < lock.cooldown_turns) {
            const remaining = lock.cooldown_turns - (this.turn - this.last_war_turn);
            reasons.push(`باید ${remaining} نوبت صبر کنی`);
        }
        
        return { allowed: reasons.length === 0, reasons };
    }
}

// ============================================
// 💾 ذخیره‌سازی
// ============================================
const players = new Map();

function getPlayer(userId) { return players.get(userId); }
function setPlayer(userId, state) { players.set(userId, state); }
function deletePlayer(userId) { players.delete(userId); }
function playerExists(userId) { return players.has(userId); }

module.exports = { IranState, players, getPlayer, setPlayer, deletePlayer, playerExists };