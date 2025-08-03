import { useCallback, useEffect } from 'react';
import NotificationService from '../services/NotificationService';
import { useHabitStore } from '../store/habitStore';
import { useTodayProgress } from './useHabitHooks';

export const useNotifications = () => {
  const notificationsEnabled = useHabitStore(
    state => state.notificationsEnabled,
  );
  const setNotificationsEnabled = useHabitStore(
    state => state.setNotificationsEnabled,
  );
  const { remainingHabits } = useTodayProgress();

  useEffect(() => {
    NotificationService.configure();
  }, []);

  const scheduleReminders = useCallback(() => {
    if (remainingHabits.length > 0) {
      const habitNames = remainingHabits.map(habit => habit.name);
      NotificationService.scheduleHabitReminder(habitNames);
    } else {
      NotificationService.cancelAllNotifications();
    }
  }, [remainingHabits]);

  useEffect(() => {
    if (notificationsEnabled) {
      scheduleReminders();
    } else {
      NotificationService.cancelAllNotifications();
    }
  }, [notificationsEnabled, scheduleReminders]);

  const requestPermissions = async (): Promise<boolean> => {
    try {
      const granted = await NotificationService.requestPermissions();
      if (granted) {
        setNotificationsEnabled(true);
        scheduleReminders();
        await NotificationService.savePermissionStatus(true);
      } else {
        await NotificationService.savePermissionStatus(false);
      }
      return granted;
    } catch (error) {
      console.error('Permission request failed:', error);
      return false;
    }
  };

  const checkPermissions = async (): Promise<boolean> => {
    return await NotificationService.checkNotificationPermissions();
  };

  return {
    requestPermissions,
    checkPermissions,
    scheduleReminders,
  };
};
