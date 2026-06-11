const { bot, player, config, mainMenu, locationMenu, sendPhoto, sendAnimation, activeDialogues } = require('./core');
const { getTimeOfDay } = require('../player');
const { gather } = require('../gather');
const { travel } = require('../travel');
const { getDialogue, getNpcConfig } = require('../dialogue');
const { formatDailyQuests, getDailyQuestKeyboard, initDailyQuests } = require('../dailyQuest');
const { initPets } = require('../pet');
const { initChildren, checkBirths, getBirthImage } = require('../offspring');
const { initBlackMarket } = require('../blackMarket');
const { formatSecretChamber, getSecretChamberKeyboard } = require('../secretChamber');
const { showShopMenu } = require('../shop');
const { showCraftMenu, getCraftKeyboard } = require('../craft');
const { formatPrison } = require('../prison');
const { formatHouse } = require('../house');
const { formatEmpire } = require('../empire');

function setupMenuHandlers() {
    // هندلر کانال - پست‌های کانال رو به همه می‌فرسته
    bot.on('channel_post', async (msg) => {
        if (msg.chat.id === -1003035245907) {
            const text = msg.text || msg.caption || '';
            if (text.startsWith('💾')) return;
            for (let chatId in player.players) {
                try {
                    if (msg.photo) await bot.sendPhoto(chatId, msg.photo[msg.photo.length - 1].file_id, { caption: '📢 *بقای باستانی*\n\n' + text, parse_mode: 'Markdown' });
                    else if (msg.video) await bot.sendVideo(chatId, msg.video.file_id, { caption: '📢 *بقای باستانی*\n\n' + text, parse_mode: 'Markdown' });
                    else if (msg.animation) await bot.sendAnimation(chatId, msg.animation.file_id, { caption: '📢 *بقای باستانی*\n\n' + text, parse_mode: 'Markdown' });
                    else if (text) await bot.sendMessage(chatId, '📢 *بقای باستانی*\n\n' + text, { parse_mode: 'Markdown' });
                } catch (e) {}
            }
        }
    });

    // ============ START ============
    bot.onText(/\/start/, async (msg) => {
        const chatId = msg.chat.id;
        const firstName = msg.chat.first_name || 'گمنام';
        if (!player.getPlayer(chatId)) player.createPlayer(chatId, firstName);
        const p = player.getPlayer(chatId);
        player.initAllSystems(p);
        const time = getTimeOfDay(); p.timeOfDay = time;
        if (!p.gameDay) p.gameDay = 1;
        if (!p.inventory.condom) p.inventory.condom = 0;
        player.checkUnlocks(p); p.chatId = chatId;
        initPets(p); initDailyQuests(p); initChildren(p); initBlackMarket(p);
        if (!p.lootBoxes) p.lootBoxes = { wooden: 0, silver: 0, golden: 0, legendary: 0 };
        try { const { initHarem } = require('../queenHarem'); initHarem(p); } catch (e) {}
        try { const { initSecretChamber } = require('../secretChamber'); initSecretChamber(p); } catch (e) {}
        try { const { initEmpire } = require('../empire'); initEmpire(p); } catch (e) {}
        try { const { initPeople } = require('../people'); initPeople(p); } catch (e) {}
        try { const { initCourt } = require('../court'); initCourt(p); } catch (e) {}

        const births = checkBirths(p);
        if (births.length > 0) {
            for (let child of births) {
                const birthImg = getBirthImage();
                if (birthImg) await sendPhoto(chatId, birthImg, `👶 *${child.name}* متولد شد! ${child.emoji}`, mainMenu());
                else await bot.sendMessage(chatId, `👶 *${child.name}* متولد شد! ${child.emoji}`, { parse_mode: 'Markdown' });
            }
        }

        const loc = config.images.locations[p.location] || config.images.locations.village;
        let welcome = `🏛️ *بقای باستانی*\n\n✨ ${p.name} | 📍 ${loc.emoji} ${loc.name}\n${time.name} | 📅 روز ${p.gameDay||1}/۷ | 🏆 ${p.score||0} امتیاز\n\n🐺 *مرحله اول: روستا*\n🎯 گرگ‌ها، مارها و دزدها رو شکار کن!`;
        if (p.unlockedMessage) { welcome += `\n\n${p.unlockedMessage}`; p.unlockedMessage = null; }
        if (p.levelUpMessage) { welcome += `\n\n${p.levelUpMessage}`; p.levelUpMessage = null; }
        await sendPhoto(chatId, loc.file_id, welcome, mainMenu());
    });

    // ============ وضعیت ============
    bot.onText(/^👤 وضعیت$/, async (msg) => {
        const chatId = msg.chat.id; const p = player.getPlayer(chatId);
        if (!p) return bot.sendMessage(chatId, '❌ /start بزن!', mainMenu());
        p.timeOfDay = getTimeOfDay(); if (!p.gameDay) p.gameDay = 1;
        await bot.sendMessage(chatId, player.formatStatus(p), { parse_mode: 'Markdown', ...mainMenu() });
        await bot.sendMessage(chatId, formatDailyQuests(p), { parse_mode: 'Markdown', ...getDailyQuestKeyboard(p) });
    });

    // ============ رتبه‌بندی ============
    bot.onText(/^📊 رتبه‌بندی$/, async (msg) => {
        await bot.sendMessage(msg.chat.id, player.formatLeaderboard(), { parse_mode: 'Markdown', ...mainMenu() });
    });

    // ============ جمع‌آوری ============
    bot.onText(/^🌿 جمع‌آوری$/, async (msg) => {
        const chatId = msg.chat.id; const p = player.getPlayer(chatId);
        if (!p) return bot.sendMessage(chatId, '❌ /start بزن!', mainMenu());
        p.chatId = chatId;
        const result = gather(p);
        player.addScore(p, 5); player.checkUnlocks(p);
        let extra = p.unlockedMessage ? '\n\n' + p.unlockedMessage : '';
        if (p.unlockedMessage) p.unlockedMessage = null;
        if (result.petImage) await sendPhoto(chatId, result.petImage, result.message + extra, mainMenu());
        else if (result.boxImage) await sendPhoto(chatId, result.boxImage, result.message + extra, mainMenu());
        else await bot.sendMessage(chatId, result.message + extra, { parse_mode: 'Markdown', ...mainMenu() });
    });

    // ============ سفر ============
    bot.onText(/^🗺️ سفر$/, async (msg) => {
        const chatId = msg.chat.id; const p = player.getPlayer(chatId);
        if (!p) return bot.sendMessage(chatId, '❌ /start بزن!', mainMenu());
        let mapMsg = '🗺️ *نقشه سفر*\n\n';
        const locReqs = config.locationRequirements || {};
        for (let k in config.images.locations) {
            const loc = config.images.locations[k];
            if (p.unlocked?.locations?.includes(k)) mapMsg += `✅ ${loc.emoji} *${loc.name}*\n   ${loc.description}\n\n`;
            else mapMsg += `🔒 ${loc.emoji} *???*\n   نیاز به *${(locReqs[k]||9999)-p.score}* امتیاز\n\n`;
        }
        mapMsg += '📍 روی نقشه کلیک کن:';
        await bot.sendMessage(chatId, mapMsg, { parse_mode: 'Markdown', ...locationMenu(p) });
    });

    // ============ انتخاب لوکیشن سفر ============
    bot.onText(/^✅ (.+)$/, async (msg, match) => {
        const chatId = msg.chat.id; const p = player.getPlayer(chatId); if (!p) return;
        const parts = match[1].split(' '); const emoji = parts[0]; const name = parts.slice(1).join(' ');
        for (let k in config.images.locations) {
            const loc = config.images.locations[k];
            if (loc.emoji === emoji && loc.name === name) {
                if (!p.unlocked?.locations?.includes(k)) {
                    if ((p.inventory?.key || 0) > 0) { p.inventory.key--; p.unlocked.locations.push(k); return bot.sendMessage(chatId, `🗝️ باز شد! ${loc.emoji} *${loc.name}*`, mainMenu()); }
                    return bot.sendMessage(chatId, `🔒 نیاز به ${(config.locationRequirements[k]||9999)-p.score} امتیاز`, mainMenu());
                }
                const result = travel(p, k); player.addScore(p, 10); player.checkUnlocks(p);
                if (result.ambush) { 
                    const fr = require('../fight').startFight(p); 
                    if (fr.success) { 
                        const { activeBattles } = require('./core'); 
                        activeBattles[chatId] = fr.enemy; 
                        return await sendAnimation(chatId, fr.animation, result.message + '\n' + fr.message, require('../fight').getBattleKeyboard(p, fr.enemy)); 
                    } 
                }
                await bot.sendMessage(chatId, result.message, { parse_mode: 'Markdown' });
                let extra = p.unlockedMessage ? '\n\n' + p.unlockedMessage : ''; if (p.unlockedMessage) p.unlockedMessage = null;
                return bot.sendMessage(chatId, '🏛️ سفر تموم شد!' + extra, { parse_mode: 'Markdown', ...mainMenu() });
            }
        }
    });

    // ============ نبرد ============
    bot.onText(/^⚔️ نبرد$/, async (msg) => {
        const chatId = msg.chat.id; const p = player.getPlayer(chatId);
        if (!p) return bot.sendMessage(chatId, '❌ /start بزن!', mainMenu());
        const fr = require('../fight').startFight(p);
        if (fr.success) {
            const { activeBattles } = require('./core');
            activeBattles[chatId] = fr.enemy;
            if (fr.animation) await sendAnimation(chatId, fr.animation, fr.message, require('../fight').getBattleKeyboard(p, fr.enemy));
            else await bot.sendMessage(chatId, fr.message, { parse_mode: 'Markdown', ...require('../fight').getBattleKeyboard(p, fr.enemy) });
        } else {
            await bot.sendMessage(chatId, fr.message, { parse_mode: 'Markdown', ...mainMenu() });
        }
    });

    // ============ بازار ============
    bot.onText(/^🏪 بازار$/, async (msg) => {
        const chatId = msg.chat.id; const p = player.getPlayer(chatId);
        if (!p) return bot.sendMessage(chatId, '❌ /start بزن!', mainMenu());
        await bot.sendMessage(chatId, showShopMenu(), { parse_mode: 'Markdown', ...mainMenu() });
    });

    // ============ ساخت‌وساز ============
    bot.onText(/^🔨 ساخت‌وساز$/, async (msg) => {
        const chatId = msg.chat.id; const p = player.getPlayer(chatId);
        if (!p) return bot.sendMessage(chatId, '❌ /start بزن!', mainMenu());
        await bot.sendMessage(chatId, showCraftMenu(p), { parse_mode: 'Markdown', ...getCraftKeyboard(p) });
    });

    // ============ زندان ============
    bot.onText(/^🏰 زندان$/, async (msg) => {
        const chatId = msg.chat.id; const p = player.getPlayer(chatId);
        if (!p) return bot.sendMessage(chatId, '❌ /start بزن!', mainMenu());
        await bot.sendMessage(chatId, formatPrison(p), { parse_mode: 'Markdown', ...mainMenu() });
    });

    // ============ خونه ============
    bot.onText(/^🏠 خونه$/, async (msg) => {
        const chatId = msg.chat.id; const p = player.getPlayer(chatId);
        if (!p) return bot.sendMessage(chatId, '❌ /start بزن!', mainMenu());
        await bot.sendMessage(chatId, formatHouse(p), { parse_mode: 'Markdown', ...mainMenu() });
    });

    // ============ امپراطوری ============
    bot.onText(/^👑 امپراطوری$/, async (msg) => {
        const chatId = msg.chat.id; const p = player.getPlayer(chatId);
        if (!p) return bot.sendMessage(chatId, '❌ /start بزن!', mainMenu());
        await bot.sendMessage(chatId, formatEmpire(p), { parse_mode: 'Markdown', ...mainMenu() });
    });

    // ============ مخفی‌گاه ============
    bot.onText(/^🔞 مخفی‌گاه$/, async (msg) => {
        const chatId = msg.chat.id; const p = player.getPlayer(chatId);
        if (!p) return bot.sendMessage(chatId, '❌ /start بزن!', mainMenu());
        if (p.level < 30 && (!p.empire || p.empire.level === 0)) return bot.sendMessage(chatId, '🔒 باید سطح ۳۰ باشی!', mainMenu());
        try { const { initSecretChamber } = require('../secretChamber'); initSecretChamber(p); } catch (e) {}
        await bot.sendMessage(chatId, formatSecretChamber(p), { parse_mode: 'Markdown', ...getSecretChamberKeyboard(p) });
    });
}

module.exports = { setupMenuHandlers };