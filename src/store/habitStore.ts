import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';

export interface Habit {
  id: number;
  name: string;
  emoji: string;
  streak: number;
  bestStreak: number;
  createdAt: string;
}

export interface HabitStore {
  habits: Habit[];
  completions: Record<string, number[]>;
  profilePicture: string | null;
  notificationsEnabled: boolean;
  notificationTime: string;
  
  // Actions
  addHabit: (name: string, emoji: string) => void;
  editHabit: (id: number, name: string, emoji: string) => void;
  deleteHabit: (id: number) => void;
  toggleHabit: (habitId: number, date: string) => void;
  setProfilePicture: (uri: string | null) => void;
  setNotificationsEnabled: (enabled: boolean) => void;
  calculateStreak: (habitId: number) => number;
  getBestStreak: (habitId: number) => number;
}

export const useHabitStore = create<HabitStore>()(
  persist(
    (set, get) => ({
      habits: [
        {
          id: 1,
          name: 'Drink 8 Glasses Water',
          emoji: '💧',
          streak: 0,
          bestStreak: 0,
          createdAt: new Date().toISOString().split('T')[0],
        },
        {
          id: 2,
          name: 'Exercise 30 mins',
          emoji: '💪',
          streak: 0,
          bestStreak: 0,
          createdAt: new Date().toISOString().split('T')[0],
        },
      ],
      completions: {},
      profilePicture: null,
      notificationsEnabled: true,
      notificationTime: '18:00',

      addHabit: (name: string, emoji: string) => {
        const newHabit: Habit = {
          id: Date.now(),
          name,
          emoji,
          streak: 0,
          bestStreak: 0,
          createdAt: new Date().toISOString().split('T')[0],
        };
        set((state) => ({
          habits: [...state.habits, newHabit],
        }));
      },

      editHabit: (id: number, name: string, emoji: string) => {
        set((state) => ({
          habits: state.habits.map((habit) =>
            habit.id === id ? { ...habit, name, emoji } : habit
          ),
        }));
      },

      deleteHabit: (id: number) => {
        set((state) => ({
          habits: state.habits.filter((habit) => habit.id !== id),
        }));
      },

      toggleHabit: (habitId: number, date: string) => {
        set((state) => {
          const currentCompletions = state.completions[date] || [];
          const isCompleted = currentCompletions.includes(habitId);
          
          let newCompletions;
          if (isCompleted) {
            newCompletions = currentCompletions.filter(id => id !== habitId);
          } else {
            newCompletions = [...currentCompletions, habitId];
          }

          const updatedCompletions = {
            ...state.completions,
            [date]: newCompletions,
          };

          return { completions: updatedCompletions };
        });
        
        // Update streak after state change
        setTimeout(() => {
          set((state) => {
            const updatedHabits = state.habits.map(habit => {
              if (habit.id === habitId) {
                const newStreak = get().calculateStreak(habitId);
                const newBestStreak = Math.max(habit.bestStreak, newStreak);
                return { ...habit, streak: newStreak, bestStreak: newBestStreak };
              }
              return habit;
            });

            return { habits: updatedHabits };
          });
        }, 0);
      },

      setProfilePicture: (uri: string | null) => {
        set({ profilePicture: uri });
      },

      setNotificationsEnabled: (enabled: boolean) => {
        set({ notificationsEnabled: enabled });
      },

      calculateStreak: (habitId: number) => {
        const { completions } = get();
        let streak = 0;
        const today = new Date();
        
        for (let i = 0; i < 365; i++) {
          const checkDate = new Date(today);
          checkDate.setDate(today.getDate() - i);
          const dateStr = checkDate.toISOString().split('T')[0];
          
          const dayCompletions = completions[dateStr] || [];
          if (dayCompletions.includes(habitId)) {
            streak++;
          } else {
            break;
          }
        }
        
        return streak;
      },

      getBestStreak: (habitId: number) => {
        const habit = get().habits.find(h => h.id === habitId);
        return habit?.bestStreak || 0;
      },
    }),
    {
      name: 'habit-storage',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);