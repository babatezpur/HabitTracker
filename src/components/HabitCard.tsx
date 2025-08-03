import React, { useEffect, useRef } from 'react';
import {
  Animated,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { Habit } from '../store/habitStore';

interface HabitCardProps {
  habit: Habit;
  isCompleted: boolean;
  onToggle: () => void;
}

const HabitCard: React.FC<HabitCardProps> = ({
  habit,
  isCompleted,
  onToggle,
}) => {
  const scaleValue = useRef(new Animated.Value(1)).current;
  const checkmarkScale = useRef(
    new Animated.Value(isCompleted ? 1 : 0),
  ).current;
  const streakPulse = useRef(new Animated.Value(1)).current;
  const streakAnimation = useRef<Animated.CompositeAnimation | null>(null);

  useEffect(() => {
    Animated.spring(checkmarkScale, {
      toValue: isCompleted ? 1 : 0,
      tension: 300,
      friction: 10,
      useNativeDriver: true,
    }).start();
  }, [isCompleted, checkmarkScale]);

  useEffect(() => {
    // Stop any existing animation
    if (streakAnimation.current) {
      streakAnimation.current.stop();
      streakAnimation.current = null;
    }

    // Only start animation if habit has a streak AND is currently completed
    if (habit.streak > 0 && isCompleted) {
      streakAnimation.current = Animated.loop(
        Animated.sequence([
          Animated.timing(streakPulse, {
            toValue: 1.1,
            duration: 1000,
            useNativeDriver: true,
          }),
          Animated.timing(streakPulse, {
            toValue: 1,
            duration: 1000,
            useNativeDriver: true,
          }),
        ]),
      );
      streakAnimation.current.start();
    } else {
      // Reset pulse to normal size when not animating
      Animated.timing(streakPulse, {
        toValue: 1,
        duration: 200,
        useNativeDriver: true,
      }).start();
    }
  }, [habit.streak, isCompleted, streakPulse]);

  const handlePress = () => {
    Animated.sequence([
      Animated.timing(scaleValue, {
        toValue: 0.95,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.timing(scaleValue, {
        toValue: 1,
        duration: 100,
        useNativeDriver: true,
      }),
    ]).start();

    onToggle();
  };

  return (
    <Animated.View style={[{ transform: [{ scale: scaleValue }] }]}>
      <TouchableOpacity
        style={[styles.habitCard, isCompleted && styles.completedCard]}
        onPress={handlePress}
        activeOpacity={0.8}
      >
        <View style={styles.habitContent}>
          <Text style={styles.habitEmoji}>{habit.emoji}</Text>
          <View style={styles.habitInfo}>
            <Text
              style={[styles.habitName, isCompleted && styles.completedText]}
            >
              {habit.name}
            </Text>
            <Animated.View style={{ transform: [{ scale: streakPulse }] }}>
              <Text style={styles.streakText}>
                🔥 {habit.streak} day streak
              </Text>
            </Animated.View>
          </View>
          <View style={[styles.checkbox, isCompleted && styles.checkedBox]}>
            <Animated.Text
              style={[
                styles.checkmark,
                { transform: [{ scale: checkmarkScale }] },
              ]}
            >
              ✓
            </Animated.Text>
          </View>
        </View>
      </TouchableOpacity>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  habitCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  completedCard: {
    backgroundColor: '#d4edda',
    borderColor: '#28a745',
    borderWidth: 2,
  },
  habitContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  habitEmoji: {
    fontSize: 32,
    marginRight: 16,
  },
  habitInfo: {
    flex: 1,
  },
  habitName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#212529',
    marginBottom: 4,
  },
  completedText: {
    textDecorationLine: 'line-through',
    color: '#6c757d',
  },
  streakText: {
    fontSize: 14,
    color: '#fd7e14',
    fontWeight: '500',
  },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#dee2e6',
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkedBox: {
    backgroundColor: '#28a745',
    borderColor: '#28a745',
  },
  checkmark: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default HabitCard;
