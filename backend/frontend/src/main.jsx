import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { BrowserRouter } from 'react-router-dom'
import { Routes, Route } from 'react-router-dom';
import TestPage from './pages/TestPage.jsx'

createRoot(document.getElementById('root')).render(
  // <StrictMode>
  <BrowserRouter>
    <Routes>
      <Route path="/" element={<App />} />
      <Route path="/test" element={<TestPage />} />
    </Routes>
  </BrowserRouter>
  // </StrictMode>,
)
