const fs = require('fs');
const path = require('path');

const DATA_DIR = path.join(__dirname, 'data');
const PLAYERS_FILE = path.join(DATA_DIR, 'players.json');

try {
    if (!fs.existsSync(DATA_DIR)) {
        fs.mkdirSync(DATA_DIR, { recursive: true });
    }
} catch (e) {}

// ذخیره توی کانال تلگرام
let botInstance = null;
const CHANNEL_ID = -1003035245907;
let lastMessageId = null;

function setBot(bot) {
    botInstance = bot;
}

async function saveToChannel(players) {
    if (!botInstance) return false;
    
    try {
        const toSave = {};
        for (let id in players) {
            if (players[id] && (players[id].score > 0 || players[id].level > 1)) {
                toSave[id] = players[id];
            }
        }
        
        const data = JSON.stringify(toSave);
        
        // اگه پیام قبلی هست، ادیتش کن
        if (lastMessageId) {
            try {
                await botInstance.editMessageText('💾 ' + data, {
                    chat_id: CHANNEL_ID,
                    message_id: lastMessageId
                });
                console.log('💾 آپدیت شد توی کانال');
                return true;
            } catch (e) {
                // پیام قبلی پیدا نشد، پیام جدید بفرست
            }
        }
        
        // پیام جدید بفرست
        const msg = await botInstance.sendMessage(CHANNEL_ID, '💾 ' + data);
        lastMessageId = msg.message_id;
        console.log('💾 ذخیره شد توی کانال');
        return true;
        
    } catch (e) {
        console.log('❌ خطا در ذخیره کانال:', e.message);
        return false;
    }
}

async function loadFromChannel() {
    if (!botInstance) return null;
    
    try {
        // آخرین پیام کانال رو بخون
        const updates = await botInstance.getUpdates({ limit: 100 });
        let latestData = null;
        
        for (let update of updates) {
            if (update.channel_post && 
                update.channel_post.chat.id === CHANNEL_ID &&
                update.channel_post.text && 
                update.channel_post.text.startsWith('💾 ')) {
                latestData = update.channel_post.text.substring(3);
                lastMessageId = update.channel_post.message_id;
            }
        }
        
        if (latestData) {
            const players = JSON.parse(latestData);
            console.log('📂 بارگذاری از کانال:', Object.keys(players).length, 'کاربر');
            return players;
        }
    } catch (e) {
        console.log('❌ خطا در بارگذاری از کانال:', e.message);
    }
    return null;
}

function savePlayers(players) {
    try {
        const toSave = {};
        for (let id in players) {
            if (players[id] && (players[id].score > 0 || players[id].level > 1)) {
                toSave[id] = players[id];
            }
        }
        const data = JSON.stringify(toSave, null, 2);
        fs.writeFileSync(PLAYERS_FILE, data, 'utf8');
        console.log('💾 ذخیره فایل:', Object.keys(toSave).length, 'کاربر');
        
        // ذخیره توی کانال هم
        saveToChannel(players);
        
        return true;
    } catch (e) {
        console.log('❌ خطا:', e.message);
        return false;
    }
}

function loadPlayers() {
    try {
        if (fs.existsSync(PLAYERS_FILE)) {
            const data = fs.readFileSync(PLAYERS_FILE, 'utf8');
            const players = JSON.parse(data);
            if (Object.keys(players).length > 0) {
                console.log('📂 بارگذاری فایل:', Object.keys(players).length, 'کاربر');
                return players;
            }
        }
    } catch (e) {
        console.log('❌ خطا:', e.message);
    }
    console.log('📂 شروع جدید');
    return {};
}

function autoSave(players, interval = 60000) {
    setInterval(() => savePlayers(players), interval);
    console.log('⏰ ذخیره خودکار هر', interval/1000, 'ثانیه');
}

module.exports = { savePlayers, loadPlayers, autoSave, setBot, loadFromChannel };