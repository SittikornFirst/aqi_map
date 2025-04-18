export async function fetchAqiData() {
    const response = await fetch('/api/services/getNewAQI_JSON.php');
    if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    return data;
}

export async function geocodeByText(query) {
    const url = `https://search.longdo.com/addresslookup/api/addr/geocoding?text=${encodeURIComponent(query)}&key=1e5389ee57bee679e509fea38a14490d`;
    try {
        const res = await fetch(url);
        if (!res.ok) throw new Error('Request failed');

        const data = await res.json();
        if (data?.data?.length > 0) {
            const point = data.data[0].point[0];
            console.log('found', data);
            return {
                lat: point.lat,
                lon: point.lon,
            };
        } else {
            console.error('No geocode result found for:', data);
            return null;
        }
    } catch (err) {
        console.error('Geocode error:', err);
        return null;
    }
}

