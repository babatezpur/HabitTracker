import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
} from 'react-native';

interface HabitFormProps {
  onSave: (name: string, emoji: string) => void;
  onCancel: () => void;
}

const HabitForm: React.FC<HabitFormProps> = ({ onSave, onCancel }) => {
  const [name, setName] = useState('');
  const [selectedEmoji, setSelectedEmoji] = useState('📝');

  const emojis = ['💧', '💪', '📚', '🧘', '🏃', '🥗', '😴', '📝', '🎯', '🌱'];

  const handleSave = () => {
    if (name.trim()) {
      onSave(name.trim(), selectedEmoji);
      setName('');
      setSelectedEmoji('📝');
    }
  };

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.nameInput}
        placeholder="Habit name"
        value={name}
        onChangeText={setName}
        maxLength={50}
        autoFocus
      />
      
      <Text style={styles.emojiLabel}>Choose emoji:</Text>
      <View style={styles.emojiGrid}>
        {emojis.map((emoji) => (
          <TouchableOpacity
            key={emoji}
            style={[
              styles.emojiButton,
              selectedEmoji === emoji && styles.selectedEmoji
            ]}
            onPress={() => setSelectedEmoji(emoji)}
          >
            <Text style={styles.emojiText}>{emoji}</Text>
          </TouchableOpacity>
        ))}
      </View>

      <View style={styles.buttonRow}>
        <TouchableOpacity 
          style={styles.cancelButton}
          onPress={onCancel}
        >
          <Text style={styles.cancelButtonText}>Cancel</Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={[styles.saveButton, !name.trim() && styles.disabledButton]}
          onPress={handleSave}
          disabled={!name.trim()}
        >
          <Text style={styles.saveButtonText}>Save Habit</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    borderTopWidth: 1,
    borderTopColor: '#e9ecef',
    paddingTop: 16,
    marginTop: 16,
  },
  nameInput: {
    borderWidth: 1,
    borderColor: '#dee2e6',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    marginBottom: 16,
  },
  emojiLabel: {
    fontSize: 14,
    fontWeight: '500',
    color: '#212529',
    marginBottom: 8,
  },
  emojiGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 16,
  },
  emojiButton: {
    width: 44,
    height: 44,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    margin: 4,
    backgroundColor: '#f8f9fa',
  },
  selectedEmoji: {
    backgroundColor: '#28a745',
  },
  emojiText: {
    fontSize: 20,
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 12,
  },
  cancelButton: {
    flex: 1,
    backgroundColor: '#6c757d',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  cancelButtonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 16,
  },
  saveButton: {
    flex: 1,
    backgroundColor: '#007bff',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  disabledButton: {
    backgroundColor: '#adb5bd',
  },
  saveButtonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 16,
  },
});

export default HabitForm;