              <button
                onClick={() => setShowNewEstimateForm(false)}
                className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={saveEstimate}
                className="px-6 py-2 bg-orange-800 hover:bg-orange-900 text-white rounded-lg flex items-center space-x-2"
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
            className="bg-orange-800 hover:bg-orange-900 text-white px-4 py-2 rounded-lg flex items-center space-x-2"
          >
            <Plus className="w-4 h-4" />
            <span>New Estimate</span>
          </button>
        </div>

        <div className="bg-white rounded-lg shadow-sm border">
          <div className="p-6 border-b bg-gradient-to-r from-orange-50 to-orange-100">
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
                          className="text-orange-800 hover:text-orange-900"
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
          <div key={job.id} className="bg-white rounded-lg shadow-sm border border-l-4 border-l-orange-800">
            <div className="p-6">
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
                  <span className="font-semibold text-orange-800">${job.estimate_total.toLocaleString()}</span>
                </div>
              </div>
              
              <div className="mt-4 pt-4 border-t flex justify-between">
                <button className="text-orange-800 hover:text-orange-900 text-sm font-medium">
                  View Details
                </button>
                <button className="text-gray-600 hover:text-gray-800 text-sm font-medium">
                  Edit Status
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  // Clients page
  const Clients = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">Clients</h1>
        <button
          onClick={() => setShowNewClientForm(true)}
          className="bg-orange-800 hover:bg-orange-900 text-white px-4 py-2 rounded-lg flex items-center space-x-2"
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
              className="border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-orange-500"
            />
            <input
              type="email"
              placeholder="Email Address"
              value={newClient.email}
              onChange={(e) => setNewClient(prev => ({ ...prev, email: e.target.value }))}
              className="border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-orange-500"
            />
            <input
              type="tel"
              placeholder="Phone Number"
              value={newClient.phone}
              onChange={(e) => setNewClient(prev => ({ ...prev, phone: e.target.value }))}
              className="border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-orange-500"
            />
            <input
              type="text"
              placeholder="Company (optional)"
              value={newClient.company}
              onChange={(e) => setNewClient(prev => ({ ...prev, company: e.target.value }))}
              className="border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-orange-500"
            />
            <input
              type="text"
              placeholder="Address"
              value={newClient.address}
              onChange={(e) => setNewClient(prev => ({ ...prev, address: e.target.value }))}
              className="md:col-span-2 border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-orange-500"
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
              className="px-4 py-2 bg-orange-800 hover:bg-orange-900 text-white rounded-lg"
            >
              Add Client
            </button>
          </div>
        </div>
      )}

      <div className="bg-white rounded-lg shadow-sm border">
        <div className="p-6 border-b bg-gradient-to-r from-orange-50 to-orange-100">
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
                      <button className="text-orange-800 hover:text-orange-900">
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

  // Settings page
  const Settings = () => (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-900">Settings</h1>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow-sm border p-6 border-l-4 border-l-orange-800">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Company Information</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Company Name</label>
              <input
                type="text"
                value={userSettings.company_name}
                className="w-full border rounded-lg px-3 py-2 bg-gray-50"
                readOnly
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Business Phone</label>
              <input
                type="tel"
                value={userSettings.business_phone}
                className="w-full border rounded-lg px-3 py-2 bg-gray-50"
                readOnly
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Owner/Operator</label>
              <input
                type="text"
                value={userSettings.owner_name}
                className="w-full border rounded-lg px-3 py-2 bg-gray-50"
                readOnly
              />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border p-6 border-l-4 border-l-orange-800">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Business Defaults</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Default Tax Rate (%)</label>
              <input
                type="number"
                step="0.1"
                value={userSettings.default_tax_rate}
                className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-orange-500"
              />
            </div>
            <div className="bg-orange-50 p-3 rounded border">
              <p className="text-sm text-orange-800">
                <strong>Markup Protection:</strong> Your markup rates are automatically hidden from client-facing documents for competitive advantage.
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border p-6 border-l-4 border-l-orange-800">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">PDF Template</h2>
          <div className="border-2 border-dashed border-orange-300 rounded-lg p-6 text-center bg-orange-50">
            <Upload className="w-8 h-8 text-orange-600 mx-auto mb-2" />
            <p className="text-sm text-gray-600 mb-2">Your Blackston invoice template is ready</p>
            <div className="text-xs text-orange-800 bg-white px-2 py-1 rounded">
              Template: Blackston_Invoice.pdf ✓
            </div>
          </div>
          <p className="text-xs text-gray-500 mt-2">
            The system uses your branded template to generate professional estimates with your logo, colors, and contact information.
          </p>
        </div>

        <div className="bg-white rounded-lg shadow-sm border p-6 border-l-4 border-l-orange-800">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Service Types</h2>
          <div className="space-y-2">
            {userSettings.custom_job_types.map((jobType, index) => (
              <div key={index} className="flex justify-between items-center bg-orange-50 px-3 py-2 rounded">
                <span>{jobType}</span>
                <span className="text-xs text-orange-600">Active</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );

  // User Guide
  const Guide = () => (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-900">User Guide</h1>
      
      <div className="bg-white rounded-lg shadow-sm border p-6 border-l-4 border-l-orange-800">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Welcome to Blackston EstimatePro</h2>
        
        <div className="space-y-6">
          <div>
            <h3 className="text-lg font-semibold text-gray-800 mb-2">Getting Started</h3>
            <p className="text-gray-600 mb-4">
              Your EstimatePro system is configured for Blackston Handyman Services with your branding, contact information, and business practices.
            </p>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold text-gray-800 mb-2">Creating Estimates</h3>
            <ol className="list-decimal list-inside text-gray-600 space-y-2">
              <li>Click "New Estimate" from the Dashboard or Estimates page</li>
              <li>Fill in job details and select your client</li>
              <li>Choose from your service types (Kitchen, Bathroom, Handyman, etc.)</li>
              <li>Use "AI Generate" to create professional scope descriptions</li>
              <li>Add materials and labor with automatic calculations</li>
              <li>Review totals with tax automatically calculated</li>
              <li>Generate PDF using your Blackston template</li>
              <li>Send directly to client via email</li>
            </ol>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold text-gray-800 mb-2">Key Features</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-orange-50 p-4 rounded">
                <h4 className="font-semibold text-orange-900 mb-2">Professional PDFs</h4>
                <p className="text-orange-800 text-sm">Automatically generates estimates using your Blackston template with logo and branding</p>
              </div>
              <div className="bg-orange-50 p-4 rounded">
                <h4 className="font-semibold text-orange-900 mb-2">AI Scope Generation</h4>
                <p className="text-orange-800 text-sm">Creates professional work descriptions based on your service type</p>
              </div>
              <div className="bg-orange-50 p-4 rounded">
                <h4 className="font-semibold text-orange-900 mb-2">Email Integration</h4>
                <p className="text-orange-800 text-sm">Send estimates directly to clients with professional messaging</p>
              </div>
              <div className="bg-orange-50 p-4 rounded">
                <h4 className="font-semibold text-orange-900 mb-2">Client Management</h4>
                <p className="text-orange-800 text-sm">Store customer information for quick estimate generation</p>
              </div>
            </div>
          </div>
          
          <div className="bg-gray-50 p-4 rounded">
            <h3 className="text-lg font-semibold text-gray-800 mb-2">Support</h3>
            <p className="text-gray-600">
              For questions about using EstimatePro or technical support, contact your system administrator.
            </p>
          </div>
        </div>
      </div>
    </div>
  );

  // Main render function
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

export default App;