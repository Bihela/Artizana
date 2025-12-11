// src/App.js
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import SignUp from './pages/SignUp';
import NGOApplicationSuccess from './pages/NGOApplicationSuccess';
import NGOApplyForm from './pages/NGOApplyForm';
import Login from './pages/Login';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/login" element={<Login />} />
        <Route path="/ngoapply" element={<NGOApplyForm />} />
        <Route path="/ngo-success" element={<NGOApplicationSuccess />} />
      </Routes>
    </Router>
  );
}

export default App;
