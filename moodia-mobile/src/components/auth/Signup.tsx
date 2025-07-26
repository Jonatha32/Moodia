import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  ScrollView
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../../contexts/AuthContext';

interface SignupProps {
  onToggleMode: () => void;
}

const moods = [
  { id: 'focus', name: 'Focus', emoji: '🎯', color: '#3A86FF' },
  { id: 'creative', name: 'Creativo', emoji: '🌈', color: '#FF5E9C' },
  { id: 'explorer', name: 'Explorador', emoji: '🔍', color: '#00C897' },
  { id: 'reflective', name: 'Reflexivo', emoji: '💭', color: '#9B5DE5' },
  { id: 'chill', name: 'Chill', emoji: '😎', color: '#70D6FF' },
  { id: 'relax', name: 'Relax', emoji: '😴', color: '#D3D3E7' },
  { id: 'motivated', name: 'Motivado', emoji: '🔥', color: '#FF6B6B' }
];

export default function Signup({ onToggleMode }: SignupProps) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    favoriteMood: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  
  const { signup } = useAuth();

  const validateForm = () => {
    if (!formData.name || !formData.email || !formData.password) {
      Alert.alert('Error', 'Por favor completa todos los campos obligatorios');
      return false;
    }
    if (formData.password.length < 6) {
      Alert.alert('Error', 'La contraseña debe tener al menos 6 caracteres');
      return false;
    }
    if (formData.password !== formData.confirmPassword) {
      Alert.alert('Error', 'Las contraseñas no coinciden');
      return false;
    }
    return true;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    setLoading(true);

    try {
      await signup(formData.email, formData.password, formData.name, formData.favoriteMood);
    } catch (error: any) {
      Alert.alert('Error', error.message || 'Error al crear la cuenta');
    } finally {
      setLoading(false);
    }
  };

  return (
    <LinearGradient
      colors={['#7B5BFF', '#FF5E9C', '#FFAB5E']}
      style={styles.container}
    >
      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardView}
      >
        <ScrollView contentContainerStyle={styles.scrollContent}>
          <View style={styles.card}>
            {/* Logo */}
            <View style={styles.logoContainer}>
              <LinearGradient
                colors={['#7B5BFF', '#FF5E9C']}
                style={styles.logo}
              >
                <Text style={styles.logoText}>M</Text>
              </LinearGradient>
            </View>

            {/* Header */}
            <Text style={styles.title}>¡Únete a Moodia!</Text>
            <Text style={styles.subtitle}>Sentí. Compartí. Crecé.</Text>

            {/* Form */}
            <View style={styles.form}>
              {/* Name Input */}
              <View style={styles.inputContainer}>
                <Ionicons name="person-outline" size={20} color="#9CA3AF" style={styles.inputIcon} />
                <TextInput
                  style={styles.input}
                  placeholder="Tu nombre"
                  value={formData.name}
                  onChangeText={(text) => setFormData(prev => ({ ...prev, name: text }))}
                  autoCapitalize="words"
                />
              </View>

              {/* Email Input */}
              <View style={styles.inputContainer}>
                <Ionicons name="mail-outline" size={20} color="#9CA3AF" style={styles.inputIcon} />
                <TextInput
                  style={styles.input}
                  placeholder="Tu email"
                  value={formData.email}
                  onChangeText={(text) => setFormData(prev => ({ ...prev, email: text }))}
                  keyboardType="email-address"
                  autoCapitalize="none"
                  autoCorrect={false}
                />
              </View>

              {/* Password Input */}
              <View style={styles.inputContainer}>
                <Ionicons name="lock-closed-outline" size={20} color="#9CA3AF" style={styles.inputIcon} />
                <TextInput
                  style={[styles.input, { paddingRight: 50 }]}
                  placeholder="Contraseña"
                  value={formData.password}
                  onChangeText={(text) => setFormData(prev => ({ ...prev, password: text }))}
                  secureTextEntry={!showPassword}
                  autoCapitalize="none"
                />
                <TouchableOpacity
                  style={styles.eyeButton}
                  onPress={() => setShowPassword(!showPassword)}
                >
                  <Ionicons 
                    name={showPassword ? "eye-off-outline" : "eye-outline"} 
                    size={20} 
                    color="#9CA3AF" 
                  />
                </TouchableOpacity>
              </View>

              {/* Confirm Password Input */}
              <View style={styles.inputContainer}>
                <Ionicons name="lock-closed-outline" size={20} color="#9CA3AF" style={styles.inputIcon} />
                <TextInput
                  style={[styles.input, { paddingRight: 50 }]}
                  placeholder="Confirmar contraseña"
                  value={formData.confirmPassword}
                  onChangeText={(text) => setFormData(prev => ({ ...prev, confirmPassword: text }))}
                  secureTextEntry={!showConfirmPassword}
                  autoCapitalize="none"
                />
                <TouchableOpacity
                  style={styles.eyeButton}
                  onPress={() => setShowConfirmPassword(!showConfirmPassword)}
                >
                  <Ionicons 
                    name={showConfirmPassword ? "eye-off-outline" : "eye-outline"} 
                    size={20} 
                    color="#9CA3AF" 
                  />
                </TouchableOpacity>
              </View>

              {/* Mood Selection */}
              <View>
                <Text style={styles.moodLabel}>¿Cuál es tu mood favorito? (opcional)</Text>
                <View style={styles.moodGrid}>
                  {moods.map((mood) => (
                    <TouchableOpacity
                      key={mood.id}
                      style={[
                        styles.moodButton,
                        formData.favoriteMood === mood.id && {
                          borderColor: mood.color,
                          backgroundColor: `${mood.color}20`
                        }
                      ]}
                      onPress={() => setFormData(prev => ({ 
                        ...prev, 
                        favoriteMood: prev.favoriteMood === mood.id ? '' : mood.id 
                      }))}
                    >
                      <Text style={styles.moodEmoji}>{mood.emoji}</Text>
                      <Text style={styles.moodName}>{mood.name}</Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>

              {/* Signup Button */}
              <TouchableOpacity
                style={[styles.button, loading && styles.buttonDisabled]}
                onPress={handleSubmit}
                disabled={loading}
              >
                <LinearGradient
                  colors={['#7B5BFF', '#FF5E9C']}
                  style={styles.buttonGradient}
                >
                  {loading ? (
                    <ActivityIndicator color="white" />
                  ) : (
                    <Text style={styles.buttonText}>Crear Cuenta</Text>
                  )}
                </LinearGradient>
              </TouchableOpacity>

              {/* Toggle Mode */}
              <View style={styles.toggleContainer}>
                <Text style={styles.toggleText}>¿Ya tenés cuenta? </Text>
                <TouchableOpacity onPress={onToggleMode}>
                  <Text style={styles.toggleLink}>Iniciar Sesión</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  keyboardView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
    padding: 20,
  },
  card: {
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    borderRadius: 24,
    padding: 32,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.3,
    shadowRadius: 20,
    elevation: 10,
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: 24,
  },
  logo: {
    width: 64,
    height: 64,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  logoText: {
    fontSize: 28,
    fontWeight: 'bold',
    color: 'white',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#1F2937',
    textAlign: 'center',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#6B7280',
    textAlign: 'center',
    fontStyle: 'italic',
    marginBottom: 32,
  },
  form: {
    gap: 20,
  },
  inputContainer: {
    position: 'relative',
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F9FAFB',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  inputIcon: {
    marginLeft: 16,
    marginRight: 12,
  },
  input: {
    flex: 1,
    height: 56,
    fontSize: 16,
    color: '#1F2937',
  },
  eyeButton: {
    position: 'absolute',
    right: 16,
    padding: 4,
  },
  moodLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 12,
  },
  moodGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  moodButton: {
    width: '22%',
    aspectRatio: 1,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#E5E7EB',
    backgroundColor: 'white',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 8,
  },
  moodEmoji: {
    fontSize: 20,
    marginBottom: 4,
  },
  moodName: {
    fontSize: 10,
    fontWeight: '600',
    color: '#6B7280',
    textAlign: 'center',
  },
  button: {
    borderRadius: 16,
    overflow: 'hidden',
    marginTop: 8,
  },
  buttonDisabled: {
    opacity: 0.7,
  },
  buttonGradient: {
    height: 56,
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: '600',
  },
  toggleContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 16,
  },
  toggleText: {
    color: '#6B7280',
    fontSize: 16,
  },
  toggleLink: {
    color: '#7B5BFF',
    fontSize: 16,
    fontWeight: '600',
  },
});