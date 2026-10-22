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
- [DegreeTemplate](#degreetemplate)
- [DegreeTemplateTask](#degreetemplatetask)
- [ScoutDegree](#scoutdegree)
- [ScoutDegreeTask](#scoutdegreetask)
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
 │      │      ├── InventoryItem
 │      │      └── DegreeTemplate
 │      │
 │      ├── UserBadge
 │      ├── ScoutNote
 │      ├── Attendance
 │      |── ScoutDegree
 │      |── Event
 │          │
 │          └── ScoutYear
 │
 └── Parent

DegreeTemplate
 ├── DegreeTemplateTask[]
 └── ScoutDegree[]
        └── ScoutDegreeTask[]
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

| Pole              | Opis                                  |
| ----------------- | ------------------------------------- |
| `userId`          | Osoba, której dotyczy profil          |
| `troopId`         | Drużyna                               |
| `patrolId`        | Zastęp, jeśli został przypisany       |
| `rank`            | Stopień instruktorski                 |
| `degree`          | Aktualny stopień harcerski            |
| `function`        | Pełniona funkcja                      |
| `acquiringDegree` | Aktualnie zdobywany stopień harcerski |
| `hasNaramiennik`  | Informacja o posiadaniu naramiennika  |
| `joinedAt`        | Data dołączenia do drużyny            |
| `isActive`        | Czy członek jest obecnie aktywny      |

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

# DegreeTemplate

`DegreeTemplate` reprezentuje szablon stopnia dostępny w konkretnej drużynie.

Szablon określa stopień, jego opis oraz listę zadań, które mogą zostać wykorzystane
podczas rozpoczynania próby przez harcerza.

```text
ScoutTroop
 └── DegreeTemplate
      ├── degree
      ├── description
      ├── isActive
      └── DegreeTemplateTask[]
```

## Najważniejsze pola

| Pole          | Opis                                       |
| ------------- | ------------------------------------------ |
| `id`          | Identyfikator szablonu                     |
| `troopId`     | Drużyna, do której należy szablon          |
| `degree`      | Stopień opisywany przez szablon            |
| `description` | Opcjonalny opis szablonu                   |
| `isActive`    | Czy szablon jest dostępny do wykorzystania |
| `createdAt`   | Data utworzenia                            |
| `updatedAt`   | Data ostatniej aktualizacji                |

## Unikalność

W obrębie jednej drużyny może istnieć tylko jeden szablon dla danego stopnia:

```prisma
@@unique([troopId, degree])
```

Ta sama wartość `degree` może występować w wielu drużynach.

---

# DegreeTemplateTask

`DegreeTemplateTask` reprezentuje zadanie należące do szablonu stopnia.

Zadania są uporządkowane według pola `position`. Usunięcie szablonu usuwa również
jego zadania dzięki relacji `onDelete: Cascade`.

## Najważniejsze pola

| Pole          | Opis                        |
| ------------- | --------------------------- |
| `id`          | Identyfikator zadania       |
| `templateId`  | Szablon stopnia             |
| `description` | Opis zadania                |
| `position`    | Pozycja zadania w szablonie |
| `createdAt`   | Data utworzenia             |
| `updatedAt`   | Data ostatniej aktualizacji |

Zadania są indeksowane po `templateId`, co ułatwia pobieranie kompletnej listy
zadań konkretnego szablonu.

---

# ScoutDegree

`ScoutDegree` reprezentuje indywidualną próbę zdobycia stopnia przez harcerza.

Jest powiązany jednocześnie z profilem harcerza oraz szablonem stopnia:

```text
ScoutProfile
      │
      └── ScoutDegree ──── DegreeTemplate
             │
             └── ScoutDegreeTask[]
```

## Najważniejsze pola

| Pole          | Opis                        |
| ------------- | --------------------------- |
| `id`          | Identyfikator próby         |
| `scoutId`     | Profil harcerza             |
| `degreeId`    | Szablon zdobywanego stopnia |
| `status`      | Status całej próby          |
| `startedAt`   | Data rozpoczęcia próby      |
| `completedAt` | Data ukończenia próby       |
| `orderNumber` | Opcjonalny numer próby      |
| `createdAt`   | Data utworzenia             |
| `updatedAt`   | Data ostatniej aktualizacji |

## Unikalność

Jeden harcerz nie może mieć dwóch prób opartych na tym samym szablonie:

```prisma
@@unique([scoutId, degreeId])
```

## Statusy próby

```text
PREPARED
IN_PROGRESS
COMPLETED
```

Próba posiada indeksy po `scoutId` oraz `degreeId`, co usprawnia pobieranie prób
harcerza i wszystkich prób korzystających z danego szablonu.

---

# ScoutDegreeTask

`ScoutDegreeTask` reprezentuje zadanie w konkretnej, indywidualnej próbie.

Zadania są kopiowane z szablonu do próby, dzięki czemu późniejsze zmiany szablonu
nie zmieniają automatycznie już rozpoczętej próby. Zadanie może również zostać
dodane indywidualnie, bez bezpośredniego odpowiednika w szablonie.

## Najważniejsze pola

| Pole            | Opis                        |
| --------------- | --------------------------- |
| `id`            | Identyfikator zadania       |
| `scoutDegreeId` | Indywidualna próba          |
| `description`   | Opis zadania                |
| `position`      | Pozycja zadania w próbie    |
| `source`        | Źródło zadania              |
| `status`        | Status realizacji           |
| `createdAt`     | Data utworzenia             |
| `updatedAt`     | Data ostatniej aktualizacji |

## Źródło zadania

```text
TEMPLATE
INDIVIDUAL
```

`TEMPLATE` oznacza zadanie pochodzące z `DegreeTemplateTask`, a `INDIVIDUAL`
oznacza zadanie dodane tylko do konkretnej próby.

## Statusy zadania

```text
TODO
SUBMITTED
APPROVED
```

Przejście statusów może wyglądać następująco:

```text
TODO → SUBMITTED → APPROVED
```

Usunięcie próby usuwa również wszystkie jej zadania (`onDelete: Cascade`).

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
Sprawność: Higienista
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

## Drużyna i szablony stopni

```text
ScoutTroop 1 ───── N DegreeTemplate
```

Szablon stopnia należy do jednej drużyny. Nazwa stopnia jest unikalna tylko
w obrębie tej drużyny.

---

## Szablon stopnia i zadania szablonu

```text
DegreeTemplate 1 ───── N DegreeTemplateTask
```

Zadania szablonu są definicją wykorzystywaną przy tworzeniu prób.

---

## Harcerz i próby stopni

```text
ScoutProfile 1 ───── N ScoutDegree
```

Jeden profil może mieć próby różnych stopni. Para `scoutId` i `degreeId` jest
unikalna.

---

## Szablon stopnia i próby

```text
DegreeTemplate 1 ───── N ScoutDegree
```

Próba korzysta z jednego szablonu stopnia, ale jej zadania są przechowywane jako
osobne rekordy `ScoutDegreeTask`.

---

## Próba i zadania próby

```text
ScoutDegree 1 ───── N ScoutDegreeTask
```

Zadania należą do konkretnej próby i mają własny status oraz źródło.

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

oraz dla danych związanych z próbą:

```text
DegreeTemplate
 └── DegreeTemplateTask

ScoutDegree
 └── ScoutDegreeTask
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

### ScoutYear

```prisma
@@index([startDate, endDate])
```

Ułatwia wyszukiwanie oraz filtrowanie lat harcerskich po zakresie dat.

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

### UserBadge

```prisma
@@index([profileId, status])
```

Ułatwia filtrowanie sprawności konkretnego harcerza po statusie.

### DegreeTemplate

```prisma
@@unique([troopId, degree])
@@index([isActive])
```

Zapewnia unikalność szablonu stopnia w drużynie i przyspiesza filtrowanie
aktywnych szablonów.

### DegreeTemplateTask

```prisma
@@index([templateId])
```

### ScoutDegree

```prisma
@@unique([scoutId, degreeId])
@@index([scoutId])
@@index([degreeId])
```

### ScoutDegreeTask

```prisma
@@index([scoutDegreeId])
```

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

## 6. Szablon próby i indywidualna próba to różne dane

`DegreeTemplate` przechowuje wspólną definicję stopnia dla drużyny, natomiast
`ScoutDegree` reprezentuje konkretną próbę konkretnego harcerza.

Zadania próby są niezależnymi kopiami zadań szablonu. Dzięki temu aktualizacja
szablonu nie zmienia automatycznie prób, które już się rozpoczęły.

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

## ScoutDegreeStatus

```text
PREPARED
IN_PROGRESS
COMPLETED
```

Określa etap realizacji próby zdobycia stopnia.

## ScoutDegreeTaskStatus

```text
TODO
SUBMITTED
APPROVED
```

Określa status pojedynczego zadania w próbie.

## ScoutDegreeTaskSource

```text
TEMPLATE
INDIVIDUAL
```

Określa, czy zadanie zostało utworzone na podstawie szablonu stopnia, czy dodane
indywidualnie do konkretnej próby.

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
8. **Szablon stopnia jest oddzielony od indywidualnej próby harcerza.**
9. **Zadania indywidualnej próby są niezależne od późniejszych zmian szablonu.**
