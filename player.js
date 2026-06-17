const config = require('./config');

let players = {};
let groups = {};

function getPlayer(userId, groupId, charKey, charData) {
    const key = groupId + '_' + userId;
    
    if (!players[key] && charKey && charData) {
        players[key] = {
            userId,
            groupId,
            character: charKey,
            name: charData.name,
            emoji: charData.emoji,
            power: charData.power,
            popularity: charData.popularity,
            budget: charData.budget,
            special: charData.special,
            wins: 0,
            losses: 0,
            alliances: [],
            sanctions: []
        };
    }
    
    return players[key] || null;
}

function getGroup(groupId) {
    if (!groups[groupId]) {
        groups[groupId] = {
            groupId,
            oil: config.groupResources.oil.start,
            maxOil: config.groupResources.oil.max,
            budget: config.groupResources.budget.start,
            maxBudget: config.groupResources.budget.max,
            popularity: config.groupResources.popularity.start,
            military: config.groupResources.military.start,
            industry: config.groupResources.industry.start
        };
    }
    return groups[groupId];
}

function getAllPlayers(groupId) {
    return Object.values(players).filter(p => p.groupId === groupId);
}

function getAllGroups() {
    return Object.values(groups);
}

module.exports = { getPlayer, getGroup, getAllPlayers, getAllGroups, players, groups };