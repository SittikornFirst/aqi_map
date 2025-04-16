import React from 'react';

function Navbar({ language }) {
    const navLabels = {
        en: ['Home', 'AQI', 'Setting'],
        th: ['หน้าแรก', 'คุณภาพอากาศ', 'ตั้งค่า']
    };

    // Use fallback to English if language not found
    const navigation = (navLabels[language] || navLabels.en).map(label => ({
        name: label,
        href: '#' // Update href as needed
    }));

    return (
        <nav className="bg-white shadow-md max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16">
                    <div className="flex space-x-8">
                        {navigation.map((item, index) => (
                            <a
                                key={index}
                                href={item.href}
                                className="text-sm font-semibold text-gray-700 hover:text-indigo-600 transition-colors"
                                aria-label={item.name}
                            >
                                {item.name}
                            </a>
                        ))}
                    </div>
            </div>
        </nav>
    );
}

export default Navbar;
