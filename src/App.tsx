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

type ProjectDetail = {
  backend?: string
  frontend?: string
  database?: string
  orm?: string
  auth?: string
  layers?: string[]
  versionControl?: string
  projectManagement?: string
  architecture?: string
  dataProcessing?: string
  mlModels?: string
  visualization?: string
  deployment?: string
  hardware?: string
  protocols?: string
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
  hobby?: boolean
  details?: ProjectDetail
  gallery?: string[]
}

const localeOptions: { code: Locale; flag: string; label: string }[] = [
  { code: 'TR', flag: '🇹🇷', label: 'Türkçe' },
  { code: 'DE', flag: '🇩🇪', label: 'Deutsch' },
  { code: 'EN', flag: '🇬🇧', label: 'English' },
]

// Tech Stack Icon Mapping using Simple Icons CDN
const techIcons: Record<string, string> = {
  Python: 'https://cdn.simpleicons.org/python/3776AB',
  PyTorch: 'https://cdn.simpleicons.org/pytorch/EE4C2C',
  'Power BI': 'https://cdn.simpleicons.org/powerbi/F2C811',
  SQL: 'https://cdn.simpleicons.org/postgresql/4169E1',
  DAX: 'https://cdn.simpleicons.org/powerbi/F2C811',
  Zapier: 'https://cdn.simpleicons.org/zapier/FF4A00',
  Airtable: 'https://cdn.simpleicons.org/airtable/18BFFF',
  Docker: 'https://cdn.simpleicons.org/docker/2496ED',
  AWS: 'https://cdn.simpleicons.org/amazonaws/FF9900',
  'SAP Fiori': 'https://cdn.simpleicons.org/sap/0FAAFF',
  React: 'https://cdn.simpleicons.org/react/61DAFB',
  TypeScript: 'https://cdn.simpleicons.org/typescript/3178C6',
  JavaScript: 'https://cdn.simpleicons.org/javascript/F7DF1E',
  'Node.js': 'https://cdn.simpleicons.org/nodedotjs/339933',
  Git: 'https://cdn.simpleicons.org/git/F05032',
  Azure: 'https://cdn.simpleicons.org/microsoftazure/0078D4',
}

const getTechIcon = (tool: string): string | null => {
  return techIcons[tool] || null
}

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
      impactLine: string
      lede: string
      ctas: { browse: string; download: string }
      ctaNotes: { citizen: string; availability: string }
    }
    heroPanel: {
      status: string
      location: string
      focus: string
      focusItems: { label: string; active: boolean }[]
      availability: string
    }
    projectsNoteCta: string
    sections: {
      experience: { eyebrow: string; title: string; text: string }
      skills: { eyebrow: string; title: string; text: string }
      projects: { eyebrow: string; title: string; text: string }
      education: { eyebrow: string; title: string; text: string }
      certifications: { eyebrow: string; title: string; text: string }
      contact: { eyebrow: string; title: string; text: string; formTitle: string; subjects: string[]; availability: string; sent: string }
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
      skills?: string[]
    }[]
    skills: { title: string; items: { name: string; level: 'beginner' | 'intermediate' | 'advanced' }[]; detail: string; percent: number; icon: string }[]
    projects: Project[]
    education: { school: string; degree: string; location: string; period: string; diploma?: string }[]
    certifications: { name: string; provider: string; verifyUrl?: string }[]
    languages: { name: string; level: string; percent: number }[]
    about: { eyebrow: string; title: string; bio: string; strengths: string[]; openTo: string[]; highlight: string; motto: string; timeline: { year: string; text: string }[] };
    toolbelt: { category: string; tools: string[] }[];
    cv: { link: string; updated: string; label: string };
    impactStats: {
      experienceValue: string
      experienceLabel: string
      projectsValue: string
      projectsLabel: string
      languagesValue: string
      languagesLabel: string
      englishValue: string
      englishLabel: string
    }
    currentlyLearning: {
      title: string
      items: {
        icon: string
        title: string
        subtitle: string
        progress: number
      }[]
    }
    hobbyShowcase: {
      genres: string[]
      daws: string[]
      instruments: string[]
    }
  }
> = {
  TR: {
    nav: {
      about: 'Hakkımda',
      experience: 'Deneyim',
      projects: 'Projeler',
      skills: 'Yetenekler',
      contact: 'İletişim',
    },
    brandEyebrow: 'Industrial AI & Data Engineer',
    welcome: '',
    hero: {
      eyebrow: 'Industrial AI Engineer | Hoş geldin',
      titleMain: 'Industrial AI & Data Engineer,',
      titleAccent: ' akıllı fabrikalar, üretim verisi ve karar destek sistemleri',
      impactLine: '4+ yıl deneyim • 10+ proje • AB vatandaşı • Hemen başlayabilir',
      lede: 'Veriyi sahadan alıp (MES, sensörler, ERP), ölçeklenebilir veri hatları, KPI\'lar ve makine öğrenmesi modelleriyle üretim kalitesini ve operasyonel kararları iyileştiren sistemler geliştiriyorum.',
      ctas: { browse: 'Projelerime göz at', download: 'CV indir' },
      ctaNotes: { citizen: 'AB Vatandaşı (Bulgaristan)', availability: 'Hemen başlayabilir' },
    },
    heroPanel: {
      status: 'Projelere Açık',
      location: 'Türkiye / Almanya',
      focus: 'Uzmanlık',
      focusItems: [
        { label: 'Industrial AI', active: true },
        { label: 'Data Engineering (Manufacturing)', active: true },
        { label: 'Backend & ML Integration', active: false },
      ],
      availability: 'Hemen başlayabilirim',
    },
    projectsNoteCta: 'Daha fazlası için',
    sections: {
      experience: {
        eyebrow: 'Profesyonel Deneyim',
        title: 'Sahada neler yaptım',
        text: 'AI eğitimi, veri analizi ve kurumsal IT arasında köprü kuran tecrübeler.',
      },
      skills: {
        eyebrow: 'Ne sunuyorum',
        title: 'Yetenek seti',
        text: 'Veri, yapay zeka, otomasyon ve kurumsal süreçleri bir araya getiriyorum; projelerde aktif kullandığım beceriler.',
      },
      projects: {
        eyebrow: 'Seçili projeler',
        title: 'Seçili projeler',
        text: 'Performans ve kullanıcı deneyimi birlikte.',
      },
      education: {
        eyebrow: 'Eğitim',
        title: 'Temel ve orta düzey',
        text: 'Mühür: Bilgisayar Mühendisliği + AI odaklı bootcamp.',
      },
      certifications: {
        eyebrow: 'Sertifikalar & Diller',
        title: 'Sürekli öğrenme ve global iletişim',
        text: 'Bulut, veri, AI ve endüstriyel otomasyon alanlarında güncel sertifikalar; çok dilli iletişim.',
      },
      hobby: {
        eyebrow: 'Hobim',
        title: 'Müzik Prodüksiyonu',
        text: 'Djent ve progressive metal tarzında parçalar üretiyorum. Müzik, teknik detaylara ve disiplinli çalışmaya olan ilgimi yansıtan bir tutkum.',
        benefit: '',
        cta: '',
      },
      contact: {
        eyebrow: 'İletişim',
        title: 'Yeni bir proje için hazırım.',
        text: 'Veri analizi, dashboard geliştirme, AI eğitimi veya otomasyon ihtiyacınız varsa iletişime geçebiliriz.',
        formTitle: 'Mesaj Gönderin',
        subjects: ['Proje Teklifi', 'İş Birliği', 'Diğer'],
        availability: 'Müsait',
        sent: 'Gönderildi!',
      },
    },
    feedback: {
      cta: 'Değerlendir',
      reminder: '30 saniyedir buradasın, bir değerlendirme bırakır mısın?',
      title: 'Beğendiniz mi?',
      subtitle: '1-5 yıldız ver, istersen kısa yorum ekle.',
      ratingLabel: 'Yıldız',
      moodQuestion: 'Hızlı seçim',
      like: 'Beğendim',
      dislike: 'Beğenmedim',
      commentPlaceholder: 'Neyi sevdiniz / geliştirilebilir?',
      storageNote: '',
      submit: 'Gönder',
      thanks: 'Teşekkürler, kaydedildi!',
      averageLabel: 'Ortalama',
      recentTitle: 'Kayıtlı geri bildirimler (tarayıcıda)',
      empty: 'Henüz kayıt yok.',
      copy: 'Panoya kopyala',
      copied: 'Kopyalandı!',
    },
    experience: [
      {
        company: 'Outlier',
        role: 'AI Trainer',
        location: 'Remote',
        period: 'Eki 2025 - Güncel',
        bullets: [
          'LLM eğitim ve değerlendirme ile kod üretimi/akıl yürütme kabiliyetlerini iyileştirme.',
          'Veri anotasyonu, prompt mühendisliği ve QA sürecinde kaliteyi sağlama.',
        ],
        impact: 'LLM kalite puanlarında artış; hatalı cevaplar düştü.',
        skills: ['Python', 'Prompt Engineering', 'LLM', 'Data Annotation'],
      },
      {
        company: 'Prestij Bilgi Sistemleri Arge A.Ş.',
        role: 'C#.NET Developer Intern',
        location: 'Bursa, Türkiye (Hibrit)',
        period: 'Ağu 2024 - Eyl 2024',
        bullets: [
          'Capstone seviyesinde HIS modülleri geliştirdim; .NET ve SQL ile ölçeklenebilir, güvenli modüller teslim ettim.',
          'Git üzerinden ekip içinde kod inceleme ve versiyonlama deneyimi kazandım.',
          'HIS mimarisinde veri güvenliği, performans optimizasyonu ve regülasyon uyumu hakkında derinleşmiş bilgi.',
          'Operasyonel süreklilik için sorun giderme ve önleyici bakım adımlarını dokümante ettim.',
        ],
        impact: 'Rapor ve HIS sorgularında performans artışı sağlandı.',
        skills: ['C#', '.NET', 'SQL', 'Git', 'HIS'],
      },
      {
        company: 'Sanofi',
        role: 'IT Intern',
        location: 'Lüleburgaz, Türkiye',
        period: 'Tem 2024',
        bullets: [
          'Donanım onarımı, ağ bakımı ve temel IT operasyonlarında pratik yaparak SAP ve veritabanı tarafında deneyim kazandım.',
          'ERP bağlamında SAP S/4HANA ve SAP Fiori temel modüllerini inceledim.',
          'SAP entegrasyonlarını finans, tedarik zinciri, İK gibi süreçlere nasıl uyarlayacağımızı öğrendim; iş akışı özelleştirmeleri yaptım.',
        ],
        impact: "SLA'yi koruyup destek kapanış süresini kısalttım.",
        skills: ['SAP S/4HANA', 'SAP Fiori', 'Network', 'Hardware'],
      },
      {
        company: 'Kırklareli State Hospital',
        role: 'IT Intern',
        location: 'Kırklareli, Türkiye',
        period: 'Ağu 2023 - Eyl 2023',
        bullets: [
          'Donanım ve ağ tarafında teknik destek sağladım; workstation/ağırlıklı sistem kesintilerini minimuma indirdim.',
          'IT operasyonları için temel bakım ve hata giderme prosedürlerini uyguladım.',
        ],
        impact: 'Kesinti sürelerini azalttım; çözüm hızlandı.',
        skills: ['Hardware', 'Network', 'IT Support'],
      },
    ],
    skills: [
      {
        title: 'Data Analysis & BI',
        icon: '📊',
        percent: 85,
        items: [
          { name: 'Power BI', level: 'advanced' },
          { name: 'Excel', level: 'advanced' },
          { name: 'SQL', level: 'advanced' },
          { name: 'DAX', level: 'intermediate' },
          { name: 'Star Schema', level: 'intermediate' },
          { name: 'KPI Reporting', level: 'advanced' },
        ],
        detail: 'Dashboard ve KPI takibini sahadan gelen veriye bağlayıp karar desteğine çeviriyorum.',
      },
      {
        title: 'Programming',
        icon: '💻',
        percent: 75,
        items: [
          { name: 'Python', level: 'advanced' },
          { name: 'C', level: 'intermediate' },
          { name: 'C#', level: 'intermediate' },
          { name: 'JavaScript', level: 'intermediate' },
          { name: 'SQL', level: 'advanced' },
        ],
        detail: 'Farklı yığınlarda temiz, bakımı kolay ve test edilebilir kod yazıyorum.',
      },
      {
        title: 'AI & Machine Learning',
        icon: '🧠',
        percent: 70,
        items: [
          { name: 'PyTorch', level: 'intermediate' },
          { name: 'TensorFlow', level: 'intermediate' },
          { name: 'Scikit-Learn', level: 'advanced' },
          { name: 'OpenCV', level: 'intermediate' },
          { name: 'CNNs', level: 'intermediate' },
          { name: 'LLM Training', level: 'intermediate' },
        ],
        detail: 'Model eğitimi, değerlendirme ve kullanılabilir çıktılar üretme.',
      },
      {
        title: 'Industry 4.0 & IoT',
        icon: '🏭',
        percent: 60,
        items: [
          { name: 'PLC', level: 'intermediate' },
          { name: 'SCADA', level: 'intermediate' },
          { name: 'OPC UA', level: 'intermediate' },
          { name: 'MQTT', level: 'intermediate' },
          { name: 'Edge Devices', level: 'beginner' },
          { name: 'Digitalization', level: 'intermediate' },
          { name: 'IoT Protokolleri', level: 'intermediate' },
        ],
        detail:
          'Saha verisini bulut ve dashboard katmanlarına güvenli şekilde taşıyorum; PLC, SCADA, OPC UA, MQTT, bus/protokol entegrasyonları ve edge cihazlarında tecrübeliyim.',
      },
      {
        title: 'DevOps & Cloud',
        icon: '☁️',
        percent: 55,
        items: [
          { name: 'AWS', level: 'intermediate' },
          { name: 'Docker', level: 'intermediate' },
          { name: 'Kubernetes', level: 'beginner' },
          { name: 'Jenkins', level: 'beginner' },
          { name: 'CI/CD', level: 'intermediate' },
        ],
        detail: 'Konteyner tabanlı dağıtım, CI/CD pipeline ve bulut altyapı yönetimi.',
      },
      {
        title: 'Enterprise Solutions',
        icon: '🏢',
        percent: 50,
        items: [
          { name: 'SAP S/4HANA', level: 'intermediate' },
          { name: 'SAP Fiori', level: 'beginner' },
        ],
        detail: 'Kurumsal iş süreçlerine uyumlu SAP entegrasyonları ve geliştirme.',
      },
    ],
    projects: [
      {
        title: 'End-to-End Smart Manufacturing & AI Proof of Concept (PoC)',
        description:
          'IoT tabanli canli uretim izleme, ERP/MES entegrasyonu ve yapay zeka destekli kestirimci bakim cozumlerini tek platformda birlestiren end-to-end Industry 4.0 uygulamasi. MQTT uzerinden gercek zamanli sensor verisi toplayip PostgreSQL star schema ile saklayan mimari; LSTM tabanli ariza tahmin modeli ve RandomForest tabanli hata tahmin modeli. OEE, MTBF, MTTR, durus Pareto ve tedarikci performansi gibi uretim KPI\'lari otomatik hesaplaniyor. ISO 10816, OEE standartlari ve bakim dokumanlarini kapsayan RAG tabanli akilli asistan. Tum sistem FastAPI tabanli self-contained embedded SPA mimarisiyle tek komutla calistiriliyor.',
        summary:
          'Sensor verisi toplama, kestirimci bakim, uretim KPI otomasyonu ve RAG tabanli akilli asistani tek platformda sunan end-to-end Industry 4.0 PoC uygulamasi.',
        stack: 'Python, FastAPI, MQTT, PostgreSQL, PyTorch, Scikit-Learn, ChromaDB, Ollama, Pandas, NumPy, HTML5 Canvas',
        link: 'https://github.com/JegBaha?tab=repositories',
        github: 'https://github.com/JegBaha?tab=repositories',
        live: '#',
        tags: ['IoT', 'ML', 'Industry 4.0', 'RAG', 'FastAPI', 'Ops'],
        image: '/projects/industry-40-iot-predictive-maintenance.webp',
        impact: 'Gercek zamanli sensor verisi, kestirimci bakim, otomatik KPI hesaplama ve RAG asistanini tek komutla ayaga kalkan bir platformda birlestiriyor.',
        gallery: [
          '/projects/IndustryMaintenance/1.png',
          '/projects/IndustryMaintenance/2.png',
          '/projects/IndustryMaintenance/3.png',
          '/projects/IndustryMaintenance/4.png',
          '/projects/IndustryMaintenance/5.png',
          '/projects/IndustryMaintenance/6.png',
          '/projects/IndustryMaintenance/7.png',
          '/projects/IndustryMaintenance/8.png',
          '/projects/IndustryMaintenance/9.png',
        ],
        details: {
          backend: 'FastAPI, Uvicorn, Pydantic, async mimari',
          frontend: 'Embedded HTML/CSS/Vanilla JS SPA, HTML5 Canvas API (harici kutuphane yok)',
          database: 'PostgreSQL (Star Schema, Fact & Dimension tablolari, Materialized Views)',
          mlModels: 'PyTorch LSTM (zaman serisi ariza tahmini), Scikit-Learn RandomForest (uretim hata tahmini)',
          dataProcessing: 'Pandas, NumPy, KPI otomasyonu (OEE, MTBF, MTTR, Pareto), feature engineering, sliding window',
          protocols: 'MQTT (Mosquitto, paho-mqtt), gercek zamanli sensor streaming ve alarm yonetimi',
          visualization: 'HTML5 Canvas tabanli grafikler, dark theme dashboard',
          deployment: 'Self-contained embedded SPA, tek komut (python ui.py), cross-platform (Windows/Linux)',
          layers: ['IoT Streaming (MQTT)', 'Veri Ambari (Star Schema)', 'KPI Otomasyonu', 'ML Pipeline', 'RAG Asistan', 'Dashboard SPA'],
          versionControl: 'Git, GitHub',
          architecture: 'Moduler monolit, multithreading (daemon threads), @dataclass config yonetimi, RAG (sentence-transformers, ChromaDB, Ollama/OpenAI/Anthropic LLM entegrasyonu)',
        },
      },
      {
        title: 'KPI Automation Toolkit',
        description:
          'Python + VBA hibrit KPI otomasyon pipeline. SAP CSV exportlarını Config dosyasından okuyarak OEE (Availability × Performance × Quality), MTTR/MTBF hesaplamaları ve Downtime Pareto analizleri yapan modüler sistem. Her sınıf tek sorumluluk prensibine uygun: DataIngester, DataCleaner, DataValidator, KPICalculator ve Pipeline orchestrator. Exception tracking ile veri kalitesi görünürlüğü, JSON loglama ile audit trail.',
        summary:
          'SAP verilerinden KPI hesaplama, veri temizleme ve Excel dashboard güncelleme; Python backend + VBA orkestrasyonu ile üretim-seviyesi data pipeline.',
        stack: 'Python, Pandas, NumPy, Excel VBA, JSON, openpyxl',
        link: 'https://github.com/JegBaha?tab=repositories',
        github: 'https://github.com/JegBaha?tab=repositories',
        live: '#',
        tags: ['Automation', 'Data Pipeline', 'KPI', 'Python', 'Excel VBA'],
        image: '/projects/KPIAutomation/KapakFoto.png',
        impact: 'SAP verilerinden otomatik KPI hesaplama ve dashboard güncelleme; manuel raporlama süresini önemli ölçüde azaltır.',
        gallery: [
          '/projects/KPIAutomation/KapakFoto.png',
          '/projects/KPIAutomation/Desktop 2026-02-01 6-29-01 PM-83.png',
        ],
        details: {
          backend: 'Python modülleri (Pipeline, DataCleaner, KPICalculator, DataValidator, PipelineLogger)',
          frontend: 'Excel VBA UserForm, Named Ranges ile dinamik arayüz',
          dataProcessing: 'Pandas ile IQR outlier temizleme, eksik veri handling, negatif değer exception tracking, NumpyEncoder ile JSON serialization',
          visualization: 'Excel Dashboard, Pivot tablolar, Power Query entegrasyonu',
          layers: ['SAP Data Import', 'Schema Validation', 'Data Cleaning', 'KPI Calculation (OEE/MTTR/MTBF)', 'Pareto Analysis', 'Excel Output'],
          versionControl: 'Git, GitHub',
          architecture: 'Modüler Python + VBA hibrit: VBA orkestrasyon → Python data processing → Excel output; Single Responsibility Principle',
        },
      },
      {
        title: 'Drumveil Ritual - Ses Verisi Uzerinde Zaman Serisi Derin Ogrenme',
        description:
          'Ses sinyalleri uzerinde zaman serisi ve spektral analizlere dayali derin ogrenme uygulamasi. Muzikteki sesi Demucs ile ayirip ozellikle drum patternlarini cikaran bir pipeline. Ham ses verileri uzerinde ozellik cikarimi, zaman serisi isleme ve model egitim surecinde veri dengesizligi ile boyut uyumsuzluklari gibi pratik problemlerle calisma.',
        summary:
          'Ses sinyallerinden kaynak ayristirma ve drum pattern cikarimi icin zaman serisi tabanli derin ogrenme uygulamasi.',
        stack: 'Python, PyTorch, Demucs, Librosa',
        link: 'https://github.com/JegBaha?tab=repositories',
        github: 'https://github.com/JegBaha?tab=repositories',
        live: '#',
        tags: ['Audio', 'AI', 'Python', 'Iterative prototype'],
        image: '/projects/drumveil-ritual-metal-drums.webp',
        impact:
          'Ses sinyallerinden ozellik cikarimi ve zaman serisi isleme konusunda pratik deneyim; veri dengesizligi ve boyut uyumsuzluklari gibi gercek problemlerle calisma.',
        gallery: [
          '/projects/drumveil/Desktop 2026-02-07 9-32-34 PM-459.png',
          '/projects/drumveil/Desktop 2026-02-07 9-32-40 PM-935.png',
          '/projects/drumveil/Desktop 2026-02-07 9-32-45 PM-614.png',
          '/projects/drumveil/Desktop 2026-02-07 9-32-53 PM-766.png',
          '/projects/drumveil/Desktop 2026-02-07 9-32-55 PM-552.png',
          '/projects/drumveil/Desktop 2026-02-07 9-32-58 PM-321.png',
          '/projects/drumveil/Desktop 2026-02-07 9-33-01 PM-207.png',
          '/projects/drumveil/Desktop 2026-02-07 9-33-07 PM-275.png',
          '/projects/drumveil/Desktop 2026-02-07 9-33-20 PM-13.png',
        ],
        details: {
          dataProcessing: 'Spektrogram dönüşümü, ses segmentasyonu, Slakh dataset hazırlığı',
          mlModels: 'Demucs (kaynak ayrıştırma), Onsets and Frames (nota çıkarma)',
          visualization: 'Spektrogram görselleştirme, MIDI çıktı önizleme',
          layers: ['Ses Yükleme', 'Kaynak Ayrıştırma', 'Spektrum Analizi', 'Nota Tespiti', 'MIDI Dönüşümü'],
          hardware: 'GPU gereksinimi (eğitim için), CPU inference desteği',
          versionControl: 'Git, GitHub',
          architecture: 'İki aşamalı pipeline: Ayrıştırma → Transkripsiyon',
        },
      },
      {
        title: 'NeuraVeil - MRI Tümör Sınıflandırma',
        description:
          'EfficientNet, DenseNet, ResNet gibi modelleri transfer learning ve Optuna ile ayarlayarak MRI üzerinde çoklu tümör tipini yüksek doğrulukla sınıflandıran sistem. OpenCV preprocessing, veri dengesi, L2 regülasyonu ve dropout ile üretim seviyesinde model.',
        summary:
          'Çok veri kaynaklı MRI pipeline, model ensemble ve REST API ile sağlık için uca-uca AI.',
        stack: 'PyTorch, TensorFlow, CNN',
        link: 'https://github.com/JegBaha?tab=repositories',
        github: 'https://github.com/JegBaha?tab=repositories',
        live: '#',
        tags: ['AI', 'Computer Vision', 'Healthcare'],
        image: '/projects/neuraveil-mri-tumor.webp',
        impact: 'Transfer learning ile yüksek doğrulukta tümör sınıflandırması sağlandı.',
        gallery: [
          '/projects/neuraveil/442462721-7e760073-42c5-49d3-a0e6-2dd4b3ad9971.png',
          '/projects/neuraveil/442462723-0a40c626-411d-4134-86d4-714de8f16946.png',
          '/projects/neuraveil/442462729-2fe82a37-decb-47a6-87a0-1636b3cf7f7a.png',
          '/projects/neuraveil/442462730-52456c0e-ae72-4945-bd60-c3650383407a.png',
          '/projects/neuraveil/442462734-97d8505d-14a6-4d2b-9321-f3f150d1e80f.png',
        ],
        details: {
          backend: 'FastAPI REST API servisi',
          dataProcessing: 'OpenCV ile görüntü ön işleme, veri artırma (augmentation), sınıf dengeleme',
          mlModels: 'EfficientNet, DenseNet, ResNet (Transfer Learning), Model Ensemble',
          visualization: 'Confusion Matrix, Grad-CAM görselleştirme, Eğitim metrikleri',
          layers: ['Veri Toplama', 'Preprocessing', 'Model Eğitimi', 'Hiperparametre Optimizasyonu (Optuna)', 'API Servisi'],
          versionControl: 'Git, GitHub',
          architecture: 'Modüler CNN pipeline, L2 regülasyonu, Dropout katmanları',
        },
      },
      {
        title: 'Supply Chain Analytics Dashboard – Data & ML PoC',
        description:
          'Tedarik zinciri performansını tek bir yerden izlemek için Streamlit ile geliştirilmiş kapsamlı web dashboard. Tedarikçi performansı, teslimat gecikmeleri, maliyet trendleri, risk analizi ve envanter yönetimini tek panelde birleştiriyor. ML modelleri ile teslimat süresi tahmini yapıyor, dış API\'lerden hava durumu ve döviz kurları çekerek risk değerlendirmesini zenginleştiriyor.',
        summary: 'End-to-end tedarik zinciri analitiği: KPI izleme, ML tabanlı tahminleme, risk skorlama ve envanter optimizasyonu.',
        stack: 'Python, Streamlit, Pandas, NumPy, Plotly, SQLAlchemy, SQLite, scikit-learn, Requests',
        link: 'https://github.com/JegBaha?tab=repositories',
        github: 'https://github.com/JegBaha?tab=repositories',
        live: '#',
        tags: ['Data Analytics', 'Machine Learning', 'Python', 'Dashboard', 'Supply Chain'],
        image: '/projects/SupplyChain/Desktop 2026-01-29 7-49-55 PM-642.png',
        impact: 'Tedarikçi skorlama, teslimat tahmini ve risk yönetimini tek platformda birleştiren PoC; karar destek süreçlerini hızlandırır.',
        details: {
          backend: 'Python, Streamlit, SQLAlchemy',
          database: 'SQLite (supply_chain.db)',
          frontend: 'Streamlit UI Components',
          mlModels: 'RandomForest, GradientBoosting (teslimat süresi tahmini)',
          visualization: 'Plotly (bar, pie, area, radar, heatmap)',
          dataProcessing: 'Pandas, NumPy (filtreleme, agregasyon, KPI hesaplama)',
          layers: [
            'Tedarikçi Analizi',
            'Teslimat Tahmini (ML)',
            'Maliyet Optimizasyonu',
            'Risk Değerlendirmesi',
            'Envanter Yönetimi',
            'Dış Veri Entegrasyonu (Hava/Döviz/Emtia)',
          ],
          architecture: 'Modüler Python mimarisi: config → models → db_manager → analytics modules → UI components',
          versionControl: 'Git, GitHub',
        },
        gallery: [
          '/projects/SupplyChain/Desktop 2026-01-29 7-49-55 PM-642.png',
          '/projects/SupplyChain/Desktop 2026-01-29 7-50-01 PM-762.png',
          '/projects/SupplyChain/Desktop 2026-01-29 7-50-09 PM-660.png',
          '/projects/SupplyChain/Desktop 2026-01-29 7-50-14 PM-800.png',
          '/projects/SupplyChain/Desktop 2026-01-29 7-50-19 PM-361.png',
          '/projects/SupplyChain/Desktop 2026-01-29 7-50-21 PM-630.png',
          '/projects/SupplyChain/Desktop 2026-01-29 7-50-32 PM-511.png',
          '/projects/SupplyChain/Desktop 2026-01-29 7-50-38 PM-171.png',
          '/projects/SupplyChain/Desktop 2026-01-29 7-50-42 PM-160.png',
          '/projects/SupplyChain/Desktop 2026-01-29 7-50-52 PM-134.png',
          '/projects/SupplyChain/Desktop 2026-01-29 7-50-58 PM-109.png',
          '/projects/SupplyChain/Desktop 2026-01-29 7-51-03 PM-132.png',
          '/projects/SupplyChain/Desktop 2026-01-29 7-51-21 PM-548.png',
          '/projects/SupplyChain/Desktop 2026-01-29 7-51-29 PM-324.png',
          '/projects/SupplyChain/Desktop 2026-01-29 7-51-36 PM-880.png',
          '/projects/SupplyChain/Desktop 2026-01-29 7-51-38 PM-629.png',
          '/projects/SupplyChain/Desktop 2026-01-29 7-51-41 PM-254.png',
        ],
      },
      {
        title: 'Heart Disease Prediction ML Projesi',
        description:
          'Heart Failure Prediction verisinde eksik/kategorik/numerik alanları temizleyip normalize ederek KNN, Lojistik Regresyon ve Karar Ağacı modellerini karşılaştırdım. Performansı accuracy/precision/recall/F1 ile ölçtüm.',
        summary:
          'Veri ön-işleme, çoklu model denemesi ve sağlık verisinde kalp hastalığı olasılığı tahmini.',
        stack: 'Scikit-Learn, Python, ML',
        link: 'https://github.com/JegBaha?tab=repositories',
        github: 'https://github.com/JegBaha?tab=repositories',
        live: '#',
        tags: ['ML', 'Data Analysis', 'Healthcare'],
        image: '/projects/heart-disease-prediction-ml.webp',
        impact: 'Model karşılaştırması ile en iyi tahmin doğruluğu belirlendi.',
        details: {
          dataProcessing: 'Eksik veri doldurma, kategorik değişken kodlama, Min-Max normalizasyon',
          mlModels: 'K-Nearest Neighbors (KNN), Lojistik Regresyon, Decision Tree',
          visualization: 'Confusion Matrix, ROC Curve, Precision-Recall grafikleri',
          layers: ['Veri Temizleme', 'Feature Engineering', 'Model Eğitimi', 'Model Karşılaştırma', 'Değerlendirme'],
          versionControl: 'Git, GitHub',
          architecture: 'Jupyter Notebook tabanlı analiz pipeline\'ı',
        },
      },
      {
        title: 'Excel VBA Automation Toolkit (Prototype / Demo)',
        description:
          "Excel VBA tabanlı modüler otomasyon toolkit'i; SAP CSV verisini Config'ten okuyup Raw → Staging akışına alıyor, dashboard/pivotlar otomatik yeniliyor. Merkezi loglama/hata yönetimi, Config'e bağlı UserForm EN/TR UI ve çoklu veri kaynakları (CSV/JSON/Excel) entegrasyonu var.",
        summary:
          'Mock SAP export ve JSON datasetleriyle konfigürasyon bazlı, yeniden kullanılabilir otomasyon Prototype / Demo; log temizleme ve dashboard refresh otomatik.',
        stack: 'Excel VBA, Office Automation, SAP CSV, JSON',
        link: 'https://github.com/JegBaha?tab=repositories',
        github: 'https://github.com/JegBaha?tab=repositories',
        live: '#',
        tags: ['Prototype / Demo', 'Excel VBA', 'Automation'],
        image: '/projects/excel-vba-automation.webp',
        impact: 'Modüler VBA mimarisi, hata yakalama ve Config yönetimi pratiği.',
        playground: true,
        details: {
          backend: 'Excel VBA modülleri',
          frontend: 'UserForm (EN/TR çoklu dil desteği)',
          dataProcessing: 'SAP CSV import, JSON parsing, Excel veri manipülasyonu',
          layers: ['Config Yönetimi', 'Veri Okuma (Raw)', 'Veri İşleme (Staging)', 'Dashboard/Pivot Güncelleme', 'Loglama'],
          versionControl: 'Git',
          architecture: 'Modüler VBA yapısı, merkezi hata yönetimi, Config-driven tasarım',
        },
      },
      {
        title: 'Employee Management System (.NET)',
        description:
          '.NET ile geliştirilen basit çalışan yönetim sistemi; CRUD, roller, izin/rapor işlemleri ve SQL veri tabanı katmanı. Staj sürecinde gerçek senaryolarla test edildi.',
        summary: 'C#.NET tabanlı HR/employee yönetim uygulaması; temel CRUD ve raporlama.',
        stack: 'C#.NET, SQL, Entity Framework',
        link: 'https://github.com/JegBaha/StajEmployeeManagement',
        github: 'https://github.com/JegBaha/StajEmployeeManagement',
        live: '#',
        tags: ['.NET', 'C#', 'SQL'],
        image: '',
        impact: 'İzin ve takip süreçlerinde belirgin zaman kazancı.',
        details: {
          backend: 'ASP.NET Core MVC',
          frontend: 'Razor Views, HTML, CSS, JavaScript',
          database: 'MS SQL Server',
          orm: 'Entity Framework Core (Code First)',
          auth: 'Rol tabanlı yetkilendirme (Admin, User)',
          layers: ['Presentation', 'Business Logic', 'Data Access', 'Database'],
          versionControl: 'Git, GitHub',
          architecture: 'Katmanlı mimari (N-Tier), Repository Pattern',
        },
      },
      {
        title: '3D Runner Game',
        description: 'Unity/C# tek kişilik 3D koşu; basit level tasarımı ve fizik odaklı, hızlı iterasyon.',
        summary: 'Pipeline ve asset yönetimi pratiği için hobi Prototype / Demo.',
        stack: 'Unity, C#',
        link: 'https://github.com/JegBaha?tab=repositories',
        github: 'https://github.com/JegBaha?tab=repositories',
        live: '#',
        tags: ['Game', 'C#', 'Unity', 'Prototype / Demo'],
        image: '',
        impact: 'Tek kişilik pipeline ve iterasyon hızında artış.',
        playground: true,
        hobby: true,
        details: {
          backend: 'Unity Engine, C# scripting',
          layers: ['Oyun Mekaniği', 'Fizik Sistemi', 'Level Tasarımı', 'Asset Yönetimi'],
          versionControl: 'Git',
          architecture: 'Component-Based mimari',
        },
      },
      {
        title: 'Galaxy Survivor 2D Game',
        description: 'Unity 2D shooter; kısa sürede level ve düşman dalgaları kurulan mini proje.',
        summary: '2D oyun döngüsü, basit AI ve asset entegrasyonu Prototype / Demo.',
        stack: 'Unity, C#',
        link: 'https://github.com/JegBaha?tab=repositories',
        github: 'https://github.com/JegBaha?tab=repositories',
        live: '#',
        tags: ['Game', 'C#', 'Unity', 'Prototype / Demo'],
        image: '',
        impact: 'Hızlı prototipleme ve asset entegrasyonu pratiği.',
        playground: true,
        hobby: true,
        details: {
          backend: 'Unity 2D Engine, C# scripting',
          layers: ['Oyun Döngüsü', 'Düşman AI', 'Dalga Sistemi', 'Sprite Yönetimi'],
          versionControl: 'Git',
          architecture: '2D Component-Based mimari',
        },
      },
      {
        title: '3D First Person Shooter Game',
        description:
          '3 kişilik ekipte 2.5 haftada tamamlanan FPS/puzzle; seviye tasarımı, basit AI ve etkileşimli ortamlar.',
        summary: 'Ekip içi görev dağılımı ve hızlı prototipleme odaklı mini proje.',
        stack: 'Unity, C#',
        link: 'https://github.com/JegBaha?tab=repositories',
        github: 'https://github.com/JegBaha?tab=repositories',
        live: '#',
        tags: ['Game', 'C#', 'Unity', 'Prototype / Demo'],
        image: '',
        impact: '2.5 haftada ekipçe MVP; koordinasyon deneyimi.',
        playground: true,
        hobby: true,
        details: {
          backend: 'Unity 3D Engine, C# scripting',
          layers: ['FPS Mekaniği', 'Puzzle Sistemi', 'Düşman AI', 'Level Tasarımı', 'Etkileşim Sistemi'],
          projectManagement: '3 kişilik ekip, Agile yaklaşım',
          versionControl: 'Git',
          architecture: '3D FPS Component-Based mimari',
        },
      },
    ],
    education: [
      {
        school: 'Trakya University',
        degree: 'Bachelor of Engineering, Computer Engineering',
        location: 'Edirne, Türkiye',
        period: 'Sep 2021 - Jan 2026',
        diploma: '/diploma.jpg',
      },
      {
        school: 'GEN Academy',
        degree: 'AI Software Development & Artificial Intelligence',
        location: 'Remote',
        period: 'Sep 2024 - Jun 2025',
      },
    ],
    certifications: [
      { name: 'AWS for DevOps: Continuous Delivery and Automation', provider: 'AWS' },
      { name: 'Jenkins, Kubernetes, Docker', provider: 'DevOps' },
      { name: 'Microsoft Azure AI Essentials', provider: 'Microsoft' },
      { name: 'Apache Spark Essentials', provider: 'Databricks' },
      { name: 'LLM Foundations & RAG', provider: 'AI' },
      { name: 'Endüstriyel Otomasyon & IoT (PLC, SCADA, OPC UA, MQTT)', provider: 'Endüstri' },
    ],
    languages: [
      { name: 'Türkçe', level: 'Ana dil', percent: 100 },
      { name: 'İngilizce', level: 'B2', percent: 70 },
      { name: 'Almanca', level: 'A2 → B2 devam ediyor', percent: 30 },
    ],
    about: {
      eyebrow: 'Hakkımda',
      title: 'Veriyi sadece analiz eden değil, nasıl üretildiğini, nasıl aktığını ve nasıl aksiyona dönüştüğünü önemseyen bir mühendisim.',
      bio: 'Akıllı fabrika, endüstriyel IoT ve üretim analitiği projelerinde; veri altyapısı, backend servisleri ve makine öğrenmesi bileşenlerini uçtan uca geliştiriyorum. Hedefim, sahadan gelen ham veriyi ölçeklenebilir, güvenilir ve iş değeri üreten sistemlere dönüştürmek.',
      strengths: [
        'Problem çözümleme ve sistem düşüncesi',
        'Uçtan uca veri akışına bakış',
        'Endüstriyel süreç anlayışı',
        'Hızlı öğrenme ve adaptasyon',
        'Net iletişim ve paydaş yönetimi',
      ],
      openTo: ['Industrial AI Engineer', 'Data Engineer (Streaming & Manufacturing)', 'Applied AI / Data Engineer'],
      highlight: 'Endüstriyel sistemlere yönelmiş Applied AI / Data Engineer olarak; akıllı fabrika, üretim verisi ve karar destek sistemleri geliştiriyorum.',
      motto: '"Veriyi anlamak, sistemi anlamaktır."',
      timeline: [
        { year: '2021', text: 'Trakya Üniversitesi Bilgisayar Mühendisliği başlangıç' },
        { year: '2023', text: 'İlk staj deneyimi — kurumsal IT & veri' },
        { year: '2024', text: 'GEN Academy AI Bootcamp başlangıç' },
        { year: '2025', text: 'AI eğitim uzmanı olarak profesyonel deneyim' },
        { year: '2026', text: 'Mezuniyet — Bilgisayar Mühendisliği' },
      ],
    },
    toolbelt: [
      { category: 'BI & Data', tools: ['Power BI / DAX', 'Star Schema', 'KPI', 'Gateway'] },
      { category: 'AI & ML', tools: ['Python / PyTorch', 'CNN', 'Data Pipelines', 'Evaluation'] },
      { category: 'Database', tools: ['SQL', 'Query Optimize', 'Joins', 'CTE'] },
      { category: 'Automation', tools: ['Zapier', 'Airtable', 'Slack'] },
      { category: 'Cloud & DevOps', tools: ['AWS', 'Docker', 'CI/CD'] },
    ],
    cv: { link: '/Baha_Buyukates_CV.pdf', updated: 'Aralık 2025', label: 'CV indir (Aralık 2025)' },
    impactStats: {
      experienceValue: '4+',
      experienceLabel: 'Staj/İş Deneyimi',
      projectsValue: '10+',
      projectsLabel: 'Proje Tamamlandı',
      languagesValue: '3',
      languagesLabel: 'Dil Konuşuyor',
      englishValue: 'B2',
      englishLabel: 'İngilizce Seviye',
    },
    currentlyLearning: {
      title: 'Şu An Öğreniyorum',
      items: [
        {
          icon: '🏭',
          title: 'Endüstri 4.0',
          subtitle: 'PLC, SCADA, OPC UA',
          progress: 65,
        },
        {
          icon: '🤖',
          title: 'Dijitalizasyon & Otomasyon',
          subtitle: 'IoT, Akıllı Sistemler',
          progress: 45,
        },
      ],
    },
    hobbyShowcase: {
      genres: ['Progressive Metal', 'Djent', 'Metalcore'],
      daws: ['FL Studio', 'Ableton Live'],
      instruments: ['Elektro Gitar', 'Drum Programming'],
    },
  },
  DE: {
    nav: {
      about: 'Über mich',
      experience: 'Erfahrung',
      projects: 'Projekte',
      skills: 'Skills',
      contact: 'Kontakt',
    },
    brandEyebrow: 'Industrial AI & Data Engineer',
    welcome: '',
    hero: {
      eyebrow: 'Industrial AI Engineer | Willkommen',
      titleMain: 'Industrial AI & Data Engineer,',
      titleAccent: ' Smart Factories, Produktionsdaten und Entscheidungsunterstützungssysteme',
      impactLine: '4+ Jahre Erfahrung • 10+ Projekte • EU-Bürger • Sofort verfügbar',
      lede: 'Ich nehme Daten vom Shopfloor (MES, Sensoren, ERP) und entwickle skalierbare Datenpipelines, KPIs und Machine-Learning-Modelle, um Produktionsqualität und operative Entscheidungen zu verbessern.',
      ctas: { browse: 'Projekte ansehen', download: 'CV herunterladen' },
      ctaNotes: { citizen: 'EU-Bürger (Bulgarien)', availability: 'Sofort verfügbar' },
    },
    heroPanel: {
      status: 'Open to Work',
      location: 'Türkei / Deutschland',
      focus: 'Expertise',
      focusItems: [
        { label: 'Industrial AI', active: true },
        { label: 'Data Engineering (Manufacturing)', active: true },
        { label: 'Backend & ML Integration', active: false },
      ],
      availability: 'Sofort einsatzbereit',
    },
    projectsNoteCta: 'Mehr auf GitHub',
    sections: {
      experience: {
        eyebrow: 'Berufserfahrung',
        title: 'Was ich umgesetzt habe',
        text: 'Erfahrungen an der Schnittstelle von AI-Training, Datenanalyse und Enterprise IT.',
      },
      skills: {
        eyebrow: 'Was ich biete',
        title: 'Skill-Stack',
        text: 'Faehigkeiten, die Daten, KI, Automatisierung und Unternehmensprozesse verbinden; mit praxisnaher Erfahrung.',
      },
      projects: {
        eyebrow: 'Ausgewaehlte Projekte',
        title: 'Ausgewaehlte Projekte',
        text: 'Performance und Nutzererlebnis zusammen.',
      },
      education: {
        eyebrow: 'Ausbildung',
        title: 'Grundlagen & Mittelstufe',
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
        text: 'Ich produziere Djent- und Progressive-Metal-Tracks. Musik spiegelt meine Leidenschaft für technische Details und diszipliniertes Arbeiten wider.',
        benefit: '',
        cta: '',
      },
      contact: {
        eyebrow: 'Kontakt',
        title: 'Bereit fuer das naechste Projekt.',
        text: 'Fuer Datenanalyse, Dashboarding, AI-Training oder Automatisierung: Melde dich gern.',
        formTitle: 'Nachricht senden',
        subjects: ['Projektanfrage', 'Zusammenarbeit', 'Sonstiges'],
        availability: 'Verfuegbar',
        sent: 'Gesendet!',
      },
    },
    feedback: {
      cta: 'Feedback geben',
      reminder: 'Schon 30s hier? Ein kurzes Feedback hilft mir.',
      title: 'Hat es dir gefallen?',
      subtitle: '1-5 Sterne, Kommentar optional.',
      ratingLabel: 'Sterne',
      moodQuestion: 'Schnellauswahl',
      like: 'Gefällt mir',
      dislike: 'Gefällt mir nicht',
      commentPlaceholder: 'Was war gut / was fehlt?',
      storageNote: '',
      submit: 'Senden',
      thanks: 'Danke, gespeichert!',
      averageLabel: 'Durchschnitt',
      recentTitle: 'Gespeichertes Feedback (lokal)',
      empty: 'Noch keine Einträge.',
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
        skills: ['Python', 'Prompt Engineering', 'LLM', 'Data Annotation'],
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
        skills: ['C#', '.NET', 'SQL', 'Git', 'HIS'],
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
        skills: ['SAP S/4HANA', 'SAP Fiori', 'Network', 'Hardware'],
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
        skills: ['Hardware', 'Network', 'IT Support'],
      },
    ],
    skills: [
      {
        title: 'Data Analysis & BI',
        icon: '📊',
        percent: 85,
        items: [
          { name: 'Power BI', level: 'advanced' },
          { name: 'Excel', level: 'advanced' },
          { name: 'SQL', level: 'advanced' },
          { name: 'DAX', level: 'intermediate' },
          { name: 'Star Schema', level: 'intermediate' },
          { name: 'KPI Reporting', level: 'advanced' },
        ],
        detail: 'Ich uebersetze Daten in Entscheidungs-Dashboards und messbare KPIs.',
      },
      {
        title: 'Programmierung',
        icon: '💻',
        percent: 75,
        items: [
          { name: 'Python', level: 'advanced' },
          { name: 'C', level: 'intermediate' },
          { name: 'C#', level: 'intermediate' },
          { name: 'JavaScript', level: 'intermediate' },
          { name: 'SQL', level: 'advanced' },
        ],
        detail: 'Schreibe sauberen, wartbaren und testbaren Code in verschiedenen Stacks.',
      },
      {
        title: 'AI & Machine Learning',
        icon: '🧠',
        percent: 70,
        items: [
          { name: 'PyTorch', level: 'intermediate' },
          { name: 'TensorFlow', level: 'intermediate' },
          { name: 'Scikit-Learn', level: 'advanced' },
          { name: 'OpenCV', level: 'intermediate' },
          { name: 'CNNs', level: 'intermediate' },
          { name: 'LLM Training', level: 'intermediate' },
        ],
        detail: 'Training, Bewertung und nutzernahe Modelle mit klaren Outputs.',
      },
      {
        title: 'Industrie 4.0 & IoT',
        icon: '🏭',
        percent: 60,
        items: [
          { name: 'PLC', level: 'intermediate' },
          { name: 'SCADA', level: 'intermediate' },
          { name: 'OPC UA', level: 'intermediate' },
          { name: 'MQTT', level: 'intermediate' },
          { name: 'Edge Devices', level: 'beginner' },
          { name: 'Digitalisierung', level: 'intermediate' },
          { name: 'IoT-Protokolle', level: 'intermediate' },
        ],
        detail:
          'Fuehre Felddaten sicher in Cloud- und Dashboard-Ebenen; Erfahrung mit PLC, SCADA, OPC UA, MQTT, Bus-/Protokollintegration und Edge-Geraeten.',
      },
      {
        title: 'DevOps & Cloud',
        icon: '☁️',
        percent: 55,
        items: [
          { name: 'AWS', level: 'intermediate' },
          { name: 'Docker', level: 'intermediate' },
          { name: 'Kubernetes', level: 'beginner' },
          { name: 'Jenkins', level: 'beginner' },
          { name: 'CI/CD', level: 'intermediate' },
        ],
        detail: 'Container-Deployment, CI/CD-Pipelines und Cloud-Infrastrukturmanagement.',
      },
      {
        title: 'Enterprise Solutions',
        icon: '🏢',
        percent: 50,
        items: [
          { name: 'SAP S/4HANA', level: 'intermediate' },
          { name: 'SAP Fiori', level: 'beginner' },
        ],
        detail: 'Integrationen und Entwicklungen passend zu Unternehmensprozessen.',
      },
    ],
    projects: [
      {
        title: 'End-to-End Smart Manufacturing & AI Proof of Concept (PoC)',
        description:
          'IoT-basierte Echtzeit-Produktionsueberwachung, ERP/MES-Integration und KI-gestuetzte vorausschauende Wartung in einer End-to-End Industry 4.0 Plattform. Echtzeit-Sensordaten werden ueber MQTT erfasst und in einem PostgreSQL Star Schema gespeichert. LSTM-basiertes Ausfallvorhersagemodell fuer IoT-Zeitreihen und RandomForest-basiertes Fehlervorhersagemodell fuer Produktions- und ERP-Daten. OEE, MTBF, MTTR, Stillstands-Pareto und Lieferantenperformance werden automatisch berechnet. RAG-basierter intelligenter Assistent mit ISO 10816, OEE-Standards und Wartungsdokumentation. Das gesamte System laeuft als FastAPI-basierte self-contained embedded SPA mit einem einzigen Befehl.',
        summary:
          'Sensordatenerfassung, vorausschauende Wartung, Produktions-KPI-Automatisierung und RAG-basierter intelligenter Assistent in einer End-to-End Industry 4.0 PoC-Plattform.',
        stack: 'Python, FastAPI, MQTT, PostgreSQL, PyTorch, Scikit-Learn, ChromaDB, Ollama, Pandas, NumPy, HTML5 Canvas',
        link: 'https://github.com/JegBaha?tab=repositories',
        github: 'https://github.com/JegBaha?tab=repositories',
        live: '#',
        tags: ['IoT', 'ML', 'Industry 4.0', 'RAG', 'FastAPI', 'Ops'],
        image: '/projects/industry-40-iot-predictive-maintenance.webp',
        impact: 'Vereint Echtzeit-Sensordaten, vorausschauende Wartung, automatische KPI-Berechnung und RAG-Assistent in einer mit einem Befehl startbaren Plattform.',
        gallery: [
          '/projects/IndustryMaintenance/1.png',
          '/projects/IndustryMaintenance/2.png',
          '/projects/IndustryMaintenance/3.png',
          '/projects/IndustryMaintenance/4.png',
          '/projects/IndustryMaintenance/5.png',
          '/projects/IndustryMaintenance/6.png',
          '/projects/IndustryMaintenance/7.png',
          '/projects/IndustryMaintenance/8.png',
          '/projects/IndustryMaintenance/9.png',
        ],
        details: {
          backend: 'FastAPI, Uvicorn, Pydantic, async Architektur',
          frontend: 'Embedded HTML/CSS/Vanilla JS SPA, HTML5 Canvas API (keine externen JS-Bibliotheken)',
          database: 'PostgreSQL (Star Schema, Fact- & Dimensionstabellen, Materialized Views)',
          mlModels: 'PyTorch LSTM (Zeitreihen-Ausfallprognose), Scikit-Learn RandomForest (Produktionsfehlervorhersage)',
          dataProcessing: 'Pandas, NumPy, KPI-Automatisierung (OEE, MTBF, MTTR, Pareto), Feature Engineering, Sliding Window',
          protocols: 'MQTT (Mosquitto, paho-mqtt), Echtzeit-Sensor-Streaming und Alarmmanagement',
          visualization: 'HTML5 Canvas basierte Diagramme, Dark Theme Dashboard',
          deployment: 'Self-contained embedded SPA, ein Befehl (python ui.py), plattformuebergreifend (Windows/Linux)',
          layers: ['IoT Streaming (MQTT)', 'Data Warehouse (Star Schema)', 'KPI-Automatisierung', 'ML Pipeline', 'RAG Assistent', 'Dashboard SPA'],
          versionControl: 'Git, GitHub',
          architecture: 'Modularer Monolith, Multithreading (Daemon Threads), @dataclass Config-Management, RAG (sentence-transformers, ChromaDB, Ollama/OpenAI/Anthropic LLM-Integration)',
        },
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
        impact: 'Beste Vorhersagegenauigkeit durch Modellvergleich ermittelt.',
        details: {
          dataProcessing: 'Missing Value Imputation, Kategorische Codierung, Min-Max Normalisierung',
          mlModels: 'K-Nearest Neighbors (KNN), Logistische Regression, Decision Tree',
          visualization: 'Confusion Matrix, ROC Curve, Precision-Recall Grafiken',
          layers: ['Datenbereinigung', 'Feature Engineering', 'Modelltraining', 'Modellvergleich', 'Evaluation'],
          versionControl: 'Git, GitHub',
          architecture: 'Jupyter Notebook basierte Analyse-Pipeline',
        },
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
        impact: 'Hochgenaue Tumorklassifizierung durch Transfer Learning erreicht.',
        gallery: [
          '/projects/neuraveil/442462721-7e760073-42c5-49d3-a0e6-2dd4b3ad9971.png',
          '/projects/neuraveil/442462723-0a40c626-411d-4134-86d4-714de8f16946.png',
          '/projects/neuraveil/442462729-2fe82a37-decb-47a6-87a0-1636b3cf7f7a.png',
          '/projects/neuraveil/442462730-52456c0e-ae72-4945-bd60-c3650383407a.png',
          '/projects/neuraveil/442462734-97d8505d-14a6-4d2b-9321-f3f150d1e80f.png',
        ],
        details: {
          backend: 'FastAPI REST API Service',
          dataProcessing: 'OpenCV Bildvorverarbeitung, Data Augmentation, Klassenbalancierung',
          mlModels: 'EfficientNet, DenseNet, ResNet (Transfer Learning), Model Ensemble',
          visualization: 'Confusion Matrix, Grad-CAM Visualisierung, Training-Metriken',
          layers: ['Datensammlung', 'Preprocessing', 'Modelltraining', 'Hyperparameter-Optimierung (Optuna)', 'API Service'],
          versionControl: 'Git, GitHub',
          architecture: 'Modulare CNN Pipeline, L2 Regularisierung, Dropout-Schichten',
        },
      },
      {
        title: 'Drumveil Ritual - Deep Learning auf Audiodaten (Zeitreihen)',
        description:
          'Deep-Learning-Anwendung basierend auf Zeitreihen- und Spektralanalyse von Audiosignalen. Trennt Musikquellen mit Demucs und extrahiert gezielt Drum-Patterns. Feature-Extraktion und Zeitreihenverarbeitung auf Rohaudiodaten; praktische Arbeit mit Datenungleichgewicht und Dimensionsinkompatibilitaeten im Trainingsprozess.',
        summary:
          'Zeitreihenbasierte Deep-Learning-Anwendung fuer Quelltrennung und Drum-Pattern-Extraktion aus Audiosignalen.',
        stack: 'Python, PyTorch, Demucs, Librosa',
        link: 'https://github.com/JegBaha?tab=repositories',
        github: 'https://github.com/JegBaha?tab=repositories',
        live: '#',
        tags: ['Audio', 'AI', 'Python', 'Iterative prototype'],
        image: '/projects/drumveil-ritual-metal-drums.webp',
        impact:
          'Praktische Erfahrung mit Feature-Extraktion und Zeitreihenverarbeitung auf Audiosignalen; Arbeit mit realen Problemen wie Datenungleichgewicht und Dimensionsinkompatibilitaeten.',
        gallery: [
          '/projects/drumveil/Desktop 2026-02-07 9-32-34 PM-459.png',
          '/projects/drumveil/Desktop 2026-02-07 9-32-40 PM-935.png',
          '/projects/drumveil/Desktop 2026-02-07 9-32-45 PM-614.png',
          '/projects/drumveil/Desktop 2026-02-07 9-32-53 PM-766.png',
          '/projects/drumveil/Desktop 2026-02-07 9-32-55 PM-552.png',
          '/projects/drumveil/Desktop 2026-02-07 9-32-58 PM-321.png',
          '/projects/drumveil/Desktop 2026-02-07 9-33-01 PM-207.png',
          '/projects/drumveil/Desktop 2026-02-07 9-33-07 PM-275.png',
          '/projects/drumveil/Desktop 2026-02-07 9-33-20 PM-13.png',
        ],
        details: {
          dataProcessing: 'Spektrogramm-Transformation, Audio-Segmentierung, Slakh Dataset Vorbereitung',
          mlModels: 'Demucs (Quelltrennung), Onsets and Frames (Notenextraktion)',
          visualization: 'Spektrogramm-Visualisierung, MIDI Output Vorschau',
          layers: ['Audio-Loading', 'Quelltrennung', 'Spektrum-Analyse', 'Notenerkennung', 'MIDI-Konvertierung'],
          hardware: 'GPU-Anforderung (Training), CPU Inference Support',
          versionControl: 'Git, GitHub',
          architecture: 'Zweistufige Pipeline: Trennung → Transkription',
        },
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
        details: {
          backend: 'ASP.NET Core MVC',
          frontend: 'Razor Views, HTML, CSS, JavaScript',
          database: 'MS SQL Server',
          orm: 'Entity Framework Core (Code First)',
          auth: 'Rollenbasierte Autorisierung (Admin, User)',
          layers: ['Presentation', 'Business Logic', 'Data Access', 'Database'],
          versionControl: 'Git, GitHub',
          architecture: 'Schichtenarchitektur (N-Tier), Repository Pattern',
        },
      },
      {
        title: 'Excel VBA Automation Toolkit (Prototype / Demo)',
        description:
          'Modulares Excel-VBA-Automation-Toolkit: SAP-CSV wird aus Config gelesen, Raw → Staging Pipeline, Dashboards/Pivots aktualisieren automatisch. Zentrales Logging/Error-Handling, EN/DE UserForm-UI aus Config und Multi-Source-Import (CSV/JSON/Excel).',
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
        details: {
          backend: 'Excel VBA Module',
          frontend: 'UserForm (EN/DE Mehrsprachigkeit)',
          dataProcessing: 'SAP CSV Import, JSON Parsing, Excel Datenmanipulation',
          layers: ['Config Management', 'Daten-Lesen (Raw)', 'Datenverarbeitung (Staging)', 'Dashboard/Pivot Update', 'Logging'],
          versionControl: 'Git',
          architecture: 'Modulare VBA Struktur, zentrales Error-Handling, Config-Driven Design',
        },
      },
      {
        title: 'KPI Automation Toolkit',
        description:
          'Python + VBA Hybrid-KPI-Automatisierungs-Pipeline. Liest SAP-CSV-Exporte über Config-Datei und berechnet OEE (Availability × Performance × Quality), MTTR/MTBF sowie Downtime-Pareto-Analysen. Modulares System nach Single-Responsibility-Prinzip: DataIngester, DataCleaner, DataValidator, KPICalculator und Pipeline-Orchestrator. Exception-Tracking für Datenqualitäts-Sichtbarkeit, JSON-Logging für Audit-Trail.',
        summary:
          'KPI-Berechnung aus SAP-Daten, Datenbereinigung und Excel-Dashboard-Aktualisierung; Python-Backend + VBA-Orchestrierung für produktionsreife Data-Pipeline.',
        stack: 'Python, Pandas, NumPy, Excel VBA, JSON, openpyxl',
        link: 'https://github.com/JegBaha?tab=repositories',
        github: 'https://github.com/JegBaha?tab=repositories',
        live: '#',
        tags: ['Automation', 'Data Pipeline', 'KPI', 'Python', 'Excel VBA'],
        image: '/projects/KPIAutomation/KapakFoto.png',
        impact: 'Automatische KPI-Berechnung und Dashboard-Aktualisierung aus SAP-Daten; reduziert manuellen Reporting-Aufwand erheblich.',
        gallery: [
          '/projects/KPIAutomation/KapakFoto.png',
          '/projects/KPIAutomation/Desktop 2026-02-01 6-29-01 PM-83.png',
        ],
        details: {
          backend: 'Python-Module (Pipeline, DataCleaner, KPICalculator, DataValidator, PipelineLogger)',
          frontend: 'Excel VBA UserForm, Named Ranges für dynamische Oberfläche',
          dataProcessing: 'Pandas mit IQR-Outlier-Bereinigung, Missing-Value-Handling, Negativ-Wert-Exception-Tracking, NumpyEncoder für JSON-Serialisierung',
          visualization: 'Excel Dashboard, Pivot-Tabellen, Power Query Integration',
          layers: ['SAP Data Import', 'Schema Validation', 'Data Cleaning', 'KPI Calculation (OEE/MTTR/MTBF)', 'Pareto Analysis', 'Excel Output'],
          versionControl: 'Git, GitHub',
          architecture: 'Modulare Python + VBA Hybrid: VBA-Orchestrierung → Python-Datenverarbeitung → Excel-Output; Single Responsibility Principle',
        },
      },
      {
        title: '3D Runner Game',
        description: 'Unity/C# Einzelprojekt; 3D Runner mit schnellem Iterationsfokus auf Level und Physik.',
        summary: 'Prototype / Demo für Asset-Handling und Gameplay-Loop.',
        stack: 'Unity, C#',
        link: 'https://github.com/JegBaha?tab=repositories',
        github: 'https://github.com/JegBaha?tab=repositories',
        live: '#',
        tags: ['Game', 'C#', 'Unity', 'Prototype / Demo'],
        image: '',
        impact: 'Solo-Projekt; Pipeline und Iterationstempo gesteigert.',
        playground: true,
        hobby: true,
        details: {
          backend: 'Unity Engine, C# Scripting',
          layers: ['Spielmechanik', 'Physiksystem', 'Level-Design', 'Asset-Management'],
          versionControl: 'Git',
          architecture: 'Component-Based Architektur',
        },
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
        hobby: true,
        details: {
          backend: 'Unity 2D Engine, C# Scripting',
          layers: ['Gameplay-Loop', 'Gegner-AI', 'Wellensystem', 'Sprite-Management'],
          versionControl: 'Git',
          architecture: '2D Component-Based Architektur',
        },
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
        hobby: true,
        details: {
          backend: 'Unity 3D Engine, C# Scripting',
          layers: ['FPS Mechanik', 'Puzzle System', 'Gegner-AI', 'Level-Design', 'Interaktionssystem'],
          projectManagement: '3-köpfiges Team, Agile Vorgehensweise',
          versionControl: 'Git',
          architecture: '3D FPS Component-Based Architektur',
        },
      },
      {
        title: 'Supply Chain Analytics Dashboard – Data & ML PoC',
        description:
          'Umfassendes Web-Dashboard zur Überwachung der Lieferkettenperformance, entwickelt mit Streamlit. Vereint Lieferantenbewertung, Lieferverzögerungsanalyse, Kostentrends, Risikobewertung und Bestandsmanagement in einem Panel. ML-Modelle prognostizieren Lieferzeiten, externe APIs liefern Wetterdaten und Wechselkurse für erweiterte Risikoanalysen.',
        summary: 'End-to-End Supply-Chain-Analytics: KPI-Tracking, ML-basierte Prognosen, Risikoscoring und Bestandsoptimierung.',
        stack: 'Python, Streamlit, Pandas, NumPy, Plotly, SQLAlchemy, SQLite, scikit-learn, Requests',
        link: 'https://github.com/JegBaha?tab=repositories',
        github: 'https://github.com/JegBaha?tab=repositories',
        live: '#',
        tags: ['Data Analytics', 'Machine Learning', 'Python', 'Dashboard', 'Supply Chain'],
        image: '/projects/SupplyChain/Desktop 2026-01-29 7-49-55 PM-642.png',
        impact: 'PoC, das Lieferantenbewertung, Lieferprognose und Risikomanagement auf einer Plattform vereint; beschleunigt Entscheidungsprozesse.',
        details: {
          backend: 'Python, Streamlit, SQLAlchemy',
          database: 'SQLite (supply_chain.db)',
          frontend: 'Streamlit UI Components',
          mlModels: 'RandomForest, GradientBoosting (Lieferzeitprognose)',
          visualization: 'Plotly (Bar, Pie, Area, Radar, Heatmap)',
          dataProcessing: 'Pandas, NumPy (Filterung, Aggregation, KPI-Berechnung)',
          layers: [
            'Lieferantenanalyse',
            'Lieferprognose (ML)',
            'Kostenoptimierung',
            'Risikobewertung',
            'Bestandsmanagement',
            'Externe Datenintegration (Wetter/Währung/Rohstoffe)',
          ],
          architecture: 'Modulare Python-Architektur: config → models → db_manager → Analytics-Module → UI-Komponenten',
          versionControl: 'Git, GitHub',
        },
        gallery: [
          '/projects/SupplyChain/Desktop 2026-01-29 7-49-55 PM-642.png',
          '/projects/SupplyChain/Desktop 2026-01-29 7-50-01 PM-762.png',
          '/projects/SupplyChain/Desktop 2026-01-29 7-50-09 PM-660.png',
          '/projects/SupplyChain/Desktop 2026-01-29 7-50-14 PM-800.png',
          '/projects/SupplyChain/Desktop 2026-01-29 7-50-19 PM-361.png',
          '/projects/SupplyChain/Desktop 2026-01-29 7-50-21 PM-630.png',
          '/projects/SupplyChain/Desktop 2026-01-29 7-50-32 PM-511.png',
          '/projects/SupplyChain/Desktop 2026-01-29 7-50-38 PM-171.png',
          '/projects/SupplyChain/Desktop 2026-01-29 7-50-42 PM-160.png',
          '/projects/SupplyChain/Desktop 2026-01-29 7-50-52 PM-134.png',
          '/projects/SupplyChain/Desktop 2026-01-29 7-50-58 PM-109.png',
          '/projects/SupplyChain/Desktop 2026-01-29 7-51-03 PM-132.png',
          '/projects/SupplyChain/Desktop 2026-01-29 7-51-21 PM-548.png',
          '/projects/SupplyChain/Desktop 2026-01-29 7-51-29 PM-324.png',
          '/projects/SupplyChain/Desktop 2026-01-29 7-51-36 PM-880.png',
          '/projects/SupplyChain/Desktop 2026-01-29 7-51-38 PM-629.png',
          '/projects/SupplyChain/Desktop 2026-01-29 7-51-41 PM-254.png',
        ],
      },
    ],
    education: [
      {
        school: 'Trakya University',
        degree: 'Bachelor of Engineering, Computer Engineering',
        location: 'Edirne, Tuerkei',
        period: 'Sep 2021 - Jan 2026',
        diploma: '/diploma.jpg',
      },
      {
        school: 'GEN Academy',
        degree: 'AI Software Development & Artificial Intelligence',
        location: 'Remote',
        period: 'Sep 2024 - Jun 2025',
      },
    ],
    certifications: [
      { name: 'AWS for DevOps: Continuous Delivery and Automation', provider: 'AWS' },
      { name: 'Jenkins, Kubernetes, Docker', provider: 'DevOps' },
      { name: 'Microsoft Azure AI Essentials', provider: 'Microsoft' },
      { name: 'Apache Spark Essentials', provider: 'Databricks' },
      { name: 'LLM Foundations & RAG', provider: 'AI' },
      { name: 'Industrie-Automatisierung & IoT (PLC, SCADA, OPC UA, MQTT)', provider: 'Industrie' },
    ],
    languages: [
      { name: 'Tuerkisch', level: 'Muttersprache', percent: 100 },
      { name: 'Englisch', level: 'B2', percent: 70 },
      { name: 'Deutsch', level: 'A2 → B2 in Arbeit', percent: 30 },
    ],
    about: {
      eyebrow: 'Über mich',
      title: 'Ein Ingenieur, der nicht nur Daten analysiert, sondern versteht, wie sie entstehen, fließen und in Aktionen umgewandelt werden.',
      bio: 'In Smart-Factory-, Industrial-IoT- und Produktionsanalytik-Projekten entwickle ich Dateninfrastruktur, Backend-Services und Machine-Learning-Komponenten End-to-End. Mein Ziel: Rohdaten vom Shopfloor in skalierbare, zuverlässige und wertschöpfende Systeme zu verwandeln.',
      strengths: [
        'Problemlösung und Systemdenken',
        'End-to-End Blick auf Datenflüsse',
        'Verständnis industrieller Prozesse',
        'Schnelles Lernen und Anpassung',
        'Klare Kommunikation & Stakeholder-Management',
      ],
      openTo: ['Industrial AI Engineer', 'Data Engineer (Streaming & Manufacturing)', 'Applied AI / Data Engineer'],
      highlight: 'Applied AI / Data Engineer mit Fokus auf industrielle Systeme; ich entwickle Smart Factories, Produktionsdaten und Entscheidungsunterstützungssysteme.',
      motto: '"Daten verstehen heißt das System verstehen."',
      timeline: [
        { year: '2021', text: 'Informatikstudium an der Trakya Universitaet' },
        { year: '2023', text: 'Erstes Praktikum — Enterprise IT & Daten' },
        { year: '2024', text: 'GEN Academy AI Bootcamp Start' },
        { year: '2025', text: 'Professionelle Erfahrung als AI-Trainer' },
        { year: '2026', text: 'Abschluss — Informatikingenieur' },
      ],
    },
    toolbelt: [
      { category: 'BI & Data', tools: ['Power BI / DAX', 'Star Schema', 'KPI', 'Gateway'] },
      { category: 'AI & ML', tools: ['Python / PyTorch', 'CNN', 'Data Pipelines', 'Evaluation'] },
      { category: 'Database', tools: ['SQL', 'Query Optimize', 'Joins', 'CTE'] },
      { category: 'Automation', tools: ['Zapier', 'Airtable', 'Slack'] },
      { category: 'Cloud & DevOps', tools: ['AWS', 'Docker', 'CI/CD'] },
    ],
    cv: { link: '/Baha_Buyukates_CV.pdf', updated: 'Dec 2025', label: 'CV herunterladen' },
    impactStats: {
      experienceValue: '4+',
      experienceLabel: 'Berufserfahrung',
      projectsValue: '10+',
      projectsLabel: 'Projekte abgeschlossen',
      languagesValue: '3',
      languagesLabel: 'Sprachen',
      englishValue: 'B2',
      englishLabel: 'Englischniveau',
    },
    currentlyLearning: {
      title: 'Aktuell am Lernen',
      items: [
        {
          icon: '🏭',
          title: 'Industrie 4.0',
          subtitle: 'SPS, SCADA, OPC UA',
          progress: 65,
        },
        {
          icon: '🤖',
          title: 'Digitalisierung & Automatisierung',
          subtitle: 'IoT, Smart Systems',
          progress: 45,
        },
      ],
    },
    hobbyShowcase: {
      genres: ['Progressive Metal', 'Djent', 'Metalcore'],
      daws: ['FL Studio', 'Ableton Live'],
      instruments: ['E-Gitarre', 'Drum Programming'],
    },
  },
  EN: {
    nav: {
      about: 'About',
      experience: 'Experience',
      projects: 'Projects',
      skills: 'Skills',
      contact: 'Contact',
    },
    brandEyebrow: 'Industrial AI & Data Engineer',
    welcome: '',
    hero: {
      eyebrow: 'Industrial AI Engineer | Welcome',
      titleMain: 'Industrial AI & Data Engineer,',
      titleAccent: ' smart factories, production data, and decision support systems',
      impactLine: '4+ years experience • 10+ projects • EU citizen • Available now',
      lede: 'I take data from the shop floor (MES, sensors, ERP) and build scalable data pipelines, KPIs, and machine learning models to improve production quality and operational decisions.',
      ctas: { browse: 'Browse projects', download: 'Download CV' },
      ctaNotes: { citizen: 'EU Citizen (Bulgaria)', availability: 'Available immediately' },
    },
    heroPanel: {
      status: 'Open to Work',
      location: 'Turkey / Germany',
      focus: 'Expertise',
      focusItems: [
        { label: 'Industrial AI', active: true },
        { label: 'Data Engineering (Manufacturing)', active: true },
        { label: 'Backend & ML Integration', active: false },
      ],
      availability: 'Ready to start',
    },
    projectsNoteCta: 'More on GitHub',
    sections: {
      experience: {
        eyebrow: 'Professional Experience',
        title: 'What I delivered',
        text: 'Hands-on work bridging AI training, data analytics, and enterprise IT.',
      },
      skills: {
        eyebrow: 'What I offer',
        title: 'Skill set',
        text: 'Capabilities that connect data, AI, automation, and enterprise processes, backed by hands-on work.',
      },
      projects: {
        eyebrow: 'Featured projects',
        title: 'Selected projects',
        text: 'Performance and UX together, with clear outcomes.',
      },
      education: {
        eyebrow: 'Education',
        title: 'Foundation and intermediate level',
        text: 'Computer Engineering degree and an AI-focused bootcamp.',
      },
      certifications: {
        eyebrow: 'Certifications & Languages',
        title: 'Continuous learning',
        text: 'Recent credentials in cloud, data, AI, and industrial automation; multilingual communication.',
      },
      hobby: {
        eyebrow: 'Hobby',
        title: 'Music Production',
        text: 'I produce djent and progressive metal tracks. Music reflects my passion for technical details and disciplined work.',
        benefit: '',
        cta: '',
      },
      contact: {
        eyebrow: 'Contact',
        title: 'Ready for a new project.',
        text: 'For data analysis, dashboards, AI training, or automation, feel free to reach out.',
        formTitle: 'Send a Message',
        subjects: ['Project Inquiry', 'Collaboration', 'Other'],
        availability: 'Available',
        sent: 'Sent!',
      },
    },
    feedback: {
      cta: 'Leave feedback',
      reminder: 'You have been here about 30s — want to rate the page?',
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
        skills: ['Python', 'Prompt Engineering', 'LLM', 'Data Annotation'],
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
        skills: ['C#', '.NET', 'SQL', 'Git', 'HIS'],
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
        skills: ['SAP S/4HANA', 'SAP Fiori', 'Network', 'Hardware'],
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
        skills: ['Hardware', 'Network', 'IT Support'],
      },
    ],
    skills: [
      {
        title: 'Data Analysis & BI',
        icon: '📊',
        percent: 85,
        items: [
          { name: 'Power BI', level: 'advanced' },
          { name: 'Excel', level: 'advanced' },
          { name: 'SQL', level: 'advanced' },
          { name: 'DAX', level: 'intermediate' },
          { name: 'Star Schema', level: 'intermediate' },
          { name: 'KPI Reporting', level: 'advanced' },
        ],
        detail: 'I turn data into decision-ready dashboards and measurable KPIs.',
      },
      {
        title: 'Programming',
        icon: '💻',
        percent: 75,
        items: [
          { name: 'Python', level: 'advanced' },
          { name: 'C', level: 'intermediate' },
          { name: 'C#', level: 'intermediate' },
          { name: 'JavaScript', level: 'intermediate' },
          { name: 'SQL', level: 'advanced' },
        ],
        detail: 'Writing clean, maintainable, and testable code across stacks.',
      },
      {
        title: 'AI & Machine Learning',
        icon: '🧠',
        percent: 70,
        items: [
          { name: 'PyTorch', level: 'intermediate' },
          { name: 'TensorFlow', level: 'intermediate' },
          { name: 'Scikit-Learn', level: 'advanced' },
          { name: 'OpenCV', level: 'intermediate' },
          { name: 'CNNs', level: 'intermediate' },
          { name: 'LLM Training', level: 'intermediate' },
        ],
        detail: 'Training, evaluation, and user-facing AI that delivers meaningful outputs.',
      },
      {
        title: 'Industry 4.0 & IoT',
        icon: '🏭',
        percent: 60,
        items: [
          { name: 'PLC', level: 'intermediate' },
          { name: 'SCADA', level: 'intermediate' },
          { name: 'OPC UA', level: 'intermediate' },
          { name: 'MQTT', level: 'intermediate' },
          { name: 'Edge Devices', level: 'beginner' },
          { name: 'Digitalization', level: 'intermediate' },
          { name: 'IoT Protocols', level: 'intermediate' },
        ],
        detail:
          'Move field data securely into cloud and dashboard layers; experienced with PLC, SCADA, OPC UA, MQTT, bus/protocol integrations, and edge devices.',
      },
      {
        title: 'DevOps & Cloud',
        icon: '☁️',
        percent: 55,
        items: [
          { name: 'AWS', level: 'intermediate' },
          { name: 'Docker', level: 'intermediate' },
          { name: 'Kubernetes', level: 'beginner' },
          { name: 'Jenkins', level: 'beginner' },
          { name: 'CI/CD', level: 'intermediate' },
        ],
        detail: 'Container-based deployment, CI/CD pipelines, and cloud infrastructure management.',
      },
      {
        title: 'Enterprise Solutions',
        icon: '🏢',
        percent: 50,
        items: [
          { name: 'SAP S/4HANA', level: 'intermediate' },
          { name: 'SAP Fiori', level: 'beginner' },
        ],
        detail: 'Integrations and developments aligned with enterprise processes.',
      },
    ],
    projects: [
      {
        title: 'End-to-End Smart Manufacturing & AI Proof of Concept (PoC)',
        description:
          'End-to-end Industry 4.0 application combining IoT-based live production monitoring, ERP/MES integration, and AI-powered predictive maintenance in a single platform. Real-time sensor data is collected over MQTT and stored in a PostgreSQL star schema. LSTM-based fault prediction model for IoT time-series and RandomForest-based defect prediction model for production and ERP data. Production KPIs such as OEE, MTBF, MTTR, downtime Pareto, and supplier performance are calculated automatically. RAG-based intelligent assistant covering ISO 10816, OEE standards, and maintenance documentation. The entire system runs as a FastAPI-based self-contained embedded SPA with a single command.',
        summary:
          'Sensor data collection, predictive maintenance, production KPI automation, and RAG-based intelligent assistant unified in a single end-to-end Industry 4.0 PoC platform.',
        stack: 'Python, FastAPI, MQTT, PostgreSQL, PyTorch, Scikit-Learn, ChromaDB, Ollama, Pandas, NumPy, HTML5 Canvas',
        link: 'https://github.com/JegBaha?tab=repositories',
        github: 'https://github.com/JegBaha?tab=repositories',
        live: '#',
        tags: ['IoT', 'ML', 'Industry 4.0', 'RAG', 'FastAPI', 'Ops'],
        image: '/projects/industry-40-iot-predictive-maintenance.webp',
        impact: 'Unifies real-time sensor data, predictive maintenance, automatic KPI calculation, and RAG assistant in a single-command deployable platform.',
        gallery: [
          '/projects/IndustryMaintenance/1.png',
          '/projects/IndustryMaintenance/2.png',
          '/projects/IndustryMaintenance/3.png',
          '/projects/IndustryMaintenance/4.png',
          '/projects/IndustryMaintenance/5.png',
          '/projects/IndustryMaintenance/6.png',
          '/projects/IndustryMaintenance/7.png',
          '/projects/IndustryMaintenance/8.png',
          '/projects/IndustryMaintenance/9.png',
        ],
        details: {
          backend: 'FastAPI, Uvicorn, Pydantic, async architecture',
          frontend: 'Embedded HTML/CSS/Vanilla JS SPA, HTML5 Canvas API (no external JS libraries)',
          database: 'PostgreSQL (Star Schema, Fact & Dimension tables, Materialized Views)',
          mlModels: 'PyTorch LSTM (time-series fault prediction), Scikit-Learn RandomForest (production defect prediction)',
          dataProcessing: 'Pandas, NumPy, KPI automation (OEE, MTBF, MTTR, Pareto), feature engineering, sliding window',
          protocols: 'MQTT (Mosquitto, paho-mqtt), real-time sensor streaming & alarm management',
          visualization: 'HTML5 Canvas based charts, dark theme dashboard',
          deployment: 'Self-contained embedded SPA, single command (python ui.py), cross-platform (Windows/Linux)',
          layers: ['IoT Streaming (MQTT)', 'Data Warehouse (Star Schema)', 'KPI Automation', 'ML Pipeline', 'RAG Assistant', 'Dashboard SPA'],
          versionControl: 'Git, GitHub',
          architecture: 'Modular monolith, multithreading (daemon threads), @dataclass config management, RAG (sentence-transformers, ChromaDB, Ollama/OpenAI/Anthropic LLM integration)',
        },
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
        impact: 'Identified best prediction accuracy through model comparison.',
        details: {
          dataProcessing: 'Missing value imputation, categorical encoding, Min-Max normalization',
          mlModels: 'K-Nearest Neighbors (KNN), Logistic Regression, Decision Tree',
          visualization: 'Confusion Matrix, ROC Curve, Precision-Recall charts',
          layers: ['Data Cleaning', 'Feature Engineering', 'Model Training', 'Model Comparison', 'Evaluation'],
          versionControl: 'Git, GitHub',
          architecture: 'Jupyter Notebook based analysis pipeline',
        },
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
        impact: 'Achieved high-accuracy tumor classification via transfer learning.',
        gallery: [
          '/projects/neuraveil/442462721-7e760073-42c5-49d3-a0e6-2dd4b3ad9971.png',
          '/projects/neuraveil/442462723-0a40c626-411d-4134-86d4-714de8f16946.png',
          '/projects/neuraveil/442462729-2fe82a37-decb-47a6-87a0-1636b3cf7f7a.png',
          '/projects/neuraveil/442462730-52456c0e-ae72-4945-bd60-c3650383407a.png',
          '/projects/neuraveil/442462734-97d8505d-14a6-4d2b-9321-f3f150d1e80f.png',
        ],
        details: {
          backend: 'FastAPI REST API service',
          dataProcessing: 'OpenCV image preprocessing, data augmentation, class balancing',
          mlModels: 'EfficientNet, DenseNet, ResNet (Transfer Learning), Model Ensemble',
          visualization: 'Confusion Matrix, Grad-CAM visualization, Training metrics',
          layers: ['Data Collection', 'Preprocessing', 'Model Training', 'Hyperparameter Optimization (Optuna)', 'API Service'],
          versionControl: 'Git, GitHub',
          architecture: 'Modular CNN pipeline, L2 regularization, Dropout layers',
        },
      },
      {
        title: 'Drumveil Ritual - Time-Series Deep Learning on Audio Data',
        description:
          'Deep learning application based on time-series and spectral analysis of audio signals. Separates music sources using Demucs and extracts drum patterns specifically. Feature extraction and time-series processing on raw audio data; hands-on work with data imbalance and dimension mismatches during model training.',
        summary:
          'Time-series based deep learning application for source separation and drum pattern extraction from audio signals.',
        stack: 'Python, PyTorch, Demucs, Librosa',
        link: 'https://github.com/JegBaha?tab=repositories',
        github: 'https://github.com/JegBaha?tab=repositories',
        live: '#',
        tags: ['Audio', 'AI', 'Python', 'Iterative prototype'],
        image: '/projects/drumveil-ritual-metal-drums.webp',
        impact:
          'Hands-on experience with feature extraction and time-series processing on audio signals; working through real-world challenges like data imbalance and dimension mismatches.',
        gallery: [
          '/projects/drumveil/Desktop 2026-02-07 9-32-34 PM-459.png',
          '/projects/drumveil/Desktop 2026-02-07 9-32-40 PM-935.png',
          '/projects/drumveil/Desktop 2026-02-07 9-32-45 PM-614.png',
          '/projects/drumveil/Desktop 2026-02-07 9-32-53 PM-766.png',
          '/projects/drumveil/Desktop 2026-02-07 9-32-55 PM-552.png',
          '/projects/drumveil/Desktop 2026-02-07 9-32-58 PM-321.png',
          '/projects/drumveil/Desktop 2026-02-07 9-33-01 PM-207.png',
          '/projects/drumveil/Desktop 2026-02-07 9-33-07 PM-275.png',
          '/projects/drumveil/Desktop 2026-02-07 9-33-20 PM-13.png',
        ],
        details: {
          dataProcessing: 'Spectrogram transformation, audio segmentation, Slakh dataset preparation',
          mlModels: 'Demucs (source separation), Onsets and Frames (note extraction)',
          visualization: 'Spectrogram visualization, MIDI output preview',
          layers: ['Audio Loading', 'Source Separation', 'Spectrum Analysis', 'Note Detection', 'MIDI Conversion'],
          hardware: 'GPU requirement (training), CPU inference support',
          versionControl: 'Git, GitHub',
          architecture: 'Two-stage pipeline: Separation → Transcription',
        },
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
        details: {
          backend: 'ASP.NET Core MVC',
          frontend: 'Razor Views, HTML, CSS, JavaScript',
          database: 'MS SQL Server',
          orm: 'Entity Framework Core (Code First)',
          auth: 'Role-based authorization (Admin, User)',
          layers: ['Presentation', 'Business Logic', 'Data Access', 'Database'],
          versionControl: 'Git, GitHub',
          architecture: 'Layered architecture (N-Tier), Repository Pattern',
        },
      },
      {
        title: 'Excel VBA Automation Toolkit (Prototype / Demo)',
        description:
          'Modular Excel VBA automation toolkit: reads SAP CSV via Config, runs Raw → Staging flow, auto-refreshes dashboards/pivots. Centralized logging/error handling, Config-driven EN/TR UserForm UI, and multi-source import (CSV/JSON/Excel).',
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
        details: {
          backend: 'Excel VBA modules',
          frontend: 'UserForm (EN/TR multilingual support)',
          dataProcessing: 'SAP CSV import, JSON parsing, Excel data manipulation',
          layers: ['Config Management', 'Data Reading (Raw)', 'Data Processing (Staging)', 'Dashboard/Pivot Update', 'Logging'],
          versionControl: 'Git',
          architecture: 'Modular VBA structure, centralized error handling, Config-driven design',
        },
      },
      {
        title: 'KPI Automation Toolkit',
        description:
          'Python + VBA hybrid KPI automation pipeline. Reads SAP CSV exports via Config file and calculates OEE (Availability × Performance × Quality), MTTR/MTBF, and Downtime Pareto analyses. Modular system following Single Responsibility Principle: DataIngester, DataCleaner, DataValidator, KPICalculator, and Pipeline orchestrator. Exception tracking for data quality visibility, JSON logging for audit trail.',
        summary:
          'KPI calculation from SAP data, data cleaning, and Excel dashboard updates; Python backend + VBA orchestration for production-grade data pipeline.',
        stack: 'Python, Pandas, NumPy, Excel VBA, JSON, openpyxl',
        link: 'https://github.com/JegBaha?tab=repositories',
        github: 'https://github.com/JegBaha?tab=repositories',
        live: '#',
        tags: ['Automation', 'Data Pipeline', 'KPI', 'Python', 'Excel VBA'],
        image: '/projects/KPIAutomation/KapakFoto.png',
        impact: 'Automatic KPI calculation and dashboard updates from SAP data; significantly reduces manual reporting effort.',
        gallery: [
          '/projects/KPIAutomation/KapakFoto.png',
          '/projects/KPIAutomation/Desktop 2026-02-01 6-29-01 PM-83.png',
        ],
        details: {
          backend: 'Python modules (Pipeline, DataCleaner, KPICalculator, DataValidator, PipelineLogger)',
          frontend: 'Excel VBA UserForm, Named Ranges for dynamic interface',
          dataProcessing: 'Pandas with IQR outlier cleaning, missing value handling, negative value exception tracking, NumpyEncoder for JSON serialization',
          visualization: 'Excel Dashboard, Pivot tables, Power Query integration',
          layers: ['SAP Data Import', 'Schema Validation', 'Data Cleaning', 'KPI Calculation (OEE/MTTR/MTBF)', 'Pareto Analysis', 'Excel Output'],
          versionControl: 'Git, GitHub',
          architecture: 'Modular Python + VBA hybrid: VBA orchestration → Python data processing → Excel output; Single Responsibility Principle',
        },
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
        hobby: true,
        details: {
          backend: 'Unity Engine, C# scripting',
          layers: ['Game Mechanics', 'Physics System', 'Level Design', 'Asset Management'],
          versionControl: 'Git',
          architecture: 'Component-Based architecture',
        },
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
        hobby: true,
        details: {
          backend: 'Unity 2D Engine, C# scripting',
          layers: ['Game Loop', 'Enemy AI', 'Wave System', 'Sprite Management'],
          versionControl: 'Git',
          architecture: '2D Component-Based architecture',
        },
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
        hobby: true,
        details: {
          backend: 'Unity 3D Engine, C# scripting',
          layers: ['FPS Mechanics', 'Puzzle System', 'Enemy AI', 'Level Design', 'Interaction System'],
          projectManagement: '3-person team, Agile approach',
          versionControl: 'Git',
          architecture: '3D FPS Component-Based architecture',
        },
      },
      {
        title: 'Supply Chain Analytics Dashboard – Data & ML PoC',
        description:
          'Comprehensive web dashboard for monitoring supply chain performance, built with Streamlit. Combines supplier scoring, delivery delay analysis, cost trends, risk assessment, and inventory management in a single panel. ML models predict delivery times while external APIs fetch weather data and exchange rates for enhanced risk evaluation.',
        summary: 'End-to-end supply chain analytics: KPI tracking, ML-based forecasting, risk scoring, and inventory optimization.',
        stack: 'Python, Streamlit, Pandas, NumPy, Plotly, SQLAlchemy, SQLite, scikit-learn, Requests',
        link: 'https://github.com/JegBaha?tab=repositories',
        github: 'https://github.com/JegBaha?tab=repositories',
        live: '#',
        tags: ['Data Analytics', 'Machine Learning', 'Python', 'Dashboard', 'Supply Chain'],
        image: '/projects/SupplyChain/Desktop 2026-01-29 7-49-55 PM-642.png',
        impact: 'PoC unifying supplier scoring, delivery forecasting, and risk management on one platform; accelerates decision-making processes.',
        details: {
          backend: 'Python, Streamlit, SQLAlchemy',
          database: 'SQLite (supply_chain.db)',
          frontend: 'Streamlit UI Components',
          mlModels: 'RandomForest, GradientBoosting (delivery time prediction)',
          visualization: 'Plotly (bar, pie, area, radar, heatmap)',
          dataProcessing: 'Pandas, NumPy (filtering, aggregation, KPI calculation)',
          layers: [
            'Supplier Analytics',
            'Delivery Prediction (ML)',
            'Cost Optimization',
            'Risk Assessment',
            'Inventory Management',
            'External Data Integration (Weather/Currency/Commodities)',
          ],
          architecture: 'Modular Python architecture: config → models → db_manager → analytics modules → UI components',
          versionControl: 'Git, GitHub',
        },
        gallery: [
          '/projects/SupplyChain/Desktop 2026-01-29 7-49-55 PM-642.png',
          '/projects/SupplyChain/Desktop 2026-01-29 7-50-01 PM-762.png',
          '/projects/SupplyChain/Desktop 2026-01-29 7-50-09 PM-660.png',
          '/projects/SupplyChain/Desktop 2026-01-29 7-50-14 PM-800.png',
          '/projects/SupplyChain/Desktop 2026-01-29 7-50-19 PM-361.png',
          '/projects/SupplyChain/Desktop 2026-01-29 7-50-21 PM-630.png',
          '/projects/SupplyChain/Desktop 2026-01-29 7-50-32 PM-511.png',
          '/projects/SupplyChain/Desktop 2026-01-29 7-50-38 PM-171.png',
          '/projects/SupplyChain/Desktop 2026-01-29 7-50-42 PM-160.png',
          '/projects/SupplyChain/Desktop 2026-01-29 7-50-52 PM-134.png',
          '/projects/SupplyChain/Desktop 2026-01-29 7-50-58 PM-109.png',
          '/projects/SupplyChain/Desktop 2026-01-29 7-51-03 PM-132.png',
          '/projects/SupplyChain/Desktop 2026-01-29 7-51-21 PM-548.png',
          '/projects/SupplyChain/Desktop 2026-01-29 7-51-29 PM-324.png',
          '/projects/SupplyChain/Desktop 2026-01-29 7-51-36 PM-880.png',
          '/projects/SupplyChain/Desktop 2026-01-29 7-51-38 PM-629.png',
          '/projects/SupplyChain/Desktop 2026-01-29 7-51-41 PM-254.png',
        ],
      },
    ],
    education: [
      {
        school: 'Trakya University',
        degree: 'Bachelor of Engineering, Computer Engineering',
        location: 'Edirne, Turkiye',
        period: 'Sep 2021 - Jan 2026',
        diploma: '/diploma.jpg',
      },
      {
        school: 'GEN Academy',
        degree: 'AI Software Development & Artificial Intelligence',
        location: 'Remote',
        period: 'Sep 2024 - Jun 2025',
      },
    ],
    certifications: [
      { name: 'AWS for DevOps: Continuous Delivery and Automation', provider: 'AWS' },
      { name: 'Jenkins, Kubernetes, Docker', provider: 'DevOps' },
      { name: 'Microsoft Azure AI Essentials', provider: 'Microsoft' },
      { name: 'Apache Spark Essentials', provider: 'Databricks' },
      { name: 'LLM Foundations & RAG', provider: 'AI' },
      { name: 'Industrial Automation & IoT (PLC, SCADA, OPC UA, MQTT)', provider: 'Industry' },
    ],
    languages: [
      { name: 'Turkish', level: 'Native', percent: 100 },
      { name: 'English', level: 'B2', percent: 70 },
      { name: 'German', level: 'A2 → B2 in progress', percent: 30 },
    ],
    about: {
      eyebrow: 'About',
      title: 'An engineer who cares not just about analyzing data, but how it is produced, flows, and transforms into action.',
      bio: 'In smart factory, industrial IoT, and production analytics projects, I build data infrastructure, backend services, and machine learning components end-to-end. My goal is to transform raw shop-floor data into scalable, reliable, and business-value-generating systems.',
      strengths: [
        'Problem solving and systems thinking',
        'End-to-end view of data flow',
        'Understanding of industrial processes',
        'Fast learning and adaptation',
        'Clear communication with stakeholders',
      ],
      openTo: ['Industrial AI Engineer', 'Data Engineer (Streaming & Manufacturing)', 'Applied AI / Data Engineer'],
      highlight: 'Applied AI / Data Engineer focused on industrial systems; building smart factories, production data, and decision support systems.',
      motto: '"Understanding data means understanding the system."',
      timeline: [
        { year: '2021', text: 'Started Computer Engineering at Trakya University' },
        { year: '2023', text: 'First internship — enterprise IT & data' },
        { year: '2024', text: 'GEN Academy AI Bootcamp start' },
        { year: '2025', text: 'Professional experience as AI trainer' },
        { year: '2026', text: 'Graduation — Computer Engineering' },
      ],
    },
    toolbelt: [
      { category: 'BI & Data', tools: ['Power BI / DAX', 'Star Schema', 'KPI', 'Gateway'] },
      { category: 'AI & ML', tools: ['Python / PyTorch', 'CNN', 'Data Pipelines', 'Evaluation'] },
      { category: 'Database', tools: ['SQL', 'Query Optimize', 'Joins', 'CTE'] },
      { category: 'Automation', tools: ['Zapier', 'Airtable', 'Slack'] },
      { category: 'Cloud & DevOps', tools: ['AWS', 'Docker', 'CI/CD'] },
    ],
    cv: { link: '/Baha_Buyukates_CV.pdf', updated: 'Dec 2025', label: 'Download CV (updated Dec 2025)' },
    impactStats: {
      experienceValue: '4+',
      experienceLabel: 'Work Experience',
      projectsValue: '10+',
      projectsLabel: 'Projects Completed',
      languagesValue: '3',
      languagesLabel: 'Languages Spoken',
      englishValue: 'B2',
      englishLabel: 'English Level',
    },
    currentlyLearning: {
      title: 'Currently Learning',
      items: [
        {
          icon: '🏭',
          title: 'Industry 4.0',
          subtitle: 'PLC, SCADA, OPC UA',
          progress: 65,
        },
        {
          icon: '🤖',
          title: 'Digitalization & Automation',
          subtitle: 'IoT, Smart Systems',
          progress: 45,
        },
      ],
    },
    hobbyShowcase: {
      genres: ['Progressive Metal', 'Djent', 'Metalcore'],
      daws: ['FL Studio', 'Ableton Live'],
      instruments: ['Electric Guitar', 'Drum Programming'],
    },
  },
}


function CountUp({ target, suffix = '' }: { target: number; suffix?: string }) {
  const [count, setCount] = useState(0)
  const ref = useRef<HTMLSpanElement>(null)
  useEffect(() => {
    const el = ref.current
    if (!el) return
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          let start = 0
          const duration = 1200
          const step = Math.max(1, Math.floor(duration / target))
          const interval = setInterval(() => {
            start++
            setCount(start)
            if (start >= target) clearInterval(interval)
          }, step)
          obs.disconnect()
        }
      },
      { threshold: 0.3 },
    )
    obs.observe(el)
    return () => obs.disconnect()
  }, [target])
  return <span ref={ref}>{count}{suffix}</span>
}

function App() {
  const [activeLocale, setActiveLocale] = useState<Locale>('TR')
  const [isLoading, setIsLoading] = useState(true)
  const [showWelcome, setShowWelcome] = useState(true)
  const [isDrawerOpen, setIsDrawerOpen] = useState(false)
  const [activeSection, setActiveSection] = useState<string>('hero')
  const [activeProjectDetail, setActiveProjectDetail] = useState<Project | null>(null)
  const [galleryIndex, setGalleryIndex] = useState(0)
  const [galleryLightbox, setGalleryLightbox] = useState(false)
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
  const [contactSent, setContactSent] = useState(false)
  const [diplomaLightbox, setDiplomaLightbox] = useState(false)
  const [typewriterText, setTypewriterText] = useState('')
  const [typewriterDone, setTypewriterDone] = useState(false)
  const [showScrollTop, setShowScrollTop] = useState(false)
  const [floatingContactOpen, setFloatingContactOpen] = useState(false)
  const [trackPlaying, setTrackPlaying] = useState(false)
  const trackRef = useRef<HTMLAudioElement | null>(null)
  const [isMobile, setIsMobile] = useState(false)
  const [reduceMotion, setReduceMotion] = useState(false)
  const [isLowPerformance, setIsLowPerformance] = useState(false)
  const [cvPopupOpen, setCvPopupOpen] = useState(false)

  // CV links for each language
  const cvLinks = {
    TR: '/Baha_Buyukates_TR.pdf',
    DE: '/Baha_Buyukates_DE.pdf',
    EN: '/Baha_Buyukates_ENG.pdf',
  }

  const c = content[activeLocale]
  const hobbyNavLabel = activeLocale === 'TR' ? 'Hobim' : 'Hobby'

  // Dynamic greeting based on time of day
  const greeting = useMemo(() => {
    const hour = new Date().getHours()
    if (activeLocale === 'DE') {
      if (hour < 12) return 'Guten Morgen'
      if (hour < 18) return 'Guten Tag'
      return 'Guten Abend'
    }
    if (activeLocale === 'EN') {
      if (hour < 12) return 'Good morning'
      if (hour < 18) return 'Good afternoon'
      return 'Good evening'
    }
    if (hour < 12) return 'Günaydın'
    if (hour < 18) return 'İyi günler'
    return 'İyi akşamlar'
  }, [activeLocale])

  // Loading screen effect
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false)
    }, 1500)
    return () => clearTimeout(timer)
  }, [])

  // Typewriter effect for lede text
  useEffect(() => {
    setTypewriterText('')
    setTypewriterDone(false)
    const text = c.hero.lede
    let i = 0
    const interval = setInterval(() => {
      i++
      setTypewriterText(text.slice(0, i))
      if (i >= text.length) {
        clearInterval(interval)
        setTypewriterDone(true)
      }
    }, 8)
    return () => clearInterval(interval)
  }, [c.hero.lede])

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
          'Backend + otomasyon geliştirici ariyorsaniz ulasin.',
        ]
      : activeLocale === 'DE'
      ? [
          'Wenn Sie einen Junior Data / BI Engineer suchen, sprechen wir.',
          'Industry 4.0 + Data Integration? Ich kann helfen.',
          'Backend + Automatisierung Entwickler gesucht? Melde dich.',
        ]
      : [
          'If you need a Junior Data / BI Engineer, let’s talk.',
          'If you need Industry 4.0 + Data integration, I can help.',
          'If you want a backend + automation engineer, reach out.',
        ]

  const getJobDuration = (period: string): string => {
    const now = activeLocale === 'DE' ? 'Heute' : activeLocale === 'EN' ? 'Present' : 'Güncel'
    const months: Record<string, number> = {
      Jan: 0, Feb: 1, Mar: 2, Apr: 3, May: 4, Jun: 5, Jul: 6, Aug: 7, Sep: 8, Oct: 9, Nov: 10, Dec: 11,
      Oca: 0, Şub: 1, Mar: 2, Nis: 3, May: 4, Haz: 5, Tem: 6, Ağu: 7, Eyl: 8, Eki: 9, Kas: 10, Ara: 11,
      Okt: 9,
    }
    const parts = period.split(' - ')
    if (parts.length < 2) return activeLocale === 'DE' ? '1 Monat' : activeLocale === 'EN' ? '1 mo' : '1 ay'
    const parseDate = (s: string) => {
      const tokens = s.trim().split(' ')
      const m = months[tokens[0]] ?? 0
      const y = parseInt(tokens[1]) || new Date().getFullYear()
      return new Date(y, m)
    }
    const start = parseDate(parts[0])
    const end = parts[1].trim() === now ? new Date() : parseDate(parts[1])
    const diff = Math.max(1, Math.round((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24 * 30)))
    if (diff >= 12) {
      const yrs = Math.floor(diff / 12)
      const mos = diff % 12
      if (activeLocale === 'DE') return mos > 0 ? `${yrs} J ${mos} M` : `${yrs} Jahr${yrs > 1 ? 'e' : ''}`
      if (activeLocale === 'EN') return mos > 0 ? `${yrs}y ${mos}mo` : `${yrs}y`
      return mos > 0 ? `${yrs} yıl ${mos} ay` : `${yrs} yıl`
    }
    if (activeLocale === 'DE') return `${diff} Monat${diff > 1 ? 'e' : ''}`
    if (activeLocale === 'EN') return `${diff} mo`
    return `${diff} ay`
  }

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
    () => ['hero', 'about', 'education', 'experience', 'skills', 'projects', 'certifications', 'hobby', 'contact'],
    [],
  )
  const sectionLabels =
    activeLocale === 'DE'
      ? {
          hero: 'Willkommen',
          about: 'Über mich',
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
          hero: 'Hoş geldin',
          about: 'Hakkımda',
          experience: 'Deneyim',
          skills: 'Yetenekler',
          projects: 'Projeler',
          education: 'Eğitim',
          certifications: 'Sertifikalar',
          hobby: 'Hobim',
          contact: 'İletişim',
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
      ? { open: 'Details', close: 'Schließen' }
      : activeLocale === 'EN'
      ? { open: 'Details', close: 'Close' }
      : { open: 'Detay', close: 'Kapat' }

  const getProjectPreview = (project: Project): string => {
    const base = project.impact || project.summary || project.description
    return base.length > 180 ? `${base.slice(0, 177)}...` : base
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

  const openProjectDetail = (project: Project) => {
    setActiveProjectDetail(project)
    const projectsSection = document.getElementById('projects')
    if (projectsSection) {
      projectsSection.scrollIntoView({ behavior: 'smooth', block: 'center' })
    }
  }

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
      : `${feedbackEntries.length} kayıt`
  const recentFeedback = feedbackEntries.slice(0, 3)
  const ratingRequiredCopy =
    activeLocale === 'DE'
      ? 'Bitte Sterne wählen.'
      : activeLocale === 'EN'
      ? 'Please pick a star rating.'
      : 'Lütfen bir yıldız seçin.'
  const laterLabel = activeLocale === 'DE' ? 'Später' : activeLocale === 'EN' ? 'Later' : 'Sonra'

  useEffect(() => {
  const title = `Baha Büyükateş | ${c.hero.eyebrow}`
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

  // Section navigation order
  const navSections = ['hero', 'about', 'education', 'experience', 'skills', 'projects', 'certifications', 'hobby', 'contact']

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Don't trigger when typing in inputs
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return

      const currentIndex = navSections.indexOf(activeSection)

      // Arrow keys or J/K for navigation
      if (e.key === 'ArrowDown' || e.key === 'j' || e.key === 'J') {
        e.preventDefault()
        const nextIndex = Math.min(currentIndex + 1, navSections.length - 1)
        scrollToSection(navSections[nextIndex])
      } else if (e.key === 'ArrowUp' || e.key === 'k' || e.key === 'K') {
        e.preventDefault()
        const prevIndex = Math.max(currentIndex - 1, 0)
        scrollToSection(navSections[prevIndex])
      } else if (e.key === 'Home') {
        e.preventDefault()
        scrollToSection('hero')
      } else if (e.key === 'End') {
        e.preventDefault()
        scrollToSection('contact')
      } else if (e.key >= '1' && e.key <= '9') {
        const index = parseInt(e.key) - 1
        if (index < navSections.length) {
          e.preventDefault()
          scrollToSection(navSections[index])
        }
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [activeSection])

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
    const subjectVal = formData.get('subject')?.toString() ?? 'Project inquiry'
    const subject = encodeURIComponent(subjectVal)
    const body = encodeURIComponent(`Name: ${name}\nEmail: ${email}\n\n${message}`)
    window.location.href = `mailto:bahabuyukates@gmail.com?subject=${subject}&body=${body}`
    setContactSent(true)
    setTimeout(() => setContactSent(false), 3000)
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

  // Feedback reminder popup disabled for professional appearance
  // useEffect(() => {
  //   ... feedback reminder logic removed
  // }, [feedbackEntries.length, isMobile])

  useEffect(() => {
    // Ensure page starts at top on load
    window.scrollTo(0, 0)
    // Cinematic blur entrance: hide after animation completes
    const hideTimer = setTimeout(() => setShowWelcome(false), 2200)
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
      clearTimeout(hideTimer)
      window.removeEventListener('mousemove', handleMove)
      window.removeEventListener('click', handleClick)
    }
  }, [])

  useEffect(() => {
    document.body.classList.toggle('drawer-open', isDrawerOpen)
    return () => {
      document.body.classList.remove('drawer-open')
    }
  }, [isDrawerOpen])

  useEffect(() => {
    document.body.style.overflow = ''
    return undefined
  }, [activeProjectDetail])

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

  // Performance detection for low-end devices
  useEffect(() => {
    const detectLowPerformance = () => {
      // Check hardware concurrency (CPU cores)
      const cores = navigator.hardwareConcurrency || 4
      const isLowCores = cores <= 4

      // Check device memory (if available)
      const memory = (navigator as any).deviceMemory || 8
      const isLowMemory = memory <= 4

      // Check for mobile/tablet user agents that typically have lower performance
      const isMobileDevice = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)

      // Check screen refresh rate capability via a simple FPS test
      let lowFPS = false
      let frameCount = 0
      let startTime = performance.now()
      const testFrames = () => {
        frameCount++
        if (frameCount < 30) {
          requestAnimationFrame(testFrames)
        } else {
          const elapsed = performance.now() - startTime
          const fps = (frameCount / elapsed) * 1000
          lowFPS = fps < 50 // If can't maintain 50fps, consider low performance

          const isLow = (isLowCores && isLowMemory) || (isMobileDevice && isLowCores) || lowFPS
          setIsLowPerformance(isLow)
          document.body.classList.toggle('low-performance', isLow)
        }
      }
      requestAnimationFrame(testFrames)
    }

    detectLowPerformance()
    return () => {
      document.body.classList.remove('low-performance')
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
    if (reduceMotion || isLowPerformance) return
    // Increased interval from 9-14s to 15-25s for better performance
    const interval = window.setInterval(() => {
      const id = Date.now()
      const duration = 1100 + Math.random() * 600
      const left = `${15 + Math.random() * 70}%`
      setFallingStars((prev) => [...prev.slice(-2), { id, left, duration }]) // Max 2 stars instead of 3
      window.setTimeout(() => {
        setFallingStars((prev) => prev.filter((item) => item.id !== id))
      }, duration + 200)
    }, 15000 + Math.random() * 10000)

    return () => window.clearInterval(interval)
  }, [reduceMotion, isLowPerformance])

  useEffect(() => {
    const targets = Array.from(
      document.querySelectorAll<HTMLElement>(
        '.section, .card, .project-card, .hero, .hero-panel, .hero-text, .about-grid, .contact-form, .feedback-trigger, .audio-btn-stack, .player-meta, .player-progress, .player-actions',
      ),
    )

    if (reduceMotion || !('IntersectionObserver' in window) || isMobile) {
      targets.forEach((node) => node.classList.add('visible'))
      return undefined
    }

    targets.forEach((node, index) => {
      node.classList.add('reveal-item')
      node.style.setProperty('--reveal-delay', `${Math.min(index, 6) * 40}ms`)
    })

    const observer = new IntersectionObserver(
      (entries, obs) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const target = entry.target as HTMLElement
            target.classList.add('visible')
            obs.unobserve(target)
          }
        })
      },
      { threshold: 0.1 },
    )

    targets.forEach((node) => observer.observe(node))

    return () => observer.disconnect()
  }, [reduceMotion, activeLocale])

  // ============================================
  // NEW DESKTOP-ONLY EFFECTS
  // ============================================

  // Mouse Trail Particles Effect (Desktop Only)
  useEffect(() => {
    if (isMobile || reduceMotion) return

    let particleId = 0
    const maxParticles = 15 // Limit particles for performance

    const handleMouseMove = (e: MouseEvent) => {
      // Throttle particle creation (create only 30% of the time)
      if (Math.random() > 0.3) return

      const particle = document.createElement('div')
      particle.className = 'mouse-particle'
      particle.style.left = `${e.clientX}px`
      particle.style.top = `${e.clientY}px`

      // Add slight random offset for organic feel
      const offsetX = (Math.random() - 0.5) * 10
      const offsetY = (Math.random() - 0.5) * 10
      particle.style.transform = `translate(${offsetX}px, ${offsetY}px)`

      document.body.appendChild(particle)
      particleId++

      // Remove particle after animation completes
      setTimeout(() => {
        particle.remove()
      }, 800)

      // Cleanup old particles if too many exist
      const particles = document.querySelectorAll('.mouse-particle')
      if (particles.length > maxParticles) {
        particles[0].remove()
      }
    }

    window.addEventListener('mousemove', handleMouseMove)
    return () => window.removeEventListener('mousemove', handleMouseMove)
  }, [isMobile, reduceMotion])

  // 3D Tilt Effect on Cards (Desktop Only) - OPTIMIZED with throttle
  useEffect(() => {
    if (isMobile || reduceMotion || isLowPerformance) return

    const cards = document.querySelectorAll<HTMLElement>('.card')

    // Throttle function for performance
    const throttle = (fn: Function, delay: number) => {
      let lastCall = 0
      let rafId: number | null = null
      return (...args: any[]) => {
        const now = performance.now()
        if (now - lastCall >= delay) {
          lastCall = now
          if (rafId) cancelAnimationFrame(rafId)
          rafId = requestAnimationFrame(() => fn(...args))
        }
      }
    }

    const handleMouseMove = (e: MouseEvent, card: HTMLElement) => {
      const rect = card.getBoundingClientRect()
      const x = e.clientX - rect.left
      const y = e.clientY - rect.top

      const centerX = rect.width / 2
      const centerY = rect.height / 2

      // Calculate rotation based on mouse position - reduced intensity
      const rotateY = ((x - centerX) / centerX) * 6 // Reduced from 10 to 6
      const rotateX = ((centerY - y) / centerY) * 6

      card.style.setProperty('--tilt-x', `${rotateX}deg`)
      card.style.setProperty('--tilt-y', `${rotateY}deg`)
      card.classList.add('tilt-active')
    }

    const handleMouseLeave = (card: HTMLElement) => {
      card.style.setProperty('--tilt-x', '0deg')
      card.style.setProperty('--tilt-y', '0deg')
      card.classList.remove('tilt-active')
    }

    cards.forEach((card) => {
      // Throttle mousemove to ~30fps (33ms)
      const throttledMoveHandler = throttle((e: MouseEvent) => handleMouseMove(e, card), 33)
      const leaveHandler = () => handleMouseLeave(card)

      card.addEventListener('mousemove', throttledMoveHandler as EventListener)
      card.addEventListener('mouseleave', leaveHandler)

      // Store handlers for cleanup
      ;(card as any)._tiltHandlers = { moveHandler: throttledMoveHandler, leaveHandler }
    })

    return () => {
      cards.forEach((card) => {
        const handlers = (card as any)._tiltHandlers
        if (handlers) {
          card.removeEventListener('mousemove', handlers.moveHandler as EventListener)
          card.removeEventListener('mouseleave', handlers.leaveHandler)
        }
      })
    }
  }, [isMobile, reduceMotion, isLowPerformance, activeLocale])

  // Magnetic Button Effect (Desktop Only) - OPTIMIZED with throttle
  useEffect(() => {
    if (isMobile || reduceMotion || isLowPerformance) return

    const magneticElements = document.querySelectorAll<HTMLElement>(
      '.btn, .cta-btn, .toggle-audio, .lang-btn'
    ) // Removed .project-tag for performance

    // Throttle function
    const throttle = (fn: Function, delay: number) => {
      let lastCall = 0
      return (...args: any[]) => {
        const now = performance.now()
        if (now - lastCall >= delay) {
          lastCall = now
          fn(...args)
        }
      }
    }

    const handleMouseMove = (e: MouseEvent, element: HTMLElement) => {
      const rect = element.getBoundingClientRect()
      const x = e.clientX - rect.left - rect.width / 2
      const y = e.clientY - rect.top - rect.height / 2

      // Magnetic distance (pixels from center)
      const distanceSquared = x * x + y * y
      const maxDistanceSquared = 60 * 60 // Reduced from 80 to 60

      if (distanceSquared < maxDistanceSquared) {
        // Apply magnetic pull (20% of distance - reduced from 30%)
        const pullX = x * 0.2
        const pullY = y * 0.2
        element.style.setProperty('--magnetic-x', `${pullX}px`)
        element.style.setProperty('--magnetic-y', `${pullY}px`)
        element.classList.add('magnetic')
      } else {
        element.style.setProperty('--magnetic-x', '0px')
        element.style.setProperty('--magnetic-y', '0px')
        element.classList.remove('magnetic')
      }
    }

    const handleMouseLeave = (element: HTMLElement) => {
      element.style.setProperty('--magnetic-x', '0px')
      element.style.setProperty('--magnetic-y', '0px')
      element.classList.remove('magnetic')
    }

    magneticElements.forEach((element) => {
      // Throttle mousemove to ~20fps (50ms) for subtle effect
      const throttledMoveHandler = throttle((e: MouseEvent) => handleMouseMove(e, element), 50)
      const leaveHandler = () => handleMouseLeave(element)

      element.addEventListener('mousemove', throttledMoveHandler as EventListener)
      element.addEventListener('mouseleave', leaveHandler)

      // Store handlers for cleanup
      ;(element as any)._magneticHandlers = { moveHandler: throttledMoveHandler, leaveHandler }
    })

    return () => {
      magneticElements.forEach((element) => {
        const handlers = (element as any)._magneticHandlers
        if (handlers) {
          element.removeEventListener('mousemove', handlers.moveHandler as EventListener)
          element.removeEventListener('mouseleave', handlers.leaveHandler)
        }
      })
    }
  }, [isMobile, reduceMotion, isLowPerformance, activeLocale])

  // Enhanced Header Scroll Effect - OPTIMIZED with RAF
  useEffect(() => {
    // Cache DOM query
    const header = document.querySelector('header') as HTMLElement
    if (!header) return

    let ticking = false
    let lastScrolled = false

    const updateHeader = () => {
      const scrollY = window.scrollY
      const shouldBeScrolled = scrollY > 50

      // Only update DOM if state changed
      if (shouldBeScrolled !== lastScrolled) {
        lastScrolled = shouldBeScrolled
        header.classList.toggle('scrolled', shouldBeScrolled)
      }
      ticking = false
    }

    const handleHeaderScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(updateHeader)
        ticking = true
      }
    }

    window.addEventListener('scroll', handleHeaderScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleHeaderScroll)
  }, [])

  const scrollToTop = () => {
    
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    window.scrollTo({ top: 0, behavior: prefersReducedMotion ? 'auto' : 'smooth' })
  }

  return (
    <div className="page">
      {/* Loading Screen */}
      <div className={`loading-screen ${!isLoading ? 'fade-out' : ''}`}>
        <div className="loading-content">
          <img src="/logo.jpg" alt="Logo" className="loading-logo" />
          <div className="loading-bar">
            <div className="loading-bar-fill" />
          </div>
        </div>
      </div>

      {/* Minimal Scroll Progress Bar */}
      <div className="scroll-progress-bar" aria-hidden="true">
        <div className="scroll-progress-fill" style={{ width: `calc(var(--scroll-progress, 0) * 100%)` }} />
      </div>
      <div className="grid-overlay" aria-hidden="true" />

      {/* Optimized Nebula Clouds - CSS only, no JS */}
      <div className="nebula-clouds" aria-hidden="true">
        <div className="nebula-layer nebula-1" />
        <div className="nebula-layer nebula-2" />
      </div>

      {/* Minimal Stars - CSS only */}
      <div className="stars-container" aria-hidden="true">
        <div className="stars-layer stars-small" />
        <div className="stars-layer stars-medium" />
      </div>

      {showWelcome && (
        <div className="biome-entrance" aria-live="polite" />
      )}
      {moonVisible && (
        <div className={`moon-overlay ${moonPhase}`}>
          <div className="moon-glow" aria-hidden="true">
            <span className="moon-core" />
            <span className="moon-halo" />
            <span className="moon-ring" />
            <span className="moon-sparkle" />
          </div>
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
          onClick={() => { toggleDrawer() }}
        >
          <span />
          <span />
          <span />
        </button>
        <div className="brand">
          <span className="brand-mark">//</span>
          <div>
            <p className="eyebrow">{c.brandEyebrow}</p>
            <p className="brand-name">Baha Büyükateş</p>
          </div>
        </div>
        <div className="lang-switch" role="group" aria-label="Dil seçimi">
          {localeOptions.map((option) => (
            <button
              key={option.code}
              type="button"
              className={`lang-btn ${activeLocale === option.code ? 'active' : ''}`}
              onClick={() => { setActiveLocale(option.code) }}
              aria-pressed={activeLocale === option.code}
            >
              <span className="flag" aria-hidden="true">
                {option.flag}
              </span>
              <span className="code">{option.code}</span>
            </button>
          ))}
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
            <p className="brand-name">Baha Büyükateş</p>
          </div>
          <button className="close-drawer" type="button" aria-label="Menüyü kapat" onClick={() => { setIsDrawerOpen(false) }}>
            X
          </button>
        </div>
        <nav className="drawer-links">
          <button
            type="button"
            className={activeSection === 'about' ? 'active' : ''}
            aria-current={activeSection === 'about' ? 'page' : undefined}
            onClick={(e) => handleNavClick('about', e)}
           
          >
            {c.nav.about}
          </button>
          <button
            type="button"
            className={activeSection === 'experience' ? 'active' : ''}
            aria-current={activeSection === 'experience' ? 'page' : undefined}
            onClick={(e) => handleNavClick('experience', e)}
           
          >
            {c.nav.experience}
          </button>
          <button
            type="button"
            className={activeSection === 'projects' ? 'active' : ''}
            aria-current={activeSection === 'projects' ? 'page' : undefined}
            onClick={(e) => handleNavClick('projects', e)}
           
          >
            {c.nav.projects}
          </button>
          <button
            type="button"
            className={activeSection === 'skills' ? 'active' : ''}
            aria-current={activeSection === 'skills' ? 'page' : undefined}
            onClick={(e) => handleNavClick('skills', e)}
           
          >
            {c.nav.skills}
          </button>
          <button
            type="button"
            className={activeSection === 'hobby' ? 'active' : ''}
            aria-current={activeSection === 'hobby' ? 'page' : undefined}
            onClick={(e) => handleNavClick('hobby', e)}
           
          >
            {hobbyNavLabel}
          </button>
          <button
            type="button"
            className={activeSection === 'contact' ? 'active' : ''}
            aria-current={activeSection === 'contact' ? 'page' : undefined}
            onClick={(e) => handleNavClick('contact', e)}
           
          >
            {c.nav.contact}
          </button>
        </nav>
        <div className="drawer-meta">
          <span className="pill small">{c.hero.eyebrow}</span>
          <p className="section-text">{c.hero.lede}</p>
        </div>
        <div className="drawer-lang-switch" role="group" aria-label="Dil seçimi">
          {localeOptions.map((option) => (
            <button
              key={option.code}
              type="button"
              className={`drawer-lang-btn ${activeLocale === option.code ? 'active' : ''}`}
              onClick={() => { setActiveLocale(option.code) }}
              aria-pressed={activeLocale === option.code}
            >
              <span className="flag" aria-hidden="true">{option.flag}</span>
              <span className="label">{option.label}</span>
            </button>
          ))}
        </div>
      </aside>
      {isDrawerOpen && <div className="drawer-overlay" onClick={() => setIsDrawerOpen(false)} aria-hidden="true" />}

      <main>
        <section className="hero" id="hero">
          <div className="hero-text">
            <p className="eyebrow">Data Engineer | {greeting}</p>
            <h1>
              {c.hero.titleMain}
              <span className="accent">{c.hero.titleAccent}</span>
            </h1>
            <p className="impact-line">{c.hero.impactLine}</p>
            <p className="lede typewriter-text">
              {typewriterText}
              {!typewriterDone && <span className="typewriter-cursor">|</span>}
            </p>
            <div className="cta-row hero-cta">
              <div className="contact-cta">
                <div className="social-badges" aria-label="Sosyal baglantilar">
                  <a
                    className="icon-btn linkedin"
                    href="https://www.linkedin.com/in/baha-buyukates"
                    target="_blank"
                    rel="noreferrer"
                    aria-label="LinkedIn"
                    title="LinkedIn"
                   
                   
                  >
                    <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
                      <path d="M12 0C5.372 0 0 5.372 0 12s5.372 12 12 12 12-5.372 12-12S18.628 0 12 0zm-4.72 17.7H4.28V9.3h3v8.4zM5.83 8.07c-.96 0-1.73-.79-1.73-1.76 0-.97.77-1.76 1.73-1.76s1.73.79 1.73 1.76c0 .97-.77 1.76-1.73 1.76zm12.87 9.63h-3v-4.58c0-1.09-.02-2.49-1.52-2.49-1.52 0-1.75 1.19-1.75 2.42v4.65h-3V9.3h2.88v1.15h.04c.4-.75 1.38-1.54 2.85-1.54 3.05 0 3.6 2.01 3.6 4.62v5.17z" />
                    </svg>
                  </a>
                  <a
                    className="icon-btn github"
                    href="https://github.com/JegBaha?tab=repositories"
                    target="_blank"
                    rel="noreferrer"
                    aria-label="GitHub"
                    title="GitHub"
                   
                   
                  >
                    <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
                      <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.387.6.113.82-.258.82-.577 0-.285-.011-1.04-.017-2.04-3.338.725-4.042-1.61-4.042-1.61-.546-1.387-1.333-1.757-1.333-1.757-1.089-.745.083-.73.083-.73 1.205.085 1.84 1.236 1.84 1.236 1.07 1.834 2.809 1.304 3.495.997.108-.776.418-1.305.762-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.469-2.381 1.236-3.221-.124-.303-.535-1.521.117-3.172 0 0 1.008-.322 3.3 1.23a11.5 11.5 0 0 1 3.003-.404c1.018.005 2.044.138 3.003.404 2.29-1.552 3.296-1.23 3.296-1.23.654 1.651.243 2.869.119 3.172.77.84 1.235 1.911 1.235 3.221 0 4.61-2.804 5.625-5.475 5.921.43.372.823 1.103.823 2.222 0 1.606-.015 2.898-.015 3.292 0 .322.216.694.825.576C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12" />
                    </svg>
                  </a>
                </div>
              </div>
              <a className="btn primary" href="#projects" onClick={(e) => scrollToSection('projects', e)}>
                {c.hero.ctas.browse}
              </a>
                <button
                  className="btn ghost"
                  onClick={() => setCvPopupOpen(true)}
                >
                  {c.hero.ctas.download}
                </button>
              </div>
              <div className="hero-cta-notes">
                <span>{c.hero.ctaNotes.citizen}</span>
                <span>{c.hero.ctaNotes.availability}</span>
              </div>
            </div>
            <div className="hero-panel">
            <div className="panel-header">
              <div className="panel-status">
                <span className="status-dot" />
                <span className="status-text">{c.heroPanel.status}</span>
              </div>
              <span className="panel-location">
                <svg viewBox="0 0 24 24" width="12" height="12" fill="currentColor" aria-hidden="true">
                  <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
                </svg>
                {c.heroPanel.location}
              </span>
            </div>
            <div className="panel-focus">
              <span className="panel-focus-title">{c.heroPanel.focus}</span>
              <div className="panel-focus-items">
                {c.heroPanel.focusItems.map((item) => (
                  <span className={`panel-focus-tag ${item.active ? 'active' : ''}`} key={item.label}>
                    {item.active && <span className="focus-pulse" />}
                    {item.label}
                  </span>
                ))}
              </div>
            </div>
            <div className="panel-footer">
              <span className="panel-availability">{c.heroPanel.availability}</span>
            </div>
          </div>
        </section>

        {/* Impact Stats - Professional metrics showcase */}
        <div className="impact-stats" aria-label="Key statistics">
          <div className="impact-stat">
            <div className="stat-value"><CountUp target={4} suffix="+" /></div>
            <div className="stat-label">{c.impactStats.experienceLabel}</div>
          </div>
          <div className="impact-stat">
            <div className="stat-value"><CountUp target={10} suffix="+" /></div>
            <div className="stat-label">{c.impactStats.projectsLabel}</div>
          </div>
          <div className="impact-stat">
            <div className="stat-value"><CountUp target={3} /></div>
            <div className="stat-label">{c.impactStats.languagesLabel}</div>
          </div>
          <div className="impact-stat">
            <div className="stat-value">{c.impactStats.englishValue}</div>
            <div className="stat-label">{c.impactStats.englishLabel}</div>
          </div>
        </div>

        <section className="section about" id="about">
          <div className="section-header">
            <p className="eyebrow">{c.about.eyebrow}</p>
            <h2>{c.about.title}</h2>
            <p className="section-text">{c.about.bio}</p>
          </div>

          {/* Motto Card */}
          <div className="motto-card">
            <svg className="motto-quote" viewBox="0 0 24 24" width="32" height="32" fill="currentColor" opacity="0.2">
              <path d="M6 17h3l2-4V7H5v6h3l-2 4zm8 0h3l2-4V7h-6v6h3l-2 4z" />
            </svg>
            <p className="motto-text">{c.about.motto}</p>
          </div>

          <div className="about-grid">
            <div className="card">
              <h3>{activeLocale === 'DE' ? 'Staerken' : activeLocale === 'EN' ? 'Strengths' : 'Güç alanlarım'}</h3>
              <ul className="list compact">
                {c.about.strengths.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </div>
            <div className="card">
              <h3>{activeLocale === 'DE' ? 'Offen fuer' : activeLocale === 'EN' ? 'Open roles' : 'Açık olduğum roller'}</h3>
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
            </div>
          </div>

          {/* Timeline */}
          <div className="about-timeline">
            <h3 className="about-timeline-title">
              {activeLocale === 'DE' ? 'Mein Weg' : activeLocale === 'EN' ? 'My Journey' : 'Yolculuğum'}
            </h3>
            <div className="about-timeline-track">
              {c.about.timeline.map((item, idx) => (
                <div className="about-timeline-item" key={idx}>
                  <span className="about-timeline-dot" />
                  <span className="about-timeline-year">{item.year}</span>
                  <span className="about-timeline-text">{item.text}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Enhanced CV Card */}
          <div className="cv-card">
            <div className="cv-card-icon">
              <svg viewBox="0 0 24 24" width="28" height="28" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                <polyline points="14 2 14 8 20 8" />
                <line x1="16" y1="13" x2="8" y2="13" />
                <line x1="16" y1="17" x2="8" y2="17" />
                <polyline points="10 9 9 9 8 9" />
              </svg>
            </div>
            <div className="cv-card-info">
              <p className="cv-card-title">{activeLocale === 'DE' ? 'Lebenslauf' : activeLocale === 'EN' ? 'Curriculum Vitae' : 'Özgeçmiş'}</p>
              <p className="cv-card-updated">
                {activeLocale === 'DE'
                  ? `Aktualisiert: ${c.cv.updated}`
                  : activeLocale === 'EN'
                  ? `Updated: ${c.cv.updated}`
                  : `Güncelleme: ${c.cv.updated}`}
              </p>
            </div>
            <button
              className="btn primary cv-card-btn"
              onClick={() => setCvPopupOpen(true)}
            >
              <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                <polyline points="7 10 12 15 17 10" />
                <line x1="12" y1="15" x2="12" y2="3" />
              </svg>
              {activeLocale === 'DE' ? 'Herunterladen' : activeLocale === 'EN' ? 'Download' : 'İndir'}
            </button>
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
                {edu.diploma && (
                  <button className="diploma-thumb" onClick={() => setDiplomaLightbox(true)} type="button">
                    <img src={edu.diploma} alt="Diploma" loading="lazy" />
                    <span className="diploma-label">
                      <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M15 3h6v6M9 21H3v-6M21 3l-7 7M3 21l7-7" />
                      </svg>
                      {activeLocale === 'DE' ? 'Diplom anzeigen' : activeLocale === 'EN' ? 'View diploma' : 'Diplomayı görüntüle'}
                    </span>
                  </button>
                )}
              </article>
            ))}
          </div>
        </section>

        {diplomaLightbox && (
          <div className="lightbox-overlay" onClick={() => setDiplomaLightbox(false)}>
            <div className="lightbox-content" onClick={(e) => e.stopPropagation()}>
              <button className="lightbox-close" onClick={() => setDiplomaLightbox(false)} type="button">
                <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M18 6L6 18M6 6l12 12" />
                </svg>
              </button>
              <img src="/diploma.jpg" alt="Diploma" />
            </div>
          </div>
        )}

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
                <div className="job-card-header">
                  <span className="job-avatar" aria-hidden="true">{job.company.charAt(0)}</span>
                  <div className="job-card-header-info">
                    <div className="card-head">
                      <div>
                        <h3>{job.role}</h3>
                        <p className="stack">
                          {job.company} / {job.location}
                        </p>
                      </div>
                      <div className="job-badges">
                        <span className="pill ghost">{job.period}</span>
                        <span className="pill small job-duration">{getJobDuration(job.period)}</span>
                      </div>
                    </div>
                  </div>
                </div>
                <ul className="list">
                  {job.bullets.map((line) => (
                    <li key={line}>{line}</li>
                  ))}
                </ul>
                {job.skills && job.skills.length > 0 && (
                  <div className="job-skills">
                    {job.skills.map((skill) => (
                      <span className="pill small job-skill-tag" key={skill}>{skill}</span>
                    ))}
                  </div>
                )}
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
              <div className="card skill-card" key={skill.title}>
                <div className="card-head">
                  <div className="skill-title-row">
                    <span className="skill-icon-badge" aria-hidden="true">{skill.icon}</span>
                    <h3>{skill.title}</h3>
                  </div>
                  <span className="skill-percent">{skill.percent}%</span>
                </div>
                <div className="skill-progress-track">
                  <div className="skill-progress-fill" style={{ width: `${skill.percent}%` }} />
                </div>
                <p className="card-text">{skill.detail}</p>
                <div className="tags">
                  {skill.items.map((item) => (
                    <span className={`pill skill-level-pill level-${item.level}`} key={item.name}>
                      {item.name}
                      <span className="skill-level-dot" aria-label={item.level} />
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
                : 'Toolbelt & son kullanılanlar'}
            </p>
            <div className="toolbelt-groups">
              {c.toolbelt.map((group) => (
                <div className="toolbelt-group" key={group.category}>
                  <span className="toolbelt-category">{group.category}</span>
                  <div className="tags">
                    {group.tools.map((tool) => {
                      const icon = getTechIcon(tool)
                      return (
                        <span className={`pill ${icon ? 'pill-with-icon' : ''}`} key={tool}>
                          {icon && <img src={icon} alt={tool} className="skill-icon" loading="lazy" />}
                          {tool}
                        </span>
                      )
                    })}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Currently Learning Section */}
          <div className="currently-learning">
            <p className="eyebrow">{c.currentlyLearning.title}</p>
            <div className="learning-items">
              {c.currentlyLearning.items.map((item) => (
                <div className="learning-item" key={item.title}>
                  <span className="learning-icon">{item.icon}</span>
                  <div className="learning-content">
                    <span className="learning-title">{item.title}</span>
                    <span className="learning-subtitle">{item.subtitle}</span>
                    <div className="learning-progress">
                      <div className="learning-progress-bar" style={{ width: `${item.progress}%` }} />
                    </div>
                  </div>
                </div>
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

          {/* Professional Projects Separator */}
          <div className="hobby-separator field-separator">
            <div className="separator-line" />
            <span className="separator-title">
              {activeLocale === 'TR' ? 'Alan Projelerim' : activeLocale === 'DE' ? 'Fachprojekte' : 'Field Projects'}
            </span>
            <div className="separator-line" />
          </div>

          {/* Professional Projects */}
          <div className={`grid projects${isMobile ? ' mobile' : ''}`}>
            {c.projects
              .filter((project) => !project.hobby)
              .map((project, idx) => {
              const isUnityProject = project.stack.toLowerCase().includes('unity')
              const isPlayground = Boolean(project.playground)
              const preview = getProjectPreview(project)
              const visibleTags = project.tags.slice(0, 3)
              const remainingTagCount = project.tags.length - visibleTags.length
              const isFeatured = idx === 0 && !isMobile
              const stackItems = project.stack.split(',').map((s) => s.trim())

              if (isMobile) {
                return (
                  <article
                    className={`card project-card mobile-compact${isPlayground ? ' playground' : ''}`}
                    key={project.title}
                  >
                    {project.image && !isUnityProject && (
                      <div className="project-media mobile-media">
                        <img src={project.image} alt={project.title} loading="lazy" decoding="async" />
                      </div>
                    )}
                    <div className="card-head">
                      <div>
                        <h3>{project.title}</h3>
                        <div className="stack-badges">
                          {stackItems.slice(0, 3).map((s) => (
                            <span className="stack-badge" key={s}>{s}</span>
                          ))}
                        </div>
                      </div>
                      {isPlayground && <span className="pill small ghost">Prototype / Demo</span>}
                    </div>
                    <p className="card-text project-brief">{preview}</p>
                    <div className="tags">
                      {visibleTags.map((tag) => (
                        <span className="pill small" key={tag}>{tag}</span>
                      ))}
                      {remainingTagCount > 0 && <span className="pill small ghost">+{remainingTagCount}</span>}
                    </div>
                    <div className="card-footer project-actions">
                      <button className="btn ghost small full-width" type="button" onClick={() => openProjectDetail(project)}>
                        {projectUiCopy.open}
                      </button>
                    </div>
                  </article>
                )
              }

              return (
                <article
                  className={`card project-card${isPlayground ? ' playground' : ''}${isFeatured ? ' featured' : ''} project-stagger`}
                  key={project.title}
                  style={{ animationDelay: `${idx * 80}ms` }}
                >
                  {!isUnityProject && (
                    <div className={`project-media${!project.image ? ' no-image' : ''}`} style={getProjectMediaStyle(project.title)}>
                      {project.image && <img src={project.image} alt={project.title} loading="lazy" />}
                    </div>
                  )}
                  <div className="card-head">
                    <div>
                      <h3>{project.title}</h3>
                      <div className="stack-badges">
                        {stackItems.map((s) => (
                          <span className="stack-badge" key={s}>{s}</span>
                        ))}
                      </div>
                    </div>
                    {isPlayground && <span className="pill small ghost">Prototype / Demo</span>}
                    <span className={getProjectAccentClass(project.title)} />
                  </div>
                  <p className="card-text project-brief">{preview}</p>
                  <div className="tags">
                    {visibleTags.map((tag) => (
                      <span className="pill small" key={tag}>{tag}</span>
                    ))}
                    {remainingTagCount > 0 && <span className="pill small ghost">+{remainingTagCount}</span>}
                  </div>
                  {project.impact && (
                    <div className="project-impact">
                      <span className="impact-icon">📈</span>
                      <span className="impact-text">{project.impact}</span>
                    </div>
                  )}
                  <div className="card-footer project-actions">
                    <button className="btn ghost small" type="button" onClick={() => openProjectDetail(project)}>
                      {projectUiCopy.open}
                    </button>
                    <a className="link" href={project.github} target="_blank" rel="noreferrer">
                      GitHub
                    </a>
                  </div>
                </article>
              )
            })}
          </div>

          {/* Hobby Projects Separator */}
          <div className="hobby-separator">
            <div className="separator-line" />
            <span className="separator-title">
              {activeLocale === 'TR' ? 'Hobi Projelerim' : activeLocale === 'DE' ? 'Hobby-Projekte' : 'Hobby Projects'}
            </span>
            <div className="separator-line" />
          </div>

          {/* Hobby Projects - Side by Side */}
          <div className="hobby-projects-row">
            {c.projects
              .filter((project) => project.hobby)
              .map((project, idx) => {
              const isPlayground = Boolean(project.playground)
              const preview = getProjectPreview(project)
              const visibleTags = project.tags.slice(0, 3)
              const remainingTagCount = project.tags.length - visibleTags.length
              const stackItems = project.stack.split(',').map((s) => s.trim())

              return (
                <article
                  className={`card project-card hobby-card${isPlayground ? ' playground' : ''} project-stagger`}
                  key={project.title}
                  style={{ animationDelay: `${idx * 80}ms` }}
                >
                  <div className="card-head">
                    <div>
                      <h3>{project.title}</h3>
                      <div className="stack-badges">
                        {stackItems.map((s) => (
                          <span className="stack-badge" key={s}>{s}</span>
                        ))}
                      </div>
                    </div>
                    {isPlayground && <span className="pill small ghost">Prototype / Demo</span>}
                  </div>
                  <p className="card-text project-brief">{preview}</p>
                  <div className="tags">
                    {visibleTags.map((tag) => (
                      <span className="pill small" key={tag}>{tag}</span>
                    ))}
                    {remainingTagCount > 0 && <span className="pill small ghost">+{remainingTagCount}</span>}
                  </div>
                  {project.impact && (
                    <div className="project-impact">
                      <span className="impact-icon">📈</span>
                      <span className="impact-text">{project.impact}</span>
                    </div>
                  )}
                  <div className="card-footer project-actions">
                    <button className="btn ghost small" type="button" onClick={() => openProjectDetail(project)}>
                      {projectUiCopy.open}
                    </button>
                    <a className="link" href={project.github} target="_blank" rel="noreferrer">
                      GitHub
                    </a>
                  </div>
                </article>
              )
            })}
          </div>
          {activeProjectDetail && (
            <div
              className="project-modal-overlay"
              role="dialog"
              aria-modal="true"
              aria-label={activeProjectDetail.title}
              onClick={() => setActiveProjectDetail(null)}
            >
              <div className="project-modal" onClick={(e) => e.stopPropagation()}>
                <div className="modal-head">
                  <div>
                    <p className="eyebrow">{activeProjectDetail.stack}</p>
                    <h3>{activeProjectDetail.title}</h3>
                  </div>
                  <button className="close-btn" type="button" aria-label={projectUiCopy.close} onClick={() => { setActiveProjectDetail(null) }}>
                    ×
                  </button>
                </div>
                <div className="modal-body">
                  {activeProjectDetail.image && !activeProjectDetail.stack.toLowerCase().includes('unity') && (
                    <div className="project-media modal-media" style={getProjectMediaStyle(activeProjectDetail.title)}>
                      <img src={activeProjectDetail.image} alt={activeProjectDetail.title} loading="lazy" />
                    </div>
                  )}
                  {activeProjectDetail.gallery && activeProjectDetail.gallery.length > 0 && (
                    <div className="project-gallery">
                      <h4 className="gallery-title">
                        {activeLocale === 'TR' ? 'Proje Görselleri' : activeLocale === 'DE' ? 'Projektbilder' : 'Project Screenshots'}
                      </h4>
                      <div
                        className="gallery-slider"
                        onTouchStart={(e) => {
                          const touch = e.touches[0];
                          (e.currentTarget as HTMLElement).dataset.touchStartX = String(touch.clientX);
                          (e.currentTarget as HTMLElement).dataset.touchStartY = String(touch.clientY);
                        }}
                        onTouchEnd={(e) => {
                          const startX = Number((e.currentTarget as HTMLElement).dataset.touchStartX);
                          const startY = Number((e.currentTarget as HTMLElement).dataset.touchStartY);
                          const endX = e.changedTouches[0].clientX;
                          const endY = e.changedTouches[0].clientY;
                          const diffX = startX - endX;
                          const diffY = startY - endY;
                          if (Math.abs(diffX) > Math.abs(diffY) && Math.abs(diffX) > 50) {
                            if (diffX > 0) {
                              setGalleryIndex((prev) => (prev + 1) % activeProjectDetail.gallery!.length);
                            } else {
                              setGalleryIndex((prev) => (prev - 1 + activeProjectDetail.gallery!.length) % activeProjectDetail.gallery!.length);
                            }
                          }
                        }}
                      >
                        <button
                          className="gallery-slider-nav gallery-slider-prev"
                          type="button"
                          onClick={() => setGalleryIndex((prev) => (prev - 1 + activeProjectDetail.gallery!.length) % activeProjectDetail.gallery!.length)}
                          aria-label={activeLocale === 'TR' ? 'Önceki' : activeLocale === 'DE' ? 'Zurück' : 'Previous'}
                        >
                          ‹
                        </button>
                        <div className="gallery-slider-viewport">
                          <img
                            src={activeProjectDetail.gallery[galleryIndex]}
                            alt={`${activeProjectDetail.title} screenshot ${galleryIndex + 1}`}
                            className="gallery-slider-img"
                            onClick={() => setGalleryLightbox(true)}
                            loading="lazy"
                          />
                        </div>
                        <button
                          className="gallery-slider-nav gallery-slider-next"
                          type="button"
                          onClick={() => setGalleryIndex((prev) => (prev + 1) % activeProjectDetail.gallery!.length)}
                          aria-label={activeLocale === 'TR' ? 'Sonraki' : activeLocale === 'DE' ? 'Weiter' : 'Next'}
                        >
                          ›
                        </button>
                      </div>
                      <div className="gallery-slider-counter">
                        {galleryIndex + 1} / {activeProjectDetail.gallery.length}
                      </div>
                      <div className="gallery-slider-dots">
                        {activeProjectDetail.gallery.map((_, idx) => (
                          <button
                            key={idx}
                            type="button"
                            className={`gallery-dot${galleryIndex === idx ? ' active' : ''}`}
                            onClick={() => setGalleryIndex(idx)}
                            aria-label={`${activeLocale === 'TR' ? 'Görsel' : activeLocale === 'DE' ? 'Bild' : 'Image'} ${idx + 1}`}
                          />
                        ))}
                      </div>
                      <p className="gallery-hint">
                        {activeLocale === 'TR' ? 'Büyütmek için tıklayın · Kaydırarak gezin' : activeLocale === 'DE' ? 'Zum Vergrößern klicken · Wischen zum Navigieren' : 'Click to enlarge · Swipe to navigate'}
                      </p>
                    </div>
                  )}
                  {!activeProjectDetail.gallery && (
                    <p className="no-gallery-note">
                      {activeLocale === 'TR'
                        ? 'Daha fazla görsel için GitHub sayfasını ziyaret edebilirsiniz.'
                        : activeLocale === 'DE'
                        ? 'Weitere Bilder finden Sie auf der GitHub-Seite.'
                        : 'Visit GitHub page for more visuals.'}
                    </p>
                  )}
                  <p className="card-text">{activeProjectDetail.description}</p>
                  <p className="card-text subtle">{activeProjectDetail.summary}</p>
                  {activeProjectDetail.details && (
                    <div className="project-details-section">
                      <h4 className="details-title">
                        {activeLocale === 'TR' ? 'Kullanılan Teknolojiler' : activeLocale === 'DE' ? 'Verwendete Technologien' : 'Technologies Used'}
                      </h4>
                      <ul className="details-list">
                        {activeProjectDetail.details.backend && (
                          <li><strong>Backend:</strong> {activeProjectDetail.details.backend}</li>
                        )}
                        {activeProjectDetail.details.frontend && (
                          <li><strong>Frontend:</strong> {activeProjectDetail.details.frontend}</li>
                        )}
                        {activeProjectDetail.details.database && (
                          <li><strong>{activeLocale === 'TR' ? 'Veritabanı' : activeLocale === 'DE' ? 'Datenbank' : 'Database'}:</strong> {activeProjectDetail.details.database}</li>
                        )}
                        {activeProjectDetail.details.orm && (
                          <li><strong>ORM:</strong> {activeProjectDetail.details.orm}</li>
                        )}
                        {activeProjectDetail.details.auth && (
                          <li><strong>{activeLocale === 'TR' ? 'Kimlik Doğrulama' : activeLocale === 'DE' ? 'Authentifizierung' : 'Authentication'}:</strong> {activeProjectDetail.details.auth}</li>
                        )}
                        {activeProjectDetail.details.dataProcessing && (
                          <li><strong>{activeLocale === 'TR' ? 'Veri İşleme' : activeLocale === 'DE' ? 'Datenverarbeitung' : 'Data Processing'}:</strong> {activeProjectDetail.details.dataProcessing}</li>
                        )}
                        {activeProjectDetail.details.mlModels && (
                          <li><strong>{activeLocale === 'TR' ? 'ML Modelleri' : activeLocale === 'DE' ? 'ML-Modelle' : 'ML Models'}:</strong> {activeProjectDetail.details.mlModels}</li>
                        )}
                        {activeProjectDetail.details.protocols && (
                          <li><strong>{activeLocale === 'TR' ? 'Protokoller' : activeLocale === 'DE' ? 'Protokolle' : 'Protocols'}:</strong> {activeProjectDetail.details.protocols}</li>
                        )}
                        {activeProjectDetail.details.visualization && (
                          <li><strong>{activeLocale === 'TR' ? 'Görselleştirme' : activeLocale === 'DE' ? 'Visualisierung' : 'Visualization'}:</strong> {activeProjectDetail.details.visualization}</li>
                        )}
                        {activeProjectDetail.details.deployment && (
                          <li><strong>Deployment:</strong> {activeProjectDetail.details.deployment}</li>
                        )}
                        {activeProjectDetail.details.hardware && (
                          <li><strong>{activeLocale === 'TR' ? 'Donanım' : activeLocale === 'DE' ? 'Hardware' : 'Hardware'}:</strong> {activeProjectDetail.details.hardware}</li>
                        )}
                        {activeProjectDetail.details.layers && activeProjectDetail.details.layers.length > 0 && (
                          <li><strong>{activeLocale === 'TR' ? 'Katmanlar' : activeLocale === 'DE' ? 'Schichten' : 'Layers'}:</strong> {activeProjectDetail.details.layers.join(', ')}</li>
                        )}
                        {activeProjectDetail.details.projectManagement && (
                          <li><strong>{activeLocale === 'TR' ? 'Proje Yönetimi' : activeLocale === 'DE' ? 'Projektmanagement' : 'Project Management'}:</strong> {activeProjectDetail.details.projectManagement}</li>
                        )}
                        {activeProjectDetail.details.versionControl && (
                          <li><strong>{activeLocale === 'TR' ? 'Sürüm Kontrol' : activeLocale === 'DE' ? 'Versionskontrolle' : 'Version Control'}:</strong> {activeProjectDetail.details.versionControl}</li>
                        )}
                        {activeProjectDetail.details.architecture && (
                          <li><strong>{activeLocale === 'TR' ? 'Mimari' : activeLocale === 'DE' ? 'Architektur' : 'Architecture'}:</strong> {activeProjectDetail.details.architecture}</li>
                        )}
                      </ul>
                    </div>
                  )}
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
                <button className="btn primary full-width" type="button" onClick={() => { setActiveProjectDetail(null) }}>
                  {projectUiCopy.close}
                </button>
              </div>
            </div>
          )}
          {galleryLightbox && activeProjectDetail?.gallery && (
            <div
              className="gallery-lightbox-overlay"
              role="dialog"
              aria-modal="true"
              onClick={() => setGalleryLightbox(false)}
            >
              <div
                className="gallery-lightbox-content"
                onClick={(e) => e.stopPropagation()}
                onTouchStart={(e) => {
                  const touch = e.touches[0];
                  (e.currentTarget as HTMLElement).dataset.touchStartX = String(touch.clientX);
                  (e.currentTarget as HTMLElement).dataset.touchStartY = String(touch.clientY);
                }}
                onTouchEnd={(e) => {
                  const startX = Number((e.currentTarget as HTMLElement).dataset.touchStartX);
                  const startY = Number((e.currentTarget as HTMLElement).dataset.touchStartY);
                  const endX = e.changedTouches[0].clientX;
                  const endY = e.changedTouches[0].clientY;
                  const diffX = startX - endX;
                  const diffY = startY - endY;
                  if (Math.abs(diffX) > Math.abs(diffY) && Math.abs(diffX) > 50) {
                    if (diffX > 0) {
                      setGalleryIndex((prev) => (prev + 1) % activeProjectDetail.gallery!.length);
                    } else {
                      setGalleryIndex((prev) => (prev - 1 + activeProjectDetail.gallery!.length) % activeProjectDetail.gallery!.length);
                    }
                  }
                }}
              >
                <button
                  className="gallery-lightbox-close"
                  type="button"
                  onClick={() => setGalleryLightbox(false)}
                  aria-label={activeLocale === 'TR' ? 'Kapat' : activeLocale === 'DE' ? 'Schließen' : 'Close'}
                >
                  ×
                </button>
                <button
                  className="gallery-nav gallery-prev"
                  type="button"
                  onClick={() => setGalleryIndex((prev) => (prev - 1 + activeProjectDetail.gallery!.length) % activeProjectDetail.gallery!.length)}
                  aria-label={activeLocale === 'TR' ? 'Önceki' : activeLocale === 'DE' ? 'Zurück' : 'Previous'}
                >
                  ‹
                </button>
                <img
                  src={activeProjectDetail.gallery[galleryIndex]}
                  alt={`${activeProjectDetail.title} - ${galleryIndex + 1}`}
                  className="gallery-lightbox-img"
                />
                <button
                  className="gallery-nav gallery-next"
                  type="button"
                  onClick={() => setGalleryIndex((prev) => (prev + 1) % activeProjectDetail.gallery!.length)}
                  aria-label={activeLocale === 'TR' ? 'Sonraki' : activeLocale === 'DE' ? 'Weiter' : 'Next'}
                >
                  ›
                </button>
                <div className="gallery-counter">
                  {galleryIndex + 1} / {activeProjectDetail.gallery.length}
                </div>
              </div>
            </div>
          )}
          <div className="projects-note">
            <a
              className="btn primary projects-note-cta"
              href="https://github.com/JegBaha?tab=repositories"
              target="_blank"
              rel="noreferrer"
            >
              {c.projectsNoteCta}
            </a>
          </div>
        </section>

        <section className="section" id="certifications">
          <div className="section-header">
            <p className="eyebrow">{c.sections.certifications.eyebrow}</p>
            <h2>{c.sections.certifications.title}</h2>
            <p className="section-text">{c.sections.certifications.text}</p>
          </div>
          <div className="cert-grid">
            {c.certifications.map((cert) => (
              <article className="cert-badge" key={cert.name}>
                <span className="cert-provider">{cert.provider}</span>
                <p className="cert-name">{cert.name}</p>
                <a
                  href="https://www.linkedin.com/in/baha-buyukates/details/certifications/"
                  target="_blank"
                  rel="noreferrer"
                  className="cert-verify-link"
                  aria-label={`${cert.name} sertifikasını doğrula`}
                >
                  <svg viewBox="0 0 24 24" width="14" height="14" fill="currentColor">
                    <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/>
                  </svg>
                  {activeLocale === 'TR' ? 'Doğrula' : activeLocale === 'DE' ? 'Verifizieren' : 'Verify'}
                </a>
              </article>
            ))}
          </div>

          <div className="languages-section">
            <h3 className="languages-title">
              {activeLocale === 'DE'
                ? 'Sprachen'
                : activeLocale === 'EN'
                ? 'Languages'
                : 'Diller'}
            </h3>
            <div className="lang-bars">
              {c.languages.map((lang) => (
                <div className="lang-item" key={lang.name}>
                  <div className="lang-info">
                    <span className="lang-name">{lang.name}</span>
                    <span className="lang-level">{lang.level}</span>
                  </div>
                  <div className="lang-track">
                    <div className="lang-fill" style={{ width: `${lang.percent}%` }} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="section hobby" id="hobby">
          <div className="section-header">
            <p className="eyebrow">{c.sections.hobby.eyebrow}</p>
            <h2>{c.sections.hobby.title}</h2>
            <p className="section-text">{c.sections.hobby.text}</p>
          </div>
          <div className="hobby-showcase-card">
            <audio ref={trackRef} src="/track-new.mp3" preload="none" onEnded={() => setTrackPlaying(false)} />
            <div className="hobby-showcase-visual">
              <div className={`sound-wave ${trackPlaying ? 'playing' : ''}`} aria-hidden="true">
                {Array.from({ length: 12 }).map((_, i) => (
                  <span key={i} className="wave-bar" style={{ animationDelay: `${i * 0.08}s` }} />
                ))}
              </div>
              <button
                className="hobby-play-btn"
                aria-label={trackPlaying ? 'Pause' : 'Play'}
                onClick={() => {
                  if (!trackRef.current) return
                  if (trackPlaying) {
                    trackRef.current.pause()
                    setTrackPlaying(false)
                  } else {
                    trackRef.current.play()
                    setTrackPlaying(true)
                  }
                }}
              >
                {trackPlaying ? (
                  <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor"><rect x="6" y="4" width="4" height="16" rx="1"/><rect x="14" y="4" width="4" height="16" rx="1"/></svg>
                ) : (
                  <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor"><path d="M8 5v14l11-7z"/></svg>
                )}
                <span>{trackPlaying
                  ? (activeLocale === 'DE' ? 'Pause' : activeLocale === 'EN' ? 'Pause' : 'Durdur')
                  : (activeLocale === 'DE' ? 'Track abspielen' : activeLocale === 'EN' ? 'Play Track' : 'Track Çal')
                }</span>
              </button>
              <div className="hobby-volume">
                <svg viewBox="0 0 24 24" width="14" height="14" fill="currentColor" aria-hidden="true">
                  <path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02z"/>
                </svg>
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.01"
                  defaultValue="0.7"
                  className="hobby-volume-slider"
                  aria-label="Volume"
                  onChange={(e) => {
                    if (trackRef.current) trackRef.current.volume = parseFloat(e.target.value)
                  }}
                />
              </div>
            </div>
            <div className="hobby-showcase-details">
              <div className="hobby-detail-group">
                <span className="hobby-detail-label">
                  {activeLocale === 'DE' ? 'Genres' : activeLocale === 'EN' ? 'Genres' : 'Türler'}
                </span>
                <div className="hobby-tags">
                  {c.hobbyShowcase.genres.map((g) => (
                    <span className="pill hobby-genre-pill" key={g}>{g}</span>
                  ))}
                </div>
              </div>
              <div className="hobby-detail-group">
                <span className="hobby-detail-label">DAW</span>
                <div className="hobby-tags">
                  {c.hobbyShowcase.daws.map((d) => (
                    <span className="pill hobby-daw-pill" key={d}>{d}</span>
                  ))}
                </div>
              </div>
              <div className="hobby-detail-group">
                <span className="hobby-detail-label">
                  {activeLocale === 'DE' ? 'Instrumente' : activeLocale === 'EN' ? 'Instruments' : 'Enstrümanlar'}
                </span>
                <div className="hobby-tags">
                  {c.hobbyShowcase.instruments.map((inst) => (
                    <span className="pill hobby-inst-pill" key={inst}>{inst}</span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="section contact" id="contact">
          <div className="contact-header">
            <p className="eyebrow">{c.sections.contact.eyebrow}</p>
            <h2>{c.sections.contact.title} <span className="availability-badge">{c.sections.contact.availability}</span></h2>
            <p className="section-text">{c.sections.contact.text}</p>
          </div>

          <div className="contact-grid">
            <div className="contact-info-card">
              <div className="photo-frame">
                <img src="/photo.jpg" alt="Profil fotoğrafı" loading="lazy" />
              </div>
              <div className="contact-details">
                <a className="contact-item" href="mailto:bahabuyukates@gmail.com">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="4" width="20" height="16" rx="2"/><path d="M22 7l-10 6L2 7"/></svg>
                  <span>bahabuyukates@gmail.com</span>
                </a>
                <a className="contact-item" href="tel:+905421559766">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07 19.5 19.5 0 01-6-6A19.79 19.79 0 012.12 4.18 2 2 0 014.11 2h3a2 2 0 012 1.72c.127.96.362 1.903.7 2.81a2 2 0 01-.45 2.11L8.09 9.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45c.907.338 1.85.573 2.81.7A2 2 0 0122 16.92z"/></svg>
                  <span>+90 542 155 9766</span>
                </a>
              </div>
              <div className="contact-socials">
                <a href="https://www.linkedin.com/in/baha-buyukates" target="_blank" rel="noreferrer" aria-label="LinkedIn">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>
                </a>
                <a href="https://github.com/JegBaha?tab=repositories" target="_blank" rel="noreferrer" aria-label="GitHub">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M12 0C5.374 0 0 5.373 0 12c0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23A11.509 11.509 0 0112 5.803c1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576C20.566 21.797 24 17.3 24 12c0-6.627-5.373-12-12-12z"/></svg>
                </a>
                <a href="https://www.instagram.com/jegbaa?igsh=MXQ1aHRybnByOHU5bQ==" target="_blank" rel="noreferrer" aria-label="Instagram">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/></svg>
                </a>
              </div>
            </div>

            <div className="contact-form-card">
              <h3>{c.sections.contact.formTitle}</h3>
              <form className="contact-form" onSubmit={handleContactSubmit}>
                <div className="form-group">
                  <input type="text" name="name" placeholder=" " required />
                  <label>{activeLocale === 'DE' ? 'Name' : activeLocale === 'EN' ? 'Name' : 'Ad'}</label>
                </div>
                <div className="form-group">
                  <input type="email" name="email" placeholder=" " required />
                  <label>{activeLocale === 'DE' ? 'E-Mail' : activeLocale === 'EN' ? 'Email' : 'E-posta'}</label>
                </div>
                <div className="form-group">
                  <select name="subject" defaultValue="">
                    <option value="" disabled hidden>—</option>
                    {c.sections.contact.subjects.map((s) => (
                      <option key={s} value={s}>{s}</option>
                    ))}
                  </select>
                  <label>{activeLocale === 'DE' ? 'Betreff' : activeLocale === 'EN' ? 'Subject' : 'Konu'}</label>
                </div>
                <div className="form-group">
                  <textarea name="message" rows={4} placeholder=" " required />
                  <label>{activeLocale === 'DE' ? 'Nachricht' : activeLocale === 'EN' ? 'Message' : 'Mesaj'}</label>
                </div>
                <button type="submit" className="btn primary">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg>
                  {contactSent ? c.sections.contact.sent : (activeLocale === 'DE' ? 'Senden' : activeLocale === 'EN' ? 'Send' : 'Gönder')}
                </button>
              </form>
            </div>
          </div>
        </section>

        
        <footer className="footer-note">
          <span>Created by Baha Buyukates - Portfolio 2025</span>
        </footer>
      </main>

      {/* Floating Navigation Sidebar */}
      {!isMobile && (
        <nav className="floating-sidebar" aria-label="Section navigation">
          <div className="sidebar-header">
            <span className="sidebar-title">
              {activeLocale === 'DE' ? 'Navigation' : activeLocale === 'EN' ? 'Navigate' : 'Gezinti'}
            </span>
            <span className="sidebar-hint">↑↓ or 1-9</span>
          </div>
          <div className="sidebar-items">
            {navSections.map((section, index) => {
              const sectionIcons: Record<string, string> = {
                hero: '🏠',
                about: '👤',
                education: '🎓',
                experience: '💼',
                skills: '⚡',
                projects: '🚀',
                certifications: '📜',
                hobby: '🎸',
                contact: '✉️'
              }
              const sectionNames: Record<string, string> = activeLocale === 'DE'
                ? {
                    hero: 'Start',
                    about: 'Über mich',
                    education: 'Ausbildung',
                    experience: 'Erfahrung',
                    skills: 'Skills',
                    projects: 'Projekte',
                    certifications: 'Zertifikate',
                    hobby: 'Hobby',
                    contact: 'Kontakt'
                  }
                : activeLocale === 'EN'
                ? {
                    hero: 'Top',
                    about: 'About',
                    education: 'Education',
                    experience: 'Experience',
                    skills: 'Skills',
                    projects: 'Projects',
                    certifications: 'Certs',
                    hobby: 'Hobby',
                    contact: 'Contact'
                  }
                : {
                    hero: 'Başla',
                    about: 'Hakkımda',
                    education: 'Eğitim',
                    experience: 'Deneyim',
                    skills: 'Yetenekler',
                    projects: 'Projeler',
                    certifications: 'Sertifikalar',
                    hobby: 'Hobim',
                    contact: 'İletişim'
                  }
              return (
                <button
                  key={section}
                  type="button"
                  className={`sidebar-item ${activeSection === section ? 'active' : ''}`}
                  onClick={() => scrollToSection(section)}
                  aria-label={`Go to ${section}`}
                >
                  <span className="item-key">{index + 1}</span>
                  <span className="item-icon">{sectionIcons[section]}</span>
                  <span className="item-label">{sectionNames[section]}</span>
                  <span className="item-indicator" />
                </button>
              )
            })}
          </div>
          <div className="sidebar-progress">
            <div
              className="progress-fill"
              style={{ height: `${((navSections.indexOf(activeSection) + 1) / navSections.length) * 100}%` }}
            />
          </div>
        </nav>
      )}

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
                  <button type="button" className="link-button" onClick={() => { setFeedbackReminder(false) }}>
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
                <span>💬 {feedbackCopy.cta}</span>
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
        <button className="scroll-top" type="button" onClick={scrollToTop} aria-label="Başa dön">
          ↑
        </button>
      )}

      {/* Floating Quick Contact */}
      <div className={`floating-contact ${floatingContactOpen ? 'open' : ''}`}>
        <div className="floating-contact-menu">
          <a
            href="mailto:bahabuyukates@gmail.com"
            className="floating-contact-item"
            aria-label="Email"
          >
            <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor">
              <path d="M20 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z"/>
            </svg>
          </a>
          <a
            href="https://www.linkedin.com/in/baha-buyukates"
            target="_blank"
            rel="noreferrer"
            className="floating-contact-item"
            aria-label="LinkedIn"
          >
            <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor">
              <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.32 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.79M6.88 8.56a1.68 1.68 0 0 0 1.68-1.68c0-.93-.75-1.69-1.68-1.69a1.69 1.69 0 0 0-1.69 1.69c0 .93.76 1.68 1.69 1.68m1.39 9.94v-8.37H5.5v8.37h2.77z"/>
            </svg>
          </a>
          <a
            href="https://github.com/Bahadir-Erdem"
            target="_blank"
            rel="noreferrer"
            className="floating-contact-item"
            aria-label="GitHub"
          >
            <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor">
              <path d="M12 2A10 10 0 0 0 2 12c0 4.42 2.87 8.17 6.84 9.5.5.08.66-.23.66-.5v-1.69c-2.77.6-3.36-1.34-3.36-1.34-.46-1.16-1.11-1.47-1.11-1.47-.91-.62.07-.6.07-.6 1 .07 1.53 1.03 1.53 1.03.87 1.52 2.34 1.07 2.91.83.09-.65.35-1.09.63-1.34-2.22-.25-4.55-1.11-4.55-4.92 0-1.11.38-2 1.03-2.71-.1-.25-.45-1.29.1-2.64 0 0 .84-.27 2.75 1.02.79-.22 1.65-.33 2.5-.33.85 0 1.71.11 2.5.33 1.91-1.29 2.75-1.02 2.75-1.02.55 1.35.2 2.39.1 2.64.65.71 1.03 1.6 1.03 2.71 0 3.82-2.34 4.66-4.57 4.91.36.31.69.92.69 1.85V21c0 .27.16.59.67.5C19.14 20.16 22 16.42 22 12A10 10 0 0 0 12 2z"/>
            </svg>
          </a>
        </div>
        <button
          className="floating-contact-toggle"
          onClick={() => setFloatingContactOpen(!floatingContactOpen)}
          aria-label="İletişim menüsünü aç/kapat"
          aria-expanded={floatingContactOpen}
        >
          <svg className="icon-chat" viewBox="0 0 24 24" width="24" height="24" fill="currentColor">
            <path d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm0 14H6l-2 2V4h16v12z"/>
          </svg>
          <svg className="icon-close" viewBox="0 0 24 24" width="24" height="24" fill="currentColor">
            <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/>
          </svg>
        </button>
      </div>

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
            ×
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
                ★
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
              : 'Veriler sadece kendimi geliştirme amaçlı; sadece puanlama tutulur.'}
          </p>
        </div>
      </aside>

      {/* CV Language Selection Popup */}
      {cvPopupOpen && (
        <div className="cv-popup-overlay" onClick={() => setCvPopupOpen(false)}>
          <div className="cv-popup" onClick={(e) => e.stopPropagation()}>
            <button
              className="cv-popup-close"
              onClick={() => setCvPopupOpen(false)}
              aria-label="Kapat"
            >
              <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2">
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </button>
            <div className="cv-popup-icon">
              <svg viewBox="0 0 24 24" width="48" height="48" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                <polyline points="14 2 14 8 20 8" />
                <line x1="16" y1="13" x2="8" y2="13" />
                <line x1="16" y1="17" x2="8" y2="17" />
              </svg>
            </div>
            <h3 className="cv-popup-title">
              {activeLocale === 'DE' ? 'CV herunterladen' : activeLocale === 'EN' ? 'Download CV' : 'CV İndir'}
            </h3>
            <p className="cv-popup-subtitle">
              {activeLocale === 'DE' ? 'Sprache wählen' : activeLocale === 'EN' ? 'Select language' : 'Dil seçin'}
            </p>
            <div className="cv-popup-options">
              <a
                href={cvLinks.TR}
                target="_blank"
                rel="noreferrer"
                className="cv-popup-option"
                onClick={() => setCvPopupOpen(false)}
              >
                <span className="cv-popup-flag">🇹🇷</span>
                <span className="cv-popup-lang">Türkçe</span>
                <svg className="cv-popup-download" viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                  <polyline points="7 10 12 15 17 10" />
                  <line x1="12" y1="15" x2="12" y2="3" />
                </svg>
              </a>
              <a
                href={cvLinks.DE}
                target="_blank"
                rel="noreferrer"
                className="cv-popup-option"
                onClick={() => setCvPopupOpen(false)}
              >
                <span className="cv-popup-flag">🇩🇪</span>
                <span className="cv-popup-lang">Deutsch</span>
                <svg className="cv-popup-download" viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                  <polyline points="7 10 12 15 17 10" />
                  <line x1="12" y1="15" x2="12" y2="3" />
                </svg>
              </a>
              <a
                href={cvLinks.EN}
                target="_blank"
                rel="noreferrer"
                className="cv-popup-option"
                onClick={() => setCvPopupOpen(false)}
              >
                <span className="cv-popup-flag">🇬🇧</span>
                <span className="cv-popup-lang">English</span>
                <svg className="cv-popup-download" viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                  <polyline points="7 10 12 15 17 10" />
                  <line x1="12" y1="15" x2="12" y2="3" />
                </svg>
              </a>
            </div>
          </div>
        </div>
      )}
      </div>
    </div>
  )
}

export default App
