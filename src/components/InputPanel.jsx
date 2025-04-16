import { useState } from 'react';
import SearchInput from './SearchInput';

function InputPanel({ onRouteSubmit, language }) {
    const [startValue, setStartValue] = useState('');
    const [destinationValue, setDestinationValue] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        onRouteSubmit({ start: startValue, destination: destinationValue });
    };

    const placeholders = {
        start: language === 'en' ? 'Start' : 'ต้นทาง',
        destination: language === 'en' ? 'Destination' : 'ปลายทาง',
        route: language === 'en' ? 'Route' : 'ค้นหาเส้นทาง'
    };

    return (
        <form onSubmit={handleSubmit} className="p-4 bg-white shadow-md flex flex-col md:flex-row space-y-2 md:space-y-0 md:space-x-2">
            <div className="flex-1">
                <SearchInput
                    placeholder={placeholders.start}
                    value={startValue}
                    onChange={setStartValue}
                    options={{ area: '10' }}
                />
            </div>
            <div className="flex-1">
                <SearchInput
                    placeholder={placeholders.destination}
                    value={destinationValue}
                    onChange={setDestinationValue}
                    options={{ area: '10' }}
                />
            </div>
            <button
                type="submit"
                disabled={!startValue || !destinationValue}
                className={`inline-flex items-center rounded-md px-3 py-2 text-sm font-semibold 
        ${!startValue || !destinationValue
                        ? 'bg-gray-300 '
                        : 'bg-indigo-600 hover:bg-indigo-500 text-white'}
    `}
            >
                {placeholders.route}
            </button>

        </form>
    );
}


export default InputPanel;
