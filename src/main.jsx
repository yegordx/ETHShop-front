import { createRoot } from 'react-dom/client'
import { ThirdwebProvider } from "thirdweb/react";
import { createThirdwebClient } from "thirdweb";
import App from './App.jsx'
import './index.css'



createRoot(document.getElementById('root')).render(
  <ThirdwebProvider>
    <App />
  </ThirdwebProvider>
)
