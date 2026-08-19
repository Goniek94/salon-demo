import type {
  AutomationEvent,
  LedgerEntry,
  TherapyStep,
  Treatment,
  Visit,
} from "./domain";

export const demoTreatments: Treatment[] = [
  {
    id: "t-icoone",
    name: "Icoone Laser 8F",
    group: "Ciało",
    durationMinutes: 50,
    value: 610,
    company: "Firma A",
    resourceRequirements: ["Icoone 2", "Gabinet zabiegowy", "Kosmetolog Icoone"],
  },
  {
    id: "t-emtone",
    name: "Emtone - 2 partie",
    group: "Ciało",
    durationMinutes: 40,
    value: 550,
    company: "Firma B",
    resourceRequirements: ["Emtone", "Gabinet 3", "Kosmetolog Emtone"],
  },
];

export const demoVisit: Visit = {
  id: "visit-1908",
  clientName: "Anna Kowalska",
  date: "2026-08-19",
  start: "15:00",
  end: "16:30",
  status: "needs-assignment",
  treatments: demoTreatments,
};

export const therapySteps: TherapyStep[] = [
  {
    id: "therapy-1",
    label: "Icoone Laser 8F",
    plannedDate: "2026-05-06",
    completedDate: "2026-05-07",
    status: "completed",
  },
  {
    id: "therapy-2",
    label: "Icoone Laser 8F",
    plannedDate: "2026-06-03",
    completedDate: "2026-06-05",
    status: "completed",
  },
  {
    id: "therapy-3",
    label: "Icoone Laser 8F",
    plannedDate: "2026-07-01",
    completedDate: "2026-07-03",
    status: "completed",
  },
  {
    id: "therapy-4",
    label: "Icoone Laser 8F",
    plannedDate: "2026-08-19",
    status: "current",
  },
  {
    id: "therapy-5",
    label: "Icoone Laser 8F",
    plannedDate: "2026-09-16",
    status: "future",
  },
  {
    id: "therapy-6",
    label: "Icoone Laser 8F",
    plannedDate: "2026-10-14",
    status: "future",
  },
];

export const ledgerEntries: LedgerEntry[] = [
  {
    id: "ledger-1",
    date: "2026-05-06",
    label: "Zakup pakietu Icoone Laser 6 wejść",
    type: "purchase",
    amount: 3660,
    balanceAfter: 6,
  },
  {
    id: "ledger-2",
    date: "2026-05-07",
    label: "Wykorzystanie zabiegu 1/6",
    type: "usage",
    amount: -610,
    balanceAfter: 5,
  },
  {
    id: "ledger-3",
    date: "2026-06-05",
    label: "Wykorzystanie zabiegu 2/6",
    type: "usage",
    amount: -610,
    balanceAfter: 4,
  },
  {
    id: "ledger-4",
    date: "2026-07-03",
    label: "Wykorzystanie zabiegu 3/6",
    type: "usage",
    amount: -610,
    balanceAfter: 3,
  },
];

export const baseAutomationEvents: AutomationEvent[] = [
  {
    id: "auto-1",
    label: "Wizyta zakończona",
    detail: "Zapisano wykonane zabiegi i rozliczenie.",
    status: "done",
    time: "19 sie, 16:34",
  },
  {
    id: "auto-2",
    label: "Plan terapii przeliczony",
    detail: "Kolejny zalecany termin: 16 września 2026.",
    status: "done",
    time: "19 sie, 16:34",
  },
  {
    id: "auto-3",
    label: "Zaproszenie SMS",
    detail: "Wyślij 7 dni przed zalecanym terminem, jeśli nadal brak rezerwacji.",
    status: "scheduled",
    time: "9 wrz, 10:00",
  },
];

export const calendarVisits = [
  {
    id: "cal-1",
    client: "Beata Król",
    service: "Nordlys Light & Bright",
    time: "09:00-10:00",
    room: "Gabinet 1",
    tone: "violet",
  },
  {
    id: "cal-2",
    client: "Marta Zych",
    service: "Red Touch - twarz",
    time: "10:30-11:30",
    room: "Gabinet 2",
    tone: "green",
  },
  {
    id: "cal-3",
    client: "Ewa Lis",
    service: "Emtone - 2 partie",
    time: "12:00-12:40",
    room: "Gabinet 3",
    tone: "blue",
  },
  {
    id: "cal-4",
    client: "Kasia Duda",
    service: "Depilacja laserowa",
    time: "16:00-17:00",
    room: "Gabinet 1",
    tone: "amber",
  },
];

