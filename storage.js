const fs = require('fs');
const path = require('path');

const DATA_DIR = path.join(__dirname, 'data');
let botInstance = null;
const ADMIN_ID = 5576592239;
const CHANNEL_ID = -1003035245907;

try {
    if (!fs.existsSync(DATA_DIR)) {
        fs.mkdirSync(DATA_DIR, { recursive: true });
    }
} catch (e) {}

function setBot(bot) { botInstance = bot; }

async function saveToChannel(data) {
    if (!botInstance) return false;
    try {
        await botInstance.sendMessage(CHANNEL_ID, '💾 ' + JSON.stringify(data));
        return true;
    } catch (e) { return false; }
}

async function loadFromChannel() {
    if (!botInstance) return null;
    try {
        const updates = await botInstance.getUpdates({ limit: 100 });
        let latestData = null;
        for (let update of updates) {
            if (update.channel_post && update.channel_post.text && update.channel_post.text.startsWith('💾 ')) {
                latestData = update.channel_post.text.substring(3);
            }
        }
        if (latestData) return JSON.parse(latestData);
    } catch (e) {}
    return null;
}

function saveToFile(filename, data) {
    try {
        fs.writeFileSync(path.join(DATA_DIR, filename), JSON.stringify(data, null, 2));
        return true;
    } catch (e) { return false; }
}

function loadFromFile(filename) {
    try {
        const filePath = path.join(DATA_DIR, filename);
        if (fs.existsSync(filePath)) return JSON.parse(fs.readFileSync(filePath));
    } catch (e) {}
    return null;
}

async function saveAll(players, groups) {
    const data = { players, groups, lastSave: Date.now() };
    saveToFile('players.json', players);
    saveToFile('groups.json', groups);
    await saveToChannel(data);
}

async function loadAll() {
    const channelData = await loadFromChannel();
    if (channelData) return channelData;
    const players = loadFromFile('players.json') || {};
    const groups = loadFromFile('groups.json') || {};
    return { players, groups };
}

function autoSave(players, groups, interval = 21600000) {
    setInterval(() => saveAll(players, groups), interval);
}

module.exports = { setBot, saveAll, loadAll, autoSave, ADMIN_ID, CHANNEL_ID };