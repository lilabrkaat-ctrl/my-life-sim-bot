const config = require('./config');

// عکس‌های حیوانات
const petImages = {
    wolf_cub: 'AgACAgQAAxkBAAEqVHRqJuzAGFCIY8ekPgMZOEYb2Oq0zQACbg9rG0FkMFGgWfb2kXhRzgEAAwIAA3gAAzsE',
    wolf_alpha: 'AgACAgQAAxkBAAEqVHRqJuzAGFCIY8ekPgMZOEYb2Oq0zQACbg9rG0FkMFGgWfb2kXhRzgEAAwIAA3gAAzsE',
    wolf_spirit: 'AgACAgQAAxkBAAEqVHZqJuzAow0s4ObDTv73L1w4gKxHdwACbw9rG0FkMFGJwCrJON9JaAEAAwIAA3gAAzsE',
    dragon_egg: 'AgACAgQAAxkBAAEqVHhqJuzAJ6J3W1TIWXdDHh48dW7f2QACcA9rG0FkMFGy1USWkRYRfwEAAwIAA3gAAzsE',
    dragon_fire: 'AgACAgQAAxkBAAEqVHhqJuzAJ6J3W1TIWXdDHh48dW7f2QACcA9rG0FkMFGy1USWkRYRfwEAAwIAA3gAAzsE',
    dragon_ancient: 'AgACAgQAAxkBAAEqVHhqJuzAJ6J3W1TIWXdDHh48dW7f2QACcA9rG0FkMFGy1USWkRYRfwEAAwIAA3gAAzsE',
    wolf_egg: 'AgACAgQAAxkBAAEqVHlqJuzAej3kgmC_jzrcc-PpcQ7EwgACcQ9rG0FkMFHCYpAH-HLsxgEAAwIAA3gAAzsE',
    dragon_egg_img: 'AgACAgQAAxkBAAEqVHlqJuzAej3kgmC_jzrcc-PpcQ7EwgACcQ9rG0FkMFHCYpAH-HLsxgEAAwIAA3gAAzsE'
};

// انواع حیوانات خانگی
const petTypes = {
    wolf_cub: { 
        name: 'توله گرگ', emoji: '🐺', eggEmoji: '🥚', 
        attackBonus: 5, defenseBonus: 0, hpBonus: 10, 
        rarity: 'common', evolveLevel: 10, evolveTo: 'wolf_alpha', 
        foodCost: 3, evolveMessage: '🐺 توله گرگت تبدیل به گرگ آلفا شد! 🎉',
        image: petImages.wolf_cub,
        eggImage: petImages.wolf_egg
    },
    wolf_alpha: { 
        name: 'گرگ آلفا', emoji: '🐺', eggEmoji: null, 
        attackBonus: 15, defenseBonus: 5, hpBonus: 30, 
        rarity: 'rare', evolveLevel: 25, evolveTo: 'wolf_spirit', 
        foodCost: 5, evolveMessage: '👻🐺 گرگ آلفات تبدیل به روح گرگ شد! 🌙',
        image: petImages.wolf_alpha
    },
    wolf_spirit: { 
        name: 'روح گرگ', emoji: '👻🐺', eggEmoji: null, 
        attackBonus: 30, defenseBonus: 15, hpBonus: 60, 
        rarity: 'legendary', evolveLevel: null, evolveTo: null, 
        foodCost: 8, evolveMessage: null,
        image: petImages.wolf_spirit
    },
    dragon_egg: { 
        name: 'بچه اژدها', emoji: '🐉', eggEmoji: '🥚🔥', 
        attackBonus: 8, defenseBonus: 3, hpBonus: 20, 
        rarity: 'rare', evolveLevel: 15, evolveTo: 'dragon_fire', 
        foodCost: 5, evolveMessage: '🐉🔥 بچه اژدهایت تبدیل به اژدهای آتشین شد! 🔥',
        image: petImages.dragon_egg,
        eggImage: petImages.dragon_egg_img
    },
    dragon_fire: { 
        name: 'اژدهای آتشین', emoji: '🐉🔥', eggEmoji: null, 
        attackBonus: 25, defenseBonus: 10, hpBonus: 50, 
        rarity: 'epic', evolveLevel: 30, evolveTo: 'dragon_ancient', 
        foodCost: 8, evolveMessage: '🐉💀 اژدهای آتشینت تبدیل به اژدهای باستانی شد! 👑',
        image: petImages.dragon_fire
    },
    dragon_ancient: { 
        name: 'اژدهای باستانی', emoji: '🐉💀', eggEmoji: null, 
        attackBonus: 50, defenseBonus: 25, hpBonus: 100, 
        rarity: 'legendary', evolveLevel: null, evolveTo: null, 
        foodCost: 12, evolveMessage: null,
        image: petImages.dragon_ancient
    }
};

const eggTypes = ['wolf_cub', 'dragon_egg'];

function initPets(player) {
    if (!player.pets) player.pets = [];
    if (!player.petFood) player.petFood = 0;
    return player.pets;
}

function findEgg(player) {
    initPets(player);
    if (player.pets.length >= 3) return null;
    const r = Math.random();
    if (r < 0.10) {
        const eggType = eggTypes[Math.floor(Math.random() * eggTypes.length)];
        const pet = petTypes[eggType];
        const newPet = {
            id: Date.now().toString() + Math.random().toString(36).substr(2, 5),
            type: eggType, name: pet.name, emoji: pet.emoji,
            image: pet.image, eggImage: pet.eggImage,
            level: 1, xp: 0, xpNeeded: 20,
            attackBonus: pet.attackBonus, defenseBonus: pet.defenseBonus,
            hpBonus: pet.hpBonus, rarity: pet.rarity,
            evolveLevel: pet.evolveLevel, evolveTo: pet.evolveTo,
            foodCost: pet.foodCost, evolveMessage: pet.evolveMessage,
            foundAt: Date.now()
        };
        return newPet;
    }
    return null;
}

function addPet(player, petData) {
    initPets(player);
    if (player.pets.length >= 3) return { success: false, message: '🐾 ظرفیت حیوون‌ها پره! (حداکثر ۳)' };
    player.pets.push(petData);
    player.maxHp = (player.maxHp || 100) + petData.hpBonus;
    player.attack = (player.attack || 5) + petData.attackBonus;
    player.defense = (player.defense || 2) + petData.defenseBonus;
    return { 
        success: true, 
        message: `🎉 ${petData.emoji} *${petData.name}* به جمعت پیوست!\n❤️ +${petData.hpBonus} | ⚔️ +${petData.attackBonus} | 🛡️ +${petData.defenseBonus}`,
        image: petData.eggImage || petData.image
    };
}

function feedPet(player, petId) {
    initPets(player);
    const pet = player.pets.find(p => p.id === petId);
    if (!pet) return { success: false, message: '❌ این حیوون پیدا نشد!' };
    if ((player.energy || 0) < pet.foodCost) return { success: false, message: `❌ انرژی کافی نداری!\n⚡ نیاز: ${pet.foodCost} | ⚡ داری: ${player.energy || 0}` };

    player.energy -= pet.foodCost;
    const xpGain = pet.foodCost * 2;
    pet.xp = (pet.xp || 0) + xpGain;
    player.petFood = (player.petFood || 0) + 1;

    let message = `${pet.emoji} *${pet.name}* غذا خورد!\n⚡ -${pet.foodCost} انرژی\n✨ +${xpGain} تجربه\n📊 ${pet.xp}/${pet.xpNeeded} XP`;
    let image = pet.image;

    if (pet.xp >= pet.xpNeeded) {
        pet.level++;
        pet.xp -= pet.xpNeeded;
        pet.xpNeeded = Math.floor(pet.xpNeeded * 1.5);
        pet.attackBonus += Math.floor(pet.attackBonus * 0.2);
        pet.defenseBonus += Math.floor(pet.defenseBonus * 0.2);
        pet.hpBonus += Math.floor(pet.hpBonus * 0.2);
        player.attack += Math.floor(pet.attackBonus * 0.2);
        player.defense += Math.floor(pet.defenseBonus * 0.2);
        player.maxHp += Math.floor(pet.hpBonus * 0.2);
        player.hp = Math.min(player.maxHp, player.hp + Math.floor(pet.hpBonus * 0.2));
        message += `\n⬆️ *${pet.name}* لول آپ! سطح ${pet.level}\n⚔️ +${Math.floor(pet.attackBonus * 0.2)} | 🛡️ +${Math.floor(pet.defenseBonus * 0.2)} | ❤️ +${Math.floor(pet.hpBonus * 0.2)}`;

        if (pet.evolveTo && pet.level >= pet.evolveLevel) {
            const evolvedPet = petTypes[pet.evolveTo];
            if (evolvedPet) {
                pet.type = pet.evolveTo; pet.name = evolvedPet.name;
                pet.emoji = evolvedPet.emoji; pet.image = evolvedPet.image;
                pet.attackBonus = evolvedPet.attackBonus;
                pet.defenseBonus = evolvedPet.defenseBonus;
                pet.hpBonus = evolvedPet.hpBonus;
                pet.rarity = evolvedPet.rarity;
                pet.evolveLevel = evolvedPet.evolveLevel;
                pet.evolveTo = evolvedPet.evolveTo;
                pet.foodCost = evolvedPet.foodCost;
                pet.evolveMessage = evolvedPet.evolveMessage;
                image = evolvedPet.image;
                message += `\n\n${pet.evolveMessage || 'تکامل یافت!'}`;
            }
        }
    }
    return { success: true, message, image };
}

function feedAllPets(player) {
    initPets(player);
    if (!player.pets || player.pets.length === 0) return { success: false, message: '🐾 هیچ حیوونی نداری!' };
    let totalCost = 0;
    for (let pet of player.pets) totalCost += pet.foodCost;
    if ((player.energy || 0) < totalCost) return { success: false, message: `❌ انرژی کافی نداری!\n⚡ نیاز: ${totalCost} | ⚡ داری: ${player.energy || 0}` };
    let message = '';
    for (let pet of player.pets) {
        const result = feedPet(player, pet.id);
        message += result.message + '\n\n';
    }
    return { success: true, message: message.trim() };
}

function petBattleHelp(player) {
    initPets(player);
    if (!player.pets || player.pets.length === 0) return null;
    const r = Math.random();
    if (r < 0.20) {
        const pet = player.pets[Math.floor(Math.random() * player.pets.length)];
        const extraDamage = Math.floor(pet.attackBonus * 1.5);
        return { helped: true, pet, damage: extraDamage, message: `🐾 ${pet.emoji} *${pet.name}* به کمکت اومد! +${extraDamage} ⚔️`, image: pet.image };
    }
    return { helped: false };
}

function releasePet(player, petId) {
    initPets(player);
    const index = player.pets.findIndex(p => p.id === petId);
    if (index === -1) return { success: false, message: '❌ این حیوون پیدا نشد!' };
    const pet = player.pets[index];
    player.attack = Math.max(1, (player.attack || 5) - pet.attackBonus);
    player.defense = Math.max(0, (player.defense || 2) - pet.defenseBonus);
    player.maxHp = Math.max(50, (player.maxHp || 100) - pet.hpBonus);
    player.hp = Math.min(player.hp, player.maxHp);
    player.pets.splice(index, 1);
    return { success: true, message: `💔 ${pet.emoji} *${pet.name}* آزاد شد...\n⚔️ -${pet.attackBonus} | 🛡️ -${pet.defenseBonus} | ❤️ -${pet.hpBonus}` };
}

function formatPets(player) {
    initPets(player);
    if (!player.pets || player.pets.length === 0) return '🐾 *حیوون‌های خانگی*\n\n❌ هیچ حیوونی نداری!\n💡 موقع جمع‌آوری و سفر شانس پیدا کردن تخم داری (۱۰٪)';

    let msg = '🐾 *حیوون‌های خانگی*\n\n';
    for (let i = 0; i < player.pets.length; i++) {
        const pet = player.pets[i];
        const rarityEmoji = { common: '⚪', rare: '🔵', epic: '🟣', legendary: '🟡' };
        msg += `${i+1}. ${pet.emoji} *${pet.name}* ${rarityEmoji[pet.rarity] || ''}\n`;
        msg += `   ⭐ سطح ${pet.level} | ✨ ${pet.xp}/${pet.xpNeeded} XP\n`;
        msg += `   ⚔️ +${pet.attackBonus} | 🛡️ +${pet.defenseBonus} | ❤️ +${pet.hpBonus}\n`;
        if (pet.evolveLevel) msg += `   🔄 تکامل در سطح ${pet.evolveLevel}\n`;
        msg += `   🍖 هزینه غذا: ${pet.foodCost}⚡\n\n`;
    }
    msg += `👥 ${player.pets.length}/۳ حیوون\n`;
    msg += `🍖 کل غذاهای داده شده: ${player.petFood || 0}\n`;
    msg += `⚡ انرژی: ${player.energy || 0}/${player.maxEnergy || 100}`;
    return msg;
}

// =============================================
// 🐾 کیبورد شیشه‌ای
// =============================================
function getPetKeyboard(player) {
    const buttons = [];

    if (player.pets && player.pets.length > 0) {
        for (let pet of player.pets) {
            buttons.push([{ text: `🍖 غذا بده به ${pet.emoji} ${pet.name} (${pet.foodCost}⚡)`, callback_data: `pet_feed_${pet.id}` }]);
        }
        buttons.push([{ text: '🍖 غذا بده به همه', callback_data: 'pet_feed_all' }]);

        if (player.pets.length > 1) {
            for (let pet of player.pets) {
                buttons.push([{ text: `💔 آزاد کن ${pet.emoji} ${pet.name}`, callback_data: `pet_release_${pet.id}` }]);
            }
        }
    }

    buttons.push([{ text: '🔙 برگشت', callback_data: 'back_to_main' }]);

    return { reply_markup: { inline_keyboard: buttons } };
}

function autoFeedCheck(player) {
    initPets(player);
    if (!player.pets || player.pets.length === 0) return null;
    if (Math.random() < 0.20) {
        const pet = player.pets[Math.floor(Math.random() * player.pets.length)];
        return `${pet.emoji} *${pet.name}* گرسنه‌ست! 🍖\nبرو توی خونه غذا بده (${pet.foodCost}⚡)`;
    }
    return null;
}

module.exports = {
    petTypes, eggTypes, petImages,
    initPets, findEgg, addPet, feedPet, feedAllPets,
    petBattleHelp, releasePet, formatPets, getPetKeyboard, autoFeedCheck
};