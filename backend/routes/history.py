from fastapi import APIRouter, HTTPException, Query
from models.history import VisitRequest, HistoryResponse, NodeResponse, MessageResponse
from services.browser_history import browser_history

router = APIRouter()


def build_history_response() -> HistoryResponse:
    """Convert the current DLL state into the API response shape."""
    nodes = browser_history.get_history()
    node_id_map = {id(node): idx for idx, node in enumerate(nodes)}

    node_responses = []
    for idx, node in enumerate(nodes):
        node_responses.append(NodeResponse(
            id=idx,
            title=node.title,
            url=node.url,
            prev=idx - 1 if node.prev else None,
            next=idx + 1 if node.next else None,
        ))

    current = browser_history.get_current()
    current_id = node_id_map.get(id(current)) if current else None
    head_id = 0 if nodes else None
    tail_id = len(nodes) - 1 if nodes else None

    return HistoryResponse(
        head=head_id,
        tail=tail_id,
        current=current_id,
        nodes=node_responses,
    )


@router.get("/history", response_model=HistoryResponse)
def get_history():
    return build_history_response()


@router.post("/history/visit", response_model=HistoryResponse)
def visit_page(request: VisitRequest):
    browser_history.visit(request.url, request.title)
    return build_history_response()


@router.post("/history/back", response_model=HistoryResponse)
def go_back():
    result = browser_history.back()
    if result is None:
        raise HTTPException(status_code=400, detail="No previous page")
    return build_history_response()


@router.post("/history/forward", response_model=HistoryResponse)
def go_forward():
    result = browser_history.forward()
    if result is None:
        raise HTTPException(status_code=400, detail="No forward page")
    return build_history_response()


@router.delete("/history/{node_id}", response_model=HistoryResponse)
def delete_node(node_id: int):
    nodes = browser_history.get_history()
    if node_id < 0 or node_id >= len(nodes):
        raise HTTPException(status_code=404, detail="Node not found")
    target_node = nodes[node_id]
    browser_history.dll.delete(target_node)
    return build_history_response()


@router.get("/history/search", response_model=list[NodeResponse])
def search_history(query: str = Query(..., min_length=1)):
    results = browser_history.search(query)
    nodes = browser_history.get_history()
    node_id_map = {id(node): idx for idx, node in enumerate(nodes)}

    return [
        NodeResponse(
            id=node_id_map[id(node)],
            title=node.title,
            url=node.url,
            prev=node_id_map[id(node)] - 1 if node.prev else None,
            next=node_id_map[id(node)] + 1 if node.next else None,
        )
        for node in results
    ]


@router.delete("/history", response_model=MessageResponse)
def clear_history():
    browser_history.clear()
    return MessageResponse(message="History cleared")