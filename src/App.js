import React, { useState } from 'react';
import { XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from 'recharts';
import { Home, FileText, Briefcase, Users, Settings as SettingsIcon, HelpCircle, Plus, Eye, Download, Trash, MoreVertical, DollarSign } from 'lucide-react';

const EstimatePro = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [estimates] = useState([
    { id: 1, client: 'John Smith', project: 'Kitchen Renovation', amount: 5000, status: 'completed', date: '2025-11-05' },
    { id: 2, client: 'Sarah Johnson', project: 'Bathroom Remodel', amount: 3500, status: 'pending', date: '2025-11-08' },
    { id: 3, client: 'Mike Davis', project: 'Deck Installation', amount: 2800, status: 'in-progress', date: '2025-11-10' },
  ]);
  
  const [jobs] = useState([
    { id: 1, name: 'Kitchen Renovation', client: 'John Smith', startDate: '2025-11-01', status: 'in-progress', progress: 65 },
    { id: 2, name: 'Deck Installation', client: 'Mike Davis', startDate: '2025-11-05', status: 'in-progress', progress: 40 },
  ]);
  
  const [clients] = useState([
    { id: 1, name: 'John Smith', phone: '(555) 123-4567', email: 'john@email.com', totalSpent: 5000 },
    { id: 2, name: 'Sarah Johnson', phone: '(555) 234-5678', email: 'sarah@email.com', totalSpent: 3500 },
    { id: 3, name: 'Mike Davis', phone: '(555) 345-6789', email: 'mike@email.com', totalSpent: 2800 },
  ]);

  const [newEstimateData, setNewEstimateData] = useState({
    client: '',
    title: '',
    rawScope: '',
    professionalScope: '',
    generatingScope: false,
  });

  const [showNewEstimateModal, setShowNewEstimateModal] = useState(false);

  const dashboardStats = [
    { label: 'Total Estimates', value: '12', icon: FileText, color: 'bg-red-600' },
    { label: 'Active Jobs', value: '3', icon: Briefcase, color: 'bg-red-600' },
    { label: 'Total Clients', value: '8', icon: Users, color: 'bg-red-600' },
    { label: 'Est. Value', value: '$45,300', icon: DollarSign, color: 'bg-red-600' },
  ];

  const revenueData = [
    { month: 'Aug', revenue: 12000 },
    { month: 'Sep', revenue: 19000 },
    { month: 'Oct', revenue: 15000 },
    { month: 'Nov', revenue: 18000 },
  ];

  const estimateStatusData = [
    { name: 'Completed', value: 5, fill: '#16a34a' },
    { name: 'Pending', value: 4, fill: '#f59e0b' },
    { name: 'In Progress', value: 3, fill: '#3b82f6' },
  ];

  const generateProfessionalScope = async () => {
    if (!newEstimateData.rawScope.trim()) {
      alert('Please enter raw scope notes');
      return;
    }

    setNewEstimateData(prev => ({ ...prev, generatingScope: true }));

    try {
      const response = await fetch('https://estimate-pro-backend-g2ud.onrender.com/api/generateScope', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          rawScope: newEstimateData.rawScope,
          clientName: newEstimateData.client,
          projectTitle: newEstimateData.title,
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      setNewEstimateData(prev => ({
        ...prev,
        professionalScope: data.scope || 'Unable to generate scope',
        generatingScope: false,
      }));
    } catch (error) {
      console.error('Error generating scope:', error);
      setNewEstimateData(prev => ({
        ...prev,
        professionalScope: `Error: ${error.message}`,
        generatingScope: false,
      }));
    }
  };

  const renderDashboard = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {dashboardStats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <div key={index} className="bg-white rounded-lg shadow p-6 border-l-4 border-red-600">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-500 text-sm">{stat.label}</p>
                  <p className="text-3xl font-bold text-gray-800 mt-2">{stat.value}</p>
                </div>
                <Icon className="text-red-600" size={40} />
              </div>
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Monthly Revenue</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={revenueData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Line type="monotone" dataKey="revenue" stroke="#dc2626" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Estimate Status</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie data={estimateStatusData} cx="50%" cy="50%" labelLine={false} label={({ name, value }) => `${name}: ${value}`} outerRadius={80} fill="#8884d8" dataKey="value">
                {estimateStatusData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.fill} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Recent Estimates</h3>
        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-3 px-4 text-gray-700 font-semibold">Client</th>
                <th className="text-left py-3 px-4 text-gray-700 font-semibold">Project</th>
                <th className="text-left py-3 px-4 text-gray-700 font-semibold">Amount</th>
                <th className="text-left py-3 px-4 text-gray-700 font-semibold">Status</th>
                <th className="text-left py-3 px-4 text-gray-700 font-semibold">Date</th>
              </tr>
            </thead>
            <tbody>
              {estimates.map((est) => (
                <tr key={est.id} className="border-b border-gray-100 hover:bg-gray-50">
                  <td className="py-3 px-4 text-gray-800">{est.client}</td>
                  <td className="py-3 px-4 text-gray-800">{est.project}</td>
                  <td className="py-3 px-4 text-gray-800 font-semibold">${est.amount.toLocaleString()}</td>
                  <td className="py-3 px-4">
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                      est.status === 'completed' ? 'bg-green-100 text-green-700' :
                      est.status === 'pending' ? 'bg-yellow-100 text-yellow-700' :
                      'bg-blue-100 text-blue-700'
                    }`}>
                      {est.status.charAt(0).toUpperCase() + est.status.slice(1)}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-gray-600">{est.date}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );

  const renderEstimates = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-800">Estimates</h2>
        <button onClick={() => setShowNewEstimateModal(true)} className="flex items-center gap-2 bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700">
          <Plus size={20} /> New Estimate
        </button>
      </div>

      {showNewEstimateModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-8 max-w-2xl w-full max-h-96 overflow-y-auto">
            <h3 className="text-xl font-bold text-gray-800 mb-4">New Estimate</h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Client</label>
                <select value={newEstimateData.client} onChange={(e) => setNewEstimateData(prev => ({ ...prev, client: e.target.value }))} className="w-full px-3 py-2 border border-gray-300 rounded-lg">
                  <option value="">Select client</option>
                  {clients.map(c => <option key={c.id} value={c.name}>{c.name}</option>)}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
                <input type="text" value={newEstimateData.title} onChange={(e) => setNewEstimateData(prev => ({ ...prev, title: e.target.value }))} placeholder="Project title" className="w-full px-3 py-2 border border-gray-300 rounded-lg" />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Raw Scope of Work (Your Notes)</label>
                <textarea value={newEstimateData.rawScope} onChange={(e) => setNewEstimateData(prev => ({ ...prev, rawScope: e.target.value }))} placeholder="Describe the project details, materials, measurements, etc." className="w-full px-3 py-2 border border-gray-300 rounded-lg h-32" />
              </div>

              <button 
                onClick={generateProfessionalScope} 
                disabled={newEstimateData.generatingScope}
                className="w-full bg-yellow-500 hover:bg-yellow-600 disabled:bg-gray-400 text-white font-bold py-2 px-4 rounded-lg"
              >
                {newEstimateData.generatingScope ? '⏳ Generating...' : '🤖 Generate Professional Scope with AI Learning'}
              </button>

              {newEstimateData.professionalScope && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Professional Scope of Work</label>
                  <textarea value={newEstimateData.professionalScope} readOnly className="w-full px-3 py-2 border border-gray-300 rounded-lg h-32 bg-gray-50" />
                </div>
              )}
            </div>

            <div className="flex gap-2 mt-6">
              <button onClick={() => setShowNewEstimateModal(false)} className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-100">Cancel</button>
              <button className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700">Save Estimate</button>
            </div>
          </div>
        </div>
      )}

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="text-left py-4 px-6 text-gray-700 font-semibold">Client</th>
              <th className="text-left py-4 px-6 text-gray-700 font-semibold">Project</th>
              <th className="text-left py-4 px-6 text-gray-700 font-semibold">Amount</th>
              <th className="text-left py-4 px-6 text-gray-700 font-semibold">Status</th>
              <th className="text-left py-4 px-6 text-gray-700 font-semibold">Actions</th>
            </tr>
          </thead>
          <tbody>
            {estimates.map((est) => (
              <tr key={est.id} className="border-b border-gray-100 hover:bg-gray-50">
                <td className="py-4 px-6 text-gray-800">{est.client}</td>
                <td className="py-4 px-6 text-gray-800">{est.project}</td>
                <td className="py-4 px-6 text-gray-800 font-semibold">${est.amount.toLocaleString()}</td>
                <td className="py-4 px-6">
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                    est.status === 'completed' ? 'bg-green-100 text-green-700' :
                    est.status === 'pending' ? 'bg-yellow-100 text-yellow-700' :
                    'bg-blue-100 text-blue-700'
                  }`}>
                    {est.status.charAt(0).toUpperCase() + est.status.slice(1)}
                  </span>
                </td>
                <td className="py-4 px-6 flex gap-3">
                  <Eye size={18} className="text-blue-600 cursor-pointer hover:text-blue-800" />
                  <Download size={18} className="text-green-600 cursor-pointer hover:text-green-800" />
                  <Trash size={18} className="text-red-600 cursor-pointer hover:text-red-800" />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );

  const renderJobs = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-800">Jobs</h2>
        <button className="flex items-center gap-2 bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700">
          <Plus size={20} /> New Job
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {jobs.map((job) => (
          <div key={job.id} className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold text-gray-800">{job.name}</h3>
            <p className="text-gray-600 text-sm mt-2">{job.client}</p>
            <p className="text-gray-500 text-sm mt-1">Started: {job.startDate}</p>
            <div className="mt-4">
              <div className="flex justify-between mb-2">
                <span className="text-sm font-medium text-gray-700">Progress</span>
                <span className="text-sm font-bold text-red-600">{job.progress}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className="bg-red-600 h-2 rounded-full" style={{ width: `${job.progress}%` }}></div>
              </div>
            </div>
            <div className="mt-4 flex justify-between">
              <span className={`px-3 py-1 rounded text-sm font-medium ${
                job.status === 'completed' ? 'bg-green-100 text-green-700' : 'bg-blue-100 text-blue-700'
              }`}>
                {job.status.charAt(0).toUpperCase() + job.status.slice(1)}
              </span>
              <MoreVertical size={18} className="text-gray-400 cursor-pointer" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderClients = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-800">Clients</h2>
        <button className="flex items-center gap-2 bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700">
          <Plus size={20} /> Add Client
        </button>
      </div>

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="text-left py-4 px-6 text-gray-700 font-semibold">Name</th>
              <th className="text-left py-4 px-6 text-gray-700 font-semibold">Phone</th>
              <th className="text-left py-4 px-6 text-gray-700 font-semibold">Email</th>
              <th className="text-left py-4 px-6 text-gray-700 font-semibold">Total Spent</th>
              <th className="text-left py-4 px-6 text-gray-700 font-semibold">Actions</th>
            </tr>
          </thead>
          <tbody>
            {clients.map((client) => (
              <tr key={client.id} className="border-b border-gray-100 hover:bg-gray-50">
                <td className="py-4 px-6 text-gray-800 font-medium">{client.name}</td>
                <td className="py-4 px-6 text-gray-600">{client.phone}</td>
                <td className="py-4 px-6 text-gray-600">{client.email}</td>
                <td className="py-4 px-6 text-gray-800 font-semibold">${client.totalSpent.toLocaleString()}</td>
                <td className="py-4 px-6 flex gap-3">
                  <Eye size={18} className="text-blue-600 cursor-pointer hover:text-blue-800" />
                  <Trash size={18} className="text-red-600 cursor-pointer hover:text-red-800" />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );

  const renderSettings = () => (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-800">Settings</h2>
      
      <div className="bg-white rounded-lg shadow p-6 space-y-6">
        <div>
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Company Information</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Company Name</label>
              <input type="text" placeholder="Blackston Handyman Services" className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-red-500 focus:border-red-500" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Phone</label>
              <input type="text" placeholder="(555) 123-4567" className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-red-500 focus:border-red-500" />
            </div>
          </div>
        </div>

        <div>
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Branding</h3>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Primary Color</label>
            <div className="flex gap-3">
              <div className="w-12 h-12 bg-red-600 rounded cursor-pointer border-2 border-red-800"></div>
              <div className="w-12 h-12 bg-blue-600 rounded cursor-pointer border-2 border-gray-300"></div>
              <div className="w-12 h-12 bg-green-600 rounded cursor-pointer border-2 border-gray-300"></div>
            </div>
          </div>
        </div>

        <button className="bg-red-600 text-white px-6 py-2 rounded-lg hover:bg-red-700">Save Changes</button>
      </div>
    </div>
  );

  const renderGuide = () => (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-800">User Guide</h2>
      
      <div className="space-y-4">
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-2">Getting Started</h3>
          <p className="text-gray-600">Welcome to EstimatePro! This guide will help you navigate the application and manage your estimates effectively.</p>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-2">Creating Estimates</h3>
          <p className="text-gray-600">Click the "New Estimate" button to create professional estimates for your clients. Fill in project details, scope of work, and pricing.</p>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-2">Managing Jobs</h3>
          <p className="text-gray-600">Track active jobs and monitor progress. Update job status and completion percentage as work progresses.</p>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-2">Client Management</h3>
          <p className="text-gray-600">Store client information, contact details, and track total spending for better relationship management.</p>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-red-600 text-white shadow">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <h1 className="text-3xl font-bold">EstimatePro</h1>
          <p className="text-red-100">Blackston Handyman Services</p>
        </div>
      </header>

      <div className="flex">
        <nav className="w-64 bg-white shadow-lg">
          <div className="p-6 space-y-2">
            {[
              { id: 'dashboard', icon: Home, label: 'Dashboard' },
              { id: 'estimates', icon: FileText, label: 'Estimates' },
              { id: 'jobs', icon: Briefcase, label: 'Jobs' },
              { id: 'clients', icon: Users, label: 'Clients' },
              { id: 'settings', icon: SettingsIcon, label: 'Settings' },
              { id: 'guide', icon: HelpCircle, label: 'Guide' },
            ].map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                    activeTab === tab.id
                      ? 'bg-red-600 text-white'
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  <Icon size={20} />
                  <span className="font-medium">{tab.label}</span>
                </button>
              );
            })}
          </div>
        </nav>

        <main className="flex-1 p-8">
          {activeTab === 'dashboard' && renderDashboard()}
          {activeTab === 'estimates' && renderEstimates()}
          {activeTab === 'jobs' && renderJobs()}
          {activeTab === 'clients' && renderClients()}
          {activeTab === 'settings' && renderSettings()}
          {activeTab === 'guide' && renderGuide()}
        </main>
      </div>
    </div>
  );
};

export default EstimatePro;