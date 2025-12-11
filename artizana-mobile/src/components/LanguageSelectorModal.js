// artizana-mobile/src/components/LanguageSelectorModal.js
import React from 'react';
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';

const LANGUAGES = [
  { code: 'en', label: 'English', flag: '🇬🇧' },
  { code: 'si', label: 'සිංහල', flag: '🇱🇰' },
];

export default function LanguageSelectorModal({ visible, onSelect }) {
  return (
    <Modal
      transparent
      visible={visible}
      animationType="fade"
    >
      <View style={styles.backdrop}>
        <View style={styles.card}>
          <Text style={styles.title}>Choose your language</Text>
          <Text style={styles.subtitle}>
            Please select your preferred language to continue.
          </Text>

          {LANGUAGES.map((lang) => (
            <TouchableOpacity
              key={lang.code}
              style={styles.button}
              onPress={() => onSelect(lang.code)}
            >
              <Text style={styles.buttonText}>
                {lang.flag} {lang.label}
              </Text>
            </TouchableOpacity>
          ))}

          <Text style={styles.footer}>
            This preference is saved on this device and reused next time.
          </Text>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.45)',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 24,
  },
  card: {
    backgroundColor: 'white',
    borderRadius: 20,
    paddingVertical: 24,
    paddingHorizontal: 20,
    width: '100%',
    maxWidth: 360,
    alignItems: 'center',
  },
  title: {
    fontSize: 20,
    fontWeight: '700',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 13,
    color: '#6b7280',
    textAlign: 'center',
    marginBottom: 16,
  },
  button: {
    width: '100%',
    paddingVertical: 12,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: '#e5e7eb',
    marginBottom: 8,
    alignItems: 'center',
  },
  buttonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
  },
  footer: {
    marginTop: 12,
    fontSize: 11,
    color: '#9ca3af',
    textAlign: 'center',
  },
});
