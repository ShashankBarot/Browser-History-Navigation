from datetime import datetime


class Node:
    """A single history entry in the doubly linked list."""

    def __init__(self, url, title):
        self.url = url
        self.title = title
        self.timestamp = datetime.now()
        self.prev = None
        self.next = None

    def __repr__(self):
        return f"Node({self.title})"


class DoublyLinkedList:
    """A manually implemented doubly linked list for browser history."""

    def __init__(self):
        self.head = None
        self.tail = None
        self.current = None

    def is_empty(self):
        return self.head is None

    def insert(self, url, title):
        """
        Insert a new node right after 'current', discarding any
        forward history that existed beyond current.
        This models: visiting a new page after going Back.
        """
        new_node = Node(url, title)

        if self.is_empty():
            # First ever page visited
            self.head = new_node
            self.tail = new_node
            self.current = new_node
            return new_node

        # Discard forward history: cut everything after current
        self.current.next = None
        self.tail = self.current

        # Link new node after current
        new_node.prev = self.current
        self.current.next = new_node
        self.tail = new_node
        self.current = new_node

        return new_node

    def delete(self, node):
        """
        Remove a node and reconnect its neighbors.
        Handles head deletion, tail deletion, middle deletion,
        and deleting the current node.
        """
        if node is None:
            return False

        prev_node = node.prev
        next_node = node.next

        # Reconnect neighbors
        if prev_node:
            prev_node.next = next_node
        else:
            # Node was the head
            self.head = next_node

        if next_node:
            next_node.prev = prev_node
        else:
            # Node was the tail
            self.tail = prev_node

        # If we deleted the current node, move current sensibly
        if self.current == node:
            if prev_node:
                self.current = prev_node
            elif next_node:
                self.current = next_node
            else:
                self.current = None  # list is now empty

        node.prev = None
        node.next = None
        return True

    def traverse_forward(self):
        """Move current one step forward. Returns the new current or None."""
        if self.current and self.current.next:
            self.current = self.current.next
            return self.current
        return None  # already at tail / no forward page

    def traverse_backward(self):
        """Move current one step backward. Returns the new current or None."""
        if self.current and self.current.prev:
            self.current = self.current.prev
            return self.current
        return None  # already at head / no previous page

    def search(self, query):
        """
        Traverse the whole list and return all nodes whose title
        or url contains the query (case-insensitive).
        """
        results = []
        node = self.head
        query_lower = query.lower()
        while node:
            if query_lower in node.title.lower() or query_lower in node.url.lower():
                results.append(node)
            node = node.next
        return results

    def clear(self):
        """Reset the list to empty."""
        self.head = None
        self.tail = None
        self.current = None

    def to_list(self):
        """Return all nodes as a list, head to tail, for display/visualization."""
        nodes = []
        node = self.head
        while node:
            nodes.append(node)
            node = node.next
        return nodes


class BrowserHistory:
    """High-level browser-style API built on top of DoublyLinkedList."""

    def __init__(self):
        self.dll = DoublyLinkedList()

    def visit(self, url, title):
        return self.dll.insert(url, title)

    def back(self):
        return self.dll.traverse_backward()

    def forward(self):
        return self.dll.traverse_forward()

    def delete_current(self):
        return self.dll.delete(self.dll.current)

    def search(self, query):
        return self.dll.search(query)

    def clear(self):
        self.dll.clear()

    def get_history(self):
        return self.dll.to_list()

    def get_current(self):
        return self.dll.current


# --- Quick manual test ---
if __name__ == "__main__":
    bh = BrowserHistory()
    bh.visit("https://google.com", "Google")
    bh.visit("https://youtube.com", "YouTube")
    bh.visit("https://github.com", "GitHub")
    bh.visit("https://wikipedia.org", "Wikipedia")

    print("Full history:", [n.title for n in bh.get_history()])
    print("Current page:", bh.get_current().title)

    bh.back()
    bh.back()
    print("After 2x Back, current:", bh.get_current().title)

    bh.forward()
    print("After 1x Forward, current:", bh.get_current().title)

    bh.visit("https://chatgpt.com", "ChatGPT")
    print("After visiting ChatGPT from YouTube:", [n.title for n in bh.get_history()])
    print("Current page:", bh.get_current().title)

    results = bh.search("git")
    print("Search 'git':", [n.title for n in results])

    bh.clear()
    print("After clear, history:", bh.get_history())