import React from 'react';
import {
  View,
  Text,
  StyleSheet,
} from 'react-native';

interface StatCardProps {
  number: string | number;
  label: string;
  color?: string;
}

const StatCard: React.FC<StatCardProps> = ({ number, label, color = '#28a745' }) => {
  return (
    <View style={styles.container}>
      <Text style={[styles.number, { color }]}>{number}</Text>
      <Text style={styles.label}>{label}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    flex: 1,
  },
  number: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  label: {
    fontSize: 12,
    color: '#6c757d',
    textAlign: 'center',
  },
});

export default StatCard;