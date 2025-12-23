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

// TEMP placeholders for KAN-6 dashboards
const BuyerDashboard = () => <h1>Buyer Dashboard</h1>;
const ArtisanDashboard = () => <h1>Artisan Dashboard</h1>;
const NGODashboard = () => <h1>NGO Dashboard</h1>;



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

          {/* KAN-6 role based dashboards */}
          <Route path="/buyer-dashboard" element={<BuyerDashboard />} />
          <Route path="/artisan-dashboard" element={<ArtisanDashboard />} />
          <Route path="/ngo-dashboard" element={<NGODashboard />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
