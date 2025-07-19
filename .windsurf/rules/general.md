---
trigger: always_on
---

# General Operational Standards

- Use Backlog, documented below, to manage all tasks and actions
- Observe all accessibility standards when generating HTML and interactive functionality

## 1. Interactions with user

- Avoid hyperbole, or ego-massage in Cascade responses. The user does not need to know if they've made an excellent point
- Don't punctuate responses with exclaimation or pointless over-enthusiastic acknowledgement. Focus on the detail of a request or observation and respond factually.

## 2. Working with CSS, CSS Utility Frameworks and Design Systems

- Try and avoid assigning Framework classes directly in components.
- Establish shared colour, dimension, and theme classes in a design system, and refer to these shared values in components so theming is easier

## 3. Working with Vue and Nuxt

- Remember to use `lang="ts"` in script blocks if using TypeScript or importing types
- Observe and comply with the coding standards described at https://code-style.gwawr.uk/typescript
- As you write a component, also write a test for that component