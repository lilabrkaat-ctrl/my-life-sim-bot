const fs = require('fs');
const path = require('path');

const DATA_DIR = path.join(__dirname, 'data');
const PLAYERS_FILE = path.join(DATA_DIR, 'players.json');

// مطمئن شو پوشه data وجود داره
if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
}

function savePlayers(players) {
    try {
        const data = JSON.stringify(players, null, 2);
        fs.writeFileSync(PLAYERS_FILE, data, 'utf8');
        return true;
    } catch (e) {
        console.log('❌ خطا در ذخیره:', e.message);
        return false;
    }
}

function loadPlayers() {
    try {
        if (fs.existsSync(PLAYERS_FILE)) {
            const data = fs.readFileSync(PLAYERS_FILE, 'utf8');
            return JSON.parse(data);
        }
    } catch (e) {
        console.log('❌ خطا در بارگذاری:', e.message);
    }
    return {};
}

// ذخیره خودکار هر ۳۰ ثانیه
function autoSave(players, interval = 30000) {
    setInterval(() => {
        savePlayers(players);
        console.log('💾 اطلاعات ذخیره شد!');
    }, interval);
}

module.exports = { savePlayers, loadPlayers, autoSave };