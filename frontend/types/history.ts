export interface HistoryNode {
  id: number;
  title: string;
  url: string;
  prev: number | null;
  next: number | null;
}

export interface HistoryResponse {
  head: number | null;
  tail: number | null;
  current: number | null;
  nodes: HistoryNode[];
}

export type OperationKind = "INSERT" | "BACKWARD" | "FORWARD" | "DELETE" | "SEARCH" | "CLEAR";

export interface OperationLogEntry {
  id: number;
  kind: OperationKind;
  label: string;
  detail: string;
  time: string;
}