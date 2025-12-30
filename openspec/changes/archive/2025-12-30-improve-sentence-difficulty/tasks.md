## 1. Update Difficulty Calculation

- [x] 1.1 Add `calculate_difficulty()` function with length, HSK level, and coverage factors
- [x] 1.2 Add `load_hsk_levels()` to get HSK levels for each word
- [x] 1.3 Update sentence import to use new difficulty calculation

## 2. Re-import Sentences

- [x] 2.1 Run `python scripts/import_sentences.py` to recalculate scores
- [x] 2.2 Verify difficulty scores are now differentiated (0.02-0.3+ range, not all 0.0)
- [x] 2.3 Verify 出 shows simpler sentences first ("出什么事了，宝贝？" before complex ones)
