import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Dimensions } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useMood } from '../contexts/MoodContext';
import { Mood } from '../types';

interface MoodOption {
  mood: Mood;
  emoji: string;
  label: string;
  description: string;
  colors: string[];
}

const moodOptions: MoodOption[] = [
  { 
    mood: 'focus', 
    emoji: '🎯', 
    label: 'Focus', 
    description: 'Concentración y productividad',
    colors: ['#3A86FF', '#4F94FF'] 
  },
  { 
    mood: 'creative', 
    emoji: '🌈', 
    label: 'Creativo', 
    description: 'Inspiración y creatividad',
    colors: ['#FF5E9C', '#FF7AB8'] 
  },
  { 
    mood: 'explorer', 
    emoji: '🔍', 
    label: 'Explorador', 
    description: 'Descubrimiento y aprendizaje',
    colors: ['#00C897', '#00E5A8'] 
  },
  { 
    mood: 'reflective', 
    emoji: '💭', 
    label: 'Reflexivo', 
    description: 'Contemplación y análisis',
    colors: ['#9B5DE5', '#B478F0'] 
  },
  { 
    mood: 'chill', 
    emoji: '😎', 
    label: 'Chill', 
    description: 'Relajación y tranquilidad',
    colors: ['#70D6FF', '#8DE0FF'] 
  },
  { 
    mood: 'relax', 
    emoji: '😴', 
    label: 'Relax', 
    description: 'Descanso y pausa',
    colors: ['#D3D3E7', '#E8E8F0'] 
  },
  { 
    mood: 'motivated', 
    emoji: '🔥', 
    label: 'Motivado', 
    description: 'Energía y determinación',
    colors: ['#FF6B6B', '#FF8A8A'] 
  }
];

interface MoodSelectorProps {
  onMoodSelect: (mood: Mood) => void;
}

const { width } = Dimensions.get('window');

export default function MoodSelectorNew({ onMoodSelect }: MoodSelectorProps) {
  const [selectedMood, setSelectedMood] = useState<Mood | null>(null);
  const [backgroundColors, setBackgroundColors] = useState(['#7B5BFF', '#FF5E9C', '#FFAB5E']);
  const [isAnimating, setIsAnimating] = useState(false);
  const { selectMood } = useMood();

  const getCurrentGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return '¡Buenos días!';
    if (hour < 18) return '¡Buenas tardes!';
    return '¡Buenas noches!';
  };

  const handleMoodSelect = async (mood: Mood) => {
    const selectedOption = moodOptions.find(option => option.mood === mood);
    if (!selectedOption) return;

    setSelectedMood(mood);
    setBackgroundColors(selectedOption.colors);
    setIsAnimating(true);

    try {
      await selectMood(mood);
      
      setTimeout(() => {
        onMoodSelect(mood);
      }, 1500);
    } catch (error) {
      console.error('Error selecting mood:', error);
      setIsAnimating(false);
    }
  };

  return (
    <LinearGradient
      colors={backgroundColors}
      style={styles.container}
    >
      <View style={styles.content}>
        <View style={styles.header}>
          <View style={styles.logoContainer}>
            <View style={styles.logo}>
              <Text style={styles.logoText}>M</Text>
            </View>
          </View>
          
          <Text style={styles.greeting}>{getCurrentGreeting()}</Text>
          <Text style={styles.title}>¿Cómo te sentís hoy?</Text>
          <Text style={styles.subtitle}>
            Tu mood define tu experiencia. Elegí el que mejor represente tu energía de hoy.
          </Text>
        </View>
        
        <View style={styles.moodGrid}>
          {moodOptions.map((option, index) => (
            <TouchableOpacity
              key={option.mood}
              style={[
                styles.moodCard,
                selectedMood === option.mood && styles.moodCardSelected,
                isAnimating && selectedMood !== option.mood && styles.moodCardFaded
              ]}
              onPress={() => handleMoodSelect(option.mood)}
              activeOpacity={0.8}
              disabled={isAnimating}
            >
              <View style={styles.moodCardContent}>
                <Text style={[
                  styles.moodEmoji,
                  selectedMood === option.mood && styles.moodEmojiSelected
                ]}>
                  {option.emoji}
                </Text>
                <Text style={styles.moodLabel}>{option.label}</Text>
                <Text style={styles.moodDescription}>{option.description}</Text>
                
                {selectedMood === option.mood && (
                  <View style={styles.selectedIndicator}>
                    <Text style={styles.checkmark}>✓</Text>
                  </View>
                )}
              </View>
            </TouchableOpacity>
          ))}
        </View>

        {selectedMood && (
          <View style={styles.confirmationContainer}>
            <View style={styles.confirmationCard}>
              <View style={styles.confirmationIcon}>
                <Text style={styles.checkmark}>✓</Text>
              </View>
              <Text style={styles.confirmationText}>
                ¡Perfecto! Preparando tu experiencia {moodOptions.find(m => m.mood === selectedMood)?.label}...
              </Text>
            </View>
          </View>
        )}
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 60,
    paddingBottom: 40,
  },
  header: {
    alignItems: 'center',
    marginBottom: 40,
  },
  logoContainer: {
    marginBottom: 24,
  },
  logo: {
    width: 80,
    height: 80,
    borderRadius: 24,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  logoText: {
    fontSize: 36,
    fontWeight: 'bold',
    color: 'white',
  },
  greeting: {
    fontSize: 36,
    fontWeight: 'bold',
    color: 'white',
    textAlign: 'center',
    marginBottom: 8,
  },
  title: {
    fontSize: 28,
    fontWeight: '600',
    color: 'rgba(255, 255, 255, 0.9)',
    textAlign: 'center',
    marginBottom: 16,
  },
  subtitle: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.7)',
    textAlign: 'center',
    lineHeight: 22,
    maxWidth: width * 0.85,
  },
  moodGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: 12,
  },
  moodCard: {
    width: (width - 64) / 2,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
    marginBottom: 12,
    overflow: 'hidden',
  },
  moodCardSelected: {
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    borderColor: 'rgba(255, 255, 255, 0.5)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 16,
    elevation: 8,
  },
  moodCardFaded: {
    opacity: 0.4,
  },
  moodCardContent: {
    padding: 20,
    alignItems: 'center',
    position: 'relative',
  },
  moodEmoji: {
    fontSize: 40,
    marginBottom: 8,
  },
  moodEmojiSelected: {
    transform: [{ scale: 1.1 }],
  },
  moodLabel: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'white',
    textAlign: 'center',
    marginBottom: 4,
  },
  moodDescription: {
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.7)',
    textAlign: 'center',
    lineHeight: 16,
  },
  selectedIndicator: {
    position: 'absolute',
    top: -8,
    right: -8,
    width: 32,
    height: 32,
    backgroundColor: 'white',
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 4,
  },
  checkmark: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#00C897',
  },
  confirmationContainer: {
    position: 'absolute',
    bottom: 60,
    left: 20,
    right: 20,
    alignItems: 'center',
  },
  confirmationCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 16,
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.3)',
  },
  confirmationIcon: {
    width: 32,
    height: 32,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  confirmationText: {
    flex: 1,
    fontSize: 16,
    fontWeight: '600',
    color: 'white',
  },
});