const { LEAGUES } = require("./config");

class GameState {
    constructor(name, path) {
        this.name = name;
        this.path = path; // "agent" یا "club"
        this.money = 500;
        this.coins = 0;
        this.fame = 10;
        this.city = "هرمزگان";
        this.week = 1;
        this.season = 1;
        this.history = [];
        
        // ایجنت
        this.players = [];
        
        // باشگاه
        this.clubName = "";
        this.leagueIndex = 0; // ۰ = لیگ استان
        this.teamPlayers = [];
        this.stadium = 5000;
        this.fans = 2500;
        this.points = 0;
        this.gamesPlayed = 0;
    }
    
    getLeague() {
        return LEAGUES[this.leagueIndex];
    }
    
    getTitle() {
        if (this.path === "agent") {
            let level = "محلی";
            if (this.fame > 80) level = "جهانی";
            else if (this.fame > 60) level = "آسیایی";
            else if (this.fame > 40) level = "ملی";
            else if (this.fame > 20) level = "منطقه‌ای";
            return `👤 ${this.name} - ایجنت ${level}`;
        } else {
            return `⚽ ${this.clubName || "باشگاه"} - ${this.getLeague().name}`;
        }
    }
    
    getSummary() {
        let s = `${this.getTitle()}\n📍 ${this.city} | ⭐ شهرت: ${this.fame}\n`;
        s += `💰 ${this.money}M | 🎯 ${this.coins} سکه\n`;
        s += `📅 هفته ${this.week} | فصل ${this.season}\n`;
        if (this.path === "agent") {
            s += `👥 بازیکن: ${this.players.length} نفر\n`;
        } else {
            s += `🏟️ ${this.stadium.toLocaleString()} نفر | 👥 هوادار: ${this.fans.toLocaleString()}\n`;
            s += `⚽ بازیکن: ${this.teamPlayers.length} | 📊 ${this.points} امتیاز\n`;
        }
        return s;
    }
}

const players = new Map();
function getPlayer(id) { return players.get(id); }
function setPlayer(id, state) { players.set(id, state); }

module.exports = { GameState, getPlayer, setPlayer };