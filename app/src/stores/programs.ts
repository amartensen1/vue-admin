import { defineStore } from 'pinia'

export type Program = {
  id: string
  title: string
  description: string
  creditHours: number
  termId: string
}

export const useProgramsStore = defineStore('programs', {
  state: (): { programs: Program[] } => ({
    programs: [
      { id: 'p1', title: 'Intro to Computer Science', description: 'Foundational CS course', creditHours: 4, termId: 't1' },
    ],
  }),
  actions: {
    addProgram(program: Program) {
      this.programs.push({ ...program })
    },
    updateProgram(program: Program) {
      const idx = this.programs.findIndex(p => p.id === program.id)
      if (idx >= 0) this.programs[idx] = { ...program }
    },
  },
})



