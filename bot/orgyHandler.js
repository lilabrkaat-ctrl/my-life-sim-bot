const { bot, player, positionImages, sendPhoto, sendAnimation } = require('./core');

// =============================================
// 🎬 گیف‌های سکسی
// =============================================
const sexyGifs = {
    // لمس و بوسه
    touch: [
        'CgACAgIAAxkBAAEqL2xqIyJty9xl0ap5lrJYra2GtlNQdQACTwMAAiY94UhMlGoX_JSICTsE',
        'CgACAgQAAxkBAAEqL2pqIyJpy-g7HaM9YEhpzyE0RU-1MwACrAADXSmNUjSWJGIYVG3KOwQ',
        'CgACAgQAAxkBAAEqL15qIyJW5AcK3OWO2Oyif7wI1aiDqQACgQMAAirVQQYo4gxrnlL0zTsE'
    ],
    kiss: 'CgACAgIAAxkBAAEqL2hqIyJnncLJlCKF2kJOT7jKi-7r_wACaAIAArqQoEtep7htQxIwxTsE',
    orgy: 'CgACAgQAAxkBAAEqL1xqIyJUx3yIRno4UZtix4SumGHwCgAC6p8AAkMXZAepPlY8DiidIDsE',
    
    // اغفال (سینه‌نمایی ملکه) - ۵ تا
    seduce: [
        'CgACAgQAAxkBAAEqizRqK5tQDWMju5J1opd9ARWgEUM-3wACSh4AAtsXWVHb8Y_gWt8KWjwE',
        'CgACAgQAAxkBAAEqizpqK5tQFeriRVC2jqdHhD_brsXdAwACUx4AAtsXWVGX50vaL2d8KzwE',
        'CgACAgQAAxkBAAEqi1FqK5tmcdIDqaAJV0hzv6ClTaiypAACMh4AAtsXWVGP55cnfP9FsDwE',
        'CgACAgQAAxkBAAEqi09qK5tmyT3ia2dR7m8hTSdyHJKmvAACfhsAAtN3WVFQLM4BGup3wTwE',
        'CgACAgQAAxkBAAEqi1NqK5tmc79xEIG6arpSFIeLmrFFrQACOR4AAtsXWVGBZG94AAH7sEU8BA'
    ],
    
    // خودارضایی - ۲ تا
    selfPleasure: [
        'CgACAgQAAxkBAAEqiz5qK5tQLFGjpFqUUl4F2Eyt3i3-hAACmyAAAtsXYVFmxw_72sVrUjwE',
        'CgACAgQAAxkBAAEqizxqK5tQuu9mwxl34b1DCZ2b-CGzuQACmSAAAtsXYVFx2uGHtZ-3ODwE'
    ],
    
    // عیاشی جلو - ۳ تا
    frontOrgy: [
        'CgACAgQAAxkBAAEqizNqK5tQo3MZl5qpQMAniEvFyoQzjQACSB4AAtsXWVFWTTWsKJ0KwjwE',
        'CgACAgQAAxkBAAEqizVqK5tQV27uYcgVfQFS1NaNvfbhkwACSx4AAtsXWVEJHGsvTgVPxTwE',
        'CgACAgQAAxkBAAEqizZqK5tQ2MUpZ3_-a3JGHq53SYvBiQACTR4AAtsXWVE0l0JamxoGpTwE'
    ],
    
    // آب ریختن - ۱
    frontFinish: 'CgACAgQAAxkBAAEqizhqK5tQ8bt9QBjlpS1IdtRWL6RhNwACUR4AAtsXWVEZM8R3t-jRNjwE',
    
    // عیاشی دهنی - ۲ تا
    oralOrgy: [
        'CgACAgQAAxkBAAEqizdqK5tQFq3M3UMdEyeCp9-WRT422gACTx4AAtsXWVFB23281nm0MTwE',
        'CgACAgQAAxkBAAEqi01qK5tmnhOAuEFTY-ZiKaDeqG4-VQACRh4AAjScUVEQ7sXQGjCgTTwE'
    ],
    
    // با کاندوم - ۱
    condomOrgy: 'CgACAgQAAxkBAAEqi0xqK5tmDJWGbx2ZHbZqxV2dIdvU3wACSx4AAjScUVE5YZD0VdPitzwE',
    
    // عیاشی پشت - ۱
    backOrgy: 'CgACAgQAAxkBAAEqi1RqK5tmoag95FcRWntCnJ-FlHeQWgACRh4AAtsXWVFc_ON67rljIjwE',
    
    // سینه - ۱
    breastOrgy: 'CgACAgQAAxkBAAEqiztqK5tQSEIpfmAKdn5trN-grXqzSgACgiAAAtsXYVEtt5RlOav2HzwE'
};

// =============================================
// 📋 مرحله ۱: اغفال - ملکه شاه رو فریب میده
// =============================================
async function step1_seduce(chatId, msgId, queen, backCallback) {
    const gif = sexyGifs.seduce[Math.floor(Math.random() * sexyGifs.seduce.length)];
    
    const dialogs = [
        `👸 *${queen.name}:* "شاهم... امشب خسته‌ای... بذار یه کم نوازشت کنم..."`,
        `👸 *${queen.name}:* "ببین چقدر داغم... همه اش تقصیر توئه..."`,
        `👸 *${queen.name}:* "این تن واسه توئه... چرا بهش بی‌توجهی می‌کنی؟"`,
        `👸 *${queen.name}:* "می‌خوام وسوسه‌ات کنم... یادت بیاد زنت کیه..."`,
        `👸 *${queen.name}:* "مدت‌هاست تو حرمسرا منتظرتم... امشب با منی..."`
    ];
    const dialog = dialogs[Math.floor(Math.random() * dialogs.length)];

    const buttons = [
        [{ text: '👑 "چی می‌خوای؟"', callback_data: `orgy_seduce_talk_${queen.id}` }],
        [{ text: '🔥 "ادامه بده..."', callback_data: `orgy_seduce_more_${queen.id}` }],
        [{ text: '🚪 "خسته‌ام... برو..."', callback_data: backCallback }]
    ];

    await bot.deleteMessage(chatId, msgId).catch(() => {});
    await sendAnimation(chatId, gif, dialog, { reply_markup: { inline_keyboard: buttons } });
}

// =============================================
// 📋 مرحله ۱-الف: مسیر حرف زدن
// =============================================
async function step1a_talk(chatId, msgId, queen, backCallback) {
    const dialogs = [
        `👸 *${queen.name}:* "این روزا اصلاً بهم توجه نمی‌کنی... من زن توأم..."`,
        `👸 *${queen.name}:* "دلم برات تنگ شده... اینقدر جنگ و درباری... منو یادت رفته..."`
    ];
    const dialog = dialogs[Math.floor(Math.random() * dialogs.length)];

    const buttons = [
        [{ text: '👑 "حق داری... بیا اینجا..."', callback_data: `orgy_makeup_${queen.id}` }],
        [{ text: '🤔 "بازم غر می‌زنی؟"', callback_data: `orgy_angry_${queen.id}` }],
        [{ text: '🚪 "حوصله ندارم..."', callback_data: backCallback }]
    ];

    await bot.editMessageText(dialog, {
        chat_id: chatId, message_id: msgId, parse_mode: 'Markdown',
        reply_markup: { inline_keyboard: buttons }
    });
}

// =============================================
// 📋 مرحله ۱-ب: مسیر ادامه بده (سینه‌نمایی)
// =============================================
async function step1b_more(chatId, msgId, queen, backCallback) {
    const gif = sexyGifs.breastOrgy;
    
    const dialogs = [
        `👸 *${queen.name}:* "نگاه کن... این سینه‌ها... این کمر... همه‌ش واسه توئه..."`,
        `👸 *${queen.name}:* "می‌خوام ببینی چی داری از دست می‌دی..."`,
        `👸 *${queen.name}:* "لباسامو کندم... حالا نوبت توئه..."`
    ];
    const dialog = dialogs[Math.floor(Math.random() * dialogs.length)];

    const buttons = [
        [{ text: '🔥 "داغم کردی... بیا اینجا..."', callback_data: `orgy_makeup_${queen.id}` }],
        [{ text: '👅 "اینقدر نگو... بیا پایین..."', callback_data: `orgy_oral_direct_${queen.id}` }],
        [{ text: '🚪 "وسوسه‌ام نکن..."', callback_data: backCallback }]
    ];

    await bot.deleteMessage(chatId, msgId).catch(() => {});
    await sendAnimation(chatId, gif, dialog, { reply_markup: { inline_keyboard: buttons } });
}

// =============================================
// 📋 مرحله ۲: آشتی / عصبانیت
// =============================================
async function step2_makeup(chatId, msgId, queen, backCallback) {
    const dialogs = [
        `👸 *${queen.name}:* "ببخش... نمی‌خواستم ناراحتت کنم... فقط دلم می‌خواست ببینمت..."`,
        `👸 *${queen.name}:* "من زن توأم... مال تو... فقط می‌خوام بدونم هنوز منو می‌خوای..."`
    ];
    const dialog = dialogs[Math.floor(Math.random() * dialogs.length)];

    const buttons = [
        [{ text: '🖐️ "بیا بغلم..."', callback_data: `orgy_hug_${queen.id}` }],
        [{ text: '🔥 "می‌خوامت... بیا..."', callback_data: `orgy_condom_ask_${queen.id}` }],
        [{ text: '🚪 "باشه... بعداً..."', callback_data: backCallback }]
    ];

    await bot.editMessageText(dialog, {
        chat_id: chatId, message_id: msgId, parse_mode: 'Markdown',
        reply_markup: { inline_keyboard: buttons }
    });
}

// =============================================
// 📋 مرحله ۲-ب: عصبانیت شاه
// =============================================
async function step2_angry(chatId, msgId, queen, backCallback) {
    const dialogs = [
        `👑 *شاه عصبانی:* "جسارت نکن ملکه! منو تهدید می‌کنی؟!"`,
        `👑 *شاه عصبانی:* "آبروی منو بردی! تو قصر من!"`
    ];
    const dialog = dialogs[Math.floor(Math.random() * dialogs.length)];

    const buttons = [
        [{ text: '👑 "باشه... بیا حرف بزنیم..."', callback_data: `orgy_makeup_${queen.id}` }],
        [{ text: '⚔️ "برو زندان!"', callback_data: `orgy_jail_${queen.id}` }],
        [{ text: '🚪 "برو بیرون!"', callback_data: backCallback }]
    ];

    await bot.editMessageText(dialog, {
        chat_id: chatId, message_id: msgId, parse_mode: 'Markdown',
        reply_markup: { inline_keyboard: buttons }
    });
}

// =============================================
// 📋 مرحله ۳: زندان
// =============================================
async function step3_jail(chatId, msgId, queen, backCallback) {
    const dialogs = [
        `👸 *${queen.name}:* "شاه... نکن... من زن توأم... بیرونم ننداز..."`,
        `👸 *${queen.name}:* "قسم می‌خورم تکرار نمیشه... ببخش..."`
    ];
    const dialog = dialogs[Math.floor(Math.random() * dialogs.length)];

    const buttons = [
        [{ text: '👑 "آزادش کن... بخشیدم..."', callback_data: `orgy_free_${queen.id}` }],
        [{ text: '🔥 "بخشیدمت... ولی جبران کن..."', callback_data: `orgy_condom_ask_${queen.id}` }],
        [{ text: '⚔️ "بمون... عبرت بگیر..."', callback_data: backCallback }]
    ];

    await bot.editMessageText(dialog, {
        chat_id: chatId, message_id: msgId, parse_mode: 'Markdown',
        reply_markup: { inline_keyboard: buttons }
    });
}

// =============================================
// 📋 مرحله ۴: سوال کاندوم
// =============================================
async function step4_condom(chatId, msgId, p, queen, backCallback) {
    const condomCount = p.inventory?.condom || 0;
    
    const dialogs = [
        `👸 *${queen.name}:* "پس می‌خوای... غلاف داری یا بی‌غلاف؟"`,
        `👸 *${queen.name}:* "عالیه... فقط بگو غلاف داری یا نه؟"`,
        `👸 *${queen.name}:* "من آماده‌ام... غلاف؟"`
    ];
    const dialog = dialogs[Math.floor(Math.random() * dialogs.length)];

    let msg = `${dialog}\n\n🎈 غلاف موجود: ${condomCount} عدد`;

    const buttons = [];
    if (condomCount > 0) {
        buttons.push([{ text: '🎈 با غلاف', callback_data: `orgy_position_${queen.id}_1` }]);
    }
    buttons.push([{ text: '🔥 بی‌غلاف', callback_data: `orgy_position_${queen.id}_0` }]);
    buttons.push([{ text: '🔙 برگشت', callback_data: backCallback }]);

    await bot.editMessageText(msg, {
        chat_id: chatId, message_id: msgId, parse_mode: 'Markdown',
        reply_markup: { inline_keyboard: buttons }
    });
}

// =============================================
// 📋 مرحله ۵: انتخاب پوزیشن
// =============================================
async function step5_position(chatId, msgId, queen, useCondom, backCallback) {
    const condomText = useCondom ? '🎈 با غلاف' : '🔥 بی‌غلاف';
    
    const dialogs = [
        `👸 *${queen.name}:* "${condomText}... حالا بگو... کدومشو می‌خوای؟"`,
        `👸 *${queen.name}:* "${condomText}... من آماده‌ام... انتخاب کن..."`,
        `👸 *${queen.name}:* "${condomText}... کص... کون... یا دهن؟"`
    ];
    const dialog = dialogs[Math.floor(Math.random() * dialogs.length)];

    const buttons = [
        [{ text: '🍑 کص (از جلو)', callback_data: `orgy_front_${queen.id}_${useCondom ? '1' : '0'}` }],
        [{ text: '🍑 کون (از عقب)', callback_data: `orgy_back_${queen.id}_${useCondom ? '1' : '0'}` }],
        [{ text: '👄 دهن', callback_data: `orgy_mouth_${queen.id}_${useCondom ? '1' : '0'}` }],
        [{ text: '🔙 برگشت', callback_data: backCallback }]
    ];

    await bot.editMessageText(dialog, {
        chat_id: chatId, message_id: msgId, parse_mode: 'Markdown',
        reply_markup: { inline_keyboard: buttons }
    });
}

// =============================================
// 📋 مرحله ۶: گیف عیاشی
// =============================================
async function showOrgyGif(chatId) {
    const gifMsg = await sendAnimation(chatId, sexyGifs.orgy, '🔥 *هم‌آغوشی...*', 
        { reply_markup: { inline_keyboard: [] } }
    );
    await new Promise(resolve => setTimeout(resolve, 2000));
    try { await bot.deleteMessage(chatId, gifMsg.message_id); } catch (e) {}
}

// =============================================
// 🔥 نتیجه: پوزیشن جلو
// =============================================
async function orgyFront(chatId, msgId, p, queen, useCondom, backCallback, getKeyboardFn) {
    if (useCondom) p.inventory.condom = Math.max(0, (p.inventory.condom || 0) - 1);
    if (!p.prisonRelations) p.prisonRelations = {};
    p.prisonRelations[queen.npcId] = Math.min(100, (p.prisonRelations[queen.npcId] || 50) + 15);
    queen.mood = Math.min(100, queen.mood + 20);

    let pregnancyMsg = '';
    if (!useCondom && Math.random() < 0.80) {
        pregnancyMsg = '\n🤰 *آب ریخت تو کسم... باردار شدم!*';
    }

    await showOrgyGif(chatId);

    // گیف مخصوص جلو
    const frontGif = sexyGifs.frontOrgy[Math.floor(Math.random() * sexyGifs.frontOrgy.length)];
    await sendAnimation(chatId, frontGif, '🍑 *از جلو...*', { reply_markup: { inline_keyboard: [] } });
    await new Promise(resolve => setTimeout(resolve, 2000));

    // عکس نتیجه
    const frontImage = positionImages.front[Math.floor(Math.random() * positionImages.front.length)];

    const dialogs = [
        `🍑 *از جلو*\n\n👸 ${queen.emoji} ${queen.name}: "اوووه... عمیق‌تر... همه شو بریز تو کسم..."`,
        `🍑 *از جلو*\n\n👸 ${queen.emoji} ${queen.name}: "آهااا... کصم داره می‌ترکه..."`,
        `🍑 *از جلو*\n\n👸 ${queen.emoji} ${queen.name}: "وای... چه کیری داری..."`
    ];
    let msg = dialogs[Math.floor(Math.random() * dialogs.length)];
    
    msg += `\n\n💕 رابطه +۱۵ | 😊 روحیه +۲۰`;
    if (useCondom) msg += `\n🎈 غلاف -۱ (${p.inventory.condom} عدد) 🛡️`;
    else msg += `\n⚠️ بی‌غلاف! ۸۰٪ بارداری`;
    msg += pregnancyMsg;

    // اگه بدون کاندوم بود، گیف آب ریختن
    if (!useCondom && pregnancyMsg) {
        await sendAnimation(chatId, sexyGifs.frontFinish, '💦 *آب ریختن...*', { reply_markup: { inline_keyboard: [] } });
        await new Promise(resolve => setTimeout(resolve, 2000));
    }

    const keyboard = getKeyboardFn ? getKeyboardFn(p, queen.id) : { reply_markup: { inline_keyboard: [[{ text: '🔙 برگشت', callback_data: backCallback }]] } };
    await sendPhoto(chatId, frontImage, msg, keyboard);
}

// =============================================
// 🔥 نتیجه: پوزیشن عقب
// =============================================
async function orgyBack(chatId, msgId, p, queen, useCondom, backCallback, getKeyboardFn) {
    if (useCondom) p.inventory.condom = Math.max(0, (p.inventory.condom || 0) - 1);
    if (!p.prisonRelations) p.prisonRelations = {};
    p.prisonRelations[queen.npcId] = Math.min(100, (p.prisonRelations[queen.npcId] || 50) + 20);
    queen.mood = Math.min(100, queen.mood + 25);

    await showOrgyGif(chatId);

    const backImage = positionImages.back[Math.floor(Math.random() * positionImages.back.length)];

    const dialogs = [
        `🍑 *از عقب*\n\n👸 ${queen.emoji} ${queen.name}: "آخ... چه کونی داری... محکم‌تر..."`,
        `🍑 *از عقب*\n\n👸 ${queen.emoji} ${queen.name}: "کونم رو محکم بگیر... آهااا..."`,
        `🍑 *از عقب*\n\n👸 ${queen.emoji} ${queen.name}: "وای... چقدر کیرت تو کونم بزرگه..."`
    ];
    let msg = dialogs[Math.floor(Math.random() * dialogs.length)];
    
    msg += `\n\n💕 رابطه +۲۰ | 😊 روحیه +۲۵`;
    if (useCondom) msg += `\n🎈 غلاف -۱ (${p.inventory.condom} عدد)`;
    msg += `\n✅ تو کون بارداری نیس`;

    const keyboard = getKeyboardFn ? getKeyboardFn(p, queen.id) : { reply_markup: { inline_keyboard: [[{ text: '🔙 برگشت', callback_data: backCallback }]] } };
    await sendPhoto(chatId, backImage, msg, keyboard);
}

// =============================================
// 🔥 نتیجه: پوزیشن دهنی
// =============================================
async function orgyMouth(chatId, msgId, p, queen, useCondom, backCallback, getKeyboardFn) {
    const hpLoss = Math.floor((p.maxHp || 100) * 0.20);
    p.hp = Math.max(10, (p.hp || 100) - hpLoss);
    if (!p.prisonRelations) p.prisonRelations = {};
    p.prisonRelations[queen.npcId] = Math.min(100, (p.prisonRelations[queen.npcId] || 50) + 10);
    queen.mood = Math.min(100, queen.mood + 30);

    await showOrgyGif(chatId);

    const oralImage = positionImages.oral[Math.floor(Math.random() * positionImages.oral.length)];

    const dialogs = [
        `👄 *دهنی*\n\n👸 ${queen.emoji} ${queen.name}: "ممم... چه آب زیادی داری... همه شو خوردم..."`,
        `👄 *دهنی*\n\n👸 ${queen.emoji} ${queen.name}: "بذار عمیق‌تر بخورمش..."`,
        `👄 *دهنی*\n\n👸 ${queen.emoji} ${queen.name}: "چه مزه خوبی داره... بازم بریز..."`
    ];
    let msg = dialogs[Math.floor(Math.random() * dialogs.length)];
    
    msg += `\n\n💕 رابطه +۱۰ | 😊 روحیه +۳۰`;
    msg += `\n💔 آبم هدر رفت -${hpLoss} جون (${p.hp}/${p.maxHp})`;
    msg += `\n✅ تو دهن بارداری نیس`;

    const keyboard = getKeyboardFn ? getKeyboardFn(p, queen.id) : { reply_markup: { inline_keyboard: [[{ text: '🔙 برگشت', callback_data: backCallback }]] } };
    
    if (oralImage) {
        await sendPhoto(chatId, oralImage, msg, keyboard);
    } else {
        await bot.sendMessage(chatId, msg, { parse_mode: 'Markdown', ...keyboard });
    }
}

module.exports = {
    step1_seduce,
    step1a_talk,
    step1b_more,
    step2_makeup,
    step2_angry,
    step3_jail,
    step4_condom,
    step5_position,
    orgyFront,
    orgyBack,
    orgyMouth
};