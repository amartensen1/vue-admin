import { defineStore } from 'pinia'

export type Partner = {
  id: string
  name: string
  address: string
  contact: string
  programIds: string[]
}

export const usePartnersStore = defineStore('partners', {
  state: (): { partners: Partner[] } => ({
    partners: [
      { id: 'hs1', name: 'Central High School', address: '456 Main St', contact: 'counselor@centralhs.edu', programIds: ['p1'] },
    ],
  }),
  actions: {
    addPartner(partner: Partner) {
      this.partners.push({ ...partner })
    },
    updatePartner(partner: Partner) {
      const idx = this.partners.findIndex(p => p.id === partner.id)
      if (idx >= 0) this.partners[idx] = { ...partner }
    },
  },
})



