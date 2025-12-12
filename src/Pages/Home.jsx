import React from 'react';
import BestSeller from '../Components/Home/BestSeller';
import Shops from '../Components/Home/Shops';

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-50">
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-2 py-8">
        <div className="lg:hidden mb-8">
          <BestSeller />
        </div>
        
        <div className="lg:grid lg:grid-cols-[1fr_300px] lg:gap-6">
          <Shops />
          <div className="hidden lg:block sticky top-24 self-start h-fit">
            <BestSeller />
          </div>
        </div>
      </main>
    </div>
  );
}