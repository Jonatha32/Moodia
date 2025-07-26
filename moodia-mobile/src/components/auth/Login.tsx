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

interface LoginProps {
  onToggleMode: () => void;
}

export default function Login({ onToggleMode }: LoginProps) {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  
  const { login } = useAuth();

  const handleSubmit = async () => {
    if (!formData.email || !formData.password) {
      Alert.alert('Error', 'Por favor completa todos los campos');
      return;
    }

    setLoading(true);

    try {
      await login(formData.email, formData.password);
    } catch (error: any) {
      Alert.alert('Error', error.message || 'Error al iniciar sesión');
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
            <Text style={styles.title}>¡Bienvenido a Moodia!</Text>
            <Text style={styles.subtitle}>Sentí. Compartí. Crecé.</Text>

            {/* Form */}
            <View style={styles.form}>
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
                  placeholder="Tu contraseña"
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

              {/* Login Button */}
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
                    <Text style={styles.buttonText}>Iniciar Sesión</Text>
                  )}
                </LinearGradient>
              </TouchableOpacity>

              {/* Toggle Mode */}
              <View style={styles.toggleContainer}>
                <Text style={styles.toggleText}>¿No tenés cuenta? </Text>
                <TouchableOpacity onPress={onToggleMode}>
                  <Text style={styles.toggleLink}>Registrate</Text>
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