import { useHabitStore } from '../store/habitStore';

export const useHabitStreak = (habitId: number) => {
  const calculateStreak = useHabitStore(state => state.calculateStreak);

  return calculateStreak(habitId);
};

export const useTodayProgress = () => {
  const habits = useHabitStore(state => state.habits);
  const completions = useHabitStore(state => state.completions);

  const today = new Date().toISOString().split('T')[0];
  const todayCompletions = completions[today] || [];

  const completed = todayCompletions.length;
  const total = habits.length;
  const percentage = total > 0 ? Math.round((completed / total) * 100) : 0;

  return {
    completed,
    total,
    percentage,
    completedHabits: habits.filter(habit =>
      todayCompletions.includes(habit.id),
    ),
    remainingHabits: habits.filter(
      habit => !todayCompletions.includes(habit.id),
    ),
  };
};
