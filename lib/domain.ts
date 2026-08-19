export type DemoView =
  | "overview"
  | "calendar"
  | "planning"
  | "client"
  | "settlement"
  | "automation";

export type VisitStatus =
  | "draft"
  | "needs-assignment"
  | "confirmed"
  | "in-progress"
  | "completed"
  | "settled";

export type ResourceKind = "employee" | "room" | "device";

export interface Treatment {
  id: string;
  name: string;
  group: "Twarz" | "Ciało" | "Depilacja laserowa";
  durationMinutes: number;
  value: number;
  company: "Firma A" | "Firma B";
  resourceRequirements: string[];
}

export interface ResourceAssignment {
  employee: string;
  room: string;
  device: string;
}

export interface Visit {
  id: string;
  clientName: string;
  date: string;
  start: string;
  end: string;
  status: VisitStatus;
  treatments: Treatment[];
  assignment?: ResourceAssignment;
}

export interface TherapyStep {
  id: string;
  label: string;
  plannedDate: string;
  status: "completed" | "current" | "future";
  completedDate?: string;
}

export interface LedgerEntry {
  id: string;
  date: string;
  label: string;
  type: "purchase" | "usage" | "adjustment";
  amount: number;
  balanceAfter: number;
}

export interface AutomationEvent {
  id: string;
  label: string;
  detail: string;
  status: "done" | "scheduled" | "waiting";
  time: string;
}

export interface DemoState {
  activeView: DemoView;
  resourceCheck: "idle" | "conflict" | "alternative-selected";
  assignmentConfirmed: boolean;
  settlementFinalized: boolean;
  followUpCreated: boolean;
}

export type DemoAction =
  | { type: "NAVIGATE"; view: DemoView }
  | { type: "CHECK_RESOURCES" }
  | { type: "SELECT_ALTERNATIVE" }
  | { type: "CONFIRM_ASSIGNMENT" }
  | { type: "FINALIZE_SETTLEMENT" }
  | { type: "CREATE_FOLLOW_UP" }
  | { type: "RESET" };

export const initialDemoState: DemoState = {
  activeView: "overview",
  resourceCheck: "idle",
  assignmentConfirmed: false,
  settlementFinalized: false,
  followUpCreated: false,
};

export function demoReducer(state: DemoState, action: DemoAction): DemoState {
  switch (action.type) {
    case "NAVIGATE":
      return { ...state, activeView: action.view };
    case "CHECK_RESOURCES":
      return { ...state, resourceCheck: "conflict" };
    case "SELECT_ALTERNATIVE":
      return {
        ...state,
        resourceCheck: "alternative-selected",
        activeView: "planning",
      };
    case "CONFIRM_ASSIGNMENT":
      return { ...state, assignmentConfirmed: true, activeView: "client" };
    case "FINALIZE_SETTLEMENT":
      return {
        ...state,
        settlementFinalized: true,
        activeView: "automation",
      };
    case "CREATE_FOLLOW_UP":
      return { ...state, followUpCreated: true };
    case "RESET":
      return initialDemoState;
    default:
      return state;
  }
}

