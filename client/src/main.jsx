import {BrowserRouter} from "react-router-dom"
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { Authprovider } from "../context/AuthContext.jsx"
import { ChatProvider } from "../context/ChatContext.jsx"

createRoot(document.getElementById('root')).render(
  <BrowserRouter>
  
    <Authprovider>
      <ChatProvider>
        <App />
      </ChatProvider>
    </Authprovider>
   
  </BrowserRouter>,
)
