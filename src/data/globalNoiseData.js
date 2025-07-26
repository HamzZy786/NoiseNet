// Global noise pollution sample data
export const globalNoiseData = [
  // Major Cities - Traffic Noise
  { id: 1, latitude: 40.7128, longitude: -74.0060, noiseLevel: 78, noiseType: 'traffic', description: 'Heavy traffic in Manhattan', location: 'New York City, USA', timestamp: '2024-01-26T09:30:00Z', votes: 42 },
  { id: 2, latitude: 51.5074, longitude: -0.1278, noiseLevel: 72, noiseType: 'traffic', description: 'London rush hour traffic', location: 'London, UK', timestamp: '2024-01-26T08:15:00Z', votes: 35 },
  { id: 3, latitude: 35.6762, longitude: 139.6503, noiseLevel: 75, noiseType: 'traffic', description: 'Shibuya crossing traffic', location: 'Tokyo, Japan', timestamp: '2024-01-26T18:45:00Z', votes: 28 },
  { id: 4, latitude: 48.8566, longitude: 2.3522, noiseLevel: 69, noiseType: 'traffic', description: 'Champs-Élysées traffic', location: 'Paris, France', timestamp: '2024-01-26T17:20:00Z', votes: 23 },
  { id: 5, latitude: 55.7558, longitude: 37.6173, noiseLevel: 73, noiseType: 'traffic', description: 'Red Square area traffic', location: 'Moscow, Russia', timestamp: '2024-01-26T14:30:00Z', votes: 19 },

  // Airport Noise
  { id: 6, latitude: 40.6413, longitude: -73.7781, noiseLevel: 85, noiseType: 'aircraft', description: 'JFK Airport aircraft noise', location: 'New York, USA', timestamp: '2024-01-26T12:15:00Z', votes: 67 },
  { id: 7, latitude: 51.4700, longitude: -0.4543, noiseLevel: 82, noiseType: 'aircraft', description: 'Heathrow flight path', location: 'London, UK', timestamp: '2024-01-26T11:30:00Z', votes: 54 },
  { id: 8, latitude: 35.5494, longitude: 139.7798, noiseLevel: 80, noiseType: 'aircraft', description: 'Haneda Airport takeoffs', location: 'Tokyo, Japan', timestamp: '2024-01-26T16:45:00Z', votes: 41 },
  { id: 9, latitude: 49.0097, longitude: 2.5479, noiseLevel: 79, noiseType: 'aircraft', description: 'Charles de Gaulle departures', location: 'Paris, France', timestamp: '2024-01-26T13:20:00Z', votes: 38 },
  { id: 10, latitude: -33.9399, longitude: 151.1753, noiseLevel: 77, noiseType: 'aircraft', description: 'Sydney Airport noise', location: 'Sydney, Australia', timestamp: '2024-01-26T22:10:00Z', votes: 29 },

  // Construction Sites
  { id: 11, latitude: 40.7589, longitude: -73.9851, noiseLevel: 88, noiseType: 'construction', description: 'Central Park construction', location: 'New York, USA', timestamp: '2024-01-26T10:00:00Z', votes: 156 },
  { id: 12, latitude: 52.5200, longitude: 13.4050, noiseLevel: 84, noiseType: 'construction', description: 'Berlin infrastructure project', location: 'Berlin, Germany', timestamp: '2024-01-26T09:45:00Z', votes: 92 },
  { id: 13, latitude: 39.9042, longitude: 116.4074, noiseLevel: 86, noiseType: 'construction', description: 'Beijing development site', location: 'Beijing, China', timestamp: '2024-01-26T14:15:00Z', votes: 78 },
  { id: 14, latitude: 19.4326, longitude: -99.1332, noiseLevel: 81, noiseType: 'construction', description: 'Mexico City metro construction', location: 'Mexico City, Mexico', timestamp: '2024-01-26T15:30:00Z', votes: 63 },
  { id: 15, latitude: -23.5558, longitude: -46.6396, noiseLevel: 83, noiseType: 'construction', description: 'São Paulo building project', location: 'São Paulo, Brazil', timestamp: '2024-01-26T11:20:00Z', votes: 47 },

  // Entertainment Districts
  { id: 16, latitude: 40.7505, longitude: -73.9934, noiseLevel: 76, noiseType: 'social', description: 'Times Square street performers', location: 'New York, USA', timestamp: '2024-01-26T20:30:00Z', votes: 85 },
  { id: 17, latitude: 51.5145, longitude: -0.1447, noiseLevel: 74, noiseType: 'social', description: 'Covent Garden performances', location: 'London, UK', timestamp: '2024-01-26T19:15:00Z', votes: 62 },
  { id: 18, latitude: 35.6586, longitude: 139.7454, noiseLevel: 79, noiseType: 'social', description: 'Harajuku street music', location: 'Tokyo, Japan', timestamp: '2024-01-26T21:00:00Z', votes: 73 },
  { id: 19, latitude: 48.8534, longitude: 2.3488, noiseLevel: 71, noiseType: 'social', description: 'Latin Quarter nightlife', location: 'Paris, France', timestamp: '2024-01-26T23:45:00Z', votes: 48 },
  { id: 20, latitude: 55.7539, longitude: 37.6208, noiseLevel: 68, noiseType: 'social', description: 'Arbat Street musicians', location: 'Moscow, Russia', timestamp: '2024-01-26T20:00:00Z', votes: 34 },

  // Industrial Areas
  { id: 21, latitude: 40.6892, longitude: -74.0445, noiseLevel: 82, noiseType: 'other', description: 'Industrial area machinery', location: 'New York, USA', timestamp: '2024-01-26T14:00:00Z', votes: 27 },
  { id: 22, latitude: 51.4816, longitude: -0.0481, noiseLevel: 79, noiseType: 'other', description: 'Canary Wharf construction', location: 'London, UK', timestamp: '2024-01-26T16:30:00Z', votes: 31 },
  { id: 23, latitude: 35.6804, longitude: 139.7690, noiseLevel: 77, noiseType: 'other', description: 'Tsukiji market activity', location: 'Tokyo, Japan', timestamp: '2024-01-26T05:45:00Z', votes: 19 },
  { id: 24, latitude: 48.8742, longitude: 2.3470, noiseLevel: 75, noiseType: 'other', description: 'Montmartre renovation', location: 'Paris, France', timestamp: '2024-01-26T12:00:00Z', votes: 22 },
  { id: 25, latitude: 55.7887, longitude: 37.6318, noiseLevel: 74, noiseType: 'other', description: 'Metro line construction', location: 'Moscow, Russia', timestamp: '2024-01-26T11:15:00Z', votes: 16 },

  // Emerging Markets Data
  { id: 26, latitude: 28.6139, longitude: 77.2090, noiseLevel: 84, noiseType: 'traffic', description: 'Delhi traffic congestion', location: 'New Delhi, India', timestamp: '2024-01-26T16:45:00Z', votes: 89 },
  { id: 27, latitude: -22.9068, longitude: -43.1729, noiseLevel: 78, noiseType: 'social', description: 'Copacabana beach events', location: 'Rio de Janeiro, Brazil', timestamp: '2024-01-26T22:30:00Z', votes: 56 },
  { id: 28, latitude: -26.2041, longitude: 28.0473, noiseLevel: 81, noiseType: 'construction', description: 'Johannesburg urban development', location: 'Johannesburg, South Africa', timestamp: '2024-01-26T13:20:00Z', votes: 43 },
  { id: 29, latitude: 30.0444, longitude: 31.2357, noiseLevel: 77, noiseType: 'traffic', description: 'Cairo downtown traffic', location: 'Cairo, Egypt', timestamp: '2024-01-26T15:10:00Z', votes: 38 },
  { id: 30, latitude: 1.3521, longitude: 103.8198, noiseLevel: 70, noiseType: 'aircraft', description: 'Changi Airport vicinity', location: 'Singapore', timestamp: '2024-01-26T19:25:00Z', votes: 33 },

  // Additional Points for Better Coverage
  { id: 31, latitude: 59.9311, longitude: 30.3609, noiseLevel: 67, noiseType: 'traffic', description: 'St. Petersburg traffic', location: 'St. Petersburg, Russia', timestamp: '2024-01-26T13:15:00Z', votes: 21 },
  { id: 32, latitude: 41.9028, longitude: 12.4964, noiseLevel: 71, noiseType: 'social', description: 'Rome tourist areas', location: 'Rome, Italy', timestamp: '2024-01-26T18:00:00Z', votes: 38 },
  { id: 33, latitude: 25.2048, longitude: 55.2708, noiseLevel: 76, noiseType: 'construction', description: 'Dubai construction boom', location: 'Dubai, UAE', timestamp: '2024-01-26T12:30:00Z', votes: 54 },
  { id: 34, latitude: -37.8136, longitude: 144.9631, noiseLevel: 65, noiseType: 'traffic', description: 'Melbourne city center', location: 'Melbourne, Australia', timestamp: '2024-01-26T21:45:00Z', votes: 29 },
  { id: 35, latitude: 49.2827, longitude: -123.1207, noiseLevel: 63, noiseType: 'other', description: 'Vancouver harbor activity', location: 'Vancouver, Canada', timestamp: '2024-01-26T16:15:00Z', votes: 22 }
];
