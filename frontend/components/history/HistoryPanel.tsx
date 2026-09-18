"use client";

import { Clock3, ExternalLink, Search, Trash2 } from "lucide-react";
import type { HistoryNode } from "../../types/history";

interface Props { nodes: HistoryNode[]; current: number | null; search: string; results: HistoryNode[] | null; onSearch: (value: string) => void; onDelete: (id: number) => void; }

export function HistoryPanel({ nodes, current, search, results, onSearch, onDelete }: Props) {
  const shown = results && search ? results : nodes;
  return <aside className="history-panel panel">
    <div className="panel-heading"><div><span className="eyebrow">01 / MEMORY</span><h2>History</h2></div><span className="count-badge">{nodes.length.toString().padStart(2, "0")}</span></div>
    <label className="search-field"><Search size={15} /><input value={search} onChange={(event) => onSearch(event.target.value)} placeholder="Search history" /></label>
    <div className="history-list">
      {shown.length === 0 ? <div className="empty-small"><Clock3 size={22} /><span>{search ? "No matching nodes" : "No browsing history yet"}</span></div> : shown.map((node) => <div className={`history-item ${node.id === current ? "is-current" : ""}`} key={node.id}>
        <div className="favicon"><GlobeMark /></div><div className="history-copy"><strong>{node.title}</strong><span>{domain(node.url)}</span></div>{node.id === current && <span className="current-pill">CURRENT</span>}<button className="delete-button" aria-label={`Delete ${node.title}`} onClick={() => onDelete(node.id)}><Trash2 size={15} /></button>
      </div>)}
    </div>
    <div className="panel-foot"><span><span className="live-dot" /> BACKEND CONNECTED</span><span>O(n) SEARCH</span></div>
  </aside>;
}

export function domain(url: string) { return url.replace(/^https?:\/\//, "").split("/")[0] || url; }
function GlobeMark() { return <span className="globe-mark">◎</span>; }