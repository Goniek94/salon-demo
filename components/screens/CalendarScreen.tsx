"use client";

import {
  ArrowLeft,
  ArrowRight,
  Building2,
  CalendarPlus,
  Check,
  ChevronLeft,
  ChevronRight,
  CircleCheckBig,
  Clock,
  Cpu,
  Flame,
  Handshake,
  Info,
  Plus,
  Search,
  Send,
  Sparkles,
  Stethoscope,
  TriangleAlert,
  UserRound,
  Waypoints,
  Zap,
} from "lucide-react";
import { useState } from "react";

import {
  evaluateSlot,
  existingBookings,
  formatHour,
  formatRange,
  serviceById,
  services,
  slotOptions,
  staffById,
  staffOptionsFor,
  totalDuration,
  type Booking,
} from "../../lib/booking";
import { factsFor, type ScenarioFacts } from "../../lib/simulation";

const HOURS = ["09:00", "10:00", "11:00", "12:00", "13:00", "14:00", "15:00", "16:00", "17:00", "18:00", "19:00", "20:00"];
const ROW = 1000 / HOURS.length;
const DEMO_DAY = 2;

const days = [
  { label: "pon", date: "17" },
  { label: "wt", date: "18" },
  { label: "śr", date: "19" },
  { label: "czw", date: "20" },
  { label: "pt", date: "21" },
  { label: "sob", date: "22" },
  { label: "niedz", date: "23" },
];

const clients = [
  { name: "Anna Kowalska", initials: "AK", note: "22 wizyty · pakiet Icoone 3 z 6 wejść" },
  { name: "Beata Król", initials: "BK", note: "8 wizyt · bez pakietu" },
  { name: "Klientka z ulicy", initials: "NK", note: "pierwsza wizyta, brak kartoteki" },
];

const serviceIcons: Record<string, typeof Check> = {
  icoone: Stethoscope,
  emtone: Cpu,
  nordlys: Sparkles,
  redtouch: Flame,
  depilacja: Zap,
  masaz: Handshake,
};

const wizardLabels = ["Klient", "Usługi", "Termin", "Obsada"];

interface Draft {
  step: number;
  clientName: string | null;
  serviceIds: string[];
  /** termin, ktory recepcja kliknela, a system odrzucil */
  rejected: number | null;
  start: number | null;
  staffId: string | null;
  confirmed: boolean;
}

const emptyDraft: Draft = {
  step: 1,
  clientName: null,
  serviceIds: [],
  rejected: null,
  start: null,
  staffId: null,
  confirmed: false,
};

/** Stan kreatora odtworzony z pozycji w scenariuszu. */
function scriptedDraft(facts: ScenarioFacts): Draft {
  if (!facts.bookingDrafted) {
    return emptyDraft;
  }

  return {
    step: facts.staffOptionsShown ? 4 : facts.slotAttempted ? 3 : 2,
    clientName: "Anna Kowalska",
    serviceIds: facts.secondServiceChosen ? ["icoone", "emtone"] : ["icoone"],
    rejected: facts.slotAttempted ? 15 : null,
    start: facts.slotAccepted ? 15.5 : null,
    staffId: facts.assignmentConfirmed ? "marta" : null,
    confirmed: facts.assignmentConfirmed,
  };
}

interface PlacedEvent {
  booking: Booking;
  column: number;
  columns: number;
}

/** Rozklada nachodzace na siebie wizyty obok siebie, jak w prawdziwym kalendarzu. */
function packDay(items: Booking[]): PlacedEvent[] {
  const sorted = [...items].sort((a, b) => a.start - b.start);
  const placed: PlacedEvent[] = [];
  let cluster: PlacedEvent[] = [];
  let clusterEnd = -1;

  const flush = () => {
    for (const item of cluster) {
      item.columns = cluster.length === 0 ? 1 : Math.max(...cluster.map((entry) => entry.column)) + 1;
    }

    placed.push(...cluster);
    cluster = [];
    clusterEnd = -1;
  };

  for (const booking of sorted) {
    if (booking.start >= clusterEnd) {
      flush();
    }

    const taken = new Set(cluster.filter((item) => item.booking.end > booking.start).map((item) => item.column));
    let column = 0;

    while (taken.has(column)) {
      column += 1;
    }

    cluster.push({ booking, column, columns: 1 });
    clusterEnd = Math.max(clusterEnd, booking.end);
  }

  flush();

  return placed;
}

function eventStyle(start: number, end: number, column: number, columns: number) {
  const width = 92 / columns;

  return {
    top: `${(start - 9) * ROW}px`,
    height: `${Math.max((end - start) * ROW - 4, 26)}px`,
    left: `${4 + column * width}%`,
    width: `${width - 1}%`,
  };
}

interface CalendarScreenProps {
  facts: ScenarioFacts;
  beat: number;
  onAdvance: () => void;
}

export function CalendarScreen({ facts, beat, onAdvance }: CalendarScreenProps) {
  const [tab, setTab] = useState<"booking" | "waiting">("booking");
  const [extraBookings, setExtraBookings] = useState<Booking[]>([]);
  const [draft, setDraft] = useState<Draft>(() => scriptedDraft(facts));

  const [syncedBeat, setSyncedBeat] = useState(beat);

  // Ruch scenariusza przestawia kreator; klikanie w kreatorze zmienia go swobodnie.
  if (beat !== syncedBeat) {
    setSyncedBeat(beat);
    setDraft(scriptedDraft(factsFor(beat)));
  }

  const baseBookings = [...existingBookings, ...extraBookings];
  const duration = totalDuration(draft.serviceIds);
  const evaluation = draft.start === null ? null : evaluateSlot(draft.serviceIds, DEMO_DAY, draft.start, baseBookings);
  const room = evaluation?.freeRooms[0] ?? null;

  const draftBooking: Booking | null =
    draft.start !== null && draft.clientName
      ? {
          id: "draft",
          day: DEMO_DAY,
          start: draft.start,
          end: draft.start + duration,
          clientName: draft.clientName,
          serviceIds: draft.serviceIds,
          staffId: draft.staffId && draft.staffId !== "none" ? draft.staffId : "",
          roomId: room?.id ?? "g3",
        }
      : null;

  const rejectedBooking: Booking | null =
    draft.rejected !== null && draft.start === null && draft.clientName
      ? {
          id: "rejected",
          day: DEMO_DAY,
          start: draft.rejected,
          end: draft.rejected + duration,
          clientName: draft.clientName,
          serviceIds: draft.serviceIds,
          staffId: "",
          roomId: "",
        }
      : null;

  const update = (patch: Partial<Draft>) => setDraft((current) => ({ ...current, ...patch }));

  const pickSlot = (start: number, feasible: boolean) => {
    if (feasible) {
      update({ start, step: 4, staffId: null, confirmed: false });
    } else {
      update({ rejected: start, start: null, staffId: null, confirmed: false });
    }
  };

  const confirmVisit = () => {
    if (draft.start === null || !draft.clientName) {
      return;
    }

    setExtraBookings((current) => [
      ...current,
      {
        id: `local-${current.length + 1}`,
        day: DEMO_DAY,
        start: draft.start as number,
        end: (draft.start as number) + duration,
        clientName: draft.clientName as string,
        serviceIds: draft.serviceIds,
        staffId: draft.staffId && draft.staffId !== "none" ? draft.staffId : "",
        roomId: room?.id ?? "g3",
      },
    ]);
    setDraft(emptyDraft);
  };

  // Dopoki uzytkownik nie zmieni nic recznie, kreator idzie sciezka scenariusza.
  const isScripted = JSON.stringify(draft) === JSON.stringify(scriptedDraft(facts));
  const scriptedCta =
    [
      "Zestaw wizytę Anny Kowalskiej",
      "Dołóż drugi zabieg (Emtone)",
      "Kliknij termin 15:00",
      "Pokaż najbliższy wolny termin",
      "Sprawdź, kto jest wolny",
      "Przydziel Martę i potwierdź",
    ][beat] ?? "Dalej";

  const dayItems = (day: number): Booking[] => {
    const items = baseBookings.filter((booking) => booking.day === day);

    if (day !== DEMO_DAY) {
      return items;
    }

    if (rejectedBooking) {
      items.push(rejectedBooking);
    }

    if (draftBooking) {
      items.push(draftBooking);
    }

    return items;
  };

  const eventClass = (booking: Booking) => {
    if (booking.id === "rejected") {
      return "week-event event-rejected";
    }

    if (booking.id === "draft") {
      return draft.confirmed
        ? "week-event demo-created-event event-violet"
        : "week-event demo-created-event event-planned";
    }

    if (booking.id.startsWith("local-")) {
      return "week-event demo-created-event event-violet";
    }

    return `week-event ${serviceById(booking.serviceIds[0])?.tone ?? "event-violet"}`;
  };

  return (
    <div className="calendar-screen">
      <div className="calendar-toolbar-main">
        <div className="toolbar-segment">
          <button type="button">Dzień</button>
          <button type="button" className="is-active">
            Tydzień
          </button>
          <button type="button">Zasoby</button>
        </div>

        <div className="calendar-date-nav">
          <button type="button" aria-label="Poprzedni tydzień">
            <ChevronLeft aria-hidden="true" />
          </button>
          <strong>
            17–23 sierpnia 2026 <span>tydzień 34</span>
          </strong>
          <button type="button" aria-label="Następny tydzień">
            <ChevronRight aria-hidden="true" />
          </button>
        </div>

        <div className="calendar-actions">
          <button type="button" className="secondary-button">
            <Search aria-hidden="true" /> Szukaj terminu
          </button>
          <button
            type="button"
            className="primary-button"
            onClick={() => {
              setTab("booking");
              setDraft(emptyDraft);
            }}
          >
            <Plus aria-hidden="true" /> Nowa wizyta
          </button>
        </div>
      </div>

      <div className="calendar-body">
        <div className="week-calendar">
          <div className="week-header">
            <div />
            {days.map((day, index) => (
              <div className={index === 1 ? "is-today" : ""} key={day.date}>
                <strong>{day.date}</strong>
                <span>{day.label}</span>
              </div>
            ))}
          </div>

          <div className="week-grid">
            <div className="week-times">
              {HOURS.map((hour) => (
                <span key={hour}>{hour}</span>
              ))}
            </div>

            {days.map((day, dayIndex) => (
              <div className="day-column" key={day.date}>
                {packDay(dayItems(dayIndex)).map(({ booking, column, columns }) => (
                  <div
                    className={eventClass(booking)}
                    style={eventStyle(booking.start, booking.end, column, columns)}
                    key={booking.id}
                  >
                    <small>{formatRange(booking.start, booking.end)}</small>
                    <strong>{booking.clientName}</strong>
                    <span>
                      {columns >= 3 || booking.end - booking.start < 0.85
                        ? ""
                        : booking.serviceIds.map((id) => serviceById(id)?.name).join(" + ")}
                      {booking.staffId ? ` · ${staffById(booking.staffId)?.name}` : ""}
                      {booking.id === "rejected" ? " · termin niewykonalny" : ""}
                      {booking.id === "draft" && !draft.confirmed ? " · w przygotowaniu" : ""}
                    </span>
                  </div>
                ))}
              </div>
            ))}

            <div className="current-time-line" style={{ top: `${(14.33 - 9) * ROW}px` }}>
              <span>14:20</span>
            </div>
          </div>

          <div className="calendar-legend">
            <span>
              <i className="legend-violet" /> Ciało
            </span>
            <span>
              <i className="legend-green" /> Depilacja i masaż
            </span>
            <span>
              <i className="legend-blue" /> Twarz
            </span>
            <span>
              <i className="legend-gray" /> Wizyta w przygotowaniu
            </span>
            <div>
              <button type="button" className="square-button" aria-label="Ustawienia widoku">
                <Waypoints aria-hidden="true" />
              </button>
            </div>
          </div>
        </div>

        <div className="calendar-sidepanel">
          <div className="side-tabs">
            <button type="button" className={tab === "booking" ? "is-active" : ""} onClick={() => setTab("booking")}>
              Rezerwacja
            </button>
            <button type="button" className={tab === "waiting" ? "is-active" : ""} onClick={() => setTab("waiting")}>
              Lista rezerwowa <b>5</b>
            </button>
          </div>

          {tab === "waiting" ? (
            <>
              <div className="waiting-summary">
                <strong>5 osób czeka na wolny termin</strong>
                <span>
                  Gdy wizyta zostanie odwołana, system proponuje termin najpierw osobom z listy, zgodnie z
                  ich preferencjami godzinowymi.
                </span>
              </div>
              <div className="waiting-list">
                {[
                  { initials: "KD", name: "Kasia Duda", service: "Icoone Laser 8F", pref: "po 16:00" },
                  { initials: "MZ", name: "Marta Zych", service: "Red Touch — twarz", pref: "pon.–śr." },
                  { initials: "IB", name: "Iwona Bąk", service: "Depilacja laserowa", pref: "po 17:00" },
                  { initials: "ZN", name: "Zofia Nowak", service: "Emtone — 2 partie", pref: "dowolnie" },
                  { initials: "HP", name: "Hanna Pawlak", service: "Nordlys", pref: "po 16:00" },
                ].map((person) => (
                  <div key={person.initials}>
                    <b className="mini-avatar">{person.initials}</b>
                    <div>
                      <strong>{person.name}</strong>
                      <span>{person.service}</span>
                    </div>
                    <small>{person.pref}</small>
                    <button type="button">
                      <Send aria-hidden="true" /> Zaproponuj
                    </button>
                  </div>
                ))}
              </div>
              <button type="button" className="show-all">
                Pokaż całą listę <ArrowRight aria-hidden="true" />
              </button>
            </>
          ) : (
            <div className="booking-panel">
              <div className="side-panel-heading">
                <div>
                  <span>Rezerwacja przy ladzie</span>
                  <strong>{draft.clientName ?? "Nowa wizyta"}</strong>
                </div>
                <CalendarPlus aria-hidden="true" />
              </div>

              <div className="wizard-steps">
                {wizardLabels.map((label, index) => {
                  const number = index + 1;
                  const state = number < draft.step ? "is-done" : number === draft.step ? "is-current" : "";

                  return (
                    <div className={state} key={label}>
                      <i>{number < draft.step ? <Check aria-hidden="true" /> : number}</i>
                      {label}
                    </div>
                  );
                })}
              </div>

              {draft.step === 1 ? (
                <>
                  <span className="form-label">Kto stoi przy ladzie</span>
                  <div className="option-list">
                    {clients.map((client) => (
                      <button
                        type="button"
                        className="option-row"
                        onClick={() => update({ clientName: client.name, step: 2 })}
                        key={client.name}
                      >
                        <span>{client.initials}</span>
                        <div>
                          <strong>{client.name}</strong>
                          <small>{client.note}</small>
                        </div>
                        <ArrowRight aria-hidden="true" />
                      </button>
                    ))}
                  </div>
                  <div className="wizard-hint">
                    <Info aria-hidden="true" />
                    Rezerwacja zaczyna się od klientki, nie od kalendarza — dzięki temu system zna plan
                    terapii, pakiety i przeciwwskazania, zanim zaproponuje termin.
                  </div>
                </>
              ) : null}

              {draft.step === 2 ? (
                <>
                  <div className="booking-client">
                    <div className="mini-avatar">
                      {clients.find((client) => client.name === draft.clientName)?.initials ?? "NK"}
                    </div>
                    <div>
                      <strong>{draft.clientName}</strong>
                      <span>{clients.find((client) => client.name === draft.clientName)?.note}</span>
                    </div>
                  </div>

                  <span className="form-label">Czego potrzebuje klientka</span>
                  <div className="option-list">
                    {services.map((service) => {
                      const Icon = serviceIcons[service.id] ?? Sparkles;
                      const picked = draft.serviceIds.includes(service.id);

                      return (
                        <button
                          type="button"
                          className={picked ? "option-row is-picked" : "option-row"}
                          onClick={() =>
                            update({
                              serviceIds: picked
                                ? draft.serviceIds.filter((id) => id !== service.id)
                                : [...draft.serviceIds, service.id],
                              start: null,
                              rejected: null,
                              staffId: null,
                            })
                          }
                          key={service.id}
                        >
                          <span>
                            <Icon aria-hidden="true" />
                          </span>
                          <div>
                            <strong>{service.name}</strong>
                            <small>
                              {service.durationMin} min · {service.price} zł · {service.company}
                            </small>
                          </div>
                          {picked ? <Check aria-hidden="true" /> : null}
                        </button>
                      );
                    })}
                  </div>

                  {draft.serviceIds.length > 0 ? (
                    <div className="wizard-summary">
                      <div>
                        <span>Łączny czas wizyty</span>
                        <strong>{Math.round(duration * 60)} min</strong>
                      </div>
                      <div>
                        <span>Wartość</span>
                        <strong>
                          {draft.serviceIds.reduce((sum, id) => sum + (serviceById(id)?.price ?? 0), 0)} zł
                        </strong>
                      </div>
                      <div>
                        <span>Urządzenia</span>
                        <strong>
                          {draft.serviceIds
                            .map((id) => serviceById(id)?.deviceId)
                            .filter(Boolean)
                            .join(", ") || "brak"}
                        </strong>
                      </div>
                    </div>
                  ) : null}

                  <button type="button" className="wizard-back" onClick={() => update({ step: 1, clientName: null })}>
                    <ArrowLeft aria-hidden="true" /> Zmień klientkę
                  </button>
                </>
              ) : null}

              {draft.step === 3 ? (
                <>
                  <span className="form-label">Wolne terminy — środa 19 sierpnia</span>
                  <div className="slot-grid">
                    {slotOptions(draft.serviceIds, DEMO_DAY, baseBookings).map((slot) => {
                      const picked = draft.start === slot.start;
                      const rejected = draft.rejected === slot.start;
                      const className = rejected
                        ? "slot-chip is-rejected"
                        : picked
                          ? "slot-chip is-picked"
                          : slot.feasible
                            ? "slot-chip"
                            : "slot-chip is-blocked";

                      return (
                        <button
                          type="button"
                          className={className}
                          onClick={() => pickSlot(slot.start, slot.feasible)}
                          key={slot.start}
                        >
                          {formatHour(slot.start)}
                        </button>
                      );
                    })}
                  </div>

                  {draft.rejected !== null ? (
                    <div className="booking-result">
                      <div className="warning-box">
                        <TriangleAlert aria-hidden="true" />
                        <div>
                          <strong>{formatHour(draft.rejected)} nie jest wykonalne</strong>
                          <span>
                            {evaluateSlot(draft.serviceIds, DEMO_DAY, draft.rejected, baseBookings).blockers.join(
                              " · ",
                            )}
                          </span>
                        </div>
                      </div>
                    </div>
                  ) : null}

                  {draft.start !== null ? (
                    <div className="booking-result">
                      <div className="recommended-slot is-selected">
                        <CircleCheckBig aria-hidden="true" />
                        <div>
                          <strong>{formatRange(draft.start, draft.start + duration)}</strong>
                          <span>
                            Wolne: {draft.serviceIds.map((id) => serviceById(id)?.deviceId).filter(Boolean).join(", ")}
                            {room ? `, ${room.name}` : ""} · {evaluation?.availableStaff.length ?? 0} os. obsady
                          </span>
                        </div>
                      </div>
                    </div>
                  ) : null}

                  <button type="button" className="wizard-back" onClick={() => update({ step: 2 })}>
                    <ArrowLeft aria-hidden="true" /> Zmień zabiegi
                  </button>
                </>
              ) : null}

              {draft.step === 4 && draft.start !== null ? (
                <>
                  <span className="form-label">Kto jest wolny o {formatHour(draft.start)}</span>
                  <div className="option-list">
                    {staffOptionsFor(draft.serviceIds, DEMO_DAY, draft.start, baseBookings).map((option) => {
                      const free = option.status === "available";
                      const picked = draft.staffId === option.staff.id;

                      return (
                        <button
                          type="button"
                          className={`option-row${free ? "" : " is-disabled"}${picked ? " is-picked" : ""}`}
                          disabled={!free}
                          onClick={() => update({ staffId: option.staff.id })}
                          key={option.staff.id}
                        >
                          <span>{option.staff.initials}</span>
                          <div>
                            <strong>{option.staff.name}</strong>
                            <small>{option.reason}</small>
                          </div>
                          {picked ? <Check aria-hidden="true" /> : null}
                        </button>
                      );
                    })}
                    <button
                      type="button"
                      className={draft.staffId === "none" ? "option-row is-picked" : "option-row"}
                      onClick={() => update({ staffId: "none" })}
                    >
                      <span>
                        <Clock aria-hidden="true" />
                      </span>
                      <div>
                        <strong>Zostaw bez obsady</strong>
                        <small>Osobę wskaże plan dnia przygotowywany dzień wcześniej.</small>
                      </div>
                      {draft.staffId === "none" ? <Check aria-hidden="true" /> : null}
                    </button>
                  </div>
                </>
              ) : null}

              {draft.step === 4 && draft.start !== null ? (
                <div className="wizard-summary">
                  <div>
                    <span>Klientka</span>
                    <strong>{draft.clientName}</strong>
                  </div>
                  <div>
                    <span>Zabiegi</span>
                    <strong>{draft.serviceIds.map((id) => serviceById(id)?.name).join(" + ")}</strong>
                  </div>
                  <div>
                    <span>Termin</span>
                    <strong>{formatRange(draft.start, draft.start + duration)}</strong>
                  </div>
                  <div>
                    <span>Gabinet</span>
                    <strong>{room?.name ?? "—"}</strong>
                  </div>
                  <div>
                    <span>Obsada</span>
                    <strong>
                      {draft.staffId && draft.staffId !== "none"
                        ? staffById(draft.staffId)?.name
                        : "do ustalenia w planie dnia"}
                    </strong>
                  </div>
                </div>
              ) : null}

              {draft.confirmed ? (
                <div className="settlement-done">
                  <CircleCheckBig aria-hidden="true" />
                  <strong>Wizyta potwierdzona</strong>
                  <span>
                    {draft.clientName} · {draft.start !== null ? formatRange(draft.start, draft.start + duration) : ""}
                    {draft.staffId && draft.staffId !== "none" ? ` · ${staffById(draft.staffId)?.name}` : ""}
                  </span>
                </div>
              ) : isScripted && beat < 6 ? (
                <button type="button" className="primary-button" onClick={onAdvance}>
                  <ArrowRight aria-hidden="true" /> {scriptedCta}
                </button>
              ) : (
                <button
                  type="button"
                  className="primary-button"
                  onClick={confirmVisit}
                  disabled={draft.start === null || draft.staffId === null}
                >
                  <CircleCheckBig aria-hidden="true" /> Potwierdź wizytę
                </button>
              )}

              {draft.step === 4 ? (
                <button type="button" className="wizard-back" onClick={() => update({ step: 3 })}>
                  <ArrowLeft aria-hidden="true" /> Zmień termin
                </button>
              ) : null}
            </div>
          )}

          <div className="quick-actions-panel">
            <h3>Szybkie akcje recepcji</h3>
            <div>
              <button type="button">
                <UserRound aria-hidden="true" /> Dopisz do listy rezerwowej
              </button>
              <button type="button">
                <Building2 aria-hidden="true" /> Zablokuj zasób
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
