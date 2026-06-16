const config = require('./config');

const childImages = {
    warrior_boy: 'AgACAgQAAxkBAAEqca9qKX_a6hIKV4aP4GR7mJGeFCk26wACKA9rG9N3UVHWHTEQ01mNGwEAAwIAA3gAAzsE',
    training_boy: 'AgACAgQAAxkBAAEqcbBqKX_a1uF1y1F5HeXLzH8JRlHL3wACKQ9rG9N3UVEms2PPGpklgQEAAwIAA3gAAzsE',
    training_boy2: 'AgACAgQAAxkBAAEqcbFqKX_a7wTOP_0zKCmCMwU79DhZWgACKg9rG9N3UVFTbf5DVV0PdgEAAwIAA3gAAzsE',
    baby_girl: 'AgACAgQAAxkBAAEqcbNqKX_aPouI3MVHtsL-KOTKr05RgwACLA9rG9N3UVEtSl-CPTnOMwEAAwIAA3gAAzsE',
    breastfeeding: 'AgACAgQAAxkBAAEqcbJqKX_auYUEfkinCZ60Yld4IxX-6QACKw9rG9N3UVH-MTWpNIKb7AEAAwIAA3gAAzsE',
    pregnant_queen: 'AgACAgQAAxkBAAEqcbZqKX_a4-_MtgzDxMBujjPA5ajaUQACLg9rG9N3UVHiWwABA5CaoVABAAMCAAN4AAM7BA',
    baby_girl2: 'AgACAgQAAxkBAAEqcbVqKX_anxYsFafIuvDav0gfl2OTEAACLQ9rG9N3UVESJ8H4V23R3AEAAwIAA3gAAzsE',
    fetus: 'AgACAgQAAxkBAAEqcbpqKX_aBguV2lXQDto9JUYtDj9IYgACMA9rG9N3UVE90e0hFo4W_wEAAwIAA3gAAzsE',
    pregnant_queen2: 'AgACAgQAAxkBAAEqcbhqKX_a3_hckqFHx6laLWuFHTKhHQACLw9rG9N3UVEx5s_CVaUYHQEAAwIAA3gAAzsE',
    pregnant_woman: 'AgACAgQAAxkBAAEqcbtqKX_aM-MBVbXASWtHss-IvIHahQACMQ9rG9N3UVFZhM7A2L3PPAEAAwIAA3gAAzsE',
    warrior_girl: 'AgACAgQAAxkBAAEqccxqKX_0by2nHY9NXknSjer0ueKyzwACJQ9rG9N3UVGjPfigMFqwvwEAAwIAA3gAAzsE',
    desert_girl: 'AgACAgQAAxkBAAEqcc5qKX_0GCoi8ggPl7GDe4_9yTurmgACJg9rG9N3UVE6bJA9qC6ptwEAAwIAA3gAAzsE',
    studying: 'AgACAgQAAxkBAAEqcdBqKX_0u6OWK9_Fg0RhvQLd8gXqFAACJw9rG9N3UVHzW7dRAAGHirwBAAMCAAN4AAM7BA'
};

const maleNames = ['کوروش', 'داریوش', 'خشایار', 'اردشیر', 'بهرام', 'شاپور', 'انوشیروان', 'قباد', 'هرمز', 'جمشید', 'فریدون', 'سام', 'نریمان', 'رستم', 'سهراب', 'اسفندیار', 'آرش', 'کاوه', 'بابک', 'مازیار'];
const femaleNames = ['آتنا', 'آناهیتا', 'آرتمیس', 'رکسانا', 'پانته‌آ', 'هلن', 'کلئوپاترا', 'سمیرامیس', 'شهرزاد', 'پریسا', 'سارا', 'ماندانا', 'آتوسا', 'پروانه', 'شیرین', 'مریم', 'نگین', 'آوا', 'کتایون', 'گردآفرید'];

const childClasses = {
    warrior: { name: 'جنگجو', emoji: '⚔️', type: 'attack', bonus: 15 },
    mage: { name: 'جادوگر', emoji: '🧙', type: 'magic', bonus: 15 },
    guardian: { name: 'محافظ', emoji: '🛡️', type: 'defense', bonus: 15 },
    hunter: { name: 'شکارچی', emoji: '🏹', type: 'hunt', bonus: 15 },
    sage: { name: 'حکیم', emoji: '📜', type: 'xp', bonus: 10 },
    prince: { name: 'شاهزاده', emoji: '👑', type: 'all', bonus: 20 }
};

function initChildren(player) {
    if (!player.children) player.children = [];
    if (!player.pregnancies) player.pregnancies = [];
    if (!player.childSlots) player.childSlots = 3;
    return player.children;
}

function getRandomName(gender) {
    const names = gender === 'male' ? maleNames : femaleNames;
    return names[Math.floor(Math.random() * names.length)];
}

function getRandomGender() { return Math.random() < 0.5 ? 'male' : 'female'; }

function getRandomClass() {
    const classes = ['warrior', 'warrior', 'warrior', 'mage', 'guardian', 'guardian', 'hunter', 'hunter', 'sage', 'prince'];
    return classes[Math.floor(Math.random() * classes.length)];
}

function feedChild(player, childId) {
    initChildren(player);
    const child = player.children.find(c => c.id === childId);
    if (!child || !child.isAlive) {
        console.log(`❌ feedChild: فرزند ${childId} پیدا نشد یا مرده`);
        return { success: false, message: '❌ این فرزند پیدا نشد!' };
    }
    if ((player.energy || 0) < 5) {
        console.log(`❌ feedChild: انرژی کم - نیاز:۵ | موجود:${player.energy}`);
        return { success: false, message: '❌ انرژی کافی نداری! (نیاز: ۵⚡)' };
    }
    
    player.energy -= 5;
    child.xp = (child.xp || 0) + 10;
    child.loyalty = Math.min(100, (child.loyalty || 50) + 2);
    
    console.log(`✅ feedChild: ${child.name} غذا خورد - XP:${child.xp} | انرژی:${player.energy}`);
    
    return { success: true, message: `🍼 ${child.emoji} *${child.name}* غذا خورد!\n✨ +۱۰ XP\n💕 وفاداری: ${child.loyalty}` };
}

function trainChild(player, childId) {
    initChildren(player);
    const child = player.children.find(c => c.id === childId);
    if (!child || !child.isAlive) {
        console.log(`❌ trainChild: فرزند ${childId} پیدا نشد`);
        return { success: false, message: '❌ این فرزند پیدا نشد!' };
    }
    if (child.ageStage === 'baby') {
        console.log(`❌ trainChild: ${child.name} هنوز نوزاده`);
        return { success: false, message: '❌ بچه هنوز نوزاده!' };
    }
    if ((player.inventory?.gold || 0) < 20) {
        console.log(`❌ trainChild: طلا کم - نیاز:۲۰ | موجود:${player.inventory?.gold}`);
        return { success: false, message: '❌ طلا کافی نداری! (نیاز: ۲۰👑)' };
    }
    
    player.inventory.gold -= 20;
    child.xp = (child.xp || 0) + 20;
    child.attack = (child.attack || 1) + Math.floor(Math.random() * 3) + 1;
    child.defense = (child.defense || 1) + Math.floor(Math.random() * 2) + 1;
    child.loyalty = Math.min(100, (child.loyalty || 50) + 5);
    
    console.log(`✅ trainChild: ${child.name} آموزش دید - XP:${child.xp}`);
    
    return { success: true, message: `📚 ${child.emoji} *${child.name}* آموزش دید!\n⚔️ حمله: ${child.attack}\n🛡️ دفاع: ${child.defense}\n✨ +۲۰ XP` };
}

function assignHeir(player, childId) {
    initChildren(player);
    const child = player.children.find(c => c.id === childId);
    if (!child || !child.isAlive) {
        console.log(`❌ assignHeir: فرزند ${childId} پیدا نشد`);
        return { success: false, message: '❌ این فرزند پیدا نشد!' };
    }
    
    player.children.forEach(c => c.isHeir = false);
    child.isHeir = true;
    child.loyalty = Math.min(100, (child.loyalty || 50) + 20);
    
    console.log(`✅ assignHeir: ${child.name} ولیعهد شد`);
    
    return { success: true, message: `👑 ${child.emoji} *${child.name}* ولیعهد امپراطوری شد!\n💕 وفاداری: ${child.loyalty}` };
}

function holdTournament(player) {
    initChildren(player);
    const fighters = player.children.filter(c => c.isAlive && c.ageStage !== 'baby');
    
    if (fighters.length < 2) {
        console.log(`❌ holdTournament: فقط ${fighters.length} مبارز`);
        return { success: false, message: '❌ حداقل ۲ فرزند بالغ لازمه!' };
    }
    
    const winner = fighters[Math.floor(Math.random() * fighters.length)];
    winner.xp = (winner.xp || 0) + 50;
    winner.power = (winner.power || 10) + 10;
    
    assignHeir(player, winner.id);
    
    console.log(`✅ holdTournament: ${winner.name} برنده شد`);
    
    return { success: true, message: `⚔️🏆 *تورنمنت امپراطوری!*\n\n👑 *${winner.emoji} ${winner.name}* برنده شد!\n💪 +۱۰ قدرت\n✨ +۵۰ XP\n👑 ولیعهد جدید!` };
}

function formatChildren(player) {
    initChildren(player);
    
    if (!player.children || player.children.length === 0) {
        return '👶 *فرزندان*\n\n❌ هیچ فرزندی نداری!\n💡 ازدواج کن و از جلو عیاشی کن تا بچه‌دار بشی.';
    }
    
    const alive = player.children.filter(c => c.isAlive);
    
    let msg = '👶 *فرزندان امپراطوری*\n\n';
    for (let child of alive) {
        msg += `${child.emoji} *${child.name}*`;
        if (child.isHeir) msg += ' 👑';
        msg += ` | ${child.classEmoji || '👶'} ${child.className || 'نوزاد'}\n`;
        msg += `   🎂 ${child.age || 0} روزه | ${child.stageEmoji || '👶'} ${child.ageStage || 'baby'}\n`;
        msg += `   ⚔️ ${child.attack || 0} | 🛡️ ${child.defense || 0}\n`;
        msg += `   ✨ XP: ${child.xp || 0} | 💕 وفاداری: ${child.loyalty || 50}%\n\n`;
    }
    
    msg += `👥 ${alive.length}/${player.childSlots || 3} فرزند زنده`;
    return msg;
}

function getChildrenKeyboard(player) {
    const buttons = [];
    
    if (player.children && player.children.length > 0) {
        const alive = player.children.filter(c => c.isAlive);
        
        for (let child of alive) {
            buttons.push([{ text: `🍼 غذا بده به ${child.emoji} ${child.name}`, callback_data: `child_feed_${child.id}` }]);
            buttons.push([{ text: `📚 آموزش بده به ${child.emoji} ${child.name}`, callback_data: `child_train_${child.id}` }]);
        }
        
        if (alive.length >= 2) {
            buttons.push([{ text: '⚔️ تورنمنت امپراطوری', callback_data: 'child_tournament' }]);
        }
        
        for (let child of alive) {
            if (!child.isHeir && child.ageStage !== 'baby') {
                buttons.push([{ text: `👑 ولیعهد کن ${child.emoji} ${child.name}`, callback_data: `child_heir_${child.id}` }]);
            }
        }
    }
    
    buttons.push([{ text: '🔙 برگشت', callback_data: 'empire_back' }]);
    
    return { reply_markup: { inline_keyboard: buttons } };
}

module.exports = {
    initChildren, getRandomName, getRandomGender, getRandomClass,
    feedChild, trainChild, assignHeir, holdTournament,
    formatChildren, getChildrenKeyboard
};