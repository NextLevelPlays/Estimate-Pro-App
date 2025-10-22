import React, { useState } from 'react';
import { 
  Building2, Users, FileText, Settings, BookOpen, Plus, 
  Search, Mail, Download, Eye, Edit, Trash2,
  DollarSign, Calendar, CheckCircle, Briefcase,
  Upload, Send, Save, Star, Activity, MapPin, User, Phone
} from 'lucide-react';

function App() {
  const [currentPage, setCurrentPage] = useState('dashboard');
  const [searchTerm, setSearchTerm] = useState('');
  
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
        { description: 'Kitchen Cabinets', quantity: 1, unit_price: 8000, total: 8000 },
        { description: 'Countertops - Quartz', quantity: 30, unit_price: 65, total: 1950 }
      ],
      labor: [
        { description: 'Demolition', hours: 16, rate: 75, total: 1200 },
        { description: 'Cabinet Installation', hours: 24, rate: 85, total: 2040 }
      ],
      additional_services: [
        { description: 'Permit Fees', amount: 450 }
      ],
      professional_scope: 'Complete kitchen renovation including demolition of existing cabinets and countertops, installation of new custom cabinetry with soft-close hardware, quartz countertops with undermount sink, luxury vinyl plank flooring, electrical updates for modern appliances, and professional cleanup. Work includes all necessary permits and inspections.'
    },
    {
      id: 2,
      title: 'Bathroom Remodel',
      client_id: 2,
      client_name: 'Sarah Johnson',
      status: 'in_progress',
      job_type: 'Bathroom Remodel',
      location: '456 Oak Ave, Boulder, CO',
      estimate_total: 15000,
      materials: [
        { description: 'Tile - Porcelain', quantity: 100, unit_price: 12, total: 1200 }
      ],
      labor: [
        { description: 'Tile Installation', hours: 20, rate: 80, total: 1600 }
      ],
      additional_services: []
    }
  ]);

  const [userSettings, setUserSettings] = useState({
    company_name: 'Premier Construction LLC',
    business_phone: '(555) 555-0123',
    business_address: '789 Contractor Way, Denver, CO 80203',
    license_number: 'CO-CONTR-2024-001',
    default_tax_rate: 8.5,
    default_markup_rate: 20,
    custom_job_types: ['Kitchen Remodel', 'Bathroom Remodel', 'Deck Construction', 'Roof Repair']
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

  // Calculate totals
  const calculateEstimateTotal = (estimate) => {
    const materialsTotal = estimate.materials.reduce((sum, item) => sum + (item.total || 0), 0);
    const laborTotal = estimate.labor.reduce((sum, item) => sum + (item.total || 0), 0);
    const servicesTotal = estimate.additional_services.reduce((sum, item) => sum + (parseFloat(item.amount) || 0), 0);
    
    const subtotal = materialsTotal + laborTotal + servicesTotal;
    const markup = subtotal * (userSettings.default_markup_rate / 100);
    const beforeTax = subtotal + markup;
    const tax = beforeTax * (userSettings.default_tax_rate / 100);
    
    return {
      materialsTotal,
      laborTotal,
      servicesTotal,
      subtotal,
      markup,
      beforeTax,
      tax,
      total: beforeTax + tax
    };
  };

  // AI functions (simulated)
  const generateAIScope = (jobType) => {
    const templates = {
      'Kitchen Remodel': 'Complete kitchen renovation including demolition of existing cabinets and countertops, installation of new custom cabinetry with soft-close hardware, quartz countertops with undermount sink, luxury vinyl plank flooring, electrical updates for modern appliances, and professional cleanup. Work includes all necessary permits and inspections.',
      'Bathroom Remodel': 'Full bathroom renovation including removal of existing fixtures, installation of new tile flooring and shower surround, modern vanity with quartz top, updated plumbing fixtures, electrical work for new lighting, and professional finishing. All work performed to current building codes.',
      'Deck Construction': 'Professional deck construction including foundation preparation, pressure-treated framing, composite decking installation, railing system, and weatherproofing. All materials and labor included with 5-year warranty.',
      'Roof Repair': 'Comprehensive roof repair including shingle replacement, flashing repair, gutter cleaning and adjustment, and full inspection. Emergency tarping included if needed.',
      'Default': `Professional ${jobType} service including material supply, skilled labor, and project management. Work performed to industry standards with attention to quality and client satisfaction.`
    };
    return templates[jobType] || templates['Default'];
  };

  const generatePDF = async (job) => {
    const totals = calculateEstimateTotal(job);
    console.log('PDF Generated for:', job.title, 'Total:', totals.total);
    alert(`PDF generated successfully for "${job.title}"\n\nTotal: $${totals.total.toFixed(2)}\n\nThis would normally download a branded PDF with all job details, client information, and pricing using your custom template.`);
    return totals;
  };

  const sendEmail = async (clientEmail, job) => {
    console.log('Sending email to:', clientEmail);
    setTimeout(() => {
      alert(`Email sent successfully!\n\nTo: ${clientEmail}\nSubject: Estimate for ${job.title}\n\nYour professional estimate has been sent to the client with a PDF attachment. The client will receive:\n- Detailed scope of work\n- Complete pricing breakdown\n- Your company branding\n- Next steps for approval`);
    }, 1000);
  };

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
    alert('Estimate created successfully! You can now generate PDF and send to client.');
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

  // Navigation
  const Navigation = () => (
    <nav className="bg-white shadow-sm border-b">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center space-x-8">
            <div className="flex items-center space-x-2">
              <Building2 className="w-8 h-8 text-blue-600" />
              <span className="text-xl font-bold text-gray-900">EstimatePro</span>
            </div>
            <div className="hidden md:flex space-x-6">
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
                      ? 'bg-blue-100 text-blue-700' 
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{label}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </nav>
  );

  // Dashboard
  const Dashboard = () => {
    const stats = {
      totalJobs: jobs.length,
      activeJobs: jobs.filter(job => ['estimate_sent', 'in_progress'].includes(job.status)).length,
      totalRevenue: jobs.reduce((sum, job) => sum + job.estimate_total, 0),
      completedJobs: jobs.filter(job => job.status === 'completed').length
    };
    
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
          <button
            onClick={() => setCurrentPage('estimates')}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2"
          >
            <Plus className="w-4 h-4" />
            <span>New Estimate</span>
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Jobs</p>
                <p className="text-2xl font-bold text-gray-900">{stats.totalJobs}</p>
              </div>
              <Briefcase className="w-8 h-8 text-blue-500" />
            </div>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Active Jobs</p>
                <p className="text-2xl font-bold text-green-600">{stats.activeJobs}</p>
              </div>
              <Activity className="w-8 h-8 text-green-500" />
            </div>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Revenue</p>
                <p className="text-2xl font-bold text-blue-600">${stats.totalRevenue.toLocaleString()}</p>
              </div>
              <DollarSign className="w-8 h-8 text-blue-500" />
            </div>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Completed</p>
                <p className="text-2xl font-bold text-purple-600">{stats.completedJobs}</p>
              </div>
              <CheckCircle className="w-8 h-8 text-purple-500" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border">
          <div className="p-6 border-b">
            <h2 className="text-lg font-semibold text-gray-900">Recent Jobs</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="text-left py-3 px-6 font-medium text-gray-700">Job Title</th>
                  <th className="text-left py-3 px-6 font-medium text-gray-700">Client</th>
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
                    <td className="py-3 px-6 text-center">
                      <button className="text-blue-600 hover:text-blue-800">
                        <Eye className="w-4 h-4" />
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

  // Continue with the rest of the component...