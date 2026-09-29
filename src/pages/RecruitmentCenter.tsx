import { useEffect, useMemo, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { OWNERS, dealCounts, ownerName } from "../data";
import { useCandidates } from "../store";
import {
  CANDIDATE_TYPES,
  REGIONS,
  type CandidateType,
  type DealOutcome,
  type Region,
} from "../types";

const DEAL_STATES: { value: DealOutcome; label: string }[] = [
  { value: "open", label: "Open" },
  { value: "successful", label: "Successful" },
  { value: "rejected", label: "Rejected" },
];

export function RecruitmentCenter() {
  const { candidates } = useCandidates();
  const [region, setRegion] = useState<Region | "">("");
  const [type, setType] = useState<CandidateType | "">("");
  const [ownerId, setOwnerId] = useState("");
  const [dealState, setDealState] = useState<DealOutcome | "">("");

  const filtered = useMemo(
    () =>
      candidates.filter((candidate) => {
        if (region && candidate.region !== region) return false;
        if (type && candidate.type !== type) return false;
        if (ownerId && candidate.ownerId !== ownerId) return false;
        if (dealState && candidate.currentDeal.outcome !== dealState) return false;
        return true;
      }),
    [candidates, region, type, ownerId, dealState],
  );

  const filtersActive = Boolean(region || type || ownerId || dealState);

  function clearFilters() {
    setRegion("");
    setType("");
    setOwnerId("");
    setDealState("");
  }

  return (
    <main className="page">
      <h1>Recruitment center</h1>
      <h2 className="section-title">Tasks</h2>

      <div className="filter-bar">
        <div className="filters">
          <FilterMenu
            label="Region"
            value={region}
            options={REGIONS.map((item) => ({ value: item, label: item }))}
            onChange={(next) => setRegion(next as Region | "")}
          />
          <FilterMenu
            label="Type"
            value={type}
            options={CANDIDATE_TYPES.map((item) => ({ value: item, label: item }))}
            onChange={(next) => setType(next as CandidateType | "")}
          />
          <FilterMenu
            label="Deal owner"
            value={ownerId}
            options={OWNERS.map((owner) => ({
              value: owner.id,
              label: owner.name,
            }))}
            onChange={setOwnerId}
          />
          <FilterMenu
            label="Deal state"
            value={dealState}
            options={DEAL_STATES}
            onChange={(next) => setDealState(next as DealOutcome | "")}
          />
          {filtersActive && (
            <button type="button" className="text-button" onClick={clearFilters}>
              Clear filters
            </button>
          )}
        </div>
        <p className="result-count">
          {filtered.length} of {candidates.length} candidates
        </p>
      </div>

      <div className="table-scroll">
        <div className="table">
          <div className="cols head" role="row">
            <div className="th">Candidates</div>
            <div className="th">Email</div>
            <div className="th">Phone</div>
            <div className="th">Residential location</div>
            <div className="th">Region</div>
            <div className="th">Type</div>
            <div className="th">Deal owner</div>
            <div className="th">Deal state</div>
            <div className="th">Aircall</div>
            <div className="th">Action</div>
          </div>

          {filtered.length === 0 ? (
            <div className="empty-sheet">
              <p>No candidates match these filters.</p>
              <button type="button" className="pill" onClick={clearFilters}>
                Clear filters
              </button>
            </div>
          ) : (
            <div className="rows">
              {filtered.map((candidate) => {
                const counts = dealCounts(candidate);
                return (
                  <Link
                    key={candidate.id}
                    to={`/tasks/${candidate.id}`}
                    className="cols row"
                  >
                    <span>
                      {candidate.firstName} {candidate.lastName}
                    </span>
                    <span className="clip">{candidate.email}</span>
                    <span>{candidate.phone}</span>
                    <span>{candidate.residentialLocation}</span>
                    <span>{candidate.region}</span>
                    <span>{candidate.type}</span>
                    <span>{ownerName(candidate.ownerId)}</span>
                    <span className="counts">
                      <span className="count-success">
                        {counts.successful} successful
                      </span>
                      <span className="count-rejected">
                        {counts.rejected} rejected
                      </span>
                    </span>
                    <span className={`status status-${slug(candidate.aircallStatus)}`}>
                      <span className="status-dot" aria-hidden="true" />
                      {candidate.aircallStatus}
                    </span>
                    <span className="open-label">Open</span>
                  </Link>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </main>
  );
}

function slug(value: string) {
  return value.toLowerCase().replace(/\s+/g, "-");
}

function FilterMenu({
  label,
  value,
  options,
  onChange,
}: {
  label: string;
  value: string;
  options: { value: string; label: string }[];
  onChange: (value: string) => void;
}) {
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const selected = options.find((option) => option.value === value);

  useEffect(() => {
    if (!open) return;
    function onPointer(event: MouseEvent) {
      if (!rootRef.current?.contains(event.target as Node)) setOpen(false);
    }
    function onKey(event: KeyboardEvent) {
      if (event.key === "Escape") setOpen(false);
    }
    document.addEventListener("mousedown", onPointer);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onPointer);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  return (
    <div className={`hs-filter${open ? " is-open" : ""}`} ref={rootRef}>
      <button
        type="button"
        className={`hs-filter-button${value ? " is-active" : ""}`}
        aria-expanded={open}
        aria-haspopup="listbox"
        onClick={() => setOpen((current) => !current)}
      >
        <span>{selected ? `${label}: ${selected.label}` : label}</span>
        <Caret />
      </button>
      {open && (
        <div className="hs-filter-menu" role="listbox" aria-label={label}>
          <button
            type="button"
            role="option"
            aria-selected={value === ""}
            className={value === "" ? "is-selected" : ""}
            onClick={() => {
              onChange("");
              setOpen(false);
            }}
          >
            All
          </button>
          {options.map((option) => (
            <button
              key={option.value}
              type="button"
              role="option"
              aria-selected={option.value === value}
              className={option.value === value ? "is-selected" : ""}
              onClick={() => {
                onChange(option.value);
                setOpen(false);
              }}
            >
              {option.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

function Caret() {
  return (
    <svg width="8" height="6" viewBox="0 0 8 6" aria-hidden="true">
      <path d="M0 0.5h8L4 5.5z" fill="currentColor" />
    </svg>
  );
}
