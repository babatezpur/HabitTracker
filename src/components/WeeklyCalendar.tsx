import React from 'react';
import {
  View,
  Text,
  StyleSheet,
} from 'react-native';

interface DayData {
  date: string;
  day: string;
  completed: number;
  total: number;
  percentage: number;
}

interface WeeklyCalendarProps {
  weekData: DayData[];
}

const WeeklyCalendar: React.FC<WeeklyCalendarProps> = ({ weekData }) => {
  const getCompletionColor = (percentage: number) => {
    if (percentage >= 100) return '#28a745';
    if (percentage >= 50) return '#fd7e14';
    return '#dc3545';
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>This Week</Text>
      <View style={styles.weekGrid}>
        {weekData.map((day, index) => (
          <View key={index} style={styles.dayCard}>
            <Text style={styles.dayText}>{day.day}</Text>
            <View style={[
              styles.completionDot,
              { backgroundColor: getCompletionColor(day.percentage) }
            ]} />
            <Text style={styles.percentageText}>{day.percentage}%</Text>
          </View>
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    margin: 20,
    borderRadius: 12,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    color: '#212529',
    marginBottom: 16,
  },
  weekGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  dayCard: {
    alignItems: 'center',
    flex: 1,
  },
  dayText: {
    fontSize: 12,
    color: '#6c757d',
    marginBottom: 8,
  },
  completionDot: {
    width: 20,
    height: 20,
    borderRadius: 10,
    marginBottom: 4,
  },
  percentageText: {
    fontSize: 10,
    color: '#6c757d',
  },
});

export default WeeklyCalendar;