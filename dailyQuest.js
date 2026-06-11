const config = require('./config');

// عکس‌های ماموریت
const questImages = {
    mission_icon: 'AgACAgQAAxkBAAEqVG1qJuy_jjCgUCRenY4hI0lmm3NjVQACZw9rG0FkMFFw2hiQK43shAEAAwIAA3gAAzsE',
    reward_gif: 'AgACAgQAAxkBAAEqVGxqJuy_9582RPbpB65-Ik1bKzhbywACZg9rG0FkMFHcgjPbJHM74AEAAwIAA3gAAzsE'
};

// انواع ماموریت‌ها
const questTypes = {
    hunt_wolf: {
        name: 'شکار گرگ', description: '۵ تا گرگ شکار کن', emoji: '🐺',
        target: 'wolf', targetCount: 5, type: 'hunt',
        rewards: { xp: 30, gold: 20, energy: 10 }, difficulty: 'easy'
    },
    hunt_snake: {
        name: 'شکار مار', description: '۴ تا مار شکار کن', emoji: '🐍',
        target: 'snake', targetCount: 4, type: 'hunt',
        rewards: { xp: 25, gold: 15, energy: 8 }, difficulty: 'easy'
    },
    hunt_bear: {
        name: 'شکار خرس', description: '۳ تا خرس شکار کن', emoji: '🐻',
        target: 'bear', targetCount: 3, type: 'hunt',
        rewards: { xp: 50, gold: 40, energy: 15 }, difficulty: 'medium'
    },
    hunt_dragon: {
        name: 'شکار اژدها', description: '۱ اژدها شکار کن', emoji: '🐉',
        target: 'dragon', targetCount: 1, type: 'hunt',
        rewards: { xp: 100, gold: 80, finisher: 2 }, difficulty: 'hard'
    },
    gather_wood: {
        name: 'جمع‌آوری چوب', description: '۱۵ چوب جمع کن', emoji: '🪵',
        target: 'wood', targetCount: 15, type: 'gather',
        rewards: { xp: 20, gold: 10, energy: 5 }, difficulty: 'easy'
    },
    gather_stone: {
        name: 'جمع‌آوری سنگ', description: '۱۲ سنگ جمع کن', emoji: '🪨',
        target: 'stone', targetCount: 12, type: 'gather',
        rewards: { xp: 20, gold: 10, energy: 5 }, difficulty: 'easy'
    },
    gather_iron: {
        name: 'جمع‌آوری آهن', description: '۸ آهن جمع کن', emoji: '⛏️',
        target: 'iron', targetCount: 8, type: 'gather',
        rewards: { xp: 35, gold: 25, key: 1 }, difficulty: 'medium'
    },
    travel_forest: {
        name: 'سفر به جنگل', description: '۳ بار به جنگل سفر کن', emoji: '🌲',
        target: 'forest', targetCount: 3, type: 'travel',
        rewards: { xp: 25, gold: 15, energy: 10 }, difficulty: 'easy'
    },
    travel_mountain: {
        name: 'سفر به کوهستان', description: '۲ بار به کوهستان سفر کن', emoji: '⛰️',
        target: 'mountain', targetCount: 2, type: 'travel',
        rewards: { xp: 30, gold: 20, energy: 12 }, difficulty: 'medium'
    },
    travel_cave: {
        name: 'سفر به غار', description: '۲ بار به غار سفر کن', emoji: '🕳️',
        target: 'cave', targetCount: 2, type: 'travel',
        rewards: { xp: 40, gold: 30, spell: 1 }, difficulty: 'medium'
    },
    travel_desert: {
        name: 'سفر به بیابان', description: '۱ بار به بیابان سفر کن', emoji: '🏜️',
        target: 'desert', targetCount: 1, type: 'travel',
        rewards: { xp: 60, gold: 50, wish: 1 }, difficulty: 'hard'
    },
    defeat_enemies: {
        name: 'نابودی دشمنان', description: '۱۰ دشمن از هر نوع شکست بده', emoji: '⚔️',
        target: 'any', targetCount: 10, type: 'defeat',
        rewards: { xp: 50, gold: 40, finisher: 1 }, difficulty: 'medium'
    },
    craft_item: {
        name: 'ساخت‌وساز', description: '۳ آیتم جدید بساز', emoji: '🔨',
        target: 'any_craft', targetCount: 3, type: 'craft',
        rewards: { xp: 40, gold: 30, energy: 20 }, difficulty: 'medium'
    }
};

function initDailyQuests(player) {
    if (!player.dailyQuests) {
        player.dailyQuests = {
            quests: [], completed: [], lastReset: Date.now(), progress: {}
        };
    }
    const now = Date.now();
    const oneDay = 24 * 60 * 60 * 1000;
    if (now - player.dailyQuests.lastReset > oneDay) {
        player.dailyQuests.quests = [];
        player.dailyQuests.completed = [];
        player.dailyQuests.lastReset = now;
        player.dailyQuests.progress = {};
    }
    if (!player.dailyQuests.quests || player.dailyQuests.quests.length === 0) {
        generateDailyQuests(player);
    }
    return player.dailyQuests;
}

function generateDailyQuests(player) {
    const questKeys = Object.keys(questTypes);
    const selectedQuests = [];
    const usedKeys = [];
    while (selectedQuests.length < 3 && usedKeys.length < questKeys.length) {
        const randomKey = questKeys[Math.floor(Math.random() * questKeys.length)];
        if (!usedKeys.includes(randomKey)) {
            usedKeys.push(randomKey);
            selectedQuests.push(randomKey);
        }
    }
    player.dailyQuests.quests = selectedQuests.map(key => ({
        key, progress: 0, completed: false, claimed: false
    }));
    player.dailyQuests.progress = {};
    for (let quest of player.dailyQuests.quests) {
        player.dailyQuests.progress[quest.key] = 0;
    }
    return player.dailyQuests;
}

function updateQuestProgress(player, action, target) {
    if (!player.dailyQuests || !player.dailyQuests.quests) return null;
    let updated = false;
    for (let quest of player.dailyQuests.quests) {
        if (quest.completed || quest.claimed) continue;
        const questData = questTypes[quest.key];
        if (!questData) continue;
        let shouldUpdate = false;
        if (questData.type === 'hunt' && action === 'hunt' && target === questData.target) shouldUpdate = true;
        else if (questData.type === 'gather' && action === 'gather' && target === questData.target) shouldUpdate = true;
        else if (questData.type === 'travel' && action === 'travel' && target === questData.target) shouldUpdate = true;
        else if (questData.type === 'defeat' && action === 'defeat') shouldUpdate = true;
        else if (questData.type === 'craft' && action === 'craft') shouldUpdate = true;
        if (shouldUpdate) {
            quest.progress++;
            player.dailyQuests.progress[quest.key] = quest.progress;
            if (quest.progress >= questData.targetCount) {
                quest.completed = true;
                updated = true;
            }
        }
    }
    if (updated) return checkCompletedQuests(player);
    return null;
}

function checkCompletedQuests(player) {
    if (!player.dailyQuests || !player.dailyQuests.quests) return [];
    const completed = [];
    for (let quest of player.dailyQuests.quests) {
        if (quest.completed && !quest.claimed) completed.push(quest);
    }
    return completed;
}

function claimQuestReward(player, questKey) {
    if (!player.dailyQuests || !player.dailyQuests.quests) return { success: false, message: '❌ ماموریتی وجود نداره!' };
    const quest = player.dailyQuests.quests.find(q => q.key === questKey);
    if (!quest) return { success: false, message: '❌ این ماموریت پیدا نشد!' };
    if (!quest.completed) return { success: false, message: '❌ این ماموریت هنوز کامل نشده!' };
    if (quest.claimed) return { success: false, message: '❌ جایزه این ماموریت رو قبلاً گرفتی!' };
    const questData = questTypes[questKey];
    if (!questData) return { success: false, message: '❌ اطلاعات ماموریت پیدا نشد!' };

    const rewards = questData.rewards;
    let rewardMsg = '';
    if (rewards.xp) { player.xp = (player.xp || 0) + rewards.xp; rewardMsg += `\n✨ +${rewards.xp} XP`; }
    if (rewards.gold) { player.inventory.gold = (player.inventory.gold || 0) + rewards.gold; rewardMsg += `\n👑 +${rewards.gold} طلا`; }
    if (rewards.energy) { player.energy = Math.min((player.maxEnergy || 100), (player.energy || 0) + rewards.energy); rewardMsg += `\n⚡ +${rewards.energy} انرژی`; }
    if (rewards.key) { player.inventory.key = (player.inventory.key || 0) + rewards.key; rewardMsg += `\n🗝️ +${rewards.key} کلید`; }
    if (rewards.spell) { player.inventory.spell = (player.inventory.spell || 0) + rewards.spell; rewardMsg += `\n📜 +${rewards.spell} طلسم`; }
    if (rewards.wish) { player.inventory.wish = (player.inventory.wish || 0) + rewards.wish; rewardMsg += `\n🔮 +${rewards.wish} آرزو`; }
    if (rewards.finisher) { player.inventory.finisher = (player.inventory.finisher || 0) + rewards.finisher; rewardMsg += `\n💀 +${rewards.finisher} فنیشر`; }

    quest.claimed = true;
    const leveledUp = require('./player').checkLevelUp(player);
    if (leveledUp) { rewardMsg += '\n⬆️ لول آپ!'; if (player.levelUpMessage) { rewardMsg += '\n' + player.levelUpMessage; player.levelUpMessage = null; } }

    return { success: true, message: `✅ *${questData.name}* کامل شد!\n🎁 جایزه:${rewardMsg}`, image: questImages.reward_gif };
}

function formatDailyQuests(player) {
    if (!player.dailyQuests || !player.dailyQuests.quests || player.dailyQuests.quests.length === 0) initDailyQuests(player);
    let msg = '📋 *ماموریت‌های روزانه*\n\n';
    const now = Date.now();
    const oneDay = 24 * 60 * 60 * 1000;
    const timeLeft = player.dailyQuests.lastReset + oneDay - now;
    const hoursLeft = Math.floor(timeLeft / (60 * 60 * 1000));
    const minutesLeft = Math.floor((timeLeft % (60 * 60 * 1000)) / (60 * 1000));
    msg += `⏰ ${hoursLeft} ساعت و ${minutesLeft} دقیقه تا ریست\n\n`;
    let allCompleted = true;
    for (let i = 0; i < player.dailyQuests.quests.length; i++) {
        const quest = player.dailyQuests.quests[i];
        const questData = questTypes[quest.key];
        if (!questData) continue;
        let status;
        if (quest.claimed) { status = '✅'; player.dailyQuests.progress[quest.key] = questData.targetCount; }
        else if (quest.completed) { status = '🎁'; allCompleted = false; }
        else { status = '⏳'; allCompleted = false; }
        msg += `${status} ${questData.emoji} *${questData.name}*\n   📝 ${questData.description}\n   📊 پیشرفت: ${player.dailyQuests.progress[quest.key] || 0}/${questData.targetCount}\n`;
        if (quest.completed && !quest.claimed) msg += `   🎁 آماده دریافت جایزه!\n`;
        msg += '\n';
    }
    if (allCompleted) { msg += '🎉 *همه ماموریت‌های امروز انجام شد!*\n🔄 فردا ماموریت‌های جدید...'; }
    return msg;
}

// =============================================
// 📋 کیبورد شیشه‌ای
// =============================================
function getDailyQuestKeyboard(player) {
    const buttons = [];
    if (player.dailyQuests && player.dailyQuests.quests) {
        for (let quest of player.dailyQuests.quests) {
            if (quest.completed && !quest.claimed) {
                const questData = questTypes[quest.key];
                if (questData) {
                    buttons.push([{ text: `🎁 دریافت جایزه ${questData.emoji} ${questData.name}`, callback_data: `quest_claim_${quest.key}` }]);
                }
            }
        }
    }
    buttons.push([{ text: '🔙 برگشت', callback_data: 'back_to_main' }]);
    return { reply_markup: { inline_keyboard: buttons } };
}

function getQuestCompletionMessage(player) {
    const completed = checkCompletedQuests(player);
    if (completed.length > 0) {
        const questData = questTypes[completed[0].key];
        if (questData) return `🎉 *ماموریت تکمیل شد!*\n${questData.emoji} ${questData.name}\n📋 برو توی وضعیت جایزه‌ات رو بگیر!`;
    }
    return null;
}

module.exports = {
    questTypes, questImages,
    initDailyQuests, generateDailyQuests, updateQuestProgress,
    checkCompletedQuests, claimQuestReward,
    formatDailyQuests, getDailyQuestKeyboard, getQuestCompletionMessage
};