import type { HistoryNode, HistoryResponse } from "../types/history";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

async function request<T>(path: string, options?: RequestInit): Promise<T> {
  const response = await fetch(`${API_URL}${path}`, {
    ...options,
    headers: { "Content-Type": "application/json", ...options?.headers },
  });
  const data = await response.json().catch(() => ({}));
  if (!response.ok) throw new Error(data.detail || "The backend is unavailable");
  return data as T;
}

export const api = {
  getHistory: () => request<HistoryResponse>("/history"),
  visitPage: (url: string, title: string) => request<HistoryResponse>("/history/visit", { method: "POST", body: JSON.stringify({ url, title }) }),
  goBack: () => request<HistoryResponse>("/history/back", { method: "POST" }),
  goForward: () => request<HistoryResponse>("/history/forward", { method: "POST" }),
  deleteNode: (id: number) => request<HistoryResponse>(`/history/${id}`, { method: "DELETE" }),
  searchHistory: (query: string) => request<HistoryNode[]>(`/history/search?query=${encodeURIComponent(query)}`),
  clearHistory: () => request<{ message: string }>("/history", { method: "DELETE" }),
};