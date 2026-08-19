"use client";

import {
  Bell,
  Building2,
  CalendarDays,
  ChevronDown,
  CreditCard,
  House,
  LayoutDashboard,
  ListChecks,
  MapPin,
  MessageSquareText,
  PanelLeftClose,
  Plus,
  Sparkles,
  Stethoscope,
  UserCog,
  UserRound,
  UsersRound,
  Waypoints,
} from "lucide-react";
import { useEffect, useReducer } from "react";

import {
  factsFor,
  initialSimState,
  journalFor,
  lastBeat,
  scenarioBeats,
  simReducer,
  type Role,
  type ScreenId,
} from "../lib/simulation";
import { AutomationDrawer } from "./AutomationDrawer";
import { SimulationRail } from "./SimulationRail";
import { CalendarScreen } from "./screens/CalendarScreen";
import { ClientScreen } from "./screens/ClientScreen";
import { OverviewScreen } from "./screens/OverviewScreen";
import { PlanningScreen } from "./screens/PlanningScreen";
import { SettlementScreen } from "./screens/SettlementScreen";
import { SpecialistScreen } from "./screens/SpecialistScreen";

const navItems: Array<{ id: ScreenId; label: string; icon: typeof House }> = [
  { id: "overview", label: "Pulpit", icon: LayoutDashboard },
  { id: "calendar", label: "Kalendarz", icon: CalendarDays },
  { id: "planning", label: "Planowanie zasobów", icon: ListChecks },
  { id: "visit", label: "Wizyta kosmetologa", icon: Stethoscope },
  { id: "settlement", label: "Rozliczenia", icon: CreditCard },
  { id: "client", label: "Karta klientki", icon: UserRound },
];

const roleOptions: Array<{ id: Role; label: string; detail: string }> = [
  { id: "admin", label: "Administrator", detail: "Konfiguracja, zasoby, raporty" },
  { id: "reception", label: "Recepcja", detail: "Kalendarz, plan dnia, rozliczenia" },
  { id: "specialist", label: "Kosmetolog", detail: "Wizyta, terapia, notatki" },
];

const roleTitles: Record<Role, string> = {
  admin: "Panel administratora",
  reception: "Panel recepcji",
  specialist: "Panel kosmetologa",
};

export function PrototypeApp() {
  const [state, dispatch] = useReducer(simReducer, initialSimState);

  const beat = scenarioBeats[state.beat];
  const facts = factsFor(state.beat);
  const journal = journalFor(state.beat);
  const advance = () => dispatch({ type: "NEXT" });

  useEffect(() => {
    if (!state.playing || state.beat >= lastBeat) {
      return;
    }

    const timer = setTimeout(() => dispatch({ type: "NEXT" }), beat.holdMs);

    return () => clearTimeout(timer);
  }, [state.playing, state.beat, beat.holdMs]);

  const rail = (
    <SimulationRail
      step={beat.step}
      beat={state.beat}
      totalBeats={scenarioBeats.length}
      narration={beat.narration}
      playing={state.playing}
      journalCount={journal.length}
      onTogglePlay={() => dispatch({ type: "TOGGLE_PLAY" })}
      onNext={advance}
      onReset={() => dispatch({ type: "RESET" })}
      onOpenJournal={() => dispatch({ type: "SET_DRAWER", open: true })}
      onSelectStep={(step) => dispatch({ type: "GO_TO_STEP", step })}
    />
  );

  const drawer = state.drawerOpen ? (
    <AutomationDrawer entries={journal} onClose={() => dispatch({ type: "SET_DRAWER", open: false })} />
  ) : null;

  const roleMenu = state.roleMenuOpen ? (
    <div className="role-menu">
      <span>Wybierz rolę</span>
      {roleOptions.map((option) => (
        <button
          type="button"
          className={state.role === option.id ? "is-active" : ""}
          onClick={() => dispatch({ type: "SET_ROLE", role: option.id })}
          key={option.id}
        >
          <UserCog aria-hidden="true" />
          <div>
            <strong>{option.label}</strong>
            <small>{option.detail}</small>
          </div>
          {state.role === option.id ? <Sparkles aria-hidden="true" /> : null}
        </button>
      ))}
    </div>
  ) : null;

  if (state.screen === "visit") {
    return (
      <div className="salon-app specialist-app">
        <header className="mobile-header">
          <div className="product-logo">
            <div className="lotus-mark">
              <Sparkles aria-hidden="true" />
            </div>
            <div>
              <strong>SalonOS</strong>
              <span>Pracownia Wdzięku i Urody</span>
            </div>
          </div>
          <div>
            <button type="button" aria-label="Powiadomienia">
              <Bell aria-hidden="true" />
              <b>{journal.length}</b>
            </button>
            <div className="role-switcher">
              <button
                type="button"
                className="role-trigger"
                onClick={() => dispatch({ type: "TOGGLE_ROLE_MENU" })}
              >
                <UserCog aria-hidden="true" /> Kosmetolog <i />
              </button>
              {roleMenu}
            </div>
          </div>
        </header>

        {rail}

        <SpecialistScreen facts={facts} onAdvance={advance} />

        <button
          type="button"
          className="mobile-automation-trigger"
          onClick={() => dispatch({ type: "SET_DRAWER", open: true })}
        >
          <Waypoints aria-hidden="true" />
          <span>Dziennik zdarzeń</span>
          <b>{journal.length}</b>
        </button>

        <nav className="mobile-bottom-bar">
          <button type="button">
            <House aria-hidden="true" /> Dziś
          </button>
          <button type="button">
            <CalendarDays aria-hidden="true" /> Grafik
          </button>
          <button type="button" className="mobile-plus" aria-label="Dodaj">
            <Plus aria-hidden="true" />
          </button>
          <button type="button">
            <UsersRound aria-hidden="true" /> Klienci
          </button>
          <button type="button">
            <MessageSquareText aria-hidden="true" /> CRM
          </button>
        </nav>

        {drawer}
      </div>
    );
  }

  return (
    <div className="salon-app">
      <aside className="desktop-sidebar">
        <div className="product-logo">
          <div className="lotus-mark">
            <Sparkles aria-hidden="true" />
          </div>
          <div>
            <strong>SalonOS</strong>
            <span>Pracownia Wdzięku i Urody</span>
          </div>
        </div>

        <div className="sidebar-separator" />
        <div className="sidebar-caption">
          <span /> Scenariusz demonstracyjny
        </div>

        <nav className="desktop-nav">
          {navItems.map((item) => {
            const Icon = item.icon;
            const badge =
              item.id === "planning" && !facts.assignmentConfirmed && facts.slotAccepted
                ? "1"
                : item.id === "settlement" && facts.visitCompleted && !facts.settled
                  ? "1"
                  : null;

            return (
              <button
                type="button"
                className={state.screen === item.id ? "is-active" : ""}
                onClick={() => dispatch({ type: "SET_SCREEN", screen: item.id })}
                key={item.id}
              >
                <Icon aria-hidden="true" />
                <span>{item.label}</span>
                {badge ? <b>{badge}</b> : null}
              </button>
            );
          })}
        </nav>

        <div className="sidebar-spacer" />

        <div className="sidebar-person">
          <div className="mini-avatar">MG</div>
          <div>
            <strong>Mateusz Goszczycki</strong>
            <span>tryb prezentacji</span>
          </div>
        </div>

        <button type="button" className="sidebar-location">
          <MapPin aria-hidden="true" />
          <span>Salon Rzeszów</span>
          <ChevronDown aria-hidden="true" />
        </button>

        <button type="button" className="collapse-sidebar">
          <PanelLeftClose aria-hidden="true" /> Zwiń nawigację
        </button>
      </aside>

      <div className="desktop-workspace">
        <header className="desktop-topbar">
          <div className="topbar-left">
            <h1>{roleTitles[state.role]}</h1>
            <span className="ui-badge ui-badge-violet">prototyp</span>
          </div>

          <div className="topbar-actions">
            <button type="button" className="location-trigger">
              <Building2 aria-hidden="true" /> Firma A + Firma B
            </button>
            <button type="button" className="square-button notification-button" aria-label="Powiadomienia">
              <Bell aria-hidden="true" />
              <b>{journal.length}</b>
            </button>
            <div className="role-switcher">
              <button
                type="button"
                className="role-trigger"
                onClick={() => dispatch({ type: "TOGGLE_ROLE_MENU" })}
              >
                <UserCog aria-hidden="true" />
                {roleOptions.find((option) => option.id === state.role)?.label}
                <i />
              </button>
              {roleMenu}
            </div>
          </div>
        </header>

        {rail}

        {state.screen === "overview" ? (
          <OverviewScreen
            facts={facts}
            onNavigate={(screen) => dispatch({ type: "SET_SCREEN", screen })}
          />
        ) : null}
        {state.screen === "calendar" ? <CalendarScreen facts={facts} beat={state.beat} onAdvance={advance} /> : null}
        {state.screen === "planning" ? <PlanningScreen facts={facts} onAdvance={advance} /> : null}
        {state.screen === "settlement" ? (
          <SettlementScreen
            facts={facts}
            onAdvance={advance}
            onNavigate={(screen) => dispatch({ type: "SET_SCREEN", screen })}
          />
        ) : null}
        {state.screen === "client" ? (
          <ClientScreen
            facts={facts}
            onAdvance={advance}
            onNavigate={(screen) => dispatch({ type: "SET_SCREEN", screen })}
          />
        ) : null}
      </div>

      {drawer}
    </div>
  );
}
