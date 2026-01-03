// src/App.js
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Layout from './components/Layout';
import SignUp from './pages/SignUp';
import CompleteProfile from './pages/CompleteProfile';
import NGOApplicationSuccess from './pages/NGOApplicationSuccess';
import NGOApplyForm from './pages/NGOApplyForm';
import Login from './pages/Login';
import Profile from './pages/Profile';
import AddProduct from './pages/AddProduct';





function App() {
  return (
    <Router>
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<Home />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/login" element={<Login />} />
          <Route path="/complete-profile" element={<CompleteProfile />} />
          <Route path="/ngoapply" element={<NGOApplyForm />} />
          <Route path="/ngo-success" element={<NGOApplicationSuccess />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/add-product" element={<AddProduct />} />

          {/* KAN-6 role based dashboards - Temporarily showing Profile page */}
          <Route path="/buyer-dashboard" element={<Profile />} />
          <Route path="/artisan-dashboard" element={<Profile />} />
          <Route path="/ngo-dashboard" element={<Profile />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
