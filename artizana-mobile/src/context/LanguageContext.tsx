import React, { createContext, useState, useEffect, useContext } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface LanguageContextType {
    language: string | null;
    selectLanguage: (lang: string) => void;
    isLoading: boolean;
}

const LanguageContext = createContext<LanguageContextType>({
    language: null,
    selectLanguage: () => { },
    isLoading: true
});

export const LanguageProvider = ({ children }: { children: React.ReactNode }) => {
    const [language, setLanguage] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        loadLanguage();
    }, []);

    const loadLanguage = async () => {
        try {
            const storedLanguage = await AsyncStorage.getItem('userLanguage');
            if (storedLanguage) {
                setLanguage(storedLanguage);
            }
        } catch (error) {
            console.error('Failed to load language', error);
        } finally {
            setIsLoading(false);
        }
    };

    const selectLanguage = async (lang) => {
        try {
            await AsyncStorage.setItem('userLanguage', lang);
            setLanguage(lang);
        } catch (error) {
            console.error('Failed to save language', error);
        }
    };

    return (
        <LanguageContext.Provider value={{ language, selectLanguage, isLoading }}>
            {children}
        </LanguageContext.Provider>
    );
};

export const useLanguage = () => useContext(LanguageContext);
