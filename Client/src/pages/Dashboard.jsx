import React from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from '../components/Navbar';

const Dashboard = () => {
  return (
    <div className="flex h-screen bg-gray-100">
      <div className="flex-shrink-0">
       
      </div>

      <div className="flex flex-col flex-1 overflow-hidden">
        <div className="flex-shrink-0">
          <Navbar />
        </div>
        
        <main className="flex-1 overflow-y-auto p-6 bg-gray-50">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default Dashboard;