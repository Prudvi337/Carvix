import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import React, { Suspense, lazy } from 'react';
import Header from './components/Header';
import Footer from './components/Footer';

// Lazy load pages and components
const Customizer = lazy(() => import('./components/Customizer'));
const Customize = lazy(() => import('./pages/Customize'));
const Home = lazy(() => import('./pages/Home'));
const CostSummary = lazy(() => import('./pages/CostSummary'));
const ARView = lazy(() => import('./components/ARView')); 

function App() {
  return (
    <Router>
      <Header /> 

      <Suspense
        fallback={
          <div style={loadingLineContainerStyle}>
            <div style={loadingLineStyle}></div>
            <div style={{ textAlign: "center", marginTop: "10px", color: "#fff" }}>
              Loading...
            </div>
          </div>
        }
      >
        <Routes>
          {/* Home page route */}
          <Route path="/" element={<Home />} />

          {/* Main customization page */}
          <Route path="/customize" element={<Customize />} />

          {/* Dynamic route for a specific model customization */}
          <Route path="/customize/:modelId" element={<Customizer />} />

          {/* Cost summary page after customization */}
          <Route path="/cost-summary" element={<CostSummary />} />

          {/* AR View page route */}
          <Route path="/ar-view" element={<ARView />} /> 
        </Routes>
      </Suspense>
      <style>
        {`
          @keyframes loadingAnimation {
            0% { transform: translateX(-100%); }
            50% { transform: translateX(0%); }
            100% { transform: translateX(100%); }
          }
        `}
      </style>

      <Footer />
    </Router>
  );
}
const loadingLineContainerStyle = {
  position: "fixed",
  top: 0,
  left: 0,
  width: "100%",
  height: "4px",
  overflow: "hidden",
  zIndex: 9999,
  background: "rgba(255, 255, 255, 0.1)",
};

const loadingLineStyle = {
  height: "100%",
  width: "100%",
  background: "linear-gradient(90deg, #1a73e8, #673ab7, #00c853)",
  position: "absolute",
  animation: "loadingAnimation 1.5s cubic-bezier(0.4, 0.0, 0.2, 1) infinite",
};

export default App;
