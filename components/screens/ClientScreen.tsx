"use client";

import {
  ArrowLeft,
  BellRing,
  CalendarClock,
  CalendarPlus,
  Check,
  CircleCheckBig,
  CreditCard,
  Info,
  MessageSquareText,
  NotebookPen,
  PackageCheck,
  Phone,
  Repeat,
  Send,
  Sparkles,
  Wallet,
} from "lucide-react";
import { useState } from "react";

import { therapySteps } from "../../lib/demo-data";
import type { ScenarioFacts, ScreenId } from "../../lib/simulation";

type ClientTab = "przeglad" | "terapia" | "pakiety" | "notatki";

const clientTabs: Array<{ id: ClientTab; label: string; icon: typeof Check }> = [
  { id: "przeglad", label: "Przegląd", icon: Sparkles },
  { id: "terapia", label: "Terapia", icon: Repeat },
  { id: "pakiety", label: "Pakiety i płatności", icon: PackageCheck },
  { id: "notatki", label: "Notatki CRM", icon: MessageSquareText },
];

interface ClientScreenProps {
  facts: ScenarioFacts;
  onAdvance: () => void;
  onNavigate: (screen: ScreenId) => void;
}

function TherapyPanel({ facts }: { facts: ScenarioFacts }) {
  const done = facts.visitCompleted ? 4 : 3;

  return (
    <section className="panel therapy-summary">
      <div className="panel-heading">
        <div>
          <h3>Plan terapii</h3>
          <p>Zalecany przebieg leczenia — niezależny od tego, jak klientka płaci.</p>
        </div>
        <span className="ui-badge ui-badge-violet">Icoone Laser 8F</span>
      </div>

      <div className="therapy-summary-main">
        <div className="therapy-icon">
          <Repeat aria-hidden="true" />
        </div>
        <div>
          <strong>Modelowanie sylwetki — 6 zabiegów</strong>
          <p>Rytm co 4 tygodnie z tolerancją ±5 dni. Efekt oceniany po pełnej serii.</p>
          <div className="long-progress">
            <i style={{ width: `${(done / 6) * 100}%` }} />
            <b>{done} z 6</b>
          </div>
          <small>
            {facts.therapyRecalculated
              ? "Kolejny zalecany krok: 16 września 2026"
              : "Kolejny krok zostanie przeliczony po zamknięciu wizyty"}
          </small>
        </div>
        <div className="therapy-regularity">
          <strong>Regularność</strong>
          <span>82% zabiegów w zalecanym oknie</span>
          <div>
            {therapySteps.map((step, index) => (
              <i className={index < done ? "is-done" : ""} key={step.id}>
                {index < done ? <Check aria-hidden="true" /> : index + 1}
              </i>
            ))}
          </div>
          <p>
            <CalendarClock aria-hidden="true" /> Średni odstęp: 29 dni
          </p>
        </div>
      </div>

      <div className="therapy-explainer">
        <Info aria-hidden="true" />
        Plan terapii mówi, kiedy zabieg powinien się odbyć. Pakiet mówi tylko, ile wejść zostało opłaconych.
        <button type="button">Czym się różnią</button>
      </div>
    </section>
  );
}

function PackagePanel({ facts }: { facts: ScenarioFacts }) {
  const left = facts.settled ? 2 : 3;

  return (
    <section className="panel package-summary">
      <div className="panel-heading">
        <div>
          <h3>Pakiety</h3>
        </div>
        <PackageCheck aria-hidden="true" />
      </div>

      <div className="package-card">
        <strong>Icoone Laser — 6 wejść</strong>
        <span>Kupiony 6 maja 2026 · Firma A · ważny do 6 maja 2027</span>
        <div className="mini-progress">
          <i style={{ width: `${((6 - left) / 6) * 100}%` }} />
        </div>
        <small>Wykorzystano {6 - left} z 6 wejść</small>
      </div>

      <div className="wallet-card">
        <span>Saldo klientki</span>
        <strong>0 zł</strong>
        <Wallet aria-hidden="true" />
      </div>
    </section>
  );
}

function PaymentPanel({ facts }: { facts: ScenarioFacts }) {
  return (
    <section className="panel payment-overview">
      <div className="panel-heading">
        <div>
          <h3>Rozliczenia</h3>
        </div>
        <CreditCard aria-hidden="true" />
      </div>
      <div>
        <span>Wartość ostatniej wizyty</span>
        <strong>885 zł</strong>
      </div>
      <div>
        <span>Pokryte pakietem</span>
        <strong className="violet-text">610 zł</strong>
      </div>
      <div>
        <span>Zapłacone kartą</span>
        <strong className={facts.settled ? "green-text" : "orange-text"}>{facts.settled ? "275 zł" : "0 zł"}</strong>
      </div>
      <div>
        <span>Zaległości</span>
        <strong className="green-text">brak</strong>
      </div>
      <button type="button">
        Historia płatności <CreditCard aria-hidden="true" />
      </button>
    </section>
  );
}

function TasksPanel({ facts }: { facts: ScenarioFacts }) {
  return (
    <section className="panel client-tasks">
      <div className="panel-heading">
        <div>
          <h3>Zadania i notatki</h3>
        </div>
        <span className="ui-badge ui-badge-neutral">CRM</span>
      </div>

      <label className="is-task-done">
        <input type="checkbox" defaultChecked readOnly />
        <div>
          <strong>Zapytać o reakcję skóry po Icoone</strong>
          <span>Wykonane 19 sierpnia przez Martę Nowak</span>
        </div>
        <CircleCheckBig aria-hidden="true" />
      </label>

      {facts.followUpCreated ? (
        <label>
          <input type="checkbox" readOnly />
          <div>
            <strong>Telefon do klientki — brak kolejnego terminu</strong>
            <span>Termin zadania: 12 września, jeśli SMS pozostanie bez reakcji</span>
          </div>
          <Phone aria-hidden="true" />
        </label>
      ) : null}

      <div className="crm-note">
        <strong>Notatka z wizyty</strong>
        <p>
          Klientka zgłasza poprawę jędrności ud. Prosi o terminy przed 16:00. Emtone tylko na udach —
          świeża opalenizna na brzuchu.
        </p>
      </div>
    </section>
  );
}

function QuickPanel({ facts, onAdvance }: { facts: ScenarioFacts; onAdvance: () => void }) {
  return (
    <section className="panel client-quick">
      <div className="panel-heading">
        <div>
          <h3>Szybkie działania</h3>
        </div>
        <Sparkles aria-hidden="true" />
      </div>

      <button type="button" onClick={onAdvance}>
        <span>
          <CalendarPlus aria-hidden="true" />
        </span>
        <div>
          <strong>Umów kolejny zabieg</strong>
          <small>{facts.therapyRecalculated ? "sugerowane: 16 września" : "po przeliczeniu planu"}</small>
        </div>
        <Check aria-hidden="true" />
      </button>
      <button type="button" onClick={onAdvance}>
        <span>
          <Send aria-hidden="true" />
        </span>
        <div>
          <strong>Wyślij zaproszenie SMS</strong>
          <small>{facts.followUpCreated ? "zaplanowane na 9 września" : "szablon: powrót po serii"}</small>
        </div>
        <Check aria-hidden="true" />
      </button>
      <button type="button">
        <span>
          <NotebookPen aria-hidden="true" />
        </span>
        <div>
          <strong>Dodaj notatkę CRM</strong>
          <small>widoczna dla całego zespołu</small>
        </div>
        <Check aria-hidden="true" />
      </button>
    </section>
  );
}

export function ClientScreen({ facts, onAdvance, onNavigate }: ClientScreenProps) {
  const [tab, setTab] = useState<ClientTab>("przeglad");
  const [note, setNote] = useState(
    "Klientka pyta o efekty przed jesienią. Zaproponować termin przed 16:00.",
  );

  return (
    <div className="screen-content">
      <button type="button" className="back-link" onClick={() => onNavigate("overview")}>
        <ArrowLeft aria-hidden="true" /> Wróć do pulpitu
      </button>

      <section className="panel client-hero">
        <div className="profile-avatar">AK</div>
        <div className="client-main-info">
          <div>
            <h2>Anna Kowalska</h2>
            <span className="ui-badge ui-badge-violet">stała klientka</span>
          </div>
          <p>
            <Repeat aria-hidden="true" /> Icoone Laser 8F · {facts.therapyRecalculated ? "krok 5 z 6" : "krok 4 z 6"}
          </p>
          <span>Klientka od marca 2023 · ostatnia wizyta 19 sierpnia 2026</span>
        </div>
        <div className="client-flags">
          <span className="ui-badge ui-badge-orange">świeża opalenizna</span>
          <span className="ui-badge ui-badge-blue">preferuje przed 16:00</span>
          <span className="ui-badge ui-badge-green">zgody aktualne</span>
        </div>
        <div className="client-count">
          <span>
            Wizyty <strong>22</strong>
          </span>
          <span>
            Wartość <strong>18 940 zł</strong>
          </span>
          <span>
            Regularność <strong>82%</strong>
          </span>
        </div>
      </section>

      <div className={facts.followUpCreated ? "followup-callout is-complete" : "followup-callout"}>
        <div className="followup-icon">{facts.followUpCreated ? <CircleCheckBig aria-hidden="true" /> : <BellRing aria-hidden="true" />}</div>
        <div>
          <span>{facts.followUpCreated ? "Follow-up aktywny" : "Luka w terapii"}</span>
          <strong>
            {facts.followUpCreated
              ? "SMS 9 września, zadanie kontaktowe 12 września"
              : "Klientka wyszła bez kolejnego terminu"}
          </strong>
          <p>
            {facts.followUpCreated
              ? "Automatyzacja zadziała tylko wtedy, gdy do 9 września nadal nie będzie rezerwacji."
              : "Plan terapii przewiduje kolejny zabieg za 4 tygodnie, ale w kalendarzu nic nie stoi."}
          </p>
        </div>
        {facts.followUpCreated ? (
          <span className="ui-badge ui-badge-green">2 automatyzacje</span>
        ) : (
          <button type="button" className="primary-button" onClick={onAdvance}>
            <BellRing aria-hidden="true" /> Uruchom follow-up
          </button>
        )}
      </div>

      <div className="client-tabs">
        {clientTabs.map((item) => {
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

      {facts.therapyRecalculated ? (
        <div className="tab-context-banner">
          <CircleCheckBig aria-hidden="true" />
          <div>
            <strong>Karta zaktualizowana po wizycie z 19 sierpnia</strong>
            <span>Zakres zabiegów, pakiet i plan terapii przeliczyły się bez ręcznego przepisywania.</span>
          </div>
        </div>
      ) : null}

      {tab === "przeglad" ? (
        <>
          <div className="client-top-grid">
            <TherapyPanel facts={facts} />
            <QuickPanel facts={facts} onAdvance={onAdvance} />
          </div>
          <div className="client-bottom-grid">
            <PackagePanel facts={facts} />
            <PaymentPanel facts={facts} />
            <TasksPanel facts={facts} />
          </div>
        </>
      ) : null}

      {tab === "terapia" ? (
        <div className="client-top-grid">
          <TherapyPanel facts={facts} />
          <QuickPanel facts={facts} onAdvance={onAdvance} />
        </div>
      ) : null}

      {tab === "pakiety" ? (
        <div className="client-bottom-grid">
          <PackagePanel facts={facts} />
          <PaymentPanel facts={facts} />
          <TasksPanel facts={facts} />
        </div>
      ) : null}

      {tab === "notatki" ? (
        <>
          <div className="visit-note-editor">
            <div>
              <NotebookPen aria-hidden="true" />
              <div>
                <strong>Notatka do karty klientki</strong>
                <span>Notatka nie jest zadaniem — zadanie powstaje osobno i ma termin.</span>
              </div>
            </div>
            <textarea
              value={note}
              onChange={(event) => setNote(event.target.value)}
              aria-label="Treść notatki CRM"
            />
            <div>
              <button type="button">Wyczyść</button>
              <button type="button" className="primary-button" onClick={onAdvance}>
                <Check aria-hidden="true" /> Zapisz i utwórz zadanie
              </button>
            </div>
          </div>
          <div className="client-bottom-grid">
            <TasksPanel facts={facts} />
            <PaymentPanel facts={facts} />
            <PackagePanel facts={facts} />
          </div>
        </>
      ) : null}
    </div>
  );
}
