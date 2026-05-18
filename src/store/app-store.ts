import { create } from 'zustand';
import type { College } from '@/types';

interface AppState {
  selectedCollege: College | null;
  onboardingComplete: boolean;
  setSelectedCollege: (college: College) => void;
  setOnboardingComplete: (complete: boolean) => void;
  reset: () => void;
}

export const useAppStore = create<AppState>((set) => ({
  selectedCollege: null,
  onboardingComplete: false,
  setSelectedCollege: (college) => set({ selectedCollege: college }),
  setOnboardingComplete: (complete) => set({ onboardingComplete: complete }),
  reset: () => set({ selectedCollege: null, onboardingComplete: false }),
}));
