import { create } from 'zustand';

export const useUserStore = create((set) => ({
	sneakers: [],
	setSneakers: (sneakers) => set({ sneakers }),
}));
