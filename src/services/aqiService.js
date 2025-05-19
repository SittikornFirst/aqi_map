export async function fetchAqiData() {
    const response = await fetch('/api/services/getNewAQI_JSON.php');
    if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    return data;
}

