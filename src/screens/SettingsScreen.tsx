import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  Alert,
  Switch,
  Image,
} from 'react-native';
import { useHabitStore } from '../store/habitStore';
import HabitForm from '../components/HabitForm';
import { useNotifications } from '../hooks/useNotifications';
import ImagePickerService from '../services/ImagePickerService';

const SettingsScreen = () => {
  const { 
    habits, 
    profilePicture, 
    notificationsEnabled,
    addHabit, 
    deleteHabit, 
    setProfilePicture,
    setNotificationsEnabled 
  } = useHabitStore();
  
  const [showAddForm, setShowAddForm] = useState(false);
  const { requestPermissions } = useNotifications();

  const handleAddHabit = (name: string, emoji: string) => {
    addHabit(name, emoji);
    setShowAddForm(false);
  };

  const handleNotificationToggle = async (enabled: boolean) => {
    if (enabled) {
      const granted = await requestPermissions();
      if (!granted) {
        Alert.alert(
          'Permission Required',
          'Please enable notifications in your device settings to receive habit reminders.',
          [{ text: 'OK' }]
        );
        return;
      }
    }
    setNotificationsEnabled(enabled);
  };

  const handleDeleteHabit = (habitId: number, habitName: string) => {
    Alert.alert(
      'Delete Habit',
      `Are you sure you want to delete "${habitName}"?`,
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Delete', style: 'destructive', onPress: () => deleteHabit(habitId) },
      ]
    );
  };

  const handleChangeProfilePicture = async () => {
    Alert.alert(
      'Profile Picture',
      'Choose an option',
      [
        { 
          text: 'Camera', 
          onPress: async () => {
            const result = await ImagePickerService.openCamera();
            if (result.uri) {
              setProfilePicture(result.uri);
            } else if (result.error) {
              Alert.alert('Error', result.error);
            }
          }
        },
        { 
          text: 'Gallery', 
          onPress: async () => {
            const result = await ImagePickerService.openGallery();
            if (result.uri) {
              setProfilePicture(result.uri);
            } else if (result.error) {
              Alert.alert('Error', result.error);
            }
          }
        },
        { text: 'Remove', onPress: () => setProfilePicture(null) },
        { text: 'Cancel', style: 'cancel' },
      ]
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView}>
        <Text style={styles.title}>Settings</Text>

        {/* Profile Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Profile</Text>
          <TouchableOpacity style={styles.profileContainer} onPress={handleChangeProfilePicture}>
            <View style={styles.profilePicture}>
              {profilePicture ? (
                <Image source={{ uri: profilePicture }} style={styles.profileImage} />
              ) : (
                <Text style={styles.profilePlaceholder}>👤</Text>
              )}
            </View>
            <View style={styles.profileInfo}>
              <Text style={styles.profileText}>Profile Picture</Text>
              <Text style={styles.profileSubtext}>Tap to change</Text>
            </View>
          </TouchableOpacity>
        </View>

        {/* Notifications Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Notifications</Text>
          <View style={styles.settingRow}>
            <View style={styles.settingInfo}>
              <Text style={styles.settingText}>Daily Reminders</Text>
              <Text style={styles.settingSubtext}>6:00 PM notifications</Text>
            </View>
            <Switch
              value={notificationsEnabled}
              onValueChange={handleNotificationToggle}
              trackColor={{ false: '#e9ecef', true: '#28a745' }}
              thumbColor={notificationsEnabled ? '#fff' : '#fff'}
            />
          </View>
        </View>

        {/* Add Habit Section */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Manage Habits</Text>
            <TouchableOpacity 
              style={styles.addButton}
              onPress={() => setShowAddForm(!showAddForm)}
            >
              <Text style={styles.addButtonText}>
                {showAddForm ? '✕' : '+ Add'}
              </Text>
            </TouchableOpacity>
          </View>

          {showAddForm && (
            <HabitForm 
              onSave={handleAddHabit}
              onCancel={() => setShowAddForm(false)}
            />
          )}
        </View>

        {/* Existing Habits */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Your Habits</Text>
          {habits.map((habit) => (
            <View key={habit.id} style={styles.habitItem}>
              <Text style={styles.habitEmoji}>{habit.emoji}</Text>
              <View style={styles.habitDetails}>
                <Text style={styles.habitName}>{habit.name}</Text>
                <Text style={styles.habitStats}>
                  Current: {habit.streak} days • Best: {habit.bestStreak} days
                </Text>
              </View>
              <TouchableOpacity 
                style={styles.deleteButton}
                onPress={() => handleDeleteHabit(habit.id, habit.name)}
              >
                <Text style={styles.deleteButtonText}>🗑️</Text>
              </TouchableOpacity>
            </View>
          ))}
        </View>

        {/* App Info */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>About</Text>
          <Text style={styles.appInfo}>
            Daily Habit Tracker v1.0{'\n'}
            Build consistent routines with visual progress tracking
          </Text>
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
  section: {
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
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#212529',
    marginBottom: 16,
  },
  profileContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  profilePicture: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#e9ecef',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  profileImage: {
    width: 60,
    height: 60,
    borderRadius: 30,
  },
  profilePlaceholder: {
    fontSize: 24,
  },
  profileInfo: {
    flex: 1,
  },
  profileText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#212529',
  },
  profileSubtext: {
    fontSize: 14,
    color: '#6c757d',
    marginTop: 2,
  },
  settingRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  settingInfo: {
    flex: 1,
  },
  settingText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#212529',
  },
  settingSubtext: {
    fontSize: 14,
    color: '#6c757d',
    marginTop: 2,
  },
  addButton: {
    backgroundColor: '#28a745',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
  },
  addButtonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 14,
  },
  habitItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#e9ecef',
  },
  habitEmoji: {
    fontSize: 24,
    marginRight: 16,
  },
  habitDetails: {
    flex: 1,
  },
  habitName: {
    fontSize: 16,
    fontWeight: '500',
    color: '#212529',
    marginBottom: 2,
  },
  habitStats: {
    fontSize: 12,
    color: '#6c757d',
  },
  deleteButton: {
    padding: 8,
  },
  deleteButtonText: {
    fontSize: 16,
  },
  appInfo: {
    fontSize: 14,
    color: '#6c757d',
    lineHeight: 20,
  },
});

export default SettingsScreen;