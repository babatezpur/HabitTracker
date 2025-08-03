import React, { useEffect, useRef } from 'react';
import { Animated, StyleSheet, Text, View } from 'react-native';

interface ProgressBarProps {
  completed: number;
  total: number;
  percentage: number;
}

const ProgressBar: React.FC<ProgressBarProps> = ({
  completed,
  total,
  percentage,
}) => {
  const progressWidth = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(progressWidth, {
      toValue: percentage,
      duration: 800,
      useNativeDriver: false,
    }).start();
  }, [percentage, progressWidth]);

  return (
    <View style={styles.container}>
      <Text style={styles.progressText}>
        {completed}/{total} habits completed ({percentage}%)
      </Text>
      <View style={styles.progressBar}>
        <Animated.View
          style={[
            styles.progressFill,
            {
              width: progressWidth.interpolate({
                inputRange: [0, 100],
                outputRange: ['0%', '100%'],
                extrapolate: 'clamp',
              }),
            },
          ]}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 10,
  },
  progressText: {
    fontSize: 14,
    color: '#6c757d',
    marginBottom: 10,
  },
  progressBar: {
    height: 8,
    backgroundColor: '#e9ecef',
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#28a745',
    borderRadius: 4,
  },
});

export default ProgressBar;
