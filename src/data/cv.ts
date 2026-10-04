// Tüm CV içeriği burada. Siteyi güncellemek için sadece bu dosyayı düzenlemen yeterli.

export type Lang = 'tr' | 'en'
export type L = { tr: string; en: string }

export type Job = {
  company: string
  location: string
  start: L
  end: L
  role: L
  bullets: L[]
  color: string // Wallet kartının rengi
  current?: boolean
}

export const profile = {
  name: 'Mert Atakul',
  initials: 'MA',
  photo: '/me.jpg', // public klasöründe. Boş bırakılırsa baş harfler gösterilir.
  title: { tr: 'React Native Developer', en: 'React Native Developer' },
  location: { tr: 'Ankara, Türkiye', en: 'Ankara, Türkiye' },
  email: 'atakulmert00@gmail.com',
  // Telefon numarası herkese açık bir sitede spam çekebilir; göstermek için showPhone'u true yap.
  phone: '+90 554 680 6329',
  showPhone: false,
  linkedin: 'https://linkedin.com/in/mert-atakul',
  status: { tr: 'Yeni fırsatlara açık', en: 'Open to opportunities' },
  focus: { tr: 'Mobil & Frontend', en: 'Mobile & Frontend' },
  summary: {
    tr: 'Bilgisayar Teknolojisi ve Bilişim Sistemleri mezunuyum; 5+ yıllık profesyonel yazılım geliştirme deneyimimin odağında React Native ile mobil uygulamalar var. Farklı sektörlerde cross-platform çözümler geliştirdim ve frontend–backend entegrasyonunda güçlü bir deneyime sahibim. Uyumlu, takım odaklı ve karmaşık problemleri çözmeye hevesliyim.',
    en: 'Computer Technology and Information Systems graduate with 5+ years of professional software development experience, specialized in React Native mobile applications. Skilled at delivering cross-platform solutions across diverse industries, with strong frontend–backend integration experience. Adaptive, collaborative, and driven to solve complex problems.',
  },
  stats: [
    { value: '5+', label: { tr: 'yıl deneyim', en: 'years exp.' } },
    { value: '5', label: { tr: 'RN şirketi', en: 'RN companies' } },
    { value: '3', label: { tr: 'paralel uygulama', en: 'parallel apps' } },
  ],
}

export const jobs: Job[] = [
  {
    company: 'Sigun Bilgi Teknolojileri',
    location: 'Ankara',
    start: { tr: 'Kas 2024', en: 'Nov 2024' },
    end: { tr: 'May 2026', en: 'May 2026' },
    role: { tr: 'React Native Developer', en: 'React Native Developer' },
    color: '#0a84ff',
    bullets: [
      {
        tr: 'Canlı uygulamalara Google Maps API, Firebase Analytics ve deeplink yönetimi entegre ettim.',
        en: 'Integrated Google Maps API, Firebase Analytics and deeplink handling into production apps.',
      },
      {
        tr: 'Sürüm ve güncellemeler için App Store ve Google Play CI/CD süreçlerini yönettim.',
        en: 'Managed App Store and Google Play CI/CD pipelines for releases and updates.',
      },
      {
        tr: 'Redux ile state yönetimini, Axios ile frontend–backend entegrasyonunu kurdum.',
        en: 'Implemented application state management with Redux and frontend–backend integration via Axios.',
      },
      {
        tr: 'Ürün genelinde performans iyileştirmeleri ve UI hata düzeltmelerinin sorumluluğunu üstlendim.',
        en: 'Owned performance improvements and UI bug fixes across the product.',
      },
    ],
  },
  {
    company: 'CMIT Bilişim ve Arge',
    location: 'Ankara',
    start: { tr: 'Şub 2024', en: 'Feb 2024' },
    end: { tr: 'Kas 2024', en: 'Nov 2024' },
    role: { tr: 'React Native Developer', en: 'React Native Developer' },
    color: '#bf5af2',
    bullets: [
      {
        tr: '3 farklı mobil uygulamanın geliştirmesini paralel olarak üstlendim.',
        en: 'Took ownership of development across 3 different mobile applications in parallel.',
      },
      {
        tr: 'Axios ile güvenilir frontend–backend iletişimini sürdürdüm.',
        en: 'Maintained reliable frontend–backend communication through Axios.',
      },
      {
        tr: 'Projelerin önceki sürümlerinden kalan hataları çözdüm.',
        en: 'Resolved bugs inherited from earlier versions of the projects.',
      },
    ],
  },
  {
    company: 'WTECHIN Yazılım',
    location: 'Ankara',
    start: { tr: 'Mar 2022', en: 'Mar 2022' },
    end: { tr: 'Şub 2024', en: 'Feb 2024' },
    role: { tr: 'React Native Developer', en: 'React Native Developer' },
    color: '#30d158',
    bullets: [
      {
        tr: 'Birden fazla müşteri projesinde mobil geliştirme görevlerini teslim ettim.',
        en: 'Delivered mobile development tasks across multiple client projects.',
      },
      {
        tr: 'Frontend ile backend arasındaki bağlantıyı ve veri akışını sürdürdüm.',
        en: 'Maintained connection and data flow between the frontend and backend.',
      },
    ],
  },
  {
    company: 'MYCRO Sağlık Hizmetleri',
    location: 'Ankara',
    start: { tr: 'Kas 2021', en: 'Nov 2021' },
    end: { tr: 'Mar 2022', en: 'Mar 2022' },
    role: { tr: 'React Native Developer', en: 'React Native Developer' },
    color: '#ff375f',
    bullets: [
      {
        tr: 'Sağlık odaklı uygulamaların mobil geliştirmesine katkı sağladım.',
        en: 'Contributed to mobile development for healthcare-focused applications.',
      },
      {
        tr: 'Frontend’i backend servisleriyle entegre ettim, önceki sürümlerden kalan hataları çözdüm.',
        en: 'Integrated frontend with backend services and resolved bugs from prior versions.',
      },
    ],
  },
  {
    company: 'E-ID Teknoloji Hizmetleri',
    location: 'Ankara',
    start: { tr: 'Haz 2021', en: 'Jun 2021' },
    end: { tr: 'Kas 2021', en: 'Nov 2021' },
    role: { tr: 'Junior React Native Developer', en: 'Junior React Native Developer' },
    color: '#ff9f0a',
    bullets: [
      {
        tr: 'Çeşitli projelerde frontend özellikleri geliştirdim ve backend entegrasyonuna destek verdim.',
        en: 'Built frontend features across various projects and supported backend integration.',
      },
    ],
  },
  {
    company: 'Vedubox',
    location: 'Ankara',
    start: { tr: 'Şub 2020', en: 'Feb 2020' },
    end: { tr: 'Nis 2020', en: 'Apr 2020' },
    role: { tr: 'Global Inside Sales Representative (Yarı zamanlı)', en: 'Global Inside Sales Representative (Part-Time)' },
    color: '#64d2ff',
    bullets: [
      {
        tr: 'Uluslararası müşteri adayları için iletişim ve ürün teslim takibini yönettim.',
        en: 'Managed customer outreach and follow-up on product delivery for international leads.',
      },
    ],
  },
  {
    company: 'T.C. Cumhurbaşkanlığı — Bilgi İşlem',
    location: 'Ankara',
    start: { tr: 'Şub 2019', en: 'Feb 2019' },
    end: { tr: 'Haz 2019', en: 'Jun 2019' },
    role: { tr: 'Yazılım Geliştirici Stajyer', en: 'Software Developer Intern' },
    color: '#e5484d',
    bullets: [
      {
        tr: 'Kıdemli ekip üyeleri ve paydaşlarla birlikte iş gereksinimlerini analiz ettim.',
        en: 'Worked alongside senior team members and clients to analyze business requirements.',
      },
    ],
  },
]

export const earlier = [
  { company: 'Bilkent Üniversitesi Taksit Ofisi', role: { tr: 'Taksit Görevlisi (Yarı zamanlı)', en: 'Installment Officer (Part-Time)' }, year: '2018' },
  { company: 'Motus Interactive', role: { tr: 'Junior Yazılım Geliştirici Stajyer', en: 'Junior Software Developer Intern' }, year: '2017' },
  { company: 'Kamupersoneli.net', role: { tr: 'Editör (Yarı zamanlı)', en: 'Editor (Part-Time)' }, year: '2016' },
]

export const education = {
  school: { tr: 'Bilkent Üniversitesi', en: 'Bilkent University' },
  degree: {
    tr: 'Lisans — Bilgisayar Teknolojisi ve Bilişim Sistemleri',
    en: 'B.S. in Computer Technology & Information Systems',
  },
  location: 'Ankara, Türkiye',
  year: '2020',
}

export const skills = {
  mobile: ['React Native', 'Firebase Analytics', 'Google Maps API', 'Deeplinks', 'App Store / Google Play CI/CD', 'SQLite'],
  web: ['React', 'JavaScript', 'HTML', 'CSS'],
  shared: ['Redux', 'Axios'], // hem mobilde hem web'de
  other: ['C#', 'C++'],
  languages: [
    { name: { tr: 'Türkçe', en: 'Turkish' }, level: { tr: 'Ana dil', en: 'Native' }, value: 1 },
    { name: { tr: 'İngilizce', en: 'English' }, level: { tr: 'İleri', en: 'Proficient' }, value: 0.85 },
  ],
  strengths: [
    { tr: 'Öğrenmeye hevesli', en: 'Eager to learn' },
    { tr: 'Takım oyuncusu', en: 'Team player' },
    { tr: 'Uyumlu', en: 'Adaptable' },
    { tr: 'İş birlikçi', en: 'Collaborative' },
    { tr: 'Yaratıcı', en: 'Creative' },
    { tr: 'Profesyonel', en: 'Professional' },
  ],
}

// Kilit ekranında ve ana ekranda düşen bildirimler
export const notifications: { app: string; title: L; body: L }[] = [
  {
    app: 'career',
    title: { tr: 'Kariyer', en: 'Career' },
    body: { tr: 'Yeni bir ekip arıyor; mobil ve web projelerine açık 🚀', en: 'Looking for a new team; open to mobile and web projects 🚀' },
  },
  {
    app: 'about',
    title: { tr: 'Deneyim', en: 'Experience' },
    body: { tr: '5+ yıldır cross-platform mobil uygulamalar geliştiriyor 📱', en: '5+ years building cross-platform mobile apps 📱' },
  },
  {
    app: 'messages',
    title: { tr: 'Mert', en: 'Mert' },
    body: { tr: 'Merhaba! Bir proje mi konuşalım? 👋', en: 'Hi! Want to talk about a project? 👋' },
  },
]

// Mesajlar uygulamasındaki hazır sorular ve cevaplar
export const chat: { q: L; a: L }[] = [
  {
    q: { tr: 'En son nerede çalıştın?', en: 'Where did you work last?' },
    a: {
      tr: 'Kasım 2024 – Mayıs 2026 arasında Ankara’da Sigun Bilgi Teknolojileri’nde React Native Developer olarak çalıştım; Google Maps, Firebase ve CI/CD tarafındaydım. Şu an yeni bir ekibe katılmaya hazırım. 🙌',
      en: 'From Nov 2024 to May 2026 I was a React Native Developer at Sigun in Ankara, working on Google Maps, Firebase and CI/CD. Now I’m ready to join a new team. 🙌',
    },
  },
  {
    q: { tr: 'Hangi teknolojileri kullanıyorsun?', en: 'What’s your stack?' },
    a: {
      tr: 'Ana silahım React Native + Redux + Axios. Firebase Analytics, Google Maps API, deeplink’ler ve mağaza CI/CD’si de günlük işim. 🛠️',
      en: 'React Native + Redux + Axios is my main stack. Firebase Analytics, Google Maps API, deeplinks and store CI/CD are part of my day-to-day. 🛠️',
    },
  },
  {
    q: { tr: 'Yeni fırsatlara açık mısın?', en: 'Are you open to new roles?' },
    a: {
      tr: 'Evet! İlginç mobil ve web projeleri için her zaman konuşmaya açığım. Aşağıdan “Sana nasıl ulaşabiliriz?” sorusuna dokunman yeterli. 🙌',
      en: 'Yes! I’m always happy to talk about interesting mobile and web projects. Just tap “How can we reach you?” below. 🙌',
    },
  },
  {
    q: { tr: 'Frontend’de de çalışıyor musun?', en: 'Do you do frontend too?' },
    a: {
      tr: 'Evet! React Native zaten React’in üzerine kurulu; React.js, JavaScript, HTML ve CSS ile web arayüzleri de geliştiriyorum. Redux ve Axios iki tarafta da elimin altında. 🌐 Ana ekrandaki “Web” uygulamasına bir göz at.',
      en: 'Yes! React Native is built on React, and I also build web UIs with React.js, JavaScript, HTML and CSS. Redux and Axios work the same on both sides. 🌐 Check out the “Web” app on the home screen.',
    },
  },
  {
    q: { tr: 'Bu site nasıl yapıldı?', en: 'How was this site built?' },
    a: {
      tr: 'React + React Three Fiber ile. Telefon tamamen kodla modellendi, ekran ise gerçek HTML; yani tıkladığın her şey gerçek bir arayüz. 😎',
      en: 'React + React Three Fiber. The phone is modelled in code and the screen is real HTML, so everything you tap is a real UI. 😎',
    },
  },
]

// Mesajlar'daki "Sana nasıl ulaşabiliriz?" sorusu; cevabı telefon + e-posta balonları
export const contactQuestion: L = { tr: 'Sana nasıl ulaşabiliriz?', en: 'How can we reach you?' }
