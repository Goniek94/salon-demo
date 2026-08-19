# Pracownia Wdzięku i Urody — prototyp systemu

Interaktywna symulacja najważniejszych procesów systemu zarządzania salonem. Projekt prezentuje przepływ
od planu terapii i rezerwacji, przez bilansowanie zasobów i realizację wizyty, po rozliczenie oraz
follow-up CRM.

## Uruchomienie

```bash
npm install
npm run dev
```

Projekt działa na danych demonstracyjnych i nie wymaga backendu.

Po uruchomieniu otwórz `http://localhost:3000`. Polecenie `vinext dev` nie wypisuje osobnej linii
„ready” — jeśli terminal wygląda na zatrzymany, serwer najczęściej już działa.

## Tryb symulacji

Górny pasek („Symulacja na żywo”) prowadzi przez cały scenariusz:

- **Odtwórz** — automatyczne przejście przez wszystkie 12 zdarzeń scenariusza, z przełączaniem ekranów
  i ról bez udziału prowadzącego,
- **Dalej** — jedno zdarzenie do przodu (przydatne przy omawianiu konkretnego ekranu),
- **Reset** — powrót do stanu początkowego,
- **Dziennik** — panel boczny ze śladem wszystkich zdarzeń, także tych zaplanowanych na przyszłość,
- kliknięcie w dowolny z 7 etapów na pasku przeskakuje wprost do niego.

Ten sam scenariusz można też przeklikać ręcznie: przyciski akcji na ekranach (sprawdzenie dostępności,
wybór kombinacji zasobów, zamknięcie rozliczenia) przesuwają symulację o jeden krok.

Stan biznesowy jest funkcją pozycji w scenariuszu, więc przewijanie do przodu i do tyłu, reset oraz
render po stronie serwera zawsze dają ten sam wynik.

## Scenariusz

1. **Start** — klientka ma aktywny plan terapii, ale nie ma kolejnego terminu.
2. **Usługa** — klientka podchodzi do recepcji i mówi, czego chce; recepcja składa wizytę z zabiegów.
3. **Termin** — recepcja klika godzinę 15:00, system ją odrzuca (zajęte Icoone 2) i pokazuje wolne okna.
4. **Obsada** — lista kosmetolożek wolnych o tej godzinie; recepcja przydziela osobę i potwierdza wizytę.
5. **Wizyta** — kosmetolog zapisuje faktycznie wykonany zakres (widok mobilny).
6. **Rozliczenie** — pakiet, karta i podział na Firmę A oraz Firmę B.
7. **Follow-up** — brak rezerwacji uruchamia SMS i zadanie kontaktowe.

## Rezerwacja przy ladzie

Panel po prawej stronie kalendarza jest działającym kreatorem: klient → usługi → termin → obsada.
Można go przeklikać samodzielnie w dowolnym momencie (przycisk „Nowa wizyta”), także dla innej klientki
i innego zestawu zabiegów niż w scenariuszu. Potwierdzona wizyta pojawia się w siatce tygodnia.

Dostępność nie jest zapisana na sztywno. Liczy ją `lib/booking.ts` na podstawie grafiku salonu:

- urządzenie wymagane przez zabieg (Icoone 2, Emtone, Nordlys, ...) i jego zajętość,
- kwalifikacje pracownika oraz jego godziny pracy i inne wizyty,
- wolny gabinet na całą długość wizyty.

Dlatego komunikat „15:00 nie jest wykonalne — Icoone 2 zajęte 14:30–15:20” oraz lista „kto jest wolny”
są wynikiem obliczenia, a nie tekstem wpisanym w widok. Zmiana zestawu zabiegów od razu przelicza
wolne terminy i dostępne osoby.

## Dokumentacja

- architektura: `docs/ARCHITECTURE.md`,
- plan realizacji i rozwoju: `docs/IMPLEMENTATION_PLAN.md`,
- scenariusz rozmowy z klientem: `docs/PRESENTATION_SCRIPT.md`.

## Kontrola jakości

```bash
npm run lint
npm test
```
