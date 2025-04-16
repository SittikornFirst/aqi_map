import { useState, useEffect, useRef } from 'react';

function SearchInput({ placeholder, value: initialValue, onChange, onSelect, options = {} }) {
    const [value, setValue] = useState(initialValue || '');
    const [suggestions, setSuggestions] = useState([]);
    const inputRef = useRef(null);
    const suggestionRef = useRef(null);

    // เมื่อ component mount จะพยายามเรียกใช้งาน Longdo API สำหรับ suggestion
    useEffect(() => {
        // ถ้ามีฟังก์ชัน placeholder ให้เรียกใช้งานเพื่อแนบ element (แต่ถ้าไม่มี เราสามารถทำเอง)
        if (window.longdo && window.longdo.Search && typeof window.longdo.Search.placeholder === 'function' && suggestionRef.current) {
            window.longdo.Search.placeholder(suggestionRef.current);
        }

        // ผูก event สำหรับ suggestion เพื่อรับผลลัพธ์และอัปเดต state
        const suggestHandler = (result) => {
            if (result.meta.keyword !== value) return;
            setSuggestions(result.data || []);
        };

        if (window.longdo && window.longdo.Event && typeof window.longdo.Event.bind === 'function') {
            window.longdo.Event.bind('suggest', suggestHandler);
        }

        return () => {
            setSuggestions([]);
            // หาก API มี unbind เราสามารถเรียกใช้งานเพื่อถอด event ได้
        };
    }, [value]);

    const handleInput = (e) => {
        const inputVal = e.target.value;
        setValue(inputVal);
        if (onChange) onChange(inputVal);

        if (inputVal.length >= 3 && window.longdo && window.longdo.Search && typeof window.longdo.Search.suggest === 'function') {
            console.log('Requesting suggestions for:', inputVal);
            window.longdo.Search.suggest(inputVal, options);
        } else {
            setSuggestions([]);
        }
    };


    const handleKeyUp = (e) => {
        if (e.keyCode === 13) {
            e.preventDefault();
            if (onSelect) onSelect(value);
            setSuggestions([]);
        }
    };

    const handleSuggestionClick = (item) => {
        // เมื่อเลือก suggestion ให้ปรับค่าลงใน input และส่งค่ากลับไปให้ onSelect
        setValue(item.w);
        if (onChange) onChange(item.w);
        if (onSelect) onSelect(item.w);
        setSuggestions([]);
    };

    return (
        <div className="relative">
            <input
                type="text"
                placeholder={placeholder}
                value={value}
                onChange={handleInput}
                onKeyUp={handleKeyUp}
                ref={inputRef}
                className="w-full p-2 border border-gray-300 rounded shadow-sm focus:outline-none focus:border-blue-500"
            />
            {/* Suggestion container */}
            {suggestions.length > 0 && (
                <div
                    ref={suggestionRef}
                    className="absolute z-10 top-full left-0 right-0 bg-white border border-gray-300 rounded mt-1 shadow-md overflow-hidden"
                >
                    {suggestions.map((item, index) => (
                        <button
                            key={index}
                            type="button"
                            onClick={() => handleSuggestionClick(item)}
                            className="w-full text-left px-4 py-2 hover:bg-gray-100 focus:bg-gray-100"
                        >
                            {item.d}
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
}

export default SearchInput;
