"use client";

import {
  ArrowRight,
  CalendarClock,
  Check,
  CircleCheckBig,
  ClipboardCheck,
  Clock,
  Cpu,
  MessageSquareText,
  NotebookPen,
  Repeat,
  ShieldCheck,
  Stethoscope,
  TriangleAlert,
} from "lucide-react";
import { useState } from "react";

import type { ScenarioFacts } from "../../lib/simulation";

type VisitTab = "przebieg" | "terapia" | "ankieta" | "notatki";

const tabs: Array<{ id: VisitTab; label: string; icon: typeof Check }> = [
  { id: "przebieg", label: "Przebieg", icon: ClipboardCheck },
  { id: "terapia", label: "Terapia", icon: Repeat },
  { id: "ankieta", label: "Ankieta", icon: ShieldCheck },
  { id: "notatki", label: "Notatki", icon: MessageSquareText },
];

interface SpecialistScreenProps {
  facts: ScenarioFacts;
  onAdvance: () => void;
}

export function SpecialistScreen({ facts, onAdvance }: SpecialistScreenProps) {
  const [tab, setTab] = useState<VisitTab>("przebieg");

  const emtoneDone = facts.visitCompleted;

  return (
    <main className="specialist-main">
      <h1>Dzień dobry, Marta</h1>

      <div className="mobile-visit-hero">
        <div className="visit-person">
          <div className="large-avatar">AK</div>
          <div>
            <strong>Anna Kowalska</strong>
            <span>Wizyta 15:30–17:00 · Gabinet 3</span>
          </div>
          <span className={facts.visitCompleted ? "ui-badge ui-badge-green" : "ui-badge ui-badge-violet"}>
            {facts.visitCompleted ? "zakres zapisany" : "w trakcie"}
          </span>
        </div>

        <div className="visit-meta">
          <div>
            <Stethoscope aria-hidden="true" />
            <div>
              <span>Zaplanowane zabiegi</span>
              <strong>Icoone Laser 8F + Emtone</strong>
            </div>
          </div>
          <div>
            <Cpu aria-hidden="true" />
            <div>
              <span>Urządzenia</span>
              <strong>Icoone 2, Emtone</strong>
            </div>
          </div>
          <div>
            <Clock aria-hidden="true" />
            <div>
              <span>Czas</span>
              <strong>90 min</strong>
            </div>
          </div>
          <div>
            <Repeat aria-hidden="true" />
            <div>
              <span>Plan terapii</span>
              <strong>{facts.visitCompleted ? "krok 4 z 6" : "krok 4 z 6"}</strong>
            </div>
          </div>
        </div>
      </div>

      <div className="visit-tabs">
        {tabs.map((item) => {
          const Icon = item.icon;

          return (
            <button
              type="button"
              className={tab === item.id ? "is-active" : ""}
              onClick={() => setTab(item.id)}
              key={item.id}
            >
              <Icon aria-hidden="true" /> {item.label}
            </button>
          );
        })}
      </div>

      <div className="contraindication">
        <TriangleAlert aria-hidden="true" />
        <div>
          <strong>Przeciwwskazanie odnotowane w ankiecie</strong>
          <span>Świeża opalenizna na udach — Emtone tylko na jednej partii, brzuch pomijamy.</span>
        </div>
        <span className="ui-badge ui-badge-orange">z ankiety</span>
      </div>

      <div className="visit-grid">
        {tab === "przebieg" ? (
          <>
            <section className="visit-card treatment-list-card">
              <div className="visit-card-title">
                <h3>
                  <ClipboardCheck aria-hidden="true" /> Faktyczny zakres
                </h3>
                <span className={emtoneDone ? "ui-badge ui-badge-green" : "ui-badge ui-badge-neutral"}>
                  {emtoneDone ? "2 z 2 pozycji" : "1 z 2 pozycji"}
                </span>
              </div>
              <button type="button" className="is-done">
                <span>
                  <Check aria-hidden="true" />
                </span>
                Icoone Laser 8F — całe udo i pośladki
              </button>
              <button type="button" className={emtoneDone ? "is-done" : "is-current"} onClick={onAdvance}>
                <span>{emtoneDone ? <Check aria-hidden="true" /> : ""}</span>
                {emtoneDone ? "Emtone — 1 partia (uda)" : "Emtone — 2 partie (zaplanowane)"}
              </button>
              <button type="button">
                <span />
                Dodaj zabieg wykonany poza planem
              </button>
            </section>

            <section className="visit-card required-card">
              <h3>
                <ShieldCheck aria-hidden="true" /> Wymagane przed zabiegiem
              </h3>
              <div>
                <span>Ankieta zdrowotna</span>
                <strong>
                  <CircleCheckBig aria-hidden="true" /> aktualna
                </strong>
              </div>
              <div>
                <span>Zgoda na zabieg</span>
                <strong>
                  <CircleCheckBig aria-hidden="true" /> podpisana
                </strong>
              </div>
              <div>
                <span>Zdjęcia „przed”</span>
                <strong>
                  <CircleCheckBig aria-hidden="true" /> 3 pliki
                </strong>
              </div>
              <button type="button">
                Otwórz dokumenty wizyty <ArrowRight aria-hidden="true" />
              </button>
            </section>
          </>
        ) : null}

        {tab === "terapia" ? (
          <>
            <section className="visit-card therapy-progress-card">
              <h3>
                <Repeat aria-hidden="true" /> Postęp terapii
              </h3>
              <strong>Icoone Laser 8F — plan na 6 zabiegów</strong>
              <div className="visit-progress">
                <i style={{ width: facts.visitCompleted ? "67%" : "50%" }} />
                <span>{facts.visitCompleted ? "4 / 6" : "3 / 6"}</span>
              </div>
              <p>
                Regularność 82%. Odstępy zgodne z zaleceniem (4 tygodnie ±5 dni) przy trzech ostatnich
                zabiegach.
              </p>
              <button type="button">
                Pokaż historię terapii <ArrowRight aria-hidden="true" />
              </button>
            </section>

            <section className="visit-card required-card">
              <h3>
                <CalendarClock aria-hidden="true" /> Kolejny krok
              </h3>
              <div>
                <span>Zalecany termin</span>
                <strong>16 września</strong>
              </div>
              <div>
                <span>Okno tolerancji</span>
                <strong>±5 dni</strong>
              </div>
              <div>
                <span>Pakiet</span>
                <strong>{facts.settled ? "2 z 6 wejść" : "3 z 6 wejść"}</strong>
              </div>
              <button type="button">
                Zaproponuj termin przy wyjściu <ArrowRight aria-hidden="true" />
              </button>
            </section>
          </>
        ) : null}

        {tab === "ankieta" ? (
          <>
            <section className="visit-card required-card">
              <h3>
                <ShieldCheck aria-hidden="true" /> Ankieta z 19 sierpnia
              </h3>
              <div>
                <span>Ciąża i karmienie</span>
                <strong>
                  <CircleCheckBig aria-hidden="true" /> nie dotyczy
                </strong>
              </div>
              <div>
                <span>Metal w ciele</span>
                <strong>
                  <CircleCheckBig aria-hidden="true" /> brak
                </strong>
              </div>
              <div>
                <span>Świeża opalenizna</span>
                <strong className="orange-text">wskazana przez klientkę</strong>
              </div>
              <button type="button">
                Otwórz pełną ankietę <ArrowRight aria-hidden="true" />
              </button>
            </section>

            <section className="visit-card crm-short">
              <h3>
                <TriangleAlert aria-hidden="true" /> Wpływ na zabieg
              </h3>
              <p>
                System nie blokuje wizyty, tylko zawęża zakres. Emtone zostaje wykonane na jednej partii,
                a informacja trafia do rozliczenia i do planu kolejnej wizyty.
              </p>
              <button type="button" onClick={onAdvance}>
                Zapisz zawężony zakres <ArrowRight aria-hidden="true" />
              </button>
            </section>
          </>
        ) : null}

        {tab === "notatki" ? (
          <>
            <section className="visit-card crm-short">
              <h3>
                <NotebookPen aria-hidden="true" /> Notatka z wizyty
              </h3>
              <p>
                Klientka zgłasza wyraźną poprawę jędrności ud. Prosi o wcześniejsze godziny w przyszłości,
                najlepiej przed 16:00. Reakcja skóry prawidłowa, bez zaczerwienienia.
              </p>
              <button type="button">
                Dodaj notatkę głosową <ArrowRight aria-hidden="true" />
              </button>
            </section>

            <section className="visit-card required-card">
              <h3>
                <MessageSquareText aria-hidden="true" /> Do przekazania recepcji
              </h3>
              <div>
                <span>Preferencja godzin</span>
                <strong>przed 16:00</strong>
              </div>
              <div>
                <span>Zakres do rozliczenia</span>
                <strong className={emtoneDone ? "" : "orange-text"}>
                  {emtoneDone ? "Icoone + Emtone 1 partia" : "czeka na zamknięcie"}
                </strong>
              </div>
              <div>
                <span>Kolejny termin</span>
                <strong className="orange-text">nieumówiony</strong>
              </div>
              <button type="button">
                Wyślij podsumowanie <ArrowRight aria-hidden="true" />
              </button>
            </section>
          </>
        ) : null}
      </div>

      <div className="next-date-card">
        <CalendarClock aria-hidden="true" />
        <div>
          <strong>Kolejny zalecany zabieg</strong>
          <span>{facts.therapyRecalculated ? "16 września 2026 (±5 dni)" : "przeliczany po zamknięciu wizyty"}</span>
        </div>
        <span className={facts.followUpCreated ? "ui-badge ui-badge-green" : "ui-badge ui-badge-orange"}>
          {facts.followUpCreated ? "follow-up aktywny" : "brak rezerwacji"}
        </span>
      </div>

      <div className="visit-actions">
        <button type="button" className="secondary-button">
          Zdjęcia „po”
        </button>
        <button type="button" className="secondary-button">
          Notatka CRM
        </button>
        <button type="button" className="secondary-button">
          Przerwij wizytę
        </button>
        <button type="button" className="primary-button" onClick={onAdvance} disabled={facts.settlementOpen}>
          <CircleCheckBig aria-hidden="true" />
          {facts.visitCompleted ? "Przekaż do rozliczenia" : "Zamknij zakres wizyty"}
        </button>
      </div>
    </main>
  );
}
