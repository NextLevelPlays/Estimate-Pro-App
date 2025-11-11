import React, { useState, useEffect } from 'react';
import {
  Building2, Users, FileText, Settings, HelpCircle, LogOut,
  Plus, Download, Mail, Edit, Trash2, User, MapPin, DollarSign,
  Upload, Save, Home
} from 'lucide-react';

export default function App() {
  const [currentPage, setCurrentPage] = useState('dashboard');
  const [jobs, setJobs] = useState([
    {
      id: 1,
      title: 'Kitchen Remodel Estimate',
      client_id: 1,
      client_name: 'John Smith',
      job_type: 'Kitchen',
      status: 'estimate_sent',
      location: '123 Main St',
      estimate_total: 12744,
      materials: [],
      labor: [],
      notes: ''
    }
  ]);
  const [clients, setClients] = useState([
    {
      id: 1,
      name: 'John Smith',
      email: 'john@example.com',
      phone: '(555) 123-4567',
      company: '',
      address: '123 Main St'
    }
  ]);
  const [userSettings] = useState({
    company_name: 'Blackston Handyman Services',
    business_phone: '(303) 880-4557',
    owner_name: 'Brandon Blackston',
    default_tax_rate: 0,
    custom_job_types: ['Kitchen', 'Bathroom', 'Handyman', 'General Repair']
  });
  const [showNewEstimateForm, setShowNewEstimateForm] = useState(false);
  const [showNewClientForm, setShowNewClientForm] = useState(false);
  const [newClient, setNewClient] = useState({
    name: '',
    email: '',
    phone: '',
    company: '',
    address: ''
  });
  const [newEstimate, setNewEstimate] = useState({
    title: '',
    client_id: '',
    job_type: '',
    materials: [],
    labor: [],
    notes: ''
  });

  const addClient = () => {
    if (newClient.name && newClient.email) {
      setClients([...clients, {
        id: Date.now(),
        ...newClient
      }]);
      setNewClient({ name: '', email: '', phone: '', company: '', address: '' });
      setShowNewClientForm(false);
    }
  };

  const saveEstimate = () => {
    if (newEstimate.title && newEstimate.client_id) {
      const selectedClient = clients.find(c => c.id === parseInt(newEstimate.client_id));
      setJobs([...jobs, {
        id: Date.now(),
        ...newEstimate,
        client_id: parseInt(newEstimate.client_id),
        client_name: selectedClient.name,
        status: 'pending',
        location: selectedClient.address,
        estimate_total: 0
      }]);
      setNewEstimate({ title: '', client_id: '', job_type: '', materials: [], labor: [], notes: '' });
      setShowNewEstimateForm(false);
    }
  };

  const generatePDF = (job) => {
    alert(`PDF generation for "${job.title}" - Integration with backend needed`);
  };

  const sendEmail = (email, job) => {
    alert(`Email sent to ${email} with estimate for "${job.title}"`);
  };

  const Navigation = () => (
    <nav className="bg-gradient-to-r from-red-700 to-red-800 text-white shadow-lg">
      <div className="max-w-7xl mx-auto px-4 py-4">
        <div className="flex justify-between items-center">
          <div className="flex items-center space-x-3">
            <div className="bg-white rounded p-2">
              <Building2 className="w-6 h-6 text-red-700" />
            </div>
            <div>
              <h1 className="text-2xl font-bold">Blackston Handyman Services</h1>
              <p className="text-red-100 text-sm">Quality Work. Honest Price.</p>
            </div>
          </div>
          <div className="text-right">
            <p className="font-semibold">Brandon Blackston</p>
            <p className="text-red-100">(303) 880-4557</p>
          </div>
        </div>
        <div className="mt-4 flex space-x-1 border-t border-red-600 pt-3">
          <button
            onClick={() => setCurrentPage('dashboard')}
            className={`px-4 py-2 rounded font-medium transition ${
              currentPage === 'dashboard'
                ? 'bg-red-900 text-white'
                : 'text-red-100 hover:bg-red-700'
            }`}
          >
            <Home className="w-4 h-4 inline mr-2" />
            Dashboard
          </button>
          <button
            onClick={() => setCurrentPage('estimates')}
            className={`px-4 py-2 rounded font-medium transition ${
              currentPage === 'estimates'
                ? 'bg-red-900 text-white'
                : 'text-red-100 hover:bg-red-700'
            }`}
          >
            <FileText className="w-4 h-4 inline mr-2" />
            Estimates
          </button>
          <button
            onClick={() => setCurrentPage('jobs')}
            className={`px-4 py-2 rounded font-medium transition ${
              currentPage === 'jobs'
                ? 'bg-red-900 text-white'
                : 'text-red-100 hover:bg-red-700'
            }`}
          >
            <FileText className="w-4 h-4 inline mr-2" />
            Jobs
          </button>
          <button
            onClick={() => setCurrentPage('clients')}
            className={`px-4 py-2 rounded font-medium transition ${
              currentPage === 'clients'
                ? 'bg-red-900 text-white'
                : 'text-red-100 hover:bg-red-700'
            }`}
          >
            <Users className="w-4 h-4 inline mr-2" />
            Clients
          </button>
          <button
            onClick={() => setCurrentPage('settings')}
            className={`px-4 py-2 rounded font-medium transition ${
              currentPage === 'settings'
                ? 'bg-red-900 text-white'
                : 'text-red-100 hover:bg-red-700'
            }`}
          >
            <Settings className="w-4 h-4 inline mr-2" />
            Settings
          </button>
          <button
            onClick={() => setCurrentPage('guide')}
            className={`px-4 py-2 rounded font-medium transition ${
              currentPage === 'guide'
                ? 'bg-red-900 text-white'
                : 'text-red-100 hover:bg-red-700'
            }`}
          >
            <HelpCircle className="w-4 h-4 inline mr-2" />
            Guide
          </button>
        </div>
      </div>
    </nav>
  );

  const Dashboard = () => (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-lg shadow p-6 border-l-4 border-l-red-600">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm">Total Estimates</p>
              <p className="text-3xl font-bold text-gray-900">{jobs.length}</p>
            </div>
            <FileText className="w-8 h-8 text-red-200" />
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow p-6 border-l-4 border-l-green-600">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm">Approved Estimates</p>
              <p className="text-3xl font-bold text-gray-900">{jobs.filter(j => j.status === 'approved').length}</p>
            </div>
            <FileText className="w-8 h-8 text-green-200" />
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow p-6 border-l-4 border-l-blue-600">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm">Active Jobs</p>
              <p className="text-3xl font-bold text-gray-900">{jobs.filter(j => j.status === 'in_progress').length}</p>
            </div>
            <FileText className="w-8 h-8 text-blue-200" />
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow p-6 border-l-4 border-l-purple-600">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm">Total Clients</p>
              <p className="text-3xl font-bold text-gray-900">{clients.length}</p>
            </div>
            <Users className="w-8 h-8 text-purple-200" />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-bold text-gray-900 mb-4">Recent Estimates</h2>
          <div className="space-y-3">
            {jobs.slice(-3).reverse().map(job => (
              <div key={job.id} className="border-b pb-3 last:border-b-0">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="font-semibold text-gray-900">{job.title}</p>
                    <p className="text-sm text-gray-500">{job.client_name}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-red-600">${job.estimate_total.toLocaleString()}</p>
                    <span className="text-xs bg-yellow-100 text-yellow-800 px-2 py-1 rounded">
                      {job.status.replace('_', ' ')}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-bold text-gray-900 mb-4">Active Jobs</h2>
          <div className="space-y-3">
            {jobs.filter(j => j.status === 'in_progress').slice(0, 3).map(job => (
              <div key={job.id} className="border-b pb-3 last:border-b-0">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="font-semibold text-gray-900">{job.title}</p>
                    <p className="text-sm text-gray-500">{job.client_name}</p>
                  </div>
                  <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
                    in progress
                  </span>
                </div>
              </div>
            ))}
            {jobs.filter(j => j.status === 'in_progress').length === 0 && (
              <p className="text-gray-500 text-sm">No active jobs</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );

  const Estimates = () => {
    if (showNewEstimateForm) {
      return (
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold text-gray-900">New Estimate</h1>
          </div>
          <div className="bg-white rounded-lg shadow-sm border p-6">
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Job Title</label>
                <input
                  type="text"
                  value={newEstimate.title}
                  onChange={(e) => setNewEstimate({...newEstimate, title: e.target.value})}
                  className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-red-500"
                  placeholder="e.g., Kitchen Remodel"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Client</label>
                <select
                  value={newEstimate.client_id}
                  onChange={(e) => setNewEstimate({...newEstimate, client_id: e.target.value})}
                  className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-red-500"
                >
                  <option value="">Select a client</option>
                  {clients.map(client => (
                    <option key={client.id} value={client.id}>{client.name}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Service Type</label>
                <select
                  value={newEstimate.job_type}
                  onChange={(e) => setNewEstimate({...newEstimate, job_type: e.target.value})}
                  className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-red-500"
                >
                  <option value="">Select service type</option>
                  {userSettings.custom_job_types.map(type => (
                    <option key={type} value={type}>{type}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Notes</label>
                <textarea
                  value={newEstimate.notes}
                  onChange={(e) => setNewEstimate({...newEstimate, notes: e.target.value})}
                  className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-red-500"
                  rows="4"
                  placeholder="Job details and notes..."
                />
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
                className="px-6 py-2 bg-red-800 hover:bg-red-900 text-white rounded-lg flex items-center space-x-2"
              >
                <Save className="w-4 h-4" />
                <span>Save Estimate</span>
              </button>
            </div>
          </div>
        </div>
      );
    }

    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-900">Estimates</h1>
          <button
            onClick={() => setShowNewEstimateForm(true)}
            className="bg-red-800 hover:bg-red-900 text-white px-4 py-2 rounded-lg flex items-center space-x-2"
          >
            <Plus className="w-4 h-4" />
            <span>New Estimate</span>
          </button>
        </div>

        <div className="bg-white rounded-lg shadow-sm border">
          <div className="p-6 border-b bg-gradient-to-r from-red-50 to-red-100">
            <h2 className="text-lg font-semibold text-gray-900">All Estimates</h2>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="text-left py-3 px-6 font-medium text-gray-700">Job Title</th>
                  <th className="text-left py-3 px-6 font-medium text-gray-700">Client</th>
                  <th className="text-left py-3 px-6 font-medium text-gray-700">Type</th>
                  <th className="text-left py-3 px-6 font-medium text-gray-700">Status</th>
                  <th className="text-right py-3 px-6 font-medium text-gray-700">Value</th>
                  <th className="text-center py-3 px-6 font-medium text-gray-700">Actions</th>
                </tr>
              </thead>
              <tbody>
                {jobs.map((job) => (
                  <tr key={job.id} className="border-b hover:bg-gray-50">
                    <td className="py-3 px-6 font-medium">{job.title}</td>
                    <td className="py-3 px-6">{job.client_name}</td>
                    <td className="py-3 px-6">{job.job_type}</td>
                    <td className="py-3 px-6">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        job.status === 'completed' ? 'bg-green-100 text-green-800' :
                        job.status === 'in_progress' ? 'bg-blue-100 text-blue-800' :
                        job.status === 'estimate_sent' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-gray-100 text-gray-800'
                      }`}>
                        {job.status.replace('_', ' ')}
                      </span>
                    </td>
                    <td className="py-3 px-6 text-right font-semibold">${job.estimate_total.toLocaleString()}</td>
                    <td className="py-3 px-6">
                      <div className="flex justify-center space-x-2">
                        <button
                          onClick={() => generatePDF(job)}
                          className="text-red-800 hover:text-red-900"
                          title="Generate PDF"
                        >
                          <Download className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => sendEmail(clients.find(c => c.id === job.client_id)?.email, job)}
                          className="text-green-600 hover:text-green-800"
                          title="Send Email"
                        >
                          <Mail className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    );
  };

  const Jobs = () => (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-900">Jobs</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {jobs.map((job) => (
          <div key={job.id} className="bg-white rounded-lg shadow-sm border border-l-4 border-l-red-800 p-6">
            <div className="flex justify-between items-start mb-4">
              <h3 className="text-lg font-semibold text-gray-900">{job.title}</h3>
              <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                job.status === 'completed' ? 'bg-green-100 text-green-800' :
                job.status === 'in_progress' ? 'bg-blue-100 text-blue-800' :
                job.status === 'estimate_sent' ? 'bg-yellow-100 text-yellow-800' :
                'bg-gray-100 text-gray-800'
              }`}>
                {job.status.replace('_', ' ')}
              </span>
            </div>
            
            <div className="space-y-2 text-sm">
              <div className="flex items-center space-x-2">
                <User className="w-4 h-4 text-gray-400" />
                <span>{job.client_name}</span>
              </div>
              <div className="flex items-center space-x-2">
                <MapPin className="w-4 h-4 text-gray-400" />
                <span>{job.location}</span>
              </div>
              <div className="flex items-center space-x-2">
                <DollarSign className="w-4 h-4 text-gray-400" />
                <span className="font-semibold text-red-800">${job.estimate_total.toLocaleString()}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const Clients = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">Clients</h1>
        <button
          onClick={() => setShowNewClientForm(true)}
          className="bg-red-800 hover:bg-red-900 text-white px-4 py-2 rounded-lg flex items-center space-x-2"
        >
          <Plus className="w-4 h-4" />
          <span>Add Client</span>
        </button>
      </div>

      {showNewClientForm && (
        <div className="bg-white rounded-lg shadow-sm border p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Add New Client</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input
              type="text"
              placeholder="Full Name"
              value={newClient.name}
              onChange={(e) => setNewClient(prev => ({ ...prev, name: e.target.value }))}
              className="border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-red-500"
            />
            <input
              type="email"
              placeholder="Email Address"
              value={newClient.email}
              onChange={(e) => setNewClient(prev => ({ ...prev, email: e.target.value }))}
              className="border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-red-500"
            />
            <input
              type="tel"
              placeholder="Phone Number"
              value={newClient.phone}
              onChange={(e) => setNewClient(prev => ({ ...prev, phone: e.target.value }))}
              className="border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-red-500"
            />
            <input
              type="text"
              placeholder="Company (optional)"
              value={newClient.company}
              onChange={(e) => setNewClient(prev => ({ ...prev, company: e.target.value }))}
              className="border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-red-500"
            />
            <input
              type="text"
              placeholder="Address"
              value={newClient.address}
              onChange={(e) => setNewClient(prev => ({ ...prev, address: e.target.value }))}
              className="md:col-span-2 border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-red-500"
            />
          </div>
          <div className="flex justify-end space-x-4 mt-4">
            <button
              onClick={() => setShowNewClientForm(false)}
              className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              onClick={addClient}
              className="px-4 py-2 bg-red-800 hover:bg-red-900 text-white rounded-lg"
            >
              Add Client
            </button>
          </div>
        </div>
      )}

      <div className="bg-white rounded-lg shadow-sm border">
        <div className="p-6 border-b bg-gradient-to-r from-red-50 to-red-100">
          <h2 className="text-lg font-semibold text-gray-900">Client Directory</h2>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="text-left py-3 px-6 font-medium text-gray-700">Name</th>
                <th className="text-left py-3 px-6 font-medium text-gray-700">Email</th>
                <th className="text-left py-3 px-6 font-medium text-gray-700">Phone</th>
                <th className="text-left py-3 px-6 font-medium text-gray-700">Company</th>
              </tr>
            </thead>
            <tbody>
              {clients.map((client) => (
                <tr key={client.id} className="border-b hover:bg-gray-50">
                  <td className="py-3 px-6 font-medium">{client.name}</td>
                  <td className="py-3 px-6">{client.email}</td>
                  <td className="py-3 px-6">{client.phone}</td>
                  <td className="py-3 px-6">{client.company}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );

  const Settings = () => (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-900">Settings</h1>
      <div className="bg-white rounded-lg shadow-sm border p-6 border-l-4 border-l-red-800">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Company Information</h2>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Company Name</label>
            <input type="text" value={userSettings.company_name} className="w-full border rounded-lg px-3 py-2 bg-gray-50" readOnly />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
            <input type="text" value={userSettings.business_phone} className="w-full border rounded-lg px-3 py-2 bg-gray-50" readOnly />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Owner</label>
            <input type="text" value={userSettings.owner_name} className="w-full border rounded-lg px-3 py-2 bg-gray-50" readOnly />
          </div>
        </div>
      </div>
    </div>
  );

  const Guide = () => (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-900">User Guide</h1>
      <div className="bg-white rounded-lg shadow-sm border p-6 border-l-4 border-l-red-800">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Welcome to Blackston EstimatePro</h2>
        <div className="space-y-4">
          <h3 className="font-semibold">Quick Start:</h3>
          <ol className="list-decimal list-inside space-y-2 text-gray-700">
            <li>Click "New Estimate" to create professional estimates</li>
            <li>Add your clients in the Clients section</li>
            <li>Generate PDFs with your Blackston branding</li>
            <li>Send estimates directly to clients via email</li>
          </ol>
          <div className="mt-6 bg-red-50 p-4 rounded border-l-4 border-red-800">
            <h4 className="font-semibold text-red-800">System Features:</h4>
            <ul className="text-sm text-red-700 mt-2">
              <li>• Professional estimate generation</li>
              <li>• Client management system</li>
              <li>• Job tracking and status updates</li>
              <li>• Email integration for client communication</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );

  const renderCurrentPage = () => {
    switch (currentPage) {
      case 'dashboard': return <Dashboard />;
      case 'estimates': return <Estimates />;
      case 'jobs': return <Jobs />;
      case 'clients': return <Clients />;
      case 'settings': return <Settings />;
      case 'guide': return <Guide />;
      default: return <Dashboard />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      <main className="max-w-7xl mx-auto px-4 py-8">
        {renderCurrentPage()}
      </main>
    </div>
  );
}