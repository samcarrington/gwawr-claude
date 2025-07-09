--
id: decision-2
title: Use Nuxt UI for web UI development
date: '2025-06-22'
status: proposed
---
## Context
Nuxt UI is a stable and configurable UI Library which pairs well with the chosen JS and CSS frameworks

## Decision
We will use **Nuxt UI** for baseline components for web UI development in this project.

## Installation

```bash
yarn add @nuxt/ui
```

### nuxt.config.ts
```ts
export default defineNuxtConfig({
  modules: ['@nuxt/ui']
})
```

## References

[Nuxt UI Getting Started](https://ui.nuxt.com/getting-started/installation/nuxt)