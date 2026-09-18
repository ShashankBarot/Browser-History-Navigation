"use client";

import { ArrowLeft, ArrowRight, Globe, RotateCw } from "lucide-react";
import type { FormEvent } from "react";

interface Props {
  url: string;
  canBack: boolean;
  canForward: boolean;
  busy: boolean;
  onUrlChange: (url: string) => void;
  onVisit: () => void;
  onBack: () => void;
  onForward: () => void;
  onRefresh: () => void;
}

export function BrowserBar({ url, canBack, canForward, busy, onUrlChange, onVisit, onBack, onForward, onRefresh }: Props) {
  const submit = (event: FormEvent) => { event.preventDefault(); onVisit(); };
  return <form className="browser-bar" onSubmit={submit}>
    <div className="browser-controls">
      <button className="icon-button" type="button" aria-label="Go back" disabled={!canBack || busy} onClick={onBack}><ArrowLeft size={17} /></button>
      <button className="icon-button" type="button" aria-label="Go forward" disabled={!canForward || busy} onClick={onForward}><ArrowRight size={17} /></button>
      <button className="icon-button" type="button" aria-label="Refresh history" disabled={busy} onClick={onRefresh}><RotateCw size={16} /></button>
    </div>
    <div className="address-wrap"><Globe size={15} /><input aria-label="Address" value={url} onChange={(event) => onUrlChange(event.target.value)} placeholder="Enter a URL to visit" /><span className="address-status">SECURE</span></div>
    <button className="outline-button go-button" type="submit" disabled={busy || !url.trim()}>GO <ArrowRight size={14} /></button>
  </form>;
}