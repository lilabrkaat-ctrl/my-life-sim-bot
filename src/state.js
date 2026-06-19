class State {
    constructor(n, p) { this.name = n; this.path = p; this.money = 500; this.fame = 10; this.week = 1; this.players = []; }
    sum() { return `👤 ${this.name}\n💰 ${this.money}M | ⭐ ${this.fame}\n👥 ${this.players.length} بازیکن`; }
}

const db = new Map();
const wait = new Map();

module.exports = { State, db, wait };