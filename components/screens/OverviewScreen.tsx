"use client";

import {
  ArrowRight,
  CalendarClock,
  CalendarDays,
  Check,
  CreditCard,
  Info,
  Layers,
  ListChecks,
  MessageSquareText,
  PackageCheck,
  Repeat,
  ShieldCheck,
  Sparkles,
  Stethoscope,
  TriangleAlert,
  UserRound,
  Wallet,
  Zap,
} from "lucide-react";

import type { ScenarioFacts, ScreenId } from "../../lib/simulation";

const journey = [
  { label: "Plan terapii", detail: "Krok 4 z 6, zalecany rytm co 4 tygodnie.", tone: "journey-violet", icon: Repeat },
  { label: "Rezerwacja", detail: "Jedna wizyta, dwa zabiegi, bez wskazania osoby.", tone: "journey-blue", icon: CalendarDays },
  { label: "Bilans zasobów", detail: "Urządzenie, gabinet i kwalifikacje muszą się spiąć.", tone: "journey-orange", icon: Layers },
  { label: "Plan dnia", detail: "Dzień wcześniej system dobiera obsadę.", tone: "journey-violet", icon: ListChecks },
  { label: "Wizyta", detail: "Kosmetolog zapisuje faktyczny zakres.", tone: "journey-green", icon: Stethoscope },
  { label: "Rozliczenie", detail: "Pakiet, karta i podział na dwie firmy.", tone: "journey-blue", icon: CreditCard },
  { label: "Follow-up", detail: "Brak terminu uruchamia SMS i zadanie CRM.", tone: "journey-neutral", icon: MessageSquareText },
];

const therapyNodes = ["1", "2", "3", "4", "5", "6", "Efekt"];

interface OverviewScreenProps {
  facts: ScenarioFacts;
  onNavigate: (screen: ScreenId) => void;
}

export function OverviewScreen({ facts, onNavigate }: OverviewScreenProps) {
  const stats = [
    {
      icon: CalendarDays,
      tone: "stat-violet",
      label: "Wizyty jutro",
      value: facts.bookingDrafted ? "19" : "18",
      detail: "środa 19 sierpnia 2026",
      badge: facts.slotAccepted ? { className: "ui-badge ui-badge-green", text: "termin Anny potwierdzony" } : null,
    },
    {
      icon: ListChecks,
      tone: "stat-orange",
      label: "Do przydzielenia",
      value: facts.assignmentConfirmed ? "1" : facts.slotAccepted ? "2" : "1",
      detail: "wizyty bez obsady na jutro",
      badge: facts.assignmentConfirmed ? { className: "ui-badge ui-badge-green", text: "plan dnia zamknięty" } : null,
    },
    {
      icon: UserRound,
      tone: "stat-blue",
      label: "Lista rezerwowa",
      value: "5",
      detail: "3 osoby po godzinie 16",
      badge: null,
    },
    {
      icon: Wallet,
      tone: "stat-green",
      label: "Do rozliczenia",
      value: facts.settled ? "0 zł" : facts.visitCompleted ? "275 zł" : "1 160 zł",
      detail: facts.settled ? "wszystko zamknięte" : "wizyty otwarte w kasie",
      badge: facts.settled ? { className: "ui-badge ui-badge-green", text: "Firma A + Firma B" } : null,
    },
  ];

  return (
    <div className="screen-content">
      <div className="page-intro">
        <div>
          <h2>Jeden przypadek, cała ścieżka salonu</h2>
          <p>
            Symulacja prowadzi przez ten sam przypadek w każdej roli: od planu terapii bez terminu, po
            follow-up po wizycie.
          </p>
        </div>
        <div className="principle-pills">
          <span>
            <Repeat aria-hidden="true" /> plan terapii ≠ pakiet
          </span>
          <span>
            <CalendarClock aria-hidden="true" /> wizyta ≠ rezerwacja zasobu
          </span>
          <span>
            <Wallet aria-hidden="true" /> wpłata ≠ rozliczenie
          </span>
        </div>
      </div>

      <div className="stat-grid">
        {stats.map((stat) => {
          const Icon = stat.icon;

          return (
            <article className="stat-card" key={stat.label}>
              <div className={`stat-icon ${stat.tone}`}>
                <Icon aria-hidden="true" />
              </div>
              <div>
                <span>{stat.label}</span>
                <strong>{stat.value}</strong>
                <small>{stat.detail}</small>
              </div>
              {stat.badge ? <span className={stat.badge.className}>{stat.badge.text}</span> : null}
            </article>
          );
        })}
      </div>

      <div className="admin-middle-grid">
        <section className="panel case-panel">
          <div className="panel-heading">
            <div>
              <h3>Anna Kowalska</h3>
              <p>Klientka od 2023 roku · 22 wizyty · terapia modelowania sylwetki</p>
            </div>
            <span className={facts.followUpCreated ? "ui-badge ui-badge-green" : "ui-badge ui-badge-orange"}>
              {facts.followUpCreated ? "follow-up zaplanowany" : "brak kolejnej rezerwacji"}
            </span>
          </div>

          <div className="case-person">
            <div className="large-avatar">AK</div>
            <div>
              <strong>Icoone Laser 8F · plan na 6 zabiegów</strong>
              <span>Zalecany rytm: co 4 tygodnie (±5 dni). Realizacja: 82% zgodności z planem.</span>
            </div>
          </div>

          <div className="case-progress-head">
            <span>Postęp terapii</span>
            <strong>{facts.visitCompleted ? "4 z 6 zabiegów" : "3 z 6 zabiegów"}</strong>
          </div>
          <div className="case-steps">
            {therapyNodes.map((node, index) => {
              const done = index < (facts.visitCompleted ? 4 : 3);

              return (
                <div className={done ? "is-done" : ""} key={node}>
                  <span>{done ? <Check aria-hidden="true" /> : node}</span>
                  <small>{index === 6 ? "ocena" : `krok ${index + 1}`}</small>
                </div>
              );
            })}
          </div>

          <div className="case-detail-grid">
            <div>
              <Repeat aria-hidden="true" />
              <div>
                <span>Plan terapii</span>
                <strong>{facts.therapyRecalculated ? "krok 5 z 6" : "krok 4 z 6"}</strong>
                <small>{facts.therapyRecalculated ? "zalecany 16 września" : "zalecany 19 sierpnia"}</small>
              </div>
            </div>
            <div>
              <PackageCheck aria-hidden="true" />
              <div>
                <span>Pakiet</span>
                <strong>{facts.settled ? "2 z 6 wejść" : "3 z 6 wejść"}</strong>
                <small>osobny byt od planu terapii</small>
              </div>
            </div>
            <div>
              <CalendarClock aria-hidden="true" />
              <div>
                <span>Najbliższa wizyta</span>
                <strong>{facts.slotAccepted ? "19 sie, 15:30" : "brak terminu"}</strong>
                <small>{facts.assignmentConfirmed ? "Marta Nowak, Gabinet 3" : "obsada nieprzypisana"}</small>
              </div>
            </div>
            <div>
              <Wallet aria-hidden="true" />
              <div>
                <span>Saldo klienta</span>
                <strong>0 zł</strong>
                <small>brak zaległości i przedpłat</small>
              </div>
            </div>
          </div>

          <div className="info-strip">
            <Info aria-hidden="true" />
            Plan terapii opisuje zalecany rytm leczenia. Pakiet jest tylko formą zapłaty i może się skończyć
            w innym momencie niż terapia.
          </div>
        </section>

        <section className="panel admin-actions-panel">
          <div className="panel-heading">
            <div>
              <h3>Co system pilnuje w tle</h3>
              <p>Cztery miejsca, w których dzisiaj najczęściej gubi się informacja.</p>
            </div>
            <Zap aria-hidden="true" />
          </div>

          <div className="admin-action-row">
            <span className="action-icon action-violet">
              <CalendarDays aria-hidden="true" />
            </span>
            <div>
              <strong>Widok zasobów</strong>
              <small>Kalendarz z podziałem na gabinety i urządzenia, nie tylko na osoby.</small>
            </div>
            <ArrowRight aria-hidden="true" />
          </div>
          <div className="admin-action-row">
            <span className="action-icon action-blue">
              <UserRound aria-hidden="true" />
            </span>
            <div>
              <strong>Lista rezerwowa</strong>
              <small>Zwolniony termin trafia najpierw do osób czekających.</small>
            </div>
            <ArrowRight aria-hidden="true" />
          </div>
          <div className="admin-action-row">
            <span className="action-icon action-orange">
              <ListChecks aria-hidden="true" />
            </span>
            <div>
              <strong>Planowanie zasobów</strong>
              <small>Obsada ustalana dzień wcześniej, a nie w chwili rezerwacji.</small>
            </div>
            <ArrowRight aria-hidden="true" />
          </div>
          <div className="admin-action-row">
            <span className="action-icon action-green">
              <ShieldCheck aria-hidden="true" />
            </span>
            <div>
              <strong>Rozdzielenie firm</strong>
              <small>Firma A i Firma B rozliczane na poziomie pojedynczego zabiegu.</small>
            </div>
            <ArrowRight aria-hidden="true" />
          </div>

          <div className="info-strip">
            <TriangleAlert aria-hidden="true" />
            Prototyp pokazuje zachowanie systemu, a nie gotową integrację z kasą i terminalem.
          </div>

          <button type="button" className="text-link" onClick={() => onNavigate("calendar")}>
            Otwórz kalendarz recepcji <ArrowRight aria-hidden="true" />
          </button>
        </section>
      </div>

      <section className="panel journey-panel">
        <div className="panel-heading">
          <div>
            <h3>Ścieżka symulacji</h3>
            <p>Siedem etapów, przez które prowadzi ta prezentacja.</p>
          </div>
          <span className="ui-badge ui-badge-violet">
            <Sparkles aria-hidden="true" /> tryb demonstracyjny
          </span>
        </div>

        <div className="journey-grid">
          {journey.map((item, index) => {
            const Icon = item.icon;

            return (
              <div className="journey-wrap" key={item.label}>
                <div className={`journey-card ${item.tone}`}>
                  <Icon aria-hidden="true" />
                  <strong>{item.label}</strong>
                  <p>{item.detail}</p>
                </div>
                {index < journey.length - 1 ? <ArrowRight className="journey-arrow" aria-hidden="true" /> : null}
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
}
