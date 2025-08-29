import { defineStore } from 'pinia'

export type Term = {
  id: string
  name: string
  startDate: string
  endDate: string
  active: boolean
}

export const useTermsStore = defineStore('terms', {
  state: (): { terms: Term[] } => ({
    terms: [
      { id: 't1', name: 'Fall 2025', startDate: '2025-08-20', endDate: '2025-12-15', active: true },
      { id: 't2', name: 'Spring 2026', startDate: '2026-01-10', endDate: '2026-05-05', active: false },
    ],
  }),
  actions: {
    addTerm(term: Term) {
      this.terms.push({ ...term })
    },
    updateTerm(term: Term) {
      const idx = this.terms.findIndex(t => t.id === term.id)
      if (idx >= 0) this.terms[idx] = { ...term }
    },
  },
})



