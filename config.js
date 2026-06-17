module.exports = {
    BOT_TOKEN: process.env.BOT_TOKEN || 'TOKEN_ROBATET',
    
    ADMIN_ID: 5576592239,
    CHANNEL_ID: -1003035245907,
    
    characters: {
        khomeini: { name: 'سید روح‌الله خمینی', emoji: '🕌', power: 100, popularity: 95, budget: 9999, special: 'ولی فقیه' },
        khamenei: { name: 'سید علی خامنه‌ای', emoji: '🏛️', power: 98, popularity: 70, budget: 9999, special: 'حکم حکومتی' },
        mojtaba: { name: 'سید مجتبی خامنه‌ای', emoji: '🔮', power: 95, popularity: 60, budget: 5000, special: 'نفوذ پنهان' },
        mahmoud: { name: 'محمود احمدی‌نژاد', emoji: '👔', power: 95, popularity: 75, budget: 800, special: 'یارانه نقدی' },
        rouhani: { name: 'حسن روحانی', emoji: '👓', power: 65, popularity: 40, budget: 1200, special: 'برجام' },
        raisi: { name: 'سید ابراهیم رئیسی', emoji: '⚖️', power: 90, popularity: 55, budget: 1100, special: 'مبارزه با فساد' },
        khatami: { name: 'سید محمد خاتمی', emoji: '🧥', power: 70, popularity: 85, budget: 700, special: 'گفتگوی تمدن‌ها' },
        rafsanjani: { name: 'اکبر هاشمی رفسنجانی', emoji: '🦊', power: 88, popularity: 60, budget: 1500, special: 'سازندگی' },
        pezeshkian: { name: 'مسعود پزشکیان', emoji: '💊', power: 72, popularity: 75, budget: 1000, special: 'پزشک سیاستمدار' },
        ghalibaf: { name: 'محمدباقر قالیباف', emoji: '👮', power: 85, popularity: 55, budget: 900, special: 'شهردار تهران' },
        jalili: { name: 'سعید جلیلی', emoji: '🕴️', power: 70, popularity: 40, budget: 500, special: 'دیپلماسی مقاومت' },
        soleimani: { name: 'قاسم سلیمانی', emoji: '🎖️', power: 97, popularity: 90, budget: 2000, special: 'فرمانده سپاه قدس' },
        larijani: { name: 'علی لاریجانی', emoji: '🏛️', power: 75, popularity: 50, budget: 800, special: 'رئیس مجلس' },
        rezaei: { name: 'محسن رضایی', emoji: '⚔️', power: 80, popularity: 45, budget: 700, special: 'فرمانده سپاه' },
        mousavi: { name: 'میرحسین موسوی', emoji: '🟢', power: 78, popularity: 70, budget: 600, special: 'جنبش سبز' },
        karroubi: { name: 'مهدی کروبی', emoji: '📰', power: 60, popularity: 55, budget: 400, special: 'اعتراضات ۸۸' },
        mosaddegh: { name: 'محمد مصدق', emoji: '👴', power: 85, popularity: 95, budget: 500, special: 'ملی شدن نفت' },
        taleghani: { name: 'سید محمود طالقانی', emoji: '📖', power: 75, popularity: 80, budget: 300, special: 'پدر معنوی انقلاب' },
        beheshti: { name: 'سید محمد بهشتی', emoji: '⚖️', power: 82, popularity: 75, budget: 600, special: 'تشکیل حزب جمهوری' },
        chamran: { name: 'مصطفی چمران', emoji: '🗡️', power: 88, popularity: 85, budget: 400, special: 'جنگ چریکی' },
        reza_shah: { name: 'رضا شاه پهلوی', emoji: '👑', power: 95, popularity: 80, budget: 3000, special: 'توسعه ایران' },
        mohamad_reza: { name: 'محمدرضا شاه پهلوی', emoji: '🦁', power: 90, popularity: 50, budget: 5000, special: 'ارتش شاهنشاهی' },
        reza_pahlavi_jr: { name: 'رضا پهلوی (پسر)', emoji: '🗽', power: 65, popularity: 60, budget: 2000, special: 'اپوزیسیون خارج' },
        farah: { name: 'فرح پهلوی', emoji: '👸', power: 55, popularity: 70, budget: 1500, special: 'فرهنگ و هنر' },
        soraya: { name: 'ثریا اسفندیاری', emoji: '💙', power: 60, popularity: 90, budget: 2000, special: 'عشق شاه' },
        rajaei: { name: 'محمدعلی رجایی', emoji: '🕊️', power: 60, popularity: 80, budget: 200, special: '۲۸ روز ریاست' },
        baniSadr: { name: 'ابوالحسن بنی‌صدر', emoji: '📚', power: 50, popularity: 35, budget: 300, special: 'اولین رئیس جمهور' }
    },
    
    groupResources: {
        oil: { start: 500, max: 1000 },
        budget: { start: 1000, max: 5000 },
        popularity: { start: 70, max: 100 },
        military: { start: 50, max: 100 },
        industry: { start: 60, max: 100 }
    }
};