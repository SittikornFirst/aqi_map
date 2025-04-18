export default function AboutPage() {
  return (
    <div className="p-4">
      <h2 className="text-lg font-semibold mb-4">About</h2>
      <p>
        This is a simple web application that provides air quality information
        and routing functionality. It uses the Google Maps API to get the
        current location and to calculate the route between two points. It also
        uses the AQI API to get the current air quality information.
      </p>
    </div>
  );
}
