# Automatyczna symulacja procesu

Prototyp korzysta z jednego wspólnego stanu demonstracyjnego. Pasek „Symulacja na żywo” pokazuje bieżący
etap i narrację, a „Dziennik” wyjaśnia, co system zrobił w tle — również to, co zaplanował na przyszłość.

Sterowanie: **Odtwórz** (automatyczne przejście przez 14 zdarzeń scenariusza, z przełączaniem ekranów
i ról), **Dalej** (jedno zdarzenie), **Reset**, **Dziennik**. Kliknięcie w dowolny z 7 etapów na pasku
przeskakuje wprost do niego.

Stan biznesowy jest funkcją pozycji w scenariuszu, więc przewijanie w przód i w tył, reset oraz render po
stronie serwera zawsze dają ten sam wynik.

## Scenariusz prezentacyjny

1. **Start** — Anna Kowalska ma aktywny plan terapii (krok 4 z 6), ale nie ma kolejnego terminu.
2. **Usługa** — klientka podchodzi do recepcji i prosi o Icoone Laser 8F; recepcja dokłada Emtone do tej
   samej wizyty. Kreator pokazuje łączny czas 90 minut i wymagane urządzenia.
3. **Termin** — klientka prosi o 15:00. System odrzuca ten termin: Icoone 2 jest zajęte 14:30–15:20 przez
   wizytę Ewy Lis. Najbliższe wykonalne okno to 15:30.
4. **Obsada** — lista osób wolnych o 15:30: Marta Nowak i Ewa Zych. Julia i Kinga są odfiltrowane, bo nie
   mają kwalifikacji Emtone. Recepcja przydziela Martę i potwierdza wizytę przy kliencie.
   Alternatywnie może wybrać „zostaw bez obsady” i przekazać decyzję do planu dnia.
5. **Plan dnia** — środa nadal się spina. Zostaje jedna wizyta przyjęta bez osoby (Marta Zych, 16:00,
   Nordlys); system wskazuje Kingę Bąk jako jedyną wolną osobę z tą kwalifikacją.
6. **Wizyta** — kosmetolog w widoku mobilnym widzi przeciwwskazanie z ankiety (świeża opalenizna) i zapisuje
   faktyczny zakres: Icoone w całości, Emtone tylko jedna partia.
7. **Rozliczenie** — liczone są wyłącznie zabiegi wykonane. Icoone schodzi z pakietu (Firma A), Emtone jest
   płatne kartą 275 zł (Firma B), pominięta partia to 0 zł.
8. **Follow-up** — plan terapii przelicza się na 16 września. Brak rezerwacji uruchamia zaproszenie SMS
   (9 września) i zadanie kontaktowe dla recepcji (12 września).

## Tryb ręczny

Kreator rezerwacji działa niezależnie od scenariusza. Przycisk „Nowa wizyta” zaczyna od pustego stanu:
można wybrać inną klientkę, inny zestaw zabiegów i inny termin. Dostępność liczy się na bieżąco, więc
komunikaty o kolizjach dotyczą faktycznie wybranej konfiguracji. Potwierdzona wizyta pojawia się w siatce
tygodnia. Ruch scenariusza (Odtwórz/Dalej/Reset) przestawia kreator z powrotem na ścieżkę prezentacji.
