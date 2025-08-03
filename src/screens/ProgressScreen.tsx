import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
} from 'react-native';
import { useHabitStore } from '../store/habitStore';
import WeeklyCalendar from '../components/WeeklyCalendar';
import StatCard from '../components/StatCard';
import WeeklyChart from '../components/WeeklyChart';

const ProgressScreen = () => {
  const habits = useHabitStore(state => state.habits);
  const completions = useHabitStore(state => state.completions);

  const getWeeklyData = () => {
    const weekData = [];
    const today = new Date();
    
    for (let i = 6; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(today.getDate() - i);
      const dateStr = date.toISOString().split('T')[0];
      const dayCompletions = completions[dateStr] || [];
      
      weekData.push({
        date: dateStr,
        day: date.toLocaleDateString('en', { weekday: 'short' }),
        completed: dayCompletions.length,
        total: habits.length,
        percentage: habits.length > 0 ? Math.round((dayCompletions.length / habits.length) * 100) : 0,
      });
    }
    
    return weekData;
  };

  const weekData = getWeeklyData();
  const averageCompletion = Math.round(
    weekData.reduce((sum, day) => sum + day.percentage, 0) / 7
  );

  const topHabits = habits
    .sort((a, b) => b.streak - a.streak)
    .slice(0, 3);

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView}>
        <Text style={styles.title}>Weekly Progress</Text>
        
        {/* Weekly Calendar */}
        <WeeklyCalendar weekData={weekData} />

        {/* Statistics */}
        <View style={styles.statsContainer}>
          <Text style={styles.sectionTitle}>Statistics</Text>
          <View style={styles.statsGrid}>
            <StatCard number={habits.length} label="Total Habits" />
            <StatCard number={`${averageCompletion}%`} label="Weekly Average" />
            <StatCard 
              number={Math.max(...habits.map(h => h.bestStreak))} 
              label="Best Streak" 
            />
          </View>
        </View>

        {/* Weekly Chart */}
        <WeeklyChart data={weekData} />

        {/* Top Habits */}
        <View style={styles.topHabitsContainer}>
          <Text style={styles.sectionTitle}>Streak Leaderboard</Text>
          {topHabits.map((habit, index) => (
            <View key={habit.id} style={styles.habitRankCard}>
              <Text style={styles.rankNumber}>{index + 1}</Text>
              <Text style={styles.habitEmoji}>{habit.emoji}</Text>
              <View style={styles.habitRankInfo}>
                <Text style={styles.habitRankName}>{habit.name}</Text>
                <Text style={styles.habitRankStreak}>
                  🔥 {habit.streak} days (best: {habit.bestStreak})
                </Text>
              </View>
            </View>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  scrollView: {
    flex: 1,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#212529',
    padding: 20,
    paddingBottom: 10,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#212529',
    marginBottom: 16,
  },
  statsContainer: {
    backgroundColor: '#fff',
    margin: 20,
    marginTop: 0,
    borderRadius: 12,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  statsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  topHabitsContainer: {
    backgroundColor: '#fff',
    margin: 20,
    marginTop: 0,
    borderRadius: 12,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  habitRankCard: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#e9ecef',
  },
  rankNumber: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fd7e14',
    width: 30,
  },
  habitEmoji: {
    fontSize: 24,
    marginRight: 16,
  },
  habitRankInfo: {
    flex: 1,
  },
  habitRankName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#212529',
    marginBottom: 2,
  },
  habitRankStreak: {
    fontSize: 14,
    color: '#fd7e14',
  },
});

export default ProgressScreen;