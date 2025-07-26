import React, { useState } from 'react';
import * as XLSX from 'xlsx';

const ExcelTest = () => {
  const [testResult, setTestResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const testExcelFile = async () => {
    setLoading(true);
    setTestResult(null);
    
    try {
      console.log('Testing Excel file access...');
      
      // Try to fetch the file
      const response = await fetch('/noise-data.xlsx');
      console.log('Fetch response status:', response.status);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const arrayBuffer = await response.arrayBuffer();
      console.log('File size:', arrayBuffer.byteLength, 'bytes');
      
      // Parse the Excel file
      const workbook = XLSX.read(arrayBuffer, { type: 'array' });
      console.log('Workbook sheets:', workbook.SheetNames);
      
      // Get the first worksheet
      const sheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[sheetName];
      
      // Convert to JSON with headers
      const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });
      console.log('Data rows:', jsonData.length);
      console.log('Headers:', jsonData[0]);
      console.log('Sample row:', jsonData[1]);
      
      setTestResult({
        success: true,
        sheets: workbook.SheetNames,
        rows: jsonData.length,
        headers: jsonData[0],
        sampleRow: jsonData[1],
        sampleData: jsonData.slice(0, 5)
      });
      
    } catch (error) {
      console.error('Excel test failed:', error);
      setTestResult({
        success: false,
        error: error.message
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: '2rem', backgroundColor: 'white', margin: '2rem', borderRadius: '8px' }}>
      <h3>Excel File Test</h3>
      <button 
        onClick={testExcelFile} 
        disabled={loading}
        style={{ 
          padding: '0.5rem 1rem', 
          marginBottom: '1rem',
          backgroundColor: loading ? '#ccc' : '#667eea',
          color: 'white',
          border: 'none',
          borderRadius: '4px',
          cursor: loading ? 'not-allowed' : 'pointer'
        }}
      >
        {loading ? 'Testing...' : 'Test Excel File Access'}
      </button>
      
      {testResult && (
        <div style={{ marginTop: '1rem' }}>
          {testResult.success ? (
            <div style={{ color: 'green' }}>
              <h4>✅ Success!</h4>
              <p><strong>Sheets:</strong> {testResult.sheets.join(', ')}</p>
              <p><strong>Total rows:</strong> {testResult.rows}</p>
              <p><strong>Headers:</strong> {JSON.stringify(testResult.headers)}</p>
              <p><strong>Sample row:</strong> {JSON.stringify(testResult.sampleRow)}</p>
              <details>
                <summary>First 5 rows of data</summary>
                <pre style={{ backgroundColor: '#f5f5f5', padding: '1rem', overflow: 'auto' }}>
                  {JSON.stringify(testResult.sampleData, null, 2)}
                </pre>
              </details>
            </div>
          ) : (
            <div style={{ color: 'red' }}>
              <h4>❌ Failed!</h4>
              <p><strong>Error:</strong> {testResult.error}</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default ExcelTest;
