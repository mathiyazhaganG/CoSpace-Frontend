import React from 'react';
import Spaces from '../components/Spaces';

const Home = () => {
  return (
    <>
      {/* Hero Section */}
      <section className="relative bg-gradient-to-r from-blue-600 to-purple-700 text-white mt-0">
        <div
          className="absolute inset-0 bg-cover bg-center opacity-20 blur-sm"
          style={{ backgroundImage: "url('https://source.unsplash.com/1600x900/?coworking,office')" }}
        ></div>
        <div className="relative z-10 flex flex-col items-center justify-center min-h-[60vh] text-center px-6">
          <h1 className="text-5xl md:text-6xl font-extrabold drop-shadow-lg leading-tight">
            Discover Your Ideal <span className="text-yellow-300">Workspace</span>
          </h1>
          <p className="mt-5 text-lg md:text-xl font-medium text-white/90 drop-shadow-sm max-w-2xl">
            Book beautiful, productive spaces on demand — anytime, anywhere.
          </p>
          <a
            href="#spaces"
            className="mt-8 bg-yellow-400 text-black px-8 py-3 rounded-full font-semibold hover:bg-yellow-500 shadow-md hover:shadow-lg transition-all duration-300"
          >
            Explore Workspaces
          </a>
        </div>
      </section>

      {/* Spaces Section */}
      <section id="spaces" className="py-16 bg-gray-100">
        <div className="text-center mb-10">
          <h2 className="text-4xl font-bold text-gray-800">Available Workspaces</h2>
          <p className="text-gray-600 mt-2 text-base md:text-lg">
            Browse through flexible spaces tailored to your needs.
          </p>
        </div>
        <div className="px-4 md:px-12">
          <Spaces />
        </div>
      </section>
    </>
  );
};

export default Home;
