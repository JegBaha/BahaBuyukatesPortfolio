import { useEffect, useMemo, useRef, useState } from 'react'
import type { CSSProperties, FormEvent, MouseEvent as ReactMouseEvent } from 'react'
import './App.css'

type Locale = 'TR' | 'DE' | 'EN'

type FeedbackMood = 'like' | 'dislike' | null

type FeedbackEntry = {
  id: string
  rating: number
  mood: FeedbackMood
  comment: string
  locale: Locale
  createdAt: number
}

type Project = {
  title: string
  description: string
  summary: string
  stack: string
  link: string
  github: string
  live: string
  tags: string[]
  image: string
  impact?: string
  playground?: boolean
}

const localeOptions: { code: Locale; flag: string }[] = [
  { code: 'TR', flag: 'TR' },
  { code: 'DE', flag: 'DE' },
  { code: 'EN', flag: 'EN' },
]

const content: Record<
  Locale,
  {
    nav: { about: string; experience: string; projects: string; skills: string; contact: string }
    brandEyebrow: string
    welcome: string
    hero: {
      eyebrow: string
      titleMain: string
      titleAccent: string
      lede: string
      ctas: { browse: string; collaborate: string }
    }
    heroMeta: string[]
    heroPanel: {
      status: string
      focus: string
      profileEyebrow: string
      profileItems: string[]
      labels: string[]
    }
    projectsNote: string
    projectsNoteCta: string
    sections: {
      experience: { eyebrow: string; title: string; text: string }
      skills: { eyebrow: string; title: string; text: string }
      projects: { eyebrow: string; title: string; text: string }
      education: { eyebrow: string; title: string; text: string }
      certifications: { eyebrow: string; title: string; text: string }
      contact: { eyebrow: string; title: string; text: string }
      hobby: { eyebrow: string; title: string; text: string; benefit: string; cta: string }
    }
    feedback: {
      cta: string
      reminder: string
      title: string
      subtitle: string
      ratingLabel: string
      moodQuestion: string
      like: string
      dislike: string
      commentPlaceholder: string
      storageNote: string
      submit: string
      thanks: string
      averageLabel: string
      recentTitle: string
      empty: string
      copy: string
      copied: string
    }
    experience: {
      company: string
      role: string
      location: string
      period: string
      bullets: string[]
      impact?: string
    }[]
    skills: { title: string; items: string[]; detail: string }[]
    projects: Project[]
    education: { school: string; degree: string; location: string; period: string }[]
    certifications: string[]
    languages: { name: string; level: string }[]
    about: { eyebrow: string; title: string; bio: string; strengths: string[]; openTo: string[]; highlight: string }
    skillMatrix: { name: string; level: string; tools: string[] }[]
    toolbelt: string[]
    cv: { link: string; updated: string; label: string }
  }
> = {
  TR: {
    nav: {
      about: 'Hakk─▒mda',
      experience: 'Deneyim',
      projects: 'Projeler',
      skills: 'Yetenekler',
      contact: '─░leti┼şim',
    },
    brandEyebrow: 'Computer Engineer | Data/Software/IT/End├╝striyel',
    welcome: '',
    hero: {
      eyebrow: 'Ho┼ş geldin',
      titleMain: 'Bilgisayar M├╝hendisi,',
      titleAccent: ' veri, yaz─▒l─▒m, IT ve end├╝striyel sistemlere odakl─▒',
      lede:
        'Veri merkezli sistemlere odaklan─▒yorum; verinin kendisini, onu ├╝reten s├╝re├ğleri ve etraf─▒ndaki yaz─▒l─▒m/entegrasyon katmanlar─▒n─▒ birlikte geli┼ştiriyorum. Ana oda─ş─▒m data.',
      ctas: { browse: 'Projelerime g├Âz at', collaborate: 'Birlikte ├╝retelim' },
    },
    heroMeta: ['AB vatanda┼ş─▒', 'Vize sponsorlu─şu gerekmez', 'Hemen ba┼şlayabilirim'],
    heroPanel: {
      status: 'Canl─▒ durum',
      focus: 'Odak alanlar─▒',
      profileEyebrow: 'Profil',
      profileItems: [
        'Data Analysis & BI: Power BI, Excel, SQL, DAX, KPI (MTTR, MTBF, OEE)',
        'AI & ML: PyTorch, TensorFlow, CNNs, LLM training',
        'DevOps: AWS, Docker, Kubernetes, Jenkins, CI/CD',
        'Data + Software + IT + End├╝striyel entegrasyon projeleri (aktif ├Â─şrenme ve uygulama)',
      ],
      labels: ['Data', 'End├╝striyel', 'Yaz─▒l─▒m & IT', 'BI'],
    },
    projectsNote: 'Kucuk/canli projelerimi GitHubimdan takip edebilirsin.',
    projectsNoteCta: '─░leti┼şim',
    sections: {
      experience: {
        eyebrow: 'Profesyonel Deneyim',
        title: 'Sahada neler yapt─▒m',
        text: 'AI e─şitimi, veri analizi ve kurumsal IT aras─▒nda k├Âpr├╝ kuran tecr├╝beler.',
      },
      skills: {
        eyebrow: 'Ne sunuyorum',
        title: 'Yetenek seti',
        text: 'Veri, yapay zeka, otomasyon ve kurumsal s├╝re├ğleri birle┼ştiren beceriler.',
      },
      projects: {
        eyebrow: 'Se├ğili projeler',
        title: 'Hayal g├╝c├╝m ve mesle─şim ile birle┼şen projeler',
        text: 'Performans ve kullan─▒c─▒ deneyimi birlikte.',
      },
      education: {
        eyebrow: 'E─şitim',
        title: 'Temel ve ileri d├╝zey',
        text: 'M├╝h├╝r: Bilgisayar M├╝hendisli─şi + AI odakl─▒ bootcamp.',
      },
      certifications: {
        eyebrow: 'Sertifikalar & Diller',
        title: 'S├╝rekli ├Â─şrenme ve global ileti┼şim',
        text: 'Bulut, veri, AI ve end├╝striyel otomasyon alanlar─▒nda g├╝ncel sertifikalar; ├ğok dilli ileti┼şim.',
      },
      hobby: {
        eyebrow: 'Hobim',
        title: 'M├╝zik prod├╝ksiyonu',
        text: 'Djent ve progressive metal odakl─▒ par├ğalar ├╝retmek ve mevcut eserleri coverlamak ├╝zerine ├ğal─▒┼ş─▒yorum. M├╝zik benim i├ğin ayr─▒ bir tutku; projelerimde bu tutkuyu teknik ├╝retimle birle┼ştirerek ├Âzg├╝n ve ikonik i┼şler ortaya koymay─▒ seviyorum.',
        benefit:
          'Disiplinli ├ğal─▒┼şma al─▒┼şkanl─▒─ş─▒m, ritim ve detay odakl─▒ yakla┼ş─▒m─▒m hem m├╝zikal ├╝retimlerime hem de profesyonel projelerime do─şrudan yans─▒yor.',
        cta: 'Dinlemek ister misin?',
      },
      contact: {
        eyebrow: '─░leti┼şim',
        title: 'Yeni bir proje i├ğin haz─▒r─▒m.',
        text: 'Veri analizi, dashboard geli┼ştirme, AI e─şitimi veya otomasyon ihtiyac─▒n─▒z varsa ileti┼şime ge├ğebiliriz.',
      },
    },
    feedback: {
      cta: 'De─şerlendir',
      reminder: '30 saniyedir buradas─▒n, bir de─şerlendirme b─▒rak─▒r m─▒s─▒n?',
      title: 'Be─şendiniz mi?',
      subtitle: '1-5 y─▒ld─▒z ver, istersen k─▒sa yorum ekle.',
      ratingLabel: 'Y─▒ld─▒z',
      moodQuestion: 'H─▒zl─▒ se├ğim',
      like: 'Be─şendim',
      dislike: 'Be─şenmedim',
      commentPlaceholder: 'Neyi sevdiniz / geli┼ştirilebilir?',
      storageNote: '',
      submit: 'G├Ânder',
      thanks: 'Te┼şekk├╝rler, kaydedildi!',
      averageLabel: 'Ortalama',
      recentTitle: 'Kay─▒tl─▒ geri bildirimler (taray─▒c─▒da)',
      empty: 'Hen├╝z kay─▒t yok.',
      copy: 'Panoya kopyala',
      copied: 'Kopyaland─▒!',
    },
    experience: [
      {
        company: 'Outlier',
        role: 'AI Trainer',
        location: 'Remote',
        period: 'Eki 2025 - G├╝ncel',
        bullets: [
          'LLM e─şitim ve de─şerlendirme ile kod ├╝retimi/ak─▒l y├╝r├╝tme kabiliyetlerini iyile┼ştirme.',
          'Veri anotasyonu, prompt m├╝hendisli─şi ve QA s├╝recinde kaliteyi sa─şlama.',
        ],
        impact: 'LLM kalite puanlar─▒nda art─▒┼ş; hatal─▒ cevaplar d├╝┼şt├╝.',
      },
      {
        company: 'Prestij Bilgi Sistemleri Arge A.┼Ş.',
        role: 'C#.NET Developer Intern',
        location: 'Bursa, T├╝rkiye (Hibrit)',
        period: 'A─şu 2024 - Eyl 2024',
        bullets: [
          'Capstone seviyesinde HIS mod├╝lleri geli┼ştirdim; .NET ve SQL ile ├Âl├ğeklenebilir, g├╝venli mod├╝ller teslim ettim.',
          'Git ├╝zerinden ekip i├ğinde kod inceleme ve versiyonlama deneyimi kazand─▒m.',
          'HIS mimarisinde veri g├╝venli─şi, performans optimizasyonu ve reg├╝lasyon uyumu hakk─▒nda derinle┼şmi┼ş bilgi.',
          'Operasyonel s├╝reklilik i├ğin sorun giderme ve ├Ânleyici bak─▒m ad─▒mlar─▒n─▒ dok├╝mante ettim.',
        ],
        impact: 'Rapor ve HIS sorgular─▒nda performans art─▒┼ş─▒ sa─şland─▒.',
      },
      {
        company: 'Sanofi',
        role: 'IT Intern',
        location: 'L├╝leburgaz, T├╝rkiye',
        period: 'Tem 2024',
        bullets: [
          'Donan─▒m onar─▒m─▒, a─ş bak─▒m─▒ ve temel IT operasyonlar─▒nda pratik yaparak SAP ve veritaban─▒ taraf─▒nda deneyim kazand─▒m.',
          'ERP ba─şlam─▒nda SAP S/4HANA ve SAP Fiori temel mod├╝llerini inceledim.',
          'SAP entegrasyonlar─▒n─▒ finans, tedarik zinciri, ─░K gibi s├╝re├ğlere nas─▒l uyarlayaca─ş─▒m─▒z─▒ ├Â─şrendim; i┼ş ak─▒┼ş─▒ ├Âzelle┼ştirmeleri yapt─▒m.',
        ],
        impact: "SLA'yi koruyup destek kapan─▒┼ş s├╝resini k─▒saltt─▒m.",
      },
      {
        company: 'K─▒rklareli State Hospital',
        role: 'IT Intern',
        location: 'K─▒rklareli, T├╝rkiye',
        period: 'A─şu 2023 - Eyl 2023',
        bullets: [
          'Donan─▒m ve a─ş taraf─▒nda teknik destek sa─şlad─▒m; workstation/a─ş─▒rl─▒kl─▒ sistem kesintilerini minimuma indirdim.',
          'IT operasyonlar─▒ i├ğin temel bak─▒m ve hata giderme prosed├╝rlerini uygulad─▒m.',
        ],
        impact: 'Kesinti s├╝relerini azaltt─▒m; ├ğ├Âz├╝m h─▒zland─▒.',
      },
    ],
    skills: [
      {
        title: 'Data Analysis & BI',
        items: ['Power BI', 'Excel', 'SQL', 'DAX', 'Star Schema', 'KPI Reporting'],
        detail: 'Veriyi karar destek panellerine ve ├Âl├ğ├╝lebilir KPI takibine d├Ân├╝┼şt├╝r├╝yorum.',
      },
      {
        title: 'Programming',
        items: ['Python', 'C', 'C#', 'JavaScript', 'SQL'],
        detail: 'Farkl─▒ y─▒─ş─▒nlarda temiz, bak─▒m─▒ kolay ve test edilebilir kod yaz─▒yorum.',
      },
      {
        title: 'AI & Machine Learning',
        items: ['PyTorch', 'TensorFlow', 'Scikit-Learn', 'OpenCV', 'CNNs', 'LLM Training'],
        detail: 'Model e─şitimi, de─şerlendirme ve son kullan─▒c─▒ i├ğin anlaml─▒ ├ğ─▒kt─▒lar ├╝retme.',
      },
      {
        title: 'Industry 4.0 & IoT',
        items: ['PLC', 'SCADA', 'OPC UA', 'MQTT', 'Edge Devices', 'Digitalization', 'IoT Protokolleri'],
        detail:
          'Saha verisini bulut ve dashboard katmanlar─▒na g├╝venli ┼şekilde ta┼ş─▒yorum; PLC, SCADA, OPC UA, MQTT, bus/protokol entegrasyonlar─▒ ve edge cihazlar─▒nda tecr├╝beliyim.',
      },
      {
        title: 'DevOps & Cloud',
        items: ['AWS', 'Docker', 'Kubernetes', 'Jenkins', 'CI/CD'],
        detail: 'Teslimat─▒ h─▒zland─▒ran otomasyon boru hatlar─▒ ve container stratejileri.',
      },
      {
        title: 'Enterprise Solutions',
        items: ['SAP S/4HANA', 'SAP Fiori'],
        detail: 'Kurumsal i┼ş s├╝re├ğlerine uyumlu entegrasyon ve geli┼ştirme.',
      },
    ],
    projects: [
      {
        title: 'Smart Factory Digitalization Platform',
        description:
          '8000 satir sentetik uretim (sicaklik, hat hizi, vardiya, operator deneyimi, makine yasi); IQR outlier temizleme + standartlastirma + One-Hot ile defect (0/1) tahmini. Logistic Regression (yorumlanabilir) ve Random Forest (non-linear) ile ROC-AUC, classification report, feature importance. MES-ERP entegrasyonu plan fulfillment/delay/scrap KPI\'larini feature olarak besliyor.',
        summary:
          'Saha parametrelerinin defect riskini nasil arttirdigini metrik ve grafiklerle gosterir; script ve notebook uzerinden uca-uca Industry 4.0 veri/ML pipeline.',
        stack: 'Python, Scikit-Learn, Pandas, Matplotlib, Seaborn, Jupyter',
        link: 'https://github.com/JegBaha/Smart-Factory-Digitalization-Platform',
        github: 'https://github.com/JegBaha/Smart-Factory-Digitalization-Platform',
        live: '#',
        tags: ['ML', 'Industry 4.0', 'Data', 'Analytics'],
        image: '/projects/smart-factory-digitalization.webp',
        impact: 'Plan vs gerceklesme KPI ve saha parametrelerini ayni modelde okuyup defekt riskini dusuren aksiyonlari gosteriyor.',
      },
      {
        title: 'Endustri 4.0 IoT Predictive Maintenance Platformu',
        description:
          'Node-RED OPC UA simulasyonu -> MQTT -> Python ETL ile Postgres yildiz sema; PyTorch LSTM ile ariza olasiligi; Power BI dashboard ve cok dilli web UI. Docker Compose ile konumlandirildi, TLS/MQTT ve veri dogrulama ile uca-uca prototip.',
        summary:
          'Simule saha verisi, veri ambari ve ariza tahmini pipeline; KPI (OEE/MTTR/MTTF) dashboardlari. Halen uretim asamasinda/Iterative prototype.',
        stack: 'Node-RED, MQTT, Postgres, Python, PyTorch, Power BI, Docker',
        link: 'https://github.com/JegBaha?tab=repositories',
        github: 'https://github.com/JegBaha?tab=repositories',
        live: '#',
        tags: ['IoT', 'Data', 'ML', 'Ops'],
        image: '/projects/industry-40-iot-predictive-maintenance.webp',
        impact: 'Saha verisini AWS free-tier uzerinde toplayip ariza tahminlerini dashboardda sunar.',
      },
      {
        title: 'Heart Disease Prediction ML Projesi',
        description:
          'Heart Failure Prediction verisinde eksik/kategorik/numerik alanlar─▒ temizleyip normalize ederek KNN, Lojistik Regresyon ve Karar A─şac─▒ modellerini kar┼ş─▒la┼şt─▒rd─▒m. Performans─▒ accuracy/precision/recall/F1 ile ├Âl├ğt├╝m.',
        summary:
          'Veri ├Ân-i┼şleme, ├ğoklu model denemesi ve sa─şl─▒k verisinde kalp hastal─▒─ş─▒ olas─▒l─▒─ş─▒ tahmini.',
        stack: 'Scikit-Learn, Python, ML',
        link: 'https://github.com/JegBaha?tab=repositories',
        github: 'https://github.com/JegBaha?tab=repositories',
        live: '#',
        tags: ['ML', 'Data Analysis', 'Healthcare'],
        image: '/projects/heart-disease-prediction-ml.webp',
        impact: 'Erken uyar─▒da hassasiyet art─▒┼ş─▒ hedeflendi.',
      },
      {
        title: 'NeuraVeil - MRI T├╝m├Âr S─▒n─▒fland─▒rma',
        description:
          'EfficientNet, DenseNet, ResNet gibi modelleri transfer learning ve Optuna ile ayarlayarak MRI ├╝zerinde ├ğoklu t├╝m├Âr tipini y├╝ksek do─şrulukla s─▒n─▒fland─▒ran sistem. OpenCV preprocessing, veri dengesi, L2 reg├╝lasyonu ve dropout ile ├╝retim seviyesinde model.',
        summary:
          '├çok veri kaynakl─▒ MRI pipeline, model ensemble ve REST API ile sa─şl─▒k i├ğin uca-uca AI.',
        stack: 'PyTorch, TensorFlow, CNN',
        link: 'https://github.com/JegBaha?tab=repositories',
        github: 'https://github.com/JegBaha?tab=repositories',
        live: '#',
        tags: ['AI', 'Computer Vision', 'Healthcare'],
        image: '/projects/neuraveil-mri-tumor.webp',
        impact: 'Yanl─▒┼ş pozitif/negatif oran─▒nda belirgin iyile┼şme.',
      },
      {
        title: 'Drumveil Ritual - Metal Davul Transkripsiyon',
        description:
          'PyTorch + Demucs ile metal par├ğalarda davullar─▒ ay─▒r─▒p "Onsets and Frames" mimarisiyle notalar─▒ MIDI ├ğ─▒kt─▒s─▒na ├ğeviren pipeline. Slakh dataseti ve ger├ğek kay─▒tlarla e─şitilip spektrum tabanl─▒ yakla┼ş─▒m kullan─▒yor. Donan─▒m k─▒s─▒t─▒ nedeniyle bak─▒mda/Iterative prototype; ┼şimdilik birka├ğ saniyelik davul kesitlerini ba┼şar─▒yla ├ğevirdi.',
        summary:
          'Kaynak ayr─▒┼şt─▒rma, nota ├ğ─▒karma ve metal ritimlerine odaklanan derin ├Â─şrenme projesi; donan─▒m k─▒s─▒t─▒ nedeniyle bak─▒mda/Iterative prototype, birka├ğ saniyelik kesitlerde do─şruland─▒.',
        stack: 'PyTorch, Demucs, Audio DSP',
        link: 'https://github.com/JegBaha?tab=repositories',
        github: 'https://github.com/JegBaha?tab=repositories',
        live: '#',
        tags: ['Audio', 'AI', 'Python', 'Iterative prototype'],
        image: '/projects/drumveil-ritual-metal-drums.webp',
        impact:
          'Manuel transkripsiyon s├╝releri saatlerden dakikalara iniyor; birka├ğ saniyelik par├ğalarda do─şruland─▒, tam ├Âl├ğek i├ğin donan─▒m g├╝ncellemesi bekleniyor.',
      },
      {
        title: 'Employee Management System (.NET)',
        description:
          '.NET ile geli┼ştirilen basit ├ğal─▒┼şan y├Ânetim sistemi; CRUD, roller, izin/rapor i┼şlemleri ve SQL veri taban─▒ katman─▒. Staj s├╝recinde ger├ğek senaryolarla test edildi.',
        summary: 'C#.NET tabanl─▒ HR/employee y├Ânetim uygulamas─▒; temel CRUD ve raporlama.',
        stack: 'C#.NET, SQL, Entity Framework',
        link: 'https://github.com/JegBaha/StajEmployeeManagement',
        github: 'https://github.com/JegBaha/StajEmployeeManagement',
        live: '#',
        tags: ['.NET', 'C#', 'SQL'],
        image: '',
        impact: '─░zin ve takip s├╝re├ğlerinde belirgin zaman kazanc─▒.',
      },
      {
        title: 'Excel VBA Automation Toolkit (Prototype / Demo)',
        description:
          'Excel VBA tabanl─▒ mod├╝ler otomasyon toolkitÔÇÖi; SAP CSV verisini ConfigÔÇÖten okuyup Raw ÔåÆ Staging ak─▒┼ş─▒na al─▒yor, dashboard/pivotlar otomatik yeniliyor. Merkezi loglama/hata y├Ânetimi, ConfigÔÇÖe ba─şl─▒ UserForm EN/TR UI ve ├ğoklu veri kaynaklar─▒ (CSV/JSON/Excel) entegrasyonu var.',
        summary:
          'Mock SAP export ve JSON datasetleriyle konfig├╝rasyon bazl─▒, yeniden kullan─▒labilir otomasyon Prototype / Demo; log temizleme ve dashboard refresh otomatik.',
        stack: 'Excel VBA, Office Automation, SAP CSV, JSON',
        link: 'https://github.com/JegBaha?tab=repositories',
        github: 'https://github.com/JegBaha?tab=repositories',
        live: '#',
        tags: ['Prototype / Demo', 'Excel VBA', 'Automation'],
        image: '/projects/excel-vba-automation.webp',
        impact: 'Mod├╝ler VBA mimarisi, hata yakalama ve Config y├Ânetimi prati─şi.',
        playground: true,
      },
      {
        title: '3D Runner Game',
        description: 'Unity/C# tek ki┼şilik 3D ko┼şu; basit level tasar─▒m─▒ ve fizik odakl─▒, h─▒zl─▒ iterasyon.', 
        summary: 'Pipeline ve asset y├Ânetimi prati─şi i├ğin hobi Prototype / Demo.',
        stack: 'Unity, C#',
        link: 'https://github.com/JegBaha?tab=repositories',
        github: 'https://github.com/JegBaha?tab=repositories',
        live: '#',
        tags: ['Game', 'C#', 'Unity', 'Prototype / Demo'],
        image: '',
        impact: 'Tek ki┼şilik pipeline ve iterasyon h─▒z─▒nda art─▒┼ş.',
        playground: true,
      },
      {
        title: 'Galaxy Survivor 2D Game',
        description: 'Unity 2D shooter; k─▒sa s├╝rede level ve d├╝┼şman dalgalar─▒ kurulan mini proje.',
        summary: '2D oyun d├Âng├╝s├╝, basit AI ve asset entegrasyonu Prototype / Demo.',
        stack: 'Unity, C#',
        link: 'https://github.com/JegBaha?tab=repositories',
        github: 'https://github.com/JegBaha?tab=repositories',
        live: '#',
        tags: ['Game', 'C#', 'Unity', 'Prototype / Demo'],
        image: '',
        impact: 'H─▒zl─▒ prototipleme ve asset entegrasyonu prati─şi.',
        playground: true,
      },
      {
        title: '3D First Person Shooter Game',
        description:
          '3 ki┼şilik ekipte 2.5 haftada tamamlanan FPS/puzzle; seviye tasar─▒m─▒, basit AI ve etkile┼şimli ortamlar.',
        summary: 'Ekip i├ği g├Ârev da─ş─▒l─▒m─▒ ve h─▒zl─▒ prototipleme odakl─▒ mini proje.',
        stack: 'Unity, C#',
        link: 'https://github.com/JegBaha?tab=repositories',
        github: 'https://github.com/JegBaha?tab=repositories',
        live: '#',
        tags: ['Game', 'C#', 'Unity', 'Prototype / Demo'],
        image: '',
        impact: '2.5 haftada ekip├ğe MVP; koordinasyon deneyimi.',
        playground: true,
      },
    ],
    education: [
      {
        school: 'Trakya University',
        degree: 'Bachelor of Engineering, Computer Engineering',
        location: 'Edirne, T├╝rkiye',
        period: 'Sep 2021 - Sep 2025',
      },
      {
        school: 'GEN Academy',
        degree: 'AI Software Development & Artificial Intelligence',
        location: 'Remote',
        period: 'Sep 2024 - Jun 2025',
      },
    ],
    certifications: [
      'AWS for DevOps: Continuous Delivery and Automation',
      'Jenkins, Kubernetes, Docker',
      'Microsoft Azure AI Essentials',
      'Apache Spark Essentials',
      'LLM Foundations & RAG',
      'End├╝striyel otomasyon ve IoT sertifikalar─▒ (PLC, SCADA, OPC UA, MQTT)',
      'Daha fazlas─▒ LinkedIn: https://www.linkedin.com/in/baha-buyukates',
    ],
    languages: [
      { name: 'T├╝rk├ğe', level: 'Ana dil' },
      { name: '─░ngilizce', level: 'B2' },
      { name: 'Almanca', level: 'A2' },
    ],
    about: {
      eyebrow: 'Hakk─▒mda',
      title: 'Veri, yaz─▒l─▒m, IT ve end├╝striyel sistemlerde ├╝retiyor ve ├Â─şreniyorum.',
      bio: 'Verinin yaln─▒zca analiz edilmesiyle de─şil; nas─▒l ├╝retildi─şi, nas─▒l ta┼ş─▒nd─▒─ş─▒ ve nas─▒l anlaml─▒ kararlara d├Ân├╝┼şt├╝─ş├╝yle ilgileniyorum. Yaz─▒l─▒m, backend, otomasyon ve end├╝striyel entegrasyon taraf─▒nda kendimi geli┼ştirirken, t├╝m bu katmanlar─▒n merkezinde veriyi konumland─▒r─▒yorum. Amac─▒m; sahadan gelen veriyi g├╝venilir, ├Âl├ğeklenebilir ve karar destek odakl─▒ sistemlere d├Ân├╝┼şt├╝rmek.',
      strengths: [
        'Data storytelling & dashboarding',
        'ML/CNN e─şitimi ve de─şerlendirme',
        'Backend/API ve otomasyon',
        'IT/ERP entegrasyon fark─▒ndal─▒─ş─▒',
        'Ekip i├ği Git ak─▒┼şlar─▒ ve QA',
      ],
      openTo: ['Data & AI', 'Software Developer', 'Backend Developer', 'IT', 'Industrial Engineer'],
      highlight: 'Data, otomasyon, end├╝striyel dijitalizasyon ve BI alanlar─▒nda her g├╝n kendimi geli┼ştiriyorum.',
    },
    skillMatrix: [
      { name: 'Power BI / DAX', level: '─░leri', tools: ['Star Schema', 'KPI', 'Gateway'] },
      { name: 'Python / PyTorch', level: 'Orta', tools: ['CNN', 'Data Pipelines', 'Evaluation'] },
      { name: 'SQL', level: 'Orta', tools: ['Query Optimize', 'Joins', 'CTE'] },
      { name: 'Automation', level: 'Orta', tools: ['Zapier', 'Airtable', 'Slack'] },
      { name: 'Cloud & DevOps', level: 'Baslangic', tools: ['AWS', 'Docker', 'CI/CD'] },
    ],
    toolbelt: ['Python', 'PyTorch', 'Power BI', 'SQL', 'DAX', 'Zapier', 'Airtable', 'Docker', 'AWS', 'SAP Fiori'],
    cv: { link: '/Baha_Buyukates_CV.pdf', updated: 'Aral─▒k 2025', label: 'CV indir (Aral─▒k 2025)' },
  },
  DE: {
    nav: {
      about: '├£ber mich',
      experience: 'Erfahrung',
      projects: 'Projekte',
      skills: 'Skills',
      contact: 'Kontakt',
    },
    brandEyebrow: 'Computer Engineer | Data/Software/IT/Industrie',
    welcome: '',
    hero: {
      eyebrow: 'Willkommen',
      titleMain: 'Informatikingenieur,',
      titleAccent: ' mit Fokus auf Daten, Software, IT und industrielle Systeme',
      lede:
        'Ich fokussiere mich auf datenzentrierte Systeme; ich entwickle die Daten selbst, die Prozesse dahinter und die Software-/Integrationsschichten darum herum gemeinsam. Mein Hauptfokus ist Data.',
      ctas: { browse: 'Projekte ansehen', collaborate: 'Lass uns zusammenarbeiten' },
    },
    heroMeta: ['EU-Buerger', 'Kein Visasponsoring noetig', 'Sofort startklar'],
    heroPanel: {
      status: 'Live-Status',
      focus: 'Fokusbereiche',
      profileEyebrow: 'Profil',
      profileItems: [
        'Data Analysis & BI: Power BI, Excel, SQL, DAX, KPI (MTTR, MTBF, OEE)',
        'AI & ML: PyTorch, TensorFlow, CNNs, LLM-Training',
        'DevOps: AWS, Docker, Kubernetes, Jenkins, CI/CD',
      ],
      labels: ['Data', 'Industrie 4.0', 'Software&IT', 'BI'],
    },
    projectsNote: 'Laufende kleine/Lern-Projekte findest du live auf meinem GitHub.',
    projectsNoteCta: 'Kontakt aufnehmen',
    sections: {
      experience: {
        eyebrow: 'Berufserfahrung',
        title: 'Was ich umgesetzt habe',
        text: 'Erfahrungen an der Schnittstelle von AI-Training, Datenanalyse und Enterprise IT.',
      },
      skills: {
        eyebrow: 'Was ich biete',
        title: 'Skill-Stack',
        text: 'Faehigkeiten, die Daten, KI, Automatisierung und Unternehmensprozesse verbinden.',
      },
      projects: {
        eyebrow: 'Ausgewaehlte Projekte',
        title: 'Projekte, in denen Vorstellungskraft und Beruf zusammenkommen',
        text: 'Performance und Nutzererlebnis zusammen.',
      },
      education: {
        eyebrow: 'Ausbildung',
        title: 'Fundament & Vertiefung',
        text: 'Siegel: Informatikstudium + AI-Bootcamp.',
      },
      certifications: {
        eyebrow: 'Zertifikate & Sprachen',
        title: 'Lebenslanges Lernen',
        text: 'Aktuelle Zertifikate in Cloud, Daten, AI und Industrie-Automatisierung; mehrsprachige Kommunikation.',
      },
      hobby: {
        eyebrow: 'Hobby',
        title: 'Musikproduktion',
        text: ' Djent- und Progressive-Metal-Tracks erstellen oder covern. Die Leidenschaft verbinde ich mit Technik, um eigenst├ñndige und markante St├╝cke zu bauen.',
        benefit:
          'Disziplin beim ├£ben, Rhythmus- und Detailfokus flie├şen direkt in meine musikalischen Arbeiten und beruflichen Projekte ein.',
        cta: 'Willst du reinhoeren?',
      },
      contact: {
        eyebrow: 'Kontakt',
        title: 'Bereit fuer das naechste Projekt.',
        text: 'Fuer Datenanalyse, Dashboarding, AI-Training oder Automatisierung: Melde dich gern.',
      },
    },
    feedback: {
      cta: 'Feedback geben',
      reminder: 'Schon 30s hier? Ein kurzes Feedback hilft mir.',
      title: 'Hat es dir gefallen?',
      subtitle: '1-5 Sterne, Kommentar optional.',
      ratingLabel: 'Sterne',
      moodQuestion: 'Schnellauswahl',
      like: 'Gef├ñllt mir',
      dislike: 'Gef├ñllt mir nicht',
      commentPlaceholder: 'Was war gut / was fehlt?',
      storageNote: '',
      submit: 'Senden',
      thanks: 'Danke, gespeichert!',
      averageLabel: 'Durchschnitt',
      recentTitle: 'Gespeichertes Feedback (lokal)',
      empty: 'Noch keine Eintr├ñge.',
      copy: 'In Zwischenablage',
      copied: 'Kopiert!',
    },
    experience: [
      {
        company: 'Outlier',
        role: 'AI Trainer',
        location: 'Remote',
        period: 'Okt 2025 - Heute',
        bullets: [
          'LLM-Training und Evaluation zur Verbesserung von Code-Generierung und Reasoning.',
          'Daten-Annotation, Prompt-Engineering und QA mit Qualitaetsfokus.',
        ],
        impact: 'LLM-Qualitaet erhoeht, Fehlantworten gesunken.',
      },
      {
        company: 'Prestij Bilgi Sistemleri Arge A.S.',
        role: 'C#.NET Developer Praktikant',
        location: 'Bursa, Tuerkei (Hybrid)',
        period: 'Aug 2024 - Sep 2024',
        bullets: [
          'Capstone-aehnliche HIS-Module mit .NET und SQL gebaut; skalierbare und sichere Komponenten geliefert.',
          'Code-Reviews und Versionierung im Team via Git umgesetzt.',
          'Vertieftes Verstaendnis zu Datensicherheit, Performance-Optimierung und Compliance in Krankenhausinformationssystemen.',
          'Troubleshooting und praeventive Wartung dokumentiert, um Betriebszeit zu sichern.',
        ],
        impact: 'Report-Queries wurden schneller und stabiler.',
      },
      {
        company: 'Sanofi',
        role: 'IT Praktikant',
        location: 'Lueleburgaz, Tuerkei',
        period: 'Jul 2024',
        bullets: [
          'Hardware-Reparatur, Netzwerkpflege und IT-Operations unterstuetzt; SAP- und Datenbankkenntnisse vertieft.',
          'ERP-Kontext: Kernmodule von SAP S/4HANA und SAP Fiori kennengelernt.',
          'SAP-Integration in Prozesse wie Finance, Supply Chain, HR verstanden und Workflows angepasst.',
        ],
        impact: 'SLA gehalten, Ticket-Abschlusszeiten verkuerzt.',
      },
      {
        company: 'Kirklareli State Hospital',
        role: 'IT Praktikant',
        location: 'Kirklareli, Tuerkei',
        period: 'Aug 2023 - Sep 2023',
        bullets: [
          'Technischen Support fuer Hardware und Netzwerk geleistet; Ausfallzeiten minimiert.',
          'Basis-Wartung und Fehlersuche fuer IT-Operations umgesetzt.',
        ],
        impact: 'Downtime reduziert; schnellere Behebung vor Ort.',
      },
    ],
    skills: [
      {
        title: 'Data Analysis & BI',
        items: ['Power BI', 'Excel', 'SQL', 'DAX', 'Star Schema', 'KPI Reporting'],
        detail: 'Ich uebersetze Daten in Entscheidungs-Dashboards und messbare KPIs.',
      },
      {
        title: 'Programmierung',
        items: ['Python', 'C', 'C#', 'JavaScript', 'SQL'],
        detail: 'Schreibe sauberen, wartbaren und testbaren Code in verschiedenen Stacks.',
      },
      {
        title: 'AI & Machine Learning',
        items: ['PyTorch', 'TensorFlow', 'Scikit-Learn', 'OpenCV', 'CNNs', 'LLM Training'],
        detail: 'Training, Bewertung und nutzernahe Modelle mit verwertbaren Outputs.',
      },
      {
        title: 'Industrie 4.0 & IoT',
        items: ['PLC', 'SCADA', 'OPC UA', 'MQTT', 'Edge Devices', 'Digitalisierung', 'IoT-Protokolle'],
        detail:
          'Fuehre Felddaten sicher in Cloud- und Dashboard-Ebenen; Erfahrung mit PLC, SCADA, OPC UA, MQTT, Bus-/Protokollintegration und Edge-Geraeten.',
      },
      {
        title: 'DevOps & Cloud',
        items: ['AWS', 'Docker', 'Kubernetes', 'Jenkins', 'CI/CD'],
        detail: 'Automatisierungspipelines und Container-Strategien fuer schnelle Lieferung.',
      },
      {
        title: 'Enterprise Solutions',
        items: ['SAP S/4HANA', 'SAP Fiori'],
        detail: 'Integrationen und Entwicklungen passend zu Unternehmensprozessen.',
      },
    ],
    projects: [
      {
        title: 'Smart Factory Digitalization Platform',
        description:
          '8.000 Zeilen synthetische Fertigung (Temperatur, Liniengeschwindigkeit, Schicht, Erfahrung, Maschinenalter); IQR-Outlier-Cleaning + Standardisierung + One-Hot fuer Defect (0/1). Logistic Regression (interpretierbar) und Random Forest (non-linear) liefern ROC-AUC, Classification Report, Feature-Importance. MES-ERP Integration speist Plan-Fulfillment/Delay/Scrap KPIs als Features ein.',
        summary:
          'Zeigt mit Metriken und Grafiken, wie Shopfloor-Parameter Defect-Risiko treiben; End-to-End Industry 4.0 Daten/ML-Pipeline per Script und Notebook.',
        stack: 'Python, Scikit-Learn, Pandas, Matplotlib, Seaborn, Jupyter',
        link: 'https://github.com/JegBaha/ai-process-optimization',
        github: 'https://github.com/JegBaha/mes-erp-integration',
        live: '#',
        tags: ['ML', 'Industry 4.0', 'Data', 'Analytics'],
        image: '/projects/smart-factory-digitalization.webp',
        impact:
          'Verbindet Plan-vs-Actual KPI und Shopfloor-Parameter in einem Modell und zeigt risikosenkende Hebel.',
      },
      {
        title: 'Industrie 4.0 IoT Predictive Maintenance Plattform',
        description:
          'Node-RED OPC UA Simulation -> MQTT -> Python ETL nach Postgres Sternschema; PyTorch LSTM fuer Ausfallwahrscheinlichkeit; Power BI Dashboards und mehrsprachiges Web-UI. Docker-Compose Deployment, TLS/MQTT moeglich, Datenvalidierung fuer End-to-End Prototyp.',
        summary:
          'Simulierter Shopfloor-Datenstrom, Data Warehouse und Failure Prediction Pipeline; KPI (OEE/MTTR/MTTF) Dashboards. Noch in Produktion/Iterative prototype.',
        stack: 'Node-RED, MQTT, Postgres, Python, PyTorch, Power BI, Docker',
        link: 'https://github.com/JegBaha?tab=repositories',
        github: 'https://github.com/JegBaha?tab=repositories',
        live: '#',
        tags: ['IoT', 'Data', 'ML', 'Ops'],
        image: '/projects/industry-40-iot-predictive-maintenance.webp',
        impact: 'Sammelt Felddaten auf AWS Free Tier, liefert Prognosen und KPIs im Dashboard.',
      },
      {
        title: 'Heart Disease Prediction ML Projekt',
        description:
          'Heart Failure Prediction Dataset bereinigt (Missing Values, Encoding, Normalisierung) und KNN, Logistische Regression, Decision Trees verglichen. Bewertet mit Accuracy/Precision/Recall/F1 fuer Outcome-Prediction.',
        summary: 'Datenaufbereitung, Modellvergleich und Healthcare-Use-Case fuer Herzrisiko-Prognose.',
        stack: 'Scikit-Learn, Python, ML',
        link: 'https://github.com/JegBaha?tab=repositories',
        github: 'https://github.com/JegBaha?tab=repositories',
        live: '#',
        tags: ['ML', 'Data Analysis', 'Healthcare'],
        image: '/projects/heart-disease-prediction-ml.webp',
        impact: 'Fruehwarnung mit erhoehten Sensitivitaetswerten.',
      },
      {
        title: 'NeuraVeil - MRI Tumor Klassifikation',
        description:
          'EfficientNet, DenseNet, ResNet u.a. per Transfer Learning + Optuna getuned; OpenCV-Preprocessing, Class-Balance, L2/Dropout. Liefert hohe Genauigkeit fuer mehrere Tumortypen und REST-API-Integration.',
        summary:
          'End-to-End MRI-Pipeline mit Ensemble und generalisierbaren Modellen fuer den Klinik-Einsatz.',
        stack: 'PyTorch, TensorFlow, CNN',
        link: 'https://github.com/JegBaha?tab=repositories',
        github: 'https://github.com/JegBaha?tab=repositories',
        live: '#',
        tags: ['AI', 'Computer Vision', 'Healthcare'],
        image: '/projects/neuraveil-mri-tumor.webp',
        impact: 'Falsch-Positiv/Negativ Quote merklich verbessert.',
      },
      {
        title: 'Drumveil Ritual - Metal Drum Transkription',
        description:
          'PyTorch + Demucs trennen Metal-Tracks, ÔÇ£Onsets and FramesÔÇØ extrahiert Drum-Noten und erzeugt MIDI. Nutzt Slakh-Dataset und echte Aufnahmen, spektrumbasierter Ansatz fuer komplexe Rhythmik. Hardware-Limit -> in Wartung/Iterative prototype; aktuell nur wenige Sekunden Drums erfolgreich transkribiert.',
        summary:
          'Quelltrennung, Noten-Extraktion und Metal-Rhythmik im Fokus; Wartung/Iterative prototype wegen Hardware-Limit, kurze Snippets verifiziert.',
        stack: 'PyTorch, Demucs, Audio DSP',
        link: 'https://github.com/JegBaha?tab=repositories',
        github: 'https://github.com/JegBaha?tab=repositories',
        live: '#',
        tags: ['Audio', 'AI', 'Python', 'Iterative prototype'],
        image: '/projects/drumveil-ritual-metal-drums.webp',
        impact:
          'Manuelle Transkription von Stunden auf Minuten reduziert; kurze Ausschnitte bestaetigt, volle Laenge nach Hardware-Upgrade.',
      },
      {
        title: 'Employee Management System (.NET)',
        description:
          'Einfaches Mitarbeiter-Management mit .NET: CRUD, Rollen, Abwesenheiten, SQL-Backend; im Praktikum an realen Szenarien getestet.',
        summary: 'C#.NET HR/Employee App mit CRUD und Reporting.',
        stack: 'C#.NET, SQL, Entity Framework',
        link: 'https://github.com/JegBaha/StajEmployeeManagement',
        github: 'https://github.com/JegBaha/StajEmployeeManagement',
        live: '#',
        tags: ['.NET', 'C#', 'SQL'],
        image: '',
        impact: 'Genehmigungs- und Tracking-Workflows spuerbar schneller.',
      },
      {
        title: 'Excel VBA Automation Toolkit (Prototype / Demo)',
        description:
          'Modulares Excel-VBA-Automation-Toolkit: SAP-CSV wird aus Config gelesen, Raw ÔåÆ Staging Pipeline, Dashboards/Pivots aktualisieren automatisch. Zentrales Logging/Error-Handling, EN/DE UserForm-UI aus Config und Multi-Source-Import (CSV/JSON/Excel).',
        summary:
          'Konfigurierbarer Prototype / Demo mit Mock-SAP-Export und JSON-Datasets; automatische Log-Cleanup und Dashboard-Refresh.',
        stack: 'Excel VBA, Office Automation, SAP CSV, JSON',
        link: 'https://github.com/JegBaha?tab=repositories',
        github: 'https://github.com/JegBaha?tab=repositories',
        live: '#',
        tags: ['Prototype / Demo', 'Excel VBA', 'Automation'],
        image: '/projects/excel-vba-automation.webp',
        impact: 'Praxis in modularer VBA-Architektur, zentralem Fehlerfang und Config-Steuerung.',
        playground: true,
      },
      {
        title: '3D Runner Game',
        description: 'Unity/C# Einzelprojekt; 3D Runner mit schnellem Iterationsfokus auf Level und Physik.',
        summary: 'Prototype / Demo f├╝r Asset-Handling und Gameplay-Loop.',
        stack: 'Unity, C#',
        link: 'https://github.com/JegBaha?tab=repositories',
        github: 'https://github.com/JegBaha?tab=repositories',
        live: '#',
        tags: ['Game', 'C#', 'Unity', 'Prototype / Demo'],
        image: '',
        impact: 'Solo-Projekt; Pipeline und Iterationstempo gesteigert.',
        playground: true,
      },
      {
        title: 'Galaxy Survivor 2D Game',
        description: 'Unity 2D Shooter, allein entwickelt; schnelle Level-Wellen und kurze Entwicklungszeit.',
        summary: '2D Gameplay-Loop, einfache Gegner-Logik und Asset-Integration als Prototype / Demo.',
        stack: 'Unity, C#',
        link: 'https://github.com/JegBaha?tab=repositories',
        github: 'https://github.com/JegBaha?tab=repositories',
        live: '#',
        tags: ['Game', 'C#', 'Unity', 'Prototype / Demo'],
        image: '',
        impact: 'Schnelles Prototyping und Asset-Integration geuebt.',
        playground: true,
      },
      {
        title: '3D First Person Shooter Game',
        description:
          'FPS/Puzzle in 2,5 Wochen im 3er-Team; Level-Design, einfache AI und interaktive Umgebung.',
        summary: 'MVP mit schneller Prototyping-Pipeline und klarer Rollenverteilung.',
        stack: 'Unity, C#',
        link: 'https://github.com/JegBaha?tab=repositories',
        github: 'https://github.com/JegBaha?tab=repositories',
        live: '#',
        tags: ['Game', 'C#', 'Unity', 'Prototype / Demo'],
        image: '',
        impact: 'Team-MVP in ~2.5 Wochen; Koordination gestaerkt.',
        playground: true,
      },
    ],
    education: [
      {
        school: 'Trakya University',
        degree: 'Bachelor of Engineering, Computer Engineering',
        location: 'Edirne, Tuerkei',
        period: 'Sep 2021 - Sep 2025',
      },
      {
        school: 'GEN Academy',
        degree: 'AI Software Development & Artificial Intelligence',
        location: 'Remote',
        period: 'Sep 2024 - Jun 2025',
      },
    ],
    certifications: [
      'AWS for DevOps: Continuous Delivery and Automation',
      'Jenkins, Kubernetes, Docker',
      'Microsoft Azure AI Essentials',
      'Apache Spark Essentials',
      'LLM Foundations & RAG',
      'Zertifikate in Industrie-Automatisierung & IoT (PLC, SCADA, OPC UA, MQTT)',
      'Mehr auf LinkedIn: https://www.linkedin.com/in/baha-buyukates',
    ],
    languages: [
      { name: 'Tuerkisch', level: 'Muttersprache' },
      { name: 'Englisch', level: 'B2' },
      { name: 'Deutsch', level: 'A2' },
    ],
    about: {
      eyebrow: '├£ber mich',
      title: 'Ich arbeite und lerne in Daten, Software, IT und Industrie-Kontexten.',
      bio: 'Ich interessiere mich nicht nur f├╝r Datenanalyse, sondern auch daf├╝r, wie Daten erzeugt, transportiert und in sinnvolle Entscheidungen ├╝berf├╝hrt werden. W├ñhrend ich mich in Software, Backend, Automatisierung und industrieller Integration weiterentwickle, setze ich Daten ins Zentrum all dieser Schichten. Ziel: Shopfloor-Daten in verl├ñssliche, skalierbare und entscheidungsorientierte Systeme verwandeln.',
      strengths: ['Data Storytelling & BI', 'ML/CNN Training & Bewertung', 'Backend/API & Automatisierung', 'IT/ERP Verstaendnis', 'Git-basierte Kollaboration'],
      openTo: ['Data & AI', 'Software Developer', 'Backend Developer', 'IT', 'Industrie-Ingenieur'],
      highlight: 'Ich entwickle mich t├ñglich in Data, Automatisierung, industrieller Digitalisierung und BI weiter.',
    },
    skillMatrix: [
      { name: 'Power BI / DAX', level: 'Fortgeschritten', tools: ['Star Schema', 'KPI', 'Gateway'] },
      { name: 'Python / PyTorch', level: 'Mittel', tools: ['CNN', 'Pipelines', 'Eval'] },
      { name: 'SQL', level: 'Mittel', tools: ['Query Optimize', 'Joins', 'CTE'] },
      { name: 'Automation', level: 'Mittel', tools: ['Zapier', 'Airtable', 'Slack'] },
      { name: 'Cloud & DevOps', level: 'Basis', tools: ['AWS', 'Docker', 'CI/CD'] },
    ],
    toolbelt: ['Python', 'PyTorch', 'Power BI', 'SQL', 'DAX', 'Zapier', 'Airtable', 'Docker', 'AWS', 'SAP Fiori'],
    cv: { link: '/Baha_Buyukates_CV.pdf', updated: 'Dec 2025', label: 'CV herunterladen' },
  },
  EN: {
    nav: {
      about: 'About',
      experience: 'Experience',
      projects: 'Projects',
      skills: 'Skills',
      contact: 'Contact',
    },
    brandEyebrow: 'Computer Engineer | Data/Software/IT/Industrial',
    welcome: '',
    hero: {
      eyebrow: 'Welcome',
      titleMain: 'Computer Engineer,',
      titleAccent: ' focused on data, software, IT, and industrial systems',
      lede:
        'I focus on data-centric systems; I build the data itself, the processes that generate it, and the surrounding software/integration layers together. My main focus is data.',
      ctas: { browse: 'Browse projects', collaborate: "Let's build together" },
    },
    heroMeta: ['EU citizen', 'No visa sponsorship required', 'Immediate availability'],
    heroPanel: {
      status: 'Live status',
      focus: 'Focus areas',
      profileEyebrow: 'Profile',
      profileItems: [
        'Data Analysis & BI: Power BI, Excel, SQL, DAX, KPI (MTTR, MTBF, OEE)',
        'AI & ML: PyTorch, TensorFlow, CNNs, LLM training',
        'DevOps: AWS, Docker, Kubernetes, Jenkins, CI/CD',
      ],
      labels: ['Data', 'Industrial 4.0', 'Software&IT', 'BI'],
    },
    projectsNote: 'You can follow my smaller/learning projects live on my GitHub.',
    projectsNoteCta: 'Contact me',
    sections: {
      experience: {
        eyebrow: 'Professional Experience',
        title: 'What I delivered',
        text: 'Hands-on work bridging AI training, data analytics, and enterprise IT.',
      },
      skills: {
        eyebrow: 'What I offer',
        title: 'Skill set',
        text: 'Capabilities that connect data, AI, automation, and enterprise processes.',
      },
      projects: {
        eyebrow: 'Featured projects',
        title: 'Projects blending imagination and craft',
        text: 'Performance and UX together, with clear outcomes.',
      },
      education: {
        eyebrow: 'Education',
        title: 'Foundation and depth',
        text: 'Computer Engineering degree and an AI-focused bootcamp.',
      },
      certifications: {
        eyebrow: 'Certifications & Languages',
        title: 'Continuous learning',
        text: 'Recent credentials in cloud, data, AI, and industrial automation; multilingual communication.',
      },
      hobby: {
        eyebrow: 'Hobby',
        title: 'Music production: ',
        text: "writing djent and progressive metal pieces and covering existing songs. It's a core passion; I blend it with technical execution to make distinct, recognizable work.",
        benefit:
          'Discipline, rhythmic focus, and detail orientation from music directly translate to my professional projects.',
        cta: 'Want to listen?',
      },
      contact: {
        eyebrow: 'Contact',
        title: 'Ready for a new project.',
        text: 'For data analysis, dashboards, AI training, or automation, feel free to reach out.',
      },
    },
    feedback: {
      cta: 'Leave feedback',
      reminder: 'You have been here about 30s ÔÇö want to rate the page?',
      title: 'Did you like it?',
      subtitle: 'Rate 1-5 stars; add a note if you want.',
      ratingLabel: 'Star',
      moodQuestion: 'Quick pick',
      like: 'Liked it',
      dislike: "Didn't like",
      commentPlaceholder: 'What worked / what can improve?',
      storageNote: '',
      submit: 'Send',
      thanks: 'Thanks, saved!',
      averageLabel: 'Average',
      recentTitle: 'Stored feedback (local)',
      empty: 'Nothing yet.',
      copy: 'Copy to clipboard',
      copied: 'Copied!',
    },
    experience: [
      {
        company: 'Outlier',
        role: 'AI Trainer',
        location: 'Remote',
        period: 'Oct 2025 - Present',
        bullets: [
          'Train and evaluate LLMs to improve code generation and reasoning.',
          'Ensure quality across data annotation, prompt engineering, and QA.',
        ],
        impact: 'Raised LLM quality scores; fewer wrong answers.',
      },
      {
        company: 'Prestij Bilgi Sistemleri Arge A.S.',
        role: 'C#.NET Developer Intern',
        location: 'Bursa, Turkiye (Hybrid)',
        period: 'Aug 2024 - Sep 2024',
        bullets: [
          'Built capstone-level HIS modules with .NET and SQL, delivering scalable and secure components.',
          'Collaborated via Git for code reviews and versioning within virtual teams.',
          'Deepened understanding of data security, performance tuning, and compliance for hospital information systems.',
          'Documented troubleshooting and preventive maintenance to keep systems reliable.',
        ],
        impact: 'Sped up HIS/report queries and kept them stable.',
      },
      {
        company: 'Sanofi',
        role: 'IT Intern',
        location: 'Luleburgaz, Turkiye',
        period: 'Jul 2024',
        bullets: [
          'Hands-on in hardware repair, network maintenance, and core IT operations while growing SAP/database skills.',
          'Explored SAP S/4HANA and SAP Fiori core modules in an ERP context.',
          'Learned how SAP ties into finance, supply chain, and HR processes; practiced workflow customization.',
        ],
        impact: 'Met SLA while shortening ticket closure time.',
      },
      {
        company: 'Kirklareli State Hospital',
        role: 'IT Intern',
        location: 'Kirklareli, Turkiye',
        period: 'Aug 2023 - Sep 2023',
        bullets: [
          'Provided hardware and networking support, reducing workstation downtime.',
          'Executed baseline maintenance and troubleshooting for IT operations.',
        ],
        impact: 'Cut downtime and sped up onsite fixes.',
      },
    ],
    skills: [
      {
        title: 'Data Analysis & BI',
        items: ['Power BI', 'Excel', 'SQL', 'DAX', 'Star Schema', 'KPI Reporting'],
        detail: 'I turn data into decision-ready dashboards and measurable KPIs.',
      },
      {
        title: 'Programming',
        items: ['Python', 'C', 'C#', 'JavaScript', 'SQL'],
        detail: 'Writing clean, maintainable, and testable code across stacks.',
      },
      {
        title: 'AI & Machine Learning',
        items: ['PyTorch', 'TensorFlow', 'Scikit-Learn', 'OpenCV', 'CNNs', 'LLM Training'],
        detail: 'Training, evaluation, and user-facing AI that delivers meaningful outputs.',
      },
      {
        title: 'Industry 4.0 & IoT',
        items: ['PLC', 'SCADA', 'OPC UA', 'MQTT', 'Edge Devices', 'Digitalization', 'IoT Protocols'],
        detail:
          'Move field data securely into cloud and dashboard layers; experienced with PLC, SCADA, OPC UA, MQTT, bus/protocol integrations, and edge devices.',
      },
      {
        title: 'DevOps & Cloud',
        items: ['AWS', 'Docker', 'Kubernetes', 'Jenkins', 'CI/CD'],
        detail: 'Automation pipelines and container strategies that speed delivery.',
      },
      {
        title: 'Enterprise Solutions',
        items: ['SAP S/4HANA', 'SAP Fiori'],
        detail: 'Integrations and developments aligned with enterprise processes.',
      },
    ],
    projects: [
      {
        title: 'Smart Factory Digitalization Platform',
        description:
          '8k-row synthetic manufacturing data (temperature, line speed, shift, operator experience, machine age); IQR outlier removal + standardization + One-Hot for defect (0/1). Logistic Regression (interpretable) and Random Forest (non-linear) produce ROC-AUC, classification report, and feature importance. MESÔÇôERP integration feeds plan-fulfillment/delay/scrap KPIs as features.',
        summary:
          'Shows with metrics and charts how shop-floor parameters drive defect risk; end-to-end Industry 4.0 data/ML pipeline via scripts and notebook.',
        stack: 'Python, Scikit-Learn, Pandas, Matplotlib, Seaborn, Jupyter',
        link: 'https://github.com/JegBaha/ai-process-optimization',
        github: 'https://github.com/JegBaha/mes-erp-integration',
        live: '#',
        tags: ['ML', 'Industry 4.0', 'Data', 'Analytics'],
        image: '/projects/smart-factory-digitalization.webp',
        impact:
          'Combines plan-vs-actual KPIs with shop-floor parameters in one model to highlight actions that reduce defects.',
      },
      {
        title: 'Industry 4.0 IoT Predictive Maintenance Platform',
        description:
          'Node-RED OPC UA simulation -> MQTT -> Python ETL into Postgres star schema; PyTorch LSTM for failure likelihood; Power BI dashboards plus multilingual web UI. Docker Compose deploy, TLS/MQTT optional, data validation for an end-to-end prototype.',
        summary:
          'Simulated shopfloor stream, data warehouse, and failure-prediction pipeline; KPI dashboards for OEE/MTTR/MTTF. Still in production/Iterative prototype.',
        stack: 'Node-RED, MQTT, Postgres, Python, PyTorch, Power BI, Docker',
        link: 'https://github.com/JegBaha?tab=repositories',
        github: 'https://github.com/JegBaha?tab=repositories',
        live: '#',
        tags: ['IoT', 'Data', 'ML', 'Ops'],
        image: '/projects/industry-40-iot-predictive-maintenance.webp',
        impact: 'Collects field data on AWS free tier and surfaces predictions + KPIs in the dashboard.',
      },
      {
        title: 'Heart Disease Prediction with ML',
        description:
          'Cleaned/encoded/normalized the Heart Failure Prediction dataset, compared KNN, Logistic Regression, and Decision Trees; evaluated via accuracy, precision, recall, and F1 to predict heart-disease likelihood.',
        summary: 'Data preprocessing, multi-model testing, healthcare-focused risk prediction.',
        stack: 'Scikit-Learn, Python, ML',
        link: 'https://github.com/JegBaha?tab=repositories',
        github: 'https://github.com/JegBaha?tab=repositories',
        live: '#',
        tags: ['ML', 'Data Analysis', 'Healthcare'],
        image: '/projects/heart-disease-prediction-ml.webp',
        impact: 'Targeted better sensitivity for early warning.',
      },
      {
        title: 'NeuraVeil - MRI Tumor Classification',
        description:
          'Trained EfficientNet, DenseNet, ResNet, etc., with transfer learning + Optuna; OpenCV preprocessing, class balancing, L2/dropout. Achieved high accuracy across tumor types with REST API for integration.',
        summary:
          'End-to-end MRI pipeline with ensemble models and production-ready APIs for healthcare.',
        stack: 'PyTorch, TensorFlow, CNN',
        link: 'https://github.com/JegBaha?tab=repositories',
        github: 'https://github.com/JegBaha?tab=repositories',
        live: '#',
        tags: ['AI', 'Computer Vision', 'Healthcare'],
        image: '/projects/neuraveil-mri-tumor.webp',
        impact: 'Improved false positive/negative balance.',
      },
      {
        title: 'Drumveil Ritual - Metal Drum Transcription',
        description:
          "PyTorch + Demucs for source separation on metal tracks; 'Onsets and Frames' extracts drum notes to MIDI. Uses Slakh data and real recordings with a spectrogram approach for heavy rhythms. Hardware constraints keep it in maintenance/Iterative prototype; currently only a few-second drum snippets transcribed successfully.",
        summary:
          'Source separation and note extraction tailored to metal drum patterns; Iterative prototype/maintenance due to hardware limits, short snippets validated.',
        stack: 'PyTorch, Demucs, Audio DSP',
        link: 'https://github.com/JegBaha?tab=repositories',
        github: 'https://github.com/JegBaha?tab=repositories',
        live: '#',
        tags: ['Audio', 'AI', 'Python', 'Iterative prototype'],
        image: '/projects/drumveil-ritual-metal-drums.webp',
        impact:
          'Cuts manual transcription from hours to minutes; a few-second clips confirmed, full-length pending hardware upgrade.',
      },
      {
        title: 'Employee Management System (.NET)',
        description:
          'Simple .NET employee management: CRUD, roles, leave/attendance, SQL backend; tested during internship with real scenarios.',
        summary: 'C#.NET HR/employee app with CRUD and reporting.',
        stack: 'C#.NET, SQL, Entity Framework',
        link: 'https://github.com/JegBaha/StajEmployeeManagement',
        github: 'https://github.com/JegBaha/StajEmployeeManagement',
        live: '#',
        tags: ['.NET', 'C#', 'SQL'],
        image: '',
        impact: 'Approvals and leave tracking noticeably faster.',
      },
      {
        title: 'Excel VBA Automation Toolkit (Prototype / Demo)',
        description:
          'Modular Excel VBA automation toolkit: reads SAP CSV via Config, runs Raw ÔåÆ Staging flow, auto-refreshes dashboards/pivots. Centralized logging/error handling, Config-driven EN/TR UserForm UI, and multi-source import (CSV/JSON/Excel).',
        summary:
          'Configurable Prototype / Demo with mock SAP export and JSON datasets; auto log cleanup and dashboard refresh built-in.',
        stack: 'Excel VBA, Office Automation, SAP CSV, JSON',
        link: 'https://github.com/JegBaha?tab=repositories',
        github: 'https://github.com/JegBaha?tab=repositories',
        live: '#',
        tags: ['Prototype / Demo', 'Excel VBA', 'Automation'],
        image: '/projects/excel-vba-automation.webp',
        impact: 'Applied project in modular VBA architecture, centralized error capture, and config management.',
        playground: true,
      },
      {
        title: '3D Runner Game',
        description: 'Solo Unity/C# project; 3D runner with quick iterations on levels and physics.',
        summary: 'Prototype / Demo focused on asset handling and gameplay loop.',
        stack: 'Unity, C#',
        link: 'https://github.com/JegBaha?tab=repositories',
        github: 'https://github.com/JegBaha?tab=repositories',
        live: '#',
        tags: ['Game', 'C#', 'Unity', 'Prototype / Demo'],
        image: '',
        impact: 'Solo build; better pipeline and iteration speed.',
        playground: true,
      },
      {
        title: 'Galaxy Survivor 2D Game',
        description: 'Unity 2D shooter built solo; enemy waves, levels, and quick turnaround.',
        summary: '2D loop, simple enemy logic, and asset integration Prototype / Demo.',
        stack: 'Unity, C#',
        link: 'https://github.com/JegBaha?tab=repositories',
        github: 'https://github.com/JegBaha?tab=repositories',
        live: '#',
        tags: ['Game', 'C#', 'Unity', 'Prototype / Demo'],
        image: '',
        impact: 'Applied project for fast prototyping and asset integration.',
        playground: true,
      },
      {
        title: '3D First Person Shooter Game',
        description:
          'FPS/puzzle built in 2.5 weeks with a 3-person team; level design, simple AI, and interactive environments.',
        summary: 'MVP via rapid prototyping and clear team role split; compact Prototype / Demo build.',
        stack: 'Unity, C#',
        link: 'https://github.com/JegBaha?tab=repositories',
        github: 'https://github.com/JegBaha?tab=repositories',
        live: '#',
        tags: ['Game', 'C#', 'Unity', 'Prototype / Demo'],
        image: '',
        impact: 'Delivered a team MVP in ~2.5 weeks; coordination boost.',
        playground: true,
      },
    ],
    education: [
      {
        school: 'Trakya University',
        degree: 'Bachelor of Engineering, Computer Engineering',
        location: 'Edirne, Turkiye',
        period: 'Sep 2021 - Sep 2025',
      },
      {
        school: 'GEN Academy',
        degree: 'AI Software Development & Artificial Intelligence',
        location: 'Remote',
        period: 'Sep 2024 - Jun 2025',
      },
    ],
    certifications: [
      'AWS for DevOps: Continuous Delivery and Automation',
      'Jenkins, Kubernetes, Docker',
      'Microsoft Azure AI Essentials',
      'Apache Spark Essentials',
      'LLM Foundations & RAG',
      'Industrial automation & IoT certs (PLC, SCADA, OPC UA, MQTT)',
      'See more on LinkedIn: https://www.linkedin.com/in/baha-buyukates',
    ],
    languages: [
      { name: 'Turkish', level: 'Native' },
      { name: 'English', level: 'B2' },
      { name: 'German', level: 'A2' },
    ],
    about: {
      eyebrow: 'About',
      title: 'Working and learning across data, software, IT, and industrial contexts.',
      bio: "I'm interested not just in analyzing data, but in how it's produced, moved, and turned into meaningful decisions. As I grow in software, backend, automation, and industrial integration, I keep data at the center of every layer. My goal: turn shop-floor data into reliable, scalable, decision-support systems.",
      strengths: ['Data storytelling & BI', 'ML/CNN training and evaluation', 'Backend/API and automation', 'IT/ERP awareness', 'Git-first teamwork'],
      openTo: ['Data & AI', 'Software Developer', 'Backend Developer', 'IT', 'Industrial Engineer'],
      highlight: 'I keep improving daily across data, automation, industrial digitalization, and BI.',
    },
    skillMatrix: [
      { name: 'Power BI / DAX', level: 'Advanced', tools: ['Star Schema', 'KPI', 'Gateway'] },
      { name: 'Python / PyTorch', level: 'Intermediate', tools: ['CNN', 'Pipelines', 'Evaluation'] },
      { name: 'SQL', level: 'Intermediate', tools: ['Query Optimize', 'Joins', 'CTE'] },
      { name: 'Automation', level: 'Intermediate', tools: ['Zapier', 'Airtable', 'Slack'] },
      { name: 'Cloud & DevOps', level: 'Basic', tools: ['AWS', 'Docker', 'CI/CD'] },
    ],
    toolbelt: ['Python', 'PyTorch', 'Power BI', 'SQL', 'DAX', 'Zapier', 'Airtable', 'Docker', 'AWS', 'SAP Fiori'],
    cv: { link: '/Baha_Buyukates_CV.pdf', updated: 'Dec 2025', label: 'Download CV (updated Dec 2025)' },
  },
}

function App() {
  const [activeLocale, setActiveLocale] = useState<Locale>('TR')
  const [showWelcome, setShowWelcome] = useState(true)
  const [welcomePhase, setWelcomePhase] = useState<'enter' | 'dusting'>('enter')
  const [isDrawerOpen, setIsDrawerOpen] = useState(false)
  const [activeSection, setActiveSection] = useState<string>('hero')
  const [selectedTag, setSelectedTag] = useState<string>(() =>
    activeLocale === 'TR' ? 'Hepsi' : activeLocale === 'DE' ? 'Alle' : 'All',
  )
  const [activeProjectDetail, setActiveProjectDetail] = useState<Project | null>(null)
  const [audioActive, setAudioActive] = useState(false)
  const [audioStarted, setAudioStarted] = useState(false)
  const [volume, setVolume] = useState(0.1)
  const [duration, setDuration] = useState(0)
  const [currentTime, setCurrentTime] = useState(0)
  const audioRef = useRef<HTMLAudioElement | null>(null)
  const analyserRef = useRef<AnalyserNode | null>(null)
  const rafRef = useRef<number | null>(null)
  const flashRef = useRef(0)
  const sideRef = useRef(1)
  const [feedbackOpen, setFeedbackOpen] = useState(false)
  const [feedbackReminder, setFeedbackReminder] = useState(false)
  const [feedbackRating, setFeedbackRating] = useState<number | null>(null)
  const [feedbackMood, setFeedbackMood] = useState<FeedbackMood>(null)
  const [feedbackNote, setFeedbackNote] = useState('')
  const [feedbackEntries, setFeedbackEntries] = useState<FeedbackEntry[]>([])
  const [feedbackSaved, setFeedbackSaved] = useState(false)
  const [feedbackError, setFeedbackError] = useState('')
  const [copyToast, setCopyToast] = useState(false)
  const [moonPhase, setMoonPhase] = useState<'hidden' | 'enter' | 'leave'>('hidden')
  const moonTimerRef = useRef<number | null>(null)
  const moonVisible = moonPhase !== 'hidden'
  const [bgPlaying, setBgPlaying] = useState(false)
  const [bgControlsOpen, setBgControlsOpen] = useState(false)
  const [bgVolume, setBgVolume] = useState(0)
  const [bgVolumeTouched, setBgVolumeTouched] = useState(false)
  const [fallingStars, setFallingStars] = useState<{ id: number; left: string; duration: number }[]>([])
  const [showScrollTop, setShowScrollTop] = useState(false)
  const [isMobile, setIsMobile] = useState(false)
  const [reduceMotion, setReduceMotion] = useState(false)
  const [bgLoading, setBgLoading] = useState(false)
  const [audioLoading, setAudioLoading] = useState(false)
  const sparkleField = useMemo(
    () =>
      Array.from({ length: 16 }, (_, id) => ({
        id,
        top: `${Math.random() * 100}%`,
        left: `${Math.random() * 100}%`,
        delay: `${Math.random() * 6}s`,
        duration: `${6 + Math.random() * 6}s`,
        scale: 0.6 + Math.random() * 0.6,
      })),
    [],
  )
  const motionScale = reduceMotion ? 0.25 : isMobile ? 0.7 : 1

  const cosmicDust = useMemo(
    () =>
      Array.from({ length: Math.max(12, Math.round(90 * motionScale)) }, (_, id) => ({
        id,
        top: `${Math.random() * 100}%`,
        left: `${Math.random() * 100}%`,
        delay: `${Math.random() * 8}s`,
        duration: `${12 + Math.random() * 10}s`,
        scale: 0.26 + Math.random() * 0.35,
        driftX: `${(Math.random() * 12 - 6).toFixed(1)}px`,
        driftY: `${(Math.random() * 16 - 8).toFixed(1)}px`,
      })),
    [motionScale],
  )
  const shootingStars = useMemo(
    () =>
      Array.from({ length: Math.max(1, Math.round(5 * motionScale)) }, (_, id) => ({
        id,
        top: `${Math.random() * 80 + 5}%`,
        delay: `${Math.random() * 30}s`,
        duration: `${55 + Math.random() * 10}s`,
        skew: `${(Math.random() * 12 - 6).toFixed(1)}deg`,
      })),
    [motionScale],
  )
  const comets = useMemo(
    () =>
      Array.from({ length: Math.max(1, Math.round(3 * motionScale)) }, (_, id) => ({
        id,
        top: `${Math.random() * 70 + 10}%`,
        delay: `${Math.random() * 18 + id * 8}s`,
        duration: `${18 + Math.random() * 8}s`,
        rotation: `${(Math.random() * 8 - 4).toFixed(1)}deg`,
      })),
    [motionScale],
  )
  const cosmicPlanets = useMemo(
    () =>
      Array.from({ length: Math.max(1, Math.round(2 * motionScale)) }, (_, id) => ({
        id,
        size: 120 + Math.random() * 80,
        top: `${Math.random() * 50 + 15}%`,
        left: `${Math.random() * 70 + 8}%`,
        hue: `${Math.random() * 28 - 12}deg`,
        delay: `${Math.random() * 3}s`,
        duration: `${24 + Math.random() * 10}s`,
      })),
    [motionScale],
  )
  const bgAudioRef = useRef<HTMLAudioElement | null>(null)
  const dustPieces = useMemo(
    () =>
      Array.from({ length: 36 }, (_, id) => ({
        id,
        top: `${Math.random() * 100}%`,
        left: `${Math.random() * 100}%`,
        delay: `${Math.random() * 0.6}s`,
        scale: 0.5 + Math.random() * 0.9,
      })),
    [],
  )
  const c = content[activeLocale]
  const tagAllLabel = useMemo(
    () => (activeLocale === 'TR' ? 'Hepsi' : activeLocale === 'DE' ? 'Alle' : 'All'),
    [activeLocale],
  )

  useEffect(() => {
    setSelectedTag(tagAllLabel)
  }, [tagAllLabel])

  const allTags = [tagAllLabel, ...new Set(c.projects.flatMap((p) => p.tags))]
  const hobbyNavLabel = activeLocale === 'TR' ? 'Hobim' : 'Hobby'
  const filteredProjects =
    selectedTag === tagAllLabel || !allTags.includes(selectedTag)
      ? c.projects
      : c.projects.filter((p) => p.tags.includes(selectedTag))

  const learningList =
    activeLocale === 'TR'
      ? ['Kafka & event-driven pipelines', 'MLOps (model versioning/monitoring)', 'Power BI performance tuning', 'German B1 roadmap']
      : activeLocale === 'DE'
      ? ['Kafka & Event-Driven', 'MLOps (Versionierung/Monitoring)', 'Power BI Performance-Tuning', 'Deutsch B1 Roadmap']
      : ['Kafka & event-driven', 'MLOps (versioning/monitoring)', 'Power BI performance tuning', 'German B1 roadmap']

  const roleCtaList =
    activeLocale === 'TR'
      ? [
          'Junior Data / BI Engineer ariyorsaniz konusalim.',
          'Industry 4.0 + Data entegrasyonu gerekiyorsa destek olabilirim.',
          'Backend + otomasyon geli┼ştirici ariyorsaniz ulasin.',
        ]
      : activeLocale === 'DE'
      ? [
          'Wenn Sie einen Junior Data / BI Engineer suchen, sprechen wir.',
          'Industry 4.0 + Data Integration? Ich kann helfen.',
          'Backend + Automatisierung Entwickler gesucht? Melde dich.',
        ]
      : [
          'If you need a Junior Data / BI Engineer, letÔÇÖs talk.',
          'If you need Industry 4.0 + Data integration, I can help.',
          'If you want a backend + automation engineer, reach out.',
        ]

  const defaultExperienceImpact =
    activeLocale === 'DE'
      ? 'Business Impact: Prozessgeschwindigkeit und Qualitaet verbessert.'
      : activeLocale === 'EN'
      ? 'Business impact: improved delivery speed/quality.'
      : 'Is etkisi: teslim hizi ve kalitesi iyilesti.'

  const defaultProjectImpact =
    activeLocale === 'DE'
      ? 'Business Impact: Effizienz/Genauigkeit gesteigert, manuelle Arbeit reduziert.'
      : activeLocale === 'EN'
      ? 'Business impact: improved efficiency/accuracy, reduced manual work.'
      : 'Is etkisi: verim ve dogruluk artisi, manuel is azalmasi.'

  const sectionIdsToTrack = useMemo(
    () => ['hero', 'about', 'experience', 'skills', 'projects', 'education', 'certifications', 'hobby', 'contact'],
    [],
  )
  const sectionLabels =
    activeLocale === 'DE'
      ? {
          hero: 'Willkommen',
          about: '├£ber mich',
          experience: 'Erfahrung',
          skills: 'Skills',
          projects: 'Projekte',
          education: 'Ausbildung',
          certifications: 'Zertifikate',
          hobby: 'Hobby',
          contact: 'Kontakt',
        }
      : activeLocale === 'EN'
      ? {
          hero: 'Welcome',
          about: 'About',
          experience: 'Experience',
          skills: 'Skills',
          projects: 'Projects',
          education: 'Education',
          certifications: 'Certifications',
          hobby: 'Hobby',
          contact: 'Contact',
        }
      : {
          hero: 'Ho┼ş geldin',
          about: 'Hakk─▒mda',
          experience: 'Deneyim',
          skills: 'Yetenekler',
          projects: 'Projeler',
          education: 'E─şitim',
          certifications: 'Sertifikalar',
          hobby: 'Hobim',
          contact: '─░leti┼şim',
        }

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)
        if (visible[0]) {
          setActiveSection(visible[0].target.id)
        }
      },
      { threshold: [0.35, 0.6], rootMargin: '-10% 0px -25% 0px' },
    )

    sectionIdsToTrack.forEach((id) => {
      const el = document.getElementById(id)
      if (el) observer.observe(el)
    })

    return () => observer.disconnect()
  }, [sectionIdsToTrack])

  const indicatorLabel = sectionLabels[activeSection as keyof typeof sectionLabels] ?? sectionLabels.hero

  const projectUiCopy =
    activeLocale === 'DE'
      ? { open: 'Details: bitte am Desktop/Web ansehen', close: 'Schlie├şen' }
      : activeLocale === 'EN'
      ? { open: 'Details: switch to desktop/web view', close: 'Close' }
      : { open: 'Detaylar icin Desktop/Web g├Âr├╝n├╝m├╝', close: 'Kapat' }

  const getProjectPreview = (project: Project): string => {
    const base = project.summary || project.description
    return base.length > 140 ? `${base.slice(0, 137)}...` : base
  }

  const getProjectMediaStyle = (title: string): CSSProperties | undefined => {
    const t = title.toLowerCase()
    if (t.includes('industry 4.0') || t.includes('industrie 4.0') || t.includes('endustri 4.0')) {
      return { background: 'linear-gradient(135deg, rgba(56, 161, 105, 0.28), rgba(17, 94, 89, 0.24))' }
    }
    if (t.includes('drumveil')) {
      return { background: 'linear-gradient(135deg, rgba(234, 179, 8, 0.32), rgba(202, 138, 4, 0.22))' }
    }
    return undefined
  }

  const getProjectAccentClass = (title: string): string => {
    const t = title.toLowerCase()
    if (t.includes('industry 4.0') || t.includes('industrie 4.0') || t.includes('endustri 4.0')) {
      return 'mini-dot mini-dot-industry'
    }
    if (t.includes('drumveil')) {
      return 'mini-dot mini-dot-drumveil'
    }
    return 'mini-dot'
  }

  const welcomeOverlayCopy = { title: 'Ho┼ş geldin / Welcome / Willkommen', subtitle: 'Hope your day is going well.' }

  const playerCopy =
    activeLocale === 'DE'
      ? { nowPlaying: 'Laeuft', remaining: 'Rest', stop: 'Stop', volume: 'Laut' }
      : activeLocale === 'EN'
      ? { nowPlaying: 'Now playing', remaining: 'Remaining', stop: 'Stop', volume: 'Vol' }
      : { nowPlaying: 'Calan parca', remaining: 'Kalan', stop: 'Durdur', volume: 'Ses' }

  const audioUiCopy =
    activeLocale === 'DE'
      ? {
          hobbyLoading: 'L├ñdt...',
          hobbyPlaying: 'Spielt',
          hobbyReady: 'Bereit',
          musicLoading: 'Musik l├ñdt...',
          musicOn: 'Musik aus',
          musicOff: 'Musik an',
          musicStatusLoading: 'Bereitet vor',
          musicStatusOn: 'L├ñuft',
          musicStatusOff: 'Aus',
        }
      : activeLocale === 'EN'
      ? {
          hobbyLoading: 'Loading...',
          hobbyPlaying: 'Playing',
          hobbyReady: 'Ready',
          musicLoading: 'Music loading...',
          musicOn: 'Turn music off',
          musicOff: 'Turn music on',
          musicStatusLoading: 'Preparing',
          musicStatusOn: 'Playing',
          musicStatusOff: 'Off',
        }
      : {
          hobbyLoading: 'Yukleniyor...',
          hobbyPlaying: '├çal─▒yor',
          hobbyReady: 'Haz─▒r',
          musicLoading: 'Muzik yukleniyor...',
          musicOn: 'Muzigi kapat',
          musicOff: 'Muzigi a├ğ',
          musicStatusLoading: 'Haz─▒rlan─▒yor',
          musicStatusOn: '├çal─▒yor',
          musicStatusOff: 'Kapal─▒',
        }

  const trackMeta = { title: 'Nocturne', artist: 'JegBaa' }
  const trackSrc = '/track-new.mp3?v=1' // cache-bust to force new audio
  const remainingTime = Math.max(duration - currentTime, 0)
  const progressMax = Math.max(duration, currentTime, 0.1)
  const feedbackCopy = c.feedback
  const feedbackAverage =
    feedbackEntries.length === 0
      ? '-'
      : (
          feedbackEntries.reduce((sum, entry) => sum + entry.rating, 0) / Math.max(1, feedbackEntries.length)
        ).toFixed(1)
  const feedbackCountLabel =
    activeLocale === 'DE'
      ? `${feedbackEntries.length} gespeichert`
      : activeLocale === 'EN'
      ? `${feedbackEntries.length} saved`
      : `${feedbackEntries.length} kay─▒t`
  const recentFeedback = feedbackEntries.slice(0, 3)
  const ratingRequiredCopy =
    activeLocale === 'DE'
      ? 'Bitte Sterne w├ñhlen.'
      : activeLocale === 'EN'
      ? 'Please pick a star rating.'
      : 'L├╝tfen bir y─▒ld─▒z se├ğin.'
  const laterLabel = activeLocale === 'DE' ? 'Sp├ñter' : activeLocale === 'EN' ? 'Later' : 'Sonra'

  useEffect(() => {
  const title = `Baha B├╝y├╝kate┼ş | ${c.hero.eyebrow}`
    document.title = title
    const metaPairs: { name?: string; property?: string; content: string }[] = [
      { name: 'description', content: c.hero.lede },
      { property: 'og:title', content: title },
      { property: 'og:description', content: c.hero.lede },
      {
        property: 'og:image',
        content: 'https://images.unsplash.com/photo-1483478550801-ceba5fe50e8e?auto=format&fit=crop&w=1200&q=80',
      },
    ]
    metaPairs.forEach(({ name, property, content }) => {
      if (!name && !property) return
      const selector = name ? `meta[name=\"${name}\"]` : `meta[property=\"${property}\"]`
      let tag = document.head.querySelector(selector) as HTMLMetaElement | null
      if (!tag) {
        tag = document.createElement('meta')
        if (name) tag.setAttribute('name', name)
        if (property) tag.setAttribute('property', property)
        document.head.appendChild(tag)
      }
      tag.setAttribute('content', content)
    })
    if ('sendBeacon' in navigator) {
      navigator.sendBeacon(
        '/analytics',
        JSON.stringify({ event: 'page_view', locale: activeLocale, ts: Date.now() }),
      )
    }
  }, [activeLocale, c.hero.eyebrow, c.hero.lede])

  const scrollToSection = (id: string, event?: ReactMouseEvent<HTMLElement>) => {
    if (event) event.preventDefault()
    const el = document.getElementById(id)
    if (!el) return

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const behavior: ScrollBehavior = prefersReducedMotion ? 'auto' : 'smooth'

    el.classList.remove('section-glow')
    void el.offsetWidth
    if (!prefersReducedMotion) {
      el.classList.add('section-glow')
      setTimeout(() => el.classList.remove('section-glow'), 1600)
    }

    el.scrollIntoView({ behavior, block: 'start' })
  }

  const handleNavClick = (id: string, event?: ReactMouseEvent<HTMLElement>) => {
    scrollToSection(id, event)
    setIsDrawerOpen(false)
  }

  const toggleDrawer = () => setIsDrawerOpen((open) => !open)

  const startAudioReactive = async () => {
    try {
      setAudioLoading(true)
      if (bgAudioRef.current) {
        bgAudioRef.current.pause()
        setBgPlaying(false)
      }
      if (audioActive) return
      if (audioRef.current) {
        audioRef.current.pause()
        audioRef.current.currentTime = 0
      }
      const audioEl = new Audio(trackSrc)
      audioEl.crossOrigin = 'anonymous'
      audioEl.preload = 'auto'
      audioEl.loop = false
      audioEl.volume = volume
      audioEl.onloadedmetadata = () => {
        if (Number.isFinite(audioEl.duration)) {
          setDuration(audioEl.duration)
        }
      }
      audioEl.ondurationchange = audioEl.onloadedmetadata
      audioEl.ontimeupdate = () => setCurrentTime(audioEl.currentTime)
      audioEl.onended = () => {
        setAudioActive(false)
        analyserRef.current = null
        flashRef.current = 0
        document.documentElement.style.setProperty('--flash-strength', '0')
        setCurrentTime(0)
        if (rafRef.current) {
          cancelAnimationFrame(rafRef.current)
          rafRef.current = null
        }
      }
      const AudioCtx = (window as any).AudioContext || (window as any).webkitAudioContext
      const ctx = new AudioCtx()
      const source = ctx.createMediaElementSource(audioEl)
      const analyser = ctx.createAnalyser()
      analyser.fftSize = 1024
      analyser.smoothingTimeConstant = 0.7
      source.connect(analyser)
      analyser.connect(ctx.destination)
      analyserRef.current = analyser
      audioRef.current = audioEl
      const data = new Uint8Array(analyser.frequencyBinCount)

      const tick = () => {
        if (!analyserRef.current) return
        analyserRef.current.getByteFrequencyData(data)
        const lowBins = data.slice(1, 30)
        const midBins = data.slice(30, 90)
        const lowAvg = lowBins.reduce((a, b) => a + b, 0) / lowBins.length / 255
        const midAvg = midBins.reduce((a, b) => a + b, 0) / midBins.length / 255
        const boosted = Math.pow(Math.min(1, lowAvg * 2.5), 1.2)
        const eased = Math.min(1, Math.max(0, boosted))
        document.documentElement.style.setProperty('--breath-intensity', eased.toString())

        const kickHit = lowAvg > 0.22
        const snareHit = midAvg > 0.18
        if (kickHit || snareHit) {
          flashRef.current = Math.min(1, flashRef.current + (kickHit ? 0.6 : 0.4))
          sideRef.current = sideRef.current === 1 ? -1 : 1
          const xPos = sideRef.current === 1 ? '78%' : '22%'
          const yPos = `${30 + Math.random() * 40}%`
          document.documentElement.style.setProperty('--flash-x', xPos)
          document.documentElement.style.setProperty('--flash-y', yPos)
        } else {
          flashRef.current *= 0.9
        }
        document.documentElement.style.setProperty('--flash-strength', flashRef.current.toString())
        rafRef.current = requestAnimationFrame(tick)
      }

      setDuration(Number.isFinite(audioEl.duration) ? audioEl.duration : 0)
      audioRef.current = audioEl
      audioEl.currentTime = 0
      audioEl.onended = () => {
        stopAudioReactive()
      }
      await audioEl.play()
      setAudioStarted(true)
      setAudioActive(true)
      triggerMoonEnter()
      tick()
    } catch (err) {
      console.error('Audio start failed', err)
      setAudioActive(false)
      triggerMoonLeave()
    } finally {
      setAudioLoading(false)
    }
  }

  const stopAudioReactive = () => {
    if (audioRef.current) {
      audioRef.current.pause()
      audioRef.current.currentTime = 0
      audioRef.current = null
    }
    if (rafRef.current) {
      cancelAnimationFrame(rafRef.current)
      rafRef.current = null
    }
    analyserRef.current = null
    setAudioActive(false)
    triggerMoonLeave()
    flashRef.current = 0
    document.documentElement.style.setProperty('--flash-strength', '0')
    setCurrentTime(0)
  }

  const handleVolumeChange = (value: number) => {
    const clamped = Math.max(0, Math.min(1, value))
    setVolume(clamped)
    if (audioRef.current) {
      audioRef.current.volume = clamped
    }
  }

  const handleSeekChange = (value: number) => {
    if (!audioRef.current || !Number.isFinite(duration) || duration === 0) return
    const clamped = Math.max(0, Math.min(duration, value))
    audioRef.current.currentTime = clamped
    setCurrentTime(clamped)
  }

  const triggerMoonEnter = () => {
    if (moonTimerRef.current) {
      window.clearTimeout(moonTimerRef.current)
      moonTimerRef.current = null
    }
    setMoonPhase('enter')
  }

  const triggerMoonLeave = () => {
    if (moonTimerRef.current) {
      window.clearTimeout(moonTimerRef.current)
      moonTimerRef.current = null
    }
    setMoonPhase('leave')
    moonTimerRef.current = window.setTimeout(() => {
      setMoonPhase('hidden')
      moonTimerRef.current = null
    }, 620)
  }

  const startBgAudio = async () => {
    if (reduceMotion) return
    try {
      setBgLoading(true)
      const targetVolume = bgVolume === 0 && !bgVolumeTouched ? 0.05 : bgVolume
      if (targetVolume <= 0) {
        stopBgAudio()
        return
      }
      if (bgVolume !== targetVolume) {
        setBgVolume(targetVolume)
      }
      setBgVolumeTouched(true)
      if (bgPlaying) return
      if (!bgAudioRef.current) {
        const audio = new Audio('/bg-music.mp3?v=2')
        audio.loop = true
        audio.preload = 'auto'
        audio.autoplay = true
        audio.playsInline = true
        audio.volume = targetVolume
        bgAudioRef.current = audio
      } else {
        bgAudioRef.current.currentTime = 0
        bgAudioRef.current.volume = targetVolume
      }
      const audio = bgAudioRef.current
      const tryPlay = async () => {
        if (!audio) throw new Error('no audio element')
        audio.muted = false
        audio.volume = targetVolume
        await audio.play()
      }
      try {
        await tryPlay()
        setBgPlaying(true)
      } catch (err) {
        console.warn('BG play blocked, retry muted', err)
        if (!audio) throw err
        audio.muted = true
        audio.volume = 0
        await audio.play()
        audio.muted = false
        audio.volume = targetVolume
        setBgPlaying(true)
      }
    } catch (err) {
      console.error('BG audio failed', err)
      setBgPlaying(false)
    } finally {
      setBgLoading(false)
    }
  }

  const stopBgAudio = () => {
    if (bgAudioRef.current) {
      bgAudioRef.current.pause()
      bgAudioRef.current.currentTime = 0
    }
    setBgPlaying(false)
    setBgLoading(false)
  }

  const toggleBgControls = () => {
    setBgControlsOpen((open) => !open)
  }

  const handleBgVolume = (value: number) => {
    const clamped = Math.max(0, Math.min(1, value))
    setBgVolumeTouched(true)
    setBgVolume(clamped)
    if (bgAudioRef.current) {
      bgAudioRef.current.volume = clamped
    }
    if (clamped === 0) {
      stopBgAudio()
    }
  }

  const formatTime = (value: number) => {
    if (!Number.isFinite(value) || value < 0) return '0:00'
    const minutes = Math.floor(value / 60)
    const seconds = Math.floor(value % 60)
    return `${minutes}:${seconds.toString().padStart(2, '0')}`
  }

  const handleContactSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)
    const name = formData.get('name')?.toString() ?? ''
    const email = formData.get('email')?.toString() ?? ''
    const message = formData.get('message')?.toString() ?? ''
    const subject = encodeURIComponent('Project inquiry')
    const body = encodeURIComponent(`Name: ${name}\nEmail: ${email}\n\n${message}`)
    window.location.href = `mailto:bahabuyukates@gmail.com?subject=${subject}&body=${body}`
  }

  const handleFeedbackSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (feedbackRating === null) {
      setFeedbackError(ratingRequiredCopy)
      return
    }
    const entry: FeedbackEntry = {
      id: `fb-${Date.now().toString(36)}`,
      rating: feedbackRating,
      mood: feedbackMood,
      comment: feedbackNote.trim(),
      locale: activeLocale,
      createdAt: Date.now(),
    }
    setFeedbackEntries((prev) => [entry, ...prev].slice(0, 50))
    setFeedbackSaved(true)
    setFeedbackError('')
    setFeedbackReminder(false)
    setFeedbackRating(null)
    setFeedbackMood(null)
    setFeedbackNote('')
    setTimeout(() => setFeedbackSaved(false), 1800)
  }

  const openFeedback = () => {
        setFeedbackReminder(false)
    try {
      localStorage.setItem('feedback_prompt_seen', '1')
    } catch (err) {
      console.error('Feedback prompt cache failed', err)
    }
  }

  const closeFeedback = () => {
    setFeedbackOpen(false)
    setFeedbackReminder(false)
  }

  const handleCopyFeedback = async () => {
    const payload = JSON.stringify(feedbackEntries, null, 2)
    try {
      if (navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(payload)
      } else {
        const helper = document.createElement('textarea')
        helper.value = payload
        helper.setAttribute('readonly', 'true')
        helper.style.position = 'absolute'
        helper.style.left = '-9999px'
        document.body.appendChild(helper)
        helper.select()
        document.execCommand('copy')
        document.body.removeChild(helper)
      }
      setCopyToast(true)
      setTimeout(() => setCopyToast(false), 1600)
    } catch (err) {
      console.error('Copy failed', err)
    }
  }

  useEffect(() => {
    try {
      const raw = localStorage.getItem('portfolio_feedback_v1')
      if (!raw) return
      const parsed = JSON.parse(raw)
      if (Array.isArray(parsed)) {
        setFeedbackEntries(parsed)
      }
    } catch (err) {
      console.error('Feedback load failed', err)
    }
  }, [])

  useEffect(() => {
    try {
      localStorage.setItem('portfolio_feedback_v1', JSON.stringify(feedbackEntries.slice(0, 50)))
    } catch (err) {
      console.error('Feedback save failed', err)
    }
  }, [feedbackEntries])

  useEffect(() => {
    const seen =
      (() => {
        try {
          return localStorage.getItem('feedback_prompt_seen') === '1'
        } catch (err) {
          console.error('Feedback prompt read failed', err)
          return false
        }
      })()
    if (seen || feedbackEntries.length > 0 || isMobile) return
    const timer = window.setTimeout(() => {
      setFeedbackReminder(true)
      try {
        localStorage.setItem('feedback_prompt_seen', '1')
      } catch (err) {
        console.error('Feedback prompt cache failed', err)
      }
    }, 45000)
    return () => clearTimeout(timer)
  }, [feedbackEntries.length, isMobile])

  useEffect(() => {
    const dustTimer = setTimeout(() => setWelcomePhase('dusting'), 1400)
    const hideTimer = setTimeout(() => setShowWelcome(false), 2800)
    const root = document.documentElement
    const handleMove = (e: MouseEvent) => {
      root.style.setProperty('--cursor-x', `${e.clientX}px`)
      root.style.setProperty('--cursor-y', `${e.clientY}px`)
    }
    const handleClick = () => {
      root.style.setProperty('--click-opacity', '0.65')
      setTimeout(() => root.style.setProperty('--click-opacity', '0'), 320)
    }
    window.addEventListener('mousemove', handleMove)
    window.addEventListener('click', handleClick)
    return () => {
      clearTimeout(dustTimer)
      clearTimeout(hideTimer)
      window.removeEventListener('mousemove', handleMove)
      window.removeEventListener('click', handleClick)
      if (rafRef.current) cancelAnimationFrame(rafRef.current)
    }
  }, [])

  useEffect(() => {
    document.body.classList.toggle('sport-mode', audioActive)
    return () => {
      document.body.classList.remove('sport-mode')
    }
  }, [audioActive])

  useEffect(() => {
    document.body.classList.toggle('drawer-open', isDrawerOpen)
    return () => {
      document.body.classList.remove('drawer-open')
    }
  }, [isDrawerOpen])

  useEffect(() => {
    setSelectedTag(tagAllLabel)
  }, [tagAllLabel])

  useEffect(() => {
    if (!isMobile) {
      setActiveProjectDetail(null)
      return
    }
    if (activeProjectDetail && !filteredProjects.includes(activeProjectDetail)) {
      setActiveProjectDetail(null)
    }
  }, [isMobile, filteredProjects, activeProjectDetail])

  useEffect(() => {
    if (isMobile && activeProjectDetail) {
      const previousOverflow = document.body.style.overflow
      document.body.style.overflow = 'hidden'
      return () => {
        document.body.style.overflow = previousOverflow
      }
    }
    document.body.style.overflow = ''
    return undefined
  }, [isMobile, activeProjectDetail])

  useEffect(() => {
    const updateMobile = () => {
      const mobile = window.matchMedia('(max-width: 720px)').matches
      setIsMobile(mobile)
      if (mobile) {
        setFeedbackReminder(false)
      }
    }
    updateMobile()
    window.addEventListener('resize', updateMobile, { passive: true })
    return () => window.removeEventListener('resize', updateMobile)
  }, [])

  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)')
    const apply = (value: boolean) => {
      setReduceMotion(value)
      document.body.classList.toggle('low-motion', value)
    }
    apply(mq.matches)
    const handler = (event: MediaQueryListEvent) => apply(event.matches)
    mq.addEventListener('change', handler)
    return () => {
      mq.removeEventListener('change', handler)
      document.body.classList.remove('low-motion')
    }
  }, [])

  useEffect(() => {
    if (!audioActive) {
      triggerMoonLeave()
    } else {
      triggerMoonEnter()
    }
  }, [audioActive])

  useEffect(() => {
    return () => {
      if (bgAudioRef.current) {
        bgAudioRef.current.pause()
        bgAudioRef.current = null
      }
    }
  }, [])

  const scrollTicking = useRef(false)
  const scrollShowRef = useRef(false)

  useEffect(() => {
    const root = document.documentElement
    const handleScroll = () => {
      if (scrollTicking.current) return
      scrollTicking.current = true
      requestAnimationFrame(() => {
        const max = Math.max(1, document.body.scrollHeight - window.innerHeight)
        const progress = Math.min(1, window.scrollY / max)
        root.style.setProperty('--scroll-progress', progress.toString())
        const shouldShow = window.scrollY > 420
        if (scrollShowRef.current !== shouldShow) {
          scrollShowRef.current = shouldShow
          setShowScrollTop(shouldShow)
        }
        scrollTicking.current = false
      })
    }
    handleScroll()
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  useEffect(() => {
    const handleKey = () => {
      const id = Date.now()
      const duration = 1200 + Math.random() * 600
      const left = `${10 + Math.random() * 80}%`
      setFallingStars((prev) => [...prev.slice(-3), { id, left, duration }])
      window.setTimeout(() => {
        setFallingStars((prev) => prev.filter((item) => item.id !== id))
      }, duration + 200)
    }
    window.addEventListener('keydown', handleKey)
    return () => window.removeEventListener('keydown', handleKey)
  }, [])

  useEffect(() => {
    if (!('IntersectionObserver' in window)) return
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible')
          }
        })
      },
      { threshold: 0.16 },
    )
    const sections = Array.from(document.querySelectorAll('.section'))
    sections.forEach((node) => observer.observe(node))
    return () => {
      sections.forEach((node) => observer.unobserve(node))
    }
  }, [])

  const scrollToTop = () => {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    window.scrollTo({ top: 0, behavior: prefersReducedMotion ? 'auto' : 'smooth' })
  }

  return (
    <div className={`page ${audioActive ? 'sport-mode' : ''}`}>
      <div className="scroll-progress" aria-hidden="true">
        <span />
      </div>
      <div className="cursor-glow" aria-hidden="true" />
      <div className="background-dust" aria-hidden="true">
        <div className="space-haze">
          <span className="haze h1" />
          <span className="haze h2" />
          <span className="haze h3" />
        </div>
        {cosmicPlanets.map((planet) => (
          <span
            key={planet.id}
            className="planet"
            style={
              {
                width: `${planet.size}px`,
                height: `${planet.size}px`,
                top: planet.top,
                left: planet.left,
                '--planet-hue': planet.hue,
                '--planet-duration': planet.duration,
                animationDelay: planet.delay,
                animationDuration: planet.duration,
              } as CSSProperties
            }
          />
        ))}
        {cosmicDust.map((piece) => (
          <span
            key={piece.id}
            className="dust mote"
            style={
              {
                top: piece.top,
                left: piece.left,
                animationDelay: piece.delay,
                animationDuration: piece.duration,
                '--mote-duration': piece.duration,
                '--dust-scale': piece.scale,
                '--drift-x': piece.driftX,
                '--drift-y': piece.driftY,
              } as CSSProperties
            }
          />
        ))}
        {shootingStars.map((star) => (
          <span
            key={star.id}
            className="shooting-star"
            style={
              {
                top: star.top,
                '--star-delay': star.delay,
                '--star-duration': star.duration,
                '--star-rotation': star.skew,
              } as CSSProperties
            }
          />
        ))}
        {fallingStars.map((star) => (
          <span
            key={star.id}
            className="falling-star"
            style={
              {
                left: star.left,
                '--fall-duration': `${star.duration}ms`,
              } as CSSProperties
            }
          />
        ))}
        <div className="comet-field">
          {comets.map((comet) => (
            <span
              key={comet.id}
              className="comet"
              style={
                {
                  top: comet.top,
                  '--comet-delay': comet.delay,
                  '--comet-duration': comet.duration,
                  transform: `rotate(${comet.rotation})`,
                } as CSSProperties
              }
            />
          ))}
        </div>
        <div className="sparkle-field">
          {sparkleField.map((spark) => (
            <span
              key={spark.id}
              className="sparkle"
              style={
                {
                  top: spark.top,
                  left: spark.left,
                  '--spark-scale': spark.scale,
                  '--spark-duration': spark.duration,
                  '--spark-delay': spark.delay,
                } as CSSProperties
              }
            />
          ))}
        </div>
      </div>
      {showWelcome && (
        <div className={`welcome-overlay ${welcomePhase === 'dusting' ? 'dusting' : ''}`} aria-live="polite">
          <div className="welcome-card">
            <span className="welcome-ring" aria-hidden="true" />
            <div className="dust-field" aria-hidden="true">
              {dustPieces.map((piece) => (
                <span
                  key={piece.id}
                  className="dust"
                  style={
                    {
                      top: piece.top,
                      left: piece.left,
                      animationDelay: piece.delay,
                      '--dust-scale': piece.scale,
                      '--dust-delay': piece.delay,
                    } as CSSProperties
                  }
                />
              ))}
            </div>
            <div className="welcome-text">
              <h3>{welcomeOverlayCopy.title}</h3>
              <p className="welcome-sub">{welcomeOverlayCopy.subtitle}</p>
            </div>
          </div>
        </div>
      )}
      <div className="ambient-lights" aria-hidden="true">
        <span className="orb o1" />
        <span className="orb o2" />
        <span className="orb o3" />
        <span className="orb o4" />
        <span className="orb o5" />
        <span className="orb o6" />
        <div className="aurora">
          <span className="ribbon r1" />
          <span className="ribbon r2" />
        </div>
      </div>
      <div className="edge-lights" aria-hidden="true" />
      {moonVisible && (
        <div className={`moon-overlay ${moonPhase}`}>
          <div className="moon-glow" aria-hidden="true">
            <span className="moon-core" />
            <span className="moon-halo" />
            <span className="moon-ring" />
            <span className="moon-sparkle" />
          </div>
          {audioStarted && (
            <div className="moon-player">
              <div className="song-label">
                <span className="eyebrow">{trackMeta.title}</span>
                <span className="pill ghost">{playerCopy.nowPlaying}</span>
                <span className="pill ghost">by {trackMeta.artist}</span>
              </div>
              <div className={`wave-bars ${audioActive ? 'live' : ''}`} aria-hidden="true">
                <span className="wave" />
                <span className="wave" />
                <span className="wave" />
                <span className="wave" />
              </div>
              <div className="moon-controls">
                <input
                  className="timeline-slider"
                  type="range"
                  min={0}
                  max={progressMax}
                  step={0.1}
                  value={Math.min(currentTime, progressMax)}
                  onChange={(e) => handleSeekChange(parseFloat(e.target.value))}
                  aria-label="Seek"
                />
                <div className="time-row">
                  <span className="eyebrow">
                    {formatTime(currentTime)} / {formatTime(duration)}
                  </span>
                  <button className="btn ghost" type="button" onClick={stopAudioReactive}>
                    {playerCopy.stop}
                  </button>
                </div>
                <label className="volume-control moon-volume">
                  <span>{playerCopy.volume}</span>
                  <input
                    type="range"
                    min={0}
                    max={1}
                    step={0.05}
                    value={volume}
                    onChange={(e) => handleVolumeChange(parseFloat(e.target.value))}
                    aria-label={playerCopy.volume}
                  />
                </label>
              </div>
            </div>
          )}
        </div>
      )}
      <div className={`content-shell ${showWelcome ? 'is-blurred' : ''} ${moonVisible ? 'is-hidden' : ''}`}>
      <header className="top-nav">
        <button
          className={`menu-toggle ${isDrawerOpen ? 'open' : ''}`}
          type="button"
          aria-label="Menu"
          aria-expanded={isDrawerOpen}
          aria-controls="mobile-drawer"
          onClick={toggleDrawer}
        >
          <span />
          <span />
          <span />
        </button>
        <div className="brand-cluster">
          <div className="brand">
            <span className="brand-mark">//</span>
            <div>
              <p className="eyebrow">{c.brandEyebrow}</p>
              <p className="brand-name">Baha B├╝y├╝kate┼ş</p>
            </div>
          </div>
          <div className="lang-switch" role="group" aria-label="Dil se├ğimi">
            {localeOptions.map((option) => (
              <button
                key={option.code}
                type="button"
                className={`lang-btn ${activeLocale === option.code ? 'active' : ''}`}
                onClick={() => setActiveLocale(option.code)}
                aria-pressed={activeLocale === option.code}
              >
                <span className="flag" aria-hidden="true">
                  {option.flag}
                </span>
                <span className="code">{option.code}</span>
              </button>
            ))}
          </div>
        </div>
        <div className="nav-right">
          <nav className="nav-links">
            <a href="#about" onClick={(e) => handleNavClick('about', e)}>
              {c.nav.about}
            </a>
            <a href="#experience" onClick={(e) => handleNavClick('experience', e)}>
              {c.nav.experience}
            </a>
            <a href="#projects" onClick={(e) => handleNavClick('projects', e)}>
              {c.nav.projects}
            </a>
            <a href="#skills" onClick={(e) => handleNavClick('skills', e)}>
              {c.nav.skills}
            </a>
            <a href="#contact" onClick={(e) => handleNavClick('contact', e)}>
              {c.nav.contact}
            </a>
            <button
              className="link-button guitar-link"
              type="button"
              aria-label="Hobby"
              onClick={(e) => handleNavClick('hobby', e)}
            >
              {hobbyNavLabel}
            </button>
          </nav>
        </div>
      </header>

      <aside
        className={`mobile-drawer ${isDrawerOpen ? 'open' : ''}`}
        id="mobile-drawer"
        aria-hidden={!isDrawerOpen}
      >
        <div className="drawer-head">
          <div>
            <p className="eyebrow">{c.brandEyebrow}</p>
            <p className="brand-name">Baha B├╝y├╝kate┼ş</p>
          </div>
          <button className="close-drawer" type="button" aria-label="Men├╝y├╝ kapat" onClick={() => setIsDrawerOpen(false)}>
            X
          </button>
        </div>
        <nav className="drawer-links">
          <button type="button" onClick={(e) => handleNavClick('about', e)}>
            {c.nav.about}
          </button>
          <button type="button" onClick={(e) => handleNavClick('experience', e)}>
            {c.nav.experience}
          </button>
          <button type="button" onClick={(e) => handleNavClick('projects', e)}>
            {c.nav.projects}
          </button>
          <button type="button" onClick={(e) => handleNavClick('skills', e)}>
            {c.nav.skills}
          </button>
          <button type="button" onClick={(e) => handleNavClick('hobby', e)}>
            {hobbyNavLabel}
          </button>
          <button type="button" onClick={(e) => handleNavClick('contact', e)}>
            {c.nav.contact}
          </button>
        </nav>
        <div className="drawer-meta">
          <span className="pill small">{c.hero.eyebrow}</span>
          <p className="section-text">{c.hero.lede}</p>
        </div>
        <div className="drawer-music">
          <p className="eyebrow">{activeLocale === 'DE' ? 'Audio Kontrol' : activeLocale === 'EN' ? 'Audio Control' : 'Ses Kontrol'}</p>
          <div className="drawer-audio-row">
            <button
              type="button"
              className={`btn ghost mini ${bgLoading ? 'loading' : ''}`}
              onClick={bgPlaying ? stopBgAudio : startBgAudio}
              disabled={bgLoading}
            >
              {bgLoading ? audioUiCopy.musicLoading : bgPlaying ? audioUiCopy.musicOn : audioUiCopy.musicOff}
            </button>
            <div className="drawer-volume">
              <input
                type="range"
                min={0}
                max={1}
                step={0.05}
                value={bgVolume}
                onChange={(e) => handleBgVolume(parseFloat(e.target.value))}
                aria-label="Muzik ses"
              />
              <span className="pill small ghost">
                {bgLoading ? audioUiCopy.musicStatusLoading : bgPlaying ? audioUiCopy.musicStatusOn : audioUiCopy.musicStatusOff}
              </span>
            </div>
          </div>
        </div>
      </aside>
      {isDrawerOpen && <div className="drawer-overlay" onClick={() => setIsDrawerOpen(false)} aria-hidden="true" />}

      <div className="section-indicator" aria-live="polite">
        <div className="indicator-ring">
          <span className="indicator-orb" aria-hidden="true" />
        </div>
        <span className="indicator-label">{indicatorLabel}</span>
      </div>

      <main>
        <section className="hero" id="hero">
          <div className="hero-text">
            <p className="eyebrow">{c.hero.eyebrow}</p>
            <h1>
              {c.hero.titleMain}
              <span className="accent">{c.hero.titleAccent}</span>
            </h1>
            <p className="lede">{c.hero.lede}</p>
            <div className="cta-row hero-cta">
            <a className="btn ghost" href="mailto:bahabuyukates@gmail.com">
              bahabuyukates@gmail.com
            </a>
            <a className="btn primary" href="#projects" onClick={(e) => scrollToSection('projects', e)}>
              {c.hero.ctas.browse}
            </a>
            <a className="btn ghost" href="#contact" onClick={(e) => scrollToSection('contact', e)}>
              {c.hero.ctas.collaborate}
            </a>
          </div>
            <div className="hero-meta">
              {c.heroMeta.map((pill) => (
                <span className="pill" key={pill}>
                  {pill}
                </span>
              ))}
            </div>
          </div>
          <div className="hero-panel">
            <div className="panel-head">
              <p>{c.heroPanel.status}</p>
              <span className="pulse" aria-label="online" />
            </div>
            <div className="meter">
              <p>{c.heroPanel.focus}</p>
              <div className="bars">
                {c.heroPanel.labels.map((label, idx) => (
                  <span className={`bar b${idx + 1}`} key={label}>
                    <span className="bar-label">{label}</span>
                  </span>
                ))}
              </div>
            </div>
            <div className="panel-body">
              <p className="eyebrow">{c.heroPanel.profileEyebrow}</p>
              <ul>
                {c.heroPanel.profileItems.map((line) => (
                  <li key={line}>{line}</li>
                ))}
              </ul>
            </div>
          </div>
        </section>

        <section className="section about" id="about">
          <div className="section-header">
            <p className="eyebrow">{c.about.eyebrow}</p>
            <h2>{c.about.title}</h2>
            <p className="section-text">{c.about.bio}</p>
          </div>
          <div className="about-grid">
            <div className="card">
              <h3>{activeLocale === 'DE' ? 'Staerken' : activeLocale === 'EN' ? 'Strengths' : 'G├╝├ğ alanlar─▒m'}</h3>
              <ul className="list compact">
                {c.about.strengths.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </div>
            <div className="card">
              <h3>{activeLocale === 'DE' ? 'Offen fuer' : activeLocale === 'EN' ? 'Open roles' : 'A├ğ─▒k oldu─şum roller'}</h3>
              <div className="tags">
                {c.about.openTo.map((item) => (
                  <span className="pill" key={item}>
                    {item}
                  </span>
                ))}
              </div>
              <div className="metric">
                <span className="spark" />
                <p>{c.about.highlight}</p>
              </div>
              <div className="cv-row">
                <a className="btn ghost" href={c.cv.link} target="_blank" rel="noreferrer">
                  {c.cv.label}
                </a>
                <span className="eyebrow">
                  {activeLocale === 'DE'
                    ? `Aktualisiert: ${c.cv.updated}`
                    : activeLocale === 'EN'
                    ? `Updated: ${c.cv.updated}`
                    : `G├╝ncelleme: ${c.cv.updated}`}
                </span>
              </div>
            </div>
          </div>
        </section>

        <section className="section" id="experience">
          <div className="section-header">
            <p className="eyebrow">{c.sections.experience.eyebrow}</p>
            <h2>{c.sections.experience.title}</h2>
            <p className="section-text">{c.sections.experience.text}</p>
          </div>
          <div className="timeline">
            {c.experience.map((job) => (
              <article className="card job-card timeline-item" key={job.company + job.role}>
                <span className="timeline-dot" aria-hidden="true" />
                <div className="card-head">
                  <div>
                    <h3>{job.role}</h3>
                    <p className="stack">
                      {job.company} / {job.location}
                    </p>
                  </div>
                  <span className="pill ghost">{job.period}</span>
                </div>
                <ul className="list">
                  {job.bullets.map((line) => (
                    <li key={line}>{line}</li>
                  ))}
                </ul>
                <p className="impact-line">
                  {job.impact ?? defaultExperienceImpact}
                </p>
              </article>
            ))}
          </div>
        </section>

        <section className="section" id="skills">
          <div className="section-header">
            <p className="eyebrow">{c.sections.skills.eyebrow}</p>
            <h2>{c.sections.skills.title}</h2>
            <p className="section-text">{c.sections.skills.text}</p>
          </div>
          <div className="grid">
            {c.skills.map((skill) => (
              <div className="card" key={skill.title}>
                <div className="card-head">
                  <h3>{skill.title}</h3>
                  <span className="spark" aria-hidden="true" />
                </div>
                <p className="card-text">{skill.detail}</p>
                <div className="tags">
                  {skill.items.map((item) => (
                    <span className="pill" key={item}>
                      {item}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
          <div className="matrix-grid">
            {c.skillMatrix.map((skill) => (
              <div className="card matrix-card" key={skill.name}>
                <div className="card-head">
                  <h3>{skill.name}</h3>
                  <span className={`badge level-${skill.level.toLowerCase()}`}>{skill.level}</span>
                </div>
                <div className="tags">
                  {skill.tools.map((tool) => (
                    <span className="pill small" key={tool}>
                      {tool}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
          <div className="toolbelt">
            <p className="eyebrow">
              {activeLocale === 'DE'
                ? 'Toolbelt & zuletzt genutzt'
                : activeLocale === 'EN'
                ? 'Toolbelt & recent stack'
                : 'Toolbelt & son kullan─▒lanlar'}
            </p>
            <div className="tags">
              {c.toolbelt.map((tool) => (
                <span className="pill" key={tool}>
                  {tool}
                </span>
              ))}
            </div>
          </div>
        </section>

        <section className="section" id="projects">
          <div className="section-header">
            <p className="eyebrow">{c.sections.projects.eyebrow}</p>
            <h2>{c.sections.projects.title}</h2>
            <p className="section-text">{c.sections.projects.text}</p>
          </div>
          <div className="project-filter">
            {allTags.map((tag) => (
              <button
                key={tag}
                className={`pill filter-pill ${selectedTag === tag ? 'active' : ''}`}
                onClick={() => setSelectedTag(tag)}
                type="button"
              >
                {tag}
              </button>
            ))}
          </div>
          <div className={`grid projects${isMobile ? ' mobile' : ''}`}>
            {filteredProjects.map((project) => {
              const isUnityProject = project.stack.toLowerCase().includes('unity')
              const isPlayground = Boolean(project.playground)

              if (isMobile) {
                return (
                  <article
                    className={`card project-card mobile-compact${isPlayground ? ' playground' : ''}`}
                    key={project.title}
                  >
                    <div className="card-head">
                      <div>
                        <h3>{project.title}</h3>
                        <p className="stack">{project.stack}</p>
                      </div>
                      {isPlayground && <span className="pill small ghost">Prototype / Demo</span>}
                    </div>
                    <p className="card-text">{getProjectPreview(project)}</p>
                    <button className="btn ghost small full-width" type="button" disabled aria-disabled="true">
                      {projectUiCopy.open}
                    </button>
                  </article>
                )
              }

              return (
                <article className={`card project-card${isPlayground ? ' playground' : ''}`} key={project.title}>
                  {project.image && !isUnityProject && (
                    <div className="project-media" style={getProjectMediaStyle(project.title)}>
                      <img src={project.image} alt={project.title} loading="lazy" />
                    </div>
                  )}
                  <div className="card-head">
                    <div>
                      <h3>{project.title}</h3>
                      <p className="stack">{project.stack}</p>
                    </div>
                    {isPlayground && <span className="pill small ghost">Prototype / Demo</span>}
                    <span className={getProjectAccentClass(project.title)} />
                  </div>
                  <p className="card-text">{project.description}</p>
                  <p className="card-text subtle">{project.summary}</p>
                  <div className="tags">
                    {project.tags.map((tag) => (
                      <span className="pill small" key={tag}>
                        {tag}
                      </span>
                    ))}
                  </div>
                  <div className="card-footer links">
                    <a className="link" href={project.github} target="_blank" rel="noreferrer">
                      GitHub
                    </a>
                  </div>
                  <p className="impact-line">
                    {project.impact ?? defaultProjectImpact}
                  </p>
                </article>
              )
            })}
          </div>
          {isMobile && activeProjectDetail && (
            <div className="project-modal-overlay" role="dialog" aria-modal="true" aria-label={activeProjectDetail.title}>
              <div className="project-modal">
                <div className="modal-head">
                  <div>
                    <p className="eyebrow">{activeProjectDetail.stack}</p>
                    <h3>{activeProjectDetail.title}</h3>
                  </div>
                  <button className="close-btn" type="button" aria-label={projectUiCopy.close} onClick={() => setActiveProjectDetail(null)}>
                    ├ù
                  </button>
                </div>
                <div className="modal-body">
                  <p className="card-text">{activeProjectDetail.description}</p>
                  <p className="card-text subtle">{activeProjectDetail.summary}</p>
                  <div className="tags">
                    {activeProjectDetail.tags.map((tag) => (
                      <span className="pill small" key={tag}>
                        {tag}
                      </span>
                    ))}
                  </div>
                  <div className="links modal-links">
                    <a className="link" href={activeProjectDetail.github} target="_blank" rel="noreferrer">
                      GitHub
                    </a>
                    {activeProjectDetail.live && activeProjectDetail.live !== '#' && (
                      <a className="link" href={activeProjectDetail.live} target="_blank" rel="noreferrer">
                        Live
                      </a>
                    )}
                    {activeProjectDetail.link && activeProjectDetail.link !== '#' && (
                      <a className="link" href={activeProjectDetail.link} target="_blank" rel="noreferrer">
                        Link
                      </a>
                    )}
                  </div>
                  <p className="impact-line">{activeProjectDetail.impact ?? defaultProjectImpact}</p>
                </div>
                <button className="btn primary full-width" type="button" onClick={() => setActiveProjectDetail(null)}>
                  {projectUiCopy.close}
                </button>
              </div>
            </div>
          )}
          <div className="projects-note">
            <p className="section-text subtle">{c.projectsNote}</p>
            <a className="btn primary projects-note-cta" href="#contact">
              {c.projectsNoteCta}
            </a>
          </div>
        </section>

        <section className="section" id="education">
          <div className="section-header">
            <p className="eyebrow">{c.sections.education.eyebrow}</p>
            <h2>{c.sections.education.title}</h2>
            <p className="section-text">{c.sections.education.text}</p>
          </div>
          <div className="grid">
            {c.education.map((edu) => (
              <article className="card" key={edu.school}>
                <div className="card-head">
                  <h3>{edu.school}</h3>
                  <span className="spark" />
                </div>
                <p className="card-text">{edu.degree}</p>
                <p className="stack">
                  {edu.location} / {edu.period}
                </p>
              </article>
            ))}
          </div>
        </section>

        <section className="section" id="certifications">
          <div className="section-header">
            <p className="eyebrow">{c.sections.certifications.eyebrow}</p>
            <h2>{c.sections.certifications.title}</h2>
            <p className="section-text">{c.sections.certifications.text}</p>
          </div>
          <div className="grid">
            <article className="card">
              <div className="card-head">
                <h3>
                  {activeLocale === 'DE'
                    ? 'Zertifikate'
                    : activeLocale === 'EN'
                    ? 'Certifications'
                    : 'Sertifikalar'}
                </h3>
                <span className="mini-dot" />
              </div>
              <ul className="list">
                {c.certifications.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </article>
            <article className="card">
              <div className="card-head">
                <h3>
                  {activeLocale === 'DE'
                    ? 'Sprachen'
                    : activeLocale === 'EN'
                    ? 'Languages'
                    : 'Diller'}
                </h3>
                <span className="mini-dot" />
              </div>
              <div className="tags">
                {c.languages.map((lang) => (
                  <span className="pill" key={lang.name}>
                    {lang.name} ({lang.level})
                  </span>
                ))}
              </div>
            </article>
          </div>
        </section>

        <section className="section hobby" id="hobby">
          <div className="section-header">
            <p className="eyebrow">{c.sections.hobby.eyebrow}</p>
            <h2>{c.sections.hobby.title}</h2>
            <p className="section-text">{c.sections.hobby.text}</p>
            <p className="section-text subtle">{c.sections.hobby.benefit}</p>
          </div>
          <div className="cta-row hobby-controls">
            <div className="audio-btn-stack">
              <button
                className={`btn primary audio-btn ${audioActive ? 'active' : ''} ${audioLoading ? 'loading' : ''}`}
                type="button"
                onClick={startAudioReactive}
                disabled={audioLoading}
              >
                {audioLoading ? audioUiCopy.hobbyLoading : audioActive ? audioUiCopy.hobbyPlaying : c.sections.hobby.cta}
              </button>
              <span className="pill small ghost">
                {audioLoading ? audioUiCopy.musicStatusLoading : audioActive ? audioUiCopy.hobbyPlaying : audioUiCopy.hobbyReady}
              </span>
            </div>
            {audioStarted && (
              <>
                <div className="player-meta">
                  <div className="song-label">
                    <span className="eyebrow">{trackMeta.title}</span>
                    <span className="pill">{playerCopy.nowPlaying}</span>
                    <span className="pill ghost">by {trackMeta.artist}</span>
                  </div>
                  <div className={`wave-bars ${audioActive ? 'live' : ''}`} aria-hidden="true">
                    <span className="wave" />
                    <span className="wave" />
                    <span className="wave" />
                    <span className="wave" />
                  </div>
                </div>
                <div className="player-progress">
                  <input
                    className="timeline-slider"
                    type="range"
                    min={0}
                    max={progressMax}
                    step={0.1}
                    value={Math.min(currentTime, progressMax)}
                    onChange={(e) => handleSeekChange(parseFloat(e.target.value))}
                    aria-label="Seek"
                  />
                  <div className="time-row">
                    <span className="eyebrow">
                      {formatTime(currentTime)} / {formatTime(duration)}
                    </span>
                    <span className="pill ghost">
                      {playerCopy.remaining}: {formatTime(remainingTime)}
                    </span>
                  </div>
                </div>
                <div className="player-actions">
                  <button className="btn ghost" type="button" onClick={stopAudioReactive}>
                    {playerCopy.stop}
                  </button>
                  <label className="volume-control">
                    <span>{playerCopy.volume}</span>
                    <input
                      type="range"
                      min={0}
                      max={1}
                      step={0.05}
                      value={volume}
                      onChange={(e) => handleVolumeChange(parseFloat(e.target.value))}
                      aria-label="Volume"
                    />
                  </label>
                </div>
              </>
            )}
          </div>
        </section>

        <section className="section contact" id="contact">
          <div>
            <p className="eyebrow">{c.sections.contact.eyebrow}</p>
            <h2>{c.sections.contact.title}</h2>
            <p className="section-text">{c.sections.contact.text}</p>
          </div>
          <div className="contact-photo">
            <div className="photo-frame">
              <img src="/photo.jpg" alt="Profil foto─şraf─▒" loading="lazy" />
            </div>
           
          </div>
          <div className="contact-actions">
            <a className="btn primary" href="mailto:bahabuyukates@gmail.com">
              bahabuyukates@gmail.com
            </a>
            <a
              className="btn ghost"
              href="https://www.linkedin.com/in/baha-buyukates"
              target="_blank"
              rel="noreferrer"
            >
              LinkedIn
            </a>
            <a
              className="btn ghost"
              href="https://github.com/JegBaha?tab=repositories"
              target="_blank"
              rel="noreferrer"
            >
              GitHub
            </a>
            <a
              className="btn ghost"
              href="https://www.instagram.com/jegbaa?igsh=MXQ1aHRybnByOHU5bQ=="
              target="_blank"
              rel="noreferrer"
            >
              Instagram
            </a>
          
            <a className="btn ghost" href="tel:+905421559766">
              +90 542 155 9766
            </a>
          </div>
          <form className="contact-form" onSubmit={handleContactSubmit}>
            <div className="form-row">
              <input type="text" name="name" placeholder="Ad / Name" required />
              <input type="email" name="email" placeholder="E-posta / Email" required />
            </div>
            <textarea name="message" rows={3} placeholder="Kisa mesaj / Short message" required />
            <button type="submit" className="btn primary">Gonder / Send</button>
          </form>
        </section>

        
        <footer className="footer-note">
          <span>Created by Baha Buyukates - Portfolio 2025</span>
          {!isMobile && (
            <div className="audio-controls footer-music">
              <div className={`music-fab ${bgControlsOpen ? 'open' : ''}`} aria-label="Arka plan muzik kontrol">
                <button
                  type="button"
                  className="chip-btn icon"
                  onClick={toggleBgControls}
                  aria-expanded={bgControlsOpen}
                  title="Opsiyonel arka plan muzik (varsayilan kapali)"
                >
                  {bgVolume === 0 || !bgPlaying ? '­şöç' : '­şöè'}
                </button>
                {bgControlsOpen && (
                  <>
                    <div className="music-slider">
                      <input
                        type="range"
                        min={0}
                        max={1}
                        step={0.05}
                        value={bgVolume}
                        onChange={(e) => handleBgVolume(parseFloat(e.target.value))}
                        aria-label="Muzik ses"
                      />
                      <span className="volume-readout">{Math.round(bgVolume * 100)}%</span>
                    </div>
                    <div className="music-toggle">
                      <button
                        type="button"
                        className={`btn ghost mini ${bgLoading ? 'loading' : ''}`}
                        onClick={bgPlaying ? stopBgAudio : startBgAudio}
                        disabled={bgLoading}
                      >
                        {bgLoading ? audioUiCopy.musicLoading : bgPlaying ? audioUiCopy.musicOn : audioUiCopy.musicOff}
                      </button>
                      <span className="pill small ghost">{bgLoading ? audioUiCopy.musicStatusLoading : bgPlaying ? audioUiCopy.musicStatusOn : audioUiCopy.musicStatusOff}</span>
                    </div>
                  </>
                )}
              </div>
            </div>
          )}
        </footer>
      </main>
      {!isMobile && (
        <>
          <div className="feedback-launcher">
            {feedbackReminder && !feedbackOpen && (
              <div className="feedback-reminder" role="status">
                <p>{feedbackCopy.reminder}</p>
                <div className="reminder-actions">
                  <button type="button" className="btn primary mini" onClick={openFeedback}>
                    {feedbackCopy.cta}
                  </button>
                  <button type="button" className="link-button" onClick={() => setFeedbackReminder(false)}>
                    {laterLabel}
                  </button>
                </div>
              </div>
            )}
            <button
              type="button"
              className="feedback-trigger"
              aria-controls="feedback-drawer"
              aria-expanded={feedbackOpen}
              onClick={openFeedback}
              title="Opsiyonel geri bildirim"
            >
              <div className="trigger-text">
                <span>­şÆ¼ {feedbackCopy.cta}</span>
                <span className="subtext">{feedbackCopy.title}</span>
              </div>
              <span className="pill small">
                {feedbackEntries.length > 0 ? `${feedbackCopy.averageLabel}: ${feedbackAverage}` : '1-5'}
              </span>
            </button>
          </div>
          <div
            className={`feedback-overlay ${feedbackOpen ? 'show' : ''}`}
            onClick={closeFeedback}
            aria-hidden={!feedbackOpen}
          />
        </>
      )}
      {showScrollTop && (
        <button className="scroll-top" type="button" onClick={scrollToTop} aria-label="Ba┼şa d├Ân">
          Ôåæ
        </button>
      )}
      <aside
        className={`feedback-drawer ${feedbackOpen ? 'open' : ''}`}
        id="feedback-drawer"
        role="dialog"
        aria-modal="true"
        aria-label={feedbackCopy.title}
      >
        <div className="feedback-head">
          <div>
            <p className="eyebrow">{feedbackCopy.title}</p>
            <h3>{feedbackCopy.subtitle}</h3>
            <p className="section-text subtle">{feedbackCopy.storageNote}</p>
          </div>
          <button className="close-btn" type="button" aria-label="Kapat" onClick={closeFeedback}>
            ├ù
          </button>
        </div>
        <form className="feedback-form" onSubmit={handleFeedbackSubmit}>
          <div className="star-row" role="radiogroup" aria-label={feedbackCopy.ratingLabel}>
            {[1, 2, 3, 4, 5].map((score) => (
              <button
                key={score}
                type="button"
                className={`star ${feedbackRating !== null && feedbackRating >= score ? 'filled' : ''}`}
                onClick={() => {
                  setFeedbackRating(score)
                  setFeedbackError('')
                }}
                aria-pressed={feedbackRating === score}
              >
                Ôİà
              </button>
            ))}
          </div>
          <div className="mood-row" aria-label={feedbackCopy.moodQuestion}>
            <button
              type="button"
              className={`pill small mood ${feedbackMood === 'like' ? 'active' : ''}`}
              onClick={() => setFeedbackMood('like')}
            >
              {feedbackCopy.like}
            </button>
            <button
              type="button"
              className={`pill small mood ${feedbackMood === 'dislike' ? 'active' : ''}`}
              onClick={() => setFeedbackMood('dislike')}
            >
              {feedbackCopy.dislike}
            </button>
          </div>
          <textarea
            name="feedback-note"
            rows={3}
            placeholder={feedbackCopy.commentPlaceholder}
            value={feedbackNote}
            onChange={(e) => setFeedbackNote(e.target.value)}
          />
          {feedbackError && <p className="error-text">{feedbackError}</p>}
          <button type="submit" className="btn primary full">
            {feedbackCopy.submit}
          </button>
          {feedbackSaved && <p className="success-text">{feedbackCopy.thanks}</p>}
        </form>
        <div className="feedback-log">
          <p className="section-text subtle">
            {activeLocale === 'DE'
              ? 'Veriler sadece mir zu Lernzwecken; nur Score wird gespeichert.'
              : activeLocale === 'EN'
              ? 'Data stays local for my own improvement; only score is stored.'
              : 'Veriler sadece kendimi geli┼ştirme ama├ğl─▒; sadece puanlama tutulur.'}
          </p>
        </div>
      </aside>
      </div>
    </div>
  )
}

export default App
