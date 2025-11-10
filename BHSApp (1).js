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

  const [showNewEstimateForm, setShowNewEstimateForm] = useState(false);
  const [showNewClientForm, setShowNewClientForm] = useState(false);

  const [newEstimate, setNewEstimate] = useState({
    clientId: '',
    title: '',
    description: '',
    materials: [{ description: '', quantity: 1, rate: 0, amount: 0 }],
    labor: [{ description: '', hours: 1, rate: 75.00, amount: 75.00 }],
    additionalServices: [{ description: '', quantity: 1, rate: 0, amount: 0 }],
    validUntil: ''
  });

  const [newClient, setNewClient] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    company: ''
  });

  const calculateEstimateTotal = (materials, labor, additionalServices) => {
    const materialsTotal = materials.reduce((sum, item) => sum + (item.amount || 0), 0);
    const laborTotal = labor.reduce((sum, item) => sum + (item.amount || 0), 0);
    const servicesTotal = additionalServices.reduce((sum, item) => sum + (item.amount || 0), 0);
    const subtotal = materialsTotal + laborTotal + servicesTotal;
    const tax = subtotal * 0.08;
    return {
      materialsTotal,
      laborTotal,
      servicesTotal,
      subtotal,
      tax,
      total: subtotal + tax
    };
  };

  const addEstimateItem = (section) => {
    setNewEstimate(prev => ({
      ...prev,
      [section]: [...prev[section], 
        section === 'labor' 
          ? { description: '', hours: 1, rate: 75.00, amount: 75.00 }
          : { description: '', quantity: 1, rate: 0, amount: 0 }
      ]
    }));
  };

  const updateEstimateItem = (section, index, field, value) => {
    const items = [...newEstimate[section]];
    items[index] = { ...items[index], [field]: value };
    
    if (section === 'labor') {
      if (field === 'hours' || field === 'rate') {
        items[index].amount = items[index].hours * items[index].rate;
      }
    } else {
      if (field === 'quantity' || field === 'rate') {
        items[index].amount = items[index].quantity * items[index].rate;
      }
    }
    
    setNewEstimate(prev => ({ ...prev, [section]: items }));
  };

  const removeEstimateItem = (section, index) => {
    setNewEstimate(prev => ({
      ...prev,
      [section]: prev[section].filter((_, i) => i !== index)
    }));
  };

  const saveEstimate = () => {
    const totals = calculateEstimateTotal(newEstimate.materials, newEstimate.labor, newEstimate.additionalServices);
    const estimate = {
      id: Date.now(),
      ...newEstimate,
      ...totals,
      status: 'pending',
      createdAt: new Date().toISOString().split('T')[0]
    };
    
    setEstimates(prev => [...prev, estimate]);
    setNewEstimate({
      clientId: '',
      title: '',
      description: '',
      materials: [{ description: '', quantity: 1, rate: 0, amount: 0 }],
      labor: [{ description: '', hours: 1, rate: 75.00, amount: 75.00 }],
      additionalServices: [{ description: '', quantity: 1, rate: 0, amount: 0 }],
      validUntil: ''
    });
    setShowNewEstimateForm(false);
  };

  const saveClient = () => {
    const client = {
      id: Date.now(),
      ...newClient
    };
    setClients(prev => [...prev, client]);
    setNewClient({ name: '', email: '', phone: '', address: '', company: '' });
    setShowNewClientForm(false);
  };

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
              onClick={() => setShowNewEstimateForm(true)}
              className="hover:bg-opacity-90 text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors"
              style={{ backgroundColor: companyInfo.primaryColor }}
            >
              <Plus className="w-4 h-4" />
              <span>New Estimate</span>
            </button>
            <button
              onClick={() => setShowNewClientForm(true)}
              className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2"
            >
              <Plus className="w-4 h-4" />
              <span>New Client</span>
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
              <div className="p-2 rounded-lg" style={{ backgroundColor: `${companyInfo.primaryColor}20` }}>
                <CheckCircle className="w-6 h-6" style={{ color: companyInfo.primaryColor }} />
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
              <div className="p-2 rounded-lg" style={{ backgroundColor: `${companyInfo.secondaryColor}20` }}>
                <Briefcase className="w-6 h-6" style={{ color: companyInfo.secondaryColor }} />
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
              <div className="p-2 rounded-lg" style={{ backgroundColor: `${companyInfo.primaryColor}20` }}>
                <Users className="w-6 h-6" style={{ color: companyInfo.primaryColor }} />
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
                      estimate.status === 'pending' ? 'text-white' :
                      'bg-gray-100 text-gray-800'
                    }`}
                    style={estimate.status === 'pending' ? { backgroundColor: companyInfo.primaryColor } : {}}
                    >
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
                      job.status === 'in-progress' ? 'text-white' :
                      'bg-gray-100 text-gray-800'
                    }`}
                    style={job.status === 'in-progress' ? { backgroundColor: companyInfo.secondaryColor } : {}}
                    >
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
              <div className="flex items-center space-x-3">
                {/* Logo placeholder - replace this div with your actual logo image */}
                <div 
                  className="w-12 h-12 rounded-lg flex items-center justify-center text-white font-bold text-lg"
                  style={{ backgroundColor: companyInfo.primaryColor }}
                >
                  BHS
                </div>
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
      
      {/* New Estimate Form */}
      {showNewEstimateForm && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-11/12 max-w-5xl shadow-lg rounded-md bg-white">
            <div className="mt-3">
              <h3 className="text-lg font-medium mb-4" style={{ color: companyInfo.secondaryColor }}>
                New Estimate
              </h3>
              
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Client</label>
                    <select
                      value={newEstimate.clientId}
                      onChange={(e) => setNewEstimate(prev => ({ ...prev, clientId: parseInt(e.target.value) }))}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    >
                      <option value="">Select a client</option>
                      {clients.map(client => (
                        <option key={client.id} value={client.id}>{client.name}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Valid Until</label>
                    <input
                      type="date"
                      value={newEstimate.validUntil}
                      onChange={(e) => setNewEstimate(prev => ({ ...prev, validUntil: e.target.value }))}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">Title</label>
                  <input
                    type="text"
                    value={newEstimate.title}
                    onChange={(e) => setNewEstimate(prev => ({ ...prev, title: e.target.value }))}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">Description</label>
                  <textarea
                    value={newEstimate.description}
                    onChange={(e) => setNewEstimate(prev => ({ ...prev, description: e.target.value }))}
                    rows={3}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  />
                </div>

                {/* Materials Section */}
                <div className="mt-6">
                  <div className="flex justify-between items-center mb-2">
                    <label className="block text-sm font-medium text-gray-700">Materials</label>
                    <button
                      onClick={() => addEstimateItem('materials')}
                      className="text-white px-3 py-1 rounded text-sm hover:bg-opacity-90"
                      style={{ backgroundColor: companyInfo.primaryColor }}
                    >
                      Add Material
                    </button>
                  </div>
                  <div className="space-y-2">
                    {newEstimate.materials.map((item, index) => (
                      <div key={index} className="grid grid-cols-12 gap-2 items-center">
                        <div className="col-span-5">
                          <input
                            type="text"
                            placeholder="Description"
                            value={item.description}
                            onChange={(e) => updateEstimateItem('materials', index, 'description', e.target.value)}
                            className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-sm"
                          />
                        </div>
                        <div className="col-span-2">
                          <input
                            type="number"
                            placeholder="Qty"
                            value={item.quantity}
                            onChange={(e) => updateEstimateItem('materials', index, 'quantity', parseFloat(e.target.value) || 0)}
                            className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-sm"
                          />
                        </div>
                        <div className="col-span-2">
                          <input
                            type="number"
                            placeholder="Price"
                            value={item.rate}
                            onChange={(e) => updateEstimateItem('materials', index, 'rate', parseFloat(e.target.value) || 0)}
                            className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-sm"
                          />
                        </div>
                        <div className="col-span-2">
                          <input
                            type="text"
                            value={`${(item.amount || 0).toFixed(2)}`}
                            readOnly
                            className="w-full rounded-md border-gray-300 bg-gray-50 text-sm"
                          />
                        </div>
                        <div className="col-span-1">
                          <button
                            onClick={() => removeEstimateItem('materials', index)}
                            className="text-red-600 hover:text-red-800 text-sm"
                          >
                            ×
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Labor Section */}
                <div className="mt-6">
                  <div className="flex justify-between items-center mb-2">
                    <label className="block text-sm font-medium text-gray-700">Labor</label>
                    <button
                      onClick={() => addEstimateItem('labor')}
                      className="text-white px-3 py-1 rounded text-sm hover:bg-opacity-90"
                      style={{ backgroundColor: companyInfo.primaryColor }}
                    >
                      Add Labor
                    </button>
                  </div>
                  <div className="space-y-2">
                    {newEstimate.labor.map((item, index) => (
                      <div key={index} className="grid grid-cols-12 gap-2 items-center">
                        <div className="col-span-5">
                          <input
                            type="text"
                            placeholder="Description"
                            value={item.description}
                            onChange={(e) => updateEstimateItem('labor', index, 'description', e.target.value)}
                            className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-sm"
                          />
                        </div>
                        <div className="col-span-2">
                          <input
                            type="number"
                            placeholder="Hours"
                            value={item.hours}
                            onChange={(e) => updateEstimateItem('labor', index, 'hours', parseFloat(e.target.value) || 0)}
                            className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-sm"
                          />
                        </div>
                        <div className="col-span-2">
                          <input
                            type="number"
                            placeholder="Price"
                            value={item.rate}
                            onChange={(e) => updateEstimateItem('labor', index, 'rate', parseFloat(e.target.value) || 0)}
                            className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-sm"
                          />
                        </div>
                        <div className="col-span-2">
                          <input
                            type="text"
                            value={`${(item.amount || 0).toFixed(2)}`}
                            readOnly
                            className="w-full rounded-md border-gray-300 bg-gray-50 text-sm"
                          />
                        </div>
                        <div className="col-span-1">
                          <button
                            onClick={() => removeEstimateItem('labor', index)}
                            className="text-red-600 hover:text-red-800 text-sm"
                          >
                            ×
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Additional Services Section */}
                <div className="mt-6">
                  <div className="flex justify-between items-center mb-2">
                    <label className="block text-sm font-medium text-gray-700">Additional Services</label>
                    <button
                      onClick={() => addEstimateItem('additionalServices')}
                      className="text-white px-3 py-1 rounded text-sm hover:bg-opacity-90"
                      style={{ backgroundColor: companyInfo.primaryColor }}
                    >
                      Add Service
                    </button>
                  </div>
                  <div className="space-y-2">
                    {newEstimate.additionalServices.map((item, index) => (
                      <div key={index} className="grid grid-cols-12 gap-2 items-center">
                        <div className="col-span-5">
                          <input
                            type="text"
                            placeholder="Description (e.g., Debris Removal, Power Washing)"
                            value={item.description}
                            onChange={(e) => updateEstimateItem('additionalServices', index, 'description', e.target.value)}
                            className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-sm"
                          />
                        </div>
                        <div className="col-span-2">
                          <input
                            type="number"
                            placeholder="Qty"
                            value={item.quantity}
                            onChange={(e) => updateEstimateItem('additionalServices', index, 'quantity', parseFloat(e.target.value) || 0)}
                            className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-sm"
                          />
                        </div>
                        <div className="col-span-2">
                          <input
                            type="number"
                            placeholder="Price"
                            value={item.rate}
                            onChange={(e) => updateEstimateItem('additionalServices', index, 'rate', parseFloat(e.target.value) || 0)}
                            className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-sm"
                          />
                        </div>
                        <div className="col-span-2">
                          <input
                            type="text"
                            value={`${(item.amount || 0).toFixed(2)}`}
                            readOnly
                            className="w-full rounded-md border-gray-300 bg-gray-50 text-sm"
                          />
                        </div>
                        <div className="col-span-1">
                          <button
                            onClick={() => removeEstimateItem('additionalServices', index)}
                            className="text-red-600 hover:text-red-800 text-sm"
                          >
                            ×
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Totals */}
                <div className="mt-4 p-4 rounded" style={{ backgroundColor: `${companyInfo.secondaryColor}10` }}>
                  <div className="text-right space-y-2">
                    <div className="flex justify-between">
                      <span>Materials Total:</span>
                      <span>${calculateEstimateTotal(newEstimate.materials, newEstimate.labor, newEstimate.additionalServices).materialsTotal.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Labor Total:</span>
                      <span>${calculateEstimateTotal(newEstimate.materials, newEstimate.labor, newEstimate.additionalServices).laborTotal.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Additional Services:</span>
                      <span>${calculateEstimateTotal(newEstimate.materials, newEstimate.labor, newEstimate.additionalServices).servicesTotal.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Subtotal:</span>
                      <span>${calculateEstimateTotal(newEstimate.materials, newEstimate.labor, newEstimate.additionalServices).subtotal.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Tax (8%):</span>
                      <span>${calculateEstimateTotal(newEstimate.materials, newEstimate.labor, newEstimate.additionalServices).tax.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between font-semibold text-lg border-t pt-2" style={{ color: companyInfo.primaryColor }}>
                      <span>Total:</span>
                      <span>${calculateEstimateTotal(newEstimate.materials, newEstimate.labor, newEstimate.additionalServices).total.toFixed(2)}</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex justify-end space-x-4 mt-6">
                <button
                  onClick={() => setShowNewEstimateForm(false)}
                  className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  onClick={saveEstimate}
                  className="px-6 py-2 text-white rounded-lg flex items-center space-x-2 hover:bg-opacity-90"
                  style={{ backgroundColor: companyInfo.primaryColor }}
                >
                  <Save className="w-4 h-4" />
                  <span>Save Estimate</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* New Client Form */}
      {showNewClientForm && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-11/12 max-w-2xl shadow-lg rounded-md bg-white">
            <div className="mt-3">
              <h3 className="text-lg font-medium mb-4" style={{ color: companyInfo.secondaryColor }}>New Client</h3>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Name</label>
                  <input
                    type="text"
                    value={newClient.name}
                    onChange={(e) => setNewClient(prev => ({ ...prev, name: e.target.value }))}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Company</label>
                  <input
                    type="text"
                    value={newClient.company}
                    onChange={(e) => setNewClient(prev => ({ ...prev, company: e.target.value }))}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Email</label>
                  <input
                    type="email"
                    value={newClient.email}
                    onChange={(e) => setNewClient(prev => ({ ...prev, email: e.target.value }))}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Phone</label>
                  <input
                    type="tel"
                    value={newClient.phone}
                    onChange={(e) => setNewClient(prev => ({ ...prev, phone: e.target.value }))}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Address</label>
                  <textarea
                    value={newClient.address}
                    onChange={(e) => setNewClient(prev => ({ ...prev, address: e.target.value }))}
                    rows={3}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
                  />
                </div>
              </div>

              <div className="flex justify-end space-x-4 mt-6">
                <button
                  onClick={() => setShowNewClientForm(false)}
                  className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  onClick={saveClient}
                  className="px-6 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-lg flex items-center space-x-2"
                >
                  <Save className="w-4 h-4" />
                  <span>Save Client</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
