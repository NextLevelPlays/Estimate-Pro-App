import React, { useState, useEffect } from 'react';
import {
  Building2, Users, FileText, Settings, BookOpen, Plus, Edit, Trash2,
  Download, Mail, Eye, EyeOff, CheckCircle, Search, X, AlertCircle
} from 'lucide-react';

function ConstructionEstimateApp() {
  // Main state management
  const [currentPage, setCurrentPage] = useState('dashboard');
  const [clients, setClients] = useState([]);
  const [estimates, setEstimates] = useState([]);
  const [jobs, setJobs] = useState([]);

  // API Key management
  const [claudeApiKey, setClaudeApiKey] = useState(localStorage.getItem('claudeApiKey') || '');
  const [showApiKey, setShowApiKey] = useState(false);
  const [apiKeyMessage, setApiKeyMessage] = useState('');

  // Estimate form state
  const [showNewEstimateForm, setShowNewEstimateForm] = useState(false);
  const [isGeneratingScope, setIsGeneratingScope] = useState(false);
  const [generationError, setGenerationError] = useState('');
  
  const [newEstimate, setNewEstimate] = useState({
    client: '',
    title: '',
    description: '',
    raw_scope: '',
    professional_scope: '',
    valid_until: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    materials: [],
    labor: [],
    total: 0,
    status: 'draft'
  });

  // Company info state
  const [companyInfo, setCompanyInfo] = useState({
    name: 'Blackston Handyman Services',
    tagline: 'Quality Work. Honest Price.',
    owner: 'Brandon Blackston',
    phone: '(303) 880-4557',
    email: 'brandon@blackstonhandyman.com',
    primaryColor: '#885450',
    secondaryColor: '#2D3748',
    logoUrl: ''
  });

  // Settings state
  const [settings, setSettings] = useState({
    default_markup_rate: 30,
    currency: 'USD',
    custom_job_types: ['Gutter Installation', 'Roof Repair', 'Deck Building', 'Fence Installation']
  });

  const [newJobType, setNewJobType] = useState('');

  // Load data from localStorage on mount
  useEffect(() => {
    const savedClients = localStorage.getItem('clients');
    const savedEstimates = localStorage.getItem('estimates');
    const savedJobs = localStorage.getItem('jobs');
    const savedCompanyInfo = localStorage.getItem('companyInfo');

    if (savedClients) setClients(JSON.parse(savedClients));
    if (savedEstimates) setEstimates(JSON.parse(savedEstimates));
    if (savedJobs) setJobs(JSON.parse(savedJobs));
    if (savedCompanyInfo) setCompanyInfo(JSON.parse(savedCompanyInfo));
  }, []);

  // Save data to localStorage
  useEffect(() => {
    localStorage.setItem('clients', JSON.stringify(clients));
  }, [clients]);

  useEffect(() => {
    localStorage.setItem('estimates', JSON.stringify(estimates));
  }, [estimates]);

  useEffect(() => {
    localStorage.setItem('jobs', JSON.stringify(jobs));
  }, [jobs]);

  useEffect(() => {
    localStorage.setItem('companyInfo', JSON.stringify(companyInfo));
  }, [companyInfo]);

  // API Key management
  const saveApiKey = (key) => {
    setClaudeApiKey(key);
    localStorage.setItem('claudeApiKey', key);
    setApiKeyMessage('API key saved successfully!');
    setTimeout(() => setApiKeyMessage(''), 3000);
  };

  // Generate Professional Scope using Claude API
  const generateProfessionalScope = async () => {
    if (!newEstimate.raw_scope.trim()) {
      setGenerationError('Please enter raw scope notes first');
      return;
    }

    if (!claudeApiKey) {
      setGenerationError('Please configure your Claude API key in Settings first');
      return;
    }

    setIsGeneratingScope(true);
    setGenerationError('');

    try {
      const response = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': claudeApiKey,
          'anthropic-version': '2023-06-01'
        },
        body: JSON.stringify({
          model: 'claude-opus-4-1',
          max_tokens: 1500,
          messages: [
            {
              role: 'user',
              content: `You are a professional construction estimate scope generator for a handyman service called "${companyInfo.name}". 

Convert the following rough notes into a professional, detailed scope of work that would be sent to a client. 

Requirements:
1. Use professional but friendly language
2. Be specific about what work will be done
3. Include any materials or labor mentioned
4. Mention safety considerations if applicable
5. Include information about cleanup and quality assurance
6. Format with numbered sections and clear descriptions
7. Keep it concise but comprehensive

Raw Notes:
${newEstimate.raw_scope}

Please provide a professional scope of work:`
            }
          ]
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error?.message || 'Failed to generate scope');
      }

      const data = await response.json();
      const generatedScope = data.content[0].text;

      setNewEstimate(prev => ({
        ...prev,
        professional_scope: generatedScope
      }));
    } catch (error) {
      console.error('Error calling Claude API:', error);
      setGenerationError(`Error: ${error.message}. Make sure your API key is valid.`);
    } finally {
      setIsGeneratingScope(false);
    }
  };

  // Navigation Component
  const Navigation = () => (
    <nav className="bg-white shadow-sm border-b" style={{ borderBottomColor: companyInfo.primaryColor }}>
      <div className="max-w-7xl mx-auto px-4 py-4">
        <div className="flex justify-between items-center mb-4">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-lg" style={{ backgroundColor: companyInfo.primaryColor }}></div>
            <div>
              <h1 className="font-bold text-lg" style={{ color: companyInfo.primaryColor }}>
                {companyInfo.name}
              </h1>
              <p className="text-xs text-gray-600">{companyInfo.tagline}</p>
            </div>
          </div>
          <div className="text-sm text-gray-600">
            <p>{companyInfo.phone}</p>
            <p>{companyInfo.email}</p>
          </div>
        </div>

        <div className="flex space-x-6 border-t pt-4">
          <button
            onClick={() => setCurrentPage('dashboard')}
            className={`font-medium flex items-center space-x-1 pb-2 border-b-2 ${
              currentPage === 'dashboard'
                ? 'border-blue-600 text-blue-600'
                : 'border-transparent text-gray-600 hover:text-gray-900'
            }`}
          >
            <Building2 className="w-4 h-4" />
            <span>Dashboard</span>
          </button>
          <button
            onClick={() => setCurrentPage('estimates')}
            className={`font-medium flex items-center space-x-1 pb-2 border-b-2 ${
              currentPage === 'estimates'
                ? 'border-blue-600 text-blue-600'
                : 'border-transparent text-gray-600 hover:text-gray-900'
            }`}
          >
            <FileText className="w-4 h-4" />
            <span>Estimates</span>
          </button>
          <button
            onClick={() => setCurrentPage('clients')}
            className={`font-medium flex items-center space-x-1 pb-2 border-b-2 ${
              currentPage === 'clients'
                ? 'border-blue-600 text-blue-600'
                : 'border-transparent text-gray-600 hover:text-gray-900'
            }`}
          >
            <Users className="w-4 h-4" />
            <span>Clients</span>
          </button>
          <button
            onClick={() => setCurrentPage('settings')}
            className={`font-medium flex items-center space-x-1 pb-2 border-b-2 ${
              currentPage === 'settings'
                ? 'border-blue-600 text-blue-600'
                : 'border-transparent text-gray-600 hover:text-gray-900'
            }`}
          >
            <Settings className="w-4 h-4" />
            <span>Settings</span>
          </button>
          <button
            onClick={() => setCurrentPage('guide')}
            className={`font-medium flex items-center space-x-1 pb-2 border-b-2 ${
              currentPage === 'guide'
                ? 'border-blue-600 text-blue-600'
                : 'border-transparent text-gray-600 hover:text-gray-900'
            }`}
          >
            <BookOpen className="w-4 h-4" />
            <span>Guide</span>
          </button>
        </div>
      </div>
    </nav>
  );

  // Dashboard Page
  const Dashboard = () => {
    const totalEstimates = estimates.length;
    const completedJobs = jobs.filter(j => j.status === 'completed').length;
    const totalClients = clients.length;
    const totalValue = estimates.reduce((sum, est) => sum + (est.total || 0), 0);

    return (
      <div className="space-y-6">
        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-white rounded-lg shadow-sm p-6 border-l-4" style={{ borderLeftColor: companyInfo.primaryColor }}>
            <p className="text-gray-600 text-sm">Total Estimates</p>
            <p className="text-3xl font-bold text-gray-900">{totalEstimates}</p>
          </div>
          <div className="bg-white rounded-lg shadow-sm p-6 border-l-4 border-green-500">
            <p className="text-gray-600 text-sm">Completed Jobs</p>
            <p className="text-3xl font-bold text-gray-900">{completedJobs}</p>
          </div>
          <div className="bg-white rounded-lg shadow-sm p-6 border-l-4 border-blue-500">
            <p className="text-gray-600 text-sm">Total Clients</p>
            <p className="text-3xl font-bold text-gray-900">{totalClients}</p>
          </div>
          <div className="bg-white rounded-lg shadow-sm p-6 border-l-4 border-purple-500">
            <p className="text-gray-600 text-sm">Est. Value</p>
            <p className="text-3xl font-bold text-gray-900">${(totalValue / 1000).toFixed(1)}k</p>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Recent Estimates</h2>
          <div className="space-y-3">
            {estimates.slice(-5).reverse().map((est) => (
              <div key={est.id} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                <div>
                  <p className="font-medium text-gray-900">{est.title}</p>
                  <p className="text-sm text-gray-600">{est.client}</p>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-gray-900">${est.total.toLocaleString()}</p>
                  <span className={`text-xs px-2 py-1 rounded-full ${
                    est.status === 'draft' ? 'bg-gray-200 text-gray-800' :
                    est.status === 'sent' ? 'bg-blue-200 text-blue-800' :
                    'bg-green-200 text-green-800'
                  }`}>
                    {est.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  };

  // Estimates Page
  const Estimates = () => {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-900">Estimates</h1>
          <button
            onClick={() => {
              setNewEstimate({
                client: '',
                title: '',
                description: '',
                raw_scope: '',
                professional_scope: '',
                valid_until: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
                materials: [],
                labor: [],
                total: 0,
                status: 'draft'
              });
              setShowNewEstimateForm(true);
            }}
            className="text-white px-4 py-2 rounded-lg flex items-center space-x-2"
            style={{ backgroundColor: companyInfo.primaryColor }}
          >
            <Plus className="w-4 h-4" />
            <span>New Estimate</span>
          </button>
        </div>

        {showNewEstimateForm && (
          <div className="bg-white rounded-lg shadow-sm border p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold text-gray-900">New Estimate</h2>
              <button
                onClick={() => setShowNewEstimateForm(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Client</label>
                  <select
                    value={newEstimate.client}
                    onChange={(e) => setNewEstimate(prev => ({ ...prev, client: e.target.value }))}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Select a client</option>
                    {clients.map((c) => (
                      <option key={c.id} value={c.name}>{c.name}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Valid Until</label>
                  <input
                    type="date"
                    value={newEstimate.valid_until}
                    onChange={(e) => setNewEstimate(prev => ({ ...prev, valid_until: e.target.value }))}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
                <input
                  type="text"
                  placeholder="e.g., New Gutter Install"
                  value={newEstimate.title}
                  onChange={(e) => setNewEstimate(prev => ({ ...prev, title: e.target.value }))}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Raw Scope of Work (Your Notes)</label>
                <textarea
                  placeholder="Enter your rough notes about the job..."
                  value={newEstimate.raw_scope}
                  onChange={(e) => setNewEstimate(prev => ({ ...prev, raw_scope: e.target.value }))}
                  rows={4}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <p className="text-xs text-gray-500 mt-1">The AI will convert these notes into a professional scope</p>
              </div>

              <button
                onClick={generateProfessionalScope}
                disabled={isGeneratingScope}
                className="w-full text-white px-4 py-3 rounded-lg font-medium flex items-center justify-center space-x-2"
                style={{ backgroundColor: companyInfo.primaryColor, opacity: isGeneratingScope ? 0.7 : 1 }}
              >
                {isGeneratingScope ? (
                  <>
                    <div className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full"></div>
                    <span>Generating Professional Scope...</span>
                  </>
                ) : (
                  <span>✨ Generate Professional Scope with AI</span>
                )}
              </button>

              {generationError && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-3 flex items-start space-x-2">
                  <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-red-900">Generation Error</p>
                    <p className="text-sm text-red-800">{generationError}</p>
                  </div>
                </div>
              )}

              {newEstimate.professional_scope && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Professional Scope</label>
                  <div className="w-full border border-gray-300 rounded-lg px-3 py-2 bg-gray-50 max-h-64 overflow-y-auto whitespace-pre-wrap text-sm text-gray-800">
                    {newEstimate.professional_scope}
                  </div>
                </div>
              )}

              <div className="flex justify-end space-x-3 pt-4 border-t">
                <button
                  onClick={() => setShowNewEstimateForm(false)}
                  className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  onClick={() => {
                    if (newEstimate.client && newEstimate.title && newEstimate.professional_scope) {
                      setEstimates(prev => [...prev, { ...newEstimate, id: Date.now() }]);
                      setShowNewEstimateForm(false);
                      setNewEstimate({
                        client: '',
                        title: '',
                        description: '',
                        raw_scope: '',
                        professional_scope: '',
                        valid_until: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
                        materials: [],
                        labor: [],
                        total: 0,
                        status: 'draft'
                      });
                      alert('Estimate created successfully!');
                    } else {
                      alert('Please fill in all required fields and generate a professional scope');
                    }
                  }}
                  className="px-4 py-2 text-white rounded-lg"
                  style={{ backgroundColor: companyInfo.primaryColor }}
                >
                  Save Estimate
                </button>
              </div>
            </div>
          </div>
        )}

        <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
          {estimates.length === 0 ? (
            <div className="p-8 text-center">
              <FileText className="w-12 h-12 text-gray-300 mx-auto mb-3" />
              <p className="text-gray-600">No estimates yet. Create your first one!</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b">
                  <tr>
                    <th className="text-left py-3 px-6 font-medium text-gray-700">Title</th>
                    <th className="text-left py-3 px-6 font-medium text-gray-700">Client</th>
                    <th className="text-left py-3 px-6 font-medium text-gray-700">Total</th>
                    <th className="text-left py-3 px-6 font-medium text-gray-700">Valid Until</th>
                    <th className="text-center py-3 px-6 font-medium text-gray-700">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {estimates.map((est) => (
                    <tr key={est.id} className="border-b hover:bg-gray-50">
                      <td className="py-3 px-6 font-medium">{est.title}</td>
                      <td className="py-3 px-6">{est.client}</td>
                      <td className="py-3 px-6 font-semibold">${est.total.toLocaleString()}</td>
                      <td className="py-3 px-6">{est.valid_until}</td>
                      <td className="py-3 px-6 text-center">
                        <span className={`text-xs px-2 py-1 rounded-full font-medium ${
                          est.status === 'draft' ? 'bg-gray-200 text-gray-800' :
                          est.status === 'sent' ? 'bg-blue-200 text-blue-800' :
                          'bg-green-200 text-green-800'
                        }`}>
                          {est.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    );
  };

  // Clients Page
  const Clients = () => {
    const [showNewClientForm, setShowNewClientForm] = useState(false);
    const [newClient, setNewClient] = useState({
      name: '', email: '', phone: '', address: '', company: ''
    });

    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-900">Clients</h1>
          <button
            onClick={() => setShowNewClientForm(true)}
            className="text-white px-4 py-2 rounded-lg flex items-center space-x-2"
            style={{ backgroundColor: companyInfo.primaryColor }}
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
                className="border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <input
                type="email"
                placeholder="Email"
                value={newClient.email}
                onChange={(e) => setNewClient(prev => ({ ...prev, email: e.target.value }))}
                className="border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <input
                type="tel"
                placeholder="Phone"
                value={newClient.phone}
                onChange={(e) => setNewClient(prev => ({ ...prev, phone: e.target.value }))}
                className="border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <input
                type="text"
                placeholder="Company"
                value={newClient.company}
                onChange={(e) => setNewClient(prev => ({ ...prev, company: e.target.value }))}
                className="border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <input
                type="text"
                placeholder="Address"
                value={newClient.address}
                onChange={(e) => setNewClient(prev => ({ ...prev, address: e.target.value }))}
                className="md:col-span-2 border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div className="flex justify-end space-x-3 mt-4">
              <button
                onClick={() => setShowNewClientForm(false)}
                className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  if (newClient.name && newClient.email) {
                    setClients(prev => [...prev, { ...newClient, id: Date.now() }]);
                    setNewClient({ name: '', email: '', phone: '', address: '', company: '' });
                    setShowNewClientForm(false);
                    alert('Client added!');
                  }
                }}
                className="px-4 py-2 text-white rounded-lg"
                style={{ backgroundColor: companyInfo.primaryColor }}
              >
                Add Client
              </button>
            </div>
          </div>
        )}

        <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
          {clients.length === 0 ? (
            <div className="p-8 text-center">
              <Users className="w-12 h-12 text-gray-300 mx-auto mb-3" />
              <p className="text-gray-600">No clients yet. Add your first one!</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b">
                  <tr>
                    <th className="text-left py-3 px-6 font-medium text-gray-700">Name</th>
                    <th className="text-left py-3 px-6 font-medium text-gray-700">Email</th>
                    <th className="text-left py-3 px-6 font-medium text-gray-700">Phone</th>
                    <th className="text-left py-3 px-6 font-medium text-gray-700">Company</th>
                  </tr>
                </thead>
                <tbody>
                  {clients.map((c) => (
                    <tr key={c.id} className="border-b hover:bg-gray-50">
                      <td className="py-3 px-6 font-medium">{c.name}</td>
                      <td className="py-3 px-6">{c.email}</td>
                      <td className="py-3 px-6">{c.phone}</td>
                      <td className="py-3 px-6">{c.company}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    );
  };

  // Settings Page
  const Settings = () => {
    return (
      <div className="space-y-6">
        <h1 className="text-2xl font-bold text-gray-900">Settings</h1>

        <div className="bg-white rounded-lg shadow-sm border p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4" style={{ color: companyInfo.primaryColor }}>
            Claude AI Configuration
          </h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Claude API Key</label>
              <div className="flex space-x-2">
                <input
                  type={showApiKey ? 'text' : 'password'}
                  value={claudeApiKey}
                  onChange={(e) => setClaudeApiKey(e.target.value)}
                  placeholder="sk-ant-xxxxxxxxxxxxx"
                  className="flex-1 border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <button
                  onClick={() => setShowApiKey(!showApiKey)}
                  className="px-3 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300"
                >
                  {showApiKey ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
                <button
                  onClick={() => saveApiKey(claudeApiKey)}
                  className="px-4 py-2 text-white rounded-lg hover:opacity-90"
                  style={{ backgroundColor: companyInfo.primaryColor }}
                >
                  Save Key
                </button>
              </div>
              <p className="text-xs text-gray-500 mt-2">
                Get your API key from{' '}
                <a href="https://console.anthropic.com/" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                  console.anthropic.com
                </a>
              </p>
              {apiKeyMessage && (
                <div className="mt-2 flex items-center text-sm text-green-600">
                  <CheckCircle className="w-4 h-4 mr-1" />
                  {apiKeyMessage}
                </div>
              )}
              {claudeApiKey && !apiKeyMessage && (
                <div className="mt-2 flex items-center text-sm text-green-600">
                  <CheckCircle className="w-4 h-4 mr-1" />
                  API key configured
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Company Information</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Company Name</label>
              <input
                type="text"
                value={companyInfo.name}
                onChange={(e) => setCompanyInfo(prev => ({ ...prev, name: e.target.value }))}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Tagline</label>
              <input
                type="text"
                value={companyInfo.tagline}
                onChange={(e) => setCompanyInfo(prev => ({ ...prev, tagline: e.target.value }))}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Owner Name</label>
                <input
                  type="text"
                  value={companyInfo.owner}
                  onChange={(e) => setCompanyInfo(prev => ({ ...prev, owner: e.target.value }))}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                <input
                  type="tel"
                  value={companyInfo.phone}
                  onChange={(e) => setCompanyInfo(prev => ({ ...prev, phone: e.target.value }))}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
              <input
                type="email"
                value={companyInfo.email}
                onChange={(e) => setCompanyInfo(prev => ({ ...prev, email: e.target.value }))}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Primary Color</label>
                <div className="flex space-x-2">
                  <input
                    type="color"
                    value={companyInfo.primaryColor}
                    onChange={(e) => setCompanyInfo(prev => ({ ...prev, primaryColor: e.target.value }))}
                    className="w-12 h-10 border border-gray-300 rounded-lg cursor-pointer"
                  />
                  <input
                    type="text"
                    value={companyInfo.primaryColor}
                    onChange={(e) => setCompanyInfo(prev => ({ ...prev, primaryColor: e.target.value }))}
                    className="flex-1 border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Secondary Color</label>
                <div className="flex space-x-2">
                  <input
                    type="color"
                    value={companyInfo.secondaryColor}
                    onChange={(e) => setCompanyInfo(prev => ({ ...prev, secondaryColor: e.target.value }))}
                    className="w-12 h-10 border border-gray-300 rounded-lg cursor-pointer"
                  />
                  <input
                    type="text"
                    value={companyInfo.secondaryColor}
                    onChange={(e) => setCompanyInfo(prev => ({ ...prev, secondaryColor: e.target.value }))}
                    className="flex-1 border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  // Guide Page
  const Guide = () => (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-900">User Guide</h1>
      
      <div className="bg-white rounded-lg shadow-sm border p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Getting Started</h2>
        
        <div className="space-y-6">
          <div>
            <h3 className="text-lg font-semibold text-gray-800 mb-2">1. Configure Your API Key</h3>
            <p className="text-gray-600">
              Go to Settings and add your Claude API key from{' '}
              <a href="https://console.anthropic.com/" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                console.anthropic.com
              </a>
            </p>
          </div>

          <div>
            <h3 className="text-lg font-semibold text-gray-800 mb-2">2. Add Your Clients</h3>
            <p className="text-gray-600">
              Go to the Clients page and add your customer information. You'll select them when creating estimates.
            </p>
          </div>

          <div>
            <h3 className="text-lg font-semibold text-gray-800 mb-2">3. Create Estimates</h3>
            <p className="text-gray-600">
              Go to Estimates and click "New Estimate". Enter your rough notes in the "Raw Scope" field.
            </p>
          </div>

          <div>
            <h3 className="text-lg font-semibold text-gray-800 mb-2">4. Generate Professional Scope</h3>
            <p className="text-gray-600">
              Click the "✨ Generate Professional Scope with AI" button. The Claude AI will convert your notes into a professional, formatted scope that impresses clients.
            </p>
          </div>

          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <h4 className="font-semibold text-blue-900 mb-2">💡 Pro Tip</h4>
            <p className="text-blue-800 text-sm">
              The more detail you provide in your raw notes, the better the AI-generated scope will be. Include measurements, materials, labor hours, and any special considerations.
            </p>
          </div>
        </div>
      </div>
    </div>
  );

  // Render current page
  const renderCurrentPage = () => {
    switch (currentPage) {
      case 'dashboard': return <Dashboard />;
      case 'estimates': return <Estimates />;
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

export default ConstructionEstimateApp;