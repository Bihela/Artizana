// artizana-mobile/src/screens/HomeScreen.js
import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ActivityIndicator } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import LanguageSelectorModal from '../components/LanguageSelectorModal';

const LANGUAGE_KEY = 'preferredLanguage';

export default function HomeScreen() {
  const [language, setLanguage] = useState(null);
  const [showLanguageModal, setShowLanguageModal] = useState(false);
  const [initializing, setInitializing] = useState(true);

  useEffect(() => {
    const loadLanguage = async () => {
      try {
        const stored = await AsyncStorage.getItem(LANGUAGE_KEY);
        if (!stored) {
          // First time → show popup
          setShowLanguageModal(true);
        } else {
          setLanguage(stored);
        }
      } catch (err) {
        console.log('Error reading language from storage:', err);
      } finally {
        setInitializing(false);
      }
    };

    loadLanguage();
  }, []);

  const handleLanguageSelect = async (code) => {
    try {
      await AsyncStorage.setItem(LANGUAGE_KEY, code);
      setLanguage(code);
      setShowLanguageModal(false);
    } catch (err) {
      console.log('Error saving language:', err);
    }
  };

  if (initializing) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#10B981" />
      </View>
    );
  }

  const languageLabel =
    language === 'si'
      ? 'සිංහල'
      : language === 'en'
      ? 'English'
      : 'Not selected';

  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <Text style={styles.title}>Buyer Dashboard</Text>
        <Text style={styles.subtitle}>
          (Dashboard UI coming in a future sprint)
        </Text>

        <View className="language-box" style={styles.languageBox}>
          <Text style={styles.languageTitle}>Session Language</Text>
          <Text style={styles.languageValue}>{languageLabel}</Text>
          <Text style={styles.languageHint}>
            This choice is saved on this device and reused next time.
          </Text>
        </View>
      </View>

      <LanguageSelectorModal
        visible={showLanguageModal}
        onSelect={handleLanguageSelect}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F9FAFB',
  },
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 16,
  },
  card: {
    backgroundColor: '#FFFFFF',
    width: '100%',
    maxWidth: 380,
    borderRadius: 20,
    padding: 20,
    shadowColor: '#000000',
    shadowOpacity: 0.08,
    shadowOffset: { width: 0, height: 6 },
    shadowRadius: 10,
    elevation: 4,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    textAlign: 'center',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 13,
    color: '#6B7280',
    textAlign: 'center',
    marginBottom: 16,
  },
  languageBox: {
    marginTop: 12,
    backgroundColor: '#F3F4F6',
    borderRadius: 14,
    padding: 14,
  },
  languageTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 4,
  },
  languageValue: {
    fontSize: 18,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 4,
  },
  languageHint: {
    fontSize: 11,
    color: '#6B7280',
  },
});
