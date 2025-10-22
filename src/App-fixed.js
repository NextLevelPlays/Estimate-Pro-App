import React, { useState } from 'react';
import { 
  Building2, Users, FileText, Settings, BookOpen, Plus, 
  Search, Mail, Download, Eye, Edit, Trash2,
  DollarSign, Calendar, CheckCircle, Briefcase,
  Upload, Send, Save, Star, Activity
} from 'lucide-react';

const ConstructionEstimateApp = () => {
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
      ]
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
      'Kitchen Remodel': 'Complete kitchen renovation including demolition, new cabinets, countertops, flooring, and electrical updates.',
      'Bathroom Remodel': 'Full bathroom renovation including new fixtures, tile work, vanity installation, and plumbing updates.',
      'Default': `Professional ${jobType} service with quality materials and skilled workmanship.`
    };
    return templates[jobType] || templates['Default'];
  };

  const generatePDF = async (job) => {
    const totals = calculateEstimateTotal(job);
    console.log('PDF Generated for:', job.title, 'Total:', totals.total);
    alert(`PDF generated for ${job.title} - Total: $${totals.total.toFixed(2)}`);
    return totals;
  };

  const sendEmail = async (clientEmail, job) => {
    console.log('Sending email to:', clientEmail);
    setTimeout(() => {
      alert(`Email sent successfully to ${clientEmail} for job: ${job.title}`);
    }, 1000);
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

  // Render the current page
  const renderCurrentPage = () => {
    switch (currentPage) {
      case 'dashboard': return <Dashboard />;
      case 'estimates': return <div className="text-center text-gray-600">Estimates page coming soon...</div>;
      case 'jobs': return <div className="text-center text-gray-600">Jobs page coming soon...</div>;
      case 'clients': return <div className="text-center text-gray-600">Clients page coming soon...</div>;
      case 'settings': return <div className="text-center text-gray-600">Settings page coming soon...</div>;
      case 'guide': return <div className="text-center text-gray-600">User Guide page coming soon...</div>;
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