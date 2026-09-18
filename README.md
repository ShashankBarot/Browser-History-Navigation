<div align="center">

```
[ ] BROWSER HISTORY / NAVIGATOR
```

# Browser History Navigator

**A browser history simulator that makes every pointer, traversal, and insertion visible.**

[![Live Demo](https://img.shields.io/badge/LIVE%20DEMO-browser--history--navigation.vercel.app-00e9ff?style=for-the-badge&logo=vercel&logoColor=black)](https://browser-history-navigation.vercel.app/)
[![Python](https://img.shields.io/badge/Python-FastAPI-4d4d4d?style=for-the-badge&logo=fastapi&logoColor=00e9ff)](https://fastapi.tiangolo.com/)
[![Next.js](https://img.shields.io/badge/Next.js-15-4d4d4d?style=for-the-badge&logo=next.js&logoColor=white)](https://nextjs.org/)
[![Three.js](https://img.shields.io/badge/Three.js-WebGL-4d4d4d?style=for-the-badge&logo=three.js&logoColor=white)](https://threejs.org/)

</div>

---

```
┌─────────────────────────────────────────────────────────────────────────┐
│  NULL ← [ Node #0 ] ⇄ [ Node #1 ] ⇄ [ Node #2 ] ⇄ [ Node #3 ] → NULL  │
│                              ↑ CURRENT                                   │
└─────────────────────────────────────────────────────────────────────────┘
```

> Every time you hit **back** or **forward** in a real browser, a pointer moves.
> This project makes that invisible operation **completely visible** — node by node, pointer by pointer, in real time.

---

## ◎ What Is This?

**Browser History Navigator** is a full-stack data structures capstone that simulates a browser's history mechanism using a **Python-powered Doubly Linked List** as its core engine.

The frontend isn't just a UI — it's a live debugger. Watch pointers reconnect on deletion. See `O(1)` traversal animate in real time. Search through nodes and watch the graph highlight matches.

Built as a **data structures learning tool** disguised as a real product.

---

## ✦ Features

| Feature | What It Does |
|---|---|
| 🔗 **Doubly Linked List** | Pure Python implementation — no libraries, raw node pointers |
| ⬅ ➡ **Back / Forward** | Moves the `current` pointer, `O(1)` per traversal |
| ➕ **Visit Page** | Inserts a new node after `current`, truncating forward history |
| 🗑 **Delete Node** | Reconnects `prev` and `next` pointers in-place |
| 🔍 **Search** | Linear scan `O(n)` with live highlighting across the node graph |
| 🧹 **Clear All** | Resets `head`, `tail`, and `current` to `null` |
| 📡 **Live Pointer Readout** | HEAD / CURRENT / TAIL displayed live below the graph |
| 📊 **Algorithm Lens** | Shows time + space complexity for every operation |
| 📝 **Operation Log** | Timestamped history of every mutation |
| 🌊 **WebGL Beams** | Three.js animated background with Perlin noise shaders |

---

## ⬡ Tech Stack

```
┌─────────────────────┐     REST API      ┌──────────────────────┐
│     FRONTEND        │ ◄──────────────► │      BACKEND          │
│                     │                   │                       │
│  Next.js 15         │                   │  Python 3.x           │
│  React 19           │                   │  FastAPI              │
│  TypeScript         │                   │  Doubly Linked List   │
│  Three.js / R3F     │                   │  Pydantic models      │
│  Framer Motion      │                   │  CORS middleware      │
│  Lucide Icons       │                   │                       │
└─────────────────────┘                   └──────────────────────┘
         │
         └── Deployed on Vercel
```

---

## ⚙ API Reference

All state lives in the Python backend. The frontend is stateless — it renders whatever the API returns.

| Method | Endpoint | Operation | Complexity |
|--------|----------|-----------|------------|
| `GET` | `/history` | Fetch full list state | `O(n)` |
| `POST` | `/history/visit` | Insert page after current | `O(1)` |
| `POST` | `/history/back` | Move current → prev | `O(1)` |
| `POST` | `/history/forward` | Move current → next | `O(1)` |
| `DELETE` | `/history/{id}` | Remove node, relink pointers | `O(1)` |
| `DELETE` | `/history` | Reset entire list | `O(n)` |
| `GET` | `/history/search?q=` | Linear search by title/URL | `O(n)` |

---

## 🧠 The Data Structure

```python
class Node:
    def __init__(self, id, title, url):
        self.id    = id
        self.title = title
        self.url   = url
        self.prev  = None   # ← pointer to previous node
        self.next  = None   # ← pointer to next node

class DoublyLinkedList:
    def __init__(self):
        self.head    = None
        self.tail    = None
        self.current = None
```

**Insert** (visit a new page):
```
current.next = new_node
new_node.prev = current
tail = new_node
current = new_node
```

**Backward traversal:**
```
current = current.prev   # O(1)
```

**Delete a node:**
```
node.prev.next = node.next
node.next.prev = node.prev   # O(1) pointer reconnection
```

---

## 🚀 Running Locally

### Prerequisites
- Python 3.9+
- Node.js 18+

### Backend

```bash
cd backend
pip install -r requirements.txt
uvicorn main:app --reload --port 8000
```

API docs auto-generated at → `http://localhost:8000/docs`

### Frontend

```bash
cd frontend
npm install
npm run dev
```

Open → `http://localhost:3000`

> Make sure the backend is running first. The frontend calls `localhost:8000` by default.

---

## 📁 Project Structure

```
Browser-History-Navigation/
├── backend/
│   ├── main.py                  # FastAPI entry point
│   ├── requirements.txt
│   ├── data_structures/         # Pure Python Doubly Linked List
│   ├── models/                  # Pydantic request/response schemas
│   ├── routes/                  # API route handlers
│   ├── services/                # Business logic layer
│   └── tests/                   # 15 unit tests (all passing)
│
└── frontend/
    ├── app/
    │   ├── page.tsx             # Main page, all state + API calls
    │   ├── layout.tsx
    │   └── globals.css          # Design system + responsive breakpoints
    └── components/
        ├── browser/             # Browser address bar
        ├── complexity/          # Algorithm lens panel
        ├── effects/             # WebGL Beams (Three.js + GLSL shaders)
        ├── history/             # Sidebar history panel
        ├── linked-list/         # Node graph visualization
        └── operation-log/       # Timestamped mutation log
```

---

## 🎨 Design System

The UI follows a **blueprint on a backlit drafting table** aesthetic — dark void, hairline dashed borders, a single cyan-blue accent. No shadows. No gradients on content. Components are outlined, not decorated.

| Token | Value | Role |
|---|---|---|
| `--void` | `#000000` | Page background |
| `--carbon` | `#1c1c1c` | Card surfaces |
| `--graphite` | `#4d4d4d` | Borders, dividers |
| `--steel` | `#808080` | Secondary text |
| `--peri` | `#7089ba` | Accent — links, dots, tags |
| `--paper` | `#ffffff` | Primary text |

Typography: **Space Grotesk** (display) + **DM Mono** (labels, code)

---

## 🧪 Tests

```bash
cd backend
python -m pytest tests/ -v
```

```
✓ test_insert_node
✓ test_backward_traversal
✓ test_forward_traversal
✓ test_delete_head_node
✓ test_delete_tail_node
✓ test_delete_middle_node
✓ test_search_by_title
✓ test_clear_history
✓ ... 15 tests total — all passing
```

---

## 🌐 Deployment

| Service | Platform |
|---|---|
| Frontend | [Vercel](https://browser-history-navigation.vercel.app/) |
| Backend | Python / FastAPI (self-hosted or Railway) |

---

<div align="center">

```
PYTHON DOUBLY LINKED LIST  ·  NEXT.JS VISUALIZER
DATA STRUCTURES CAPSTONE / 2026
```

Made by **Shashank Barot**

</div>
