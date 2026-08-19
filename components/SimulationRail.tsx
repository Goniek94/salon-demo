"use client";

import { Check, Pause, Play, RotateCcw, SkipForward, Sparkles, Waypoints } from "lucide-react";

import { scenarioSteps } from "../lib/simulation";

interface SimulationRailProps {
  step: number;
  beat: number;
  totalBeats: number;
  narration: string;
  playing: boolean;
  journalCount: number;
  onTogglePlay: () => void;
  onNext: () => void;
  onReset: () => void;
  onOpenJournal: () => void;
  onSelectStep: (step: number) => void;
}

export function SimulationRail({
  step,
  beat,
  totalBeats,
  narration,
  playing,
  journalCount,
  onTogglePlay,
  onNext,
  onReset,
  onOpenJournal,
  onSelectStep,
}: SimulationRailProps) {
  const finished = beat >= totalBeats - 1;

  return (
    <div className="simulation-rail">
      <div className="simulation-title">
        <Sparkles aria-hidden="true" />
        <div>
          <strong>Symulacja na żywo</strong>
          <span>{narration}</span>
        </div>
      </div>

      <div className="simulation-steps">
        {scenarioSteps.map((item, index) => {
          const state = index < step ? "is-done" : index === step ? "is-current" : "";

          return (
            <div
              key={item.id}
              className={state}
              role="button"
              tabIndex={0}
              aria-current={index === step ? "step" : undefined}
              onClick={() => onSelectStep(index)}
              onKeyDown={(event) => {
                if (event.key === "Enter" || event.key === " ") {
                  event.preventDefault();
                  onSelectStep(index);
                }
              }}
            >
              <i>{index < step ? <Check aria-hidden="true" /> : index + 1}</i>
              <span>{item.label}</span>
            </div>
          );
        })}
      </div>

      <div className="simulation-actions">
        <button type="button" onClick={onTogglePlay}>
          {playing ? <Pause aria-hidden="true" /> : <Play aria-hidden="true" />}
          {playing ? "Wstrzymaj" : finished ? "Odtwórz ponownie" : "Odtwórz"}
          <b>{beat + 1}</b>
        </button>
        <button type="button" onClick={onNext} disabled={finished}>
          <SkipForward aria-hidden="true" /> Dalej
        </button>
        <button type="button" onClick={onReset}>
          <RotateCcw aria-hidden="true" /> Reset
        </button>
        <button type="button" onClick={onOpenJournal}>
          <Waypoints aria-hidden="true" /> Dziennik
          <b>{journalCount}</b>
        </button>
      </div>
    </div>
  );
}
