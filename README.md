# Dual Credit Admin Portal (Prototype)

Prototype SPA for College Admin configuration of institution, terms, programs, and high school partners. Frontend-only using Vue 3, Vite, Pinia, Vue Router, and Tailwind CSS. Mock data with in-memory state. No backend.

## Getting Started

1. Install Node 18+.
2. Install dependencies and run the dev server:

```bash
cd app
npm install
npm run dev
```

Open the local URL printed in the terminal.

## Prototype Scope

- Institution Profile: Edit name, address, contact email (mock validation).
- Terms: Create/edit terms with dates and active status.
- Programs: Create/edit programs, associate with terms.
- Partners: Create/edit high school partners, associate with programs.
- Users & Permissions: Placeholder page; role dropdown in header only simulates views.

## Tech

- Vue 3 (Composition API), TypeScript
- Vite
- Pinia (state)
- Vue Router
- Tailwind CSS

## Data & Persistence

- Seeded in Pinia stores in `src/stores/*`.
- All data is in-memory and resets on refresh.

## Roadmap

- Phase 1 (this prototype): flows and information architecture validation.
- Phase 2: API integration, real auth & role-based access, students.
- Later: reporting, integrations (SIS/LMS/state).


