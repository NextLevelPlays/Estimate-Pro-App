import React from 'react';
import { Building2, Users, FileText, Settings, DollarSign } from 'lucide-react';

function App() {
  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center h-16">
            <Building2 className="w-8 h-8 text-blue-600" />
            <span className="text-xl font-bold text-gray-900 ml-2">EstimatePro</span>
          </div>
        </div>
      </nav>
      
      <main className="max-w-7xl mx-auto px-4 py-8">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Construction Estimate Management</h1>
          <p className="text-gray-600">Your professional estimate system is working!</p>
        </div>
      </main>
    </div>
  );
}

export default App;
