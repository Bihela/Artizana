import React, { useState } from 'react';
import LanguageSelectorModal from '../components/LanguageSelectorModal';

const Home = () => {
    const [isModalOpen, setIsModalOpen] = useState(true);

    const handleLanguageSelect = (languageCode) => {
        console.log('Selected language:', languageCode);
        setIsModalOpen(false);
        // You can add logic here to save the selection to local storage or context if needed
    };

    return (
        <div className="h-screen w-full bg-white">
            {/* Home page is intentionally left blank for now */}
            {isModalOpen && <LanguageSelectorModal onSelect={handleLanguageSelect} />}
        </div>
    );
};

export default Home;
