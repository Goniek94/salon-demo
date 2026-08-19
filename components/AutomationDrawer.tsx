"use client";

import { BellRing, CircleCheckBig, Send, Sparkles, X } from "lucide-react";

import type { JournalEntry } from "../lib/simulation";

const toneIcon = {
  violet: Sparkles,
  blue: Send,
  green: CircleCheckBig,
  orange: BellRing,
} as const;

const statusLabel = {
  done: "wykonane",
  scheduled: "zaplanowane",
  waiting: "oczekuje",
} as const;

interface AutomationDrawerProps {
  entries: JournalEntry[];
  onClose: () => void;
}

export function AutomationDrawer({ entries, onClose }: AutomationDrawerProps) {
  const scheduled = entries.filter((entry) => entry.status !== "done").length;

  return (
    <div className="automation-overlay">
      <button
        type="button"
        className="automation-backdrop"
        aria-label="Zamknij dziennik"
        onClick={onClose}
      />
      <aside className="automation-drawer">
        <div className="automation-heading">
          <div>
            <span>Ślad systemowy</span>
            <h2>Dziennik zdarzeń</h2>
            <p>Każdy krok scenariusza zostawia zapis, który w wersji produkcyjnej trafia do audytu.</p>
          </div>
          <button type="button" onClick={onClose} aria-label="Zamknij">
            <X aria-hidden="true" />
          </button>
        </div>

        <div className="automation-status">
          <span />
          <div>
            <strong>Automatyzacje aktywne</strong>
            <small>
              {entries.length} zdarzeń w tej symulacji, w tym {scheduled} zaplanowane na przyszłość.
            </small>
          </div>
        </div>

        <div className="automation-list">
          {entries.length === 0 ? (
            <article>
              <i className="activity-violet">
                <Sparkles aria-hidden="true" />
              </i>
              <div>
                <span>—</span>
                <strong>Scenariusz jeszcze się nie rozpoczął</strong>
                <p>Uruchom symulację, aby zobaczyć, jakie zdarzenia zapisuje system.</p>
              </div>
            </article>
          ) : (
            [...entries].reverse().map((entry) => {
              const Icon = toneIcon[entry.tone];

              return (
                <article key={entry.id}>
                  <i className={`activity-${entry.tone}`}>
                    <Icon aria-hidden="true" />
                  </i>
                  <div>
                    <span>
                      {entry.time} · {statusLabel[entry.status]}
                    </span>
                    <strong>{entry.label}</strong>
                    <p>{entry.detail}</p>
                  </div>
                </article>
              );
            })
          )}
        </div>
      </aside>
    </div>
  );
}
