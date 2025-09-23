                    <td className="py-3 px-6">
                      <div className="flex justify-center space-x-2">
                        <button
                          onClick={() => generatePDF(job)}
                          className="text-purple-600 hover:text-purple-800"
                          title="Generate PDF"
                        >
                          <Download className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => {
                            const client = clients.find(c => c.id === job.client_id);
                            if (client) sendEmail(client.email, job);
                          }}
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

  // Jobs page
  const Jobs = () => (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-900">Jobs</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {jobs.map((job) => (
          <div key={job.id} className="bg-white rounded-lg shadow-sm border p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">{job.title}</h3>
            <p className="text-gray-600 mb-2">{job.client_name}</p>
            <p className="text-gray-600 mb-2">{job.location}</p>
            <p className="text-lg font-bold text-blue-600">${job.estimate_total.toLocaleString()}</p>
            <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium mt-2 ${
              job.status === 'completed' ? 'bg-green-100 text-green-800' :
              job.status === 'in_progress' ? 'bg-blue-100 text-blue-800' :
              job.status === 'estimate_sent' ? 'bg-yellow-100 text-yellow-800' :
              'bg-gray-100 text-gray-800'
            }`}>
              {job.status.replace('_', ' ')}
            </span>
          </div>
        ))}
      </div>
    </div>
  );

  // Clients page
  const Clients = () => {
    const [showNewClientForm, setShowNewClientForm] = useState(false);
    const [newClient, setNewClient] = useState({
      name: '', email: '', phone: '', address: '', company: ''
    });

    const addClient = () => {
      if (newClient.name && newClient.email) {
        setClients(prev => [...prev, { ...newClient, id: Date.now() }]);
        setNewClient({ name: '', email: '', phone: '', address: '', company: '' });
        setShowNewClientForm(false);
        alert('Client added successfully!');
      }
    };

    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-900">Clients</h1>
          <button
            onClick={() => setShowNewClientForm(true)}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2"
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
                className="border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <input
                type="email"
                placeholder="Email Address"
                value={newClient.email}
                onChange={(e) => setNewClient(prev => ({ ...prev, email: e.target.value }))}
                className="border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <input
                type="tel"
                placeholder="Phone Number"
                value={newClient.phone}
                onChange={(e) => setNewClient(prev => ({ ...prev, phone: e.target.value }))}
                className="border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <input
                type="text"
                placeholder="Company (optional)"
                value={newClient.company}
                onChange={(e) => setNewClient(prev => ({ ...prev, company: e.target.value }))}
                className="border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <input
                type="text"
                placeholder="Address"
                value={newClient.address}
                onChange={(e) => setNewClient(prev => ({ ...prev, address: e.target.value }))}
                className="md:col-span-2 border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
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
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg"
              >
                Add Client
              </button>
            </div>
          </div>
        )}

        <div className="bg-white rounded-lg shadow-sm border">
          <div className="p-6 border-b">
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
                  <th className="text-center py-3 px-6 font-medium text-gray-700">Actions</th>
                </tr>
              </thead>
              <tbody>
                {clients.map((client) => (
                  <tr key={client.id} className="border-b hover:bg-gray-50">
                    <td className="py-3 px-6 font-medium">{client.name}</td>
                    <td className="py-3 px-6">{client.email}</td>
                    <td className="py-3 px-6">{client.phone}</td>
                    <td className="py-3 px-6">{client.company}</td>
                    <td className="py-3 px-6">
                      <div className="flex justify-center space-x-2">
                        <button className="text-blue-600 hover:text-blue-800">
                          <Edit className="w-4 h-4" />
                        </button>
                        <button className="text-red-600 hover:text-red-800">
                          <Trash2 className="w-4 h-4" />
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

  // Settings page
  const Settings = () => {
    const [settings, setSettings] = useState(userSettings);
    const [newJobType, setNewJobType] = useState('');

    const saveSettings = () => {
      setUserSettings(settings);
      alert('Settings saved successfully!');
    };

    const addJobType = () => {
      if (newJobType && !settings.custom_job_types.includes(newJobType)) {
        setSettings(prev => ({
          ...prev,
          custom_job_types: [...prev.custom_job_types, newJobType]
        }));
        setNewJobType('');
      }
    };

    return (
      <div className="space-y-6">
        <h1 className="text-2xl font-bold text-gray-900">Settings</h1>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white rounded-lg shadow-sm border p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Company Information</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Company Name</label>
                <input
                  type="text"
                  value={settings.company_name}
                  onChange={(e) => setSettings(prev => ({ ...prev, company_name: e.target.value }))}
                  className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Business Phone</label>
                <input
                  type="tel"
                  value={settings.business_phone}
                  onChange={(e) => setSettings(prev => ({ ...prev, business_phone: e.target.value }))}
                  className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Business Address</label>
                <input
                  type="text"
                  value={settings.business_address}
                  onChange={(e) => setSettings(prev => ({ ...prev, business_address: e.target.value }))}
                  className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">License Number</label>
                <input
                  type="text"
                  value={settings.license_number}
                  onChange={(e) => setSettings(prev => ({ ...prev, license_number: e.target.value }))}
                  className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Business Defaults</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Default Tax Rate (%)</label>
                <input
                  type="number"
                  step="0.1"
                  value={settings.default_tax_rate}
                  onChange={(e) => setSettings(prev => ({ ...prev, default_tax_rate: parseFloat(e.target.value) }))}
                  className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Default Markup Rate (%)</label>
                <input
                  type="number"
                  step="0.1"
                  value={settings.default_markup_rate}
                  onChange={(e) => setSettings(prev => ({ ...prev, default_markup_rate: parseFloat(e.target.value) }))}
                  className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">PDF Template Upload</h2>
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
              <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
              <p className="text-sm text-gray-600 mb-2">Upload your PDF estimate template</p>
              <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm">
                Choose File
              </button>
            </div>
            <p className="text-xs text-gray-500 mt-2">
              Upload your branded PDF template. The system will automatically fill in client data, line items, and totals.
            </p>
          </div>

          <div className="bg-white rounded-lg shadow-sm border p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Custom Job Types</h2>
            <div className="space-y-4">
              <div className="flex space-x-2">
                <input
                  type="text"
                  value={newJobType}
                  onChange={(e) => setNewJobType(e.target.value)}
                  placeholder="Enter new job type"
                  className="flex-1 border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <button
                  onClick={addJobType}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg"
                >
                  Add
                </button>
              </div>
              
              <div className="space-y-2">
                {settings.custom_job_types.map((jobType, index) => (
                  <div key={index} className="flex justify-between items-center bg-gray-50 px-3 py-2 rounded">
                    <span>{jobType}</span>
                    <button
                      onClick={() => {
                        setSettings(prev => ({
                          ...prev,
                          custom_job_types: prev.custom_job_types.filter(type => type !== jobType)
                        }));
                      }}
                      className="text-red-600 hover:text-red-800"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="flex justify-end">
          <button
            onClick={saveSettings}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg flex items-center space-x-2"
          >
            <Save className="w-4 h-4" />
            <span>Save Settings</span>
          </button>
        </div>
      </div>
    );
  };

  // User Guide page
  const Guide = () => (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-900">User Guide</h1>
      
      <div className="bg-white rounded-lg shadow-sm border p-6">
        <div className="prose max-w-none">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Getting Started</h2>
          
          <h3 className="text-lg font-semibold text-gray-800 mb-2">1. Upload Your PDF Template</h3>
          <p className="text-gray-600 mb-4">
            In Settings, upload your branded PDF estimate template. The system will learn to fill in the designated fields automatically.
          </p>
          
          <h3 className="text-lg font-semibold text-gray-800 mb-2">2. Add Clients</h3>
          <p className="text-gray-600 mb-4">
            Use the Clients page to maintain your customer database. All client information will be automatically populated in estimates.
          </p>
          
          <h3 className="text-lg font-semibold text-gray-800 mb-2">3. Create Estimates</h3>
          <p className="text-gray-600 mb-4">
            Click "New Estimate" to create professional estimates. The AI will learn your pricing patterns and suggest line items based on job type.
          </p>
          
          <h3 className="text-lg font-semibold text-gray-800 mb-2">4. Generate & Send PDFs</h3>
          <p className="text-gray-600 mb-4">
            Once your estimate is complete, generate a professional PDF using your template and send it directly to clients via email.
          </p>
          
          <h2 className="text-xl font-semibold text-gray-900 mb-4 mt-8">AI Learning Features</h2>
          
          <h3 className="text-lg font-semibold text-gray-800 mb-2">Smart Suggestions</h3>
          <p className="text-gray-600 mb-4">
            The system learns from your pricing history and suggests appropriate line items and rates for different job types.
          </p>
          
          <h3 className="text-lg font-semibold text-gray-800 mb-2">Scope Generation</h3>
          <p className="text-gray-600 mb-4">
            Use the "AI Generate" button to create professional scope descriptions based on your job type and notes.
          </p>
          
          <h2 className="text-xl font-semibold text-gray-900 mb-4 mt-8">Key Features</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-blue-50 p-4 rounded-lg">
              <h4 className="font-semibold text-blue-900 mb-2">PDF Template Filling</h4>
              <p className="text-blue-800 text-sm">Automatically fill your branded PDF templates with estimate data</p>
            </div>
            
            <div className="bg-green-50 p-4 rounded-lg">
              <h4 className="font-semibold text-green-900 mb-2">Email Integration</h4>
              <p className="text-green-800 text-sm">Send professional estimates directly to clients via email</p>
            </div>
            
            <div className="bg-purple-50 p-4 rounded-lg">
              <h4 className="font-semibold text-purple-900 mb-2">AI Learning</h4>
              <p className="text-purple-800 text-sm">System learns your pricing patterns and improves suggestions over time</p>
            </div>
            
            <div className="bg-orange-50 p-4 rounded-lg">
              <h4 className="font-semibold text-orange-900 mb-2">Markup Protection</h4>
              <p className="text-orange-800 text-sm">Markup calculations are hidden from customer-facing documents</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  // Render the current page
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
};

export default ConstructionEstimateApp;