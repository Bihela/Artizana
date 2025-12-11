// src/components/LanguageSelectorModal.js
import React from 'react';

const LANGUAGES = [
  { code: 'en', label: 'English', flag: '🇬🇧' },
  { code: 'si', label: 'සිංහල', flag: '🇱🇰' },
];

export default function LanguageSelectorModal({ onSelect }) {
  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50"
      aria-modal="true"
      role="dialog"
    >
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-8 mx-4 text-center">
        <h2 className="text-2xl font-bold mb-2">Choose your language</h2>
        <p className="text-sm text-gray-600 mb-6">
          Please select your preferred language to continue using Artizana.
        </p>

        <div className="flex flex-col gap-3">
          {LANGUAGES.map((lang) => (
            <button
              key={lang.code}
              onClick={() => onSelect(lang.code)}
              className="w-full border border-gray-200 rounded-full py-3 px-4 flex items-center justify-center gap-2 hover:bg-green-50 hover:border-green-400 transition"
            >
              <span className="text-lg">{lang.flag}</span>
              <span className="font-medium text-gray-800">{lang.label}</span>
            </button>
          ))}
        </div>

        <p className="text-xs text-gray-400 mt-5">
          This preference is stored on this device and used for future sessions.
        </p>
      </div>
    </div>
  );
}
