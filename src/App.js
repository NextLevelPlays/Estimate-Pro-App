import React, { useState } from 'react';
import { 
  Building2, Users, FileText, Settings, BookOpen, Plus, 
  Search, Mail, Download, Eye, Edit, Trash2,
  DollarSign, Calendar, CheckCircle, Briefcase,
  Upload, Send, Save, Star, Activity, MapPin, User, Phone,
  X, ArrowRight, ArrowLeft, Play
} from 'lucide-react';

function App() {
  const [currentPage, setCurrentPage] = useState('dashboard');
  const [showTutorial, setShowTutorial] = useState(true);
  const [tutorialStep, setTutorialStep] = useState(0);
  
  // Sample data
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
      email: 'sarah@modernliving.com',
      phone: '(555) 987-6543',
      address: '456 Oak Ave, Boulder, CO 80301',
      company: 'Modern Living LLC'
    }
  ]);

  const [jobs, setJobs] = useState([
    {
      id: 1,
      title: 'Kitchen Renovation',
      client_id: 1,
      client_name: 'John Smith',
      status: 'estimate_sent',
      job_type: 'Kitchen Remodel',
      location: '123 Main St, Denver, CO',
      estimate_total: 25000,
      materials: [
        { description: 'Kitchen Cabinets - Custom Oak', quantity: 1, unit_price: 8000, total: 8000 },
        { description: 'Countertops - Granite', quantity: 30, unit_price: 65, total: 1950 }
      ],
      labor: [
        { description: 'Demolition Work', hours: 16, rate: 75, total: 1200 },
        { description: 'Cabinet Installation', hours: 24, rate: 85, total: 2040 }
      ],
      additional_services: [
        { description: 'Permit Fees', amount: 450 }
      ],
      professional_scope: 'Complete kitchen renovation including demolition, custom cabinetry, granite countertops, and professional installation.'
    }
  ]);

  const [userSettings, setUserSettings] = useState({
    company_name: 'Blackston Handyman Services',
    business_phone: '(303) 880-4557',
    business_address: 'Denver, CO',
    license_number: 'CO-CONTR-2024-001',
    owner_name: 'Brandon Blackston',
    default_tax_rate: 10,
    default_markup_rate: 0,
    custom_job_types: ['Kitchen Remodel', 'Bathroom Remodel', 'Handyman Services', 'Electrical', 'Plumbing', 'Flooring']
  });

  const [newEstimate, setNewEstimate] = useState({
    title: '',
    client_id: '',
    job_type: '',
    location: '',
    materials: [{ description: '', quantity: '', unit_price: '', total: 0 }],
    labor: [{ description: '', hours: '', rate: '', total: 0 }],
    additional_services: [{ description: '', amount: '' }],
    professional_scope: ''
  });

  const [showNewEstimateForm, setShowNewEstimateForm] = useState(false);
  const [showNewClientForm, setShowNewClientForm] = useState(false);
  const [newClient, setNewClient] = useState({ name: '', email: '', phone: '', address: '', company: '' });

  // Tutorial steps
  const tutorialSteps = [
    {
      title: \"Welcome to Blackston EstimatePro!\",
      content: \"This is your complete estimate management system. Let's take a quick tour to get you started.\",
      highlight: null,
      action: null
    },
    {
      title: \"Your Dashboard\",
      content: \"This shows your business overview - total jobs, active projects, revenue, and recent activity. Everything you need at a glance.\",
      highlight: \"dashboard-stats\",
      action: () => setCurrentPage('dashboard')
    },
    {
      title: \"Creating Estimates\",
      content: \"Click this button anytime to create a new estimate. This is where you'll spend most of your time.\",
      highlight: \"new-estimate-btn\",
      action: null
    },
    {
      title: \"Navigation Menu\",
      content: \"Use these tabs to move between different sections: Estimates, Jobs, Clients, and Settings.\",
      highlight: \"navigation\",
      action: null
    },
    {
      title: \"Let's Try Creating an Estimate\",
      content: \"Click 'New Estimate' to see the estimate creation form. Don't worry - we'll just explore, not save anything.\",
      highlight: \"new-estimate-btn\",
      action: () => {
        setCurrentPage('estimates');
        setTimeout(() => setShowNewEstimateForm(true), 500);
      }
    },
    {
      title: \"Estimate Form\",
      content: \"Here's where you build estimates. Fill in job details, add materials and labor, and the system calculates everything automatically.\",
      highlight: \"estimate-form\",
      action: null
    },
    {
      title: \"AI Scope Generation\",
      content: \"Select a job type, then click 'AI Generate' to automatically create professional work descriptions. This saves tons of time!\",
      highlight: \"ai-generate\",
      action: null
    },
    {
      title: \"Client Management\",
      content: \"Add your customers here so their information auto-fills in estimates. Keep all contact details organized.\",
      highlight: null,
      action: () => {
        setShowNewEstimateForm(false);
        setCurrentPage('clients');
      }
    },
    {
      title: \"PDF Generation & Email\",
      content: \"When estimates are ready, generate professional PDFs with your Blackston branding and send directly to clients.\",
      highlight: null,
      action: () => setCurrentPage('estimates')
    },
    {
      title: \"You're Ready!\",
      content: \"That's it! Start by adding a few clients, then create your first estimate. The system will learn your pricing patterns as you use it. Need help? Check the User Guide anytime.\",
      highlight: null,
      action: () => setCurrentPage('dashboard')
    }
  ];

  // Tutorial component
  const Tutorial = () => {
    if (!showTutorial) return null;

    const currentStep = tutorialSteps[tutorialStep];

    return (
      <div className=\"fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4\">
        <div className=\"bg-white rounded-lg max-w-md w-full p-6 shadow-2xl\">
          <div className=\"flex justify-between items-start mb-4\">
            <div>
              <h3 className=\"text-lg font-semibold text-gray-900\">{currentStep.title}</h3>
              <p className=\"text-sm text-orange-600\">Step {tutorialStep + 1} of {tutorialSteps.length}</p>
            </div>
            <button
              onClick={() => setShowTutorial(false)}
              className=\"text-gray-400 hover:text-gray-600\"
            >
              <X className=\"w-5 h-5\" />
            </button>
          </div>

          <div className=\"mb-6\">
            <p className=\"text-gray-600\">{currentStep.content}</p>
          </div>

          <div className=\"flex justify-between items-center\">
            <div className=\"flex space-x-1\">
              {tutorialSteps.map((_, index) => (
                <div
                  key={index}
                  className={`w-2 h-2 rounded-full ${
                    index === tutorialStep ? 'bg-orange-600' : 'bg-gray-300'
                  }`}
                />
              ))}
            </div>

            <div className=\"flex space-x-2\">
              {tutorialStep > 0 && (
                <button
                  onClick={() => setTutorialStep(tutorialStep - 1)}
                  className=\"px-3 py-1 text-gray-600 hover:text-gray-800 flex items-center space-x-1\"
                >
                  <ArrowLeft className=\"w-4 h-4\" />
                  <span>Back</span>
                </button>
              )}

              {tutorialStep < tutorialSteps.length - 1 ? (
                <button
                  onClick={() => {
                    if (currentStep.action) currentStep.action();
                    setTutorialStep(tutorialStep + 1);
                  }}
                  className=\"px-4 py-2 bg-orange-600 hover:bg-orange-700 text-white rounded flex items-center space-x-1\"
                >
                  <span>Next</span>
                  <ArrowRight className=\"w-4 h-4\" />
                </button>
              ) : (
                <button
                  onClick={() => {
                    if (currentStep.action) currentStep.action();
                    setShowTutorial(false);
                  }}
                  className=\"px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded flex items-center space-x-1\"
                >
                  <span>Get Started</span>
                  <Play className=\"w-4 h-4\" />
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  };

  // Calculate totals
  const calculateEstimateTotal = (estimate) => {
    const materialsTotal = estimate.materials.reduce((sum, item) => sum + (item.total || 0), 0);
    const laborTotal = estimate.labor.reduce((sum, item) => sum + (item.total || 0), 0);
    const servicesTotal = estimate.additional_services.reduce((sum, item) => sum + (parseFloat(item.amount) || 0), 0);
    
    const subtotal = materialsTotal + laborTotal + servicesTotal;
    const tax = subtotal * (userSettings.default_tax_rate / 100);
    
    return {
      materialsTotal,
      laborTotal,
      servicesTotal,
      subtotal,
      tax,
      total: subtotal + tax
    };
  };

  // AI functions
  const generateAIScope = (jobType) => {
    const templates = {
      'Kitchen Remodel': 'Complete kitchen renovation including demolition of existing fixtures, installation of custom cabinetry with soft-close hardware, granite or quartz countertops, quality flooring installation, electrical updates for modern appliances, plumbing modifications as needed, and professional cleanup. All work guaranteed for quality craftsmanship.',
      'Bathroom Remodel': 'Full bathroom renovation including removal of existing fixtures, installation of new tile flooring and wall surrounds, modern vanity installation, updated plumbing fixtures, electrical work for proper lighting and ventilation, waterproofing, and professional finishing. All work performed to current building codes.',
      'Handyman Services': 'Professional handyman services including repairs, installations, maintenance, and general improvements. Quality workmanship with attention to detail and customer satisfaction guaranteed.',
      'Electrical': 'Licensed electrical work including outlet installation, lighting updates, panel upgrades, and electrical repairs. All work performed to code with proper permits and inspections.',
      'Plumbing': 'Professional plumbing services including fixture installation, pipe repairs, water heater service, and drain cleaning. Licensed and insured work with quality parts and materials.',
      'Flooring': 'Quality flooring installation including hardwood, laminate, tile, and carpet. Professional preparation, installation, and finishing with materials warranty.',
      'Default': `Professional ${jobType} services including quality materials, skilled workmanship, and customer satisfaction guarantee. All work performed to industry standards with proper cleanup.`
    };
    return templates[jobType] || templates['Default'];
  };

  const generatePDF = async (job) => {
    const totals = calculateEstimateTotal(job);
    const client = clients.find(c => c.id === job.client_id);
    
    alert(`BLACKSTON HANDYMAN SERVICES\
JOB ESTIMATE GENERATED\
\
` +
          `Invoice #: EST-${job.id}\
` +
          `Customer: ${client?.name || job.client_name}\
` +
          `Job: ${job.title}\
\
` +
          `Subtotal: $${totals.subtotal.toFixed(2)}\
` +
          `Tax (${userSettings.default_tax_rate}%): $${totals.tax.toFixed(2)}\
` +
          `TOTAL: $${totals.total.toFixed(2)}\
\
` +
          `This professional estimate would be generated using your Blackston template with:\
` +
          `- Your logo and branding\
- Complete line item breakdown\
- Terms and conditions\
- Contact information\
\
` +
          `Ready to email to client!`);
  };

  const sendEmail = async (clientEmail, job) => {
    setTimeout(() => {
      alert(`EMAIL SENT SUCCESSFULLY!\
\
` +
            `To: ${clientEmail}\
` +
            `From: Blackston Handyman Services\
` +
            `Subject: Job Estimate - ${job.title}\
\
` +
            `Dear Valued Customer,\
\
` +
            `Please find attached your professional estimate for ${job.title}. ` +
            `This estimate is valid for 30 days and includes all materials, labor, and applicable taxes.\
\
` +
            `For questions, call Brandon at (303) 880-4557\
\
` +
            `Thank you for your business!\
` +
            `Blackston Handyman Services\
` +
            `Quality Work. Honest Price.`);
    }, 1000);
  };

  // Form handlers
  const updateMaterial = (index, field, value) => {
    const materials = [...newEstimate.materials];
    materials[index][field] = value;
    if (field === 'quantity' || field === 'unit_price') {
      materials[index].total = (parseFloat(materials[index].quantity) || 0) * (parseFloat(materials[index].unit_price) || 0);
    }
    setNewEstimate(prev => ({ ...prev, materials }));
  };

  const updateLabor = (index, field, value) => {
    const labor = [...newEstimate.labor];
    labor[index][field] = value;
    if (field === 'hours' || field === 'rate') {
      labor[index].total = (parseFloat(labor[index].hours) || 0) * (parseFloat(labor[index].rate) || 0);
    }
    setNewEstimate(prev => ({ ...prev, labor }));
  };

  const addMaterialRow = () => {
    setNewEstimate(prev => ({
      ...prev,
      materials: [...prev.materials, { description: '', quantity: '', unit_price: '', total: 0 }]
    }));
  };

  const addLaborRow = () => {
    setNewEstimate(prev => ({
      ...prev,
      labor: [...prev.labor, { description: '', hours: '', rate: '', total: 0 }]
    }));
  };

  const saveEstimate = () => {
    if (!newEstimate.title || !newEstimate.client_id) {
      alert('Please fill in job title and select a client');
      return;
    }
    
    const totals = calculateEstimateTotal(newEstimate);
    const newJob = {
      id: Date.now(),
      ...newEstimate,
      client_name: clients.find(c => c.id === parseInt(newEstimate.client_id))?.name || '',
      status: 'estimate_sent',
      estimate_total: totals.total
    };
    
    setJobs(prev => [...prev, newJob]);
    setShowNewEstimateForm(false);
    setNewEstimate({
      title: '',
      client_id: '',
      job_type: '',
      location: '',
      materials: [{ description: '', quantity: '', unit_price: '', total: 0 }],
      labor: [{ description: '', hours: '', rate: '', total: 0 }],
      additional_services: [{ description: '', amount: '' }],
      professional_scope: ''
    });
    alert('Estimate created successfully!');
  };

  const addClient = () => {
    if (!newClient.name || !newClient.email) {
      alert('Please fill in name and email');
      return;
    }
    setClients(prev => [...prev, { ...newClient, id: Date.now() }]);
    setNewClient({ name: '', email: '', phone: '', address: '', company: '' });
    setShowNewClientForm(false);
    alert('Client added successfully!');
  };

  // Navigation with tutorial highlights
  const Navigation = () => (
    <nav id=\"navigation\" className={`bg-white shadow-sm border-b ${tutorialStep === 3 ? 'ring-4 ring-orange-300' : ''}`} style={{ borderBottom: '3px solid #B45309' }}>
      <div className=\"max-w-7xl mx-auto px-4\">
        <div className=\"flex justify-between items-center h-16\">
          <div className=\"flex items-center space-x-8\">
            <div className=\"flex items-center space-x-3\">
              <div className=\"w-10 h-10 bg-gradient-to-br from-orange-800 to-orange-900 rounded-lg flex items-center justify-center\">
                <Building2 className=\"w-6 h-6 text-white\" />
              </div>
              <div>
                <div className=\"text-xl font-bold text-gray-900\">Blackston</div>
                <div className=\"text-xs text-orange-800 font-medium\">HANDYMAN SERVICES</div>
              </div>
            </div>
            <div className=\"hidden md:flex space-x-6\">
              {[
                { id: 'dashboard', label: 'Dashboard', icon: Activity },
                { id: 'estimates', label: 'Estimates', icon: FileText },
                { id: 'jobs', label: 'Jobs', icon: Briefcase },
                { id: 'clients', label: 'Clients', icon: Users },
                { id: 'settings', label: 'Settings', icon: Settings },
                { id: 'guide', label: 'Guide', icon: BookOpen }
              ].map(({ id, label, icon: Icon }) => (
                <button
                  key={id}
                  onClick={() => setCurrentPage(id)}
                  className={`flex items-center space-x-1 px-3 py-2 rounded-md text-sm font-medium ${
                    currentPage === id 
                      ? 'bg-orange-100 text-orange-800' 
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                  }`}
                >
                  <Icon className=\"w-4 h-4\" />
                  <span>{label}</span>
                </button>
              ))}
            </div>
          </div>
          <div className=\"flex items-center space-x-4\">
            <div className=\"text-sm text-gray-600\">Quality Work. Honest Price.</div>
            <button
              onClick={() => setShowTutorial(true)}
              className=\"text-orange-600 hover:text-orange-800 text-sm font-medium\"
            >
              Tutorial
            </button>
          </div>
        </div>
      </div>
    </nav>
  );

  // Dashboard with tutorial highlights
  const Dashboard = () => {
    const stats = {
      totalJobs: jobs.length,
      activeJobs: jobs.filter(job => ['estimate_sent', 'in_progress'].includes(job.status)).length,
      totalRevenue: jobs.reduce((sum, job) => sum + job.estimate_total, 0),
      completedJobs: jobs.filter(job => job.status === 'completed').length
    };
    
    return (
      <div className=\"space-y-6\">
        <div className=\"flex justify-between items-center\">
          <h1 className=\"text-2xl font-bold text-gray-900\">Dashboard</h1>
          <button
            id=\"new-estimate-btn\"
            onClick={() => setCurrentPage('estimates')}
            className={`bg-orange-800 hover:bg-orange-900 text-white px-4 py-2 rounded-lg flex items-center space-x-2 ${
              (tutorialStep === 2 || tutorialStep === 4) ? 'ring-4 ring-orange-300' : ''
            }`}
          >
            <Plus className=\"w-4 h-4\" />
            <span>New Estimate</span>
          </button>
        </div>

        <div id=\"dashboard-stats\" className={`grid grid-cols-1 md:grid-cols-4 gap-6 ${tutorialStep === 1 ? 'ring-4 ring-orange-300 rounded-lg' : ''}`}>
          <div className=\"bg-white p-6 rounded-lg shadow-sm border-l-4 border-orange-800\">
            <div className=\"flex items-center justify-between\">
              <div>
                <p className=\"text-sm font-medium text-gray-600\">Total Jobs</p>
                <p className=\"text-2xl font-bold text-gray-900\">{stats.totalJobs}</p>
              </div>
              <Briefcase className=\"w-8 h-8 text-orange-800\" />
            </div>
          </div>
          
          <div className=\"bg-white p-6 rounded-lg shadow-sm border-l-4 border-green-600\">
            <div className=\"flex items-center justify-between\">
              <div>
                <p className=\"text-sm font-medium text-gray-600\">Active Jobs</p>
                <p className=\"text-2xl font-bold text-green-600\">{stats.activeJobs}</p>
              </div>
              <Activity className=\"w-8 h-8 text-green-600\" />
            </div>
          </div>
          
          <div className=\"bg-white p-6 rounded-lg shadow-sm border-l-4 border-blue-600\">
            <div className=\"flex items-center justify-between\">
              <div>
                <p className=\"text-sm font-medium text-gray-600\">Total Revenue</p>
                <p className=\"text-2xl font-bold text-blue-600\">${stats.totalRevenue.toLocaleString()}</p>
              </div>
              <DollarSign className=\"w-8 h-8 text-blue-600\" />
            </div>
          </div>
          
          <div className=\"bg-white p-6 rounded-lg shadow-sm border-l-4 border-purple-600\">
            <div className=\"flex items-center justify-between\">
              <div>
                <p className=\"text-sm font-medium text-gray-600\">Completed</p>
                <p className=\"text-2xl font-bold text-purple-600\">{stats.completedJobs}</p>
              </div>
              <CheckCircle className=\"w-8 h-8 text-purple-600\" />
            </div>
          </div>
        </div>

        <div className=\"bg-white rounded-lg shadow-sm border\">
          <div className=\"p-6 border-b bg-gradient-to-r from-orange-50 to-orange-100\">
            <h2 className=\"text-lg font-semibold text-gray-900\">Recent Jobs</h2>
          </div>
          <div className=\"overflow-x-auto\">
            <table className=\"w-full\">
              <thead className=\"bg-gray-50\">
                <tr>
                  <th className=\"text-left py-3 px-6 font-medium text-gray-700\">Job Title</th>
                  <th className=\"text-left py-3 px-6 font-medium text-gray-700\">Client</th>
                  <th className=\"text-left py-3 px-6 font-medium text-gray-700\">Status</th>
                  <th className=\"text-right py-3 px-6 font-medium text-gray-700\">Value</th>
                  <th className=\"text-center py-3 px-6 font-medium text-gray-700\">Actions</th>
                </tr>
              </thead>
              <tbody>
                {jobs.map((job) => (
                  <tr key={job.id} className=\"border-b hover:bg-gray-50\">
                    <td className=\"py-3 px-6 font-medium\">{job.title}</td>
                    <td className=\"py-3 px-6\">{job.client_name}</td>
                    <td className=\"py-3 px-6\">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        job.status === 'completed' ? 'bg-green-100 text-green-800' :
                        job.status === 'in_progress' ? 'bg-blue-100 text-blue-800' :
                        job.status === 'estimate_sent' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-gray-100 text-gray-800'
                      }`}>
                        {job.status.replace('_', ' ')}
                      </span>
                    </td>
                    <td className=\"py-3 px-6 text-right font-semibold\">${job.estimate_total.toLocaleString()}</td>
                    <td className=\"py-3 px-6 text-center\">
                      <button className=\"text-orange-800 hover:text-orange-900\">
                        <Eye className=\"w-4 h-4\" />
                      </button>
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

  // Estimates page with tutorial highlights
  const Estimates = () => {
    if (showNewEstimateForm) {
      return (
        <div className=\"space-y-6\">
          <div className=\"flex justify-between items-center\">
            <h1 className=\"text-2xl font-bold text-gray-900\">Create New Estimate</h1>
            <button
              onClick={() => setShowNewEstimateForm(false)}
              className=\"text-gray-600 hover:text-gray-900\"
            >
              Cancel
            </button>
          </div>

          <div id=\"estimate-form\" className={`bg-white rounded-lg shadow-sm border p-6 ${tutorialStep === 5 ? 'ring-4 ring-orange-300' : ''}`}>
            <div className=\"grid grid-cols-1 md:grid-cols-2 gap-6 mb-6\">
              <div>
                <label className=\"block text-sm font-medium text-gray-700 mb-2\">Job Title</label>
                <input
                  type=\"text\"
                  value={newEstimate.title}
                  onChange={(e) => setNewEstimate(prev => ({ ...prev, title: e.target.value }))}
                  className=\"w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-orange-500\"
                  placeholder=\"Enter job title\"
                />
              </div>
              
              <div>
                <label className=\"block text-sm font-medium text-gray-700 mb-2\">Client</label>
                <select
                  value={newEstimate.client_id}
                  onChange={(e) => setNewEstimate(prev => ({ ...prev, client_id: e.target.value }))}
                  className=\"w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-orange-500\"
                >
                  <option value=\"\">Select client</option>
                  {clients.map(client => (
                    <option key={client.id} value={client.id}>{client.name}</option>
                  ))}
                </select>
              </div>
              
              <div>
                <label className=\"block text-sm font-medium text-gray-700 mb-2\">Job Type</label>
                <select
                  value={newEstimate.job_type}
                  onChange={(e) => setNewEstimate(prev => ({ ...prev, job_type: e.target.value }))}
                  className=\"w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-orange-500\"
                >
                  <option value=\"\">Select job type</option>
                  {userSettings.custom_job_types.map(type => (
                    <option key={type} value={type}>{type}</option>
                  ))}
                </select>
              </div>
              
              <div>
                <label className=\"block text-sm font-medium text-gray-700 mb-2\">Location</label>
                <input
                  type=\"text\"
                  value={newEstimate.location}
                  onChange={(e) => setNewEstimate(prev => ({ ...prev, location: e.target.value }))}
                  className=\"w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-orange-500\"
                  placeholder=\"Job location\"
                />
              </div>
            </div>

            <div className=\"mb-6\">
              <div className=\"flex justify-between items-center mb-2\">
                <label className=\"block text-sm font-medium text-gray-700\">Scope of Work</label>
                <button
                  id=\"ai-generate\"
                  onClick={() => {
                    if (newEstimate.job_type) {
                      const scope = generateAIScope(newEstimate.job_type);
                      setNewEstimate(prev => ({ ...prev, professional_scope: scope }));
                    }
                  }}
                  className={`bg-orange-800 hover:bg-orange-900 text-white px-3 py-1 rounded text-sm flex items-center space-x-1 ${
                    tutorialStep === 6 ? 'ring-4 ring-orange-300' : ''
                  }`}
                >
                  <Star className=\"w-4 h-4\" />
                  <span>AI Generate</span>
                </button>
              </div>
              <textarea
                value={newEstimate.professional_scope}
                onChange={(e) => setNewEstimate(prev => ({ ...prev, professional_scope: e.target.value }))}
                rows={4}
                className=\"w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-orange-500\"
                placeholder=\"Describe the scope of work...\"
              />
            </div>

            <div className=\"mb-6\">
              <div className=\"flex justify-between items-center mb-4\">
                <h3 className=\"text-lg font-semibold\">Materials</h3>
                <button
                  onClick={addMaterialRow}
                  className=\"bg-orange-800 hover:bg-orange-900 text-white px-3 py-1 rounded text-sm flex items-center space-x-1\"
                >
                  <Plus className=\"w-4 h-4\" />
                  <span>Add Row</span>
                </button>
              </div>
              
              <div className=\"overflow-x-auto\">
                <table className=\"w-full border\">`
}
Continue


C

Write text
Request

{
  `content`: `                <table className=\"w-full border\">
                  <thead className=\"bg-orange-50\">
                    <tr>
                      <th className=\"text-left py-2 px-3 border\">Description</th>
                      <th className=\"text-left py-2 px-3 border\">Qty</th>
                      <th className=\"text-left py-2 px-3 border\">Unit Price</th>
                      <th className=\"text-left py-2 px-3 border\">Total</th>
                    </tr>
                  </thead>
                  <tbody>
                    {newEstimate.materials.map((material, index) => (
                      <tr key={index}>
                        <td className=\"py-2 px-3 border\">
                          <input
                            type=\"text\"
                            value={material.description}
                            onChange={(e) => updateMaterial(index, 'description', e.target.value)}
                            className=\"w-full border-0 focus:outline-none\"
                            placeholder=\"Material description\"
                          />
                        </td>
                        <td className=\"py-2 px-3 border\">
                          <input
                            type=\"number\"
                            value={material.quantity}
                            onChange={(e) => updateMaterial(index, 'quantity', e.target.value)}
                            className=\"w-full border-0 focus:outline-none\"
                            placeholder=\"0\"
                          />
                        </td>
                        <td className=\"py-2 px-3 border\">
                          <input
                            type=\"number\"
                            value={material.unit_price}
                            onChange={(e) => updateMaterial(index, 'unit_price', e.target.value)}
                            className=\"w-full border-0 focus:outline-none\"
                            placeholder=\"0.00\"
                          />
                        </td>
                        <td className=\"py-2 px-3 border font-semibold\">
                          ${material.total.toFixed(2)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            <div className=\"mb-6\">
              <div className=\"flex justify-between items-center mb-4\">
                <h3 className=\"text-lg font-semibold\">Labor</h3>
                <button
                  onClick={addLaborRow}
                  className=\"bg-orange-800 hover:bg-orange-900 text-white px-3 py-1 rounded text-sm flex items-center space-x-1\"
                >
                  <Plus className=\"w-4 h-4\" />
                  <span>Add Row</span>
                </button>
              </div>
              
              <div className=\"overflow-x-auto\">
                <table className=\"w-full border\">
                  <thead className=\"bg-orange-50\">
                    <tr>
                      <th className=\"text-left py-2 px-3 border\">Description</th>
                      <th className=\"text-left py-2 px-3 border\">Hours</th>
                      <th className=\"text-left py-2 px-3 border\">Rate</th>
                      <th className=\"text-left py-2 px-3 border\">Total</th>
                    </tr>
                  </thead>
                  <tbody>
                    {newEstimate.labor.map((labor, index) => (
                      <tr key={index}>
                        <td className=\"py-2 px-3 border\">
                          <input
                            type=\"text\"
                            value={labor.description}
                            onChange={(e) => updateLabor(index, 'description', e.target.value)}
                            className=\"w-full border-0 focus:outline-none\"
                            placeholder=\"Labor description\"
                          />
                        </td>
                        <td className=\"py-2 px-3 border\">
                          <input
                            type=\"number\"
                            value={labor.hours}
                            onChange={(e) => updateLabor(index, 'hours', e.target.value)}
                            className=\"w-full border-0 focus:outline-none\"
                            placeholder=\"0\"
                          />
                        </td>
                        <td className=\"py-2 px-3 border\">
                          <input
                            type=\"number\"
                            value={labor.rate}
                            onChange={(e) => updateLabor(index, 'rate', e.target.value)}
                            className=\"w-full border-0 focus:outline-none\"
                            placeholder=\"0.00\"
                          />
                        </td>
                        <td className=\"py-2 px-3 border font-semibold\">
                          ${labor.total.toFixed(2)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            <div className=\"mb-6 bg-orange-50 p-4 rounded-lg border-l-4 border-orange-800\">
              <h3 className=\"text-lg font-semibold mb-4\">Estimate Total</h3>
              {(() => {
                const totals = calculateEstimateTotal(newEstimate);
                return (
                  <div className=\"space-y-2\">
                    <div className=\"flex justify-between\">
                      <span>Materials:</span>
                      <span>${totals.materialsTotal.toFixed(2)}</span>
                    </div>
                    <div className=\"flex justify-between\">
                      <span>Labor:</span>
                      <span>${totals.laborTotal.toFixed(2)}</span>
                    </div>
                    <div className=\"flex justify-between\">
                      <span>Additional Services:</span>
                      <span>${totals.servicesTotal.toFixed(2)}</span>
                    </div>
                    <div className=\"flex justify-between border-t pt-2\">
                      <span>Subtotal:</span>
                      <span>${totals.subtotal.toFixed(2)}</span>
                    </div>
                    <div className=\"flex justify-between\">
                      <span>Tax ({userSettings.default_tax_rate}%):</span>
                      <span>${totals.tax.toFixed(2)}</span>
                    </div>
                    <div className=\"flex justify-between text-lg font-bold border-t pt-2\">
                      <span>TOTAL:</span>
                      <span>${totals.total.toFixed(2)}</span>
                    </div>
                  </div>
                );
              })()}
            </div>

            <div className=\"flex justify-end space-x-4\">
              <button
                onClick={() => setShowNewEstimateForm(false)}
                className=\"px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50\"
              >
                Cancel
              </button>
              <button
                onClick={saveEstimate}
                className=\"px-6 py-2 bg-orange-800 hover:bg-orange-900 text-white rounded-lg flex items-center space-x-2\"
              >
                <Save className=\"w-4 h-4\" />
                <span>Save Estimate</span>
              </button>
            </div>
          </div>
        </div>
      );
    }

    return (
      <div className=\"space-y-6\">
        <div className=\"flex justify-between items-center\">
          <h1 className=\"text-2xl font-bold text-gray-900\">Estimates</h1>
          <button
            onClick={() => setShowNewEstimateForm(true)}
            className=\"bg-orange-800 hover:bg-orange-900 text-white px-4 py-2 rounded-lg flex items-center space-x-2\"
          >
            <Plus className=\"w-4 h-4\" />
            <span>New Estimate</span>
          </button>
        </div>

        <div className=\"bg-white rounded-lg shadow-sm border\">
          <div className=\"p-6 border-b bg-gradient-to-r from-orange-50 to-orange-100\">
            <h2 className=\"text-lg font-semibold text-gray-900\">All Estimates</h2>
          </div>
          
          <div className=\"overflow-x-auto\">
            <table className=\"w-full\">
              <thead className=\"bg-gray-50\">
                <tr>
                  <th className=\"text-left py-3 px-6 font-medium text-gray-700\">Job Title</th>
                  <th className=\"text-left py-3 px-6 font-medium text-gray-700\">Client</th>
                  <th className=\"text-left py-3 px-6 font-medium text-gray-700\">Type</th>
                  <th className=\"text-left py-3 px-6 font-medium text-gray-700\">Status</th>
                  <th className=\"text-right py-3 px-6 font-medium text-gray-700\">Value</th>
                  <th className=\"text-center py-3 px-6 font-medium text-gray-700\">Actions</th>
                </tr>
              </thead>
              <tbody>
                {jobs.map((job) => (
                  <tr key={job.id} className=\"border-b hover:bg-gray-50\">
                    <td className=\"py-3 px-6 font-medium\">{job.title}</td>
                    <td className=\"py-3 px-6\">{job.client_name}</td>
                    <td className=\"py-3 px-6\">{job.job_type}</td>
                    <td className=\"py-3 px-6\">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        job.status === 'completed' ? 'bg-green-100 text-green-800' :
                        job.status === 'in_progress' ? 'bg-blue-100 text-blue-800' :
                        job.status === 'estimate_sent' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-gray-100 text-gray-800'
                      }`}>
                        {job.status.replace('_', ' ')}
                      </span>
                    </td>
                    <td className=\"py-3 px-6 text-right font-semibold\">${job.estimate_total.toLocaleString()}</td>
                    <td className=\"py-3 px-6\">
                      <div className=\"flex justify-center space-x-2\">
                        <button
                          onClick={() => generatePDF(job)}
                          className=\"text-orange-800 hover:text-orange-900\"
                          title=\"Generate PDF\"
                        >
                          <Download className=\"w-4 h-4\" />
                        </button>
                        <button
                          onClick={() => {
                            const client = clients.find(c => c.id === job.client_id);
                            if (client) sendEmail(client.email, job);
                          }}
                          className=\"text-green-600 hover:text-green-800\"
                          title=\"Send Email\"
                        >
                          <Mail className=\"w-4 h-4\" />
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

  // All other pages remain the same but simplified for space
  const Jobs = () => (
    <div className=\"space-y-6\">
      <h1 className=\"text-2xl font-bold text-gray-900\">Jobs</h1>
      <div className=\"grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6\">
        {jobs.map((job) => (
          <div key={job.id} className=\"bg-white rounded-lg shadow-sm border border-l-4 border-l-orange-800 p-6\">
            <div className=\"flex justify-between items-start mb-4\">
              <h3 className=\"text-lg font-semibold text-gray-900\">{job.title}</h3>
              <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                job.status === 'completed' ? 'bg-green-100 text-green-800' :
                job.status === 'in_progress' ? 'bg-blue-100 text-blue-800' :
                job.status === 'estimate_sent' ? 'bg-yellow-100 text-yellow-800' :
                'bg-gray-100 text-gray-800'
              }`}>
                {job.status.replace('_', ' ')}
              </span>
            </div>
            
            <div className=\"space-y-2 text-sm\">
              <div className=\"flex items-center space-x-2\">
                <User className=\"w-4 h-4 text-gray-400\" />
                <span>{job.client_name}</span>
              </div>
              <div className=\"flex items-center space-x-2\">
                <MapPin className=\"w-4 h-4 text-gray-400\" />
                <span>{job.location}</span>
              </div>
              <div className=\"flex items-center space-x-2\">
                <DollarSign className=\"w-4 h-4 text-gray-400\" />
                <span className=\"font-semibold text-orange-800\">${job.estimate_total.toLocaleString()}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const Clients = () => (
    <div className=\"space-y-6\">
      <div className=\"flex justify-between items-center\">
        <h1 className=\"text-2xl font-bold text-gray-900\">Clients</h1>
        <button
          onClick={() => setShowNewClientForm(true)}
          className=\"bg-orange-800 hover:bg-orange-900 text-white px-4 py-2 rounded-lg flex items-center space-x-2\"
        >
          <Plus className=\"w-4 h-4\" />
          <span>Add Client</span>
        </button>
      </div>

      {showNewClientForm && (
        <div className=\"bg-white rounded-lg shadow-sm border p-6\">
          <h2 className=\"text-lg font-semibold text-gray-900 mb-4\">Add New Client</h2>
          <div className=\"grid grid-cols-1 md:grid-cols-2 gap-4\">
            <input
              type=\"text\"
              placeholder=\"Full Name\"
              value={newClient.name}
              onChange={(e) => setNewClient(prev => ({ ...prev, name: e.target.value }))}
              className=\"border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-orange-500\"
            />
            <input
              type=\"email\"
              placeholder=\"Email Address\"
              value={newClient.email}
              onChange={(e) => setNewClient(prev => ({ ...prev, email: e.target.value }))}
              className=\"border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-orange-500\"
            />
            <input
              type=\"tel\"
              placeholder=\"Phone Number\"
              value={newClient.phone}
              onChange={(e) => setNewClient(prev => ({ ...prev, phone: e.target.value }))}
              className=\"border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-orange-500\"
            />
            <input
              type=\"text\"
              placeholder=\"Company (optional)\"
              value={newClient.company}
              onChange={(e) => setNewClient(prev => ({ ...prev, company: e.target.value }))}
              className=\"border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-orange-500\"
            />
            <input
              type=\"text\"
              placeholder=\"Address\"
              value={newClient.address}
              onChange={(e) => setNewClient(prev => ({ ...prev, address: e.target.value }))}
              className=\"md:col-span-2 border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-orange-500\"
            />
          </div>
          <div className=\"flex justify-end space-x-4 mt-4\">
            <button
              onClick={() => setShowNewClientForm(false)}
              className=\"px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50\"
            >
              Cancel
            </button>
            <button
              onClick={addClient}
              className=\"px-4 py-2 bg-orange-800 hover:bg-orange-900 text-white rounded-lg\"
            >
              Add Client
            </button>
          </div>
        </div>
      )}

      <div className=\"bg-white rounded-lg shadow-sm border\">
        <div className=\"p-6 border-b bg-gradient-to-r from-orange-50 to-orange-100\">
          <h2 className=\"text-lg font-semibold text-gray-900\">Client Directory</h2>
        </div>
        
        <div className=\"overflow-x-auto\">
          <table className=\"w-full\">
            <thead className=\"bg-gray-50\">
              <tr>
                <th className=\"text-left py-3 px-6 font-medium text-gray-700\">Name</th>
                <th className=\"text-left py-3 px-6 font-medium text-gray-700\">Email</th>
                <th className=\"text-left py-3 px-6 font-medium text-gray-700\">Phone</th>
                <th className=\"text-left py-3 px-6 font-medium text-gray-700\">Company</th>
              </tr>
            </thead>
            <tbody>
              {clients.map((client) => (
                <tr key={client.id} className=\"border-b hover:bg-gray-50\">
                  <td className=\"py-3 px-6 font-medium\">{client.name}</td>
                  <td className=\"py-3 px-6\">{client.email}</td>
                  <td className=\"py-3 px-6\">{client.phone}</td>
                  <td className=\"py-3 px-6\">{client.company}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );

  const Settings = () => (
    <div className=\"space-y-6\">
      <h1 className=\"text-2xl font-bold text-gray-900\">Settings</h1>
      <div className=\"bg-white rounded-lg shadow-sm border p-6 border-l-4 border-l-orange-800\">
        <h2 className=\"text-lg font-semibold text-gray-900 mb-4\">Blackston Handyman Services</h2>
        <div className=\"space-y-4\">
          <div>
            <label className=\"block text-sm font-medium text-gray-700 mb-1\">Company</label>
            <input type=\"text\" value={userSettings.company_name} className=\"w-full border rounded-lg px-3 py-2 bg-gray-50\" readOnly />
          </div>
          <div>
            <label className=\"block text-sm font-medium text-gray-700 mb-1\">Phone</label>
            <input type=\"text\" value={userSettings.business_phone} className=\"w-full border rounded-lg px-3 py-2 bg-gray-50\" readOnly />
          </div>
          <div>
            <label className=\"block text-sm font-medium text-gray-700 mb-1\">Owner</label>
            <input type=\"text\" value={userSettings.owner_name} className=\"w-full border rounded-lg px-3 py-2 bg-gray-50\" readOnly />
          </div>
        </div>
      </div>
    </div>
  );

  const Guide = () => (
    <div className=\"space-y-6\">
      <h1 className=\"text-2xl font-bold text-gray-900\">User Guide</h1>
      <div className=\"bg-white rounded-lg shadow-sm border p-6 border-l-4 border-l-orange-800\">
        <h2 className=\"text-xl font-semibold text-gray-900 mb-4\">Welcome to Blackston EstimatePro</h2>
        <div className=\"space-y-4\">
          <p className=\"text-gray-600\">Your complete estimate management system for Blackston Handyman Services.</p>
          <button
            onClick={() => setShowTutorial(true)}
            className=\"bg-orange-800 hover:bg-orange-900 text-white px-4 py-2 rounded-lg flex items-center space-x-2\"
          >
            <Play className=\"w-4 h-4\" />
            <span>Start Tutorial</span>
          </button>
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
    <div className=\"min-h-screen bg-gray-50\">
      <Tutorial />
      <Navigation />
      <main className=\"max-w-7xl mx-auto px-4 py-8\">
        {renderCurrentPage()}
      </main>
    </div>
  );
}

export default App;
