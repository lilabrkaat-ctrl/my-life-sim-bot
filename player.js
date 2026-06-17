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

function getTotalPower(userId) {
    const p = getPlayer(userId);
    let total = 0;
    for (let unit in p.army) {
        if (config.units[unit]) {
            total += p.army[unit] * config.units[unit].power;
        }
    }
    return total + p.defense;
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

function addAlliance(userId, country) {
    const p = getPlayer(userId);
    if (p.alliances.includes(country)) return false;
    p.alliances.push(country);
    return true;
}

function addWar(userId, country) {
    const p = getPlayer(userId);
    if (p.wars.find(w => w.country === country)) return false;
    p.wars.push({ country: country, startedAt: Date.now(), status: 'active' });
    return p.wars;
}

module.exports = {
    createPlayer,
    getPlayer,
    getTotalPower,
    addPrisoner,
    addAlliance,
    addWar,
    players
};