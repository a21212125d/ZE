import React, { useState, useCallback } from 'react';
import { findNearbyBarbers } from './services/geminiService';
import { BarberShop, LatLng } from './types';
import Header from './components/Header';
import BarberShopCard from './components/BarberShopCard';
import Spinner from './components/Spinner';
import ErrorDisplay from './components/ErrorDisplay';
import RatingFilter from './components/RatingFilter';

const App: React.FC = () => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [barberShops, setBarberShops] = useState<BarberShop[]>([]);
  const [summary, setSummary] = useState<string>('');
  const [hasSearched, setHasSearched] = useState<boolean>(false);
  const [ratingFilter, setRatingFilter] = useState<number | null>(null);
  const [currentLocation, setCurrentLocation] = useState<LatLng | null>(null);

  const handleFetchBarbers = useCallback(async (location: LatLng, rating: number | null) => {
    setIsLoading(true);
    setError(null);
    setBarberShops([]);
    setSummary('');
    setHasSearched(true);
    
    try {
      const result = await findNearbyBarbers(location, rating);
      setSummary(result.summary);
      setBarberShops(result.shops);
    } catch (e: any) {
      setError(e.message || "An unexpected error occurred.");
    } finally {
      setIsLoading(false);
    }
  }, []);

  const initiateSearch = useCallback(() => {
    if (!navigator.geolocation) {
      setError("Geolocation is not supported by your browser.");
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    setError(null);

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const location: LatLng = {
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        };
        setCurrentLocation(location);
        handleFetchBarbers(location, ratingFilter);
      },
      (geoError) => {
        let errorMessage = "An unknown error occurred while getting location.";
        switch (geoError.code) {
          case geoError.PERMISSION_DENIED:
            errorMessage = "Please allow location access to find barbers near you.";
            break;
          case geoError.POSITION_UNAVAILABLE:
            errorMessage = "Location information is unavailable.";
            break;
          case geoError.TIMEOUT:
            errorMessage = "The request to get user location timed out.";
            break;
        }
        setError(errorMessage);
        setIsLoading(false);
      }
    );
  }, [handleFetchBarbers, ratingFilter]);

  const handleRatingChange = (newRating: number | null) => {
    setRatingFilter(newRating);
    if(currentLocation) {
        handleFetchBarbers(currentLocation, newRating);
    }
  };
  
  const LocationIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
    </svg>
  );

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100 font-sans p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto">
        <Header />
        <main>
          <div className="text-center mb-12">
            {!hasSearched && (
               <button
                  onClick={initiateSearch}
                  disabled={isLoading}
                  className="inline-flex items-center justify-center bg-cyan-600 hover:bg-cyan-500 text-white font-bold py-3 px-8 rounded-full shadow-lg transform hover:scale-105 transition-transform duration-300 ease-in-out disabled:bg-gray-500 disabled:cursor-not-allowed"
                >
                  <LocationIcon />
                  Find Barbers Near Me
                </button>
            )}
           
            {isLoading && (
              <div className="flex flex-col items-center justify-center">
                <Spinner />
                <p className="mt-4 text-lg text-cyan-300">Finding best barbers near you...</p>
              </div>
            )}
            
            {error && <ErrorDisplay message={error} />}
          </div>

          {hasSearched && !isLoading && !error && (
            <div>
              {summary && <p className="text-center text-lg text-gray-300 mb-8 max-w-3xl mx-auto">{summary}</p>}
              
              <RatingFilter selectedRating={ratingFilter} onRatingChange={handleRatingChange} />

              {barberShops.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                  {barberShops.map((shop) => (
                    <BarberShopCard key={shop.uri} shop={shop} />
                  ))}
                </div>
              ) : (
                <div className="text-center py-10">
                   <p className="text-xl text-gray-400">No barber shops found matching your criteria. Try a different rating or search again.</p>
                </div>
              )}

              <div className="mt-12 text-center">
                 <button
                  onClick={initiateSearch}
                  disabled={isLoading}
                  className="inline-flex items-center justify-center bg-gray-700 hover:bg-gray-600 text-white font-bold py-3 px-8 rounded-full shadow-lg transform hover:scale-105 transition-transform duration-300 ease-in-out disabled:bg-gray-500 disabled:cursor-not-allowed"
                >
                  <LocationIcon />
                  Search Again
                </button>
              </div>

            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default App;