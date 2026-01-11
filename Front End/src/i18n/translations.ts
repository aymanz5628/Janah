export const translations = {
  ar: {
    // Navigation
    "nav.home": "الرئيسية",
    "nav.aviation": "الطيران",
    "nav.travel": "السفر",
    "nav.gallery": "المعرض",
    "nav.search": "ابحث...",
    
    // Footer
    "footer.copyright": "© 2026 جناح. جميع الحقوق محفوظة.",
    "footer.about": "من نحن",
    "footer.advertise": "أعلن معنا",
    "footer.careers": "الوظائف",
    "footer.privacy": "سياسة الخصوصية",
    
    // Sections
    "section.latestTopics": "أحدث المواضيع",
    "section.mostViewed": "الأكثر مشاهدة",
    "section.programs": "البرامج",
    "section.documentaries": "الوثائقيات",
    "section.gallery": "المعرض",
    
    // Gallery
    "gallery.title": "معرض الطيران والسفر",
    "gallery.description": "استكشف مجموعة مختارة من صور الطيران والوجهات السياحية الساحرة حول العالم.",
    "gallery.loading": "جاري تحميل المعرض...",
    "gallery.empty": "لا توجد صور في المعرض حالياً",
    
    // Loading
    "loading.content": "جاري تحميل المحتوى...",
    
    // Categories
    "category.aviation": "الطيران",
    "category.travel": "السفر",
    "category.general": "عام",
    
    // Mock Articles
    "article.1.title": "مستقبل الطيران المدني",
    "article.1.excerpt": "استكشاف أحدث التقنيات في صناعة الطيران العالمية",
    "article.2.title": "أفضل وجهات السفر لعام 2026",
    "article.2.excerpt": "اكتشف أجمل الوجهات السياحية في العالم",
    "article.3.title": "دليل المسافر في المطارات الدولية",
    "article.3.excerpt": "نصائح وإرشادات للمسافرين",
    "article.4.title": "حياة الطيارين: خلف الكواليس",
    "article.4.excerpt": "تعرف على يوم عادي في حياة طيار محترف",
    "article.5.title": "السفر الفاخر: تجارب لا تُنسى",
    "article.5.excerpt": "أفخم تجارب السفر حول العالم",
    
    // Programs
    "program.1": "عالم الطيران",
    "program.2": "رحلات حول العالم",
    "program.3": "أسرار المطارات",
    "program.4": "مغامرات السفر",
    
    // Documentaries
    "doc.1": "تاريخ الطيران",
    "doc.2": "عجائب الدنيا السبع",
    "doc.3": "أسرار الطائرات",
    "doc.4": "وجهات مجهولة",
    
    // Author
    "author.editor": "محرر جناح",
  },
  en: {
    // Navigation
    "nav.home": "Home",
    "nav.aviation": "Aviation",
    "nav.travel": "Travel",
    "nav.gallery": "Gallery",
    "nav.search": "Search...",
    
    // Footer
    "footer.copyright": "© 2026 Janah. All rights reserved.",
    "footer.about": "About Us",
    "footer.advertise": "Advertise",
    "footer.careers": "Careers",
    "footer.privacy": "Privacy Policy",
    
    // Sections
    "section.latestTopics": "Latest Topics",
    "section.mostViewed": "Most Viewed",
    "section.programs": "Programs",
    "section.documentaries": "Documentaries",
    "section.gallery": "Gallery",
    
    // Gallery
    "gallery.title": "Aviation & Travel Gallery",
    "gallery.description": "Explore a curated collection of stunning aviation and travel photography from around the world.",
    "gallery.loading": "Loading gallery...",
    "gallery.empty": "No photos in gallery yet",
    
    // Loading
    "loading.content": "Loading content...",
    
    // Categories
    "category.aviation": "Aviation",
    "category.travel": "Travel",
    "category.general": "General",
    
    // Mock Articles
    "article.1.title": "The Future of Civil Aviation",
    "article.1.excerpt": "Exploring the latest technologies in the global aviation industry",
    "article.2.title": "Best Travel Destinations for 2026",
    "article.2.excerpt": "Discover the most beautiful tourist destinations in the world",
    "article.3.title": "International Airport Travelers Guide",
    "article.3.excerpt": "Tips and guidelines for travelers",
    "article.4.title": "Pilots Life: Behind the Scenes",
    "article.4.excerpt": "Learn about a typical day in the life of a professional pilot",
    "article.5.title": "Luxury Travel: Unforgettable Experiences",
    "article.5.excerpt": "The most luxurious travel experiences around the world",
    
    // Programs
    "program.1": "Aviation World",
    "program.2": "Journeys Around the World",
    "program.3": "Airport Secrets",
    "program.4": "Travel Adventures",
    
    // Documentaries
    "doc.1": "History of Aviation",
    "doc.2": "Seven Wonders of the World",
    "doc.3": "Aircraft Secrets",
    "doc.4": "Unknown Destinations",
    
    // Author
    "author.editor": "Janah Editor",
  }
};

export type Language = 'ar' | 'en';
export type TranslationKey = keyof typeof translations.ar;
