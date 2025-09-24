import React, { useState } from 'react';
import {
  Building2, Users, FileText, Settings, BookOpen, Plus,
  Mail, Download, Eye, DollarSign, CheckCircle, Briefcase,
  Save, Star, Activity, MapPin, User, Hammer
} from 'lucide-react';

function App() {
  const [currentPage, setCurrentPage] = useState('dashboard');
  
  // Company branding info
  const companyInfo = {
    name: 'Blackston Handyman Services',
    tagline: 'Quality Work. Honest Price.',
    owner: 'Brandon Blackston',
    phone: '(303) 880-4557',
    email: 'brandon@blackstonhandyman.com',
    primaryColor: '#B85450', // Rust/burnt orange
    secondaryColor: '#2D3748', // Dark slate
  };
  
  const [clients, setClients] = useState([
    {
      id: 1,
      name: 'John Smith',
      email: 'john@smithhome.com',
      phone: '(555) 123-4567',
      address: '123 Main St, Denver, CO 80202',
      company: 'Smith Residence'
    }
  ]);

  const [estimates, setEstimates] = useState([
    {
      id: 1,
      clientId: 1,
      title: 'Kitchen Remodel Estimate',
      description: 'Complete kitchen renovation',
      materials: [
        { description: 'Custom Kitchen Cabinets', quantity: 1, rate: 8500.00, amount: 8500.00 }
      ],
      labor: [
        { description: 'Cabinet Installation', hours: 40, rate: 75.00, amount: 3000.00 }
      ],
      additionalServices: [
        { description: 'Debris Removal', quantity: 1, rate: 300.00, amount: 300.00 }
      ],
      subtotal: 11800.00,
      tax: 944.00,
      total: 12744.00,
      status: 'pending',
      createdAt: '2024-01-15',
      validUntil: '2024-02-15'
    }
  ]);

  const [jobs, setJobs] = useState([
    {
      id: 1,
      estimateId: 1,
      clientId: 1,
      title: 'Kitchen Remodel',
      status: 'in-progress',
      startDate: '2024-01-20',
      estimatedCompletion: '2024-03-15',
      actualHours: 120,
      estimatedHours: 200,
      notes: 'Project progressing well.'
    }
  ]);

  const getClientName = (clientId) => {
    const client = clients.find(c => c.id === clientId);
    return client ? client.name : 'Unknown Client';
  };

  const renderDashboard = () => {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
            <p className="text-gray-600 mt-1">{companyInfo.tagline}</p>
          </div>
          <div className="flex space-x-4">
            <button
              className="hover:bg-opacity-90 text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors"
              style={{ backgroundColor: companyInfo.primaryColor }}
            >
              <Plus className="w-4 h-4" />
              <span>New Estimate</span>
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-white p-6 rounded-lg shadow">
            <div className="flex items-center">
              <div className="p-2 rounded-lg" style={{ backgroundColor: `${companyInfo.primaryColor}20` }}>
                <FileText className="w-6 h-6" style={{ color: companyInfo.primaryColor }} />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Estimates</p>
                <p className="text-2xl font-semibold" style={{ color: companyInfo.secondaryColor }}>
                  {estimates.length}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow">
            <div className="flex items-center">
              <div className="p-2 bg-green-100 rounded-lg">
                <CheckCircle className="w-6 h-6 text-green-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Approved Estimates</p>
                <p className="text-2xl font-semibold" style={{ color: companyInfo.secondaryColor }}>
                  {estimates.filter(e => e.status === 'approved').length}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow">
            <div className="flex items-center">
              <div className="p-2 bg-yellow-100 rounded-lg">
                <Briefcase className="w-6 h-6 text-yellow-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Active Jobs</p>
                <p className="text-2xl font-semibold" style={{ color: companyInfo.secondaryColor }}>
                  {jobs.length}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow">
            <div className="flex items-center">
              <div className="p-2 bg-purple-100 rounded-lg">
                <Users className="w-6 h-6 text-purple-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Clients</p>
                <p className="text-2xl font-semibold" style={{ color: companyInfo.secondaryColor }}>
                  {clients.length}
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-xl font-semibold mb-4" style={{ color: companyInfo.secondaryColor }}>
              Recent Estimates
            </h2>
            <div className="space-y-4">
              {estimates.slice(0, 3).map(estimate => (
                <div key={estimate.id} className="flex justify-between items-center p-3 border rounded">
                  <div>
                    <p className="font-medium">{estimate.title}</p>
                    <p className="text-sm text-gray-600">{getClientName(estimate.clientId)}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold" style={{ color: companyInfo.primaryColor }}>
                      ${estimate.total.toFixed(2)}
                    </p>
                    <span className={`px-2 py-1 text-xs rounded-full ${
                      estimate.status === 'approved' ? 'bg-green-100 text-green-800' :
                      estimate.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-gray-100 text-gray-800'
                    }`}>
                      {estimate.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-xl font-semibold mb-4" style={{ color: companyInfo.secondaryColor }}>
              Active Jobs
            </h2>
            <div className="space-y-4">
              {jobs.map(job => (
                <div key={job.id} className="flex justify-between items-center p-3 border rounded">
                  <div>
                    <p className="font-medium">{job.title}</p>
                    <p className="text-sm text-gray-600">{getClientName(job.clientId)}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm">{job.actualHours}/{job.estimatedHours} hrs</p>
                    <span className={`px-2 py-1 text-xs rounded-full ${
                      job.status === 'completed' ? 'bg-green-100 text-green-800' :
                      job.status === 'in-progress' ? 'bg-blue-100 text-blue-800' :
                      'bg-gray-100 text-gray-800'
                    }`}>
                      {job.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  };

  const renderEstimates = () => {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold" style={{ color: companyInfo.secondaryColor }}>Estimates</h1>
        </div>

        <div className="bg-white shadow overflow-hidden sm:rounded-md">
          <ul className="divide-y divide-gray-200">
            {estimates.map(estimate => (
              <li key={estimate.id}>
                <div className="px-4 py-4 sm:px-6">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <p className="text-lg font-medium" style={{ color: companyInfo.secondaryColor }}>
                        {estimate.title}
                      </p>
                      <p className="text-sm text-gray-600">{getClientName(estimate.clientId)}</p>
                      <p className="text-sm text-gray-500 mt-1">{estimate.description}</p>
                    </div>
                    <div className="flex items-center space-x-4">
                      <div className="text-right">
                        <p className="text-lg font-semibold" style={{ color: companyInfo.primaryColor }}>
                          ${estimate.total.toFixed(2)}
                        </p>
                        <p className="text-sm text-gray-500">Created: {estimate.createdAt}</p>
                        <p className="text-sm text-gray-500">Valid until: {estimate.validUntil}</p>
                      </div>
                      <span className={`px-2 py-1 text-xs rounded-full ${
                        estimate.status === 'approved' ? 'bg-green-100 text-green-800' :
                        estimate.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-gray-100 text-gray-800'
                      }`}>
                        {estimate.status}
                      </span>
                    </div>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    );
  };

  const renderJobs = () => {
    return (
      <div className="space-y-6">
        <h1 className="text-3xl font-bold" style={{ color: companyInfo.secondaryColor }}>Jobs</h1>
        <div className="bg-white shadow overflow-hidden sm:rounded-md">
          <ul className="divide-y divide-gray-200">
            {jobs.map(job => (
              <li key={job.id}>
                <div className="px-4 py-4 sm:px-6">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <p className="text-lg font-medium" style={{ color: companyInfo.secondaryColor }}>
                        {job.title}
                      </p>
                      <p className="text-sm text-gray-600">{getClientName(job.clientId)}</p>
                      <p className="text-sm text-gray-500 mt-1">
                        Start: {job.startDate} | Est. Completion: {job.estimatedCompletion}
                      </p>
                      {job.notes && (
                        <p className="text-sm text-gray-500 mt-1">Notes: {job.notes}</p>
                      )}
                    </div>
                    <div className="flex items-center space-x-4">
                      <div className="text-right">
                        <p className="text-sm text-gray-600">
                          Hours: {job.actualHours} / {job.estimatedHours}
                        </p>
                        <div className="w-24 bg-gray-200 rounded-full h-2 mt-1">
                          <div
                            className="h-2 rounded-full"
                            style={{ 
                              backgroundColor: companyInfo.primaryColor,
                              width: `${(job.actualHours / job.estimatedHours) * 100}%` 
                            }}
                          ></div>
                        </div>
                      </div>
                      <span className={`px-2 py-1 text-xs rounded-full ${
                        job.status === 'completed' ? 'bg-green-100 text-green-800' :
                        job.status === 'in-progress' ? 'bg-blue-100 text-blue-800' :
                        'bg-gray-100 text-gray-800'
                      }`}>
                        {job.status}
                      </span>
                    </div>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    );
  };

  const renderClients = () => {
    return (
      <div className="space-y-6">
        <h1 className="text-3xl font-bold" style={{ color: companyInfo.secondaryColor }}>Clients</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {clients.map(client => (
            <div key={client.id} className="bg-white p-6 rounded-lg shadow">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <h3 className="text-lg font-semibold" style={{ color: companyInfo.secondaryColor }}>
                    {client.name}
                  </h3>
                  <p className="text-sm text-gray-600">{client.company}</p>
                  <div className="mt-4 space-y-2">
                    <div className="flex items-center text-sm text-gray-600">
                      <Mail className="w-4 h-4 mr-2" />
                      {client.email}
                    </div>
                    <div className="flex items-center text-sm text-gray-600">
                      <span className="w-4 h-4 mr-2">📞</span>
                      {client.phone}
                    </div>
                    <div className="flex items-start text-sm text-gray-600">
                      <MapPin className="w-4 h-4 mr-2 mt-0.5" />
                      <span>{client.address}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  const renderSettings = () => {
    return (
      <div className="space-y-6">
        <h1 className="text-3xl font-bold" style={{ color: companyInfo.secondaryColor }}>Settings</h1>
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4" style={{ color: companyInfo.secondaryColor }}>
            Company Profile
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-lg font-medium mb-3" style={{ color: companyInfo.primaryColor }}>
                Business Information
              </h3>
              <div className="space-y-3">
                <div>
                  <p className="text-sm font-medium text-gray-700">Company Name</p>
                  <p className="text-gray-900">{companyInfo.name}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-700">Tagline</p>
                  <p className="text-gray-900">{companyInfo.tagline}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-700">Owner</p>
                  <p className="text-gray-900">{companyInfo.owner}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-700">Phone</p>
                  <p className="text-gray-900">{companyInfo.phone}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const renderGuide = () => {
    return (
      <div className="space-y-6">
        <h1 className="text-3xl font-bold" style={{ color: companyInfo.secondaryColor }}>User Guide</h1>
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4" style={{ color: companyInfo.secondaryColor }}>
            How to Use {companyInfo.name} Estimate Pro
          </h2>
          <div className="prose max-w-none">
            <h3 style={{ color: companyInfo.primaryColor }}>Getting Started</h3>
            <p>Welcome to your professional estimate management system!</p>
            <ol>
              <li>View your dashboard for an overview of estimates, jobs, and clients</li>
              <li>Navigate between different sections using the top menu</li>
              <li>Track your business performance with key metrics</li>
            </ol>
          </div>
        </div>
      </div>
    );
  };

  const renderCurrentPage = () => {
    switch (currentPage) {
      case 'dashboard': 
        return renderDashboard();
      case 'estimates': 
        return renderEstimates();
      case 'jobs': 
        return renderJobs();
      case 'clients': 
        return renderClients();
      case 'settings': 
        return renderSettings();
      case 'guide': 
        return renderGuide();
      default: 
        return renderDashboard();
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="shadow-sm border-b" style={{ backgroundColor: companyInfo.secondaryColor }}>
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-8">
              <div className="flex items-center space-x-2">
                <Hammer className="w-8 h-8" style={{ color: companyInfo.primaryColor }} />
                <div>
                  <span className="text-xl font-bold text-white">{companyInfo.name}</span>
                  <p className="text-xs text-gray-300">{companyInfo.tagline}</p>
                </div>
              </div>
              
              <div className="flex space-x-4">
                {[
                  { key: 'dashboard', label: 'Dashboard' },
                  { key: 'estimates', label: 'Estimates' },
                  { key: 'jobs', label: 'Jobs' },
                  { key: 'clients', label: 'Clients' },
                  { key: 'settings', label: 'Settings' },
                  { key: 'guide', label: 'Guide' }
                ].map(({ key, label }) => (
                  <button
                    key={key}
                    onClick={() => setCurrentPage(key)}
                    className={`px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                      currentPage === key
                        ? 'text-white'
                        : 'text-gray-300 hover:text-white'
                    }`}
                    style={currentPage === key ? { backgroundColor: companyInfo.primaryColor } : {}}
                  >
                    {label}
                  </button>
                ))}
              </div>
            </div>
            
            <div className="text-right">
              <p className="text-white text-sm font-medium">{companyInfo.owner}</p>
              <p className="text-gray-300 text-xs">{companyInfo.phone}</p>
            </div>
          </div>
        </div>
      </nav>
      
      <main className="max-w-7xl mx-auto px-4 py-8">
        {renderCurrentPage()}
      </main>
    </div>
  );
}

export default App;
