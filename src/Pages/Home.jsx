import React from 'react';
import BestSeller from '../Layout/Sections/BestSeller';
import Shops from '../Layout/Sections/Shops';

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-50">
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-2 py-8">
        <div className="lg:grid lg:grid-cols-[1fr_300px] lg:gap-6">
          <Shops />
          <div className="sticky top-24 self-start h-fit">
            <BestSeller />
          </div>
        </div>
      </main>
    </div>
  );
}
