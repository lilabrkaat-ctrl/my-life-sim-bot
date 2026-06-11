const otherNPCs = {
    knight: {
        day1: [
            { text: "⚔️ ای غریبه! شمشیرت رو بکش! ببینم چی داری!", options: [{ text: "⚔️ می‌جنگم", action: "fight" }, { text: "🤝 دوست", action: "ally" }, { text: "🏃 فرار", action: "flee" }] },
            { text: "⚔️ فقط یه بار شکست خوردم اونم تو بودی!", options: [{ text: "⚔️ دوباره", action: "fight" }, { text: "💋 بیا", action: "kiss" }, { text: "🏃 فرار", action: "flee" }] }
        ],
        day2: [
            { text: "⚔️ دفعه قبل خوب جنگیدی... این دفعه آماده‌ترم", options: [{ text: "⚔️ بجنگ", action: "fight" }, { text: "💋 امتحان کن", action: "seduce" }, { text: "🏃 فرار", action: "flee" }] },
            { text: "⚔️ چرا هر روز میای؟ می‌خوای تحقیرم کنی؟", options: [{ text: "🤝 نه", action: "ally" }, { text: "💋 می‌خوام ببینمت", action: "seduce" }, { text: "🏃 فرار", action: "flee" }] }
        ],
        day3: [
            { text: "⚔️ شب‌ها به جنگیدن با تو فکر می‌کنم", options: [{ text: "⚔️ بجنگیم", action: "fight" }, { text: "💋 منم به تو", action: "kiss" }, { text: "🔙 بعداً", action: "flee" }] },
            { text: "⚔️ زره‌ام رو درآوردم... سنگینه... خسته شدم", options: [{ text: "🖐️ بذار ببینم", action: "ally" }, { text: "💋 خوشتیپی", action: "seduce" }, { text: "🔙 بعداً", action: "flee" }] }
        ],
        day4: [
            { text: "⚔️ دستت قویه ولی ملایم... شاید آدم خوبی باشی", options: [{ text: "🖐️ لمس کن", action: "ally" }, { text: "💋 ببوس", action: "kiss" }, { text: "🔙 بعداً", action: "flee" }] },
            { text: "⚔️ می‌خوام یه نبرد دیگه... بدون اسلحه", options: [{ text: "🔥 بیا", action: "seduce" }, { text: "💋 اول ببوس", action: "kiss" }, { text: "🔙 بعداً", action: "flee" }] }
        ],
        day5: [
            { text: "⚔️ تسلیم شدم... همه چیزم مال تو", options: [{ text: "💋 مال منی", action: "kiss" }, { text: "🔥 بکنم", action: "seduce" }, { text: "🎁 هدیه", action: "gift" }] },
            { text: "⚔️ زره‌ام بازه... دیگه دفاعی ندارم", options: [{ text: "🔥 از جلو", action: "seduce" }, { text: "🍑 از پشت", action: "seduce" }, { text: "👄 دهنی", action: "kiss" }] }
        ],
        day6: [
            { text: "⚔️ فقط تو می‌تونی منو شکست بدی", options: [{ text: "🔥 از جلو", action: "seduce" }, { text: "🍑 از پشت", action: "seduce" }, { text: "👄 دهنی", action: "kiss" }] },
            { text: "⚔️ من شوالیه‌ام... ولی برای تو فرق دارم", options: [{ text: "💋 فرق داری", action: "kiss" }, { text: "🔥 آره", action: "seduce" }, { text: "🤝 باش", action: "ally" }] }
        ],
        day7: [
            { text: "⚔️ شوالیه تو شدم... تا ابد", options: [{ text: "💋 تا ابد", action: "kiss" }, { text: "👰 ازدواج", action: "propose" }, { text: "🔥 بیا", action: "seduce" }] },
            { text: "⚔️ هر شب منتظرتم... بدون زره... آماده برای جنگ", options: [{ text: "🔥 میام", action: "seduce" }, { text: "💋 منتظر باش", action: "kiss" }, { text: "👶 بچه‌دار شیم", action: "seduce" }] }
        ],
        harem: [
            { text: "⚔️ شوهرم... امروز تمرین داریم؟", options: [{ text: "⚔️ شمشیر", action: "fight" }, { text: "🔥 سکس", action: "seduce" }, { text: "💋 هردو", action: "kiss" }] }
        ]
    },
    werewolf: {
        day1: [
            { text: "🐺 غرررر! عقب برو کثافت! گازت می‌گیرم!", options: [{ text: "🗡️ حمله", action: "fight" }, { text: "💋 آروم باش", action: "seduce" }, { text: "🏃 فرار", action: "flee" }] },
            { text: "🐺 ماه کامله... و من توی قفس...", options: [{ text: "🔓 آزادت کنم", action: "free" }, { text: "💋 می‌خوام کمکت کنم", action: "seduce" }, { text: "🏃 فرار", action: "flee" }] }
        ],
        day2: [
            { text: "🐺 چرا انقدر نزدیک میشی؟... شام امشبمی؟", options: [{ text: "🍖 غذا دارم", action: "gift" }, { text: "💋 شام نیستم", action: "seduce" }, { text: "🏃 فرار", action: "flee" }] },
            { text: "🐺 دستت... گرمه... مثل خون تازه", options: [{ text: "🖐️ لمس کن", action: "ally" }, { text: "💋 گرمه", action: "kiss" }, { text: "🏃 فرار", action: "flee" }] }
        ],
        day3: [
            { text: "🐺 وقتی میای... یه حسی بهم می‌گه... شکارت نکنم", options: [{ text: "🤝 دوست", action: "ally" }, { text: "💋 حس خوبیه", action: "seduce" }, { text: "🔙 بعداً", action: "flee" }] },
            { text: "🐺 هیچکس تا حالا اینقدر نزدیک نشده بود", options: [{ text: "🖐️ نزدیک‌تر", action: "ally" }, { text: "💋 ببوس", action: "kiss" }, { text: "🔙 بعداً", action: "flee" }] }
        ],
        day4: [
            { text: "🐺 دستاتو بذار رو صورتم... قبل اینکه تبدیل شی", options: [{ text: "🖐️ می‌ذارم", action: "ally" }, { text: "💋 ببوس", action: "kiss" }, { text: "🔙 بعداً", action: "flee" }] },
            { text: "🐺 می‌خوام تبدیلت کنم به گرگ... با هم باشیم", options: [{ text: "🐺 تبدیل کن", action: "potion" }, { text: "💋 با هم", action: "seduce" }, { text: "🔙 بعداً", action: "flee" }] }
        ],
        day5: [
            { text: "🐺 نمی‌دونم چیه... ولی وقتی نیستی... زوزه می‌کشم", options: [{ text: "💋 منم دلتنگ میشم", action: "kiss" }, { text: "🔥 بیا", action: "seduce" }, { text: "🎁 هدیه", action: "gift" }] },
            { text: "🐺 دیشب ماه کامل بود... به تو فکر می‌کردم", options: [{ text: "💋 عاشقی", action: "kiss" }, { text: "🔥 بکنم", action: "seduce" }, { text: "🔙 بعداً", action: "flee" }] }
        ],
        day6: [
            { text: "🐺 مال تو شدم... آلفای من", options: [{ text: "🔥 از جلو", action: "seduce" }, { text: "🍑 از پشت", action: "seduce" }, { text: "👄 دهنی", action: "kiss" }] },
            { text: "🐺 بیا نزدیک‌تر... بذار گرمات رو حس کنم", options: [{ text: "🔥 حس کن", action: "seduce" }, { text: "💋 ببوس", action: "kiss" }, { text: "🔙 بعداً", action: "flee" }] }
        ],
        day7: [
            { text: "🐺 فقط تو می‌تونی آرومم کنی", options: [{ text: "💋 آروم باش", action: "kiss" }, { text: "👰 همدم همیشگی", action: "propose" }, { text: "🔥 بیا", action: "seduce" }] },
            { text: "🐺 تا ابد گرگ تو می‌مونم", options: [{ text: "💋 تا ابد", action: "kiss" }, { text: "🔥 بکنم", action: "seduce" }, { text: "👶 بچه‌دار شیم", action: "seduce" }] }
        ],
        harem: [
            { text: "🐺 شوهرم... امشب ماه کامله", options: [{ text: "🔥 وحشی شو", action: "seduce" }, { text: "💋 آروم باش", action: "kiss" }, { text: "🔙 بعداً", action: "flee" }] },
            { text: "🐺 دلم می‌خواد بریم شکار... بعدش سکس توی جنگل", options: [{ text: "🐺 بریم", action: "ally" }, { text: "💋 بمون", action: "kiss" }, { text: "🔥 بیا", action: "seduce" }] }
        ]
    },
    bride: {
        day1: [
            { text: "👰 من بدشانس‌ترین عروس دنیام... همه بهم خیانت کردن", options: [{ text: "🤝 کمک", action: "help" }, { text: "💋 من خیانت نمی‌کنم", action: "seduce" }, { text: "🏃 فرار", action: "flee" }] },
            { text: "👰 از عروسی فرار کردم... نمی‌خوام برگردم", options: [{ text: "💍 با من ازدواج کن", action: "propose" }, { text: "🤝 کمک", action: "help" }, { text: "🏃 فرار", action: "flee" }] }
        ],
        day2: [
            { text: "👰 تو هم مثل بقیه‌ای؟ می‌خوای منو برگردونی؟", options: [{ text: "🤝 نه", action: "ally" }, { text: "💋 می‌خوام پیشم بمونی", action: "seduce" }, { text: "🏃 فرار", action: "flee" }] },
            { text: "👰 چرا اینقدر بهم توجه می‌کنی؟ من لیاقت ندارم", options: [{ text: "💋 لیاقت داری", action: "kiss" }, { text: "🤝 داری", action: "ally" }, { text: "🏃 فرار", action: "flee" }] }
        ],
        day3: [
            { text: "👰 دیشب خواب دیدم با یه غریبه ازدواج کردم", options: [{ text: "💋 من بودم", action: "kiss" }, { text: "💍 ازدواج", action: "propose" }, { text: "🔙 بعداً", action: "flee" }] },
            { text: "👰 من از عشق فرار کردم... ولی انگار عشق دنبالمه", options: [{ text: "💋 عشق منم", action: "seduce" }, { text: "🤝 آروم باش", action: "ally" }, { text: "🔙 بعداً", action: "flee" }] }
        ],
        day4: [
            { text: "👰 دستت رو بده... ببینم حلقه داری؟", options: [{ text: "💍 دارم", action: "propose" }, { text: "🤝 ندارم", action: "ally" }, { text: "🔙 بعداً", action: "flee" }] },
            { text: "👰 اگه تو داماد بودی... فرار نمی‌کردم", options: [{ text: "💋 نمی‌کردی", action: "kiss" }, { text: "💍 دامادم", action: "propose" }, { text: "🔙 بعداً", action: "flee" }] }
        ],
        day5: [
            { text: "👰 من حاضرم دوباره عروسی کنم... با تو", options: [{ text: "💍 عروسی", action: "propose" }, { text: "💋 ببوس", action: "kiss" }, { text: "🎁 هدیه", action: "gift" }] },
            { text: "👰 لباس عروسم هنوز تنمه... می‌خوای درش بیاری؟", options: [{ text: "🔥 درمیارم", action: "seduce" }, { text: "💋 اول ببوس", action: "kiss" }, { text: "🔙 بعداً", action: "flee" }] }
        ],
        day6: [
            { text: "👰 این دفعه... مطمئنم که فرار نمی‌کنم", options: [{ text: "🔥 از جلو", action: "seduce" }, { text: "🍑 از پشت", action: "seduce" }, { text: "👄 دهنی", action: "kiss" }] },
            { text: "👰 من عروس تو شدم... برای همیشه", options: [{ text: "💋 برای همیشه", action: "kiss" }, { text: "🔥 شب اول", action: "seduce" }, { text: "🔙 بعداً", action: "flee" }] }
        ],
        day7: [
            { text: "👰 هر شب با لباس عروسم منتظرتم", options: [{ text: "🔥 میام", action: "seduce" }, { text: "💋 منتظر باش", action: "kiss" }, { text: "👶 بچه‌دار شیم", action: "seduce" }] },
            { text: "👰 بهترین تصمیم زندگیم... فرار نکردن از تو", options: [{ text: "💋 بهترینی", action: "kiss" }, { text: "🔥 بیا", action: "seduce" }, { text: "👰 ازدواج", action: "propose" }] }
        ],
        harem: [
            { text: "👰 شوهرم... امروز سالگرد آشناییمونه", options: [{ text: "💍 مبارکه", action: "gift" }, { text: "🔥 جشن", action: "seduce" }, { text: "🔙 بعداً", action: "flee" }] },
            { text: "👰 برات یه لباس جدید دوختم", options: [{ text: "👗 بپوش", action: "ally" }, { text: "🔥 نشون بده", action: "seduce" }, { text: "💋 قشنگه", action: "kiss" }] }
        ]
    },
    mermaid: {
        day1: [
            { text: "🧜‍♀️ سلام مسافر... آواز منو شنیدی؟", options: [{ text: "🎵 گوش کن", action: "listen" }, { text: "💋 عشق", action: "seduce" }, { text: "🏃 برو", action: "flee" }] },
            { text: "🧜‍♀️ می‌تونی آرزوت رو بگی...", options: [{ text: "💋 عشق", action: "seduce" }, { text: "💰 ثروت", action: "wealth" }, { text: "🏃 برو", action: "flee" }] }
        ],
        day2: [
            { text: "🧜‍♀️ دوباره اومدی... دلت برام تنگ شده؟", options: [{ text: "💋 تنگ شده", action: "kiss" }, { text: "🎵 آواز بخون", action: "listen" }, { text: "🏃 فرار", action: "flee" }] },
            { text: "🧜‍♀️ تو تنها انسانی که از من نمی‌ترسه", options: [{ text: "💋 نمی‌ترسم", action: "seduce" }, { text: "🤝 دوستم", action: "ally" }, { text: "🏃 فرار", action: "flee" }] }
        ],
        day3: [
            { text: "🧜‍♀️ می‌خوای بیای زیر آب؟... جایی که هیچ‌کس نمی‌بینه", options: [{ text: "🔥 بیا", action: "seduce" }, { text: "💋 اول ببوس", action: "kiss" }, { text: "🔙 بعداً", action: "flee" }] },
            { text: "🧜‍♀️ آواز من جادو داره... می‌تونی عاشقم بشی", options: [{ text: "💋 شدم", action: "kiss" }, { text: "🎵 بخون", action: "listen" }, { text: "🔙 بعداً", action: "flee" }] }
        ],
        day4: [
            { text: "🧜‍♀️ پری‌های دریایی عاشق نمی‌شن... ولی من", options: [{ text: "💋 عاشق شدی", action: "kiss" }, { text: "🤝 چی؟", action: "listen" }, { text: "🔙 بعداً", action: "flee" }] },
            { text: "🧜‍♀️ دلم می‌خواد پا داشته باشم... تا کنارت باشم", options: [{ text: "💋 کنارمی", action: "kiss" }, { text: "🔮 آرزو کن", action: "wish" }, { text: "🔙 بعداً", action: "flee" }] }
        ],
        day5: [
            { text: "🧜‍♀️ تو متفاوتی... مثل بقیه نیستی", options: [{ text: "💋 عاشقتم", action: "kiss" }, { text: "🔥 بکنم", action: "seduce" }, { text: "🎁 هدیه", action: "gift" }] },
            { text: "🧜‍♀️ می‌خوام تا ابد با تو بمونم", options: [{ text: "💋 بمون", action: "kiss" }, { text: "👰 ازدواج دریایی", action: "propose" }, { text: "🔙 بعداً", action: "flee" }] }
        ],
        day6: [
            { text: "🧜‍♀️ امروز می‌خوام مال تو باشم", options: [{ text: "🔥 از جلو", action: "seduce" }, { text: "🍑 از پشت", action: "seduce" }, { text: "👄 دهنی", action: "kiss" }] },
            { text: "🧜‍♀️ هیچ‌کس نمی‌دونه زیر آب چه خبره", options: [{ text: "🔥 بکنم", action: "seduce" }, { text: "💋 ببوس", action: "kiss" }, { text: "🔙 بعداً", action: "flee" }] }
        ],
        day7: [
            { text: "🧜‍♀️ تا ابد مال تو... توی دریا یا خشکی", options: [{ text: "💋 مال منی", action: "kiss" }, { text: "👶 بچه پری", action: "seduce" }, { text: "👰 ازدواج", action: "propose" }] },
            { text: "🧜‍♀️ هر شب برات آواز می‌خونم", options: [{ text: "🎵 بخون", action: "listen" }, { text: "💋 ببوس", action: "kiss" }, { text: "🔥 بیا", action: "seduce" }] }
        ],
        harem: [
            { text: "🧜‍♀️ شوهرم... برات یه مروارید سیاه پیدا کردم", options: [{ text: "💎 ممنون", action: "gift" }, { text: "💋 بیا", action: "kiss" }, { text: "🔙 بعداً", action: "flee" }] },
            { text: "🧜‍♀️ دلم برای دریا تنگ شده", options: [{ text: "🌊 بریم", action: "ally" }, { text: "💋 پیشم بمون", action: "kiss" }, { text: "🔥 بکنم", action: "seduce" }] }
        ]
    }
};

module.exports = { otherNPCs };