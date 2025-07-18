# 🚗 Carvix – AI-Driven 3D & AR Vehicle Customization Platform

> **Personalize. Visualize. Revolutionize.**  
> An immersive platform where design meets intelligence. Customize cars in 3D, preview in AR, and get AI-powered suggestions—all in real time.

![Carvix Banner](https://images.unsplash.com/photo-1739613563958-9b8751121726?auto=format&fit=crop&w=1350&q=80)

---

## ✨ Features

### 🔧 **Real-Time 3D Car Customization** ✅ IMPLEMENTED
- **Universal 3D Model Support**: Works with any 3D model regardless of element naming conventions
- **AI-Powered Material Detection**: Automatically detects paintable surfaces using intelligent pattern matching
- **Real-Time Color Application**: Dynamic color changes with preserved textures and materials
- **Advanced Wheel & Interior Customization**: Smart detection and customization of wheels and interior elements
- **Interactive 3D Controls**: Rotate, zoom, and explore with smooth animations

### 🌐 **Web AR Visualization** ✅ IMPLEMENTED
- **Cross-Platform AR**: Works on compatible smartphones and tablets via WebXR
- **Real-World Placement**: View your custom car in your actual environment
- **Interactive AR Controls**: Scale, rotate, and position your car in AR space
- **Screenshot & Sharing**: Capture and share your AR experience

### 🤖 **AI Design Assistant** ✅ IMPLEMENTED
- **Intelligent Recommendations**: AI-powered suggestions based on trends and user preferences
- **Performance-Aware Suggestions**: Wheel recommendations considering aerodynamics and performance
- **Color Harmony Analysis**: Smart interior suggestions based on exterior color choices
- **Trending Analysis**: Real-time color and style recommendations
- **Confidence Scoring**: Each suggestion comes with AI confidence levels
- **One-Click Application**: Apply AI suggestions instantly to your build

### 🔐 **Real Authentication & Cloud Storage** ✅ IMPLEMENTED
- **Firebase Authentication**: Secure Google and GitHub OAuth integration
- **Cloud-Based Build Storage**: Save builds securely to Firebase Firestore
- **Cross-Device Access**: Access your designs from any device
- **User Profiles**: Personalized preferences and build history
- **Manufacturer Portal**: Separate authentication for car manufacturers

### 🏭 **Production-Ready Manufacturing Pipeline** ✅ IMPLEMENTED
- **Manufacturing Specifications Export**: Generate production-ready JSON specifications
- **Paint Code Generation**: Automatic paint code generation for manufacturing
- **Material Lists**: Detailed material specifications for production
- **Quality Control Guidelines**: Comprehensive QC checkpoints and testing requirements
- **Cost Breakdown**: Detailed manufacturing cost analysis
- **Export Formats**: Downloadable specifications for manufacturing systems

### 🎨 **Advanced Customization Features** ✅ IMPLEMENTED
- **Real-Time Price Calculation**: Dynamic pricing updates as you customize
- **Package Management**: Comprehensive feature packages with detailed breakdowns
- **Build Sharing**: Public sharing with customizable descriptions and tags
- **Build History**: Complete history of all your custom builds
- **Favorites System**: Save and manage your favorite configurations

---

## 🚀 Live Demo

🌍 [**Try It Live**](https://carvix.vercel.app)  
🎥 [**Project Walkthrough**](https://your-video-link.com)

---

## 🛠 Tech Stack

| Layer        | Technologies |
|--------------|--------------|
| **Frontend** | React.js, TypeScript, Tailwind CSS, Three.js, WebXR |
| **3D Graphics** | Three.js, React Three Fiber, Drei |
| **AI/ML** | Custom AI Engine, Pattern Recognition, Trend Analysis |
| **Backend**  | Firebase (Authentication, Firestore, Storage) |
| **Authentication** | Firebase Auth, Google OAuth, GitHub OAuth |
| **Cloud Storage** | Firebase Firestore, Real-time synchronization |
| **Deployment** | Vercel (Frontend), Firebase (Backend) |
| **DevOps**   | GitHub Actions, CI/CD Pipelines |

---

## 📸 Screenshots

| 3D Car Customizer | AI Design Assistant | AR Preview |
|-------------------|-------------------|------------|
| ![3D View](https://images.unsplash.com/photo-1739613562425-c10d7bfc2352?auto=format&fit=crop&w=600&q=80) | ![AI Suggestions](https://images.unsplash.com/photo-1581091871235-868c13b39a42?auto=format&fit=crop&w=600&q=80) | ![AR Preview](https://plus.unsplash.com/premium_photo-1733317438378-1d6a0b8e65e7?auto=format&fit=crop&w=600&q=80) |

---

## 🧠 AI Integration

Carvix's AI module provides:

### **Smart Material Detection** ✅
- **Universal 3D Model Support**: Works with any 3D model regardless of naming conventions
- **Intelligent Pattern Matching**: Detects car body materials using AI algorithms
- **Geometry Analysis**: Analyzes mesh characteristics to identify paintable surfaces
- **Fallback Mechanisms**: Intelligent fallbacks when specific materials aren't found

### **Design Recommendations** ✅
- **Trending Color Analysis**: Real-time color popularity and trend analysis
- **Performance Optimization**: Wheel and package suggestions based on performance metrics
- **Color Harmony**: Interior suggestions based on exterior color psychology
- **User Preference Learning**: Adapts to individual user style preferences

### **Confidence Scoring** ✅
- **Multi-Factor Analysis**: Combines trends, preferences, and performance data
- **Real-Time Scoring**: Dynamic confidence levels for each recommendation
- **Explainable AI**: Clear reasoning for each suggestion provided

---

## 🔧 Universal 3D Model Solution

### **The Problem Solved** ✅
Traditional 3D customization systems fail when users upload different 3D models because:
- Material names vary between models (e.g., "CarBody" vs "Vehicle_Exterior")
- Element hierarchies differ across modeling software
- No standardized naming conventions exist

### **Our AI-Powered Solution** ✅
- **Pattern Recognition**: AI detects car body materials using naming patterns and geometry analysis
- **Intelligent Fallbacks**: When specific materials aren't found, AI identifies the largest mesh as the car body
- **Universal Compatibility**: Works with models from Blender, Maya, 3ds Max, or any 3D software
- **Real-Time Adaptation**: Automatically adapts to any 3D model structure

---

## 💻 Getting Started

### 1. Clone the repository

```bash
git clone https://github.com/Prudvi337/carvix.git
cd carvix
```

### 2. Install dependencies

```bash
npm install
```

### 3. Set up Firebase

Create a Firebase project and add your configuration to `src/services/auth.ts`:

```typescript
const firebaseConfig = {
  apiKey: "your-api-key",
  authDomain: "your-project.firebaseapp.com",
  projectId: "your-project-id",
  storageBucket: "your-project.appspot.com",
  messagingSenderId: "your-sender-id",
  appId: "your-app-id"
};
```

### 4. Run the application

```bash
npm run dev 
```

### 5. Open in browser

```
http://localhost:3000
```

---

## 🔐 Authentication Setup

### Google OAuth
1. Enable Google Authentication in Firebase Console
2. Add authorized domains
3. Configure OAuth consent screen

### GitHub OAuth
1. Create GitHub OAuth App
2. Add client ID and secret to Firebase
3. Configure callback URLs

---

## 🏭 Manufacturing Integration

### Export Manufacturing Specifications
1. Customize your vehicle
2. Click "Export" button
3. Download production-ready JSON specifications
4. Import into manufacturing systems

### Specifications Include:
- **Paint Codes**: Standardized paint codes for production
- **Material Lists**: Complete material specifications
- **Quality Control**: QC checkpoints and testing requirements
- **Cost Analysis**: Detailed manufacturing cost breakdown

---

## 🤝 Contributing

Want to make Carvix even better? Contributions are welcome!

```bash
# Fork it
git checkout -b feature/YourFeature
git commit -m "Add: Your Feature"
git push origin feature/YourFeature
```

### Development Guidelines
- Follow TypeScript best practices
- Use the existing component library
- Test AI features thoroughly
- Ensure 3D model compatibility

---

## 📜 License

Licensed under [MIT License](./LICENSE)

---

## 📬 Connect With Me

**Prudvi Kumar Reddy. P**
📫 Email: [prudvireddy7733@gmail.com](mailto:prudvireddy7733@gmail.com)
🌐 Portfolio: [prudvi-kumar-reddy.vercel.app](https://prudvi-kumar-reddy.vercel.app)
🐙 GitHub: [@Prudvi337](https://github.com/Prudvi337)
💼 LinkedIn: [@prudvi-kumar-reddy](https://www.linkedin.com/in/prudvi-kumar-reddy-5679662a5)

---

## 🎯 Roadmap

### Phase 2 Features (Coming Soon)
- **Advanced AI**: Machine learning for personalized recommendations
- **VR Support**: Full virtual reality customization experience
- **Collaborative Design**: Real-time collaborative car customization
- **Advanced Analytics**: Detailed user behavior and preference analytics
- **Mobile App**: Native iOS and Android applications

---

> 🚘 **Carvix** is making personalized vehicle design accessible, intelligent, and sustainable — delivering a premium user experience with modern tech and AI-powered innovation.
