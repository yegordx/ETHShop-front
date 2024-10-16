import './App.css'
import 'bootstrap/dist/css/bootstrap.min.css'
import Button from 'react-bootstrap/Button'
import Header from './Header/Header'
import Main from './Main/Main'
import FooterComponent from './Footer/Footer'
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Login from './Login/Login'
import Registration from './Reg/Reg'
import UserProfile from './Profile/UserProfile'
import SellerProfile from './Profile/SellerProfile'
import AuthProvider  from './Contexts/AuthProvider'
import RegSeller from './Reg/RegSeller'

function App() {
  return (
    <>
    <BrowserRouter>
      <AuthProvider>
          <Header />
          <Routes>
            <Route path="/" index element={<Main />} />
            <Route path="/loginUser" element={<Login />} />
            <Route path="/registration" element={<Registration />} />
            <Route path="/UserProfile" element={<UserProfile />} />
            <Route path="/SellerProfile/:userId" element={<SellerProfile />} />
            <Route path="/register-seller" element={<RegSeller/>} />
          </Routes>
          <FooterComponent />
        </AuthProvider>
      </BrowserRouter>
    </>
  );
}

export default App
