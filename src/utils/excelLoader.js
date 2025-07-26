import * as XLSX from 'xlsx';

export const loadNoiseDataFromExcel = async (filePath) => {
  try {
    // In a web environment, we need to fetch the file
    const response = await fetch(filePath);
    const arrayBuffer = await response.arrayBuffer();
    
    // Parse the Excel file
    const workbook = XLSX.read(arrayBuffer, { type: 'array' });
    
    // Get the first worksheet
    const sheetName = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[sheetName];
    
    // Convert to JSON
    const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });
    
    return parseNoiseData(jsonData);
  } catch (error) {
    console.error('Error loading Excel file:', error);
    return [];
  }
};

const parseNoiseData = (rawData) => {
  if (!rawData || rawData.length < 2) {
    console.warn('No data found in Excel file');
    return [];
  }

  // Get headers from first row
  const headers = rawData[0];
  console.log('Excel headers:', headers);
  
  // Find column indices (case-insensitive search)
  const findColumnIndex = (columnNames) => {
    for (const name of columnNames) {
      const index = headers.findIndex(header => 
        header && header.toString().toLowerCase().includes(name.toLowerCase())
      );
      if (index !== -1) return index;
    }
    return -1;
  };

  const latIndex = findColumnIndex(['lat', 'latitude', 'y', 'coord_y']);
  const lngIndex = findColumnIndex(['lng', 'lon', 'longitude', 'x', 'coord_x']);
  const noiseIndex = findColumnIndex(['noise', 'db', 'decibel', 'sound', 'level']);
  const typeIndex = findColumnIndex(['type', 'category', 'source', 'kind']);
  const timeIndex = findColumnIndex(['time', 'date', 'timestamp', 'when']);
  const descIndex = findColumnIndex(['desc', 'description', 'comment', 'note']);
  const locationIndex = findColumnIndex(['location', 'address', 'place', 'area']);

  console.log('Column mapping:', {
    latitude: latIndex,
    longitude: lngIndex,
    noise: noiseIndex,
    type: typeIndex,
    time: timeIndex,
    description: descIndex,
    location: locationIndex
  });

  // Parse data rows
  const noiseData = [];
  for (let i = 1; i < rawData.length; i++) {
    const row = rawData[i];
    
    // Skip empty rows
    if (!row || row.every(cell => !cell)) continue;
    
    // Extract latitude and longitude
    const latitude = latIndex >= 0 ? parseFloat(row[latIndex]) : null;
    const longitude = lngIndex >= 0 ? parseFloat(row[lngIndex]) : null;
    
    // Skip rows without valid coordinates
    if (!latitude || !longitude || isNaN(latitude) || isNaN(longitude)) {
      continue;
    }
    
    // Extract noise level
    let noiseLevel = noiseIndex >= 0 ? parseFloat(row[noiseIndex]) : null;
    if (!noiseLevel || isNaN(noiseLevel)) {
      // Try to extract number from string
      const noiseCellValue = noiseIndex >= 0 ? row[noiseIndex] : '';
      const match = noiseCellValue?.toString().match(/(\d+(?:\.\d+)?)/);
      noiseLevel = match ? parseFloat(match[1]) : Math.random() * 60 + 30; // Random fallback
    }
    
    // Determine noise type
    let noiseType = 'other';
    const typeValue = typeIndex >= 0 ? row[typeIndex]?.toString().toLowerCase() : '';
    if (typeValue.includes('traffic') || typeValue.includes('car') || typeValue.includes('vehicle')) {
      noiseType = 'traffic';
    } else if (typeValue.includes('aircraft') || typeValue.includes('plane') || typeValue.includes('airport')) {
      noiseType = 'aircraft';
    } else if (typeValue.includes('construction') || typeValue.includes('building') || typeValue.includes('work')) {
      noiseType = 'construction';
    } else if (typeValue.includes('social') || typeValue.includes('music') || typeValue.includes('party')) {
      noiseType = 'social';
    }
    
    // Extract other fields
    const timestamp = timeIndex >= 0 ? row[timeIndex] : new Date().toISOString();
    const description = descIndex >= 0 ? row[descIndex] || '' : `Noise level: ${noiseLevel} dB`;
    const location = locationIndex >= 0 ? row[locationIndex] || '' : `${latitude.toFixed(4)}, ${longitude.toFixed(4)}`;
    
    noiseData.push({
      id: i,
      latitude,
      longitude,
      noiseLevel,
      noiseType,
      description,
      location,
      timestamp,
      votes: Math.floor(Math.random() * 20) + 1 // Random votes for demo
    });
  }
  
  console.log(`Parsed ${noiseData.length} noise data points from Excel`);
  return noiseData;
};

// Helper function to classify noise level
export const classifyNoiseLevel = (dB) => {
  if (dB < 50) return 'quiet';
  if (dB < 70) return 'moderate';
  if (dB < 90) return 'loud';
  return 'very-loud';
};

// Helper function to get noise level color
export const getNoiseColor = (noiseLevel) => {
  if (noiseLevel < 50) return '#4ade80'; // Green - quiet
  if (noiseLevel < 70) return '#fbbf24'; // Yellow - moderate
  if (noiseLevel < 90) return '#f97316'; // Orange - loud
  return '#ef4444'; // Red - very loud
};

// Helper function to get marker size based on noise level
export const getNoiseRadius = (noiseLevel) => {
  return Math.max(8, (noiseLevel / 140) * 30);
};
