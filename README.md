# NoiseNet - Crowd-Powered Noise Pollution Mapper

![NoiseNet](https://img.shields.io/badge/NoiseNet-Frontend-blue)
![React](https://img.shields.io/badge/React-18-61DAFB)
![Vite](https://img.shields.io/badge/Vite-5-646CFF)
![Leaflet](https://img.shields.io/badge/Leaflet-Maps-green)

NoiseNet is a crowd-powered noise pollution mapping application that enables communities to track, report, and visualize noise levels in real-time. By leveraging community participation, NoiseNet helps create awareness about noise pollution and provides valuable data for urban planning and policy-making.

## 🚀 Features

### Currently Implemented (Frontend)
- **Interactive Landing Page**: Engaging hero section with feature overview and call-to-action
- **Noise Report Form**: Complete form for submitting noise reports with:
  - Location detection and manual input
  - Decibel level measurement (simulated) with microphone integration
  - Noise type categorization (Traffic, Aircraft, Construction, Social/Music, Other)
  - Detailed description field
- **Interactive Noise Map**: Real-time visualization with:
  - Leaflet-based mapping with OpenStreetMap tiles
  - Color-coded noise level markers
  - Filtering by noise type, time range, and decibel levels
  - Detailed popups with noise information
  - Live statistics and legend
- **Responsive Design**: Mobile-first approach with modern UI/UX
- **Navigation**: Clean, intuitive navigation between app sections

### Planned Features
- **Backend Integration**: Java Spring Boot API
- **User Authentication**: OAuth2 and JWT-based authentication
- **Real-time Updates**: WebSocket integration for live data
- **Vote System**: Community voting on noise issues
- **Data Analytics**: Advanced filtering and reporting
- **Mobile App**: React Native mobile application
- **AI Moderation**: Automated content filtering and validation

## 🛠️ Technology Stack

### Frontend
- **React 18**: Modern functional components with hooks
- **Vite**: Fast development build tool
- **Leaflet & React-Leaflet**: Interactive mapping
- **Lucide React**: Modern icon library
- **CSS3**: Custom styling with responsive design

### Planned Backend
- **Java Spring Boot**: RESTful API development
- **PostgreSQL**: Spatial data storage with PostGIS
- **Spring Security**: Authentication and authorization
- **Docker**: Containerization for deployment

## 🏃‍♂️ Getting Started

### Prerequisites
- Node.js (v18 or higher)
- npm or yarn package manager

### Installation

1. **Clone the repository**
```bash
git clone https://github.com/yourusername/NoiseNet.git
cd NoiseNet
```

2. **Install dependencies**
```bash
npm install
```

3. **Start the development server**
```bash
npm run dev
```

4. **Open your browser**
Navigate to `http://localhost:5173` to view the application.

### Available Scripts

- `npm run dev` - Start development server with hot reload
- `npm run build` - Build the project for production
- `npm run preview` - Preview the production build locally
- `npm run lint` - Run ESLint for code quality checks

## 🗺️ Project Structure

```
NoiseNet/
├── src/
│   ├── components/
│   │   ├── LandingPage.jsx          # Hero section and app overview
│   │   ├── NoiseReportForm.jsx      # Noise reporting interface
│   │   └── NoiseMap.jsx             # Interactive map with filters
│   ├── App.jsx                      # Main application component
│   ├── App.css                      # Application styles
│   ├── index.css                    # Global styles
│   └── main.jsx                     # Application entry point
├── .github/
│   └── copilot-instructions.md      # GitHub Copilot guidelines
├── .vscode/
│   └── tasks.json                   # VS Code task configuration
└── README.md                        # Project documentation
```

## 🎯 Current Development Status

**✅ Completed:**
- Frontend application structure
- Core UI components and navigation
- Noise reporting form with location services
- Interactive map with sample data
- Responsive design implementation
- Development environment setup

**🚧 In Progress:**
- Backend API development (Java Spring Boot)
- Database schema design
- Real microphone integration
- User authentication system

**📋 Planned:**
- Backend integration
- Real-time data synchronization
- Advanced filtering and analytics
- Mobile application
- Deployment and DevOps setup

## 🤝 Contributing

NoiseNet is an open-source project focused on environmental and social impact. Contributions are welcome!

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📊 Sample Data

The application currently uses sample noise data for demonstration purposes. In production, this will be replaced with real-time data from the backend API and user submissions.

## 🌍 Environmental Impact

NoiseNet aims to:
- Raise awareness about noise pollution in urban areas
- Provide data-driven insights for city planners
- Enable communities to advocate for quieter environments
- Support research into noise pollution and public health

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- OpenStreetMap for providing free mapping data
- Leaflet for the excellent mapping library
- The React and Vite communities for amazing development tools

---

**Built with ❤️ for a quieter world** 🌍🔇
