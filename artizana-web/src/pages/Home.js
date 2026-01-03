import React, { useState } from 'react';
import LanguageSelectorModal from '../components/LanguageSelectorModal';

const Home = () => {
    const [isModalOpen, setIsModalOpen] = useState(true);

    const handleLanguageSelect = (languageCode) => {
        console.log('Selected language:', languageCode);
        setIsModalOpen(false);
    };

    return (
        <div className="h-full w-full bg-white flex items-center justify-center min-h-[calc(100vh-64px)]">
            {isModalOpen && <LanguageSelectorModal onSelect={handleLanguageSelect} />}
        </div>
    );
};

export default Home;
