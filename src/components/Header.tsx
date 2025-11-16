
import React from 'react';

const ScissorIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 md:h-10 md:w-10 mr-3 text-cyan-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
        <path strokeLinecap="round" strokeLinejoin="round" d="M_6_8_L_18_16_M_6_16_L_18_8_M9_9_A_3_3_0_1_0_9_3_A_3_3_0_0_0_9_9_Z_M_9_21_A_3_3_0_1_0_9_15_A_3_3_0_0_0_9_21_Z".replace(/_/g, ' ')} />
    </svg>
);


const Header: React.FC = () => {
  return (
    <header className="py-6 mb-8 text-center">
      <div className="flex items-center justify-center">
        <ScissorIcon />
        <h1 className="text-4xl md:text-5xl font-extrabold text-white tracking-tight">
          Find Your <span className="text-cyan-400">Barber</span>
        </h1>
      </div>
      <p className="mt-4 text-lg text-gray-400 max-w-2xl mx-auto">
        Your personal guide to the best barbershops nearby.
      </p>
    </header>
  );
};

export default Header;