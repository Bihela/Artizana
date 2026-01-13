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
import Carousel from './components/Carousel';
import { LanguageProvider } from './context/LanguageContext';

const CarouselDemo = () => (
  <div className="p-8 max-w-2xl mx-auto">
    <h1 className="text-2xl font-bold mb-4">Carousel Demo</h1>
    <Carousel
      images={[
        'https://images.unsplash.com/photo-1523275335684-37898b6baf30',
        'https://images.unsplash.com/photo-1505740420928-5e560c06d30e',
        'https://images.unsplash.com/photo-1542291026-7eec264c27ff'
      ]}
      autoPlay={true}
    />
  </div>
);

function App() {
  return (
    <LanguageProvider>
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

            {/* Temporary Demo Route */}
            <Route path="/demo-carousel" element={<CarouselDemo />} />

            {/* KAN-6 role based dashboards - Temporarily showing Profile page */}
            <Route path="/buyer-dashboard" element={<Profile />} />
            <Route path="/artisan-dashboard" element={<Profile />} />
            <Route path="/ngo-dashboard" element={<Profile />} />
          </Route>
        </Routes>
      </Router>
    </LanguageProvider>
  );
}

export default App;
