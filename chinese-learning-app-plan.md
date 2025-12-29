# Chinese Learning App — MVP Plan

## Goal Summary (For Claude Code)

Build a web-based Mandarin Chinese learning app using Next.js, React, TypeScript, and PostgreSQL. The app teaches the most useful ~600 words (HSK 1-3) through spaced repetition flashcards, example sentences in context, and interactive exercises like dialogue completion and sentence building.

**Data sources:**
- **CC-CEDICT** — Chinese-English dictionary (words, pinyin, definitions)
- **HSK 1-3 word lists** — curated vocabulary in priority order
- **Tatoeba** — Mandarin-English sentence pairs for context
- **Edge TTS** — generated audio for pronunciation

**Core features:**
- Learn new words with audio and example sentences
- Review via spaced repetition (SM-2 algorithm)
- Dialogue completion exercises (choose correct response)
- Build-a-sentence exercises (arrange scrambled words)
- Sentences tagged by grammar pattern for structured learning
- Progress tracking by HSK level

**Future:** Convert to React Native iOS app with SQLite for offline use. Add LLM-powered conversation mode.

---

## Phase 1: Data Pipeline (Week 1)

### 1.1 Gather Raw Data
- [ ] Download CC-CEDICT dictionary
- [ ] Download HSK 1-3 word lists (hskhsk.com)
- [ ] Download Mandarin-English sentence pairs from Tatoeba
- [ ] Create grammar patterns JSON (66 patterns, prioritize top 25)

### 1.2 Process & Import
- [ ] Parse CC-CEDICT into Postgres
- [ ] Import HSK lists, link to CEDICT entries
- [ ] Tokenize Tatoeba sentences with jieba
- [ ] Score sentences by difficulty (% of words in HSK 1-3)
- [ ] Filter to sentences where 80%+ words are HSK 1-3
- [ ] Build word ↔ sentence join table

### 1.3 Tag Sentences
- [ ] Write rule-based pattern tagger (~25 patterns)
- [ ] Run on filtered sentence corpus
- [ ] Store tags per sentence

### 1.4 Generate Audio
- [ ] Batch generate audio for HSK 1-3 words via Edge TTS
- [ ] Batch generate audio for filtered sentences
- [ ] Store as static files

### 1.5 Generate Dialogues
- [ ] Extract or generate short dialogues from Tatoeba pairs
- [ ] Tag dialogues by difficulty and patterns used
- [ ] Create wrong-answer options for dialogue completion

**Deliverable:** Postgres database with words, sentences, dialogues, pattern tags, and audio file paths

---

## Phase 2: Web MVP (Weeks 2-3)

### Stack
- **Next.js**
- **React + TypeScript**
- **PostgreSQL**
- **Static audio files**

### 2.1 Core Data Model

```sql
words
  id, hanzi, pinyin, definition, hsk_level, audio_path

sentences
  id, chinese, english, difficulty_score, audio_path, tokens (json array)

sentence_words
  sentence_id, word_id

sentence_patterns
  sentence_id, pattern_id

patterns
  id, name, description, structure, example

dialogues
  id, difficulty_score

dialogue_lines
  id, dialogue_id, speaker, chinese, english, line_order, audio_path

user_word_progress
  user_id, word_id, ease_factor, interval, next_review, times_correct, times_seen

user_sentence_progress
  user_id, sentence_id, times_seen, last_seen
```

### 2.2 Features (MVP)

**Learn Mode**
- Daily session: 15-20 new words + review due words
- Show word → pinyin → definition → audio
- Show 1-2 example sentences using the word
- User self-grades: "Got it" / "Missed it"

**Review Mode**
- Spaced repetition queue (SM-2 algorithm)
- Card types:
  - Word → definition (recognition)
  - Definition → word (recall)
  - Sentence translation (context)
  - Cloze deletion: 我___咖啡 (fill blank)

**Dialogue Completion**
- Show a conversation with one response missing
- User selects correct response from 3-4 options
- Tests contextual understanding

**Build-a-Sentence**
- Show English translation + scrambled Chinese words
- User arranges words in correct order
- Tests word order and grammar patterns

**Progress Dashboard**
- Words learned by HSK level
- Streak tracking
- Patterns encountered

**Settings**
- Daily new word limit
- Session length
- Audio on/off

### 2.3 UI Pages

```
/                → Dashboard (progress, start session)
/learn           → New words flow
/review          → Spaced repetition cards
/practice        → Dialogue completion + build-a-sentence exercises
/words           → Browse all words, filter by HSK level
/patterns        → Grammar pattern reference
/settings        → Preferences
```

**Deliverable:** Functional web app with flashcards and interactive exercises

---

## Phase 3: Polish & Expand (Week 4)

### 3.1 Additional Features
- [ ] Sentence-based review mode
- [ ] Pattern-focused lessons ("Today: 了 completion")
- [ ] Search dictionary
- [ ] Bookmark difficult words
- [ ] Audio playback speed control

### 3.2 Content Expansion
- [ ] LLM batch-tag ambiguous sentences
- [ ] Add HSK 4 words (optional tier)
- [ ] More example sentences per word
- [ ] More dialogue scenarios

**Deliverable:** Polished web MVP ready for daily use

---

## Phase 4: iOS Mobile App (Future)

### Approach
- React Native with Expo (reuse React/TypeScript skills)
- SQLite for local storage (replace Postgres)
- Bundle audio files with app
- Offline-first, no server required

### Mobile-Specific Features
- Push notification reminders
- Swipe gestures for card review
- Widget for streak/daily goal

**Deliverable:** iOS app via TestFlight

---

## Future Enhancements (Backlog)

- [ ] LLM-powered conversation mode (constrained to user's vocabulary)
- [ ] Scenario-based challenges
- [ ] Listen & respond exercises
- [ ] Pronunciation practice via speech recognition
- [ ] Handwriting practice (Make Me a Hanzi stroke data)
- [ ] Android version
- [ ] Cross-device sync (add backend)
- [ ] Other languages (same architecture)

---

## Timeline

| Phase | Duration | Outcome |
|-------|----------|---------|
| 1. Data Pipeline | 1 week | Database with words, sentences, dialogues, tags, audio |
| 2. Web MVP | 2 weeks | Working app with learn/review/practice modes |
| 3. Polish | 1 week | Refined UX, more features |
| 4. iOS App | 3-4 weeks | Mobile app with offline support |

---

## Reference: All Grammar Patterns (66 Total)

### Basic Sentence Structure (4)
| # | Pattern | Structure | Example | Meaning |
|---|---------|-----------|---------|---------|
| 1 | 是 equivalence | A 是 B | 我是学生 | I am a student |
| 2 | 有 possession/existence | A 有 B | 我有钱 | I have money |
| 3 | 在 location | A 在 B | 他在家 | He is at home |
| 4 | 很 + adjective | A 很 adj | 她很漂亮 | She is pretty |

### Negation (3)
| # | Pattern | Structure | Example | Meaning |
|---|---------|-----------|---------|---------|
| 5 | 不 general negation | 不 + verb/adj | 我不喝酒 | I don't drink |
| 6 | 没 negation of 有 | 没有 | 我没有钱 | I don't have money |
| 7 | 没 past negation | 没 + verb | 他没去 | He didn't go |

### Questions (10)
| # | Pattern | Structure | Example | Meaning |
|---|---------|-----------|---------|---------|
| 8 | 吗 yes/no | statement + 吗 | 你是学生吗？ | Are you a student? |
| 9 | 什么 what | 什么 + noun | 这是什么？ | What is this? |
| 10 | 谁 who | 谁 | 他是谁？ | Who is he? |
| 11 | 哪里/哪儿 where | 哪里/哪儿 | 你去哪儿？ | Where are you going? |
| 12 | 什么时候 when | 什么时候 | 你什么时候来？ | When are you coming? |
| 13 | 为什么 why | 为什么 | 你为什么哭？ | Why are you crying? |
| 14 | 怎么 how | 怎么 | 怎么去？ | How do I get there? |
| 15 | 多少/几 how many | 多少/几 + MW | 多少钱？ | How much money? |
| 16 | A 还是 B choice | A 还是 B | 茶还是咖啡？ | Tea or coffee? |
| 17 | verb 不 verb | V 不 V | 你去不去？ | Are you going or not? |

### Tense & Aspect (7)
| # | Pattern | Structure | Example | Meaning |
|---|---------|-----------|---------|---------|
| 18 | 了 completed action | verb + 了 | 我吃了 | I ate |
| 19 | 了 change of state | sentence + 了 | 下雨了 | It's raining now |
| 20 | 过 experience | verb + 过 | 我去过中国 | I've been to China |
| 21 | 在 ongoing action | 在 + verb | 他在吃饭 | He is eating |
| 22 | 正在 right now | 正在 + verb | 我正在学习 | I'm studying right now |
| 23 | 要 near future | 要 + verb | 我要走了 | I'm about to leave |
| 24 | 会 future | 会 + verb | 明天会下雨 | It will rain tomorrow |

### Desire, Ability, Obligation (7)
| # | Pattern | Structure | Example | Meaning |
|---|---------|-----------|---------|---------|
| 25 | 想 want to | 想 + verb | 我想吃 | I want to eat |
| 26 | 要 want/need | 要 + verb/noun | 我要水 | I want water |
| 27 | 能 can (circumstance) | 能 + verb | 你能帮我吗？ | Can you help me? |
| 28 | 可以 can (permission) | 可以 + verb | 我可以进来吗？ | May I come in? |
| 29 | 会 can (learned skill) | 会 + verb | 我会游泳 | I can swim |
| 30 | 得 must | 得 + verb | 我得走了 | I must go |
| 31 | 应该 should | 应该 + verb | 你应该休息 | You should rest |

### Modifiers & Connections (7)
| # | Pattern | Structure | Example | Meaning |
|---|---------|-----------|---------|---------|
| 32 | 的 possession | N + 的 + N | 我的书 | My book |
| 33 | 的 adj modifier | adj + 的 + N | 漂亮的女孩 | Pretty girl |
| 34 | 地 adverb marker | adv + 地 + verb | 慢慢地走 | Walk slowly |
| 35 | 得 degree complement | verb + 得 + adj | 说得很好 | Speak very well |
| 36 | 和 and (nouns) | A 和 B | 我和你 | Me and you |
| 37 | 也 also | 也 + verb | 我也喜欢 | I also like it |
| 38 | 都 all/both | 都 + verb | 我们都去 | We all go |

### Location & Direction (4)
| # | Pattern | Structure | Example | Meaning |
|---|---------|-----------|---------|---------|
| 39 | 在 + place + verb | 在 place V | 我在家吃饭 | I eat at home |
| 40 | 从...到 from...to | 从 A 到 B | 从北京到上海 | From Beijing to Shanghai |
| 41 | 往/向 toward | 往/向 + direction | 往左走 | Go left |
| 42 | 离 distance from | A 离 B + distance | 学校离这儿很近 | School is close to here |

### Time (5)
| # | Pattern | Structure | Example | Meaning |
|---|---------|-----------|---------|---------|
| 43 | Time before verb | time + verb | 我明天去 | I'll go tomorrow |
| 44 | 以前 before | event/time + 以前 | 吃饭以前 | Before eating |
| 45 | 以后 after | event/time + 以后 | 吃饭以后 | After eating |
| 46 | 的时候 when | verb + 的时候 | 我来的时候 | When I came |
| 47 | 先...再/然后 sequence | 先 A 再 B | 先吃饭再走 | Eat first, then go |

### Comparison (4)
| # | Pattern | Structure | Example | Meaning |
|---|---------|-----------|---------|---------|
| 48 | 比 comparison | A 比 B + adj | 他比我高 | He is taller than me |
| 49 | 一样 same as | A 和 B 一样 | 我和你一样 | I'm the same as you |
| 50 | 更 even more | 更 + adj | 更好 | Even better |
| 51 | 最 most | 最 + adj | 最好 | Best |

### Measure Words (5)
| # | Pattern | Structure | Example | Meaning |
|---|---------|-----------|---------|---------|
| 52 | 个 general classifier | num + 个 + noun | 一个人 | One person |
| 53 | 张 flat objects | num + 张 + noun | 一张纸 | One sheet of paper |
| 54 | 本 books/volumes | num + 本 + noun | 一本书 | One book |
| 55 | 杯 cups/glasses | num + 杯 + noun | 一杯水 | One cup of water |
| 56 | 次 times/occurrences | num + 次 | 两次 | Two times |

### Other Essentials (10)
| # | Pattern | Structure | Example | Meaning |
|---|---------|-----------|---------|---------|
| 57 | 给 give/for | 给 + person + verb | 给我看看 | Let me see |
| 58 | 让 let/make | 让 + person + verb | 让我走 | Let me go |
| 59 | 把 object fronting | 把 + obj + verb | 把门关上 | Close the door |
| 60 | 被 passive | 被 + (agent) + verb | 被偷了 | Was stolen |
| 61 | 是...的 emphasis | 是...的 | 我是昨天来的 | I came yesterday (emphasis) |
| 62 | 虽然...但是 although | 虽然 A 但是 B | 虽然贵但是好 | Expensive but good |
| 63 | 因为...所以 because | 因为 A 所以 B | 因为下雨所以没去 | Didn't go because of rain |
| 64 | 如果...就 if...then | 如果 A 就 B | 如果下雨就不去 | If it rains, won't go |
| 65 | 不但...而且 not only | 不但 A 而且 B | 不但好看而且便宜 | Not only pretty but also cheap |
| 66 | 越来越 more and more | 越来越 + adj | 越来越好 | Getting better and better |

### Priority for MVP (Top 25)
Focus on patterns 1-31 and 32, 37, 38, 48, 52, 63 for the MVP — these cover ~80% of beginner conversations.

---

## Reference: Data Sources

| Source | URL | Format |
|--------|-----|--------|
| CC-CEDICT | https://www.mdbg.net/chinese/dictionary?page=cedict | Text file |
| HSK Word Lists | https://hskhsk.com/word-lists.html | Text/CSV |
| Tatoeba | https://tatoeba.org/en/downloads | TSV files |
| Make Me a Hanzi | https://github.com/skishore/makemeahanzi | JSON |
| Edge TTS | pip install edge-tts | Python package |
