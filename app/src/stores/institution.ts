import { defineStore } from 'pinia'

export type Institution = {
  name: string
  address: string
  contactEmail: string
}

export const useInstitutionStore = defineStore('institution', {
  state: (): { institution: Institution } => ({
    institution: {
      name: 'Example Community College',
      address: '123 College Ave, College Town, ST',
      contactEmail: 'info@college.edu',
    },
  }),
  actions: {
    updateInstitution(payload: Institution) {
      this.institution = { ...payload }
    },
  },
})



