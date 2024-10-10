import './App.css'
import 'bootstrap/dist/css/bootstrap.min.css'
import Button from 'react-bootstrap/Button'
import Header from './Header/Header'
import Main from './Main/Main'
import FooterComponent from './Footer/Footer'
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Login from './Login/Login'
import Registration from './Reg/Reg'
import Profile from './Profile/Profile'
import  AuthProvider  from './Contexts/AuthProvider'

function App() {
  return (
    <>
      <AuthProvider>
        <BrowserRouter>
          <Header />
          <Routes>
            <Route path="/" index element={<Main />} />
            <Route path="/login" element={<Login />} />
            <Route path="/registration" element={<Registration />} />
            <Route path="/profile" element={<Profile />} />
          </Routes>
          <FooterComponent />
        </BrowserRouter>
      </AuthProvider>
    </>
  );
}

export default App
