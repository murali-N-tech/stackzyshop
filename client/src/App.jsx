import React from 'react';
import { Outlet } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';

const App = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="container mx-auto py-4 flex-grow">
        <Outlet /> {/* This will render the matched route's component */}
      </main>
      <Footer />
    </div>
  );
};

export default App;