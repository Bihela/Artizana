// tempory Home page fix until KAN-91 Merged.
import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, SafeAreaView, TouchableOpacity } from 'react-native';
import { useLanguage } from '../context/LanguageContext';
import LanguageSelectorModal from '../components/LanguageSelectorModal';

const HomeScreen = ({ navigation }: { navigation: any }) => {
    const { language, selectLanguage, isLoading } = useLanguage();

    const handleSelectLanguage = (lang) => {
        selectLanguage(lang);
    };

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.content}>
                <Text style={styles.title}>Welcome to Artizana</Text>
                <Text style={styles.subtitle}>
                    Session Language: {language === 'en' ? 'English' : language === 'si' ? 'සිංහල' : 'Not Selected'}
                </Text>

                <TouchableOpacity
                    style={styles.button}
                    onPress={() => navigation && navigation.navigate('Login')}
                >
                    <Text style={styles.buttonText}>Go to Login</Text>
                </TouchableOpacity>

                <TouchableOpacity
                    style={styles.button}
                    onPress={() => navigation && navigation.navigate('SignUp')}
                >
                    <Text style={styles.buttonText}>Go to Sign Up</Text>
                </TouchableOpacity>
            </View>

            <LanguageSelectorModal
                visible={!isLoading && !language}
                onSelectLanguage={handleSelectLanguage}
            />
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    content: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 10,
        color: '#1F2937',
    },
    subtitle: {
        fontSize: 16,
        color: '#6B7280',
        marginBottom: 30,
    },
    button: {
        width: '100%',
        backgroundColor: '#3B82F6',
        borderRadius: 12,
        padding: 15,
        alignItems: 'center',
        marginBottom: 15,
    },
    buttonText: {
        color: 'white',
        fontWeight: 'bold',
        fontSize: 16,
    },
    centered: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    }
});

export default HomeScreen;
