import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { Modal } from "../components/Modal";
import { fullName, ownerName, photoUrl } from "../data";
import { useCandidates } from "../store";
import type { AircallStatus, Candidate, CvFile, FormField } from "../types";

export function TaskDetail() {
  const { id } = useParams();
  const { candidates, setAircallStatus, approve, reject } = useCandidates();
  const candidate = candidates.find((item) => item.id === id);

  if (!candidate) {
    return (
      <main className="page">
        <Link to="/" className="back">
          <Chevron />
          Tasks
        </Link>
        <p className="missing">This task could not be found.</p>
      </main>
    );
  }

  return (
    <TaskDetailBody
      key={candidate.id}
      candidate={candidate}
      onCallStatus={setAircallStatus}
      onApprove={(fields) => approve(candidate.id, fields)}
      onReject={(reason) => reject(candidate.id, reason)}
    />
  );
}

function TaskDetailBody({
  candidate,
  onCallStatus,
  onApprove,
  onReject,
}: {
  candidate: Candidate;
  onCallStatus: (id: string, status: AircallStatus, activity?: string) => void;
  onApprove: (fields: FormField[]) => void;
  onReject: (reason: string) => void;
}) {
  const [callPhase, setCallPhase] = useState<"dialing" | "connected" | null>(
    null,
  );
  const [approveOpen, setApproveOpen] = useState(false);
  const [rejectOpen, setRejectOpen] = useState(false);
  const [cvOpen, setCvOpen] = useState(false);
  const deal = candidate.currentDeal;
  const decided = deal.outcome !== "open";

  function startCall() {
    const alreadyLive = candidate.aircallStatus === "In progress";
    if (!alreadyLive) onCallStatus(candidate.id, "In progress");
    setCallPhase(alreadyLive ? "connected" : "dialing");
  }

  return (
    <main className="page detail-page">
      <Link to="/" className="back">
        <Chevron />
        Tasks
      </Link>

      <div className="board">
        <section className="col identity-col" aria-label="Contact">
          <div className="contact-block">
            <h2>Contact</h2>
            <div className="identity">
              <img
                className="avatar"
                src={photoUrl(candidate.photo)}
                alt=""
              />
              <div>
                <p className="candidate-name">{fullName(candidate)}</p>
                <p>{candidate.type}</p>
                <p>{candidate.email}</p>
                <p>{candidate.phone}</p>
              </div>
            </div>

            <button type="button" className="pill pill-black pill-wide" onClick={startCall}>
              <PhoneIcon />
              Aircall
            </button>
            <p className="call-status">
              Aircall status · {candidate.aircallStatus}
            </p>
          </div>

          <div className="cv-block">
            <button
              type="button"
              className="cv-card"
              onClick={() => setCvOpen(true)}
            >
              <CvPaper cv={candidate.cv} candidate={candidate} compact />
              <span className="cv-meta">
                <span className="cv-file">{candidate.cv.fileName}</span>
                <span>
                  {candidate.cv.uploadedAt} · via {candidate.cv.source}
                </span>
              </span>
            </button>
          </div>
        </section>

        <section className="col center-col" aria-label="Deal">
          <div className="block">
            <div className="block-heading">
              <h2>Deal info</h2>
              {deal.outcome !== "open" && (
                <span className={`outcome outcome-${deal.outcome}`}>
                  {deal.outcome === "successful" ? "Successful" : "Rejected"}
                </span>
              )}
            </div>
            <div className="deal-highlight">
              <div>
                <p className="field-label">Deal stage:</p>
                <p className="field-value">{deal.stage}</p>
              </div>
              <div>
                <p className="field-label">Last activity date</p>
                <p className="field-value">{deal.lastActivity}</p>
                <p className="field-date">{deal.lastActivityDate}</p>
              </div>
            </div>
            <dl className="properties">
              {deal.properties.map((property) => (
                <div key={property.label}>
                  <dt>{property.label}</dt>
                  <dd>
                    {property.label === "Deal stage" ? deal.stage : property.value}
                  </dd>
                </div>
              ))}
              <div>
                <dt>Deal owner</dt>
                <dd>{ownerName(candidate.ownerId)}</dd>
              </div>
              {deal.rejectReason && (
                <div>
                  <dt>Reject reason</dt>
                  <dd>{deal.rejectReason}</dd>
                </div>
              )}
            </dl>
          </div>

          <div className="center-rest">
          <div className="block">
            <h2>Past Deal</h2>
            {candidate.pastDeals.length === 0 ? (
              <p className="empty-copy">No past deals</p>
            ) : (
              <ul className="stack-list">
                {candidate.pastDeals.map((past) => (
                  <li key={past.id}>
                    <p className="item-title">{past.name}</p>
                    <p>
                      {past.stage} ·{" "}
                      {past.outcome === "successful" ? "Successful" : "Rejected"}
                    </p>
                    <p className="field-date">{past.closedDate}</p>
                    {past.rejectReason && (
                      <p className="field-date">Reason: {past.rejectReason}</p>
                    )}
                  </li>
                ))}
              </ul>
            )}
          </div>

          <div className="block">
            <h2>Related contact</h2>
            {candidate.relatedContacts.length === 0 ? (
              <p className="empty-copy">No related contacts</p>
            ) : (
              <ul className="contact-list">
                {candidate.relatedContacts.map((contact) => (
                  <li key={contact.id}>
                    <img
                      className="avatar avatar-sm"
                      src={photoUrl(contact.photo)}
                      alt=""
                    />
                    <div>
                      <p className="item-title">{contact.name}</p>
                    </div>
                    <p>{contact.phone}</p>
                    <p className="clip">{contact.email}</p>
                  </li>
                ))}
              </ul>
            )}
          </div>

          <div className="block">
            <h2>Previous clients</h2>
            {candidate.previousClients.length === 0 ? (
              <p className="empty-copy">No previous clients</p>
            ) : (
              <ul className="stack-list">
                {candidate.previousClients.map((client) => (
                  <li key={client.id}>
                    <p className="item-title">{client.name}</p>
                    <p>
                      {client.role} · {client.period}
                    </p>
                  </li>
                ))}
              </ul>
            )}
          </div>
          </div>
        </section>

        <section className="col todo-col" aria-label="To do">
          <h2>To do</h2>
          <button
            type="button"
            className="pill pill-primary"
            onClick={() => setApproveOpen(true)}
            disabled={decided}
          >
            {deal.outcome === "successful" ? "Approved" : "Approve"}
          </button>
          <button
            type="button"
            className="pill"
            onClick={() => setRejectOpen(true)}
            disabled={decided}
          >
            {deal.outcome === "rejected" ? "Rejected" : "Reject"}
          </button>
        </section>
      </div>

      {callPhase && (
        <CallDialog
          candidate={candidate}
          initialPhase={callPhase}
          onClose={() => setCallPhase(null)}
          onFinish={(status) => {
            const activity =
              status === "Completed"
                ? "Call via Aircall — completed"
                : "Call via Aircall — no answer";
            onCallStatus(candidate.id, status, activity);
            setCallPhase(null);
          }}
        />
      )}

      {approveOpen && (
        <ApproveDialog
          candidate={candidate}
          onClose={() => setApproveOpen(false)}
          onConfirm={(fields) => {
            onApprove(fields);
            setApproveOpen(false);
          }}
        />
      )}

      {rejectOpen && (
        <RejectDialog
          onClose={() => setRejectOpen(false)}
          onConfirm={(reason) => {
            onReject(reason);
            setRejectOpen(false);
          }}
        />
      )}

      {cvOpen && (
        <Modal
          title="Most recent CV"
          onClose={() => setCvOpen(false)}
        >
          <p className="modal-kicker">
            {candidate.cv.fileName} · {candidate.cv.uploadedAt} · via{" "}
            {candidate.cv.source}
          </p>
          <CvPaper cv={candidate.cv} candidate={candidate} />
        </Modal>
      )}
    </main>
  );
}

function ApproveDialog({
  candidate,
  onClose,
  onConfirm,
}: {
  candidate: Candidate;
  onClose: () => void;
  onConfirm: (fields: FormField[]) => void;
}) {
  const [fields, setFields] = useState<FormField[]>(candidate.form.fields);
  const incomplete = fields.some((field) => field.value.trim() === "");

  return (
    <Modal title={candidate.form.title} onClose={onClose}>
      <p className="modal-kicker">Fill in the form, then confirm approval.</p>
      <form
        className="modal-form"
        onSubmit={(event) => {
          event.preventDefault();
          if (incomplete) return;
          onConfirm(fields);
        }}
      >
        {fields.map((field, index) => (
          <label key={field.label}>
            {field.label}
            <input
              value={field.value}
              onChange={(event) => {
                const next = event.target.value;
                setFields((current) =>
                  current.map((item, itemIndex) =>
                    itemIndex === index ? { ...item, value: next } : item,
                  ),
                );
              }}
            />
          </label>
        ))}
        <div className="modal-actions">
          <button type="button" className="pill" onClick={onClose}>
            Cancel
          </button>
          <button type="submit" className="pill pill-primary" disabled={incomplete}>
            Confirm approve
          </button>
        </div>
      </form>
    </Modal>
  );
}

function RejectDialog({
  onClose,
  onConfirm,
}: {
  onClose: () => void;
  onConfirm: (reason: string) => void;
}) {
  const [reason, setReason] = useState("");
  const [needsReason, setNeedsReason] = useState(false);

  return (
    <Modal title="Reject candidate" onClose={onClose}>
      <form
        className="modal-form"
        onSubmit={(event) => {
          event.preventDefault();
          const trimmed = reason.trim();
          if (!trimmed) {
            setNeedsReason(true);
            return;
          }
          onConfirm(trimmed);
        }}
      >
        <label>
          Reject reason
          <textarea
            value={reason}
            rows={4}
            placeholder="Reject reason"
            onChange={(event) => {
              setReason(event.target.value);
              if (event.target.value.trim()) setNeedsReason(false);
            }}
          />
          {needsReason && <span className="reason-hint">Add a reject reason</span>}
        </label>
        <div className="modal-actions">
          <button type="button" className="pill" onClick={onClose}>
            Cancel
          </button>
          <button type="submit" className="pill pill-black">
            Confirm reject
          </button>
        </div>
      </form>
    </Modal>
  );
}

function CallDialog({
  candidate,
  initialPhase,
  onClose,
  onFinish,
}: {
  candidate: Candidate;
  initialPhase: "dialing" | "connected";
  onClose: () => void;
  onFinish: (status: "Completed" | "No answer") => void;
}) {
  const [phase, setPhase] = useState(initialPhase);

  useEffect(() => {
    if (phase !== "dialing") return;
    const timer = window.setTimeout(() => setPhase("connected"), 900);
    return () => window.clearTimeout(timer);
  }, [phase]);

  return (
    <Modal title={`Call ${fullName(candidate)}`} onClose={onClose}>
      <div className="call-panel">
        <div className={`call-pulse${phase === "connected" ? " is-live" : ""}`} />
        <p className="call-number">{candidate.phone}</p>
        <p className="call-phase">
          {phase === "dialing" ? "Dialing through Aircall…" : "Connected"}
        </p>
        <div className="call-actions">
          <button
            type="button"
            className="pill pill-primary"
            disabled={phase === "dialing"}
            onClick={() => onFinish("Completed")}
          >
            Completed
          </button>
          <button
            type="button"
            className="pill"
            disabled={phase === "dialing"}
            onClick={() => onFinish("No answer")}
          >
            No answer
          </button>
        </div>
      </div>
    </Modal>
  );
}

function CvPaper({
  cv,
  candidate,
  compact = false,
}: {
  cv: CvFile;
  candidate: Candidate;
  compact?: boolean;
}) {
  return (
    <article className={`cv-paper${compact ? " is-compact" : ""}`}>
      {compact ? (
        <p className="cv-heading">CV</p>
      ) : (
        <p className="cv-kicker">Curriculum vitae</p>
      )}
      <h3>{fullName(candidate)}</h3>
      <p className="cv-role">
        {candidate.type} · {candidate.residentialLocation}
      </p>
      <p className="cv-profile">{cv.profile}</p>
      <p className="cv-kicker">Experience</p>
      <ul>
        {(compact ? cv.experience.slice(0, 1) : cv.experience).map((item) => (
          <li key={`${item.place}-${item.period}`}>
            <strong>{item.role}</strong>
            <span>
              {item.place} · {item.period}
            </span>
          </li>
        ))}
      </ul>
      {!compact && (
        <>
          <p className="cv-kicker">Education</p>
          <p>{cv.education}</p>
          <p className="cv-kicker">Languages</p>
          <p>{cv.languages}</p>
        </>
      )}
    </article>
  );
}

function Chevron() {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" aria-hidden="true">
      <path
        d="M11.5 3.5 6 9l5.5 5.5"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function PhoneIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" aria-hidden="true">
      <path
        d="M3.2 2.6h2.1l1.1 2.6-1.3 1a8.4 8.4 0 0 0 3.7 3.7l1-1.3 2.6 1.1v2.1c0 .6-.5 1.1-1.1 1A10.2 10.2 0 0 1 2.2 3.7c-.1-.6.4-1.1 1-1.1Z"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.3"
        strokeLinejoin="round"
      />
    </svg>
  );
}
