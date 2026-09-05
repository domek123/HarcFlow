enum BadgeCategory {
  CAMPING_AND_NATURE = "Obozownictwo i przyroda",
  MUSIC_AND_EXPRESSION = "Muzyka i ekspresja",
  SPORTS_AND_TOURISM = "Sport, turystyka i rekreacja",
  ART_AND_TECHNOLOGY = "Sztuka i technika",
  SCIENCE_AND_CULTURE = "Nauka i kultura",
  SPIRIT_AND_CHARACTER = "Duch i charakter",
  TEST = "Próba",
}

export interface Badge {
  id: string;
  name: string;
  category: BadgeCategory;
  level: 1 | 2 | 3 | null;
}

export interface BadgeTroopInventory extends Badge {
  quantity: number;
}

export interface UpdateBadgeQuantityInput {
  troopId: string;
  badgeId: string;
  delta: number;
}

export interface BadgeToBuyDTO {
  id: string;
  troopId: string;
  badgeId: string;
  neededCount: number;
  inStock: number;
  toBuyCount: number;
}

export const SCOUT_BADGES: Badge[] = [
  // ==========================================
  // 1. OBOZOWNICTWO I PRZYRODA
  // ==========================================
  {
    id: "plomien",
    name: "Płomień",
    category: BadgeCategory.CAMPING_AND_NATURE,
    level: 1,
  },
  {
    id: "straznik_ognia",
    name: "Strażnik Ognia",
    category: BadgeCategory.CAMPING_AND_NATURE,
    level: 2,
  },
  {
    id: "ogniowiec",
    name: "Ogniowiec",
    category: BadgeCategory.CAMPING_AND_NATURE,
    level: 3,
  },
  {
    id: "obserwator",
    name: "Obserwator",
    category: BadgeCategory.CAMPING_AND_NATURE,
    level: 1,
  },
  {
    id: "terenoznawca",
    name: "Terenoznawca",
    category: BadgeCategory.CAMPING_AND_NATURE,
    level: 2,
  },
  {
    id: "topograf",
    name: "Topograf",
    category: BadgeCategory.CAMPING_AND_NATURE,
    level: 3,
  },
  {
    id: "mistrz_orientacji",
    name: "Mistrz Orientacji",
    category: BadgeCategory.CAMPING_AND_NATURE,
    level: 3,
  },
  {
    id: "higienista",
    name: "Higienista",
    category: BadgeCategory.CAMPING_AND_NATURE,
    level: 1,
  },
  {
    id: "sanitariusz",
    name: "Sanitariusz",
    category: BadgeCategory.CAMPING_AND_NATURE,
    level: 2,
  },
  {
    id: "ratownik",
    name: "Ratownik",
    category: BadgeCategory.CAMPING_AND_NATURE,
    level: 3,
  },
  {
    id: "mistrz_musztry",
    name: "Mistrz Musztry",
    category: BadgeCategory.CAMPING_AND_NATURE,
    level: 1,
  },
  {
    id: "chorazy",
    name: "Chorąży",
    category: BadgeCategory.CAMPING_AND_NATURE,
    level: 2,
  },
  {
    id: "dowodca",
    name: "Dowódca",
    category: BadgeCategory.CAMPING_AND_NATURE,
    level: 3,
  },
  {
    id: "dobosz",
    name: "Dobosz",
    category: BadgeCategory.CAMPING_AND_NATURE,
    level: 3,
  },
  {
    id: "trebacz",
    name: "Trębacz",
    category: BadgeCategory.CAMPING_AND_NATURE,
    level: 3,
  },
  {
    id: "lacznik",
    name: "Łącznik",
    category: BadgeCategory.CAMPING_AND_NATURE,
    level: 1,
  },
  {
    id: "sygnalista",
    name: "Sygnalista",
    category: BadgeCategory.CAMPING_AND_NATURE,
    level: 2,
  },
  {
    id: "lacznosciowiec",
    name: "Łącznościowiec",
    category: BadgeCategory.CAMPING_AND_NATURE,
    level: 3,
  },
  {
    id: "krotkofalarz",
    name: "Krótkofalarz",
    category: BadgeCategory.CAMPING_AND_NATURE,
    level: 3,
  },
  {
    id: "biwakowicz",
    name: "Biwakowicz",
    category: BadgeCategory.CAMPING_AND_NATURE,
    level: 1,
  },
  {
    id: "traper",
    name: "Traper",
    category: BadgeCategory.CAMPING_AND_NATURE,
    level: 2,
  },
  {
    id: "wluczykij",
    name: "Włóczykij",
    category: BadgeCategory.CAMPING_AND_NATURE,
    level: 3,
  },
  {
    id: "polarnik",
    name: "Polarnik",
    category: BadgeCategory.CAMPING_AND_NATURE,
    level: 3,
  },
  {
    id: "sakwa",
    name: "Sakwa",
    category: BadgeCategory.CAMPING_AND_NATURE,
    level: 1,
  },
  {
    id: "gospodarz",
    name: "Gospodarz",
    category: BadgeCategory.CAMPING_AND_NATURE,
    level: 2,
  },
  {
    id: "kwatermistrz",
    name: "Kwatermistrz",
    category: BadgeCategory.CAMPING_AND_NATURE,
    level: 3,
  },
  {
    id: "magazynier",
    name: "Magazynier",
    category: BadgeCategory.CAMPING_AND_NATURE,
    level: 3,
  },
  {
    id: "sobieradek",
    name: "Sobieradek Obozowy",
    category: BadgeCategory.CAMPING_AND_NATURE,
    level: 1,
  },
  {
    id: "zdobnik",
    name: "Zdobnik",
    category: BadgeCategory.CAMPING_AND_NATURE,
    level: 2,
  },
  {
    id: "mistrz_zdobnictwa",
    name: "Mistrz Zdobnictwa",
    category: BadgeCategory.CAMPING_AND_NATURE,
    level: 3,
  },
  {
    id: "technik_obozowy",
    name: "Technik Obozowy",
    category: BadgeCategory.CAMPING_AND_NATURE,
    level: 2,
  },
  {
    id: "wyga_obozowy",
    name: "Wyga Obozowy",
    category: BadgeCategory.CAMPING_AND_NATURE,
    level: 3,
  },
  {
    id: "lekka_stopa",
    name: "Lekka Stopa",
    category: BadgeCategory.CAMPING_AND_NATURE,
    level: 1,
  },
  {
    id: "tropiciel",
    name: "Tropiciel",
    category: BadgeCategory.CAMPING_AND_NATURE,
    level: 2,
  },
  {
    id: "zwiadowca",
    name: "Zwiadowca",
    category: BadgeCategory.CAMPING_AND_NATURE,
    level: 3,
  },
  {
    id: "nieuchwytny",
    name: "Nieuchwytny",
    category: BadgeCategory.CAMPING_AND_NATURE,
    level: 3,
  },
  {
    id: "czujka",
    name: "Czujka",
    category: BadgeCategory.CAMPING_AND_NATURE,
    level: 1,
  },
  {
    id: "wartownik",
    name: "Wartownik",
    category: BadgeCategory.CAMPING_AND_NATURE,
    level: 2,
  },
  {
    id: "dowodca_warty",
    name: "Dowódca Warty",
    category: BadgeCategory.CAMPING_AND_NATURE,
    level: 3,
  },
  {
    id: "bystre_oko",
    name: "Bystre Oko",
    category: BadgeCategory.CAMPING_AND_NATURE,
    level: 1,
  },
  {
    id: "tropiciel_zwierzyny",
    name: "Tropiciel Zwierzyny",
    category: BadgeCategory.CAMPING_AND_NATURE,
    level: 2,
  },
  {
    id: "znawca_zwierzyny",
    name: "Znawca Zwierzyny",
    category: BadgeCategory.CAMPING_AND_NATURE,
    level: 3,
  },
  {
    id: "przyrodnik",
    name: "Przyrodnik",
    category: BadgeCategory.CAMPING_AND_NATURE,
    level: 1,
  },
  {
    id: "botanik",
    name: "Botanik",
    category: BadgeCategory.CAMPING_AND_NATURE,
    level: 2,
  },
  {
    id: "zielarz",
    name: "Zielarz",
    category: BadgeCategory.CAMPING_AND_NATURE,
    level: 3,
  },
  {
    id: "chatka_robinsona",
    name: "Chatka Robinsona",
    category: BadgeCategory.CAMPING_AND_NATURE,
    level: 1,
  },
  {
    id: "lesny_czlowiek",
    name: "Leśny Człowiek",
    category: BadgeCategory.CAMPING_AND_NATURE,
    level: 2,
  },
  {
    id: "rosomak",
    name: "Rosomak",
    category: BadgeCategory.CAMPING_AND_NATURE,
    level: 3,
  },

  // ==========================================
  // 2. MUZYKA I EKSPRESJA
  // ==========================================
  {
    id: "szarpidrut",
    name: "Szarpidrut",
    category: BadgeCategory.MUSIC_AND_EXPRESSION,
    level: 1,
  },
  {
    id: "grajek",
    name: "Grajek",
    category: BadgeCategory.MUSIC_AND_EXPRESSION,
    level: 2,
  },
  {
    id: "gitarzysta",
    name: "Gitarzysta",
    category: BadgeCategory.MUSIC_AND_EXPRESSION,
    level: 3,
  },
  {
    id: "muzykant",
    name: "Muzykant",
    category: BadgeCategory.MUSIC_AND_EXPRESSION,
    level: 1,
  },
  {
    id: "instrumentalista",
    name: "Instrumentalista",
    category: BadgeCategory.MUSIC_AND_EXPRESSION,
    level: 2,
  },
  {
    id: "wirtuoz",
    name: "Wirtuoz",
    category: BadgeCategory.MUSIC_AND_EXPRESSION,
    level: 3,
  },
  {
    id: "akompaniator",
    name: "Akompaniator",
    category: BadgeCategory.MUSIC_AND_EXPRESSION,
    level: 2,
  },
  {
    id: "improwizator",
    name: "Improwizator",
    category: BadgeCategory.MUSIC_AND_EXPRESSION,
    level: 3,
  },
  {
    id: "bebniarz",
    name: "Bębniarz",
    category: BadgeCategory.MUSIC_AND_EXPRESSION,
    level: 2,
  },
  {
    id: "czlowiek_orkiestra",
    name: "Człowiek Orkiestra",
    category: BadgeCategory.MUSIC_AND_EXPRESSION,
    level: 3,
  },
  {
    id: "perkusista",
    name: "Perkusista",
    category: BadgeCategory.MUSIC_AND_EXPRESSION,
    level: 3,
  },
  {
    id: "spiewak",
    name: "Śpiewak",
    category: BadgeCategory.MUSIC_AND_EXPRESSION,
    level: 1,
  },
  {
    id: "zapiewajlo",
    name: "Zapiewajło",
    category: BadgeCategory.MUSIC_AND_EXPRESSION,
    level: 2,
  },
  {
    id: "wokalista",
    name: "Wokalista",
    category: BadgeCategory.MUSIC_AND_EXPRESSION,
    level: 3,
  },
  {
    id: "wodzirej",
    name: "Wodzirej",
    category: BadgeCategory.MUSIC_AND_EXPRESSION,
    level: 3,
  },
  {
    id: "holubiec",
    name: "Hołubiec",
    category: BadgeCategory.MUSIC_AND_EXPRESSION,
    level: 1,
  },
  {
    id: "tancerz",
    name: "Tancerz",
    category: BadgeCategory.MUSIC_AND_EXPRESSION,
    level: 2,
  },
  {
    id: "krol_parkietu",
    name: "Król Parkietu",
    category: BadgeCategory.MUSIC_AND_EXPRESSION,
    level: 3,
  },
  {
    id: "debiutant",
    name: "Debiutant",
    category: BadgeCategory.MUSIC_AND_EXPRESSION,
    level: 1,
  },
  {
    id: "komediant",
    name: "Komediant",
    category: BadgeCategory.MUSIC_AND_EXPRESSION,
    level: 2,
  },
  {
    id: "aktor",
    name: "Aktor",
    category: BadgeCategory.MUSIC_AND_EXPRESSION,
    level: 3,
  },
  {
    id: "gawedziarz",
    name: "Gawędziarz",
    category: BadgeCategory.MUSIC_AND_EXPRESSION,
    level: 2,
  },
  {
    id: "mowca",
    name: "Mówca",
    category: BadgeCategory.MUSIC_AND_EXPRESSION,
    level: 3,
  },

  // ==========================================
  // 3. SPORT, TURYSTYKA I REKREACJA
  // ==========================================
  {
    id: "lazik",
    name: "Łazik",
    category: BadgeCategory.SPORTS_AND_TOURISM,
    level: 1,
  },
  {
    id: "wloczega",
    name: "Włóczęga",
    category: BadgeCategory.SPORTS_AND_TOURISM,
    level: 2,
  },
  {
    id: "wedrowiec",
    name: "Wędrowiec",
    category: BadgeCategory.SPORTS_AND_TOURISM,
    level: 3,
  },
  {
    id: "wskazidroga",
    name: "Wskazidroga",
    category: BadgeCategory.SPORTS_AND_TOURISM,
    level: 2,
  },
  {
    id: "wedrowiec_gorski",
    name: "Wędrowiec Górski",
    category: BadgeCategory.SPORTS_AND_TOURISM,
    level: 3,
  },
  {
    id: "nartobiegacz",
    name: "Nartobiegacz",
    category: BadgeCategory.SPORTS_AND_TOURISM,
    level: 3,
  },
  {
    id: "przewodnik",
    name: "Przewodnik",
    category: BadgeCategory.SPORTS_AND_TOURISM,
    level: 3,
  },
  {
    id: "rowerzysta",
    name: "Rowerzysta",
    category: BadgeCategory.SPORTS_AND_TOURISM,
    level: 1,
  },
  {
    id: "cyklista",
    name: "Cyklista",
    category: BadgeCategory.SPORTS_AND_TOURISM,
    level: 2,
  },
  {
    id: "kolarz",
    name: "Kolarz",
    category: BadgeCategory.SPORTS_AND_TOURISM,
    level: 3,
  },
  {
    id: "kurier_rowerowy",
    name: "Kurier Rowerowy",
    category: BadgeCategory.SPORTS_AND_TOURISM,
    level: 3,
  },
  {
    id: "kijanka",
    name: "Kijanka",
    category: BadgeCategory.SPORTS_AND_TOURISM,
    level: 1,
  },
  {
    id: "plywak",
    name: "Pływak",
    category: BadgeCategory.SPORTS_AND_TOURISM,
    level: 2,
  },
  {
    id: "plywak_doskonaly",
    name: "Pływak Doskonały",
    category: BadgeCategory.SPORTS_AND_TOURISM,
    level: 3,
  },
  {
    id: "delfin",
    name: "Delfin",
    category: BadgeCategory.SPORTS_AND_TOURISM,
    level: 3,
  },
  {
    id: "wodniaka",
    name: "Wodniak",
    category: BadgeCategory.SPORTS_AND_TOURISM,
    level: 1,
  },
  {
    id: "kajakarz",
    name: "Kajakarz",
    category: BadgeCategory.SPORTS_AND_TOURISM,
    level: 2,
  },
  {
    id: "kajakarz_doskonaly",
    name: "Kajakarz Doskonały",
    category: BadgeCategory.SPORTS_AND_TOURISM,
    level: 3,
  },
  {
    id: "kajakarz_gorski",
    name: "Kajakarz Górski",
    category: BadgeCategory.SPORTS_AND_TOURISM,
    level: 3,
  },
  {
    id: "szotmen",
    name: "Szotmen",
    category: BadgeCategory.SPORTS_AND_TOURISM,
    level: 1,
  },
  {
    id: "mlodszy_sternik",
    name: "Młodszy Sternik",
    category: BadgeCategory.SPORTS_AND_TOURISM,
    level: 2,
  },
  {
    id: "sternik",
    name: "Sternik",
    category: BadgeCategory.SPORTS_AND_TOURISM,
    level: 3,
  },
  {
    id: "manewrowy",
    name: "Manewrowy",
    category: BadgeCategory.SPORTS_AND_TOURISM,
    level: 3,
  },
  {
    id: "sportowiec",
    name: "Sportowiec",
    category: BadgeCategory.SPORTS_AND_TOURISM,
    level: 1,
  },
  {
    id: "zawodnik",
    name: "Zawodnik",
    category: BadgeCategory.SPORTS_AND_TOURISM,
    level: 2,
  },
  {
    id: "trener",
    name: "Trener",
    category: BadgeCategory.SPORTS_AND_TOURISM,
    level: 3,
  },
  {
    id: "sedzia",
    name: "Sędzia",
    category: BadgeCategory.SPORTS_AND_TOURISM,
    level: 3,
  },
  {
    id: "organizator_sportowy",
    name: "Organizator Sportowy",
    category: BadgeCategory.SPORTS_AND_TOURISM,
    level: 3,
  },
  {
    id: "truchcik",
    name: "Truchcik",
    category: BadgeCategory.SPORTS_AND_TOURISM,
    level: 1,
  },
  {
    id: "sprinter",
    name: "Sprinter",
    category: BadgeCategory.SPORTS_AND_TOURISM,
    level: 2,
  },
  {
    id: "biegacz",
    name: "Biegacz",
    category: BadgeCategory.SPORTS_AND_TOURISM,
    level: 3,
  },
  {
    id: "gibki",
    name: "Gibki",
    category: BadgeCategory.SPORTS_AND_TOURISM,
    level: 1,
  },
  {
    id: "gimnastyk",
    name: "Gimnastyk",
    category: BadgeCategory.SPORTS_AND_TOURISM,
    level: 2,
  },
  {
    id: "akrobata",
    name: "Akrobata",
    category: BadgeCategory.SPORTS_AND_TOURISM,
    level: 3,
  },
  {
    id: "klama",
    name: "Klama",
    category: BadgeCategory.SPORTS_AND_TOURISM,
    level: 1,
  },
  {
    id: "oblak",
    name: "Oblak",
    category: BadgeCategory.SPORTS_AND_TOURISM,
    level: 2,
  },
  {
    id: "wspinacz",
    name: "Wspinacz",
    category: BadgeCategory.SPORTS_AND_TOURISM,
    level: 3,
  },
  {
    id: "zjazd",
    name: "Zjazd",
    category: BadgeCategory.SPORTS_AND_TOURISM,
    level: 1,
  },
  {
    id: "szus",
    name: "Szus",
    category: BadgeCategory.SPORTS_AND_TOURISM,
    level: 2,
  },
  {
    id: "snowboardzista",
    name: "Snowboardzista",
    category: BadgeCategory.SPORTS_AND_TOURISM,
    level: 3,
  },
  {
    id: "narciarz",
    name: "Narciarz",
    category: BadgeCategory.SPORTS_AND_TOURISM,
    level: 3,
  },
  {
    id: "ploza",
    name: "Płoza",
    category: BadgeCategory.SPORTS_AND_TOURISM,
    level: 1,
  },
  {
    id: "lyzwiarz",
    name: "Łyżwiarz",
    category: BadgeCategory.SPORTS_AND_TOURISM,
    level: 2,
  },
  {
    id: "lyzwiarz_doskonaly",
    name: "Łyżwiarz Doskonały",
    category: BadgeCategory.SPORTS_AND_TOURISM,
    level: 3,
  },
  {
    id: "fuks",
    name: "Fuks",
    category: BadgeCategory.SPORTS_AND_TOURISM,
    level: 1,
  },
  {
    id: "strzelec",
    name: "Strzelec",
    category: BadgeCategory.SPORTS_AND_TOURISM,
    level: 2,
  },
  {
    id: "snajper",
    name: "Snajper",
    category: BadgeCategory.SPORTS_AND_TOURISM,
    level: 3,
  },

  // ==========================================
  // 4. SZTUKA I TECHNIKA
  // ==========================================
  {
    id: "majster",
    name: "Majster",
    category: BadgeCategory.ART_AND_TECHNOLOGY,
    level: 1,
  },
  {
    id: "kreslarz",
    name: "Kreślarz",
    category: BadgeCategory.ART_AND_TECHNOLOGY,
    level: 2,
  },
  {
    id: "technik",
    name: "Technik",
    category: BadgeCategory.ART_AND_TECHNOLOGY,
    level: 2,
  },
  {
    id: "architekt",
    name: "Architekt",
    category: BadgeCategory.ART_AND_TECHNOLOGY,
    level: 3,
  },
  {
    id: "stolarz",
    name: "Stolarz",
    category: BadgeCategory.ART_AND_TECHNOLOGY,
    level: 3,
  },
  {
    id: "mechanik",
    name: "Mechanik",
    category: BadgeCategory.ART_AND_TECHNOLOGY,
    level: 3,
  },
  {
    id: "robotyk",
    name: "Robotyk",
    category: BadgeCategory.ART_AND_TECHNOLOGY,
    level: 3,
  },
  {
    id: "inzynier",
    name: "Inżynier",
    category: BadgeCategory.ART_AND_TECHNOLOGY,
    level: 3,
  },
  {
    id: "diodak",
    name: "Diodak",
    category: BadgeCategory.ART_AND_TECHNOLOGY,
    level: 1,
  },
  {
    id: "elektronik",
    name: "Elektronik",
    category: BadgeCategory.ART_AND_TECHNOLOGY,
    level: 2,
  },
  {
    id: "elektryk",
    name: "Elektryk",
    category: BadgeCategory.ART_AND_TECHNOLOGY,
    level: 2,
  },
  {
    id: "ukladowiec",
    name: "Układowiec",
    category: BadgeCategory.ART_AND_TECHNOLOGY,
    level: 3,
  },
  {
    id: "komputerowiec",
    name: "Komputerowiec",
    category: BadgeCategory.ART_AND_TECHNOLOGY,
    level: 3,
  },
  {
    id: "elektrotechniki",
    name: "Elektrotechnik",
    category: BadgeCategory.ART_AND_TECHNOLOGY,
    level: 3,
  },
  {
    id: "koder",
    name: "Koder",
    category: BadgeCategory.ART_AND_TECHNOLOGY,
    level: 1,
  },
  {
    id: "programista",
    name: "Programista",
    category: BadgeCategory.ART_AND_TECHNOLOGY,
    level: 2,
  },
  {
    id: "webjunior",
    name: "Webjunior",
    category: BadgeCategory.ART_AND_TECHNOLOGY,
    level: 2,
  },
  {
    id: "deweloper",
    name: "Deweloper",
    category: BadgeCategory.ART_AND_TECHNOLOGY,
    level: 3,
  },
  {
    id: "webmaster",
    name: "Webmaster",
    category: BadgeCategory.ART_AND_TECHNOLOGY,
    level: 3,
  },
  {
    id: "administrator",
    name: "Administrator",
    category: BadgeCategory.ART_AND_TECHNOLOGY,
    level: 3,
  },
  {
    id: "plastyk",
    name: "Plastyk",
    category: BadgeCategory.ART_AND_TECHNOLOGY,
    level: 1,
  },
  {
    id: "grafik",
    name: "Grafik",
    category: BadgeCategory.ART_AND_TECHNOLOGY,
    level: 2,
  },
  {
    id: "ilustrator",
    name: "Ilustrator",
    category: BadgeCategory.ART_AND_TECHNOLOGY,
    level: 3,
  },
  {
    id: "rekodzielnik",
    name: "Rękodzielnik",
    category: BadgeCategory.ART_AND_TECHNOLOGY,
    level: 2,
  },
  {
    id: "scenograf",
    name: "Scenograf",
    category: BadgeCategory.ART_AND_TECHNOLOGY,
    level: 3,
  },
  {
    id: "rzeźbiarz",
    name: "Rzeźbiarz",
    category: BadgeCategory.ART_AND_TECHNOLOGY,
    level: 3,
  },
  {
    id: "modelarz",
    name: "Modelarz",
    category: BadgeCategory.ART_AND_TECHNOLOGY,
    level: 3,
  },
  {
    id: "krawiec",
    name: "Krawiec",
    category: BadgeCategory.ART_AND_TECHNOLOGY,
    level: 3,
  },
  {
    id: "migawka",
    name: "Migawka",
    category: BadgeCategory.ART_AND_TECHNOLOGY,
    level: 1,
  },
  {
    id: "fotograf",
    name: "Fotograf",
    category: BadgeCategory.ART_AND_TECHNOLOGY,
    level: 2,
  },
  {
    id: "fotografik",
    name: "Fotografik",
    category: BadgeCategory.ART_AND_TECHNOLOGY,
    level: 3,
  },
  {
    id: "klaps",
    name: "Klaps",
    category: BadgeCategory.ART_AND_TECHNOLOGY,
    level: 1,
  },
  {
    id: "filmowiec",
    name: "Filmowiec",
    category: BadgeCategory.ART_AND_TECHNOLOGY,
    level: 2,
  },
  {
    id: "rezyser",
    name: "Reżyser",
    category: BadgeCategory.ART_AND_TECHNOLOGY,
    level: 3,
  },
  {
    id: "operator_filmowy",
    name: "Operator Filmowy",
    category: BadgeCategory.ART_AND_TECHNOLOGY,
    level: 3,
  },
  {
    id: "animator",
    name: "Animator",
    category: BadgeCategory.ART_AND_TECHNOLOGY,
    level: 3,
  },
  {
    id: "opiekun_zwierzat",
    name: "Opiekun Zwierząt",
    category: BadgeCategory.ART_AND_TECHNOLOGY,
    level: 1,
  },
  {
    id: "hodowca",
    name: "Hodowca",
    category: BadgeCategory.ART_AND_TECHNOLOGY,
    level: 2,
  },
  {
    id: "mistrz_chowu",
    name: "Mistrz Chowu",
    category: BadgeCategory.ART_AND_TECHNOLOGY,
    level: 3,
  },
  {
    id: "akwarysta_terrarysta",
    name: "Akwarysta/Terrarysta",
    category: BadgeCategory.ART_AND_TECHNOLOGY,
    level: 3,
  },
  {
    id: "ogrodnik",
    name: "Ogrodnik",
    category: BadgeCategory.ART_AND_TECHNOLOGY,
    level: 1,
  },
  {
    id: "siewca",
    name: "Siewca",
    category: BadgeCategory.ART_AND_TECHNOLOGY,
    level: 2,
  },
  {
    id: "plantator",
    name: "Plantator",
    category: BadgeCategory.ART_AND_TECHNOLOGY,
    level: 3,
  },
  {
    id: "kuchcik",
    name: "Kuchcik",
    category: BadgeCategory.ART_AND_TECHNOLOGY,
    level: 1,
  },
  {
    id: "kucharz",
    name: "Kucharz",
    category: BadgeCategory.ART_AND_TECHNOLOGY,
    level: 2,
  },
  {
    id: "cukiernik",
    name: "Cukiernik",
    category: BadgeCategory.ART_AND_TECHNOLOGY,
    level: 2,
  },
  {
    id: "wek",
    name: "Wek",
    category: BadgeCategory.ART_AND_TECHNOLOGY,
    level: 2,
  },
  {
    id: "kuchmistrz",
    name: "Kuchmistrz",
    category: BadgeCategory.ART_AND_TECHNOLOGY,
    level: 3,
  },
  {
    id: "cukiermistrz",
    name: "Cukiermistrz",
    category: BadgeCategory.ART_AND_TECHNOLOGY,
    level: 3,
  },
  {
    id: "przetwornik",
    name: "Przetwornik",
    category: BadgeCategory.ART_AND_TECHNOLOGY,
    level: 3,
  },

  // ==========================================
  // 5. NAUKA I KULTURA
  // ==========================================
  {
    id: "eksperymentator",
    name: "Eksperymentator",
    category: BadgeCategory.SCIENCE_AND_CULTURE,
    level: 1,
  },
  {
    id: "fizyk",
    name: "Fizyk",
    category: BadgeCategory.SCIENCE_AND_CULTURE,
    level: 2,
  },
  {
    id: "chemik",
    name: "Chemik",
    category: BadgeCategory.SCIENCE_AND_CULTURE,
    level: 2,
  },
  {
    id: "newton",
    name: "Newton",
    category: BadgeCategory.SCIENCE_AND_CULTURE,
    level: 3,
  },
  {
    id: "mendelejew",
    name: "Mendelejew",
    category: BadgeCategory.SCIENCE_AND_CULTURE,
    level: 3,
  },
  {
    id: "biolog",
    name: "Biolog",
    category: BadgeCategory.SCIENCE_AND_CULTURE,
    level: 2,
  },
  {
    id: "linneusz",
    name: "Linneusz",
    category: BadgeCategory.SCIENCE_AND_CULTURE,
    level: 3,
  },
  {
    id: "obserwator_nieba",
    name: "Obserwator Nieba",
    category: BadgeCategory.SCIENCE_AND_CULTURE,
    level: 1,
  },
  {
    id: "astronom",
    name: "Astronom",
    category: BadgeCategory.SCIENCE_AND_CULTURE,
    level: 2,
  },
  {
    id: "meteorolog",
    name: "Meteorolog",
    category: BadgeCategory.SCIENCE_AND_CULTURE,
    level: 2,
  },
  {
    id: "kopernik",
    name: "Kopernik",
    category: BadgeCategory.SCIENCE_AND_CULTURE,
    level: 3,
  },
  {
    id: "synoptyk",
    name: "Synoptyk",
    category: BadgeCategory.SCIENCE_AND_CULTURE,
    level: 3,
  },
  {
    id: "poszukiwacz",
    name: "Poszukiwacz",
    category: BadgeCategory.SCIENCE_AND_CULTURE,
    level: 1,
  },
  {
    id: "badacz",
    name: "Badacz",
    category: BadgeCategory.SCIENCE_AND_CULTURE,
    level: 2,
  },
  {
    id: "socjolog",
    name: "Socjolog",
    category: BadgeCategory.SCIENCE_AND_CULTURE,
    level: 3,
  },
  {
    id: "moderator",
    name: "Moderator",
    category: BadgeCategory.SCIENCE_AND_CULTURE,
    level: 3,
  },
  {
    id: "skryba",
    name: "Skryba",
    category: BadgeCategory.SCIENCE_AND_CULTURE,
    level: 1,
  },
  {
    id: "kronikarz",
    name: "Kronikarz",
    category: BadgeCategory.SCIENCE_AND_CULTURE,
    level: 2,
  },
  {
    id: "reporter",
    name: "Reporter",
    category: BadgeCategory.SCIENCE_AND_CULTURE,
    level: 3,
  },
  {
    id: "kopista",
    name: "Kopista",
    category: BadgeCategory.SCIENCE_AND_CULTURE,
    level: 2,
  },
  {
    id: "historyk",
    name: "Historyk",
    category: BadgeCategory.SCIENCE_AND_CULTURE,
    level: 3,
  },
  {
    id: "kaligraf",
    name: "Kaligraf",
    category: BadgeCategory.SCIENCE_AND_CULTURE,
    level: 3,
  },
  {
    id: "pioro",
    name: "Pióro",
    category: BadgeCategory.SCIENCE_AND_CULTURE,
    level: 1,
  },
  {
    id: "pisarz",
    name: "Pisarz",
    category: BadgeCategory.SCIENCE_AND_CULTURE,
    level: 2,
  },
  {
    id: "poeta",
    name: "Poeta",
    category: BadgeCategory.SCIENCE_AND_CULTURE,
    level: 3,
  },
  {
    id: "powiesciopisarz",
    name: "Powieściopisarz",
    category: BadgeCategory.SCIENCE_AND_CULTURE,
    level: 3,
  },
  {
    id: "popularyzator",
    name: "Popularyzator",
    category: BadgeCategory.SCIENCE_AND_CULTURE,
    level: 3,
  },
  {
    id: "scenarzysta",
    name: "Scenarzysta",
    category: BadgeCategory.SCIENCE_AND_CULTURE,
    level: 3,
  },
  {
    id: "rozmowka",
    name: "Rozmówka",
    category: BadgeCategory.SCIENCE_AND_CULTURE,
    level: 1,
  },
  {
    id: "tlumacz",
    name: "Tłumacz",
    category: BadgeCategory.SCIENCE_AND_CULTURE,
    level: 2,
  },
  {
    id: "lingwista",
    name: "Lingwista",
    category: BadgeCategory.SCIENCE_AND_CULTURE,
    level: 3,
  },
  {
    id: "zgodny",
    name: "Zgodny",
    category: BadgeCategory.SCIENCE_AND_CULTURE,
    level: 1,
  },
  {
    id: "rozjemca",
    name: "Rozjemca",
    category: BadgeCategory.SCIENCE_AND_CULTURE,
    level: 2,
  },
  {
    id: "mediator",
    name: "Mediator",
    category: BadgeCategory.SCIENCE_AND_CULTURE,
    level: 3,
  },
  {
    id: "swojak",
    name: "Swojak",
    category: BadgeCategory.SCIENCE_AND_CULTURE,
    level: 1,
  },
  {
    id: "niewidzialna_reka",
    name: "Niewidzialna Ręka",
    category: BadgeCategory.SCIENCE_AND_CULTURE,
    level: 2,
  },
  {
    id: "obywatel",
    name: "Obywatel",
    category: BadgeCategory.SCIENCE_AND_CULTURE,
    level: 3,
  },
  {
    id: "zbieracz",
    name: "Zbieracz",
    category: BadgeCategory.SCIENCE_AND_CULTURE,
    level: 1,
  },
  {
    id: "hobbysta",
    name: "Hobbysta",
    category: BadgeCategory.SCIENCE_AND_CULTURE,
    level: 2,
  },
  {
    id: "kolekcjoner",
    name: "Kolekcjoner",
    category: BadgeCategory.SCIENCE_AND_CULTURE,
    level: 3,
  },
  {
    id: "harcownik",
    name: "Harcownik",
    category: BadgeCategory.SCIENCE_AND_CULTURE,
    level: 1,
  },
  {
    id: "taktyk",
    name: "Taktyk",
    category: BadgeCategory.SCIENCE_AND_CULTURE,
    level: 2,
  },
  {
    id: "organizator_gier",
    name: "Organizator Gier",
    category: BadgeCategory.SCIENCE_AND_CULTURE,
    level: 3,
  },
  {
    id: "strateg_terenowy",
    name: "Strateg Terenowy",
    category: BadgeCategory.SCIENCE_AND_CULTURE,
    level: 2,
  },
  {
    id: "tworca_gier",
    name: "Twórca Gier",
    category: BadgeCategory.SCIENCE_AND_CULTURE,
    level: 3,
  },
  {
    id: "arcymistrz",
    name: "Arcymistrz",
    category: BadgeCategory.SCIENCE_AND_CULTURE,
    level: 3,
  },

  // ==========================================
  // 6. DUCH I CHARAKTER
  // ==========================================
  {
    id: "chudy_jastrzab",
    name: "Chudy Jastrząb",
    category: BadgeCategory.SPIRIT_AND_CHARACTER,
    level: 1,
  },
  {
    id: "czarna_pantera",
    name: "Czarna Pantera",
    category: BadgeCategory.SPIRIT_AND_CHARACTER,
    level: 2,
  },
  {
    id: "stary_wilk",
    name: "Stary Wilk",
    category: BadgeCategory.SPIRIT_AND_CHARACTER,
    level: 3,
  },
  {
    id: "kamyk",
    name: "Kamyk",
    category: BadgeCategory.SPIRIT_AND_CHARACTER,
    level: 1,
  },
  {
    id: "glaz",
    name: "Głaz",
    category: BadgeCategory.SPIRIT_AND_CHARACTER,
    level: 2,
  },
  {
    id: "skala",
    name: "Skała",
    category: BadgeCategory.SPIRIT_AND_CHARACTER,
    level: 3,
  },
  {
    id: "ministrant",
    name: "Ministrant",
    category: BadgeCategory.SPIRIT_AND_CHARACTER,
    level: 1,
  },
  {
    id: "ministrant_oltarza",
    name: "Ministrant Ołtarza",
    category: BadgeCategory.SPIRIT_AND_CHARACTER,
    level: 2,
  },
  {
    id: "liturgista",
    name: "Liturgista",
    category: BadgeCategory.SPIRIT_AND_CHARACTER,
    level: 3,
  },
  {
    id: "biblista",
    name: "Biblista",
    category: BadgeCategory.SPIRIT_AND_CHARACTER,
    level: 1,
  },
  {
    id: "librysta",
    name: "Librysta",
    category: BadgeCategory.SPIRIT_AND_CHARACTER,
    level: 2,
  },
  {
    id: "lektor",
    name: "Lektor",
    category: BadgeCategory.SPIRIT_AND_CHARACTER,
    level: 3,
  },
  {
    id: "iskra",
    name: "Iskra",
    category: BadgeCategory.SPIRIT_AND_CHARACTER,
    level: 1,
  },
  {
    id: "zagiew",
    name: "Żagiew",
    category: BadgeCategory.SPIRIT_AND_CHARACTER,
    level: 2,
  },
  {
    id: "luczywo",
    name: "Łuczywo",
    category: BadgeCategory.SPIRIT_AND_CHARACTER,
    level: 3,
  },
  {
    id: "pielgrzym",
    name: "Pielgrzym",
    category: BadgeCategory.SPIRIT_AND_CHARACTER,
    level: 3,
  },

  // ==========================================
  // 7. WYCZYN (PRÓBY)
  // ==========================================
  {
    id: "trzy_piora",
    name: "Trzy pióra",
    category: BadgeCategory.TEST,
    level: null,
  },
  {
    id: "szczwany_lis",
    name: "Szczwany Lis",
    category: BadgeCategory.TEST,
    level: null,
  },
  { id: "lowca", name: "Łowca", category: BadgeCategory.TEST, level: null },
  {
    id: "korona_gor",
    name: "Korona gór",
    category: BadgeCategory.TEST,
    level: null,
  },
  {
    id: "dromader",
    name: "Dromader",
    category: BadgeCategory.TEST,
    level: null,
  },
  {
    id: "maratonczyk",
    name: "Maratończyk",
    category: BadgeCategory.TEST,
    level: null,
  },
  { id: "asceta", name: "Asceta", category: BadgeCategory.TEST, level: null },
  { id: "camino", name: "Camino", category: BadgeCategory.TEST, level: null },
  { id: "spec", name: "Spec", category: BadgeCategory.TEST, level: null },
  { id: "viral", name: "Viral", category: BadgeCategory.TEST, level: null },
  { id: "wieszcz", name: "Wieszcz", category: BadgeCategory.TEST, level: null },
];

export const SCOUT_BADGES_MAP = new Map<string, Badge>(
  SCOUT_BADGES.map((badge) => [badge.id, badge]),
);

export const getBadgeById = (id: string): Badge | undefined => {
  return SCOUT_BADGES_MAP.get(id);
};

export const getBadgesByCategory = (category: BadgeCategory): Badge[] => {
  return SCOUT_BADGES.filter((badge) => badge.category === category);
};

export const getGroupedBadgesByCategory = (): Record<
  BadgeCategory,
  Badge[]
> => {
  const groupedBadges: Record<BadgeCategory, Badge[]> = {
    [BadgeCategory.CAMPING_AND_NATURE]: [],
    [BadgeCategory.MUSIC_AND_EXPRESSION]: [],
    [BadgeCategory.SPORTS_AND_TOURISM]: [],
    [BadgeCategory.ART_AND_TECHNOLOGY]: [],
    [BadgeCategory.SCIENCE_AND_CULTURE]: [],
    [BadgeCategory.SPIRIT_AND_CHARACTER]: [],
    [BadgeCategory.TEST]: [],
  };

  SCOUT_BADGES.forEach((badge) => {
    groupedBadges[badge.category].push(badge);
  });

  return groupedBadges;
};
