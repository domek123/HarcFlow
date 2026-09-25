# Baza danych

## Spis treści

- [Opis](#opis)
- [Model domenowy](#model-domenowy)
- [User](#user)
- [Parent](#parent)
- [ScoutProfile](#scoutprofile)
- [ScoutTroop](#scouttroop)
- [ScoutPatrol](#scoutpatrol)
- [ScoutYear](#scoutyear)
- [Event](#event)
- [Attendance](#attendance)
- [UserBadge](#userbadge)
- [ScoutNote](#scoutnote)
- [BadgeStore](#badgestore)
- [InventoryItem](#inventoryitem)
- [Relacje](#relacje)
- [Zasady projektowe](#zasady-projektowe)

---

# Opis

HarcApp wykorzystuje **PostgreSQL** jako główną bazę danych oraz **Prisma ORM** do komunikacji z bazą.

Baza została podzielona na kilka głównych obszarów:

- dane osób,
- członkostwo w drużynach,
- struktura drużyny,
- wydarzenia i frekwencja,
- rozwój harcerzy,
- rodzice i opiekunowie,
- magazyn i wyposażenie.

Najważniejszym założeniem modelu jest rozdzielenie danych dotyczących **osoby** od danych dotyczących jej **członkostwa harcerskiego**.

---

# Model domenowy

Główne zależności w systemie:

```text
User
 │
 ├── ScoutProfile
 │      │
 │      ├── ScoutTroop
 │      │      ├── ScoutPatrol
 │      │      ├── Event
 │      │      ├── BadgeStore
 │      │      └── InventoryItem
 │      │
 │      ├── UserBadge
 │      ├── ScoutNote
 │      └── Attendance
 │                 │
 │                 └── Event
 │                        │
 │                        └── ScoutYear
 │
 └── Parent
```

---

# User

`User` reprezentuje **osobę w systemie**.

Jest niezależny od konta uwierzytelniającego oraz od członkostwa w drużynie.

Dzięki temu osoba może istnieć w HarcApp bez posiadania konta w Supabase Auth.

## Najważniejsze pola

| Pole          | Opis                                               |
| ------------- | -------------------------------------------------- |
| `id`          | Wewnętrzny identyfikator osoby                     |
| `authUserId`  | Opcjonalny identyfikator użytkownika Supabase Auth |
| `email`       | Adres e-mail                                       |
| `phoneNumber` | Numer telefonu                                     |
| `firstName`   | Imię                                               |
| `lastName`    | Nazwisko                                           |
| `birthDate`   | Data urodzenia                                     |
| `pesel`       | Numer PESEL                                        |
| `gender`      | Płeć                                               |
| `role`        | Globalna rola użytkownika w aplikacji              |
| `createdAt`   | Data utworzenia osoby w systemie                   |

## User a Supabase Auth

`User` oraz użytkownik Supabase Auth są dwoma osobnymi bytami.

Powiązanie odbywa się poprzez:

```text
User.authUserId
        │
        └──────> Supabase Auth User
```

`authUserId` może być `NULL`, jeżeli osoba nie posiada jeszcze konta.

Dzięki temu możliwy jest scenariusz:

```text
1. Drużynowy dodaje harcerza do HarcApp
2. Powstaje User
3. Powstaje ScoutProfile
4. Harcerz otrzymuje zaproszenie
5. Tworzone jest konto Supabase Auth
6. authUserId zostaje zapisane w User
```

---

# Parent

`Parent` reprezentuje rodzica lub opiekuna prawnego.

Relacja między `Parent` i `User` jest wiele-do-wielu.

Oznacza to, że:

- jeden rodzic może mieć wiele dzieci,
- jedno dziecko może mieć wielu rodziców.

```text
Parent
 ├── User
 ├── User
 └── User
```

oraz:

```text
User
 ├── Parent
 └── Parent
```

Model przechowuje podstawowe dane kontaktowe:

- imię,
- nazwisko,
- numer telefonu,
- adres e-mail.

---

# ScoutProfile

`ScoutProfile` reprezentuje **członkostwo osoby w drużynie** oraz jej dane harcerskie.

Jest powiązany z jednym `User`.

```text
User
 │
 └── ScoutProfile
```

Relacja `userId @unique` oznacza, że jedna osoba może posiadać maksymalnie jeden profil harcerski.

## Najważniejsze pola

| Pole              | Opis                                 |
| ----------------- | ------------------------------------ |
| `userId`          | Osoba, której dotyczy profil         |
| `troopId`         | Drużyna                              |
| `patrolId`        | Zastęp, jeśli został przypisany      |
| `rank`            | Ranga                                |
| `degree`          | Aktualny stopień                     |
| `function`        | Pełniona funkcja                     |
| `acquiringDegree` | Aktualnie zdobywany stopień          |
| `hasNaramiennik`  | Informacja o posiadaniu naramiennika |
| `joinedAt`        | Data dołączenia do drużyny           |
| `isActive`        | Czy członek jest obecnie aktywny     |

## User a ScoutProfile

Dane zostały rozdzielone według odpowiedzialności:

```text
User
├── dane osobowe
├── dane kontaktowe
├── konto aplikacji
└── relacje rodzinne

ScoutProfile
├── drużyna
├── zastęp
├── stopień
├── ranga
├── funkcja
├── zdobywany stopień
├── naramiennik
└── data dołączenia
```

Dzięki temu dane osoby nie są mieszane z informacjami dotyczącymi jej działalności harcerskiej.

---

# ScoutTroop

`ScoutTroop` reprezentuje drużynę lub inną jednostkę zarządzaną przez HarcApp.

Drużyna posiada:

- członków,
- zastępy,
- wydarzenia,
- magazyn sprawności,
- wyposażenie.

```text
ScoutTroop
 ├── ScoutProfile[]
 ├── ScoutPatrol[]
 ├── Event[]
 ├── BadgeStore[]
 └── InventoryItem[]
```

---

# ScoutPatrol

`ScoutPatrol` reprezentuje zastęp należący do konkretnej drużyny.

Każdy zastęp należy dokładnie do jednej drużyny.

## Unikalność nazwy

Nazwa zastępu jest unikalna **w obrębie drużyny**, a nie całej aplikacji.

Zapewnia to:

```prisma
@@unique([troopId, name])
```

Dzięki temu możliwe jest:

```text
Drużyna A
 └── Wilki

Drużyna B
 └── Wilki
```

ale nie:

```text
Drużyna A
 ├── Wilki
 └── Wilki  ❌
```

## Zbiórki zastępu

Model przechowuje również:

```text
assemblyDay
assemblyTime
```

które opisują standardowy dzień i godzinę zbiórki zastępu.

---

# ScoutYear

`ScoutYear` reprezentuje **globalny rok harcerski**.

Rok harcerski nie należy do konkretnej drużyny.

Przykładowe lata:

```text
2025/2026
2026/2027
2027/2028
```

Każda drużyna korzysta z tych samych rekordów `ScoutYear`.

## Najważniejsze pola

| Pole        | Opis                       |
| ----------- | -------------------------- |
| `id`        | Identyfikator roku         |
| `name`      | Nazwa, np. `2026/2027`     |
| `startDate` | Początek roku harcerskiego |
| `endDate`   | Koniec roku harcerskiego   |

Nazwa roku jest globalnie unikalna.

## Dlaczego rok jest globalny?

Rok harcerski opisuje wspólny okres czasu dla całego systemu.

Przykładowo:

```text
                 2026/2027
                     │
          ┌──────────┴──────────┐
          │                     │
       Drużyna A             Drużyna B
          │                     │
       Wydarzenia            Wydarzenia
```

Pozwala to między innymi na późniejsze tworzenie raportów dotyczących wielu jednostek w ramach tego samego roku harcerskiego.

---

# Event

`Event` reprezentuje wydarzenie organizowane przez drużynę.

Każde wydarzenie należy do:

1. jednej drużyny,
2. jednego roku harcerskiego.

```text
Event
 ├── ScoutTroop
 └── ScoutYear
```

## Najważniejsze pola

| Pole          | Opis                            |
| ------------- | ------------------------------- |
| `troopId`     | Drużyna organizująca wydarzenie |
| `scoutYearId` | Rok harcerski                   |
| `title`       | Nazwa wydarzenia                |
| `description` | Opis                            |
| `startDate`   | Data i czas rozpoczęcia         |
| `endDate`     | Data i czas zakończenia         |
| `location`    | Miejsce wydarzenia              |
| `createdAt`   | Data utworzenia wydarzenia      |

## Przykład

```text
ScoutYear: 2026/2027
       │
       └── Event
            ├── Drużyna: Dzieci Słońca
            ├── Nazwa: Zbiórka drużyny
            ├── Start: 2026-09-19 10:00
            └── Koniec: 2026-09-19 12:00
```

## Indeks

Wydarzenia posiadają indeks:

```prisma
@@index([troopId, scoutYearId, startDate])
```

Jest on przeznaczony między innymi do zapytań typu:

> Pobierz wydarzenia konkretnej drużyny z konkretnego roku harcerskiego, posortowane według daty.

---

# Attendance

`Attendance` reprezentuje obecność konkretnego harcerza na konkretnym wydarzeniu.

Jest to relacja pomiędzy `Event` i `ScoutProfile`.

```text
ScoutProfile
      │
      │
      ↓
 Attendance
      ↑
      │
      │
    Event
```

## Klucz główny

```prisma
@@id([eventId, scoutId])
```

Oznacza to, że jeden harcerz może posiadać tylko jedną obecność dla danego wydarzenia.

Nie jest możliwe utworzenie:

```text
Event A + Scout A
Event A + Scout A  ❌
```

ale możliwe jest:

```text
Event A + Scout A
Event A + Scout B
Event A + Scout C
```

## Statusy

```text
PRESENT
ABSENT
EXCUSED
```

## Rok harcerski

`Attendance` nie posiada własnego `scoutYearId`.

Rok jest określany poprzez wydarzenie:

```text
Attendance
    ↓
Event
    ↓
ScoutYear
```

Dzięki temu informacja o roku nie jest przechowywana wielokrotnie.

---

# UserBadge

`UserBadge` reprezentuje przypisanie sprawności do konkretnego harcerza.

Model przechowuje:

- harcerza,
- identyfikator sprawności,
- status,
- datę ostatniej aktualizacji.

## Klucz główny

```prisma
@@id([profileId, badgeId])
```

Ten sam harcerz nie może mieć dwukrotnie przypisanej tej samej sprawności.

## Statusy

```text
PLANNED
COMPLETED
WON
```

Znaczenie statusów:

| Status      | Znaczenie                         |
| ----------- | --------------------------------- |
| `PLANNED`   | Sprawność zaplanowana do zdobycia |
| `COMPLETED` | Realizacja sprawności zakończona  |
| `WON`       | Sprawność zdobyta                 |

`updatedAt` pozwala określić moment ostatniej zmiany przypisania sprawności.

---

# ScoutNote

`ScoutNote` reprezentuje notatkę dotyczącą konkretnego profilu harcerskiego.

Każda notatka posiada:

- autora,
- profil, którego dotyczy,
- treść,
- datę utworzenia.

```text
User
 │
 │ author
 ↓
ScoutNote
 ↑
 │ profile
 │
ScoutProfile
```

## Przykład zastosowania

```text
ScoutNote
├── author: drużynowy
├── profile: Jan Kowalski
├── content: ...
└── createdAt: ...
```

Notatki są indeksowane według profilu i daty malejąco:

```prisma
@@index([profileId, createdAt(sort: Desc)])
```

Dzięki temu można szybko pobrać najnowsze notatki danego harcerza.

---

# BadgeStore

`BadgeStore` reprezentuje stan magazynowy konkretnej sprawności w drużynie.

Jest to relacja:

```text
ScoutTroop + Badge
```

z dodatkową informacją o ilości.

## Klucz główny

```prisma
@@id([troopId, badgeId])
```

Jedna drużyna może posiadać tylko jeden rekord magazynowy dla konkretnej sprawności.

Przykład:

```text
Drużyna: Dzieci Słońca
Sprawność: Samarytanin
Ilość: 4
```

`updatedAt` przechowuje moment ostatniej zmiany stanu magazynowego.

---

# InventoryItem

`InventoryItem` reprezentuje element wyposażenia należący do drużyny.

Każdy element posiada:

- nazwę,
- ilość,
- typ,
- drużynę.

## Typy wyposażenia

```text
UNIFORM
EQUIPMENT
```

Przykładowe rekordy:

```text
Mundur
 └── UNIFORM
 └── amount: 15

Namiot 4-osobowy
 └── EQUIPMENT
 └── amount: 5
```

---

# Relacje

## Osoba i profil harcerski

```text
User 1 ───── 0..1 ScoutProfile
```

Jedna osoba może mieć maksymalnie jeden profil harcerski.

---

## Drużyna i członkowie

```text
ScoutTroop 1 ───── N ScoutProfile
```

Jeden członek należy do jednej drużyny poprzez `ScoutProfile`.

---

## Drużyna i zastępy

```text
ScoutTroop 1 ───── N ScoutPatrol
```

Każdy zastęp należy do jednej drużyny.

---

## Zastęp i członkowie

```text
ScoutPatrol 1 ───── N ScoutProfile
```

`patrolId` jest opcjonalne, dlatego członek może nie być aktualnie przypisany do żadnego zastępu.

---

## Drużyna i wydarzenia

```text
ScoutTroop 1 ───── N Event
```

---

## Rok harcerski i wydarzenia

```text
ScoutYear 1 ───── N Event
```

Rok harcerski jest globalny i może zawierać wydarzenia wielu drużyn.

---

## Wydarzenie i obecności

```text
Event 1 ───── N Attendance
```

---

## Harcerz i obecności

```text
ScoutProfile 1 ───── N Attendance
```

---

## Rodzice i dzieci

```text
Parent N ───── N User
```

Jedno dziecko może mieć wielu rodziców, a jeden rodzic może być przypisany do wielu dzieci.

---

# Integralność danych

## Drużyna i zastęp

`ScoutProfile` posiada zarówno `troopId`, jak i opcjonalne `patrolId`.

Należy zapewnić, aby przypisywany zastęp należał do tej samej drużyny co profil.

Przykład niepoprawnego stanu:

```text
ScoutProfile
 └── troopId: Troop A
 └── patrolId: Patrol należący do Troop B  ❌
```

Ta reguła powinna być sprawdzana podczas operacji backendowych.

---

## Drużyna i wydarzenie

`Event` posiada bezpośrednie `troopId`.

Pozwala to szybko pobierać wydarzenia konkretnej drużyny bez konieczności przechodzenia przez inne relacje.

---

## Rok wydarzenia

Każde wydarzenie musi mieć przypisany `ScoutYear`.

```text
Event
 └── scoutYearId
```

Rok nie jest przechowywany w `Attendance`, ponieważ można go jednoznacznie ustalić poprzez `Event`.

---

# Usuwanie danych

Relacje wykorzystują różne strategie usuwania w zależności od znaczenia danych.

## Cascade

Dane zależne od nadrzędnego rekordu mogą być usuwane automatycznie.

Przykłady:

```text
User
 └── ScoutProfile
```

oraz:

```text
Event
 └── Attendance
```

Jeżeli usunięcie nadrzędnego rekordu ma usunąć jego dane zależne, stosowane jest `onDelete: Cascade`.

## Restrict

`Event → ScoutYear` wykorzystuje:

```prisma
onDelete: Restrict
```

Oznacza to, że nie można usunąć roku harcerskiego, jeżeli istnieją przypisane do niego wydarzenia.

Chroni to dane historyczne.

---

# Indeksy

W bazie zastosowano indeksy dla często wykonywanych zapytań.

### ScoutProfile

```prisma
@@index([troopId])
@@index([patrolId])
@@index([function])
@@index([troopId, patrolId])
```

Pozwalają między innymi szybko:

- pobierać członków drużyny,
- pobierać członków zastępu,
- filtrować po funkcji,
- pobierać członków konkretnego zastępu w drużynie.

### ScoutPatrol

```prisma
@@unique([troopId, name])
@@index([troopId])
```

### Event

```prisma
@@index([troopId, scoutYearId, startDate])
```

Pozwala efektywnie pobierać wydarzenia według drużyny, roku i daty.

### ScoutNote

```prisma
@@index([profileId, createdAt(sort: Desc)])
```

Pozwala szybko pobierać najnowsze notatki konkretnego harcerza.

---

# Zasady projektowe

## 1. User ≠ ScoutProfile

`User` reprezentuje osobę.

`ScoutProfile` reprezentuje jej członkostwo i dane harcerskie.

Nie należy umieszczać danych organizacyjnych drużyny bezpośrednio w `User`.

---

## 2. ScoutYear jest globalny

`ScoutYear` nie posiada `troopId`.

Ten sam rok harcerski jest wykorzystywany przez wszystkie jednostki:

```text
2026/2027
 ├── Event — Drużyna A
 ├── Event — Drużyna A
 ├── Event — Drużyna B
 └── Event — Drużyna C
```

---

## 3. Attendance zależy od Event

`Attendance` nie przechowuje informacji o roku harcerskim.

Zależność:

```text
Attendance
    ↓
Event
    ↓
ScoutYear
```

Zapobiega to duplikowaniu danych i potencjalnej niespójności.

---

## 4. Dane historyczne powinny być zachowywane

Zakończenie roku harcerskiego nie oznacza usunięcia danych.

Przykład:

```text
2025/2026
 └── historyczne wydarzenia i frekwencja

2026/2027
 └── aktualne wydarzenia i frekwencja
```

Dane mogą być wykorzystywane później do statystyk i raportów.

---

## 5. `isActive` oznacza aktywność profilu

`ScoutProfile.isActive` określa, czy członek jest obecnie aktywny.

Dezaktywacja profilu nie powinna oznaczać usunięcia jego historii.

Przykładowo:

```text
ScoutProfile
 ├── isActive: false
 ├── stare wydarzenia
 ├── historyczne obecności
 ├── zdobyte sprawności
 └── notatki
```

Dzięki temu dane historyczne pozostają dostępne.

---

# Przykładowy przepływ danych

Dodanie wydarzenia:

```text
ScoutTroop
    │
    ├── wybór ScoutYear
    │
    ↓
   Event
    │
    ├── startDate
    ├── endDate
    └── location
    │
    ↓
Attendance
    │
    ├── Scout A → PRESENT
    ├── Scout B → ABSENT
    └── Scout C → EXCUSED
```

Późniejsze zapytanie o frekwencję za rok:

```text
ScoutYear
    ↓
Event[]
    ↓
Attendance[]
    ↓
ScoutProfile
    ↓
statystyki
```

---

# Rozszerzanie modelu

Nowe funkcjonalności powinny być dodawane jako osobne encje, jeżeli posiadają własny cykl życia lub znaczenie biznesowe.

Przykładowo:

```text
ScoutYear
 ├── Event
 ├── WorkPlan
 ├── Camp
 └── Reports
```

Nie należy dodawać `scoutYearId` do każdego modelu tylko dlatego, że dane mogą być wykorzystywane w statystykach za dany rok.

Jeżeli rok można jednoznacznie ustalić przez istniejącą relację, należy wykorzystać tę relację.

Przykład:

```text
Attendance → Event → ScoutYear
```

zamiast:

```text
Attendance
 ├── eventId
 └── scoutYearId
```

---

# Enums

## AttendanceStatus

```text
PRESENT
ABSENT
EXCUSED
```

Określa status obecności na wydarzeniu.

## BadgeStatus

```text
PLANNED
COMPLETED
WON
```

Określa status realizacji sprawności.

## Gender

```text
MALE
FEMALE
```

## Role

```text
USER
ADMIN
```

Określa globalną rolę użytkownika w aplikacji.

## Function

```text
DRUZYNOWY
PRZYBOCZNY
ZASTEPOWY
PODZASTEPOWY
NONE
```

Określa funkcję pełnioną przez członka drużyny.

## Rank

```text
HARCMISTRZ
PODHARCMISTRZ
PRZEWODNIK
NONE
```

## Degree

```text
HR
HO
CW
WYW
ML
DH
NONE
```

## InventoryItemType

```text
UNIFORM
EQUIPMENT
```

Określa kategorię wyposażenia.

---

# Diagram zależności

```text
                              ┌──────────────┐
                              │  ScoutYear   │
                              └──────┬───────┘
                                     │
                                     │ 1:N
                                     ↓
┌──────────┐       ┌──────────────┐       ┌──────────────┐
│   User   │──────▶│ ScoutProfile │──────▶│  ScoutTroop  │
└────┬─────┘ 1:1   └──────┬───────┘ N:1   └──────┬───────┘
     │                    │                       │
     │                    │                       │
     │                    ↓                       ↓
     │              ┌───────────┐          ┌─────────────┐
     │              │ UserBadge │          │ ScoutPatrol │
     │              └───────────┘          └─────────────┘
     │
     │ N:M
     ↓
┌──────────┐
│  Parent  │
└──────────┘

ScoutTroop ──────── Event ──────── ScoutYear
                     │
                     │ 1:N
                     ↓
                Attendance
                     ↑
                     │ N:1
                     │
                ScoutProfile
```

---

# Podsumowanie

Najważniejsze założenia modelu:

1. **`User` reprezentuje osobę**, a `ScoutProfile` jej członkostwo harcerskie.
2. **`ScoutTroop` reprezentuje jednostkę**, która posiada członków, zastępy, wydarzenia i magazyny.
3. **`ScoutYear` jest globalny** dla wszystkich jednostek.
4. **`Event` należy jednocześnie do drużyny i roku harcerskiego.**
5. **`Attendance` zależy od `Event`**, dlatego nie posiada własnego `scoutYearId`.
6. **Historia wydarzeń i obecności jest zachowywana** po zakończeniu roku harcerskiego.
7. **Zastępy mają unikalne nazwy tylko w obrębie swojej drużyny.**
8. **Dane osobowe i dane harcerskie są rozdzielone.**
9. **Indeksy są dodawane przede wszystkim pod rzeczywiste zapytania aplikacji.**
10. **Nowe encje powinny być dodawane wtedy, gdy reprezentują osobny byt biznesowy, a nie tylko dla wygody zapytań.**
