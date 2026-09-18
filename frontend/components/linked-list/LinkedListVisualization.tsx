"use client";

import { motion } from "framer-motion";
import { ArrowLeftRight, CircleDot, Link2 } from "lucide-react";
import type { HistoryResponse } from "../../types/history";
import { domain } from "../history/HistoryPanel";

export function LinkedListVisualization({ history, highlighted }: { history: HistoryResponse; highlighted: number[] }) {
  return <section className="list-section panel">
    <div className="section-title"><div><span className="eyebrow">02 / POINTER GRAPH</span><h2>Doubly linked list</h2></div><div className="legend"><span><i className="legend-dot current-dot" /> CURRENT</span><span><i className="legend-dot" /> NODE</span></div></div>
    <div className="list-stage">
      {history.nodes.length === 0 ? <div className="list-empty"><div className="null-node">NULL</div><div><strong>Empty structure</strong><span>Visit a page to allocate the first node.</span></div></div> : <div className="linked-row">
        <div className="endpoint"><span>HEAD</span><b>{history.head !== null ? `#${history.head}` : "NULL"}</b></div>
        <div className="nodes-track">{history.nodes.map((node, index) => <motion.div className="node-pair" key={node.id} layout initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.05 }}>
          <motion.article className={`history-node ${node.id === history.current ? "current-node" : ""} ${highlighted.includes(node.id) ? "highlighted-node" : ""}`} animate={node.id === history.current ? { borderColor: "#7089ba" } : { borderColor: "#4d4d4d" }}>
            <div className="node-top"><span className="node-id">NODE #{node.id}</span>{node.id === history.current && <span className="current-tag">CURRENT</span>}</div><h3>{node.title}</h3><p>{domain(node.url)}</p><div className="node-pointers"><span>PREV <b>{node.prev === null ? "NULL" : `#${node.prev}`}</b></span><span>NEXT <b>{node.next === null ? "NULL" : `#${node.next}`}</b></span></div>
          </motion.article>{index < history.nodes.length - 1 && <div className="connector"><ArrowLeftRight size={16} /><span>prev / next</span></div>}</motion.div>)}</div>
        <div className="endpoint tail-endpoint"><span>TAIL</span><b>{history.tail !== null ? `#${history.tail}` : "NULL"}</b></div>
      </div>}
    </div>
    <div className="pointer-readout"><span><CircleDot size={14} /> HEAD <b>{history.head === null ? "NULL" : `NODE #${history.head}`}</b></span><span><Link2 size={14} /> CURRENT <b>{history.current === null ? "NULL" : `NODE #${history.current}`}</b></span><span><CircleDot size={14} /> TAIL <b>{history.tail === null ? "NULL" : `NODE #${history.tail}`}</b></span></div>
  </section>;
}