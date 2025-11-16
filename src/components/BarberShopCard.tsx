
import React from 'react';
import { BarberShop } from '../types';

interface BarberShopCardProps {
  shop: BarberShop;
}

const MapPinIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-cyan-400" viewBox="0 0 20 20" fill="currentColor">
        <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
    </svg>
);

const ExternalLinkIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
    </svg>
);

const BarberShopCard: React.FC<BarberShopCardProps> = ({ shop }) => {
  return (
    <div className="bg-gray-800 border border-gray-700 rounded-lg shadow-lg p-6 transform hover:scale-105 transition-transform duration-300 ease-in-out flex flex-col justify-between">
      <div>
        <div className="flex items-center mb-3">
          <MapPinIcon />
          <h3 className="text-xl font-bold text-white truncate">{shop.title}</h3>
        </div>
        <p className="text-gray-400 text-sm mb-4">
          Click below for ratings, reviews, and directions on Google Maps.
        </p>
      </div>
      <a
        href={shop.uri}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center justify-center mt-auto px-4 py-2 bg-cyan-600 hover:bg-cyan-500 text-white font-semibold rounded-md transition-colors duration-300 text-sm"
      >
        View on Map
        <ExternalLinkIcon />
      </a>
    </div>
  );
};

export default BarberShopCard;