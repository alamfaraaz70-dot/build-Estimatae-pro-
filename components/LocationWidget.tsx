
import React, { useState } from 'react';

interface LocationData {
  address?: string;
  isLocating: boolean;
}

const LocationWidget: React.FC = () => {
  const [location, setLocation] = useState<LocationData>({ isLocating: false });
  const [error, setError] = useState<string | null>(null);

  const fetchLocation = () => {
    setLocation({ ...location, isLocating: true });
    setError(null);
    
    if (!navigator.geolocation) {
      setError("Geolocation is not supported by your browser");
      setLocation({ ...location, isLocating: false });
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;
        
        // Reverse geocoding using Nominatim (OpenStreetMap)
        try {
          const res = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&accept-language=en`);
          const data = await res.json();
          if (data && data.display_name) {
            setLocation({ address: data.display_name, isLocating: false });
          } else {
            setLocation({ address: "Location pinpointed (Address details unavailable)", isLocating: false });
          }
        } catch (e) {
          console.error("Geocoding failed", e);
          setLocation({ address: `Located at ${latitude.toFixed(4)}, ${longitude.toFixed(4)}`, isLocating: false });
        }
      },
      (err) => {
        setError(err.message);
        setLocation({ ...location, isLocating: false });
      },
      { enableHighAccuracy: true, timeout: 5000, maximumAge: 0 }
    );
  };

  return (
    <div className="bg-white rounded-3xl shadow-sm border border-slate-100 p-6 overflow-hidden">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-bold text-slate-900 flex items-center gap-2">
          <i className="fas fa-map-marker-alt text-orange-500"></i>
          Project Location
        </h3>
        {location.address && (
          <button 
            onClick={fetchLocation}
            disabled={location.isLocating}
            className="text-xs font-bold text-orange-500 hover:text-orange-600 transition-colors uppercase tracking-wider disabled:opacity-50"
          >
            {location.isLocating ? 'Locating...' : 'Update'}
          </button>
        )}
      </div>

      <div className="space-y-3">
        {location.address ? (
          <div className="animate-in fade-in slide-in-from-bottom-2 duration-500">
            <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 shadow-inner">
              <p className="text-xs text-slate-500 mb-2 font-semibold uppercase tracking-tighter">Current Location</p>
              <p className="text-sm text-slate-800 font-medium leading-relaxed">
                {location.address}
              </p>
            </div>
          </div>
        ) : (
          <div className="py-8 text-center border-2 border-dashed border-slate-100 rounded-2xl">
            <div className={`text-slate-200 text-3xl mb-3 ${location.isLocating ? 'animate-pulse' : ''}`}>
              <i className="fas fa-location-arrow"></i>
            </div>
            <p className="text-xs text-slate-400 font-medium px-4 leading-normal">
              Detect your city for accurate local construction rates.
            </p>
            <button 
              onClick={fetchLocation}
              disabled={location.isLocating}
              className="mt-4 text-xs bg-slate-900 text-white px-6 py-2.5 rounded-xl font-bold hover:bg-slate-800 transition-all shadow-lg shadow-slate-200 disabled:opacity-50 flex items-center gap-2 mx-auto"
            >
              {location.isLocating ? (
                <><i className="fas fa-spinner fa-spin"></i> Locating...</>
              ) : (
                'Set My Location'
              )}
            </button>
          </div>
        )}

        {error && (
          <div className="p-3 bg-red-50 border border-red-100 rounded-xl flex items-start gap-2 animate-bounce">
            <i className="fas fa-exclamation-circle text-red-400 mt-0.5"></i>
            <p className="text-[10px] text-red-600 leading-tight font-medium">
              {error}. Please check your browser permissions.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default LocationWidget;
