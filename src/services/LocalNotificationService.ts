import { Alert, Platform } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

class LocalNotificationService {
  private isConfigured = false;
  private reminderTimeout: NodeJS.Timeout | null = null;

  configure() {
    if (this.isConfigured) return;
    this.isConfigured = true;
  }

  async requestPermissions(): Promise<boolean> {
    // For now, we'll simulate permission granted
    // In a real app, you'd use a proper notification library
    return new Promise((resolve) => {
      if (Platform.OS === 'android') {
        Alert.alert(
          'Notification Permission',
          'Allow notifications for daily habit reminders?',
          [
            { text: 'No', onPress: () => resolve(false) },
            { text: 'Yes', onPress: () => resolve(true) }
          ]
        );
      } else {
        resolve(true);
      }
    });
  }

  scheduleHabitReminder(habitNames: string[]) {
    // Clear existing reminder
    if (this.reminderTimeout) {
      clearTimeout(this.reminderTimeout);
    }

    if (habitNames.length === 0) return;

    const reminderTime = this.getNext6PM();
    const now = new Date();
    const timeUntilReminder = reminderTime.getTime() - now.getTime();

    if (timeUntilReminder > 0) {
      this.reminderTimeout = setTimeout(() => {
        this.showLocalReminder(habitNames);
      }, timeUntilReminder);
    }
  }

  private showLocalReminder(habitNames: string[]) {
    const reminderText = habitNames.length === 1 
      ? `Don't forget: ${habitNames[0]}`
      : `Don't forget your ${habitNames.length} habits today!`;

    Alert.alert(
      'Habit Reminder 🔔',
      reminderText,
      [{ text: 'OK', onPress: () => console.log('Reminder acknowledged') }]
    );

    // Schedule next day's reminder
    this.scheduleHabitReminder(habitNames);
  }

  cancelAllNotifications() {
    if (this.reminderTimeout) {
      clearTimeout(this.reminderTimeout);
      this.reminderTimeout = null;
    }
  }

  private getNext6PM(): Date {
    const now = new Date();
    const next6PM = new Date();
    
    next6PM.setHours(18, 0, 0, 0);
    
    // If it's already past 6 PM today, schedule for tomorrow
    if (now.getTime() > next6PM.getTime()) {
      next6PM.setDate(next6PM.getDate() + 1);
    }
    
    return next6PM;
  }

  async checkNotificationPermissions(): Promise<boolean> {
    // Check if user has previously granted permissions
    try {
      const permissions = await AsyncStorage.getItem('notification_permissions');
      return permissions === 'granted';
    } catch {
      return false;
    }
  }

  async savePermissionStatus(granted: boolean) {
    try {
      await AsyncStorage.setItem('notification_permissions', granted ? 'granted' : 'denied');
    } catch (error) {
      console.error('Failed to save permission status:', error);
    }
  }
}

export default new LocalNotificationService();