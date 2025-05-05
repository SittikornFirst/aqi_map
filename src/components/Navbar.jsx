import React from "react";
import { Link } from "react-router-dom";

function Navbar({ language }) {
  const isTH = language === "th";

  const labels = {
    home: isTH ? "หน้าแรก" : "Home",
    aqi: isTH ? "คุณภาพอากาศ" : "AQI",
    setting: isTH ? "ตั้งค่า" : "Setting",
  };

<<<<<<< HEAD
  return (
    <div className="flex  items-center h-16 px-4">
      {/* Top Navbar for desktop/tablet */}
      {/* Desktop navbar */}
      <div className="hidden md:flex w-full">
        <nav className="flex justify-center w-full space-x-10">
          <Link
            to="/"
            className="text-sm font-semibold text-gray-700 hover:text-indigo-600"
          >
            {labels.home}
          </Link>
          <Link
            to="/aqi"
            className="text-sm font-semibold text-gray-700 hover:text-indigo-600"
          >
            {labels.aqi}
          </Link>
          <Link
            to="/setting"
            className="text-sm font-semibold text-gray-700 hover:text-indigo-600"
          >
            {labels.setting}
          </Link>
        </nav>
      </div>

      {/* Bottom Navbar for mobile */}
      <nav className="fixed bottom-0 left-0 right-0 z-50 bg-white shadow-inner border-t border-gray-200 md:hidden">
        <div className="flex justify-center space-x-8 py-2">
          <Link
            to="/"
            className="flex flex-col items-center text-xs text-gray-700 hover:text-indigo-600"
          >
            <span className="text-xl">🏠</span>
            {labels.home}
          </Link>
          <Link
            to="/aqi"
            className="flex flex-col items-center text-xs text-gray-700 hover:text-indigo-600"
          >
            <span className="text-xl">🌫</span>
            {labels.aqi}
          </Link>
          <Link
            to="/setting"
            className="flex flex-col items-center text-xs text-gray-700 hover:text-indigo-600"
          >
            <span className="text-xl">⚙️</span>
            {labels.setting}
          </Link>
        </div>
      </nav>
    </div>
  );
=======
    return (
        <div className="flex h-16 px-4">
            {/* Top Navbar for desktop/tablet */}
            <div className="hidden md:flex w-full ">
                <nav className="flex items-center space-x-10">
                    <Link to="/" className="text-sm font-semibold text-gray-700 hover:text-indigo-600">{labels.home}</Link>
                    <Link to="/aqi" className="text-sm font-semibold text-gray-700 hover:text-indigo-600">{labels.aqi}</Link>
                    <Link to="/setting" className="text-sm font-semibold text-gray-700 hover:text-indigo-600">{labels.setting}</Link>
                </nav>
            </div>

            {/* Bottom Navbar for mobile */}
            <nav className="fixed bottom-0 left-0 right-0 z-50 bg-white shadow-inner border-t border-gray-200 md:hidden">
                <div className="flex justify-center space-x-8 py-2">
                    <Link to="/" className="flex flex-col items-center text-xs text-gray-700 hover:text-indigo-600">
                        <span className="text-xl">🏠</span>
                        {labels.home}
                    </Link>
                    <Link to="/aqi" className="flex flex-col items-center text-xs text-gray-700 hover:text-indigo-600">
                        <span className="text-xl">🌫️</span>
                        {labels.aqi}
                    </Link>
                    <Link to="/setting" className="flex flex-col items-center text-xs text-gray-700 hover:text-indigo-600">
                        <span className="text-xl">⚙️</span>
                        {labels.setting}
                    </Link>
                </div>
            </nav>
        </div>

    );
>>>>>>> b2f80f75c311235bae44552066b221d319f1b05e
}

export default Navbar;
