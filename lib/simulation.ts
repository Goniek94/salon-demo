/**
 * Silnik symulacji prezentacyjnej.
 *
 * Scenariusz jest lista „beatow” — pojedynczych, deterministycznych zdarzen.
 * Kazdy beat wskazuje ekran, role i narracje, a stan biznesowy (fakty) jest
 * wyliczany wprost z numeru beatu. Dzieki temu przewijanie w przod i w tyl,
 * reset oraz render po stronie serwera daja zawsze ten sam wynik.
 */

export type Role = "admin" | "reception" | "specialist";

export type ScreenId =
  | "overview"
  | "calendar"
  | "planning"
  | "visit"
  | "settlement"
  | "client";

export interface ScenarioStep {
  id: string;
  label: string;
}

export const scenarioSteps: ScenarioStep[] = [
  { id: "start", label: "Start" },
  { id: "usluga", label: "Usługa" },
  { id: "termin", label: "Termin" },
  { id: "obsada", label: "Obsada" },
  { id: "wizyta", label: "Wizyta" },
  { id: "rozliczenie", label: "Rozliczenie" },
  { id: "followup", label: "Follow-up" },
];

export interface ScenarioBeat {
  step: number;
  screen: ScreenId;
  role: Role;
  narration: string;
  holdMs: number;
}

export const scenarioBeats: ScenarioBeat[] = [
  {
    step: 0,
    screen: "overview",
    role: "reception",
    narration: "Anna Kowalska ma aktywny plan terapii, ale nie ma umówionego kolejnego terminu.",
    holdMs: 4200,
  },
  {
    step: 1,
    screen: "calendar",
    role: "reception",
    narration: "Klientka podchodzi do recepcji i prosi o Icoone Laser 8F.",
    holdMs: 4000,
  },
  {
    step: 1,
    screen: "calendar",
    role: "reception",
    narration: "Przy okazji chce Emtone — recepcja dokłada drugi zabieg do tej samej wizyty.",
    holdMs: 4400,
  },
  {
    step: 2,
    screen: "calendar",
    role: "reception",
    narration: "Klientka prosi o godzinę 15:00. Recepcja klika ten termin.",
    holdMs: 4200,
  },
  {
    step: 2,
    screen: "calendar",
    role: "reception",
    narration: "15:00 odpada — Icoone 2 jest zajęte. System pokazuje najbliższy wykonalny termin 15:30.",
    holdMs: 5000,
  },
  {
    step: 3,
    screen: "calendar",
    role: "reception",
    narration: "Kto może wziąć tę wizytę o 15:30: wolne są Marta i Ewa, pozostałe nie mają kwalifikacji.",
    holdMs: 5000,
  },
  {
    step: 3,
    screen: "calendar",
    role: "reception",
    narration: "Recepcja przydziela Martę Nowak i potwierdza wizytę przy kliencie.",
    holdMs: 4400,
  },
  {
    step: 3,
    screen: "planning",
    role: "reception",
    narration: "Plan dnia pokazuje, że środa nadal się spina — nikt nie został bez gabinetu.",
    holdMs: 4600,
  },
  {
    step: 4,
    screen: "visit",
    role: "specialist",
    narration: "Marta otwiera wizytę: ankieta i zgody są aktualne, widoczne przeciwwskazanie.",
    holdMs: 4600,
  },
  {
    step: 4,
    screen: "visit",
    role: "specialist",
    narration: "Faktyczny zakres wizyty: Icoone 8F w całości, Emtone tylko jedna partia.",
    holdMs: 4600,
  },
  {
    step: 5,
    screen: "settlement",
    role: "reception",
    narration: "Rozliczenie obejmuje wyłącznie zabiegi faktycznie wykonane podczas wizyty.",
    holdMs: 4400,
  },
  {
    step: 5,
    screen: "settlement",
    role: "reception",
    narration: "Icoone schodzi z pakietu (Firma A), Emtone płatne kartą 275 zł (Firma B).",
    holdMs: 4600,
  },
  {
    step: 6,
    screen: "client",
    role: "reception",
    narration: "Plan terapii przeliczony po wizycie: kolejny zalecany krok 16 września.",
    holdMs: 4400,
  },
  {
    step: 6,
    screen: "client",
    role: "reception",
    narration: "Brak kolejnej rezerwacji uruchamia zaproszenie SMS i zadanie kontaktowe dla recepcji.",
    holdMs: 5200,
  },
];

export const lastBeat = scenarioBeats.length - 1;

/** Pierwszy beat kazdego etapu — uzywany przy klikaniu w pasek symulacji. */
export const firstBeatOfStep = scenarioSteps.map((_, step) =>
  scenarioBeats.findIndex((beat) => beat.step === step),
);

export interface ScenarioFacts {
  /** wybrano pierwszy zabieg w kreatorze rezerwacji */
  bookingDrafted: boolean;
  /** dolozono drugi zabieg do tej samej wizyty */
  secondServiceChosen: boolean;
  /** recepcja kliknela termin 15:00 */
  slotAttempted: boolean;
  /** system odrzucil 15:00 z powodu zajetego urzadzenia */
  conflictDetected: boolean;
  /** przyjeto wykonalny termin 15:30 */
  slotAccepted: boolean;
  /** widoczna lista dostepnych kosmetologow */
  staffOptionsShown: boolean;
  /** przydzielono konkretna osobe i potwierdzono wizyte */
  assignmentConfirmed: boolean;
  /** plan dnia przejrzany po rezerwacji */
  planningOpen: boolean;
  visitStarted: boolean;
  visitCompleted: boolean;
  settlementOpen: boolean;
  settled: boolean;
  therapyRecalculated: boolean;
  followUpCreated: boolean;
}

/** Stan biznesowy wyliczany wprost z pozycji w scenariuszu. */
export function factsFor(beat: number): ScenarioFacts {
  return {
    bookingDrafted: beat >= 1,
    secondServiceChosen: beat >= 2,
    slotAttempted: beat >= 3,
    conflictDetected: beat >= 3,
    slotAccepted: beat >= 4,
    staffOptionsShown: beat >= 5,
    assignmentConfirmed: beat >= 6,
    planningOpen: beat >= 7,
    visitStarted: beat >= 8,
    visitCompleted: beat >= 9,
    settlementOpen: beat >= 10,
    settled: beat >= 11,
    therapyRecalculated: beat >= 12,
    followUpCreated: beat >= 13,
  };
}

export type JournalTone = "violet" | "blue" | "green" | "orange";

export interface JournalEntry {
  id: string;
  beat: number;
  time: string;
  label: string;
  detail: string;
  tone: JournalTone;
  status: "done" | "scheduled" | "waiting";
}

export const journalEntries: JournalEntry[] = [
  {
    id: "j-1",
    beat: 1,
    time: "18 sie, 11:02",
    label: "Wizyta otwarta w recepcji",
    detail: "Klientka przy ladzie: Anna Kowalska, zabieg Icoone Laser 8F.",
    tone: "violet",
    status: "done",
  },
  {
    id: "j-2",
    beat: 2,
    time: "18 sie, 11:03",
    label: "Drugi zabieg w tej samej wizycie",
    detail: "Emtone — 2 partie. Łączny czas wizyty: 90 minut.",
    tone: "violet",
    status: "done",
  },
  {
    id: "j-3",
    beat: 3,
    time: "18 sie, 11:04",
    label: "Termin 15:00 odrzucony",
    detail: "Icoone 2 zajęte 14:30–15:20 przez wizytę Ewy Lis.",
    tone: "orange",
    status: "done",
  },
  {
    id: "j-4",
    beat: 4,
    time: "18 sie, 11:04",
    label: "Termin 15:30 przyjęty",
    detail: "Pierwsze okno, w którym wolne są urządzenie, gabinet i kosmetolog.",
    tone: "green",
    status: "done",
  },
  {
    id: "j-5",
    beat: 5,
    time: "18 sie, 11:05",
    label: "Dostępne kosmetolożki",
    detail: "Marta Nowak i Ewa Zych. Julia i Kinga bez kwalifikacji Emtone.",
    tone: "blue",
    status: "done",
  },
  {
    id: "j-6",
    beat: 6,
    time: "18 sie, 11:05",
    label: "Wizyta potwierdzona",
    detail: "19 sierpnia 15:30–17:00, Marta Nowak, Gabinet 3.",
    tone: "green",
    status: "done",
  },
  {
    id: "j-7",
    beat: 8,
    time: "19 sie, 15:28",
    label: "Wizyta rozpoczęta",
    detail: "Ankieta i zgody aktualne, przeciwwskazanie odnotowane.",
    tone: "blue",
    status: "done",
  },
  {
    id: "j-8",
    beat: 9,
    time: "19 sie, 16:34",
    label: "Zakres wizyty zapisany",
    detail: "Emtone skrócone do jednej partii — zmiana widoczna w rozliczeniu.",
    tone: "orange",
    status: "done",
  },
  {
    id: "j-9",
    beat: 11,
    time: "19 sie, 16:41",
    label: "Rozliczenie zamknięte",
    detail: "Pakiet: 1 wejście (Firma A) oraz 275 zł kartą (Firma B).",
    tone: "green",
    status: "done",
  },
  {
    id: "j-10",
    beat: 12,
    time: "19 sie, 16:41",
    label: "Plan terapii przeliczony",
    detail: "Kolejny zalecany termin: 16 września 2026.",
    tone: "violet",
    status: "done",
  },
  {
    id: "j-11",
    beat: 13,
    time: "9 wrz, 10:00",
    label: "Zaproszenie SMS",
    detail: "Wysyłka 7 dni przed zalecanym terminem, jeśli nadal brak rezerwacji.",
    tone: "blue",
    status: "scheduled",
  },
  {
    id: "j-12",
    beat: 13,
    time: "12 wrz, 09:00",
    label: "Zadanie dla recepcji",
    detail: "Telefon do klientki, jeśli SMS pozostanie bez reakcji.",
    tone: "orange",
    status: "waiting",
  },
];

export function journalFor(beat: number): JournalEntry[] {
  return journalEntries.filter((entry) => entry.beat <= beat);
}

export interface SimState {
  beat: number;
  playing: boolean;
  screen: ScreenId;
  role: Role;
  drawerOpen: boolean;
  roleMenuOpen: boolean;
}

export const initialSimState: SimState = {
  beat: 0,
  playing: false,
  screen: scenarioBeats[0].screen,
  role: scenarioBeats[0].role,
  drawerOpen: false,
  roleMenuOpen: false,
};

export type SimAction =
  | { type: "TOGGLE_PLAY" }
  | { type: "PAUSE" }
  | { type: "NEXT" }
  | { type: "GO_TO_BEAT"; beat: number }
  | { type: "GO_TO_STEP"; step: number }
  | { type: "RESET" }
  | { type: "SET_SCREEN"; screen: ScreenId }
  | { type: "SET_ROLE"; role: Role }
  | { type: "TOGGLE_ROLE_MENU" }
  | { type: "SET_DRAWER"; open: boolean };

function goToBeat(state: SimState, beat: number, playing: boolean): SimState {
  const index = Math.max(0, Math.min(beat, lastBeat));
  const target = scenarioBeats[index];

  return {
    ...state,
    beat: index,
    screen: target.screen,
    role: target.role,
    roleMenuOpen: false,
    playing,
  };
}

export function simReducer(state: SimState, action: SimAction): SimState {
  switch (action.type) {
    case "TOGGLE_PLAY":
      if (state.beat >= lastBeat) {
        return goToBeat(state, 0, true);
      }

      return { ...state, playing: !state.playing, roleMenuOpen: false };
    case "PAUSE":
      return { ...state, playing: false };
    case "NEXT":
      return goToBeat(state, state.beat + 1, state.playing && state.beat + 1 < lastBeat);
    case "GO_TO_BEAT":
      return goToBeat(state, action.beat, false);
    case "GO_TO_STEP":
      return goToBeat(state, firstBeatOfStep[action.step] ?? 0, false);
    case "RESET":
      return initialSimState;
    case "SET_SCREEN":
      return {
        ...state,
        screen: action.screen,
        role: action.screen === "visit" ? "specialist" : state.role === "specialist" ? "reception" : state.role,
        playing: false,
        roleMenuOpen: false,
      };
    case "SET_ROLE":
      return {
        ...state,
        role: action.role,
        screen:
          action.role === "specialist"
            ? "visit"
            : state.screen === "visit"
              ? "overview"
              : state.screen,
        playing: false,
        roleMenuOpen: false,
      };
    case "TOGGLE_ROLE_MENU":
      return { ...state, roleMenuOpen: !state.roleMenuOpen };
    case "SET_DRAWER":
      return { ...state, drawerOpen: action.open };
    default:
      return state;
  }
}
