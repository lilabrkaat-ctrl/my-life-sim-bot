// state.js - وضعیت بازیکن (کامل)

const { INITIAL, COUNTRIES, CRISES, TERM_DURATION, PARLIAMENT, VOTE_NEEDED } = require('./config');

class IranState {
    constructor(name) {
        // اطلاعات پایه
        this.name = name;
        this.year = 1405;
        this.month = 1;
        this.turn = 0;
        
        // کپی از مقادیر اولیه
        Object.assign(this, JSON.parse(JSON.stringify(INITIAL)));
        
        // کشورها (کپی عمیق)
        this.countries = COUNTRIES.map(c => ({...c}));
        
        // مجلس
        this.parliament = {
            principlists: { name: "اصولگرا", count: 190, basePrice: 3, corruption: 0.3, warSupport: 0.6, economySupport: 0.3 },
            reformists: { name: "اصلاح‌طلب", count: 35, basePrice: 5, corruption: 0.9, warSupport: 0.2, economySupport: 0.8 },
            independents: { name: "مستقل", count: 65, basePrice: 2, corruption: 0.7, warSupport: 0.4, economySupport: 0.5 }
        };
        this.voteNeeded = VOTE_NEEDED;
        this.boughtVotes = 0;
        this.voteLeakChance = 0;
        
        // نیابتی‌ها
        this.proxies = [
            { name: "حزب‌الله", emoji: "🇱🇧", forces: 80000, missiles: 100000, drones: 3000, active: true, exposed: false, level: 3 },
            { name: "انصارالله", emoji: "🇾🇪", forces: 150000, missiles: 7000, drones: 3000, active: true, exposed: false, level: 2 },
            { name: "حشد شعبی", emoji: "🇮🇶", forces: 100000, missiles: 3000, drones: 700, active: true, exposed: false, level: 2 }
        ];
        
        // سیستم انتخابات و تنزل
        this.rank = "president"; // president, speaker, minister, mp, citizen
        this.termMonths = 0;
        this.demotionCount = 0;
        this.lastElection = { year: 1405, month: 1 };
        
        // وضعیت
        this.gameOver = false;
        this.history = [];
        this.lastAction = "";
    }
    
    // نام مقام
    getRankName() {
        const names = {
            president: "🏛️ رئیس‌جمهور",
            speaker: "🏛️ رئیس مجلس",
            minister: "👤 وزیر",
            mp: "👤 نماینده",
            citizen: "👤 شهروند"
        };
        return names[this.rank] || this.rank;
    }
    
    // چک کردن قابلیت‌ها بر اساس مقام
    canDo(action) {
        const permissions = {
            president: ["all"],
            speaker: ["domestic", "parliament", "economy", "imports", "exports", "negotiate"],
            minister: ["economy", "domestic", "imports", "exports"],
            mp: ["parliament", "domestic"],
            citizen: ["protest"]
        };
        
        if (permissions[this.rank].includes("all")) return { allowed: true };
        if (permissions[this.rank].includes(action)) return { allowed: true };
        
        return { allowed: false, reason: `شما ${this.getRankName()} هستید و نمی‌توانید این کار را انجام دهید!` };
    }
    
    // خلاصه وضعیت
    getSummary() {
        const remaining = TERM_DURATION - this.termMonths;
        let s = `🇮🇷 *${this.getRankName()}*\n`;
        s += `👤 ${this.name}\n`;
        s += `📅 ${this.year}/${this.month} | نوبت ${this.turn}\n`;
        
        if (this.rank === "president") {
            s += `🗳️ ${Math.floor(remaining / 12)} سال و ${remaining % 12} ماه تا انتخابات\n`;
        }
        
        s += `📉 تنزل: ${this.demotionCount} بار\n`;
        s += `━━━━━━━━━━━━\n`;
        s += `💰 بودجه: ${this.budget.toFixed(0)} همت\n`;
        s += `💵 دلار: ${this.dollarRate.toLocaleString()} تومان\n`;
        s += `💲 ارزی: ${this.dollar.toFixed(1)} میلیارد دلار\n`;
        s += `📊 تورم: ${this.inflation.toFixed(1)}٪\n`;
        s += `👥 محبوبیت: ${this.popularity}٪\n`;
        s += `⚔️ 🚀${this.missiles} 🛸${this.drones} 👥${this.soldiers}\n`;
        s += `⚛️ غنی‌سازی: ${this.nuclear}٪\n`;
        s += `🔒 تحریم: ${this.sanctions}/100 | ⚔️ تنش: ${this.tension}/100\n`;
        s += `💧 آب: ${this.water}٪ | 💰 فساد: ${this.corruption}٪ | 🧠 فرار: ${this.brain}٪\n`;
        s += `━━━━━━━━━━━━\n`;
        s += this.gameOver ? '💀 *پایان* /start' : '🎮 ادامه دارد...';
        return s;
    }
    
    // ============================================
    // 📅 گذر زمان
    // ============================================
    nextMonth() {
        this.turn++;
        this.month++;
        this.termMonths++;
        this.boughtVotes = 0;
        this.voteLeakChance = 0;
        
        if (this.month > 12) {
            this.month = 1;
            this.year++;
        }
        
        // درآمد نفت
        const oilIncome = this.oil * 30 * this.oilPrice / 1000;
        this.dollar += oilIncome;
        
        // هزینه‌های جاری
        this.budget -= this.budget * 0.07;
        
        // تورم
        this.inflation += (Math.random() * 2) - 0.5;
        this.inflation = Math.max(5, Math.min(150, this.inflation));
        
        // دلار
        this.dollarRate += (Math.random() * 5000) - 2000;
        this.dollarRate = Math.max(50000, Math.min(250000, this.dollarRate));
        
        // نفت
        this.oilPrice += (Math.random() * 5) - 2;
        this.oilPrice = Math.max(25, Math.min(130, this.oilPrice));
        
        // محبوبیت بر اساس شرایط
        if (this.inflation > 50) this.popularity -= 3;
        if (this.inflation > 70) this.popularity -= 2;
        if (this.sanctions > 80) this.popularity -= 2;
        if (this.corruption > 50) this.popularity -= 1;
        if (this.water > 70) this.popularity -= 1;
        if (this.brain > 8) this.popularity -= 1;
        
        this.popularity = Math.max(0, Math.min(100, this.popularity));
        
        // بحران تصادفی (۳۰٪ شانس)
        if (Math.random() < 0.30) {
            this.triggerRandomCrisis();
        }
        
        // بودجه منفی = چاپ پول اضطراری
        if (this.budget < 0) {
            this.budget = 0;
            this.inflation += 10;
            this.dollarRate += 10000;
            this.history.push("⚠️ بودجه صفر شد! چاپ پول اضطراری (تورم +۱۰٪)");
        }
        
        // انتخابات
        if (this.rank === "president" && this.termMonths >= TERM_DURATION) {
            this.runElection();
        }
        
        // تنزل مقام
        this.checkDemotion();
        
        // باخت واقعی
        if (this.rank === "citizen" && this.popularity <= 3 && this.budget <= 0) {
            this.gameOver = true;
            this.history.push("💀 به پایین‌ترین نقطه رسیدی. پایان بازی.");
        }
        
        return this.getSummary();
    }
    
    // ============================================
    // 🎲 بحران تصادفی
    // ============================================
    triggerRandomCrisis() {
        const totalChance = CRISES.reduce((s, c) => s + c.chance, 0);
        let r = Math.random() * totalChance;
        
        for (const crisis of CRISES) {
            r -= crisis.chance;
            if (r <= 0) {
                if (crisis.pop) this.popularity += crisis.pop;
                if (crisis.budget) this.budget += crisis.budget;
                if (crisis.sanctions) this.sanctions = Math.min(100, this.sanctions + crisis.sanctions);
                if (crisis.nuclear) this.nuclear = Math.max(3.67, this.nuclear + crisis.nuclear);
                if (crisis.corruption) this.corruption = Math.min(100, this.corruption + crisis.corruption);
                if (crisis.gdp) this.gdp += crisis.gdp;
                if (crisis.brain) this.brain += crisis.brain;
                if (crisis.water) this.water = Math.min(100, this.water + crisis.water);
                this.history.push(`📅 ${this.year}/${this.month}: ${crisis.msg}`);
                break;
            }
        }
    }
    
    // ============================================
    // 🗳️ انتخابات
    // ============================================
    runElection() {
        const opponents = ["احمدی‌نژاد", "ظریف", "جلیلی", "قالیباف", "پزشکیان", "لاریجانی"];
        const opponent = opponents[Math.floor(Math.random() * opponents.length)];
        const opponentPop = Math.floor(Math.random() * 30) + 30;
        
        if (this.popularity > opponentPop) {
            // برنده
            this.termMonths = 0;
            this.popularity += 5;
            this.lastElection = { year: this.year, month: this.month };
            this.history.push(`🎉 انتخابات رو بردی! (${this.popularity}٪) - رقیب: ${opponent} ${opponentPop}٪`);
        } else {
            // بازنده
            this.rank = "speaker";
            this.demotionCount++;
            this.termMonths = 0;
            this.popularity += 8;
            this.lastElection = { year: this.year, month: this.month };
            this.history.push(`📉 باختی! ${opponent} (${opponentPop}٪) رئیس‌جمهور شد. تو ${this.getRankName()} شدی`);
        }
    }
    
    // ============================================
    // 📉 سیستم تنزل و ارتقا
    // ============================================
    checkDemotion() {
        if (this.rank === "president") return;
        
        // تنزل
        if (this.popularity <= 5 && this.rank === "speaker") {
            this.rank = "minister";
            this.demotionCount++;
            this.popularity += 8;
            this.history.push(`📉 از ریاست مجلس برکنار شدی. حالا ${this.getRankName()} هستی`);
        } else if (this.popularity <= 4 && this.rank === "minister") {
            this.rank = "mp";
            this.demotionCount++;
            this.popularity += 6;
            this.history.push(`📉 استیضاح شدی. حالا ${this.getRankName()} هستی`);
        } else if (this.popularity <= 3 && this.rank === "mp") {
            this.rank = "citizen";
            this.demotionCount++;
            this.popularity += 10;
            this.history.push(`📉 رد صلاحیت شدی. حالا ${this.getRankName()} هستی`);
        }
        
        // ارتقا
        if (this.popularity > 50 && this.rank === "speaker" && this.termMonths >= 24) {
            this.rank = "president";
            this.termMonths = 0;
            this.demotionCount = Math.max(0, this.demotionCount - 1);
            this.history.push("🎉 بازگشت تاریخی! دوباره رئیس‌جمهور شدی!");
        } else if (this.popularity > 40 && this.rank === "minister") {
            this.rank = "speaker";
            this.popularity += 5;
            this.history.push("🎉 ارتقا به رئیس مجلس!");
        } else if (this.popularity > 30 && this.rank === "mp") {
            this.rank = "minister";
            this.popularity += 3;
            this.history.push("🎉 ارتقا به وزیر!");
        } else if (this.popularity > 25 && this.rank === "citizen") {
            this.rank = "mp";
            this.popularity += 5;
            this.history.push("🎉 دوباره نماینده مجلس شدی!");
        }
    }
    
    // ============================================
    // 🏛️ رأی‌گیری مجلس
    // ============================================
    runVote(topic) {
        let totalSupport = 0;
        const factions = ['principlists', 'reformists', 'independents'];
        const details = {};
        
        for (const faction of factions) {
            const f = this.parliament[faction];
            let baseSupport;
            
            if (topic === 'war') {
                baseSupport = f.count * f.warSupport;
            } else if (topic === 'economy') {
                baseSupport = f.count * f.economySupport;
            } else {
                baseSupport = f.count * 0.5;
            }
            
            // اضافه کردن رأی‌های خریده شده
            const boughtEffect = this.boughtVotes * (f.count / 290);
            baseSupport += boughtEffect;
            
            // random
            const randomEffect = (Math.random() * f.count * 0.2) - (f.count * 0.1);
            baseSupport += randomEffect;
            
            const finalSupport = Math.floor(Math.max(0, Math.min(f.count, baseSupport)));
            details[faction] = { support: finalSupport, oppose: f.count - finalSupport };
            totalSupport += finalSupport;
        }
        
        return {
            support: totalSupport,
            needed: this.voteNeeded,
            passed: totalSupport >= this.voteNeeded,
            details: details
        };
    }
    
    // ============================================
    // 💰 خرید رأی
    // ============================================
    buyVote(faction, count) {
        const f = this.parliament[faction];
        if (!f) return { success: false, msg: "جناح نامعتبر!" };
        
        const totalCost = f.basePrice * count;
        if (this.budget < totalCost) {
            return { success: false, msg: `❌ بودجه کم! نیاز: ${totalCost} همت` };
        }
        
        this.budget -= totalCost;
        
        let bought = 0;
        for (let i = 0; i < count; i++) {
            if (Math.random() < f.corruption) {
                bought++;
            }
        }
        
        this.boughtVotes += bought;
        this.voteLeakChance = Math.min(100, this.voteLeakChance + (bought * 2));
        this.corruption = Math.min(100, this.corruption + bought);
        
        return {
            success: true,
            bought: bought,
            cost: totalCost,
            totalBought: this.boughtVotes,
            leakChance: this.voteLeakChance
        };
    }
    
    // ============================================
    // 🌍 پیدا کردن کشور
    // ============================================
    findCountry(code) {
        return this.countries.find(c => c.code === code);
    }
    
    // ============================================
    // 📦 واردات
    // ============================================
    importGoods(itemKey) {
        const item = PRICES[itemKey];
        if (!item) return { success: false, msg: "کالا نامعتبر!" };
        
        if (this.dollar < item.dollar / 1_000_000_000) {
            return { success: false, msg: `❌ دلار کم! نیاز: ${(item.dollar / 1_000_000).toFixed(1)} میلیون دلار` };
        }
        
        this.dollar -= item.dollar / 1_000_000_000;
        
        switch(itemKey) {
            case 'wheat': this.inflation -= 2; this.popularity += 1; break;
            case 'medicine': this.popularity += 5; break;
            case 'technology': this.gdp += 10; this.brain -= 1; break;
            case 'sukhoi': this.missiles += 20; this.drones += 10; break;
            case 's400': this.missiles += 15; break;
            case 'oilEquipment': this.oil += 0.3; break;
        }
        
        this.history.push(`📦 واردات: ${item.emoji} ${item.name} (${(item.dollar / 1_000_000).toFixed(1)}M$)`);
        return { success: true, msg: `✅ ${item.emoji} ${item.name} وارد شد!` };
    }
    
    // ============================================
    // 🛢️ صادرات
    // ============================================
    exportGoods(itemKey) {
        const item = EXPORTS[itemKey];
        if (!item) return { success: false, msg: "کالا نامعتبر!" };
        
        const income = item.price / 1_000_000_000;
        this.dollar += income;
        
        if (item.sanctions > 0) {
            this.sanctions = Math.min(100, this.sanctions + item.sanctions);
        }
        
        this.history.push(`🛢️ صادرات: ${item.emoji} ${item.name} (+${income.toFixed(1)} میلیارد دلار)`);
        return { success: true, msg: `✅ ${item.emoji} ${item.name} صادر شد!\n💰 +${income.toFixed(1)} میلیارد دلار\n⚠️ تحریم +${item.sanctions}` };
    }
}

// ============================================
// 💾 ذخیره‌سازی بازیکنان
// ============================================
const players = new Map();
function getPlayer(id) { return players.get(id); }
function setPlayer(id, state) { players.set(id, state); }

module.exports = { IranState, getPlayer, setPlayer };