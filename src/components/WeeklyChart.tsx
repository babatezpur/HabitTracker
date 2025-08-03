import React from 'react';
import { Dimensions, StyleSheet, Text, View } from 'react-native';

interface ChartData {
  day: string;
  percentage: number;
}

interface WeeklyChartProps {
  data: ChartData[];
}

Dimensions.get('window');

const WeeklyChart: React.FC<WeeklyChartProps> = ({ data }) => {
  const maxPercentage = Math.max(...data.map(d => d.percentage), 100);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Weekly Completion Trend</Text>
      <View style={styles.chartContainer}>
        <View style={styles.yAxis}>
          <Text style={styles.axisLabel}>100%</Text>
          <Text style={styles.axisLabel}>75%</Text>
          <Text style={styles.axisLabel}>50%</Text>
          <Text style={styles.axisLabel}>25%</Text>
          <Text style={styles.axisLabel}>0%</Text>
        </View>
        <View style={styles.chart}>
          {data.map((item, index) => {
            const height = (item.percentage / maxPercentage) * 120;
            return (
              <View key={index} style={styles.barContainer}>
                <View style={[styles.bar, { height }]} />
                <Text style={styles.percentage}>{item.percentage}%</Text>
              </View>
            );
          })}
        </View>
      </View>
      <View style={styles.dayLabels}>
        {data.map((item, index) => (
          <Text key={index} style={styles.dayLabel}>
            {item.day}
          </Text>
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
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
  title: {
    fontSize: 18,
    fontWeight: '600',
    color: '#212529',
    marginBottom: 20,
    textAlign: 'center',
  },
  chartContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    height: 150,
    marginBottom: 10,
  },
  yAxis: {
    height: 120,
    justifyContent: 'space-between',
    marginRight: 10,
  },
  axisLabel: {
    fontSize: 10,
    color: '#6c757d',
    textAlign: 'right',
  },
  chart: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-around',
    height: 120,
  },
  barContainer: {
    alignItems: 'center',
    flex: 1,
  },
  bar: {
    backgroundColor: '#28a745',
    width: 20,
    minHeight: 2,
    borderRadius: 2,
    marginBottom: 5,
  },
  percentage: {
    fontSize: 10,
    color: '#28a745',
    fontWeight: '600',
    marginTop: 2,
  },
  dayLabels: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
    marginTop: 10,
  },
  dayLabel: {
    fontSize: 12,
    color: '#6c757d',
    textAlign: 'center',
    flex: 1,
  },
});

export default WeeklyChart;
