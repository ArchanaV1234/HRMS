import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import RegistrationForm from './components/Auth/Register.jsx'
import Login from './components/Auth/Login.jsx'
import EmployeeManagement from './components/Dashboard/EmployeeManagement.jsx'
createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
