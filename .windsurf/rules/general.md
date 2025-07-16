---
trigger: always_on
---

# === GWAWR WEBSITE GUIDELINES START ===

# General Operational Standards

- Use Backlog, documented below, to manage all tasks and actions
- Observe all accessibility standards when generating HTML and interactive functionality
- Use 'Conventional Commits' standards when writing commit messages for git
- Prefix all branches with 'feature/' to ensure they're organised correctly in git.

## 1. Working with CSS, CSS Utility Frameworks and Design Systems

- Try and avoid assigning Framework classes directly in components.
- Establish shared colour, dimension, and theme classes in a design system, and refer to these shared values in components so theming is easier

## 2. Working with Vue and Nuxt

- Remember to use `lang="ts"` in script blocks if using TypeScript or importing types
- Observe and comply with the coding standards described at https://code-style.gwawr.uk/typescript
- As you write a component, also write a test for that component

# === GWAWR WEBSITE GUIDELINES END ===