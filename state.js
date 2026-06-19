const { COUNTRIES, PARLIAMENT, VOTE_NEEDED } = require("./config");

class IranState {
    constructor(name) {
        this.name = name;
        this.budget = 800;
        this.popularity = 38;
        this.corruption = 65;
        this.missiles = 300;
        this.drones = 1200;
        this.sanctions = 88;
        this.internet = false;
        this.dollarRate = 100000;
        this.inflation = 48;
        this.water = 70;
        this.brain = 5;
        this.gdp = 350;
        this.tension = 85;
        
        this.countries = COUNTRIES.map(c => ({...c}));
        this.parliament = JSON.parse(JSON.stringify(PARLIAMENT));
        this.voteNeeded = VOTE_NEEDED;
        this.boughtVotes = 0;
        this.voteLeakChance = 0;
        this.pendingBill = null;
        this.playerVote = 0;
        this.extraVotes = 0;
        this.history = [];
    }
    
    findCountry(code) {
        return this.countries.find(c => c.code === code);
    }
}

const players = new Map();
function getPlayer(id) { return players.get(id); }
function setPlayer(id, state) { players.set(id, state); }

module.exports = { IranState, getPlayer, setPlayer };