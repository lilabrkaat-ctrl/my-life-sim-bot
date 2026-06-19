const SHOP = {
    offices: [
        { id: 1, name: "خونه پدری", price: 0, capacity: 3, staffCapacity: 0, emoji: "🏚️", prestige: 1, desc: "🛏️ اتاق | 📱 گوشی | 📋 دفتر" },
        { id: 2, name: "دفتر کوچیک", price: 50, capacity: 5, staffCapacity: 1, emoji: "🏠", prestige: 2, desc: "🚪 در شیشه‌ای | 💻 لپ‌تاپ | 🖨️ پرینتر" },
        { id: 3, name: "دفتر شیک", price: 200, capacity: 8, staffCapacity: 2, emoji: "🏢", prestige: 3, desc: "🛋️ مبلمان | 📺 تلویزیون | ☕ قهوه‌ساز" },
        { id: 4, name: "ساختمان", price: 1000, capacity: 15, staffCapacity: 4, emoji: "🏬", prestige: 4, desc: "🏢 ۳ طبقه | 🛗 آسانسور | 🅿️ پارکینگ" },
        { id: 5, name: "برج", price: 5000, capacity: 30, staffCapacity: 8, emoji: "🌆", prestige: 5, desc: "🌆 ۲۰ طبقه | 🏟️ آکادمی | 🚁 هلی‌پد" }
    ],
    vehicles: [
        { id: 1, name: "پیاده", price: 0, cities: 1, emoji: "🚶", speed: "خیلی کم" },
        { id: 2, name: "دوچرخه", price: 5, cities: 2, emoji: "🚲", speed: "کم" },
        { id: 3, name: "موتور", price: 15, cities: 4, emoji: "🏍️", speed: "متوسط" },
        { id: 4, name: "ماشین", price: 50, cities: 8, emoji: "🚗", speed: "بالا" },
        { id: 5, name: "شاسی‌بلند", price: 200, cities: 15, emoji: "🚙", speed: "خیلی بالا" }
    ],
    facilities: [
        { id: 1, name: "زمین خاکی", price: 0, bonus: 1, emoji: "🏜️", desc: "تمرین معمولی" },
        { id: 2, name: "زمین چمن", price: 100, bonus: 2, emoji: "🌱", desc: "تمرین +۲۰٪ بهتر" },
        { id: 3, name: "سالن وزنه", price: 150, bonus: 2, emoji: "🏋️", desc: "قدرت +۲ دائمی" },
        { id: 4, name: "کلینیک", price: 200, bonus: 0, emoji: "🏥", desc: "مصدومیت -۵۰٪" },
        { id: 5, name: "آکادمی", price: 1000, bonus: 0, emoji: "🏟️", desc: "بازیکن رایگان هر ۴ هفته" }
    ],
    staff: [
        { id: 1, name: "منشی", price: 10, emoji: "👩‍💼", desc: "پیشنهاد خودکار", needOffice: 2 },
        { id: 2, name: "مربی", price: 20, emoji: "👨‍🏫", desc: "تمرین +۱", needOffice: 3 },
        { id: 3, name: "پزشک", price: 15, emoji: "🩺", desc: "مصدومیت سریع‌تر", needOffice: 3 },
        { id: 4, name: "مدیر مالی", price: 20, emoji: "💼", desc: "مالیات کمتر", needOffice: 4 }
    ]
};

module.exports = { SHOP };