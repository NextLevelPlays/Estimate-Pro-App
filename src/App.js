import React, { useState } from 'react';
import {
  Building2, Users, FileText, Settings, BookOpen, Plus,
  Mail, Download, Eye, DollarSign, CheckCircle, Briefcase,
  Save, Star, Activity, MapPin, User, Hammer
} from 'lucide-react';

function App() {
  const [currentPage, setCurrentPage] = useState('dashboard');
  
  const companyInfo = {
    name: 'Blackston Handyman Services',
    tagline: 'Quality Work. Honest Price.',
    owner: 'Brandon Blackston',
    phone: '(303) 880-4557',
    email: 'brandon@blackstonhandyman.com',
    primaryColor: '#B85450',
    secondaryColor: '#2D3748'
  };

  const BLACKSTON_LOGO = "/Blackston-logo.png";
  
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
      scope: '',
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
  const [isGeneratingScope, setIsGeneratingScope] = useState(false);
  const [rawScopeInput, setRawScopeInput] = useState('');
  
  // Search and filter states
  const [estimateSearchTerm, setEstimateSearchTerm] = useState('');
  const [clientSearchTerm, setClientSearchTerm] = useState('');
  const [estimateStatusFilter, setEstimateStatusFilter] = useState('all');
  const [selectedEstimates, setSelectedEstimates] = useState([]);
  const [showBulkActions, setShowBulkActions] = useState(false);
  
  // API Key management
  const [claudeApiKey, setClaudeApiKey] = useState(localStorage.getItem('claudeApiKey') || '');
  const [showApiKey, setShowApiKey] = useState(false);

  const [newEstimate, setNewEstimate] = useState({
    clientId: '',
    title: '',
    scope: '',
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

  const getClientName = (clientId) => {
    const client = clients.find(c => c.id === clientId);
    return client ? client.name : 'Unknown Client';
  };

  // Search and filter functions
  const filteredEstimates = estimates.filter(estimate => {
    const matchesSearch = estimate.title.toLowerCase().includes(estimateSearchTerm.toLowerCase()) ||
                         getClientName(estimate.clientId).toLowerCase().includes(estimateSearchTerm.toLowerCase());
    const matchesStatus = estimateStatusFilter === 'all' || estimate.status === estimateStatusFilter;
    return matchesSearch && matchesStatus;
  });

  const filteredClients = clients.filter(client =>
    client.name.toLowerCase().includes(clientSearchTerm.toLowerCase()) ||
    client.email.toLowerCase().includes(clientSearchTerm.toLowerCase()) ||
    client.company.toLowerCase().includes(clientSearchTerm.toLowerCase())
  );

  // Bulk actions functions
  const toggleEstimateSelection = (estimateId) => {
    setSelectedEstimates(prev => 
      prev.includes(estimateId) 
        ? prev.filter(id => id !== estimateId)
        : [...prev, estimateId]
    );
  };

  const selectAllEstimates = () => {
    setSelectedEstimates(filteredEstimates.map(e => e.id));
  };

  const clearSelection = () => {
    setSelectedEstimates([]);
  };

  const bulkUpdateStatus = (newStatus) => {
    setEstimates(prev => prev.map(estimate => 
      selectedEstimates.includes(estimate.id) 
        ? { ...estimate, status: newStatus }
        : estimate
    ));
    setSelectedEstimates([]);
    setShowBulkActions(false);
  };

  const bulkDelete = () => {
    if (window.confirm(`Are you sure you want to delete ${selectedEstimates.length} estimates?`)) {
      setEstimates(prev => prev.filter(estimate => !selectedEstimates.includes(estimate.id)));
      setSelectedEstimates([]);
      setShowBulkActions(false);
    }
  };

  const bulkGeneratePDFs = () => {
    selectedEstimates.forEach(estimateId => {
      const estimate = estimates.find(e => e.id === estimateId);
      if (estimate) {
        setTimeout(() => generatePDF(estimate), 500);
      }
    });
    setSelectedEstimates([]);
    setShowBulkActions(false);
  };

  const generateLineItemsFromScope = () => {
    if (!newEstimate.scope.trim()) {
      alert('Please generate or enter a professional scope first');
      return;
    }

    const scope = newEstimate.scope.toLowerCase();
    let materials = [];
    let labor = [];
    let additionalServices = [];

    // Analyze scope and generate appropriate line items
    if (scope.includes('fence') || scope.includes('fencing')) {
      materials = [
        { description: 'Fence Posts (4x4 Pressure Treated)', quantity: 8, rate: 15.00, amount: 120.00 },
        { description: 'Fence Boards (6ft Privacy)', quantity: 50, rate: 8.50, amount: 425.00 },
        { description: 'Gate Hardware Kit', quantity: 1, rate: 45.00, amount: 45.00 },
        { description: 'Concrete Mix (80lb bags)', quantity: 12, rate: 4.50, amount: 54.00 },
        { description: 'Galvanized Screws/Nails', quantity: 1, rate: 25.00, amount: 25.00 }
      ];
      labor = [
        { description: 'Fence Installation Labor', hours: 16, rate: 75.00, amount: 1200.00 }
      ];
      if (scope.includes('demo') || scope.includes('remove')) {
        additionalServices = [
          { description: 'Old Fence Removal & Disposal', quantity: 1, rate: 350.00, amount: 350.00 }
        ];
      }
    } else if (scope.includes('paint') && scope.includes('exterior')) {
      materials = [
        { description: 'Exterior Paint (Gallon)', quantity: 3, rate: 55.00, amount: 165.00 },
        { description: 'Primer (Gallon)', quantity: 2, rate: 45.00, amount: 90.00 },
        { description: 'Brushes & Rollers', quantity: 1, rate: 75.00, amount: 75.00 },
        { description: 'Drop Cloths & Masking', quantity: 1, rate: 40.00, amount: 40.00 }
      ];
      labor = [
        { description: 'Surface Preparation', hours: 8, rate: 75.00, amount: 600.00 },
        { description: 'Painting Application', hours: 12, rate: 75.00, amount: 900.00 }
      ];
      additionalServices = [
        { description: 'Power Washing', quantity: 1, rate: 200.00, amount: 200.00 }
      ];
    } else if (scope.includes('kitchen') || scope.includes('cabinet')) {
      materials = [
        { description: 'Kitchen Cabinets (Linear Foot)', quantity: 15, rate: 180.00, amount: 2700.00 },
        { description: 'Cabinet Hardware', quantity: 1, rate: 150.00, amount: 150.00 },
        { description: 'Wood Screws & Fasteners', quantity: 1, rate: 45.00, amount: 45.00 }
      ];
      labor = [
        { description: 'Cabinet Installation', hours: 20, rate: 85.00, amount: 1700.00 },
        { description: 'Hardware Installation', hours: 4, rate: 75.00, amount: 300.00 }
      ];
      if (scope.includes('counter')) {
        materials.push({ description: 'Countertop (Square Foot)', quantity: 25, rate: 45.00, amount: 1125.00 });
        labor.push({ description: 'Countertop Installation', hours: 8, rate: 85.00, amount: 680.00 });
      }
      if (scope.includes('backsplash') || scope.includes('tile')) {
        materials.push({ description: 'Tile & Grout', quantity: 1, rate: 275.00, amount: 275.00 });
        labor.push({ description: 'Tile Installation', hours: 12, rate: 75.00, amount: 900.00 });
      }
    } else if (scope.includes('bathroom')) {
      materials = [
        { description: 'Bathroom Vanity', quantity: 1, rate: 450.00, amount: 450.00 },
        { description: 'Faucet & Hardware', quantity: 1, rate: 125.00, amount: 125.00 },
        { description: 'Plumbing Fittings', quantity: 1, rate: 85.00, amount: 85.00 }
      ];
      labor = [
        { description: 'Vanity Installation', hours: 6, rate: 85.00, amount: 510.00 },
        { description: 'Plumbing Connections', hours: 4, rate: 95.00, amount: 380.00 }
      ];
      if (scope.includes('tile')) {
        materials.push({ description: 'Bathroom Tile (Square Foot)', quantity: 35, rate: 8.50, amount: 297.50 });
        labor.push({ description: 'Tile Installation', hours: 10, rate: 75.00, amount: 750.00 });
      }
    } else if (scope.includes('deck')) {
      materials = [
        { description: 'Deck Boards (Pressure Treated)', quantity: 25, rate: 12.00, amount: 300.00 },
        { description: 'Deck Joists (2x8)', quantity: 12, rate: 15.00, amount: 180.00 },
        { description: 'Concrete for Footings', quantity: 8, rate: 6.50, amount: 52.00 },
        { description: 'Galvanized Deck Screws', quantity: 1, rate: 35.00, amount: 35.00 }
      ];
      labor = [
        { description: 'Deck Framing', hours: 12, rate: 85.00, amount: 1020.00 },
        { description: 'Decking Installation', hours: 8, rate: 75.00, amount: 600.00 }
      ];
      if (scope.includes('rail')) {
        materials.push({ description: 'Railing Kit', quantity: 1, rate: 225.00, amount: 225.00 });
        labor.push({ description: 'Railing Installation', hours: 6, rate: 75.00, amount: 450.00 });
      }
    } else {
      // Generic handyman work
      materials = [
        { description: 'General Materials', quantity: 1, rate: 150.00, amount: 150.00 },
        { description: 'Hardware & Fasteners', quantity: 1, rate: 45.00, amount: 45.00 }
      ];
      labor = [
        { description: 'General Labor', hours: 8, rate: 75.00, amount: 600.00 }
      ];
    }

    // Update the estimate with generated line items
    setNewEstimate(prev => ({
      ...prev,
      materials: materials,
      labor: labor,
      additionalServices: additionalServices
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
      scope: '',
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

  const saveApiKey = (key) => {
    setClaudeApiKey(key);
    localStorage.setItem('claudeApiKey', key);
  };

  const generateProfessionalScope = async () => {
    if (!rawScopeInput.trim()) {
      alert('Please enter some details about the project first');
      return;
    }

    if (!claudeApiKey) {
      alert('Please enter your Claude API key in the Settings page first');
      return;
    }

    setIsGeneratingScope(true);

    try {
      const professionalScope = await callClaudeAPI(rawScopeInput);
      setNewEstimate(prev => ({ ...prev, scope: professionalScope }));
      setRawScopeInput('');
    } catch (error) {
      alert('Error generating scope: ' + error.message);
    } finally {
      setIsGeneratingScope(false);
    }
  };

  const callClaudeAPI = async (rawInput) => {
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': claudeApiKey,
        'anthropic-version': '2023-06-01'
      },
      body: JSON.stringify({
        model: 'claude-sonnet-4-20250514',
        max_tokens: 2048,
        messages: [{
          role: 'user',
          content: `You are a professional handyman services estimator. Convert the following rough project notes into a professional, detailed scope of work. 

IMPORTANT FORMATTING RULES:
- Use a numbered list format (1., 2., 3., etc.)
- Preserve ALL specific measurements, quantities, and details from the input
- Include material specifications when mentioned
- Include labor hours and team size when mentioned
- Break down the work into logical sections
- End with a professional closing statement mentioning Blackston Handyman Services, LLC

Raw project notes:
${rawInput}

Generate a professional scope of work:`
        }]
      })
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error?.message || 'API request failed');
    }

    const data = await response.json();
    return data.content[0].text;
  };

  const generatePDF = (estimate) => {
    const client = clients.find(c => c.id === estimate.clientId);
    if (!client) {
      alert('Client information not found');
      return;
    }

    const printWindow = window.open('', '_blank');
    const currentDate = new Date().toLocaleDateString();
    const dueDate = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toLocaleDateString();
    const invoiceNumber = estimate.invoiceNumber || `EST-${estimate.id}-${Date.now().toString().slice(-4)}`;
    
    const pdfContent = `
    <!DOCTYPE html>
    <html>
    <head>
      <title>Blackston Handyman Services - Estimate</title>
      <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { font-family: Arial, sans-serif; font-size: 12px; line-height: 1.4; color: #333; background: white; }
        .page { width: 8.5in; min-height: 11in; margin: 0 auto; padding: 0.5in; background: white; position: relative; page-break-after: always; }
        .page:last-child { page-break-after: avoid; }
        .header { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 30px; position: relative; }
        .header::before { content: ''; position: absolute; top: -20px; right: -20px; width: 100%; height: 80px; background: linear-gradient(135deg, #B85450 0%, #B85450 60%, #2D3748 60%, #2D3748 100%); z-index: -1; }
        .logo-section { display: flex; align-items: center; gap: 15px; z-index: 1; }
        .logo { width: 120px; height: 120px; background: url('/Blackston-logo.png') no-repeat center; background-size: contain; }
        .company-info { color: #2D3748; }
        .company-name { font-size: 24px; font-weight: bold; margin-bottom: 5px; }
        .tagline { font-size: 14px; color: #666; }
        .invoice-details { background: #2D3748; color: white; padding: 15px 20px; margin-top: 20px; z-index: 1; }
        .invoice-details div { margin-bottom: 5px; }
        .estimate-title { text-align: center; font-size: 36px; font-weight: bold; color: #B85450; margin: 30px 0; }
        .customer-section { margin-bottom: 30px; }
        .quote-addressed { font-weight: bold; margin-bottom: 10px; color: #2D3748; }
        .customer-details { margin-left: 20px; }
        .customer-details div { margin-bottom: 5px; }
        .line-items { width: 100%; border-collapse: collapse; margin-bottom: 30px; }
        .line-items thead { background: #B85450; color: white; }
        .line-items th, .line-items td { padding: 12px; text-align: left; border-bottom: 2px solid #B85450; }
        .line-items th:nth-child(2), .line-items td:nth-child(2) { text-align: right; width: 15%; }
        .line-items th:nth-child(3), .line-items td:nth-child(3) { text-align: right; width: 15%; }
        .line-items tbody tr:nth-child(even) { background: #f9f9f9; }
        .totals-section { display: flex; justify-content: space-between; margin-top: 40px; }
        .terms { width: 60%; }
        .terms h3 { color: #2D3748; margin-bottom: 10px; font-size: 14px; }
        .terms p { font-size: 11px; line-height: 1.5; color: #555; }
        .totals { width: 35%; }
        .total-line { display: flex; justify-content: space-between; padding: 8px 0; border-bottom: 1px solid #ddd; }
        .total-line.final { background: #B85450; color: white; padding: 12px 15px; font-weight: bold; font-size: 16px; margin-top: 10px; }
        .footer { margin-top: 50px; display: flex; justify-content: space-between; align-items: flex-end; position: relative; }
        .footer::before { content: ''; position: absolute; bottom: -20px; left: -20px; width: 100%; height: 60px; background: linear-gradient(135deg, #2D3748 0%, #2D3748 40%, #B85450 40%, #B85450 100%); z-index: -1; }
        .thank-you { background: #2D3748; color: white; padding: 15px 20px; text-align: center; }
        .thank-you h3 { margin-bottom: 5px; }
        .phone { font-size: 18px; font-weight: bold; }
        .owner-signature { background: #B85450; color: white; padding: 15px 20px; text-align: center; }
        .owner-name { font-weight: bold; margin-bottom: 5px; }
        .letterhead-header { display: flex; align-items: center; gap: 15px; margin-bottom: 60px; position: relative; }
        .letterhead-header::before { content: ''; position: absolute; top: -20px; right: -20px; width: 100%; height: 80px; background: linear-gradient(135deg, #B85450 0%, #B85450 60%, #2D3748 60%, #2D3748 100%); z-index: -1; }
        .scope-content { max-width: 100%; margin: 60px 0; padding: 20px; font-size: 14px; line-height: 1.6; color: #333; }
        .scope-title { font-size: 24px; font-weight: bold; color: #B85450; margin-bottom: 30px; text-align: center; }
        .scope-text { white-space: pre-wrap; text-align: justify; }
        .letterhead-footer { position: absolute; bottom: 20px; left: 20px; right: 20px; height: 60px; background: linear-gradient(135deg, #2D3748 0%, #2D3748 40%, #B85450 40%, #B85450 100%); }
        @media print { .page { width: 100%; margin: 0; padding: 0.5in; } body { font-size: 11px; } }
      </style>
    </head>
    <body>
      <div class="page">
        <div class="header">
          <div class="logo-section">
            <div class="logo"></div>
            <div class="company-info">
              <div class="company-name">BLACKSTON</div>
              <div style="font-size: 12px; color: #666;">HANDYMAN SERVICES</div>
              <div class="tagline">QUALITY WORK. HONEST PRICE.</div>
            </div>
          </div>
          <div class="invoice-details">
            <div><strong>Invoice No:</strong> ${invoiceNumber}</div>
            <div><strong>Due Date:</strong> ${dueDate}</div>
            <div><strong>Invoice Date:</strong> ${currentDate}</div>
          </div>
        </div>
        
        <div class="estimate-title">Job Estimate</div>
        
        <div class="customer-section">
          <div class="quote-addressed">QUOTE ADDRESSED<br>TO: ${client.name}</div>
          <div class="customer-details">
            <div><strong>Phone:</strong> ${client.phone}</div>
            <div><strong>Email:</strong> ${client.email}</div>
            <div><strong>Address:</strong> ${client.address}</div>
          </div>
        </div>
        
        <table class="line-items">
          <thead>
            <tr><th>Line Item Description</th><th>PRICE</th><th>SUBTOTAL</th></tr>
          </thead>
          <tbody>
            ${estimate.materials.map(item => `<tr><td>${item.description} (Materials)</td><td>$${item.rate.toFixed(2)}</td><td>$${item.amount.toFixed(2)}</td></tr>`).join('')}
            ${estimate.labor.map(item => `<tr><td>${item.description} (${item.hours} hours @ $${item.rate.toFixed(2)}/hr)</td><td>$${item.rate.toFixed(2)}</td><td>$${item.amount.toFixed(2)}</td></tr>`).join('')}
            ${estimate.additionalServices.map(item => `<tr><td>${item.description}</td><td>$${item.rate.toFixed(2)}</td><td>$${item.amount.toFixed(2)}</td></tr>`).join('')}
          </tbody>
        </table>
        
        <div class="totals-section">
          <div class="terms">
            <h3>TERMS AND CONDITIONS</h3>
            <p>Terms: Payment is due at time of service unless otherwise specified. Net-30 terms available by prior arrangement. All work is guaranteed for 90 days from completion. Late payments subject to 1.5% monthly service charge. Disputes must be submitted within 10 days of invoice date.</p>
          </div>
          <div class="totals">
            <div class="total-line"><span>Sub-total:</span><span>$${estimate.subtotal.toFixed(2)}</span></div>
            <div class="total-line"><span>Discount:</span><span>$0.00</span></div>
            <div class="total-line"><span>tax (8%):</span><span>$${estimate.tax.toFixed(2)}</span></div>
            <div class="total-line final"><span>TOTAL:</span><span>$${estimate.total.toFixed(2)}</span></div>
          </div>
        </div>
        
        <div class="footer">
          <div class="thank-you">
            <h3>THANK YOU FOR YOUR BUSINESS</h3>
            <div class="phone">1 (303) 880-4557</div>
          </div>
          <div class="owner-signature">
            <div class="owner-name">BRANDON BLACKSTON</div>
            <div>OWNER/OPERATOR</div>
          </div>
        </div>
      </div>
      
      ${estimate.scope ? `
      <div class="page">
        <div class="letterhead-header">
          <div class="logo"></div>
          <div class="company-info">
            <div class="company-name">BLACKSTON</div>
            <div style="font-size: 12px; color: #666;">HANDYMAN SERVICES</div>
            <div class="tagline">QUALITY WORK. HONEST PRICE.</div>
          </div>
        </div>
        <div class="scope-content">
          <div class="scope-title">Scope of Work</div>
          <div class="scope-text">${estimate.scope}</div>
        </div>
        <div class="letterhead-footer"></div>
      </div>
      ` : ''}
    </body>
    </html>
    `;
    
    printWindow.document.write(pdfContent);
    printWindow.document.close();
    
    setTimeout(() => {
      printWindow.focus();
      printWindow.print();
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="shadow-sm border-b" style={{ backgroundColor: companyInfo.secondaryColor }}>
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-4 lg:space-x-8">
              <div className="flex items-center space-x-3">
                <img src={BLACKSTON_LOGO} alt="Blackston Handyman Services Logo" className="w-10 h-10 sm:w-12 sm:h-12 rounded-lg object-contain bg-white p-1" />
                <div className="hidden sm:block">
                  <span className="text-lg sm:text-xl font-bold text-white">{companyInfo.name}</span>
                  <p className="text-xs text-gray-300">{companyInfo.tagline}</p>
                </div>
              </div>
              <div className="hidden md:flex space-x-2 lg:space-x-4">
                {[
                  { key: 'dashboard', label: 'Dashboard' },
                  { key: 'estimates', label: 'Estimates' },
                  { key: 'jobs', label: 'Jobs' },
                  { key: 'clients', label: 'Clients' },
                  { key: 'settings', label: 'Settings' },
                  { key: 'guide', label: 'Guide' }
                ].map(({ key, label }) => (
                  <button key={key} onClick={() => setCurrentPage(key)} className={`px-2 lg:px-3 py-2 text-sm font-medium rounded-md transition-colors ${currentPage === key ? 'text-white' : 'text-gray-300 hover:text-white'}`} style={currentPage === key ? { backgroundColor: companyInfo.primaryColor } : {}}>{label}</button>
                ))}
              </div>
              
              {/* Mobile Menu */}
              <div className="md:hidden">
                <select 
                  value={currentPage} 
                  onChange={(e) => setCurrentPage(e.target.value)}
                  className="bg-gray-700 text-white border-gray-600 rounded px-2 py-1 text-sm"
                >
                  <option value="dashboard">Dashboard</option>
                  <option value="estimates">Estimates</option>
                  <option value="jobs">Jobs</option>
                  <option value="clients">Clients</option>
                  <option value="settings">Settings</option>
                  <option value="guide">Guide</option>
                </select>
              </div>
            </div>
            <div className="text-right">
              <p className="text-white text-sm font-medium">{companyInfo.owner}</p>
              <p className="text-gray-300 text-xs hidden sm:block">{companyInfo.phone}</p>
            </div>
          </div>
        </div>
      </nav>
      
      <main className="max-w-7xl mx-auto px-4 py-8">
        {currentPage === 'dashboard' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div>
                <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Dashboard</h1>
                <p className="text-gray-600 mt-1">{companyInfo.tagline}</p>
              </div>
              <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-4 w-full sm:w-auto">
                <button onClick={() => setShowNewEstimateForm(true)} className="hover:bg-opacity-90 text-white px-4 py-2 rounded-lg flex items-center justify-center space-x-2 transition-colors" style={{ backgroundColor: companyInfo.primaryColor }}>
                  <Plus className="w-4 h-4" />
                  <span>New Estimate</span>
                </button>
                <button onClick={() => setShowNewClientForm(true)} className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-lg flex items-center justify-center space-x-2">
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
                <h2 className="text-xl font-semibold mb-4" style={{ color: companyInfo.secondaryColor }}>Recent Estimates</h2>
                <div className="space-y-4">
                  {estimates.slice(0, 3).map(estimate => (
                    <div key={estimate.id} className="flex justify-between items-center p-3 border rounded">
                      <div>
                        <p className="font-medium">{estimate.title}</p>
                        <p className="text-sm text-gray-600">{getClientName(estimate.clientId)}</p>
                      </div>
                      <div className="flex items-center space-x-3">
                        <div className="text-right">
                          <p className="font-semibold" style={{ color: companyInfo.primaryColor }}>${estimate.total.toFixed(2)}</p>
                          <span className={`px-2 py-1 text-xs rounded-full ${estimate.status === 'approved' ? 'bg-green-100 text-green-800' : estimate.status === 'pending' ? 'text-white' : 'bg-gray-100 text-gray-800'}`} style={estimate.status === 'pending' ? { backgroundColor: companyInfo.primaryColor } : {}}>{estimate.status}</span>
                        </div>
                        <button onClick={() => generatePDF(estimate)} className="px-3 py-1 text-white rounded text-xs hover:bg-opacity-90" style={{ backgroundColor: companyInfo.primaryColor }} title="Generate PDF">
                          <Download className="w-3 h-3" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-white p-6 rounded-lg shadow">
                <h2 className="text-xl font-semibold mb-4" style={{ color: companyInfo.secondaryColor }}>Active Jobs</h2>
                <div className="space-y-4">
                  {jobs.map(job => (
                    <div key={job.id} className="flex justify-between items-center p-3 border rounded">
                      <div>
                        <p className="font-medium">{job.title}</p>
                        <p className="text-sm text-gray-600">{getClientName(job.clientId)}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm">{job.actualHours}/{job.estimatedHours} hrs</p>
                        <span className={`px-2 py-1 text-xs rounded-full ${job.status === 'completed' ? 'bg-green-100 text-green-800' : job.status === 'in-progress' ? 'text-white' : 'bg-gray-100 text-gray-800'}`} style={job.status === 'in-progress' ? { backgroundColor: companyInfo.secondaryColor } : {}}>{job.status}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {currentPage === 'estimates' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <h1 className="text-3xl font-bold" style={{ color: companyInfo.secondaryColor }}>Estimates</h1>
              
              {/* Search and Filter Controls */}
              <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
                <div className="flex-1 sm:w-64">
                  <input
                    type="text"
                    placeholder="Search estimates or clients..."
                    value={estimateSearchTerm}
                    onChange={(e) => setEstimateSearchTerm(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <select
                  value={estimateStatusFilter}
                  onChange={(e) => setEstimateStatusFilter(e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="all">All Status</option>
                  <option value="pending">Pending</option>
                  <option value="approved">Approved</option>
                  <option value="rejected">Rejected</option>
                </select>
              </div>
            </div>

            {/* Bulk Actions Bar */}
            {selectedEstimates.length > 0 && (
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                  <span className="text-sm text-blue-700">
                    {selectedEstimates.length} estimate{selectedEstimates.length !== 1 ? 's' : ''} selected
                  </span>
                  <div className="flex flex-wrap gap-2">
                    <button
                      onClick={() => bulkUpdateStatus('approved')}
                      className="px-3 py-1 bg-green-600 text-white rounded text-sm hover:bg-green-700"
                    >
                      Mark Approved
                    </button>
                    <button
                      onClick={() => bulkUpdateStatus('pending')}
                      className="px-3 py-1 bg-yellow-600 text-white rounded text-sm hover:bg-yellow-700"
                    >
                      Mark Pending
                    </button>
                    <button
                      onClick={bulkGeneratePDFs}
                      className="px-3 py-1 text-white rounded text-sm hover:bg-opacity-90"
                      style={{ backgroundColor: companyInfo.primaryColor }}
                    >
                      Generate PDFs
                    </button>
                    <button
                      onClick={bulkDelete}
                      className="px-3 py-1 bg-red-600 text-white rounded text-sm hover:bg-red-700"
                    >
                      Delete
                    </button>
                    <button
                      onClick={clearSelection}
                      className="px-3 py-1 bg-gray-500 text-white rounded text-sm hover:bg-gray-600"
                    >
                      Clear
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Select All/None */}
            {filteredEstimates.length > 0 && (
              <div className="flex justify-between items-center">
                <button
                  onClick={selectedEstimates.length === filteredEstimates.length ? clearSelection : selectAllEstimates}
                  className="text-sm text-blue-600 hover:text-blue-800"
                >
                  {selectedEstimates.length === filteredEstimates.length ? 'Deselect All' : 'Select All'}
                </button>
                <span className="text-sm text-gray-500">
                  Showing {filteredEstimates.length} of {estimates.length} estimates
                </span>
              </div>
            )}

            <div className="bg-white shadow overflow-hidden sm:rounded-md">
              {filteredEstimates.length === 0 ? (
                <div className="text-center py-12">
                  <p className="text-gray-500">No estimates found matching your criteria.</p>
                </div>
              ) : (
                <ul className="divide-y divide-gray-200">
                  {filteredEstimates.map(estimate => (
                    <li key={estimate.id}>
                      <div className="px-4 py-4 sm:px-6">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-3 flex-1">
                            <input
                              type="checkbox"
                              checked={selectedEstimates.includes(estimate.id)}
                              onChange={() => toggleEstimateSelection(estimate.id)}
                              className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                            />
                            <div className="flex-1 min-w-0">
                              <p className="text-lg font-medium truncate" style={{ color: companyInfo.secondaryColor }}>
                                {estimate.title}
                              </p>
                              <p className="text-sm text-gray-600 truncate">{getClientName(estimate.clientId)}</p>
                              <p className="text-sm text-gray-500 mt-1 hidden sm:block">{estimate.description}</p>
                            </div>
                          </div>
                          <div className="flex items-center space-x-4">
                            <div className="text-right">
                              <p className="text-lg font-semibold" style={{ color: companyInfo.primaryColor }}>
                                ${estimate.total.toFixed(2)}
                              </p>
                              <p className="text-sm text-gray-500 hidden sm:block">Created: {estimate.createdAt}</p>
                              <p className="text-sm text-gray-500 hidden sm:block">Valid until: {estimate.validUntil}</p>
                            </div>
                            <div className="flex flex-col space-y-2">
                              <button 
                                onClick={() => generatePDF(estimate)} 
                                className="px-3 py-1 sm:px-4 sm:py-2 text-white rounded-lg flex items-center space-x-1 sm:space-x-2 hover:bg-opacity-90 text-xs sm:text-sm" 
                                style={{ backgroundColor: companyInfo.primaryColor }}
                              >
                                <Download className="w-3 h-3 sm:w-4 sm:h-4" />
                                <span className="hidden sm:inline">Generate PDF</span>
                                <span className="sm:hidden">PDF</span>
                              </button>
                              <span className={`px-2 py-1 text-xs rounded-full text-center ${estimate.status === 'approved' ? 'bg-green-100 text-green-800' : estimate.status === 'pending' ? 'bg-yellow-100 text-yellow-800' : 'bg-gray-100 text-gray-800'}`}>
                                {estimate.status}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        )}

        {currentPage === 'jobs' && (
          <div className="space-y-6">
            <h1 className="text-3xl font-bold" style={{ color: companyInfo.secondaryColor }}>Jobs</h1>
            <div className="bg-white shadow overflow-hidden sm:rounded-md">
              <ul className="divide-y divide-gray-200">
                {jobs.map(job => (
                  <li key={job.id}>
                    <div className="px-4 py-4 sm:px-6">
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <p className="text-lg font-medium" style={{ color: companyInfo.secondaryColor }}>{job.title}</p>
                          <p className="text-sm text-gray-600">{getClientName(job.clientId)}</p>
                          <p className="text-sm text-gray-500 mt-1">Start: {job.startDate} | Est. Completion: {job.estimatedCompletion}</p>
                          {job.notes && <p className="text-sm text-gray-500 mt-1">Notes: {job.notes}</p>}
                        </div>
                        <div className="flex items-center space-x-4">
                          <div className="text-right">
                            <p className="text-sm text-gray-600">Hours: {job.actualHours} / {job.estimatedHours}</p>
                            <div className="w-24 bg-gray-200 rounded-full h-2 mt-1">
                              <div className="h-2 rounded-full" style={{ backgroundColor: companyInfo.primaryColor, width: `${(job.actualHours / job.estimatedHours) * 100}%` }}></div>
                            </div>
                          </div>
                          <span className={`px-2 py-1 text-xs rounded-full ${job.status === 'completed' ? 'bg-green-100 text-green-800' : job.status === 'in-progress' ? 'bg-blue-100 text-blue-800' : 'bg-gray-100 text-gray-800'}`}>{job.status}</span>
                        </div>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )}

        {currentPage === 'clients' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <h1 className="text-3xl font-bold" style={{ color: companyInfo.secondaryColor }}>Clients</h1>
              
              {/* Search Control */}
              <div className="w-full sm:w-64">
                <input
                  type="text"
                  placeholder="Search clients..."
                  value={clientSearchTerm}
                  onChange={(e) => setClientSearchTerm(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            {filteredClients.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-gray-500">No clients found matching your search.</p>
              </div>
            ) : (
              <>
                <div className="text-right text-sm text-gray-500 mb-4">
                  Showing {filteredClients.length} of {clients.length} clients
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                  {filteredClients.map(client => (
                    <div key={client.id} className="bg-white p-4 sm:p-6 rounded-lg shadow hover:shadow-md transition-shadow">
                      <div className="flex items-start justify-between">
                        <div className="flex-1 min-w-0">
                          <h3 className="text-lg font-semibold truncate" style={{ color: companyInfo.secondaryColor }}>
                            {client.name}
                          </h3>
                          <p className="text-sm text-gray-600 truncate">{client.company}</p>
                          <div className="mt-3 sm:mt-4 space-y-2">
                            <div className="flex items-center text-sm text-gray-600">
                              <Mail className="w-4 h-4 mr-2 flex-shrink-0" />
                              <span className="truncate">{client.email}</span>
                            </div>
                            <div className="flex items-center text-sm text-gray-600">
                              <span className="w-4 h-4 mr-2 flex-shrink-0">📞</span>
                              <span className="truncate">{client.phone}</span>
                            </div>
                            <div className="flex items-start text-sm text-gray-600">
                              <MapPin className="w-4 h-4 mr-2 mt-0.5 flex-shrink-0" />
                              <span className="line-clamp-2">{client.address}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </>
            )}
          </div>
        )}

        {currentPage === 'settings' && (
          <div className="space-y-6">
            <h1 className="text-3xl font-bold" style={{ color: companyInfo.secondaryColor }}>Settings</h1>
            
            {/* API Key Section */}
            <div className="bg-white p-6 rounded-lg shadow">
              <h2 className="text-xl font-semibold mb-4" style={{ color: companyInfo.secondaryColor }}>Claude AI Configuration</h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Claude API Key
                    <span className="text-xs text-gray-500 ml-2">(Required for AI scope generation)</span>
                  </label>
                  <div className="flex gap-2">
                    <div className="flex-1 relative">
                      <input
                        type={showApiKey ? "text" : "password"}
                        value={claudeApiKey}
                        onChange={(e) => setClaudeApiKey(e.target.value)}
                        placeholder="sk-ant-xxxxxxxxxxxxx"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                    <button
                      onClick={() => setShowApiKey(!showApiKey)}
                      className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300"
                    >
                      {showApiKey ? <Eye className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                    <button
                      onClick={() => saveApiKey(claudeApiKey)}
                      className="px-4 py-2 text-white rounded-md hover:bg-opacity-90"
                      style={{ backgroundColor: companyInfo.primaryColor }}
                    >
                      Save Key
                    </button>
                  </div>
                  <p className="text-xs text-gray-500 mt-2">
                    Get your API key from <a href="https://console.anthropic.com/" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">console.anthropic.com</a>
                  </p>
                  {claudeApiKey && (
                    <div className="mt-2 flex items-center text-sm text-green-600">
                      <CheckCircle className="w-4 h-4 mr-1" />
                      API key configured
                    </div>
                  )}
                </div>
              </div>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow">
              <h2 className="text-xl font-semibold mb-4" style={{ color: companyInfo.secondaryColor }}>Company Profile</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-lg font-medium mb-3" style={{ color: companyInfo.primaryColor }}>Business Information</h3>
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
        )}

        {currentPage === 'guide' && (
          <div className="space-y-6">
            <h1 className="text-3xl font-bold" style={{ color: companyInfo.secondaryColor }}>User Guide</h1>
            <div className="bg-white p-6 rounded-lg shadow">
              <h2 className="text-xl font-semibold mb-4" style={{ color: companyInfo.secondaryColor }}>How to Use {companyInfo.name} Estimate Pro</h2>
              <div className="prose max-w-none">
                <h3 style={{ color: companyInfo.primaryColor }}>Getting Started</h3>
                <p>Welcome to your professional estimate management system!</p>
                <ol>
                  <li>View your dashboard for an overview of estimates, jobs, and clients</li>
                  <li>Navigate between different sections using the top menu</li>
                  <li>Track your business performance with key metrics</li>
                </ol>
                <h3 style={{ color: companyInfo.primaryColor }}>AI Scope Generator</h3>
                <p>Use the AI Scope Generator to transform rough project notes into professional scope documents:</p>
                <ol>
                  <li>When creating a new estimate, scroll to the "Scope of Work" section</li>
                  <li>Enter rough project details in the AI input box</li>
                  <li>Click "Generate Professional Scope with AI"</li>
                  <li>Review and edit the generated scope as needed</li>
                </ol>
                <h3 style={{ color: companyInfo.primaryColor }}>Search and Bulk Actions</h3>
                <p>New features to speed up your workflow:</p>
                <ol>
                  <li>Use the search bars to quickly find estimates or clients</li>
                  <li>Filter estimates by status to focus on pending or approved items</li>
                  <li>Select multiple estimates to perform bulk actions like status updates or PDF generation</li>
                  <li>The app works great on mobile devices with touch-friendly interfaces</li>
                </ol>
              </div>
            </div>
          </div>
        )}
      </main>
      
      {showNewEstimateForm && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50 p-4">
          <div className="relative top-4 sm:top-20 mx-auto border w-full max-w-5xl shadow-lg rounded-md bg-white">
            <div className="p-3 sm:p-5">
              <h3 className="text-lg font-medium mb-4" style={{ color: companyInfo.secondaryColor }}>New Estimate</h3>
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Client</label>
                    <select value={newEstimate.clientId} onChange={(e) => setNewEstimate(prev => ({ ...prev, clientId: parseInt(e.target.value) }))} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500">
                      <option value="">Select a client</option>
                      {clients.map(client => <option key={client.id} value={client.id}>{client.name}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Valid Until</label>
                    <input type="date" value={newEstimate.validUntil} onChange={(e) => setNewEstimate(prev => ({ ...prev, validUntil: e.target.value }))} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500" />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Title</label>
                  <input type="text" value={newEstimate.title} onChange={(e) => setNewEstimate(prev => ({ ...prev, title: e.target.value }))} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Raw Scope of Work (Your Notes)</label>
                  <div className="mb-4">
                    <textarea 
                      value={rawScopeInput} 
                      onChange={(e) => setRawScopeInput(e.target.value)} 
                      rows={4} 
                      placeholder="Enter your rough scope here - use your normal language. Example: 'fix the busted kitchen cabinets, patch some holes in drywall, paint everything white'"
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    />
                    <button 
                      type="button" 
                      onClick={generateProfessionalScope} 
                      disabled={isGeneratingScope || !rawScopeInput.trim()} 
                      className="mt-3 w-full px-4 py-2 bg-yellow-500 text-black font-medium rounded-lg hover:bg-yellow-600 disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
                    >
                      {isGeneratingScope ? (
                        <>
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-black"></div>
                          <span>Generating Professional Scope...</span>
                        </>
                      ) : (
                        <span>🤖 Generate Professional Scope</span>
                      )}
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">Professional Scope of Work (Optional - will appear on separate letterhead page)</label>
                  <textarea value={newEstimate.scope} onChange={(e) => setNewEstimate(prev => ({ ...prev, scope: e.target.value }))} rows={6} placeholder="Professional scope of work will appear here, or you can type manually..." className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500" />
                  
                  {newEstimate.scope && (
                    <button 
                      type="button" 
                      onClick={() => generateLineItemsFromScope()} 
                      className="mt-3 w-full px-4 py-2 bg-yellow-500 text-black font-medium rounded-lg hover:bg-yellow-600 flex items-center justify-center space-x-2"
                    >
                      <span>🤖 Generate Line Items with AI</span>
                    </button>
                  )}
                </div>

                {/* Materials Section - Mobile Optimized */}
                <div className="mt-6">
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-2 gap-2">
                    <label className="block text-sm font-medium text-gray-700">Materials</label>
                    <button type="button" onClick={() => addEstimateItem('materials')} className="text-white px-3 py-1 rounded text-sm hover:bg-opacity-90 w-full sm:w-auto" style={{ backgroundColor: companyInfo.primaryColor }}>Add Material</button>
                  </div>
                  <div className="space-y-2">
                    {newEstimate.materials.map((item, index) => (
                      <div key={index} className="grid grid-cols-1 sm:grid-cols-12 gap-2 p-3 border rounded-lg sm:p-0 sm:border-0 sm:rounded-none">
                        <div className="sm:col-span-5">
                          <label className="block text-xs text-gray-500 sm:hidden">Description</label>
                          <input type="text" placeholder="Description" value={item.description} onChange={(e) => updateEstimateItem('materials', index, 'description', e.target.value)} className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-sm" />
                        </div>
                        <div className="sm:col-span-2">
                          <label className="block text-xs text-gray-500 sm:hidden">Quantity</label>
                          <input type="number" placeholder="Qty" value={item.quantity} onChange={(e) => updateEstimateItem('materials', index, 'quantity', parseFloat(e.target.value) || 0)} className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-sm" />
                        </div>
                        <div className="sm:col-span-2">
                          <label className="block text-xs text-gray-500 sm:hidden">Price</label>
                          <input type="number" placeholder="Price" value={item.rate} onChange={(e) => updateEstimateItem('materials', index, 'rate', parseFloat(e.target.value) || 0)} className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-sm" />
                        </div>
                        <div className="sm:col-span-2">
                          <label className="block text-xs text-gray-500 sm:hidden">Total</label>
                          <input type="text" value={`${(item.amount || 0).toFixed(2)}`} readOnly className="w-full rounded-md border-gray-300 bg-gray-50 text-sm" />
                        </div>
                        <div className="sm:col-span-1 flex justify-center">
                          <button type="button" onClick={() => removeEstimateItem('materials', index)} className="text-red-600 hover:text-red-800 text-sm px-2 py-1 rounded">Remove</button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Labor Section - Mobile Optimized */}
                <div className="mt-6">
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-2 gap-2">
                    <label className="block text-sm font-medium text-gray-700">Labor</label>
                    <button type="button" onClick={() => addEstimateItem('labor')} className="text-white px-3 py-1 rounded text-sm hover:bg-opacity-90 w-full sm:w-auto" style={{ backgroundColor: companyInfo.primaryColor }}>Add Labor</button>
                  </div>
                  <div className="space-y-2">
                    {newEstimate.labor.map((item, index) => (
                      <div key={index} className="grid grid-cols-1 sm:grid-cols-12 gap-2 p-3 border rounded-lg sm:p-0 sm:border-0 sm:rounded-none">
                        <div className="sm:col-span-5">
                          <label className="block text-xs text-gray-500 sm:hidden">Description</label>
                          <input type="text" placeholder="Description" value={item.description} onChange={(e) => updateEstimateItem('labor', index, 'description', e.target.value)} className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-sm" />
                        </div>
                        <div className="sm:col-span-2">
                          <label className="block text-xs text-gray-500 sm:hidden">Hours</label>
                          <input type="number" placeholder="Hours" value={item.hours} onChange={(e) => updateEstimateItem('labor', index, 'hours', parseFloat(e.target.value) || 0)} className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-sm" />
                        </div>
                        <div className="sm:col-span-2">
                          <label className="block text-xs text-gray-500 sm:hidden">Rate</label>
                          <input type="number" placeholder="Rate" value={item.rate} onChange={(e) => updateEstimateItem('labor', index, 'rate', parseFloat(e.target.value) || 0)} className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-sm" />
                        </div>
                        <div className="sm:col-span-2">
                          <label className="block text-xs text-gray-500 sm:hidden">Total</label>
                          <input type="text" value={`${(item.amount || 0).toFixed(2)}`} readOnly className="w-full rounded-md border-gray-300 bg-gray-50 text-sm" />
                        </div>
                        <div className="sm:col-span-1 flex justify-center">
                          <button type="button" onClick={() => removeEstimateItem('labor', index)} className="text-red-600 hover:text-red-800 text-sm px-2 py-1 rounded">Remove</button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Additional Services Section - Mobile Optimized */}
                <div className="mt-6">
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-2 gap-2">
                    <label className="block text-sm font-medium text-gray-700">Additional Services</label>
                    <button type="button" onClick={() => addEstimateItem('additionalServices')} className="text-white px-3 py-1 rounded text-sm hover:bg-opacity-90 w-full sm:w-auto" style={{ backgroundColor: companyInfo.primaryColor }}>Add Service</button>
                  </div>
                  <div className="space-y-2">
                    {newEstimate.additionalServices.map((item, index) => (
                      <div key={index} className="grid grid-cols-1 sm:grid-cols-12 gap-2 p-3 border rounded-lg sm:p-0 sm:border-0 sm:rounded-none">
                        <div className="sm:col-span-5">
                          <label className="block text-xs text-gray-500 sm:hidden">Description</label>
                          <input type="text" placeholder="Description" value={item.description} onChange={(e) => updateEstimateItem('additionalServices', index, 'description', e.target.value)} className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-sm" />
                        </div>
                        <div className="sm:col-span-2">
                          <label className="block text-xs text-gray-500 sm:hidden">Quantity</label>
                          <input type="number" placeholder="Qty" value={item.quantity} onChange={(e) => updateEstimateItem('additionalServices', index, 'quantity', parseFloat(e.target.value) || 0)} className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-sm" />
                        </div>
                        <div className="sm:col-span-2">
                          <label className="block text-xs text-gray-500 sm:hidden">Price</label>
                          <input type="number" placeholder="Price" value={item.rate} onChange={(e) => updateEstimateItem('additionalServices', index, 'rate', parseFloat(e.target.value) || 0)} className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-sm" />
                        </div>
                        <div className="sm:col-span-2">
                          <label className="block text-xs text-gray-500 sm:hidden">Total</label>
                          <input type="text" value={`${(item.amount || 0).toFixed(2)}`} readOnly className="w-full rounded-md border-gray-300 bg-gray-50 text-sm" />
                        </div>
                        <div className="sm:col-span-1 flex justify-center">
                          <button type="button" onClick={() => removeEstimateItem('additionalServices', index)} className="text-red-600 hover:text-red-800 text-sm px-2 py-1 rounded">Remove</button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="mt-4 p-4 rounded" style={{ backgroundColor: `${companyInfo.secondaryColor}10` }}>
                  <div className="text-right space-y-2">
                    <div className="flex justify-between"><span>Materials Total:</span><span>${calculateEstimateTotal(newEstimate.materials, newEstimate.labor, newEstimate.additionalServices).materialsTotal.toFixed(2)}</span></div>
                    <div className="flex justify-between"><span>Labor Total:</span><span>${calculateEstimateTotal(newEstimate.materials, newEstimate.labor, newEstimate.additionalServices).laborTotal.toFixed(2)}</span></div>
                    <div className="flex justify-between"><span>Additional Services:</span><span>${calculateEstimateTotal(newEstimate.materials, newEstimate.labor, newEstimate.additionalServices).servicesTotal.toFixed(2)}</span></div>
                    <div className="flex justify-between"><span>Subtotal:</span><span>${calculateEstimateTotal(newEstimate.materials, newEstimate.labor, newEstimate.additionalServices).subtotal.toFixed(2)}</span></div>
                    <div className="flex justify-between"><span>Tax (8%):</span><span>${calculateEstimateTotal(newEstimate.materials, newEstimate.labor, newEstimate.additionalServices).tax.toFixed(2)}</span></div>
                    <div className="flex justify-between font-semibold text-lg border-t pt-2" style={{ color: companyInfo.primaryColor }}><span>Total:</span><span>${calculateEstimateTotal(newEstimate.materials, newEstimate.labor, newEstimate.additionalServices).total.toFixed(2)}</span></div>
                  </div>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row justify-end space-y-2 sm:space-y-0 sm:space-x-4 mt-6">
                <button type="button" onClick={() => setShowNewEstimateForm(false)} className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50">Cancel</button>
                <button type="button" onClick={saveEstimate} className="px-6 py-2 text-white rounded-lg flex items-center justify-center space-x-2 hover:bg-opacity-90" style={{ backgroundColor: companyInfo.primaryColor }}>
                  <Save className="w-4 h-4" />
                  <span>Save Estimate</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {showNewClientForm && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50 p-4">
          <div className="relative top-4 sm:top-20 mx-auto border w-full max-w-2xl shadow-lg rounded-md bg-white">
            <div className="p-3 sm:p-5">
              <h3 className="text-lg font-medium mb-4" style={{ color: companyInfo.secondaryColor }}>New Client</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Name</label>
                  <input type="text" value={newClient.name} onChange={(e) => setNewClient(prev => ({ ...prev, name: e.target.value }))} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Company</label>
                  <input type="text" value={newClient.company} onChange={(e) => setNewClient(prev => ({ ...prev, company: e.target.value }))} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Email</label>
                  <input type="email" value={newClient.email} onChange={(e) => setNewClient(prev => ({ ...prev, email: e.target.value }))} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Phone</label>
                  <input type="tel" value={newClient.phone} onChange={(e) => setNewClient(prev => ({ ...prev, phone: e.target.value }))} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Address</label>
                  <textarea value={newClient.address} onChange={(e) => setNewClient(prev => ({ ...prev, address: e.target.value }))} rows={3} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500" />
                </div>
              </div>
              <div className="flex flex-col sm:flex-row justify-end space-y-2 sm:space-y-0 sm:space-x-4 mt-6">
                <button type="button" onClick={() => setShowNewClientForm(false)} className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50">Cancel</button>
                <button type="button" onClick={saveClient} className="px-6 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-lg flex items-center justify-center space-x-2">
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
