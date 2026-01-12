// src/context/LanguageContext.js
import React, { createContext, useState, useContext, useEffect, ReactNode } from 'react';

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

export const LanguageProvider = ({ children }: { children: ReactNode }) => {
    const [language, setLanguage] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const storedLanguage = localStorage.getItem('userLanguage');
        if (storedLanguage) {
            setLanguage(storedLanguage);
        }
        setIsLoading(false);
    }, []);

    const selectLanguage = (lang: string) => {
        setLanguage(lang);
        localStorage.setItem('userLanguage', lang);
    };

    return (
        <LanguageContext.Provider value={{ language, selectLanguage, isLoading }}>
            {children}
        </LanguageContext.Provider>
    );
};

export const useLanguage = () => useContext(LanguageContext);
