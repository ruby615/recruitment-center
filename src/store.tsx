import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { cloneCandidates, TODAY_LABEL } from "./data";
import type { AircallStatus, Candidate, FormField } from "./types";

interface Store {
  candidates: Candidate[];
  setAircallStatus: (
    id: string,
    status: AircallStatus,
    activity?: string,
  ) => void;
  approve: (id: string, fields: FormField[]) => void;
  reject: (id: string, reason: string) => void;
}

const CandidateContext = createContext<Store | null>(null);

function patchDealActivity(candidate: Candidate, activity: string): Candidate {
  return {
    ...candidate,
    currentDeal: {
      ...candidate.currentDeal,
      lastActivity: activity,
      lastActivityDate: TODAY_LABEL,
      properties: candidate.currentDeal.properties.map((property) =>
        property.label === "Deal stage"
          ? { ...property, value: candidate.currentDeal.stage }
          : property,
      ),
    },
  };
}

export function CandidateProvider({ children }: { children: ReactNode }) {
  const [candidates, setCandidates] = useState<Candidate[]>(cloneCandidates);

  const update = useCallback(
    (id: string, recipe: (candidate: Candidate) => Candidate) => {
      setCandidates((current) =>
        current.map((candidate) =>
          candidate.id === id ? recipe(candidate) : candidate,
        ),
      );
    },
    [],
  );

  const setAircallStatus = useCallback(
    (id: string, status: AircallStatus, activity?: string) => {
      update(id, (candidate) => {
        const next = activity
          ? patchDealActivity(candidate, activity)
          : candidate;
        return { ...next, aircallStatus: status };
      });
    },
    [update],
  );

  const approve = useCallback(
    (id: string, fields: FormField[]) => {
      update(id, (candidate) => {
        const stage = "Closed won";
        const next: Candidate = {
          ...candidate,
          form: { ...candidate.form, fields },
          currentDeal: {
            ...candidate.currentDeal,
            outcome: "successful",
            stage,
            rejectReason: undefined,
          },
        };
        return patchDealActivity(next, "Candidate approved");
      });
    },
    [update],
  );

  const reject = useCallback(
    (id: string, reason: string) => {
      update(id, (candidate) => {
        const stage = "Closed lost";
        const next: Candidate = {
          ...candidate,
          currentDeal: {
            ...candidate.currentDeal,
            outcome: "rejected",
            stage,
            rejectReason: reason,
          },
        };
        return patchDealActivity(next, "Candidate rejected");
      });
    },
    [update],
  );

  const value = useMemo(
    () => ({ candidates, setAircallStatus, approve, reject }),
    [candidates, setAircallStatus, approve, reject],
  );

  return (
    <CandidateContext.Provider value={value}>
      {children}
    </CandidateContext.Provider>
  );
}

export function useCandidates() {
  const store = useContext(CandidateContext);
  if (!store) {
    throw new Error("useCandidates must be used within CandidateProvider");
  }
  return store;
}
