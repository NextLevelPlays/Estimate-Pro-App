import React, { useState } from 'react';
import {
  Building2, Users, FileText, Settings, BookOpen, Plus,
  Mail, Download, Eye, DollarSign, CheckCircle, Briefcase,
  Save, Star, Activity, MapPin, User
} from 'lucide-react';

function App() {
  const [currentPage, setCurrentPage] = useState('dashboard');
  
  const [clients, setClients] = useState([
    {
      id: 1,
      name: 'John Smith',
      email: 'john@smithhome.com',
      phone: '(555) 123-4567',
      address: '123 Main St, Denver, CO 80202',
      company: 'Smith Residence'
    },
    {
      id: 2,
      name: 'Sarah Johnson',
      email: 'sarah@jtech.com',
      phone: '(555) 987-6543',
      address: '456 Oak Ave, Boulder, CO 80301',
      company: 'Johnson Tech Solutions'
    }
  ]);

  const [estimates, setEstimates] = useState([
    {
      id: 1,
      clientId: 1,
      title: 'Kitchen Remodel Estimate',
      description: 'Complete kitchen renovation including cabinets, countertops, and flooring',
      items: [
        { description: 'Custom Kitchen Cabinets', quantity: 1, rate: 8500.00, amount: 8500.00 },
        { description: 'Granite Countertops', quantity: 45, rate: 85.00, amount: 3825.00 },
        { description: 'Hardwood Flooring Installation', quantity: 400, rate: 12.50, amount: 5000.00 }
      ],
      subtotal: 17325.00,
      tax: 1386.00,
      total: 18711.00,
      status: 'pending',
      createdAt: '2024-01-15',
      validUntil: '2024-02-15'
    },
    {
      id: 2,
      clientId: 2,
      title: 'Office Build-out',
      description: 'Commercial office space renovation and build-out',
      items: [
        { description: 'Drywall Installation', quantity: 2000, rate: 3.50, amount: 7000.00 },
        { description: 'Electrical Work', quantity: 1, rate: 4500.00, amount: 4500.00 },
        { description: 'Painting', quantity: 2000, rate: 2.25, amount: 4500.00 }
      ],
      subtotal: 16000.00,
      tax: 1280.00,
      total: 17280.00,
      status: 'approved',
      createdAt: '2024-01-10',
      validUntil: '2024-02-10'
    }
  ]);

  const [jobs, setJobs] = useState([
    {
      id: 1,
      estimateId: 2,
      clientId: 2,
      title: 'Office Build-out',
      status: 'in-progress',
      startDate: '2024-01-20',
      estimatedCompletion: '2024-03-15',
      actualHours: 120,
      estimatedHours: 200,
      notes: 'Project is progressing well, ahead of schedule on electrical work.'
    }
  ]);

  const [showNewEstimateForm, setShowNewEstimateForm] = useState(false);
  const [showNewClientForm, setShowNewClientForm] = useState(false);
  const [editingEstimate, setEditingEstimate] = useState(null);

  const [newEstimate, setNewEstimate] = useState({
    clientId: '',
    title: '',
    description: '',
    items: [{ description: '', quantity: 1, rate: 0, amount: 0 }],
    validUntil: ''
  });

  const [newClient, setNewClient] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    company: ''
  });

  const calculateEstimateTotal = (items) => {
    const subtotal = items.reduce((sum, item) => sum + (item.amount || 0), 0);
    const tax = subtotal * 0.08; // 8% tax rate
    return {
      subtotal,
      tax,
      total: subtotal + tax
    };
  };

  const addEstimateItem = () => {
    setNewEstimate(prev => ({
      ...prev,
      items: [...prev.items, { description: '', quantity: 1, rate: 0, amount: 0 }]
    }));
  };

  const updateEstimateItem = (index, field, value) => {
    const items = [...newEstimate.items];
    items[index] = { ...items[index], [field]: value };
    
    if (field === 'quantity' || field === 'rate') {
      items[index].amount = items[index].quantity * items[index].rate;
    }
    
    setNewEstimate(prev => ({ ...prev, items }));
  };

  const removeEstimateItem = (index) => {
    setNewEstimate(prev => ({
      ...prev,
      items: prev.items.filter((_, i) => i !== index)
    }));
  };

  const saveEstimate = () => {
    const totals = calculateEstimateTotal(newEstimate.items);
    const estimate = {
      id: Date.now(),
      ...newEstimate,
      ...totals,
      status: 'pending',
      createdAt: new Date().toISOString().split('T')[0]
    };
    
    if (editingEstimate) {
      setEstimates(prev => prev.map(est => est.id === editingEstimate.id ? { ...estimate, id: editingEstimate.id } : est));
      setEditingEstimate(null);
    } else {
      setEstimates(prev => [...prev, estimate]);
    }
    
    setNewEstimate({
      clientId: '',
      title: '',
      description: '',
      items: [{ description: '', quantity: 1, rate: 0, amount: 0 }],
      validUntil: ''
    });
    setShowNewEstimateForm(false);
  };

  const editEstimate = (estimate) => {
    setNewEstimate({
      clientId: estimate.clientId,
      title: estimate.title,
      description: estimate.description,
      items: estimate.items,
      validUntil: estimate.validUntil
    });
    setEditingEstimate(estimate);
    setShowNewEstimateForm(true);
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

  const convertToJob = (estimateId) => {
    const estimate = estimates.find(e => e.id === estimateId);
    if (estimate) {
      const job = {
        id: Date.now(),
        estimateId: estimate.id,
        clientId: estimate.clientId,
        title: estimate.title,
        status: 'scheduled',
        startDate: '',
        estimatedCompletion: '',
        actualHours: 0,
        estimatedHours: 0,
        notes: ''
      };
      setJobs(prev => [...prev, job]);
      setEstimates(prev => prev.map(est => est.id === estimateId ? { ...est, status: 'converted' } : est));
    }
  };

  const renderDashboard = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
        <div className="flex space-x-4">
          <button
            onClick={() => setShowNewEstimateForm(true)}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2"
          >
            <Plus className="w-4 h-4" />
            <span>New Estimate</span>
          </button>
          <button
            onClick={() => setShowNewClientForm(true)}
            className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2"
          >
            <Plus className="w-4 h-4" />
            <span>New Client</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center">
            <div className="p-2 bg-blue-100 rounded-lg">
              <FileText className="w-6 h-6 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Estimates</p>
              <p className="text-2xl font-semibold text-gray-900">{estimates.length}</p>
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
              <p className="text-2xl font-semibold text-gray-900">
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
              <p className="text-2xl font-semibold text-gray-900">{jobs.length}</p>
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
              <p className="text-2xl font-semibold text-gray-900">{clients.length}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Recent Estimates</h2>
          <div className="space-y-4">
            {estimates.slice(0, 3).map(estimate => (
              <div key={estimate.id} className="flex justify-between items-center p-3 border rounded">
                <div>
                  <p className="font-medium">{estimate.title}</p>
                  <p className="text-sm text-gray-600">{getClientName(estimate.clientId)}</p>
                </div>
                <div className="text-right">
                  <p className="font-semibold">${estimate.total.toFixed(2)}</p>
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
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Active Jobs</h2>
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

  const renderEstimates = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-900">Estimates</h1>
        <button
          onClick={() => setShowNewEstimateForm(true)}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2"
        >
          <Plus className="w-4 h-4" />
          <span>New Estimate</span>
        </button>
      </div>

      <div className="bg-white shadow overflow-hidden sm:rounded-md">
        <ul className="divide-y divide-gray-200">
          {estimates.map(estimate => (
            <li key={estimate.id}>
              <div className="px-4 py-4 sm:px-6">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <p className="text-lg font-medium text-gray-900">{estimate.title}</p>
                    <p className="text-sm text-gray-600">{getClientName(estimate.clientId)}</p>
                    <p className="text-sm text-gray-500 mt-1">{estimate.description}</p>
                  </div>
                  <div className="flex items-center space-x-4">
                    <div className="text-right">
                      <p className="text-lg font-semibold text-gray-900">${estimate.total.toFixed(2)}</p>
                      <p className="text-sm text-gray-500">Created: {estimate.createdAt}</p>
                      <p className="text-sm text-gray-500">Valid until: {estimate.validUntil}</p>
                    </div>
                    <div className="flex flex-col items-center space-y-2">
                      <span className={`px-2 py-1 text-xs rounded-full ${
                        estimate.status === 'approved' ? 'bg-green-100 text-green-800' :
                        estimate.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                        estimate.status === 'converted' ? 'bg-blue-100 text-blue-800' :
                        'bg-gray-100 text-gray-800'
                      }`}>
                        {estimate.status}
                      </span>
                      <div className="flex space-x-1">
                        <button
                          onClick={() => editEstimate(estimate)}
                          className="p-1 text-blue-600 hover:text-blue-800"
                        >
                          <FileText className="w-4 h-4" />
                        </button>
                        {estimate.status === 'approved' && (
                          <button
                            onClick={() => convertToJob(estimate.id)}
                            className="p-1 text-green-600 hover:text-green-800"
                          >
                            <Briefcase className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );

  const renderJobs = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-900">Jobs</h1>
      </div>

      <div className="bg-white shadow overflow-hidden sm:rounded-md">
        <ul className="divide-y divide-gray-200">
          {jobs.map(job => (
            <li key={job.id}>
              <div className="px-4 py-4 sm:px-6">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <p className="text-lg font-medium text-gray-900">{job.title}</p>
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
                          className="bg-blue-600 h-2 rounded-full"
                          style={{ width: `${(job.actualHours / job.estimatedHours) * 100}%` }}
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

  const renderClients = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-900">Clients</h1>
        <button
          onClick={() => setShowNewClientForm(true)}
          className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2"
        >
          <Plus className="w-4 h-4" />
          <span>New Client</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {clients.map(client => (
          <div key={client.id} className="bg-white p-6 rounded-lg shadow">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-gray-900">{client.name}</h3>
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

  const renderNewEstimateForm = () => (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
      <div className="relative top-20 mx-auto p-5 border w-11/12 max-w-4xl shadow-lg rounded-md bg-white">
        <div className="mt-3">
          <h3 className="text-lg font-medium text-gray-900 mb-4">
            {editingEstimate ? 'Edit Estimate' : 'New Estimate'}
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

            <div>
              <div className="flex justify-between items-center mb-2">
                <label className="block text-sm font-medium text-gray-700">Items</label>
                <button
                  onClick={addEstimateItem}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded text-sm"
                >
                  Add Item
                </button>
              </div>
              
              <div className="space-y-2">
                {newEstimate.items.map((item, index) => (
                  <div key={index} className="grid grid-cols-12 gap-2 items-center">
                    <div className="col-span-5">
                      <input
                        type="text"
                        placeholder="Description"
                        value={item.description}
                        onChange={(e) => updateEstimateItem(index, 'description', e.target.value)}
                        className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-sm"
                      />
                    </div>
                    <div className="col-span-2">
                      <input
                        type="number"
                        placeholder="Qty"
                        value={item.quantity}
                        onChange={(e) => updateEstimateItem(index, 'quantity', parseFloat(e.target.value) || 0)}
                        className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-sm"
                      />
                    </div>
                    <div className="col-span-2">
                      <input
                        type="number"
                        placeholder="Rate"
                        value={item.rate}
                        onChange={(e) => updateEstimateItem(index, 'rate', parseFloat(e.target.value) || 0)}
                        className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-sm"
                      />
                    </div>
                    <div className="col-span-2">
                      <input
                        type="text"
                        value={`$${(item.amount || 0).toFixed(2)}`}
                        readOnly
                        className="w-full rounded-md border-gray-300 bg-gray-50 text-sm"
                      />
                    </div>
                    <div className="col-span-1">
                      <button
                        onClick={() => removeEstimateItem(index)}
                        className="text-red-600 hover:text-red-800 text-sm"
                      >
                        ×
                      </button>
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="mt-4 p-4 bg-gray-50 rounded">
                <div className="text-right space-y-2">
                  <div className="flex justify-between">
                    <span>Subtotal:</span>
                    <span>${calculateEstimateTotal(newEstimate.items).subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Tax (8%):</span>
                    <span>${calculateEstimateTotal(newEstimate.items).tax.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between font-semibold text-lg border-t pt-2">
                    <span>Total:</span>
                    <span>${calculateEstimateTotal(newEstimate.items).total.toFixed(2)}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="flex justify-end space-x-4 mt-6">
            <button
              onClick={() => {
                setShowNewEstimateForm(false);
                setEditingEstimate(null);
                setNewEstimate({
                  clientId: '',
                  title: '',
                  description: '',
                  items: [{ description: '', quantity: 1, rate: 0, amount: 0 }],
                  validUntil: ''
                });
              }}
              className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              onClick={saveEstimate}
              className="px-6 py-2 bg-orange-600 hover:bg-orange-700 text-white rounded-lg flex items-center space-x-2"
            >
              <Save className="w-4 h-4" />
              <span>Save Estimate</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  const renderNewClientForm = () => (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
      <div className="relative top-20 mx-auto p-5 border w-11/12 max-w-2xl shadow-lg rounded-md bg-white">
        <div className="mt-3">
          <h3 className="text-lg font-medium text-gray-900 mb-4">New Client</h3>
          
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
              onClick={() => {
                setShowNewClientForm(false);
                setNewClient({ name: '', email: '', phone: '', address: '', company: '' });
              }}
              className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              onClick={saveClient}
              className="px-6 py-2 bg-orange-600 hover:bg-orange-700 text-white rounded-lg flex items-center space-x-2"
            >
              <Save className="w-4 h-4" />
              <span>Save Client</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  const renderSettings = () => (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-gray-900">Settings</h1>
      <div className="bg-white p-6 rounded-lg shadow">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Application Settings</h2>
        <p className="text-gray-600">Settings panel coming soon...</p>
      </div>
    </div>
  );

  const renderGuide = () => (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-gray-900">User Guide</h1>
      <div className="bg-white p-6 rounded-lg shadow">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">How to Use Estimate Pro</h2>
        <div className="prose max-w-none">
          <h3>Getting Started</h3>
          <p>Welcome to Estimate Pro! Here's how to get started:</p>
          <ol>
            <li><strong>Add Clients:</strong> Start by adding your clients in the Clients section</li>
            <li><strong>Create Estimates:</strong> Build detailed estimates with line items, quantities, and rates</li>
            <li><strong>Convert to Jobs:</strong> Once estimates are approved, convert them to active jobs</li>
            <li><strong>Track Progress:</strong> Monitor job progress and hours in the Jobs section</li>
          </ol>
          
          <h3>Features</h3>
          <ul>
            <li>Client management with contact information</li>
            <li>Detailed estimate creation with automatic calculations</li>
            <li>Job tracking and progress monitoring</li>
            <li>Dashboard with key metrics and recent activity</li>
          </ul>
        </div>
      </div>
    </div>
  );

  const renderCurrentPage = () => {
    switch (currentPage) {
      case 'dashboard': return renderDashboard();
      case 'estimates': return renderEstimates();
      case 'jobs': return renderJobs();
      case 'clients': return renderClients();
      case 'settings': return renderSettings();
      case 'guide': return renderGuide();
      default: return renderDashboard();
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-8">
              <div className="flex items-center space-x-2">
                <Building2 className="w-8 h-8 text-orange-600" />
                <span className="text-xl font-bold text-gray-900">Estimate Pro</span>
              </div>
              
              <div className="flex space-x-4">
                <button
                  onClick={() => setCurrentPage('dashboard')}
                  className={`px-3 py-2 text-sm font-medium rounded-md ${
                    currentPage === 'dashboard'
                      ? 'bg-orange-100 text-orange-700'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  Dashboard
                </button>
                <button
                  onClick={() => setCurrentPage('estimates')}
                  className={`px-3 py-2 text-sm font-medium rounded-md ${
                    currentPage === 'estimates'
                      ? 'bg-orange-100 text-orange-700'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  Estimates
                </button>
                <button
                  onClick={() => setCurrentPage('jobs')}
                  className={`px-3 py-2 text-sm font-medium rounded-md ${
                    currentPage === 'jobs'
                      ? 'bg-orange-100 text-orange-700'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  Jobs
                </button>
                <button
                  onClick={() => setCurrentPage('clients')}
                  className={`px-3 py-2 text-sm font-medium rounded-md ${
                    currentPage === 'clients'
                      ? 'bg-orange-100 text-orange-700'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  Clients
                </button>
                <button
                  onClick={() => setCurrentPage('settings')}
                  className={`px-3 py-2 text-sm font-medium rounded-md ${
                    currentPage === 'settings'
                      ? 'bg-orange-100 text-orange-700'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  Settings
                </button>
                <button
                  onClick={() => setCurrentPage('guide')}
                  className={`px-3 py-2 text-sm font-medium rounded-md ${
                    currentPage === 'guide'
                      ? 'bg-orange-100 text-orange-700'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  Guide
                </button>
              </div>
            </div>
          </div>
        </div>
      </nav>
      
      <main className="max-w-7xl mx-auto px-4 py-8">
        {renderCurrentPage()}
      </main>
      
      {showNewEstimateForm && renderNewEstimateForm()}
      {showNewClientForm && renderNewClientForm()}
    </div>
  );
}

export default App;
