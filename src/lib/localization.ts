import type { LanguageCode } from "@/lib/languages";

export {
  DEFAULT_LANGUAGE,
  LANGUAGES,
  getLanguageAlternates,
  isLanguageCode,
  localizePath,
  resolveLanguage,
  stripLocaleFromPath,
  switchLocalePath
} from "@/lib/languages";
export type { LanguageCode } from "@/lib/languages";

export type LanguageOption = {
  code: LanguageCode;
  label: string;
  short: string;
  flagSrc: string;
  flagAlt: string;
};

export const LANGUAGE_OPTIONS: LanguageOption[] = [
  { code: "en", label: "English (US)", short: "EN", flagSrc: "/images/flags/en.svg", flagAlt: "United States flag" },
  { code: "sq", label: "Shqip (AL)", short: "SQ", flagSrc: "/images/flags/sq.svg", flagAlt: "Albania flag" },
  { code: "mk", label: "Македонски (MK)", short: "MK", flagSrc: "/images/flags/mk.svg", flagAlt: "North Macedonia flag" },
  { code: "de", label: "Deutsch (DE)", short: "DE", flagSrc: "/images/flags/de.svg", flagAlt: "Germany flag" },
  { code: "fr", label: "Francais (FR)", short: "FR", flagSrc: "/images/flags/fr.svg", flagAlt: "France flag" },
  { code: "nl", label: "Nederlands (NL)", short: "NL", flagSrc: "/images/flags/nl.svg", flagAlt: "Netherlands flag" }
];

export const OPEN_GRAPH_LOCALE: Record<LanguageCode, string> = {
  en: "en_US",
  sq: "sq_AL",
  mk: "mk_MK",
  de: "de_DE",
  fr: "fr_FR",
  nl: "nl_NL"
};

type LocaleCopy = {
  languageSwitcher: {
    changeLanguage: string;
    openMenu: string;
    closeMenu: string;
    mobileNavigation: string;
  };
  footer: {
    contactTeam: string;
    explore: string;
    contact: string;
    allRightsReserved: string;
    certifiedSupport: string;
  };
  home: {
    constructionSystems: string;
    heroTitle: string;
    heroDescription: string;
    solutionsPortfolio: string;
    findProductsTitle: string;
    findProductsDescription: string;
    viewAllProducts: string;
    catalogsEyebrow: string;
    downloadCatalogsTitle: string;
    downloadCatalogsDescription: string;
    viewAllCatalogs: string;
    aboutUs: string;
    builtOnStoryTitle: string;
    readMore: string;
    supportEyebrow: string;
    supportTitle: string;
    supportDescription: string;
    requestTechnicalQuote: string;
    viewCatalogs: string;
    aboutImageAlt: string;
  };
  productsPage: {
    eyebrow: string;
    title: string;
    description: string;
    productSingular: string;
    productPlural: string;
    viewCategory: string;
  };
  catalogsPage: {
    eyebrow: string;
    title: string;
    description: string;
    downloadPdf: string;
  };
  contactPage: {
    eyebrow: string;
    title: string;
    description: string;
    directContact: string;
    email: string;
    phone: string;
    fax: string;
    address: string;
    responsePromise: string;
    responsePromiseBody: string;
  };
  corporatePage: {
    eyebrow: string;
  };
  categoryPage: {
    eyebrow: string;
  };
  productPage: {
    keyBenefits: string;
    typicalApplications: string;
    technicalSpecs: string;
    documents: string;
    technicalParameters: string;
    relatedProducts: string;
  };
  productFilters: {
    searchProducts: string;
    searchPlaceholder: string;
    category: string;
    allCategories: string;
    viewProduct: string;
    noResults: string;
  };
  quoteForm: {
    title: string;
    description: string;
    name: string;
    email: string;
    company: string;
    phone: string;
    country: string;
    message: string;
    sendingRequest: string;
    submitting: string;
    sendRequest: string;
    success: string;
    unableToSubmit: string;
    networkError: string;
    nextStepsTitle: string;
    nextStep1: string;
    nextStep2: string;
    nextStep3: string;
    reference: string;
  };
  metadata: {
    defaultTitleSuffix: string;
  };
  api: {
    invalidFormData: string;
    requestSubmitted: string;
    retryRequest: string;
    captchaFailed: string;
    emailNotConfigured: string;
    autoReplySubject: string;
    autoReplyGreeting: string;
    autoReplyThanks: string;
    autoReplyReceived: string;
    autoReplyReference: string;
    autoReplySignature: string;
  };
};

const UI_COPY = {
  en: {
    languageSwitcher: {
      changeLanguage: "Change language",
      openMenu: "Open menu",
      closeMenu: "Close menu",
      mobileNavigation: "Mobile navigation"
    },
    footer: {
      contactTeam: "Contact Team",
      explore: "Explore",
      contact: "Contact",
      allRightsReserved: "All rights reserved.",
      certifiedSupport: "Certified systems with practical technical support."
    },
    home: {
      constructionSystems: "Construction Systems",
      heroTitle: "Reliable Construction Products.",
      heroDescription: "Reliable systems for consistent performance on modern construction projects.",
      solutionsPortfolio: "Solutions Portfolio",
      findProductsTitle: "Find Products by Category",
      findProductsDescription: "Explore core categories and open full product lists with one click.",
      viewAllProducts: "View all products",
      catalogsEyebrow: "Catalogs",
      downloadCatalogsTitle: "Download Technical Catalogues",
      downloadCatalogsDescription: "Open the latest product documentation and download PDF versions directly.",
      viewAllCatalogs: "View all catalogs",
      aboutUs: "About Us",
      builtOnStoryTitle: "Built On A Proven Industry Story",
      readMore: "Read More",
      supportEyebrow: "Technical + Commercial Support",
      supportTitle: "Send your formulation goal and get product recommendation with documents.",
      supportDescription:
        "Share substrate, climate, application method, and desired performance. Our team responds with suitable product options and next-step quote guidance.",
      requestTechnicalQuote: "Request Technical Quote",
      viewCatalogs: "View Catalogs",
      aboutImageAlt: "PEVALIT factory and operations"
    },
    productsPage: {
      eyebrow: "Products",
      title: "Browse Products By Category.",
      description: "Clean category navigation with direct access to full product lists and technical details.",
      productSingular: "product",
      productPlural: "products",
      viewCategory: "View Category"
    },
    catalogsPage: {
      eyebrow: "Catalogs",
      title: "Technical Catalogues, Ready To Download.",
      description: "Open the latest PEVALIT catalogues and download PDF versions directly.",
      downloadPdf: "Download PDF"
    },
    contactPage: {
      eyebrow: "Contact",
      title: "Talk to our team about your production requirements.",
      description:
        "Use the form to send your request and include your application details for a faster technical response.",
      directContact: "Direct Contact",
      email: "Email",
      phone: "Phone",
      fax: "Fax",
      address: "Address",
      responsePromise: "Response Promise",
      responsePromiseBody: "Technical response within one business day for complete quote requests."
    },
    corporatePage: {
      eyebrow: "Corporate"
    },
    categoryPage: {
      eyebrow: "Category"
    },
    productPage: {
      keyBenefits: "Key Benefits",
      typicalApplications: "Typical Applications",
      technicalSpecs: "Technical Specs",
      documents: "Documents",
      technicalParameters: "Technical Parameters",
      relatedProducts: "Related Products"
    },
    productFilters: {
      searchProducts: "Search products",
      searchPlaceholder: "Type application, feature, or product name",
      category: "Category",
      allCategories: "All categories",
      viewProduct: "View Product",
      noResults: "No matching products found. Try a broader search or switch category."
    },
    quoteForm: {
      title: "Request a Quote",
      description:
        "Share your application details and our team will respond with the best-fit recommendation.",
      name: "Name",
      email: "Email",
      company: "Company",
      phone: "Phone",
      country: "Country",
      message: "Message",
      sendingRequest: "Sending your request...",
      submitting: "Submitting...",
      sendRequest: "Send Request",
      success: "Thanks. Your request has been sent successfully.",
      unableToSubmit: "Unable to submit your request right now.",
      networkError: "Network error. Please try again in a moment.",
      nextStepsTitle: "What happens next",
      nextStep1: "1) Technical team reviews your request.",
      nextStep2: "2) You receive recommendation + documentation by email.",
      nextStep3: "3) Commercial quote follows after confirmation.",
      reference: "Reference"
    },
    metadata: {
      defaultTitleSuffix: "Additives and Compounds"
    },
    api: {
      invalidFormData: "Invalid form data.",
      requestSubmitted: "Request submitted.",
      retryRequest: "Please retry your request.",
      captchaFailed: "Captcha verification failed.",
      emailNotConfigured: "Email service is not configured. Set RESEND_API_KEY.",
      autoReplySubject: "We received your request",
      autoReplyGreeting: "Hi",
      autoReplyThanks: "Thanks for contacting PEVALIT.",
      autoReplyReceived:
        "Our team has received your request and will reply with technical feedback and the next steps.",
      autoReplyReference: "Reference ID",
      autoReplySignature: "PEVALIT Team"
    }
  },
  sq: {
    languageSwitcher: {
      changeLanguage: "Ndrysho gjuhën",
      openMenu: "Hap menynë",
      closeMenu: "Mbyll menynë",
      mobileNavigation: "Navigimi mobil"
    },
    footer: {
      contactTeam: "Kontakto ekipin",
      explore: "Eksploro",
      contact: "Kontakt",
      allRightsReserved: "Të gjitha të drejtat e rezervuara.",
      certifiedSupport: "Sisteme të certifikuara me mbështetje teknike praktike."
    },
    home: {
      constructionSystems: "Sisteme ndërtimi",
      heroTitle: "Produkte të besueshme ndërtimi.",
      heroDescription: "Sisteme të besueshme për performancë të qëndrueshme në projektet moderne të ndërtimit.",
      solutionsPortfolio: "Portofoli i zgjidhjeve",
      findProductsTitle: "Gjeni Produktet sipas Kategorisë",
      findProductsDescription:
        "Eksploroni kategoritë kryesore dhe hapni listat e plota të produkteve me një klikim.",
      viewAllProducts: "Shiko të gjitha produktet",
      catalogsEyebrow: "Katalogë",
      downloadCatalogsTitle: "Shkarkoni Katalogët Teknikë",
      downloadCatalogsDescription:
        "Hapni dokumentacionin më të fundit të produkteve dhe shkarkoni versionet PDF drejtpërdrejt.",
      viewAllCatalogs: "Shiko të gjithë katalogët",
      aboutUs: "Rreth nesh",
      builtOnStoryTitle: "Të ndërtuar mbi një histori të dëshmuar në industri",
      readMore: "Lexo më shumë",
      supportEyebrow: "Mbështetje teknike + komerciale",
      supportTitle: "Dërgoni kërkesën tuaj të formulimit dhe merrni rekomandim produkti me dokumente.",
      supportDescription:
        "Ndani substratin, klimën, metodën e aplikimit dhe performancën e dëshiruar. Ekipi ynë përgjigjet me opsione të përshtatshme produktesh dhe udhëzim për ofertën.",
      requestTechnicalQuote: "Kërko ofertë teknike",
      viewCatalogs: "Shiko katalogët",
      aboutImageAlt: "Fabrika dhe operacionet e PEVALIT"
    },
    productsPage: {
      eyebrow: "Produktet",
      title: "Shfletoni produktet sipas kategorisë.",
      description: "Navigim i qartë sipas kategorive me qasje direkte në listat e plota të produkteve dhe detajet teknike.",
      productSingular: "produkt",
      productPlural: "produkte",
      viewCategory: "Shiko kategorinë"
    },
    catalogsPage: {
      eyebrow: "Katalogë",
      title: "Katalogë teknikë, gati për shkarkim.",
      description: "Hapni katalogët më të fundit të PEVALIT dhe shkarkoni versionet PDF drejtpërdrejt.",
      downloadPdf: "Shkarko PDF"
    },
    contactPage: {
      eyebrow: "Kontakt",
      title: "Bisedoni me ekipin tonë për kërkesat tuaja të prodhimit.",
      description:
        "Përdorni formularin për të dërguar kërkesën tuaj dhe shtoni detajet e aplikimit për një përgjigje teknike më të shpejtë.",
      directContact: "Kontakt i drejtpërdrejtë",
      email: "Email",
      phone: "Telefon",
      fax: "Faks",
      address: "Adresa",
      responsePromise: "Premtimi i përgjigjes",
      responsePromiseBody: "Përgjigje teknike brenda një dite pune për kërkesat e plota për ofertë."
    },
    corporatePage: {
      eyebrow: "Korporata"
    },
    categoryPage: {
      eyebrow: "Kategoria"
    },
    productPage: {
      keyBenefits: "Përfitimet kryesore",
      typicalApplications: "Aplikimet tipike",
      technicalSpecs: "Specifikimet teknike",
      documents: "Dokumente",
      technicalParameters: "Parametrat Teknikë",
      relatedProducts: "Produkte të ngjashme"
    },
    productFilters: {
      searchProducts: "Kërko produkte",
      searchPlaceholder: "Shkruani aplikimin, veçorinë ose emrin e produktit",
      category: "Kategoria",
      allCategories: "Të gjitha kategoritë",
      viewProduct: "Shiko produktin",
      noResults: "Nuk u gjet asnjë produkt përputhës. Provoni një kërkim më të gjerë ose ndryshoni kategorinë."
    },
    quoteForm: {
      title: "Kërkoni ofertë",
      description: "Ndani detajet e aplikimit tuaj dhe ekipi ynë do të përgjigjet me rekomandimin më të përshtatshëm.",
      name: "Emri",
      email: "Email",
      company: "Kompania",
      phone: "Telefoni",
      country: "Shteti",
      message: "Mesazhi",
      sendingRequest: "Po dërgojmë kërkesën tuaj...",
      submitting: "Po dërgohet...",
      sendRequest: "Dërgo kërkesën",
      success: "Faleminderit. Kërkesa juaj u dërgua me sukses.",
      unableToSubmit: "Nuk mund ta dërgojmë kërkesën tuaj tani.",
      networkError: "Gabim rrjeti. Ju lutemi provoni sërish pas pak.",
      nextStepsTitle: "Çfarë ndodh më pas",
      nextStep1: "1) Ekipi teknik shqyrton kërkesën tuaj.",
      nextStep2: "2) Merrni rekomandimin dhe dokumentacionin me email.",
      nextStep3: "3) Oferta komerciale vijon pas konfirmimit.",
      reference: "Referenca"
    },
    metadata: {
      defaultTitleSuffix: "Aditivë dhe komponime"
    },
    api: {
      invalidFormData: "Të dhënat e formularit nuk janë të vlefshme.",
      requestSubmitted: "Kërkesa u dorëzua.",
      retryRequest: "Ju lutemi provoni sërish kërkesën tuaj.",
      captchaFailed: "Verifikimi i captcha dështoi.",
      emailNotConfigured: "Shërbimi i emailit nuk është i konfiguruar. Vendosni RESEND_API_KEY.",
      autoReplySubject: "E morëm kërkesën tuaj",
      autoReplyGreeting: "Përshëndetje",
      autoReplyThanks: "Faleminderit që kontaktuat PEVALIT.",
      autoReplyReceived:
        "Ekipi ynë e ka marrë kërkesën tuaj dhe do të përgjigjet me informacion teknik dhe hapat e ardhshëm.",
      autoReplyReference: "ID e referencës",
      autoReplySignature: "Ekipi PEVALIT"
    }
  },
  mk: {
    languageSwitcher: {
      changeLanguage: "Промени јазик",
      openMenu: "Отвори мени",
      closeMenu: "Затвори мени",
      mobileNavigation: "Мобилна навигација"
    },
    footer: {
      contactTeam: "Контактирај го тимот",
      explore: "Истражи",
      contact: "Контакт",
      allRightsReserved: "Сите права се задржани.",
      certifiedSupport: "Сертифицирани системи со практична техничка поддршка."
    },
    home: {
      constructionSystems: "Градежни системи",
      heroTitle: "Сигурни градежни производи.",
      heroDescription: "Сигурни системи за постојани перформанси на современи градежни проекти.",
      solutionsPortfolio: "Портфолио на решенија",
      findProductsTitle: "Пронајдете производи по категорија",
      findProductsDescription: "Истражете ги клучните категории и отворете комплетни листи на производи со еден клик.",
      viewAllProducts: "Види ги сите производи",
      catalogsEyebrow: "Каталози",
      downloadCatalogsTitle: "Преземете технички каталози",
      downloadCatalogsDescription: "Отворете ја најновата документација за производи и преземете PDF верзии директно.",
      viewAllCatalogs: "Види ги сите каталози",
      aboutUs: "За нас",
      builtOnStoryTitle: "Изградени врз докажана индустриска приказна",
      readMore: "Прочитај повеќе",
      supportEyebrow: "Техничка + комерцијална поддршка",
      supportTitle: "Испратете ја вашата формулациска цел и добијте препорака за производ со документи.",
      supportDescription:
        "Споделете подлога, клима, начин на нанесување и посакувани перформанси. Нашиот тим одговара со соодветни производи и насоки за понуда.",
      requestTechnicalQuote: "Побарај техничка понуда",
      viewCatalogs: "Види каталози",
      aboutImageAlt: "Фабриката и работењето на PEVALIT"
    },
    productsPage: {
      eyebrow: "Производи",
      title: "Прелистајте производи по категорија.",
      description: "Јасна навигација по категории со директен пристап до комплетни листи на производи и технички детали.",
      productSingular: "производ",
      productPlural: "производи",
      viewCategory: "Види категорија"
    },
    catalogsPage: {
      eyebrow: "Каталози",
      title: "Технички каталози, подготвени за преземање.",
      description: "Отворете ги најновите каталози на PEVALIT и преземете PDF верзии директно.",
      downloadPdf: "Преземи PDF"
    },
    contactPage: {
      eyebrow: "Контакт",
      title: "Разговарајте со нашиот тим за вашите производствени барања.",
      description:
        "Користете ја формата за да го испратите вашето барање и наведете детали за апликацијата за побрз технички одговор.",
      directContact: "Директен контакт",
      email: "Е-пошта",
      phone: "Телефон",
      fax: "Факс",
      address: "Адреса",
      responsePromise: "Ветување за одговор",
      responsePromiseBody: "Технички одговор во рок од еден работен ден за целосни барања за понуда."
    },
    corporatePage: {
      eyebrow: "Корпоративно"
    },
    categoryPage: {
      eyebrow: "Категорија"
    },
    productPage: {
      keyBenefits: "Клучни придобивки",
      typicalApplications: "Типични примени",
      technicalSpecs: "Технички спецификации",
      documents: "Документи",
      technicalParameters: "Технички параметри",
      relatedProducts: "Поврзани производи"
    },
    productFilters: {
      searchProducts: "Пребарај производи",
      searchPlaceholder: "Внесете примена, карактеристика или име на производ",
      category: "Категорија",
      allCategories: "Сите категории",
      viewProduct: "Види производ",
      noResults: "Не се пронајдени соодветни производи. Обидете се со пошироко пребарување или сменете ја категоријата."
    },
    quoteForm: {
      title: "Побарај понуда",
      description: "Споделете ги деталите за вашата примена и нашиот тим ќе одговори со најсоодветна препорака.",
      name: "Име",
      email: "Е-пошта",
      company: "Компанија",
      phone: "Телефон",
      country: "Држава",
      message: "Порака",
      sendingRequest: "Го испраќаме вашето барање...",
      submitting: "Се испраќа...",
      sendRequest: "Испрати барање",
      success: "Ви благодариме. Вашето барање е успешно испратено.",
      unableToSubmit: "Во моментов не можеме да го испратиме вашето барање.",
      networkError: "Мрежна грешка. Обидете се повторно за момент.",
      nextStepsTitle: "Што следува",
      nextStep1: "1) Техничкиот тим го разгледува вашето барање.",
      nextStep2: "2) Добивате препорака и документација по е-пошта.",
      nextStep3: "3) Комерцијалната понуда следува по потврдата.",
      reference: "Референца"
    },
    metadata: {
      defaultTitleSuffix: "Адитиви и соединенија"
    },
    api: {
      invalidFormData: "Податоците од формата не се валидни.",
      requestSubmitted: "Барањето е поднесено.",
      retryRequest: "Обидете се повторно со вашето барање.",
      captchaFailed: "Верификацијата на captcha не успеа.",
      emailNotConfigured: "Услугата за е-пошта не е конфигурирана. Поставете RESEND_API_KEY.",
      autoReplySubject: "Го примивме вашето барање",
      autoReplyGreeting: "Здраво",
      autoReplyThanks: "Ви благодариме што го контактиравте PEVALIT.",
      autoReplyReceived:
        "Нашиот тим го прими вашето барање и ќе одговори со технички информации и следните чекори.",
      autoReplyReference: "Референтен ID",
      autoReplySignature: "Тимот на PEVALIT"
    }
  },
  de: {
    languageSwitcher: {
      changeLanguage: "Sprache ändern",
      openMenu: "Menü öffnen",
      closeMenu: "Menü schließen",
      mobileNavigation: "Mobile Navigation"
    },
    footer: {
      contactTeam: "Team kontaktieren",
      explore: "Entdecken",
      contact: "Kontakt",
      allRightsReserved: "Alle Rechte vorbehalten.",
      certifiedSupport: "Zertifizierte Systeme mit praxisnaher technischer Unterstützung."
    },
    home: {
      constructionSystems: "Bausysteme",
      heroTitle: "Zuverlässige Bauprodukte.",
      heroDescription: "Zuverlässige Systeme für konstante Leistung bei modernen Bauprojekten.",
      solutionsPortfolio: "Lösungsportfolio",
      findProductsTitle: "Produkte nach Kategorie finden",
      findProductsDescription: "Entdecken Sie die Kernkategorien und öffnen Sie komplette Produktlisten mit einem Klick.",
      viewAllProducts: "Alle Produkte ansehen",
      catalogsEyebrow: "Kataloge",
      downloadCatalogsTitle: "Technische Kataloge herunterladen",
      downloadCatalogsDescription: "Öffnen Sie die aktuelle Produktdokumentation und laden Sie PDF-Versionen direkt herunter.",
      viewAllCatalogs: "Alle Kataloge ansehen",
      aboutUs: "Über uns",
      builtOnStoryTitle: "Auf einer bewährten Branchengeschichte aufgebaut",
      readMore: "Mehr lesen",
      supportEyebrow: "Technischer + kommerzieller Support",
      supportTitle: "Senden Sie Ihr Formulierungsziel und erhalten Sie eine Produktempfehlung mit Unterlagen.",
      supportDescription:
        "Teilen Sie Untergrund, Klima, Verarbeitungsmethode und gewünschte Leistung mit. Unser Team antwortet mit passenden Produktoptionen und Hinweisen für das Angebot.",
      requestTechnicalQuote: "Technisches Angebot anfordern",
      viewCatalogs: "Kataloge ansehen",
      aboutImageAlt: "PEVALIT Werk und Betrieb"
    },
    productsPage: {
      eyebrow: "Produkte",
      title: "Produkte nach Kategorie durchsuchen.",
      description: "Klare Kategorienavigation mit direktem Zugang zu vollständigen Produktlisten und technischen Details.",
      productSingular: "Produkt",
      productPlural: "Produkte",
      viewCategory: "Kategorie ansehen"
    },
    catalogsPage: {
      eyebrow: "Kataloge",
      title: "Technische Kataloge, direkt zum Herunterladen.",
      description: "Öffnen Sie die neuesten PEVALIT-Kataloge und laden Sie PDF-Versionen direkt herunter.",
      downloadPdf: "PDF herunterladen"
    },
    contactPage: {
      eyebrow: "Kontakt",
      title: "Sprechen Sie mit unserem Team über Ihre Produktionsanforderungen.",
      description:
        "Nutzen Sie das Formular, um Ihre Anfrage zu senden, und fügen Sie Anwendungsdetails für eine schnellere technische Rückmeldung hinzu.",
      directContact: "Direkter Kontakt",
      email: "E-Mail",
      phone: "Telefon",
      fax: "Fax",
      address: "Adresse",
      responsePromise: "Antwortversprechen",
      responsePromiseBody: "Technische Rückmeldung innerhalb eines Werktages bei vollständigen Angebotsanfragen."
    },
    corporatePage: {
      eyebrow: "Unternehmen"
    },
    categoryPage: {
      eyebrow: "Kategorie"
    },
    productPage: {
      keyBenefits: "Wesentliche Vorteile",
      typicalApplications: "Typische Anwendungen",
      technicalSpecs: "Technische Daten",
      documents: "Dokumente",
      technicalParameters: "Technische Parameter",
      relatedProducts: "Ähnliche Produkte"
    },
    productFilters: {
      searchProducts: "Produkte suchen",
      searchPlaceholder: "Anwendung, Merkmal oder Produktname eingeben",
      category: "Kategorie",
      allCategories: "Alle Kategorien",
      viewProduct: "Produkt ansehen",
      noResults: "Keine passenden Produkte gefunden. Versuchen Sie eine allgemeinere Suche oder wechseln Sie die Kategorie."
    },
    quoteForm: {
      title: "Angebot anfordern",
      description: "Teilen Sie Ihre Anwendungsdetails mit, und unser Team antwortet mit der passenden Empfehlung.",
      name: "Name",
      email: "E-Mail",
      company: "Unternehmen",
      phone: "Telefon",
      country: "Land",
      message: "Nachricht",
      sendingRequest: "Ihre Anfrage wird gesendet...",
      submitting: "Wird gesendet...",
      sendRequest: "Anfrage senden",
      success: "Danke. Ihre Anfrage wurde erfolgreich gesendet.",
      unableToSubmit: "Ihre Anfrage kann derzeit nicht gesendet werden.",
      networkError: "Netzwerkfehler. Bitte versuchen Sie es gleich noch einmal.",
      nextStepsTitle: "So geht es weiter",
      nextStep1: "1) Das technische Team prüft Ihre Anfrage.",
      nextStep2: "2) Sie erhalten Empfehlung und Unterlagen per E-Mail.",
      nextStep3: "3) Das kommerzielle Angebot folgt nach Ihrer Bestätigung.",
      reference: "Referenz"
    },
    metadata: {
      defaultTitleSuffix: "Additive und Compounds"
    },
    api: {
      invalidFormData: "Ungültige Formulardaten.",
      requestSubmitted: "Anfrage gesendet.",
      retryRequest: "Bitte senden Sie Ihre Anfrage erneut.",
      captchaFailed: "Die Captcha-Prüfung ist fehlgeschlagen.",
      emailNotConfigured: "Der E-Mail-Dienst ist nicht konfiguriert. Setzen Sie RESEND_API_KEY.",
      autoReplySubject: "Wir haben Ihre Anfrage erhalten",
      autoReplyGreeting: "Hallo",
      autoReplyThanks: "Vielen Dank, dass Sie PEVALIT kontaktiert haben.",
      autoReplyReceived:
        "Unser Team hat Ihre Anfrage erhalten und wird mit technischem Feedback und den nächsten Schritten antworten.",
      autoReplyReference: "Referenz-ID",
      autoReplySignature: "PEVALIT Team"
    }
  },
  fr: {
    languageSwitcher: {
      changeLanguage: "Changer de langue",
      openMenu: "Ouvrir le menu",
      closeMenu: "Fermer le menu",
      mobileNavigation: "Navigation mobile"
    },
    footer: {
      contactTeam: "Contacter l'equipe",
      explore: "Explorer",
      contact: "Contact",
      allRightsReserved: "Tous droits reserves.",
      certifiedSupport: "Systemes certifies avec assistance technique pratique."
    },
    home: {
      constructionSystems: "Systemes de construction",
      heroTitle: "Produits de construction fiables.",
      heroDescription: "Systemes fiables pour des performances constantes sur les projets de construction modernes.",
      solutionsPortfolio: "Portefeuille de solutions",
      findProductsTitle: "Trouver les produits par categorie",
      findProductsDescription: "Explorez les categories principales et ouvrez les listes completes de produits en un clic.",
      viewAllProducts: "Voir tous les produits",
      catalogsEyebrow: "Catalogues",
      downloadCatalogsTitle: "Telecharger les catalogues techniques",
      downloadCatalogsDescription: "Ouvrez la documentation produit la plus recente et telechargez directement les versions PDF.",
      viewAllCatalogs: "Voir tous les catalogues",
      aboutUs: "A propos",
      builtOnStoryTitle: "Construit sur une histoire industrielle eprouvee",
      readMore: "Lire la suite",
      supportEyebrow: "Support technique + commercial",
      supportTitle: "Envoyez votre objectif de formulation et recevez une recommandation produit avec documents.",
      supportDescription:
        "Partagez le support, le climat, la methode d'application et les performances souhaitees. Notre equipe repond avec des options produit adaptees et les prochaines etapes de devis.",
      requestTechnicalQuote: "Demander un devis technique",
      viewCatalogs: "Voir les catalogues",
      aboutImageAlt: "Usine et operations PEVALIT"
    },
    productsPage: {
      eyebrow: "Produits",
      title: "Parcourir les produits par categorie.",
      description: "Navigation claire par categorie avec acces direct aux listes completes de produits et aux details techniques.",
      productSingular: "produit",
      productPlural: "produits",
      viewCategory: "Voir la categorie"
    },
    catalogsPage: {
      eyebrow: "Catalogues",
      title: "Catalogues techniques prets a telecharger.",
      description: "Ouvrez les catalogues PEVALIT les plus recents et telechargez directement les versions PDF.",
      downloadPdf: "Telecharger PDF"
    },
    contactPage: {
      eyebrow: "Contact",
      title: "Parlez a notre equipe de vos exigences de production.",
      description:
        "Utilisez le formulaire pour envoyer votre demande et ajoutez les details d'application pour une reponse technique plus rapide.",
      directContact: "Contact direct",
      email: "Email",
      phone: "Telephone",
      fax: "Fax",
      address: "Adresse",
      responsePromise: "Engagement de reponse",
      responsePromiseBody: "Reponse technique sous un jour ouvrable pour les demandes de devis completes."
    },
    corporatePage: {
      eyebrow: "Entreprise"
    },
    categoryPage: {
      eyebrow: "Categorie"
    },
    productPage: {
      keyBenefits: "Avantages cles",
      typicalApplications: "Applications typiques",
      technicalSpecs: "Specifications techniques",
      documents: "Documents",
      technicalParameters: "Parametres techniques",
      relatedProducts: "Produits associes"
    },
    productFilters: {
      searchProducts: "Rechercher des produits",
      searchPlaceholder: "Saisir une application, caracteristique ou nom de produit",
      category: "Categorie",
      allCategories: "Toutes les categories",
      viewProduct: "Voir le produit",
      noResults: "Aucun produit correspondant. Essayez une recherche plus large ou changez de categorie."
    },
    quoteForm: {
      title: "Demander un devis",
      description: "Partagez les details de votre application et notre equipe repondra avec la recommandation la plus adaptee.",
      name: "Nom",
      email: "Email",
      company: "Entreprise",
      phone: "Telephone",
      country: "Pays",
      message: "Message",
      sendingRequest: "Envoi de votre demande...",
      submitting: "Envoi...",
      sendRequest: "Envoyer la demande",
      success: "Merci. Votre demande a ete envoyee avec succes.",
      unableToSubmit: "Impossible d'envoyer votre demande pour le moment.",
      networkError: "Erreur reseau. Veuillez reessayer dans un instant.",
      nextStepsTitle: "Prochaines etapes",
      nextStep1: "1) L'equipe technique examine votre demande.",
      nextStep2: "2) Vous recevez une recommandation et la documentation par email.",
      nextStep3: "3) Le devis commercial suit apres confirmation.",
      reference: "Reference"
    },
    metadata: {
      defaultTitleSuffix: "Additifs et composes"
    },
    api: {
      invalidFormData: "Donnees de formulaire invalides.",
      requestSubmitted: "Demande envoyee.",
      retryRequest: "Veuillez renvoyer votre demande.",
      captchaFailed: "La verification captcha a echoue.",
      emailNotConfigured: "Le service email n'est pas configure. Definissez RESEND_API_KEY.",
      autoReplySubject: "Nous avons recu votre demande",
      autoReplyGreeting: "Bonjour",
      autoReplyThanks: "Merci d'avoir contacte PEVALIT.",
      autoReplyReceived:
        "Notre equipe a recu votre demande et repondra avec un retour technique et les prochaines etapes.",
      autoReplyReference: "ID de reference",
      autoReplySignature: "Equipe PEVALIT"
    }
  },
  nl: {
    languageSwitcher: {
      changeLanguage: "Taal wijzigen",
      openMenu: "Menu openen",
      closeMenu: "Menu sluiten",
      mobileNavigation: "Mobiele navigatie"
    },
    footer: {
      contactTeam: "Team contacteren",
      explore: "Verkennen",
      contact: "Contact",
      allRightsReserved: "Alle rechten voorbehouden.",
      certifiedSupport: "Gecertificeerde systemen met praktische technische ondersteuning."
    },
    home: {
      constructionSystems: "Bouwsystemen",
      heroTitle: "Betrouwbare bouwproducten.",
      heroDescription: "Betrouwbare systemen voor consistente prestaties op moderne bouwprojecten.",
      solutionsPortfolio: "Oplossingenportfolio",
      findProductsTitle: "Producten vinden per categorie",
      findProductsDescription: "Verken de hoofdcategorieen en open volledige productlijsten met een klik.",
      viewAllProducts: "Alle producten bekijken",
      catalogsEyebrow: "Catalogi",
      downloadCatalogsTitle: "Technische catalogi downloaden",
      downloadCatalogsDescription: "Open de nieuwste productdocumentatie en download PDF-versies direct.",
      viewAllCatalogs: "Alle catalogi bekijken",
      aboutUs: "Over ons",
      builtOnStoryTitle: "Gebouwd op een bewezen industrieel verhaal",
      readMore: "Lees meer",
      supportEyebrow: "Technische + commerciele ondersteuning",
      supportTitle: "Stuur uw formulatiedoel en ontvang een productadvies met documenten.",
      supportDescription:
        "Deel ondergrond, klimaat, applicatiemethode en gewenste prestaties. Ons team reageert met passende productopties en vervolgstappen voor de offerte.",
      requestTechnicalQuote: "Technische offerte aanvragen",
      viewCatalogs: "Catalogi bekijken",
      aboutImageAlt: "PEVALIT fabriek en activiteiten"
    },
    productsPage: {
      eyebrow: "Producten",
      title: "Producten per categorie bekijken.",
      description: "Heldere categorienavigatie met directe toegang tot volledige productlijsten en technische details.",
      productSingular: "product",
      productPlural: "producten",
      viewCategory: "Categorie bekijken"
    },
    catalogsPage: {
      eyebrow: "Catalogi",
      title: "Technische catalogi, klaar om te downloaden.",
      description: "Open de nieuwste PEVALIT-catalogi en download PDF-versies direct.",
      downloadPdf: "PDF downloaden"
    },
    contactPage: {
      eyebrow: "Contact",
      title: "Praat met ons team over uw productievereisten.",
      description:
        "Gebruik het formulier om uw aanvraag te versturen en voeg applicatiedetails toe voor een snellere technische reactie.",
      directContact: "Direct contact",
      email: "Email",
      phone: "Telefoon",
      fax: "Fax",
      address: "Adres",
      responsePromise: "Reactiebelofte",
      responsePromiseBody: "Technische reactie binnen een werkdag voor volledige offerteaanvragen."
    },
    corporatePage: {
      eyebrow: "Bedrijf"
    },
    categoryPage: {
      eyebrow: "Categorie"
    },
    productPage: {
      keyBenefits: "Belangrijkste voordelen",
      typicalApplications: "Typische toepassingen",
      technicalSpecs: "Technische specificaties",
      documents: "Documenten",
      technicalParameters: "Technische parameters",
      relatedProducts: "Gerelateerde producten"
    },
    productFilters: {
      searchProducts: "Producten zoeken",
      searchPlaceholder: "Voer toepassing, kenmerk of productnaam in",
      category: "Categorie",
      allCategories: "Alle categorieen",
      viewProduct: "Product bekijken",
      noResults: "Geen overeenkomende producten gevonden. Probeer een bredere zoekopdracht of wissel van categorie."
    },
    quoteForm: {
      title: "Offerte aanvragen",
      description: "Deel uw applicatiedetails en ons team reageert met de best passende aanbeveling.",
      name: "Naam",
      email: "Email",
      company: "Bedrijf",
      phone: "Telefoon",
      country: "Land",
      message: "Bericht",
      sendingRequest: "Uw aanvraag wordt verzonden...",
      submitting: "Verzenden...",
      sendRequest: "Aanvraag verzenden",
      success: "Bedankt. Uw aanvraag is succesvol verzonden.",
      unableToSubmit: "Uw aanvraag kan momenteel niet worden verzonden.",
      networkError: "Netwerkfout. Probeer het zo opnieuw.",
      nextStepsTitle: "Wat gebeurt er nu",
      nextStep1: "1) Het technische team beoordeelt uw aanvraag.",
      nextStep2: "2) U ontvangt advies en documentatie per email.",
      nextStep3: "3) De commerciele offerte volgt na bevestiging.",
      reference: "Referentie"
    },
    metadata: {
      defaultTitleSuffix: "Additieven en compounds"
    },
    api: {
      invalidFormData: "Ongeldige formuliergegevens.",
      requestSubmitted: "Aanvraag verzonden.",
      retryRequest: "Dien uw aanvraag opnieuw in.",
      captchaFailed: "Captcha-verificatie mislukt.",
      emailNotConfigured: "Emailservice is niet geconfigureerd. Stel RESEND_API_KEY in.",
      autoReplySubject: "Wij hebben uw aanvraag ontvangen",
      autoReplyGreeting: "Hallo",
      autoReplyThanks: "Bedankt dat u contact heeft opgenomen met PEVALIT.",
      autoReplyReceived:
        "Ons team heeft uw aanvraag ontvangen en reageert met technisch advies en de volgende stappen.",
      autoReplyReference: "Referentie-ID",
      autoReplySignature: "PEVALIT Team"
    }
  }
} satisfies Record<LanguageCode, LocaleCopy>;

export type UiCopy = (typeof UI_COPY)[LanguageCode];

export function getUiCopy(language: LanguageCode) {
  return UI_COPY[language];
}

export function formatProductCount(language: LanguageCode, count: number) {
  const copy = getUiCopy(language).productsPage;
  return `${count} ${count === 1 ? copy.productSingular : copy.productPlural}`;
}

export function getConstructionSlideAlt(language: LanguageCode, slideNumber: number) {
  switch (language) {
    case "sq":
      return `Slajdi ${slideNumber} i sistemeve të ndërtimit PEVALIT`;
    case "mk":
      return `PEVALIT слајд ${slideNumber} за градежни системи`;
    case "de":
      return `PEVALIT Bausysteme Folie ${slideNumber}`;
    case "fr":
      return `PEVALIT systemes de construction diapositive ${slideNumber}`;
    case "nl":
      return `PEVALIT bouwsystemen dia ${slideNumber}`;
    default:
      return `PEVALIT construction systems slide ${slideNumber}`;
  }
}

export function getProductSummaryFallback(language: LanguageCode, productName: string, categoryName: string) {
  switch (language) {
    case "sq":
      return `${productName} me performancë të qëndrueshme dhe mbështetje teknike për aplikime në kategorinë ${categoryName}.`;
    case "mk":
      return `${productName} со стабилни перформанси и техничка поддршка за примени во категоријата ${categoryName}.`;
    case "de":
      return `${productName} mit stabiler Leistung und technischer Unterstützung für Anwendungen in der Kategorie ${categoryName}.`;
    case "fr":
      return `${productName} avec performances stables et assistance technique pour les applications de la categorie ${categoryName}.`;
    case "nl":
      return `${productName} met stabiele prestaties en technische ondersteuning voor toepassingen in de categorie ${categoryName}.`;
    default:
      return `${productName} with stable performance and technical support for ${categoryName} applications.`;
  }
}

export function getProductSeoDescriptionFallback(language: LanguageCode, productName: string) {
  switch (language) {
    case "sq":
      return `${productName} nga PEVALIT me dokumentacion teknik, aplikime sipas kategorisë dhe mbështetje për ofertë.`;
    case "mk":
      return `${productName} од PEVALIT со техничка документација, примени по категории и поддршка за понуда.`;
    case "de":
      return `${productName} von PEVALIT mit technischer Dokumentation, kategoriespezifischen Anwendungen und Angebotsunterstützung.`;
    case "fr":
      return `${productName} par PEVALIT avec documentation technique, applications par categorie et support devis.`;
    case "nl":
      return `${productName} van PEVALIT met technische documentatie, categoriespecifieke toepassingen en offerteondersteuning.`;
    default:
      return `${productName} by PEVALIT with technical documentation, category-specific applications, and quote support.`;
  }
}

export function getCategorySeoDescription(language: LanguageCode, categoryName: string) {
  switch (language) {
    case "sq":
      return `Produktet e kategorisë ${categoryName} nga PEVALIT me dokumentacion teknik dhe mbështetje për ofertë.`;
    case "mk":
      return `Производи од категоријата ${categoryName} од PEVALIT со техничка документација и поддршка за понуда.`;
    case "de":
      return `Produkte der Kategorie ${categoryName} von PEVALIT mit technischer Dokumentation und Angebotsunterstützung.`;
    case "fr":
      return `Produits de la categorie ${categoryName} par PEVALIT avec documentation technique et support devis.`;
    case "nl":
      return `Producten in de categorie ${categoryName} van PEVALIT met technische documentatie en offerteondersteuning.`;
    default:
      return `${categoryName} category products by PEVALIT with technical documentation and quote support.`;
  }
}

export function formatFooterCopyright(language: LanguageCode, year: number) {
  return `(c) ${year}. ${getUiCopy(language).footer.allRightsReserved}`;
}
