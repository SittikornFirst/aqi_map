import { useState, useRef, useEffect } from 'react';

export default function InputPanel({ onRouteSubmit, language, isMapReady }) {
    const [sText, setSText] = useState('');
    const [sCoord, setSCoord] = useState(null);
    const [dText, setDText] = useState('');
    const [dCoord, setDCoord] = useState(null);
    const [suggestions, setSuggestions] = useState([]);
    const [activeField, setActiveField] = useState(null);
    const currentKeywordRef = useRef('');
    const selectedFieldRef = useRef(null);
    const startRef = useRef(null);
    const destRef = useRef(null);

    useEffect(() => {
        if (!isMapReady) return;

        // Suggest event
        window.map.Search.language(language);
        window.map.Event.bind('suggest', result => {
            if (result.meta.keyword !== currentKeywordRef.current || !result.data) return;
            setSuggestions(
                result.data.map((item, i) => ({ id: i, label: item.d, keyword: item.w || item.d }))
            );
        });

        // Search event for full geocoding
        window.map.Event.bind('search', result => {
            if (result.meta.keyword !== currentKeywordRef.current || !result.data) return;
            const first = result.data[0];
            if (!first) return;
            const coord = { lat: first.lat, lon: first.lon };
            if (selectedFieldRef.current === 'start') {
                setSCoord(coord);
                destRef.current?.focus();
            } else {
                setDCoord(coord);
            }
            window.map.location(first);
        });
    }, [isMapReady, language]);

    const handleInput = (value, field) => {
        currentKeywordRef.current = value;
        selectedFieldRef.current = null;
        setActiveField(field);

        if (field === 'start') {
            setSText(value);
            setSCoord(null);
        } else {
            setDText(value);
            setDCoord(null);
        }

        if (isMapReady && window.map.Search && value.length >= 3) {
            window.map.Search.language(language);
            window.map.Search.suggest(value, { area: '10' });
        } else {
            setSuggestions([]);
        }
    };

    const handleSelect = item => {
        selectedFieldRef.current = activeField;
        currentKeywordRef.current = item.keyword;

        if (activeField === 'start') {
            setSText(item.label.replace(/<[^>]+>/g, ''));
        } else {
            setDText(item.label.replace(/<[^>]+>/g, ''));
        }

        // Trigger full search -> will be handled by 'search' event
        window.map.Search.search(item.keyword, { limit: 10 });
        setSuggestions([]);
    };

    const handleSubmit = e => {
        e.preventDefault();
        if (!sCoord || !dCoord) {
            alert('Please select both start and destination');
            return;
        }
        onRouteSubmit({ startName: sText, startCoord: sCoord, destinationName: dText, destinationCoord: dCoord });
    };

    const swap = () => {
        setSText(dText);
        setDText(sText);
        setSCoord(dCoord);
        setDCoord(sCoord);
        setActiveField(null);
    };

    return (
        <form onSubmit={handleSubmit} className="p-4 bg-white shadow-md flex flex-col gap-2 md:flex-row md:items-end">
            <div className="flex-1 relative">
                <input
                    ref={startRef}
                    type="text"
                    placeholder={language === 'en' ? 'Start' : 'ต้นทาง'}
                    value={sText}
                    onChange={e => handleInput(e.target.value, 'start')}
                    onFocus={() => setActiveField('start')}
                    className="w-full p-2 border rounded"
                />
                {activeField === 'start' && suggestions.length > 0 && (
                    <div className="absolute top-full mt-1 bg-white shadow max-h-60 overflow-auto w-full z-50">
                        {suggestions.map(item => (
                            <div key={item.id} onClick={() => handleSelect(item)} className="px-4 py-2 hover:bg-gray-100 cursor-pointer">
                                {item.label.replace(/<[^>]+>/g, '')}
                            </div>
                        ))}
                    </div>
                )}
            </div>

            <button type="button" onClick={swap} className="cursor-pointer px-3 py-2 rounded bg-blue-400 text-white hover:bg-blue-500">
                🔄
            </button>

            <div className="flex-1 relative">
                <input
                    ref={destRef}
                    type="text"
                    placeholder={language === 'en' ? 'Destination' : 'ปลายทาง'}
                    value={dText}
                    onChange={e => handleInput(e.target.value, 'destination')}
                    onFocus={() => setActiveField('destination')}
                    className="w-full p-2 border rounded"
                />
                {activeField === 'destination' && suggestions.length > 0 && (
                    <div className="absolute top-full mt-1 bg-white shadow max-h-60 overflow-auto w-full z-50">
                        {suggestions.map(item => (
                            <div key={item.id} onClick={() => handleSelect(item)} className="px-4 py-2 hover:bg-gray-100 cursor-pointer">
                                {item.label.replace(/<[^>]+>/g, '')}
                            </div>
                        ))}
                    </div>
                )}
            </div>

            <button
                type="submit"
                disabled={!sCoord || !dCoord}
                className={`px-4 py-2 rounded ${sCoord && dCoord ? 'cursor-pointer bg-indigo-600 hover:bg-indigo-700 text-white' : 'bg-gray-300'}`}
            >
                {language === 'en' ? 'Find Route' : 'ค้นหาเส้นทาง'}
            </button>
        </form>
    );
}
