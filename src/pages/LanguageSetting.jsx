export default function LanguageSetting({ language, toggleLanguage }) {
    return (
        <div className="p-4">
            <h2 className="text-lg font-semibold mb-4">🌐 Language</h2>
            <button
                className={`block w-full p-2 mb-2 rounded ${language === 'th' ? 'bg-indigo-500 text-white' : 'bg-gray-200'}`}
                onClick={() => language !== 'th' && toggleLanguage()}
            >
                Thai
            </button>
            <button
                className={`block w-full p-2 rounded ${language === 'en' ? 'bg-indigo-500 text-white' : 'bg-gray-200'}`}
                onClick={() => language !== 'en' && toggleLanguage()}
            >
                English
            </button>
        </div>
    );
}
