// Replace the generateScope function in your React app with this code:
// This function now calls your backend API instead of calling Claude directly

const generateScope = async () => {
  if (!rawScope.trim()) {
    alert('Please enter raw scope notes first');
    return;
  }

  setIsGeneratingScope(true);
  setGeneratedScope('');
  setError('');

  try {
    const response = await fetch('/api/generateScope', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        rawScope: rawScope
      })
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Failed to generate scope');
    }

    const data = await response.json();
    
    if (data.success) {
      setGeneratedScope(data.professionalScope);
      
      // Optionally: Log for AI learning (if you want to track patterns)
      console.log('Scope generated successfully', {
        timestamp: new Date().toISOString(),
        inputLength: rawScope.length,
        outputLength: data.professionalScope.length
      });
    } else {
      throw new Error(data.error || 'Unknown error occurred');
    }
  } catch (error) {
    console.error('Error generating scope:', error);
    setError('Failed to generate professional scope: ' + error.message);
    setGeneratedScope('');
  } finally {
    setIsGeneratingScope(false);
  }
};
