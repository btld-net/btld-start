---
name: prompts
description: Extract prompts used in the chat history into a markdown file.
---

## Task

Extract all user prompts, instructions, and follow-ups from this session as cleaned-up, condensed prompts that allow an almost complete understanding and a replay of the conversation. For `@`-mentioned exported AI conversations, ask (if not obvious) whether to include them.

- **Ratio:** at most 1.5x context-to-prompt — enough to replay, not enough to make the conversation pointless and obvious.
- **Standalone:** every prompt must work alone; replace references to prior AI answers ("that model", "your recommendation") with the concrete content — never "see above".
- **Condense vs. preserve:** condense wording, typos, filler; preserve verbatim technical terms, product names, numbers, prices, URLs; summarize long pasted examples, marked explicitly, e.g. "*(pasted full job posting, ~500 words: Title)*".
- **No spoilers:** never state final conclusions — not in Context, section/intent labels, or `AI:` lines (they carry only what the next prompt reacts to). Context: goal, constraints, decisions made — not the outcome. Label sections by topic ("Model choice"), not by result ("Nova Micro wins").

## Output Format

```markdown
# [Topic] Prompts

Context: <2-4 sentences: goal, decisions made, not the final outcome>

## Section: <short label marking a shift>

- <intent label>: <standalone prompt text>
- <standalone prompt text>
- AI: <prior answer this prompt reacts to, if necessary>
```

Start a new section when there is a shift in conversation.

## Acceptance Criteria

Verify: a reader with only this file can replay the prompts in a fresh AI session and reach similar conclusions — all prompts standalone, ratio ≤1.5x, no spoilers, template followed.

## Output File Path

1. New, nonexisting file named `[topic]-prompts.md`.
2. Stored close to any `@`-mentioned context.
3. Suggest the path and ask before writing.
