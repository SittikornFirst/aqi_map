import { useState, useEffect, useRef } from 'react';
import { geocodeByText } from '../services/aqiService'; // แก้ path ตามโปรเจกต์ของคุณ

export default function InputPanel({ onRouteSubmit, language }) {
    const [sText, setSText] = useState('');
    const [sCoord, setSCoord] = useState(null);
    const [dText, setDText] = useState('');
    const [dCoord, setDCoord] = useState(null);
    const [suggestions, setSuggestions] = useState([]);
    const [activeSuggestionField, setActiveSuggestionField] = useState(null);
    const suggestBoxRef = useRef(null);
    const destinationInputRef = useRef(null);

    const placeholders = {
        start: language === 'en' ? 'Start location' : 'ต้นทาง',
        destination: language === 'en' ? 'Destination' : 'ปลายทาง',
        route: language === 'en' ? 'Find Route' : 'ค้นหาเส้นทาง',
        currentLocation: language === 'en' ? 'Current location' : 'ตำแหน่งปัจจุบัน',
        swap: language === 'en' ? 'Swap' : 'สลับ',
    };

    useEffect(() => {
        if (window.map?.Search?.placeholder && suggestBoxRef.current) {
            window.map.Search.placeholder(suggestBoxRef.current);
        }

        if (window.map?.Search?.language) {
            window.map.Search.language(language);
        }

        const handleSuggest = (result) => {
            if (result?.data) {
                const items = [
                    ...(navigator.geolocation
                        ? [{ id: '__loc__', label: placeholders.currentLocation }]
                        : []),
                    ...result.data.map((item, i) => ({
                        id: i,
                        label: item.d,
                        query: item.w || item.keyword || item.d,
                    })),
                ];
                setSuggestions(items);
            } else {
                setSuggestions([]);
            }
        };

        if (window.map?.Event?.bind) {
            window.map.Event.bind('suggest', handleSuggest);
        }

        return () => {
            if (window.map?.Event?.unbind) {
                window.map.Event.unbind('suggest', handleSuggest);
            }
        };
    }, [language, placeholders.currentLocation]);

    const handleInput = (value, field) => {
        if (field === 'start') {
            setSText(value);
            setSCoord(null);
        } else {
            setDText(value);
            setDCoord(null);
        }

        setActiveSuggestionField(field);

        if (value.length >= 3 && window.map?.Search?.suggest) {
            window.map.Search.suggest(value, {});
        } else {
            setSuggestions([]);
        }
    };

    const selectSuggestion = async (sug) => {
        const field = activeSuggestionField;
        const label = sug.label.replace(/<[^>]+>/g, '');

        if (field === 'start') setSText(label);
        else setDText(label);

        if (sug.id === '__loc__') {
            navigator.geolocation.getCurrentPosition((pos) => {
                const coords = {
                    lon: pos.coords.longitude,
                    lat: pos.coords.latitude,
                };
                if (field === 'start') {
                    setSCoord(coords);
                    destinationInputRef.current?.focus();
                } else {
                    setDCoord(coords);
                }
            });
        } else {
            const coord = await geocodeByText(label);
            if (coord) {
                if (field === 'start') {
                    setSCoord(coord);
                    destinationInputRef.current?.focus();
                } else {
                    setDCoord(coord);
                }
            } else {
                alert('No result found for this location');
            }
        }

        setSuggestions([]);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!sCoord || !dCoord) {
            alert('Please select both start and destination locations.');
            return;
        }

        onRouteSubmit({
            startName: sText,
            startCoord: sCoord,
            destinationName: dText,
            destinationCoord: dCoord,
        });
    };

    const handleSwap = () => {
        setSText(dText);
        setDText(sText);
        setSCoord(dCoord);
        setDCoord(sCoord);
    };

    const handleBlur = () => {
        setTimeout(() => setSuggestions([]), 100);
    };

    return (
        <div>
        <form onSubmit={handleSubmit} className="p-4 bg-white shadow-md flex flex-col md:flex-row gap-2 items-start md:items-end relative">

            <div className="relative w-full md:w-1/2">
                <input
                    type="text"
                    placeholder={placeholders.start}
                    value={sText}
                    onChange={(e) => handleInput(e.target.value, 'start')}
                    onFocus={() => setActiveSuggestionField('start')}
                    onBlur={handleBlur}
                        className="w-full pl-9 p-2 h-12 border rounded"
                />
                {activeSuggestionField === 'start' && suggestions.length > 0 && (
                    <div
                        ref={suggestBoxRef}
                        className="absolute z-50 mt-1 bg-white rounded shadow max-h-60 overflow-y-auto w-full"
                    >
                        {suggestions.map((sug) => (
                            <div
                                key={sug.id}
                                onClick={() => selectSuggestion(sug)}
                                className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                            >
                                {sug.label.replace(/<[^>]+>/g, '')}
                            </div>
                        ))}
                    </div>
                )}
            </div>

            <div className="flex items-center justify-center mt-2 md:mt-0">
                <button
                    type="button"
                    onClick={handleSwap}
                    className="rounded-full p-2 bg-gray-200 hover:bg-gray-300 text-gray-700 transition duration-200"
                    title={placeholders.swap}
                >
                    🔄
                </button>
            </div>

            <div className="relative w-full md:w-1/2">
                <input
                    ref={destinationInputRef}
                    type="text"
                    placeholder={placeholders.destination}
                    value={dText}
                    onChange={(e) => handleInput(e.target.value, 'destination')}
                    onFocus={() => setActiveSuggestionField('destination')}
                    onBlur={handleBlur}
                        className="w-full pl-9 p-2 h-12 border rounded"
                />
                {activeSuggestionField === 'destination' && suggestions.length > 0 && (
                    <div
                        ref={suggestBoxRef}
                        className="absolute z-50 mt-1 bg-white rounded shadow max-h-60 overflow-y-auto w-full"
                    >
                        {suggestions.map((sug) => (
                            <div
                                key={sug.id}
                                onClick={() => selectSuggestion(sug)}
                                className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                            >
                                {sug.label.replace(/<[^>]+>/g, '')}
                            </div>
                        ))}
                    </div>
                )}
            </div>
            <button
                type="submit"
                disabled={!sCoord || !dCoord}
                className={`px-3 h-12 rounded ${sCoord && dCoord ? 'bg-indigo-600 text-white' : 'bg-gray-300'}`}
            >
                {placeholders.route}
            </button>
            </form>
        </div>
    );
}
