import unittest
import sys
import os

sys.path.append(os.path.join(os.path.dirname(__file__), '..', 'data_structures'))
from doubly_linked_list import BrowserHistory


class TestBrowserHistory(unittest.TestCase):

    def setUp(self):
        """Runs before every test — fresh history each time."""
        self.bh = BrowserHistory()

    # --- Insert / Visit ---

    def test_insert_first_node_into_empty_history(self):
        self.bh.visit("https://google.com", "Google")
        history = self.bh.get_history()
        self.assertEqual(len(history), 1)
        self.assertEqual(history[0].title, "Google")
        self.assertEqual(self.bh.get_current().title, "Google")

    def test_insert_multiple_nodes(self):
        self.bh.visit("https://google.com", "Google")
        self.bh.visit("https://youtube.com", "YouTube")
        self.bh.visit("https://github.com", "GitHub")
        titles = [n.title for n in self.bh.get_history()]
        self.assertEqual(titles, ["Google", "YouTube", "GitHub"])
        self.assertEqual(self.bh.get_current().title, "GitHub")

    # --- Backward / Forward traversal ---

    def test_move_backward_from_tail(self):
        self.bh.visit("https://google.com", "Google")
        self.bh.visit("https://youtube.com", "YouTube")
        self.bh.back()
        self.assertEqual(self.bh.get_current().title, "Google")

    def test_move_forward_from_middle(self):
        self.bh.visit("https://google.com", "Google")
        self.bh.visit("https://youtube.com", "YouTube")
        self.bh.visit("https://github.com", "GitHub")
        self.bh.back()  # now at YouTube
        self.bh.forward()  # should move to GitHub
        self.assertEqual(self.bh.get_current().title, "GitHub")

    def test_back_at_head_returns_none(self):
        self.bh.visit("https://google.com", "Google")
        result = self.bh.back()
        self.assertIsNone(result)
        self.assertEqual(self.bh.get_current().title, "Google")  # unchanged

    def test_forward_at_tail_returns_none(self):
        self.bh.visit("https://google.com", "Google")
        self.bh.visit("https://youtube.com", "YouTube")
        result = self.bh.forward()
        self.assertIsNone(result)
        self.assertEqual(self.bh.get_current().title, "YouTube")  # unchanged

    # --- Delete ---

    def test_delete_head_node(self):
        self.bh.visit("https://google.com", "Google")
        self.bh.visit("https://youtube.com", "YouTube")
        self.bh.visit("https://github.com", "GitHub")
        head_node = self.bh.get_history()[0]
        self.bh.dll.delete(head_node)
        titles = [n.title for n in self.bh.get_history()]
        self.assertEqual(titles, ["YouTube", "GitHub"])
        self.assertIsNone(self.bh.dll.head.prev)

    def test_delete_tail_node(self):
        self.bh.visit("https://google.com", "Google")
        self.bh.visit("https://youtube.com", "YouTube")
        self.bh.visit("https://github.com", "GitHub")
        tail_node = self.bh.get_history()[-1]
        self.bh.dll.delete(tail_node)
        titles = [n.title for n in self.bh.get_history()]
        self.assertEqual(titles, ["Google", "YouTube"])
        self.assertIsNone(self.bh.dll.tail.next)

    def test_delete_middle_node(self):
        self.bh.visit("https://google.com", "Google")
        self.bh.visit("https://youtube.com", "YouTube")
        self.bh.visit("https://github.com", "GitHub")
        middle_node = self.bh.get_history()[1]  # YouTube
        self.bh.dll.delete(middle_node)
        titles = [n.title for n in self.bh.get_history()]
        self.assertEqual(titles, ["Google", "GitHub"])
        # Google and GitHub should now point directly to each other
        google_node = self.bh.get_history()[0]
        github_node = self.bh.get_history()[1]
        self.assertEqual(google_node.next, github_node)
        self.assertEqual(github_node.prev, google_node)

    def test_delete_current_node_updates_current(self):
        self.bh.visit("https://google.com", "Google")
        self.bh.visit("https://youtube.com", "YouTube")
        self.bh.visit("https://github.com", "GitHub")
        current_node = self.bh.get_current()  # GitHub
        self.bh.delete_current()
        # current should now fall back to YouTube (the previous node)
        self.assertEqual(self.bh.get_current().title, "YouTube")

    def test_single_node_list_head_tail_current_same(self):
        self.bh.visit("https://google.com", "Google")
        self.assertEqual(self.bh.dll.head, self.bh.dll.tail)
        self.assertEqual(self.bh.dll.head, self.bh.dll.current)

    # --- Search ---

    def test_search_existing_page(self):
        self.bh.visit("https://google.com", "Google")
        self.bh.visit("https://github.com", "GitHub")
        results = self.bh.search("git")
        self.assertEqual(len(results), 1)
        self.assertEqual(results[0].title, "GitHub")

    def test_search_missing_page(self):
        self.bh.visit("https://google.com", "Google")
        results = self.bh.search("nonexistent")
        self.assertEqual(len(results), 0)

    # --- Clear ---

    def test_clear_history(self):
        self.bh.visit("https://google.com", "Google")
        self.bh.visit("https://youtube.com", "YouTube")
        self.bh.clear()
        self.assertEqual(self.bh.get_history(), [])
        self.assertIsNone(self.bh.get_current())

    # --- The critical "visit after back" case ---

    def test_visit_after_back_discards_forward_history(self):
        self.bh.visit("https://google.com", "Google")
        self.bh.visit("https://youtube.com", "YouTube")
        self.bh.visit("https://github.com", "GitHub")
        self.bh.visit("https://wikipedia.org", "Wikipedia")

        self.bh.back()
        self.bh.back()  # current is now YouTube
        self.bh.forward()  # current is now GitHub

        self.bh.visit("https://chatgpt.com", "ChatGPT")

        titles = [n.title for n in self.bh.get_history()]
        self.assertEqual(titles, ["Google", "YouTube", "GitHub", "ChatGPT"])
        self.assertEqual(self.bh.get_current().title, "ChatGPT")
        self.assertIsNone(self.bh.dll.tail.next)  # ChatGPT is now the tail


if __name__ == "__main__":
    unittest.main()