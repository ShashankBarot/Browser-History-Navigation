import sys
import os

sys.path.append(os.path.join(os.path.dirname(__file__), '..', 'data_structures'))
from doubly_linked_list import BrowserHistory

# Single shared instance used by all API routes (in-memory, per section 10 of the plan)
browser_history = BrowserHistory()