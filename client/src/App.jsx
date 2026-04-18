import { Routes, Route, Navigate } from 'react-router-dom';
import './App.css'
import Homepage from './pages/HomePage';
import Loginpage from './pages/LoginPage';
import Profilepage from './pages/ProfilePage';
import { Toaster } from "react-hot-toast";
import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';

function App() {

  const { authUser } = useContext(AuthContext);

  return (
    <>
      <div style={{ backgroundImage: "url('/bgimage.svg')", backgroundSize: 'cover', backgroundRepeat: 'no-repeat', minHeight: '100vh' }}>

        <Toaster />
        <Routes>
          <Route path='/' element={authUser ? <Homepage /> : <Navigate to="/login" />} />
          <Route path='/login' element={!authUser ? <Loginpage /> : <Navigate to="/" />} />
          <Route path='/profile' element={authUser ? <Profilepage /> : <Navigate to="/login" />} />
        </Routes>

      </div>

    </>
  );
}

export default App;
