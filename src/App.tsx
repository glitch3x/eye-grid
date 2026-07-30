import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom'
import { Landing } from './pages/Landing'
import { Dashboard } from './pages/Dashboard'
import { Login } from './pages/Login'
import { Incidents } from './pages/Incidents'
import { CameraHub } from './pages/CameraHub'
import { ModelConfig } from './pages/ModelConfig'
import { AccessLogs } from './pages/AccessLogs'
import { FacialRecognition } from './pages/FacialRecognition'
import { Analytics } from './pages/Analytics'
import { Settings } from './pages/Settings'
import { AppProvider, useApp } from './context/AppContext'

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const isAuthenticated = localStorage.getItem('isAuthenticated') === 'true'
  const location = useLocation()

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />
  }
  
  return <>{children}</>
}

// Global invert wrapper for the hackathon "Light Mode" trick
function AppContent() {
  const { settings } = useApp();
  
  // Apply a hackathon light mode via CSS filter
  const isLightMode = !settings.darkMode;
  const themeClass = isLightMode ? "theme-light" : "";
  
  return (
    <div className={themeClass} style={isLightMode ? { filter: 'invert(1) hue-rotate(180deg)', minHeight: '100vh', backgroundColor: '#fff' } : {}}>
      <style>
        {`
          /* Reverse invert on images and videos so they look normal in light mode */
          .theme-light img, .theme-light video, .theme-light canvas {
            filter: invert(1) hue-rotate(180deg);
          }
        `}
      </style>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/login" element={<Login />} />
        
        {/* Protected Dashboard Routes */}
        <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
        <Route path="/dashboard/incidents" element={<ProtectedRoute><Incidents /></ProtectedRoute>} />
        <Route path="/dashboard/cameras" element={<ProtectedRoute><CameraHub /></ProtectedRoute>} />
        <Route path="/dashboard/config" element={<ProtectedRoute><ModelConfig /></ProtectedRoute>} />
        <Route path="/dashboard/access" element={<ProtectedRoute><AccessLogs /></ProtectedRoute>} />
        <Route path="/dashboard/faces" element={<ProtectedRoute><FacialRecognition /></ProtectedRoute>} />
        <Route path="/dashboard/analytics" element={<ProtectedRoute><Analytics /></ProtectedRoute>} />
        <Route path="/dashboard/settings" element={<ProtectedRoute><Settings /></ProtectedRoute>} />
        
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </div>
  );
}

function App() {
  return (
    <AppProvider>
      <Router>
        <AppContent />
      </Router>
    </AppProvider>
  )
}

export default App
