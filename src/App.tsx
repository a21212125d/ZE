
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
  
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [lastQuery, setLastQuery] = useState<LatLng | string | null>(null);

  const handleFetchBarbers = useCallback(async (query: LatLng | string, rating: number | null) => {
    setIsLoading(true);
    setError(null);
    setBarberShops([]);
    setSummary('');
    setHasSearched(true);
    setLastQuery(query);
    
    try {
      const result = await findNearbyBarbers(query, rating);
      setSummary(result.summary);
      setBarberShops(result.shops);
    } catch (e: any) {
      setError(e.message || "An unexpected error occurred.");
    } finally {
      setIsLoading(false);
    }
  }, []);

  const initiateGeoSearch = useCallback(() => {
    if (!navigator.geolocation) {
      setError("Geolocation is not supported by your browser.");
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

  const initiateTextSearch = (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!searchQuery.trim()) {
      setError("Please enter a location to search.");
      return;
    }
    handleFetchBarbers(searchQuery, ratingFilter);
  };

  const handleRatingChange = (newRating: number | null) => {
    setRatingFilter(newRating);
    if(lastQuery) {
        handleFetchBarbers(lastQuery, newRating);
    }
  };
  
  const LocationIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
    </svg>
  );

  const SearchIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" viewBox="0 0 20 20" fill="currentColor">
      <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
    </svg>
  );


  return (
    <div className="min-h-screen bg-gray-900 text-gray-100 font-sans p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto">
        <Header />
        <main>
          <div className="text-center mb-12">
            <form onSubmit={initiateTextSearch} className="max-w-2xl mx-auto flex items-center gap-2 mb-4">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Enter a city, address, or landmark..."
                className="flex-grow bg-gray-800 border-2 border-gray-700 rounded-full px-6 py-3 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 transition-all w-full"
                aria-label="Location search"
                disabled={isLoading}
              />
              <button
                type="submit"
                disabled={isLoading}
                className="bg-cyan-600 hover:bg-cyan-500 text-white font-bold p-3.5 rounded-full shadow-lg transform hover:scale-105 transition-all duration-300 ease-in-out disabled:bg-gray-500 disabled:cursor-not-allowed disabled:scale-100 flex-shrink-0"
                aria-label="Search"
              >
                <SearchIcon />
              </button>
            </form>
            <button
              onClick={initiateGeoSearch}
              disabled={isLoading}
              className="inline-flex items-center justify-center bg-transparent border border-gray-600 hover:bg-gray-800 text-gray-300 font-semibold py-2 px-5 rounded-full transition-colors duration-300 ease-in-out disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <LocationIcon />
              Use My Current Location
            </button>
          </div>
           
          {isLoading && (
            <div className="flex flex-col items-center justify-center">
              <Spinner />
              <p className="mt-4 text-lg text-cyan-300">Finding best barbers near you...</p>
            </div>
          )}
            
          {error && <ErrorDisplay message={error} />}

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
                   <p className="text-xl text-gray-400">No barber shops found matching your criteria. Try a different location or rating.</p>
                </div>
              )}
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default App;