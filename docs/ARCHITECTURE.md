# Architektura prototypu systemu salonu

## Cel

Projekt jest interaktywną symulacją najważniejszych procesów Pracowni Wdzięku i Urody. Ma działać bez backendu, ale jego interfejs, model domenowy i granice modułów są przygotowane tak, aby po akceptacji projektu można było podłączyć produkcyjne API bez przebudowy całego frontendu.

## Zasady domenowe

Prototyp zachowuje rozdzielenie pojęć wskazane w analizie:

- plan terapii nie jest pakietem,
- wizyta planowana nie jest rezerwacją,
- wpłata nie jest rozliczeniem zabiegu,
- dostępność zasobu nie jest jego konkretnym przydziałem,
- salon nie jest firmą rozliczeniową,
- notatka CRM nie jest zadaniem.

Te rozdzielenia będą później odzwierciedlone w osobnych encjach i endpointach backendu.

## Warstwy

1. **Warstwa prezentacji** - ekran demonstracyjny, nawigacja, dialogi i stany wizualne.
2. **Moduły funkcjonalne** - kalendarz, plan dnia, klient, terapia, rozliczenie, CRM i automatyzacje.
3. **Model domenowy** - typy klienta, wizyty, zabiegu, zasobu, planu terapii, pakietu, operacji ledger i zadania.
4. **Port danych** - wspólny kontrakt odczytu i zapisu danych używany przez interfejs.
5. **Adapter demonstracyjny** - dane przykładowe i deterministyczne przejścia scenariusza.
6. **Silnik dostępności** - czysta funkcja licząca wolne terminy i dopuszczalną obsadę na podstawie
   grafiku, kwalifikacji, urządzeń i gabinetów. Nie zależy od interfejsu, więc przenosi się na backend
   bez zmian.

W wersji produkcyjnej adapter demonstracyjny zostanie zastąpiony adapterem HTTP komunikującym się z backendem. Widoki i model funkcjonalny pozostaną bez zmian.

## Moduły prototypu

- **Pulpit prezentacji** - skrót problemów i prowadzenie przez scenariusz.
- **Kalendarz** - wizyta wielozabiegowa, statusy, konflikt zasobów i lista rezerwowa.
- **Plan dnia** - drugi etap planowania: przydział pracownika, gabinetu i urządzenia.
- **Klient i terapia** - regularność, kolejne kroki, pakiety, saldo i alerty.
- **Karta wizyty** - faktycznie wykonane zabiegi oraz cele zabiegowe.
- **Rozliczenie** - mieszane źródła płatności i firmy A/B na poziomie zabiegu.
- **CRM i automatyzacje** - notatki, podsumowanie AI, SMS i zadanie kontaktowe.
- **Widok pracownika** - uproszczony podgląd mobilny aktualnej wizyty.

## Scenariusz stanu

Symulacja przechodzi przez następujące etapy:

1. Klient ma aktywny plan terapii, lecz brak kolejnego terminu.
2. Klientka przy ladzie podaje zabieg; recepcja składa z nich jedną wizytę wielozabiegową.
3. Wybrana godzina zostaje odrzucona, bo wymagane urządzenie jest w tym czasie zajęte.
4. System podaje najbliższe okno, w którym wolne są urządzenie, gabinet i uprawniony pracownik.
5. Recepcja przydziela osobę z listy dostępnych i potwierdza wizytę przy kliencie.
6. Wizyty przyjęte bez wskazania osoby trafiają do planu dnia przygotowywanego dzień wcześniej.
7. Pracownik finalizuje faktyczny zakres wizyty.
8. Jeden zabieg jest rozliczany z pakietu, drugi kartą i przez inną firmę.
9. Brak kolejnej rezerwacji uruchamia zaproszenie SMS, a później zadanie kontaktowe.

Punkty 5 i 6 to dwie równoprawne ścieżki. Rezerwacja „z ulicy” zwykle kończy się natychmiastowym
przydziałem osoby, a termin odległy w czasie zostaje bez obsady do momentu planowania dnia.

## Kierunek produkcyjny

Docelowy backend może zostać zbudowany jako modularny monolit NestJS z PostgreSQL. Automatyzacje i komunikacja będą obsługiwane przez kolejkę zadań, a aktualizacje kalendarza przez kanał czasu rzeczywistego. Pliki i podpisane dokumenty powinny trafić do osobnego magazynu obiektowego.

Prototyp nie implementuje tych usług. Pokazuje ich kontrakty i zachowanie z perspektywy użytkownika.

## Granice prototypu

- brak logowania i prawdziwych uprawnień,
- brak trwałej bazy danych,
- brak wysyłki SMS, e-mail i zapytań AI,
- brak integracji z kasą, terminalem i zewnętrznym kalendarzem,
- brak automatycznego solvera optymalizującego cały grafik,
- brak migracji danych produkcyjnych.

Każda z tych funkcji jest symulowana czytelnym, oznaczonym stanem demonstracyjnym.

