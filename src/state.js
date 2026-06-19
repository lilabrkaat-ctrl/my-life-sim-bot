class State {
    constructor(n, p) {
        this.name = n;
        this.path = p;
        this.money = 35;
        this.coins = 0;
        this.fame = 10;
        this.city = "بندرعباس";
        this.week = 1;
        this.season = 1;
        this.players = [];
        this.temp = null;
        this.league = "لیگ استان";
        this.history = [];
        this.office = { level: 1, name: "خونه پدری", capacity: 3, staffCapacity: 0, prestige: 1 };
        this.vehicle = { level: 1, name: "پیاده", cities: 1 };
        this.facilities = { level: 1, name: "زمین خاکی", bonus: 1 };
        this.staff = [];
        this.level = 1;
        this.xp = 0;
    }
    title() {
        if (this.path === "agent") {
            let l = "محلی";
            if (this.fame > 80) l = "جهانی";
            else if (this.fame > 60) l = "آسیایی";
            else if (this.fame > 40) l = "ملی";
            else if (this.fame > 20) l = "منطقه‌ای";
            return `👤 ${this.name} - ایجنت ${l}`;
        }
        return `⚽ ${this.name} - باشگاه`;
    }
    sum() {
        return `╭────────────────────╮\n│ 👤 ${this.name}\n│ 📿 ایجنت ${this.league}\n│ 🕌 ${this.city}\n╰────────────────────╯\n💰 ${this.money}M │ ⭐ ${this.fame} │ 👥 ${this.players.length}\n📅 هفته ${this.week} | فصل ${this.season}`;
    }
    addXP(n) { this.xp += n; if (this.xp >= this.level * 100) { this.xp = 0; this.level++; this.fame += 5; return true; } return false; }
}

const db = new Map();
const wait = new Map();
module.exports = { State, db, wait };