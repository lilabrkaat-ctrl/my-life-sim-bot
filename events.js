const config = require('./config');

function triggerRandomEvent(player, action) {
    const events = config.images.events;
    
    // events وجود نداشته باشه، crash نکنه
    if (!events) return null;
    
    const roll = Math.random();
    let result = null;

    if (action === 'gather') {
        if (roll < 0.05 && events.treasure) {
            result = { 
                message: '💰 *گنج پنهان پیدا کردی!* +۱۰👑', 
                image: events.treasure.file_id 
            };
            player.inventory.gold += 10;
        } else if (roll < 0.15 && events.beehive) {
            result = { 
                message: '🍯 *کندوی عسل!* +۳🍖', 
                image: events.beehive.file_id 
            };
            player.inventory.meat += 3;
        } else if (roll < 0.25 && events.snake_event) {
            player.hp = Math.max(1, player.hp - 10);
            result = { 
                message: '🐍 *مار گزیدت!* -۱۰❤️', 
                image: events.snake_event.file_id 
            };
        } else if (roll < 0.35 && events.rainbow) {
            player.hp = Math.min(player.maxHp, player.hp + 15);
            result = { 
                message: '🌈 *رنگین‌کمان!* +۱۵❤️', 
                image: events.rainbow.file_id 
            };
        } else if (roll < 0.40 && events.fire) {
            player.hp = Math.max(1, player.hp - 5);
            result = { 
                message: '🔥 *آتش گرفتی!* -۵❤️', 
                image: events.fire.file_id 
            };
        }
    }

    if (action === 'travel') {
        if (roll < 0.10) {
            result = { 
                message: '🧙 *پیر فرزانه* بهت غذا داد! +۵🍖',
                image: config.images.npcs?.sage?.file_id || null
            };
            player.inventory.meat += 5;
        } else if (roll < 0.20 && events.treasure) {
            player.inventory.gold += 10;
            result = { 
                message: '💰 *کیسه طلا پیدا کردی!* +۱۰👑', 
                image: events.treasure.file_id 
            };
        } else if (roll < 0.30) {
            player.hp = Math.max(1, player.hp - 15);
            result = { message: '🤕 *افتادی!* -۱۵❤️' };
        } else if (roll < 0.40 && config.images.npcs?.wizard) {
            player.attack += 5;
            result = { 
                message: '🧙‍♂️ *جادوگر* ظاهر شد! +۵⚔️', 
                image: config.images.npcs.wizard.file_id 
            };
        } else if (roll < 0.45 && config.images.npcs?.jester) {
            player.hp = Math.min(player.maxHp, player.hp + 10);
            result = { 
                message: '🎭 *دلقک* شوخی کرد! +۱۰❤️', 
                image: config.images.npcs.jester.file_id 
            };
        } else if (roll < 0.50 && config.images.npcs?.knight) {
            result = { 
                message: '⚔️ *شوالیه* به مبارزه طلبید! (نبرد شروع شد)',
                image: config.images.npcs.knight.file_id 
            };
        } else if (roll < 0.60 && events.eagle) {
            result = { 
                message: '🦅 *عقاب* از آسمون پیداش شد!',
                image: events.eagle.file_id 
            };
        }
    }

    if (action === 'fight') {
        if (roll < 0.08 && events.eagle) {
            result = { 
                message: '🦅 *عقاب به کمکت اومد!* +۱۰⚔️ این راند', 
                image: events.eagle.file_id 
            };
            player.attack += 10;
            setTimeout(() => { player.attack -= 10; }, 5000);
        } else if (roll < 0.15) {
            player.hp = Math.min(player.maxHp, player.hp + 20);
            result = { message: '💪 *آدرنالین!* +۲۰❤️' };
        }
    }

    if (result) {
        result.eventTriggered = true;
    }

    return result;
}

module.exports = { triggerRandomEvent };