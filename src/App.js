import React, { useState } from 'react';
import { Building2, Users, FileText, Settings, Plus, Activity, DollarSign, CheckCircle, Briefcase } from 'lucide-react';

function App() {
  const [currentPage, setCurrentPage] = useState('dashboard');

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow-sm border-b-4 border-orange-800">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-orange-800 rounded-lg flex items-center justify-center">
              <Building2 className="w-6 h-6 text-white" />
            </div>
            <div>
              <div className="text-xl font-bold">Blackston</div>
              <div className="text-xs text-orange-800">HANDYMAN SERVICES</div>
            </div>
          </div>
          <div className="text-sm text-gray-600">Quality Work. Honest Price.</div>
        </div>
      </nav>
      
      <main className="max-w-7xl mx-auto px-4 py-8">
        <div className="space-y-6">
          <h1 className="text-3xl font-bold text-gray-900">Welcome to EstimatePro</h1>
          <p className="text-lg text-gray-600">Your professional estimate management system is ready!</p>
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="bg-white p-6 rounded-lg shadow border-l-4 border-orange-800">
              <Briefcase className="w-8 h-8 text-orange-800 mb-2" />
              <h3 className="font-semibold">Estimates</h3>
              <p className="text-2xl font-bold">Ready</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow border-l-4 border-green-600">
              <Activity className="w-8 h-8 text-green-600 mb-2" />
              <h3 className="font-semibold">Jobs</h3>
              <p className="text-2xl font-bold">Active</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow border-l-4 border-blue-600">
              <DollarSign className="w-8 h-8 text-blue-600 mb-2" />
              <h3 className="font-semibold">Revenue</h3>
              <p className="text-2xl font-bold">Growing</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow border-l-4 border-purple-600">
              <CheckCircle className="w-8 h-8 text-purple-600 mb-2" />
              <h3 className="font-semibold">System</h3>
              <p className="text-2xl font-bold">Online</p>
            </div>
          </div>
          
          <div className="bg-orange-50 border-l-4 border-orange-800 p-6 rounded">
            <h2 className="text-xl font-semibold mb-2">Blackston Handyman Services</h2>
            <p className="text-gray-700">Your professional estimate management system is working perfectly. Contact (303) 880-4557 for support.</p>
          </div>
        </div>
      </main>
    </div>
  );
}

export default App;
