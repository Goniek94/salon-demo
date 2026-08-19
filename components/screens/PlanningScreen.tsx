"use client";

import {
  ArrowUpDown,
  Building2,
  CircleCheckBig,
  Cpu,
  Lightbulb,
  ListChecks,
  Plus,
  Sparkles,
  TriangleAlert,
  UsersRound,
  Wrench,
} from "lucide-react";

import {
  existingBookings,
  formatHour,
  formatRange,
  roomById,
  serviceById,
  staffMembers,
  staffOptionsFor,
  type Booking,
} from "../../lib/booking";
import type { ScenarioFacts } from "../../lib/simulation";

const STAFF_ROW = 96;
const STAFF_TOP = 56;
const DEMO_DAY = 2;
const hours = ["13:00", "14:00", "15:00", "16:00", "17:00", "18:00", "19:00"];

const annaVisit: Booking = {
  id: "anna",
  day: DEMO_DAY,
  start: 15.5,
  end: 17,
  clientName: "Anna Kowalska",
  serviceIds: ["icoone", "emtone"],
  staffId: "marta",
  roomId: "g3",
};

interface PlanningScreenProps {
  facts: ScenarioFacts;
  onAdvance: () => void;
}

export function PlanningScreen({ facts, onAdvance }: PlanningScreenProps) {
  const dayBookings = existingBookings.filter((booking) => booking.day === DEMO_DAY);
  const pending = dayBookings.find((booking) => booking.staffId === "");
  const pendingAssigned = facts.planningOpen;
  const options = pending ? staffOptionsFor(pending.serviceIds, DEMO_DAY, pending.start, dayBookings) : [];
  const suggested = options.find((option) => option.status === "available");

  const eventsFor = (staffId: string): Booking[] => [
    ...dayBookings.filter((booking) => booking.staffId === staffId && booking.end > 13),
    ...(facts.assignmentConfirmed && staffId === "marta" ? [annaVisit] : []),
    ...(pendingAssigned && pending && suggested && staffId === suggested.staff.id ? [pending] : []),
  ];

  return (
    <div className="screen-content">
      <div className="planning-title">
        <span className="ui-badge ui-badge-violet">
          <ListChecks aria-hidden="true" /> jutro
        </span>
        <div>
          <h2>Planowanie zasobów</h2>
          <p>
            Wizyty umówione z osobą są już obsadzone. Tu zostaje reszta: rezerwacje przyjęte bez wskazania
            pracownika oraz kontrola, czy dzień w ogóle się spina.
          </p>
        </div>
        <button type="button" className="secondary-button">
          <ArrowUpDown aria-hidden="true" /> Środa 19 sierpnia
        </button>
      </div>

      <div className="planning-stats">
        <article>
          <UsersRound aria-hidden="true" />
          <strong>{staffMembers.length}</strong>
          <div>
            <span>Pracownicy w grafiku</span>
            <small>kwalifikacje zweryfikowane</small>
          </div>
        </article>
        <article className={pendingAssigned ? "green" : "orange"}>
          <ListChecks aria-hidden="true" />
          <strong>{pendingAssigned ? 0 : 1}</strong>
          <div>
            <span>Wizyty bez obsady</span>
            <small>{pendingAssigned ? "dzień domknięty" : "wymaga decyzji recepcji"}</small>
          </div>
        </article>
        <article className="green">
          <Building2 aria-hidden="true" />
          <strong>7</strong>
          <div>
            <span>Gabinety</span>
            <small>reguły zgodności aktywne</small>
          </div>
        </article>
        <article className="red">
          <Wrench aria-hidden="true" />
          <strong>1</strong>
          <div>
            <span>Urządzenie w serwisie</span>
            <small>Icoone 1 niedostępne do 21 sierpnia</small>
          </div>
        </article>
      </div>

      <div className="planning-grid">
        <section className="panel unassigned-panel">
          <div className="panel-heading">
            <div>
              <h3>Do przydzielenia</h3>
              <p>Rezerwacje przyjęte bez wskazanej osoby</p>
            </div>
            <ListChecks aria-hidden="true" />
          </div>

          <div className="sort-row">
            <ArrowUpDown aria-hidden="true" /> według godziny
          </div>

          {pendingAssigned || !pending ? (
            <div className="recommended-slot is-selected">
              <CircleCheckBig aria-hidden="true" />
              <div>
                <strong>Wszystko przydzielone</strong>
                <span>Każda jutrzejsza wizyta ma osobę, gabinet i urządzenie.</span>
              </div>
            </div>
          ) : (
            <div className="unassigned-list">
              <article className="is-demo-visit">
                <div className="visit-time">
                  <strong>{formatHour(pending.start)}</strong>
                  <span>{Math.round((pending.end - pending.start) * 60)} min</span>
                </div>
                <div>
                  <strong>{pending.clientName}</strong>
                  <small>{pending.serviceIds.map((id) => serviceById(id)?.name).join(" + ")}</small>
                  <b>
                    Wymaga{" "}
                    <em>
                      {pending.serviceIds.map((id) => serviceById(id)?.deviceId).filter(Boolean).join(", ")},{" "}
                      {roomById(pending.roomId)?.name}
                    </em>
                  </b>
                  <span className="skill-tags">
                    {pending.serviceIds.map((id) => (
                      <i key={id}>kwalifikacja {serviceById(id)?.qualification}</i>
                    ))}
                  </span>
                </div>
                <button type="button" onClick={onAdvance}>
                  <strong>{options.filter((option) => option.status === "available").length}</strong>
                  <span>wolne osoby</span>
                  <Plus aria-hidden="true" />
                </button>
              </article>
            </div>
          )}
        </section>

        <section className="panel assigned-plan">
          <div className="panel-heading">
            <div>
              <h3>
                Plan dnia <small>środa 19 sierpnia</small>
              </h3>
              <p>Przydział widoczny dla całego zespołu</p>
            </div>
            <span className={pendingAssigned ? "ui-badge ui-badge-green" : "ui-badge ui-badge-orange"}>
              {pendingAssigned ? "zatwierdzony" : "w trakcie"}
            </span>
          </div>

          <div className="staff-plan">
            <div className="staff-time-axis">
              {hours.map((hour) => (
                <span key={hour}>{hour}</span>
              ))}
            </div>

            {staffMembers.map((person, index) => (
              <div className="staff-column" key={person.id}>
                <header>
                  <strong>{person.name}</strong>
                  <span>{person.qualifications.join(", ")}</span>
                </header>

                {eventsFor(person.id).map((booking) => (
                  <div
                    className={`staff-event ${booking.id === "anna" ? "staff-tone-demo" : `staff-tone-${index % 4}`}`}
                    style={{ top: `${STAFF_TOP + (booking.start - 13) * STAFF_ROW}px` }}
                    key={booking.id}
                  >
                    <small>{formatRange(booking.start, booking.end)}</small>
                    <strong>{booking.clientName}</strong>
                    <span>
                      {booking.serviceIds.map((id) => serviceById(id)?.name).join(" + ")} ·{" "}
                      {roomById(booking.roomId)?.name}
                    </span>
                  </div>
                ))}
              </div>
            ))}
          </div>
        </section>

        <div className="planning-insights">
          <section className="panel recommendation-panel">
            <h3>
              <Lightbulb aria-hidden="true" /> Kto może wziąć wizytę {pending ? formatHour(pending.start) : ""}
            </h3>
            {options.map((option) => {
              const applied = pendingAssigned && suggested?.staff.id === option.staff.id;

              return (
                <div
                  className={applied ? "recommendation-row is-applied" : "recommendation-row"}
                  key={option.staff.id}
                >
                  <span>
                    {option.staff.name} — {option.reason}
                  </span>
                  {applied ? (
                    <span className="ui-badge ui-badge-green">wybrana</span>
                  ) : (
                    <button type="button" onClick={onAdvance} disabled={option.status !== "available"}>
                      {option.status === "available" ? "Przydziel" : "Nie może"}
                    </button>
                  )}
                </div>
              );
            })}
          </section>

          <section className="panel alerts-panel">
            <h3>
              <TriangleAlert aria-hidden="true" /> Ryzyka dnia
            </h3>
            <div className="resource-alert">
              <Wrench aria-hidden="true" />
              <div>
                <strong>Icoone 1 w serwisie</strong>
                <span>Cały ruch Icoone przechodzi na Icoone 2 do 21 sierpnia.</span>
              </div>
              <button type="button">Szczegóły</button>
            </div>
            {facts.assignmentConfirmed ? (
              <div className="resolved-alert">
                <CircleCheckBig aria-hidden="true" />
                <div>
                  <strong>Kolizja Icoone 2 rozwiązana przy rezerwacji</strong>
                  <span>
                    Wizyta Anny Kowalskiej weszła na 15:30, zaraz po zwolnieniu urządzenia przez Ewę Lis.
                  </span>
                </div>
              </div>
            ) : (
              <div className="resource-alert">
                <Cpu aria-hidden="true" />
                <div>
                  <strong>Icoone 2 obłożone po południu</strong>
                  <span>Kolejne wizyty Icoone zmieszczą się dopiero po 15:20.</span>
                </div>
                <button type="button">Symuluj</button>
              </div>
            )}
          </section>
        </div>
      </div>

      <div className="planning-footer">
        <div>
          <Sparkles aria-hidden="true" />
          <div>
            <strong>
              {pendingAssigned
                ? "Plan dnia zatwierdzony i wysłany do zespołu"
                : "System proponuje obsadę, decyzję podejmuje recepcja"}
            </strong>
            <span>
              Prototyp nie optymalizuje całego grafiku automatycznie — pokazuje tylko wykonalne warianty.
            </span>
          </div>
        </div>
        <button type="button" className="secondary-button">
          Eksportuj plan
        </button>
        <button type="button" className="primary-button" onClick={onAdvance} disabled={facts.visitStarted}>
          <CircleCheckBig aria-hidden="true" />
          {pendingAssigned ? "Przejdź do wizyty" : "Zatwierdź plan dnia"}
        </button>
      </div>
    </div>
  );
}
