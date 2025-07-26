import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Mood } from '../types';

interface MoodOption {
  mood: Mood;
  emoji: string;
  label: string;
  color: string;
}

const moodOptions: MoodOption[] = [
  { mood: 'focus', emoji: '🎯', label: 'Focus', color: '#3A86FF' },
  { mood: 'creative', emoji: '🌈', label: 'Creativo', color: '#FF5E9C' },
  { mood: 'explorer', emoji: '🔍', label: 'Explorador', color: '#00C897' },
  { mood: 'reflective', emoji: '💭', label: 'Reflexivo', color: '#9B5DE5' },
  { mood: 'chill', emoji: '😎', label: 'Chill', color: '#70D6FF' },
  { mood: 'relax', emoji: '😴', label: 'Relax', color: '#D3D3E7' },
  { mood: 'motivated', emoji: '🔥', label: 'Motivado', color: '#FF6B6B' },
];

interface MoodSelectorProps {
  onMoodSelect: (mood: Mood) => void;
  selectedMood?: Mood;
}

export default function MoodSelector({ onMoodSelect, selectedMood }: MoodSelectorProps) {
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>¿Cómo te sentís hoy?</Text>
        <Text style={styles.subtitle}>Elegí tu mood y descubrí contenido que resuene contigo</Text>
      </View>
      <View style={styles.grid}>
        {moodOptions.map((option) => (
          <TouchableOpacity
            key={option.mood}
            style={[
              styles.moodButton,
              selectedMood === option.mood && {
                borderColor: option.color,
                backgroundColor: `${option.color}15`,
                shadowColor: option.color,
                shadowOffset: { width: 0, height: 4 },
                shadowOpacity: 0.3,
                shadowRadius: 8,
                elevation: 8,
              },
            ]}
            onPress={() => onMoodSelect(option.mood)}
          >
            <Text style={styles.emoji}>{option.emoji}</Text>
            <Text style={[
              styles.label,
              selectedMood === option.mood && { color: option.color, fontWeight: '600' }
            ]}>{option.label}</Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#7B5BFF',
    justifyContent: 'center',
    paddingHorizontal: 24,
  },
  header: {
    alignItems: 'center',
    marginBottom: 48,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 12,
    color: '#FFFFFF',
  },
  subtitle: {
    fontSize: 16,
    textAlign: 'center',
    color: '#FFFFFF',
    opacity: 0.8,
    paddingHorizontal: 20,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  moodButton: {
    width: '48%',
    aspectRatio: 1,
    borderWidth: 2,
    borderColor: '#F0F0F5',
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
    backgroundColor: '#FFFFFF',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  emoji: {
    fontSize: 36,
    marginBottom: 8,
  },
  label: {
    fontSize: 16,
    fontWeight: '500',
    color: '#1E1E2F',
  },
});