import { ArrowDownToLine, ArrowLeft, ArrowRight, Eraser, Search, Trash2 } from "lucide-react";
import type { OperationKind, OperationLogEntry } from "../../types/history";

const icons = { INSERT: ArrowDownToLine, BACKWARD: ArrowLeft, FORWARD: ArrowRight, DELETE: Trash2, SEARCH: Search, CLEAR: Eraser };
export function OperationLog({ entries }: { entries: OperationLogEntry[] }) {
  return <section className="log-panel panel"><div className="section-title"><div><span className="eyebrow">03 / ACTIVITY</span><h2>Operation log</h2></div><span className="live-label"><i className="live-dot" /> LIVE</span></div><div className="log-list">{entries.length === 0 ? <p className="muted">Operations will appear here as you explore the structure.</p> : entries.map((entry) => { const Icon = icons[entry.kind]; return <div className="log-entry" key={entry.id}><span className={`log-icon ${entry.kind.toLowerCase()}`}><Icon size={14} /></span><div><strong>{entry.label}</strong><span>{entry.detail}</span></div><time>{entry.time}</time></div>; })}</div></section>;
}