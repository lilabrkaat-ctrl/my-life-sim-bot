module.exports = {
    BOT_TOKEN: process.env.BOT_TOKEN || 'YOUR_TOKEN',
    ADMIN_ID: 5576592239,
    ADMIN_PASSWORD: 'mahmoud1406',
    
    // کشورهای جهان - ۷۰ کشور
    countries: {
        // خاورمیانه
        iraq: { name: 'عراق', emoji: '🇮🇶', power: 25, oil: 200, gold: 50 },
        afghanistan: { name: 'افغانستان', emoji: '🇦🇫', power: 15, oil: 10, gold: 20 },
        syria: { name: 'سوریه', emoji: '🇸🇾', power: 30, oil: 150, gold: 80 },
        turkey: { name: 'ترکیه', emoji: '🇹🇷', power: 150, oil: 100, gold: 400 },
        saudi: { name: 'عربستان', emoji: '🇸🇦', power: 180, oil: 1500, gold: 800 },
        uae: { name: 'امارات', emoji: '🇦🇪', power: 100, oil: 800, gold: 1000 },
        qatar: { name: 'قطر', emoji: '🇶🇦', power: 60, oil: 500, gold: 700 },
        kuwait: { name: 'کویت', emoji: '🇰🇼', power: 40, oil: 400, gold: 300 },
        oman: { name: 'عمان', emoji: '🇴🇲', power: 30, oil: 200, gold: 150 },
        yemen: { name: 'یمن', emoji: '🇾🇪', power: 20, oil: 50, gold: 30 },
        jordan: { name: 'اردن', emoji: '🇯🇴', power: 35, oil: 10, gold: 60 },
        lebanon: { name: 'لبنان', emoji: '🇱🇧', power: 25, oil: 5, gold: 40 },
        palestine: { name: 'فلسطین', emoji: '🇵🇸', power: 15, oil: 0, gold: 10 },
        bahrain: { name: 'بحرین', emoji: '🇧🇭', power: 20, oil: 100, gold: 80 },
        
        // قدرت‌های بزرگ
        usa: { name: 'آمریکا', emoji: '🇺🇸', power: 1000, oil: 2000, gold: 5000 },
        russia: { name: 'روسیه', emoji: '🇷🇺', power: 800, oil: 3000, gold: 2000 },
        china: { name: 'چین', emoji: '🇨🇳', power: 900, oil: 1000, gold: 3000 },
        uk: { name: 'انگلیس', emoji: '🇬🇧', power: 600, oil: 300, gold: 2000 },
        france: { name: 'فرانسه', emoji: '🇫🇷', power: 550, oil: 100, gold: 1500 },
        germany: { name: 'آلمان', emoji: '🇩🇪', power: 650, oil: 50, gold: 2500 },
        israel: { name: 'اسرائیل', emoji: '🇮🇱', power: 500, oil: 10, gold: 1000 },
        iran: { name: 'ایران', emoji: '🇮🇷', power: 300, oil: 1000, gold: 500 },
        
        // آسیا
        india: { name: 'هند', emoji: '🇮🇳', power: 500, oil: 100, gold: 1000 },
        pakistan: { name: 'پاکستان', emoji: '🇵🇰', power: 200, oil: 50, gold: 150 },
        japan: { name: 'ژاپن', emoji: '🇯🇵', power: 600, oil: 0, gold: 3000 },
        south_korea: { name: 'کره جنوبی', emoji: '🇰🇷', power: 400, oil: 0, gold: 2000 },
        north_korea: { name: 'کره شمالی', emoji: '🇰🇵', power: 350, oil: 20, gold: 100 },
        bangladesh: { name: 'بنگلادش', emoji: '🇧🇩', power: 80, oil: 10, gold: 50 },
        indonesia: { name: 'اندونزی', emoji: '🇮🇩', power: 250, oil: 200, gold: 300 },
        malaysia: { name: 'مالزی', emoji: '🇲🇾', power: 150, oil: 300, gold: 400 },
        thailand: { name: 'تایلند', emoji: '🇹🇭', power: 120, oil: 50, gold: 250 },
        vietnam: { name: 'ویتنام', emoji: '🇻🇳', power: 100, oil: 100, gold: 150 },
        philippines: { name: 'فیلیپین', emoji: '🇵🇭', power: 90, oil: 30, gold: 100 },
        kazakhstan: { name: 'قزاقستان', emoji: '🇰🇿', power: 100, oil: 500, gold: 200 },
        uzbekistan: { name: 'ازبکستان', emoji: '🇺🇿', power: 70, oil: 100, gold: 150 },
        turkmenistan: { name: 'ترکمنستان', emoji: '🇹🇲', power: 50, oil: 300, gold: 100 },
        azerbaijan: { name: 'آذربایجان', emoji: '🇦🇿', power: 80, oil: 400, gold: 200 },
        armenia: { name: 'ارمنستان', emoji: '🇦🇲', power: 40, oil: 5, gold: 30 },
        georgia: { name: 'گرجستان', emoji: '🇬🇪', power: 45, oil: 10, gold: 40 },
        sri_lanka: { name: 'سریلانکا', emoji: '🇱🇰', power: 30, oil: 5, gold: 40 },
        nepal: { name: 'نپال', emoji: '🇳🇵', power: 25, oil: 0, gold: 15 },
        myanmar: { name: 'میانمار', emoji: '🇲🇲', power: 60, oil: 30, gold: 50 },
        cambodia: { name: 'کامبوج', emoji: '🇰🇭', power: 40, oil: 10, gold: 30 },
        mongolia: { name: 'مغولستان', emoji: '🇲🇳', power: 45, oil: 20, gold: 60 },
        tajikistan: { name: 'تاجیکستان', emoji: '🇹🇯', power: 25, oil: 10, gold: 20 },
        kyrgyzstan: { name: 'قرقیزستان', emoji: '🇰🇬', power: 20, oil: 15, gold: 25 },
        
        // اروپا
        italy: { name: 'ایتالیا', emoji: '🇮🇹', power: 300, oil: 20, gold: 1000 },
        spain: { name: 'اسپانیا', emoji: '🇪🇸', power: 280, oil: 10, gold: 800 },
        poland: { name: 'لهستان', emoji: '🇵🇱', power: 200, oil: 20, gold: 400 },
        ukraine: { name: 'اوکراین', emoji: '🇺🇦', power: 150, oil: 50, gold: 200 },
        sweden: { name: 'سوئد', emoji: '🇸🇪', power: 180, oil: 5, gold: 600 },
        norway: { name: 'نروژ', emoji: '🇳🇴', power: 150, oil: 500, gold: 800 },
        greece: { name: 'یونان', emoji: '🇬🇷', power: 100, oil: 10, gold: 200 },
        portugal: { name: 'پرتغال', emoji: '🇵🇹', power: 120, oil: 5, gold: 300 },
        netherlands: { name: 'هلند', emoji: '🇳🇱', power: 200, oil: 100, gold: 700 },
        belgium: { name: 'بلژیک', emoji: '🇧🇪', power: 150, oil: 5, gold: 500 },
        switzerland: { name: 'سوئیس', emoji: '🇨🇭', power: 100, oil: 0, gold: 3000 },
        austria: { name: 'اتریش', emoji: '🇦🇹', power: 120, oil: 10, gold: 400 },
        czech: { name: 'چک', emoji: '🇨🇿', power: 100, oil: 5, gold: 250 },
        romania: { name: 'رومانی', emoji: '🇷🇴', power: 90, oil: 50, gold: 150 },
        hungary: { name: 'مجارستان', emoji: '🇭🇺', power: 80, oil: 10, gold: 200 },
        serbia: { name: 'صربستان', emoji: '🇷🇸', power: 60, oil: 5, gold: 100 },
        finland: { name: 'فنلاند', emoji: '🇫🇮', power: 130, oil: 5, gold: 350 },
        denmark: { name: 'دانمارک', emoji: '🇩🇰', power: 140, oil: 100, gold: 500 },
        
        // آفریقا
        egypt: { name: 'مصر', emoji: '🇪🇬', power: 120, oil: 200, gold: 300 },
        nigeria: { name: 'نیجریه', emoji: '🇳🇬', power: 180, oil: 400, gold: 200 },
        south_africa: { name: 'آفریقای جنوبی', emoji: '🇿🇦', power: 200, oil: 50, gold: 500 },
        libya: { name: 'لیبی', emoji: '🇱🇾', power: 40, oil: 600, gold: 100 },
        algeria: { name: 'الجزایر', emoji: '🇩🇿', power: 100, oil: 300, gold: 150 },
        morocco: { name: 'مراکش', emoji: '🇲🇦', power: 80, oil: 10, gold: 100 },
        sudan: { name: 'سودان', emoji: '🇸🇩', power: 50, oil: 100, gold: 80 },
        ethiopia: { name: 'اتیوپی', emoji: '🇪🇹', power: 70, oil: 5, gold: 50 },
        kenya: { name: 'کنیا', emoji: '🇰🇪', power: 60, oil: 10, gold: 60 },
        ghana: { name: 'غنا', emoji: '🇬🇭', power: 40, oil: 50, gold: 100 },
        angola: { name: 'آنگولا', emoji: '🇦🇴', power: 50, oil: 200, gold: 80 },
        tunisia: { name: 'تونس', emoji: '🇹🇳', power: 30, oil: 20, gold: 40 },
        tanzania: { name: 'تانزانیا', emoji: '🇹🇿', power: 45, oil: 15, gold: 70 },
        uganda: { name: 'اوگاندا', emoji: '🇺🇬', power: 35, oil: 10, gold: 30 },
        senegal: { name: 'سنگال', emoji: '🇸🇳', power: 30, oil: 5, gold: 40 },
        cameroon: { name: 'کامرون', emoji: '🇨🇲', power: 50, oil: 20, gold: 60 },
        
        // آمریکا
        canada: { name: 'کانادا', emoji: '🇨🇦', power: 400, oil: 500, gold: 1500 },
        mexico: { name: 'مکزیک', emoji: '🇲🇽', power: 250, oil: 300, gold: 400 },
        brazil: { name: 'برزیل', emoji: '🇧🇷', power: 350, oil: 400, gold: 600 },
        argentina: { name: 'آرژانتین', emoji: '🇦🇷', power: 200, oil: 100, gold: 300 },
        colombia: { name: 'کلمبیا', emoji: '🇨🇴', power: 150, oil: 200, gold: 200 },
        venezuela: { name: 'ونزوئلا', emoji: '🇻🇪', power: 100, oil: 1000, gold: 50 },
        chile: { name: 'شیلی', emoji: '🇨🇱', power: 120, oil: 50, gold: 300 },
        cuba: { name: 'کوبا', emoji: '🇨🇺', power: 60, oil: 20, gold: 30 },
        peru: { name: 'پرو', emoji: '🇵🇪', power: 100, oil: 30, gold: 150 },
        
        // اقیانوسیه
        australia: { name: 'استرالیا', emoji: '🇦🇺', power: 350, oil: 200, gold: 1000 },
        new_zealand: { name: 'نیوزیلند', emoji: '🇳🇿', power: 150, oil: 50, gold: 400 },
        fiji: { name: 'فیجی', emoji: '🇫🇯', power: 15, oil: 5, gold: 20 }
    },
    
    // واحدهای نظامی
    units: {
        soldier: { name: 'سرباز', emoji: '🗡️', power: 10, cost: 100 },
        sniper: { name: 'تک‌تیرانداز', emoji: '🏹', power: 25, cost: 300 },
        drone: { name: 'پهپاد', emoji: '🚁', power: 50, cost: 1000 },
        jet: { name: 'جنگنده', emoji: '✈️', power: 100, cost: 5000 },
        missile: { name: 'موشک', emoji: '🚀', power: 200, cost: 10000 },
        robot: { name: 'ربات جنگی', emoji: '🤖', power: 300, cost: 20000 }
    },
    
    // قیمت‌های پایه
    prices: {
        dollar: 160000,
        oil: 80,
        gold: 2000
    }
};