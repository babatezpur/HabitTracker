import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  SafeAreaView,
} from 'react-native';
import { useHabitStore } from '../store/habitStore';
import { useTodayProgress } from '../hooks/useHabitHooks';
import HabitCard from '../components/HabitCard';
import ProgressBar from '../components/ProgressBar';

const HomeScreen = () => {
  const habits = useHabitStore(state => state.habits);
  const toggleHabit = useHabitStore(state => state.toggleHabit);
  const completions = useHabitStore(state => state.completions);
  const { completed, total, percentage } = useTodayProgress();

  const today = new Date().toISOString().split('T')[0];
  const todayCompletions = completions[today] || [];

  const formatDate = () => {
    const options: Intl.DateTimeFormatOptions = { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    };
    return new Date().toLocaleDateString(undefined, options);
  };

  const renderHabitItem = ({ item }: { item: any }) => {
    const isCompleted = todayCompletions.includes(item.id);
    
    return (
      <HabitCard
        habit={item}
        isCompleted={isCompleted}
        onToggle={() => toggleHabit(item.id, today)}
      />
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.dateText}>{formatDate()}</Text>
        <ProgressBar completed={completed} total={total} percentage={percentage} />
      </View>

      <FlatList
        data={habits}
        renderItem={renderHabitItem}
        keyExtractor={(item) => item.id.toString()}
        style={styles.habitsList}
        showsVerticalScrollIndicator={false}
      />

      {percentage === 100 && (
        <View style={styles.motivationContainer}>
          <Text style={styles.motivationText}>🎉 All habits completed today!</Text>
        </View>
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  header: {
    padding: 20,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e9ecef',
  },
  dateText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#212529',
    marginBottom: 10,
  },
  habitsList: {
    flex: 1,
    padding: 20,
  },
  motivationContainer: {
    padding: 20,
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#e9ecef',
  },
  motivationText: {
    textAlign: 'center',
    fontSize: 16,
    fontWeight: '600',
    color: '#28a745',
  },
});

export default HomeScreen;