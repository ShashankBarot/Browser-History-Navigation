"use client";

import { motion } from "framer-motion";
import type { HistoryResponse, HistoryNode } from "../../types/history";

const demoNodes: HistoryNode[] = [
  { id: 0, title: "Google", url: "https://google.com", prev: null, next: 1 },
  { id: 1, title: "YouTube", url: "https://youtube.com", prev: 0, next: 2 },
  { id: 2, title: "GitHub", url: "https://github.com", prev: 1, next: null },
];

export function HeroLinkedList({ history }: { history: HistoryResponse }) {
  const nodes = history.nodes.length > 0 ? history.nodes.slice(0, 4) : demoNodes;
  const current = history.nodes.length > 0 ? history.current : 1;
  const head = history.nodes.length > 0 ? history.head : 0;
  const tail = history.nodes.length > 0 ? history.tail : 2;

  return <div className="hero-list" aria-label="Doubly linked list preview">
    <div className="hero-list-label"><span className="eyebrow">LIVE STRUCTURE PREVIEW</span><span className="hero-list-state">{history.nodes.length > 0 ? "BACKEND STATE" : "EXAMPLE STATE"}</span></div>
    <div className="hero-list-board">
      <div className="hero-marker head-marker"><span>HEAD</span><b>↓</b><small>#{head}</small></div>
      <div className="hero-nodes">{nodes.map((node, index) => <motion.div className="hero-node-group" key={node.id} initial={{ opacity: 0, x: 12 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: index * 0.11, duration: 0.35 }}>
        <motion.article className={`hero-node ${node.id === current ? "is-current" : ""}`} animate={node.id === current ? { y: [0, -3, 0] } : { y: 0 }} transition={node.id === current ? { duration: 3, repeat: Infinity, ease: "easeInOut" } : undefined}>
          <div className="hero-node-heading"><span>NODE #{node.id}</span>{node.id === current && <strong>CURRENT</strong>}</div>
          <h3>{node.title}</h3>
          <p>{hostname(node.url)}</p>
          <div className="hero-node-links"><span>PREV <b>{node.prev === null ? "NULL" : `#${node.prev}`}</b></span><span>NEXT <b>{node.next === null ? "NULL" : `#${node.next}`}</b></span></div>
        </motion.article>
        {index < nodes.length - 1 && <motion.div className="hero-connector" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: index * 0.11 + 0.2 }}><b>⇄</b><span>prev / next</span></motion.div>}
      </motion.div>)}</div>
      <div className="hero-marker tail-marker"><span>TAIL</span><small>#{tail}</small><b>↑</b></div>
      <div className="hero-current-label">CURRENT <i>↳</i></div>
    </div>
    <div className="hero-list-legend"><span>NULL</span><span>PREV / NEXT POINTERS</span><span>DOUBLY LINKED LIST</span></div>
  </div>;
}

function hostname(url: string) { return url.replace(/^https?:\/\//, "").split("/")[0]; }