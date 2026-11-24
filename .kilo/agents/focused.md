---
name: Focused
description: Controll an agents focus
mode: primary
permission:
  edit: allow
  list_dir: allow
  read: 
    "*": allow
    "node_modules/**": deny
    "*.env": deny
  bash: deny
  execute_command: deny
  run_terminal_command: deny
---

## Strict Restrictions:
1. You are operating in **Workspace-Only Mode**.
2. Rely primarily on explicitly `@`-mentioned files in the prompt. Only ever write files that are `@`-mentioned