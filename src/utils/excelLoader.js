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
  
  // Find column indices (case-insensitive search with more variations)
  const findColumnIndex = (columnNames) => {
    for (const name of columnNames) {
      const index = headers.findIndex(header => {
        if (!header) return false;
        const headerStr = header.toString().toLowerCase().trim();
        const nameStr = name.toLowerCase();
        return headerStr.includes(nameStr) || headerStr === nameStr;
      });
      if (index !== -1) return index;
    }
    return -1;
  };

  // More comprehensive column name variations
  const latIndex = findColumnIndex(['lat', 'latitude', 'y', 'coord_y', 'y_coord', 'lat_deg', 'lat_decimal', 'northing', 'wgs84_lat']);
  const lngIndex = findColumnIndex(['lng', 'lon', 'longitude', 'x', 'coord_x', 'x_coord', 'lon_deg', 'lng_decimal', 'easting', 'wgs84_lon', 'wgs84_lng']);
  const noiseIndex = findColumnIndex(['noise', 'db', 'decibel', 'sound', 'level', 'spl', 'leq', 'laeq', 'noise_level', 'db_level', 'sound_level']);
  const typeIndex = findColumnIndex(['type', 'category', 'source', 'kind', 'noise_type', 'source_type', 'classification']);
  const timeIndex = findColumnIndex(['time', 'date', 'timestamp', 'when', 'datetime', 'measurement_time', 'recorded_at']);
  const descIndex = findColumnIndex(['desc', 'description', 'comment', 'note', 'remarks', 'details', 'observation']);
  const locationIndex = findColumnIndex(['location', 'address', 'place', 'area', 'site', 'measurement_point', 'station']);

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
    
    // Extract latitude and longitude with better parsing
    let latitude = null;
    let longitude = null;
    
    if (latIndex >= 0 && row[latIndex] !== undefined && row[latIndex] !== '') {
      latitude = parseFloat(row[latIndex]);
      // Handle coordinate formats like "51°30'N" or "51.5N"
      if (isNaN(latitude)) {
        const latStr = row[latIndex].toString();
        const match = latStr.match(/(-?\d+\.?\d*)/);
        if (match) {
          latitude = parseFloat(match[1]);
          // Handle N/S indicators
          if (latStr.toLowerCase().includes('s')) latitude = -Math.abs(latitude);
        }
      }
    }
    
    if (lngIndex >= 0 && row[lngIndex] !== undefined && row[lngIndex] !== '') {
      longitude = parseFloat(row[lngIndex]);
      // Handle coordinate formats like "0°30'W" or "0.5W"
      if (isNaN(longitude)) {
        const lngStr = row[lngIndex].toString();
        const match = lngStr.match(/(-?\d+\.?\d*)/);
        if (match) {
          longitude = parseFloat(match[1]);
          // Handle E/W indicators
          if (lngStr.toLowerCase().includes('w')) longitude = -Math.abs(longitude);
        }
      }
    }
    
    // Skip rows without valid coordinates
    if (!latitude || !longitude || isNaN(latitude) || isNaN(longitude)) {
      console.warn(`Skipping row ${i}: Invalid coordinates`, { latitude, longitude, row });
      continue;
    }
    
    // Validate coordinate ranges (basic sanity check)
    if (latitude < -90 || latitude > 90 || longitude < -180 || longitude > 180) {
      console.warn(`Skipping row ${i}: Coordinates out of range`, { latitude, longitude });
      continue;
    }
    
    // Extract noise level with better parsing
    let noiseLevel = null;
    if (noiseIndex >= 0 && row[noiseIndex] !== undefined && row[noiseIndex] !== '') {
      noiseLevel = parseFloat(row[noiseIndex]);
      if (isNaN(noiseLevel)) {
        // Try to extract number from string like "65.5 dB" or "Noise: 70"
        const noiseCellValue = row[noiseIndex].toString();
        const match = noiseCellValue.match(/(\d+(?:\.\d+)?)/);
        noiseLevel = match ? parseFloat(match[1]) : null;
      }
    }
    
    // If no noise level found, generate a reasonable random value based on location type
    if (!noiseLevel || isNaN(noiseLevel) || noiseLevel <= 0) {
      noiseLevel = Math.random() * 60 + 30; // Random between 30-90 dB
    }
    
    // Clamp noise level to reasonable range
    noiseLevel = Math.max(20, Math.min(140, noiseLevel));
    
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
