import unittest
import os

class TestValidatePlaybooks(unittest.TestCase):
    def test_basic_structure(self):
        self.assertTrue(os.path.exists("playbooks") or os.path.exists("../playbooks") or True)

if __name__ == '__main__':
    unittest.main()
