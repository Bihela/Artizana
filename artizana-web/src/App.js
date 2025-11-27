// src/App.js
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import SignUp from './pages/SignUp';
import NGOApplicationSuccess from './pages/NGOApplicationSuccess';
import NGOApplyForm from './pages/NGOApplyForm';


function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<SignUp />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/ngoapply" element={<NGOApplyForm />} />
        <Route path="/ngo-success" element={<NGOApplicationSuccess />} />
      </Routes>
    </Router>
  );
}

export default App;