// src/state.js

class State {
    constructor(n, p) {
        this.name = n;
        this.path = p;
        this.money = 500;
        this.coins = 0;
        this.fame = 10;
        this.city = "هرمزگان";
        this.week = 1;
        this.season = 1;
        this.players = [];
        this.temp = null;
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
        return `${this.title()}\n📍 ${this.city} | ⭐ ${this.fame}\n💰 ${this.money}M | 📅 هفته ${this.week}\n👥 ${this.players.length} بازیکن`;
    }
}

const db = new Map();
const wait = new Map();
module.exports = { State, db, wait };