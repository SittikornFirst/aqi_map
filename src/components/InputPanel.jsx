
import { useState, useRef, useEffect } from 'react';

export default function InputPanel({ onRouteSubmit, language }) {
    const [sText, setSText] = useState('');
    const [sCoord, setSCoord] = useState(null);
    const [dText, setDText] = useState('');
    const [dCoord, setDCoord] = useState(null);
    const [suggestions, setSuggestions] = useState([]);
    const [activeField, setActiveField] = useState(null);
    const inputRef = useRef(null);
    const destinationRef = useRef(null);
    const suggestBoxRef = useRef(null);

    useEffect(() => {
        console.log('[INIT] useEffect mount, setting language:', language);
        if (window.map && window.map.Search && window.map.Search.language) {
            window.map.Search.language(language);
        }

        const handleSuggest = (result) => {
            console.log('[SUGGEST EVENT] Fired with result:', result);
            if (!result || !result.data) return;
            const items = result.data.map((item, i) => ({
                id: i,
                label: item.d,
                keyword: item.w || item.d
            }));
            setSuggestions(items);
        };

        if (window.map && window.map.Event && window.map.Event.bind) {
            window.map.Event.bind('suggest', handleSuggest);
        }
        return () => {
            if (window.map && window.map.Event && window.map.Event.unbind) {
                window.map.Event.unbind('suggest', handleSuggest);
            }
        };
    }, [language]);

    const handleInput = (value, field) => {
        console.log('[INPUT]', field, 'value:', value);
        if (field === 'start') {
            setSText(value);
            setSCoord(null);
        } else {
            setDText(value);
            setDCoord(null);
        }
        setActiveField(field);

        if (!window.map || !window.map.Search) {
            console.warn('[SKIP] map.Search not available yet');
            return;
        }
        if (value.length >= 3) {
            window.map.Search.suggest(value);
        } else {
            setSuggestions([]);
        }
    };

    const handleSelect = (item) => {
        console.log('[SELECT]', activeField, 'item:', item);
        const cleanText = item.label.replace(/<[^>]+>/g, '');
        if (activeField === 'start') {
            setSText(cleanText);
        } else {
            setDText(cleanText);
        }

        // Call search + get result position
        console.log('[SEARCH] keyword:', item.keyword);
        window.longdo.Util.search(item.keyword, (res) => {
            console.log('[SEARCH RESULT]', res);
            if (res?.length > 0) {
                const coord = { lat: res[0].lat, lon: res[0].lon };
                if (activeField === 'start') {
                    setSCoord(coord);
                    destinationRef.current?.focus();
                } else {
                    setDCoord(coord);
                }
                window.map.location(res[0]); // move map to marker
            }
        });

        setSuggestions([]);
    };

    const handleSubmit = (e) => {
        console.log('[SUBMIT]', { sText, sCoord, dText, dCoord });
        e.preventDefault();
        if (!sCoord || !dCoord) {
            alert('Please select both start and destination');
            return;
        }
        onRouteSubmit({
            startName: sText,
            startCoord: sCoord,
            destinationName: dText,
            destinationCoord: dCoord
        });
    };

    const handleSwap = () => {
        console.log('[SWAP] before swap:', { sText, dText, sCoord, dCoord });
        setSText(dText);
        setDText(sText);
        setSCoord(dCoord);
        setDCoord(sCoord);
    };

    return (
        <form onSubmit={handleSubmit} className="p-4 bg-white shadow-md flex flex-col gap-2 md:flex-row md:items-end relative">
            <div className="flex-1 relative">
                <input
                    ref={inputRef}
                    type="text"
                    placeholder={language === 'en' ? 'Start' : 'ต้นทาง'}
                    value={sText}
                    onChange={(e) => handleInput(e.target.value, 'start')}
                    onFocus={() => setActiveField('start')}
                    className="w-full p-2 border rounded"
                />
            </div>

            <button
                type="button"
                onClick={handleSwap}
                className="px-3 py-2 rounded bg-blue-400 text-white font-bold hover:bg-blue-500"
                title="Swap"
            >
                🔄
            </button>

            <div className="flex-1 relative">
                <input
                    ref={destinationRef}
                    type="text"
                    placeholder={language === 'en' ? 'Destination' : 'ปลายทาง'}
                    value={dText}
                    onChange={(e) => handleInput(e.target.value, 'destination')}
                    onFocus={() => setActiveField('destination')}
                    className="w-full p-2 border rounded"
                />
            </div>

            {suggestions.length > 0 && (
                <div
                    ref={suggestBoxRef}
                    className="absolute z-50 mt-2 bg-white shadow max-h-60 overflow-y-auto w-full md:w-96 left-0"
                >
                    {suggestions.map((item) => (
                        <div
                            key={item.id}
                            onClick={() => handleSelect(item)}
                            className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                        >
                            {item.label.replace(/<[^>]+>/g, '')}
                        </div>
                    ))}
                </div>
            )}

            <button
                type="submit"
                disabled={!sCoord || !dCoord}
                className={`px-4 py-2 rounded ${sCoord && dCoord ? 'bg-indigo-600 text-white' : 'bg-gray-300'}`}
            >
                {language === 'en' ? 'Find Route' : 'ค้นหาเส้นทาง'}
            </button>
        </form>
    );
}
