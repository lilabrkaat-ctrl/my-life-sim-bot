const { bot } = require('./core');
const { setupMenuHandlers } = require('./menuHandlers');
const { setupChamberHandlers } = require('./chamberHandlers');

// راه‌اندازی همه هندلرها
setupMenuHandlers();
setupChamberHandlers();

// message handler برای ادمین
const { isAdmin, adminCommand, adminState, mainMenu } = require('./core');
const { player } = require('./core');
const { getShopState, processAmount } = require('../shop');
const { cancelShop } = require('../shop');

// ============ هندلر دکمه برگشت ============
bot.onText(/^🔙 برگشت$/, async (msg) => {
    const chatId = msg.chat.id;
    const p = player.getPlayer(chatId);
    if (!p) return bot.sendMessage(chatId, '❌ /start بزن!', mainMenu());
    
    // پاک کردن state ها
    const { adminState, chamberState, empireState, peopleState, courtState, haremState, shopState } = require('./core');
    if (adminState[chatId]) delete adminState[chatId];
    
    // برگشت به منوی اصلی
    const config = require('../config');
    const { getTimeOfDay } = require('../player');
    const time = getTimeOfDay();
    p.timeOfDay = time;
    const loc = config.images.locations[p.location] || config.images.locations.village;
    let welcome = `🏛️ *بقای باستانی*\n\n✨ ${p.name} | 📍 ${loc.emoji} ${loc.name}\n${time.name} | 📅 روز ${p.gameDay||1}/۷ | 🏆 ${p.score||0} امتیاز`;
    await bot.sendMessage(chatId, welcome, { parse_mode: 'Markdown', ...mainMenu() });
});

bot.on('message', (msg) => {
    const chatId = msg.chat.id;
    const text = msg.text;
    if (!text || text.startsWith('/')) return;

    if (isAdmin(chatId)) {
        const p = player.getPlayer(chatId);
        if (!p) return; p.chatId = chatId;

        if (adminState[chatId] && adminState[chatId].step === 'amount') {
            const amount = parseInt(text);
            if (isNaN(amount) || amount <= 0) { bot.sendMessage(chatId, '❌ یه عدد معتبر وارد کن!', mainMenu()); return; }
            const state = adminState[chatId];
            const target = player.getPlayer(state.targetId);
            if (!target) { delete adminState[chatId]; bot.sendMessage(chatId, '❌ کاربر دیگه آنلاین نیست!', mainMenu()); return; }
            target.inventory[state.item] = (target.inventory[state.item] || 0) + amount;
            bot.sendMessage(chatId, `🎁 *هدیه فرستاده شد!*\n👤 ${target.name}\n🎒 ${state.item}: +${amount}`, { parse_mode: 'Markdown', ...mainMenu() });
            delete adminState[chatId]; return;
        }

        const args = text.split(' '); const cmd = args.shift().toLowerCase();
        const adminCommands = ['gold','g','xp','exp','score','sc','heal','hp','item','give','attack','atk','defense','def','level','lvl','energy','en','day','setday','nextday','nd','resetday','rd','condom','cd','unlock','max','maxall','god','pet','addpet','removepet','petfood','box','addbox','openbox','boxes','quest','newquest','completequest','child','addchild','heir','setheir','killchild','tournament','pregnant','birth','addqueen','removequeen','queencare','queensalary','promotequeen','empirelevel','dynasty','income','wonder','population','food','water','building','stats','blackmarket','prison','gift','sendgift','info','whois','users','count','top','resetuser','ru','ban','unban','announce','ann','save','reset','help','addnpc','addprison','addhouse','addhome','removenpc','removeprison','removehouse','removehome','setrelation','setrel','marrynow','forcemarry'];

        if (adminCommands.includes(cmd)) {
            const result = adminCommand(p, cmd, args);
            if (result.announceAll && result.announce) {
                const announceMsg = `📢 *اعلان ادمین:*\n\n${result.announce}`;
                for (let id in player.players) { try { bot.sendMessage(id, announceMsg, { parse_mode: 'Markdown' }); } catch (e) {} }
                bot.sendMessage(chatId, `✅ پیام به همه ارسال شد!`, { parse_mode: 'Markdown', ...mainMenu() });
                return;
            }
            bot.sendMessage(chatId, result.message, { parse_mode: 'Markdown', ...mainMenu() }); return;
        }
        return;
    }

    // 🔙 برگشت رو از لیست prefixها حذف کردم
    const prefixes = ['🪵','🪨','🍖','💧','🦴','⛏️','📤','🏪','💎','💀','👤','🌿','🗺️','⚔️','🔨','📜','⚡','✅','❌','📊','🏰','🏠','🔒','🖐️','💋','🔥','🔓','🏃','💍','👰','🚪','🎵','🧿','🩸','🔮','🐾','🍼','📦','🎁','👶','👑','💰','🕶️','🛒','🤝','📚','🌾','🏗️','🐍','📋','🏛️','👸','👩','👦','🎲','🍷','🗡️','💊','🛏️','🧹','⏰','💍','👗','🤰','💆','🍑','👄','🎈'];
    
    for (let prefix of prefixes) { if (text.startsWith(prefix)) return; }

    const p = player.getPlayer(chatId);
    if (!p) return; p.chatId = chatId;
    const state = getShopState(p);
    if (!state) return;
    const result = processAmount(p, text);
    if (result.message) bot.sendMessage(chatId, result.message, { parse_mode: 'Markdown', ...mainMenu() });
});

bot.on('polling_error', (e) => console.log('Polling error:', e.message));
console.log('✅ ربات بقای باستانی - نسخه ماژولار آماده شد! 🎉👑🔥');