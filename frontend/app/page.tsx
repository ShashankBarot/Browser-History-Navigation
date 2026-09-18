"use client";

import dynamic from "next/dynamic";
import { useEffect, useMemo, useState } from "react";
import { AlertCircle, ArrowUpRight, Database, Eraser, Server, Sparkles, Wifi } from "lucide-react";
import { BrowserBar } from "../components/browser/BrowserBar";
import { ComplexityPanel } from "../components/complexity/ComplexityPanel";
import { HistoryPanel } from "../components/history/HistoryPanel";
import { LinkedListVisualization } from "../components/linked-list/LinkedListVisualization";
import { HeroLinkedList } from "../components/linked-list/HeroLinkedList";
import { OperationLog } from "../components/operation-log/OperationLog";
import { api } from "../lib/api";
import type { HistoryResponse, OperationKind, OperationLogEntry } from "../types/history";

const Beams = dynamic(() => import("../components/effects/Beams"), { ssr: false });

const emptyHistory: HistoryResponse = { head: null, tail: null, current: null, nodes: [] };
const initialOperation = { kind: "INSERT" as OperationKind, label: "Awaiting input" };

export default function Home() {
  const [history, setHistory] = useState<HistoryResponse>(emptyHistory);
  const [address, setAddress] = useState("https://github.com");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [searchResults, setSearchResults] = useState<HistoryResponse["nodes"] | null>(null);
  const [operation, setOperation] = useState(initialOperation);
  const [logs, setLogs] = useState<OperationLogEntry[]>([]);

  useEffect(() => { run(() => api.getHistory()).then((result) => { if (result) setHistory(result as HistoryResponse); }); }, []);

  const currentNode = history.nodes.find((node) => node.id === history.current);
  const currentTitle = currentNode?.title || "No page loaded";
  const addLog = (kind: OperationKind, label: string, detail: string) => {
    setOperation({ kind, label });
    setLogs((items) => [{ id: Date.now(), kind, label, detail, time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }) }, ...items].slice(0, 8));
  };
  async function run<T>(action: () => Promise<T>, kind?: OperationKind, label?: string) {
    setLoading(true); setError(null);
    try { const result = await action(); if (kind && label) addLog(kind, label, kind === "SEARCH" ? `Query: ${search}` : currentTitle); return result; }
    catch (caught) { setError(caught instanceof Error ? caught.message : "Something went wrong"); }
    finally { setLoading(false); }
  }
  const visit = async () => {
    const raw = address.trim(); const normalized = /^https?:\/\//i.test(raw) ? raw : `https://${raw}`;
    try { const parsed = new URL(normalized); const result = await run(() => api.visitPage(normalized, titleFor(parsed.hostname)), "INSERT", "Insert new page"); if (result) { setHistory(result as HistoryResponse); setAddress(normalized); } }
    catch { setError("Enter a valid URL, such as github.com"); }
  };
  const navigate = async (direction: "back" | "forward") => { const result = await run(direction === "back" ? api.goBack : api.goForward, direction === "back" ? "BACKWARD" : "FORWARD", direction === "back" ? "Backward traversal" : "Forward traversal"); if (result) setHistory(result as HistoryResponse); };
  const refresh = async () => { const result = await run(() => api.getHistory()); if (result) setHistory(result as HistoryResponse); };
  const deleteNode = async (id: number) => { const node = history.nodes.find((item) => item.id === id); const result = await run(() => api.deleteNode(id), "DELETE", "Delete node"); if (result) { setHistory(result as HistoryResponse); addLog("DELETE", "Delete node", node?.title || "History entry"); } };
  const clear = async () => { const result = await run(() => api.clearHistory()); if (result) { setHistory(emptyHistory); addLog("CLEAR", "Clear history", "All nodes removed"); } };
  const updateSearch = async (value: string) => { setSearch(value); if (!value.trim()) { setSearchResults(null); return; } const result = await run(() => api.searchHistory(value), "SEARCH", "Search history"); if (result) { setSearchResults(result as HistoryResponse["nodes"]); addLog("SEARCH", "Search history", `Query: ${value}`); } };
  const highlighted = useMemo(() => searchResults?.map((node) => node.id) || [], [searchResults]);

  return <main className="app-shell">
    <header className="topbar"><div className="brand"><span className="brand-mark">[ ]</span><span>BROWSER HISTORY <span className="brand-slash">/</span> NAVIGATOR</span></div><div className="topbar-meta"><span className="status"><i className="live-dot" /> SYSTEM ONLINE</span><span className="version">v1.0 / PYTHON DS API</span></div></header>
    <section className="hero"><Beams beamWidth={3} beamHeight={30} beamNumber={30} lightColor="#00e9ff" beamColor="#000000" backgroundColor="#000000" speed={6.2} noiseIntensity={1.75} scale={0.2} rotation={30} /><div className="hero-shade" /><div className="hero-copy"><span className="eyebrow"><Sparkles size={12} /> INTERACTIVE DATA STRUCTURE LAB</span><h1>Browser history<br />navigator<span className="headline-dot">.</span></h1><p>A browser history simulator that makes every pointer, traversal, and insertion visible.</p></div><HeroLinkedList history={history} /></section>
    <div className="content-wrap">
      <div className="section-bar"><span><span className="eyebrow">WORKSPACE / LIVE SESSION</span><strong>{currentTitle}</strong></span><div className="section-actions"><span className="api-state"><Server size={13} /> FASTAPI</span><button className="outline-button" onClick={clear} disabled={loading || history.nodes.length === 0}><Eraser size={14} /> CLEAR HISTORY</button></div></div>
      <BrowserBar url={address} onUrlChange={setAddress} onVisit={visit} onBack={() => navigate("back")} onForward={() => navigate("forward")} onRefresh={refresh} canBack={history.current !== null && history.current !== history.head} canForward={history.current !== null && history.current !== history.tail} busy={loading} />
      {error && <div className="notice error-notice"><AlertCircle size={16} /><span>{friendlyError(error)}</span><button onClick={() => setError(null)}>DISMISS</button></div>}
      <div className="workspace-grid"><HistoryPanel nodes={history.nodes} current={history.current} search={search} results={searchResults} onSearch={updateSearch} onDelete={deleteNode} /><div className="main-column"><section className="viewport panel"><div className="viewport-top"><span><Wifi size={14} /> SIMULATED WEB VIEW</span><span>{currentNode ? new URL(currentNode.url).hostname : "about:blank"}</span></div><div className="viewport-content">{currentNode ? <><span className="page-kicker">{domainLabel(currentNode.url)}</span><h2>{currentNode.title}</h2><p>You are viewing a safe simulation of this page. The linked list behind it is real.</p><button className="text-button" onClick={visit}>Visit again <ArrowUpRight size={15} /></button></> : <><Database size={30} /><h2>Your browser is ready.</h2><p>Enter a destination above to create the first history node.</p></>}</div><div className="viewport-footer"><span>RENDER MODE: SIMULATION</span><span>NO EXTERNAL CONTENT LOADED</span></div></section><LinkedListVisualization history={history} highlighted={highlighted} /><div className="bottom-grid"><OperationLog entries={logs} /><ComplexityPanel operation={operation} /></div></div></div>
    </div>
    <footer><span>PYTHON DOUBLY LINKED LIST <i /> NEXT.JS VISUALIZER</span><span>DATA STRUCTURES CAPSTONE / 2026</span></footer>
  </main>;
}

function titleFor(host: string) { const name = host.replace(/^www\./, "").split(".")[0]; return name.charAt(0).toUpperCase() + name.slice(1); }
function domainLabel(url: string) { return url.replace(/^https?:\/\//, "").split("/")[0].toUpperCase(); }
function friendlyError(message: string) { if (message.includes("No previous")) return "No previous page. You are at HEAD."; if (message.includes("No forward")) return "No forward page. You are at TAIL."; if (message.includes("Node not found")) return "History entry not found."; return message; }