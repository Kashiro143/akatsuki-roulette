import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import './index.css'
import App from './App.jsx'
import Test from './test.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    // Dans votre fichier main.jsx / index.jsx
    <BrowserRouter basename="/akatsuki-roulette">
      <Routes>
        <Route path="/" element={<App />} />
        <Route path="/test" element={<Test />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  </StrictMode>,
)