const { LEAGUES } = require("./config");

class GameState {
    constructor(name, path) {
        this.name = name;
        this.path = path;
        this.money = 500;
        this.coins = 0;
        this.fame = 10;
        this.city = "هرمزگان";
        this.week = 1;
        this.season = 1;
        this.players = [];
        this.tempPlayers = null;
        this.clubName = "";
        this.leagueIndex = 0;
        this.teamPlayers = [];
        this.stadium = 5000;
        this.fans = 2500;
        this.points = 0;
    }
    
    getLeague() {
        if (LEAGUES && LEAGUES[this.leagueIndex]) {
            return LEAGUES[this.leagueIndex];
        }
        return { name: "لیگ استان", teams: 8, income: 50, cost: 20, level: 1, minStar: 2, maxStar: 4, minAbility: 1, maxAbility: 3 };
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
        let s = `${this.getTitle()}\n📍 ${this.city} | ⭐ ${this.fame || 0}\n`;
        s += `💰 ${this.money || 0}M | 🎯 ${this.coins || 0} سکه\n`;
        s += `📅 هفته ${this.week || 1} | فصل ${this.season || 1}\n`;
        if (this.path === "agent") {
            s += `👥 بازیکن: ${this.players ? this.players.length : 0} نفر`;
        } else {
            s += `🏟️ ${(this.stadium || 5000).toLocaleString()} | 👥 ${(this.fans || 2500).toLocaleString()}`;
        }
        return s;
    }
}

const players = new Map();
function getPlayer(id) { return players.get(id); }
function setPlayer(id, state) { players.set(id, state); }

module.exports = { GameState, getPlayer, setPlayer };