import React, { useState, useEffect } from 'react';
import './App.css';

const App = () => {
  const [currentPage, setCurrentPage] = useState('dashboard');
  const [estimates, setEstimates] = useState([]);
  const [clients, setClients] = useState([]);
  const [newEstimate, setNewEstimate] = useState({
    clientName: '',
    jobDescription: '',
    scopeOfWork: '',
    estimatedCost: '',
    notes: ''
  });
  const [selectedEstimate, setSelectedEstimate] = useState(null);
  const [isGenerating, setIsGenerating] = useState(false);

  // Load data from localStorage on mount
  useEffect(() => {
    const savedEstimates = localStorage.getItem('estimates');
    const savedClients = localStorage.getItem('clients');
    
    if (savedEstimates) setEstimates(JSON.parse(savedEstimates));
    if (savedClients) setClients(JSON.parse(savedClients));
  }, []);

  // Save estimates to localStorage
  useEffect(() => {
    localStorage.setItem('estimates', JSON.stringify(estimates));
  }, [estimates]);

  // Save clients to localStorage
  useEffect(() => {
    localStorage.setItem('clients', JSON.stringify(clients));
  }, [clients]);

  const handleGenerateScope = async () => {
    if (!newEstimate.notes.trim()) {
      alert('Please enter notes before generating scope');
      return;
    }

    setIsGenerating(true);
    try {
      const response = await fetch('https://estimate-pro-backend-g2ud.onrender.com/api/generate-scope', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          notes: newEstimate.notes,
          jobDescription: newEstimate.jobDescription
        })
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      setNewEstimate({
        ...newEstimate,
        scopeOfWork: data.scopeOfWork || data.scope || ''
      });
    } catch (error) {
      console.error('Error generating scope:', error);
      alert('Error generating scope. Please try again.');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleCreateEstimate = () => {
    if (!newEstimate.clientName.trim() || !newEstimate.jobDescription.trim()) {
      alert('Please fill in client name and job description');
      return;
    }

    const estimate = {
      id: Date.now(),
      ...newEstimate,
      createdDate: new Date().toLocaleDateString(),
      status: 'pending'
    };

    setEstimates([...estimates, estimate]);
    
    // Add client if new
    if (!clients.some(c => c.name === newEstimate.clientName)) {
      setClients([...clients, { id: Date.now(), name: newEstimate.clientName }]);
    }

    setNewEstimate({
      clientName: '',
      jobDescription: '',
      scopeOfWork: '',
      estimatedCost: '',
      notes: ''
    });

    alert('Estimate created successfully!');
  };

  const handleDeleteEstimate = (id) => {
    if (window.confirm('Are you sure you want to delete this estimate?')) {
      setEstimates(estimates.filter(est => est.id !== id));
    }
  };

  const completedJobs = estimates.filter(est => est.status === 'completed').length;
  const totalEstimates = estimates.length;
  const totalRevenue = estimates.reduce((sum, est) => sum + (parseFloat(est.estimatedCost) || 0), 0);

  // Dashboard Page
  const renderDashboard = () => (
    <div style={styles.dashboard}>
      <h1 style={styles.pageTitle}>Dashboard</h1>
      <div style={styles.statsContainer}>
        <div style={styles.statCard}>
          <div style={styles.statNumber}>{totalEstimates}</div>
          <div style={styles.statLabel}>Total Estimates</div>
        </div>
        <div style={styles.statCard}>
          <div style={styles.statNumber}>{completedJobs}</div>
          <div style={styles.statLabel}>Completed Jobs</div>
        </div>
        <div style={styles.statCard}>
          <div style={styles.statNumber}>${totalRevenue.toFixed(2)}</div>
          <div style={styles.statLabel}>Total Revenue</div>
        </div>
      </div>
    </div>
  );

  // Estimates Page
  const renderEstimates = () => (
    <div style={styles.estimatesPage}>
      <h1 style={styles.pageTitle}>Estimates</h1>
      
      <div style={styles.formContainer}>
        <h2 style={styles.formTitle}>New Estimate</h2>
        
        <div style={styles.formGroup}>
          <label style={styles.label}>Client Name:</label>
          <input
            type="text"
            value={newEstimate.clientName}
            onChange={(e) => setNewEstimate({...newEstimate, clientName: e.target.value})}
            style={styles.input}
            placeholder="Enter client name"
          />
        </div>

        <div style={styles.formGroup}>
          <label style={styles.label}>Job Description:</label>
          <input
            type="text"
            value={newEstimate.jobDescription}
            onChange={(e) => setNewEstimate({...newEstimate, jobDescription: e.target.value})}
            style={styles.input}
            placeholder="Enter job description"
          />
        </div>

        <div style={styles.formGroup}>
          <label style={styles.label}>Notes (for AI scope generation):</label>
          <textarea
            value={newEstimate.notes}
            onChange={(e) => setNewEstimate({...newEstimate, notes: e.target.value})}
            style={{...styles.input, minHeight: '100px', resize: 'vertical'}}
            placeholder="Enter detailed notes about the job..."
          />
        </div>

        <button 
          onClick={handleGenerateScope}
          disabled={isGenerating}
          style={{...styles.button, ...styles.aiButton, opacity: isGenerating ? 0.6 : 1}}
        >
          {isGenerating ? 'Generating Scope...' : 'Generate Professional Scope with AI Learning'}
        </button>

        <div style={styles.formGroup}>
          <label style={styles.label}>Scope of Work:</label>
          <textarea
            value={newEstimate.scopeOfWork}
            onChange={(e) => setNewEstimate({...newEstimate, scopeOfWork: e.target.value})}
            style={{...styles.input, minHeight: '120px', resize: 'vertical'}}
            placeholder="Scope of work (auto-generated or manually entered)"
          />
        </div>

        <div style={styles.formGroup}>
          <label style={styles.label}>Estimated Cost:</label>
          <input
            type="number"
            value={newEstimate.estimatedCost}
            onChange={(e) => setNewEstimate({...newEstimate, estimatedCost: e.target.value})}
            style={styles.input}
            placeholder="Enter estimated cost"
          />
        </div>

        <button 
          onClick={handleCreateEstimate}
          style={{...styles.button, ...styles.createButton}}
        >
          Create Estimate
        </button>
      </div>

      <div style={styles.estimatesList}>
        <h2 style={styles.sectionTitle}>Your Estimates</h2>
        {estimates.length === 0 ? (
          <p style={styles.emptyMessage}>No estimates yet. Create your first estimate above.</p>
        ) : (
          <div>
            {estimates.map(estimate => (
              <div key={estimate.id} style={styles.estimateCard}>
                <div style={styles.estimateHeader}>
                  <h3 style={styles.estimateTitle}>{estimate.clientName} - {estimate.jobDescription}</h3>
                  <span style={{...styles.statusBadge, backgroundColor: estimate.status === 'completed' ? '#4CAF50' : '#FF9800'}}>
                    {estimate.status}
                  </span>
                </div>
                <p><strong>Created:</strong> {estimate.createdDate}</p>
                <p><strong>Estimated Cost:</strong> ${parseFloat(estimate.estimatedCost || 0).toFixed(2)}</p>
                <p><strong>Scope:</strong> {estimate.scopeOfWork}</p>
                <div style={styles.cardActions}>
                  <button 
                    onClick={() => setSelectedEstimate(estimate)}
                    style={{...styles.button, ...styles.viewButton}}
                  >
                    View
                  </button>
                  <button 
                    onClick={() => handleDeleteEstimate(estimate.id)}
                    style={{...styles.button, ...styles.deleteButton}}
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );

  // Clients Page
  const renderClients = () => (
    <div style={styles.clientsPage}>
      <h1 style={styles.pageTitle}>Clients</h1>
      <div style={styles.clientsList}>
        {clients.length === 0 ? (
          <p style={styles.emptyMessage}>No clients yet. Create an estimate to add a client.</p>
        ) : (
          clients.map(client => (
            <div key={client.id} style={styles.clientCard}>
              <h3>{client.name}</h3>
              <p>Estimates: {estimates.filter(e => e.clientName === client.name).length}</p>
            </div>
          ))
        )}
      </div>
    </div>
  );

  // Main render
  return (
    <div style={styles.appContainer}>
      <nav style={styles.navbar}>
        <h1 style={styles.navTitle}>EstimatePro</h1>
        <div style={styles.navButtons}>
          <button 
            onClick={() => setCurrentPage('dashboard')}
            style={{...styles.navButton, backgroundColor: currentPage === 'dashboard' ? '#8B6F47' : 'transparent'}}
          >
            Dashboard
          </button>
          <button 
            onClick={() => setCurrentPage('estimates')}
            style={{...styles.navButton, backgroundColor: currentPage === 'estimates' ? '#8B6F47' : 'transparent'}}
          >
            Estimates
          </button>
          <button 
            onClick={() => setCurrentPage('clients')}
            style={{...styles.navButton, backgroundColor: currentPage === 'clients' ? '#8B6F47' : 'transparent'}}
          >
            Clients
          </button>
        </div>
      </nav>

      <div style={styles.mainContent}>
        {currentPage === 'dashboard' && renderDashboard()}
        {currentPage === 'estimates' && renderEstimates()}
        {currentPage === 'clients' && renderClients()}
      </div>

      {selectedEstimate && (
        <div style={styles.modal}>
          <div style={styles.modalContent}>
            <button 
              onClick={() => setSelectedEstimate(null)}
              style={styles.closeButton}
            >
              ✕
            </button>
            <h2>{selectedEstimate.clientName}</h2>
            <p><strong>Job:</strong> {selectedEstimate.jobDescription}</p>
            <p><strong>Scope:</strong> {selectedEstimate.scopeOfWork}</p>
            <p><strong>Cost:</strong> ${parseFloat(selectedEstimate.estimatedCost || 0).toFixed(2)}</p>
            <p><strong>Notes:</strong> {selectedEstimate.notes}</p>
            <p><strong>Status:</strong> {selectedEstimate.status}</p>
          </div>
        </div>
      )}
    </div>
  );
};

const styles = {
  appContainer: {
    fontFamily: 'Arial, sans-serif',
    backgroundColor: '#f5f5f5',
    minHeight: '100vh',
  },
  navbar: {
    backgroundColor: '#8B6F47',
    color: 'white',
    padding: '15px 30px',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
  },
  navTitle: {
    margin: 0,
    fontSize: '24px',
    fontWeight: 'bold',
  },
  navButtons: {
    display: 'flex',
    gap: '10px',
  },
  navButton: {
    padding: '10px 20px',
    border: 'none',
    borderRadius: '4px',
    color: 'white',
    cursor: 'pointer',
    fontSize: '14px',
    transition: 'background-color 0.3s',
  },
  mainContent: {
    padding: '30px',
    maxWidth: '1200px',
    margin: '0 auto',
  },
  dashboard: {
    padding: '20px',
  },
  statsContainer: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
    gap: '20px',
    marginTop: '20px',
  },
  statCard: {
    backgroundColor: 'white',
    padding: '20px',
    borderRadius: '8px',
    boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
    textAlign: 'center',
  },
  statNumber: {
    fontSize: '36px',
    fontWeight: 'bold',
    color: '#8B6F47',
  },
  statLabel: {
    fontSize: '14px',
    color: '#666',
    marginTop: '10px',
  },
  pageTitle: {
    color: '#333',
    marginBottom: '20px',
  },
  formContainer: {
    backgroundColor: 'white',
    padding: '20px',
    borderRadius: '8px',
    marginBottom: '30px',
    boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
  },
  formTitle: {
    color: '#333',
    marginBottom: '15px',
  },
  formGroup: {
    marginBottom: '15px',
  },
  label: {
    display: 'block',
    marginBottom: '5px',
    fontWeight: 'bold',
    color: '#333',
  },
  input: {
    width: '100%',
    padding: '10px',
    border: '1px solid #ddd',
    borderRadius: '4px',
    fontSize: '14px',
    boxSizing: 'border-box',
  },
  button: {
    padding: '10px 20px',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    fontSize: '14px',
    fontWeight: 'bold',
    transition: 'background-color 0.3s',
  },
  aiButton: {
    backgroundColor: '#4CAF50',
    color: 'white',
    width: '100%',
    marginBottom: '15px',
  },
  createButton: {
    backgroundColor: '#8B6F47',
    color: 'white',
    width: '100%',
  },
  estimatesList: {
    marginTop: '30px',
  },
  sectionTitle: {
    color: '#333',
    marginBottom: '15px',
  },
  estimateCard: {
    backgroundColor: 'white',
    padding: '15px',
    marginBottom: '15px',
    borderRadius: '8px',
    boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
    borderLeft: '4px solid #8B6F47',
  },
  estimateHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '10px',
  },
  estimateTitle: {
    margin: 0,
    color: '#333',
  },
  statusBadge: {
    padding: '5px 10px',
    borderRadius: '20px',
    color: 'white',
    fontSize: '12px',
  },
  cardActions: {
    display: 'flex',
    gap: '10px',
    marginTop: '10px',
  },
  viewButton: {
    backgroundColor: '#2196F3',
    color: 'white',
  },
  deleteButton: {
    backgroundColor: '#f44336',
    color: 'white',
  },
  clientsPage: {
    padding: '20px',
  },
  clientsList: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
    gap: '20px',
  },
  clientCard: {
    backgroundColor: 'white',
    padding: '20px',
    borderRadius: '8px',
    boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
    borderLeft: '4px solid #8B6F47',
  },
  estimatesPage: {
    padding: '20px',
  },
  emptyMessage: {
    color: '#999',
    fontStyle: 'italic',
  },
  modal: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.5)',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000,
  },
  modalContent: {
    backgroundColor: 'white',
    padding: '30px',
    borderRadius: '8px',
    maxWidth: '600px',
    maxHeight: '80vh',
    overflow: 'auto',
    position: 'relative',
  },
  closeButton: {
    position: 'absolute',
    top: '10px',
    right: '10px',
    border: 'none',
    backgroundColor: 'transparent',
    fontSize: '24px',
    cursor: 'pointer',
    color: '#666',
  },
};

export default App;