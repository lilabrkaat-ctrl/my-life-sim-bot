const { PARLIAMENT } = require("./config");

class IranState {
    constructor(name) {
        this.name = name;
        this.budget = 800;
        this.popularity = 38;
        this.corruption = 65;
        this.parliament = JSON.parse(JSON.stringify(PARLIAMENT));
        this.voteNeeded = 146;
        this.boughtVotes = 0;
        this.voteLeakChance = 0;
        this.pendingBill = null;
        this.playerVote = 0;
        this.extraVotes = 0;
        this.history = [];
    }
}

const players = new Map();
function getPlayer(id) { return players.get(id); }
function setPlayer(id, state) { players.set(id, state); }

module.exports = { IranState, getPlayer, setPlayer };