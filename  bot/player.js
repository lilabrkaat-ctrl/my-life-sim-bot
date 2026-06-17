const config = require('./config');

let players = {};

function createPlayer(userId) {
    if (players[userId]) return players[userId];

    players[userId] = {
        userId: userId,
        name: 'امپراطور',
        treasury: 10000,
        oil: 500,
        gold: 100,
        army: {
            soldier: 10,
            sniper: 0,
            drone: 0,
            jet: 0,
            missile: 0,
            robot: 0
        },
        defense: 10,
        wife: { name: 'سارا', mood: 80, influence: 30, followers: 2.5 },
        children: [],
        alliances: [],
        wars: [],
        sanctions: [],
        conquered: [],
        popularity: 70,
        spies: [],
        prisoners: [],
        queens: [],
        level: 1,
        xp: 0
    };

    return players[userId];
}

function getPlayer(userId) {
    if (!players[userId]) return createPlayer(userId);
    return players[userId];
}

function addMoney(userId, amount) {
    const p = getPlayer(userId);
    p.treasury += amount;
    return p.treasury;
}

function addOil(userId, amount) {
    const p = getPlayer(userId);
    p.oil += amount;
    return p.oil;
}

function addGold(userId, amount) {
    const p = getPlayer(userId);
    p.gold += amount;
    return p.gold;
}

function getTotalPower(userId) {
    const p = getPlayer(userId);
    let total = 0;
    const units = config.units;
    for (let unit in p.army) {
        if (units[unit]) {
            total += p.army[unit] * units[unit].power;
        }
    }
    return total + p.defense;
}

function addQueen(userId, name, age) {
    const p = getPlayer(userId);
    if (p.queens && p.queens.length >= 4) return false;
    if (!p.queens) p.queens = [];
    p.queens.push({
        id: Date.now(),
        name: name,
        age: age,
        mood: 80,
        pregnant: false,
        dueDate: null
    });
    return p.queens;
}

function removeQueen(userId, queenId) {
    const p = getPlayer(userId);
    if (!p.queens) return false;
    const index = p.queens.findIndex(q => q.id === queenId);
    if (index === -1) return false;
    p.queens.splice(index, 1);
    return true;
}

function addChild(userId, name, motherId) {
    const p = getPlayer(userId);
    p.children.push({
        id: Date.now(),
        name: name,
        motherId: motherId,
        age: 0,
        education: 0,
        military: 0,
        loyalty: 60,
        ambition: 30,
        career: null
    });
    return p.children;
}

function addPrisoner(userId, name, reason) {
    const p = getPlayer(userId);
    p.prisoners.push({
        id: Date.now(),
        name: name,
        reason: reason,
        capturedAt: Date.now(),
        interrogated: false,
        deathSentence: false,
        resistance: Math.floor(Math.random() * 60) + 20
    });
    return p.prisoners;
}

function addSpy(userId, targetCountry, level) {
    const p = getPlayer(userId);
    const costs = { rookie: 200, pro: 1000, expert: 5000, robot: 10000 };
    const cost = costs[level] || 200;
    if (p.treasury < cost) return { success: false, message: 'پول کافی نداری!' };
    p.treasury -= cost;
    p.spies.push({
        id: Date.now(),
        target: targetCountry,
        level: level,
        sentAt: Date.now(),
        reportReady: Date.now() + 3600000
    });
    return { success: true, message: 'جاسوس فرستاده شد!' };
}

function addAlliance(userId, country) {
    const p = getPlayer(userId);
    if (p.alliances.includes(country)) return false;
    p.alliances.push(country);
    return true;
}

function removeAlliance(userId, country) {
    const p = getPlayer(userId);
    const index = p.alliances.indexOf(country);
    if (index === -1) return false;
    p.alliances.splice(index, 1);
    return true;
}

function addWar(userId, country) {
    const p = getPlayer(userId);
    if (p.wars.find(w => w.country === country)) return false;
    p.wars.push({
        country: country,
        startedAt: Date.now(),
        status: 'active'
    });
    return p.wars;
}

function getStats(userId) {
    const p = getPlayer(userId);
    return {
        name: p.name,
        treasury: p.treasury,
        oil: p.oil,
        gold: p.gold,
        army: p.army,
        totalPower: getTotalPower(userId),
        defense: p.defense,
        queens: p.queens ? p.queens.length : 0,
        children: p.children.length,
        prisoners: p.prisoners.length,
        spies: p.spies.length,
        alliances: p.alliances.length,
        wars: p.wars.length,
        popularity: p.popularity,
        level: p.level,
        conquered: p.conquered.length,
        sanctions: p.sanctions.length
    };
}

module.exports = {
    createPlayer,
    getPlayer,
    addMoney,
    addOil,
    addGold,
    getTotalPower,
    addQueen,
    removeQueen,
    addChild,
    addPrisoner,
    addSpy,
    addAlliance,
    removeAlliance,
    addWar,
    getStats,
    players
};