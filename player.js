const config = require('./config');

let players = {};

function createPlayer(userId) {
    if (players[userId]) return players[userId];
    
    players[userId] = {
        userId: userId,
        name: 'امپراطور',
        treasury: 10000, // دلار
        oil: 500, // بشکه
        gold: 100, // کیلو
        army: {
            soldier: 10,
            sniper: 0,
            drone: 0,
            jet: 0,
            missile: 0,
            robot: 0
        },
        defense: 10,
        queens: [],
        children: [],
        ministers: {},
        prisoners: [],
        spies: [],
        alliances: [],
        wars: [],
        sanctions: [],
        popularity: 70, // درصد
        level: 1,
        xp: 0,
        conquered: []
    };
    
    return players[userId];
}

function getPlayer(userId) {
    if (!players[userId]) {
        return createPlayer(userId);
    }
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

function addArmy(userId, unit, count) {
    const p = getPlayer(userId);
    if (!p.army[unit]) return false;
    p.army[unit] += count;
    return p.army[unit];
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
    if (p.queens.length >= 4) return false;
    
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
        interrogated: false
    });
    return p.prisoners;
}

function addSpy(userId, targetCountry, spyLevel) {
    const p = getPlayer(userId);
    const cost = spyLevel === 'expert' ? 1000 : spyLevel === 'pro' ? 500 : 100;
    
    if (p.treasury < cost) return { success: false, message: 'پول کافی نداری!' };
    
    p.treasury -= cost;
    p.spies.push({
        id: Date.now(),
        target: targetCountry,
        level: spyLevel,
        sentAt: Date.now(),
        reportReady: Date.now() + 3600000 // ۱ ساعت
    });
    
    return { success: true, message: 'جاسوس فرستاده شد! تا ۱ ساعت دیگه خبر میده.' };
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
        queens: p.queens.length,
        children: p.children.length,
        prisoners: p.prisoners.length,
        spies: p.spies.length,
        alliances: p.alliances.length,
        wars: p.wars.length,
        popularity: p.popularity,
        level: p.level,
        conquered: p.conquered.length
    };
}

module.exports = {
    createPlayer,
    getPlayer,
    addMoney,
    addOil,
    addGold,
    addArmy,
    getTotalPower,
    addQueen,
    removeQueen,
    addChild,
    addPrisoner,
    addSpy,
    addAlliance,
    removeAlliance,
    addWar,
    getStats
};